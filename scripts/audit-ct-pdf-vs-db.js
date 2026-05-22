#!/usr/bin/env node
/**
 * audit-ct-pdf-vs-db.js
 * Diff: PDF (manual-from-pdf-20260521.json) vs completeGearboxData.js + embeddedData.js
 *
 * 输出 3 类差异:
 *   Type A 错位: 同 model, ratios.length===length但 capacities 数组不等 (核心 bug)
 *   Type B 长度: ratios.length 与 capacities.length 不一致 (跨数据源)
 *   Type C 漂移: |Δ Ct| > 0.001 kW/rpm
 *
 * Usage:
 *   node scripts/audit-ct-pdf-vs-db.js              # 全量, 输出 csv + json
 *   node scripts/audit-ct-pdf-vs-db.js --ci         # CI 模式: type A 存在 → exit 1
 *   node scripts/audit-ct-pdf-vs-db.js --model HCQ700  # 单模型详诊
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PDF_JSON = path.join(ROOT, 'scripts/audit-data/manual-from-pdf-20260521.json');
const COMPLETE_JS = path.join(ROOT, 'src/data/completeGearboxData.js');
const EMBEDDED_JS = path.join(ROOT, 'src/data/embeddedData.js');
const REPORTS_DIR = path.join(ROOT, 'audit-reports');

if (!fs.existsSync(REPORTS_DIR)) fs.mkdirSync(REPORTS_DIR, { recursive: true });

const ARGS = new Set(process.argv.slice(2));
const CI_MODE = ARGS.has('--ci');
const SINGLE_MODEL = process.argv.find(a => a.startsWith('--model='))?.slice(8)
  || (process.argv.indexOf('--model') !== -1 ? process.argv[process.argv.indexOf('--model') + 1] : null);

// === Load data ===
const pdfData = JSON.parse(fs.readFileSync(PDF_JSON, 'utf8'));
const pdfByModel = Object.fromEntries(pdfData.map(m => [m.model, m]));

// Hand-parse completeGearboxData.js via eval-free shim (it's a JS module)
function loadJsDataset(filePath, exportName) {
  const src = fs.readFileSync(filePath, 'utf8');
  // The file exports e.g. `export const completeGearboxData = [...]` or `module.exports = ...`
  // Use require if CommonJS or wrap to extract array
  // Approach: regex the `[...]` block after the variable name
  const re = new RegExp(`(?:const|let|var)\\s+${exportName}\\s*=\\s*(\\[[\\s\\S]*?\\n\\]);`, 'm');
  const match = src.match(re);
  if (!match) throw new Error(`Cannot extract ${exportName} from ${filePath}`);
  // Parse — use Function constructor to safely evaluate JS array literal
  // eslint-disable-next-line no-new-func
  return new Function(`return ${match[1]};`)();
}

let complete, embedded;
try {
  complete = loadJsDataset(COMPLETE_JS, 'completeGearboxData');
} catch (e) {
  console.error(`✗ Failed to load completeGearboxData.js: ${e.message}`);
  process.exit(2);
}
try {
  embedded = loadJsDataset(EMBEDDED_JS, 'embeddedData');
} catch (e) {
  console.warn(`⚠ embeddedData.js skipped: ${e.message}`);
  embedded = [];
}

const completeByModel = Object.fromEntries(complete.map(m => [m.model, m]));
const embeddedByModel = Object.fromEntries(embedded.map(m => [m.model, m]));

// === Diff ===
const diffs = { typeA: [], typeB: [], typeC: [] };

function arrEq(a, b, eps = 0.001) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length !== b.length) return false;
  return a.every((x, i) => Math.abs(x - b[i]) <= eps);
}

function compareModel(model, pdf, db, dataset) {
  if (!db) return; // model not in db
  const ratiosEq = arrEq(pdf.ratios, db.ratios);
  const dbCaps = db.transmissionCapacityPerRatio || db.transferCapacity || [];
  const capsEq = arrEq(pdf.capacities, dbCaps);

  // Type B: length mismatch in db
  if ((db.ratios || []).length !== dbCaps.length) {
    diffs.typeB.push({ model, dataset, dbRatios: db.ratios, dbCaps });
  }

  // Type A: ratios match but caps differ (core bug)
  if (ratiosEq && !capsEq) {
    diffs.typeA.push({
      model, dataset,
      pdfRatios: pdf.ratios,
      pdfCaps: pdf.capacities,
      dbCaps,
      fix: pdf.fix || null
    });
  }

  // Type C: numerical drift in caps when same length
  if (ratiosEq && Array.isArray(dbCaps) && dbCaps.length === pdf.capacities.length) {
    const drifts = pdf.capacities.map((c, i) => Math.abs(c - dbCaps[i])).filter(d => d > 0.001);
    if (drifts.length > 0 && !capsEq) {
      // Already in typeA, skip
    }
  }
}

const modelsToCheck = SINGLE_MODEL
  ? [pdfByModel[SINGLE_MODEL]].filter(Boolean)
  : pdfData.filter(m => m.verified !== false);

for (const pdf of modelsToCheck) {
  compareModel(pdf.model, pdf, completeByModel[pdf.model], 'completeGearboxData');
  compareModel(pdf.model, pdf, embeddedByModel[pdf.model], 'embeddedData');
}

// === Report ===
const stats = { typeA: diffs.typeA.length, typeB: diffs.typeB.length, typeC: diffs.typeC.length };
console.log('\n=== Ct Audit Report: PDF vs DB ===');
console.log(`PDF source: ${PDF_JSON}`);
console.log(`Models checked: ${modelsToCheck.length}`);
console.log(`Type A (caps misalign, same ratios): ${stats.typeA}`);
console.log(`Type B (length mismatch in DB):     ${stats.typeB}`);
console.log(`Type C (drift > 0.001):              ${stats.typeC}\n`);

if (diffs.typeA.length > 0) {
  console.log('--- Type A: Caps misalignment ---');
  for (const d of diffs.typeA) {
    console.log(`\n[${d.dataset}] ${d.model}`);
    console.log(`  ratios:   ${JSON.stringify(d.pdfRatios)}`);
    console.log(`  PDF caps: ${JSON.stringify(d.pdfCaps)}`);
    console.log(`  DB caps:  ${JSON.stringify(d.dbCaps)}`);
    if (d.fix) console.log(`  FIX: ${d.fix}`);
  }
}

if (diffs.typeB.length > 0) {
  console.log('\n--- Type B: DB array length mismatch ---');
  for (const d of diffs.typeB) {
    console.log(`[${d.dataset}] ${d.model}: ratios=${d.dbRatios?.length} caps=${d.dbCaps?.length}`);
  }
}

// Write CSV
const csv = ['model,dataset,type,issue,pdfRatios,pdfCaps,dbCaps,fix'];
for (const d of diffs.typeA) {
  csv.push([
    d.model, d.dataset, 'A', 'caps misaligned',
    JSON.stringify(d.pdfRatios).replace(/,/g, ';'),
    JSON.stringify(d.pdfCaps).replace(/,/g, ';'),
    JSON.stringify(d.dbCaps).replace(/,/g, ';'),
    (d.fix || '').replace(/,/g, ';')
  ].join(','));
}
for (const d of diffs.typeB) {
  csv.push([d.model, d.dataset, 'B', 'length mismatch',
    JSON.stringify(d.dbRatios).replace(/,/g, ';'),
    '', JSON.stringify(d.dbCaps).replace(/,/g, ';'), ''
  ].join(','));
}

const ts = new Date().toISOString().slice(0, 10).replace(/-/g, '');
const csvPath = path.join(REPORTS_DIR, `ct-discrepancy-${ts}.csv`);
const jsonPath = path.join(REPORTS_DIR, `ct-discrepancy-${ts}.json`);
fs.writeFileSync(csvPath, csv.join('\n'));
fs.writeFileSync(jsonPath, JSON.stringify({ stats, diffs }, null, 2));
console.log(`\nReports:\n  ${csvPath}\n  ${jsonPath}`);

if (CI_MODE && (stats.typeA > 0 || stats.typeB > 0)) {
  console.error(`\n✗ CI MODE: ${stats.typeA + stats.typeB} type A+B issues - blocking`);
  process.exit(1);
}

console.log('\n✓ Audit done');
