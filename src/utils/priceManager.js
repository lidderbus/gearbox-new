// src/utils/priceManager.js 修正后的完整代码

/**
 * 价格管理工具
 * 统一处理产品价格计算、折扣和特殊价格逻辑
 */

import { safeParseFloat } from './dataHelpers';
import { MARKET_PRICE_MULTIPLIER, DEFAULT_DISCOUNT_RATE } from '../config';

/**
 * 获取标准折扣率
 * @param {string} model 产品型号
 * @param {string} type 产品类型 ('gearbox'|'coupling'|'pump')
 * @returns {number} 折扣率 (0-1)
 */
export const getStandardDiscountRate = (model, type = 'auto') => {
  if (!model) return DEFAULT_DISCOUNT_RATE;
  
  // 自动检测类型
  if (type === 'auto') {
    if (model.startsWith('HGT') || model.startsWith('HGTH')) {
      type = 'coupling';
    } else if (model.startsWith('2CY') || model.startsWith('SPF')) {
      type = 'pump';
    } else {
      type = 'gearbox';
    }
  }
  
  // 标准系列折扣率
  // 根据型号前缀确定折扣率
  const modelPrefix = model.substring(0, 2).toUpperCase();
  
  // 特殊型号处理
  if (model.includes('/1') || model.includes('/2') || model.includes('/3')) {
    // 某些子型号可能有特殊折扣
    if (model.startsWith('HCT800/')) return 0.08;
  }
  
  // 固定价格产品无折扣
  if (model.startsWith('HCM') || model.startsWith('HCX') || 
      model.startsWith('HCA') || model.startsWith('HCV')) {
    return 0.0; // 全国统一售价系列
  }
  
  // 按产品类型和系列确定标准折扣率
  switch (type) {
    case 'gearbox':
      switch (modelPrefix) {
        case 'HC': return 0.16; // HC系列标准
        case 'GW': return 0.10; // GW系列标准
        case 'DT': return 0.10; // DT系列标准
        case 'GC': return 0.10; // GC系列标准
        case 'HQ': return 0.12; // HCQ系列
        case 'SG': return 0.10; // SGW系列
        case '2G': return 0.10; // 2GWH系列
        default: return 0.12;
      }
    
    case 'coupling':
      return 0.10; // 联轴器标准折扣
      
    case 'pump':
      return 0.10; // 备用泵标准折扣
      
    default:
      return DEFAULT_DISCOUNT_RATE;
  }
};

/**
 * getDiscountRate - 向后兼容函数
 * @param {string} model 产品型号
 * @param {string} type 产品类型
 * @returns {number} 折扣率
 */
export const getDiscountRate = (model, type) => {
  console.warn('getDiscountRate 已弃用，请使用 getStandardDiscountRate');
  return getStandardDiscountRate(model, type);
};

/**
 * 计算工厂价
 * @param {Object} item 产品项
 * @returns {number} 计算的工厂价
 */
