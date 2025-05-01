// src/utils/dataValidator.js 增强版

import { safeParseFloat } from './dataHelpers';

/**
 * 验证齿轮箱数据
 * @param {Object} gearbox - 齿轮箱对象
 * @returns {Object} 验证结果 { valid, errors, warnings }
 */
export const validateGearbox = (gearbox) => {
  const errors = [];
  const warnings = [];
  
  // 必需字段检查
  if (!gearbox) {
    errors.push('齿轮箱对象为空');
    return { valid: false, errors, warnings };
  }
  
  if (!gearbox.model) {
    errors.push('缺少型号(model)字段');
  }
  
  // 验证输入转速范围
  if (!Array.isArray(gearbox.inputSpeedRange) || gearbox.inputSpeedRange.length !== 2) {
    warnings.push('输入转速范围(inputSpeedRange)字段格式不正确，应为两元素数组 [min, max]');
  } else {
    const [minSpeed, maxSpeed] = gearbox.inputSpeedRange;
    if (typeof minSpeed !== 'number' || typeof maxSpeed !== 'number' || minSpeed >= maxSpeed) {
      errors.push(`输入转速范围无效: [${minSpeed}, ${maxSpeed}]`);
    }
  }
  
  // 验证减速比
  if (!Array.isArray(gearbox.ratios) || gearbox.ratios.length === 0) {
    errors.push('缺少减速比(ratios)字段或格式不正确');
  } else {
    const invalidRatios = gearbox.ratios.filter(ratio => 
      typeof ratio !== 'number' || isNaN(ratio) || ratio <= 0
    );
    if (invalidRatios.length > 0) {
      errors.push(`包含${invalidRatios.length}个无效减速比值`);
    }
  }
  
  // 验证传递能力
  if (!Array.isArray(gearbox.transferCapacity)) {
    warnings.push('传递能力(transferCapacity)字段缺失或不是数组');
  } else if (Array.isArray(gearbox.ratios) && gearbox.transferCapacity.length !== gearbox.ratios.length) {
    errors.push(`传递能力数组长度(${gearbox.transferCapacity.length})与减速比数组长度(${gearbox.ratios.length})不匹配`);
  } else {
    const invalidCapacities = gearbox.transferCapacity.filter(cap => 
      typeof cap !== 'number' || isNaN(cap) || cap <= 0
    );
    if (invalidCapacities.length > 0) {
      errors.push(`包含${invalidCapacities.length}个无效传递能力值`);
    }
  }
  
  // 验证推力
  if (gearbox.thrust !== undefined) {
    const thrust = safeParseFloat(gearbox.thrust);
    if (thrust === undefined || thrust < 0) {
      warnings.push('推力(thrust)字段值无效或为负');
    }
  }
  
  // 验证重量
  if (gearbox.weight !== undefined) {
    const weight = safeParseFloat(gearbox.weight);
    if (weight === undefined || weight <= 0) {
      warnings.push('重量(weight)字段值无效或不为正数');
    }
  }
  
  // 验证价格字段
  if (gearbox.basePrice !== undefined) {
    const basePrice = safeParseFloat(gearbox.basePrice);
    if (basePrice === undefined || basePrice <= 0) {
      warnings.push('基础价格(basePrice)字段值无效或不为正数');
    }
  }
  
  // src/utils/dataValidator.js 增强版(续)

  if (gearbox.discountRate !== undefined) {
    const discountRate = safeParseFloat(gearbox.discountRate);
    if (discountRate === undefined || discountRate < 0 || discountRate > 1) {
      warnings.push('折扣率(discountRate)字段值无效或超出范围(0-1)');
    }
  }
  
  if (gearbox.factoryPrice !== undefined) {
    const factoryPrice = safeParseFloat(gearbox.factoryPrice);
    if (factoryPrice === undefined || factoryPrice <= 0) {
      warnings.push('工厂价(factoryPrice)字段值无效或不为正数');
    }
  }
  
  if (gearbox.marketPrice !== undefined) {
    const marketPrice = safeParseFloat(gearbox.marketPrice);
    if (marketPrice === undefined || marketPrice <= 0) {
      warnings.push('市场价(marketPrice)字段值无效或不为正数');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * 验证联轴器数据
 * @param {Object} coupling - 联轴器对象
 * @returns {Object} 验证结果 { valid, errors, warnings }
 */
export const validateCoupling = (coupling) => {
  const errors = [];
  const warnings = [];
  
  // 必需字段检查
  if (!coupling) {
    errors.push('联轴器对象为空');
    return { valid: false, errors, warnings };
  }
  
  if (!coupling.model) {
    errors.push('缺少型号(model)字段');
  }
  
  // 验证扭矩
  if (coupling.torque === undefined) {
    errors.push('缺少扭矩(torque)字段');
  } else {
    const torque = safeParseFloat(coupling.torque);
    if (torque === undefined || torque <= 0) {
      errors.push('扭矩(torque)字段值无效或不为正数');
    } else {
      // 检查扭矩单位是否一致
      if (!coupling.torqueUnit) {
        warnings.push('缺少扭矩单位(torqueUnit)字段，可能导致单位不一致问题');
      } else if (!['knm', 'kn·m', 'kn.m', 'kn m', 'nm', 'n·m', 'n.m', 'n m'].includes(coupling.torqueUnit.toLowerCase().trim())) {
        warnings.push(`未知的扭矩单位: ${coupling.torqueUnit}`);
      }
      
      // 检查扭矩值是否合理
      if (coupling.torqueUnit && coupling.torqueUnit.toLowerCase().includes('kn') && torque > 100) {
        warnings.push(`扭矩值(${torque} ${coupling.torqueUnit})异常大，请确认单位是否正确`);
      } else if (!coupling.torqueUnit && torque > 500) {
        warnings.push(`扭矩值(${torque})异常大，可能需要转换单位 (N·m -> kN·m)`);
      }
    }
  }
  
  // 验证最大转速
  if (coupling.maxSpeed === undefined) {
    warnings.push('缺少最大转速(maxSpeed)字段');
  } else {
    const maxSpeed = safeParseFloat(coupling.maxSpeed);
    if (maxSpeed === undefined || maxSpeed <= 0) {
      warnings.push('最大转速(maxSpeed)字段值无效或不为正数');
    } else if (maxSpeed > 10000) {
      warnings.push(`最大转速(${maxSpeed} r/min)异常高，请确认是否正确`);
    }
  }
  
  // 验证重量
  if (coupling.weight === undefined) {
    warnings.push('缺少重量(weight)字段');
  } else {
    const weight = safeParseFloat(coupling.weight);
    if (weight === undefined || weight <= 0) {
      warnings.push('重量(weight)字段值无效或不为正数');
    }
  }
  
  // 验证价格字段
  if (coupling.basePrice === undefined && coupling.price === undefined) {
    warnings.push('缺少基础价格(basePrice/price)字段');
  } else {
    const basePrice = safeParseFloat(coupling.basePrice || coupling.price);
    if (basePrice === undefined || basePrice <= 0) {
      warnings.push('基础价格(basePrice/price)字段值无效或不为正数');
    }
  }
  
  // 验证折扣率
  if (coupling.discountRate !== undefined) {
    const discountRate = safeParseFloat(coupling.discountRate);
    if (discountRate === undefined || discountRate < 0 || discountRate > 1) {
      warnings.push('折扣率(discountRate)字段值无效或超出范围(0-1)');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * 验证备用泵数据
 * @param {Object} pump - 备用泵对象
 * @returns {Object} 验证结果 { valid, errors, warnings }
 */
export const validatePump = (pump) => {
  const errors = [];
  const warnings = [];
  
  // 必需字段检查
  if (!pump) {
    errors.push('备用泵对象为空');
    return { valid: false, errors, warnings };
  }
  
  if (!pump.model) {
    errors.push('缺少型号(model)字段');
  }
  
  // 验证流量
  if (pump.flow === undefined) {
    warnings.push('缺少流量(flow)字段');
  } else {
    const flow = safeParseFloat(pump.flow);
    if (flow === undefined || flow <= 0) {
      warnings.push('流量(flow)字段值无效或不为正数');
    }
  }
  
  // 验证压力
  if (pump.pressure === undefined) {
    warnings.push('缺少压力(pressure)字段');
  } else {
    const pressure = safeParseFloat(pump.pressure);
    if (pressure === undefined || pressure <= 0) {
      warnings.push('压力(pressure)字段值无效或不为正数');
    }
  }
  
  // 验证电机功率
  if (pump.motorPower === undefined) {
    warnings.push('缺少电机功率(motorPower)字段');
  } else {
    const motorPower = safeParseFloat(pump.motorPower);
    if (motorPower === undefined || motorPower <= 0) {
      warnings.push('电机功率(motorPower)字段值无效或不为正数');
    }
  }
  
  // 验证重量
  if (pump.weight === undefined) {
    warnings.push('缺少重量(weight)字段');
  } else {
    const weight = safeParseFloat(pump.weight);
    if (weight === undefined || weight <= 0) {
      warnings.push('重量(weight)字段值无效或不为正数');
    }
  }
  
  // 验证价格字段
  if (pump.basePrice === undefined && pump.price === undefined) {
    warnings.push('缺少基础价格(basePrice/price)字段');
  } else {
    const basePrice = safeParseFloat(pump.basePrice || pump.price);
    if (basePrice === undefined || basePrice <= 0) {
      warnings.push('基础价格(basePrice/price)字段值无效或不为正数');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

/**
 * 验证整个数据库
 * @param {Object} data - 应用数据对象
 * @returns {Object} 验证结果 { success, message, details, summary }
 */
export const validateDatabase = (data) => {
  const results = {
    success: true,
    message: '数据库验证成功',
    details: {}, // 每个集合的详细结果
    summary: { total: 0, valid: 0, invalid: 0, warnings: 0 } // 总体摘要
  };

  // 如果数据无效，直接返回
  if (!data || typeof data !== 'object') {
    results.success = false;
    results.message = `数据库验证失败：输入数据无效 (${typeof data})。`;
    console.error("validateDatabase: 输入数据对象为null、undefined或不是对象。", data);
    return results;
  }

  // 定义需要验证的集合
  const collectionsToValidate = [
    { key: 'hcGearboxes', validator: validateGearbox, label: 'HC系列齿轮箱' },
    { key: 'gwGearboxes', validator: validateGearbox, label: 'GW系列齿轮箱' },
    { key: 'hcmGearboxes', validator: validateGearbox, label: 'HCM系列齿轮箱' },
    { key: 'dtGearboxes', validator: validateGearbox, label: 'DT系列齿轮箱' },
    { key: 'hcqGearboxes', validator: validateGearbox, label: 'HCQ系列齿轮箱' },
    { key: 'gcGearboxes', validator: validateGearbox, label: 'GC系列齿轮箱' },
    { key: 'hcxGearboxes', validator: validateGearbox, label: 'HCX系列齿轮箱' },
    { key: 'hcaGearboxes', validator: validateGearbox, label: 'HCA系列齿轮箱' },
    { key: 'hcvGearboxes', validator: validateGearbox, label: 'HCV系列齿轮箱' },
    { key: 'mvGearboxes', validator: validateGearbox, label: 'MV系列齿轮箱' },
    { key: 'otherGearboxes', validator: validateGearbox, label: '其他齿轮箱' },
    { key: 'flexibleCouplings', validator: validateCoupling, label: '高弹性联轴器' },
    { key: 'standbyPumps', validator: validatePump, label: '备用泵' }
  ];

  // 验证每个集合
  collectionsToValidate.forEach(({ key, validator, label }) => {
    results.details[key] = {
      name: label,
      total: 0,
      valid: 0,
      invalid: 0,
      warnings: 0,
      invalidItems: [],
      warningItems: []
    };

    // 检查集合是否存在且是数组
    if (data.hasOwnProperty(key) && Array.isArray(data[key])) {
      data[key].forEach((item, index) => {
        results.details[key].total++;
        results.summary.total++;
        
        // 使用对应的验证器验证项目
        const validationResult = validator(item);
        
        if (!validationResult.valid) {
          results.details[key].invalid++;
          results.summary.invalid++;
          results.details[key].invalidItems.push({
            model: item?.model || `#${index}`,
            errors: validationResult.errors,
            warnings: validationResult.warnings,
            originalIndex: index
          });
        } else {
          results.details[key].valid++;
          results.summary.valid++;
        }
        
        if (validationResult.warnings && validationResult.warnings.length > 0) {
          results.details[key].warnings += validationResult.warnings.length;
          results.summary.warnings += validationResult.warnings.length;
          
          if (validationResult.valid) {
            results.details[key].warningItems.push({
              model: item?.model || `#${index}`,
              warnings: validationResult.warnings,
              originalIndex: index
            });
          }
        }
      });
    } else if (data.hasOwnProperty(key) && !Array.isArray(data[key])) {
      // 集合存在但不是数组
      results.details[key].total = 1;
      results.details[key].invalid = 1;
      results.summary.total++;
      results.summary.invalid++;
      results.details[key].invalidItems.push({
        model: `Collection: ${key}`,
        errors: [`预期集合 '${key}' 应为数组，但发现 ${typeof data[key]}`],
        originalIndex: -1
      });
    } else {
      // 集合完全缺失
      results.details[key].total = 0;
      results.details[key].invalid = 1;
      results.summary.invalid++;
      results.summary.total++;
      results.details[key].invalidItems.push({
        model: `Collection: ${key}`,
        errors: [`所需集合 '${key}' 缺失。`],
        originalIndex: -1
      });
    }
  });

  // 更新最终结果信息
  if (results.summary.invalid > 0) {
    results.success = false;
    results.message = `数据库验证失败：发现 ${results.summary.invalid} 个无效项目和 ${results.summary.warnings} 个警告。`;
  } else if (results.summary.total === 0) {
    results.success = false;
    results.message = `数据库验证失败：数据库为空，未加载任何数据。`;
  } else if (results.summary.warnings > 0) {
    results.success = true;
    results.message = `数据库验证完成：发现 ${results.summary.warnings} 个警告。`;
  } else {
    results.success = true;
    results.message = '数据库验证成功，未发现任何问题。';
  }

  return results;
};

/**
 * 修正选型结果数据问题
 * 确保关键字段存在且格式正确
 * @param {Object} result - 选型结果对象
 * @returns {Object} 修正后的选型结果
 */
export const correctSelectionResult = (result) => {
  if (!result) return null;
  
  const corrected = { ...result };
  
  // 确保推荐列表是数组
  if (!Array.isArray(corrected.recommendations)) {
    corrected.recommendations = [];
  }
  
  // 修正每个推荐项的关键字段
  corrected.recommendations = corrected.recommendations.map(gearbox => {
    const fixed = { ...gearbox };
    
    // 确保selectedRatio字段存在
    if (fixed.selectedRatio === undefined) {
      if (fixed.ratio !== undefined) {
        fixed.selectedRatio = fixed.ratio;
      } else if (Array.isArray(fixed.ratios) && fixed.ratios.length > 0) {
        fixed.selectedRatio = fixed.ratios[0];
      }
    }
    
    // 确保selectedCapacity字段存在
    if (fixed.selectedCapacity === undefined) {
      if (Array.isArray(fixed.transferCapacity) && fixed.transferCapacity.length > 0) {
        fixed.selectedCapacity = fixed.transferCapacity[0];
      } else if (typeof fixed.transferCapacity === 'number') {
        fixed.selectedCapacity = fixed.transferCapacity;
      }
    }
    
    // 确保capacityMargin字段存在
    if (fixed.capacityMargin === undefined && fixed.selectedCapacity !== undefined && result.requiredTransferCapacity) {
      fixed.capacityMargin = ((fixed.selectedCapacity - result.requiredTransferCapacity) / result.requiredTransferCapacity) * 100;
    }
    
    // 确保ratioDiffPercent字段存在
    if (fixed.ratioDiffPercent === undefined && fixed.selectedRatio !== undefined && result.targetRatio) {
      fixed.ratioDiffPercent = (Math.abs(fixed.selectedRatio - result.targetRatio) / result.targetRatio) * 100;
    }
    
    return fixed;
  });
  
  return corrected;
};

// 导出模块
export default {
  validateGearbox,
  validateCoupling,
  validatePump,
  validateDatabase,
  correctSelectionResult
};