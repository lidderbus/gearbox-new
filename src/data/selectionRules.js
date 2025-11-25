/**
 * 选型逻辑规则配置文件
 * 提取自核心选型算法，用于集中管理选型规则和参数
 */

// ============================================
// 1. 齿轮箱选型规则
// ============================================

/**
 * 齿轮箱选型参数阈值
 */
export const GEARBOX_SELECTION_PARAMS = {
  // 减速比偏差限制
  MAX_RATIO_DIFF_PERCENT: 25,         // 最大允许减速比偏差 25%
  NEAR_MATCH_RATIO_DIFF: 35,          // 近似匹配减速比偏差阈值 35%

  // 容量余量限制
  MAX_CAPACITY_MARGIN: 50,            // 最大容量余量 50%
  OPTIMAL_MARGIN_MIN: 5,              // 最佳余量下限 5%
  OPTIMAL_MARGIN_MAX: 20,             // 最佳余量上限 20%
  IDEAL_MARGIN_TARGET: 15,            // 理想余量目标 15%

  // 近似匹配系数
  NEAR_MATCH_CAPACITY_FACTOR: 0.85,   // 近似匹配容量系数 (至少85%需求)
  NEAR_MATCH_THRUST_FACTOR: 0.8,      // 近似匹配推力系数 (至少80%需求)
  NEAR_MATCH_MARGIN_FACTOR: 1.3       // 近似匹配余量扩展系数
};

/**
 * 齿轮箱评分权重配置
 */
export const GEARBOX_SCORING_WEIGHTS = {
  // 容量余量评分 (40分)
  capacityMargin: {
    weight: 40,
    rules: [
      { range: [5, 20], score: 40, description: '最佳余量' },
      { range: [20, 30], score: 30, description: '可接受' },
      { range: [30, 50], score: 20, description: '放宽标准' },
      { range: [0, 5], score: 25, description: '小余量' }
    ]
  },

  // 减速比匹配评分 (30分)
  ratioMatch: {
    weight: 30,
    rules: [
      { maxDiff: 3, score: 30, description: '精确匹配' },
      { maxDiff: 7, score: 25, description: '良好匹配' },
      { maxDiff: 12, score: 20, description: '可接受' },
      { maxDiff: 18, score: 15, description: '较宽匹配' },
      { maxDiff: 25, score: 10, description: '边界匹配' }
    ]
  },

  // 成本效益评分 (20分)
  costEfficiency: {
    weight: 20,
    description: '基于价格/容量比值标准化评分'
  },

  // 推力满足评分 (10分)
  thrustMatch: {
    weight: 10,
    rules: [
      { met: true, score: 10, description: '满足推力要求' },
      { noRequirement: true, score: 5, description: '无推力要求' },
      { met: false, score: 0, description: '不满足推力' }
    ]
  },

  // 特殊打包价格加分 (15分)
  specialPackagePrice: {
    weight: 15,
    description: 'GW系列特殊打包价格加分'
  }
};

// ============================================
// 2. 联轴器选型规则
// ============================================

/**
 * 工作条件系数映射
 */
export const WORK_CONDITION_FACTORS = {
  'I类:扭矩变化很小': 1.0,
  'II类:扭矩变化小': 1.2,
  'III类:扭矩变化中等': 1.4,
  'IV类:扭矩变化大': 1.6,
  'V类:扭矩变化很大': 1.8,
  default: 1.4
};

/**
 * 温度系数计算规则
 */
export const TEMPERATURE_FACTOR_RULES = [
  { maxTemp: 20, factor: 1.0, description: '标准温度' },
  { maxTemp: 40, factor: 1.1, description: '轻微高温' },
  { maxTemp: 60, factor: 1.2, description: '中等高温' },
  { maxTemp: 80, factor: 1.3, description: '高温' },
  { maxTemp: Infinity, factor: 1.4, description: '极高温' }
];

/**
 * 联轴器评分权重配置
 */
export const COUPLING_SCORING_WEIGHTS = {
  // 扭矩余量评分 (20分)
  torqueMargin: {
    weight: 20,
    rules: [
      { range: [10, 30], score: 20, description: '最佳余量' },
      { range: [30, 50], score: 15, description: '可接受' },
      { range: [50, Infinity], score: 10, description: '过度选型' },
      { range: [0, 10], score: 12, description: '小余量' }
    ]
  },

  // 推荐匹配评分 (30分)
  recommendedMatch: {
    weight: 30,
    rules: [
      { type: 'exact', score: 30, description: '精确推荐匹配' },
      { type: 'prefix', score: 20, description: '前缀匹配' },
      { type: 'none', score: 5, description: '无特定推荐' }
    ]
  },

  // 转速余量评分 (15分)
  speedMargin: {
    weight: 15,
    rules: [
      { range: [0, 20], score: 15, description: '理想速度余量' },
      { range: [20, 50], score: 12, description: '良好速度余量' },
      { range: [50, Infinity], score: 8, description: '过高速度余量' }
    ]
  },

  // 成本评分 (25分)
  cost: {
    weight: 25,
    description: '价格标准化评分'
  },

  // 重量评分 (10分)
  weight: {
    weight: 10,
    description: '重量标准化评分'
  }
};

