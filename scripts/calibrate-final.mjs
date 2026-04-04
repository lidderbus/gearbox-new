/**
 * 最终校准脚本 - COMPASS阻尼系数1.15精确解读
 *
 * ============ 关键发现 ============
 * 1. COMPASS叶片次IS应力 ≡ 合成IS应力 (所有转速!)
 *    → 螺旋桨激励完全主导应力, 电机激励仅贡献振幅(刚体摆动)
 *
 * 2. 从COMPASS数据反推等效阻尼:
 *    - 150rpm: IS=0.014, r=0.107 (远离共振, H≈1)
 *    - 1500rpm: IS=3.072, r=1.069 (近共振)
 *    - 归一化: H(1.069) = 3.072 / (0.014/0.01²×1) ≈ 2.19
 *    - 若粘性阻尼: ζ ≈ 0.20 (20%)
 *    - 若滞后阻尼: η ≈ 0.43
 *
 * 3. COMPASS "阻尼系数 1.15" = 动态/静态刚度比 kd/ks
 *    → 损耗因子 η = √(1.15² - 1) = 0.568
 *    这是联轴器制造商提供的标准参数
 *
 * ============ 算法 ============
 * 复数Holzer直接法:
 *   - 联轴器: c* = c_s / (1 + jη), η = √(dampCoeff² - 1)
 *   - 螺旋桨阻尼: Archer法 dp = P/(2πn²), dp(n) = dp_rated × (n/n_rated)
 *   - 边界: T₁=0, T_n=0 → θ₁ = -v[1]/U[1][0]
 */

const PI = Math.PI;

// ============================================================
// 复数类
// ============================================================
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

// ============================================================
// COMPASS系统参数
// ============================================================
const UNITS = [
  { n: '电动机',   J: 1.3500, c: 5434.7826,   d: 80,  sr: 1.000, t: 'motor' },
  { n: '联轴器',   J: 1.5400, c: 389105.0584, d: 0,   sr: 1.000, t: 'coupling', dampCoeff: 1.15 },
  { n: '输入轴',   J: 0.3436, c: 7677.5432,   d: 75,  sr: 1.000, t: 'shaft' },
  { n: '主动齿轮', J: 0.0282, c: 0,           d: 0,   sr: 1.000, t: 'gear' },
  { n: '从动齿轮', J: 0.1344, c: 62111.8012,  d: 102, sr: 5.048, t: 'gear' },
  { n: '中间轴',   J: 0.0133, c: 60679.6117,  d: 120, sr: 5.048, t: 'shaft' },
  { n: '螺旋桨轴', J: 0.0481, c: 456621.0046, d: 120, sr: 5.048, t: 'shaft' },
  { n: '螺旋桨',   J: 0.9918, c: 0,           d: 0,   sr: 5.048, t: 'propeller' },
];
const N = 8, IR = 5.048, PW = 249, NR = 1500, Z = 4;
const T0 = 9550 * PW / NR; // 1585.30 N·m

// 联轴器损耗因子: η = √(dampCoeff² - 1)
const COUPLING_ETA = Math.sqrt(1.15 * 1.15 - 1); // = 0.5679

// 螺旋桨额定阻尼 (Archer法, 螺旋桨端)
const nPropRPS = NR / IR / 60;
const dpRated = PW * 1000 / (2 * PI * nPropRPS * nPropRPS); // N·m·s/rad
const dpEqRated = dpRated / (IR * IR); // 折算到等效系统

console.log('='.repeat(70));
console.log('最终校准 - COMPASS阻尼系数精确解读');
console.log('='.repeat(70));
console.log(`联轴器阻尼系数: ${1.15} (kd/ks)`);
console.log(`→ 损耗因子 η = √(1.15²-1) = ${COUPLING_ETA.toFixed(4)}`);
console.log(`螺旋桨额定阻尼: dp_rated = ${dpRated.toFixed(1)} N·m·s/rad`);
console.log(`折算到等效系统: dp_eq = ${dpEqRated.toFixed(2)} N·m·s/rad`);

