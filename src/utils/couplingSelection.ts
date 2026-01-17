// src/utils/couplingSelection.ts
// 联轴器和备用泵选型函数 - TypeScript版本

import {
  getRecommendedCouplingInfo,
  couplingWorkFactorMap,
  getWorkFactor,
  WorkFactorMode,
  getTemperatureFactor,
  getRecommendedPump,
  getCouplingSpecifications,
  couplingSpecificationsMap,
  couplingWithCoverMap
} from '../data/gearboxMatchingMaps';
import { logger } from '../config/logging';
import { calculateFactoryPrice, calculateMarketPrice, getStandardDiscountRate } from './priceManager';
import { safeParseFloat } from './dataHelpers';

// 导入类型定义
import type { Coupling, StandbyPump, CouplingMatchResult, PumpMatchResult } from '../types';

// ============= 内部类型定义 =============

/**
 * 联轴器规格映射项
 */
interface CouplingSpecification {
  ratedTorque?: number;
  maxTorque?: number;
  maxSpeed?: number;
  weight?: number;
  inertia?: number;
  basePrice?: number;
}

/**
 * 联轴器规格映射表
 */
interface CouplingSpecificationsMap {
  [model: string]: CouplingSpecification;
}

/**
 * 联轴器数据项（包含可选字段）
 * 注意：移除 index signature 以避免类型推断问题
 */
interface CouplingData {
  model: string;
  type?: string;
  torque?: number;
  torqueUnit?: string;
  inputTorque?: number;
  ratedTorque?: number;
  maxTorque?: number;
  maxSpeed?: number;
  inertia?: number;
  weight?: number;
  basePrice?: number;
  price?: number;
  discountRate?: number;
  factoryPrice?: number;
  marketPrice?: number;
  hasCover?: boolean;
  notes?: string;
}

/**
 * 合格联轴器（评分后）
 */
interface EligibleCoupling extends CouplingData {
  torqueMargin: number;
  speedMarginPercent: number;
  score: number;
  requiredTorque: number;
}

/**
 * 备用泵数据项（使用灵活类型以兼容StandbyPump）
 */
type PumpData = StandbyPump & {
  price?: number;
  flow?: number;
  pressure?: number;
  motorPower?: number;
};

/**
 * 联轴器选型结果（内部扩展）
 */
interface CouplingSelectionResult {
  success: boolean;
  message: string;
  model?: string;
  torque?: number;
  torqueUnit?: string;
  maxTorque?: number;
  maxSpeed?: number;
  weight?: number;
  price?: number;
  basePrice?: number;
  discountRate?: number;
  factoryPrice?: number;
  packagePrice?: number;
  marketPrice?: number;
  torqueMargin?: number;
  score?: number;
  requiredTorque?: number;
  hasCover?: boolean;
  recommendations: EligibleCoupling[];
  requiredCouplingTorque?: number;
  warning?: string;
}

/**
 * 备用泵选型结果
 */
interface PumpSelectionResult {
  success: boolean;
  message?: string;
  model?: string;
  displacement?: number;
  ratedPressure?: number;
  flowRate?: number;
  power?: number;
  basePrice?: number;
  discountRate?: number;
  factoryPrice?: number;
  marketPrice?: number;
  flow?: number;
  pressure?: number;
  motorPower?: number;
  weight?: number;
  notes?: string;
  warning?: string;
}

// ============= 主要函数 =============

/**
 * 修复单个联轴器的扭矩值，统一单位为 kN·m
 * @param coupling 联轴器对象
 * @param couplingSpecsMap 联轴器规格映射表
 * @returns 修正后的扭矩值 (kN·m)，如果无法确定则返回undefined
 */
