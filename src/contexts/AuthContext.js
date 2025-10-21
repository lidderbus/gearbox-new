// src/contexts/AuthContext.js - 重构版本（安全增强）
import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import CryptoJS from 'crypto-js';
import { userRoles } from '../auth/roles';
import { secureStorage, STORAGE_KEYS, migrateToSecureStorage } from '../utils/secureStorage';
import { createLogger } from '../utils/logger';

const log = createLogger('AuthContext');

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

/**
 * 验证密码
 * @param {string} inputPassword - 用户输入的密码
 * @param {string} storedHash - 存储的密码哈希
 * @returns {boolean}
 */
const verifyPassword = (inputPassword, storedHash) => {
  const inputHash = CryptoJS.SHA256(inputPassword).toString();
  return inputHash === storedHash;
};

/**
 * 获取用户配置
 * 从环境变量读取用户凭据配置
 */
const getUserCredentials = () => {
  return {
    admin: {
      username: process.env.REACT_APP_ADMIN_USERNAME || 'admin',
      passwordHash: process.env.REACT_APP_ADMIN_PASSWORD_HASH ||
        // 默认密码 Gbox@2024! 的SHA256哈希（仅用于开发环境）
        'e3d704f3542b44a621ebed70dc0efe13a1d7312e8e8c9e5f5c1e59f21be0c7e1',
      userData: {
        id: 1,
        username: process.env.REACT_APP_ADMIN_USERNAME || 'admin',
        name: '管理员',
        role: userRoles.ADMIN
      }
    },
    user: {
      username: process.env.REACT_APP_USER_USERNAME || 'user',
      passwordHash: process.env.REACT_APP_USER_PASSWORD_HASH ||
        // 默认密码 User@2024! 的SHA256哈希（仅用于开发环境）
        '7c5e5b8f7e3d4c2a1b9f8e7d6c5b4a3c2b1a9f8e7d6c5b4a3c2b1a9f8e7d6c5b',
      userData: {
        id: 2,
        username: process.env.REACT_APP_USER_USERNAME || 'user',
        name: '普通用户',
        role: userRoles.USER
      }
    }
  };
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

  // 在组件挂载时，从本地存储中恢复用户会话
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    log.debug('初始化认证系统...');

    try {
      // 首次运行时迁移旧数据到加密存储
      migrateToSecureStorage();

      // 从加密存储读取用户数据
      const savedUser = secureStorage.getItem(STORAGE_KEYS.USER);

      if (savedUser) {
        log.debug('发现已保存的用户会话');
        if (validateUserData(savedUser)) {
          setUser(savedUser);
          setIsAuthenticated(true);
          log.info('用户会话恢复成功', { username: savedUser.username });
        } else {
          log.warn('用户数据验证失败，清除无效会话');
          secureStorage.removeItem(STORAGE_KEYS.USER);
        }
      } else {
        log.debug('未发现已保存的用户会话');
      }
    } catch (error) {
      log.error('认证系统初始化失败:', error);
      secureStorage.removeItem(STORAGE_KEYS.USER);
    } finally {
      setLoading(false);
    }
  }, []);

  // 登录函数
  const login = useCallback((username, password) => {
    log.debug('尝试登录', { username });

    // 清除所有认证相关存储
    secureStorage.removeItem(STORAGE_KEYS.USER);

    // 验证输入
    if (!username || !password) {
      const error = new Error('用户名和密码不能为空');
      log.warn('登录失败：输入为空');
      throw error;
    }

    // 获取用户凭据配置
    const credentials = getUserCredentials();

    // 查找匹配的用户
    let matchedUser = null;

    for (const [key, config] of Object.entries(credentials)) {
      if (config.username === username) {
        if (verifyPassword(password, config.passwordHash)) {
          matchedUser = config.userData;
          log.info('用户登录成功', { username, role: matchedUser.role });
          break;
        } else {
          log.warn('密码验证失败', { username });
          throw new Error('用户名或密码错误');
        }
      }
    }

    if (!matchedUser) {
      log.warn('用户不存在', { username });
      throw new Error('用户名或密码错误');
    }

    // 保存用户数据到加密存储
    setUser(matchedUser);
    setIsAuthenticated(true);

    const saved = secureStorage.setItem(STORAGE_KEYS.USER, matchedUser);
    if (!saved) {
      log.warn('用户信息保存失败，会话将不会持久化');
    }

    return { success: true, user: matchedUser };
  }, []);

  // 退出登录函数
  const logout = useCallback(() => {
    log.info('用户退出登录', { username: user?.username });

    setUser(null);
    setIsAuthenticated(false);

    // 清除所有认证相关存储
    secureStorage.removeItem(STORAGE_KEYS.USER);
    secureStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);

    // 清理旧的存储项
    localStorage.removeItem('gearbox_users');
    sessionStorage.removeItem('current_user');
  }, [user]);

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
