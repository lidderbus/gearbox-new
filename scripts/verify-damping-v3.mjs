/**
 * v3.0 阻尼模型验证脚本
 *
 * 使用64TEU电池动力集装箱船COMPASS数据验证:
 * - calculateModalDampingRatios 输出
 * - 联轴器+螺旋桨阻尼对应力的影响
 *
 * COMPASS基准 (SRM09 2026-04-03):
 *   1500rpm中间轴应力: 3.072 N/mm²
 *   1500rpm螺旋桨轴应力: 3.060 N/mm²
 *   最大应力(@1642rpm): 3.375 / 3.351 N/mm²
 */

// 64TEU COMPASS 8质量系统
const COMPASS_UNITS = [
  { unitNumber: 1, name: '电机转子',     type: 'motor',    speedRatio: 1.0,   inertia: 1.350,  torsionalFlexibility: 5434.78,  outerDiameter: 80,  innerDiameter: 0 },
  { unitNumber: 2, name: '联轴器从动',   type: 'coupling', speedRatio: 1.0,   inertia: 1.540,  torsionalFlexibility: 389105.06, outerDiameter: 0,   innerDiameter: 0 },
  { unitNumber: 3, name: '齿轮箱输入',   type: 'gear',     speedRatio: 1.0,   inertia: 0.3436, torsionalFlexibility: 7677.54,  outerDiameter: 0,   innerDiameter: 0 },
  { unitNumber: 4, name: '主动齿轮',     type: 'gear',     speedRatio: 1.0,   inertia: 0.0282, torsionalFlexibility: 0,        outerDiameter: 75,  innerDiameter: 0 },
  { unitNumber: 5, name: '从动齿轮',     type: 'gear',     speedRatio: 5.048, inertia: 0.1344, torsionalFlexibility: 62111.80, outerDiameter: 0,   innerDiameter: 0 },
  { unitNumber: 6, name: '中间轴',       type: 'shaft',    speedRatio: 5.048, inertia: 0.0133, torsionalFlexibility: 60679.61, outerDiameter: 102, innerDiameter: 0 },
  { unitNumber: 7, name: '螺旋桨轴',     type: 'shaft',    speedRatio: 5.048, inertia: 0.0481, torsionalFlexibility: 456621.00, outerDiameter: 120, innerDiameter: 0 },
  { unitNumber: 8, name: '螺旋桨',       type: 'propeller',speedRatio: 5.048, inertia: 0.9918, torsionalFlexibility: 0,        outerDiameter: 0,   innerDiameter: 0 }
];

// COMPASS固有频率 (Hz)
const COMPASS_FREQUENCIES = [18.53, 48.11, 229.9, 254.94, 552.2];

// 联轴器数据 (HGTHT4)
const ELASTIC_COUPLINGS = [
  { unitNumber: 2, dampingCoefficient: 1.15, continuousAllowableTorque: 1.6, transientAllowableTorque: 6.0 }
];

// COMPASS强迫振动应力基准 (合成数据, 中间轴 No.6)
const COMPASS_STRESS_REFERENCE = {
  150: 0.014, 300: 0.056, 600: 0.254, 900: 0.700,
  1200: 1.855, 1500: 3.072, 1642: 3.375, 1800: 3.255
};

// ---- 计算验证 ----

const PI = Math.PI;

// 模拟COMPASS前5阶模态振型 (从Holzer表提取, 归一化)
const COMPASS_MODES = [
  // 1阶 18.53 Hz
  {
    omega: 2 * PI * 18.53,
    modeShape: {
      amplitudes: [1.000, 0.990, -0.527, -0.555, -0.555, -0.774, -0.988, -2.564]
        .map(v => v / 2.564) // 归一化
    }
  },
  // 2阶 48.11 Hz
  {
    omega: 2 * PI * 48.11,
    modeShape: {
      amplitudes: [1.000, 0.933, -8.975, -8.954, -8.954, -7.959, -6.929, 2.218]
        .map(v => v / 8.975)
    }
  }
];

