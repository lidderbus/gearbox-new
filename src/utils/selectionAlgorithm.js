// src/utils/selectionAlgorithm.js

// 导入映射表
import { 
  getRecommendedCouplingInfo, 
  couplingWorkFactorMap, 
  getTemperatureFactor, 
  getRecommendedPump 
} from '../data/gearboxMatchingMaps';
import { calculateFactoryPrice, getDiscountRate } from '../data/priceDiscount';

// 定义联轴器罩壳映射
const couplingWithCoverMap = {
  'HGTHB5': 'HGTHJB5',
  'HGTHB6.3A': 'HGTHJB6.3A'
};

// 备用泵选择函数 - 确保在顶层
export const selectStandbyPump = (gearboxModel, pumpsData) => {
  const pumps = pumpsData; 
  if (!pumps || pumps.length === 0) {
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
    const basePrice = matchedPump.basePrice || matchedPump.price || 0;
    const discountRate = matchedPump.discountRate ?? getDiscountRate(matchedPump.model);
    const factoryPrice = matchedPump.factoryPrice || calculateFactoryPrice({ ...matchedPump, basePrice });

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
    if (pumps.length > 0) {
      console.log(`选择第一个可用泵作为备用: ${pumps[0].model}`);
      const fallbackPump = pumps[0];
      const basePrice = fallbackPump.basePrice || fallbackPump.price || 0;
      const discountRate = fallbackPump.discountRate ?? getDiscountRate(fallbackPump.model);
      const factoryPrice = fallbackPump.factoryPrice || calculateFactoryPrice({ ...fallbackPump, basePrice });
      return {
        success: true,
        message: `未找到推荐型号 ${recommendedPumpModel}, 已选择备用 ${fallbackPump.model}`,
        ...fallbackPump,
        basePrice,
        discountRate,
        factoryPrice,
        flow: fallbackPump.flow || 0,
        pressure: fallbackPump.pressure || 0,
        motorPower: fallbackPump.motorPower || 0,
        weight: fallbackPump.weight || 0
      };
    } else {
      return { success: false, message: `未找到推荐泵 (${recommendedPumpModel}) 且无备用泵可选` };
    }
  }
};

