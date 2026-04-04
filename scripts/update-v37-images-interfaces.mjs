#!/usr/bin/env node
/**
 * v37 优化：
 * 1. 同步 imageUrl ← image (233个)
 * 2. 补全 image 42个缺失 (映射到同系列图片)
 * 3. 补全 inputInterfaces 234个缺失 (按系列/功率规则)
 */
import fs from 'fs';
import { completeGearboxData } from '../src/data/completeGearboxData.js';

const stats = { imageUrl: 0, image: 0, inputInterfaces: 0 };

// ============================================================
// 1. 补全 image (42个缺失 → 映射到同系列图片)
// ============================================================
const imageMap = {
  // 2GWH → 独立图片
  '2GWH400': '/images/gearbox/Advance-2GWH.webp',
  '2GWH600': '/images/gearbox/Advance-2GWH.webp',
  '2GWH800': '/images/gearbox/Advance-2GWH.webp',
  // DT
  'DT2500': '/images/gearbox/Advance-DT.webp',
  'DT4000': '/images/gearbox/Advance-DT.webp',
  // GC配变距桨
  'GC600': '/images/gearbox/Advance-GC.webp',
  'GC800': '/images/gearbox/Advance-GC.webp',
  'GC1000': '/images/gearbox/Advance-GC.webp',
  'GC1400': '/images/gearbox/Advance-GC.webp',
  // GWC 小型号
  'GWC20.34': '/images/gearbox/Advance-GWC.webp',
  'GWC20.54': '/images/gearbox/Advance-GWC.webp',
  'GWC26.58': '/images/gearbox/Advance-GWC.webp',
  'GWC36.58': '/images/gearbox/Advance-GWC.webp',
  'GWC36.59': '/images/gearbox/Advance-GWC.webp',
  'GWC46.59': '/images/gearbox/Advance-GWC.webp',
  'GWC46.60': '/images/gearbox/Advance-GWC.webp',
  'GWC56.61': '/images/gearbox/Advance-GWC.webp',
  'GWC61.65': '/images/gearbox/Advance-GWC.webp',
  // GWCD
  'GWCD26.70': '/images/gearbox/Advance-GWC.webp',
  'GWCD36.70': '/images/gearbox/Advance-GWC.webp',
  'GWCD46.71': '/images/gearbox/Advance-GWC.webp',
  'GWCD56.72': '/images/gearbox/Advance-GWC.webp',
  'GWCD67.80': '/images/gearbox/Advance-GWC.webp',
  'GWCD79.85': '/images/gearbox/Advance-GWC.webp',
  'GWCD90.100': '/images/gearbox/Advance-GWC.webp',
  // HC
  'HC85': '/images/gearbox/06-16A-26.webp',
  // HCD
  'HCD68': '/images/gearbox/Advance-300-301-302_4_11zon.webp',
  'HCD400': '/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp',
  'HCD600/2': '/images/gearbox/Advance-800-1000.webp',
  'HCD800/2': '/images/gearbox/Advance-800-1000.webp',
  'HCD1000/2': '/images/gearbox/Advance-800-1000.webp',
  'HCD2000/2': '/images/gearbox/Advance-800-1000.webp',
  // HCDF
  'HCD0FM': '/images/gearbox/06-16A-26.webp',
  'HCD1FM': '/images/gearbox/06-16A-26.webp',
  'HCD2FM': '/images/gearbox/06-16A-26.webp',
  // HCDX
  'HCDX300': '/images/gearbox/Advance-300-301-302_4_11zon.webp',
  'HCDX400': '/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp',
  'HCDX600': '/images/gearbox/Advance-800-1000.webp',
  'HCDX800': '/images/gearbox/Advance-800-1000.webp',
  // HCP (大型混动 → 用800-1000图)
  'HC4500P': '/images/gearbox/Advance-800-1000.webp',
  'HC5000P': '/images/gearbox/Advance-800-1000.webp',
  'HC6000P': '/images/gearbox/Advance-800-1000.webp',
};

