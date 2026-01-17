/**
 * 扭振动态分析计算模块 - 数据结构定义
 *
 * 功能：固有频率、临界转速、阻尼比分析
 *
 * @module torsionalVibration
 */

// ============================================================
// 物理常量
// ============================================================

/** 圆周率 */
export const PI = Math.PI;

/** 钢材剪切模量 G (Pa) */
export const STEEL_SHEAR_MODULUS = 8.1e10;

/** 常用材料剪切模量 (Pa) */
export const SHEAR_MODULUS = {
  STEEL: 8.1e10,
  CAST_IRON: 4.2e10,
  ALUMINUM: 2.6e10,
};

// ============================================================
// 激励阶次常量
// ============================================================

/** 柴油机激励阶次 (按气缸数) */
export const DIESEL_EXCITATION_ORDERS = {
  4: [0.5, 1, 1.5, 2, 2.5, 3, 4],      // 四缸
  6: [0.5, 1, 1.5, 2, 3, 4.5, 6],      // 六缸
  8: [0.5, 1, 2, 4, 8],                 // 八缸
  12: [0.5, 1, 2, 3, 6, 12],            // 十二缸
};

/** 电机激励阶次 */
export const ELECTRIC_EXCITATION_ORDERS = [1, 2, 6, 12];

/** 螺旋桨激励阶次 (按叶片数) */
export const PROPELLER_EXCITATION_ORDERS = {
  3: [3, 6, 9],
  4: [4, 8, 12],
  5: [5, 10, 15],
};

// ============================================================
// 安全系数
// ============================================================

/** 临界转速避开区间系数 */
export const CRITICAL_SPEED_AVOIDANCE = {
  LOWER_RATIO: 0.8,   // 工作转速应 < 0.8 × 临界转速
  UPPER_RATIO: 1.2,   // 或 > 1.2 × 临界转速
};

/** 许用扭振应力系数 (基于材料屈服强度) */
export const ALLOWABLE_VIBRATION_STRESS_RATIO = 0.1;

// ============================================================
// 数据结构定义 (JSDoc类型)
// ============================================================

/**
 * @typedef {Object} MassInertia - 集中质量惯量
 * @property {string} name - 部件名称
 * @property {number} J - 转动惯量 (kg·m²)
 * @property {number} [position] - 轴向位置 (mm)
 */

/**
 * @typedef {Object} ShaftSection - 轴段刚度
 * @property {string} name - 轴段名称
 * @property {number} K - 扭转刚度 (N·m/rad)
 * @property {number} [length] - 轴段长度 (mm)
 * @property {number} [diameter] - 轴段直径 (mm)
 */

/**
 * @typedef {Object} TorsionalSystemInput - 扭振系统输入
 * @property {MassInertia[]} masses - 集中质量数组
 * @property {ShaftSection[]} shafts - 轴段刚度数组
 * @property {number} operatingSpeed - 工作转速 (rpm)
 * @property {'diesel'|'electric'} powerSourceType - 动力源类型
 * @property {number} [cylinderCount] - 气缸数 (柴油机)
 * @property {number} [bladeCount] - 螺旋桨叶片数
 */

/**
 * @typedef {Object} NaturalFrequencyResult - 固有频率结果
 * @property {number} omega - 角频率 ω (rad/s)
 * @property {number} frequency - 频率 f (Hz)
 * @property {number} criticalSpeed - 临界转速 (rpm)
 * @property {number[]} modeShape - 振型
 */

/**
 * @typedef {Object} TorsionalAnalysisResult - 扭振分析结果
 * @property {NaturalFrequencyResult[]} naturalFrequencies - 固有频率列表
 * @property {Object[]} criticalSpeedCheck - 临界转速校核
 * @property {boolean} isValid - 是否通过校核
 * @property {string[]} warnings - 警告信息
 */

// ============================================================
// 默认输入模板
// ============================================================

/** 创建默认扭振系统输入 */
export function createDefaultTorsionalInput() {
  return {
    masses: [
      { name: '飞轮', J: 5.0, position: 0 },
      { name: '齿轮箱输入端', J: 0.5, position: 500 },
      { name: '齿轮箱输出端', J: 0.8, position: 700 },
      { name: '螺旋桨', J: 15.0, position: 3000 },
    ],
    shafts: [
      { name: '输入轴', K: 1e6, length: 500, diameter: 80 },
      { name: '齿轮箱内', K: 5e6, length: 200, diameter: 100 },
      { name: '艉轴', K: 0.8e6, length: 2300, diameter: 90 },
    ],
    operatingSpeed: 1500,
    powerSourceType: 'diesel',
    cylinderCount: 6,
    bladeCount: 4,
  };
}

