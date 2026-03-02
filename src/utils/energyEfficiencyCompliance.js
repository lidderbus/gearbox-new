// src/utils/energyEfficiencyCompliance.js
// IMO能效合规计算模块 v1.0
// 支持: EEXI (MEPC.333(76)), CII (MEPC.339(76)), EEDI Phase 3
// 更新日期: 2026-01-09

import { ENERGY_EFFICIENCY_STANDARDS, CO2_EMISSION_FACTORS } from '../data/cppSystemData';

// ============================================
// EEXI参考线数据 (IMO MEPC.333(76))
// Required EEXI = a × DWT^(-c)
// ============================================

/**
 * EEXI参考线系数 (按船型分类)
 * a, c 系数来自IMO MEPC.333(76)附录
 */
export const EEXI_REFERENCE_LINES = {
  bulkCarrier: {
    name: '散货船',
    nameEn: 'Bulk Carrier',
    ranges: [
      { minDWT: 0, maxDWT: 10000, a: 961.79, c: 0.477 },
      { minDWT: 10000, maxDWT: 279000, a: 961.79, c: 0.477 },
      { minDWT: 279000, maxDWT: Infinity, a: 961.79, c: 0.477 }
    ],
    reductionFactor: 0.30  // Phase 3: 30%削减
  },
  tanker: {
    name: '油轮',
    nameEn: 'Tanker',
    ranges: [
      { minDWT: 0, maxDWT: 4000, a: 1218.8, c: 0.488 },
      { minDWT: 4000, maxDWT: 250000, a: 1218.8, c: 0.488 },
      { minDWT: 250000, maxDWT: Infinity, a: 1218.8, c: 0.488 }
    ],
    reductionFactor: 0.30
  },
  containerShip: {
    name: '集装箱船',
    nameEn: 'Container Ship',
    ranges: [
      { minDWT: 0, maxDWT: 10000, a: 174.22, c: 0.201 },
      { minDWT: 10000, maxDWT: 250000, a: 174.22, c: 0.201 },
      { minDWT: 250000, maxDWT: Infinity, a: 174.22, c: 0.201 }
    ],
    reductionFactor: 0.50  // 集装箱船削减更多
  },
  generalCargo: {
    name: '杂货船',
    nameEn: 'General Cargo Ship',
    ranges: [
      { minDWT: 0, maxDWT: 3000, a: 107.48, c: 0.216 },
      { minDWT: 3000, maxDWT: 15000, a: 107.48, c: 0.216 },
      { minDWT: 15000, maxDWT: Infinity, a: 107.48, c: 0.216 }
    ],
    reductionFactor: 0.30
  },
  reefer: {
    name: '冷藏船',
    nameEn: 'Refrigerated Cargo Carrier',
    ranges: [
      { minDWT: 0, maxDWT: Infinity, a: 227.01, c: 0.244 }
    ],
    reductionFactor: 0.30
  },
  roRoCargoShip: {
    name: '滚装货船',
    nameEn: 'Ro-Ro Cargo Ship',
    ranges: [
      { minDWT: 0, maxDWT: Infinity, a: 1405.15, c: 0.498 }
    ],
    reductionFactor: 0.30
  },
  roRoPassengerShip: {
    name: '滚装客船',
    nameEn: 'Ro-Ro Passenger Ship',
    ranges: [
      { minDWT: 0, maxDWT: Infinity, a: 752.16, c: 0.381 }
    ],
    reductionFactor: 0.30
  },
  lngCarrier: {
    name: 'LNG运输船',
    nameEn: 'LNG Carrier',
    ranges: [
      { minDWT: 0, maxDWT: Infinity, a: 2253.7, c: 0.474 }
    ],
    reductionFactor: 0.30
  },
  cruiseShip: {
    name: '邮轮',
    nameEn: 'Cruise Passenger Ship',
    ranges: [
      { minDWT: 0, maxDWT: Infinity, a: 170.84, c: 0.214 }
    ],
    reductionFactor: 0.30
  },
  tug: {
    name: '拖轮',
    nameEn: 'Tug',
    ranges: [
      { minDWT: 0, maxDWT: Infinity, a: 50.0, c: 0.15 }
    ],
    reductionFactor: 0.20,
    note: '拖轮适用特殊规则'
  },
  offshoreSupplyVessel: {
    name: '海工辅助船',
    nameEn: 'Offshore Supply Vessel',
    ranges: [
      { minDWT: 0, maxDWT: Infinity, a: 65.0, c: 0.18 }
    ],
    reductionFactor: 0.20,
    note: '海工船适用特殊规则'
  }
};

