// src/AppWrapper.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { userRoles } from './auth/roles';
import App from './App';
import LoginPage from './components/LoginPage';
import './AppWrapper.css';
import { useIsMobile } from './hooks/useIsMobile';
import RouteSkeleton from './components/common/RouteSkeleton';
import { ProjectProvider } from './contexts/ProjectContext';

// 管理员路由 lazy: UserManagementView + DatabaseManagementView (含 PriceMaintenanceTool 15KB + GearboxDataImporter 15KB) 总计 ~50KB+ 仅 admin 可见
const UserManagementView = React.lazy(() => import(/* webpackChunkName: "admin-user-mgmt" */ './components/UserManagementView'));
const DatabaseManagementView = React.lazy(() => import(/* webpackChunkName: "admin-database-mgmt" */ './components/DatabaseManagementView'));
const MobileApp = React.lazy(() => import(/* webpackChunkName: "mobile-app" */ './components/mobile/MobileApp'));


const AppContent = ({ appData, setAppData }) => {
  const { currentUser, user, isAuthenticated, loading: authLoading, logout } = useAuth();
  const { isMobile } = useIsMobile();
  const [forceDesktop, setForceDesktop] = React.useState(() => {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem('forceDesktop') === 'true';
    }
    return false;
  });

  // Check if user is admin
  const isAdmin = user && (user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN);

  // 切换到桌面版
  const handleSwitchToDesktop = React.useCallback(() => {
    localStorage.setItem('forceDesktop', 'true');
    setForceDesktop(true);
  }, []);

  // 切换回移动版
  const handleSwitchToMobile = React.useCallback(() => {
    localStorage.setItem('forceDesktop', 'false');
    setForceDesktop(false);
  }, []);

  if (authLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>验证身份中...</p>
      </div>
    );
  }

  const userIsAuthenticated = isAuthenticated && (currentUser || user);
  // 移动端且未强制桌面模式时显示MobileApp
  const showMobile = isMobile && !forceDesktop && userIsAuthenticated;

  return (
    <Routes>
      <Route path="/login" element={userIsAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
      {/* Protected admin routes (lazy: 仅 admin 角色访问 /users 或 /database 时才下载) */}
      {isAdmin && (
         <>
           <Route path="/users" element={
             <React.Suspense fallback={<RouteSkeleton label="加载用户管理" />}>
               <UserManagementView appData={appData} setAppData={setAppData} />
             </React.Suspense>
           } />
           <Route path="/database" element={
             <React.Suspense fallback={<RouteSkeleton label="加载数据库管理" />}>
               <DatabaseManagementView appData={appData} setAppData={setAppData} />
             </React.Suspense>
           } />
         </>
      )}
      {/* Main application route */}
      <Route
        path="/*"
        element={
          userIsAuthenticated ? (
            showMobile ? (
              <React.Suspense fallback={<RouteSkeleton label="正在加载移动版" />}>
                <MobileApp
                  user={currentUser || user}
                  onLogout={logout}
                  appData={appData}
                  onSwitchToDesktop={handleSwitchToDesktop}
                />
              </React.Suspense>
            ) : (
              <App appData={appData} setAppData={setAppData} onSwitchToMobile={isMobile ? handleSwitchToMobile : undefined} />
            )
          ) : (
            <Navigate to="/login" replace state={{ from: window.location.pathname }} />
          )
        }
      />
    </Routes>
  );
};

const AppWrapper = ({ initialData, setAppData }) => {
  if (initialData === null) {
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

  return (
    <AuthProvider>
      {/* Assuming DarkModeProvider wraps AuthProvider */}
      {/* <DarkModeProvider> */}
        <ProjectProvider>
          <Router basename="/gearbox-app">
            <AppContent appData={initialData} setAppData={setAppData} />
          </Router>
        </ProjectProvider>
      {/* </DarkModeProvider> */}
    </AuthProvider>
  );
};

export default AppWrapper;
