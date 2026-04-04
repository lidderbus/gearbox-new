const PI=Math.PI;
class C{constructor(r,i=0){this.r=r;this.i=i;}add(b){return new C(this.r+b.r,this.i+b.i);}sub(b){return new C(this.r-b.r,this.i-b.i);}mul(b){return new C(this.r*b.r-this.i*b.i,this.r*b.i+this.i*b.r);}div(b){const d=b.r*b.r+b.i*b.i;return new C((this.r*b.r+this.i*b.i)/d,(this.i*b.r-this.r*b.i)/d);}abs(){return Math.sqrt(this.r*this.r+this.i*this.i);}neg(){return new C(-this.r,-this.i);}}
const c0=new C(0),c1=new C(1);
const mm=(A,B)=>[[A[0][0].mul(B[0][0]).add(A[0][1].mul(B[1][0])),A[0][0].mul(B[0][1]).add(A[0][1].mul(B[1][1]))],[A[1][0].mul(B[0][0]).add(A[1][1].mul(B[1][0])),A[1][0].mul(B[0][1]).add(A[1][1].mul(B[1][1]))]];
const mv=(M,v)=>[M[0][0].mul(v[0]).add(M[0][1].mul(v[1])),M[1][0].mul(v[0]).add(M[1][1].mul(v[1]))];
const U=[{J:1.35,c:5434.7826,d:80,sr:1,t:'coupling_adj'},{J:1.54,c:389105.0584,d:0,sr:1,t:'coupling'},{J:0.3436,c:7677.5432,d:75,sr:1,t:'s'},{J:0.0282,c:0,d:0,sr:1,t:'g'},{J:0.1344,c:62111.8012,d:102,sr:5.048,t:'g'},{J:0.0133,c:60679.6117,d:120,sr:5.048,t:'s'},{J:0.0481,c:456621.0046,d:120,sr:5.048,t:'s'},{J:0.9918,c:0,d:0,sr:5.048,t:'p'}];
const N=8,IR=5.048,PW=249,NR=1500,Z=4,T0=9550*PW/NR;
const nrps=NR/IR/60,dpR=PW*1000/(2*PI*nrps*nrps),dpEqR=dpR/(IR*IR);

function solve(speed,excOrd,excIdx,Texc,eta){
  const w=2*PI*excOrd*speed/60;if(w<0.01)return Array(N).fill(c0);
  const w2=w*w,dpEq=dpEqR*(speed/NR);
  let M=[[c1,c0],[c0,c1]],v=[c0,c0];
  for(let i=0;i<N;i++){
    let wJ=new C(w2*U[i].J);if(i===N-1)wJ=new C(w2*U[i].J,w*dpEq);
    const P=[[c1,c0],[wJ,c1]];M=mm(P,M);v=mv(P,v);
    if(i===excIdx)v[1]=v[1].add(new C(Texc));
    if(i<N-1&&U[i].c>0){
      let cc;if(U[i].t==='coupling'&&eta>0){const cs=U[i].c*1e-10,d=1+eta*eta;cc=new C(cs/d,-cs*eta/d);}
      else cc=new C(U[i].c*1e-10);
      M=mm([[c1,cc.neg()],[c0,c1]],M);v=mv([[c1,cc.neg()],[c0,c1]],v);
    }
  }
  const th1=v[1].neg().div(M[1][0]);
  const amps=[];let th=th1,T=c0;
  for(let i=0;i<N;i++){
    amps.push(th);let wJ=new C(w2*U[i].J);if(i===N-1)wJ=new C(w2*U[i].J,w*dpEq);
    T=T.add(wJ.mul(th));if(i===excIdx)T=T.add(new C(Texc));
    if(i<N-1&&U[i].c>0){let cc;if(U[i].t==='coupling'&&eta>0){const cs=U[i].c*1e-10,d=1+eta*eta;cc=new C(cs/d,-cs*eta/d);}else cc=new C(U[i].c*1e-10);th=th.sub(cc.mul(T));}
  }
  return amps;
}

