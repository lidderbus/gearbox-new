// src/data/priceDiscount.js
// 价格折扣计算和管理
// 支持双报价模式: 内部进价(采购成本) / 外部报价(销售定价)

/**
 * ═══════════════════════════════════════════════════════
 * 双报价模式说明 (2026-04-12)
 * ═══════════════════════════════════════════════════════
 *
 * 模式A — 内部进价 (采购成本价)
 *   计算: basePrice × (1 - 下浮率) = 出厂价/进价
 *   用途: 内部核算、采购审批、利润分析、成本控制
 *   判断依据: 公司采购齿轮箱的真实成本
 *     - 有正式采购合同或框架协议的 → 按协议价(进价)
 *     - 批量采购(≥3台同型号) → 进价可再下浮2-5%
 *     - 非标/定制品 → 以供应商报价为准
 *
 * 模式B — 外部报价 (销售定价)
 *   计算: 出厂价 × 加价率(10%-20%) = 市场报价
 *   用途: 对外报价、签合同、客户沟通
 *   判断依据: 给客户的含利润售价
 *     - 标准产品(HC/GW/DT) → 出厂价 × 110%-115%
 *     - 统一售价产品(HCM/HCQ/HCA) → 固定价格，不可下浮
 *     - 竞争性投标 → 可适当降低加价率至105%
 *     - 老客户复购 → 可给予额外2-3%优惠
 *     - 紧急订单/非标改制 → 加价率可上浮至120%
 * ═══════════════════════════════════════════════════════
 */

// 报价模式常量
export const PRICE_MODE = {
  INTERNAL: 'internal',  // 内部进价(采购成本)
  EXTERNAL: 'external',  // 外部报价(销售定价)
};

// 当前报价模式 (默认外部报价, 可通过 setPriceMode 切换)
let _currentPriceMode = PRICE_MODE.EXTERNAL;

export function getPriceMode() { return _currentPriceMode; }
export function setPriceMode(mode) {
  if (mode === PRICE_MODE.INTERNAL || mode === PRICE_MODE.EXTERNAL) {
    _currentPriceMode = mode;
    // 持久化到 localStorage
    try { localStorage.setItem('gearbox_price_mode', mode); } catch {}
  }
}

// 启动时从 localStorage 恢复
try {
  const saved = typeof localStorage !== 'undefined' && localStorage.getItem('gearbox_price_mode');
  if (saved === PRICE_MODE.INTERNAL || saved === PRICE_MODE.EXTERNAL) _currentPriceMode = saved;
} catch {}

// 系列加价率映射 (外部报价时使用)
export const markupRateMap = {
  'HCM': 1.20,   // HCM统一售价系列, 加价20%
  'HCQ': 1.20,   // HCQ统一售价系列
  'HCA': 1.20,   // HCA统一售价系列
  'HCV': 1.15,   // HCV系列
  'DT': 1.18,    // DT大功率系列, 加价18%
  'GWC': 1.15,   // GW系列, 加价15%
  'GWS': 1.15,
  'GWD': 1.15,
  'GWH': 1.15,
  'GWL': 1.15,
  'GWK': 1.15,
  'SGW': 1.15,
  'HC1000': 1.15, // 大型HC, 加价15%
  'HC1200': 1.15,
  'HC1400': 1.15,
  'HC1600': 1.15,
  'HC2000': 1.15,
  'HC2700': 1.15,
  'HC': 1.12,     // 标准HC系列, 加价12%
  'HCD': 1.12,
  'HCT': 1.12,
  'HCW': 1.12,
  'HCL': 1.12,
  'MB': 1.12,
  'default': 1.10, // 默认加价10%
};

/**
 * 根据型号获取加价率 (外部报价模式)
 */
