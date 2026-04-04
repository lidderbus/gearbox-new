/**
 * 强迫振动校准脚本
 *
 * 已验证: 固有频率5阶全部匹配COMPASS(误差<0.06%)
 * 目标: 逆向校准强迫振动，使输出与COMPASS一致
 *
 * 已知问题:
 * 1. T_mean公式: 9550×P/n 已经给出N·m, 不需要×1000
 * 2. 等效系统中螺旋桨激励需要正确的速比折算
 * 3. 应力计算需要从等效扭矩→实际扭矩的换算
 *
 * COMPASS参考 @1500rpm (blade-pass=合成):
 *   No.6 IS stress: 3.072 N/mm²
 *   No.7 PS stress: 3.060 N/mm²
 *   No.4 gear torque: 0.204 kN·m
 *   No.2 coupling torque: 0.196 kN·m
 *   No.1 amplitude (blade-pass): 0.050041 deg
 *   No.1 amplitude (combined): 0.252586 deg
 */

const PI = Math.PI;

// ============================================================
// COMPASS系统数据 (同verify脚本)
// ============================================================
const UNITS = [
  { unitNumber: 1, name: '电动机',       type: 'motor',     inertia: 1.3500, flex: 5434.7826,   d: 80,  di: 0, speedRatio: 1.000 },
  { unitNumber: 2, name: '弹性联轴器',   type: 'coupling',  inertia: 1.5400, flex: 389105.0584, d: 0,   di: 0, speedRatio: 1.000, dampingCoeff: 1.15 },
  { unitNumber: 3, name: '输入轴段',     type: 'shaft',     inertia: 0.3436, flex: 7677.5432,   d: 75,  di: 0, speedRatio: 1.000 },
  { unitNumber: 4, name: '主动齿轮',     type: 'gear',      inertia: 0.0282, flex: 0,           d: 0,   di: 0, speedRatio: 1.000 },
  { unitNumber: 5, name: '从动齿轮',     type: 'gear',      inertia: 0.1344, flex: 62111.8012,  d: 102, di: 0, speedRatio: 5.048 },
  { unitNumber: 6, name: '中间轴',       type: 'shaft',     inertia: 0.0133, flex: 60679.6117,  d: 120, di: 0, speedRatio: 5.048 },
  { unitNumber: 7, name: '螺旋桨轴',     type: 'shaft',     inertia: 0.0481, flex: 456621.0046, d: 120, di: 0, speedRatio: 5.048 },
  { unitNumber: 8, name: '螺旋桨',       type: 'propeller', inertia: 0.9918, flex: 0,           d: 0,   di: 0, speedRatio: 5.048 },
];

const SPEED_RATIO = 5.048; // 总减速比

// ============================================================
// Holzer法 (已验证正确)
// ============================================================
function holzer(units, freq) {
  const omega2 = (2 * PI * freq) ** 2;
  let theta = 1.0, T = 0;
  const amps = [], torqs = [];

  for (let i = 0; i < units.length; i++) {
    amps.push(theta);
    T += omega2 * units[i].inertia * theta;
    torqs.push(T);
    if (i < units.length - 1 && units[i].flex > 0) {
      theta -= units[i].flex * 1e-10 * T;
    }
  }
  return { amps, torqs, residual: T };
}

function solveFreqs(units, fMin, fMax, nModes) {
  const freqs = [];
  let prevR = null, prevF = null;
  for (let f = fMin; f <= fMax && freqs.length < nModes; f += 0.02) {
    const r = holzer(units, f).residual;
    if (prevR !== null && prevR * r < 0) {
      let lo = prevF, hi = f;
      for (let k = 0; k < 80; k++) {
        const mid = (lo + hi) / 2;
        if (holzer(units, lo).residual * holzer(units, mid).residual < 0) hi = mid;
        else lo = mid;
        if (hi - lo < 1e-6) break;
      }
      freqs.push((lo + hi) / 2);
    }
    prevR = r; prevF = f;
  }
  return freqs;
}

// ============================================================
// 固有频率和振型
// ============================================================
const natFreqs = solveFreqs(UNITS, 0.5, 600, 5);
const modeShapes = natFreqs.map(f => {
  const h = holzer(UNITS, f);
  return h.amps;
});

