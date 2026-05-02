#!/usr/bin/env node
/**
 * check-data-drift.js
 * P2#4 (2026-04-24): 数据源漂移检测
 *
 * 检查 completeGearboxData.js (权威源) 与 embeddedData.js (运行时源) 的一致性:
 *   - A: complete 中存在但 embedded 中缺失的型号 → embedded 过期, 需跑 generate-embedded-data.js
 *   - B: embedded 中存在但 complete 中缺失的型号 → 手动变体 (PTO/滑动轴承), 记录待决
 *   - C: 两端字段冲突 (ratio/price 差异 > 5%)
 *
 * 退出码:
 *   0: 一致或仅有 B 类差异 (可接受)
 *   1: 有 A 类差异 (需规整) — 仅在 --strict 模式生效
 *
 * 用法:
 *   node scripts/check-data-drift.js           # 只报告, 退出码 0
 *   node scripts/check-data-drift.js --strict  # A 类差异退出码 1 (供 CI 用)
 *   node scripts/check-data-drift.js --json    # 机器可读 JSON 输出
 */

const path = require('path');

const strict = process.argv.includes('--strict');
const jsonMode = process.argv.includes('--json');

const { completeGearboxData } = require(path.resolve(__dirname, '../src/data/completeGearboxData.js'));
const { embeddedGearboxData } = require(path.resolve(__dirname, '../src/data/embeddedData.js'));

const normalize = (m) => String(m || '').replace(/\s+/g, '').toUpperCase();

// 汇总 embedded 所有型号 (跨集合)
const embeddedModels = new Map(); // normalized model → entry
for (const key of Object.keys(embeddedGearboxData)) {
  const arr = embeddedGearboxData[key];
  if (!Array.isArray(arr)) continue;
  for (const g of arr) {
    if (g && g.model) embeddedModels.set(normalize(g.model), g);
  }
}

const completeModels = new Map();
for (const g of completeGearboxData) {
  if (g && g.model) completeModels.set(normalize(g.model), g);
}

// A: complete 有 embedded 缺
const missingInEmbedded = [];
for (const [key, entry] of completeModels) {
  if (!embeddedModels.has(key)) missingInEmbedded.push(entry.model);
}

// B: embedded 有 complete 缺
const missingInComplete = [];
for (const [key, entry] of embeddedModels) {
  if (!completeModels.has(key)) missingInComplete.push(entry.model);
}

// C: 字段冲突 (ratio 与 price 抽查)
const conflicts = [];
for (const [key, cpl] of completeModels) {
  const emb = embeddedModels.get(key);
  if (!emb) continue;
  // ratio 对比 (都是数组)
  const cplRatios = Array.isArray(cpl.ratios) ? cpl.ratios : [];
  const embRatios = Array.isArray(emb.ratios) ? emb.ratios : [];
  if (cplRatios.length !== embRatios.length && cplRatios.length > 0 && embRatios.length > 0) {
    conflicts.push({ model: cpl.model, field: 'ratios', complete: cplRatios.length, embedded: embRatios.length });
  }
  // price 对比 (允许 ±5%)
  const cplPrice = Number(cpl.price) || 0;
  const embPrice = Number(emb.price) || Number(emb.basePrice) || 0;
  if (cplPrice > 0 && embPrice > 0) {
    const diff = Math.abs(cplPrice - embPrice) / Math.max(cplPrice, embPrice);
    if (diff > 0.05) {
      conflicts.push({ model: cpl.model, field: 'price', complete: cplPrice, embedded: embPrice, diffPct: (diff * 100).toFixed(1) + '%' });
    }
  }
}

const result = {
  _meta: { generatedAt: new Date().toISOString(), strict },
  counts: {
    complete: completeModels.size,
    embedded: embeddedModels.size,
    missingInEmbedded: missingInEmbedded.length,
    missingInComplete: missingInComplete.length,
    conflicts: conflicts.length
  },
  missingInEmbedded: missingInEmbedded.slice(0, 30),
  missingInComplete: missingInComplete.slice(0, 30),
  conflicts: conflicts.slice(0, 30)
};

if (jsonMode) {
  console.log(JSON.stringify(result, null, 2));
  process.exit(strict && missingInEmbedded.length > 0 ? 1 : 0);
}

console.log('='.repeat(62));
console.log('  数据源漂移检测  (completeGearboxData ↔ embeddedData)');
console.log('='.repeat(62));
console.log(`  complete 型号: ${result.counts.complete}`);
console.log(`  embedded 型号: ${result.counts.embedded}`);
console.log('');

if (missingInEmbedded.length > 0) {
  console.log(`[A] complete 中存在但 embedded 中缺失: ${missingInEmbedded.length} 条`);
  console.log('    → 需运行 \`node scripts/generate-embedded-data.js\` 再部署');
  missingInEmbedded.slice(0, 10).forEach((m) => console.log('     · ' + m));
  if (missingInEmbedded.length > 10) console.log(`     ... 还有 ${missingInEmbedded.length - 10} 条`);
  console.log('');
}

if (missingInComplete.length > 0) {
  console.log(`[B] embedded 中存在但 complete 中缺失: ${missingInComplete.length} 条 (通常是 PTO/滑动轴承变体)`);
  missingInComplete.slice(0, 10).forEach((m) => console.log('     · ' + m));
  if (missingInComplete.length > 10) console.log(`     ... 还有 ${missingInComplete.length - 10} 条`);
  console.log('    → 评估是否合规化到 complete 或保持为 embedded 手动变体');
  console.log('');
}

if (conflicts.length > 0) {
  console.log(`[C] 字段冲突: ${conflicts.length} 条`);
  conflicts.slice(0, 10).forEach((c) => {
    if (c.field === 'ratios') {
      console.log(`     · ${c.model.padEnd(22)} ratios 长度: complete=${c.complete} vs embedded=${c.embedded}`);
    } else {
      console.log(`     · ${c.model.padEnd(22)} ${c.field}: complete=¥${c.complete} vs embedded=¥${c.embedded} (${c.diffPct})`);
    }
  });
  if (conflicts.length > 10) console.log(`     ... 还有 ${conflicts.length - 10} 条`);
  console.log('');
}

if (missingInEmbedded.length === 0 && missingInComplete.length === 0 && conflicts.length === 0) {
  console.log('✓ 两源完全一致');
}

console.log('='.repeat(62));

if (strict && missingInEmbedded.length > 0) {
  console.error(`\n✗ Strict 模式: 发现 ${missingInEmbedded.length} 条 A 类差异, 退出码 1`);
  process.exit(1);
}
