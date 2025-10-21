// src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
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
  const [error] = useState(null);

  // 使用ref标记初始化状态，避免重复清除数据
  const initialized = useRef(false);

  // 在组件挂载时，从本地存储中恢复用户会话 - 使用useEffect和ref避免重复执行
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    try {
      // 清除所有可能的旧存储数据，确保没有冲突
      localStorage.removeItem('gearbox_users');
      sessionStorage.removeItem('current_user');

      const savedUser = localStorage.getItem('user');

      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          if (validateUserData(parsedUser)) {
            setUser(parsedUser);
            setIsAuthenticated(true);
          } else {
            localStorage.removeItem('user');
          }
        } catch (e) {
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  }, []);

  // 登录函数 - 同步版本，不使用Promise和延迟
  const login = useCallback((username, password) => {
    // 清除所有本地存储数据
    localStorage.removeItem('user');
    localStorage.removeItem('gearbox_users');
    sessionStorage.removeItem('current_user');

    // 验证用户名和密码
    if (!username || !password) {
      throw new Error('用户名和密码不能为空');
    }

    // 验证凭据
    let userData = null;

    if (username === 'admin' && password === 'Gbox@2024!') {
      userData = {
        id: 1,
        username: 'admin',
        name: '管理员',
        role: userRoles.ADMIN
      };
    } else if (username === 'user' && password === 'User@2024!') {
      userData = {
        id: 2,
        username: 'user',
        name: '普通用户',
        role: userRoles.USER
      };
    } else {
      throw new Error('用户名或密码错误');
    }

    // 保存用户数据
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (e) {
      console.warn('无法保存用户信息到本地存储');
    }

    return { success: true, user: userData };
  }, []);

  // 退出登录函数
  const logout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('gearbox_users');
    sessionStorage.removeItem('current_user');
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
    hasRole,
    currentUser: user // 添加currentUser属性，保持与LoginPage组件兼容
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
    throw new Error('useAuth必须在AuthProvider内部使用');
  }
  return context;
};

export default AuthContext;