// ============================================
// CII评级边界 (IMO MEPC.339(76))
// ============================================

/**
 * CII评级边界系数
 * 评级边界 = 参考值 × 系数
 */
export const CII_RATING_BOUNDARIES = {
  // 2024年边界系数
  2024: {
    superior: 0.83,    // A级上限
    lower: 0.94,       // B级上限
    upper: 1.065,      // C级上限
    inferior: 1.18     // D级上限，E级以上
  },
  // 2025年边界系数 (更严格)
  2025: {
    superior: 0.80,
    lower: 0.91,
    upper: 1.035,
    inferior: 1.15
  },
  // 2026年边界系数
  2026: {
    superior: 0.77,
    lower: 0.88,
    upper: 1.005,
    inferior: 1.12
  }
};

/**
 * CII参考值系数 (按船型)
 * CII_ref = a × Capacity^(-c)
 */
export const CII_REFERENCE_COEFFICIENTS = {
  bulkCarrier: { a: 4745, c: 0.622 },
  tanker: { a: 5247, c: 0.610 },
  containerShip: { a: 1984, c: 0.489 },
  generalCargo: { a: 588, c: 0.3885 },
  reefer: { a: 4600, c: 0.557 },
  lngCarrier: { a: 14405E7, c: 2.071 },
  roRoCargoShip: { a: 10952, c: 0.637 },
  cruiseShip: { a: 930, c: 0.383 },
  tug: { a: 150, c: 0.25 },
  offshoreSupplyVessel: { a: 200, c: 0.28 }
};

// ============================================
// EEXI计算
// ============================================

/**
 * 计算EEXI (能效设计指数)
 * EEXI = (P × SFC × CF) / (Capacity × Vref)
 *
 * @param {Object} params - 计算参数
 * @returns {Object} EEXI计算结果
 */
