/**
 * 船舶能效计算引擎
 * Ship Energy Efficiency Calculator
 *
 * 创建日期: 2026-01-04
 *
 * 实现标准:
 *   - IMO MEPC.333(76) EEXI计算方法
 *   - IMO MEPC.245(66) EEDI计算方法
 *   - 中国船级社《国际航行海船能效设计指数（EEDI）计算与验证指南》2024
 *
 * 参考来源:
 *   - https://www.imo.org/en/mediacentre/hottopics/pages/eexi-cii-faq.aspx
 *   - https://www.ccs.org.cn/ccswz/specialDetail?id=202409290323738031
 */

/**
 * 燃料碳转换系数 (t CO2 / t fuel)
 * Carbon Conversion Factors per IMO Guidelines
 */
export const CARBON_FACTORS = {
  // 重质燃油 Heavy Fuel Oil
  HFO: {
    name: '重质燃油',
    nameEN: 'Heavy Fuel Oil',
    CF: 3.114,      // t CO2 / t fuel
    lowerHeat: 40.2, // MJ/kg 低热值
    density: 0.991   // kg/L
  },
  // 轻质燃油 Light Fuel Oil
  LFO: {
    name: '轻质燃油',
    nameEN: 'Light Fuel Oil',
    CF: 3.151,
    lowerHeat: 41.2,
    density: 0.920
  },
  // 船用柴油 Marine Diesel Oil
  MDO: {
    name: '船用柴油',
    nameEN: 'Marine Diesel Oil',
    CF: 3.206,
    lowerHeat: 42.7,
    density: 0.890
  },
  // 船用轻柴油 Marine Gas Oil
  MGO: {
    name: '船用轻柴油',
    nameEN: 'Marine Gas Oil',
    CF: 3.206,
    lowerHeat: 42.7,
    density: 0.855
  },
  // 液化天然气 LNG
  LNG: {
    name: '液化天然气',
    nameEN: 'LNG',
    CF: 2.750,
    lowerHeat: 48.0,
    density: 0.450
  },
  // 液化石油气 LPG (Propane)
  LPG_PROPANE: {
    name: '液化石油气(丙烷)',
    nameEN: 'LPG Propane',
    CF: 3.000,
    lowerHeat: 46.3,
    density: 0.510
  },
  // 液化石油气 LPG (Butane)
  LPG_BUTANE: {
    name: '液化石油气(丁烷)',
    nameEN: 'LPG Butane',
    CF: 3.030,
    lowerHeat: 45.7,
    density: 0.580
  },
  // 甲醇 Methanol
  METHANOL: {
    name: '甲醇',
    nameEN: 'Methanol',
    CF: 1.375,
    lowerHeat: 19.9,
    density: 0.796
  },
  // 乙醇 Ethanol
  ETHANOL: {
    name: '乙醇',
    nameEN: 'Ethanol',
    CF: 1.913,
    lowerHeat: 26.8,
    density: 0.789
  },
  // 氨 Ammonia (零碳燃料)
  AMMONIA: {
    name: '氨',
    nameEN: 'Ammonia',
    CF: 0,
    lowerHeat: 18.6,
    density: 0.730
  }
};

/**
 * 典型比油耗 (g/kWh)
 * Specific Fuel Consumption Reference Values
 */
export const SFC_REFERENCE = {
  // 主机 Main Engine
  mainEngine: {
    lowSpeed: 165,      // 低速机 (二冲程)
    mediumSpeed: 185,   // 中速机 (四冲程)
    highSpeed: 210,     // 高速机
    default: 175        // 默认值
  },
  // 辅机 Auxiliary Engine
  auxiliaryEngine: {
    default: 215,       // 默认值
    withTechFile: 210   // 有技术案卷
  },
  // 齿轮箱效率损失
  gearboxLoss: 0.03     // 3% 效率损失
};

/**
 * EEDI/EEXI 折减系数 (%)
 * Reduction Factors by Ship Type and Phase
 */
