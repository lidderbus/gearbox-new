// src/utils/inputValidator.js
// 实时输入验证工具 - 提供选型参数的即时验证和反馈

/**
 * 验证规则定义
 */
const VALIDATION_RULES = {
  motorPower: {
    min: 10,
    max: 5000,
    unit: 'kW',
    label: '主机功率',
    tips: {
      low: '功率过低，建议选择40A或MB170等小型齿轮箱',
      high: '功率超过常规范围，请确认数据准确性',
      empty: '请输入主机功率'
    }
  },
  motorSpeed: {
    min: 500,
    max: 3500,
    unit: 'rpm',
    label: '主机转速',
    commonRanges: [
      { range: [750, 1000], description: '低速柴油机' },
      { range: [1000, 1500], description: '中速柴油机' },
      { range: [1500, 2200], description: '高速柴油机' },
      { range: [2200, 3500], description: '汽油机/高速机' }
    ],
    tips: {
      low: '转速较低，适合低速柴油机匹配',
      high: '转速较高，请确认齿轮箱支持的输入转速范围',
      empty: '请输入主机转速'
    }
  },
  targetRatio: {
    min: 1.0,
    max: 10.0,
    label: '目标速比',
    commonRatios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0],
    tips: {
      low: '速比过低，螺旋桨转速可能过高',
      high: '速比过高，可能需要特殊型号齿轮箱',
      empty: '请输入目标减速比'
    }
  },
  thrust: {
    min: 0,
    max: 500,
    unit: 'kN',
    label: '推力要求',
    tips: {
      high: '推力要求较高，请确认齿轮箱推力轴承能力',
      empty: '推力为选填项，不填默认不限制'
    }
  },
  temperature: {
    min: -10,
    max: 80,
    default: 30,
    unit: '°C',
    label: '工作温度',
    tips: {
      low: '低温环境可能需要特殊润滑油',
      high: '高温环境会影响联轴器橡胶件寿命'
    }
  },
  safetyFactor: {
    min: 1.0,
    max: 2.5,
    default: 1.2,
    label: '安全系数',
    recommended: {
      'I类:扭矩变化很小': 1.0,
      'II类:扭矩变化小': 1.2,
      'III类:扭矩变化中等': 1.4,
      'IV类:扭矩变化大': 1.6,
      'V类:扭矩变化很大': 1.8
    }
  }
};

/**
 * 验证状态枚举
 */
export const ValidationStatus = {
  VALID: 'valid',
  WARNING: 'warning',
  ERROR: 'error',
  EMPTY: 'empty',
  INFO: 'info'
};

/**
 * 验证单个字段
 * @param {string} fieldName - 字段名
 * @param {any} value - 字段值
 * @param {object} context - 上下文 (其他字段值)
 * @returns {object} 验证结果
 */
export const validateField = (fieldName, value, context = {}) => {
  const rule = VALIDATION_RULES[fieldName];
  if (!rule) {
    return { status: ValidationStatus.VALID, message: '' };
  }

  const result = {
    status: ValidationStatus.VALID,
    message: '',
    suggestion: null,
    details: null
  };

  // 空值检查
  if (value === '' || value === null || value === undefined) {
    const isRequired = ['motorPower', 'motorSpeed', 'targetRatio'].includes(fieldName);
    result.status = isRequired ? ValidationStatus.ERROR : ValidationStatus.EMPTY;
    result.message = rule.tips?.empty || '';
    return result;
  }

  const numValue = parseFloat(value);

  // 数值有效性检查
  if (isNaN(numValue)) {
    result.status = ValidationStatus.ERROR;
    result.message = '请输入有效数字';
    return result;
  }

  // 范围检查
  if (rule.min !== undefined && numValue < rule.min) {
    result.status = ValidationStatus.WARNING;
    result.message = rule.tips?.low || `${rule.label}低于最小值 ${rule.min}${rule.unit || ''}`;
    return result;
  }

  if (rule.max !== undefined && numValue > rule.max) {
    result.status = ValidationStatus.WARNING;
    result.message = rule.tips?.high || `${rule.label}超过最大值 ${rule.max}${rule.unit || ''}`;
    return result;
  }

  // 特殊验证逻辑
  switch (fieldName) {
    case 'motorSpeed':
      // 检查是否在常见转速范围内
      const speedRange = rule.commonRanges?.find(r =>
        numValue >= r.range[0] && numValue <= r.range[1]
      );
      if (speedRange) {
        result.details = { engineType: speedRange.description };
      }
      break;

    case 'targetRatio':
      // 检查是否为常见速比
      const isCommonRatio = rule.commonRatios?.some(r =>
        Math.abs(r - numValue) < 0.1
      );
      if (!isCommonRatio && numValue >= 1.0) {
        const nearest = rule.commonRatios?.reduce((prev, curr) =>
          Math.abs(curr - numValue) < Math.abs(prev - numValue) ? curr : prev
        );
        result.status = ValidationStatus.INFO;
        result.message = `建议使用常见速比: ${nearest}`;
        result.suggestion = nearest;
      }
      break;

    case 'safetyFactor':
      // 检查是否与工作条件匹配
      if (context.workCondition) {
        const recommended = rule.recommended?.[context.workCondition];
        if (recommended && Math.abs(recommended - numValue) > 0.3) {
          result.status = ValidationStatus.INFO;
          result.message = `${context.workCondition}建议安全系数: ${recommended}`;
          result.suggestion = recommended;
        }
      }
      break;

    default:
      break;
  }

  return result;
};

