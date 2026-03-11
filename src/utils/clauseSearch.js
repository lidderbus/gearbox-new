// src/utils/clauseSearch.js
// 条款知识库搜索引擎封装
// 基于Fuse.js实现模糊搜索

import Fuse from 'fuse.js';

// Fuse.js 搜索配置
const fuseOptions = {
  keys: [
    { name: 'title', weight: 0.4 },
    { name: 'content', weight: 0.3 },
    { name: 'keywords', weight: 0.2 },
    { name: 'applicableSeries', weight: 0.1 }
  ],
  threshold: 0.4,           // 模糊匹配阈值 (0=精确, 1=匹配所有)
  includeScore: true,       // 包含匹配分数
  includeMatches: true,     // 包含匹配位置信息
  minMatchCharLength: 1,    // 最小匹配字符数（支持单汉字搜索）
  ignoreLocation: true,     // 忽略位置权重
  findAllMatches: true      // 查找所有匹配
};

// 搜索引擎实例缓存
let fuseInstance = null;
let clausesCache = [];

/**
 * 创建条款搜索引擎
 * @param {Array} clauses - 条款数据数组
 * @returns {Fuse} Fuse.js 实例
 */
export function createClauseSearchEngine(clauses) {
  clausesCache = clauses;
  fuseInstance = new Fuse(clauses, fuseOptions);
  return fuseInstance;
}

/**
 * 搜索条款
 * @param {string} query - 搜索关键词
 * @param {Object} options - 搜索选项
 * @param {string} options.category - 分类过滤
 * @param {string} options.series - 系列过滤
 * @param {number} options.limit - 结果数量限制
 * @returns {Array} 搜索结果
 */
export function searchClauses(query, options = {}) {
  const { category, series, limit = 50 } = options;

  if (!fuseInstance) {
    console.warn('搜索引擎未初始化，请先调用 createClauseSearchEngine');
    return [];
  }

  // 空查询时返回全部
  if (!query || query.trim() === '') {
    let results = clausesCache;

    // 应用分类过滤
    if (category && category !== 'all') {
      results = results.filter(c => c.category === category);
    }

    // 应用系列过滤
    if (series) {
      results = results.filter(c =>
        c.applicableSeries && c.applicableSeries.includes(series)
      );
    }

    return results.slice(0, limit).map(item => ({
      item,
      score: 0,
      matches: []
    }));
  }

  // 执行模糊搜索
  let results = fuseInstance.search(query, { limit: limit * 2 });

  // 应用分类过滤
  if (category && category !== 'all') {
    results = results.filter(r => r.item.category === category);
  }

  // 应用系列过滤
  if (series) {
    results = results.filter(r =>
      r.item.applicableSeries && r.item.applicableSeries.includes(series)
    );
  }

  return results.slice(0, limit);
}

/**
 * 按分类获取条款
 * @param {string} category - 分类ID
 * @returns {Array} 该分类下的所有条款
 */
export function getClausesByCategory(category) {
  if (!clausesCache.length) {
    console.warn('条款数据未加载');
    return [];
  }

  if (!category || category === 'all') {
    return clausesCache;
  }

  return clausesCache.filter(c => c.category === category);
}

/**
 * 按ID获取单个条款
 * @param {string} id - 条款ID
 * @returns {Object|null} 条款对象
 */
export function getClauseById(id) {
  if (!clausesCache.length) {
    console.warn('条款数据未加载');
    return null;
  }

  return clausesCache.find(c => c.id === id) || null;
}

/**
 * 按系列获取条款
 * @param {string} series - 系列代码 (如 HC, HCD, GWC)
 * @returns {Array} 适用该系列的条款
 */
export function getClausesBySeries(series) {
  if (!clausesCache.length) {
    console.warn('条款数据未加载');
    return [];
  }

  return clausesCache.filter(c =>
    c.applicableSeries && c.applicableSeries.includes(series)
  );
}

/**
 * 获取条款统计信息
 * @returns {Object} 统计信息
 */
export function getClauseStats() {
  const stats = {
    total: clausesCache.length,
    byCategory: {},
    bySeries: {}
  };

  clausesCache.forEach(clause => {
    // 按分类统计
    if (!stats.byCategory[clause.category]) {
      stats.byCategory[clause.category] = 0;
    }
    stats.byCategory[clause.category]++;

    // 按系列统计
    if (clause.applicableSeries) {
      clause.applicableSeries.forEach(series => {
        if (!stats.bySeries[series]) {
          stats.bySeries[series] = 0;
        }
        stats.bySeries[series]++;
      });
    }
  });

  return stats;
}

/**
 * 高亮搜索结果中的匹配文本
 * @param {string} text - 原文本
 * @param {Array} matches - Fuse.js 匹配信息
 * @param {string} key - 要高亮的字段名
 * @returns {string} 带高亮标记的HTML
 */
export function highlightMatches(text, matches, key) {
  if (!matches || !text) return text;

  const keyMatches = matches.filter(m => m.key === key);
  if (keyMatches.length === 0) return text;

  // 收集所有匹配的索引区间
  const indices = [];
  keyMatches.forEach(m => {
    m.indices.forEach(([start, end]) => {
      indices.push({ start, end: end + 1 });
    });
  });

  // 按起始位置排序并合并重叠区间
  indices.sort((a, b) => a.start - b.start);
  const merged = [];
  indices.forEach(idx => {
    if (merged.length === 0 || merged[merged.length - 1].end < idx.start) {
      merged.push(idx);
    } else {
      merged[merged.length - 1].end = Math.max(merged[merged.length - 1].end, idx.end);
    }
  });

  // 构建高亮文本
  let result = '';
  let lastEnd = 0;
  merged.forEach(({ start, end }) => {
    result += text.slice(lastEnd, start);
    result += `<mark>${text.slice(start, end)}</mark>`;
    lastEnd = end;
  });
  result += text.slice(lastEnd);

  return result;
}

export default {
  createClauseSearchEngine,
  searchClauses,
  getClausesByCategory,
  getClauseById,
  getClausesBySeries,
  getClauseStats,
  highlightMatches
};