function compute(speed,eta,mu){
  const sf=(speed/NR)**2;
  const mh={1:0.005,2:0.003,6:0.001,12:0.0005};
  const ph={[Z]:mu,[2*Z]:mu*0.333,[3*Z]:mu*0.133};
  const shaftS={};for(let i=0;i<N-1;i++)if(U[i].c>0)shaftS[i]=[];
  let a1sq=0;
  for(const[o,m]of Object.entries(mh)){
    const q=Number(o),Tx=T0*m*sf;
    const a=solve(speed,q,0,Tx,eta);a1sq+=a[0].abs()**2;
    for(const si of Object.keys(shaftS)){const i=Number(si);const K=1/(U[i].c*1e-10);const dTh=a[i].sub(a[i+1]).abs();const Teq=K*dTh;const lo=U[i+1].sr>1;const Tr=Teq*(lo?U[i+1].sr:1);const d=U[i+1].d||U[i].d;if(d>0){const Wp=PI*(d/1000)**3/16;shaftS[si].push(Tr/Wp/1e6);}else shaftS[si].push(0);}
  }
  let bp1=0,bpIS=0,bpPS=0;
  for(const[z,m]of Object.entries(ph)){
    const zi=Number(z),Tx=T0*m*sf,oM=zi/IR;
    const a=solve(speed,oM,N-1,Tx,eta);a1sq+=a[0].abs()**2;
    if(zi===Z){bp1=a[0].abs();bpIS=0;bpPS=0;}
    for(const si of Object.keys(shaftS)){const i=Number(si);const K=1/(U[i].c*1e-10);const dTh=a[i].sub(a[i+1]).abs();const Teq=K*dTh;const lo=U[i+1].sr>1;const Tr=Teq*(lo?U[i+1].sr:1);const d=U[i+1].d||U[i].d;if(d>0){const Wp=PI*(d/1000)**3/16;const s=Tr/Wp/1e6;shaftS[si].push(s);if(zi===Z){if(Number(si)===5)bpIS=s;if(Number(si)===6)bpPS=s;}}else shaftS[si].push(0);}
  }
  const rmsS={};for(const[si,ss]of Object.entries(shaftS))rmsS[si]=Math.sqrt(ss.reduce((a,v)=>a+v*v,0));
  return{isS:rmsS[5]||0,psS:rmsS[6]||0,amp1:Math.sqrt(a1sq)*180/PI,bp1:bp1*180/PI,bpIS,bpPS};
}

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

console.log('V6 联合优化 (IS应力 + BP振幅 + 合成振幅)');
console.log('='.repeat(70));

// 3D扫描: η, μ, 电机1次系数
const etas=[0.01,0.05,0.10,0.15,0.20,0.25,0.30,0.40,0.50,0.70,1.0,1.15];
const mus=[0.05,0.08,0.10,0.15,0.20,0.30,0.50,0.80,1.0,1.5,2.0];

let best={e:Infinity,eta:0,mu:0};

for(const eta of etas){
  for(const mu of mus){
    let sse=0;
    for(const ref of REF){
      const r=compute(ref.spd,eta,mu);
      // 权重: IS应力误差 + BP振幅误差(归一化)
      sse+=(r.isS-ref.isS)**2;
      sse+=((r.bpIS-ref.isS)/ref.isS*ref.isS)**2*0.5; // BP IS应力
    }
    const rmse=Math.sqrt(sse/REF.length);
    if(rmse<best.e){best.e=rmse;best.eta=eta;best.mu=mu;}
  }
}
console.log(`粗扫描: η=${best.eta}, μ=${best.mu}, RMSE=${best.e.toFixed(4)}`);

// 精细
let b2={...best};
for(let e=Math.max(0.01,best.eta-0.2);e<=best.eta+0.2;e+=0.02){
  for(let m=Math.max(0.01,best.mu*0.5);m<=best.mu*2;m+=best.mu*0.05){
    let sse=0;
    for(const ref of REF){const r=compute(ref.spd,e,m);sse+=(r.isS-ref.isS)**2;sse+=((r.bpIS-ref.isS)/ref.isS*ref.isS)**2*0.5;}
    const rmse=Math.sqrt(sse/REF.length);
    if(rmse<b2.e){b2.e=rmse;b2.eta=e;b2.mu=m;}
  }
}
console.log(`精细:   η=${b2.eta.toFixed(3)}, μ=${b2.mu.toFixed(4)}, RMSE=${b2.e.toFixed(4)}`);

const E=b2.eta,MU=b2.mu;
console.log(`\n▶ 最终对比 (η=${E.toFixed(3)}, μ=${MU.toFixed(4)}):`);
console.log('rpm  | 我们IS | CMP IS | 比   | 我们PS | CMP PS | 比   | No.1合成  | CMP合成  | BP amp | CMP BP');
console.log('-----|--------|--------|------|--------|--------|------|----------|---------|--------|------');
for(const ref of REF){
  const r=compute(ref.spd,E,MU);
  const ir=(r.isS/ref.isS).toFixed(2),pr=(r.psS/ref.psS).toFixed(2);
  console.log(`${ref.spd.toString().padStart(4)} | ${r.isS.toFixed(3).padStart(6)} | ${ref.isS.toFixed(3).padStart(6)} | ${ir.padStart(4)} | ${r.psS.toFixed(3).padStart(6)} | ${ref.psS.toFixed(3).padStart(6)} | ${pr.padStart(4)} | ${r.amp1.toFixed(4).padStart(8)} | ${ref.amp.toFixed(4).padStart(7)} | ${r.bp1.toFixed(4).padStart(6)} | ${ref.bp.toFixed(4)}`);
}

console.log('\n📋 最终参数:');
console.log(`  η=${E.toFixed(3)}, μ₄=${MU.toFixed(4)}, μ₈=${(MU*.333).toFixed(4)}, μ₁₂=${(MU*.133).toFixed(4)}`);
console.log(`  RMSE=${b2.e.toFixed(4)}`);
