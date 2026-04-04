// src/utils/cppSelectionAlgorithm.js
// CPP可调螺距螺旋桨系统选型算法

import { cppGearboxes, cppPropellers, oilDistributors, cppHydraulicUnits } from '../data/cppSystemData';

/**
 * CPP系统选型流程:
 * 1. 根据功率/转速/速比选择CPP齿轮箱 (6维加权评分)
 * 2. 根据齿轮箱匹配调距桨
 * 3. 选配配油器
 * 4. 配置液压系统
 */

// CPP选型评分权重 (6维，总计100分)
const CPP_SCORING_WEIGHTS = {
  powerMatch: 30,           // 功率/容量匹配
  ratioMatch: 20,           // 速比匹配
  thrustVerify: 15,         // 推力验证
  certificationMatch: 15,   // 船级社认证匹配
  energyEfficiency: 10,     // 能效评分 (EEXI贡献)
  cavitationProtection: 10  // 空泡防护评分
};

/**
 * 计算数据完整度 (0-1)
 */
const calcDataCompleteness = (gearbox) => {
  const fields = ['thrust', 'certifications', 'energyEfficiency', 'cavitationPrevention', 'smartMonitoring', 'weight'];
  const present = fields.filter(f => gearbox[f] != null).length;
  return parseFloat((present / fields.length).toFixed(2));
};

/**
 * 选择CPP齿轮箱 (6维加权评分)
 * @param {number} power - 发动机功率 (kW)
 * @param {number} speed - 发动机转速 (rpm)
 * @param {number} targetRatio - 目标减速比
 * @param {Object} options - 选项
 * @returns {Object} 选型结果
 */
