/**
 * 64TEU电池动力集装箱船 — 端到端管线验证
 *
 * 使用production代码的 runAdvancedTorsionalAnalysis + runForcedVibrationAnalysis
 * 验证v3.0模态阻尼比是否产生正确的应力趋势和量级
 *
 * COMPASS基准:
 *   固有频率: 18.53, 48.11, 229.9, 254.94, 552.2 Hz
 *   1500rpm中间轴: 3.072 N/mm², 螺旋桨轴: 3.060 N/mm²
 *   最大: 3.375 / 3.351 @ ~1642 rpm
 *   结论: 无转速禁区
 */

// ---------- 直接复制核心计算逻辑 (避免ESM import问题) ----------

const PI = Math.PI;
const STRUCTURAL_DAMPING_RATIO = 0.005;

// Holzer传递矩阵法 — 残差扭矩
function calcResidualTorque(units, omega) {
  let theta = 1.0, T = 0;
  for (let i = 0; i < units.length; i++) {
    const J = units[i].inertia;
    T += omega * omega * J * theta;
    if (i < units.length - 1) {
      const c = units[i].torsionalFlexibility;
      if (c > 0) {
        theta -= c * 1e-10 * T;
      }
    }
  }
  return T;
}

// 二分法求零点
function bisect(units, fLow, fHigh, tol = 0.001, maxIter = 50) {
  let low = fLow, high = fHigh;
  for (let i = 0; i < maxIter; i++) {
    const mid = (low + high) / 2;
    const rMid = calcResidualTorque(units, 2 * PI * mid);
    const rLow = calcResidualTorque(units, 2 * PI * low);
    if (Math.abs(rMid) < 1e-6 || (high - low) < tol) return mid;
    if (rMid * rLow < 0) high = mid;
    else low = mid;
  }
  return (low + high) / 2;
}

// 扫频求固有频率
function solveFrequencies(units, fMin, fMax, numModes, step = 0.1) {
  const freqs = [];
  let prevR = calcResidualTorque(units, 2 * PI * fMin);
  for (let f = fMin + step; f <= fMax && freqs.length < numModes; f += step) {
    const r = calcResidualTorque(units, 2 * PI * f);
    if (prevR * r < 0) {
      freqs.push(bisect(units, f - step, f));
    }
    prevR = r;
  }
  return freqs;
}

// Holzer振型
function calcModeShape(units, freq) {
  const omega = 2 * PI * freq;
  const n = units.length;
  const phi = new Array(n);
  let theta = 1.0, T = 0;
  for (let i = 0; i < n; i++) {
    phi[i] = theta;
    T += omega * omega * units[i].inertia * theta;
    if (i < n - 1) {
      const c = units[i].torsionalFlexibility;
      if (c > 0) theta -= c * 1e-10 * T;
    }
  }
  const maxAbs = Math.max(...phi.map(Math.abs));
  return phi.map(v => v / maxAbs);
}

// 模态阻尼比 (模态应变能法)
function calcModalDamping(units, modes, eta, dp) {
  const n = units.length;

  // 弹性段
  const segs = [];
  for (let i = 0; i < n - 1; i++) {
    const c = units[i].torsionalFlexibility;
    if (c > 0) {
      segs.push({
        idx: i,
        K: 1 / (c * 1e-10),
        isCoupling: units[i].type === 'coupling'
      });
    }
  }

  const propIdx = n - 1;
  const propSpeedRatio = units[propIdx].speedRatio || 1;
  const dpEquiv = dp / (propSpeedRatio * propSpeedRatio);

  return modes.map(mode => {
    const { phi, omega } = mode;
    if (!phi || phi.length < 2 || omega <= 0) return STRUCTURAL_DAMPING_RATIO;

    let Ut = 0, Uc = 0;
    for (const seg of segs) {
      if (seg.idx >= phi.length || seg.idx + 1 >= phi.length) continue;
      const dp2 = phi[seg.idx] - phi[seg.idx + 1];
      const U = 0.5 * seg.K * dp2 * dp2;
      Ut += U;
      if (seg.isCoupling) Uc += U;
    }

    const zetaC = (eta > 0 && Ut > 0) ? eta * Uc / (2 * Ut) : 0;

    let Mr = 0;
    for (let i = 0; i < n; i++) Mr += units[i].inertia * phi[i] * phi[i];
    if (Mr <= 0) Mr = 1;

    const phiP = phi[propIdx];
    const zetaP = dpEquiv * phiP * phiP / (2 * omega * Mr);

    return Math.max(0.001, Math.min(STRUCTURAL_DAMPING_RATIO + zetaC + zetaP, 2.0));
  });
}

