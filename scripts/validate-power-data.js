/**
 * 校验 maxPower/minPower 计算正确性
 *
 * 检查所有型号的硬编码 maxPower/minPower 是否等于：
 *   maxPower = max(transmissionCapacityPerRatio) × maxSpeed
 *   minPower = min(transmissionCapacityPerRatio) × minSpeed
 *
 * 用法: node scripts/validate-power-data.js [选项]
 *   --fix       自动修正所有错误值（直接修改数据文件）
 *   --summary   只显示分类汇总，不显示逐条详情
 *   --series X  只检查指定系列（如 GWC、HC、DT）
 */

const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../src/data/completeGearboxData.js');

// 读取数据文件内容
const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');

// 提取 JSON 数组部分
const arrayMatch = fileContent.match(/const\s+completeGearboxData\s*=\s*(\[[\s\S]*?\]);/);
if (!arrayMatch) {
  console.error('无法解析数据文件');
  process.exit(1);
}

let data;
try {
  data = JSON.parse(arrayMatch[1]);
} catch (e) {
  try {
    data = eval(arrayMatch[1]);
  } catch (e2) {
    console.error('数据解析失败:', e2.message);
    process.exit(1);
  }
}

const isFix = process.argv.includes('--fix');
const isSummary = process.argv.includes('--summary');
const seriesIdx = process.argv.indexOf('--series');
const filterSeries = seriesIdx !== -1 ? process.argv[seriesIdx + 1]?.toUpperCase() : null;

// 提取型号的系列前缀
function getSeries(model) {
  const m = model.match(/^([A-Za-z]+)/);
  return m ? m[1].toUpperCase() : 'OTHER';
}

// 分类错误严重程度
function classifyError(oldVal, newVal) {
  if (oldVal == null || newVal == null) return null;
  const diff = Math.abs(oldVal - newVal);
  const ratio = oldVal > 0 ? newVal / oldVal : Infinity;
  if (diff <= 2) return 'rounding';          // 四舍五入差异 (±1-2)
  if (ratio > 5 || ratio < 0.2) return 'critical'; // 偏差超过5倍
  if (ratio > 2 || ratio < 0.5) return 'major';    // 偏差超过2倍
  return 'minor';                            // 其他偏差
}

const errors = [];
let checked = 0;
let skipped = 0;

for (const g of data) {
  if (filterSeries && getSeries(g.model) !== filterSeries) continue;

  const caps = g.transmissionCapacityPerRatio;

  if (!caps || !Array.isArray(caps) || caps.length === 0) { skipped++; continue; }
  if (g.maxPower == null && g.minPower == null) { skipped++; continue; }

  const validCaps = caps.filter(c => typeof c === 'number' && c > 0);
  if (validCaps.length === 0) { skipped++; continue; }

  const minSpeed = g.minSpeed || 1000;
  const maxSpeed = g.maxSpeed || 2000;
  const maxCap = Math.max(...validCaps);
  const minCap = Math.min(...validCaps);
  const allSame = maxCap === minCap;

  const expectedMax = Math.round(maxCap * maxSpeed);
  const expectedMin = Math.round(minCap * minSpeed);

  checked++;

  const maxErr = g.maxPower != null && g.maxPower !== expectedMax;
  const minErr = g.minPower != null && g.minPower !== expectedMin;

  if (maxErr || minErr) {
    const maxSeverity = maxErr ? classifyError(g.maxPower, expectedMax) : null;
    const minSeverity = minErr ? classifyError(g.minPower, expectedMin) : null;
    // 取最高严重级别
    const severityOrder = ['critical', 'major', 'minor', 'rounding'];
    const severity = severityOrder.find(s => s === maxSeverity || s === minSeverity) || 'minor';

    errors.push({
      model: g.model,
      series: getSeries(g.model),
      severity,
      minSpeed, maxSpeed,
      maxCap, minCap,
      allSame,
      capCount: validCaps.length,
      maxPowerOld: maxErr ? g.maxPower : null,
      maxPowerNew: maxErr ? expectedMax : null,
      maxSeverity,
      minPowerOld: minErr ? g.minPower : null,
      minPowerNew: minErr ? expectedMin : null,
      minSeverity,
    });
  }
}

// ============ 输出报告 ============

console.log('=== 功率数据校验报告 ===\n');
console.log(`总型号数: ${data.length}`);
console.log(`已校验:   ${checked}`);
console.log(`已跳过:   ${skipped}`);
console.log(`发现错误: ${errors.length}\n`);

if (errors.length === 0) {
  console.log('✓ 所有硬编码功率值均与传递能力计算一致');
  process.exit(0);
}

// --- 按严重程度汇总 ---
const bySeverity = {};
for (const e of errors) {
  bySeverity[e.severity] = (bySeverity[e.severity] || 0) + 1;
}

const severityLabels = {
  critical: '严重 (偏差>5倍)',
  major: '较大 (偏差2-5倍)',
  minor: '一般 (偏差<2倍)',
  rounding: '四舍五入 (±1-2)',
};

console.log('--- 按严重程度 ---');
for (const [sev, label] of Object.entries(severityLabels)) {
  if (bySeverity[sev]) console.log(`  ${label}: ${bySeverity[sev]}`);
}
console.log();

// --- 按系列汇总 ---
const bySeries = {};
for (const e of errors) {
  if (!bySeries[e.series]) bySeries[e.series] = { total: 0, critical: 0, major: 0, minor: 0, rounding: 0 };
  bySeries[e.series].total++;
  bySeries[e.series][e.severity]++;
}

