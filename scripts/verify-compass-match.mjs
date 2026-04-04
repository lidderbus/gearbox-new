/**
 * COMPASS扭振计算验证脚本
 *
 * 用64TEU电池动力集装箱船的COMPASS输入数据，验证我们的Holzer算法
 * 目标：固有频率、振型、强迫振动应力与COMPASS报告一致
 *
 * COMPASS参考值:
 *   1st mode: 18.53 Hz (1112.1 rpm)
 *   2nd mode: 48.11 Hz (2886.6 rpm)
 */

const PI = Math.PI;

// ============================================================
// COMPASS 8质量系统输入 (已折算到高速侧)
// ============================================================
const COMPASS_UNITS = [
  { unitNumber: 1, name: '电动机(Tur.)',   type: 'motor',     speedRatio: 1.000, inertia: 1.3500, torsionalFlexibility: 5434.7826,   outerDiameter: 80,  innerDiameter: 0 },
  { unitNumber: 2, name: '弹性联轴器(F.C.)', type: 'coupling', speedRatio: 1.000, inertia: 1.5400, torsionalFlexibility: 389105.0584, outerDiameter: 0,   innerDiameter: 0, dampingCoeff: 1.15 },
  { unitNumber: 3, name: '输入轴段',        type: 'shaft',     speedRatio: 1.000, inertia: 0.3436, torsionalFlexibility: 7677.5432,   outerDiameter: 75,  innerDiameter: 0 },
  { unitNumber: 4, name: '主动齿轮(Gear)',  type: 'gear',      speedRatio: 1.000, inertia: 0.0282, torsionalFlexibility: 0,           outerDiameter: 0,   innerDiameter: 0 },
  { unitNumber: 5, name: '从动齿轮(Gear)',  type: 'gear',      speedRatio: 5.048, inertia: 0.1344, torsionalFlexibility: 62111.8012,  outerDiameter: 102, innerDiameter: 0 },
  { unitNumber: 6, name: '中间轴(I.S.)',    type: 'shaft',     speedRatio: 5.048, inertia: 0.0133, torsionalFlexibility: 60679.6117,  outerDiameter: 120, innerDiameter: 0 },
  { unitNumber: 7, name: '螺旋桨轴(P.S.)', type: 'shaft',     speedRatio: 5.048, inertia: 0.0481, torsionalFlexibility: 456621.0046, outerDiameter: 120, innerDiameter: 0 },
  { unitNumber: 8, name: '螺旋桨(Prop.)',   type: 'propeller', speedRatio: 5.048, inertia: 0.9918, torsionalFlexibility: 0,           outerDiameter: 0,   innerDiameter: 0 },
];

// COMPASS参考结果
const COMPASS_RESULTS = {
  naturalFrequencies: [
    { order: 1, frequency: 18.53,  frequencyRpm: 1112.1 },
    { order: 2, frequency: 48.11,  frequencyRpm: 2886.6 },
    { order: 3, frequency: 229.9,  frequencyRpm: 13794.09 },
    { order: 4, frequency: 254.94, frequencyRpm: 15296.2 },
    { order: 5, frequency: 552.2,  frequencyRpm: 33131.79 },
  ],
  // 1st mode振型 (COMPASS Holzer表)
  modeShape1: {
    amplitudes: [1.000, 0.990, -0.527, -0.5551, -0.5551, -0.7744, -0.9878, -2.564],
    torques_kNm: [18.31, 38.99, 36.53, 36.32, 35.31, 35.17, 34.52, null]
  },
  // 额定1500rpm强迫振动 (合成数据)
  forcedAt1500: {
    massAmplitude_deg: 0.252586,
    intermediateShaftStress: 3.072,
    propellerShaftStress: 3.060,
    gearMeshTorque_kNm: 0.204,
    couplingTorque_kNm: 0.196
  }
};

// ============================================================
// Holzer迭代法 (复制自 transferMatrixMethod.js 核心逻辑)
// ============================================================

