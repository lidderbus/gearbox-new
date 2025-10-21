/**
 * 性能监控工具
 * 集成Web Vitals，监控应用性能指标
 */

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { createLogger } from './logger';

const log = createLogger('PerformanceMonitor');

/**
 * 性能指标阈值（毫秒）
 * 基于Google Web Vitals标准
 */
const THRESHOLDS = {
  // Largest Contentful Paint（最大内容绘制）
  LCP: {
    good: 2500,
    needsImprovement: 4000,
  },
  // First Input Delay（首次输入延迟）
  FID: {
    good: 100,
    needsImprovement: 300,
  },
  // Cumulative Layout Shift（累积布局偏移）
  CLS: {
    good: 0.1,
    needsImprovement: 0.25,
  },
  // First Contentful Paint（首次内容绘制）
  FCP: {
    good: 1800,
    needsImprovement: 3000,
  },
  // Time to First Byte（首字节时间）
  TTFB: {
    good: 800,
    needsImprovement: 1800,
  },
};

/**
 * 性能数据存储
 */
const performanceData = {
  metrics: [],
  customMarks: new Map(),
};

/**
 * 判断性能等级
 */
function getRating(name, value) {
  const threshold = THRESHOLDS[name];
  if (!threshold) return 'unknown';

  if (value <= threshold.good) return 'good';
  if (value <= threshold.needsImprovement) return 'needs-improvement';
  return 'poor';
}

/**
 * 格式化性能数据用于日志
 */
function formatMetric({ name, value, rating }) {
  const unit = name === 'CLS' ? '' : 'ms';
  const emoji = {
    good: '✅',
    'needs-improvement': '⚠️',
    poor: '❌',
  }[rating] || '';

  return `${emoji} ${name}: ${value.toFixed(2)}${unit} (${rating})`;
}

/**
 * 发送性能数据到分析服务
 * 可以集成Google Analytics、Sentry等
 */
function sendToAnalytics({ name, value, id, rating }) {
  // 存储到本地
  performanceData.metrics.push({
    name,
    value,
    id,
    rating,
    timestamp: Date.now(),
  });

  // 在开发环境输出到控制台
  if (process.env.NODE_ENV === 'development') {
    log.info(formatMetric({ name, value, rating }));
  }

  // TODO: 在生产环境发送到分析服务
  // if (process.env.NODE_ENV === 'production') {
  //   // 发送到Google Analytics
  //   window.gtag?.('event', name, {
  //     value: Math.round(value),
  //     metric_id: id,
  //     metric_rating: rating,
  //   });
  //
  //   // 或发送到自定义API
  //   fetch('/api/metrics', {
  //     method: 'POST',
  //     body: JSON.stringify({ name, value, id, rating }),
  //   });
  // }
}

/**
 * 初始化Web Vitals监控
 */
export function initWebVitalsMonitoring() {
  log.info('初始化Web Vitals性能监控...');

  // 监控最大内容绘制 (LCP)
  getLCP((metric) => {
    const rating = getRating('LCP', metric.value);
    sendToAnalytics({ ...metric, rating });
  });

  // 监控首次输入延迟 (FID)
  getFID((metric) => {
    const rating = getRating('FID', metric.value);
    sendToAnalytics({ ...metric, rating });
  });

  // 监控累积布局偏移 (CLS)
  getCLS((metric) => {
    const rating = getRating('CLS', metric.value);
    sendToAnalytics({ ...metric, rating });
  });

  // 监控首次内容绘制 (FCP)
  getFCP((metric) => {
    const rating = getRating('FCP', metric.value);
    sendToAnalytics({ ...metric, rating });
  });

  // 监控首字节时间 (TTFB)
  getTTFB((metric) => {
    const rating = getRating('TTFB', metric.value);
    sendToAnalytics({ ...metric, rating });
  });

  log.info('Web Vitals监控已启用');
}

/**
 * 自定义性能标记
 * 用于测量特定操作的性能
 */
export class PerformanceMark {
  constructor(name) {
    this.name = name;
    this.startTime = performance.now();
    performanceData.customMarks.set(name, this);
  }