export const fixCouplingTorque = (
  coupling: CouplingData | null | undefined,
  couplingSpecsMap?: CouplingSpecificationsMap | null
): number | undefined => {
  if (!coupling || !coupling.model) {
    logger.warn("fixCouplingTorque: Invalid coupling object or missing model", coupling);
    return undefined;
  }

  const model = coupling.model.trim();
  let torque_value: number | undefined = undefined;

  // 1. Prioritize lookup in couplingSpecificationsMap (ratedTorque)
  if (couplingSpecsMap && couplingSpecsMap[model]) {
    const specsTorque = safeParseFloat(couplingSpecsMap[model].ratedTorque);
    if (specsTorque !== undefined && specsTorque > 0) {
      torque_value = specsTorque;
      logger.debug(`fixCouplingTorque: Using specs map for ${model}: ${torque_value} kN·m`);
      return torque_value;
    }
  }

  // 2. If not in map, try from coupling.torque
  if (coupling.torque !== undefined && coupling.torque !== null) {
    torque_value = safeParseFloat(coupling.torque);

    if (torque_value !== undefined && torque_value > 0) {
      // Check for explicitly specified unit first
      if (coupling.torqueUnit) {
        const unit = coupling.torqueUnit.toLowerCase().trim();
        if (unit === 'knm' || unit === 'kn·m') {
          // Assume correct unit
        } else if (unit === 'nm' || unit === 'n·m') {
          torque_value /= 1000;
          logger.debug(`fixCouplingTorque: Converted torque for ${model} from N·m based on unit: ${coupling.torque} N·m -> ${torque_value} kN·m`);
        } else {
          logger.warn(`fixCouplingTorque: Unknown torque unit "${coupling.torqueUnit}" for model ${model}. Trying heuristic.`);
          if (torque_value > 500) {
            torque_value /= 1000;
            logger.debug(`fixCouplingTorque: Converted torque for ${model} from N·m based on heuristic: ${coupling.torque} (likely N·m) -> ${torque_value} kN·m`);
          }
        }
      } else {
        // No unit specified, use heuristics
        if (torque_value > 500) {
          torque_value /= 1000;
          logger.debug(`fixCouplingTorque: Converted torque for ${model} from N·m based on heuristic (no unit): ${coupling.torque} (likely N·m) -> ${torque_value} kN·m`);
        }
      }
      return torque_value > 0 ? torque_value : undefined;
    } else {
      torque_value = undefined;
    }
  }

  // 3. Try from coupling.inputTorque (assume N·m if valid)
  if (torque_value === undefined && coupling.inputTorque !== undefined && coupling.inputTorque !== null) {
    const inputTorque_Nm = safeParseFloat(coupling.inputTorque);
    if (inputTorque_Nm !== undefined && inputTorque_Nm > 0) {
      torque_value = inputTorque_Nm / 1000;
      logger.debug(`fixCouplingTorque: Using inputTorque for ${model}: ${inputTorque_Nm} N·m -> ${torque_value} kN·m`);
      return torque_value;
    }
  }

  // 4. Try extracting from model name
  if (torque_value === undefined) {
    const modelMatch = model.match(/HGT[HTJBQ]*(\d+(\.\d+)?)/i);
    if (modelMatch && modelMatch[1]) {
      const modelTorque = safeParseFloat(modelMatch[1]);
      if (modelTorque !== undefined && modelTorque > 0) {
        torque_value = modelTorque;
        logger.debug(`fixCouplingTorque: Using model name value for ${model}: ${torque_value} kN·m`);
        return torque_value;
      }
    }
  }

  // 5. Final return
  return torque_value !== undefined && !isNaN(torque_value) && torque_value > 0 ? torque_value : undefined;
};


/**
 * 联轴器选择函数
 * @param engineTorque 主机扭矩 (N·m)
 * @param gearboxModel 齿轮箱型号
 * @param couplingsData 联轴器数据数组
 * @param couplingSpecificationsMapOrFn 联轴器规格映射表或获取映射表的函数
 * @param workCondition 工况条件
 * @param temperature 工作温度
 * @param hasCover 是否带罩壳
 * @param engineSpeed 主机转速
 * @returns 选型结果对象
 */
