const { chromium } = require('playwright');

(async () => {
    console.log('========================================================');
    console.log('       Complete Hybrid Mode Selection Test              ');
    console.log('========================================================\n');

    const results = {
        HC: { PTI: [], PTO: [], PTH: [] },
        GW: { PTI: [], PTO: [], PTH: [] }
    };

    const testCases = [
        { series: 'HC', mode: 'pti', power: 500, speed: 1500, ratio: 3.5 },
        { series: 'HC', mode: 'pto', power: 600, speed: 1200, ratio: 4.0 },
        { series: 'HC', mode: 'pth', power: 800, speed: 1200, ratio: 4.0 },
        { series: 'GW', mode: 'pti', power: 300, speed: 1000, ratio: 3.0 },
        { series: 'GW', mode: 'pto', power: 400, speed: 1000, ratio: 3.0 },
        { series: 'GW', mode: 'pth', power: 500, speed: 1000, ratio: 3.5 },
    ];

    for (const tc of testCases) {
        process.stdout.write('Testing ' + tc.series + ' + ' + tc.mode.toUpperCase() + '... ');

        const browser = await chromium.launch({ headless: true });
        const page = await browser.newPage();

        await page.goto('http://47.99.181.195/gearbox-app/?t=' + Date.now(), { waitUntil: 'networkidle' });
        await page.fill('input[placeholder="请输入用户名"]', 'admin');
        await page.fill('input[placeholder="请输入密码"]', 'Gbox@2024!');
        await page.click('button:has-text("登录")');
        await page.waitForTimeout(2000);

        await page.fill('input[placeholder="例如: 350"]', String(tc.power));
        await page.fill('input[placeholder="例如: 1800"]', String(tc.speed));
        await page.fill('input[placeholder="例如: 4.5"]', String(tc.ratio));

        await page.click('text=' + tc.series + '系列');
        await page.waitForTimeout(300);

        await page.click('text=混合动力配置 (PTI/PTO)');
        await page.waitForTimeout(300);
        await page.click('label[for="hybrid-enabled"]');
        await page.waitForTimeout(500);

        const modeLabel = await page.$('label[for="mode-' + tc.mode + '"]');
        if (modeLabel) await modeLabel.click();
        await page.waitForTimeout(500);

        await page.click('button:has-text("开始选型")');
        await page.waitForTimeout(4000);

        const models = await page.evaluate((series) => {
            const text = document.body.innerText;
            let pattern;
            if (series === 'HC') {
                pattern = /(?:HC|HCD|HCT)[0-9]+(?:\/1)?P/g;
            } else {
                pattern = /(?:GWS|GWC)[0-9.]+P/g;
            }
            return [...new Set(text.match(pattern) || [])];
        }, tc.series);

        results[tc.series][tc.mode.toUpperCase()] = models;
        console.log(models.length > 0 ? '✅ ' + models.length + ' models' : '❌ 0 models');

        await browser.close();
    }

    // Print detailed results
    console.log('\n========================================================');
    console.log('                    DETAILED RESULTS                     ');
    console.log('========================================================\n');

    for (const series of ['HC', 'GW']) {
        console.log('【' + series + '系列】');
        for (const mode of ['PTI', 'PTO', 'PTH']) {
            const models = results[series][mode];
            const status = models.length > 0 ? '✅' : '❌';
            console.log('  ' + mode + ': ' + status + ' ' + models.length + '个');
            if (models.length > 0) {
                console.log('       ' + models.join(', '));
            }
        }
        console.log('');
    }

    // Summary table
    console.log('========================================================');
    console.log('                      SUMMARY                           ');
    console.log('========================================================');
    console.log('');
    console.log('  Series |  PTI  |  PTO  |  PTH  ');
    console.log('  -------|-------|-------|-------');

    let allPass = true;
    for (const series of ['HC', 'GW']) {
        const pti = results[series].PTI.length;
        const pto = results[series].PTO.length;
        const pth = results[series].PTH.length;
        const ptiS = pti > 0 ? '✅ ' + String(pti).padStart(2) : '❌  0';
        const ptoS = pto > 0 ? '✅ ' + String(pto).padStart(2) : '❌  0';
        const pthS = pth > 0 ? '✅ ' + String(pth).padStart(2) : '❌  0';
        console.log('  ' + series + '     | ' + ptiS + ' | ' + ptoS + ' | ' + pthS);
        if (pti === 0 || pto === 0 || pth === 0) allPass = false;
    }

    console.log('');
    console.log('========================================================');
    console.log(allPass ? '  ✅ ALL 6 COMBINATIONS PASSED' : '  ❌ SOME TESTS FAILED');
    console.log('========================================================\n');
})();
