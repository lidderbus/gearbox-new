// src/utils/priceEstimator.js
// 价格估算工具 - 为缺少价格数据的齿轮箱型号生成合理的估算价格

import { gearboxPriceData, discountRateMap } from '../data/gearboxPricing';

/**
 * 价格基准数据
 * 基于已知价格数据的统计分析
 */
const PRICE_BENCHMARKS = {
  // 基于重量的线性回归公式 (price = slope × weight + intercept)
  // 来源: 2026-01-06 数据质量审计中的回归分析
  weightRegression: {
    HC:  { slope: 14.3, intercept: 91640, r2: 0.72 },
    HCT: { slope: 24.0, intercept: 72326, r2: 0.85 },
    HCD: { slope: 1.8,  intercept: 176714, r2: 0.61 },
    HCW: { slope: 35.0, intercept: 50000, r2: 0.78 },
    D:   { slope: 85.0, intercept: 18155, r2: 0.89 },
    DT:  { slope: 85.0, intercept: 18155, r2: 0.89 },
    HCM: { slope: 18.0, intercept: 60000, r2: 0.75 },
    HCL: { slope: 12.0, intercept: 80000, r2: 0.65 },
    HCG: { slope: 15.0, intercept: 95000, r2: 0.70 }
  },

  // 每kW功率的基准价格 (按系列) - 当无重量数据时使用
  pricePerKW: {
    HC: 180,    // HC系列约180元/kW
    HCD: 200,   // HCD系列约200元/kW
    HCT: 220,   // HCT系列约220元/kW
    HCW: 280,   // HCW系列约280元/kW
    HCM: 160,   // HCM系列约160元/kW
    HCQ: 150,   // HCQ系列约150元/kW
    HCL: 80,    // HCL系列约80元/kW
    GW: 350,    // GW系列约350元/kW
    DT: 120,    // DT系列约120元/kW
    MB: 140     // MB系列约140元/kW
  },

  // 基础价格 (按系列型号大小)
  basePriceBySize: {
    HC: {
      small: 15000,   // 100-200型
      medium: 30000,  // 300-400型
      large: 60000,   // 600-800型
      xlarge: 100000  // 1000+型
    },
    HCM: {
      small: 20000,
      medium: 35000,
      large: 50000,
      xlarge: 70000
    },
    GW: {
      small: 70000,
      medium: 180000,
      large: 400000,
      xlarge: 800000
    }
  },

  // 默认折扣率
  defaultDiscountRates: {
    HC: 0.16,
    HCD: 0.16,
    HCT: 0.16,
    HCW: 0.08,
    HCM: 0.10,
    HCQ: 0.10,
    HCL: 0.12,
    GW: 0.10,
    DT: 0.10,
    MB: 0.12,
    default: 0.10
  }
};

/**
 * 从型号中提取系列和大小信息
 * @param {string} model - 型号
 * @returns {Object} 系列和大小信息
 */
function parseModel(model) {
  if (!model) return { series: 'default', size: 'medium', sizeNum: 300 };

  const upperModel = model.toUpperCase();

  // 提取系列
  let series = 'default';
  const seriesPrefixes = ['HCW', 'HCT', 'HCD', 'HCM', 'HCQ', 'HCL', 'HCA', 'HCX', 'HC', 'GWC', 'GWS', 'GW', 'DT', 'MB'];

  for (const prefix of seriesPrefixes) {
    if (upperModel.startsWith(prefix)) {
      series = prefix.replace(/[CS]$/, ''); // GWC, GWS -> GW
      break;
    }
  }

  // 提取大小数字
  const sizeMatch = model.match(/(\d+)/);
  const sizeNum = sizeMatch ? parseInt(sizeMatch[1]) : 300;

  // 确定大小类别
  let size = 'medium';
  if (sizeNum <= 200) size = 'small';
  else if (sizeNum <= 500) size = 'medium';
  else if (sizeNum <= 900) size = 'large';
  else size = 'xlarge';

  return { series, size, sizeNum };
}

/**
 * 获取已知型号的价格数据
 * @returns {Map} 型号到价格的映射
 */
function getKnownPrices() {
  const priceMap = new Map();

  gearboxPriceData.forEach(item => {
    if (item.model && item.basePrice) {
      // 规范化型号名称
      const normalizedModel = normalizeModelName(item.model);
      priceMap.set(normalizedModel, {
        basePrice: item.basePrice,
        discountRate: item.discountRate || 0.10,
        discountedPrice: item.discountedPrice || item.basePrice * (1 - (item.discountRate || 0.10))
      });
    }
  });

  return priceMap;
}

