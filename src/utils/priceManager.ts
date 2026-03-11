// src/utils/priceManager.ts
// 价格管理工具 - TypeScript版本

import { safeParseFloat } from './dataHelpers';
import { getGWPackagePriceConfig, checkPackageMatch } from '../data/packagePriceConfig';
import { estimateGearboxPrice, fillMissingPrices as fillPricesFromEstimator } from './priceEstimator';
import type { Gearbox, Coupling, StandbyPump, AppData } from '../types';

/**
 * 产品类型
 */
export type ProductType = 'gearbox' | 'coupling' | 'pump' | 'auto';

/**
 * 可定价的产品项
 */
export interface PriceableItem {
  model?: string;
  basePrice?: number;
  price?: number;
  discountRate?: number;
  factoryPrice?: number;
  marketPrice?: number;
  packagePrice?: number;
  notes?: string;
  ratios?: number[];
}

/**
 * 特殊型号价格配置
 */
export interface SpecialModelPrice {
  basePrice: number;
  discountRate: number;
}

/**
 * 价格验证结果
 */
export interface PriceValidationResult {
  valid: boolean;
  missing: string[];
  inconsistent: string[];
}

/**
 * 价格处理结果
 */
export interface PriceProcessResult {
  data: AppData;
  results: {
    corrected: number;
    warnings: string[];
    errors: string[];
  };
}

/**
 * 价格常量配置
 */
export interface PriceConstantsType {
  DEFAULT_DISCOUNT_RATE: number;
  MARKET_PRICE_MULTIPLIER: number;
  SERIES_DISCOUNT_RATES: Record<string, number>;
  FIXED_PRICE_SERIES: string[];
  SPECIAL_MODEL_DISCOUNTS: Record<string, number>;
  SPECIAL_PACKAGE_PRICES: Record<string, number>;
}

// 价格常量
export const PRICE_CONSTANTS: PriceConstantsType = {
  // 基础常量
  DEFAULT_DISCOUNT_RATE: 0.1,        // 默认折扣率: 10%
  MARKET_PRICE_MULTIPLIER: 1.1,      // 市场价格倍数: 10%加价

  // 分系列折扣率
  SERIES_DISCOUNT_RATES: {
    // HC系列折扣率
    HC_STANDARD: 0.16,              // 标准HC系列: 16%
    HC_600: 0.12,                   // HC600系列: 12%
    HC_800: 0.08,                   // HC800系列: 8%
    HC_1000_PLUS: 0.06,             // HC1000及以上: 6%

    // 其它系列折扣率
    GW: 0.10,                       // GW系列: 10%
    DT: 0.10,                       // DT系列: 10%
    GC: 0.10,                       // GC系列: 10%
    HCL: 0.12,                      // HCL系列: 12%

    // 附件系列折扣率
    COUPLING: 0.10,                 // 联轴器: 10%
    PUMP: 0.10                      // 备用泵: 10%
  },

  // 固定价格系列 (全国统一售价)
  // HCA 已移除：HCA200/HCA400 有 16% 折扣，仅 HCA138/HCA300 固定价（在 getStandardDiscountRate 中单独处理）
  FIXED_PRICE_SERIES: ['HCM', 'HCQ', 'HCX', 'HCV', 'MV'],

  // 特殊型号折扣率覆盖
  SPECIAL_MODEL_DISCOUNTS: {
    'J300': 0.22,                   // 报告特批
    'D300A': 0.16,                  // D300A 默认 6-7.5:1，折扣 16%；4-5.5:1 由 specialModelPrices 覆盖
    'HC400': 0.22,                  // 报告特批
    'HCD400A': 0.22,                // 报告特批
    'HC1200': 0.14,                 // 报告特批
    'HC1200/1': 0.10                // 报告特批
  },

  // 特殊打包价格
  SPECIAL_PACKAGE_PRICES: {
    'GWC42.45': 180000,
    'GWC45.49': 275000,
    'GWC45.52': 330000,
    'GWC49.54': 385000,
    'GWC49.59': 430000,
    'GWC52.59': 510000
  }
};

/**
 * 特殊型号价格修正映射
 */
