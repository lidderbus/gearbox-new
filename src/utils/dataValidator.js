// src/utils/dataValidator.js

/**
 * 齿轮箱数据验证模块
 * 用于验证齿轮箱、联轴器和泵的数据格式和值的有效性
 */

// 验证齿轮箱数据
export const validateGearbox = (gearbox) => {
  const errors = [];
  const warnings = [];
  
  // 必填字段检查
  if (!gearbox.model) errors.push('缺少型号名称');
  
  // 减速比检查
  if (!Array.isArray(gearbox.ratios) || gearbox.ratios.length === 0) {
    errors.push('缺少或无效的减速比数组');
  } else if (gearbox.ratios.some(r => typeof r !== 'number' || isNaN(r) || r <= 0)) {
    errors.push('减速比必须是大于0的数字');
  }
  
  // 输入转速范围检查
  if (!Array.isArray(gearbox.inputSpeedRange)) {
    errors.push('输入转速范围必须是数组');
  } else if (gearbox.inputSpeedRange.length !== 2) {
    errors.push('输入转速范围必须包含两个值（最小和最大）');
  } else if (gearbox.inputSpeedRange[0] >= gearbox.inputSpeedRange[1]) {
    errors.push('输入转速范围的最小值必须小于最大值');
  }
  
  // 传递能力检查
  if (!gearbox.transferCapacity) {
    errors.push('缺少传递能力');
  } else if (Array.isArray(gearbox.transferCapacity)) {
    if (gearbox.transferCapacity.length === 0) {
      errors.push('传递能力数组不能为空');
    } else if (gearbox.transferCapacity.some(c => typeof c !== 'number' || isNaN(c) || c <= 0)) {
      errors.push('传递能力必须是大于0的数字');
    }
    
    // 检查传递能力数组与减速比数组长度是否匹配
    if (Array.isArray(gearbox.ratios) && gearbox.transferCapacity.length !== gearbox.ratios.length) {
      warnings.push(`传递能力数组长度(${gearbox.transferCapacity.length})与减速比数组长度(${gearbox.ratios.length})不匹配`);
    }
  } else if (typeof gearbox.transferCapacity !== 'number' || gearbox.transferCapacity <= 0) {
    errors.push('传递能力必须是大于0的数字');
  }
  
  // 推力检查
  if (typeof gearbox.thrust !== 'number' || isNaN(gearbox.thrust)) {
    errors.push('推力必须是数字');
  } else if (gearbox.thrust <= 0) {
    errors.push('推力必须大于0');
  }
  
  // 重量检查
  if (typeof gearbox.weight !== 'number' || isNaN(gearbox.weight)) {
    errors.push('重量必须是数字');
  } else if (gearbox.weight <= 0) {
    errors.push('重量必须大于0');
  }
  
  // 价格字段检查
  const priceFields = ['price', 'basePrice', 'factoryPrice', 'marketPrice', 'packagePrice'];
  priceFields.forEach(field => {
    if (gearbox[field] !== undefined) {
      if (typeof gearbox[field] !== 'number' || isNaN(gearbox[field])) {
        errors.push(`${field} 必须是数字`);
      } else if (gearbox[field] < 0) {
        errors.push(`${field} 不能为负数`);
      }
    }
  });
  
  // 检查价格关系
  if (typeof gearbox.price === 'number' && typeof gearbox.factoryPrice === 'number') {
    if (gearbox.price < gearbox.factoryPrice) {
      warnings.push('价格小于工厂价格，可能需要调整');
    }
  }
  
  if (typeof gearbox.factoryPrice === 'number' && typeof gearbox.marketPrice === 'number') {
    if (gearbox.marketPrice < gearbox.factoryPrice) {
      warnings.push('市场价格小于工厂价格，可能需要调整');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// 验证联轴器数据
export const validateCoupling = (coupling) => {
  const errors = [];
  const warnings = [];
  
  // 必填字段检查
  if (!coupling.model) errors.push('缺少型号名称');
  
  // 扭矩检查
  if (typeof coupling.torque !== 'number' || isNaN(coupling.torque)) {
    errors.push('扭矩必须是数字');
  } else if (coupling.torque <= 0) {
    errors.push('扭矩必须大于0');
  }
  
  // 最大转速检查
  if (coupling.maxSpeed !== undefined) {
    if (typeof coupling.maxSpeed !== 'number' || isNaN(coupling.maxSpeed)) {
      errors.push('最大转速必须是数字');
    } else if (coupling.maxSpeed <= 0) {
      errors.push('最大转速必须大于0');
    }
  }
  
  // 重量检查
  if (typeof coupling.weight !== 'number' || isNaN(coupling.weight)) {
    errors.push('重量必须是数字');
  } else if (coupling.weight <= 0) {
    errors.push('重量必须大于0');
  }
  
  // 价格字段检查
  const priceFields = ['price', 'basePrice', 'factoryPrice', 'marketPrice'];
  priceFields.forEach(field => {
    if (coupling[field] !== undefined) {
      if (typeof coupling[field] !== 'number' || isNaN(coupling[field])) {
        errors.push(`${field} 必须是数字`);
      } else if (coupling[field] < 0) {
        errors.push(`${field} 不能为负数`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// 验证泵数据
export const validatePump = (pump) => {
  const errors = [];
  const warnings = [];
  
  // 必填字段检查
  if (!pump.model) errors.push('缺少型号名称');
  
  // 流量检查
  if (typeof pump.flow !== 'number' || isNaN(pump.flow)) {
    errors.push('流量必须是数字');
  } else if (pump.flow <= 0) {
    errors.push('流量必须大于0');
  }
  
  // 压力检查
  if (typeof pump.pressure !== 'number' || isNaN(pump.pressure)) {
    errors.push('压力必须是数字');
  } else if (pump.pressure <= 0) {
    errors.push('压力必须大于0');
  }
  
  // 电机功率检查
  if (pump.motorPower !== undefined) {
    if (typeof pump.motorPower !== 'number' || isNaN(pump.motorPower)) {
      errors.push('电机功率必须是数字');
    } else if (pump.motorPower <= 0) {
      errors.push('电机功率必须大于0');
    }
  }
  
  // 重量检查
  if (pump.weight !== undefined) {
    if (typeof pump.weight !== 'number' || isNaN(pump.weight)) {
      errors.push('重量必须是数字');
    } else if (pump.weight <= 0) {
      errors.push('重量必须大于0');
    }
  }
  
  // 价格字段检查
  const priceFields = ['price', 'basePrice', 'factoryPrice', 'marketPrice'];
  priceFields.forEach(field => {
    if (pump[field] !== undefined) {
      if (typeof pump[field] !== 'number' || isNaN(pump[field])) {
        errors.push(`${field} 必须是数字`);
      } else if (pump[field] < 0) {
        errors.push(`${field} 不能为负数`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
};

// 批量验证数据库
export const validateDatabase = (data) => {
  if (!data) {
    return {
      success: false,
      message: '数据为空',
      summary: { total: 0, valid: 0, invalid: 0, warnings: 0 },
      details: {}
    };
  }
  
  // 汇总结果
  const results = {
    success: true,
    message: '',
    summary: { total: 0, valid: 0, invalid: 0, warnings: 0 },
    details: {}
  };
  
  // 处理每个集合
  Object.keys(data).forEach(key => {
    if (!Array.isArray(data[key])) return;
    
    const items = data[key];
    results.details[key] = {
      total: items.length,
      valid: 0,
      invalid: 0,
      warnings: 0,
      invalidItems: [],
      warningItems: []
    };
    
    results.summary.total += items.length;
    
    // 根据集合类型选择验证函数
    let validateFn;
    if (key.includes('Gearboxes')) {
      validateFn = validateGearbox;
    } else if (key === 'flexibleCouplings') {
      validateFn = validateCoupling;
    } else if (key === 'standbyPumps') {
      validateFn = validatePump;
    } else {
      return; // 跳过未知集合
    }
    
    // 验证每个项目
    items.forEach(item => {
      const validation = validateFn(item);
      
      if (validation.valid) {
        results.details[key].valid++;
        results.summary.valid++;
        
        if (validation.warnings.length > 0) {
          results.details[key].warnings++;
          results.summary.warnings++;
          results.details[key].warningItems.push({
            model: item.model || '未知型号',
            warnings: validation.warnings
          });
        }
      } else {
        results.details[key].invalid++;
        results.summary.invalid++;
        results.details[key].invalidItems.push({
          model: item.model || '未知型号',
          errors: validation.errors,
          warnings: validation.warnings
        });
        
        if (validation.warnings.length > 0) {
          results.details[key].warnings++;
          results.summary.warnings++;
        }
      }
    });
  });
  
  // 设置结果消息
  if (results.summary.invalid > 0) {
    results.success = false;
    results.message = `验证完成。发现${results.summary.invalid}个无效项目和${results.summary.warnings}个警告。`;
  } else if (results.summary.warnings > 0) {
    results.message = `验证成功。所有项目均有效，但有${results.summary.warnings}个警告需要注意。`;
  } else {
    results.message = `验证成功。所有${results.summary.total}个项目均有效。`;
  }
  
  return results;
};