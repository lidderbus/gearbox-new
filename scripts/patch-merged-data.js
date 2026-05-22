#!/usr/bin/env node
/**
 * 用本地 V78 权威 patch 云端 gearbox-data-merged.json 中的错误字段
 * 保留 merged 独有的 29 个 GCST/GCHT 联体型号 + 工程参数字段(efficiency/oilCapacity 等)
 *
 * 修正 BUG:
 *   - HCT1100 maxPower 16910 (字符串拼接污染) → 1607
 *   - HCD2700 maxPower 18288 (污染) → 3360
 *   - HC1000 cd 370 → 335 等 cd 不一致问题 (~125 个)
 *   - 其他 maxPower 偏差 ~326 个
 *
 * 用法:
 *   ssh server cat /var/www/html/gearbox-selection/data/gearbox-data-merged.json > /tmp/merged-old.json
 *   node scripts/patch-merged-data.js /tmp/merged-old.json
 *   产物: /tmp/gearbox-cloud-master/gearbox-data-merged.json (patched)
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const inputPath = process.argv[2] || '/tmp/merged-old.json';
if (!fs.existsSync(inputPath)) {
  console.error('用法: node patch-merged-data.js <merged-old.json>');
  process.exit(1);
}

const { completeGearboxData } = require('../src/data/completeGearboxData.js');
const { legacyGearboxData } = require('../src/data/legacyData.js');

const authMap = {};
for (const r of completeGearboxData) authMap[r.model] = r;
for (const r of legacyGearboxData) if (!authMap[r.model]) authMap[r.model] = { ...r, _isLegacy: true };

const merged = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
console.log(`输入 merged: ${merged.length} 型号`);

// 待 patch 的字段（V78 权威 vs merged 不一致时, 用权威值）
const PATCH_FIELDS = ['centerDistance', 'maxPower', 'minPower', 'maxSpeed', 'minSpeed', 'thrust', 'weight', 'price', 'discountRate', 'ratios', 'transmissionCapacityPerRatio'];

const stats = {
  patched: 0,
  patchedFields: 0,
  preserved: 0,  // 保留 (本地无权威)
  fieldChanges: {},
};

const patched = merged.map(r => {
  const auth = authMap[r.model];
  if (!auth) {
    stats.preserved++;
    return r;  // 保留 GCST/GCHT 联体或其他本地无权威的型号
  }

  let changedThis = false;
  const out = { ...r };
  for (const f of PATCH_FIELDS) {
    if (auth[f] !== undefined && JSON.stringify(auth[f]) !== JSON.stringify(r[f])) {
      out[f] = auth[f];
      changedThis = true;
      stats.patchedFields++;
      stats.fieldChanges[f] = (stats.fieldChanges[f] || 0) + 1;
    }
  }
  // 富化 merged 缺的本地权威字段
  for (const f of ['imageUrl', 'officialImage', 'introduction', 'priceSource']) {
    if (auth[f] && !out[f]) out[f] = auth[f];
  }
  if (changedThis) stats.patched++;
  return out;
});

const json = JSON.stringify(patched, null, 0);
const hash = crypto.createHash('sha256').update(json).digest('hex').slice(0, 16);

const OUT_DIR = '/tmp/gearbox-cloud-master';
fs.mkdirSync(OUT_DIR, { recursive: true });
const outPath = path.join(OUT_DIR, 'gearbox-data-merged.json');
fs.writeFileSync(outPath, json);
fs.writeFileSync(outPath + '.meta', JSON.stringify({
  _version: 'V78-patched',
  _generated: new Date().toISOString(),
  _source: 'merged.json (patched by V78 authority)',
  _hash: hash,
  _stats: stats,
}, null, 2));

console.log('\nPatch 统计:');
console.log(`  改动型号: ${stats.patched}/${merged.length}`);
console.log(`  改动字段总数: ${stats.patchedFields}`);
console.log(`  保留(无本地权威, 含 GCST 联体等): ${stats.preserved}`);
console.log(`  各字段改动数:`);
for (const [f, n] of Object.entries(stats.fieldChanges).sort((a,b)=>b[1]-a[1])) console.log(`    ${f}: ${n}`);

console.log('\n关键样本验证:');
for (const m of ['HC1000', 'HCT1100', 'HCD2700', 'GWC60.66', 'GCST108GCHT108']) {
  const r = patched.find(x => x.model === m);
  if (r) console.log(`  ${m}: cd=${r.centerDistance}, maxPower=${r.maxPower}, price=${r.price}`);
}
console.log(`\n文件: ${outPath} (${fs.statSync(outPath).size} bytes)`);
console.log(`hash: ${hash}`);
