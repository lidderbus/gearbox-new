// src/utils/gearboxIndex.js
/**
 * 齿轮箱数据索引模块
 * 用于加速选型查询的预过滤
 */

// 索引配置
const INDEX_CONFIG = {
  speed: {
    bucketSize: 100,    // 100rpm 分桶
    name: '转速索引'
  },
  ratio: {
    bucketSize: 0.5,    // 0.5 分桶
    name: '速比索引'
  },
  capacity: {
    bucketSize: 0.01,   // 0.01 kW/(r/min) 分桶
    name: '传递能力索引'
  }
};

// 全局索引存储
let gearboxIndex = null;
let indexStats = {
  totalGearboxes: 0,
  speedBuckets: 0,
  ratioBuckets: 0,
  capacityBuckets: 0,
  buildTime: 0,
  lastBuildAt: null
};

/**
 * 计算分桶键
 * @param {number} value - 值
 * @param {number} bucketSize - 桶大小
 * @returns {number} 桶键
 */
const getBucketKey = (value, bucketSize) => {
  return Math.floor(value / bucketSize) * bucketSize;
};

/**
 * 获取范围内的所有桶键
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @param {number} bucketSize - 桶大小
 * @returns {number[]} 桶键数组
 */
const getBucketKeysInRange = (min, max, bucketSize) => {
  const keys = [];
  const startKey = getBucketKey(min, bucketSize);
  const endKey = getBucketKey(max, bucketSize);

  for (let key = startKey; key <= endKey; key += bucketSize) {
    keys.push(key);
  }

  return keys;
};

/**
 * 构建齿轮箱索引
 * @param {Object[]} gearboxes - 齿轮箱数组
 * @returns {Object} 索引对象
 */
export const buildGearboxIndex = (gearboxes) => {
  const startTime = performance.now();

  if (!gearboxes || !Array.isArray(gearboxes) || gearboxes.length === 0) {
    console.warn('buildGearboxIndex: 无有效齿轮箱数据');
    return null;
  }

  // 初始化索引结构
  const index = {
    // 转速索引: bucketKey -> Set<gearboxIndex>
    speedIndex: new Map(),
    // 速比索引: bucketKey -> Set<gearboxIndex>
    ratioIndex: new Map(),
    // 传递能力索引: bucketKey -> Set<gearboxIndex>
    capacityIndex: new Map(),
    // 原始数据引用
    gearboxes: gearboxes,
    // 系列索引: series -> Set<gearboxIndex>
    seriesIndex: new Map()
  };

  // 遍历所有齿轮箱构建索引
  gearboxes.forEach((gearbox, gearboxIdx) => {
    // 转速索引 (覆盖 minSpeed 到 maxSpeed 范围)
    if (gearbox.minSpeed && gearbox.maxSpeed) {
      const speedKeys = getBucketKeysInRange(
        gearbox.minSpeed,
        gearbox.maxSpeed,
        INDEX_CONFIG.speed.bucketSize
      );
      speedKeys.forEach(key => {
        if (!index.speedIndex.has(key)) {
          index.speedIndex.set(key, new Set());
        }
        index.speedIndex.get(key).add(gearboxIdx);
      });
    }

    // 速比索引 (覆盖所有可用速比)
    const ratios = gearbox.ratios || [];
    ratios.forEach(ratio => {
      const ratioKey = getBucketKey(ratio, INDEX_CONFIG.ratio.bucketSize);
      if (!index.ratioIndex.has(ratioKey)) {
        index.ratioIndex.set(ratioKey, new Set());
      }
      index.ratioIndex.get(ratioKey).add(gearboxIdx);
    });

    // 传递能力索引 (使用最大传递能力)
    const capacityArray = gearbox.transmissionCapacityPerRatio || [];
    const maxCapacity = capacityArray.length > 0
      ? Math.max(...capacityArray.filter(c => typeof c === 'number'))
      : (gearbox.transmissionCapacity || 0);

    if (maxCapacity > 0) {
      // 为了支持容量范围查询，索引从0到maxCapacity
      const capacityKeys = getBucketKeysInRange(
        0,
        maxCapacity,
        INDEX_CONFIG.capacity.bucketSize
      );
      capacityKeys.forEach(key => {
        if (!index.capacityIndex.has(key)) {
          index.capacityIndex.set(key, new Set());
        }
        index.capacityIndex.get(key).add(gearboxIdx);
      });
    }

    // 系列索引
    const series = gearbox.series || 'OTHER';
    if (!index.seriesIndex.has(series)) {
      index.seriesIndex.set(series, new Set());
    }
    index.seriesIndex.get(series).add(gearboxIdx);
  });

  // 更新统计信息
  const endTime = performance.now();
  indexStats = {
    totalGearboxes: gearboxes.length,
    speedBuckets: index.speedIndex.size,
    ratioBuckets: index.ratioIndex.size,
    capacityBuckets: index.capacityIndex.size,
    seriesBuckets: index.seriesIndex.size,
    buildTime: Math.round(endTime - startTime),
    lastBuildAt: new Date().toISOString()
  };

  // 保存到全局
  gearboxIndex = index;

  console.log(`[GearboxIndex] 索引构建完成:`, indexStats);

  return index;
};

