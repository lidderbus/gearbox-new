"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixOtherGearboxData = exports.fixMvGearboxData = exports.fixHcvGearboxData = exports.fixHcaGearboxData = exports.fixHcxGearboxData = exports.fixGCGearboxData = exports.fixHCQGearboxData = exports.fixDTGearboxData = exports.fixHCMGearboxData = exports.fixGWGearboxData = exports.fixGearboxCapacityArrays = exports.fixSpecialGearboxData = void 0;

var _priceManager = require("./priceManager");

var _dataHelpers = require("./dataHelpers");

var _capacityEstimator = require("./capacityEstimator");

var _gearboxMatchingMaps = require("../data/gearboxMatchingMaps");

// src/utils/fixData.js
// 系统数据修复工具
// Update import to use priceManager instead of priceDiscount
// Assuming dataHelpers.js exists for safeParseFloat
// Assuming capacityEstimator.js exists
// Assuming gearboxMatchingMaps.js exists for couplingSpecificationsMap
// --- Gearbox Specific Fix Functions ---

/**
 * 修复2GWH系列和混合动力齿轮箱数据
 * @param {Object} data 应用数据对象
 * @returns {Object} 修复后的数据对象
 */
var fixSpecialGearboxData = function fixSpecialGearboxData(data) {
  if (!data) return data; // Return data if null/undefined

  var fixedData = JSON.parse(JSON.stringify(data)); // Deep copy
  // Fix GW series double-engine models (2GWH)

  if (Array.isArray(fixedData.gwGearboxes)) {
    // Ensure it's an array
    fixedData.gwGearboxes.forEach(function (item) {
      if (!item || !item.model) return; // Skip invalid items

      if (item.model.startsWith('2GWH')) {
        // Ensure transferCapacity is an array matching ratios length
        if (Array.isArray(item.ratios) && item.ratios.length > 0) {
          if (!Array.isArray(item.transferCapacity) || item.transferCapacity.length !== item.ratios.length) {
            var capacityValue = Array.isArray(item.transferCapacity) && item.transferCapacity.length > 0 ? item.transferCapacity[0] : item.transferCapacityPerEngine || 1.0; // Use perEngine capacity or default

            item.transferCapacity = Array(item.ratios.length).fill(capacityValue);
            console.log("fixData: Corrected 2GWH ".concat(item.model, " transferCapacity array length."));
          }
        } else if (!Array.isArray(item.transferCapacity) || item.transferCapacity.length === 0) {
          // If no ratios but capacity data exists, just ensure capacity is an array
          var _capacityValue = Array.isArray(item.transferCapacity) && item.transferCapacity.length > 0 ? item.transferCapacity[0] : item.transferCapacityPerEngine || 1.0;

          item.transferCapacity = [_capacityValue];
          console.log("fixData: Corrected 2GWH ".concat(item.model, " transferCapacity to single array."));
        } // Ensure weight exists and is positive


        if ((0, _dataHelpers.safeParseFloat)(item.weight) === undefined || (0, _dataHelpers.safeParseFloat)(item.weight) <= 0) {
          // Estimate weight based on model number if possible
          var modelNumberMatch = item.model.match(/2GWH(\d+)/);

          if (modelNumberMatch && modelNumberMatch[1]) {
            var modelNumber = parseInt(modelNumberMatch[1]);

            if (!isNaN(modelNumber)) {
              item.weight = Math.max(10000, modelNumber * 10); // Rough estimation

              console.log("fixData: Estimated 2GWH ".concat(item.model, " weight based on model number."));
            } else {
              item.weight = 15000; // Default if estimation fails

              console.warn("fixData: Could not estimate 2GWH ".concat(item.model, " weight from model number, set default."));
            }
          } else {
            item.weight = 15000; // Default if no number in model name

            console.warn("fixData: Could not extract number from 2GWH ".concat(item.model, " model name for weight estimation, set default."));
          }
        } // Ensure centerDistance exists and is positive


        if ((0, _dataHelpers.safeParseFloat)(item.centerDistance) === undefined || (0, _dataHelpers.safeParseFloat)(item.centerDistance) <= 0) {
          if ((0, _dataHelpers.safeParseFloat)(item.standardCenterDistance) > 0) {
            // Use standard if available
            item.centerDistance = item.standardCenterDistance;
            console.log("fixData: Used standardCenterDistance for 2GWH ".concat(item.model, " centerDistance."));
          } else {
            // Rough estimation based on model number or default
            var _modelNumberMatch = item.model.match(/2GWH(\d+)/);

            if (_modelNumberMatch && _modelNumberMatch[1]) {
              var _modelNumber = parseInt(_modelNumberMatch[1]);

              if (!isNaN(_modelNumber)) {
                item.centerDistance = Math.max(1000, Math.round(_modelNumber * 1.5)); // Rough estimation

                console.log("fixData: Estimated 2GWH ".concat(item.model, " centerDistance based on model number."));
              } else {
                item.centerDistance = 1500; // Default

                console.warn("fixData: Could not estimate 2GWH ".concat(item.model, " centerDistance from model number, set default."));
              }
            } else {
              item.centerDistance = 1500; // Default

              console.warn("fixData: Could not extract number from 2GWH ".concat(item.model, " model name for centerDistance estimation, set default."));
            }
          }
        } // Prices will be handled by processPriceData

      }
    });
  } // Fix HCQ Hybrid models


  if (Array.isArray(fixedData.hcqGearboxes)) {
    // Ensure it's an array
    fixedData.hcqGearboxes.forEach(function (item) {
      if (!item || !item.model) return; // Skip invalid items

      if (item._isHybrid || item.model && ['HC400P', 'HC600P', 'HC1200P'].includes(item.model)) {
        // Ensure _isHybrid marker
        if (!item._isHybrid) item._isHybrid = true; // Ensure transferCapacity is an array matching ratios length

        if (Array.isArray(item.ratios) && item.ratios.length > 0) {
          if (!Array.isArray(item.transferCapacity) || item.transferCapacity.length !== item.ratios.length) {
            var capacityValue = Array.isArray(item.transferCapacity) && item.transferCapacity.length > 0 ? item.transferCapacity[0] : item._mainTransferCapacity || 0.3; // Use main capacity or default

            item.transferCapacity = Array(item.ratios.length).fill(capacityValue);
            console.log("fixData: Corrected Hybrid ".concat(item.model, " transferCapacity array length."));
          }
        } else if (!Array.isArray(item.transferCapacity) || item.transferCapacity.length === 0) {
          // If no ratios but capacity data exists, just ensure capacity is an array
          var _capacityValue2 = Array.isArray(item.transferCapacity) && item.transferCapacity.length > 0 ? item.transferCapacity[0] : item._mainTransferCapacity || 0.3;

          item.transferCapacity = [_capacityValue2];
          console.log("fixData: Corrected Hybrid ".concat(item.model, " transferCapacity to single array."));
        } // Ensure weight exists and is positive


        if ((0, _dataHelpers.safeParseFloat)(item.weight) === undefined || (0, _dataHelpers.safeParseFloat)(item.weight) <= 0) {
          // Estimate weight based on specific models or use a default
          if (item.model === 'HC400P') item.weight = 900;else if (item.model === 'HC600P') item.weight = 1500;else if (item.model === 'HC1200P') item.weight = 2100;else item.weight = 1200; // Default

          console.log("fixData: Corrected/Estimated Hybrid ".concat(item.model, " weight."));
        } // Ensure centerDistance exists and is positive (Estimating based on model number)


        if ((0, _dataHelpers.safeParseFloat)(item.centerDistance) === undefined || (0, _dataHelpers.safeParseFloat)(item.centerDistance) <= 0) {
          var modelNumberMatch = item.model.match(/HC(\d+)/) || item.model.match(/HCQ(\d+)/); // Try to extract number

          if (modelNumberMatch && modelNumberMatch[1]) {
            var modelNumber = parseInt(modelNumberMatch[1]);

            if (!isNaN(modelNumber)) {
              item.centerDistance = Math.max(100, Math.round(modelNumber * 0.8)); // Rough estimation

              console.log("fixData: Estimated Hybrid ".concat(item.model, " centerDistance based on model number."));
            } else {
              item.centerDistance = 200; // Default

              console.warn("fixData: Could not estimate Hybrid ".concat(item.model, " centerDistance from model number, set default."));
            }
          } else {
            item.centerDistance = 200; // Default

            console.warn("fixData: Could not extract number from Hybrid ".concat(item.model, " model name for centerDistance estimation, set default."));
          }
        } // Prices will be handled by processPriceData

      }
    });
  }

  return fixedData; // Return the modified data object
};
/**
 * Fixes capacity array length for various gearbox series if needed.
 * This logic was moved here from specific fix functions.
 * @param {Object} data The data object containing gearbox collections
 * @returns {Object} { data, patched: number, warnings: string[] }
 */


