#!/usr/bin/env node
/**
 * PDF手册 vs 数据库 全量核对脚本
 * 用法: node scripts/audit-pdf-vs-db.js [series]
 * series: small, light, aluminum, gw, dual, gc, 2gwh, dt, hcl, hybrid, all
 */

const { completeGearboxData } = require('../src/data/completeGearboxData.js');
const fs = require('fs');
const path = require('path');

// 加载指定系列的PDF数据
function loadPdfData(series) {
  const dir = path.join(__dirname, 'audit-data');
  if (series === 'all') {
    const allData = [];
    const files = fs.readdirSync(dir).filter(f => f.endsWith('.json'));
    for (const f of files) {
      const d = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
      allData.push(...d);
    }
    return allData;
  }
  const file = path.join(dir, `${series}.json`);
  if (!fs.existsSync(file)) {
    console.error(`数据文件不存在: ${file}`);
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

// 浮点数比较，允许容差
function floatEq(a, b, tol = 0.002) {
  if (a === null || a === undefined || b === null || b === undefined) return a == b;
  return Math.abs(a - b) <= tol;
}

// 数组比较
function arraysMatch(a, b, tol = 0.002) {
  if (!a && !b) return true;
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (!floatEq(a[i], b[i], tol)) return false;
  }
  return true;
}

// 尺寸字符串标准化
function normDim(s) {
  if (!s) return null;
  return String(s).replace(/\s/g, '').replace(/×/g, 'x').replace(/X/g, 'x').toLowerCase();
}

// 在DB中查找型号
function findInDb(model) {
  // 精确匹配
  let found = completeGearboxData.find(d => d.model === model);
  if (found) return found;
  // 去括号匹配
  found = completeGearboxData.find(d => d.model.replace(/\(.*?\)/g, '') === model.replace(/\(.*?\)/g, ''));
  return found || null;
}

// 比对单个型号
function compareModel(pdf, db) {
  const diffs = [];
  const model = pdf.model;

  // 转速范围
  if (pdf.minSpeed !== undefined && !floatEq(pdf.minSpeed, db.minSpeed, 1)) {
    diffs.push({ field: 'minSpeed', pdf: pdf.minSpeed, db: db.minSpeed });
  }
  if (pdf.maxSpeed !== undefined && !floatEq(pdf.maxSpeed, db.maxSpeed, 1)) {
    diffs.push({ field: 'maxSpeed', pdf: pdf.maxSpeed, db: db.maxSpeed });
  }

  // 速比
  if (pdf.ratios) {
    const pdfR = [...pdf.ratios].sort((a, b) => a - b);
    const dbR = db.ratios ? [...db.ratios].sort((a, b) => a - b) : [];
    if (!arraysMatch(pdfR, dbR, 0.02)) {
      diffs.push({ field: 'ratios', pdf: pdf.ratios, db: db.ratios, severity: 'CRITICAL' });
    }
  }

  // 传递能力
  if (pdf.capacities && db.transmissionCapacityPerRatio) {
    // 按ratio顺序比对
    const pdfC = pdf.capacities;
    const dbC = db.transmissionCapacityPerRatio;
    if (pdfC.length !== dbC.length) {
      diffs.push({ field: 'capacities_length', pdf: pdfC.length, db: dbC.length, severity: 'CRITICAL' });
    } else {
      for (let i = 0; i < pdfC.length; i++) {
        if (!floatEq(pdfC[i], dbC[i], 0.002)) {
          diffs.push({
            field: `capacity[${i}] (ratio=${pdf.ratios?.[i] || '?'})`,
            pdf: pdfC[i], db: dbC[i], severity: 'CRITICAL'
          });
        }
      }
    }
  }

  // 推力
  if (pdf.thrust !== undefined && pdf.thrust !== null) {
    if (!floatEq(pdf.thrust, db.thrust, 0.5)) {
      diffs.push({ field: 'thrust', pdf: pdf.thrust, db: db.thrust, severity: 'HIGH' });
    }
  }

  // 中心距
  if (pdf.centerDistance !== undefined && pdf.centerDistance !== null) {
    if (!floatEq(pdf.centerDistance, db.centerDistance, 1)) {
      diffs.push({ field: 'centerDistance', pdf: pdf.centerDistance, db: db.centerDistance, severity: 'HIGH' });
    }
  }

  // 重量
  if (pdf.weight !== undefined && pdf.weight !== null) {
    if (!floatEq(pdf.weight, db.weight, 5)) {
      diffs.push({ field: 'weight', pdf: pdf.weight, db: db.weight, severity: 'MEDIUM' });
    }
  }

  // 尺寸
  if (pdf.dimensions) {
    const pNorm = normDim(pdf.dimensions);
    const dNorm = normDim(db.dimensions);
    if (pNorm && dNorm && pNorm !== dNorm) {
      diffs.push({ field: 'dimensions', pdf: pdf.dimensions, db: db.dimensions, severity: 'LOW' });
    }
  }

  return diffs;
}

// 主函数
function main() {
  const series = process.argv[2] || 'all';
  const pdfData = loadPdfData(series);

  console.log(`\n========== 选型手册 vs 数据库 核对报告 ==========`);
  console.log(`系列: ${series}`);
  console.log(`PDF型号数: ${pdfData.length}`);
  console.log(`DB型号总数: ${completeGearboxData.length}`);
  console.log(`================================================\n`);

  let matchCount = 0, diffCount = 0, missingCount = 0;
  const allDiffs = [];
  const missing = [];

  for (const pdf of pdfData) {
    const db = findInDb(pdf.model);
    if (!db) {
      missingCount++;
      missing.push(pdf.model);
      continue;
    }
    matchCount++;
    const diffs = compareModel(pdf, db);
    if (diffs.length > 0) {
      diffCount++;
      allDiffs.push({ model: pdf.model, section: pdf.section, diffs });
    }
  }

  // 输出差异
  if (allDiffs.length > 0) {
    console.log(`\n--- 差异项 (${allDiffs.length}个型号有差异) ---\n`);
    for (const item of allDiffs) {
      console.log(`[${item.model}] (${item.section || ''})`);
      for (const d of item.diffs) {
        const sev = d.severity || 'INFO';
        const pdfVal = Array.isArray(d.pdf) ? JSON.stringify(d.pdf) : d.pdf;
        const dbVal = Array.isArray(d.db) ? JSON.stringify(d.db) : d.db;
        console.log(`  ${sev} ${d.field}: PDF=${pdfVal}  DB=${dbVal}`);
      }
    }
  }

  // 输出缺失
  if (missing.length > 0) {
    console.log(`\n--- PDF中有但DB中缺失的型号 (${missing.length}) ---`);
    console.log(missing.join(', '));
  }

  // 汇总
  console.log(`\n========== 汇总 ==========`);
  console.log(`已匹配: ${matchCount}`);
  console.log(`有差异: ${diffCount}`);
  console.log(`DB缺失: ${missingCount}`);
  console.log(`无差异: ${matchCount - diffCount}`);

  // 按严重程度统计
  const sevCounts = {};
  for (const item of allDiffs) {
    for (const d of item.diffs) {
      const s = d.severity || 'INFO';
      sevCounts[s] = (sevCounts[s] || 0) + 1;
    }
  }
  if (Object.keys(sevCounts).length > 0) {
    console.log('\n差异严重程度分布:');
    for (const [sev, cnt] of Object.entries(sevCounts).sort()) {
      console.log(`  ${sev}: ${cnt}项`);
    }
  }
  console.log(`===========================\n`);
}

main();
