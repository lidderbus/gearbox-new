// src/utils/pumpSelectionAlgorithm.js
// 独立备用泵选型算法
// 版本: v1.0 (2025-12-14)
// 支持基于流量、压力参数的独立选型，以及齿轮箱匹配选型

// 性能优化: 改为动态导入
// import { standbyPumps, pumpCategories, pumpSeriesInfo } from '../data/standbyPumps';

// 缓存动态加载的数据
let cachedStandbyPumps = [];
let cachedPumpCategories = {};
let cachedPumpSeriesInfo = {};

/**
 * 动态加载备用泵数据
 */
export async function loadStandbyPumpsData() {
  if (cachedStandbyPumps.length > 0) {
    return { standbyPumps: cachedStandbyPumps, pumpCategories: cachedPumpCategories, pumpSeriesInfo: cachedPumpSeriesInfo };
  }
  const module = await import(
    /* webpackChunkName: "pump-data" */
    '../data/standbyPumps'
  );
  cachedStandbyPumps = module.standbyPumps || [];
  cachedPumpCategories = module.pumpCategories || {};
  cachedPumpSeriesInfo = module.pumpSeriesInfo || {};
  return { standbyPumps: cachedStandbyPumps, pumpCategories: cachedPumpCategories, pumpSeriesInfo: cachedPumpSeriesInfo };
}

/**
 * 获取备用泵数据 (同步，需先调用loadStandbyPumpsData)
 */
export function getStandbyPumps() {
  return cachedStandbyPumps;
}

export function getPumpCategories() {
  return cachedPumpCategories;
}

export function getPumpSeriesInfo() {
  return cachedPumpSeriesInfo;
}

// 兼容性: 提供默认变量供同步代码使用
const standbyPumps = [];  // 将在运行时被缓存填充
const pumpCategories = {};
const pumpSeriesInfo = {};

/**
 * 根据流量和压力需求选择备用泵
 * @param {Object} requirements - 选型需求
 * @param {number} requirements.flowRequired - 所需流量 (L/min)
 * @param {number} requirements.pressureRequired - 所需压力 (MPa)
 * @param {string} requirements.applicationType - 应用类型: general/control/emergency/dt-electric
 * @param {string} requirements.seriesPreference - 系列偏好: 2CY-D/2CYA/null
 * @param {Array} pumpList - 备用泵列表 (可选，默认使用缓存数据)
 * @returns {Object} - 选型结果
 */
