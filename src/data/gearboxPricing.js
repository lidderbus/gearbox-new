// src/data/gearboxPricing.js
// 齿轮箱价格表数据，从2024年价格清单导入

// 价格折扣率映射表 - 基于型号前缀的默认下浮比例
export const discountRateMap = {
  // HC系列
  'HC': 0.16, // 默认HC系列下浮16%
  'HCD': 0.16,
  'HCT': 0.16,
  'HCW': 0.08, // HCW系列下浮8%
  
  // 特定型号覆盖
  'HC600': 0.12, // HC600系列下浮12%
  'HCD600': 0.12,
  'HCT600': 0.12,
  'HC800': 0.08, // HC800系列下浮8%
  'HCD800': 0.08,
  'HC1000': 0.06, // HC1000及以上下浮6%
  'HCD1000': 0.06,
  'HCT1000': 0.06,
  'HCT1100': 0.06,
  'HCW1100': 0.06,
  'HCT1200': 0.06,
  'HC1400': 0.06,
  'HCD1400': 0.06,
  'HCT1400': 0.06,
  'HCW1400': 0.06,
  
  // HCL系列
  'HCL': 0.12, // HCL系列下浮12%
  
  // GW系列
  'GWC': 0.10, // GW系列下浮10%
  
  // DT系列
  'DT': 0.10, // DT系列下浮10%
  
  // MB系列
  'MB': 0.12, // MB系列下浮12%
  
  // 特殊型号
  '40A': 0.16,
  '120C': 0.12,
  '120B': 0.12,
  '135': 0.16,
  '135A': 0.16,
  '300': 0.16,
  'J300': 0.22, // 报告特批，按原价格计算约为22%
  'D300A': 0.16, // 部分是报告特批
  'T300': 0.16,
  'HC400': 0.22,
  'HCD400A': 0.22,
  'HC1200': 0.14,
  'HC1200/1': 0.10,
  
  // 默认值
  'default': 0.10
};

// 特殊型号的下浮比例
export const specialDiscountRates = {
  'J300': 0.22,
  'D300A (4-5.5:1)': 0.22,
  'HC400': 0.22,
  'HCD400A': 0.22,
  'HC1200': 0.14,
  'HC1200/1': 0.10
};

