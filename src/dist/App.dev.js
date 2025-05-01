"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _reactBootstrap = require("react-bootstrap");

var _reactRouterDom = require("react-router-dom");

var _AuthContext = require("./contexts/AuthContext");

var _roles = require("./auth/roles");

require("./styles/global.css");

var _enhancedPumpSelection = require("./utils/enhancedPumpSelection");

var _QuotationOptionsModal = _interopRequireDefault(require("./components/QuotationOptionsModal"));

var _CustomQuotationItemModal = _interopRequireDefault(require("./components/CustomQuotationItemModal"));

var _QuotationHistoryModal = _interopRequireDefault(require("./components/QuotationHistoryModal"));

var _dataCorrector = require("./utils/dataCorrector");

var _EnhancedGearboxSelectionResult = _interopRequireDefault(require("./components/EnhancedGearboxSelectionResult"));

var _CouplingSelectionResultComponent = _interopRequireDefault(require("./components/CouplingSelectionResultComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

// src/App.js - Main Application Component (Modified with Enhanced Features)
// 导入增强版备用泵选型功能
// 导入新的模态组件
// 导入数据修复工具
// 导入选型结果组件
var App = function App(_ref) {// ... existing code ...

  var initialAppData = _ref.appData,
      setAppData = _ref.setAppData;
};

var _default = App;
exports["default"] = _default;