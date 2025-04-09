// src/utils/dataCorrector.js
import { getDiscountRate, calculateFactoryPrice } from '../data/priceDiscount';
import { safeParseFloat, ensureRangeArray, ensureArrayOfNumbers } from './dataHelpers';

/**
 * 数据修正模块
 * 用于自动修复常见的数据问题并计算缺失的派生字段
 */

// 修正齿轮箱数据
export const correctGearbox = (gearbox) => {
  if (!gearbox) return { data: null, corrections: ['项目为空'], hadCorrections: false };
  
  const corrected = { ...gearbox };
  const corrections = [];
  
  // 修复model字段
  if (!corrected.model) {
    corrected.model = `Unknown_${Date.now()}`;
    corrections.push('添加了临时型号名称');
  } else if (typeof corrected.model !== 'string') {
    corrected.model = String(corrected.model);
    corrections.push('将型号转换为字符串');
  }
  
  // 修复ratios字段
  if (!Array.isArray(corrected.ratios) || corrected.ratios.length === 0) {
    // 如果有单一ratio字段，使用它
    if (corrected.ratio && typeof corrected.ratio === 'number' && !isNaN(corrected.ratio)) {
      corrected.ratios = [corrected.ratio];
      corrections.push('将单一ratio值转换为ratios数组');
    } else {
      corrected.ratios = [];
      corrections.push('创建了空的ratios数组');
    }
  }
  
  // 修复inputSpeedRange字段
  if (!Array.isArray(corrected.inputSpeedRange) || corrected.inputSpeedRange.length !== 2) {
    corrected.inputSpeedRange = ensureRangeArray(corrected.inputSpeedRange, [1000, 2500]);
    corrections.push('修正了输入转速范围');
  }
  
  // 修复transferCapacity字段
  if (!Array.isArray(corrected.transferCapacity) && typeof corrected.transferCapacity !== 'number') {
    corrected.transferCapacity = 0;
    corrections.push('设置了默认传递能力为0');
  } else if (typeof corrected.transferCapacity === 'number') {
    // 如果是单一值，转换为数组
    corrected.transferCapacity = [corrected.transferCapacity];
    corrections.push('将单一传递能力值转换为数组');
  } else if (Array.isArray(corrected.transferCapacity) && corrected.transferCapacity.length === 0) {
    // 如果是空数组，添加默认值
    corrected.transferCapacity = [0];
    corrections.push('添加了默认传递能力值');
  }
  
  // 修复thrust字段
  if (typeof corrected.thrust !== 'number' || isNaN(corrected.thrust)) {
    corrected.thrust = 0;
    corrections.push('设置了默认推力为0');
  }
  
  // 修复weight字段
  if (typeof corrected.weight !== 'number' || isNaN(corrected.weight)) {
    corrected.weight = 0;
    corrections.push('设置了默认重量为0');
  }
  
  // 修复价格相关字段
  if (!corrected.basePrice && corrected.price) {
    corrected.basePrice = corrected.price;
    corrections.push('使用price作为basePrice');
  } else if (!corrected.basePrice) {
    corrected.basePrice = 0;
    corrections.push('设置了默认basePrice为0');
  }
  
  if (!corrected.price) {
    corrected.price = corrected.basePrice;
    corrections.push('使用basePrice作为price');
  }
  
  // 确保折扣率存在
  if (typeof corrected.discountRate !== 'number' || isNaN(corrected.discountRate)) {
    corrected.discountRate = getDiscountRate(corrected.model);
    corrections.push(`基于模型设置了折扣率: ${corrected.discountRate}`);
  }
  
  // 计算工厂价格（如果缺失）
  if (!corrected.factoryPrice || isNaN(corrected.factoryPrice)) {
    corrected.factoryPrice = calculateFactoryPrice(corrected);
    corrections.push(`计算了工厂价格: ${corrected.factoryPrice}`);
  }
  
  // 处理其他可能缺失的字段
  if (!corrected.dimensions) {
    corrected.dimensions = '-';
    corrections.push('添加了默认尺寸占位符');
  }
  
  if (!corrected.controlType) {
    corrected.controlType = '推拉软轴';
    corrections.push('设置了默认控制类型');
  }
  
  // 返回修正后的数据和修正记录
  return {
    data: corrected,
    corrections,
    hadCorrections: corrections.length > 0
  };
};

// 修正联轴器数据
export const correctCoupling = (coupling) => {
  if (!coupling) return { data: null, corrections: ['联轴器为空'], hadCorrections: false };
  
  const corrected = { ...coupling };
  const corrections = [];
  
  // 修复model字段
  if (!corrected.model) {
    corrected.model = `Unknown_Coupling_${Date.now()}`;
    corrections.push('添加了临时联轴器型号名称');
  } else if (typeof corrected.model !== 'string') {
    corrected.model = String(corrected.model);
    corrections.push('将联轴器型号转换为字符串');
  }
  
  // 修复torque字段
  if (typeof corrected.torque !== 'number' || isNaN(corrected.torque)) {
    corrected.torque = 0;
    corrections.push('设置了默认扭矩为0');
  }
  
  // 修复maxSpeed字段（如果存在）
  if (corrected.maxSpeed !== undefined && (typeof corrected.maxSpeed !== 'number' || isNaN(corrected.maxSpeed))) {
    corrected.maxSpeed = 0;
    corrections.push('设置了默认最大转速为0');
  }
  
  // 修复weight字段
  if (typeof corrected.weight !== 'number' || isNaN(corrected.weight)) {
    corrected.weight = 0;
    corrections.push('设置了默认重量为0');
  }
  
  // 修复价格相关字段
  if (!corrected.basePrice && corrected.price) {
    corrected.basePrice = corrected.price;
    corrections.push('使用price作为basePrice');
  } else if (!corrected.basePrice) {
    corrected.basePrice = 0;
    corrections.push('设置了默认basePrice为0');
  }
  
  if (!corrected.price) {
    corrected.price = corrected.basePrice;
    corrections.push('使用basePrice作为price');
  }
  
  // 确保折扣率存在
  if (typeof corrected.discountRate !== 'number' || isNaN(corrected.discountRate)) {
    corrected.discountRate = getDiscountRate(corrected.model);
    corrections.push(`基于模型设置了折扣率: ${corrected.discountRate}`);
  }
  
  // 计算工厂价格（如果缺失）
  if (!corrected.factoryPrice || isNaN(corrected.factoryPrice)) {
    corrected.factoryPrice = calculateFactoryPrice(corrected);
    corrections.push(`计算了工厂价格: ${corrected.factoryPrice}`);
  }
  
  // 返回修正后的数据和修正记录
  return {
    data: corrected,
    corrections,
    hadCorrections: corrections.length > 0
  };
};

