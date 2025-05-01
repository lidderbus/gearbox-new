// src/utils/enhancedValidator.js
/**
 * 增强型数据验证工具
 * 提供更声明式、可配置的验证规则和更好的错误处理
 */

import { safeParseFloat } from './dataHelpers';
import { DEFAULTS } from '../config';

/**
 * 验证规则定义
 * 使用声明式方式定义业务验证规则
 */
export const validationRules = {
  // 齿轮箱验证规则
  gearbox: {
    model: { type: 'string', required: true, trim: true },
    inputSpeedRange: { 
      type: 'array', 
      length: 2, 
      itemType: 'number', 
      min: 0,
      custom: (value) => value[0] < value[1] ? null : '输入转速范围上限不应小于下限'
    },
    ratios: { 
      type: 'array', 
      minLength: 1, 
      itemType: 'number', 
      min: 0,
      custom: (value) => value.every(v => v > 0) ? null : '减速比必须为正数'
    },
    transferCapacity: { 
      type: 'array',
      minLength: 1,
      itemType: 'number',
      min: 0,
      matchLength: 'ratios',
      custom: (value, item) => {
        if (!Array.isArray(item.ratios)) return null;
        return value.length === item.ratios.length ? 
          null : `传递能力数量(${value.length})与减速比数量(${item.ratios.length})不匹配`;
      }
    },
    thrust: { type: 'number', min: 0, defaultWarning: DEFAULTS.gearbox.thrust },
    centerDistance: { type: 'number', min: 0, defaultWarning: DEFAULTS.gearbox.centerDistance },
    weight: { type: 'number', min: 0, required: true, defaultWarning: DEFAULTS.gearbox.weight },
    efficiency: { type: 'number', min: 0, max: 1, defaultWarning: DEFAULTS.gearbox.efficiency },
    basePrice: { type: 'number', min: 0 },
    price: { type: 'number', min: 0 },
    discountRate: { type: 'number', min: 0, max: 1 },
    factoryPrice: { type: 'number', min: 0 },
    marketPrice: { type: 'number', min: 0 },
    packagePrice: { type: 'number', min: 0 }
  },
  
  // 联轴器验证规则
  coupling: {
    model: { type: 'string', required: true, trim: true },
    torque: { type: 'number', min: 0, required: true, defaultWarning: DEFAULTS.coupling.torque },
    maxTorque: { 
      type: 'number', 
      min: 0, 
      required: true, 
      defaultWarning: DEFAULTS.coupling.maxTorque,
      custom: (value, item) => {
        const torque = safeParseFloat(item.torque);
        return !torque || value >= torque ? null : `最大扭矩(${value})应大于额定扭矩(${torque})`;
      }
    },
    maxSpeed: { type: 'number', min: 0, required: true, defaultWarning: DEFAULTS.coupling.maxSpeed },
    weight: { type: 'number', min: 0, defaultWarning: DEFAULTS.coupling.weight },
    basePrice: { type: 'number', min: 0 },
    price: { type: 'number', min: 0 },
    discountRate: { type: 'number', min: 0, max: 1 },
    factoryPrice: { type: 'number', min: 0 },
    marketPrice: { type: 'number', min: 0 },
    packagePrice: { type: 'number', min: 0 }
  },
  
  // 备用泵验证规则
  pump: {
    model: { type: 'string', required: true, trim: true },
    flow: { type: 'number', min: 0, required: true, defaultWarning: DEFAULTS.sparePump.flow },
    pressure: { type: 'number', min: 0, required: true, defaultWarning: DEFAULTS.sparePump.pressure },
    motorPower: { type: 'number', min: 0, required: true, defaultWarning: DEFAULTS.sparePump.motorPower },
    weight: { type: 'number', min: 0, defaultWarning: DEFAULTS.sparePump.weight },
    basePrice: { type: 'number', min: 0 },
    price: { type: 'number', min: 0 },
    discountRate: { type: 'number', min: 0, max: 1 },
    factoryPrice: { type: 'number', min: 0 },
    marketPrice: { type: 'number', min: 0 },
    packagePrice: { type: 'number', min: 0 }
  }
};

