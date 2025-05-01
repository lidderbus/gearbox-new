"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDiscountRate = exports.calculateMarketPrice = exports.calculatePackagePrice = exports.calculateFactoryPrice = void 0;

// utils/priceDiscount.js
// 计算工厂价格
var calculateFactoryPrice = function calculateFactoryPrice(item) {
  if (!item) return 0;
  var basePrice = item.basePrice || item.price || 0; // 确保折扣率使用小数表示 (0-1范围) 而不是百分比 (0-100范围)

  var discountRate = typeof item.discountRate === 'number' ? item.discountRate : getDiscountRate(item.model); // 修正可能的折扣率格式错误（如果大于1，则视为百分比格式）

  if (discountRate > 1) {
    console.warn("\u68C0\u6D4B\u5230\u53EF\u80FD\u7684\u6298\u6263\u7387\u683C\u5F0F\u9519\u8BEF\uFF1A".concat(discountRate, "\uFF0C\u81EA\u52A8\u8F6C\u6362\u4E3A\u5C0F\u6570"));
    discountRate = discountRate / 100;
  } // 确保折扣率在合理范围内


  discountRate = Math.max(0, Math.min(0.5, discountRate));
  return Math.round(basePrice * (1 - discountRate));
}; // 计算打包价格 - 改进版使用工厂价格而非价格


exports.calculateFactoryPrice = calculateFactoryPrice;

var calculatePackagePrice = function calculatePackagePrice(gearbox, coupling, pump) {
  var total = 0;

  if (gearbox) {
    total += gearbox.factoryPrice || calculateFactoryPrice(gearbox) || 0;
  }

  if (coupling) {
    total += coupling.factoryPrice || calculateFactoryPrice(coupling) || 0;
  }

  if (pump) {
    total += pump.factoryPrice || calculateFactoryPrice(pump) || 0;
  }

  return total;
}; // 计算市场价格 - 基于工厂价格或打包价格


exports.calculatePackagePrice = calculatePackagePrice;

var calculateMarketPrice = function calculateMarketPrice(item, packagePrice) {
  if (!item) return 0; // 如果组件已经有市场价，则优先使用

  if (item.marketPrice && typeof item.marketPrice === 'number' && item.marketPrice > 0) {
    return item.marketPrice;
  } // 准备计算市场价的基准价格


  var baseForMarketPrice = 0; // 如果有工厂价，则使用工厂价作为基准

  if (item.factoryPrice && typeof item.factoryPrice === 'number' && item.factoryPrice > 0) {
    baseForMarketPrice = item.factoryPrice;
  } // 否则如果有打包价格，也使用打包价格作为基准
  else if (packagePrice > 0) {
      baseForMarketPrice = packagePrice;
    } // 如果都没有，则基于基础价格和折扣率计算
    else if (item.basePrice || item.price) {
        var basePrice = item.basePrice || item.price;
        var discountRate = typeof item.discountRate === 'number' ? item.discountRate > 1 ? item.discountRate / 100 : item.discountRate : getDiscountRate(item.model);
        baseForMarketPrice = basePrice * (1 - discountRate);
      } // 如果基准价格有效，则计算市场价（加10%）


  if (baseForMarketPrice > 0) {
    return Math.round(baseForMarketPrice * 1.1);
  } // 最后的后备策略：如果有基础价格，直接使用基础价格


  if (item.basePrice && item.basePrice > 0) {
    return item.basePrice;
  } // 没有可用价格


  return 0;
}; // 获取折扣率 - 修正为使用小数表示


exports.calculateMarketPrice = calculateMarketPrice;

var getDiscountRate = function getDiscountRate(model) {
  // 根据型号返回默认折扣率（小数形式，不是百分比）
  if (!model) return 0.1; // 默认折扣率10%
  // HCM系列折扣率

  if (model.startsWith('HCM')) return 0; // HCM系列全国统一售价，无折扣
  // HC系列折扣率

  if (model.startsWith('HC')) return 0.16; // 16%折扣
  // GW系列折扣率

  if (model.startsWith('GW')) return 0.1; // 10%折扣
  // DT系列折扣率

  if (model.startsWith('DT')) return 0.12; // 12%折扣
  // HCQ系列折扣率

  if (model.startsWith('HCQ')) return 0.15; // 15%折扣
  // HGT系列联轴器折扣率

  if (model.startsWith('HGT')) return 0.1; // 10%折扣
  // PUMP系列备用泵折扣率

  if (model.startsWith('PUMP')) return 0.1; // 10%折扣
  // GC系列折扣率

  if (model.startsWith('GC')) return 0.1; // 10%折扣
  // 其他系列使用默认折扣率

  return 0.1; // 默认10%折扣
};

exports.getDiscountRate = getDiscountRate;