function holzerIteration(units, frequency) {
  const omega = 2 * PI * frequency;
  const omega2 = omega * omega;
  const n = units.length;

  let theta = 1.0;
  let T = 0;

  const amplitudes = [];
  const torques = [];

  for (let i = 0; i < n; i++) {
    const J = units[i].inertia;

    // 记录当前质量振幅
    amplitudes.push(theta);

    // 惯量力矩
    const inertiaT = omega2 * J * theta;
    T = T + inertiaT;

    // 记录累积扭矩
    torques.push(T);

    // 柔度变形
    if (i < n - 1 && units[i].torsionalFlexibility > 0) {
      const c = units[i].torsionalFlexibility * 1e-10;
      theta = theta - c * T;
    }
  }

  return { amplitudes, torques, residualTorque: T };
}

function calculateResidual(units, frequency) {
  return holzerIteration(units, frequency).residualTorque;
}

function bisection(units, fLow, fHigh, tolerance = 0.001) {
  for (let i = 0; i < 100; i++) {
    if (fHigh - fLow < tolerance) break;
    const fMid = (fLow + fHigh) / 2;
    if (calculateResidual(units, fLow) * calculateResidual(units, fMid) < 0) {
      fHigh = fMid;
    } else {
      fLow = fMid;
    }
  }
  return (fLow + fHigh) / 2;
}

function solveFrequencies(units, freqMin, freqMax, numModes, step = 0.05) {
  const freqs = [];
  let prevR = null, prevF = null;

  for (let f = freqMin; f <= freqMax && freqs.length < numModes; f += step) {
    const r = calculateResidual(units, f);
    if (prevR !== null && prevR * r < 0) {
      freqs.push(bisection(units, prevF, f));
    }
    prevR = r;
    prevF = f;
  }
  return freqs;
}

// ============================================================
// 强迫振动 - 直接Holzer法 (COMPASS方法)
// ============================================================

/**
 * COMPASS使用的直接强迫振动Holzer法
 *
 * 在每个转速点, 对每个激励阶次:
 * 1. 计算所有固有模态的贡献
 * 2. 用模态叠加得到各质量的响应振幅
 * 3. 从响应振幅计算轴段应力
 */
function compassForcedVibration(units, naturalFreqs, modeShapes, speed, excitationOrders, params) {
  const { power, ratedSpeed, bladeCount, dampingRatio = 0.02 } = params;

  // 平均扭矩 (N·m) - 在电机侧
  const T_mean = 9550 * power / ratedSpeed * 1000;

  // 各谐次的响应叠加
  const n = units.length;
  const totalAmplitudes = new Array(n).fill(0);  // RMS叠加
  const bladePassAmplitudes = new Array(n).fill(0);  // 叶片次单独

  for (const order of excitationOrders) {
    const excFreq = order * speed / 60;  // 激励频率 Hz

    // 激励扭矩分布
    const excTorques = new Array(n).fill(0);

    // 电机激励 (作用在质量1)
    const motorHarmonics = { 1: 0.005, 2: 0.003, 6: 0.001, 12: 0.0005 };
    if (motorHarmonics[order] !== undefined) {
      excTorques[0] = T_mean * motorHarmonics[order];
    }

    // 螺旋桨激励 (作用在最后一个质量)
    // 4叶桨: 阶次 4, 8, 12
    const propHarmonics = { 4: 0.06, 8: 0.02, 12: 0.008 };
    if (propHarmonics[order] !== undefined) {
      // 螺旋桨扭矩按螺旋桨端速度计算
      const propSpeed = speed / 5.048; // 折算到螺旋桨端
      const T_prop = 9550 * power / propSpeed * 1000; // 螺旋桨端平均扭矩
      excTorques[n - 1] = T_prop * propHarmonics[order];
    }

    // 模态叠加法求响应
    const responseAmp = new Array(n).fill(0);

    for (let m = 0; m < naturalFreqs.length; m++) {
      const fn = naturalFreqs[m];
      const phi = modeShapes[m].amplitudes;
      const omegaN = 2 * PI * fn;
      const omegaE = 2 * PI * excFreq;

      // 广义质量
      let M_r = 0;
      for (let i = 0; i < n; i++) {
        M_r += units[i].inertia * phi[i] * phi[i];
      }

      // 广义力
      let F_r = 0;
      for (let i = 0; i < n; i++) {
        F_r += phi[i] * excTorques[i];
      }

      // 频率比
      const r = omegaE / omegaN;

      // 动力放大系数
      const H = 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * dampingRatio * r, 2));

      // 模态贡献
      const q_r = F_r * H / (omegaN * omegaN * M_r);

      for (let i = 0; i < n; i++) {
        responseAmp[i] += phi[i] * q_r;
      }
    }

    // RMS叠加
    for (let i = 0; i < n; i++) {
      totalAmplitudes[i] = Math.sqrt(totalAmplitudes[i] ** 2 + responseAmp[i] ** 2);
    }

    // 记录叶片次响应
    if (order === bladeCount) {
      for (let i = 0; i < n; i++) {
        bladePassAmplitudes[i] = Math.abs(responseAmp[i]);
      }
    }
  }

  return { totalAmplitudes, bladePassAmplitudes };
}