// 强迫响应 (模态叠加)
function calcForcedResponse(units, modes, excTorques, excFreq, dampingRatios) {
  const omegaExc = 2 * PI * excFreq;
  const n = units.length;
  const resp = new Array(n).fill(0);

  for (let mi = 0; mi < modes.length; mi++) {
    const { phi, omega } = modes[mi];
    const zeta = dampingRatios[mi];

    let Mr = 0;
    for (let i = 0; i < n; i++) Mr += units[i].inertia * phi[i] * phi[i];
    if (Mr <= 0) Mr = 1;

    let Fr = 0;
    for (let i = 0; i < n; i++) Fr += phi[i] * excTorques[i];

    const r = omegaExc / omega;
    const H = 1 / Math.sqrt(Math.pow(1 - r*r, 2) + Math.pow(2*zeta*r, 2));
    const modal = Fr * H / (omega * omega * Mr);

    for (let i = 0; i < n; i++) resp[i] += phi[i] * modal;
  }

  return resp;
}

// 应力计算
function calcStress(torque, diameter_mm) {
  const d = diameter_mm / 1000;
  const Wp = PI * Math.pow(d, 4) / (16 * d);
  return Math.abs(torque / Wp / 1e6);
}

// ============================================================
// 64TEU COMPASS 系统定义
// ============================================================

const UNITS = [
  { unitNumber: 1, name: '电机转子',    type: 'motor',    speedRatio: 1.0,   inertia: 1.350,  torsionalFlexibility: 5434.78,   outerDiameter: 80,  innerDiameter: 0 },
  { unitNumber: 2, name: '联轴器',      type: 'coupling', speedRatio: 1.0,   inertia: 1.540,  torsionalFlexibility: 389105.06, outerDiameter: 0,   innerDiameter: 0 },
  { unitNumber: 3, name: '齿轮箱输入',  type: 'gear',     speedRatio: 1.0,   inertia: 0.3436, torsionalFlexibility: 7677.54,   outerDiameter: 0,   innerDiameter: 0 },
  { unitNumber: 4, name: '主动齿轮',    type: 'gear',     speedRatio: 1.0,   inertia: 0.0282, torsionalFlexibility: 0,         outerDiameter: 75,  innerDiameter: 0 },
  { unitNumber: 5, name: '从动齿轮',    type: 'gear',     speedRatio: 5.048, inertia: 0.1344, torsionalFlexibility: 62111.80,  outerDiameter: 0,   innerDiameter: 0 },
  { unitNumber: 6, name: '中间轴',      type: 'shaft',    speedRatio: 5.048, inertia: 0.0133, torsionalFlexibility: 60679.61,  outerDiameter: 102, innerDiameter: 0 },
  { unitNumber: 7, name: '螺旋桨轴',    type: 'shaft',    speedRatio: 5.048, inertia: 0.0481, torsionalFlexibility: 456621.00, outerDiameter: 120, innerDiameter: 0 },
  { unitNumber: 8, name: '螺旋桨',      type: 'propeller',speedRatio: 5.048, inertia: 0.9918, torsionalFlexibility: 0,         outerDiameter: 0,   innerDiameter: 0 }
];

const POWER = 249;          // kW
const RATED_SPEED = 1500;   // rpm motor
const GEAR_RATIO = 5.048;
const BLADE_COUNT = 4;
const ETA = 1.15;           // 联轴器损耗因子