console.log('固有频率验证:');
natFreqs.forEach((f, i) => console.log(`  ${i + 1}阶: ${f.toFixed(4)} Hz (${(f * 60).toFixed(1)} rpm)`));

// ============================================================
// COMPASS直接强迫振动法 (Direct Method)
// ============================================================

/**
 * 直接Holzer强迫振动 - 模态叠加法(正确实现)
 *
 * 关键修正:
 * 1. T_mean = 9550 × P / n (N·m, 不需要×1000)
 * 2. 广义质量必须正确计算: M_r = Σ(J_i × φ_i²)
 * 3. 阻尼比需要区分: 弹性联轴器阻尼 vs 螺旋桨阻尼
 * 4. 应力计算: Holzer扭矩法
 */
function forcedVibrationModal(units, natFreqs, modeShapes, speed, params) {
  const { power, ratedSpeed, bladeCount, dampingRatio } = params;
  const n = units.length;

  // 正确的平均扭矩 (N·m) - 不需要×1000!
  const T_motor = 9550 * power / ratedSpeed; // N·m at motor speed

  // 激励阶次和系数
  // 电机: 谐波系数相对于电机平均扭矩
  const motorHarmonics = { 1: 0.005, 2: 0.003, 6: 0.001, 12: 0.0005 };
  // 螺旋桨: 4叶桨 (系数相对于平均扭矩)
  const propHarmonics = { 4: 0.06, 8: 0.02, 12: 0.008 };

  const allOrders = [...new Set([...Object.keys(motorHarmonics), ...Object.keys(propHarmonics)].map(Number))].sort((a, b) => a - b);

  // 各质量点的合成响应 (RMS)
  const combinedAmps = new Array(n).fill(0);
  const bladePassAmps = new Array(n).fill(0);

  for (const order of allOrders) {
    const excFreq = order * speed / 60; // Hz

    // 构建激励向量 (等效系统中的扭矩)
    const F = new Array(n).fill(0);

    // 电机激励 (作用在质量1)
    if (motorHarmonics[order] !== undefined) {
      F[0] = T_motor * motorHarmonics[order];
    }

    // 螺旋桨激励 (作用在最后一个质量)
    // 在等效系统中: T_exc_eq = T_motor × μ_prop
    // (因为等效系统将螺旋桨端扭矩折算到了电机端)
    if (propHarmonics[order] !== undefined) {
      F[n - 1] = T_motor * propHarmonics[order];
    }

    // 模态叠加
    const responseAmp = new Array(n).fill(0);

    for (let m = 0; m < natFreqs.length; m++) {
      const fn = natFreqs[m];
      const phi = modeShapes[m];
      const omegaN = 2 * PI * fn;
      const omegaE = 2 * PI * excFreq;

      // 广义质量 M_r = Σ(J_i × φ_i²)
      let M_r = 0;
      for (let i = 0; i < n; i++) {
        M_r += units[i].inertia * phi[i] * phi[i];
      }

      // 广义力 F_r = Σ(φ_i × F_i)
      let F_r = 0;
      for (let i = 0; i < n; i++) {
        F_r += phi[i] * F[i];
      }

      // 频率比和放大系数
      const r = omegaE / omegaN;
      const H = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * dampingRatio * r) ** 2);

      // 模态坐标响应
      const q_r = F_r * H / (omegaN * omegaN * M_r);

      // 叠加到各质量点
      for (let i = 0; i < n; i++) {
        responseAmp[i] += phi[i] * q_r;
      }
    }

    // RMS叠加
    for (let i = 0; i < n; i++) {
      combinedAmps[i] = Math.sqrt(combinedAmps[i] ** 2 + responseAmp[i] ** 2);
    }

    // 叶片次单独记录
    if (order === bladeCount) {
      for (let i = 0; i < n; i++) bladePassAmps[i] = Math.abs(responseAmp[i]);
    }
  }

  return { combinedAmps, bladePassAmps, allOrders };
}

/**
 * 从Holzer响应振幅计算应力
 *
 * 关键: 使用刚度×角位移差计算扭矩, 然后除以截面模数
 * 对于等效系统中低速侧轴段, 扭矩需要×速比换算到实际扭矩
 */
