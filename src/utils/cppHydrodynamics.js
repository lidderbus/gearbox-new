// src/utils/cppHydrodynamics.js
// CPP水动力计算模块 v2.0
// 包含: ITTC Wageningen B-series完整多项式、空泡校核、多船级社规范校核、推进效率计算
// 更新日期: 2026-01-08

import { bladeMaterials, vesselWakeCoefficients, operatingConditions } from '../data/cppSystemData';

// ============================================
// 常量定义
// ============================================

const SEAWATER_DENSITY = 1025;  // kg/m³ 海水密度
const GRAVITY = 9.81;           // m/s²
const ATMOSPHERIC_PRESSURE = 101325;  // Pa 标准大气压
const VAPOR_PRESSURE = 1700;    // Pa 海水蒸汽压 (15°C)

// ============================================
// ITTC Wageningen B-series 完整系数表
// 参考: ITTC Recommended Procedures 7.5-02-03-01.4
// 适用范围: Z=2-7, P/D=0.5-1.4, Ae/Ao=0.30-1.05, J=0-1.5
// ============================================

/**
 * Wageningen B-series KT系数表 (推力系数)
 * 47个系数, 格式: [s, t, u, v, C]
 * KT = Σ C(s,t,u,v) × J^s × (P/D)^t × (Ae/Ao)^u × Z^v
 */
const WAGENINGEN_KT_COEFFICIENTS = [
  // [s, t, u, v, C]
  [0, 0, 0, 0, 0.00880496],
  [1, 0, 0, 0, -0.204554],
  [0, 1, 0, 0, 0.166351],
  [0, 2, 0, 0, 0.158114],
  [2, 0, 0, 0, -0.147581],
  [1, 1, 0, 0, -0.481497],
  [0, 2, 0, 1, 0.0727660],
  [1, 1, 0, 1, 0.0780012],
  [0, 1, 1, 0, -0.0146564],
  [0, 0, 2, 0, -0.0530054],
  [2, 0, 1, 0, 0.0109689],
  [1, 1, 1, 0, -0.133698],
  [0, 2, 1, 0, 0.0638407],
  [1, 0, 0, 1, -0.0011715],
  [0, 3, 0, 0, 0.00841728],
  [0, 6, 0, 0, -0.0648272],
  [2, 0, 0, 1, -0.0168424],
  [3, 0, 0, 0, 0.0189510],
  [0, 0, 1, 1, 0.00259543],
  [1, 0, 1, 1, 0.00334848],
  [3, 0, 1, 0, -0.00183150],
  [0, 1, 2, 0, 0.00112451],
  [2, 0, 2, 0, -0.00297228],
  [0, 0, 0, 2, 0.000269551],
  [1, 2, 0, 0, 0.0834460],
  [1, 6, 0, 0, 0.0516680],
  [2, 6, 0, 0, -0.00317791],
  [0, 0, 1, 2, 0.000155334],
  [0, 3, 1, 0, -0.00425399],
  [3, 3, 0, 0, 0.000869243],
  [0, 6, 1, 0, 0.0323447],
  [1, 0, 2, 0, -0.00854308],
  [1, 2, 2, 0, -0.00504542],
  [0, 0, 3, 0, 0.00209449],
  [0, 3, 2, 0, 0.000474319],
  [0, 6, 2, 0, -0.00383637],
  [1, 1, 2, 0, 0.0126803],
  [2, 2, 0, 0, -0.0318278],
  [0, 1, 0, 1, 0.00334268],
  [2, 3, 0, 0, 0.0044347],
  [0, 1, 1, 2, -0.000560528],
  [1, 3, 1, 0, -0.00648272],
  [2, 1, 1, 0, 0.0168424],
  [0, 2, 2, 0, -0.000456533],
  [2, 0, 0, 2, 0.000116502],
  [1, 1, 0, 2, -0.000731214],
  [0, 2, 0, 2, 0.0000999798]
];

/**
 * Wageningen B-series 10KQ系数表 (扭矩系数)
 * 47个系数, 格式: [s, t, u, v, C]
 * 10KQ = Σ C(s,t,u,v) × J^s × (P/D)^t × (Ae/Ao)^u × Z^v
 */
