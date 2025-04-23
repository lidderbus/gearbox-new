"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCouplingSpecifications = exports.getRecommendedPump = exports.getTemperatureFactor = exports.getRecommendedCouplingInfo = exports.couplingWorkFactorMap = exports.couplingWithCoverMap = void 0;
// src/data/gearboxMatchingMaps.js

/**
 * 齿轮箱与联轴器匹配映射表，基于最新数据更新
 * key: 齿轮箱型号前缀
 * value: 推荐的联轴器型号前缀
 */
var gearboxToCouplingPrefixMap = {
  // 300系列
  'HC300': 'HGTHT4',
  '300': 'HGTHT4',
  'D300A': 'HGTHT4',
  'J300': 'HGTHT4',
  'HCD300': 'HGTHT4',
  'HCT300': 'HGTHT4',
  'T300': 'HGTHT4',
  // 400系列
  'HC400': 'HGTHT4.5',
  'HCD400': 'HGTHT4.5',
  'HCT400': 'HGTHT5',
  'HCT400A': 'HGTHT5',
  // 600系列
  'HC600': 'HGTHT6.3A',
  'HCD600': 'HGTHT6.3A',
  'HCT600': 'HGTHT6.3A',
  // 800系列
  'HCD800': 'HGTHT8.6',
  'HCT800': 'HGTHT8.6',
  // 1000系列
  'HC1000': 'HGTHB5',
  'HCD1000': 'HGTHB5',
  // 1100-1200系列
  'HC1200': 'HGHQT1210IW',
  'HC1200/1': 'HGTHB6.3A',
  'HCT1200': 'HGHQT1210IW',
  'HCT1200/1': 'HGTHB6.3A',
  // 1400系列
  'HC1400': 'HGTHB8',
  'HCD1400': 'HGTHB8',
  'HCT1400': 'HGTHB8',
  // 1600系列
  'HC1600': 'HGTHB10',
  'HCD1600': 'HGTHB10',
  'HCT1600': 'HGTHB10',
  // 2000系列
  'HC2000': 'HGTHB12.5',
  'HCD2000': 'HGTHB12.5',
  'HCT2000': 'HGTHB12.5',
  // 2700系列
  'HC2700': 'HGTHB16',
  'HCD2700': 'HGTHB16',
  'HCT2700': 'HGT3020',
  // 其他系列保持原有映射
  'GWC28': 'HGT',
  'GWC30': 'HGT',
  'GWC36': 'HGT',
  'GWC45': 'HGT',
  'GWC52': 'HGT',
  'GWC60': 'HGT',
  'GWC70': 'HGT',
  'HCM70': 'HGTHB',
  'HCM160': 'HGTHB',
  'HCM250': 'HGTHB',
  'HCM435': 'HGTHB',
  'HCM600': 'HGT',
  'HCM1250': 'HGT',
  'HCM1600': 'HGT',
  'DT180': 'HGTHB',
  'DT240': 'HGTHB',
  'DT580': 'HGTHB',
  'DT770': 'HGT',
  'DT900': 'HGT',
  'DT1400': 'HGT',
  'DT1500': 'HGT',
  'default': 'HGT'
};
/**
 * 齿轮箱与特定联轴器型号匹配表，基于最新数据更新
 * key: 齿轮箱完整型号
 * value: 推荐的联轴器完整型号
 */

