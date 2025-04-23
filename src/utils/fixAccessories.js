// src/utils/fixAccessories.js
/**
 * 高弹联轴器 & 备用泵 补齐工具
 * 所有魔数统一来自 config.DEFAULTS
 */
import { DEFAULTS } from '../config';
// Assuming estimateTransferCapacityArray is correctly imported from './capacityEstimator'
import { estimateTransferCapacityArray } from './capacityEstimator';
import { safeParseFloat } from './dataHelpers'; // Import safeParseFloat
import { couplingSpecificationsMap } from '../data/gearboxMatchingMaps'; // Import couplingSpecificationsMap

// 可能包含齿轮箱数组的关键字段
const COLLECTION_KEYS = [
  'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
  'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'otherGearboxes', // Add any other gearbox collections
  'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes' // Ensure all gearbox types are covered
];

/**
 * 判断条目是否为高弹型号
 * 规则：存在 _isElastic / isElastic 标记 或 model 以 'E' 结尾
 */
function isElastic(item) {
  if (!item) return false;
  if (item._isElastic === true || item.isElastic === true) return true; // Explicitly check boolean true
  if (typeof item.model === 'string' && item.model.trim().toUpperCase().endsWith('E')) return true;
  return false;
}

/**
 * 判断条目是否带备用泵
 * 规则：hasSparePump === true 或 model 包含 'P'（示例简化）
 */
function hasSparePump(item) {
  if (!item) return false;
  if (item.hasSparePump === true || item._hasSparePump === true) return true; // Explicitly check boolean true
  if (typeof item.model === 'string' && item.model.toUpperCase().includes('P')) return true; // This rule is heuristic, may need refinement
  return false;
}

/**
 * 补齐高弹联轴器相关字段 (应用于齿轮箱对象)
 */
function fixElasticCouplingData(data) {
  if (!data) return { data, patched: 0 };
  let patched = 0;
  COLLECTION_KEYS.forEach(key => {
    const arr = data[key];
    if (Array.isArray(arr)) {
      arr.forEach(item => {
        if (!item || !item.model) return;
        if (!isElastic(item)) return;

        // 标记
        if (!item._isElastic) {
            item._isElastic = true;
            patched++;
        }

        // 价格补齐：高弹价格独立字段或加价？此处直接加价系数
        const currentPrice = safeParseFloat(item.price || item.basePrice);
        if (currentPrice !== undefined && currentPrice > 0) {
            if (safeParseFloat(item.elasticPrice) === undefined || safeParseFloat(item.elasticPrice) <= 0) {
              item.elasticPrice = Math.round(currentPrice * DEFAULTS.highElastic.priceFactor);
              patched++;
               // console.log(`fixAccessories: Patched elasticPrice for ${item.model}`);
            }
        } else {
             // If base/price is missing or invalid, cannot calculate elasticPrice
             if (safeParseFloat(item.elasticPrice) === undefined || safeParseFloat(item.elasticPrice) <= 0) {
                 item.elasticPrice = 0; // Set to 0 if base price is also invalid
                 patched++;
                 console.warn(`fixAccessories: Cannot calculate elasticPrice for ${item.model} due to invalid base price, setting to 0.`);
             }
        }
      });
    }
  });
  return { data, patched };
}

/**
 * 补齐备用泵相关字段 (应用于齿轮箱对象)
 */
function fixSparePumpData(data) {
  if (!data) return { data, patched: 0 };
  let patched = 0;
  COLLECTION_KEYS.forEach(key => {
    const arr = data[key];
    if (Array.isArray(arr)) {
      arr.forEach(item => {
        if (!item || !item.model) return;
        if (!hasSparePump(item)) return;

        // 标记
        if (!item.hasSparePump) {
            item.hasSparePump = true;
            patched++;
        }

        // 价格 (这里是齿轮箱条目上的备用泵价格，不是备用泵列表的价格)
        if (safeParseFloat(item.sparePumpPrice) === undefined || safeParseFloat(item.sparePumpPrice) <= 0) {
          item.sparePumpPrice = DEFAULTS.sparePump.price;
          patched++;
          // console.log(`fixAccessories: Patched sparePumpPrice for ${item.model}`);
        }
        // 传递能力 (这里是齿轮箱条目上的备用泵传递能力，不是备用泵列表的能力)
        if (safeParseFloat(item.sparePumpTransferCapacity) === undefined || safeParseFloat(item.sparePumpTransferCapacity) <= 0) {
          item.sparePumpTransferCapacity = DEFAULTS.sparePump.transferCapacity;
          patched++;
           // console.log(`fixAccessories: Patched sparePumpTransferCapacity for ${item.model}`);
        }
      });
    }
  });
  return { data, patched };
}