// 齿轮箱完整价格数据
export const gearboxPriceData = [
  // HC系列
  { model: '40A', basePrice: 8560, discountRate: 0.16, discountedPrice: 7104 },
  { model: '120B', basePrice: 12520, discountRate: 0.12, discountedPrice: 11017.6 },
  { model: '120C', basePrice: 13420, discountRate: 0.12, discountedPrice: 11809.6 },
  { model: 'MB170', basePrice: 10950, discountRate: 0.12, discountedPrice: 9636 },
  { model: 'MB242', basePrice: 21300, discountRate: 0.12, discountedPrice: 18744 },
  { model: 'MB270A (3-5.5:1)', basePrice: 28600, discountRate: 0.12, discountedPrice: 25168 },
  { model: 'MB270A (6-7:1)', basePrice: 30000, discountRate: 0.12, discountedPrice: 26400 },
  { model: '135', basePrice: 18360, discountRate: 0.16, discountedPrice: 15422.4 },
  { model: '135A', basePrice: 19200, discountRate: 0.16, discountedPrice: 16128 },
  { model: 'HC138', basePrice: 18200, discountRate: 0.16, discountedPrice: 15288 },
  { model: 'HCD138', basePrice: 19400, discountRate: 0.16, discountedPrice: 16296 },
  { model: '300(1.87-3:1)', basePrice: 23000, discountRate: 0.16, discountedPrice: 19320 },
  { model: '300 (3.5-4:1)', basePrice: 23600, discountRate: 0.16, discountedPrice: 19824 },
  { model: '300 (4.5-5.5:1)', basePrice: 24150, discountRate: 0.16, discountedPrice: 20286 },
  { model: 'J300', basePrice: 26680, discountRate: 0.22, discountedPrice: 20810 },
  { model: 'HC300 (1.5-4.61)', basePrice: 24600, discountRate: 0.16, discountedPrice: 20664 },
  { model: 'HC300 (4.94-5.44)', basePrice: 25600, discountRate: 0.16, discountedPrice: 21504 },
  { model: 'D300A (4-5.5:1)', basePrice: 32420, discountRate: 0.22, discountedPrice: 25287 },
  { model: 'D300A (6-7.5:1)', basePrice: 34520, discountRate: 0.16, discountedPrice: 28996.8 },
  { model: 'T300', basePrice: 43900, discountRate: 0.16, discountedPrice: 36876 },
  { model: 'T300/1', basePrice: 46900, discountRate: 0.16, discountedPrice: 39396 },
  { model: 'HC400', basePrice: 32150, discountRate: 0.22, discountedPrice: 25077 },
  { model: 'HCD400A', basePrice: 38150, discountRate: 0.22, discountedPrice: 29757 },
  { model: 'HCT400A', basePrice: 51000, discountRate: 0.16, discountedPrice: 42840 },
  { model: 'HCT400A/1', basePrice: 60000, discountRate: 0.16, discountedPrice: 50400 },
  { model: 'HC600A', basePrice: 57200, discountRate: 0.12, discountedPrice: 50336 },
  { model: 'HCD600A', basePrice: 60600, discountRate: 0.12, discountedPrice: 53328 },
  { model: 'HCT600A', basePrice: 70900, discountRate: 0.12, discountedPrice: 62392 },
  { model: 'HCT600A/1', basePrice: 75000, discountRate: 0.12, discountedPrice: 66000 },
  { model: 'HCD800', basePrice: 86100, discountRate: 0.08, discountedPrice: 79212 },
  { model: 'HCT800', basePrice: 98000, discountRate: 0.08, discountedPrice: 90160 },
  { model: 'HCT800/1', basePrice: 137200, discountRate: 0.08, discountedPrice: 126224 },
  { model: 'HCT800/2', basePrice: 150200, discountRate: 0.08, discountedPrice: 138184 },
  { model: 'HCT800/3', basePrice: 170800, discountRate: 0.08, discountedPrice: 157136 },
  { model: 'HCW800', basePrice: 173900, discountRate: 0.08, discountedPrice: 159988 },
  { model: 'HC1000', basePrice: 81200, discountRate: 0.06, discountedPrice: 76328 },
  { model: 'HCD1000', basePrice: 89800, discountRate: 0.06, discountedPrice: 84412 },
  { model: 'HCT1100', basePrice: 128960, discountRate: 0.06, discountedPrice: 121222.4 },
  { model: 'HCW1100', basePrice: 257500, discountRate: 0.06, discountedPrice: 242050 },
  { model: 'HC1200', basePrice: 92000, discountRate: 0.14, discountedPrice: 79380 },
  { model: 'HC1200/1', basePrice: 108200, discountRate: 0.10, discountedPrice: 97000 },
  { model: 'HCT1200', basePrice: 143000, discountRate: 0.06, discountedPrice: 134420 },
  { model: 'HCT1200/1', basePrice: 157000, discountRate: 0.06, discountedPrice: 147580 },
  { model: 'HCT1280/2', basePrice: 165000, discountRate: 0.06, discountedPrice: 155100 },
  { model: 'HCD1400', basePrice: 139000, discountRate: 0.06, discountedPrice: 130660 },
  { model: 'HCT1400', basePrice: 162500, discountRate: 0.06, discountedPrice: 152750 },
  { model: 'HCT1400/2', basePrice: 205000, discountRate: 0.06, discountedPrice: 192700 },
  { model: 'HCW1400', basePrice: 204000, discountRate: 0.06, discountedPrice: 191760 },
  { model: 'HC1600', basePrice: 150000, discountRate: 0.06, discountedPrice: 141000 },
  { model: 'HCD1600', basePrice: 165400, discountRate: 0.06, discountedPrice: 155476 },
  { model: 'HCT1600', basePrice: 194800, discountRate: 0.06, discountedPrice: 183112 },
  { model: 'HCT1600/1', basePrice: 223000, discountRate: 0.06, discountedPrice: 209620 },
  { model: 'HC2000', basePrice: 180000, discountRate: 0.06, discountedPrice: 169200 },
  { model: 'HCD2000', basePrice: 206000, discountRate: 0.06, discountedPrice: 193640 },
  { model: 'HCT2000', basePrice: 238000, discountRate: 0.06, discountedPrice: 223720 },
  { model: 'HCT2000/1', basePrice: 280000, discountRate: 0.06, discountedPrice: 263200 },
  { model: 'HC2700', basePrice: 230000, discountRate: 0.06, discountedPrice: 216200 },
  { model: 'HCD2700', basePrice: 280800, discountRate: 0.06, discountedPrice: 263952 },
  { model: 'HCT2700', basePrice: 340000, discountRate: 0.06, discountedPrice: 319600 },
  { model: 'HCT2700/1', basePrice: 390000, discountRate: 0.06, discountedPrice: 366600 },
  
  // HCL系列
  { model: 'HCL30', basePrice: 5320, discountRate: 0.12, discountedPrice: 4681.6 },
  { model: 'HCL100', basePrice: 6760, discountRate: 0.12, discountedPrice: 5948.8 },
  { model: 'HCL250', basePrice: 8800, discountRate: 0.12, discountedPrice: 7744 },
  { model: 'HCL320', basePrice: 9100, discountRate: 0.12, discountedPrice: 8008 },
  { model: 'HCL600', basePrice: 21600, discountRate: 0.12, discountedPrice: 19008 },
  
  // GWC系列
  { model: 'GWC28.30(2-6:1)', basePrice: 72500, discountRate: 0.10, discountedPrice: 65250 },
  { model: 'GWC30.32(2-6:1)', basePrice: 90800, discountRate: 0.10, discountedPrice: 81720 },
  { model: 'GWC32.35(2-6:1)', basePrice: 103800, discountRate: 0.10, discountedPrice: 93420 },
  { model: 'GWC36.39(2-6:1)', basePrice: 123800, discountRate: 0.10, discountedPrice: 111420 },
  { model: 'GWC39.41(2-6:1)', basePrice: 153800, discountRate: 0.10, discountedPrice: 138420 },
  { model: 'GWC42.45(2-6:1)', basePrice: 185800, discountRate: 0.10, discountedPrice: 167220 },
  { model: 'GWC45.49(2-6:1)', basePrice: 275800, discountRate: 0.10, discountedPrice: 248220 },
  { model: 'GWC45.52(2-6:1)', basePrice: 320000, discountRate: 0.10, discountedPrice: 288000 },
  { model: 'GWC49.54(2-6:1)', basePrice: 402600, discountRate: 0.10, discountedPrice: 362340 },
  { model: 'GWC49.59(2-6:1)', basePrice: 460000, discountRate: 0.10, discountedPrice: 414000 },
  { model: 'GWC49.59A(2-6:1)带PT', basePrice: 495000, discountRate: 0.10, discountedPrice: 445500 },
  { model: 'GWC52.59(2-6:1)', basePrice: 545000, discountRate: 0.10, discountedPrice: 490500 },
  { model: 'GWC52.59A(2-6:1)滑动', basePrice: 575000, discountRate: 0.10, discountedPrice: 517500 },
  { model: 'GWC52.62(2-6:1)', basePrice: 575000, discountRate: 0.10, discountedPrice: 517500 },
  { model: 'GWC60.66(2-6:1)', basePrice: 800000, discountRate: 0.10, discountedPrice: 720000 },
  { model: 'GWC60.66A(2-6:1)滑动', basePrice: 830000, discountRate: 0.10, discountedPrice: 747000 },
  { model: 'GWC60.74(2-6:1)', basePrice: 920000, discountRate: 0.10, discountedPrice: 828000 },
  { model: 'GWC60.74B(2-6:1)带PT', basePrice: 1010000, discountRate: 0.10, discountedPrice: 909000 },
  { model: 'GWC63.71(2-6:1)', basePrice: 950000, discountRate: 0.10, discountedPrice: 855000 },
  { model: 'GWC63.71(2-6:1)带PTO', basePrice: 1030000, discountRate: 0.10, discountedPrice: 927000 },
  { model: 'GWC66.75(2-6:1)', basePrice: 1050000, discountRate: 0.10, discountedPrice: 945000 },
  { model: 'GWC70.76(2-6:1)', basePrice: 1100000, discountRate: 0.10, discountedPrice: 990000 },
  { model: 'GWC70.76C(2-6:1)带PT', basePrice: 1150000, discountRate: 0.10, discountedPrice: 1035000 },
  { model: 'GWC70.85(2-6:1)', basePrice: 1620000, discountRate: 0.10, discountedPrice: 1458000 },
  { model: 'GWC70.85A(2-6:1)带PT', basePrice: 1670000, discountRate: 0.10, discountedPrice: 1503000 },
  { model: 'GWC75.90(2-6:1)', basePrice: 1800000, discountRate: 0.10, discountedPrice: 1620000 },
  { model: 'GWC75.90(2-6:1)带PTO', basePrice: 1850000, discountRate: 0.10, discountedPrice: 1665000 },
  { model: 'GWC78.88(2-6:1)', basePrice: 1670000, discountRate: 0.10, discountedPrice: 1503000 },
  { model: 'GWC78.88A(2-6:1)带PT', basePrice: 1740000, discountRate: 0.10, discountedPrice: 1566000 },
  
  // DT系列
  { model: 'DT180', basePrice: 23000, discountRate: 0.10, discountedPrice: 20700 },
  { model: 'DT210', basePrice: 35000, discountRate: 0.10, discountedPrice: 31500 },
  { model: 'DT240', basePrice: 39000, discountRate: 0.10, discountedPrice: 35100 },
  { model: 'DT280', basePrice: 45000, discountRate: 0.10, discountedPrice: 40500 },
  { model: 'DT580', basePrice: 52000, discountRate: 0.10, discountedPrice: 46800 },
  { model: 'DT770', basePrice: 58000, discountRate: 0.10, discountedPrice: 52200 },
  { model: 'DT900', basePrice: 63000, discountRate: 0.10, discountedPrice: 56700 },
  { model: 'DT1400', basePrice: 100000, discountRate: 0.10, discountedPrice: 90000 },
  { model: 'DT1500', basePrice: 120000, discountRate: 0.10, discountedPrice: 108000 },
  { model: 'DT2400', basePrice: 155000, discountRate: 0.10, discountedPrice: 139500 },
  { model: 'DT4300', basePrice: 175000, discountRate: 0.10, discountedPrice: 157500 }
]; 