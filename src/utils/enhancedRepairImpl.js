// src/utils/enhancedRepairImpl.js
/**
 * 增强型数据修复流程实现
 * 整合各种修复工具，提供完整的数据加载和修复过程
 */

import { safeParseFloat } from './dataHelpers';
import { APP_DATA_VERSION } from '../config';
import { deepMergeData, processPriceFields, ensureNumericFields, fixArrayLength } from './enhancedRepair';
import { validateDatabase } from './enhancedValidator';
import { fixAccessories, ensureGearboxNumericFields } from './accessoryFixer';
import { fixSpecificModelPrices, processPriceData } from './priceManager';

/**
 * 修复齿轮箱传递能力数组
 * @param {Object} data 数据对象
 * @returns {Object} 处理结果 { data, patched, warnings }
 */
export const fixGearboxCapacityArrays = (data) => {
  if (!data) return { data: {}, patched: 0, warnings: [] };
  
  const result = { ...data };
  const warnings = [];
  let patched = 0;
  
  // 处理齿轮箱集合
  const gearboxCollections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes'
  ];
  
  gearboxCollections.forEach(colKey => {
    if (Array.isArray(result[colKey])) {
      result[colKey] = result[colKey].map(item => {
        if (!item || typeof item !== 'object') return item;
        
        // 检查是否需要修复
        if (Array.isArray(item.ratios) && item.ratios.length > 0) {
          // 确保传递能力数组存在且有效
          if (!Array.isArray(item.transferCapacity) || 
              item.transferCapacity.length === 0 || 
              item.transferCapacity.length !== item.ratios.length) {
            
            let newCapacity;
            
            // 如果存在传递能力数组但长度不匹配，修复长度
            if (Array.isArray(item.transferCapacity) && item.transferCapacity.length > 0) {
              newCapacity = fixArrayLength(item.ratios, item.transferCapacity, (index, ratioVal, currentCapacities) => {
                // 智能生成值的函数
                if (currentCapacities.length === 1) {
                  // 单值数组，对所有比值使用相同的传递能力
                  return currentCapacities[0];
                } else if (index < currentCapacities.length) {
                  // 使用现有值
                  return currentCapacities[index];
                } else {
                  // 平滑插值或使用最后一个有效值的衰减值
                  const lastValue = safeParseFloat(currentCapacities[currentCapacities.length - 1]);
                  // 随着减速比增加，传递能力通常会减少
                  const decayFactor = 0.9;
                  return lastValue * Math.pow(decayFactor, index - currentCapacities.length + 1);
                }
              });
            } else {
              // 如果不存在有效的传递能力数组，创建一个默认值数组
              newCapacity = new Array(item.ratios.length).fill(0.1);
            }
            
            // 确保所有值都是有效的正数
            newCapacity = newCapacity.map(val => {
              const parsed = safeParseFloat(val);
              return parsed !== undefined && parsed > 0 ? parsed : 0.1;
            });
            
            item.transferCapacity = newCapacity;
            patched++;
            warnings.push(`${colKey}/${item.model || '未知'}: 修复了传递能力数组长度 (${newCapacity.length})`);
          }
        }
        
        return item;
      });
    }
  });
  
  return { data: result, patched, warnings };
};

/**
 * 修复特殊齿轮箱数据
 * @param {Object} data 数据对象
 * @returns {Object} 修复后的数据对象
 */
export const fixSpecialGearboxData = (data) => {
  if (!data) return {};
  
  const result = { ...data };
  
  // 特殊处理 2GWH 系列双机并车齿轮箱
  const processGwGearboxes = () => {
    if (!Array.isArray(result.gwGearboxes)) return;
    
    // 查找所有 2GWH 型号
    const gwh2Models = result.gwGearboxes.filter(item => 
      item && typeof item.model === 'string' && item.model.startsWith('2GWH')
    );
    
    gwh2Models.forEach(item => {
      // 设置双机并车标记
      item.isParallel = true;
      
      // 修正控制类型
      if (!item.controlType || item.controlType === '') {
        item.controlType = '双机并车';
      }
      
      // 确保有正确的中心距属性
      if (!item.standardCenterDistance && item.centerDistance) {
        item.standardCenterDistance = item.centerDistance;
      }
    });
  };
  
  // 处理特殊齿轮箱标记
  processGwGearboxes();
  
  // 可以添加其他特殊齿轮箱处理逻辑...
  
  return result;
};