/**
 * 补齐备用泵列表 (standbyPumps) 数据
 * 确保关键字段 (flow, pressure, motorPower, weight) 存在且大于 0
 */
function fixStandbyPumpsListData(data) {
    if (!data || !Array.isArray(data.standbyPumps)) return { data, patched: 0 };
    let patched = 0;

    data.standbyPumps.forEach(p => {
        if (!p || !p.model) {
             // Skipping invalid pump item
             return;
        }
        const model = p.model.trim();

        // Ensure flow > 0
        const flow = safeParseFloat(p.flow);
        if (flow === undefined || flow <= 0) {
             p.flow = DEFAULTS.sparePump.flow; // Small default flow (e.g., 10 L/min)
             patched++;
             console.warn(`fixAccessories: Corrected missing/invalid flow for pump ${model}, set to ${p.flow}`);
        } else if (p.flow !== flow) { // Ensure consistency after parsing
             p.flow = flow; patched++;
        }

        // Ensure pressure > 0
        const pressure = safeParseFloat(p.pressure);
        if (pressure === undefined || pressure <= 0) {
            p.pressure = DEFAULTS.sparePump.pressure; // Small default pressure (e.g., 2.5 MPa)
            patched++;
            console.warn(`fixAccessories: Corrected missing/invalid pressure for pump ${model}, set to ${p.pressure}`);
        } else if (p.pressure !== pressure) { // Ensure consistency
             p.pressure = pressure; patched++;
        }

        // Ensure motorPower > 0
        const motorPower = safeParseFloat(p.motorPower);
        if (motorPower === undefined || motorPower <= 0) {
             // Estimate motor power if possible, otherwise set a small default
             // Simple estimation: P (kW) = (Q (L/min) * p (MPa)) / (60 * efficiency)
             // Assume efficiency 0.8
             if (p.flow > 0 && p.pressure > 0) {
                 p.motorPower = parseFloat(((p.flow * p.pressure) / (60 * 0.8)).toFixed(2));
                 // Ensure estimated power is also positive, minimum default
                 if (p.motorPower <= 0) p.motorPower = DEFAULTS.sparePump.motorPower;
                 patched++;
                 console.log(`fixAccessories: Estimated motorPower for pump ${model} based on flow/pressure: ${p.motorPower}`);
             } else {
                 p.motorPower = DEFAULTS.sparePump.motorPower; // Default (e.g., 2.2 kW) if estimation fails
                 patched++;
                 console.warn(`fixAccessories: Could not estimate motorPower for pump ${model}, set to default ${p.motorPower}`);
             }
        } else if (p.motorPower !== motorPower) { // Ensure consistency
             p.motorPower = motorPower; patched++;
        }
        
        // 定义 warnings 变量，修复错误
        const warnings = [];
             
        // Final check to ensure motorPower is positive
        if (p.motorPower <= 0) { p.motorPower = DEFAULTS.sparePump.motorPower; patched++; warnings.push(`fixAccessories: Corrected zero/negative motorPower for ${model} to default ${p.motorPower}`); }


        // Ensure weight > 0
        const weight = safeParseFloat(p.weight);
        if (weight === undefined || weight <= 0) {
            p.weight = DEFAULTS.sparePump.weight; // Default weight (e.g., 30 kg)
            patched++;
            console.warn(`fixAccessories: Corrected missing/invalid weight for pump ${model}, set to ${p.weight}`);
        } else if (p.weight !== weight) { // Ensure consistency
             p.weight = weight; patched++;
        }
    });

    return { data, patched };
}

/**
 * 修复传递能力字段
 * @param {Object} data 数据对象
 * @returns {Object} { data, patched, warnings }
 */
