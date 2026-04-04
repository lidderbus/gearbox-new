/**
 * V5 最终校准 - 修正应力计算
 *
 * 核心修正: 每个谐次单独计算复数振幅差→扭矩→应力, 然后RMS合成
 * 这就是COMPASS的方法: "合成数据" = RMS(各谐次应力)
 *
 * 之前的错误: stress(|rms_A| - |rms_B|) → 丢失相位信息
 * 正确方法: rms_stress = √Σ[stress_k²], stress_k = K×|A_k - B_k|×i/Wp
 */

const PI = Math.PI;
class C {
  constructor(r,i=0){this.r=r;this.i=i;}
  add(b){return new C(this.r+b.r,this.i+b.i);}
  sub(b){return new C(this.r-b.r,this.i-b.i);}
  mul(b){return new C(this.r*b.r-this.i*b.i,this.r*b.i+this.i*b.r);}
  div(b){const d=b.r*b.r+b.i*b.i;return new C((this.r*b.r+this.i*b.i)/d,(this.i*b.r-this.r*b.i)/d);}
  abs(){return Math.sqrt(this.r*this.r+this.i*this.i);}
  neg(){return new C(-this.r,-this.i);}
}
const c0=new C(0),c1=new C(1);
const mm=(A,B)=>[[A[0][0].mul(B[0][0]).add(A[0][1].mul(B[1][0])),A[0][0].mul(B[0][1]).add(A[0][1].mul(B[1][1]))],[A[1][0].mul(B[0][0]).add(A[1][1].mul(B[1][0])),A[1][0].mul(B[0][1]).add(A[1][1].mul(B[1][1]))]];
const mv=(M,v)=>[M[0][0].mul(v[0]).add(M[0][1].mul(v[1])),M[1][0].mul(v[0]).add(M[1][1].mul(v[1]))];

const U=[
  {n:'电动机',J:1.35,c:5434.7826,d:80,sr:1,t:'motor'},
  {n:'联轴器',J:1.54,c:389105.0584,d:0,sr:1,t:'coupling'},
  {n:'输入轴',J:0.3436,c:7677.5432,d:75,sr:1,t:'shaft'},
  {n:'主动齿轮',J:0.0282,c:0,d:0,sr:1,t:'gear'},
  {n:'从动齿轮',J:0.1344,c:62111.8012,d:102,sr:5.048,t:'gear'},
  {n:'中间轴',J:0.0133,c:60679.6117,d:120,sr:5.048,t:'shaft'},
  {n:'螺旋桨轴',J:0.0481,c:456621.0046,d:120,sr:5.048,t:'shaft'},
  {n:'螺旋桨',J:0.9918,c:0,d:0,sr:5.048,t:'propeller'},
];
const N=8,IR=5.048,PW=249,NR=1500,Z=4;
const T0=9550*PW/NR;
const nrps=NR/IR/60;
const dpR=PW*1000/(2*PI*nrps*nrps);
const dpEqR=dpR/(IR*IR);

function solve(speed,excOrderMotor,excIdx,Texc,eta){
  const w=2*PI*excOrderMotor*speed/60;
  if(w<0.01)return Array(N).fill(c0);
  const w2=w*w;
  const dpEq=dpEqR*(speed/NR);
  let M=[[c1,c0],[c0,c1]],v=[c0,c0];
  for(let i=0;i<N;i++){
    let wJ=new C(w2*U[i].J);
    if(i===N-1)wJ=new C(w2*U[i].J,w*dpEq);
    const P=[[c1,c0],[wJ,c1]];
    M=mm(P,M);v=mv(P,v);
    if(i===excIdx)v[1]=v[1].add(new C(Texc));
    if(i<N-1&&U[i].c>0){
      let cc;
      if(U[i].t==='coupling'&&eta>0){
        const cs=U[i].c*1e-10,d=1+eta*eta;
        cc=new C(cs/d,-cs*eta/d);
      }else cc=new C(U[i].c*1e-10);
      const F=[[c1,cc.neg()],[c0,c1]];
      M=mm(F,M);v=mv(F,v);
    }
  }
  const th1=v[1].neg().div(M[1][0]);
  const amps=[];
  let th=th1,T=c0;
  for(let i=0;i<N;i++){
    amps.push(th);
    let wJ=new C(w2*U[i].J);
    if(i===N-1)wJ=new C(w2*U[i].J,w*dpEq*(speed/NR));
    // 修正: 一致阻尼
    wJ=new C(w2*U[i].J);
    if(i===N-1)wJ=new C(w2*U[i].J,w*dpEq);
    T=T.add(wJ.mul(th));
    if(i===excIdx)T=T.add(new C(Texc));
    if(i<N-1&&U[i].c>0){
      let cc;
      if(U[i].t==='coupling'&&eta>0){
        const cs=U[i].c*1e-10,d=1+eta*eta;
        cc=new C(cs/d,-cs*eta/d);
      }else cc=new C(U[i].c*1e-10);
      th=th.sub(cc.mul(T));
    }
  }
  return amps;
}

