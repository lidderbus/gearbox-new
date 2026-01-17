// src/utils/shaftSelectionAlgorithm.js
// 轴系配件选型算法

import {
  intermediateBearings,
  thrustBearings,
  sternTubeSeals,
  shaftCouplings,
  shaftFlanges
} from '../data/shaftSystemData';

/**
 * 轴系配件选型流程:
 * 1. 根据轴径选择中间轴承
 * 2. 根据推力选择推力轴承
 * 3. 根据轴径选择尾轴密封
 * 4. 根据扭矩选择联轴器
 * 5. 根据轴径选择法兰
 */

/**
 * 根据功率和转速计算轴扭矩
 * @param {number} power - 功率 (kW)
 * @param {number} speed - 转速 (rpm)
 * @returns {number} 扭矩 (kN.m)
 */
export const calculateShaftTorque = (power, speed) => {
  // T = 9550 × P / n (N.m)
  // 转换为 kN.m
  return (9550 * power) / speed / 1000;
};

/**
 * 估算推荐轴径
 * @param {number} power - 功率 (kW)
 * @param {number} speed - 转速 (rpm)
 * @param {number} safetyFactor - 安全系数 (默认1.0基于规范)
 * @returns {number} 推荐轴径 (mm)
 */
export const estimateShaftDiameter = (power, speed, safetyFactor = 1.0) => {
  // 根据船级社规范简化公式
  // d = C × (P / n)^(1/3)
  // C约为100-110 (取决于材料和应用)
  const C = 105;
  const diameter = C * Math.pow(power / speed, 1/3) * safetyFactor;
  return Math.ceil(diameter / 5) * 5; // 圆整到5mm
};

/**
 * 选择中间轴承
 * @param {Object} requirements - 需求参数
 * @param {Object} options - 选项
 * @returns {Object} 选型结果
 */
export const selectIntermediateBearing = (requirements, options = {}) => {
  const {
    shaftDiameter = null,  // 轴径 (mm)
    load = null,           // 载荷 (kN)
    speed = null           // 转速 (rpm)
  } = requirements;

  const {
    type = null,  // roller (滚动) / sliding (滑动)
    maxResults = 3
  } = options;

  if (!shaftDiameter) {
    return { success: false, message: '请输入轴径' };
  }

  let candidates = [...intermediateBearings];

  // 按类型筛选
  if (type) {
    candidates = candidates.filter(b => b.type === type);
  }

  // 按轴径筛选
  candidates = candidates.filter(b => {
    const [minD, maxD] = b.shaftDiameterRange;
    return shaftDiameter >= minD && shaftDiameter <= maxD;
  });

  // 按载荷筛选
  if (load) {
    candidates = candidates.filter(b => b.maxLoad >= load);
  }

  // 按转速筛选
  if (speed) {
    candidates = candidates.filter(b => b.maxSpeed >= speed);
  }

  // 评分排序
  const results = candidates.map(bearing => {
    let score = 100;

    // 轴径匹配度
    const [minD, maxD] = bearing.shaftDiameterRange;
    const midD = (minD + maxD) / 2;
    const diamMatch = 1 - Math.abs(shaftDiameter - midD) / midD;
    score += diamMatch * 20;

    // 载荷余量
    if (load) {
      const margin = (bearing.maxLoad - load) / load;
      score += Math.min(margin * 10, 15);
    }

    return {
      bearing,
      score,
      matchInfo: {
        loadMargin: load ? (((bearing.maxLoad - load) / load) * 100).toFixed(1) + '%' : 'N/A'
      }
    };
  });

  results.sort((a, b) => b.score - a.score);

  return {
    success: results.length > 0,
    message: results.length > 0 ? `找到 ${results.length} 个匹配的中间轴承` : '未找到匹配的中间轴承',
    recommendations: results.slice(0, maxResults),
    inputParams: requirements
  };
};

/**
 * 选择推力轴承
 * @param {Object} requirements - 需求参数
 * @param {Object} options - 选项
 * @returns {Object} 选型结果
 */