export function getMarkupRate(model) {
  if (!model) return markupRateMap['default'];
  for (let i = 7; i >= 2; i--) {
    if (model.length >= i) {
      const prefix = model.substring(0, i);
      if (markupRateMap[prefix]) return markupRateMap[prefix];
    }
  }
  if (model.startsWith('GW')) return 1.15;
  if (model.startsWith('DT')) return 1.18;
  if (model.startsWith('HC')) return 1.12;
  return markupRateMap['default'];
}

/**
 * 根据当前报价模式获取显示价格
 * @returns {{ displayPrice, priceLabel, factoryPrice, marketPrice, mode }}
 */
export function getPriceByMode(product) {
  const factoryPrice = calculateFactoryPrice(product);
  const markup = getMarkupRate(product?.model);
  const marketPrice = Math.round(factoryPrice * markup);
  const mode = _currentPriceMode;

  if (mode === PRICE_MODE.INTERNAL) {
    return { displayPrice: factoryPrice, priceLabel: '进价(出厂价)', factoryPrice, marketPrice, mode };
  }
  return { displayPrice: marketPrice, priceLabel: '报价(含利润)', factoryPrice, marketPrice, mode };
}

// 内联定义折扣率映射表，避免外部依赖
const discountRateMap = {
  // HCM系列
  'HCM': 0, // HCM系列全国统一售价，无折扣
  
  // HC系列
  'HC': 0.16, // 默认HC系列下浮16%
  'HCD': 0.16,
  'HCT': 0.16,
  'HCW': 0.08, // HCW系列下浮8%
  
  // 特定型号覆盖
  'HC600': 0.12, // HC600系列下浮12%
  'HCD600': 0.12,
  'HCT600': 0.12,
  'HC800': 0.08, // HC800系列下浮8%
  'HCD800': 0.08,
  'HC1000': 0.06, // HC1000及以上下浮6%
  'HCD1000': 0.06,
  'HCT1000': 0.06,
  'HCT1100': 0.06,
  'HCW1100': 0.06,
  'HCT1200': 0.06,
  'HC1400': 0.06,
  'HCD1400': 0.06,
  'HCT1400': 0.06,
  'HCW1400': 0.06,
  
  // HCL系列
  'HCL': 0.12, // HCL系列下浮12%
  
  // GW系列
  'GWC': 0.10, // GW系列下浮10%
  
  // DT系列
  'DT': 0.10, // DT系列下浮10%
  
  // MB系列
  'MB': 0.12, // MB系列下浮12%
  
  // 特殊型号
  '40A': 0.16,
  '120C': 0.12,
  '120B': 0.12,
  '135': 0.16,
  '135A': 0.16,
  '300': 0.16,
  
  // 默认值
  'default': 0.10
};

// 特殊型号的下浮比例
const specialDiscountRates = {
  'J300': 0.22, // 报告特批
  'D300A (4-5.5:1)': 0.22, // 报告特批
  'HC400': 0.22, // 报告特批
  'HCD400A': 0.22, // 报告特批
  'HC1200': 0.14, // 报告特批
  'HC1200/1': 0.10 // 报告特批
};

// 根据型号获取下浮比例
export function getDiscountRate(model) {
  if (!model) return 0.10; // 默认10%下浮
  
  // 1. 先检查特殊型号的精确匹配
  if (specialDiscountRates[model]) {
    return specialDiscountRates[model];
  }
  
  // 2. 尝试通过前缀匹配
  // 先尝试更长的前缀匹配，如HC1200，再尝试短前缀如HC
  for (let i = 7; i >= 2; i--) {
    if (model.length >= i) {
      const prefix = model.substring(0, i);
      if (discountRateMap[prefix]) {
        return discountRateMap[prefix];
      }
    }
  }
  
  // 3. 根据系列类型推断
  if (model.startsWith('HC')) return 0.16;
  if (model.startsWith('HCD')) return 0.16;
  if (model.startsWith('HCT')) return 0.16;
  if (model.startsWith('HCW')) return 0.08;
  if (model.startsWith('HCL')) return 0.12;
  if (model.startsWith('GW')) return 0.10;
  if (model.startsWith('DT')) return 0.10;
  if (model.startsWith('MB')) return 0.12;
  
  // 4. 默认下浮10%
  return 0.10;
}

