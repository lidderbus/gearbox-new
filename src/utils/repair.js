// src/utils/repair.js
// 系统数据修复与初始化工具
// 性能优化: 使用动态导入实现数据懒加载

// 导入日志工具
import { logger } from '../config/logging';

// Import fixData functions that are used directly in repair.js
import {
    fixSpecialGearboxData,
    fixGearboxCapacityArrays,
} from './fixData'; // 确保 fixData.js 导出这些函数

// Import other utilities
import { validateDatabase } from './dataValidator'; // 确保导入路径正确
import { adaptEnhancedData } from './dataAdapter'; // 确保导入路径正确
// 性能优化: 数据文件改为动态导入，不再使用静态导入
// import { embeddedGearboxData } from '../data/embeddedData';
// import { flexibleCouplings } from '../data/flexibleCouplings';
// import { standbyPumps } from '../data/standbyPumps';
import { fixAccessories, ensureGearboxNumericFields } from './fixAccessories'; // <--- 导入新修复函数
import { APP_DATA_VERSION } from '../config'; // 假设 APP_DATA_VERSION 在 config.js 中定义

// Import price management tools
import {
    processPriceData, // 正确导入价格处理函数
    fixSpecificModelPrices,
    getStandardDiscountRate // 尽管在 fixData 中使用，在这里导入也没问题
} from './priceManager'; // 假设 priceManager.js 导出这些函数

// 缓存动态导入的数据，避免重复加载
let cachedEmbeddedData = null;
let cachedFlexibleCouplings = null;
let cachedStandbyPumps = null;

/**
 * 动态加载嵌入式齿轮箱数据
 * @returns {Promise<Object>} 齿轮箱数据
 */
async function loadEmbeddedGearboxData() {
  if (cachedEmbeddedData) {
    return cachedEmbeddedData;
  }
  const startTime = performance.now();
  const module = await import(
    /* webpackChunkName: "gearbox-data" */
    '../data/embeddedData'
  );
  cachedEmbeddedData = module.embeddedGearboxData;
  logger.debug(`repair.js: 动态加载齿轮箱数据完成, 耗时${(performance.now() - startTime).toFixed(0)}ms`);
  return cachedEmbeddedData;
}

/**
 * 动态加载联轴器数据
 * @returns {Promise<Array>} 联轴器数据
 */
async function loadFlexibleCouplings() {
  if (cachedFlexibleCouplings) {
    return cachedFlexibleCouplings;
  }
  const module = await import(
    /* webpackChunkName: "coupling-data" */
    '../data/flexibleCouplings'
  );
  cachedFlexibleCouplings = module.flexibleCouplings;
  return cachedFlexibleCouplings;
}

/**
 * 动态加载备用泵数据
 * @returns {Promise<Array>} 备用泵数据
 */
async function loadStandbyPumps() {
  if (cachedStandbyPumps) {
    return cachedStandbyPumps;
  }
  const module = await import(
    /* webpackChunkName: "pump-data" */
    '../data/standbyPumps'
  );
  cachedStandbyPumps = module.standbyPumps;
  return cachedStandbyPumps;
}

// 环境检测：仅在开发环境输出警告信息
const isDev = process.env.NODE_ENV === 'development';
const logWarn = isDev ? (...args) => logger.warn(...args) : () => {};

// Re-implement ensureCollections function
export const ensureCollections = (data) => {
  if (!data) return {}; // 如果数据为空，返回空对象

  const collections = [
    // 齿轮箱系列
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes',
    'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
    // 附件系列
    'flexibleCouplings', 'standbyPumps',
    // 其他可能需要的集合
    // 'couplingData', // 如果不作为集合实际使用，移除此行
    // 'pumpData'      // 如果不作为集合实际使用，移除此行
  ];

  const result = { ...data }; // 创建一个数据的副本

  // 确保每个集合都存在，如果不存在则初始化为空数组
  collections.forEach(collection => {
    if (!Array.isArray(result[collection])) {
      logger.debug(`repair.js::ensureCollections: Initializing missing collection ${collection} as empty array`);
      result[collection] = [];
    }
  });

  return result;
};