exports.fixSpecialGearboxData = fixSpecialGearboxData;

var fixGearboxCapacityArrays = function fixGearboxCapacityArrays(data) {
  if (!data) return {
    data: data,
    patched: 0,
    warnings: []
  };
  var patched = 0;
  var warnings = []; // Define warnings array here
  // List of gearbox collections that might need capacity array length fixing

  var gearboxCollections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes'];
  gearboxCollections.forEach(function (key) {
    if (Array.isArray(data[key])) {
      data[key].forEach(function (item) {
        if (!item || !item.model) return; // Ensure ratios array exists and is valid first (critical for capacity length check)

        if (!Array.isArray(item.ratios) || item.ratios.length === 0 || !item.ratios.every(function (v) {
          return typeof v === 'number' && !isNaN(v) && v > 0;
        })) {
          // If ratios are invalid/missing, we can't fix capacity array length based on them.
          // This should probably be flagged as a more critical error in validation.
          if (Array.isArray(item.transferCapacity) && item.transferCapacity.length > 0) {
            warnings.push("fixData: Item ".concat(item.model, " has transferCapacity data but invalid/missing ratios. Cannot fix capacity array length."));
          } else if (item.transferCapacity !== undefined && item.transferCapacity !== null) {
            warnings.push("fixData: Item ".concat(item.model, " has single transferCapacity value but invalid/missing ratios."));
          } else {// If neither ratios nor capacity are valid, validation will flag missing fields.
          }

          return; // Cannot proceed with capacity length fix for this item
        } // Now that we know ratios is a valid array, check capacity


        if (!Array.isArray(item.transferCapacity) || item.transferCapacity.length !== item.ratios.length) {
          // Capacity data is missing as an array or has the wrong length
          var hasSomeValidCapacityData = Array.isArray(item.transferCapacity) && item.transferCapacity.length > 0 && item.transferCapacity.every(function (v) {
            return typeof v === 'number' && v > 0;
          }) || typeof item.transferCapacity === 'number' && item.transferCapacity > 0;

          if (hasSomeValidCapacityData) {
            // Use the first valid capacity value found or the single value
            var capacityValue = Array.isArray(item.transferCapacity) && item.transferCapacity.length > 0 && typeof item.transferCapacity[0] === 'number' && item.transferCapacity[0] > 0 ? item.transferCapacity[0] : typeof item.transferCapacity === 'number' && item.transferCapacity > 0 ? item.transferCapacity : 0.1; // Fallback default

            item.transferCapacity = Array(item.ratios.length).fill(capacityValue);
            patched++;
            console.log("fixData: Corrected ".concat(item.model, " transferCapacity array length based on existing data or default."));
          } else {
            // No valid existing capacity data - attempt estimation or fill with default
            // This part relies on estimateTransferCapacityArray, ensure it's suitable for all series
            var estimatedCapacity = (0, _capacityEstimator.estimateTransferCapacityArray)(item, item.ratios); // Assuming this works

            if (estimatedCapacity && Array.isArray(estimatedCapacity) && estimatedCapacity.length === item.ratios.length) {
              item.transferCapacity = estimatedCapacity;
              patched++;
              console.log("fixData: Estimated ".concat(item.model, " transferCapacity array."));
            } else {
              // Last resort: fill with a small default capacity array
              item.transferCapacity = Array(item.ratios.length).fill(0.1);
              patched++;
              warnings.push("fixData: Could not estimate transferCapacity for ".concat(item.model, ", filled with default array."));
            }
          }
        } else if (Array.isArray(item.transferCapacity) && item.transferCapacity.some(function (v) {
          return typeof v !== 'number' || isNaN(v) || v <= 0;
        })) {
          // Array exists and has correct length, but contains invalid/non-positive values
          console.warn("fixData: ".concat(item.model, " transferCapacity array contains invalid/non-positive values. Attempting to fix."));
          var validCapacities = item.transferCapacity.filter(function (v) {
            return typeof v === 'number' && v > 0;
          });
          var avgCapacity = validCapacities.length > 0 ? validCapacities.reduce(function (sum, val) {
            return sum + val;
          }, 0) / validCapacities.length : 0;
          var defaultCapacity = avgCapacity > 0 ? avgCapacity : 0.1; // Use average or default

          item.transferCapacity = item.transferCapacity.map(function (v) {
            var val = (0, _dataHelpers.safeParseFloat)(v);
            return val !== undefined && val > 0 ? val : defaultCapacity;
          });
          patched++;
        } // If capacity array exists, has correct length, and all values are valid/positive, do nothing.

      });
    } // If collection doesn't exist or isn't an array, ensureCollections handles it.

  });
  return {
    data: data,
    patched: patched,
    warnings: warnings
  };
}; // --- General Gearbox Data Fix Functions (might need capacity fixes) ---
// Note: fixGWGearboxData, fixHCMGearboxData, fixDTGearboxData, fixHCQGearboxData, fixGCGearboxData
// These functions are intended for non-price/non-special fixes.
// Capacity array length fixing logic was moved to fixGearboxCapacityArrays.
// Let's simplify these functions to only include other specific fixes if needed.

