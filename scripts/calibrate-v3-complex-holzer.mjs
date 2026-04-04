/**
 * V3 校准 - 复数Holzer直接法 (COMPASS方法)
 *
 * 核心: COMPASS使用复数传递矩阵法计算强迫振动
 * - 弹性联轴器: 复数柔度 c* = c / (1 + jη)  (滞后阻尼)
 * - 螺旋桨阻尼: Archer法 dp = P/(2πn²)
 * - 直接求解, 不需要模态叠加
 *
 * 方程: {θ_n, T_n} = U × {θ₁, 0} + {excitation contributions}
 * 边界: T_n = 0 → 求解 θ₁
 */

// ============================================================
// 复数运算
// ============================================================
class Complex {
  constructor(re, im = 0) { this.re = re; this.im = im; }
  add(b)  { return new Complex(this.re + b.re, this.im + b.im); }
  sub(b)  { return new Complex(this.re - b.re, this.im - b.im); }
  mul(b)  { return new Complex(this.re*b.re - this.im*b.im, this.re*b.im + this.im*b.re); }
  div(b)  { const d = b.re*b.re + b.im*b.im; return new Complex((this.re*b.re+this.im*b.im)/d, (this.im*b.re-this.re*b.im)/d); }
  abs()   { return Math.sqrt(this.re*this.re + this.im*this.im); }
  neg()   { return new Complex(-this.re, -this.im); }
  scale(s){ return new Complex(this.re*s, this.im*s); }
  static fromReal(r) { return new Complex(r, 0); }
}

// 复数2x2矩阵
function cmul22(A, B) {
  return [
    [A[0][0].mul(B[0][0]).add(A[0][1].mul(B[1][0])), A[0][0].mul(B[0][1]).add(A[0][1].mul(B[1][1]))],
    [A[1][0].mul(B[0][0]).add(A[1][1].mul(B[1][0])), A[1][0].mul(B[0][1]).add(A[1][1].mul(B[1][1]))]
  ];
}

function cmulVec(M, v) {
  return [M[0][0].mul(v[0]).add(M[0][1].mul(v[1])), M[1][0].mul(v[0]).add(M[1][1].mul(v[1]))];
}

const PI = Math.PI;
const C0 = new Complex(0); const C1 = new Complex(1);

// ============================================================
// COMPASS系统
// ============================================================
const UNITS = [
  { name: '电动机',     J: 1.3500, c: 5434.7826,   d: 80,  sr: 1.000, type: 'motor' },
  { name: '弹性联轴器', J: 1.5400, c: 389105.0584, d: 0,   sr: 1.000, type: 'coupling', dampCoeff: 1.15 },
  { name: '输入轴段',   J: 0.3436, c: 7677.5432,   d: 75,  sr: 1.000, type: 'shaft' },
  { name: '主动齿轮',   J: 0.0282, c: 0,           d: 0,   sr: 1.000, type: 'gear' },
  { name: '从动齿轮',   J: 0.1344, c: 62111.8012,  d: 102, sr: 5.048, type: 'gear' },
  { name: '中间轴',     J: 0.0133, c: 60679.6117,  d: 120, sr: 5.048, type: 'shaft' },
  { name: '螺旋桨轴',   J: 0.0481, c: 456621.0046, d: 120, sr: 5.048, type: 'shaft' },
  { name: '螺旋桨',     J: 0.9918, c: 0,           d: 0,   sr: 5.048, type: 'propeller' },
];
const N = 8;
const RATIO = 5.048;
const POWER = 249; // kW
const N_RATED = 1500; // rpm
const Z = 4; // 叶片数
const T_RATED = 9550 * POWER / N_RATED; // 1585.35 N·m

// ============================================================
// 复数Holzer直接法
// ============================================================