export const REDUCTION_FACTORS = {
  // 散货船 Bulk Carrier
  bulkCarrier: {
    phase0: 0,    // 基线
    phase1: 10,   // 2015-2019
    phase2: 20,   // 2020-2024
    phase3: 30    // 2025+
  },
  // 油船 Tanker
  tanker: {
    phase0: 0,
    phase1: 10,
    phase2: 20,
    phase3: 30
  },
  // 集装箱船 Container Ship
  containerShip: {
    phase0: 0,
    phase1: 10,
    phase2: 20,
    phase3: 30   // ≥200,000 DWT: 50%
  },
  // 杂货船 General Cargo
  generalCargo: {
    phase0: 0,
    phase1: 10,
    phase2: 15,
    phase3: 30
  },
  // 冷藏船 Reefer
  reefer: {
    phase0: 0,
    phase1: 10,
    phase2: 15,
    phase3: 30
  },
  // LNG运输船
  lngCarrier: {
    phase0: 0,
    phase1: 10,
    phase2: 20,
    phase3: 30
  },
  // 滚装货船 Ro-Ro Cargo
  roRoCargo: {
    phase0: 0,
    phase1: 5,
    phase2: 20,
    phase3: 30
  },
  // 滚装客船 Ro-Ro Passenger
  roRoPassenger: {
    phase0: 0,
    phase1: 5,
    phase2: 20,
    phase3: 30
  },
  // 邮轮 Cruise
  cruise: {
    phase0: 0,
    phase1: 5,
    phase2: 20,
    phase3: 30
  }
};

/**
 * EEDI 基线参考值 (g CO2 / t·nm)
 * Reference Line Values by Ship Type
 */
export const EEDI_REFERENCE_LINES = {
  bulkCarrier: { a: 961.79, c: 0.477 },      // EEDI = a × DWT^(-c)
  tanker: { a: 1218.8, c: 0.488 },
  containerShip: { a: 174.22, c: 0.201 },
  generalCargo: { a: 107.48, c: 0.216 },
  reefer: { a: 227.01, c: 0.244 },
  lngCarrier: { a: 2253.7, c: 0.474 },
  roRoCargo: { a: 1405.15, c: 0.498 },
  roRoPassenger: { a: 752.16, c: 0.381 },
  cruise: { a: 170.84, c: 0.214 }
};

/**
 * 计算EEDI基线值
 * @param {string} shipType - 船舶类型
 * @param {number} capacity - 载重吨或总吨
 * @returns {number} EEDI基线值 (g CO2 / t·nm)
 */
export const calculateEEDIReferenceLine = (shipType, capacity) => {
  const ref = EEDI_REFERENCE_LINES[shipType];
  if (!ref) {
    console.warn(`Unknown ship type: ${shipType}, using bulkCarrier as default`);
    return EEDI_REFERENCE_LINES.bulkCarrier.a * Math.pow(capacity, -EEDI_REFERENCE_LINES.bulkCarrier.c);
  }
  return ref.a * Math.pow(capacity, -ref.c);
};

/**
 * 计算必需EEDI/EEXI
 * @param {string} shipType - 船舶类型
 * @param {number} capacity - 载重吨
 * @param {string} phase - 阶段 (phase0/phase1/phase2/phase3)
 * @returns {number} 必需EEDI值 (g CO2 / t·nm)
 */
export const calculateRequiredEEDI = (shipType, capacity, phase = 'phase3') => {
  const referenceLine = calculateEEDIReferenceLine(shipType, capacity);
  const reductionFactor = REDUCTION_FACTORS[shipType]?.[phase] || 0;
  return referenceLine * (1 - reductionFactor / 100);
};

/**
 * 计算辅机功率 PAE
 * @param {number} totalPropulsionPower - 总推进功率 (kW)
 * @returns {number} 估算辅机功率 (kW)
 */
export const estimateAuxiliaryPower = (totalPropulsionPower) => {
  if (totalPropulsionPower >= 10000) {
    // PAE = 0.025 × MCR_ME + 250
    return 0.025 * totalPropulsionPower + 250;
  } else {
    // PAE = 0.05 × MCR_ME
    return 0.05 * totalPropulsionPower;
  }
};

