// src/utils/thrusterSelectionAlgorithm.js
// 侧推器选型算法

import {
  electricThrusters,
  hydraulicThrusters,
  controllablePitchThrusters,
  retractableThrusters,
  thrusterControlSystems,
  thrusterHydraulicUnits
} from '../data/thrusterData';

/**
 * 侧推器选型流程:
 * 1. 根据船舶参数计算所需推力
 * 2. 选择适合的侧推器类型和型号
 * 3. 配置控制系统
 */

/**
 * 根据船舶参数计算侧推所需推力
 * @param {Object} vesselData - 船舶数据
 * @returns {Object} 计算结果
 */
export const calculateRequiredThrust = (vesselData) => {
  const {
    length = 0,           // 船长 (m)
    breadth = 0,          // 船宽 (m)
    draft = 0,            // 吃水 (m)
    displacement = 0,     // 排水量 (t)
    windArea = 0,         // 受风面积 (m²)
    windSpeed = 15,       // 设计风速 (m/s) - 通常取6级风
    safetyFactor = 1.3    // 安全系数
  } = vesselData;

  // 估算受风面积（如果未提供）
  const effectiveWindArea = windArea || (length * 3); // 简化估算

  // 风载荷计算
  // F = 0.5 × ρ × V² × A × Cd
  const airDensity = 1.225; // kg/m³
  const dragCoef = 1.1;     // 侧面受风阻力系数
  const windForce = 0.5 * airDensity * Math.pow(windSpeed, 2) * effectiveWindArea * dragCoef / 1000; // kN

  // 推力需求 = 风载荷 × 安全系数
  // 注：侧推主要用于低速靠离泊作业，主要抵抗风载荷
  const requiredThrust = windForce * safetyFactor;

  // 根据船长推荐侧推数量
  let recommendedCount = 1;
  if (length > 150) recommendedCount = 2;
  if (length > 250) recommendedCount = 3;

  // 单个侧推器推力
  const thrustPerThruster = requiredThrust / recommendedCount;

  return {
    windForce: windForce.toFixed(1),
    totalRequired: requiredThrust.toFixed(1),
    recommendedCount,
    thrustPerThruster: thrustPerThruster.toFixed(1),
    safetyFactor,
    assumptions: {
      windSpeed,
      effectiveWindArea: effectiveWindArea.toFixed(0)
    }
  };
};

/**
 * 根据功率估算推力
 * @param {number} power - 电机功率 (kW)
 * @param {string} type - 侧推类型
 * @returns {number} 估算推力 (kN)
 */
export const estimateThrustFromPower = (power, type = 'electric') => {
  // 经验系数: 推力(kN) ≈ 功率(kW) × 系数
  const coefficients = {
    'fixed-pitch-electric': 0.145,
    'controllable-pitch-electric': 0.155,
    'hydraulic': 0.135,
    'retractable': 0.14
  };
  const coef = coefficients[type] || 0.145;
  return power * coef;
};

/**
 * 选择侧推器
 * @param {Object} requirements - 需求参数
 * @param {Object} options - 选项
 * @returns {Object} 选型结果
 */
export const selectThruster = (requirements, options = {}) => {
  const {
    thrust = null,          // 所需推力 (kN)
    power = null,           // 可用功率 (kW)
    tunnelDiameter = null,  // 筒体直径限制 (mm)
    position = null,        // 安装位置: bow (艏) / stern (艉)
    voltage = null          // 电压 (V)
  } = requirements;

  const {
    type = null,    // 类型: electric, hydraulic, controllable-pitch, retractable
    series = null,  // 系列: TF, TH, TC, TR
    maxResults = 5
  } = options;

  // 至少需要推力或功率其一
  if (!thrust && !power) {
    return { success: false, message: '请输入推力或功率需求' };
  }

  // 合并所有侧推器数据
  let allThrusters = [];

  if (!type || type === 'electric') {
    allThrusters = allThrusters.concat(electricThrusters.map(t => ({ ...t, category: 'electric' })));
  }
  if (!type || type === 'hydraulic') {
    allThrusters = allThrusters.concat(hydraulicThrusters.map(t => ({ ...t, category: 'hydraulic' })));
  }
  if (!type || type === 'controllable-pitch') {
    allThrusters = allThrusters.concat(controllablePitchThrusters.map(t => ({ ...t, category: 'controllable-pitch' })));
  }
  if (!type || type === 'retractable') {
    allThrusters = allThrusters.concat(retractableThrusters.map(t => ({ ...t, category: 'retractable' })));
  }

  let candidates = allThrusters;

  // 按系列筛选
  if (series) {
    candidates = candidates.filter(t => t.series === series);
  }

  // 按推力筛选
  if (thrust) {
    candidates = candidates.filter(t =>
      t.thrust >= thrust * 0.85 && t.thrust <= thrust * 2.0
    );
  }

  // 按功率筛选
  if (power) {
    candidates = candidates.filter(t =>
      t.motorPower && t.motorPower >= power * 0.8 && t.motorPower <= power * 1.3
    );
  }

  // 按筒体直径筛选
  if (tunnelDiameter) {
    candidates = candidates.filter(t => {
      const td = t.tunnelInnerDiameter || t.tunnelDiameter;
      return td <= tunnelDiameter;
    });
  }

  // 按安装位置筛选
  if (position && position !== 'any') {
    candidates = candidates.filter(t =>
      !t.installPosition || t.installPosition.includes(position)
    );
  }

  // 按电压筛选
  if (voltage) {
    candidates = candidates.filter(t =>
      !t.motorVoltage || t.motorVoltage.includes(voltage)
    );
  }

  // 评分排序
  const results = candidates.map(thruster => {
    let score = 100;

    // 推力匹配度
    if (thrust) {
      const margin = (thruster.thrust - thrust) / thrust;
      if (margin >= 0 && margin <= 0.3) {
        score += 20 - margin * 30; // 适度余量最佳
      } else if (margin > 0.3) {
        score -= (margin - 0.3) * 20; // 过大余量扣分
      } else {
        score -= Math.abs(margin) * 50; // 推力不足大扣分
      }
    }

    // 功率匹配度
    if (power && thruster.motorPower) {
      const powerMatch = 1 - Math.abs(thruster.motorPower - power) / power;
      score += powerMatch * 15;
    }

    // 类型偏好 (电动优先于液压)
    if (thruster.category === 'electric') score += 5;

    return {
      thruster,
      score,
      matchInfo: {
        thrustMargin: thrust ? (((thruster.thrust - thrust) / thrust) * 100).toFixed(1) + '%' : 'N/A',
        category: thruster.category
      }
    };
  });

  results.sort((a, b) => b.score - a.score);

  return {
    success: results.length > 0,
    message: results.length > 0 ? `找到 ${results.length} 个匹配的侧推器` : '未找到匹配的侧推器',
    recommendations: results.slice(0, maxResults),
    inputParams: requirements
  };
};

