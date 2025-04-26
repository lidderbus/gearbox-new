"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.adaptBasicData = adaptBasicData;
exports.adaptEnhancedData = adaptEnhancedData;

var _dataHelpers = require("./dataHelpers");

var _priceManager = require("./priceManager");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function adaptBasicData(rawData) {
  if (!rawData) return createEmptyData();

  var adapted = _objectSpread({}, rawData); // 处理齿轮箱集合


  var gearboxCollections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes'];
  gearboxCollections.forEach(function (key) {
    if (Array.isArray(adapted[key])) {
      adapted[key] = adapted[key].map(adaptGearboxItem).filter(Boolean);
    } else {
      adapted[key] = [];
    }
  }); // 处理配件

  if (Array.isArray(adapted.flexibleCouplings)) {
    adapted.flexibleCouplings = adapted.flexibleCouplings.map(adaptCouplingItem).filter(Boolean);
  } else {
    adapted.flexibleCouplings = [];
  }

  if (Array.isArray(adapted.standbyPumps)) {
    adapted.standbyPumps = adapted.standbyPumps.map(adaptPumpItem).filter(Boolean);
  } else {
    adapted.standbyPumps = [];
  }

  return adapted;
}

function adaptGearboxItem(item) {
  if (!item || !item.model) return null;

  var adapted = _objectSpread({}, item); // 确保基础字段存在


  adapted.model = String(adapted.model).trim();
  adapted.inputSpeedRange = ensureValidSpeedRange(adapted.inputSpeedRange);
  adapted.ratios = ensureValidRatios(adapted.ratios);
  adapted.transferCapacity = ensureMatchingCapacityArray(adapted.transferCapacity, adapted.ratios); // 确保其他技术参数

  adapted.thrust = (0, _dataHelpers.safeParseFloat)(adapted.thrust) || 0;
  adapted.centerDistance = (0, _dataHelpers.safeParseFloat)(adapted.centerDistance) || 0;
  adapted.weight = (0, _dataHelpers.safeParseFloat)(adapted.weight) || 0;
  adapted.efficiency = (0, _dataHelpers.safeParseFloat)(adapted.efficiency) || 0.97;
  adapted.controlType = adapted.controlType || "推拉软轴"; // 确保价格字段

  adaptPriceFields(adapted);
  return adapted;
}

function adaptCouplingItem(item) {
  if (!item || !item.model) return null;

  var adapted = _objectSpread({}, item); // 确保基础字段


  adapted.model = String(adapted.model).trim(); // 处理扭矩字段（统一为kN·m）

  adapted.torque = convertTorqueToKNm(adapted);
  adapted.maxTorque = (0, _dataHelpers.safeParseFloat)(adapted.maxTorque) || adapted.torque * 2.5;
  adapted.maxSpeed = (0, _dataHelpers.safeParseFloat)(adapted.maxSpeed) || 3000;
  adapted.weight = (0, _dataHelpers.safeParseFloat)(adapted.weight) || 50; // 确保价格字段

  adaptPriceFields(adapted);
  return adapted;
}

function adaptPumpItem(item) {
  if (!item || !item.model) return null;

  var adapted = _objectSpread({}, item); // 确保基础字段


  adapted.model = String(adapted.model).trim();
  adapted.flow = (0, _dataHelpers.safeParseFloat)(adapted.flow) || 10.0;
  adapted.pressure = (0, _dataHelpers.safeParseFloat)(adapted.pressure) || 2.5;
  adapted.motorPower = (0, _dataHelpers.safeParseFloat)(adapted.motorPower) || 2.0;
  adapted.weight = (0, _dataHelpers.safeParseFloat)(adapted.weight) || 30; // 确保价格字段

  adaptPriceFields(adapted);
  return adapted;
}

function ensureValidSpeedRange(range) {
  if (Array.isArray(range) && range.length === 2) {
    return [(0, _dataHelpers.safeParseFloat)(range[0]) || 1000, (0, _dataHelpers.safeParseFloat)(range[1]) || 2500];
  }

  return [1000, 2500]; // 默认转速范围
}

function ensureValidRatios(ratios) {
  if (Array.isArray(ratios)) {
    return ratios.map(function (r) {
      return (0, _dataHelpers.safeParseFloat)(r);
    }).filter(function (r) {
      return r > 0;
    });
  }

  return [];
}

function ensureMatchingCapacityArray(capacity, ratios) {
  if (!Array.isArray(ratios) || ratios.length === 0) {
    return [];
  }

  if (!Array.isArray(capacity) || capacity.length === 0) {
    // 如果没有传递能力数据，填充默认值
    return new Array(ratios.length).fill(0.1);
  } // 确保长度匹配


  if (capacity.length === ratios.length) {
    return capacity.map(function (c) {
      return (0, _dataHelpers.safeParseFloat)(c) || 0.1;
    });
  } // 调整长度


  var result = [];

  for (var i = 0; i < ratios.length; i++) {
    result.push((0, _dataHelpers.safeParseFloat)(capacity[i % capacity.length]) || 0.1);
  }

  return result;
}

