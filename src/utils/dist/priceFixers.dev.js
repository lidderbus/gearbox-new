"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.fixHCMItemPrice = exports.fixHCMSeriesPrices = exports.fixFixedPriceItem = exports.fixFixedPriceSeries = void 0;

var _dataHelpers = require("./dataHelpers");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

/**
 * 标准市场价倍数（默认10%加价）
 */
var MARKET_PRICE_MULTIPLIER = 1.1;
/**
 * 修复全国统一售价系列产品的价格数据
 * 包括HCM、HCQ、HCX、HCA、HCV、MV系列产品采用全国统一售价，无折扣
 * 
 * @param {Object} data - 包含各产品系列的数据对象
 * @returns {Object} 修复后的数据对象
 */

var fixFixedPriceSeries = function fixFixedPriceSeries(data) {
  if (!data || _typeof(data) !== 'object') return data;

  var result = _objectSpread({}, data); // 需要修复的系列及其对应集合


  var seriesToFix = [{
    prefix: 'HCM',
    collection: 'hcmGearboxes'
  }, {
    prefix: 'HCQ',
    collection: 'hcqGearboxes'
  }, {
    prefix: 'HCX',
    collection: 'hcxGearboxes'
  }, {
    prefix: 'HCA',
    collection: 'hcaGearboxes'
  }, {
    prefix: 'HCV',
    collection: 'hcvGearboxes'
  }, {
    prefix: 'MV',
    collection: 'mvGearboxes'
  }]; // 修复各系列齿轮箱

  seriesToFix.forEach(function (series) {
    if (Array.isArray(result[series.collection])) {
      result[series.collection] = result[series.collection].map(function (item) {
        if (item.model && item.model.startsWith(series.prefix)) {
          return fixFixedPriceItem(item);
        }

        return item;
      });
    }
  }); // 如果有其他集合可能包含这些系列的产品，也应该处理它们

  var collectionsToCheck = ['gcGearboxes', 'hcGearboxes', 'defaultGearboxes', 'otherGearboxes'];
  collectionsToCheck.forEach(function (collection) {
    if (Array.isArray(result[collection])) {
      result[collection] = result[collection].map(function (item) {
        if (item.model) {
          // 检查该项目是否属于需要修复的系列
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = seriesToFix[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var series = _step.value;

              if (item.model.startsWith(series.prefix)) {
                return fixFixedPriceItem(item);
              }
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                _iterator["return"]();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }
        }

        return item;
      });
    }
  });
  return result;
};
/**
 * 修复单个全国统一售价产品项的价格
 * 
 * @param {Object} item - 需要修复的产品项
 * @returns {Object} 修复后的产品项
 */


exports.fixFixedPriceSeries = fixFixedPriceSeries;

var fixFixedPriceItem = function fixFixedPriceItem(item) {
  if (!item || _typeof(item) !== 'object' || !item.model) {
    return item;
  }

  var result = _objectSpread({}, item); // 确保基础价格有效


  result.basePrice = (0, _dataHelpers.safeParseFloat)(result.basePrice) || (0, _dataHelpers.safeParseFloat)(result.price) || 0;
  result.price = result.basePrice; // 保持一致
  // 全国统一售价，折扣率为0

  result.discountRate = 0; // 工厂价等于基础价

  result.factoryPrice = result.basePrice; // 市场价等于基础价（全国统一售价）

  result.marketPrice = result.basePrice; // 打包价等于基础价

  result.packagePrice = result.basePrice; // 添加注释，表明这是全国统一售价

  if (!result.notes) {
    result.notes = "全国统一售价";
  } else if (!result.notes.includes("全国统一售价")) {
    result.notes += ", 全国统一售价";
  }

  return result;
}; // 为向后兼容保留HCM系列特定修复函数


exports.fixFixedPriceItem = fixFixedPriceItem;
var fixHCMSeriesPrices = fixFixedPriceSeries;
exports.fixHCMSeriesPrices = fixHCMSeriesPrices;
var fixHCMItemPrice = fixFixedPriceItem;
exports.fixHCMItemPrice = fixHCMItemPrice;
var _default = fixFixedPriceSeries;
exports["default"] = _default;