  end() {
    const endTime = performance.now();
    const duration = endTime - this.startTime;

    log.debug(`⏱️ ${this.name}: ${duration.toFixed(2)}ms`);

    performanceData.customMarks.delete(this.name);
    return duration;
  }
}

/**
 * 测量异步操作性能
 */
export async function measureAsync(name, asyncFn) {
  const mark = new PerformanceMark(name);

  try {
    const result = await asyncFn();
    mark.end();
    return result;
  } catch (error) {
    mark.end();
    throw error;
  }
}

/**
 * 测量同步操作性能
 */
export function measureSync(name, syncFn) {
  const mark = new PerformanceMark(name);

  try {
    const result = syncFn();
    mark.end();
    return result;
  } catch (error) {
    mark.end();
    throw error;
  }
}

/**
 * 获取性能报告
 */
export function getPerformanceReport() {
  const metrics = performanceData.metrics.reduce((acc, metric) => {
    acc[metric.name] = {
      value: metric.value,
      rating: metric.rating,
      timestamp: metric.timestamp,
    };
    return acc;
  }, {});

  const summary = {
    totalMetrics: performanceData.metrics.length,
    goodMetrics: performanceData.metrics.filter(m => m.rating === 'good').length,
    poorMetrics: performanceData.metrics.filter(m => m.rating === 'poor').length,
  };

  return {
    metrics,
    summary,
    overallRating: summary.poorMetrics === 0 ? 'good' :
                   summary.goodMetrics > summary.poorMetrics ? 'needs-improvement' : 'poor',
  };
}

/**
 * 导出性能数据为JSON
 */
export function exportPerformanceData() {
  return JSON.stringify({
    report: getPerformanceReport(),
    rawMetrics: performanceData.metrics,
    timestamp: new Date().toISOString(),
  }, null, 2);
}

/**
 * 清除性能数据
 */
export function clearPerformanceData() {
  performanceData.metrics = [];
  performanceData.customMarks.clear();
  log.info('性能数据已清除');
}

/**
 * 监控React组件渲染性能
 */
export function withPerformanceTracking(Component, componentName) {
  return function TrackedComponent(props) {
    const mark = new PerformanceMark(`Render ${componentName}`);

    React.useEffect(() => {
      mark.end();
    });

    return React.createElement(Component, props);
  };
}

/**
 * 资源加载性能监控
 */
export function monitorResourceLoading() {
  if (!window.performance || !window.performance.getEntriesByType) {
    return;
  }

  const resources = performance.getEntriesByType('resource');
  const slowResources = resources.filter(resource => resource.duration > 1000);

  if (slowResources.length > 0) {
    log.warn(`发现${slowResources.length}个慢速资源:`,
      slowResources.map(r => ({
        name: r.name.split('/').pop(),
        duration: `${r.duration.toFixed(0)}ms`,
      }))
    );
  }

  return {
    totalResources: resources.length,
    slowResources: slowResources.length,
    averageDuration: resources.reduce((sum, r) => sum + r.duration, 0) / resources.length,
  };
}

/**
 * 内存使用监控（仅Chrome）
 */
export function monitorMemoryUsage() {
  if (!performance.memory) {
    return null;
  }

  const memoryMB = {
    used: (performance.memory.usedJSHeapSize / 1048576).toFixed(2),
    total: (performance.memory.totalJSHeapSize / 1048576).toFixed(2),
    limit: (performance.memory.jsHeapSizeLimit / 1048576).toFixed(2),
  };

  const usagePercent = ((performance.memory.usedJSHeapSize / performance.memory.jsHeapSizeLimit) * 100).toFixed(1);

  if (usagePercent > 90) {
    log.warn(`⚠️ 内存使用率过高: ${usagePercent}%`);
  }

  return {
    ...memoryMB,
    usagePercent: `${usagePercent}%`,
  };
}

export default {
  initWebVitalsMonitoring,
  PerformanceMark,
  measureAsync,
  measureSync,
  getPerformanceReport,
  exportPerformanceData,
  clearPerformanceData,
  monitorResourceLoading,
  monitorMemoryUsage,
};