// 螺旋桨激励系数
const PROP_MU = { 4: 0.06, 8: 0.02, 12: 0.008 };
// 电机激励系数
const MOTOR_MU = { 1: 0.005, 2: 0.003, 6: 0.001, 12: 0.0005 };

// COMPASS基准
const COMPASS_REF = {
  300: { is: 0.056, ps: 0.057 },
  600: { is: 0.254, ps: 0.256 },
  900: { is: 0.700, ps: 0.705 },
  1200: { is: 1.855, ps: 1.858 },
  1500: { is: 3.072, ps: 3.060 },
  1642: { is: 3.375, ps: 3.351 },
  1800: { is: 3.255, ps: 3.221 }
};

// ============================================================
// 主程序
// ============================================================

console.log('=== 64TEU端到端管线验证 (v3.0模态阻尼) ===\n');

// Step 1: 固有频率
const freqs = solveFrequencies(UNITS, 0.1, 600, 5);
console.log('固有频率:');
const compassFreqs = [18.53, 48.11, 229.9, 254.94, 552.2];
freqs.forEach((f, i) => {
  const err = compassFreqs[i] ? ((f - compassFreqs[i]) / compassFreqs[i] * 100).toFixed(2) : '?';
  console.log(`  ${i+1}阶: ${f.toFixed(2)} Hz (COMPASS: ${compassFreqs[i] || '?'}, 误差: ${err}%)`);
});

// Step 2: 振型
const modes = freqs.map(f => ({
  freq: f,
  omega: 2 * PI * f,
  phi: calcModeShape(UNITS, f)
}));

console.log('\n振型(前2阶):');
modes.slice(0, 2).forEach((m, i) => {
  console.log(`  ${i+1}阶: [${m.phi.map(v => v.toFixed(3)).join(', ')}]`);
});

// Step 3: 速度扫描
console.log('\n=== 强迫振动应力 (叶片次 + 电机各次合成) ===\n');
console.log('转速(rpm)  中间轴(N/mm²)  COMPASS   误差%    螺旋桨轴  COMPASS   判定');

const ratedPropSpeed = RATED_SPEED / GEAR_RATIO;
const dpRated = POWER * 1000 / (2 * PI * (ratedPropSpeed/60) * (ratedPropSpeed/60));

// 中间轴: segment 5 (unit 6→7), d=102mm
// 螺旋桨轴: segment 6 (unit 7→8), d=120mm
const isSegIdx = 5; // 中间轴柔度段 (units[5])
const psSegIdx = 6; // 螺旋桨轴柔度段 (units[6])
const isK = 1 / (UNITS[isSegIdx].torsionalFlexibility * 1e-10);
const psK = 1 / (UNITS[psSegIdx].torsionalFlexibility * 1e-10);

const speedPoints = [150, 300, 450, 600, 750, 900, 1050, 1200, 1350, 1500, 1642, 1800];

