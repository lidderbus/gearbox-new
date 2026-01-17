/**
 * 混合动力选型工具函数
 * Hybrid Propulsion Selection Utilities
 *
 * 创建日期: 2026-01-03
 */

import {
  HYBRID_SELECTION_PARAMS,
  EMISSION_FACTORS,
  ADVANCE_HYBRID_SERIES
} from '../data/hybridPropulsionData';

/**
 * 计算推荐的PTI功率范围
 * @param {number} enginePower - 主机功率 (kW)
 * @returns {Object} { min, typical, max } in kW
 */
export const calculatePTIPowerRange = (enginePower) => {
  const params = HYBRID_SELECTION_PARAMS.ptiPowerRatio;
  return {
    min: Math.round(enginePower * params.min),
    typical: Math.round(enginePower * params.typical),
    max: Math.round(enginePower * params.max)
  };
};

/**
 * 计算推荐的PTO功率范围
 * @param {number} enginePower - 主机功率 (kW)
 * @returns {Object} { min, typical, max } in kW
 */
export const calculatePTOPowerRange = (enginePower) => {
  const params = HYBRID_SELECTION_PARAMS.ptoPowerRatio;
  return {
    min: Math.round(enginePower * params.min),
    typical: Math.round(enginePower * params.typical),
    max: Math.round(enginePower * params.max)
  };
};

/**
 * 估算燃油节省量
 * @param {Object} config - 混合动力配置
 * @param {number} annualFuelConsumption - 年燃油消耗量 (吨)
 * @returns {Object} 节省估算结果
 */
export const estimateFuelSavings = (config, annualFuelConsumption) => {
  const savings = HYBRID_SELECTION_PARAMS.fuelSavingsEstimate;

  let savingsPercentMin = 0;
  let savingsPercentMax = 0;

  if (config.modes?.pto) {
    savingsPercentMin = Math.max(savingsPercentMin, savings.ptoMode.min);
    savingsPercentMax = Math.max(savingsPercentMax, savings.ptoMode.max);
  }

  if (config.modes?.pti) {
    savingsPercentMin = Math.max(savingsPercentMin, savings.ptiMode.min);
    savingsPercentMax = Math.max(savingsPercentMax, savings.ptiMode.max);
  }

  const fuelSavingsMin = annualFuelConsumption * (savingsPercentMin / 100);
  const fuelSavingsMax = annualFuelConsumption * (savingsPercentMax / 100);

  return {
    percentMin: savingsPercentMin,
    percentMax: savingsPercentMax,
    tonsMin: Math.round(fuelSavingsMin * 10) / 10,
    tonsMax: Math.round(fuelSavingsMax * 10) / 10
  };
};

/**
 * 计算碳排放减少量
 * @param {number} fuelSavings - 燃油节省量 (吨)
 * @param {string} fuelType - 燃油类型 (MGO/MDO/HFO/LNG等)
 * @returns {number} CO2减排量 (吨)
 */
export const calculateEmissionReduction = (fuelSavings, fuelType = 'MGO') => {
  const factor = EMISSION_FACTORS.fuelTypes[fuelType]?.factor || 3.206;
  return Math.round(fuelSavings * factor * 10) / 10;
};

/**
 * 计算系统综合效率
 * @returns {number} 综合效率 (0-1)
 */
export const calculateSystemEfficiency = () => {
  const factors = HYBRID_SELECTION_PARAMS.efficiencyFactors;
  return (
    factors.gearboxEfficiency *
    factors.motorGeneratorEfficiency *
    factors.frequencyConverterEfficiency
  );
};

/**
 * 检查齿轮箱是否支持混合动力
 * @param {Object} gearbox - 齿轮箱对象
 * @param {Object} hybridConfig - 混合动力配置
 * @returns {Object} { supported, reason, estimatedModels }
 */