/**
 * 从响应振幅计算应力 (COMPASS方法)
 *
 * 关键: 应力 = 扭矩 / 截面模数
 * 扭矩 = 刚度 × 相邻质量的角位移差
 * 或: 扭矩 = (θ_i - θ_{i+1}) / c_i
 */
function calculateStressFromResponse(units, amplitudes) {
  const results = {};

  for (let i = 0; i < units.length - 1; i++) {
    if (units[i].torsionalFlexibility <= 0) continue;

    const c = units[i].torsionalFlexibility * 1e-10; // rad/N·m
    const K = 1 / c; // N·m/rad (刚度)

    const deltaTheta = Math.abs(amplitudes[i] - amplitudes[i + 1]);
    const torque = K * deltaTheta; // N·m (振动扭矩)

    const d = units[i + 1].outerDiameter || units[i].outerDiameter;
    if (d > 0) {
      const d_m = d / 1000;
      const Wp = PI * Math.pow(d_m, 3) / 16; // 实心轴极截面模数
      const stress = torque / Wp / 1e6; // Pa → N/mm²

      results[`unit${i + 1}_to_${i + 2}`] = {
        unitFrom: units[i].name,
        unitTo: units[i + 1].name,
        torque_kNm: torque / 1000,
        diameter_mm: d,
        stress_Nmm2: stress,
        deltaTheta_rad: deltaTheta
      };
    }
  }

  return results;
}

// ============================================================
// 执行验证
// ============================================================

console.log('=' .repeat(80));
console.log('COMPASS扭振计算验证 - 64TEU电池动力集装箱船');
console.log('=' .repeat(80));

// 1. 自由振动 - 固有频率验证
console.log('\n▶ 第一步: 固有频率验证');
console.log('-'.repeat(60));

const foundFreqs = solveFrequencies(COMPASS_UNITS, 0.5, 600, 5, 0.02);

console.log('阶次 | 我们的结果(Hz) | COMPASS参考(Hz) | 误差(%)');
console.log('-----|---------------|----------------|--------');

for (let i = 0; i < Math.max(foundFreqs.length, COMPASS_RESULTS.naturalFrequencies.length); i++) {
  const our = foundFreqs[i];
  const ref = COMPASS_RESULTS.naturalFrequencies[i];
  if (our && ref) {
    const err = ((our - ref.frequency) / ref.frequency * 100).toFixed(3);
    console.log(`  ${i + 1}  |    ${our.toFixed(3)}     |     ${ref.frequency.toFixed(2)}      | ${err}%`);
  } else if (our) {
    console.log(`  ${i + 1}  |    ${our.toFixed(3)}     |     (无参考)     | -`);
  } else if (ref) {
    console.log(`  ${i + 1}  |    (未找到)     |     ${ref.frequency.toFixed(2)}      | -`);
  }
}