// --- 测试 calculateModalDampingRatios 逻辑 ---

function testModalDamping() {
  console.log('=== v3.0 模态阻尼比验证 ===\n');

  const n = COMPASS_UNITS.length;
  const STRUCTURAL_DAMPING = 0.005;

  // 联轴器参数
  const eta = 1.15;
  const couplingUnitNumbers = new Set([2]);

  // 识别弹性段及联轴器段 (v3.0修正: 只检查拥有柔度的单元本身)
  const segments = [];
  for (let i = 0; i < n - 1; i++) {
    const c = COMPASS_UNITS[i].torsionalFlexibility;
    if (c > 0) {
      const K = 1 / (c * 1e-10);
      const ownerUnit = COMPASS_UNITS[i];
      const isCoupling = ownerUnit.type === 'coupling' ||
        couplingUnitNumbers.has(ownerUnit.unitNumber);
      segments.push({ idx: i, K, isCoupling });
    }
  }

  console.log('弹性段:');
  segments.forEach(s => {
    console.log(`  segment ${s.idx}: K=${(s.K/1e6).toFixed(2)} MN·m/rad, coupling=${s.isCoupling}, units: ${COMPASS_UNITS[s.idx].name} - ${COMPASS_UNITS[s.idx+1].name}`);
  });

  // 额定螺旋桨阻尼
  const ratedPower = 249; // kW
  const ratedSpeed = 1500; // rpm motor
  const gearRatio = 5.048;
  const ratedPropSpeed = ratedSpeed / gearRatio;
  const dpRated = (ratedPower * 1000) / (2 * PI * (ratedPropSpeed/60) * (ratedPropSpeed/60));
  console.log(`\n螺旋桨阻尼 (额定): dp_rated = ${dpRated.toFixed(2)} N·m·s/rad`);
  console.log(`螺旋桨额定转速: ${ratedPropSpeed.toFixed(1)} rpm\n`);

  // 对前2阶模态计算阻尼
  for (let modeIdx = 0; modeIdx < COMPASS_MODES.length; modeIdx++) {
    const mode = COMPASS_MODES[modeIdx];
    const phi = mode.modeShape.amplitudes;
    const omegaN = mode.omega;
    const freq = omegaN / (2 * PI);

    console.log(`--- 第${modeIdx+1}阶模态 (f=${freq.toFixed(2)} Hz) ---`);

    // 应变能
    let U_total = 0, U_coupling = 0;
    for (const seg of segments) {
      if (seg.idx >= phi.length || seg.idx + 1 >= phi.length) continue;
      const dPhi = phi[seg.idx] - phi[seg.idx + 1];
      const U = 0.5 * seg.K * dPhi * dPhi;
      U_total += U;
      if (seg.isCoupling) U_coupling += U;
    }

    console.log(`  U_total = ${U_total.toExponential(4)}, U_coupling = ${U_coupling.toExponential(4)}`);
    console.log(`  U_coupling/U_total = ${(U_coupling/U_total*100).toFixed(2)}%`);

    // 联轴器阻尼贡献
    const zetaCoupling = eta * U_coupling / (2 * U_total);
    console.log(`  ζ_coupling = η × U_c/(2×U_t) = ${zetaCoupling.toFixed(4)}`);

    // 广义质量
    let Mr = 0;
    for (let i = 0; i < n; i++) {
      Mr += COMPASS_UNITS[i].inertia * phi[i] * phi[i];
    }
    console.log(`  M_r = ${Mr.toFixed(4)} kg·m²`);

    // 螺旋桨阻尼 @ 1500rpm (v3.0: 需要速比²折算到等效系统)
    const motorSpeed = 1500;
    const propSpeed = motorSpeed / gearRatio;
    const dp = dpRated * (propSpeed / ratedPropSpeed);
    const dpEquiv = dp / (gearRatio * gearRatio); // 折算到电机侧等效系统
    const phiProp = phi[7]; // propeller unit
    const zetaProp = dpEquiv * phiProp * phiProp / (2 * omegaN * Mr);
    console.log(`  dp(@1500) = ${dp.toFixed(2)} N·m·s/rad (螺旋桨侧)`);
    console.log(`  dp_equiv = dp/i² = ${dpEquiv.toFixed(2)} N·m·s/rad (等效系统)`);
    console.log(`  φ_prop = ${phiProp.toFixed(4)}`);
    console.log(`  ζ_propeller = ${zetaProp.toFixed(4)}`);

    const zetaTotal = STRUCTURAL_DAMPING + zetaCoupling + zetaProp;
    console.log(`  ζ_total = ${STRUCTURAL_DAMPING} + ${zetaCoupling.toFixed(4)} + ${zetaProp.toFixed(4)} = ${zetaTotal.toFixed(4)}`);
    console.log(`  等效放大系数 Q ≈ 1/(2ζ) = ${(1/(2*zetaTotal)).toFixed(1)}`);
    console.log('');
  }

  // 简单SDOF应力估算 @ 1500rpm (叶片次)
  console.log('=== SDOF应力快速估算 @ 1500rpm ===\n');
  const mode1 = COMPASS_MODES[0];
  const phi1 = mode1.modeShape.amplitudes;
  const omega1 = mode1.omega;

  // 叶片次频率
  const bladeCount = 4;
  const motorSpd = 1500;
  const propSpd = motorSpd / gearRatio;
  const fBlade = bladeCount * propSpd / 60;
  const omegaBlade = 2 * PI * fBlade;
  const r = omegaBlade / omega1;

  console.log(`叶片次频率: ${fBlade.toFixed(2)} Hz`);
  console.log(`频率比 r = ${r.toFixed(4)}`);

  // 激励
  const Tmean = 9550 * 249 / motorSpd;
  const mu = 0.06; // 4叶桨叶片次系数
  const Texc = Tmean * mu;
  console.log(`T_mean = ${Tmean.toFixed(1)} N·m, T_exc(叶片次) = ${Texc.toFixed(2)} N·m`);

  // 阻尼比 (使用mode1的值)
  let U_t = 0, U_c = 0;
  for (const seg of segments) {
    if (seg.idx >= phi1.length || seg.idx + 1 >= phi1.length) continue;
    const dP = phi1[seg.idx] - phi1[seg.idx + 1];
    const U = 0.5 * seg.K * dP * dP;
    U_t += U;
    if (seg.isCoupling) U_c += U;
  }
  const dp1500 = dpRated;
  const dp1500Equiv = dp1500 / (gearRatio * gearRatio); // 折算
  let Mr1 = 0;
  for (let i = 0; i < n; i++) Mr1 += COMPASS_UNITS[i].inertia * phi1[i] * phi1[i];
  const zC = 1.15 * U_c / (2 * U_t);
  const zP = dp1500Equiv * phi1[7]*phi1[7] / (2 * omega1 * Mr1);
  const zTotal = 0.005 + zC + zP;

  const H = 1 / Math.sqrt(Math.pow(1-r*r, 2) + Math.pow(2*zTotal*r, 2));
  console.log(`ζ_total = ${zTotal.toFixed(4)}, H(r) = ${H.toFixed(4)}`);

  // 广义力
  // 激励加在螺旋桨端
  const Fr = phi1[7] * Texc;  // 简化: 仅叶片次激励在螺旋桨
  const modalResp = Fr * H / (omega1 * omega1 * Mr1);

  // 中间轴应力 (段5→6)
  const seg56 = segments.find(s => s.idx === 5);
  if (seg56) {
    const dTheta = Math.abs(phi1[5] * modalResp - phi1[6] * modalResp);
    const T = seg56.K * dTheta;
    // 速比换算到低速侧
    const Treal = T * 5.048;
    const d = 0.102; // 102mm
    const Wp = PI * Math.pow(d, 4) / (16 * d);
    const stress = Treal / Wp / 1e6;
    console.log(`\n中间轴估算应力 ≈ ${stress.toFixed(3)} N/mm²`);
    console.log(`COMPASS基准: 3.072 N/mm²`);
  }
}

testModalDamping();
