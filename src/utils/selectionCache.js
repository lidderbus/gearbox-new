// src/utils/selectionCache.js
/**
 * 选型结果缓存模块
 * LRU缓存实现，加速重复查询
 */

// 缓存配置
const CACHE_CONFIG = {
  maxSize: 100,           // 最大缓存条目数
  ttl: 5 * 60 * 1000,     // 缓存有效期 (5分钟)
  enabled: true           // 是否启用缓存
};

// 缓存存储
let cache = new Map();
let cacheStats = {
  hits: 0,
  misses: 0,
  evictions: 0,
  totalQueries: 0
};

/**
 * 生成缓存键
 * @param {Object} params - 选型参数
 * @returns {string} 缓存键
 */
const generateCacheKey = (params) => {
  const {
    power,
    speed,
    targetRatio,
    thrustRequirement,
    gearboxType,
    scoringWeights,
    tolerances
  } = params;

  // 构建标准化的键
  const keyParts = [
    `p:${power || 0}`,
    `s:${speed || 0}`,
    `r:${targetRatio || 0}`,
    `t:${thrustRequirement || 0}`,
    `g:${gearboxType || 'ALL'}`
  ];

  // 添加权重哈希
  if (scoringWeights) {
    const weightsHash = Object.keys(scoringWeights)
      .sort()
      .map(k => `${k[0]}${scoringWeights[k]}`)
      .join('');
    keyParts.push(`w:${weightsHash}`);
  }

  // 添加容差哈希
  if (tolerances) {
    const tolerancesHash = Object.keys(tolerances)
      .sort()
      .map(k => `${k[0]}${tolerances[k]}`)
      .join('');
    keyParts.push(`tol:${tolerancesHash}`);
  }

  return keyParts.join('|');
};

/**
 * LRU缓存条目
 */
class CacheEntry {
  constructor(value) {
    this.value = value;
    this.timestamp = Date.now();
    this.accessCount = 1;
    this.lastAccess = Date.now();
  }

  isExpired() {
    return Date.now() - this.timestamp > CACHE_CONFIG.ttl;
  }

  touch() {
    this.accessCount++;
    this.lastAccess = Date.now();
  }
}

/**
 * 清理过期条目
 */
const cleanupExpired = () => {
  const now = Date.now();
  const expiredKeys = [];

  cache.forEach((entry, key) => {
    if (entry.isExpired()) {
      expiredKeys.push(key);
    }
  });

  expiredKeys.forEach(key => {
    cache.delete(key);
    cacheStats.evictions++;
  });

  return expiredKeys.length;
};

/**
 * LRU淘汰
 * 移除最久未访问的条目
 */
const evictLRU = () => {
  if (cache.size <= CACHE_CONFIG.maxSize) return;

  // 找到最久未访问的条目
  let oldestKey = null;
  let oldestTime = Infinity;

  cache.forEach((entry, key) => {
    if (entry.lastAccess < oldestTime) {
      oldestTime = entry.lastAccess;
      oldestKey = key;
    }
  });

  if (oldestKey) {
    cache.delete(oldestKey);
    cacheStats.evictions++;
  }
};

/**
 * 获取缓存
 * @param {Object} params - 选型参数
 * @returns {Object|null} 缓存的结果或null
 */
export const getFromCache = (params) => {
  if (!CACHE_CONFIG.enabled) return null;

  cacheStats.totalQueries++;

  const key = generateCacheKey(params);
  const entry = cache.get(key);

  if (!entry) {
    cacheStats.misses++;
    return null;
  }

  if (entry.isExpired()) {
    cache.delete(key);
    cacheStats.misses++;
    cacheStats.evictions++;
    return null;
  }

  // 更新访问信息 (LRU)
  entry.touch();

  // 移动到末尾 (Map保持插入顺序)
  cache.delete(key);
  cache.set(key, entry);

  cacheStats.hits++;

  return entry.value;
};

/**
 * 存入缓存
 * @param {Object} params - 选型参数
 * @param {Object} result - 选型结果
 */
