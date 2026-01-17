// src/utils/classificationCompliance.js
// 多船级社合规校核模块 v1.0
// 支持: CCS, DNV, LR, ABS, BV, RINA, NK, KR, ClassNK
// 更新日期: 2026-01-09

import { IACS_CLASSIFICATION_SOCIETIES, bladeMaterials } from '../data/cppSystemData';

// ============================================
// 各船级社规范差异定义
// ============================================

/**
 * 各船级社螺旋桨规范参数
 * 包含叶片强度计算方法、空泡标准、厚度系数等
 */
export const classificationRules = {
  CCS: {
    code: 'CCS',
    name: '中国船级社',
    fullName: 'China Classification Society',
    rulesVersion: 'CCS Rules 2024',
    bladeStrengthMethod: 'CCS_2024',
    cavitationStandard: 'CCS_RULES_CH4',
    // 叶片厚度系数 (t/D比)
    thicknessCoefficients: {
      r025: 0.140,  // 0.25R截面
      r035: 0.120,  // 0.35R截面
      r050: 0.095,  // 0.50R截面
      r060: 0.080,  // 0.60R截面
      r070: 0.065,  // 0.70R截面
      r080: 0.050,  // 0.80R截面
      r090: 0.035   // 0.90R截面
    },
    // 安全系数
    safetyFactors: {
      static: 1.5,
      fatigue: 2.0,
      ice: 2.5
    },
    // 空泡裕度要求
    cavitationMargin: 1.15,
    // 振动限值 (mm/s)
    vibrationLimits: {
      axial: 4.5,
      lateral: 7.1,
      torsional: 11.2
    },
    // 噪声限值 (dB)
    noiseLimits: {
      engineRoom: 110,
      accommodation: 60,
      bridge: 65
    }
  },

  DNV: {
    code: 'DNV',
    name: 'DNV-GL',
    fullName: 'Det Norske Veritas Germanischer Lloyd',
    rulesVersion: 'DNV Rules July 2025',
    bladeStrengthMethod: 'DNV_JULY_2025',
    cavitationStandard: 'DNV_PT4_CH4',
    thicknessCoefficients: {
      r025: 0.135,
      r035: 0.115,
      r050: 0.090,
      r060: 0.075,
      r070: 0.060,
      r080: 0.045,
      r090: 0.032
    },
    safetyFactors: {
      static: 1.5,
      fatigue: 1.8,
      ice: 2.3
    },
    cavitationMargin: 1.20,
    vibrationLimits: {
      axial: 4.0,
      lateral: 6.3,
      torsional: 10.0
    },
    noiseLimits: {
      engineRoom: 110,
      accommodation: 55,
      bridge: 60
    },
    // DNV特有: CLEAN DESIGN附加要求
    cleanDesign: {
      eediReduction: 10,  // 额外EEDI削减%
      noxTierIII: true
    }
  },

  LR: {
    code: 'LR',
    name: '劳氏船级社',
    fullName: "Lloyd's Register",
    rulesVersion: 'LR Rules 2024',
    bladeStrengthMethod: 'LR_RULES_2024',
    cavitationStandard: 'LR_PART_5_CH_2',
    thicknessCoefficients: {
      r025: 0.138,
      r035: 0.118,
      r050: 0.092,
      r060: 0.077,
      r070: 0.062,
      r080: 0.047,
      r090: 0.033
    },
    safetyFactors: {
      static: 1.5,
      fatigue: 1.9,
      ice: 2.4
    },
    cavitationMargin: 1.18,
    vibrationLimits: {
      axial: 4.2,
      lateral: 6.7,
      torsional: 10.6
    },
    noiseLimits: {
      engineRoom: 110,
      accommodation: 58,
      bridge: 63
    },
    // LR特有: EP (Environmental Protection) 附加要求
    epNotation: {
      ballastWater: true,
      oilyWater: 5  // ppm限值
    }
  },

  ABS: {
    code: 'ABS',
    name: '美国船级社',
    fullName: 'American Bureau of Shipping',
    rulesVersion: 'ABS Rules 2024',
    bladeStrengthMethod: 'ABS_RULES_2024',
    cavitationStandard: 'ABS_PART_4_CH_3',
    thicknessCoefficients: {
      r025: 0.142,
      r035: 0.122,
      r050: 0.096,
      r060: 0.081,
      r070: 0.066,
      r080: 0.051,
      r090: 0.036
    },
    safetyFactors: {
      static: 1.6,
      fatigue: 2.0,
      ice: 2.5
    },
    cavitationMargin: 1.15,
    vibrationLimits: {
      axial: 4.5,
      lateral: 7.1,
      torsional: 11.2
    },
    noiseLimits: {
      engineRoom: 110,
      accommodation: 60,
      bridge: 65
    },
    // ABS特有: ENVIRO+ 附加要求
    enviroPlus: {
      co2Monitoring: true,
      energyEfficiency: true
    }
  },

  BV: {
    code: 'BV',
    name: '法国船级社',
    fullName: 'Bureau Veritas',
    rulesVersion: 'BV Rules 2024',
    bladeStrengthMethod: 'BV_NR467_2024',
    cavitationStandard: 'BV_NR467_PT_C_CH_4',
    thicknessCoefficients: {
      r025: 0.137,
      r035: 0.117,
      r050: 0.091,
      r060: 0.076,
      r070: 0.061,
      r080: 0.046,
      r090: 0.032
    },
    safetyFactors: {
      static: 1.5,
      fatigue: 1.85,
      ice: 2.35
    },
    cavitationMargin: 1.17,
    vibrationLimits: {
      axial: 4.3,
      lateral: 6.8,
      torsional: 10.8
    },
    noiseLimits: {
      engineRoom: 110,
      accommodation: 57,
      bridge: 62
    }
  },

  RINA: {
    code: 'RINA',
    name: '意大利船级社',
    fullName: 'Registro Italiano Navale',
    rulesVersion: 'RINA Rules 2024',
    bladeStrengthMethod: 'RINA_2024',
    cavitationStandard: 'RINA_PART_C_CH_1',
    thicknessCoefficients: {
      r025: 0.136,
      r035: 0.116,
      r050: 0.090,
      r060: 0.075,
      r070: 0.060,
      r080: 0.045,
      r090: 0.031
    },
    safetyFactors: {
      static: 1.5,
      fatigue: 1.8,
      ice: 2.3
    },
    cavitationMargin: 1.16,
    vibrationLimits: {
      axial: 4.4,
      lateral: 7.0,
      torsional: 11.0
    },
    noiseLimits: {
      engineRoom: 110,
      accommodation: 58,
      bridge: 63
    }
  },

  NK: {
    code: 'NK',
    name: '日本海事协会',
    fullName: 'Nippon Kaiji Kyokai (ClassNK)',
    rulesVersion: 'NK Rules 2024',
    bladeStrengthMethod: 'NK_2024',
    cavitationStandard: 'NK_PART_D_CH_16',
    thicknessCoefficients: {
      r025: 0.139,
      r035: 0.119,
      r050: 0.093,
      r060: 0.078,
      r070: 0.063,
      r080: 0.048,
      r090: 0.034
    },
    safetyFactors: {
      static: 1.5,
      fatigue: 1.9,
      ice: 2.4
    },
    cavitationMargin: 1.18,
    vibrationLimits: {
      axial: 4.2,
      lateral: 6.6,
      torsional: 10.5
    },
    noiseLimits: {
      engineRoom: 110,
      accommodation: 56,
      bridge: 61
    },
    // NK特有: a-EMC (advanced machinery condition monitoring)
    aEMC: {
      vibrationMonitoring: true,
      oilAnalysis: true
    }
  },

  KR: {
    code: 'KR',
    name: '韩国船级社',
    fullName: 'Korean Register',
    rulesVersion: 'KR Rules 2024',
    bladeStrengthMethod: 'KR_2024',
    cavitationStandard: 'KR_PART_5_CH_4',
    thicknessCoefficients: {
      r025: 0.141,
      r035: 0.121,
      r050: 0.095,
      r060: 0.080,
      r070: 0.065,
      r080: 0.050,
      r090: 0.035
    },
    safetyFactors: {
      static: 1.5,
      fatigue: 2.0,
      ice: 2.5
    },
    cavitationMargin: 1.15,
    vibrationLimits: {
      axial: 4.5,
      lateral: 7.1,
      torsional: 11.2
    },
    noiseLimits: {
      engineRoom: 110,
      accommodation: 60,
      bridge: 65
    }
  },

  ClassNK: {
    code: 'ClassNK',
    name: 'ClassNK',
    fullName: 'Nippon Kaiji Kyokai',
    rulesVersion: 'ClassNK Rules 2024',
    bladeStrengthMethod: 'CLASSNK_2024',
    cavitationStandard: 'CLASSNK_PART_D',
    thicknessCoefficients: {
      r025: 0.139,
      r035: 0.119,
      r050: 0.093,
      r060: 0.078,
      r070: 0.063,
      r080: 0.048,
      r090: 0.034
    },
    safetyFactors: {
      static: 1.5,
      fatigue: 1.9,
      ice: 2.4
    },
    cavitationMargin: 1.18,
    vibrationLimits: {
      axial: 4.2,
      lateral: 6.6,
      torsional: 10.5
    },
    noiseLimits: {
      engineRoom: 110,
      accommodation: 56,
      bridge: 61
    }
  }
};