export const selectPumpByParameters = (requirements, pumpList = null) => {
  // 使用传入的列表或缓存的数据
  const pumps = pumpList || getStandbyPumps();
  const {
    flowRequired,
    pressureRequired,
    applicationType = 'general',
    seriesPreference = null
  } = requirements;

  // 验证输入
  if (!flowRequired || flowRequired <= 0) {
    return {
      success: false,
      message: '请输入有效的流量需求 (> 0 L/min)',
      recommendations: []
    };
  }

  if (!pressureRequired || pressureRequired <= 0) {
    return {
      success: false,
      message: '请输入有效的压力需求 (> 0 MPa)',
      recommendations: []
    };
  }

  let candidates = [...pumps];

  // 根据应用类型筛选系列
  if (applicationType === 'dt-electric' || seriesPreference === '2CYA') {
    candidates = candidates.filter(p =>
      p.series === '2CYA' || p.model?.startsWith('2CYA')
    );
  } else if (seriesPreference === '2CY-D') {
    candidates = candidates.filter(p =>
      p.series === '2CY-D' || (p.model?.startsWith('2CY-') && !p.model?.startsWith('2CYA'))
    );
  }

  // 按流量和压力筛选
  candidates = candidates.filter(pump =>
    pump.flow >= flowRequired && pump.pressure >= pressureRequired
  );

  if (candidates.length === 0) {
    return {
      success: false,
      message: applicationType === 'dt-electric'
        ? '未找到满足需求的DT系列电动泵，请调整参数或选择其他系列'
        : '未找到满足需求的备用泵，请调整流量或压力参数',
      recommendations: [],
      suggestion: calculateSuggestion(flowRequired, pressureRequired, pumps)
    };
  }

  // 评分和排序
  const scoredCandidates = candidates.map(pump => {
    const flowMargin = (pump.flow - flowRequired) / flowRequired * 100;
    const pressureMargin = (pump.pressure - pressureRequired) / pressureRequired * 100;

    // 评分规则: 余量适中(10-30%)得分最高
    let score = 100;

    // 流量评分 (40分满分)
    if (flowMargin <= 30) score += 40;
    else if (flowMargin <= 50) score += 30;
    else if (flowMargin <= 100) score += 15;
    else score += 5;

    // 压力评分 (40分满分)
    if (pressureMargin <= 30) score += 40;
    else if (pressureMargin <= 50) score += 30;
    else if (pressureMargin <= 100) score += 15;
    else score += 5;

    // 价格评分 (20分满分) - 价格越低越好
    const priceScore = Math.max(0, 20 - ((pump.marketPrice || pump.price || 0) / 1000));
    score += priceScore;

    // 确定匹配类型
    let matchType = '可用匹配';
    if (flowMargin <= 30 && pressureMargin <= 30) {
      matchType = '最佳匹配';
    } else if (flowMargin <= 50 && pressureMargin <= 50) {
      matchType = '良好匹配';
    }

    return {
      ...pump,
      flowMargin: flowMargin.toFixed(1),
      pressureMargin: pressureMargin.toFixed(1),
      score: Math.round(score),
      matchType,
      matchInfo: `流量余量 ${flowMargin.toFixed(1)}%, 压力余量 ${pressureMargin.toFixed(1)}%`
    };
  }).sort((a, b) => b.score - a.score);

  const bestMatch = scoredCandidates[0];
  const alternatives = scoredCandidates.slice(1, 4);

  return {
    success: true,
    message: `找到 ${scoredCandidates.length} 个匹配的备用泵`,
    model: bestMatch.model,
    ...bestMatch,
    alternatives,
    recommendations: scoredCandidates,
    selectionCriteria: {
      flowRequired,
      pressureRequired,
      applicationType
    }
  };
};

/**
 * 根据齿轮箱型号选择备用泵
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {Array} pumpList - 备用泵列表
 * @param {Object} options - 选项
 * @returns {Object} - 选型结果
 */
export const selectPumpByGearbox = (gearboxModel, pumpList = standbyPumps, options = {}) => {
  if (!gearboxModel) {
    return {
      success: false,
      message: '请提供齿轮箱型号',
      recommendations: []
    };
  }

  // 首先查找直接匹配
  const directMatch = pumpList.find(pump =>
    pump.applicableGearbox && pump.applicableGearbox.includes(gearboxModel)
  );

  if (directMatch) {
    // 找到直接匹配，同时返回备选
    const sameSeries = pumpList.filter(p =>
      p.series === directMatch.series && p.model !== directMatch.model
    );

    return {
      success: true,
      message: `找到齿轮箱 ${gearboxModel} 的匹配备用泵`,
      model: directMatch.model,
      ...directMatch,
      matchType: '直接匹配',
      matchInfo: `根据配套规则，${gearboxModel} 配套 ${directMatch.model}`,
      alternatives: sameSeries.slice(0, 3),
      recommendations: [directMatch, ...sameSeries]
    };
  }

  // 无直接匹配，尝试系列匹配
  const seriesMatch = findSeriesMatch(gearboxModel, pumpList);
  if (seriesMatch) {
    return seriesMatch;
  }

  return {
    success: false,
    message: `未找到齿轮箱 ${gearboxModel} 的匹配备用泵`,
    recommendations: [],
    suggestion: {
      message: '可以尝试使用参数选型功能，根据流量和压力需求选择合适的泵'
    }
  };
};

/**
 * 根据齿轮箱系列匹配泵
 */