function fixTransferCapacity(data) {
  if (!data) return { data, patched: 0, warnings: [] };
  let patched = 0;
  const warnings = [];

  COLLECTION_KEYS.forEach(key => {
    const arr = data[key];
    if (Array.isArray(arr)) {
      arr.forEach(item => {
        if (!item || !item.model) return;
        const model = item.model.trim();

        // 检查是否有传递能力数组
        if (!Array.isArray(item.transferCapacity)) {
          // 初始化为与减速比数组相同长度的数组
          if (Array.isArray(item.ratios) && item.ratios.length > 0) {
            item.transferCapacity = new Array(item.ratios.length).fill(0);
            patched++;
            warnings.push(`fixAccessories: 初始化 ${model} 传递能力数组，长度 ${item.ratios.length}`);
          } else {
            item.transferCapacity = [0]; // 默认至少一个元素
            patched++;
            warnings.push(`fixAccessories: ${model} 缺少减速比数组，初始化传递能力为 [0]`);
          }
        }

        // 确保传递能力数组长度与减速比数组匹配
        if (Array.isArray(item.ratios) && item.ratios.length > 0) {
          if (item.transferCapacity.length !== item.ratios.length) {
            // 调整长度
            if (item.transferCapacity.length < item.ratios.length) {
              // 扩展数组
              const oldLength = item.transferCapacity.length;
              item.transferCapacity = [
                ...item.transferCapacity,
                ...new Array(item.ratios.length - oldLength).fill(0)
              ];
              patched++;
              warnings.push(`fixAccessories: ${model} 传递能力数组长度不足，从 ${oldLength} 扩展到 ${item.ratios.length}`);
            } else {
              // 截断数组
              item.transferCapacity = item.transferCapacity.slice(0, item.ratios.length);
              patched++;
              warnings.push(`fixAccessories: ${model} 传递能力数组过长，截断为 ${item.ratios.length} 元素`);
            }
          }
        }

        // 确保所有传递能力值为有效数字且 >= 0
        if (Array.isArray(item.transferCapacity)) {
          for (let i = 0; i < item.transferCapacity.length; i++) {
            const capacity = safeParseFloat(item.transferCapacity[i]);
            if (capacity === undefined || isNaN(capacity) || capacity < 0) {
              // 尝试估计传递能力
              if (Array.isArray(item.ratios) && item.ratios[i] > 0) {
                // 基于减速比和功率估计传递能力
                const estimatedCapacity = estimateTransferCapacityArray(item, i);
                item.transferCapacity[i] = estimatedCapacity || 0;
                patched++;
                warnings.push(`fixAccessories: 已估计 ${model} 在索引 ${i} 处的传递能力为 ${item.transferCapacity[i]}`);
              } else {
                item.transferCapacity[i] = 0;
                patched++;
                warnings.push(`fixAccessories: 已修正 ${model} 在索引 ${i} 处无效的传递能力为 0`);
              }
            } else {
              // 确保为数字
              item.transferCapacity[i] = capacity;
            }
          }
        }
      });
    }
  });

  return { data, patched, warnings };
}

/**
 * 修正联轴器扭矩和最大扭矩、最大转速、重量单位和缺失问题
 * 优先使用 couplingSpecificationsMap 数据来修正原始数据字段
 * 确保关键字段 (torque, maxTorque, maxSpeed, weight) 最终是有效的正数
 * @returns {Object} { data, patched: number, warnings: string[], errors: string[] } - Return warnings and errors
 */
