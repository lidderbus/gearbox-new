#!/usr/bin/env node
/**
 * 价格冲突分类脚本 (v59 P0-A)
 *
 * 输入: reports/data-drift-20260424.json (由 check-data-drift 生成)
 * 输出: reports/price-conflicts-pending-finance.json
 *
 * 分档:
 *   - tier_high   (>=50%): 必须财务签字, 不自动选边
 *   - tier_medium (20-50%): 财务确认后选权威源
 *   - tier_low    (<20%): 可按 "complete 较新" 原则统一, 但仍提示
 */

const fs = require('fs');
const path = require('path');

const DRIFT_PATH = path.join(__dirname, '..', 'reports', 'data-drift-20260424.json');
const OUT_PATH = path.join(__dirname, '..', 'reports', 'price-conflicts-pending-finance.json');

if (!fs.existsSync(DRIFT_PATH)) {
  console.error(`[ERROR] 找不到 ${DRIFT_PATH}, 请先 npm run check:data-drift`);
  process.exit(1);
}

const drift = JSON.parse(fs.readFileSync(DRIFT_PATH, 'utf-8'));
const conflicts = (drift.conflicts || []).filter(c => c.field === 'price');

const parsePct = (s) => parseFloat(String(s).replace('%', '')) || 0;

const tier_high = [];
const tier_medium = [];
const tier_low = [];

for (const c of conflicts) {
  const pct = parsePct(c.diffPct);
  const item = {
    model: c.model,
    complete: c.complete,
    embedded: c.embedded,
    diffPct: c.diffPct,
    suggestion: c.complete > c.embedded ? 'complete-newer' : 'embedded-newer',
    delta: Math.abs(c.complete - c.embedded)
  };
  if (pct >= 50) tier_high.push(item);
  else if (pct >= 20) tier_medium.push(item);
  else tier_low.push(item);
}

const out = {
  _meta: {
    generatedAt: new Date().toISOString(),
    sourceReport: 'reports/data-drift-20260424.json',
    rule: '权威源选定: gearboxPricing.js (主) — 此报告作为财务审签清单, 签字后回填到 src/data/'
  },
  summary: {
    total: conflicts.length,
    tier_high_count: tier_high.length,
    tier_medium_count: tier_medium.length,
    tier_low_count: tier_low.length
  },
  tier_high_pending_finance_signature: tier_high,
  tier_medium_finance_pick_authoritative: tier_medium,
  tier_low_auto_unify_complete_newer: tier_low
};

fs.writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8');

console.log(`\n=== 价格冲突分档完成 ===`);
console.log(`总冲突: ${conflicts.length}`);
console.log(`高危  (>=50%): ${tier_high.length} 条 (强制财务签字)`);
console.log(`中危 (20-50%): ${tier_medium.length} 条 (财务确认权威源)`);
console.log(`低危  (<20%): ${tier_low.length} 条 (自动统一以 complete 为准)`);
console.log(`\n报告: ${OUT_PATH}\n`);
