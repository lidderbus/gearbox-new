// src/data/testData.js

export const testData = {
  // HC系列齿轮箱（中小功率系列）
  hcGearboxes: [
    { model: "40A", inputSpeedRange: [1000, 3000], ratios: [2.52, 3.05, 3.50], transferCapacity: [0.004], thrust: 5.5, centerDistance: 125, weight: 115, dimensions: "291×454×485", controlType: "推拉软轴", price: 8560, discountRate: 16, factoryPrice: 7190.4, packagePrice: 7500, marketPrice: 8560, recommendedHighFlex: "HGT1020", recommendedPump: "2CY7.5/2.5D" },
    { model: "120C", inputSpeedRange: [1000, 2500], ratios: [2.96, 3.35], transferCapacity: [0.039], thrust: 25, centerDistance: 142, weight: 225, dimensions: "510×670×656", controlType: "推拉软轴", price: 13420, discountRate: 12, factoryPrice: 11809.6, packagePrice: 12200, marketPrice: 13420, recommendedHighFlex: "HGT1620", recommendedPump: "2CY7.5/2.5D" },
    { model: "120B", inputSpeedRange: [1000, 2500], ratios: [2.96, 3.35], transferCapacity: [0.039], thrust: 25, centerDistance: 142, weight: 225, dimensions: "510×670×656", controlType: "推拉软轴", price: 12520, discountRate: 12, factoryPrice: 11017.6, packagePrice: 11500, marketPrice: 12520, recommendedHighFlex: "HGT1620", recommendedPump: "2CY7.5/2.5D" },
    { model: "MB170", inputSpeedRange: [1000, 2500], ratios: [1.97, 2.52, 3.04, 3.54, 3.96], transferCapacity: [0.031], thrust: 25, centerDistance: 170, weight: 240, dimensions: "605×744×770", controlType: "推拉软轴", price: 10950, discountRate: 12, factoryPrice: 9636, packagePrice: 10000, marketPrice: 10950, recommendedHighFlex: "HGT2020", recommendedPump: "2CY7.5/2.5D" },
    { model: "MB242", inputSpeedRange: [1000, 2500], ratios: [1.97, 2.52, 3.04, 3.54, 3.96], transferCapacity: [0.031], thrust: 25, centerDistance: 190, weight: 400, dimensions: "432×440×650", controlType: "推拉软轴", price: 21300, discountRate: 12, factoryPrice: 18744, packagePrice: 19500, marketPrice: 21300, recommendedHighFlex: "HGT2020", recommendedPump: "2CY7.5/2.5D" },
    { model: "MB270A", inputSpeedRange: [750, 2000], ratios: [3.5, 4.5, 5.5], transferCapacity: [0.088], thrust: 29.4, centerDistance: 225, weight: 470, dimensions: "578×792×830", controlType: "推拉软轴", price: 28600, discountRate: 12, factoryPrice: 25168, packagePrice: 26000, marketPrice: 28600, recommendedHighFlex: "HGT2520", recommendedPump: "2CY7.5/2.5D" },
    { model: "135", inputSpeedRange: [750, 2000], ratios: [2.03, 2.59, 3.04, 3.62, 4.11, 4.65, 5.06, 5.47, 5.81], transferCapacity: [0.1], thrust: 29.4, centerDistance: 225, weight: 470, dimensions: "578×792×830", controlType: "推拉软轴", price: 18360, discountRate: 16, factoryPrice: 15422.4, packagePrice: 16800, marketPrice: 18360, recommendedHighFlex: "HGT2520", recommendedPump: "2CY7.5/2.5D" },
    { model: "135A", inputSpeedRange: [750, 2000], ratios: [2.03, 2.59, 3.04, 3.62, 4.11, 4.65, 5.06, 5.47, 5.81], transferCapacity: [0.1], thrust: 29.4, centerDistance: 225, weight: 470, dimensions: "578×792×830", controlType: "推拉软轴", price: 19200, discountRate: 16, factoryPrice: 16128, packagePrice: 17500, marketPrice: 19200, recommendedHighFlex: "HGT2520", recommendedPump: "2CY7.5/2.5D" },
    { model: "HC138", inputSpeedRange: [1000, 2500], ratios: [2.00, 2.52, 3.00, 3.57, 4.05, 4.45], transferCapacity: [0.11], thrust: 30, centerDistance: 225, weight: 470, dimensions: "520×792×760", controlType: "推拉软轴", price: 18200, discountRate: 16, factoryPrice: 15288, packagePrice: 16700, marketPrice: 18200, recommendedHighFlex: "HGT3020", recommendedPump: "2CY7.5/2.5D" },
    { model: "HCD138", inputSpeedRange: [1000, 2500], ratios: [2.00, 2.52, 3.00, 3.57, 4.05, 4.45], transferCapacity: [0.11], thrust: 30, centerDistance: 225, weight: 470, dimensions: "520×792×760", controlType: "推拉软轴", price: 19400, discountRate: 16, factoryPrice: 16296, packagePrice: 17800, marketPrice: 19400, recommendedHighFlex: "HGT3020", recommendedPump: "2CY7.5/2.5D" }
    // Additional gearboxes removed for brevity
  ],

  // GW系列齿轮箱
  gwGearboxes: [
    { model: "GWC28.30", inputSpeedRange: [400, 2000], ratios: [2.06, 2.51, 3.08, 3.54, 4.05, 4.54, 5.09, 5.59, 6.14], transferCapacity: [0.865], thrust: 80, centerDistance: 264, weight: 1230, price: 72500, discountRate: 10, factoryPrice: 65250, packagePrice: 68000, marketPrice: 72500, recommendedHighFlex: "HGT3020", recommendedPump: "2CY7.5/2.5D" },
    { model: "GWC30.32", inputSpeedRange: [400, 2000], ratios: [2.03, 2.55, 3.04, 3.52, 4.00, 4.55, 5.05, 5.64, 6.05], transferCapacity: [1.122], thrust: 100, centerDistance: 264, weight: 1460, price: 90800, discountRate: 10, factoryPrice: 81720, packagePrice: 85000, marketPrice: 90800, recommendedHighFlex: "HGT4020", recommendedPump: "2CY7.5/2.5D" },
    { model: "GWC32.35", inputSpeedRange: [400, 2000], ratios: [2.06, 2.54, 3.02, 3.58, 4.05, 4.59, 5.09, 5.57, 6.08], transferCapacity: [1.4175], thrust: 120, centerDistance: 264, weight: 1760, price: 103800, discountRate: 10, factoryPrice: 93420, packagePrice: 97500, marketPrice: 103800, recommendedHighFlex: "HGT4020", recommendedPump: "2CY7.5/2.5D" }
    // Additional gearboxes removed for brevity
  ],

  // HCM系列齿轮箱（轻型高速船用）
  hcmGearboxes: [
    { model: "HCM70", inputSpeedRange: [1500, 4000], ratios: [1.00, 1.30, 2.00, 2.48, 2.78, 2.90], transferCapacity: [0.0712], thrust: 14, centerDistance: 127, weight: 46, price: 23000, discountRate: 8, factoryPrice: 21160, packagePrice: 22000, marketPrice: 23000, recommendedHighFlex: "HGT1020", recommendedPump: "2CY7.5/2.5D" },
    { model: "HCM120", inputSpeedRange: [1500, 3600], ratios: [1.57, 1.75, 1.96, 2.50, 2.48, 2.78, 2.90, 3.00], transferCapacity: [0.1114], thrust: 16, centerDistance: 135, weight: 63, price: 28000, discountRate: 8, factoryPrice: 25760, packagePrice: 26500, marketPrice: 28000, recommendedHighFlex: "HGT1220", recommendedPump: "2CY7.5/2.5D" },
    { model: "HCM160", inputSpeedRange: [1500, 3000], ratios: [1.22, 1.97, 2.92], transferCapacity: [0.2192], thrust: 25, centerDistance: 155, weight: 98, price: 32000, discountRate: 8, factoryPrice: 29440, packagePrice: 30500, marketPrice: 32000, recommendedHighFlex: "HGT2520", recommendedPump: "2CY7.5/2.5D" }
    // Additional gearboxes removed for brevity
  ],

  // DT系列齿轮箱（电推系列船用）
  dtGearboxes: [
    { model: "DT180", inputSpeedRange: [750, 1500], ratios: [1.53, 2.03, 2.50, 2.96, 3.54, 3.96, 4.48, 4.96, 5.52, 5.98], transferCapacity: [0.083], thrust: 14.7, centerDistance: 142, weight: 130, dimensions: "325×380×544", controlType: "推拉软轴", price: 23000, discountRate: 10, factoryPrice: 20700, packagePrice: 21500, marketPrice: 23000, recommendedHighFlex: "HGT1020", recommendedPump: "2CY7.5/2.5D" },
    { model: "DT210", inputSpeedRange: [750, 1500], ratios: [1.54, 2.03, 2.48, 3.04, 3.52, 3.91, 4.42, 4.92, 5.48, 6.02], transferCapacity: [0.100], thrust: 16, centerDistance: 146, weight: 150, dimensions: "365×551×656", controlType: "推拉软轴", price: 35000, discountRate: 10, factoryPrice: 31500, packagePrice: 33000, marketPrice: 35000, recommendedHighFlex: "HGT1220", recommendedPump: "2CY7.5/2.5D" },
    { model: "DT240", inputSpeedRange: [750, 1500], ratios: [1.53, 2.03, 2.50, 2.96, 3.55, 4.00, 4.53, 5.05], transferCapacity: [0.160], thrust: 25, centerDistance: 165, weight: 240, dimensions: "641×619×715", controlType: "推拉软轴", price: 39000, discountRate: 10, factoryPrice: 35100, packagePrice: 36500, marketPrice: 39000, recommendedHighFlex: "HGT2520", recommendedPump: "2CY7.5/2.5D" }
    // Additional gearboxes removed for brevity
  ],

  // HCQ系列轻型高速船用齿轮箱
  hcqGearboxes: [
    { model: "HCQ038A", inputSpeedRange: [1800, 4500], ratios: [1.26, 1.52, 1.85, 2.03, 2.50], transferCapacity: [0.045], thrust: 5.0, centerDistance: 100, weight: 38, dimensions: "265×330×350", controlType: "手控", price: 18500, discountRate: 3, factoryPrice: 17945, packagePrice: 18200, marketPrice: 18500, recommendedHighFlex: "HGTHB1", recommendedPump: "2CY7.5/2.5D" },
    { model: "HCQ65", inputSpeedRange: [1500, 4000], ratios: [1.34, 1.58, 1.93, 2.43], transferCapacity: [0.062], thrust: 9.5, centerDistance: 113, weight: 65, dimensions: "315×385×420", controlType: "手控", price: 22000, discountRate: 3, factoryPrice: 21340, packagePrice: 21700, marketPrice: 22000, recommendedHighFlex: "HGTHB1.6", recommendedPump: "2CY7.5/2.5D" },
    { model: "HCV120", inputSpeedRange: [1500, 3600], ratios: [1.36, 1.72, 2.04, 2.50], transferCapacity: [0.094], thrust: 12, centerDistance: 125, weight: 120, dimensions: "420×500×530", controlType: "手控", price: 28000, discountRate: 3, factoryPrice: 27160, packagePrice: 27500, marketPrice: 28000, recommendedHighFlex: "HGTHB2.5", recommendedPump: "2CY7.5/2.5D" },
    { model: "HCQ180", inputSpeedRange: [1500, 3600], ratios: [1.38, 1.75, 2.08, 2.55], transferCapacity: [0.142], thrust: 18, centerDistance: 135, weight: 180, dimensions: "450×530×560", controlType: "手控", price: 32000, discountRate: 3, factoryPrice: 31040, packagePrice: 31500, marketPrice: 32000, recommendedHighFlex: "HGTHB4", recommendedPump: "2CY7.5/2.5D" },
    { model: "HCQ250", inputSpeedRange: [1500, 3600], ratios: [1.40, 1.78, 2.12, 2.60], transferCapacity: [0.195], thrust: 25, centerDistance: 145, weight: 250, dimensions: "480×560×590", controlType: "手控", price: 38000, discountRate: 3, factoryPrice: 36860, packagePrice: 37500, marketPrice: 38000, recommendedHighFlex: "HGTHB6.3", recommendedPump: "2CY14.2/2.5D" },
    { model: "HCQ350", inputSpeedRange: [1500, 3600], ratios: [1.42, 1.80, 2.15, 2.65], transferCapacity: [0.272], thrust: 35, centerDistance: 155, weight: 350, dimensions: "510×590×620", controlType: "手控", price: 45000, discountRate: 3, factoryPrice: 43650, packagePrice: 44500, marketPrice: 45000, recommendedHighFlex: "HGTHB10", recommendedPump: "2CY14.2/2.5D" },
    { model: "HCQ500", inputSpeedRange: [1500, 3600], ratios: [1.44, 1.82, 2.18, 2.70], transferCapacity: [0.388], thrust: 50, centerDistance: 165, weight: 500, dimensions: "540×620×650", controlType: "手控", price: 55000, discountRate: 3, factoryPrice: 53350, packagePrice: 54500, marketPrice: 55000, recommendedHighFlex: "HGTHB16", recommendedPump: "2CY19.2/2.5D" }
  ],

  // GCS系列(变距桨)船用齿轮箱
  gcGearboxes: [
    { model: "GCS320", inputSpeedRange: [600, 1800], ratios: [2.03, 2.51, 3.04, 3.55, 4.10, 4.58, 5.04, 5.52, 6.06], transferCapacity: [0.850], thrust: 90, centerDistance: 320, weight: 1350, dimensions: "885×915×920", controlType: "电液控制", price: 78000, discountRate: 3, factoryPrice: 75660, packagePrice: 76800, marketPrice: 78000, recommendedHighFlex: "HGT3020", recommendedPump: "2CY14.2/2.5D" },
    { model: "GCS350", inputSpeedRange: [600, 1800], ratios: [2.00, 2.50, 3.08, 3.50, 4.10, 4.45, 5.06, 5.55, 6.03], transferCapacity: [1.100], thrust: 110, centerDistance: 350, weight: 1650, dimensions: "930×945×955", controlType: "电液控制", price: 95000, discountRate: 3, factoryPrice: 92150, packagePrice: 93500, marketPrice: 95000, recommendedHighFlex: "HGT4020", recommendedPump: "2CY14.2/2.5D" },
    { model: "GCS390", inputSpeedRange: [600, 1700], ratios: [2.05, 2.53, 3.04, 3.52, 4.03, 4.51, 5.02, 5.54, 6.03], transferCapacity: [1.300], thrust: 140, centerDistance: 390, weight: 1950, dimensions: "975×980×990", controlType: "电液控制", price: 120000, discountRate: 3, factoryPrice: 116400, packagePrice: 118000, marketPrice: 120000, recommendedHighFlex: "HGT5020", recommendedPump: "2CY14.2/2.5D" },
    { model: "GCS430", inputSpeedRange: [600, 1700], ratios: [2.08, 2.56, 3.06, 3.54, 4.06, 4.54, 5.04, 5.56, 6.05], transferCapacity: [1.600], thrust: 170, centerDistance: 430, weight: 2250, dimensions: "1020×1015×1025", controlType: "电液控制", price: 145000, discountRate: 3, factoryPrice: 140650, packagePrice: 143000, marketPrice: 145000, recommendedHighFlex: "HGT6320", recommendedPump: "2CY19.2/2.5D" },
    { model: "GCS470", inputSpeedRange: [600, 1700], ratios: [2.10, 2.58, 3.08, 3.56, 4.08, 4.56, 5.06, 5.58, 6.06], transferCapacity: [1.900], thrust: 200, centerDistance: 470, weight: 2550, dimensions: "1065×1050×1060", controlType: "电液控制", price: 170000, discountRate: 3, factoryPrice: 164900, packagePrice: 168000, marketPrice: 170000, recommendedHighFlex: "HGT8020", recommendedPump: "2CY19.2/2.5D" },
    { model: "GCS520", inputSpeedRange: [600, 1700], ratios: [2.12, 2.60, 3.10, 3.58, 4.10, 4.58, 5.08, 5.60, 6.08], transferCapacity: [2.200], thrust: 240, centerDistance: 520, weight: 2850, dimensions: "1110×1085×1095", controlType: "电液控制", price: 195000, discountRate: 3, factoryPrice: 189150, packagePrice: 192000, marketPrice: 195000, recommendedHighFlex: "HGT10020", recommendedPump: "2CY24.8/2.5D" },
    { model: "GCS570", inputSpeedRange: [600, 1700], ratios: [2.14, 2.62, 3.12, 3.60, 4.12, 4.60, 5.10, 5.62, 6.10], transferCapacity: [2.500], thrust: 280, centerDistance: 570, weight: 3150, dimensions: "1155×1120×1130", controlType: "电液控制", price: 220000, discountRate: 3, factoryPrice: 213400, packagePrice: 217000, marketPrice: 220000, recommendedHighFlex: "HGT12520", recommendedPump: "2CY24.8/2.5D" }
  ],

  // 高弹性联轴器数据
  flexibleCouplings: [
    { model: "HGT1020", torque: 10, weight: 280, price: 11000, discountRate: 5, factoryPrice: 10450 },
    { model: "HGT1220", torque: 12.5, weight: 340, price: 13000, discountRate: 8, factoryPrice: 11960 },
    { model: "HGT1620", torque: 16, weight: 400, price: 15400, discountRate: 7, factoryPrice: 14322 },
    { model: "HGT2020", torque: 20, weight: 480, price: 18500, discountRate: 5, factoryPrice: 17575 },
    { model: "HGT2520", torque: 25, weight: 540, price: 22000, discountRate: 5, factoryPrice: 20900 },
    { model: "HGT3020", torque: 31.5, weight: 600, price: 25000, discountRate: 6, factoryPrice: 23500 },
    { model: "HGT4020", torque: 40, weight: 720, price: 29500, discountRate: 5, factoryPrice: 28025 },
    { model: "HGT5020", torque: 50, weight: 900, price: 37400, discountRate: 4, factoryPrice: 35904 },
    { model: "HGT6320", torque: 0.063, weight: 1100, price: 47000, discountRate: 4, factoryPrice: 45120 },
    { model: "HGT8020", torque: 80, weight: 1350, price: 58000, discountRate: 4, factoryPrice: 55680 },
    { model: "HGT10020", torque: 100, weight: 1650, price: 71500, discountRate: 5, factoryPrice: 67925 },
    { model: "HGT12520", torque: 125, weight: 2000, price: 85800, discountRate: 5, factoryPrice: 81510 },
    { model: "HGT16020", torque: 160, weight: 2400, price: 118000, discountRate: 5, factoryPrice: 112100 },
    { model: "HGT20020", torque: 200, weight: 2850, price: 154000, discountRate: 5, factoryPrice: 146300 },
    { model: "HGT25020", torque: 250, weight: 3300, price: 195000, discountRate: 5, factoryPrice: 185250 },
    { model: "HGT31520", torque: 315, weight: 4000, price: 264000, discountRate: 6, factoryPrice: 248160 },
    { model: "HGT40020", torque: 400, weight: 6700, price: 350000, discountRate: 6, factoryPrice: 329000 },
    { model: "HGT50020", torque: 500, weight: 6700, price: 390000, discountRate: 8, factoryPrice: 358800 },
    // 添加缺失的HGTH系列(为HCQ和HCM系列配套)
    { model: "HGTHB1", torque: 1, weight: 85, price: 5800, discountRate: 5, factoryPrice: 5510 },
    { model: "HGTHB1.6", torque: 1.6, weight: 120, price: 6500, discountRate: 5, factoryPrice: 6175 },
    { model: "HGTHB2.5", torque: 2.5, weight: 160, price: 8200, discountRate: 5, factoryPrice: 7790 },
    { model: "HGTHB4", torque: 4, weight: 210, price: 9500, discountRate: 5, factoryPrice: 9025 },
    { model: "HGTHB6.3", torque: 6.3, weight: 260, price: 12000, discountRate: 5, factoryPrice: 11400 }
  ],

  // 备用泵数据
  standbyPumps: [
    { model: "2CY7.5/2.5D", flow: 7.5, pressure: 2.5, motorPower: 5.5, price: 6500, discountRate: 10, factoryPrice: 5850 },
    { model: "2CY14.2/2.5D", flow: 14.2, pressure: 2.5, motorPower: 11, price: 9800, discountRate: 10, factoryPrice: 8820 },
    { model: "2CY19.2/2.5D", flow: 19.2, pressure: 2.5, motorPower: 15, price: 12500, discountRate: 10, factoryPrice: 11250 },
    { model: "2CY24.8/2.5D", flow: 24.8, pressure: 2.5, motorPower: 22, price: 15800, discountRate: 10, factoryPrice: 14220 }
  ],

  // 齿轮箱与高弹性联轴器匹配关系
  gearboxCouplingMatches: {
    "40A": ["HGT1020"],
    "120C": ["HGT1620"],
    "120B": ["HGT1620"],
    "MB170": ["HGT2020"],
    "MB242": ["HGT2020"],
    "MB270A": ["HGT2520"],
    "135": ["HGT2520"],
    "135A": ["HGT2520"],
    "HC138": ["HGT3020"],
    "HCD138": ["HGT3020"],
    "300": ["HGT3020"],
    "J300": ["HGT3020"],
    "HC300": ["HGT3020"],
    "D300A": ["HGT4020"],
    "T300": ["HGT5020"],
    "HC400": ["HGT3020", "HGT4020"],
    "HCD400A": ["HGT3020", "HGT4020"],
    "HCT400A": ["HGT5020"],
    "HC600A": ["HGT5020", "HGT6320"],
    "HCD600A": ["HGT5020", "HGT6320"],
    "HCT600A": ["HGT6320"],
    "HCD800": ["HGT8020", "HGT10020"],
    "HCT800": ["HGT8020", "HGT10020"],
    "HCT800/1": ["HGT10020", "HGT12520"],
    "HC1000": ["HGT10020"],
    "HCD1000": ["HGT10020"],
    "HC1200": ["HGT12520"],
    "HCT1200": ["HGT12520"],
    "HCD1400": ["HGT12520", "HGT16020"],
    "HCT1400": ["HGT16020"],
    "HC1600": ["HGT16020"],
    "HCD1600": ["HGT16020"],
    "HC2000": ["HGT20020"],
    "HCD2000": ["HGT20020"],
    "HCT2000": ["HGT25020"],
    // 添加HCQ系列匹配
    "HCQ038A": ["HGTHB1"],
    "HCQ65": ["HGTHB1.6"],
    "HCV120": ["HGTHB2.5"],
    // 添加GCS系列匹配
    "GCS320": ["HGT3020IIID"],
    "GCS350": ["HGT4020IIID"],
    "GCS390": ["HGT5020IIID"]
  }
};