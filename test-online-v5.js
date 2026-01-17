const { chromium } = require('playwright');

(async () => {
    console.log('=== 在线选型测试 248kW/1500rpm/5:1 ===\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('http://47.99.181.195/gearbox-app/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // 登录 - 使用更通用的选择器
        console.log('登录中...');
        const userInput = await page.$('input[placeholder*="用户名"]');
        const pwdInput = await page.$('input[placeholder*="密码"]');
        if (userInput && pwdInput) {
            await userInput.fill('admin');
            await pwdInput.fill('Gbox@2024!');
            await page.click('button:has-text("登录")');
            await page.waitForTimeout(4000);
        }

        await page.screenshot({ path: '/tmp/after-login.png', fullPage: true });

        // 查找功率输入框
        console.log('查找输入框...');
        const powerInputs = await page.$$('input[type="number"], input[type="text"]');
        console.log(`找到 ${powerInputs.length} 个输入框`);

        // 填写参数 - 尝试多种选择器
        console.log('填写参数...');

        // 方法1: 通过label关联
        const powerLabel = await page.$('text=功率');
        if (powerLabel) {
            const input = await page.$('input#power, input[name="power"]');
            if (input) await input.fill('248');
        }

        // 方法2: 直接填充所有数字输入框
        await page.evaluate(() => {
            const inputs = document.querySelectorAll('input[type="number"], input[type="text"]');
            inputs.forEach((input, i) => {
                const placeholder = input.placeholder || '';
                const label = input.closest('label')?.textContent || '';
                console.log(`Input ${i}: placeholder=${placeholder}, label=${label}`);
            });
        });

        // 尝试找到并填充功率、转速、减速比输入框
        await page.fill('input[placeholder*="功率"], input[placeholder*="kW"], input#power', '248').catch(() => {});
        await page.fill('input[placeholder*="转速"], input[placeholder*="rpm"], input#speed', '1500').catch(() => {});
        await page.fill('input[placeholder*="减速"], input[placeholder*="比"], input#ratio', '5').catch(() => {});

        await page.waitForTimeout(500);
        await page.screenshot({ path: '/tmp/after-fill.png', fullPage: true });

        // 点击"开始选型"按钮
        console.log('点击选型按钮...');
        const selectBtn = await page.$('button:has-text("开始选型"), button:has-text("选型"), button:has-text("计算")');
        if (selectBtn) {
            await selectBtn.click();
            await page.waitForTimeout(6000);
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

        // 检查页面中的型号
        const allText = await page.evaluate(() => document.body.innerText);
        console.log('\n页面包含的DT/HC型号:');
        const dtHcMatches = allText.match(/[DH][TC]\d{3,4}[A-Z]?/g);
        if (dtHcMatches) {
            const unique = [...new Set(dtHcMatches)];
            console.log('  ' + unique.slice(0, 15).join(', '));
        }

        // 检查DT900余量
        if (content.includes('DT900')) {
            const marginMatch = allText.match(/DT900[^]*?余量[:\s]*(\d+\.?\d*)%/);
            if (marginMatch) {
                console.log(`\nDT900余量: ${marginMatch[1]}%`);
            }
        }

        console.log('\n截图: /tmp/test-result.png, /tmp/after-login.png, /tmp/after-fill.png');

    } catch (error) {
        console.error('错误:', error.message);
        await page.screenshot({ path: '/tmp/test-error.png', fullPage: true });
        console.log('错误截图: /tmp/test-error.png');
    }

    await browser.close();
})();
