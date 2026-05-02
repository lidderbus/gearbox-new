// src/utils/longitudinalVibration.js
// P2-3: 轴系纵振 (Axial / Longitudinal Vibration) 简化校核 — Lewis 模型
//
// 工程目的: 检查由螺旋桨轴向脉动力激励的轴系纵振临界转速,
//           确保运行转速避开共振区, 保护止推轴承与减速齿轮箱不受冲击。
//
// 模型: 单自由度 (M_eff, K_axial) 纵振模型
//   - M_eff = M_propeller + M_shaft/3 (Rayleigh 等效质量法)
//   - K_axial = E·A / L (轴的轴向刚度)
//   - 自然频率 f_n = (1/2π) × √(K / M)
//   - 螺旋桨激励主谐次 = Z (叶数), 频率 f_excite = (n/60) × Z
//   - 共振条件: f_excite ≈ f_n
//
// 参考文献:
//   - Lewis F.M., "Propeller Vibration Forces", SNAME Trans. (1963)
//   - BV NR583 "Underwater Radiated Noise" — 含轴系纵振校核章节
//   - 《船舶动力装置振动》(中国造船工程学会, 2019)
//
// 限制: 简化模型不含轴承支撑刚度、桨水动力质量(虚质量增量)等高阶因素;
//       工程估算用, 终值需结合三维有限元。

const STEEL_E = 2.06e11;        // Pa, 碳钢杨氏模量
const PROP_VIRTUAL_MASS_FACTOR = 1.10; // 桨水动力虚质量因子(简化)

/**
 * 计算轴系纵振分析
 *
 * @param {Object} params
 * @param {number} params.shaftDiameter_mm — 轴径 (mm)
 * @param {number} params.shaftLength_m — 轴长度 (m, 螺旋桨到止推轴承)
 * @param {number} params.propellerMass_kg — 螺旋桨质量 (kg)
 * @param {number} [params.shaftDensity_kgm3=7850] — 轴材料密度 (kg/m³)
 * @param {number} [params.youngModulus_Pa=2.06e11] — 杨氏模量 (Pa)
 * @param {number} params.bladeCount — 桨叶数 Z
 * @param {number} params.operatingSpeed_rpm — 工作转速 (rpm, 螺旋桨)
 * @param {number} [params.transientMargin=0.10] — 短时通过裕度
 * @param {number} [params.continuousMargin=0.05] — 持续运行裕度
 * @returns {Object} 完整分析结果
 */
export const analyzeLongitudinalVibration = (params) => {
  const {
    shaftDiameter_mm,
    shaftLength_m,
    propellerMass_kg,
    shaftDensity_kgm3 = 7850,
    youngModulus_Pa = STEEL_E,
    bladeCount,
    operatingSpeed_rpm,
    transientMargin = 0.10,
    continuousMargin = 0.05,
  } = params;

  const errors = [];
  if (!shaftDiameter_mm || shaftDiameter_mm <= 0) errors.push('轴径必须 > 0');
  if (!shaftLength_m || shaftLength_m <= 0) errors.push('轴长必须 > 0');
  if (!propellerMass_kg || propellerMass_kg <= 0) errors.push('螺旋桨质量必须 > 0');
  if (!bladeCount || bladeCount <= 0) errors.push('桨叶数必须 > 0');
  if (!operatingSpeed_rpm || operatingSpeed_rpm <= 0) errors.push('工作转速必须 > 0');
  if (errors.length > 0) return { success: false, errors };

  // 几何
  const d_m = shaftDiameter_mm / 1000;
  const A_m2 = Math.PI * Math.pow(d_m / 2, 2); // 截面积
  const V_m3 = A_m2 * shaftLength_m;
  const M_shaft = V_m3 * shaftDensity_kgm3;

  // 等效质量 M_eff (Rayleigh: 桨虚质量 + 轴 1/3)
  const M_prop_virtual = propellerMass_kg * PROP_VIRTUAL_MASS_FACTOR;
  const M_eff = M_prop_virtual + M_shaft / 3;

  // 轴向刚度
  const K_axial = (youngModulus_Pa * A_m2) / shaftLength_m;

  // 自然频率
  const omega_n = Math.sqrt(K_axial / M_eff); // rad/s
  const f_n_Hz = omega_n / (2 * Math.PI);

  // 临界转速 — 螺旋桨叶频激励 (主谐次为叶数 Z)
  const n_cr_rpm = (f_n_Hz * 60) / bladeCount;

  // 当前激励频率
  const f_excite_Hz = (operatingSpeed_rpm / 60) * bladeCount;

  // 裕度计算
  const ratio = operatingSpeed_rpm / n_cr_rpm;
  const distance_pct = Math.abs(ratio - 1) * 100;

  const continuous_pass = distance_pct >= continuousMargin * 100;
  const transient_pass = distance_pct >= transientMargin * 100 || ratio < 1; // 短时通过允许低于 transient

  // 推荐避让区
  const forbiddenZone = {
    min: n_cr_rpm * (1 - transientMargin),
    max: n_cr_rpm * (1 + transientMargin),
  };

  return {
    success: true,
    method: 'Lewis simplified single-DoF',
    geometry: {
      shaftArea_m2: Math.round(A_m2 * 1e6) / 1e6,
      shaftMass_kg: Math.round(M_shaft * 100) / 100,
      effectiveMass_kg: Math.round(M_eff * 100) / 100,
      axialStiffness_Npm: Math.round(K_axial),
    },
    naturalFrequency_Hz: Math.round(f_n_Hz * 1000) / 1000,
    angularFrequency_rad_s: Math.round(omega_n * 100) / 100,
    criticalSpeed_rpm: Math.round(n_cr_rpm),
    forbiddenZone_rpm: {
      min: Math.round(forbiddenZone.min),
      max: Math.round(forbiddenZone.max),
    },
    excitationFrequency_Hz: Math.round(f_excite_Hz * 100) / 100,
    speedRatio: Math.round(ratio * 1000) / 1000,
    distanceFromCritical_pct: Math.round(distance_pct * 100) / 100,
    pass: {
      continuous: continuous_pass,
      transient: transient_pass,
      overall: continuous_pass && transient_pass,
    },
    references: [
      'Lewis F.M. "Propeller Vibration Forces" SNAME Trans (1963)',
      'BV NR583 — 轴系纵振校核章节',
      '《船舶动力装置振动》中国造船工程学会 2019',
    ],
    notes: '简化单自由度模型, 忽略轴承支撑柔度与桨水动力非线性,工程估算用',
  };
};

const longitudinalVibration = { analyzeLongitudinalVibration };
export default longitudinalVibration;