// 根据“model”合并数据集合的函数
export const mergeDataCollections = (source, target) => {
  if (!source || !Array.isArray(source)) return target || [];
  // If target is not an array, start with an empty array for merging
  const initialTarget = Array.isArray(target) ? target : [];

  const result = [...initialTarget];
  // Use a Map for efficient lookup by model, filter out items without valid models
  const modelMap = new Map(result.map(item => item && typeof item.model === 'string' && item.model.trim() ? [item.model.trim(), item] : [null, null]).filter(item => item[0] !== null));

  source.forEach(sourceItem => {
    if (sourceItem && typeof sourceItem.model === 'string' && sourceItem.model.trim()) {
      const model = sourceItem.model.trim();
      if (modelMap.has(model)) {
        // Merge objects with the same model, prioritize source's defined values
        const existingItem = modelMap.get(model);
        // Create a new object starting with existing item, then layering source's non-undefined values
        const mergedItem = { ...existingItem };
        Object.keys(sourceItem).forEach(prop => {
            // Only overwrite if source's value is explicitly defined (not undefined)
           if (sourceItem[prop] !== undefined) {
               mergedItem[prop] = sourceItem[prop];
           }
        });
        modelMap.set(model, mergedItem); // Update the map with the merged item
      } else {
        // Add new item to the map
        modelMap.set(model, sourceItem);
      }
    } else {
       // Handle source items without a model - log a warning
       logger.warn("repair.js::mergeDataCollections: Skipping item without a model:", sourceItem);
    }
  });

  // Rebuild array from map values
  return Array.from(modelMap.values());
};

/**
 * Enhanced data merging function
 * Prioritizes data from sources merged later.
 * Specifically prioritizes collections provided in options.
 * @param {Object} source The source data object to merge from
 * @param {Object} target The target data object to merge into
 * @param {Object} options Options, e.g., { collectionName: [...] } to prioritize
 * @returns {Object} The merged data object
 */
export const mergeEnhancedData = (source, target, options = {}) => {
  if (!source) return target || {};
  if (!target) return source || {};

  const result = { ...target }; // <-- result is defined here

  // Define collections that should be merged using the mergeDataCollections logic
  const mergeableCollections = [
      'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
      'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes',
      'hcdGearboxes', 'hclGearboxes', 'hctGearboxes', 'hcsGearboxes', 'hcgGearboxes', // 新增系列
      'otherGearboxes', 'othersGearboxes', // 支持两种命名
      'flexibleCouplings', 'standbyPumps', // These are also mergeable collections
  ];

  Object.keys(source).forEach(key => {
    // Handle specific prioritized collections from options
    if (options[key] && Array.isArray(options[key])) {
       // If the collection exists in options, use the merge logic with options data having highest priority
        logger.debug(`repair.js::mergeEnhancedData: Merging prioritized collection: ${key}`);
       // Use the mergeDataCollections helper to merge the arrays
       // The result variable is modified IN PLACE here
       result[key] = mergeDataCollections(source[key], result[key]); // Merge source into existing result
       result[key] = mergeDataCollections(options[key], result[key]); // Then merge options into the result (prioritizes options)

    } else if (mergeableCollections.includes(key) && Array.isArray(source[key])) {
      // If source[key] is an array for a mergeable collection, use mergeDataCollections
      // Ensure result[key] is treated as an array even if it's not currently one, mergeDataCollections handles this
       result[key] = mergeDataCollections(source[key], result[key]);
    }
    // If source is an array but not in mergeableCollections (e.g., future new array type), use it directly
    else if (Array.isArray(source[key]) && !mergeableCollections.includes(key)) {
        result[key] = [...source[key]];
    }
    // If both source and target are objects, merge objects (simple shallow merge for now)
    else if (source[key] && typeof source[key] === 'object' &&
             result[key] && typeof result[key] === 'object' &&
             !Array.isArray(source[key]) && !Array.isArray(result[key])) // Exclude arrays
    {
      result[key] = { ...result[key], ...source[key] }; // Target properties can be overwritten by source
    }
    // If target does not have the key, or source value is preferred (e.g., non-object overwrites object), use source's value
    else if (source[key] !== undefined) { // Simplified condition - if source has the key and it's not undefined, use it
       result[key] = source[key];
    }
     // Otherwise, keep the target's value (if source's value is undefined, etc.)
  }); // <-- forEach loop ends here

  return result; // <-- RETURN STATEMENT IS HERE
};