export const specialModelPrices: Record<string, SpecialModelPrice> = {
  // HC系列特殊型号
  'MB270A-6-7:1': { basePrice: 30000, discountRate: 0.12 },
  'HCT800/1-6.91-15.82:1': { basePrice: 137200, discountRate: 0.08 },

  // GW系列报告特批
  'J300': { basePrice: 26680, discountRate: 0.22 },
  'D300A': { basePrice: 34520, discountRate: 0.16 }, // 默认用6-7.5:1较保守折扣
  'D300A (4-5.5:1)': { basePrice: 32420, discountRate: 0.22 },
  'D300A (6-7.5:1)': { basePrice: 34520, discountRate: 0.16 },

  // 某些HC型号有报告特批价格
  'HC1200': { basePrice: 92000, discountRate: 0.14 },
  'HC1200/1': { basePrice: 108200, discountRate: 0.10 },
  'HC400': { basePrice: 32150, discountRate: 0.22 },
  'HCD400A': { basePrice: 38150, discountRate: 0.22 }
};

/**
 * 获取标准折扣率
 * @param model 产品型号
 * @param type 产品类型
 * @returns 折扣率 (0-1)
 */
export const getStandardDiscountRate = (
  model: string | undefined | null,
  type: ProductType = 'auto'
): number => {
  if (!model) return PRICE_CONSTANTS.DEFAULT_DISCOUNT_RATE;

  let productType = type;

  // 自动检测类型
  if (productType === 'auto') {
    if (model.startsWith('HGT') || model.startsWith('HGTH')) {
      productType = 'coupling';
    } else if (model.startsWith('2CY') || model.startsWith('SPF')) {
      productType = 'pump';
    } else {
      productType = 'gearbox';
    }
  }

  // 检查特殊型号的折扣率
  const specialPrice = specialModelPrices[model];
  if (specialPrice && typeof specialPrice.discountRate === 'number') {
    return specialPrice.discountRate;
  }

  // 固定价格产品无折扣（全国统一售价）
  if (isFixedPriceSeries(model)) {
    return 0.0;
  }

  // 按产品类型和系列确定标准折扣率
  switch (productType) {
    case 'gearbox':
      // HC200 固定价（全国统一售价）
      if (model === 'HC200') return 0.0;
      // HCA138/HCA300 固定价；HCA200/HCA400 按标准 HC 16% 处理
      if (model === 'HCA138' || model === 'HCA300') return 0.0;
      // HCL系列独立折扣率，必须在HC之前判断
      if (model.startsWith('HCL')) return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.HCL;
      if (model.startsWith('HC')) {
        // HC系列分级折扣 — 提取型号中的数字进行范围判断，避免子串误匹配
        const hcNumMatch = model.match(/HC[A-Z]*(\d+)/);
        const hcNumber = hcNumMatch ? parseInt(hcNumMatch[1], 10) : 0;
        if (hcNumber >= 1000) {
          return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.HC_1000_PLUS;
        } else if (hcNumber >= 800) {
          return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.HC_800;
        } else if (hcNumber >= 600) {
          return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.HC_600;
        }
        return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.HC_STANDARD;
      }
      if (model.startsWith('GW')) return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.GW;
      if (model.startsWith('DT')) return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.DT;
      if (model.startsWith('GC')) return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.GC;
      if (model.startsWith('HCQ')) return 0.0;
      if (model.startsWith('SG')) return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.GW;
      if (model.startsWith('2G')) return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.GW;
      if (model.startsWith('MV')) return 0.0;
      return 0.12;

    case 'coupling':
      return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.COUPLING;

    case 'pump':
      return PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.PUMP;

    default:
      return PRICE_CONSTANTS.DEFAULT_DISCOUNT_RATE;
  }
};

/**
 * 判断是否为固定价格系列（全国统一售价）
 * @param model 产品型号
 * @returns 是否为固定价格系列
 */
export const isFixedPriceSeries = (model: string | undefined | null): boolean => {
  if (!model) return false;

  for (const prefix of PRICE_CONSTANTS.FIXED_PRICE_SERIES) {
    if (model.startsWith(prefix)) {
      return true;
    }
  }

  return false;
};

/**
 * 计算工厂价
 * @param item 产品项
 * @returns 计算的工厂价
 */
