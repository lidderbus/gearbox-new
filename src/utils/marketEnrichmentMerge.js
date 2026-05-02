// src/utils/marketEnrichmentMerge.js
// P1#1 (2026-04-24): 将 ERP marketEnrichment.json 合并到运行时齿轮箱数据
// 之前 marketEnrichment 仅以静态 JSON 存在, UI 已引用 gearbox.marketData 但从未赋值。
// 此工具在启动数据加载阶段把 103 条富化记录按型号名匹配写入 gearbox.marketData 子对象。

import { logger } from '../config/logging';
import marketEnrichment from '../data/marketEnrichment.json';

const GEARBOX_COLLECTIONS = [
  'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
  'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
  'hcvGearboxes', 'mvGearboxes', 'otherGearboxes', 'hcmMatchingCases'
];

const normalize = (m) => String(m || '').replace(/\s+/g, '').toUpperCase();
const stripSuffix = (m) =>
  normalize(m)
    .replace(/\([^)]*\)$/, '')
    .replace(/带PTO$/i, '')
    .replace(/滑动轴承$/i, '');

/**
 * 构建归一化索引
 */
const buildIndex = () => {
  const records = marketEnrichment?.records || {};
  const exact = new Map();
  const stripped = new Map();
  for (const [model, rec] of Object.entries(records)) {
    exact.set(normalize(model), rec);
    const s = stripSuffix(model);
    if (!stripped.has(s)) stripped.set(s, rec);
  }
  return { exact, stripped };
};

/**
 * 将 marketEnrichment 合并到 workingData 的各齿轮箱集合
 * @param {Object} workingData - appData (mutable, will be modified in-place)
 * @returns {{ hit: number, total: number }}
 */
export function mergeMarketEnrichment(workingData) {
  if (!workingData || typeof workingData !== 'object') {
    return { hit: 0, total: 0 };
  }
  const idx = buildIndex();
  let hit = 0;
  let total = 0;

  for (const collection of GEARBOX_COLLECTIONS) {
    const arr = workingData[collection];
    if (!Array.isArray(arr)) continue;
    for (const gearbox of arr) {
      if (!gearbox || !gearbox.model) continue;
      total++;
      if (gearbox.marketData) continue;  // 已存在则不覆盖
      const n = normalize(gearbox.model);
      const s = stripSuffix(gearbox.model);
      const rec = idx.exact.get(n) || idx.stripped.get(s);
      if (rec) {
        gearbox.marketData = { ...rec, _source: 'marketEnrichment' };
        hit++;
      }
    }
  }

  if (typeof logger?.log === 'function') {
    logger.log(`marketEnrichmentMerge: 命中 ${hit} / ${total} 型号 (富化源 ${Object.keys(marketEnrichment?.records || {}).length} 条)`);
  }
  return { hit, total };
}

export default mergeMarketEnrichment;
