// src/services/couplingSelectionService.js
// 联轴器选型服务 - 封装选型算法并提供简洁API

import { enhancedCouplingSelection } from '../utils/enhancedCouplingSelection';
import { flexibleCouplings } from '../data/flexibleCouplings';
import { couplingWorkFactorMap, getTemperatureFactor, getWorkFactor, WorkFactorMode, ScoringMode, getScoringWeights } from '../data/gearboxMatchingMaps';

/**
 * 工况选项配置
 */
export const WORK_CONDITIONS = [
  { value: "I类:扭矩稳定", label: "I类: 扭矩稳定 (K=1.3)", factor: 1.3 },
  { value: "II类:扭矩变化较小", label: "II类: 扭矩变化较小 (K=1.5)", factor: 1.5 },
  { value: "III类:扭矩变化中等", label: "III类: 扭矩变化中等 (K=1.75)", factor: 1.75 },
  { value: "IV类:扭矩变化较大", label: "IV类: 扭矩变化较大 (K=2.0)", factor: 2.0 },
  { value: "V类:扭矩变化剧烈", label: "V类: 扭矩变化剧烈 (K=2.25)", factor: 2.25 }
];

/**
 * 快速选型模板
 */
export const QUICK_TEMPLATES = [
  {
    id: 'small-fishing',
    name: '小型渔船',
    power: 150,
    speed: 1800,
    gearbox: 'HCM300A',
    condition: 'III类:扭矩变化中等',
    temperature: 30
  },
  {
    id: 'medium-trawler',
    name: '中型拖网船',
    power: 350,
    speed: 1500,
    gearbox: 'HCM400A',
    condition: 'IV类:扭矩变化较大',
    temperature: 35
  },
  {
    id: 'large-cargo',
    name: '大型运输船',
    power: 800,
    speed: 1200,
    gearbox: 'HCD800A',
    condition: 'II类:扭矩变化较小',
    temperature: 30
  },
  {
    id: 'workboat',
    name: '工作船',
    power: 250,
    speed: 1600,
    gearbox: 'HC400A',
    condition: 'III类:扭矩变化中等',
    temperature: 30
  }
];

/**
 * 计算发动机扭矩
 * @param {number} power 功率 (kW)
 * @param {number} speed 转速 (rpm)
 * @returns {number} 扭矩 (N·m)
 */
export const calculateEngineTorque = (power, speed) => {
  if (!power || !speed || speed <= 0) return 0;
  return (power * 9550) / speed;
};

/**
 * 计算所需联轴器扭矩
 * @param {number} engineTorque 发动机扭矩 (N·m)
 * @param {string} workCondition 工况条件
 * @param {number} temperature 环境温度 (°C)
 * @param {string} workFactorMode 工况系数模式 ('FACTORY' | 'JB_CCS')
 * @returns {Object} 计算结果
 */
export const calculateRequiredCouplingTorque = (engineTorque, workCondition, temperature = 30, workFactorMode = 'FACTORY') => {
  // 使用双模式工况系数: 厂家标准 或 JB/CCS船级社标准
  const kFactor = getWorkFactor(workCondition, workFactorMode);
  const stFactor = getTemperatureFactor(temperature);
  const requiredTorque_kNm = (engineTorque * kFactor * stFactor) / 1000;

  return {
    engineTorque,
    kFactor,
    stFactor,
    workFactorMode,
    requiredTorque_kNm,
    requiredTorque_Nm: engineTorque * kFactor * stFactor
  };
};

/**
 * 独立联轴器选型（不依赖齿轮箱选型结果）
 * @param {Object} params 选型参数
 * @returns {Object} 选型结果
 */