/**
 * 直接法强迫振动
 *
 * 弹性联轴器: c_complex = c_static × 1/(1 + jη)
 *   其中 η = loss factor, 从阻尼系数推导
 *   COMPASS "阻尼系数 1.15" → 多种解释, 需要校准
 *
 * 螺旋桨阻尼: 等效粘性阻尼力矩 = dp × ω × θ
 *   dp = P / (2π × n²)  (Archer法)
 *
 * 方法:
 *   状态向量 s = {θ, T}
 *   s_n = U × s_1 + v_ext
 *   T_1 = 0, T_n = 0
 *   → θ_1 = -v_ext[1] / U[1][0]
 */
function directForcedVibration(speed, excOrder, excLocation, excTorque, couplingLossFactor, propDamping) {
  const omega = 2 * PI * excOrder * speed / 60; // 激励角频率 (rad/s)

  if (omega < 1e-6) return new Array(N).fill(0);

  // 构建复数传递矩阵
  // 从质量1到质量N的总传递矩阵 U
  // 同时累积激励贡献 v_ext

  let U = [[C1, C0], [C0, C1]]; // 单位矩阵
  let v = [C0, C0]; // 激励贡献

  const omega2 = omega * omega;

  for (let i = 0; i < N; i++) {
    const J = UNITS[i].J;

    // 惯量矩阵 P_i = [[1, 0], [ω²J, 1]]
    let w2J = new Complex(omega2 * J);

    // 螺旋桨阻尼 (在最后一个质量上)
    if (i === N - 1 && propDamping > 0) {
      // 阻尼力矩 = dp × ω × θ → 等效为复数惯量
      // (ω²J + jω×dp) × θ → P[1][0] = ω²J + jω×dp
      w2J = new Complex(omega2 * J, omega * propDamping);
    }

    const P = [[C1, C0], [w2J, C1]];

    // 更新总矩阵和激励贡献
    U = cmul22(P, U);
    v = cmulVec(P, v);

    // 添加该点的外部激励
    if (i === excLocation) {
      v[1] = v[1].add(Complex.fromReal(excTorque));
    }

    // 柔度矩阵 F_i (最后一个质量后没有)
    if (i < N - 1 && UNITS[i].c > 0) {
      let c_complex;

      if (UNITS[i].type === 'coupling' && couplingLossFactor > 0) {
        // 弹性联轴器: 滞后阻尼 → 复数柔度
        // c* = c_static / (1 + jη) = c_static × (1 - jη) / (1 + η²)
        const c_static = UNITS[i].c * 1e-10;
        const denom = 1 + couplingLossFactor * couplingLossFactor;
        c_complex = new Complex(c_static / denom, -c_static * couplingLossFactor / denom);
      } else {
        c_complex = Complex.fromReal(UNITS[i].c * 1e-10);
      }

      const F = [[C1, c_complex.neg()], [C0, C1]];
      U = cmul22(F, U);
      v = cmulVec(F, v);
    }
  }

  // 边界条件: T_1 = 0 (已满足), T_n = 0
  // s_n = U × [θ₁, 0]ᵀ + v
  // T_n = U[1][0] × θ₁ + v[1] = 0
  // θ₁ = -v[1] / U[1][0]

  const theta1 = v[1].neg().div(U[1][0]);

  // 反推各质量振幅
  const amplitudes = [];
  let theta = theta1;
  let T = C0;

  for (let i = 0; i < N; i++) {
    amplitudes.push(theta);

    const J = UNITS[i].J;
    let w2J = new Complex(omega2 * J);
    if (i === N - 1 && propDamping > 0) {
      w2J = new Complex(omega2 * J, omega * propDamping);
    }

    T = T.add(w2J.mul(theta));

    // 外部激励
    if (i === excLocation) {
      T = T.add(Complex.fromReal(excTorque));
    }

    // 柔度
    if (i < N - 1 && UNITS[i].c > 0) {
      let c_complex;
      if (UNITS[i].type === 'coupling' && couplingLossFactor > 0) {
        const c_static = UNITS[i].c * 1e-10;
        const denom = 1 + couplingLossFactor * couplingLossFactor;
        c_complex = new Complex(c_static / denom, -c_static * couplingLossFactor / denom);
      } else {
        c_complex = Complex.fromReal(UNITS[i].c * 1e-10);
      }
      theta = theta.sub(c_complex.mul(T));
    }
  }

  return amplitudes; // Complex amplitudes
}