// 2. 振型验证 (1st mode)
console.log('\n▶ 第二步: 1阶振型验证');
console.log('-'.repeat(60));

if (foundFreqs.length > 0) {
  const mode1 = holzerIteration(COMPASS_UNITS, foundFreqs[0]);

  console.log('单元 | 我们的振幅 | COMPASS振幅 | 我们的扭矩(kNm) | COMPASS扭矩(kNm)');
  console.log('-----|----------|------------|----------------|----------------');

  for (let i = 0; i < 8; i++) {
    const ourAmp = mode1.amplitudes[i]?.toFixed(4) || '-';
    const refAmp = COMPASS_RESULTS.modeShape1.amplitudes[i]?.toFixed(4) || '-';
    const ourT = (mode1.torques[i] / 1000)?.toFixed(2) || '-';
    const refT = COMPASS_RESULTS.modeShape1.torques_kNm[i]?.toFixed(2) || '-';
    console.log(`  ${i + 1}  | ${ourAmp.padStart(8)} | ${refAmp.padStart(10)} | ${ourT.padStart(14)} | ${refT.padStart(14)}`);
  }
}

// 3. 振型数据 (前2阶)
console.log('\n▶ 第三步: 前2阶完整振型');
console.log('-'.repeat(60));

const modeShapes = [];
for (let m = 0; m < Math.min(foundFreqs.length, 5); m++) {
  const mode = holzerIteration(COMPASS_UNITS, foundFreqs[m]);
  // 归一化
  const maxAmp = Math.max(...mode.amplitudes.map(Math.abs));
  const normalized = mode.amplitudes.map(a => a / maxAmp);
  modeShapes.push({ amplitudes: normalized, rawAmplitudes: mode.amplitudes, torques: mode.torques });

  if (m < 2) {
    console.log(`\n${m + 1}阶固有频率: ${foundFreqs[m].toFixed(3)} Hz (${(foundFreqs[m] * 60).toFixed(1)} rpm)`);
    console.log('单元 | 相对振幅 | 归一化振幅 | 扭矩(kNm)');
    for (let i = 0; i < 8; i++) {
      console.log(`  ${i + 1}  | ${mode.amplitudes[i].toFixed(6)} | ${normalized[i].toFixed(4)} | ${(mode.torques[i] / 1000).toFixed(2)}`);
    }
  }
}

// 4. 强迫振动验证 @1500rpm
console.log('\n▶ 第四步: 强迫振动验证 @1500rpm');
console.log('-'.repeat(60));

const excitationOrders = [1, 2, 4, 6, 8, 12]; // 电机1,2,6,12 + 螺旋桨4,8,12
const params = {
  power: 249,
  ratedSpeed: 1500,
  bladeCount: 4,
  dampingRatio: 0.02
};

const response = compassForcedVibration(
  COMPASS_UNITS, foundFreqs, modeShapes, 1500, excitationOrders, params
);

console.log('合成响应振幅 (各质量点):');
for (let i = 0; i < 8; i++) {
  const ampDeg = response.totalAmplitudes[i] * 180 / PI;
  console.log(`  单元${i + 1} (${COMPASS_UNITS[i].name}): ${response.totalAmplitudes[i].toExponential(4)} rad = ${ampDeg.toFixed(6)} deg`);
}

console.log(`\nCOMPASS参考: No.1质量振幅 = ${COMPASS_RESULTS.forcedAt1500.massAmplitude_deg} deg`);
console.log(`我们计算:     No.1质量振幅 = ${(response.totalAmplitudes[0] * 180 / PI).toFixed(6)} deg`);

// 5. 应力计算验证
console.log('\n▶ 第五步: 应力计算验证');
console.log('-'.repeat(60));

const stresses = calculateStressFromResponse(COMPASS_UNITS, response.totalAmplitudes);