export const selectFlexibleCoupling = (
    engineTorque,
    gearboxModel,
    couplingsData,
    workCondition = "III类:扭矩变化中等",
    temperature = 30,
    hasCover = false
) => {
    console.log("开始联轴器选择:", { engineTorque, gearboxModel, workCondition, temperature, hasCover, couplingsCount: couplingsData?.length });

    if (!engineTorque || engineTorque <= 0) {
        return { success: false, message: "无效的主机扭矩", recommendations: [] };
    }
    // Ensure couplingsData is an array
    if (!Array.isArray(couplingsData) || couplingsData.length === 0) {
        console.warn("couplingsData is not a valid array in selectFlexibleCoupling");
        return { success: false, message: "联轴器数据无效或缺失", recommendations: [] };
    }

    // 1. 确定工况系数和温度系数
    const kFactor = couplingWorkFactorMap[workCondition] || couplingWorkFactorMap.default;
    const stFactor = getTemperatureFactor(temperature);
    const requiredCouplingTorque = engineTorque * kFactor * stFactor / 1000; // Convert N·m to kN·m and apply factors
    console.log(`Required Coupling Torque (kN·m): ${requiredCouplingTorque.toFixed(3)} (Engine: ${engineTorque.toFixed(2)} N·m, K: ${kFactor}, St: ${stFactor})`);

    // 2. 获取齿轮箱推荐的联轴器信息
    const {
       prefix: recommendedPrefix,
       specific: recommendedModel
    } = getRecommendedCouplingInfo(gearboxModel, hasCover);
    console.log(`Recommended coupling for ${gearboxModel}: Specific=${recommendedModel || 'N/A'}, Prefix=${recommendedPrefix || 'N/A'}`);

    // 3. 筛选并打分联轴器
    const eligibleCouplings = [];
    couplingsData.forEach(coupling => {
        // Basic validation for each coupling object
        if (!coupling || typeof coupling !== 'object' || !coupling.model || typeof coupling.torque !== 'number' || coupling.torque <= 0) {
             console.warn(`Skipping invalid coupling data:`, coupling);
            return;
        }

        // 扭矩检查
        if (coupling.torque >= requiredCouplingTorque) {
            const torqueMargin = ((coupling.torque / requiredCouplingTorque) - 1) * 100;

            // 评分逻辑
            let score = 0;

            // 扭矩余量评分 (50分) - 优先选择10-30%余量
            if (torqueMargin >= 10 && torqueMargin <= 30) {
                score += 50; // 最佳余量范围(10-30%)
            } else if (torqueMargin > 30 && torqueMargin <= 50) {
                score += 40; // 余量偏大(30-50%)
            } else if (torqueMargin > 50) {
                score += 30; // 余量过大(>50%)
            } else { // 0 <= torqueMargin < 10
                score += 35; // 余量偏小但满足要求(0-10%)
            }

            // 推荐匹配评分 (30分)
            if (recommendedModel && coupling.model === recommendedModel) score += 30; // 完全匹配
            else if (recommendedPrefix && coupling.model.startsWith(recommendedPrefix)) score += 20; // 前缀匹配
            else score += 5; // 无匹配

            // 转速匹配评分 (10分) - 假设与发动机转速匹配，需要 engineSpeed
            // If engineSpeed is not available here, we might need to pass it or use a default
            // const engineSpeed = ???; // Need engine speed for this check
            // For now, assume speed is met or use a simplified check
            if (coupling.maxSpeed) { // Check if maxSpeed exists
                // Simplified: Give points if maxSpeed is reasonable (e.g., > 1000)
                 if (coupling.maxSpeed >= 1800) score += 10;
                 else if (coupling.maxSpeed >= 1200) score += 5;
            } else {
                 score += 2; // No speed info, low score
            }
            // A better implementation would pass engineSpeed to this function


            // 重量评分 (5分) - 越轻越好 (Normalized)
            const maxWeight = 2500; // Assume max coupling weight for normalization
            const weightScore = Math.max(0, 5 * (1 - (coupling.weight || maxWeight) / maxWeight));
            score += weightScore;

            // 价格评分 (5分) - 越便宜越好 (Normalized)
            const maxPrice = 300000; // Assume max coupling price for normalization
            const priceScore = Math.max(0, 5 * (1 - (coupling.price || maxPrice) / maxPrice));
            score += priceScore;


            // 确保分数在0-100范围内
            score = Math.max(0, Math.min(100, Math.round(score)));

            // 确保价格相关字段存在
            const basePrice = coupling.basePrice || coupling.price || 0;
            const discountRateValue = coupling.discountRate; // Keep original or undefined
            const factoryPrice = coupling.factoryPrice || calculateFactoryPrice({
                ...coupling,
                basePrice
            });

            eligibleCouplings.push({
                ...coupling,
                torqueMargin,
                score,
                basePrice,
                discountRate: discountRateValue,
                factoryPrice,
                requiredTorque: requiredCouplingTorque, // Store required torque for reference
                 // speedMet: coupling.maxSpeed >= engineSpeed // Add this if engineSpeed is available
            });
        }
    });

    // 4. 排序
    eligibleCouplings.sort((a, b) => b.score - a.score);

    // 5. 添加警告信息
    let warning = null;
    if (eligibleCouplings.length > 0) {
        const topRec = eligibleCouplings[0];
        if (topRec.torqueMargin < 5) {
            warning = `警告: 首选推荐联轴器(${topRec.model})的扭矩余量(${topRec.torqueMargin.toFixed(1)}%)非常低(<5%)。`;
        } else if (topRec.torqueMargin < 10) {
            warning = `注意: 首选推荐联轴器(${topRec.model})的扭矩余量(${topRec.torqueMargin.toFixed(1)}%)较低(<10%)。`;
        } else if (topRec.torqueMargin > 50) {
            warning = `注意: 首选推荐联轴器(${topRec.model})的扭矩余量(${topRec.torqueMargin.toFixed(1)}%)较高(>50%)，可能过度选型。`;
        }

        if (topRec.score < 60) {
            const scoreWarn = `首选推荐联轴器(${topRec.model})综合评分(${topRec.score})较低(<60)。`;
            warning = warning ? `${warning} ${scoreWarn}` : `警告: ${scoreWarn}`;
        }

        if (recommendedModel && topRec.model !== recommendedModel &&
            (!recommendedPrefix || !topRec.model.startsWith(recommendedPrefix))) {
            const matchWarn = `首选推荐联轴器(${topRec.model})与齿轮箱(${gearboxModel})的建议匹配(${recommendedModel || recommendedPrefix+'*'})不同。`;
            warning = warning ? `${warning} ${matchWarn}` : `注意: ${matchWarn}`;
        }

        // 如果需要带罩壳但选用的不是罩壳型号
         // Use the couplingWithCoverMap to find the corresponding covered model
         const coveredModelKey = Object.keys(couplingWithCoverMap).find(key => couplingWithCoverMap[key] === topRec.model);
         const standardModelForCover = Object.keys(couplingWithCoverMap).find(key => couplingWithCoverMap[key] === recommendedModel);

        if (hasCover && !topRec.model.includes('JB') && !(coveredModelKey || standardModelForCover) && (recommendedModel === 'HGTHB5' || recommendedModel === 'HGTHB6.3A')) {
           // Only warn if a cover is requested AND the recommended/selected model IS one that *has* a cover option but the non-covered version was chosen.
           const expectedCoverModel = couplingWithCoverMap[topRec.model] || `HGTHJ${topRec.model.substring(4)}`; // Attempt to construct expected name
           const coverWarn = `已选择带罩壳配置，但推荐的联轴器(${topRec.model})不是罩壳型号，建议使用${expectedCoverModel}。`;
           warning = warning ? `${warning} ${coverWarn}` : `注意: ${coverWarn}`;
        }
    }

    console.log(`Coupling selection finished. Found ${eligibleCouplings.length} eligible couplings.`);

    // 6. 返回结果
    const bestMatch = eligibleCouplings.length > 0 ? eligibleCouplings[0] : null;

    return {
        success: !!bestMatch,
        message: bestMatch ? `找到最匹配的联轴器: ${bestMatch.model}` : "没有找到合适的联轴器",
        ...(bestMatch), // Expand best match properties (model, torque, score, prices, etc.)
        recommendations: eligibleCouplings.slice(0, 5), // Return top 5 recommendations
        requiredCouplingTorque: requiredCouplingTorque,
        warning: warning
    };
};