// ============================================
// 叶片强度校核
// ============================================

/**
 * 根据船级社规范校核叶片强度
 * @param {Object} propellerData - 螺旋桨数据
 * @param {string} society - 船级社代码
 * @returns {Object} 校核结果
 */
export const checkBladeStrength = (propellerData, society = 'CCS') => {
  const rules = classificationRules[society];
  if (!rules) {
    return { success: false, message: `未知船级社: ${society}` };
  }

  const {
    power,              // 功率 kW
    n,                  // 转速 rps
    D,                  // 直径 m
    Z = 4,              // 叶数
    material = 'NAB',   // 材料
    actualThickness = {}  // 实际厚度比 {r035, r060, ...}
  } = propellerData;

  // 获取材料参数
  const mat = bladeMaterials[material] || bladeMaterials['NAB'];
  const { safetyFactor: matSF, fatigueStrength } = mat;

  // 使用船级社规定的安全系数
  const sf = rules.safetyFactors.fatigue;

  // 计算各截面最小厚度
  const sections = {};
  const checkPoints = ['r035', 'r060'];  // 主要校核截面

  for (const point of checkPoints) {
    const K = rules.thicknessCoefficients[point] || 0.10;

    // 简化的厚度计算公式 (各船级社略有差异)
    // t/D >= K × (P/(n²×D⁴×Z×σf))^0.4 × SF
    const powerFactor = Math.pow(
      (power * 1000) / (n * n * Math.pow(D, 4) * Z * fatigueStrength),
      0.4
    );

    const minThickness = K * powerFactor * sf;
    const actual = actualThickness[point] || 0;
    const pass = actual >= minThickness;
    const margin = actual > 0 ? ((actual - minThickness) / minThickness * 100) : -100;

    sections[point] = {
      section: point.replace('r0', '0.') + 'R',
      minThickness: Math.round(minThickness * 10000) / 10000,
      actualThickness: actual,
      margin: Math.round(margin * 10) / 10,
      pass
    };
  }

  const allPass = Object.values(sections).every(s => s.pass);

  return {
    success: true,
    society: rules.code,
    societyName: rules.name,
    rulesVersion: rules.rulesVersion,
    method: rules.bladeStrengthMethod,
    material: mat.name,
    safetyFactor: sf,
    fatigueStrength,
    sections,
    pass: allPass,
    compliant: allPass,
    message: allPass
      ? `${rules.name}叶片强度校核通过`
      : `${rules.name}叶片强度校核不通过，请检查厚度设计`
  };
};

