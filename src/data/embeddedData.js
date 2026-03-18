
// src/data/embeddedData.js
// 自动生成 by scripts/generate-embedded-data.js
// 生成时间: 2026-03-18T01:51:42.341Z
// 总型号数: 664 (原215 + 新增0)
// 数据来源: completeGearboxData.js (700型号) + 原 embeddedData.js 手工数据

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

export const embeddedGearboxData = {
    "_version": 3,
    "_lastFixed": "2026-03-18T01:51:42.340Z",
    "hcGearboxes": [
        {
            "model": "40A",
            "inputSpeedRange": [
                750,
                2000
            ],
            "ratios": [
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.0294,
                0.0294,
                0.0235,
                0.02
            ],
            "thrust": 5.5,
            "centerDistance": 125,
            "weight": 115,
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
        },
        {
            "model": "120C",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.48,
                1.61,
                1.94,
                2.45,
                2.96,
                3.35
            ],
            "transferCapacity": [
                0.1,
                0.1,
                0.1,
                0.1,
                0.09,
                0.08
            ],
            "thrust": 25,
            "centerDistance": 180,
            "weight": 225,
            "controlType": "推拉软轴/电控",
            "dimensions": "432x440x650",
            "efficiency": 0.97,
            "basePrice": 13420,
            "price": 13420,
            "discountRate": 0.12,
            "factoryPrice": 11809.6,
            "packagePrice": 11809.6,
            "marketPrice": 13420,
            "notes": "手控、带罩、齿形块、A1型监控"
        },
        {
            "model": "HCN120",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.48,
                1.61,
                1.94,
                2.45,
                2.96,
                3.35
            ],
            "transferCapacity": [
                0.1,
                0.1,
                0.1,
                0.1,
                0.09,
                0.08
            ],
            "thrust": 25,
            "centerDistance": 180,
            "weight": 225,
            "controlType": "推拉软轴/电控",
            "dimensions": "432x440x650",
            "efficiency": 0.97,
            "basePrice": 13420,
            "price": 13420,
            "discountRate": 0.12,
            "factoryPrice": 11809.6,
            "packagePrice": 11809.6,
            "marketPrice": 13420,
            "notes": "未在2022价格表中直接列出 (价格同120C)"
        },
        {
            "model": "120B",
            "inputSpeedRange": [
                750,
                1800
            ],
            "ratios": [
                2.03,
                2.81,
                3.73
            ],
            "transferCapacity": [
                0.088,
                0.088,
                0.044
            ],
            "thrust": 25,
            "centerDistance": 190,
            "weight": 400,
            "controlType": "推拉软轴/电控",
            "dimensions": "605x744x770",
            "efficiency": 0.97,
            "basePrice": 12520,
            "price": 12520,
            "discountRate": 0.12,
            "factoryPrice": 11017.6,
            "packagePrice": 11017.6,
            "marketPrice": 12520,
            "notes": "手控、带罩、齿形块、A1型监控"
        },
        {
            "model": "MB170",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1.97,
                2.52,
                3.04,
                3.54,
                3.96,
                4.5,
                5.06,
                5.47,
                5.88
            ],
            "transferCapacity": [
                0.039,
                0.039,
                0.039,
                0.039,
                0.039,
                0.031,
                0.031,
                0.027,
                0.027
            ],
            "thrust": 16,
            "centerDistance": 170,
            "weight": 240,
            "controlType": "推拉软轴/电控",
            "dimensions": "510x670x656",
            "efficiency": 0.97,
            "basePrice": 10950,
            "price": 10950,
            "discountRate": 0.12,
            "factoryPrice": 9636,
            "packagePrice": 9636,
            "marketPrice": 10950,
            "notes": "手控、带罩、齿形块、A1型监控"
        },
        {
            "model": "MB242",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2,
                2.54,
                3.04,
                3.52,
                3.95,
                4.53,
                5.12,
                5.56,
                5.88
            ],
            "transferCapacity": [
                0.103,
                0.103,
                0.103,
                0.103,
                0.103,
                0.103,
                0.1,
                0.094,
                0.074
            ],
            "thrust": 30,
            "centerDistance": 242,
            "weight": 385,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "442x774x763",
            "efficiency": 0.97,
            "basePrice": 21300,
            "price": 21300,
            "discountRate": 0.12,
            "factoryPrice": 18744,
            "packagePrice": 18744,
            "marketPrice": 21300,
            "notes": "手控、带罩、齿形块、A1型监控"
        },
        {
            "model": "MB270A",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                3,
                4.05,
                4.53,
                5.12,
                5.5,
                5.95,
                6.39,
                6.82
            ],
            "transferCapacity": [
                0.147,
                0.147,
                0.147,
                0.147,
                0.134,
                0.11,
                0.088,
                0.088
            ],
            "thrust": 39.2,
            "centerDistance": 270,
            "weight": 675,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "594x810x868",
            "efficiency": 0.97,
            "basePrice": 28600,
            "price": 28600,
            "discountRate": 0.12,
            "factoryPrice": 25168,
            "packagePrice": 25168,
            "marketPrice": 28600,
            "notes": "手控、带罩、齿形块、A1型监控 (价格按速比范围区分，此为3-5.5:1价格)"
        },
        {
            "model": "135",
            "inputSpeedRange": [
                750,
                2000
            ],
            "ratios": [
                2.07,
                2.48,
                2.95,
                3.35,
                3.83,
                4.5,
                5.06,
                5.47,
                5.88
            ],
            "transferCapacity": [
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.093,
                0.088,
                0.077,
                0.07
            ],
            "thrust": 29.4,
            "centerDistance": 225,
            "weight": 470,
            "controlType": "推拉软轴/电控",
            "dimensions": "578x792x830",
            "efficiency": 0.97,
            "basePrice": 18360,
            "price": 18360,
            "discountRate": 0.16,
            "factoryPrice": 15422.4,
            "packagePrice": 15422.4,
            "marketPrice": 17525.45,
            "notes": "手控、带罩、齿形块、A1型监控"
        },
        {
            "model": "135A",
            "inputSpeedRange": [
                750,
                2000
            ],
            "ratios": [
                2.03,
                2.59,
                3.04,
                3.62,
                4.11,
                4.65,
                5.06,
                5.47,
                5.81
            ],
            "transferCapacity": [
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.093,
                0.088,
                0.077,
                0.07
            ],
            "thrust": 29.4,
            "centerDistance": 225,
            "weight": 470,
            "controlType": "推拉软轴/电控",
            "dimensions": "578x792x830",
            "efficiency": 0.97,
            "basePrice": 19200,
            "price": 19200,
            "discountRate": 0.16,
            "factoryPrice": 16128,
            "packagePrice": 16128,
            "marketPrice": 18327.27,
            "notes": "手控、带罩、齿形块、A1型监控"
        },
        {
            "model": "HC138",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2,
                2.52,
                3,
                3.57,
                4.05,
                4.45,
                5.05,
                5.63,
                6.06,
                6.47
            ],
            "transferCapacity": [
                0.11,
                0.11,
                0.11,
                0.11,
                0.11,
                0.11,
                0.099,
                0.093,
                0.088,
                0.084
            ],
            "thrust": 30,
            "centerDistance": 225,
            "weight": 360,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "520x792x760",
            "efficiency": 0.97,
            "basePrice": 18200,
            "price": 18200,
            "discountRate": 0.16,
            "factoryPrice": 15288,
            "packagePrice": 15288,
            "marketPrice": 17372.73,
            "notes": "手控、带罩、齿形块、A1型监控 (或手控、无罩、高弹、A1型监控)"
        },
        {
            "model": "HCD138",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2,
                2.54,
                3.04,
                3.52,
                3.95,
                4.53,
                5.12,
                5.56,
                5.88
            ],
            "transferCapacity": [
                0.11,
                0.11,
                0.11,
                0.11,
                0.11,
                0.099,
                0.088,
                0.077,
                0.07
            ],
            "thrust": 40,
            "centerDistance": 296,
            "weight": 415,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "494x800x870",
            "efficiency": 0.97,
            "basePrice": 19400,
            "price": 19400,
            "discountRate": 0.16,
            "factoryPrice": 16296,
            "packagePrice": 16296,
            "marketPrice": 18518.18,
            "notes": "手控、带罩、齿形块、A1型监控 (或手控、无罩、高弹、A1型监控)"
        },
        {
            "model": "300",
            "inputSpeedRange": [
                750,
                2500
            ],
            "ratios": [
                3,
                4.05,
                4.53,
                5.12,
                5.5,
                5.95,
                6.39,
                6.82
            ],
            "transferCapacity": [
                0.28,
                0.243,
                0.221,
                0.184,
                0.184,
                0.147,
                0.133,
                0.125
            ],
            "thrust": 39.2,
            "centerDistance": 270,
            "weight": 740,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "786x930x880",
            "efficiency": 0.97,
            "basePrice": 23000,
            "price": 23000,
            "discountRate": 0.16,
            "factoryPrice": 19320,
            "packagePrice": 19320,
            "marketPrice": 21954.55,
            "notes": "手控、带罩、齿形块、A1型监控 (价格按速比范围区分)"
        },
        {
            "model": "J300",
            "inputSpeedRange": [
                750,
                2500
            ],
            "ratios": [
                1.5,
                1.87,
                2.04,
                2.23,
                2.54,
                3,
                3.53
            ],
            "transferCapacity": [
                0.28,
                0.28,
                0.28,
                0.28,
                0.28,
                0.28,
                0.257
            ],
            "thrust": 50,
            "centerDistance": 264,
            "weight": 740,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "786x930x864",
            "efficiency": 0.97,
            "basePrice": 26680,
            "price": 26680,
            "discountRate": 0.22,
            "factoryPrice": 20810,
            "packagePrice": 20810,
            "marketPrice": 23647.73,
            "notes": "手控、带罩、齿形块、A1型监控 (报告特批)"
        },
        {
            "model": "HC300",
            "inputSpeedRange": [
                700,
                2500
            ],
            "ratios": [
                1.87,
                2.04,
                2.54,
                3,
                3.53,
                4.1,
                4.47,
                4.61,
                4.94,
                5.44
            ],
            "transferCapacity": [
                0.257,
                0.257,
                0.257,
                0.257,
                0.257,
                0.2,
                0.2,
                0.184,
                0.147,
                0.13
            ],
            "thrust": 50,
            "centerDistance": 264,
            "weight": 680,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 23000,
            "price": 23000,
            "discountRate": 0.16,
            "factoryPrice": 19320,
            "packagePrice": 19320,
            "marketPrice": 21954.55,
            "notes": "手控、带罩、齿形块、A1型监控 (价格按速比范围区分，此为1.5-4.61价格)"
        },
        {
            "model": "D300A",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                4,
                4.48,
                5.05,
                5.52,
                5.9,
                6.56,
                7.06,
                7.63
            ],
            "transferCapacity": [
                0.257,
                0.243,
                0.221,
                0.184,
                0.184,
                0.184,
                0.147,
                0.125
            ],
            "thrust": 60,
            "centerDistance": 355,
            "weight": 940,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "786x1010x1041",
            "efficiency": 0.97,
            "basePrice": 32420,
            "price": 32420,
            "discountRate": 0.22,
            "factoryPrice": 25287,
            "packagePrice": 25287,
            "marketPrice": 28735.23,
            "notes": "手控、带罩、齿形块、A1型监控 (价格按速比范围区分，此为4-5.5:1报告特批价格)"
        },
        {
            "model": "T300",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                4.73,
                4.95,
                5.51,
                6.03,
                6.65,
                7.04,
                7.54,
                8.02,
                8.47
            ],
            "transferCapacity": [
                0.243,
                0.243,
                0.243,
                0.243,
                0.243,
                0.243,
                0.221,
                0.221,
                0.2
            ],
            "thrust": 70,
            "centerDistance": 355,
            "weight": 1120,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "770x980x1106",
            "efficiency": 0.97,
            "basePrice": 43900,
            "price": 43900,
            "discountRate": 0.16,
            "factoryPrice": 36876,
            "packagePrice": 36876,
            "marketPrice": 41904.55,
            "notes": "手控、带罩、齿形块、A1型监控"
        },
        {
            "model": "T300/1",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                8.94,
                9.45
            ],
            "transferCapacity": [
                0.196,
                0.196
            ],
            "thrust": 70,
            "centerDistance": 355,
            "weight": 1120,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "770x980x1106",
            "efficiency": 0.97,
            "basePrice": 46900,
            "price": 46900,
            "discountRate": 0.16,
            "factoryPrice": 39396,
            "packagePrice": 39396,
            "marketPrice": 44768.18,
            "notes": "手控、带罩、齿形块、A1型监控"
        },
        {
            "model": "HC400",
            "inputSpeedRange": [
                1000,
                1800
            ],
            "ratios": [
                1.5,
                1.77,
                2.04,
                2.5,
                2.86,
                3,
                3.25,
                3.33,
                3.42,
                3.6,
                3.96,
                4.33,
                4.43,
                4.7,
                5
            ],
            "transferCapacity": [
                0.331,
                0.3258367346938776,
                0.3199183673469388,
                0.31324489795918364,
                0.30581632653061225,
                0.2976326530612245,
                0.2886938775510204,
                0.279,
                0.2685510204081633,
                0.2573469387755102,
                0.2453877551020408,
                0.2326734693877551,
                0.2192040816326531,
                0.20497959183673467,
                0.19
            ],
            "thrust": 82,
            "centerDistance": 264,
            "weight": 820,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 32150,
            "price": 32150,
            "discountRate": 0.22,
            "factoryPrice": 25077,
            "packagePrice": 25077,
            "marketPrice": 28496.59,
            "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控) (报告特批)"
        },
        {
            "model": "HCD400A",
            "inputSpeedRange": [
                1000,
                1800
            ],
            "ratios": [
                3.96,
                4.33,
                4.43,
                4.7,
                5,
                5.53,
                5.71,
                5.89,
                6
            ],
            "transferCapacity": [
                0.331,
                0.331,
                0.331,
                0.331,
                0.331,
                0.293,
                0.272,
                0.272,
                0.267
            ],
            "thrust": 82,
            "centerDistance": 355,
            "weight": 1100,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "641x1010x988",
            "efficiency": 0.97,
            "basePrice": 38150,
            "price": 38150,
            "discountRate": 0.22,
            "factoryPrice": 29757,
            "packagePrice": 29757,
            "marketPrice": 33814.77,
            "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控) (报告特批)"
        },
        {
            "model": "HCT400A",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                6.09,
                6.49,
                6.93,
                7.42,
                7.96,
                8.4,
                9,
                9.47
            ],
            "transferCapacity": [
                0.331,
                0.331,
                0.331,
                0.331,
                0.309,
                0.294,
                0.279,
                0.279
            ],
            "thrust": 82,
            "centerDistance": 375,
            "weight": 1450,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "784x992x1130",
            "efficiency": 0.97,
            "basePrice": 51000,
            "price": 51000,
            "discountRate": 0.16,
            "factoryPrice": 42840,
            "packagePrice": 42840,
            "marketPrice": 48681.82,
            "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)"
        },
        {
            "model": "HCT400A/1",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                8.15,
                8.69,
                9.27,
                9.94,
                10.6,
                11.37,
                12,
                12.5,
                13.96
            ],
            "transferCapacity": [
                0.331,
                0.331,
                0.331,
                0.316,
                0.297,
                0.274,
                0.262,
                0.262,
                0.204
            ],
            "thrust": 120,
            "centerDistance": 465,
            "weight": 1500,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "869x1100x1275",
            "efficiency": 0.97,
            "basePrice": 60000,
            "price": 60000,
            "discountRate": 0.16,
            "factoryPrice": 50400,
            "packagePrice": 50400,
            "marketPrice": 57272.73,
            "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)"
        },
        {
            "model": "HC600A",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                2,
                2.48,
                2.63,
                3,
                3.58,
                3.89
            ],
            "transferCapacity": [
                0.49,
                0.49,
                0.49,
                0.49,
                0.49,
                0.49
            ],
            "thrust": 90,
            "centerDistance": 320,
            "weight": 1300,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 57200,
            "price": 57200,
            "discountRate": 0.12,
            "factoryPrice": 50336,
            "packagePrice": 50336,
            "marketPrice": 57200,
            "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)"
        },
        {
            "model": "HC400P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.5,
                1.77,
                2.04,
                2.5,
                2.86,
                3,
                3.25
            ],
            "transferCapacity": [
                0.331,
                0.331,
                0.331,
                0.331,
                0.279,
                0.279,
                0.19
            ],
            "thrust": 60,
            "centerDistance": 264,
            "weight": 600,
            "controlType": "推拉软轴/电控",
            "dimensions": "604×886×880",
            "efficiency": 0.97,
            "basePrice": 46000,
            "price": 46000,
            "discountRate": 0.1,
            "factoryPrice": 41400,
            "packagePrice": 41400,
            "marketPrice": 46000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版"
        },
        {
            "model": "HC600P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2,
                2.48,
                2.63,
                3,
                3.58,
                3.89
            ],
            "transferCapacity": [
                1.359,
                1.486,
                1.706,
                1.706,
                1.706,
                1.706
            ],
            "thrust": 155,
            "centerDistance": 350,
            "weight": 1500,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 60000,
            "price": 60000,
            "discountRate": 0.1,
            "factoryPrice": 54000,
            "packagePrice": 54000,
            "marketPrice": 60000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版"
        },
        {
            "model": "HC1200P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.6,
                2.03,
                2.48,
                2.5,
                2.96,
                3.18,
                3.33,
                3.55
            ],
            "transferCapacity": [
                1.4,
                1.471,
                1.71,
                1.994,
                2.231,
                2.5,
                2.652,
                2.652
            ],
            "thrust": 250,
            "centerDistance": 450,
            "weight": 2500,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 102000,
            "price": 102000,
            "discountRate": 0.1,
            "factoryPrice": 91800,
            "packagePrice": 91800,
            "marketPrice": 102000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版"
        },
        {
            "model": "HC1600P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2.03,
                2.5,
                2.96,
                3.55,
                4
            ],
            "transferCapacity": [
                1.353,
                1.5,
                1.759,
                1.759,
                1.759
            ],
            "thrust": 440,
            "centerDistance": 500,
            "weight": 3200,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 130000,
            "price": 130000,
            "discountRate": 0.1,
            "factoryPrice": 117000,
            "packagePrice": 117000,
            "marketPrice": 130000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版"
        },
        {
            "model": "HC2000P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.97,
                2.5,
                2.96,
                3.5,
                4,
                4.5
            ],
            "transferCapacity": [
                1.375,
                1.533,
                1.714,
                1.714,
                1.714,
                1.714
            ],
            "thrust": 580,
            "centerDistance": 550,
            "weight": 4000,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 158000,
            "price": 158000,
            "discountRate": 0.1,
            "factoryPrice": 142200,
            "packagePrice": 142200,
            "marketPrice": 158000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版"
        },
        {
            "model": "HC2700P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.54,
                2.03,
                2.58,
                3.09,
                3.48,
                3.95,
                4.47
            ],
            "transferCapacity": [
                1.371,
                1.515,
                1.767,
                1.767,
                1.767,
                1.767,
                1.767
            ],
            "thrust": 670,
            "centerDistance": 600,
            "weight": 5000,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 207000,
            "price": 207000,
            "discountRate": 0.1,
            "factoryPrice": 186300,
            "packagePrice": 186300,
            "marketPrice": 207000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版"
        },
        {
            "model": "HCD400P",
            "inputSpeedRange": [
                1000,
                3000
            ],
            "ratios": [
                3.96,
                4.43,
                4.7
            ],
            "transferCapacity": [
                0.331,
                0.331,
                0.331
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 255000,
            "price": 255000,
            "discountRate": 0.1,
            "factoryPrice": 229500,
            "packagePrice": 229500,
            "marketPrice": 255000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD600P",
            "inputSpeedRange": [
                1000,
                3000
            ],
            "ratios": [
                4.43,
                5,
                5.44,
                5.71,
                6.06
            ],
            "transferCapacity": [
                0.45,
                0.41,
                0.364,
                0.338,
                0.324
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 255000,
            "price": 255000,
            "discountRate": 0.1,
            "factoryPrice": 229500,
            "packagePrice": 229500,
            "marketPrice": 255000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD800P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2.04,
                2.52,
                3.04,
                3.57,
                4,
                4.47,
                5.05,
                5.5
            ],
            "transferCapacity": [
                1.351,
                1.486,
                1.718,
                1.8514,
                2.222,
                2.48
            ],
            "thrust": 225,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 107000,
            "price": 107000,
            "discountRate": 0.1,
            "factoryPrice": 96300,
            "packagePrice": 96300,
            "marketPrice": 107000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD1400P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                3.5,
                3.83,
                4.04,
                4.27,
                4.32,
                4.52,
                4.8,
                5.05
            ],
            "transferCapacity": [
                1.364,
                1.516,
                1.786,
                1.8832,
                2.25,
                2.5
            ],
            "thrust": 410,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 146000,
            "price": 146000,
            "discountRate": 0.1,
            "factoryPrice": 131400,
            "packagePrice": 131400,
            "marketPrice": 146000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD1600P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                4.95,
                5.25,
                5.58,
                5.94
            ],
            "transferCapacity": [
                1.26,
                1.2,
                1.06,
                0.98
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 255000,
            "price": 255000,
            "discountRate": 0.1,
            "factoryPrice": 229500,
            "packagePrice": 229500,
            "marketPrice": 255000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD2000P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                3,
                3.58,
                3.96,
                4.45,
                4.95,
                5.26
            ],
            "transferCapacity": [
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58
            ],
            "thrust": 1000,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 185000,
            "price": 185000,
            "discountRate": 0.1,
            "factoryPrice": 166500,
            "packagePrice": 166500,
            "marketPrice": 185000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD2700P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                3.65,
                4.04,
                4.5,
                5.05,
                5.48,
                6.11
            ],
            "transferCapacity": [
                2.1,
                2.1,
                2.1,
                2.1
            ],
            "thrust": 1000,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 230500,
            "price": 230500,
            "discountRate": 0.1,
            "factoryPrice": 207450,
            "packagePrice": 207450,
            "marketPrice": 230500,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT400P",
            "inputSpeedRange": [
                1000,
                3000
            ],
            "ratios": [
                6.09,
                6.49,
                6.93
            ],
            "transferCapacity": [
                0.331,
                0.331,
                0.331
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 285000,
            "price": 285000,
            "discountRate": 0.1,
            "factoryPrice": 256500,
            "packagePrice": 256500,
            "marketPrice": 285000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT600P",
            "inputSpeedRange": [
                1000,
                3000
            ],
            "ratios": [
                6.06
            ],
            "transferCapacity": [
                0.45
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 285000,
            "price": 285000,
            "discountRate": 0.1,
            "factoryPrice": 256500,
            "packagePrice": 256500,
            "marketPrice": 285000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT800P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                4.95,
                5.57,
                5.93,
                6.43
            ],
            "transferCapacity": [
                0.625,
                0.625,
                0.625,
                0.625
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 285000,
            "price": 285000,
            "discountRate": 0.1,
            "factoryPrice": 256500,
            "packagePrice": 256500,
            "marketPrice": 285000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT1200P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2.04,
                2.48,
                2.95,
                3.45,
                3.96,
                4.39,
                4.89,
                5.44,
                5.94
            ],
            "transferCapacity": [
                0.93,
                0.93,
                0.93,
                0.93
            ],
            "thrust": 1000,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 135000,
            "price": 135000,
            "discountRate": 0.1,
            "factoryPrice": 121500,
            "packagePrice": 121500,
            "marketPrice": 135000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT1400P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                4.06,
                4.51,
                5.03,
                5.52,
                5.97,
                6.48,
                7.03,
                7.5
            ],
            "transferCapacity": [
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 285000,
            "price": 285000,
            "discountRate": 0.1,
            "factoryPrice": 256500,
            "packagePrice": 256500,
            "marketPrice": 285000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT1600P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                7.44,
                7.92,
                8.46,
                9,
                9.53,
                10.17,
                10.87,
                11.65,
                12.52
            ],
            "transferCapacity": [
                1.26,
                1.213,
                1.13,
                1.01,
                0.95,
                0.9,
                0.9,
                0.867,
                0.811
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 285000,
            "price": 285000,
            "discountRate": 0.1,
            "factoryPrice": 256500,
            "packagePrice": 256500,
            "marketPrice": 285000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT2000P",
            "inputSpeedRange": [
                500,
                1400
            ],
            "ratios": [
                5.19,
                5.49,
                5.94,
                6.58,
                7.01,
                7.48,
                7.76,
                8
            ],
            "transferCapacity": [
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58
            ],
            "thrust": 1000,
            "centerDistance": 0,
            "weight": 3600,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 195000,
            "price": 195000,
            "discountRate": 0.1,
            "factoryPrice": 175500,
            "packagePrice": 175500,
            "marketPrice": 195000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT2700P",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                4.92,
                5.43,
                6.16,
                6.58,
                7.03,
                7.53,
                8.01,
                8.54,
                9.12,
                9.42,
                10.05,
                10.68,
                11.54
            ],
            "transferCapacity": [
                2.1,
                2.1,
                2.035,
                2.035,
                1.812,
                1.812,
                1.75,
                1.75,
                1.575,
                1.575,
                1.5,
                1.5,
                1.5
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 285000,
            "price": 285000,
            "discountRate": 0.1,
            "factoryPrice": 256500,
            "packagePrice": 256500,
            "marketPrice": 285000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HC1200/1P",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                3.7,
                3.74,
                3.95,
                4.14
            ],
            "transferCapacity": [
                0.93,
                0.93,
                0.93,
                0.93
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 70000,
            "price": 70000,
            "discountRate": 0.1,
            "factoryPrice": 63000,
            "packagePrice": 63000,
            "marketPrice": 70000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HC4500P",
            "inputSpeedRange": [
                500,
                1200
            ],
            "ratios": [
                2.58,
                2.87,
                3.17,
                3.53,
                3.91,
                4.35
            ],
            "transferCapacity": [
                2.8,
                2.8,
                2.5
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 7500,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 350000,
            "price": 350000,
            "discountRate": 0.1,
            "factoryPrice": 315000,
            "packagePrice": 315000,
            "marketPrice": 350000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版"
        },
        {
            "model": "HC5000P",
            "inputSpeedRange": [
                500,
                1100
            ],
            "ratios": [
                2.58,
                2.87,
                3.17,
                3.53,
                3.91,
                4.35
            ],
            "transferCapacity": [
                3.2,
                3.2,
                2.8
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 8500,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 400000,
            "price": 400000,
            "discountRate": 0.1,
            "factoryPrice": 360000,
            "packagePrice": 360000,
            "marketPrice": 400000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版"
        },
        {
            "model": "HC6000P",
            "inputSpeedRange": [
                450,
                1000
            ],
            "ratios": [
                3,
                3.5,
                4,
                4.5,
                5
            ],
            "transferCapacity": [
                3.8,
                3.8
            ],
            "thrust": 0,
            "centerDistance": 0,
            "weight": 10000,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 480000,
            "price": 480000,
            "discountRate": 0.1,
            "factoryPrice": 432000,
            "packagePrice": 432000,
            "marketPrice": 480000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版"
        },
        {
            "model": "HCD600A",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                4.18,
                4.43,
                4.7,
                5,
                5.44,
                5.71
            ],
            "transferCapacity": [
                0.49,
                0.49,
                0.49,
                0.49,
                0.45,
                0.43
            ],
            "thrust": 90,
            "centerDistance": 415,
            "weight": 1550,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "745x1214x1271",
            "efficiency": 0.97,
            "basePrice": 60600,
            "price": 60600,
            "discountRate": 0.12,
            "factoryPrice": 53328,
            "packagePrice": 53328,
            "marketPrice": 60600,
            "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)"
        },
        {
            "model": "HCT600A",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                6.06,
                6.49,
                6.97,
                7.51,
                8.04,
                8.66,
                9.35
            ],
            "transferCapacity": [
                0.45,
                0.419,
                0.39,
                0.363,
                0.338,
                0.314,
                0.291
            ],
            "thrust": 90,
            "centerDistance": 415,
            "weight": 1650,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "821x1214x1271",
            "efficiency": 0.97,
            "basePrice": 70900,
            "price": 70900,
            "discountRate": 0.12,
            "factoryPrice": 62392,
            "packagePrice": 62392,
            "marketPrice": 70900,
            "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)"
        },
        {
            "model": "HCT600A/1",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                6.09,
                6.48,
                7.04,
                7.69,
                8.23,
                8.82,
                9.47,
                10.1,
                10.8,
                11.65,
                12.57,
                13.64,
                14.44,
                15.91
            ],
            "transferCapacity": [
                0.49,
                0.49,
                0.49,
                0.49,
                0.49,
                0.485,
                0.45,
                0.423,
                0.395,
                0.367,
                0.34,
                0.313,
                0.296,
                0.268
            ],
            "thrust": 140,
            "centerDistance": 500,
            "weight": 1700,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "878x1224x1346",
            "efficiency": 0.97,
            "basePrice": 75000,
            "price": 75000,
            "discountRate": 0.12,
            "factoryPrice": 66000,
            "packagePrice": 66000,
            "marketPrice": 75000,
            "notes": "手控、无罩、高弹、A1型监控 (或手控、带罩、齿形块、A1型监控)"
        },
        {
            "model": "HCD800",
            "inputSpeedRange": [
                600,
                2100
            ],
            "ratios": [
                3,
                3.43,
                3.96,
                4.17,
                4.39,
                4.9,
                5.47,
                5.89
            ],
            "transferCapacity": [
                0.52,
                0.52,
                0.468,
                0.468,
                0.414,
                0.38,
                0.35,
                0.32
            ],
            "thrust": 110,
            "centerDistance": 450,
            "weight": 2250,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1056x1280x1341",
            "efficiency": 0.97,
            "basePrice": 86100,
            "price": 86100,
            "discountRate": 0.08,
            "factoryPrice": 79212,
            "packagePrice": 79212,
            "marketPrice": 90013.64,
            "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)"
        },
        {
            "model": "HCT800",
            "inputSpeedRange": [
                600,
                2100
            ],
            "ratios": [
                4.95,
                5.57,
                5.68,
                5.93,
                6.43,
                6.86,
                7.33,
                7.84,
                8.4,
                9
            ],
            "transferCapacity": [
                0.625,
                0.625,
                0.625,
                0.625,
                0.625,
                0.588,
                0.551,
                0.515,
                0.48,
                0.48
            ],
            "thrust": 140,
            "centerDistance": 450,
            "weight": 2500,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1056x1280x1425",
            "efficiency": 0.97,
            "basePrice": 98000,
            "price": 98000,
            "discountRate": 0.08,
            "factoryPrice": 90160,
            "packagePrice": 90160,
            "marketPrice": 102454.55,
            "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)"
        },
        {
            "model": "HCT800/1",
            "inputSpeedRange": [
                600,
                2100
            ],
            "ratios": [
                6.91,
                7.28,
                7.69,
                8.13,
                8.6,
                9.12,
                9.68,
                10.3,
                10.98,
                11.76,
                12.43,
                13.17,
                13.97,
                14.85,
                15.82,
                16.58,
                17.91,
                20.12,
                22.11
            ],
            "transferCapacity": [
                0.625,
                0.625,
                0.625,
                0.625,
                0.625,
                0.625,
                0.625,
                0.609,
                0.575,
                0.549,
                0.52,
                0.491,
                0.463,
                0.435,
                0.408,
                0.382,
                0.378,
                0.278,
                0.278
            ],
            "thrust": 220,
            "centerDistance": 582,
            "weight": 3300,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1152x1360x1557",
            "efficiency": 0.97,
            "basePrice": 137200,
            "price": 137200,
            "discountRate": 0.08,
            "factoryPrice": 126224,
            "packagePrice": 126224,
            "marketPrice": 143436.36,
            "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控) (价格按速比范围区分，此价格对应高速比范围)"
        },
        {
            "model": "HCT800/2",
            "inputSpeedRange": [
                600,
                2100
            ],
            "ratios": [
                11.52,
                12.21,
                11.97,
                14.08,
                14.48,
                14.88,
                15.48,
                15.76,
                16.72,
                17.78,
                18.94
            ],
            "transferCapacity": [
                0.6,
                0.6,
                0.6,
                0.553,
                0.549,
                0.52,
                0.503,
                0.491,
                0.463,
                0.435,
                0.382
            ],
            "thrust": 220,
            "centerDistance": 666,
            "weight": 3960,
            "controlType": "推拉软轴/电控",
            "dimensions": "1190x1490x1707",
            "efficiency": 0.97,
            "basePrice": 150200,
            "price": 150200,
            "discountRate": 0.08,
            "factoryPrice": 138184,
            "packagePrice": 138184,
            "marketPrice": 157027.27,
            "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)"
        },
        {
            "model": "HCT800/2A",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                13.12,
                13.81,
                14.55,
                15.33,
                16.16,
                17.04,
                17.99,
                20.27,
                22.18
            ],
            "transferCapacity": [
                0.6816,
                0.6474,
                0.6147,
                0.5834,
                0.5534,
                0.525,
                0.497,
                0.441,
                0.435
            ],
            "thrust": 220,
            "centerDistance": 666,
            "weight": 4000,
            "controlType": "推拉软轴/电控",
            "dimensions": "1190x1490x2040",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到"
        },
        {
            "model": "HCT800/3",
            "inputSpeedRange": [
                600,
                2100
            ],
            "ratios": [
                16.56,
                17.95,
                20.19,
                21.94
            ],
            "transferCapacity": [
                0.597,
                0.551,
                0.491,
                0.414
            ],
            "thrust": 240,
            "centerDistance": 736,
            "weight": 4540,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1235x1570x1789",
            "efficiency": 0.97,
            "basePrice": 170800,
            "price": 170800,
            "discountRate": 0.08,
            "factoryPrice": 157136,
            "packagePrice": 157136,
            "marketPrice": 178563.64,
            "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)"
        },
        {
            "model": "HCW800",
            "inputSpeedRange": [
                1000,
                1800
            ],
            "ratios": [
                15.88,
                16.38,
                17.24,
                17.97,
                18.74,
                19.55,
                20.4,
                21.99
            ],
            "transferCapacity": [
                0.931
            ],
            "thrust": 300,
            "centerDistance": 625,
            "weight": 6900,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1567x1630x2550",
            "efficiency": 0.97,
            "basePrice": 173900,
            "price": 173900,
            "discountRate": 0.08,
            "factoryPrice": 159988,
            "packagePrice": 159988,
            "marketPrice": 181804.55,
            "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控) (数据可能不全)"
        },
        {
            "model": "HC1000",
            "inputSpeedRange": [
                600,
                2100
            ],
            "ratios": [
                2,
                2.17,
                2.5,
                2.64,
                3.04,
                3.23,
                3.48,
                3.59,
                4.06,
                5.47,
                5.83
            ],
            "transferCapacity": [
                0.735,
                0.7265,
                0.718,
                0.7095,
                0.701,
                0.6925,
                0.684,
                0.6755,
                0.667,
                0.6585,
                0.65
            ],
            "thrust": 110,
            "centerDistance": 335,
            "weight": 1500,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 81200,
            "price": 81200,
            "discountRate": 0.06,
            "factoryPrice": 76328,
            "packagePrice": 76328,
            "marketPrice": 86736.36,
            "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)"
        },
        {
            "model": "HCD1000",
            "inputSpeedRange": [
                600,
                2100
            ],
            "ratios": [
                3.43,
                3.96,
                4.39,
                4.45,
                4.9,
                5.06,
                5.47,
                5.83
            ],
            "transferCapacity": [
                0.735,
                0.735,
                0.735,
                0.735,
                0.735,
                0.735,
                0.68,
                0.65
            ],
            "thrust": 140,
            "centerDistance": 450,
            "weight": 2200,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1082x1120x990",
            "efficiency": 0.97,
            "basePrice": 89800,
            "price": 89800,
            "discountRate": 0.06,
            "factoryPrice": 84412,
            "packagePrice": 84412,
            "marketPrice": 95922.73,
            "notes": "手控、无罩、高弹、A2型监控 (或手控、带罩、齿形块、A2型监控)"
        },
        {
            "model": "HCT1100",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                4.94,
                5.6,
                5.98,
                6.39,
                6.85,
                7.35,
                7.9,
                8.53,
                8.9
            ],
            "transferCapacity": [
                0.846,
                0.846,
                0.846,
                0.846,
                0.835,
                0.772,
                0.736,
                0.682,
                0.653
            ],
            "thrust": 150,
            "centerDistance": 500,
            "weight": 3200,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1150x1350x1547",
            "efficiency": 0.97,
            "basePrice": 128960,
            "price": 128960,
            "discountRate": 0.06,
            "factoryPrice": 121222.4,
            "packagePrice": 121222.4,
            "marketPrice": 137752.73,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCW1100",
            "inputSpeedRange": [
                1500,
                1800
            ],
            "ratios": [
                15.88,
                16.38,
                17.24,
                17.97,
                18.74,
                19.55,
                20.4,
                21.99
            ],
            "transferCapacity": [
                0.931,
                0.931,
                0.894,
                0.857,
                0.822,
                0.788,
                0.756,
                0.701
            ],
            "thrust": 300,
            "centerDistance": 625,
            "weight": 6900,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1567x1630x2550",
            "efficiency": 0.97,
            "basePrice": 257500,
            "price": 257500,
            "discountRate": 0.06,
            "factoryPrice": 242050,
            "packagePrice": 242050,
            "marketPrice": 275056.82,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HC1200",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                1.6,
                2.03,
                2.48,
                2.5,
                2.96,
                3.18,
                3.33,
                3.55,
                3.79,
                4.06,
                4.2,
                4.47
            ],
            "transferCapacity": [
                0.9378571428571434,
                0.9121829988193627,
                0.8862255017709563,
                0.8599846517119242,
                0.8334604486422664,
                0.806652892561983,
                0.7795619834710739,
                0.7521877213695392,
                0.7245301062573786,
                0.6965891381345924,
                0.6683648170011806,
                0.639857142857143
            ],
            "thrust": 120,
            "centerDistance": 380,
            "weight": 1870,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 92000,
            "price": 92000,
            "discountRate": 0.14,
            "factoryPrice": 79380,
            "packagePrice": 79380,
            "marketPrice": 90204.55,
            "notes": "手控、无罩、高弹、A1型监控 (报告特批)"
        },
        {
            "model": "HC1200/1",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                3.7,
                3.74,
                3.95,
                4.14,
                4.45,
                5,
                5.25,
                5.58
            ],
            "transferCapacity": [
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.833,
                0.695,
                0.65
            ],
            "thrust": 140,
            "centerDistance": 450,
            "weight": 2500,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1096x1260x1270",
            "efficiency": 0.97,
            "basePrice": 108200,
            "price": 108200,
            "discountRate": 0.1,
            "factoryPrice": 97000,
            "packagePrice": 97000,
            "marketPrice": 110227.27,
            "notes": "手控、无罩、高弹、A1型监控 (报告特批)"
        },
        {
            "model": "HCT1200",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                5.05,
                5.26,
                5.6,
                5.98,
                6.39,
                6.85,
                7.35,
                7.9
            ],
            "transferCapacity": [
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93
            ],
            "thrust": 150,
            "centerDistance": 500,
            "weight": 3200,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1188x1350x1547",
            "efficiency": 0.97,
            "basePrice": 143000,
            "price": 143000,
            "discountRate": 0.06,
            "factoryPrice": 134420,
            "packagePrice": 134420,
            "marketPrice": 152750,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT1200/1",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                8.55,
                9.16,
                9.57,
                10.08,
                10.74,
                11.05,
                11.45,
                12.17,
                12.53,
                12.92,
                13.65,
                14,
                14.54
            ],
            "transferCapacity": [
                0.93,
                0.93,
                0.93,
                0.93,
                0.83,
                0.82,
                0.78,
                0.74,
                0.72,
                0.7,
                0.65,
                0.625,
                0.6
            ],
            "thrust": 220,
            "centerDistance": 580,
            "weight": 3600,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1056x1430x1670",
            "efficiency": 0.97,
            "basePrice": 157000,
            "price": 157000,
            "discountRate": 0.06,
            "factoryPrice": 147580,
            "packagePrice": 147580,
            "marketPrice": 167690.91,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT1280/2",
            "inputSpeedRange": [
                700,
                1800
            ],
            "ratios": [
                8.04,
                8.46,
                8.9,
                9.38,
                9.88,
                10.43,
                11.03,
                11.98,
                12.36,
                13.13,
                13.54,
                13.96,
                14.32,
                15.21,
                16.19,
                17.27,
                18.47
            ],
            "transferCapacity": [
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.886,
                0.859,
                0.833,
                0.812,
                0.765,
                0.718,
                0.673,
                0.63
            ],
            "thrust": 240,
            "centerDistance": 680,
            "weight": 4600,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1290x1520x1775",
            "efficiency": 0.97,
            "basePrice": 165000,
            "price": 165000,
            "discountRate": 0.06,
            "factoryPrice": 155100,
            "packagePrice": 155100,
            "marketPrice": 176250,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCD1400",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                3.5,
                3.83,
                4.04,
                4.27,
                4.32,
                4.52,
                4.8,
                5.05,
                5.5,
                5.86
            ],
            "transferCapacity": [
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1,
                0.95
            ],
            "thrust": 175,
            "centerDistance": 485,
            "weight": 2800,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1260x1380x1360",
            "efficiency": 0.97,
            "basePrice": 139000,
            "price": 139000,
            "discountRate": 0.06,
            "factoryPrice": 130660,
            "packagePrice": 130660,
            "marketPrice": 148477.27,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT1400",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                4.06,
                4.51,
                5.03,
                5.52,
                5.97,
                6.48,
                7.03,
                7.5,
                8.01,
                8.47,
                8.59,
                8.98,
                9.12,
                9.55,
                11.06
            ],
            "transferCapacity": [
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1.081,
                1,
                0.96,
                0.93,
                0.9,
                0.85,
                0.737
            ],
            "thrust": 220,
            "centerDistance": 550,
            "weight": 3800,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1306x1380x1750",
            "efficiency": 0.97,
            "basePrice": 162500,
            "price": 162500,
            "discountRate": 0.06,
            "factoryPrice": 152750,
            "packagePrice": 152750,
            "marketPrice": 173579.55,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT1400/2",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                10.47,
                11.15,
                11.5,
                12.01,
                12.43,
                12.96,
                13.41,
                14.02,
                14.53,
                15.1,
                15.53,
                16,
                16.52,
                17.01,
                17.6,
                17.99,
                18.41,
                19.07
            ],
            "transferCapacity": [
                1.081,
                1.081,
                1.081,
                1.081,
                0.996,
                0.933,
                0.922,
                0.883,
                0.853,
                0.758,
                0.737,
                0.715,
                0.693,
                0.673,
                0.65,
                0.636,
                0.621,
                0.6
            ],
            "thrust": 220,
            "centerDistance": 722,
            "weight": 5500,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1279x1600x2100",
            "efficiency": 0.97,
            "basePrice": 205000,
            "price": 205000,
            "discountRate": 0.06,
            "factoryPrice": 192700,
            "packagePrice": 192700,
            "marketPrice": 218977.27,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCW1400",
            "inputSpeedRange": [
                1000,
                1800
            ],
            "ratios": [
                10.47,
                11.15,
                11.5,
                12.01,
                12.43,
                12.96,
                13.41,
                14.02,
                14.53,
                15.1,
                15.53,
                16,
                16.52,
                17.01,
                17.6,
                17.99,
                18.41,
                19.07
            ],
            "transferCapacity": [
                1
            ],
            "thrust": 250,
            "centerDistance": 700,
            "weight": 6000,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 204000,
            "price": 204000,
            "discountRate": 0.06,
            "factoryPrice": 191760,
            "packagePrice": 191760,
            "marketPrice": 217909.09,
            "notes": "手控、无罩、高弹、A2型监控 (数据可能不全)"
        },
        {
            "model": "HC1600",
            "inputSpeedRange": [
                500,
                1650
            ],
            "ratios": [
                2.03,
                2.54,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                1.26,
                1.2,
                1.1,
                1,
                0.9
            ],
            "thrust": 170,
            "centerDistance": 415,
            "weight": 3000,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 150000,
            "price": 150000,
            "discountRate": 0.06,
            "factoryPrice": 141000,
            "packagePrice": 141000,
            "marketPrice": 160227.27,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCD1600",
            "inputSpeedRange": [
                500,
                1650
            ],
            "ratios": [
                2.97,
                3.5,
                3.96,
                4.48,
                4.95,
                5.25,
                5.58,
                5.94
            ],
            "transferCapacity": [
                1.26,
                1.26,
                1.26,
                1.26,
                1.26,
                1.26,
                1.12,
                1.05
            ],
            "thrust": 200,
            "centerDistance": 520,
            "weight": 4000,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1291x1620x1590",
            "efficiency": 0.97,
            "basePrice": 165400,
            "price": 165400,
            "discountRate": 0.06,
            "factoryPrice": 155476,
            "packagePrice": 155476,
            "marketPrice": 176677.27,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT1600",
            "inputSpeedRange": [
                500,
                1650
            ],
            "ratios": [
                5.55,
                5.97,
                6.59,
                6.99,
                7.44,
                7.65,
                7.92,
                8.46,
                9,
                9.53,
                10.17,
                10.87,
                11.65,
                12.52
            ],
            "transferCapacity": [
                1.26,
                1.26,
                1.26,
                1.26,
                1.26,
                1.26,
                1.26,
                1.18,
                1.122,
                1.06,
                0.998,
                0.924,
                0.867,
                0.811
            ],
            "thrust": 250,
            "centerDistance": 585,
            "weight": 5000,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1246x1500x1750",
            "efficiency": 0.97,
            "basePrice": 194800,
            "price": 194800,
            "discountRate": 0.06,
            "factoryPrice": 183112,
            "packagePrice": 183112,
            "marketPrice": 208081.82,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT1600/1",
            "inputSpeedRange": [
                500,
                1650
            ],
            "ratios": [
                8.02,
                8.41,
                9.12,
                9.58,
                10.08,
                10.6,
                11.2,
                12,
                12.5,
                13.43,
                14.24,
                15.12,
                16.1,
                16.9
            ],
            "transferCapacity": [
                1.26,
                1.26,
                1.26,
                1.26,
                1.26,
                1.26,
                1.26,
                1.26,
                1.218,
                1.134,
                1.069,
                1.007,
                0.946,
                0.78
            ],
            "thrust": 270,
            "centerDistance": 680,
            "weight": 5500,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1280x1704x2040",
            "efficiency": 0.97,
            "basePrice": 223000,
            "price": 223000,
            "discountRate": 0.06,
            "factoryPrice": 209620,
            "packagePrice": 209620,
            "marketPrice": 238204.55,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HC2000",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                1.97,
                2.28,
                2.52,
                3.13,
                3.52,
                3.91
            ],
            "transferCapacity": [
                1.62,
                1.58,
                1.55,
                1.45,
                1.35,
                1.25
            ],
            "thrust": 190,
            "centerDistance": 450,
            "weight": 3700,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 180000,
            "price": 180000,
            "discountRate": 0.06,
            "factoryPrice": 169200,
            "packagePrice": 169200,
            "marketPrice": 192272.73,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCD2000",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                3,
                3.58,
                3.96,
                4.45,
                4.95,
                5.26,
                5.43,
                5.75,
                6.05
            ],
            "transferCapacity": [
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.57,
                1.48,
                1.36
            ],
            "thrust": 220,
            "centerDistance": 560,
            "weight": 4200,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1600X1620X1645",
            "efficiency": 0.97,
            "basePrice": 206000,
            "price": 206000,
            "discountRate": 0.06,
            "factoryPrice": 193640,
            "packagePrice": 193640,
            "marketPrice": 220045.45,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT2000",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                5.19,
                5.49,
                5.94,
                6.58,
                7.01,
                7.48,
                7.76,
                8,
                8.57,
                8.71,
                8.84,
                9.05,
                9.32,
                9.43,
                9.643,
                10.04,
                11
            ],
            "transferCapacity": [
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.55,
                1.55,
                1.41,
                1.38,
                1.34,
                1.3,
                1.287,
                1.18
            ],
            "thrust": 270,
            "centerDistance": 625,
            "weight": 5600,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1284x1600x1835",
            "efficiency": 0.97,
            "basePrice": 238000,
            "price": 238000,
            "discountRate": 0.06,
            "factoryPrice": 223720,
            "packagePrice": 223720,
            "marketPrice": 254227.27,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT2000/1",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                6.96,
                7.54,
                7.94,
                8.57,
                9.06,
                9.59,
                10.16,
                10.4,
                11.11,
                11.49,
                12.08,
                12.42,
                12.97,
                13.51,
                13.92
            ],
            "transferCapacity": [
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.58,
                1.48,
                1.43,
                1.4,
                1.246,
                1.18,
                1.18,
                1.18
            ],
            "thrust": 340,
            "centerDistance": 690,
            "weight": 7000,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1500x1760x1835",
            "efficiency": 0.97,
            "basePrice": 280000,
            "price": 280000,
            "discountRate": 0.06,
            "factoryPrice": 263200,
            "packagePrice": 263200,
            "marketPrice": 299090.91,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HC2700",
            "inputSpeedRange": [
                500,
                1600
            ],
            "ratios": [
                1.54,
                2.03,
                2.58,
                3.09,
                3.48,
                3.95,
                4.47
            ],
            "transferCapacity": [
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                1.85
            ],
            "thrust": 270,
            "centerDistance": 490,
            "weight": 4700,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1613x1670x1650",
            "efficiency": 0.97,
            "basePrice": 230000,
            "price": 230000,
            "discountRate": 0.06,
            "factoryPrice": 216200,
            "packagePrice": 216200,
            "marketPrice": 245681.82,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCD2700",
            "inputSpeedRange": [
                500,
                1600
            ],
            "ratios": [
                3.65,
                4.04,
                4.5,
                5.05,
                5.48,
                6.11
            ],
            "transferCapacity": [
                2.1,
                2.1,
                2.1,
                2.1,
                2.01,
                1.8
            ],
            "thrust": 280,
            "centerDistance": 630,
            "weight": 4930,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1400x1780x1530",
            "efficiency": 0.97,
            "basePrice": 280800,
            "price": 280800,
            "discountRate": 0.06,
            "factoryPrice": 264052.8,
            "packagePrice": 264052.8,
            "marketPrice": 300060,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT2700",
            "inputSpeedRange": [
                500,
                1600
            ],
            "ratios": [
                4.92,
                5.43,
                6.16,
                6.58,
                7.03,
                7.53,
                8.01,
                8.54,
                9.12,
                9.42,
                10.05,
                10.68,
                11.54
            ],
            "transferCapacity": [
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.035,
                1.906,
                1.844,
                1.73,
                1.627,
                1.5
            ],
            "thrust": 340,
            "centerDistance": 680,
            "weight": 7200,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1900x2000x1970",
            "efficiency": 0.97,
            "basePrice": 340000,
            "price": 340000,
            "discountRate": 0.06,
            "factoryPrice": 319600,
            "packagePrice": 319600,
            "marketPrice": 363181.82,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCT2700/1",
            "inputSpeedRange": [
                500,
                1600
            ],
            "ratios": [
                7.91,
                8.44,
                8.84,
                9.47,
                9.89,
                10.55,
                11.26,
                11.64,
                12.41
            ],
            "transferCapacity": [
                2.1,
                2.1,
                2.1,
                2.1,
                2.1,
                2.035,
                1.906,
                1.844,
                1.73
            ],
            "thrust": 450,
            "centerDistance": 800,
            "weight": 9000,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1900x2250x1950",
            "efficiency": 0.97,
            "basePrice": 390000,
            "price": 390000,
            "discountRate": 0.06,
            "factoryPrice": 366600,
            "packagePrice": 366600,
            "marketPrice": 416590.91,
            "notes": "手控、无罩、高弹、A2型监控"
        },
        {
            "model": "HCL30",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2
            ],
            "transferCapacity": [
                0.1
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 100,
            "controlType": "推拉软轴/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 5320,
            "price": 5320,
            "discountRate": 0.12,
            "factoryPrice": 4681.6,
            "packagePrice": 4681.6,
            "marketPrice": 5320,
            "notes": "手控、无罩、齿形块、A1型监控"
        },
        {
            "model": "HCL100",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2
            ],
            "transferCapacity": [
                0.1
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 100,
            "controlType": "推拉软轴/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 6760,
            "price": 6760,
            "discountRate": 0.12,
            "factoryPrice": 5948.8,
            "packagePrice": 5948.8,
            "marketPrice": 6760,
            "notes": "手控、无罩、齿形块、A1型监控"
        },
        {
            "model": "HCL250",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2
            ],
            "transferCapacity": [
                0.1
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 100,
            "controlType": "推拉软轴/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 8800,
            "price": 8800,
            "discountRate": 0.12,
            "factoryPrice": 7744,
            "packagePrice": 7744,
            "marketPrice": 8800,
            "notes": "手控、无罩、齿形块、A1型监控"
        },
        {
            "model": "HCL250A",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2
            ],
            "transferCapacity": [
                0.1
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 100,
            "controlType": "推拉软轴/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 8800,
            "price": 8800,
            "discountRate": 0.12,
            "factoryPrice": 7744,
            "packagePrice": 7744,
            "marketPrice": 8800,
            "notes": "手控、无罩、齿形块、A1型监控"
        },
        {
            "model": "HCL320",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2
            ],
            "transferCapacity": [
                0.1
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 100,
            "controlType": "推拉软轴/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 9100,
            "price": 9100,
            "discountRate": 0.12,
            "factoryPrice": 8008,
            "packagePrice": 8008,
            "marketPrice": 9100,
            "notes": "手控、无罩、齿形块、A1型监控"
        },
        {
            "model": "HCL320A",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2
            ],
            "transferCapacity": [
                0.1
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 100,
            "controlType": "推拉软轴/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 9100,
            "price": 9100,
            "discountRate": 0.12,
            "factoryPrice": 8008,
            "packagePrice": 8008,
            "marketPrice": 9100,
            "notes": "手控、无罩、齿形块、A1型监控"
        },
        {
            "model": "HCL600",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2
            ],
            "transferCapacity": [
                0.1
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 100,
            "controlType": "推拉软轴/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 21600,
            "price": 21600,
            "discountRate": 0.12,
            "factoryPrice": 19008,
            "packagePrice": 19008,
            "marketPrice": 21600,
            "notes": "电控、无罩、齿形块、A1型监控"
        },
        {
            "model": "06",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                2.52,
                3.05,
                3.5
            ],
            "transferCapacity": [
                0.004,
                0.004,
                0.004
            ],
            "thrust": 1.8,
            "centerDistance": 124,
            "weight": 58,
            "controlType": "手控",
            "dimensions": "350x316x482",
            "efficiency": 0.95,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0.16,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格，折扣率参照HC系列)"
        },
        {
            "model": "16A",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                1.97,
                2.52,
                3.03,
                3.54,
                3.95,
                4.5,
                5.06,
                5.47
            ],
            "transferCapacity": [
                0.012,
                0.012,
                0.012,
                0.012,
                0.012,
                0.011,
                0.01,
                0.009
            ],
            "thrust": 3.5,
            "centerDistance": 135,
            "weight": 84,
            "controlType": "手控",
            "dimensions": "422x325x563",
            "efficiency": 0.96,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0.16,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格，折扣率参照HC系列)"
        },
        {
            "model": "MA100",
            "inputSpeedRange": [
                1500,
                3000
            ],
            "ratios": [
                1.6,
                2,
                2.55,
                3.11,
                3.59,
                3.88
            ],
            "transferCapacity": [
                0.009,
                0.009,
                0.007,
                0.007,
                0.006,
                0.006
            ],
            "thrust": 3,
            "centerDistance": 100,
            "weight": 75,
            "controlType": "推拉软轴",
            "dimensions": "236x390x420",
            "efficiency": 0.95,
            "basePrice": 0,
            "price": 0,
            "factoryPrice": 0,
            "discountRate": 0.12,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格，折扣率参照MB系列)"
        },
        {
            "model": "MA125",
            "inputSpeedRange": [
                1500,
                3000
            ],
            "ratios": [
                1.97,
                2.52,
                3.04,
                3.54,
                3.96,
                4.65,
                5.06,
                5.47,
                5.81
            ],
            "transferCapacity": [
                0.02,
                0.02,
                0.018,
                0.016,
                0.014,
                0.011,
                0.01,
                0.009,
                0.008
            ],
            "thrust": 5.5,
            "centerDistance": 125,
            "weight": 115,
            "controlType": "推拉软轴",
            "dimensions": "291x454x485",
            "efficiency": 0.96,
            "basePrice": 0,
            "price": 0,
            "factoryPrice": 0,
            "discountRate": 0.12,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格，折扣率参照MB系列)"
        },
        {
            "model": "MA142",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1.97,
                2.52,
                3.03,
                3.54,
                3.95,
                4.5,
                5.06,
                5.47
            ],
            "transferCapacity": [
                0.03,
                0.03,
                0.03,
                0.026,
                0.023,
                0.019,
                0.016,
                0.013
            ],
            "thrust": 8.5,
            "centerDistance": 142,
            "weight": 140,
            "controlType": "推拉软轴",
            "dimensions": "308x520x540",
            "efficiency": 0.96,
            "basePrice": 0,
            "price": 0,
            "factoryPrice": 0,
            "discountRate": 0.12,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格，折扣率参照MB系列)"
        },
        {
            "model": "HC350-1",
            "inputSpeedRange": [
                750,
                2500
            ],
            "ratios": [
                2.96,
                3.48,
                3.68,
                4.1,
                4.42,
                5
            ],
            "transferCapacity": [
                0.26,
                0.257,
                0.257,
                0.223,
                0.186,
                0.157
            ],
            "thrust": 50,
            "centerDistance": 264,
            "weight": 520,
            "controlType": "推拉软轴/电控",
            "dimensions": "604x886x880",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "factoryPrice": 0,
            "discountRate": 0.16,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格，折扣率参照HC系列)"
        },
        {
            "model": "HCD350",
            "inputSpeedRange": [
                750,
                2500
            ],
            "ratios": [
                4.08,
                4.81,
                5.55,
                5.1,
                5.47,
                6.2
            ],
            "transferCapacity": [
                0.26,
                0.245,
                0.245,
                0.223,
                0.186,
                0.157
            ],
            "thrust": 50,
            "centerDistance": 315,
            "weight": 590,
            "controlType": "推拉软轴/电控",
            "dimensions": "610×915×987",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "factoryPrice": 0,
            "discountRate": 0.16,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格，折扣率参照HC系列)"
        },
        {
            "model": "HCT650/2",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                9.51,
                10.06,
                10.45,
                11.03,
                11.46,
                11.98,
                12.52,
                13.09,
                13.64,
                14.1,
                14.48,
                15.01,
                15.55,
                15.98,
                16.42,
                16.97,
                17.44,
                18.06
            ],
            "transferCapacity": [
                0.49,
                0.49,
                0.483,
                0.483,
                0.452,
                0.452,
                0.445,
                0.445,
                0.414,
                0.414,
                0.402,
                0.389,
                0.366,
                0.329,
                0.32,
                0.309,
                0.301,
                0.29
            ],
            "thrust": 160,
            "centerDistance": 550,
            "weight": 2230,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "966x1224x1515",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0.12,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (折扣率参照同系列型号)"
        },
        {
            "model": "HC1201",
            "inputSpeedRange": [
                700,
                1500
            ],
            "ratios": [
                2.5,
                3,
                3.43,
                3.96,
                4.17,
                4.39,
                4.9,
                5.47
            ],
            "transferCapacity": [
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.83,
                0.73
            ],
            "thrust": 140,
            "centerDistance": 450,
            "weight": 1850,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "963x1300x1290",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0.16,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (折扣率参照同系列型号)"
        },
        {
            "model": "HCT1400/5",
            "inputSpeedRange": [
                700,
                1800
            ],
            "ratios": [
                8.98,
                9.47,
                10,
                10.58,
                11.2,
                11.88,
                12.42,
                12.96,
                13.45,
                13.89,
                14.36,
                14.93
            ],
            "transferCapacity": [
                1.035,
                1.035,
                1.035,
                1.035,
                1.035,
                0.93,
                0.93,
                0.9,
                0.86,
                0.833,
                0.812,
                0.765
            ],
            "thrust": 190,
            "centerDistance": 680,
            "weight": 3850,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1220x1400x1650",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0.16,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (折扣率参照同系列型号)"
        },
        {
            "model": "HCD1500",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                3.5,
                3.83,
                4.04,
                4.27,
                4.32,
                4.52
            ],
            "transferCapacity": [
                1.2,
                1.2,
                1.2,
                1.2,
                1.2,
                1.2
            ],
            "thrust": 175,
            "centerDistance": 485,
            "weight": 2800,
            "controlType": "推拉软轴/电控/气控",
            "dimensions": "1260X1380X1360",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0.16,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (折扣率参照同系列型号)"
        },
        {
            "model": "26",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2.03,
                2.46,
                3.04,
                3.57,
                4.05,
                4.39,
                4.7
            ],
            "transferCapacity": [
                0.0199,
                0.0199,
                0.019,
                0.0177,
                0.016,
                0.014,
                0.013
            ],
            "thrust": 5,
            "centerDistance": 135,
            "weight": 92,
            "controlType": "手控",
            "dimensions": "473.5x365x830",
            "efficiency": 0.96,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0.16,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (折扣率参照HC系列)"
        },
        {
            "model": "HC1250",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                1.6,
                2.03,
                2.5,
                2.96,
                3.55,
                4.06,
                4.47
            ],
            "transferCapacity": [
                0.969,
                0.969,
                0.969,
                0.969,
                0.969,
                0.969,
                0.969
            ],
            "thrust": 125,
            "centerDistance": 408,
            "weight": 1948,
            "efficiency": 0.97,
            "basePrice": 277000,
            "price": 277000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 581,
                "max": 1841
            },
            "image": "/images/gearbox/Advance-1100-1200.webp"
        },
        {
            "model": "HC200",
            "inputSpeedRange": [
                1000,
                2200
            ],
            "ratios": [
                1.48,
                1.94,
                2.45,
                2.96,
                3.35,
                4,
                4.53,
                5.06,
                5.47
            ],
            "transferCapacity": [
                0.131,
                0.131,
                0.131,
                0.131,
                0.131,
                0.118,
                0.106,
                0.094,
                0.087
            ],
            "thrust": 27.5,
            "centerDistance": 190,
            "weight": 280,
            "dimensions": "424×792×754",
            "efficiency": 0.97,
            "basePrice": 27200,
            "price": 27200,
            "discountRate": 0,
            "powerRange": {
                "min": 87,
                "max": 288
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HC201",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2.48,
                2.96,
                3.53
            ],
            "transferCapacity": [
                0.147,
                0.147,
                0.132
            ],
            "thrust": 30,
            "centerDistance": 205,
            "weight": 350,
            "dimensions": "488×691×758",
            "efficiency": 0.97,
            "basePrice": 30600,
            "price": 30600,
            "discountRate": 0.1,
            "powerRange": {
                "min": 132,
                "max": 368
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HC2400",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                1.97,
                2.48,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                1.8,
                1.8,
                1.8,
                1.8,
                1.8
            ],
            "thrust": 240,
            "centerDistance": 470,
            "weight": 4000,
            "dimensions": "1350×1520×1370",
            "efficiency": 0.97,
            "basePrice": 105000,
            "price": 105000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1080,
                "max": 2700
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HC500",
            "inputSpeedRange": [
                800,
                2100
            ],
            "ratios": [
                1.5,
                1.77,
                2.04,
                2.5,
                2.86,
                3,
                3.48
            ],
            "transferCapacity": [
                0.4,
                0.4,
                0.4,
                0.4,
                0.4,
                0.4,
                0.4
            ],
            "thrust": 82,
            "centerDistance": 264,
            "weight": 800,
            "dimensions": "900×897×680",
            "efficiency": 0.97,
            "basePrice": 53000,
            "price": 53000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 320,
                "max": 840
            },
            "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HC65",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.037,
                0.034,
                0.03,
                0.027,
                0.024
            ],
            "thrust": 14.7,
            "centerDistance": 142,
            "weight": 130,
            "dimensions": "351×380×544",
            "efficiency": 0.97,
            "basePrice": 12000,
            "price": 12000,
            "discountRate": 0,
            "powerRange": {
                "min": 24,
                "max": 93
            },
            "image": "/images/gearbox/Advance-HC65.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HC85",
            "ratios": [
                2.04,
                2.59,
                3.11,
                3.58,
                4.12
            ],
            "transferCapacity": [
                0.052,
                0.047,
                0.043,
                0.039,
                0.035
            ],
            "weight": 52,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD0FM",
            "ratios": [
                1.09,
                1.52,
                1.97,
                2.48
            ],
            "transferCapacity": [
                0.036,
                0.036,
                0.03,
                0.025
            ],
            "weight": 28,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD1000/2",
            "ratios": [
                2.04,
                2.52,
                3.04,
                3.57,
                4,
                4.47
            ],
            "transferCapacity": [
                0.74,
                0.74,
                0.74,
                0.74,
                0.74,
                0.66
            ],
            "weight": 2000,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD1200",
            "inputSpeedRange": [
                700,
                1900
            ],
            "ratios": [
                2.5,
                3,
                3.43,
                3.7,
                3.74,
                3.95,
                4.14,
                4.45,
                5,
                5.25,
                5.58
            ],
            "transferCapacity": [
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                0.93,
                0.809,
                0.735
            ],
            "thrust": 140,
            "centerDistance": 450,
            "weight": 1850,
            "dimensions": "962×1300×1290",
            "efficiency": 0.97,
            "basePrice": 255000,
            "price": 255000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 515,
                "max": 1957
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD1580",
            "inputSpeedRange": [
                600,
                1650
            ],
            "ratios": [
                3.5,
                3.83,
                4.04,
                4.27,
                4.32,
                4.8,
                5.05,
                5.5,
                5.86
            ],
            "transferCapacity": [
                1.23,
                1.23,
                1.23,
                1.23,
                1.23,
                1.23,
                1.23,
                1.23,
                1.045
            ],
            "thrust": 175,
            "centerDistance": 485,
            "weight": 2800,
            "dimensions": "1260×1380×1360",
            "efficiency": 0.97,
            "basePrice": 168000,
            "price": 168000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 627,
                "max": 2030
            },
            "image": "/images/gearbox/Advance-1400.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD1FM",
            "ratios": [
                1.09,
                1.52,
                1.97,
                2.48
            ],
            "transferCapacity": [
                0.05,
                0.05,
                0.042,
                0.035
            ],
            "weight": 38,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD2000/2",
            "ratios": [
                2.04,
                2.52,
                3,
                3.5
            ],
            "transferCapacity": [
                1.5,
                1.5,
                1.5,
                1.5
            ],
            "weight": 4200,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD2400",
            "inputSpeedRange": [
                600,
                1600
            ],
            "ratios": [
                3,
                3.46,
                3.96,
                4.59,
                4.95,
                5.53
            ],
            "transferCapacity": [
                1.8,
                1.8,
                1.8,
                1.8,
                1.8,
                1.8
            ],
            "thrust": 250,
            "centerDistance": 580,
            "weight": 4300,
            "dimensions": "1450×1720×1670",
            "efficiency": 0.97,
            "basePrice": 211000,
            "price": 211000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1080,
                "max": 2880
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD2FM",
            "ratios": [
                1.55,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.058,
                0.058,
                0.048,
                0.04
            ],
            "weight": 45,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD3800",
            "inputSpeedRange": [
                500,
                1200
            ],
            "ratios": [
                2.97,
                3.54,
                4.08,
                4.52,
                5.05,
                5.45,
                6.05
            ],
            "transferCapacity": [
                2.825,
                2.825,
                2.825,
                2.825,
                2.825,
                2.8,
                2.375
            ],
            "thrust": 340,
            "centerDistance": 660,
            "weight": 8000,
            "dimensions": "1665×1810×1800",
            "efficiency": 0.97,
            "basePrice": 255000,
            "price": 255000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1188,
                "max": 3390
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD400",
            "ratios": [
                1.48,
                1.94,
                2.45,
                2.96,
                3.55,
                3.95,
                4.45,
                5.05,
                5.54
            ],
            "transferCapacity": [
                0.28,
                0.28,
                0.28,
                0.28,
                0.28,
                0.28,
                0.252,
                0.222,
                0.201
            ],
            "weight": 620,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD440",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                4,
                4.48,
                4.75,
                5.05,
                5.52,
                6
            ],
            "transferCapacity": [
                0.352,
                0.352,
                0.352,
                0.352,
                0.352,
                0.352
            ],
            "thrust": 80,
            "centerDistance": 351,
            "weight": 782,
            "efficiency": 0.97,
            "basePrice": 85000,
            "price": 85000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 352,
                "max": 739
            },
            "image": "/images/gearbox/Advance-HCD400A.webp"
        },
        {
            "model": "HCD450",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                4,
                4.48,
                4.75,
                5.05,
                5.52,
                6
            ],
            "transferCapacity": [
                0.36,
                0.331,
                0.331,
                0.331,
                0.294,
                0.279
            ],
            "thrust": 82,
            "centerDistance": 355,
            "weight": 800,
            "dimensions": "761×984×1040",
            "efficiency": 0.97,
            "basePrice": 84250,
            "price": 84250,
            "discountRate": 0.1,
            "powerRange": {
                "min": 279,
                "max": 756
            },
            "image": "/images/gearbox/Advance-HCD400A.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD450P",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                4,
                4.48,
                4.75,
                5.05,
                5.52,
                6
            ],
            "transferCapacity": [
                0.36,
                0.36,
                0.36,
                0.36,
                0.36,
                0.36
            ],
            "thrust": 82,
            "centerDistance": 355,
            "weight": 800,
            "dimensions": "761×984×1040",
            "efficiency": 0.97,
            "basePrice": 87000,
            "price": 87000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 360,
                "max": 756
            },
            "image": "/images/gearbox/Advance-HCD400A.webp"
        },
        {
            "model": "HCD600/2",
            "ratios": [
                2.04,
                2.96,
                3.45,
                3.94,
                4.45,
                4.89
            ],
            "transferCapacity": [
                0.42,
                0.42,
                0.42,
                0.38,
                0.34,
                0.31
            ],
            "weight": 950,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD68",
            "ratios": [
                2.05,
                2.45,
                2.96,
                3.55
            ],
            "transferCapacity": [
                0.038,
                0.035,
                0.031,
                0.027
            ],
            "weight": 48,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD700",
            "inputSpeedRange": [
                600,
                1800
            ],
            "ratios": [
                3.96,
                4.25,
                4.41,
                4.48,
                4.95,
                5.56,
                5.94
            ],
            "transferCapacity": [
                0.55,
                0.55,
                0.53,
                0.53,
                0.515,
                0.515,
                0.5
            ],
            "thrust": 90,
            "centerDistance": 430,
            "weight": 1328,
            "dimensions": "741×1182×1186",
            "efficiency": 0.97,
            "basePrice": 255000,
            "price": 255000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 300,
                "max": 990
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCD800/2",
            "ratios": [
                2.04,
                2.52,
                3.04,
                3.57,
                4,
                4.47
            ],
            "transferCapacity": [
                0.52,
                0.52,
                0.52,
                0.52,
                0.52,
                0.47
            ],
            "weight": 1350,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDS1200",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                3.95,
                4.45,
                5,
                5.58
            ],
            "transferCapacity": [
                0.93,
                0.93,
                0.833,
                0.65
            ],
            "thrust": 0.93,
            "centerDistance": 140,
            "dimensions": "450",
            "efficiency": 0.97,
            "basePrice": 133000,
            "price": 133000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 390,
                "max": 1767
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDS1400",
            "inputSpeedRange": [
                600,
                1800
            ],
            "ratios": [
                4.04,
                4.52,
                5.05,
                5.5,
                5.86
            ],
            "transferCapacity": [
                1.03,
                1.03,
                1.03,
                1.03,
                0.95
            ],
            "thrust": 1.03,
            "centerDistance": 175,
            "dimensions": "485",
            "efficiency": 0.97,
            "basePrice": 146000,
            "price": 146000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 570,
                "max": 1854
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDS1600",
            "inputSpeedRange": [
                500,
                1650
            ],
            "ratios": [
                2.97,
                3.5,
                3.96,
                4.48,
                4.95,
                5.25
            ],
            "transferCapacity": [
                1.213,
                1.213,
                1.213,
                1.213,
                1.213,
                1.164
            ],
            "thrust": 200,
            "centerDistance": 520,
            "efficiency": 0.97,
            "powerRange": {
                "min": 582,
                "max": 2001
            },
            "image": "/images/gearbox/Advance-1600.webp",
            "notes": "双速齿轮箱，具有顺快、顺慢、倒车功能",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDS2000",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                3,
                3.58,
                3.96,
                4.45,
                4.95,
                5.26,
                5.43,
                5.75,
                6.05
            ],
            "transferCapacity": [
                1.48,
                1.48,
                1.48,
                1.48,
                1.42,
                1.34,
                1.23,
                1.19,
                1.19
            ],
            "thrust": 220,
            "centerDistance": 560,
            "efficiency": 0.97,
            "powerRange": {
                "min": 714,
                "max": 2220
            },
            "image": "/images/gearbox/Advance-HCD400A.webp",
            "notes": "双速齿轮箱，具有顺快、顺慢、倒车功能",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDS2700",
            "inputSpeedRange": [
                500,
                1400
            ],
            "ratios": [
                3.65,
                4.04,
                4.5,
                5.05,
                5.48,
                6.11
            ],
            "transferCapacity": [
                2.05,
                2.05,
                2.05,
                2.05,
                1.96,
                1.7
            ],
            "thrust": 2.05,
            "centerDistance": 280,
            "dimensions": "630",
            "efficiency": 0.97,
            "basePrice": 230500,
            "price": 230500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 850,
                "max": 2870
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDS302",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                4,
                4.48,
                5.05,
                5.52,
                5.9,
                6.56,
                7.06,
                7.63
            ],
            "transferCapacity": [
                0.257,
                0.257,
                0.257,
                0.221,
                0.2,
                0.184,
                0.147,
                0.13
            ],
            "thrust": 0.257,
            "centerDistance": 60,
            "dimensions": "355",
            "efficiency": 0.97,
            "basePrice": 74630,
            "price": 74630,
            "discountRate": 0.1,
            "powerRange": {
                "min": 130,
                "max": 643
            },
            "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDS400",
            "inputSpeedRange": [
                1000,
                1800
            ],
            "ratios": [
                3.96,
                4.43,
                5,
                5.53,
                5.89
            ],
            "transferCapacity": [
                0.331,
                0.331,
                0.331,
                0.3,
                0.28
            ],
            "thrust": 0.331,
            "centerDistance": 82,
            "dimensions": "355",
            "efficiency": 0.97,
            "basePrice": 81000,
            "price": 81000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 280,
                "max": 596
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDS600",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                4.18,
                4.43,
                5,
                5.44,
                5.71
            ],
            "transferCapacity": [
                0.48,
                0.48,
                0.45,
                0.41,
                0.38
            ],
            "thrust": 0.48,
            "centerDistance": 90,
            "dimensions": "415",
            "efficiency": 0.97,
            "basePrice": 94000,
            "price": 94000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 380,
                "max": 1008
            },
            "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDS800",
            "inputSpeedRange": [
                600,
                1800
            ],
            "ratios": [
                3.96,
                4.39,
                4.9,
                5.47,
                5.89
            ],
            "transferCapacity": [
                0.625,
                0.625,
                0.58,
                0.54,
                0.5
            ],
            "thrust": 0.625,
            "centerDistance": 110,
            "dimensions": "450",
            "efficiency": 0.97,
            "basePrice": 107000,
            "price": 107000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 300,
                "max": 1125
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDX300",
            "ratios": [
                2.04,
                2.48,
                2.95,
                3.45,
                3.96
            ],
            "transferCapacity": [
                0.21,
                0.21,
                0.21,
                0.189,
                0.165
            ],
            "weight": 180,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDX400",
            "ratios": [
                2.04,
                2.48,
                2.95,
                3.45,
                3.96,
                4.48
            ],
            "transferCapacity": [
                0.28,
                0.28,
                0.28,
                0.28,
                0.252,
                0.222
            ],
            "weight": 260,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDX600",
            "ratios": [
                2.04,
                2.52,
                3,
                3.57,
                4,
                4.48,
                5.05
            ],
            "transferCapacity": [
                0.452,
                0.452,
                0.452,
                0.452,
                0.452,
                0.407,
                0.36
            ],
            "weight": 400,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCDX800",
            "ratios": [
                2.04,
                2.48,
                3,
                3.5,
                4,
                4.47,
                5.05
            ],
            "transferCapacity": [
                0.52,
                0.52,
                0.52,
                0.52,
                0.52,
                0.468,
                0.414
            ],
            "weight": 550,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG1068",
            "inputSpeedRange": [
                1500,
                4000
            ],
            "ratios": [
                1.26,
                1.51,
                1.93,
                2.48,
                2.78
            ],
            "transferCapacity": [
                2.9,
                2.9,
                2.9,
                2.9,
                2.9
            ],
            "weight": 46,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 4350,
                "max": 11600
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG1220",
            "inputSpeedRange": [
                1500,
                4500
            ],
            "ratios": [
                1,
                1.96,
                2.48,
                3
            ],
            "transferCapacity": [
                0.098,
                0.0915,
                0.085,
                0.0915
            ],
            "thrust": 16,
            "centerDistance": 135,
            "weight": 63,
            "efficiency": 0.97,
            "basePrice": 126500,
            "price": 126500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 128,
                "max": 441
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG1280-1",
            "inputSpeedRange": [
                1500,
                3600
            ],
            "ratios": [
                1,
                1.3,
                2,
                2.48,
                3
            ],
            "transferCapacity": [
                0.139,
                0.1243,
                0.12,
                0.1243,
                0.114
            ],
            "thrust": 16,
            "centerDistance": 146,
            "weight": 73,
            "efficiency": 0.97,
            "basePrice": 131000,
            "price": 131000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 171,
                "max": 500
            },
            "image": "/images/gearbox/Advance-1400.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG1305-3",
            "inputSpeedRange": [
                1500,
                3000
            ],
            "ratios": [
                1.22,
                1.97,
                2.5,
                2.92
            ],
            "transferCapacity": [
                0.219,
                0.1985,
                0.178,
                0.1985
            ],
            "thrust": 25,
            "centerDistance": 155,
            "weight": 120,
            "efficiency": 0.97,
            "basePrice": 132875,
            "price": 132875,
            "discountRate": 0.1,
            "powerRange": {
                "min": 267,
                "max": 657
            },
            "image": "/images/gearbox/Advance-1400.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG1400",
            "inputSpeedRange": [
                1500,
                3000
            ],
            "ratios": [
                1,
                1.11,
                1.53,
                1.78,
                2.03,
                2.21,
                2.6
            ],
            "transferCapacity": [
                2.96,
                2.96,
                2.96,
                2.96,
                2.96,
                2.96,
                2.96
            ],
            "weight": 160,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 4440,
                "max": 8880
            },
            "image": "/images/gearbox/Advance-1400.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG1500",
            "inputSpeedRange": [
                1500,
                3000
            ],
            "ratios": [
                1.11,
                1.13,
                1.26,
                1.5,
                1.74,
                1.97,
                2
            ],
            "transferCapacity": [
                2.59,
                2.59,
                2.59,
                2.59,
                2.59,
                2.59,
                2.59
            ],
            "weight": 185,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3885,
                "max": 7770
            },
            "image": "/images/gearbox/Advance-1400.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG1665",
            "inputSpeedRange": [
                1500,
                3000
            ],
            "ratios": [
                1.11,
                1.26,
                1.74,
                2,
                2.59
            ],
            "transferCapacity": [
                2.59,
                2.59,
                2.59,
                2.59,
                2.59
            ],
            "weight": 248,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3885,
                "max": 7770
            },
            "image": "/images/gearbox/Advance-1600.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG2050",
            "inputSpeedRange": [
                1500,
                2600
            ],
            "ratios": [
                1.5,
                2.03,
                2.04,
                2.5,
                2.52
            ],
            "transferCapacity": [
                3,
                3,
                3,
                3,
                3
            ],
            "weight": 342,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 4500,
                "max": 7800
            },
            "image": "/images/gearbox/Advance-2000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG3050",
            "inputSpeedRange": [
                1000,
                2600
            ],
            "ratios": [
                1.35,
                1.5,
                2.03,
                2.04,
                2.5
            ],
            "transferCapacity": [
                3,
                3,
                3,
                3,
                3
            ],
            "weight": 570,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3000,
                "max": 7800
            },
            "image": "/images/gearbox/Advance-2700.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG5050",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1.53,
                2.03,
                2.5,
                2.96
            ],
            "transferCapacity": [
                0.943,
                0.9487,
                0.903,
                1
            ],
            "thrust": 110,
            "centerDistance": 340,
            "weight": 950,
            "efficiency": 0.97,
            "basePrice": 413750,
            "price": 413750,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1355,
                "max": 2500
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG6400",
            "inputSpeedRange": [
                1600,
                2100
            ],
            "ratios": [
                1.48,
                2.02,
                2.55,
                3.07
            ],
            "transferCapacity": [
                1.031,
                1.031,
                1.031,
                0.89
            ],
            "weight": 950,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1424,
                "max": 2165
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG7650",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.55,
                1.83,
                2.04,
                2.23
            ],
            "transferCapacity": [
                2.77,
                2.77,
                2.77,
                2.77
            ],
            "weight": 1230,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2770,
                "max": 5817
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCG9060",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.58,
                1.66,
                2.04,
                2.54,
                2.74
            ],
            "transferCapacity": [
                2.96,
                2.96,
                2.96,
                2.96,
                2.96
            ],
            "weight": 1575,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2960,
                "max": 6216
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL1000",
            "inputSpeedRange": [
                750,
                1000
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                1.047
            ],
            "weight": 800,
            "dimensions": "915×800×1005",
            "efficiency": 0.97,
            "basePrice": 100000,
            "price": 100000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 785,
                "max": 1047
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL1000F",
            "inputSpeedRange": [
                1000,
                1800
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                1.047
            ],
            "weight": 800,
            "dimensions": "915×800×1005",
            "efficiency": 0.97,
            "basePrice": 100000,
            "price": 100000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1047,
                "max": 1885
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL1000S",
            "inputSpeedRange": [
                750,
                1000
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                1.047
            ],
            "weight": 800,
            "dimensions": "915×800×1005",
            "efficiency": 0.97,
            "basePrice": 100000,
            "price": 100000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 785,
                "max": 1047
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL100F",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.105
            ],
            "thrust": 210,
            "centerDistance": 210,
            "weight": 156,
            "dimensions": "570×420×535",
            "efficiency": 0.97,
            "basePrice": 45000,
            "price": 45000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 158,
                "max": 263
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL100S",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.105
            ],
            "thrust": 156,
            "centerDistance": 156,
            "weight": 156,
            "dimensions": "570×420×535",
            "efficiency": 0.97,
            "basePrice": 36000,
            "price": 36000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 79,
                "max": 158
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL250F",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.262
            ],
            "thrust": 210,
            "centerDistance": 210,
            "weight": 210,
            "dimensions": "554×425×635",
            "efficiency": 0.97,
            "basePrice": 60000,
            "price": 60000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 262,
                "max": 655
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL250S",
            "inputSpeedRange": [
                750,
                1000
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.262
            ],
            "thrust": 210,
            "centerDistance": 210,
            "weight": 210,
            "dimensions": "554×425×635",
            "efficiency": 0.97,
            "basePrice": 36000,
            "price": 36000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 197,
                "max": 262
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL30F",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.031
            ],
            "thrust": 156,
            "centerDistance": 156,
            "weight": 100,
            "dimensions": "345×310×455",
            "efficiency": 0.97,
            "basePrice": 36000,
            "price": 36000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 47,
                "max": 78
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL30S",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.031
            ],
            "thrust": 100,
            "centerDistance": 100,
            "weight": 100,
            "dimensions": "345×310×455",
            "efficiency": 0.97,
            "basePrice": 30000,
            "price": 30000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 23,
                "max": 47
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL320F",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.335
            ],
            "thrust": 450,
            "centerDistance": 450,
            "weight": 210,
            "dimensions": "554×425×635",
            "efficiency": 0.97,
            "basePrice": 60000,
            "price": 60000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 335,
                "max": 838
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL320S",
            "inputSpeedRange": [
                500,
                1000
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.335
            ],
            "thrust": 210,
            "centerDistance": 210,
            "weight": 210,
            "dimensions": "554×425×635",
            "efficiency": 0.97,
            "basePrice": 36000,
            "price": 36000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 168,
                "max": 335
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL600F",
            "inputSpeedRange": [
                1000,
                1600
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.628
            ],
            "thrust": 450,
            "centerDistance": 450,
            "weight": 450,
            "dimensions": "746×560×688",
            "efficiency": 0.97,
            "basePrice": 45000,
            "price": 45000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 628,
                "max": 1005
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL600S",
            "inputSpeedRange": [
                750,
                1000
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.628
            ],
            "thrust": 450,
            "centerDistance": 450,
            "weight": 450,
            "dimensions": "746×560×688",
            "efficiency": 0.97,
            "basePrice": 45000,
            "price": 45000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 471,
                "max": 628
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL7000",
            "inputSpeedRange": [
                500,
                1200
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                5.83
            ],
            "thrust": 700,
            "centerDistance": 2207,
            "weight": 7000,
            "efficiency": 0.97,
            "basePrice": 804000,
            "price": 804000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2915,
                "max": 6996
            },
            "image": "/images/gearbox/Advance-800-1000.webp"
        },
        {
            "model": "HCL800",
            "inputSpeedRange": [
                750,
                1800
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.837
            ],
            "weight": 450,
            "dimensions": "746×560×688",
            "efficiency": 0.97,
            "basePrice": 83000,
            "price": 83000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 628,
                "max": 1507
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL800F",
            "inputSpeedRange": [
                1000,
                1800
            ],
            "ratios": [
                1.5,
                1.77,
                2.04,
                2.5,
                2.86,
                3
            ],
            "transferCapacity": [
                3,
                3,
                3,
                3,
                3,
                3
            ],
            "thrust": 10,
            "centerDistance": 800,
            "weight": 450,
            "efficiency": 0.97,
            "basePrice": 90000,
            "price": 90000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3000,
                "max": 5400
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCL800S",
            "inputSpeedRange": [
                750,
                1000
            ],
            "ratios": [
                1.5,
                1.77,
                2.04,
                2.5,
                2.86,
                3
            ],
            "transferCapacity": [
                3,
                3,
                3,
                3,
                3,
                3
            ],
            "thrust": 450,
            "centerDistance": 450,
            "weight": 450,
            "efficiency": 0.97,
            "basePrice": 60000,
            "price": 60000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2250,
                "max": 3000
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCNM280T",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1,
                1.03,
                1.15,
                1.16,
                1.19,
                1.49,
                2.48
            ],
            "transferCapacity": [
                2.48,
                2.48,
                2.48,
                2.48,
                2.48,
                2.48,
                2.48
            ],
            "thrust": 180,
            "centerDistance": 180,
            "weight": 260,
            "efficiency": 0.97,
            "basePrice": 150000,
            "price": 150000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2480,
                "max": 5208
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCS1000",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                2.5,
                3.04,
                3.48,
                4.06
            ],
            "transferCapacity": [
                1.59,
                1.68,
                1.72,
                1.77
            ],
            "thrust": 0.735,
            "centerDistance": 110,
            "dimensions": "335",
            "efficiency": 0.97,
            "basePrice": 110000,
            "price": 110000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 954,
                "max": 3363
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCS1200",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                2.03,
                2.5,
                2.96,
                3.55,
                4.06,
                4.47
            ],
            "transferCapacity": [
                1.61,
                1.69,
                1.74,
                1.79,
                1.85,
                2.03
            ],
            "thrust": 0.93,
            "centerDistance": 120,
            "dimensions": "380",
            "efficiency": 0.97,
            "basePrice": 126000,
            "price": 126000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 966,
                "max": 3857
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCS1600",
            "inputSpeedRange": [
                500,
                1650
            ],
            "ratios": [
                2.03,
                2.54,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                1.63,
                1.68,
                1.76,
                1.81,
                1.86
            ],
            "thrust": 1.213,
            "centerDistance": 170,
            "dimensions": "415",
            "efficiency": 0.97,
            "basePrice": 158000,
            "price": 158000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 815,
                "max": 3069
            },
            "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCS200",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                2.28,
                2.52,
                3.13,
                3.52,
                3.91,
                4.4
            ],
            "transferCapacity": [
                2.06,
                2.06,
                2.06,
                2.06,
                2.06,
                2.06
            ],
            "thrust": 148,
            "centerDistance": 190,
            "efficiency": 0.97,
            "basePrice": 109000,
            "price": 109000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1236,
                "max": 3090
            },
            "image": "/images/gearbox/Advance-200-201-230.webp"
        },
        {
            "model": "HCS2000",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                2.28,
                2.52,
                3.13,
                3.52,
                3.91,
                4.4
            ],
            "transferCapacity": [
                1.83,
                1.89,
                1.94,
                1.93,
                2.06,
                1.93
            ],
            "thrust": 1.48,
            "centerDistance": 190,
            "dimensions": "450",
            "efficiency": 0.97,
            "basePrice": 190000,
            "price": 190000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1098,
                "max": 3090
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCS201",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2.48,
                2.95,
                3.53
            ],
            "transferCapacity": [
                2.105,
                2.07,
                2.14
            ],
            "thrust": 0.147,
            "centerDistance": 40,
            "dimensions": "205",
            "efficiency": 0.97,
            "basePrice": 46080,
            "price": 46080,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2070,
                "max": 5350
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCS2700",
            "inputSpeedRange": [
                500,
                1400
            ],
            "ratios": [
                1.54,
                2.03,
                2.58,
                3.09,
                3.48,
                3.95,
                4.47
            ],
            "transferCapacity": [
                1.24,
                1.27,
                1.33,
                1.36,
                1.43,
                1.62,
                1.7
            ],
            "thrust": 2.05,
            "centerDistance": 270,
            "dimensions": "490",
            "efficiency": 0.97,
            "basePrice": 246000,
            "price": 246000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 620,
                "max": 2380
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCS400",
            "inputSpeedRange": [
                1000,
                1800
            ],
            "ratios": [
                1.5,
                2.04,
                2.5,
                3,
                3.42,
                4.06
            ],
            "transferCapacity": [
                1.21,
                1.24,
                1.31,
                1.34,
                1.38,
                1.63
            ],
            "thrust": 0.331,
            "centerDistance": 82,
            "dimensions": "264",
            "efficiency": 0.97,
            "basePrice": 55000,
            "price": 55000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1210,
                "max": 2934
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCS600",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                2.48,
                3,
                3.58,
                3.89
            ],
            "transferCapacity": [
                1.61,
                1.66,
                1.71,
                1.76
            ],
            "thrust": 0.48,
            "centerDistance": 90,
            "dimensions": "320",
            "efficiency": 0.97,
            "basePrice": 78000,
            "price": 78000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1610,
                "max": 3696
            },
            "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT1000",
            "inputSpeedRange": [
                600,
                2100
            ],
            "ratios": [
                1.59,
                2.03,
                2.48,
                2.95,
                3.45,
                3.94,
                4.39,
                4.89,
                5.44,
                5.94
            ],
            "transferCapacity": [
                0.857,
                0.857,
                0.857,
                0.857,
                0.857,
                0.857,
                0.771,
                0.69,
                0.621,
                0.569
            ],
            "weight": 1600,
            "efficiency": 0.97,
            "basePrice": 225000,
            "price": 225000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 569,
                "max": 1714
            },
            "image": "/images/gearbox/Advance-800-1000.webp"
        },
        {
            "model": "HCTH2650",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                6.2
            ],
            "transferCapacity": [
                3
            ],
            "thrust": 400,
            "centerDistance": 0,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1500,
                "max": 3500
            },
            "image": "/images/gearbox/Advance-HCT.webp",
            "notes": "特殊型号，三机三桨，配PTO，2940kW/1500rpm，速比6.2:1",
            "source": "项目跟踪记录-芜湖造船厂2#3#栈桥作业船固桨"
        },
        {
            "model": "HCTH2650P",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                3
            ],
            "thrust": 0,
            "centerDistance": 0,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1500,
                "max": 3000
            },
            "image": "/images/gearbox/Advance-HCT.webp",
            "notes": "PTO版本，2600kW/1500rpm，速比1:1",
            "source": "项目跟踪记录-芜湖造船厂2#3#栈桥作业船PTO"
        },
        {
            "model": "HCT3800",
            "inputSpeedRange": [
                500,
                1200
            ],
            "ratios": [
                5.08,
                5.55,
                5.98,
                6.58,
                6.98,
                7.55,
                8.03,
                8.56,
                8.98,
                9.57,
                9.86,
                10.51,
                11.06,
                11.67,
                12.01
            ],
            "transferCapacity": [
                2.825,
                2.825,
                2.825,
                2.825,
                2.69,
                2.525,
                2.451,
                2.451,
                2.301,
                2.186,
                2.186,
                2,
                2,
                1.8,
                1.8
            ],
            "thrust": 450,
            "centerDistance": 720,
            "weight": 10500,
            "dimensions": "1681×1750×2100",
            "efficiency": 0.97,
            "basePrice": 285000,
            "price": 285000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 900,
                "max": 3390
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCT400",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                6.09,
                6.49,
                6.93,
                7.42,
                7.96,
                8.4,
                9,
                9.47
            ],
            "transferCapacity": [
                0.054,
                0.054,
                0.054,
                0.054,
                0.054,
                0.054,
                0.054,
                0.054
            ],
            "thrust": 90,
            "centerDistance": 390,
            "weight": 1450,
            "efficiency": 0.97,
            "basePrice": 87000,
            "price": 87000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 54,
                "max": 113
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
        },
        {
            "model": "HCT600",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.59,
                2.03,
                2.48,
                2.95,
                3.45,
                3.94
            ],
            "transferCapacity": [
                0.46,
                0.46,
                0.46,
                0.46,
                0.414,
                0.363
            ],
            "weight": 800,
            "dimensions": "1223×1136×899",
            "efficiency": 0.97,
            "basePrice": 121000,
            "price": 121000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 363,
                "max": 920
            },
            "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp"
        },
        {
            "model": "HCT601P",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                6.06,
                6.49,
                6.93,
                7.42,
                7.96,
                8.54,
                9.35
            ],
            "transferCapacity": [
                0.491,
                0.491,
                0.491,
                0.491,
                0.491,
                0.491,
                0.491
            ],
            "thrust": 110,
            "centerDistance": 420,
            "weight": 1653,
            "efficiency": 0.97,
            "basePrice": 129000,
            "price": 129000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 491,
                "max": 1031
            },
            "image": "/images/gearbox/Advance-800-1000.webp"
        },
        {
            "model": "HCT700",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.59,
                2.05,
                2.48,
                2.95,
                3.45,
                3.94,
                4.44,
                4.89
            ],
            "transferCapacity": [
                0.49,
                0.49,
                0.49,
                0.49,
                0.49,
                0.441,
                0.392,
                0.356
            ],
            "weight": 850,
            "efficiency": 0.97,
            "basePrice": 129000,
            "price": 129000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 356,
                "max": 980
            },
            "image": "/images/gearbox/Advance-800-1000.webp"
        },
        {
            "model": "HCTS1200",
            "inputSpeedRange": [
                700,
                1800
            ],
            "ratios": [
                5.05,
                5.6,
                5.98,
                6.39,
                6.85,
                7.35,
                7.9
            ],
            "transferCapacity": [
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93,
                0.93
            ],
            "thrust": 0.93,
            "centerDistance": 150,
            "dimensions": "705",
            "efficiency": 0.97,
            "basePrice": 135000,
            "price": 135000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 651,
                "max": 1674
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCTS1400",
            "inputSpeedRange": [
                600,
                1800
            ],
            "ratios": [
                4.06,
                4.51,
                5.03,
                5.52,
                5.97,
                6.48,
                7.03,
                7.5,
                8.01,
                8.47,
                8.98,
                9.55
            ],
            "transferCapacity": [
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03,
                1.03
            ],
            "thrust": 1.03,
            "centerDistance": 220,
            "dimensions": "775",
            "efficiency": 0.97,
            "basePrice": 150000,
            "price": 150000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 618,
                "max": 1854
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCTS1600",
            "inputSpeedRange": [
                500,
                1650
            ],
            "ratios": [
                5.55,
                5.97,
                6.59,
                6.99,
                7.44,
                7.92,
                8.46,
                9,
                9.53
            ],
            "transferCapacity": [
                1.213,
                1.213,
                1.213,
                1.213,
                1.213,
                1.213,
                1.104,
                1.104,
                0.93
            ],
            "thrust": 1.213,
            "centerDistance": 250,
            "dimensions": "815",
            "efficiency": 0.97,
            "basePrice": 165000,
            "price": 165000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 465,
                "max": 2001
            },
            "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCTS2000",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                5.19,
                5.49,
                5.94,
                6.58,
                7.01,
                7.48,
                8,
                8.57,
                8.84,
                9.43,
                10.04,
                11
            ],
            "transferCapacity": [
                1.48,
                1.48,
                1.48,
                1.48,
                1.48,
                1.48,
                1.48,
                1.42,
                1.42,
                1.26,
                1.26,
                1.1
            ],
            "thrust": 1.48,
            "centerDistance": 270,
            "dimensions": "870",
            "efficiency": 0.97,
            "basePrice": 195000,
            "price": 195000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 660,
                "max": 2220
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCTS2700",
            "inputSpeedRange": [
                500,
                1400
            ],
            "ratios": [
                4.92,
                5.43,
                6.16,
                6.58,
                7.03,
                7.53,
                8.01,
                8.54,
                9.12,
                9.42,
                10.05
            ],
            "transferCapacity": [
                2.05,
                2.05,
                2.05,
                2.05,
                2.05,
                2.05,
                2.05,
                1.92,
                1.83,
                1.76,
                1.54
            ],
            "thrust": 2.05,
            "centerDistance": 340,
            "dimensions": "945",
            "efficiency": 0.97,
            "basePrice": 247500,
            "price": 247500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 770,
                "max": 2870
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCTS800",
            "inputSpeedRange": [
                600,
                1800
            ],
            "ratios": [
                4.95,
                5.57,
                5.68,
                5.93,
                6.43,
                6.86,
                7.33,
                7.84,
                8.4
            ],
            "transferCapacity": [
                0.625,
                0.625,
                0.625,
                0.625,
                0.625,
                0.588,
                0.551,
                0.515,
                0.48
            ],
            "thrust": 0.625,
            "centerDistance": 140,
            "dimensions": "645",
            "efficiency": 0.97,
            "basePrice": 105000,
            "price": 105000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1125
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        }
    ],
    "gwGearboxes": [
        {
            "model": "GWS28.30P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                1.359,
                1.359,
                1.359,
                1.359,
                1.359
            ],
            "thrust": 155,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 120800,
            "price": 120800,
            "discountRate": 0.1,
            "factoryPrice": 108720,
            "packagePrice": 108720,
            "marketPrice": 120800,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS30.32P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                1.351,
                1.351,
                1.351,
                1.351,
                1.351
            ],
            "thrust": 225,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 135000,
            "price": 135000,
            "discountRate": 0.1,
            "factoryPrice": 121500,
            "packagePrice": 121500,
            "marketPrice": 135000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS32.35P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                1.4,
                1.4,
                1.4,
                1.4,
                1.4
            ],
            "thrust": 270,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 155000,
            "price": 155000,
            "discountRate": 0.1,
            "factoryPrice": 139500,
            "packagePrice": 139500,
            "marketPrice": 155000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS36.39P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2.03,
                2.48,
                2.92,
                3.48,
                3.95
            ],
            "transferCapacity": [
                1.92,
                1.92,
                1.92,
                1.92,
                1.92
            ],
            "thrust": 280,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 185000,
            "price": 185000,
            "discountRate": 0.1,
            "factoryPrice": 166500,
            "packagePrice": 166500,
            "marketPrice": 185000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS39.41P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                2.4,
                2.4,
                2.4,
                2.4,
                2.4
            ],
            "thrust": 440,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 210000,
            "price": 210000,
            "discountRate": 0.1,
            "factoryPrice": 189000,
            "packagePrice": 189000,
            "marketPrice": 210000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS42.45P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                1.97,
                2.55,
                2.93,
                3.58,
                4
            ],
            "transferCapacity": [
                3,
                3,
                3,
                3,
                3
            ],
            "thrust": 600,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 250000,
            "price": 250000,
            "discountRate": 0.1,
            "factoryPrice": 225000,
            "packagePrice": 225000,
            "marketPrice": 250000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS45.49P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2.03,
                2.48,
                3.09,
                3.48,
                3.95
            ],
            "transferCapacity": [
                3.5,
                3.5,
                3.5,
                3.5,
                3.5
            ],
            "thrust": 670,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 290000,
            "price": 290000,
            "discountRate": 0.1,
            "factoryPrice": 261000,
            "packagePrice": 261000,
            "marketPrice": 290000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS49.54P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                4.2,
                4.2,
                4.2,
                4.2,
                4.2
            ],
            "thrust": 850,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 350000,
            "price": 350000,
            "discountRate": 0.1,
            "factoryPrice": 315000,
            "packagePrice": 315000,
            "marketPrice": 350000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS52.59P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                5,
                5,
                5,
                5,
                5
            ],
            "thrust": 1000,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 420000,
            "price": 420000,
            "discountRate": 0.1,
            "factoryPrice": 378000,
            "packagePrice": 378000,
            "marketPrice": 420000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS60.66P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                6,
                6,
                6,
                6,
                6
            ],
            "thrust": 1100,
            "centerDistance": 1000,
            "weight": 0,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 500000,
            "price": 500000,
            "discountRate": 0.1,
            "factoryPrice": 450000,
            "packagePrice": 450000,
            "marketPrice": 500000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC28.30P",
            "inputSpeedRange": [
                400,
                2000
            ],
            "ratios": [
                2.55,
                3.04,
                3.52,
                4.55,
                6.02,
                7.97,
                9.26
            ],
            "transferCapacity": [
                0.865,
                0.711,
                0.578,
                0.504,
                0.44,
                0.393,
                0.35
            ],
            "thrust": 80,
            "centerDistance": 280,
            "weight": 1230,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 90000,
            "price": 90000,
            "discountRate": 0.1,
            "factoryPrice": 81000,
            "packagePrice": 81000,
            "marketPrice": 90000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC30.32P",
            "inputSpeedRange": [
                400,
                2000
            ],
            "ratios": [
                2.55,
                3.04,
                3.52,
                4.55,
                5.94,
                6.88,
                8.89,
                9.92
            ],
            "transferCapacity": [
                1.122,
                0.894,
                0.75,
                0.647,
                0.57,
                0.501,
                0.451,
                0.404
            ],
            "thrust": 100,
            "centerDistance": 300,
            "weight": 1460,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 110000,
            "price": 110000,
            "discountRate": 0.1,
            "factoryPrice": 99000,
            "packagePrice": 99000,
            "marketPrice": 110000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC32.35P",
            "inputSpeedRange": [
                400,
                2000
            ],
            "ratios": [
                2.54,
                3.02,
                3.58,
                4.05,
                4.59,
                5.96,
                6.93,
                8.11,
                9.04
            ],
            "transferCapacity": [
                1.4175,
                1.1481,
                0.9659,
                0.816,
                0.72,
                0.6353,
                0.5733,
                0.5236,
                0.48
            ],
            "thrust": 120,
            "centerDistance": 320,
            "weight": 3200,
            "controlType": "电控/气控",
            "dimensions": "1238*920*1315",
            "efficiency": 0.97,
            "basePrice": 130000,
            "price": 130000,
            "discountRate": 0.1,
            "factoryPrice": 117000,
            "packagePrice": 117000,
            "marketPrice": 130000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC36.39P",
            "inputSpeedRange": [
                400,
                1900
            ],
            "ratios": [
                1.97,
                2.45,
                2.98,
                3.47,
                3.95,
                4.4,
                5.01,
                5.47,
                5.97
            ],
            "transferCapacity": [
                1.92,
                1.546,
                1.272,
                1.09,
                0.96,
                0.862,
                0.756,
                0.693,
                0.634
            ],
            "thrust": 140,
            "centerDistance": 360,
            "weight": 2080,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 155000,
            "price": 155000,
            "discountRate": 0.1,
            "factoryPrice": 139500,
            "packagePrice": 139500,
            "marketPrice": 155000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC39.41P",
            "inputSpeedRange": [
                400,
                1900
            ],
            "ratios": [
                2,
                2.47,
                3.05,
                3.48,
                4.05,
                4.48,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                2.4,
                1.92,
                1.6,
                1.37,
                1.2,
                1.07,
                0.96,
                0.87,
                0.8
            ],
            "thrust": 180,
            "centerDistance": 390,
            "weight": 2800,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 185000,
            "price": 185000,
            "discountRate": 0.1,
            "factoryPrice": 166500,
            "packagePrice": 166500,
            "marketPrice": 185000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC42.45P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.55,
                3.02,
                3.58,
                4,
                4.47,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                3,
                2.4,
                2,
                1.7,
                1.5,
                1.35,
                1.2,
                1.1,
                1
            ],
            "thrust": 220,
            "centerDistance": 420,
            "weight": 3500,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 220000,
            "price": 220000,
            "discountRate": 0.1,
            "factoryPrice": 198000,
            "packagePrice": 198000,
            "marketPrice": 220000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC45.49P",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2.12,
                2.47,
                2.89,
                3.47,
                3.95,
                4.37,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                3.5,
                3,
                2.6,
                2.2,
                1.9,
                1.7,
                1.5,
                1.35,
                1.25
            ],
            "thrust": 280,
            "centerDistance": 450,
            "weight": 4200,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 260000,
            "price": 260000,
            "discountRate": 0.1,
            "factoryPrice": 234000,
            "packagePrice": 234000,
            "marketPrice": 260000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC49.54P",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2.46,
                2.92,
                3.45,
                3.95,
                4.53,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                4.2,
                3.5,
                3,
                2.6,
                2.25,
                2,
                1.8,
                1.65
            ],
            "thrust": 350,
            "centerDistance": 490,
            "weight": 5000,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 310000,
            "price": 310000,
            "discountRate": 0.1,
            "factoryPrice": 279000,
            "packagePrice": 279000,
            "marketPrice": 310000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC52.59P",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2.48,
                2.96,
                3.53,
                3.95,
                4.43,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                5,
                4.2,
                3.5,
                3.15,
                2.8,
                2.5,
                2.25,
                2.05
            ],
            "thrust": 420,
            "centerDistance": 520,
            "weight": 5800,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 370000,
            "price": 370000,
            "discountRate": 0.1,
            "factoryPrice": 333000,
            "packagePrice": 333000,
            "marketPrice": 370000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC60.66P",
            "inputSpeedRange": [
                400,
                1500
            ],
            "ratios": [
                2.5,
                3.07,
                3.57,
                4.05,
                4.48,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                6,
                5,
                4.3,
                3.8,
                3.4,
                3.05,
                2.8,
                2.55
            ],
            "thrust": 500,
            "centerDistance": 600,
            "weight": 7000,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "factoryPrice": 405000,
            "packagePrice": 405000,
            "marketPrice": 450000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC63.71P",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                3,
                3.5,
                4,
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                7,
                6,
                5.25,
                4.65,
                4.2,
                3.8,
                3.5
            ],
            "thrust": 600,
            "centerDistance": 630,
            "weight": 8500,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 550000,
            "price": 550000,
            "discountRate": 0.1,
            "factoryPrice": 495000,
            "packagePrice": 495000,
            "marketPrice": 550000,
            "notes": "PTI/PTO混动专用型号 - 杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC28.30",
            "inputSpeedRange": [
                400,
                2000
            ],
            "ratios": [
                2.06,
                2.51,
                3.08,
                3.54,
                4.05,
                4.54,
                5.09,
                5.59,
                6.14
            ],
            "transferCapacity": [
                0.865,
                0.711,
                0.578,
                0.504,
                0.44,
                0.393,
                0.35,
                0.319,
                0.29
            ],
            "thrust": 80,
            "centerDistance": 280,
            "weight": 1230,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 72500,
            "price": 72500,
            "discountRate": 0.1,
            "factoryPrice": 65250,
            "packagePrice": 65250,
            "marketPrice": 74147.73,
            "notes": "电控或气控、无罩、无飞轮、B1型监控"
        },
        {
            "model": "GWC30.32",
            "inputSpeedRange": [
                400,
                2000
            ],
            "ratios": [
                2.03,
                2.55,
                3.04,
                3.52,
                4,
                4.55,
                5.05,
                5.64,
                6.05
            ],
            "transferCapacity": [
                1.122,
                0.894,
                0.75,
                0.647,
                0.57,
                0.501,
                0.451,
                0.404,
                0.376
            ],
            "thrust": 100,
            "centerDistance": 300,
            "weight": 1460,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 90800,
            "price": 90800,
            "discountRate": 0.1,
            "factoryPrice": 81720,
            "packagePrice": 81720,
            "marketPrice": 92863.64,
            "notes": "电控或气控、无罩、无飞轮、B1型监控"
        },
        {
            "model": "GWC32.35",
            "inputSpeedRange": [
                400,
                2000
            ],
            "ratios": [
                2.06,
                2.54,
                3.02,
                3.58,
                4.05,
                4.59,
                5.09,
                5.57,
                6.08
            ],
            "transferCapacity": [
                1.4175,
                1.1481,
                0.9659,
                0.816,
                0.72,
                0.6353,
                0.5733,
                0.5236,
                0.48
            ],
            "thrust": 120,
            "centerDistance": 320,
            "weight": 3200,
            "controlType": "气控/电控",
            "dimensions": "1238*920*1315",
            "efficiency": 0.97,
            "basePrice": 103800,
            "price": 103800,
            "discountRate": 0.1,
            "factoryPrice": 93420,
            "packagePrice": 93420,
            "marketPrice": 106159.09,
            "notes": "电控或气控、无罩、无飞轮、B1型监控"
        },
        {
            "model": "GWC36.39",
            "inputSpeedRange": [
                400,
                1900
            ],
            "ratios": [
                1.97,
                2.45,
                2.98,
                3.47,
                3.95,
                4.4,
                5.01,
                5.47,
                5.97
            ],
            "transferCapacity": [
                1.92,
                1.546,
                1.272,
                1.09,
                0.96,
                0.862,
                0.756,
                0.693,
                0.634
            ],
            "thrust": 140,
            "centerDistance": 360,
            "weight": 2080,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 123800,
            "price": 123800,
            "discountRate": 0.1,
            "factoryPrice": 111420,
            "packagePrice": 111420,
            "marketPrice": 126613.64,
            "notes": "电控或气控、无罩、无飞轮、B1型监控"
        },
        {
            "model": "GWC39.41",
            "inputSpeedRange": [
                400,
                1700
            ],
            "ratios": [
                1.98,
                2.47,
                3.05,
                3.48,
                4.05,
                4.48,
                5,
                5.51,
                5.99
            ],
            "transferCapacity": [
                2.585,
                2.068,
                1.672,
                1.467,
                1.26,
                1.138,
                1.022,
                0.927,
                0.852
            ],
            "thrust": 175,
            "centerDistance": 390,
            "weight": 3980,
            "controlType": "气控/电控",
            "dimensions": "1454*1010*1425",
            "efficiency": 0.97,
            "basePrice": 153800,
            "price": 153800,
            "discountRate": 0.1,
            "factoryPrice": 138420,
            "packagePrice": 138420,
            "marketPrice": 157295.45,
            "notes": "电控或气控、无罩、无飞轮、B1型监控"
        },
        {
            "model": "GWC42.45",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2,
                2.55,
                3.02,
                3.58,
                4,
                4.47,
                5,
                5.6,
                5.93
            ],
            "transferCapacity": [
                3.28,
                2.577,
                2.169,
                1.832,
                1.64,
                1.467,
                1.312,
                1.171,
                1.106
            ],
            "thrust": 220,
            "centerDistance": 420,
            "weight": 4700,
            "controlType": "气控/电控",
            "dimensions": "1486*1181*1650",
            "efficiency": 0.97,
            "basePrice": 185800,
            "price": 185800,
            "discountRate": 0.1,
            "factoryPrice": 167220,
            "packagePrice": 180000,
            "marketPrice": 189909.09,
            "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 18 万)"
        },
        {
            "model": "GWC45.49",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                1.97,
                2.47,
                2.89,
                3.47,
                3.95,
                4.37,
                4.85,
                5.5,
                5.98
            ],
            "transferCapacity": [
                4.24,
                3.392,
                2.89,
                2.414,
                2.12,
                1.913,
                1.725,
                1.52,
                1.398
            ],
            "thrust": 270,
            "centerDistance": 450,
            "weight": 5500,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 275800,
            "price": 275800,
            "discountRate": 0.1,
            "factoryPrice": 248220,
            "packagePrice": 275000,
            "marketPrice": 282068.18,
            "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 27.5 万)"
        },
        {
            "model": "GWC45.52",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                1.97,
                2.52,
                2.99,
                3.47,
                4.01,
                4.64,
                4.98,
                5.51,
                6.04
            ],
            "transferCapacity": [
                4.648,
                3.62,
                3.055,
                2.64,
                2.279,
                1.97,
                1.84,
                1.66,
                1.51
            ],
            "thrust": 270,
            "centerDistance": 450,
            "weight": 6500,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 320000,
            "price": 320000,
            "discountRate": 0.1,
            "factoryPrice": 288000,
            "packagePrice": 330000,
            "marketPrice": 327272.73,
            "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 33 万)"
        },
        {
            "model": "GWC49.54",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                1.94,
                2.46,
                2.92,
                3.45,
                3.95,
                4.53,
                4.91,
                5.48,
                6
            ],
            "transferCapacity": [
                5.5,
                4.54,
                3.827,
                3.24,
                2.825,
                2.462,
                2.273,
                2.036,
                1.861
            ],
            "thrust": 290,
            "centerDistance": 490,
            "weight": 7900,
            "controlType": "气控/电控",
            "dimensions": "1783*1340*1925",
            "efficiency": 0.97,
            "basePrice": 402600,
            "price": 402600,
            "discountRate": 0.1,
            "factoryPrice": 362340,
            "packagePrice": 385000,
            "marketPrice": 411750,
            "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 38.5 万)"
        },
        {
            "model": "GWC49.59",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2.03,
                2.49,
                3.04,
                3.49,
                4,
                4.48,
                5.01,
                5.51,
                6.01
            ],
            "transferCapacity": [
                5.55,
                5.06,
                4.15,
                3.62,
                3.16,
                2.82,
                2.52,
                2.29,
                2.1
            ],
            "thrust": 290,
            "centerDistance": 490,
            "weight": 8500,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 460000,
            "price": 460000,
            "discountRate": 0.1,
            "factoryPrice": 414000,
            "packagePrice": 430000,
            "marketPrice": 470454.55,
            "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 43 万)"
        },
        {
            "model": "GWC49.59A (带 PTO)",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2.03,
                2.49,
                3.04,
                3.49,
                4,
                4.48,
                5.01,
                5.51,
                6.01
            ],
            "transferCapacity": [
                5.55,
                5.06,
                4.15,
                3.62,
                3.16,
                2.82,
                2.52,
                2.29,
                2.1
            ],
            "thrust": 290,
            "centerDistance": 490,
            "weight": 8700,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 495000,
            "price": 495000,
            "discountRate": 0.1,
            "factoryPrice": 445500,
            "packagePrice": 445500,
            "marketPrice": 506250,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 44.5 万)"
        },
        {
            "model": "GWC52.59",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.93,
                2.48,
                2.96,
                3.53,
                3.95,
                4.43,
                4.97,
                5.4,
                5.93
            ],
            "transferCapacity": [
                7.438,
                5.797,
                4.853,
                4.081,
                3.64,
                3.246,
                2.893,
                2.663,
                2.426
            ],
            "thrust": 300,
            "centerDistance": 520,
            "weight": 11000,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 545000,
            "price": 545000,
            "discountRate": 0.1,
            "factoryPrice": 490500,
            "packagePrice": 510000,
            "marketPrice": 557386.36,
            "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 51 万)"
        },
        {
            "model": "GWC52.59A (滑动轴承)",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.93,
                2.48,
                2.96,
                3.53,
                3.95,
                4.43,
                4.97,
                5.4,
                5.93
            ],
            "transferCapacity": [
                7.438,
                5.797,
                4.853,
                4.081,
                3.64,
                3.246,
                2.893,
                2.663,
                2.426
            ],
            "thrust": 300,
            "centerDistance": 520,
            "weight": 11200,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 575000,
            "price": 575000,
            "discountRate": 0.1,
            "factoryPrice": 517500,
            "packagePrice": 517500,
            "marketPrice": 588068.18,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (滑动轴承, 打包价 51.75 万)"
        },
        {
            "model": "GWC52.62",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2.02,
                2.46,
                3.02,
                3.45,
                4.06,
                4.52,
                5.04,
                5.46,
                5.96,
                6.49,
                6.94
            ],
            "transferCapacity": [
                7.756,
                6.353,
                5.18,
                4.534,
                3.852,
                3.458,
                3.102,
                2.867,
                2.631,
                2.41,
                2.254
            ],
            "thrust": 300,
            "centerDistance": 620,
            "weight": 10700,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 575000,
            "price": 575000,
            "discountRate": 0.1,
            "factoryPrice": 517500,
            "packagePrice": 517500,
            "marketPrice": 588068.18,
            "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 51.75 万)"
        },
        {
            "model": "GWC60.66",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2.01,
                2.5,
                3.07,
                3.57,
                3.95,
                4.49,
                5.04,
                5.51,
                6.04,
                6.5,
                6.94
            ],
            "transferCapacity": [
                9.913,
                7.982,
                6.492,
                5.581,
                4.923,
                4.448,
                3.927,
                3.622,
                3.261,
                3.06,
                3
            ],
            "thrust": 450,
            "centerDistance": 600,
            "weight": 14500,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 800000,
            "price": 800000,
            "discountRate": 0.1,
            "factoryPrice": 720000,
            "packagePrice": 720000,
            "marketPrice": 818181.82,
            "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 72 万)"
        },
        {
            "model": "GWC60.66A (滑动轴承)",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2.01,
                2.5,
                3.07,
                3.57,
                3.95,
                4.49,
                5.04,
                5.51,
                6.04,
                6.5,
                6.94
            ],
            "transferCapacity": [
                9.913,
                7.982,
                6.492,
                5.581,
                4.923,
                4.448,
                3.927,
                3.622,
                3.261,
                3.06,
                3
            ],
            "thrust": 450,
            "centerDistance": 600,
            "weight": 14700,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 830000,
            "price": 830000,
            "discountRate": 0.1,
            "factoryPrice": 747000,
            "packagePrice": 747000,
            "marketPrice": 848863.64,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (滑动轴承, 打包价 74.7 万)"
        },
        {
            "model": "GWC60.74",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.99,
                2.53,
                3.06,
                3.51,
                4.02,
                4.5,
                5.04,
                5.51,
                6.04,
                6.5,
                6.94
            ],
            "transferCapacity": [
                9.913,
                8.3641,
                7.4347,
                6.8628,
                6.3726,
                5.05,
                4.5128,
                4.1224,
                3.7627,
                3.4962,
                3.375
            ],
            "thrust": 540,
            "centerDistance": 740,
            "weight": 18000,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 920000,
            "price": 920000,
            "discountRate": 0.1,
            "factoryPrice": 828000,
            "packagePrice": 828000,
            "marketPrice": 940909.09,
            "notes": "电控或气控、无罩、无飞轮、B1型监控 (打包价 82.8 万)"
        },
        {
            "model": "GWC60.74B (带 PTO)",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.99,
                2.53,
                3.06,
                3.51,
                4.02,
                4.5,
                5.04,
                5.51,
                6.04,
                6.5,
                6.94
            ],
            "transferCapacity": [
                9.913,
                8.3641,
                7.4347,
                6.8628,
                6.3726,
                5.05,
                4.5128,
                4.1224,
                3.7627,
                3.4962,
                3.375
            ],
            "thrust": 540,
            "centerDistance": 740,
            "weight": 18300,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1010000,
            "price": 1010000,
            "discountRate": 0.1,
            "factoryPrice": 909000,
            "packagePrice": 909000,
            "marketPrice": 1032954.55,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 90.9 万)"
        },
        {
            "model": "GWC63.71",
            "inputSpeedRange": [
                300,
                1200
            ],
            "ratios": [
                2.01,
                2.51,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                12.23,
                9.8,
                8.117,
                7.135,
                6,
                5.411,
                4.888,
                4.5,
                4.137,
                3.8,
                3.541,
                3.294
            ],
            "thrust": 710,
            "centerDistance": 630,
            "weight": 17500,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 950000,
            "price": 950000,
            "discountRate": 0.1,
            "factoryPrice": 855000,
            "packagePrice": 860000,
            "marketPrice": 971590.91,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 86 万)"
        },
        {
            "model": "GWC63.71 (带 PTO)",
            "inputSpeedRange": [
                300,
                1200
            ],
            "ratios": [
                2.01,
                2.51,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                12.23,
                9.8,
                8.117,
                7.135,
                6,
                5.411,
                4.888,
                4.5,
                4.137,
                3.8,
                3.541,
                3.294
            ],
            "thrust": 710,
            "centerDistance": 630,
            "weight": 17800,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1030000,
            "price": 1030000,
            "discountRate": 0.1,
            "factoryPrice": 927000,
            "packagePrice": 927000,
            "marketPrice": 1053409.09,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 92.7 万)"
        },
        {
            "model": "GWC66.75",
            "inputSpeedRange": [
                300,
                1200
            ],
            "ratios": [
                2.02,
                2.5,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                14.53,
                11.68,
                9.73,
                8.53,
                7.19,
                6.49,
                5.86,
                5.39,
                4.95,
                4.55,
                4.25,
                3.95
            ],
            "thrust": 800,
            "centerDistance": 660,
            "weight": 21000,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1050000,
            "price": 1050000,
            "discountRate": 0.1,
            "factoryPrice": 945000,
            "packagePrice": 960000,
            "marketPrice": 1073863.64,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 96 万)"
        },
        {
            "model": "GWC70.76",
            "inputSpeedRange": [
                300,
                1200
            ],
            "ratios": [
                2.02,
                2.5,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                17.1,
                13.73,
                11.39,
                10.01,
                8.44,
                7.61,
                6.88,
                6.33,
                5.81,
                5.34,
                4.99,
                4.64
            ],
            "thrust": 950,
            "centerDistance": 700,
            "weight": 23000,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1100000,
            "price": 1100000,
            "discountRate": 0.1,
            "factoryPrice": 990000,
            "packagePrice": 1050000,
            "marketPrice": 1125000,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 105 万)"
        },
        {
            "model": "GWC70.76C (带 PTO)",
            "inputSpeedRange": [
                300,
                1200
            ],
            "ratios": [
                2.02,
                2.5,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                17.1,
                13.73,
                11.39,
                10.01,
                8.44,
                7.61,
                6.88,
                6.33,
                5.81,
                5.34,
                4.99,
                4.64
            ],
            "thrust": 950,
            "centerDistance": 700,
            "weight": 23300,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1150000,
            "price": 1150000,
            "discountRate": 0.1,
            "factoryPrice": 1035000,
            "packagePrice": 1035000,
            "marketPrice": 1176136.36,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 103.5 万)"
        },
        {
            "model": "GWC70.85",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2.02,
                2.5,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                21,
                16.88,
                13.98,
                12.31,
                10.37,
                9.35,
                8.46,
                7.78,
                7.14,
                6.56,
                6.12,
                5.68
            ],
            "thrust": 1100,
            "centerDistance": 850,
            "weight": 29000,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1470000,
            "price": 1470000,
            "discountRate": 0.1,
            "factoryPrice": 1323000,
            "packagePrice": 1323000,
            "marketPrice": 1503409.09,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 142 万)"
        },
        {
            "model": "GWC70.85A (带 PTO)",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2.02,
                2.5,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                21,
                16.88,
                13.98,
                12.31,
                10.37,
                9.35,
                8.46,
                7.78,
                7.14,
                6.56,
                6.12,
                5.68
            ],
            "thrust": 1100,
            "centerDistance": 850,
            "weight": 29300,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1670000,
            "price": 1670000,
            "discountRate": 0.1,
            "factoryPrice": 1503000,
            "packagePrice": 1503000,
            "marketPrice": 1707954.55,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 150.3 万)"
        },
        {
            "model": "GWC75.90",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2.02,
                2.5,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                24,
                19.3,
                16,
                14.05,
                11.85,
                10.69,
                9.67,
                8.88,
                8.17,
                7.51,
                7.01,
                6.51
            ],
            "thrust": 1250,
            "centerDistance": 900,
            "weight": 33000,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1800000,
            "price": 1800000,
            "discountRate": 0.1,
            "factoryPrice": 1620000,
            "packagePrice": 1490000,
            "marketPrice": 1840909.09,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 149 万)"
        },
        {
            "model": "GWC75.90 (带 PTO)",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2.02,
                2.5,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                24,
                19.3,
                16,
                14.05,
                11.85,
                10.69,
                9.67,
                8.88,
                8.17,
                7.51,
                7.01,
                6.51
            ],
            "thrust": 1250,
            "centerDistance": 900,
            "weight": 33300,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1850000,
            "price": 1850000,
            "discountRate": 0.1,
            "factoryPrice": 1665000,
            "packagePrice": 1665000,
            "marketPrice": 1892045.45,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 166.5 万)"
        },
        {
            "model": "GWC78.88",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2.02,
                2.5,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                24,
                19.3,
                16,
                14.05,
                11.85,
                10.69,
                9.67,
                8.88,
                8.17,
                7.51,
                7.01,
                6.51
            ],
            "thrust": 1250,
            "centerDistance": 900,
            "weight": 33000,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1670000,
            "price": 1670000,
            "discountRate": 0.1,
            "factoryPrice": 1503000,
            "packagePrice": 1520000,
            "marketPrice": 1707954.55,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (打包价 152 万)"
        },
        {
            "model": "GWC78.88A (带 PTO)",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2.02,
                2.5,
                3.03,
                3.45,
                4.11,
                4.55,
                5.04,
                5.47,
                5.95,
                6.48,
                6.96,
                7.48
            ],
            "transferCapacity": [
                24,
                19.3,
                16,
                14.05,
                11.85,
                10.69,
                9.67,
                8.88,
                8.17,
                7.51,
                7.01,
                6.51
            ],
            "thrust": 1250,
            "centerDistance": 900,
            "weight": 33300,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 1740000,
            "price": 1740000,
            "discountRate": 0.1,
            "factoryPrice": 1566000,
            "packagePrice": 1566000,
            "marketPrice": 1779545.45,
            "notes": "电控或气控、无罩、无飞轮、监控仪 (带PTO, 打包价 156.6 万)"
        },
        {
            "model": "GWC78.96",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2.02,
                2.5
            ],
            "transferCapacity": [
                24
            ],
            "thrust": 1250,
            "centerDistance": 960,
            "weight": 34000,
            "controlType": "气控/电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0.1,
            "factoryPrice": 0,
            "packagePrice": 1630000,
            "marketPrice": 0,
            "notes": "打包价 163 万 (其他参数及基础价格未在价格表中找到)"
        },
        {
            "model": "2GWH1060",
            "inputSpeedRange": [
                400,
                2000
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4,
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                1.12,
                1.12,
                1.12,
                1.12,
                1.12,
                1.12,
                1.12,
                1.12,
                1.12
            ],
            "thrust": 175,
            "standardCenterDistance": 1460,
            "weight": 10600,
            "controlType": "双机并车",
            "efficiency": 0.97,
            "basePrice": 850000,
            "price": 850000,
            "discountRate": 0.1,
            "factoryPrice": 765000,
            "packagePrice": 765000,
            "marketPrice": 869318.18,
            "dimensions": "-",
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "SGW39.41",
            "inputSpeedRange": [
                400,
                1700
            ],
            "ratios": [
                1.98,
                2.47,
                3.05,
                3.48,
                4.05,
                4.48,
                5,
                5.51,
                5.99
            ],
            "transferCapacity": [
                2.585,
                2.068,
                1.672,
                1.467,
                1.26,
                1.138,
                1.022,
                0.927,
                0.852
            ],
            "thrust": 175,
            "centerDistance": 390,
            "weight": 3980,
            "controlType": "气控/电控",
            "dimensions": "1454*1010*1425",
            "efficiency": 0.97,
            "basePrice": 245000,
            "price": 245000,
            "discountRate": 0.1,
            "factoryPrice": 220500,
            "packagePrice": 220500,
            "marketPrice": 250568.18,
            "notes": "电控或气控、无罩、无飞轮、B1型监控"
        },
        {
            "model": "SGW42.45",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2,
                2.55,
                3.02,
                3.58,
                4,
                4.47,
                5,
                5.6,
                5.93
            ],
            "transferCapacity": [
                3.28,
                2.577,
                2.169,
                1.832,
                1.64,
                1.467,
                1.312,
                1.171,
                1.106
            ],
            "thrust": 220,
            "centerDistance": 420,
            "weight": 4700,
            "controlType": "气控/电控",
            "dimensions": "1486*1181*1650",
            "efficiency": 0.97,
            "basePrice": 273000,
            "price": 273000,
            "discountRate": 0.1,
            "factoryPrice": 245700,
            "packagePrice": 245700,
            "marketPrice": 279204.55,
            "notes": "电控或气控、无罩、无飞轮、B1型监控"
        },
        {
            "model": "SGW49.54",
            "inputSpeedRange": [
                400,
                880
            ],
            "ratios": [
                3.39
            ],
            "transferCapacity": [
                2.92
            ],
            "thrust": 3.588,
            "centerDistance": 284,
            "weight": null,
            "controlType": "气控/电控",
            "dimensions": null,
            "efficiency": 0.97,
            "basePrice": 520000,
            "price": 520000,
            "discountRate": 0.1,
            "factoryPrice": 468000,
            "packagePrice": 468000,
            "marketPrice": 531818.18,
            "notes": "电控或气控、无罩、无飞轮、B1型监控"
        },
        {
            "model": "2GWH400",
            "ratios": [
                2.04,
                2.52,
                3.04,
                3.57
            ],
            "transferCapacity": [
                0.28,
                0.28,
                0.28,
                0.28
            ],
            "thrust": 80,
            "centerDistance": 1200,
            "weight": 1500,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "2GWH600",
            "ratios": [
                2.04,
                2.52,
                3.04,
                3.57
            ],
            "transferCapacity": [
                0.42,
                0.42,
                0.42,
                0.42
            ],
            "thrust": 100,
            "centerDistance": 1400,
            "weight": 2200,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "2GWH800",
            "ratios": [
                2.04,
                2.52,
                3.04,
                3.57
            ],
            "transferCapacity": [
                0.52,
                0.52,
                0.52,
                0.52
            ],
            "thrust": 140,
            "centerDistance": 1460,
            "weight": 2800,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC20.34",
            "ratios": [
                2.04
            ],
            "transferCapacity": [
                0.18
            ],
            "weight": 125,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC20.54",
            "ratios": [
                2.04
            ],
            "transferCapacity": [
                0.22
            ],
            "weight": 148,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC26.58",
            "ratios": [
                2.6
            ],
            "transferCapacity": [
                0.22
            ],
            "weight": 198,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC36.58",
            "ratios": [
                3.42
            ],
            "transferCapacity": [
                0.3
            ],
            "weight": 205,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC36.59",
            "ratios": [
                3.47
            ],
            "transferCapacity": [
                0.38
            ],
            "weight": 270,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC46.59",
            "ratios": [
                4.47
            ],
            "transferCapacity": [
                0.3
            ],
            "weight": 270,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC46.60",
            "ratios": [
                4.47
            ],
            "transferCapacity": [
                0.42
            ],
            "weight": 355,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC56.61",
            "ratios": [
                5.63
            ],
            "transferCapacity": [
                0.42
            ],
            "weight": 360,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC61.65",
            "ratios": [
                6.13
            ],
            "transferCapacity": [
                0.55
            ],
            "weight": 560,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC70.82",
            "inputSpeedRange": [
                300,
                465
            ],
            "ratios": [
                2.05,
                2.53,
                3.09,
                3.58,
                3.95,
                4.57
            ],
            "transferCapacity": [
                17.646,
                14.297,
                11.692,
                10.088,
                9.15,
                7.902
            ],
            "thrust": 780,
            "centerDistance": 780,
            "weight": 23000,
            "dimensions": "2876×2151×1970",
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2371,
                "max": 8205
            },
            "image": "/images/gearbox/Advance-GWC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC80.95",
            "inputSpeedRange": [
                200,
                800
            ],
            "ratios": [
                1.98,
                2.49,
                2.94,
                3.46,
                3.95,
                4.51,
                5.03,
                5.48,
                5.93
            ],
            "transferCapacity": [
                28,
                22.2,
                18.81,
                16,
                14,
                12.25,
                11,
                10.09,
                9.33
            ],
            "thrust": 1200,
            "weight": 40000,
            "efficiency": 0.97,
            "basePrice": 2000000,
            "price": 2000000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1866,
                "max": 22400
            },
            "image": "/images/gearbox/Advance-GWC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWC85.100",
            "inputSpeedRange": [
                150,
                1425
            ],
            "ratios": [
                1.98,
                2.55,
                2.98,
                3.48,
                3.95,
                4.48,
                4.97,
                5.51,
                5.99,
                6.45,
                7.05
            ],
            "transferCapacity": [
                35,
                27.429,
                23.445,
                20.108,
                17.5,
                15.605,
                14.091,
                12.708,
                11.684,
                10.845,
                9.92
            ],
            "thrust": 1400,
            "weight": 56500,
            "efficiency": 0.97,
            "basePrice": 2500000,
            "price": 2500000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1488,
                "max": 49875
            },
            "image": "/images/gearbox/Advance-GWC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWCD26.70",
            "ratios": [
                2.7
            ],
            "transferCapacity": [
                0.6
            ],
            "weight": 495,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWCD36.70",
            "ratios": [
                3.75
            ],
            "transferCapacity": [
                0.7
            ],
            "weight": 550,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWCD46.71",
            "ratios": [
                4.92
            ],
            "transferCapacity": [
                0.8
            ],
            "weight": 600,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWCD56.72",
            "ratios": [
                5.71
            ],
            "transferCapacity": [
                0.85
            ],
            "weight": 700,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWCD67.80",
            "ratios": [
                6.54
            ],
            "transferCapacity": [
                0.9
            ],
            "weight": 850,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWCD79.85",
            "ratios": [
                7.92
            ],
            "transferCapacity": [
                0.95
            ],
            "weight": 970,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWCD90.100",
            "ratios": [
                9.4
            ],
            "transferCapacity": [
                1.1
            ],
            "weight": 1350,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD28.30",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.44,
                0.44,
                0.44,
                0.44,
                0.44
            ],
            "thrust": 80,
            "centerDistance": 100,
            "weight": 1230,
            "efficiency": 0.97,
            "basePrice": 68875,
            "price": 68875,
            "discountRate": 0.1,
            "powerRange": {
                "min": 176,
                "max": 792
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD30.32A",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                1.97,
                2.52,
                2.96,
                3.52,
                4
            ],
            "transferCapacity": [
                0.57,
                0.57,
                0.57,
                0.56,
                0.52
            ],
            "thrust": 100,
            "centerDistance": 100,
            "weight": 1350,
            "dimensions": "1433×1200×888",
            "efficiency": 0.97,
            "basePrice": 86260,
            "price": 86260,
            "discountRate": 0.1,
            "powerRange": {
                "min": 208,
                "max": 1026
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD32.35",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.72,
                0.72,
                0.72,
                0.72,
                0.72
            ],
            "thrust": 120,
            "centerDistance": 120,
            "weight": 2080,
            "dimensions": "1405×1240×920",
            "efficiency": 0.97,
            "basePrice": 98610,
            "price": 98610,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD36.39",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2.03,
                2.48,
                2.92,
                3.48,
                3.95
            ],
            "transferCapacity": [
                1.02,
                1.02,
                1.02,
                1.02,
                1.02
            ],
            "thrust": 140,
            "centerDistance": 140,
            "weight": 2450,
            "dimensions": "1645×1331×1060",
            "efficiency": 0.97,
            "basePrice": 117610,
            "price": 117610,
            "discountRate": 0.1,
            "powerRange": {
                "min": 408,
                "max": 1836
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD36.54",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.46,
                4.95,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.96,
                0.96,
                0.96,
                0.96
            ],
            "thrust": 220,
            "centerDistance": 220,
            "weight": 2960,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD39.41",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                1.4,
                1.4,
                1.4,
                1.4,
                1.4
            ],
            "thrust": 175,
            "centerDistance": 175,
            "weight": 2960,
            "efficiency": 0.97,
            "basePrice": 146110,
            "price": 146110,
            "discountRate": 0.1,
            "powerRange": {
                "min": 560,
                "max": 2240
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD39.57",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                1.29,
                1.29,
                1.29,
                1.29
            ],
            "thrust": 270,
            "centerDistance": 270,
            "weight": 3630,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 516,
                "max": 2064
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD42.45",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                1.97,
                2.55,
                2.93,
                3.58,
                4
            ],
            "transferCapacity": [
                1.81,
                1.81,
                1.81,
                1.81,
                1.81
            ],
            "thrust": 220,
            "centerDistance": 220,
            "weight": 3630,
            "efficiency": 0.97,
            "basePrice": 176510,
            "price": 176510,
            "discountRate": 0.1,
            "powerRange": {
                "min": 724,
                "max": 2896
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD42.63",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.46,
                5.08,
                5.46,
                5.95
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 290,
            "centerDistance": 290,
            "weight": 5560,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD45.49",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                2.03,
                2.48,
                3.09,
                3.48,
                3.95
            ],
            "transferCapacity": [
                2.23,
                2.23,
                2.23,
                2.23,
                2.23
            ],
            "thrust": 270,
            "centerDistance": 270,
            "weight": 5560,
            "efficiency": 0.97,
            "basePrice": 262010,
            "price": 262010,
            "discountRate": 0.1,
            "powerRange": {
                "min": 892,
                "max": 3122
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD45.68",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 360,
            "centerDistance": 360,
            "weight": 7300,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD49.54",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.26,
                3.26,
                3.26,
                3.26,
                3.26
            ],
            "thrust": 290,
            "centerDistance": 290,
            "weight": 7300,
            "dimensions": "2126×1989×1340",
            "efficiency": 0.97,
            "basePrice": 382470,
            "price": 382470,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1304,
                "max": 3912
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD49.74",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                2.83,
                2.83,
                2.83,
                2.83
            ],
            "thrust": 540,
            "centerDistance": 540,
            "weight": 8900,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1132,
                "max": 3396
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD52.59",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.8067,
                3.8067,
                3.8067,
                3.8067,
                3.8067
            ],
            "thrust": 300,
            "centerDistance": 300,
            "weight": 8900,
            "dimensions": "2291×1400×1290",
            "efficiency": 0.97,
            "basePrice": 517750,
            "price": 517750,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1523,
                "max": 4568
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD52.82",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 710,
            "centerDistance": 710,
            "weight": 14000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD60.66",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                5.09,
                5.09,
                5.09,
                5.09,
                5.09
            ],
            "thrust": 450,
            "centerDistance": 450,
            "weight": 14000,
            "efficiency": 0.97,
            "basePrice": 760000,
            "price": 760000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2036,
                "max": 6108
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD60.92",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                5.05,
                5.05,
                5.05,
                5.05
            ],
            "thrust": 750,
            "centerDistance": 750,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2020,
                "max": 6060
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD63.71",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2,
                2.5,
                2.96,
                3.5,
                4.11
            ],
            "transferCapacity": [
                6.45,
                6.45,
                6.45,
                6.45,
                6.45
            ],
            "thrust": 710,
            "centerDistance": 710,
            "weight": 17000,
            "dimensions": "2645×2381×1740",
            "efficiency": 0.97,
            "basePrice": 902500,
            "price": 902500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1935,
                "max": 6450
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD63.95",
            "inputSpeedRange": [
                400,
                1000
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                6,
                6,
                6,
                6
            ],
            "thrust": 800,
            "centerDistance": 800,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2400,
                "max": 6000
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD66.106",
            "inputSpeedRange": [
                400,
                950
            ],
            "ratios": [
                4.52,
                4.96,
                5.48,
                6.05
            ],
            "transferCapacity": [
                7.2,
                7.2,
                7.2,
                7.2
            ],
            "thrust": 980,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2880,
                "max": 6840
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD66.75",
            "inputSpeedRange": [
                300,
                950
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                7.48,
                7.48,
                7.48,
                7.48,
                7.48
            ],
            "thrust": 730,
            "centerDistance": 730,
            "weight": 19000,
            "efficiency": 0.97,
            "basePrice": 997500,
            "price": 997500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2244,
                "max": 7106
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD70.111",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                8.11,
                8.11,
                8.11,
                8.11
            ],
            "thrust": 1200,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3244,
                "max": 7299
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD70.76",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95
            ],
            "transferCapacity": [
                8.15,
                8.15,
                8.15,
                8.15,
                8.15
            ],
            "thrust": 750,
            "centerDistance": 750,
            "weight": 21500,
            "efficiency": 0.97,
            "basePrice": 1045000,
            "price": 1045000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2445,
                "max": 7335
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWD70.82",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95,
                4.25
            ],
            "transferCapacity": [
                9.15,
                9.15,
                9.15,
                9.15,
                9.15,
                8.4
            ],
            "thrust": 780,
            "centerDistance": 780,
            "weight": 8400,
            "dimensions": "2876×2151×1970",
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2520,
                "max": 8235
            },
            "image": "/images/gearbox/Advance-GWD.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH28.30",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.44,
                0.44,
                0.44,
                0.44,
                0.44
            ],
            "thrust": 80,
            "centerDistance": 100,
            "weight": 1230,
            "efficiency": 0.97,
            "basePrice": 68875,
            "price": 68875,
            "discountRate": 0.1,
            "powerRange": {
                "min": 176,
                "max": 792
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH30.32A",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                1.97,
                2.52,
                2.96,
                3.52,
                4
            ],
            "transferCapacity": [
                0.57,
                0.57,
                0.57,
                0.56,
                0.52
            ],
            "thrust": 100,
            "weight": 1350,
            "dimensions": "1433×1200×888",
            "efficiency": 0.97,
            "basePrice": 86260,
            "price": 86260,
            "discountRate": 0.1,
            "powerRange": {
                "min": 208,
                "max": 1026
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH32.35",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.72,
                0.72,
                0.72,
                0.72,
                0.72
            ],
            "thrust": 120,
            "centerDistance": 120,
            "weight": 2080,
            "dimensions": "1405×1240×920",
            "efficiency": 0.97,
            "basePrice": 98610,
            "price": 98610,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH36.39",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2.03,
                2.48,
                2.92,
                3.48,
                3.95
            ],
            "transferCapacity": [
                1.02,
                1.02,
                1.02,
                1.02,
                1.02
            ],
            "thrust": 140,
            "centerDistance": 140,
            "weight": 2450,
            "dimensions": "1645×1331×1060",
            "efficiency": 0.97,
            "basePrice": 117610,
            "price": 117610,
            "discountRate": 0.1,
            "powerRange": {
                "min": 408,
                "max": 1836
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH36.54",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.46,
                4.95,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.96,
                0.96,
                0.96,
                0.96
            ],
            "thrust": 220,
            "centerDistance": 220,
            "weight": 2960,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH39.41",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                1.4,
                1.4,
                1.4,
                1.4,
                1.4
            ],
            "thrust": 175,
            "centerDistance": 175,
            "weight": 2960,
            "efficiency": 0.97,
            "basePrice": 146110,
            "price": 146110,
            "discountRate": 0.1,
            "powerRange": {
                "min": 560,
                "max": 2240
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH39.57",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                1.29,
                1.29,
                1.29,
                1.29
            ],
            "thrust": 270,
            "centerDistance": 270,
            "weight": 3630,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 516,
                "max": 2064
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH42.45",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                1.97,
                2.55,
                2.93,
                3.58,
                4
            ],
            "transferCapacity": [
                1.81,
                1.81,
                1.81,
                1.81,
                1.81
            ],
            "thrust": 220,
            "centerDistance": 220,
            "weight": 3630,
            "efficiency": 0.97,
            "basePrice": 176510,
            "price": 176510,
            "discountRate": 0.1,
            "powerRange": {
                "min": 724,
                "max": 2896
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH42.63",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.46,
                5.08,
                5.46,
                5.95
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 290,
            "centerDistance": 290,
            "weight": 5560,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH45.49",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                2.03,
                2.48,
                3.09,
                3.48,
                3.95
            ],
            "transferCapacity": [
                2.23,
                2.23,
                2.23,
                2.23,
                2.23
            ],
            "thrust": 270,
            "centerDistance": 270,
            "weight": 5560,
            "efficiency": 0.97,
            "basePrice": 262010,
            "price": 262010,
            "discountRate": 0.1,
            "powerRange": {
                "min": 892,
                "max": 3122
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH45.68B",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 360,
            "centerDistance": 360,
            "weight": 7300,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH49.54",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.26,
                3.26,
                3.26,
                3.26,
                3.26
            ],
            "thrust": 290,
            "centerDistance": 290,
            "weight": 7300,
            "dimensions": "2126×1989×1340",
            "efficiency": 0.97,
            "basePrice": 382470,
            "price": 382470,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1304,
                "max": 3912
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH49.74",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                2.83,
                2.83,
                2.83,
                2.83
            ],
            "thrust": 540,
            "centerDistance": 540,
            "weight": 8900,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1132,
                "max": 3396
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH52.59",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.8067,
                3.8067,
                3.8067,
                3.8067,
                3.8067
            ],
            "thrust": 300,
            "centerDistance": 300,
            "weight": 8900,
            "dimensions": "2291×1400×1290",
            "efficiency": 0.97,
            "basePrice": 517750,
            "price": 517750,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1523,
                "max": 4568
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH52.82",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 710,
            "centerDistance": 710,
            "weight": 14000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH60.66",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                5.09,
                5.09,
                5.09,
                5.09,
                5.09
            ],
            "thrust": 450,
            "centerDistance": 450,
            "weight": 14000,
            "efficiency": 0.97,
            "basePrice": 760000,
            "price": 760000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2036,
                "max": 6108
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH60.92",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                5.05,
                5.05,
                5.05,
                5.05
            ],
            "thrust": 750,
            "centerDistance": 750,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2020,
                "max": 6060
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH63.71",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2,
                2.5,
                2.96,
                3.5,
                4.11
            ],
            "transferCapacity": [
                6.45,
                6.45,
                6.45,
                6.45,
                6.45
            ],
            "thrust": 710,
            "centerDistance": 710,
            "weight": 17000,
            "dimensions": "2645×2381×1740",
            "efficiency": 0.97,
            "basePrice": 902500,
            "price": 902500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1935,
                "max": 6450
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH63.95",
            "inputSpeedRange": [
                400,
                1000
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                6,
                6,
                6,
                6
            ],
            "thrust": 800,
            "centerDistance": 800,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2400,
                "max": 6000
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH66.106",
            "inputSpeedRange": [
                400,
                950
            ],
            "ratios": [
                4.52,
                4.96,
                5.48,
                6.05
            ],
            "transferCapacity": [
                7.2,
                7.2,
                7.2,
                7.2
            ],
            "thrust": 980,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2880,
                "max": 6840
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH66.75",
            "inputSpeedRange": [
                300,
                950
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                7.48,
                7.48,
                7.48,
                7.48,
                7.48
            ],
            "thrust": 730,
            "centerDistance": 730,
            "weight": 19000,
            "efficiency": 0.97,
            "basePrice": 997500,
            "price": 997500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2244,
                "max": 7106
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH70.111",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                8.11,
                8.11,
                8.11,
                8.11
            ],
            "thrust": 1200,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3244,
                "max": 7299
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH70.76",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95
            ],
            "transferCapacity": [
                8.15,
                8.15,
                8.15,
                8.15,
                8.15
            ],
            "thrust": 750,
            "centerDistance": 750,
            "weight": 21500,
            "efficiency": 0.97,
            "basePrice": 1045000,
            "price": 1045000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2445,
                "max": 7335
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWH70.82",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95,
                4.25
            ],
            "transferCapacity": [
                9.15,
                9.15,
                9.15,
                9.15,
                9.15,
                8.4
            ],
            "thrust": 780,
            "centerDistance": 780,
            "weight": 8400,
            "dimensions": "2876×2151×1970",
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2520,
                "max": 8235
            },
            "image": "/images/gearbox/Advance-GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK28.30",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.44,
                0.44,
                0.44,
                0.44,
                0.44
            ],
            "thrust": 80,
            "centerDistance": 100,
            "weight": 1130,
            "efficiency": 0.97,
            "basePrice": 66700,
            "price": 66700,
            "discountRate": 0.1,
            "powerRange": {
                "min": 176,
                "max": 792
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK30.32A",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                1.97,
                2.52,
                2.96,
                3.52,
                4
            ],
            "transferCapacity": [
                0.57,
                0.57,
                0.57,
                0.56,
                0.52
            ],
            "weight": 1300,
            "dimensions": "1433×1200×888",
            "efficiency": 0.97,
            "basePrice": 83536,
            "price": 83536,
            "discountRate": 0.1,
            "powerRange": {
                "min": 208,
                "max": 1026
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK32.35",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.72,
                0.72,
                0.72,
                0.72,
                0.72
            ],
            "thrust": 120,
            "centerDistance": 120,
            "weight": 2080,
            "dimensions": "1405×1240×920",
            "efficiency": 0.97,
            "basePrice": 95496,
            "price": 95496,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK36.39",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2.03,
                2.48,
                2.92,
                3.48,
                3.95
            ],
            "transferCapacity": [
                1.02,
                1.02,
                1.02,
                1.02,
                1.02
            ],
            "thrust": 140,
            "centerDistance": 140,
            "weight": 2250,
            "dimensions": "1645×1331×1060",
            "efficiency": 0.97,
            "basePrice": 113896,
            "price": 113896,
            "discountRate": 0.1,
            "powerRange": {
                "min": 408,
                "max": 1836
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK36.54",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.46,
                4.95,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.96,
                0.96,
                0.96,
                0.96
            ],
            "thrust": 220,
            "centerDistance": 220,
            "weight": 2960,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK39.41",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                1.4,
                1.4,
                1.4,
                1.4,
                1.4
            ],
            "thrust": 175,
            "centerDistance": 175,
            "weight": 2960,
            "efficiency": 0.97,
            "basePrice": 141496,
            "price": 141496,
            "discountRate": 0.1,
            "powerRange": {
                "min": 560,
                "max": 2240
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK42.45",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                1.97,
                2.55,
                2.93,
                3.58,
                4
            ],
            "transferCapacity": [
                1.81,
                1.81,
                1.81,
                1.81,
                1.81
            ],
            "thrust": 220,
            "centerDistance": 220,
            "weight": 3630,
            "efficiency": 0.97,
            "basePrice": 170936,
            "price": 170936,
            "discountRate": 0.1,
            "powerRange": {
                "min": 724,
                "max": 2896
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK42.63",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.46,
                5.08,
                5.46,
                5.95
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 270,
            "centerDistance": 270,
            "weight": 5560,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK45.49",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                2.03,
                2.48,
                3.09,
                3.48,
                3.95
            ],
            "transferCapacity": [
                2.23,
                2.23,
                2.23,
                2.23,
                2.23
            ],
            "thrust": 270,
            "centerDistance": 270,
            "weight": 5560,
            "efficiency": 0.97,
            "basePrice": 253736,
            "price": 253736,
            "discountRate": 0.1,
            "powerRange": {
                "min": 892,
                "max": 3122
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK45.68",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 360,
            "centerDistance": 360,
            "weight": 7300,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK49.54",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.26,
                3.26,
                3.26,
                3.26,
                3.26
            ],
            "thrust": 290,
            "centerDistance": 290,
            "weight": 7300,
            "dimensions": "2126×1989×1340",
            "efficiency": 0.97,
            "basePrice": 370392,
            "price": 370392,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1304,
                "max": 3912
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK49.74",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                2.83,
                2.83,
                2.83,
                2.83
            ],
            "thrust": 540,
            "centerDistance": 540,
            "weight": 7220,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1132,
                "max": 3396
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK52.59",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.8067,
                3.8067,
                3.8067,
                3.8067,
                3.8067
            ],
            "thrust": 300,
            "centerDistance": 300,
            "weight": 7220,
            "dimensions": "2291×1400×1290",
            "efficiency": 0.97,
            "basePrice": 501400,
            "price": 501400,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1523,
                "max": 4568
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK52.82",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 710,
            "centerDistance": 710,
            "weight": 14000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK60.66",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                5.09,
                5.09,
                5.09,
                5.09,
                5.09
            ],
            "thrust": 450,
            "centerDistance": 450,
            "weight": 14000,
            "efficiency": 0.97,
            "basePrice": 736000,
            "price": 736000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2400,
                "max": 7200
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK60.92",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                5.05,
                5.05,
                5.05,
                5.05
            ],
            "thrust": 750,
            "centerDistance": 750,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2580,
                "max": 7740
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK63.71",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2,
                2.5,
                2.96,
                3.5,
                4.11
            ],
            "transferCapacity": [
                6.45,
                6.45,
                6.45,
                6.45,
                6.45
            ],
            "thrust": 710,
            "centerDistance": 710,
            "weight": 17000,
            "dimensions": "2645×2381×1740",
            "efficiency": 0.97,
            "basePrice": 874000,
            "price": 874000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2244,
                "max": 7480
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK63.95",
            "inputSpeedRange": [
                400,
                1000
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                6,
                6,
                6,
                6
            ],
            "thrust": 800,
            "centerDistance": 800,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2992,
                "max": 7480
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK66.106",
            "inputSpeedRange": [
                400,
                950
            ],
            "ratios": [
                4.52,
                4.96,
                5.48,
                6.05
            ],
            "transferCapacity": [
                7.2,
                7.2,
                7.2,
                7.2
            ],
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3660,
                "max": 8693
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK66.75",
            "inputSpeedRange": [
                300,
                950
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                7.48,
                7.48,
                7.48,
                7.48,
                7.48
            ],
            "thrust": 730,
            "centerDistance": 730,
            "weight": 19000,
            "efficiency": 0.97,
            "basePrice": 966000,
            "price": 966000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2445,
                "max": 7743
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK70.111",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                8.11,
                8.11,
                8.11,
                8.11
            ],
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3244,
                "max": 7299
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK70.76",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95
            ],
            "transferCapacity": [
                8.15,
                8.15,
                8.15,
                8.15,
                8.15
            ],
            "thrust": 750,
            "centerDistance": 750,
            "weight": 21500,
            "efficiency": 0.97,
            "basePrice": 1012000,
            "price": 1012000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2745,
                "max": 8235
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWK70.82",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95,
                4.25
            ],
            "transferCapacity": [
                9.15,
                9.15,
                9.15,
                9.15,
                9.15,
                8.4
            ],
            "thrust": 780,
            "centerDistance": 780,
            "weight": 8400,
            "dimensions": "2876×2151×1970",
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2745,
                "max": 8235
            },
            "image": "/images/gearbox/Advance-GWK.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL28.30",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                2.06,
                2.51,
                3.08,
                3.54,
                4.05,
                4.54,
                5.09,
                5.59,
                6.14
            ],
            "transferCapacity": [
                0.865,
                0.711,
                0.578,
                0.504,
                0.44,
                0.393,
                0.35,
                0.319,
                0.29
            ],
            "thrust": 80,
            "weight": 1070,
            "efficiency": 0.97,
            "basePrice": 66700,
            "price": 66700,
            "discountRate": 0.1,
            "powerRange": {
                "min": 116,
                "max": 779
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL30.32",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                2.03,
                2.55,
                3.04,
                3.52,
                4,
                4.55,
                5.05,
                5.64,
                6.05
            ],
            "transferCapacity": [
                1.122,
                0.894,
                0.75,
                0.647,
                0.57,
                0.501,
                0.451,
                0.404,
                0.376
            ],
            "thrust": 100,
            "centerDistance": 100,
            "weight": 1240,
            "efficiency": 0.97,
            "basePrice": 83536,
            "price": 83536,
            "discountRate": 0.1,
            "powerRange": {
                "min": 150,
                "max": 1010
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL32.35",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                2.06,
                2.54,
                3.02,
                3.58,
                4.05,
                4.59,
                5.09,
                5.57,
                6.08
            ],
            "transferCapacity": [
                1.4175,
                1.1481,
                0.9659,
                0.816,
                0.72,
                0.6353,
                0.5733,
                0.5236,
                0.48
            ],
            "thrust": 120,
            "centerDistance": 120,
            "weight": 2240,
            "efficiency": 0.97,
            "basePrice": 95496,
            "price": 95496,
            "discountRate": 0.1,
            "powerRange": {
                "min": 192,
                "max": 1276
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL36.39",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                1.97,
                2.45,
                2.98,
                3.47,
                3.95,
                4.4,
                5.01,
                5.47,
                5.97
            ],
            "transferCapacity": [
                2.045,
                1.644,
                1.352,
                1.161,
                1.02,
                0.916,
                0.804,
                0.737,
                0.675
            ],
            "thrust": 140,
            "centerDistance": 140,
            "weight": 2700,
            "efficiency": 0.97,
            "basePrice": 113896,
            "price": 113896,
            "discountRate": 0.1,
            "powerRange": {
                "min": 270,
                "max": 1841
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL39.41",
            "inputSpeedRange": [
                400,
                800
            ],
            "ratios": [
                1.98,
                2.47,
                3.05,
                3.48,
                4.05,
                4.48,
                5,
                5.51,
                5.99
            ],
            "transferCapacity": [
                2.872,
                2.297,
                1.858,
                1.63,
                1.4,
                1.265,
                1.135,
                1.03,
                0.947
            ],
            "thrust": 175,
            "centerDistance": 175,
            "weight": 3550,
            "efficiency": 0.97,
            "basePrice": 141496,
            "price": 141496,
            "discountRate": 0.1,
            "powerRange": {
                "min": 379,
                "max": 2298
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL42.45",
            "inputSpeedRange": [
                400,
                800
            ],
            "ratios": [
                2,
                2.55,
                3.02,
                3.58,
                4,
                4.47,
                5,
                5.6,
                5.93
            ],
            "transferCapacity": [
                3.62,
                2.844,
                2.394,
                2.023,
                1.81,
                1.619,
                1.448,
                1.293,
                1.221
            ],
            "thrust": 220,
            "centerDistance": 220,
            "weight": 4190,
            "efficiency": 0.97,
            "basePrice": 170936,
            "price": 170936,
            "discountRate": 0.1,
            "powerRange": {
                "min": 488,
                "max": 2896
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL45.49",
            "inputSpeedRange": [
                400,
                700
            ],
            "ratios": [
                1.97,
                2.47,
                2.89,
                3.47,
                3.95,
                4.37,
                4.85,
                5.5,
                5.98
            ],
            "transferCapacity": [
                4.46,
                3.568,
                3.041,
                2.54,
                2.23,
                2.012,
                1.815,
                1.6,
                1.471
            ],
            "thrust": 270,
            "centerDistance": 270,
            "weight": 5350,
            "efficiency": 0.97,
            "basePrice": 253736,
            "price": 253736,
            "discountRate": 0.1,
            "powerRange": {
                "min": 588,
                "max": 3122
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL45.52",
            "inputSpeedRange": [
                400,
                630
            ],
            "ratios": [
                1.97,
                2.52,
                2.99,
                3.47,
                4.01,
                4.64,
                4.98,
                5.51,
                6.04
            ],
            "transferCapacity": [
                4.845,
                3.815,
                3.185,
                2.748,
                2.435,
                2.146,
                1.915,
                1.73,
                1.609
            ],
            "thrust": 270,
            "centerDistance": 270,
            "efficiency": 0.97,
            "basePrice": 294400,
            "price": 294400,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2416,
                "max": 3805
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL49.54",
            "inputSpeedRange": [
                400,
                600
            ],
            "ratios": [
                1.94,
                2.46,
                2.92,
                3.45,
                3.95,
                4.53,
                4.91,
                5.48,
                6
            ],
            "transferCapacity": [
                5.88,
                4.628,
                3.901,
                3.303,
                2.88,
                2.51,
                2.318,
                2.076,
                1.898
            ],
            "thrust": 290,
            "centerDistance": 290,
            "weight": 7000,
            "efficiency": 0.97,
            "basePrice": 370392,
            "price": 370392,
            "discountRate": 0.1,
            "powerRange": {
                "min": 759,
                "max": 3528
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL49.59",
            "inputSpeedRange": [
                400,
                550
            ],
            "ratios": [
                2.03,
                2.49,
                3.04,
                3.49,
                4,
                4.48,
                5.01,
                5.51,
                6.01
            ],
            "transferCapacity": [
                6.409,
                5.226,
                4.288,
                3.735,
                3.26,
                2.913,
                2.603,
                2.366,
                2.171
            ],
            "thrust": 290,
            "centerDistance": 290,
            "efficiency": 0.97,
            "basePrice": 423200,
            "price": 423200,
            "discountRate": 0.1,
            "powerRange": {
                "min": 868,
                "max": 3525
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL52.59",
            "inputSpeedRange": [
                400,
                600
            ],
            "ratios": [
                1.93,
                2.48,
                2.96,
                3.53,
                3.95,
                4.43,
                4.97,
                5.4,
                5.93
            ],
            "transferCapacity": [
                7.779,
                6.063,
                5.076,
                4.268,
                3.807,
                3.395,
                3.026,
                2.785,
                2.538
            ],
            "thrust": 300,
            "centerDistance": 300,
            "weight": 8955,
            "efficiency": 0.97,
            "basePrice": 501400,
            "price": 501400,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1015,
                "max": 4667
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL52.62",
            "inputSpeedRange": [
                400,
                565
            ],
            "ratios": [
                2.02,
                2.46,
                3.02,
                3.45,
                4.06,
                4.52,
                5.04,
                5.46,
                5.95,
                6.49,
                6.94
            ],
            "transferCapacity": [
                7.798,
                6.404,
                5.216,
                4.566,
                3.88,
                3.485,
                3.126,
                2.885,
                2.648,
                2.427,
                2.27
            ],
            "thrust": 300,
            "centerDistance": 300,
            "weight": 9300,
            "efficiency": 0.97,
            "basePrice": 529000,
            "price": 529000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 908,
                "max": 4406
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL60.66",
            "inputSpeedRange": [
                400,
                600
            ],
            "ratios": [
                2.01,
                2.5,
                3.07,
                3.57,
                4.05,
                4.48,
                5.08,
                5.51,
                6.12,
                6.52,
                6.97
            ],
            "transferCapacity": [
                10.026,
                8.073,
                6.567,
                5.645,
                4.98,
                4.5,
                3.973,
                3.664,
                3.299,
                3.06,
                3
            ],
            "thrust": 450,
            "centerDistance": 450,
            "weight": 13290,
            "efficiency": 0.97,
            "basePrice": 736000,
            "price": 736000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2258,
                "max": 6016
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL60.74",
            "inputSpeedRange": [
                400,
                530
            ],
            "ratios": [
                1.99,
                2.53,
                3.06,
                3.51,
                4.02,
                4.5,
                5.04,
                5.51,
                6.04,
                6.5,
                6.94
            ],
            "transferCapacity": [
                11.6,
                9.344,
                7.723,
                6.726,
                5.87,
                5.246,
                4.688,
                4.282,
                3.909,
                3.632,
                3.4
            ],
            "thrust": 550,
            "centerDistance": 550,
            "weight": 15100,
            "efficiency": 0.97,
            "basePrice": 846400,
            "price": 846400,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1360,
                "max": 6148
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL66.75",
            "inputSpeedRange": [
                300,
                490
            ],
            "ratios": [
                2.05,
                2.55,
                2.99,
                3.48,
                3.95,
                4.49,
                4.97,
                5.51,
                6.12,
                6.59,
                6.95
            ],
            "transferCapacity": [
                14.406,
                11.582,
                9.9,
                8.491,
                7.48,
                6.59,
                5.95,
                5.366,
                4.831,
                4.488,
                4.253
            ],
            "thrust": 730,
            "centerDistance": 730,
            "weight": 17500,
            "efficiency": 0.97,
            "basePrice": 966000,
            "price": 966000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2547,
                "max": 7059
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL70.76",
            "inputSpeedRange": [
                300,
                465
            ],
            "ratios": [
                2.05,
                2.53,
                3.09,
                3.58,
                3.95,
                4.57,
                5.05,
                5.58,
                5.77,
                6.17,
                6.54,
                6.94
            ],
            "transferCapacity": [
                15.718,
                12.734,
                10.414,
                8.986,
                8.15,
                7.039,
                6.378,
                5.773,
                5.562,
                5.216,
                4.934,
                4.5
            ],
            "thrust": 750,
            "centerDistance": 750,
            "weight": 20000,
            "efficiency": 0.97,
            "basePrice": 1012000,
            "price": 1012000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2445,
                "max": 7309
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL70.82",
            "inputSpeedRange": [
                300,
                465
            ],
            "ratios": [
                2.05,
                2.53,
                3.09,
                3.58,
                3.95,
                4.57
            ],
            "transferCapacity": [
                17.646,
                14.297,
                11.692,
                10.088,
                9.15,
                7.902
            ],
            "thrust": 780,
            "centerDistance": 780,
            "weight": 20500,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2371,
                "max": 8205
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL70.85",
            "inputSpeedRange": [
                300,
                425
            ],
            "ratios": [
                1.98,
                2.45,
                3.01,
                3.49,
                3.95
            ],
            "transferCapacity": [
                21.441,
                17.291,
                14.089,
                12.131,
                10.72
            ],
            "thrust": 800,
            "centerDistance": 800,
            "weight": 24200,
            "efficiency": 0.97,
            "basePrice": 1352400,
            "price": 1352400,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3216,
                "max": 9112
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL75.90",
            "inputSpeedRange": [
                200,
                465
            ],
            "ratios": [
                2.01,
                2.51,
                3.01,
                3.51,
                4
            ],
            "transferCapacity": [
                22.423,
                17.966,
                15,
                12.833,
                11.282
            ],
            "thrust": 980,
            "centerDistance": 980,
            "weight": 31500,
            "efficiency": 0.97,
            "basePrice": 1656000,
            "price": 1656000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2256,
                "max": 10427
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL78.88",
            "inputSpeedRange": [
                300,
                335
            ],
            "ratios": [
                2.04,
                2.49,
                2.98,
                3.48,
                3.95,
                4.49,
                5.01,
                5.47,
                6.09
            ],
            "transferCapacity": [
                23.372,
                19.099,
                15.983,
                13.708,
                12.063,
                10.615,
                9.511,
                8.712,
                7.83
            ],
            "thrust": 1000,
            "weight": 32000,
            "efficiency": 0.97,
            "basePrice": 1536400,
            "price": 1536400,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2349,
                "max": 7830
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL80.95",
            "inputSpeedRange": [
                200,
                350
            ],
            "ratios": [
                1.98,
                2.49,
                2.94,
                3.46,
                3.95,
                4.51,
                5.03,
                5.48,
                5.93
            ],
            "transferCapacity": [
                28,
                22.2,
                18.81,
                16,
                14,
                12.25,
                11,
                10.09,
                9.33
            ],
            "thrust": 1200,
            "weight": 37000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2800,
                "max": 9800
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWL85.100",
            "inputSpeedRange": [
                150,
                400
            ],
            "ratios": [
                1.98,
                2.55,
                2.98,
                3.48,
                3.95,
                4.48,
                4.97,
                5.51,
                5.99,
                6.45,
                7.05
            ],
            "transferCapacity": [
                35,
                27.429,
                23.445,
                20.108,
                17.5,
                15.605,
                14.091,
                12.708,
                11.684,
                10.845,
                9.92
            ],
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1488,
                "max": 14000
            },
            "image": "/images/gearbox/Advance-GWL.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS28.30",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.44,
                0.44,
                0.44,
                0.44,
                0.44
            ],
            "thrust": 80,
            "centerDistance": 100,
            "weight": 1230,
            "dimensions": "1183×1050×970",
            "efficiency": 0.97,
            "basePrice": 68875,
            "price": 68875,
            "discountRate": 0.1,
            "powerRange": {
                "min": 176,
                "max": 792
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS28.30G/GWH28.30G",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.44,
                0.44,
                0.44,
                0.44,
                0.44
            ],
            "thrust": 80,
            "centerDistance": 1,
            "efficiency": 0.97,
            "basePrice": 68875,
            "price": 68875,
            "discountRate": 0.1,
            "powerRange": {
                "min": 176,
                "max": 792
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS30.32A",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                1.97,
                2.52,
                2.96,
                3.52,
                4
            ],
            "transferCapacity": [
                0.57,
                0.57,
                0.57,
                0.56,
                0.52
            ],
            "thrust": 100,
            "weight": 1460,
            "dimensions": "1433×1200×888",
            "efficiency": 0.97,
            "basePrice": 86260,
            "price": 86260,
            "discountRate": 0.1,
            "powerRange": {
                "min": 208,
                "max": 1026
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS32.35",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.72,
                0.72,
                0.72,
                0.72,
                0.72
            ],
            "thrust": 120,
            "centerDistance": 120,
            "weight": 2250,
            "dimensions": "1437×1210×1110",
            "efficiency": 0.97,
            "basePrice": 98610,
            "price": 98610,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS32.35G/GWH32.35G",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.72,
                0.72,
                0.72,
                0.72,
                0.72
            ],
            "thrust": 120,
            "centerDistance": 2,
            "dimensions": "1405×1240×920",
            "efficiency": 0.97,
            "basePrice": 98610,
            "price": 98610,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS36.39",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2.03,
                2.48,
                2.92,
                3.48,
                3.95
            ],
            "transferCapacity": [
                1.02,
                1.02,
                1.02,
                1.02,
                1.02
            ],
            "thrust": 140,
            "centerDistance": 140,
            "weight": 2450,
            "dimensions": "1563×1330×1230",
            "efficiency": 0.97,
            "basePrice": 117610,
            "price": 117610,
            "discountRate": 0.1,
            "powerRange": {
                "min": 408,
                "max": 1836
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS36.39G/GWH36.39G",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2.03,
                2.48,
                2.92,
                3.48,
                3.95
            ],
            "transferCapacity": [
                1.02,
                1.02,
                1.02,
                1.02,
                1.02
            ],
            "thrust": 140,
            "centerDistance": 2,
            "dimensions": "1645×1331×1060",
            "efficiency": 0.97,
            "basePrice": 117610,
            "price": 117610,
            "discountRate": 0.1,
            "powerRange": {
                "min": 408,
                "max": 1836
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS36.54",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.46,
                4.95,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.96,
                0.96,
                0.96,
                0.96
            ],
            "thrust": 220,
            "centerDistance": 220,
            "weight": 3230,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS36.54G/GWH36.54G",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.46,
                4.95,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.96,
                0.96,
                0.96,
                0.96
            ],
            "thrust": 220,
            "efficiency": 0.97,
            "basePrice": 9555,
            "price": 9555,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS39.41",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                1.4,
                1.4,
                1.4,
                1.4,
                1.4
            ],
            "thrust": 175,
            "centerDistance": 175,
            "weight": 3230,
            "efficiency": 0.97,
            "basePrice": 146110,
            "price": 146110,
            "discountRate": 0.1,
            "powerRange": {
                "min": 560,
                "max": 2240
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS39.41G/GWH39.41G",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                1.4,
                1.4,
                1.4,
                1.4,
                1.4
            ],
            "thrust": 175,
            "centerDistance": 3,
            "efficiency": 0.97,
            "basePrice": 146110,
            "price": 146110,
            "discountRate": 0.1,
            "powerRange": {
                "min": 560,
                "max": 2240
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS39.57",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                1.29,
                1.29,
                1.29,
                1.29
            ],
            "thrust": 270,
            "centerDistance": 270,
            "weight": 3960,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 516,
                "max": 2064
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS39.57G/GWH39.57G",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                1.29,
                1.29,
                1.29,
                1.29
            ],
            "thrust": 270,
            "efficiency": 0.97,
            "basePrice": 9825,
            "price": 9825,
            "discountRate": 0.1,
            "powerRange": {
                "min": 516,
                "max": 2064
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS42.45",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                1.97,
                2.55,
                2.93,
                3.58,
                4
            ],
            "transferCapacity": [
                1.81,
                1.81,
                1.81,
                1.81,
                1.81
            ],
            "thrust": 220,
            "centerDistance": 220,
            "weight": 3960,
            "dimensions": "1613×1460×1360",
            "efficiency": 0.97,
            "basePrice": 176510,
            "price": 176510,
            "discountRate": 0.1,
            "powerRange": {
                "min": 724,
                "max": 2896
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS42.45G/GWH42.45G",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                1.97,
                2.55,
                2.93,
                3.58,
                4
            ],
            "transferCapacity": [
                1.81,
                1.81,
                1.81,
                1.81,
                1.81
            ],
            "thrust": 220,
            "centerDistance": 3,
            "efficiency": 0.97,
            "basePrice": 176510,
            "price": 176510,
            "discountRate": 0.1,
            "powerRange": {
                "min": 724,
                "max": 2896
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS42.63",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.46,
                5.08,
                5.46,
                5.95
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 290,
            "centerDistance": 290,
            "weight": 6030,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS42.63G/GWH42.63G",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.46,
                5.08,
                5.46,
                5.95
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 290,
            "efficiency": 0.97,
            "basePrice": 10117,
            "price": 10117,
            "discountRate": 0.1,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS45.49",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                2.03,
                2.48,
                3.09,
                3.48,
                3.95
            ],
            "transferCapacity": [
                2.23,
                2.23,
                2.23,
                2.23,
                2.23
            ],
            "thrust": 270,
            "centerDistance": 270,
            "weight": 6030,
            "efficiency": 0.97,
            "basePrice": 262010,
            "price": 262010,
            "discountRate": 0.1,
            "powerRange": {
                "min": 892,
                "max": 3122
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS45.49G/GWH45.49G",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                2.03,
                2.48,
                3.09,
                3.48,
                3.95
            ],
            "transferCapacity": [
                2.23,
                2.23,
                2.23,
                2.23,
                2.23
            ],
            "thrust": 270,
            "centerDistance": 6,
            "efficiency": 0.97,
            "basePrice": 262010,
            "price": 262010,
            "discountRate": 0.1,
            "powerRange": {
                "min": 892,
                "max": 3122
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS45.68",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 360,
            "centerDistance": 360,
            "weight": 7900,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS45.68G/GWH45.68B/GWD45.68",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 360,
            "efficiency": 0.97,
            "basePrice": 10430,
            "price": 10430,
            "discountRate": 0.1,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS49.54",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.26,
                3.26,
                3.26,
                3.26,
                3.26
            ],
            "thrust": 290,
            "centerDistance": 290,
            "weight": 7900,
            "dimensions": "2189×1892×1750",
            "efficiency": 0.97,
            "basePrice": 382470,
            "price": 382470,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1304,
                "max": 3912
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS49.54G/GWH49.54G",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.26,
                3.26,
                3.26,
                3.26,
                3.26
            ],
            "thrust": 290,
            "centerDistance": 7,
            "dimensions": "2126×1989×1340",
            "efficiency": 0.97,
            "basePrice": 382470,
            "price": 382470,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1304,
                "max": 3912
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS49.61",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.45,
                5,
                5.26,
                5.5
            ],
            "transferCapacity": [
                2.825,
                2.72,
                2.53,
                2.47
            ],
            "thrust": 290,
            "centerDistance": 8,
            "weight": 8500,
            "dimensions": "2217×1846×1750",
            "efficiency": 0.97,
            "basePrice": 8077,
            "price": 8077,
            "discountRate": 0.1,
            "powerRange": {
                "min": 988,
                "max": 3390
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS49.74",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                2.83,
                2.83,
                2.83,
                2.83
            ],
            "thrust": 540,
            "centerDistance": 540,
            "weight": 8900,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1132,
                "max": 3396
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS49.74G/GWH49.74G",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                2.83,
                2.83,
                2.83,
                2.83
            ],
            "thrust": 540,
            "efficiency": 0.97,
            "basePrice": 10881,
            "price": 10881,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1132,
                "max": 3396
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS52.59",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.8067,
                3.8067,
                3.8067,
                3.8067,
                3.8067
            ],
            "thrust": 300,
            "centerDistance": 300,
            "weight": 8900,
            "dimensions": "2291×1400×1290",
            "efficiency": 0.97,
            "basePrice": 517750,
            "price": 517750,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1523,
                "max": 4568
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS52.71",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5
            ],
            "transferCapacity": [
                3.806,
                3.806
            ],
            "thrust": 540,
            "centerDistance": 12,
            "weight": 12300,
            "dimensions": "2406×2123×1970",
            "efficiency": 0.97,
            "basePrice": 8173,
            "price": 8173,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1522,
                "max": 4567
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS52.82",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 710,
            "centerDistance": 710,
            "weight": 15000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS52.82G/GWH52.82G",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 710,
            "efficiency": 0.97,
            "basePrice": 11245,
            "price": 11245,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS60.66",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                5.09,
                5.09,
                5.09,
                5.09,
                5.09
            ],
            "thrust": 450,
            "centerDistance": 450,
            "weight": 15000,
            "dimensions": "2324×2080×1920",
            "efficiency": 0.97,
            "basePrice": 760000,
            "price": 760000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2036,
                "max": 6108
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS60.66G/GWH60.66G",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                5.09,
                5.09,
                5.09,
                5.09,
                5.09
            ],
            "thrust": 450,
            "centerDistance": 15141414,
            "efficiency": 0.97,
            "basePrice": 760000,
            "price": 760000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2036,
                "max": 6108
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS60.75",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                5,
                5.42,
                6
            ],
            "transferCapacity": [
                5.09,
                5.09,
                4.25
            ],
            "thrust": 700,
            "centerDistance": 700,
            "weight": 18300,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1700,
                "max": 6108
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS60.92",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                5.05,
                5.05,
                5.05,
                5.05
            ],
            "thrust": 750,
            "centerDistance": 750,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2020,
                "max": 6060
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS60.92G/GWH60.92G",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                5.05,
                5.05,
                5.05,
                5.05
            ],
            "thrust": 750,
            "efficiency": 0.97,
            "basePrice": 12320,
            "price": 12320,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2020,
                "max": 6060
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS63.71",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2,
                2.5,
                2.96,
                3.5,
                4.11
            ],
            "transferCapacity": [
                6.45,
                6.45,
                6.45,
                6.45,
                6.45
            ],
            "thrust": 710,
            "centerDistance": 710,
            "weight": 17000,
            "dimensions": "2645×2381×1740",
            "efficiency": 0.97,
            "basePrice": 902500,
            "price": 902500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1935,
                "max": 6450
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS63.78A",
            "inputSpeedRange": [
                400,
                800
            ],
            "ratios": [
                3.5,
                4,
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                7,
                7,
                7,
                7,
                7,
                7
            ],
            "thrust": 500,
            "centerDistance": 0,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2000,
                "max": 5000
            },
            "image": "/images/gearbox/Advance-GW.webp",
            "notes": "新型号，数据待完善，3676kW/650rpm",
            "source": "项目跟踪记录-九江1000TEU集装箱船"
        },
        {
            "model": "GWS63.71/GWK63.71/GWH63.71/GWD63.71",
            "inputSpeedRange": [
                300,
                1000
            ],
            "ratios": [
                2,
                2.5,
                2.96,
                3.5,
                4.11
            ],
            "transferCapacity": [
                6.45,
                6.45,
                6.45,
                6.45,
                6.45
            ],
            "thrust": 710,
            "centerDistance": 17,
            "dimensions": "2645×2381×1740",
            "efficiency": 0.97,
            "basePrice": 902500,
            "price": 902500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1935,
                "max": 6450
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS63.95",
            "inputSpeedRange": [
                400,
                1000
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                6,
                6,
                6,
                6
            ],
            "thrust": 800,
            "centerDistance": 800,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2400,
                "max": 6000
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS63.95/GWK63.95/GWH63.95/GWD63.95",
            "inputSpeedRange": [
                400,
                1000
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                6,
                6,
                6,
                6
            ],
            "thrust": 800,
            "efficiency": 0.97,
            "basePrice": 12763,
            "price": 12763,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2400,
                "max": 6000
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS66.106",
            "inputSpeedRange": [
                400,
                950
            ],
            "ratios": [
                4.52,
                4.96,
                5.48,
                6.05
            ],
            "transferCapacity": [
                7.2,
                7.2,
                7.2,
                7.2
            ],
            "thrust": 980,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2880,
                "max": 6840
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS66.106G/GWH66.106G",
            "inputSpeedRange": [
                400,
                950
            ],
            "ratios": [
                4.52,
                4.96,
                5.48,
                6.05
            ],
            "transferCapacity": [
                7.2,
                7.2,
                7.2,
                7.2
            ],
            "thrust": 980,
            "efficiency": 0.97,
            "basePrice": 13227,
            "price": 13227,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2880,
                "max": 6840
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS66.75",
            "inputSpeedRange": [
                300,
                950
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                7.48,
                7.48,
                7.48,
                7.48,
                7.48
            ],
            "thrust": 730,
            "centerDistance": 730,
            "weight": 20000,
            "efficiency": 0.97,
            "basePrice": 997500,
            "price": 997500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2244,
                "max": 7106
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS66.75G/GWH66.75G",
            "inputSpeedRange": [
                300,
                950
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                7.48,
                7.48,
                7.48,
                7.48,
                7.48
            ],
            "thrust": 730,
            "centerDistance": 20191919,
            "efficiency": 0.97,
            "basePrice": 997500,
            "price": 997500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2244,
                "max": 7106
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS70.111",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                8.11,
                8.11,
                8.11,
                8.11
            ],
            "thrust": 1200,
            "weight": 17000,
            "efficiency": 0.97,
            "basePrice": 300000,
            "price": 300000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3244,
                "max": 7299
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS70.111G/GWH70.111G",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                8.11,
                8.11,
                8.11,
                8.11
            ],
            "thrust": 1200,
            "efficiency": 0.97,
            "basePrice": 13880,
            "price": 13880,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3244,
                "max": 7299
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS70.76",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95
            ],
            "transferCapacity": [
                8.15,
                8.15,
                8.15,
                8.15,
                8.15
            ],
            "thrust": 750,
            "centerDistance": 750,
            "weight": 22500,
            "efficiency": 0.97,
            "basePrice": 1045000,
            "price": 1045000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2445,
                "max": 7335
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS70.76G/GWH70.76G",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95
            ],
            "transferCapacity": [
                8.15,
                8.15,
                8.15,
                8.15,
                8.15
            ],
            "thrust": 750,
            "centerDistance": 22,
            "efficiency": 0.97,
            "basePrice": 1045000,
            "price": 1045000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2445,
                "max": 7335
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GWS70.82",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95,
                4.25
            ],
            "transferCapacity": [
                9.15,
                9.15,
                9.15,
                9.15,
                9.15,
                8.4
            ],
            "thrust": 780,
            "centerDistance": 780,
            "weight": 23000,
            "dimensions": "2876×2151×1970",
            "efficiency": 0.97,
            "basePrice": 450000,
            "price": 450000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2520,
                "max": 8235
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "SGWL49.54",
            "inputSpeedRange": [
                600,
                1500
            ],
            "ratios": [
                1.88,
                2.05
            ],
            "transferCapacity": [
                5,
                5
            ],
            "thrust": 300,
            "centerDistance": 0,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1500,
                "max": 3500
            },
            "image": "/images/gearbox/Advance-GW.webp",
            "notes": "特殊型号，配舵桨，双速比1.88:1/2.05:1，2940kW/1500rpm",
            "source": "项目跟踪记录-芜湖造船厂2#3#栈桥作业船"
        },
        {
            "model": "SGWL52.59",
            "inputSpeedRange": [
                600,
                1000
            ],
            "ratios": [
                1.022,
                1.145
            ],
            "transferCapacity": [
                6,
                6
            ],
            "thrust": 350,
            "centerDistance": 0,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2000,
                "max": 4500
            },
            "image": "/images/gearbox/Advance-GW.webp",
            "notes": "特殊型号，配舵桨，双速比1.022:1/1.145:1，3600kW/800rpm",
            "source": "项目跟踪记录-芜湖造船厂4#运输船"
        }
    ],
    "hcmGearboxes": [
        {
            "model": "HCM70",
            "inputSpeedRange": [
                1500,
                3000
            ],
            "ratios": [
                1.6,
                2,
                2.55,
                3.11,
                3.59,
                3.88
            ],
            "transferCapacity": [
                0.009,
                0.009,
                0.007,
                0.007,
                0.006,
                0.006
            ],
            "thrust": 3,
            "centerDistance": 100,
            "weight": 75,
            "controlType": "电控",
            "dimensions": "236x390x420",
            "efficiency": 0.95,
            "basePrice": 10200,
            "price": 10200,
            "discountRate": 0,
            "factoryPrice": 10200,
            "packagePrice": 10200,
            "marketPrice": 10200,
            "notes": "全国统一售价"
        },
        {
            "model": "HCM160",
            "inputSpeedRange": [
                1500,
                3000
            ],
            "ratios": [
                2.03,
                2.46,
                3.04,
                3.57,
                4.05,
                4.39,
                4.7
            ],
            "transferCapacity": [
                0.02,
                0.02,
                0.018,
                0.016,
                0.014,
                0.013,
                0.011
            ],
            "thrust": 5.5,
            "centerDistance": 125,
            "weight": 115,
            "controlType": "电控",
            "dimensions": "291x454x485",
            "efficiency": 0.96,
            "basePrice": 14400,
            "price": 14400,
            "discountRate": 0,
            "factoryPrice": 14400,
            "packagePrice": 14400,
            "marketPrice": 14400,
            "notes": "全国统一售价"
        },
        {
            "model": "HCM250",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1.97,
                2.52,
                3.03,
                3.54,
                3.95,
                4.5,
                5.06,
                5.47
            ],
            "transferCapacity": [
                0.03,
                0.03,
                0.03,
                0.026,
                0.023,
                0.019,
                0.016,
                0.013
            ],
            "thrust": 8.5,
            "centerDistance": 142,
            "weight": 140,
            "controlType": "电控",
            "dimensions": "308x520x540",
            "efficiency": 0.96,
            "basePrice": 17800,
            "price": 17800,
            "discountRate": 0,
            "factoryPrice": 17800,
            "packagePrice": 17800,
            "marketPrice": 17800,
            "notes": "全国统一售价"
        },
        {
            "model": "HCM435",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.97,
                2.52,
                3.04,
                3.52,
                3.95,
                4.53,
                5.12,
                5.56,
                5.88
            ],
            "transferCapacity": [
                0.053,
                0.053,
                0.053,
                0.053,
                0.053,
                0.053,
                0.05,
                0.047,
                0.037
            ],
            "thrust": 15,
            "centerDistance": 180,
            "weight": 240,
            "controlType": "电控/气控",
            "dimensions": "442x774x763",
            "efficiency": 0.97,
            "basePrice": 23600,
            "price": 23600,
            "discountRate": 0,
            "factoryPrice": 23600,
            "packagePrice": 23600,
            "marketPrice": 23600,
            "notes": "全国统一售价"
        },
        {
            "model": "HCM600",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                2,
                2.48,
                2.63,
                3,
                3.58,
                3.89
            ],
            "transferCapacity": [
                0.065,
                0.065,
                0.065,
                0.065,
                0.065,
                0.065
            ],
            "thrust": 20,
            "centerDistance": 190,
            "weight": 280,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 32000,
            "price": 32000,
            "discountRate": 0,
            "factoryPrice": 32000,
            "packagePrice": 32000,
            "marketPrice": 32000,
            "notes": "全国统一售价"
        },
        {
            "model": "HCM1250",
            "inputSpeedRange": [
                600,
                1900
            ],
            "ratios": [
                1.6,
                2.03,
                2.48,
                2.5,
                2.96,
                3.18,
                3.33,
                3.55,
                3.79,
                4.06,
                4.2,
                4.47
            ],
            "transferCapacity": [
                0.158,
                0.158,
                0.158,
                0.158,
                0.158,
                0.158,
                0.158,
                0.158,
                0.158,
                0.158,
                0.158,
                0.158
            ],
            "thrust": 45,
            "centerDistance": 220,
            "weight": 420,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 60000,
            "price": 60000,
            "discountRate": 0,
            "factoryPrice": 60000,
            "packagePrice": 60000,
            "marketPrice": 60000,
            "notes": "全国统一售价"
        },
        {
            "model": "HCM1600",
            "inputSpeedRange": [
                500,
                1650
            ],
            "ratios": [
                2.03,
                2.54,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.19,
                0.19,
                0.19,
                0.19,
                0.19
            ],
            "thrust": 60,
            "centerDistance": 245,
            "weight": 500,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 72000,
            "price": 72000,
            "discountRate": 0,
            "factoryPrice": 72000,
            "packagePrice": 72000,
            "marketPrice": 72000,
            "notes": "全国统一售价"
        },
        {
            "model": "HCM2400",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.52,
                2.04,
                2.43,
                2.9,
                3.48,
                4,
                4.45,
                5,
                5.35,
                5.5,
                5.96
            ],
            "transferCapacity": [
                0.28057,
                0.27935,
                0.27802,
                0.27659,
                0.27505,
                0.27342,
                0.27168,
                0.26984,
                0.2679,
                0.26586,
                0.26372
            ],
            "thrust": 80,
            "centerDistance": 270,
            "weight": 650,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCM3400",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.5,
                2.03,
                2.48,
                2.96,
                3.57,
                4.05,
                4.52,
                4.99,
                5.5,
                5.94
            ],
            "transferCapacity": [
                0.3869,
                0.3783,
                0.3697,
                0.361,
                0.352,
                0.3426,
                0.3328,
                0.3226,
                0.3119,
                0.3008
            ],
            "thrust": 100,
            "centerDistance": 290,
            "weight": 800,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCM165",
            "inputSpeedRange": [
                1500,
                3500
            ],
            "ratios": [
                1.18,
                1.25
            ],
            "transferCapacity": [
                0.1,
                0.14
            ],
            "thrust": 6,
            "centerDistance": 130,
            "weight": 120,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 15500,
            "price": 15500,
            "discountRate": 0,
            "factoryPrice": 15500,
            "packagePrice": 15500,
            "marketPrice": 15500,
            "notes": "基于HCM系列匹配.xls: 288-400kW/3300rpm"
        },
        {
            "model": "HCM303",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1,
                1.15,
                1.19
            ],
            "transferCapacity": [
                0.3,
                0.3,
                0.3
            ],
            "thrust": 10,
            "centerDistance": 150,
            "weight": 180,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 22000,
            "price": 22000,
            "discountRate": 0,
            "factoryPrice": 22000,
            "packagePrice": 22000,
            "marketPrice": 22000,
            "notes": "基于HCM系列匹配.xls: 404-596kW/1900-2400rpm"
        },
        {
            "model": "HCM306",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1.2
            ],
            "transferCapacity": [
                0.3
            ],
            "thrust": 12,
            "centerDistance": 155,
            "weight": 200,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 24000,
            "price": 24000,
            "discountRate": 0,
            "factoryPrice": 24000,
            "packagePrice": 24000,
            "marketPrice": 24000,
            "notes": "基于HCM系列匹配.xls: 600kW/2300rpm, 潍柴WP13F"
        },
        {
            "model": "HCM403",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1
            ],
            "transferCapacity": [
                0.32
            ],
            "thrust": 16,
            "centerDistance": 180,
            "weight": 250,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 28000,
            "price": 28000,
            "discountRate": 0,
            "factoryPrice": 28000,
            "packagePrice": 28000,
            "marketPrice": 28000,
            "notes": "基于HCM系列匹配.xls: 599-735kW/2300rpm"
        },
        {
            "model": "HCM500",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.167,
                1.226,
                1.37,
                1.5
            ],
            "transferCapacity": [
                0.48,
                0.48,
                0.48,
                0.48
            ],
            "thrust": 22,
            "centerDistance": 195,
            "weight": 320,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 38000,
            "price": 38000,
            "discountRate": 0,
            "factoryPrice": 38000,
            "packagePrice": 38000,
            "marketPrice": 38000,
            "notes": "基于HCM系列匹配.xls: 1000-1452kW/2300-2374rpm"
        },
        {
            "model": "HCM1801",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                3.034,
                3.36
            ],
            "transferCapacity": [
                1.85,
                1.85
            ],
            "thrust": 70,
            "centerDistance": 260,
            "weight": 600,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 85000,
            "price": 85000,
            "discountRate": 0,
            "factoryPrice": 85000,
            "packagePrice": 85000,
            "marketPrice": 85000,
            "notes": "基于HCM系列匹配.xls: 2560-3200kW/1800-1937rpm"
        },
        {
            "model": "HCAM90",
            "inputSpeedRange": [
                2000,
                4000
            ],
            "ratios": [
                2.9
            ],
            "transferCapacity": [
                0.1
            ],
            "thrust": 4,
            "centerDistance": 100,
            "weight": 65,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 12000,
            "price": 12000,
            "discountRate": 0,
            "factoryPrice": 12000,
            "packagePrice": 12000,
            "marketPrice": 12000,
            "notes": "高速轻量版, 基于HCM系列匹配.xls: 235-324kW/3700-3800rpm"
        },
        {
            "model": "HCAM250",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                2.18
            ],
            "transferCapacity": [
                0.15
            ],
            "thrust": 9,
            "centerDistance": 145,
            "weight": 145,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 19000,
            "price": 19000,
            "discountRate": 0,
            "factoryPrice": 19000,
            "packagePrice": 19000,
            "marketPrice": 19000,
            "notes": "高速轻量版, 基于HCM系列匹配.xls: 290kW/2200rpm"
        },
        {
            "model": "HCAM303",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1.19
            ],
            "transferCapacity": [
                0.3
            ],
            "thrust": 11,
            "centerDistance": 155,
            "weight": 185,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 24000,
            "price": 24000,
            "discountRate": 0,
            "factoryPrice": 24000,
            "packagePrice": 24000,
            "marketPrice": 24000,
            "notes": "高速轻量版, 基于HCM系列匹配.xls: 565kW/2100rpm, 河柴CHD234"
        },
        {
            "model": "HCAM403",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1,
                1.1,
                1.2
            ],
            "transferCapacity": [
                0.35,
                0.35,
                0.35
            ],
            "thrust": 17,
            "centerDistance": 185,
            "weight": 260,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 30000,
            "price": 30000,
            "discountRate": 0,
            "factoryPrice": 30000,
            "packagePrice": 30000,
            "marketPrice": 30000,
            "notes": "高速轻量版, 基于HCM系列匹配.xls: 662-735kW/2300rpm, 潍柴WP13"
        },
        {
            "model": "HCAM500",
            "inputSpeedRange": [
                1500,
                2600
            ],
            "ratios": [
                1.35,
                1.43,
                2.03,
                3
            ],
            "transferCapacity": [
                0.48,
                0.48,
                0.48,
                0.48
            ],
            "thrust": 24,
            "centerDistance": 200,
            "weight": 340,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 42000,
            "price": 42000,
            "discountRate": 0,
            "factoryPrice": 42000,
            "packagePrice": 42000,
            "marketPrice": 42000,
            "notes": "高速轻量版, 基于HCM系列匹配.xls: 735-1100kW/2300-2500rpm"
        },
        {
            "model": "HCAM1800",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                1.97
            ],
            "transferCapacity": [
                1.85
            ],
            "thrust": 75,
            "centerDistance": 270,
            "weight": 650,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 95000,
            "price": 95000,
            "discountRate": 0,
            "factoryPrice": 95000,
            "packagePrice": 95000,
            "marketPrice": 95000,
            "notes": "高速轻量版, 基于HCM系列匹配.xls: 2900kW/1750rpm, 河柴CHD622V20"
        },
        {
            "model": "HCVM710",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1.35,
                1.36,
                1.483
            ],
            "transferCapacity": [
                0.56,
                0.56,
                0.56
            ],
            "thrust": 30,
            "centerDistance": 210,
            "weight": 400,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 52000,
            "price": 52000,
            "discountRate": 0,
            "factoryPrice": 52000,
            "packagePrice": 52000,
            "marketPrice": 52000,
            "notes": "V型布置, 基于HCM系列匹配.xls: 1100kW/2100-2165rpm, 河柴"
        },
        {
            "model": "HCVM1250",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                1.51
            ],
            "transferCapacity": [
                0.9
            ],
            "thrust": 50,
            "centerDistance": 230,
            "weight": 480,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 68000,
            "price": 68000,
            "discountRate": 0,
            "factoryPrice": 68000,
            "packagePrice": 68000,
            "marketPrice": 68000,
            "notes": "V型布置, 基于HCM系列匹配.xls: 2000kW/2450rpm, 16M23"
        },
        {
            "model": "HCM1400",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.952,
                0.952,
                0.952,
                0.952
            ],
            "thrust": 150,
            "centerDistance": 400,
            "weight": 1400,
            "efficiency": 0.97,
            "basePrice": 412000,
            "price": 412000,
            "discountRate": 0,
            "powerRange": {
                "min": 952,
                "max": 1999
            },
            "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp"
        }
    ],
    "hcmMatchingCases": [
        {
            "gearbox": "HCAM90",
            "ratio": "2.9",
            "power": 324,
            "speed": 3700,
            "engine": "沃尔沃D6-440",
            "cover": "4",
            "flywheel": "10"
        },
        {
            "gearbox": "HCAM90",
            "ratio": "2.9",
            "power": 235,
            "speed": 3800,
            "engine": "QSD4.2 320HP",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCM165",
            "ratio": "1.18",
            "power": 288,
            "speed": 3300,
            "engine": "潍柴新机（1X1)",
            "cover": "3",
            "flywheel": "11.5"
        },
        {
            "gearbox": "HCM165",
            "ratio": "1.25",
            "power": 300,
            "speed": 3300,
            "engine": "潍柴新机（1X1)",
            "cover": "3",
            "flywheel": "11.5"
        },
        {
            "gearbox": "HCNM280T",
            "ratio": "2.48",
            "power": 405,
            "speed": 2100,
            "engine": "",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCM250",
            "ratio": "0.88",
            "power": 324,
            "speed": 2500,
            "engine": "玉柴",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCM250",
            "ratio": "1.97",
            "power": 374,
            "speed": 2850,
            "engine": "D8-510",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCM250",
            "ratio": "1.22",
            "power": 405,
            "speed": 3300,
            "engine": "康明斯",
            "cover": "3",
            "flywheel": "11.5"
        },
        {
            "gearbox": "HCAM250",
            "ratio": "2.18",
            "power": 290,
            "speed": 2200,
            "engine": "WP10C395-22",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM306",
            "ratio": "1.2",
            "power": 600,
            "speed": 2300,
            "engine": "潍柴WP13F-815（轻载）",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM303",
            "ratio": "1.15",
            "power": 596,
            "speed": 2300,
            "engine": "航发MC13.81C01",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM303",
            "ratio": "1",
            "power": 404,
            "speed": 1900,
            "engine": "",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCM303",
            "ratio": "1.19",
            "power": 552,
            "speed": 2400,
            "engine": "玉柴YC6MJ800L-C20",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCM303",
            "ratio": "1",
            "power": 441,
            "speed": 2100,
            "engine": "WP13",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCAM303",
            "ratio": "1.19",
            "power": 565,
            "speed": 2100,
            "engine": "河柴CHD234 V8",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCAM403",
            "ratio": "1.1",
            "power": 725,
            "speed": 2300,
            "engine": "潍柴WP13",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCAM403",
            "ratio": "1.2",
            "power": 662,
            "speed": 2300,
            "engine": "潍柴WP13F",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCAM403",
            "ratio": "1.2",
            "power": 735,
            "speed": 2300,
            "engine": "潍柴WP13F（加强版）",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM403",
            "ratio": "1",
            "power": 662,
            "speed": 2300,
            "engine": "潍柴WP13F",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCM403",
            "ratio": "1",
            "power": 599,
            "speed": 2300,
            "engine": "潍柴WP13F",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM403",
            "ratio": "1",
            "power": 735,
            "speed": 2300,
            "engine": "潍柴WP13F",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCRM403",
            "ratio": "1",
            "power": 662,
            "speed": 2300,
            "engine": "潍柴WP13FY900-23E201",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCAM403P",
            "ratio": "1.2",
            "power": 662,
            "speed": 2300,
            "engine": "潍柴WP13FY900-23E201",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM350/1",
            "ratio": "1.81",
            "power": 800,
            "speed": 2300,
            "engine": "潍柴WP17F",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM350/1",
            "ratio": "1.92",
            "power": 1000,
            "speed": 2300,
            "engine": "潍柴WP17F",
            "cover": "",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM500",
            "ratio": "1.5",
            "power": 1000,
            "speed": 2300,
            "engine": "潍柴WP17FY1360-23A0",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM500",
            "ratio": "1.167",
            "power": 1000,
            "speed": 2300,
            "engine": "潍柴8M21Y1360-23E201",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCM500",
            "ratio": "1.37",
            "power": 1452,
            "speed": 2374,
            "engine": "河柴416V12",
            "cover": "0",
            "flywheel": "18"
        },
        {
            "gearbox": "HCAM500",
            "ratio": "3",
            "power": 1000,
            "speed": 2300,
            "engine": "潍柴6M21Y1000-23E201",
            "cover": "",
            "flywheel": "14"
        },
        {
            "gearbox": "HCAM500",
            "ratio": "1.35",
            "power": 1000,
            "speed": 2300,
            "engine": "潍柴WP17F",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCAM500",
            "ratio": "1.43",
            "power": 735,
            "speed": 2300,
            "engine": "IVECO FPF C16",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCAM500",
            "ratio": "2.03",
            "power": 1100,
            "speed": 2500,
            "engine": "华柴",
            "cover": "1",
            "flywheel": "14"
        },
        {
            "gearbox": "HCVM710",
            "ratio": "1.35",
            "power": 1107,
            "speed": 2165,
            "engine": "河柴",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCVM710",
            "ratio": "1.36",
            "power": 1103,
            "speed": 2100,
            "engine": "",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCVM710",
            "ratio": "1.483",
            "power": 1107,
            "speed": 2165,
            "engine": "河柴",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCM1250",
            "ratio": "2.96",
            "power": 1641,
            "speed": 2000,
            "engine": "康明斯K50M1641C2",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCVM1250",
            "ratio": "1.51",
            "power": 2000,
            "speed": 2450,
            "engine": "16M23",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCAMN1250",
            "ratio": "2.25",
            "power": 1524,
            "speed": 1800,
            "engine": "TBD620V12",
            "cover": "",
            "flywheel": ""
        },
        {
            "gearbox": "HCAM1800",
            "ratio": "1.97",
            "power": 2900,
            "speed": 1750,
            "engine": "河柴CHD622V20",
            "cover": "",
            "flywheel": "21"
        },
        {
            "gearbox": "HCM1801",
            "ratio": "3.36",
            "power": 3200,
            "speed": 1937,
            "engine": "潍柴16M45",
            "cover": "",
            "flywheel": "21"
        },
        {
            "gearbox": "HCM1601",
            "ratio": "3.034",
            "power": 2560,
            "speed": 1800,
            "engine": "",
            "cover": "",
            "flywheel": ""
        }
    ],
    "dtGearboxes": [
        {
            "model": "DT180",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.53,
                2.03,
                2.5,
                2.96,
                3.54,
                3.96,
                4.48,
                4.96,
                5.52,
                5.98
            ],
            "transferCapacity": [
                0.0801,
                0.0699,
                0.0606,
                0.052,
                0.0442,
                0.0373,
                0.0311,
                0.0257,
                0.0211,
                0.0173
            ],
            "thrust": 14.7,
            "centerDistance": 142,
            "weight": 130,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 23000,
            "price": 23000,
            "discountRate": 0.1,
            "factoryPrice": 20700,
            "packagePrice": 20700,
            "marketPrice": 23522.73,
            "notes": "标准配置"
        },
        {
            "model": "DT210",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.12
            ],
            "thrust": 20,
            "centerDistance": 150,
            "weight": 180,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 35000,
            "price": 35000,
            "discountRate": 0.1,
            "factoryPrice": 31500,
            "packagePrice": 31500,
            "marketPrice": 35795.45,
            "notes": "标准配置"
        },
        {
            "model": "DT240",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.53,
                2.03,
                2.5,
                2.96,
                3.55,
                4,
                4.53,
                5.05
            ],
            "transferCapacity": [
                0.1705,
                0.1398,
                0.1119,
                0.0868,
                0.0644,
                0.0448,
                0.028,
                0.0139
            ],
            "thrust": 30,
            "centerDistance": 165,
            "weight": 240,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 39000,
            "price": 39000,
            "discountRate": 0.1,
            "factoryPrice": 35100,
            "packagePrice": 35100,
            "marketPrice": 39886.36,
            "notes": "标准配置"
        },
        {
            "model": "DT280",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.18
            ],
            "thrust": 35,
            "centerDistance": 180,
            "weight": 300,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 45000,
            "price": 45000,
            "discountRate": 0.1,
            "factoryPrice": 40500,
            "packagePrice": 40500,
            "marketPrice": 46022.73,
            "notes": "标准配置"
        },
        {
            "model": "DT580",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.46,
                2.05,
                2.55,
                2.95,
                3.48,
                3.96,
                4.52,
                4.94,
                5.41,
                5.83
            ],
            "transferCapacity": [
                0.336,
                0.27,
                0.25,
                0.21,
                0.16,
                0.14,
                0.123,
                0.112,
                0.102,
                0.086
            ],
            "thrust": 40,
            "centerDistance": 203,
            "weight": 370,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 52000,
            "price": 52000,
            "discountRate": 0.1,
            "factoryPrice": 46800,
            "packagePrice": 46800,
            "marketPrice": 53181.82,
            "notes": "标准配置"
        },
        {
            "model": "DT770",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.54,
                1.96,
                2.5,
                3.05,
                3.47,
                3.95,
                4.57,
                5.1,
                5.62,
                5.98
            ],
            "transferCapacity": [
                0.48,
                0.443,
                0.4,
                0.327,
                0.283,
                0.214,
                0.186,
                0.166,
                0.134,
                0.106
            ],
            "thrust": 50,
            "centerDistance": 220,
            "weight": 480,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 58000,
            "price": 58000,
            "discountRate": 0.1,
            "factoryPrice": 52200,
            "packagePrice": 52200,
            "marketPrice": 59318.18,
            "notes": "标准配置"
        },
        {
            "model": "DT900",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.5,
                2.03,
                2.48,
                2.95,
                3.57,
                4.05,
                4.52,
                4.99,
                5.5,
                5.94
            ],
            "transferCapacity": [
                0.634,
                0.528,
                0.527,
                0.446,
                0.408,
                0.332,
                0.243,
                0.206,
                0.173,
                0.133
            ],
            "thrust": 60,
            "centerDistance": 264,
            "weight": 700,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 63000,
            "price": 63000,
            "discountRate": 0.1,
            "factoryPrice": 56700,
            "packagePrice": 56700,
            "marketPrice": 64431.82,
            "notes": "标准配置"
        },
        {
            "model": "DT1400",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.47,
                1.96,
                2.48,
                3.04,
                3.44,
                4.09,
                4.44,
                4.95,
                5.53,
                6.08
            ],
            "transferCapacity": [
                0.8,
                0.77,
                0.663,
                0.566,
                0.519,
                0.451,
                0.416,
                0.333,
                0.3,
                0.272
            ],
            "thrust": 90,
            "centerDistance": 290,
            "weight": 900,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 100000,
            "price": 100000,
            "discountRate": 0.1,
            "factoryPrice": 90000,
            "packagePrice": 90000,
            "marketPrice": 102272.73,
            "notes": "标准配置"
        },
        {
            "model": "DT1500",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.54,
                1.96,
                2.52,
                3.05,
                3.47,
                3.95,
                4.45,
                5,
                5.49,
                6.03
            ],
            "transferCapacity": [
                1.125,
                0.967,
                0.813,
                0.713,
                0.637,
                0.537,
                0.41,
                0.313,
                0.285,
                0.259
            ],
            "thrust": 100,
            "centerDistance": 310,
            "weight": 1100,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 120000,
            "price": 120000,
            "discountRate": 0.1,
            "factoryPrice": 108000,
            "packagePrice": 108000,
            "marketPrice": 122727.27,
            "notes": "标准配置"
        },
        {
            "model": "DT2400",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.52,
                2.04,
                2.43,
                2.9,
                3.48,
                4,
                4.45,
                5,
                5.35,
                5.5,
                5.96
            ],
            "transferCapacity": [
                1.466,
                1.466,
                1.466,
                1.466,
                1.466,
                1.466,
                1.466,
                1.466,
                1.466,
                1.466,
                1.466
            ],
            "thrust": 110,
            "centerDistance": 340,
            "weight": 1430,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 155000,
            "price": 155000,
            "discountRate": 0.1,
            "factoryPrice": 139500,
            "packagePrice": 139500,
            "marketPrice": 158522.73,
            "notes": "标准配置"
        },
        {
            "model": "DT4300",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3,
                3.5
            ],
            "transferCapacity": [
                2
            ],
            "thrust": 150,
            "centerDistance": 400,
            "weight": 2000,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 175000,
            "price": 175000,
            "discountRate": 0.1,
            "factoryPrice": 157500,
            "packagePrice": 157500,
            "marketPrice": 178977.27,
            "notes": "标准配置"
        },
        {
            "model": "DT10000",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.5,
                1.96,
                2.48,
                3.05,
                3.5,
                4,
                4.45,
                4.95,
                5.55,
                5.95
            ],
            "transferCapacity": [
                3.505,
                3.505,
                3.505,
                3.505,
                3.505,
                3.505,
                3.505,
                3.505,
                3.505,
                3.505
            ],
            "thrust": 279,
            "centerDistance": 564,
            "weight": 3605,
            "efficiency": 0.97,
            "basePrice": 613000,
            "price": 613000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2629,
                "max": 5258
            },
            "image": "/images/gearbox/Advance-DT.webp"
        },
        {
            "model": "DT2500",
            "ratios": [
                1.48,
                1.86,
                2.04,
                2.14
            ],
            "transferCapacity": [
                1.67,
                1.67,
                1.46,
                1.36
            ],
            "weight": 3600,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "DT4000",
            "ratios": [
                1.48,
                1.86,
                2.04
            ],
            "transferCapacity": [
                2.5,
                2.5,
                2.2
            ],
            "weight": 5000,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        }
    ],
    "hcqGearboxes": [
        {
            "model": "HC038A",
            "inputSpeedRange": [
                2000,
                3000
            ],
            "ratios": [
                2.07,
                2.48,
                2.95,
                3.35,
                3.83
            ],
            "transferCapacity": [
                0.012,
                0.012,
                0.012,
                0.012,
                0.012
            ],
            "thrust": 3.5,
            "centerDistance": 135,
            "weight": 84,
            "controlType": "电控",
            "dimensions": "422x325x563",
            "efficiency": 0.96,
            "basePrice": 16380,
            "price": 16380,
            "discountRate": 0,
            "factoryPrice": 16380,
            "packagePrice": 16380,
            "marketPrice": 16380,
            "notes": "全国统一售价"
        },
        {
            "model": "HC038",
            "inputSpeedRange": [
                2000,
                3000
            ],
            "ratios": [
                2.07,
                2.48,
                2.95,
                3.35,
                3.83
            ],
            "transferCapacity": [
                0.012
            ],
            "thrust": 3.5,
            "centerDistance": 135,
            "weight": 84,
            "controlType": "手控",
            "dimensions": "422x325x563",
            "efficiency": 0.96,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCQH1000",
            "inputSpeedRange": [
                1500,
                2100
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3,
                3.5,
                4,
                4.5,
                5
            ],
            "transferCapacity": [
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.1
            ],
            "thrust": 30,
            "centerDistance": 310,
            "weight": 1100,
            "controlType": "电控/气控",
            "dimensions": "600x980x900",
            "efficiency": 0.97,
            "basePrice": 85000,
            "price": 85000,
            "discountRate": 0,
            "factoryPrice": 85000,
            "packagePrice": 85000,
            "marketPrice": 85000,
            "notes": "全国统一售价"
        },
        {
            "model": "HCQ1001",
            "inputSpeedRange": [
                1500,
                2100
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3,
                3.5,
                4,
                4.5,
                5
            ],
            "transferCapacity": [
                0.12,
                0.12,
                0.12,
                0.12,
                0.12,
                0.12,
                0.12,
                0.12
            ],
            "thrust": 30,
            "centerDistance": 335,
            "weight": 1200,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCQ400",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.04,
                0.04,
                0.04,
                0.04
            ],
            "thrust": 15,
            "centerDistance": 400,
            "weight": 650,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCQ600",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.065
            ],
            "thrust": 20,
            "centerDistance": 190,
            "weight": 280,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCQ1000",
            "inputSpeedRange": [
                1500,
                2100
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3,
                3.5,
                4,
                4.5,
                5
            ],
            "transferCapacity": [
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.1,
                0.1
            ],
            "thrust": 30,
            "centerDistance": 310,
            "weight": 1100,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCQ1400",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3,
                3.5
            ],
            "transferCapacity": [
                0.18,
                0.18,
                0.18,
                0.18,
                0.18
            ],
            "thrust": 35,
            "centerDistance": 340,
            "weight": 1450,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCQ1600",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.2,
                0.2,
                0.2,
                0.2
            ],
            "thrust": 40,
            "centerDistance": 340,
            "weight": 1550,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCQ1601",
            "inputSpeedRange": [
                750,
                1500
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.25,
                0.25,
                0.25,
                0.25
            ],
            "thrust": 50,
            "centerDistance": 370,
            "weight": 1600,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCS138",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2,
                2.52,
                3,
                3.57,
                4.05,
                4.45
            ],
            "transferCapacity": [
                0.11,
                0.11,
                0.11,
                0.11,
                0.11,
                0.11
            ],
            "thrust": 30,
            "centerDistance": 225,
            "weight": 460,
            "controlType": "电控/气控",
            "dimensions": "520x792x760",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCS302",
            "inputSpeedRange": [
                750,
                2500
            ],
            "ratios": [
                1.87,
                2.04,
                2.54,
                3,
                3.53,
                4.1,
                4.47,
                4.61,
                4.94,
                5.44
            ],
            "transferCapacity": [
                0.22,
                0.22,
                0.22,
                0.22,
                0.22,
                0.22,
                0.22,
                0.22,
                0.22,
                0.22
            ],
            "thrust": 50,
            "centerDistance": 264,
            "weight": 680,
            "controlType": "电控/气控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 0,
            "price": 0,
            "discountRate": 0,
            "factoryPrice": 0,
            "packagePrice": 0,
            "marketPrice": 0,
            "notes": "未在2022价格表中找到 (旧价格)"
        },
        {
            "model": "HCQ100",
            "inputSpeedRange": [
                1000,
                3500
            ],
            "ratios": [
                1.64,
                2.03,
                2.52,
                3,
                3.53,
                4,
                4.48,
                4.95,
                5.56
            ],
            "transferCapacity": [
                0.064,
                0.064,
                0.058,
                0.051,
                0.046,
                0.041,
                0.037,
                0.034,
                0.03
            ],
            "thrust": 16,
            "centerDistance": 146,
            "weight": 150,
            "dimensions": "546×551×656",
            "efficiency": 0.97,
            "basePrice": 28000,
            "price": 28000,
            "discountRate": 0,
            "powerRange": {
                "min": 30,
                "max": 224
            },
            "image": "/images/gearbox/Advance-HCQ100-MV100A.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCQ138",
            "inputSpeedRange": [
                1000,
                2600
            ],
            "ratios": [
                1.64,
                2.03,
                2.52,
                3.04,
                3.57,
                4,
                4.48,
                5.05,
                5.56
            ],
            "transferCapacity": [
                0.087,
                0.087,
                0.087,
                0.078,
                0.07,
                0.063,
                0.056,
                0.05,
                0.045
            ],
            "thrust": 25,
            "centerDistance": 165,
            "weight": 240,
            "dimensions": "504×619×616",
            "efficiency": 0.97,
            "basePrice": 27600,
            "price": 27600,
            "discountRate": 0,
            "powerRange": {
                "min": 45,
                "max": 226
            },
            "image": "/images/gearbox/HCQ138-HCA138-.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCQ300",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.06,
                1.21,
                1.36,
                1.46,
                1.5,
                1.52,
                1.74,
                1.96,
                2.05,
                2.38,
                2.5,
                2.55,
                2.57,
                2.95
            ],
            "transferCapacity": [
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95
            ],
            "thrust": 40,
            "centerDistance": 203,
            "weight": 370,
            "dimensions": "630×521×680",
            "efficiency": 0.97,
            "basePrice": 42000,
            "price": 42000,
            "discountRate": 0,
            "powerRange": {
                "min": 2950,
                "max": 6785
            },
            "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCQ401",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1,
                1.12,
                1.25,
                1.41,
                1.5,
                1.76,
                2.04,
                2.5
            ],
            "transferCapacity": [
                0.331,
                0.331,
                0.331,
                0.331,
                0.331,
                0.331,
                0.331,
                0.294
            ],
            "thrust": 50,
            "centerDistance": 220,
            "weight": 552,
            "dimensions": "640×900×800",
            "efficiency": 0.97,
            "basePrice": 63500,
            "price": 63500,
            "discountRate": 0,
            "powerRange": {
                "min": 294,
                "max": 761
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCQ402",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                2.82,
                3,
                3.2,
                3.47
            ],
            "transferCapacity": [
                0.331,
                0.331,
                0.331,
                0.331
            ],
            "thrust": 50,
            "centerDistance": 285,
            "weight": 650,
            "dimensions": "611×890×1080",
            "efficiency": 0.97,
            "basePrice": 75300,
            "price": 75300,
            "discountRate": 0,
            "powerRange": {
                "min": 331,
                "max": 761
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCQ501",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.48,
                2.04,
                2.52,
                3.04,
                3.57,
                4,
                4.47,
                5.05,
                5.56,
                5.95
            ],
            "transferCapacity": [
                0.36,
                0.36,
                0.36,
                0.36,
                0.36,
                0.36,
                0.324,
                0.288,
                0.261,
                0.243
            ],
            "thrust": 55,
            "centerDistance": 235,
            "weight": 570,
            "dimensions": "742×856×950",
            "efficiency": 0.97,
            "basePrice": 76000,
            "price": 76000,
            "discountRate": 0,
            "powerRange": {
                "min": 243,
                "max": 828
            },
            "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCQ502",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.58,
                2.03,
                2.48,
                2.96,
                3.46,
                3.94,
                4.39
            ],
            "transferCapacity": [
                0.377,
                0.377,
                0.377,
                0.377,
                0.377,
                0.339,
                0.305
            ],
            "thrust": 60,
            "centerDistance": 264,
            "weight": 700,
            "dimensions": "742×856×980",
            "efficiency": 0.97,
            "basePrice": 78800,
            "price": 78800,
            "discountRate": 0,
            "powerRange": {
                "min": 305,
                "max": 867
            },
            "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCQ700",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.3,
                1.51,
                1.75,
                2,
                2.25,
                2.5,
                2.78,
                2.96
            ],
            "transferCapacity": [
                0.58,
                0.58,
                0.58,
                0.58,
                0.58,
                0.58,
                0.514,
                0.49
            ],
            "thrust": 90,
            "centerDistance": 290,
            "weight": 980,
            "dimensions": "898×1104×1066",
            "efficiency": 0.97,
            "basePrice": 118000,
            "price": 118000,
            "discountRate": 0,
            "powerRange": {
                "min": 490,
                "max": 1450
            },
            "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
            "source": "HCQ700型船用齿轮箱使用说明书发407",
            "applications": [
                "拖网渔船",
                "运输船",
                "工程船",
                "大型渔船"
            ]
        },
        {
            "model": "HCQ700A",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.24,
                1.46,
                1.72,
                2.03,
                2.26,
                2.48,
                2.78,
                2.96
            ],
            "transferCapacity": [
                0.554,
                0.554,
                0.554,
                0.554,
                0.554,
                0.554,
                0.514,
                0.49
            ],
            "weight": 980,
            "efficiency": 0.97,
            "basePrice": 181000,
            "price": 181000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 490,
                "max": 1108
            },
            "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp"
        },
        {
            "model": "HCQ701",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2.9,
                3.48,
                3.62
            ],
            "transferCapacity": [
                0.554,
                0.514,
                0.49
            ],
            "thrust": 95,
            "centerDistance": 340,
            "dimensions": "868×1104×1146",
            "efficiency": 0.97,
            "basePrice": 163000,
            "price": 163000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 490,
                "max": 1385
            },
            "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCQ800A",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.28,
                1.46,
                1.72,
                2.04,
                2.26,
                2.48,
                2.75
            ],
            "transferCapacity": [
                0.7,
                0.7,
                0.7,
                0.7,
                0.7,
                0.7,
                0.63
            ],
            "weight": 1400,
            "efficiency": 0.97,
            "basePrice": 192000,
            "price": 192000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 630,
                "max": 1400
            },
            "image": "/images/gearbox/Advance-800-1000.webp"
        },
        {
            "model": "HCQH1600",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                2.48
            ],
            "transferCapacity": [
                1.204
            ],
            "thrust": 120,
            "centerDistance": 340,
            "weight": 1500,
            "dimensions": "1035×1110×1038",
            "efficiency": 0.97,
            "basePrice": 249000,
            "price": 249000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1204,
                "max": 2528
            },
            "image": "/images/gearbox/Advance-HCQ501-HCQ502-HCAM500_6_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCQH700",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.3,
                1.51,
                1.75,
                2,
                2.25,
                2.5,
                2.78,
                2.96
            ],
            "transferCapacity": [
                0.58,
                0.58,
                0.58,
                0.58,
                0.58,
                0.58,
                0.514,
                0.49
            ],
            "thrust": 90,
            "centerDistance": 290,
            "weight": 920,
            "dimensions": "895×1014×1100",
            "efficiency": 0.97,
            "basePrice": 118000,
            "price": 118000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 490,
                "max": 1450
            },
            "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        }
    ],
    "gcGearboxes": [
        {
            "model": "GCS320",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.15,
                0.15,
                0.15,
                0.15,
                0.15
            ],
            "thrust": 50,
            "centerDistance": null,
            "weight": 1200,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 30000,
            "price": 30000,
            "discountRate": 0.1,
            "factoryPrice": 27000,
            "packagePrice": 27000,
            "marketPrice": 30681.82,
            "notes": "电控、无罩、监控仪 (打包价 2.7 万)"
        },
        {
            "model": "GCH390",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.2,
                0.2,
                0.2,
                0.2,
                0.2
            ],
            "thrust": 70,
            "centerDistance": null,
            "weight": 1600,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 38000,
            "price": 38000,
            "discountRate": 0.1,
            "factoryPrice": 34200,
            "packagePrice": 35000,
            "marketPrice": 38863.64,
            "notes": "电控、无罩、监控仪 (打包价 3.5 万)"
        },
        {
            "model": "GC350A",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.18
            ],
            "thrust": 60,
            "centerDistance": null,
            "weight": 1300,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 48000,
            "price": 48000,
            "discountRate": 0.1,
            "factoryPrice": 43200,
            "packagePrice": 45000,
            "marketPrice": 49090.91,
            "notes": "电控、无罩、监控仪 (打包价 4.5 万)"
        },
        {
            "model": "GCS540",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.3,
                0.3,
                0.3,
                0.3,
                0.3
            ],
            "thrust": 100,
            "centerDistance": null,
            "weight": 3200,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 45000,
            "price": 45000,
            "discountRate": 0.1,
            "factoryPrice": 40500,
            "packagePrice": 42000,
            "marketPrice": 46022.73,
            "notes": "电控、无罩、监控仪 (打包价 4.2 万)"
        },
        {
            "model": "GCH750",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.4,
                0.4,
                0.4,
                0.4,
                0.4
            ],
            "thrust": 130,
            "centerDistance": null,
            "weight": 4500,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 55000,
            "price": 55000,
            "discountRate": 0.1,
            "factoryPrice": 49500,
            "packagePrice": 50000,
            "marketPrice": 56250,
            "notes": "电控、无罩、监控仪 (打包价 5 万)"
        },
        {
            "model": "GCS1000",
            "inputSpeedRange": [
                1000,
                2000
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.5,
                0.5,
                0.5,
                0.5,
                0.5
            ],
            "thrust": 150,
            "centerDistance": null,
            "weight": 6500,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 85000,
            "price": 85000,
            "discountRate": 0.1,
            "factoryPrice": 76500,
            "packagePrice": 80000,
            "marketPrice": 86931.82,
            "notes": "电控、无罩、监控仪 (打包价 8 万)"
        },
        {
            "model": "GCSE20",
            "inputSpeedRange": [
                2000,
                3000
            ],
            "ratios": [
                2,
                2.5,
                3,
                3.5,
                4
            ],
            "transferCapacity": [
                0.1,
                0.1,
                0.1,
                0.1,
                0.1
            ],
            "thrust": 30,
            "centerDistance": null,
            "weight": 1800,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.97,
            "basePrice": 20000,
            "price": 20000,
            "discountRate": 0.1,
            "factoryPrice": 18000,
            "packagePrice": 18000,
            "marketPrice": 20454.55,
            "notes": "高速、电控、无罩、监控仪"
        },
        {
            "model": "GC1000",
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.83,
                0.83,
                0.75,
                0.67
            ],
            "thrust": 1400,
            "centerDistance": 1018,
            "weight": 1800,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GC1400",
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                1.1,
                1.1,
                1,
                0.88
            ],
            "thrust": 1400,
            "centerDistance": 1350,
            "weight": 2500,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GC600",
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.47,
                0.47,
                0.42,
                0.38
            ],
            "thrust": 360,
            "centerDistance": 590,
            "weight": 850,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GC800",
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.63,
                0.63,
                0.57,
                0.5
            ],
            "thrust": 800,
            "centerDistance": 855,
            "weight": 1200,
            "efficiency": 0.97,
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH1000",
            "inputSpeedRange": [
                200,
                800
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                17.5,
                17.5,
                17.5,
                17.5,
                17.5
            ],
            "thrust": 1400,
            "centerDistance": 1018,
            "efficiency": 0.97,
            "powerRange": {
                "min": 3500,
                "max": 14000
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH320",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                1.97,
                2.52,
                2.96,
                3.52,
                4
            ],
            "transferCapacity": [
                0.57,
                0.57,
                0.57,
                0.57,
                0.57
            ],
            "thrust": 100,
            "centerDistance": 320,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 228,
                "max": 1026
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH1002L",
            "inputSpeedRange": [
                400,
                600
            ],
            "ratios": [
                3.939
            ],
            "transferCapacity": [
                20
            ],
            "thrust": 800,
            "centerDistance": 1000,
            "efficiency": 0.97,
            "powerRange": {
                "min": 5000,
                "max": 10000
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "notes": "特殊型号，左型，8800kW/520rpm，减速比3.939:1，水平异心距1000mm，J检",
            "source": "项目跟踪记录-芜湖造船厂试验舰"
        },
        {
            "model": "GCH1002R",
            "inputSpeedRange": [
                400,
                600
            ],
            "ratios": [
                3.939
            ],
            "transferCapacity": [
                20
            ],
            "thrust": 800,
            "centerDistance": 1000,
            "efficiency": 0.97,
            "powerRange": {
                "min": 5000,
                "max": 10000
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "notes": "特殊型号，右型，8800kW/520rpm，减速比3.939:1，水平异心距1000mm，J检",
            "source": "项目跟踪记录-芜湖造船厂试验舰"
        },
        {
            "model": "GCH350",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                3,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.72,
                0.72,
                0.72,
                0.72
            ],
            "thrust": 113,
            "centerDistance": 350,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH410",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                1.292,
                1.292,
                1.292,
                1.292,
                1.292
            ],
            "thrust": 175,
            "centerDistance": 410,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 517,
                "max": 2067
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH490",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                2.03,
                2.48,
                3.09,
                3.48,
                3.95
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 270,
            "centerDistance": 490,
            "efficiency": 0.97,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH540",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                2.825,
                2.825,
                2.825,
                2.825,
                2.825
            ],
            "thrust": 290,
            "centerDistance": 540,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1130,
                "max": 3390
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH590",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 360,
            "centerDistance": 590,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH660",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                5.05,
                5.05,
                5.05,
                5.05,
                5.05
            ],
            "thrust": 540,
            "centerDistance": 668,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2020,
                "max": 6060
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH760",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.95
            ],
            "transferCapacity": [
                8.111,
                8.111,
                8.111,
                8.111
            ],
            "thrust": 750,
            "centerDistance": 768,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2433,
                "max": 7300
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH850",
            "inputSpeedRange": [
                300,
                800
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                9.6,
                9.6,
                9.6,
                9.6,
                9.6
            ],
            "thrust": 800,
            "centerDistance": 855,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2880,
                "max": 7680
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH880",
            "inputSpeedRange": [
                200,
                650
            ],
            "ratios": [
                3.5,
                3.95
            ],
            "transferCapacity": [
                12.063,
                12.063
            ],
            "thrust": 1000,
            "centerDistance": 880,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2413,
                "max": 7841
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH900",
            "inputSpeedRange": [
                200,
                800
            ],
            "ratios": [
                2.52,
                3.08,
                3.43,
                4.1
            ],
            "transferCapacity": [
                12.063,
                12.063,
                12.063,
                12.063
            ],
            "thrust": 980,
            "centerDistance": 900,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2413,
                "max": 9650
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCH950",
            "inputSpeedRange": [
                200,
                650
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                14,
                14,
                14,
                14,
                14
            ],
            "thrust": 1000,
            "centerDistance": 965,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2800,
                "max": 9100
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHE11",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                1.64,
                1.97,
                2.55,
                2.93,
                3.58,
                4,
                6.5,
                8
            ],
            "transferCapacity": [
                12.063,
                12.063,
                12.063,
                12.063,
                12.063,
                12.063,
                12.063,
                12.063
            ],
            "thrust": 270,
            "centerDistance": 735,
            "efficiency": 0.97,
            "basePrice": 180000,
            "price": 180000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 4825,
                "max": 19301
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHE15",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                6.5,
                7,
                7.5,
                8
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 300,
            "centerDistance": 810,
            "efficiency": 0.97,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "notes": "名义速比6.50-8.00",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHE20",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                6.5,
                7,
                7.5,
                8
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 350,
            "centerDistance": 875,
            "efficiency": 0.97,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "notes": "名义速比6.50-8.00",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHE26",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                6.5,
                7,
                7.5,
                8
            ],
            "transferCapacity": [
                2.825,
                2.825,
                2.825,
                2.825
            ],
            "thrust": 450,
            "centerDistance": 960,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1130,
                "max": 3390
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "notes": "名义速比6.50-8.00",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHE33",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                6.5,
                7,
                7.5,
                8
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 550,
            "centerDistance": 1055,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "notes": "名义速比6.50-8.00",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHE44",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.55,
                3,
                3.52,
                5.05,
                6.5,
                8
            ],
            "transferCapacity": [
                8,
                8,
                8,
                8,
                8,
                8,
                8
            ],
            "thrust": 700,
            "centerDistance": 1185,
            "efficiency": 0.97,
            "basePrice": 180000,
            "price": 180000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3200,
                "max": 9600
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHE5",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                6.5,
                8
            ],
            "transferCapacity": [
                0.57,
                0.57
            ],
            "thrust": 170,
            "centerDistance": 570,
            "efficiency": 0.97,
            "basePrice": 664820,
            "price": 664820,
            "discountRate": 0.1,
            "powerRange": {
                "min": 228,
                "max": 1026
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHE6",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                6.5,
                8
            ],
            "transferCapacity": [
                0.72,
                0.72
            ],
            "thrust": 200,
            "centerDistance": 615,
            "efficiency": 0.97,
            "basePrice": 760805,
            "price": 760805,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHE9",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                6.5,
                8
            ],
            "transferCapacity": [
                0.96,
                0.96
            ],
            "thrust": 270,
            "centerDistance": 700,
            "efficiency": 0.97,
            "basePrice": 962000,
            "price": 962000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT108",
            "inputSpeedRange": [
                200,
                800
            ],
            "ratios": [
                3.5,
                3.95
            ],
            "transferCapacity": [
                12.063,
                12.063
            ],
            "thrust": 1400,
            "centerDistance": 1230,
            "efficiency": 0.97,
            "basePrice": 200000,
            "price": 200000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2413,
                "max": 9650
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT11",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95,
                6.5,
                8
            ],
            "transferCapacity": [
                8,
                8,
                8,
                8,
                8,
                8
            ],
            "thrust": 220,
            "centerDistance": 570,
            "efficiency": 0.97,
            "basePrice": 200000,
            "price": 200000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3200,
                "max": 12800
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT115",
            "inputSpeedRange": [
                200,
                650
            ],
            "ratios": [
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                12.063,
                12.063,
                12.063,
                12.063
            ],
            "thrust": 1400,
            "centerDistance": 1260,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2413,
                "max": 7841
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT135",
            "inputSpeedRange": [
                200,
                650
            ],
            "ratios": [
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                14,
                14,
                14,
                14
            ],
            "thrust": 1400,
            "centerDistance": 1350,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2800,
                "max": 9100
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT15",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.46,
                5.08,
                5.46,
                5.96
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 270,
            "centerDistance": 630,
            "efficiency": 0.97,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT170",
            "inputSpeedRange": [
                200,
                800
            ],
            "ratios": [
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                17.5,
                17.5,
                17.5,
                17.5
            ],
            "thrust": 1400,
            "centerDistance": 1430,
            "efficiency": 0.97,
            "powerRange": {
                "min": 3500,
                "max": 14000
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT20",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 300,
            "centerDistance": 680,
            "efficiency": 0.97,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT26",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                2.825,
                2.825,
                2.825,
                2.825
            ],
            "thrust": 360,
            "centerDistance": 750,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1130,
                "max": 3390
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT33",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.54,
                5.04,
                5.6,
                5.95
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 540,
            "centerDistance": 820,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT44",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.52,
                5,
                5.57,
                5.96
            ],
            "transferCapacity": [
                5.05,
                5.05,
                5.05,
                5.05
            ],
            "thrust": 600,
            "centerDistance": 924,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2020,
                "max": 6060
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT5",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.57,
                0.57,
                0.57,
                0.57
            ],
            "thrust": 120,
            "centerDistance": 445,
            "efficiency": 0.97,
            "basePrice": 436445,
            "price": 436445,
            "discountRate": 0.1,
            "powerRange": {
                "min": 228,
                "max": 1026
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT6",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.72,
                0.72,
                0.72,
                0.72
            ],
            "thrust": 170,
            "centerDistance": 480,
            "efficiency": 0.97,
            "basePrice": 494720,
            "price": 494720,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT66",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.95,
                4.48,
                4.96,
                5.43,
                6
            ],
            "transferCapacity": [
                8.111,
                8.111,
                8.111,
                8.111,
                8.111,
                8.111,
                8.111,
                8.111
            ],
            "thrust": 1000,
            "centerDistance": 1064,
            "dimensions": "3609×2639×2370",
            "efficiency": 0.97,
            "basePrice": 200000,
            "price": 200000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2433,
                "max": 7300
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT77",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                11.282,
                11.282,
                11.282,
                11.282,
                11.282
            ],
            "thrust": 1000,
            "centerDistance": 1100,
            "efficiency": 0.97,
            "basePrice": 200000,
            "price": 200000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3385,
                "max": 10154
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT9",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.96,
                0.96,
                0.96,
                0.96
            ],
            "thrust": 220,
            "centerDistance": 545,
            "efficiency": 0.97,
            "basePrice": 614645,
            "price": 614645,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCHT91",
            "inputSpeedRange": [
                300,
                800
            ],
            "ratios": [
                2.52,
                3.08,
                3.43,
                4.1
            ],
            "transferCapacity": [
                12.063,
                12.063,
                12.063,
                12.063
            ],
            "thrust": 1000,
            "centerDistance": 1190,
            "efficiency": 0.97,
            "basePrice": 200000,
            "price": 200000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3619,
                "max": 9650
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS350",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2,
                2.56,
                3.03,
                3.57,
                4.05
            ],
            "transferCapacity": [
                0.72,
                0.72,
                0.72,
                0.72,
                0.72
            ],
            "thrust": 113,
            "centerDistance": 350,
            "efficiency": 0.97,
            "basePrice": 300500,
            "price": 300500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS390",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                2.03,
                2.48,
                2.92,
                3.48,
                3.95
            ],
            "transferCapacity": [
                0.96,
                0.96,
                0.96,
                0.96,
                0.96
            ],
            "thrust": 140,
            "centerDistance": 390,
            "efficiency": 0.97,
            "basePrice": 353780,
            "price": 353780,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS410",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                1.292,
                1.292,
                1.292,
                1.292,
                1.292
            ],
            "thrust": 175,
            "centerDistance": 410,
            "efficiency": 0.97,
            "basePrice": 382580,
            "price": 382580,
            "discountRate": 0.1,
            "powerRange": {
                "min": 517,
                "max": 2067
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS450",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                1.97,
                2.55,
                2.93,
                3.58,
                4
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 220,
            "centerDistance": 455,
            "efficiency": 0.97,
            "basePrice": 452645,
            "price": 452645,
            "discountRate": 0.1,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS490",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                2.03,
                2.48,
                3.09,
                3.48,
                3.95
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 270,
            "centerDistance": 490,
            "efficiency": 0.97,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS590",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 360,
            "centerDistance": 590,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS660",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                5.05,
                5.05,
                5.05,
                5.05,
                5.05
            ],
            "thrust": 540,
            "centerDistance": 668,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2020,
                "max": 6060
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS700B",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.55,
                3,
                3.52,
                4,
                4.47
            ],
            "transferCapacity": [
                5.43,
                5.43,
                5.43,
                5.43,
                5.43,
                5.43
            ],
            "thrust": 450,
            "centerDistance": 700,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2172,
                "max": 6516
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS750",
            "inputSpeedRange": [
                300,
                950
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                7.2,
                7.2,
                7.2,
                7.2,
                7.2
            ],
            "thrust": 730,
            "centerDistance": 750,
            "efficiency": 0.97,
            "basePrice": 1092500,
            "price": 1092500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2160,
                "max": 6840
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS760",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.53,
                3.95
            ],
            "transferCapacity": [
                8.111,
                8.111,
                8.111,
                8.111,
                8.111
            ],
            "thrust": 750,
            "centerDistance": 768,
            "efficiency": 0.97,
            "basePrice": 1141683,
            "price": 1141683,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2433,
                "max": 7300
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS850",
            "inputSpeedRange": [
                300,
                800
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                9.6,
                9.6,
                9.6,
                9.6,
                9.6
            ],
            "thrust": 800,
            "centerDistance": 855,
            "efficiency": 0.97,
            "basePrice": 1395845,
            "price": 1395845,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2880,
                "max": 7680
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS880",
            "inputSpeedRange": [
                200,
                650
            ],
            "ratios": [
                3.5,
                3.95
            ],
            "transferCapacity": [
                12.063,
                12.063
            ],
            "thrust": 1000,
            "centerDistance": 880,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2413,
                "max": 7841
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS900",
            "inputSpeedRange": [
                200,
                800
            ],
            "ratios": [
                2.52,
                3.08,
                3.43,
                4.1
            ],
            "transferCapacity": [
                12.063,
                12.063,
                12.063,
                12.063
            ],
            "thrust": 980,
            "centerDistance": 900,
            "efficiency": 0.97,
            "basePrice": 160000,
            "price": 160000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2413,
                "max": 9650
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCS950",
            "inputSpeedRange": [
                200,
                650
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                14,
                14,
                14,
                14,
                14
            ],
            "thrust": 1000,
            "centerDistance": 965,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2800,
                "max": 9100
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCSE11",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                6.5,
                8
            ],
            "transferCapacity": [
                1.292,
                1.292
            ],
            "thrust": 270,
            "centerDistance": 735,
            "efficiency": 0.97,
            "basePrice": 1052405,
            "price": 1052405,
            "discountRate": 0.1,
            "powerRange": {
                "min": 517,
                "max": 2067
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCSE15",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                6.5,
                7,
                7.5,
                8
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 300,
            "centerDistance": 810,
            "efficiency": 0.97,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "notes": "名义速比6.50-8.00",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCSE26",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                6.5,
                7,
                7.5,
                8
            ],
            "transferCapacity": [
                2.825,
                2.825,
                2.825,
                2.825
            ],
            "thrust": 450,
            "centerDistance": 960,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1130,
                "max": 3390
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "notes": "名义速比6.50-8.00",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCSE33",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                6.5,
                7,
                7.5,
                8
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 550,
            "centerDistance": 1055,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "notes": "名义速比6.50-8.00",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCSE44",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                6.5,
                8
            ],
            "transferCapacity": [
                5.05,
                5.05
            ],
            "thrust": 700,
            "centerDistance": 1185,
            "efficiency": 0.97,
            "basePrice": 2500000,
            "price": 2500000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2020,
                "max": 6060
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCSE5",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                6.5,
                8
            ],
            "transferCapacity": [
                0.57,
                0.57
            ],
            "thrust": 170,
            "centerDistance": 570,
            "efficiency": 0.97,
            "basePrice": 664820,
            "price": 664820,
            "discountRate": 0.1,
            "powerRange": {
                "min": 228,
                "max": 1026
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCSE6",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                6.5,
                8
            ],
            "transferCapacity": [
                0.72,
                0.72
            ],
            "thrust": 200,
            "centerDistance": 615,
            "efficiency": 0.97,
            "basePrice": 760805,
            "price": 760805,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCSE9",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                6.5,
                8
            ],
            "transferCapacity": [
                0.96,
                0.96
            ],
            "thrust": 270,
            "centerDistance": 700,
            "efficiency": 0.97,
            "basePrice": 962000,
            "price": 962000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST108",
            "inputSpeedRange": [
                200,
                800
            ],
            "ratios": [
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                11.282,
                11.282,
                11.282,
                11.282
            ],
            "thrust": 1400,
            "centerDistance": 1230,
            "efficiency": 0.97,
            "basePrice": 2500000,
            "price": 2500000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2256,
                "max": 9026
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST11",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.52,
                5.04,
                5.52,
                5.95
            ],
            "transferCapacity": [
                1.292,
                1.292,
                1.292,
                1.292
            ],
            "thrust": 220,
            "centerDistance": 570,
            "efficiency": 0.97,
            "basePrice": 664820,
            "price": 664820,
            "discountRate": 0.1,
            "powerRange": {
                "min": 517,
                "max": 2067
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST115",
            "inputSpeedRange": [
                200,
                650
            ],
            "ratios": [
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                12.063,
                12.063,
                12.063,
                12.063
            ],
            "thrust": 1400,
            "centerDistance": 1260,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2413,
                "max": 7841
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST135",
            "inputSpeedRange": [
                200,
                650
            ],
            "ratios": [
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                14,
                14,
                14,
                14
            ],
            "thrust": 1400,
            "centerDistance": 1350,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2800,
                "max": 9100
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST15",
            "inputSpeedRange": [
                400,
                1600
            ],
            "ratios": [
                4.46,
                5.08,
                5.46,
                5.96
            ],
            "transferCapacity": [
                1.64,
                1.64,
                1.64,
                1.64
            ],
            "thrust": 270,
            "centerDistance": 630,
            "efficiency": 0.97,
            "powerRange": {
                "min": 656,
                "max": 2624
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST170",
            "inputSpeedRange": [
                200,
                800
            ],
            "ratios": [
                4.5,
                5,
                5.5,
                6
            ],
            "transferCapacity": [
                17.5,
                17.5,
                17.5,
                17.5
            ],
            "thrust": 1400,
            "centerDistance": 1430,
            "efficiency": 0.97,
            "powerRange": {
                "min": 3500,
                "max": 14000
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST20",
            "inputSpeedRange": [
                400,
                1400
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                2.12,
                2.12,
                2.12,
                2.12
            ],
            "thrust": 300,
            "centerDistance": 680,
            "efficiency": 0.97,
            "powerRange": {
                "min": 848,
                "max": 2968
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST26",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.58,
                5.04,
                5.59,
                5.95
            ],
            "transferCapacity": [
                2.825,
                2.825,
                2.825,
                2.825
            ],
            "thrust": 360,
            "centerDistance": 750,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1130,
                "max": 3390
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST33",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.54,
                5.04,
                5.6,
                5.95
            ],
            "transferCapacity": [
                3.64,
                3.64,
                3.64,
                3.64
            ],
            "thrust": 540,
            "centerDistance": 820,
            "efficiency": 0.97,
            "powerRange": {
                "min": 1456,
                "max": 4368
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST44",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                4.52,
                5,
                5.57,
                5.96
            ],
            "transferCapacity": [
                5.05,
                5.05,
                5.05,
                5.05
            ],
            "thrust": 600,
            "centerDistance": 924,
            "efficiency": 0.97,
            "powerRange": {
                "min": 2020,
                "max": 6060
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST5",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.57,
                0.57,
                0.57,
                0.57
            ],
            "thrust": 120,
            "centerDistance": 445,
            "efficiency": 0.97,
            "basePrice": 436445,
            "price": 436445,
            "discountRate": 0.1,
            "powerRange": {
                "min": 228,
                "max": 1026
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST6",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.72,
                0.72,
                0.72,
                0.72
            ],
            "thrust": 170,
            "centerDistance": 480,
            "efficiency": 0.97,
            "basePrice": 494720,
            "price": 494720,
            "discountRate": 0.1,
            "powerRange": {
                "min": 288,
                "max": 1296
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST66",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                4.48,
                4.96,
                5.43,
                6
            ],
            "transferCapacity": [
                7.2,
                7.2,
                7.2,
                7.2
            ],
            "thrust": 1000,
            "centerDistance": 1064,
            "dimensions": "3609×2639×2370",
            "efficiency": 0.97,
            "basePrice": 2117773,
            "price": 2117773,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2160,
                "max": 6480
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST77",
            "inputSpeedRange": [
                300,
                900
            ],
            "ratios": [
                4.55,
                5.56
            ],
            "transferCapacity": [
                8.111,
                8.111
            ],
            "thrust": 1000,
            "centerDistance": 1100,
            "efficiency": 0.97,
            "basePrice": 2258000,
            "price": 2258000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2433,
                "max": 7300
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST9",
            "inputSpeedRange": [
                400,
                1800
            ],
            "ratios": [
                4.5,
                5,
                5.55,
                5.95
            ],
            "transferCapacity": [
                0.96,
                0.96,
                0.96,
                0.96
            ],
            "thrust": 220,
            "centerDistance": 545,
            "efficiency": 0.97,
            "basePrice": 614645,
            "price": 614645,
            "discountRate": 0.1,
            "powerRange": {
                "min": 384,
                "max": 1728
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "GCST91",
            "inputSpeedRange": [
                300,
                800
            ],
            "ratios": [
                4.55,
                5.56
            ],
            "transferCapacity": [
                9.6,
                9.6
            ],
            "thrust": 1000,
            "centerDistance": 1190,
            "efficiency": 0.97,
            "basePrice": 2500000,
            "price": 2500000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2880,
                "max": 7680
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        }
    ],
    "hcxGearboxes": [
        {
            "model": "HC15",
            "inputSpeedRange": [
                2500,
                4000
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.01
            ],
            "thrust": 5,
            "centerDistance": null,
            "weight": 60,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.95,
            "basePrice": 10200,
            "price": 10200,
            "discountRate": 0,
            "factoryPrice": 10200,
            "packagePrice": 10200,
            "marketPrice": 10200,
            "notes": "铝合金、高速、全国统一售价"
        },
        {
            "model": "HC20",
            "inputSpeedRange": [
                2500,
                4000
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.015
            ],
            "thrust": 6,
            "centerDistance": null,
            "weight": 70,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.95,
            "basePrice": 12500,
            "price": 12500,
            "discountRate": 0,
            "factoryPrice": 12500,
            "packagePrice": 12500,
            "marketPrice": 12500,
            "notes": "铝合金、高速、全国统一售价"
        }
    ],
    "mvGearboxes": [
        {
            "model": "MV150A",
            "inputSpeedRange": [
                2000,
                3000
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.018
            ],
            "thrust": 8,
            "centerDistance": null,
            "weight": 80,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 14400,
            "price": 14400,
            "discountRate": 0,
            "factoryPrice": 14400,
            "packagePrice": 14400,
            "marketPrice": 14400,
            "notes": "铝合金、高速、全国统一售价"
        },
        {
            "model": "MV200",
            "inputSpeedRange": [
                2000,
                3000
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.02
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 95,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 16500,
            "price": 16500,
            "discountRate": 0,
            "factoryPrice": 16500,
            "packagePrice": 16500,
            "marketPrice": 16500,
            "notes": "铝合金、高速、全国统一售价"
        },
        {
            "model": "MV100A",
            "inputSpeedRange": [
                1000,
                3000
            ],
            "ratios": [
                1.23,
                1.28,
                1.62,
                2.07,
                2.56,
                2.87
            ],
            "transferCapacity": [
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95
            ],
            "centerDistance": 0,
            "weight": 220,
            "dimensions": "485×508×580",
            "efficiency": 0.97,
            "basePrice": 100000,
            "price": 100000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2950,
                "max": 8850
            },
            "image": "/images/gearbox/Advance-HCQ100-MV100A.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "MV100A(倾角7°)",
            "inputSpeedRange": [
                1000,
                3000
            ],
            "ratios": [
                1.23,
                1.28,
                1.62,
                2.07,
                2.56,
                2.87
            ],
            "transferCapacity": [
                0.1,
                0.1,
                0.1,
                0.1,
                0.09,
                0.08
            ],
            "thrust": 20,
            "centerDistance": 0,
            "weight": 220,
            "dimensions": "485×508×580",
            "efficiency": 0.97,
            "powerRange": {
                "min": 80,
                "max": 300
            },
            "image": "/images/gearbox/Advance-HCQ100-MV100A.webp",
            "source": "2025选型手册第13页"
        }
    ],
    "hcaGearboxes": [
        {
            "model": "HCA200",
            "inputSpeedRange": [
                2000,
                3000
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.02
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 95,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 16500,
            "price": 16500,
            "discountRate": 0,
            "factoryPrice": 16500,
            "packagePrice": 16500,
            "marketPrice": 16500,
            "notes": "铝合金、高速、全国统一售价"
        },
        {
            "model": "HCA1000",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                2.96
            ],
            "transferCapacity": [
                0.6
            ],
            "weight": 1100,
            "efficiency": 0.97,
            "basePrice": 150000,
            "price": 150000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 600,
                "max": 1380
            },
            "image": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA1000(倾角10°)",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1,
                2.96
            ],
            "transferCapacity": [
                0.6,
                0.6
            ],
            "thrust": 100,
            "weight": 1100,
            "dimensions": "1030×1104×1050",
            "efficiency": 0.97,
            "basePrice": 80000,
            "price": 80000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 600,
                "max": 1380
            },
            "image": "/images/gearbox/Advance-HCQ1000-HCQ1001-HCQH1000-HCA1000_2_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA138",
            "inputSpeedRange": [
                1000,
                2600
            ],
            "ratios": [
                1.1,
                1.5,
                2.03,
                2.52,
                2.95
            ],
            "transferCapacity": [
                2.96,
                2.96,
                2.96,
                2.96,
                2.96
            ],
            "weight": 200,
            "dimensions": "625×567×530",
            "efficiency": 0.97,
            "basePrice": 34000,
            "price": 34000,
            "discountRate": 0,
            "powerRange": {
                "min": 2960,
                "max": 7696
            },
            "image": "/images/gearbox/HCQ138-HCA138-.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA138(倾角5°)",
            "inputSpeedRange": [
                1000,
                2600
            ],
            "ratios": [
                2.95
            ],
            "transferCapacity": [
                0.085
            ],
            "thrust": 25,
            "centerDistance": 183,
            "weight": 200,
            "dimensions": "530×660×616",
            "efficiency": 0.97,
            "basePrice": 28280,
            "price": 28280,
            "discountRate": 0.1,
            "powerRange": {
                "min": 85,
                "max": 221
            },
            "image": "/images/gearbox/HCQ138-HCA138-.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA138(倾角7°)",
            "inputSpeedRange": [
                1000,
                2600
            ],
            "ratios": [
                1.1,
                1.28,
                1.5,
                2.03,
                2.52,
                2.95
            ],
            "transferCapacity": [
                0.11,
                0.11,
                0.11,
                0.11,
                0.11,
                0.085
            ],
            "thrust": 25,
            "centerDistance": 185,
            "weight": 200,
            "dimensions": "530×660×616",
            "efficiency": 0.97,
            "basePrice": 20000,
            "price": 20000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 85,
                "max": 286
            },
            "image": "/images/gearbox/HCQ138-HCA138-.webp",
            "source": "2025选型手册第13页"
        },
        {
            "model": "HCA1400",
            "inputSpeedRange": [
                1600,
                2100
            ],
            "ratios": [
                1.03,
                1.52,
                2.03,
                2.5,
                2.53,
                2.93,
                3
            ],
            "transferCapacity": [
                3,
                3,
                3,
                3,
                3,
                3,
                3
            ],
            "weight": 1600,
            "dimensions": "1290×1170×850",
            "efficiency": 0.97,
            "basePrice": 360000,
            "price": 360000,
            "discountRate": 0,
            "powerRange": {
                "min": 4800,
                "max": 6300
            },
            "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA1400(倾角7°)",
            "inputSpeedRange": [
                1600,
                2100
            ],
            "ratios": [
                2.5,
                2.93,
                3
            ],
            "transferCapacity": [
                1.03,
                1.03,
                1.03
            ],
            "thrust": 110,
            "weight": 1600,
            "dimensions": "826×1300×1250",
            "efficiency": 0.97,
            "basePrice": 104000,
            "price": 104000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1648,
                "max": 2163
            },
            "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA1401",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.52,
                2.03,
                2.53,
                2.93
            ],
            "transferCapacity": [
                2.93,
                2.93,
                2.93,
                2.93
            ],
            "weight": 1600,
            "dimensions": "1300×1170×850",
            "efficiency": 0.97,
            "basePrice": 412000,
            "price": 412000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2930,
                "max": 6153
            },
            "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA1401(倾角5°)",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.52,
                2.03,
                2.53,
                2.93
            ],
            "transferCapacity": [
                1.031,
                1.031,
                0.93,
                0.88
            ],
            "thrust": 110,
            "weight": 1600,
            "dimensions": "756×1300×1285",
            "efficiency": 0.97,
            "basePrice": 104060,
            "price": 104060,
            "discountRate": 0.1,
            "powerRange": {
                "min": 880,
                "max": 2165
            },
            "image": "/images/gearbox/Advance-HCQ1400-HCM1400-HCA1400-HCA1401_3_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA300",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.5,
                1.52,
                1.96,
                2.5,
                2.57,
                2.95
            ],
            "transferCapacity": [
                2.95,
                2.95,
                2.95,
                2.95,
                2.95,
                2.95
            ],
            "thrust": 40,
            "centerDistance": 278,
            "weight": 370,
            "dimensions": "620×585×753",
            "efficiency": 0.97,
            "basePrice": 66900,
            "price": 66900,
            "discountRate": 0,
            "powerRange": {
                "min": 2950,
                "max": 6785
            },
            "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA300(倾角10°)",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.52,
                1.96,
                2.5,
                2.95
            ],
            "transferCapacity": [
                0.25,
                0.25,
                0.25,
                0.235
            ],
            "thrust": 40,
            "centerDistance": 278,
            "weight": 370,
            "dimensions": "620×585×753",
            "efficiency": 0.97,
            "basePrice": 45000,
            "price": 45000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 235,
                "max": 575
            },
            "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
            "source": "2025选型手册第13页"
        },
        {
            "model": "HCA301",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.5,
                1.96,
                2.57,
                2.95
            ],
            "transferCapacity": [
                0.25,
                0.235,
                0.235,
                0.235
            ],
            "thrust": 40,
            "centerDistance": 265,
            "weight": 370,
            "dimensions": "618×585×824",
            "efficiency": 0.97,
            "basePrice": 66900,
            "price": 66900,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2950,
                "max": 6785
            },
            "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA301(倾角5°)",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.5,
                1.96,
                2.57,
                2.95
            ],
            "transferCapacity": [
                0.25,
                0.25,
                0.25,
                0.235
            ],
            "thrust": 40,
            "centerDistance": 265,
            "weight": 370,
            "dimensions": "618×585×824",
            "efficiency": 0.97,
            "basePrice": 45000,
            "price": 45000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 235,
                "max": 575
            },
            "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
            "source": "2025选型手册第13页"
        },
        {
            "model": "HCA302",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.52,
                1.96,
                2.57,
                2.95
            ],
            "transferCapacity": [
                0.25,
                0.25,
                0.25,
                0.235
            ],
            "weight": 370,
            "dimensions": "759×688×572",
            "efficiency": 0.97,
            "basePrice": 66900,
            "price": 66900,
            "discountRate": 0.1,
            "powerRange": {
                "min": 235,
                "max": 575
            },
            "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA302(倾角7°)",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.52,
                1.96,
                2.57,
                2.95
            ],
            "transferCapacity": [
                0.25,
                0.25,
                0.235,
                0.235
            ],
            "thrust": 40,
            "centerDistance": 267,
            "weight": 370,
            "dimensions": "560×585×764 (不含支架)",
            "efficiency": 0.97,
            "basePrice": 38120,
            "price": 38120,
            "discountRate": 0.1,
            "powerRange": {
                "min": 235,
                "max": 575
            },
            "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA700",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.18,
                1.51,
                1.97,
                2.5,
                2.73,
                2.84,
                2.92
            ],
            "transferCapacity": [
                2.92,
                2.92,
                2.92,
                2.92,
                2.92,
                2.92,
                2.92
            ],
            "thrust": 90,
            "centerDistance": 100,
            "weight": 1100,
            "dimensions": "835×1104×1156",
            "efficiency": 0.97,
            "basePrice": 163000,
            "price": 163000,
            "discountRate": 0,
            "powerRange": {
                "min": 2920,
                "max": 7300
            },
            "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA700(倾角8°)",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.51,
                1.97,
                2.5,
                2.73,
                2.92
            ],
            "transferCapacity": [
                0.554,
                0.554,
                0.554,
                0.514,
                0.49
            ],
            "thrust": 90,
            "weight": 1100,
            "dimensions": "835×1104×1156",
            "efficiency": 0.97,
            "basePrice": 101000,
            "price": 101000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 490,
                "max": 1385
            },
            "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
            "source": "2025选型手册第14页"
        },
        {
            "model": "HCA701",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.18,
                2.84
            ],
            "transferCapacity": [
                2.96,
                2.96
            ],
            "efficiency": 0.97,
            "basePrice": 163000,
            "price": 163000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2960,
                "max": 7400
            },
            "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCA701(倾角5°)",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                0.77
            ],
            "transferCapacity": [
                0.554
            ],
            "thrust": 27.5,
            "dimensions": "939×1130×1035",
            "efficiency": 0.97,
            "basePrice": 62060,
            "price": 62060,
            "discountRate": 0.1,
            "powerRange": {
                "min": 554,
                "max": 1385
            },
            "image": "/images/gearbox/Advance-HCQ700-HCQ701-HCQH700-HCA700-HCA701-_1_11zon.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCAG1090",
            "inputSpeedRange": [
                1500,
                4500
            ],
            "ratios": [
                1,
                1.57,
                1.75,
                1.96,
                2.48,
                2.5,
                2.9,
                3
            ],
            "transferCapacity": [
                3,
                3,
                3,
                3,
                3,
                3,
                3,
                3
            ],
            "thrust": 16,
            "centerDistance": 160,
            "weight": 106,
            "efficiency": 0.97,
            "basePrice": 600000,
            "price": 600000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 4500,
                "max": 13500
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCAG3050",
            "inputSpeedRange": [
                1000,
                2600
            ],
            "ratios": [
                1.35,
                1.36,
                1.53,
                2.03,
                2.47,
                2.5,
                2.96,
                3
            ],
            "transferCapacity": [
                3,
                3,
                3,
                3,
                3,
                3,
                3,
                3
            ],
            "thrust": 50,
            "centerDistance": 326,
            "weight": 570,
            "efficiency": 0.97,
            "basePrice": 600000,
            "price": 600000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 3000,
                "max": 7800
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCAG5050",
            "inputSpeedRange": [
                1500,
                2500
            ],
            "ratios": [
                2.03,
                2.47,
                2.96
            ],
            "transferCapacity": [
                0.9435,
                0.9157,
                0.7466
            ],
            "thrust": 110,
            "centerDistance": 110,
            "weight": 870,
            "efficiency": 0.97,
            "basePrice": 600000,
            "price": 600000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1120,
                "max": 2359
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCAG6400",
            "inputSpeedRange": [
                1600,
                2100
            ],
            "ratios": [
                2.93,
                3
            ],
            "transferCapacity": [
                1.03,
                1.03
            ],
            "thrust": 110,
            "centerDistance": 110,
            "weight": 1200,
            "efficiency": 0.97,
            "basePrice": 600000,
            "price": 600000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1648,
                "max": 2163
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCAG7650",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.76,
                2.03,
                2.25,
                2.46,
                2.54,
                2.75
            ],
            "transferCapacity": [
                2.75,
                2.75,
                2.75,
                2.75,
                2.75,
                2.75
            ],
            "thrust": 135,
            "centerDistance": 135,
            "weight": 1300,
            "efficiency": 0.97,
            "basePrice": 600000,
            "price": 600000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2750,
                "max": 5775
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCAG7650(倾角8°)",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.76,
                2.03,
                2.25,
                2.46,
                2.54,
                2.75,
                2.96
            ],
            "transferCapacity": [
                1.403,
                1.403,
                1.403,
                1.403,
                1.403,
                1.403,
                1.403
            ],
            "thrust": 1.403,
            "centerDistance": 1,
            "weight": 1300,
            "dimensions": "1.204",
            "efficiency": 0.97,
            "basePrice": 479000,
            "price": 479000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1403,
                "max": 2946
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCAG9055",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.66,
                1.97,
                2.46,
                2.95
            ],
            "transferCapacity": [
                2.95,
                2.95,
                2.95,
                2.95
            ],
            "thrust": 225,
            "centerDistance": 225,
            "weight": 1570,
            "efficiency": 0.97,
            "basePrice": 600000,
            "price": 600000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2950,
                "max": 6195
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCAG9055(倾角8°)",
            "inputSpeedRange": [
                1000,
                2100
            ],
            "ratios": [
                1.97,
                2.46,
                2.95
            ],
            "transferCapacity": [
                1.759,
                1.7095,
                1.66
            ],
            "thrust": 1.7381,
            "centerDistance": 1,
            "weight": 1570,
            "dimensions": "1.356",
            "efficiency": 0.97,
            "basePrice": 563300,
            "price": 563300,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1660,
                "max": 3694
            },
            "image": "/images/gearbox/Advance-800-1000.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCAM1250",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.1,
                1.2,
                1.51
            ],
            "transferCapacity": [
                0.8,
                0.8,
                0.8
            ],
            "thrust": 155,
            "centerDistance": 395,
            "weight": 1086,
            "efficiency": 0.97,
            "basePrice": 142000,
            "price": 142000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 800,
                "max": 1840
            },
            "image": "/images/gearbox/Advance-1100-1200.webp"
        },
        {
            "model": "HCAM1400",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.1,
                1.2,
                1.51
            ],
            "transferCapacity": [
                0.896,
                0.896,
                0.896
            ],
            "thrust": 174,
            "centerDistance": 418,
            "weight": 1216,
            "efficiency": 0.97,
            "basePrice": 360000,
            "price": 360000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 896,
                "max": 2061
            },
            "image": "/images/gearbox/Advance-HCQ401-HCQ402_5_11zon.webp"
        },
        {
            "model": "HCAM302",
            "inputSpeedRange": [
                1000,
                2300
            ],
            "ratios": [
                1.1,
                1.2,
                1.51
            ],
            "transferCapacity": [
                0.193,
                0.193,
                0.193
            ],
            "thrust": 37,
            "centerDistance": 194,
            "weight": 262,
            "efficiency": 0.97,
            "basePrice": 34000,
            "price": 34000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 193,
                "max": 444
            },
            "image": "/images/gearbox/Advance-300-301-302_4_11zon.webp"
        }
    ],
    "hcvGearboxes": [
        {
            "model": "HCV200",
            "inputSpeedRange": [
                2000,
                3000
            ],
            "ratios": [
                1.5,
                2,
                2.5,
                3
            ],
            "transferCapacity": [
                0.02
            ],
            "thrust": 10,
            "centerDistance": null,
            "weight": 95,
            "controlType": "电控",
            "dimensions": "-",
            "efficiency": 0.96,
            "basePrice": 16500,
            "price": 16500,
            "discountRate": 0,
            "factoryPrice": 16500,
            "packagePrice": 16500,
            "marketPrice": 16500,
            "notes": "铝合金、高速、全国统一售价"
        },
        {
            "model": "HCV100",
            "inputSpeedRange": [
                1200,
                2600
            ],
            "ratios": [
                2.02,
                2.48,
                2.95,
                3.45,
                4
            ],
            "transferCapacity": [
                0.06,
                0.054,
                0.049,
                0.044,
                0.04
            ],
            "weight": 70,
            "efficiency": 0.97,
            "basePrice": 31000,
            "price": 31000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 40,
                "max": 120
            },
            "image": "/images/gearbox/Advance-200-201-230.webp"
        },
        {
            "model": "HCV120",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.51,
                2.02,
                2.52
            ],
            "transferCapacity": [
                0.077,
                0.077,
                0.077
            ],
            "centerDistance": 393,
            "weight": 300,
            "dimensions": "502×600×847",
            "efficiency": 0.97,
            "basePrice": 33500,
            "price": 33500,
            "discountRate": 0.1,
            "powerRange": {
                "min": 50,
                "max": 193
            },
            "image": "/images/gearbox/Advance-120C-HCV120.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCV120(倾角7°)",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.51,
                2.02,
                2.52
            ],
            "transferCapacity": [
                0.1,
                0.1,
                0.076
            ],
            "thrust": 25,
            "centerDistance": 393,
            "weight": 300,
            "dimensions": "502×600×847",
            "efficiency": 0.97,
            "basePrice": 38800,
            "price": 38800,
            "discountRate": 0.1,
            "powerRange": {
                "min": 76,
                "max": 250
            },
            "image": "/images/gearbox/Advance-120C-HCV120.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCV230",
            "inputSpeedRange": [
                1000,
                2200
            ],
            "ratios": [
                1.49,
                1.96,
                2.48
            ],
            "transferCapacity": [
                2.95,
                2.95,
                2.95
            ],
            "centerDistance": 480,
            "weight": 450,
            "dimensions": "568×820×1020",
            "efficiency": 0.97,
            "basePrice": 51000,
            "price": 51000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2950,
                "max": 6490
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCV230(倾角7°)",
            "inputSpeedRange": [
                1000,
                2200
            ],
            "ratios": [
                1.49,
                1.96,
                2.48
            ],
            "transferCapacity": [
                0.184,
                0.17,
                0.146
            ],
            "thrust": 27.5,
            "centerDistance": 480,
            "weight": 450,
            "dimensions": "568×820×1020",
            "efficiency": 0.97,
            "basePrice": 48700,
            "price": 48700,
            "discountRate": 0.1,
            "powerRange": {
                "min": 146,
                "max": 405
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "HCVG3710",
            "inputSpeedRange": [
                1000,
                2500
            ],
            "ratios": [
                1.36,
                1.48,
                1.53,
                2.02,
                2.03,
                2.47,
                2.5,
                2.55,
                2.96
            ],
            "transferCapacity": [
                2.96,
                2.96,
                2.96,
                2.96,
                2.96,
                2.96,
                2.96,
                2.96,
                2.96
            ],
            "thrust": 90,
            "centerDistance": 600,
            "weight": 600,
            "efficiency": 0.97,
            "basePrice": 540000,
            "price": 540000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2960,
                "max": 7400
            },
            "image": "/images/gearbox/Advance-200-201-230.webp",
            "source": "杭齿厂选型手册2025版5月版"
        }
    ],
    "flexibleCouplings": [],
    "standbyPumps": [],
    "otherGearboxes": [
        {
            "model": "2GWH1830",
            "inputSpeedRange": [
                400,
                900
            ],
            "ratios": [
                2.53,
                3.54,
                4.55,
                5.56
            ],
            "transferCapacity": [
                1.921,
                1.596,
                1.596,
                1.271
            ],
            "thrust": 270,
            "centerDistance": 1760,
            "efficiency": 0.97,
            "basePrice": 380000,
            "price": 380000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 508,
                "max": 1729
            },
            "image": "/images/gearbox/Advance-2GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "2GWH3140",
            "inputSpeedRange": [
                400,
                800
            ],
            "ratios": [
                2.53,
                3.54,
                4.55,
                5.56
            ],
            "transferCapacity": [
                3.282,
                2.7265,
                2.7265,
                2.171
            ],
            "thrust": 300,
            "centerDistance": 2080,
            "dimensions": "3285×3000×2840",
            "efficiency": 0.97,
            "basePrice": 520000,
            "price": 520000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 868,
                "max": 2626
            },
            "image": "/images/gearbox/Advance-2GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "2GWH4100",
            "inputSpeedRange": [
                400,
                700
            ],
            "ratios": [
                2.53,
                3.54,
                4.55,
                5.56
            ],
            "transferCapacity": [
                4.243,
                3.5675,
                3.5675,
                2.892
            ],
            "thrust": 450,
            "centerDistance": 2300,
            "efficiency": 0.97,
            "basePrice": 680000,
            "price": 680000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1157,
                "max": 2970
            },
            "image": "/images/gearbox/Advance-2GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "2GWH5410",
            "inputSpeedRange": [
                400,
                600
            ],
            "ratios": [
                2.53,
                3.54,
                4.55,
                5.56
            ],
            "transferCapacity": [
                5.774,
                4.8035,
                4.8035,
                3.833
            ],
            "thrust": 550,
            "centerDistance": 2560,
            "efficiency": 0.97,
            "basePrice": 850000,
            "price": 850000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1533,
                "max": 3464
            },
            "image": "/images/gearbox/Advance-2GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "2GWH7050",
            "inputSpeedRange": [
                400,
                600
            ],
            "ratios": [
                2.53,
                3.54,
                4.55,
                5.56
            ],
            "transferCapacity": [
                7.435,
                6.1445,
                6.1445,
                4.854
            ],
            "thrust": 750,
            "centerDistance": 2700,
            "efficiency": 0.97,
            "basePrice": 1050000,
            "price": 1050000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 1942,
                "max": 4461
            },
            "image": "/images/gearbox/Advance-2GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "2GWH9250",
            "inputSpeedRange": [
                400,
                600
            ],
            "ratios": [
                2.53,
                3.54,
                4.55,
                5.56
            ],
            "transferCapacity": [
                9.917,
                8.206,
                8.206,
                6.495
            ],
            "thrust": 1000,
            "centerDistance": 3080,
            "efficiency": 0.97,
            "basePrice": 1350000,
            "price": 1350000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2598,
                "max": 5950
            },
            "image": "/images/gearbox/Advance-2GWH.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "SGW30.32",
            "inputSpeedRange": [
                400,
                870
            ],
            "ratios": [
                2.33,
                3.52
            ],
            "transferCapacity": [
                1.94,
                2.91
            ],
            "thrust": 1.109,
            "centerDistance": 100,
            "efficiency": 0.97,
            "basePrice": 45000,
            "price": 45000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 776,
                "max": 2532
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "SGW32.35",
            "inputSpeedRange": [
                400,
                760
            ],
            "ratios": [
                1.92,
                2.17
            ],
            "transferCapacity": [
                1.62,
                1.81
            ],
            "thrust": 1.604,
            "centerDistance": 113,
            "efficiency": 0.97,
            "basePrice": 52000,
            "price": 52000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 648,
                "max": 1376
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "SGWS49.54",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                1.57,
                1.64,
                1.73,
                1.77,
                1.82
            ],
            "thrust": 2.647,
            "centerDistance": 290,
            "dimensions": "540",
            "efficiency": 0.97,
            "basePrice": 116000,
            "price": 116000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 628,
                "max": 2184
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "SGWS52.59",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                1.57,
                1.64,
                1.73,
                1.77,
                1.82
            ],
            "thrust": 3.448,
            "centerDistance": 360,
            "dimensions": "590",
            "efficiency": 0.97,
            "basePrice": 155000,
            "price": 155000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 628,
                "max": 2184
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "SGWS60.66",
            "inputSpeedRange": [
                400,
                1200
            ],
            "ratios": [
                2,
                2.54,
                2.96,
                3.5,
                3.95
            ],
            "transferCapacity": [
                1.61,
                1.65,
                1.74,
                1.78,
                1.83
            ],
            "thrust": 4.625,
            "centerDistance": 540,
            "dimensions": "668",
            "efficiency": 0.97,
            "basePrice": 210000,
            "price": 210000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 644,
                "max": 2196
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "SGWS66.75",
            "inputSpeedRange": [
                300,
                950
            ],
            "ratios": [
                1.97,
                2.47,
                3,
                3.52,
                3.95
            ],
            "transferCapacity": [
                1.57,
                1.64,
                1.73,
                1.77,
                1.82
            ],
            "thrust": 6.99,
            "centerDistance": 730,
            "dimensions": "750",
            "efficiency": 0.97,
            "basePrice": 280000,
            "price": 280000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 471,
                "max": 1729
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "SGWS70.76",
            "inputSpeedRange": [
                300,
                950
            ],
            "ratios": [
                1.94,
                2.54,
                3,
                3.5,
                3.95
            ],
            "transferCapacity": [
                1.57,
                1.61,
                1.69,
                1.73,
                1.78
            ],
            "thrust": 8.111,
            "centerDistance": 750,
            "dimensions": "768",
            "efficiency": 0.97,
            "basePrice": 350000,
            "price": 350000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 471,
                "max": 1691
            },
            "image": "/images/gearbox/Advance-GWS.webp",
            "source": "杭齿厂选型手册2025版5月版"
        },
        {
            "model": "X6110C",
            "inputSpeedRange": [
                750,
                1800
            ],
            "ratios": [
                2.03,
                2.81,
                3.73
            ],
            "transferCapacity": [
                3.73,
                3.73,
                3.73
            ],
            "efficiency": 0.97,
            "basePrice": 100000,
            "price": 100000,
            "discountRate": 0.1,
            "powerRange": {
                "min": 2798,
                "max": 6714
            },
            "image": "/images/gearbox/Advance-GC.webp",
            "source": "杭齿厂选型手册2025版5月版"
        }
    ]
};

// Add default export to ensure correct import from other files
export default embeddedGearboxData;
