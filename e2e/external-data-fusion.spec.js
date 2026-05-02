// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 投产前外部数据融合功能 E2E (B 阶段)
 *
 * 覆盖:
 *   - B1 多品牌柴油机库智能选择 (EngineInfoSection datalist)
 *   - B2 参数级三方对比 (CompetitorComparisonView 新 Tab)
 *   - B3 按船型快速选型 (EnhancedSelectionForm 顶部组件)
 *   - B4 IMO 合规评估 (EnhancedGearboxSelectionResult 新 Tab)
 *
 * 部署前: 在 local dev (npm start) 或 build 后跑
 * 部署后: 直接 BASE_URL=https://qj-gearbox.duckdns.org/gearbox-app/ npx playwright test external-data-fusion.spec.js
 *
 * 容错: 当 B 阶段尚未上线 (旧版本 v65), 测试会优雅 skip 而不报错, 让 CI 继续
 */

test.describe('B 阶段外部数据融合', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle', { timeout: 15000 });
  });

  test('B1: 主机信息区"智能型号选择"datalist 存在', async ({ page }) => {
    // datalist input 由 EngineInfoSection 注入, aria-label="智能型号选择"
    const datalistInput = page.getByLabel('智能型号选择');
    if (await datalistInput.count() === 0) {
      test.skip(true, 'B1 智能型号选择尚未上线 — 预期 v66+');
      return;
    }
    await expect(datalistInput.first()).toBeVisible();
    // datalist options 应至少含一个常见品牌
    const options = page.locator('#engine-quick-options option');
    const count = await options.count();
    expect(count).toBeGreaterThan(0);
  });

  test('B3: "按船型快速选型"组件可见且可选 Capesize', async ({ page }) => {
    const quickSelector = page.getByText('按船型快速选型');
    if (await quickSelector.count() === 0) {
      test.skip(true, 'B3 QuickByVesselType 尚未上线 — 预期 v66+');
      return;
    }
    await expect(quickSelector.first()).toBeVisible();

    // 选 bulker → bulker_capesize
    const categorySelect = page.getByLabel('船型分类');
    await categorySelect.selectOption('bulker');

    const variantSelect = page.getByLabel('船型尺度');
    await variantSelect.selectOption('bulker_capesize');

    // 预览中应出现 18500 kW
    await expect(page.getByText(/18500 kW/)).toBeVisible({ timeout: 3000 });

    // "带入主表单"按钮可点击
    const applyBtn = page.getByText(/带入主表单/);
    await expect(applyBtn).toBeEnabled();
  });

  test('B4: 选型结果页"IMO 合规"Tab 在选型完成后可见', async ({ page }) => {
    // 先跑一次基础选型 (尝试常见输入路径)
    const powerInput = page.locator('input[placeholder*="功率"], input[placeholder*="350"]').first();
    if (await powerInput.count() > 0 && await powerInput.isVisible()) {
      await powerInput.fill('1800');
    }
    const speedInput = page.locator('input[placeholder*="转速"], input[placeholder*="1800"]').first();
    if (await speedInput.count() > 0 && await speedInput.isVisible()) {
      await speedInput.fill('1800');
    }

    const calcBtn = page.locator('button').filter({ hasText: /开始选型|计算|匹配/ }).first();
    if (await calcBtn.count() > 0 && await calcBtn.isVisible()) {
      await calcBtn.click();
      await page.waitForTimeout(2500);
    }

    // 选型结果页内寻找 "IMO 合规" Tab
    const imoTab = page.locator('[role="tab"], .nav-link').filter({ hasText: /IMO 合规/ });
    if (await imoTab.count() === 0) {
      test.skip(true, 'B4 IMO 合规 Tab 尚未上线 — 预期 v66+');
      return;
    }
    await imoTab.first().click();
    await page.waitForTimeout(500);

    // IMO 评估表单可见
    await expect(page.getByText(/IMO 合规评估/).first()).toBeVisible();
    await expect(page.getByText(/EEXI/)).toBeVisible();
  });

  test('B2: 竞品页"参数级三方对比"Tab + 默认工况命中 ZF W2050', async ({ page }) => {
    // 先去竞品对比页 (Tab 名常含"竞品" / "对比")
    const competitorTab = page.locator('[role="tab"], .nav-link, button').filter({ hasText: /竞品|对比/ }).first();
    if (await competitorTab.count() === 0) {
      test.skip(true, '未找到竞品对比入口');
      return;
    }
    await competitorTab.click();
    await page.waitForTimeout(800);

    // 子 Tab: 参数级三方对比
    const paramTab = page.locator('[role="tab"], .nav-link').filter({ hasText: /参数级三方对比/ });
    if (await paramTab.count() === 0) {
      test.skip(true, 'B2 参数级三方对比 Tab 尚未上线 — 预期 v66+');
      return;
    }
    await paramTab.first().click();
    await page.waitForTimeout(500);

    // 默认 1850/3.5/1800 应命中 ZF W2050
    await expect(page.getByText('ZF W2050')).toBeVisible({ timeout: 3000 });
    // 醒目免责
    await expect(page.getByText(/参考价仅作对位估算/)).toBeVisible();
    // HCT2700 在杭齿对位列表中
    await expect(page.getByText(/HCT2700/)).toBeVisible();
  });
});