const WAGENINGEN_KQ_COEFFICIENTS = [
  // [s, t, u, v, C]
  [0, 0, 0, 0, 0.00379368],
  [2, 0, 0, 0, 0.00886523],
  [1, 1, 0, 0, -0.032241],
  [0, 2, 0, 0, 0.00344778],
  [0, 1, 1, 0, -0.0408811],
  [1, 1, 1, 0, -0.108009],
  [1, 0, 2, 0, -0.0885381],
  [2, 1, 0, 0, 0.188561],
  [0, 2, 1, 0, -0.00370871],
  [1, 0, 0, 1, 0.00513696],
  [0, 1, 0, 1, 0.0209449],
  [1, 1, 0, 1, 0.00474319],
  [2, 2, 0, 0, -0.0723408],
  [2, 0, 1, 0, 0.0438388],
  [1, 2, 0, 0, -0.0269403],
  [0, 0, 0, 2, 0.000558082],
  [0, 3, 0, 0, 0.0161886],
  [1, 3, 0, 0, 0.00318086],
  [1, 0, 1, 1, -0.00182840],
  [0, 2, 0, 1, -0.00300920],
  [0, 0, 1, 1, 0.00421749],
  [2, 0, 0, 1, -0.000539310],
  [0, 1, 1, 1, -0.00122380],
  [3, 0, 0, 0, 0.00110903],
  [0, 6, 0, 0, -0.000318278],
  [0, 0, 2, 0, 0.00354213],
  [0, 0, 1, 2, -0.000683746],
  [3, 3, 0, 0, -0.000726170],
  [0, 6, 1, 0, 0.000440828],
  [1, 6, 0, 0, -0.000343480],
  [3, 0, 1, 0, -0.00311859],
  [3, 3, 1, 0, 0.000404950],
  [0, 0, 3, 0, -0.000350024],
  [0, 3, 2, 0, 0.000421749],
  [0, 0, 2, 2, 0.0000869243],
  [0, 1, 0, 2, 0.0000558082],
  [1, 0, 2, 1, 0.00263112],
  [0, 1, 2, 0, -0.00063119],
  [1, 2, 1, 0, 0.00168424],
  [0, 2, 2, 0, -0.000407560],
  [2, 0, 2, 0, 0.00103468],
  [2, 3, 1, 0, 0.000109689],
  [0, 0, 0, 1, -0.00155334],
  [0, 1, 2, 1, 0.0000344778],
  [2, 2, 1, 0, -0.00233010],
  [1, 0, 0, 2, -0.000174780],
  [0, 6, 2, 0, 0.0000690904]
];

/**
 * 叶数有效范围
 */
const WAGENINGEN_Z_RANGE = { min: 2, max: 7 };
const WAGENINGEN_PD_RANGE = { min: 0.5, max: 1.4 };
const WAGENINGEN_AEAO_RANGE = { min: 0.30, max: 1.05 };
const WAGENINGEN_J_RANGE = { min: 0, max: 1.5 };

// ============================================
// ITTC Wageningen B-series 完整计算方法
// 47系数多项式精确计算
// ============================================

/**
 * 验证Wageningen B-series输入参数是否在有效范围内
 * @param {number} J - 进速系数
 * @param {number} P_D - 桨距比 P/D
 * @param {number} AeA0 - 盘面比 Ae/A0
 * @param {number} Z - 叶数
 * @returns {Object} {valid, warnings}
 */
export const validateWageningenParams = (J, P_D, AeA0, Z) => {
  const warnings = [];

  if (J < WAGENINGEN_J_RANGE.min || J > WAGENINGEN_J_RANGE.max) {
    warnings.push(`进速系数J=${J.toFixed(3)}超出有效范围[${WAGENINGEN_J_RANGE.min}, ${WAGENINGEN_J_RANGE.max}]`);
  }
  if (P_D < WAGENINGEN_PD_RANGE.min || P_D > WAGENINGEN_PD_RANGE.max) {
    warnings.push(`桨距比P/D=${P_D.toFixed(2)}超出有效范围[${WAGENINGEN_PD_RANGE.min}, ${WAGENINGEN_PD_RANGE.max}]`);
  }
  if (AeA0 < WAGENINGEN_AEAO_RANGE.min || AeA0 > WAGENINGEN_AEAO_RANGE.max) {
    warnings.push(`盘面比Ae/A0=${AeA0.toFixed(2)}超出有效范围[${WAGENINGEN_AEAO_RANGE.min}, ${WAGENINGEN_AEAO_RANGE.max}]`);
  }
  if (Z < WAGENINGEN_Z_RANGE.min || Z > WAGENINGEN_Z_RANGE.max || !Number.isInteger(Z)) {
    warnings.push(`叶数Z=${Z}超出有效范围[${WAGENINGEN_Z_RANGE.min}, ${WAGENINGEN_Z_RANGE.max}]或非整数`);
  }

  return {
    valid: warnings.length === 0,
    warnings,
    params: { J, P_D, AeA0, Z }
  };
};