/**
 * ★ 正确的应力计算: 每个谐次独立算应力, 然后RMS合成
 */
function computeFull(speed,eta,mu){
  const sf=(speed/NR)**2;
  const mh={1:0.005,2:0.003,6:0.001,12:0.0005};
  const ph={[Z]:mu,[2*Z]:mu*0.333,[3*Z]:mu*0.133};

  // 每个轴段: 收集各谐次的应力
  const shaftStresses = {}; // shaftIdx → [stress1, stress2, ...]
  for(let i=0;i<N-1;i++){
    if(U[i].c>0) shaftStresses[i]=[];
  }

  const allAmps = []; // 各谐次的振幅(复数), 用于RMS合成No.1振幅

  // 电机各阶次
  for(const[o,m]of Object.entries(mh)){
    const q=Number(o),Texc=T0*m*sf;
    const amps=solve(speed,q,0,Texc,eta);
    allAmps.push(amps);
    for(const si of Object.keys(shaftStresses)){
      const i=Number(si);
      const K=1/(U[i].c*1e-10);
      const dTh=amps[i].sub(amps[i+1]).abs();
      const Teq=K*dTh;
      const lo=U[i+1].sr>1;
      const Tr=Teq*(lo?U[i+1].sr:1);
      const d=U[i+1].d||U[i].d;
      if(d>0){
        const Wp=PI*(d/1000)**3/16;
        shaftStresses[si].push(Tr/Wp/1e6);
      }else shaftStresses[si].push(0);
    }
  }

  // 螺旋桨各阶次
  for(const[z,m]of Object.entries(ph)){
    const zi=Number(z),Texc=T0*m*sf;
    const orderM=zi/IR;
    const amps=solve(speed,orderM,N-1,Texc,eta);
    allAmps.push(amps);
    for(const si of Object.keys(shaftStresses)){
      const i=Number(si);
      const K=1/(U[i].c*1e-10);
      const dTh=amps[i].sub(amps[i+1]).abs();
      const Teq=K*dTh;
      const lo=U[i+1].sr>1;
      const Tr=Teq*(lo?U[i+1].sr:1);
      const d=U[i+1].d||U[i].d;
      if(d>0){
        const Wp=PI*(d/1000)**3/16;
        shaftStresses[si].push(Tr/Wp/1e6);
      }else shaftStresses[si].push(0);
    }
  }

  // RMS合成应力
  const rmsStress={};
  for(const[si,stresses]of Object.entries(shaftStresses)){
    rmsStress[si]=Math.sqrt(stresses.reduce((s,v)=>s+v*v,0));
  }

  // RMS合成No.1振幅
  const amp1=Math.sqrt(allAmps.reduce((s,a)=>s+a[0].abs()**2,0));

  // 叶片次单独数据 (第5个谐次 = 螺旋桨4次, 索引4因为电机4个+螺旋桨第1个)
  const bpAmps = allAmps[4]; // 电机4次 + 螺旋桨第0个(Z次)
  const bpAmp1 = bpAmps ? bpAmps[0].abs() : 0;
  const bpStress = {};
  for(const si of Object.keys(shaftStresses)){
    bpStress[si] = shaftStresses[si][4] || 0; // 第5个谐次
  }

  return {rmsStress,amp1,bpAmp1,bpStress};
}

// COMPASS参考
const REF=[
  {spd:150,isS:0.014,psS:0.014,amp:0.099598,bp:0.019732},
  {spd:300,isS:0.056,psS:0.057,amp:0.102521,bp:0.020311},
  {spd:481,isS:0.152,psS:0.154,amp:0.109090,bp:0.021612},
  {spd:666,isS:0.317,psS:0.321,amp:0.120218,bp:0.023817},
  {spd:910,isS:0.700,psS:0.705,amp:0.145007,bp:0.028728},
  {spd:1112,isS:1.260,psS:1.265,amp:0.178767,bp:0.035417},
  {spd:1337,isS:2.278,psS:2.277,amp:0.230166,bp:0.045599},
  {spd:1500,isS:3.072,psS:3.060,amp:0.252586,bp:0.050041},
  {spd:1642,isS:3.375,psS:3.351,amp:0.236805,bp:0.046915},
  {spd:1800,isS:3.255,psS:3.221,amp:0.195151,bp:0.038663},
];

console.log('V5 校准 - 正确应力计算(每谐次独立→RMS合成)');
console.log('='.repeat(70));