// ============================================
// 空泡校核
// ============================================

/**
 * 根据船级社规范校核空泡
 * @param {Object} params - 计算参数
 * @param {string} society - 船级社代码
 * @returns {Object} 校核结果
 */
export const checkCavitation = (params, society = 'CCS') => {
  const rules = classificationRules[society];
  if (!rules) {
    return { success: false, message: `未知船级社: ${society}` };
  }

  const {
    Va,                 // 进速 m/s
    n,                  // 转速 rps
    D,                  // 直径 m
    depth = 3,          // 桨轴沉深 m
    criticalSigma = 1.5 // 临界空泡数
  } = params;

  const SEAWATER_DENSITY = 1025;
  const ATMOSPHERIC_PRESSURE = 101325;
  const VAPOR_PRESSURE = 1700;
  const GRAVITY = 9.81;

  // 计算静水压力
  const p0 = ATMOSPHERIC_PRESSURE + SEAWATER_DENSITY * GRAVITY * depth;

  // 计算叶梢速度
  const tipSpeed = Math.PI * n * D;

  // 叶梢部位的相对来流速度
  const Vr = Math.sqrt(Va * Va + tipSpeed * tipSpeed);

  // 空泡数 sigma
  const sigma = (p0 - VAPOR_PRESSURE) / (0.5 * SEAWATER_DENSITY * Vr * Vr);

  // 使用船级社规定的裕度
  const marginFactor = rules.cavitationMargin;
  const requiredSigma = criticalSigma * marginFactor;
  const pass = sigma > requiredSigma;
  const margin = ((sigma - requiredSigma) / requiredSigma * 100);

  return {
    success: true,
    society: rules.code,
    societyName: rules.name,
    standard: rules.cavitationStandard,
    sigma: Math.round(sigma * 100) / 100,
    criticalSigma,
    marginFactor,
    requiredSigma: Math.round(requiredSigma * 100) / 100,
    pass,
    margin: Math.round(margin * 10) / 10,
    tipSpeed: Math.round(tipSpeed * 10) / 10,
    depth,
    message: pass
      ? `${rules.name}空泡校核通过，裕度 ${margin.toFixed(1)}%`
      : `${rules.name}空泡校核不通过，差距 ${Math.abs(margin).toFixed(1)}%`
  };
};

