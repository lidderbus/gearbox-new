#!/usr/bin/env node
/**
 * patch-ct-from-pdf-20260521.js
 *
 * 应用 PDF 真实 ratios/capacities 数据到 completeGearboxData.js + embeddedData.js
 *
 * 数据源: scripts/audit-data/manual-from-pdf-20260521.json (107 模型, PDF 视觉核对)
 *
 * 逻辑:
 *   1. 备份原文件 (.bak-ct-20260521)
 *   2. 对每个 PDF 模型, 在 complete (transmissionCapacityPerRatio) + embedded (transferCapacity) 找 block
 *   3. 整体替换 ratios + transmissionCapacityPerRatio/transferCapacity 数组
 *   4. 重算 maxPower = max(Ct) * maxSpeed, minPower = min(Ct) * minSpeed
 *   5. 输出修复明细
 *
 * Usage:
 *   node scripts/patch-ct-from-pdf-20260521.js                  # dry-run, 打印计划
 *   node scripts/patch-ct-from-pdf-20260521.js --apply          # 实际写文件
 *   node scripts/patch-ct-from-pdf-20260521.js --apply --model=HCQ700  # 单模型
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PDF_JSON = path.join(ROOT, 'scripts/audit-data/manual-from-pdf-20260521.json');
const COMPLETE_JS = path.join(ROOT, 'src/data/completeGearboxData.js');
const EMBEDDED_JS = path.join(ROOT, 'src/data/embeddedData.js');

const APPLY = process.argv.includes('--apply');
const SINGLE = (process.argv.find(a => a.startsWith('--model=')) || '').slice(8) || null;

const pdf = JSON.parse(fs.readFileSync(PDF_JSON, 'utf8'));
const pdfFiltered = SINGLE ? pdf.filter(m => m.model === SINGLE) : pdf.filter(m => m.verified === true);

console.log(`\n=== PDF Ct Patch — ${APPLY ? 'APPLY' : 'DRY-RUN'} ===`);
console.log(`PDF source: ${PDF_JSON}`);
console.log(`Models considered: ${pdfFiltered.length} (verified=true)`);
console.log();

// === Backup helpers ===
function backup(filePath) {
  const bak = `${filePath}.bak-ct-20260521`;
  if (!fs.existsSync(bak)) {
    fs.copyFileSync(filePath, bak);
    console.log(`  Backup created: ${bak}`);
  }
}

// === Patch function ===
function findModelBlock(src, modelName) {
  // Find { ... "model": "modelName" ... } using proper brace counting (handles nested objects).
  // Strategy: find the literal "model": "modelName" string, then walk backward to enclosing { and forward to matching }.
  const escName = modelName.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
  const fieldRe = new RegExp(`"?model"?\\s*:\\s*"${escName}"`, 'g');
  const results = [];
  let m;
  while ((m = fieldRe.exec(src)) !== null) {
    const fieldIdx = m.index;
    // Walk backward to find enclosing {
    let depth = 0;
    let start = -1;
    for (let i = fieldIdx; i >= 0; i--) {
      const c = src[i];
      if (c === '}') depth++;
      else if (c === '{') {
        if (depth === 0) { start = i; break; }
        depth--;
      }
    }
    if (start < 0) continue;
    // Walk forward to find matching }
    depth = 1;
    let end = -1;
    for (let i = start + 1; i < src.length; i++) {
      const c = src[i];
      if (c === '{') depth++;
      else if (c === '}') {
        depth--;
        if (depth === 0) { end = i; break; }
      }
    }
    if (end < 0) continue;
    const block = src.slice(start, end + 1);
    // Sanity: must contain the original model field
    if (!block.includes(`"${modelName}"`)) continue;
    // Filter to ONLY top-level model definitions (not nested coupling refs)
    // Top-level blocks always have ratios or model as first-level fields
    if (!/"?ratios"?\s*:/.test(block)) continue;
    results.push([block, block]);
  }
  return results;
}

function patchArray(blockSrc, fieldName, newArr) {
  // Replace the array assigned to a field within the block
  // Match: "field": [...] OR field: [...] in JSON-like JS
  const escField = fieldName.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
  // pattern: "fieldName" : [ anything until matching ] (no nested brackets typically)
  const re = new RegExp(
    `("?${escField}"?\\s*:\\s*)\\[[^\\]]*\\]`,
    'g'
  );
  const formatted = JSON.stringify(newArr);
  let count = 0;
  const out = blockSrc.replace(re, (m, prefix) => {
    count++;
    return `${prefix}${formatted}`;
  });
  return { src: out, count };
}

function patchScalar(blockSrc, fieldName, value) {
  const escField = fieldName.replace(/[.*+?^${}()|[\]\\\/]/g, '\\$&');
  const re = new RegExp(
    `("?${escField}"?\\s*:\\s*)([0-9.eE+-]+)`,
    'g'
  );
  let count = 0;
  const out = blockSrc.replace(re, (m, prefix, oldVal) => {
    count++;
    return `${prefix}${value}`;
  });
  return { src: out, count };
}

// === Process completeGearboxData.js ===
function processFile(filePath, capsFieldName) {
  let src = fs.readFileSync(filePath, 'utf8');
  const log = [];
  let patchedCount = 0;

  for (const m of pdfFiltered) {
    const blocks = findModelBlock(src, m.model);
    if (blocks.length === 0) {
      log.push({ model: m.model, status: 'NOT_FOUND' });
      continue;
    }
    if (blocks.length > 1) {
      log.push({ model: m.model, status: 'AMBIGUOUS', count: blocks.length });
      continue;
    }
    const [match] = blocks;
    const oldBlock = match[1];

    // Compare old caps vs new
    const oldCapsMatch = oldBlock.match(new RegExp(`"?${capsFieldName}"?\\s*:\\s*(\\[[^\\]]*\\])`));
    const oldCaps = oldCapsMatch ? JSON.parse(oldCapsMatch[1]) : null;

    // Check if patch needed (caps differ)
    if (oldCaps && oldCaps.length === m.capacities.length &&
        oldCaps.every((v, i) => Math.abs(v - m.capacities[i]) < 0.0001)) {
      log.push({ model: m.model, status: 'ALREADY_OK' });
      continue;
    }

    // Patch
    let newBlock = oldBlock;
    const r1 = patchArray(newBlock, 'ratios', m.ratios);
    newBlock = r1.src;
    const r2 = patchArray(newBlock, capsFieldName, m.capacities);
    newBlock = r2.src;

    // Recompute maxPower/minPower if present
    const maxC = Math.max(...m.capacities);
    const minC = Math.min(...m.capacities);
    const maxPower = +(maxC * m.maxSpeed).toFixed(0);
    const minPower = +(minC * m.minSpeed).toFixed(0);
    const r3 = patchScalar(newBlock, 'maxPower', maxPower);
    newBlock = r3.src;
    const r4 = patchScalar(newBlock, 'minPower', minPower);
    newBlock = r4.src;

    if (newBlock === oldBlock) {
      log.push({ model: m.model, status: 'NO_CHANGE' });
      continue;
    }

    src = src.replace(oldBlock, newBlock);
    patchedCount++;
    log.push({
      model: m.model, status: 'PATCHED',
      capsBefore: oldCaps, capsAfter: m.capacities,
      maxPower, minPower
    });
  }

  return { src, log, patchedCount };
}

// Complete
console.log(`\n--- completeGearboxData.js ---`);
const r1 = processFile(COMPLETE_JS, 'transmissionCapacityPerRatio');
const summary1 = r1.log.reduce((a, l) => { a[l.status] = (a[l.status] || 0) + 1; return a; }, {});
console.log(`Patched: ${r1.patchedCount} | ${JSON.stringify(summary1)}`);
for (const l of r1.log.filter(x => x.status === 'PATCHED')) {
  console.log(`  ✓ ${l.model.padEnd(15)} caps: ${JSON.stringify(l.capsBefore)} → ${JSON.stringify(l.capsAfter)} | maxP=${l.maxPower} minP=${l.minPower}`);
}
for (const l of r1.log.filter(x => x.status !== 'PATCHED' && x.status !== 'ALREADY_OK')) {
  console.log(`  ⚠ ${l.model.padEnd(15)} ${l.status}`);
}

// Embedded
console.log(`\n--- embeddedData.js ---`);
const r2 = processFile(EMBEDDED_JS, 'transferCapacity');
const summary2 = r2.log.reduce((a, l) => { a[l.status] = (a[l.status] || 0) + 1; return a; }, {});
console.log(`Patched: ${r2.patchedCount} | ${JSON.stringify(summary2)}`);
for (const l of r2.log.filter(x => x.status === 'PATCHED')) {
  console.log(`  ✓ ${l.model.padEnd(15)} caps: ${JSON.stringify(l.capsBefore)} → ${JSON.stringify(l.capsAfter)}`);
}
for (const l of r2.log.filter(x => x.status !== 'PATCHED' && x.status !== 'ALREADY_OK')) {
  console.log(`  ⚠ ${l.model.padEnd(15)} ${l.status}`);
}

if (!APPLY) {
  console.log(`\n[DRY-RUN] No files written. Add --apply to commit changes.`);
  process.exit(0);
}

// Apply
backup(COMPLETE_JS);
backup(EMBEDDED_JS);
fs.writeFileSync(COMPLETE_JS, r1.src);
fs.writeFileSync(EMBEDDED_JS, r2.src);
console.log(`\n✓ Wrote ${COMPLETE_JS}`);
console.log(`✓ Wrote ${EMBEDDED_JS}`);
console.log(`\nDone. Next: npm test, then deploy.`);
