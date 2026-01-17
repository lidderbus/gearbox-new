const { chromium } = require('playwright');

(async () => {
    console.log('=== 在线选型测试 248kW/1500rpm/5:1 ===\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('http://47.99.181.195/gearbox-app/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // 登录
        const pwd = await page.$('input[type="password"]');
        if (pwd) {
            await page.fill('input[type="text"]', 'admin');
            await page.fill('input[type="password"]', 'Gbox@2024!');
            await page.click('button[type="submit"]');
            await page.waitForTimeout(3000);
        }

        // 填写参数
        await page.fill('input[placeholder*="350"]', '248');
        await page.fill('input[placeholder*="1800"], input[placeholder*="1000"]', '1500');

        const ratioInput = await page.$('input[placeholder*="4.5"]');
        if (ratioInput) await ratioInput.fill('5');

        await page.waitForTimeout(500);

        // 点击"自动选择"按钮
        console.log('点击"自动选择"按钮...');
        await page.click('button:has-text("自动选择")');

        await page.waitForTimeout(5000);
        await page.screenshot({ path: '/tmp/test-result.png', fullPage: true });

        // 检查结果
        const content = await page.content();
        console.log('\n选型结果检查:');
        const models = ['HC300', 'HC400', 'DT770', 'DT900'];
        models.forEach(model => {
            const found = content.includes(model);
            console.log('  ' + (found ? '✓' : '✗') + ' ' + model);
        });

        console.log('\n截图已保存: /tmp/test-result.png');

    } catch (error) {
        console.error('错误:', error.message);
        await page.screenshot({ path: '/tmp/test-error.png', fullPage: true });
    }

    await browser.close();
})();