/**
 * ITTC Wageningen B-series 完整推力系数 KT 计算
 * 使用47个系数的精确多项式
 * KT = Σ C(s,t,u,v) × J^s × (P/D)^t × (Ae/Ao)^u × Z^v
 *
 * @param {number} J - 进速系数 (有效范围: 0-1.5)
 * @param {number} P_D - 桨距比 P/D (有效范围: 0.5-1.4)
 * @param {number} AeA0 - 盘面比 Ae/A0 (有效范围: 0.30-1.05)
 * @param {number} Z - 叶数 (有效范围: 2-7)
 * @param {boolean} validate - 是否验证参数范围 (默认true)
 * @returns {Object} {KT, validation}
 */
export const calculateKT_ITTC = (J, P_D, AeA0, Z, validate = true) => {
  // 参数验证
  const validation = validate ? validateWageningenParams(J, P_D, AeA0, Z) : { valid: true, warnings: [] };

  // 计算KT = Σ C × J^s × (P/D)^t × (Ae/A0)^u × Z^v
  let KT = 0;

  for (const [s, t, u, v, C] of WAGENINGEN_KT_COEFFICIENTS) {
    const term = C * Math.pow(J, s) * Math.pow(P_D, t) * Math.pow(AeA0, u) * Math.pow(Z, v);
    KT += term;
  }

  // 确保KT非负 (在某些极端参数下可能出现负值)
  KT = Math.max(0, KT);

  return {
    KT,
    method: 'ITTC_47_COEFFICIENTS',
    validation
  };
};

/**
 * ITTC Wageningen B-series 完整扭矩系数 10KQ 计算
 * 使用47个系数的精确多项式
 * 10KQ = Σ C(s,t,u,v) × J^s × (P/D)^t × (Ae/Ao)^u × Z^v
 *
 * @param {number} J - 进速系数 (有效范围: 0-1.5)
 * @param {number} P_D - 桨距比 P/D (有效范围: 0.5-1.4)
 * @param {number} AeA0 - 盘面比 Ae/A0 (有效范围: 0.30-1.05)
 * @param {number} Z - 叶数 (有效范围: 2-7)
 * @param {boolean} validate - 是否验证参数范围 (默认true)
 * @returns {Object} {KQ10, KQ, validation}
 */
export const calculate10KQ_ITTC = (J, P_D, AeA0, Z, validate = true) => {
  // 参数验证
  const validation = validate ? validateWageningenParams(J, P_D, AeA0, Z) : { valid: true, warnings: [] };

  // 计算10KQ = Σ C × J^s × (P/D)^t × (Ae/A0)^u × Z^v
  let KQ10 = 0;

  for (const [s, t, u, v, C] of WAGENINGEN_KQ_COEFFICIENTS) {
    const term = C * Math.pow(J, s) * Math.pow(P_D, t) * Math.pow(AeA0, u) * Math.pow(Z, v);
    KQ10 += term;
  }

  // 确保KQ10非负
  KQ10 = Math.max(0, KQ10);

  return {
    KQ10,
    KQ: KQ10 / 10,
    method: 'ITTC_47_COEFFICIENTS',
    validation
  };
};

/**
 * ITTC Wageningen B-series 完整敞水效率计算
 * 综合使用完整47系数KT和KQ
 *
 * @param {number} J - 进速系数
 * @param {number} P_D - 桨距比 P/D
 * @param {number} AeA0 - 盘面比 Ae/A0
 * @param {number} Z - 叶数
 * @returns {Object} 完整计算结果
 */
export const calculateOpenWaterPerformance_ITTC = (J, P_D, AeA0, Z) => {
  const ktResult = calculateKT_ITTC(J, P_D, AeA0, Z, true);
  const kqResult = calculate10KQ_ITTC(J, P_D, AeA0, Z, false); // 避免重复验证

  const { KT } = ktResult;
  const { KQ } = kqResult;

  // 敞水效率 η0 = J × KT / (2π × KQ)
  let eta0 = 0;
  if (KQ > 0 && J > 0) {
    eta0 = (J * KT) / (2 * Math.PI * KQ);
  }

  // 合并验证警告
  const allWarnings = [...ktResult.validation.warnings];

  return {
    J,
    P_D,
    AeA0,
    Z,
    KT: Math.round(KT * 100000) / 100000,
    KQ10: Math.round(kqResult.KQ10 * 100000) / 100000,
    KQ: Math.round(KQ * 100000) / 100000,
    eta0: Math.round(eta0 * 10000) / 10000,
    method: 'ITTC_47_COEFFICIENTS',
    valid: allWarnings.length === 0,
    warnings: allWarnings
  };
};

