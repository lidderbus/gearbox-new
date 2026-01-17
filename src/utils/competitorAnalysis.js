/**
 * 竞品对比分析工具
 * Competitor Analysis Utilities
 *
 * 提供杭齿产品与竞争对手(重齿/南高精/ZF)的对比分析功能
 */

import {
  competitors,
  competitorProducts,
  hangchiAdvantages,
  comparisonDimensions
} from '../data/competitorData';

/**
 * 根据杭齿型号查找对标竞品
 * @param {string} hangchiModel - 杭齿型号 (如 "HCD400")
 * @returns {Array} 对标竞品列表
 */
export const findEquivalentCompetitors = (hangchiModel) => {
  if (!hangchiModel) return [];

  // 直接匹配
  const directMatches = competitorProducts.filter(
    p => p.equivalentHangchi === hangchiModel
  );

  // 如果没有直接匹配，尝试模糊匹配
  if (directMatches.length === 0) {
    // 提取型号中的数字部分
    const powerMatch = hangchiModel.match(/\d+/);
    if (powerMatch) {
      const powerLevel = parseInt(powerMatch[0]);
      return competitorProducts.filter(p => {
        const compPowerMatch = p.model.match(/\d+/);
        if (compPowerMatch) {
          const compPower = parseInt(compPowerMatch[0]);
          // 功率级别相近 (±30%)
          return Math.abs(compPower - powerLevel) / powerLevel <= 0.3;
        }
        return false;
      });
    }
  }

  return directMatches;
};

/**
 * 根据工况参数选型竞品
 * @param {number} power - 功率 (kW)
 * @param {number} speed - 转速 (rpm)
 * @param {number} targetRatio - 目标速比
 * @param {string} manufacturer - 可选，指定厂商 (CZCG/NGC/ZF)
 * @returns {Array} 符合条件的竞品列表
 */
export const selectCompetitorProducts = (power, speed, targetRatio, manufacturer = null) => {
  let candidates = competitorProducts;

  // 按厂商筛选
  if (manufacturer) {
    candidates = candidates.filter(p => p.manufacturer === manufacturer);
  }

  // 按工况参数筛选
  const results = candidates.filter(p => {
    // 功率范围检查
    if (power < p.powerRange[0] || power > p.powerRange[1]) return false;

    // 转速范围检查
    if (speed < p.speedRange[0] || speed > p.speedRange[1]) return false;

    // 速比匹配检查 (容差10%)
    const hasMatchingRatio = p.ratios.some(r =>
      Math.abs(r - targetRatio) / targetRatio <= 0.10
    );
    if (!hasMatchingRatio) return false;

    // 传递能力检查
    const requiredCapacity = power / speed;
    if (p.transferCapacity < requiredCapacity) return false;

    return true;
  });

  // 按传递能力余量排序
  const requiredCapacity = speed > 0 ? power / speed : 0;
  return results.map(p => {
    const tc = parseFloat(p.transferCapacity) || 0;
    const marginVal = requiredCapacity > 0 ? ((tc - requiredCapacity) / requiredCapacity * 100) : 0;
    return {
      ...p,
      margin: isFinite(marginVal) ? marginVal.toFixed(1) : '0.0',
      matchedRatio: p.ratios && p.ratios.length > 0 ? p.ratios.reduce((best, r) =>
        Math.abs(r - targetRatio) < Math.abs(best - targetRatio) ? r : best
      ) : targetRatio
    };
  }).sort((a, b) => parseFloat(a.margin) - parseFloat(b.margin));
};

/**
 * 计算杭齿产品相对于竞品的优势
 * @param {Object} hangchiProduct - 杭齿产品
 * @param {Object} competitor - 竞品
 * @returns {Object} 优势分析结果
 */
