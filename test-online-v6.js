const { chromium } = require('playwright');

(async () => {
    console.log('=== 在线选型测试 248kW/1500rpm/5:1 ===\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('http://47.99.181.195/gearbox-app/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // 登录 - 使用准确的placeholder
        console.log('登录中...');
        await page.fill('input[placeholder="请输入用户名"]', 'admin');
        await page.fill('input[placeholder="请输入密码"]', 'Gbox@2024!');
        await page.click('button:has-text("登录")');
        await page.waitForTimeout(4000);

        await page.screenshot({ path: '/tmp/after-login.png', fullPage: true });
        console.log('登录后截图已保存');

        // 等待页面加载完成
        await page.waitForTimeout(2000);

        // 获取页面内容检查是否登录成功
        const pageText = await page.evaluate(() => document.body.innerText);
        if (pageText.includes('用户登录')) {
            console.log('警告: 可能仍在登录页面');
        } else {
            console.log('已进入主页面');
        }

        // 填写参数
        console.log('填写参数...');

        // 列出所有input
        const inputs = await page.$$eval('input', els => els.map(e => ({
            type: e.type,
            placeholder: e.placeholder,
            id: e.id,
            name: e.name
        })));
        console.log('页面input:', JSON.stringify(inputs.slice(0, 10)));

        // 尝试填充
        try {
            await page.fill('input[placeholder*="350"]', '248');
        } catch (e) {
            console.log('未找到placeholder=350的输入框');
        }

        try {
            await page.fill('input[placeholder*="1800"]', '1500');
        } catch (e) {
            console.log('未找到placeholder=1800的输入框');
        }

        try {
            await page.fill('input[placeholder*="4.5"]', '5');
        } catch (e) {
            console.log('未找到placeholder=4.5的输入框');
        }

        await page.screenshot({ path: '/tmp/after-fill.png', fullPage: true });

        // 点击选型按钮
        console.log('查找并点击选型按钮...');
        const buttons = await page.$$eval('button', els => els.map(e => e.textContent.trim()));
        console.log('页面按钮:', buttons.slice(0, 10));

        const selectBtn = await page.$('button:has-text("开始选型")');
        if (selectBtn) {
            await selectBtn.click();
            console.log('已点击"开始选型"按钮');
            await page.waitForTimeout(6000);
        } else {
            console.log('未找到"开始选型"按钮');
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

        // 检查页面文本中的型号
        const allText = await page.evaluate(() => document.body.innerText);
        const dtHcMatches = allText.match(/[DH][TC]\d{3,4}[A-Z]?/g);
        if (dtHcMatches) {
            const unique = [...new Set(dtHcMatches)];
            console.log('\n页面包含的DT/HC型号: ' + unique.slice(0, 15).join(', '));
        }

        console.log('\n截图已保存');

    } catch (error) {
        console.error('错误:', error.message);
        await page.screenshot({ path: '/tmp/test-error.png', fullPage: true });
    }

    await browser.close();
})();