// ============================================
// 3. 备用泵选型规则
// ============================================

/**
 * 备用泵需求判断规则
 */
export const PUMP_REQUIREMENT_RULES = {
  // 始终需要备用泵的系列
  alwaysRequired: ['GW', 'GC'],

  // HC系列需要备用泵的范围
  HC: {
    ranges: [
      { min: 1000, max: 1200 },
      { min: 1400, max: 2000 },
      { min: 2700, max: 2799 }
    ]
  },

  // DT系列需要备用泵的范围
  DT: {
    ranges: [
      { min: 180, max: 770 },
      { min: 900, max: 1400 },
      { min: 1500, max: 2400 }
    ]
  },

  // HCM/HCQ系列阈值
  HCM_HCQ: {
    minSeries: 300  // 系列号>=300需要备用泵
  },

  // 功率阈值 (其他系列)
  powerThreshold: 600  // kW
};

/**
 * 备用泵匹配规则
 */
export const PUMP_MATCHING_RULES = {
  // GW系列
  GW: [
    { range: ['GW28.30', 'GW45.49'], pump: '2CY-7.5/2.5D' },
    { range: ['GW49.54', 'GW52.62'], pump: '2CY-14.2/2.5D' },
    { range: ['GW60.66', 'GW60.74'], pump: '2CY-19.2/2.5D' },
    { range: ['GW63.71', 'GW999.99'], pump: '2CY-24.8/2.5D' }
  ],

  // HC系列
  HC: [
    { series: '1000-1200', pump: '2CY-5/2.5D' },
    { series: '1400-2000', pump: '2CY-7.5/2.5D' },
    { series: '2700', pump: '2CY-14.2/2.5D' }
  ],

  // DT系列
  DT: [
    { range: ['DT180', 'DT770'], pump: '2CYA-1.1/0.8D' },
    { range: ['DT900', 'DT1400'], pump: '2CYA-1.7/0.8D' },
    { range: ['DT1500', 'DT2400'], pump: '2CYA-2.2/1D' }
  ]
};

// ============================================
// 4. 价格计算规则
// ============================================

/**
 * 价格计算常量
 */
export const PRICE_CALCULATION_RULES = {
  // 基础常量
  DEFAULT_DISCOUNT_RATE: 0.10,
  MARKET_PRICE_MULTIPLIER: 1.1,

  // HC系列分级折扣率
  HC_DISCOUNT_RATES: {
    standard: 0.16,      // 小于600
    series600: 0.12,     // 600系列
    series800: 0.08,     // 800系列
    series1000Plus: 0.06 // 1000及以上
  },

  // 其他系列折扣率
  SERIES_DISCOUNT_RATES: {
    GW: 0.10,
    DT: 0.10,
    GC: 0.10,
    HCL: 0.12,
    coupling: 0.10,
    pump: 0.10
  },

  // 全国统一售价系列
  FIXED_PRICE_SERIES: ['HCM', 'HCQ', 'HCX', 'HCA', 'HCV', 'MV'],

  // 特殊型号折扣覆盖
  SPECIAL_MODEL_DISCOUNTS: {
    'J300': 0.22,
    'D300A': 0.22,
    'HC400': 0.22,
    'HCD400A': 0.22,
    'HC1200': 0.14,
    'HC1200/1': 0.10
  },

  // GW系列特殊打包价格
  GW_PACKAGE_PRICES: {
    'GWC42.45': 180000,
    'GWC45.49': 275000,
    'GWC45.52': 330000,
    'GWC49.54': 385000,
    'GWC49.59': 430000,
    'GWC52.59': 510000
  }
};

// ============================================
// 5. 齿轮箱→配件映射规则
// ============================================

/**
 * 齿轮箱→联轴器映射规则
 */
