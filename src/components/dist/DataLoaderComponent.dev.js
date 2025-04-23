"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = require("react");

var _dataAdapter = require("../utils/dataAdapter");

var _dataIntegration = require("../utils/dataIntegration");

var _embeddedData = require("../data/embeddedData");

var _flexibleCouplings = require("../data/flexibleCouplings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 改进的数据加载器组件 - 简化版
 * 
 * 此组件会：
 * 1. 直接使用嵌入式数据作为基础数据
 * 2. 适配数据格式
 * 3. 传递给应用
 */
var EnhancedDataLoader = function EnhancedDataLoader(_ref) {
  var onDataLoaded = _ref.onDataLoaded,
      setLoading = _ref.setLoading,
      setError = _ref.setError;
  (0, _react.useEffect)(function () {
    // 立即设置加载状态
    setLoading(true);
    console.log('DataLoader: 开始加载数据...');

    try {
      // 1. 使用嵌入式数据作为基础 - 简化版本
      console.log('DataLoader: 使用嵌入式数据');

      if (!_embeddedData.embeddedGearboxData) {
        throw new Error('嵌入式数据为空');
      } // 2. 合并联轴器数据


      console.log('DataLoader: 合并联轴器数据');

      var processedData = _objectSpread({}, _embeddedData.embeddedGearboxData, {
        flexibleCouplings: _flexibleCouplings.flexibleCouplings || []
      }); // 3. 适配数据格式


      console.log('DataLoader: 适配数据');
      var adaptedData = (0, _dataAdapter.adaptEnhancedData)(processedData); // 4. 保存到本地存储

      try {
        localStorage.setItem('appData', JSON.stringify(adaptedData));
        console.log('DataLoader: 数据已保存到本地存储');
      } catch (storageError) {
        console.warn('DataLoader: 保存到本地存储失败', storageError);
      } // 5. 完成加载


      console.log('DataLoader: 数据加载完成');
      onDataLoaded(adaptedData);
      setLoading(false);
    } catch (error) {
      console.error('DataLoader: 数据加载失败', error);
      setError('数据加载失败：' + (error.message || '未知错误'));
      setLoading(false);
    }
  }, [onDataLoaded, setLoading, setError]);
  return null;
}; // 最小合法性验证


var validateDataCompleteness = function validateDataCompleteness(data) {
  if (!data) return {
    valid: false,
    messages: ['数据为空']
  };
  return {
    valid: true,
    messages: []
  };
};

var _default = EnhancedDataLoader;
exports["default"] = _default;