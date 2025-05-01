// src/utils/dataIntegration.js

/**
 * 数据集成工具
 * 用于合并外部JSON数据到应用现有数据中
 */

/**
 * 合并数据集合，将源数据合并到目标数据中
 * @param {Object} sourceData 源数据对象
 * @param {Object} targetData 目标数据对象
 * @returns {Object} 合并后的数据对象
 */
export function mergeDataCollections(sourceData, targetData) {
  // 创建目标数据的副本，避免直接修改原始数据
  const mergedData = JSON.parse(JSON.stringify(targetData || {}));
  
  // 定义需要处理的集合列表
  const collections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'
  ];
  
  // 遍历所有集合
  collections.forEach(collectionName => {
    // 如果源数据中有该集合且为数组
    if (sourceData[collectionName] && Array.isArray(sourceData[collectionName])) {
      // 确保目标数据中有该集合
      if (!mergedData[collectionName]) {
        mergedData[collectionName] = [];
      }
      
      // 获取现有型号的集合（用于去重）
      const existingModels = new Set(mergedData[collectionName].map(item => item.model));
      
      // 添加不重复的项目
      sourceData[collectionName].forEach(item => {
        if (item.model && !existingModels.has(item.model)) {
          // 在添加前处理数据项
          const processedItem = processItem(item, collectionName);
          
          // 添加到目标集合
          mergedData[collectionName].push(processedItem);
          existingModels.add(item.model);
        }
      });
    }
  });
  
  return mergedData;
}

/**
 * 处理数据项，补充或修正必要的字段
 * @param {Object} item 数据项
 * @param {string} collectionType 集合类型
 * @returns {Object} 处理后的数据项
 */
function processItem(item, collectionType) {
  // 创建数据项的副本
  const processedItem = { ...item };
  
  // 确保基础价格存在
  if (!processedItem.basePrice && processedItem.price) {
    processedItem.basePrice = processedItem.price;
  }
  
  // 根据型号和集合类型设置默认折扣率
  if (processedItem.discountRate === undefined) {
    // 根据数据所属集合确定默认折扣率
    switch (collectionType) {
      case 'hcGearboxes':
        processedItem.discountRate = 0.16; // HC系列默认折扣率
        
        // 特定型号的特殊折扣率
        if (processedItem.model?.includes('600')) {
          processedItem.discountRate = 0.12;
        } else if (processedItem.model?.includes('800')) {
          processedItem.discountRate = 0.08;
        } else if (
          processedItem.model?.includes('1000') || 
          processedItem.model?.includes('1200') || 
          processedItem.model?.includes('1400')
        ) {
          processedItem.discountRate = 0.06;
        }
        break;
      
      case 'gwGearboxes':
        processedItem.discountRate = 0.10; // GW系列默认折扣率
        break;
      
      case 'dtGearboxes':
        processedItem.discountRate = 0.10; // DT系列默认折扣率
        break;
      
      case 'flexibleCouplings':
      case 'standbyPumps':
        processedItem.discountRate = 0.10; // 附件默认折扣率
        break;
      
      default:
        processedItem.discountRate = 0.10; // 默认折扣率
        break;
    }
  }
  
  // 确保工厂价格存在
  if (!processedItem.factoryPrice && processedItem.basePrice) {
    processedItem.factoryPrice = Math.round(processedItem.basePrice * (1 - processedItem.discountRate));
  }
  
  // 确保市场价格存在
  if (!processedItem.marketPrice && processedItem.factoryPrice) {
    // 根据集合类型设置加成率
    let markup = 1.12; // 默认加成率
    
    // 根据集合类型调整加成率
    switch (collectionType) {
      case 'gwGearboxes':
        markup = 1.15; // GW系列加成率
        break;
      
      case 'hcmGearboxes':
        markup = 1.20; // HCM系列加成率
        break;
      
      case 'dtGearboxes':
        markup = 1.18; // DT系列加成率
        break;
      
      default:
        // 使用默认加成率 1.12
        break;
    }
    
    processedItem.marketPrice = Math.round(processedItem.factoryPrice * markup);
  }
  
  // 确保必要的维度字段存在
  if (!processedItem.dimensions && collectionType.includes('Gearboxes')) {
    processedItem.dimensions = '-';
  }
  
  return processedItem;
}

/**
 * 从JSON文件加载数据并与现有数据合并
 * @param {Object} currentData 当前应用数据
 * @param {string} jsonUrl JSON文件URL
 * @returns {Promise<Object>} 合并后的数据
 */
export async function loadAndMergeJsonData(currentData, jsonUrl) {
  try {
    // 加载JSON数据
    const response = await fetch(jsonUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // 解析JSON数据
    const jsonData = await response.json();
    
    // 合并数据
    const mergedData = mergeDataCollections(jsonData, currentData);
    
    return mergedData;
  } catch (error) {
    console.error('加载并合并JSON数据失败:', error);
    return currentData;
  }
}

/**
 * 从JSON字符串加载数据并与现有数据合并
 * @param {Object} currentData 当前应用数据
 * @param {string} jsonString JSON字符串
 * @returns {Object} 合并后的数据
 */
export function loadFromJsonString(currentData, jsonString) {
  try {
    // 解析JSON字符串
    const jsonData = JSON.parse(jsonString);
    
    // 合并数据
    return mergeDataCollections(jsonData, currentData);
  } catch (error) {
    console.error('从JSON字符串加载数据失败:', error);
    return currentData;
  }
}

/**
 * 计算数据统计信息
 * @param {Object} data 数据对象
 * @returns {Object} 统计信息
 */
export function calculateDataStats(data) {
  if (!data) return null;
  
  const stats = {
    totalItems: 0,
    collections: {}
  };
  
  // 需要统计的集合
  const collections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'
  ];
  
  // 统计每个集合的项目数量
  collections.forEach(collectionName => {
    if (data[collectionName] && Array.isArray(data[collectionName])) {
      stats.collections[collectionName] = data[collectionName].length;
      stats.totalItems += data[collectionName].length;
    } else {
      stats.collections[collectionName] = 0;
    }
  });
  
  return stats;
}