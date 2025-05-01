// 价格计算集成方案

/**
 * 步骤1: 文件结构重组
 * 
 * 当前问题:
 * - 多个文件包含价格计算逻辑 (priceDiscount.js, priceManager.js, priceFixers.js)
 * - 价格计算逻辑分散且可能有冲突
 * - 折扣率标准不一致
 * 
 * 建议的文件结构:
 * 
 * 1. src/utils/priceManager.js - 主要价格计算模块
 *    - 包含所有价格计算核心功能
 *    - 定义常量和接口
 *    - 导出统一的API
 * 
 * 2. src/utils/priceFixers.js - 特殊价格修复工具
 *    - 处理固定价格系列
 *    - 处理特殊型号价格
 *    - 依赖priceManager中的核心功能
 * 
 * 3. src/data/priceConstants.js - 价格常量和配置
 *    - 定义默认折扣率
 *    - 定义市场价倍数
 *    - 定义特殊型号价格覆盖
 *    - 定义全国统一售价系列
 * 
 * 4. src/services/priceService.js - 价格业务逻辑服务
 *    - 处理批量价格调整
 *    - 处理价格历史记录
 *    - 定义高级价格计算操作
 */

/**
 * 步骤2: 创建价格常量模块
 */

// src/data/priceConstants.js
export const PRICE_CONSTANTS = {
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
  FIXED_PRICE_SERIES: ['HCM', 'HCQ', 'HCX', 'HCA', 'HCV', 'MV'],
  
  // 特殊型号折扣率覆盖
  SPECIAL_MODEL_DISCOUNTS: {
    'J300': 0.22,                   // 报告特批
    'D300A': 0.22,                  // 报告特批
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
 * 步骤3: 修改App.js中的引用
 * 
 * 在App.js中需要修改的部分:
 * 
 * 1. 引入新的统一模块:
 *    import * as PriceManager from './utils/priceManager';
 * 
 * 2. 替换现有价格计算函数调用:
 *    - calculateFactoryPrice → PriceManager.calculateFactoryPrice
 *    - calculateMarketPrice → PriceManager.calculateMarketPrice
 *    - calculatePackagePrice → PriceManager.calculatePackagePrice
 *    - getStandardDiscountRate → PriceManager.getStandardDiscountRate
 *    - correctPriceData → PriceManager.correctPriceData
 * 
 * 3. 移除不再需要的引入:
 *    - 移除 import { calculateFactoryPrice, ... } from './utils/priceDiscount';
 *    - 移除 import fixHCMSeriesPrices from './utils/priceFixers';
 */

/**
 * 步骤4: 统一折扣率计算逻辑
 */

// 更新getStandardDiscountRate函数的实现，确保统一的折扣率计算:
function getStandardDiscountRateImplementation(model, type = 'auto') {
  const {
    DEFAULT_DISCOUNT_RATE,
    SERIES_DISCOUNT_RATES,
    FIXED_PRICE_SERIES,
    SPECIAL_MODEL_DISCOUNTS
  } = PRICE_CONSTANTS;
  
  if (!model) return DEFAULT_DISCOUNT_RATE;
  
  // 1. 检查是否有特殊型号的精确匹配
  if (SPECIAL_MODEL_DISCOUNTS[model]) {
    return SPECIAL_MODEL_DISCOUNTS[model];
  }
  
  // 2. 检查是否是固定价格系列(全国统一售价)
  for (const prefix of FIXED_PRICE_SERIES) {
    if (model.startsWith(prefix)) {
      return 0.0; // 全国统一售价无折扣
    }
  }
  
  // 3. 自动检测类型
  if (type === 'auto') {
    if (model.startsWith('HGT') || model.startsWith('HGTH')) {
      type = 'coupling';
    } else if (model.startsWith('2CY') || model.startsWith('SPF')) {
      type = 'pump';
    } else {
      type = 'gearbox';
    }
  }
  
  // 4. 按类型和系列确定折扣率
  if (type === 'gearbox') {
    // HC系列分级折扣
    if (model.startsWith('HC')) {
      if (model.includes('1000') || model.includes('1200') || model.includes('1400')) {
        return SERIES_DISCOUNT_RATES.HC_1000_PLUS;
      } else if (model.includes('800')) {
        return SERIES_DISCOUNT_RATES.HC_800;
      } else if (model.includes('600')) {
        return SERIES_DISCOUNT_RATES.HC_600;
      }
      return SERIES_DISCOUNT_RATES.HC_STANDARD;
    }
    
    // 其他齿轮箱系列
    if (model.startsWith('GW')) return SERIES_DISCOUNT_RATES.GW;
    if (model.startsWith('DT')) return SERIES_DISCOUNT_RATES.DT;
    if (model.startsWith('GC')) return SERIES_DISCOUNT_RATES.GC;
    if (model.startsWith('HCL')) return SERIES_DISCOUNT_RATES.HCL;
  }
  else if (type === 'coupling') {
    return SERIES_DISCOUNT_RATES.COUPLING;
  }
  else if (type === 'pump') {
    return SERIES_DISCOUNT_RATES.PUMP;
  }
  
  // 默认折扣率
  return DEFAULT_DISCOUNT_RATE;
}

/**
 * 步骤5: 统一的价格验证逻辑
 */

function validateItemPrices(item) {
  if (!item || !item.model) return { valid: false, errors: ['无效的项目或缺少型号'] };
  
  const errors = [];
  const warnings = [];
  
  // 1. 验证基础价格
  const basePrice = parseFloat(item.basePrice);
  if (isNaN(basePrice) || basePrice < 0) {
    errors.push('基础价格无效或为负');
  }
  
  // 2. 验证折扣率
  const discountRate = parseFloat(item.discountRate);
  if (isNaN(discountRate) || discountRate < 0 || discountRate > 1) {
    errors.push('折扣率无效或超出范围(0-1)');
  }
  
  // 3. 验证工厂价
  const factoryPrice = parseFloat(item.factoryPrice);
  if (isNaN(factoryPrice) || factoryPrice < 0) {
    errors.push('工厂价无效或为负');
  } else if (basePrice > 0 && discountRate >= 0 && discountRate <= 1) {
    // 检查工厂价是否与基础价和折扣率一致
    const expectedFactoryPrice = basePrice * (1 - discountRate);
    const tolerance = 1; // 1元的误差容忍度
    
    if (Math.abs(factoryPrice - expectedFactoryPrice) > tolerance) {
      warnings.push(`工厂价(${factoryPrice})与计算值(${expectedFactoryPrice.toFixed(2)})不一致`);
    }
  }
  
  // 4. 验证市场价
  const marketPrice = parseFloat(item.marketPrice);
  if (isNaN(marketPrice) || marketPrice < 0) {
    errors.push('市场价无效或为负');
  } else if (factoryPrice > 0) {
    // 检查市场价是否与工厂价一致
    const expectedMarketPrice = factoryPrice * PRICE_CONSTANTS.MARKET_PRICE_MULTIPLIER;
    const tolerance = 1; // 1元的误差容忍度
    
    if (Math.abs(marketPrice - expectedMarketPrice) > tolerance) {
      warnings.push(`市场价(${marketPrice})与计算值(${expectedMarketPrice.toFixed(2)})不一致`);
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * 步骤6: 价格历史记录改进
 */

// 提升价格历史跟踪精度
function createPriceChangeRecord(oldItem, newItem) {
  if (!oldItem || !newItem || !oldItem.model || oldItem.model !== newItem.model) {
    return null;
  }
  
  const changes = [];
  const priceFields = ['basePrice', 'discountRate', 'factoryPrice', 'marketPrice', 'packagePrice'];
  
  priceFields.forEach(field => {
    const oldValue = parseFloat(oldItem[field]);
    const newValue = parseFloat(newItem[field]);
    
    if (!isNaN(oldValue) && !isNaN(newValue) && Math.abs(oldValue - newValue) > 0.01) {
      changes.push({
        field,
        oldValue: field === 'discountRate' ? oldValue * 100 : oldValue,
        newValue: field === 'discountRate' ? newValue * 100 : newValue,
        percentChange: oldValue !== 0 ? ((newValue - oldValue) / oldValue * 100).toFixed(2) + '%' : 'N/A'
      });
    }
  });
  
  if (changes.length === 0) {
    return null;
  }
  
  return {
    timestamp: new Date().toISOString(),
    model: newItem.model,
    changes,
    details: {
      type: newItem.model.startsWith('HGT') ? 'coupling' : 
           (newItem.model.startsWith('2CY') || newItem.model.startsWith('SPF') ? 'pump' : 'gearbox'),
      series: newItem.model.substring(0, 2),
      isFixedPrice: PRICE_CONSTANTS.FIXED_PRICE_SERIES.some(prefix => newItem.model.startsWith(prefix))
    }
  };
}