export const selectFlexibleCoupling = (
  engineTorque: number,
  gearboxModel: string,
  couplingsData: Coupling[] | null | undefined,
  couplingSpecificationsMapOrFn?: CouplingSpecificationsMap | (() => CouplingSpecificationsMap) | null,
  workCondition: string = "III类:扭矩变化中等",
  temperature: number = 30,
  hasCover: boolean = false,
  engineSpeed?: number,
  workFactorMode: string = 'FACTORY' // 工况系数模式: 'FACTORY' | 'JB_CCS'
): CouplingSelectionResult => {
  logger.log("开始联轴器选择:", {
    engineTorque,
    gearboxModel,
    workCondition,
    temperature,
    hasCover,
    engineSpeed,
    couplingsCount: couplingsData?.length,
    mapAvailable: !!couplingSpecificationsMapOrFn
  });

  if (!engineTorque || engineTorque <= 0) {
    return { success: false, message: "无效的主机扭矩 (N·m)", recommendations: [] };
  }

  if (!Array.isArray(couplingsData) || couplingsData.length === 0) {
    logger.warn("couplingsData不是有效数组或为空在selectFlexibleCoupling中");
    return { success: false, message: "联轴器数据无效或缺失", recommendations: [] };
  }

  // 确保couplingSpecificationsMap是对象
  let specsMap: CouplingSpecificationsMap;
  if (typeof couplingSpecificationsMapOrFn === 'function') {
    try {
      specsMap = couplingSpecificationsMapOrFn();
    } catch (e) {
      logger.warn("无法从函数获取coupling规格映射表:", e);
      specsMap = {};
    }
  } else {
    specsMap = couplingSpecificationsMapOrFn || {};
  }

  if (!specsMap || typeof specsMap !== 'object') {
    logger.warn("couplingSpecificationsMap不是有效对象在selectFlexibleCoupling中");
    specsMap = {};
  }

  // 1. 确定工况系数和温度系数 (支持双模式: 厂家标准/JB-CCS船级社标准)
  const kFactor = getWorkFactor(workCondition, workFactorMode as 'FACTORY' | 'JB_CCS');
  const isJbCcsMode = workFactorMode === 'JB_CCS';
  logger.debug(`工况系数模式: ${isJbCcsMode ? 'JB/CCS船级社标准' : '厂家标准'}, K=${kFactor}`);

  // 获取温度系数及边界警告
  const temperatureResult = getTemperatureFactor(temperature, true) as { factor: number; warning: string | null };
  const stFactor = temperatureResult.factor;
  const temperatureWarning = temperatureResult.warning;

  // 计算所需联轴器扭矩 (kN·m)
  const requiredCouplingTorque_kNm = (engineTorque * kFactor * stFactor) / 1000;

  logger.debug(`Required Coupling Torque (kN·m): ${requiredCouplingTorque_kNm.toFixed(3)} (Engine Torque: ${engineTorque.toFixed(2)} N·m, K: ${kFactor.toFixed(2)}, St: ${stFactor.toFixed(2)})`);
  if (temperatureWarning) {
    logger.warn(`温度边界警告: ${temperatureWarning}`);
  }

  // 2. 获取齿轮箱推荐的联轴器信息
  const {
    prefix: recommendedPrefix,
    specific: recommendedModel
  } = getRecommendedCouplingInfo(gearboxModel, hasCover);

  logger.debug(`Recommended coupling for ${gearboxModel} (hasCover=${hasCover}): Specific=${recommendedModel || 'N/A'}, Prefix=${recommendedPrefix || 'N/A'}`);

  // 3. 筛选并打分联轴器
  const eligibleCouplings: EligibleCoupling[] = [];
  const maxEngineSpeed = engineSpeed || 3000;

  couplingsData.forEach(coupling => {
    if (!coupling || typeof coupling !== 'object' || !coupling.model) {
      logger.warn(`跳过无效的联轴器数据:`, coupling);
      return;
    }

    // 验证并修复扭矩单位 (kN·m)
    const fixedTorque_kNm = fixCouplingTorque(coupling, specsMap);

    if (fixedTorque_kNm === undefined || fixedTorque_kNm <= 0) {
      logger.warn(`联轴器 ${coupling.model} 无法确定或修正到有效的kN·m扭矩值: ${fixedTorque_kNm}`);
      return;
    }

    // 从数据或规格获取maxSpeed
    let couplingMaxSpeed = safeParseFloat(coupling.maxSpeed);
    if (couplingMaxSpeed === undefined || isNaN(couplingMaxSpeed) || couplingMaxSpeed <= 0) {
      if (specsMap[coupling.model] && (specsMap[coupling.model].maxSpeed || 0) > 0) {
        couplingMaxSpeed = specsMap[coupling.model].maxSpeed!;
      } else {
        couplingMaxSpeed = 3000;
        logger.debug(`联轴器 ${coupling.model} 缺少有效maxSpeed，默认为3000 rpm`);
      }
    }

    // --- 主要过滤 ---
    if (fixedTorque_kNm < requiredCouplingTorque_kNm) {
      logger.debug(`跳过 ${coupling.model}: 扭矩 ${fixedTorque_kNm.toFixed(3)} < 所需 ${requiredCouplingTorque_kNm.toFixed(3)}`);
      return;
    }

    if (couplingMaxSpeed < maxEngineSpeed) {
      logger.debug(`跳过 ${coupling.model}: 最大速度 ${couplingMaxSpeed} < 引擎速度 ${maxEngineSpeed}`);
      return;
    }

    // 检查罩壳要求
    let meetsCoverRequirement = true;
    if (hasCover) {
      const recommendedWithCoverInfo = getRecommendedCouplingInfo(gearboxModel, true);
      const recommendedWithCoverModel = recommendedWithCoverInfo.specific;
      if (recommendedWithCoverModel) {
        meetsCoverRequirement = (coupling.model === recommendedWithCoverModel) ||
                               (coupling.hasCover === true) ||
                               coupling.model.includes('JB') ||
                               coupling.model.includes('J') ||
                               (coupling.model.endsWith('-ZB') && !recommendedModel);
      } else {
        meetsCoverRequirement = (coupling.hasCover === true) ||
                               coupling.model.includes('JB') ||
                               coupling.model.includes('J') ||
                               coupling.model.endsWith('-ZB');
      }
      if (!meetsCoverRequirement) {
        logger.debug(`跳过 ${coupling.model}: 不满足罩壳要求`);
        return;
      }
    }

    // --- 合格联轴器评分 ---
    const torqueMargin = ((fixedTorque_kNm / requiredCouplingTorque_kNm) - 1) * 100;

    let score = 0;

    // 1. 扭矩余量评分（10分）
    if (torqueMargin >= 10 && torqueMargin <= 30) score += 10;
    else if (torqueMargin > 30 && torqueMargin <= 50) score += 9;
    else if (torqueMargin > 50) score += 7;
    else if (torqueMargin >= 0 && torqueMargin < 10) score += 8;

    // 2. 推荐匹配评分（20分）
    if (recommendedModel && coupling.model === recommendedModel) score += 20;
    else if (recommendedPrefix && coupling.model.startsWith(recommendedPrefix)) score += 15;
    else score += 5;

    // 3. 最大速度余量评分（10分）
    const speedMarginPercent = ((couplingMaxSpeed / maxEngineSpeed) - 1) * 100;
    if (speedMarginPercent >= 0 && speedMarginPercent <= 20) score += 10;
    else if (speedMarginPercent > 20 && speedMarginPercent <= 50) score += 9;
    else if (speedMarginPercent > 50) score += 7;

    // 4. 成本评分（45分）- 稍后计算
    const basePrice = (coupling.basePrice as number | undefined) || 0;

    // 5. 重量评分（15分）- 稍后计算

    // 显式创建对象以避免 index signature 类型问题
    const eligibleCoupling: EligibleCoupling = {
      model: coupling.model,
      type: coupling.type,
      torque: fixedTorque_kNm,
      torqueUnit: "kN·m",
      inputTorque: coupling.ratedTorque,
      ratedTorque: coupling.ratedTorque,
      maxTorque: coupling.maxTorque,
      maxSpeed: couplingMaxSpeed,
      inertia: coupling.inertia,
      weight: coupling.weight,
      basePrice,
      price: basePrice,
      discountRate: coupling.discountRate,
      factoryPrice: coupling.factoryPrice,
      marketPrice: coupling.marketPrice,
      hasCover: coupling.hasCover,
      notes: coupling.notes,
      torqueMargin,
      speedMarginPercent,
      score,
      requiredTorque: requiredCouplingTorque_kNm,
    };
    eligibleCouplings.push(eligibleCoupling);
  });

  // 标准化价格和重量评分
  if (eligibleCouplings.length > 1) {
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

    eligibleCouplings.forEach(c => {
      let priceScore = 0;
      const cPrice = c.basePrice || c.price || 0;
      if (priceRange > 0 && cPrice > 0) {
        priceScore = 45 * (1 - ((cPrice - minPrice) / priceRange));
      } else if (cPrice > 0) {
        priceScore = 45;
      }

      let weightScore = 0;
      const cWeight = c.weight || 0;
      if (weightRange > 0 && cWeight > 0) {
        weightScore = 15 * (1 - ((cWeight - minWeight) / weightRange));
      } else if (cWeight > 0) {
        weightScore = 15;
      }

      c.score = Math.max(0, Math.min(100, Math.round(c.score + priceScore + weightScore)));
    });
  } else if (eligibleCouplings.length === 1) {
    if ((eligibleCouplings[0].basePrice || eligibleCouplings[0].price || 0) > 0) {
      eligibleCouplings[0].score = Math.max(0, Math.min(100, Math.round(eligibleCouplings[0].score + 45)));
    }
    if ((eligibleCouplings[0].weight || 0) > 0) {
      eligibleCouplings[0].score = Math.max(0, Math.min(100, Math.round(eligibleCouplings[0].score + 15)));
    }
  }

  // 4. 排序
  eligibleCouplings.sort((a, b) => {
    // 1. 安全余量约束 (船用推进系统建议最小10%余量)
    const MIN_TORQUE_MARGIN = 10; // 从5%提升到10%，提高安全裕度
    const aSafe = a.torqueMargin >= MIN_TORQUE_MARGIN;
    const bSafe = b.torqueMargin >= MIN_TORQUE_MARGIN;
    if (aSafe !== bSafe) return aSafe ? -1 : 1;

    // 2. 推荐匹配优先
    const aRecommended = (recommendedModel && a.model === recommendedModel) ||
                        (recommendedPrefix && a.model.startsWith(recommendedPrefix));
    const bRecommended = (recommendedModel && b.model === recommendedModel) ||
                        (recommendedPrefix && b.model.startsWith(recommendedPrefix));
    if (aRecommended !== bRecommended) return aRecommended ? -1 : 1;

    // 3. 余量优化
    const aOptimal = a.torqueMargin >= 10 && a.torqueMargin <= 50;
    const bOptimal = b.torqueMargin >= 10 && b.torqueMargin <= 50;
    const aHigh = a.torqueMargin > 50;
    const bHigh = b.torqueMargin > 50;

    if (aOptimal && bHigh) return -1;
    if (bOptimal && aHigh) return 1;

    // 4. 价格优先
    const aPrice = a.factoryPrice || a.basePrice || a.price || Infinity;
    const bPrice = b.factoryPrice || b.basePrice || b.price || Infinity;
    if (aPrice !== bPrice) return aPrice - bPrice;

    // 5. 评分作为参考
    if (b.score !== a.score) return b.score - a.score;

    // 6. 余量作为最后参考
    return b.torqueMargin - a.torqueMargin;
  });

  // 5. 生成警告信息
  let warning: string | null = null;

  // 添加温度边界警告
  if (temperatureWarning) {
    warning = `温度警告: ${temperatureWarning}`;
  }

  if (eligibleCouplings.length > 0) {
    const topPick = eligibleCouplings[0];

    // 扭矩余量警告 (使用拼接模式保留温度警告)
    if (topPick.torqueMargin < 5) {
      const marginWarn = `警告: 首选联轴器 (${topPick.model}) 的扭矩余量 (${topPick.torqueMargin.toFixed(1)}%) 非常低 (<5%)。`;
      warning = warning ? `${warning}; ${marginWarn}` : marginWarn;
    } else if (topPick.torqueMargin < 10) {
      const marginWarn = `注意: 首选联轴器 (${topPick.model}) 的扭矩余量 (${topPick.torqueMargin.toFixed(1)}%) 较低 (<10%)。`;
      warning = warning ? `${warning}; ${marginWarn}` : marginWarn;
    } else if (topPick.torqueMargin > 50) {
      const marginWarn = `注意: 首选联轴器 (${topPick.model}) 的扭矩余量 (${topPick.torqueMargin.toFixed(1)}%) 较高 (>50%)，可能过度选型。`;
      warning = warning ? `${warning}; ${marginWarn}` : marginWarn;
    }

    if (topPick.score < 60) {
      const scoreWarn = `首选联轴器 (${topPick.model}) 综合评分 (${topPick.score}) 较低 (<60)。`;
      warning = warning ? `${warning}; ${scoreWarn}` : `警告: ${scoreWarn}`;
    }

    if (recommendedModel && topPick.model !== recommendedModel) {
      const matchWarn = `注意: 齿轮箱 (${gearboxModel}) 推荐联轴器为 ${recommendedModel}, 但首选联轴器是 ${topPick.model}。`;
      warning = warning ? `${warning}; ${matchWarn}` : matchWarn;
    } else if (!recommendedModel && recommendedPrefix && !topPick.model.startsWith(recommendedPrefix)) {
      const matchWarn = `注意: 齿轮箱 (${gearboxModel}) 推荐联轴器型号前缀为 ${recommendedPrefix}*, 但首选联轴器是 ${topPick.model}。`;
      warning = warning ? `${warning}; ${matchWarn}` : matchWarn;
    }

    // 罩壳检查
    if (hasCover) {
      const topPickHasCoverIndicator = (topPick.hasCover === true) ||
                                       topPick.model.includes('JB') ||
                                       topPick.model.includes('J') ||
                                       topPick.model.endsWith('-ZB');
      const coverMap = couplingWithCoverMap as Record<string, string> | undefined;
      const recommendedCoveredModel = (coverMap && recommendedModel) ? coverMap[recommendedModel] || recommendedModel : recommendedModel;
      const topPickMatchesRecommendedCovered = recommendedCoveredModel && topPick.model === recommendedCoveredModel;

      if (!topPickHasCoverIndicator && !topPickMatchesRecommendedCovered) {
        let coverWarn = `注意: 已选择带罩壳，但首选联轴器(${topPick.model})似乎不带罩壳。`;
        const correspondingCoveredModel = coverMap ? coverMap[topPick.model] : undefined;
        const existsCorrespondingCovered = correspondingCoveredModel && couplingsData.some(c => c.model === correspondingCoveredModel);

        if (existsCorrespondingCovered) {
          coverWarn += ` 数据中存在对应的带罩型号 ${correspondingCoveredModel}。`;
        } else if (recommendedCoveredModel && recommendedCoveredModel !== topPick.model) {
          coverWarn += ` 推荐使用带罩型号 ${recommendedCoveredModel}。`;
        }
        warning = warning ? `${warning}; ${coverWarn}` : coverWarn;
      }
    }
  }

  logger.log(`联轴器选择完成。找到 ${eligibleCouplings.length} 个合格联轴器。`);
  if (eligibleCouplings.length > 0) {
    logger.debug("前五个合格联轴器:", eligibleCouplings.slice(0, 5).map(c => ({
      model: c.model,
      score: c.score,
      torque: c.torque,
      torqueMargin: c.torqueMargin,
      maxSpeed: c.maxSpeed
    })));
  }

  // 6. 返回结果
  const bestMatch = eligibleCouplings.length > 0 ? eligibleCouplings[0] : null;

  let bestMatchFactoryPrice: number | null = null;
  let bestMatchMarketPrice: number | null = null;
  if (bestMatch) {
    const basePrice = bestMatch.basePrice || bestMatch.price || 0;
    const discountRate = bestMatch.discountRate ?? getStandardDiscountRate(bestMatch.model);
    bestMatchFactoryPrice = bestMatch.factoryPrice || calculateFactoryPrice({ model: bestMatch.model, basePrice, discountRate });
    bestMatchMarketPrice = calculateMarketPrice({ factoryPrice: bestMatchFactoryPrice });
  }

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
      factoryPrice: bestMatchFactoryPrice!,
      packagePrice: bestMatchFactoryPrice!,
      marketPrice: bestMatchMarketPrice!,
      torqueMargin: bestMatch.torqueMargin,
      score: bestMatch.score,
      requiredTorque: requiredCouplingTorque_kNm,
      hasCover: hasCover
    } : {}),
    recommendations: eligibleCouplings.slice(0, 5),
    requiredCouplingTorque: requiredCouplingTorque_kNm,
    warning: warning || undefined
  };
};


