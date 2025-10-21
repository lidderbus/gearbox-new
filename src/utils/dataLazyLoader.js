/**
 * 数据懒加载工具
 * 按需加载大型数据文件，减少初始bundle大小
 */

import { createLogger } from '../utils/logger';

const log = createLogger('DataLazyLoader');

/**
 * 数据加载状态缓存
 */
const dataCache = new Map();
const loadingPromises = new Map();

/**
 * 懒加载齿轮箱数据
 * @returns {Promise<Object>} 齿轮箱数据
 */
export async function loadGearboxData() {
  const cacheKey = 'gearboxData';

  // 如果已缓存，直接返回
  if (dataCache.has(cacheKey)) {
    log.debug('使用缓存的齿轮箱数据');
    return dataCache.get(cacheKey);
  }

  // 如果正在加载，返回同一个Promise
  if (loadingPromises.has(cacheKey)) {
    log.debug('齿轮箱数据加载中，等待...');
    return loadingPromises.get(cacheKey);
  }

  log.info('开始懒加载齿轮箱数据...');
  const loadPromise = import('../data/embeddedData')
    .then(module => {
      const data = module.default || module;
      dataCache.set(cacheKey, data);
      loadingPromises.delete(cacheKey);
      log.info('齿轮箱数据加载完成');
      return data;
    })
    .catch(error => {
      loadingPromises.delete(cacheKey);
      log.error('齿轮箱数据加载失败:', error);
      throw error;
    });

  loadingPromises.set(cacheKey, loadPromise);
  return loadPromise;
}

/**
 * 懒加载柔性联轴器数据
 * @returns {Promise<Array>} 柔性联轴器数据
 */
export async function loadCouplingData() {
  const cacheKey = 'couplingData';

  if (dataCache.has(cacheKey)) {
    log.debug('使用缓存的联轴器数据');
    return dataCache.get(cacheKey);
  }

  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }

  log.info('开始懒加载联轴器数据...');
  const loadPromise = import('../data/flexibleCouplings')
    .then(module => {
      const data = module.flexibleCouplings || module.default;
      dataCache.set(cacheKey, data);
      loadingPromises.delete(cacheKey);
      log.info('联轴器数据加载完成');
      return data;
    })
    .catch(error => {
      loadingPromises.delete(cacheKey);
      log.error('联轴器数据加载失败:', error);
      throw error;
    });

  loadingPromises.set(cacheKey, loadPromise);
  return loadPromise;
}

/**
 * 懒加载价格数据
 * @returns {Promise<Object>} 价格数据
 */
export async function loadPricingData() {
  const cacheKey = 'pricingData';

  if (dataCache.has(cacheKey)) {
    log.debug('使用缓存的价格数据');
    return dataCache.get(cacheKey);
  }

  if (loadingPromises.has(cacheKey)) {
    return loadingPromises.get(cacheKey);
  }

  log.info('开始懒加载价格数据...');
  const loadPromise = import('../data/gearboxPricing')
    .then(module => {
      const data = module.default || module;
      dataCache.set(cacheKey, data);
      loadingPromises.delete(cacheKey);
      log.info('价格数据加载完成');
      return data;
    })
    .catch(error => {
      loadingPromises.delete(cacheKey);
      log.error('价格数据加载失败:', error);
      throw error;
    });

  loadingPromises.set(cacheKey, loadPromise);
  return loadPromise;
}

/**
 * 预加载所有关键数据
 * 在应用空闲时调用，提前加载可能需要的数据
 */
export async function preloadCriticalData() {
  log.info('开始预加载关键数据...');

  try {
    // 并行加载多个数据源
    await Promise.all([
      loadGearboxData(),
      loadCouplingData(),
      loadPricingData(),
    ]);
    log.info('关键数据预加载完成');
  } catch (error) {
    log.error('关键数据预加载失败:', error);
  }
}

/**
 * 清除数据缓存
 * 用于强制重新加载数据
 */
export function clearDataCache() {
  log.info('清除数据缓存');
  dataCache.clear();
  loadingPromises.clear();
}

/**
 * 获取缓存统计信息
 */
export function getCacheStats() {
  return {
    cachedItems: dataCache.size,
    loadingItems: loadingPromises.size,
    cacheKeys: Array.from(dataCache.keys()),
  };
}

/**
 * 使用 requestIdleCallback 在浏览器空闲时预加载数据
 */
export function scheduleDataPreload() {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(
      () => {
        preloadCriticalData();
      },
      { timeout: 2000 } // 最多2秒后必须执行
    );
  } else {
    // 降级方案：使用setTimeout
    setTimeout(preloadCriticalData, 1000);
  }
}

export default {
  loadGearboxData,
  loadCouplingData,
  loadPricingData,
  preloadCriticalData,
  clearDataCache,
  getCacheStats,
  scheduleDataPreload,
};