// 参数扫描
const etas=[0.05,0.10,0.15,0.20,0.25,0.30,0.40,0.50,0.80,1.0,1.15];
const mus=[0.03,0.04,0.05,0.06,0.08,0.10,0.12,0.15,0.20,0.30,0.50];

let best={e:Infinity,eta:0,mu:0};
for(const eta of etas){
  for(const mu of mus){
    let sse=0;
    for(const ref of REF){
      const{rmsStress}=computeFull(ref.spd,eta,mu);
      const isS=rmsStress[5]||0;
      sse+=(isS-ref.isS)**2;
    }
    const rmse=Math.sqrt(sse/REF.length);
    if(rmse<best.e){best.e=rmse;best.eta=eta;best.mu=mu;}
  }
}
console.log(`粗扫描: η=${best.eta}, μ=${best.mu}, RMSE=${best.e.toFixed(4)}`);

// 精细
let b2={...best};
for(let e=Math.max(0.01,best.eta-0.2);e<=best.eta+0.2;e+=0.01){
  for(let m=Math.max(0.01,best.mu-0.1);m<=best.mu+0.1;m+=0.005){
    let sse=0;
    for(const ref of REF){
      const{rmsStress}=computeFull(ref.spd,e,m);
      sse+=((rmsStress[5]||0)-ref.isS)**2;
    }
    const rmse=Math.sqrt(sse/REF.length);
    if(rmse<b2.e){b2.e=rmse;b2.eta=e;b2.mu=m;}
  }
}
console.log(`精细:   η=${b2.eta.toFixed(3)}, μ=${b2.mu.toFixed(4)}, RMSE=${b2.e.toFixed(4)}`);

// 最佳参数输出
const E=b2.eta,MU=b2.mu;
console.log(`\n▶ 全转速对比 (η=${E.toFixed(3)}, μ=${MU.toFixed(4)}):`);
console.log('rpm  | 我们IS | CMP IS | 比值 | 我们PS | CMP PS | 比值 | No.1(deg) | CMP(deg)');
console.log('-----|--------|--------|------|--------|--------|------|-----------|--------');

for(const ref of REF){
  const{rmsStress,amp1}=computeFull(ref.spd,E,MU);
  const isS=rmsStress[5]||0,psS=rmsStress[6]||0;
  const ad=amp1*180/PI;
  const ir=ref.isS>0?(isS/ref.isS).toFixed(2):'-';
  const pr=ref.psS>0?(psS/ref.psS).toFixed(2):'-';
  console.log(`${ref.spd.toString().padStart(4)} | ${isS.toFixed(3).padStart(6)} | ${ref.isS.toFixed(3).padStart(6)} | ${ir.padStart(4)} | ${psS.toFixed(3).padStart(6)} | ${ref.psS.toFixed(3).padStart(6)} | ${pr.padStart(4)} | ${ad.toFixed(4).padStart(9)} | ${ref.amp.toFixed(4)}`);
}

// 叶片次单独数据
console.log(`\n▶ 叶片次(blade-pass)单独数据:`);
console.log('rpm  | BP IS  | CMP IS | BP PS  | CMP PS | BP No.1  | CMP BP');
for(const ref of REF){
  const{bpStress,bpAmp1}=computeFull(ref.spd,E,MU);
  const bis=bpStress[5]||0,bps=bpStress[6]||0;
  const bad=bpAmp1*180/PI;
  console.log(`${ref.spd.toString().padStart(4)} | ${bis.toFixed(3).padStart(6)} | ${ref.isS.toFixed(3).padStart(6)} | ${bps.toFixed(3).padStart(6)} | ${ref.psS.toFixed(3).padStart(6)} | ${bad.toFixed(4).padStart(8)} | ${ref.bp.toFixed(4)}`);
}

console.log('\n'+'='.repeat(70));
console.log('📋 V5 最终校准参数');
console.log('='.repeat(70));
console.log(`弹性联轴器损耗因子: η = ${E.toFixed(3)}`);
console.log(`螺旋桨系数: μ₄=${MU.toFixed(4)}, μ₈=${(MU*.333).toFixed(4)}, μ₁₂=${(MU*.133).toFixed(4)}`);
console.log(`RMSE = ${b2.e.toFixed(4)} N/mm²`);
console.log(`\n修正清单:`);
console.log(`  1. T_mean=9550×P/n (不×1000)`);
console.log(`  2. 叶片次频率=z×n/(60×i) (基于螺旋桨转速)`);
console.log(`  3. dp(n)=dp_rated×(n/n_rated) (线性阻尼)`);
console.log(`  4. 复数Holzer直接法 (联轴器滞后阻尼)`);
console.log(`  5. ★每谐次独立算应力→RMS合成 (保留相位信息)`);
console.log(`  6. 应力σ=T_eq×i/Wp (低速侧速比换算)`);