// ============================================================
// 复数Holzer直接法
// ============================================================
function solve(speed, excOrderMotor, excIdx, Texc) {
  const omega = 2 * PI * excOrderMotor * speed / 60;
  if (omega < 0.01) return Array(N).fill(c0);
  const w2 = omega * omega;

  // 螺旋桨阻尼: dp(n) = dp_rated × (n/n_rated)
  const dpEq = dpEqRated * (speed / NR);

  let M = [[c1, c0], [c0, c1]], v = [c0, c0];

  for (let i = 0; i < N; i++) {
    // 惯量矩阵 (螺旋桨带阻尼)
    let wJ = new C(w2 * UNITS[i].J);
    if (i === N - 1) wJ = new C(w2 * UNITS[i].J, omega * dpEq);

    const P = [[c1, c0], [wJ, c1]];
    M = mm(P, M); v = mv(P, v);

    // 外部激励
    if (i === excIdx) v[1] = v[1].add(new C(Texc));

    // 柔度矩阵
    if (i < N - 1 && UNITS[i].c > 0) {
      let cc;
      if (UNITS[i].t === 'coupling') {
        // 弹性联轴器: 复数柔度 c* = c_s × (1-jη)/(1+η²)
        const cs = UNITS[i].c * 1e-10;
        const eta = COUPLING_ETA;
        const denom = 1 + eta * eta;
        cc = new C(cs / denom, -cs * eta / denom);
      } else {
        cc = new C(UNITS[i].c * 1e-10);
      }
      const F = [[c1, cc.neg()], [c0, c1]];
      M = mm(F, M); v = mv(F, v);
    }
  }

  // θ₁ = -v[1] / M[1][0]
  const th1 = v[1].neg().div(M[1][0]);

  // 反推各振幅
  const amps = [];
  let th = th1, T = c0;
  for (let i = 0; i < N; i++) {
    amps.push(th);
    let wJ = new C(w2 * UNITS[i].J);
    if (i === N - 1) wJ = new C(w2 * UNITS[i].J, omega * dpEq);
    T = T.add(wJ.mul(th));
    if (i === excIdx) T = T.add(new C(Texc));
    if (i < N - 1 && UNITS[i].c > 0) {
      let cc;
      if (UNITS[i].t === 'coupling') {
        const cs = UNITS[i].c * 1e-10, eta = COUPLING_ETA;
        const denom = 1 + eta * eta;
        cc = new C(cs / denom, -cs * eta / denom);
      } else cc = new C(UNITS[i].c * 1e-10);
      th = th.sub(cc.mul(T));
    }
  }
  return amps;
}