/**
 * Placeholder for potential GW specific non-price fixes
 * (Excluding 2GWH and capacity array length, which are handled elsewhere)
 * @param {Array} gearboxes GW系列齿轮箱数组
 * @returns {Array} Fixed GW series gearbox array
 */


exports.fixGearboxCapacityArrays = fixGearboxCapacityArrays;

var fixGWGearboxData = function fixGWGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return []; // Add any non-2GWH, non-capacity GW specific fixes here if needed

  return gearboxes;
};
/**
 * Fix HCM series gearbox data (Currently only price is handled elsewhere)
 * @param {Array} gearboxes HCM series gearbox array
 * @returns {Array} Fixed HCM series gearbox array
 */


exports.fixGWGearboxData = fixGWGearboxData;

var fixHCMGearboxData = function fixHCMGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return []; // Capacity array length fixing is now handled by fixGearboxCapacityArrays
  // Add any HCM specific non-price/non-capacity fixes here if needed

  return gearboxes;
};
/**
 * Fix DT series gearbox data (Currently only price is handled elsewhere)
 * @param {Array} gearboxes DT series gearbox array
 * @returns {Array} Fixed DT series gearbox array
 */


exports.fixHCMGearboxData = fixHCMGearboxData;

var fixDTGearboxData = function fixDTGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return []; // Capacity array length fixing is now handled by fixGearboxCapacityArrays
  // Add any DT specific non-price/non-capacity fixes here if needed

  return gearboxes;
};
/**
 * Fix HCQ series gearbox data (Currently only price is handled elsewhere)
 * @param {Array} gearboxes HCQ series gearbox array
 * @returns {Array} Fixed HCQ series gearbox array
 */


