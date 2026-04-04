// src/data/couplingDynamicData.js
// 联轴器动态特性数据库 - 用于扭振分析
// 数据来源: coupling-selection-enhanced.html (杭州前进联轴器)

const couplingDynamicData = {
  'HGTL': {
    staticStiffness: 280,
    dynamicStiffness: 350,
    dampingCoefficient: 0.08,
    inertia: 0.015,
    compensation: { axial: 3, radial: 1.0, angular: 1.0 },
    rubberType: 'NBR丁腈橡胶',
    tempRange: '-20°C ~ +60°C',
    fatigueLife: 20000,
    hardness: '55±5 Shore A'
  },
  'HGTH': {
    staticStiffness: 450,
    dynamicStiffness: 580,
    dampingCoefficient: 0.10,
    inertia: 0.025,
    compensation: { axial: 4, radial: 1.5, angular: 1.5 },
    rubberType: 'CR氯丁橡胶',
    tempRange: '-30°C ~ +80°C',
    fatigueLife: 25000,
    hardness: '60±5 Shore A'
  },
  'HGTHB': {
    staticStiffness: 900,
    dynamicStiffness: 1160,
    dampingCoefficient: 0.10,
    inertia: 0.035,
    compensation: { axial: 4, radial: 1.5, angular: 1.5 },
    rubberType: 'CR氯丁橡胶',
    tempRange: '-30°C ~ +80°C',
    fatigueLife: 25000,
    hardness: '60±5 Shore A'
  },
  'HGTHJB': {
    staticStiffness: 500,
    dynamicStiffness: 650,
    dampingCoefficient: 0.12,
    inertia: 0.030,
    compensation: { axial: 3, radial: 1.2, angular: 1.2 },
    rubberType: '耐热CR氯丁橡胶',
    tempRange: '-30°C ~ +80°C',
    fatigueLife: 25000,
    hardness: '62±5 Shore A'
  },
  'HGTQ': {
    staticStiffness: 600,
    dynamicStiffness: 780,
    dampingCoefficient: 0.12,
    inertia: 0.040,
    compensation: { axial: 5, radial: 2.0, angular: 2.0 },
    rubberType: 'NR天然橡胶',
    tempRange: '-20°C ~ +60°C',
    fatigueLife: 30000,
    hardness: '50±5 Shore A'
  },
  'HGT': {
    staticStiffness: 1200,
    dynamicStiffness: 1500,
    dampingCoefficient: 0.15,
    inertia: 0.080,
    compensation: { axial: 6, radial: 2.5, angular: 2.0 },
    rubberType: 'NR天然橡胶',
    tempRange: '-20°C ~ +60°C',
    fatigueLife: 30000,
    hardness: '50±5 Shore A'
  },
  'HGTLX': {
    staticStiffness: 320,
    dynamicStiffness: 400,
    dampingCoefficient: 0.09,
    inertia: 0.018,
    compensation: { axial: 3.5, radial: 1.2, angular: 1.0 },
    rubberType: 'NBR丁腈橡胶',
    tempRange: '-20°C ~ +60°C',
    fatigueLife: 20000,
    hardness: '55±5 Shore A'
  }
};

/**
 * 获取联轴器动态特性数据
 * @param {string} model - 联轴器型号
 * @returns {object|null} 动态特性数据
 */
export const getCouplingDynamicData = (model) => {
  if (!model) return null;
  const prefixes = ['HGTHJB', 'HGTHB', 'HGTLX', 'HGTQ', 'HGTH', 'HGTL', 'HGT'];
  for (const prefix of prefixes) {
    if (model.startsWith(prefix)) {
      return couplingDynamicData[prefix] || null;
    }
  }
  return null;
};

/**
 * 根据额定扭矩调整刚度
 */
export const adjustStiffnessByTorque = (baseData, ratedTorque) => {
  if (!baseData || !ratedTorque) return baseData;
  const scaleFactor = Math.sqrt(ratedTorque / 5.0);
  return {
    ...baseData,
    staticStiffness: Math.round(baseData.staticStiffness * scaleFactor),
    dynamicStiffness: Math.round(baseData.dynamicStiffness * scaleFactor),
    inertia: +(baseData.inertia * scaleFactor).toFixed(4)
  };
};

export default couplingDynamicData;
