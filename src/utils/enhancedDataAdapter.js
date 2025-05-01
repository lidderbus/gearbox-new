// src/utils/enhancedDataAdapter.js
/**
 * 增强型数据适配器
 * 提供更稳定的数据转换和适配功能
 */

import { safeParseFloat } from './dataHelpers';
import { calculateFactoryPrice, calculateMarketPrice } from './priceManager';
import { DEFAULTS } from '../config';

/**
 * 适配基础数据
 * @param {Object} rawData 原始数据对象
 * @returns {Object} 适配后的数据对象
 */
export function adaptBasicData(rawData) {
  if (!rawData) return createEmptyData();
  
  // 创建一个数据对象的深拷贝，避免修改原始数据
  const adapted = JSON.parse(JSON.stringify(rawData));
  
  // 处理齿轮箱集合
  const gearboxCollections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes'
  ];
  
  // 适配每个齿轮箱集合
  gearboxCollections.forEach(key => {
    if (Array.isArray(adapted[key])) {
      adapted[key] = adapted[key]
        .map(item => adaptGearboxItem(item))
        .filter(Boolean); // 移除无效项
    } else {
      adapted[key] = [];
    }
  });
  
  // 处理配件集合
  // 联轴器
  if (Array.isArray(adapted.flexibleCouplings)) {
    adapted.flexibleCouplings = adapted.flexibleCouplings
      .map(item => adaptCouplingItem(item))
      .filter(Boolean); // 移除无效项
  } else {
    adapted.flexibleCouplings = [];
  }
  
  // 备用泵
  if (Array.isArray(adapted.standbyPumps)) {
    adapted.standbyPumps = adapted.standbyPumps
      .map(item => adaptPumpItem(item))
      .filter(Boolean); // 移除无效项
  } else {
    adapted.standbyPumps = [];
  }
  
  return adapted;
}

/**
 * 适配齿轮箱项目
 * @param {Object} item 原始齿轮箱项目
 * @returns {Object|null} 适配后的齿轮箱项目，如果无效则返回null
 */
function adaptGearboxItem(item) {
  // 输入验证
  if (!item || !item.model) return null;
  
  // 创建一个新对象
  const adapted = { ...item };
  
  // 确保基础字段存在且有效
  adapted.model = String(adapted.model).trim();
  
  // 处理输入转速范围
  adapted.inputSpeedRange = ensureValidSpeedRange(adapted.inputSpeedRange);
  
  // 处理减速比数组
  adapted.ratios = ensureValidRatios(adapted.ratios);
  
  // 处理传递能力数组（确保与减速比数组长度匹配）
  adapted.transferCapacity = ensureMatchingCapacityArray(adapted.transferCapacity, adapted.ratios);
  
  // 确保其他技术参数
  adapted.thrust = safeParseFloat(adapted.thrust) || 0;
  adapted.centerDistance = safeParseFloat(adapted.centerDistance) || 0;
  adapted.weight = safeParseFloat(adapted.weight) || 0;
  adapted.efficiency = safeParseFloat(adapted.efficiency) || 0.97;
  
  // 确保控制类型
  adapted.controlType = adapted.controlType || "推拉软轴";
  
  // 确保价格字段
  adaptPriceFields(adapted);
  
  return adapted;
}

/**
 * 适配联轴器项目
 * @param {Object} item 原始联轴器项目
 * @returns {Object|null} 适配后的联轴器项目，如果无效则返回null
 */
function adaptCouplingItem(item) {
  // 输入验证
  if (!item || !item.model) return null;
  
  // 创建一个新对象
  const adapted = { ...item };
  
  // 确保基础字段存在且有效
  adapted.model = String(adapted.model).trim();
  
  // 处理扭矩字段（统一为kN·m）
  adapted.torque = safeParseFloat(convertTorqueToKNm(adapted)) || DEFAULTS.coupling.torque;
  adapted.maxTorque = safeParseFloat(adapted.maxTorque) || (adapted.torque * 2.5);
  adapted.maxSpeed = safeParseFloat(adapted.maxSpeed) || DEFAULTS.coupling.maxSpeed;
  adapted.weight = safeParseFloat(adapted.weight) || DEFAULTS.coupling.weight;
  
  // 确保价格字段
  adaptPriceFields(adapted);
  
  return adapted;
}

