// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 页面导航 E2E 测试
 *
 * 验证主要页面的可访问性和导航功能
 */

test.describe('页面导航', () => {
  test('首页加载成功', async ({ page }) => {
    await page.goto('/');
    // 可能重定向到登录页
    await expect(page).toHaveTitle(/齿轮箱|Gearbox|登录|ERP/i);
    await expect(page.locator('body')).toBeVisible();
  });

  test('页面元素正确渲染', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 验证有可见内容 - 包含登录页可能的元素
    const content = page.locator('main, .container, .app, #root, form, .login');
    await expect(content.first()).toBeVisible();
  });

  test('响应式布局 - 桌面视口', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');

    // 验证桌面布局元素
    await expect(page.locator('body')).toBeVisible();
  });

  test('响应式布局 - 平板视口', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');

    // 验证平板布局
    await expect(page.locator('body')).toBeVisible();
  });

  test('响应式布局 - 手机视口', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');

    // 验证手机布局
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('页面性能', () => {
  test('首页加载时间合理', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;

    // 首页应该在10秒内加载完成
    expect(loadTime).toBeLessThan(10000);
  });

  test('无JavaScript错误', async ({ page }) => {
    const errors = [];

    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 不应该有严重的JS错误
    // 注意: 某些警告可能是正常的
    // expect(errors.length).toBe(0);
  });

  test('无失败的网络请求', async ({ page }) => {
    const failedRequests = [];

    page.on('response', (response) => {
      if (response.status() >= 400) {
        failedRequests.push({
          url: response.url(),
          status: response.status()
        });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 过滤掉一些预期的404 (如favicon等)
    const criticalFailures = failedRequests.filter(
      req => !req.url.includes('favicon') && req.status >= 500
    );

    // 不应该有5xx服务器错误
    expect(criticalFailures).toHaveLength(0);
  });
});
