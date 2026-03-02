// src/utils/priceFormatter.js
// Unified price formatting utility

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