export const calculateEEXI = (params) => {
  const {
    shipType = 'generalCargo',  // 船型
    installedPower,             // 装机功率 kW (MCR)
    capacity,                   // 载重量 DWT (吨) 或 GT
    referenceSpeed,             // 参考航速 (节)
    fuelType = 'HFO',           // 燃料类型
    specificFuelConsumption,    // 燃油消耗率 g/kWh (可选)
    auxPower = 0,               // 辅机功率 kW (可选)
    shaftGenerator = 0,         // 轴带发电机功率 kW (可选)
    innovativeEnergy = 0        // 创新节能技术减排量 (可选)
  } = params;

  // 参数验证
  if (!installedPower || installedPower <= 0) {
    return { success: false, message: '装机功率必须大于0' };
  }
  if (!capacity || capacity <= 0) {
    return { success: false, message: '载重量必须大于0' };
  }
  if (!referenceSpeed || referenceSpeed <= 0) {
    return { success: false, message: '参考航速必须大于0' };
  }

  // 中文船型名→英文键映射
  const SHIP_TYPE_CN_MAP = {
    '散货船': 'bulkCarrier', '油轮': 'tanker', '集装箱船': 'containerShip',
    '杂货船': 'generalCargo', '冷藏船': 'reefer', '滚装货船': 'roRoCargoShip',
    '滚装客船': 'roRoPassengerShip', 'LNG运输船': 'lngCarrier', '邮轮': 'cruiseShip',
    '拖轮': 'generalCargo', '渔船': 'generalCargo', '工程船': 'generalCargo',
    'PSV': 'generalCargo', 'AHTS': 'generalCargo', '挖泥船': 'generalCargo',
    '客船': 'roRoPassengerShip', '货船': 'generalCargo'
  };
  const resolvedShipType = SHIP_TYPE_CN_MAP[shipType] || shipType;

  // 获取燃料参数
  const fuelData = CO2_EMISSION_FACTORS[fuelType] || CO2_EMISSION_FACTORS['HFO'];
  const cf = fuelData.factor;  // CO2排放系数 kg CO2/kg fuel

  // 燃油消耗率 (默认使用典型值)
  const sfc = specificFuelConsumption || getSFCByFuelType(fuelType);

  // 获取船型参考线
  const shipTypeData = EEXI_REFERENCE_LINES[resolvedShipType];
  if (!shipTypeData) {
    return { success: false, message: `未知船型: ${shipType}` };
  }

  // 查找适用的参考线范围
  const range = shipTypeData.ranges.find(r =>
    capacity >= r.minDWT && capacity < r.maxDWT
  ) || shipTypeData.ranges[shipTypeData.ranges.length - 1];

  // 计算参考EEXI
  const referenceEEXI = range.a * Math.pow(capacity, -range.c);

  // 计算要求EEXI (应用削减系数)
  const reductionFactor = shipTypeData.reductionFactor;
  const requiredEEXI = referenceEEXI * (1 - reductionFactor);

  // 有效功率计算 (考虑轴带发电机和创新技术)
  const effectivePower = installedPower - shaftGenerator + auxPower;

  // 计算实际EEXI
  // EEXI = (PME × CFME × SFCME + PAE × CFAE × SFCAE - Peff × feff) / (fi × fc × Capacity × Vref)
  // 简化版本:
  const attainedEEXI = (effectivePower * cf * sfc - innovativeEnergy) / (capacity * referenceSpeed);

  // 合规判断
  const compliant = attainedEEXI <= requiredEEXI;
  const margin = ((requiredEEXI - attainedEEXI) / requiredEEXI) * 100;
  const reductionNeeded = compliant ? 0 : Math.abs(margin);

  return {
    success: true,
    // 输入参数
    input: {
      shipType,
      shipTypeName: shipTypeData.name,
      installedPower,
      capacity,
      referenceSpeed,
      fuelType,
      fuelName: fuelData.name,
      sfc,
      cf
    },
    // EEXI值
    attainedEEXI: Math.round(attainedEEXI * 100) / 100,
    referenceEEXI: Math.round(referenceEEXI * 100) / 100,
    requiredEEXI: Math.round(requiredEEXI * 100) / 100,
    reductionFactor: reductionFactor * 100,
    // 合规状态
    compliant,
    margin: Math.round(margin * 10) / 10,
    reductionNeeded: Math.round(reductionNeeded * 10) / 10,
    // 单位和标准
    unit: 'g CO₂/(t·nm)',
    standard: 'IMO MEPC.333(76)',
    effectiveDate: '2023-01-01',
    // 消息
    message: compliant
      ? `EEXI ${attainedEEXI.toFixed(2)} 满足IMO要求 (限值: ${requiredEEXI.toFixed(2)})`
      : `EEXI ${attainedEEXI.toFixed(2)} 超出IMO限值 ${requiredEEXI.toFixed(2)}，需削减 ${reductionNeeded.toFixed(1)}%`
  };
};

/**
 * 获取燃料类型的典型SFC (Specific Fuel Consumption) 值
 * 数据来源: IMO MEPC.308(73) - 2018 Guidelines on the method of calculation of EEXI
 * 单位: g/kWh (克/千瓦时)
 *
 * @param {string} fuelType - 燃料类型
 * @returns {number} SFC值 g/kWh
 */
