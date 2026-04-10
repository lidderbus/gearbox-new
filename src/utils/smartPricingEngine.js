// src/utils/smartPricingEngine.js
// 智能报价引擎 — 基于历史数据的折扣建议

function extractSeries(model) {
  if (!model) return '';
  var m = model.match(/^(HCT|HCD|HCQ|HCA|HCM|HCW|HC|GWC|GWS|GWL|GWK|SGW|DT|GCS|2GWH|HCL|MA|MB)/i);
  return m ? m[1].toUpperCase() : '';
}

function loadQuotationHistory() {
  try { return JSON.parse(localStorage.getItem('gearbox_quotations') || '[]'); }
  catch { return []; }
}

function analyzeHistoricalDiscount(history, model, customerName) {
  if (!history || history.length === 0) return { avgDiscount: 10, count: 0, range: [8, 15] };
  var series = extractSeries(model);
  var relevant = history.filter(function(q) {
    return q.items && q.items.some(function(i) { return extractSeries(i.model || '') === series; });
  });
  if (relevant.length === 0) return { avgDiscount: 10, count: 0, range: [8, 15] };
  var discounts = relevant.map(function(q) { return q.discountPercentage || (q.options && q.options.discountPercentage) || 10; }).filter(function(d) { return d > 0 && d < 50; });
  if (discounts.length === 0) return { avgDiscount: 10, count: relevant.length, range: [8, 15] };
  var avg = discounts.reduce(function(s, d) { return s + d; }, 0) / discounts.length;
  var customerQuotes = relevant.filter(function(q) { return q.customerInfo && q.customerInfo.name === customerName; });
  var customerAvg = customerQuotes.length > 0 ? customerQuotes.map(function(q) { return q.discountPercentage || 10; }).reduce(function(s, d) { return s + d; }, 0) / customerQuotes.length : null;
  return { avgDiscount: Math.round(avg * 10) / 10, count: relevant.length, range: [Math.min.apply(null, discounts), Math.max.apply(null, discounts)], customerAvg: customerAvg };
}

function calculateVolumeDiscount(quantity) {
  if (quantity >= 10) return 5;
  if (quantity >= 5) return 3;
  if (quantity >= 3) return 2;
  if (quantity >= 2) return 1;
  return 0;
}

function calculateLoyaltyDiscount(history, customerName) {
  if (!customerName || !history) return 0;
  var count = history.filter(function(q) { return q.customerInfo && q.customerInfo.name === customerName; }).length;
  if (count >= 10) return 3;
  if (count >= 5) return 2;
  if (count >= 2) return 1;
  return 0;
}

export function analyzePricing(model, quantity, customerName) {
  var history = loadQuotationHistory();
  var historical = analyzeHistoricalDiscount(history, model, customerName);
  var volume = calculateVolumeDiscount(quantity);
  var loyalty = calculateLoyaltyDiscount(history, customerName);
  var suggested = Math.min(25, Math.max(historical.avgDiscount, 10) + volume + loyalty);
  var confidence = historical.count >= 10 ? 'high' : historical.count >= 3 ? 'medium' : 'low';
  var reasoning = [];
  if (historical.count > 0) reasoning.push('历史' + historical.count + '单均折' + historical.avgDiscount + '%');
  if (volume > 0) reasoning.push('批量+' + volume + '%');
  if (loyalty > 0) reasoning.push('老客户+' + loyalty + '%');
  return { suggestedDiscount: Math.round(suggested * 10) / 10, historicalDiscount: historical, volumeDiscount: volume, loyaltyDiscount: loyalty, confidence: confidence, reasoning: reasoning };
}

export function getPricingStrategy(model, basePrice, quantity, customerName) {
  var analysis = analyzePricing(model, quantity, customerName);
  var discount = analysis.suggestedDiscount;
  var discountedPrice = basePrice * (1 - discount / 100);
  var totalPrice = discountedPrice * quantity;
  return {
    ...analysis,
    basePrice: basePrice,
    discountedPrice: Math.round(discountedPrice),
    totalPrice: Math.round(totalPrice),
    savings: Math.round(basePrice * quantity - totalPrice),
    strategies: [
      { name: '标准报价', discount: 10, price: Math.round(basePrice * 0.9 * quantity), desc: '常规下浮10%' },
      { name: '智能推荐', discount: discount, price: Math.round(totalPrice), desc: analysis.reasoning.join(', ') || '综合推荐', recommended: true },
      { name: '竞争报价', discount: Math.min(25, discount + 3), price: Math.round(basePrice * (1 - Math.min(25, discount + 3) / 100) * quantity), desc: '更具竞争力' },
    ]
  };
}
