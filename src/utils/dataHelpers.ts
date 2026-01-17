// src/utils/dataHelpers.ts
// 数据处理辅助函数 - TypeScript版本

/**
 * 日期输入类型
 */
type DateInput = Date | string | number;

/**
 * 格式化日期为本地日期时间字符串
 * @param date 日期对象或可解析的日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDate = (date: DateInput | null | undefined): string => {
  if (!date) return '';

  try {
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
 * @param date 日期对象或可解析的日期字符串
 * @returns 格式化后的日期字符串
 */
export const formatDateOnly = (date: DateInput | null | undefined): string => {
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
 * @param date1 第一个日期
 * @param date2 第二个日期
 * @returns 天数差异
 */
export const dateDiffInDays = (date1: DateInput, date2: DateInput): number => {
  try {
    const d1 = date1 instanceof Date ? date1 : new Date(date1);
    const d2 = date2 instanceof Date ? date2 : new Date(date2);

    // 转换为时间戳并计算天数差
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  } catch (e) {
    console.error('计算日期差异错误:', e);
    return 0;
  }
};

/**
 * 安全解析浮点数
 * @param value 要解析的值
 * @returns 解析后的数字或undefined
 */
export const safeParseFloat = (value: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined;

  // 如果已经是数字，直接返回
  if (typeof value === 'number') {
    return isNaN(value) ? undefined : value;
  }

  // 尝试解析字符串
  const num = parseFloat(String(value));
  return isNaN(num) ? undefined : num;
};

/**
 * 安全解析整数
 * @param value 要解析的值
 * @returns 解析后的整数或undefined
 */
export const safeParseInt = (value: unknown): number | undefined => {
  if (value === undefined || value === null) return undefined;

  if (typeof value === 'number') {
    return isNaN(value) ? undefined : Math.floor(value);
  }

  const num = parseInt(String(value), 10);
  return isNaN(num) ? undefined : num;
};

/**
 * 确保范围数组
 * @param value 输入值
 * @returns 有效的范围数组 [min, max]
 */
export const ensureRangeArray = (value: unknown): [number, number] => {
  if (Array.isArray(value) && value.length === 2) {
    const min = safeParseFloat(value[0]);
    const max = safeParseFloat(value[1]);
    if (min !== undefined && max !== undefined) {
      return [min, max];
    }
  }
  return [0, 0]; // 默认范围
};

/**
 * 确保数字数组
 * @param arr 输入数组
 * @returns 只包含有效数字的数组
 */
export const ensureArrayOfNumbers = (arr: unknown): number[] => {
  if (!Array.isArray(arr)) return [];
  return arr
    .map(v => safeParseFloat(v))
    .filter((v): v is number => v !== undefined);
};

/**
 * 深度克隆对象
 * @param obj 要克隆的对象
 * @returns 克隆后的对象
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (e) {
    console.error('深度克隆错误:', e);
    return obj;
  }
};

/**
 * 格式化数字为千分位字符串
 * @param value 数字值
 * @param decimals 小数位数
 * @returns 格式化后的字符串
 */
export const formatNumber = (
  value: number | null | undefined,
  decimals: number = 0
): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }

  return value.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  });
};

/**
 * 格式化货币
 * @param value 金额
 * @returns 格式化后的货币字符串
 */
export const formatCurrency = (value: number | null | undefined): string => {
  if (value === null || value === undefined || isNaN(value)) {
    return '-';
  }

  return `¥${formatNumber(value, 2)}`;
};

/**
 * 限制数值在指定范围内
 * @param value 数值
 * @param min 最小值
 * @param max 最大值
 * @returns 限制后的数值
 */
export const clamp = (value: number, min: number, max: number): number => {
  return Math.max(min, Math.min(max, value));
};

/**
 * 检查值是否为空
 * @param value 要检查的值
 * @returns 是否为空
 */
export const isEmpty = (value: unknown): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};
