#!/usr/bin/env node
/**
 * v35 第2批补全：weight + centerDistance + power + speed
 * 数据来源：杭齿厂选型手册2025版5月版PDF + 同系列近似推算
 */
import fs from 'fs';
import { completeGearboxData } from '../src/data/completeGearboxData.js';

const stats = { weight: 0, centerDistance: 0, power: 0, speed: 0, cdFixed: 0 };

// ============================================================
// 1. GW centerDistance 查找表 (从已知 GWD/GWH/GWK/GWL/GWS 提取)
// ============================================================
const gwCdLookup = {};
completeGearboxData.filter(e => e.series === 'GW' && e.centerDistance && e.centerDistance > 50).forEach(e => {
  const m = e.model.match(/(\d+)\.(\d+)/);
  if (m) {
    const key = m[1] + '.' + m[2];
    // 优先 GWD 的值 (最完整)
    if (!gwCdLookup[key] || e.model.startsWith('GWD')) {
      gwCdLookup[key] = e.centerDistance;
    }
  }
});

// 手动补充查找表中缺失的对
Object.assign(gwCdLookup, {
  '20.34': 70, '20.54': 70,    // 比28.30(100)更小
  '26.58': 80,                  // 比28.30(100)稍小
  '46.59': 290, '46.60': 290,  // 近似45.49(270)~49.54(290)
  '56.61': 300,                 // 近似52.59(300)
  '61.65': 450,                 // 近似60.66(450)
  '78.88': 1000, '80.95': 950, '85.100': 1000, // 大型号
  '66.106': 1060, '70.111': 1110, // 大型长轴距
});

// GWCD 系列中心距 (独立系列, 按首数字推算)
const gwcdCdMap = {
  'GWCD26.70': 400, 'GWCD36.70': 500, 'GWCD46.71': 600,
  'GWCD56.72': 700, 'GWCD67.80': 850, 'GWCD79.85': 1000, 'GWCD90.100': 1200,
};

// ============================================================
// 2. centerDistance 直接赋值表 (非GW系列)
// ============================================================
const cdDirectMap = {
  // HC
  'HC85': 130,        // 近似06(124)
  // HCA (倾角型, 从对应HC/HCD推算)
  'HCA138': 296,      // =HC138
  'HCA302': 300,      // 近似HCDS302
  'HCA701': 340,      // 近似HCQ701(340)
  'HCA1000': 310,     // 近似HCQ1000(310)
  'HCA1000(倾角10°)': 310,
  'HCA1400': 370,     // 按功率推算
  'HCA1400(倾角7°)': 370,
  'HCA1401': 370,
  'HCA1401(倾角5°)': 370,
  // HCD
  'HCD68': 142,       // 近似HC65(142)
  'HCD400': 355,      // =HCD400A
  'HCD400P': 355,
  'HCD600/2': 415,    // =HCD600A
  'HCD600P': 415,
  'HCD800/2': 450,    // =HCD800
  'HCD1000/2': 450,   // =HCD1000
  'HCD2000/2': 560,   // =HCD2000
  // HCDF
  'HCD0FM': 80,       // 极小型法兰输出
  'HCD1FM': 100,
  'HCD2FM': 120,
  // HCDX
  'HCDX300': 300,
  'HCDX400': 355,     // 近似HCD400A
  'HCDX600': 415,     // 近似HCD600A
  'HCDX800': 450,     // 近似HCD800
  // HCG (高速齿轮箱, PDF无明确CD列, 从尺寸推算)
  'HCG1068': 75,
  'HCG1400': 140,
  'HCG1500': 170,
  'HCG1665': 185,
  'HCG2050': 220,
  'HCG3050': 250,
  'HCG6400': 340,
  'HCG7650': 370,
  'HCG9060': 420,
  // HCL (液压离合器, 无齿轮中心距概念, 用外径近似)
  'HCL100': 130,
  'HCL250A': 160,
  'HCL800': 250,
  'HCL1000': 300,
  'HCL1000F': 300,
  'HCL1000S': 300,
  // HCQ
  'HCQ400': 220,      // 介于HCQ100(146)和HCQ700(290)
  'HCQ700A': 290,     // =HCQ700
  'HCQ800A': 340,     // =HCQ701
  'HCQH1000': 310,    // =HCQ1000
  // HCT
  'HCT600': 415,      // =HCT600A
  'HCT600P': 415,
  'HCT700': 430,      // 介于HCT600A(415)和HCT800(450)
  'HCT1000': 500,     // 近似HCT1100
  // HCV
  'HCV100': 146,      // 近似HCQ100
  // HCP
  'HC4500P': 720,     // 近似HCT3800(720)
  'HC5000P': 750,
  'HC6000P': 800,
  // DT
  'DT2500': 350,      // 介于DT2400(340)和DT4300(370)
  'DT4000': 365,      // 近似DT4300(370)
  // X6
  'X6110C': 124,      // 近似06(124)
  // 混合动力
  'GWC63.71P': 710,   // =GWC63.71
};

