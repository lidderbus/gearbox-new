// src/utils/DataConsistencyChecker.js
/**
 * 数据一致性检查工具
 * 用于检查和修复数据中的不一致问题
 */

import { safeParseFloat } from './dataHelpers';
import { correctPriceData } from './priceManager';

/**
 * 检查传递能力数组是否与减速比数组长度匹配
 * @param {Object} item - 齿轮箱对象
 * @returns {boolean} 是否匹配
 */
export const checkCapacityArrayLength = (item) => {
  if (!item) return false;
  
  // 检查基本条件：两者都必须是数组
  if (!Array.isArray(item.ratios) || !Array.isArray(item.transferCapacity)) {
    return false;
  }
  
  // 检查长度是否匹配
  return item.ratios.length === item.transferCapacity.length;
};

/**
 * 检查并修复传递能力数组长度
 * @param {Object} item - 齿轮箱对象
 * @returns {Object} 修复后的齿轮箱对象
 */
export const fixCapacityArrayLength = (item) => {
  if (!item) return item;
  
  // 检查基本条件
  if (!Array.isArray(item.ratios) || item.ratios.length === 0) {
    return item; // 无法修复
  }
  
  const newItem = { ...item };
  
  // 创建或修正传递能力数组
  if (!Array.isArray(newItem.transferCapacity)) {
    // 如果传递能力不是数组，尝试创建
    if (typeof newItem.transferCapacity === 'number' && !isNaN(newItem.transferCapacity)) {
      // 使用单一值创建数组
      newItem.transferCapacity = Array(newItem.ratios.length).fill(newItem.transferCapacity);
    } else if (typeof newItem.power === 'number' && !isNaN(newItem.power)) {
      // 尝试使用power字段估算传递能力
      const estimatedCapacity = newItem.power / 1000; // 简单估算
      newItem.transferCapacity = Array(newItem.ratios.length).fill(estimatedCapacity);
    } else {
      // 创建默认值数组
      newItem.transferCapacity = Array(newItem.ratios.length).fill(0.1); // 默认低值
    }
  } else if (newItem.transferCapacity.length !== newItem.ratios.length) {
    // 长度不匹配，调整长度
    if (newItem.transferCapacity.length > 0) {
      // 有些值，复制第一个值
      const firstValue = safeParseFloat(newItem.transferCapacity[0]) || 0.1;
      newItem.transferCapacity = Array(newItem.ratios.length).fill(firstValue);
    } else {
      // 空数组，填充默认值
      newItem.transferCapacity = Array(newItem.ratios.length).fill(0.1);
    }
  }
  
  // 确保数组中所有值有效
  newItem.transferCapacity = newItem.transferCapacity.map(val => {
    const parsed = safeParseFloat(val);
    return parsed !== undefined && parsed > 0 ? parsed : 0.1;
  });
  
  return newItem;
};

/**
 * 检查并修复价格字段一致性
 * @param {Object} item - 产品对象
 * @returns {Object} 修复后的产品对象
 */
export const fixPriceConsistency = (item) => {
  if (!item || !item.model) return item;
  
  try {
    return correctPriceData(item);
  } catch (e) {
    console.error(`修复价格字段失败: ${e.message}`);
    return item;
  }
};

/**
 * 检查并修复选型结果中的必要字段
 * @param {Object} result - 选型结果
 * @returns {Object} 修复后的选型结果
 */
export const fixSelectionResult = (result) => {
  if (!result) return null;
  
  const fixed = { ...result };
  
  // 确保推荐数组存在
  if (!Array.isArray(fixed.recommendations)) {
    fixed.recommendations = [];
  }
  
  // 修复每个推荐项
  fixed.recommendations = fixed.recommendations.map(item => {
    if (!item || !item.model) return item;
    
    const fixedItem = { ...item };
    
    // 确保selectedRatio存在
    if (fixedItem.selectedRatio === undefined) {
      if (fixedItem.ratio !== undefined) {
        fixedItem.selectedRatio = fixedItem.ratio;
      } else if (Array.isArray(fixedItem.ratios) && fixedItem.ratios.length > 0) {
        // 使用第一个减速比
        fixedItem.selectedRatio = fixedItem.ratios[0];
      }
    }
    
    // 确保selectedCapacity存在
    if (fixedItem.selectedCapacity === undefined) {
      if (Array.isArray(fixedItem.transferCapacity) && fixedItem.transferCapacity.length > 0) {
        // 使用第一个传递能力
        fixedItem.selectedCapacity = fixedItem.transferCapacity[0];
      } else if (typeof fixedItem.transferCapacity === 'number') {
        fixedItem.selectedCapacity = fixedItem.transferCapacity;
      } else if (typeof fixedItem.power === 'number') {
        // 尝试从功率估算
        fixedItem.selectedCapacity = fixedItem.power / 1000;
      }
    }
    
    // 确保capacityMargin存在
    if (fixedItem.capacityMargin === undefined && fixedItem.selectedCapacity !== undefined && result.requiredTransferCapacity) {
      // 计算能力余量
      fixedItem.capacityMargin = ((fixedItem.selectedCapacity - result.requiredTransferCapacity) / result.requiredTransferCapacity) * 100;
    }
    
    // 确保ratioDiffPercent存在
    if (fixedItem.ratioDiffPercent === undefined && fixedItem.selectedRatio !== undefined && result.targetRatio) {
      // 计算减速比偏差
      fixedItem.ratioDiffPercent = (Math.abs(fixedItem.selectedRatio - result.targetRatio) / result.targetRatio) * 100;
    }
    
    // 修复价格字段
    return fixPriceConsistency(fixedItem);
  });
  
  return fixed;
};

/**
 * 批量检查并修复数据
 * @param {Object} data - 应用数据对象
 * @returns {Object} 修复结果 { data, results }
 */
export const batchFixData = (data) => {
  if (!data) return { data: {}, results: { fixed: 0, warnings: [], errors: [] } };
  
  const results = {
    fixed: 0,
    warnings: [],
    errors: []
  };
  
  const fixedData = { ...data };
  
  // 定义需要处理的集合
  const collections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
    'flexibleCouplings', 'standbyPumps'
  ];
  
  // 处理每个集合中的项目
  collections.forEach(colKey => {
    if (Array.isArray(fixedData[colKey])) {
      fixedData[colKey] = fixedData[colKey].map(item => {
        try {
          // 跳过无效项
          if (!item || !item.model) return item;
          
          let fixed = { ...item };
          let isFixed = false;
          
          // 对齿轮箱，检查并修复传递能力数组
          if (colKey.endsWith('Gearboxes') && !checkCapacityArrayLength(fixed)) {
            fixed = fixCapacityArrayLength(fixed);
            isFixed = true;
          }
          
          // 检查并修复价格字段
          const priceCorrected = fixPriceConsistency(fixed);
          if (JSON.stringify(priceCorrected) !== JSON.stringify(fixed)) {
            fixed = priceCorrected;
            isFixed = true;
          }
          
          if (isFixed) {
            results.fixed++;
          }
          
          return fixed;
        } catch (e) {
          results.errors.push(`处理 ${colKey}/${item?.model || '未知'} 时发生错误: ${e.message}`);
          return item; // 返回原始项，避免数据丢失
        }
      });
    }
  });
  
  return {
    data: fixedData,
    results
  };
};

export default {
  checkCapacityArrayLength,
  fixCapacityArrayLength,
  fixPriceConsistency,
  fixSelectionResult,
  batchFixData
};