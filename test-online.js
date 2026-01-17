const { chromium } = require('playwright');

(async () => {
    console.log('=== 在线选型测试 ===');
    console.log('参数: 248kW / 1500rpm / 5:1');
    console.log('');
    
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // 访问选型系统
        console.log('1. 访问 http://47.99.181.195/gearbox-app/');
        await page.goto('http://47.99.181.195/gearbox-app/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);
        
        // 截图初始状态
        await page.screenshot({ path: '/tmp/test-step1.png' });

        // 检查是否需要登录
        const loginForm = await page.$('input[type="password"]');
        if (loginForm) {
            console.log('2. 登录系统...');
            const usernameInput = await page.$('input[type="text"], input[name="username"], input[placeholder*="用户"]');
            if (usernameInput) await usernameInput.fill('admin');
            await loginForm.fill('Gbox@2024!');
            
            const submitBtn = await page.$('button[type="submit"]');
            if (submitBtn) await submitBtn.click();
            await page.waitForTimeout(3000);
            console.log('   登录完成');
        }

        await page.screenshot({ path: '/tmp/test-step2.png' });

        // 填写选型参数
        console.log('3. 填写选型参数...');
        
        // 尝试多种选择器
        const powerSelectors = ['input[placeholder*="功率"]', 'input[id*="power"]', 'input[name*="power"]', '#motorPower', 'input[type="number"]:first-of-type'];
        const speedSelectors = ['input[placeholder*="转速"]', 'input[id*="speed"]', 'input[name*="speed"]', '#motorSpeed'];
        const ratioSelectors = ['input[placeholder*="减速比"]', 'input[placeholder*="速比"]', 'input[id*="ratio"]', '#targetRatio'];

        for (const sel of powerSelectors) {
            const el = await page.$(sel);
            if (el) {
                await el.fill('248');
                console.log('   功率: 248 kW');
                break;
            }
        }

        for (const sel of speedSelectors) {
            const el = await page.$(sel);
            if (el) {
                await el.fill('1500');
                console.log('   转速: 1500 rpm');
                break;
            }
        }

        for (const sel of ratioSelectors) {
            const el = await page.$(sel);
            if (el) {
                await el.fill('5');
                console.log('   减速比: 5');
                break;
            }
        }

        await page.screenshot({ path: '/tmp/test-step3.png' });
        await page.waitForTimeout(500);

        // 点击选型按钮
        console.log('4. 执行选型...');
        const buttonSelectors = [
            'button:has-text("选型")',
            'button:has-text("开始选型")', 
            'button:has-text("智能选型")',
            'button:has-text("查询")',
            'button.ant-btn-primary'
        ];

        for (const sel of buttonSelectors) {
            const btn = await page.$(sel);
            if (btn) {
                await btn.click();
                console.log('   点击选型按钮');
                break;
            }
        }

        await page.waitForTimeout(5000);
        await page.screenshot({ path: '/tmp/test-result.png', fullPage: true });
        console.log('   截图已保存: /tmp/test-result.png');

        // 获取页面内容检查结果
        const content = await page.content();
        
        console.log('');
        console.log('5. 检查选型结果:');
        
        const modelsToCheck = ['HC300', 'HC400', 'DT770', 'DT900'];
        for (const model of modelsToCheck) {
            if (content.includes(model)) {
                console.log(`   ✓ ${model} 出现在结果中`);
            } else {
                console.log(`   ✗ ${model} 未出现`);
            }
        }

    } catch (error) {
        console.error('测试出错:', error.message);
        await page.screenshot({ path: '/tmp/test-error.png', fullPage: true });
    }

    await browser.close();
    console.log('');
    console.log('=== 测试完成 ===');
})();
