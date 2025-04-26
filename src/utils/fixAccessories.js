// src/utils/fixAccessories.js
// 用于在系统数据修复过程中修复联轴器和备用泵数据的工具

import { safeParseFloat } from './dataHelpers';

/**
 * 确保齿轮箱的数值字段正确
 * @param {Object} data 应用数据对象
 * @returns {Object} { data, patched, warnings }
 */
export const ensureGearboxNumericFields = (data) => {
  if (!data) return { data, patched: 0, warnings: [] };
  
  let patched = 0;
  const warnings = [];
  
  // 定义需要检查的齿轮箱集合
  const gearboxCollections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes'
  ];
  
  // 定义需要确保的数值字段和默认值
  const numericFields = {
    thrust: 0,         // 默认推力为0 kN
    weight: 500,       // 默认重量500 kg
    centerDistance: 200, // 默认中心距200 mm
    efficiency: 0.97   // 默认效率97%
  };
  
  // 处理每个集合
  gearboxCollections.forEach(collection => {
    if (Array.isArray(data[collection])) {
      data[collection] = data[collection].map(item => {
        if (!item || !item.model) return item;
        
        let needsPatching = false;
        const patchedItem = { ...item };
        
        // 检查并修复数值字段
        Object.entries(numericFields).forEach(([field, defaultValue]) => {
          const value = safeParseFloat(patchedItem[field]);
          if (value === undefined) {
            patchedItem[field] = defaultValue;
            needsPatching = true;
            warnings.push(`齿轮箱 ${item.model} 缺少${field}字段，已设置默认值 ${defaultValue}`);
          }
        });
        
        if (needsPatching) {
          patched++;
          return patchedItem;
        }
        
        return item;
      });
    }
  });
  
  return { data, patched, warnings };
};

/**
 * 修复联轴器数据
 * @param {Object} data 应用数据对象
 * @returns {Object} 修复结果 { data, warnings, errors }
 */
export const fixCouplings = (data) => {
  if (!data || !Array.isArray(data.flexibleCouplings)) {
    return { 
      data, 
      warnings: ["联轴器数据不存在或无效"],
      patched: 0 
    };
  }
  
  let patched = 0;
  const warnings = [];
  const errors = [];
  
  const fixedCouplings = data.flexibleCouplings.map(coupling => {
    if (!coupling || !coupling.model) {
      warnings.push("跳过无效联轴器项（无model字段）");
      return coupling;
    }
    
    let needsPatching = false;
    const fixedCoupling = { ...coupling };
    
    // 1. 修复扭矩单位字段 (torqueUnit) 缺失
    if (!fixedCoupling.torqueUnit) {
      fixedCoupling.torqueUnit = 'kN·m'; // 默认单位为kN·m
      needsPatching = true;
      warnings.push(`联轴器 ${coupling.model} 缺少扭矩单位(torqueUnit)字段，已设置为 kN·m`);
    }
    
    // 2. 修复扭矩值异常（单位不一致导致的）
    let torque = safeParseFloat(fixedCoupling.torque);
    if (torque !== undefined) {
      // 如果扭矩值异常大，可能是N·m单位，需要转换为kN·m
      if (torque > 100 && fixedCoupling.torqueUnit === 'kN·m') {
        const originalTorque = torque;
        torque = torque / 1000;
        fixedCoupling.torque = torque;
        needsPatching = true;
        warnings.push(`联轴器 ${coupling.model} 扭矩值(${originalTorque})较大，已从N·m转换为kN·m(${torque})`);
      }
      // 如果扭矩值异常小，但单位为N·m，需要确保单位正确
      else if (torque < 0.1 && fixedCoupling.torqueUnit === 'N·m') {
        fixedCoupling.torqueUnit = 'kN·m';
        needsPatching = true;
        warnings.push(`联轴器 ${coupling.model} 扭矩值(${torque})较小，但单位为N·m，已修正为kN·m`);
      }
    } else {
      // 如果扭矩值无效，尝试从型号推断
      const modelMatch = coupling.model.match(/\d+(\.\d+)?/);
      if (modelMatch) {
        const modelNumber = parseFloat(modelMatch[0]);
        if (!isNaN(modelNumber)) {
          // 对于HGT系列，通常型号数字部分表示扭矩值(kN·m)
          if (coupling.model.includes('HGT')) {
            fixedCoupling.torque = modelNumber;
            fixedCoupling.torqueUnit = 'kN·m';
            needsPatching = true;
            warnings.push(`联轴器 ${coupling.model} 扭矩值缺失，已从型号推断为 ${modelNumber} kN·m`);
          }
        }
      }
      
      // 如果无法推断，设置一个默认值
      if (fixedCoupling.torque === undefined) {
        fixedCoupling.torque = 10; // 默认扭矩值10 kN·m
        fixedCoupling.torqueUnit = 'kN·m';
        needsPatching = true;
        warnings.push(`联轴器 ${coupling.model} 扭矩值无法推断，已设置默认值 10 kN·m`);
      }
    }
    
    // 3. 确保maxTorque存在并合理
    let maxTorque = safeParseFloat(fixedCoupling.maxTorque);
    if (maxTorque === undefined) {
      // 最大扭矩通常是标称扭矩的2.5倍
      fixedCoupling.maxTorque = fixedCoupling.torque * 2.5;
      needsPatching = true;
      warnings.push(`联轴器 ${coupling.model} 缺少最大扭矩(maxTorque)字段，已设置为标称扭矩的2.5倍`);
    }
    
    // 4. 确保maxSpeed存在并合理
    let maxSpeed = safeParseFloat(fixedCoupling.maxSpeed);
    if (maxSpeed === undefined) {
      fixedCoupling.maxSpeed = 3000; // 默认最大转速3000 rpm
      needsPatching = true;
      warnings.push(`联轴器 ${coupling.model} 缺少最大转速(maxSpeed)字段，已设置默认值 3000 rpm`);
    }
    
    // 5. 确保weight存在并合理
    let weight = safeParseFloat(fixedCoupling.weight);
    if (weight === undefined) {
      // 根据扭矩估算重量（简单线性关系）
      fixedCoupling.weight = Math.max(50, Math.round(fixedCoupling.torque * 30));
      needsPatching = true;
      warnings.push(`联轴器 ${coupling.model} 缺少重量(weight)字段，已基于扭矩估算为 ${fixedCoupling.weight} kg`);
    }
    
    if (needsPatching) {
      patched++;
      return fixedCoupling;
    }
    
    return coupling;
  });
  
  // 更新数据
  const fixedData = {
    ...data,
    flexibleCouplings: fixedCouplings
  };
  
  return {
    data: fixedData,
    warnings,
    errors,
    patched
  };
};

