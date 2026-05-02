#!/usr/bin/env node
/**
 * patch-from-manual-20260502-v2.js
 * 二次微调:
 *   1. 撤回 7 处 GW wt 修改 (我的视觉读取存疑, 保留系统原值更合理)
 *   2. 补修 SGW30.32 / SGW49.54 thr 字段错位 (embedded 存了 capacity 值)
 *   3. 补 GWK66.106 / GWK70.111 thr (embedded null → 980/1200)
 *   4. 补 GWS45.68 speed [400,1400]
 *   5. 补 GWH36.39 wt 复审 (跳过, 偏差仅 200kg)
 */

const fs = require('fs');
const path = require('path');

// 重新加载已 patch 后的数据
const cplPath = path.resolve(__dirname,'../src/data/completeGearboxData.js');
delete require.cache[require.resolve(cplPath)];
const { completeGearboxData } = require(cplPath);

const embPath = path.resolve(__dirname,'../src/data/embeddedData.js');
delete require.cache[require.resolve(embPath)];
const { embeddedGearboxData } = require(embPath);

const norm = s => String(s||'').replace(/\s+/g,'').toUpperCase();

// 操作日志
const log = [];

// ===== 1. 撤回 7 处 GW wt 修改 (这些点用户后续如确认手册值, 可再修) =====
// 已被 patch 改过, 但视觉读取存疑, 撤回原值
const undoCpl = {
  // 手册视觉值不可靠的, 撤回到 complete 原备份值
  // (这些撤回值来自 .bak.20260502 备份)
};

// 从备份取原值
const backupSrc = fs.readFileSync(cplPath + '.bak.20260502', 'utf-8');
delete require.cache[require.resolve(cplPath + '.bak.20260502')];
// 不能直接 require .bak (Node 不识别), 改用 eval 提取
const m = backupSrc.match(/export\s+const\s+completeGearboxData\s*=\s*(\[[\s\S]*?\]);/);
if (!m) throw new Error('备份解析失败');
const origData = eval('(' + m[1] + ')');
const origMap = {};
for (const g of origData) if (g && g.model) origMap[norm(g.model)] = g;

// 需要撤回 wt 的型号
const undoModels = ['GWS36.54','GWK36.54','GWH36.54','GWD36.54',
                    'GWS42.63','GWD42.63','GWK42.63',
                    'GWS45.68','GWK45.68','GWH45.68B','GWD45.68'];
for (const mdl of undoModels) {
  const orig = origMap[norm(mdl)];
  if (!orig) continue;
  // 在 complete 里找
  for (const g of completeGearboxData) {
    if (g && norm(g.model) === norm(mdl)) {
      if (orig.weight != null && g.weight !== orig.weight) {
        log.push(`[cpl] ${g.model}: wt ${g.weight} → ${orig.weight} (撤回到原值)`);
        g.weight = orig.weight;
      }
      break;
    }
  }
}
// embedded 撤回
const embOrigMatch = fs.readFileSync(embPath + '.bak.20260502','utf-8').match(/embeddedGearboxData\s*=\s*(\{[\s\S]*?\n\});/);
if (embOrigMatch) {
  const embOrig = eval('(' + embOrigMatch[1] + ')');
  for (const k of Object.keys(embOrig)) {
    if (!Array.isArray(embOrig[k])) continue;
    for (const g of embOrig[k]) {
      if (!g || !g.model) continue;
      if (!undoModels.includes(g.model)) continue;
      // 在当前 embedded 里找
      for (const k2 of Object.keys(embeddedGearboxData)) {
        if (!Array.isArray(embeddedGearboxData[k2])) continue;
        for (const g2 of embeddedGearboxData[k2]) {
          if (g2 && norm(g2.model) === norm(g.model)) {
            if (g.weight != null && g2.weight !== g.weight) {
              log.push(`[emb] ${g2.model}: wt ${g2.weight} → ${g.weight} (撤回到原值)`);
              g2.weight = g.weight;
            }
          }
        }
      }
    }
  }
}

// ===== 2. 补 SGW30.32 / SGW49.54 thr (embedded 字段错位) =====
const finalPatch = {
  'SGW30.32': {thr: 100},
  'SGW49.54': {thr: 284},
  'GWK66.106': {thr: 980},
  'GWK70.111': {thr: 1200},
  'GWS45.68':  {speed: [400, 1400]},
};

for (const mdl of Object.keys(finalPatch)) {
  const ref = finalPatch[mdl];
  // complete
  for (const g of completeGearboxData) {
    if (g && norm(g.model) === norm(mdl)) {
      if (ref.thr != null && g.thrust !== ref.thr) {
        log.push(`[cpl] ${g.model}: thr ${g.thrust} → ${ref.thr}`);
        g.thrust = ref.thr;
      }
      if (ref.speed != null && (g.minSpeed !== ref.speed[0] || g.maxSpeed !== ref.speed[1])) {
        log.push(`[cpl] ${g.model}: speed [${g.minSpeed},${g.maxSpeed}] → [${ref.speed[0]},${ref.speed[1]}]`);
        g.minSpeed = ref.speed[0];
        g.maxSpeed = ref.speed[1];
      }
      break;
    }
  }
  // embedded
  for (const k of Object.keys(embeddedGearboxData)) {
    if (!Array.isArray(embeddedGearboxData[k])) continue;
    for (const g of embeddedGearboxData[k]) {
      if (g && norm(g.model) === norm(mdl)) {
        if (ref.thr != null && g.thrust !== ref.thr) {
          log.push(`[emb] ${g.model}: thr ${g.thrust} → ${ref.thr}`);
          g.thrust = ref.thr;
        }
        if (ref.speed != null) {
          const cur = g.inputSpeedRange;
          if (!Array.isArray(cur) || cur[0] !== ref.speed[0] || cur[1] !== ref.speed[1]) {
            log.push(`[emb] ${g.model}: speed ${JSON.stringify(cur)} → [${ref.speed.join(',')}]`);
            g.inputSpeedRange = [ref.speed[0], ref.speed[1]];
          }
        }
      }
    }
  }
}

// 写回
const outCpl = 'export const completeGearboxData = ' +
  JSON.stringify(completeGearboxData, null, 2) + ';\n';
fs.writeFileSync(cplPath, outCpl, 'utf-8');

const embOrigSrc = fs.readFileSync(embPath, 'utf-8');
const headerMatch = embOrigSrc.match(/^([\s\S]*?)export\s+const\s+embeddedGearboxData\s*=/);
const header = headerMatch ? headerMatch[1] : '// auto-patched\n';
const safeParseFloatMatch = embOrigSrc.match(/export\s+(function|const)\s+safeParseFloat[\s\S]*$/);
const tail = safeParseFloatMatch ? '\n' + safeParseFloatMatch[0] : '';
const outEmb = `${header}export const embeddedGearboxData = ${JSON.stringify(embeddedGearboxData, null, 2)};\n${tail}`;
fs.writeFileSync(embPath, outEmb, 'utf-8');

console.log(`✓ v2 微调完成: ${log.length} 处`);
fs.writeFileSync('/tmp/patch-v2.log', log.join('\n'),'utf-8');
console.log(log.slice(0,30).join('\n'));
