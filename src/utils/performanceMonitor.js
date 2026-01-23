/**
 * 性能监控工具
 *
 * 提供关键操作耗时追踪和慢操作告警功能
 */

// 慢操作阈值 (毫秒)
const SLOW_OPERATION_THRESHOLD = 100;

// 是否为开发环境
const isDev = process.env.NODE_ENV === 'development';

// 操作记录存储
const operationRecords = [];
const MAX_RECORDS = 100;

/**
 * 记录操作开始时间
 * @param {string} operationName - 操作名称
 * @returns {object} 性能标记对象，用于 endOperation
 */
export const startOperation = (operationName) => {
  return {
    name: operationName,
    startTime: performance.now(),
    startTimestamp: Date.now(),
  };
};

/**
 * 记录操作结束并计算耗时
 * @param {object} mark - startOperation 返回的标记对象
 * @param {object} metadata - 附加元数据
 * @returns {object} 操作记录
 */
export const endOperation = (mark, metadata = {}) => {
  const endTime = performance.now();
  const duration = endTime - mark.startTime;

  const record = {
    name: mark.name,
    duration: Math.round(duration * 100) / 100,
    startTimestamp: mark.startTimestamp,
    endTimestamp: Date.now(),
    isSlow: duration > SLOW_OPERATION_THRESHOLD,
    metadata,
  };

  // 存储记录
  operationRecords.push(record);
  if (operationRecords.length > MAX_RECORDS) {
    operationRecords.shift();
  }

  // 慢操作告警
  if (record.isSlow) {
    handleSlowOperation(record);
  }

  // 开发环境输出
  if (isDev) {
    const emoji = record.isSlow ? '🐢' : '✓';
    console.log(`[Perf] ${emoji} ${record.name}: ${record.duration}ms`);
  }

  return record;
};

/**
 * 包装异步函数进行性能追踪
 * @param {string} operationName - 操作名称
 * @param {Function} asyncFn - 异步函数
 * @param {object} metadata - 附加元数据
 * @returns {Promise} 原函数返回值
 */
export const trackAsync = async (operationName, asyncFn, metadata = {}) => {
  const mark = startOperation(operationName);
  try {
    const result = await asyncFn();
    endOperation(mark, { ...metadata, success: true });
    return result;
  } catch (error) {
    endOperation(mark, { ...metadata, success: false, error: error.message });
    throw error;
  }
};

/**
 * 处理慢操作告警
 * @param {object} record - 操作记录
 */
const handleSlowOperation = (record) => {
  // 发送到 Sentry (如果可用)
  if (process.env.REACT_APP_SENTRY_DSN) {
    import('@sentry/react').then((Sentry) => {
      Sentry.addBreadcrumb({
        category: 'performance',
        message: `Slow operation: ${record.name}`,
        level: 'warning',
        data: {
          duration: record.duration,
          threshold: SLOW_OPERATION_THRESHOLD,
          ...record.metadata,
        },
      });
    }).catch(() => {});
  }

  // 发送到 Google Analytics (如果可用)
  if (window.gtag) {
    window.gtag('event', 'slow_operation', {
      event_category: 'Performance',
      event_label: record.name,
      value: Math.round(record.duration),
    });
  }
};

/**
 * 获取操作记录统计
 * @returns {object} 统计信息
 */
export const getPerformanceStats = () => {
  if (operationRecords.length === 0) {
    return { count: 0, slowCount: 0, avgDuration: 0, operations: {} };
  }

  const operationStats = {};
  let totalDuration = 0;
  let slowCount = 0;

  operationRecords.forEach((record) => {
    totalDuration += record.duration;
    if (record.isSlow) slowCount++;

    if (!operationStats[record.name]) {
      operationStats[record.name] = {
        count: 0,
        totalDuration: 0,
        maxDuration: 0,
        minDuration: Infinity,
        slowCount: 0,
      };
    }

    const stats = operationStats[record.name];
    stats.count++;
    stats.totalDuration += record.duration;
    stats.maxDuration = Math.max(stats.maxDuration, record.duration);
    stats.minDuration = Math.min(stats.minDuration, record.duration);
    if (record.isSlow) stats.slowCount++;
  });

  // 计算平均值
  Object.keys(operationStats).forEach((name) => {
    const stats = operationStats[name];
    stats.avgDuration = Math.round((stats.totalDuration / stats.count) * 100) / 100;
  });

  return {
    count: operationRecords.length,
    slowCount,
    slowRate: Math.round((slowCount / operationRecords.length) * 100),
    avgDuration: Math.round((totalDuration / operationRecords.length) * 100) / 100,
    operations: operationStats,
  };
};

/**
 * 获取最近的操作记录
 * @param {number} limit - 返回数量限制
 * @returns {Array} 操作记录数组
 */
export const getRecentOperations = (limit = 20) => {
  return operationRecords.slice(-limit);
};

/**
 * 清空操作记录
 */
export const clearOperationRecords = () => {
  operationRecords.length = 0;
};

/**
 * 测量组件渲染时间 (用于 React.Profiler)
 */
export const onRenderCallback = (
  id,
  phase,
  actualDuration,
  baseDuration,
  startTime,
  commitTime
) => {
  const record = {
    name: `Render:${id}`,
    duration: Math.round(actualDuration * 100) / 100,
    phase,
    baseDuration: Math.round(baseDuration * 100) / 100,
    startTimestamp: startTime,
    endTimestamp: commitTime,
    isSlow: actualDuration > SLOW_OPERATION_THRESHOLD,
    metadata: { type: 'render' },
  };

  operationRecords.push(record);
  if (operationRecords.length > MAX_RECORDS) {
    operationRecords.shift();
  }

  if (record.isSlow && isDev) {
    console.warn(`[Perf] 🐢 Slow render: ${id} (${phase}) took ${record.duration}ms`);
  }
};

/**
 * 创建性能追踪的 HOC 包装器
 * @param {string} componentName - 组件名称
 * @returns {Function} React.Profiler onRender 回调
 */
export const createProfilerCallback = (componentName) => {
  return (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
    onRenderCallback(
      `${componentName}:${id}`,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime
    );
  };
};

export default {
  startOperation,
  endOperation,
  trackAsync,
  getPerformanceStats,
  getRecentOperations,
  clearOperationRecords,
  onRenderCallback,
  createProfilerCallback,
  SLOW_OPERATION_THRESHOLD,
};
