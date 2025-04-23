// src/utils/dataValidator.js
/**
 * 数据验证工具
 * 用于验证数据库中的数据是否有效
 */

import { safeParseFloat } from './dataHelpers'; // 确保 dataHelpers.js 中的 safeParseFloat 可用
import { couplingSpecificationsMap } from '../data/gearboxMatchingMaps'; // 导入联轴器规格映射表
import { getStandardDiscountRate } from './priceManager'; // 导入获取标准折扣率函数
import { DEFAULTS } from '../config'; // Import DEFAULTS for checking against default values

/**
 * 验证单个齿轮箱数据项
 * @param {Object} item 齿轮箱对象
 * @param {number} index 在集合中的原始索引
 * @returns {Object} 验证结果 { valid: boolean, errors: string[], warnings: string[], model: string, originalIndex: number }
 */
export const validateGearbox = (item, index) => {
  const errors = [];
  const warnings = [];
  const originalIndex = index;

  if (!item || typeof item !== 'object') {
    return { valid: false, warnings: [], errors: ['无效的项目格式'], originalIndex };
  }

  // 检查必需字段和基本类型
  const model = item.model?.trim();
  if (typeof model !== 'string' || !model) {
    errors.push('型号 (model) 缺失或无效');
  }

  // 检查速度范围
  const speedRange = item.inputSpeedRange;
  // 修正: 检查数组长度和元素是否为有效数字且 >= 0
  if (!Array.isArray(speedRange) || speedRange.length !== 2 || !speedRange.every(v => safeParseFloat(v) !== undefined && safeParseFloat(v) >= 0 && !isNaN(safeParseFloat(v)))) {
      errors.push(`输入转速范围 (inputSpeedRange:${JSON.stringify(item.inputSpeedRange)}) 格式无效、缺失或包含负数`);
  } else if (safeParseFloat(speedRange[0]) > safeParseFloat(speedRange[1])) {
      warnings.push(`输入转速范围上限(${safeParseFloat(speedRange[1])})不应小于下限(${safeParseFloat(speedRange[0])})`);
  }


  // 检查减速比数组
  const ratios = item.ratios;
  // 修正: 检查是否为数组，非空，且所有元素都是有效数字 > 0
  if (!Array.isArray(ratios) || ratios.length === 0 || !ratios.every(v => safeParseFloat(v) !== undefined && safeParseFloat(v) > 0 && !isNaN(safeParseFloat(v)))) {
    errors.push(`减速比 (ratios:${JSON.stringify(item.ratios)}) 缺失、为空或包含无效/非正向值`);
  } else if (ratios.some(v => typeof v === 'string' && !/^\d+(\.\d+)?$/.test(v.trim()))) { // Check for obvious non-numeric strings
       warnings.push(`减速比数组包含看起来不像数字的字符串值`);
  }


  // 检查传递能力数组
  const capacityArray = item.transferCapacity;
   // 修正: 检查是否为数组，非空，且所有元素都是有效数字 > 0
  if (!Array.isArray(capacityArray) || capacityArray.length === 0 || !capacityArray.every(v => safeParseFloat(v) !== undefined && safeParseFloat(v) > 0 && !isNaN(safeParseFloat(v)))) {
     errors.push(`传递能力 (transferCapacity:${JSON.stringify(item.transferCapacity)}) 缺失、为空或包含无效/非正向值`);
  } else if (Array.isArray(ratios) && Array.isArray(capacityArray) && ratios.length !== capacityArray.length) {
      errors.push(`减速比数量(${Array.isArray(ratios) ? ratios.length : 'N/A'})与传递能力数量(${capacityArray.length})不匹配`);
  } else if (capacityArray.some(v => typeof v === 'string' && !/^\d+(\.\d+)?$/.test(v.trim()))) { // Check for obvious non-numeric strings
       warnings.push(`传递能力数组包含看起来不像数字的字符串值`);
  }


  // 检查推力
   const thrust = safeParseFloat(item.thrust);
   if (thrust === undefined || isNaN(thrust) || thrust < 0) {
        // 修正: 如果被 fixer 设置为默认值 0，则只报警告（除非型号是默认型号）
        if (thrust === 0 && model !== DEFAULTS.gearbox.model) {
             warnings.push(`推力 (thrust) 为 0，如果需要推力选型请检查`);
        } else {
           errors.push(`推力 (thrust:${item.thrust}) 缺失、无效或为负数`);
        }
   }


  // 检查中心距
   const centerDistance = safeParseFloat(item.centerDistance);
    if (centerDistance === undefined || isNaN(centerDistance) || centerDistance < 0) {
         // 修正: 如果被 fixer 设置为默认值 0，则只报警告（除非型号是默认型号）
        if (centerDistance === 0 && model !== DEFAULTS.gearbox.model) {
            warnings.push(`中心距 (centerDistance) 为 0`);
        } else {
           errors.push(`中心距 (centerDistance:${item.centerDistance}) 缺失、无效或为负数`);
        }
    }


  // 检查重量
   const weight = safeParseFloat(item.weight);
    if (weight === undefined || isNaN(weight) || weight <= 0) {
       // 修正: 如果被 fixer 设置为默认值 DEFAULTS.gearbox.weight，则只报警告（除非型号是默认型号）
       if (weight === DEFAULTS.gearbox.weight && model !== DEFAULTS.gearbox.model) {
            warnings.push(`重量 (weight) 为默认值 ${DEFAULTS.gearbox.weight}`);
       } else {
            errors.push(`重量 (weight:${item.weight}) 缺失、无效或非正向`);
       }
    }


  // 检查效率
   const efficiency = safeParseFloat(item.efficiency);
   if (efficiency === undefined || isNaN(efficiency) || efficiency <= 0 || efficiency > 1) {
       // 修正: 如果被 fixer 设置为默认值 DEFAULTS.gearbox.efficiency，则只报警告（除非型号是默认型号）
       if (efficiency === DEFAULTS.gearbox.efficiency && model !== DEFAULTS.gearbox.model) {
           warnings.push(`效率 (efficiency) 为默认值 ${DEFAULTS.gearbox.efficiency}`);
       } else {
           errors.push(`效率 (efficiency:${item.efficiency}) 缺失、无效或超出范围(0-1)`);
       }
   }


  // 检查价格字段 (processPriceData should ensure these are numbers >= 0 and calculated correctly)
  const priceFields = ['basePrice', 'price', 'factoryPrice', 'marketPrice', 'packagePrice'];
  priceFields.forEach(field => {
       const price = safeParseFloat(item[field]);
       if (price === undefined || isNaN(price) || price < 0) {
            errors.push(`价格字段 ${field} (${item[field]}) 缺失、无效或为负数`);
       } else if (price === 0 && model !== DEFAULTS.gearbox.model) { // Warn if 0 for non-default model
             warnings.push(`价格字段 ${field} 为 0`);
       }
  });

   // 检查折扣率 (processPriceData should ensure this is a number between 0 and 1)
   const discountRate = safeParseFloat(item.discountRate);
   if (discountRate === undefined || isNaN(discountRate) || discountRate < 0 || discountRate > 1) {
        // 修正: 如果被 fixer 设置为默认值 getStandardDiscountRate(model)，则只报警告（除非型号是默认型号）
       const standardDefaultRate = getStandardDiscountRate(model);
       if (discountRate !== undefined && Math.abs(discountRate - standardDefaultRate) < 1e-6 && model !== DEFAULTS.gearbox.model) {
            warnings.push(`折扣率 (discountRate) 为默认值 ${standardDefaultRate * 100}%`);
       } else {
           errors.push(`折扣率 (discountRate:${item.discountRate}) 缺失、无效或超出范围(0-1)`);
       }
   }

    // Cross-field price validation (handled by processPriceData fixing, just validate final state)
    // Check consistency between basePrice, discountRate, factoryPrice
     const basePrice = safeParseFloat(item.basePrice);
     const discountRateVal = safeParseFloat(item.discountRate);
     const factoryPrice = safeParseFloat(item.factoryPrice);
     // Only check consistency if key fields are valid and basePrice/factoryPrice are positive
     if (basePrice !== undefined && basePrice > 0 && discountRateVal !== undefined && discountRateVal >= 0 && discountRateVal <= 1 && factoryPrice !== undefined && factoryPrice > 0) {
        const expectedFactory = basePrice * (1 - discountRateVal);
         if (Math.abs(factoryPrice - expectedFactory) > 1) { // Allow 1 unit tolerance
             warnings.push(`工厂价 (${factoryPrice}) 与基础价 (${basePrice}) 和折扣率 (${(discountRateVal*100).toFixed(1)}%) 计算不一致`);
         }
     } else if (basePrice !== undefined && basePrice === 0 && factoryPrice !== undefined && factoryPrice > 0) {
         // If base price is 0 but factory is positive, this is inconsistent
         warnings.push(`基础价为 0 但工厂价 (${factoryPrice}) 大于 0`);
     }


    // Check consistency between factoryPrice and marketPrice
     const marketPrice = safeParseFloat(item.marketPrice);
      if (factoryPrice !== undefined && factoryPrice >= 0 && marketPrice !== undefined && marketPrice >= 0) {
          const expectedMarket = factoryPrice * 1.1;
           if (Math.abs(marketPrice - expectedMarket) > 1) {
              warnings.push(`市场价 (${marketPrice}) 与工厂价 (${factoryPrice}) 计算不一致 (期望 ${expectedMarket.toFixed(2)})`);
          }
      }

      // Check consistency between factoryPrice and packagePrice
      const packagePrice = safeParseFloat(item.packagePrice);
      if (factoryPrice !== undefined && factoryPrice >= 0 && packagePrice !== undefined && packagePrice >= 0) {
           // packagePrice should ideally be equal to factoryPrice after fixes, but might differ if overridden
           // Check only if they differ significantly and it's not the default item
          if (Math.abs(packagePrice - factoryPrice) > 1 && model !== DEFAULTS.gearbox.model) {
              warnings.push(`打包价 (${packagePrice}) 与工厂价 (${factoryPrice}) 不一致`);
          }
      }


  return {
    valid: errors.length === 0,
    errors,
    warnings,
    model: item.model,
    originalIndex // Include original index in validation result
  };
};


