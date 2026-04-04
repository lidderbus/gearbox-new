/**
 * v3.1 复数Holzer直接法验证 — 64TEU COMPASS对标
 *
 * 从calibrate-final.mjs复制核心算法, 验证production移植的正确性
 */

const PI = Math.PI;

class C {
  constructor(r, i = 0) { this.r = r; this.i = i; }
  add(b) { return new C(this.r + b.r, this.i + b.i); }
  sub(b) { return new C(this.r - b.r, this.i - b.i); }
  mul(b) { return new C(this.r * b.r - this.i * b.i, this.r * b.i + this.i * b.r); }
  div(b) { const d = b.r * b.r + b.i * b.i; return new C((this.r * b.r + this.i * b.i) / d, (this.i * b.r - this.r * b.i) / d); }
  abs() { return Math.sqrt(this.r * this.r + this.i * this.i); }
  neg() { return new C(-this.r, -this.i); }
}
const c0 = new C(0), c1 = new C(1);
const mm = (A, B) => [
  [A[0][0].mul(B[0][0]).add(A[0][1].mul(B[1][0])), A[0][0].mul(B[0][1]).add(A[0][1].mul(B[1][1]))],
  [A[1][0].mul(B[0][0]).add(A[1][1].mul(B[1][0])), A[1][0].mul(B[0][1]).add(A[1][1].mul(B[1][1]))]
];
const mv = (M, v) => [M[0][0].mul(v[0]).add(M[0][1].mul(v[1])), M[1][0].mul(v[0]).add(M[1][1].mul(v[1]))];

// 系统参数
const U = [
  { J: 1.3500, c: 5434.7826,   d: 80,  sr: 1.000, t: 'motor' },
  { J: 1.5400, c: 389105.0584, d: 0,   sr: 1.000, t: 'coupling' },
  { J: 0.3436, c: 7677.5432,   d: 75,  sr: 1.000, t: 'shaft' },
  { J: 0.0282, c: 0,           d: 0,   sr: 1.000, t: 'gear' },
  { J: 0.1344, c: 62111.8012,  d: 102, sr: 5.048, t: 'gear' },
  { J: 0.0133, c: 60679.6117,  d: 120, sr: 5.048, t: 'shaft' },
  { J: 0.0481, c: 456621.0046, d: 120, sr: 5.048, t: 'shaft' },
  { J: 0.9918, c: 0,           d: 0,   sr: 5.048, t: 'propeller' }
];
const N = 8, IR = 5.048, PW = 249, NR = 1500, Z = 4;
const T0 = 9550 * PW / NR;
const ETA = Math.sqrt(1.15 * 1.15 - 1); // 0.5679
const nPropRPS = NR / IR / 60;
const dpRated = PW * 1000 / (2 * PI * nPropRPS * nPropRPS);
const dpEqRated = dpRated / (IR * IR);

function solve(speed, excOrderMotor, excIdx, Texc) {
  const omega = 2 * PI * excOrderMotor * speed / 60;
  if (omega < 0.01) return Array(N).fill(c0);
  const w2 = omega * omega;
  const dpEq = dpEqRated * (speed / NR);

  let M = [[c1, c0], [c0, c1]], v = [c0, c0];
  for (let i = 0; i < N; i++) {
    let wJ = new C(w2 * U[i].J);
    if (i === N - 1) wJ = new C(w2 * U[i].J, omega * dpEq);
    const P = [[c1, c0], [wJ, c1]];
    M = mm(P, M); v = mv(P, v);
    if (i === excIdx) v[1] = v[1].add(new C(Texc));
    if (i < N - 1 && U[i].c > 0) {
      let cc;
      if (U[i].t === 'coupling') {
        const cs = U[i].c * 1e-10, d = 1 + ETA * ETA;
        cc = new C(cs / d, -cs * ETA / d);
      } else cc = new C(U[i].c * 1e-10);
      const F = [[c1, cc.neg()], [c0, c1]];
      M = mm(F, M); v = mv(F, v);
    }
  }

  const th1 = v[1].neg().div(M[1][0]);
  const amps = [];
  let th = th1, T = c0;
  for (let i = 0; i < N; i++) {
    amps.push(th);
    let wJ = new C(w2 * U[i].J);
    if (i === N - 1) wJ = new C(w2 * U[i].J, omega * dpEq);
    T = T.add(wJ.mul(th));
    if (i === excIdx) T = T.add(new C(Texc));
    if (i < N - 1 && U[i].c > 0) {
      let cc;
      if (U[i].t === 'coupling') {
        const cs = U[i].c * 1e-10, d = 1 + ETA * ETA;
        cc = new C(cs / d, -cs * ETA / d);
      } else cc = new C(U[i].c * 1e-10);
      th = th.sub(cc.mul(T));
    }
  }
  return amps;
}