export const setToCache = (params, result) => {
  if (!CACHE_CONFIG.enabled) return;

  const key = generateCacheKey(params);

  // 创建缓存条目
  const entry = new CacheEntry(result);

  // 检查是否需要淘汰
  if (cache.size >= CACHE_CONFIG.maxSize) {
    evictLRU();
  }

  cache.set(key, entry);
};

/**
 * 清除缓存
 * @param {Object} params - 可选，指定要清除的参数
 */
export const clearCache = (params = null) => {
  if (params) {
    const key = generateCacheKey(params);
    cache.delete(key);
  } else {
    cache.clear();
  }
};

/**
 * 获取缓存统计信息
 * @returns {Object} 统计信息
 */
export const getCacheStats = () => {
  const hitRate = cacheStats.totalQueries > 0
    ? ((cacheStats.hits / cacheStats.totalQueries) * 100).toFixed(1)
    : 0;

  return {
    ...cacheStats,
    size: cache.size,
    maxSize: CACHE_CONFIG.maxSize,
    hitRate: `${hitRate}%`,
    enabled: CACHE_CONFIG.enabled
  };
};

/**
 * 设置缓存配置
 * @param {Object} config - 配置对象
 */
export const setCacheConfig = (config) => {
  Object.assign(CACHE_CONFIG, config);
};

/**
 * 启用/禁用缓存
 * @param {boolean} enabled
 */
export const setCacheEnabled = (enabled) => {
  CACHE_CONFIG.enabled = enabled;
  if (!enabled) {
    clearCache();
  }
};

/**
 * 获取缓存内容摘要 (用于调试)
 * @returns {Object[]} 缓存条目摘要
 */
export const getCacheSummary = () => {
  const summary = [];

  cache.forEach((entry, key) => {
    summary.push({
      key: key.substring(0, 50) + (key.length > 50 ? '...' : ''),
      age: Math.round((Date.now() - entry.timestamp) / 1000) + 's',
      accessCount: entry.accessCount,
      expired: entry.isExpired()
    });
  });

  return summary;
};

/**
 * 预热缓存 (用于常用查询)
 * @param {Function} selectFn - 选型函数
 * @param {Object[]} commonParams - 常用参数列表
 */
export const warmupCache = async (selectFn, commonParams) => {
  if (!CACHE_CONFIG.enabled || !commonParams || !commonParams.length) return;

  console.log(`[Cache] 开始预热缓存，共 ${commonParams.length} 条...`);

  for (const params of commonParams) {
    try {
      const result = await selectFn(params);
      setToCache(params, result);
    } catch (error) {
      console.warn('[Cache] 预热失败:', params, error);
    }
  }

  console.log(`[Cache] 缓存预热完成，当前大小: ${cache.size}`);
};

/**
 * 定期清理过期条目
 * @param {number} interval - 清理间隔 (ms)
 * @returns {Function} 停止清理的函数
 */
export const startCleanupInterval = (interval = 60000) => {
  const timerId = setInterval(() => {
    const cleaned = cleanupExpired();
    if (cleaned > 0) {
      console.log(`[Cache] 清理了 ${cleaned} 条过期缓存`);
    }
  }, interval);

  return () => clearInterval(timerId);
};

/**
 * 带缓存的选型函数包装器
 * @param {Function} selectFn - 原始选型函数
 * @returns {Function} 带缓存的选型函数
 */
export const withCache = (selectFn) => {
  return (params, options = {}) => {
    // 检查缓存
    const cached = getFromCache({ ...params, ...options });
    if (cached) {
      return {
        ...cached,
        _fromCache: true
      };
    }

    // 执行选型
    const result = selectFn(params, options);

    // 存入缓存 (只缓存成功的结果)
    if (result && result.results && result.results.length > 0) {
      setToCache({ ...params, ...options }, result);
    }

    return result;
  };
};

export default {
  getFromCache,
  setToCache,
  clearCache,
  getCacheStats,
  setCacheConfig,
  setCacheEnabled,
  getCacheSummary,
  warmupCache,
  startCleanupInterval,
  withCache
};