export const calculateFactoryPrice = (item: PriceableItem | null | undefined): number => {
  if (!item) return 0;

  // 处理"全国统一售价"特殊情况
  if (isFixedPriceSeries(item.model) || (item.notes && item.notes.includes('全国统一售价'))) {
    return safeParseFloat(item.basePrice) || 0;
  }

  const basePrice = safeParseFloat(item.basePrice) || safeParseFloat(item.price) || 0;

  // 确保有有效的折扣率
  let discountRate = safeParseFloat(item.discountRate);
  if (discountRate === undefined || discountRate < 0 || discountRate > 1) {
    discountRate = getStandardDiscountRate(item.model);
  }

  // 防止舍入误差，保留两位小数
  return parseFloat((basePrice * (1 - discountRate)).toFixed(2));
};

/**
 * 计算市场价
 * @param item 产品项
 * @param packagePrice 打包价（如果已计算）
 * @returns 计算的市场价
 */
export const calculateMarketPrice = (
  item: PriceableItem | null | undefined,
  packagePrice: number | null = null
): number => {
  if (!item) return 0;

  // 检查是否存在打包价配置
  const gwConfig = getGWPackagePriceConfig(item.model);

  // 对于有特殊打包价的型号，直接使用打包价作为市场价
  if (gwConfig && !gwConfig.isSmallGWModel && gwConfig.packagePrice) {
    return gwConfig.packagePrice;
  }

  // 对于小型号 (GW39.41及以下)
  if (gwConfig && gwConfig.isSmallGWModel) {
    const factoryPrice = item.factoryPrice ||
      (typeof item.basePrice === 'number' && typeof item.discountRate === 'number'
        ? item.basePrice * (1 - item.discountRate)
        : 0);
    // 确保市场价不低于工厂价
    const minimumPrice = factoryPrice;
    const calculatedMarketPrice = packagePrice
      ? packagePrice * PRICE_CONSTANTS.MARKET_PRICE_MULTIPLIER
      : factoryPrice * PRICE_CONSTANTS.MARKET_PRICE_MULTIPLIER;
    return Math.max(calculatedMarketPrice, minimumPrice);
  }

  // 处理"全国统一售价"特殊情况
  if (isFixedPriceSeries(item.model) || (item.notes && item.notes.includes('全国统一售价'))) {
    return safeParseFloat(item.basePrice) || 0;
  }

  // 如果已有市场价，优先使用
  if (typeof item.marketPrice === 'number' && item.marketPrice > 0) {
    return item.marketPrice;
  }

  // 使用提供的工厂价或重新计算
  const factory = packagePrice || safeParseFloat(item.factoryPrice) || calculateFactoryPrice(item);

  // 计算市场价 (工厂价 * 市场倍数)
  return parseFloat((factory * PRICE_CONSTANTS.MARKET_PRICE_MULTIPLIER).toFixed(2));
};

/**
 * 计算打包价
 * @param gearbox 齿轮箱对象
 * @param coupling 联轴器对象
 * @param pump 备用泵对象
 * @returns 计算的打包价
 */
export const calculatePackagePrice = (
  gearbox: PriceableItem | null | undefined,
  coupling: PriceableItem | null = null,
  pump: PriceableItem | null = null
): number => {
  if (!gearbox) return 0;

  // 检查是否存在打包价配置
  const gwConfig = getGWPackagePriceConfig(gearbox.model);

  // 检查是否满足打包价格条件
  if (gwConfig && !gwConfig.isSmallGWModel && checkPackageMatch(gearbox, coupling, pump, gwConfig)) {
    console.log(`应用打包价格: ${gearbox.model}, 价格: ${gwConfig.packagePrice}`);
    return gwConfig.packagePrice;
  }

  // 检查是否有特定的打包价覆盖
  const model = gearbox.model?.trim();
  if (model && PRICE_CONSTANTS.SPECIAL_PACKAGE_PRICES[model]) {
    return PRICE_CONSTANTS.SPECIAL_PACKAGE_PRICES[model];
  }

  // 添加齿轮箱工厂价
  let total = safeParseFloat(gearbox.factoryPrice) || calculateFactoryPrice(gearbox) || 0;

  // 添加联轴器价格
  if (coupling) {
    total += safeParseFloat(coupling.factoryPrice) || calculateFactoryPrice(coupling) || 0;
  }

  // 添加备用泵价格
  if (pump) {
    total += safeParseFloat(pump.factoryPrice) || calculateFactoryPrice(pump) || 0;
  }

  return total;
};

/**
 * 应用特殊型号价格修正
 * @param item 产品项
 * @returns 修正后的产品项
 */
