// src/utils/accessoryFixer.js
/**
 * 配件数据修复工具
 * 提供更健壮的配件数据修复功能
 */

import { safeParseFloat } from './dataHelpers';
import { DEFAULTS } from '../config';

/**
 * 处理联轴器扭矩单位并确保扭矩值正确
 * @param {Object} coupling 联轴器对象
 * @returns {Object} 修正后的联轴器对象
 */
export const fixCouplingTorque = (coupling) => {
  if (!coupling) return coupling;
  
  const result = { ...coupling };
  
  // 处理扭矩 (转换为kN·m)
  let torque = safeParseFloat(result.torque);
  
  // 如果扭矩值异常小(如0.004而非4.0)，可能是单位问题
  if (torque !== undefined && torque < 0.1 && torque > 0) {
    // 查看型号中的数字提示
    const modelNum = extractTorqueFromModel(result.model);
    
    // 如果从型号提取的扭矩值比当前值大得多，可能需要单位转换
    if (modelNum && modelNum > 10 * torque) {
      console.log(`accessoryFixer: 联轴器 ${result.model} 扭矩可能存在单位问题，从 ${torque} 修正为 ${modelNum}`);
      torque = modelNum;
    } else if (torque < 0.1) {
      // 如果扭矩值太小，可能是N·m而非kN·m
      torque = torque * 1000;
      console.log(`accessoryFixer: 联轴器 ${result.model} 扭矩单位转换，从 N·m ${torque/1000} 转换为 kN·m ${torque}`);
    }
  } else if (torque !== undefined && torque > 1000) {
    // 如果扭矩值异常大，可能是N·m需要转换为kN·m
    torque = torque / 1000;
    console.log(`accessoryFixer: 联轴器 ${result.model} 扭矩单位转换，从 N·m ${torque*1000} 转换为 kN·m ${torque}`);
  } else if (torque === undefined || isNaN(torque) || torque <= 0) {
    // 尝试从型号提取扭矩值
    const modelNum = extractTorqueFromModel(result.model);
    if (modelNum > 0) {
      torque = modelNum;
      console.log(`accessoryFixer: 联轴器 ${result.model} 从型号提取扭矩值 ${torque}`);
    } else {
      // 使用默认值
      torque = DEFAULTS.coupling.torque;
      console.log(`accessoryFixer: 联轴器 ${result.model} 使用默认扭矩值 ${torque}`);
    }
  }
  
  // 确保最大扭矩存在且合理
  let maxTorque = safeParseFloat(result.maxTorque);
  if (maxTorque === undefined || isNaN(maxTorque) || maxTorque <= 0 || maxTorque < torque) {
    // 默认为扭矩的2.5倍
    maxTorque = torque * 2.5;
    console.log(`accessoryFixer: 联轴器 ${result.model} 最大扭矩设置为 ${maxTorque} (${torque} × 2.5)`);
  }
  
  // 确保最高转速存在且合理
  let maxSpeed = safeParseFloat(result.maxSpeed);
  if (maxSpeed === undefined || isNaN(maxSpeed) || maxSpeed <= 0) {
    maxSpeed = DEFAULTS.coupling.maxSpeed;
    console.log(`accessoryFixer: 联轴器 ${result.model} a使用默认最高转速 ${maxSpeed}`);
  }
  
  // 确保重量存在且合理
  let weight = safeParseFloat(result.weight);
  if (weight === undefined || isNaN(weight) || weight <= 0) {
    weight = DEFAULTS.coupling.weight;
    console.log(`accessoryFixer: 联轴器 ${result.model} 使用默认重量 ${weight}`);
  }
  
  // 更新联轴器对象
  result.torque = torque;
  result.maxTorque = maxTorque;
  result.maxSpeed = maxSpeed;
  result.weight = weight;
  
  return result;
};

/**
 * 从联轴器型号中提取扭矩值
 * @param {string} model 联轴器型号
 * @returns {number|null} 提取的扭矩值或null
 */
function extractTorqueFromModel(model) {
  if (!model) return null;
  
  // HGT系列模式: HGTXX20 或 HGTXXXX (其中XX是扭矩值)
  if (model.startsWith('HGT')) {
    // 处理HGT1020这样的型号
    if (/HGT(\d+)20/.test(model)) {
      const match = model.match(/HGT(\d+)20/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (!isNaN(num) && num > 0) {
          return num;
        }
      }
    }
    
    // 处理HGTHB10这样的型号 (B后面的数字是扭矩)
    if (/HGTH[A-Z](\d+(\.\d+)?)/.test(model)) {
      const match = model.match(/HGTH[A-Z](\d+(\.\d+)?)/);
      if (match && match[1]) {
        const num = parseFloat(match[1]);
        if (!isNaN(num) && num > 0) {
          return num;
        }
      }
    }
  }
  
  return null;
}

