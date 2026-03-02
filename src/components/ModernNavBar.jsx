import React, { useCallback } from 'react';
import ThemeToggle from './ThemeToggle';

const ModernNavBar = ({ activeTab, onNavigate, isMobile, onMenuToggle }) => {
  const navItems = [
    { href: '#/', label: '首页', icon: '🏠', tabKey: 'home' },
    { href: '#/selection', label: '齿轮箱选型', icon: '⚙️', tabKey: 'input' },
    { href: '#/comparison', label: '型号比较', icon: '📊', tabKey: 'result' },
    { href: '#/pump-selection', label: '备用泵选型', icon: '💧', tabKey: 'pump-selection' },
    { href: '#/cummins', label: '康明斯配套', icon: '🔧', tabKey: 'cummins' },
    { href: '#/technical', label: '技术协议', icon: '📄', tabKey: 'agreement' },
    { href: '#/quotation', label: '报价单', icon: '💰', tabKey: 'quotation' },
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
