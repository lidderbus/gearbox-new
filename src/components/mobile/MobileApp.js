/**
 * MobileApp - 移动端应用入口组件
 *
 * 功能:
 * - 整合移动端导航和页面
 * - 管理移动端路由状态
 * - 提供移动端主题切换
 */
import React, { useState, useCallback, useMemo, useEffect, lazy, Suspense } from 'react';
import { Spinner } from 'react-bootstrap';
import MobileNav from './MobileNav';
import './MobileApp.css';

// 懒加载页面组件
const MobileGearboxSelection = lazy(() => import('../../pages/MobileSelection/MobileGearboxSelection'));

// 加载占位组件
const LoadingFallback = () => (
  <div className="mobile-loading">
    <Spinner animation="border" variant="primary" />
    <p>加载中...</p>
  </div>
);

const MobileApp = ({
  user,
  onLogout,
  gearboxDatabase = [],
  selectionAlgorithm,
  onSelectionComplete,
  onSwitchToDesktop
}) => {
  // 当前标签页
  const [currentTab, setCurrentTab] = useState('selection');

  // 主题状态
  const [theme, setTheme] = useState(() => {
    // 检测系统主题偏好
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  // 切换主题
  const handleThemeToggle = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // 检测桌面专属路由
  useEffect(() => {
    const checkDesktopRoute = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      const desktopOnlyRoutes = ['/cummins', '/data-query', '/batch-selection'];
      if (desktopOnlyRoutes.includes(hash)) {
        setCurrentTab('desktop-prompt');
      }
    };
    checkDesktopRoute();
    window.addEventListener('hashchange', checkDesktopRoute);
    return () => window.removeEventListener('hashchange', checkDesktopRoute);
  }, []);

  // 处理标签页切换
  const handleTabChange = useCallback((tab) => {
    setCurrentTab(tab);
  }, []);

  // 处理选型完成
  const handleSelect = useCallback((result) => {
    onSelectionComplete?.(result);
    // 可以切换到结果页或显示确认
  }, [onSelectionComplete]);

  // 渲染当前页面内容
  const renderContent = useMemo(() => {
    switch (currentTab) {
      case 'selection':
        return (
          <MobileGearboxSelection
            gearboxDatabase={gearboxDatabase}
            selectionAlgorithm={selectionAlgorithm}
            onSelect={handleSelect}
            theme={theme}
          />
        );
      case 'home':
        return (
          <div className="mobile-page mobile-home">
            <div className="home-hero">
              <h1>⚙️</h1>
              <h2>船用齿轮箱选型系统</h2>
              <p>专业、快速、精准</p>
            </div>
            <div className="home-stats">
              <div className="stat-item">
                <span className="stat-number">{gearboxDatabase.length}+</span>
                <span className="stat-label">齿轮箱型号</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">30+</span>
                <span className="stat-label">产品系列</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">匹配精度</span>
              </div>
            </div>
            <button
              className="home-cta-btn"
              onClick={() => setCurrentTab('selection')}
            >
              开始选型
            </button>
          </div>
        );
      case 'quotation':
        return (
          <div className="mobile-page mobile-placeholder">
            <div className="placeholder-icon">📄</div>
            <h3>报价单功能</h3>
            <p>请先完成齿轮箱选型</p>
            <button
              className="placeholder-btn"
              onClick={() => setCurrentTab('selection')}
            >
              前往选型
            </button>
          </div>
        );
      case 'technical':
        return (
          <div className="mobile-page mobile-placeholder">
            <div className="placeholder-icon">📋</div>
            <h3>技术协议</h3>
            <p>请先完成齿轮箱选型</p>
            <button
              className="placeholder-btn"
              onClick={() => setCurrentTab('selection')}
            >
              前往选型
            </button>
          </div>
        );
      case 'comparison':
        return (
          <div className="mobile-page mobile-placeholder">
            <div className="placeholder-icon">📊</div>
            <h3>型号比较</h3>
            <p>选择多个型号进行对比</p>
            <button
              className="placeholder-btn"
              onClick={() => setCurrentTab('selection')}
            >
              前往选型
            </button>
          </div>
        );
      case 'cummins':
      case 'desktop-prompt':
        return (
          <div className="mobile-page mobile-placeholder">
            <div className="placeholder-icon">💻</div>
            <h3>此功能需要桌面版</h3>
            <p>康明斯配套功能数据量较大</p>
            <p style={{ color: '#888', fontSize: '0.85rem' }}>建议使用电脑访问以获得最佳体验</p>
            {onSwitchToDesktop && (
              <button
                className="placeholder-btn"
                style={{ background: '#0d6efd', color: '#fff', marginTop: '16px' }}
                onClick={onSwitchToDesktop}
              >
                切换到桌面版
              </button>
            )}
            <button
              className="placeholder-btn"
              style={{ marginTop: '12px' }}
              onClick={() => setCurrentTab('selection')}
            >
              返回选型
            </button>
          </div>
        );
      default:
        return (
          <MobileGearboxSelection
            gearboxDatabase={gearboxDatabase}
            selectionAlgorithm={selectionAlgorithm}
            onSelect={handleSelect}
            theme={theme}
          />
        );
    }
  }, [currentTab, gearboxDatabase, selectionAlgorithm, handleSelect, theme]);

  return (
    <div className={`mobile-app ${theme === 'dark' ? 'dark-theme' : ''}`} data-theme={theme}>
      {/* 移动端导航 */}
      <MobileNav
        currentTab={currentTab}
        onTabChange={handleTabChange}
        user={user}
        onLogout={onLogout}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />

      {/* 页面内容 */}
      <main className="mobile-content-wrapper">
        <Suspense fallback={<LoadingFallback />}>
          {renderContent}
        </Suspense>
      </main>
    </div>
  );
};

export default MobileApp;