console.log('--- 按系列汇总 ---');
console.log(
  '系列'.padEnd(12) +
  '错误数'.padEnd(8) +
  '严重'.padEnd(6) +
  '较大'.padEnd(6) +
  '一般'.padEnd(6) +
  '舍入'
);
for (const [series, counts] of Object.entries(bySeries).sort((a, b) => b[1].total - a[1].total)) {
  console.log(
    series.padEnd(12) +
    String(counts.total).padEnd(8) +
    String(counts.critical || '-').padEnd(6) +
    String(counts.major || '-').padEnd(6) +
    String(counts.minor || '-').padEnd(6) +
    String(counts.rounding || '-')
  );
}
console.log();

// --- 错误模式分析 ---
console.log('--- 错误模式分析 ---');

// 检测"仅minPower错、所有传递能力相同"模式
const sameCapMinOnly = errors.filter(e => e.allSame && e.maxPowerOld == null && e.minPowerOld != null);
if (sameCapMinOnly.length > 0) {
  // 检查倍率
  const ratios = sameCapMinOnly.map(e => e.minPowerNew / e.minPowerOld);
  const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
  console.log(`\n模式A: 传递能力全部相同 且 仅minPower错误: ${sameCapMinOnly.length}个`);
  console.log(`  平均偏差倍率: ${avgRatio.toFixed(1)}x (期望值/当前值)`);
  console.log(`  典型: ${sameCapMinOnly[0].model} minPower ${sameCapMinOnly[0].minPowerOld}→${sameCapMinOnly[0].minPowerNew}`);
  console.log(`  可能原因: minPower = capacity × maxSpeed / 某系数，而非 capacity × minSpeed`);
}

// 检测"使用了中位数"模式
const medianErrors = errors.filter(e => {
  if (e.allSame || e.capCount < 3) return false;
  // 检查 maxPower 是否约等于 中位数 × maxSpeed
  if (e.maxPowerOld != null) {
    const medianIdx = Math.floor(e.capCount / 2);
    // 无法精确获取中位数，但如果偏差在 max 和 min 之间就算
    const ratio = e.maxPowerOld / e.maxPowerNew;
    return ratio > 0.3 && ratio < 0.8;
  }
  return false;
});
if (medianErrors.length > 0) {
  console.log(`\n模式B: maxPower 可能使用了中位数而非最大值: ${medianErrors.length}个`);
  console.log(`  典型: ${medianErrors.slice(0, 3).map(e => e.model).join(', ')}`);
}

console.log();

// --- 逐条详情 ---
if (!isSummary) {
  // 先按严重程度排序，再按系列排序
  const severityRank = { critical: 0, major: 1, minor: 2, rounding: 3 };
  errors.sort((a, b) => severityRank[a.severity] - severityRank[b.severity] || a.series.localeCompare(b.series));

  console.log('--- 错误详情 (按严重程度排序) ---\n');
  let lastSeverity = '';
  for (const err of errors) {
    if (err.severity !== lastSeverity) {
      console.log(`\n【${severityLabels[err.severity]}】`);
      lastSeverity = err.severity;
    }
    const parts = [`  ${err.model}`];
    parts.push(`速比${err.capCount}个`);
    parts.push(`转速${err.minSpeed}-${err.maxSpeed}`);
    parts.push(`传递能力[${err.maxCap}...${err.minCap}]`);
    if (err.maxPowerOld != null) {
      parts.push(`maxPower:${err.maxPowerOld}→${err.maxPowerNew}`);
    }
    if (err.minPowerOld != null) {
      parts.push(`minPower:${err.minPowerOld}→${err.minPowerNew}`);
    }
    console.log(parts.join('  '));
  }
  console.log();
}

// ============ --fix 模式 ============
if (isFix) {
  console.log('--- 自动修正 ---\n');
  let modified = fileContent;
  let fixCount = 0;
  const fixLog = [];

  for (const err of errors) {
    const modelPattern = `"model": "${err.model}"`;
    const modelIdx = modified.indexOf(modelPattern);
    if (modelIdx === -1) {
      fixLog.push(`⚠ 无法定位 ${err.model}`);
      continue;
    }

    const nextModelIdx = modified.indexOf('"model":', modelIdx + modelPattern.length);
    const blockEnd = nextModelIdx === -1 ? modified.length : nextModelIdx;
    const block = modified.substring(modelIdx, blockEnd);
    let newBlock = block;

    if (err.maxPowerOld != null) {
      newBlock = newBlock.replace(
        `"maxPower": ${err.maxPowerOld}`,
        `"maxPower": ${err.maxPowerNew}`
      );
    }
    if (err.minPowerOld != null) {
      newBlock = newBlock.replace(
        `"minPower": ${err.minPowerOld}`,
        `"minPower": ${err.minPowerNew}`
      );
    }

    if (newBlock !== block) {
      modified = modified.substring(0, modelIdx) + newBlock + modified.substring(blockEnd);
      fixCount++;
      const changes = [];
      if (err.maxPowerOld != null) changes.push(`maxPower:${err.maxPowerOld}→${err.maxPowerNew}`);
      if (err.minPowerOld != null) changes.push(`minPower:${err.minPowerOld}→${err.minPowerNew}`);
      fixLog.push(`✓ ${err.model} [${err.severity}] ${changes.join(' ')}`);
    }
  }

  for (const line of fixLog) console.log(line);

  if (fixCount > 0) {
    fs.writeFileSync(DATA_FILE, modified, 'utf-8');
    console.log(`\n已修正 ${fixCount} 个型号，文件已保存`);
  } else {
    console.log('\n无需修正');
  }
} else if (errors.length > 0) {
  console.log('提示:');
  console.log('  node scripts/validate-power-data.js --summary          # 只看汇总');
  console.log('  node scripts/validate-power-data.js --series GWC       # 只查GWC系列');
  console.log('  node scripts/validate-power-data.js --fix              # 自动修正全部');
}

process.exit(errors.length > 0 ? 1 : 0);
