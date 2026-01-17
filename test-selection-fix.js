const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    console.log('=== 选型修复验证测试 ===');
    console.log('测试参数: 248kW / 1500rpm / 5:1');
    console.log('');

    try {
        // 1. 访问选型页面
        console.log('1. 访问 http://47.99.181.195/gearbox-app/');
        await page.goto('http://47.99.181.195/gearbox-app/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // 2. 登录
        console.log('2. 登录系统...');
        const usernameInput = await page.$('input[type="text"], input[name="username"]');
        const passwordInput = await page.$('input[type="password"]');

        if (usernameInput && passwordInput) {
            await usernameInput.fill('admin');
            await passwordInput.fill('Gbox@2024!');
            await page.click('button[type="submit"]');
            await page.waitForTimeout(2000);
            console.log('   登录完成');
        } else {
            console.log('   未找到登录表单，可能已登录');
        }

        // 3. 等待选型界面加载
        await page.waitForTimeout(2000);

        // 4. 填写选型参数
        console.log('3. 填写选型参数...');

        // 功率
        const powerInput = await page.$('input[placeholder*="功率"], input[id*="power"], input[name*="power"]');
        if (powerInput) {
            await powerInput.fill('248');
            console.log('   功率: 248 kW');
        }

        // 转速
        const speedInput = await page.$('input[placeholder*="转速"], input[id*="speed"], input[name*="speed"]');
        if (speedInput) {
            await speedInput.fill('1500');
            console.log('   转速: 1500 rpm');
        }

        // 减速比
        const ratioInput = await page.$('input[placeholder*="减速比"], input[id*="ratio"], input[name*="ratio"]');
        if (ratioInput) {
            await ratioInput.fill('5');
            console.log('   减速比: 5:1');
        }

        await page.waitForTimeout(500);

        // 5. 点击选型按钮
        console.log('4. 执行选型...');
        const selectButton = await page.$('button:has-text("选型"), button:has-text("开始选型"), button:has-text("智能选型")');
        if (selectButton) {
            await selectButton.click();
            await page.waitForTimeout(3000);
        }

        // 6. 截图并检查结果
        await page.screenshot({ path: '/tmp/selection-result.png', fullPage: true });
        console.log('   截图已保存: /tmp/selection-result.png');

        // 7. 获取选型结果
        const pageContent = await page.content();

        // 检查关键型号是否出现
        const modelsToCheck = ['HC400', 'DT900', 'DT770', 'HC', 'DT'];
        console.log('');
        console.log('5. 检查选型结果:');

        for (const model of modelsToCheck) {
            if (pageContent.includes(model)) {
                console.log(`   ✓ ${model} 出现在结果中`);
            } else {
                console.log(`   ✗ ${model} 未出现在结果中`);
            }
        }

        // 8. 打印控制台日志
        page.on('console', msg => {
            if (msg.text().includes('transmissionCapacityPerRatio') ||
                msg.text().includes('HC400') ||
                msg.text().includes('DT900')) {
                console.log('   [Console]', msg.text());
            }
        });

        // 等待更多日志
        await page.waitForTimeout(2000);

        console.log('');
        console.log('=== 测试完成 ===');

    } catch (error) {
        console.error('测试失败:', error.message);
        await page.screenshot({ path: '/tmp/selection-error.png', fullPage: true });
    }

    await browser.close();
})();
