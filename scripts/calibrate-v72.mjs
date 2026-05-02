#!/usr/bin/env node
// v72 校准: 按 scripts/audit-data/*.json 把 PDF 真值回写 ratios/transmissionCapacityPerRatio/thrust/dimensions 等; 补 04A
// 用法: node scripts/calibrate-v72.mjs [--dry]
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, 'src/data/completeGearboxData.js');
const AUDIT_DIR = path.join(ROOT, 'scripts/audit-data');
const DRY = process.argv.includes('--dry');

const FLOAT_TOL = 0.002;

function loadPdf() {
  const all = [];
  for (const f of fs.readdirSync(AUDIT_DIR).filter(x => x.endsWith('.json'))) {
    all.push(...JSON.parse(fs.readFileSync(path.join(AUDIT_DIR, f), 'utf8')));
  }
  return all;
}

function findModelBlockRange(src, model) {
  const anchor = `"model": ${JSON.stringify(model)},`;
  const anchorIdx = src.indexOf(anchor);
  if (anchorIdx === -1) return null;
  // 向前找开 {
  let openIdx = src.lastIndexOf('{', anchorIdx);
  if (openIdx === -1) return null;
  // 从 openIdx 开始匹配 brace, 跳过字符串内的 {}
  let depth = 0, i = openIdx, inStr = false, strCh = '', esc = false;
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
    else if (c === '}') {
      depth--;
      if (depth === 0) return [openIdx, i + 1];
    }
  }
  return null;
}

function fmtNum(n) {
  // 保留 PDF 给出的精度 (最多 4 位小数, 去尾零)
  if (Number.isInteger(n)) return String(n);
  let s = n.toFixed(4);
  s = s.replace(/0+$/, '').replace(/\.$/, '');
  return s;
}

function buildArrayBlock(name, arr, indent = '    ') {
  const inner = arr.map(v => `${indent}  ${fmtNum(v)}`).join(',\n');
  return `${JSON.stringify(name)}: [\n${inner}\n${indent}]`;
}

function replaceArrayField(block, fieldName, newArr, indent) {
  const re = new RegExp(`("${fieldName}"\\s*:\\s*)\\[[\\s\\S]*?\\]`);
  const m = block.match(re);
  if (!m) return null;
  const newBlock = buildArrayBlock(fieldName, newArr, indent);
  return block.replace(re, newBlock);
}

function replaceScalarField(block, fieldName, newVal) {
  const re = new RegExp(`("${fieldName}"\\s*:\\s*)([^,\\n}]+)`);
  if (!re.test(block)) return null;
  const fmtV = typeof newVal === 'string' ? JSON.stringify(newVal) : fmtNum(newVal);
  return block.replace(re, `$1${fmtV}`);
}

function arrEq(a, b, tol = FLOAT_TOL) {
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (Math.abs(a[i] - b[i]) > tol) return false;
  return true;
}

function dimsEq(a, b) {
  if (!a || !b) return false;
  const norm = s => String(s).replace(/\s/g, '').replace(/×/g, 'x').replace(/X/g, 'x').toLowerCase();
  return norm(a) === norm(b);
}

function readBlockArray(block, fieldName) {
  const re = new RegExp(`"${fieldName}"\\s*:\\s*\\[([\\s\\S]*?)\\]`);
  const m = block.match(re);
  if (!m) return null;
  return m[1].split(',').map(s => s.trim()).filter(s => s !== '').map(Number);
}

function readBlockScalar(block, fieldName) {
  const re = new RegExp(`"${fieldName}"\\s*:\\s*([^,\\n}]+)`);
  const m = block.match(re);
  if (!m) return null;
  const v = m[1].trim();
  if (v.startsWith('"')) return JSON.parse(v);
  return Number(v);
}

const pdfData = loadPdf();
let src = fs.readFileSync(SRC, 'utf8');
const log = [];

// 跳过型号: HCT800/2 ratios (PDF JSON 内部不一致, DB 11/11 配对正确)
const SKIP_FIELDS = {
  'HCT800/2': new Set(['ratios', 'transmissionCapacityPerRatio'])
};

let changedCount = 0;
let modelChangeStats = {};