/**
 * 适配备用泵项目
 * @param {Object} item 原始备用泵项目
 * @returns {Object|null} 适配后的备用泵项目，如果无效则返回null
 */
function adaptPumpItem(item) {
  // 输入验证
  if (!item || !item.model) return null;
  
  // 创建一个新对象
  const adapted = { ...item };
  
  // 确保基础字段存在且有效
  adapted.model = String(adapted.model).trim();
  adapted.flow = safeParseFloat(adapted.flow) || DEFAULTS.sparePump.flow;
  adapted.pressure = safeParseFloat(adapted.pressure) || DEFAULTS.sparePump.pressure;
  adapted.motorPower = safeParseFloat(adapted.motorPower) || DEFAULTS.sparePump.motorPower;
  adapted.weight = safeParseFloat(adapted.weight) || DEFAULTS.sparePump.weight;
  
  // 确保价格字段
  adaptPriceFields(adapted);
  
  return adapted;
}

/**
 * 确保有效的转速范围
 * @param {Array} range 原始转速范围
 * @returns {Array} 有效的转速范围
 */
function ensureValidSpeedRange(range) {
  // 如果是有效的两元素数组，确保每个元素都是有效数字
  if (Array.isArray(range) && range.length === 2) {
    const min = safeParseFloat(range[0]);
    const max = safeParseFloat(range[1]);
    
    if (min !== undefined && max !== undefined) {
      // 确保最小值小于最大值
      if (min <= max) {
        return [min, max];
      } else {
        return [max, min]; // 交换位置
      }
    }
  }
  
  // 默认转速范围
  return [DEFAULTS.gearbox.inputSpeedRange[0], DEFAULTS.gearbox.inputSpeedRange[1]];
}

/**
 * 确保有效的减速比数组
 * @param {Array} ratios 原始减速比数组
 * @returns {Array} 有效的减速比数组
 */
function ensureValidRatios(ratios) {
  // 检查是否为数组
  if (Array.isArray(ratios)) {
    // 过滤出有效的减速比（数字且大于0）
    const validRatios = ratios
      .map(r => safeParseFloat(r))
      .filter(r => r !== undefined && r > 0);
    
    // 如果有有效的减速比，返回它们
    if (validRatios.length > 0) {
      return validRatios;
    }
  }
  
  // 默认减速比
  return [...DEFAULTS.gearbox.ratios];
}

/**
 * 确保传递能力数组与减速比数组长度匹配
 * @param {Array} capacity 原始传递能力数组
 * @param {Array} ratios 减速比数组
 * @returns {Array} 有效的传递能力数组
 */
function ensureMatchingCapacityArray(capacity, ratios) {
  // 如果减速比数组无效，返回空数组
  if (!Array.isArray(ratios) || ratios.length === 0) {
    return [];
  }
  
  // 如果传递能力数组无效或为空，填充默认值
  if (!Array.isArray(capacity) || capacity.length === 0) {
    return new Array(ratios.length).fill(DEFAULTS.gearbox.transferCapacity);
  }
  
  // 确保长度匹配
  if (capacity.length === ratios.length) {
    // 确保所有值都是有效数字
    return capacity.map(c => safeParseFloat(c) || DEFAULTS.gearbox.transferCapacity);
  }
  
  // 处理长度不匹配的情况
  const result = [];
  for (let i = 0; i < ratios.length; i++) {
    // 使用循环取模保证索引有效
    const capacityValue = safeParseFloat(capacity[i % capacity.length]);
    result.push(capacityValue || DEFAULTS.gearbox.transferCapacity);
  }
  
  return result;
}

/**
 * 将扭矩转换为kN·m
 * @param {Object} item 联轴器项目
 * @returns {number} 转换后的扭矩值
 */