export const GEARBOX_TO_COUPLING_MAP = {
  // HC系列
  'HC300': 'HGTHT4',
  'D300A': 'HGTHT4',
  'J300': 'HGTHT4',
  'HC400': 'HGTHT4.5',
  'HC600': 'HGTHT6.3A',
  'HCD800': 'HGTHT8.6',
  'HCT800': 'HGTHT8.6',
  'HC1000': 'HGTHB5',
  'HC1200': 'HGHQT1210IW',
  'HC1200/1': 'HGTHB6.3A',
  'HC1400': 'HGTHB8',
  'HC1600': 'HGTHB10',
  'HC2000': 'HGTHB12.5',
  'HC2700': 'HGTHB16',

  // GW系列
  'GWC28.30': 'HGT2520',
  'GWC30.32': 'HGT3020',
  'GWC36.39': 'HGT4020',
  'GWC45.49': 'HGT6320',
  'GWC52.59': 'HGT8020',
  'GWC60.66': 'HGT10020',
  'GWC70.76': 'HGT16020',

  // HCM系列
  'HCM70': 'HGTHB3.2',
  'HCM160': 'HGTHB3.2',
  'HCM250': 'HGTHB5',
  'HCM435': 'HGTHB6.3',
  'HCM600': 'HGT1020',
  'HCM1250': 'HGT1620',
  'HCM1600': 'HGT2020',

  // DT系列
  'DT180': 'HGTHB3.2',
  'DT240': 'HGTHB5',
  'DT580': 'HGTHB6.3',
  'DT770': 'HGT1020',
  'DT900': 'HGT1220',
  'DT1400': 'HGT1620',
  'DT1500': 'HGT1500'
};

/**
 * 联轴器带罩壳型号映射
 */
export const COUPLING_COVER_MAP = {
  'HGTHB5': 'HGTHJB5',
  'HGTHB6.3A': 'HGTHJB6.3A',
  'HGTHB6.3': 'HGTHJB6.3',
  'HGTHB8': 'HGTHJB8',
  'HGTHB10': 'HGTHJB10',
  'HGTHB12.5': 'HGTHJB12.5',
  'HGTHB16': 'HGTHJB16',
  'HGT1020': 'HGT1020-ZB',
  'HGT1220': 'HGT1220-ZB',
  'HGT1620': 'HGT1620-ZB',
  'HGT2020': 'HGT2020-ZB',
  'HGT2520': 'HGT2520-ZB',
  'HGT3020': 'HGT3020-ZB',
  'HGT4020': 'HGT4020-ZB'
};

/**
 * 联轴器技术规格
 */
export const COUPLING_SPECIFICATIONS = {
  // HGTHT系列
  'HGTHT4': { ratedTorque: 4.0, maxTorque: 10.0, maxSpeed: 2400 },
  'HGTHT4.5': { ratedTorque: 4.5, maxTorque: 12.0, maxSpeed: 2400 },
  'HGTHT5': { ratedTorque: 5.0, maxTorque: 12.5, maxSpeed: 2400 },
  'HGTHT6.3A': { ratedTorque: 6.3, maxTorque: 18.0, maxSpeed: 2400 },
  'HGTHT8.6': { ratedTorque: 8.6, maxTorque: 21.5, maxSpeed: 2000 },

  // HGTHB系列
  'HGTHB3.2': { ratedTorque: 3.2, maxTorque: 8.0, maxSpeed: 3000 },
  'HGTHB5': { ratedTorque: 5.0, maxTorque: 12.5, maxSpeed: 3000 },
  'HGTHB6.3': { ratedTorque: 6.3, maxTorque: 15.75, maxSpeed: 3000 },
  'HGTHB6.3A': { ratedTorque: 6.3, maxTorque: 15.75, maxSpeed: 3000 },
  'HGTHB8': { ratedTorque: 8.0, maxTorque: 20.0, maxSpeed: 2800 },
  'HGTHB10': { ratedTorque: 10.0, maxTorque: 25.0, maxSpeed: 2500 },
  'HGTHB12.5': { ratedTorque: 12.5, maxTorque: 31.25, maxSpeed: 2200 },
  'HGTHB16': { ratedTorque: 16.0, maxTorque: 40.0, maxSpeed: 2000 },

  // HGT系列
  'HGT1020': { ratedTorque: 10.0, maxTorque: 25.0, maxSpeed: 3000 },
  'HGT1220': { ratedTorque: 12.5, maxTorque: 31.25, maxSpeed: 2800 },
  'HGT1620': { ratedTorque: 16.0, maxTorque: 40.0, maxSpeed: 2600 },
  'HGT2020': { ratedTorque: 20.0, maxTorque: 50.0, maxSpeed: 2400 },
  'HGT2520': { ratedTorque: 25.0, maxTorque: 62.5, maxSpeed: 2200 },
  'HGT3020': { ratedTorque: 31.5, maxTorque: 78.75, maxSpeed: 2000 },
  'HGT4020': { ratedTorque: 40.0, maxTorque: 100.0, maxSpeed: 1800 },
  'HGT5020': { ratedTorque: 50.0, maxTorque: 125.0, maxSpeed: 1600 },
  'HGT6320': { ratedTorque: 63.0, maxTorque: 157.5, maxSpeed: 1400 },
  'HGT8020': { ratedTorque: 80.0, maxTorque: 200.0, maxSpeed: 1200 },
  'HGT10020': { ratedTorque: 100.0, maxTorque: 250.0, maxSpeed: 1000 },
  'HGT12520': { ratedTorque: 125.0, maxTorque: 312.5, maxSpeed: 900 },
  'HGT16020': { ratedTorque: 160.0, maxTorque: 400.0, maxSpeed: 800 }
};