export const selectThrustBearing = (requirements, options = {}) => {
  const {
    thrust = null,         // 推力 (kN)
    shaftDiameter = null,  // 轴径 (mm)
    speed = null           // 转速 (rpm)
  } = requirements;

  const { maxResults = 3 } = options;

  if (!thrust && !shaftDiameter) {
    return { success: false, message: '请输入推力或轴径' };
  }

  let candidates = [...thrustBearings];

  // 按推力筛选
  if (thrust) {
    candidates = candidates.filter(b => {
      const [minT, maxT] = b.thrustRange;
      return thrust >= minT * 0.8 && thrust <= maxT;
    });
  }

  // 按轴径筛选
  if (shaftDiameter) {
    candidates = candidates.filter(b => {
      const [minD, maxD] = b.shaftDiameterRange;
      return shaftDiameter >= minD && shaftDiameter <= maxD;
    });
  }

  // 按转速筛选
  if (speed) {
    candidates = candidates.filter(b => b.maxSpeed >= speed);
  }

  // 评分排序
  const results = candidates.map(bearing => {
    let score = 100;

    if (thrust) {
      const [, maxT] = bearing.thrustRange;
      const margin = (maxT - thrust) / thrust;
      score += Math.min(margin * 15, 20);
    }

    return {
      bearing,
      score,
      matchInfo: {
        thrustCapacity: bearing.thrustRange.join(' - ') + ' kN'
      }
    };
  });

  results.sort((a, b) => b.score - a.score);

  return {
    success: results.length > 0,
    message: results.length > 0 ? `找到 ${results.length} 个匹配的推力轴承` : '未找到匹配的推力轴承 (通常由齿轮箱内置)',
    recommendations: results.slice(0, maxResults),
    inputParams: requirements
  };
};

/**
 * 选择尾轴密封
 * @param {Object} requirements - 需求参数
 * @param {Object} options - 选项
 * @returns {Object} 选型结果
 */
export const selectSternTubeSeal = (requirements, options = {}) => {
  const {
    shaftDiameter = null   // 轴径 (mm)
  } = requirements;

  const {
    type = null,  // lip-seal / mechanical-seal
    maxResults = 3
  } = options;

  if (!shaftDiameter) {
    return { success: false, message: '请输入轴径' };
  }

  let candidates = [...sternTubeSeals];

  // 按类型筛选
  if (type) {
    candidates = candidates.filter(s => s.type === type);
  }

  // 按轴径筛选
  candidates = candidates.filter(s => {
    const [minD, maxD] = s.shaftDiameterRange;
    return shaftDiameter >= minD && shaftDiameter <= maxD;
  });

  // 评分排序
  const results = candidates.map(seal => {
    let score = 100;

    // 类型偏好 (机械密封加分)
    if (seal.type === 'mechanical-seal') score += 10;

    // 轴径匹配度
    const [minD, maxD] = seal.shaftDiameterRange;
    const midD = (minD + maxD) / 2;
    score += (1 - Math.abs(shaftDiameter - midD) / midD) * 15;

    return {
      seal,
      score,
      matchInfo: {
        type: seal.type === 'lip-seal' ? '唇形密封' : '机械密封',
        sealRings: seal.sealRings || 'N/A'
      }
    };
  });

  results.sort((a, b) => b.score - a.score);

  return {
    success: results.length > 0,
    message: results.length > 0 ? `找到 ${results.length} 个匹配的尾轴密封` : '未找到匹配的尾轴密封',
    recommendations: results.slice(0, maxResults),
    inputParams: requirements
  };
};

/**
 * 选择轴联轴器
 * @param {Object} requirements - 需求参数
 * @param {Object} options - 选项
 * @returns {Object} 选型结果
 */
export const selectShaftCoupling = (requirements, options = {}) => {
  const {
    shaftDiameter = null,  // 轴径 (mm)
    torque = null,         // 扭矩 (kN.m)
    speed = null           // 转速 (rpm)
  } = requirements;

  const {
    type = null,  // rigid / disc
    maxResults = 3
  } = options;

  if (!shaftDiameter && !torque) {
    return { success: false, message: '请输入轴径或扭矩' };
  }

  let candidates = [...shaftCouplings];

  // 按类型筛选
  if (type) {
    candidates = candidates.filter(c => c.type === type);
  }

  // 按轴径筛选
  if (shaftDiameter) {
    candidates = candidates.filter(c => {
      const [minD, maxD] = c.shaftDiameterRange;
      return shaftDiameter >= minD && shaftDiameter <= maxD;
    });
  }

  // 按扭矩筛选
  if (torque) {
    candidates = candidates.filter(c => c.maxTorque >= torque);
  }

  // 按转速筛选
  if (speed) {
    candidates = candidates.filter(c => c.maxSpeed >= speed);
  }

  // 评分排序
  const results = candidates.map(coupling => {
    let score = 100;

    // 扭矩余量
    if (torque) {
      const margin = (coupling.maxTorque - torque) / torque;
      score += Math.min(margin * 10, 15);
    }

    return {
      coupling,
      score,
      matchInfo: {
        type: coupling.type === 'rigid' ? '刚性' : '膜片',
        torqueCapacity: coupling.maxTorque + ' kN.m'
      }
    };
  });

  results.sort((a, b) => b.score - a.score);

  return {
    success: results.length > 0,
    message: results.length > 0 ? `找到 ${results.length} 个匹配的联轴器` : '未找到匹配的联轴器',
    recommendations: results.slice(0, maxResults),
    inputParams: requirements
  };
};

