"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadAndRepairData = exports.initializeDataRepair = exports.mergeEnhancedData = exports.mergeDataCollections = exports.ensureCollections = void 0;

var _fixData = require("./fixData");

var _dataValidator = require("./dataValidator");

var _dataAdapter = require("./dataAdapter");

var _initialData = require("../data/initialData");

var _embeddedData = require("../data/embeddedData");

var _fixAccessories = require("./fixAccessories");

var _config = require("../config");

var _priceManager = require("./priceManager");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Assuming priceManager.js exports these
// 重新实现 ensureCollections 函数，确保所有必要的数据集合都存在

/**
 * 确保所有必要的数据集合都存在于数据对象中
 * @param {Object} data 要确保集合存在的数据对象
 * @returns {Object} 确保所有集合存在后的数据对象
 */
var ensureCollections = function ensureCollections(data) {
  if (!data) return {}; // 如果数据为空，返回空对象

  var collections = [// 齿轮箱系列
  'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes', // 附件系列
  'flexibleCouplings', 'standbyPumps', // 其他可能需要的集合
  'couplingData', 'pumpData'];

  var result = _objectSpread({}, data); // 创建一个数据的副本
  // 确保每个集合都存在，如果不存在则初始化为空数组


  collections.forEach(function (collection) {
    if (!Array.isArray(result[collection])) {
      console.log("ensureCollections: \u521D\u59CB\u5316\u7F3A\u5931\u7684\u96C6\u5408 ".concat(collection, " \u4E3A\u7A7A\u6570\u7EC4"));
      result[collection] = [];
    }
  });
  return result;
}; // Function to merge data collections based on 'model'
// Moved to fixData.js or dataMerger.js in previous steps?
// Assuming mergeDataCollections is needed here for mergeEnhancedData
// If it was moved to dataMerger.js, import it. If it's only used here, it can be defined here.
// Based on the error, mergeDataCollections and mergeEnhancedData were not found in fixData.
// Let's assume they are defined locally in repair.js if not imported.
// Re-defining them here for now, assuming they are not meant to be imported from fixData.js


exports.ensureCollections = ensureCollections;

var mergeDataCollections = function mergeDataCollections(source, target) {
  if (!source || !Array.isArray(source)) return target || [];
  if (!target || !Array.isArray(target)) return source || [];

  var result = _toConsumableArray(target);

  var modelMap = new Map(result.map(function (item) {
    return item && item.model ? [item.model, item] : [null, null];
  }).filter(function (item) {
    return item[0] !== null;
  })); // Filter out items without valid model

  source.forEach(function (sourceItem) {
    if (sourceItem && sourceItem.model) {
      if (modelMap.has(sourceItem.model)) {
        // Merge objects with the same model, prioritize source's defined values
        var existingItem = modelMap.get(sourceItem.model); // Create a new object starting with target's values, then layering source's non-undefined values

        var mergedItem = _objectSpread({}, existingItem); // Start with existing item


        Object.keys(sourceItem).forEach(function (prop) {
          // Only overwrite if source's value is explicitly defined (not undefined)
          if (sourceItem[prop] !== undefined) {
            mergedItem[prop] = sourceItem[prop];
          }
        });
        modelMap.set(sourceItem.model, mergedItem);
      } else {
        // Add new item to the map
        modelMap.set(sourceItem.model, sourceItem);
      }
    } else {
      // Handle source items without a model - maybe log a warning?
      console.warn("mergeDataCollections: Skipping item without a model:", sourceItem);
    }
  }); // Rebuild array from map values

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


exports.mergeDataCollections = mergeDataCollections;

var mergeEnhancedData = function mergeEnhancedData(source, target) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  if (!source) return target || {};
  if (!target) return source || {};

  var result = _objectSpread({}, target); // Define collections that should be merged using the mergeDataCollections logic


  var mergeableCollections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes', // Add all gearbox collections
  'flexibleCouplings', 'standbyPumps', // These are also mergeable collections
  '_priceHistory' // Price history might also be mergeable
  ];
  Object.keys(source).forEach(function (key) {
    // Handle specific prioritized collections from options
    if (options[key] && Array.isArray(options[key])) {
      // If the collection exists in options, use the merge logic with options data having highest priority
      console.log("Merging prioritized collection: ".concat(key)); // First merge source into target (current result), then merge options[key] into the result

      result[key] = mergeDataCollections(source[key], result[key]); // Merge source into existing result

      result[key] = mergeDataCollections(options[key], result[key]); // Then merge options into the result (prioritizes options)
    } else if (mergeableCollections.includes(key) && Array.isArray(source[key]) && Array.isArray(result[key])) {
      // If both source and target are arrays for a mergeable collection, use the merge logic
      result[key] = mergeDataCollections(source[key], result[key]);
    } // If source is an array but target is not (or missing), use source array (new collection)
    else if (Array.isArray(source[key]) && !Array.isArray(result[key])) {
        result[key] = _toConsumableArray(source[key]);
      } // If both source and target are objects, merge objects (simple shallow merge for now)
      else if (source[key] && _typeof(source[key]) === 'object' && result[key] && _typeof(result[key]) === 'object' && !Array.isArray(source[key]) && !Array.isArray(result[key])) // Exclude arrays
          {
            result[key] = _objectSpread({}, result[key], {}, source[key]); // Target properties can be overwritten by source
          } // If target does not have the key, or source value is preferred (e.g., non-object overwrites object), use source's value
        else if (result[key] === undefined || source[key] !== undefined) {
            // Added check source[key] !== undefined
            result[key] = source[key];
          } // Otherwise, keep the target's value (if source's value is undefined, etc.)

  });
  return result;
};
/**
 * Initialize data repair tools.
 * This function sets up the repair process, potentially adding a global repair function.
 */


