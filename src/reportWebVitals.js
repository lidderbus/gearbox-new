// src/reportWebVitals.js
// 性能指标上报（可选）：当前仅做占位，避免构建错误。

const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    // 动态导入 web-vitals，避免额外体积
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    }).catch(() => {
      // web-vitals 未安装或加载失败时静默处理
    });
  }
};

export default reportWebVitals; 