// --- selectGearbox 函数 ---
// Now receives options object containing coupling parameters
export const selectGearbox = (
    enginePower,
    engineSpeed,
    targetRatio,
    thrustRequirement = 0,
    gearboxType = 'HC', // Expecting a single type like 'HC', 'GW', etc.
    data,
    options = {} // Receive workCondition, temperature, hasCover, application
) => {
    console.log(`开始 ${gearboxType} 系列齿轮箱选型:`, { enginePower, engineSpeed, targetRatio, thrustRequirement, options });

    // --- Parameter validation ---
    if (!enginePower || enginePower <= 0) return { success: false, message: '发动机功率必须大于0' };
    if (!engineSpeed || engineSpeed <= 0) return { success: false, message: '发动机转速必须大于0' };
    if (!targetRatio || targetRatio <= 0) return { success: false, message: '目标减速比必须大于0' };
    if (!data) return { success: false, message: '选型数据不存在' };

    // --- Get specific gearbox data ---
    const gearboxTypeName = `${gearboxType.toLowerCase()}Gearboxes`;
    const gearboxes = data[gearboxTypeName];

    if (!Array.isArray(gearboxes) || gearboxes.length === 0) {
        console.error(`${gearboxType} 系列数据无效或缺失`);
        return { success: false, message: `没有找到 ${gearboxType} 系列齿轮箱数据`, recommendations: [], gearboxTypeUsed: gearboxType };
    }

    // --- Calculate required capacity and torque ---
    const requiredTransferCapacity = enginePower / engineSpeed;
    const engineTorque = (enginePower * 9550) / engineSpeed; // N·m
    console.log(`计算参数: Required Capacity=${requiredTransferCapacity.toFixed(6)} kW/rpm, Engine Torque=${engineTorque.toFixed(2)} N·m`);

    // --- Filter and score gearboxes ---
    const matchingGearboxes = [];
    for (const gearbox of gearboxes) {
        if (!gearbox || typeof gearbox !== 'object' || !gearbox.model) {
            console.warn(`Skipping invalid gearbox data in ${gearboxType} series:`, gearbox);
            continue;
        }

        // Check speed range
        if (Array.isArray(gearbox.inputSpeedRange) && gearbox.inputSpeedRange.length === 2) {
            const [minSpeed, maxSpeed] = gearbox.inputSpeedRange;
            if (engineSpeed < minSpeed || engineSpeed > maxSpeed) continue;
        } else {
             console.warn(`Gearbox ${gearbox.model} has invalid inputSpeedRange. Skipping range check.`);
        }


        // Check ratios and find best match
        if (!Array.isArray(gearbox.ratios) || gearbox.ratios.length === 0) continue;

        let bestRatioIndex = -1;
        let minRatioDiff = Infinity;
        gearbox.ratios.forEach((ratio, index) => {
            if (typeof ratio !== 'number') return; // Skip invalid ratios
            const diff = Math.abs(ratio - targetRatio);
            if (diff < minRatioDiff) {
                minRatioDiff = diff;
                bestRatioIndex = index;
            }
        });

        if (bestRatioIndex === -1) continue; // No valid ratio found
        // Relax ratio difference check slightly for broader matching initially
        // if (minRatioDiff > 1.0) continue; // Allow up to 1.0 difference

        // Get capacity for the best ratio
        let capacity;
        if (Array.isArray(gearbox.transferCapacity) && gearbox.transferCapacity.length > bestRatioIndex && typeof gearbox.transferCapacity[bestRatioIndex] === 'number') {
            capacity = gearbox.transferCapacity[bestRatioIndex];
        } else if (Array.isArray(gearbox.transferCapacity) && gearbox.transferCapacity.length > 0 && typeof gearbox.transferCapacity[0] === 'number') {
             // Fallback to first capacity if array exists but index is bad or value invalid
             capacity = gearbox.transferCapacity[0];
             console.warn(`Gearbox ${gearbox.model} using fallback capacity due to index/value issue at ratio index ${bestRatioIndex}`);
        } else if (typeof gearbox.transferCapacity === 'number') {
            capacity = gearbox.transferCapacity; // Single value case
        } else {
            console.warn(`Gearbox ${gearbox.model} has invalid transferCapacity data.`);
            continue; // Skip if capacity data is unusable
        }


        // Calculate capacity margin
        if (capacity <= 0) continue; // Skip if capacity is not positive
        const capacityMargin = ((capacity - requiredTransferCapacity) / requiredTransferCapacity) * 100;

        // Check capacity requirement (margin must be non-negative)
        if (capacity < requiredTransferCapacity) continue;

         // Check thrust requirement (if specified)
         let thrustMet = true; // Assume met if not specified or no data
         if (thrustRequirement > 0) {
             if (typeof gearbox.thrust === 'number') {
                 thrustMet = gearbox.thrust >= thrustRequirement;
                 if (!thrustMet) {
                    console.log(`Gearbox ${gearbox.model} thrust ${gearbox.thrust}kN does not meet requirement ${thrustRequirement}kN`);
                    // Don't filter out immediately, let scoring handle it or decide later
                    // continue; // Optionally filter out here
                 }
             } else {
                 // Thrust required but gearbox has no thrust data - assume not met or handle based on policy
                 thrustMet = false;
                 console.log(`Gearbox ${gearbox.model} has no thrust data, requirement ${thrustRequirement}kN cannot be verified.`);
                 // continue; // Optionally filter out here
             }
         }

        matchingGearboxes.push({
            ...gearbox,
            selectedRatio: gearbox.ratios[bestRatioIndex],
            selectedCapacity: capacity,
            capacityMargin: capacityMargin,
            thrustMet: thrustMet, // Record if thrust requirement is met
            ratio: gearbox.ratios[bestRatioIndex], // Ensure ratio field exists
            engineTorque: engineTorque // Add engine torque for reference
        });
    }

    console.log(`${gearboxType} 系列找到 ${matchingGearboxes.length} 个初步匹配的齿轮箱`);

    if (matchingGearboxes.length === 0) {
        return { success: false, message: `没有找到符合条件的 ${gearboxType} 系列齿轮箱`, recommendations: [], gearboxTypeUsed: gearboxType };
    }

    // --- Score the matching gearboxes ---
    const scoredGearboxes = matchingGearboxes.map(gearbox => {
        let score = 0;

        // 1. Capacity Margin Score (40 points) - Using the refined logic
        if (gearbox.capacityMargin >= 5 && gearbox.capacityMargin <= 20) score += 40;
        else if (gearbox.capacityMargin > 20 && gearbox.capacityMargin <= 35) score += 35;
        else if (gearbox.capacityMargin > 35 && gearbox.capacityMargin <= 70) score += 25;
        else if (gearbox.capacityMargin > 70) score += 15;
        else if (gearbox.capacityMargin >= 0 && gearbox.capacityMargin < 5) score += 30; // Margin >= 0 but < 5

        // 2. Ratio Match Score (20 points)
        const ratioDiff = Math.abs(gearbox.selectedRatio - targetRatio);
        if (ratioDiff <= 0.1) score += 20;
        else if (ratioDiff <= 0.3) score += 15;
        else if (ratioDiff <= 0.5) score += 10;
        else score += 5; // Give some points even for larger diff if capacity is met

        // 3. Cost-Effectiveness Score (30 points) - Price vs Capacity
        const basePrice = gearbox.basePrice || gearbox.price || 0;
        if (basePrice > 0 && gearbox.selectedCapacity > 0) {
            const pricePerCapacity = basePrice / gearbox.selectedCapacity;
            // Find min/max pricePerCapacity among *all* matching for normalization
            let minPPC = Infinity, maxPPC = 0;
            matchingGearboxes.forEach(g => {
                const gBasePrice = g.basePrice || g.price || 0;
                if (gBasePrice > 0 && g.selectedCapacity > 0) {
                    const ppc = gBasePrice / g.selectedCapacity;
                    if (ppc < minPPC) minPPC = ppc;
                    if (ppc > maxPPC) maxPPC = ppc;
                }
            });
            const rangePPC = maxPPC - minPPC;
            let normalizedPriceScore = 0.5; // Default if range is 0 or only one item
            if (rangePPC > 0) {
                normalizedPriceScore = 1 - ((pricePerCapacity - minPPC) / rangePPC);
            }
            score += Math.round(normalizedPriceScore * 30);
        } else {
            score += 15; // Add medium score if price/capacity unavailable
        }

        // 4. Thrust Match Score (10 points)
        if (thrustRequirement > 0) {
            score += gearbox.thrustMet ? 10 : 0;
        } else {
            score += 5; // Add some points if thrust wasn't required
        }


        // Calculate safety factor (Actual Capacity / Required Capacity)
        const safetyFactor = gearbox.selectedCapacity / requiredTransferCapacity;

        // Calculate derived prices
         const gbBasePrice = gearbox.basePrice || gearbox.price || 0;
         const gbFactoryPrice = gearbox.factoryPrice || calculateFactoryPrice({ ...gearbox, basePrice: gbBasePrice });


        return {
            ...gearbox,
            score: Math.max(0, Math.min(100, Math.round(score))), // Ensure score is 0-100
            ratioDiff: ratioDiff,
            safetyFactor: safetyFactor,
            // Ensure price fields are consistent
            basePrice: gbBasePrice,
            factoryPrice: gbFactoryPrice,
            discountRate: gearbox.discountRate ?? getDiscountRate(gearbox.model) // Use existing or calculate
        };
    });

    // --- Sort scored gearboxes ---
    scoredGearboxes.sort((a, b) => {
        // Primary sort: score (descending)
        if (Math.abs(b.score - a.score) > 5) { // Only use score if difference is significant
            return b.score - a.score;
        }
        // Secondary sort: prefer ideal capacity margin (10-20%)
        const aIdealMargin = a.capacityMargin >= 10 && a.capacityMargin <= 20;
        const bIdealMargin = b.capacityMargin >= 10 && b.capacityMargin <= 20;
        if (aIdealMargin && !bIdealMargin) return -1;
        if (!aIdealMargin && bIdealMargin) return 1;
        // Tertiary sort: closeness to 15% margin
        return Math.abs(a.capacityMargin - 15) - Math.abs(b.capacityMargin - 15);
        // Quaternary sort: price (ascending) - if needed
        // return (a.basePrice || Infinity) - (b.basePrice || Infinity);
    });


    // --- Prepare result ---
    const selectedGearbox = scoredGearboxes[0]; // The top recommendation after sorting

    // --- Select accessories for the top recommendation ---
    // Pass the engineSpeed for coupling speed check if possible
    const couplingResult = selectFlexibleCoupling(
        engineTorque,
        selectedGearbox.model,
        data.flexibleCouplings,
        options.workCondition,
        options.temperature,
        options.hasCover
        // Pass engineSpeed here if available/needed: options.engineSpeed || engineSpeed
    );
    const pumpResult = selectStandbyPump(selectedGearbox.model, data.standbyPumps);

    const result = {
        success: true,
        message: `找到 ${scoredGearboxes.length} 个符合条件的 ${gearboxType} 齿轮箱`,
        recommendations: scoredGearboxes.map(g => ({ ...g, power: enginePower, speed: engineSpeed })), // Include all recommendations
        flexibleCoupling: couplingResult, // Accessories selected for the *top* recommendation
        standbyPump: pumpResult,
        engineTorque: engineTorque,
        requiredTransferCapacity: requiredTransferCapacity,
        gearboxTypeUsed: gearboxType, // Identify the type searched
        // Include original requirements for reference
        enginePower: enginePower,
        engineSpeed: engineSpeed,
        targetRatio: targetRatio,
        thrustRequirement: thrustRequirement,
        options: options // Store options used
    };

    // --- Add final warning based on the top recommendation ---
    let warning = null;
    if (selectedGearbox.capacityMargin < 5) warning = `警告：${gearboxType}首选齿轮箱(${selectedGearbox.model})功率余量(${selectedGearbox.capacityMargin.toFixed(1)}%)过低`;
    else if (selectedGearbox.capacityMargin > 70) warning = `注意：${gearboxType}首选齿轮箱(${selectedGearbox.model})功率余量(${selectedGearbox.capacityMargin.toFixed(1)}%)过高`;
    if (thrustRequirement > 0 && !selectedGearbox.thrustMet) {
         const thrustWarn = `警告：${gearboxType}首选齿轮箱(${selectedGearbox.model})推力不满足要求(${thrustRequirement}kN)`;
          warning = warning ? `${warning}; ${thrustWarn}` : thrustWarn;
    }
    if (couplingResult?.warning) warning = warning ? `${warning}; ${couplingResult.warning}` : couplingResult.warning;
    if (pumpResult?.warning) warning = warning ? `${warning}; ${pumpResult.warning}` : pumpResult.warning;

    if (warning) {
        result.warning = warning;
    }

    return result;
};