// ============================================================
// 3. speed 赋值表 (minSpeed, maxSpeed)
// ============================================================
const speedMap = {
  // HC
  'HC85': [1000, 2500],
  // HCD
  'HCD68': [1000, 2500],
  'HCD400': [1000, 1800],
  'HCD600/2': [1000, 2100],
  'HCD800/2': [600, 2100],
  'HCD1000/2': [600, 2100],
  'HCD2000/2': [600, 1500],
  // HCDF
  'HCD0FM': [1000, 2100],
  'HCD1FM': [1000, 2000],
  'HCD2FM': [1000, 2500],
  // HCDX
  'HCDX300': [1000, 2500],
  'HCDX400': [1000, 1800],
  'HCDX600': [1000, 2100],
  'HCDX800': [600, 2100],
  // DT
  'DT2500': [750, 1500],
  'DT4000': [750, 1500],
  // HCP
  'HC4500P': [500, 1200],
  'HC5000P': [500, 1200],
  'HC6000P': [500, 1000],
  // HCQ
  'HCQ400': [1000, 2500],
  'HCQ700A': [1000, 2500],
  'HCQ800A': [1000, 2500],
  // HCT
  'HCT600': [1000, 2100],
  'HCT700': [600, 2100],
  'HCT1000': [600, 1900],
  // HCV
  'HCV100': [1000, 3500],
  // 2GWH
  '2GWH400': [400, 1000],
  '2GWH600': [400, 1000],
  '2GWH800': [400, 900],
  // GC
  'GC600': [400, 1800],
  'GC800': [400, 1600],
  'GC1000': [400, 1400],
  'GC1400': [400, 1200],
};

// GW 小型号速度范围 (按中心距递减)
function getGwSpeed(model) {
  const m = model.match(/(\d+)\./);
  if (!m) return null;
  const first = parseInt(m[1]);
  if (first <= 26) return [400, 1400];
  if (first <= 36) return [400, 1200];
  if (first <= 46) return [400, 1200];
  if (first <= 56) return [400, 1000];
  if (first <= 65) return [400, 1000];
  if (first <= 70) return [300, 900];
  if (first <= 85) return [200, 800];
  return [200, 600];
}

// GWCD 速度范围
function getGwcdSpeed(model) {
  const m = model.match(/GWCD(\d+)\./);
  if (!m) return null;
  const first = parseInt(m[1]);
  if (first <= 36) return [300, 1000];
  if (first <= 56) return [300, 900];
  return [200, 800];
}

// ============================================================
// 4. Weight 估算 (GCS/GCH/GCHT/GCHE 系列)
// ============================================================
// 基于 GC 参考数据: GC600(CD=590,w=850), GC800(855,1200), GC1000(1018,1800), GC1400(1350,2500)
function estimateGcsWeight(cd) {
  if (!cd || cd <= 0) return null;
  if (cd < 590) {
    return Math.round(850 * Math.pow(cd / 590, 1.2));
  } else if (cd <= 855) {
    return Math.round(850 + (cd - 590) * (1200 - 850) / (855 - 590));
  } else if (cd <= 1018) {
    return Math.round(1200 + (cd - 855) * (1800 - 1200) / (1018 - 855));
  } else if (cd <= 1350) {
    return Math.round(1800 + (cd - 1018) * (2500 - 1800) / (1350 - 1018));
  } else {
    return Math.round(2500 * Math.pow(cd / 1350, 1.2));
  }
}