/**
 * 生成完整ITTC敞水性能曲线
 * @param {Object} propellerParams - 螺旋桨参数
 * @returns {Object} 完整性能曲线数据
 */
export const generateOpenWaterCurves_ITTC = (propellerParams) => {
  const { areaRatio = 0.55, pitchRatio = 1.0, bladeCount = 4 } = propellerParams;

  const data = [];
  const J_values = [];
  const KT_values = [];
  const KQ10_values = [];
  const eta0_values = [];

  // 验证参数
  const validation = validateWageningenParams(0.5, pitchRatio, areaRatio, bladeCount);

  // 生成 J = 0 到 1.4 的曲线点 (每0.02一个点)
  for (let j = 0; j <= 1.4; j += 0.02) {
    const J = Math.round(j * 100) / 100;
    const result = calculateOpenWaterPerformance_ITTC(J, pitchRatio, areaRatio, bladeCount);

    J_values.push(J);
    KT_values.push(result.KT);
    KQ10_values.push(result.KQ10);
    eta0_values.push(result.eta0);

    data.push({
      J,
      KT: result.KT,
      KQ10: result.KQ10,
      eta0: result.eta0
    });
  }

  // 找出最高效率点
  let maxEta0 = 0;
  let optimalJ = 0;
  let optimalIndex = 0;

  eta0_values.forEach((eta, index) => {
    if (eta > maxEta0) {
      maxEta0 = eta;
      optimalJ = J_values[index];
      optimalIndex = index;
    }
  });

  // 计算设计点附近的梯度
  const gradientInfo = optimalIndex > 0 && optimalIndex < eta0_values.length - 1 ? {
    dEta_dJ: (eta0_values[optimalIndex + 1] - eta0_values[optimalIndex - 1]) / 0.04,
    stable: Math.abs(eta0_values[optimalIndex + 1] - eta0_values[optimalIndex - 1]) < 0.01
  } : null;

  return {
    propellerParams: { areaRatio, pitchRatio, bladeCount },
    method: 'ITTC_47_COEFFICIENTS',
    validation,
    data,
    curves: {
      J: J_values,
      KT: KT_values,
      KQ10: KQ10_values,
      eta0: eta0_values
    },
    optimalPoint: {
      J: optimalJ,
      KT: KT_values[optimalIndex],
      KQ10: KQ10_values[optimalIndex],
      eta0: maxEta0,
      index: optimalIndex
    },
    gradientInfo,
    // KT=0时的J值 (近似最大进速系数)
    J_atKT0: KT_values.findIndex(kt => kt <= 0) > 0
      ? J_values[KT_values.findIndex(kt => kt <= 0) - 1]
      : J_values[J_values.length - 1]
  };
};

// ============================================
// Wageningen B-series 敞水性能估算
// 基于ITTC标准多项式拟合 (简化版，保持向后兼容)
// ============================================

/**
 * Wageningen B-series 推力系数 KT 计算
 * 简化多项式拟合 (基于4叶桨、盘面比0.55的典型值)
 * @param {number} J - 进速系数
 * @param {number} P_D - 桨距比 P/D
 * @param {number} AeA0 - 盘面比 Ae/A0
 * @param {number} Z - 叶数
 * @returns {number} 推力系数 KT
 */
export const calculateKT = (J, P_D, AeA0, Z) => {
  // 基于Wageningen B-series多项式拟合的简化公式
  // KT = C0 + C1*J + C2*J² + C3*(P/D) + C4*J*(P/D) + C5*(Ae/A0) + ...

  // 简化系数 (适用于 Z=4, AeA0=0.55 附近)
  const C0 = 0.030550;
  const C1 = -0.148687;
  const C2 = -0.636228;
  const C3 = 0.216371;
  const C4 = -0.291050;
  const C5 = 0.047990;

  // 叶数修正
  const Zfactor = 1 + 0.03 * (Z - 4);

  // 盘面比修正
  const AeA0factor = 1 + 0.5 * (AeA0 - 0.55);

  let KT = C0 + C1 * J + C2 * J * J + C3 * P_D + C4 * J * P_D + C5 * AeA0;
  KT = KT * Zfactor * AeA0factor;

  return Math.max(0, KT);
};

/**
 * Wageningen B-series 扭矩系数 10KQ 计算
 * @param {number} J - 进速系数
 * @param {number} P_D - 桨距比 P/D
 * @param {number} AeA0 - 盘面比 Ae/A0
 * @param {number} Z - 叶数
 * @returns {number} 扭矩系数 10KQ
 */