exports.fixDTGearboxData = fixDTGearboxData;

var fixHCQGearboxData = function fixHCQGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return []; // Note: fixSpecialGearboxData handles HCQ Hybrid capacity, thrust, weight, centerDistance
  // Capacity array length fixing is now handled by fixGearboxCapacityArrays (for non-hybrids)
  // Add any non-Hybrid, non-capacity HCQ specific fixes here if needed

  return gearboxes;
};
/**
 * Fix GC series gearbox data (Currently only price is handled elsewhere)
 * @param {Array} gearboxes GC series gearbox array
 * @returns {Array} Fixed GC series gearbox array
 */


exports.fixHCQGearboxData = fixHCQGearboxData;

var fixGCGearboxData = function fixGCGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return []; // Capacity array length fixing is now handled by fixGearboxCapacityArrays
  // Add any GC specific non-price/non-capacity fixes here if needed

  return gearboxes;
};
/**
 * Placeholder for potential specific non-price/non-capacity fixes for HCX, HCA, HCV, MV, Other series
 * These functions are not yet implemented based on specific data needs.
 */


exports.fixGCGearboxData = fixGCGearboxData;

var fixHcxGearboxData = function fixHcxGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return [];
  return gearboxes;
};

exports.fixHcxGearboxData = fixHcxGearboxData;

var fixHcaGearboxData = function fixHcaGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return [];
  return gearboxes;
};

exports.fixHcaGearboxData = fixHcaGearboxData;

var fixHcvGearboxData = function fixHcvGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return [];
  return gearboxes;
};

exports.fixHcvGearboxData = fixHcvGearboxData;

var fixMvGearboxData = function fixMvGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return [];
  return gearboxes;
};

exports.fixMvGearboxData = fixMvGearboxData;

var fixOtherGearboxData = function fixOtherGearboxData(gearboxes) {
  if (!Array.isArray(gearboxes)) return [];
  return gearboxes;
}; // Note: Accessory fixing (couplings, pumps) is done by fixAccessories in repair.js


exports.fixOtherGearboxData = fixOtherGearboxData;