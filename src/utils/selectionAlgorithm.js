// src/utils/selectionAlgorithm.js

// 导入映射表和辅助函数
import {
  getRecommendedCouplingInfo,
  couplingWorkFactorMap,
  getTemperatureFactor,
  getRecommendedPump,
  getCouplingSpecifications, // 导入联轴器规格映射
  couplingSpecificationsMap  // 直接导入映射表
} from '../data/gearboxMatchingMaps';
import {
    calculateFactoryPrice,
    calculateMarketPrice, // Import calculateMarketPrice
    getDiscountRate
} from './priceManager'; // Import price calculation functions
import { safeParseFloat } from './dataHelpers';
// Import selection helper functions from couplingSelection.js
import { selectFlexibleCoupling, selectStandbyPump, fixCouplingTorque } from './couplingSelection';


// 定义联轴器罩壳映射（如果需要） - 用于特定型号的罩壳变体
// NOTE: This map might be better placed in gearboxMatchingMaps or a dedicated config if used elsewhere.
const couplingWithCoverMap = {
  'HGTHB5': 'HGTHJB5',
  'HGTHB6.3A': 'HGTHJB6.3A',
  // 添加其他标准型号和其对应的带罩壳型号映射
};

// 增加一个调试选项，可在生产环境中关闭
const DEBUG_MODE = true;
const DEBUG_LOG = (message, data) => {
  if (DEBUG_MODE) {
    if (data) {
      console.log(message, data);
    } else {
      console.log(message);
    }
  }
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
    options = {} // Receive workCondition, temperature, hasCover, application, etc.
) => {
    console.log(`开始 ${gearboxType} 系列齿轮箱选型:`, { enginePower, engineSpeed, targetRatio, thrustRequirement, options });
    
    // 日志记录：检查高弹数据是否正确加载
    console.log("flexibleCouplings 数据:", data?.flexibleCouplings?.length || 0, "条记录");
    if (data?.flexibleCouplings?.length > 0) {
        console.log("flexibleCouplings 示例:", data.flexibleCouplings[0]);
    }

    // --- Parameter validation ---
    if (!enginePower || enginePower <= 0) return { success: false, message: '发动机功率必须大于0' };
    if (!engineSpeed || engineSpeed <= 0) return { success: false, message: '发动机转速必须大于0' };
    if (!targetRatio || targetRatio <= 0) return { success: false, message: '目标减速比必须大于0' };
    if (!data) return { success: false, message: '选型数据不存在' };

    // --- Get specific gearbox data ---
    const gearboxTypeName = `${gearboxType.toLowerCase()}Gearboxes`;
    let gearboxes = data[gearboxTypeName];

    if (!Array.isArray(gearboxes) || gearboxes.length === 0) {
        console.error(`${gearboxType} 系列数据无效或缺失`);
        return { success: false, message: `没有找到 ${gearboxType} 系列齿轮箱数据`, recommendations: [], gearboxTypeUsed: gearboxType };
    }

    // --- Calculate required capacity and torque ---
    const requiredTransferCapacity = enginePower / engineSpeed;
    const engineTorque_Nm = (enginePower * 9550) / engineSpeed; // N·m
    console.log(`计算参数: Required Capacity=${requiredTransferCapacity.toFixed(6)} kW/rpm, Engine Torque=${engineTorque_Nm.toFixed(2)} N·m`);

    // --- 创建失败原因收集器，帮助诊断 ---
    const rejectionReasons = {
        speedRange: 0,
        ratioOutOfRange: 0,
        capacityTooLow: 0, 
        capacityTooHigh: 0,
        thrustInsufficient: 0
    };
    
    // --- 宽松参数设置 ---
    // 放宽减速比偏差百分比限制 (从15%提高到25%)
    const MAX_RATIO_DIFF_PERCENT = 25;  
    
    // 放宽容量余量上限 (从30%提高到50%)
    const MAX_CAPACITY_MARGIN = 50;
    
    // 提供额外信息记录满足部分条件的近似匹配
    let nearMatches = [];

    // --- Filter and score gearboxes ---
    const matchingGearboxes = [];
    for (const gearbox of gearboxes) {
        if (!gearbox || typeof gearbox !== 'object' || !gearbox.model) {
            console.warn(`Skipping invalid gearbox data in ${gearboxType} series:`, gearbox);
            continue;
        }

        let failureReason = null;

        // Check speed range
        if (Array.isArray(gearbox.inputSpeedRange) && gearbox.inputSpeedRange.length === 2) {
            const [minSpeed, maxSpeed] = gearbox.inputSpeedRange;
            if (engineSpeed < minSpeed || engineSpeed > maxSpeed) {
                 DEBUG_LOG(`Skipping ${gearbox.model}: Speed ${engineSpeed} outside range [${minSpeed}, ${maxSpeed}]`);
                 rejectionReasons.speedRange++;
                 failureReason = `转速 ${engineSpeed} 超出范围 [${minSpeed}, ${maxSpeed}]`;
                continue;
            }
        } else {
             console.warn(`Gearbox ${gearbox.model} has invalid inputSpeedRange. Skipping range check.`);
        }

        // Check ratios and find best match
        if (!Array.isArray(gearbox.ratios) || gearbox.ratios.length === 0) {
             console.warn(`Gearbox ${gearbox.model} has no ratios.`);
            continue;
        }

        let bestRatioIndex = -1;
        let minRatioDiff = Infinity;
        let bestRatioDiffPercent = Infinity;
        
        gearbox.ratios.forEach((ratio, index) => {
            if (typeof ratio !== 'number' || isNaN(ratio) || ratio <= 0) {
                 console.warn(`Gearbox ${gearbox.model} has invalid ratio value at index ${index}: ${ratio}`);
                return; // Skip invalid ratios
            }
            const diff = Math.abs(ratio - targetRatio);
            // 计算比例偏差百分比
            const ratioDiffPercent = (diff / targetRatio) * 100;

            // 使用放宽后的条件 (MAX_RATIO_DIFF_PERCENT 替代固定值 15%)
            if (ratioDiffPercent <= MAX_RATIO_DIFF_PERCENT && diff < minRatioDiff) {
                minRatioDiff = diff;
                bestRatioIndex = index;
                bestRatioDiffPercent = ratioDiffPercent;
            }
        });

        if (bestRatioIndex === -1) {
            DEBUG_LOG(`Skipping ${gearbox.model}: No ratio within ${MAX_RATIO_DIFF_PERCENT}% of target ${targetRatio}`);
            rejectionReasons.ratioOutOfRange++;
            failureReason = `没有减速比在目标值 ${targetRatio} 的 ${MAX_RATIO_DIFF_PERCENT}% 偏差范围内`;
            
            // 如果有很接近的比例，也记录下来作为近似匹配
            const closestRatioIndex = gearbox.ratios.reduce((closest, ratio, index) => {
                const diff = Math.abs(ratio - targetRatio);
                const diffPercent = (diff / targetRatio) * 100;
                if (diffPercent < closest.diffPercent) {
                    return { index, diffPercent, ratio };
                }
                return closest;
            }, { index: -1, diffPercent: Infinity, ratio: 0 });
            
            if (closestRatioIndex.index !== -1 && closestRatioIndex.diffPercent <= 35) {
                // 记录接近但不完全符合条件的齿轮箱
                const nearMatch = {
                    ...gearbox,
                    selectedRatio: closestRatioIndex.ratio,
                    ratioDiffPercent: closestRatioIndex.diffPercent,
                    failureReason
                };
                nearMatches.push(nearMatch);
            }
            
            continue; // 没有找到符合条件的比例
        }

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
        if (capacity <= 0) {
             console.warn(`Skipping ${gearbox.model}: Capacity is not positive (${capacity})`);
            continue; // Skip if capacity is not positive
        }
        const capacityMargin = ((capacity - requiredTransferCapacity) / requiredTransferCapacity) * 100;

        // 检查容量余量要求 (使用放宽后的参数)
        if (capacity < requiredTransferCapacity) {
            DEBUG_LOG(`Skipping ${gearbox.model}: Capacity ${capacity} too low (Required ${requiredTransferCapacity})`);
            rejectionReasons.capacityTooLow++;
            failureReason = `传递能力 ${capacity} 不足以满足需求 ${requiredTransferCapacity.toFixed(6)}`;
            
            // 容量接近的情况保存为近似匹配
            if (capacity >= requiredTransferCapacity * 0.85) {
                const nearMatch = {
                    ...gearbox,
                    selectedRatio: gearbox.ratios[bestRatioIndex],
                    selectedCapacity: capacity,
                    capacityMargin: ((capacity - requiredTransferCapacity) / requiredTransferCapacity) * 100,
                    ratioDiffPercent: bestRatioDiffPercent,
                    failureReason
                };
                nearMatches.push(nearMatch);
            }
            
            continue;
        }
        
        if (capacityMargin > MAX_CAPACITY_MARGIN) {
            DEBUG_LOG(`Skipping ${gearbox.model}: Capacity margin ${capacityMargin.toFixed(1)}% too high (Max ${MAX_CAPACITY_MARGIN}%)`);
            rejectionReasons.capacityTooHigh++;
            failureReason = `传递能力余量 ${capacityMargin.toFixed(1)}% 超过上限 ${MAX_CAPACITY_MARGIN}%`;
            
            // 余量接近的情况保存为近似匹配
            if (capacityMargin <= MAX_CAPACITY_MARGIN * 1.3) {
                const nearMatch = {
                    ...gearbox,
                    selectedRatio: gearbox.ratios[bestRatioIndex],
                    selectedCapacity: capacity,
                    capacityMargin: capacityMargin,
                    ratioDiffPercent: bestRatioDiffPercent,
                    failureReason
                };
                nearMatches.push(nearMatch);
            }
            
            continue;
        }

         // Check thrust requirement (if specified)
         let thrustMet = true; // Assume met if not specified or no data
         if (thrustRequirement > 0) {
             if (typeof gearbox.thrust === 'number' && !isNaN(gearbox.thrust)) {
                 thrustMet = gearbox.thrust >= thrustRequirement;
                 if (!thrustMet) {
                    DEBUG_LOG(`Gearbox ${gearbox.model} thrust ${gearbox.thrust}kN does not meet requirement ${thrustRequirement}kN`);
                    rejectionReasons.thrustInsufficient++;
                    failureReason = `推力 ${gearbox.thrust}kN 不满足需求 ${thrustRequirement}kN`;
                    
                    // 推力接近的情况保存为近似匹配
                    if (gearbox.thrust >= thrustRequirement * 0.8) {
                        const nearMatch = {
                            ...gearbox,
                            selectedRatio: gearbox.ratios[bestRatioIndex],
                            selectedCapacity: capacity,
                            capacityMargin: capacityMargin,
                            ratioDiffPercent: bestRatioDiffPercent,
                            thrustMet: false,
                            failureReason
                        };
                        nearMatches.push(nearMatch);
                    }
                    
                    continue; // 如果推力要求不满足，则跳过
                 }
             } else {
                 // Thrust required but gearbox has no thrust data - assume not met or handle based on policy
                 thrustMet = false;
                 console.log(`Gearbox ${gearbox.model} has no thrust data, requirement ${thrustRequirement}kN cannot be verified.`);
                 continue; // 如果没有推力数据，则跳过
             }
         }

        // Calculate减速比偏差百分比 for sorting and display
        const ratioSelected = gearbox.ratios[bestRatioIndex];
        const ratioDiffPercent = (Math.abs(ratioSelected - targetRatio) / targetRatio) * 100;


        // Calculate safety factor (Actual Capacity / Required Capacity)
        const safetyFactor = capacity / requiredTransferCapacity;

        // Ensure price fields are calculated/present
         const gbBasePrice = gearbox.basePrice || gearbox.price || 0;
         const gbDiscountRate = gearbox.discountRate ?? getDiscountRate(gearbox.model);
         const gbFactoryPrice = gearbox.factoryPrice || calculateFactoryPrice({ ...gearbox, basePrice: gbBasePrice, discountRate: gbDiscountRate });


        matchingGearboxes.push({
            ...gearbox,
            selectedRatio: ratioSelected,
            selectedCapacity: capacity,
            capacityMargin: capacityMargin,
            thrustMet: thrustMet, // Record if thrust requirement is met
            ratio: ratioSelected, // Ensure ratio field exists for convenience
            engineTorque: engineTorque_Nm, // Add engine torque for reference (N·m)
            ratioDiffPercent: ratioDiffPercent, // 记录减速比偏差百分比
            safetyFactor: safetyFactor,
            // Ensure price fields are consistent
            basePrice: gbBasePrice,
            price: gbBasePrice, // Ensure price matches basePrice
            discountRate: gbDiscountRate,
            factoryPrice: gbFactoryPrice,
            packagePrice: gbFactoryPrice, // Package price defaults to factory price
            marketPrice: calculateMarketPrice({factoryPrice: gbFactoryPrice}), // Calculate market price
        });
    }

    console.log(`${gearboxType} 系列找到 ${matchingGearboxes.length} 个初步匹配的齿轮箱`);
    
    // 如果没有匹配的齿轮箱，但有近似匹配，提供这些选项和失败原因
    if (matchingGearboxes.length === 0) {
        // 记录失败统计
        console.log(`匹配失败原因统计:`, rejectionReasons);
        
        // 如果有近似匹配，按照匹配程度排序
        if (nearMatches.length > 0) {
            // 对近似匹配进行评分和排序
            nearMatches.forEach(match => {
                let score = 0;
                
                // 按减速比偏差评分
                if (match.ratioDiffPercent <= MAX_RATIO_DIFF_PERCENT) {
                    score += 100 - match.ratioDiffPercent * 2; // 偏差越小，得分越高
                } else {
                    score += 50 - match.ratioDiffPercent; // 超出范围的，分数较低
                }
                
                // 按容量余量评分
                if (match.capacityMargin !== undefined) {
                    if (match.capacityMargin >= 0 && match.capacityMargin <= MAX_CAPACITY_MARGIN) {
                        score += 100 - Math.abs(match.capacityMargin - 15) * 2; // 最佳余量15%左右
                    } else if (match.capacityMargin < 0) {
                        score += 50 + match.capacityMargin; // 容量不足的，分数较低
                    } else {
                        score += 50 - (match.capacityMargin - MAX_CAPACITY_MARGIN) / 2; // 余量过高的，分数较低
                    }
                }
                
                // 按推力要求评分
                if (thrustRequirement > 0) {
                    if (match.thrustMet === true) {
                        score += 100;
                    } else if (match.thrust !== undefined) {
                        score += 50 * (match.thrust / thrustRequirement); // 部分满足
                    }
                }
                
                match.score = score / 3; // 平均分
            });
            
            // 排序
            nearMatches.sort((a, b) => b.score - a.score);
            
            // 限制返回数量
            nearMatches = nearMatches.slice(0, 5);
            
            const mainReason = Object.entries(rejectionReasons)
                .sort((a, b) => b[1] - a[1])
                .filter(entry => entry[1] > 0)
                .map(([reason, count]) => {
                    switch(reason) {
                        case 'speedRange': return '转速超出范围';
                        case 'ratioOutOfRange': return '减速比偏差过大';
                        case 'capacityTooLow': return '传递能力不足';
                        case 'capacityTooHigh': return '传递能力余量过大';
                        case 'thrustInsufficient': return '推力要求不满足';
                        default: return reason;
                    }
                })
                .join('、');
            
            return {
                success: false,
                message: `没有找到符合所有条件的 ${gearboxType} 系列齿轮箱，主要原因: ${mainReason}`,
                recommendations: nearMatches,
                gearboxTypeUsed: gearboxType,
                rejectionReasons,
                engineTorque: engineTorque_Nm,
                requiredTransferCapacity,
                warning: "找到一些接近条件的齿轮箱，但它们不满足全部选型要求。请考虑调整输入参数。"
            };
        }
        
        return { 
            success: false, 
            message: `没有找到符合条件的 ${gearboxType} 系列齿轮箱`, 
            recommendations: [], 
            gearboxTypeUsed: gearboxType,
            rejectionReasons
        };
    }

    // --- Score the matching gearboxes ---
    const scoredGearboxes = matchingGearboxes.map(gearbox => {
        let score = 0;

        // 1. Capacity Margin Score (40 points) - Prioritize 5-20% margin
        if (gearbox.capacityMargin >= 5 && gearbox.capacityMargin <= 20) score += 40;
        else if (gearbox.capacityMargin > 20 && gearbox.capacityMargin <= 30) score += 30; // Up to 30% is acceptable
        else if (gearbox.capacityMargin > 30 && gearbox.capacityMargin <= MAX_CAPACITY_MARGIN) score += 20; // 放宽的标准
        else if (gearbox.capacityMargin >= 0 && gearbox.capacityMargin < 5) score += 25; // Small margin

        // 2. Ratio Match Score (30 points) - More points for closer match
        if (gearbox.ratioDiffPercent <= 3) score += 30; // Very close match
        else if (gearbox.ratioDiffPercent <= 7) score += 25; // Good match
        else if (gearbox.ratioDiffPercent <= 12) score += 20; // Acceptable match
        else if (gearbox.ratioDiffPercent <= 18) score += 15; // Wider match after adjustment
        else if (gearbox.ratioDiffPercent <= 25) score += 10; // Borderline match after adjustment

        // 3. Cost-Effectiveness Score (20 points) - Price vs Capacity (Lower is better)
        const basePrice = gearbox.basePrice || gearbox.price || 0;
        let normalizedPriceScore = 0; // Calculate later after finding min/max pricePerCapacity

        // 4. Thrust Match Score (10 points)
        if (thrustRequirement > 0) {
            score += gearbox.thrustMet ? 10 : 0;
             if (!gearbox.thrustMet) console.warn(`Gearbox ${gearbox.model} thrust ${gearbox.thrust} < required ${thrustRequirement}`);
        } else {
            score += 5; // Add some points if thrust wasn't required, as having thrust is a feature
        }

        // Initial score before normalization
        gearbox.score = score;

        // Add price per capacity for normalization later
         if (basePrice > 0 && gearbox.selectedCapacity > 0) {
             gearbox._pricePerCapacity = basePrice / gearbox.selectedCapacity;
         } else {
             gearbox._pricePerCapacity = Infinity; // Mark as very expensive if price/capacity is zero/invalid
         }

        return gearbox; // Return modified gearbox for normalization
    });

     // Normalize Price Score after all matching gearboxes are identified
     if (scoredGearboxes.length > 1) {
        let minPPC = Infinity, maxPPC = 0;
        scoredGearboxes.forEach(g => {
            if (g._pricePerCapacity !== Infinity) {
                 if (g._pricePerCapacity < minPPC) minPPC = g._pricePerCapacity;
                 if (g._pricePerCapacity > maxPPC) maxPPC = g._pricePerCapacity;
            }
        });

        const priceRange = maxPPC - minPPC;

        scoredGearboxes.forEach(g => {
             let priceScore = 0;
             if (g._pricePerCapacity !== Infinity) {
                if (priceRange > 0) {
                    priceScore = 20 * (1 - (g._pricePerCapacity - minPPC) / priceRange); // Lower pricePerCapacity is better (max 20 points)
                } else { // Single item or zero range
                    priceScore = 20;
                }
             } else { // No valid price/capacity
                 priceScore = 0; // No points if price is missing
             }

             g.score = Math.max(0, Math.min(100, Math.round(g.score + priceScore))); // Add normalized price score
             delete g._pricePerCapacity; // Clean up temporary field
        });
     } else if (scoredGearboxes.length === 1) {
        // For a single eligible gearbox, add a fixed price score if price data exists
         if ((scoredGearboxes[0].basePrice || scoredGearboxes[0].price) > 0) {
             scoredGearboxes[0].score = Math.max(0, Math.min(100, Math.round(scoredGearboxes[0].score + 20))); // Add full price score
         } else {
              scoredGearboxes[0].score = Math.max(0, Math.min(100, Math.round(scoredGearboxes[0].score + 5))); // Add minimal price score if no price
         }
     }


    // --- Sort scored gearboxes ---
    scoredGearboxes.sort((a, b) => {
        // Primary sort: score (descending)
        if (b.score !== a.score) return b.score - a.score;
        // Secondary sort: prefer closer capacity margin to 15%
        return Math.abs(a.capacityMargin - 15) - Math.abs(b.capacityMargin - 15);
        // Tertiary sort: prefer closer ratio match
        // if (a.ratioDiffPercent !== b.ratioDiffPercent) return a.ratioDiffPercent - b.ratioDiffPercent;
        // Quaternary sort: lower price (if score and margin are similar)
        const aPrice = a.factoryPrice || calculateFactoryPrice(a);
        const bPrice = b.factoryPrice || calculateFactoryPrice(b);
        return aPrice - bPrice;
    });

    // --- Prepare result ---
    // The recommendations array contains all matched gearboxes with scores
    const recommendations = scoredGearboxes;

    // Select accessories for the *top* recommendation based on the final sorting
    const topRecommendation = recommendations.length > 0 ? recommendations[0] : null;

    let finalCouplingResult = null;
    let finalPumpResult = null;
    let couplingWarning = null;
    let pumpWarning = null;

    if (topRecommendation) {
        // Select accessories passing engineSpeed
        console.log("开始为齿轮箱选择联轴器...");
        console.log("flexibleCouplings数据:", data.flexibleCouplings?.length || 0, "条");
        if (data.flexibleCouplings?.length > 0) {
            console.log("联轴器示例:", {
                model: data.flexibleCouplings[0].model,
                torque: data.flexibleCouplings[0].torque,
                maxTorque: data.flexibleCouplings[0].maxTorque,
                maxSpeed: data.flexibleCouplings[0].maxSpeed
            });
        }
        
        // 修改这里：使用couplingSpecificationsMap而不是getCouplingSpecifications
        const couplingRes = selectFlexibleCoupling(
            engineTorque_Nm, // Pass engine torque in N·m
            topRecommendation.model,
            data.flexibleCouplings,
            couplingSpecificationsMap, // 使用映射表而不是函数
            options.workCondition,
            options.temperature,
            options.hasCover,
            engineSpeed // Pass engine speed
        );
        
        finalCouplingResult = couplingRes.success ? couplingRes : null; // Only keep if selection was successful
        couplingWarning = couplingRes.warning; // Keep coupling specific warning

        const pumpRes = selectStandbyPump(topRecommendation.model, data.standbyPumps);
        finalPumpResult = pumpRes.success ? pumpRes : null; // Only keep if selection was successful
         pumpWarning = pumpRes.warning; // Keep pump specific warning
    }


    const result = {
        success: recommendations.length > 0, // Success if at least one gearbox found
        message: recommendations.length > 0
                   ? `在 ${gearboxType} 系列中找到 ${recommendations.length} 个符合条件的齿轮箱`
                   : `在 ${gearboxType} 系列中没有找到符合条件的齿轮箱`,
        recommendations: recommendations.map(g => ({ ...g, power: enginePower, speed: engineSpeed })), // Include all recommendations with derived info
        flexibleCoupling: finalCouplingResult, // Accessories selected for the *top* recommendation
        standbyPump: finalPumpResult,
        engineTorque: engineTorque_Nm, // Engine torque in N·m for reference
        requiredTransferCapacity: requiredTransferCapacity,
        gearboxTypeUsed: gearboxType, // Identify the type searched
        // Include original requirements for reference
        enginePower: enginePower,
        engineSpeed: engineSpeed,
        targetRatio: targetRatio,
        thrustRequirement: thrustRequirement,
        options: options // Store options used
    };

    // --- Add consolidated warning ---
    let consolidatedWarning = null;
    if (result.success && topRecommendation) {
        if (topRecommendation.capacityMargin < 5) consolidatedWarning = `警告：首选齿轮箱(${topRecommendation.model})功率余量(${topRecommendation.capacityMargin.toFixed(1)}%)过低`;
        if (thrustRequirement > 0 && !topRecommendation.thrustMet) {
             const thrustWarn = `警告：首选齿轮箱(${topRecommendation.model})推力不满足要求(${thrustRequirement}kN)`;
              consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${thrustWarn}` : thrustWarn;
        }
        if (topRecommendation.ratioDiffPercent > 10) {
            const ratioWarning = `注意: 首选齿轮箱(${topRecommendation.model})的减速比(${topRecommendation.selectedRatio.toFixed(2)})与目标值(${targetRatio.toFixed(2)})偏差达${topRecommendation.ratioDiffPercent.toFixed(1)}%。`;
            consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${ratioWarning}` : ratioWarning;
        }

        // Add accessory warnings
        if (couplingWarning) consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${couplingWarning}` : couplingWarning;
        if (pumpWarning) consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${pumpWarning}` : pumpWarning;

    } else if (!result.success) {
        // If no gearboxes were found, the main message is sufficient, but could add detail
         consolidatedWarning = result.message;
    }


    if (consolidatedWarning) {
        result.warning = consolidatedWarning;
    }

    console.log(`${gearboxType} 系列选型最终结果:`, result);

    return result;
};