// 计算工厂价格 (基于基础价格和下浮比例)
export function calculateFactoryPrice(product) {
  if (!product) return 0;
  
  // 确保产品有基础价格
  const basePrice = product.basePrice || product.price || 0;
  
  if (basePrice <= 0) return 0;
  
  // 确定折扣率：使用预设折扣率或根据型号获取
  const discountRate = product.discountRate !== undefined ? 
    product.discountRate / 100 : 
    getDiscountRate(product.model);
  
  // 计算并返回工厂价
  return Math.round(basePrice * (1 - discountRate));
}

// 计算打包价 (齿轮箱 + 可选的联轴器和泵)
export function calculatePackagePrice(gearbox, coupling = null, pump = null) {
  if (!gearbox) return 0;
  
  // 齿轮箱基础价格
  let packagePrice = gearbox.factoryPrice || calculateFactoryPrice(gearbox);
  
  // 添加联轴器价格 (如果有)
  if (coupling && coupling.factoryPrice) {
    packagePrice += coupling.factoryPrice;
  } else if (coupling && coupling.price) {
    packagePrice += coupling.price;
  }
  
  // 添加备用泵价格 (如果有)
  if (pump && pump.factoryPrice) {
    packagePrice += pump.factoryPrice;
  } else if (pump && pump.price) {
    packagePrice += pump.price;
  }
  
  return packagePrice;
}

// 计算市场价格 (基于多种因素灵活定价)
export function calculateMarketPrice(gearbox, packagePrice, marketFactors = {}) {
  // 如果已有市场价，直接使用
  if (gearbox && gearbox.marketPrice) {
    return gearbox.marketPrice;
  }
  
  // 确保参数有效
  if (!gearbox && !packagePrice) return 0;
  
  // 获取基础价格
  const basePrice = packagePrice || (gearbox ? (gearbox.factoryPrice || calculateFactoryPrice(gearbox)) : 0);
  
  // 根据型号系列设置基础加价率
  let baseMarkup = 1.10; // 默认加价10%
  
  if (gearbox && gearbox.model) {
    const model = gearbox.model;
    if (model.startsWith('HC') && (model.includes('1000') || model.includes('1200') || model.includes('1400'))) {
      baseMarkup = 1.15; // 大型HC系列加价15%
    } else if (model.startsWith('HC')) {
      baseMarkup = 1.12; // 标准HC系列加价12%
    } else if (model.startsWith('GW')) {
      baseMarkup = 1.15; // GW系列加价15%
    } else if (model.startsWith('HCM')) {
      baseMarkup = 1.20; // HCM系列加价20%
    } else if (model.startsWith('DT')) {
      baseMarkup = 1.18; // DT系列加价18%
    }
  }
  
  // 应用额外加价因素
  const competitionFactor = marketFactors.competition || 1.0; // 竞争因素 (0.9-1.1)
  const urgencyFactor = marketFactors.urgency || 1.0; // 紧急程度因素 (1.0-1.2)
  const relationshipFactor = marketFactors.relationship || 1.0; // 客户关系因素 (0.95-1.05)
  const seasonalFactor = marketFactors.seasonal || 1.0; // 季节性因素 (0.95-1.05)
  
  // 计算最终市场价格
  const finalMarkup = baseMarkup * competitionFactor * urgencyFactor * relationshipFactor * seasonalFactor;
  
  // 应用安全范围限制 (确保加价率在合理范围内 1.05-1.30)
  const safeMarkup = Math.max(1.05, Math.min(1.30, finalMarkup));
  
  // 计算并返回最终市场价
  return Math.round(basePrice * safeMarkup);
}