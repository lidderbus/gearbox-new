#!/usr/bin/env node
/**
 * v36 综合优化：
 * 1. 补全 powerSource / source / priceSource (小量缺失)
 * 2. 补全 price / discountRate (93个缺失)
 * 3. 补全 introduction (109个缺失)
 * 4. 清理低覆盖率冗余字段 (14个<5%字段 + inputSpeedRange)
 */
import fs from 'fs';
import { completeGearboxData } from '../src/data/completeGearboxData.js';

const stats = { powerSource: 0, source: 0, priceSource: 0, price: 0, introduction: 0, fieldsRemoved: 0 };

// ============================================================
// 1. 补全 powerSource / source / priceSource
// ============================================================
for (const e of completeGearboxData) {
  if (!e.powerSource) { e.powerSource = '传动能力计算'; stats.powerSource++; }
  if (!e.source) { e.source = '杭齿厂选型手册2025版5月版'; stats.source++; }
  if (!e.priceSource) { e.priceSource = '估算价格'; stats.priceSource++; }
}

// ============================================================
// 2. 补全 price / discountRate
// ============================================================
// 构建系列价格回归模型 (weight → price)
function buildPriceModel(series) {
  const pts = completeGearboxData.filter(e => e.series === series && e.price && e.weight);
  if (pts.length < 2) return null;
  // 线性回归 price = a + b * weight
  const n = pts.length;
  const sx = pts.reduce((s, e) => s + e.weight, 0);
  const sy = pts.reduce((s, e) => s + e.price, 0);
  const sxy = pts.reduce((s, e) => s + e.weight * e.price, 0);
  const sxx = pts.reduce((s, e) => s + e.weight * e.weight, 0);
  const b = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const a = (sy - b * sx) / n;
  return (weight) => Math.max(Math.round(a + b * weight), Math.min(...pts.map(p => p.price)) * 0.5);
}

// 特殊定价规则
const priceDirectMap = {
  // HC
  'HC85': 10000,          // 近似06(8000)略高
  // HCD
  'HCD68': 15000,         // 小型, 近似HC65(12000)
  'HCD400': 38000,        // =HCD400A(38150)
  'HCD600/2': 72000,      // 近似HCD600A(72600)
  'HCD800/2': 89000,      // 近似HCD800(89000)
  'HCD1000/2': 90000,     // 近似HCD1000(89800)
  'HCD2000/2': 206000,    // =HCD2000
  // HCDF
  'HCD0FM': 5000,
  'HCD1FM': 6500,
  'HCD2FM': 8000,
  // HCDX (换档型, 比HCD贵~30%)
  'HCDX300': 25000,
  'HCDX400': 50000,
  'HCDX600': 95000,
  'HCDX800': 116000,
  // HCP (混动, 高价)
  'HC4500P': 450000,
  'HC5000P': 520000,
  'HC6000P': 650000,
  // DT
  'DT2500': 150000,       // 介于DT2400(145000)和DT4300(165500)
  'DT4000': 160000,       // 近似DT4300(165500)
  // HCT
  'HCTH2650': 310000,     // 近似HCT2700(340000)略低
  'HCTH2650P': 310000,
  // MV
  'MV100A(倾角7°)': 100000, // =MV100A
  // 混合动力 (GWC P系列 = 同规格GWC + 15%混动溢价)
  'GWC52.59P': 550000,
  'GWC60.66P': 780000,
  'GWC63.71P': 950000,
  'HC1200P': 200000,      // 近似HC1200(180000)+ 混动溢价
  'HC1200/1P': 210000,
  // 船用双速
  'HCDS1600': 200000,     // 近似HCS1600
  'HCDS2000': 250000,
  // GW特殊
  'GWS63.78A': 900000,    // 近似GWD63.71(902500)
  'SGWL49.54': 370000,    // 近似GWL49.54(370392)
  'SGWL52.59': 430000,    // 近似GWL52.59
  // 2GWH
  '2GWH400': 85000,
  '2GWH600': 115000,
  '2GWH800': 135000,
};

// GW小型号 (按中心距/重量估算)
const gwSmallPrices = {
  'GWC20.34': 25000, 'GWC20.54': 28000, 'GWC26.58': 35000,
  'GWC36.58': 45000, 'GWC36.59': 50000, 'GWC46.59': 55000,
  'GWC46.60': 60000, 'GWC56.61': 65000, 'GWC61.65': 80000,
};
// GWCD (比GWC同级贵~40%, 含可调桨)
const gwcdPrices = {
  'GWCD26.70': 50000, 'GWCD36.70': 65000, 'GWCD46.71': 85000,
  'GWCD56.72': 100000, 'GWCD67.80': 350000, 'GWCD79.85': 500000, 'GWCD90.100': 800000,
};

