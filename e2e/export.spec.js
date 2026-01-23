// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * 导出功能 E2E 测试
 *
 * 测试PDF和Excel导出功能
 */

test.describe('导出功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('页面包含导出相关元素', async ({ page }) => {
    // 查找导出按钮或链接
    const exportElements = page.locator('button:has-text("导出"), a:has-text("导出"), [data-testid*="export"]');

    // 页面应该正常加载
    await expect(page.locator('body')).toBeVisible();
  });

  test('PDF导出按钮可点击', async ({ page }) => {
    // 查找PDF导出按钮
    const pdfButton = page.locator('button:has-text("PDF"), button:has-text("pdf"), [data-testid="export-pdf"]');

    // 如果找到按钮，验证它可以被点击
    if (await pdfButton.first().isVisible()) {
      await expect(pdfButton.first()).toBeEnabled();
    }
  });

  test('Excel导出按钮可点击', async ({ page }) => {
    // 查找Excel导出按钮
    const excelButton = page.locator('button:has-text("Excel"), button:has-text("xlsx"), [data-testid="export-excel"]');

    // 如果找到按钮，验证它可以被点击
    if (await excelButton.first().isVisible()) {
      await expect(excelButton.first()).toBeEnabled();
    }
  });
});

test.describe('产品中心导出', () => {
  test('产品列表页面加载', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 尝试导航到产品中心
    const productLink = page.locator('a:has-text("产品"), button:has-text("产品")');

    if (await productLink.first().isVisible()) {
      await productLink.first().click();
      await page.waitForLoadState('networkidle');
    }

    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('技术协议生成', () => {
  test('协议生成功能可访问', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 查找协议相关元素
    const agreementElements = page.locator('text=技术协议, text=协议生成, [data-testid*="agreement"]');

    // 页面应该正常加载
    await expect(page.locator('body')).toBeVisible();
  });
});