function convertTorqueToKNm(item) {
  var torque = (0, _dataHelpers.safeParseFloat)(item.torque);

  if (torque && item.torqueUnit) {
    var unit = item.torqueUnit.toLowerCase();

    if (unit.includes('nm') || unit.includes('n·m')) {
      torque = torque / 1000; // 转换为kN·m
    }
  } else if (torque > 1000) {
    // 大于1000可能是N·m，转换
    torque = torque / 1000;
  }

  return torque || 5.0; // 默认值
}

function adaptPriceFields(item) {
  item.basePrice = (0, _dataHelpers.safeParseFloat)(item.basePrice || item.price) || 10000;
  item.price = item.basePrice;
  item.discountRate = (0, _dataHelpers.safeParseFloat)(item.discountRate) || (0, _priceManager.getStandardDiscountRate)(item.model); // 如果折扣率是百分比格式，转换为小数

  if (item.discountRate > 1) {
    item.discountRate = item.discountRate / 100;
  }

  item.factoryPrice = (0, _priceManager.calculateFactoryPrice)(item);
  item.marketPrice = (0, _priceManager.calculateMarketPrice)(item, item.factoryPrice);
  item.packagePrice = item.factoryPrice;
}

function createEmptyData() {
  return {
    hcGearboxes: [],
    gwGearboxes: [],
    hcmGearboxes: [],
    dtGearboxes: [],
    hcqGearboxes: [],
    gcGearboxes: [],
    hcxGearboxes: [],
    hcaGearboxes: [],
    hcvGearboxes: [],
    mvGearboxes: [],
    otherGearboxes: [],
    flexibleCouplings: [],
    standbyPumps: [],
    _error: null
  };
} // 添加缺失的adaptEnhancedData函数


function adaptEnhancedData(rawData) {
  console.log("adaptEnhancedData: 开始数据适配...");

  if (!rawData) {
    console.warn("adaptEnhancedData: 输入数据为空，返回空集合");
    return createEmptyData();
  }

  console.log("adaptEnhancedData: 输入数据内容:", Object.keys(rawData).map(function (key) {
    return {
      key: key,
      type: _typeof(rawData[key]),
      isArray: Array.isArray(rawData[key]),
      length: Array.isArray(rawData[key]) ? rawData[key].length : 'not array'
    };
  })); // 确保所有集合存在

  var data = _objectSpread({}, rawData); // 处理齿轮箱集合


  var gearboxCollections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes'];
  console.log("adaptEnhancedData: 开始处理齿轮箱数据...");
  gearboxCollections.forEach(function (key) {
    console.log("adaptEnhancedData: \u5904\u7406 ".concat(key, "..."));
    var originalLength = Array.isArray(data[key]) ? data[key].length : 0;

    if (Array.isArray(data[key])) {
      data[key] = data[key].map(adaptGearboxItem).filter(Boolean);
    } else {
      data[key] = [];
    }

    console.log("adaptEnhancedData: ".concat(key, " \u5904\u7406\u5B8C\u6210\uFF0C\u539F\u59CB\u957F\u5EA6: ").concat(originalLength, ", \u5904\u7406\u540E\u957F\u5EA6: ").concat(data[key].length));
  });
  console.log("adaptEnhancedData: 开始处理联轴器数据...");
  var originalCouplingLength = Array.isArray(data.flexibleCouplings) ? data.flexibleCouplings.length : 0;

  if (Array.isArray(data.flexibleCouplings)) {
    data.flexibleCouplings = data.flexibleCouplings.map(adaptCouplingItem).filter(Boolean);
  } else {
    data.flexibleCouplings = [];
  }

  console.log("adaptEnhancedData: \u8054\u8F74\u5668\u5904\u7406\u5B8C\u6210\uFF0C\u539F\u59CB\u957F\u5EA6: ".concat(originalCouplingLength, ", \u5904\u7406\u540E\u957F\u5EA6: ").concat(data.flexibleCouplings.length));
  console.log("adaptEnhancedData: 开始处理备用泵数据...");
  var originalPumpLength = Array.isArray(data.standbyPumps) ? data.standbyPumps.length : 0;

  if (Array.isArray(data.standbyPumps)) {
    data.standbyPumps = data.standbyPumps.map(adaptPumpItem).filter(Boolean);
  } else {
    data.standbyPumps = [];
  }

  console.log("adaptEnhancedData: \u5907\u7528\u6CF5\u5904\u7406\u5B8C\u6210\uFF0C\u539F\u59CB\u957F\u5EA6: ".concat(originalPumpLength, ", \u5904\u7406\u540E\u957F\u5EA6: ").concat(data.standbyPumps.length));
  console.log("adaptEnhancedData: 数据适配完成。");
  return data;
}