/**
 * 修复备用泵数据
 * @param {Object} data 应用数据对象
 * @returns {Object} 修复结果 { data, warnings, errors, patched }
 */
export const fixPumps = (data) => {
  if (!data || !Array.isArray(data.standbyPumps)) {
    return { 
      data, 
      warnings: ["备用泵数据不存在或无效"],
      errors: [],
      patched: 0 
    };
  }
  
  let patched = 0;
  const warnings = [];
  const errors = [];
  
  const fixedPumps = data.standbyPumps.map(pump => {
    if (!pump || !pump.model) {
      warnings.push("跳过无效备用泵项（无model字段）");
      return pump;
    }
    
    let needsPatching = false;
    const fixedPump = { ...pump };
    
    // 1. 确保flow (流量) 字段存在并合理
    let flow = safeParseFloat(fixedPump.flow);
    if (flow === undefined) {
      fixedPump.flow = 20; // 默认流量20 L/min
      needsPatching = true;
      warnings.push(`备用泵 ${pump.model} 缺少流量(flow)字段，已设置默认值 20 L/min`);
    }
    
    // 2. 确保pressure (压力) 字段存在并合理
    let pressure = safeParseFloat(fixedPump.pressure);
    if (pressure === undefined) {
      fixedPump.pressure = 2.5; // 默认压力2.5 MPa
      needsPatching = true;
      warnings.push(`备用泵 ${pump.model} 缺少压力(pressure)字段，已设置默认值 2.5 MPa`);
    }
    
    // 3. 确保motorPower (电机功率) 字段存在并合理
    let motorPower = safeParseFloat(fixedPump.motorPower);
    if (motorPower === undefined) {
      // 根据流量和压力估算功率
      const estimatedPower = (flow / 20) * (pressure / 2.5) * 2.2;
      fixedPump.motorPower = Math.max(1.5, Math.min(15, Math.round(estimatedPower * 10) / 10));
      needsPatching = true;
      warnings.push(`备用泵 ${pump.model} 缺少电机功率(motorPower)字段，已估算为 ${fixedPump.motorPower} kW`);
    }
    
    // 4. 确保weight (重量) 字段存在并合理
    let weight = safeParseFloat(fixedPump.weight);
    if (weight === undefined) {
      // 根据电机功率估算重量
      fixedPump.weight = Math.max(20, Math.round(fixedPump.motorPower * 8));
      needsPatching = true;
      warnings.push(`备用泵 ${pump.model} 缺少重量(weight)字段，已基于电机功率估算为 ${fixedPump.weight} kg`);
    }
    
    if (needsPatching) {
      patched++;
      return fixedPump;
    }
    
    return pump;
  });
  
  // 更新数据
  const fixedData = {
    ...data,
    standbyPumps: fixedPumps
  };
  
  return {
    data: fixedData,
    warnings,
    errors,
    patched
  };
};

/**
 * 修复所有配件数据（联轴器和备用泵）
 * @param {Object} data 应用数据对象
 * @returns {Object} 修复结果 { data, warnings, errors, summary }
 */
export const fixAccessories = (data) => {
  if (!data) return { 
    data: {}, 
    warnings: ["输入数据无效"], 
    errors: ["输入数据无效"],
    summary: { totalPatched: 0 } 
  };
  
  // 修复联轴器
  const couplingResult = fixCouplings(data);
  
  // 基于修复后的数据继续修复备用泵
  const pumpResult = fixPumps(couplingResult.data);
  
  // 合并警告和错误
  const warnings = [...couplingResult.warnings, ...pumpResult.warnings];
  const errors = [...couplingResult.errors, ...pumpResult.errors];
  
  // 创建摘要
  const summary = {
    totalPatched: couplingResult.patched + pumpResult.patched,
    couplingPatched: couplingResult.patched,
    pumpPatched: pumpResult.patched
  };
  
  return {
    data: pumpResult.data, // 最终修复的数据
    warnings,
    errors,
    summary
  };
};

// 导出函数
export default fixAccessories;