export const checkHybridCompatibility = (gearbox, hybridConfig) => {
  // 检查是否有已确认的混合动力型号
  const model = gearbox.model || '';
  const series = gearbox.series || '';

  // 基于功率范围匹配预估混合动力型号
  const maxPower = gearbox.maxPower || 0;
  const estimatedModels = ADVANCE_HYBRID_SERIES.estimatedModels.filter(m => {
    return maxPower >= m.minPower && maxPower <= m.maxPower;
  });

  // 大功率齿轮箱更可能支持PTI/PTO
  const isPowerSuitable = maxPower >= 300; // 300kW以上

  // 特定系列更可能支持
  const isSuitableSeries = ['HC', 'HCD', 'HCT', 'HCW'].some(s => series.startsWith(s));

  // 功率范围匹配
  const isPTIPowerOK = !hybridConfig.ptiPower ||
    (parseFloat(hybridConfig.ptiPower) <= maxPower * 0.25);
  const isPTOPowerOK = !hybridConfig.ptoPower ||
    (parseFloat(hybridConfig.ptoPower) <= maxPower * 0.20);

  if (!isPowerSuitable) {
    return {
      supported: false,
      reason: '功率较小，通常不配置混合动力系统',
      estimatedModels: []
    };
  }

  if (!isSuitableSeries) {
    return {
      supported: false,
      reason: '该系列暂无混合动力型号',
      estimatedModels: []
    };
  }

  if (!isPTIPowerOK || !isPTOPowerOK) {
    return {
      supported: false,
      reason: 'PTI/PTO功率需求超出齿轮箱能力',
      estimatedModels
    };
  }

  return {
    supported: true,
    reason: '该型号可配置混合动力系统（需联系厂家确认）',
    estimatedModels,
    note: '混合动力齿轮箱为定制产品'
  };
};

/**
 * 格式化混合动力配置摘要
 * @param {Object} config - 混合动力配置
 * @returns {string} 配置摘要文本
 */
export const formatHybridConfigSummary = (config) => {
  if (!config?.enabled) {
    return '未启用混合动力';
  }

  const modes = [];
  if (config.modes?.pto) modes.push(`PTO ${config.ptoPower || '?'}kW`);
  if (config.modes?.pti) modes.push(`PTI ${config.ptiPower || '?'}kW`);
  if (config.modes?.pth) modes.push('PTH');

  if (modes.length === 0) {
    return '混合动力已启用，未选择具体模式';
  }

  return `混合动力: ${modes.join(' + ')}`;
};

/**
 * 生成混合动力选型报告数据
 * @param {Object} gearbox - 选中的齿轮箱
 * @param {Object} hybridConfig - 混合动力配置
 * @param {Object} engineData - 发动机数据
 * @returns {Object} 报告数据
 */
export const generateHybridReport = (gearbox, hybridConfig, engineData) => {
  const compatibility = checkHybridCompatibility(gearbox, hybridConfig);
  const enginePower = parseFloat(engineData?.power) || 0;

  const ptiRange = calculatePTIPowerRange(enginePower);
  const ptoRange = calculatePTOPowerRange(enginePower);
  const systemEfficiency = calculateSystemEfficiency();

  // 估算年度节省 (假设年运行5000小时，75%负荷)
  const annualFuelConsumption = enginePower * 0.75 * 5000 * 0.000200; // 约200g/kWh油耗
  const savings = estimateFuelSavings(hybridConfig, annualFuelConsumption);
  const emissionReduction = calculateEmissionReduction(
    (savings.tonsMin + savings.tonsMax) / 2,
    hybridConfig.fuelType
  );

  return {
    gearboxModel: gearbox.model,
    compatibility,
    enginePower,
    config: hybridConfig,
    recommendations: {
      ptiPower: ptiRange,
      ptoPower: ptoRange
    },
    systemEfficiency: Math.round(systemEfficiency * 1000) / 10, // 百分比
    annualSavings: {
      fuel: savings,
      co2Reduction: emissionReduction
    },
    notes: [
      '以上为预估数据，实际效果取决于航行工况',
      '混合动力齿轮箱需定制生产，交货期约3-6个月',
      '建议联系杭州前进齿轮箱集团获取详细方案'
    ]
  };
};

export default {
  calculatePTIPowerRange,
  calculatePTOPowerRange,
  estimateFuelSavings,
  calculateEmissionReduction,
  calculateSystemEfficiency,
  checkHybridCompatibility,
  formatHybridConfigSummary,
  generateHybridReport
};
