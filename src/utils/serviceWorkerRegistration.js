// src/utils/serviceWorkerRegistration.js
// PWA Service Worker 注册和管理

/**
 * 检查是否支持 Service Worker
 */
const isSupported = () => {
  return 'serviceWorker' in navigator;
};

/**
 * 注册 Service Worker
 * @param {Object} options - 配置选项
 * @returns {Promise<ServiceWorkerRegistration|null>}
 */
export const register = async (options = {}) => {
  if (!isSupported()) {
    console.log('[SW] Service Worker not supported');
    return null;
  }

  // 仅在生产环境注册（可配置）
  if (process.env.NODE_ENV !== 'production' && !options.forceRegister) {
    console.log('[SW] Skipping registration in development');
    return null;
  }

  try {
    const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
    const registration = await navigator.serviceWorker.register(swUrl, {
      scope: process.env.PUBLIC_URL || '/'
    });

    console.log('[SW] Service Worker registered:', registration.scope);

    // 监听更新
    registration.addEventListener('updatefound', () => {
      const installingWorker = registration.installing;
      if (!installingWorker) return;

      installingWorker.addEventListener('statechange', () => {
        if (installingWorker.state === 'installed') {
          if (navigator.serviceWorker.controller) {
            // 有新版本可用
            console.log('[SW] New version available');
            options.onUpdate?.(registration);
          } else {
            // 首次安装完成
            console.log('[SW] Content is cached for offline use');
            options.onSuccess?.(registration);
          }
        }
      });
    });

    // 检查是否有等待中的 worker
    if (registration.waiting) {
      options.onUpdate?.(registration);
    }

    return registration;
  } catch (error) {
    console.warn('[SW] Registration failed:', error);
    options.onError?.(error);
    return null;
  }
};

/**
 * 注销 Service Worker
 */
export const unregister = async () => {
  if (!isSupported()) {
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.ready;
    await registration.unregister();
    console.log('[SW] Service Worker unregistered');
    return true;
  } catch (error) {
    console.warn('[SW] Unregister failed:', error);
    return false;
  }
};

/**
 * 跳过等待，立即激活新版本
 */
export const skipWaiting = async () => {
  const registration = await navigator.serviceWorker.ready;
  if (registration.waiting) {
    registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    window.location.reload();
  }
};

/**
 * 清除所有缓存
 */
export const clearCache = async () => {
  if (!isSupported()) {
    return false;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.success);
    };

    navigator.serviceWorker.controller?.postMessage(
      { type: 'CLEAR_CACHE' },
      [messageChannel.port2]
    );

    // 超时处理
    setTimeout(() => resolve(false), 5000);
  });
};

/**
 * 获取缓存大小信息
 */
export const getCacheSize = async () => {
  if (!isSupported() || !navigator.serviceWorker.controller) {
    return null;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.size);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'GET_CACHE_SIZE' },
      [messageChannel.port2]
    );

    // 超时处理
    setTimeout(() => resolve(null), 5000);
  });
};

/**
 * 更新数据缓存
 */
export const updateDataCache = async () => {
  if (!isSupported() || !navigator.serviceWorker.controller) {
    return false;
  }

  return new Promise((resolve) => {
    const messageChannel = new MessageChannel();
    messageChannel.port1.onmessage = (event) => {
      resolve(event.data.success);
    };

    navigator.serviceWorker.controller.postMessage(
      { type: 'UPDATE_DATA_CACHE' },
      [messageChannel.port2]
    );

    // 超时处理
    setTimeout(() => resolve(false), 10000);
  });
};

/**
 * PWA 管理器
 */
export const PWAManager = {
  isSupported,
  register,
  unregister,
  skipWaiting,
  clearCache,
  getCacheSize,
  updateDataCache,

  /**
   * 检查是否处于 PWA 模式
   */
  isPWAMode: () => {
    return window.matchMedia('(display-mode: standalone)').matches ||
           window.navigator.standalone === true;
  },

  /**
   * 获取 PWA 状态
   */
  getStatus: async () => {
    if (!isSupported()) {
      return { supported: false };
    }

    const registration = await navigator.serviceWorker.getRegistration();
    const cacheSize = await getCacheSize();

    return {
      supported: true,
      registered: !!registration,
      active: !!registration?.active,
      waiting: !!registration?.waiting,
      isPWAMode: PWAManager.isPWAMode(),
      cacheSize
    };
  }
};

export default {
  register,
  unregister,
  skipWaiting,
  clearCache,
  getCacheSize,
  updateDataCache,
  PWAManager
};
