#!/usr/bin/env node
/**
 * 从本地 V78 权威数据生成云端 master JSON, 用于覆盖 /var/www/html/gearbox-cloud-data.json
 *
 * 修正生产线 BUG:
 *   - GWC 系列 51 个里 45 个 centerDistance=0 (cloud) → 用本地真值
 *   - HCT 系列 maxPower 偏差 +9~16% (cloud) → 用本地真值
 *
 * 策略:
 *   - 保持 list 顶层契约 (与现有 cloud-data.json 一致, 不破坏 unified-api 消费者)
 *   - 输出 590 全量 (501 主 + 89 legacy), legacy 标 _isLegacy: true
 *   - 字段集为本地权威全字段 + 派生 inputSpeedRange (cloud 期望此字段)
 *   - 元信息写 sidecar `gearbox-cloud-data.meta.json` (版本/生成时间/计数/源 hash)
 *
 * 用法: node scripts/generate-cloud-master.js
 *   产物: /tmp/gearbox-cloud-master/{gearbox-cloud-data.json, gearbox-cloud-data.meta.json}
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const { completeGearboxData } = require('../src/data/completeGearboxData.js');
const { legacyGearboxData } = require('../src/data/legacyData.js');

const OUT_DIR = '/tmp/gearbox-cloud-master';
fs.mkdirSync(OUT_DIR, { recursive: true });

function deriveInputSpeedRange(r) {
  if (r.minSpeed != null && r.maxSpeed != null) return `${r.minSpeed}-${r.maxSpeed}`;
  if (r.maxSpeed != null) return `${r.maxSpeed}`;
  return null;
}

function normalize(r, isLegacy = false) {
  const out = {
    model: r.model,
    series: r.series,
    minSpeed: r.minSpeed,
    maxSpeed: r.maxSpeed,
    inputSpeedRange: deriveInputSpeedRange(r),
    ratios: r.ratios,
    transmissionCapacityPerRatio: r.transmissionCapacityPerRatio,
    thrust: r.thrust,
    centerDistance: r.centerDistance,
    dimensions: r.dimensions,
    weight: r.weight,
    controlType: r.controlType,
    minPower: r.minPower,
    maxPower: r.maxPower,
    powerSource: r.powerSource,
    couplingConfig: r.couplingConfig,
    price: r.price,
    factoryPrice: r.price,
    discountRate: r.discountRate,
    priceSource: r.priceSource || 'V78-2026-05',
    imageUrl: r.imageUrl,
    officialImage: r.officialImage,
    introduction: r.introduction,
    inputInterfaces: r.inputInterfaces,
    image: r.image,
    rotationDirection: r.rotationDirection,
    certifications: r.certifications,
    applications: r.applications,
    source: r.source,
  };
  if (isLegacy) out._isLegacy = true;
  for (const k of Object.keys(out)) if (out[k] === undefined) delete out[k];
  return out;
}

const all = [];
const seen = new Set();
for (const r of completeGearboxData) {
  if (!r.model || seen.has(r.model)) continue;
  seen.add(r.model);
  all.push(normalize(r, false));
}
let legacyAdded = 0;
for (const r of legacyGearboxData) {
  if (!r.model || seen.has(r.model)) continue;
  seen.add(r.model);
  all.push(normalize(r, true));
  legacyAdded++;
}

const json = JSON.stringify(all, null, 0);
const hash = crypto.createHash('sha256').update(json).digest('hex').slice(0, 16);

const meta = {
  _version: 'V78-master',
  _generated: new Date().toISOString(),
  _source: 'gearbox-new V78 (completeGearboxData.js + legacyData.js)',
  _count: { main: completeGearboxData.length, legacy: legacyAdded, total: all.length },
  _hash: hash,
  _fixes: [
    'GWC 系列 centerDistance=0 → 真值 (V78 PDF 校准)',
    'HCT 系列 maxPower 偏差 → 真值 (V78 PDF 校准)',
    'HCAG/HCAM 倾角型号(5个) 待 Step C 单独处理',
  ],
};

const dataPath = path.join(OUT_DIR, 'gearbox-cloud-data.json');
const metaPath = path.join(OUT_DIR, 'gearbox-cloud-data.meta.json');
fs.writeFileSync(dataPath, json);
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));

const stat = fs.statSync(dataPath);
console.log('生成完成:');
console.log('  ', dataPath, `(${(stat.size / 1024).toFixed(1)} KB, ${all.length} 型号)`);
console.log('  ', metaPath);
console.log('hash:', hash);
console.log('main:', completeGearboxData.length, '+ legacy:', legacyAdded, '= total:', all.length);

const withPrice = all.filter(x => x.price != null && x.price > 0).length;
const withCd = all.filter(x => x.centerDistance != null && x.centerDistance > 0).length;
const withMp = all.filter(x => x.maxPower != null && x.maxPower > 0).length;
console.log('字段覆盖率:');
console.log(`  price: ${withPrice}/${all.length} (${(100*withPrice/all.length).toFixed(1)}%)`);
console.log(`  centerDistance: ${withCd}/${all.length} (${(100*withCd/all.length).toFixed(1)}%)`);
console.log(`  maxPower: ${withMp}/${all.length} (${(100*withMp/all.length).toFixed(1)}%)`);

const samples = ['HC1000', 'HC400', 'HCT1100', 'HCT600A', 'HCD2700', 'GWC60.66', 'GWC42.45'];
console.log('\n关键样本 sanity check:');
for (const m of samples) {
  const r = all.find(x => x.model === m);
  if (r) console.log(`  ${m}: cd=${r.centerDistance}, maxPower=${r.maxPower}, price=${r.price}`);
}