export const selectCPPGearbox = (power, speed, targetRatio, options = {}) => {
  const {
    series = null,
    maxResults = 5,
    marginLimit = 200,
    ratioTolerance = 20,
    thrustRequirement = 0,
    classificationSociety = null,  // 指定船级社: CCS, DNV, LR, ABS 等
  } = options;

  const W = CPP_SCORING_WEIGHTS;

  // 参数验证
  if (!power || power <= 0) return { success: false, message: '发动机功率必须大于0' };
  if (!speed || speed <= 0) return { success: false, message: '发动机转速必须大于0' };
  if (!targetRatio || targetRatio <= 0) return { success: false, message: '目标减速比必须大于0' };

  const requiredCapacity = power / speed;

  let candidates = cppGearboxes;
  if (series) {
    candidates = candidates.filter(g => g.series === series);
  }

  const results = [];

  for (const gearbox of candidates) {
    // 硬过滤: 转速范围
    const [minSpeed, maxSpeed] = gearbox.inputSpeedRange;
    if (speed < minSpeed || speed > maxSpeed) continue;

    // 硬过滤: 功率上限
    if (power > gearbox.maxPower) continue;

    // 找最佳减速比
    let bestRatioIndex = -1;
    let minRatioDiff = Infinity;

    gearbox.ratios.forEach((ratio, index) => {
      const diff = Math.abs(ratio - targetRatio);
      const diffPercent = (diff / targetRatio) * 100;
      if (diffPercent <= ratioTolerance && diff < minRatioDiff) {
        minRatioDiff = diff;
        bestRatioIndex = index;
      }
    });

    if (bestRatioIndex === -1) continue;

    const selectedRatio = gearbox.ratios[bestRatioIndex];
    const capacity = gearbox.transferCapacity[bestRatioIndex];

    if (capacity < requiredCapacity) continue;

    const margin = ((capacity - requiredCapacity) / requiredCapacity) * 100;
    if (margin > marginLimit) continue;

    const ratioDiffPercent = (Math.abs(selectedRatio - targetRatio) / targetRatio) * 100;
    const outputSpeed = speed / selectedRatio;

    // ===== 6维评分 =====
    let score = 0;
    const warnings = [];

    // 1. 功率/容量匹配 (30分) — 余量10-30%满分
    if (margin >= 10 && margin <= 30) score += W.powerMatch;
    else if (margin > 30 && margin <= 60) score += W.powerMatch * 0.8;
    else if (margin > 60) score += W.powerMatch * 0.5;
    else if (margin >= 5 && margin < 10) score += W.powerMatch * 0.6;
    else score += W.powerMatch * 0.3;

    // 2. 速比匹配 (20分) — 偏差<5%满分
    if (ratioDiffPercent <= 5) score += W.ratioMatch;
    else if (ratioDiffPercent <= 10) score += W.ratioMatch * 0.8;
    else if (ratioDiffPercent <= 15) score += W.ratioMatch * 0.5;
    else score += W.ratioMatch * 0.2;

    // 3. 推力验证 (15分)
    if (thrustRequirement > 0 && typeof gearbox.thrust === 'number') {
      if (gearbox.thrust >= thrustRequirement) {
        score += W.thrustVerify;
      } else if (gearbox.thrust >= thrustRequirement * 0.8) {
        score += W.thrustVerify * 0.3;
        warnings.push(`推力偏低: ${gearbox.thrust}kN / 需求 ${thrustRequirement}kN`);
      } else {
        warnings.push(`推力严重不足: ${gearbox.thrust}kN / 需求 ${thrustRequirement}kN (安全风险)`);
      }
    } else if (thrustRequirement <= 0) {
      score += W.thrustVerify * 0.5; // 无需求给50%基准分
    } else {
      warnings.push('推力数据缺失，无法验证');
    }

    // 4. 船级社认证匹配 (15分)
    if (classificationSociety && gearbox.certifications) {
      const cert = gearbox.certifications[classificationSociety];
      if (cert && cert.certificate) {
        score += W.certificationMatch;
      } else {
        // 检查是否有其他船级社认证
        const hasCert = Object.values(gearbox.certifications).some(c => c && c.certificate);
        if (hasCert) {
          score += W.certificationMatch * 0.4;
          warnings.push(`无${classificationSociety}认证，但有其他船级社认证`);
        } else {
          warnings.push(`无任何船级社认证记录`);
        }
      }
    } else if (!classificationSociety) {
      score += W.certificationMatch * 0.5; // 无指定时给50%基准分
    }

    // 5. 能效评分 (10分)
    if (gearbox.energyEfficiency) {
      const ee = gearbox.energyEfficiency;
      if (ee.eexiCompliant) score += W.energyEfficiency * 0.7;
      if (ee.ciiImpact === 'positive') score += W.energyEfficiency * 0.3;
    } else {
      score += W.energyEfficiency * 0.3; // 无数据给基准分
    }

    // 6. 空泡防护评分 (10分)
    if (gearbox.cavitationPrevention) {
      const cp = gearbox.cavitationPrevention;
      if (cp.technology === 'pressurePores' || cp.technology === 'composite') {
        score += W.cavitationProtection;
      } else if (cp.technology === 'coating') {
        score += W.cavitationProtection * 0.7;
      } else {
        score += W.cavitationProtection * 0.5; // standard
      }
    } else {
      score += W.cavitationProtection * 0.3;
    }

    // 数据完整度和置信度
    const dataCompleteness = calcDataCompleteness(gearbox);
    const confidenceLevel = dataCompleteness >= 0.8 ? '高' : dataCompleteness >= 0.5 ? '中' : '低';

    results.push({
      gearbox: {
        ...gearbox,
        selectedRatio,
        selectedCapacity: capacity
      },
      matchInfo: {
        requiredCapacity: requiredCapacity.toFixed(4),
        actualCapacity: capacity.toFixed(4),
        margin: margin.toFixed(1),
        ratioDiff: ratioDiffPercent.toFixed(1),
        outputSpeed: outputSpeed.toFixed(0)
      },
      score: Math.max(0, Math.min(100, Math.round(score))),
      dataCompleteness,
      confidenceLevel,
      warnings
    });
  }

  results.sort((a, b) => b.score - a.score);

  return {
    success: results.length > 0,
    message: results.length > 0
      ? `找到 ${results.length} 个匹配的CPP齿轮箱 (6维评分)`
      : '未找到匹配的CPP齿轮箱',
    recommendations: results.slice(0, maxResults),
    inputParams: { power, speed, targetRatio, thrustRequirement, classificationSociety },
    scoringWeights: W
  };
};

/**
 * 根据齿轮箱选择调距桨
 * @param {Object} gearbox - 选定的齿轮箱
 * @param {Object} vesselData - 船舶数据 {propellerDiameter, bladeCount, type}
 * @returns {Object} 调距桨选型结果
 */