// ============================================
// 6. 计算公式函数
// ============================================

/**
 * 计算必要传递能力
 * @param {number} power 发动机功率 (kW)
 * @param {number} speed 发动机转速 (rpm)
 * @returns {number} 必要传递能力 (kW/rpm)
 */
export const calculateRequiredCapacity = (power, speed) => {
  return power / speed;
};

/**
 * 计算发动机扭矩
 * @param {number} power 发动机功率 (kW)
 * @param {number} speed 发动机转速 (rpm)
 * @returns {number} 发动机扭矩 (N·m)
 */
export const calculateEngineTorque = (power, speed) => {
  return (power * 9550) / speed;
};

/**
 * 计算容量余量
 * @param {number} actualCapacity 实际容量 (kW/rpm)
 * @param {number} requiredCapacity 必要容量 (kW/rpm)
 * @returns {number} 容量余量 (%)
 */
export const calculateCapacityMargin = (actualCapacity, requiredCapacity) => {
  return ((actualCapacity - requiredCapacity) / requiredCapacity) * 100;
};

/**
 * 计算减速比偏差
 * @param {number} actualRatio 实际减速比
 * @param {number} targetRatio 目标减速比
 * @returns {number} 减速比偏差 (%)
 */
export const calculateRatioDiff = (actualRatio, targetRatio) => {
  return (Math.abs(actualRatio - targetRatio) / targetRatio) * 100;
};

/**
 * 获取温度系数
 * @param {number} temperature 温度 (°C)
 * @returns {number} 温度系数
 */
export const getTemperatureFactor = (temperature) => {
  const temp = Number(temperature);
  if (isNaN(temp)) return 1.0;

  for (const rule of TEMPERATURE_FACTOR_RULES) {
    if (temp <= rule.maxTemp) {
      return rule.factor;
    }
  }
  return 1.4;
};

/**
 * 计算联轴器所需扭矩
 * @param {number} engineTorque 发动机扭矩 (N·m)
 * @param {string} workCondition 工作条件
 * @param {number} temperature 温度 (°C)
 * @returns {number} 所需联轴器扭矩 (kN·m)
 */
export const calculateRequiredCouplingTorque = (engineTorque, workCondition, temperature) => {
  const kFactor = WORK_CONDITION_FACTORS[workCondition] || WORK_CONDITION_FACTORS.default;
  const stFactor = getTemperatureFactor(temperature);
  return (engineTorque * kFactor * stFactor) / 1000;
};

/**
 * 计算工厂价
 * @param {number} basePrice 基础价格
 * @param {number} discountRate 折扣率
 * @returns {number} 工厂价
 */
export const calculateFactoryPrice = (basePrice, discountRate) => {
  return parseFloat((basePrice * (1 - discountRate)).toFixed(2));
};

/**
 * 计算市场价
 * @param {number} factoryPrice 工厂价
 * @returns {number} 市场价
 */
export const calculateMarketPrice = (factoryPrice) => {
  return parseFloat((factoryPrice * PRICE_CALCULATION_RULES.MARKET_PRICE_MULTIPLIER).toFixed(2));
};

// 默认导出
export default {
  GEARBOX_SELECTION_PARAMS,
  GEARBOX_SCORING_WEIGHTS,
  WORK_CONDITION_FACTORS,
  TEMPERATURE_FACTOR_RULES,
  COUPLING_SCORING_WEIGHTS,
  PUMP_REQUIREMENT_RULES,
  PUMP_MATCHING_RULES,
  PRICE_CALCULATION_RULES,
  GEARBOX_TO_COUPLING_MAP,
  COUPLING_COVER_MAP,
  COUPLING_SPECIFICATIONS,
  calculateRequiredCapacity,
  calculateEngineTorque,
  calculateCapacityMargin,
  calculateRatioDiff,
  getTemperatureFactor,
  calculateRequiredCouplingTorque,
  calculateFactoryPrice,
  calculateMarketPrice
};
