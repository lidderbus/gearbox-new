"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applyPriceUpdates = applyPriceUpdates;
exports["default"] = exports.embeddedGearboxData = void 0;
// src/data/embeddedData.js
// 嵌入式基础数据，不含配件
// 配件在repair.js过程中单独加载
// 嵌入式基线齿轮箱数据，不含配件
var embeddedGearboxData = {
  _version: 2,
  // 版本号，每次更新递增
  _lastFixed: new Date().toISOString(),
  // 齿轮箱数据集合（这里使用简化版，实际应用中应保留原始数据）
  hcGearboxes: [{
    "model": "40A",
    "inputSpeedRange": [750, 2000],
    "ratios": [2.07, 2.96, 3.44, 3.83],
    "transferCapacity": [0.0294, 0.0294, 0.0235, 0.02],
    "thrust": 8.8,
    "centerDistance": 142,
    "weight": 225,
    "controlType": "推拉软轴",
    "dimensions": "490x670x620",
    "efficiency": 0.97,
    "basePrice": 8560,
    "price": 8560,
    "discountRate": 0.16,
    "factoryPrice": 7190.4,
    "packagePrice": 7190.4,
    "marketPrice": 8170.91,
    "notes": "手控、带罩、齿形块、A1型监控"
  }],
  gwGearboxes: [],
  hcmGearboxes: [],
  dtGearboxes: [],
  hcqGearboxes: [],
  gcGearboxes: [],
  hcxGearboxes: [],
  mvGearboxes: [],
  hcaGearboxes: [],
  hcvGearboxes: [],
  // 空的配件集合（配件将在repair.js中单独加载）
  flexibleCouplings: [],
  standbyPumps: []
};
/**
 * 应用价格更新函数
 * @param {Object} data 需要更新价格的数据对象
 * @param {Array} priceList 价格列表
 * @returns {Object} 更新后的数据对象
 */

exports.embeddedGearboxData = embeddedGearboxData;

function applyPriceUpdates(data) {
  var priceList = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  if (!data || !Array.isArray(priceList)) {
    return data;
  } // 创建数据的深拷贝


  var updatedData = JSON.parse(JSON.stringify(data)); // 简化的价格更新逻辑

  console.log("\u5E94\u7528\u4EF7\u683C\u66F4\u65B0: ".concat(priceList.length, "\u9879"));
  return updatedData;
} // 默认导出


var _default = embeddedGearboxData;
exports["default"] = _default;