/**
 * 修复备用泵数据
 * @param {Object} pump 备用泵对象
 * @returns {Object} 修正后的备用泵对象
 */
export const fixPumpData = (pump) => {
  if (!pump) return pump;
  
  const result = { ...pump };
  
  // 确保流量存在且合理
  let flow = safeParseFloat(result.flow);
  if (flow === undefined || isNaN(flow) || flow <= 0) {
    flow = extractFlowFromModel(result.model) || DEFAULTS.sparePump.flow;
    console.log(`accessoryFixer: 备用泵 ${result.model} 使用${flow === DEFAULTS.sparePump.flow ? '默认' : '提取的'}流量 ${flow}`);
  }
  
  // 确保压力存在且合理
  let pressure = safeParseFloat(result.pressure);
  if (pressure === undefined || isNaN(pressure) || pressure <= 0) {
    pressure = extractPressureFromModel(result.model) || DEFAULTS.sparePump.pressure;
    console.log(`accessoryFixer: 备用泵 ${result.model} 使用${pressure === DEFAULTS.sparePump.pressure ? '默认' : '提取的'}压力 ${pressure}`);
  }
  
  // 确保电机功率存在且合理
  let motorPower = safeParseFloat(result.motorPower);
  if (motorPower === undefined || isNaN(motorPower) || motorPower <= 0) {
    // 估算电机功率 (基于流量和压力的经验公式)
    const estimatedPower = Math.max(1.1, (flow * pressure) / 35).toFixed(1);
    motorPower = safeParseFloat(estimatedPower) || DEFAULTS.sparePump.motorPower;
    console.log(`accessoryFixer: 备用泵 ${result.model} 估算电机功率 ${motorPower}`);
  }
  
  // 确保重量存在且合理
  let weight = safeParseFloat(result.weight);
  if (weight === undefined || isNaN(weight) || weight <= 0) {
    weight = DEFAULTS.sparePump.weight;
    console.log(`accessoryFixer: 备用泵 ${result.model} 使用默认重量 ${weight}`);
  }
  
  // 更新备用泵对象
  result.flow = flow;
  result.pressure = pressure;
  result.motorPower = motorPower;
  result.weight = weight;
  
  return result;
};

/**
 * 从备用泵型号中提取流量
 * @param {string} model 备用泵型号
 * @returns {number|null} 提取的流量值或null
 */