/**
 * 验证单个联轴器数据项
 * @param {Object} item 联轴器对象
 * @param {number} index 在集合中的原始索引
 * @returns {Object} 验证结果 { valid: boolean, errors: string[], warnings: string[], model: string, originalIndex: number }
 */
export const validateCoupling = (item, index) => {
  const errors = [];
  const warnings = [];
  const originalIndex = index;

  if (!item || typeof item !== 'object') {
    return { valid: false, warnings: [], errors: ['无效的项目格式'], originalIndex };
  }

  // 检查必需字段和基本类型
  const model = item.model?.trim();
  if (typeof model !== 'string' || !model) {
    errors.push('型号 (model) 缺失或无效');
  }

  // 检查扭矩 (应为 > 0 的数字)
  const torque = safeParseFloat(item.torque);
  if (torque === undefined || isNaN(torque) || torque <= 0) {
      // 修正: 如果被 fixer 设置为默认值 DEFAULTS.coupling.torque，则只报警告（除非型号是默认型号）
      if (torque === DEFAULTS.coupling.torque && model !== DEFAULTS.coupling.model) {
           warnings.push(`联轴器扭矩 (torque) 为默认值 ${DEFAULTS.coupling.torque}`);
      } else {
         errors.push(`联轴器扭矩 (torque:${item.torque}) 缺失、无效或非正向`);
      }
  }

  // 检查最大扭矩 (应为 > 0 的数字)
   const maxTorque = safeParseFloat(item.maxTorque);
   if (maxTorque === undefined || isNaN(maxTorque) || maxTorque <= 0) {
        // 修正: 如果被 fixer 设置为默认值 DEFAULTS.coupling.torque * 2.5，则只报警告（除非型号是默认型号）
       if (maxTorque !== undefined && Math.abs(maxTorque - DEFAULTS.coupling.torque * 2.5) < 1e-6 && model !== DEFAULTS.coupling.model) {
           warnings.push(`最大扭矩 (maxTorque) 为默认值 ${(DEFAULTS.coupling.torque * 2.5).toFixed(3)}`);
       } else {
           // Changed to error as maxTorque is important for safety factor
           errors.push(`最大扭矩 (maxTorque:${item.maxTorque}) 缺失、无效或非正向`);
       }
   } else if (torque !== undefined && torque > 0 && maxTorque < torque) {
        // Check consistency: maxTorque >= torque
        warnings.push(`最大扭矩(${maxTorque})应大于额定扭矩(${torque})`); // Keep as warning
   }


   // 检查最大转速 (应为 > 0 的数字)
   const maxSpeed = safeParseFloat(item.maxSpeed);
   if (maxSpeed === undefined || isNaN(maxSpeed) || maxSpeed <= 0) {
      // 修正: 如果被 fixer 设置为默认值 DEFAULTS.coupling.maxSpeed，则只报警告（除非型号是默认型号）
       if (maxSpeed === DEFAULTS.coupling.maxSpeed && model !== DEFAULTS.coupling.model) {
            warnings.push(`最大转速 (maxSpeed) 为默认值 ${DEFAULTS.coupling.maxSpeed}`);
       } else {
           errors.push(`最大转速 (maxSpeed:${item.maxSpeed}) 缺失、无效或非正向`);
       }
   }


  // 检查重量 (应为 > 0 的数字)
   const weight = safeParseFloat(item.weight);
   if (weight === undefined || isNaN(weight) || weight <= 0) {
       // 修正: 如果被 fixer 设置为默认值 DEFAULTS.coupling.weight，则只报警告（除非型号是默认型号）
       if (weight === DEFAULTS.coupling.weight && model !== DEFAULTS.coupling.model) {
           warnings.push(`重量 (weight) 为默认值 ${DEFAULTS.coupling.weight}`);
       } else {
            warnings.push(`重量 (weight:${item.weight}) 缺失、无效或非正向`);
       }
   }


   // 检查价格字段 (与 Gearbox 相同逻辑)
  const priceFields = ['basePrice', 'price', 'factoryPrice', 'marketPrice', 'packagePrice'];
  priceFields.forEach(field => {
       const price = safeParseFloat(item[field]);
       if (price === undefined || isNaN(price) || price < 0) {
             errors.push(`价格字段 ${field} (${item[field]}) 缺失、无效或为负数`);
       } else if (price === 0 && model !== DEFAULTS.coupling.model) { // Warn if 0 for non-default model
             warnings.push(`价格字段 ${field} 为 0`);
       }
  });

   // 检查折扣率 (与 Gearbox 相同逻辑)
   const discountRate = safeParseFloat(item.discountRate);
   if (discountRate === undefined || isNaN(discountRate) || discountRate < 0 || discountRate > 1) {
       // 修正: 如果被 fixer 设置为默认值 getStandardDiscountRate(model)，则只报警告（除非型号是默认型号）
       const standardDefaultRate = getStandardDiscountRate(model);
       if (discountRate !== undefined && Math.abs(discountRate - standardDefaultRate) < 1e-6 && model !== DEFAULTS.coupling.model) {
            warnings.push(`折扣率 (discountRate) 为默认值 ${standardDefaultRate * 100}%`);
       } else {
           errors.push(`折扣率 (discountRate:${item.discountRate}) 缺失、无效或超出范围(0-1)`);
       }
   }

    // Cross-field price validation (similar to gearbox)
    const basePrice = safeParseFloat(item.basePrice);
    const discountRateVal = safeParseFloat(item.discountRate);
    const factoryPrice = safeParseFloat(item.factoryPrice);
     // 只有当关键字段有效且 basePrice/factoryPrice >= 0 时才检查一致性
    if (basePrice !== undefined && basePrice >= 0 && discountRateVal !== undefined && discountRateVal >= 0 && discountRateVal <= 1 && factoryPrice !== undefined && factoryPrice >= 0) {
       const expectedFactory = basePrice * (1 - discountRateVal);
        // 如果 basePrice 是 0，工厂价期望也是 0
       if ((basePrice === 0 && factoryPrice !== 0) || (basePrice > 0 && Math.abs(factoryPrice - expectedFactory) > 1)) { // Allow 1 unit tolerance for non-zero prices
            warnings.push(`工厂价 (${factoryPrice}) 与基础价 (${basePrice}) 和折扣率 (${(discountRateVal*100).toFixed(1)}%) 计算不一致`);
       }
    }

     const marketPrice = safeParseFloat(item.marketPrice);
      if (factoryPrice !== undefined && factoryPrice >= 0 && marketPrice !== undefined && marketPrice >= 0) {
          const expectedMarket = factoryPrice * 1.1;
           if (Math.abs(marketPrice - expectedMarket) > 1) {
              warnings.push(`市场价 (${marketPrice}) 与工厂价 (${factoryPrice}) 计算不一致 (期望 ${expectedMarket.toFixed(2)})`);
          }
      }

      const packagePrice = safeParseFloat(item.packagePrice);
      if (factoryPrice !== undefined && factoryPrice >= 0 && packagePrice !== undefined && packagePrice >= 0) {
           // packagePrice should ideally be equal to factoryPrice after fixes
          if (Math.abs(packagePrice - factoryPrice) > 1 && model !== DEFAULTS.coupling.model) {
              warnings.push(`打包价 (${packagePrice}) 与工厂价 (${factoryPrice}) 不一致`);
          }
      }


  return {
    valid: errors.length === 0,
    errors,
    warnings,
    model: item.model,
    originalIndex // Include original index in validation result
  };
};