export const selectCouplingStandalone = (params) => {
  const {
    power,
    speed,
    gearboxModel,
    workCondition = 'III类:扭矩变化中等',
    workFactorMode = 'FACTORY',  // 工况系数模式: 'FACTORY' | 'JB_CCS'
    temperature = 30,
    hasCover = false,
    needDetachable = false
  } = params;

  // 验证必要参数
  if (!power || power <= 0) {
    return { success: false, message: '请输入有效的发动机功率', recommendations: [] };
  }
  if (!speed || speed <= 0) {
    return { success: false, message: '请输入有效的发动机转速', recommendations: [] };
  }

  // 计算扭矩 (传入workFactorMode)
  const engineTorque = calculateEngineTorque(power, speed);
  const torqueCalc = calculateRequiredCouplingTorque(engineTorque, workCondition, temperature, workFactorMode);

  // 构造模拟的齿轮箱选型结果
  const mockGearboxResult = {
    success: true,
    engineTorque,
    engineSpeed: speed,
    recommendations: gearboxModel ? [{ model: gearboxModel }] : [{ model: 'GENERIC' }]
  };

  // 调用增强版选型算法 (传入workFactorMode)
  const result = enhancedCouplingSelection(mockGearboxResult, flexibleCouplings, {
    workCondition,
    workFactorMode,
    temperature,
    hasCover,
    needDetachable
  });

  // 增强返回结果
  return {
    ...result,
    calculationDetails: {
      power,
      speed,
      engineTorque,
      kFactor: torqueCalc.kFactor,
      stFactor: torqueCalc.stFactor,
      workFactorMode: torqueCalc.workFactorMode,
      requiredTorque_kNm: torqueCalc.requiredTorque_kNm,
      gearboxModel: gearboxModel || '未指定'
    }
  };
};

/**
 * 基于齿轮箱选型结果进行联轴器选型
 * @param {Object} gearboxSelectionResult 齿轮箱选型结果
 * @param {Object} options 选型选项
 * @returns {Object} 选型结果
 */
export const selectCouplingFromGearbox = (gearboxSelectionResult, options = {}) => {
  return enhancedCouplingSelection(gearboxSelectionResult, flexibleCouplings, options);
};

/**
 * 获取联轴器系列信息
 * @param {string} model 联轴器型号
 * @returns {Object} 系列信息
 */
export const getCouplingSeriesInfo = (model) => {
  if (!model) return null;

  const seriesPatterns = {
    'HGTQ': { name: 'HGTQ系列', description: '高扭矩齿式联轴器，适用于中大马力齿轮箱', color: '#4299e1' },
    'HGTHB': { name: 'HGTHB系列', description: '适用于1000-2700系列齿轮箱', color: '#48bb78' },
    'HGTHJB': { name: 'HGTHJB系列', description: '带罩壳的联轴器', color: '#ed8936' },
    'HGTHT': { name: 'HGTHT系列', description: '适用于300-800系列齿轮箱', color: '#9f7aea' },
    'HGTL': { name: 'HGTL系列', description: '中小功率型', color: '#f56565' },
    'HGTLX': { name: 'HGTLX系列', description: '带过载保护', color: '#38b2ac' },
    'HGTH': { name: 'HGTH系列', description: '基础型', color: '#667eea' },
    'HGT': { name: 'HGT系列', description: '标准通用型', color: '#718096' }
  };

  for (const [prefix, info] of Object.entries(seriesPatterns)) {
    if (model.startsWith(prefix)) {
      return { ...info, prefix };
    }
  }

  return { name: '其他系列', description: '未分类联轴器', color: '#a0aec0', prefix: '' };
};

/**
 * 获取所有联轴器数据
 * @returns {Array} 联轴器数据数组
 */
export const getAllCouplings = () => flexibleCouplings;

/**
 * 按型号搜索联轴器
 * @param {string} keyword 搜索关键词
 * @returns {Array} 匹配的联轴器数组
 */
export const searchCouplings = (keyword) => {
  if (!keyword) return flexibleCouplings;
  const upperKeyword = keyword.toUpperCase();
  return flexibleCouplings.filter(c =>
    c.model.toUpperCase().includes(upperKeyword) ||
    (c.notes && c.notes.includes(keyword))
  );
};

/**
 * 获取联轴器详情
 * @param {string} model 联轴器型号
 * @returns {Object|null} 联轴器详情
 */
export const getCouplingByModel = (model) => {
  if (!model) return null;
  return flexibleCouplings.find(c => c.model === model) || null;
};

// 重新导出ScoringMode供其他组件使用
export { ScoringMode, getScoringWeights };

export default {
  selectCouplingStandalone,
  selectCouplingFromGearbox,
  calculateEngineTorque,
  calculateRequiredCouplingTorque,
  getCouplingSeriesInfo,
  getAllCouplings,
  searchCouplings,
  getCouplingByModel,
  WORK_CONDITIONS,
  QUICK_TEMPLATES,
  ScoringMode,
  getScoringWeights
};
