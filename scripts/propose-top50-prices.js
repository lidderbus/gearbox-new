#!/usr/bin/env node
/**
 * propose-top50-prices.js
 * P1#6 (2026-04-24): 为 TOP50 热销但无价的型号生成 pricing 补录提案
 *
 * 基于 ERP 近 12 月成交均价 (avgSalePrice) 反推 basePrice/discountRate:
 *   factoryPrice ≈ avgSalePrice / (1 + typicalMarkup)   // 默认 markup 10%
 *   basePrice    ≈ factoryPrice / (1 - discountRate)    // 按型号前缀取折扣率
 *
 * 输出两份报告:
 *   reports/top50-price-proposal.json    机器可读 (包含完整上下文)
 *   reports/top50-price-patch.txt        可直接 copy 到 gearboxPriceData.js 的条目
 *
 * 用法: node scripts/propose-top50-prices.js
 */

const path = require('path');
const fs = require('fs');

const { gearboxPriceData, discountRateMap } = require(path.resolve(__dirname, '../src/data/gearboxPricing.js'));
const marketEnrichment = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../src/data/marketEnrichment.json'), 'utf8')
);

const normalize = (m) => String(m || '').replace(/\s+/g, '').toUpperCase();
const priceSet = new Set(gearboxPriceData.map((r) => normalize(r.model)));

// 按前缀推断折扣率
const getDefaultDiscount = (model) => {
  const m = normalize(model);
  const prefixes = Object.keys(discountRateMap).sort((a, b) => b.length - a.length);
  for (const p of prefixes) {
    if (p === 'default') continue;
    if (m.startsWith(normalize(p))) return discountRateMap[p];
  }
  return discountRateMap.default || 0.10;
};

// 按销售台数降序取 TOP50,筛选无价
const top50 = Object.entries(marketEnrichment.records || {})
  .map(([model, rec]) => ({ model, ...rec }))
  .sort((a, b) => b.salesCount - a.salesCount)
  .slice(0, 50);

const missing = top50.filter((r) => !priceSet.has(normalize(r.model)) && r.avgSalePrice);

const MARKUP = 0.1; // 假设均价为出厂价上浮 10% 成交
const proposals = missing.map((rec) => {
  const avg = rec.avgSalePrice;
  const discountRate = getDefaultDiscount(rec.model);
  const factoryPrice = Math.round(avg / (1 + MARKUP));
  const basePrice = Math.round(factoryPrice / (1 - discountRate));
  const discountedPrice = Math.round(basePrice * (1 - discountRate));
  return {
    model: rec.model,
    salesCount: rec.salesCount,
    salesRevenue: rec.salesRevenue,
    avgSalePrice: avg,
    customerCount: rec.customerCount,
    lastSoldDate: rec.lastSoldDate,
    proposal: {
      basePrice,
      discountRate,
      discountedPrice,
      factoryPrice,
      note: `反推自 avgSalePrice ¥${avg} (近 ${rec.salesCount} 台均价),按 markup 10% + 折扣 ${(discountRate * 100).toFixed(0)}% 估算`
    }
  };
});

const reportDir = path.resolve(__dirname, '../reports');
fs.mkdirSync(reportDir, { recursive: true });

fs.writeFileSync(
  path.join(reportDir, 'top50-price-proposal.json'),
  JSON.stringify({ _meta: { generatedAt: new Date().toISOString(), markup: MARKUP, count: proposals.length }, proposals }, null, 2)
);

const patchLines = proposals.map(
  (p) => `  { model: '${p.model}', basePrice: ${p.proposal.basePrice}, discountRate: ${p.proposal.discountRate}, discountedPrice: ${p.proposal.discountedPrice} },  // TOP50 补录 ¥${p.avgSalePrice}×${p.salesCount}台`
);
fs.writeFileSync(
  path.join(reportDir, 'top50-price-patch.txt'),
  `// 建议追加到 src/data/gearboxPricing.js 的 gearboxPriceData 数组\n// 生成于 ${new Date().toISOString()}\n// 审核后请由人工确认每条折扣率是否准确\n\n${patchLines.join('\n')}\n`
);

console.log('='.repeat(60));
console.log('TOP50 无价型号补录提案');
console.log('='.repeat(60));
console.log(`输入: marketEnrichment.records ${Object.keys(marketEnrichment.records).length} 条 · pricingData 已有 ${gearboxPriceData.length} 条`);
console.log(`产出: ${proposals.length} 条补录提案`);
console.log('');
proposals.forEach((p) => {
  console.log(`  ${p.model.padEnd(12)} 均价 ¥${String(p.avgSalePrice).padStart(7)} × ${p.salesCount} 台  →  basePrice ¥${p.proposal.basePrice.toLocaleString()}  折扣 ${(p.proposal.discountRate * 100).toFixed(0)}%`);
});
console.log('');
console.log(`✓ JSON 报告: reports/top50-price-proposal.json`);
console.log(`✓ 可粘贴 patch: reports/top50-price-patch.txt`);
console.log('='.repeat(60));
console.log('提醒: 折扣率按前缀估算,财务审核后再合入 gearboxPriceData');
