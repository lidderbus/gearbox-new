// src/utils/enhancedRepair.js
/**
 * 增强型数据修复与管理工具
 * 解决原始repair.js中的一些问题，提供更健壮的功能
 */

import { safeParseFloat } from './dataHelpers';
import { APP_DATA_VERSION, DEFAULTS, MARKET_PRICE_MULTIPLIER } from '../config';

/**
 * 深度合并数据对象，更健壮地处理嵌套结构
 * @param {Object} source 源数据对象
 * @param {Object} target 目标数据对象
 * @param {Object} options 选项，例如 { prioritizeKeys: [...], prioritizeCollections: {...} }
 * @returns {Object} 合并后的数据对象
 */
export const deepMergeData = (source, target, options = {}) => {
  if (!source) return target || {};
  if (!target) return source || {};

  // 提取选项
  const { prioritizeKeys = [], prioritizeCollections = {} } = options;
  
  // 创建结果对象的副本
  const result = { ...target };
  
  // 定义应使用mergeDataCollections逻辑合并的集合
  const mergeableCollections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
    'flexibleCouplings', 'standbyPumps',
  ];

  // 处理source中的每个键
  Object.keys(source).forEach(key => {
    // 如果键在prioritizeKeys中，始终使用source的值
    if (prioritizeKeys.includes(key)) {
      result[key] = source[key];
      return;
    }
    
    // 处理集合数据 - 优先使用prioritizeCollections中的数据
    if (prioritizeCollections[key] && Array.isArray(prioritizeCollections[key])) {
      // 最高优先级 - 使用选项中的集合数据
      result[key] = mergeCollections(
        mergeCollections(source[key], result[key]), 
        prioritizeCollections[key]
      );
    } 
    // 处理标准可合并集合
    else if (mergeableCollections.includes(key) && Array.isArray(source[key])) {
      result[key] = mergeCollections(source[key], result[key]);
    }
    // 处理其他数组类型
    else if (Array.isArray(source[key])) {
      // 如果不是可合并集合但是数组，直接使用源数组
      result[key] = [...source[key]];
    }
    // 递归合并嵌套对象（非数组）
    else if (isPlainObject(source[key]) && isPlainObject(result[key])) {
      result[key] = deepMergeData(source[key], result[key], options);
    }
    // 对于简单值或未在target中定义的对象，使用source值
    else if (source[key] !== undefined) {
      result[key] = source[key];
    }
    // 否则保留target的值
  });

  return result;
};

/**
 * 检查是否是纯对象（非数组，非null）
 */