/**
 * 规范化型号名称，去除速比等后缀
 * @param {string} model - 原始型号
 * @returns {string} 规范化的型号
 */
function normalizeModelName(model) {
  if (!model) return '';

  // 移除常见的后缀如 "(2-6:1)", "带PT", "滑动" 等
  return model
    .replace(/\s*\([^)]*\)\s*/g, '')
    .replace(/\s*(带PT|带PTO|滑动)\s*/g, '')
    .replace(/\s+/g, '')
    .toUpperCase();
}

/**
 * 估算齿轮箱价格
 * @param {Object} gearbox - 齿轮箱数据
 * @returns {Object} 估算的价格信息
 */
export function estimateGearboxPrice(gearbox) {
  if (!gearbox || !gearbox.model) {
    return null;
  }

  const knownPrices = getKnownPrices();
  const normalizedModel = normalizeModelName(gearbox.model);

  // 1. 首先检查是否有已知价格
  if (knownPrices.has(normalizedModel)) {
    const known = knownPrices.get(normalizedModel);
    return {
      model: gearbox.model,
      basePrice: known.basePrice,
      discountRate: known.discountRate,
      factoryPrice: known.discountedPrice,
      marketPrice: Math.round(known.discountedPrice * 1.1),
      source: 'known',
      confidence: 1.0
    };
  }

  // 2. 尝试找到相似型号
  const similarPrice = findSimilarModelPrice(gearbox.model, knownPrices);
  if (similarPrice) {
    return {
      model: gearbox.model,
      ...similarPrice,
      source: 'similar',
      confidence: 0.85
    };
  }

  // 3. 基于参数估算
  const estimatedPrice = estimateFromParameters(gearbox);

  return {
    model: gearbox.model,
    ...estimatedPrice,
    source: 'estimated',
    confidence: 0.6
  };
}

/**
 * 查找相似型号的价格
 * @param {string} model - 目标型号
 * @param {Map} knownPrices - 已知价格映射
 * @returns {Object|null} 相似型号的价格
 */
function findSimilarModelPrice(model, knownPrices) {
  const { series, sizeNum } = parseModel(model);

  // 查找同系列相近大小的型号
  let closestModel = null;
  let closestDiff = Infinity;

  for (const [knownModel, priceInfo] of knownPrices) {
    const { series: knownSeries, sizeNum: knownSize } = parseModel(knownModel);

    if (knownSeries === series) {
      const diff = Math.abs(knownSize - sizeNum);
      if (diff < closestDiff) {
        closestDiff = diff;
        closestModel = { model: knownModel, ...priceInfo };
      }
    }
  }

  if (closestModel && closestDiff < 200) {
    // 根据大小差异调整价格
    const sizeRatio = sizeNum / parseModel(closestModel.model).sizeNum;
    const adjustedBase = Math.round(closestModel.basePrice * Math.pow(sizeRatio, 1.5));

    return {
      basePrice: adjustedBase,
      discountRate: closestModel.discountRate,
      factoryPrice: Math.round(adjustedBase * (1 - closestModel.discountRate)),
      marketPrice: Math.round(adjustedBase * (1 - closestModel.discountRate) * 1.1),
      referenceModel: closestModel.model
    };
  }

  return null;
}

/**
 * 基于参数估算价格
 * 优先使用重量线性回归，其次使用功率/型号大小估算
 * @param {Object} gearbox - 齿轮箱数据
 * @returns {Object} 估算的价格
 */
function estimateFromParameters(gearbox) {
  const { series, size, sizeNum } = parseModel(gearbox.model);

  let basePrice = 30000; // 默认基础价格
  let estimationMethod = 'size_based';

  // 方法1: 基于重量的线性回归 (最准确, R²>0.6)
  const regression = PRICE_BENCHMARKS.weightRegression[series];
  if (regression && gearbox.weight > 0) {
    basePrice = Math.round(regression.slope * gearbox.weight + regression.intercept);
    estimationMethod = 'weight_regression';
    // 确保价格在合理范围内
    basePrice = Math.max(10000, Math.min(basePrice, 2000000));
  } else {
    // 方法2: 基于系列和大小调整
    const seriesBase = PRICE_BENCHMARKS.basePriceBySize[series] ||
                       PRICE_BENCHMARKS.basePriceBySize.HC;
    basePrice = seriesBase[size] || seriesBase.medium;

    // 基于功率调整
    if (gearbox.maxPower || gearbox.minPower) {
      const power = gearbox.maxPower || gearbox.minPower;
      const pricePerKW = PRICE_BENCHMARKS.pricePerKW[series] ||
                         PRICE_BENCHMARKS.pricePerKW.HC;
      basePrice = Math.max(basePrice, power * pricePerKW);
      estimationMethod = 'power_based';
    }

    // 基于型号数字调整
    basePrice = Math.round(basePrice * (1 + sizeNum / 1000));
  }

  // 获取折扣率
  const discountRate = PRICE_BENCHMARKS.defaultDiscountRates[series] ||
                       PRICE_BENCHMARKS.defaultDiscountRates.default;

  const factoryPrice = Math.round(basePrice * (1 - discountRate));
  const marketPrice = Math.round(factoryPrice * 1.1);

  return {
    basePrice,
    discountRate,
    factoryPrice,
    marketPrice,
    estimationMethod
  };
}

