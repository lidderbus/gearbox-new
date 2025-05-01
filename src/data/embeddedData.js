
// src/data/embeddedData.js

// 在文件开头添加 safeParseFloat 函数定义
/**
 * 安全解析浮点数，如果解析失败则返回null或默认值
 * @param {any} value 要解析的值
 * @param {number|null} defaultValue 解析失败时返回的默认值
 * @returns {number|null} 解析结果
 */
function safeParseFloat(value, defaultValue = null) {
  // 检查 undefined, null, 或空字符串
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  // 尝试解析
  const parsed = parseFloat(value);

  // 检查是否解析为 NaN
  return isNaN(parsed) ? defaultValue : parsed;
}

// 如果项目使用了 ESM 模块，需要导出 safeParseFloat 函数
export { safeParseFloat };


// import { flexibleCouplings } from './flexibleCouplings'; // Removed import - flexibleCouplings and standbyPumps are now loaded separately in repair.js
// import { standbyPumps } from './standbyPumps'; // Removed import
// import { getDiscountRate, calculateFactoryPrice, calculateMarketPrice } from '../utils/priceManager'; // Removed price calculations - price processing is centralized in priceManager/repair
// import { safeParseFloat } from '../utils/dataHelpers'; // Removed dataHelpers - Now defined here