// --- autoSelectGearbox 函数 ---
export const autoSelectGearbox = (requirements, data) => {
    console.log('开始自动选型 (autoSelectGearbox)...', requirements);
    const { motorPower, motorSpeed, targetRatio, thrust, ...options } = requirements;

    // Define types to check, ensure corresponding data keys exist (e.g., hcGearboxes)
    const availableTypes = [
        'HC', 'GW', 'HCM', 'DT', 'HCQ', 'GC'
    ].filter(type => data[`${type.toLowerCase()}Gearboxes`] && Array.isArray(data[`${type.toLowerCase()}Gearboxes`]) && data[`${type.toLowerCase()}Gearboxes`].length > 0);

    if (availableTypes.length === 0) {
        console.error("自动选型失败：没有可用的齿轮箱数据系列。");
        return { success: false, message: '没有可用的齿轮箱数据系列进行自动选型' };
    }

    console.log('将搜索以下齿轮箱类型:', availableTypes);

    let allRecommendations = [];
    // let allResults = []; // Optional: store full results per type for debugging

    // 1. Run selection for each available type
    availableTypes.forEach(type => {
        console.log(`--- 自动选型: 正在检查 ${type} 系列 ---`);
        const result = selectGearbox(
            motorPower,
            motorSpeed,
            targetRatio,
            thrust,
            type, // Specify current type
            data,
            options // Pass options (workCondition, temp, cover, etc.)
        );
        // allResults.push(result);
        if (result.success && result.recommendations.length > 0) {
            console.log(`${type} 系列找到 ${result.recommendations.length} 个推荐`);
            // Add original type info to each recommendation
            result.recommendations.forEach(rec => {
                rec.originalType = type; // Mark where it came from
                 // Optional: Adjust score based on type suitability for requirements
                 // Example: Boost score for GW if power is high
                 if (type === 'GW' && motorPower > 800) rec.score += 5;
                 if (type === 'HCM' && motorSpeed > 2000) rec.score += 3;
            });
            allRecommendations.push(...result.recommendations);
        } else {
            console.log(`${type} 系列没有找到合适的齿轮箱: ${result.message}`);
        }
    });

    console.log(`总共找到 ${allRecommendations.length} 个来自不同系列的推荐`);

    if (allRecommendations.length === 0) {
        return {
            success: false,
            message: '在所有相关系列中均未找到符合条件的齿轮箱'
        };
    }

    // 2. Sort all combined recommendations globally
    allRecommendations.sort((a, b) => {
        // Primary sort: score (descending), apply only if difference > 5
        if (Math.abs(b.score - a.score) > 5) {
            return b.score - a.score;
        }
        // Secondary sort: prefer ideal capacity margin (10-20%)
        const aIdealMargin = a.capacityMargin >= 10 && a.capacityMargin <= 20;
        const bIdealMargin = b.capacityMargin >= 10 && b.capacityMargin <= 20;
        if (aIdealMargin && !bIdealMargin) return -1;
        if (!aIdealMargin && bIdealMargin) return 1;
        // Tertiary sort: closeness to 15% margin
        return Math.abs(a.capacityMargin - 15) - Math.abs(b.capacityMargin - 15);
         // Quaternary sort: price (ascending) - uncomment if needed
        // return (a.basePrice || Infinity) - (b.basePrice || Infinity);
    });

    // 3. Select the best overall gearbox
    const bestOverallGearbox = allRecommendations[0];
    const bestType = bestOverallGearbox.originalType;
    console.log(`自动选型最终推荐: ${bestOverallGearbox.model} (来自 ${bestType} 系列), 评分: ${bestOverallGearbox.score}`);

    // 4. Re-select accessories specifically for the chosen best gearbox
    const engineTorque = bestOverallGearbox.engineTorque || (motorPower * 9550) / motorSpeed;
    const finalCouplingResult = selectFlexibleCoupling(
        engineTorque,
        bestOverallGearbox.model,
        data.flexibleCouplings,
        options.workCondition,
        options.temperature,
        options.hasCover
        // Pass engineSpeed if needed: options.engineSpeed || motorSpeed
    );
    const finalPumpResult = selectStandbyPump(bestOverallGearbox.model, data.standbyPumps);

    // 5. Build the final result object
    const finalResult = {
        success: true,
        message: `自动选型完成，最佳推荐来自 ${bestType} 系列。`,
        recommendations: allRecommendations, // Return all sorted recommendations from all types
        flexibleCoupling: finalCouplingResult,
        standbyPump: finalPumpResult,
        engineTorque: engineTorque,
        requiredTransferCapacity: motorPower / motorSpeed,
        recommendedType: bestType, // Indicate the type of the top recommendation
        gearboxTypeUsed: 'auto',   // Indicate this was an auto selection
        // Include original requirements for context
        enginePower: motorPower,
        engineSpeed: motorSpeed,
        targetRatio: targetRatio,
        thrustRequirement: thrust,
        options: options // Store options used for this selection
    };

    // 6. Generate final consolidated warning
    let finalWarning = null;
    if (bestOverallGearbox.capacityMargin < 5) finalWarning = `警告：最终推荐齿轮箱(${bestOverallGearbox.model})功率余量(${bestOverallGearbox.capacityMargin.toFixed(1)}%)过低`;
    else if (bestOverallGearbox.capacityMargin > 70) finalWarning = `注意：最终推荐齿轮箱(${bestOverallGearbox.model})功率余量(${bestOverallGearbox.capacityMargin.toFixed(1)}%)过高`;
     if (thrust > 0 && !bestOverallGearbox.thrustMet) {
         const thrustWarn = `警告：最终推荐齿轮箱(${bestOverallGearbox.model})推力不满足要求(${thrust}kN)`;
          finalWarning = finalWarning ? `${finalWarning}; ${thrustWarn}` : thrustWarn;
    }
    if (finalCouplingResult?.warning) finalWarning = finalWarning ? `${finalWarning}; ${finalCouplingResult.warning}` : finalCouplingResult.warning;
    if (finalPumpResult?.warning) finalWarning = finalWarning ? `${finalWarning}; ${finalPumpResult.warning}` : finalPumpResult.warning;

    // Example type-based warning
    if (motorPower < 150 && bestType === 'GW') {
        const typeWarning = `注意: 发动机功率较低(${motorPower}kW)，但自动选择了大功率GW系列(${bestOverallGearbox.model})。请确认是否适用。`;
        finalWarning = finalWarning ? `${finalWarning}; ${typeWarning}` : typeWarning;
    }
     if (motorSpeed < 1000 && bestType === 'HCM') {
        const typeWarning = `注意: 发动机转速较低(${motorSpeed}rpm)，但自动选择了高速HCM系列(${bestOverallGearbox.model})。请确认是否适用。`;
        finalWarning = finalWarning ? `${finalWarning}; ${typeWarning}` : typeWarning;
    }

    if (finalWarning) {
        finalResult.warning = finalWarning;
    }

    console.log("Auto Select Final Result:", finalResult);
    return finalResult;
};
