// src/utils/packageResolver.js
// 跨系列配套包解析器 — 给定齿轮箱型号, 返回 {gearbox, coupling, pump, packagePrice} 套件
// 优先级: GW 预设 > HC/HCT/HCD 显式列表 > gearboxMatchingMaps 动态推断

import { gwPackagePriceConfigs } from '../data/packagePriceConfig';
import {
  hcPackagePriceConfigs,
  hctPackagePriceConfigs,
  hcdPackagePriceConfigs
} from '../data/packagePriceConfigExtended';
import {
  getRecommendedPump,
  getRecommendedCouplingInfo
} from '../data/gearboxMatchingMaps';
import { lookupPriceByModel } from './priceFormatter';
import { PRICE_VERSION } from './priceVersioning';

const ALL_EXPLICIT = [
  ...gwPackagePriceConfigs,
  ...hcPackagePriceConfigs,
  ...hctPackagePriceConfigs,
  ...hcdPackagePriceConfigs
];

/**
 * 在显式数组中按齿轮箱型号查找
 */
const findExplicit = (gearboxModel) =>
  ALL_EXPLICIT.find(cfg => cfg.gearboxModel === gearboxModel);

/**
 * 取一个型号的当前价 (走兜底反查, 缺价返回 null + 'inquiry' 标记)
 */
const priceFor = (model) => {
  if (!model) return { price: null, source: 'missing' };
  const lookup = lookupPriceByModel(model);
  if (lookup && (lookup.factoryPrice || lookup.marketPrice)) {
    const price = lookup.factoryPrice || lookup.marketPrice;
    return { price, source: lookup.source || 'pricing-data' };
  }
  return { price: null, source: 'inquiry' };
};

/**
 * 解析齿轮箱配套包
 * @param {string} gearboxModel
 * @param {Object} [opts]
 * @param {boolean} [opts.withCover=false] 联轴器带罩壳
 * @returns {Object|null}
 *   {
 *     gearbox: {model, price, source},
 *     coupling: {model, price, source},
 *     pump: {model, price, source},
 *     packagePrice: number|null,         // GW 预设包价 / 否则 sum of three
 *     totalCalculated: number,           // 始终是三者之和（可能含 0/缺价）
 *     hasInquiry: boolean,               // 任一组件价格缺失
 *     source: 'gw-explicit' | 'hc-explicit' | 'hct-explicit' | 'hcd-explicit' | 'dynamic',
 *     priceVersionTag: '价格版本',
 *   }
 */
export const resolvePackage = (gearboxModel, opts = {}) => {
  if (!gearboxModel) return null;
  const { withCover = false } = opts;

  // 1) 优先显式查表
  const explicit = findExplicit(gearboxModel);
  let couplingModel;
  let pumpModel;
  let presetPackagePrice = null;
  let source;

  if (explicit) {
    couplingModel = explicit.recommendedCoupling;
    pumpModel = explicit.recommendedPump;
    presetPackagePrice = explicit.packagePrice;
    if (gwPackagePriceConfigs.includes(explicit)) source = 'gw-explicit';
    else if (hcPackagePriceConfigs.includes(explicit)) source = 'hc-explicit';
    else if (hctPackagePriceConfigs.includes(explicit)) source = 'hct-explicit';
    else if (hcdPackagePriceConfigs.includes(explicit)) source = 'hcd-explicit';
  } else {
    // 2) 走 gearboxMatchingMaps 动态推断
    const couplingInfo = getRecommendedCouplingInfo(gearboxModel, withCover);
    couplingModel = couplingInfo?.specific || couplingInfo?.prefix || null;
    pumpModel = getRecommendedPump(gearboxModel);
    source = 'dynamic';
  }

  const gearbox  = { model: gearboxModel, ...priceFor(gearboxModel) };
  const coupling = couplingModel ? { model: couplingModel, ...priceFor(couplingModel) } : null;
  const pump     = pumpModel ? { model: pumpModel, ...priceFor(pumpModel) } : null;

  const components = [gearbox, coupling, pump].filter(Boolean);
  const totalCalculated = components.reduce((sum, c) => sum + (c.price || 0), 0);
  const hasInquiry = components.some(c => c.price == null);

  // 优先用预设包价 (GW 系列由 packagePriceConfig 维护)
  const packagePrice = presetPackagePrice != null ? presetPackagePrice : (hasInquiry ? null : totalCalculated);

  return {
    gearbox,
    coupling,
    pump,
    packagePrice,
    totalCalculated,
    hasInquiry,
    source,
    priceVersionTag: `${PRICE_VERSION.version} · 截至 ${PRICE_VERSION.lastUpdated}`,
    generatedAt: new Date().toISOString()
  };
};

export default { resolvePackage };