/**
 * 验证单个备用泵数据项
 * @param {Object} item 备用泵对象
 * @param {number} index 在集合中的原始索引
 * @returns {Object} 验证结果 { valid: boolean, errors: string[], warnings: string[], model: string, originalIndex: number }
 */
export const validatePump = (item, index) => {
  const errors = [];
  const warnings = [];
  const originalIndex = index;

  if (!item || typeof item !== 'object') {
    return { valid: false, warnings: [], errors: ['无效的项目格式'], originalIndex };
  }

  // 检查必需字段和基本类型
  const model = item.model?.trim();
  if (typeof model !== 'string' || !model) {
    errors.push('型号 (model) 缺失或无效');
  }

  // 检查流量 (应为 > 0 的数字)
   const flow = safeParseFloat(item.flow);
   if (flow === undefined || isNaN(flow) || flow <= 0) {
       // 修正: 如果被 fixer 设置为默认值 DEFAULTS.sparePump.flow，则只报警告（除非型号是默认型号）
       if (flow === DEFAULTS.sparePump.flow && model !== DEFAULTS.pump.model) {
           warnings.push(`流量 (flow) 为默认值 ${DEFAULTS.sparePump.flow}`);
       } else {
            errors.push(`流量 (flow:${item.flow}) 缺失、无效或非正向`);
       }
   }

  // 检查压力 (应为 > 0 的数字)
   const pressure = safeParseFloat(item.pressure);
   if (pressure === undefined || isNaN(pressure) || pressure <= 0) {
       // 修正: 如果被 fixer 设置为默认值 DEFAULTS.sparePump.pressure，则只报警告（除非型号是默认型号）
       if (pressure === DEFAULTS.sparePump.pressure && model !== DEFAULTS.pump.model) {
           warnings.push(`压力 (pressure) 为默认值 ${DEFAULTS.sparePump.pressure}`);
       } else {
            errors.push(`压力 (pressure:${item.pressure}) 缺失、无效或非正向`);
       }
   }

  // 检查电机功率 (应为 > 0 的数字)
   const motorPower = safeParseFloat(item.motorPower);
   if (motorPower === undefined || isNaN(motorPower) || motorPower <= 0) {
       // 修正: 如果被 fixer 设置为默认值 DEFAULTS.sparePump.motorPower，则只报警告（除非型号是默认型号）
       if (motorPower === DEFAULTS.sparePump.motorPower && model !== DEFAULTS.pump.model) {
           warnings.push(`电机功率 (motorPower) 为默认值 ${DEFAULTS.sparePump.motorPower}`);
       } else {
            errors.push(`电机功率 (motorPower:${item.motorPower}) 缺失、无效或非正向`);
       }
   }

  // 检查重量 (应为 > 0 的数字)
   const weight = safeParseFloat(item.weight);
   if (weight === undefined || isNaN(weight) || weight <= 0) {
       // 修正: 如果被 fixer 设置为默认值 DEFAULTS.sparePump.weight，则只报警告（除非型号是默认型号）
       if (weight === DEFAULTS.sparePump.weight && model !== DEFAULTS.pump.model) {
           warnings.push(`重量 (weight) 为默认值 ${DEFAULTS.sparePump.weight}`);
       } else {
            warnings.push(`重量 (weight:${item.weight}) 缺失、无效或非正向`);
       }
   }


   // 检查价格字段 (与 Gearbox 相同逻辑)
  const priceFields = ['basePrice', 'price', 'factoryPrice', 'marketPrice', 'packagePrice'];
  priceFields.forEach(field => {
       const price = safeParseFloat(item[field]);
       if (price === undefined || isNaN(price) || price < 0) {
             errors.push(`价格字段 ${field} (${item[field]}) 缺失、无效或为负数`);
       } else if (price === 0 && model !== DEFAULTS.pump.model) { // Warn if 0 for non-default model
             warnings.push(`价格字段 ${field} 为 0`);
       }
  });

   // 检查折扣率 (与 Gearbox 相同逻辑)
   const discountRate = safeParseFloat(item.discountRate);
   if (discountRate === undefined || isNaN(discountRate) || discountRate < 0 || discountRate > 1) {
       // 修正: 如果被 fixer 设置为默认值 getStandardDiscountRate(model)，则只报警告（除非型号是默认型号）
       const standardDefaultRate = getStandardDiscountRate(model);
       if (discountRate !== undefined && Math.abs(discountRate - standardDefaultRate) < 1e-6 && model !== DEFAULTS.pump.model) {
            warnings.push(`折扣率 (discountRate) 为默认值 ${standardDefaultRate * 100}%`);
       } else {
           errors.push(`折扣率 (discountRate:${item.discountRate}) 缺失、无效或超出范围(0-1)`);
       }
   }

    // Cross-field price validation (similar to gearbox)
    const basePrice = safeParseFloat(item.basePrice);
    const discountRateVal = safeParseFloat(item.discountRate);
    const factoryPrice = safeParseFloat(item.factoryPrice);
     // 只有当关键字段有效且 basePrice/factoryPrice >= 0 时才检查一致性
    if (basePrice !== undefined && basePrice >= 0 && discountRateVal !== undefined && discountRateVal >= 0 && discountRateVal <= 1 && factoryPrice !== undefined && factoryPrice >= 0) {
       const expectedFactory = basePrice * (1 - discountRateVal);
        // 如果 basePrice 是 0，工厂价期望也是 0
       if ((basePrice === 0 && factoryPrice !== 0) || (basePrice > 0 && Math.abs(factoryPrice - expectedFactory) > 1)) { // Allow 1 unit tolerance for non-zero prices
            warnings.push(`工厂价 (${factoryPrice}) 与基础价 (${basePrice}) 和折扣率 (${(discountRateVal*100).toFixed(1)}%) 计算不一致`);
       }
    }

     const marketPrice = safeParseFloat(item.marketPrice);
      if (factoryPrice !== undefined && factoryPrice >= 0 && marketPrice !== undefined && marketPrice >= 0) {
          const expectedMarket = factoryPrice * 1.1;
           if (Math.abs(marketPrice - expectedMarket) > 1) {
              warnings.push(`市场价 (${marketPrice}) 与工厂价 (${factoryPrice}) 计算不一致 (期望 ${expectedMarket.toFixed(2)})`);
          }
      }

      const packagePrice = safeParseFloat(item.packagePrice);
      if (factoryPrice !== undefined && factoryPrice >= 0 && packagePrice !== undefined && packagePrice >= 0) {
           // packagePrice should ideally be equal to factoryPrice after fixes
          if (Math.abs(packagePrice - factoryPrice) > 1 && model !== DEFAULTS.pump.model) {
              warnings.push(`打包价 (${packagePrice}) 与工厂价 (${factoryPrice}) 不一致`);
          }
      }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    model: item.model,
    originalIndex // Include original index in validation result
  };
};