/**
 * 计算实际达到的EEDI
 * Attained EEDI Calculation
 *
 * @param {Object} params - 计算参数
 * @param {number} params.mainEnginePower - 主机功率 MCR (kW)
 * @param {number} params.auxEnginePower - 辅机功率 (kW), 可选，自动估算
 * @param {string} params.mainFuelType - 主机燃料类型
 * @param {string} params.auxFuelType - 辅机燃料类型，默认同主机
 * @param {number} params.sfcMain - 主机比油耗 (g/kWh)，可选
 * @param {number} params.sfcAux - 辅机比油耗 (g/kWh)，可选
 * @param {number} params.capacity - 载货能力 DWT (t)
 * @param {number} params.speed - 参考航速 Vref (kn)
 * @param {number} params.gearboxEfficiency - 齿轮箱效率，默认0.97
 * @param {Object} params.corrections - 修正系数
 * @returns {Object} EEDI计算结果
 */
export const calculateAttainedEEDI = (params) => {
  const {
    mainEnginePower,
    auxEnginePower,
    mainFuelType = 'MDO',
    auxFuelType,
    sfcMain,
    sfcAux,
    capacity,
    speed,
    gearboxEfficiency = 0.97,
    corrections = {}
  } = params;

  // 获取碳转换系数
  const cfMain = CARBON_FACTORS[mainFuelType]?.CF || 3.206;
  const cfAux = CARBON_FACTORS[auxFuelType || mainFuelType]?.CF || 3.206;

  // 比油耗
  const sfcMainValue = sfcMain || SFC_REFERENCE.mainEngine.default;
  const sfcAuxValue = sfcAux || SFC_REFERENCE.auxiliaryEngine.default;

  // 主机功率 (取MCR的75%)
  const pme = mainEnginePower * 0.75;

  // 辅机功率
  const pae = auxEnginePower || estimateAuxiliaryPower(mainEnginePower);

  // 齿轮箱效率修正
  const effectivePower = pme * gearboxEfficiency;

  // 修正系数 (默认都为1)
  const fj = corrections.fj || 1;      // 船舶特定设计因素
  const fw = corrections.fw || 1;      // 天气因素 (通常0.95-1.0)
  const fi = corrections.fi || 1;      // 冰级修正
  const fc = corrections.fc || 1;      // 立方容量修正
  const fl = corrections.fl || 1;      // 通用货船长度修正
  const feff = corrections.feff || 0;  // 能效技术降低因子

  // 计算 EEDI
  // EEDI = (CF_ME × SFC_ME × P_ME + CF_AE × SFC_AE × P_AE) × (1-feff) / (fi × fc × fl × Capacity × fw × Speed × fj)
  const numerator = (cfMain * sfcMainValue * effectivePower + cfAux * sfcAuxValue * pae) * (1 - feff);
  const denominator = fi * fc * fl * capacity * fw * speed * fj;

  const attainedEEDI = numerator / denominator;

  // CO2排放计算 (年度)
  const annualOperatingHours = 5000; // 假设年运行5000小时
  const loadFactor = 0.75;           // 平均负荷率

  const annualFuelConsumptionMain = (effectivePower * sfcMainValue * annualOperatingHours * loadFactor) / 1000000; // 吨
  const annualFuelConsumptionAux = (pae * sfcAuxValue * annualOperatingHours) / 1000000; // 吨
  const totalAnnualFuel = annualFuelConsumptionMain + annualFuelConsumptionAux;

  const annualCO2Emissions = annualFuelConsumptionMain * cfMain + annualFuelConsumptionAux * cfAux;

  return {
    attainedEEDI: Math.round(attainedEEDI * 100) / 100,
    unit: 'g CO₂/t·nm',
    components: {
      mainEnginePower: pme,
      auxEnginePower: pae,
      effectivePower,
      cfMain,
      cfAux,
      sfcMain: sfcMainValue,
      sfcAux: sfcAuxValue
    },
    annualEstimates: {
      operatingHours: annualOperatingHours,
      loadFactor: loadFactor * 100 + '%',
      fuelConsumption: {
        main: Math.round(annualFuelConsumptionMain * 10) / 10,
        auxiliary: Math.round(annualFuelConsumptionAux * 10) / 10,
        total: Math.round(totalAnnualFuel * 10) / 10,
        unit: 't/year'
      },
      co2Emissions: {
        total: Math.round(annualCO2Emissions * 10) / 10,
        unit: 't CO₂/year'
      }
    }
  };
};

/**
 * 评估EEDI合规性
 * @param {number} attainedEEDI - 实际达到的EEDI
 * @param {string} shipType - 船舶类型
 * @param {number} capacity - 载重吨
 * @param {number} buildYear - 建造年份
 * @returns {Object} 合规性评估结果
 */