/**
 * 备用泵选择函数
 * @param gearboxModel 齿轮箱型号
 * @param pumpsData 备用泵数据数组
 * @returns 选型结果对象
 */
export const selectStandbyPump = (
  gearboxModel: string,
  pumpsData: StandbyPump[] | null | undefined
): PumpSelectionResult => {
  const pumps = Array.isArray(pumpsData) ? pumpsData : [];
  if (pumps.length === 0) {
    return { success: false, message: "没有找到备用泵数据" };
  }
  logger.log(`选择备用泵，齿轮箱型号: ${gearboxModel}`);

  // 尝试获取推荐的泵型号
  const recommendedPumpModel = getRecommendedPump(gearboxModel);

  // 尝试查找推荐型号
  let matchedPump: PumpData | undefined;
  if (recommendedPumpModel) {
    logger.debug(`模型 ${gearboxModel} 的推荐泵型号: ${recommendedPumpModel}`);
    matchedPump = pumps.find(p => p && p.model === recommendedPumpModel);
  }

  // 辅助函数：从泵数据创建结果对象
  const createPumpResult = (
    pump: StandbyPump,
    message?: string,
    warning?: string
  ): PumpSelectionResult => {
    const basePrice = (pump.basePrice as number | undefined) || 0;
    const discountRate = pump.discountRate ?? getStandardDiscountRate(pump.model);
    const factoryPrice = pump.factoryPrice || calculateFactoryPrice({
      model: pump.model,
      basePrice,
      discountRate
    });

    return {
      success: true,
      message,
      model: pump.model,
      displacement: pump.displacement,
      ratedPressure: pump.ratedPressure,
      flowRate: pump.flowRate,
      power: pump.power,
      weight: pump.weight || 0,
      basePrice,
      discountRate,
      factoryPrice,
      marketPrice: pump.marketPrice,
      notes: pump.notes,
      flow: (pump as PumpData).flow || 0,
      pressure: (pump as PumpData).pressure || 0,
      motorPower: (pump as PumpData).motorPower || 0,
      warning
    };
  };

  if (matchedPump) {
    logger.debug(`找到完全匹配的备用泵: ${matchedPump.model}`);
    return createPumpResult(matchedPump);
  } else {
    if (recommendedPumpModel) {
      logger.warn(`未找到推荐泵型号 (${recommendedPumpModel}) 在数据中，选择默认泵。`);
    }

    // 选择默认泵
    const defaultPump = pumps.find(p => p.model === '2CY7.5/2.5D') || pumps[0];

    if (defaultPump) {
      const msg = `未找到推荐泵型号，已选择默认泵 ${defaultPump.model}`;
      return createPumpResult(defaultPump, msg, msg);
    } else {
      return { success: false, message: "无法选择备用泵，数据不足" };
    }
  }
};

// 默认导出
export default {
  fixCouplingTorque,
  selectFlexibleCoupling,
  selectStandbyPump
};
