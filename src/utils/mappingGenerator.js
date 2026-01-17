// src/utils/mappingGenerator.js
// 自动映射生成器 - 为所有齿轮箱型号生成联轴器和备用泵映射

import {
  couplingSpecificationsMap,
  couplingWithCoverMap,
  getRecommendedCouplingInfo,
  getRecommendedPump
} from '../data/gearboxMatchingMaps';

/**
 * 联轴器选择规则表
 * 基于扭矩范围选择合适的联轴器
 * 扭矩单位: kN·m
 */
const COUPLING_SELECTION_RULES = [
  { maxTorque: 2.0, coupling: 'HGTL1.8A', series: 'HGTL' },
  { maxTorque: 2.5, coupling: 'HGTH2', series: 'HGTH' },
  { maxTorque: 3.0, coupling: 'HGTL2.2', series: 'HGTL' },
  { maxTorque: 4.5, coupling: 'HGTL3.5Q', series: 'HGTL' },
  { maxTorque: 5.0, coupling: 'HGTHT4', series: 'HGTHT' },
  { maxTorque: 5.5, coupling: 'HGTHT4.5', series: 'HGTHT' },
  { maxTorque: 6.5, coupling: 'HGTHT5', series: 'HGTHT' },
  { maxTorque: 8.0, coupling: 'HGTHT6.3A', series: 'HGTHT' },
  { maxTorque: 10.0, coupling: 'HGTHT8.6', series: 'HGTHT' },
  { maxTorque: 13.0, coupling: 'HGTHB5A', series: 'HGTHB' },
  { maxTorque: 16.0, coupling: 'HGTHB6.3A', series: 'HGTHB' },
  { maxTorque: 20.0, coupling: 'HGTHB8A', series: 'HGTHB' },
  { maxTorque: 25.0, coupling: 'HGTHB10A', series: 'HGTHB' },
  { maxTorque: 32.0, coupling: 'HGTHB12.5A', series: 'HGTHB' },
  { maxTorque: 45.0, coupling: 'HGTHB16', series: 'HGTHB' }
];

/**
 * 备用泵选择规则表
 * 基于齿轮箱功率/大小选择备用泵
 */
const PUMP_SELECTION_RULES = [
  { maxPower: 150, pump: null },  // 小型齿轮箱通常不需要备用泵
  { maxPower: 300, pump: '2CY-5/2.5D' },
  { maxPower: 500, pump: '2CY-7.5/2.5D' },
  { maxPower: 800, pump: '2CY-14.2/2.5D' },
  { maxPower: 1200, pump: '2CY-19.2/2.5D' },
  { maxPower: Infinity, pump: '2CY-24.8/2.5D' }
];

/**
 * DT系列专用备用泵规则
 */
const DT_PUMP_RULES = [
  { maxSize: 280, pump: '2CYA-1.1/0.8D' },
  { maxSize: 900, pump: '2CYA-1.7/0.8D' },
  { maxSize: Infinity, pump: '2CYA-2.2/1D' }
];

/**
 * 从型号中提取数字大小
 * @param {string} model - 齿轮箱型号
 * @returns {number} 型号中的主要数字
 */
