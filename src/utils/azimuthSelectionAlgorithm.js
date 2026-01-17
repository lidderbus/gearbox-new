// src/utils/azimuthSelectionAlgorithm.js
// 全回转舵桨选型算法

import { azimuthThrusters, slewingDrives, azimuthControlSystems } from '../data/azimuthThrusterData';

/**
 * 全回转推进器选型流程:
 * 1. 根据功率/推力需求选择推进器
 * 2. 匹配回转驱动单元
 * 3. 选择控制系统
 */

/**
 * 计算系泊拉力 (Bollard Pull)
 * 经验公式: BP ≈ 0.12 ~ 0.15 × Power (kN per kW)
 * @param {number} power - 功率 (kW)
 * @param {string} type - 推进器类型
 * @returns {number} 系泊拉力 (kN)
 */
export const calculateBollardPull = (power, type = 'z-drive') => {
  const coefficients = {
    'z-drive': 0.13,
    'l-drive': 0.12,
    'electric-pod': 0.14
  };
  const coef = coefficients[type] || 0.13;
  return power * coef;
};

/**
 * 根据船舶参数计算所需推力
 * @param {Object} vesselData - 船舶数据
 * @returns {number} 所需推力 (kN)
 */
export const calculateRequiredThrust = (vesselData) => {
  const {
    displacement = 0,      // 排水量 (t)
    length = 0,           // 船长 (m)
    breadth = 0,          // 船宽 (m)
    draft = 0,            // 吃水 (m)
    windArea = 0,         // 受风面积 (m²)
    windSpeed = 15,       // 设计风速 (m/s)
    currentSpeed = 1,     // 水流速度 (m/s)
    safetyFactor = 1.2    // 安全系数
  } = vesselData;

  // 风载荷计算 (简化公式)
  // F_wind = 0.5 × ρ × V² × A × C_d
  const airDensity = 1.225; // kg/m³
  const dragCoef = 1.2;
  const windForce = 0.5 * airDensity * Math.pow(windSpeed, 2) * windArea * dragCoef / 1000; // kN

  // 水流阻力 (简化)
  const waterDensity = 1025; // kg/m³
  const underwaterArea = length * draft * 0.7; // 估算水下受流面积
  const currentForce = 0.5 * waterDensity * Math.pow(currentSpeed, 2) * underwaterArea * 0.8 / 1000; // kN

  // 总需求推力
  const requiredThrust = (windForce + currentForce) * safetyFactor;

  return {
    windForce: windForce.toFixed(1),
    currentForce: currentForce.toFixed(1),
    totalRequired: requiredThrust.toFixed(1),
    safetyFactor
  };
};

/**
 * 选择全回转推进器
 * @param {Object} requirements - 需求参数
 * @param {Object} options - 选项
 * @returns {Object} 选型结果
 */
export const selectAzimuthThruster = (requirements, options = {}) => {
  const {
    power = null,           // 可用功率 (kW)
    thrust = null,          // 所需推力 (kN)
    propellerDiameter = null, // 期望螺旋桨直径 (m)
    immersionDepth = null,  // 可用浸没深度 (mm)
    application = null      // 应用场景
  } = requirements;

  const {
    series = null,  // 指定系列: ZP, LP, EP
    maxResults = 5,
    propellerType = null // FPP 或 CPP
  } = options;

  // 至少需要功率或推力其一
  if (!power && !thrust) {
    return { success: false, message: '请输入功率或推力需求' };
  }

  let candidates = [...azimuthThrusters];

  // 按系列筛选
  if (series) {
    candidates = candidates.filter(t => t.series === series);
  }

  // 按功率筛选
  if (power) {
    candidates = candidates.filter(t => {
      const [minP, maxP] = t.powerRange;
      return power >= minP && power <= maxP;
    });
  }

  // 按推力筛选
  if (thrust) {
    candidates = candidates.filter(t =>
      t.thrust.bollard >= thrust * 0.9 // 允许10%余量不足
    );
  }

  // 按螺旋桨直径筛选
  if (propellerDiameter) {
    candidates = candidates.filter(t => {
      const [minD, maxD] = t.propellerDiameter;
      return propellerDiameter >= minD && propellerDiameter <= maxD;
    });
  }

  // 按浸没深度筛选
  if (immersionDepth) {
    candidates = candidates.filter(t =>
      t.immersionDepth <= immersionDepth
    );
  }

  // 按应用场景筛选
  if (application) {
    const appFiltered = candidates.filter(t =>
      t.applications && t.applications.some(app =>
        app.includes(application) || application.includes(app)
      )
    );
    if (appFiltered.length > 0) candidates = appFiltered;
  }

  // 按螺旋桨类型筛选
  if (propellerType) {
    const typeFiltered = candidates.filter(t =>
      t.propellerType && t.propellerType.includes(propellerType)
    );
    if (typeFiltered.length > 0) candidates = typeFiltered;
  }

  // 评分排序
  const results = candidates.map(thruster => {
    let score = 100;

    // 功率匹配度
    if (power) {
      const [minP, maxP] = thruster.powerRange;
      const midP = (minP + maxP) / 2;
      const powerMatch = 1 - Math.abs(power - midP) / midP;
      score += powerMatch * 20;
    }

    // 推力余量
    if (thrust) {
      const margin = (thruster.thrust.bollard - thrust) / thrust;
      score += Math.min(margin * 10, 15); // 适度余量加分
    }

    // 效率加分
    score += (thruster.efficiency - 0.85) * 100;

    return {
      thruster,
      score,
      matchInfo: {
        thrustMargin: thrust ? (((thruster.thrust.bollard - thrust) / thrust) * 100).toFixed(1) : 'N/A',
        efficiency: (thruster.efficiency * 100).toFixed(1) + '%'
      }
    };
  });

  results.sort((a, b) => b.score - a.score);

  return {
    success: results.length > 0,
    message: results.length > 0 ? `找到 ${results.length} 个匹配的全回转推进器` : '未找到匹配的全回转推进器',
    recommendations: results.slice(0, maxResults),
    inputParams: requirements
  };
};

