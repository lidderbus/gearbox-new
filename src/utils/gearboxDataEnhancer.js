/**
 * 齿轮箱数据增强工具
 * 为杭齿产品添加缺失的功率范围、交期、质保等字段
 *
 * @module gearboxDataEnhancer
 * @version 1.0.0
 * @date 2026-01-06
 */

/**
 * 根据传递能力和转速范围计算功率范围
 * 公式: 功率 = 传递能力 × 转速
 *
 * @param {Array|number} capacities - 传递能力数组或单值
 * @param {Array} speedRange - 转速范围 [min, max]
 * @returns {Object} { minPower, maxPower }
 */
export const calculatePowerRange = (capacities, speedRange) => {
  const speeds = speedRange || [1000, 2000];

  if (!capacities || (Array.isArray(capacities) && capacities.length === 0)) {
    return { minPower: null, maxPower: null };
  }

  let minCapacity, maxCapacity;

  if (Array.isArray(capacities)) {
    // 过滤掉无效值
    const validCapacities = capacities.filter(c => typeof c === 'number' && c > 0);
    if (validCapacities.length === 0) {
      return { minPower: null, maxPower: null };
    }
    minCapacity = Math.min(...validCapacities);
    maxCapacity = Math.max(...validCapacities);
  } else if (typeof capacities === 'number' && capacities > 0) {
    minCapacity = maxCapacity = capacities;
  } else {
    return { minPower: null, maxPower: null };
  }

  // 计算功率范围
  // minPower = 最小传递能力 × 最小转速
  // maxPower = 最大传递能力 × 最大转速
  const minPower = Math.round(minCapacity * speeds[0]);
  const maxPower = Math.round(maxCapacity * speeds[1]);

  return { minPower, maxPower };
};

/**
 * 从型号名称提取产品系列
 * @param {string} model - 型号名称
 * @returns {string} 系列名称
 */
const extractSeriesFromModel = (model) => {
  if (!model) return 'OTHER';
  const m = String(model).toUpperCase();

  // 按优先级匹配系列前缀
  const seriesPatterns = [
    { prefix: 'GCST', series: 'GCST' },  // 先匹配更长的
    { prefix: 'GCS', series: 'GCS' },
    { prefix: 'GCD', series: 'GCD' },
    { prefix: 'GC', series: 'GC' },
    { prefix: 'GWC', series: 'GWC' },
    { prefix: 'GWH', series: 'GWH' },
    { prefix: 'GWD', series: 'GWD' },
    { prefix: 'GWK', series: 'GWK' },
    { prefix: 'GWL', series: 'GWL' },
    { prefix: 'GWS', series: 'GWS' },
    { prefix: 'GW', series: 'GW' },
    { prefix: 'HCM', series: 'HCM' },
    { prefix: 'HCD', series: 'HCD' },
    { prefix: 'HCT', series: 'HCT' },
    { prefix: 'HCQ', series: 'HCQ' },
    { prefix: 'HCA', series: 'HCA' },
    { prefix: 'HCV', series: 'HCV' },
    { prefix: 'HCL', series: 'HCL' },
    { prefix: 'HCS', series: 'HCS' },
    { prefix: 'HCG', series: 'HCG' },
    { prefix: 'HC', series: 'HC' },
    { prefix: 'DT', series: 'DT' },
    { prefix: 'MA', series: 'MA' },
    { prefix: 'MB', series: 'MB' },
    { prefix: 'MV', series: 'MV' },
    { prefix: 'SGW', series: 'SGW' },
  ];

  for (const { prefix, series } of seriesPatterns) {
    if (m.startsWith(prefix)) {
      return series;
    }
  }

  // 尝试提取数字前的字母部分
  const match = m.match(/^([A-Z]+)/);
  return match ? match[1] : 'OTHER';
};

