// src/AppWrapper.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { userRoles } from './auth/roles';
import App from './App';
import LoginPage from './components/LoginPage';
import './AppWrapper.css';
// import { loadAndRepairData } from './utils/repair'; // Moved loading outside
import UserManagementView from './components/UserManagementView'; // Import UserManagementView
import DatabaseManagementView from './components/DatabaseManagementView'; // Import DatabaseManagementView
// import DarkModeProvider from './contexts/DarkModeContext'; // Assuming DarkModeProvider is needed
// import { flexibleCouplings } from './data/flexibleCouplings'; // Not needed here
import { useIsMobile } from './hooks/useIsMobile';

const MobileApp = React.lazy(() => import('./components/mobile/MobileApp'));


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
            showMobile ? (
              <React.Suspense fallback={<div className="loading-container"><div className="loading-spinner"></div><p>加载移动端...</p></div>}>
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
        <Router basename="/gearbox-app">
          <AppContent appData={initialData} setAppData={setAppData} />
        </Router>
      {/* </DarkModeProvider> */}
    </AuthProvider>
  );
};

export default AppWrapper;
