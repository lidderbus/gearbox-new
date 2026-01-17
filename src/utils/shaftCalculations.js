/**
 * 轴系强度校核计算模块 - 数据结构定义
 *
 * 基于参考文档：
 * - VCS9255-401-S003JS_A_S 轴系强度校核计算书
 * - VCS9255B-401-S003JS_B_S 轴系强度校核计算书
 *
 * @module shaftCalculations
 */

// ============================================================
// 常量定义
// ============================================================

/** 轴径计算系数 F */
export const SHAFT_F_COEFFICIENTS = {
  STERN_SHAFT: 100,        // 艉轴
  INTERMEDIATE_SHAFT: 95,  // 中间轴
};

/** 动力源类型系数 K */
export const POWER_SOURCE_K_COEFFICIENTS = {
  DIESEL: 1.0,    // 内燃机驱动
  ELECTRIC: 0.9,  // 电机驱动
};

/** 法兰设计系数 */
export const FLANGE_COEFFICIENTS = {
  MIN_THICKNESS_RATIO: 0.2,   // t1 ≥ 0.2d
  MIN_RADIUS_RATIO: 0.08,     // r1 ≥ 0.08d
};

/** 键强度许用应力系数 (基于材料Rm) */
export const KEY_STRESS_COEFFICIENTS = {
  SHEAR_ALLOWABLE_RATIO: 0.25,      // [τ] = 0.25 × Rm
  COMPRESSION_ALLOWABLE_RATIO: 0.5, // [σ] = 0.5 × Rm
};

/** 螺栓摩擦系数 */
export const BOLT_FRICTION_COEFFICIENT = 0.2;

/** 艉轴后轴承最小长度系数 */
export const STERN_BEARING_MIN_LENGTH_RATIO = 2; // dm ≥ 2d

// ============================================================
// 预设材料数据库
// ============================================================

/** 常用轴材料 */
export const SHAFT_MATERIALS = {
  '35': { grade: '35', Rm: 530, ReL: 315, description: '35号钢' },
  '45': { grade: '45', Rm: 600, ReL: 355, description: '45号钢' },
  '40Cr': { grade: '40Cr', Rm: 785, ReL: 540, description: '40Cr合金钢' },
  '42CrMo': { grade: '42CrMo', Rm: 1080, ReL: 930, description: '42CrMo高强度钢' },
};

/** 常用螺栓材料 */
export const BOLT_MATERIALS = {
  '35': { grade: '35', strengthClass: '6.6', σs: 360, σb: 600 },
  '45': { grade: '45', strengthClass: '8.8', σs: 640, σb: 800 },
  '40Cr': { grade: '40Cr', strengthClass: '10.9', σs: 900, σb: 1000 },
};

/** 轴承许用压强 (MPa) */
export const BEARING_ALLOWABLE_PRESSURE = {
  WHITE_METAL: 0.8,       // 白合金
  RUBBER: 0.55,           // 橡胶
  SYNTHETIC_RESIN: 0.65,  // 合成树脂
};

// ============================================================
// 数据结构定义 (JSDoc类型)
// ============================================================

/**
 * @typedef {Object} PowerSource - 动力源参数
 * @property {'diesel'|'electric'} type - 动力源类型
 * @property {number} power - 额定功率 (kW)
 * @property {number} speed - 额定转速 (rpm)
 * @property {number} [inertia] - 转动惯量 (kg·m²)
 * @property {string} [manufacturer] - 制造厂
 * @property {string} [model] - 型号
 */

/**
 * @typedef {Object} Gearbox - 齿轮箱参数
 * @property {string} model - 型号
 * @property {number} ratio - 传动比
 * @property {number} [inertia] - 转动惯量 (kg·m²)
 * @property {number} [thrust] - 额定推力 (kN)
 */

/**
 * @typedef {Object} ShaftMaterial - 轴材料参数
 * @property {string} grade - 材料牌号
 * @property {number} Rm - 抗拉强度 (MPa)
 * @property {number} ReL - 屈服强度 (MPa)
 */

/**
 * @typedef {Object} BoltMaterial - 螺栓材料参数
 * @property {string} grade - 材料牌号
 * @property {string} strengthClass - 强度等级
 * @property {number} [σs] - 屈服强度 (MPa)
 * @property {number} [σb] - 抗拉强度 (MPa)
 */