/**
 * 选择回转驱动单元
 * @param {Object} thruster - 选定的推进器
 * @returns {Object} 回转驱动选型结果
 */
export const selectSlewingDrive = (thruster) => {
  if (!thruster || !thruster.model) {
    return { success: false, message: '请先选择全回转推进器' };
  }

  const candidates = slewingDrives.filter(sd =>
    sd.applicableThrusters.includes(thruster.model)
  );

  return {
    success: candidates.length > 0,
    message: candidates.length > 0 ? `找到 ${candidates.length} 个匹配的回转驱动` : '未找到匹配的回转驱动',
    recommendations: candidates,
    thrusterModel: thruster.model
  };
};

/**
 * 选择控制系统
 * @param {Object} thruster - 选定的推进器
 * @param {string} dpLevel - DP等级 (Basic, DP1, DP2)
 * @returns {Object} 控制系统选型结果
 */
export const selectControlSystem = (thruster, dpLevel = 'Basic') => {
  if (!thruster || !thruster.model) {
    return { success: false, message: '请先选择全回转推进器' };
  }

  let candidates = azimuthControlSystems.filter(cs =>
    cs.applicableThrusters.includes(thruster.model)
  );

  // 按DP等级筛选
  if (dpLevel === 'DP1') {
    candidates = candidates.filter(cs =>
      cs.model.includes('DP1') || cs.model.includes('DP2')
    );
  } else if (dpLevel === 'DP2') {
    candidates = candidates.filter(cs => cs.model.includes('DP2'));
  }

  return {
    success: candidates.length > 0,
    message: candidates.length > 0 ? `找到 ${candidates.length} 个匹配的控制系统` : '未找到匹配的控制系统',
    recommendations: candidates,
    thrusterModel: thruster.model,
    dpLevel
  };
};

/**
 * 完整全回转系统选型
 * @param {Object} params - 选型参数
 * @returns {Object} 完整系统配置
 */
export const selectAzimuthSystem = (params) => {
  const { requirements, vesselData = {}, options = {}, dpLevel = 'Basic' } = params;

  // 如果有船舶数据，计算所需推力
  let thrustRequirement = requirements.thrust;
  if (!thrustRequirement && vesselData.windArea) {
    const calcResult = calculateRequiredThrust(vesselData);
    thrustRequirement = parseFloat(calcResult.totalRequired);
    requirements.thrust = thrustRequirement;
  }

  // 1. 选择推进器
  const thrusterResult = selectAzimuthThruster(requirements, options);
  if (!thrusterResult.success) {
    return { success: false, message: thrusterResult.message, step: 'thruster' };
  }

  const selectedThruster = thrusterResult.recommendations[0].thruster;

  // 2. 选择回转驱动
  const slewingResult = selectSlewingDrive(selectedThruster);

  // 3. 选择控制系统
  const controlResult = selectControlSystem(selectedThruster, dpLevel);

  // 计算总价
  const thrusterPrice = selectedThruster.marketPrice || 0;
  const slewingPrice = slewingResult.recommendations[0]?.marketPrice || 0;
  const controlPrice = controlResult.recommendations[0]?.marketPrice || 0;
  const totalPrice = thrusterPrice + slewingPrice + controlPrice;

  return {
    success: true,
    message: '全回转系统选型完成',
    system: {
      thruster: selectedThruster,
      slewingDrive: slewingResult.recommendations[0] || null,
      controlSystem: controlResult.recommendations[0] || null
    },
    allOptions: {
      thrusters: thrusterResult.recommendations,
      slewingDrives: slewingResult.recommendations,
      controlSystems: controlResult.recommendations
    },
    pricing: {
      thruster: thrusterPrice,
      slewingDrive: slewingPrice,
      controlSystem: controlPrice,
      total: totalPrice
    },
    inputParams: params
  };
};

export default {
  calculateBollardPull,
  calculateRequiredThrust,
  selectAzimuthThruster,
  selectSlewingDrive,
  selectControlSystem,
  selectAzimuthSystem
};
