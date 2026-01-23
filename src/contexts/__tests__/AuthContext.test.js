// src/contexts/__tests__/AuthContext.test.js
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '../AuthContext';

// Mock crypto-js
jest.mock('crypto-js', () => ({
  SHA256: jest.fn((str) => ({
    toString: () => `hashed_${str}`
  })),
  AES: {
    encrypt: jest.fn((data) => ({
      toString: () => `encrypted_${data}`
    })),
    decrypt: jest.fn(() => ({
      toString: jest.fn(() => '')
    }))
  },
  lib: {
    WordArray: {
      random: jest.fn(() => ({
        toString: () => 'random_key'
      }))
    }
  },
  enc: {
    Utf8: 'utf8'
  }
}));

// Test consumer component
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

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('AuthProvider', () => {
    it('renders children', () => {
      render(
        <AuthProvider>
          <div data-testid="child">Child content</div>
        </AuthProvider>
      );

      expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('provides default unauthenticated state', async () => {
      render(
        <AuthProvider>
          <TestConsumer />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(screen.getByTestId('loading').textContent).toBe('false');
      });

      expect(screen.getByTestId('isAuthenticated').textContent).toBe('false');
      expect(screen.getByTestId('username').textContent).toBe('none');
    });
  });

  describe('useAuth hook', () => {
    it('throws error when used outside AuthProvider', () => {
      const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {});

      expect(() => {
        render(<TestConsumer />);
      }).toThrow('useAuth必须在AuthProvider内部使用');

      consoleError.mockRestore();
    });

    it('provides login function', async () => {
      let authContext;
      render(
        <AuthProvider>
          <TestConsumer onMount={(auth) => { authContext = auth; }} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext).toBeDefined();
      });

      expect(typeof authContext.login).toBe('function');
    });

    it('provides logout function', async () => {
      let authContext;
      render(
        <AuthProvider>
          <TestConsumer onMount={(auth) => { authContext = auth; }} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext).toBeDefined();
      });

      expect(typeof authContext.logout).toBe('function');
    });

    it('provides hasRole function', async () => {
      let authContext;
      render(
        <AuthProvider>
          <TestConsumer onMount={(auth) => { authContext = auth; }} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext).toBeDefined();
      });

      expect(typeof authContext.hasRole).toBe('function');
    });
  });

  describe('login validation', () => {
    it('throws error for empty username', async () => {
      let authContext;
      render(
        <AuthProvider>
          <TestConsumer onMount={(auth) => { authContext = auth; }} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext).toBeDefined();
      });

      expect(() => {
        authContext.login('', 'password');
      }).toThrow('用户名和密码不能为空');
    });

    it('throws error for empty password', async () => {
      let authContext;
      render(
        <AuthProvider>
          <TestConsumer onMount={(auth) => { authContext = auth; }} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext).toBeDefined();
      });

      expect(() => {
        authContext.login('admin', '');
      }).toThrow('用户名和密码不能为空');
    });
  });

  describe('context value structure', () => {
    it('provides all expected properties', async () => {
      let authContext;
      render(
        <AuthProvider>
          <TestConsumer onMount={(auth) => { authContext = auth; }} />
        </AuthProvider>
      );

      await waitFor(() => {
        expect(authContext).toBeDefined();
      });

      expect(authContext).toHaveProperty('user');
      expect(authContext).toHaveProperty('isAuthenticated');
      expect(authContext).toHaveProperty('loading');
      expect(authContext).toHaveProperty('error');
      expect(authContext).toHaveProperty('login');
      expect(authContext).toHaveProperty('logout');
      expect(authContext).toHaveProperty('hasRole');
      expect(authContext).toHaveProperty('currentUser');
    });
  });
});
