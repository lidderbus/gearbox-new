// src/utils/priceHistoryTracker.js
/**
 * 价格历史跟踪工具
 * 用于记录和管理价格变更历史
 */

// 历史记录存储键
const PRICE_HISTORY_KEY = 'gearbox_price_history';

/**
 * 保存价格变更历史记录
 * @param {Array} changedItems - 变更项目数组，每项包含model, oldPrice, newPrice等
 * @param {string} reason - 变更原因
 * @returns {boolean} 是否保存成功
 */
export function savePriceHistory(changedItems, reason = '手动调整') {
  if (!changedItems || !Array.isArray(changedItems) || changedItems.length === 0) {
    console.warn('无有效变更项目，取消保存历史记录');
    return false;
  }
  
  try {
    // 获取现有历史记录
    const existingHistory = getHistoryFromStorage();
    
    // 创建新的历史记录项
    const historyEntry = {
      timestamp: new Date().toISOString(),
      items: changedItems,
      reason: reason,
      user: getCurrentUser()
    };
    
    // 添加到历史记录数组
    const updatedHistory = [historyEntry, ...existingHistory];
    
    // 限制历史记录长度（保留最新的500条）
    const trimmedHistory = updatedHistory.slice(0, 500);
    
    // 保存到本地存储
    localStorage.setItem(PRICE_HISTORY_KEY, JSON.stringify(trimmedHistory));
    
    console.log(`已保存价格历史记录，共${changedItems.length}项变更`);
    return true;
  } catch (error) {
    console.error('保存价格历史记录失败:', error);
    return false;
  }
}

/**
 * 获取当前登录用户信息
 * @returns {string} 用户名或"未知用户"
 */
function getCurrentUser() {
  try {
    // 尝试从sessionStorage获取当前用户
    const currentUser = sessionStorage.getItem('current_user');
    if (currentUser) {
      const userObj = JSON.parse(currentUser);
      return userObj.username || '未知用户';
    }
    
    // 尝试从localStorage获取用户
    const user = localStorage.getItem('user');
    if (user) {
      const userObj = JSON.parse(user);
      return userObj.username || '未知用户';
    }
  } catch (e) {
    console.warn('获取当前用户信息失败:', e);
  }
  
  return '未知用户';
}

/**
 * 从localStorage获取历史记录
 * @returns {Array} 历史记录数组
 */
function getHistoryFromStorage() {
  try {
    const storedHistory = localStorage.getItem(PRICE_HISTORY_KEY);
    if (storedHistory) {
      return JSON.parse(storedHistory);
    }
  } catch (error) {
    console.error('读取价格历史记录失败:', error);
  }
  
  return [];
}

/**
 * 获取价格历史记录
 * @param {Object} options - 可选参数，如limit, startDate, endDate等
 * @returns {Array} 历史记录数组
 */
export function getPriceHistory(options = {}) {
  const { limit = 200, startDate = null, endDate = null } = options;
  
  try {
    let history = getHistoryFromStorage();
    
    // 根据日期筛选
    if (startDate || endDate) {
      const start = startDate ? new Date(startDate).getTime() : 0;
      const end = endDate ? new Date(endDate).getTime() : Date.now();
      
      history = history.filter(entry => {
        const entryTime = new Date(entry.timestamp).getTime();
        return entryTime >= start && entryTime <= end;
      });
    }
    
    // 限制返回数量
    return history.slice(0, limit);
  } catch (error) {
    console.error('获取价格历史记录失败:', error);
    return [];
  }
}

/**
 * 清除价格历史记录
 * @returns {boolean} 是否清除成功
 */
export function clearPriceHistory() {
  try {
    localStorage.removeItem(PRICE_HISTORY_KEY);
    console.log('价格历史记录已清除');
    return true;
  } catch (error) {
    console.error('清除价格历史记录失败:', error);
    return false;
  }
}

/**
 * 比较两个集合中的价格差异并记录变更
 * @param {Array} oldCollection - 旧集合
 * @param {Array} newCollection - 新集合
 * @returns {Array} 变更项目数组
 */
