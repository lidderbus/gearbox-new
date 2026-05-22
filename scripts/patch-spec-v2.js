#!/usr/bin/env node
/**
 * 用本地 V78 权威 patch product-spec-v2/products.json 中的字段错误
 * 保持 snake_case + 保留 spec-v2 独有字段 (series_key, source_page, rated_thrust 等)
 * 不引入新字段 (maxPower, price 等), 保持 V2 "专攻规格" 角色
 *
 * 修正:
 *   - center_distance 22 个错误 → V78 真值
 *   - reduction_ratio / weight / dimensions 偏差 → V78 真值
 *
 * 用法: node scripts/patch-spec-v2.js /tmp/spec-v2-old.json
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const inputPath = process.argv[2] || '/tmp/spec-v2-old.json';
const { completeGearboxData } = require('../src/data/completeGearboxData.js');
const { legacyGearboxData } = require('../src/data/legacyData.js');

const authMap = {};
for (const r of completeGearboxData) authMap[r.model] = r;
for (const r of legacyGearboxData) if (!authMap[r.model]) authMap[r.model] = { ...r, _isLegacy: true };

const old = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
console.log(`输入 spec-v2: ${old.length} 型号`);

// 字段映射: spec-v2 (snake_case) ← V78 (camelCase)
const FIELD_MAP = {
  center_distance: 'centerDistance',
  weight: 'weight',
  // dimensions: V78 dimensions 是字符串/对象, spec-v2 也是字符串, 谨慎覆盖, 只在 V78 有且现 spec-v2 无时填补
};

const stats = { patched: 0, fieldChanges: {}, preserved: 0, filledNull: 0 };

const patched = old.map(r => {
  const auth = authMap[r.model];
  if (!auth) {
    stats.preserved++;
    return r;
  }
  let changed = false;
  const out = { ...r };
  for (const [snake, camel] of Object.entries(FIELD_MAP)) {
    const authVal = auth[camel];
    if (authVal === undefined || authVal === null) continue;
    const curVal = r[snake];
    // 数值比较: 容忍数字字符串 vs 数字
    let cur = curVal;
    if (typeof cur === 'string' && !isNaN(parseFloat(cur))) cur = parseFloat(cur);
    if (cur !== authVal) {
      out[snake] = authVal;
      changed = true;
      stats.fieldChanges[snake] = (stats.fieldChanges[snake] || 0) + 1;
      if (curVal === null || curVal === undefined) stats.filledNull++;
    }
  }
  if (changed) stats.patched++;
  return out;
});

const json = JSON.stringify(patched, null, 0);
const hash = crypto.createHash('sha256').update(json).digest('hex').slice(0, 16);

const OUT_DIR = '/tmp/gearbox-cloud-master';
fs.mkdirSync(OUT_DIR, { recursive: true });
const outPath = path.join(OUT_DIR, 'products.json');
fs.writeFileSync(outPath, json);
fs.writeFileSync(outPath + '.meta', JSON.stringify({
  _version: 'V78-spec-v2-patch',
  _generated: new Date().toISOString(),
  _hash: hash,
  _stats: stats,
}, null, 2));

console.log('\nPatch 统计:');
console.log(`  改动型号: ${stats.patched}/${old.length}`);
console.log(`  保留 (无本地权威): ${stats.preserved}`);
console.log(`  填补 null: ${stats.filledNull}`);
console.log(`  各字段改动:`);
for (const [f, n] of Object.entries(stats.fieldChanges).sort((a,b)=>b[1]-a[1])) console.log(`    ${f}: ${n}`);

console.log('\n关键样本验证:');
for (const m of ['HC1000', 'HCT1100', 'HCD2700', 'GWC60.66']) {
  const r = patched.find(x => x.model === m);
  if (r) console.log(`  ${m}: cd=${r.center_distance}, weight=${r.weight}, rated_thrust=${r.rated_thrust}, transmission_capacity=${(r.transmission_capacity||'').toString().slice(0,40)}`);
}
console.log(`\n文件: ${outPath} (${fs.statSync(outPath).size} bytes)`);
console.log(`hash: ${hash}`);