function extractModelSize(model) {
  if (!model) return 0;

  // 移除常见前缀
  const cleanModel = model.replace(/^(HCT|HCD|HCW|HCQ|HCA|HCM|HC|GWC|GWS|GW|SGW|DT|MB)/i, '');

  // 提取第一个数字序列
  const match = cleanModel.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * 从型号中提取系列前缀
 * @param {string} model - 齿轮箱型号
 * @returns {string} 系列前缀
 */
function extractSeriesPrefix(model) {
  if (!model) return '';

  const prefixes = ['HCT', 'HCD', 'HCW', 'HCQ', 'HCA', 'HCM', 'HCL', 'HCV', 'HC', 'GWC', 'GWS', 'GW', 'SGW', 'DT', 'MB', 'MV'];
  const upperModel = model.toUpperCase();

  for (const prefix of prefixes) {
    if (upperModel.startsWith(prefix)) {
      return prefix;
    }
  }

  return '';
}

/**
 * 计算齿轮箱的最大扭矩
 * 扭矩 T = 9550 × P / n (kN·m = kW / rpm × 9.55)
 * @param {Object} gearbox - 齿轮箱数据
 * @returns {number} 最大扭矩 (kN·m)
 */
function calculateMaxTorque(gearbox) {
  // 获取功率
  let maxPower = 0;

  if (gearbox.maxPower) {
    maxPower = gearbox.maxPower;
  } else if (gearbox.transferCapacity && gearbox.inputSpeedRange) {
    // 从传递能力计算: P = transferCapacity × speed
    const maxCapacity = Math.max(...(Array.isArray(gearbox.transferCapacity) ? gearbox.transferCapacity : [gearbox.transferCapacity]));
    const maxSpeed = gearbox.inputSpeedRange[1] || 2000;
    maxPower = maxCapacity * maxSpeed;
  } else if (gearbox.minPower) {
    maxPower = gearbox.minPower * 1.5; // 估算
  }

  // 获取最低转速（扭矩最大时）
  const minSpeed = gearbox.inputSpeedRange ? gearbox.inputSpeedRange[0] : 1000;

  // 计算扭矩 (kN·m)
  const torque = (9.55 * maxPower) / minSpeed;

  // 安全系数 1.5
  return torque * 1.5;
}

/**
 * 估算齿轮箱最大功率
 * @param {Object} gearbox - 齿轮箱数据
 * @returns {number} 最大功率 (kW)
 */
function estimateMaxPower(gearbox) {
  if (gearbox.maxPower) return gearbox.maxPower;

  if (gearbox.transferCapacity && gearbox.inputSpeedRange) {
    const maxCapacity = Math.max(...(Array.isArray(gearbox.transferCapacity) ? gearbox.transferCapacity : [gearbox.transferCapacity]));
    const maxSpeed = gearbox.inputSpeedRange[1] || 2000;
    return maxCapacity * maxSpeed;
  }

  if (gearbox.minPower) {
    return gearbox.minPower * 1.5;
  }

  // 基于型号大小估算
  const size = extractModelSize(gearbox.model);
  return size * 0.5; // 粗略估算
}

/**
 * 根据扭矩选择联轴器
 * @param {number} requiredTorque - 所需扭矩 (kN·m)
 * @returns {string|null} 推荐的联轴器型号
 */
function selectCouplingByTorque(requiredTorque) {
  for (const rule of COUPLING_SELECTION_RULES) {
    if (requiredTorque <= rule.maxTorque) {
      return rule.coupling;
    }
  }
  // 超大扭矩使用最大规格
  return 'HGTHB16';
}

/**
 * 根据功率选择备用泵
 * @param {number} power - 功率 (kW)
 * @param {string} series - 齿轮箱系列
 * @param {number} modelSize - 型号大小数字
 * @returns {string|null} 推荐的备用泵型号
 */
function selectPumpByPower(power, series, modelSize) {
  // DT系列使用特殊规则
  if (series === 'DT') {
    for (const rule of DT_PUMP_RULES) {
      if (modelSize <= rule.maxSize) {
        return rule.pump;
      }
    }
    return '2CYA-2.2/1D';
  }

  // 其他系列使用标准规则
  for (const rule of PUMP_SELECTION_RULES) {
    if (power <= rule.maxPower) {
      return rule.pump;
    }
  }

  return '2CY-24.8/2.5D';
}

/**
 * 为单个齿轮箱生成映射
 * @param {Object} gearbox - 齿轮箱数据
 * @returns {Object} 映射结果
 */
export function generateMappingForGearbox(gearbox) {
  if (!gearbox || !gearbox.model) {
    return null;
  }

  const model = gearbox.model;
  const series = extractSeriesPrefix(model);
  const modelSize = extractModelSize(model);

  // 1. 首先检查是否有已知映射
  const existingInfo = getRecommendedCouplingInfo(model);
  const existingPump = getRecommendedPump(model);

  // 2. 计算扭矩和功率
  const maxTorque = calculateMaxTorque(gearbox);
  const maxPower = estimateMaxPower(gearbox);

  // 3. 确定联轴器
  let coupling = existingInfo.specific || existingInfo.prefix;
  let couplingSource = 'known';

  if (!coupling) {
    // 无已知映射，根据扭矩计算
    coupling = selectCouplingByTorque(maxTorque);
    couplingSource = 'calculated';
  }

  // 4. 确定备用泵
  let pump = existingPump;
  let pumpSource = 'known';

  if (!pump) {
    // 无已知映射，根据功率计算
    pump = selectPumpByPower(maxPower, series, modelSize);
    pumpSource = pump ? 'calculated' : 'none';
  }

  // 5. 获取联轴器规格
  const couplingSpec = coupling ? couplingSpecificationsMap[coupling] : null;

  // 6. 获取带罩壳版本
  const couplingWithCover = coupling ? (couplingWithCoverMap[coupling] || null) : null;

  return {
    gearboxModel: model,
    series,
    modelSize,
    maxPower: Math.round(maxPower),
    maxTorque: Math.round(maxTorque * 100) / 100,
    coupling: {
      model: coupling,
      withCover: couplingWithCover,
      source: couplingSource,
      specifications: couplingSpec
    },
    pump: {
      model: pump,
      source: pumpSource
    }
  };
}

/**
 * 批量生成映射
 * @param {Array} gearboxes - 齿轮箱数组
 * @returns {Object} 映射结果统计
 */
export function batchGenerateMappings(gearboxes) {
  if (!Array.isArray(gearboxes)) return { mappings: [], stats: {} };

  const mappings = [];
  const stats = {
    total: 0,
    withKnownCoupling: 0,
    withCalculatedCoupling: 0,
    withKnownPump: 0,
    withCalculatedPump: 0,
    withoutCoupling: 0,
    withoutPump: 0,
    bySeries: {}
  };

  gearboxes.forEach(gearbox => {
    const mapping = generateMappingForGearbox(gearbox);
    if (mapping) {
      mappings.push(mapping);
      stats.total++;

      // 统计联轴器来源
      if (mapping.coupling.model) {
        if (mapping.coupling.source === 'known') {
          stats.withKnownCoupling++;
        } else {
          stats.withCalculatedCoupling++;
        }
      } else {
        stats.withoutCoupling++;
      }

      // 统计备用泵来源
      if (mapping.pump.model) {
        if (mapping.pump.source === 'known') {
          stats.withKnownPump++;
        } else {
          stats.withCalculatedPump++;
        }
      } else {
        stats.withoutPump++;
      }

      // 按系列统计
      const series = mapping.series || 'OTHER';
      if (!stats.bySeries[series]) {
        stats.bySeries[series] = { total: 0, withCoupling: 0, withPump: 0 };
      }
      stats.bySeries[series].total++;
      if (mapping.coupling.model) stats.bySeries[series].withCoupling++;
      if (mapping.pump.model) stats.bySeries[series].withPump++;
    }
  });

  return { mappings, stats };
}

/**
 * 生成扩展的映射表 JavaScript 代码
 * @param {Array} mappings - 映射数组
 * @returns {string} 可导出的 JavaScript 代码
 */
export function generateMappingCode(mappings) {
  const couplingMap = {};
  const pumpMap = {};

  mappings.forEach(m => {
    if (m.coupling.model) {
      couplingMap[m.gearboxModel] = m.coupling.model;
    }
    if (m.pump.model) {
      pumpMap[m.gearboxModel] = m.pump.model;
    }
  });

  const code = `
// 自动生成的扩展映射表
// 生成时间: ${new Date().toISOString()}
// 总映射数: ${mappings.length}

export const extendedCouplingMap = ${JSON.stringify(couplingMap, null, 2)};

export const extendedPumpMap = ${JSON.stringify(pumpMap, null, 2)};
`;

  return code;
}

/**
 * 获取所有联轴器规格的汇总表
 * @returns {Array} 联轴器规格列表
 */
export function getAllCouplingSpecs() {
  const specs = [];

  Object.entries(couplingSpecificationsMap).forEach(([model, spec]) => {
    // 过滤掉带J后缀的重复项
    if (!model.includes('J') || model.startsWith('HGTHJ')) {
      specs.push({
        model,
        ...spec,
        hasWithCover: !!couplingWithCoverMap[model]
      });
    }
  });

  // 按额定扭矩排序
  return specs.sort((a, b) => a.ratedTorque - b.ratedTorque);
}

/**
 * 验证映射的合理性
 * @param {Object} mapping - 单个映射
 * @returns {Object} 验证结果
 */
export function validateMapping(mapping) {
  const issues = [];

  if (!mapping.coupling.model) {
    issues.push('无联轴器映射');
  } else if (mapping.coupling.specifications) {
    const spec = mapping.coupling.specifications;
    // 检查扭矩是否足够
    if (mapping.maxTorque > spec.maxTorque) {
      issues.push(`联轴器扭矩不足: 需要${mapping.maxTorque}kN·m, 实际${spec.maxTorque}kN·m`);
    }
  }

  // 大型齿轮箱检查是否有备用泵
  if (mapping.maxPower > 300 && !mapping.pump.model) {
    issues.push('大功率齿轮箱缺少备用泵配置');
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

export default {
  generateMappingForGearbox,
  batchGenerateMappings,
  generateMappingCode,
  getAllCouplingSpecs,
  validateMapping
};