Object.assign(priceDirectMap, gwSmallPrices, gwcdPrices);

// GC配变距桨 价格模型 (按centerDistance估算, 参考GCS系列)
// GCS320=160000, GCS350=175000, GCS390=200000, GCS410=250000, GCS450=350000
// GCS700B=450000, GCS750=600000, GCS850=850000, GCS900=1050000
function estimateGcPrice(cd) {
  if (!cd) return 200000;
  if (cd <= 320) return 160000;
  if (cd <= 410) return Math.round(160000 + (cd - 320) * (250000 - 160000) / (410 - 320));
  if (cd <= 590) return Math.round(250000 + (cd - 410) * (400000 - 250000) / (590 - 410));
  if (cd <= 855) return Math.round(400000 + (cd - 590) * (850000 - 400000) / (855 - 590));
  if (cd <= 1018) return Math.round(850000 + (cd - 855) * (1500000 - 850000) / (1018 - 855));
  if (cd <= 1350) return Math.round(1500000 + (cd - 1018) * (2500000 - 1500000) / (1350 - 1018));
  return Math.round(2500000 * (cd / 1350));
}

for (const e of completeGearboxData) {
  if (!e.price) {
    if (priceDirectMap[e.model] !== undefined) {
      e.price = priceDirectMap[e.model];
      e.discountRate = 0.1;
      stats.price++;
    } else if (e.series === 'GC配变距桨') {
      e.price = estimateGcPrice(e.centerDistance);
      e.discountRate = 0.1;
      stats.price++;
    }
  }
  // 确保所有有price的都有discountRate
  if (e.price && !e.discountRate) {
    e.discountRate = 0.1;
  }
}

// ============================================================
// 3. 补全 introduction (产品描述)
// ============================================================
function getSeriesDescription(series) {
  const map = {
    'HC': '船用齿轮箱',
    'HCA': '倾角式船用齿轮箱',
    'HCAG': '大倾角船用齿轮箱',
    'HCAM': '铝合金倾角船用齿轮箱',
    'HCD': '船用齿轮箱（带离合器）',
    'HCDF': '法兰输出小型船用齿轮箱',
    'HCDX': '多档位船用齿轮箱',
    'HCG': '高速船用齿轮箱',
    'HCL': '液压离合器',
    'HCM': '铝合金船用齿轮箱',
    'HCN': '带PTO船用齿轮箱',
    'HCNM': '铝合金带PTO船用齿轮箱',
    'HCP': '混合动力船用齿轮箱',
    'HCQ': '船用齿轮箱（带液压操纵离合器）',
    'HCQH': '液压操纵船用齿轮箱',
    'HCS': '双速船用齿轮箱',
    'HCT': '大功率船用齿轮箱',
    'HCV': 'V型驱动船用齿轮箱',
    'HCVG': 'V型驱动大型船用齿轮箱',
    'HCW': '超大功率船用齿轮箱',
    'DT': '电力推进船用齿轮箱',
    'GW': '大功率低速船用齿轮箱',
    'GCS': '可调桨船用齿轮箱',
    'GCH': '可调桨液压船用齿轮箱',
    'GCHT': '可调桨齿轮箱（带推力功能）',
    'GCHE': '可调桨齿轮箱（带弹性联轴节）',
    'GC配变距桨': '配变距桨船用齿轮箱',
    'MA': '小功率船用齿轮箱',
    'MB': '小功率船用齿轮箱',
    'MV': 'V型驱动小功率船用齿轮箱',
    'X6': '小型船用齿轮箱',
    'other': '船用齿轮箱',
    '混合动力': '混合动力船用齿轮箱',
    '船用双速': '双速船用齿轮箱',
  };
  return map[series] || '船用齿轮箱';
}

function getPowerRange(e) {
  if (!e.maxPower) return '';
  if (e.maxPower >= 10000) return '超大功率';
  if (e.maxPower >= 3000) return '大功率';
  if (e.maxPower >= 1000) return '中大功率';
  if (e.maxPower >= 300) return '中功率';
  if (e.maxPower >= 50) return '中小功率';
  return '小功率';
}

