"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.startApp = startApp;

var _embeddedData = require("../data/embeddedData");

var _gearboxPricing = require("../data/gearboxPricing");

var _flexibleCouplings = require("../data/flexibleCouplings");

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * 应用启动前的数据准备：
 * 1. 加载内置齿轮箱数据
 * 2. 将官方价格表合并到内置数据
 * 3. 返回处理后的初始数据
 * 若发生异常，返回原始嵌入式数据，保证应用可用。
 */
function startApp() {
  var gearboxesWithPrices, completeData;
  return regeneratorRuntime.async(function startApp$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;

          // 只在存在'needReset'标志时清除存储
          if (sessionStorage.getItem('needReset') === 'true') {
            localStorage.clear();
            sessionStorage.clear(); // 清除标志

            sessionStorage.removeItem('needReset');
            console.log('已重置应用存储');
          } // 此处可扩展异步加载外部 JSON 或 localStorage 数据


          gearboxesWithPrices = (0, _embeddedData.applyPriceUpdates)(_embeddedData.embeddedGearboxData, _gearboxPricing.gearboxPriceData || []); // 合并高弹性联轴器数据（保持原始顺序）

          completeData = _objectSpread({}, gearboxesWithPrices, {
            flexibleCouplings: _flexibleCouplings.flexibleCouplings || []
          });
          return _context.abrupt("return", completeData);

        case 7:
          _context.prev = 7;
          _context.t0 = _context["catch"](0);
          console.error('数据初始化失败，回退到嵌入式数据:', _context.t0);
          return _context.abrupt("return", _embeddedData.embeddedGearboxData);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 7]]);
}