/**
 * 从复数振幅计算应力
 */
function calcStresses(amps) {
  const results = {};
  for (let i = 0; i < N - 1; i++) {
    if (UNITS[i].c <= 0) continue;

    const K = 1 / (UNITS[i].c * 1e-10);
    const dTheta = amps[i].sub(amps[i + 1]).abs(); // |θ_i - θ_{i+1}|
    const Teq = K * dTheta;

    const isLow = UNITS[i + 1].sr > 1;
    const Treal = Teq * (isLow ? UNITS[i + 1].sr : 1);

    const d = UNITS[i + 1].d || UNITS[i].d;
    let stress = 0;
    if (d > 0) {
      const Wp = PI * (d / 1000) ** 3 / 16;
      stress = Treal / Wp / 1e6;
    }

    results[i] = { from: UNITS[i].name, to: UNITS[i + 1].name, Teq, Treal, d, stress, dTheta };
  }
  return results;
}

/**
 * 完整强迫振动 (多谐次合成)
 */
function fullForcedVibration(speed, couplingEta, propMu) {
  // 螺旋桨阻尼 (Archer法)
  const n_prop = speed / RATIO; // 螺旋桨转速 rpm
  const n_prop_rps = n_prop / 60;
  const propDamping = n_prop_rps > 0 ? (POWER * 1000) / (2 * PI * n_prop_rps * n_prop_rps) : 0;
  // 折算到等效系统: dp_eq = dp / i²
  const propDampingEq = propDamping / (RATIO * RATIO);

  // 速度比例 (螺旋桨定律)
  const speedFactor = (speed / N_RATED) ** 2;

  // 各质量RMS振幅
  const rmsAmps = new Array(N).fill(0);
  const bladePassAmps = new Array(N).fill(0);

  // 电机激励 (作用在质量0, 频率 = order × n_motor/60)
  const motorHarmonics = { 1: 0.005, 2: 0.003, 6: 0.001, 12: 0.0005 };
  for (const [order, mu] of Object.entries(motorHarmonics)) {
    const q = Number(order);
    const Texc = T_RATED * mu * speedFactor;
    // 激励阶次相对于电机转速
    const amps = directForcedVibration(speed, q, 0, Texc, couplingEta, propDampingEq);
    for (let i = 0; i < N; i++) {
      rmsAmps[i] = Math.sqrt(rmsAmps[i] ** 2 + amps[i].abs() ** 2);
    }
  }

  // 螺旋桨激励 (作用在质量N-1, 频率 = z × n_prop/60)
  const propHarmonics = { [Z]: propMu, [2*Z]: propMu * 0.333, [3*Z]: propMu * 0.133 };
  for (const [bladeOrder, mu] of Object.entries(propHarmonics)) {
    const z = Number(bladeOrder);
    const Texc = T_RATED * mu * speedFactor;
    // ★ 关键: 激励频率 = z × n_prop / 60 = z/i × n_motor / 60
    // 所以 excOrder (相对于电机转速) = z / RATIO
    const excOrderMotor = z / RATIO;
    const amps = directForcedVibration(speed, excOrderMotor, N - 1, Texc, couplingEta, propDampingEq);
    for (let i = 0; i < N; i++) {
      rmsAmps[i] = Math.sqrt(rmsAmps[i] ** 2 + amps[i].abs() ** 2);
    }
    if (z === Z) {
      for (let i = 0; i < N; i++) bladePassAmps[i] = amps[i].abs();
    }
  }

  return { rmsAmps, bladePassAmps };
}