for (const speed of speedPoints) {
  // 螺旋桨阻尼 @ 当前转速
  const propSpeed = speed / GEAR_RATIO;
  const dp = dpRated * (propSpeed / ratedPropSpeed);

  // 模态阻尼比 (测试: 仅联轴器阻尼, 不叠加螺旋桨阻尼)
  // COMPASS "Normal (Relative)" 模式可能不单独加propeller damping
  const dampingRatios = calcModalDamping(UNITS, modes, ETA, 0); // dp=0: 不加螺旋桨阻尼

  // 各谐次应力计算 → RMS合成
  let isStresses = [];
  let psStresses = [];

  // 螺旋桨叶片次激励 (v3.0: 使用实际功率, 非额定功率)
  for (const [orderStr, mu] of Object.entries(PROP_MU)) {
    const order = parseInt(orderStr);
    const powerAtSpeed = POWER * Math.pow(speed / RATED_SPEED, 3);
    const Tmean = 9550 * powerAtSpeed / speed;
    const Texc = Tmean * mu;

    const excTorques = new Array(8).fill(0);
    excTorques[7] = Texc; // 螺旋桨端

    const excFreq = order * speed / (60 * GEAR_RATIO);
    const resp = calcForcedResponse(UNITS, modes, excTorques, excFreq, dampingRatios);

    // 中间轴
    const isDelta = Math.abs(resp[isSegIdx] - resp[isSegIdx + 1]);
    const isT = isK * isDelta * GEAR_RATIO; // 低速侧换算
    const isSigma = calcStress(isT, 102);
    isStresses.push(isSigma);

    // 螺旋桨轴
    const psDelta = Math.abs(resp[psSegIdx] - resp[psSegIdx + 1]);
    const psT = psK * psDelta * GEAR_RATIO;
    const psSigma = calcStress(psT, 120);
    psStresses.push(psSigma);
  }

  // 电机激励 (电磁谐波相对于当前运行扭矩)
  for (const [orderStr, mu] of Object.entries(MOTOR_MU)) {
    const order = parseInt(orderStr);
    const powerAtSpeed = POWER * Math.pow(speed / RATED_SPEED, 3);
    const Tmean = 9550 * powerAtSpeed / speed;
    const Texc = Tmean * mu;

    const excTorques = new Array(8).fill(0);
    excTorques[0] = Texc; // 电机端

    const excFreq = order * speed / 60;
    const resp = calcForcedResponse(UNITS, modes, excTorques, excFreq, dampingRatios);

    const isDelta = Math.abs(resp[isSegIdx] - resp[isSegIdx + 1]);
    const isT = isK * isDelta * GEAR_RATIO;
    isStresses.push(calcStress(isT, 102));

    const psDelta = Math.abs(resp[psSegIdx] - resp[psSegIdx + 1]);
    const psT = psK * psDelta * GEAR_RATIO;
    psStresses.push(calcStress(psT, 120));
  }

  // RMS合成
  const isRMS = Math.sqrt(isStresses.reduce((s, v) => s + v*v, 0));
  const psRMS = Math.sqrt(psStresses.reduce((s, v) => s + v*v, 0));

  const ref = COMPASS_REF[speed];
  const isErr = ref ? ((isRMS - ref.is) / ref.is * 100).toFixed(0) : '-';
  const psErr = ref ? ((psRMS - ref.ps) / ref.ps * 100).toFixed(0) : '-';
  const status = ref ? (Math.abs(isRMS/ref.is - 1) < 0.3 ? '  OK' : (isRMS/ref.is > 1 ? '  偏高' : '  偏低')) : '';

  console.log(
    `${String(speed).padStart(5)}     ${isRMS.toFixed(3).padStart(8)}   ${ref ? ref.is.toFixed(3).padStart(7) : '   -   '} ${String(isErr+'%').padStart(6)}   ${psRMS.toFixed(3).padStart(8)}  ${ref ? ref.ps.toFixed(3).padStart(7) : '   -   '} ${status}`
  );
}

// 阻尼比诊断 @ 1500rpm
console.log('\n=== 阻尼比诊断 @ 1500rpm ===');
const propSpd1500 = 1500 / GEAR_RATIO;
const dp1500 = dpRated * (propSpd1500 / ratedPropSpeed);
const dr1500 = calcModalDamping(UNITS, modes, ETA, dp1500);
modes.forEach((m, i) => {
  console.log(`  ${i+1}阶 (${m.freq.toFixed(1)}Hz): ζ = ${dr1500[i].toFixed(4)}, Q = ${(1/(2*dr1500[i])).toFixed(1)}`);
});

// 许用应力
const isRm = 520, psRm = 520;
const isAllow = 18 + isRm/36;
const psAllow = 18 * Math.sqrt(560/(psRm+160)) + psRm/48;
console.log(`\n许用应力: 中间轴 τc=${isAllow.toFixed(2)} N/mm², 螺旋桨轴 τc=${psAllow.toFixed(2)} N/mm²`);
console.log('COMPASS结论: 全速域安全, 无转速禁区\n');
