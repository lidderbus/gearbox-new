#!/usr/bin/env node
/**
 * audit-price-coverage.js
 * 产出三张表:
 *   1) 完整型号 vs pricing 表差集 (真实无价数量)
 *   2) ERP marketEnrichment 近 12 月销售 TOP50 与无价交集
 *   3) GW 系列变体 (带 PTO / 滑动轴承 / (2-6:1) 后缀) 的 pricing 匹配率
 *
 * 用法:  node scripts/audit-price-coverage.js
 *       node scripts/audit-price-coverage.js --json    (机器可读输出)
 */

const path = require('path');
const fs = require('fs');

const { gearboxPriceData } = require(path.resolve(__dirname, '../src/data/gearboxPricing.js'));
const { completeGearboxData } = require(path.resolve(__dirname, '../src/data/completeGearboxData.js'));
const { embeddedGearboxData } = require(path.resolve(__dirname, '../src/data/embeddedData.js'));
const marketEnrichment = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../src/data/marketEnrichment.json'), 'utf8')
);

const jsonOutput = process.argv.includes('--json');

const normalize = (model) => String(model || '').replace(/\s+/g, '').toUpperCase();
const stripRatioSuffix = (model) => normalize(model).replace(/\([^)]*\)$/, '');

const priceSet = new Set(gearboxPriceData.map((r) => normalize(r.model)));
const priceSetBase = new Set(gearboxPriceData.map((r) => stripRatioSuffix(r.model)));

const allEmbedded = [];
for (const k of Object.keys(embeddedGearboxData)) {
  const v = embeddedGearboxData[k];
  if (Array.isArray(v)) allEmbedded.push(...v);
}

const completeModels = completeGearboxData.map((g) => g.model).filter(Boolean);
const embeddedModels = allEmbedded.map((g) => g.model).filter(Boolean);

// ==== Table 1: 差集 ====
const missInComplete = completeModels.filter(
  (m) => !priceSet.has(normalize(m)) && !priceSetBase.has(stripRatioSuffix(m))
);
const missInEmbedded = embeddedModels.filter(
  (m) => !priceSet.has(normalize(m)) && !priceSetBase.has(stripRatioSuffix(m))
);

// embedded 有自带 price 字段也算有价
const embeddedNoInlinePrice = allEmbedded
  .filter((g) => !g.price && !g.basePrice)
  .map((g) => g.model);

// ==== Table 3: GW 系列变体分析 ====
const gwVariants = [...embeddedModels, ...completeModels].filter((m) =>
  /^(GWC|GWS|GWD|GWH|GWL|GWK|SGW)/i.test(m || '')
);
const gwVariantsUniq = [...new Set(gwVariants)];
const gwSuffixVariants = gwVariantsUniq.filter(
  (m) => /\([^)]+\)/.test(m) || /带\s*PTO/i.test(m) || /滑动轴承/.test(m)
);
const gwSuffixMatched = gwSuffixVariants.filter((m) => priceSet.has(normalize(m)));

// ==== Table 2: TOP50 销售 ∩ 无价 ====
const hotSellers = Object.entries(marketEnrichment.records || {})
  .map(([model, rec]) => ({
    model,
    salesCount: rec.salesCount || 0,
    salesRevenue: rec.salesRevenue || 0,
    avgSalePrice: rec.avgSalePrice,
    lastSoldDate: rec.lastSoldDate
  }))
  .sort((a, b) => b.salesCount - a.salesCount)
  .slice(0, 50);

const top50NoPrice = hotSellers.filter((h) => {
  const n = normalize(h.model);
  const b = stripRatioSuffix(h.model);
  return !priceSet.has(n) && !priceSetBase.has(b);
});