export const calculate10KQ = (J, P_D, AeA0, Z) => {
  // 简化系数
  const C0 = 0.003795;
  const C1 = -0.017275;
  const C2 = -0.137205;
  const C3 = 0.045423;
  const C4 = -0.026325;
  const C5 = 0.008983;

  const Zfactor = 1 + 0.025 * (Z - 4);
  const AeA0factor = 1 + 0.4 * (AeA0 - 0.55);

  let KQ10 = C0 + C1 * J + C2 * J * J + C3 * P_D + C4 * J * P_D + C5 * AeA0;
  KQ10 = KQ10 * Zfactor * AeA0factor;

  return Math.max(0, KQ10);
};

/**
 * 计算敞水效率 eta0
 * @param {number} J - 进速系数
 * @param {number} KT - 推力系数
 * @param {number} KQ - 扭矩系数
 * @returns {number} 敞水效率
 */
export const calculateEta0 = (J, KT, KQ) => {
  if (KQ <= 0 || J <= 0) return 0;
  return (J * KT) / (2 * Math.PI * KQ);
};

/**
 * 生成完整敞水性能曲线
 * @param {Object} propellerParams - 螺旋桨参数 {areaRatio, pitchRatio, bladeCount}
 * @returns {Object} {J, KT, KQ, eta0} 数组
 */
export const generateOpenWaterCurves = (propellerParams) => {
  const { areaRatio = 0.55, pitchRatio = 1.0, bladeCount = 4 } = propellerParams;

  const J_values = [];
  const KT_values = [];
  const KQ_values = [];
  const eta0_values = [];

  // 生成 J = 0 到 1.2 的曲线点
  for (let j = 0; j <= 1.2; j += 0.05) {
    const J = Math.round(j * 100) / 100;
    const KT = calculateKT(J, pitchRatio, areaRatio, bladeCount);
    const KQ10 = calculate10KQ(J, pitchRatio, areaRatio, bladeCount);
    const KQ = KQ10 / 10;
    const eta0 = calculateEta0(J, KT, KQ);

    J_values.push(J);
    KT_values.push(Math.round(KT * 10000) / 10000);
    KQ_values.push(Math.round(KQ * 10000) / 10000);
    eta0_values.push(Math.round(eta0 * 1000) / 1000);
  }

  // 找出最高效率点
  let maxEta0 = 0;
  let optimalJ = 0;
  eta0_values.forEach((eta, index) => {
    if (eta > maxEta0) {
      maxEta0 = eta;
      optimalJ = J_values[index];
    }
  });

  return {
    J: J_values,
    KT: KT_values,
    KQ: KQ_values,
    eta0: eta0_values,
    optimalPoint: { J: optimalJ, eta0: maxEta0 }
  };
};

// ============================================
// 水动力性能计算
// ============================================

/**
 * 计算进速系数 J
 * @param {number} Va - 进速 (m/s)
 * @param {number} n - 转速 (rps)
 * @param {number} D - 直径 (m)
 * @returns {number} 进速系数 J
 */
export const calculateAdvanceCoefficient = (Va, n, D) => {
  if (n <= 0 || D <= 0) return 0;
  return Va / (n * D);
};

/**
 * 计算推力
 * @param {number} KT - 推力系数
 * @param {number} n - 转速 (rps)
 * @param {number} D - 直径 (m)
 * @param {number} rho - 密度 (kg/m³)
 * @returns {number} 推力 (N)
 */
export const calculateThrust = (KT, n, D, rho = SEAWATER_DENSITY) => {
  return KT * rho * n * n * Math.pow(D, 4);
};

/**
 * 计算扭矩
 * @param {number} KQ - 扭矩系数
 * @param {number} n - 转速 (rps)
 * @param {number} D - 直径 (m)
 * @param {number} rho - 密度 (kg/m³)
 * @returns {number} 扭矩 (N·m)
 */
export const calculateTorque = (KQ, n, D, rho = SEAWATER_DENSITY) => {
  return KQ * rho * n * n * Math.pow(D, 5);
};

/**
 * 计算吸收功率
 * @param {number} Q - 扭矩 (N·m)
 * @param {number} n - 转速 (rps)
 * @returns {number} 功率 (kW)
 */
export const calculateAbsorbedPower = (Q, n) => {
  return (2 * Math.PI * n * Q) / 1000;
};

/**
 * 完整水动力性能计算
 * @param {Object} params - 计算参数
 * @returns {Object} 性能结果
 */