/**
 * 验证所有字段
 * @param {object} params - 所有参数
 * @returns {object} 所有字段的验证结果
 */
export const validateAllFields = (params) => {
  const results = {};
  const context = { ...params };

  for (const fieldName of Object.keys(VALIDATION_RULES)) {
    results[fieldName] = validateField(fieldName, params[fieldName], context);
  }

  // 交叉验证
  const crossValidation = performCrossValidation(params);
  results._cross = crossValidation;

  return results;
};

/**
 * 执行交叉验证
 * @param {object} params - 所有参数
 * @returns {Array} 交叉验证警告列表
 */
const performCrossValidation = (params) => {
  const warnings = [];

  const power = parseFloat(params.motorPower) || 0;
  const speed = parseFloat(params.motorSpeed) || 0;
  const ratio = parseFloat(params.targetRatio) || 0;

  // 功率-速比关系验证
  if (power > 0 && ratio > 0) {
    // 大功率通常需要较小的速比
    if (power > 500 && ratio < 2.5) {
      warnings.push({
        type: 'power-ratio',
        message: '大功率配置建议使用较大速比以降低螺旋桨转速',
        severity: 'info'
      });
    }
  }

  // 功率-转速关系验证
  if (power > 0 && speed > 0) {
    // 计算扭矩
    const torque = (9550 * power) / speed;
    if (torque > 5000) {
      warnings.push({
        type: 'high-torque',
        message: `扭矩较大 (${Math.round(torque)} N·m)，请确认齿轮箱承载能力`,
        severity: 'warning'
      });
    }
  }

  // 螺旋桨转速估算
  if (speed > 0 && ratio > 0) {
    const propSpeed = speed / ratio;
    if (propSpeed > 600) {
      warnings.push({
        type: 'prop-speed',
        message: `螺旋桨转速约 ${Math.round(propSpeed)} rpm，建议增大速比`,
        severity: 'info'
      });
    }
    if (propSpeed < 150) {
      warnings.push({
        type: 'prop-speed-low',
        message: `螺旋桨转速约 ${Math.round(propSpeed)} rpm，可能过低`,
        severity: 'info'
      });
    }
  }

  return warnings;
};

/**
 * 获取验证状态对应的Bootstrap类名
 * @param {string} status - 验证状态
 * @returns {string} 类名
 */
export const getStatusClassName = (status) => {
  switch (status) {
    case ValidationStatus.VALID:
      return 'is-valid';
    case ValidationStatus.WARNING:
      return 'border-warning';
    case ValidationStatus.ERROR:
      return 'is-invalid';
    case ValidationStatus.INFO:
      return 'border-info';
    default:
      return '';
  }
};

/**
 * 获取验证状态对应的颜色
 * @param {string} status - 验证状态
 * @returns {string} 颜色值
 */
export const getStatusColor = (status) => {
  switch (status) {
    case ValidationStatus.VALID:
      return '#198754'; // success
    case ValidationStatus.WARNING:
      return '#ffc107'; // warning
    case ValidationStatus.ERROR:
      return '#dc3545'; // danger
    case ValidationStatus.INFO:
      return '#0dcaf0'; // info
    default:
      return '#6c757d'; // secondary
  }
};

/**
 * 检查是否所有必填字段都有效
 * @param {object} validationResults - 验证结果
 * @returns {boolean} 是否可以提交
 */
export const canSubmit = (validationResults) => {
  const requiredFields = ['motorPower', 'motorSpeed', 'targetRatio'];

  for (const field of requiredFields) {
    const result = validationResults[field];
    if (!result || result.status === ValidationStatus.ERROR || result.status === ValidationStatus.EMPTY) {
      return false;
    }
  }

  return true;
};

/**
 * 获取验证摘要
 * @param {object} validationResults - 验证结果
 * @returns {object} 摘要信息
 */
export const getValidationSummary = (validationResults) => {
  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;

  for (const [key, result] of Object.entries(validationResults)) {
    if (key === '_cross') {
      warningCount += result.filter(w => w.severity === 'warning').length;
      infoCount += result.filter(w => w.severity === 'info').length;
    } else {
      if (result.status === ValidationStatus.ERROR) errorCount++;
      if (result.status === ValidationStatus.WARNING) warningCount++;
      if (result.status === ValidationStatus.INFO) infoCount++;
    }
  }

  return {
    isValid: errorCount === 0,
    errorCount,
    warningCount,
    infoCount,
    totalIssues: errorCount + warningCount
  };
};

export default {
  validateField,
  validateAllFields,
  getStatusClassName,
  getStatusColor,
  canSubmit,
  getValidationSummary,
  ValidationStatus
};
