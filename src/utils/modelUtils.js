/**
 * 型号处理工具函数集
 */

/**
 * 验证型号格式是否有效
 * @param {string} model - 齿轮箱型号
 * @returns {boolean} - 是否为有效型号
 */
export function isValidModel(model) {
  if (!model || typeof model !== 'string') {
    return false;
  }
  
  // 基本验证：型号应包含字母和数字
  const basicPattern = /^[A-Za-z]+[0-9]/;
  if (!basicPattern.test(model)) {
    return false;
  }
  
  // 检查常见系列前缀
  const validPrefixes = ['HC', 'GW', 'HCM', 'DT', 'HCQ', 'GC'];
  const prefix = model.match(/^[A-Za-z]+/)?.[0]?.toUpperCase();
  
  return prefix && validPrefixes.includes(prefix);
}

/**
 * 从型号提取系列信息
 * @param {string} model - 齿轮箱型号
 * @returns {string|null} - 提取的系列信息
 */
export function extractSeriesFromModel(model) {
  if (!isValidModel(model)) {
    return null;
  }
  
  const prefix = model.match(/^[A-Za-z]+/)?.[0]?.toUpperCase();
  return prefix || null;
}

/**
 * 从型号提取功率信息
 * @param {string} model - 齿轮箱型号
 * @returns {number|null} - 提取的功率值(kW)
 */
export function extractPowerFromModel(model) {
  if (!isValidModel(model)) {
    return null;
  }
  
  // 匹配第一组数字作为功率
  const powerMatch = model.match(/([0-9]+)/);
  if (powerMatch) {
    return parseInt(powerMatch[1], 10);
  }
  
  return null;
}

export default {
  isValidModel,
  extractSeriesFromModel,
  extractPowerFromModel
};