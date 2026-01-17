const { chromium } = require('playwright');

(async () => {
    // 测试参数: 100kW/1500rpm/5:1
    // DT900在5:1的传递能力 = 0.24 kW/rpm
    // 所需传递能力 = 100/1500 = 0.0667 kW/rpm
    // 预期余量 = (0.24 - 0.0667) / 0.0667 * 100 = 260%
    // 因为余量 > 50%, DT900应该被排除

    console.log('=== 测试50%余量过滤 (100kW/1500rpm/5:1) ===\n');
    console.log('预期: DT900余量约260%, 应被排除\n');

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto('http://47.99.181.195/gearbox-app/', { waitUntil: 'networkidle', timeout: 30000 });
        await page.waitForTimeout(2000);

        // 登录
        console.log('登录中...');
        await page.fill('input[placeholder="请输入用户名"]', 'admin');
        await page.fill('input[placeholder="请输入密码"]', 'Gbox@2024!');
        await page.click('button:has-text("登录")');
        await page.waitForTimeout(4000);

        // 填写参数: 100kW, 1500rpm, 5:1
        console.log('填写参数: 100kW, 1500rpm, 5:1');
        await page.fill('input#enginePower', '100');
        await page.fill('input#engineSpeed', '1500');
        await page.fill('input#targetRatio', '5');

        await page.waitForTimeout(500);

        // 点击开始选型
        console.log('点击"开始选型"...');
        await page.click('button:has-text("开始选型")');
        await page.waitForTimeout(6000);

        await page.screenshot({ path: '/tmp/filter-test-result.png', fullPage: true });

        // 检查结果
        const content = await page.content();
        const allText = await page.evaluate(() => document.body.innerText);

        console.log('\n选型结果检查:');
        console.log('  DT900: ' + (content.includes('DT900') ? '✗ 出现 (应被过滤)' : '✓ 未出现 (正确)'));
        console.log('  DT770: ' + (content.includes('DT770') ? '出现' : '未出现'));
        console.log('  HC300: ' + (content.includes('HC300') ? '出现' : '未出现'));
        console.log('  HC400: ' + (content.includes('HC400') ? '出现' : '未出现'));

        // 提取页面中显示的型号
        const dtHcMatches = allText.match(/[DH][TC]\d{3,4}[A-Z]?/g);
        if (dtHcMatches) {
            const unique = [...new Set(dtHcMatches)];
            console.log('\n页面显示的型号: ' + unique.join(', '));
        }

        // 检查是否有"未找到"提示
        if (allText.includes('未找到') || allText.includes('没有匹配')) {
            console.log('\n提示: 页面显示"未找到匹配结果"');
        }

        console.log('\n截图: /tmp/filter-test-result.png');

    } catch (error) {
        console.error('错误:', error.message);
        await page.screenshot({ path: '/tmp/filter-test-error.png', fullPage: true });
    }

    await browser.close();
})();