for (const pdf of pdfData) {
  if (pdf.model === '04A') continue; // 单独处理新增
  const range = findModelBlockRange(src, pdf.model);
  if (!range) {
    log.push(`[MISSING] ${pdf.model} not found in DB`);
    continue;
  }
  let block = src.slice(range[0], range[1]);
  const before = block;
  const skip = SKIP_FIELDS[pdf.model] || new Set();
  const changes = [];

  // 1. ratios
  if (!skip.has('ratios') && pdf.ratios) {
    const dbRatios = readBlockArray(block, 'ratios');
    if (!arrEq(pdf.ratios, dbRatios, 0.02)) {
      const newBlock = replaceArrayField(block, 'ratios', pdf.ratios, '    ');
      if (newBlock) { block = newBlock; changes.push(`ratios ${dbRatios?.length}->${pdf.ratios.length}`); }
    }
  }

  // 2. transmissionCapacityPerRatio
  if (!skip.has('transmissionCapacityPerRatio') && pdf.capacities) {
    const dbCaps = readBlockArray(block, 'transmissionCapacityPerRatio');
    if (!arrEq(pdf.capacities, dbCaps, FLOAT_TOL)) {
      const newBlock = replaceArrayField(block, 'transmissionCapacityPerRatio', pdf.capacities, '    ');
      if (newBlock) { block = newBlock; changes.push(`caps ${dbCaps?.length}->${pdf.capacities.length}`); }
      else log.push(`[WARN] ${pdf.model} 无 transmissionCapacityPerRatio 字段, 跳过`);
    }
  }

  // 3. thrust
  if (pdf.thrust !== undefined && pdf.thrust !== null) {
    const dbT = readBlockScalar(block, 'thrust');
    if (dbT !== null && Math.abs(dbT - pdf.thrust) > 0.5) {
      const newBlock = replaceScalarField(block, 'thrust', pdf.thrust);
      if (newBlock) { block = newBlock; changes.push(`thrust ${dbT}->${pdf.thrust}`); }
    }
  }

  // 4. centerDistance
  if (pdf.centerDistance !== undefined && pdf.centerDistance !== null) {
    const dbCD = readBlockScalar(block, 'centerDistance');
    if (dbCD !== null && Math.abs(dbCD - pdf.centerDistance) > 1) {
      const newBlock = replaceScalarField(block, 'centerDistance', pdf.centerDistance);
      if (newBlock) { block = newBlock; changes.push(`cd ${dbCD}->${pdf.centerDistance}`); }
    }
  }

  // 5. weight
  if (pdf.weight !== undefined && pdf.weight !== null) {
    const dbW = readBlockScalar(block, 'weight');
    if (dbW !== null && Math.abs(dbW - pdf.weight) > 5) {
      const newBlock = replaceScalarField(block, 'weight', pdf.weight);
      if (newBlock) { block = newBlock; changes.push(`wt ${dbW}->${pdf.weight}`); }
    }
  }

  // 6. dimensions
  if (pdf.dimensions) {
    const dbDim = readBlockScalar(block, 'dimensions');
    if (dbDim && !dimsEq(pdf.dimensions, dbDim)) {
      const newBlock = replaceScalarField(block, 'dimensions', pdf.dimensions);
      if (newBlock) { block = newBlock; changes.push(`dim ${dbDim}->${pdf.dimensions}`); }
    }
  }

  if (block !== before) {
    src = src.slice(0, range[0]) + block + src.slice(range[1]);
    changedCount++;
    modelChangeStats[pdf.model] = changes;
    log.push(`[CHANGED] ${pdf.model}: ${changes.join(', ')}`);
  }
}

// 处理 04A: 在 06 之后插入 (按字母数字顺序)
const pdf04A = pdfData.find(p => p.model === '04A');
if (pdf04A && !src.includes('"model": "04A"')) {
  // 找到 06 块, 在其后面插入
  const range06 = findModelBlockRange(src, '06');
  if (range06) {
    const newEntry = `,
  {
    "model": "04A",
    "series": "other",
    "minSpeed": ${pdf04A.minSpeed},
    "maxSpeed": ${pdf04A.maxSpeed},
    "ratios": [
${pdf04A.ratios.map(r => '      ' + fmtNum(r)).join(',\n')}
    ],
    "transmissionCapacityPerRatio": [
${pdf04A.capacities.map(c => '      ' + fmtNum(c)).join(',\n')}
    ],
    "thrust": ${pdf04A.thrust},
    "centerDistance": ${pdf04A.centerDistance},
    "dimensions": ${JSON.stringify(pdf04A.dimensions)},
    "weight": ${pdf04A.weight},
    "source": "杭齿厂选型手册2025版5月版",
    "discountRate": 0.1,
    "priceSource": "系统估算",
    "maxPower": 12,
    "minPower": 5,
    "powerSource": "传动能力计算",
    "imageUrl": "/images/gearbox/06-16A-26.webp",
    "image": "/images/gearbox/06-16A-26.webp",
    "introduction": "04A 系列船用齿轮箱适用于中小型船舶。",
    "controlType": "手控",
    "rotationDirection": "相反",
    "certifications": [
      "CCS"
    ],
    "applications": [
      "小型渔船",
      "内河船",
      "工作艇"
    ],
    "inputInterfaces": {
      "plainFlange": true,
      "boltPatterns": [
        "8-φ11",
        "8-φ14"
      ]
    }
  }`;
    src = src.slice(0, range06[1]) + newEntry + src.slice(range06[1]);
    log.push(`[ADDED] 04A 新增于 06 之后`);
    changedCount++;
  }
}

console.log(log.join('\n'));
console.log(`\n========== 汇总 ==========`);
console.log(`共修改/新增 ${changedCount} 个型号`);

if (DRY) {
  console.log('\n[DRY RUN] 未写入文件');
} else {
  fs.writeFileSync(SRC, src, 'utf8');
  console.log(`\n已写入: ${SRC}`);
}
