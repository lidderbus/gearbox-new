// src/utils/capacityEstimator.js
// 齿轮箱传递能力评估工具

import { safeParseFloat } from './dataHelpers';

/**
 * 估算单个减速比的传递能力
 * @param {Object} gearbox 齿轮箱对象
 * @param {number} ratio 减速比
 * @returns {number} 估算的传递能力 (kW/rpm)
 */
export function estimateTransferCapacity(gearbox, ratio) {
  if (!gearbox || !ratio) return 0;
  
  // 基于模型名称确定基础值
  const baseCapacity = getBaseCapacityByModel(gearbox.model);
  
  // 根据减速比调整
  const ratioFactor = calculateRatioFactor(ratio);
  
  // 考虑齿轮箱系列特性
  const seriesFactor = getSeriesFactor(gearbox.model);
  
  return baseCapacity * ratioFactor * seriesFactor;
}

/**
 * 估算齿轮箱所有减速比的传递能力数组
 * @param {Object} gearbox 齿轮箱对象
 * @param {Array} ratios 减速比数组
 * @returns {Array} 传递能力数组
 */
export function estimateTransferCapacityArray(gearbox, ratios) {
  if (!Array.isArray(ratios) || ratios.length === 0) return [];
  
  return ratios.map(ratio => estimateTransferCapacity(gearbox, ratio));
}

/**
 * 根据型号获取基础传递能力
 * @param {string} model 型号
 * @returns {number} 基础传递能力
 */
function getBaseCapacityByModel(model) {
  if (!model) return 0.1;
  
  // 提取型号中的数字
  const match = model.match(/\d+/);
  if (!match) return 0.1;
  
  const modelNumber = parseInt(match[0], 10);
  
  // HC系列
  if (model.startsWith('HC')) {
    if (modelNumber <= 400) return 0.03;
    if (modelNumber <= 600) return 0.06;
    if (modelNumber <= 1000) return 0.1;
    if (modelNumber <= 1600) return 0.2;
    return 0.3;
  }
  
  // GW系列（双机）
  if (model.startsWith('2GW')) {
    return modelNumber / 500; // 较大的传递能力
  }
  
  // GW系列（单机）
  if (model.startsWith('GW')) {
    return modelNumber / 1000;
  }
  
  // HCM系列
  if (model.startsWith('HCM')) {
    return modelNumber / 2000;
  }
  
  // DT系列
  if (model.startsWith('DT')) {
    return modelNumber / 3000;
  }
  
  // 默认值
  return 0.1;
}

/**
 * 计算减速比系数
 * @param {number} ratio 减速比
 * @returns {number} 系数
 */
function calculateRatioFactor(ratio) {
  if (!ratio || ratio <= 0) return 1;
  
  // 较小的减速比通常有较大的传递能力
  if (ratio < 2) return 1.3;
  if (ratio < 3) return 1.2;
  if (ratio < 4) return 1.1;
  if (ratio < 5) return 1.0;
  if (ratio < 6) return 0.9;
  return 0.8;
}

/**
 * 获取系列特性系数
 * @param {string} model 型号
 * @returns {number} 系数
 */
function getSeriesFactor(model) {
  if (!model) return 1;
  
  // 特殊型号处理
  if (model.endsWith('P')) return 1.2; // 混合动力
  if (model.endsWith('A')) return 1.1; // 增强型
  if (model.endsWith('S')) return 0.9; // 经济型
  
  // 系列处理
  if (model.startsWith('HC')) return 1.0;
  if (model.startsWith('GW')) return 1.2;
  if (model.startsWith('HCM')) return 0.9;
  if (model.startsWith('DT')) return 0.8;
  if (model.startsWith('HCQ')) return 1.1;
  if (model.startsWith('GC')) return 1.0;
  
  return 1.0;
}

/**
 * 验证并修正传递能力数组
 * @param {Array} capacityArray 传递能力数组
 * @param {Array} ratioArray 减速比数组
 * @returns {Array} 修正后的传递能力数组
 */
export function validateAndFixCapacityArray(capacityArray, ratioArray) {
  if (!Array.isArray(ratioArray) || ratioArray.length === 0) return [];
  
  if (!Array.isArray(capacityArray) || capacityArray.length === 0) {
    // 创建默认值数组
    return new Array(ratioArray.length).fill(0.1);
  }
  
  // 确保长度匹配
  if (capacityArray.length === ratioArray.length) {
    // 验证每个值
    return capacityArray.map(cap => {
      const value = safeParseFloat(cap);
      return (value && value > 0) ? value : 0.1;
    });
  }
  
  // 长度不匹配，根据比例调整
  const result = [];
  const avgCapacity = capacityArray.reduce((sum, val) => sum + (safeParseFloat(val) || 0), 0) / capacityArray.length;
  
  for (let i = 0; i < ratioArray.length; i++) {
    if (i < capacityArray.length) {
      const value = safeParseFloat(capacityArray[i]);
      result.push((value && value > 0) ? value : avgCapacity);
    } else {
      result.push(avgCapacity);
    }
  }
  
  return result;
}