// ==== 输出 ====
const summary = {
  counts: {
    pricingEntries: gearboxPriceData.length,
    completeGearboxDataModels: completeModels.length,
    embeddedGearboxDataModels: embeddedModels.length,
    marketEnrichmentRecords: Object.keys(marketEnrichment.records || {}).length
  },
  table1_missingPrice: {
    completeWithoutPrice: missInComplete.length,
    completeWithoutPriceRate:
      ((missInComplete.length / completeModels.length) * 100).toFixed(1) + '%',
    embeddedWithoutPrice: missInEmbedded.length,
    embeddedWithoutPriceRate:
      ((missInEmbedded.length / embeddedModels.length) * 100).toFixed(1) + '%',
    embeddedWithoutInlinePrice: embeddedNoInlinePrice.length,
    samplesComplete: missInComplete.slice(0, 15),
    samplesEmbedded: missInEmbedded.slice(0, 15)
  },
  table2_topSellersNoPrice: {
    top50Checked: hotSellers.length,
    top50NoPriceCount: top50NoPrice.length,
    top50NoPriceRate: ((top50NoPrice.length / hotSellers.length) * 100).toFixed(1) + '%',
    top50NoPrice: top50NoPrice.map((h) => ({
      model: h.model,
      salesCount: h.salesCount,
      salesRevenue: h.salesRevenue,
      avgSalePrice: h.avgSalePrice,
      lastSoldDate: h.lastSoldDate
    }))
  },
  table3_gwVariants: {
    allGwUnique: gwVariantsUniq.length,
    gwWithSuffix: gwSuffixVariants.length,
    gwSuffixPriced: gwSuffixMatched.length,
    gwSuffixMissingRate:
      gwSuffixVariants.length > 0
        ? (
            ((gwSuffixVariants.length - gwSuffixMatched.length) /
              gwSuffixVariants.length) *
            100
          ).toFixed(1) + '%'
        : '0%',
    unpriced: gwSuffixVariants.filter((m) => !priceSet.has(normalize(m))).slice(0, 20)
  }
};

if (jsonOutput) {
  console.log(JSON.stringify(summary, null, 2));
  process.exit(0);
}

console.log('='.repeat(70));
console.log('齿轮箱选型系统 · 价格覆盖核查报告');
console.log('生成时间:', new Date().toISOString());
console.log('='.repeat(70));

console.log('\n【计数概览】');
console.log(`  gearboxPriceData 条目: ${summary.counts.pricingEntries}`);
console.log(`  completeGearboxData 型号: ${summary.counts.completeGearboxDataModels}`);
console.log(`  embeddedGearboxData 型号: ${summary.counts.embeddedGearboxDataModels}`);
console.log(`  marketEnrichment 富化型号: ${summary.counts.marketEnrichmentRecords}`);

console.log('\n【表 1 · 真实无价覆盖率】');
console.log(
  `  complete 无价: ${summary.table1_missingPrice.completeWithoutPrice} (${summary.table1_missingPrice.completeWithoutPriceRate})`
);
console.log(
  `  embedded 无价: ${summary.table1_missingPrice.embeddedWithoutPrice} (${summary.table1_missingPrice.embeddedWithoutPriceRate})`
);
console.log(
  `  embedded 无 inline price: ${summary.table1_missingPrice.embeddedWithoutInlinePrice}`
);
console.log('  complete 无价样例:');
summary.table1_missingPrice.samplesComplete.forEach((m) =>
  console.log(`    · ${m}`)
);

console.log('\n【表 2 · ERP 销售 TOP50 × 无价交集】');
console.log(
  `  TOP50 无价型号: ${summary.table2_topSellersNoPrice.top50NoPriceCount} / 50 (${summary.table2_topSellersNoPrice.top50NoPriceRate})`
);
console.log('  明细 (按销售台数降序):');
summary.table2_topSellersNoPrice.top50NoPrice.forEach((h) => {
  console.log(
    `    · ${h.model.padEnd(24)} 台数=${String(h.salesCount).padStart(
      3
    )}  收入=¥${String(h.salesRevenue).padStart(10)}  均价=${
      h.avgSalePrice ? '¥' + h.avgSalePrice : 'N/A'
    }  最近=${h.lastSoldDate}`
  );
});

console.log('\n【表 3 · GW 系列变体 pricing 匹配率】');
console.log(`  GW 唯一型号总数: ${summary.table3_gwVariants.allGwUnique}`);
console.log(
  `  含后缀变体 (PTO/滑动轴承/(x-y:1)): ${summary.table3_gwVariants.gwWithSuffix}`
);
console.log(
  `  其中 pricing 命中: ${summary.table3_gwVariants.gwSuffixPriced} / ${summary.table3_gwVariants.gwWithSuffix} (缺失率 ${summary.table3_gwVariants.gwSuffixMissingRate})`
);
console.log('  未命中样例:');
summary.table3_gwVariants.unpriced.forEach((m) => console.log(`    · ${m}`));

console.log('\n' + '='.repeat(70));
console.log('建议:');
console.log('  ① complete/embedded 无价型号全部走 "询价" 优雅降级');
console.log('  ② TOP50 中无价的型号按销量补录 真实售价 (可参考 avgSalePrice)');
console.log('  ③ GW 后缀变体统一纳入 gearboxPriceData (或用 stripSuffix fallback)');
console.log('='.repeat(70));
