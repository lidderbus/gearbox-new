/**
 * MobileNav - 移动端导航组件
 *
 * 功能:
 * - 汉堡菜单
 * - 侧边抽屉导航
 * - 底部导航栏
 */
import React, { useState, useCallback } from 'react';
import { Offcanvas, Nav, Button, Badge } from 'react-bootstrap';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import SettingsIcon from '@mui/icons-material/Settings';
import CompareIcon from '@mui/icons-material/Compare';
import DescriptionIcon from '@mui/icons-material/Description';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CloseIcon from '@mui/icons-material/Close';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';
import './MobileNav.css';

const MobileNav = ({
  currentTab,
  onTabChange,
  user,
  onLogout,
  theme = 'light',
  onThemeToggle
}) => {
  const [showMenu, setShowMenu] = useState(false);

  const handleClose = useCallback(() => setShowMenu(false), []);
  const handleShow = useCallback(() => setShowMenu(true), []);

  const handleNavClick = useCallback((tab) => {
    onTabChange?.(tab);
    handleClose();
  }, [onTabChange, handleClose]);

  // 主要导航项
  const mainNavItems = [
    { key: 'home', label: '首页', icon: <HomeIcon /> },
    { key: 'selection', label: '齿轮箱选型', icon: <SettingsIcon />, primary: true },
    { key: 'comparison', label: '型号比较', icon: <CompareIcon /> },
    { key: 'quotation', label: '报价单', icon: <ReceiptIcon /> },
    { key: 'technical', label: '技术协议', icon: <DescriptionIcon /> }
  ];

  // 底部快捷导航
  const bottomNavItems = [
    { key: 'home', label: '首页', icon: <HomeIcon fontSize="small" /> },
    { key: 'selection', label: '选型', icon: <SettingsIcon fontSize="small" /> },
    { key: 'quotation', label: '报价', icon: <ReceiptIcon fontSize="small" /> },
    { key: 'menu', label: '更多', icon: <MenuIcon fontSize="small" />, action: handleShow }
  ];

  return (
    <>
      {/* 顶部导航栏 */}
      <header className="mobile-header">
        <div className="mobile-header-content">
          <Button
            variant="link"
            className="mobile-menu-btn"
            onClick={handleShow}
            aria-label="打开菜单"
          >
            <MenuIcon />
          </Button>

          <div className="mobile-logo">
            <span className="logo-icon">⚙️</span>
            <span className="logo-text">齿轮箱选型</span>
          </div>

          <Button
            variant="link"
            className="mobile-theme-btn"
            onClick={onThemeToggle}
            aria-label="切换主题"
          >
            {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </Button>
        </div>
      </header>

      {/* 侧边抽屉菜单 */}
      <Offcanvas
        show={showMenu}
        onHide={handleClose}
        placement="start"
        className={`mobile-offcanvas ${theme === 'dark' ? 'dark-theme' : ''}`}
      >
        <Offcanvas.Header className="mobile-offcanvas-header">
          <Offcanvas.Title>
            <span className="menu-title-icon">⚙️</span>
            船用齿轮箱选型系统
          </Offcanvas.Title>
          <Button
            variant="link"
            className="mobile-close-btn"
            onClick={handleClose}
            aria-label="关闭菜单"
          >
            <CloseIcon />
          </Button>
        </Offcanvas.Header>

        <Offcanvas.Body className="mobile-offcanvas-body">
          {/* 用户信息 */}
          {user && (
            <div className="mobile-user-info">
              <div className="user-avatar">
                {user.username?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="user-details">
                <span className="user-name">{user.username}</span>
                <Badge bg={user.role === 'ADMIN' ? 'danger' : 'primary'} className="user-role">
                  {user.role}
                </Badge>
              </div>
            </div>
          )}

          {/* 主导航 */}
          <Nav className="mobile-nav-list">
            {mainNavItems.map(item => (
              <Nav.Link
                key={item.key}
                className={`mobile-nav-item ${currentTab === item.key ? 'active' : ''} ${item.primary ? 'primary' : ''}`}
                onClick={() => handleNavClick(item.key)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
                {item.primary && <Badge bg="success" className="nav-badge">常用</Badge>}
              </Nav.Link>
            ))}
          </Nav>

          {/* 底部操作 */}
          <div className="mobile-nav-footer">
            <Button
              variant="outline-secondary"
              className="mobile-footer-btn"
              onClick={onThemeToggle}
            >
              {theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              <span>{theme === 'dark' ? '浅色模式' : '深色模式'}</span>
            </Button>

            {user && (
              <Button
                variant="outline-danger"
                className="mobile-footer-btn"
                onClick={() => {
                  onLogout?.();
                  handleClose();
                }}
              >
                <LogoutIcon />
                <span>退出登录</span>
              </Button>
            )}
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      {/* 底部导航栏 */}
      <nav className="mobile-bottom-nav">
        {bottomNavItems.map(item => (
          <button
            key={item.key}
            className={`bottom-nav-item ${currentTab === item.key ? 'active' : ''}`}
            onClick={() => item.action ? item.action() : handleNavClick(item.key)}
          >
            <span className="bottom-nav-icon">{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </button>
        ))}
      </nav>
    </>
  );
};

export default MobileNav;
