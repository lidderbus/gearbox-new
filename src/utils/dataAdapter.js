// src/utils/dataAdapter.js
import { safeParseFloat } from './dataHelpers';
import { getDiscountRate, calculateFactoryPrice, calculateMarketPrice } from './priceManager';

export function adaptBasicData(rawData) {
  if (!rawData) return createEmptyData();
  
  const adapted = { ...rawData };
  
  // 处理齿轮箱集合
  const gearboxCollections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes'
  ];
  
  gearboxCollections.forEach(key => {
    if (Array.isArray(adapted[key])) {
      adapted[key] = adapted[key].map(adaptGearboxItem).filter(Boolean);
    } else {
      adapted[key] = [];
    }
  });
  
  // 处理配件
  if (Array.isArray(adapted.flexibleCouplings)) {
    adapted.flexibleCouplings = adapted.flexibleCouplings.map(adaptCouplingItem).filter(Boolean);
  } else {
    adapted.flexibleCouplings = [];
  }
  
  if (Array.isArray(adapted.standbyPumps)) {
    adapted.standbyPumps = adapted.standbyPumps.map(adaptPumpItem).filter(Boolean);
  } else {
    adapted.standbyPumps = [];
  }
  
  return adapted;
}

function adaptGearboxItem(item) {
  if (!item || !item.model) return null;
  
  const adapted = { ...item };
  
  // 确保基础字段存在
  adapted.model = String(adapted.model).trim();
  adapted.inputSpeedRange = ensureValidSpeedRange(adapted.inputSpeedRange);
  adapted.ratios = ensureValidRatios(adapted.ratios);
  adapted.transferCapacity = ensureMatchingCapacityArray(adapted.transferCapacity, adapted.ratios);
  
  // 确保其他技术参数
  adapted.thrust = safeParseFloat(adapted.thrust) || 0;
  adapted.centerDistance = safeParseFloat(adapted.centerDistance) || 0;
  adapted.weight = safeParseFloat(adapted.weight) || 0;
  adapted.efficiency = safeParseFloat(adapted.efficiency) || 0.97;
  adapted.controlType = adapted.controlType || "推拉软轴";
  
  // 确保价格字段
  adaptPriceFields(adapted);
  
  return adapted;
}

function adaptCouplingItem(item) {
  if (!item || !item.model) return null;
  
  const adapted = { ...item };
  
  // 确保基础字段
  adapted.model = String(adapted.model).trim();
  
  // 处理扭矩字段（统一为kN·m）
  adapted.torque = convertTorqueToKNm(adapted);
  adapted.maxTorque = safeParseFloat(adapted.maxTorque) || (adapted.torque * 2.5);
  adapted.maxSpeed = safeParseFloat(adapted.maxSpeed) || 3000;
  adapted.weight = safeParseFloat(adapted.weight) || 50;
  
  // 确保价格字段
  adaptPriceFields(adapted);
  
  return adapted;
}

function adaptPumpItem(item) {
  if (!item || !item.model) return null;
  
  const adapted = { ...item };
  
  // 确保基础字段
  adapted.model = String(adapted.model).trim();
  adapted.flow = safeParseFloat(adapted.flow) || 10.0;
  adapted.pressure = safeParseFloat(adapted.pressure) || 2.5;
  adapted.motorPower = safeParseFloat(adapted.motorPower) || 2.0;
  adapted.weight = safeParseFloat(adapted.weight) || 30;
  
  // 确保价格字段
  adaptPriceFields(adapted);
  
  return adapted;
}

function ensureValidSpeedRange(range) {
  if (Array.isArray(range) && range.length === 2) {
    return [
      safeParseFloat(range[0]) || 1000,
      safeParseFloat(range[1]) || 2500
    ];
  }
  return [1000, 2500]; // 默认转速范围
}

function ensureValidRatios(ratios) {
  if (Array.isArray(ratios)) {
    return ratios.map(r => safeParseFloat(r)).filter(r => r > 0);
  }
  return [];
}