function calcStresses(units, amplitudes) {
  const result = {};

  for (let i = 0; i < units.length - 1; i++) {
    if (units[i].flex <= 0) continue;

    const c = units[i].flex * 1e-10; // 柔度 rad/N·m
    const K = 1 / c;                 // 刚度 N·m/rad

    const dTheta = Math.abs(amplitudes[i] - amplitudes[i + 1]);
    const T_eq = K * dTheta; // 等效系统中的扭矩 (N·m)

    // 判断是否在低速侧 (需要速比换算)
    const isLowSpeed = units[i + 1].speedRatio > 1;
    const ratio = isLowSpeed ? units[i + 1].speedRatio : 1;

    // 实际扭矩 = 等效扭矩 × 速比 (对低速侧)
    const T_real = T_eq * ratio;

    // 使用轴段的直径计算应力 (取相邻两个单元中有直径的那个)
    const d = units[i + 1].d || units[i].d;
    if (d > 0) {
      const d_m = d / 1000;
      const Wp = PI * d_m ** 3 / 16;
      const stress = T_real / Wp / 1e6;

      result[`${i}_${i + 1}`] = {
        from: units[i].name,
        to: units[i + 1].name,
        T_eq_kNm: T_eq / 1000,
        T_real_kNm: T_real / 1000,
        ratio,
        d_mm: d,
        stress: stress
      };
    }
  }

  return result;
}

// ============================================================
// 执行校准
// ============================================================

console.log('\n' + '='.repeat(80));
console.log('强迫振动校准 - COMPASS匹配');
console.log('='.repeat(80));

// COMPASS参考数据
const REF = {
  amp_combined_deg: 0.252586,
  amp_bladpass_deg: 0.050041,
  is_stress: 3.072,
  ps_stress: 3.060,
  gear_torque: 0.204,
  coupling_torque: 0.196
};

// 参数
const params = {
  power: 249,
  ratedSpeed: 1500,
  bladeCount: 4,
  dampingRatio: 0.02
};

// Step 1: 用当前系数计算
console.log('\n▶ Step 1: 修正后的基准计算 (T_mean不×1000)');

const resp = forcedVibrationModal(UNITS, natFreqs, modeShapes, 1500, params);
const stresses = calcStresses(UNITS, resp.combinedAmps);

console.log('\n响应振幅 (合成):');
for (let i = 0; i < 8; i++) {
  const deg = resp.combinedAmps[i] * 180 / PI;
  console.log(`  ${UNITS[i].name}: ${deg.toFixed(6)} deg`);
}

console.log(`\n叶片次振幅: ${(resp.bladePassAmps[0] * 180 / PI).toFixed(6)} deg (COMPASS: ${REF.amp_bladpass_deg} deg)`);
console.log(`合成振幅:   ${(resp.combinedAmps[0] * 180 / PI).toFixed(6)} deg (COMPASS: ${REF.amp_combined_deg} deg)`);

console.log('\n应力结果:');
for (const [key, data] of Object.entries(stresses)) {
  console.log(`  ${data.from} → ${data.to}: T_eq=${data.T_eq_kNm.toFixed(4)}kNm, T_real=${data.T_real_kNm.toFixed(4)}kNm (ratio=${data.ratio}), σ=${data.stress.toFixed(4)} N/mm²`);
}

// Step 2: 逆向求解正确的螺旋桨激励系数
console.log('\n▶ Step 2: 逆向校准螺旋桨激励系数');

// 目标: No.1叶片次振幅 = 0.050041 deg = 8.735e-4 rad
const targetAmp = REF.amp_bladpass_deg * PI / 180;

// 计算叶片次(4阶)响应的线性系数
// 响应与激励成正比, 所以: targetAmp = currentAmp * (targetCoeff / currentCoeff)
const currentBPAmp = resp.bladePassAmps[0];
const currentPropCoeff = 0.06;

