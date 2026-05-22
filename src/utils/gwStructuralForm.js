// src/utils/gwStructuralForm.js
// GW 系列子结构形式分类与过滤
//
// 数据来源: src/components/SelectionGuidelines.js:seriesInfo + 杭齿厂选型手册2025版
// 复用: src/config/seriesCapabilityConfig.js:getSeriesCapability(model) 提取前缀

import { getSeriesCapability } from '../config/seriesCapabilityConfig';

// 6 个 GW 子系列 → 4 个结构桶（按输入输出几何关系聚合）
export const STRUCTURAL_BUCKETS = {
  '同中心':     ['GWC', 'GWL'], // 输入输出同中心 · 2 级减速
  '垂直异中心': ['GWS', 'GWK'], // 输出垂直偏置 · 1 级减速
  '水平异中心': ['GWH'],        // 输出水平偏置 · 1 级减速
  '角向异中心': ['GWD'],        // 输出角向偏置 · 1 级减速
};

// 子系列完整元数据（结构 / 级数 / 倒顺 / 描述）
export const GW_SUB_SERIES_META = {
  GWC: { bucket: '同中心',     levels: '2级', hasReverse: true,  desc: '同中心 · 2级 · 倒顺离合减速' },
  GWL: { bucket: '同中心',     levels: '2级', hasReverse: false, desc: '同中心 · 2级 · 离合减速（无倒顺）' },
  GWS: { bucket: '垂直异中心', levels: '1级', hasReverse: true,  desc: '垂直异中心 · 1级 · 倒顺离合减速' },
  GWK: { bucket: '垂直异中心', levels: '1级', hasReverse: false, desc: '垂直异中心 · 1级 · 离合减速（无倒顺）' },
  GWH: { bucket: '水平异中心', levels: '1级', hasReverse: true,  desc: '水平异中心 · 1级 · 倒顺离合减速' },
  GWD: { bucket: '角向异中心', levels: '1级', hasReverse: true,  desc: '角向异中心 · 1级 · 倒顺离合减速' },
};

// 全部子系列前缀列表（UI 渲染顺序）
export const GW_SUB_SERIES_LIST = ['GWC', 'GWL', 'GWS', 'GWK', 'GWH', 'GWD'];

// 全部结构桶名（UI 渲染顺序）
export const STRUCTURAL_BUCKET_LIST = ['同中心', '垂直异中心', '水平异中心', '角向异中心'];

/**
 * 提取型号的 GW 子系列前缀
 * @param {string} model 型号，如 "GWC60.66"
 * @returns {string|null} 子系列前缀，如 "GWC"；非 GW 系列返回 null
 */
export function getGwSubSeries(model) {
  const cap = getSeriesCapability(model);
  if (!cap || !GW_SUB_SERIES_META[cap.prefix]) return null;
  return cap.prefix;
}

/**
 * 判断型号是否通过结构形式过滤器
 * 非 GW 系列直接通过（不受 GW 过滤器影响），GW 系列必须在 allowedSubSeries 集合内
 *
 * @param {string} model 型号
 * @param {string[]} allowedSubSeries 允许的子系列前缀数组；空数组或 null = 不限制
 * @returns {boolean}
 */
export function matchesStructuralFilter(model, allowedSubSeries) {
  const sub = getGwSubSeries(model);
  if (!sub) return true; // 非 GW 系列不受过滤
  if (!allowedSubSeries || allowedSubSeries.length === 0) return true; // 空集 = 不限制
  return allowedSubSeries.includes(sub);
}

/**
 * 给定子系列集合，推算结构桶的勾选状态
 * @param {string[]} subSeries 当前选中的子系列
 * @returns {{ [bucket: string]: 'all' | 'some' | 'none' }}
 */
export function getBucketStates(subSeries) {
  const states = {};
  const set = new Set(subSeries || []);
  for (const [bucket, members] of Object.entries(STRUCTURAL_BUCKETS)) {
    const inCount = members.filter((m) => set.has(m)).length;
    if (inCount === 0) states[bucket] = 'none';
    else if (inCount === members.length) states[bucket] = 'all';
    else states[bucket] = 'some';
  }
  return states;
}