// ============================================================
// 2. inputInterfaces 规则 (按系列 + 功率等级)
// ============================================================
function getInputInterfaces(model, series, maxPower) {
  // 极小功率 (<50kW)
  if (maxPower < 50) {
    return { plainFlange: true, boltPatterns: ['8-φ11', '8-φ14'] };
  }

  // other系列 (06/16A/26...)
  if (series === 'other') {
    if (maxPower < 100) return { sae: ['SAE1#4寸'], plainFlange: true, boltPatterns: ['8-φ11', '12-φ12.5'] };
    return { sae: ['SAE1#4寸', 'SAE1#6寸', 'SAE1#8寸'], plainFlange: true, boltPatterns: ['12-φ12.5', '12-φ13'] };
  }

  // MA/MB 小功率
  if (['MA', 'MB'].includes(series)) {
    return { sae: ['SAE1#1.5寸', 'SAE1#4寸'], plainFlange: true, boltPatterns: ['8-φ11', '12-φ12.5'] };
  }

  // MV
  if (series === 'MV') {
    return { sae: ['SAE1#1.5寸', 'SAE1#4寸'], plainFlange: true };
  }

  // X6
  if (series === 'X6') {
    return { plainFlange: true, boltPatterns: ['8-φ11'] };
  }

  // HCDF
  if (series === 'HCDF') {
    return { plainFlange: true, boltPatterns: ['6-φ11', '8-φ11'] };
  }

  // HCL 液压离合器
  if (series === 'HCL') {
    if (maxPower < 300) return { sae: ['SAE1#1.5寸', 'SAE1#4寸'], plainFlange: true };
    if (maxPower < 800) return { sae: ['SAE1#6寸', 'SAE1#8寸'], plainFlange: true };
    return { sae: ['SAE2#1寸', 'SAE3#11.5寸'], plainFlange: true };
  }

  // HC 主系列
  if (series === 'HC' || series === 'HCN') {
    if (maxPower < 300) return { sae: ['SAE1#4寸', 'SAE1#6寸'], plainFlange: true, boltPatterns: ['12-φ12.5', '12-φ13'] };
    if (maxPower < 800) return { sae: ['SAE1#6寸', 'SAE1#8寸'], plainFlange: true, domestic: ['φ505', 'φ518'] };
    if (maxPower < 2000) return { sae: ['SAE18寸', 'SAE21寸'], plainFlange: true, domestic: ['φ505', 'φ518', 'φ640'] };
    return { sae: ['SAE18寸', 'SAE21寸'], plainFlange: true, domestic: ['φ518', 'φ640', 'φ820'] };
  }

  // HCD
  if (['HCD', 'HCDX'].includes(series)) {
    if (maxPower < 300) return { sae: ['SAE1#4寸', 'SAE1#6寸'], plainFlange: true, domestic: ['φ505'] };
    if (maxPower < 800) return { sae: ['SAE1#6寸', 'SAE1#8寸'], plainFlange: true, domestic: ['φ505', 'φ518'] };
    if (maxPower < 2000) return { sae: ['SAE18寸', 'SAE21寸'], plainFlange: true, domestic: ['φ518', 'φ640'] };
    return { sae: ['SAE18寸', 'SAE21寸'], plainFlange: true, domestic: ['φ518', 'φ640', 'φ700'] };
  }

  // HCT
  if (series === 'HCT') {
    if (maxPower < 1000) return { sae: ['SAE1#8寸', 'SAE18寸'], plainFlange: true, domestic: ['φ505', 'φ518'] };
    if (maxPower < 2000) return { sae: ['SAE18寸', 'SAE21寸'], plainFlange: true, domestic: ['φ518', 'φ640'] };
    return { sae: ['SAE18寸', 'SAE21寸'], plainFlange: true, domestic: ['φ518', 'φ640', 'φ820'] };
  }

  // HCS / 船用双速
  if (series === 'HCS' || series === '船用双速') {
    if (maxPower < 500) return { sae: ['SAE1#4寸', 'SAE1#6寸'], plainFlange: true };
    return { sae: ['SAE1#6寸', 'SAE1#8寸'], plainFlange: true, domestic: ['φ518'] };
  }

  // HCQ / HCQH
  if (['HCQ', 'HCQH'].includes(series)) {
    if (maxPower < 500) return { sae: ['SAE1#4寸', 'SAE1#6寸'], plainFlange: true };
    if (maxPower < 1500) return { sae: ['SAE1#8寸', 'SAE2#1寸'], plainFlange: true, domestic: ['φ770'] };
    return { sae: ['SAE0#18寸', 'SAE2#1寸'], plainFlange: true, domestic: ['φ770'] };
  }

  // HCA / HCAG
  if (['HCA', 'HCAG'].includes(series)) {
    if (maxPower < 500) return { sae: ['SAE1#1.5寸', 'SAE1#4寸'], plainFlange: true };
    if (maxPower < 1500) return { sae: ['SAE1#8寸', 'SAE2#1寸'], plainFlange: true, domestic: ['φ770'] };
    return { sae: ['SAE2#1寸'], plainFlange: true, domestic: ['φ770'] };
  }

  // HCM / HCAM / HCNM 铝合金
  if (['HCM', 'HCAM', 'HCNM'].includes(series)) {
    return { plainFlange: true, domestic: ['φ770'] };
  }

  // HCV / HCVG
  if (['HCV', 'HCVG'].includes(series)) {
    return { plainFlange: true, domestic: ['φ770'] };
  }

  // HCG 高速
  if (series === 'HCG') {
    return { plainFlange: true, domestic: ['φ770'] };
  }

  // HCW
  if (series === 'HCW') {
    return { sae: ['SAE1#8寸', 'SAE2#1寸'], plainFlange: true, domestic: ['φ770'] };
  }

  // HCP / 混合动力
  if (series === 'HCP' || series === '混合动力') {
    return { sae: ['SAE18寸', 'SAE21寸'], plainFlange: true, domestic: ['φ640', 'φ820'] };
  }

  // DT 电推
  if (series === 'DT') {
    if (maxPower < 500) return { sae: ['SAE14寸', 'SAE16寸'], plainFlange: true };
    if (maxPower < 2000) return { sae: ['SAE18寸', 'SAE21寸'], plainFlange: true };
    return { sae: ['SAE24寸', 'SAE30寸'], plainFlange: true };
  }

  // GW
  if (series === 'GW') {
    if (maxPower < 3000) return { sae: ['SAE1#8寸', 'SAE1#14寸'], plainFlange: true, domestic: ['φ405', 'φ450'] };
    if (maxPower < 10000) return { sae: ['SAE1#14寸', 'SAE2#1寸'], plainFlange: true, domestic: ['φ480', 'φ530'] };
    return { sae: ['SAE2#1寸', 'SAE2#11.5寸'], plainFlange: true, domestic: ['φ530', 'φ570'] };
  }

  // GCS / GCH / GCHT / GCHE / GC配变距桨
  if (['GCS', 'GCH', 'GCHT', 'GCHE', 'GC配变距桨'].includes(series)) {
    if (maxPower < 2000) return { sae: ['SAE1#14寸'], plainFlange: true, domestic: ['φ640'] };
    return { sae: ['SAE0#18寸', 'SAE1#14寸'], plainFlange: true, domestic: ['φ640', 'φ770', 'φ908'] };
  }

  // 默认
  return { plainFlange: true };
}

