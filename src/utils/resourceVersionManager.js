// src/utils/resourceVersionManager.js
// 资料版本管理工具
// 功能: 跟踪说明书、模板、图纸等资料的版本信息和更新状态
// 创建时间: 2026-03-21

const STORAGE_KEY = 'resource_version_registry';
const VIEWED_KEY = 'resource_viewed_versions';

// 默认版本注册表 - 基于实际资料库
const defaultRegistry = {
  manuals: {
    '120B': { version: '1.0', updateDate: '2024-06-15', notes: '初始版本' },
    '120C': { version: '1.0', updateDate: '2024-06-15', notes: '初始版本' },
    '135': { version: '1.0', updateDate: '2024-06-15', notes: '初始版本' },
    '300': { version: '1.1', updateDate: '2025-03-20', notes: '更新安装尺寸图' },
    'HC300': { version: '1.1', updateDate: '2025-03-20', notes: '同300型' },
    '40A': { version: '1.0', updateDate: '2024-06-15', notes: '初始版本' },
    'HC400A': { version: '1.2', updateDate: '2025-08-10', notes: '修正技术参数表' },
    'HCD400A': { version: '1.2', updateDate: '2025-08-10', notes: '同HC400A' },
    'HC600A': { version: '1.1', updateDate: '2025-06-20', notes: '补充润滑系统说明' },
    'HC1000': { version: '2.0', updateDate: '2026-01-15', notes: '全面改版' },
    'HC1200': { version: '1.0', updateDate: '2024-09-10', notes: '初始版本' },
    'HC1600': { version: '1.1', updateDate: '2025-11-05', notes: '更新外形尺寸' },
    'GWC': { version: '3.0', updateDate: '2026-02-20', notes: '2026版价格更新' },
    'GWS': { version: '2.0', updateDate: '2025-12-01', notes: '新增安装指南' },
  },
  templates: {
    'gwc3941-1': { version: '1.0', updateDate: '2013-05-16', notes: '原始模板' },
    'gwc3941-2': { version: '1.1', updateDate: '2013-08-20', notes: '大连校对版' },
    'gwc4549-1': { version: '1.0', updateDate: '2013-06-10', notes: '原始模板' },
    'gwc4954-1': { version: '1.0', updateDate: '2013-07-15', notes: '原始模板' },
    'gwc5259-1': { version: '1.0', updateDate: '2013-09-20', notes: '原始模板' },
  },
  drawings: {
    // 外形图版本会在使用时动态注册
  },
};

/**
 * 获取版本注册表
 */
export function getVersionRegistry() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('读取版本注册表失败:', e);
  }
  // 首次使用，初始化默认注册表
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultRegistry));
  return defaultRegistry;
}

/**
 * 更新资料版本信息
 */
export function updateResourceVersion(category, resourceId, versionInfo) {
  const registry = getVersionRegistry();
  if (!registry[category]) {
    registry[category] = {};
  }
  registry[category][resourceId] = {
    ...registry[category][resourceId],
    ...versionInfo,
    lastModified: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
  return registry;
}

/**
 * 获取某资料的版本信息
 */
export function getResourceVersion(category, resourceId) {
  const registry = getVersionRegistry();
  return registry[category]?.[resourceId] || null;
}

/**
 * 获取用户已查看的版本记录
 */
function getViewedVersions() {
  try {
    const stored = localStorage.getItem(VIEWED_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

/**
 * 标记资料为已查看
 */
export function markAsViewed(category, resourceId) {
  const viewed = getViewedVersions();
  const key = `${category}:${resourceId}`;
  const registry = getVersionRegistry();
  const current = registry[category]?.[resourceId];
  if (current) {
    viewed[key] = {
      version: current.version,
      viewedAt: new Date().toISOString(),
    };
    localStorage.setItem(VIEWED_KEY, JSON.stringify(viewed));
  }
}

/**
 * 检查资料是否有更新（用户未查看的新版本）
 */
export function hasUnviewedUpdate(category, resourceId) {
  const viewed = getViewedVersions();
  const key = `${category}:${resourceId}`;
  const registry = getVersionRegistry();
  const current = registry[category]?.[resourceId];
  if (!current) return false;
  const viewRecord = viewed[key];
  if (!viewRecord) return true; // 从未查看
  return viewRecord.version !== current.version;
}

/**
 * 获取所有有更新的资料列表
 */
export function getUpdatedResources() {
  const registry = getVersionRegistry();
  const updates = [];
  for (const [category, resources] of Object.entries(registry)) {
    for (const [id, info] of Object.entries(resources)) {
      if (hasUnviewedUpdate(category, id)) {
        updates.push({ category, id, ...info });
      }
    }
  }
  return updates.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate));
}

/**
 * 获取最近更新的资料（不管是否已查看）
 */
export function getRecentUpdates(days = 90) {
  const registry = getVersionRegistry();
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  const updates = [];
  for (const [category, resources] of Object.entries(registry)) {
    for (const [id, info] of Object.entries(resources)) {
      if (new Date(info.updateDate) >= cutoff) {
        updates.push({
          category,
          id,
          ...info,
          isNew: hasUnviewedUpdate(category, id),
        });
      }
    }
  }
  return updates.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate));
}

/**
 * 批量更新版本（管理员用）
 */
export function batchUpdateVersions(category, updates) {
  const registry = getVersionRegistry();
  if (!registry[category]) {
    registry[category] = {};
  }
  for (const [id, info] of Object.entries(updates)) {
    registry[category][id] = {
      ...registry[category][id],
      ...info,
      lastModified: new Date().toISOString(),
    };
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registry));
  return registry;
}

/**
 * 获取版本统计
 */
export function getVersionStats() {
  const registry = getVersionRegistry();
  const stats = { total: 0, updated: 0, categories: {} };
  for (const [category, resources] of Object.entries(registry)) {
    const count = Object.keys(resources).length;
    const updatedCount = Object.keys(resources).filter(id => hasUnviewedUpdate(category, id)).length;
    stats.categories[category] = { total: count, updated: updatedCount };
    stats.total += count;
    stats.updated += updatedCount;
  }
  return stats;
}