function getSFCByFuelType(fuelType) {
  // IMO标准燃油消耗率参考值 (g/kWh)
  // 来源: IMO MEPC.308(73) Table 1 - Reference SFC values
  const sfcMap = {
    'HFO': 190,     // 重油 Heavy Fuel Oil - IMO默认参考值
    'MDO': 195,     // 船用柴油 Marine Diesel Oil
    'MGO': 200,     // 船用轻油 Marine Gas Oil
    'LNG': 165,     // 液化天然气 - 低碳燃料
    'Methanol': 380,  // 甲醇 - 能量密度低，SFC高
    'Ammonia': 650    // 氨 - 零碳燃料但能量密度最低
  };
  return sfcMap[fuelType] || 190;  // 默认使用HFO的190 g/kWh
}

// ============================================
// CII计算
// ============================================

/**
 * 计算CII (碳强度指标)
 * CII = Annual CO2 emissions / (Capacity × Distance)
 *
 * @param {Object} params - 计算参数
 * @returns {Object} CII计算结果
 */
export const calculateCII = (params) => {
  const {
    shipType = 'generalCargo',
    capacity,                   // 载重量 DWT
    annualFuelConsumption,      // 年燃料消耗量 (吨)
    annualDistance,             // 年航行里程 (海里)
    fuelType = 'HFO',
    year = new Date().getFullYear()
  } = params;

  // 参数验证
  if (!capacity || capacity <= 0) {
    return { success: false, message: '载重量必须大于0' };
  }
  if (!annualFuelConsumption || annualFuelConsumption <= 0) {
    return { success: false, message: '年燃料消耗量必须大于0' };
  }
  if (!annualDistance || annualDistance <= 0) {
    return { success: false, message: '年航行里程必须大于0' };
  }

  // 获取燃料参数
  const fuelData = CO2_EMISSION_FACTORS[fuelType] || CO2_EMISSION_FACTORS['HFO'];
  const cf = fuelData.factor * 1000;  // 转换为 g CO2/kg fuel

  // 计算年CO2排放 (吨)
  const annualCO2 = annualFuelConsumption * fuelData.factor;

  // 计算实际CII
  // CII = M_CO2 / (Capacity × Distance)
  // 单位: g CO2 / (t × nm)
  const attainedCII = (annualCO2 * 1000000) / (capacity * annualDistance);

  // 获取CII参考系数
  const ciiCoeff = CII_REFERENCE_COEFFICIENTS[shipType];
  if (!ciiCoeff) {
    return { success: false, message: `未知船型: ${shipType}` };
  }

  // 计算CII参考值
  const ciiReference = ciiCoeff.a * Math.pow(capacity, -ciiCoeff.c);

  // 获取年度边界系数
  const boundaryYear = Math.min(Math.max(year, 2024), 2026);
  const boundaries = CII_RATING_BOUNDARIES[boundaryYear];

  // 计算各等级边界
  const ratingBoundaries = {
    A: ciiReference * boundaries.superior,
    B: ciiReference * boundaries.lower,
    C: ciiReference * boundaries.upper,
    D: ciiReference * boundaries.inferior
  };

  // 确定评级
  let rating;
  if (attainedCII <= ratingBoundaries.A) {
    rating = 'A';
  } else if (attainedCII <= ratingBoundaries.B) {
    rating = 'B';
  } else if (attainedCII <= ratingBoundaries.C) {
    rating = 'C';
  } else if (attainedCII <= ratingBoundaries.D) {
    rating = 'D';
  } else {
    rating = 'E';
  }

  // 评级描述
  const ratingDescriptions = {
    A: { level: '优秀', color: 'green', action: '无需改进' },
    B: { level: '良好', color: 'lightgreen', action: '建议保持' },
    C: { level: '合格', color: 'yellow', action: '建议改进' },
    D: { level: '较差', color: 'orange', action: '需要改进计划' },
    E: { level: '不合格', color: 'red', action: '强制改进' }
  };

  return {
    success: true,
    // 输入参数
    input: {
      shipType,
      capacity,
      annualFuelConsumption,
      annualDistance,
      fuelType,
      year
    },
    // CII值
    attainedCII: Math.round(attainedCII * 100) / 100,
    ciiReference: Math.round(ciiReference * 100) / 100,
    // 评级
    rating,
    ratingDescription: ratingDescriptions[rating],
    ratingBoundaries: {
      A: Math.round(ratingBoundaries.A * 100) / 100,
      B: Math.round(ratingBoundaries.B * 100) / 100,
      C: Math.round(ratingBoundaries.C * 100) / 100,
      D: Math.round(ratingBoundaries.D * 100) / 100
    },
    // 年CO2排放
    annualCO2: Math.round(annualCO2 * 10) / 10,
    // 单位和标准
    unit: 'g CO₂/(t·nm)',
    standard: 'IMO MEPC.339(76)',
    // 消息
    message: `CII评级: ${rating} (${ratingDescriptions[rating].level})，${ratingDescriptions[rating].action}`
  };
};