export const calculateAdvantages = (hangchiProduct, competitor) => {
  const advantages = {
    priceAdvantage: null,
    deliveryAdvantage: null,
    capacityAdvantage: null,
    weightAdvantage: null,
    warrantyAdvantage: null,
    overallScore: 0,
    highlights: []
  };

  // 价格优势
  const hPrice = parseFloat(hangchiProduct.price) || 0;
  const cPrice = parseFloat(competitor.estimatedPrice) || 0;
  if (hPrice > 0 && cPrice > 0) {
    const priceDiff = cPrice - hPrice;
    const pricePercentVal = (priceDiff / cPrice * 100);
    const pricePercent = isFinite(pricePercentVal) ? pricePercentVal.toFixed(1) : '0.0';
    advantages.priceAdvantage = {
      diff: priceDiff,
      percent: pricePercent,
      isAdvantage: priceDiff > 0
    };
    if (priceDiff > 0) {
      advantages.highlights.push(`价格优惠 ${pricePercent}%`);
      advantages.overallScore += 2;
    }
  }

  // 交期优势
  const hangchiDelivery = hangchiAdvantages.deliveryAdvantage.hangchiWeeks;
  if (competitor.deliveryWeeks) {
    const deliveryDiff = competitor.deliveryWeeks - hangchiDelivery;
    advantages.deliveryAdvantage = {
      diff: deliveryDiff,
      hangchiWeeks: hangchiDelivery,
      competitorWeeks: competitor.deliveryWeeks,
      isAdvantage: deliveryDiff > 0
    };
    if (deliveryDiff > 0) {
      advantages.highlights.push(`交期快 ${deliveryDiff} 周`);
      advantages.overallScore += 1.5;
    }
  }

  // 传递能力优势
  const hCapacity = parseFloat(hangchiProduct.transferCapacity) || 0;
  const cCapacity = parseFloat(competitor.transferCapacity) || 0;
  if (hCapacity > 0 && cCapacity > 0) {
    const capacityDiff = hCapacity - cCapacity;
    const capacityPercentVal = (capacityDiff / cCapacity * 100);
    const capacityPercent = isFinite(capacityPercentVal) ? capacityPercentVal.toFixed(1) : '0.0';
    advantages.capacityAdvantage = {
      diff: capacityDiff,
      percent: capacityPercent,
      isAdvantage: capacityDiff > 0
    };
    if (capacityDiff > 0) {
      advantages.highlights.push(`传递能力高 ${capacityPercent}%`);
      advantages.overallScore += 1;
    }
  }

  // 重量优势 (越轻越好)
  const hWeight = parseFloat(hangchiProduct.weight) || 0;
  const cWeight = parseFloat(competitor.weight) || 0;
  if (hWeight > 0 && cWeight > 0) {
    const weightDiff = cWeight - hWeight;
    const weightPercentVal = (weightDiff / cWeight * 100);
    const weightPercent = isFinite(weightPercentVal) ? weightPercentVal.toFixed(1) : '0.0';
    advantages.weightAdvantage = {
      diff: weightDiff,
      percent: weightPercent,
      isAdvantage: weightDiff > 0
    };
    if (weightDiff > 0) {
      advantages.highlights.push(`重量轻 ${weightPercent}%`);
      advantages.overallScore += 0.5;
    }
  }

  // 质保优势
  const hangchiWarranty = hangchiAdvantages.warrantyAdvantage.hangchiMonths;
  if (competitor.warrantyMonths) {
    const warrantyDiff = hangchiWarranty - competitor.warrantyMonths;
    advantages.warrantyAdvantage = {
      diff: warrantyDiff,
      hangchiMonths: hangchiWarranty,
      competitorMonths: competitor.warrantyMonths,
      isAdvantage: warrantyDiff > 0
    };
    if (warrantyDiff > 0) {
      advantages.highlights.push(`质保长 ${warrantyDiff} 个月`);
      advantages.overallScore += 0.5;
    }
  }

  // 本地服务优势 (默认加分)
  advantages.serviceAdvantage = {
    responseTime: hangchiAdvantages.serviceAdvantage.responseTime,
    servicePoints: hangchiAdvantages.serviceAdvantage.servicePoints,
    isAdvantage: true
  };
  advantages.highlights.push(`全国${hangchiAdvantages.serviceAdvantage.servicePoints}个服务网点`);
  advantages.overallScore += 1;

  return advantages;
};

/**
 * 生成对比报告数据
 * @param {Object} hangchiProduct - 杭齿产品
 * @param {Array} competitorList - 竞品列表
 * @returns {Object} 对比报告数据
 */
export const generateComparisonReport = (hangchiProduct, competitorList) => {
  const report = {
    hangchiProduct,
    competitors: [],
    summary: {
      totalAdvantages: 0,
      keyPoints: [],
      recommendation: ''
    }
  };

  competitorList.forEach(comp => {
    const advantages = calculateAdvantages(hangchiProduct, comp);
    report.competitors.push({
      product: comp,
      manufacturer: competitors[comp.manufacturer],
      advantages
    });
    report.summary.totalAdvantages += advantages.highlights.length;
  });

  // 生成推荐语
  if (report.summary.totalAdvantages >= 5) {
    report.summary.recommendation = '杭齿产品在价格、交期、服务等多方面具有明显优势，强烈推荐选用';
  } else if (report.summary.totalAdvantages >= 3) {
    report.summary.recommendation = '杭齿产品性价比优势明显，建议优先考虑';
  } else {
    report.summary.recommendation = '杭齿产品可作为备选方案';
  }

  // 汇总关键优势
  const allHighlights = report.competitors.flatMap(c => c.advantages.highlights);
  const highlightCounts = {};
  allHighlights.forEach(h => {
    highlightCounts[h] = (highlightCounts[h] || 0) + 1;
  });
  report.summary.keyPoints = Object.entries(highlightCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([point]) => point);

  return report;
};