// ============================================================
// 每谐次独立计算应力→RMS合成
// ============================================================
function computeAtSpeed(speed, propMu) {
  const sf = (speed / NR) ** 2; // 螺旋桨定律

  // 收集各轴段各谐次应力
  const segments = [];
  for (let i = 0; i < N - 1; i++) {
    if (UNITS[i].c > 0) {
      const K = 1 / (UNITS[i].c * 1e-10);
      const lo = UNITS[i + 1].sr > 1;
      const ratio = lo ? UNITS[i + 1].sr : 1;
      const d = UNITS[i + 1].d || UNITS[i].d;
      segments.push({ idx: i, K, ratio, d, stresses: [] });
    }
  }

  let amp1sq = 0; // No.1质量振幅²累积
  let bpAmp1 = 0; // 叶片次No.1振幅

  // 电机谐波
  const motorH = { 1: 0.005, 2: 0.003, 6: 0.001, 12: 0.0005 };
  for (const [o, mu] of Object.entries(motorH)) {
    const q = Number(o);
    const Texc = T0 * mu * sf;
    const amps = solve(speed, q, 0, Texc);
    amp1sq += amps[0].abs() ** 2;
    for (const seg of segments) {
      const dTh = amps[seg.idx].sub(amps[seg.idx + 1]).abs();
      const Tr = seg.K * dTh * seg.ratio;
      if (seg.d > 0) {
        const Wp = PI * (seg.d / 1000) ** 3 / 16;
        seg.stresses.push(Tr / Wp / 1e6);
      } else seg.stresses.push(0);
    }
  }

  // 螺旋桨谐波 (叶片次频率 = z × n_motor / (60 × i))
  const propH = { [Z]: propMu, [2 * Z]: propMu * 0.333, [3 * Z]: propMu * 0.133 };
  for (const [z, mu] of Object.entries(propH)) {
    const zi = Number(z);
    const Texc = T0 * mu * sf;
    const orderMotor = zi / IR; // 折算到电机侧阶次
    const amps = solve(speed, orderMotor, N - 1, Texc);
    amp1sq += amps[0].abs() ** 2;
    if (zi === Z) bpAmp1 = amps[0].abs();
    for (const seg of segments) {
      const dTh = amps[seg.idx].sub(amps[seg.idx + 1]).abs();
      const Tr = seg.K * dTh * seg.ratio;
      if (seg.d > 0) {
        const Wp = PI * (seg.d / 1000) ** 3 / 16;
        seg.stresses.push(Tr / Wp / 1e6);
      } else seg.stresses.push(0);
    }
  }

  // RMS合成
  const rmsStress = {};
  for (const seg of segments) {
    rmsStress[seg.idx] = Math.sqrt(seg.stresses.reduce((s, v) => s + v * v, 0));
  }

  return {
    isStress: rmsStress[5] || 0,   // 中间轴→螺旋桨轴
    psStress: rmsStress[6] || 0,   // 螺旋桨轴→螺旋桨
    gearTorque: rmsStress[4] || 0, // 从动齿轮段 (这里是应力, 需要换算扭矩)
    cplStress: rmsStress[0] || 0,  // 联轴器段
    amp1: Math.sqrt(amp1sq) * 180 / PI,
    bpAmp1: bpAmp1 * 180 / PI,
  };
}

// ============================================================
// COMPASS参考数据
// ============================================================
const REF = [
  { spd: 150,  isS: 0.014, psS: 0.014, amp: 0.099598, bp: 0.019732 },
  { spd: 300,  isS: 0.056, psS: 0.057, amp: 0.102521, bp: 0.020311 },
  { spd: 481,  isS: 0.152, psS: 0.154, amp: 0.109090, bp: 0.021612 },
  { spd: 666,  isS: 0.317, psS: 0.321, amp: 0.120218, bp: 0.023817 },
  { spd: 910,  isS: 0.700, psS: 0.705, amp: 0.145007, bp: 0.028728 },
  { spd: 1112, isS: 1.260, psS: 1.265, amp: 0.178767, bp: 0.035417 },
  { spd: 1337, isS: 2.278, psS: 2.277, amp: 0.230166, bp: 0.045599 },
  { spd: 1500, isS: 3.072, psS: 3.060, amp: 0.252586, bp: 0.050041 },
  { spd: 1642, isS: 3.375, psS: 3.351, amp: 0.236805, bp: 0.046915 },
  { spd: 1800, isS: 3.255, psS: 3.221, amp: 0.195151, bp: 0.038663 },
];

// ============================================================
// 校准螺旋桨激励系数
// ============================================================
console.log('\n▶ 螺旋桨系数校准 (η=0.568固定):');

// 扫描μ
const muRange = [];
for (let m = 0.01; m <= 0.50; m += 0.005) muRange.push(m);

let bestMu = 0, bestErr = Infinity;
for (const mu of muRange) {
  let sse = 0;
  for (const ref of REF) {
    const r = computeAtSpeed(ref.spd, mu);
    sse += (r.isStress - ref.isS) ** 2;
  }
  const rmse = Math.sqrt(sse / REF.length);
  if (rmse < bestErr) { bestErr = rmse; bestMu = mu; }
}

// 精细扫描
for (let m = Math.max(0.001, bestMu - 0.02); m <= bestMu + 0.02; m += 0.001) {
  let sse = 0;
  for (const ref of REF) {
    const r = computeAtSpeed(ref.spd, m);
    sse += (r.isStress - ref.isS) ** 2;
  }
  const rmse = Math.sqrt(sse / REF.length);
  if (rmse < bestErr) { bestErr = rmse; bestMu = m; }
}