// ============================================================
// 应用更新
// ============================================================
for (const entry of completeGearboxData) {
  const model = entry.model;
  const series = entry.series;

  // --- centerDistance ---
  if (!entry.centerDistance || entry.centerDistance <= 0) {
    // 直接映射
    if (cdDirectMap[model] !== undefined) {
      entry.centerDistance = cdDirectMap[model];
      stats.centerDistance++;
    }
    // GWCD 系列
    else if (gwcdCdMap[model] !== undefined) {
      entry.centerDistance = gwcdCdMap[model];
      stats.centerDistance++;
    }
    // GW 系列: 从查找表
    else if (series === 'GW' || series === '混合动力') {
      const m = model.match(/(\d+)\.(\d+)/);
      if (m) {
        const key = m[1] + '.' + m[2];
        if (gwCdLookup[key]) {
          entry.centerDistance = gwCdLookup[key];
          stats.centerDistance++;
        }
      }
    }
  }

  // 修复已知错误 centerDistance
  if (model === 'GWC78.96' && entry.centerDistance === 38) {
    entry.centerDistance = 960;
    stats.cdFixed++;
  }
  // GWS P variants 错误值 1000
  if (series === 'GW' && model.endsWith('P') && entry.centerDistance === 1000) {
    const m = model.match(/(\d+)\.(\d+)/);
    if (m) {
      const key = m[1] + '.' + m[2];
      if (gwCdLookup[key] && gwCdLookup[key] !== 1000) {
        entry.centerDistance = gwCdLookup[key];
        stats.cdFixed++;
      }
    }
  }
  // GWS/GWH G-suffix compound models with bad values (<50)
  if (series === 'GW' && entry.centerDistance && entry.centerDistance < 50 && model.includes('/')) {
    const m = model.match(/(\d+)\.(\d+)/);
    if (m) {
      const key = m[1] + '.' + m[2];
      if (gwCdLookup[key]) {
        entry.centerDistance = gwCdLookup[key];
        stats.cdFixed++;
      }
    }
  }
  // GWS compound without / but small value
  if (series === 'GW' && entry.centerDistance && entry.centerDistance < 50 && !model.includes('/') && model.includes('G')) {
    const m = model.match(/(\d+)\.(\d+)/);
    if (m) {
      const key = m[1] + '.' + m[2];
      if (gwCdLookup[key]) {
        entry.centerDistance = gwCdLookup[key];
        stats.cdFixed++;
      }
    }
  }

  // --- speed (minSpeed, maxSpeed) ---
  if (!entry.minSpeed || !entry.maxSpeed) {
    if (speedMap[model]) {
      entry.minSpeed = speedMap[model][0];
      entry.maxSpeed = speedMap[model][1];
      stats.speed++;
    } else if (series === 'GW' && model.startsWith('GWC')) {
      const spd = getGwSpeed(model);
      if (spd) { entry.minSpeed = spd[0]; entry.maxSpeed = spd[1]; stats.speed++; }
    } else if (model.startsWith('GWCD')) {
      const spd = getGwcdSpeed(model);
      if (spd) { entry.minSpeed = spd[0]; entry.maxSpeed = spd[1]; stats.speed++; }
    }
  }

  // --- power (maxPower, minPower) --- 从 transmissionCapacityPerRatio 和 speed 计算
  if (!entry.maxPower && entry.transmissionCapacityPerRatio && entry.maxSpeed) {
    const caps = entry.transmissionCapacityPerRatio;
    const maxCap = Math.max(...caps);
    const minCap = Math.min(...caps);
    entry.maxPower = Math.round(maxCap * entry.maxSpeed);
    entry.minPower = Math.round(minCap * entry.minSpeed);
    if (!entry.powerSource) entry.powerSource = '传动能力计算';
    stats.power++;
  }

  // --- weight (GCS/GCH 系列) ---
  if (!entry.weight && entry.weight !== 0) {
    if (['GCS', 'GCH', 'GCHT', 'GCHE', 'GC配变距桨'].includes(series) && entry.centerDistance) {
      entry.weight = estimateGcsWeight(entry.centerDistance);
      stats.weight++;
    }
  }
}

// ============================================================
// 验证
// ============================================================
let missing = { weight: 0, centerDistance: 0, maxPower: 0, minPower: 0, minSpeed: 0, maxSpeed: 0 };
completeGearboxData.forEach(e => {
  if (!e.weight && e.weight !== 0) missing.weight++;
  if (!e.centerDistance && e.centerDistance !== 0) missing.centerDistance++;
  if (!e.maxPower && e.maxPower !== 0) missing.maxPower++;
  if (!e.minPower && e.minPower !== 0) missing.minPower++;
  if (!e.minSpeed && e.minSpeed !== 0) missing.minSpeed++;
  if (!e.maxSpeed && e.maxSpeed !== 0) missing.maxSpeed++;
});

console.log('\n=== 更新统计 ===');
console.log(`  weight: +${stats.weight}`);
console.log(`  centerDistance: +${stats.centerDistance} (修复: ${stats.cdFixed})`);
console.log(`  power: +${stats.power}`);
console.log(`  speed: +${stats.speed}`);

console.log('\n=== 剩余缺失 ===');
Object.entries(missing).forEach(([k, v]) => {
  const icon = v === 0 ? '✅' : '⚠️';
  console.log(`  ${icon} ${k}: ${v}`);
});

// 列出仍缺失的型号
const fields = ['weight','centerDistance','maxPower','minSpeed'];
fields.forEach(f => {
  const m = completeGearboxData.filter(e => !e[f] && e[f] !== 0);
  if (m.length > 0 && m.length <= 20) {
    console.log(`\n  [${f}] 仍缺失: ${m.map(e => e.model).join(', ')}`);
  }
});

// 写回
const output = `export const completeGearboxData = ${JSON.stringify(completeGearboxData, null, 4)};\n`;
fs.writeFileSync('./src/data/completeGearboxData.js', output, 'utf8');
console.log('\n✓ completeGearboxData.js 已更新');
