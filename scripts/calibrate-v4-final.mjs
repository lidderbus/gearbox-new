/**
 * V4 最终校准 - 全部修正
 *
 * 修正清单:
 * 1. T_mean = 9550×P/n (不×1000)
 * 2. 叶片次频率 = z × n_motor / (60 × i) ← 基于螺旋桨转速
 * 3. 螺旋桨阻尼: dp(n) = dp_rated × (n/n_rated) ← 线性而非 1/n²
 *    dp_rated = P / (2π × n_rated²)
 * 4. 复数Holzer直接法 (联轴器滞后阻尼)
 * 5. 激励扭矩 ∝ (n/n_rated)² (螺旋桨定律)
 * 6. 应力 = T_eq × i / Wp(d_actual) (低速侧需速比换算)
 */

const PI = Math.PI;

class C { // Complex number
  constructor(r, i = 0) { this.r = r; this.i = i; }
  add(b)  { return new C(this.r + b.r, this.i + b.i); }
  sub(b)  { return new C(this.r - b.r, this.i - b.i); }
  mul(b)  { return new C(this.r*b.r - this.i*b.i, this.r*b.i + this.i*b.r); }
  div(b)  { const d = b.r*b.r + b.i*b.i; return new C((this.r*b.r+this.i*b.i)/d, (this.i*b.r-this.r*b.i)/d); }
  abs()   { return Math.sqrt(this.r*this.r + this.i*this.i); }
  neg()   { return new C(-this.r, -this.i); }
}
const c0 = new C(0), c1 = new C(1);
const mm = (A,B) => [
  [A[0][0].mul(B[0][0]).add(A[0][1].mul(B[1][0])), A[0][0].mul(B[0][1]).add(A[0][1].mul(B[1][1]))],
  [A[1][0].mul(B[0][0]).add(A[1][1].mul(B[1][0])), A[1][0].mul(B[0][1]).add(A[1][1].mul(B[1][1]))]
];
const mv = (M,v) => [M[0][0].mul(v[0]).add(M[0][1].mul(v[1])), M[1][0].mul(v[0]).add(M[1][1].mul(v[1]))];

// 系统参数
const U = [
  { n:'电动机',J:1.35,c:5434.7826,d:80,sr:1,t:'motor' },
  { n:'联轴器',J:1.54,c:389105.0584,d:0,sr:1,t:'coupling' },
  { n:'输入轴',J:0.3436,c:7677.5432,d:75,sr:1,t:'shaft' },
  { n:'主动齿轮',J:0.0282,c:0,d:0,sr:1,t:'gear' },
  { n:'从动齿轮',J:0.1344,c:62111.8012,d:102,sr:5.048,t:'gear' },
  { n:'中间轴',J:0.0133,c:60679.6117,d:120,sr:5.048,t:'shaft' },
  { n:'螺旋桨轴',J:0.0481,c:456621.0046,d:120,sr:5.048,t:'shaft' },
  { n:'螺旋桨',J:0.9918,c:0,d:0,sr:5.048,t:'propeller' },
];
const N=8, I_RATIO=5.048, PW=249, NR=1500, Z=4;
const T0 = 9550*PW/NR; // 1585.35 N·m

// 螺旋桨额定阻尼
const n_prop_rated_rps = NR / I_RATIO / 60; // 4.952 rev/s
const dp_rated = PW*1000 / (2*PI*n_prop_rated_rps*n_prop_rated_rps);
// dp_eq_rated = dp_rated / i²
const dp_eq_rated = dp_rated / (I_RATIO*I_RATIO);

/**
 * 直接复数Holzer强迫振动
 */
function solve(speed, excOrderMotor, excIdx, Texc, eta) {
  const omega = 2*PI*excOrderMotor*speed/60;
  if(omega < 0.01) return Array(N).fill(c0);
  const w2 = omega*omega;

  // 螺旋桨阻尼: dp(n) = dp_rated × (n/n_rated), 折算到等效系统
  const nFrac = speed / NR;
  const dpEq = dp_eq_rated * nFrac;

  let M = [[c1,c0],[c0,c1]], v = [c0,c0];

  for(let i=0;i<N;i++){
    let w2J = new C(w2*U[i].J);
    // 螺旋桨: 加阻尼项 jω×dp
    if(i===N-1) w2J = new C(w2*U[i].J, omega*dpEq);

    const P = [[c1,c0],[w2J,c1]];
    M = mm(P,M);
    v = mv(P,v);

    if(i===excIdx) v[1] = v[1].add(new C(Texc));

    if(i<N-1 && U[i].c>0){
      let cc;
      if(U[i].t==='coupling' && eta>0){
        const cs = U[i].c*1e-10;
        const d = 1+eta*eta;
        cc = new C(cs/d, -cs*eta/d);
      } else {
        cc = new C(U[i].c*1e-10);
      }
      const F = [[c1,cc.neg()],[c0,c1]];
      M = mm(F,M);
      v = mv(F,v);
    }
  }

  const th1 = v[1].neg().div(M[1][0]);

  // 反推各振幅
  const amps = [];
  let th = th1, T = c0;

  for(let i=0;i<N;i++){
    amps.push(th);
    let w2J = new C(w2*U[i].J);
    if(i===N-1) w2J = new C(w2*U[i].J, omega*dpEq*speed/NR);
    // 修正: 使用一致的阻尼
    w2J = new C(w2*U[i].J);
    if(i===N-1) w2J = new C(w2*U[i].J, omega*dpEq);

    T = T.add(w2J.mul(th));
    if(i===excIdx) T = T.add(new C(Texc));

    if(i<N-1 && U[i].c>0){
      let cc;
      if(U[i].t==='coupling' && eta>0){
        const cs=U[i].c*1e-10, d=1+eta*eta;
        cc = new C(cs/d,-cs*eta/d);
      } else cc = new C(U[i].c*1e-10);
      th = th.sub(cc.mul(T));
    }
  }
  return amps;
}