// Embedded baseline data for gearboxes, without accessories.
// Accessories are loaded from their dedicated files in the repair process.
// Prices are based on 2022 documents where available, older entries have price fields zeroed out.
// Price calculations (factoryPrice, marketPrice) are included but will be recalculated by priceManager during repair.
export const embeddedGearboxData = {
  _version: 2, // Increment version to reflect 2022 price updates
  _lastFixed: new Date().toISOString(),
  // --- HC 系列 (基于 discounts-2022.txt / OCR P1-3, OCR Doc 1 P3-5) ---
  hcGearboxes: [
    {
      "model": "40A",
      "inputSpeedRange": [750, 2000],
      "ratios": [2.07, 2.96, 3.44, 3.83],
      "transferCapacity": [0.0294, 0.0294, 0.0235, 0.02], // kW/rpm
      "thrust": 8.8, // kN
      "centerDistance": 142, // mm
      "weight": 225, // kg
      "controlType": "推拉软轴",
      "dimensions": "490x670x620",
      "efficiency": 0.97, // Added estimated efficiency
      "basePrice": 8560, // From discounts-2022.txt
      "price": 8560,
      "discountRate": 0.16, // From discounts-2022.txt 下浮16%
      "factoryPrice": 7190.4, // From discounts-2022.txt 优惠后价格
      "packagePrice": 7190.4, // Default to factoryPrice
      "marketPrice": 8170.91, // Calculated: 7190.4 / (1 - 0.12) -> Use the priceManager calculation
      "notes": "手控、带罩、齿形块、A1型监控" // From OCR Doc 1 P3
    },
    {
      "model": "120C",
      "inputSpeedRange": [1000, 2500],
      "ratios": [1.48, 1.61, 1.94, 2.45, 2.96, 3.35],
      "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.09, 0.08],
      "thrust": 25,
      "centerDistance": 180,
      "weight": 225,
      "controlType": "推拉软轴/电控",
      "dimensions": "432x440x650",
      "efficiency": 0.97,
      "basePrice": 13420, // From discounts-2022.txt
      "price": 13420,
      "discountRate": 0.12, // From discounts-2022.txt 下浮12%
      "factoryPrice": 11809.6, // From discounts-2022.txt 优惠后价格
      "packagePrice": 11809.6,
      "marketPrice": 13420.00, // Calculated: 11809.6 / (1 - 0.12)
      "notes": "手控、带罩、齿形块、A1型监控" // From OCR Doc 1 P3
    },
     {
      "model": "HCN120", // Assuming alias for 120C, update if separate entry needed. Not in 2022 lists.
      "inputSpeedRange": [1000, 2500],
      "ratios": [1.48, 1.61, 1.94, 2.45, 2.96, 3.35],
      "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.09, 0.08],
      "thrust": 25,
      "centerDistance": 180,
      "weight": 225,
      "controlType": "推拉软轴/电控",
      "dimensions": "432x440x650",
      "efficiency": 0.97,
       "basePrice": 13420, // Assuming same price as 120C
       "price": 13420,
       "discountRate": 0.12, // Default based on 120C
       "factoryPrice": 11809.6, // Calculated
       "packagePrice": 11809.6,
       "marketPrice": 13420.00, // Calculated
       "notes": "未在2022价格表中直接列出 (价格同120C)"
    },
    {
      "model": "120B",
      "inputSpeedRange": [750, 1800],
      "ratios": [2.03, 2.81, 3.73],
      "transferCapacity": [0.088, 0.088, 0.044],
      "thrust": 25,
      "centerDistance": 190,
      "weight": 400,
      "controlType": "推拉软轴/电控",
      "dimensions": "605x744x770",
      "efficiency": 0.97,
      "basePrice": 12520, // From discounts-2022.txt
      "price": 12520,
      "discountRate": 0.12, // From discounts-2022.txt 下浮12%
      "factoryPrice": 11017.6, // From discounts-2022.txt 优惠后价格
      "packagePrice": 11017.6,
      "marketPrice": 12520.00, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控" // From OCR Doc 1 P3
    },
    {
      "model": "MB170",
      "inputSpeedRange": [1500, 2500],
      "ratios": [1.97, 2.52, 3.04, 3.54, 3.96, 4.5, 5.06, 5.47, 5.88],
      "transferCapacity": [0.039, 0.039, 0.039, 0.039, 0.031, 0.031, 0.027, 0.027], // Note: Capacity array length mismatch with ratios, will be fixed by repair
      "thrust": 16,
      "centerDistance": 170,
      "weight": 240,
      "controlType": "推拉软轴/电控",
      "dimensions": "510x670x656",
      "efficiency": 0.97,
      "basePrice": 10950, // From discounts-2022.txt
      "price": 10950,
      "discountRate": 0.12, // From discounts-2022.txt 下浮12%
      "factoryPrice": 9636, // From discounts-2022.txt 优惠后价格
      "packagePrice": 9636,
      "marketPrice": 10950.00, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控" // From OCR Doc 1 P3
    },
     {
      "model": "MB242",
      "inputSpeedRange": [1000, 2500],
      "ratios": [2, 2.54, 3.04, 3.52, 3.95, 4.53, 5.12, 5.56, 5.88],
      "transferCapacity": [0.103, 0.103, 0.103, 0.103, 0.103, 0.103, 0.1, 0.094, 0.074],
      "thrust": 30,
      "centerDistance": 242,
      "weight": 385,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "442x774x763",
      "efficiency": 0.97,
       "basePrice": 21300, // From discounts-2022.txt
       "price": 21300,
       "discountRate": 0.12, // From discounts-2022.txt 下浮12%
       "factoryPrice": 18744, // From discounts-2022.txt 优惠后价格
       "packagePrice": 18744,
       "marketPrice": 21300.00, // Calculated
       "notes": "手控、带罩、齿形块、A1型监控" // From OCR Doc 1 P3
    },
    {
      "model": "MB270A", // Prices differ by ratio in discounts-2022.txt
      "inputSpeedRange": [1000, 2500],
      "ratios": [3, 4.05, 4.53, 5.12, 5.5, 5.95, 6.39, 6.82], // Combined ratios
      "transferCapacity": [0.147, 0.147, 0.147, 0.147, 0.134, 0.11, 0.088, 0.088],
      "thrust": 39.2,
      "centerDistance": 270,
      "weight": 675,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "594x810x868",
      "efficiency": 0.97,
      // Using price for 3-5.5:1 range as default from discounts-2022.txt
      "basePrice": 28600, // From discounts-2022.txt (3-5.5:1)
      "price": 28600,
      "discountRate": 0.12, // From discounts-2022.txt 下浮12%
      "factoryPrice": 25168, // From discounts-2022.txt (3-5.5:1)
      "packagePrice": 25168,
      "marketPrice": 28600.00, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控 (价格按速比范围区分，此为3-5.5:1价格)" // Added note
      // Note: discounts-2022.txt shows 30000 base for 6-7:1 range -> factory 26400
    },
     {
      "model": "135",
      "inputSpeedRange": [750, 2000],
      "ratios": [2.03, 2.59, 3.04, 3.62, 4.11, 4.65, 5.06, 5.47, 5.81],
      "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.1, 0.093, 0.088, 0.077, 0.07],
      "thrust": 29.4,
      "centerDistance": 225,
      "weight": 470,
      "controlType": "推拉软轴/电控",
      "dimensions": "578x792x830",
      "efficiency": 0.97,
       "basePrice": 18360, // From discounts-2022.txt
       "price": 18360,
       "discountRate": 0.16, // From discounts-2022.txt 下浮16%
       "factoryPrice": 15422.4, // From discounts-2022.txt 优惠后价格
       "packagePrice": 15422.4,
       "marketPrice": 17525.45, // Calculated
       "notes": "手控、带罩、齿形块、A1型监控" // From OCR Doc 1 P3
    },
    {
      "model": "135A", // Assuming this is a valid model alias/variant
      "inputSpeedRange": [750, 2000], // Copied from 135
      "ratios": [2.03, 2.59, 3.04, 3.62, 4.11, 4.65, 5.06, 5.47, 5.81], // Copied from 135
      "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.1, 0.093, 0.088, 0.077, 0.07], // Copied from 135
      "thrust": 29.4, // Copied from 135
      "centerDistance": 225, // Copied from 135
      "weight": 470, // Copied from 135
      "controlType": "推拉软轴/电控", // Copied from 135
      "dimensions": "578x792x830", // Copied from 135
      "efficiency": 0.97,
      "basePrice": 19200, // From discounts-2022.txt
      "price": 19200,
      "discountRate": 0.16, // From discounts-2022.txt 下浮16%
      "factoryPrice": 16128, // From discounts-2022.txt 优惠后价格
      "packagePrice": 16128,
      "marketPrice": 18327.27, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控" // From OCR Doc 1 P3
    },
    {
      "model": "HC138",
      "inputSpeedRange": [1000, 2500], // Corrected original file speed range
      "ratios": [2, 2.52, 3, 3.57, 4.05, 4.45],
      "transferCapacity": [0.11, 0.11, 0.11, 0.11, 0.11, 0.11], // Corrected original file capacity
      "thrust": 30, // Corrected original file thrust
      "centerDistance": 225, // Corrected original file distance
      "weight": 460, // Corrected original file weight
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "520x792x760", // Corrected original file dimensions
      "efficiency": 0.97,
      "basePrice": 18200, // From discounts-2022.txt
      "price": 18200,
      "discountRate": 0.16, // From discounts-2022.txt 下浮16%
      "factoryPrice": 15288, // From discounts-2022.txt 优惠后价格
      "packagePrice": 15288,
      "marketPrice": 17372.73, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控 (或手控、无罩、高弹、A1型监控)" // From OCR Doc 1 P3/P4
    },
    {
      "model": "HCD138",
      "inputSpeedRange": [1000, 2500],
      "ratios": [5.05, 5.63, 6.06, 6.47],
      "transferCapacity": [0.11, 0.11, 0.099, 0.093],
      "thrust": 40,
      "centerDistance": 296,
      "weight": 415,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "494x800x870",
      "efficiency": 0.97,
      "basePrice": 19400, // From discounts-2022.txt
      "price": 19400,
      "discountRate": 0.16, // From discounts-2022.txt 下浮16%
      "factoryPrice": 16296, // From discounts-2022.txt 优惠后价格
      "packagePrice": 16296,
      "marketPrice": 18518.18, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控 (或手控、无罩、高弹、A1型监控)" // From OCR Doc 1 P3/P4
    },
     {
      "model": "300", // Prices differ by ratio in discounts-2022.txt
      "inputSpeedRange": [750, 2500],
      "ratios": [1.87, 2.04, 2.54, 3, 3.53, 4.1, 4.47, 4.61, 4.94, 5.44], // Combined ratios
      "transferCapacity": [0.257, 0.257, 0.257, 0.243, 0.221, 0.184, 0.184, 0.184, 0.147, 0.125], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 50,
      "centerDistance": 264,
      "weight": 740,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "786x930x880",
      "efficiency": 0.97,
      // Using price for 1.87-3:1 range as default from discounts-2022.txt
      "basePrice": 23000, // From discounts-2022.txt (1.87-3:1)
      "price": 23000,
      "discountRate": 0.16, // From discounts-2022.txt 下浮16%
      "factoryPrice": 19320, // From discounts-2022.txt (1.87-3:1)
      "packagePrice": 19320,
      "marketPrice": 21954.55, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控 (价格按速比范围区分)" // Added note
      // Note: discounts-2022.txt shows higher base prices for higher ratios (23600/19824 for 3.5-4:1, 24150/20286 for 4.5-5.5:1)
    },
    {
      "model": "J300",
      "inputSpeedRange": [750, 2500],
      "ratios": [2.04, 2.54, 3, 3.47, 3.95],
      "transferCapacity": [0.28, 0.28, 0.28, 0.28, 0.257],
      "thrust": 60,
      "centerDistance": 264,
      "weight": 740,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "786x930x864",
      "efficiency": 0.97,
      "basePrice": 26680, // From discounts-2022.txt
      "price": 26680,
      "discountRate": 0.22, // Calculated from discounts-2022.txt 报告特批 20810 / 26680 ~= 0.78, 1 - 0.78 = 0.22
      "factoryPrice": 20810, // From discounts-2022.txt 优惠后价格
      "packagePrice": 20810,
      "marketPrice": 23647.73, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控 (报告特批)" // From OCR Doc 1 P3 / discounts-2022.txt
    },
    {
      "model": "HC300", // Prices differ by ratio in discounts-2022.txt, capacity/thrust from original data
      "inputSpeedRange": [750, 2500],
      "ratios": [1.87, 2.04, 2.54, 3.00, 3.53, 4.10, 4.47, 4.61, 4.94, 5.44], // Ratios from original data
      "transferCapacity": [0.26057, 0.24935, 0.23702, 0.22359, 0.20905, 0.19342, 0.17668, 0.15884, 0.13990, 0.11986], // Capacity from original data (rounded)
      "thrust": 50, // Thrust from original data
      "centerDistance": 264, // CenterDistance from original data
      "weight": 680, // Weight from original data
      "controlType": "推拉软轴/电控/气控", // ControlType from original data
      "dimensions": "-", // Dimensions from original data
      "efficiency": 0.97,
      // Using price for 1.5-4.61 range as default from discounts-2022.txt
      "basePrice": 23000, // From discounts-2022.txt (This HC300 entry seems different from the 300 entry)
      "price": 23000,
      "discountRate": 0.16, // From discounts-2022.txt 下浮16%
      "factoryPrice": 19320, // From discounts-2022.txt
      "packagePrice": 19320,
      "marketPrice": 21954.55, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控 (价格按速比范围区分，此为1.5-4.61价格)" // Added note
    },
    {
      "model": "D300A", // Prices differ by ratio in discounts-2022.txt
      "inputSpeedRange": [1000, 2500],
      "ratios": [4.00, 4.48, 5.05, 5.52, 5.90, 6.56, 7.06, 7.63], // Combined ratios
      "transferCapacity": [0.257, 0.243, 0.221, 0.184, 0.184, 0.184, 0.147, 0.125], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 60,
      "centerDistance": 355,
      "weight": 940,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "786x1010x1041",
      "efficiency": 0.97,
      // Using price for 4-5.5:1 range as default from discounts-2022.txt
      "basePrice": 32420, // From discounts-2022.txt (4-5.5:1)
      "price": 32420,
      "discountRate": 0.22, // Calculated from discounts-2022.txt 报告特批 25287 / 32420 ~= 0.78, 1 - 0.78 = 0.22
      "factoryPrice": 25287, // From discounts-2022.txt (4-5.5:1)
      "packagePrice": 25287,
      "marketPrice": 28735.23, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控 (价格按速比范围区分，此为4-5.5:1报告特批价格)" // Added note
      // Note: discounts-2022.txt shows 34520 base for 6-7.5:1 range -> factory 28996.8 (discount 16%)
    },
    {
      "model": "T300",
      "inputSpeedRange": [1000, 2300],
      "ratios": [4.73, 4.95, 5.51, 6.03, 6.65, 7.04, 7.54, 8.02, 8.47],
      "transferCapacity": [0.243, 0.243, 0.243, 0.243, 0.243, 0.243, 0.221, 0.221, 0.2],
      "thrust": 70,
      "centerDistance": 355,
      "weight": 1120,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "770x980x1106",
      "efficiency": 0.97,
      "basePrice": 43900, // From discounts-2022.txt
      "price": 43900,
      "discountRate": 0.16, // From discounts-2022.txt 下浮16%
      "factoryPrice": 36876, // From discounts-2022.txt 优惠后价格
      "packagePrice": 36876,
      "marketPrice": 41904.55, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控" // From OCR Doc 1 P3
    },
    {
      "model": "T300/1",
      "inputSpeedRange": [1000, 2300],
      "ratios": [8.94, 9.45],
      "transferCapacity": [0.196, 0.196],
      "thrust": 70,
      "centerDistance": 355,
      "weight": 1120,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "770x980x1106",
      "efficiency": 0.97,
      "basePrice": 46900, // From discounts-2022.txt
      "price": 46900,
      "discountRate": 0.16, // From discounts-2022.txt 下浮16%
      "factoryPrice": 39396, // From discounts-2022.txt 优惠后价格
      "packagePrice": 39396,
      "marketPrice": 44768.18, // Calculated
      "notes": "手控、带罩、齿形块、A1型监控" // From OCR Doc 1 P3
    },
    {
      "model": "HC400",
      "inputSpeedRange": [1000, 1800],
      "ratios": [1.50, 1.77, 2.04, 2.50, 2.86, 3.00, 3.25, 3.33, 3.42, 3.60, 3.96, 4.33, 4.43, 4.70, 5.00],
      "transferCapacity": [0.331, 0.3258367346938776, 0.3199183673469388, 0.31324489795918364, 0.30581632653061225, 0.2976326530612245, 0.2886938775510204, 0.279, 0.2685510204081633, 0.2573469387755102, 0.2453877551020408, 0.2326734693877551, 0.2192040816326531, 0.20497959183673467, 0.19], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 82,
      "centerDistance": 264,
      "weight": 820,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 32150, // From discounts-2022.txt
      "price": 32150,
      "discountRate": 0.22, // Calculated from discounts-2022.txt 报告特批 25077 / 32150 ~= 0.78, 1 - 0.78 = 0.22
      "factoryPrice": 25077, // From discounts-2022.txt 优惠后价格
      "packagePrice": 25077,
      "marketPrice": 28496.59, // Calculated
      "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控) (报告特批)" // From OCR Doc 1 P4 / discounts-2022.txt
    },
    {
      "model": "HCD400A",
      "inputSpeedRange": [1000, 1800],
      "ratios": [3.96, 4.33, 4.43, 4.7, 5, 5.53, 5.71, 5.89, 6],
      "transferCapacity": [0.331, 0.331, 0.331, 0.331, 0.331, 0.293, 0.272, 0.272, 0.267], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 82,
      "centerDistance": 355,
      "weight": 1100,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "641x1010x988",
      "efficiency": 0.97,
      "basePrice": 38150, // From discounts-2022.txt
      "price": 38150,
      "discountRate": 0.22, // Calculated from discounts-2022.txt 报告特批 29757 / 38150 ~= 0.78, 1 - 0.78 = 0.22
      "factoryPrice": 29757, // From discounts-2022.txt 优惠后价格
      "packagePrice": 29757,
      "marketPrice": 33814.77, // Calculated
      "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控) (报告特批)" // From OCR Doc 1 P4 / discounts-2022.txt
    },
     {
      "model": "HCT400A",
      "inputSpeedRange": [1000, 2100],
      "ratios": [6.09, 6.49, 6.93, 7.42, 7.96, 8.4, 9, 9.47],
      "transferCapacity": [0.331, 0.331, 0.331, 0.331, 0.309, 0.294, 0.279, 0.279],
      "thrust": 82,
      "centerDistance": 375,
      "weight": 1450,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "784x992x1130",
      "efficiency": 0.97,
       "basePrice": 51000, // From discounts-2022.txt
       "price": 51000,
       "discountRate": 0.16, // From discounts-2022.txt 下浮16%
       "factoryPrice": 42840, // Calculated
       "packagePrice": 42840,
       "marketPrice": 48681.82, // Calculated
       "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)" // From OCR Doc 1 P4
    },
    {
      "model": "HCT400A/1",
      "inputSpeedRange": [1000, 2100],
      "ratios": [8.15, 8.69, 9.27, 9.94, 10.6, 11.37, 12, 12.5, 13.96],
      "transferCapacity": [0.331, 0.331, 0.331, 0.316, 0.297, 0.274, 0.262, 0.262, 0.204], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 120,
      "centerDistance": 465,
      "weight": 1500,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "869x1100x1275",
      "efficiency": 0.97,
      "basePrice": 60000, // From discounts-2022.txt
      "price": 60000,
      "discountRate": 0.16, // From discounts-2022.txt 下浮16%
      "factoryPrice": 50400, // Calculated
      "packagePrice": 50400,
      "marketPrice": 57272.73, // Calculated
      "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)" // From OCR Doc 1 P4
    },
    {
      "model": "HC600A",
      "inputSpeedRange": [1000, 2100],
      "ratios": [2.00, 2.48, 2.63, 3.00, 3.58, 3.89],
      "transferCapacity": [0.49, 0.49, 0.49, 0.49, 0.49, 0.49],
      "thrust": 90,
      "centerDistance": 320,
      "weight": 1300,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 57200, // From discounts-2022.txt
      "price": 57200,
      "discountRate": 0.12, // From discounts-2022.txt 下浮12%
      "factoryPrice": 50336, // From discounts-2022.txt 优惠后价格
      "packagePrice": 50336,
      "marketPrice": 57200.00, // Calculated
      "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)" // From OCR Doc 1 P4
    },
    {
      "model": "HCD600A",
      "inputSpeedRange": [1000, 2100],
      "ratios": [4.18, 4.43, 4.7, 5, 5.44, 5.71],
      "transferCapacity": [0.49, 0.49, 0.49, 0.49, 0.45, 0.43],
      "thrust": 90,
      "centerDistance": 415,
      "weight": 1550,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "745x1214x1271",
      "efficiency": 0.97,
      "basePrice": 60600, // From discounts-2022.txt
      "price": 60600,
      "discountRate": 0.12, // From discounts-2022.txt 下浮12%
      "factoryPrice": 53328, // From discounts-2022.txt 优惠后价格
      "packagePrice": 53328,
      "marketPrice": 60600.00, // Calculated
      "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)" // From OCR Doc 1 P4
    },
     {
      "model": "HCT600A",
      "inputSpeedRange": [1000, 2100],
      "ratios": [6.06, 6.49, 6.97, 7.51, 8.04, 8.66, 9.35],
      "transferCapacity": [0.45, 0.419, 0.39, 0.363, 0.338, 0.314, 0.291],
      "thrust": 90,
      "centerDistance": 415,
      "weight": 1650,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "821x1214x1271",
      "efficiency": 0.97,
       "basePrice": 70900, // From discounts-2022.txt
       "price": 70900,
       "discountRate": 0.12, // From discounts-2022.txt 下浮12%
       "factoryPrice": 62392, // From discounts-2022.txt 优惠后价格
       "packagePrice": 62392,
       "marketPrice": 70900.00, // Calculated
       "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)" // From OCR Doc 1 P4
    },
    {
      "model": "HCT600A/1",
      "inputSpeedRange": [1000, 2100],
      "ratios": [6.09, 6.48, 7.04, 7.69, 8.23, 8.82, 9.47, 10.1, 10.8, 11.65, 12.57, 13.64, 14.44, 15.91],
      "transferCapacity": [0.49, 0.49, 0.49, 0.49, 0.49, 0.485, 0.45, 0.423, 0.395, 0.367, 0.34, 0.313, 0.296, 0.268], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 140,
      "centerDistance": 500,
      "weight": 1700,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "878x1224x1346",
      "efficiency": 0.97,
      "basePrice": 75000, // From discounts-2022.txt
      "price": 75000,
      "discountRate": 0.12, // From discounts-2022.txt 下浮12%
      "factoryPrice": 66000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 66000,
      "marketPrice": 75000.00, // Calculated
      "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)" // From OCR Doc 1 P4
    },
    {
      "model": "HCD800",
      "inputSpeedRange": [600, 2100],
      "ratios": [3, 3.43, 3.96, 4.17, 4.39, 4.9, 5.47, 5.89],
      "transferCapacity": [0.625, 0.625, 0.625, 0.625, 0.625, 0.588, 0.551, 0.515],
      "thrust": 110,
      "centerDistance": 450,
      "weight": 2250,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1056x1280x1341",
      "efficiency": 0.97,
      "basePrice": 86100, // From discounts-2022.txt
      "price": 86100,
      "discountRate": 0.08, // From discounts-2022.txt 下浮8%
      "factoryPrice": 79212, // From discounts-2022.txt 优惠后价格
      "packagePrice": 79212,
      "marketPrice": 90013.64, // Calculated
      "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)" // From OCR Doc 1 P4
    },
     {
      "model": "HCT800",
      "inputSpeedRange": [600, 2100],
      "ratios": [4.95, 5.57, 5.68, 5.93, 6.43, 6.86, 7.33, 7.84, 8.4, 9],
      "transferCapacity": [0.625, 0.625, 0.625, 0.625, 0.625, 0.588, 0.551, 0.515, 0.48, 0.48],
      "thrust": 140,
      "centerDistance": 450,
      "weight": 2500,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1056x1280x1425",
      "efficiency": 0.97,
       "basePrice": 98000, // From discounts-2022.txt
       "price": 98000,
       "discountRate": 0.08, // From discounts-2022.txt 下浮8%
       "factoryPrice": 90160, // From discounts-2022.txt 优惠后价格
       "packagePrice": 90160,
       "marketPrice": 102454.55, // Calculated
       "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)" // From OCR Doc 1 P4
    },
    {
        "model": "HCT800/1", // OCR Doc 1 P4 shows split prices by ratio, discounts-2022.txt shows one entry. Use discounts-2022.txt
        "inputSpeedRange": [600, 2100],
        "ratios": [6.91, 7.28, 7.69, 8.13, 8.60, 9.12, 9.68, 10.30, 10.98, 11.76, 12.43, 13.17, 13.97, 14.85, 15.82, 16.58, 17.91, 20.12, 22.11], // Combined from OCR Doc 1 P4
        "transferCapacity": [0.625, 0.625, 0.625, 0.625, 0.625, 0.625, 0.625, 0.609, 0.575, 0.549, 0.520, 0.491, 0.463, 0.435, 0.408, 0.382, 0.378, 0.278, 0.278], // Note: Capacity array length mismatch, will be fixed by repair
        "thrust": 220,
        "centerDistance": 582,
        "weight": 3300,
        "controlType": "推拉软轴/电控/气控",
        "dimensions": "1152x1360x1557",
        "efficiency": 0.97,
        "basePrice": 137200, // From discounts-2022.txt
        "price": 137200,
        "discountRate": 0.08, // From discounts-2022.txt 下浮8%
        "factoryPrice": 126224, // From discounts-2022.txt 优惠后价格
        "packagePrice": 126224,
        "marketPrice": 143436.36, // Calculated
        "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控) (价格按速比范围区分，此价格对应高速比范围)" // Added note
    },
    {
      "model": "HCT800/2",
      "inputSpeedRange": [600, 2100],
      "ratios": [11.52, 12.21, 11.97, 14.08, 14.48, 14.88, 15.48, 15.76, 16.72, 17.78, 18.94], // Note: ratios array has 11 items
      "transferCapacity": [0.600, 0.600, 0.600, 0.553, 0.549, 0.520, 0.503, 0.491, 0.463, 0.435, 0.382], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 220,
      "centerDistance": 666,
      "weight": 3960,
      "controlType": "推拉软轴/电控",
      "dimensions": "1190x1490x1707",
      "efficiency": 0.97,
      "basePrice": 150200, // From discounts-2022.txt
      "price": 150200,
      "discountRate": 0.08, // From discounts-2022.txt 下浮8%
      "factoryPrice": 138184, // From discounts-2022.txt 优惠后价格
      "packagePrice": 138184,
      "marketPrice": 157027.27, // Calculated
      "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)" // From OCR Doc 1 P4
    },
    {
      "model": "HCT800/2A", // Not found in 2022 price lists, retaining old data
       "inputSpeedRange": [600, 1900],
       "ratios": [13.12, 13.81, 14.55, 15.33, 16.16, 17.04, 17.99, 20.27, 22.18],
       "transferCapacity": [0.6816, 0.6474, 0.6147, 0.5834, 0.5534, 0.5250, 0.4970, 0.4410, 0.4350],
       "thrust": 220,
       "centerDistance": 666,
       "weight": 4000,
      "controlType": "推拉软轴/电控",
       "dimensions": "1190x1490x2040",
       "efficiency": 0.97,
       "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0,
       "notes": "未在2022价格表中找到"
    },
    {
      "model": "HCT800/3",
      "inputSpeedRange": [600, 2100],
      "ratios": [16.56, 17.95, 20.19, 21.94],
      "transferCapacity": [0.597, 0.551, 0.491, 0.414],
      "thrust": 240,
      "centerDistance": 736,
      "weight": 4540,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1235x1570x1789",
      "efficiency": 0.97,
      "basePrice": 170800, // From discounts-2022.txt
      "price": 170800,
      "discountRate": 0.08, // From discounts-2022.txt 下浮8%
      "factoryPrice": 157136, // From discounts-2022.txt 优惠后价格
      "packagePrice": 157136,
      "marketPrice": 178563.64, // Calculated
      "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)" // From OCR Doc 1 P4
    },
     {
      "model": "HCW800", // Found in discounts-2022.txt, other data from HCW1100 placeholder
      "inputSpeedRange": [1000, 1800], // Placeholder, needs correct data if available
      "ratios": [15.88, 16.38, 17.24, 17.97, 18.74, 19.55, 20.40, 21.99], // Using ratios from HCW1100 as placeholder, needs verification
      "transferCapacity": [0.931],       // Placeholder, needs verification
      "thrust": 300,                  // Placeholder
      "centerDistance": 625,          // Placeholder
      "weight": 6900, // Using weight from HCW1100 as placeholder
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1567x1630x2550", // Using dimensions from HCW1100 as placeholder
      "efficiency": 0.97,
       "basePrice": 173900, // From discounts-2022.txt
       "price": 173900,
       "discountRate": 0.08, // From discounts-2022.txt 下浮8%
       "factoryPrice": 159988, // From discounts-2022.txt 优惠后价格
       "packagePrice": 159988,
       "marketPrice": 181804.55, // Calculated
       "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控) (数据可能不全)" // From OCR Doc 1 P4
    },
    {
      "model": "HC1000",
      "inputSpeedRange": [600, 2100],
      "ratios": [2.00, 2.17, 2.50, 2.64, 3.04, 3.23, 3.48, 3.59, 4.06, 5.47, 5.83], // Note: 11 ratios
      "transferCapacity": [0.735, 0.7265, 0.718, 0.7095, 0.701, 0.6925, 0.684, 0.6755, 0.667, 0.6585, 0.65], // Note: 11 capacities
      "thrust": 110,
      "centerDistance": 335,
      "weight": 1500,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 81200, // From discounts-2022.txt
      "price": 81200,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 76328, // From discounts-2022.txt 优惠后价格
      "packagePrice": 76328,
      "marketPrice": 86736.36, // Calculated
      "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)" // From OCR Doc 1 P4
    },
     {
      "model": "HCD1000",
      "inputSpeedRange": [600, 2100],
      "ratios": [3.43, 3.96, 4.39, 4.45, 4.90, 5.06, 5.47, 5.83],
      "transferCapacity": [0.735, 0.735, 0.735, 0.735, 0.735, 0.735, 0.680, 0.650],
      "thrust": 140,
      "centerDistance": 450,
      "weight": 2200,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1082x1120x990",
      "efficiency": 0.97,
       "basePrice": 89800, // From discounts-2022.txt
       "price": 89800,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 84412, // From discounts-2022.txt 优惠后价格
       "packagePrice": 84412,
       "marketPrice": 95922.73, // Calculated
       "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)" // From OCR Doc 1 P4
    },
    {
      "model": "HCT1100",
      "inputSpeedRange": [600, 1900],
      "ratios": [4.94, 5.60, 5.98, 6.39, 6.85, 7.35, 7.90, 8.53, 8.90],
      "transferCapacity": [0.846, 0.846, 0.846, 0.846, 0.835, 0.772, 0.736, 0.682, 0.653],
      "thrust": 150,
      "centerDistance": 500,
      "weight": 3200,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1150x1350x1547",
      "efficiency": 0.97,
      "basePrice": 128960, // From discounts-2022.txt
      "price": 128960,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 121222.4, // Calculated
      "packagePrice": 121222.4,
      "marketPrice": 137752.73, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P4
    },
     {
      "model": "HCW1100",
      "inputSpeedRange": [1500, 1800],
      "ratios": [15.88, 16.38, 17.24, 17.97, 18.74, 19.55, 20.40, 21.99], // Note: 8 ratios
      "transferCapacity": [0.931, 0.931, 0.894, 0.857, 0.822, 0.788, 0.756, 0.701], // Note: 8 capacities
      "thrust": 300,
      "centerDistance": 625,
      "weight": 6900,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1567x1630x2550",
      "efficiency": 0.97,
       "basePrice": 257500, // From discounts-2022.txt
       "price": 257500,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 242050, // Calculated
       "packagePrice": 242050,
       "marketPrice": 275056.82, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P4
    },
     {
      "model": "HC1200", // Found in discounts-2022.txt (报告特批)
      "inputSpeedRange": [600, 1900],
      "ratios": [1.60, 2.03, 2.48, 2.50, 2.96, 3.18, 3.33, 3.55, 3.79, 4.06, 4.20, 4.47], // Note: 12 ratios
      "transferCapacity": [0.9378571428571434, 0.9121829988193627, 0.8862255017709563, 0.8599846517119242, 0.8334604486422664, 0.806652892561983, 0.7795619834710739, 0.7521877213695392, 0.7245301062573786, 0.6965891381345924, 0.6683648170011806, 0.639857142857143], // Note: 12 capacities
      "thrust": 120,
      "centerDistance": 380,
      "weight": 1870,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 92000, // From discounts-2022.txt
      "price": 92000,
      "discountRate": 0.14, // Calculated from discounts-2022.txt 报告特批 79380 / 92000 ~= 0.86, 1 - 0.86 = 0.14
      "factoryPrice": 79380, // From discounts-2022.txt 优惠后价格
      "packagePrice": 79380,
      "marketPrice": 90204.55, // Calculated
      "notes": "手控、无罩、高弹、A1型监控 (报告特批)" // From OCR Doc 1 P4 / discounts-2022.txt
    },
    {
      "model": "HC1200/1", // Found in discounts-2022.txt (报告特批)
      "inputSpeedRange": [600, 1900],
      "ratios": [3.70, 3.74, 3.95, 4.14, 4.45, 5.00, 5.25, 5.58], // Note: 8 ratios
      "transferCapacity": [0.93, 0.93, 0.93, 0.93, 0.93, 0.833, 0.695, 0.65], // Note: 8 capacities
      "thrust": 140,
      "centerDistance": 450,
      "weight": 2500,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1096x1260x1270",
      "efficiency": 0.97,
      "basePrice": 108200, // From discounts-2022.txt
      "price": 108200,
      "discountRate": 0.10, // Calculated from discounts-2022.txt 报告特批 97000 / 108200 ~= 0.90, 1 - 0.90 = 0.10
      "factoryPrice": 97000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 97000,
      "marketPrice": 110227.27, // Calculated
      "notes": "手控、无罩、高弹、A1型监控 (报告特批)" // From OCR Doc 1 P4 / discounts-2022.txt
    },
    {
      "model": "HCT1200",
      "inputSpeedRange": [600, 1900],
      "ratios": [5.05, 5.26, 5.60, 5.98, 6.39, 6.85, 7.35, 7.90],
      "transferCapacity": [0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93], // Note: 8 capacities
      "thrust": 150,
      "centerDistance": 500,
      "weight": 3200,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1188x1350x1547",
      "efficiency": 0.97,
      "basePrice": 143000, // From discounts-2022.txt
      "price": 143000,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 134420, // Calculated
      "packagePrice": 134420,
      "marketPrice": 152750.00, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
    {
      "model": "HCT1200/1",
      "inputSpeedRange": [600, 1900],
      "ratios": [8.55, 9.16, 9.57, 10.08, 10.74, 11.05, 11.45, 12.17, 12.53, 12.92, 13.65, 14.00, 14.54], // Note: 13 ratios
      "transferCapacity": [0.93, 0.93, 0.93, 0.93, 0.83, 0.82, 0.78, 0.74, 0.72, 0.70, 0.65, 0.625, 0.60], // Note: 13 capacities
      "thrust": 220,
      "centerDistance": 580,
      "weight": 3600,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1056x1430x1670",
      "efficiency": 0.97,
      "basePrice": 157000, // From discounts-2022.txt
      "price": 157000,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 147580, // Calculated
      "packagePrice": 147580,
      "marketPrice": 167690.91, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HCT1280/2",
      "inputSpeedRange": [700, 1800],
      "ratios": [8.04, 8.46, 8.90, 9.38, 9.88, 10.43, 11.03, 11.98, 12.36, 13.13, 13.54, 13.96, 14.32, 15.21, 16.19, 17.27, 18.47], // Note: 17 ratios
      "transferCapacity": [0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.886, 0.859, 0.833, 0.812, 0.765, 0.718, 0.673, 0.63], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 240,
      "centerDistance": 680,
      "weight": 4600,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1290x1520x1775",
      "efficiency": 0.97,
       "basePrice": 165000, // From discounts-2022.txt
       "price": 165000,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 155100, // Calculated
       "packagePrice": 155100,
       "marketPrice": 176250.00, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
    {
      "model": "HCD1400",
      "inputSpeedRange": [600, 1900],
      "ratios": [3.50, 3.83, 4.04, 4.27, 4.32, 4.52, 4.80, 5.05, 5.50, 5.86], // Note: 10 ratios
      "transferCapacity": [1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.030, 0.950], // Note: 10 capacities
      "thrust": 175,
      "centerDistance": 485,
      "weight": 2800,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1260x1380x1360",
      "efficiency": 0.97,
      "basePrice": 139000, // From discounts-2022.txt
      "price": 139000,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 130660, // Calculated
      "packagePrice": 130660,
      "marketPrice": 148477.27, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HCT1400",
      "inputSpeedRange": [600, 1900],
      "ratios": [4.06, 4.51, 5.03, 5.52, 5.97, 6.48, 7.03, 7.50, 8.01, 8.47, 8.59, 8.98, 9.12, 9.55, 11.06], // Note: 15 ratios
      "transferCapacity": [1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.081, 1.000, 0.960, 0.930, 0.900, 0.850, 0.737], // Note: 15 capacities
      "thrust": 220,
      "centerDistance": 550,
      "weight": 3800,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1306x1380x1750",
      "efficiency": 0.97,
       "basePrice": 162500, // From discounts-2022.txt
       "price": 162500,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 152750, // Calculated
       "packagePrice": 152750,
       "marketPrice": 173579.55, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HCT1400/2",
      "inputSpeedRange": [600, 1900],
      "ratios": [10.47, 11.15, 11.50, 12.01, 12.43, 12.96, 13.41, 14.02, 14.53, 15.10, 15.53, 16.00, 16.52, 17.01, 17.60, 17.99, 18.41, 19.07], // Note: 18 ratios
      "transferCapacity": [1.081, 1.081, 1.081, 1.081, 0.996, 0.933, 0.922, 0.883, 0.853, 0.758, 0.737, 0.715, 0.693, 0.673, 0.650, 0.636, 0.621, 0.60], // Note: 18 capacities
      "thrust": 220,
      "centerDistance": 722,
      "weight": 5500,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1279x1600x2100",
      "efficiency": 0.97,
       "basePrice": 205000, // From discounts-2022.txt
       "price": 205000,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 192700, // Calculated
       "packagePrice": 192700,
       "marketPrice": 218977.27, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HCW1400", // Found in discounts-2022.txt, other data likely placeholder
      "inputSpeedRange": [1000, 1800], // Placeholder, needs correct data
      "ratios": [10.47, 11.15, 11.5, 12.01, 12.43, 12.96, 13.41, 14.02, 14.53, 15.1, 15.53, 16, 16.52, 17.01, 17.6, 17.99, 18.41, 19.07], // Using HCT1400/2 ratios as placeholder
      "transferCapacity": [1.0],       // Placeholder
      "thrust": 250,                  // Placeholder
      "centerDistance": 700,          // Placeholder
      "weight": 6000,                 // Placeholder
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "-",               // Placeholder
      "efficiency": 0.97,
       "basePrice": 204000, // From discounts-2022.txt
       "price": 204000,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 191760, // Calculated
       "packagePrice": 191760,
       "marketPrice": 217909.09, // Calculated
       "notes": "手控、无罩、高弹、A2型监控 (数据可能不全)" // From OCR Doc 1 P5
    },
    {
      "model": "HC1600",
      "inputSpeedRange": [500, 1650],
      "ratios": [2.03, 2.54, 3.00, 3.50, 4.00],
      "transferCapacity": [1.26, 1.26, 1.26, 1.26, 1.26], // Note: 5 capacities
      "thrust": 170,
      "centerDistance": 415,
      "weight": 3000,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 150000, // From discounts-2022.txt
      "price": 150000,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 141000, // Calculated
      "packagePrice": 141000,
      "marketPrice": 160227.27, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HCD1600",
      "inputSpeedRange": [500, 1650],
      "ratios": [2.97, 3.50, 3.96, 4.48, 4.95, 5.25, 5.58, 5.94],
      "transferCapacity": [1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.12, 1.05], // Note: 8 capacities
      "thrust": 200,
      "centerDistance": 520,
      "weight": 4000,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1291x1620x1590",
      "efficiency": 0.97,
       "basePrice": 165400, // From discounts-2022.txt
       "price": 165400,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 155476, // Calculated
       "packagePrice": 155476,
       "marketPrice": 176677.27, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
    {
      "model": "HCT1600",
      "inputSpeedRange": [500, 1650],
      "ratios": [5.55, 5.97, 6.59, 6.99, 7.44, 7.65, 7.92, 8.46, 9.00, 9.53, 10.17, 10.87, 11.65, 12.52], // Note: 14 ratios
      "transferCapacity": [1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.18, 1.122, 1.06, 0.998, 0.924, 0.867, 0.811], // Note: 14 capacities
      "thrust": 250,
      "centerDistance": 585,
      "weight": 5000,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1246x1500x1750",
      "efficiency": 0.97,
      "basePrice": 194800, // From discounts-2022.txt
      "price": 194800,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 183112, // Calculated
      "packagePrice": 183112,
      "marketPrice": 208081.82, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HCT1600/1",
      "inputSpeedRange": [500, 1650],
      "ratios": [8.02, 8.41, 9.12, 9.58, 10.08, 10.60, 11.20, 12.00, 12.50, 13.43, 14.24, 15.12, 16.10, 16.90], // Note: 14 ratios
      "transferCapacity": [1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.26, 1.218, 1.134, 1.069, 1.007, 0.946, 0.78], // Note: 14 capacities
      "thrust": 270,
      "centerDistance": 680,
      "weight": 5500,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1280x1704x2040",
      "efficiency": 0.97,
       "basePrice": 223000, // From discounts-2022.txt
       "price": 223000,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 209620, // Calculated
       "packagePrice": 209620,
       "marketPrice": 238204.55, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HC2000",
      "inputSpeedRange": [600, 1500],
      "ratios": [1.97, 2.28, 2.52, 3.13, 3.52, 3.91, 4.40, 4.50], // Note: 8 ratios
      "transferCapacity": [1.5800000000000007, 1.538775510204082, 1.5008163265306123, 1.4661224489795919, 1.4346938775510203, 1.4065306122448977, 1.3816326530612244, 1.36], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 190,
      "centerDistance": 450,
      "weight": 3700,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 180000, // From discounts-2022.txt
      "price": 180000,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 169200, // Calculated
      "packagePrice": 169200,
      "marketPrice": 192272.73, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
    {
      "model": "HCD2000",
      "inputSpeedRange": [600, 1500],
      "ratios": [3.00, 3.58, 3.96, 4.45, 4.95, 5.26, 5.43, 5.75, 6.05], // Note: 9 ratios
      "transferCapacity": [1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.57, 1.48, 1.36], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 220,
      "centerDistance": 560,
      "weight": 4200,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1600X1620X1645",
      "efficiency": 0.97,
      "basePrice": 206000, // From discounts-2022.txt
      "price": 206000,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 193640, // Calculated
      "packagePrice": 193640,
      "marketPrice": 220045.45, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HCT2000",
      "inputSpeedRange": [600, 1500],
      "ratios": [5.19, 5.49, 5.94, 6.58, 7.01, 7.48, 7.76, 8.00, 8.57, 8.71, 8.84, 9.05, 9.32, 9.43, 9.643, 10.04, 11.00], // Note: 17 ratios
      "transferCapacity": [1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.55, 1.55, 1.41, 1.38, 1.34, 1.30, 1.287, 1.18], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 270,
      "centerDistance": 625,
      "weight": 5600,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1284x1600x1835",
      "efficiency": 0.97,
       "basePrice": 238000, // From discounts-2022.txt
       "price": 238000,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 223720, // Calculated
       "packagePrice": 223720,
       "marketPrice": 254227.27, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
    {
      "model": "HCT2000/1",
      "inputSpeedRange": [600, 1500],
      "ratios": [6.96, 7.54, 7.94, 8.57, 9.06, 9.59, 10.16, 10.40, 11.11, 11.49, 12.08, 12.42, 12.97, 13.51, 13.92], // Note: 15 ratios
      "transferCapacity": [1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.58, 1.48, 1.43, 1.40, 1.246, 1.18, 1.18, 1.18], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 340,
      "centerDistance": 690,
      "weight": 7000,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1500x1760x1835",
      "efficiency": 0.97,
      "basePrice": 280000, // From discounts-2022.txt
      "price": 280000,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 263200, // Calculated
      "packagePrice": 263200,
      "marketPrice": 299090.91, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HC2700",
      "inputSpeedRange": [500, 1600],
      "ratios": [1.54, 2.03, 2.58, 3.09, 3.48, 3.95, 4.47],
      "transferCapacity": [2.10, 2.10, 2.10, 2.10, 2.10, 2.10, 1.85], // Note: 7 capacities
      "thrust": 270,
      "centerDistance": 490,
      "weight": 4700,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1613x1670x1650",
      "efficiency": 0.97,
       "basePrice": 230000, // From discounts-2022.txt
       "price": 230000,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 216200, // Calculated
       "packagePrice": 216200,
       "marketPrice": 245681.82, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
    {
      "model": "HCD2700",
      "inputSpeedRange": [500, 1600],
      "ratios": [3.65, 4.04, 4.50, 5.05, 5.48, 6.11],
      "transferCapacity": [2.10, 2.10, 2.10, 2.10, 2.01, 1.80], // Note: 6 capacities
      "thrust": 280,
      "centerDistance": 630,
      "weight": 4930,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1400x1780x1530",
      "efficiency": 0.97,
      "basePrice": 280800, // From discounts-2022.txt
      "price": 280800,
      "discountRate": 0.06, // From discounts-2022.txt 下浮6%
      "factoryPrice": 264052.8, // Calculated
      "packagePrice": 264052.8,
      "marketPrice": 300060.00, // Calculated
      "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HCT2700",
      "inputSpeedRange": [500, 1600],
      "ratios": [4.92, 5.43, 6.16, 6.58, 7.03, 7.53, 8.01, 8.54, 9.12, 9.42, 10.05, 10.68, 11.54], // Note: 13 ratios
      "transferCapacity": [2.10, 2.10, 2.10, 2.10, 2.10, 2.10, 2.10, 2.035, 1.906, 1.844, 1.730, 1.627, 1.50], // Note: 13 capacities
      "thrust": 340,
      "centerDistance": 680,
      "weight": 7200,
      "controlType": "推拉软轴/电控/气控",
      "dimensions": "1900x2000x1970",
      "efficiency": 0.97,
       "basePrice": 340000, // From discounts-2022.txt
       "price": 340000,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 319600, // Calculated
       "packagePrice": 319600,
       "marketPrice": 363181.82, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     {
      "model": "HCT2700/1",
      "inputSpeedRange": [500, 1600], // Speed from original data
      "ratios": [7.91, 8.44, 8.84, 9.47, 9.89, 10.55, 11.26, 11.64, 12.41], // Ratios from original data
      "transferCapacity": [2.100, 2.100, 2.100, 2.100, 2.100, 2.035, 1.906, 1.844, 1.730], // Note: 9 capacities
      "thrust": 450, // Thrust from original data
      "centerDistance": 800, // CenterDistance from original data
      "weight": 9000, // Weight from original data
      "controlType": "推拉软轴/电控/气控", // ControlType from original data
      "dimensions": "1900x2250x1950", // Dimensions from original data
      "efficiency": 0.97,
       "basePrice": 390000, // From discounts-2022.txt
       "price": 390000,
       "discountRate": 0.06, // From discounts-2022.txt 下浮6%
       "factoryPrice": 366600, // Calculated
       "packagePrice": 366600,
       "marketPrice": 416590.91, // Calculated
       "notes": "手控、无罩、高弹、A2型监控" // From OCR Doc 1 P5
    },
     // --- HCL 系列 (Based on discounts-2022.txt / OCR P1-3, OCR Doc 1 P5) ---
    {
      "model": "HCL30",
      "inputSpeedRange": [1000, 2000], // Placeholder
      "ratios": [2.0], // Placeholder
      "transferCapacity": [0.1], // Placeholder
      "thrust": 10, // Placeholder
      "centerDistance": null,
      "weight": 100, // Placeholder
      "controlType": "推拉软轴/电控", // Placeholder
      "dimensions": "-", // Placeholder
      "efficiency": 0.97,
       "basePrice": 5320, // From discounts-2022.txt
      "price": 5320,
       "discountRate": 0.12, // From discounts-2022.txt 下浮12%
       "factoryPrice": 4681.6, // From discounts-2022.txt 优惠后价格
       "packagePrice": 4681.6,
       "marketPrice": 5320.00, // Calculated
       "notes": "手控、无罩、齿形块、A1型监控" // From OCR Doc 1 P5
    },
    {
      "model": "HCL100",
      "inputSpeedRange": [1000, 2000], // Placeholder
      "ratios": [2.0], // Placeholder
      "transferCapacity": [0.1], // Placeholder
      "thrust": 10, // Placeholder
      "centerDistance": null,
      "weight": 100, // Placeholder
      "controlType": "推拉软轴/电控", // Placeholder
      "dimensions": "-", // Placeholder
      "efficiency": 0.97,
       "basePrice": 6760, // From discounts-2022.txt
      "price": 6760,
       "discountRate": 0.12, // From discounts-2022.txt 下浮12%
       "factoryPrice": 5948.8, // From discounts-2022.txt 优惠后价格
       "packagePrice": 5948.8,
       "marketPrice": 6760.00, // Calculated
       "notes": "手控、无罩、齿形块、A1型监控" // From OCR Doc 1 P5
    },
    {
      "model": "HCL250", // Note: HCL250 and HCL320 might be typos for HCL250A and HCL320A based on discounts file
      "inputSpeedRange": [1000, 2000], // Placeholder
      "ratios": [2.0], // Placeholder
      "transferCapacity": [0.1], // Placeholder
      "thrust": 10, // Placeholder
      "centerDistance": null,
      "weight": 100, // Placeholder
      "controlType": "推拉软轴/电控", // Placeholder
      "dimensions": "-", // Placeholder
      "efficiency": 0.97,
       "basePrice": 8800, // From discounts-2022.txt
      "price": 8800,
       "discountRate": 0.12, // From discounts-2022.txt 下浮12%
       "factoryPrice": 7744, // From discounts-2022.txt 优惠后价格
       "packagePrice": 7744,
       "marketPrice": 8800.00, // Calculated
       "notes": "手控、无罩、齿形块、A1型监控" // From OCR Doc 1 P5
    },
     { // Added HCL250A based on OCR Doc 1 P5 and discounts-2022.txt
      "model": "HCL250A",
       "inputSpeedRange": [1000, 2000], // Placeholder
       "ratios": [2.0], // Placeholder
       "transferCapacity": [0.1], // Placeholder
       "thrust": 10, // Placeholder
      "centerDistance": null,
       "weight": 100, // Placeholder
       "controlType": "推拉软轴/电控", // Placeholder
       "dimensions": "-", // Placeholder
       "efficiency": 0.97,
       "basePrice": 8800, // From OCR Doc 1 P5 / discounts-2022.txt
      "price": 8800,
       "discountRate": 0.12, // From discounts-2022.txt
       "factoryPrice": 7744, // From discounts-2022.txt
       "packagePrice": 7744,
       "marketPrice": 8800.00, // Calculated
       "notes": "手控、无罩、齿形块、A1型监控" // From OCR Doc 1 P5
     },
    {
      "model": "HCL320", // Note: Likely typo, should be HCL320A
      "inputSpeedRange": [1000, 2000], // Placeholder
      "ratios": [2.0], // Placeholder
      "transferCapacity": [0.1], // Placeholder
      "thrust": 10, // Placeholder
      "centerDistance": null,
      "weight": 100, // Placeholder
      "controlType": "推拉软轴/电控", // Placeholder
      "dimensions": "-", // Placeholder
      "efficiency": 0.97,
       "basePrice": 9100, // From discounts-2022.txt
      "price": 9100,
       "discountRate": 0.12, // From discounts-2022.txt 下浮12%
       "factoryPrice": 8008, // From discounts-2022.txt 优惠后价格
       "packagePrice": 8008,
       "marketPrice": 9100.00, // Calculated
       "notes": "手控、无罩、齿形块、A1型监控" // From OCR Doc 1 P5
    },
     { // Added HCL320A based on OCR Doc 1 P5 and discounts-2022.txt
       "model": "HCL320A",
       "inputSpeedRange": [1000, 2000], // Placeholder
       "ratios": [2.0], // Placeholder
       "transferCapacity": [0.1], // Placeholder
       "thrust": 10, // Placeholder
       "centerDistance": null,
       "weight": 100, // Placeholder
       "controlType": "推拉软轴/电控", // Placeholder
       "dimensions": "-", // Placeholder
       "efficiency": 0.97,
       "basePrice": 9100, // From OCR Doc 1 P5 / discounts-2022.txt
       "price": 9100,
       "discountRate": 0.12, // From discounts-2022.txt
       "factoryPrice": 8008, // From discounts-2022.txt
       "packagePrice": 8008,
       "marketPrice": 9100.00, // Calculated
       "notes": "手控、无罩、齿形块、A1型监控" // From OCR Doc 1 P5
    },
    {
      "model": "HCL600",
      "inputSpeedRange": [1000, 2000], // Placeholder
      "ratios": [2.0], // Placeholder
      "transferCapacity": [0.1], // Placeholder
      "thrust": 10, // Placeholder
      "centerDistance": null,
      "weight": 100, // Placeholder
      "controlType": "推拉软轴/电控", // Placeholder
      "dimensions": "-", // Placeholder
      "efficiency": 0.97,
       "basePrice": 21600, // From discounts-2022.txt
      "price": 21600,
       "discountRate": 0.12, // From discounts-2022.txt 下浮12%
       "factoryPrice": 19008, // From discounts-2022.txt 优惠后价格
       "packagePrice": 19008,
       "marketPrice": 21600.00, // Calculated
       "notes": "电控、无罩、齿形块、A1型监控" // From OCR Doc 1 P5
    },
    // --- Other HC Models (Not in 2022 price lists, keep existing data, set price to 0) ---
    {
      "model": "06", // Was HC06, not in price list
      "inputSpeedRange": [1000, 2100], "ratios": [2.52, 3.05, 3.50], "transferCapacity": [0.004, 0.004, 0.004], "thrust": 1.8, "centerDistance": 124, "weight": 58, "controlType": "手控", "dimensions": "350x316x482", "efficiency": 0.95,
      "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格，折扣率参照HC系列)" // Added default discount
    },
    {
      "model": "16A", // Was HC16A, not in price list
      "inputSpeedRange": [1000, 2500], "ratios": [2.07, 2.48, 2.95, 3.35, 3.83], "transferCapacity": [0.012, 0.012, 0.012, 0.012, 0.012], "thrust": 3.5, "centerDistance": 135, "weight": 84, "controlType": "手控", "dimensions": "422x325x563", "efficiency": 0.96,
      "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格，折扣率参照HC系列)" // Added default discount
    },
     {
      "model": "MA100", // Not in 2022 price list
      "inputSpeedRange": [1500, 3000], "ratios": [1.60, 2.00, 2.55, 3.11, 3.59, 3.88], "transferCapacity": [0.009, 0.009, 0.007, 0.007, 0.006, 0.006], "thrust": 3, "centerDistance": 100, "weight": 75, "controlType": "推拉软轴", "dimensions": "236x390x420", "efficiency": 0.95,
      "basePrice": 0, "price": 0, "factoryPrice": 0, "discountRate": 0.12, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格，折扣率参照MB系列)" // Added default discount
    },
    {
      "model": "MA125", // Not in 2022 price list
      "inputSpeedRange": [1500, 3000], "ratios": [2.03, 2.46, 3.04, 3.57, 4.05, 4.39, 4.70], "transferCapacity": [0.02, 0.02, 0.018, 0.016, 0.014, 0.013, 0.011], "thrust": 5.5, "centerDistance": 125, "weight": 115, "controlType": "推拉软轴", "dimensions": "291x454x485", "efficiency": 0.96,
      "basePrice": 0, "price": 0, "factoryPrice": 0, "discountRate": 0.12, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格，折扣率参照MB系列)" // Added default discount
    },
    {
      "model": "MA142", // Not in 2022 price list
      "inputSpeedRange": [1500, 2500], "ratios": [1.97, 2.52, 3.03, 3.54, 3.95, 4.50, 5.06, 5.47], "transferCapacity": [0.03, 0.03, 0.03, 0.026, 0.023, 0.019, 0.016, 0.013], "thrust": 8.5, "centerDistance": 142, "weight": 140, "controlType": "推拉软轴", "dimensions": "308x520x540", "efficiency": 0.96,
      "basePrice": 0, "price": 0, "factoryPrice": 0, "discountRate": 0.12, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格，折扣率参照MB系列)" // Added default discount
    },
    {
      "model": "HC350-1", // Not in 2022 price list
      "inputSpeedRange": [750, 2500], "ratios": [2.96, 3.48, 3.68, 4.10, 4.42, 5.00], "transferCapacity": [0.26, 0.257, 0.257, 0.223, 0.186, 0.157], "thrust": 50, "centerDistance": 264, "weight": 520, "controlType": "推拉软轴/电控", "dimensions": "604x886x880", "efficiency": 0.97,
      "basePrice": 0, "price": 0, "factoryPrice": 0, "discountRate": 0.16, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格，折扣率参照HC系列)" // Added default discount
    },
    {
      "model": "HCD350", // Not in 2022 price list
      "inputSpeedRange": [750, 2500], "ratios": [4.08, 4.81, 5.55, 5.10, 5.47, 6.20], "transferCapacity": [0.26, 0.245, 0.245, 0.223, 0.186, 0.157], "thrust": 50, "centerDistance": 315, "weight": 590, "controlType": "推拉软轴/电控", "dimensions": "610×915×987", "efficiency": 0.97,
      "basePrice": 0, "price": 0, "factoryPrice": 0, "discountRate": 0.16, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格，折扣率参照HC系列)" // Added default discount
    },
     {
      "model": "HCT650/2", // Not in 2022 price list
      "inputSpeedRange": [1000, 2100], "ratios": [9.51, 10.06, 10.45, 11.03, 11.46, 11.98, 12.52, 13.09, 13.64, 14.10, 14.48, 15.01, 15.55, 15.98, 16.42, 16.97, 17.44, 18.06], "transferCapacity": [0.49, 0.49, 0.483, 0.483, 0.452, 0.452, 0.445, 0.445, 0.414, 0.414, 0.402, 0.389, 0.366, 0.329, 0.320, 0.309, 0.301, 0.290], "thrust": 160, "centerDistance": 550, "weight": 2230, "controlType": "推拉软轴/电控/气控", "dimensions": "966x1224x1515", "efficiency": 0.97,
       "basePrice": 0, "price": 0, "discountRate": 0.12, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (折扣率参照同系列型号)"
    },
    {
      "model": "HC1201", // Not in 2022 price list (Maybe related to HC1200/1 ?)
      "inputSpeedRange": [700, 1500], "ratios": [2.50, 3.00, 3.43, 3.96, 4.17, 4.39, 4.90, 5.47], "transferCapacity": [0.93, 0.93, 0.93, 0.93, 0.93, 0.93, 0.83, 0.73], "thrust": 140, "centerDistance": 450, "weight": 1850, "controlType": "推拉软轴/电控/气控", "dimensions": "963x1300x1290", "efficiency": 0.97,
      "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (折扣率参照同系列型号)" // Added default discount
    },
    {
      "model": "HCT1400/5", // Not in 2022 price list
      "inputSpeedRange": [700, 1800], "ratios": [8.98, 9.47, 10.00, 10.58, 11.20, 11.88, 12.42, 12.96, 13.45, 13.89, 14.36, 14.93], "transferCapacity": [1.035, 1.035, 1.035, 1.035, 1.035, 0.930, 0.930, 0.900, 0.860, 0.833, 0.812, 0.765], "thrust": 190, "centerDistance": 680, "weight": 3850, "controlType": "推拉软轴/电控/气控", "dimensions": "1220x1400x1650", "efficiency": 0.97,
       "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (折扣率参照同系列型号)" // Added default discount
    },
    {
      "model": "HCD1500", // Not in 2022 price list
      "inputSpeedRange": [600, 1900], "ratios": [3.50, 3.83, 4.04, 4.27, 4.32, 4.52], "transferCapacity": [1.2, 1.2, 1.2, 1.2, 1.2, 1.2], "thrust": 175, "centerDistance": 485, "weight": 2800, "controlType": "推拉软轴/电控/气控", "dimensions": "1260X1380X1360", "efficiency": 0.97,
       "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (折扣率参照同系列型号)" // Added default discount
    },
    {
      "model": "26", // Already exists, marked as price 0. Not in 2022 price list
      "inputSpeedRange": [1000, 2500], "ratios": [2.50, 3.00, 3.50, 4.00], "transferCapacity": [0.0199, 0.0199, 0.019, 0.0177], "thrust": 5, "centerDistance": 135, "weight": 92, "controlType": "手控", "dimensions": "473.5x365x830", "efficiency": 0.96,
      "basePrice": 0, "price": 0, "discountRate": 0.16, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (折扣率参照HC系列)" // Added default discount
    }
  ],
  // --- GW 系列 (基于 discounts-2022.txt / OCR P1-3, OCR Doc 1 P6-7, OCR Doc 3 P1) ---
  gwGearboxes: [
    {
      "model": "GWC28.30",
      "inputSpeedRange": [400, 2000], "ratios": [2.06, 2.51, 3.08, 3.54, 4.05, 4.54, 5.09, 5.59, 6.14], "transferCapacity": [0.865, 0.711, 0.578, 0.504, 0.44, 0.393, 0.35, 0.319, 0.29],
      "thrust": 80, "centerDistance": 280, "weight": 1230, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97,
      "basePrice": 72500, // From discounts-2022.txt
      "price": 72500,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 65250, // From discounts-2022.txt 优惠后价格
      "packagePrice": 65250, // From discounts-2022.txt, Also matches OCR Doc 3 P1 (72500 * 0.9 = 65250)
      "marketPrice": 74147.73, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控" // From OCR Doc 1 P6
    },
    {
      "model": "GWC30.32",
      "inputSpeedRange": [400, 2000], "ratios": [2.03, 2.55, 3.04, 3.52, 4.00, 4.55, 5.05, 5.64, 6.05], "transferCapacity": [1.122, 0.894, 0.75, 0.647, 0.57, 0.501, 0.451, 0.404, 0.376],
      "thrust": 100, "centerDistance": 300, "weight": 1460, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97,
      "basePrice": 90800, // From discounts-2022.txt
      "price": 90800,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 81720, // From discounts-2022.txt 优惠后价格
      "packagePrice": 81720, // From discounts-2022.txt, Also matches OCR Doc 3 P1 (90800 * 0.9 = 81720)
      "marketPrice": 92863.64, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控" // From OCR Doc 1 P6
    },
    {
      "model": "GWC32.35",
      "inputSpeedRange": [400, 2000], "ratios": [2.06, 2.54, 3.02, 3.58, 4.05, 4.59, 5.09, 5.57, 6.08], "transferCapacity": [1.4175, 1.1481, 0.9659, 0.8160, 0.7200, 0.6353, 0.5733, 0.5236, 0.4800],
      "thrust": 120, "centerDistance": 320, "weight": 3200, "controlType": "气控/电控", "dimensions": "1238*920*1315", "efficiency": 0.97, // Added Centre Dist and Dims
      "basePrice": 103800, // From discounts-2022.txt
      "price": 103800,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 93420, // From discounts-2022.txt 优惠后价格
      "packagePrice": 93420, // From discounts-2022.txt, Also matches OCR Doc 3 P1 (103800 * 0.9 = 93420)
      "marketPrice": 106159.09, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控" // From OCR Doc 1 P6
    },
    {
      "model": "GWC36.39",
      "inputSpeedRange": [400, 1900], "ratios": [1.97, 2.45, 2.98, 3.47, 3.95, 4.40, 5.01, 5.47, 5.97], "transferCapacity": [1.920, 1.546, 1.272, 1.090, 0.960, 0.862, 0.756, 0.693, 0.634],
      "thrust": 140, "centerDistance": 360, "weight": 2080, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97,
      "basePrice": 123800, // From discounts-2022.txt
      "price": 123800,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 111420, // From discounts-2022.txt 优惠后价格
      "packagePrice": 111420, // From discounts-2022.txt, Also matches OCR Doc 3 P1 (123800 * 0.9 = 111420)
      "marketPrice": 126613.64, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控" // From OCR Doc 1 P6
    },
    {
      "model": "GWC39.41",
      "inputSpeedRange": [400, 1700], "ratios": [1.98, 2.47, 3.05, 3.48, 4.05, 4.48, 5.00, 5.51, 5.99], "transferCapacity": [2.585, 2.068, 1.672, 1.467, 1.260, 1.138, 1.022, 0.927, 0.852],
      "thrust": 175, "centerDistance": 390, "weight": 3980, "controlType": "气控/电控", "dimensions": "1454*1010*1425", "efficiency": 0.97, // Added Centre Dist and Dims
      "basePrice": 153800, // From discounts-2022.txt
      "price": 153800,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 138420, // From discounts-2022.txt 优惠后价格
      "packagePrice": 138420, // From discounts-2022.txt, Also matches OCR Doc 3 P1 (153800 * 0.9 = 138420)
      "marketPrice": 157295.45, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控" // From OCR Doc 1 P6
    },
    {
      "model": "GWC42.45",
      "inputSpeedRange": [400, 1600], "ratios": [2.00, 2.55, 3.02, 3.58, 4.00, 4.47, 5.00, 5.60, 5.93], "transferCapacity": [3.28, 2.577, 2.169, 1.832, 1.640, 1.467, 1.312, 1.171, 1.106],
      "thrust": 220, "centerDistance": 420, "weight": 4700, "controlType": "气控/电控", "dimensions": "1486*1181*1650", "efficiency": 0.97, // Added Centre Dist and Dims
      "basePrice": 185800, // From discounts-2022.txt
      "price": 185800,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 167220, // From discounts-2022.txt 优惠后价格
      "packagePrice": 180000, // From OCR Doc 3 P1 (18 万) - Keep package price if provided.
      "marketPrice": 189909.09, // Market price calculated from factory price
      "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 18 万)" // Added note
    },
    {
      "model": "GWC45.49",
      "inputSpeedRange": [400, 1600], "ratios": [1.97, 2.47, 2.89, 3.47, 3.95, 4.37, 4.85, 5.50, 5.98], "transferCapacity": [4.240, 3.392, 2.890, 2.414, 2.120, 1.913, 1.725, 1.520, 1.398],
      "thrust": 270, "centerDistance": 450, "weight": 5500, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97,
      "basePrice": 275800, // From discounts-2022.txt
      "price": 275800,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 248220, // From discounts-2022.txt 优惠后价格
      "packagePrice": 275000, // From OCR Doc 3 P1 (27.5 万)
      "marketPrice": 282068.18, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 27.5 万)"
    },
    {
      "model": "GWC45.52",
      "inputSpeedRange": [400, 1400], "ratios": [1.97, 2.52, 2.99, 3.47, 4.01, 4.64, 4.98, 5.51, 6.04], "transferCapacity": [4.648, 3.620, 3.055, 2.640, 2.279, 1.970, 1.840, 1.660, 1.510],
      "thrust": 270, "centerDistance": 450, "weight": 6500, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 320000, // From discounts-2022.txt
      "price": 320000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 288000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 330000, // From OCR Doc 3 P1 (33 万)
      "marketPrice": 327272.73, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 33 万)"
    },
    {
      "model": "GWC49.54",
      "inputSpeedRange": [400, 1400], "ratios": [1.94, 2.46, 2.92, 3.45, 3.95, 4.53, 4.91, 5.48, 6.00], "transferCapacity": [5.500, 4.540, 3.827, 3.240, 2.825, 2.462, 2.273, 2.036, 1.861],
      "thrust": 290, "centerDistance": 490, "weight": 7900, "controlType": "气控/电控", "dimensions": "1783*1340*1925", "efficiency": 0.97, // Added Centre Dist and Dims
      "basePrice": 402600, // From discounts-2022.txt
      "price": 402600,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 362340, // From discounts-2022.txt 优惠后价格
      "packagePrice": 385000, // From OCR Doc 3 P1 (38.5 万)
      "marketPrice": 411750.00, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 38.5 万)"
    },
    {
      "model": "GWC49.59",
      "inputSpeedRange": [400, 1200], "ratios": [2.03, 2.49, 3.04, 3.49, 4.00, 4.48, 5.01, 5.51, 6.01], "transferCapacity": [5.550, 5.060, 4.150, 3.620, 3.160, 2.820, 2.520, 2.290, 2.100],
      "thrust": 290, "centerDistance": 490, "weight": 8500, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 460000, // From discounts-2022.txt
      "price": 460000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 414000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 430000, // From OCR Doc 3 P1 (43 万)
      "marketPrice": 470454.55, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 43 万)"
    },
     {
        "model": "GWC49.59A (带 PTO)", // Found in discounts-2022.txt and OCR Doc 3 P1
        "inputSpeedRange": [400, 1200], // Copied from GWC49.59
        "ratios": [2.03, 2.49, 3.04, 3.49, 4.00, 4.48, 5.01, 5.51, 6.01], // Copied from GWC49.59
        "transferCapacity": [5.550, 5.060, 4.150, 3.620, 3.160, 2.820, 2.520, 2.290, 2.100], // Copied from GWC49.59
        "thrust": 290, // Copied from GWC49.59
        "centerDistance": 490, // Copied from GWC49.59
        "weight": 8700, // Assumed slightly heavier with PTO
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 495000, // From discounts-2022.txt
        "price": 495000,
        "discountRate": 0.10, // From discounts-2022.txt 下浮10%
        "factoryPrice": 445500, // From discounts-2022.txt 优惠后价格
        "packagePrice": 445500, // From OCR Doc 3 P1 (44.5 万)
        "marketPrice": 506250.00, // Calculated
        "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 44.5 万)" // Added note
    },
    {
      "model": "GWC52.59", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [400, 1200], "ratios": [1.93, 2.48, 2.96, 3.53, 3.95, 4.43, 4.97, 5.40, 5.93], "transferCapacity": [7.438, 5.797, 4.853, 4.081, 3.640, 3.246, 2.893, 2.663, 2.426],
      "thrust": 300, "centerDistance": 520, "weight": 11000, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 545000, // From discounts-2022.txt
      "price": 545000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 490500, // From discounts-2022.txt 优惠后价格
      "packagePrice": 510000, // From OCR Doc 3 P1 (51 万) - Slightly different from discounted price? Keep package price if provided.
      "marketPrice": 557386.36, // Market price still calculated from factory price
      "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 51 万)" // Added note
    },
    {
        "model": "GWC52.59A (滑动轴承)", // Found in discounts-2022.txt and OCR Doc 3 P1
        "inputSpeedRange": [400, 1200], // Copied from GWC52.59
        "ratios": [1.93, 2.48, 2.96, 3.53, 3.95, 4.43, 4.97, 5.40, 5.93], // Copied from GWC52.59
        "transferCapacity": [7.438, 5.797, 4.853, 4.081, 3.640, 3.246, 2.893, 2.663, 2.426], // Copied from GWC52.59
        "thrust": 300, // Copied from GWC52.59
        "centerDistance": 520, // Copied from GWC52.59
        "weight": 11200, // Assumed slightly heavier
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 575000, // From discounts-2022.txt
      "price": 575000,
        "discountRate": 0.10, // From discounts-2022.txt 下浮10%
        "factoryPrice": 517500, // From discounts-2022.txt 优惠后价格
        "packagePrice": 517500, // From OCR Doc 3 P1 (51.75 万)
        "marketPrice": 588068.18, // Calculated
        "notes": "电控或气控、无罩、无飞轮、监控仪 (滑动轴承, 打包价 51.75 万)" // Added note
    },
   // Continuing the GWC gearboxes data...
    {
      "model": "GWC52.62", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [400, 1200], "ratios": [2.02, 2.46, 3.02, 3.45, 4.06, 4.52, 5.04, 5.46, 5.96, 6.49, 6.94], "transferCapacity": [7.756, 6.353, 5.180, 4.534, 3.852, 3.458, 3.102, 2.867, 2.631, 2.410, 2.254],
      "thrust": 300, "centerDistance": 620, "weight": 10700, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 575000, // From discounts-2022.txt
      "price": 575000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 517500, // From discounts-2022.txt 优惠后价格
      "packagePrice": 517500, // From OCR Doc 3 P1 (51.75 万)
      "marketPrice": 588068.18, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 51.75 万)" // Added note
    },
     {
      "model": "GWC60.66", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [400, 1200], "ratios": [2.01, 2.50, 3.07, 3.57, 3.95, 4.49, 5.04, 5.51, 6.04, 6.50, 6.94], "transferCapacity": [9.913, 7.982, 6.492, 5.581, 4.923, 4.448, 3.927, 3.622, 3.261, 3.060, 3.000],
      "thrust": 450, "centerDistance": 600, "weight": 14500, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97,
      "basePrice": 800000, // From discounts-2022.txt
      "price": 800000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 720000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 720000, // From OCR Doc 3 P1 (72 万)
      "marketPrice": 818181.82, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 72 万)"
    },
     {
        "model": "GWC60.66A (滑动轴承)", // Found in discounts-2022.txt and OCR Doc 3 P1
        "inputSpeedRange": [400, 1200], // Copied GWC60.66
        "ratios": [2.01, 2.50, 3.07, 3.57, 3.95, 4.49, 5.04, 5.51, 6.04, 6.50, 6.94], // Copied GWC60.66
        "transferCapacity": [9.913, 7.982, 6.492, 5.581, 4.923, 4.448, 3.927, 3.622, 3.261, 3.060, 3.000], // Copied GWC60.66
        "thrust": 450, // Copied GWC60.66
        "centerDistance": 600, // Copied GWC60.66
        "weight": 14700, // Assumed slightly heavier with PTO
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 830000, // From discounts-2022.txt
        "price": 830000,
        "discountRate": 0.10, // From discounts-2022.txt 下浮10%
        "factoryPrice": 747000, // From discounts-2022.txt 优惠后价格
        "packagePrice": 747000, // From OCR Doc 3 P1 (74.7 万)
        "marketPrice": 848863.64, // Calculated
        "notes": "电控或气控、无罩、无飞轮、监控仪 (滑动轴承, 打包价 74.7 万)" // Added note
    },
    {
      "model": "GWC60.74", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [400, 1200], "ratios": [1.99, 2.53, 3.06, 3.51, 4.02, 4.50, 5.04, 5.51, 6.04, 6.50, 6.94], "transferCapacity": [9.9130, 8.3641, 7.4347, 6.8628, 6.3726, 5.0500, 4.5128, 4.1224, 3.7627, 3.4962, 3.3750], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 540, "centerDistance": 740, "weight": 18000, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 920000, // From discounts-2022.txt
      "price": 920000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 828000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 828000, // From OCR Doc 3 P1 (82.8 万)
      "marketPrice": 940909.09, // Calculated
      "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 82.8 万)"
    },
     {
        "model": "GWC60.74B (带 PTO)", // Found in discounts-2022.txt and OCR Doc 3 P1
        "inputSpeedRange": [400, 1200], // Copied GWC60.74
        "ratios": [1.99, 2.53, 3.06, 3.51, 4.02, 4.50, 5.04, 5.51, 6.04, 6.50, 6.94], // Copied GWC60.74
        "transferCapacity": [9.9130, 8.3641, 7.4347, 6.8628, 6.3726, 5.0500, 4.5128, 4.1224, 3.7627, 3.4962, 3.3750], // Copied GWC60.74
        "thrust": 540, // Copied GWC60.74
        "centerDistance": 740, // Copied GWC60.74
        "weight": 18300, // Assumed slightly heavier
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 1010000, // From discounts-2022.txt
        "price": 1010000,
        "discountRate": 0.10, // From discounts-2022.txt 下浮10%
        "factoryPrice": 909000, // From discounts-2022.txt 优惠后价格
        "packagePrice": 909000, // From OCR Doc 3 P1 (90.9 万)
        "marketPrice": 1032954.55, // Calculated
        "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 90.9 万)" // Added note
    },
    {
      "model": "GWC63.71", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [300, 1200], "ratios": [2.01, 2.51, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], "transferCapacity": [12.230, 9.800, 8.117, 7.135, 6.000, 5.411, 4.888, 4.500, 4.137, 3.800, 3.541, 3.294], // Note: 12 capacities
      "thrust": 710, "centerDistance": 630, "weight": 17500, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 950000, // From discounts-2022.txt
      "price": 950000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 855000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 860000, // From OCR Doc 3 P1 (86 万) - Keep package price if provided.
      "marketPrice": 971590.91, // Market price still calculated from factory price
      "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 86 万)" // Added note
    },
     {
        "model": "GWC63.71 (带 PTO)", // Found in discounts-2022.txt and OCR Doc 3 P1
        "inputSpeedRange": [300, 1200], // Copied GWC63.71
        "ratios": [2.01, 2.51, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], // Copied GWC63.71
        "transferCapacity": [12.230, 9.800, 8.117, 7.135, 6.000, 5.411, 4.888, 4.500, 4.137, 3.800, 3.541, 3.294], // Copied GWC63.71
        "thrust": 710, // Copied GWC63.71
        "centerDistance": 630, // Copied GWC63.71
        "weight": 17800, // Assumed slightly heavier
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 1030000, // From discounts-2022.txt
        "price": 1030000,
        "discountRate": 0.10, // From discounts-2022.txt 下浮10%
        "factoryPrice": 927000, // From discounts-2022.txt 优惠后价格
        "packagePrice": 927000, // From OCR Doc 3 P1 (92.7 万)
        "marketPrice": 1053409.09, // Calculated
        "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 92.7 万)" // Added note
    },
    {
      "model": "GWC66.75", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [300, 1200], "ratios": [2.02, 2.50, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], "transferCapacity": [14.530, 11.680, 9.730, 8.530, 7.190, 6.490, 5.860, 5.390, 4.950, 4.550, 4.250, 3.950], // Note: 12 capacities
      "thrust": 800, "centerDistance": 660, "weight": 21000, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 1050000, // From discounts-2022.txt
      "price": 1050000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 945000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 960000, // From OCR Doc 3 P1 (96 万)
      "marketPrice": 1073863.64, // Calculated
      "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 96 万)" // Added note
    },
    {
      "model": "GWC70.76", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [300, 1200], "ratios": [2.02, 2.50, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], "transferCapacity": [17.100, 13.730, 11.390, 10.010, 8.440, 7.610, 6.880, 6.330, 5.810, 5.340, 4.990, 4.640], // Note: 12 capacities
      "thrust": 950, "centerDistance": 700, "weight": 23000, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 1100000, // From discounts-2022.txt
      "price": 1100000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 990000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 1050000, // From OCR Doc 3 P1 (105 万)
      "marketPrice": 1125000.00, // Calculated
      "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 105 万)" // Added note
    },
     {
        "model": "GWC70.76C (带 PTO)", // Found in discounts-2022.txt and OCR Doc 3 P1
        "inputSpeedRange": [300, 1200], // Copied GWC70.76
        "ratios": [2.02, 2.50, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], // Copied GWC70.76
        "transferCapacity": [17.100, 13.730, 11.390, 10.010, 8.440, 7.610, 6.880, 6.330, 5.810, 5.340, 4.990, 4.640], // Copied GWC70.76
        "thrust": 950, // Copied GWC70.76
        "centerDistance": 700, // Copied GWC70.76
        "weight": 23300, // Assumed slightly heavier
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 1150000, // From discounts-2022.txt
        "price": 1150000,
        "discountRate": 0.10, // From discounts-2022.txt 下浮10%
        "factoryPrice": 1035000, // From discounts-2022.txt 优惠后价格
        "packagePrice": 1035000, // From OCR Doc 3 P1 (103.5 万)
        "marketPrice": 1176136.36, // Calculated
        "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 103.5 万)" // Added note
    },
    {
      "model": "GWC70.85", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [300, 1000], "ratios": [2.02, 2.50, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], "transferCapacity": [21.00, 16.88, 13.98, 12.31, 10.37, 9.35, 8.46, 7.78, 7.14, 6.56, 6.12, 5.68], // Note: 12 capacities
      "thrust": 1100, "centerDistance": 850, "weight": 29000, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 1620000, // From discounts-2022.txt
      "price": 1620000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 1458000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 1420000, // From OCR Doc 3 P1 (142 万) - Lower than discounted price? Keep package price if provided.
      "marketPrice": 1656818.18, // Market price still calculated from factory price
      "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 142 万)" // Added note
    },
     {
        "model": "GWC70.85A (带 PTO)", // Found in discounts-2022.txt and OCR Doc 3 P1
        "inputSpeedRange": [300, 1000], // Copied GWC70.85
        "ratios": [2.02, 2.50, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], // Copied GWC70.85
        "transferCapacity": [21.00, 16.88, 13.98, 12.31, 10.37, 9.35, 8.46, 7.78, 7.14, 6.56, 6.12, 5.68], // Copied GWC70.85
        "thrust": 1100, // Copied GWC70.85
        "centerDistance": 850, // Copied GWC70.85
        "weight": 29300, // Assumed slightly heavier
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 1670000, // From discounts-2022.txt
        "price": 1670000,
        "discountRate": 0.10, // From discounts-2022.txt 下浮10%
        "factoryPrice": 1503000, // From discounts-2022.txt 优惠后价格
        "packagePrice": 1503000, // From OCR Doc 3 P1 (150.3 万)
        "marketPrice": 1707954.55, // Calculated
        "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 150.3 万)" // Added note
    },
    {
      "model": "GWC75.90", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [300, 1000], "ratios": [2.02, 2.50, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], "transferCapacity": [24.00, 19.30, 16.00, 14.05, 11.85, 10.69, 9.67, 8.88, 8.17, 7.51, 7.01, 6.51], // Note: 12 capacities
      "thrust": 1250, "centerDistance": 900, "weight": 33000, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 1800000, // From discounts-2022.txt
      "price": 1800000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 1620000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 1490000, // From OCR Doc 3 P1 (149 万) - Lower than discounted price? Keep package price if provided.
      "marketPrice": 1840909.09, // Market price still calculated from factory price
      "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 149 万)" // Added note
    },
     {
        "model": "GWC75.90 (带 PTO)", // Found in discounts-2022.txt and OCR Doc 3 P1
        "inputSpeedRange": [300, 1000], // Copied GWC75.90
        "ratios": [2.02, 2.50, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], // Copied GWC75.90
        "transferCapacity": [24.00, 19.30, 16.00, 14.05, 11.85, 10.69, 9.67, 8.88, 8.17, 7.51, 7.01, 6.51], // Copied GWC75.90
        "thrust": 1250, // Copied GWC75.90
        "centerDistance": 900, // Copied GWC75.90
        "weight": 33300, // Assumed slightly heavier
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 1850000, // From discounts-2022.txt
        "price": 1850000,
        "discountRate": 0.10, // From discounts-2022.txt 下浮10%
        "factoryPrice": 1665000, // From discounts-2022.txt 优惠后价格
        "packagePrice": 1665000, // From OCR Doc 3 P1 (166.5 万)
        "marketPrice": 1892045.45, // Calculated
        "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 166.5 万)" // Added note
    },
    {
      "model": "GWC78.88", // Found in discounts-2022.txt and OCR Doc 3 P1
      "inputSpeedRange": [300, 1000], "ratios": [2.02, 2.50, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], "transferCapacity": [24.00, 19.30, 16.00, 14.05, 11.85, 10.69, 9.67, 8.88, 8.17, 7.51, 7.01, 6.51], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 1250, "centerDistance": 900, "weight": 33000, "controlType": "气控/电控", "dimensions": "-", "efficiency": 0.97, // Added Centre Dist
      "basePrice": 1670000, // From discounts-2022.txt
      "price": 1670000,
      "discountRate": 0.10, // From discounts-2022.txt 下浮10%
      "factoryPrice": 1503000, // From discounts-2022.txt 优惠后价格
      "packagePrice": 1520000, // From OCR Doc 3 P1 (152 万)
      "marketPrice": 1707954.55, // Calculated
      "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 152 万)" // Added note
    },
     {
        "model": "GWC78.88A (带 PTO)", // Found in discounts-2022.txt and OCR Doc 3 P1
        "inputSpeedRange": [300, 1000], // Copied GWC78.88
        "ratios": [2.02, 2.50, 3.03, 3.45, 4.11, 4.55, 5.04, 5.47, 5.95, 6.48, 6.96, 7.48], // Copied GWC78.88
        "transferCapacity": [24.00, 19.30, 16.00, 14.05, 11.85, 10.69, 9.67, 8.88, 8.17, 7.51, 7.01, 6.51], // Copied GWC78.88
        "thrust": 1250, // Copied GWC78.88
        "centerDistance": 900, // Copied GWC78.88
        "weight": 33300, // Assumed slightly heavier
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 1740000, // From discounts-2022.txt
        "price": 1740000,
        "discountRate": 0.10, // From discounts-2022.txt 下浮10%
        "factoryPrice": 1566000, // From discounts-2022.txt 优惠后价格
        "packagePrice": 1566000, // From OCR Doc 3 P1 (156.6 万)
        "marketPrice": 1779545.45, // Calculated
        "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 156.6 万)" // Added note
    },
     {
        "model": "GWC78.96", // Found only in OCR Doc 3 P1 package list
        "inputSpeedRange": [300, 1000], // Placeholder, needs data
        "ratios": [2.02, 2.5], // Placeholder
        "transferCapacity": [24], // Placeholder
        "thrust": 1250, // Placeholder
        "centerDistance": 960, // Placeholder
        "weight": 34000, // Placeholder
        "controlType": "气控/电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 0, // Not in discount list
        "price": 0,
        "discountRate": 0.10, // Assumed 10% like other GWC
        "factoryPrice": 0, // Not in discount list
        "packagePrice": 1630000, // From OCR Doc 3 P1 (163 万)
        "marketPrice": 0, // Cannot calculate market price without factory price
        "notes": "打包价 163 万 (其他参数及基础价格未在价格表中找到)" // Added note
     },
    {
      "model": "2GWH1060", // Not in 2022 price lists provided, keep existing data
      "inputSpeedRange": [400, 2000],
      "ratios": [2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6], // Note: 9 ratios
      "transferCapacity": [1.12],       // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 175,
      "standardCenterDistance": 1460,
      "weight": 14500,
      "controlType": "双机并车",
      "efficiency": 0.97,
      "basePrice": 850000, // Old price
      "price": 850000,
      "discountRate": 0.1, // Old discount
      "factoryPrice": 765000, // Old factory price
      "packagePrice": 765000, // Old package price
      "marketPrice": 869318.18, // Recalculated based on old factory price
      "dimensions": "-",
      "notes": "未在2022价格表中找到 (旧价格)"
    },
     {
        "model": "SGW39.41", // Found on OCR Doc 1 P7. Assumed related to GWC39.41
        "inputSpeedRange": [400, 1700], // Copied GWC39.41
        "ratios": [1.98, 2.47, 3.05, 3.48, 4.05, 4.48, 5.00, 5.51, 5.99], // Copied GWC39.41
        "transferCapacity": [2.585, 2.068, 1.672, 1.467, 1.260, 1.138, 1.022, 0.927, 0.852], // Note: 9 capacities
        "thrust": 175, // Copied GWC39.41
        "centerDistance": 390, // Copied GWC39.41
        "weight": 3980, // Copied GWC39.41
        "controlType": "气控/电控",
        "dimensions": "1454*1010*1425",
        "efficiency": 0.97,
        "basePrice": 245000, // From OCR Doc 1 P7
        "price": 245000,
        "discountRate": 0.10, // From OCR Doc 1 P7 下浮10%
        "factoryPrice": 220500, // Calculated
        "packagePrice": 220500,
        "marketPrice": 250568.18, // Calculated
        "notes": "电控或气控、无罩、无飞轮、B1型监控" // From OCR Doc 1 P7
     },
     {
        "model": "SGW42.45", // Found on OCR Doc 1 P7. Assumed related to GWC42.45
        "inputSpeedRange": [400, 1600], // Copied GWC42.45
        "ratios": [2.00, 2.55, 3.02, 3.58, 4.00, 4.47, 5.00, 5.60, 5.93], // Copied GWC42.45
        "transferCapacity": [3.28, 2.577, 2.169, 1.832, 1.640, 1.467, 1.312, 1.171, 1.106], // Note: 9 capacities
        "thrust": 220, // Copied GWC42.45
        "centerDistance": 420, // Copied GWC42.45
        "weight": 4700, // Copied GWC42.45
        "controlType": "气控/电控",
        "dimensions": "1486*1181*1650",
        "efficiency": 0.97,
        "basePrice": 273000, // From OCR Doc 1 P7
        "price": 273000,
        "discountRate": 0.10, // From OCR Doc 1 P7 下浮10%
        "factoryPrice": 245700, // Calculated
        "packagePrice": 245700,
        "marketPrice": 279204.55, // Calculated
        "notes": "电控或气控、无罩、无飞轮、B1型监控" // From OCR Doc 1 P7
     },
     {
        "model": "SGW49.54", // Found on OCR Doc 1 P7. Assumed related to GWC49.54
        "inputSpeedRange": [400, 1400], "ratios": [1.94, 2.46, 2.92, 3.45, 3.95, 4.53, 4.91, 5.48, 6.00], "transferCapacity": [5.500, 4.540, 3.827, 3.240, 2.825, 2.462, 2.273, 2.036, 1.861], // Note: 9 capacities
        "thrust": 290, "centerDistance": 490, "weight": 7900, "controlType": "气控/电控", "dimensions": "1783*1340*1925", "efficiency": 0.97,
        "basePrice": 520000, // From OCR Doc 1 P7
        "price": 520000,
        "discountRate": 0.10, // From OCR Doc 1 P7 下浮10%
        "factoryPrice": 468000, // Calculated
        "packagePrice": 468000,
        "marketPrice": 531818.18, // Calculated
        "notes": "电控或气控、无罩、无飞轮、B1型监控" // From OCR Doc 1 P7
     }
  ],
   // --- HCM 系列 (基于 OCR Doc 1 P8-9 全国统一售价) ---
   hcmGearboxes: [
       // 价格已包含全国统一售价的特点 (base=price=factory=package=market)
       {
           "model": "HCM70",
           "inputSpeedRange": [1500, 3000],
           "ratios": [1.60, 2.00, 2.55, 3.11, 3.59, 3.88], // Note: 6 ratios
           "transferCapacity": [0.009, 0.009, 0.007, 0.007, 0.006, 0.006], // Note: 6 capacities
           "thrust": 3,
           "centerDistance": 100,
           "weight": 75,
           "controlType": "电控",
           "dimensions": "236x390x420", // Note: Same as old 16A? Needs verification
           "efficiency": 0.95,
           "basePrice": 10200, // 全国统一售价
           "price": 10200,
           "discountRate": 0,
           "factoryPrice": 10200,
           "packagePrice": 10200,
           "marketPrice": 10200,
           "notes": "全国统一售价"
       },
       {
           "model": "HCM160",
           "inputSpeedRange": [1500, 3000],
           "ratios": [2.03, 2.46, 3.04, 3.57, 4.05, 4.39, 4.70], // Note: 7 ratios
           "transferCapacity": [0.02, 0.02, 0.018, 0.016, 0.014, 0.013, 0.011], // Note: 7 capacities
           "thrust": 5.5,
           "centerDistance": 125,
           "weight": 115,
           "controlType": "电控",
           "dimensions": "291x454x485",
           "efficiency": 0.96,
           "basePrice": 14400, // 全国统一售价
           "price": 14400,
           "discountRate": 0,
           "factoryPrice": 14400,
           "packagePrice": 14400,
           "marketPrice": 14400,
           "notes": "全国统一售价"
       },
       {
           "model": "HCM250",
           "inputSpeedRange": [1500, 2500],
           "ratios": [1.97, 2.52, 3.03, 3.54, 3.95, 4.50, 5.06, 5.47], // Note: 8 ratios
           "transferCapacity": [0.03, 0.03, 0.03, 0.026, 0.023, 0.019, 0.016, 0.013], // Note: 8 capacities
           "thrust": 8.5,
           "centerDistance": 142,
           "weight": 140,
           "controlType": "电控",
           "dimensions": "308x520x540",
           "efficiency": 0.96,
           "basePrice": 17800, // 全国统一售价
           "price": 17800,
           "discountRate": 0,
           "factoryPrice": 17800,
           "packagePrice": 17800,
           "marketPrice": 17800,
           "notes": "全国统一售价"
       },
       {
           "model": "HCM435",
           "inputSpeedRange": [1000, 2500],
           "ratios": [1.97, 2.52, 3.04, 3.52, 3.95, 4.53, 5.12, 5.56, 5.88], // Note: 9 ratios
           "transferCapacity": [0.053, 0.053, 0.053, 0.053, 0.053, 0.053, 0.05, 0.047, 0.037], // Note: 9 capacities
           "thrust": 15,
           "centerDistance": 180,
           "weight": 240,
           "controlType": "电控/气控",
           "dimensions": "442x774x763", // Note: Likely typo, same as MB242? Needs verification
           "efficiency": 0.97,
           "basePrice": 23600, // 全国统一售价
           "price": 23600,
           "discountRate": 0,
           "factoryPrice": 23600,
           "packagePrice": 23600,
           "marketPrice": 23600,
           "notes": "全国统一售价"
       },
       {
           "model": "HCM600",
           "inputSpeedRange": [1000, 2100],
           "ratios": [2.00, 2.48, 2.63, 3.00, 3.58, 3.89], // Note: 6 ratios
           "transferCapacity": [0.065, 0.065, 0.065, 0.065, 0.065, 0.065], // Note: 6 capacities
           "thrust": 20,
           "centerDistance": 190,
           "weight": 280,
           "controlType": "电控/气控",
           "dimensions": "-", // Missing dimensions
           "efficiency": 0.97,
           "basePrice": 32000, // 全国统一售价
           "price": 32000,
           "discountRate": 0,
           "factoryPrice": 32000,
           "packagePrice": 32000,
           "marketPrice": 32000,
           "notes": "全国统一售价"
       },
       {
           "model": "HCM1250",
           "inputSpeedRange": [600, 1900],
           "ratios": [1.60, 2.03, 2.48, 2.50, 2.96, 3.18, 3.33, 3.55, 3.79, 4.06, 4.20, 4.47], // Note: 12 ratios
           "transferCapacity": [0.158, 0.158, 0.158, 0.158, 0.158, 0.158, 0.158, 0.158, 0.158, 0.158, 0.158, 0.158], // Note: Capacity array length mismatch, will be fixed by repair
           "thrust": 45,
           "centerDistance": 220,
           "weight": 420,
           "controlType": "电控/气控",
           "dimensions": "-", // Missing dimensions
           "efficiency": 0.97,
           "basePrice": 60000, // 全国统一售价
           "price": 60000,
           "discountRate": 0,
           "factoryPrice": 60000,
           "packagePrice": 60000,
           "marketPrice": 60000,
           "notes": "全国统一售价"
       },
       {
           "model": "HCM1600",
           "inputSpeedRange": [500, 1650],
           "ratios": [2.03, 2.54, 3.00, 3.50, 4.00], // Note: 5 ratios
           "transferCapacity": [0.19, 0.19, 0.19, 0.19, 0.19], // Note: 5 capacities
           "thrust": 60,
           "centerDistance": 245,
           "weight": 500,
           "controlType": "电控/气控",
           "dimensions": "-", // Missing dimensions
           "efficiency": 0.97,
           "basePrice": 72000, // 全国统一售价
           "price": 72000,
           "discountRate": 0,
           "factoryPrice": 72000,
           "packagePrice": 72000,
           "marketPrice": 72000,
           "notes": "全国统一售价"
       },
       {
           "model": "HCM2400", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [750, 1500],
            "ratios": [1.52, 2.04, 2.43, 2.90, 3.48, 4.00, 4.45, 5.00, 5.35, 5.50, 5.96], // Note: 11 ratios
            "transferCapacity": [0.28057, 0.27935, 0.27802, 0.27659, 0.27505, 0.27342, 0.27168, 0.26984, 0.26790, 0.26586, 0.26372], // Note: 11 capacities
            "thrust": 80,
            "centerDistance": 270,
            "weight": 650,
           "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
       },
        {
           "model": "HCM3400", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
           "inputSpeedRange": [750, 1500],
           "ratios": [1.50, 2.03, 2.48, 2.96, 3.57, 4.05, 4.52, 4.99, 5.50, 5.94], // Note: 10 ratios
           "transferCapacity": [0.3869, 0.3783, 0.3697, 0.3610, 0.3520, 0.3426, 0.3328, 0.3226, 0.3119, 0.3008], // Note: Capacity array length mismatch, will be fixed by repair
           "thrust": 100,
           "centerDistance": 290,
           "weight": 800,
            "controlType": "电控",
           "dimensions": "-",
           "efficiency": 0.97,
           "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
       }
   ],
  // --- DT 系列 (基于 discounts-2022.txt / OCR P1-3, OCR P4-5) ---
  dtGearboxes: [
    {
      "model": "DT180",
      "inputSpeedRange": [750, 1500],
      "ratios": [1.53, 2.03, 2.50, 2.96, 3.54, 3.96, 4.48, 4.96, 5.52, 5.98],
      "transferCapacity": [0.0801, 0.0699, 0.0606, 0.0520, 0.0442, 0.0373, 0.0311, 0.0257, 0.0211, 0.0173], // Note: 10 capacities
      "thrust": 14.7,
      "centerDistance": 142,
      "weight": 130,
      "controlType": "电控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 23000, // From discounts-2022.txt / OCR P4
      "price": 23000,
      "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
      "factoryPrice": 20700, // From discounts-2022.txt / OCR P5 优惠后价格
      "packagePrice": 20700,
      "marketPrice": 23522.73, // Calculated
      "notes": "标准配置" // From OCR P4
    },
    {
        "model": "DT210",
        "inputSpeedRange": [750, 1500], // Placeholder
        "ratios": [1.5, 2.0, 2.5, 3.0], // Placeholder
        "transferCapacity": [0.12], // Placeholder
        "thrust": 20, // Placeholder
        "centerDistance": 150, // Placeholder
        "weight": 180, // Placeholder
      "controlType": "电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 35000, // From discounts-2022.txt / OCR P4
        "price": 35000,
        "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
        "factoryPrice": 31500, // From discounts-2022.txt / OCR P5 优惠后价格
        "packagePrice": 31500,
        "marketPrice": 35795.45, // Calculated
        "notes": "标准配置" // From OCR P4
    },
    {
      "model": "DT240",
      "inputSpeedRange": [750, 1500],
      "ratios": [1.53, 2.03, 2.50, 2.96, 3.55, 4.00, 4.53, 5.05],
      "transferCapacity": [0.1705, 0.1398, 0.1119, 0.0868, 0.0644, 0.0448, 0.0280, 0.0139], // Note: 8 capacities
      "thrust": 30,
      "centerDistance": 165,
      "weight": 240,
      "controlType": "电控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 39000, // From discounts-2022.txt / OCR P4
      "price": 39000,
      "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
      "factoryPrice": 35100, // From discounts-2022.txt / OCR P5 优惠后价格
      "packagePrice": 35100,
      "marketPrice": 39886.36, // Calculated
      "notes": "标准配置" // From OCR P4
    },
     {
        "model": "DT280",
        "inputSpeedRange": [750, 1500], // Placeholder
        "ratios": [1.5, 2.0, 2.5, 3.0], // Placeholder
        "transferCapacity": [0.18], // Placeholder
        "thrust": 35, // Placeholder
        "centerDistance": 180, // Placeholder
        "weight": 300, // Placeholder
      "controlType": "电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 45000, // From discounts-2022.txt / OCR P4
        "price": 45000,
        "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
        "factoryPrice": 40500, // From discounts-2022.txt / OCR P5 优惠后价格
        "packagePrice": 40500,
        "marketPrice": 46022.73, // Calculated
        "notes": "标准配置" // From OCR P4
    },
    {
      "model": "DT580",
      "inputSpeedRange": [750, 1500],
      "ratios": [1.46, 2.05, 2.55, 2.95, 3.48, 3.96, 4.52, 4.94, 5.41, 5.83],
      "transferCapacity": [0.336, 0.270, 0.250, 0.210, 0.160, 0.140, 0.123, 0.112, 0.102, 0.086], // Note: 10 capacities
      "thrust": 40,
      "centerDistance": 203,
      "weight": 370,
      "controlType": "电控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 52000, // From discounts-2022.txt / OCR P4
      "price": 52000,
      "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
      "factoryPrice": 46800, // From discounts-2022.txt / OCR P5 优惠后价格
      "packagePrice": 46800,
      "marketPrice": 53181.82, // Calculated
      "notes": "标准配置" // From OCR P4
    },
    {
      "model": "DT770",
      "inputSpeedRange": [750, 1500],
      "ratios": [1.54, 1.96, 2.50, 3.05, 3.47, 3.95, 4.57, 5.10, 5.62, 5.98],
      "transferCapacity": [0.48, 0.443, 0.400, 0.327, 0.283, 0.214, 0.186, 0.166, 0.134, 0.106], // Note: 10 capacities
      "thrust": 50,
      "centerDistance": 220,
      "weight": 480,
      "controlType": "电控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 58000, // From discounts-2022.txt / OCR P4
      "price": 58000,
      "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
      "factoryPrice": 52200, // From discounts-2022.txt / OCR P5 优惠后价格
      "packagePrice": 52200,
      "marketPrice": 59318.18, // Calculated
      "notes": "标准配置" // From OCR P4
    },
    {
      "model": "DT900",
      "inputSpeedRange": [750, 1500],
      "ratios": [1.50, 2.03, 2.48, 2.96, 3.57, 4.05, 4.52, 4.99, 5.50, 5.94],
      "transferCapacity": [0.6269, 0.5483, 0.4757, 0.4089, 0.3480, 0.2930, 0.2439, 0.2008, 0.1635, 0.1321], // Note: 10 capacities
      "thrust": 60,
      "centerDistance": 264,
      "weight": 700,
      "controlType": "电控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 63000, // From discounts-2022.txt / OCR P4
      "price": 63000,
      "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
      "factoryPrice": 56700, // From discounts-2022.txt / OCR P5 优惠后价格
      "packagePrice": 56700,
      "marketPrice": 64431.82, // Calculated
      "notes": "标准配置" // From OCR P4
    },
    {
      "model": "DT1400",
      "inputSpeedRange": [750, 1500],
      "ratios": [1.47, 1.96, 2.48, 3.04, 3.44, 4.09, 4.44, 4.95, 5.53, 6.08],
      "transferCapacity": [0.80, 0.77, 0.663, 0.566, 0.519, 0.451, 0.416, 0.333, 0.300, 0.272], // Note: 10 capacities
      "thrust": 90,
      "centerDistance": 290,
      "weight": 900,
      "controlType": "电控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 100000, // From discounts-2022.txt / OCR P4
      "price": 100000,
      "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
      "factoryPrice": 90000, // From discounts-2022.txt / OCR P5 优惠后价格
      "packagePrice": 90000,
      "marketPrice": 102272.73, // Calculated
      "notes": "标准配置" // From OCR P4
    },
    {
      "model": "DT1500",
      "inputSpeedRange": [750, 1500],
      "ratios": [1.54, 1.96, 2.52, 3.05, 3.47, 3.95, 4.45, 5.00, 5.49, 6.03],
      "transferCapacity": [1.125, 0.967, 0.813, 0.713, 0.637, 0.537, 0.410, 0.313, 0.285, 0.259], // Note: 10 capacities
      "thrust": 100,
      "centerDistance": 310,
      "weight": 1100,
      "controlType": "电控",
      "dimensions": "-",
      "efficiency": 0.97,
      "basePrice": 120000, // From discounts-2022.txt / OCR P4
      "price": 120000,
      "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
      "factoryPrice": 108000, // From discounts-2022.txt / OCR P5 优惠后价格
      "packagePrice": 108000,
      "marketPrice": 122727.27, // Calculated
      "notes": "标准配置" // From OCR P4
    },
     {
      "model": "DT2400",
      "inputSpeedRange": [750, 1500],
      "ratios": [1.52, 2.04, 2.43, 2.90, 3.48, 4.00, 4.45, 5.00, 5.35, 5.50, 5.96], // Note: 11 ratios
      "transferCapacity": [1.466], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 110,
      "centerDistance": 340,
      "weight": 1430,
      "controlType": "电控",
      "dimensions": "-", // Add dimensions if known
      "efficiency": 0.97,
       "basePrice": 155000, // From discounts-2022.txt / OCR P4
       "price": 155000,
       "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
       "factoryPrice": 139500, // From discounts-2022.txt / OCR P5 优惠后价格
       "packagePrice": 139500,
       "marketPrice": 158522.73, // Calculated
       "notes": "标准配置" // From OCR P4
    },
    {
        "model": "DT4300",
        "inputSpeedRange": [750, 1500], // Placeholder
        "ratios": [1.5, 2.0, 2.5, 3.0, 3.5], // Placeholder
        "transferCapacity": [2.0], // Placeholder
        "thrust": 150, // Placeholder
        "centerDistance": 400, // Placeholder
        "weight": 2000, // Placeholder
        "controlType": "电控",
        "dimensions": "-",
        "efficiency": 0.97,
        "basePrice": 175000, // From discounts-2022.txt / OCR P4
        "price": 175000,
        "discountRate": 0.10, // From discounts-2022.txt / OCR P5 下浮10%
        "factoryPrice": 157500, // Calculated
        "packagePrice": 157500,
        "marketPrice": 178977.27, // Calculated
        "notes": "标准配置" // From OCR P4
    }
  ],
   // --- HCQ 系列 (基于 OCR Doc 1 P8-9 全国统一售价) ---
   hcqGearboxes: [
       // 价格已包含全国统一售价的特点 (base=price=factory=package=market)
       {
           "model": "HC038A",
           "inputSpeedRange": [2000, 3000],
           "ratios": [2.07, 2.48, 2.95, 3.35, 3.83], // Note: 5 ratios
           "transferCapacity": [0.012, 0.012, 0.012, 0.012, 0.012], // Note: 5 capacities
           "thrust": 3.5,
           "centerDistance": 135,
           "weight": 84,
           "controlType": "电控",
           "dimensions": "422x325x563", // Note: Same as old 16A? Needs verification
           "efficiency": 0.96,
           "basePrice": 16380, // 全国统一售价 (OCR Doc 1 P8)
           "price": 16380,
           "discountRate": 0,
           "factoryPrice": 16380,
           "packagePrice": 16380,
           "marketPrice": 16380,
           "notes": "全国统一售价"
       },
        {
           "model": "HC038", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [2000, 3000],
            "ratios": [2.07, 2.48, 2.95, 3.35, 3.83], // Note: 5 ratios
            "transferCapacity": [0.012], // Note: Capacity array length mismatch, will be fixed by repair
            "thrust": 3.5,
            "centerDistance": 135,
            "weight": 84,
           "controlType": "手控",
            "dimensions": "422x325x563",
            "efficiency": 0.96,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
        },
       {
           "model": "HCQH1000",
           "inputSpeedRange": [1500, 2100],
           "ratios": [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0], // Note: 8 ratios
           "transferCapacity": [0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], // Note: 8 capacities
           "thrust": 30,
           "centerDistance": 310,
           "weight": 1100,
           "controlType": "电控/气控",
           "dimensions": "600x980x900", // Missing dimensions
           "efficiency": 0.97,
           "basePrice": 85000, // 全国统一售价 (OCR Doc 1 P8)
           "price": 85000,
           "discountRate": 0,
           "factoryPrice": 85000,
           "packagePrice": 85000,
           "marketPrice": 85000,
           "notes": "全国统一售价"
       },
       {
           "model": "HCQ1001", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [1500, 2100],
            "ratios": [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0], // Note: 8 ratios
            "transferCapacity": [0.12], // Note: Capacity array length mismatch, will be fixed by repair
            "thrust": 30,
            "centerDistance": 335,
            "weight": 1200,
           "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
       },
       {
           "model": "HCQ400", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [1000, 2500],
            "ratios": [1.5, 2.0, 2.5, 3.0], // Note: 4 ratios
            "transferCapacity": [0.04], // Note: Capacity array length mismatch, will be fixed by repair
            "thrust": 15,
            "centerDistance": 400,
            "weight": 650,
      "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
       },
        {
           "model": "HCQ600", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [1000, 2100],
            "ratios": [2.0, 2.5, 3.0, 3.5, 4.0], // Note: 5 ratios
            "transferCapacity": [0.065], // Note: Capacity array length mismatch, will be fixed by repair
            "thrust": 20,
            "centerDistance": 190,
            "weight": 280, // Note: Same as HCM600? Needs verification
           "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
        },
       {
           "model": "HCQ1000", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [1500, 2100],
            "ratios": [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0], // Note: 8 ratios
            "transferCapacity": [0.1], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 30,
            "centerDistance": 310,
            "weight": 1100,
           "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
       },
        {
           "model": "HCQ1400", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [750, 1500],
            "ratios": [1.5, 2.0, 2.5, 3.0, 3.5], // Note: 5 ratios
            "transferCapacity": [0.18], // Note: Capacity array length mismatch, will be fixed by repair
            "thrust": 35,
            "centerDistance": 340,
            "weight": 1450,
      "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
        },
       {
           "model": "HCQ1600", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [750, 1500],
            "ratios": [1.5, 2.0, 2.5, 3.0], // Note: 4 ratios
            "transferCapacity": [0.2], // Note: Capacity array length mismatch, will be fixed by repair
      "thrust": 40,
            "centerDistance": 340, // Note: Same as HCQ1400? Needs verification
            "weight": 1550,
      "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
       },
        {
           "model": "HCQ1601", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [750, 1500],
            "ratios": [1.5, 2.0, 2.5, 3.0], // Note: 4 ratios
            "transferCapacity": [0.25], // Note: Capacity array length mismatch, will be fixed by repair
            "thrust": 50,
            "centerDistance": 370,
            "weight": 1600,
      "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
        },
       {
           "model": "HCS138", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [1000, 2500],
            "ratios": [2, 2.52, 3, 3.57, 4.05, 4.45], // Note: 6 ratios
            "transferCapacity": [0.11], // Note: Capacity array length mismatch, will be fixed by repair
            "thrust": 30,
            "centerDistance": 225, // Note: Same as HC138? Needs verification
            "weight": 460,
           "controlType": "电控/气控",
            "dimensions": "520x792x760", // Note: Same as HC138? Needs verification
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
       },
       {
           "model": "HCS302", // Not in OCR Doc 1 P8-9, retaining old data, setting price to 0
            "inputSpeedRange": [750, 2500],
            "ratios": [1.87, 2.04, 2.54, 3.00, 3.53, 4.10, 4.47, 4.61, 4.94, 5.44], // Note: 10 ratios
            "transferCapacity": [0.22], // Note: Capacity array length mismatch, will be fixed by repair
            "thrust": 50,
            "centerDistance": 264, // Note: Same as 300/HC300? Needs verification
            "weight": 680,
           "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0, "price": 0, "discountRate": 0, "factoryPrice": 0, "packagePrice": 0, "marketPrice": 0, "notes": "未在2022价格表中找到 (旧价格)"
       }
   ],
    // --- GC 系列 (基于 OCR Doc 1 P6-7, OCR Doc 3 P1 常规打包价) ---
    gcGearboxes: [
        {
            "model": "GCS320",
            "inputSpeedRange": [1000, 2500], // Placeholder
            "ratios": [2.0, 2.5, 3.0, 3.5, 4.0], // Placeholder
            "transferCapacity": [0.15], // Placeholder
            "thrust": 50, // Placeholder
            "centerDistance": null, // Missing
            "weight": 1200, // Estimated
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.97,
            "basePrice": 30000, // From OCR Doc 1 P6
            "price": 30000,
            "discountRate": 0.10, // From OCR Doc 1 P6 下浮10%
            "factoryPrice": 27000, // From OCR Doc 1 P6 优惠后价格
            "packagePrice": 27000, // Matches OCR Doc 3 P1 (2.7万)
            "marketPrice": 30681.82, // Calculated
            "notes": "电控、无罩、监控仪 (打包价 2.7 万)" // From OCR Doc 1 P6 / OCR Doc 3 P1
        },
        {
            "model": "GCH390",
            "inputSpeedRange": [1000, 2500], // Placeholder
            "ratios": [2.0, 2.5, 3.0, 3.5, 4.0], // Placeholder
            "transferCapacity": [0.2], // Placeholder
            "thrust": 70, // Placeholder
            "centerDistance": null, // Missing
            "weight": 1600, // Estimated
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.97,
            "basePrice": 38000, // From OCR Doc 1 P6
            "price": 38000,
            "discountRate": 0.10, // From OCR Doc 1 P6 下浮10%
            "factoryPrice": 34200, // From OCR Doc 1 P6 优惠后价格
            "packagePrice": 35000, // From OCR Doc 3 P1 (3.5万) - Keep package price if provided
            "marketPrice": 38863.64, // Calculated from factory price
            "notes": "电控、无罩、监控仪 (打包价 3.5 万)" // From OCR Doc 1 P6 / OCR Doc 3 P1
        },
        {
            "model": "GC350A", // Specific model with price in OCR Doc 1 P6
            "inputSpeedRange": [1000, 2000], // Placeholder, assuming similar to GCS320
            "ratios": [2.0, 2.5, 3.0, 3.5, 4.0], // Placeholder
            "transferCapacity": [0.18], // Placeholder
            "thrust": 60, // Placeholder
      "centerDistance": null,
            "weight": 1300, // Estimated
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.97,
            "basePrice": 48000, // From OCR Doc 1 P6
            "price": 48000,
            "discountRate": 0.10, // From OCR Doc 1 P6 下浮10%
            "factoryPrice": 43200, // From OCR Doc 1 P6 优惠后价格
            "packagePrice": 45000, // From OCR Doc 3 P1 (4.5万)
            "marketPrice": 49090.91, // Calculated
             "notes": "电控、无罩、监控仪 (打包价 4.5 万)"
        },
        {
            "model": "GCS540",
            "inputSpeedRange": [1000, 2000], // Placeholder
            "ratios": [2.0, 2.5, 3.0, 3.5, 4.0], // Placeholder
            "transferCapacity": [0.3], // Placeholder
            "thrust": 100, // Placeholder
            "centerDistance": null, // Missing
            "weight": 3200, // Estimated
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.97,
            "basePrice": 45000, // From OCR Doc 1 P6
            "price": 45000,
            "discountRate": 0.10, // From OCR Doc 1 P6 下浮10%
            "factoryPrice": 40500, // From OCR Doc 1 P6 优惠后价格
            "packagePrice": 42000, // From OCR Doc 3 P1 (4.2万)
            "marketPrice": 46022.73, // Calculated
            "notes": "电控、无罩、监控仪 (打包价 4.2 万)"
        },
         {
            "model": "GCH750",
            "inputSpeedRange": [1000, 2000], // Placeholder
            "ratios": [2.0, 2.5, 3.0, 3.5, 4.0], // Placeholder
            "transferCapacity": [0.4], // Placeholder
            "thrust": 130, // Placeholder
            "centerDistance": null, // Missing
            "weight": 4500, // Estimated
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.97,
            "basePrice": 55000, // From OCR Doc 1 P6
            "price": 55000,
            "discountRate": 0.10, // From OCR Doc 1 P6 下浮10%
            "factoryPrice": 49500, // From OCR Doc 1 P6 优惠后价格
            "packagePrice": 50000, // From OCR Doc 3 P1 (5万)
            "marketPrice": 56250.00, // Calculated
             "notes": "电控、无罩、监控仪 (打包价 5 万)"
         },
         {
            "model": "GCS1000",
            "inputSpeedRange": [1000, 2000], // Placeholder
            "ratios": [2.0, 2.5, 3.0, 3.5, 4.0], // Placeholder
            "transferCapacity": [0.5], // Placeholder
            "thrust": 150, // Placeholder
            "centerDistance": null, // Missing
            "weight": 6500, // Estimated
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.97,
            "basePrice": 85000, // From OCR Doc 1 P6
            "price": 85000,
            "discountRate": 0.10, // From OCR Doc 1 P6 下浮10%
            "factoryPrice": 76500, // From OCR Doc 1 P6 优惠后价格
            "packagePrice": 80000, // From OCR Doc 3 P1 (8万)
            "marketPrice": 86931.82, // Calculated
            "notes": "电控、无罩、监控仪 (打包价 8 万)"
         },
         {
            "model": "GCSE20", // Found in OCR Doc 1 P7, marked as high-speed
            "inputSpeedRange": [2000, 3000], // Estimated high speed
            "ratios": [2.0, 2.5, 3.0, 3.5, 4.0], // Placeholder
            "transferCapacity": [0.1], // Placeholder
            "thrust": 30, // Placeholder
            "centerDistance": null, // Missing
            "weight": 1800, // Estimated
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.97,
            "basePrice": 20000, // From OCR Doc 1 P7
            "price": 20000,
            "discountRate": 0.10, // From OCR Doc 1 P7 下浮10%
            "factoryPrice": 18000, // From OCR Doc 1 P7 优惠后价格
            "packagePrice": 18000,
            "marketPrice": 20454.55, // Calculated
             "notes": "高速、电控、无罩、监控仪" // From OCR Doc 1 P7
         }
    ],
     // --- HCX 系列 (可能为铝合金高速箱体, OCR Doc 1 P8) ---
    hcxGearboxes: [
        // 价格已包含全国统一售价的特点 (base=price=factory=package=market)
        {
            "model": "HC15",
            "inputSpeedRange": [2500, 4000], // High Speed
            "ratios": [1.5, 2.0, 2.5, 3.0], // Placeholder
            "transferCapacity": [0.01], // Placeholder
            "thrust": 5, // Placeholder
      "centerDistance": null,
            "weight": 60, // Lighter (aluminum?)
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.95,
            "basePrice": 10200, // 全国统一售价 (OCR Doc 1 P8)
            "price": 10200,
            "discountRate": 0,
            "factoryPrice": 10200,
            "packagePrice": 10200,
            "marketPrice": 10200,
            "notes": "铝合金、高速、全国统一售价"
        },
        {
            "model": "HC20",
            "inputSpeedRange": [2500, 4000], // High Speed
            "ratios": [1.5, 2.0, 2.5, 3.0], // Placeholder
            "transferCapacity": [0.015], // Placeholder
            "thrust": 6, // Placeholder
      "centerDistance": null,
            "weight": 70, // Lighter (aluminum?)
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.95,
            "basePrice": 12500, // 全国统一售价 (OCR Doc 1 P8)
            "price": 12500,
            "discountRate": 0,
            "factoryPrice": 12500,
            "packagePrice": 12500,
            "marketPrice": 12500,
            "notes": "铝合金、高速、全国统一售价"
        }
    ],
     // --- MV 系列 (可能为铝合金高速箱体, OCR Doc 1 P8) ---
    mvGearboxes: [
         // 价格已包含全国统一售价的特点 (base=price=factory=package=market)
        {
            "model": "MV150A",
            "inputSpeedRange": [2000, 3000], // High Speed
            "ratios": [1.5, 2.0, 2.5, 3.0], // Placeholder
            "transferCapacity": [0.018], // Placeholder
            "thrust": 8, // Placeholder
      "centerDistance": null,
            "weight": 80, // Lighter (aluminum?)
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.96,
            "basePrice": 14400, // 全国统一售价 (OCR Doc 1 P8)
            "price": 14400,
            "discountRate": 0,
            "factoryPrice": 14400,
            "packagePrice": 14400,
            "marketPrice": 14400,
            "notes": "铝合金、高速、全国统一售价"
        },
        {
            "model": "MV200",
            "inputSpeedRange": [2000, 3000], // High Speed
            "ratios": [1.5, 2.0, 2.5, 3.0], // Placeholder
            "transferCapacity": [0.02], // Placeholder
            "thrust": 10, // Placeholder
      "centerDistance": null,
            "weight": 95, // Lighter (aluminum?)
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.96,
            "basePrice": 16500, // 全国统一售价 (OCR Doc 1 P8)
            "price": 16500,
            "discountRate": 0,
            "factoryPrice": 16500,
            "packagePrice": 16500,
            "marketPrice": 16500,
            "notes": "铝合金、高速、全国统一售价"
        }
    ],
      // --- HCA 系列 (可能为铝合金高速箱体, OCR Doc 1 P8) ---
    hcaGearboxes: [
         // 价格已包含全国统一售价的特点 (base=price=factory=package=market)
        {
            "model": "HCA200",
            "inputSpeedRange": [2000, 3000], // High Speed
            "ratios": [1.5, 2.0, 2.5, 3.0], // Placeholder
            "transferCapacity": [0.02], // Placeholder
            "thrust": 10, // Placeholder
      "centerDistance": null,
            "weight": 95, // Lighter (aluminum?)
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.96,
            "basePrice": 16500, // 全国统一售价 (OCR Doc 1 P8)
            "price": 16500,
            "discountRate": 0,
            "factoryPrice": 16500,
            "packagePrice": 16500,
            "marketPrice": 16500,
            "notes": "铝合金、高速、全国统一售价"
        }
    ],
      // --- HCV 系列 (可能为铝合金高速箱体, OCR Doc 1 P8) ---
    hcvGearboxes: [
         // 价格已包含全国统一售价的特点 (base=price=factory=package=market)
        {
            "model": "HCV200",
            "inputSpeedRange": [2000, 3000], // High Speed
            "ratios": [1.5, 2.0, 2.5, 3.0], // Placeholder
            "transferCapacity": [0.02], // Placeholder
            "thrust": 10, // Placeholder
            "centerDistance": null,
            "weight": 95, // Lighter (aluminum?)
            "controlType": "电控", // Placeholder
            "dimensions": "-", // Placeholder
            "efficiency": 0.96,
            "basePrice": 16500, // 全国统一售价 (OCR Doc 1 P8)
            "price": 16500,
            "discountRate": 0,
            "factoryPrice": 16500,
            "packagePrice": 16500,
            "marketPrice": 16500,
            "notes": "铝合金、高速、全国统一售价"
        }
    ],
     // --- Flexible Couplings (Moved to dedicated file flexibleCouplings.js) ---
     // This array should be empty in the base embedded data.
    flexibleCouplings: [],

    // --- Standby Pumps (Moved to dedicated file standbyPumps.js) ---
    // This array should be empty in the base embedded data.
    standbyPumps: []
};