/**
 * 验证整个数据库结构和数据项
 * @param {Object} data应用程序数据对象
 * @returns {Object} 验证结果 { success: boolean, message: string, details: object, summary: object }
 */
export const validateDatabase = (data) => {
  const results = {
    success: true,
    message: '数据库验证成功',
    details: {}, // Detailed results per collection
    summary: { total: 0, valid: 0, invalid: 0, warnings: 0 } // Overall summary
  };

  // Define expected collections
  const collectionsToValidate = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes', // Include all gearbox types
    'flexibleCouplings', 'standbyPumps'
  ];

  // 修正：在循环外部检查 data 是否有效
  if (!data || typeof data !== 'object') {
      results.summary.total = 1;
      results.summary.invalid = 1;
      results.success = false;
       results.message = `数据库验证失败：输入数据无效 (${typeof data})。`;
       results.details.overall = { total: 1, valid: 0, invalid: 1, warnings: 0, invalidItems: [{ model: 'Database Input', errors: [`Input data is null, undefined, or not an object (${typeof data}).`], originalIndex: -1 }], warningItems: [] };
       console.error("validateDatabase: Input data object is null, undefined, or not an object.", data);
       return results; // 直接返回，无需遍历
  }


  collectionsToValidate.forEach(colKey => {
      results.details[colKey] = { total: 0, valid: 0, invalid: 0, warnings: 0, invalidItems: [], warningItems: [] };

      // 修正：检查集合是否存在且是数组
      if (data.hasOwnProperty(colKey) && Array.isArray(data[colKey])) {
              data[colKey].forEach((item, index) => {
                  results.details[colKey].total++; // Count items within the array

                  let itemValidationResult = { valid: true, errors: [], warnings: [], model: item?.model || `Index ${index}`, originalIndex: index }; // Default result

                  if (colKey.endsWith('Gearboxes')) {
                      itemValidationResult = validateGearbox(item, index);
                  } else if (colKey === 'flexibleCouplings') {
                      itemValidationResult = validateCoupling(item, index);
                  } else if (colKey === 'standbyPumps') {
                      itemValidationResult = validatePump(item, index);
                  } else {
                       // If it's an array but not a known type, just check basic item format
                       if (!item || typeof item !== 'object' || (typeof item.model !== 'string' || !item.model.trim())) {
                           itemValidationResult.valid = false;
                           itemValidationResult.errors.push('项目格式无效或型号缺失');
                           itemValidationResult.model = item?.model || `Index ${index}`;
                       }
                  }

                  if (itemValidationResult.errors && itemValidationResult.errors.length > 0) {
                      results.details[colKey].invalid++;
                      results.summary.invalid++; // 累加无效项目总数
                      results.details[colKey].invalidItems.push({
                          model: itemValidationResult.model,
                          errors: itemValidationResult.errors,
                          originalIndex: itemValidationResult.originalIndex
                      });
                  } else {
                       // Only count as valid if no errors
                      results.details[colKey].valid++;
                  }


                  if (itemValidationResult.warnings && itemValidationResult.warnings.length > 0) {
                      results.details[colKey].warnings += itemValidationResult.warnings.length;
                      results.summary.warnings += itemValidationResult.warnings.length;
                       results.details[colKey].warningItems.push({
                          model: itemValidationResult.model,
                          warnings: itemValidationResult.warnings,
                          originalIndex: itemValidationResult.originalIndex
                       });
                  }
              });
              results.summary.total += data[colKey].length; // 累加集合中的项目数量到总数
          } else if (data.hasOwnProperty(colKey) && !Array.isArray(data[colKey])) {
              // 修正：Key exists but is not an array - structural issue
               results.details[colKey].total = 1; // Count this structural issue as 1 entity
               results.details[colKey].invalid = 1;
               results.summary.total++; // Count this structural issue in overall total
               results.summary.invalid++;
               results.details[colKey].invalidItems.push({
                   model: `Collection: ${colKey}`,
                   errors: [`Expected collection '${colKey}' to be an array, but found ${typeof data[colKey]}`],
                   originalIndex: -1 // Indicates a collection-level issue, not item
               });
          } else {
              // 修正：Collection is missing completely. Report as an invalid item related to the collection key.
              // ensureCollections should prevent this if data goes through repair, but validate defensively.
               results.details[colKey] = { total: 0, valid: 0, invalid: 1, warnings: 0, invalidItems: [], warningItems: [] };
               results.details[colKey].invalidItems.push({
                   model: `Collection: ${colKey}`,
                   errors: [`Required collection '${colKey}' is missing.`],
                   originalIndex: -1
               });
               results.summary.invalid++;
               results.summary.total++; // Count the "missing collection" as 1 invalid entity for summary
          }
  });

    // Recalculate summary.valid based on total and invalid counts
    results.summary.valid = results.summary.total - results.summary.invalid;
     // Ensure valid count is non-negative
     results.summary.valid = Math.max(0, results.summary.valid);


    // Final overall message update based on summary
    if (results.summary.invalid > 0) {
       results.success = false; // Ensure success is false if invalid items were found
       results.message = `数据库验证失败：发现 ${results.summary.invalid} 个无效项目和 ${results.summary.warnings} 个警告。`;
    } else if (results.summary.total === 0) { // Check for empty database *after* processing all collections
        results.success = false;
        results.message = `数据库验证失败：数据库为空，未加载任何数据。`;
        // Add a specific invalid item entry if the database is totally empty
        if (results.summary.invalid === 0) { // Avoid adding duplicate error if invalid count is already > 0
             results.details.overall = { total: 1, valid: 0, invalid: 1, warnings: 0, invalidItems: [{ model: 'Database', errors: ['数据库中没有找到任何产品数据。请检查数据源和导入过程。'], originalIndex: -1 }], warningItems: [] }; // Improved message
             results.summary.invalid = 1; // Reflect this critical error in summary
             results.summary.total = 1; // Count the database itself as the entity
             results.summary.valid = 0;
        }
    } else if (results.summary.warnings > 0) {
       results.success = true; // Validation passed on errors, but had warnings
       results.message = `数据库验证完成：发现 ${results.summary.warnings} 个警告。`;
    } else { // success is true, warnings is 0, total > 0
      results.success = true;
      results.message = '数据库验证成功，未发现任何问题。';
    }


  return results;
};