function findSeriesMatch(gearboxModel, pumpList) {
  // 提取系列前缀
  const seriesPatterns = [
    { pattern: /^DT(\d+)/, pumpSeries: '2CYA', type: 'electric' },
    { pattern: /^HC(\d+)/, pumpSeries: '2CY-D', type: 'mechanical' },
    { pattern: /^HCD(\d+)/, pumpSeries: '2CY-D', type: 'mechanical' },
    { pattern: /^HCT(\d+)/, pumpSeries: '2CY-D', type: 'mechanical' },
    { pattern: /^GWC/, pumpSeries: '2CY-D', type: 'mechanical' },
    { pattern: /^GW/, pumpSeries: '2CY-D', type: 'mechanical' }
  ];

  for (const { pattern, pumpSeries, type } of seriesPatterns) {
    if (pattern.test(gearboxModel)) {
      const seriesPumps = pumpList.filter(p => p.series === pumpSeries);
      if (seriesPumps.length > 0) {
        const recommended = seriesPumps[0];
        return {
          success: true,
          message: `根据齿轮箱系列推荐 ${pumpSeries} 系列泵`,
          model: recommended.model,
          ...recommended,
          matchType: '系列匹配',
          matchInfo: `${gearboxModel} 属于${type === 'electric' ? 'DT电推' : '传统'}系列，推荐${pumpSeries}系列泵`,
          alternatives: seriesPumps.slice(1, 4),
          recommendations: seriesPumps
        };
      }
    }
  }

  return null;
}

/**
 * 计算建议参数
 */
function calculateSuggestion(flowReq, pressureReq, pumpList) {
  const allFlows = pumpList.map(p => p.flow).sort((a, b) => a - b);
  const allPressures = pumpList.map(p => p.pressure).sort((a, b) => a - b);
  const maxFlow = allFlows[allFlows.length - 1];
  const maxPressure = Math.max(...allPressures);

  return {
    availableFlowRange: `${allFlows[0]} - ${maxFlow} L/min`,
    availablePressureRange: `${allPressures[0]} - ${maxPressure} MPa`,
    suggestedFlow: flowReq > maxFlow ? maxFlow : null,
    suggestedPressure: pressureReq > maxPressure ? maxPressure : null,
    message: flowReq > maxFlow || pressureReq > maxPressure
      ? '需求超出现有泵的能力范围，请考虑降低需求或联系技术支持'
      : '请调整筛选条件后重试'
  };
}

/**
 * 检查齿轮箱是否需要备用泵
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {Object} options - 选项 { power: number }
 * @returns {boolean}
 */
export const needsStandbyPump = (gearboxModel, options = {}) => {
  if (!gearboxModel) return false;

  const model = gearboxModel.toUpperCase();
  const { power = 0 } = options;

  // DT系列需要电动备用泵
  if (model.startsWith('DT')) {
    const dtNumber = parseInt(model.replace('DT', ''), 10);
    // DT180-DT2400 需要备用泵
    return dtNumber >= 180 && dtNumber <= 2400;
  }

  // GW/GWC系列需要备用泵
  if (model.startsWith('GW') || model.startsWith('GWC')) {
    return true;
  }

  // HC系列特定型号需要备用泵
  if (model.startsWith('HC')) {
    const hcNumber = parseInt(model.replace(/HC[A-Z]*/i, ''), 10);
    // HC1000-1200, HC1400-2000, HC2700 需要备用泵
    if ((hcNumber >= 1000 && hcNumber <= 1200) ||
        (hcNumber >= 1400 && hcNumber <= 2000) ||
        hcNumber === 2700) {
      return true;
    }
  }

  // 大功率齿轮箱通常需要备用泵
  if (power >= 600) {
    return true;
  }

  // HCM/HCQ系列小型号不需要
  if ((model.startsWith('HCM') || model.startsWith('HCQ')) && power < 300) {
    return false;
  }

  return false;
};

/**
 * 格式化泵信息用于显示
 */
export const formatPumpInfo = (pump) => {
  if (!pump) return null;

  const isElectric = pump.type === 'electric' || pump.series === '2CYA';

  return {
    ...pump,
    displayName: pump.model,
    typeLabel: isElectric ? '电动备用泵' : '齿轮备用泵',
    seriesLabel: cachedPumpSeriesInfo[pump.series]?.name || pump.series,
    specSummary: `${pump.flow} L/min, ${pump.pressure} MPa, ${pump.motorPower} kW`,
    priceDisplay: pump.marketPrice ? `${pump.marketPrice.toLocaleString()}` : '-'
  };
};

export default {
  selectPumpByParameters,
  selectPumpByGearbox,
  needsStandbyPump,
  getPumpCategories,
  getPumpSeriesInfo,
  formatPumpInfo
};