// ============================================================
// 应用更新
// ============================================================
for (const e of completeGearboxData) {
  // 补全 image
  if (!e.image && imageMap[e.model]) {
    e.image = imageMap[e.model];
    stats.image++;
  }

  // 同步 imageUrl ← image
  if (e.image && !e.imageUrl) {
    e.imageUrl = e.image;
    stats.imageUrl++;
  }

  // 补全 inputInterfaces
  if (!e.inputInterfaces) {
    e.inputInterfaces = getInputInterfaces(e.model, e.series, e.maxPower || 0);
    stats.inputInterfaces++;
  }
}

// ============================================================
// 验证
// ============================================================
console.log('\n=== 更新统计 ===');
console.log(`  image: +${stats.image}`);
console.log(`  imageUrl: +${stats.imageUrl}`);
console.log(`  inputInterfaces: +${stats.inputInterfaces}`);

const checkFields = ['image', 'imageUrl', 'inputInterfaces'];
checkFields.forEach(f => {
  const has = completeGearboxData.filter(e => e[f] && (typeof e[f] !== 'object' || Object.keys(e[f]).length > 0)).length;
  console.log(`  ${has === 585 ? '✅' : '🔵'} ${f}: ${has}/585 (${Math.round(has / 585 * 100)}%)`);
});

// 写回
const output = `export const completeGearboxData = ${JSON.stringify(completeGearboxData, null, 4)};\n`;
fs.writeFileSync('./src/data/completeGearboxData.js', output, 'utf8');
console.log(`\n✓ completeGearboxData.js 已更新 (${(output.length / 1024).toFixed(0)}KB)`);