// ============================================
// CPP齿轮箱能效贡献评估
// ============================================

/**
 * 评估CPP系统对能效的贡献
 * @param {Object} cppSystem - CPP系统配置
 * @param {Object} vesselData - 船舶数据
 * @returns {Object} 能效贡献评估
 */
export const evaluateCPPEnergyContribution = (cppSystem, vesselData) => {
  const {
    gearboxEfficiency = 0.97,     // 齿轮箱效率
    propellerEfficiency = 0.65,   // 螺旋桨效率
    hybridReady = false,          // 混合动力就绪
    electricCompatible = false,   // 电力推进兼容
    variablePitch = true          // 变距功能
  } = cppSystem;

  const {
    installedPower,
    typicalOperatingProfile = 'mixed'  // transit, maneuvering, mixed
  } = vesselData;

  // 基础效率计算
  const baseSystemEfficiency = gearboxEfficiency * propellerEfficiency;

  // CPP变距优化节能估算
  const cppOptimizationFactors = {
    transit: 0.02,      // 航行工况: 2%节能
    maneuvering: 0.08,  // 机动工况: 8%节能
    mixed: 0.05         // 混合工况: 5%节能
  };
  const cppSaving = cppOptimizationFactors[typicalOperatingProfile] || 0.05;

  // 混合动力潜力
  const hybridPotential = hybridReady ? 0.10 : 0;  // 10%潜在节能

  // 电力推进潜力
  const electricPotential = electricCompatible ? 0.15 : 0;  // 15%潜在节能

  // 总节能潜力
  const totalSavingPotential = cppSaving + Math.max(hybridPotential, electricPotential);

  // 估算年燃料节省 (基于行业典型值)
  // 来源: 中国船检统计 - 内河/近海船舶年均运行4000小时
  const typicalAnnualHours = 4000;  // 年运行小时 (内河/近海船舶行业平均)
  // 来源: IMO MEPC.308(73) - HFO参考SFC
  const typicalSFC = 190;  // g/kWh (重油Heavy Fuel Oil标准值)
  const baseAnnualFuel = (installedPower * typicalAnnualHours * typicalSFC) / 1000000;  // 吨
  const fuelSaved = baseAnnualFuel * totalSavingPotential;

  // 估算CO2减排
  // 来源: IMO MEPC.245(66) Table 1 - CO2 emission factors
  // HFO (Heavy Fuel Oil): CF = 3.114 kg CO2/kg fuel
  const co2Factor = 3.114;  // kg CO2/kg HFO - IMO官方排放因子
  const co2Reduced = fuelSaved * co2Factor;

  // EEXI贡献估算
  const eexiContribution = -(totalSavingPotential * 100);  // 负值表示改善

  return {
    success: true,
    // 效率数据
    efficiency: {
      gearbox: Math.round(gearboxEfficiency * 1000) / 10,
      propeller: Math.round(propellerEfficiency * 1000) / 10,
      system: Math.round(baseSystemEfficiency * 1000) / 10
    },
    // 节能潜力
    savings: {
      cppOptimization: Math.round(cppSaving * 1000) / 10,
      hybridPotential: Math.round(hybridPotential * 1000) / 10,
      electricPotential: Math.round(electricPotential * 1000) / 10,
      total: Math.round(totalSavingPotential * 1000) / 10
    },
    // 年度估算
    annualEstimate: {
      fuelSaved: Math.round(fuelSaved * 10) / 10,
      co2Reduced: Math.round(co2Reduced * 10) / 10,
      costSaved: Math.round(fuelSaved * 600)  // 假设$600/吨燃料
    },
    // EEXI影响
    eexiContribution: Math.round(eexiContribution * 10) / 10,
    // CII影响等级
    ciiImpact: totalSavingPotential >= 0.10 ? 'very_positive' :
               totalSavingPotential >= 0.05 ? 'positive' :
               totalSavingPotential >= 0.02 ? 'slightly_positive' : 'neutral',
    // 功能标志
    features: {
      hybridReady,
      electricCompatible,
      variablePitch
    },
    message: `CPP系统预计可减少 ${(totalSavingPotential * 100).toFixed(1)}% 燃料消耗`
  };
};