// ============================================================
// 计算函数占位 (后续实现)
// ============================================================

/**
 * 计算轴段扭转刚度
 * 公式: K = G × Ip / L, 其中 Ip = π × d⁴ / 32
 *
 * @param {Object} params - 计算参数
 * @param {number} params.diameter - 轴径 d (mm)
 * @param {number} params.length - 轴长 L (mm)
 * @param {number} [params.innerDiameter=0] - 内径 (mm), 空心轴
 * @param {number} [params.G=STEEL_SHEAR_MODULUS] - 剪切模量 (Pa)
 * @returns {Object} 刚度计算结果
 */
export function calculateShaftStiffness(params) {
  const { diameter, length, innerDiameter = 0, G = STEEL_SHEAR_MODULUS } = params;

  // 转换为米
  const d = diameter / 1000;
  const di = innerDiameter / 1000;
  const L = length / 1000;

  // 极惯性矩: Ip = π(d⁴ - di⁴) / 32
  const Ip = PI * (Math.pow(d, 4) - Math.pow(di, 4)) / 32;

  // 扭转刚度: K = G × Ip / L (N·m/rad)
  const K = G * Ip / L;

  return {
    stiffness: K,
    stiffnessFormatted: K.toExponential(3),
    Ip: Ip.toExponential(4),
    formula: `K = ${G.toExponential(2)} × ${Ip.toExponential(4)} / ${L} = ${K.toExponential(3)} N·m/rad`,
  };
}
/**
 * 计算单自由度系统固有频率
 * 公式: ω_n = √(K/J), f_n = ω_n / (2π)
 *
 * @param {Object} params - 计算参数
 * @param {number} params.stiffness - 扭转刚度 K (N·m/rad)
 * @param {number} params.inertia - 转动惯量 J (kg·m²)
 * @returns {Object} 固有频率结果
 */
export function calculateNaturalFrequency(params) {
  const { stiffness, inertia } = params;

  // 角频率: ω_n = √(K/J)
  const omega = Math.sqrt(stiffness / inertia);

  // 频率: f_n = ω_n / (2π)
  const frequency = omega / (2 * PI);

  // 临界转速: n_c = 60 × f_n
  const criticalSpeed = 60 * frequency;

  return {
    omega: omega.toFixed(2),
    frequency: frequency.toFixed(2),
    criticalSpeed: Math.round(criticalSpeed),
    formula: `ω = √(${stiffness.toExponential(2)} / ${inertia}) = ${omega.toFixed(2)} rad/s`,
  };
}

/**
 * 计算两质量系统固有频率 (简化模型)
 * 适用于发动机-螺旋桨系统
 *
 * @param {Object} params - 计算参数
 * @param {number} params.J1 - 发动机端惯量 (kg·m²)
 * @param {number} params.J2 - 螺旋桨端惯量 (kg·m²)
 * @param {number} params.K - 等效刚度 (N·m/rad)
 * @returns {Object} 固有频率结果
 */
export function calculateTwoMassFrequency(params) {
  const { J1, J2, K } = params;

  // 等效惯量: Je = J1 × J2 / (J1 + J2)
  const Je = (J1 * J2) / (J1 + J2);

  // 角频率: ω_n = √(K/Je)
  const omega = Math.sqrt(K / Je);
  const frequency = omega / (2 * PI);
  const criticalSpeed = 60 * frequency;

  // 振型比: θ2/θ1 = -J1/J2
  const modeRatio = -J1 / J2;

  return {
    omega: omega.toFixed(2),
    frequency: frequency.toFixed(2),
    criticalSpeed: Math.round(criticalSpeed),
    equivalentInertia: Je.toFixed(4),
    modeRatio: modeRatio.toFixed(3),
    nodePosition: `距发动机端 ${((J1 / (J1 + J2)) * 100).toFixed(1)}%`,
  };
}
/**
 * 计算各阶激励对应的临界转速
 *
 * @param {Object} params - 计算参数
 * @param {number} params.naturalFrequency - 固有频率 (Hz)
 * @param {number[]} params.excitationOrders - 激励阶次数组
 * @returns {Object[]} 各阶临界转速
 */
