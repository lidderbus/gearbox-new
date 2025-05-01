// src/utils/selectionHistory.js

const HISTORY_KEY = 'selectionHistory'; // localStorage 键名
const MAX_HISTORY_ITEMS = 50; // 最大保存条数

/**
 * 获取选型历史记录
 * @returns {Array} 历史记录数组
 */
export const getSelectionHistory = () => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("加载选型历史失败:", error);
    return [];
  }
};

/**
 * 保存一条新的选型历史记录
 * @param {object} selectionResult - 选型结果对象
 * @param {object} projectInfo - 项目信息对象
 * @param {object} selectedComponents - 选中的组件对象
 * @param {object} engineData - 发动机输入数据
 * @param {object} requirementData - 需求输入数据
 * @returns {boolean} 保存成功返回 true，否则 false
 */
export const saveSelectionToHistory = (selectionResult, projectInfo, selectedComponents, engineData, requirementData) => {
  try {
    const history = getSelectionHistory();

    const newEntry = {
      id: Date.now(), // 使用时间戳作为唯一 ID
      timestamp: new Date().toISOString(),
      projectInfo: { ...projectInfo },
      selectionResult: { ...selectionResult }, // 确保保存的是副本
      selectedComponents: { ...selectedComponents },
      engineData: { ...engineData },
      requirementData: { ...requirementData }
    };

    // 添加新记录到数组开头
    history.unshift(newEntry);

    // 限制历史记录数量
    const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(limitedHistory));
    console.log("选型历史已保存:", newEntry);
    return true;
  } catch (error) {
    console.error("保存选型历史失败:", error);
    return false;
  }
};

/**
 * 从历史记录中加载指定的选型数据
 * @param {number} historyId - 要加载的历史记录 ID
 * @returns {object | null} 找到的历史记录对象，或 null
 */
export const loadSelectionFromHistory = (historyId) => {
  try {
    const history = getSelectionHistory();
    const entry = history.find(item => item.id === historyId);
    if (entry) {
        console.log("从历史加载:", entry);
        // 返回完整的条目，让调用者处理状态更新
        return entry;
    }
    console.warn("未找到历史记录 ID:", historyId);
    return null;
  } catch (error) {
    console.error("加载选型历史失败:", error);
    return null;
  }
};

/**
 * 删除一条选型历史记录
 * @param {number} historyId - 要删除的历史记录 ID
 * @returns {boolean} 删除成功返回 true，否则 false
 */
export const deleteSelectionHistory = (historyId) => {
  try {
    let history = getSelectionHistory();
    const initialLength = history.length;
    history = history.filter(item => item.id !== historyId);

    if (history.length < initialLength) {
      localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
      console.log("历史记录已删除:", historyId);
      return true;
    }
    console.warn("尝试删除不存在的历史记录 ID:", historyId);
    return false;
  } catch (error) {
    console.error("删除选型历史失败:", error);
    return false;
  }
};

/**
 * 清空所有选型历史记录
 * @returns {boolean} 清空成功返回 true，否则 false
 */
export const clearSelectionHistory = () => {
    try {
        localStorage.removeItem(HISTORY_KEY);
        console.log("选型历史已清空");
        return true;
    } catch (error) {
        console.error("清空选型历史失败:", error);
        return false;
    }
};