// ============================================================
// COMPASS参考数据
// ============================================================
const COMPASS = [
  { spd: 150,  amp: 0.099598, bp: 0.019732, isS: 0.014, psS: 0.014, gT: 0.001, cT: 0.001 },
  { spd: 300,  amp: 0.102521, bp: 0.020311, isS: 0.056, psS: 0.057, gT: 0.004, cT: 0.003 },
  { spd: 481,  amp: 0.109090, bp: 0.021612, isS: 0.152, psS: 0.154, gT: 0.010, cT: 0.009 },
  { spd: 666,  amp: 0.120218, bp: 0.023817, isS: 0.317, psS: 0.321, gT: 0.021, cT: 0.019 },
  { spd: 910,  amp: 0.145007, bp: 0.028728, isS: 0.700, psS: 0.705, gT: 0.046, cT: 0.042 },
  { spd: 1112, amp: 0.178767, bp: 0.035417, isS: 1.260, psS: 1.265, gT: 0.082, cT: 0.077 },
  { spd: 1337, amp: 0.230166, bp: 0.045599, isS: 2.278, psS: 2.277, gT: 0.150, cT: 0.142 },
  { spd: 1500, amp: 0.252586, bp: 0.050041, isS: 3.072, psS: 3.060, gT: 0.204, cT: 0.196 },
  { spd: 1642, amp: 0.236805, bp: 0.046915, isS: 3.375, psS: 3.351, gT: 0.225, cT: 0.220 },
  { spd: 1800, amp: 0.195151, bp: 0.038663, isS: 3.255, psS: 3.221, gT: 0.218, cT: 0.218 },
];

// ============================================================
// 2D参数扫描: 联轴器损耗因子 η × 螺旋桨系数 μ
// ============================================================
console.log('='.repeat(80));
console.log('V3 复数Holzer直接法 - 参数扫描');
console.log('='.repeat(80));

// 扫描联轴器损耗因子和螺旋桨激励系数
const etas = [0.05, 0.10, 0.15, 0.20, 0.25, 0.30, 0.40, 0.50, 0.60, 0.80, 1.0, 1.15, 1.5];
const mus = [0.01, 0.02, 0.03, 0.04, 0.05, 0.06, 0.08, 0.10, 0.15, 0.20, 0.30];

let bestErr = Infinity, bestEta = 0, bestMu = 0;

console.log('\n▶ 2D扫描 (η × μ), 误差 = RMSE of IS stress across all speeds');

for (const eta of etas) {
  for (const mu of mus) {
    let sumSqErr = 0;
    for (const ref of COMPASS) {
      const { rmsAmps } = fullForcedVibration(ref.spd, eta, mu);
      const str = calcStresses(rmsAmps.map(a => new Complex(a)));
      const isStr = str[5]?.stress || 0;
      sumSqErr += (isStr - ref.isS) ** 2;
    }
    const rmse = Math.sqrt(sumSqErr / COMPASS.length);
    if (rmse < bestErr) {
      bestErr = rmse;
      bestEta = eta;
      bestMu = mu;
    }
  }
}

console.log(`\n最佳参数: η=${bestEta}, μ=${bestMu}, RMSE=${bestErr.toFixed(4)}`);

// 细化扫描
console.log('\n▶ 精细扫描...');
const fineEtas = [];
for (let e = Math.max(0.01, bestEta - 0.15); e <= bestEta + 0.15; e += 0.01) fineEtas.push(e);
const fineMus = [];
for (let m = Math.max(0.005, bestMu - 0.05); m <= bestMu + 0.05; m += 0.005) fineMus.push(m);

for (const eta of fineEtas) {
  for (const mu of fineMus) {
    let sumSqErr = 0;
    for (const ref of COMPASS) {
      const { rmsAmps } = fullForcedVibration(ref.spd, eta, mu);
      const str = calcStresses(rmsAmps.map(a => new Complex(a)));
      const isStr = str[5]?.stress || 0;
      sumSqErr += (isStr - ref.isS) ** 2;
    }
    const rmse = Math.sqrt(sumSqErr / COMPASS.length);
    if (rmse < bestErr) {
      bestErr = rmse;
      bestEta = eta;
      bestMu = mu;
    }
  }
}

console.log(`精细参数: η=${bestEta.toFixed(3)}, μ=${bestMu.toFixed(4)}, RMSE=${bestErr.toFixed(4)}`);

