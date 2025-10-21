// src/index.js
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AppWrapper from './AppWrapper';
// 导入并使用来自 repair.js 的更完整的数据加载和修复函数
import { loadAndRepairData } from './utils/repair'; // <--- CHANGED IMPORT
import DarkModeProvider from './contexts/DarkModeContext';
import reportWebVitals from './reportWebVitals';

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

  // 加载状态UI
  if (loadingStatus === 'loading' || loadingStatus === 'initializing') {
    return (
      <div className="app-loading">
        <div className="loading-spinner"></div>
        <div className="loading-text">
          {loadingStatus === 'initializing' ? '正在初始化...' : '正在加载数据...'}
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
    <DarkModeProvider>
      <AppWrapper initialData={appData} setAppData={setAppData} />
    </DarkModeProvider>
  );
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<Root />);

reportWebVitals();