/**
 * 确保所有预期的集合都存在
 * @param {Object} data 数据对象
 * @returns {Object} 处理后的数据对象
 */
export const ensureCollections = (data) => {
  if (!data) return {};
  
  const collections = [
    // 齿轮箱系列
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
    // 附件系列
    'flexibleCouplings', 'standbyPumps'
  ];
  
  const result = { ...data };
  
  // 确保每个集合都存在，如果不存在则初始化为空数组
  collections.forEach(collection => {
    if (!Array.isArray(result[collection])) {
      console.log(`enhancedRepairImpl::ensureCollections: 初始化缺失的集合 ${collection} 为空数组`);
      result[collection] = [];
    }
  });
  
  return result;
};

/**
 * 完整的增强型数据加载和修复流程
 * @param {Object} options 选项
 * @returns {Promise<Object>} 加载并修复的数据对象
 */
export const enhancedLoadAndRepairData = async (options = {}) => {
  console.log('enhancedRepairImpl: 开始数据加载和修复过程...');
  const { onProgress, initialDataOverrides = {}, embeddedGearboxData, flexibleCouplings, standbyPumps } = options;

  try {
    onProgress?.('initializing');

    // 1. 开始使用基础嵌入数据和配件数据
    let workingData = {};
    if (embeddedGearboxData) {
      workingData = JSON.parse(JSON.stringify(embeddedGearboxData)); // 深拷贝
      console.log("enhancedRepairImpl: 已加载基础嵌入式齿轮箱数据");
    } else {
      console.error("enhancedRepairImpl: embeddedGearboxData 未定义!");
      // 回退到空结构，带有默认版本
      workingData = { _version: APP_DATA_VERSION };
      console.warn("enhancedRepairImpl: 使用空结构作为基础数据后备");
    }

    // 明确添加配件数据
    if (Array.isArray(flexibleCouplings)) {
      workingData.flexibleCouplings = [...flexibleCouplings];
    }
    
    if (Array.isArray(standbyPumps)) {
      workingData.standbyPumps = [...standbyPumps];
    }
    
    console.log(`enhancedRepairImpl: 添加了 ${workingData.flexibleCouplings?.length || 0} 个联轴器和 ${workingData.standbyPumps?.length || 0} 个泵从源文件`);

    onProgress?.('checking local storage');
    // 2. 从localStorage合并数据（如果有效）
    const storedDataJson = localStorage.getItem('appData');
    let storedData = null;
    if (storedDataJson) {
      try {
        storedData = JSON.parse(storedDataJson);
        console.log(`enhancedRepairImpl: 找到localStorage数据`);
      } catch (e) {
        console.warn('enhancedRepairImpl: 解析localStorage数据失败，将丢弃', e);
        storedData = null; // 丢弃无效存储数据
        localStorage.removeItem('appData'); // 清除有问题的数据
      }
    }

    if (storedData) {
      console.log("enhancedRepairImpl: 合并来自localStorage的数据");
      // 使用增强的合并函数
      workingData = deepMergeData(storedData, workingData);
    }

    onProgress?.('loading external data');
    // 3. 从外部gearbox-data.json合并（如果可用）
    try {
      const response = await fetch('./gearbox-data.json');
      if (response.ok) {
        const externalData = await response.json();
        console.log("enhancedRepairImpl: 成功加载外部gearbox-data.json");
        // 使用增强的合并函数，优先使用外部数据
        workingData = deepMergeData(externalData, workingData);
      } else {
        console.warn("enhancedRepairImpl: 无法加载外部gearbox-data.json，状态:", response.status);
      }
    } catch (fetchError) {
      console.warn("enhancedRepairImpl: 获取外部数据文件失败:", fetchError);
    }

    onProgress?.('applying overrides');
    // 4. 合并来自initialDataOverrides的数据（最高优先级）
    if (initialDataOverrides && Object.keys(initialDataOverrides).length > 0) {
      console.log("enhancedRepairImpl: 合并来自initialDataOverrides的数据（最高优先级）");
      // 使用增强的合并函数，将overrides作为优先级选项传递
      workingData = deepMergeData(initialDataOverrides, workingData, {
        prioritizeCollections: initialDataOverrides
      });
    }

    onProgress?.('applying fixes');
    // 5. 按逻辑顺序应用数据修复
    console.log("enhancedRepairImpl: 应用数据修复...");
    const allRepairWarnings = [];
    const allRepairErrors = []; // 收集来自关键修复的错误

    // 步骤5.1: 确保所有预期的集合都是数组 - 在迭代或处理集合之前必须
    let repairedData = ensureCollections(workingData);
    console.log("enhancedRepairImpl: 确保所有数据集合已初始化");

    // 步骤5.2: 应用特殊齿轮箱修复
    repairedData = fixSpecialGearboxData(repairedData);
    console.log("enhancedRepairImpl: 应用了特殊齿轮箱修复");

    // 步骤5.3: 确保齿轮箱数值字段有有效数值/默认值
    const gearboxNumericFixResult = ensureGearboxNumericFields(repairedData);
    repairedData = gearboxNumericFixResult.data;
    if (gearboxNumericFixResult.warnings && gearboxNumericFixResult.warnings.length > 0) {
      allRepairWarnings.push(...gearboxNumericFixResult.warnings);
      console.warn("enhancedRepairImpl: 修复齿轮箱数值字段时的警告:", gearboxNumericFixResult.warnings);
    }
    console.log(`enhancedRepairImpl: 确保齿轮箱数值字段（修复了 ${gearboxNumericFixResult.patched} 项）`);

    // 步骤5.4: 修复齿轮箱传递能力数组长度和基本有效性
    const capacityFixResult = fixGearboxCapacityArrays(repairedData);
    repairedData = capacityFixResult.data;
    if (capacityFixResult.warnings && capacityFixResult.warnings.length > 0) {
      allRepairWarnings.push(...capacityFixResult.warnings);
      console.warn("enhancedRepairImpl: 修复传递能力数组时的警告:", capacityFixResult.warnings);
    }
    console.log(`enhancedRepairImpl: 应用了传递能力数组修复（修复了 ${capacityFixResult.patched} 项）`);

    // 步骤5.5: 修复配件数据（联轴器扭矩/速度/重量，泵流量/压力/功率/重量）- 必须在集合为数组之后
    const accessoryFixResult = fixAccessories(repairedData);
    repairedData = accessoryFixResult.data;
    if (accessoryFixResult.warnings && accessoryFixResult.warnings.length > 0) {
      allRepairWarnings.push(...accessoryFixResult.warnings);
      console.warn("enhancedRepairImpl: 修复配件时的警告:", accessoryFixResult.warnings);
    }
    if (accessoryFixResult.errors && accessoryFixResult.errors.length > 0) {
      allRepairErrors.push(...accessoryFixResult.errors);
      console.error("enhancedRepairImpl: 修复配件时的关键错误:", accessoryFixResult.errors);
    }
    console.log(`enhancedRepairImpl: 应用了配件修复（修复了 ${accessoryFixResult.summary?.totalPatched || 0} 项），错误: ${accessoryFixResult.errors?.length || 0}`);

    // 步骤5.6: 处理和修复价格数据
    const priceFixResult = processPriceData(repairedData);
    repairedData = priceFixResult.data;
    if (priceFixResult.results?.warnings) allRepairWarnings.push(...priceFixResult.results.warnings);
    if (priceFixResult.results?.errors) allRepairErrors.push(...priceFixResult.results.errors);
    if (priceFixResult.results?.corrected > 0) {
      console.log(`enhancedRepairImpl: 应用一般价格数据处理（修正了 ${priceFixResult.results.corrected} 项）`);
    } else {
      console.log(`enhancedRepairImpl: 一般价格数据处理完成（0 项修正）`);
    }

    // 步骤5.7: 应用特定型号价格覆盖
    repairedData = fixSpecificModelPrices(repairedData);
    console.log("enhancedRepairImpl: 应用了特定型号价格覆盖");

    onProgress?.('validating data');
    // 6. 验证最终数据
    console.log("enhancedRepairImpl: 执行最终数据验证...");
    const validationResult = validateDatabase(repairedData);
    if (!validationResult.success) {
      console.error("enhancedRepairImpl: 最终数据验证失败!", validationResult);
      const finalErrors = [...allRepairErrors];
      Object.keys(validationResult.details).forEach(key => {
        if (validationResult.details[key].invalidItems.length > 0) {
          validationResult.details[key].invalidItems.forEach(item => {
            finalErrors.push(`[验证错误 - ${key}/${item.model || '未知'}] ${item.errors.join('; ')}`);
          });
        }
      });
      Object.keys(validationResult.details).forEach(key => {
        if (validationResult.details[key].warningItems.length > 0) {
          validationResult.details[key].warningItems.forEach(item => {
            allRepairWarnings.push(`[验证警告 - ${key}/${item.model || '未知'}] ${item.warnings.join('; ')}`);
          });
        }
      });

      if (finalErrors.length > 0) {
        const validationError = new Error(`数据验证失败: ${validationResult.message}. 发现 ${validationResult.summary.invalid} 个验证错误和 ${allRepairErrors.length} 个修复错误.`);
        validationError.details = { validation: validationResult, repairErrors: finalErrors, repairWarnings: allRepairWarnings };
        console.error(validationError);
        throw validationError;
      } else {
        console.warn("enhancedRepairImpl: 验证报告了警告但数据中没有发现严重错误。继续。", validationResult);
        if (allRepairWarnings.length > 0) {
          console.warn("enhancedRepairImpl: 总修复警告:", allRepairWarnings);
        }
      }
    } else {
      console.log(`enhancedRepairImpl: 最终数据验证成功。${validationResult.summary.warnings} 个警告。`);
      if (validationResult.summary.warnings > 0) {
        console.warn("enhancedRepairImpl: 验证警告:", validationResult.details);
      }
      if (allRepairWarnings.length > 0) {
        console.warn("enhancedRepairImpl: 总修复警告:", allRepairWarnings);
      }
    }

    onProgress?.('saving data');
    // 7. 更新版本并保存到localStorage
    repairedData._version = APP_DATA_VERSION;
    repairedData._lastFixed = new Date().toISOString();
    if (allRepairWarnings.length > 0 || allRepairErrors.length > 0) {
      repairedData.metadata = repairedData.metadata || {};
      repairedData.metadata._lastRepairWarnings = allRepairWarnings;
      repairedData.metadata._lastRepairErrors = allRepairErrors;
    }

    console.log(`enhancedRepairImpl: 数据修复完成。最终版本: ${repairedData._version}`);

    try {
      localStorage.setItem('appData', JSON.stringify(repairedData));
      console.log("enhancedRepairImpl: 成功将修复后的数据保存到localStorage");
    } catch (saveError) {
      console.error("enhancedRepairImpl: 保存修复后的数据到localStorage失败:", saveError);
    }

    onProgress?.('ready');
    return repairedData;

  } catch (error) {
    console.error('enhancedRepairImpl: 数据加载/修复过程中捕获到严重错误:', error);
    if (!error.details) {
      error.details = { message: error.message };
    }
    throw error;
  }
};

// 导出函数
export default enhancedLoadAndRepairData;