/**
 * @typedef {Object} ShaftDimension - 单轴尺寸
 * @property {number} diameter - 直径 (mm)
 * @property {number} length - 长度 (mm)
 * @property {number} [innerDiameter] - 内径 (mm), 空心轴
 */

/**
 * @typedef {Object} ShaftSystemInput - 轴系计算输入参数
 * @property {PowerSource} powerSource - 动力源
 * @property {Gearbox} gearbox - 齿轮箱
 * @property {ShaftMaterial} shaftMaterial - 轴材料
 * @property {BoltMaterial} boltMaterial - 螺栓材料
 * @property {Object} shaftDimensions - 轴系尺寸
 * @property {ShaftDimension} shaftDimensions.sternShaft - 艉轴
 * @property {ShaftDimension} [shaftDimensions.intermediateShaft] - 中间轴
 * @property {string} [bearingType] - 轴承类型
 * @property {Object} [propeller] - 螺旋桨参数
 */

/**
 * @typedef {Object} ShaftCalculationResult - 轴系计算结果
 * @property {Object} basicDiameter - 基本轴径计算结果
 * @property {Object} flange - 法兰计算结果
 * @property {Object} key - 键强度校核结果
 * @property {Object} bolt - 螺栓强度校核结果
 * @property {Object} bearing - 轴承长度校核结果
 * @property {boolean} isValid - 是否全部通过校核
 * @property {string[]} warnings - 警告信息
 */

// ============================================================
// 默认输入值模板
// ============================================================

/** 创建默认输入参数 */
export function createDefaultInput() {
  return {
    powerSource: {
      type: 'diesel',
      power: 200,
      speed: 1500,
      inertia: 0,
      manufacturer: '',
      model: '',
    },
    gearbox: {
      model: '',
      ratio: 3.0,
      inertia: 0,
      thrust: 0,
    },
    shaftMaterial: { ...SHAFT_MATERIALS['35'] },
    boltMaterial: { ...BOLT_MATERIALS['35'] },
    shaftDimensions: {
      sternShaft: { diameter: 0, length: 0 },
      intermediateShaft: { diameter: 0, length: 0 },
    },
    bearingType: 'WHITE_METAL',
    propeller: {
      diameter: 0,
      pitch: 0,
      bladeCount: 4,
    },
  };
}

// ============================================================
// 计算函数占位 (后续实现)
// ============================================================

/**
 * 计算基本轴径
 * 公式: d = F × K × [Ne × 560 / ne / (Rm + 160)]^(1/3)
 *
 * @param {Object} params - 计算参数
 * @param {number} params.power - 额定功率 Ne (kW)
 * @param {number} params.speed - 额定转速 ne (rpm)
 * @param {number} params.Rm - 材料抗拉强度 (MPa)
 * @param {'stern'|'intermediate'} params.shaftType - 轴类型
 * @param {'diesel'|'electric'} params.powerSourceType - 动力源类型
 * @returns {Object} 计算结果
 */
export function calculateBasicShaftDiameter(params) {
  const { power, speed, Rm, shaftType = 'stern', powerSourceType = 'diesel' } = params;

  // 获取系数
  const F = shaftType === 'stern'
    ? SHAFT_F_COEFFICIENTS.STERN_SHAFT
    : SHAFT_F_COEFFICIENTS.INTERMEDIATE_SHAFT;

  const K = powerSourceType === 'electric'
    ? POWER_SOURCE_K_COEFFICIENTS.ELECTRIC
    : POWER_SOURCE_K_COEFFICIENTS.DIESEL;

  // 计算基本轴径: d = F × K × [Ne × 560 / ne / (Rm + 160)]^(1/3)
  const innerValue = (power * 560) / speed / (Rm + 160);
  const diameter = F * K * Math.pow(innerValue, 1 / 3);

  return {
    diameter: Math.ceil(diameter),         // 取整（向上）
    diameterExact: diameter.toFixed(2),    // 精确值
    F,
    K,
    formula: `d = ${F} × ${K} × [${power} × 560 / ${speed} / (${Rm} + 160)]^(1/3)`,
    shaftType,
    powerSourceType,
  };
}
/**
 * 计算可拆联轴器法兰参数
 * 法兰厚度: t1 ≥ 0.2d
 * 过渡圆角: r1 ≥ 0.08d
 *
 * @param {Object} params - 计算参数
 * @param {number} params.shaftDiameter - 轴径 d (mm)
 * @param {number} [params.actualThickness] - 实际法兰厚度 (mm)
 * @param {number} [params.actualRadius] - 实际过渡圆角 (mm)
 * @returns {Object} 计算结果
 */