/**
 * 选择法兰
 * @param {number} shaftDiameter - 轴径 (mm)
 * @returns {Object} 法兰选型结果
 */
export const selectShaftFlange = (shaftDiameter) => {
  if (!shaftDiameter) {
    return { success: false, message: '请输入轴径' };
  }

  // 法兰通常按轴径直接匹配
  const candidates = shaftFlanges.filter(f =>
    Math.abs(f.shaftDiameter - shaftDiameter) <= 10 // 允许10mm误差
  );

  return {
    success: candidates.length > 0,
    message: candidates.length > 0 ? `找到 ${candidates.length} 个匹配的法兰` : '未找到匹配的法兰',
    recommendations: candidates,
    inputParams: { shaftDiameter }
  };
};

/**
 * 完整轴系配件选型
 * @param {Object} params - 选型参数
 * @returns {Object} 完整配置
 */
export const selectShaftSystem = (params) => {
  const {
    power = null,
    speed = null,
    thrust = null,
    shaftDiameter = null,
    options = {}
  } = params;

  // 估算轴径（如果未提供）
  let effectiveShaftDiameter = shaftDiameter;
  if (!effectiveShaftDiameter && power && speed) {
    effectiveShaftDiameter = estimateShaftDiameter(power, speed);
  }

  if (!effectiveShaftDiameter) {
    return { success: false, message: '请提供轴径或功率/转速参数' };
  }

  // 计算扭矩
  const torque = power && speed ? calculateShaftTorque(power, speed) : null;

  // 1. 选择中间轴承
  const bearingResult = selectIntermediateBearing({
    shaftDiameter: effectiveShaftDiameter,
    speed
  }, options.bearing);

  // 2. 选择推力轴承（可选，通常齿轮箱内置）
  const thrustBearingResult = selectThrustBearing({
    thrust,
    shaftDiameter: effectiveShaftDiameter,
    speed
  });

  // 3. 选择尾轴密封
  const sealResult = selectSternTubeSeal({
    shaftDiameter: effectiveShaftDiameter
  }, options.seal);

  // 4. 选择联轴器
  const couplingResult = selectShaftCoupling({
    shaftDiameter: effectiveShaftDiameter,
    torque,
    speed
  }, options.coupling);

  // 5. 选择法兰
  const flangeResult = selectShaftFlange(effectiveShaftDiameter);

  // 计算总价
  const bearingPrice = bearingResult.recommendations[0]?.bearing?.marketPrice || 0;
  const sealPrice = sealResult.recommendations[0]?.seal?.marketPrice || 0;
  const couplingPrice = couplingResult.recommendations[0]?.coupling?.marketPrice || 0;
  const flangePrice = flangeResult.recommendations[0]?.marketPrice || 0;
  const totalPrice = bearingPrice + sealPrice + couplingPrice + flangePrice;

  return {
    success: true,
    message: '轴系配件选型完成',
    calculatedParams: {
      shaftDiameter: effectiveShaftDiameter,
      torque: torque?.toFixed(2)
    },
    system: {
      intermediateBearing: bearingResult.recommendations[0]?.bearing || null,
      thrustBearing: thrustBearingResult.recommendations[0]?.bearing || null,
      sternTubeSeal: sealResult.recommendations[0]?.seal || null,
      shaftCoupling: couplingResult.recommendations[0]?.coupling || null,
      shaftFlange: flangeResult.recommendations[0] || null
    },
    allOptions: {
      intermediateBearings: bearingResult.recommendations,
      thrustBearings: thrustBearingResult.recommendations,
      sternTubeSeals: sealResult.recommendations,
      shaftCouplings: couplingResult.recommendations,
      shaftFlanges: flangeResult.recommendations
    },
    pricing: {
      intermediateBearing: bearingPrice,
      sternTubeSeal: sealPrice,
      shaftCoupling: couplingPrice,
      shaftFlange: flangePrice,
      total: totalPrice
    },
    inputParams: params
  };
};

export default {
  calculateShaftTorque,
  estimateShaftDiameter,
  selectIntermediateBearing,
  selectThrustBearing,
  selectSternTubeSeal,
  selectShaftCoupling,
  selectShaftFlange,
  selectShaftSystem
};
