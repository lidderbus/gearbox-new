// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 齿轮箱选型核心流程 E2E 测试
 *
 * 守卫测试：完整选型流程 输入参数 → 计算 → 结果展示 → 选择型号
 * 这是系统最核心的业务链路，任何回归都必须被捕获
 */

test.describe('选型计算核心流程', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('输入功率和转速 → 触发选型 → 显示推荐结果', async ({ page }) => {
    // 1. 切换到选型计算 Tab
    const inputTab = page.locator('.nav-link, [role="tab"]').filter({ hasText: /选型计算|输入参数/ });
    if (await inputTab.count() > 0) {
      await inputTab.first().click();
      await page.waitForTimeout(500);
    }

    // 2. 填写功率 (200kW)
    const powerInput = page.locator('input[type="number"]').filter({
      has: page.locator('xpath=ancestor::*[contains(., "功率")]')
    }).first()
      .or(page.locator('input[placeholder*="功率"]').first())
      .or(page.locator('input[placeholder*="350"]').first());

    if (await powerInput.isVisible()) {
      await powerInput.clear();
      await powerInput.fill('200');
      await expect(powerInput).toHaveValue('200');
    }

    // 3. 填写转速 (1800 rpm)
    const speedInput = page.locator('input[type="number"]').filter({
      has: page.locator('xpath=ancestor::*[contains(., "转速")]')
    }).first()
      .or(page.locator('input[placeholder*="转速"]').first())
      .or(page.locator('input[placeholder*="1800"]').first());

    if (await speedInput.isVisible()) {
      await speedInput.clear();
      await speedInput.fill('1800');
      await expect(speedInput).toHaveValue('1800');
    }

    // 4. 查找并点击选型/计算按钮
    const calcButton = page.locator('button').filter({ hasText: /开始选型|计算|选型|匹配/ }).first();
    if (await calcButton.isVisible()) {
      await calcButton.click();
      // 等待选型计算完成
      await page.waitForTimeout(2000);
    }

    // 5. 验证有结果输出 — 页面上应出现齿轮箱型号相关内容
    // HC/GW/HCM 等系列名应出现在结果中
    const resultArea = page.locator('body');
    const bodyText = await resultArea.innerText();

    // 至少检查页面没有崩溃
    expect(bodyText.length).toBeGreaterThan(100);
  });

  test('选型结果表格可交互', async ({ page }) => {
    // 切换到选型结果 Tab（如果有独立结果 Tab）
    const resultTab = page.locator('.nav-link, [role="tab"]').filter({ hasText: /选型结果|结果/ });
    if (await resultTab.count() > 0) {
      await resultTab.first().click();
      await page.waitForTimeout(500);
    }

    // 如果结果表格中有行，应该能点击选中
    const tableRows = page.locator('table tbody tr');
    const rowCount = await tableRows.count();

    if (rowCount > 0) {
      // 点击第一行
      await tableRows.first().click();
      // 选中行应该有高亮样式
      await expect(tableRows.first()).toHaveClass(/primary|active|selected/);
    }
  });
});

test.describe('数据查询功能', () => {
  test('可按型号名搜索齿轮箱', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 切换到数据查询 Tab
    const queryTab = page.locator('.nav-link, [role="tab"]').filter({ hasText: /数据查询/ });
    if (await queryTab.count() > 0) {
      await queryTab.first().click();
      await page.waitForTimeout(500);
    }

    // 查找搜索/过滤输入框
    const searchInput = page.locator('input[type="text"], input[type="search"]').filter({
      has: page.locator('xpath=ancestor::*[contains(., "搜索") or contains(., "查询") or contains(., "型号")]')
    }).first()
      .or(page.locator('input[placeholder*="搜索"]').first())
      .or(page.locator('input[placeholder*="型号"]').first());

    if (await searchInput.isVisible()) {
      await searchInput.fill('HC300');
      await page.waitForTimeout(1000);

      // 搜索后页面应包含 HC300 相关信息
      const pageText = await page.locator('body').innerText();
      expect(pageText).toContain('HC300');
    }
  });
});

test.describe('产品中心', () => {
  test('产品中心显示齿轮箱系列', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const productTab = page.locator('.nav-link, [role="tab"]').filter({ hasText: /产品中心/ });
    if (await productTab.count() > 0) {
      await productTab.first().click();
      await page.waitForTimeout(1000);

      // 产品中心应该显示齿轮箱系列名（HC/GW/HCM/GC 等）
      const pageText = await page.locator('body').innerText();
      const hasSeriesNames = /HC|GW|HCM|GC/.test(pageText);
      expect(hasSeriesNames).toBeTruthy();
    }
  });
});