/**
 * 选择侧推控制系统
 * @param {Object} thruster - 选定的侧推器
 * @param {number} count - 侧推器数量
 * @returns {Object} 控制系统选型结果
 */
export const selectThrusterControlSystem = (thruster, count = 1) => {
  if (!thruster || !thruster.model) {
    return { success: false, message: '请先选择侧推器' };
  }

  let candidates = thrusterControlSystems.filter(cs =>
    cs.applicableModels.some(m => thruster.model.startsWith(m.replace(/\d+$/, '')))
  );

  // 根据数量选择单/双控制系统
  if (count === 1) {
    const single = candidates.filter(cs => cs.model.includes('Single'));
    if (single.length > 0) candidates = single;
  } else if (count >= 2) {
    const dual = candidates.filter(cs => cs.model.includes('Dual') || cs.model.includes('DP'));
    if (dual.length > 0) candidates = dual;
  }

  return {
    success: candidates.length > 0,
    message: candidates.length > 0 ? `找到 ${candidates.length} 个匹配的控制系统` : '建议咨询专业人员',
    recommendations: candidates,
    thrusterModel: thruster.model,
    thrusterCount: count
  };
};

/**
 * 选择液压单元（用于液压侧推）
 * @param {Object} thruster - 选定的液压侧推器
 * @returns {Object} 液压单元选型结果
 */
export const selectThrusterHydraulicUnit = (thruster) => {
  if (!thruster || !thruster.model) {
    return { success: false, message: '请先选择侧推器' };
  }

  if (thruster.category !== 'hydraulic' && !thruster.series?.startsWith('TH')) {
    return { success: false, message: '该侧推器不需要液压单元' };
  }

  const candidates = thrusterHydraulicUnits.filter(hu =>
    hu.applicableModels.includes(thruster.model)
  );

  return {
    success: candidates.length > 0,
    message: candidates.length > 0 ? `找到 ${candidates.length} 个匹配的液压单元` : '未找到匹配的液压单元',
    recommendations: candidates,
    thrusterModel: thruster.model
  };
};

/**
 * 完整侧推系统选型
 * @param {Object} params - 选型参数
 * @returns {Object} 完整系统配置
 */
export const selectThrusterSystem = (params) => {
  const { requirements, vesselData = {}, options = {}, count = 1 } = params;

  // 如果有船舶数据，计算所需推力
  let thrustRequirement = requirements.thrust;
  if (!thrustRequirement && vesselData.length) {
    const calcResult = calculateRequiredThrust(vesselData);
    thrustRequirement = parseFloat(calcResult.thrustPerThruster);
    requirements.thrust = thrustRequirement;
  }

  // 1. 选择侧推器
  const thrusterResult = selectThruster(requirements, options);
  if (!thrusterResult.success) {
    return { success: false, message: thrusterResult.message, step: 'thruster' };
  }

  const selectedThruster = thrusterResult.recommendations[0].thruster;

  // 2. 选择控制系统
  const controlResult = selectThrusterControlSystem(selectedThruster, count);

  // 3. 如果是液压侧推，选择液压单元
  let hydraulicResult = { success: false, recommendations: [] };
  if (selectedThruster.category === 'hydraulic') {
    hydraulicResult = selectThrusterHydraulicUnit(selectedThruster);
  }

  // 计算总价
  const thrusterPrice = (selectedThruster.marketPrice || 0) * count;
  const controlPrice = controlResult.recommendations[0]?.marketPrice || 0;
  const hydraulicPrice = hydraulicResult.recommendations[0]?.marketPrice || 0;
  const totalPrice = thrusterPrice + controlPrice + hydraulicPrice;

  return {
    success: true,
    message: '侧推系统选型完成',
    system: {
      thruster: selectedThruster,
      count,
      controlSystem: controlResult.recommendations[0] || null,
      hydraulicUnit: hydraulicResult.recommendations[0] || null
    },
    allOptions: {
      thrusters: thrusterResult.recommendations,
      controlSystems: controlResult.recommendations,
      hydraulicUnits: hydraulicResult.recommendations
    },
    pricing: {
      thrusterUnit: selectedThruster.marketPrice || 0,
      thrusterTotal: thrusterPrice,
      controlSystem: controlPrice,
      hydraulicUnit: hydraulicPrice,
      total: totalPrice
    },
    inputParams: params
  };
};

export default {
  calculateRequiredThrust,
  estimateThrustFromPower,
  selectThruster,
  selectThrusterControlSystem,
  selectThrusterHydraulicUnit,
  selectThrusterSystem
};
