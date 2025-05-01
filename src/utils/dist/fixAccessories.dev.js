"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fixAccessories = fixAccessories;
exports["default"] = void 0;

var _config = require("../config");

var _capacityEstimator = require("./capacityEstimator");

/**
 * 高弹联轴器 & 备用泵 补齐工具
 * 所有魔数统一来自 config.DEFAULTS
 */
// 可能包含齿轮箱数组的关键字段
var COLLECTION_KEYS = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'otherGearboxes'];
/**
 * 判断条目是否为高弹型号
 * 规则：存在 _isElastic / isElastic 标记 或 model 以 'E' 结尾
 */

function isElastic(item) {
  if (!item) return false;
  if (item._isElastic || item.isElastic) return true;
  if (typeof item.model === 'string' && item.model.trim().toUpperCase().endsWith('E')) return true;
  return false;
}
/**
 * 判断条目是否带备用泵
 * 规则：hasSparePump === true 或 model 包含 'P'（示例简化）
 */


function hasSparePump(item) {
  if (!item) return false;
  if (item.hasSparePump || item._hasSparePump) return true;
  if (typeof item.model === 'string' && item.model.toUpperCase().includes('P')) return true;
  return false;
}
/**
 * 补齐高弹联轴器相关字段
 */


function fixElasticCouplingData(data) {
  if (!data) return {
    data: data,
    patched: 0
  };
  var patched = 0;
  COLLECTION_KEYS.forEach(function (key) {
    var arr = data[key];

    if (Array.isArray(arr)) {
      arr.forEach(function (item) {
        if (!item) return;
        if (!isElastic(item)) return; // 标记

        if (!item._isElastic) item._isElastic = true; // 价格补齐：高弹价格独立字段或加价？此处直接加价系数

        if (item.price && !item.elasticPrice) {
          item.elasticPrice = Math.round(item.price * _config.DEFAULTS.highElastic.priceFactor);
          patched++;
        }
      });
    }
  });
  return {
    data: data,
    patched: patched
  };
}
/**
 * 补齐备用泵相关字段
 */


function fixSparePumpData(data) {
  if (!data) return {
    data: data,
    patched: 0
  };
  var patched = 0;
  COLLECTION_KEYS.forEach(function (key) {
    var arr = data[key];

    if (Array.isArray(arr)) {
      arr.forEach(function (item) {
        if (!item) return;
        if (!hasSparePump(item)) return; // 标记

        if (!item.hasSparePump) item.hasSparePump = true; // 价格

        if (!item.sparePumpPrice) {
          item.sparePumpPrice = _config.DEFAULTS.sparePump.price;
          patched++;
        } // 传递能力


        if (!item.sparePumpTransferCapacity) {
          item.sparePumpTransferCapacity = _config.DEFAULTS.sparePump.transferCapacity;
          patched++;
        }
      });
    }
  });
  return {
    data: data,
    patched: patched
  };
}
/**
 * 补齐齿轮箱 transferCapacity 与 ratios 长度不匹配，利用 estimator
 */


function fixTransferCapacity(data) {
  if (!data) return {
    data: data,
    patched: 0
  };
  var patched = 0;
  COLLECTION_KEYS.forEach(function (key) {
    var arr = data[key];

    if (Array.isArray(arr)) {
      arr.forEach(function (item) {
        if (!item) return;

        if (Array.isArray(item.ratios) && item.ratios.length > 0) {
          if (!Array.isArray(item.transferCapacity) || item.transferCapacity.length !== item.ratios.length) {
            var tcArr = (0, _capacityEstimator.estimateTransferCapacityArray)(item, item.ratios);

            if (tcArr) {
              item.transferCapacity = tcArr;
              patched++;
            }
          }
        }
      });
    }
  });
  return {
    data: data,
    patched: patched
  };
}
/**
 * 修正联轴器扭矩单位 (HGT/HGTHB/HTHB 系列小于1 kN·m 乘1000)
 */


function fixCouplingTorqueAndSpeed(data) {
  if (!data || !Array.isArray(data.flexibleCouplings)) return {
    data: data,
    patched: 0
  };
  var patched = 0;

  var extractTorqueFromModel = function extractTorqueFromModel(modelStr) {
    // 提取模型中的数字作为 kN·m，例如 HGTHT4 -> 4, HGT2520 -> 25
    var match = modelStr.match(/HGT[HTJB]*([0-9]+(?:\.[0-9]+)?)/i);

    if (match && match[1]) {
      var val = parseFloat(match[1]);
      if (!isNaN(val) && val > 0) return val;
    }

    return undefined;
  };

  data.flexibleCouplings.forEach(function (c) {
    if (!c || !c.model) return;
    var model = c.model.toUpperCase(); // -------- Fix torque --------

    if (c.torque === undefined || c.torque === null || isNaN(c.torque)) c.torque = 0;

    if (typeof c.torque === 'number') {
      if (c.torque === 0) {
        // 尝试从型号中提取扭矩
        var inferred = extractTorqueFromModel(model);

        if (inferred !== undefined) {
          c.torque = inferred;
          patched++;
        }
      } else if (c.torque > 500) {
        // 可能是 N·m，需要除以1000
        c.torque = Math.round(c.torque / 1000 * 1000) / 1000;
        patched++;
      } else if (c.torque < 0.1) {
        // 可能是单位错误，需要乘1000
        c.torque = Math.round(c.torque * 1000 * 1000) / 1000;
        patched++;
      }
    } // -------- Fix maxSpeed --------


    if (c.maxSpeed === undefined || c.maxSpeed === null || isNaN(c.maxSpeed) || c.maxSpeed <= 0) {
      c.maxSpeed = 3000; // 默认值

      patched++;
    }
  });
  return {
    data: data,
    patched: patched
  };
}
/**
 * 主函数：执行所有附件补齐
 */


function fixAccessories(data) {
  var workingData = data ? JSON.parse(JSON.stringify(data)) : {};
  var totalPatched = 0;

  var _fixElasticCouplingDa = fixElasticCouplingData(workingData),
      p1 = _fixElasticCouplingDa.patched;

  var _fixSparePumpData = fixSparePumpData(workingData),
      p2 = _fixSparePumpData.patched;

  var _fixTransferCapacity = fixTransferCapacity(workingData),
      p3 = _fixTransferCapacity.patched;

  var _fixCouplingTorqueAnd = fixCouplingTorqueAndSpeed(workingData),
      p4 = _fixCouplingTorqueAnd.patched;

  totalPatched = p1 + p2 + p3 + p4;
  return {
    data: workingData,
    summary: {
      elasticPatched: p1,
      sparePumpPatched: p2,
      capacityPatched: p3,
      torquePatched: p4,
      totalPatched: totalPatched
    }
  };
}

var _default = fixAccessories;
exports["default"] = _default;