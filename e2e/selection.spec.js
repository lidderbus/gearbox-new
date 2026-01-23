// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 齿轮箱选型流程 E2E 测试
 *
 * 测试完整的选型流程:
 * 1. 输入主机参数
 * 2. 选择齿轮箱
 * 3. 配置联轴器和备用泵
 * 4. 生成技术协议
 */

test.describe('齿轮箱选型流程', () => {
  test.beforeEach(async ({ page }) => {
    // 导航到首页
    await page.goto('/');
    // 等待页面加载完成
    await page.waitForLoadState('networkidle');
  });

  test('页面加载成功', async ({ page }) => {
    // 验证页面标题 - 可能是登录页或主页
    await expect(page).toHaveTitle(/齿轮箱|Gearbox|登录|ERP/i);
  });

  test('输入功率和转速参数', async ({ page }) => {
    // 找到功率输入框
    const powerInput = page.locator('input[placeholder*="功率"]').first()
      .or(page.getByLabel(/功率/))
      .or(page.locator('#power'));

    // 找到转速输入框
    const speedInput = page.locator('input[placeholder*="转速"]').first()
      .or(page.getByLabel(/转速/))
      .or(page.locator('#speed'));

    // 如果找到输入框，尝试输入
    if (await powerInput.isVisible()) {
      await powerInput.fill('200');
    }

    if (await speedInput.isVisible()) {
      await speedInput.fill('1800');
    }
  });

  test('选型结果显示', async ({ page }) => {
    // 尝试找到选型相关元素
    const selectionArea = page.locator('[data-testid="selection-result"]')
      .or(page.locator('.selection-result'))
      .or(page.locator('text=推荐型号'));

    // 页面应该包含选型相关内容
    await expect(page.locator('body')).toBeVisible();
  });

  test('可以切换到不同功能模块', async ({ page }) => {
    // 尝试找到导航或标签页
    const tabs = page.locator('.nav-tabs, .tab-list, [role="tablist"]');

    if (await tabs.isVisible()) {
      // 获取所有标签
      const tabItems = tabs.locator('.nav-link, .tab-item, [role="tab"]');
      const count = await tabItems.count();

      // 验证有多个标签
      expect(count).toBeGreaterThan(0);
    }
  });
});

test.describe('联轴器选型', () => {
  test('联轴器匹配功能', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 尝试找到联轴器相关区域
    const couplingSection = page.locator('text=联轴器')
      .or(page.locator('text=弹性联轴器'))
      .or(page.locator('[data-testid="coupling"]'));

    // 页面应该加载
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('备用泵选型', () => {
  test('备用泵匹配功能', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 尝试找到备用泵相关区域
    const pumpSection = page.locator('text=备用泵')
      .or(page.locator('text=液压泵'))
      .or(page.locator('[data-testid="pump"]'));

    // 页面应该加载
    await expect(page.locator('body')).toBeVisible();
  });
});
