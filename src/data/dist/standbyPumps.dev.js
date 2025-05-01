"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.standbyPumps = void 0;
// src/data/standbyPumps.js
// 船用齿轮箱备用泵数据库
// 根据验证结果补充关键字段并确保正向值 (2024-07-29)
var standbyPumps = [{
  model: "2CY7.5/2.5D",
  flow: 7.5,
  // L/min
  pressure: 2.5,
  // MPa
  motorPower: 1.5,
  // kW - Estimated typical power
  weight: 30,
  // kg - Estimated
  price: 8000,
  // Estimated price
  basePrice: 8000,
  // Added basePrice
  discountRate: 0.10,
  // Added default discount
  factoryPrice: 7200,
  // Calculated
  packagePrice: 7200,
  // Default
  marketPrice: 8181.82,
  // Calculated
  notes: ""
}, {
  model: "2CY14.2/2.5D",
  flow: 14.2,
  pressure: 2.5,
  motorPower: 2.2,
  // kW - Estimated typical power
  weight: 40,
  // kg - Estimated
  price: 10000,
  // Estimated price
  basePrice: 10000,
  discountRate: 0.10,
  factoryPrice: 9000,
  packagePrice: 9000,
  marketPrice: 10227.27,
  notes: ""
}, {
  model: "2CY10/3.0",
  // Added from error log
  flow: 10.0,
  pressure: 3.0,
  motorPower: 2.2,
  // Ensure positive value
  weight: 35,
  // Estimated
  price: 9000,
  // Estimated
  basePrice: 9000,
  discountRate: 0.10,
  factoryPrice: 8100,
  packagePrice: 8100,
  marketPrice: 9204.55,
  notes: ""
}, {
  model: "2CY16/4.0",
  // Added from error log
  flow: 16.0,
  pressure: 4.0,
  motorPower: 3.0,
  // Ensure positive value
  weight: 45,
  // Estimated
  price: 11000,
  // Estimated
  basePrice: 11000,
  discountRate: 0.10,
  factoryPrice: 9900,
  packagePrice: 9900,
  marketPrice: 11250.00,
  notes: ""
}, {
  model: "2CY25/6.3",
  // Added from error log
  flow: 25.0,
  pressure: 6.3,
  motorPower: 5.5,
  // Ensure positive value
  weight: 60,
  // Estimated
  price: 15000,
  // Estimated
  basePrice: 15000,
  discountRate: 0.10,
  factoryPrice: 13500,
  packagePrice: 13500,
  marketPrice: 15340.91,
  notes: ""
}, {
  model: "2CY19.2/2.5D",
  flow: 19.2,
  pressure: 2.5,
  motorPower: 3.0,
  // kW
  weight: 45,
  // kg
  price: 12000,
  basePrice: 12000,
  discountRate: 0.10,
  factoryPrice: 10800,
  packagePrice: 10800,
  marketPrice: 12272.73,
  notes: ""
}, {
  model: "2CY24.8/2.5D",
  flow: 24.8,
  pressure: 2.5,
  motorPower: 4.0,
  // kW
  weight: 50,
  // kg
  price: 14000,
  basePrice: 14000,
  discountRate: 0.10,
  factoryPrice: 12600,
  packagePrice: 12600,
  marketPrice: 14318.18,
  notes: ""
}, {
  model: "2CY34.5/2.5D",
  flow: 34.5,
  pressure: 2.5,
  motorPower: 5.5,
  // kW
  weight: 65,
  // kg
  price: 16000,
  basePrice: 16000,
  discountRate: 0.10,
  factoryPrice: 14400,
  packagePrice: 14400,
  marketPrice: 16363.64,
  notes: ""
}, {
  model: "2CY48.2/2.5D",
  // Added based on matching map
  flow: 48.2,
  pressure: 2.5,
  motorPower: 7.5,
  // kW - Estimated
  weight: 80,
  // kg - Estimated
  price: 19000,
  // Estimated
  basePrice: 19000,
  discountRate: 0.10,
  factoryPrice: 17100,
  packagePrice: 17100,
  marketPrice: 19431.82,
  notes: ""
}, // Added SPF20-40 based on priceManager fix
{
  model: "SPF20-40",
  flow: 20,
  // L/min - Estimated
  pressure: 4.0,
  // MPa - Estimated
  motorPower: 4.0,
  // kW - Estimated
  weight: 50,
  // kg - Estimated
  price: 8000,
  // From priceManager fix
  basePrice: 8000,
  discountRate: 0.10,
  factoryPrice: 7200,
  packagePrice: 7200,
  marketPrice: 7920,
  // From priceManager fix
  notes: ""
} // Add other pump models as needed, ensuring flow, pressure, motorPower > 0
]; // Default export

exports.standbyPumps = standbyPumps;
var _default = standbyPumps;
exports["default"] = _default;