const { chromium } = require('playwright');

(async () => {
    console.log('=== 在线选型测试 ===');
    console.log('参数: 248kW / 1500rpm / 5:1');
    console.log('');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        console.log('1. 访问选型系统...');
        await page.goto('http://47.99.181.195/gearbox-app/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // 登录
        const loginForm = await page.$('input[type="password"]');
        if (loginForm) {
            console.log('2. 登录中...');
            await page.fill('input[type="text"]', 'admin');
            await page.fill('input[type="password"]', 'Gbox@2024!');
            await page.click('button[type="submit"]');
            await page.waitForTimeout(3000);
        }

        console.log('3. 填写选型参数...');
        
        // 使用 placeholder 文本定位输入框
        // 功率输入框 placeholder="例如: 350"
        await page.fill('input[placeholder*="350"]', '248');
        console.log('   功率: 248 kW');
        
        // 转速输入框 placeholder="例如: 1800" 或类似
        await page.fill('input[placeholder*="1800"], input[placeholder*="1000"]', '1500');
        console.log('   转速: 1500 rpm');
        
        // 减速比 - 可能是下拉或输入
        const ratioInput = await page.$('input[placeholder*="速比"], input[placeholder*="4.5"], input[placeholder*="减速"]');
        if (ratioInput) {
            await ratioInput.fill('5');
            console.log('   减速比: 5');
        }

        await page.screenshot({ path: '/tmp/test-params.png' });
        await page.waitForTimeout(500);

        // 点击选型按钮
        console.log('4. 执行选型...');
        await page.click('button:has-text("选型"), button:has-text("智能选型"), button:has-text("开始")');
        
        await page.waitForTimeout(5000);
        await page.screenshot({ path: '/tmp/test-result.png', fullPage: true });
        console.log('   截图: /tmp/test-result.png');

        // 检查结果
        const content = await page.content();
        console.log('');
        console.log('5. 检查选型结果:');
        
        ['HC300', 'HC400', 'DT770', 'DT900'].forEach(model => {
            console.log(`   ${content.includes(model) ? '✓' : '✗'} ${model}`);
        });

    } catch (error) {
        console.error('错误:', error.message);
        await page.screenshot({ path: '/tmp/test-error.png', fullPage: true });
    }

    await browser.close();
})();
