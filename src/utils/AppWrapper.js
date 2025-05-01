// src/AppWrapper.js
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { userRoles } from './auth/roles';
import { ProtectedRoute } from './auth/ProtectedRoute';
import App from './App';
import LoginPage from './components/LoginPage';
import UserManagementView from './components/UserManagementView';
import DatabaseManagementView from './components/DatabaseManagementView';
import { createGlobalStyle } from 'styled-components';
import { adaptEnhancedData } from './utils/dataAdapter';
import { initialData } from './data/initialData';

// 创建全局样式组件
const GlobalStyle = createGlobalStyle`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  body {
    margin: 0;
    padding: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: #f5f7fa;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  #root {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  * {
    box-sizing: border-box;
  }

  .app-container {
    padding: 20px;
    flex: 1;
  }

  .form-group {
    margin-bottom: 1rem;
  }

  .table {
    font-size: 14px;
  }

  .table th {
    background-color: #f8f9fa;
  }

  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background-color: #f5f7fa;
  }

  .loading-spinner {
    border: 4px solid #f3f3f3;
    border-top: 4px solid #3498db;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  .loading-text {
    margin-top: 20px;
    font-size: 18px;
    color: #666;
  }

  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    padding: 20px;
    text-align: center;
  }

  .error-icon {
    font-size: 48px;
    margin-bottom: 20px;
  }

  .error-message {
    font-size: 18px;
    color: #dc3545;
    margin-bottom: 20px;
  }

  button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }

  button:hover {
    background-color: #0056b3;
  }
`;

// 错误边界组件
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center', 
          marginTop: '50px',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>程序出现错误</h2>
          <p style={{ color: 'red' }}>{this.state.error?.message}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重新加载页面
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

// 主应用程序包装器
function AppWrapper() {
  const [appData, setAppData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AppWrapper mounted');
    const loadData = async () => {
      try {
        console.log('Loading data...');
        setLoading(true);

        // 检查 initialData 是否存在
        if (!initialData) {
          throw new Error('初始数据未定义');
        }

        console.log('Initial data:', initialData);

        // 检查必要的数据集合
        const requiredCollections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes'];
        const missingCollections = requiredCollections.filter(
          collection => !initialData[collection] || !Array.isArray(initialData[collection])
        );

        if (missingCollections.length > 0) {
          throw new Error(`缺少必要的数据集合: ${missingCollections.join(', ')}`);
        }

        // 尝试从 localStorage 加载数据
        const storedData = localStorage.getItem('appData');
        let data;
        
        if (storedData) {
          console.log('Found stored data, parsing...');
          try {
            data = JSON.parse(storedData);
            console.log('Stored data parsed successfully');
          } catch (parseError) {
            console.error('Failed to parse stored data:', parseError);
            data = initialData;
          }
        } else {
          console.log('No stored data found, using initial data');
          data = initialData;
        }

        // 适配数据
        console.log('Adapting data...');
        const adaptedData = adaptEnhancedData(data);
        console.log('Data adapted successfully:', adaptedData);

        // 保存到 state
        setAppData(adaptedData);
        setError(null);

        // 保存到 localStorage
        try {
          localStorage.setItem('appData', JSON.stringify(adaptedData));
          console.log('Data saved to localStorage');
        } catch (storageError) {
          console.warn('Failed to save data to localStorage:', storageError);
        }

      } catch (error) {
        console.error('Data loading failed:', error);
        setError(error.message);
      } finally {
        setLoading(false);
        console.log('Data loading process completed');
      }
    };

    loadData();
  }, []);

  // 渲染加载状态
  if (loading) {
    return (
      <>
        <GlobalStyle />
        <div className="loading-container">
          <div className="loading-spinner" />
          <div className="loading-text">正在加载数据...</div>
        </div>
      </>
    );
  }

  // 渲染错误状态
  if (error) {
    return (
      <>
        <GlobalStyle />
        <div className="loading-container">
          <h2>数据加载失败</h2>
          <p style={{ color: 'red', margin: '20px 0' }}>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            重试
          </button>
        </div>
      </>
    );
  }

  // 渲染主应用
  return (
    <ErrorBoundary>
      <>
        <GlobalStyle />
        <HashRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={
                <ProtectedRoute requiredRole={userRoles.USER}>
                  <App 
                    appData={appData} 
                    setAppData={setAppData}
                    dataLoading={loading}
                    dataError={error}
                  />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <ProtectedRoute requiredRole={userRoles.ADMIN}>
                  <UserManagementView />
                </ProtectedRoute>
              } />
              <Route path="/database" element={
                <ProtectedRoute requiredRole={userRoles.ADMIN}>
                  <DatabaseManagementView />
                </ProtectedRoute>
              } />
            </Routes>
          </AuthProvider>
        </HashRouter>
      </>
    </ErrorBoundary>
  );
}

export default AppWrapper;