/**
 * 全激励合成
 */
function compute(speed, eta, mu) {
  const sf = (speed/NR)**2; // 螺旋桨定律
  const rms = Array(N).fill(0);

  // 电机激励
  const mh = {1:0.005,2:0.003,6:0.001,12:0.0005};
  for(const[o,m]of Object.entries(mh)){
    const q=Number(o), T=T0*m*sf;
    const a = solve(speed, q, 0, T, eta);
    for(let i=0;i<N;i++) rms[i]=Math.sqrt(rms[i]**2+a[i].abs()**2);
  }

  // 螺旋桨激励
  const ph = {[Z]:mu, [2*Z]:mu*0.333, [3*Z]:mu*0.133};
  for(const[z,m]of Object.entries(ph)){
    const zi=Number(z), T=T0*m*sf;
    const orderMotor = zi/I_RATIO; // 叶片次→电机侧阶次
    const a = solve(speed, orderMotor, N-1, T, eta);
    for(let i=0;i<N;i++) rms[i]=Math.sqrt(rms[i]**2+a[i].abs()**2);
  }

  return rms;
}

/**
 * 应力计算
 */
function stress(rms) {
  const r = {};
  for(let i=0;i<N-1;i++){
    if(U[i].c<=0) continue;
    const K=1/(U[i].c*1e-10);
    const dTh = Math.abs(rms[i]-rms[i+1]); // RMS差
    const Teq = K*dTh;
    const lo = U[i+1].sr>1;
    const Tr = Teq*(lo?U[i+1].sr:1);
    const d = U[i+1].d||U[i].d;
    if(d>0){
      const Wp=PI*(d/1000)**3/16;
      r[i] = {s:Tr/Wp/1e6, Tr, Teq, d};
    }
  }
  return r;
}

// COMPASS参考
const REF = [
  {spd:150,isS:0.014,psS:0.014,gT:0.001,cT:0.001,amp:0.099598,bp:0.019732},
  {spd:300,isS:0.056,psS:0.057,gT:0.004,cT:0.003,amp:0.102521,bp:0.020311},
  {spd:481,isS:0.152,psS:0.154,gT:0.010,cT:0.009,amp:0.109090,bp:0.021612},
  {spd:666,isS:0.317,psS:0.321,gT:0.021,cT:0.019,amp:0.120218,bp:0.023817},
  {spd:910,isS:0.700,psS:0.705,gT:0.046,cT:0.042,amp:0.145007,bp:0.028728},
  {spd:1112,isS:1.260,psS:1.265,gT:0.082,cT:0.077,amp:0.178767,bp:0.035417},
  {spd:1337,isS:2.278,psS:2.277,gT:0.150,cT:0.142,amp:0.230166,bp:0.045599},
  {spd:1500,isS:3.072,psS:3.060,gT:0.204,cT:0.196,amp:0.252586,bp:0.050041},
  {spd:1642,isS:3.375,psS:3.351,gT:0.225,cT:0.220,amp:0.236805,bp:0.046915},
  {spd:1800,isS:3.255,psS:3.221,gT:0.218,cT:0.218,amp:0.195151,bp:0.038663},
];

// 2D参数扫描
console.log('V4 校准 (螺旋桨阻尼修正)');
console.log('='.repeat(70));

const etas=[0.05,0.10,0.15,0.20,0.25,0.30,0.35,0.40,0.50,0.60,0.80,1.0,1.15,1.5,2.0];
const mus=[0.02,0.03,0.04,0.05,0.06,0.08,0.10,0.12,0.15,0.20,0.25,0.30,0.40];

let best={e:Infinity,eta:0,mu:0};