var gearboxToCouplingSpecificMap = {
  // 300系列
  'HC300': 'HGTHT4',
  '300': 'HGTHT4',
  'D300A': 'HGTHT4',
  'J300': 'HGTHT4',
  'HCD300': 'HGTHT4',
  'HCT300': 'HGTHT4',
  'T300': 'HGTHT4',
  // 400系列
  'HC400': 'HGTHT4.5',
  'HCD400': 'HGTHT4.5',
  'HCT400': 'HGTHT5',
  'HCT400A': 'HGTHT5',
  // 600系列
  'HC600A': 'HGTHT6.3A',
  'HCD600A': 'HGTHT6.3A',
  'HCT600A': 'HGTHT6.3A',
  // 800系列
  'HCD800': 'HGTHT8.6',
  'HCT800': 'HGTHT8.6',
  'HCT800/1': 'HGTHT8.6',
  'HCT800/2': 'HGTHT8.6',
  'HCT800/3': 'HGTHT8.6',
  // 1000系列
  'HC1000': 'HGTHB5',
  'HCD1000': 'HGTHB5',
  // 1100-1200系列
  'HC1200': 'HGHQT1210IW',
  'HC1200/1': 'HGTHB6.3A',
  'HCT1200': 'HGHQT1210IW',
  'HCT1200/1': 'HGTHB6.3A',
  // 1400系列
  'HC1400': 'HGTHB8',
  'HCD1400': 'HGTHB8',
  'HCT1400': 'HGTHB8',
  // 1600系列
  'HC1600': 'HGTHB10',
  'HCD1600': 'HGTHB10',
  'HCT1600': 'HGTHB10',
  // 2000系列
  'HC2000': 'HGTHB12.5',
  'HCD2000': 'HGTHB12.5',
  'HCT2000': 'HGTHB12.5',
  // 2700系列
  'HC2700': 'HGTHB16',
  'HCD2700': 'HGTHB16',
  'T2700': 'HGT3020',
  // 其他匹配保持不变
  'GWC28.30': 'HGT2520',
  'GWC30.32': 'HGT3020',
  'GWC36.39': 'HGT4020',
  'GWC45.49': 'HGT6320',
  'GWC52.59': 'HGT8020',
  'GWC60.66': 'HGT10020',
  'GWC70.76': 'HGT16020',
  'HCM70': 'HGTHB3.2',
  'HCM160': 'HGTHB3.2',
  'HCM250': 'HGTHB5',
  'HCM435': 'HGTHB6.3',
  'HCM600': 'HGT1020',
  'HCM1250': 'HGT1620',
  'HCM1600': 'HGT2020',
  'DT180': 'HGTHB3.2',
  'DT240': 'HGTHB5',
  'DT580': 'HGTHB6.3',
  'DT770': 'HGT1020',
  'DT900': 'HGT1220',
  'DT1400': 'HGT1620',
  'DT1500': 'HGT2020'
};
/**
 * 联轴器带罩壳型号映射表
 * key: 标准联轴器型号
 * value: 带罩壳对应的联轴器型号
 */

var couplingWithCoverMap = {
  'HGTHB5': 'HGTHJB5',
  'HGTHB6.3A': 'HGTHJB6.3A'
};
/**
 * 高弹联轴器技术参数表，根据供应商最新数据
 */

exports.couplingWithCoverMap = couplingWithCoverMap;
var couplingSpecificationsMap = {
  'HGTHT4': {
    ratedTorque: 4.0,
    maxTorque: 10.0,
    maxSpeed: 2400
  },
  'HGTHT4.5': {
    ratedTorque: 4.5,
    maxTorque: 12.0,
    maxSpeed: 2400
  },
  'HGTHT5': {
    ratedTorque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 2400
  },
  'HGTHT6.3A': {
    ratedTorque: 6.3,
    maxTorque: 18.0,
    maxSpeed: 2400
  },
  'HGTHT8.6': {
    ratedTorque: 8.6,
    maxTorque: 21.5,
    maxSpeed: 2000
  },
  'HGTHB5': {
    ratedTorque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 3000
  },
  'HGHQT1210IW': {
    ratedTorque: 12.0,
    maxTorque: 30.0,
    maxSpeed: 1800
  },
  'HGTHB6.3A': {
    ratedTorque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 3000
  },
  'HGTHB8': {
    ratedTorque: 8.0,
    maxTorque: 20.0,
    maxSpeed: 2800
  },
  'HGTHB10': {
    ratedTorque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 2500
  },
  'HGTHB12.5': {
    ratedTorque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 2200
  },
  'HGTHB16': {
    ratedTorque: 16.0,
    maxTorque: 40.0,
    maxSpeed: 2000
  },
  'HGT3020': {
    ratedTorque: 31.5,
    maxTorque: 78.75,
    maxSpeed: 1800
  },
  'HGTHJB5': {
    ratedTorque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 3000
  },
  'HGTHJB6.3A': {
    ratedTorque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 3000
  }
};
/**
 * 齿轮箱与备用泵型号匹配表
 * key: 齿轮箱型号
 * value: 推荐的备用泵型号
 */