export const evaluateEEDICompliance = (attainedEEDI, shipType, capacity, buildYear = 2025) => {
  // 确定阶段
  let phase;
  if (buildYear < 2015) phase = 'phase0';
  else if (buildYear < 2020) phase = 'phase1';
  else if (buildYear < 2025) phase = 'phase2';
  else phase = 'phase3';

  const referenceLine = calculateEEDIReferenceLine(shipType, capacity);
  const requiredEEDI = calculateRequiredEEDI(shipType, capacity, phase);
  const reductionFactor = REDUCTION_FACTORS[shipType]?.[phase] || 0;

  const isCompliant = attainedEEDI <= requiredEEDI;
  const margin = ((requiredEEDI - attainedEEDI) / requiredEEDI) * 100;
  const reductionAchieved = ((referenceLine - attainedEEDI) / referenceLine) * 100;

  // 评级
  let rating;
  if (reductionAchieved >= 40) rating = 'A';
  else if (reductionAchieved >= 30) rating = 'B';
  else if (reductionAchieved >= 20) rating = 'C';
  else if (reductionAchieved >= 10) rating = 'D';
  else rating = 'E';

  return {
    isCompliant,
    attainedEEDI: Math.round(attainedEEDI * 100) / 100,
    requiredEEDI: Math.round(requiredEEDI * 100) / 100,
    referenceLine: Math.round(referenceLine * 100) / 100,
    phase,
    reductionRequired: reductionFactor + '%',
    reductionAchieved: Math.round(reductionAchieved * 10) / 10 + '%',
    margin: Math.round(margin * 10) / 10 + '%',
    rating,
    ratingDescription: getRatingDescription(rating),
    recommendation: isCompliant
      ? '符合当前阶段EEDI要求'
      : `需降低EEDI ${Math.round((attainedEEDI - requiredEEDI) * 100) / 100} g CO₂/t·nm 以满足要求`
  };
};

/**
 * 获取评级描述
 */
const getRatingDescription = (rating) => {
  const descriptions = {
    'A': '优秀 - 显著超越当前标准',
    'B': '良好 - 达到Phase 3标准',
    'C': '合格 - 达到Phase 2标准',
    'D': '基本合格 - 达到Phase 1标准',
    'E': '不合格 - 未达到最低标准'
  };
  return descriptions[rating] || '未知';
};

/**
 * 计算CII (碳强度指标)
 * Carbon Intensity Indicator
 *
 * @param {number} annualCO2 - 年度CO2排放量 (吨)
 * @param {number} capacity - 载货能力 DWT (吨)
 * @param {number} distance - 年航行距离 (海里)
 * @returns {Object} CII计算结果
 */
export const calculateCII = (annualCO2, capacity, distance) => {
  // CII = 年度CO2排放 / (容量 × 距离)
  const attainedCII = (annualCO2 * 1000000) / (capacity * distance); // g CO2 / t·nm

  return {
    attainedCII: Math.round(attainedCII * 1000) / 1000,
    unit: 'g CO₂/t·nm',
    inputs: {
      annualCO2: annualCO2 + ' t',
      capacity: capacity + ' DWT',
      distance: distance + ' nm'
    }
  };
};

/**
 * 混合动力能效提升估算
 * @param {Object} baselineEEDI - 基准EEDI计算结果
 * @param {Object} hybridConfig - 混合动力配置
 * @returns {Object} 能效提升估算
 */