/**
 * Initialize data repair tools. (Not used in loadAndRepairData directly)
 */
export const initializeDataRepair = () => {
  logger.debug('repair.js: initializeDataRepair called.');
};


/**
 * Full data loading and repair process.
 * Combines data from embedded source, external file, localStorage, and overrides.
 * Applies various data fixing functions and validates the final data.
 * @param {Object} options Options including onProgress callback and initialDataOverrides
 * @returns {Promise<Object>} The loaded and repaired data object.
 * @throws {Error} If critical errors occurred during repair or validation.
 */
export const loadAndRepairData = async (options = {}) => {
  logger.log('repair.js: Starting data loading and repair process (lazy loading mode)...');
  const { onProgress, initialDataOverrides = {} } = options;

  try {
    onProgress?.('initializing');

    // 1. 动态加载基础数据 (性能优化: 按需加载)
    let workingData = {};
    onProgress?.('loading gearbox data');
    const embeddedGearboxData = await loadEmbeddedGearboxData();
    if (embeddedGearboxData) {
         workingData = JSON.parse(JSON.stringify(embeddedGearboxData)); // Deep copy
         logger.debug("repair.js: Loaded base embedded gearbox data via dynamic import.");
     } else {
         logger.error("repair.js: embeddedGearboxData is not defined!");
         // Fallback to an empty structure with default version
         workingData = { _version: APP_DATA_VERSION };
         logger.warn("repair.js: Used empty structure as base data fallback.");
     }

    // 2. 动态加载附件数据 (并行加载以提高性能)
    onProgress?.('loading accessories data');
    const [flexibleCouplings, standbyPumps] = await Promise.all([
      loadFlexibleCouplings(),
      loadStandbyPumps()
    ]);

    // Explicitly add accessories from their files to the base data
    // Use mergeDataCollections to add/merge from files into the base structure
    // ensureCollections will make sure these keys exist as arrays later if they weren't already
    workingData.flexibleCouplings = mergeDataCollections(flexibleCouplings, workingData.flexibleCouplings);
    workingData.standbyPumps = mergeDataCollections(standbyPumps, workingData.standbyPumps);

    logger.debug(`repair.js: Added/Merged ${workingData.flexibleCouplings.length} couplings and ${workingData.standbyPumps.length} pumps from dynamic imports.`);


    onProgress?.('checking local storage');
    // 2. Merge from localStorage if valid data exists
    const storedDataJsonRevised = localStorage.getItem('appData');
    let storedDataRevised = null;
    if (storedDataJsonRevised) {
        try {
            storedDataRevised = JSON.parse(storedDataJsonRevised);

            // Detect corrupted coupling torque data (cumulative conversion bug)
            if (Array.isArray(storedDataRevised?.flexibleCouplings) && storedDataRevised.flexibleCouplings.length > 0) {
              const firstTorque = storedDataRevised.flexibleCouplings[0]?.torque;
              if (typeof firstTorque === 'number' && firstTorque < 0.01 && firstTorque > 0) {
                logger.warn(`repair.js: Detected corrupted coupling torque data (value=${firstTorque}), clearing localStorage to force reload.`);
                storedDataRevised = null;
                localStorage.removeItem('appData');
              }
            }

            // Version compatibility check - clear stale data if version mismatch
            if (storedDataRevised) {
              const storedVersion = storedDataRevised?._version || 0;
              if (storedVersion < APP_DATA_VERSION) {
                logger.warn(`repair.js: localStorage data version (${storedVersion}) is older than current (${APP_DATA_VERSION}), clearing stale data.`);
                storedDataRevised = null;
                localStorage.removeItem('appData');
              } else {
                logger.debug(`repair.js: Found localStorage data with version ${storedVersion}.`);
              }
            }
        } catch (e) {
            logger.warn('repair.js: Failed to parse localStorage data, will discard.', e);
            storedDataRevised = null; // Discard invalid stored data
            localStorage.removeItem('appData'); // Clear problematic data
        }
    }

     if (storedDataRevised) {
         logger.debug("repair.js: Merging data from localStorage.");
         // Prioritize storedDataRevised over base (embedded + file accessories)
         workingData = mergeEnhancedData(storedDataRevised, workingData);
     }


    onProgress?.('loading external data');
    // 3. Merge from external gearbox-data.json if available
    // 使用绝对路径确保从任何路由都能正确加载数据
    try {
      const response = await fetch('/gearbox-app/gearbox-data.json?v=' + Date.now());
      if (response.ok) {
        const externalData = await response.json();
        logger.debug("repair.js: Successfully loaded external gearbox-data.json");
        // Prioritize externalData over current workingData (base + stored)
        workingData = mergeEnhancedData(externalData, workingData);
      } else {
        logger.warn("repair.js: Could not load external gearbox-data.json, status:", response.status);
      }
    } catch (fetchError) {
      logger.warn("repair.js: Fetching external data file failed:", fetchError);
    }


    onProgress?.('applying overrides');
    // 4. Merge data from initialDataOverrides (highest priority)
    if (initialDataOverrides && Object.keys(initialDataOverrides).length > 0) {
        logger.debug("repair.js: Merging data from initialDataOverrides (highest priority).");
        // Prioritize overrides over current workingData
        workingData = mergeEnhancedData(initialDataOverrides, workingData, initialDataOverrides); // Pass overrides also as options for prioritized collections
    }


    onProgress?.('applying fixes');
    // 5. Apply Data Fixes in a logical order
    logger.log("repair.js: Applying data fixes...");
    const allRepairWarnings = [];
    const allRepairErrors = []; // Collect errors from critical fixes

    // Step 5.1: Ensure all expected collections are arrays - essential before iterating or processing collections
    let repairedData = ensureCollections(workingData); // <-- Correctly assign to repairedData
    logger.debug("repair.js: Ensured all data collections are initialized.");


    // Step 5.2: Apply special gearbox fixes
    repairedData = fixSpecialGearboxData(repairedData);
    logger.debug("repair.js: Applied special gearbox fixes.");

    // Step 5.3: Ensure core gearbox numeric fields have valid numbers/defaults
     const gearboxNumericFixResult = ensureGearboxNumericFields(repairedData);
     repairedData = gearboxNumericFixResult.data;
     if (gearboxNumericFixResult.warnings && gearboxNumericFixResult.warnings.length > 0) { allRepairWarnings.push(...gearboxNumericFixResult.warnings); logWarn("repair.js: Warnings during gearbox numeric field fixing:", gearboxNumericFixResult.warnings); }
      logger.debug(`repair.js: Ensured gearbox numeric fields (patched ${gearboxNumericFixResult.patched} items).`);

    // Step 5.4: Fix gearbox capacity array lengths and basic validity
    const capacityFixResult = fixGearboxCapacityArrays(repairedData);
    repairedData = capacityFixResult.data;
    if (capacityFixResult.warnings && capacityFixResult.warnings.length > 0) { allRepairWarnings.push(...capacityFixResult.warnings); logWarn("repair.js: Warnings during capacity array fixing:", capacityFixResult.warnings); }
    logger.debug(`repair.js: Applied capacity array fixes (patched ${capacityFixResult.patched} items).`);


    // Step 5.5: Fix Accessories data (Couplings torque/speed/weight, Pumps flow/pressure/power/weight) - Must be AFTER collections are arrays
    const accessoryFixResult = fixAccessories(repairedData);
    repairedData = accessoryFixResult.data;
    if (accessoryFixResult.warnings && accessoryFixResult.warnings.length > 0) { allRepairWarnings.push(...accessoryFixResult.warnings); logWarn("repair.js: Warnings during accessory fixing:", accessoryFixResult.warnings); }
     if (accessoryFixResult.errors && accessoryFixResult.errors.length > 0) { allRepairErrors.push(...accessoryFixResult.errors); logger.error("repair.js: Critical errors during accessory fixing:", accessoryFixResult.errors); }
    logger.debug(`repair.js: Applied accessory fixes (patched ${accessoryFixResult.summary?.totalPatched || 0} items), errors: ${accessoryFixResult.errors?.length || 0}`);


    // Step 5.6: Process and fix price data
    const priceFixResult = processPriceData(repairedData);
    repairedData = priceFixResult.data;
     if (priceFixResult.results?.warnings) allRepairWarnings.push(...priceFixResult.results.warnings);
     if (priceFixResult.results?.errors) allRepairErrors.push(...priceFixResult.results.errors);
     if (priceFixResult.results?.corrected > 0) { logger.debug(`repair.js: Applied general price data processing (corrected ${priceFixResult.results.corrected} items).`); } else { logger.debug(`repair.js: General price data processing complete (0 items corrected).`); }


    // Step 5.7: Apply specific model price overrides
    repairedData = fixSpecificModelPrices(repairedData);
    logger.debug("repair.js: Applied specific model price overrides.");


    onProgress?.('adapting data');
    // 6. Data Adaptation
    logger.debug("repair.js: Adapting data structure...");
    const adaptedData = adaptEnhancedData(repairedData);


    onProgress?.('validating data');
    // 7. Final Validation of the adapted data
    logger.log("repair.js: Performing final data validation...");
    const validationResult = validateDatabase(adaptedData);
    if (!validationResult.success) {
        logger.error("repair.js: Final data validation failed!", validationResult);
        const finalErrors = [...allRepairErrors];
        Object.keys(validationResult.details).forEach(key => {
            if (validationResult.details[key].invalidItems.length > 0) {
                validationResult.details[key].invalidItems.forEach(item => { finalErrors.push(`[Validation Error - ${key}/${item.model || 'Unknown'}] ${item.errors.join('; ')}`); }); // Add model or Unknown
            }
        });
         Object.keys(validationResult.details).forEach(key => {
             if (validationResult.details[key].warningItems.length > 0) {
                 validationResult.details[key].warningItems.forEach(item => { allRepairWarnings.push(`[Validation Warning - ${key}/${item.model || 'Unknown'}] ${item.warnings.join('; ')}`); }); // Add model or Unknown
             }
         });


        if (finalErrors.length > 0) {
            const validationError = new Error(`Data validation failed: ${validationResult.message}. Found ${validationResult.summary.invalid} validation errors and ${allRepairErrors.length} repair errors.`);
            validationError.details = { validation: validationResult, repairErrors: finalErrors, repairWarnings: allRepairWarnings };
            logger.error(validationError);
            throw validationError;
        } else {
             logWarn("repair.js: Validation reported warnings but no critical errors found in data. Proceeding.", validationResult);
             if (allRepairWarnings.length > 0) { logWarn("repair.js: Total repair warnings:", allRepairWarnings); }
        }
    } else {
        logger.log(`repair.js: Final data validation successful. ${validationResult.summary.warnings} warnings.`);
         if (validationResult.summary.warnings > 0) { logWarn("repair.js: Validation warnings:", validationResult.details); }
          if (allRepairWarnings.length > 0) { logWarn("repair.js: Total repair warnings:", allRepairWarnings); }
    }


    onProgress?.('saving data');
    // 8. Update Version and Save to localStorage
    adaptedData._version = APP_DATA_VERSION;
    adaptedData._lastFixed = new Date().toISOString();
    if (allRepairWarnings.length > 0 || allRepairErrors.length > 0) {
        adaptedData.metadata = adaptedData.metadata || {};
        adaptedData.metadata._lastRepairWarnings = allRepairWarnings;
        adaptedData.metadata._lastRepairErrors = allRepairErrors;
    }

    logger.log(`repair.js: Data repair complete. Final version: ${adaptedData._version}`);

    try {
      localStorage.setItem('appData', JSON.stringify(adaptedData));
      logger.debug("repair.js: Successfully saved repaired data to localStorage.");
    } catch (saveError) {
      logger.error("repair.js: Failed to save repaired data to localStorage:", saveError);
    }

    onProgress?.('ready');
    return adaptedData;

  } catch (error) {
    logger.error('repair.js: CRITICAL ERROR caught during data load/repair process:', error);
     if (!error.details) { error.details = { message: error.message }; }
    throw error;
  }
};

// Export necessary functions
export {
  // ensureCollections, mergeDataCollections, mergeEnhancedData // Export if used elsewhere
};