function fixCouplingTorqueAndSpeed(data) {
  if (!data || !Array.isArray(data.flexibleCouplings)) return { data, patched: 0, warnings: [], errors: [] };
  let patched = 0;
  // 添加 warnings 变量的定义（这是修复的第一个地方）
  const warnings = [];
  const errors = [];

  data.flexibleCouplings.forEach(c => {
    if (!c || !c.model) {
         // Skipping invalid coupling item
         return;
    }
    const model = c.model.trim();

    // --- Fix torque (Rated Torque) ---
    let correctedTorque = undefined;

    // 1. Prioritize lookup in couplingSpecificationsMap (ratedTorque)
    if (couplingSpecificationsMap && couplingSpecificationsMap[model]) {
        const specsTorque = safeParseFloat(couplingSpecificationsMap[model].ratedTorque);
        if (specsTorque !== undefined && specsTorque > 0) {
            correctedTorque = specsTorque; // Assumed kN.m from specs map
        } else if (specsTorque === 0) { warnings.push(`fixAccessories: Specs map ratedTorque is 0 for ${model}`); }
        else if (specsTorque === undefined) { warnings.push(`fixAccessories: Specs map has no ratedTorque for ${model}`); }
    }

    // 2. If not found in map or map value invalid, check existing torque (applying heuristics)
    if (correctedTorque === undefined || correctedTorque <= 0) {
        if (c.torque !== undefined && c.torque !== null) {
            const existingTorque = safeParseFloat(c.torque);
             if (existingTorque !== undefined) { // Check if it's a valid number
                if (existingTorque > 500 && existingTorque < 50000) { // Heuristic: Large number likely N.m (range to avoid unrealistic values)
                     correctedTorque = existingTorque / 1000; // Convert N·m to kN·m
                     warnings.push(`fixAccessories: Converted large existing torque for ${model} from N·m?: ${existingTorque} -> ${correctedTorque.toFixed(3)} kN·m`);
                } else if (existingTorque > 0 && existingTorque <= 500) { // Heuristic: Small number likely already kN.m
                     correctedTorque = existingTorque; // Assume kN.m
                     if (existingTorque < 1) warnings.push(`fixAccessories: Suspiciously small existing torque (${existingTorque}) for ${model}. Assuming kN·m.`); // Still warn if very small
                } else if (existingTorque === 0) {
                     warnings.push(`fixAccessories: Existing torque is 0 for ${model}.`);
                } else { // existingTorque is negative or unexpectedly large
                     warnings.push(`fixAccessories: Existing torque (${existingTorque}) is out of typical range for ${model}.`);
                }
             } else { // existingTorque is undefined, null, or NaN
                 warnings.push(`fixAccessories: Existing torque field is invalid/missing for ${model}.`);
             }
        } else {
             warnings.push(`fixAccessories: Existing torque field is missing for ${model}.`);
        }
    }

    // 3. If still undefined/invalid, try extracting from model name
    if (correctedTorque === undefined || correctedTorque <= 0) {
         const modelMatch = model.match(/HGT[HTJBQ]*(\d+(\.\d+)?)/i);
         if (modelMatch && modelMatch[1]) {
             const modelTorque = safeParseFloat(modelMatch[1]);
             if (modelTorque !== undefined && modelTorque > 0) {
                  correctedTorque = modelTorque; // Assume kN·m from model name
                  console.log(`fixAccessories: Using model name value for ${model} torque: ${correctedTorque} kN·m`);
             } else if (modelTorque === 0) { warnings.push(`fixAccessories: Model name extract is 0 for ${model}`); }
         } else {
              warnings.push(`fixAccessories: Could not extract torque from model name ${model}`);
         }
    }

    // 4. Assign the corrected torque (ensure it's a positive number)
    if (correctedTorque === undefined || correctedTorque <= 0) {
         // Final fallback: set a small default and report error/warning
         c.torque = DEFAULTS.coupling.torque; // Default kN.m (e.g., 1.0)
         patched++;
         errors.push(`fixAccessories: CRITICAL: Could not determine valid positive torque for ${model}. Set to default ${c.torque} kN·m.`); // Critical error
    } else {
         // Assign the valid positive torque, round to 3 decimal places for consistency
         c.torque = parseFloat(correctedTorque.toFixed(3));
         if (safeParseFloat(c.torque) !== correctedTorque) patched++; // Count as patched if value changed significantly
    }
     // Ensure torque is definitely a number after this block
     if (typeof c.torque !== 'number' || isNaN(c.torque) || c.torque <= 0) {
          c.torque = DEFAULTS.coupling.torque; patched++; // Double check and apply default if still invalid
          errors.push(`fixAccessories: CRITICAL: Final torque for ${model} is invalid after fix attempts: ${c.torque}. Set to default ${c.torque}.`);
     }


    // --- Fix maxTorque ---
    let correctedMaxTorque = undefined;

     // 1. Prioritize lookup in couplingSpecificationsMap
    if (couplingSpecificationsMap && couplingSpecificationsMap[model]) {
        const specsMaxTorque = safeParseFloat(couplingSpecificationsMap[model].maxTorque);
        if (specsMaxTorque !== undefined && specsMaxTorque > 0) {
            correctedMaxTorque = specsMaxTorque;
            // console.log(`fixAccessories: Using specs map for ${model} maxTorque: ${correctedMaxTorque} kN·m`);
        } else if (specsMaxTorque === 0) { warnings.push(`fixAccessories: Specs map maxTorque is 0 for ${model}`); }
        else if (specsMaxTorque === undefined) { warnings.push(`fixAccessories: Specs map has no maxTorque for ${model}`); }
    }

    // 2. If not found or invalid, estimate based on the *now corrected* Rated Torque (typically 2.5x - 3x)
    // Ensure c.torque holds the value determined in the previous step
    if (correctedMaxTorque === undefined || correctedMaxTorque <= 0) {
        const currentRatedTorque = safeParseFloat(c.torque);
        if (currentRatedTorque !== undefined && currentRatedTorque > 0) {
             correctedMaxTorque = currentRatedTorque * 2.5; // Estimate based on corrected rated torque (2.5x)
             warnings.push(`fixAccessories: Estimating maxTorque for ${model} based on rated torque (${currentRatedTorque} kN·m): ${correctedMaxTorque.toFixed(3)} kN·m`);
        } else {
             warnings.push(`fixAccessories: Cannot estimate maxTorque for ${model} (rated torque invalid)`);
        }
    }

    // 3. Assign the corrected maxTorque (ensure it's a positive number)
    const existingMaxTorque = safeParseFloat(c.maxTorque);
    if (correctedMaxTorque === undefined || correctedMaxTorque <= 0) {
        // Final fallback: use a default (e.g., 2.5x default rated torque)
         c.maxTorque = DEFAULTS.coupling.torque * 2.5; // Default max torque
         patched++;
         warnings.push(`fixAccessories: Could not determine valid positive maxTorque for ${model}. Set to default ${c.maxTorque} kN·m.`);
     } else {
         c.maxTorque = parseFloat(correctedMaxTorque.toFixed(3));
         if (existingMaxTorque === undefined || existingMaxTorque === null || parseFloat(existingMaxTorque.toFixed(3)) !== c.maxTorque) {
              patched++;
              // console.log(`fixAccessories: Corrected ${model} maxTorque to ${c.maxTorque} kN·m`);
         } else if (existingMaxTorque <= 0) {
             patched++;
             warnings.push(`fixAccessories: Corrected non-positive existing maxTorque for ${model} to ${c.maxTorque} kN·m`);
         }
     }
      // Ensure maxTorque is definitely a number and > 0
     if (typeof c.maxTorque !== 'number' || isNaN(c.maxTorque) || c.maxTorque <= 0) {
          c.maxTorque = DEFAULTS.coupling.torque * 2.5; patched++; // Double check
          warnings.push(`fixAccessories: Final maxTorque for ${model} is invalid after fix attempts: ${c.maxTorque}. Set to default ${c.maxTorque}.`); // Warning, not critical error
     }
      // Check consistency: maxTorque >= torque
      if (c.maxTorque > 0 && c.torque > 0 && c.maxTorque < c.torque) {
          warnings.push(`fixAccessories: Final maxTorque (${c.maxTorque}) is less than rated torque (${c.torque}) for ${model}. Setting maxTorque = ratedTorque * 2.5.`);
          c.maxTorque = c.torque * 2.5; patched++;
      }


    // --- Fix maxSpeed ---
    let correctedMaxSpeed = undefined;
    const existingMaxSpeed = safeParseFloat(c.maxSpeed);

    // 1. Try getting from specs map first
    if (couplingSpecificationsMap && couplingSpecificationsMap[model]) {
       const specsMaxSpeed = safeParseFloat(couplingSpecificationsMap[model].maxSpeed);
        if (specsMaxSpeed !== undefined && specsMaxSpeed > 0) {
           correctedMaxSpeed = specsMaxSpeed;
            // console.log(`fixAccessories: Using specs map for ${model} maxSpeed: ${correctedMaxSpeed} rpm`);
        } else if (specsMaxSpeed === 0) { warnings.push(`fixAccessories: Specs map maxSpeed is 0 for ${model}`); }
        else if (specsMaxSpeed === undefined) { warnings.push(`fixAccessories: Specs map has no maxSpeed for ${model}`); }
    }

     // 2. If not found or invalid, check existing value
     if (correctedMaxSpeed === undefined || correctedMaxSpeed <= 0) {
         if (existingMaxSpeed !== undefined && existingMaxSpeed > 0) {
             correctedMaxSpeed = existingMaxSpeed; // Use existing if valid
         } else if (existingMaxSpeed === 0) {
             warnings.push(`fixAccessories: Existing maxSpeed is 0 for ${model}.`);
         } else {
             warnings.push(`fixAccessories: Existing maxSpeed field is invalid/missing for ${model}.`);
         }
     }

    // 3. Assign the corrected maxSpeed (ensure it's a positive number)
    if (correctedMaxSpeed === undefined || correctedMaxSpeed <= 0) {
        c.maxSpeed = DEFAULTS.coupling.maxSpeed; // Default (e.g., 3000 rpm)
        patched++;
        warnings.push(`fixAccessories: Could not determine valid positive maxSpeed for ${model}, set to default ${c.maxSpeed}`);
    } else {
         c.maxSpeed = correctedMaxSpeed;
         if (existingMaxSpeed === undefined || existingMaxSpeed === null || existingMaxSpeed !== c.maxSpeed) patched++; // Patch if missing or different
         else if (existingMaxSpeed <= 0) { patched++; warnings.push(`fixAccessories: Corrected non-positive existing maxSpeed for ${model} to ${c.maxSpeed}`); }
    }
     // Ensure maxSpeed is definitely a number and > 0
     if (typeof c.maxSpeed !== 'number' || isNaN(c.maxSpeed) || c.maxSpeed <= 0) {
         c.maxSpeed = DEFAULTS.coupling.maxSpeed; patched++; // Double check
         warnings.push(`fixAccessories: Final maxSpeed for ${model} is invalid after fix attempts: ${c.maxSpeed}. Set to default ${c.maxSpeed}.`);
     }


      // --- Fix Weight ---
    const existingWeight = safeParseFloat(c.weight);
    if (existingWeight === undefined || existingWeight === null || isNaN(existingWeight) || existingWeight <= 0) {
         c.weight = DEFAULTS.coupling.weight; // Default (e.g., 50 kg)
         patched++;
         warnings.push(`fixAccessories: Corrected missing/invalid weight for ${model}, set to default ${c.weight}`);
    } else {
         c.weight = existingWeight; // Ensure it's a number
    }
     // Ensure weight is definitely a number and >= 0 (allow 0 weight if necessary, but >0 is preferred)
     if (typeof c.weight !== 'number' || isNaN(c.weight) || c.weight < 0) { // Allow 0 weight? Or > 0? Let's enforce > 0
          c.weight = DEFAULTS.coupling.weight; patched++;
           warnings.push(`fixAccessories: Final weight for ${model} is invalid after fix attempts: ${c.weight}. Set to default ${c.weight}.`);
     }


  });

  return { data, patched, warnings, errors }; // Return warnings and errors
}

