"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.correctDatabase = exports.correctPumpPrices = exports.correctCouplingPrices = exports.correctGearboxPrices = void 0;

var _priceDiscount = require("./priceDiscount");

var _priceManager = require("./priceManager");

var _fixData = require("./fixData");

// src/utils/dataCorrector.js
// 数据修正工具

/**
 * 修正单个齿轮箱的价格数据 (重命名并使用 correctPriceData)
 * @param {Object} gearbox 齿轮箱对象
 * @returns {Object} 修正后的齿轮箱对象
 */
var correctGearboxPrices = function correctGearboxPrices(gearbox) {
  var correctedData = (0, _priceManager.correctPriceData)(gearbox);
  return correctedData;
};
/**
 * 修正单个联轴器的价格数据 (重命名并使用 correctPriceData)
 * @param {Object} coupling 联轴器对象
 * @returns {Object} 修正后的联轴器对象
 */


exports.correctGearboxPrices = correctGearboxPrices;

var correctCouplingPrices = function correctCouplingPrices(coupling) {
  var correctedData = (0, _priceManager.correctPriceData)(coupling);
  return correctedData;
};
/**
 * 修正单个泵的价格数据 (重命名并使用 correctPriceData)
 * @param {Object} pump 泵对象
 * @returns {Object} 修正后的泵对象
 */


exports.correctCouplingPrices = correctCouplingPrices;

var correctPumpPrices = function correctPumpPrices(pump) {
  var correctedData = (0, _priceManager.correctPriceData)(pump);
  return correctedData;
};
/**
 * 修正整个数据库 (应用所有可用的修复步骤)
 * @param {Object} data 数据库对象
 * @returns {Object} 修正结果，包含修正后的数据和统计信息
 */


exports.correctPumpPrices = correctPumpPrices;

var correctDatabase = function correctDatabase(data) {
  var workingData = (0, _fixData.fixSpecialGearboxData)(data);
  var capacityFixResult = (0, _fixData.fixGearboxCapacityArrays)(workingData);
  workingData = capacityFixResult.data;
  var priceFixResult = (0, _priceManager.processPriceData)(workingData);
  workingData = priceFixResult.data;
  return {
    data: workingData,
    results: priceFixResult.results
  };
};

exports.correctDatabase = correctDatabase;