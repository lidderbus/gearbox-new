// src/utils/dataMerger.js

/**
 * Merges new data into existing data based on unique model identifiers.
 * If an item with the same model exists, it updates it; otherwise, it adds the new item.
 *
 * @param {object} existingData - 当前的 appData 对象。
 * @param {object} newData - 新导入并适配过的数据对象。
 * @returns {object} 合并后的 appData 对象。
 */
export const mergeDataSources = (existingData, newData) => {
  // 创建现有数据的浅拷贝以避免直接修改
  const mergedData = { ...existingData };

  // 遍历新数据中的每个类别 (例如 'hcGearboxes', 'flexibleCouplings')
  for (const categoryKey in newData) {
    // 确保是 newData 自身的属性，并且是数组类型（我们主要处理数组集合）
    if (Object.hasOwnProperty.call(newData, categoryKey) && Array.isArray(newData[categoryKey])) {
      // 确保 mergedData 中也存在该类别，如果不存在则初始化为空数组
      if (!mergedData[categoryKey] || !Array.isArray(mergedData[categoryKey])) {
        mergedData[categoryKey] = [];
      }

      // 创建现有项的 Map，以便通过 model 快速查找和更新
      const existingItemsMap = new Map();
      mergedData[categoryKey].forEach(item => {
        // 确保 item 和 item.model 存在
        if (item && item.model) {
          existingItemsMap.set(item.model, item);
        }
      });

      // 遍历新数据中的项
      newData[categoryKey].forEach(newItem => {
        if (newItem && newItem.model) {
          // 如果 model 已存在，则更新；否则，添加新项
          existingItemsMap.set(newItem.model, newItem);
        } else {
          // 处理缺少 'model' 属性的项
          console.warn(`类别 ${categoryKey} 中的项缺少 'model' 属性:`, newItem);
          // 你可以选择是否将缺少 model 的项也添加进去
          // mergedData[categoryKey].push(newItem);
        }
      });

      // 将更新后的 Map 转换回数组，替换掉原来的类别数组
      mergedData[categoryKey] = Array.from(existingItemsMap.values());

    } else if (Object.hasOwnProperty.call(newData, categoryKey)) {
       // 如果 newData 中的属性不是数组，直接复制（例如，如果将来有非数组配置）
       mergedData[categoryKey] = newData[categoryKey];
    }
  }

  console.log("数据合并完成。结果:", mergedData);
  return mergedData; // 返回合并后的完整数据对象
};
