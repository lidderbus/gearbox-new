#!/usr/bin/env node
// v73 校准: 用 docx 解析的真值覆写 DB. 修正 v72 (基于错误 small-*.json) 的回归.
// 用法: node scripts/calibrate-v73.mjs [--dry]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src/data/completeGearboxData.js');
const MANUAL = path.join(ROOT, 'scripts/audit-data/manual-from-docx.json');
const DRY = process.argv.includes('--dry');
const TOL = 0.0015;

function findRange(src, model) {
  const anchor = `"model": ${JSON.stringify(model)},`;
  const idx = src.indexOf(anchor);
  if (idx === -1) return null;
  const open = src.lastIndexOf('{', idx);
  if (open === -1) return null;
  let depth = 0, i = open, inStr = false, strCh = '', esc = false;
  for (; i < src.length; i++) {
    const c = src[i];
    if (inStr) {
      if (esc) { esc = false; continue; }
      if (c === '\\') { esc = true; continue; }
      if (c === strCh) inStr = false;
      continue;
    }
    if (c === '"' || c === "'") { inStr = true; strCh = c; continue; }
    if (c === '{') depth++;
    else if (c === '}') { depth--; if (depth === 0) return [open, i + 1]; }
  }
  return null;
}

function fmtNum(n) {
  if (Number.isInteger(n)) return String(n);
  let s = n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

function buildArr(name, arr, indent = '    ') {
  return `${JSON.stringify(name)}: [\n${arr.map(v => `${indent}  ${fmtNum(v)}`).join(',\n')}\n${indent}]`;
}

function replaceArr(block, field, arr) {
  const re = new RegExp(`("${field}"\\s*:\\s*)\\[[\\s\\S]*?\\]`);
  return block.match(re) ? block.replace(re, buildArr(field, arr)) : null;
}

function replaceScalar(block, field, val) {
  const re = new RegExp(`("${field}"\\s*:\\s*)([^,\\n}]+)`);
  if (!re.test(block)) return null;
  const v = typeof val === 'string' ? JSON.stringify(val) : fmtNum(val);
  return block.replace(re, `$1${v}`);
}

function readArr(block, field) {
  const m = block.match(new RegExp(`"${field}"\\s*:\\s*\\[([\\s\\S]*?)\\]`));
  return m ? m[1].split(',').map(s => s.trim()).filter(Boolean).map(Number) : null;
}

function readScalar(block, field) {
  const m = block.match(new RegExp(`"${field}"\\s*:\\s*([^,\\n}]+)`));
  if (!m) return null;
  const v = m[1].trim();
  return v.startsWith('"') ? JSON.parse(v) : Number(v);
}

const arrEq = (a, b) => a && b && a.length === b.length && a.every((x, i) => Math.abs(x - b[i]) <= TOL);

const manual = JSON.parse(fs.readFileSync(MANUAL, 'utf8'));
let src = fs.readFileSync(SRC, 'utf8');
const log = [];
let n = 0;

// 1. 移除 v72 的幽灵 04A (docx 真名 40A 已存在且更早)
const r04A = findRange(src, '04A');
if (r04A) {
  // 寻找前置逗号或后置逗号一并删除以保持数组合法
  let before = src.slice(0, r04A[0]);
  let after = src.slice(r04A[1]);
  // 后置逗号情况: ', \n  {' → 保留前面那条记录的尾逗号, 删除自己以及紧随的逗号
  if (after.startsWith(',')) after = after.slice(1);
  else if (before.match(/,\s*$/)) before = before.replace(/,\s*$/, '');
  src = before + after;
  log.push(`[REMOVED] 04A 幽灵副本 (v72 误增, 真名为 40A)`);
  n++;
}

// 2. 应用 docx 值
for (const m of manual) {
  const r = findRange(src, m.model);
  if (!r) { log.push(`[SKIP] ${m.model} not in DB`); continue; }
  let block = src.slice(r[0], r[1]);
  const before = block;
  const changes = [];

  if (m.ratios?.length) {
    const dR = readArr(block, 'ratios');
    if (!arrEq(m.ratios, dR)) {
      const nb = replaceArr(block, 'ratios', m.ratios);
      if (nb) { block = nb; changes.push(`r ${dR?.length||0}->${m.ratios.length}`); }
    }
  }
  if (m.capacities?.length) {
    const dC = readArr(block, 'transmissionCapacityPerRatio');
    if (!arrEq(m.capacities, dC)) {
      const nb = replaceArr(block, 'transmissionCapacityPerRatio', m.capacities);
      if (nb) { block = nb; changes.push(`c ${dC?.length||0}->${m.capacities.length}`); }
    }
  }
  for (const f of ['minSpeed', 'maxSpeed']) {
    if (m[f] != null) {
      const dv = readScalar(block, f);
      if (dv != null && Math.abs(dv - m[f]) > 1) {
        const nb = replaceScalar(block, f, m[f]);
        if (nb) { block = nb; changes.push(`${f} ${dv}->${m[f]}`); }
      }
    }
  }
  if (m.thrust != null) {
    const dT = readScalar(block, 'thrust');
    if (dT != null && Math.abs(dT - m.thrust) > 0.5) {
      const nb = replaceScalar(block, 'thrust', m.thrust);
      if (nb) { block = nb; changes.push(`t ${dT}->${m.thrust}`); }
    }
  }
  if (m.centerDistance != null) {
    const dCD = readScalar(block, 'centerDistance');
    if (dCD != null && Math.abs(dCD - m.centerDistance) > 1) {
      const nb = replaceScalar(block, 'centerDistance', m.centerDistance);
      if (nb) { block = nb; changes.push(`cd ${dCD}->${m.centerDistance}`); }
    }
  }
  if (m.weight != null) {
    const dW = readScalar(block, 'weight');
    if (dW != null && Math.abs(dW - m.weight) > m.weight * 0.05) {
      const nb = replaceScalar(block, 'weight', m.weight);
      if (nb) { block = nb; changes.push(`w ${dW}->${m.weight}`); }
    }
  }
  if (m.dimensions) {
    const dD = readScalar(block, 'dimensions');
    const norm = s => String(s||'').replace(/\s/g,'').toLowerCase();
    if (dD && norm(dD) !== norm(m.dimensions)) {
      const nb = replaceScalar(block, 'dimensions', m.dimensions);
      if (nb) { block = nb; changes.push(`d`); }
    }
  }
  if (block !== before) {
    src = src.slice(0, r[0]) + block + src.slice(r[1]);
    log.push(`[FIX] ${m.model}: ${changes.join(', ')}`);
    n++;
  }
}

console.log(log.join('\n'));
console.log(`\n========== 汇总 ==========`);
console.log(`共改 ${n} 处`);
if (DRY) console.log('\n[DRY RUN] 未写入');
else { fs.writeFileSync(SRC, src, 'utf8'); console.log('\n已写入', SRC); }
