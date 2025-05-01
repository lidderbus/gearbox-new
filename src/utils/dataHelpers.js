// src/utils/dataHelpers.js

/**
 * 格式化日期为本地日期字符串
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  try {
    // 确保date是Date对象
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  } catch (e) {
    console.error('日期格式化错误:', e);
    return String(date);
  }
};

/**
 * 格式化为仅日期字符串
 * @param {Date} date 日期对象
 * @returns {string} 格式化后的日期字符串
 */
export const formatDateOnly = (date) => {
  if (!date) return '';
  
  try {
    const dateObj = date instanceof Date ? date : new Date(date);
    return dateObj.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  } catch (e) {
    console.error('日期格式化错误:', e);
    return String(date);
  }
};

/**
 * 计算两个日期之间的差异（天数）
 * @param {Date|string} date1 第一个日期
 * @param {Date|string} date2 第二个日期
 * @returns {number} 天数差异
 */
export const dateDiffInDays = (date1, date2) => {
  try {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);
    
    // 转换为时间戳并计算天数差
    const diffTime = Math.abs(d2 - d1);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  } catch (e) {
    console.error('计算日期差异错误:', e);
    return 0;
  }
};

/**
 * 安全解析浮点数
 * @param {any} value 要解析的值
 * @returns {number|undefined} 解析后的数字或undefined
 */
export const safeParseFloat = (value) => {
  if (value === undefined || value === null) return undefined;
  const num = parseFloat(value);
  return isNaN(num) ? undefined : num;
};

/**
 * 确保范围数组
 * @param {any} value 输入值
 * @returns {Array} 有效的范围数组
 */
export const ensureRangeArray = (value) => {
  if (Array.isArray(value) && value.length === 2) return value;
  return [0, 0]; // 默认范围
};

/**
 * 确保数字数组
 * @param {Array} arr 输入数组
 * @returns {Array} 只包含有效数字的数组
 */
export const ensureArrayOfNumbers = (arr) => {
  if (!Array.isArray(arr)) return [];
  return arr.map(v => safeParseFloat(v)).filter(v => v !== undefined);
};