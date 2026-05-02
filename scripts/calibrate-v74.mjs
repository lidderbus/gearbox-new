#!/usr/bin/env node
// v74 校准: 仅在速比集 1:1 一致时, 用 docx 真值修正 caps + 同步 maxPower (= max(caps) × maxSpeed)
// 覆盖 Type C (HCS/HCTS/HCDS 双级) + Type D (HCG/HCAG 4 容量分级 — 取持续 C 列) + Type F (PTI 主输入)
// 不动 Type E (2GWH) 与速比集不同的型号 — 留待人工审
// 用法: node scripts/calibrate-v74.mjs [--dry]
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
  return n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}

function buildArr(name, arr) {
  return `${JSON.stringify(name)}: [\n${arr.map(v => `      ${fmtNum(v)}`).join(',\n')}\n    ]`;
}

function replaceArr(block, field, arr) {
  const re = new RegExp(`("${field}"\\s*:\\s*)\\[[\\s\\S]*?\\]`);
  return block.match(re) ? block.replace(re, buildArr(field, arr)) : null;
}

function replaceScalar(block, field, val) {
  const re = new RegExp(`("${field}"\\s*:\\s*)([^,\\n}]+)`);
  if (!re.test(block)) return null;
  return block.replace(re, `$1${typeof val === 'string' ? JSON.stringify(val) : fmtNum(val)}`);
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

for (const m of manual) {
  if (!['C', 'D', 'F'].includes(m.kind)) continue;
  const r = findRange(src, m.model);
  if (!r) continue;
  let block = src.slice(r[0], r[1]);
  const dRatios = readArr(block, 'ratios');

  // 仅速比集 1:1 一致时才动
  if (!arrEq(m.ratios, dRatios)) continue;

  const before = block;
  const dCaps = readArr(block, 'transmissionCapacityPerRatio') || [];
  const changes = [];

  if (m.capacities?.length && !arrEq(m.capacities, dCaps)) {
    const nb = replaceArr(block, 'transmissionCapacityPerRatio', m.capacities);
    if (nb) {
      block = nb;
      changes.push(`caps[${m.kind}] ${dCaps.join(',')} → ${m.capacities.join(',')}`);
      // 同步 maxPower (= max(caps) × maxSpeed) — 现存 maxPower 是基于错误 caps 算的
      const dMaxSpeed = readScalar(block, 'maxSpeed');
      if (dMaxSpeed) {
        const newMaxPower = Math.round(Math.max(...m.capacities) * dMaxSpeed);
        const dMaxPower = readScalar(block, 'maxPower');
        if (dMaxPower != null && Math.abs(dMaxPower - newMaxPower) > Math.max(5, newMaxPower * 0.05)) {
          const nb2 = replaceScalar(block, 'maxPower', newMaxPower);
          if (nb2) { block = nb2; changes.push(`maxPower ${dMaxPower}→${newMaxPower}`); }
        }
        // minPower (= max(caps) × minSpeed × 0.4 经验式) — 保守不动
      }
    }
  }

  if (block !== before) {
    src = src.slice(0, r[0]) + block + src.slice(r[1]);
    log.push(`[${m.kind}] ${m.model}: ${changes.join(' | ')}`);
    n++;
  }
}

console.log(log.join('\n'));
console.log(`\n========== 汇总 ==========`);
console.log(`共改 ${n} 个型号`);
if (DRY) console.log('\n[DRY RUN] 未写入');
else { fs.writeFileSync(SRC, src, 'utf8'); console.log('\n已写入', SRC); }