export function compareAndTrackChanges(oldCollection, newCollection) {
  if (!Array.isArray(oldCollection) || !Array.isArray(newCollection)) {
    return [];
  }
  
  const changes = [];
  
  // 创建旧集合的模型到项目的映射
  const oldMap = new Map();
  oldCollection.forEach(item => {
    if (item && item.model) {
      oldMap.set(item.model, item);
    }
  });
  
  // 检查新集合中的每一项
  newCollection.forEach(newItem => {
    if (!newItem || !newItem.model) return;
    
    const oldItem = oldMap.get(newItem.model);
    if (!oldItem) {
      // 新增项
      changes.push({
        model: newItem.model,
        type: 'add',
        oldBasePrice: null,
        newBasePrice: newItem.basePrice || newItem.price,
        oldFactoryPrice: null,
        newFactoryPrice: newItem.factoryPrice,
        oldMarketPrice: null,
        newMarketPrice: newItem.marketPrice
      });
    } else {
      // 检查价格变更
      const basepriceChanged = 
        newItem.basePrice !== oldItem.basePrice || 
        (newItem.price !== oldItem.price && (!newItem.basePrice || !oldItem.basePrice));
      
      const factorypriceChanged = newItem.factoryPrice !== oldItem.factoryPrice;
      const marketpriceChanged = newItem.marketPrice !== oldItem.marketPrice;
      const discountRateChanged = newItem.discountRate !== oldItem.discountRate;
      
      if (basepriceChanged || factorypriceChanged || marketpriceChanged || discountRateChanged) {
        changes.push({
          model: newItem.model,
          type: 'update',
          oldBasePrice: oldItem.basePrice || oldItem.price,
          newBasePrice: newItem.basePrice || newItem.price,
          oldFactoryPrice: oldItem.factoryPrice,
          newFactoryPrice: newItem.factoryPrice,
          oldMarketPrice: oldItem.marketPrice,
          newMarketPrice: newItem.marketPrice,
          oldDiscountRate: oldItem.discountRate,
          newDiscountRate: newItem.discountRate
        });
      }
    }
  });
  
  // 检查删除的项
  const newModelSet = new Set(newCollection.filter(i => i && i.model).map(i => i.model));
  oldCollection.forEach(oldItem => {
    if (!oldItem || !oldItem.model) return;
    
    if (!newModelSet.has(oldItem.model)) {
      // 删除项
      changes.push({
        model: oldItem.model,
        type: 'delete',
        oldBasePrice: oldItem.basePrice || oldItem.price,
        newBasePrice: null,
        oldFactoryPrice: oldItem.factoryPrice,
        newFactoryPrice: null,
        oldMarketPrice: oldItem.marketPrice,
        newMarketPrice: null
      });
    }
  });
  
  return changes;
}

/**
 * 获取特定型号的价格历史
 * @param {string} model - 产品型号
 * @returns {Array} 模型的价格历史记录
 */
export function getModelPriceHistory(model) {
  if (!model) return [];
  
  const history = getPriceHistory({ limit: 500 });
  const modelHistory = [];
  
  history.forEach(entry => {
    const matchingItems = entry.items.filter(item => item.model === model);
    if (matchingItems.length > 0) {
      modelHistory.push({
        timestamp: entry.timestamp,
        reason: entry.reason,
        user: entry.user,
        changes: matchingItems
      });
    }
  });
  
  return modelHistory;
}

/**
 * 生成价格历史报告
 * @param {Object} options - 报告选项
 * @returns {Object} 价格变更统计报告
 */
export function generatePriceHistoryReport(options = {}) {
  const { startDate = null, endDate = null, groupByModel = false } = options;
  
  const history = getPriceHistory({ startDate, endDate, limit: 1000 });
  
  // 创建报告基本结构
  const report = {
    totalChanges: 0,
    changesByType: {
      add: 0,
      update: 0,
      delete: 0
    },
    changesByCollection: {},
    changesByUser: {},
    dateRange: {
      start: startDate || (history.length ? history[history.length - 1].timestamp : null),
      end: endDate || (history.length ? history[0].timestamp : null)
    }
  };
  
  // 如果需要按型号分组，则初始化
  if (groupByModel) {
    report.changesByModel = {};
  }
  
  // 处理所有历史记录
  history.forEach(entry => {
    entry.items.forEach(item => {
      // 增加总计数
      report.totalChanges++;
      
      // 按类型计数
      const type = item.type || 'update';
      report.changesByType[type] = (report.changesByType[type] || 0) + 1;
      
      // 按集合计数
      const collection = item.collection || '未知';
      report.changesByCollection[collection] = (report.changesByCollection[collection] || 0) + 1;
      
      // 按用户计数
      const user = entry.user || '未知用户';
      report.changesByUser[user] = (report.changesByUser[user] || 0) + 1;
      
      // 按型号分组
      if (groupByModel && item.model) {
        if (!report.changesByModel[item.model]) {
          report.changesByModel[item.model] = {
            count: 0,
            lastChange: null,
            priceRange: {
              min: null,
              max: null,
              current: item.newBasePrice || item.newFactoryPrice
            }
          };
        }
        
        const modelStats = report.changesByModel[item.model];
        modelStats.count++;
        
        // 更新最后变更
        if (!modelStats.lastChange || new Date(entry.timestamp) > new Date(modelStats.lastChange)) {
          modelStats.lastChange = entry.timestamp;
        }
        
        // 更新价格范围
        const newPrice = item.newBasePrice || item.newFactoryPrice;
        const oldPrice = item.oldBasePrice || item.oldFactoryPrice;
        
        if (newPrice) {
          if (modelStats.priceRange.min === null || newPrice < modelStats.priceRange.min) {
            modelStats.priceRange.min = newPrice;
          }
          if (modelStats.priceRange.max === null || newPrice > modelStats.priceRange.max) {
            modelStats.priceRange.max = newPrice;
          }
          modelStats.priceRange.current = newPrice;
        }
        
        if (oldPrice) {
          if (modelStats.priceRange.min === null || oldPrice < modelStats.priceRange.min) {
            modelStats.priceRange.min = oldPrice;
          }
          if (modelStats.priceRange.max === null || oldPrice > modelStats.priceRange.max) {
            modelStats.priceRange.max = oldPrice;
          }
        }
      }
    });
  });
  
  return report;
}
