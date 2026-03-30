#!/usr/bin/env node
/**
 * 从GW系列使用说明书PDF(P60-62)提取外形尺寸，更新completeGearboxData.js
 * 尺寸格式: L×B×H1 (总长×总宽×总高)
 * 重量为"包括冷却器总重量"
 */
import fs from 'fs';
import { completeGearboxData } from '../src/data/completeGearboxData.js';

// ============================================================
// GWC/GWL 外形尺寸 (P60, i=2:1至6:1)
// 格式: { L, B, H1, weightGWC, weightGWL }
// ============================================================
const gwcDimensions = {
  '28.30': { L: 1036, B: 800,  H1: 950,  wGWC: 1230,  wGWL: 1070 },
  '30.32': { L: 1198, B: 860,  H1: 1298, wGWC: 1465,  wGWL: 1240 },
  '32.35': { L: 1238, B: 920,  H1: 1315, wGWC: 2035,  wGWL: 1780 },
  '36.39': { L: 1326, B: 1060, H1: 1500, wGWC: 2450,  wGWL: 2140 },
  '39.41': { L: 1454, B: 1010, H1: 1425, wGWC: 3245,  wGWL: 2820 },
  '42.45': { L: 1486, B: 1180, H1: 1650, wGWC: 3975,  wGWL: 3470 },
  '45.49': { L: 1688, B: 1230, H1: 1710, wGWC: 5275,  wGWL: 4600 },
  '49.54': { L: 1783, B: 1340, H1: 1925, wGWC: 6954,  wGWL: 6000 },
  '52.59': { L: 2198, B: 1400, H1: 2015, wGWC: 8920,  wGWL: 7780 },
  '60.66': { L: 2445, B: 1600, H1: 2215, wGWC: 12100, wGWL: 10550 },
};

// ============================================================
// GWD/GWH 外形尺寸 (P61, i=2:1至4:1)
// ============================================================
const gwdDimensions = {
  '28.30': { L: 971,  B: 800,  H1: 950,  wt: 1130 },
  '30.32': { L: 1168, B: 860,  H1: 1298, wt: 1345 },
  '32.35': { L: 1198, B: 920,  H1: 1315, wt: 1870 },
  '36.39': { L: 1251, B: 1060, H1: 1500, wt: 2245 },
  '39.41': { L: 1423, B: 1010, H1: 1425, wt: 2960 },
  '42.45': { L: 1454, B: 1180, H1: 1650, wt: 3630 },
  '45.49': { L: 1649, B: 1230, H1: 1710, wt: 4835 },
  '49.54': { L: 1756, B: 1340, H1: 1925, wt: 6310 },
  '52.59': { L: 2038, B: 1400, H1: 2015, wt: 8175 },
  '60.66': { L: 2410, B: 1600, H1: 2215, wt: 11100 },
};

// ============================================================
// GWS/GWK 外形尺寸 (P62, i=2:1至4:1)
// ============================================================
const gwsDimensions = {
  '28.30': { L: 968,  B: 1050, H1: 1370, wGWS: 1230,  wGWK: 1130 },
  '30.32': { L: 1143, B: 1110, H1: 1420, wGWS: 1465,  wGWK: 1300 },
  '32.35': { L: 1189, B: 1200, H1: 1480, wGWS: 2035,  wGWK: 1870 },
  '36.39': { L: 1256, B: 1330, H1: 1580, wGWS: 2245,  wGWK: 2245 },
  '39.41': { L: 1393, B: 1400, H1: 1630, wGWS: 3230,  wGWK: 2960 },
  '42.45': { L: 1425, B: 1460, H1: 1630, wGWS: 3960,  wGWK: 3630 },
  '45.49': { L: 1594, B: 1590, H1: 1860, wGWS: 5275,  wGWK: 3835 },
  '49.54': { L: 1684, B: 1750, H1: 2130, wGWS: 6900,  wGWK: 6310 },
  '52.59': { L: 2038, B: 1870, H1: 2320, wGWS: 8920,  wGWK: 8120 },
  '60.66': { L: 2340, B: 2080, H1: 2520, wGWS: 12100, wGWK: 11100 },
};

// ============================================================
// 从型号名提取规格号 (如 GWC28.30 → 28.30, GWS45.49P → 45.49)
// ============================================================
function extractGWSize(model) {
  // 匹配 GW{C/L/S/D/H/K}{数字}.{数字} 格式
  const m = model.match(/^GW[CLSDHK](\d+\.\d+)/);
  if (m) return m[1];
  // P后缀
  const mp = model.match(/^GW[CLSDHK](\d+\.\d+)P/);
  if (mp) return mp[1];
  return null;
}