/**
 * 增强齿轮箱数据
 * 为每个产品添加:
 * - series: 从型号名称提取的产品系列
 * - minPower/maxPower: 功率范围 (根据传递能力推算)
 * - speedRange: 统一的转速范围字段名
 * - powerRange: 功率范围数组形式
 * - deliveryWeeks: 交货周期 (默认6周)
 * - warrantyMonths: 质保期 (默认18个月)
 *
 * @param {Array} gearboxData - 原始齿轮箱数据数组
 * @returns {Array} 增强后的数据数组
 */
export const enhanceGearboxData = (gearboxData) => {
  if (!Array.isArray(gearboxData)) {
    console.warn('enhanceGearboxData: 输入数据不是数组');
    return [];
  }

  return gearboxData.map(g => {
    if (!g) return g;

    // 获取传递能力 (优先使用 transmissionCapacityPerRatio)
    const capacities = g.transmissionCapacityPerRatio || g.transferCapacity || [];

    // 获取转速范围
    const speeds = g.inputSpeedRange || g.speedRange || [1000, 2000];

    // 计算功率范围
    const { minPower, maxPower } = calculatePowerRange(capacities, speeds);

    return {
      ...g,
      // 产品系列 (从型号名称提取)
      series: g.series || extractSeriesFromModel(g.model),
      // 功率范围 (推算)
      minPower: g.minPower ?? minPower,
      maxPower: g.maxPower ?? maxPower,
      // 统一字段名 (便于与竞品数据对比)
      speedRange: speeds,
      powerRange: [minPower, maxPower],
      // 补充缺失字段 (杭齿默认值)
      deliveryWeeks: g.deliveryWeeks ?? 6,
      warrantyMonths: g.warrantyMonths ?? 18,
      // 厂商标识 (便于对比时区分)
      manufacturer: g.manufacturer || 'HANGCHI',
      // 标记数据来源
      _powerEstimated: !g.minPower || !g.maxPower,
      _enhanced: true
    };
  });
};

/**
 * 获取功率显示文本
 * 处理缺失值情况
 *
 * @param {Object} product - 产品对象
 * @returns {string} 格式化的功率范围文本
 */
export const formatPowerRange = (product) => {
  if (!product) return '-';

  const min = product.minPower;
  const max = product.maxPower;

  if (min == null && max == null) return '-';
  if (min == null) return `≤${max}kW`;
  if (max == null) return `≥${min}kW`;
  if (min === max) return `${min}kW`;

  return `${min}-${max}kW`;
};

/**
 * 带评分的杭齿产品选型
 * 根据功率、转速、速比筛选产品，并计算富裕度和评分
 *
 * @param {Array} gearboxData - 增强后的齿轮箱数据
 * @param {number} power - 功率 kW
 * @param {number} speed - 转速 rpm
 * @param {number} targetRatio - 目标速比
 * @returns {Array} 带评分的匹配结果，按评分降序排列
 */