export const applySpecialModelPrice = <T extends PriceableItem>(item: T | null | undefined): T | null | undefined => {
  if (!item || !item.model) return item;

  const model = item.model.trim();

  // 精确匹配
  if (specialModelPrices[model]) {
    const override = specialModelPrices[model];
    return { ...item, ...override };
  }

  // 处理特殊减速比范围价格
  if (model === 'MB270A' && Array.isArray(item.ratios)) {
    const highSpeedRatios = item.ratios.some(r => r >= 6 && r <= 7);
    if (highSpeedRatios && specialModelPrices['MB270A-6-7:1']) {
      return { ...item, ...specialModelPrices['MB270A-6-7:1'] };
    }
  }

  // 处理HCT800/1特殊减速比范围价格
  if (model === 'HCT800/1' && Array.isArray(item.ratios)) {
    const specialRatios = item.ratios.some(r => r >= 6.91 && r <= 15.82);
    if (specialRatios && specialModelPrices['HCT800/1-6.91-15.82:1']) {
      return { ...item, ...specialModelPrices['HCT800/1-6.91-15.82:1'] };
    }
  }

  return item;
};

/**
 * 单个项目价格修正
 * @param item 需要修正价格的项目
 * @returns 修正后的项目
 */
export const correctPriceData = <T extends PriceableItem>(item: T | null | undefined): T | null | undefined => {
  if (!item || typeof item !== 'object') return item;

  try {
    // 检查是否有特殊型号价格覆盖
    const specialItem = applySpecialModelPrice(item);
    if (!specialItem) return item;

    // 检查GW系列特殊打包价格
    const gwConfig = getGWPackagePriceConfig(specialItem.model);

    // 检查是否为"全国统一售价"
    const isFixedPrice = isFixedPriceSeries(specialItem.model) ||
      (specialItem.notes && specialItem.notes.includes('全国统一售价'));

    // 1. 确保基础价格有效
    const basePrice = safeParseFloat(specialItem.basePrice) || safeParseFloat(specialItem.price) || 0;

    // 2. 确保折扣率有效
    let discountRate = safeParseFloat(specialItem.discountRate);
    if (discountRate === undefined || discountRate < 0 || discountRate > 1) {
      discountRate = isFixedPrice ? 0 : getStandardDiscountRate(specialItem.model);
    }

    // 3. 计算工厂价
    const factoryPrice = isFixedPrice ? basePrice : parseFloat((basePrice * (1 - discountRate)).toFixed(2));

    // 4. 计算市场价 - 考虑GW系列特殊打包价格
    let marketPrice: number;
    let packagePrice = factoryPrice;

    // 特殊打包价处理
    if (gwConfig && !gwConfig.isSmallGWModel && gwConfig.packagePrice) {
      packagePrice = gwConfig.packagePrice;
      marketPrice = gwConfig.packagePrice;
    } else if (isFixedPrice) {
      marketPrice = basePrice;
    } else {
      marketPrice = parseFloat((factoryPrice * PRICE_CONSTANTS.MARKET_PRICE_MULTIPLIER).toFixed(2));

      const specialPackagePrice = specialItem.model && PRICE_CONSTANTS.SPECIAL_PACKAGE_PRICES[specialItem.model.trim()];
      if (specialPackagePrice) {
        packagePrice = specialPackagePrice;
      }
    }

    // 如果是固定价格系列，确保添加相应的注释
    let notes = specialItem.notes || '';
    if (isFixedPrice && !notes.includes("全国统一售价")) {
      notes = notes ? `${notes}, 全国统一售价` : "全国统一售价";
    }

    // 返回更新后的项目
    return {
      ...specialItem,
      basePrice,
      price: basePrice,
      discountRate,
      factoryPrice,
      marketPrice,
      packagePrice,
      notes
    } as T;
  } catch (e) {
    console.error(`correctPriceData: 处理 ${item?.model || '未知'} 价格时发生错误:`, e);
    return item;
  }
};

/**
 * 批量修正特定型号价格
 * @param data 数据对象
 * @returns 修正后的数据对象
 */
export const fixSpecificModelPrices = (data: AppData | null | undefined): AppData | null | undefined => {
  if (!data) return data;

  const result = { ...data };

  // 定义需要处理的集合
  const collections: (keyof AppData)[] = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
    'flexibleCouplings', 'standbyPumps'
  ];

  // 处理每个集合中的项目
  collections.forEach(colKey => {
    const collection = result[colKey];
    if (Array.isArray(collection)) {
      (result as any)[colKey] = collection.map(item => correctPriceData(item));
    }
  });

  return result;
};