function getGWType(model) {
  if (/^GWC/.test(model)) return 'GWC';
  if (/^GWL/.test(model)) return 'GWL';
  if (/^GWS/.test(model)) return 'GWS';
  if (/^GWD/.test(model)) return 'GWD';
  if (/^GWH/.test(model)) return 'GWH';
  if (/^GWK/.test(model)) return 'GWK';
  return null;
}

// ============================================================
// 应用更新
// ============================================================
let updatedDim = 0, updatedWeight = 0;
let totalUpdated = 0;

for (const entry of completeGearboxData) {
  const m = entry.model;
  const gwType = getGWType(m);
  if (!gwType) continue;

  const size = extractGWSize(m);
  if (!size) continue;

  let dims = null;
  let weight = null;

  switch (gwType) {
    case 'GWC': {
      const d = gwcDimensions[size];
      if (d) {
        dims = `${d.L}×${d.B}×${d.H1}`;
        weight = d.wGWC;
      }
      break;
    }
    case 'GWL': {
      const d = gwcDimensions[size]; // GWL shares GWC casing dimensions
      if (d) {
        dims = `${d.L}×${d.B}×${d.H1}`;
        weight = d.wGWL;
      }
      break;
    }
    case 'GWD':
    case 'GWH': {
      const d = gwdDimensions[size];
      if (d) {
        dims = `${d.L}×${d.B}×${d.H1}`;
        weight = d.wt;
      }
      break;
    }
    case 'GWS':
    case 'GWK': {
      const d = gwsDimensions[size];
      if (d) {
        if (gwType === 'GWS') {
          dims = `${d.L}×${d.B}×${d.H1}`;
          weight = d.wGWS;
        } else {
          dims = `${d.L}×${d.B}×${d.H1}`;
          weight = d.wGWK;
        }
      }
      break;
    }
  }

  let changed = false;

  if (!entry.dimensions && dims) {
    entry.dimensions = dims;
    updatedDim++;
    changed = true;
  }

  if (!entry.weight && weight) {
    entry.weight = weight;
    updatedWeight++;
    changed = true;
  }

  if (changed) totalUpdated++;
}

// ============================================================
// 也处理复合型号名 (如 GWS63.71/GWK63.71/GWH63.71/GWD63.71)
// ============================================================
for (const entry of completeGearboxData) {
  const m = entry.model;
  if (!m.includes('/')) continue;
  if (entry.dimensions) continue; // 已有dimensions

  // 从复合名中提取第一个型号
  const firstModel = m.split('/')[0];
  const gwType = getGWType(firstModel);
  const size = gwType ? extractGWSize(firstModel) : null;
  if (!size) continue;

  let dims = null;
  let weight = null;

  if (gwType === 'GWS' || gwType === 'GWK') {
    const d = gwsDimensions[size];
    if (d) {
      dims = `${d.L}×${d.B}×${d.H1}`;
      weight = d.wGWS;
    }
  } else if (gwType === 'GWD' || gwType === 'GWH') {
    const d = gwdDimensions[size];
    if (d) {
      dims = `${d.L}×${d.B}×${d.H1}`;
      weight = d.wt;
    }
  }

  if (dims && !entry.dimensions) {
    entry.dimensions = dims;
    updatedDim++;
  }
  if (weight && !entry.weight) {
    entry.weight = weight;
    updatedWeight++;
  }
}

console.log(`\n=== GW系列尺寸更新统计 ===`);
console.log(`更新型号: ${totalUpdated}`);
console.log(`  dimensions: +${updatedDim}`);
console.log(`  weight:     +${updatedWeight}`);

// 验证剩余
let remainDim = 0, remainWeight = 0;
completeGearboxData.forEach(e => {
  if (!e.dimensions) remainDim++;
  if (!e.weight) remainWeight++;
});
console.log(`\n剩余缺失: dimensions=${remainDim}, weight=${remainWeight}`);

// 写回
const output = `export const completeGearboxData = ${JSON.stringify(completeGearboxData, null, 4)};\n`;
fs.writeFileSync('./src/data/completeGearboxData.js', output, 'utf8');
console.log(`✓ completeGearboxData.js 已更新`);