/**
 * 预过滤齿轮箱
 * @param {Object} params - 过滤参数
 * @param {number} params.speed - 目标转速 (rpm)
 * @param {number} params.targetRatio - 目标速比
 * @param {number} params.requiredCapacity - 所需传递能力 (kW/(r/min))
 * @param {string} params.series - 齿轮箱系列 (可选)
 * @param {Object} params.tolerances - 容差设置 (可选)
 * @returns {Object[]} 过滤后的齿轮箱数组
 */
export const preFilter = (params) => {
  if (!gearboxIndex) {
    console.warn('[GearboxIndex] 索引未初始化，返回空结果');
    return [];
  }

  const {
    speed,
    targetRatio,
    requiredCapacity,
    series,
    tolerances = {}
  } = params;

  const {
    maxRatioDiffPercent = 25
  } = tolerances;

  let candidateIndices = null;

  // 1. 转速过滤
  if (speed) {
    const speedKey = getBucketKey(speed, INDEX_CONFIG.speed.bucketSize);
    const speedCandidates = gearboxIndex.speedIndex.get(speedKey);

    if (speedCandidates) {
      candidateIndices = new Set(speedCandidates);
    } else {
      // 转速不在任何桶内，返回空
      return [];
    }
  }

  // 2. 速比过滤 (考虑容差)
  if (targetRatio) {
    const ratioMin = targetRatio * (1 - maxRatioDiffPercent / 100);
    const ratioMax = targetRatio * (1 + maxRatioDiffPercent / 100);
    const ratioKeys = getBucketKeysInRange(ratioMin, ratioMax, INDEX_CONFIG.ratio.bucketSize);

    const ratioCandidates = new Set();
    ratioKeys.forEach(key => {
      const bucket = gearboxIndex.ratioIndex.get(key);
      if (bucket) {
        bucket.forEach(idx => ratioCandidates.add(idx));
      }
    });

    if (candidateIndices === null) {
      candidateIndices = ratioCandidates;
    } else {
      // 取交集
      candidateIndices = new Set(
        [...candidateIndices].filter(idx => ratioCandidates.has(idx))
      );
    }
  }

  // 3. 传递能力过滤
  if (requiredCapacity) {
    const capacityKey = getBucketKey(requiredCapacity, INDEX_CONFIG.capacity.bucketSize);

    // 获取所有能满足需求的桶 (capacity >= requiredCapacity)
    const capacityCandidates = new Set();
    gearboxIndex.capacityIndex.forEach((bucket, key) => {
      if (key >= capacityKey) {
        bucket.forEach(idx => capacityCandidates.add(idx));
      }
    });

    if (candidateIndices === null) {
      candidateIndices = capacityCandidates;
    } else {
      candidateIndices = new Set(
        [...candidateIndices].filter(idx => capacityCandidates.has(idx))
      );
    }
  }

  // 4. 系列过滤
  if (series) {
    const seriesCandidates = gearboxIndex.seriesIndex.get(series);

    if (seriesCandidates) {
      if (candidateIndices === null) {
        candidateIndices = seriesCandidates;
      } else {
        candidateIndices = new Set(
          [...candidateIndices].filter(idx => seriesCandidates.has(idx))
        );
      }
    } else {
      // 系列不存在，返回空
      return [];
    }
  }

  // 返回候选齿轮箱
  if (candidateIndices === null) {
    return gearboxIndex.gearboxes;
  }

  return [...candidateIndices].map(idx => gearboxIndex.gearboxes[idx]);
};

/**
 * 获取索引统计信息
 * @returns {Object} 统计信息
 */
export const getIndexStats = () => {
  return { ...indexStats };
};

/**
 * 检查索引是否已初始化
 * @returns {boolean}
 */
export const isIndexReady = () => {
  return gearboxIndex !== null;
};

/**
 * 清除索引
 */
export const clearIndex = () => {
  gearboxIndex = null;
  indexStats = {
    totalGearboxes: 0,
    speedBuckets: 0,
    ratioBuckets: 0,
    capacityBuckets: 0,
    buildTime: 0,
    lastBuildAt: null
  };
};

/**
 * 获取系列列表
 * @returns {string[]} 系列数组
 */
export const getSeriesList = () => {
  if (!gearboxIndex) return [];
  return [...gearboxIndex.seriesIndex.keys()].sort();
};

/**
 * 按系列获取齿轮箱数量
 * @returns {Object} 系列 -> 数量映射
 */
export const getGearboxCountBySeries = () => {
  if (!gearboxIndex) return {};

  const counts = {};
  gearboxIndex.seriesIndex.forEach((set, series) => {
    counts[series] = set.size;
  });

  return counts;
};

export default {
  buildGearboxIndex,
  preFilter,
  getIndexStats,
  isIndexReady,
  clearIndex,
  getSeriesList,
  getGearboxCountBySeries
};