/**
 * 验证关键数据的有效性，是validateDatabase的简化版。
 * 此函数已不再需要，完整的 validateDatabase 会捕获关键错误并抛出。
 * 保留作为参考或删除。
 * @param {Object} data 应用程序数据对象
 * @returns {Object} 验证结果 { success: boolean, message: string, criticalErrors: string[] }
 */
export const validateCriticalData = (data) => {
    console.warn("validateCriticalData is deprecated. Use validateDatabase instead.");
    // You can call validateDatabase and check its summary.invalid
    const fullValidation = validateDatabase(data);

     // Extract critical errors based on full validation results
     const criticalErrors = [];
     Object.keys(fullValidation.details).forEach(key => {
         if (fullValidation.details[key].invalidItems.length > 0) {
             fullValidation.details[key].invalidItems.forEach(item => {
                 criticalErrors.push(`[${key}/${item.model}] ${item.errors.join('; ')}`);
             });
         }
     });

    return {
        // Critical success implies no invalid items AND total items > 0
        success: fullValidation.summary.invalid === 0 && fullValidation.summary.total > 0,
        message: fullValidation.summary.invalid === 0 && fullValidation.summary.total > 0
                 ? '关键数据验证通过'
                 : fullValidation.summary.total === 0
                   ? '关键数据验证失败：数据库为空。'
                   : `关键数据验证失败：发现 ${fullValidation.summary.invalid} 个无效项目。`,
        criticalErrors: criticalErrors.length > 0 ? criticalErrors : (fullValidation.summary.total === 0 ? ['数据库中没有找到任何产品数据。请检查数据源和导入过程。'] : [])
    };
};