// ============================================
// IMO 2030/2050目标评估
// ============================================

/**
 * 评估船舶相对于IMO目标的达成度
 * @param {Object} vesselData - 船舶能效数据
 * @returns {Object} 目标达成度评估
 */
export const evaluateIMOTargets = (vesselData) => {
  const {
    currentCII,           // 当前CII
    baselineCII,          // 基线CII (2008年水平)
    shipType = 'generalCargo'
  } = vesselData;

  // IMO目标: 2030年减少40%, 2050年减少70%
  const imoTargets = {
    2030: { reduction: 0.40, description: '2030年目标: 较2008年减排40%' },
    2050: { reduction: 0.70, description: '2050年目标: 较2008年减排70%' }
  };

  // 计算目标CII
  const baseline = baselineCII || currentCII * 1.5;  // 估算基线
  const target2030 = baseline * (1 - imoTargets[2030].reduction);
  const target2050 = baseline * (1 - imoTargets[2050].reduction);

  // 当前进度
  const currentReduction = (baseline - currentCII) / baseline;
  const progress2030 = currentReduction / imoTargets[2030].reduction;
  const progress2050 = currentReduction / imoTargets[2050].reduction;

  // 评估状态
  const getStatus = (progress) => {
    if (progress >= 1.0) return { status: 'achieved', icon: '✓', color: 'green' };
    if (progress >= 0.75) return { status: 'on_track', icon: '●', color: 'lightgreen' };
    if (progress >= 0.50) return { status: 'lagging', icon: '◐', color: 'yellow' };
    if (progress >= 0.25) return { status: 'behind', icon: '◔', color: 'orange' };
    return { status: 'far_behind', icon: '○', color: 'red' };
  };

  return {
    success: true,
    // 当前状态
    current: {
      cii: Math.round(currentCII * 100) / 100,
      baseline: Math.round(baseline * 100) / 100,
      reduction: Math.round(currentReduction * 1000) / 10
    },
    // 2030目标
    target2030: {
      cii: Math.round(target2030 * 100) / 100,
      reduction: imoTargets[2030].reduction * 100,
      progress: Math.round(progress2030 * 1000) / 10,
      ...getStatus(progress2030),
      description: imoTargets[2030].description
    },
    // 2050目标
    target2050: {
      cii: Math.round(target2050 * 100) / 100,
      reduction: imoTargets[2050].reduction * 100,
      progress: Math.round(progress2050 * 1000) / 10,
      ...getStatus(progress2050),
      description: imoTargets[2050].description
    },
    // 建议
    recommendations: generateEnergyRecommendations(currentReduction, vesselData)
  };
};

/**
 * 生成能效改进建议
 */
