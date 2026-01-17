// public/service-worker.js
// PWA Service Worker - 离线支持和缓存管理

const CACHE_NAME = 'gearbox-app-v1';
const DATA_CACHE_NAME = 'gearbox-data-v1';

// 需要缓存的静态资源
const STATIC_ASSETS = [
  '/gearbox-app/',
  '/gearbox-app/index.html',
  '/gearbox-app/manifest.json'
];

// 数据文件（单独缓存，便于更新）
const DATA_ASSETS = [
  '/complete_gearbox_data.js',
  '/gearbox-app/price-version.json'
];

// 图片路径模式
const IMAGE_PATTERN = /\/images\/gearbox\//;

/**
 * 安装事件 - 缓存静态资源
 */
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Install');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        // 静态资源使用 addAll（失败会中断）
        return cache.addAll(STATIC_ASSETS).catch(err => {
          console.warn('[ServiceWorker] Some static assets failed to cache:', err);
        });
      })
      .then(() => {
        // 数据资源单独处理（失败不中断）
        return caches.open(DATA_CACHE_NAME).then(cache => {
          return Promise.all(
            DATA_ASSETS.map(url =>
              fetch(url)
                .then(response => {
                  if (response.ok) {
                    return cache.put(url, response);
                  }
                })
                .catch(() => {
                  console.warn('[ServiceWorker] Failed to cache data:', url);
                })
            )
          );
        });
      })
      .then(() => {
        // 跳过等待，立即激活
        return self.skipWaiting();
      })
  );
});

/**
 * 激活事件 - 清理旧缓存
 */
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activate');

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // 删除旧版本缓存
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('[ServiceWorker] Removing old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      // 接管所有页面
      return self.clients.claim();
    })
  );
});

/**
 * 请求拦截 - 缓存优先策略
 */
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 只处理同源请求
  if (url.origin !== location.origin) {
    return;
  }

  // 跳过非 GET 请求
  if (event.request.method !== 'GET') {
    return;
  }

  // API 请求 - 网络优先
  if (url.pathname.includes('/api/')) {
    event.respondWith(networkFirst(event.request));
    return;
  }

  // 数据文件 - 网络优先，但有缓存回退
  if (DATA_ASSETS.some(asset => url.pathname.endsWith(asset) || url.pathname.includes(asset))) {
    event.respondWith(networkFirst(event.request, DATA_CACHE_NAME));
    return;
  }

  // 图片 - 缓存优先
  if (IMAGE_PATTERN.test(url.pathname) || url.pathname.endsWith('.webp') || url.pathname.endsWith('.png')) {
    event.respondWith(cacheFirst(event.request));
    return;
  }

  // 其他资源 - 缓存优先
  event.respondWith(cacheFirst(event.request));
});

/**
 * 缓存优先策略
 */
async function cacheFirst(request) {
  try {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }

    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[ServiceWorker] Cache-first failed:', request.url, error);
    // 返回离线页面或占位符
    return caches.match('/gearbox-app/index.html');
  }
}

/**
 * 网络优先策略
 */
async function networkFirst(request, cacheName = CACHE_NAME) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.warn('[ServiceWorker] Network-first fallback to cache:', request.url);
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    throw error;
  }
}

/**
 * 消息处理 - 用于手动控制缓存
 */
self.addEventListener('message', (event) => {
  const { type, payload } = event.data || {};

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;

    case 'CLEAR_CACHE':
      event.waitUntil(
        caches.keys().then(names => {
          return Promise.all(names.map(name => caches.delete(name)));
        }).then(() => {
          event.ports[0].postMessage({ success: true });
        })
      );
      break;

    case 'GET_CACHE_SIZE':
      event.waitUntil(
        getCacheSize().then(size => {
          event.ports[0].postMessage({ size });
        })
      );
      break;

    case 'UPDATE_DATA_CACHE':
      event.waitUntil(
        updateDataCache().then(() => {
          event.ports[0].postMessage({ success: true });
        })
      );
      break;
  }
});

/**
 * 获取缓存大小
 */
async function getCacheSize() {
  if ('storage' in navigator && 'estimate' in navigator.storage) {
    const estimate = await navigator.storage.estimate();
    return {
      usage: estimate.usage,
      quota: estimate.quota,
      usageInMB: Math.round(estimate.usage / 1024 / 1024 * 100) / 100
    };
  }
  return null;
}

/**
 * 更新数据缓存
 */
async function updateDataCache() {
  const cache = await caches.open(DATA_CACHE_NAME);

  for (const url of DATA_ASSETS) {
    try {
      const response = await fetch(url, { cache: 'no-cache' });
      if (response.ok) {
        await cache.put(url, response);
        console.log('[ServiceWorker] Updated data cache:', url);
      }
    } catch (error) {
      console.warn('[ServiceWorker] Failed to update data:', url, error);
    }
  }
}

/**
 * 后台同步（如果支持）
 */
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-data') {
    event.waitUntil(updateDataCache());
  }
});

console.log('[ServiceWorker] Script loaded');