var gearboxToPumpMap = {
  'HC300': '2CY7.5/2.5D',
  '300': '2CY7.5/2.5D',
  'D300A': '2CY7.5/2.5D',
  'J300': '2CY7.5/2.5D',
  'HCD300': '2CY7.5/2.5D',
  'HCT300': '2CY7.5/2.5D',
  'T300': '2CY7.5/2.5D',
  'HC400': '2CY7.5/2.5D',
  'HCD400': '2CY7.5/2.5D',
  'HCT400': '2CY7.5/2.5D',
  'HCT400A': '2CY7.5/2.5D',
  'HC600A': '2CY14.2/2.5D',
  'HCD600A': '2CY14.2/2.5D',
  'HCT600A': '2CY14.2/2.5D',
  'HCD800': '2CY14.2/2.5D',
  'HCT800': '2CY14.2/2.5D',
  'HCT800/1': '2CY14.2/2.5D',
  'HCT800/2': '2CY14.2/2.5D',
  'HCT800/3': '2CY14.2/2.5D',
  'HC1000': '2CY14.2/2.5D',
  'HCD1000': '2CY14.2/2.5D',
  'HC1200': '2CY19.2/2.5D',
  'HC1200/1': '2CY19.2/2.5D',
  'HCT1200': '2CY19.2/2.5D',
  'HCT1200/1': '2CY19.2/2.5D',
  'HC1400': '2CY19.2/2.5D',
  'HCD1400': '2CY19.2/2.5D',
  'HCT1400': '2CY19.2/2.5D',
  'HC1600': '2CY19.2/2.5D',
  'HCD1600': '2CY19.2/2.5D',
  'HCT1600': '2CY19.2/2.5D',
  'HC2000': '2CY24.8/2.5D',
  'HCD2000': '2CY24.8/2.5D',
  'HCT2000': '2CY24.8/2.5D',
  'HC2700': '2CY34.5/2.5D',
  'HCD2700': '2CY34.5/2.5D',
  'T2700': '2CY34.5/2.5D',
  // 其余保持原有映射
  'GWC28.30': '2CY14.2/2.5D',
  'GWC30.32': '2CY19.2/2.5D',
  'GWC36.39': '2CY19.2/2.5D',
  'GWC45.49': '2CY24.8/2.5D',
  'GWC52.59': '2CY34.5/2.5D',
  'GWC60.66': '2CY34.5/2.5D',
  'GWC70.76': '2CY48.2/2.5D',
  'HCM70': '2CY7.5/2.5D',
  'HCM160': '2CY7.5/2.5D',
  'HCM250': '2CY7.5/2.5D',
  'HCM435': '2CY14.2/2.5D',
  'HCM600': '2CY14.2/2.5D',
  'HCM1250': '2CY19.2/2.5D',
  'HCM1600': '2CY24.8/2.5D',
  'DT180': '2CY7.5/2.5D',
  'DT240': '2CY7.5/2.5D',
  'DT580': '2CY14.2/2.5D',
  'DT770': '2CY14.2/2.5D',
  'DT900': '2CY19.2/2.5D',
  'DT1400': '2CY24.8/2.5D',
  'DT1500': '2CY24.8/2.5D'
};
/**
 * 联轴器工作条件系数映射表
 * 不同工作条件下的联轴器选型系数
 */

