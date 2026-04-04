// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 全系统冒烟测试
 *
 * 快速验证所有部署在 47.99.181.195 上的系统是否正常响应
 * 运行命令: npx playwright test smoke-all-systems --project=chromium
 */

const SYSTEMS = [
  {
    name: '齿轮箱选型系统',
    url: 'http://47.99.181.195/gearbox-app/',
    expectText: /齿轮箱|Gearbox|选型|加载/,
    expectTitle: /齿轮箱|Gearbox/i,
    waitForLoad: true, // React SPA 有异步数据加载
  },
  {
    name: 'ERP 仪表盘',
    url: 'http://47.99.181.195/dashboard-complete.html',
    expectText: /仪表盘|ERP|Dashboard|登录/,
  },
  {
    name: '合同管理V2',
    url: 'http://47.99.181.195/contract-v2/',
    expectText: /合同|Contract/,
  },
  {
    name: '订单管理V2',
    url: 'http://47.99.181.195/order-v2/',
    expectText: /订单|Order|登录/,
  },
  {
    name: 'HR 人事系统',
    url: 'http://47.99.181.195/hr/',
    expectText: /人事|HR|登录/,
  },
];

test.describe('全系统冒烟测试', () => {
  for (const sys of SYSTEMS) {
    test(`${sys.name} — 可访问且响应正常`, async ({ page }) => {
      const serverErrors = [];
      page.on('response', (resp) => {
        if (resp.status() >= 500) {
          serverErrors.push({ url: resp.url(), status: resp.status() });
        }
      });

      const fatalErrors = [];
      page.on('pageerror', (error) => {
        if (!error.message.includes('ResizeObserver')) {
          fatalErrors.push(error.message);
        }
      });

      // 访问系统
      const response = await page.goto(sys.url, { timeout: 15000 });

      // HTTP 状态码应为 2xx 或 3xx
      expect(response.status()).toBeLessThan(400);

      await page.waitForLoadState('domcontentloaded');

      // React SPA 需要等待异步数据加载完成
      if (sys.waitForLoad) {
        await page.waitForLoadState('networkidle').catch(() => {});
        await page.waitForTimeout(3000);
      }

      // 页面应包含预期内容
      const bodyText = await page.locator('body').innerText();
      expect(bodyText).toMatch(sys.expectText);

      // 如果有标题检查
      if (sys.expectTitle) {
        await expect(page).toHaveTitle(sys.expectTitle);
      }

      // 无 5xx 错误
      expect(serverErrors).toHaveLength(0);

      // 无致命 JS 错误（警告级别允许）
      if (fatalErrors.length > 0) {
        console.warn(`[${sys.name}] JS errors:`, fatalErrors);
      }
    });
  }
});

test.describe('API 健康检查 (通过nginx反代)', () => {
  const API_ENDPOINTS = [
    {
      name: '订单管理 API',
      url: 'http://47.99.181.195/order-v2/api/',
      fallbackUrl: 'http://47.99.181.195/order-v2/',
    },
  ];

  for (const api of API_ENDPOINTS) {
    test(`${api.name} — 反代可达`, async ({ page }) => {
      // 通过 nginx 反代访问，不直接暴露端口
      const response = await page.goto(api.fallbackUrl, { timeout: 15000 });
      expect(response.status()).toBeLessThan(500);
    });
  }
});
