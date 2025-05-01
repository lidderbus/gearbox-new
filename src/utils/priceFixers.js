/**
 * src/utils/priceFixers.js
 * 价格修复工具，用于修正特定数据错误
 */

import { safeParseFloat } from './dataHelpers';
import { MARKET_PRICE_MULTIPLIER } from './priceManager';

/**
 * 修复全国统一售价系列产品的价格数据
 * 包括HCM、HCQ、HCX、HCA、HCV、MV系列产品采用全国统一售价，无折扣
 * 
 * @param {Object} data - 包含各产品系列的数据对象
 * @returns {Object} 修复后的数据对象
 */
export const fixFixedPriceSeries = (data) => {
  if (!data || typeof data !== 'object') return data;
  
  const result = { ...data };
  
  // 需要修复的系列及其对应集合
  const seriesToFix = [
    { prefix: 'HCM', collection: 'hcmGearboxes' },
    { prefix: 'HCQ', collection: 'hcqGearboxes' },
    { prefix: 'HCX', collection: 'hcxGearboxes' },
    { prefix: 'HCA', collection: 'hcaGearboxes' },
    { prefix: 'HCV', collection: 'hcvGearboxes' },
    { prefix: 'MV', collection: 'mvGearboxes' },
  ];
  
  // 修复各系列齿轮箱
  seriesToFix.forEach(series => {
    if (Array.isArray(result[series.collection])) {
      result[series.collection] = result[series.collection].map(item => {
        if (item && item.model && item.model.startsWith(series.prefix)) {
          return fixFixedPriceItem(item);
        }
        return item;
      });
    }
  });
  
  // 如果有其他集合可能包含这些系列的产品，也应该处理它们
  const collectionsToCheck = ['gcGearboxes', 'hcGearboxes', 'defaultGearboxes', 'otherGearboxes'];
  
  collectionsToCheck.forEach(collection => {
    if (Array.isArray(result[collection])) {
      result[collection] = result[collection].map(item => {
        if (item && item.model) {
          // 检查该项目是否属于需要修复的系列
          for (const series of seriesToFix) {
            if (item.model.startsWith(series.prefix)) {
              return fixFixedPriceItem(item);
            }
          }
        }
        return item;
      });
    }
  });
  
  return result;
};

/**
 * 修复单个全国统一售价产品项的价格
 * 
 * @param {Object} item - 需要修复的产品项
 * @returns {Object} 修复后的产品项
 */
export const fixFixedPriceItem = (item) => {
  if (!item || typeof item !== 'object' || !item.model) {
    return item;
  }
  
  try {
    const result = { ...item };
    
    // 确保基础价格有效
    result.basePrice = safeParseFloat(result.basePrice) || safeParseFloat(result.price) || 0;
    result.price = result.basePrice; // 保持一致
    
    // 全国统一售价，折扣率为0
    result.discountRate = 0;
    
    // 工厂价等于基础价
    result.factoryPrice = result.basePrice;
    
    // 市场价等于基础价（全国统一售价）
    result.marketPrice = result.basePrice;
    
    // 打包价等于基础价
    result.packagePrice = result.basePrice;
    
    // 添加注释，表明这是全国统一售价
    if (!result.notes) {
      result.notes = "全国统一售价";
    } else if (!result.notes.includes("全国统一售价")) {
      result.notes += ", 全国统一售价";
    }
    
    return result;
  } catch (error) {
    console.error(`修复固定价格项时出错 (${item.model}):`, error);
    return item; // 出错时返回原始项
  }
};

/**
 * 获取全国统一售价系列列表
 * @returns {Array<string>} 全国统一售价系列前缀列表
 */
export const getFixedPriceSeriesList = () => {
  return ['HCM', 'HCQ', 'HCX', 'HCA', 'HCV', 'MV'];
};

/**
 * 检查产品是否属于全国统一售价系列
 * @param {string} model - 产品型号
 * @returns {boolean} 是否为全国统一售价系列
 */
export const isFixedPriceSeries = (model) => {
  if (!model) return false;
  
  const fixedPriceSeries = getFixedPriceSeriesList();
  for (const prefix of fixedPriceSeries) {
    if (model.startsWith(prefix)) {
      return true;
    }
  }
  
  return false;
};

// 为向后兼容保留HCM系列特定修复函数
export const fixHCMSeriesPrices = fixFixedPriceSeries;
export const fixHCMItemPrice = fixFixedPriceItem;

export default fixFixedPriceSeries;