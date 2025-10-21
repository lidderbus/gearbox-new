// src/reportWebVitals.js
// 性能指标上报 - 增强版本

import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';
import { initWebVitalsMonitoring } from './utils/performanceMonitor';

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // 如果提供了自定义回调，使用自定义回调
    getCLS(onPerfEntry);
    getFID(onPerfEntry);
    getFCP(onPerfEntry);
    getLCP(onPerfEntry);
    getTTFB(onPerfEntry);
  } else {
    // 否则使用默认的性能监控系统
    initWebVitalsMonitoring();
  }
};

export default reportWebVitals;