/**
 * 根据外部价格表更新齿轮箱价格
 * priceList 每项应包含 { model, basePrice, discountRate, discountedPrice, _source, notes }
 * This function is used by the data repair process to merge external price data.
 * @param {Object} data - The current data object
 * @param {Array<Object>} priceList - Array of price update objects
 * @returns {Object} - The updated data object
 */
export function applyPriceUpdates(data, priceList = []) {
  // Build a quick lookup map from the price list
  const priceMap = new Map();
  priceList.forEach((item) => {
    // Ensure item and model are valid before adding to map
    if (item && typeof item.model === 'string' && item.model.trim()) {
       priceMap.set(item.model.trim(), item);
    } else {
       console.warn("applyPriceUpdates: Skipping price item with invalid or missing model:", item);
    }
  });

  // Deep copy to avoid modifying the original data object passed in
  const updated = JSON.parse(JSON.stringify(data));

  // Define all potential collections that might contain items to update prices for
  // This should match the collections defined in ensureCollections in repair.js or similar
  const collectionsWithPrices = [
      'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
      'hcqGearboxes', 'gcGearboxes', 'hcxGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'mvGearboxes', 'otherGearboxes',
      'flexibleCouplings', 'standbyPumps'
  ];

  collectionsWithPrices.forEach(key => {
    // Check if the collection exists and is an array in the data
    if (Array.isArray(updated[key])) {
      updated[key].forEach((item, index) => { // Added index for logging if needed
        // Ensure item and model are valid before processing
        if (!item || typeof item.model !== 'string' || !item.model.trim()) {
             console.warn(`applyPriceUpdates: Skipping invalid item in collection "${key}" at index ${index}:`, item);
             return; // Skip this item
        }
        const itemModel = item.model.trim();
        const p = priceMap.get(itemModel); // Get the price update from the map

        if (p) {
          // Apply updates from the price list item 'p' to the data item 'item'
          // Use nullish coalescing (??) to keep existing value if the update value is null or undefined
          // Use safeParseFloat to convert values and handle potential invalid inputs
          item.basePrice = safeParseFloat(p.basePrice, item.basePrice) ?? 0; // Default to 0 if parsing fails for both
          // 'price' is typically kept in sync with 'basePrice'
          item.price = safeParseFloat(item.basePrice, item.price) ?? 0;
          item.discountRate = safeParseFloat(p.discountRate, item.discountRate) ?? 0; // Default discount 0
          // Prioritize discountedPrice from price list, then calculate from base/discount, then keep existing factoryPrice
          item.factoryPrice = safeParseFloat(p.discountedPrice,
                               safeParseFloat(item.basePrice) !== null && safeParseFloat(item.discountRate) !== null
                               ? parseFloat((item.basePrice * (1 - item.discountRate)).toFixed(2))
                               : item.factoryPrice) ?? 0; // Default factory to base price (already defaulted to 0)

          // Handle special cases like "全国统一售价" where all prices are the same and discount is 0
          // Assuming this is indicated by a specific property or note in the price list item 'p' or the item itself
          const isFixedPriceSource = p._source === 'OCR Doc 1 P8-9' || p._source === 'OCR Doc 4 P1' || p.notes?.includes('全国统一售价') || item.notes?.includes('全国统一售价'); // Check source/note in price item or data item
          if (isFixedPriceSource) {
             item.discountRate = 0;
             item.factoryPrice = item.basePrice;
             item.packagePrice = item.basePrice;
             item.marketPrice = item.basePrice;
             item._priceUpdateSource = p._source || 'Fixed Price Source';
          } else {
              // For standard discounted prices, update/calculate related fields
              // Package price usually defaults to factory price, but price list might specify one
              item.packagePrice = safeParseFloat(p.packagePrice, item.factoryPrice) ?? item.factoryPrice; // Default package to factoryPrice

              // Market price calculation can be complex; let the main priceManager process handle final calculation
              // For now, if marketPrice is provided in p, use it. Otherwise, rely on later processing.
              item.marketPrice = safeParseFloat(p.marketPrice, item.marketPrice) ?? item.factoryPrice; // Default market to factory (will be recalculated by priceManager)

               item._priceUpdateSource = p._source || 'External Price List'; // Mark the source of the update
          }

          // Ensure all price fields are numbers again after logic, final cleanup with safeParseFloat(..., 0)
          item.basePrice = safeParseFloat(item.basePrice, 0);
          item.price = safeParseFloat(item.price, item.basePrice);
          item.discountRate = safeParseFloat(item.discountRate, 0);
          item.factoryPrice = safeParseFloat(item.factoryPrice, item.basePrice);
          item.packagePrice = safeParseFloat(item.packagePrice, item.factoryPrice);
          item.marketPrice = safeParseFloat(item.marketPrice, item.factoryPrice);


          item._priceUpdated = true; // Mark item as having price updated from an external source
          console.log(`applyPriceUpdates: Updated price data for ${key}/${item.model} from source ${item._priceUpdateSource}`);
        }
      });
    }
  });

  // The full price recalculation and validation happens later in the repair process (processPriceData)
  // This function primarily focuses on applying the raw price data from the external list.

  return updated;
}

// Add default export to ensure correct import from other files
export default embeddedGearboxData;