for(const eta of etas){
  for(const mu of mus){
    let sse=0;
    for(const ref of REF){
      const r=compute(ref.spd,eta,mu);
      const s=stress(r);
      const is=s[5]?.s||0;
      sse+=(is-ref.isS)**2;
    }
    const rmse=Math.sqrt(sse/REF.length);
    if(rmse<best.e){best.e=rmse;best.eta=eta;best.mu=mu;}
  }
}
console.log(`粗扫描最佳: η=${best.eta}, μ=${best.mu}, RMSE=${best.e.toFixed(4)}`);

// 精细
let best2={...best};
for(let e=Math.max(0.01,best.eta-0.15);e<=best.eta+0.15;e+=0.01){
  for(let m=Math.max(0.005,best.mu-0.08);m<=best.mu+0.08;m+=0.005){
    let sse=0;
    for(const ref of REF){
      const r=compute(ref.spd,e,m);
      const s=stress(r);
      sse+=(s[5]?.s||0-ref.isS)**2;
    }
    const rmse=Math.sqrt(sse/REF.length);
    if(rmse<best2.e){best2.e=rmse;best2.eta=e;best2.mu=m;}
  }
}
console.log(`精细最佳: η=${best2.eta.toFixed(3)}, μ=${best2.mu.toFixed(4)}, RMSE=${best2.e.toFixed(4)}`);

// 用最佳参数输出
const E=best2.eta, MU=best2.mu;
console.log(`\n▶ η=${E.toFixed(3)}, μ=${MU.toFixed(4)} 全转速对比:`);
console.log('rpm  | 我们IS | CMP IS | 比值 | 我们PS | CMP PS | No.1(deg) | CMP(deg)');
console.log('-----|--------|--------|------|--------|--------|-----------|--------');

for(const ref of REF){
  const r=compute(ref.spd,E,MU);
  const s=stress(r);
  const isS=s[5]?.s||0, psS=s[6]?.s||0;
  const amp=r[0]*180/PI;
  const ratio=ref.isS>0?(isS/ref.isS).toFixed(2):'-';
  console.log(`${ref.spd.toString().padStart(4)} | ${isS.toFixed(3).padStart(6)} | ${ref.isS.toFixed(3).padStart(6)} | ${ratio.padStart(4)} | ${psS.toFixed(3).padStart(6)} | ${ref.psS.toFixed(3).padStart(6)} | ${amp.toFixed(4).padStart(9)} | ${ref.amp.toFixed(4).padStart(6)}`);
}

// 完整COMPASS格式输出 (55个转速点)
console.log('\n▶ 完整COMPASS格式输出 (55点):');
console.log('No. | rpm    | No.1振幅(deg) | No.6 IS(N/mm²) | No.7 PS(N/mm²)');

const compassSpeeds = REF.map(r=>r.spd);
// 添加更多转速点
for(let n=150;n<=1800;n+=50) if(!compassSpeeds.includes(n)) compassSpeeds.push(n);
compassSpeeds.sort((a,b)=>a-b);

for(let idx=0;idx<compassSpeeds.length;idx++){
  const spd=compassSpeeds[idx];
  const r=compute(spd,E,MU);
  const s=stress(r);
  const amp=r[0]*180/PI;
  const isS=s[5]?.s||0, psS=s[6]?.s||0;
  console.log(`${(idx+1).toString().padStart(3)} | ${spd.toString().padStart(6)} | ${amp.toFixed(6).padStart(13)} | ${isS.toFixed(3).padStart(14)} | ${psS.toFixed(3).padStart(14)}`);
}

// 输出校准参数
console.log('\n'+'='.repeat(70));
console.log('📋 V4最终校准参数');
console.log('='.repeat(70));
console.log(`弹性联轴器损耗因子: η = ${E.toFixed(3)}`);
console.log(`螺旋桨4叶桨系数: μ₄ = ${MU.toFixed(4)}, μ₈ = ${(MU*0.333).toFixed(4)}, μ₁₂ = ${(MU*0.133).toFixed(4)}`);
console.log(`电机谐波: 1次=0.005, 2次=0.003, 6次=0.001, 12次=0.0005`);
console.log(`螺旋桨阻尼: dp(n) = dp_rated × (n/n_rated), dp_rated = P/(2πn²_rated)`);
console.log(`  dp_rated = ${dp_rated.toFixed(1)} N·m·s/rad, dp_eq_rated = ${dp_eq_rated.toFixed(2)} N·m·s/rad`);
console.log(`频率: 电机q阶→f=q×n/60, 螺旋桨z叶→f=z×n/(60×i)`);
console.log(`扭矩: T=9550×P/n×μ×(n/n_rated)², 应力σ=T_eq×i/Wp (低速侧)`);
console.log(`RMSE = ${best2.e.toFixed(4)} N/mm²`);