// ============================================
// 振动校核
// ============================================

/**
 * 根据船级社规范校核振动
 * @param {Object} vibrationData - 振动数据
 * @param {string} society - 船级社代码
 * @returns {Object} 校核结果
 */
export const checkVibration = (vibrationData, society = 'CCS') => {
  const rules = classificationRules[society];
  if (!rules) {
    return { success: false, message: `未知船级社: ${society}` };
  }

  const {
    axial = 0,      // 轴向振动 mm/s
    lateral = 0,    // 横向振动 mm/s
    torsional = 0   // 扭转振动 mm/s
  } = vibrationData;

  const limits = rules.vibrationLimits;

  const results = {
    axial: {
      measured: axial,
      limit: limits.axial,
      pass: axial <= limits.axial,
      margin: ((limits.axial - axial) / limits.axial * 100)
    },
    lateral: {
      measured: lateral,
      limit: limits.lateral,
      pass: lateral <= limits.lateral,
      margin: ((limits.lateral - lateral) / limits.lateral * 100)
    },
    torsional: {
      measured: torsional,
      limit: limits.torsional,
      pass: torsional <= limits.torsional,
      margin: ((limits.torsional - torsional) / limits.torsional * 100)
    }
  };

  const allPass = results.axial.pass && results.lateral.pass && results.torsional.pass;

  return {
    success: true,
    society: rules.code,
    societyName: rules.name,
    results,
    pass: allPass,
    compliant: allPass,
    message: allPass
      ? `${rules.name}振动校核通过`
      : `${rules.name}振动校核不通过`
  };
};

// ============================================
// 噪声校核
// ============================================

/**
 * 根据船级社规范校核噪声
 * @param {Object} noiseData - 噪声数据
 * @param {string} society - 船级社代码
 * @returns {Object} 校核结果
 */
export const checkNoiseLevel = (noiseData, society = 'CCS') => {
  const rules = classificationRules[society];
  if (!rules) {
    return { success: false, message: `未知船级社: ${society}` };
  }

  const {
    engineRoom = 0,
    accommodation = 0,
    bridge = 0
  } = noiseData;

  const limits = rules.noiseLimits;

  const results = {
    engineRoom: {
      measured: engineRoom,
      limit: limits.engineRoom,
      pass: engineRoom <= limits.engineRoom,
      margin: limits.engineRoom - engineRoom
    },
    accommodation: {
      measured: accommodation,
      limit: limits.accommodation,
      pass: accommodation <= limits.accommodation,
      margin: limits.accommodation - accommodation
    },
    bridge: {
      measured: bridge,
      limit: limits.bridge,
      pass: bridge <= limits.bridge,
      margin: limits.bridge - bridge
    }
  };

  const allPass = results.engineRoom.pass && results.accommodation.pass && results.bridge.pass;

  return {
    success: true,
    society: rules.code,
    societyName: rules.name,
    results,
    pass: allPass,
    compliant: allPass,
    message: allPass
      ? `${rules.name}噪声校核通过`
      : `${rules.name}噪声校核不通过`
  };
};

// ============================================
// 综合合规校核
// ============================================

/**
 * 完整船级社合规校核
 * @param {Object} propellerData - 螺旋桨完整数据
 * @param {string} society - 船级社代码
 * @returns {Object} 完整校核结果
 */
