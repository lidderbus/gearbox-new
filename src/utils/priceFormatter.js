// src/utils/priceFormatter.js
// Unified price formatting utility — supports dual pricing mode
// v2 (2026-04-24): 新增 isPriceMissing / getPriceBadge / lookupPriceByModel
//                  + 对 149 个 inline-price 缺失的型号自动反查 gearboxPriceData
//                  + GW 系列走 getGwSeriesPrice 公式兜底
//                  + 支持 "去后缀 (带PTO/滑动轴承/(x-y:1))" 归一化匹配

import { getPriceMode, PRICE_MODE, getMarkupRate } from '../data/priceDiscount';
import { gearboxPriceData, getGwSeriesPrice } from '../data/gearboxPricing';

/** 归一化型号(大写、去空格) */
const normalize = (m) => String(m || '').replace(/\s+/g, '').toUpperCase();
/** 去掉后缀 "(xxx)"、"带PTO"、"滑动轴承" */
const stripSuffix = (m) =>
  normalize(m)
    .replace(/\([^)]*\)$/, '')
    .replace(/带PTO$/i, '')
    .replace(/滑动轴承$/i, '')
    .replace(/\s+/g, '');

/** 构建一次性 Map 加速反查 */
let _priceIndex = null;
const buildPriceIndex = () => {
  if (_priceIndex) return _priceIndex;
  _priceIndex = { exact: new Map(), stripped: new Map() };
  for (const row of gearboxPriceData) {
    const factory = row.discountedPrice || row.factoryPrice || row.basePrice;
    if (!factory || factory <= 0) continue;
    _priceIndex.exact.set(normalize(row.model), factory);
    const s = stripSuffix(row.model);
    if (!_priceIndex.stripped.has(s)) _priceIndex.stripped.set(s, factory);
  }
  return _priceIndex;
};

/**
 * 反查型号价格 (含 GW 公式、去后缀 fallback)
 * @param {string} model
 * @returns {{factoryPrice: number|null, source: 'gw-formula'|'exact'|'stripped'|null}}
 */
export const lookupPriceByModel = (model) => {
  if (!model) return { factoryPrice: null, source: null };
  const idx = buildPriceIndex();

  // 1) GW 系列公式优先
  if (/^(GWC|GWS|GWD|GWH|GWL|GWK)/i.test(model)) {
    const stripped = model.replace(/\s*\([^)]*\)$/, '').replace(/\s*带PTO.*$/i, '').replace(/\s*滑动轴承.*$/i, '').trim();
    const gw = getGwSeriesPrice(stripped);
    if (gw) return { factoryPrice: gw, source: 'gw-formula' };
  }

  // 2) 精确匹配
  const n = normalize(model);
  if (idx.exact.has(n)) return { factoryPrice: idx.exact.get(n), source: 'exact' };

  // 3) 去后缀匹配
  const s = stripSuffix(model);
  if (idx.stripped.has(s)) return { factoryPrice: idx.stripped.get(s), source: 'stripped' };

  return { factoryPrice: null, source: null };
};

/**
 * 判断产品是否缺价 — 统一入口供 UI 展示徽章
 * @param {object} product
 * @returns {boolean}
 */
export const isPriceMissing = (product) => {
  if (!product) return true;
  const inline = product.factoryPrice || product.marketPrice || product.price || product.basePrice;
  if (inline && inline > 0) return false;
  const { factoryPrice } = lookupPriceByModel(product.model);
  return !factoryPrice || factoryPrice <= 0;
};

/**
 * 返回询价/有价徽章所需信息
 * @returns {{text: string, variant: string, tooltip: string, isMissing: boolean}}
 */
export const getPriceBadge = (product) => {
  if (isPriceMissing(product)) {
    return {
      text: '询价',
      variant: 'warning',
      tooltip: '此型号暂无公开报价,请联系销售获取最新价格',
      isMissing: true
    };
  }
  return { text: '有价', variant: 'success', tooltip: '', isMissing: false };
};

/**
 * Format price with ¥ symbol, show fallback for invalid values
 * @param {number} price - price value
 * @param {string} fallback - fallback text for invalid price
 * @returns {string}
 */
export const formatPrice = (price, fallback = '询价') => {
  if (!price || price <= 0 || isNaN(price)) return fallback;
  return `¥${price.toLocaleString('zh-CN')}`;
};

/**
 * P0#2 — 渲染层统一入口: 接受 product 或 (model, inlinePrice)
 * 自动走 lookupPriceByModel 兜底 (GW公式+去后缀), 缺价时返回 '询价'
 * @param {object|string} productOrModel - product 对象或 model 字符串
 * @param {string} fallback - 兜底文案
 * @returns {string}
 */
export const formatPriceWithFallback = (productOrModel, fallback = '询价') => {
  let inline = 0;
  let model = '';
  if (typeof productOrModel === 'string') {
    model = productOrModel;
  } else if (productOrModel && typeof productOrModel === 'object') {
    inline = productOrModel.factoryPrice || productOrModel.marketPrice || productOrModel.price || productOrModel.basePrice || 0;
    model = productOrModel.model || '';
  }
  if (inline && inline > 0) return `¥${Number(inline).toLocaleString('zh-CN')}`;
  if (model) {
    const { factoryPrice } = lookupPriceByModel(model);
    if (factoryPrice && factoryPrice > 0) return `¥${Number(factoryPrice).toLocaleString('zh-CN')}`;
  }
  // dev-only 警告: 帮定位 UI 上仍裸渲染 ¥0/undefined 的位置
  if (process.env.NODE_ENV !== 'production' && model) {
    console.warn(`[priceFormatter] 缺价回落: model=${model}, 走 ${fallback} 兜底`);
  }
  return fallback;
};

/**
 * Get display price based on current mode (internal/external).
 * 若 inline 无价,自动 fallback 到 gearboxPriceData 反查 + GW 公式。
 * @param {object} product - must have factoryPrice and/or marketPrice
 * @returns {number} the appropriate price for current mode
 */
export const getDisplayPrice = (product) => {
  if (!product) return 0;
  const mode = getPriceMode();
  let factory = product.factoryPrice || 0;
  let market = product.marketPrice || 0;

  if (!factory) {
    const { factoryPrice } = lookupPriceByModel(product.model);
    if (factoryPrice) factory = factoryPrice;
  }

  if (mode === PRICE_MODE.INTERNAL) return factory;
  if (market) return market;
  return Math.round((factory || 0) * getMarkupRate(product.model));
};

/**
 * Format price with mode label suffix
 * @returns {string} e.g. "¥125,000 (进价)" or "¥137,500 (报价)"
 */
export const formatPriceWithMode = (product, fallback = '询价') => {
  const price = getDisplayPrice(product);
  if (!price || price <= 0) return fallback;
  return `¥${price.toLocaleString('zh-CN')}`;
};

/**
 * Get mode label for UI display
 */
export const getPriceModeLabel = () => {
  return getPriceMode() === PRICE_MODE.INTERNAL ? '内部进价' : '外部报价';
};