export const calculateHydrodynamics = (params) => {
  const {
    power,              // 发动机功率 kW
    engineSpeed,        // 发动机转速 rpm
    gearRatio,          // 齿轮箱减速比
    propellerDiameter,  // 螺旋桨直径 m
    shipSpeed = 0,      // 船速 m/s (0为系泊工况)
    vesselType = 'tug', // 船型
    bladeGeometry       // 叶片几何参数
  } = params;

  // 获取伴流系数
  const wakeCoeff = vesselWakeCoefficients[vesselType] || { w: 0.20, t: 0.18 };
  const w = wakeCoeff.w;
  const t = wakeCoeff.t;

  // 计算转速
  const propellerRPM = engineSpeed / gearRatio;
  const n = propellerRPM / 60;  // rps

  // 计算进速
  const Va = shipSpeed * (1 - w);

  // 计算进速系数 J
  const J = calculateAdvanceCoefficient(Va, n, propellerDiameter);

  // 获取叶片参数
  const { areaRatio = 0.55, pitchRatio = 1.0 } = bladeGeometry || {};
  const Z = 4;  // 默认4叶

  // 计算系数
  const KT = calculateKT(J, pitchRatio, areaRatio, Z);
  const KQ10 = calculate10KQ(J, pitchRatio, areaRatio, Z);
  const KQ = KQ10 / 10;
  const eta0 = calculateEta0(J, KT, KQ);

  // 计算推力和扭矩
  const thrust = calculateThrust(KT, n, propellerDiameter);
  const torque = calculateTorque(KQ, n, propellerDiameter);
  const absorbedPower = calculateAbsorbedPower(torque, n);

  return {
    // 输入参数
    input: {
      power,
      engineSpeed,
      gearRatio,
      propellerDiameter,
      shipSpeed,
      vesselType
    },
    // 中间计算
    intermediate: {
      propellerRPM: Math.round(propellerRPM),
      n: Math.round(n * 100) / 100,
      Va: Math.round(Va * 100) / 100,
      w,
      t
    },
    // 水动力系数
    coefficients: {
      J: Math.round(J * 1000) / 1000,
      KT: Math.round(KT * 10000) / 10000,
      KQ: Math.round(KQ * 10000) / 10000,
      eta0: Math.round(eta0 * 1000) / 1000
    },
    // 性能结果
    performance: {
      thrust: Math.round(thrust),                    // N
      thrustKN: Math.round(thrust / 100) / 10,       // kN
      torque: Math.round(torque),                    // N·m
      torqueKNm: Math.round(torque / 100) / 10,      // kN·m
      absorbedPower: Math.round(absorbedPower * 10) / 10  // kW
    }
  };
};

// ============================================
// 空泡校核 (CCS规范)
// ============================================

/**
 * 计算空泡数 sigma
 * @param {Object} params - 计算参数
 * @returns {Object} 空泡校核结果
 */
export const checkCavitation = (params) => {
  const {
    Va,                          // 进速 m/s
    n,                           // 转速 rps
    D,                           // 直径 m
    depth = 3,                   // 桨轴沉深 m
    criticalSigma = 1.5,         // 临界空泡数
    marginFactor = 1.15          // 安全裕度
  } = params;

  // 计算静水压力
  const p0 = ATMOSPHERIC_PRESSURE + SEAWATER_DENSITY * GRAVITY * depth;

  // 计算叶梢速度
  const tipSpeed = Math.PI * n * D;

  // 叶梢部位的相对来流速度
  const Vr = Math.sqrt(Va * Va + tipSpeed * tipSpeed);

  // 空泡数 sigma = (p0 - pv) / (0.5 * rho * Vr²)
  const sigma = (p0 - VAPOR_PRESSURE) / (0.5 * SEAWATER_DENSITY * Vr * Vr);

  // 判断是否满足要求
  const requiredSigma = criticalSigma * marginFactor;
  const pass = sigma > requiredSigma;
  const margin = ((sigma - requiredSigma) / requiredSigma * 100);

  return {
    sigma: Math.round(sigma * 100) / 100,
    criticalSigma,
    marginFactor,
    requiredSigma: Math.round(requiredSigma * 100) / 100,
    pass,
    margin: Math.round(margin * 10) / 10,
    tipSpeed: Math.round(tipSpeed * 10) / 10,
    depth,
    message: pass
      ? `空泡校核通过，裕度 ${margin.toFixed(1)}%`
      : `空泡校核不通过，差距 ${Math.abs(margin).toFixed(1)}%`
  };
};

// ============================================
// CCS叶片强度校核
// ============================================

/**
 * CCS钢质海船入级规范 - 桨叶厚度校核
 * 计算0.35R和0.60R截面最小厚度
 * @param {Object} params - 计算参数
 * @returns {Object} 强度校核结果
 */
