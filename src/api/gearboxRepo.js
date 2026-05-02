// src/api/gearboxRepo.js
// 齿轮箱数据访问层 — 单一来源,封装 completeGearboxData / embeddedData / gearboxPricing 三处散落访问
//
// 使用规则:
// - 新代码统一走本模块, 不要在组件中直接 import 数据文件
// - 旧代码可逐步迁移 (本模块是纯增量, 不破坏现有 import)
// - completeGearboxData 走 lazy chunk, 多次调用单例缓存

import { embeddedGearboxData } from '../data/embeddedData';
import {
  lookupPriceByModel,
  getPriceBadge,
  isPriceMissing
} from '../utils/priceFormatter';

// =============================================================
// 内部缓存
// =============================================================

let _completePromise = null;
let _flatEmbedded = null;

function getFlatEmbedded() {
  if (_flatEmbedded) return _flatEmbedded;
  const arr = [];
  Object.keys(embeddedGearboxData || {}).forEach((seriesKey) => {
    const list = embeddedGearboxData[seriesKey];
    if (Array.isArray(list)) {
      list.forEach((item) => {
        arr.push({ ...item, _seriesKey: seriesKey });
      });
    }
  });
  _flatEmbedded = arr;
  return arr;
}

function normalize(m) {
  return String(m || '').replace(/\s+/g, '').toUpperCase();
}

// =============================================================
// 同步查询接口 (基于 embeddedData)
// =============================================================

/** 列出运行时数据 — 拍平后的型号数组 */
export function listAll() {
  return getFlatEmbedded();
}

/** 按系列 key 列出 (例: 'hcGearboxes' / 'gwGearboxes' / 'hcmGearboxes') */
export function listBySeries(seriesKey) {
  if (!seriesKey) return [];
  const series = embeddedGearboxData?.[seriesKey];
  return Array.isArray(series) ? series : [];
}

/** 按型号查 (同步) */
export function findById(model) {
  if (!model) return null;
  const target = normalize(model);
  return getFlatEmbedded().find((g) => normalize(g.model) === target) || null;
}

/** 关键字搜索 — 型号 + dimensions + remarks */
export function searchByKeyword(keyword) {
  if (!keyword || !keyword.trim()) return [];
  const kw = keyword.trim().toUpperCase();
  return getFlatEmbedded().filter((g) =>
    String(g.model || '').toUpperCase().includes(kw) ||
    String(g.dimensions || '').toUpperCase().includes(kw) ||
    String(g.remarks || '').toUpperCase().includes(kw)
  );
}

// =============================================================
// 异步深数据接口 (902KB chunk, 按需)
// =============================================================

/** 加载完整技术数据 (含尺寸图/认证/扭矩等深度字段) */
export function loadComplete() {
  if (!_completePromise) {
    _completePromise = import(
      /* webpackChunkName: "complete-gearbox-data" */ '../data/completeGearboxData'
    ).then((mod) => mod.completeGearboxData || []);
  }
  return _completePromise;
}

/** 异步按型号查完整技术数据 */
export async function findCompleteById(model) {
  if (!model) return null;
  const all = await loadComplete();
  const target = normalize(model);
  return all.find((g) => normalize(g.model) === target) || null;
}

// =============================================================
// 价格接口 (复用 priceFormatter)
// =============================================================

/** 按型号查价 (含 GW 公式兜底 / 后缀归一化) */
export function getPriceFor(model) {
  return lookupPriceByModel(model);
}

/** 价格徽章数据 + 缺价判断 */
export { getPriceBadge, isPriceMissing };

// =============================================================
// 缓存控制 (测试 / devtools)
// =============================================================

/** 重置内部缓存 — 仅供测试 */
export function _resetCacheForTest() {
  _completePromise = null;
  _flatEmbedded = null;
}
