// src/utils/dataCorrector.js
// 数据修正工具

// Assuming priceDiscount.js exists for price calculations (Note: processPriceData handles this now)
// import { getDiscountRate, calculateFactoryPrice, calculateMarketPrice } from './priceDiscount';
// Assuming dataHelpers.js exists for safeParseFloat
import { safeParseFloat } from './dataHelpers'; // Ensure import path is correct
// Assuming capacityEstimator.js exists (Note: fixGearboxCapacityArrays uses this)
// import { estimateTransferCapacityArray } from './capacityEstimator';
// Assuming gearboxMatchingMaps.js exists for couplingSpecificationsMap (Note: fixAccessories uses this)
// import { couplingSpecificationsMap } from '../data/gearboxMatchingMaps';

// Import specific repair functions from fixData.js
import { fixSpecialGearboxData, fixGearboxCapacityArrays } from './fixData'; // Ensure import path is correct
// Import accessory fixing function
import { fixAccessories, ensureGearboxNumericFields } from './fixAccessories'; // <--- IMPORT NEW FIX FUNCTIONS

// Import price management tools
import { processPriceData, correctPriceData, fixSpecificModelPrices } from './priceManager'; // Ensure import path is correct

// 这些函数现在主要由 processPriceData 处理，保留是为了向后兼容或特定用途
/**
 * 修正单个齿轮箱的价格数据 (重命名并使用 correctPriceData)
 * @param {Object} gearbox 齿轮箱对象
 * @returns {Object} 修正后的齿轮箱对象
 */
export const correctGearboxPrices = (gearbox) => {
  const correctedData = correctPriceData(gearbox);
  return correctedData;
};

/**
 * 修正单个联轴器的价格数据 (重命名并使用 correctPriceData)
 * @param {Object} coupling 联轴器对象
 * @returns {Object} 修正后的联轴器对象
 */
export const correctCouplingPrices = (coupling) => {
  const correctedData = correctPriceData(coupling);
  return correctedData;
};

/**
 * 修正单个泵的价格数据 (重命名并使用 correctPriceData)
 * @param {Object} pump 泵对象
 * @returns {Object} 修正后的泵对象
 */
export const correctPumpPrices = (pump) => {
  const correctedData = correctPriceData(pump);
  return correctedData;
};


/**
 * 修正整个数据库 (应用所有可用的修复步骤)
 * 此函数用于在数据导入或需要整体修正时调用。
 * @param {Object} data 数据库对象
 * @returns {Object} 修正结果，包含修正后的数据、警告和错误信息
 */
export const correctDatabase = (data) => {
    console.log('dataCorrector.js: Starting database correction...');
    let workingData = data ? JSON.parse(JSON.stringify(data)) : {}; // Create a mutable copy
    const allWarnings = [];
    const allErrors = []; // Collect errors from critical fixes

    // Step 1: Apply specific gearbox fixes (like 2GWH, Hybrid markers/basic structure)
    workingData = fixSpecialGearboxData(workingData);
    console.log("dataCorrector.js: Applied special gearbox fixes.");

    // Step 2: Fix gearbox capacity array lengths and basic validity (depends on ratios)
    const capacityFixResult = fixGearboxCapacityArrays(workingData);
    workingData = capacityFixResult.data;
    if (capacityFixResult.warnings && capacityFixResult.warnings.length > 0) {
        allWarnings.push(...capacityFixResult.warnings);
        console.warn("dataCorrector.js: Warnings during capacity array fixing:", capacityFixResult.warnings);
    }
    console.log(`dataCorrector.js: Applied capacity array fixes (patched ${capacityFixResult.patched} items).`);


     // Step 3: Ensure core numeric fields for gearboxes have valid numbers/defaults
     const gearboxNumericFixResult = ensureGearboxNumericFields(workingData); // <--- CALL NEW FIX FUNCTION
     workingData = gearboxNumericFixResult.data;
     if (gearboxNumericFixResult.warnings && gearboxNumericFixResult.warnings.length > 0) {
        allWarnings.push(...gearboxNumericFixResult.warnings);
         console.warn("dataCorrector.js: Warnings during gearbox numeric field fixing:", gearboxNumericFixResult.warnings);
     }
      console.log(`dataCorrector.js: Ensured gearbox numeric fields (patched ${gearboxNumericFixResult.patched} items).`);


    // Step 4: Fix Accessories data (Couplings torque/speed/weight, Pumps flow/pressure/power/weight)
    // This is crucial for accessory selection later. Needs to be before price processing if price depends on corrected values.
    const accessoryFixResult = fixAccessories(workingData); // <--- CALL NEW FIX FUNCTION
    workingData = accessoryFixResult.data;
    if (accessoryFixResult.warnings && accessoryFixResult.warnings.length > 0) {
        allWarnings.push(...accessoryFixResult.warnings);
        console.warn("dataCorrector.js: Warnings during accessory fixing:", accessoryFixResult.warnings);
    }
     if (accessoryFixResult.errors && accessoryFixResult.errors.length > 0) {
         allErrors.push(...accessoryFixResult.errors);
         console.error("dataCorrector.js: Errors during accessory fixing:", accessoryFixResult.errors);
     }
    console.log(`dataCorrector.js: Applied accessory fixes (patched ${accessoryFixResult.summary?.totalPatched} items), errors: ${accessoryFixResult.errors?.length}`);


    // Step 5: Process and fix price data (calculates factory/market prices, ensures consistency)
    // This should run after all other data fields relevant to price calculation (like basePrice, discountRate) are fixed/present.
    const priceFixResult = processPriceData(workingData);
    workingData = priceFixResult.data;
     // processPriceData itself might report issues via its results property, decide if you want to merge them
    // allWarnings.push(...(priceFixResult.results?.warnings || [])); // Assuming processPriceData results has a warnings array
    console.log(`dataCorrector.js: Applied general price data processing (corrected ${priceFixResult.results?.corrected || 0} items).`);


    // Step 6: Apply specific model price overrides (these are hardcoded values)
    // This runs last among price fixes to ensure these specific prices take precedence.
    workingData = fixSpecificModelPrices(workingData);
    console.log("dataCorrector.js: Applied specific model price overrides.");

    console.log('dataCorrector.js: Database correction complete.');

    return {
        data: workingData,
        summary: {
            totalPatchedItems: (capacityFixResult.patched || 0) + (gearboxNumericFixResult.patched || 0) + (accessoryFixResult.summary?.totalPatched || 0) + (priceFixResult.results?.corrected || 0),
            totalWarnings: allWarnings.length,
            totalErrors: allErrors.length,
        },
        warnings: allWarnings,
        errors: allErrors, // Return collected critical errors
    };
};

// Export the main correction function
// export { correctDatabase }; // Already exported above