export const calculateFactoryPrice = (item) => {
  if (!item) return 0;
  
  // 处理"全国统一售价"特殊情况
  if (item.notes && item.notes.includes('全国统一售价')) {
    return safeParseFloat(item.basePrice) || 0;
  }
  
  const basePrice = safeParseFloat(item.basePrice) || 0;
  
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
 * @param {Object} item 产品项
 * @param {number} factoryPrice 工厂价（如果已计算）
 * @returns {number} 计算的市场价
 */
export const calculateMarketPrice = (item, factoryPrice = null) => {
  if (!item) return 0;
  
  // 处理"全国统一售价"特殊情况
  if (item.notes && item.notes.includes('全国统一售价')) {
    return safeParseFloat(item.basePrice) || 0;
  }
  
  // 使用提供的工厂价或重新计算
  const factory = factoryPrice || calculateFactoryPrice(item);
  
  // 计算市场价 (工厂价 * 市场倍数)
  // 防止舍入误差，保留两位小数
  return parseFloat((factory * MARKET_PRICE_MULTIPLIER).toFixed(2));
};

/**
 * 计算打包价
 * @param {Object} item 产品项
 * @param {number} factoryPrice 工厂价（如果已计算）
 * @returns {number} 计算的打包价
 */
export const calculatePackagePrice = (item, factoryPrice = null) => {
  if (!item) return 0;
  
  // 处理"全国统一售价"特殊情况
  if (item.notes && item.notes.includes('全国统一售价')) {
    return safeParseFloat(item.basePrice) || 0;
  }
  
  // 检查是否有特定的打包价覆盖
  // 特定型号可能有固定的打包价
  const model = item.model && item.model.trim();
  const specialPackagePrices = {
    'GWC42.45': 180000,
    'GWC45.49': 275000,
    'GWC45.52': 330000,
    'GWC49.54': 385000,
    'GWC49.59': 430000,
    'GWC52.59': 510000,
    // 可以添加更多特殊打包价...
  };
  
  if (model && specialPackagePrices[model]) {
    return specialPackagePrices[model];
  }
  
  // 默认情况下，打包价等于工厂价
  const factory = factoryPrice || calculateFactoryPrice(item);
  return factory;
};

/**
 * 特殊型号价格修正映射
 */
const specialModelPrices = {
  // HC系列特殊型号
  'MB270A-6-7:1': { basePrice: 30000, discountRate: 0.12 }, // 特殊减速比范围价格
  'HCT800/1-6.91-15.82:1': { basePrice: 137200, discountRate: 0.08 }, // 特殊减速比
  
  // GW系列报告特批
  'J300': { basePrice: 26680, discountRate: 0.22 }, // 报告特批
  'D300A': { basePrice: 32420, discountRate: 0.22 }, // 报告特批
  
  // 特殊打包价型号
  'GWC42.45': { packagePrice: 180000 }, // 从OCR Doc 3 P1 (18 万)
  'GWC45.49': { packagePrice: 275000 }, // From OCR Doc 3 P1 (27.5 万)
  'GWC45.52': { packagePrice: 330000 }, // From OCR Doc 3 P1 (33 万)
  'GWC49.54': { packagePrice: 385000 }, // From OCR Doc 3 P1 (38.5 万)
  'GWC49.59': { packagePrice: 430000 }, // From OCR Doc 3 P1 (43 万)
  'GWC52.59': { packagePrice: 510000 }, // From OCR Doc 3 P1 (51 万)
  
  // 某些HC型号有报告特批价格
  'HC1200': { basePrice: 92000, discountRate: 0.14 }, // 报告特批
  'HC1200/1': { basePrice: 108200, discountRate: 0.10 }, // 报告特批
  'HC400': { basePrice: 32150, discountRate: 0.22 }, // 报告特批
  'HCD400A': { basePrice: 38150, discountRate: 0.22 } // 报告特批
  
  // 可添加更多特殊型号价格
};

/**
 * 应用特殊型号价格修正
 * @param {Object} item 产品项
 * @returns {Object} 修正后的产品项
 */
export const applySpecialModelPrice = (item) => {
  if (!item || !item.model) return item;
  
  const model = item.model.trim();
  
  // 精确匹配
  if (specialModelPrices[model]) {
    const override = specialModelPrices[model];
    return { ...item, ...override };
  }
  
  // 处理特殊减速比范围价格
  if (model === 'MB270A' && Array.isArray(item.ratios)) {
    // 检查是否在特殊范围内
    const highSpeedRatios = item.ratios.some(r => r >= 6 && r <= 7);
    if (highSpeedRatios && specialModelPrices['MB270A-6-7:1']) {
      return { ...item, ...specialModelPrices['MB270A-6-7:1'] };
    }
  }
  
  // 处理HCT800/1特殊减速比范围价格
  if (model === 'HCT800/1' && Array.isArray(item.ratios)) {
    // 检查特殊减速比范围
    const specialRatios = item.ratios.some(r => r >= 6.91 && r <= 15.82);
    if (specialRatios && specialModelPrices['HCT800/1-6.91-15.82:1']) {
      return { ...item, ...specialModelPrices['HCT800/1-6.91-15.82:1'] };
    }
  }
  
  return item;
};

/**
 * 批量修正特定型号价格
 * @param {Object} data 数据对象
 * @returns {Object} 修正后的数据对象
 */
export const fixSpecificModelPrices = (data) => {
  if (!data) return data;
  
  const result = { ...data };
  
  // 定义需要处理的集合
  const collections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
    'flexibleCouplings', 'standbyPumps'
  ];
  
  // 处理每个集合中的项目
  collections.forEach(colKey => {
    if (Array.isArray(result[colKey])) {
      result[colKey] = result[colKey].map(item => applySpecialModelPrice(item));
    }
  });
  
  return result;
};

/**
 * 完整处理价格数据
 * 处理基础价、折扣率、工厂价、市场价和包装价
 * @param {Object} data 数据对象
 * @returns {Object} 处理结果 { data, results }
 */