export function calculateCouplingFlange(params) {
  const { shaftDiameter, actualThickness, actualRadius } = params;

  // 计算最小要求值
  const minThickness = shaftDiameter * FLANGE_COEFFICIENTS.MIN_THICKNESS_RATIO;
  const minRadius = shaftDiameter * FLANGE_COEFFICIENTS.MIN_RADIUS_RATIO;

  // 校核结果
  const thicknessValid = actualThickness ? actualThickness >= minThickness : null;
  const radiusValid = actualRadius ? actualRadius >= minRadius : null;

  return {
    minThickness: Math.ceil(minThickness * 10) / 10,  // 保留1位小数
    minRadius: Math.ceil(minRadius * 10) / 10,
    actualThickness,
    actualRadius,
    thicknessValid,
    radiusValid,
    isValid: thicknessValid !== false && radiusValid !== false,
    formulas: {
      thickness: `t1 ≥ 0.2 × ${shaftDiameter} = ${minThickness.toFixed(1)} mm`,
      radius: `r1 ≥ 0.08 × ${shaftDiameter} = ${minRadius.toFixed(1)} mm`,
    },
  };
}
/**
 * 计算键强度校核
 * 剪切应力: τ = T / (0.5 × b × l × d), τ ≤ [τ] = 0.25 × Rm
 * 挤压应力: σ = T / (0.25 × h × l × d), σ ≤ [σ] = 0.5 × Rm
 *
 * @param {Object} params - 计算参数
 * @param {number} params.torque - 扭矩 T (N·mm)
 * @param {number} params.keyWidth - 键宽 b (mm)
 * @param {number} params.keyHeight - 键高 h (mm)
 * @param {number} params.keyLength - 键长 l (mm)
 * @param {number} params.shaftDiameter - 轴径 d (mm)
 * @param {number} params.Rm - 材料抗拉强度 (MPa)
 * @returns {Object} 计算结果
 */
export function calculateKeyStrength(params) {
  const { torque, keyWidth, keyHeight, keyLength, shaftDiameter, Rm } = params;

  // 计算实际应力
  const shearStress = torque / (0.5 * keyWidth * keyLength * shaftDiameter);
  const compressStress = torque / (0.25 * keyHeight * keyLength * shaftDiameter);

  // 计算许用应力
  const allowableShear = Rm * KEY_STRESS_COEFFICIENTS.SHEAR_ALLOWABLE_RATIO;
  const allowableCompress = Rm * KEY_STRESS_COEFFICIENTS.COMPRESSION_ALLOWABLE_RATIO;

  // 校核结果
  const shearValid = shearStress <= allowableShear;
  const compressValid = compressStress <= allowableCompress;

  return {
    shearStress: shearStress.toFixed(2),
    compressStress: compressStress.toFixed(2),
    allowableShear: allowableShear.toFixed(2),
    allowableCompress: allowableCompress.toFixed(2),
    shearValid,
    compressValid,
    isValid: shearValid && compressValid,
    safetyFactorShear: (allowableShear / shearStress).toFixed(2),
    safetyFactorCompress: (allowableCompress / compressStress).toFixed(2),
    formulas: {
      shear: `τ = ${torque} / (0.5 × ${keyWidth} × ${keyLength} × ${shaftDiameter}) = ${shearStress.toFixed(2)} MPa`,
      compress: `σ = ${torque} / (0.25 × ${keyHeight} × ${keyLength} × ${shaftDiameter}) = ${compressStress.toFixed(2)} MPa`,
    },
  };
}
/**
 * 计算螺栓强度校核
 * 预紧力矩: T0 = K × d × F0
 * 摩擦力矩需大于传递扭矩
 *
 * @param {Object} params - 计算参数
 * @param {number} params.torque - 传递扭矩 T (N·mm)
 * @param {number} params.boltDiameter - 螺栓直径 d (mm)
 * @param {number} params.boltCount - 螺栓数量 n
 * @param {number} params.boltCircleDia - 螺栓分布圆直径 D (mm)
 * @param {number} params.preloadForce - 预紧力 F0 (N)
 * @param {number} [params.frictionCoef=0.2] - 摩擦系数 μ
 * @returns {Object} 计算结果
 */
