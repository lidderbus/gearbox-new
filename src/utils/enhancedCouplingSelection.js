// src/utils/enhancedCouplingSelection.js
import { 
  getRecommendedCouplingInfo, 
  couplingWorkFactorMap, 
  getTemperatureFactor, 
  couplingSpecificationsMap
} from '../data/gearboxMatchingMaps';
import { calculateFactoryPrice, calculateMarketPrice, getStandardDiscountRate } from './priceManager';
import { safeParseFloat } from './dataHelpers';

/**
 * 增强版的联轴器选型函数
 * 基于齿轮箱选型结果中的详细数据进行更精准的选型
 * @param {Object} gearboxSelectionResult 齿轮箱选型结果
 * @param {Array} couplingsData 联轴器数据数组
 * @param {Object} options 选型选项
 * @returns {Object} 联轴器选型结果
 */
export const enhancedCouplingSelection = (
  gearboxSelectionResult,
  couplingsData,
  options = {}
) => {
  if (!gearboxSelectionResult || !gearboxSelectionResult.success) {
    return {
      success: false,
      message: '齿轮箱选型结果无效，无法选择联轴器',
      recommendations: []
    };
  }

  // 确保couplingsData是数组
  if (!Array.isArray(couplingsData) || couplingsData.length === 0) {
    console.warn("联轴器数据无效或为空");
    return {
      success: false,
      message: '联轴器数据无效或缺失',
      recommendations: []
    };
  }

  // 获取主要参数
  const { engineTorque, engineSpeed } = gearboxSelectionResult;
  const selectedGearbox = gearboxSelectionResult.recommendations && gearboxSelectionResult.recommendations.length > 0 
    ? gearboxSelectionResult.recommendations[0] 
    : null;

  if (!selectedGearbox) {
    return {
      success: false,
      message: '齿轮箱选型结果中没有推荐齿轮箱',
      recommendations: []
    };
  }

  // 获取工况选项
  const workCondition = options.workCondition || "III类:扭矩变化中等";
  const temperature = options.temperature || 30;
  const hasCover = options.hasCover || false;

  // 计算工况系数和温度系数
  const kFactor = couplingWorkFactorMap[workCondition] || couplingWorkFactorMap.default;
  const stFactor = getTemperatureFactor(temperature);

  // 计算所需联轴器扭矩 (kN·m)
  const requiredCouplingTorque_kNm = (engineTorque * kFactor * stFactor) / 1000;

  console.log(`Required Coupling Torque (kN·m): ${requiredCouplingTorque_kNm.toFixed(3)} (Engine Torque: ${engineTorque?.toFixed(2) || 'N/A'} N·m, K: ${kFactor.toFixed(2)}, St: ${stFactor.toFixed(2)})`);

  // 获取齿轮箱推荐的联轴器信息
  const { 
    prefix: recommendedPrefix, 
    specific: recommendedModel
  } = getRecommendedCouplingInfo(selectedGearbox.model, hasCover);

  console.log(`Recommended coupling for ${selectedGearbox.model} (hasCover=${hasCover}): Specific=${recommendedModel || 'N/A'}, Prefix=${recommendedPrefix || 'N/A'}`);

  // 筛选并打分联轴器
  const eligibleCouplings = [];
  const maxEngineSpeed = engineSpeed || 3000;

  // 记录所有合格联轴器的评分过程
  const scoreDetails = {};

  couplingsData.forEach(coupling => {
    // 基本验证
    if (!coupling || typeof coupling !== 'object' || !coupling.model) {
      console.warn(`跳过无效的联轴器数据:`, coupling);
      return;
    }

    // 获取并修正扭矩值
    let fixedTorque_kNm;
    
    // 首先尝试在规格映射中查找
    if (couplingSpecificationsMap && couplingSpecificationsMap[coupling.model]) {
      const specsTorque = safeParseFloat(couplingSpecificationsMap[coupling.model].ratedTorque);
      if (specsTorque !== undefined && specsTorque > 0) {
        fixedTorque_kNm = specsTorque;
      }
    }
    
    // 如果映射中找不到，尝试从coupling.torque解析
    if (!fixedTorque_kNm) {
      const torqueValue = safeParseFloat(coupling.torque);
      if (torqueValue !== undefined && torqueValue > 0) {
        const torqueUnit = coupling.torqueUnit?.toLowerCase()?.trim();
        
        // 根据单位进行转换
        if (torqueUnit === 'knm' || torqueUnit === 'kn·m' || torqueUnit === 'kn.m') {
          fixedTorque_kNm = torqueValue;
        } else if (torqueUnit === 'nm' || torqueUnit === 'n·m' || torqueUnit === 'n.m') {
          fixedTorque_kNm = torqueValue / 1000;
        } else {
          // 没有明确单位时的启发式判断
          if (torqueValue > 500) {
            fixedTorque_kNm = torqueValue / 1000;
          } else {
            fixedTorque_kNm = torqueValue;
          }
        }
      }
    }
    
    // 如果仍未获得有效扭矩值，跳过此联轴器
    if (fixedTorque_kNm === undefined || fixedTorque_kNm <= 0) {
      console.warn(`联轴器 ${coupling.model} 无法确定有效的kN·m扭矩值`);
      return;
    }

    // 获取最大转速
    let couplingMaxSpeed = safeParseFloat(coupling.maxSpeed);
    if (isNaN(couplingMaxSpeed) || couplingMaxSpeed <= 0) {
      if (couplingSpecificationsMap[coupling.model] && couplingSpecificationsMap[coupling.model].maxSpeed > 0) {
        couplingMaxSpeed = couplingSpecificationsMap[coupling.model].maxSpeed;
      } else {
        couplingMaxSpeed = 3000;
      }
    }

    // 主要过滤条件检查
    // 1. 检查扭矩是否满足要求
    if (fixedTorque_kNm < requiredCouplingTorque_kNm) {
      console.log(`跳过 ${coupling.model}: 扭矩 ${fixedTorque_kNm.toFixed(3)} < 所需 ${requiredCouplingTorque_kNm.toFixed(3)}`);
      return;
    }
    
    // 2. 检查最大速度是否满足要求
    if (couplingMaxSpeed < maxEngineSpeed) {
      console.log(`跳过 ${coupling.model}: 最大速度 ${couplingMaxSpeed} < 引擎速度 ${maxEngineSpeed}`);
      return;
    }
    
    // 3. 检查罩壳要求是否满足
    let meetsCoverRequirement = true;
    if (hasCover) {
      // 判断是否满足罩壳要求
      meetsCoverRequirement = coupling.hasCover === true || 
                             coupling.model.includes('JB') || 
                             coupling.model.includes('J') || 
                             coupling.model.endsWith('-ZB');
      
      if (!meetsCoverRequirement) {
        console.log(`跳过 ${coupling.model}: 不满足罩壳要求`);
        return;
      }
    }

    // 计算扭矩余量和速度余量
    const torqueMargin = ((fixedTorque_kNm / requiredCouplingTorque_kNm) - 1) * 100;
    const speedMarginPercent = ((couplingMaxSpeed / maxEngineSpeed) - 1) * 100;

    // 初始评分计算
    // 1. 扭矩余量评分 (25分)
    let torqueMarginScore = 0;
    let torqueMarginExplanation = '';
    
    if (torqueMargin >= 10 && torqueMargin <= 30) {
      torqueMarginScore = 25;
      torqueMarginExplanation = '理想扭矩余量(10-30%)';
    } else if (torqueMargin > 30 && torqueMargin <= 50) {
      torqueMarginScore = 20;
      torqueMarginExplanation = '扭矩余量较高(30-50%)';
    } else if (torqueMargin > 50) {
      torqueMarginScore = 15;
      torqueMarginExplanation = '扭矩余量过高(>50%)';
    } else if (torqueMargin >= 5 && torqueMargin < 10) {
      torqueMarginScore = 18;
      torqueMarginExplanation = '扭矩余量偏低(5-10%)';
    } else if (torqueMargin >= 0 && torqueMargin < 5) {
      torqueMarginScore = 10;
      torqueMarginExplanation = '扭矩余量不足(<5%)';
    }

    // 2. 推荐匹配评分 (30分)
    let recommendationScore = 0;
    let recommendationExplanation = '';
    
    if (recommendedModel && coupling.model === recommendedModel) {
      recommendationScore = 30;
      recommendationExplanation = '完全匹配';
    } else if (recommendedPrefix && coupling.model.startsWith(recommendedPrefix)) {
      recommendationScore = 20;
      recommendationExplanation = '前缀匹配';
    } else {
      recommendationScore = 5;
      recommendationExplanation = '无特定推荐匹配';
    }

    // 3. 速度余量评分 (15分)
    let speedMarginScore = 0;
    let speedMarginExplanation = '';
    
    if (speedMarginPercent >= 0 && speedMarginPercent <= 20) {
      speedMarginScore = 15;
      speedMarginExplanation = '理想速度余量(0-20%)';
    } else if (speedMarginPercent > 20 && speedMarginPercent <= 50) {
      speedMarginScore = 12;
      speedMarginExplanation = '速度余量较高(20-50%)';
    } else if (speedMarginPercent > 50) {
      speedMarginScore = 8;
      speedMarginExplanation = '速度余量过高(>50%)';
    }

    // 4. 成本评分 (20分) - 稍后标准化
    const basePrice = coupling.basePrice || coupling.price || 0;
    
    // 5. 重量评分 (10分) - 稍后标准化
    const weight = coupling.weight || 0;

    // 记录当前联轴器的评分细节
    scoreDetails[coupling.model] = {
      torqueMargin: {
        value: torqueMargin,
        score: torqueMarginScore,
        maxScore: 25,
        explanation: torqueMarginExplanation
      },
      recommendation: {
        value: recommendedModel && coupling.model === recommendedModel ? '完全匹配' : 
               (recommendedPrefix && coupling.model.startsWith(recommendedPrefix) ? '前缀匹配' : '无特定推荐'),
        score: recommendationScore,
        maxScore: 30,
        explanation: recommendationExplanation
      },
      speedMargin: {
        value: speedMarginPercent,
        score: speedMarginScore,
        maxScore: 15,
        explanation: speedMarginExplanation
      },
      price: {
        value: basePrice,
        score: 0, // 稍后标准化
        maxScore: 20,
        explanation: '待评估'
      },
      weight: {
        value: weight,
        score: 0, // 稍后标准化
        maxScore: 10,
        explanation: '待评估'
      }
    };

    // 添加到合格联轴器列表
    eligibleCouplings.push({
      ...coupling,
      torque: fixedTorque_kNm,
      torqueUnit: "kN·m",
      maxSpeed: couplingMaxSpeed,
      torqueMargin,
      speedMarginPercent,
      requiredTorque: requiredCouplingTorque_kNm,
      hasCover: hasCover,
      // 初始评分
      initialScore: torqueMarginScore + recommendationScore + speedMarginScore,
      score: 0 // 将在标准化后更新
    });
  });

  // 对价格和重量进行标准化评分
  if (eligibleCouplings.length > 1) {
    // 找出价格和重量的最大最小值
    let minPrice = Infinity, maxPrice = 0;
    let minWeight = Infinity, maxWeight = 0;

    eligibleCouplings.forEach(c => {
      const price = c.basePrice || c.price || 0;
      const weight = c.weight || 0;
      
      if (price > 0) {
        if (price < minPrice) minPrice = price;
        if (price > maxPrice) maxPrice = price;
      }
      
      if (weight > 0) {
        if (weight < minWeight) minWeight = weight;
        if (weight > maxWeight) maxWeight = weight;
      }
    });

    const priceRange = maxPrice - minPrice;
    const weightRange = maxWeight - minWeight;

    // 标准化评分
    eligibleCouplings.forEach(c => {
      let priceScore = 0;
      let priceExplanation = '';
      
      if (priceRange > 0 && (c.basePrice || c.price || 0) > 0) {
        priceScore = 20 * (1 - (((c.basePrice || c.price) - minPrice) / priceRange) || 0);
        priceExplanation = `价格评分标准化 (${c.basePrice || c.price}元)`;
      } else if ((c.basePrice || c.price || 0) > 0) {
        priceScore = 20;
        priceExplanation = '单一价格或零价格范围';
      } else {
        priceScore = 0;
        priceExplanation = '无有效价格数据';
      }

      let weightScore = 0;
      let weightExplanation = '';
      
      if (weightRange > 0 && (c.weight || 0) > 0) {
        weightScore = 10 * (1 - (((c.weight || 0) - minWeight) / weightRange) || 0);
        weightExplanation = `重量评分标准化 (${c.weight}kg)`;
      } else if ((c.weight || 0) > 0) {
        weightScore = 10;
        weightExplanation = '单一重量或零重量范围';
      } else {
        weightScore = 0;
        weightExplanation = '无有效重量数据';
      }

      // 更新评分明细
      scoreDetails[c.model].price.score = priceScore;
      scoreDetails[c.model].price.explanation = priceExplanation;
      scoreDetails[c.model].weight.score = weightScore;
      scoreDetails[c.model].weight.explanation = weightExplanation;
      
      // 添加总分明细
      const totalScore = Math.round(
        scoreDetails[c.model].torqueMargin.score +
        scoreDetails[c.model].recommendation.score +
        scoreDetails[c.model].speedMargin.score +
        scoreDetails[c.model].price.score +
        scoreDetails[c.model].weight.score
      );
      
      scoreDetails[c.model].total = {
        explanation: `总分由扭矩余量(${Math.round(scoreDetails[c.model].torqueMargin.score)}分)、推荐匹配(${Math.round(scoreDetails[c.model].recommendation.score)}分)、速度余量(${Math.round(scoreDetails[c.model].speedMargin.score)}分)、价格(${Math.round(scoreDetails[c.model].price.score)}分)、重量(${Math.round(scoreDetails[c.model].weight.score)}分)组成`
      };
      
      // 更新总分
      c.score = totalScore;
      
      // 添加评分详情
      c.scoreDetails = scoreDetails[c.model];
    });
  } else if (eligibleCouplings.length === 1) {
    // 对于单个合格联轴器，给予固定评分
    const c = eligibleCouplings[0];
    
    // 更新价格评分
    if ((c.basePrice || c.price || 0) > 0) {
      scoreDetails[c.model].price.score = 20;
      scoreDetails[c.model].price.explanation = '唯一选项，获得满分';
    }
    
    // 更新重量评分
    if ((c.weight || 0) > 0) {
      scoreDetails[c.model].weight.score = 10;
      scoreDetails[c.model].weight.explanation = '唯一选项，获得满分';
    }
    
    // 添加总分明细
    const totalScore = Math.round(
      scoreDetails[c.model].torqueMargin.score +
      scoreDetails[c.model].recommendation.score +
      scoreDetails[c.model].speedMargin.score +
      scoreDetails[c.model].price.score +
      scoreDetails[c.model].weight.score
    );
    
    scoreDetails[c.model].total = {
      explanation: `总分由扭矩余量(${Math.round(scoreDetails[c.model].torqueMargin.score)}分)、推荐匹配(${Math.round(scoreDetails[c.model].recommendation.score)}分)、速度余量(${Math.round(scoreDetails[c.model].speedMargin.score)}分)、价格(${Math.round(scoreDetails[c.model].price.score)}分)、重量(${Math.round(scoreDetails[c.model].weight.score)}分)组成`
    };
    
    // 更新总分
    c.score = totalScore;
    
    // 添加评分详情
    c.scoreDetails = scoreDetails[c.model];
  }

  // 排序合格联轴器
  eligibleCouplings.sort((a, b) => {
    // 主要排序：评分（降序）
    if (b.score !== a.score) return b.score - a.score;
    // 次要排序：偏好更接近15%的扭矩余量
    return Math.abs(a.torqueMargin - 15) - Math.abs(b.torqueMargin - 15);
  });

  // 生成警告信息
  let warning = null;
  if (eligibleCouplings.length > 0) {
    const topPick = eligibleCouplings[0];
    
    if (topPick.torqueMargin < 5) {
      warning = `警告: 首选联轴器 (${topPick.model}) 的扭矩余量 (${topPick.torqueMargin.toFixed(1)}%) 非常低 (<5%)。`;
    } else if (topPick.torqueMargin < 10) {
      warning = `注意: 首选联轴器 (${topPick.model}) 的扭矩余量 (${topPick.torqueMargin.toFixed(1)}%) 较低 (<10%)。`;
    } else if (topPick.torqueMargin > 50) {
      warning = `注意: 首选联轴器 (${topPick.model}) 的扭矩余量 (${topPick.torqueMargin.toFixed(1)}%) 较高 (>50%)，可能过度选型。`;
    }
    
    if (topPick.score < 60) {
      const scoreWarn = `首选联轴器 (${topPick.model}) 综合评分 (${topPick.score}) 较低 (<60)。`;
      warning = warning ? `${warning}; ${scoreWarn}` : `警告: ${scoreWarn}`;
    }

    // 选择后检查推荐匹配
    if (recommendedModel && topPick.model !== recommendedModel) {
      const matchWarn = `注意: 齿轮箱 (${selectedGearbox.model}) 推荐联轴器为 ${recommendedModel}, 但首选联轴器是 ${topPick.model}。`;
      warning = warning ? `${warning}; ${matchWarn}` : matchWarn;
    } else if (!recommendedModel && recommendedPrefix && !topPick.model.startsWith(recommendedPrefix)) {
      const matchWarn = `注意: 齿轮箱 (${selectedGearbox.model}) 推荐联轴器型号前缀为 ${recommendedPrefix}*, 但首选联轴器是 ${topPick.model}。`;
      warning = warning ? `${warning}; ${matchWarn}` : matchWarn;
    }

    // 如果需要罩壳，检查首选项是否是带罩壳型号
    if (hasCover) {
      const topPickHasCoverIndicator = (topPick.hasCover === true) || 
                                       topPick.model.includes('JB') || 
                                       topPick.model.includes('J') || 
                                       topPick.model.endsWith('-ZB');
      
      if (!topPickHasCoverIndicator) {
        let coverWarn = `注意: 已选择带罩壳，但首选联轴器(${topPick.model})似乎不带罩壳。`;
        warning = warning ? `${warning}; ${coverWarn}` : coverWarn;
      }
    }
  }

  // 处理价格计算
  const bestMatch = eligibleCouplings.length > 0 ? eligibleCouplings[0] : null;
  let bestMatchFactoryPrice = null;
  let bestMatchMarketPrice = null;
  
  if (bestMatch) {
    const basePrice = bestMatch.basePrice || bestMatch.price || 0;
    const discountRate = bestMatch.discountRate ?? getStandardDiscountRate(bestMatch.model);
    bestMatchFactoryPrice = bestMatch.factoryPrice || calculateFactoryPrice({ ...bestMatch, basePrice, discountRate });
    bestMatchMarketPrice = calculateMarketPrice({factoryPrice: bestMatchFactoryPrice});
  }

  // 返回结果
  return {
    success: !!bestMatch,
    message: bestMatch 
      ? `找到最匹配的联轴器: ${bestMatch.model}` 
      : "没有找到合适的联轴器",
    ...(bestMatch ? {
      model: bestMatch.model,
      torque: bestMatch.torque,
      torqueUnit: "kN·m",
      maxTorque: bestMatch.maxTorque,
      maxSpeed: bestMatch.maxSpeed,
      weight: bestMatch.weight,
      price: bestMatch.price,
      basePrice: bestMatch.basePrice,
      discountRate: bestMatch.discountRate,
      factoryPrice: bestMatchFactoryPrice,
      packagePrice: bestMatchFactoryPrice,
      marketPrice: bestMatchMarketPrice,
      torqueMargin: bestMatch.torqueMargin,
      score: bestMatch.score,
      scoreDetails: bestMatch.scoreDetails,
      requiredTorque: requiredCouplingTorque_kNm,
      hasCover: hasCover
    } : null),
    recommendations: eligibleCouplings.slice(0, 5),
    allEligibleCouplings: eligibleCouplings,
    requiredCouplingTorque: requiredCouplingTorque_kNm,
    warning: warning,
    selectionSettings: {
      workCondition,
      temperature,
      hasCover,
      weightSettings: {
        torqueMargin: 25,
        recommendation: 30,
        speedMargin: 15,
        price: 20,
        weight: 10
      }
    }
  };
};

export default enhancedCouplingSelection;