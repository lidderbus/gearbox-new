import React, { useCallback } from 'react';
import ThemeToggle from './ThemeToggle';

const ModernNavBar = ({ activeTab, onNavigate, isMobile, onMenuToggle }) => {
  // P1#4 (2026-04-30): 顶栏与侧栏去重 — 业务入口收敛到侧栏, 顶栏仅保留 首页/智能搜索/关于
  // 旧 8 项 → 3 项, 移除: 齿轮箱选型/型号比较/备用泵选型/康明斯配套/技术协议/报价单 (均已在侧栏分组)
  const navItems = [
    { href: '#/', label: '首页', icon: '🏠', tabKey: 'home' },
    { href: '#/smart-search', label: '智能搜索', icon: '🔍', tabKey: 'smart-search' },
    { href: '#/about', label: '关于', icon: 'ℹ️', tabKey: null }
  ];

  const handleNavClick = useCallback((e, item) => {
    e.preventDefault();
    if (item.tabKey && onNavigate) {
      window.location.hash = item.href.replace('#', '');
      onNavigate(item.tabKey);
    }
  }, [onNavigate]);

  const isActive = useCallback((item) => {
    if (!activeTab) return false;
    return item.tabKey === activeTab;
  }, [activeTab]);

  return (
    <nav className="nav-modern">
      <div className="nav-container">
        {isMobile && (
          <button
            className="mobile-hamburger"
            onClick={onMenuToggle}
            aria-label="打开菜单"
          >
            ☰
          </button>
        )}
        <div className="nav-brand">
          船用齿轮箱选型系统
        </div>
        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive(item) ? 'active' : ''}`}
              onClick={(e) => handleNavClick(e, item)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
          <ThemeToggle />
        </div>
        {isMobile && <ThemeToggle />}
      </div>
    </nav>
  );
};

export default ModernNavBar;