export const checkClassificationCompliance = (propellerData, society = 'CCS') => {
  const rules = classificationRules[society];
  if (!rules) {
    return { success: false, message: `未知船级社: ${society}` };
  }

  // 执行各项校核
  const bladeStrengthResult = checkBladeStrength(propellerData, society);
  const cavitationResult = propellerData.Va && propellerData.n && propellerData.D
    ? checkCavitation(propellerData, society)
    : { pass: true, message: '空泡校核跳过 (缺少参数)' };
  const vibrationResult = propellerData.vibration
    ? checkVibration(propellerData.vibration, society)
    : { pass: true, message: '振动校核跳过 (无测量数据)' };
  const noiseResult = propellerData.noise
    ? checkNoiseLevel(propellerData.noise, society)
    : { pass: true, message: '噪声校核跳过 (无测量数据)' };

  // 综合结果
  const allPass = bladeStrengthResult.pass &&
                  cavitationResult.pass &&
                  vibrationResult.pass &&
                  noiseResult.pass;

  return {
    success: true,
    society: rules.code,
    societyName: rules.name,
    societyFullName: rules.fullName,
    rulesVersion: rules.rulesVersion,
    checks: {
      bladeStrength: bladeStrengthResult,
      cavitation: cavitationResult,
      vibration: vibrationResult,
      noise: noiseResult
    },
    pass: allPass,
    compliant: allPass,
    summary: {
      total: 4,
      passed: [bladeStrengthResult, cavitationResult, vibrationResult, noiseResult].filter(r => r.pass).length,
      failed: [bladeStrengthResult, cavitationResult, vibrationResult, noiseResult].filter(r => !r.pass).length
    },
    message: allPass
      ? `${rules.name}全部校核通过`
      : `${rules.name}部分校核未通过，请检查详情`
  };
};

// ============================================
// 多船级社对比
// ============================================

/**
 * 对比多个船级社的校核结果
 * @param {Object} propellerData - 螺旋桨数据
 * @param {Array} societies - 船级社列表 (默认全部)
 * @returns {Object} 对比结果
 */
export const compareClassificationSocieties = (propellerData, societies = null) => {
  const societyList = societies || Object.keys(classificationRules);

  const results = {};
  const summary = {
    allPass: [],
    partialPass: [],
    allFail: []
  };

  for (const society of societyList) {
    const result = checkClassificationCompliance(propellerData, society);
    results[society] = result;

    if (result.pass) {
      summary.allPass.push(society);
    } else if (result.summary && result.summary.passed > 0) {
      summary.partialPass.push(society);
    } else {
      summary.allFail.push(society);
    }
  }

  return {
    success: true,
    propellerData,
    results,
    summary,
    recommendation: summary.allPass.length > 0
      ? `推荐船级社: ${summary.allPass.join(', ')}`
      : summary.partialPass.length > 0
        ? `部分通过船级社: ${summary.partialPass.join(', ')}，需改进设计`
        : '当前设计不满足任何船级社要求，需重新设计'
  };
};

// ============================================
// 认证状态检查
// ============================================

/**
 * 检查产品认证状态
 * @param {Object} certifications - 认证数据
 * @param {string} society - 船级社代码
 * @returns {Object} 认证状态
 */
export const checkCertificationStatus = (certifications, society = 'CCS') => {
  if (!certifications || !certifications[society]) {
    return {
      certified: false,
      society,
      message: `未获得${society}认证`
    };
  }

  const cert = certifications[society];
  const now = new Date();
  const validityDate = cert.validity ? new Date(cert.validity) : null;
  const isValid = validityDate ? validityDate > now : false;
  const daysRemaining = validityDate
    ? Math.ceil((validityDate - now) / (1000 * 60 * 60 * 24))
    : 0;

  return {
    certified: true,
    valid: isValid,
    society,
    certificate: cert.certificate || cert.class,
    notation: cert.notation,
    iceClass: cert.iceClass,
    validity: cert.validity,
    daysRemaining: isValid ? daysRemaining : 0,
    expiringSoon: isValid && daysRemaining <= 90,
    message: isValid
      ? `${society}认证有效，${daysRemaining}天后到期`
      : `${society}认证已过期或无效`
  };
};

/**
 * 获取所有船级社认证状态
 * @param {Object} certifications - 认证数据
 * @returns {Object} 所有认证状态
 */
export const getAllCertificationStatus = (certifications) => {
  const results = {};
  let validCount = 0;
  let expiringSoonCount = 0;

  for (const society of Object.keys(IACS_CLASSIFICATION_SOCIETIES)) {
    const status = checkCertificationStatus(certifications, society);
    results[society] = status;
    if (status.valid) validCount++;
    if (status.expiringSoon) expiringSoonCount++;
  }

  return {
    certifications: results,
    summary: {
      total: Object.keys(IACS_CLASSIFICATION_SOCIETIES).length,
      certified: Object.values(results).filter(r => r.certified).length,
      valid: validCount,
      expiringSoon: expiringSoonCount,
      expired: Object.values(results).filter(r => r.certified && !r.valid).length
    }
  };
};

// ============================================
// 导出
// ============================================

export default {
  // 规范数据
  classificationRules,

  // 校核功能
  checkBladeStrength,
  checkCavitation,
  checkVibration,
  checkNoiseLevel,
  checkClassificationCompliance,

  // 对比功能
  compareClassificationSocieties,

  // 认证检查
  checkCertificationStatus,
  getAllCertificationStatus
};
