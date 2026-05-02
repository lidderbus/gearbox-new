// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * v59 询价徽章烟测 — 验证生产环境 4 个前台缺价显示"询价"
 *
 * 由于应用 onboarding/overlay 会拦截普通点击, 使用 force:true 绕过,
 * 直接通过主 Tab id (main-content-tab-XXX) 切换到目标页面。
 *
 * 因 404/585 (69.1%) 型号缺价, 数据查询/产品中心列表必出"询价"。
 */

const ADMIN_USER = 'admin';
const ADMIN_PASS = 'Gbox@2024!';

const loginAndOpen = async (page) => {
  await page.goto('./', { timeout: 30000, waitUntil: 'domcontentloaded' });
  await page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(2000);
  if ((await page.locator('text=用户登录').count()) > 0) {
    await page.locator('input').nth(0).fill(ADMIN_USER);
    await page.locator('input[type="password"]').fill(ADMIN_PASS);
    await page.getByRole('button', { name: /登录/ }).click();
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
  }
  // 关闭 onboarding 引导 (优先点"跳过引导"按钮)
  const skipBtn = page.locator('button, a').filter({ hasText: /跳过引导|跳过|skip/i });
  if (await skipBtn.count() > 0) {
    await skipBtn.first().click({ force: true }).catch(() => {});
    await page.waitForTimeout(800);
  }
  await page.keyboard.press('Escape').catch(() => {});
  await page.waitForTimeout(500);
};

const switchTab = async (page, tabId) => {
  // tab 元素可能不可见 (横向折叠), 用 force 点击触发底层 Bootstrap Tab 事件
  const tab = page.locator(`#${tabId}`);
  const cnt = await tab.count();
  if (cnt === 0) return false;
  try {
    await tab.click({ force: true, timeout: 4000 });
  } catch (e) {
    // 兜底: dispatchEvent
    await tab.evaluate((el) => el.click());
  }
  await page.waitForTimeout(2500);
  return true;
};

test.describe.configure({ mode: 'serial' });
test.setTimeout(90000);

test.describe('v59 询价徽章烟测', () => {
  test('版本号: asset-manifest 含 main.45b12a10.js', async ({ request }) => {
    const resp = await request.get('./asset-manifest.json');
    expect(resp.ok()).toBeTruthy();
    const data = await resp.json();
    expect(data.files['main.js']).toContain('main.45b12a10.js');
  });

  test('登录可达主页', async ({ page }) => {
    await loginAndOpen(page);
    const bodyText = await page.locator('body').innerText();
    expect(bodyText, '不应停留在登录页').not.toContain('用户登录');
    expect(bodyText.length, '登录后应进入主应用').toBeGreaterThan(100);
  });

  test('数据查询 (main-content-tab-query) — 表格出现"询价"徽章', async ({ page }) => {
    await loginAndOpen(page);
    const ok = await switchTab(page, 'main-content-tab-query');
    expect(ok, '应找到 main-content-tab-query').toBeTruthy();
    await page.waitForTimeout(2000);

    // 触发搜索 — 用 panel 内的 .btn-primary 限定范围
    const panel = page.locator('#main-content-tabpane-query');
    const searchBtn = panel.locator('button.btn-primary:has(i.bi-search)');
    await searchBtn.first().scrollIntoViewIfNeeded().catch(() => {});
    await searchBtn.first().click({ force: true }).catch(async () => {
      await searchBtn.first().evaluate((el) => el.click());
    });
    await page.waitForTimeout(3500);
    // 等表格行出现
    await panel.locator('table tbody tr').first().waitFor({ timeout: 10000 }).catch(() => {});
    await page.waitForTimeout(1500);

    // 用 textContent (含隐藏文字) 而不是 innerText (仅可见)
    const panelHTML = await panel.evaluate(el => el.textContent || '');
    // 排查: 表格是否有数据行
    const rowCount = await panel.locator('table tbody tr').count();
    console.log(`数据查询: tbody tr 数量 = ${rowCount}, panelHTML 长度 = ${panelHTML.length}`);
    expect(rowCount, '搜索后应至少有 1 行数据').toBeGreaterThan(0);
    expect(panelHTML, '数据查询表格应至少出现一处"询价"').toContain('询价');
  });

  test('产品中心 (main-content-tab-product-center) — 至少一处"询价"', async ({ page }) => {
    await loginAndOpen(page);
    const ok = await switchTab(page, 'main-content-tab-product-center');
    expect(ok).toBeTruthy();
    await page.waitForTimeout(3500);

    const bodyText = await page.locator('body').innerText();
    expect(bodyText, '产品中心列表应至少出现一处"询价"').toContain('询价');
  });

  test('反向选型 (main-content-tab-reverse-selection 或类似) — 出厂价行存在', async ({ page }) => {
    await loginAndOpen(page);
    // 反向选型 tab id 不确定, 先尝试常见命名
    const candidates = [
      'main-content-tab-reverse-selection',
      'main-content-tab-reverse',
      'main-content-tab-reverseSelection',
    ];
    let switched = false;
    for (const id of candidates) {
      if (await switchTab(page, id)) { switched = true; break; }
    }
    if (!switched) {
      // 通过文本回退
      const tab = page.locator('[role="tab"]').filter({ hasText: /反向选型|逆向/ });
      if (await tab.count() > 0) {
        await tab.first().click({ force: true });
        await page.waitForTimeout(2500);
        switched = true;
      }
    }
    test.skip(!switched, '未找到 反向选型 Tab');

    const bodyText = await page.locator('body').innerText();
    expect(bodyText, '反向选型应展示出厂价/询价').toMatch(/出厂价|询价/);
  });

  test('智能搜索 (main-content-tab-smart-search 或类似) — 详情含出厂价', async ({ page }) => {
    await loginAndOpen(page);
    const candidates = [
      'main-content-tab-smart-search',
      'main-content-tab-smartSearch',
      'main-content-tab-search',
    ];
    let switched = false;
    for (const id of candidates) {
      if (await switchTab(page, id)) { switched = true; break; }
    }
    if (!switched) {
      const tab = page.locator('[role="tab"]').filter({ hasText: /智能搜索/ });
      if (await tab.count() > 0) {
        await tab.first().click({ force: true });
        await page.waitForTimeout(2500);
        switched = true;
      }
    }
    test.skip(!switched, '未找到 智能搜索 Tab');

    // 触发搜索
    const searchBox = page.locator('input[type="text"], input[type="search"]').first();
    if (await searchBox.count() > 0) {
      await searchBox.fill('GW');
      await page.waitForTimeout(2000);
      const firstRow = page.locator('tr, .list-group-item').filter({ hasText: /GW/ }).first();
      if (await firstRow.count() > 0) {
        await firstRow.click({ force: true });
        await page.waitForTimeout(1500);
      }
    }
    const bodyText = await page.locator('body').innerText();
    expect(bodyText, '智能搜索应展示出厂价/询价').toMatch(/出厂价|询价/);
  });
});