function isPlainObject(obj) {
  return obj && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * 按model合并数据集合，处理重复项和无效项
 * @param {Array} source 源数组
 * @param {Array} target 目标数组
 * @returns {Array} 合并后的数组
 */
export const mergeCollections = (source, target) => {
  if (!source || !Array.isArray(source)) return target || [];
  // 确保target是数组
  const initialTarget = Array.isArray(target) ? target : [];

  // 创建按model索引的映射
  const modelMap = new Map();
  
  // 首先添加target中的有效项到映射
  initialTarget.forEach(item => {
    if (item && typeof item.model === 'string' && item.model.trim()) {
      modelMap.set(item.model.trim(), { ...item });
    } else {
      console.warn("enhancedRepair::mergeCollections: 跳过无model的目标项:", item);
    }
  });

  // 合并source中的项，优先使用source的值
  source.forEach(sourceItem => {
    if (sourceItem && typeof sourceItem.model === 'string' && sourceItem.model.trim()) {
      const model = sourceItem.model.trim();
      if (modelMap.has(model)) {
        // 合并相同model的对象，优先使用source的非undefined值
        const existingItem = modelMap.get(model);
        const mergedItem = { ...existingItem };
        
        Object.keys(sourceItem).forEach(prop => {
          if (sourceItem[prop] !== undefined) {
            mergedItem[prop] = sourceItem[prop];
          }
        });
        
        modelMap.set(model, mergedItem);
      } else {
        // 添加新项到映射
        modelMap.set(model, { ...sourceItem });
      }
    } else {
      console.warn("enhancedRepair::mergeCollections: 跳过无model的源项:", sourceItem);
    }
  });

  // 将映射转回数组
  return Array.from(modelMap.values());
};

/**
 * 统一处理价格字段的计算
 * @param {Object} item 需要处理价格的项目
 * @param {Object} options 价格处理选项
 * @returns {Object} 处理后的项目
 */
export const processPriceFields = (item, options = {}) => {
  if (!item || typeof item !== 'object') return item;
  
  const result = { ...item };
  const { 
    forceRecalculate = false, 
    useFixedPrices = false,
    marketMultiplier = MARKET_PRICE_MULTIPLIER 
  } = options;
  
  // 确保基本价格存在且有效
  result.basePrice = safeParseFloat(result.basePrice) || safeParseFloat(result.price) || 0;
  result.price = result.basePrice; // 保持一致
  
  // 确保折扣率有效
  result.discountRate = safeParseFloat(result.discountRate);
  if (result.discountRate === undefined || result.discountRate < 0 || result.discountRate > 1) {
    result.discountRate = getDefaultDiscountRate(result.model);
  }
  
  // 处理"全国统一售价"情况
  if (useFixedPrices || result.notes?.includes('全国统一售价')) {
    result.discountRate = 0;
    result.factoryPrice = result.basePrice;
    result.packagePrice = result.basePrice;
    result.marketPrice = result.basePrice;
    return result;
  }
  
  // 计算工厂价（考虑现有值）
  const calculatedFactoryPrice = result.basePrice * (1 - result.discountRate);
  if (forceRecalculate || !result.factoryPrice || Math.abs(result.factoryPrice - calculatedFactoryPrice) > 1) {
    result.factoryPrice = parseFloat(calculatedFactoryPrice.toFixed(2));
  }
  
  // 计算市场价（考虑现有值）
  const calculatedMarketPrice = result.factoryPrice * marketMultiplier;
  if (forceRecalculate || !result.marketPrice || Math.abs(result.marketPrice - calculatedMarketPrice) > 1) {
    result.marketPrice = parseFloat(calculatedMarketPrice.toFixed(2));
  }
  
  // 标准配置下，打包价等于工厂价
  if (forceRecalculate || !result.packagePrice) {
    result.packagePrice = result.factoryPrice;
  }
  
  return result;
};

/**
 * 获取默认折扣率
 * @param {string} model 型号
 * @returns {number} 默认折扣率
 */
function getDefaultDiscountRate(model) {
  if (!model) return 0.10; // 通用默认值
  
  // 根据型号前缀确定折扣率
  const modelPrefix = model.substring(0, 2).toUpperCase();
  
  switch (modelPrefix) {
    case 'HC': return 0.16; // HC系列
    case 'GW': return 0.10; // GW系列
    case 'DT': return 0.10; // DT系列
    case 'GC': return 0.10; // GC系列
    case 'HG': return 0.10; // HG联轴器
    case '2C': return 0.10; // 备用泵
    default: return 0.10;   // 其他
  }
}

/**
 * 确保数值字段的有效性
 * @param {Object} item 需要处理的项目
 * @param {Array} fields 需要确保有效的数值字段数组
 * @param {Object} defaults 默认值对象
 * @returns {Object} 处理后的项目
 */
export const ensureNumericFields = (item, fields, defaults = {}) => {
  if (!item || typeof item !== 'object') return item;
  
  const result = { ...item };
  let hasChanges = false;
  
  fields.forEach(field => {
    const value = safeParseFloat(result[field]);
    const defaultValue = defaults[field] || 0;
    
    // 如果值无效或负值，使用默认值
    if (value === undefined || isNaN(value) || value < 0) {
      result[field] = defaultValue;
      hasChanges = true;
    }
  });
  
  return { item: result, hasChanges };
};

/**
 * 智能修复数组长度匹配问题
 * @param {Array} array1 第一个数组
 * @param {Array} array2 第二个数组
 * @param {Function} valueGenerator 生成填充值的函数
 * @returns {Array} 修复后的数组2
 */
export const fixArrayLength = (array1, array2, valueGenerator) => {
  if (!Array.isArray(array1) || !Array.isArray(array2)) {
    return array2;
  }
  
  // 如果长度相同，无需修复
  if (array1.length === array2.length) {
    return array2;
  }
  
  // 创建新数组以匹配array1的长度
  const result = [...array2];
  
  if (array1.length > array2.length) {
    // 需要添加项
    for (let i = array2.length; i < array1.length; i++) {
      const value = typeof valueGenerator === 'function' 
        ? valueGenerator(i, array1[i], array2)
        : (array2[array2.length - 1] || 0);
      
      result.push(value);
    }
  } else {
    // 需要截断
    return result.slice(0, array1.length);
  }
  
  return result;
};

/**
 * 确保所有预期的集合都存在
 * @param {Object} data 数据对象
 * @returns {Object} 处理后的数据对象
 */
export const ensureCollections = (data) => {
  if (!data) return {};
  
  const collections = [
    // 齿轮箱系列
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
    // 附件系列
    'flexibleCouplings', 'standbyPumps'
  ];
  
  const result = { ...data };
  
  // 确保每个集合都存在，如果不存在则初始化为空数组
  collections.forEach(collection => {
    if (!Array.isArray(result[collection])) {
      console.log(`enhancedRepair::ensureCollections: 初始化缺失的集合 ${collection} 为空数组`);
      result[collection] = [];
    }
  });
  
  return result;
};

/**
 * 增强型数据加载和修复流程
 * @param {Object} options 选项
 * @returns {Promise<Object>} 加载并修复的数据对象
 */
export const enhancedLoadAndRepairData = async (options = {}) => {
  console.log('enhancedRepair: 开始数据加载和修复过程...');
  const { onProgress, initialDataOverrides = {} } = options;

  try {
    onProgress?.('initializing');
    
    // 数据加载流程（与原始流程类似）
    // 1. 从嵌入式数据开始
    // 2. 合并localStorage数据
    // 3. 合并外部JSON文件
    // 4. 应用覆盖选项
    
    // 数据修复流程
    // 使用上述工具函数进行更健壮的修复
    
    // 数据验证
    // 使用增强型验证逻辑
    
    // 更新版本和保存
    
    const result = {
      // 最终数据...
      _version: APP_DATA_VERSION,
      _lastFixed: new Date().toISOString()
    };
    
    onProgress?.('ready');
    return result;
  } catch (error) {
    console.error('enhancedRepair: 数据加载/修复过程中出现严重错误:', error);
    throw error;
  }
};

// 导出函数
export default {
  deepMergeData,
  mergeCollections,
  processPriceFields,
  ensureNumericFields,
  fixArrayLength,
  ensureCollections,
  enhancedLoadAndRepairData
};