function getAppText(e) {
  if (!e.applications || e.applications.length === 0) return '';
  return e.applications.slice(0, 3).join('、');
}

function generateIntroduction(e) {
  const desc = getSeriesDescription(e.series);
  const powerRange = getPowerRange(e);
  const appText = getAppText(e);
  const ratioRange = e.ratios && e.ratios.length > 0
    ? `${Math.min(...e.ratios).toFixed(2)}~${Math.max(...e.ratios).toFixed(2)}`
    : '';
  const speedText = e.minSpeed && e.maxSpeed ? `${e.minSpeed}~${e.maxSpeed}r/min` : '';
  const thrustText = e.thrust > 0 ? `额定推力${e.thrust}kN` : '';
  const ctrlText = e.controlType || '';

  let intro = `${e.model}是杭州前进齿轮箱集团生产的${powerRange}${desc}`;

  // 加入控制方式
  if (ctrlText && ctrlText !== '手控') {
    intro += `，采用${ctrlText}操纵方式`;
  }

  // 加入关键参数
  const params = [];
  if (ratioRange) params.push(`减速比${ratioRange}`);
  if (speedText) params.push(`适用输入转速${speedText}`);
  if (thrustText) params.push(thrustText);
  if (params.length > 0) intro += '，' + params.join('，');

  // 加入应用场景
  if (appText) intro += `。适用于${appText}等船舶`;

  intro += '。';
  return intro;
}

for (const e of completeGearboxData) {
  if (!e.introduction) {
    e.introduction = generateIntroduction(e);
    stats.introduction++;
  }
}

// ============================================================
// 4. 清理低覆盖率冗余字段
// ============================================================
const fieldsToRemove = [
  'inputSpeedRange',      // 35% - 已有minSpeed/maxSpeed，冗余
  'transmissionCapacity', // 2% - 已有transmissionCapacityPerRatio
  'transferCapacity',     // 1% - 同上冗余
  'dataSource',           // 3% - 已有source字段
  'inputShaftType',       // 1%
  'oilCapacity',          // 0%
  'clutchType',           // 0%
  'gearType',             // 0%
  'transmissionType',     // 0%
  'workingPressure',      // 0%
  'maxOilTemp',           // 0%
  'coolingWaterFlow',     // 0%
  'overhaulPeriod',       // 0%
  'efficiency',           // 0% - 使用config.js的默认0.97
  'outputShaftDia',       // 0%
  'lubricationPressure',  // 0%
  'directionChangeTime',  // 0%
];

for (const e of completeGearboxData) {
  for (const f of fieldsToRemove) {
    if (f in e) {
      delete e[f];
      stats.fieldsRemoved++;
    }
  }
}

// ============================================================
// 验证
// ============================================================
console.log('\n=== 更新统计 ===');
console.log(`  powerSource: +${stats.powerSource}`);
console.log(`  source: +${stats.source}`);
console.log(`  priceSource: +${stats.priceSource}`);
console.log(`  price: +${stats.price}`);
console.log(`  introduction: +${stats.introduction}`);
console.log(`  字段属性删除: ${stats.fieldsRemoved}`);

// 剩余缺失
const checkFields = ['powerSource','source','priceSource','price','discountRate','introduction'];
checkFields.forEach(f => {
  const miss = completeGearboxData.filter(e => !e[f] && e[f] !== 0).length;
  const icon = miss === 0 ? '✅' : '⚠️';
  console.log(`  ${icon} ${f}: ${miss} 缺失`);
});

// 检查是否还有低覆盖率字段
console.log('\n=== 清理后剩余字段 ===');
const allFields = {};
completeGearboxData.forEach(e => Object.keys(e).forEach(k => { if (!allFields[k]) allFields[k] = 0; allFields[k]++; }));
Object.entries(allFields).sort((a, b) => b[1] - a[1]).forEach(([k, v]) => {
  const pct = Math.round(v / 585 * 100);
  const icon = pct === 100 ? '✅' : pct >= 80 ? '🔵' : '⚠️';
  console.log(`  ${icon} ${k.padEnd(30)} ${v}/585 (${pct}%)`);
});

// 写回
const output = `export const completeGearboxData = ${JSON.stringify(completeGearboxData, null, 4)};\n`;
fs.writeFileSync('./src/data/completeGearboxData.js', output, 'utf8');
console.log(`\n✓ completeGearboxData.js 已更新 (${(output.length/1024).toFixed(0)}KB)`);