export function calculateBoltStrength(params) {
  const { torque, boltDiameter, boltCount, boltCircleDia, preloadForce, frictionCoef = BOLT_FRICTION_COEFFICIENT } = params;

  // 预紧力矩: T0 = K × d × F0
  const preloadTorque = frictionCoef * boltDiameter * preloadForce;

  // 摩擦传递力矩: Tf = μ × n × F0 × D/2
  const frictionTorque = frictionCoef * boltCount * preloadForce * (boltCircleDia / 2);

  // 校核: 摩擦力矩 ≥ 传递扭矩
  const isValid = frictionTorque >= torque;
  const safetyFactor = frictionTorque / torque;

  return {
    preloadTorque: preloadTorque.toFixed(2),
    frictionTorque: frictionTorque.toFixed(2),
    requiredTorque: torque,
    safetyFactor: safetyFactor.toFixed(2),
    isValid,
    formulas: {
      preload: `T0 = ${frictionCoef} × ${boltDiameter} × ${preloadForce} = ${preloadTorque.toFixed(2)} N·mm`,
      friction: `Tf = ${frictionCoef} × ${boltCount} × ${preloadForce} × ${boltCircleDia}/2 = ${frictionTorque.toFixed(2)} N·mm`,
    },
  };
}
/**
 * 计算艉轴后轴承长度校核
 * 最小长度: Lm ≥ 2d (轴径的2倍)
 *
 * @param {Object} params - 计算参数
 * @param {number} params.shaftDiameter - 轴径 d (mm)
 * @param {number} [params.actualLength] - 实际轴承长度 (mm)
 * @param {string} [params.bearingType='WHITE_METAL'] - 轴承类型
 * @returns {Object} 计算结果
 */
export function calculateBearingLength(params) {
  const { shaftDiameter, actualLength, bearingType = 'WHITE_METAL' } = params;

  // 计算最小要求长度
  const minLength = shaftDiameter * STERN_BEARING_MIN_LENGTH_RATIO;

  // 获取许用压强
  const allowablePressure = BEARING_ALLOWABLE_PRESSURE[bearingType] || BEARING_ALLOWABLE_PRESSURE.WHITE_METAL;

  // 校核结果
  const isValid = actualLength ? actualLength >= minLength : null;

  return {
    minLength: Math.ceil(minLength),
    actualLength,
    isValid,
    allowablePressure,
    bearingType,
    formula: `Lm ≥ 2 × ${shaftDiameter} = ${minLength} mm`,
  };
}
/**
 * 执行完整轴系强度计算
 *
 * @param {ShaftSystemInput} input - 完整输入参数
 * @returns {ShaftCalculationResult} 完整计算结果
 */
export function runFullCalculation(input) {
  const { powerSource, gearbox, shaftMaterial, shaftDimensions } = input;
  const warnings = [];

  // 1. 计算基本轴径
  const sternShaftResult = calculateBasicShaftDiameter({
    power: powerSource.power,
    speed: powerSource.speed,
    Rm: shaftMaterial.Rm,
    shaftType: 'stern',
    powerSourceType: powerSource.type,
  });

  const intermediateShaftResult = calculateBasicShaftDiameter({
    power: powerSource.power,
    speed: powerSource.speed,
    Rm: shaftMaterial.Rm,
    shaftType: 'intermediate',
    powerSourceType: powerSource.type,
  });

  // 2. 计算法兰参数
  const flangeResult = calculateCouplingFlange({
    shaftDiameter: sternShaftResult.diameter,
    actualThickness: shaftDimensions.sternShaft?.flangeThickness,
    actualRadius: shaftDimensions.sternShaft?.flangeRadius,
  });

  // 3. 计算轴承长度
  const bearingResult = calculateBearingLength({
    shaftDiameter: sternShaftResult.diameter,
    actualLength: shaftDimensions.sternShaft?.bearingLength,
    bearingType: input.bearingType,
  });

  // 校验并添加警告
  if (shaftDimensions.sternShaft?.diameter && shaftDimensions.sternShaft.diameter < sternShaftResult.diameter) {
    warnings.push(`艉轴实际直径(${shaftDimensions.sternShaft.diameter}mm)小于计算最小值(${sternShaftResult.diameter}mm)`);
  }

  return {
    basicDiameter: {
      sternShaft: sternShaftResult,
      intermediateShaft: intermediateShaftResult,
    },
    flange: flangeResult,
    bearing: bearingResult,
    isValid: flangeResult.isValid !== false && bearingResult.isValid !== false && warnings.length === 0,
    warnings,
    input,
    timestamp: new Date().toISOString(),
  };
}
