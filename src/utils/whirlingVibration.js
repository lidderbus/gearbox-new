// src/utils/whirlingVibration.js
// P2-3: 轴系回旋振动 (Whirling / Lateral Vibration) 简化校核
//
// 工程目的: 检查由不平衡和螺旋桨偏心激励的轴系回旋(横振)临界转速,
//           保护轴承不发生疲劳磨损与油膜失稳。
//
// 模型: 简支梁 + 端部集中质量 (Dunkerley 法叠加)
//   - 简支梁固有频率 ω_beam = sqrt(K_bending / m_distributed)
//   - 端部桨质量影响: 1/ω² = 1/ω_beam² + 1/ω_prop²  (Dunkerley)
//   - 抗弯刚度 K_bending = 48·E·I / L³ (简支两点支承中点挠度)
//   - I = π·d⁴/64 (圆截面惯性矩)
//
// 正反进动 (Forward / Backward Whirl):
//   - 正进动 (与转向同向): 临界转速增大, 油膜偏心增加
//   - 反进动: 临界转速降低, 易发疲劳裂纹
//   - 简化处理: 不考虑陀螺效应分裂, 只输出基本临界值
//
// 激励主谐次: 1× 转频 (不平衡) 与 Z× 转频 (桨)
//
// 参考文献:
//   - 《船舶动力装置振动》中国造船工程学会, 2019, Ch.5
//   - DNV-CG-0038 "Calculation of marine propellers" §6.3
//
// 限制: 简化模型不含陀螺效应、不平衡分布、轴承非线性

const STEEL_E = 2.06e11;        // Pa
const PROP_VIRTUAL_MASS_FACTOR = 1.10;

/**
 * @param {Object} params
 * @param {number} params.shaftDiameter_mm
 * @param {number} params.shaftLength_m — 两轴承间距
 * @param {number} params.propellerMass_kg — 端部桨质量
 * @param {number} [params.shaftDensity_kgm3=7850]
 * @param {number} [params.youngModulus_Pa=2.06e11]
 * @param {number} params.bladeCount — 桨叶数
 * @param {number} params.operatingSpeed_rpm
 * @param {number} [params.unbalanceFactor=1.5] — 不平衡放大系数 (用于估算激励量)
 * @returns {Object} 完整分析结果
 */
export const analyzeWhirlingVibration = (params) => {
  const {
    shaftDiameter_mm,
    shaftLength_m,
    propellerMass_kg,
    shaftDensity_kgm3 = 7850,
    youngModulus_Pa = STEEL_E,
    bladeCount,
    operatingSpeed_rpm,
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
  const I_m4 = Math.PI * Math.pow(d_m, 4) / 64;     // 截面惯性矩
  const A_m2 = Math.PI * Math.pow(d_m / 2, 2);
  const m_per_length = A_m2 * shaftDensity_kgm3;     // 单位长度质量

  // 抗弯刚度 (简支两端中点挠度)
  const K_bending = 48 * youngModulus_Pa * I_m4 / Math.pow(shaftLength_m, 3);

  // 简支梁基阶固有频率 (无端部质量)
  // ω = (π² / L²) × √(EI / (m_per_length))
  const omega_beam = (Math.PI * Math.PI / Math.pow(shaftLength_m, 2)) *
    Math.sqrt(youngModulus_Pa * I_m4 / m_per_length);
  const f_beam_Hz = omega_beam / (2 * Math.PI);

  // 端部桨质量贡献的固有频率 (单自由度)
  const M_prop_virtual = propellerMass_kg * PROP_VIRTUAL_MASS_FACTOR;
  const omega_prop = Math.sqrt(K_bending / M_prop_virtual);
  const f_prop_Hz = omega_prop / (2 * Math.PI);

  // Dunkerley 叠加: 1/ω_total² = 1/ω_beam² + 1/ω_prop²
  const omega_total_sq = 1 / (1 / (omega_beam * omega_beam) + 1 / (omega_prop * omega_prop));
  const omega_total = Math.sqrt(omega_total_sq);
  const f_n_Hz = omega_total / (2 * Math.PI);

  // 临界转速 — 1× (不平衡)
  const n_cr_unbalance_rpm = f_n_Hz * 60;
  // 临界转速 — Z× (桨叶)
  const n_cr_blade_rpm = f_n_Hz * 60 / bladeCount;

  // 检查工作转速是否在禁区
  const checks = [
    {
      mode: '不平衡激励 (1×)',
      criticalRpm: Math.round(n_cr_unbalance_rpm),
      forbiddenMin: Math.round(n_cr_unbalance_rpm * 0.85),
      forbiddenMax: Math.round(n_cr_unbalance_rpm * 1.05),
      pass: operatingSpeed_rpm < n_cr_unbalance_rpm * 0.85 ||
            operatingSpeed_rpm > n_cr_unbalance_rpm * 1.05,
    },
    {
      mode: `桨叶激励 (${bladeCount}×)`,
      criticalRpm: Math.round(n_cr_blade_rpm),
      forbiddenMin: Math.round(n_cr_blade_rpm * 0.85),
      forbiddenMax: Math.round(n_cr_blade_rpm * 1.05),
      pass: operatingSpeed_rpm < n_cr_blade_rpm * 0.85 ||
            operatingSpeed_rpm > n_cr_blade_rpm * 1.05,
    },
  ];

  return {
    success: true,
    method: 'Simply-supported beam + tip mass (Dunkerley superposition)',
    geometry: {
      sectionInertia_m4: I_m4,
      sectionArea_m2: Math.round(A_m2 * 1e6) / 1e6,
      bendingStiffness_Npm: Math.round(K_bending),
      shaftDistributedMass_kgPerM: Math.round(m_per_length * 100) / 100,
      effectivePropellerMass_kg: Math.round(M_prop_virtual * 100) / 100,
    },
    frequencies: {
      beamOnly_Hz: Math.round(f_beam_Hz * 1000) / 1000,
      propOnly_Hz: Math.round(f_prop_Hz * 1000) / 1000,
      combined_Hz: Math.round(f_n_Hz * 1000) / 1000,
    },
    checks,
    overallPass: checks.every(c => c.pass),
    references: [
      '《船舶动力装置振动》中国造船工程学会 2019, Ch.5',
      'DNV-CG-0038 §6.3',
    ],
    notes: '简支梁 + Dunkerley 叠加, 未含陀螺效应分裂、轴承油膜刚度;工程估算用',
  };
};

const whirlingVibration = { analyzeWhirlingVibration };
export default whirlingVibration;