/**
 * 主函数：执行所有附件补齐
 * @returns {Object} { data, summary: object, warnings: string[], errors: string[] }
 */
export function fixAccessories(data) {
  let workingData = data ? JSON.parse(JSON.stringify(data)) : {};
  let totalPatched = 0;
  const allWarnings = [];
  const allErrors = []; // Collect errors from critical failures


  // Ensure necessary arrays exist before processing
  if (!Array.isArray(workingData.flexibleCouplings)) {
      workingData.flexibleCouplings = [];
      console.warn("fixAccessories: flexibleCouplings array was missing, initialized as empty.");
  }
   if (!Array.isArray(workingData.standbyPumps)) {
      workingData.standbyPumps = [];
       console.warn("fixAccessories: standbyPumps array was missing, initialized as empty.");
  }
    // Ensure gearbox arrays exist (assuming COLLECTION_KEYS cover these)
    COLLECTION_KEYS.forEach(key => {
        if (!Array.isArray(workingData[key])) {
            workingData[key] = [];
             console.warn(`fixAccessories: ${key} array was missing, initialized as empty.`);
        }
    });


  // Fix pump list data first (ensures flow, pressure, motorPower, weight > 0)
   const { patched: p5 } = fixStandbyPumpsListData(workingData);
   totalPatched += p5;
   console.log(`fixAccessories: Standby pump list data patched: ${p5}`);


  // Fix coupling data (torque, maxTorque, maxSpeed, weight units/defaults)
  const { patched: p4, warnings: cWarnings, errors: cErrors } = fixCouplingTorqueAndSpeed(workingData);
  totalPatched += p4;
  allWarnings.push(...cWarnings);
  allErrors.push(...cErrors); // Collect errors from critical coupling fixes
  console.log(`fixAccessories: Coupling torque/speed/weight data patched: ${p4}, warnings: ${cWarnings.length}, errors: ${cErrors.length}`);


  // Fix gearbox transfer capacity (length and validity)
   const { patched: p3, warnings: tcWarnings } = fixTransferCapacity(workingData); // Relies on gearboxes
  totalPatched += p3;
   allWarnings.push(...tcWarnings);
   console.log(`fixAccessories: Gearbox capacity data patched: ${p3}, warnings: ${tcWarnings.length}`);


  // Fix elastic coupling markers and prices (applied to gearbox objects)
  const { patched: p1 } = fixElasticCouplingData(workingData); // Applied to gearboxes
  totalPatched += p1;
   console.log(`fixAccessories: Elastic coupling markers/prices patched: ${p1}`);

  // Fix spare pump markers and prices (applied to gearbox objects)
  const { patched: p2 } = fixSparePumpData(workingData); // Applied to gearboxes
  totalPatched += p2;
   console.log(`fixAccessories: Spare pump markers/prices patched: ${p2}`);


   // Check for critical errors before returning
   if (allErrors.length > 0) {
       console.error("fixAccessories: Encountered critical errors:", allErrors);
       // accessoryFixResult.errors will be returned and potentially cause app failure
   }


  return {
      data: workingData,
      summary: { elasticPatched: p1, sparePumpPatched: p2, capacityPatched: p3, torquePatched: p4, pumpListPatched: p5, totalPatched },
      warnings: allWarnings, // Return collected warnings
      errors: allErrors // Return collected errors (critical failures)
  };
}

