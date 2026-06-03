#!/usr/bin/env node
/**
 * P0 发动机库录入进度 + 待补脚手架校验
 * ---------------------------------------------------------------------------
 * 报告主库 marineEngineDatabase.js 已录条数, 与 marineEngineDatabase.pending.json
 * 待补清单的填充进度; 对"已填真实数据"的 pending 条目校验必需字段, 提示可合入。
 *
 * 用法: node scripts/engine-db-pending-status.js
 *
 * 数据补齐流程 (给数据团队):
 *   1. 编辑 src/data/marineEngineDatabase.pending.json, 按 _meta.requiredFields 填真实值
 *      (功率/转速/torqueCurve/排放/尺寸... + dataSource/confidence/lastVerified, 禁止臆造)。
 *   2. 跑本脚本确认该条 "ready"。
 *   3. 把 ready 条目按主库 schema 形态移入 marineEngineDatabase.js 的 marineEngines 数组,
 *      从 pending.json 删除, 再跑 scripts/validate-engine-db.js 总校验。
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MAIN = path.join(ROOT, 'src/data/marineEngineDatabase.js');
const PENDING = path.join(ROOT, 'src/data/marineEngineDatabase.pending.json');

function countMain() {
  const t = fs.readFileSync(MAIN, 'utf8');
  // 浅计数: marineEngines 数组内 id: 出现次数
  const seg = t.slice(t.indexOf('marineEngines'), t.indexOf('enginesById'));
  const m = seg.match(/\bid:\s*'/g);
  return m ? m.length : 0;
}

const CORE = ['ratedPower_kW', 'ratedSpeed_rpm', 'dataSource', 'confidence', 'lastVerified'];

function main() {
  const mainCount = countMain();
  const pend = JSON.parse(fs.readFileSync(PENDING, 'utf8'));
  const list = pend.pending || [];

  let ready = 0, empty = 0, partial = 0;
  const readyModels = [], partialModels = [];
  for (const e of list) {
    const filled = CORE.filter((k) => e[k] != null && e[k] !== '');
    if (filled.length === 0) { empty++; }
    else if (filled.length === CORE.length) { ready++; readyModels.push(e.model); }
    else { partial++; partialModels.push(`${e.model}(缺 ${CORE.filter((k) => e[k] == null || e[k] === '').join('/')})`); }
  }

  console.log('=== P0 发动机库录入进度 ===');
  console.log(`主库 marineEngineDatabase.js 已录: ${mainCount} 型号 (P0 目标 50)`);
  console.log(`待补脚手架 pending.json: ${list.length} 型号`);
  console.log(`  ✓ 数据齐备可合入: ${ready}${readyModels.length ? ' → ' + readyModels.join(', ') : ''}`);
  console.log(`  ◐ 部分填写: ${partial}${partialModels.length ? '\n      ' + partialModels.join('\n      ') : ''}`);
  console.log(`  ○ 待录入(空): ${empty}`);
  console.log(`\n合计可达: ${mainCount + list.length} / P0 50 (${Math.max(0, 50 - mainCount - list.length)} 个型号身份仍待确认)`);
  if (ready > 0) console.log(`\n→ ${ready} 条已齐备, 可移入主库 marineEngines 后跑 validate-engine-db.js`);
  console.log('\n⚠ 录入纪律: 禁止臆造; 每条须 dataSource + confidence(A/B/C) + lastVerified。');
  process.exit(0);
}

main();