/**
 * 通用验证函数，根据规则验证项目
 * @param {Object} item 待验证项目
 * @param {Object} rules 验证规则
 * @param {Object} options 验证选项
 * @returns {Object} 验证结果 { valid, errors, warnings }
 */
export const validateItem = (item, rules, options = {}) => {
  const { isDefault = false, extraRules = {} } = options;
  const errors = [];
  const warnings = [];
  
  // 合并额外规则
  const mergedRules = { ...rules, ...extraRules };
  
  // 检查每个规则
  Object.keys(mergedRules).forEach(field => {
    const rule = mergedRules[field];
    const value = item[field];
    
    // 检查必需字段
    if (rule.required && (value === undefined || value === null || value === '')) {
      errors.push(`字段 ${field} 是必需的但缺失或为空`);
      return;
    }
    
    // 如果值不存在但非必需，跳过其他验证
    if (value === undefined || value === null || value === '') {
      return;
    }
    
    // 检查类型
    switch(rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`字段 ${field} 应为字符串，但实际为 ${typeof value}`);
          return;
        }
        
        if (rule.trim && !value.trim()) {
          errors.push(`字段 ${field} 不应为空白字符串`);
        }
        break;
        
      case 'number':
        const numValue = safeParseFloat(value);
        if (numValue === undefined || isNaN(numValue)) {
          errors.push(`字段 ${field} 应为数字，但无法解析 "${value}"`);
          return;
        }
        
        if (rule.min !== undefined && numValue < rule.min) {
          errors.push(`字段 ${field} 值 ${numValue} 小于最小值 ${rule.min}`);
        }
        
        if (rule.max !== undefined && numValue > rule.max) {
          errors.push(`字段 ${field} 值 ${numValue} 大于最大值 ${rule.max}`);
        }
        
        // 检查默认值警告
        if (!isDefault && rule.defaultWarning !== undefined && 
            numValue !== undefined && numValue === rule.defaultWarning) {
          warnings.push(`字段 ${field} 使用了默认值 ${rule.defaultWarning}`);
        }
        break;
        
      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`字段 ${field} 应为数组，但实际为 ${typeof value}`);
          return;
        }
        
        if (rule.length !== undefined && value.length !== rule.length) {
          errors.push(`字段 ${field} 数组长度应为 ${rule.length}，但实际为 ${value.length}`);
        }
        
        if (rule.minLength !== undefined && value.length < rule.minLength) {
          errors.push(`字段 ${field} 数组长度应至少为 ${rule.minLength}，但实际为 ${value.length}`);
        }
        
        if (rule.itemType === 'number') {
          const invalidItems = value.filter(v => {
            const num = safeParseFloat(v);
            return num === undefined || isNaN(num) || (rule.min !== undefined && num < rule.min);
          });
          
          if (invalidItems.length > 0) {
            errors.push(`字段 ${field} 包含 ${invalidItems.length} 个无效或非正向数值`);
          }
        }
        
        if (rule.matchLength && item[rule.matchLength] && 
            Array.isArray(item[rule.matchLength]) && 
            value.length !== item[rule.matchLength].length) {
          errors.push(`字段 ${field} 长度 ${value.length} 与字段 ${rule.matchLength} 长度 ${item[rule.matchLength].length} 不匹配`);
        }
        break;
    }
    
    // 执行自定义验证
    if (rule.custom && typeof rule.custom === 'function') {
      const customError = rule.custom(value, item);
      if (customError) {
        errors.push(customError);
      }
    }
  });
  
  // 价格一致性校验（如果有相关字段）
  if (item.basePrice !== undefined && item.discountRate !== undefined && item.factoryPrice !== undefined) {
    const basePrice = safeParseFloat(item.basePrice);
    const discountRate = safeParseFloat(item.discountRate);
    const factoryPrice = safeParseFloat(item.factoryPrice);
    
    if (basePrice > 0 && discountRate >= 0 && discountRate <= 1 && factoryPrice > 0) {
      const expectedFactory = basePrice * (1 - discountRate);
      if (Math.abs(factoryPrice - expectedFactory) > 1) {
        warnings.push(`工厂价 (${factoryPrice}) 与基础价 (${basePrice}) 和折扣率 (${(discountRate*100).toFixed(1)}%) 计算不一致`);
      }
    }
  }
  
  if (item.factoryPrice !== undefined && item.marketPrice !== undefined) {
    const factoryPrice = safeParseFloat(item.factoryPrice);
    const marketPrice = safeParseFloat(item.marketPrice);
    
    if (factoryPrice >= 0 && marketPrice >= 0) {
      const expectedMarket = factoryPrice * 1.1;
      if (Math.abs(marketPrice - expectedMarket) > 1) {
        warnings.push(`市场价 (${marketPrice}) 与工厂价 (${factoryPrice}) 计算不一致 (期望 ${expectedMarket.toFixed(2)})`);
      }
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * 验证齿轮箱数据
 * @param {Object} gearbox 齿轮箱对象
 * @param {number} index 索引
 * @returns {Object} 验证结果
 */
export const validateGearbox = (gearbox, index) => {
  if (!gearbox || typeof gearbox !== 'object') {
    return { 
      valid: false, 
      errors: ['无效的齿轮箱对象格式'], 
      warnings: [], 
      model: `未知-${index}`, 
      originalIndex: index 
    };
  }
  
  const isDefault = gearbox.model === DEFAULTS.gearbox.model;
  const result = validateItem(gearbox, validationRules.gearbox, { isDefault });
  
  return {
    valid: result.valid,
    errors: result.errors,
    warnings: result.warnings,
    model: gearbox.model || `未知-${index}`,
    originalIndex: index
  };
};

/**
 * 验证联轴器数据
 * @param {Object} coupling 联轴器对象
 * @param {number} index 索引
 * @returns {Object} 验证结果
 */
export const validateCoupling = (coupling, index) => {
  if (!coupling || typeof coupling !== 'object') {
    return { 
      valid: false, 
      errors: ['无效的联轴器对象格式'], 
      warnings: [], 
      model: `未知-${index}`, 
      originalIndex: index 
    };
  }
  
  const isDefault = coupling.model === DEFAULTS.coupling.model;
  const result = validateItem(coupling, validationRules.coupling, { isDefault });
  
  return {
    valid: result.valid,
    errors: result.errors,
    warnings: result.warnings,
    model: coupling.model || `未知-${index}`,
    originalIndex: index
  };
};

/**
 * 验证备用泵数据
 * @param {Object} pump 备用泵对象
 * @param {number} index 索引
 * @returns {Object} 验证结果
 */
export const validatePump = (pump, index) => {
  if (!pump || typeof pump !== 'object') {
    return { 
      valid: false, 
      errors: ['无效的备用泵对象格式'], 
      warnings: [], 
      model: `未知-${index}`, 
      originalIndex: index 
    };
  }
  
  const isDefault = pump.model === DEFAULTS.sparePump.model;
  const result = validateItem(pump, validationRules.pump, { isDefault });
  
  return {
    valid: result.valid,
    errors: result.errors,
    warnings: result.warnings,
    model: pump.model || `未知-${index}`,
    originalIndex: index
  };
};

/**
 * 验证整个数据库
 * @param {Object} data 数据库对象
 * @returns {Object} 验证结果
 */
export const validateDatabase = (data) => {
  const results = {
    success: true,
    message: '数据库验证成功',
    details: {},
    summary: { total: 0, valid: 0, invalid: 0, warnings: 0 }
  };
  
  // 如果数据为空或非对象，立即失败
  if (!data || typeof data !== 'object') {
    results.success = false;
    results.message = `数据库验证失败：输入数据无效 (${typeof data})`;
    results.summary.total = 1;
    results.summary.invalid = 1;
    
    results.details.overall = {
      total: 1,
      valid: 0,
      invalid: 1,
      warnings: 0,
      invalidItems: [{
        model: 'Database Input',
        errors: [`输入数据无效或非对象 (${typeof data})`],
        originalIndex: -1
      }],
      warningItems: []
    };
    
    return results;
  }
  
  // 定义要验证的集合
  const collections = {
    // 齿轮箱集合（使用validateGearbox）
    'hcGearboxes': { validator: validateGearbox },
    'gwGearboxes': { validator: validateGearbox },
    'hcmGearboxes': { validator: validateGearbox },
    'dtGearboxes': { validator: validateGearbox },
    'hcqGearboxes': { validator: validateGearbox },
    'gcGearboxes': { validator: validateGearbox },
    'hcxGearboxes': { validator: validateGearbox },
    'hcaGearboxes': { validator: validateGearbox },
    'hcvGearboxes': { validator: validateGearbox },
    'mvGearboxes': { validator: validateGearbox },
    'otherGearboxes': { validator: validateGearbox },
    
    // 配件集合
    'flexibleCouplings': { validator: validateCoupling },
    'standbyPumps': { validator: validatePump }
  };
  
  // 验证每个集合
  Object.keys(collections).forEach(colKey => {
    results.details[colKey] = {
      total: 0,
      valid: 0,
      invalid: 0,
      warnings: 0,
      invalidItems: [],
      warningItems: []
    };
    
    // 检查集合是否存在且是数组
    if (data[colKey] && Array.isArray(data[colKey])) {
      data[colKey].forEach((item, index) => {
        results.details[colKey].total++;
        
        // 使用适当的验证器
        const validator = collections[colKey].validator;
        const result = validator(item, index);
        
        // 统计无效项
        if (!result.valid) {
          results.details[colKey].invalid++;
          results.summary.invalid++;
          results.details[colKey].invalidItems.push({
            model: result.model,
            errors: result.errors,
            originalIndex: result.originalIndex
          });
        } else {
          results.details[colKey].valid++;
        }
        
        // 统计警告项
        if (result.warnings && result.warnings.length > 0) {
          results.details[colKey].warnings += result.warnings.length;
          results.summary.warnings += result.warnings.length;
          results.details[colKey].warningItems.push({
            model: result.model,
            warnings: result.warnings,
            originalIndex: result.originalIndex
          });
        }
      });
      
      results.summary.total += data[colKey].length;
    } else if (data.hasOwnProperty(colKey) && !Array.isArray(data[colKey])) {
      // 集合存在但不是数组
      results.details[colKey].total = 1;
      results.details[colKey].invalid = 1;
      results.summary.total++;
      results.summary.invalid++;
      
      results.details[colKey].invalidItems.push({
        model: `Collection: ${colKey}`,
        errors: [`集合 '${colKey}' 应为数组，但发现 ${typeof data[colKey]}`],
        originalIndex: -1
      });
    } else {
      // 集合完全缺失
      results.details[colKey] = {
        total: 0,
        valid: 0,
        invalid: 1,
        warnings: 0,
        invalidItems: [{
          model: `Collection: ${colKey}`,
          errors: [`必需的集合 '${colKey}' 不存在`],
          originalIndex: -1
        }],
        warningItems: []
      };
      
      results.summary.invalid++;
      results.summary.total++;
    }
  });
  
  // 计算有效项数量和最终结果
  results.summary.valid = results.summary.total - results.summary.invalid;
  results.summary.valid = Math.max(0, results.summary.valid);
  
  // 更新最终消息
  if (results.summary.invalid > 0) {
    results.success = false;
    results.message = `数据库验证失败：发现 ${results.summary.invalid} 个无效项目和 ${results.summary.warnings} 个警告`;
  } else if (results.summary.total === 0) {
    results.success = false;
    results.message = '数据库验证失败：数据库为空，未加载任何数据';
    
    if (results.summary.invalid === 0) {
      results.details.overall = {
        total: 1,
        valid: 0,
        invalid: 1,
        warnings: 0,
        invalidItems: [{
          model: 'Database',
          errors: ['数据库中没有找到任何产品数据。请检查数据源和导入过程。'],
          originalIndex: -1
        }],
        warningItems: []
      };
      
      results.summary.invalid = 1;
      results.summary.total = 1;
      results.summary.valid = 0;
    }
  } else if (results.summary.warnings > 0) {
    results.success = true;
    results.message = `数据库验证完成：发现 ${results.summary.warnings} 个警告`;
  } else {
    results.success = true;
    results.message = '数据库验证成功，未发现任何问题';
  }
  
  return results;
};