function extractFlowFromModel(model) {
  if (!model) return null;
  
  // 2CY系列格式: 2CYXX.X/X.X
  if (model.startsWith('2CY')) {
    const match = model.match(/2CY(\d+(\.\d+)?)\//);
    if (match && match[1]) {
      const flow = parseFloat(match[1]);
      if (!isNaN(flow) && flow > 0) {
        return flow;
      }
    }
  }
  
  // SPF20-40格式
  if (model.startsWith('SPF')) {
    const match = model.match(/SPF(\d+)-\d+/);
    if (match && match[1]) {
      const flow = parseInt(match[1], 10);
      if (!isNaN(flow) && flow > 0) {
        return flow;
      }
    }
  }
  
  return null;
}

/**
 * 从备用泵型号中提取压力
 * @param {string} model 备用泵型号
 * @returns {number|null} 提取的压力值或null
 */
function extractPressureFromModel(model) {
  if (!model) return null;
  
  // 2CY系列格式: 2CYXX.X/X.X
  if (model.startsWith('2CY')) {
    const match = model.match(/\/(\d+(\.\d+)?)[D]?$/);
    if (match && match[1]) {
      const pressure = parseFloat(match[1]);
      if (!isNaN(pressure) && pressure > 0) {
        return pressure;
      }
    }
  }
  
  // SPF20-40格式: 后面的数字是压力
  if (model.startsWith('SPF')) {
    const match = model.match(/SPF\d+-(\d+)/);
    if (match && match[1]) {
      const pressure = parseInt(match[1], 10) / 10; // 通常是以"0.1MPa"为单位标记
      if (!isNaN(pressure) && pressure > 0) {
        return pressure;
      }
    }
  }
  
  return null;
}

/**
 * 确保齿轮箱数值字段的有效性
 * @param {Object} data 数据对象
 * @returns {Object} 处理结果 { data, patched, warnings }
 */
export const ensureGearboxNumericFields = (data) => {
  if (!data) return { data: {}, patched: 0, warnings: [] };
  
  const result = { ...data };
  const warnings = [];
  let patched = 0;
  
  // 定义齿轮箱集合
  const gearboxCollections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes'
  ];
  
  // 处理每个集合
  gearboxCollections.forEach(colKey => {
    if (Array.isArray(result[colKey])) {
      result[colKey] = result[colKey].map(item => {
        if (!item || typeof item !== 'object') return item;
        
        // 记录是否修改了数据
        let isPatched = false;
        
        // 确保效率有效 (0-1)
        let efficiency = safeParseFloat(item.efficiency);
        if (efficiency === undefined || isNaN(efficiency) || efficiency <= 0 || efficiency > 1) {
          item.efficiency = DEFAULTS.gearbox.efficiency;
          isPatched = true;
        }
        
        // 确保推力有效
        let thrust = safeParseFloat(item.thrust);
        if (thrust === undefined || isNaN(thrust) || thrust < 0) {
          item.thrust = DEFAULTS.gearbox.thrust;
          warnings.push(`${colKey}/${item.model || '未知'}: 推力设置为默认值 ${DEFAULTS.gearbox.thrust}`);
          isPatched = true;
        }
        
        // 确保中心距有效
        let centerDistance = safeParseFloat(item.centerDistance);
        if (centerDistance === undefined || isNaN(centerDistance) || centerDistance < 0) {
          item.centerDistance = DEFAULTS.gearbox.centerDistance;
          warnings.push(`${colKey}/${item.model || '未知'}: 中心距设置为默认值 ${DEFAULTS.gearbox.centerDistance}`);
          isPatched = true;
        }
        
        // 确保重量有效
        let weight = safeParseFloat(item.weight);
        if (weight === undefined || isNaN(weight) || weight <= 0) {
          item.weight = DEFAULTS.gearbox.weight;
          warnings.push(`${colKey}/${item.model || '未知'}: 重量设置为默认值 ${DEFAULTS.gearbox.weight}`);
          isPatched = true;
        }
        
        // 如果速度范围不是有效的两元素数组，进行修复
        if (!Array.isArray(item.inputSpeedRange) || 
            item.inputSpeedRange.length !== 2 || 
            !item.inputSpeedRange.every(v => safeParseFloat(v) !== undefined && !isNaN(safeParseFloat(v)) && safeParseFloat(v) >= 0)) {
          item.inputSpeedRange = [...DEFAULTS.gearbox.inputSpeedRange];
          warnings.push(`${colKey}/${item.model || '未知'}: 输入转速范围设置为默认值 [${DEFAULTS.gearbox.inputSpeedRange.join(', ')}]`);
          isPatched = true;
        } else if (safeParseFloat(item.inputSpeedRange[0]) > safeParseFloat(item.inputSpeedRange[1])) {
          // 如果下限大于上限，交换值
          item.inputSpeedRange = [item.inputSpeedRange[1], item.inputSpeedRange[0]];
          warnings.push(`${colKey}/${item.model || '未知'}: 输入转速范围上下限已交换`);
          isPatched = true;
        }
        
        if (isPatched) {
          patched++;
        }
        
        return item;
      });
    }
  });
  
  return { data: result, patched, warnings };
};

/**
 * 修复配件数据
 * @param {Object} data 数据对象
 * @returns {Object} 处理结果 { data, errors, warnings, summary }
 */
export const fixAccessories = (data) => {
  if (!data) return { 
    data: {}, 
    errors: ['输入数据对象为空或无效'], 
    warnings: [],
    summary: { totalPatched: 0 }
  };
  
  const result = { ...data };
  const errors = [];
  const warnings = [];
  let patchedCouplings = 0;
  let patchedPumps = 0;
  
  // 修复联轴器数据
  if (Array.isArray(result.flexibleCouplings)) {
    result.flexibleCouplings = result.flexibleCouplings.map(coupling => {
      try {
        const fixed = fixCouplingTorque(coupling);
        if (fixed !== coupling) {
          patchedCouplings++;
        }
        return fixed;
      } catch (e) {
        errors.push(`修复联轴器 ${coupling?.model || '未知'} 时发生错误: ${e.message}`);
        return coupling; // 保留原始数据
      }
    });
  } else {
    warnings.push('flexibleCouplings 集合不存在或非数组');
  }
  
  // 修复备用泵数据
  if (Array.isArray(result.standbyPumps)) {
    result.standbyPumps = result.standbyPumps.map(pump => {
      try {
        const fixed = fixPumpData(pump);
        if (fixed !== pump) {
          patchedPumps++;
        }
        return fixed;
      } catch (e) {
        errors.push(`修复备用泵 ${pump?.model || '未知'} 时发生错误: ${e.message}`);
        return pump; // 保留原始数据
      }
    });
  } else {
    warnings.push('standbyPumps 集合不存在或非数组');
  }
  
  return {
    data: result,
    errors,
    warnings,
    summary: {
      totalPatched: patchedCouplings + patchedPumps,
      patchedCouplings,
      patchedPumps
    }
  };
};
