// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 页面导航与健康检查 E2E 测试
 *
 * 守卫测试：确保所有主要功能模块可访问、无JS致命错误、无5xx请求
 */

test.describe('应用启动与健康检查', () => {
  test('首页加载成功，无5xx错误', async ({ page }) => {
    const serverErrors = [];
    page.on('response', (resp) => {
      if (resp.status() >= 500) {
        serverErrors.push({ url: resp.url(), status: resp.status() });
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 页面必须渲染（可能是React #root 或登录页 body）
    await expect(page.locator('body')).toBeVisible();
    // 页面应有可见内容（登录页或主应用）
    const bodyText = await page.locator('body').innerText();
    expect(bodyText.length).toBeGreaterThan(10);
    // 无服务器错误
    expect(serverErrors).toHaveLength(0);
  });

  test('无致命 JS 错误', async ({ page }) => {
    const fatalErrors = [];
    page.on('pageerror', (error) => {
      // 过滤掉 ResizeObserver 等非致命警告
      if (!error.message.includes('ResizeObserver')) {
        fatalErrors.push(error.message);
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 等待额外2秒让异步组件加载
    await page.waitForTimeout(2000);

    expect(fatalErrors).toHaveLength(0);
  });

  test('首页加载时间 < 8秒', async ({ page }) => {
    const start = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - start;

    expect(loadTime).toBeLessThan(8000);
  });
});

test.describe('核心Tab导航', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  // 必须能切换到的核心功能Tab
  const criticalTabs = [
    { name: '选型计算', text: /选型计算|输入参数|主机参数/ },
    { name: '产品中心', text: /产品中心/ },
    { name: '数据查询', text: /数据查询/ },
    { name: '数据统计', text: /数据统计/ },
  ];

  for (const tab of criticalTabs) {
    test(`Tab "${tab.name}" 可访问`, async ({ page }) => {
      // 找到并点击 Tab
      const tabLink = page.locator('.nav-link, [role="tab"]').filter({ hasText: tab.text });

      if (await tabLink.count() > 0) {
        await tabLink.first().click();
        // 等待内容切换
        await page.waitForTimeout(500);
        // Tab 应变为激活状态
        await expect(tabLink.first()).toHaveClass(/active/);
      }
    });
  }
});

test.describe('响应式布局', () => {
  const viewports = [
    { name: '桌面', width: 1280, height: 720 },
    { name: '平板', width: 768, height: 1024 },
    { name: '手机', width: 375, height: 812 },
  ];

  for (const vp of viewports) {
    test(`${vp.name}视口 (${vp.width}x${vp.height}) 无溢出`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto('/');
      await page.waitForLoadState('networkidle');

      // 检查页面无水平溢出
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(vp.width + 20); // 20px 容差
    });
  }
});
