// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { userRoles } from '../auth/roles';

// 创建认证上下文
const AuthContext = createContext();

// 用户数据验证
const validateUserData = (userData) => {
  if (!userData || typeof userData !== 'object') return false;
  if (!userData.id || typeof userData.id !== 'number') return false;
  if (!userData.username || typeof userData.username !== 'string') return false;
  if (!userData.name || typeof userData.name !== 'string') return false;
  if (!userData.role || !Object.values(userRoles).includes(userData.role)) return false;
  return true;
};

// 认证提供者组件
export const AuthProvider = ({ children }) => {
  // 用户状态，包括认证状态和用户信息
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 在组件挂载时，从本地存储中恢复用户会话
  useEffect(() => {
    const loadUserSession = () => {
      setError(null);
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          if (validateUserData(parsedUser)) {
            setUser(parsedUser);
            setIsAuthenticated(true);
            console.log('User session restored successfully');
          } else {
            throw new Error('Invalid user data format');
          }
        }
      } catch (error) {
        console.error('Failed to restore user session:', error);
        setError('会话恢复失败，请重新登录');
        // 出错时清除本地存储和状态
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadUserSession();
  }, []);

  // 登录函数 - 验证用户名和密码
  const login = useCallback((username, password) => {
    setError(null);
    return new Promise((resolve, reject) => {
      // 模拟API延迟
      setTimeout(() => {
        try {
          if (!username || !password) {
            throw new Error('用户名和密码不能为空');
          }

          let userData = null;

          if (username === 'admin' && password === 'admin') {
            userData = {
              id: 1,
              username: 'admin',
              name: '管理员',
              role: userRoles.ADMIN
            };
          } else if (username === 'user' && password === 'user') {
            userData = {
              id: 2,
              username: 'user',
              name: '普通用户',
              role: userRoles.USER
            };
          } else {
            throw new Error('用户名或密码错误');
          }

          if (!validateUserData(userData)) {
            throw new Error('用户数据格式无效');
          }
          
          // 保存用户数据到状态和本地存储
          setUser(userData);
          setIsAuthenticated(true);
          localStorage.setItem('user', JSON.stringify(userData));
          
          console.log('Login successful:', userData.username);
          resolve({ success: true, user: userData });
        } catch (error) {
          console.error('Login failed:', error);
          setError(error.message);
          reject({ success: false, message: error.message });
        }
      }, 500);
    });
  }, []);

  // 退出登录函数
  const logout = useCallback(() => {
    try {
      setUser(null);
      setIsAuthenticated(false);
      setError(null);
      localStorage.removeItem('user');
      console.log('Logout successful');
    } catch (error) {
      console.error('Logout failed:', error);
      setError('退出登录失败');
    }
  }, []);

  // 检查用户是否具有特定角色
  const hasRole = useCallback((requiredRole) => {
    if (!user) return false;
    
    // 超级管理员有所有权限
    if (user.role === userRoles.SUPER_ADMIN) return true;
    
    // 管理员拥有编辑权限
    if (requiredRole === userRoles.EDITOR && user.role === userRoles.ADMIN) return true;
    
    return user.role === requiredRole;
  }, [user]);

  // 提供上下文值
  const contextValue = {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    hasRole
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 使用认证上下文的自定义Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;