if (currentBPAmp > 0) {
  const requiredCoeff = currentPropCoeff * targetAmp / currentBPAmp;
  console.log(`  当前4叶桨系数: ${currentPropCoeff}`);
  console.log(`  当前叶片次振幅: ${(currentBPAmp * 180 / PI).toFixed(6)} deg`);
  console.log(`  目标叶片次振幅: ${REF.amp_bladpass_deg} deg`);
  console.log(`  ➜ 需要的4叶桨系数: ${requiredCoeff.toFixed(6)}`);

  // Step 3: 用校准后的系数重新计算
  console.log('\n▶ Step 3: 用校准系数重新计算');

  // 修改螺旋桨系数
  const calibratedParams = { ...params };

  // 创建自定义计算
  const T_motor = 9550 * params.power / params.ratedSpeed;
  const n = UNITS.length;
  const combinedAmps2 = new Array(n).fill(0);
  const bladePassAmps2 = new Array(n).fill(0);

  // 校准后的螺旋桨系数
  const calibratedPropHarmonics = {
    4: requiredCoeff,
    8: requiredCoeff * (0.02 / 0.06),  // 保持比例关系
    12: requiredCoeff * (0.008 / 0.06)
  };

  const motorHarmonics = { 1: 0.005, 2: 0.003, 6: 0.001, 12: 0.0005 };
  const allOrders = [1, 2, 4, 6, 8, 12];

  for (const order of allOrders) {
    const excFreq = order * 1500 / 60;
    const F = new Array(n).fill(0);

    if (motorHarmonics[order] !== undefined) {
      F[0] = T_motor * motorHarmonics[order];
    }
    if (calibratedPropHarmonics[order] !== undefined) {
      F[n - 1] = T_motor * calibratedPropHarmonics[order];
    }

    const responseAmp = new Array(n).fill(0);

    for (let m = 0; m < natFreqs.length; m++) {
      const fn = natFreqs[m];
      const phi = modeShapes[m];
      const omegaN = 2 * PI * fn;
      const omegaE = 2 * PI * excFreq;

      let M_r = 0;
      for (let i = 0; i < n; i++) M_r += UNITS[i].inertia * phi[i] * phi[i];

      let F_r = 0;
      for (let i = 0; i < n; i++) F_r += phi[i] * F[i];

      const r = omegaE / omegaN;
      const H = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * params.dampingRatio * r) ** 2);
      const q_r = F_r * H / (omegaN * omegaN * M_r);

      for (let i = 0; i < n; i++) responseAmp[i] += phi[i] * q_r;
    }

    for (let i = 0; i < n; i++) {
      combinedAmps2[i] = Math.sqrt(combinedAmps2[i] ** 2 + responseAmp[i] ** 2);
    }
    if (order === 4) {
      for (let i = 0; i < n; i++) bladePassAmps2[i] = Math.abs(responseAmp[i]);
    }
  }

  const stresses2 = calcStresses(UNITS, combinedAmps2);

  console.log(`校准后叶片次No.1振幅: ${(bladePassAmps2[0] * 180 / PI).toFixed(6)} deg (目标: ${REF.amp_bladpass_deg})`);
  console.log(`校准后合成No.1振幅:   ${(combinedAmps2[0] * 180 / PI).toFixed(6)} deg (目标: ${REF.amp_combined_deg})`);

  console.log('\n校准后应力 vs COMPASS:');
  console.log('位置          | 我们的值     | COMPASS参考 | 误差%');
  console.log('-------------|------------|-----------|------');

  // 找中间轴和螺旋桨轴应力
  const isKey = Object.keys(stresses2).find(k => stresses2[k].to === '中间轴' || stresses2[k].from === '从动齿轮');
  const psKey = Object.keys(stresses2).find(k => stresses2[k].to === '螺旋桨轴' || stresses2[k].from === '中间轴');
  const ps2Key = Object.keys(stresses2).find(k => stresses2[k].to === '螺旋桨' || stresses2[k].from === '螺旋桨轴');
  const cpKey = Object.keys(stresses2).find(k => stresses2[k].to === '弹性联轴器' || stresses2[k].from === '电动机');

  for (const [key, data] of Object.entries(stresses2)) {
    console.log(`  ${data.from}→${data.to}: σ=${data.stress.toFixed(4)}, T_real=${data.T_real_kNm.toFixed(4)}kNm`);
  }

  // Step 4: 还需要校准电机谐波系数来匹配合成振幅
  console.log('\n▶ Step 4: 校准电机谐波系数');

  // 合成振幅主要由1阶电机激励决定(因为弹性联轴器隔振)
  // COMPASS合成振幅0.253 deg vs 叶片次0.050 deg
  // 差值来自电机1阶和2阶
  const ampFromMotor = Math.sqrt(REF.amp_combined_deg ** 2 - REF.amp_bladpass_deg ** 2);
  console.log(`  电机贡献振幅 (RMS去叶片次): ${ampFromMotor.toFixed(4)} deg`);
  console.log(`  (COMPASS合成 ${REF.amp_combined_deg} - 叶片次 ${REF.amp_bladpass_deg})`);

  // 1阶电机激励下No.1的响应
  const f_exc_1 = 1 * 1500 / 60; // 25 Hz
  let amp1_per_T = 0;
  for (let m = 0; m < natFreqs.length; m++) {
    const phi = modeShapes[m];
    const omegaN = 2 * PI * natFreqs[m];
    const omegaE = 2 * PI * f_exc_1;
    let M_r = 0;
    for (let i = 0; i < n; i++) M_r += UNITS[i].inertia * phi[i] * phi[i];
    const r = omegaE / omegaN;
    const H = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * params.dampingRatio * r) ** 2);
    amp1_per_T += phi[0] * phi[0] * H / (omegaN * omegaN * M_r);
  }

  const target1stAmp = ampFromMotor * PI / 180; // rad
  const required1stTorque = target1stAmp / Math.abs(amp1_per_T);
  const required1stCoeff = required1stTorque / T_motor;

  console.log(`  T_motor = ${T_motor.toFixed(2)} N·m`);
  console.log(`  1阶电机需要的扭矩: ${required1stTorque.toFixed(2)} N·m`);
  console.log(`  ➜ 1阶电机系数: ${required1stCoeff.toFixed(6)} (当前: 0.005)`);

  // Step 5: 全转速范围输出 (COMPASS格式) - 用校准系数
  console.log('\n▶ Step 5: 全转速范围 (校准后, COMPASS格式)');
  console.log('No. | r/min  | No.1振幅(deg) | No.6中间轴(N/mm²) | No.7螺旋桨轴(N/mm²) | No.4齿轮(kNm) | No.2联轴器(kNm)');
  console.log('----|--------|-------------|------------------|--------------------|--------------|--------------');

  const compassSpeeds = [150, 300, 360, 481, 666, 910, 1112, 1337, 1500, 1642, 1800];

  for (let idx = 0; idx < compassSpeeds.length; idx++) {
    const spd = compassSpeeds[idx];

    // 用校准系数
    const amps = new Array(n).fill(0);

    for (const order of allOrders) {
      const excFreq = order * spd / 60;
      const F = new Array(n).fill(0);

      if (motorHarmonics[order] !== undefined) {
        F[0] = T_motor * (order === 1 ? required1stCoeff : motorHarmonics[order]);
      }
      if (calibratedPropHarmonics[order] !== undefined) {
        F[n - 1] = T_motor * calibratedPropHarmonics[order];
      }

      const rsp = new Array(n).fill(0);
      for (let m = 0; m < natFreqs.length; m++) {
        const phi = modeShapes[m];
        const omegaN = 2 * PI * natFreqs[m];
        const omegaE = 2 * PI * excFreq;
        let M_r = 0;
        for (let i = 0; i < n; i++) M_r += UNITS[i].inertia * phi[i] * phi[i];
        let F_r = 0;
        for (let i = 0; i < n; i++) F_r += phi[i] * F[i];
        const r = omegaE / omegaN;
        const H = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * params.dampingRatio * r) ** 2);
        const q_r = F_r * H / (omegaN * omegaN * M_r);
        for (let i = 0; i < n; i++) rsp[i] += phi[i] * q_r;
      }

      for (let i = 0; i < n; i++) {
        amps[i] = Math.sqrt(amps[i] ** 2 + rsp[i] ** 2);
      }
    }

    const str = calcStresses(UNITS, amps);
    const ampDeg = amps[0] * 180 / PI;
    const isStr = str['5_6']?.stress || str['4_5']?.stress || 0;
    const psStr = str['6_7']?.stress || 0;
    const gearT = str['4_5']?.T_real_kNm || 0;
    const cpT = str['0_1']?.T_eq_kNm || 0;

    console.log(`${(idx + 1).toString().padStart(3)} | ${spd.toString().padStart(6)} | ${ampDeg.toFixed(6).padStart(11)} | ${isStr.toFixed(3).padStart(16)} | ${psStr.toFixed(3).padStart(18)} | ${gearT.toFixed(3).padStart(12)} | ${cpT.toFixed(3).padStart(12)}`);
  }

  // Step 6: 与COMPASS逐点比较
  console.log('\n▶ Step 6: COMPASS逐点对比 (关键转速)');

  const compassData = [
    { speed: 150,  amp: 0.099598, isS: 0.014, psS: 0.014, gT: 0.001, cT: 0.001 },
    { speed: 300,  amp: 0.102521, isS: 0.056, psS: 0.057, gT: 0.004, cT: 0.003 },
    { speed: 666,  amp: 0.120218, isS: 0.317, psS: 0.321, gT: 0.021, cT: 0.019 },
    { speed: 1112, amp: 0.178767, isS: 1.260, psS: 1.265, gT: 0.082, cT: 0.077 },
    { speed: 1337, amp: 0.230166, isS: 2.278, psS: 2.277, gT: 0.150, cT: 0.142 },
    { speed: 1500, amp: 0.252586, isS: 3.072, psS: 3.060, gT: 0.204, cT: 0.196 },
    { speed: 1800, amp: 0.195151, isS: 3.255, psS: 3.221, gT: 0.218, cT: 0.218 },
  ];

  console.log('\n速度(rpm) | COMPASS IS应力 | 我们IS应力 | 比值');
  for (const ref of compassData) {
    const amps = new Array(n).fill(0);
    for (const order of allOrders) {
      const excFreq = order * ref.speed / 60;
      const F = new Array(n).fill(0);
      if (motorHarmonics[order] !== undefined)
        F[0] = T_motor * (order === 1 ? required1stCoeff : motorHarmonics[order]);
      if (calibratedPropHarmonics[order] !== undefined)
        F[n - 1] = T_motor * calibratedPropHarmonics[order];

      const rsp = new Array(n).fill(0);
      for (let m = 0; m < natFreqs.length; m++) {
        const phi = modeShapes[m];
        const omegaN = 2 * PI * natFreqs[m];
        const omegaE = 2 * PI * excFreq;
        let M_r = 0;
        for (let i = 0; i < n; i++) M_r += UNITS[i].inertia * phi[i] * phi[i];
        let F_r = 0;
        for (let i = 0; i < n; i++) F_r += phi[i] * F[i];
        const r = omegaE / omegaN;
        const H = 1 / Math.sqrt((1 - r * r) ** 2 + (2 * params.dampingRatio * r) ** 2);
        const q_r = F_r * H / (omegaN * omegaN * M_r);
        for (let i = 0; i < n; i++) rsp[i] += phi[i] * q_r;
      }
      for (let i = 0; i < n; i++) amps[i] = Math.sqrt(amps[i] ** 2 + rsp[i] ** 2);
    }

    const str = calcStresses(UNITS, amps);
    const isStr = str['5_6']?.stress || 0;
    const ratio = ref.isS > 0 ? (isStr / ref.isS).toFixed(3) : '-';
    console.log(`  ${ref.speed.toString().padStart(4)}      | ${ref.isS.toFixed(3).padStart(13)} | ${isStr.toFixed(3).padStart(9)} | ${ratio}`);
  }

  // 输出最终校准参数
  console.log('\n' + '='.repeat(80));
  console.log('📋 最终校准参数');
  console.log('='.repeat(80));
  console.log(`\n电机谐波系数 (相对平均扭矩):`);
  console.log(`  1次: ${required1stCoeff.toFixed(6)} (原: 0.005)`);
  console.log(`  2次: 0.003000 (保持)`);
  console.log(`  6次: 0.001000 (保持)`);
  console.log(`  12次: 0.000500 (保持)`);
  console.log(`\n螺旋桨谐波系数 (4叶桨, 相对平均扭矩):`);
  console.log(`  4次: ${requiredCoeff.toFixed(6)} (原: 0.06)`);
  console.log(`  8次: ${(requiredCoeff * 0.02 / 0.06).toFixed(6)} (原: 0.02)`);
  console.log(`  12次: ${(requiredCoeff * 0.008 / 0.06).toFixed(6)} (原: 0.008)`);
  console.log(`\n阻尼比: ${params.dampingRatio}`);
  console.log(`T_mean公式: 9550 × P(kW) / n(rpm) → N·m (不乘1000!)`);
  console.log(`\n速比折算: 等效系统中螺旋桨激励 = T_motor × μ_prop`);
  console.log(`应力换算: T_real = T_eq × speed_ratio (对低速侧轴段)`);
}

console.log('\n✅ 校准完成');
