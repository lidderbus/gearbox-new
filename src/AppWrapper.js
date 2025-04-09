// src/AppWrapper.js
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { userRoles } from './auth/roles';
import App from './App';
import LoginPage from './components/LoginPage';
import UserManagementView from './components/UserManagementView';
import DatabaseManagementView from './components/DatabaseManagementView';
import { createGlobalStyle } from 'styled-components';
import { adaptEnhancedData } from './utils/dataAdapter';
import { initialData } from './data/initialData'; // 确保导入初始数据

// 全局样式
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
  }
`;

// 加载状态组件
const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column'
  }}>
    <div>正在加载...</div>
    <div style={{ marginTop: '20px' }}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">加载中...</span>
      </div>
    </div>
  </div>
);

// 错误状态组件
const ErrorScreen = ({ message, onRetry }) => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column'
  }}>
    <div style={{ color: 'red' }}>加载出错: {message}</div>
    <button onClick={onRetry} style={{ marginTop: '20px' }}>
      重试
    </button>
  </div>
);

// 保护路由组件 - 确保只有特定角色的用户可以访问
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const isAdmin = user && (user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN);
  
  if (!isAdmin) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

// 确保所有集合都存在
const ensureCollections = (data) => {
  const collections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 
    'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'
  ];
  
  const updatedData = { ...data };

  collections.forEach(collection => {
    if (!updatedData[collection] || !Array.isArray(updatedData[collection])) {
      console.log(`初始化空数组: ${collection}`);
      updatedData[collection] = [];
    }
  });

  // 检查并添加GW系列初始化数据
  if (updatedData.gwGearboxes.length === 0 && initialData && initialData.gwGearboxes) {
    console.log("从initialData添加GW系列齿轮箱数据");
    updatedData.gwGearboxes = [...initialData.gwGearboxes];
  }
  
  return updatedData;
};

function AppWrapper() {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        // 检查本地存储
        const storedData = localStorage.getItem('appData');
        
        let data;
        if (storedData) {
          try {
            console.log("从localStorage加载数据");
            data = JSON.parse(storedData);
            console.log("解析localStorage数据成功:", Object.keys(data));
          } catch (parseError) {
            console.error("解析localStorage数据失败:", parseError);
            // 使用initialData替代无效的localStorage数据
            data = { ...initialData };
            console.log("使用initialData:", Object.keys(initialData));
          }
        } else {
          console.log("localStorage中没有数据，使用initialData");
          data = { ...initialData };
          console.log("使用initialData:", Object.keys(initialData));
        }

        // 确保所有必要的数据集合都存在
        data = ensureCollections(data);

        // 适配数据
        const adaptedData = adaptEnhancedData(data);
        console.log("数据适配完成:", Object.keys(adaptedData));
        
        // 再次检查GW系列数据
        if (!adaptedData.gwGearboxes || adaptedData.gwGearboxes.length === 0) {
          console.warn("GW系列数据仍然为空，添加备用数据");
          adaptedData.gwGearboxes = [
            {
              model: "GWC28.30",
              inputSpeedRange: [400, 2000],
              ratios: [2.06, 2.51, 3.08, 3.54, 4.05, 4.54, 5.09, 5.59, 6.14],
              transferCapacity: [0.865, 0.711, 0.578, 0.504, 0.44, 0.393, 0.35, 0.319, 0.29],
              thrust: 80,
              centerDistance: 280,
              weight: 1230,
              price: 72500,
              controlType: "气控/电控"
            },
            {
              model: "GWC45.49",
              inputSpeedRange: [400, 1600],
              ratios: [1.97, 2.47, 2.89, 3.47, 3.95, 4.37, 4.85, 5.50, 5.98],
              transferCapacity: [4.240, 3.392, 2.890, 2.414, 2.120, 1.913, 1.725, 1.520, 1.398],
              thrust: 270,
              centerDistance: 450,
              weight: 5500,
              price: 275800,
              controlType: "气控/电控"
            }
          ];
        }
        
        // 保存到状态和本地存储
        setAppData(adaptedData);
        localStorage.setItem('appData', JSON.stringify(adaptedData));
        
        setLoading(false);
      } catch (err) {
        console.error('数据加载失败:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 重置数据函数
  const resetAppData = () => {
    // 重置回初始数据
    const freshData = ensureCollections({ ...initialData });
    const adaptedData = adaptEnhancedData(freshData);
    setAppData(adaptedData);
    localStorage.setItem('appData', JSON.stringify(adaptedData));
    console.log("数据已重置");
  };

  // 加载状态
  if (loading) {
    return (
      <>
        <GlobalStyle />
        <LoadingScreen />
      </>
    );
  }

  // 错误状态
  if (error) {
    return (
      <>
        <GlobalStyle />
        <ErrorScreen 
          message={error} 
          onRetry={() => {
            setLoading(true);
            setError(null);
            resetAppData(); // 出错时可以尝试重置数据
          }} 
        />
      </>
    );
  }

  // 主应用渲染
  return (
    <>
      <GlobalStyle />
      <HashRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route 
              path="/" 
              element={<App appData={appData} setAppData={setAppData} />} 
            />
            {/* 添加管理路由 */}
            <Route 
              path="/users" 
              element={
                <ProtectedRoute>
                  <UserManagementView appData={appData} setAppData={setAppData} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/database" 
              element={
                <ProtectedRoute>
                  <DatabaseManagementView appData={appData} setAppData={setAppData} />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </>
  );
}

export default AppWrapper;