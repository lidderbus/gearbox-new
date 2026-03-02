/**
 * Sentry 错误监控配置
 *
 * 配置说明:
 * 1. 在生产环境中启用 Sentry 错误上报
 * 2. 自动捕获未处理的异常和 Promise rejection
 * 3. 收集性能数据和用户操作上下文
 *
 * 使用前请设置环境变量:
 *   REACT_APP_SENTRY_DSN=your-sentry-dsn
 */

import * as Sentry from '@sentry/react';

// Sentry DSN - 从环境变量获取
const SENTRY_DSN = process.env.REACT_APP_SENTRY_DSN;

// 是否为生产环境
const isProduction = process.env.NODE_ENV === 'production';

// 初始化 Sentry
export const initSentry = () => {
  // 只在有 DSN 且为生产环境时初始化
  if (!SENTRY_DSN) {
    console.log('Sentry: DSN未配置，跳过初始化');
    return;
  }

  try {
    Sentry.init({
      dsn: SENTRY_DSN,

      // 环境标识
      environment: process.env.NODE_ENV || 'development',

      // 版本标识 (可从 package.json 获取)
      release: `gearbox-app@${process.env.REACT_APP_VERSION || '9.0.0'}`,

      // 采样率 (生产环境收集10%的事务)
      tracesSampleRate: isProduction ? 0.1 : 1.0,

      // 错误采样率 (收集所有错误)
      sampleRate: 1.0,

      // 忽略的错误
      ignoreErrors: [
        // 忽略网络错误
        'Network Error',
        'Failed to fetch',
        'Load failed',
        // 忽略 ResizeObserver 错误
        'ResizeObserver loop',
        // 忽略脚本加载错误
        /Loading chunk \d+ failed/,
        // 忽略用户取消操作
        'AbortError',
      ],

      // 敏感数据处理
      beforeSend(event) {
        // 过滤敏感信息
        if (event.request && event.request.headers) {
          delete event.request.headers.Authorization;
          delete event.request.headers.Cookie;
        }

        // 过滤本地开发错误
        if (!isProduction && event.exception) {
          console.log('Sentry (dev): 捕获错误', event.exception);
          return null; // 开发环境不发送
        }

        return event;
      },

      // 面包屑处理
      beforeBreadcrumb(breadcrumb) {
        // 过滤敏感的控制台日志
        if (breadcrumb.category === 'console' && breadcrumb.level === 'debug') {
          return null;
        }
        return breadcrumb;
      },
    });

    console.log('Sentry: 初始化成功');
  } catch (error) {
    console.error('Sentry: 初始化失败', error);
  }
};

// 手动上报错误
export const captureError = (error, context = {}) => {
  if (SENTRY_DSN) {
    Sentry.captureException(error, {
      extra: context,
    });
  } else {
    console.error('错误 (Sentry未配置):', error, context);
  }
};

// 设置用户上下文
export const setUserContext = (user) => {
  if (SENTRY_DSN && user) {
    Sentry.setUser({
      id: user.id,
      username: user.username,
      // 注意: 不要发送敏感信息如邮箱
    });
  }
};

// 清除用户上下文
export const clearUserContext = () => {
  Sentry.setUser(null);
};

// 添加自定义标签
export const setTag = (key, value) => {
  Sentry.setTag(key, value);
};

// 添加额外上下文
export const setContext = (name, context) => {
  Sentry.setContext(name, context);
};

// 导出 Sentry ErrorBoundary 组件
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// 导出 Sentry 用于高级用法
export { Sentry };

export default {
  init: initSentry,
  captureError,
  setUserContext,
  clearUserContext,
  setTag,
  setContext,
  ErrorBoundary: SentryErrorBoundary,
};