function convertTorqueToKNm(item) {
  let torque = safeParseFloat(item.torque);
  
  // 检查是否存在torque和单位
  if (torque && item.torqueUnit) {
    const unit = item.torqueUnit.toLowerCase();
    // 检查是否需要转换
    if (unit.includes('nm') || unit.includes('n·m') || unit.includes('n.m')) {
      torque = torque / 1000; // 转换为kN·m
    }
  } else if (torque > 1000) {
    // 如果扭矩值非常大，可能是N·m单位
    torque = torque / 1000;
  }
  
  return torque || DEFAULTS.coupling.torque;
}

/**
 * 适配价格字段
 * @param {Object} item 数据项目
 */
function adaptPriceFields(item) {
  // 确保基础价格
  item.basePrice = safeParseFloat(item.basePrice || item.price) || 0;
  item.price = item.basePrice;
  
  // 确保折扣率（如果是百分比格式，转换为小数）
  let discountRate = safeParseFloat(item.discountRate);
  if (discountRate === undefined || isNaN(discountRate)) {
    discountRate = 0.10; // 默认折扣率
  } else if (discountRate > 1) {
    discountRate = discountRate / 100; // 转换百分比为小数
  }
  item.discountRate = discountRate;
  
  // 计算工厂价、市场价和包装价
  item.factoryPrice = safeParseFloat(item.factoryPrice) || calculateFactoryPrice(item);
  item.marketPrice = safeParseFloat(item.marketPrice) || calculateMarketPrice(item, item.factoryPrice);
  item.packagePrice = safeParseFloat(item.packagePrice) || item.factoryPrice;
}

/**
 * 创建空数据结构
 * @returns {Object} 空数据结构
 */
function createEmptyData() {
  return {
    hcGearboxes: [],
    gwGearboxes: [],
    hcmGearboxes: [],
    dtGearboxes: [],
    hcqGearboxes: [],
    gcGearboxes: [],
    hcxGearboxes: [],
    hcaGearboxes: [],
    hcvGearboxes: [],
    mvGearboxes: [],
    otherGearboxes: [],
    flexibleCouplings: [],
    standbyPumps: [],
    _error: null,
    _version: 2,
    _lastFixed: new Date().toISOString()
  };
}

/**
 * 增强型数据适配
 * @param {Object} rawData 原始数据
 * @returns {Object} 适配后的数据
 */
export function adaptEnhancedData(rawData) {
  console.log("enhancedDataAdapter: 开始数据适配...");
  
  // 验证输入数据
  if (!rawData) {
    console.warn("enhancedDataAdapter: 输入数据为空，返回空集合");
    return createEmptyData();
  }
  
  // 记录输入数据内容
  console.log("enhancedDataAdapter: 输入数据内容:", Object.keys(rawData).map(key => ({
    key,
    type: typeof rawData[key],
    isArray: Array.isArray(rawData[key]),
    length: Array.isArray(rawData[key]) ? rawData[key].length : 'not array'
  })));
  
  // 使用基础适配
  const adaptedData = adaptBasicData(rawData);
  
  // 保留元数据字段
  if (rawData._version) adaptedData._version = rawData._version;
  if (rawData._lastFixed) adaptedData._lastFixed = rawData._lastFixed;
  if (rawData.metadata) adaptedData.metadata = { ...rawData.metadata };
  
  // 记录适配结果
  console.log("enhancedDataAdapter: 数据适配完成。");
  console.log("enhancedDataAdapter: 适配结果:", {
    gearboxCount: Object.keys(adaptedData).filter(key => key.endsWith('Gearboxes')).reduce((sum, key) =>
      sum + (Array.isArray(adaptedData[key]) ? adaptedData[key].length : 0), 0),
    couplingCount: adaptedData.flexibleCouplings?.length || 0,
    pumpCount: adaptedData.standbyPumps?.length || 0
  });
  
  return adaptedData;
}

export default {
  adaptBasicData,
  adaptEnhancedData,
  createEmptyData
};
