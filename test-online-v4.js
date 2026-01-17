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
        console.log('填写参数...');
        await page.fill('input[placeholder*="350"]', '248');
        await page.fill('input[placeholder*="1800"], input[placeholder*="1000"]', '1500');

        const ratioInput = await page.$('input[placeholder*="4.5"]');
        if (ratioInput) await ratioInput.fill('5');

        await page.waitForTimeout(500);

        // 点击"开始选型"按钮 (蓝色大按钮)
        console.log('点击"开始选型"按钮...');
        await page.click('button:has-text("开始选型")');

        // 等待选型结果加载
        await page.waitForTimeout(6000);

        // 点击"选型结果"标签页查看结果
        const resultTab = await page.$('button:has-text("选型结果"), a:has-text("选型结果"), [role="tab"]:has-text("选型结果")');
        if (resultTab) {
            console.log('切换到选型结果标签页...');
            await resultTab.click();
            await page.waitForTimeout(2000);
        }

        await page.screenshot({ path: '/tmp/test-result.png', fullPage: true });

        // 检查结果
        const content = await page.content();
        console.log('\n选型结果检查:');
        const models = ['HC300', 'HC400', 'DT770', 'DT900'];
        models.forEach(model => {
            const found = content.includes(model);
            console.log('  ' + (found ? '✓' : '✗') + ' ' + model);
        });

        // 额外检查页面中的型号列表
        const allText = await page.evaluate(() => document.body.innerText);
        console.log('\n页面包含的DT/HC型号:');
        const dtHcMatches = allText.match(/[DH][TC]\d{3,4}[A-Z]?/g);
        if (dtHcMatches) {
            const unique = [...new Set(dtHcMatches)];
            console.log('  ' + unique.slice(0, 10).join(', '));
        }

        console.log('\n截图: /tmp/test-result.png');

    } catch (error) {
        console.error('错误:', error.message);
        await page.screenshot({ path: '/tmp/test-error.png', fullPage: true });
        console.log('错误截图: /tmp/test-error.png');
    }

    await browser.close();
})();