export const selectCPPPropeller = (gearbox, vesselData = {}) => {
  const {
    propellerDiameter = null,
    bladeCount = 4,
    type = null // heavy-duty, general, high-speed
  } = vesselData;

  if (!gearbox || !gearbox.model) {
    return { success: false, message: '请先选择CPP齿轮箱' };
  }

  // 获取齿轮箱可匹配的调距桨
  const applicableModels = gearbox.applicablePropellers || [];

  let candidates = cppPropellers.filter(p =>
    applicableModels.includes(p.model)
  );

  // 按类型筛选
  if (type) {
    const typeFiltered = candidates.filter(p => p.type === type);
    if (typeFiltered.length > 0) candidates = typeFiltered;
  }

  // 按螺旋桨直径筛选
  if (propellerDiameter) {
    candidates = candidates.filter(p => {
      const [minD, maxD] = p.diameterRange;
      return propellerDiameter >= minD && propellerDiameter <= maxD;
    });
  }

  // 按叶片数筛选
  if (bladeCount) {
    const bladeFiltered = candidates.filter(p => p.bladeCount.includes(bladeCount));
    if (bladeFiltered.length > 0) candidates = bladeFiltered;
  }

  // 检查功率匹配
  if (gearbox.maxPower) {
    candidates = candidates.filter(p => p.maxPower >= gearbox.maxPower * 0.7);
  }

  return {
    success: candidates.length > 0,
    message: candidates.length > 0 ? `找到 ${candidates.length} 个匹配的调距桨` : '未找到匹配的调距桨',
    recommendations: candidates,
    gearboxModel: gearbox.model
  };
};

/**
 * 选择配油器
 * @param {Object} gearbox - 选定的齿轮箱
 * @returns {Object} 配油器选型结果
 */
export const selectOilDistributor = (gearbox) => {
  if (!gearbox || !gearbox.model) {
    return { success: false, message: '请先选择CPP齿轮箱' };
  }

  const candidates = oilDistributors.filter(od =>
    od.applicableGearboxes.includes(gearbox.model)
  );

  return {
    success: candidates.length > 0,
    message: candidates.length > 0 ? `找到 ${candidates.length} 个匹配的配油器` : '未找到匹配的配油器',
    recommendations: candidates,
    gearboxModel: gearbox.model
  };
};

/**
 * 选择液压单元
 * @param {Object} gearbox - 选定的齿轮箱
 * @returns {Object} 液压单元选型结果
 */
export const selectHydraulicUnit = (gearbox) => {
  if (!gearbox || !gearbox.model) {
    return { success: false, message: '请先选择CPP齿轮箱' };
  }

  const candidates = cppHydraulicUnits.filter(hpu =>
    hpu.applicableGearboxes.includes(gearbox.model)
  );

  return {
    success: candidates.length > 0,
    message: candidates.length > 0 ? `找到 ${candidates.length} 个匹配的液压单元` : '未找到匹配的液压单元',
    recommendations: candidates,
    gearboxModel: gearbox.model
  };
};

/**
 * 完整CPP系统选型
 * @param {Object} params - 选型参数
 * @returns {Object} 完整系统配置
 */
export const selectCPPSystem = (params) => {
  const { power, speed, targetRatio, vesselData = {}, options = {} } = params;

  // 1. 选择齿轮箱
  const gearboxResult = selectCPPGearbox(power, speed, targetRatio, options);
  if (!gearboxResult.success) {
    return { success: false, message: gearboxResult.message, step: 'gearbox' };
  }

  const selectedGearbox = gearboxResult.recommendations[0].gearbox;

  // 2. 选择调距桨
  const propellerResult = selectCPPPropeller(selectedGearbox, vesselData);

  // 3. 选择配油器
  const oilDistributorResult = selectOilDistributor(selectedGearbox);

  // 4. 选择液压单元
  const hydraulicResult = selectHydraulicUnit(selectedGearbox);

  // 计算总价
  const gearboxPrice = selectedGearbox.marketPrice || 0;
  const propellerPrice = propellerResult.recommendations[0]?.marketPrice || 0;
  const oilDistributorPrice = oilDistributorResult.recommendations[0]?.marketPrice || 0;
  const hydraulicPrice = hydraulicResult.recommendations[0]?.marketPrice || 0;
  const totalPrice = gearboxPrice + propellerPrice + oilDistributorPrice + hydraulicPrice;

  return {
    success: true,
    message: 'CPP系统选型完成',
    system: {
      gearbox: selectedGearbox,
      propeller: propellerResult.recommendations[0] || null,
      oilDistributor: oilDistributorResult.recommendations[0] || null,
      hydraulicUnit: hydraulicResult.recommendations[0] || null
    },
    allOptions: {
      gearboxes: gearboxResult.recommendations,
      propellers: propellerResult.recommendations,
      oilDistributors: oilDistributorResult.recommendations,
      hydraulicUnits: hydraulicResult.recommendations
    },
    pricing: {
      gearbox: gearboxPrice,
      propeller: propellerPrice,
      oilDistributor: oilDistributorPrice,
      hydraulicUnit: hydraulicPrice,
      total: totalPrice
    },
    inputParams: { power, speed, targetRatio }
  };
};

export default {
  selectCPPGearbox,
  selectCPPPropeller,
  selectOilDistributor,
  selectHydraulicUnit,
  selectCPPSystem
};
