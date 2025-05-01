/**
 * 数值处理工具函数集
 */

/**
 * 验证是否为有效数字
 * @param {any} value - 待验证的值
 * @returns {boolean} - 是否为有效数字
 */
export function isValidNumber(value) {
  // 检查是否为数字类型
  if (typeof value === 'number') {
    return !isNaN(value) && isFinite(value);
  }
  
  // 检查字符串是否可转换为有效数字
  if (typeof value === 'string') {
    const trimmed = value.trim();
    if (trimmed === '') return false;
    
    const num = parseFloat(trimmed);
    return !isNaN(num) && isFinite(num);
  }
  
  return false;
}

/**
 * 将输入值转换为数字，无效则返回默认值
 * @param {any} value - 输入值
 * @param {number} defaultValue - 默认值
 * @returns {number} - 转换后的数字
 */
export function parseNumber(value, defaultValue = 0) {
  if (isValidNumber(value)) {
    return typeof value === 'number' ? value : parseFloat(value);
  }
  return defaultValue;
}

/**
 * 确保数字在指定范围内
 * @param {number} value - 输入值
 * @param {number} min - 最小值
 * @param {number} max - 最大值
 * @returns {number} - 限制在范围内的数字
 */
export function clampNumber(value, min, max) {
  return Math.min(Math.max(parseNumber(value), min), max);
}

export default {
  isValidNumber,
  parseNumber,
  clampNumber
};