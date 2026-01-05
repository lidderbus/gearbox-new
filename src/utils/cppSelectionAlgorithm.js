// src/utils/cppSelectionAlgorithm.js
// CPP可调螺距螺旋桨系统选型算法

import { cppGearboxes, cppPropellers, oilDistributors, cppHydraulicUnits } from '../data/cppSystemData';

/**
 * CPP系统选型流程:
 * 1. 根据功率/转速/速比选择CPP齿轮箱
 * 2. 根据齿轮箱匹配调距桨
 * 3. 选配配油器
 * 4. 配置液压系统
 */

/**
 * 选择CPP齿轮箱
 * @param {number} power - 发动机功率 (kW)
 * @param {number} speed - 发动机转速 (rpm)
 * @param {number} targetRatio - 目标减速比
 * @param {Object} options - 选项 {series, maxResults, marginLimit}
 * @returns {Object} 选型结果
 */
export const selectCPPGearbox = (power, speed, targetRatio, options = {}) => {
  const {
    series = null, // 指定系列: GCS, GCST, GCD, GSH, GCC
    maxResults = 5,
    marginLimit = 200, // 余量上限% (允许较大余量，优先匹配)
    ratioTolerance = 20 // 速比容差% (增加容差提高匹配率)
  } = options;

  // 参数验证
  if (!power || power <= 0) return { success: false, message: '发动机功率必须大于0' };
  if (!speed || speed <= 0) return { success: false, message: '发动机转速必须大于0' };
  if (!targetRatio || targetRatio <= 0) return { success: false, message: '目标减速比必须大于0' };

  // 计算所需传递能力
  const requiredCapacity = power / speed;

  // 筛选齿轮箱
  let candidates = cppGearboxes;

  // 按系列筛选
  if (series) {
    candidates = candidates.filter(g => g.series === series);
  }

  const results = [];

  for (const gearbox of candidates) {
    // 检查转速范围
    const [minSpeed, maxSpeed] = gearbox.inputSpeedRange;
    if (speed < minSpeed || speed > maxSpeed) continue;

    // 检查功率范围
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

    // 检查传递能力
    if (capacity < requiredCapacity) continue;

    const margin = ((capacity - requiredCapacity) / requiredCapacity) * 100;
    if (margin > marginLimit) continue;

    // 计算输出转速
    const outputSpeed = speed / selectedRatio;

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
        ratioDiff: ((Math.abs(selectedRatio - targetRatio) / targetRatio) * 100).toFixed(1),
        outputSpeed: outputSpeed.toFixed(0)
      },
      score: 100 - margin - (Math.abs(selectedRatio - targetRatio) / targetRatio) * 20
    });
  }

  // 排序: 余量适中者优先
  results.sort((a, b) => b.score - a.score);

  return {
    success: results.length > 0,
    message: results.length > 0 ? `找到 ${results.length} 个匹配的CPP齿轮箱` : '未找到匹配的CPP齿轮箱',
    recommendations: results.slice(0, maxResults),
    inputParams: { power, speed, targetRatio }
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