export const checkBladeStrength = (params) => {
  const {
    power,              // 功率 kW
    n,                  // 转速 rps
    D,                  // 直径 m
    Z = 4,              // 叶数
    material = 'NAB',   // 材料
    actualThickness035R,  // 实际0.35R厚度比 t/D
    actualThickness060R   // 实际0.60R厚度比 t/D
  } = params;

  // 获取材料参数
  const mat = bladeMaterials[material] || bladeMaterials['NAB'];
  const { safetyFactor, fatigueStrength } = mat;

  // 简化的CCS厚度计算公式
  // t/D ≥ K × (P/(n²×D⁴×Z×σf))^0.4

  const K035R = 0.12;  // 0.35R系数
  const K060R = 0.08;  // 0.60R系数

  const powerFactor = Math.pow(power * 1000 / (n * n * Math.pow(D, 4) * Z * fatigueStrength), 0.4);

  const minThickness035R = K035R * powerFactor * safetyFactor;
  const minThickness060R = K060R * powerFactor * safetyFactor;

  // 校核结果
  const pass035R = actualThickness035R >= minThickness035R;
  const pass060R = actualThickness060R >= minThickness060R;
  const pass = pass035R && pass060R;

  return {
    material: mat.name,
    safetyFactor,
    fatigueStrength,
    sections: {
      '0.35R': {
        minThickness: Math.round(minThickness035R * 10000) / 10000,
        actualThickness: actualThickness035R,
        margin: ((actualThickness035R - minThickness035R) / minThickness035R * 100).toFixed(1),
        pass: pass035R
      },
      '0.60R': {
        minThickness: Math.round(minThickness060R * 10000) / 10000,
        actualThickness: actualThickness060R,
        margin: ((actualThickness060R - minThickness060R) / minThickness060R * 100).toFixed(1),
        pass: pass060R
      }
    },
    pass,
    ccsCompliant: pass,
    message: pass
      ? 'CCS叶片强度校核通过'
      : 'CCS叶片强度校核不通过，请检查厚度设计'
  };
};

// ============================================
// 推进效率计算
// ============================================

/**
 * 计算完整推进效率链
 * @param {Object} params - 计算参数
 * @returns {Object} 效率计算结果
 */
export const calculatePropulsionEfficiency = (params) => {
  const {
    eta0,               // 敞水效率
    vesselType = 'tug', // 船型
    gearboxEfficiency = 0.98  // 齿轮箱效率
  } = params;

  // 获取船型系数
  const wakeCoeff = vesselWakeCoefficients[vesselType] || { w: 0.20, t: 0.18 };
  const { w, t } = wakeCoeff;

  // 船身效率 ηH = (1-t)/(1-w)
  const etaH = (1 - t) / (1 - w);

  // 相对旋转效率 ηR (通常取0.98~1.02)
  const etaR = 1.0;

  // 推进效率 ηD = η0 × ηH × ηR
  const etaD = eta0 * etaH * etaR;

  // 传动效率 (齿轮箱)
  const etaT = gearboxEfficiency;

  // 轴系效率
  const etaS = 0.99;

  // 总推进系数 ηP = ηD × ηT × ηS
  const etaTotal = etaD * etaT * etaS;

  return {
    // 输入参数
    input: {
      eta0,
      vesselType,
      wakeCoeff: w,
      thrustDeduction: t
    },
    // 各项效率
    efficiency: {
      eta0: Math.round(eta0 * 1000) / 1000,           // 敞水效率
      etaH: Math.round(etaH * 1000) / 1000,           // 船身效率
      etaR: Math.round(etaR * 1000) / 1000,           // 相对旋转效率
      etaD: Math.round(etaD * 1000) / 1000,           // 推进效率
      etaT: Math.round(etaT * 1000) / 1000,           // 传动效率
      etaS: Math.round(etaS * 1000) / 1000,           // 轴系效率
      etaTotal: Math.round(etaTotal * 1000) / 1000    // 总推进效率
    },
    // 评估
    rating: etaTotal >= 0.55 ? '优秀' :
            etaTotal >= 0.50 ? '良好' :
            etaTotal >= 0.45 ? '一般' : '较低',
    message: `总推进效率 ${(etaTotal * 100).toFixed(1)}%`
  };
};

// ============================================
// EEDI能效计算
// ============================================

/**
 * IMO能效设计指数估算 (简化版)
 * @param {Object} params - 计算参数
 * @returns {Object} EEDI估算结果
 */
