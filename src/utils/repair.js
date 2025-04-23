// src/utils/repair.js
// 系统数据修复与初始化工具

// Import fixData functions that are used directly in repair.js
import {
    fixSpecialGearboxData,
    fixGearboxCapacityArrays,
} from './fixData'; // 确保 fixData.js 导出这些函数

// Import other utilities
import { validateDatabase } from './dataValidator'; // 确保导入路径正确
import { adaptEnhancedData } from './dataAdapter'; // 确保导入路径正确
// import { initialData } from '../data/initialData'; // 假设这个文件可能包含一些基础数据 - 如果 embeddedData 是主要来源，可能不需要
import { embeddedGearboxData } from '../data/embeddedData'; // 使用命名导入嵌入式数据
import { flexibleCouplings } from '../data/flexibleCouplings'; // <--- 导入附件数据文件
import { standbyPumps } from '../data/standbyPumps';     // <--- 导入附件数据文件
import { fixAccessories, ensureGearboxNumericFields } from './fixAccessories'; // <--- 导入新修复函数
import { APP_DATA_VERSION } from '../config'; // 假设 APP_DATA_VERSION 在 config.js 中定义

// Import price management tools
import {
    processPriceData, // 正确导入价格处理函数
    fixSpecificModelPrices,
    getStandardDiscountRate // 尽管在 fixData 中使用，在这里导入也没问题
} from './priceManager'; // 假设 priceManager.js 导出这些函数

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
      console.log(`repair.js::ensureCollections: Initializing missing collection ${collection} as empty array`);
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
       console.warn("repair.js::mergeDataCollections: Skipping item without a model:", sourceItem);
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
      'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes', // Add all gearbox collections
      'flexibleCouplings', 'standbyPumps', // These are also mergeable collections
      // '_priceHistory', // Removed if not stored/merged as a collection directly in data
  ];

  Object.keys(source).forEach(key => {
    // Handle specific prioritized collections from options
    if (options[key] && Array.isArray(options[key])) {
       // If the collection exists in options, use the merge logic with options data having highest priority
        console.log(`repair.js::mergeEnhancedData: Merging prioritized collection: ${key}`);
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
  console.log('repair.js: initializeDataRepair called.');
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
  console.log('repair.js: Starting data loading and repair process...');
  const { onProgress, initialDataOverrides = {} } = options;

  try {
    onProgress?.('initializing');

    // 1. Start with base embedded data + explicitly loaded accessories
    let workingData = {};
    if (embeddedGearboxData) {
         workingData = JSON.parse(JSON.stringify(embeddedGearboxData)); // Deep copy
         console.log("repair.js: Loaded base embedded gearbox data.");
     } else {
         console.error("repair.js: embeddedGearboxData is not defined!");
         // Fallback to an empty structure with default version
         workingData = { _version: APP_DATA_VERSION };
         console.warn("repair.js: Used empty structure as base data fallback.");
     }

    // Explicitly add accessories from their files to the base data
    // Use mergeDataCollections to add/merge from files into the base structure
    // ensureCollections will make sure these keys exist as arrays later if they weren't already
    workingData.flexibleCouplings = mergeDataCollections(flexibleCouplings, workingData.flexibleCouplings);
    workingData.standbyPumps = mergeDataCollections(standbyPumps, workingData.standbyPumps);

    console.log(`repair.js: Added/Merged ${workingData.flexibleCouplings.length} couplings and ${workingData.standbyPumps.length} pumps from source files.`);


    onProgress?.('checking local storage');
    // 2. Merge from localStorage if valid data exists
    const storedDataJsonRevised = localStorage.getItem('appData');
    let storedDataRevised = null;
    if (storedDataJsonRevised) {
        try {
            storedDataRevised = JSON.parse(storedDataJsonRevised);
            // Optional: Version compatibility check can be added here if needed
            console.log(`repair.js: Found localStorage data.`);
        } catch (e) {
            console.warn('repair.js: Failed to parse localStorage data, will discard.', e);
            storedDataRevised = null; // Discard invalid stored data
            localStorage.removeItem('appData'); // Clear problematic data
        }
    }

     if (storedDataRevised) {
         console.log("repair.js: Merging data from localStorage.");
         // Prioritize storedDataRevised over base (embedded + file accessories)
         workingData = mergeEnhancedData(storedDataRevised, workingData);
     }


    onProgress?.('loading external data');
    // 3. Merge from external gearbox-data.json if available
    try {
      const response = await fetch('./gearbox-data.json');
      if (response.ok) {
        const externalData = await response.json();
        console.log("repair.js: Successfully loaded external gearbox-data.json");
        // Prioritize externalData over current workingData (base + stored)
        workingData = mergeEnhancedData(externalData, workingData);
      } else {
        console.warn("repair.js: Could not load external gearbox-data.json, status:", response.status);
      }
    } catch (fetchError) {
      console.warn("repair.js: Fetching external data file failed:", fetchError);
    }


    onProgress?.('applying overrides');
    // 4. Merge data from initialDataOverrides (highest priority)
    if (initialDataOverrides && Object.keys(initialDataOverrides).length > 0) {
        console.log("repair.js: Merging data from initialDataOverrides (highest priority).");
        // Prioritize overrides over current workingData
        workingData = mergeEnhancedData(initialDataOverrides, workingData, initialDataOverrides); // Pass overrides also as options for prioritized collections
    }


    onProgress?.('applying fixes');
    // 5. Apply Data Fixes in a logical order
    console.log("repair.js: Applying data fixes...");
    const allRepairWarnings = [];
    const allRepairErrors = []; // Collect errors from critical fixes

    // Step 5.1: Ensure all expected collections are arrays - essential before iterating or processing collections
    let repairedData = ensureCollections(workingData); // <-- Correctly assign to repairedData
    console.log("repair.js: Ensured all data collections are initialized.");


    // Step 5.2: Apply special gearbox fixes
    repairedData = fixSpecialGearboxData(repairedData);
    console.log("repair.js: Applied special gearbox fixes.");

    // Step 5.3: Ensure core gearbox numeric fields have valid numbers/defaults
     const gearboxNumericFixResult = ensureGearboxNumericFields(repairedData);
     repairedData = gearboxNumericFixResult.data;
     if (gearboxNumericFixResult.warnings && gearboxNumericFixResult.warnings.length > 0) { allRepairWarnings.push(...gearboxNumericFixResult.warnings); console.warn("repair.js: Warnings during gearbox numeric field fixing:", gearboxNumericFixResult.warnings); }
      console.log(`repair.js: Ensured gearbox numeric fields (patched ${gearboxNumericFixResult.patched} items).`);

    // Step 5.4: Fix gearbox capacity array lengths and basic validity
    const capacityFixResult = fixGearboxCapacityArrays(repairedData);
    repairedData = capacityFixResult.data;
    if (capacityFixResult.warnings && capacityFixResult.warnings.length > 0) { allRepairWarnings.push(...capacityFixResult.warnings); console.warn("repair.js: Warnings during capacity array fixing:", capacityFixResult.warnings); }
    console.log(`repair.js: Applied capacity array fixes (patched ${capacityFixResult.patched} items).`);


    // Step 5.5: Fix Accessories data (Couplings torque/speed/weight, Pumps flow/pressure/power/weight) - Must be AFTER collections are arrays
    const accessoryFixResult = fixAccessories(repairedData);
    repairedData = accessoryFixResult.data;
    if (accessoryFixResult.warnings && accessoryFixResult.warnings.length > 0) { allRepairWarnings.push(...accessoryFixResult.warnings); console.warn("repair.js: Warnings during accessory fixing:", accessoryFixResult.warnings); }
     if (accessoryFixResult.errors && accessoryFixResult.errors.length > 0) { allRepairErrors.push(...accessoryFixResult.errors); console.error("repair.js: Critical errors during accessory fixing:", accessoryFixResult.errors); }
    console.log(`repair.js: Applied accessory fixes (patched ${accessoryFixResult.summary?.totalPatched || 0} items), errors: ${accessoryFixResult.errors?.length || 0}`);


    // Step 5.6: Process and fix price data
    const priceFixResult = processPriceData(repairedData);
    repairedData = priceFixResult.data;
     if (priceFixResult.results?.warnings) allRepairWarnings.push(...priceFixResult.results.warnings);
     if (priceFixResult.results?.errors) allRepairErrors.push(...priceFixResult.results.errors);
     if (priceFixResult.results?.corrected > 0) { console.log(`repair.js: Applied general price data processing (corrected ${priceFixResult.results.corrected} items).`); } else { console.log(`repair.js: General price data processing complete (0 items corrected).`); }


    // Step 5.7: Apply specific model price overrides
    repairedData = fixSpecificModelPrices(repairedData);
    console.log("repair.js: Applied specific model price overrides.");


    onProgress?.('adapting data');
    // 6. Data Adaptation
    console.log("repair.js: Adapting data structure...");
    const adaptedData = adaptEnhancedData(repairedData);


    onProgress?.('validating data');
    // 7. Final Validation of the adapted data
    console.log("repair.js: Performing final data validation...");
    const validationResult = validateDatabase(adaptedData);
    if (!validationResult.success) {
        console.error("repair.js: Final data validation failed!", validationResult);
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
            console.error(validationError);
            throw validationError;
        } else {
             console.warn("repair.js: Validation reported warnings but no critical errors found in data. Proceeding.", validationResult);
             if (allRepairWarnings.length > 0) { console.warn("repair.js: Total repair warnings:", allRepairWarnings); }
        }
    } else {
        console.log(`repair.js: Final data validation successful. ${validationResult.summary.warnings} warnings.`);
         if (validationResult.summary.warnings > 0) { console.warn("repair.js: Validation warnings:", validationResult.details); }
          if (allRepairWarnings.length > 0) { console.warn("repair.js: Total repair warnings:", allRepairWarnings); }
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

    console.log(`repair.js: Data repair complete. Final version: ${adaptedData._version}`);

    try {
      localStorage.setItem('appData', JSON.stringify(adaptedData));
      console.log("repair.js: Successfully saved repaired data to localStorage.");
    } catch (saveError) {
      console.error("repair.js: Failed to save repaired data to localStorage:", saveError);
    }

    onProgress?.('ready');
    return adaptedData;

  } catch (error) {
    console.error('repair.js: CRITICAL ERROR caught during data load/repair process:', error);
     if (!error.details) { error.details = { message: error.message }; }
    throw error;
  }
};

// Export necessary functions
export {
  // ensureCollections, mergeDataCollections, mergeEnhancedData // Export if used elsewhere
};