/**
 * 获取厂商简介
 * @param {string} manufacturerId - 厂商ID (CZCG/NGC/ZF/HANGCHI)
 * @returns {Object} 厂商信息
 */
export const getManufacturerInfo = (manufacturerId) => {
  return competitors[manufacturerId] || null;
};

/**
 * 获取所有厂商列表
 * @returns {Array} 厂商列表
 */
export const getAllManufacturers = () => {
  return Object.entries(competitors).map(([id, info]) => ({
    id,
    ...info
  }));
};

/**
 * 按系列分组竞品
 * @param {string} manufacturer - 厂商ID
 * @returns {Object} 按系列分组的产品
 */
export const getProductsBySeries = (manufacturer = null) => {
  let products = competitorProducts;
  if (manufacturer) {
    products = products.filter(p => p.manufacturer === manufacturer);
  }

  const grouped = {};
  products.forEach(p => {
    const key = `${p.manufacturer}-${p.series}`;
    if (!grouped[key]) {
      grouped[key] = {
        manufacturer: p.manufacturer,
        manufacturerName: competitors[p.manufacturer]?.name || p.manufacturer,
        series: p.series,
        products: []
      };
    }
    grouped[key].products.push(p);
  });

  return Object.values(grouped);
};

/**
 * 获取对比维度配置
 * @returns {Object} 对比维度
 */
export const getComparisonDimensions = () => comparisonDimensions;

/**
 * 格式化价格显示
 * @param {number} price - 价格
 * @returns {string} 格式化后的价格
 */
export const formatPrice = (price) => {
  if (!price) return '-';
  return `¥${price.toLocaleString()}`;
};

/**
 * 格式化交期显示
 * @param {number} weeks - 周数
 * @returns {string} 格式化后的交期
 */
export const formatDelivery = (weeks) => {
  if (!weeks) return '-';
  return `${weeks}周`;
};

/**
 * 生成雷达图数据
 * @param {Object} hangchiProduct - 杭齿产品
 * @param {Array} competitorList - 竞品列表
 * @returns {Object} 雷达图配置数据
 */
export const generateRadarData = (hangchiProduct, competitorList) => {
  const dimensions = ['传递能力', '价格竞争力', '交期', '质保', '服务'];

  const normalize = (value, max, inverse = false) => {
    const normalized = Math.min(value / max * 100, 100);
    return inverse ? 100 - normalized : normalized;
  };

  const maxCapacity = Math.max(
    hangchiProduct.transferCapacity || 0,
    ...competitorList.map(c => c.transferCapacity || 0)
  );
  const maxPrice = Math.max(
    hangchiProduct.price || 0,
    ...competitorList.map(c => c.estimatedPrice || 0)
  );

  const hangchiData = [
    normalize(hangchiProduct.transferCapacity || 0, maxCapacity),
    normalize(hangchiProduct.price || 0, maxPrice, true), // 价格越低越好
    normalize(hangchiAdvantages.deliveryAdvantage.hangchiWeeks, 20, true), // 交期越短越好
    normalize(hangchiAdvantages.warrantyAdvantage.hangchiMonths, 24),
    90 // 服务网点默认90分
  ];

  const competitorDataSets = competitorList.map(comp => ({
    name: comp.model,
    manufacturer: comp.manufacturer,
    data: [
      normalize(comp.transferCapacity || 0, maxCapacity),
      normalize(comp.estimatedPrice || 0, maxPrice, true),
      normalize(comp.deliveryWeeks || 12, 20, true),
      normalize(comp.warrantyMonths || 12, 24),
      50 // 竞品服务默认50分
    ]
  }));

  return {
    dimensions,
    hangchi: {
      name: hangchiProduct.model || '杭齿产品',
      data: hangchiData
    },
    competitors: competitorDataSets
  };
};

/**
 * 生成销售话术
 * @param {Object} hangchiProduct - 杭齿产品
 * @param {Object} competitor - 竞品
 * @returns {Array} 销售话术列表
 */
