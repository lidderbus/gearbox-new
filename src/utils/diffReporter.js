// src/utils/diffReporter.js

// 修正导入路径
import { formatDate } from './dataHelpers';

/**
 * 比较两个对象并生成差异报告
 * @param {Object} oldData 旧数据对象
 * @param {Object} newData 新数据对象
 * @returns {Array} 差异项数组
 */
export const generateDiffReport = (oldData, newData) => {
  if (!oldData || !newData) {
    return [];
  }
  
  const diffs = [];
  
  // 处理不同类型的数据集合
  const collections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'flexibleCouplings', 'standbyPumps'];
  
  collections.forEach(collection => {
    if (Array.isArray(oldData[collection]) && Array.isArray(newData[collection])) {
      // 比较集合中的每个项目
      oldData[collection].forEach(oldItem => {
        if (oldItem && oldItem.model) {
          const newItem = newData[collection].find(item => item && item.model === oldItem.model);
          
          if (newItem) {
            // 对比价格字段
            comparePriceFields(oldItem, newItem, diffs, collection);
          } else {
            // 旧项目在新数据中不存在
            diffs.push({
              type: 'removed',
              collection,
              model: oldItem.model,
              timestamp: new Date().toISOString()
            });
          }
        }
      });
      
      // 检查新添加的项目
      newData[collection].forEach(newItem => {
        if (newItem && newItem.model && !oldData[collection].some(item => item && item.model === newItem.model)) {
          diffs.push({
            type: 'added',
            collection,
            model: newItem.model,
            timestamp: new Date().toISOString()
          });
        }
      });
    }
  });
  
  return diffs;
};

/**
 * 比较两个对象的价格字段
 * @param {Object} oldItem 旧对象
 * @param {Object} newItem 新对象
 * @param {Array} diffs 差异数组（会被修改）
 * @param {String} collection 集合名称
 */
const comparePriceFields = (oldItem, newItem, diffs, collection) => {
  const priceFields = ['price', 'basePrice', 'factoryPrice', 'marketPrice', 'packagePrice', 'discountRate'];
  
  priceFields.forEach(field => {
    const oldValue = oldItem[field];
    const newValue = newItem[field];
    
    // 只有当两个值都存在且不相等时才记录差异
    if (oldValue !== undefined && newValue !== undefined && oldValue !== newValue) {
      const diff = {
        type: 'changed',
        collection,
        model: oldItem.model,
        field,
        oldValue,
        newValue,
        percentChange: (oldValue > 0) ? ((newValue - oldValue) / oldValue) * 100 : null,
        timestamp: new Date().toISOString()
      };
      
      diffs.push(diff);
    }
  });
};

/**
 * 格式化差异报告为可读文本
 * @param {Array} diffs 差异数组
 * @returns {String} 格式化后的文本
 */
export const formatDiffReport = (diffs) => {
  if (!diffs || diffs.length === 0) {
    return "没有检测到变化。";
  }
  
  let report = `数据对比报告 (${formatDate(new Date())})\n\n`;
  
  // 分组显示
  const added = diffs.filter(d => d.type === 'added');
  const removed = diffs.filter(d => d.type === 'removed');
  const changed = diffs.filter(d => d.type === 'changed');
  
  if (added.length > 0) {
    report += `新增项目 (${added.length}):\n`;
    added.forEach(item => {
      report += `- ${item.collection} / ${item.model}\n`;
    });
    report += '\n';
  }
  
  if (removed.length > 0) {
    report += `移除项目 (${removed.length}):\n`;
    removed.forEach(item => {
      report += `- ${item.collection} / ${item.model}\n`;
    });
    report += '\n';
  }
  
  if (changed.length > 0) {
    report += `价格变更 (${changed.length}):\n`;
    
    // 按模型分组
    const changesByModel = {};
    changed.forEach(item => {
      const key = `${item.collection}/${item.model}`;
      if (!changesByModel[key]) {
        changesByModel[key] = [];
      }
      changesByModel[key].push(item);
    });
    
    Object.keys(changesByModel).forEach(key => {
      report += `- ${key}:\n`;
      changesByModel[key].forEach(item => {
        const percentText = item.percentChange ? ` (${item.percentChange.toFixed(2)}%)` : '';
        report += `  * ${item.field}: ${item.oldValue} -> ${item.newValue}${percentText}\n`;
      });
    });
  }
  
  return report;
};