// src/contexts/__tests__/AuthContext.test.js
// v2 兼容: PBKDF2 + 用户名复合 salt + 删 fallback hash
// AuthContext 在 login() 时才读 process.env, 因此动态切换 env 即可, 无需 resetModules
import React from 'react';
import { render, screen, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';

jest.mock('crypto-js', () => ({
  PBKDF2: jest.fn(),
  SHA256: jest.fn(),
  AES: { encrypt: jest.fn(), decrypt: jest.fn() },
  lib: { WordArray: { random: jest.fn() } },
  enc: { Utf8: 'utf8' },
  algo: { SHA256: 'SHA256' }
}));

import CryptoJS from 'crypto-js';
import { AuthProvider, useAuth } from '../AuthContext';

const mkWord = (str) => ({ toString: () => str });
const installCryptoMocks = () => {
  CryptoJS.PBKDF2.mockImplementation((password, salt) => mkWord(`pbkdf2(${password}|${salt})`));
  CryptoJS.SHA256.mockImplementation((str) => mkWord(`sha256(${str})`));
  CryptoJS.AES.encrypt.mockImplementation((data) => mkWord(`enc:${data}`));
  CryptoJS.AES.decrypt.mockImplementation((cipher) => {
    const m = String(cipher).match(/^enc:(.*)$/s);
    return mkWord(m ? m[1] : '');
  });
  CryptoJS.lib.WordArray.random.mockImplementation(() => mkWord('random_key'));
};

const TestConsumer = ({ onMount }) => {
  const auth = useAuth();
  React.useEffect(() => {
    if (onMount) onMount(auth);
  }, [auth, onMount]);
  return (
    <div>
      <span data-testid="isAuthenticated">{String(auth.isAuthenticated)}</span>
      <span data-testid="loading">{String(auth.loading)}</span>
      <span data-testid="username">{auth.user?.username || 'none'}</span>
    </div>
  );
};

const renderWithProvider = (onMount) =>
  render(
    <AuthProvider>
      <TestConsumer onMount={onMount} />
    </AuthProvider>
  );

const setEnv = (env) => {
  process.env.REACT_APP_AUTH_SALT = env.salt ?? 'salt-abc';
  process.env.REACT_APP_ADMIN_HASH = env.adminHash ?? 'pbkdf2(adminpw|salt-abc:admin)';
  process.env.REACT_APP_USER_HASH = env.userHash ?? 'pbkdf2(userpw|salt-abc:user)';
};

const clearEnv = () => {
  delete process.env.REACT_APP_AUTH_SALT;
  delete process.env.REACT_APP_ADMIN_HASH;
  delete process.env.REACT_APP_USER_HASH;
};

describe('AuthContext (v2 PBKDF2 + 删 fallback)', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
    installCryptoMocks();
    clearEnv();
    setEnv({});
  });

  afterEach(() => {
    clearEnv();
  });

  describe('AuthProvider 基础', () => {
    it('未登录时默认非认证', async () => {
      renderWithProvider();
      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });
      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('username').textContent).toBe('none');
    });
  });

  describe('useAuth hook', () => {
    it('在 Provider 外抛错', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});
      const Outsider = () => {
        useAuth();
        return null;
      };
      expect(() => render(<Outsider />)).toThrow('useAuth必须在AuthProvider内部使用');
      consoleError.mockRestore();
    });

    it('暴露 login/logout/hasRole', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());
      expect(typeof authContext.login).toBe('function');
      expect(typeof authContext.logout).toBe('function');
      expect(typeof authContext.hasRole).toBe('function');
    });
  });

  describe('login 输入校验', () => {
    it('用户名为空抛错', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());
      expect(() => authContext.login('', 'pw')).toThrow('用户名和密码不能为空');
    });

    it('密码为空抛错', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());
      expect(() => authContext.login('admin', '')).toThrow('用户名和密码不能为空');
    });
  });

  describe('环境变量缺失硬阻断 (v2 删 fallback)', () => {
    it('缺 AUTH_SALT 时 login 抛错', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());
      delete process.env.REACT_APP_AUTH_SALT;
      expect(() => authContext.login('admin', 'pw')).toThrow(/REACT_APP_AUTH_SALT/);
    });

    it('缺 ADMIN_HASH/USER_HASH 时 login 抛错', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());
      delete process.env.REACT_APP_ADMIN_HASH;
      delete process.env.REACT_APP_USER_HASH;
      expect(() => authContext.login('admin', 'pw')).toThrow(/REACT_APP_ADMIN_HASH/);
    });
  });

  describe('正确密码登录成功 (PBKDF2 + 用户名复合 salt)', () => {
    it('admin 哈希匹配则登录成功并加密存 sessionStorage', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());

      let result;
      act(() => {
        result = authContext.login('admin', 'adminpw');
      });
      expect(result.success).toBe(true);
      expect(result.user.username).toBe('admin');
      const stored = sessionStorage.getItem('gearbox_auth_session');
      expect(stored).toBeTruthy();
      expect(stored).toMatch(/^enc:/);
    });

    it('user 哈希匹配则登录成功', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());

      let result;
      act(() => {
        result = authContext.login('user', 'userpw');
      });
      expect(result.success).toBe(true);
      expect(result.user.username).toBe('user');
    });
  });

  describe('错误密码登录失败', () => {
    it('密码哈希不匹配抛错', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());
      expect(() => authContext.login('admin', 'wrong')).toThrow(/用户名或密码错误/);
    });

    it('未知用户名抛错', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());
      expect(() => authContext.login('attacker', 'pw')).toThrow(/用户名或密码错误/);
    });
  });

  describe('logout 清理', () => {
    it('登出后清掉 sessionStorage 与 _ek', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());

      act(() => { authContext.login('admin', 'adminpw'); });
      expect(sessionStorage.getItem('gearbox_auth_session')).toBeTruthy();

      act(() => { authContext.logout(); });
      expect(sessionStorage.getItem('gearbox_auth_session')).toBeNull();
      expect(sessionStorage.getItem('_ek')).toBeNull();
    });
  });

  describe('context value 结构', () => {
    it('暴露 user/isAuthenticated/loading/error/login/logout/hasRole/currentUser', async () => {
      let authContext;
      renderWithProvider((auth) => { authContext = auth; });
      await waitFor(() => expect(authContext).toBeDefined());
      ['user', 'isAuthenticated', 'loading', 'error', 'login', 'logout', 'hasRole', 'currentUser']
        .forEach((k) => expect(authContext).toHaveProperty(k));
    });
  });
});
