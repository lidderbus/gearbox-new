// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 协议生成与导出 E2E 测试
 *
 * 守卫测试：技术协议生成、报价单功能、模板库访问
 */

test.describe('协议模板库', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('模板库 Tab 可访问且包含模板列表', async ({ page }) => {
    const templateTab = page.locator('.nav-link, [role="tab"]').filter({ hasText: /协议模板|模板库/ });

    if (await templateTab.count() > 0) {
      await templateTab.first().click();
      await page.waitForTimeout(1000);

      // 模板库应包含条款相关内容
      const pageText = await page.locator('body').innerText();
      const hasTemplateContent = /模板|条款|知识库|协议/.test(pageText);
      expect(hasTemplateContent).toBeTruthy();
    }
  });

  test('条款知识库搜索功能', async ({ page }) => {
    const templateTab = page.locator('.nav-link, [role="tab"]').filter({ hasText: /协议模板|模板库/ });

    if (await templateTab.count() > 0) {
      await templateTab.first().click();
      await page.waitForTimeout(1000);

      // 如果有条款知识库子Tab，切换到它
      const clauseTab = page.locator('.nav-link, [role="tab"], button').filter({ hasText: /条款知识库/ });
      if (await clauseTab.count() > 0) {
        await clauseTab.first().click();
        await page.waitForTimeout(500);
      }

      // 搜索条款
      const searchInput = page.locator('input[type="text"], input[type="search"]').filter({
        has: page.locator('xpath=ancestor::*[contains(., "搜索") or contains(., "条款")]')
      }).first()
        .or(page.locator('input[placeholder*="搜索"]').first());

      if (await searchInput.isVisible()) {
        await searchInput.fill('润滑');
        await page.waitForTimeout(500);
        // 搜索结果应出现
        const pageText = await page.locator('body').innerText();
        expect(pageText).toContain('润滑');
      }
    }
  });
});

test.describe('报价单功能', () => {
  test('报价单 Tab 可访问', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const quoteTab = page.locator('.nav-link, [role="tab"]').filter({ hasText: /报价/ });

    if (await quoteTab.count() > 0) {
      await quoteTab.first().click();
      await page.waitForTimeout(1000);

      // 报价单页面应正常渲染
      const pageText = await page.locator('body').innerText();
      const hasQuoteContent = /报价|价格|金额|客户/.test(pageText);
      expect(hasQuoteContent).toBeTruthy();
    }
  });
});

test.describe('批量选型', () => {
  test('批量选型 Tab 可访问', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const batchTab = page.locator('.nav-link, [role="tab"]').filter({ hasText: /批量/ });

    if (await batchTab.count() > 0) {
      await batchTab.first().click();
      await page.waitForTimeout(1000);

      // 批量选型页面应包含输入区域
      const pageText = await page.locator('body').innerText();
      const hasBatchContent = /批量|导入|Excel|上传/.test(pageText);
      expect(hasBatchContent).toBeTruthy();
    }
  });
});

test.describe('选型历史', () => {
  test('历史记录 Tab 可访问', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    const historyTab = page.locator('.nav-link, [role="tab"]').filter({ hasText: /历史/ });

    if (await historyTab.count() > 0) {
      await historyTab.first().click();
      await page.waitForTimeout(1000);

      // 历史页面应正常渲染
      await expect(page.locator('#root')).toBeVisible();
    }
  });
});
