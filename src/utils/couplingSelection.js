// src/utils/couplingSelection.js
import { 
  getRecommendedCouplingInfo, 
  couplingWorkFactorMap, 
  getTemperatureFactor, 
  getCouplingSpecifications 
} from '../data/gearboxMatchingMaps';
import { calculateFactoryPrice, getDiscountRate } from './priceDiscount';
import { safeParseFloat } from './dataHelpers';

/**
 * 高弹性联轴器增强选择函数
 * @param {number} engineTorque - 发动机扭矩 (N·m)
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {Array} couplingsData - 联轴器数据数组
 * @param {string} workCondition - 工作条件
 * @param {number} temperature - 工作温度
 * @param {boolean} hasCover - 是否带罩壳
 * @return {object} 联轴器选择结果
 */
export const selectFlexibleCoupling = (
  engineTorque,
  gearboxModel,
  couplingsData,
  workCondition = "III类:扭矩变化中等",
  temperature = 30,
  hasCover = false
) => {
  console.log("开始联轴器选择:", { 
    engineTorque, 
    gearboxModel, 
    workCondition, 
    temperature, 
    hasCover,
    couplingsCount: couplingsData?.length 
  });

  // 参数验证
  if (!engineTorque || engineTorque <= 0) {
    return { 
      success: false, 
      message: "无效的主机扭矩", 
      recommendations: [] 
    };
  }
  
  if (!couplingsData || couplingsData.length === 0) {
    return { 
      success: false, 
      message: "缺少联轴器数据", 
      recommendations: [] 
    };
  }

  // 1. 确定工况系数和温度系数
  const kFactor = couplingWorkFactorMap[workCondition] || couplingWorkFactorMap.default;
  const stFactor = getTemperatureFactor(temperature);
  
  // 计算所需联轴器扭矩 (将N·m转换为kN·m并应用系数)
  const requiredCouplingTorque = engineTorque * kFactor * stFactor / 1000; 
  
  console.log(`所需联轴器扭矩 (kN·m): ${requiredCouplingTorque.toFixed(3)} (发动机: ${engineTorque.toFixed(2)} N·m, 工况系数: ${kFactor}, 温度系数: ${stFactor})`);

  // 2. 获取齿轮箱推荐的联轴器信息
  const { 
    prefix: recommendedPrefix, 
    specific: recommendedModel 
  } = getRecommendedCouplingInfo(gearboxModel, hasCover);
  
  console.log(`齿轮箱 ${gearboxModel} 的推荐联轴器: 型号=${recommendedModel || '无特定推荐'}, 前缀=${recommendedPrefix || '无前缀推荐'}`);

  // 3. 筛选并打分联轴器
  const eligibleCouplings = [];
  
  couplingsData.forEach(coupling => {
    // 验证联轴器数据有效性
    if (!coupling || !coupling.model || !(coupling.torque > 0)) {
      console.warn(`跳过无效的联轴器数据: ${coupling?.model || '未知'}`);
      return;
    }

    // 检查扭矩是否满足要求
    if (coupling.torque >= requiredCouplingTorque) {
      // 计算扭矩余量
      const torqueMargin = ((coupling.torque / requiredCouplingTorque) - 1) * 100;
      
      // 评分逻辑
      let score = 0;

      // 1. 扭矩余量评分 (50分) - 优先选择10-30%余量
      if (torqueMargin >= 10 && torqueMargin <= 30) {
        score += 50; // 最佳余量范围(10-30%)
      } else if (torqueMargin > 30 && torqueMargin <= 50) {
        score += 40; // 余量偏大(30-50%)
      } else if (torqueMargin > 50) {
        score += 30; // 余量过大(>50%)
      } else {
        score += 35; // 余量偏小但满足要求(0-10%)
      }

      // 2. 推荐匹配评分 (30分)
      if (recommendedModel && coupling.model === recommendedModel) {
        score += 30; // 完全匹配
      } else if (recommendedPrefix && coupling.model.startsWith(recommendedPrefix)) {
        score += 20; // 前缀匹配
      } else {
        score += 5; // 无匹配
      }

      // 3. 转速匹配评分 (10分)
      if (coupling.maxSpeed) {
        const motorSpeed = 1500; // 默认值，实际应从需求中获取
        if (coupling.maxSpeed >= motorSpeed) {
          const speedMargin = ((coupling.maxSpeed / motorSpeed) - 1) * 100;
          if (speedMargin <= 20) {
            score += 10; // 理想转速范围
          } else if (speedMargin <= 50) {
            score += 8; // 转速余量较大
          } else {
            score += 5; // 转速余量过大
          }
        } else {
          score = 0; // 转速不满足要求，直接淘汰
          return;
        }
      } else {
        score += 5; // 没有转速数据，给予中等分数
      }

      // 4. 重量评分 (5分) - 越轻越好
      score += Math.max(0, 5 - (coupling.weight / 500) * 5); // 重量超过500kg得0分

      // 5. 价格评分 (5分) - 越便宜越好
      score += Math.max(0, 5 - (coupling.price / 100000) * 5); // 价格超过10万元得0分

      // 确保分数在0-100范围内
      score = Math.max(0, Math.min(100, Math.round(score)));

      // 计算价格相关信息
      const basePrice = coupling.basePrice || coupling.price || 0;
      const discountRate = coupling.discountRate ?? getDiscountRate(coupling.model);
      const factoryPrice = coupling.factoryPrice || calculateFactoryPrice({ 
        ...coupling, 
        basePrice 
      });

      // 将联轴器添加到合格列表
      eligibleCouplings.push({
        ...coupling,
        torqueMargin,
        score,
        basePrice,
        discountRate,
        factoryPrice,
        requiredTorque: requiredCouplingTorque
      });
    }
  });

  // 4. 按评分排序
  eligibleCouplings.sort((a, b) => b.score - a.score);

  // 5. 生成警告信息
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
      warning = warning ? `${warning} ${scoreWarn}` : `警告: ${scoreWarn}`;
    }
    
    // 检查推荐匹配
    if (recommendedModel && topPick.model !== recommendedModel && 
        (!recommendedPrefix || !topPick.model.startsWith(recommendedPrefix))) {
      const matchWarn = `首选联轴器 (${topPick.model}) 与齿轮箱 (${gearboxModel}) 的建议匹配 (${recommendedModel || recommendedPrefix+'*'}) 不同。`;
      warning = warning ? `${warning} ${matchWarn}` : `注意: ${matchWarn}`;
    }
    
    // 若带罩壳但选用的不是罩壳型号
    if (hasCover && !topPick.model.includes('JB') && 
        (topPick.model === 'HGTHB5' || topPick.model === 'HGTHB6.3A')) {
      const coverWarn = `已选择带罩壳配置，但推荐的联轴器 (${topPick.model}) 不是罩壳型号，推荐使用 HGTHJ${topPick.model.substring(4)}。`;
      warning = warning ? `${warning} ${coverWarn}` : `注意: ${coverWarn}`;
    }
  }

  console.log(`联轴器选择完成。找到 ${eligibleCouplings.length} 个合格联轴器。`);

  // 6. 返回结果
  const bestMatch = eligibleCouplings.length > 0 ? eligibleCouplings[0] : null;

  return {
    success: !!bestMatch,
    message: bestMatch 
      ? `找到最匹配的联轴器: ${bestMatch.model}` 
      : "没有找到合适的联轴器",
    ...(bestMatch), // 展开最佳匹配的属性
    recommendations: eligibleCouplings.slice(0, 5), // 返回评分最高的5个联轴器
    requiredCouplingTorque: requiredCouplingTorque,
    warning
  };
};

/**
 * 根据齿轮箱型号直接获取推荐联轴器
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {Array} couplingsData - 联轴器数据数组
 * @param {boolean} hasCover - 是否带罩壳
 * @return {object} 推荐联轴器对象或null
 */
export const getDirectCouplingRecommendation = (gearboxModel, couplingsData, hasCover = false) => {
  if (!gearboxModel || !couplingsData || couplingsData.length === 0) {
    return null;
  }
  
  // 获取推荐型号
  const { specific: recommendedModel } = getRecommendedCouplingInfo(gearboxModel, hasCover);
  
  if (!recommendedModel) {
    return null;
  }
  
  // 查找联轴器数据
  return couplingsData.find(c => c.model === recommendedModel) || null;
};