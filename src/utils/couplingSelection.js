// src/utils/couplingSelection.js
import { 
  getRecommendedCouplingInfo, 
  couplingWorkFactorMap, 
  getTemperatureFactor, 
  getRecommendedPump,
  getCouplingSpecifications,
  couplingSpecificationsMap // 确保导入映射表
} from '../data/gearboxMatchingMaps'; // Make sure this file exists
import { calculateFactoryPrice, calculateMarketPrice, getDiscountRate } from './priceManager'; // Make sure priceManager.js exists
import { safeParseFloat } from './dataHelpers'; // Make sure dataHelpers.js exists
import { couplingWithCoverMap } from '../data/gearboxMatchingMaps';

/**
 * 修复单个联轴器的扭矩值，统一单位为 kN·m
 * 尝试从 couplingSpecificationsMap, existing torque fields, 或 model 中提取数值，并根据经验规则修正单位。
 * @param {Object} coupling - 联轴器对象 (应包含 model 字段)
 * @param {Object} couplingSpecsMap - 联轴器规格映射表 (couplingSpecificationsMap)
 * @returns {number|undefined} 修正后的扭矩值 (kN·m)，如果无法确定则返回undefined
 */
export const fixCouplingTorque = (coupling, couplingSpecsMap) => {
  if (!coupling || !coupling.model) {
     console.warn("fixCouplingTorque: Invalid coupling object or missing model", coupling);
     return undefined;
  }

  const model = coupling.model.trim(); // Use trim()
  let torque_value = undefined;
  // Removed _originalTorqueValue storage, less critical for production fix

  // 1. Prioritize lookup in couplingSpecificationsMap (ratedTorque)
  if (couplingSpecsMap && couplingSpecsMap[model]) {
      const specsTorque = safeParseFloat(couplingSpecsMap[model].ratedTorque);
      if (specsTorque !== undefined && specsTorque > 0) {
          // Assuming ratedTorque in map is already in kN.m
          torque_value = specsTorque;
          console.log(`fixCouplingTorque: Using specs map for ${model}: ${torque_value} kN·m`);
          return torque_value; // Found it, return directly
      }
  }


  // 2. If not in map, or map value invalid, try from coupling.torque
  if (coupling.torque !== undefined && coupling.torque !== null) {
    torque_value = safeParseFloat(coupling.torque);

    if (torque_value !== undefined && torque_value > 0) {
        // Check for explicitly specified unit first
        if (coupling.torqueUnit) {
            const unit = coupling.torqueUnit.toLowerCase().trim();
            if (unit === 'knm' || unit === 'kn·m') {
                // Assume correct unit
            } else if (unit === 'nm' || unit === 'n·m') {
                 torque_value /= 1000; // Convert N·m to kN·m
                 console.warn(`fixCouplingTorque: Converted torque for ${model} from N·m based on unit: ${coupling.torque} N·m -> ${torque_value} kN·m`);
            } else {
                console.warn(`fixCouplingTorque: Unknown torque unit "${coupling.torqueUnit}" for model ${model}. Trying heuristic.`);
                // Fallback to heuristic if unit is unknown
                if (torque_value > 500) { // Heuristic: large number likely N·m
                     torque_value /= 1000;
                     console.warn(`fixCouplingTorque: Converted torque for ${model} from N·m based on heuristic: ${coupling.torque} (likely N·m) -> ${torque_value} kN·m`);
                }
                // Removed the problematic heuristic torque_value < 1, assume small values are already in kN.m
            }
        } else {
            // No unit specified, use heuristics
            if (torque_value > 500) { // Heuristic: large number likely N·m
                 torque_value /= 1000;
                 console.warn(`fixCouplingTorque: Converted torque for ${model} from N·m based on heuristic (no unit): ${coupling.torque} (likely N·m) -> ${torque_value} kN·m`);
            }
            // Removed the problematic heuristic torque_value < 1, assume small values are already in kN.m
        }
        // Return the determined torque value if valid and > 0
        return torque_value > 0 ? torque_value : undefined;
    } else {
        // console.warn(`fixCouplingTorque: torque field invalid or not positive for ${model}:`, coupling.torque);
        torque_value = undefined; // Reset if invalid or zero
    }
  }

  // 3. If still undefined, try from coupling.inputTorque (assume N·m if valid)
  if (torque_value === undefined && coupling.inputTorque !== undefined && coupling.inputTorque !== null) {
      const inputTorque_Nm = safeParseFloat(coupling.inputTorque);
      if (inputTorque_Nm !== undefined && inputTorque_Nm > 0) {
           torque_value = inputTorque_Nm / 1000; // Convert N·m to kN·m
           console.log(`fixCouplingTorque: Using inputTorque for ${model}: ${inputTorque_Nm} N·m -> ${torque_value} kN·m`);
           return torque_value; // Found it, return
      }
  }

  // 4. If still undefined, try extracting from model name (e.g., HGT10020 -> 100)
  if (torque_value === undefined) {
      // This regex captures numbers possibly with decimals after 'HGT', 'HT', 'HB', 'JB', 'Q'
      const modelMatch = model.match(/HGT[HTJBQ]*(\d+(\.\d+)?)/i); // Corrected regex escape
      if (modelMatch && modelMatch[1]) {
          const modelTorque = safeParseFloat(modelMatch[1]);
          if (modelTorque !== undefined && modelTorque > 0) {
               // Assume model number is in kN·m
               torque_value = modelTorque;
               console.log(`fixCouplingTorque: Using model name value for ${model}: ${torque_value} kN·m`);
               return torque_value; // Found it, return
          }
      }
  }

  // 5. Final return
  return torque_value !== undefined && !isNaN(torque_value) && torque_value > 0 ? torque_value : undefined;
};