function ensureMatchingCapacityArray(capacity, ratios) {
  if (!Array.isArray(ratios) || ratios.length === 0) {
    return [];
  }
  
  if (!Array.isArray(capacity) || capacity.length === 0) {
    // 如果没有传递能力数据，填充默认值
    return new Array(ratios.length).fill(0.1);
  }
  
  // 确保长度匹配
  if (capacity.length === ratios.length) {
    return capacity.map(c => safeParseFloat(c) || 0.1);
  }
  
  // 调整长度
  const result = [];
  for (let i = 0; i < ratios.length; i++) {
    result.push(safeParseFloat(capacity[i % capacity.length]) || 0.1);
  }
  return result;
}

function convertTorqueToKNm(item) {
  let torque = safeParseFloat(item.torque);
  
  if (torque && item.torqueUnit) {
    const unit = item.torqueUnit.toLowerCase();
    if (unit.includes('nm') || unit.includes('n·m')) {
      torque = torque / 1000; // 转换为kN·m
    }
  } else if (torque > 1000) {
    // 大于1000可能是N·m，转换
    torque = torque / 1000;
  }
  
  return torque || 5.0; // 默认值
}

function adaptPriceFields(item) {
  item.basePrice = safeParseFloat(item.basePrice || item.price) || 10000;
  item.price = item.basePrice;
  item.discountRate = safeParseFloat(item.discountRate) || getDiscountRate(item.model);
  
  // 如果折扣率是百分比格式，转换为小数
  if (item.discountRate > 1) {
    item.discountRate = item.discountRate / 100;
  }
  
  item.factoryPrice = calculateFactoryPrice(item);
  item.marketPrice = calculateMarketPrice(item, item.factoryPrice);
  item.packagePrice = item.factoryPrice;
}

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
    _error: null
  };
}

// 添加缺失的adaptEnhancedData函数
export function adaptEnhancedData(rawData) {
  console.log("adaptEnhancedData: 开始数据适配...");
  
  if (!rawData) {
    console.warn("adaptEnhancedData: 输入数据为空，返回空集合");
    return createEmptyData();
  }
  
  console.log("adaptEnhancedData: 输入数据内容:", Object.keys(rawData).map(key => ({
    key,
    type: typeof rawData[key],
    isArray: Array.isArray(rawData[key]),
    length: Array.isArray(rawData[key]) ? rawData[key].length : 'not array'
  })));
  
  // 确保所有集合存在
  const data = { ...rawData };
  
  // 处理齿轮箱集合
  const gearboxCollections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes'
  ];
  
  console.log("adaptEnhancedData: 开始处理齿轮箱数据...");
  gearboxCollections.forEach(key => {
    console.log(`adaptEnhancedData: 处理 ${key}...`);
    const originalLength = Array.isArray(data[key]) ? data[key].length : 0;
    if (Array.isArray(data[key])) {
      data[key] = data[key].map(adaptGearboxItem).filter(Boolean);
    } else {
      data[key] = [];
    }
    console.log(`adaptEnhancedData: ${key} 处理完成，原始长度: ${originalLength}, 处理后长度: ${data[key].length}`);
  });
  
  console.log("adaptEnhancedData: 开始处理联轴器数据...");
  const originalCouplingLength = Array.isArray(data.flexibleCouplings) ? data.flexibleCouplings.length : 0;
  if (Array.isArray(data.flexibleCouplings)) {
    data.flexibleCouplings = data.flexibleCouplings.map(adaptCouplingItem).filter(Boolean);
  } else {
    data.flexibleCouplings = [];
  }
  console.log(`adaptEnhancedData: 联轴器处理完成，原始长度: ${originalCouplingLength}, 处理后长度: ${data.flexibleCouplings.length}`);
  
  console.log("adaptEnhancedData: 开始处理备用泵数据...");
  const originalPumpLength = Array.isArray(data.standbyPumps) ? data.standbyPumps.length : 0;
  if (Array.isArray(data.standbyPumps)) {
    data.standbyPumps = data.standbyPumps.map(adaptPumpItem).filter(Boolean);
  } else {
    data.standbyPumps = [];
  }
  console.log(`adaptEnhancedData: 备用泵处理完成，原始长度: ${originalPumpLength}, 处理后长度: ${data.standbyPumps.length}`);
  
  console.log("adaptEnhancedData: 数据适配完成。");
  return data;
}