var couplingWorkFactorMap = {
  'I类:扭矩变化很小': 1.2,
  'II类:扭矩变化小': 1.5,
  'III类:扭矩变化中等': 1.8,
  'IV类:扭矩变化大': 2.2,
  'V类:扭矩变化很大': 2.5,
  'default': 1.8 // 默认使用III类

};
/**
 * 根据齿轮箱型号获取推荐的联轴器信息
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {boolean} hasCover - 是否带罩壳
 * @return {object} 包含推荐前缀和特定型号的对象
 */

exports.couplingWorkFactorMap = couplingWorkFactorMap;

var getRecommendedCouplingInfo = function getRecommendedCouplingInfo(gearboxModel) {
  var hasCover = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  if (!gearboxModel) {
    return {
      prefix: gearboxToCouplingPrefixMap["default"],
      specific: null
    };
  } // 查找特定型号匹配


  var specificMatch = gearboxToCouplingSpecificMap[gearboxModel]; // 如果没有直接匹配，查找前缀匹配

  if (!specificMatch) {
    // 查找前缀匹配
    var _prefixMatch = null;

    for (var prefix in gearboxToCouplingPrefixMap) {
      if (prefix !== 'default' && gearboxModel.startsWith(prefix)) {
        _prefixMatch = gearboxToCouplingPrefixMap[prefix];
        break;
      }
    } // 如果没有找到前缀匹配，使用默认值


    if (!_prefixMatch) {
      _prefixMatch = gearboxToCouplingPrefixMap["default"];
    }

    return {
      prefix: _prefixMatch,
      specific: null
    };
  } // 检查是否需要根据罩壳状态调整型号


  if (hasCover && couplingWithCoverMap[specificMatch]) {
    specificMatch = couplingWithCoverMap[specificMatch];
  } // 提取前缀（一般为型号中的HGTHT, HGTHB等部分）


  var prefixMatch = specificMatch.match(/^([A-Z]+)/)[0];
  return {
    prefix: prefixMatch,
    specific: specificMatch,
    specifications: couplingSpecificationsMap[specificMatch] || null
  };
};
/**
 * 根据温度获取温度系数
 * @param {number} temperature - 工作温度 (°C)
 * @return {number} 温度系数
 */


exports.getRecommendedCouplingInfo = getRecommendedCouplingInfo;

var getTemperatureFactor = function getTemperatureFactor(temperature) {
  if (temperature <= 60) {
    return 1.0; // 标准温度范围
  } else if (temperature <= 80) {
    return 1.2; // 中高温
  } else if (temperature <= 100) {
    return 1.4; // 高温
  } else {
    return 1.6; // 超高温
  }
};
/**
 * 根据齿轮箱型号获取推荐的备用泵型号
 * @param {string} gearboxModel - 齿轮箱型号
 * @return {string} 推荐的备用泵型号，如果没有匹配则返回null
 */


exports.getTemperatureFactor = getTemperatureFactor;

var getRecommendedPump = function getRecommendedPump(gearboxModel) {
  if (!gearboxModel) return null; // 直接查找完全匹配

  if (gearboxToPumpMap[gearboxModel]) {
    return gearboxToPumpMap[gearboxModel];
  } // 查找前缀匹配


  for (var prefix in gearboxToPumpMap) {
    if (gearboxModel.startsWith(prefix)) {
      return gearboxToPumpMap[prefix];
    }
  } // 没有找到匹配


  return null;
};
/**
 * 获取联轴器的技术规格
 * @param {string} couplingModel - 联轴器型号
 * @return {object} 联轴器技术规格对象，如未找到则返回null
 */


exports.getRecommendedPump = getRecommendedPump;

var getCouplingSpecifications = function getCouplingSpecifications(couplingModel) {
  if (!couplingModel) return null;
  return couplingSpecificationsMap[couplingModel] || null;
};

exports.getCouplingSpecifications = getCouplingSpecifications;