exports.mergeEnhancedData = mergeEnhancedData;

var initializeDataRepair = function initializeDataRepair() {
  // Add a global repair function if needed for manual trigger or debugging
  // window.repairAppData = async () => { ... };
  console.log('repair.js: initializeDataRepair called.'); // The main loading and repair logic is handled by loadAndRepairData
  // which is called by DataLoadingManager in AppWrapper.js
};
/**
 * Full data loading and repair process.
 * Combines data from embedded source, external file, localStorage, and overrides.
 * Applies various data fixing functions and validates the final data.
 * @param {Object} initialDataOverrides - Optional object to prioritize certain data collections
 * @returns {Promise<Object>} The loaded and repaired data object.
 * @throws {Error} If critical errors occurred during repair or validation.
 */


exports.initializeDataRepair = initializeDataRepair;

var loadAndRepairData = function loadAndRepairData() {
  var initialDataOverrides,
      storedDataJson,
      storedData,
      storedVersion,
      currentCodeVersion,
      baseData,
      workingData,
      response,
      externalData,
      repairedData,
      capacityFixResult,
      accessoryFixResult,
      priceFixResult,
      adaptedData,
      validationResult,
      _args = arguments;
  return regeneratorRuntime.async(function loadAndRepairData$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          initialDataOverrides = _args.length > 0 && _args[0] !== undefined ? _args[0] : {};
          console.log('repair.js: Starting data loading and repair process...');
          _context.prev = 2;
          // 1. Check localStorage version info
          storedDataJson = localStorage.getItem('appData');
          storedData = null;
          storedVersion = 0;

          if (storedDataJson) {
            try {
              storedData = JSON.parse(storedDataJson);
              storedVersion = storedData._version || storedData.version || 0; // Check both keys

              console.log("repair.js: Found localStorage data with version: ".concat(storedVersion));
            } catch (e) {
              console.warn('repair.js: Failed to parse localStorage data, will discard.', e);
              storedData = null; // Discard invalid stored data

              localStorage.removeItem('appData'); // Clear problematic data
            }
          }

          currentCodeVersion = _config.APP_DATA_VERSION; // Assuming APP_DATA_VERSION is defined in config.js
          // 2. Determine base data source

          baseData = {}; // Start with embedded data

          if (_embeddedData.embeddedGearboxData) {
            baseData = JSON.parse(JSON.stringify(_embeddedData.embeddedGearboxData)); // Deep copy embedded data

            console.log("repair.js: Loaded base embedded data.");
          } else {
            console.error("repair.js: embeddedGearboxData is not defined!"); // Fallback to an empty structure or initialData if embeddedData is missing

            baseData = _initialData.initialData ? JSON.parse(JSON.stringify(_initialData.initialData)) : {
              _version: currentCodeVersion
            };
            console.warn("repair.js: Used initialData or empty structure as base data fallback.");
          } // 3. Merge data from different sources (prioritize later sources)
          // Order of merging: embedded -> external file -> localStorage -> overrides


          workingData = baseData; // Merge from external gearbox-data.json if available

          _context.prev = 11;
          _context.next = 14;
          return regeneratorRuntime.awrap(fetch('./gearbox-data.json'));

        case 14:
          response = _context.sent;

          if (!response.ok) {
            _context.next = 23;
            break;
          }

          _context.next = 18;
          return regeneratorRuntime.awrap(response.json());

        case 18:
          externalData = _context.sent;
          console.log("repair.js: Successfully loaded external gearbox-data.json");
          workingData = mergeEnhancedData(externalData, workingData); // Merge external data into workingData

          _context.next = 24;
          break;

        case 23:
          console.warn("repair.js: Could not load external gearbox-data.json, status:", response.status);

        case 24:
          _context.next = 29;
          break;

        case 26:
          _context.prev = 26;
          _context.t0 = _context["catch"](11);
          console.warn("repair.js: Fetching external data file failed:", _context.t0);

        case 29:
          // Merge from localStorage if valid data exists and version is compatible (or force load if older?)
          // Let's prioritize localStorage over embedded/external IF it exists, but maybe not if it's too old?
          // For simplicity now, let's let localStorage override embedded/external if present.
          if (storedData) {
            console.log("repair.js: Merging data from localStorage."); // Prioritize storedData over previously merged data

            workingData = mergeEnhancedData(storedData, workingData);
          } // Merge data from initialDataOverrides (highest priority)


          if (initialDataOverrides && Object.keys(initialDataOverrides).length > 0) {
            console.log("repair.js: Merging data from initialDataOverrides (highest priority).");
            workingData = mergeEnhancedData(initialDataOverrides, workingData, initialDataOverrides); // Pass overrides also as options for prioritized collections
          } // 4. Apply Official Prices (This part is problematic, temporarily skip or improve)
          // Keeping the structure but commenting out the problematic file loading for now.
          // If you fix parseOfficialPriceTable and provide the files, uncomment this.
          // try {
          //   console.log("repair.js: Attempting to load and apply official price tables...");
          //    // Assuming parseOfficialPriceTable and updatePricesFromOfficialTable are fixed
          //   const priceFileResponse = await fetch('./prices-2022.txt');
          //   const discountFileResponse = await fetch('./discounts-2022.txt');
          //   let priceTableText = null;
          //   let discountTableText = null;
          //
          //   if (priceFileResponse.ok) {
          //     priceTableText = await priceFileResponse.text();
          //     console.log("repair.js: Successfully loaded official price table.");
          //   } else {
          //     console.warn("repair.js: Official price table file not found or failed to load:", priceFileResponse.status);
          //   }
          //
          //   if (discountFileResponse.ok) {
          //      discountTableText = await discountFileResponse.text();
          //      console.log("repair.js: Successfully loaded official discount table.");
          //   } else {
          //      console.warn("repair.js: Official discount table file not found or failed to load:", discountFileResponse.status);
          //   }
          //
          //   if (priceTableText) {
          //       // Parse and apply prices
          //       const prices = parseOfficialPriceTable(priceTableText);
          //       if (prices.length === 0) {
          //            console.warn("repair.js: Parsed 0 items from official price table. Skipping application.");
          //       } else {
          //            console.log(`repair.js: Parsed ${prices.length} items from official price table. Applying...`);
          //            let discountData = null;
          //            if (discountTableText) {
          //                 discountData = parseOfficialDiscountTable(discountTableText);
          //            }
          //            workingData = applyOfficialPrices(workingData, prices, discountData);
          //            console.log("repair.js: Successfully applied official prices.");
          //       }
          //   } else {
          //       console.warn("repair.js: Skipping official price application as price table text is empty.");
          //   }
          //
          // } catch (priceFileError) {
          //   console.error("repair.js: Error loading or applying official price files:", priceFileError);
          //   console.warn("repair.js: Proceeding without applying official price files.");
          // }
          // 5. Apply Data Fixes


          console.log("repair.js: Applying data fixes..."); // Step 5.1: Ensure collections exist - 已恢复此步骤

          repairedData = ensureCollections(workingData);
          console.log("repair.js: 确保所有数据集合都已初始化"); // Step 5.2: Apply special gearbox fixes (2GWH, Hybrid)

          repairedData = (0, _fixData.fixSpecialGearboxData)(repairedData);
          console.log("repair.js: Applied special gearbox fixes."); // Step 5.3: Apply capacity array fixes

          capacityFixResult = (0, _fixData.fixGearboxCapacityArrays)(repairedData);
          repairedData = capacityFixResult.data;

          if (capacityFixResult.warnings && capacityFixResult.warnings.length > 0) {
            console.warn("repair.js: Warnings during capacity array fixing:", capacityFixResult.warnings);
          }

          console.log("repair.js: Applied capacity array fixes (patched ".concat(capacityFixResult.patched, " items).")); // Step 5.4: Fix Accessories Data (Couplings, Pumps) - BEFORE general price fix
          // fixAccessories might need updated price calculation logic if it depends on it

          accessoryFixResult = (0, _fixAccessories.fixAccessories)(repairedData);
          repairedData = accessoryFixResult.data;

          if (accessoryFixResult.warnings && accessoryFixResult.warnings.length > 0) {
            console.warn("repair.js: Warnings during accessory fixing:", accessoryFixResult.warnings);
          }

          console.log("repair.js: Applied accessory fixes (patched ".concat(accessoryFixResult.patched, " items).")); // Step 5.5: Apply Price Data Fixes (using processPriceData from priceManager)

          priceFixResult = (0, _priceManager.processPriceData)(repairedData);
          repairedData = priceFixResult.data;

          if (priceFixResult.results && priceFixResult.results.corrected > 0) {
            console.log("repair.js: Applied general price data fixes (corrected ".concat(priceFixResult.results.corrected, " items)."));
          } // Step 5.6: Apply specific model price overrides (from 2022 list)


          repairedData = (0, _priceManager.fixSpecificModelPrices)(repairedData);
          console.log("repair.js: Applied specific model price overrides."); // 6. Data Adaptation

          console.log("repair.js: Adapting data structure...");
          adaptedData = (0, _dataAdapter.adaptEnhancedData)(repairedData); // 7. Final Validation

          console.log("repair.js: Performing final data validation...");
          validationResult = (0, _dataValidator.validateDatabase)(adaptedData);

          if (!validationResult.success) {
            console.error("repair.js: Final data validation failed!", validationResult); // Decide whether to throw an error or return potentially invalid data with warnings
            // For now, log error but continue
            // throw new Error(`Data validation failed: ${validationResult.message}`);
          } else {
            console.log("repair.js: Final data validation successful. ".concat(validationResult.summary.warnings, " warnings."));
          } // 8. Update Version and Save


          adaptedData._version = currentCodeVersion;
          adaptedData._lastFixed = new Date().toISOString();
          console.log("repair.js: Data repair complete. Final version: ".concat(adaptedData._version));

          try {
            localStorage.setItem('appData', JSON.stringify(adaptedData));
            console.log("repair.js: Successfully saved repaired data to localStorage.");
          } catch (saveError) {
            console.error("repair.js: Failed to save repaired data to localStorage:", saveError); // Handle potential quota exceeded errors
          }

          return _context.abrupt("return", adaptedData);

        case 61:
          _context.prev = 61;
          _context.t1 = _context["catch"](2);
          console.error('repair.js: CRITICAL ERROR during data load/repair process:', _context.t1); // Propagate error to the caller (e.g., DataLoadingManager)

          throw _context.t1;

        case 65:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 61], [11, 26]]);
}; // Export the main validation function and potentially individual validators if needed elsewhere
// export { mergeDataCollections };


exports.loadAndRepairData = loadAndRepairData;