export const processPriceData = (data) => {
  if (!data) return { data: {}, results: { corrected: 0, warnings: [], errors: [] } };
  
  const result = { ...data };
  const warnings = [];
  const errors = [];
  let corrected = 0;
  
  // 定义需要处理的集合
  const collections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
    'flexibleCouplings', 'standbyPumps'
  ];
  
  // 处理每个集合中的项目价格
  collections.forEach(colKey => {
    if (Array.isArray(result[colKey])) {
      result[colKey] = result[colKey].map(item => {
        if (!item || typeof item !== 'object') return item;
        
        try {
          // 检查是否为"全国统一售价"
          const isFixedPrice = item.notes && item.notes.includes('全国统一售价');
          
          // 1. 确保基础价格有效
          let needsCorrection = false;
          let basePrice = safeParseFloat(item.basePrice);
          if (basePrice === undefined || isNaN(basePrice) || basePrice < 0) {
            basePrice = safeParseFloat(item.price) || 0;
            item.basePrice = basePrice;
            needsCorrection = true;
          }
          
          // 同步price与basePrice
          item.price = basePrice;
          
          // 2. 确保折扣率有效
          let discountRate = safeParseFloat(item.discountRate);
          if (discountRate === undefined || isNaN(discountRate) || discountRate < 0 || discountRate > 1) {
            discountRate = isFixedPrice ? 0 : getStandardDiscountRate(item.model);
            item.discountRate = discountRate;
            needsCorrection = true;
          }
          
          // 3. 计算工厂价
          let factoryPrice = safeParseFloat(item.factoryPrice);
          const calculatedFactoryPrice = isFixedPrice ? basePrice : parseFloat((basePrice * (1 - discountRate)).toFixed(2));
          
          if (factoryPrice === undefined || isNaN(factoryPrice) || factoryPrice < 0 || 
              Math.abs(factoryPrice - calculatedFactoryPrice) > 1) {
            factoryPrice = calculatedFactoryPrice;
            item.factoryPrice = factoryPrice;
            needsCorrection = true;
          }
          
          // 4. 计算市场价
          let marketPrice = safeParseFloat(item.marketPrice);
          const calculatedMarketPrice = isFixedPrice ? basePrice : parseFloat((factoryPrice * MARKET_PRICE_MULTIPLIER).toFixed(2));
          
          if (marketPrice === undefined || isNaN(marketPrice) || marketPrice < 0 || 
              Math.abs(marketPrice - calculatedMarketPrice) > 1) {
            marketPrice = calculatedMarketPrice;
            item.marketPrice = marketPrice;
            needsCorrection = true;
          }
          
          // 5. 设置包装价（默认等于工厂价，除非有特定值）
          let packagePrice = safeParseFloat(item.packagePrice);
          // 检查特殊打包价
          const specialPackagePrice = item.model && specialModelPrices[item.model.trim()]?.packagePrice;
          const calculatedPackagePrice = specialPackagePrice || factoryPrice;
          
          if (packagePrice === undefined || isNaN(packagePrice) || packagePrice < 0 || 
              (specialPackagePrice && packagePrice !== specialPackagePrice)) {
            packagePrice = calculatedPackagePrice;
            item.packagePrice = packagePrice;
            needsCorrection = true;
          }
          
          if (needsCorrection) {
            corrected++;
          }
          
          return item;
        } catch (e) {
          // 记录处理中的错误
          errors.push(`处理 ${colKey}/${item?.model || '未知'} 价格时发生错误: ${e.message}`);
          return item; // 返回原始项，避免数据丢失
        }
      });
    }
  });
  
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
 * 单个项目价格修正
 * @param {Object} item 需要修正价格的项目
 * @returns {Object} 修正后的项目
 */
export const correctPriceData = (item) => {
  if (!item || typeof item !== 'object') return item;
  
  try {
    // 检查是否为"全国统一售价"
    const isFixedPrice = item.notes && item.notes.includes('全国统一售价');
    
    // 1. 确保基础价格有效
    const basePrice = safeParseFloat(item.basePrice) || safeParseFloat(item.price) || 0;
    
    // 2. 确保折扣率有效
    let discountRate = safeParseFloat(item.discountRate);
    if (discountRate === undefined || isNaN(discountRate) || discountRate < 0 || discountRate > 1) {
      discountRate = isFixedPrice ? 0 : getStandardDiscountRate(item.model);
    }
    
    // 3. 计算工厂价
    const factoryPrice = isFixedPrice ? basePrice : parseFloat((basePrice * (1 - discountRate)).toFixed(2));
    
    // 4. 计算市场价
    const marketPrice = isFixedPrice ? basePrice : parseFloat((factoryPrice * MARKET_PRICE_MULTIPLIER).toFixed(2));
    
    // 5. 设置包装价（检查特殊打包价，默认等于工厂价）
    const specialPackagePrice = item.model && specialModelPrices[item.model.trim()]?.packagePrice;
    const packagePrice = specialPackagePrice || factoryPrice;
    
    // 返回更新后的项目
    return {
      ...item,
      basePrice,
      price: basePrice,
      discountRate,
      factoryPrice,
      marketPrice,
      packagePrice
    };
  } catch (e) {
    console.error(`correctPriceData: 处理 ${item?.model || '未知'} 价格时发生错误:`, e);
    return item; // 返回原始项，避免数据丢失
  }
};

// 不要包含重复的导出
// 注意：前面已经通过 export const 导出所有需要的函数
// 这里不再需要额外的导出块