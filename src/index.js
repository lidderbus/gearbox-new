// src/index.js
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppWrapper from './AppWrapper';
// 导入并使用来自 repair.js 的更完整的数据加载和修复函数
import { loadAndRepairData } from './utils/repair'; // <--- CHANGED IMPORT
import DarkModeProvider from './contexts/DarkModeContext';
import { SelectionConfigProvider } from './contexts/SelectionConfigContext';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';

// Sentry 错误监控
import { initSentry } from './config/sentry';

// 初始化 Sentry (应在渲染前调用)
initSentry();

const Root = () => {
  const [appData, setAppData] = useState(null);
  const [loadingError, setLoadingError] = useState(null);
  const [loadingStatus, setLoadingStatus] = useState('initializing');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoadingStatus('loading');
        console.log("Root: 开始加载应用数据...");

        // 调用来自 repair.js 的加载和修复函数
        const loadedData = await loadAndRepairData({ // <--- CALLING FUNCTION FROM REPAIR.JS
          onProgress: (status) => setLoadingStatus(status) // Keep this if repair.js supports it
        });

        if (!loadedData) {
          throw new Error('数据加载返回null');
        }

        console.log("Root: 数据加载成功", {
          gearboxCount: Object.keys(loadedData).filter(key => key.endsWith('Gearboxes')).reduce((sum, key) =>
            sum + (Array.isArray(loadedData[key]) ? loadedData[key].length : 0), 0),
          couplingCount: loadedData.flexibleCouplings?.length || 0,
          pumpCount: loadedData.standbyPumps?.length || 0
        });

        setAppData(loadedData);
        setLoadingStatus('ready');

      } catch (error) {
        console.error("Root: 数据加载失败", error);
        setLoadingError(error.message);
        setLoadingStatus('error');
      }
    };

    initializeApp();
  }, []);

  // 加载状态UI - 只有 'ready' 和 'error' 才退出加载状态
  // repair.js 的 onProgress 会发送多个中间状态，都应显示加载中
  if (loadingStatus !== 'ready' && loadingStatus !== 'error') {
    // 显示友好的状态文本
    const getStatusText = (status) => {
      const statusMap = {
        'initializing': '正在初始化...',
        'loading': '正在加载数据...',
        'checking local storage': '正在检查本地数据...',
        'loading external data': '正在加载外部数据...',
        'applying overrides': '正在应用配置...',
        'applying fixes': '正在修复数据...',
        'validating': '正在验证数据...'
      };
      return statusMap[status] || `${status}...`;
    };

    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">
          {getStatusText(loadingStatus)}
        </div>
      </div>
    );
  }

  // 错误状态UI
  if (loadingStatus === 'error') {
    return (
      <div className="error-container">
        <h2>应用启动失败</h2>
        <p>错误详情: {loadingError}</p>
        <button className="reload-button" onClick={() => window.location.reload()}>
          重新加载
        </button>
      </div>
    );
  }

  // 正常渲染应用
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <DarkModeProvider>
          <SelectionConfigProvider>
            <AppWrapper initialData={appData} setAppData={setAppData} />
          </SelectionConfigProvider>
        </DarkModeProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Root />);

// Web Vitals 性能监控
reportWebVitals((metric) => {
  // 发送到 Google Analytics (如果已配置)
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // 发送到 Sentry 作为自定义测量 (如果已配置)
  if (process.env.REACT_APP_SENTRY_DSN) {
    import('@sentry/react').then((Sentry) => {
      Sentry.setMeasurement(metric.name, metric.value, metric.name === 'CLS' ? '' : 'millisecond');
    }).catch(() => {});
  }

  // 开发环境下输出到控制台
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value), metric.rating);
  }
});

// 注销 Service Worker，清除旧缓存
serviceWorkerRegistration.unregister();