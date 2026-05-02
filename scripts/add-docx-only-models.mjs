#!/usr/bin/env node
// 把 docx 独有但 DB 缺的 5 个 (倾角) 变体加进 DB
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src/data/completeGearboxData.js');
const MANUAL = path.join(ROOT, 'scripts/audit-data/manual-from-docx.json');
const DRY = process.argv.includes('--dry');

function fmtNum(n) {
  if (n == null) return 'null';
  if (Number.isInteger(n)) return String(n);
  return n.toFixed(4).replace(/0+$/, '').replace(/\.$/, '');
}

function buildEntry(m) {
  const series = m.model.match(/^([A-Z]+)/)?.[1] || 'OTHER';
  const ratiosStr = m.ratios.map(r => '      ' + fmtNum(r)).join(',\n');
  const capsStr = m.capacities.map(c => '      ' + fmtNum(c)).join(',\n');
  const maxPower = m.capacities.length && m.maxSpeed
    ? Math.round(Math.max(...m.capacities) * m.maxSpeed)
    : 0;
  const minPower = m.capacities.length && m.minSpeed
    ? Math.round(Math.min(...m.capacities) * m.minSpeed * 0.4)
    : 0;
  return `,
  {
    "model": ${JSON.stringify(m.model)},
    "series": ${JSON.stringify(series)},
    "minSpeed": ${m.minSpeed},
    "maxSpeed": ${m.maxSpeed},
    "ratios": [
${ratiosStr}
    ],
    "transmissionCapacityPerRatio": [
${capsStr}
    ],
    "thrust": ${m.thrust ?? 0},
    "centerDistance": ${m.centerDistance ?? 0},
    "dimensions": ${JSON.stringify(m.dimensions || '')},
    "weight": ${m.weight ?? 0},
    "source": "杭齿厂选型手册2025版5月版",
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": ${maxPower},
    "minPower": ${minPower},
    "powerSource": "传动能力计算"
  }`;
}

const manual = JSON.parse(fs.readFileSync(MANUAL, 'utf8'));
let src = fs.readFileSync(SRC, 'utf8');
const dbSet = new Set();
const re = /"model":\s*"([^"]+)"/g;
for (const m of src.matchAll(re)) dbSet.add(m[1]);

const newOnes = manual.filter(m => !dbSet.has(m.model));
console.log(`找到 ${newOnes.length} 个 docx 独有, DB 缺的型号`);

if (newOnes.length === 0) {
  console.log('无需添加');
  process.exit(0);
}

// 找数组最末 } 之前插入
const lastBrace = src.lastIndexOf(']');
const beforeLast = src.lastIndexOf('}', lastBrace);
if (beforeLast === -1) { console.error('找不到末尾 }'); process.exit(1); }

const additions = newOnes.map(m => {
  console.log(`  + ${m.model} (kind=${m.kind})`);
  return buildEntry(m);
}).join('');

const newSrc = src.slice(0, beforeLast + 1) + additions + src.slice(beforeLast + 1);

if (DRY) console.log('[DRY] 未写入');
else { fs.writeFileSync(SRC, newSrc, 'utf8'); console.log('已写入'); }