/**
 * 完整处理价格数据
 * @param data 数据对象
 * @returns 处理结果
 */
export const processPriceData = (data: AppData | null | undefined): PriceProcessResult => {
  if (!data) {
    return {
      data: {} as AppData,
      results: { corrected: 0, warnings: [], errors: [] }
    };
  }

  let result = { ...data };
  const warnings: string[] = [];
  const errors: string[] = [];
  let corrected = 0;

  // 定义需要处理的集合
  const collections: (keyof AppData)[] = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
    'flexibleCouplings', 'standbyPumps'
  ];

  // 处理每个集合中的项目价格
  collections.forEach(colKey => {
    const collection = result[colKey];
    if (Array.isArray(collection)) {
      (result as any)[colKey] = collection.map((item: any) => {
        if (!item || typeof item !== 'object') return item;

        try {
          const correctedItem = correctPriceData(item);

          if (JSON.stringify(correctedItem) !== JSON.stringify(item)) {
            corrected++;
          }

          return correctedItem;
        } catch (e: any) {
          errors.push(`处理 ${colKey}/${item?.model || '未知'} 价格时发生错误: ${e.message}`);
          return item;
        }
      });
    }
  });

  // 性能优化: 使用价格估算器填充缺失的价格
  try {
    result = fillPricesFromEstimator(result);
    console.log('PriceManager: 已使用价格估算器填充缺失价格');
  } catch (e) {
    console.warn('PriceManager: 价格估算器执行失败', e);
  }

  return {
    data: result,
    results: {
      corrected,
      warnings,
      errors
    }
  };
};

/**
 * 价格数据验证
 * @param item 产品项
 * @returns 验证结果
 */
export const validatePriceData = (item: PriceableItem | null | undefined): PriceValidationResult => {
  if (!item || !item.model) {
    return {
      valid: false,
      missing: ['整个产品项缺失或无型号'],
      inconsistent: []
    };
  }

  const missing: string[] = [];
  const inconsistent: string[] = [];

  // 检查必要的价格字段
  if (item.basePrice === undefined || item.basePrice === null || isNaN(Number(item.basePrice))) {
    missing.push('基础价格(basePrice)');
  }

  if (item.discountRate === undefined || item.discountRate === null || isNaN(Number(item.discountRate))) {
    missing.push('折扣率(discountRate)');
  }

  if (item.factoryPrice === undefined || item.factoryPrice === null || isNaN(Number(item.factoryPrice))) {
    missing.push('工厂价(factoryPrice)');
  }

  if (item.marketPrice === undefined || item.marketPrice === null || isNaN(Number(item.marketPrice))) {
    missing.push('市场价(marketPrice)');
  }

  // 检查价格一致性
  const basePrice = Number(item.basePrice);
  const discountRate = Number(item.discountRate);
  const factoryPrice = Number(item.factoryPrice);
  const marketPrice = Number(item.marketPrice);

  if (!isNaN(basePrice) && !isNaN(discountRate) && !isNaN(factoryPrice)) {
    const expectedFactoryPrice = basePrice * (1 - discountRate);
    const tolerance = 1;

    if (Math.abs(factoryPrice - expectedFactoryPrice) > tolerance) {
      inconsistent.push(`工厂价(${factoryPrice})与计算值(${expectedFactoryPrice.toFixed(2)})不一致`);
    }
  }

  if (!isNaN(factoryPrice) && !isNaN(marketPrice)) {
    const expectedMarketPrice = factoryPrice * PRICE_CONSTANTS.MARKET_PRICE_MULTIPLIER;
    const tolerance = 1;

    if (Math.abs(marketPrice - expectedMarketPrice) > tolerance) {
      inconsistent.push(`市场价(${marketPrice})与计算值(${expectedMarketPrice.toFixed(2)})不一致`);
    }
  }

  return {
    valid: missing.length === 0 && inconsistent.length === 0,
    missing,
    inconsistent
  };
};

// 导出默认对象
export default {
  calculateFactoryPrice,
  calculateMarketPrice,
  calculatePackagePrice,
  getStandardDiscountRate,
  isFixedPriceSeries,
  correctPriceData,
  applySpecialModelPrice,
  fixSpecificModelPrices,
  processPriceData,
  validatePriceData,
  PRICE_CONSTANTS,
  specialModelPrices
};
