/**
 * AuthContext 单元测试
 * 测试认证系统功能
 */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { renderHook, act } from '@testing-library/react';
import { AuthProvider, useAuth } from '../AuthContext';
import { userRoles } from '../../auth/roles';
import * as secureStorageModule from '../../utils/secureStorage';

// Mock secureStorage
jest.mock('../../utils/secureStorage', () => ({
  secureStorage: {
    setItem: jest.fn(() => true),
    getItem: jest.fn(() => null),
    removeItem: jest.fn(),
  },
  STORAGE_KEYS: {
    USER: 'user',
    AUTH_TOKEN: 'auth_token',
  },
  migrateToSecureStorage: jest.fn(),
}));

// Mock logger
jest.mock('../../utils/logger', () => ({
  createLogger: () => ({
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  }),
}));

describe('AuthContext - 认证系统', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  describe('AuthProvider 初始化', () => {
    test('应该能正常渲染', () => {
      const { container } = render(
        <AuthProvider>
          <div>Test Content</div>
        </AuthProvider>
      );

      expect(container).toBeTruthy();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    test('应该在初始化时调用数据迁移', () => {
      render(
        <AuthProvider>
          <div>Test</div>
        </AuthProvider>
      );

      expect(secureStorageModule.migrateToSecureStorage).toHaveBeenCalled();
    });

    test('初始化时应该尝试恢复用户会话', () => {
      const mockUser = {
        id: 1,
        username: 'admin',
        name: '管理员',
        role: userRoles.ADMIN,
      };

      secureStorageModule.secureStorage.getItem.mockReturnValue(mockUser);

      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      waitFor(() => {
        expect(result.current.user).toEqual(mockUser);
        expect(result.current.isAuthenticated).toBe(true);
      });
    });
  });

  describe('登录功能', () => {
    test('使用正确的管理员凭据应该登录成功', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        const loginResult = result.current.login('admin', 'Gbox@2024!');
        expect(loginResult.success).toBe(true);
        expect(loginResult.user.username).toBe('admin');
        expect(loginResult.user.role).toBe(userRoles.ADMIN);
      });

      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user.username).toBe('admin');
    });

    test('使用正确的普通用户凭据应该登录成功', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        const loginResult = result.current.login('user', 'User@2024!');
        expect(loginResult.success).toBe(true);
        expect(loginResult.user.username).toBe('user');
        expect(loginResult.user.role).toBe(userRoles.USER);
      });

      expect(result.current.isAuthenticated).toBe(true);
    });

    test('使用错误的密码应该登录失败', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(() => {
        act(() => {
          result.current.login('admin', 'wrongpassword');
        });
      }).toThrow('用户名或密码错误');

      expect(result.current.isAuthenticated).toBe(false);
    });

    test('使用不存在的用户名应该登录失败', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(() => {
        act(() => {
          result.current.login('nonexistent', 'password');
        });
      }).toThrow('用户名或密码错误');
    });

    test('空用户名或密码应该抛出错误', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(() => {
        act(() => {
          result.current.login('', 'password');
        });
      }).toThrow('用户名和密码不能为空');

      expect(() => {
        act(() => {
          result.current.login('admin', '');
        });
      }).toThrow('用户名和密码不能为空');
    });

    test('登录成功应该保存用户数据到加密存储', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login('admin', 'Gbox@2024!');
      });

      expect(secureStorageModule.secureStorage.setItem).toHaveBeenCalledWith(
        'user',
        expect.objectContaining({
          username: 'admin',
          role: userRoles.ADMIN,
        })
      );
    });
  });

  describe('登出功能', () => {
    test('登出应该清除用户状态', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      // 先登录
      act(() => {
        result.current.login('admin', 'Gbox@2024!');
      });

      expect(result.current.isAuthenticated).toBe(true);

      // 再登出
      act(() => {
        result.current.logout();
      });

      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });

    test('登出应该清除存储的用户数据', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login('admin', 'Gbox@2024!');
        result.current.logout();
      });

      expect(secureStorageModule.secureStorage.removeItem).toHaveBeenCalledWith('user');
      expect(secureStorageModule.secureStorage.removeItem).toHaveBeenCalledWith('auth_token');
    });
  });

  describe('角色权限检查', () => {
    test('管理员应该有管理员角色', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login('admin', 'Gbox@2024!');
      });

      expect(result.current.hasRole(userRoles.ADMIN)).toBe(true);
    });

    test('普通用户不应该有管理员角色', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      act(() => {
        result.current.login('user', 'User@2024!');
      });

      expect(result.current.hasRole(userRoles.ADMIN)).toBe(false);
      expect(result.current.hasRole(userRoles.USER)).toBe(true);
    });

    test('未登录用户应该没有任何角色', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current.hasRole(userRoles.USER)).toBe(false);
      expect(result.current.hasRole(userRoles.ADMIN)).toBe(false);
    });
  });

  describe('useAuth Hook', () => {
    test('在AuthProvider外使用应该抛出错误', () => {
      // 抑制错误输出
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      expect(() => {
        renderHook(() => useAuth());
      }).toThrow('useAuth必须在AuthProvider内部使用');

      consoleSpy.mockRestore();
    });

    test('应该提供所有必要的属性和方法', () => {
      const wrapper = ({ children }) => <AuthProvider>{children}</AuthProvider>;
      const { result } = renderHook(() => useAuth(), { wrapper });

      expect(result.current).toHaveProperty('user');
      expect(result.current).toHaveProperty('isAuthenticated');
      expect(result.current).toHaveProperty('loading');
      expect(result.current).toHaveProperty('error');
      expect(result.current).toHaveProperty('login');
      expect(result.current).toHaveProperty('logout');
      expect(result.current).toHaveProperty('hasRole');
      expect(result.current).toHaveProperty('currentUser');
    });
  });
});
