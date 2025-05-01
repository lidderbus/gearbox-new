// src/AppWrapper.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { userRoles } from './auth/roles';
import App from './App';
import LoginPage from './components/LoginPage';
import { createGlobalStyle } from 'styled-components';
import './AppWrapper.css';
// import { loadAndRepairData } from './utils/repair'; // Moved loading outside
import UserManagementView from './components/UserManagementView'; // Import UserManagementView
import DatabaseManagementView from './components/DatabaseManagementView'; // Import DatabaseManagementView
import ErrorBoundary from './components/ErrorBoundary';
// import DarkModeProvider from './contexts/DarkModeContext'; // Assuming DarkModeProvider is needed
// import { flexibleCouplings } from './data/flexibleCouplings'; // Not needed here

console.log('AppWrapper.js 开始执行');

const GlobalStyle = createGlobalStyle`
  @font-face {
    font-family: 'Noto Sans SC';
    font-style: normal;
    font-weight: 400;
    src: local('Noto Sans SC Regular'),
         local('NotoSansSC-Regular'),
         url('https://cdn.jsdelivr.net/gh/googlefonts/noto-cjk@main/Sans/OTF/SimplifiedChinese/NotoSansCJKsc-Regular.otf') format('opentype');
    font-display: swap;
  }

  body {
    margin: 0;
    font-family: 'Noto Sans SC', 'Microsoft YaHei', 'PingFang SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }
`;

const AppContent = ({ appData, setAppData }) => {
  console.log('AppContent 组件开始渲染', { appData });
  
  const { currentUser, user, isAuthenticated, loading: authLoading } = useAuth();

  // Check if user is admin
  const isAdmin = user && (user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN);

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>验证身份中...</p>
      </div>
    );
  }

  const userIsAuthenticated = isAuthenticated && (currentUser || user);
  console.log('AppContent 认证状态:', { userIsAuthenticated, isAdmin });

  return (
    <Routes>
      <Route path="/login" element={userIsAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      {/* Protected admin routes */}
      {isAdmin && (
         <>
           <Route path="/users" element={<UserManagementView appData={appData} setAppData={setAppData} />} />
           <Route path="/database" element={<DatabaseManagementView appData={appData} setAppData={setAppData} />} />
         </>
      )}
      {/* Main application route */}
      <Route
        path="/*"
        element={
          userIsAuthenticated ? (
            <ErrorBoundary>
              <App appData={appData} setAppData={setAppData} />
            </ErrorBoundary>
          ) : (
            <Navigate to="/login" replace state={{ from: window.location.pathname }} />
          )
        }
      />
    </Routes>
  );
};

const AppWrapper = ({ initialData, setAppData }) => {
  console.log('AppWrapper 组件开始渲染', { initialData });
  
  if (initialData === null) {
    console.error('AppWrapper: 初始数据为空');
    return (
      <div className="error-container">
        <h2>应用启动失败</h2>
        <p>未能加载系统所需数据。</p>
        <button
          className="reload-button"
          onClick={() => window.location.reload()}
        >
          重新加载
        </button>
      </div>
    );
  }

  console.log('AppWrapper 准备渲染主应用');
  return (
    <AuthProvider>
      {/* Assuming DarkModeProvider wraps AuthProvider */}
      {/* <DarkModeProvider> */}
        <GlobalStyle />
        <Router>
          <AppContent appData={initialData} setAppData={setAppData} />
        </Router>
      {/* </DarkModeProvider> */}
    </AuthProvider>
  );
};

console.log('AppWrapper.js 执行完毕，准备导出');
export default AppWrapper;