export const selectHangchiWithScore = (gearboxData, power, speed, targetRatio) => {
  if (!Array.isArray(gearboxData) || !power || !speed || !targetRatio) {
    console.log('[selectHangchiWithScore] 参数无效:', {
      isArray: Array.isArray(gearboxData),
      dataLength: gearboxData?.length,
      power, speed, targetRatio
    });
    return [];
  }

  const requiredCapacity = power / speed;
  console.log('[selectHangchiWithScore] 开始选型:', {
    输入功率: power,
    输入转速: speed,
    目标速比: targetRatio,
    所需传递能力: requiredCapacity.toFixed(4),
    数据条数: gearboxData.length
  });

  // 调试：检查前3个产品的数据结构
  if (gearboxData.length > 0) {
    console.log('[selectHangchiWithScore] 示例数据:', gearboxData.slice(0, 3).map(g => ({
      model: g?.model,
      ratios: g?.ratios?.slice(0, 3),
      transferCapacity: g?.transferCapacity?.slice(0, 3),
      transmissionCapacityPerRatio: g?.transmissionCapacityPerRatio?.slice?.(0, 3)
    })));
  }

  let debugRatioFail = 0;
  let debugCapacityFail = 0;
  let debugPass = 0;

  const results = gearboxData.map(g => {
    if (!g || !g.ratios || g.ratios.length === 0) return null;

    // 1. 速比匹配 - 找最接近的速比
    const ratioMatch = g.ratios.reduce((best, r, idx) => {
      const diff = Math.abs(r - targetRatio) / targetRatio;
      if (diff < best.diff) return { ratio: r, idx, diff };
      return best;
    }, { ratio: null, idx: -1, diff: Infinity });

    // 速比容差 10%
    if (!ratioMatch.ratio || ratioMatch.diff > 0.10) {
      debugRatioFail++;
      return null;
    }

    // 2. 获取对应速比的传递能力
    const capacityArr = g.transmissionCapacityPerRatio || g.transferCapacity || [];
    let capacity = 0;

    if (Array.isArray(capacityArr)) {
      // 优先使用匹配索引的值
      if (ratioMatch.idx >= 0 && ratioMatch.idx < capacityArr.length) {
        capacity = capacityArr[ratioMatch.idx] || 0;
      } else if (capacityArr.length > 0) {
        // 索引越界时使用最小值（最保守估计）
        const validValues = capacityArr.filter(v => typeof v === 'number' && v > 0);
        capacity = validValues.length > 0 ? Math.min(...validValues) : 0;
        console.warn(`[selectHangchiWithScore] ${g.model}: 索引${ratioMatch.idx}越界(数组长度${capacityArr.length}), 使用保守值${capacity}`);
      }
    } else if (typeof capacityArr === 'number' && capacityArr > 0) {
      capacity = capacityArr;
    }

    // 传递能力必须 >= 所需值，且有效
    if (capacity <= 0 || capacity < requiredCapacity) {
      debugCapacityFail++;
      if (debugCapacityFail <= 5) {
        console.log(`[selectHangchiWithScore] 传递能力不足: ${g.model} 速比${ratioMatch.ratio} 能力${capacity.toFixed(4)} < 需${requiredCapacity.toFixed(4)}`);
      }
      return null;
    }

    debugPass++;

    // 3. 计算富裕度 (增加分母检查防止除零)
    if (requiredCapacity <= 0 || !Number.isFinite(requiredCapacity)) {
      console.warn(`[selectHangchiWithScore] 无效所需传递能力: ${requiredCapacity}`);
      return null;
    }
    const margin = ((capacity - requiredCapacity) / requiredCapacity) * 100;
    if (!Number.isFinite(margin)) {
      console.warn(`[selectHangchiWithScore] 富裕度计算异常: ${g.model} margin=${margin}`);
      return null;
    }

    // 4. 综合评分 (0-100分, 带边界保护)
    // - 富裕度评分 (50分): 10%富裕度最理想
    // - 速比评分 (30分): 精确匹配得满分
    // - 价格评分 (20分): 有价格数据加分
    const marginScore = Math.max(0, 50 - Math.abs(margin - 10) * 2);
    const ratioScore = Math.max(0, (1 - ratioMatch.diff / 0.10) * 30);
    const priceScore = g.price ? 20 : 0;
    // 边界保护：确保评分在0-100范围内
    const totalScore = Math.max(0, Math.min(100, marginScore + ratioScore + priceScore));

    return {
      ...g,
      matchedRatio: ratioMatch.ratio,
      matchedCapacity: capacity,
      requiredCapacity,
      margin: margin.toFixed(1),
      ratioDiff: (ratioMatch.diff * 100).toFixed(1),
      score: Math.round(totalScore)
    };
  }).filter(Boolean);

  console.log('[selectHangchiWithScore] 筛选结果:', {
    速比不匹配: debugRatioFail,
    传递能力不足: debugCapacityFail,
    通过筛选: debugPass
  });

  // 按评分降序排列
  return results.sort((a, b) => b.score - a.score);
};

export default {
  enhanceGearboxData,
  calculatePowerRange,
  formatPowerRange,
  selectHangchiWithScore
};