export const estimateHybridEfficiencyGain = (baselineEEDI, hybridConfig) => {
  if (!hybridConfig?.enabled) {
    return {
      improved: false,
      message: '未启用混合动力'
    };
  }

  let efficiencyGainPercent = 0;
  const gains = [];

  // PTO模式节能
  if (hybridConfig.modes?.pto) {
    const ptoGain = 8; // 平均8%节能
    efficiencyGainPercent += ptoGain;
    gains.push({ mode: 'PTO', gain: ptoGain + '%', description: '减少辅机运行' });
  }

  // PTI模式节能 (峰值工况优化)
  if (hybridConfig.modes?.pti) {
    const ptiGain = 5; // 平均5%优化
    efficiencyGainPercent += ptiGain;
    gains.push({ mode: 'PTI', gain: ptiGain + '%', description: '峰值功率优化' });
  }

  // PTH模式 (港区零排放，不计入EEDI但计入CII)
  if (hybridConfig.modes?.pth) {
    gains.push({ mode: 'PTH', gain: '港区100%', description: '港区零排放航行' });
  }

  // 计算改进后的EEDI
  const improvedEEDI = baselineEEDI.attainedEEDI * (1 - efficiencyGainPercent / 100);

  // 年度节省估算
  const baselineFuel = baselineEEDI.annualEstimates?.fuelConsumption?.total || 0;
  const fuelSaved = baselineFuel * (efficiencyGainPercent / 100);
  const co2Saved = fuelSaved * (CARBON_FACTORS.MDO.CF);

  return {
    improved: true,
    baseline: {
      eedi: baselineEEDI.attainedEEDI,
      annualFuel: baselineFuel + ' t',
      annualCO2: baselineEEDI.annualEstimates?.co2Emissions?.total + ' t'
    },
    hybrid: {
      eedi: Math.round(improvedEEDI * 100) / 100,
      efficiencyGain: efficiencyGainPercent + '%',
      gains
    },
    annualSavings: {
      fuel: Math.round(fuelSaved * 10) / 10 + ' t',
      co2: Math.round(co2Saved * 10) / 10 + ' t',
      costEstimate: Math.round(fuelSaved * 800) + ' USD' // 假设燃油价格 $800/吨
    }
  };
};

/**
 * 生成能效报告
 * @param {Object} params - 船舶参数
 * @returns {Object} 完整能效报告
 */
export const generateEnergyEfficiencyReport = (params) => {
  const {
    shipName = '未命名船舶',
    shipType = 'generalCargo',
    capacity,
    mainEnginePower,
    speed,
    fuelType = 'MDO',
    buildYear = 2025,
    hybridConfig = null
  } = params;

  // 计算基准EEDI
  const baselineEEDI = calculateAttainedEEDI({
    mainEnginePower,
    capacity,
    speed,
    mainFuelType: fuelType
  });

  // 合规性评估
  const compliance = evaluateEEDICompliance(
    baselineEEDI.attainedEEDI,
    shipType,
    capacity,
    buildYear
  );

  // 混合动力效益
  const hybridBenefits = estimateHybridEfficiencyGain(baselineEEDI, hybridConfig);

  // 如果启用混合动力，重新评估合规性
  let hybridCompliance = null;
  if (hybridBenefits.improved) {
    hybridCompliance = evaluateEEDICompliance(
      hybridBenefits.hybrid.eedi,
      shipType,
      capacity,
      buildYear
    );
  }

  return {
    metadata: {
      reportDate: new Date().toISOString().split('T')[0],
      shipName,
      shipType,
      buildYear
    },
    specifications: {
      capacity: capacity + ' DWT',
      mainEnginePower: mainEnginePower + ' kW',
      referenceSpeed: speed + ' kn',
      fuelType: CARBON_FACTORS[fuelType]?.name || fuelType
    },
    baseline: {
      eedi: baselineEEDI,
      compliance
    },
    hybrid: hybridConfig?.enabled ? {
      config: hybridConfig,
      benefits: hybridBenefits,
      compliance: hybridCompliance
    } : null,
    summary: {
      currentEEDI: baselineEEDI.attainedEEDI + ' g CO₂/t·nm',
      requiredEEDI: compliance.requiredEEDI + ' g CO₂/t·nm',
      isCompliant: compliance.isCompliant,
      rating: compliance.rating,
      recommendation: hybridBenefits.improved
        ? `启用混合动力可将EEDI降至 ${hybridBenefits.hybrid.eedi} g CO₂/t·nm，年节省燃油 ${hybridBenefits.annualSavings.fuel}，减排CO₂ ${hybridBenefits.annualSavings.co2}`
        : compliance.recommendation
    }
  };
};

export default {
  CARBON_FACTORS,
  SFC_REFERENCE,
  REDUCTION_FACTORS,
  EEDI_REFERENCE_LINES,
  calculateEEDIReferenceLine,
  calculateRequiredEEDI,
  estimateAuxiliaryPower,
  calculateAttainedEEDI,
  evaluateEEDICompliance,
  calculateCII,
  estimateHybridEfficiencyGain,
  generateEnergyEfficiencyReport
};