function generateEnergyRecommendations(currentReduction, vesselData) {
  const recommendations = [];

  if (currentReduction < 0.30) {
    recommendations.push({
      priority: 'high',
      category: '推进系统',
      action: '考虑升级到高效CPP系统',
      potentialSaving: '5-10%'
    });
    recommendations.push({
      priority: 'high',
      category: '能源管理',
      action: '实施航速优化(慢速航行)',
      potentialSaving: '10-20%'
    });
  }

  if (currentReduction < 0.50) {
    recommendations.push({
      priority: 'medium',
      category: '船体优化',
      action: '安装船体空气润滑系统',
      potentialSaving: '5-8%'
    });
    recommendations.push({
      priority: 'medium',
      category: '辅助设备',
      action: '升级变频驱动设备',
      potentialSaving: '3-5%'
    });
  }

  if (currentReduction < 0.70) {
    recommendations.push({
      priority: 'low',
      category: '替代燃料',
      action: '评估LNG或甲醇燃料转换',
      potentialSaving: '15-25%'
    });
    recommendations.push({
      priority: 'low',
      category: '可再生能源',
      action: '安装风帆辅助推进',
      potentialSaving: '5-15%'
    });
  }

  return recommendations;
}

// ============================================
// 混合动力兼容性评估
// ============================================

/**
 * 评估混合动力/电力推进兼容性
 * @param {Object} cppSystem - CPP系统配置
 * @returns {Object} 兼容性评估结果
 */
export const evaluateHybridCompatibility = (cppSystem) => {
  const {
    model,
    series,
    maxPower,
    hybridReady = false,
    electricCompatible = false,
    ptoPtoCapability = false,
    clutchType = 'mechanical'
  } = cppSystem;

  // 评估各项兼容性
  const compatibility = {
    // 并联混合 (柴油机+电机同时驱动)
    parallelHybrid: {
      compatible: hybridReady && ptoPtoCapability,
      readiness: hybridReady ? 'ready' : ptoPtoCapability ? 'adaptable' : 'not_compatible',
      modifications: []
    },
    // 串联混合 (柴油机发电，电机驱动)
    seriesHybrid: {
      compatible: electricCompatible,
      readiness: electricCompatible ? 'ready' : 'not_compatible',
      modifications: []
    },
    // 纯电力
    pureElectric: {
      compatible: electricCompatible,
      readiness: electricCompatible ? 'ready' : 'not_compatible',
      modifications: []
    },
    // 柴电混合
    dieselElectric: {
      compatible: ptoPtoCapability,
      readiness: ptoPtoCapability ? 'adaptable' : 'not_compatible',
      modifications: []
    }
  };

  // 添加所需改装
  if (!hybridReady) {
    compatibility.parallelHybrid.modifications.push('增加电机接口');
    compatibility.parallelHybrid.modifications.push('升级控制系统');
  }
  if (!ptoPtoCapability) {
    compatibility.parallelHybrid.modifications.push('安装PTO/PTI单元');
    compatibility.dieselElectric.modifications.push('安装PTO/PTI单元');
  }
  if (clutchType === 'mechanical') {
    compatibility.parallelHybrid.modifications.push('考虑升级到离合器');
  }

  // 综合评分
  let score = 0;
  if (hybridReady) score += 30;
  if (electricCompatible) score += 30;
  if (ptoPtoCapability) score += 25;
  if (clutchType !== 'mechanical') score += 15;

  const rating = score >= 80 ? 'excellent' :
                 score >= 60 ? 'good' :
                 score >= 40 ? 'fair' : 'limited';

  return {
    success: true,
    model,
    series,
    maxPower,
    compatibility,
    score,
    rating,
    ratingDescription: {
      excellent: '非常适合混合动力改装',
      good: '适合混合动力改装',
      fair: '可改装但需要较多工作',
      limited: '改装难度大，建议更换设备'
    }[rating],
    message: `混合动力兼容性评分: ${score}/100 (${rating})`
  };
};

// ============================================
// 导出
// ============================================

export default {
  // 常量数据
  EEXI_REFERENCE_LINES,
  CII_RATING_BOUNDARIES,
  CII_REFERENCE_COEFFICIENTS,

  // EEXI计算
  calculateEEXI,

  // CII计算
  calculateCII,

  // CPP能效评估
  evaluateCPPEnergyContribution,

  // IMO目标评估
  evaluateIMOTargets,

  // 混合动力评估
  evaluateHybridCompatibility
};
