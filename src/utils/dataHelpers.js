// src/utils/dataHelpers.js

/**
 * 安全地将值转换为浮点数
 * @param {any} value - 要转换的值
 * @return {number} 转换后的浮点数，如果转换失败则返回0
 */
export const safeParseFloat = (value) => {
  if (value === undefined || value === null) return 0;
  if (typeof value === 'number' && !isNaN(value)) return value;
  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

/**
 * 确保值是数字数组
 * @param {any} arr - 要转换的值
 * @return {number[]} 转换后的数字数组
 */
export const ensureArrayOfNumbers = (arr) => {
  if (!arr) return [0];
  if (!Array.isArray(arr)) return [safeParseFloat(arr)];
  return arr.map(v => safeParseFloat(v));
};

/**
 * 确保值是范围数组 [min, max]
 * @param {any} range - 要转换的值
 * @param {number[]} defaultRange - 默认范围
 * @return {number[]} 转换后的范围数组
 */
export const ensureRangeArray = (range, defaultRange = [0, 0]) => {
  if (!range) return defaultRange;
  if (Array.isArray(range) && range.length >= 2) {
    return [safeParseFloat(range[0]), safeParseFloat(range[1])];
  }
  if (typeof range === 'string') {
    const parts = range.split('-').map(p => safeParseFloat(p));
    if (parts.length >= 2) return [parts[0], parts[1]];
  }
  return defaultRange;
};

/**
 * 计算减速比偏差值
 * @param {number} targetRatio - 目标减速比
 * @param {number} actualRatio - 实际减速比
 * @param {string} method - 计算方法 ('absolute'|'percentage')
 * @return {number} 偏差值
 */
export const calculateRatioDeviation = (targetRatio, actualRatio, method = 'absolute') => {
  if (targetRatio <= 0 || actualRatio <= 0) return Infinity;
  
  if (method === 'percentage') {
    return Math.abs((actualRatio - targetRatio) / targetRatio * 100);
  }
  
  return Math.abs(actualRatio - targetRatio);
};

/**
 * 查找最接近目标减速比的数组元素索引
 * @param {number[]} ratios - 减速比数组
 * @param {number} targetRatio - 目标减速比
 * @return {number} 最接近的数组索引
 */
export const findClosestRatioIndex = (ratios, targetRatio) => {
  if (!Array.isArray(ratios) || ratios.length === 0) return -1;
  
  let minDeviation = Infinity;
  let closestIndex = -1;
  
  ratios.forEach((ratio, index) => {
    const deviation = calculateRatioDeviation(targetRatio, ratio);
    if (deviation < minDeviation) {
      minDeviation = deviation;
      closestIndex = index;
    }
  });
  
  return closestIndex;
};

/**
 * 获取齿轮箱相关属性
 * @param {Object} gearbox - 齿轮箱对象
 * @param {number} ratioIndex - 减速比索引
 * @param {string} property - 要获取的属性名
 * @return {any} 属性值
 */
export const getGearboxProperty = (gearbox, ratioIndex, property) => {
  if (!gearbox || !property) return null;
  
  // 直接属性
  if (typeof gearbox[property] !== 'undefined' && !Array.isArray(gearbox[property])) {
    return gearbox[property];
  }
  
  // 数组属性
  if (Array.isArray(gearbox[property])) {
    if (ratioIndex >= 0 && ratioIndex < gearbox[property].length) {
      return gearbox[property][ratioIndex];
    }
    if (gearbox[property].length === 1) {
      return gearbox[property][0]; // 单值数组
    }
  }
  
  return null;
};

/**
 * 格式化价格显示
 * @param {number} price - 价格
 * @param {boolean} includeCurrency - 是否包含货币符号
 * @return {string} 格式化后的价格字符串
 */
export const formatPrice = (price, includeCurrency = true) => {
  if (typeof price !== 'number' || isNaN(price)) return includeCurrency ? '¥0.00' : '0.00';
  
  const formattedPrice = price.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
  
  return includeCurrency ? `¥${formattedPrice}` : formattedPrice;
};