/**
 * Helper function to ensure key numeric fields in gearboxes are valid positive numbers, defaulting if needed.
 * This can be used as part of the broader data cleaning pipeline.
 */
export const ensureGearboxNumericFields = (data) => {
    if (!data) return { data, patched: 0, warnings: [] };
    let patched = 0;
    const warnings = [];

    COLLECTION_KEYS.forEach(key => {
        const arr = data[key];
        if (Array.isArray(arr)) {
            arr.forEach(item => {
                if (!item || !item.model) return;
                const model = item.model.trim();

                // thrust: >= 0
                const thrust = safeParseFloat(item.thrust);
                if (thrust === undefined || isNaN(thrust) || thrust < 0) {
                    item.thrust = 0; patched++;
                    warnings.push(`fixAccessories: Corrected missing/invalid/negative thrust for ${model} to 0.`);
                } else { item.thrust = thrust; }

                // centerDistance: > 0 (or default 0 if not critical for this item/series?)
                const centerDistance = safeParseFloat(item.centerDistance);
                 if (centerDistance === undefined || isNaN(centerDistance) || centerDistance <= 0) {
                     // Attempt estimation based on model number if available
                     const modelNumMatch = model.match(/\d+/);
                      if (modelNumMatch && modelNumMatch[0]) {
                          const modelNum = parseInt(modelNumMatch[0]);
                           if (!isNaN(modelNum) && modelNum > 0) {
                               // Rough estimation based on model scale
                               item.centerDistance = Math.max(50, Math.round(modelNum * 0.5)); // Example heuristic
                               patched++; warnings.push(`fixAccessories: Estimated centerDistance for ${model} to ${item.centerDistance} based on model number.`);
                           } else {
                                item.centerDistance = 0; patched++; // Default to 0 if estimation fails
                                warnings.push(`fixAccessories: Corrected missing/invalid centerDistance for ${model} to 0.`);
                           }
                      } else {
                         item.centerDistance = 0; patched++; // Default to 0 if no number in model
                         warnings.push(`fixAccessories: Corrected missing/invalid centerDistance for ${model} to 0 (no number in model name).`);
                      }
                 } else { item.centerDistance = centerDistance; }


                // weight: > 0
                const weight = safeParseFloat(item.weight);
                if (weight === undefined || isNaN(weight) || weight <= 0) {
                    // Attempt estimation based on model number if available
                     const modelNumMatch = model.match(/\d+/);
                     if (modelNumMatch && modelNumMatch[0]) {
                         const modelNum = parseInt(modelNumMatch[0]);
                          if (!isNaN(modelNum) && modelNum > 0) {
                              // Rough estimation based on model scale (e.g., HC400 ~ 820kg)
                              item.weight = Math.max(50, modelNum * 2); // Example heuristic
                              patched++; warnings.push(`fixAccessories: Estimated weight for ${model} to ${item.weight} based on model number.`);
                          } else {
                              item.weight = 50; patched++; // Default to 50 if estimation fails
                              warnings.push(`fixAccessories: Corrected missing/invalid weight for ${model} to 50.`);
                          }
                     } else {
                        item.weight = 50; patched++; // Default to 50 if no number in model
                        warnings.push(`fixAccessories: Corrected missing/invalid weight for ${model} to 50 (no number in model name).`);
                     }
                } else { item.weight = weight; }

                // efficiency: > 0 and <= 1
                 const efficiency = safeParseFloat(item.efficiency);
                 if (efficiency === undefined || isNaN(efficiency) || efficiency <= 0 || efficiency > 1) {
                     // Attempt estimation based on series or set default
                     if (model.startsWith('GW') && efficiency !== undefined && efficiency > 1 && efficiency <= 100) { // Check for percentage format
                         item.efficiency = efficiency / 100; patched++; warnings.push(`fixAccessories: Converted efficiency for ${model} from percentage to decimal: ${efficiency}% -> ${item.efficiency}`);
                     } else {
                         item.efficiency = DEFAULTS.gearbox.efficiency; // Default (e.g., 0.97)
                         patched++; warnings.push(`fixAccessories: Corrected missing/invalid efficiency for ${model} to default ${item.efficiency}.`);
                     }
                 } else { item.efficiency = efficiency; }


                // inputSpeedRange: array of 2 positive numbers
                if (!Array.isArray(item.inputSpeedRange) || item.inputSpeedRange.length !== 2 || !item.inputSpeedRange.every(v => safeParseFloat(v) > 0)) {
                     item.inputSpeedRange = DEFAULTS.gearbox.inputSpeedRange; // Default [500, 2500]
                     patched++; warnings.push(`fixAccessories: Corrected missing/invalid inputSpeedRange for ${model} to default ${item.inputSpeedRange}.`);
                } else {
                     item.inputSpeedRange = [safeParseFloat(item.inputSpeedRange[0]), safeParseFloat(item.inputSpeedRange[1])]; // Ensure are numbers
                }

                // ratios: array of positive numbers
                if (!Array.isArray(item.ratios) || item.ratios.length === 0 || !item.ratios.every(v => safeParseFloat(v) > 0)) {
                    item.ratios = DEFAULTS.gearbox.ratios; // Default [1.5, 2.0, 2.5]
                    patched++; warnings.push(`fixAccessories: Corrected missing/invalid/empty ratios for ${model} to default ${item.ratios}.`);
                } else {
                     item.ratios = item.ratios.map(v => safeParseFloat(v)).filter(v => v > 0); // Ensure are numbers and positive
                     if (item.ratios.length === 0) { // If filtering left it empty
                          item.ratios = DEFAULTS.gearbox.ratios; patched++;
                           warnings.push(`fixAccessories: All ratios were invalid/non-positive for ${model}, set to default ${item.ratios}.`);
                     }
                }
                 // Note: transferCapacity is handled by fixTransferCapacity based on ratios length


            });
        }
    });
    return { data, patched, warnings };
}


// Default export
export default fixAccessories;