/**
 * 联轴器选择函数
 * 根据主机扭矩和齿轮箱型号选择合适的高弹性联轴器
 * @param {number} engineTorque 主机扭矩 (N·m)
 * @param {string} gearboxModel 齿轮箱型号
 * @param {Array} couplingsData 联轴器数据数组
 * @param {Object} couplingSpecificationsMap 联轴器规格映射表
 * @param {string} workCondition 工况条件
 * @param {number} temperature 工作温度
 * @param {boolean} hasCover 是否带罩壳
 * @param {number} engineSpeed 主机转速
 * @returns {Object} 选型结果对象
 */
export const selectFlexibleCoupling = (
    engineTorque, // N·m
    gearboxModel,
    couplingsData,
    couplingSpecificationsMap, // 接收联轴器规格映射表
    workCondition = "III类:扭矩变化中等",
    temperature = 30,
    hasCover = false,
    engineSpeed // 主机转速
) => {
    console.log("开始联轴器选择:", { 
        engineTorque, 
        gearboxModel, 
        workCondition, 
        temperature, 
        hasCover, 
        engineSpeed, 
        couplingsCount: couplingsData?.length,
        mapAvailable: !!couplingSpecificationsMap
    });

    if (!engineTorque || engineTorque <= 0) {
        return { success: false, message: "无效的主机扭矩 (N·m)", recommendations: [] };
    }
    
    // 确保couplingsData是数组
    if (!Array.isArray(couplingsData) || couplingsData.length === 0) {
        console.warn("couplingsData不是有效数组或为空在selectFlexibleCoupling中");
        return { success: false, message: "联轴器数据无效或缺失", recommendations: [] };
    }
    
    // 确保couplingSpecificationsMap是对象
    if (!couplingSpecificationsMap || typeof couplingSpecificationsMap !== 'object') {
        console.warn("couplingSpecificationsMap不是有效对象在selectFlexibleCoupling中");
        return { success: false, message: "联轴器规格映射表无效", recommendations: [] };
    }

    // 1. 确定工况系数和温度系数
    const kFactor = couplingWorkFactorMap[workCondition] || couplingWorkFactorMap.default;
    const stFactor = getTemperatureFactor(temperature);
    
    // 计算所需联轴器扭矩 (kN·m)
    const requiredCouplingTorque_kNm = (engineTorque * kFactor * stFactor) / 1000;
  
    console.log(`Required Coupling Torque (kN·m): ${requiredCouplingTorque_kNm.toFixed(3)} (Engine Torque: ${engineTorque.toFixed(2)} N·m, K: ${kFactor.toFixed(2)}, St: ${stFactor.toFixed(2)})`);
  
    // 2. 获取齿轮箱推荐的联轴器信息 (带罩壳会影响推荐型号)
    const { 
        prefix: recommendedPrefix, 
        specific: recommendedModel
    } = getRecommendedCouplingInfo(gearboxModel, hasCover); // Pass hasCover here
    
    console.log(`Recommended coupling for ${gearboxModel} (hasCover=${hasCover}): Specific=${recommendedModel || 'N/A'}, Prefix=${recommendedPrefix || 'N/A'}`);

    // 3. 筛选并打分联轴器
    const eligibleCouplings = [];
    const maxEngineSpeed = engineSpeed || 3000; // 使用引擎转速或默认值
  
    couplingsData.forEach(coupling => {
        // 基本验证每个联轴器对象
        if (!coupling || typeof coupling !== 'object' || !coupling.model) {
            console.warn(`跳过无效的联轴器数据:`, coupling);
            return;
        }
        
        // 验证并修复扭矩单位 (kN·m) - 使用独立函数
        const fixedTorque_kNm = fixCouplingTorque(coupling, couplingSpecificationsMap);

        if (fixedTorque_kNm === undefined || fixedTorque_kNm <= 0) {
            console.warn(`联轴器 ${coupling.model} 无法确定或修正到有效的kN·m扭矩值: ${fixedTorque_kNm}`);
            return; // 跳过扭矩无效或为零的联轴器
        }

        // 从数据或规格获取maxSpeed
        let couplingMaxSpeed = safeParseFloat(coupling.maxSpeed);
        if (isNaN(couplingMaxSpeed) || couplingMaxSpeed <= 0) {
            if (couplingSpecificationsMap[coupling.model] && couplingSpecificationsMap[coupling.model].maxSpeed > 0) {
                couplingMaxSpeed = couplingSpecificationsMap[coupling.model].maxSpeed;
            } else {
                // 如果找不到有效的max speed，假设适合典型的引擎速度，最高3000 rpm
                couplingMaxSpeed = 3000;
                console.warn(`联轴器 ${coupling.model} 缺少有效maxSpeed，默认为3000 rpm`);
            }
        }

        // --- 主要过滤 ---
        // 检查扭矩是否满足要求
        if (fixedTorque_kNm < requiredCouplingTorque_kNm) {
            console.log(`跳过 ${coupling.model}: 扭矩 ${fixedTorque_kNm.toFixed(3)} < 所需 ${requiredCouplingTorque_kNm.toFixed(3)}`);
            return;
        }
        
        // 检查最大速度是否满足要求
        if (couplingMaxSpeed < maxEngineSpeed) {
            console.log(`跳过 ${coupling.model}: 最大速度 ${couplingMaxSpeed} < 引擎速度 ${maxEngineSpeed}`);
            return;
        }
        
        // 检查罩壳要求是否满足（如果hasCover为true，只包括可能有罩壳的型号或特别推荐带罩壳的型号）
        let meetsCoverRequirement = true;
        if (hasCover) {
            const recommendedWithCoverInfo = getRecommendedCouplingInfo(gearboxModel, true);
            const recommendedWithCoverModel = recommendedWithCoverInfo.specific;
            // 如果推荐了特定的带罩壳型号，过滤该型号或明确标记为带罩壳的型号
            if (recommendedWithCoverModel) {
                meetsCoverRequirement = (coupling.model === recommendedWithCoverModel) || 
                                       (coupling.hasCover === true) || 
                                       coupling.model.includes('JB') || 
                                       coupling.model.includes('J') || 
                                       (coupling.model.endsWith('-ZB') && !recommendedModel);
            } else {
                // 如果没有推荐特定的带罩壳型号，只查找
                meetsCoverRequirement = (coupling.hasCover === true) || 
                                       coupling.model.includes('JB') || 
                                       coupling.model.includes('J') || 
                                       coupling.model.endsWith('-ZB');
            }
            // 如果我们按罩壳过滤，并且此型号不符合检查，跳过它
            if (!meetsCoverRequirement) {
                console.log(`跳过 ${coupling.model}: 不满足罩壳要求`);
                return;
            }
        }


        // --- 合格联轴器评分 ---
        const torqueMargin = ((fixedTorque_kNm / requiredCouplingTorque_kNm) - 1) * 100;

        let score = 0;

        // 1. 扭矩余量评分（40分）- 优先选择10-30%的余量
        if (torqueMargin >= 10 && torqueMargin <= 30) score += 40;
        else if (torqueMargin > 30 && torqueMargin <= 50) score += 30;
        else if (torqueMargin > 50) score += 20; // 非常大的余量不太理想
        else if (torqueMargin >= 0 && torqueMargin < 10) score += 25; // 小余量但满足要求

        // 2. 推荐匹配评分（30分）
        if (recommendedModel && coupling.model === recommendedModel) score += 30; // 精确推荐型号匹配
        else if (recommendedPrefix && coupling.model.startsWith(recommendedPrefix)) score += 20; // 推荐前缀匹配
        else score += 5; // 无特定推荐匹配

        // 3. 最大速度余量评分（10分）- 如果存在足够余量，偏好更接近引擎速度的
        const speedMarginPercent = ((couplingMaxSpeed / maxEngineSpeed) - 1) * 100;
        if (speedMarginPercent >= 0 && speedMarginPercent <= 20) score += 10; // 理想速度余量 (0-20%)
        else if (speedMarginPercent > 20 && speedMarginPercent <= 50) score += 8; // 更高速度余量
        else if (speedMarginPercent > 50) score += 5; // 非常高的速度余量（不太理想）
        // 注意：不满足最小速度的联轴器已经被过滤掉。

        // 4. 成本评分（15分）- 价格越低越好。相对于合格联轴器标准化价格。
        const basePrice = coupling.basePrice || coupling.price || 0;
        let normalizedPriceScore = 0; // 稍后在找到最低/最高价格后计算

        // 5. 重量评分（5分）- 重量越轻越好。相对于合格联轴器标准化重量。
        let normalizedWeightScore = 0; // 稍后计算


        eligibleCouplings.push({
          ...coupling,
            torque: fixedTorque_kNm, // 使用修正后的kN·m值
            torqueUnit: "kN·m", // 确保单位设置
            maxSpeed: couplingMaxSpeed, // 使用确定的maxSpeed
            torqueMargin,
            speedMarginPercent,
            basePrice, // 确保基础价格存在
            // factoryPrice稍后将计算以保持价格一致
            score, // 标准化价格/重量前的初始评分
            requiredTorque: requiredCouplingTorque_kNm, // 存储所需扭矩以供参考
        });
    });

    // 在确定所有合格联轴器后标准化价格和重量评分
    if (eligibleCouplings.length > 1) {
       let minPrice = Infinity, maxPrice = 0;
       let minWeight = Infinity, maxWeight = 0;

       eligibleCouplings.forEach(c => {
          const price = c.basePrice || c.price || 0;
          const weight = c.weight || 0;
          if (price > 0) { // 标准化时只考虑有价格的项目
             if (price < minPrice) minPrice = price;
             if (price > maxPrice) maxPrice = price;
          }
          if (weight > 0) { // 标准化时只考虑有重量的项目
             if (weight < minWeight) minWeight = weight;
             if (weight > maxWeight) maxWeight = weight;
          }
       });

       const priceRange = maxPrice - minPrice;
       const weightRange = maxWeight - minWeight;

       eligibleCouplings.forEach(c => {
             let priceScore = 0;
             if (priceRange > 0 && (c.basePrice || c.price || 0) > 0) {
                priceScore = 15 * (1 - (((c.basePrice || c.price) - minPrice) / priceRange) || 0); // 处理潜在的除以零情况（如果minPrice == maxPrice）
             } else if ((c.basePrice || c.price || 0) > 0) { // 单项或零范围
                priceScore = 15;
             } else { // 无有效价格
                 priceScore = 0; // 如果价格缺失，不加分
             }


             let weightScore = 0;
             if (weightRange > 0 && (c.weight || 0) > 0) {
                weightScore = 5 * (1 - (((c.weight || 0) - minWeight) / weightRange) || 0); // 处理潜在的除以零情况
             } else if ((c.weight || 0) > 0) { // 单项或零范围
                weightScore = 5;
             } else { // 无有效重量
                 weightScore = 0; // 如果重量缺失，不加分
             }

          c.score = Math.max(0, Math.min(100, Math.round(c.score + priceScore + weightScore))); // 添加标准化评分
       });
    } else if (eligibleCouplings.length === 1) {
        // 对于单个合格联轴器，如果数据存在，只添加固定价格/重量评分
         if ((eligibleCouplings[0].basePrice || eligibleCouplings[0].price) > 0) eligibleCouplings[0].score = Math.max(0, Math.min(100, Math.round(eligibleCouplings[0].score + 15))); // 添加全部价格评分
         if ((eligibleCouplings[0].weight || 0) > 0) eligibleCouplings[0].score = Math.max(0, Math.min(100, Math.round(eligibleCouplings[0].score + 5))); // 添加全部重量评分
    }


    // 4. 排序
    eligibleCouplings.sort((a, b) => {
        // 主要排序：评分（降序）
        if (b.score !== a.score) return b.score - a.score;
        // 次要排序：偏好更接近15%的扭矩余量
        return Math.abs(a.torqueMargin - 15) - Math.abs(b.torqueMargin - 15);
        // 三级排序：偏好推荐型号/前缀（可选，评分应该已经涵盖这一点）
        // 四级排序：更低价格（如果评分和余量相似）
        const aPrice = a.factoryPrice || calculateFactoryPrice(a);
        const bPrice = b.factoryPrice || calculateFactoryPrice(b);
        return aPrice - bPrice;
    });


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
            warning = warning ? `${warning}; ${scoreWarn}` : `警告: ${scoreWarn}`;
          }

          // 选择后检查推荐匹配
          if (recommendedModel && topPick.model !== recommendedModel) {
             const matchWarn = `注意: 齿轮箱 (${gearboxModel}) 推荐联轴器为 ${recommendedModel}, 但首选联轴器是 ${topPick.model}。`;
              warning = warning ? `${warning}; ${matchWarn}` : matchWarn;
          } else if (!recommendedModel && recommendedPrefix && !topPick.model.startsWith(recommendedPrefix)) {
               const matchWarn = `注意: 齿轮箱 (${gearboxModel}) 推荐联轴器型号前缀为 ${recommendedPrefix}*, 但首选联轴器是 ${topPick.model}。`;
               warning = warning ? `${warning}; ${matchWarn}` : matchWarn;
          }

          // 如果需要罩壳，检查首选项是否是带罩壳型号
          if (hasCover) {
              const topPickHasCoverIndicator = (topPick.hasCover === true) || topPick.model.includes('JB') || topPick.model.includes('J') || topPick.model.endsWith('-ZB'); // 基本检查，添加-ZB检查
              const recommendedCoveredModel = couplingWithCoverMap[recommendedModel] || recommendedModel; // 如果推荐标准型号，获取带罩壳版本
               const topPickMatchesRecommendedCovered = recommendedCoveredModel && topPick.model === recommendedCoveredModel;

              if (!topPickHasCoverIndicator && !topPickMatchesRecommendedCovered) {
                   let coverWarn = `注意: 已选择带罩壳，但首选联轴器(${topPick.model})似乎不带罩壳。`;
                   // 检查数据中是否存在对应的带罩壳型号
                   const correspondingCoveredModel = couplingWithCoverMap[topPick.model];
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

    console.log(`联轴器选择完成。找到 ${eligibleCouplings.length} 个合格联轴器。`);
    if (eligibleCouplings.length > 0) {
        console.log("前五个合格联轴器:", eligibleCouplings.slice(0,5).map(c => ({ 
            model: c.model, 
            score: c.score, 
            torque: c.torque, 
            torqueMargin: c.torqueMargin, 
            maxSpeed: c.maxSpeed 
        })));
    }

    // 6. 返回结果
    const bestMatch = eligibleCouplings.length > 0 ? eligibleCouplings[0] : null;

    // 计算最佳匹配的工厂价格
    let bestMatchFactoryPrice = null;
    let bestMatchMarketPrice = null;
    if(bestMatch) {
        const basePrice = bestMatch.basePrice || bestMatch.price || 0;
        const discountRate = bestMatch.discountRate ?? getDiscountRate(bestMatch.model);
        bestMatchFactoryPrice = bestMatch.factoryPrice || calculateFactoryPrice({ ...bestMatch, basePrice, discountRate });
        bestMatchMarketPrice = calculateMarketPrice({factoryPrice: bestMatchFactoryPrice}); // 计算市场价格
    }


    return {
      success: !!bestMatch,
      message: bestMatch 
        ? `找到最匹配的联轴器: ${bestMatch.model}` 
        : "没有找到合适的联轴器",
          ...(bestMatch ? { // 最佳匹配的属性展开
               model: bestMatch.model,
               torque: bestMatch.torque,
               torqueUnit: "kN·m", // 确保结果中的单位始终是kN·m
               maxTorque: bestMatch.maxTorque,
               maxSpeed: bestMatch.maxSpeed,
               weight: bestMatch.weight,
               price: bestMatch.price, // 保留原始价格字段
               basePrice: bestMatch.basePrice,
               discountRate: bestMatch.discountRate,
               factoryPrice: bestMatchFactoryPrice, // 计算的工厂价格
               packagePrice: bestMatchFactoryPrice, // 包装价格默认为工厂价格
               marketPrice: bestMatchMarketPrice, // 计算的市场价格
               torqueMargin: bestMatch.torqueMargin,
               score: bestMatch.score,
               requiredTorque: requiredCouplingTorque_kNm,
               hasCover: hasCover // 反映请求的罩壳状态
          } : null),
          recommendations: eligibleCouplings.slice(0, 5), // 返回前5个推荐
          requiredCouplingTorque: requiredCouplingTorque_kNm,
          warning: warning
    };
};

/**
 * 备用泵选择函数 - 确保在顶层 (与之前版本相同，无需修改)
 * @param {string} gearboxModel 齿轮箱型号
 * @param {Array} pumpsData 备用泵数据数组
 * @returns {Object} 选型结果对象
 */
export const selectStandbyPump = (gearboxModel, pumpsData) => {
  const pumps = Array.isArray(pumpsData) ? pumpsData : []; // 确保是数组
  if (pumps.length === 0) {
    return { success: false, message: "没有找到备用泵数据" };
  }
  console.log(`选择备用泵，齿轮箱型号: ${gearboxModel}`);

  const recommendedPumpModel = getRecommendedPump(gearboxModel);
  console.log(`模型 ${gearboxModel} 的推荐泵型号: ${recommendedPumpModel}`);

  let matchedPump = null;
  if (recommendedPumpModel) {
    matchedPump = pumps.find(p => p && p.model === recommendedPumpModel);
  }

  if (matchedPump) {
    console.log(`找到完全匹配的备用泵: ${matchedPump.model}`);
    // 确保价格已计算/存在
    const basePrice = matchedPump.basePrice || matchedPump.price || 0;
    const discountRate = matchedPump.discountRate ?? getDiscountRate(matchedPump.model);
    const factoryPrice = matchedPump.factoryPrice || calculateFactoryPrice({ ...matchedPump, basePrice, discountRate }); // 如果缺失则重新计算

    return {
      success: true,
      ...matchedPump,
      basePrice,
      discountRate,
      factoryPrice,
      flow: matchedPump.flow || 0,
      pressure: matchedPump.pressure || 0,
      motorPower: matchedPump.motorPower || 0,
      weight: matchedPump.weight || 0
    };
  } else {
    console.warn(`推荐泵型号 (${recommendedPumpModel}) 在数据中未找到，或无推荐型号。将选择流量最接近的泵。`);
    // 后备：如果特定推荐缺失或未找到，找到合适的泵
    // 更复杂的后备可以基于齿轮箱的油需求选择，如果可用。
    // 目前，让我们只指示失败或选择一个默认（如果需要）。
     if (pumps.length > 0) {
       // 简单后备：选择第一个或具有合理流量的一个
        const fallbackPump = pumps.find(p => p.flow > 5) || pumps[0]; // 示例：选择流量>5的或第一个
        const basePrice = fallbackPump.basePrice || fallbackPump.price || 0;
        const discountRate = fallbackPump.discountRate ?? getDiscountRate(fallbackPump.model);
        const factoryPrice = fallbackPump.factoryPrice || calculateFactoryPrice({ ...fallbackPump, basePrice, discountRate });

        return {
           success: true,
           message: `未找到推荐泵 (${recommendedPumpModel}), 已选择备用 ${fallbackPump.model}`,
           ...fallbackPump,
           basePrice,
           discountRate,
           factoryPrice,
           flow: fallbackPump.flow || 0,
           pressure: fallbackPump.pressure || 0,
           motorPower: fallbackPump.motorPower || 0,
           weight: fallbackPump.weight || 0,
           warning: `未找到推荐泵型号 ${recommendedPumpModel}, 已选择备用 ${fallbackPump.model}` // 添加警告
        };
     } else {
        return { success: false, message: `未找到推荐泵 (${recommendedPumpModel}) 且无备用泵可选` };
     }
  }
};

// 导出函数