/**
 * 批量估算价格
 * @param {Array} gearboxes - 齿轮箱数组
 * @returns {Array} 带有估算价格的齿轮箱数组
 */
export function batchEstimatePrices(gearboxes) {
  if (!Array.isArray(gearboxes)) return [];

  return gearboxes.map(gearbox => {
    const priceInfo = estimateGearboxPrice(gearbox);

    if (priceInfo) {
      return {
        ...gearbox,
        basePrice: priceInfo.basePrice,
        discountRate: priceInfo.discountRate,
        factoryPrice: priceInfo.factoryPrice,
        marketPrice: priceInfo.marketPrice,
        price: priceInfo.factoryPrice,
        priceSource: priceInfo.source,
        priceConfidence: priceInfo.confidence
      };
    }

    return gearbox;
  });
}

/**
 * 填充数据中缺少的价格
 * @param {Object} data - 包含齿轮箱数组的数据对象
 * @returns {Object} 填充了价格的数据对象
 */
export function fillMissingPrices(data) {
  if (!data) return data;

  const result = { ...data };

  // 处理所有齿轮箱数组
  const gearboxKeys = Object.keys(data).filter(key => key.endsWith('Gearboxes'));

  let filledCount = 0;
  let totalCount = 0;

  gearboxKeys.forEach(key => {
    if (Array.isArray(data[key])) {
      result[key] = data[key].map(gearbox => {
        totalCount++;

        // 检查是否需要填充价格
        const needsPrice = !gearbox.basePrice ||
                          !gearbox.factoryPrice ||
                          gearbox.basePrice === 0;

        if (needsPrice) {
          const priceInfo = estimateGearboxPrice(gearbox);
          if (priceInfo) {
            filledCount++;
            return {
              ...gearbox,
              basePrice: priceInfo.basePrice,
              discountRate: priceInfo.discountRate,
              factoryPrice: priceInfo.factoryPrice,
              marketPrice: priceInfo.marketPrice,
              price: priceInfo.factoryPrice,
              packagePrice: priceInfo.factoryPrice,
              priceSource: priceInfo.source,
              priceConfidence: priceInfo.confidence
            };
          }
        }

        return gearbox;
      });
    }
  });

  console.log(`PriceEstimator: 填充了${filledCount}/${totalCount}个型号的价格`);

  return result;
}

/**
 * 获取价格统计信息
 * @param {Object} data - 数据对象
 * @returns {Object} 统计信息
 */
export function getPriceStatistics(data) {
  const stats = {
    total: 0,
    withPrice: 0,
    withoutPrice: 0,
    bySeries: {},
    bySource: {
      known: 0,
      similar: 0,
      estimated: 0,
      missing: 0
    }
  };

  if (!data) return stats;

  const gearboxKeys = Object.keys(data).filter(key => key.endsWith('Gearboxes'));

  gearboxKeys.forEach(key => {
    if (Array.isArray(data[key])) {
      data[key].forEach(gearbox => {
        stats.total++;

        const { series } = parseModel(gearbox.model);
        if (!stats.bySeries[series]) {
          stats.bySeries[series] = { total: 0, withPrice: 0 };
        }
        stats.bySeries[series].total++;

        if (gearbox.basePrice && gearbox.basePrice > 0) {
          stats.withPrice++;
          stats.bySeries[series].withPrice++;

          if (gearbox.priceSource) {
            stats.bySource[gearbox.priceSource] = (stats.bySource[gearbox.priceSource] || 0) + 1;
          } else {
            stats.bySource.known++;
          }
        } else {
          stats.withoutPrice++;
          stats.bySource.missing++;
        }
      });
    }
  });

  return stats;
}

export default {
  estimateGearboxPrice,
  batchEstimatePrices,
  fillMissingPrices,
  getPriceStatistics
};