export function calculateCriticalSpeed(params) {
  const { naturalFrequency, excitationOrders } = params;

  return excitationOrders.map(order => {
    // 临界转速: n_c = 60 × f_n / order
    const criticalSpeed = (60 * naturalFrequency) / order;

    return {
      order,
      criticalSpeed: Math.round(criticalSpeed),
      formula: `n_c(${order}阶) = 60 × ${naturalFrequency} / ${order} = ${Math.round(criticalSpeed)} rpm`,
    };
  });
}
/**
 * 临界转速避开校核
 * 工作转速应在 0.8×n_c 以下 或 1.2×n_c 以上
 *
 * @param {Object} params - 计算参数
 * @param {number} params.operatingSpeed - 工作转速 (rpm)
 * @param {number} params.criticalSpeed - 临界转速 (rpm)
 * @param {number} params.order - 激励阶次
 * @returns {Object} 校核结果
 */
export function checkCriticalSpeedAvoidance(params) {
  const { operatingSpeed, criticalSpeed, order } = params;

  const lowerLimit = criticalSpeed * CRITICAL_SPEED_AVOIDANCE.LOWER_RATIO;
  const upperLimit = criticalSpeed * CRITICAL_SPEED_AVOIDANCE.UPPER_RATIO;

  // 判断是否在危险区间
  const inDangerZone = operatingSpeed >= lowerLimit && operatingSpeed <= upperLimit;
  const margin = inDangerZone
    ? 0
    : operatingSpeed < lowerLimit
      ? ((lowerLimit - operatingSpeed) / lowerLimit * 100)
      : ((operatingSpeed - upperLimit) / upperLimit * 100);

  return {
    order,
    criticalSpeed,
    lowerLimit: Math.round(lowerLimit),
    upperLimit: Math.round(upperLimit),
    operatingSpeed,
    inDangerZone,
    isValid: !inDangerZone,
    margin: margin.toFixed(1),
    status: inDangerZone ? '⚠️ 在共振区间内' : '✓ 避开共振区间',
  };
}
/**
 * 执行完整扭振分析
 *
 * @param {TorsionalSystemInput} input - 扭振系统输入
 * @returns {TorsionalAnalysisResult} 完整分析结果
 */
export function runTorsionalAnalysis(input) {
  const { masses, shafts, operatingSpeed, powerSourceType, cylinderCount, bladeCount } = input;
  const warnings = [];

  // 1. 计算等效刚度 (串联)
  let equivalentStiffness = 0;
  if (shafts.length > 0) {
    const stiffnessSum = shafts.reduce((sum, shaft) => sum + (1 / shaft.K), 0);
    equivalentStiffness = 1 / stiffnessSum;
  }

  // 2. 计算总惯量
  const totalInertia = masses.reduce((sum, mass) => sum + mass.J, 0);

  // 3. 简化为两质量系统计算固有频率
  const J1 = masses[0]?.J || 5;  // 发动机端
  const J2 = masses[masses.length - 1]?.J || 15;  // 螺旋桨端

  const frequencyResult = calculateTwoMassFrequency({
    J1,
    J2,
    K: equivalentStiffness,
  });

  // 4. 获取激励阶次
  let excitationOrders = [];
  if (powerSourceType === 'diesel' && cylinderCount) {
    excitationOrders = DIESEL_EXCITATION_ORDERS[cylinderCount] || [1, 2, 3, 4];
  } else {
    excitationOrders = ELECTRIC_EXCITATION_ORDERS;
  }

  // 添加螺旋桨激励
  if (bladeCount && PROPELLER_EXCITATION_ORDERS[bladeCount]) {
    excitationOrders = [...new Set([...excitationOrders, ...PROPELLER_EXCITATION_ORDERS[bladeCount]])];
  }

  // 5. 计算各阶临界转速
  const criticalSpeeds = calculateCriticalSpeed({
    naturalFrequency: parseFloat(frequencyResult.frequency),
    excitationOrders,
  });

  // 6. 临界转速避开校核
  const avoidanceChecks = criticalSpeeds.map(cs =>
    checkCriticalSpeedAvoidance({
      operatingSpeed,
      criticalSpeed: cs.criticalSpeed,
      order: cs.order,
    })
  );

  // 7. 检查是否有共振风险
  const dangerousOrders = avoidanceChecks.filter(check => check.inDangerZone);
  if (dangerousOrders.length > 0) {
    dangerousOrders.forEach(d => {
      warnings.push(`${d.order}阶激励临界转速${d.criticalSpeed}rpm在工作转速附近`);
    });
  }

  return {
    equivalentStiffness: equivalentStiffness.toExponential(3),
    totalInertia: totalInertia.toFixed(2),
    naturalFrequency: frequencyResult,
    criticalSpeeds,
    avoidanceChecks,
    isValid: dangerousOrders.length === 0,
    warnings,
    input,
    timestamp: new Date().toISOString(),
  };
}