export const generateSalesPitch = (hangchiProduct, competitor) => {
  const advantages = calculateAdvantages(hangchiProduct, competitor);
  const pitches = [];

  const manufacturerName = competitors[competitor.manufacturer]?.shortName || competitor.manufacturer;

  if (advantages.priceAdvantage?.isAdvantage) {
    pitches.push({
      category: '价格',
      pitch: `与${manufacturerName}${competitor.model}相比，杭齿产品价格优惠${advantages.priceAdvantage.percent}%，可为您节省约¥${advantages.priceAdvantage.diff.toLocaleString()}。`
    });
  }

  if (advantages.deliveryAdvantage?.isAdvantage) {
    pitches.push({
      category: '交期',
      pitch: `杭齿标准交期${advantages.deliveryAdvantage.hangchiWeeks}周，比${manufacturerName}快${advantages.deliveryAdvantage.diff}周，帮助您更快完成项目。`
    });
  }

  if (advantages.capacityAdvantage?.isAdvantage) {
    pitches.push({
      category: '性能',
      pitch: `杭齿产品传递能力高出${advantages.capacityAdvantage.percent}%，提供更大的安全余量和可靠性。`
    });
  }

  if (competitor.manufacturer === 'ZF') {
    pitches.push({
      category: '售后',
      pitch: `杭齿拥有全国50个服务网点，24小时响应，无需担心进口配件周期长的问题。`
    });
  }

  if (advantages.warrantyAdvantage?.isAdvantage) {
    pitches.push({
      category: '质保',
      pitch: `杭齿提供${advantages.warrantyAdvantage.hangchiMonths}个月质保，比${manufacturerName}多${advantages.warrantyAdvantage.diff}个月保障。`
    });
  }

  return pitches;
};

/**
 * 保存竞品对比到本地存储
 * @param {Object} hangchiProduct - 杭齿产品
 * @param {Array} competitorList - 竞品列表
 * @param {Object} projectInfo - 项目信息
 * @returns {Object} 保存结果
 */
export const saveCompetitorComparison = (hangchiProduct, competitorList, projectInfo = {}) => {
  if (!hangchiProduct || !competitorList || competitorList.length === 0) {
    return { success: false, message: '缺少产品信息' };
  }

  try {
    const comparison = {
      id: `comp_${Date.now()}`,
      date: new Date().toISOString(),
      hangchiProduct,
      competitors: competitorList,
      projectInfo: {
        customerName: projectInfo.customerName || '',
        projectName: projectInfo.projectName || '',
        contactPerson: projectInfo.contactPerson || ''
      },
      report: generateComparisonReport(hangchiProduct, competitorList)
    };

    // 获取已保存的对比记录
    const savedComparisons = JSON.parse(localStorage.getItem('competitorComparisons') || '[]');

    // 添加新记录，最多保存20条
    const updatedComparisons = [comparison, ...savedComparisons].slice(0, 20);
    localStorage.setItem('competitorComparisons', JSON.stringify(updatedComparisons));

    return { success: true, id: comparison.id, message: '保存成功' };
  } catch (error) {
    console.error('保存竞品对比失败:', error);
    return { success: false, message: '保存失败: ' + error.message };
  }
};

/**
 * 获取已保存的竞品对比列表
 * @returns {Array} 对比记录列表
 */
export const getSavedComparisons = () => {
  try {
    return JSON.parse(localStorage.getItem('competitorComparisons') || '[]');
  } catch (error) {
    console.error('获取竞品对比记录失败:', error);
    return [];
  }
};

/**
 * 删除保存的竞品对比
 * @param {string} comparisonId - 对比记录ID
 * @returns {boolean} 删除结果
 */
export const deleteCompetitorComparison = (comparisonId) => {
  try {
    const savedComparisons = JSON.parse(localStorage.getItem('competitorComparisons') || '[]');
    const filtered = savedComparisons.filter(c => c.id !== comparisonId);
    localStorage.setItem('competitorComparisons', JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('删除竞品对比记录失败:', error);
    return false;
  }
};

/**
 * 生成竞品对比报价附件数据
 * @param {Object} hangchiProduct - 杭齿产品
 * @param {Array} competitorList - 竞品列表
 * @returns {Object} 可用于报价单附件的数据
 */
export const generateQuotationAttachment = (hangchiProduct, competitorList) => {
  const report = generateComparisonReport(hangchiProduct, competitorList);
  const radarData = generateRadarData(hangchiProduct, competitorList);

  return {
    type: 'competitor_comparison',
    title: '竞品对比分析',
    generatedAt: new Date().toISOString(),
    hangchiProduct: {
      model: hangchiProduct.model,
      series: hangchiProduct.series,
      price: hangchiProduct.price,
      powerRange: `${hangchiProduct.minPower}-${hangchiProduct.maxPower}kW`,
      transferCapacity: hangchiProduct.transferCapacity
    },
    competitors: competitorList.map(c => ({
      manufacturer: competitors[c.manufacturer]?.shortName || c.manufacturer,
      model: c.model,
      series: c.series,
      price: c.estimatedPrice,
      powerRange: `${c.powerRange[0]}-${c.powerRange[1]}kW`,
      transferCapacity: c.transferCapacity
    })),
    advantages: report.summary.keyPoints,
    recommendation: report.summary.recommendation,
    totalAdvantages: report.summary.totalAdvantages,
    radarData: {
      dimensions: radarData.dimensions,
      hangchiScores: radarData.hangchi.data,
      competitorScores: radarData.competitors.map(c => ({
        name: c.name,
        scores: c.data
      }))
    }
  };
};
