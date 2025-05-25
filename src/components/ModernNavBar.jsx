import React from 'react';
import ThemeToggle from './ThemeToggle';

const ModernNavBar = () => {
  const navItems = [
    { href: '#/', label: '首页', icon: '🏠' },
    { href: '#/selection', label: '齿轮箱选型', icon: '⚙️' },
    { href: '#/comparison', label: '型号比较', icon: '📊' },
    { href: '#/technical', label: '技术协议', icon: '📄' },
    { href: '#/quotation', label: '报价单', icon: '💰' },
    { href: '#/about', label: '关于', icon: 'ℹ️' }
  ];

  const currentPath = window.location.hash || '#/';

  return (
    <nav className="nav-modern">
      <div className="nav-container">
        <div className="nav-brand">
          船用齿轮箱选型系统
        </div>
        <div className="nav-links">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-link ${currentPath === item.href ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
};

export default ModernNavBar;