// ============================================================
// 用最佳参数输出完整结果
// ============================================================
console.log('\n▶ 最佳参数 全转速范围对比:');
console.log('rpm  | 我们IS  | CMP IS | 比值  | 我们PS  | CMP PS | 我们No.1(deg) | CMP No.1');
console.log('-----|---------|--------|-------|---------|--------|-------------|--------');

for (const ref of COMPASS) {
  const { rmsAmps, bladePassAmps } = fullForcedVibration(ref.spd, bestEta, bestMu);
  const str = calcStresses(rmsAmps.map(a => new Complex(a)));

  const isStr = str[5]?.stress || 0;
  const psStr = str[6]?.stress || 0;
  const ampDeg = rmsAmps[0] * 180 / PI;
  const isR = ref.isS > 0 ? (isStr / ref.isS).toFixed(2) : '-';

  console.log(`${ref.spd.toString().padStart(4)} | ${isStr.toFixed(3).padStart(7)} | ${ref.isS.toFixed(3).padStart(6)} | ${isR.padStart(5)} | ${psStr.toFixed(3).padStart(7)} | ${ref.psS.toFixed(3).padStart(6)} | ${ampDeg.toFixed(4).padStart(11)} | ${ref.amp.toFixed(4).padStart(6)}`);
}

// 齿轮和联轴器扭矩
console.log('\n齿轮和联轴器扭矩对比:');
console.log('rpm  | 我们齿轮T | CMP齿轮T | 我们联轴器T | CMP联轴器T');
console.log('-----|----------|----------|-----------|----------');

for (const ref of COMPASS) {
  const { rmsAmps } = fullForcedVibration(ref.spd, bestEta, bestMu);
  const str = calcStresses(rmsAmps.map(a => new Complex(a)));
  const gearT = str[4]?.Treal || 0;
  const cplT = str[0]?.Teq || 0;

  console.log(`${ref.spd.toString().padStart(4)} | ${(gearT/1000).toFixed(4).padStart(8)} | ${ref.gT.toFixed(3).padStart(8)} | ${(cplT/1000).toFixed(4).padStart(9)} | ${ref.cT.toFixed(3).padStart(8)}`);
}

// ============================================================
// 输出最终校准参数
// ============================================================
console.log('\n' + '='.repeat(80));
console.log('📋 V3 最终校准参数 (复数Holzer直接法)');
console.log('='.repeat(80));
console.log(`\n方法: 复数传递矩阵直接法 (Direct Complex Transfer Matrix)`);
console.log(`\n弹性联轴器阻尼:`);
console.log(`  损耗因子 η = ${bestEta.toFixed(3)}`);
console.log(`  复数柔度: c* = c_static / (1 + jη)`);
console.log(`  COMPASS阻尼系数 1.15 → η = ${bestEta.toFixed(3)}`);
console.log(`\n螺旋桨激励系数 (4叶桨):`);
console.log(`  叶片次(z=4): μ = ${bestMu.toFixed(4)} (相对于电机平均扭矩)`);
console.log(`  2倍叶片次(z=8): μ = ${(bestMu * 0.333).toFixed(4)}`);
console.log(`  3倍叶片次(z=12): μ = ${(bestMu * 0.133).toFixed(4)}`);
console.log(`\n螺旋桨阻尼: Archer法 dp = P/(2πn²), 折算到等效系统 dp_eq = dp/i²`);
console.log(`\n电机谐波: 1次0.005, 2次0.003, 6次0.001, 12次0.0005`);
console.log(`\n频率公式:`);
console.log(`  电机阶次q: f = q × n_motor / 60`);
console.log(`  螺旋桨叶片z: f = z × n_motor / (60 × i)`);
console.log(`\n激励扭矩: T_exc = T_rated × μ × (n/n_rated)² [螺旋桨定律]`);
console.log(`  T_rated = 9550 × P(kW) / n(rpm) = ${T_RATED.toFixed(2)} N·m`);
console.log(`\nRMSE = ${bestErr.toFixed(4)} N/mm²`);
