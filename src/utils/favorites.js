// DWG收藏管理工具函数
// localStorage key: dwg_favorites

const STORAGE_KEY = 'dwg_favorites';

/**
 * 获取所有收藏
 * @returns {Object} 收藏对象 { model: { model, addedAt, notes, tags, type } }
 */
export const getFavorites = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : {};
  } catch (e) {
    console.error('读取收藏失败:', e);
    return {};
  }
};

/**
 * 保存收藏到localStorage
 * @param {Object} favorites 收藏对象
 */
const saveFavorites = (favorites) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  } catch (e) {
    console.error('保存收藏失败:', e);
  }
};

/**
 * 检查型号是否已收藏
 * @param {string} model 型号
 * @returns {boolean}
 */
export const isFavorite = (model) => {
  const favorites = getFavorites();
  return !!favorites[model];
};

/**
 * 添加收藏
 * @param {string} model 型号
 * @param {string} type 类型 ('gearbox' | 'coupling')
 * @param {string} notes 备注
 * @param {string[]} tags 标签
 * @returns {Object} 新增的收藏项
 */
export const addFavorite = (model, type = 'gearbox', notes = '', tags = []) => {
  const favorites = getFavorites();
  const item = {
    model,
    type,
    addedAt: new Date().toISOString(),
    notes,
    tags
  };
  favorites[model] = item;
  saveFavorites(favorites);
  return item;
};

/**
 * 移除收藏
 * @param {string} model 型号
 * @returns {boolean} 是否成功移除
 */
export const removeFavorite = (model) => {
  const favorites = getFavorites();
  if (favorites[model]) {
    delete favorites[model];
    saveFavorites(favorites);
    return true;
  }
  return false;
};

/**
 * 切换收藏状态
 * @param {string} model 型号
 * @param {string} type 类型
 * @returns {boolean} 切换后的收藏状态
 */
export const toggleFavorite = (model, type = 'gearbox') => {
  if (isFavorite(model)) {
    removeFavorite(model);
    return false;
  } else {
    addFavorite(model, type);
    return true;
  }
};

/**
 * 更新收藏备注
 * @param {string} model 型号
 * @param {string} notes 备注
 * @returns {boolean} 是否成功更新
 */
export const updateFavoriteNotes = (model, notes) => {
  const favorites = getFavorites();
  if (favorites[model]) {
    favorites[model].notes = notes;
    favorites[model].updatedAt = new Date().toISOString();
    saveFavorites(favorites);
    return true;
  }
  return false;
};

/**
 * 更新收藏标签
 * @param {string} model 型号
 * @param {string[]} tags 标签数组
 * @returns {boolean} 是否成功更新
 */
export const updateFavoriteTags = (model, tags) => {
  const favorites = getFavorites();
  if (favorites[model]) {
    favorites[model].tags = tags;
    favorites[model].updatedAt = new Date().toISOString();
    saveFavorites(favorites);
    return true;
  }
  return false;
};

/**
 * 添加标签到收藏
 * @param {string} model 型号
 * @param {string} tag 标签
 * @returns {boolean} 是否成功添加
 */
export const addTagToFavorite = (model, tag) => {
  const favorites = getFavorites();
  if (favorites[model]) {
    const tags = favorites[model].tags || [];
    if (!tags.includes(tag)) {
      tags.push(tag);
      favorites[model].tags = tags;
      favorites[model].updatedAt = new Date().toISOString();
      saveFavorites(favorites);
    }
    return true;
  }
  return false;
};

/**
 * 从收藏移除标签
 * @param {string} model 型号
 * @param {string} tag 标签
 * @returns {boolean} 是否成功移除
 */
export const removeTagFromFavorite = (model, tag) => {
  const favorites = getFavorites();
  if (favorites[model]) {
    const tags = favorites[model].tags || [];
    const index = tags.indexOf(tag);
    if (index > -1) {
      tags.splice(index, 1);
      favorites[model].tags = tags;
      favorites[model].updatedAt = new Date().toISOString();
      saveFavorites(favorites);
    }
    return true;
  }
  return false;
};

/**
 * 获取收藏列表（数组形式）
 * @returns {Array} 收藏数组，按添加时间倒序
 */
export const getFavoritesList = () => {
  const favorites = getFavorites();
  return Object.values(favorites).sort((a, b) =>
    new Date(b.addedAt) - new Date(a.addedAt)
  );
};

/**
 * 获取所有使用过的标签
 * @returns {string[]} 标签数组
 */
export const getAllTags = () => {
  const favorites = getFavorites();
  const tagSet = new Set();
  Object.values(favorites).forEach(item => {
    (item.tags || []).forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
};

/**
 * 按标签筛选收藏
 * @param {string} tag 标签
 * @returns {Array} 收藏数组
 */
export const getFavoritesByTag = (tag) => {
  const favorites = getFavoritesList();
  return favorites.filter(item => (item.tags || []).includes(tag));
};

/**
 * 按类型筛选收藏
 * @param {string} type 类型 ('gearbox' | 'coupling')
 * @returns {Array} 收藏数组
 */
export const getFavoritesByType = (type) => {
  const favorites = getFavoritesList();
  return favorites.filter(item => item.type === type);
};

/**
 * 获取收藏数量
 * @returns {number}
 */
export const getFavoritesCount = () => {
  return Object.keys(getFavorites()).length;
};

/**
 * 清空所有收藏
 */
export const clearAllFavorites = () => {
  localStorage.removeItem(STORAGE_KEY);
};

/**
 * 导出收藏为JSON
 * @returns {string} JSON字符串
 */
export const exportFavorites = () => {
  const favorites = getFavorites();
  return JSON.stringify({
    exportedAt: new Date().toISOString(),
    count: Object.keys(favorites).length,
    favorites
  }, null, 2);
};

/**
 * 导入收藏
 * @param {string} jsonString JSON字符串
 * @param {boolean} merge 是否合并（否则覆盖）
 * @returns {Object} { success, imported, skipped, message }
 */
export const importFavorites = (jsonString, merge = true) => {
  try {
    const data = JSON.parse(jsonString);
    const importData = data.favorites || data;

    if (typeof importData !== 'object') {
      return { success: false, imported: 0, skipped: 0, message: '无效的数据格式' };
    }

    const currentFavorites = merge ? getFavorites() : {};
    let imported = 0;
    let skipped = 0;

    Object.entries(importData).forEach(([model, item]) => {
      if (merge && currentFavorites[model]) {
        skipped++;
      } else {
        currentFavorites[model] = {
          model: item.model || model,
          type: item.type || 'gearbox',
          addedAt: item.addedAt || new Date().toISOString(),
          notes: item.notes || '',
          tags: item.tags || []
        };
        imported++;
      }
    });

    saveFavorites(currentFavorites);
    return {
      success: true,
      imported,
      skipped,
      message: `成功导入 ${imported} 个收藏${skipped > 0 ? `，跳过 ${skipped} 个已存在` : ''}`
    };
  } catch (e) {
    return { success: false, imported: 0, skipped: 0, message: '解析失败: ' + e.message };
  }
};

export default {
  getFavorites,
  isFavorite,
  addFavorite,
  removeFavorite,
  toggleFavorite,
  updateFavoriteNotes,
  updateFavoriteTags,
  addTagToFavorite,
  removeTagFromFavorite,
  getFavoritesList,
  getAllTags,
  getFavoritesByTag,
  getFavoritesByType,
  getFavoritesCount,
  clearAllFavorites,
  exportFavorites,
  importFavorites
};