for (const [key, data] of Object.entries(stresses)) {
  console.log(`${data.unitFrom} → ${data.unitTo}:`);
  console.log(`  扭矩: ${data.torque_kNm.toFixed(4)} kNm, 直径: ${data.diameter_mm}mm, 应力: ${data.stress_Nmm2.toFixed(4)} N/mm²`);
}

console.log('\nCOMPASS参考 @1500rpm:');
console.log(`  中间轴应力:   ${COMPASS_RESULTS.forcedAt1500.intermediateShaftStress} N/mm²`);
console.log(`  螺旋桨轴应力: ${COMPASS_RESULTS.forcedAt1500.propellerShaftStress} N/mm²`);
console.log(`  齿轮扭矩:     ${COMPASS_RESULTS.forcedAt1500.gearMeshTorque_kNm} kNm`);
console.log(`  联轴器扭矩:   ${COMPASS_RESULTS.forcedAt1500.couplingTorque_kNm} kNm`);

// 6. 全转速范围扫描 (匹配COMPASS输出格式)
console.log('\n▶ 第六步: 全转速范围强迫振动 (COMPASS格式)');
console.log('-'.repeat(60));

console.log('No. | 主机转速 | No.1振幅(deg) | No.6中间轴(N/mm²) | No.7螺旋桨轴(N/mm²) | No.4齿轮(kNm) | No.2联轴器(kNm)');
console.log('----|---------|-------------|------------------|--------------------|--------------|--------------');

const testSpeeds = [150, 300, 500, 750, 1000, 1112, 1200, 1337, 1500, 1642, 1800];
for (let idx = 0; idx < testSpeeds.length; idx++) {
  const spd = testSpeeds[idx];
  const resp = compassForcedVibration(COMPASS_UNITS, foundFreqs, modeShapes, spd, excitationOrders, params);
  const str = calculateStressFromResponse(COMPASS_UNITS, resp.totalAmplitudes);

  const ampDeg = resp.totalAmplitudes[0] * 180 / PI;
  // 找中间轴(unit6, idx 5→6) 和螺旋桨轴(unit7, idx 6→7)
  const isStress = str['unit6_to_7']?.stress_Nmm2 || 0;
  const psStress = str['unit7_to_8']?.stress_Nmm2 || 0;
  const gearTorque = str['unit5_to_6']?.torque_kNm || 0;
  const couplingTorque = str['unit1_to_2']?.torque_kNm || 0;

  console.log(`${(idx + 1).toString().padStart(3)} | ${spd.toString().padStart(7)} | ${ampDeg.toFixed(6).padStart(11)} | ${isStress.toFixed(3).padStart(16)} | ${psStress.toFixed(3).padStart(18)} | ${gearTorque.toFixed(3).padStart(12)} | ${couplingTorque.toFixed(3).padStart(12)}`);
}

// 7. 分析差异原因
console.log('\n▶ 第七步: 差异分析总结');
console.log('-'.repeat(60));

if (foundFreqs.length >= 2) {
  const f1err = Math.abs(foundFreqs[0] - 18.53) / 18.53 * 100;
  const f2err = Math.abs(foundFreqs[1] - 48.11) / 48.11 * 100;

  console.log(`1阶固有频率误差: ${f1err.toFixed(3)}% ${f1err < 0.5 ? '✅ 优秀' : f1err < 2 ? '⚠️ 可接受' : '❌ 需修正'}`);
  console.log(`2阶固有频率误差: ${f2err.toFixed(3)}% ${f2err < 0.5 ? '✅ 优秀' : f2err < 2 ? '⚠️ 可接受' : '❌ 需修正'}`);

  const ampDeg = response.totalAmplitudes[0] * 180 / PI;
  const ampErr = Math.abs(ampDeg - 0.252586) / 0.252586 * 100;
  console.log(`\nNo.1振幅误差: ${ampErr.toFixed(1)}% ${ampErr < 5 ? '✅' : ampErr < 20 ? '⚠️' : '❌'}`);
  console.log(`(我们: ${ampDeg.toFixed(6)} deg, COMPASS: 0.252586 deg)`);
}

console.log('\n✅ 验证完成');