// 应力计算
function calcStress(torque, d_mm) {
  const d = d_mm / 1000;
  return Math.abs(torque / (PI * d*d*d / 16) / 1e6);
}

// COMPASS基准
const REF = {
  150:{is:0.014,ps:0.014}, 300:{is:0.056,ps:0.057}, 600:{is:0.254,ps:0.256},
  910:{is:0.700,ps:0.705}, 1112:{is:1.260,ps:1.265}, 1337:{is:2.278,ps:2.277},
  1500:{is:3.072,ps:3.060}, 1642:{is:3.375,ps:3.351}, 1800:{is:3.255,ps:3.221}
};

console.log('=== v3.1 复数Holzer直接法 — COMPASS 64TEU对标 ===');
console.log(`η = √(1.15²-1) = ${ETA.toFixed(4)}, dp_eq_rated = ${dpEqRated.toFixed(2)} N·m·s/rad\n`);
console.log('转速   中间轴   COMPASS    误差%    螺旋桨轴  COMPASS    误差%');

const speeds = [150, 300, 600, 910, 1112, 1337, 1500, 1642, 1800];
const motorH = { 1: 0.005, 2: 0.003, 6: 0.001, 12: 0.0005 };
const propMu = 0.06;
const propH = { [Z]: propMu, [2*Z]: propMu*0.333, [3*Z]: propMu*0.133 };

// 轴段
const segs = [];
for (let i = 0; i < N-1; i++) {
  if (U[i].c > 0) {
    const K = 1/(U[i].c*1e-10);
    const lo = U[i+1].sr > 1;
    const ratio = lo ? U[i+1].sr : 1;
    const d = U[i+1].d || U[i].d;
    segs.push({ idx: i, K, ratio, d });
  }
}

let totalSSE = 0, refCount = 0;

for (const speed of speeds) {
  const sf = (speed / NR) ** 2;
  const stressBySeg = segs.map(() => []);

  // 电机谐波
  for (const [o, mu] of Object.entries(motorH)) {
    const amps = solve(speed, Number(o), 0, T0 * mu * sf);
    segs.forEach((seg, si) => {
      const dTh = amps[seg.idx].sub(amps[seg.idx+1]).abs();
      const Tr = seg.K * dTh * seg.ratio;
      stressBySeg[si].push(seg.d > 0 ? calcStress(Tr, seg.d) : 0);
    });
  }

  // 螺旋桨谐波
  for (const [z, mu] of Object.entries(propH)) {
    const orderMotor = Number(z) / IR;
    const amps = solve(speed, orderMotor, N-1, T0 * mu * sf);
    segs.forEach((seg, si) => {
      const dTh = amps[seg.idx].sub(amps[seg.idx+1]).abs();
      const Tr = seg.K * dTh * seg.ratio;
      stressBySeg[si].push(seg.d > 0 ? calcStress(Tr, seg.d) : 0);
    });
  }

  // RMS
  const rmsStress = stressBySeg.map(arr => Math.sqrt(arr.reduce((s,v) => s+v*v, 0)));

  // 中间轴 = seg idx=5 (d=120), 螺旋桨轴 = seg idx=6 (d=120)
  const isSeg = segs.findIndex(s => s.idx === 5);
  const psSeg = segs.findIndex(s => s.idx === 6);
  const isStress = isSeg >= 0 ? rmsStress[isSeg] : 0;
  const psStress = psSeg >= 0 ? rmsStress[psSeg] : 0;

  const ref = REF[speed];
  const isErr = ref ? ((isStress - ref.is) / ref.is * 100).toFixed(0) : '-';
  const psErr = ref ? ((psStress - ref.ps) / ref.ps * 100).toFixed(0) : '-';

  if (ref) { totalSSE += (isStress - ref.is)**2; refCount++; }

  console.log(
    `${String(speed).padStart(5)}  ${isStress.toFixed(3).padStart(8)}  ${ref?ref.is.toFixed(3).padStart(8):'     -  '}  ${String(isErr+'%').padStart(6)}   ` +
    `${psStress.toFixed(3).padStart(8)}  ${ref?ref.ps.toFixed(3).padStart(8):'     -  '}  ${String(psErr+'%').padStart(6)}`
  );
}

console.log(`\nRMSE (中间轴) = ${Math.sqrt(totalSSE/refCount).toFixed(3)} N/mm²`);