console.log(`最佳螺旋桨系数: μ₄ = ${bestMu.toFixed(4)}`);
console.log(`RMSE = ${bestErr.toFixed(4)} N/mm²`);

// ============================================================
// 全转速对比
// ============================================================
const MU = bestMu;
console.log(`\n▶ 全转速对比 (η=${COUPLING_ETA.toFixed(4)}, μ=${MU.toFixed(4)}):`);
console.log('rpm  | 我们IS | CMP IS |  比值 | 我们PS | CMP PS |  比值 | BP amp  | CMP BP  | No.1合成 | CMP合成');
console.log('-----|--------|--------|------|--------|--------|------|---------|---------|----------|-------');

for (const ref of REF) {
  const r = computeAtSpeed(ref.spd, MU);
  const ir = (r.isStress / ref.isS).toFixed(2);
  const pr = (r.psStress / ref.psS).toFixed(2);
  console.log(
    `${ref.spd.toString().padStart(4)} | ` +
    `${r.isStress.toFixed(3).padStart(6)} | ${ref.isS.toFixed(3).padStart(6)} | ${ir.padStart(4)} | ` +
    `${r.psStress.toFixed(3).padStart(6)} | ${ref.psS.toFixed(3).padStart(6)} | ${pr.padStart(4)} | ` +
    `${r.bpAmp1.toFixed(4).padStart(7)} | ${ref.bp.toFixed(4).padStart(7)} | ` +
    `${r.amp1.toFixed(4).padStart(8)} | ${ref.amp.toFixed(4)}`
  );
}

// ============================================================
// 50rpm步进完整曲线
// ============================================================
console.log(`\n▶ 完整曲线 (50rpm步进):`);
console.log('rpm  | IS stress | PS stress | No.1 amp (deg)');
for (let spd = 150; spd <= 1800; spd += 50) {
  const r = computeAtSpeed(spd, MU);
  console.log(`${spd.toString().padStart(4)} | ${r.isStress.toFixed(3).padStart(9)} | ${r.psStress.toFixed(3).padStart(9)} | ${r.amp1.toFixed(6)}`);
}

// ============================================================
// 输出最终参数
// ============================================================
console.log('\n' + '='.repeat(70));
console.log('📋 COMPASS校准最终参数');
console.log('='.repeat(70));
console.log(`\n1. 弹性联轴器阻尼:`);
console.log(`   COMPASS阻尼系数 = 1.15 (kd/ks, 动态/静态刚度比)`);
console.log(`   损耗因子 η = √(1.15²-1) = ${COUPLING_ETA.toFixed(4)}`);
console.log(`   复数柔度: c* = c_static × (1-jη)/(1+η²)`);
console.log(`\n2. 螺旋桨激励系数 (4叶桨, 相对于电机额定扭矩):`);
console.log(`   叶片次(z=4): μ₄ = ${MU.toFixed(4)}`);
console.log(`   2×叶片次(z=8): μ₈ = ${(MU * 0.333).toFixed(4)}`);
console.log(`   3×叶片次(z=12): μ₁₂ = ${(MU * 0.133).toFixed(4)}`);
console.log(`\n3. 电机谐波系数: 1次=0.005, 2次=0.003, 6次=0.001, 12次=0.0005`);
console.log(`\n4. 螺旋桨阻尼: dp_rated=${dpRated.toFixed(1)} N·m·s/rad, dp(n)=dp_rated×(n/n_rated)`);
console.log(`\n5. 激励扭矩: T=T_rated×μ×(n/n_rated)², T_rated=9550×P/n=${T0.toFixed(1)} N·m`);
console.log(`\n6. 叶片次频率: f = z × n_motor / (60 × i)`);
console.log(`\nRMSE = ${bestErr.toFixed(4)} N/mm²`);
console.log(`NRMSE = ${(bestErr / 3.375 * 100).toFixed(1)}% (相对于最大应力)`);