// --- autoSelectGearbox 函数 (与修改版本一致，包含放宽标准) ---
export const autoSelectGearbox = (requirements, data) => {
    console.log('开始自动选型 (autoSelectGearbox)...', requirements);
    const { motorPower, motorSpeed, targetRatio, thrust, ...options } = requirements;
    
    // 日志记录：检查高弹数据是否正确加载
    console.log("flexibleCouplings 数据:", data?.flexibleCouplings?.length || 0, "条记录");
    if (data?.flexibleCouplings?.length > 0) {
        console.log("flexibleCouplings 示例:", data.flexibleCouplings[0]);
    }

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
    let allResults = []; // 存储所有系列的选型结果，用于分析

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
        
        allResults.push(result); // 保存完整结果
        
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
            console.log(`${type} 系列没有找到完全符合条件的齿轮箱: ${result.message}`);
            
            // 如果有近似匹配的推荐，也加入总推荐列表，但降低评分
            if (result.recommendations && result.recommendations.length > 0) {
                console.log(`${type} 系列找到 ${result.recommendations.length} 个近似推荐`);
                result.recommendations.forEach(rec => {
                    rec.originalType = type;
                    rec.isPartialMatch = true; // 标记为部分匹配
                    
                    // 降低近似匹配的评分
                    if (rec.score) {
                        rec.score = rec.score * 0.85; // 降低15%
                    }
                    
                    // 添加失败原因
                    rec.failureReason = rec.failureReason || "不满足部分选型条件";
                });
                
                // 只添加评分较高的近似匹配
                const topPartialMatches = result.recommendations
                    .filter(rec => rec.score > 60)
                    .slice(0, 2); // 每个系列最多添加2个近似匹配
                    
                if (topPartialMatches.length > 0) {
                    allRecommendations.push(...topPartialMatches);
                }
            }
        }
    });

    console.log(`总共找到 ${allRecommendations.length} 个来自不同系列的推荐`);

    // 如果没有找到任何推荐，尝试返回近似匹配
    if (allRecommendations.length === 0) {
        // 查找所有结果中的近似匹配
        const allNearMatches = allResults
            .filter(r => r.recommendations && r.recommendations.length > 0)
            .flatMap(r => r.recommendations.map(rec => ({
                ...rec,
                originalType: r.gearboxTypeUsed
            })));
            
        if (allNearMatches.length > 0) {
            // 对近似匹配进行评分
            allNearMatches.forEach(match => {
                let score = 0;
                // 基于之前的评分逻辑，可能会更复杂
                match.score = match.score || 50; // 默认分数
            });
            
            // 排序并限制数量
            allNearMatches.sort((a, b) => b.score - a.score);
            const bestNearMatches = allNearMatches.slice(0, 5);
            
            return {
                success: false,
                message: '在所有相关系列中均未找到完全符合条件的齿轮箱，但有一些近似匹配',
                recommendations: bestNearMatches,
                engineTorque: motorPower * 9550 / motorSpeed,
                requiredTransferCapacity: motorPower / motorSpeed,
                warning: "以下是部分符合条件的齿轮箱，请评估是否可以调整需求或选择其他参数。",
                allResults // 包含所有系列的选型结果
            };
        }
        
        return {
            success: false,
            message: '在所有相关系列中均未找到符合条件的齿轮箱',
            allResults // 包含所有系列的选型结果，帮助诊断
        };
    }

    // 2. Sort all combined recommendations globally
    allRecommendations.sort((a, b) => {
        // 首先区分完全匹配和部分匹配
        if (a.isPartialMatch !== b.isPartialMatch) {
            return a.isPartialMatch ? 1 : -1; // 完全匹配优先
        }
        
        // Primary sort: score (descending), apply only if difference > 5
        if (Math.abs(b.score - a.score) > 5) { // Only use score if difference is significant
            return b.score - a.score;
        }
        // Secondary sort: prefer ideal capacity margin (10-20%)
        const aIdealMargin = a.capacityMargin >= 10 && a.capacityMargin <= 20;
        const bIdealMargin = b.capacityMargin >= 10 && b.capacityMargin <= 20;
        if (aIdealMargin && !bIdealMargin) return -1;
        if (!aIdealMargin && bIdealMargin) return 1;
        // Tertiary sort: closeness to ideal 15% margin
        return Math.abs(a.capacityMargin - 15) - Math.abs(b.capacityMargin - 15);
        // Quaternary sort: closer ratio match
        // return a.ratioDiffPercent - b.ratioDiffPercent;
    });

    // 3. Select the best overall gearbox
    const bestOverallGearbox = allRecommendations[0];
    const bestType = bestOverallGearbox.originalType;
    console.log(`自动选型最终推荐: ${bestOverallGearbox.model} (来自 ${bestType} 系列), 评分: ${bestOverallGearbox.score}`);

    // 4. Re-select accessories specifically for the chosen best gearbox
    const engineTorque_Nm = bestOverallGearbox.engineTorque || (motorPower * 9550) / motorSpeed;
    
    // 修改这里：使用couplingSpecificationsMap而不是getCouplingSpecifications
    console.log("开始选择高弹联轴器...");
    const finalCouplingResult = selectFlexibleCoupling(
        engineTorque_Nm, // Pass engine torque in N·m
        bestOverallGearbox.model,
        data.flexibleCouplings,
        couplingSpecificationsMap, // 使用映射表而不是函数
        options.workCondition,
        options.temperature,
        options.hasCover,
        motorSpeed // Pass engine speed
    );
    
    console.log("联轴器选择结果:", finalCouplingResult?.success ? "成功" : "失败", 
                 finalCouplingResult?.model || "(无匹配型号)");
    
    const finalPumpResult = selectStandbyPump(bestOverallGearbox.model, data.standbyPumps);

    // 5. Build the final result object
    const finalResult = {
        success: true,
        message: `自动选型完成，最佳推荐来自 ${bestType} 系列。`,
        recommendations: allRecommendations, // Return all sorted recommendations from all types
        flexibleCoupling: finalCouplingResult,
        standbyPump: finalPumpResult,
        engineTorque: engineTorque_Nm, // Engine torque in N·m for reference
        requiredTransferCapacity: motorPower / motorSpeed,
        recommendedType: bestType, // Indicate the type of the top recommendation
        gearboxTypeUsed: 'auto',   // Indicate this was an auto selection
        // Include original requirements for context
        enginePower: motorPower,
        engineSpeed: motorSpeed,
        targetRatio: targetRatio,
        thrustRequirement: thrust,
        options: options, // Store options used
        partialMatchCount: allRecommendations.filter(r => r.isPartialMatch).length // 统计部分匹配的数量
    };

    // 6. Generate final consolidated warning
    let consolidatedWarning = null;
    if (finalResult.success && bestOverallGearbox) {
        if (bestOverallGearbox.isPartialMatch) {
            consolidatedWarning = `警告：最终推荐的齿轮箱(${bestOverallGearbox.model})是部分匹配结果，${bestOverallGearbox.failureReason || '不完全满足所有要求'}`;
        }
        
        if (bestOverallGearbox.capacityMargin < 5) {
            const capacityWarning = `警告：最终推荐齿轮箱(${bestOverallGearbox.model})功率余量(${bestOverallGearbox.capacityMargin.toFixed(1)}%)过低`;
            consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${capacityWarning}` : capacityWarning;
        }
        
        if (thrust > 0 && !bestOverallGearbox.thrustMet) {
             const thrustWarn = `警告：最终推荐齿轮箱(${bestOverallGearbox.model})推力不满足要求(${thrust}kN)`;
              consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${thrustWarn}` : thrustWarn;
        }
        
        if (bestOverallGearbox.ratioDiffPercent > 10) {
            const ratioWarning = `注意: 最终推荐齿轮箱(${bestOverallGearbox.model})的减速比(${bestOverallGearbox.selectedRatio.toFixed(2)})与目标值(${targetRatio.toFixed(2)})偏差达${bestOverallGearbox.ratioDiffPercent.toFixed(1)}%。`;
            consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${ratioWarning}` : ratioWarning;
        }

        // Add accessory warnings
        if (finalCouplingResult?.warning) consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${finalCouplingResult.warning}` : finalCouplingResult.warning;
        if (finalPumpResult?.warning) consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${finalPumpResult.warning}` : finalPumpResult.warning;

    } else if (!finalResult.success) {
        // If no gearboxes were found, the main message is sufficient, but could add detail
         consolidatedWarning = finalResult.message;
    }


    if (consolidatedWarning) {
        finalResult.warning = consolidatedWarning;
    }

    console.log("Auto Select Final Result:", finalResult);
    return finalResult;
};