// 修正泵数据
export const correctPump = (pump) => {
  if (!pump) return { data: null, corrections: ['泵为空'], hadCorrections: false };
  
  const corrected = { ...pump };
  const corrections = [];
  
  // 修复model字段
  if (!corrected.model) {
    corrected.model = `Unknown_Pump_${Date.now()}`;
    corrections.push('添加了临时泵型号名称');
  } else if (typeof corrected.model !== 'string') {
    corrected.model = String(corrected.model);
    corrections.push('将泵型号转换为字符串');
  }
  
  // 修复flow字段
  if (typeof corrected.flow !== 'number' || isNaN(corrected.flow)) {
    corrected.flow = 0;
    corrections.push('设置了默认流量为0');
  }
  
  // 修复pressure字段
  if (typeof corrected.pressure !== 'number' || isNaN(corrected.pressure)) {
    corrected.pressure = 0;
    corrections.push('设置了默认压力为0');
  }
  
  // 修复motorPower字段（如果存在）
  if (corrected.motorPower !== undefined && (typeof corrected.motorPower !== 'number' || isNaN(corrected.motorPower))) {
    corrected.motorPower = 0;
    corrections.push('设置了默认电机功率为0');
  }
  
  // 修复weight字段（如果存在）
  if (corrected.weight !== undefined && (typeof corrected.weight !== 'number' || isNaN(corrected.weight))) {
    corrected.weight = 0;
    corrections.push('设置了默认重量为0');
  }
  
  // 修复价格相关字段
  if (!corrected.basePrice && corrected.price) {
    corrected.basePrice = corrected.price;
    corrections.push('使用price作为basePrice');
  } else if (!corrected.basePrice) {
    corrected.basePrice = 0;
    corrections.push('设置了默认basePrice为0');
  }
  
  if (!corrected.price) {
    corrected.price = corrected.basePrice;
    corrections.push('使用basePrice作为price');
  }
  
  // 确保折扣率存在
  if (typeof corrected.discountRate !== 'number' || isNaN(corrected.discountRate)) {
    corrected.discountRate = getDiscountRate(corrected.model);
    corrections.push(`基于模型设置了折扣率: ${corrected.discountRate}`);
  }
  
  // 计算工厂价格（如果缺失）
  if (!corrected.factoryPrice || isNaN(corrected.factoryPrice)) {
    corrected.factoryPrice = calculateFactoryPrice(corrected);
    corrections.push(`计算了工厂价格: ${corrected.factoryPrice}`);
  }
  
  // 返回修正后的数据和修正记录
  return {
    data: corrected,
    corrections,
    hadCorrections: corrections.length > 0
  };
};

// 批量修正数据库
export const correctDatabase = (data) => {
  if (!data) {
    return {
      data: {},
      results: {
        corrected: 0,
        unchanged: 0,
        details: []
      }
    };
  }
  
  // 创建数据副本
  const correctedData = { ...data };
  
  // 汇总结果
  const results = {
    corrected: 0,
    unchanged: 0,
    details: []
  };
  
  // 处理齿轮箱集合
  const gearboxTypes = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes'];
  gearboxTypes.forEach(type => {
    if (Array.isArray(correctedData[type])) {
      correctedData[type] = correctedData[type].map(item => {
        const correction = correctGearbox(item);
        
        if (correction.hadCorrections) {
          results.corrected++;
          results.details.push({
            type,
            model: correction.data.model,
            corrections: correction.corrections
          });
        } else {
          results.unchanged++;
        }
        
        return correction.data;
      });
    }
  });
  
  // 处理联轴器数据
  if (Array.isArray(correctedData.flexibleCouplings)) {
    correctedData.flexibleCouplings = correctedData.flexibleCouplings.map(item => {
      const correction = correctCoupling(item);
      
      if (correction.hadCorrections) {
        results.corrected++;
        results.details.push({
          type: 'flexibleCouplings',
          model: correction.data.model,
          corrections: correction.corrections
        });
      } else {
        results.unchanged++;
      }
      
      return correction.data;
    });
  }
  
  // 处理泵数据
  if (Array.isArray(correctedData.standbyPumps)) {
    correctedData.standbyPumps = correctedData.standbyPumps.map(item => {
      const correction = correctPump(item);
      
      if (correction.hadCorrections) {
        results.corrected++;
        results.details.push({
          type: 'standbyPumps',
          model: correction.data.model,
          corrections: correction.corrections
        });
      } else {
        results.unchanged++;
      }
      
      return correction.data;
    });
  }
  
  return {
    data: correctedData,
    results
  };
};