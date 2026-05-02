// src/index.js
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppWrapper from './AppWrapper';
// 导入并使用来自 repair.js 的更完整的数据加载和修复函数
import { loadAndRepairData } from './utils/repair'; // <--- CHANGED IMPORT
import { SelectionConfigProvider } from './contexts/SelectionConfigContext';
import ErrorBoundary from './components/ErrorBoundary';
import reportWebVitals from './reportWebVitals';
import * as serviceWorkerRegistration from './utils/serviceWorkerRegistration';
import FatalScreen from './components/FatalScreen';

// Sentry 错误监控
import { initSentry } from './config/sentry';

// 初始化 Sentry (应在渲染前调用)
initSentry();

// 生产环境抑制非关键日志 (保留 warn/error 用于监控)
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.debug = () => {};
  console.info = () => {};
}

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
        // A4: 把完整 error (含 details) 传给 FatalScreen, 让工程师能定位
        setLoadingError(error);
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

  // 错误状态UI - A4 投产硬阻断: 显示明细+复制详情+联系管理员
  if (loadingStatus === 'error') {
    return <FatalScreen error={loadingError} onRetry={() => window.location.reload()} />;
  }

  // 正常渲染应用
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <SelectionConfigProvider>
          <AppWrapper initialData={appData} setAppData={setAppData} />
        </SelectionConfigProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Root />);

// Web Vitals 性能监控 — P3: localStorage breadcrumb + 生产级 poor 警告
const VITALS_BUFFER_KEY = 'web_vitals_recent';
const VITALS_BUFFER_MAX = 50;

function appendVitalToBuffer(metric) {
  try {
    const raw = localStorage.getItem(VITALS_BUFFER_KEY);
    const buf = raw ? JSON.parse(raw) : [];
    buf.push({
      name: metric.name,
      value: Math.round(metric.value * 1000) / 1000,
      rating: metric.rating,
      ts: Date.now(),
      url: window.location.pathname
    });
    // 截断最近 N 条
    const trimmed = buf.slice(-VITALS_BUFFER_MAX);
    localStorage.setItem(VITALS_BUFFER_KEY, JSON.stringify(trimmed));
  } catch (_) {
    // localStorage 满或被禁用时静默
  }
}

reportWebVitals((metric) => {
  // 1. localStorage breadcrumb — 即使无 Sentry/GA 也能本地查诊断
  appendVitalToBuffer(metric);

  // 2. Google Analytics (如已配置)
  if (window.gtag) {
    window.gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: metric.id,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // 3. Sentry 自定义测量 (如已配置)
  if (process.env.REACT_APP_SENTRY_DSN) {
    import('@sentry/react').then((Sentry) => {
      Sentry.setMeasurement(metric.name, metric.value, metric.name === 'CLS' ? '' : 'millisecond');
      // poor 级别上升为 breadcrumb (生产环境可见)
      if (metric.rating === 'poor') {
        Sentry.addBreadcrumb({
          category: 'web-vitals',
          level: 'warning',
          message: `${metric.name} poor: ${Math.round(metric.value)}`,
          data: { name: metric.name, value: metric.value, id: metric.id, url: window.location.pathname }
        });
      }
    }).catch(() => {});
  }

  // 4. 控制台输出: 开发全部 + 生产 poor
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Web Vitals] ${metric.name}:`, Math.round(metric.value), metric.rating);
  } else if (metric.rating === 'poor') {
    console.warn(`[Web Vitals] ${metric.name} = ${Math.round(metric.value)} (poor)`);
  }
});

// Register Service Worker for PWA offline support
serviceWorkerRegistration.register({
  onUpdate: (registration) => {
    console.log('[PWA] New version available, will activate on next visit');
  },
  onSuccess: (registration) => {
    console.log('[PWA] App cached for offline use');
  },
  onError: (error) => {
    console.warn('[PWA] Service Worker error:', error);
  }
});