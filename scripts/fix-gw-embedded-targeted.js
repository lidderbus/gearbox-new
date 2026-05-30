#!/usr/bin/env node
/**
 * 把 completeGearboxData.js 已修复的 13 个 GWC/GWL 截断型号的
 * ratios + transferCapacity(数组) 定点文本替换进 embeddedData.js。
 *
 * embeddedData.js 是 { collection: [ {model...} ] } 嵌套对象, 且 model 用
 * transferCapacity(数组, 非 transferCapacityList/标量) — 故不能用上一版按扁平
 * 数组+标量假设的脚本。本脚本只改每个目标型号的 ratios 与 transferCapacity 两个
 * 数组的内容, 其余字段(价格/notes/重量等手工数据)一字不动。
 */
const fs = require('fs');
const path = require('path');

const EMB = path.join(__dirname, '../src/data/embeddedData.js');
const C = require('../src/data/completeGearboxData.js').completeGearboxData;
const cByModel = {};
C.forEach(x => { if (!cByModel[x.model]) cByModel[x.model] = x; });

// 目标 = complete 里 GWC/GWL 多档(>6) 的型号(即被截断修复过的)
const CAPF = 'transmissionCapacityPerRatio'; // completeGearboxData 的逐档能力字段
const TARGETS = C.filter(x => /^GW[CL]\d/.test(x.model)
  && Array.isArray(x.ratios) && x.ratios.length >= 9
  && Array.isArray(x[CAPF]) && x[CAPF].length === x.ratios.length
).map(x => x.model);

let src = fs.readFileSync(EMB, 'utf8');
const bak = EMB + '.bak.20260530-gwfix-v2';
fs.writeFileSync(bak, src);

const fmtArr = (vals, indent) => {
  const pad = ' '.repeat(indent);
  const ipad = ' '.repeat(indent + 2);
  return '[\n' + vals.map(v => ipad + v).join(',\n') + '\n' + pad + ']';
};

// 在某型号对象块内, 把 "ratios": [...] / "transferCapacity": [...] 替换
function replaceArrayField(block, field, vals) {
  // 匹配 "field": [ ... ]  (非贪婪到第一个 ]) , 数组项缩进 8 空格, 字段缩进 6
  const re = new RegExp('("' + field + '":\\s*)\\[[^\\]]*\\]');
  if (!re.test(block)) return { block, ok: false };
  const newArr = fmtArr(vals, 6);
  return { block: block.replace(re, '$1' + newArr), ok: true };
}

const report = [];
for (const model of TARGETS) {
  const c = cByModel[model];
  // 定位该 model 在 embeddedData 中的对象块: 从 "model": "<model>", 起,
  // 到下一个 "model": 或数组结束。用前瞻切片。
  const anchor = '"model": "' + model + '"';
  let idx = src.indexOf(anchor);
  if (idx < 0) { report.push(model + ': 不在 embeddedData(跳过)'); continue; }
  // 块结束 = 下一个 '"model":' 出现处(或 +4000 字符兜底)
  const nextModel = src.indexOf('"model":', idx + anchor.length);
  const end = nextModel < 0 ? Math.min(src.length, idx + 4000) : nextModel;
  let block = src.slice(idx, end);

  const r1 = replaceArrayField(block, 'ratios', c.ratios);
  const r2 = replaceArrayField(r1.block, 'transferCapacity', c[CAPF]);
  if (!r1.ok || !r2.ok) { report.push(model + `: 字段缺失 ratios=${r1.ok} cap=${r2.ok}(跳过)`); continue; }
  block = r2.block;
  src = src.slice(0, idx) + block + src.slice(end);
  report.push(model + `: ratios→${c.ratios.length}档 cap→${c[CAPF].length}`);
}

fs.writeFileSync(EMB, src);
fs.writeFileSync('/tmp/fixreport.txt', 'TARGETS(' + TARGETS.length + '): ' + TARGETS.join(',') + '\n\n' + report.join('\n') + '\n备份: ' + bak);
console.log('done');