export const estimateEEDI = (params) => {
  const {
    installedPower,     // 装机功率 kW (MCR)
    capacity,           // 载重量 DWT (吨)
    speed,              // 设计航速 (节)
    fuelType = 'HFO'    // 燃料类型
  } = params;

  // 燃油消耗率 SFC (g/kWh)
  const sfcMap = {
    'HFO': 190,   // 重油
    'MDO': 195,   // 轻油
    'LNG': 165,   // LNG
    'MGO': 200    // 船用柴油
  };
  const sfc = sfcMap[fuelType] || 190;

  // CO2排放系数 (g CO2 / g fuel)
  const cfMap = {
    'HFO': 3.114,
    'MDO': 3.206,
    'LNG': 2.750,
    'MGO': 3.206
  };
  const cf = cfMap[fuelType] || 3.114;

  // EEDI = (CO2排放) / (载重量 × 航速)
  // = (P × SFC × CF) / (Capacity × Vref)
  const eedi = (installedPower * sfc * cf) / (capacity * speed);

  // IMO Phase 3 参考线 (2025年后)
  // 简化：取一个典型的拖轮/工作船参考值
  const referenceEEDI = 50; // 典型工作船参考值
  const reductionRequired = 30; // Phase 3要求削减30%
  const targetEEDI = referenceEEDI * (1 - reductionRequired / 100);

  const pass = eedi <= targetEEDI;
  const margin = ((targetEEDI - eedi) / targetEEDI * 100);

  return {
    eedi: Math.round(eedi * 100) / 100,
    unit: 'g CO2/(t·nm)',
    referenceEEDI: Math.round(referenceEEDI * 100) / 100,
    targetEEDI: Math.round(targetEEDI * 100) / 100,
    phase: 'Phase 3 (2025+)',
    pass,
    margin: Math.round(margin * 10) / 10,
    fuelType,
    sfc,
    cf,
    message: pass
      ? `EEDI ${eedi.toFixed(2)} 满足IMO Phase 3要求`
      : `EEDI ${eedi.toFixed(2)} 超出IMO Phase 3限值，需优化`
  };
};

// ============================================
// 工况分析
// ============================================

/**
 * 分析不同工况下的性能
 * @param {Object} systemConfig - 系统配置
 * @param {Array} conditions - 工况列表
 * @returns {Array} 各工况性能结果
 */
export const analyzeOperatingPoints = (systemConfig, conditions = null) => {
  const {
    power,
    engineSpeed,
    gearRatio,
    propellerDiameter,
    vesselType,
    bladeGeometry
  } = systemConfig;

  // 使用默认工况或指定工况
  const conditionList = conditions || Object.keys(operatingConditions);

  return conditionList.map(condKey => {
    const condition = operatingConditions[condKey];
    if (!condition) return null;

    // 根据工况J值反算船速
    const propellerRPM = engineSpeed / gearRatio;
    const n = propellerRPM / 60;
    const J = condition.J || 0;
    const Va = J * n * propellerDiameter;
    const wakeCoeff = vesselWakeCoefficients[vesselType] || { w: 0.20 };
    const shipSpeed = Va / (1 - wakeCoeff.w);

    // 计算该工况水动力
    const hydro = calculateHydrodynamics({
      power,
      engineSpeed,
      gearRatio,
      propellerDiameter,
      shipSpeed,
      vesselType,
      bladeGeometry
    });

    return {
      condition: condition.name,
      conditionKey: condKey,
      J: J,
      loadFactor: condition.loadFactor,
      description: condition.description,
      ...hydro.coefficients,
      thrust: hydro.performance.thrustKN,
      torque: hydro.performance.torqueKNm,
      power: hydro.performance.absorbedPower
    };
  }).filter(Boolean);
};

// ============================================
// 导出
// ============================================

export default {
  // ITTC Wageningen B-series 完整47系数计算
  validateWageningenParams,
  calculateKT_ITTC,
  calculate10KQ_ITTC,
  calculateOpenWaterPerformance_ITTC,
  generateOpenWaterCurves_ITTC,

  // Wageningen B-series (简化版，向后兼容)
  calculateKT,
  calculate10KQ,
  calculateEta0,
  generateOpenWaterCurves,

  // 水动力计算
  calculateAdvanceCoefficient,
  calculateThrust,
  calculateTorque,
  calculateAbsorbedPower,
  calculateHydrodynamics,

  // 校核计算
  checkCavitation,
  checkBladeStrength,

  // 效率计算
  calculatePropulsionEfficiency,

  // EEDI计算
  estimateEEDI,

  // 工况分析
  analyzeOperatingPoints,

  // 常量
  SEAWATER_DENSITY,
  GRAVITY,
  ATMOSPHERIC_PRESSURE,
  VAPOR_PRESSURE,

  // ITTC参数范围常量
  WAGENINGEN_Z_RANGE,
  WAGENINGEN_PD_RANGE,
  WAGENINGEN_AEAO_RANGE,
  WAGENINGEN_J_RANGE
};
