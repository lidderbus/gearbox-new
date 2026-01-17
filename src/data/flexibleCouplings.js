
// src/data/flexibleCouplings.js
// 高弹性联轴器数据库
// 根据验证结果修正了 torque 单位和 maxTorque 缺失的问题 (2024-07-29)
// Added price fields consistent with embeddedData (basePrice, discountRate, factoryPrice, packagePrice, marketPrice)
// 2025-12-13: 从高弹选型系统(coupling-selection-enhanced.html)融合新增型号，扩展至74个型号

export const flexibleCouplings = [
  // ========== HGTH系列 - 基础型 ==========
  {
    model: "HGTH2",
    torque: 2.0,
    maxTorque: 5.0,
    maxSpeed: 3000,
    weight: 25,
    price: 6000,
    basePrice: 6000,
    discountRate: 0.10,
    factoryPrice: 5400,
    packagePrice: 5400,
    marketPrice: 6136.36,
    notes: "基础型，适用于小功率齿轮箱"
  },

  // ========== HGTL系列 - 中小功率型 ==========
  {
    model: "HGTL1.8A",
    torque: 1.8,
    maxTorque: 4.5,
    maxSpeed: 3200,
    weight: 20,
    price: 5000,
    basePrice: 5000,
    discountRate: 0.10,
    factoryPrice: 4500,
    packagePrice: 4500,
    marketPrice: 5113.64,
    notes: "HGTL系列，中小功率型"
  },
  {
    model: "HGTL1.8B",
    torque: 1.8,
    maxTorque: 4.5,
    maxSpeed: 3200,
    weight: 22,
    price: 5200,
    basePrice: 5200,
    discountRate: 0.10,
    factoryPrice: 4680,
    packagePrice: 4680,
    marketPrice: 5318.18,
    notes: "HGTL系列，B型"
  },
  {
    model: "HGTL2.2",
    torque: 2.2,
    maxTorque: 5.5,
    maxSpeed: 3000,
    weight: 26,
    price: 6200,
    basePrice: 6200,
    discountRate: 0.10,
    factoryPrice: 5580,
    packagePrice: 5580,
    marketPrice: 6340.91,
    notes: "HGTL系列"
  },
  {
    model: "HGTL2.2A",
    torque: 2.2,
    maxTorque: 5.5,
    maxSpeed: 3000,
    weight: 28,
    price: 6500,
    basePrice: 6500,
    discountRate: 0.10,
    factoryPrice: 5850,
    packagePrice: 5850,
    marketPrice: 6647.73,
    notes: "HGTL系列，A型"
  },
  {
    model: "HGTL3.5Q",
    torque: 3.5,
    maxTorque: 8.75,
    maxSpeed: 2800,
    weight: 38,
    price: 9500,
    basePrice: 9500,
    discountRate: 0.10,
    factoryPrice: 8550,
    packagePrice: 8550,
    marketPrice: 9715.91,
    notes: "HGTL系列，Q型"
  },
  {
    model: "HGTL7.5Q",
    torque: 7.5,
    maxTorque: 18.75,
    maxSpeed: 2400,
    weight: 72,
    price: 19000,
    basePrice: 19000,
    discountRate: 0.10,
    factoryPrice: 17100,
    packagePrice: 17100,
    marketPrice: 19431.82,
    notes: "HGTL系列，Q型大功率"
  },

  // ========== HGTLX系列 - 带过载保护 ==========
  {
    model: "HGTLX8.6",
    torque: 8.6,
    maxTorque: 21.5,
    maxSpeed: 2000,
    weight: 150,
    price: 28000,
    basePrice: 28000,
    discountRate: 0.10,
    factoryPrice: 25200,
    packagePrice: 25200,
    marketPrice: 28636.36,
    notes: "HGTLX系列，带过载保护限位装置"
  },

  // ========== HGTHT系列 - 适用于300-800系列齿轮箱 ==========
  {
    model: "HGTHT4",
    torque: 4.0,        // 额定扭矩 (kN·m) - Corrected from 0.004
    maxTorque: 10.0,      // 最大扭矩 (kN·m) - Corrected from 0.01
    maxSpeed: 2400,       // 最高转速 (rpm)
    weight: 90,           // 重量 (kg)
    price: 16500,         // 原始价格 (元)
    basePrice: 16500,     // Added basePrice
    discountRate: 0.10,   // Default for accessories
    factoryPrice: 14850,  // Calculated
    packagePrice: 14850,  // Default
    marketPrice: 16875,   // Calculated
    notes: "适用于300系列齿轮箱"
  },
  {
    model: "HGTHT4.5",
    torque: 4.5,        // Corrected
    maxTorque: 12.0,      // Corrected
    maxSpeed: 2400,
    weight: 95,
    price: 17800,
    basePrice: 17800,
    discountRate: 0.10,
    factoryPrice: 16020,
    packagePrice: 16020,
    marketPrice: 18204.55,
    notes: "适用于400系列齿轮箱"
  },
  {
    model: "HGTHT5",
    torque: 5.0,        // Corrected
    maxTorque: 12.5,      // Corrected
    maxSpeed: 2400,
    weight: 100,
    price: 18500,
    basePrice: 18500,
    discountRate: 0.10,
    factoryPrice: 16650,
    packagePrice: 16650,
    marketPrice: 18920.45,
    notes: "适用于HCT400/HCT400A齿轮箱"
  },
  {
    model: "HGTHT6.3",
    torque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 2400,
    weight: 65,
    price: 17500,
    basePrice: 17500,
    discountRate: 0.10,
    factoryPrice: 15750,
    packagePrice: 15750,
    marketPrice: 17897.73,
    notes: "适用于600系列齿轮箱"
  },
  {
    model: "HGTHT6.3A",
    torque: 6.3,        // Corrected
    maxTorque: 18.0,      // Corrected
    maxSpeed: 2400,
    weight: 135,
    price: 24000,
    basePrice: 24000,
    discountRate: 0.10,
    factoryPrice: 21600,
    packagePrice: 21600,
    marketPrice: 24545.45,
    notes: "适用于600系列齿轮箱，A型加强"
  },
  {
    model: "HGTHT8.6",
    torque: 8.6,        // Corrected
    maxTorque: 21.5,      // Corrected
    maxSpeed: 2000,
    weight: 180,
    price: 32000,
    basePrice: 32000,
    discountRate: 0.10,
    factoryPrice: 28800,
    packagePrice: 28800,
    marketPrice: 32727.27,
    notes: "适用于800系列齿轮箱"
  },

  // HGTHB系列 - 适用于1000-2700系列齿轮箱
   {
    model: "HGTHB3.2", // Added based on matching map entry
    torque: 3.2,
    maxTorque: 8.0,
    maxSpeed: 3000,
    weight: 100, // Estimated weight
    price: 18000, // Estimated price
    basePrice: 18000,
    discountRate: 0.10,
    factoryPrice: 16200,
    packagePrice: 16200,
    marketPrice: 18409.09,
    notes: "适用于HCM70/160等系列齿轮箱"
   },
  {
    model: "HGTHB5",
    torque: 5.0,        // Corrected
    maxTorque: 12.5,      // Corrected
    maxSpeed: 3000,
    weight: 130,
    price: 22000,
    basePrice: 22000,
    discountRate: 0.10,
    factoryPrice: 19800,
    packagePrice: 19800,
    marketPrice: 22500.00,
    hasCover: false,
    coverModel: "HGTHJB5",
    notes: "适用于1000系列齿轮箱"
  },
  {
    model: "HGTHB5A",
    torque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 3000,
    weight: 52,
    price: 14500,
    basePrice: 14500,
    discountRate: 0.10,
    factoryPrice: 13050,
    packagePrice: 13050,
    marketPrice: 14829.55,
    notes: "适用于1000系列齿轮箱，A型轻量化"
  },
  {
    model: "HGTHB6.3A",
    torque: 6.3,        // Corrected
    maxTorque: 15.75,     // Corrected
    maxSpeed: 3000,
    weight: 160,
    price: 25000,
    basePrice: 25000,
    discountRate: 0.10,
    factoryPrice: 22500,
    packagePrice: 22500,
    marketPrice: 25568.18,
    hasCover: false,
    coverModel: "HGTHJB6.3A",
    notes: "适用于1200系列齿轮箱(选配)"
  },
   {
    model: "HGTHB6.3", // Added if this is a separate model from 6.3A
    torque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 3000,
    weight: 155, // Slightly different weight?
    price: 24500, // Slightly different price?
    basePrice: 24500,
    discountRate: 0.10,
    factoryPrice: 22050,
    packagePrice: 22050,
    marketPrice: 25056.82,
    hasCover: false,
    coverModel: "HGTHJB6.3",
    notes: "适用于HCM435等系列齿轮箱"
   },
  {
    model: "HGTHB8",
    torque: 8.0,        // Corrected
    maxTorque: 20.0,      // Corrected
    maxSpeed: 2800,
    weight: 200,
    price: 29500,
    basePrice: 29500,
    discountRate: 0.10,
    factoryPrice: 26550,
    packagePrice: 26550,
    marketPrice: 30170.45,
    hasCover: false,
    coverModel: "HGTHJB8",
    notes: "适用于1400系列齿轮箱"
  },
  {
    model: "HGTHB8A",
    torque: 8.0,
    maxTorque: 20.0,
    maxSpeed: 2800,
    weight: 78,
    price: 21500,
    basePrice: 21500,
    discountRate: 0.10,
    factoryPrice: 19350,
    packagePrice: 19350,
    marketPrice: 21988.64,
    notes: "适用于1400系列齿轮箱，A型轻量化"
  },
  {
    model: "HGTHB10",
    torque: 10.0,       // Corrected
    maxTorque: 25.0,      // Corrected
    maxSpeed: 2500,
    weight: 240,
    price: 37400,
    basePrice: 37400,
    discountRate: 0.10,
    factoryPrice: 33660,
    packagePrice: 33660,
    marketPrice: 38250.00,
    hasCover: false,
    coverModel: "HGTHJB10",
    notes: "适用于1600系列齿轮箱"
  },
  {
    model: "HGTHB10A",
    torque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 2500,
    weight: 98,
    price: 26500,
    basePrice: 26500,
    discountRate: 0.10,
    factoryPrice: 23850,
    packagePrice: 23850,
    marketPrice: 27102.27,
    notes: "适用于1600系列齿轮箱，A型轻量化"
  },
  {
    model: "HGTHB12.5",
    torque: 12.5,       // Corrected
    maxTorque: 31.25,     // Corrected
    maxSpeed: 2200,
    weight: 300,
    price: 47000,
    basePrice: 47000,
    discountRate: 0.10,
    factoryPrice: 42300,
    packagePrice: 42300,
    marketPrice: 48068.18,
    hasCover: false,
    coverModel: "HGTHJB12.5",
    notes: "适用于2000系列齿轮箱"
  },
  {
    model: "HGTHB12.5A",
    torque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 2200,
    weight: 118,
    price: 32500,
    basePrice: 32500,
    discountRate: 0.10,
    factoryPrice: 29250,
    packagePrice: 29250,
    marketPrice: 33238.64,
    notes: "适用于2000系列齿轮箱，A型轻量化"
  },
  {
    model: "HGTHB16",
    torque: 16.0,       // Corrected
    maxTorque: 40.0,      // Corrected
    maxSpeed: 2000,
    weight: 380,
    price: 58000,
    basePrice: 58000,
    discountRate: 0.10,
    factoryPrice: 52200,
    packagePrice: 52200,
    marketPrice: 59318.18,
    hasCover: false,
    coverModel: "HGTHJB16",
    notes: "适用于2700系列齿轮箱"
  },
   { // Added missing HGTHB20 based on matching map entry
    model: "HGTHB20",
    torque: 20.0,
    maxTorque: 50.0,
    maxSpeed: 1800,
    weight: 450, // Estimated
    price: 68000, // Estimated
    basePrice: 68000,
    discountRate: 0.10,
    factoryPrice: 61200,
    packagePrice: 61200,
    marketPrice: 69545.45,
    notes: ""
   },
   { // Added missing HGTHB25 based on matching map entry
    model: "HGTHB25",
    torque: 25.0,
    maxTorque: 62.5,
    maxSpeed: 1600,
    weight: 550, // Estimated
    price: 80000, // Estimated
    basePrice: 80000,
    discountRate: 0.10,
    factoryPrice: 72000,
    packagePrice: 72000,
    marketPrice: 81818.18,
    notes: ""
   },


  // HGTHJB系列 - 带罩壳的联轴器 (Specs should match base models)
  {
    model: "HGTHJB5", // Covered version of HGTHB5
    torque: 5.0,        // Corrected (matches base)
    maxTorque: 12.5,      // Corrected (matches base)
    maxSpeed: 3000,       // (matches base)
    weight: 160,          // Heavier due to cover
    price: 25000,         // Higher price due to cover
    basePrice: 25000,
    discountRate: 0.10,
    factoryPrice: 22500,
    packagePrice: 22500,
    marketPrice: 25568.18,
    hasCover: true,
    baseModel: "HGTHB5",
    notes: "带罩壳，适用于1000系列齿轮箱"
  },
   { // Added covered version of HGTHB6.3 if separate
    model: "HGTHJB6.3",
    torque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 3000,
    weight: 185, // Heavier
    price: 28000, // Higher
    basePrice: 28000,
    discountRate: 0.10,
    factoryPrice: 25200,
    packagePrice: 25200,
    marketPrice: 28636.36,
    hasCover: true,
    baseModel: "HGTHB6.3",
    notes: "带罩壳，适用于HCM435等系列齿轮箱"
   },
  {
    model: "HGTHJB6.3A", // Covered version of HGTHB6.3A
    torque: 6.3,        // Corrected (matches base)
    maxTorque: 15.75,     // Corrected (matches base)
    maxSpeed: 3000,       // (matches base)
    weight: 190,          // Heavier due to cover
    price: 28500,         // Higher price due to cover
    basePrice: 28500,
    discountRate: 0.10,
    factoryPrice: 25650,
    packagePrice: 25650,
    marketPrice: 29147.73,
    hasCover: true,
    baseModel: "HGTHB6.3A",
    notes: "带罩壳，适用于1200系列齿轮箱"
  },
   { // Added covered version of HGTHB8
    model: "HGTHJB8",
    torque: 8.0,
    maxTorque: 20.0,
    maxSpeed: 2800,
    weight: 230,
    price: 34000,
    basePrice: 34000,
    discountRate: 0.10,
    factoryPrice: 30600,
    packagePrice: 30600,
    marketPrice: 34772.73,
    hasCover: true,
    baseModel: "HGTHB8",
    notes: "带罩壳"
   },
   { // Added covered version of HGTHB10
    model: "HGTHJB10",
    torque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 2500,
    weight: 280,
    price: 43000,
    basePrice: 43000,
    discountRate: 0.10,
    factoryPrice: 38700,
    packagePrice: 38700,
    marketPrice: 44000.00,
    hasCover: true,
    baseModel: "HGTHB10",
    notes: "带罩壳"
   },
   { // Added covered version of HGTHB12.5
    model: "HGTHJB12.5",
    torque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 2200,
    weight: 350,
    price: 54000,
    basePrice: 54000,
    discountRate: 0.10,
    factoryPrice: 48600,
    packagePrice: 48600,
    marketPrice: 55227.27,
    hasCover: true,
    baseModel: "HGTHB12.5",
    notes: "带罩壳"
   },
   { // Added covered version of HGTHB16
    model: "HGTHJB16",
    torque: 16.0,
    maxTorque: 40.0,
    maxSpeed: 2000,
    weight: 440,
    price: 67000,
    basePrice: 67000,
    discountRate: 0.10,
    factoryPrice: 60300,
    packagePrice: 60300,
    marketPrice: 68522.73,
    hasCover: true,
    baseModel: "HGTHB16",
    notes: "带罩壳"
   },


  // 特殊型号
  {
    model: "HGHQT1210IW", // This model's torque was 0 in the original data
    torque: 12.0, // Corrected based on model number and matching map
    maxTorque: 30.0, // Corrected based on typical 2.5x ratio
    maxSpeed: 1800,
    weight: 320,
    price: 52000,
    basePrice: 52000,
    discountRate: 0.10,
    factoryPrice: 46800,
    packagePrice: 46800,
    marketPrice: 53181.82,
    notes: "适用于1100-1200系列齿轮箱"
  },
   { // Added missing HGTQ1215 based on matching map entry
    model: "HGTQ1215",
    torque: 12.15,
    maxTorque: 30.375,
    maxSpeed: 1500,
    weight: 350, // Estimated
    price: 55000, // Estimated
    basePrice: 55000,
    discountRate: 0.10,
    factoryPrice: 49500,
    packagePrice: 49500,
    marketPrice: 56250.00,
    notes: ""
   },
  {
    model: "HGT3020", // This model had torque 0.0315 in original data, corrected
    torque: 31.5,
    maxTorque: 78.75, // Corrected based on typical 2.5x ratio
    maxSpeed: 1800,
    weight: 600,
    price: 85000,
    basePrice: 85000,
    discountRate: 0.10,
    factoryPrice: 76500,
    packagePrice: 76500,
    marketPrice: 86931.82,
    notes: "适用于T2700齿轮箱"
  },

  // HGT系列 - 标准通用型 (Corrected torque and added maxTorque)
  {
    model: "HGT1020",
    torque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 3000,
    weight: 280,
    price: 29000,
    basePrice: 29000,
    discountRate: 0.10,
    factoryPrice: 26100,
    packagePrice: 26100,
    marketPrice: 29659.09,
    notes: "标准通用型"
  },
  {
    model: "HGT1220",
    torque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 2800,
    weight: 340,
    price: 33000,
    basePrice: 33000,
    discountRate: 0.10,
    factoryPrice: 29700,
    packagePrice: 29700,
    marketPrice: 33750.00,
    notes: "标准通用型"
  },
  {
    model: "HGT1620",
    torque: 16.0,
    maxTorque: 40.0,
    maxSpeed: 2600,
    weight: 400,
    price: 38000,
    basePrice: 38000,
    discountRate: 0.10,
    factoryPrice: 34200,
    packagePrice: 34200,
    marketPrice: 38863.64,
    notes: "标准通用型"
  },
  {
    model: "HGT2020",
    torque: 20.0,
    maxTorque: 50.0,
    maxSpeed: 2400,
    weight: 480,
    price: 45000,
    basePrice: 45000,
    discountRate: 0.10,
    factoryPrice: 40500,
    packagePrice: 40500,
    marketPrice: 46022.73,
    notes: "标准通用型"
  },
  {
    model: "HGT2520",
    torque: 25.0,
    maxTorque: 62.5,
    maxSpeed: 2200,
    weight: 540,
    price: 52000,
    basePrice: 52000,
    discountRate: 0.10,
    factoryPrice: 46800,
    packagePrice: 46800,
    marketPrice: 53181.82,
    notes: "标准通用型"
  },
  {
    model: "HGT3020",
    torque: 31.5,
    maxTorque: 78.75,
    maxSpeed: 2000,
    weight: 600,
    price: 65000,
    basePrice: 65000,
    discountRate: 0.10,
    factoryPrice: 58500,
    packagePrice: 58500,
    marketPrice: 66477.27,
    notes: "标准通用型"
  },
  {
    model: "HGT4020",
    torque: 40.0,
    maxTorque: 100.0,
    maxSpeed: 1800,
    weight: 720,
    price: 82000,
    basePrice: 82000,
    discountRate: 0.10,
    factoryPrice: 73800,
    packagePrice: 73800,
    marketPrice: 83863.64,
    notes: "标准通用型"
  },
  {
    model: "HGT5020",
    torque: 50.0,
    maxTorque: 125.0,
    maxSpeed: 1600,
    weight: 900,
    price: 98000,
    basePrice: 98000,
    discountRate: 0.10,
    factoryPrice: 88200,
    packagePrice: 88200,
    marketPrice: 100227.27,
    notes: "标准通用型"
  },
  {
    model: "HGT6320",
    torque: 63.0,
    maxTorque: 157.5,
    maxSpeed: 1400,
    weight: 1100,
    price: 120000,
    basePrice: 120000,
    discountRate: 0.10,
    factoryPrice: 108000,
    packagePrice: 108000,
    marketPrice: 122727.27,
    notes: "标准通用型"
  },
  {
    model: "HGT8020",
    torque: 80.0,
    maxTorque: 200.0,
    maxSpeed: 1200,
    weight: 1350,
    price: 150000,
    basePrice: 150000,
    discountRate: 0.10,
    factoryPrice: 135000,
    packagePrice: 135000,
    marketPrice: 153409.09,
    notes: "标准通用型"
  },
  {
    model: "HGT10020",
    torque: 100.0,
    maxTorque: 250.0,
    maxSpeed: 1000,
    weight: 1650,
    price: 180000,
    basePrice: 180000,
    discountRate: 0.10,
    factoryPrice: 162000,
    packagePrice: 162000,
    marketPrice: 184090.91,
    notes: "标准通用型"
  },
  {
    model: "HGT12520",
    torque: 125.0,
    maxTorque: 312.5,
    maxSpeed: 900,
    weight: 2000,
    price: 215000,
    basePrice: 215000,
    discountRate: 0.10,
    factoryPrice: 193500,
    packagePrice: 193500,
    marketPrice: 219886.36,
    notes: "标准通用型"
  },
  {
    model: "HGT16020",
    torque: 160.0,
    maxTorque: 400.0,
    maxSpeed: 800,
    weight: 2400,
    price: 260000,
    basePrice: 260000,
    discountRate: 0.10,
    factoryPrice: 234000,
    packagePrice: 234000,
    marketPrice: 265909.09,
    notes: "标准通用型"
  },
   { // Added missing HGT20020 based on matching map entry
    model: "HGT20020",
    torque: 200.0,
    maxTorque: 500.0,
    maxSpeed: 700,
    weight: 2800, // Estimated
    price: 300000, // Estimated
    basePrice: 300000,
    discountRate: 0.10,
    factoryPrice: 270000,
    packagePrice: 270000,
    marketPrice: 306818.18,
    notes: ""
   },
   { // Added missing HGT25020 based on matching map entry
    model: "HGT25020",
    torque: 250.0,
    maxTorque: 625.0,
    maxSpeed: 600,
    weight: 3300, // Estimated
    price: 350000, // Estimated
    basePrice: 350000,
    discountRate: 0.10,
    factoryPrice: 315000,
    packagePrice: 315000,
    marketPrice: 357954.55,
    notes: ""
   },

  // HGT-ZB系列 - 标准通用型 (带罩壳)
   {
    model: "HGT1020-ZB",
    torque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 3000,
    weight: 310, // Increased weight
    price: 32000, // Increased price
    basePrice: 32000,
    discountRate: 0.10,
    factoryPrice: 28800,
    packagePrice: 28800,
    marketPrice: 32727.27,
    notes: "带罩壳，标准通用型"
  },
  {
    model: "HGT1220-ZB",
    torque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 2800,
    weight: 370, // Increased weight
    price: 36000, // Increased price
    basePrice: 36000,
    discountRate: 0.10,
    factoryPrice: 32400,
    packagePrice: 32400,
    marketPrice: 36818.18,
    notes: "带罩壳，标准通用型"
  },
  {
    model: "HGT1620-ZB",
    torque: 16.0,
    maxTorque: 40.0,
    maxSpeed: 2600,
    weight: 440, // Increased weight
    price: 41000, // Increased price
    basePrice: 41000,
    discountRate: 0.10,
    factoryPrice: 36900,
    packagePrice: 36900,
    marketPrice: 41931.82,
    notes: "带罩壳，标准通用型"
  },
  {
    model: "HGT2020-ZB",
    torque: 20.0,
    maxTorque: 50.0,
    maxSpeed: 2400,
    weight: 520, // Increased weight
    price: 48000, // Increased price
    basePrice: 48000,
    discountRate: 0.10,
    factoryPrice: 43200,
    packagePrice: 43200,
    marketPrice: 49090.91,
    notes: "带罩壳，标准通用型"
  },
  {
    model: "HGT2520-ZB",
    torque: 25.0,
    maxTorque: 62.5,
    maxSpeed: 2200,
    weight: 580, // Increased weight
    price: 55000, // Increased price
    basePrice: 55000,
    discountRate: 0.10,
    factoryPrice: 49500,
    packagePrice: 49500,
    marketPrice: 56250.00,
    notes: "带罩壳，标准通用型"
  },
  {
    model: "HGT3020-ZB",
    torque: 31.5,
    maxTorque: 78.75,
    maxSpeed: 2000,
    weight: 650, // Increased weight
    price: 68000, // Increased price
    basePrice: 68000,
    discountRate: 0.10,
    factoryPrice: 61200,
    packagePrice: 61200,
    marketPrice: 69545.45,
    notes: "带罩壳，标准通用型"
  },
  {
    model: "HGT4020-ZB",
    torque: 40.0,
    maxTorque: 100.0,
    maxSpeed: 1800,
    weight: 780, // Increased weight
    price: 85000, // Increased price
    basePrice: 85000,
    discountRate: 0.10,
    factoryPrice: 76500,
    packagePrice: 76500,
    marketPrice: 86931.82,
    notes: "带罩壳，标准通用型"
  },
  // Add more HGT-ZB models based on pattern if available

  // ========== HGTQ系列 - 适用于中大马力齿轮箱 ==========
  {
    model: "HGTQ0.815",
    torque: 0.8,
    maxTorque: 2.0,
    maxSpeed: 4500,
    weight: 40,
    price: 4800,
    basePrice: 4800,
    discountRate: 0.083,
    factoryPrice: 4401.60,
    packagePrice: 4401.60,
    marketPrice: 5236.36,
    notes: "HGTQ系列，小功率型"
  },
  {
    model: "HGTQ0.815X",
    torque: 0.8,
    maxTorque: 2.0,
    maxSpeed: 4500,
    weight: 45,
    price: 6960,
    basePrice: 6960,
    discountRate: 0.083,
    factoryPrice: 6382.32,
    packagePrice: 6382.32,
    marketPrice: 7592.73,
    notes: "HGTQ系列，X型加强"
  },
  {
    model: "HGTQ1.215",
    torque: 1.2,
    maxTorque: 3.0,
    maxSpeed: 4000,
    weight: 60,
    price: 5800,
    basePrice: 5800,
    discountRate: 0.069,
    factoryPrice: 5399.80,
    packagePrice: 5399.80,
    marketPrice: 6229.09,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ1.215D",
    torque: 1.2,
    maxTorque: 3.0,
    maxSpeed: 4000,
    weight: 60,
    price: 5800,
    basePrice: 5800,
    discountRate: 0.069,
    factoryPrice: 5399.80,
    packagePrice: 5399.80,
    marketPrice: 6229.09,
    notes: "HGTQ系列，D型"
  },
  {
    model: "HGTQ2.510",
    torque: 2.5,
    maxTorque: 6.25,
    maxSpeed: 3600,
    weight: 90,
    price: 8000,
    basePrice: 8000,
    discountRate: 0.0625,
    factoryPrice: 7500,
    packagePrice: 7500,
    marketPrice: 8522.73,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ4.410",
    torque: 4.4,
    maxTorque: 11.0,
    maxSpeed: 3000,
    weight: 120,
    price: 10500,
    basePrice: 10500,
    discountRate: 0.067,
    factoryPrice: 9796.50,
    packagePrice: 9796.50,
    marketPrice: 11250.00,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ6.310",
    torque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 2600,
    weight: 160,
    price: 13000,
    basePrice: 13000,
    discountRate: 0.077,
    factoryPrice: 11999,
    packagePrice: 11999,
    marketPrice: 14090.91,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ6.310B",
    torque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 2600,
    weight: 185,
    price: 15000,
    basePrice: 15000,
    discountRate: 0.067,
    factoryPrice: 13995,
    packagePrice: 13995,
    marketPrice: 16079.55,
    notes: "HGTQ系列，B型"
  },
  {
    model: "HGTQ8.210",
    torque: 8.2,
    maxTorque: 20.5,
    maxSpeed: 2200,
    weight: 200,
    price: 16500,
    basePrice: 16500,
    discountRate: 0.079,
    factoryPrice: 15196.50,
    packagePrice: 15196.50,
    marketPrice: 17897.73,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ10.010",
    torque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 2000,
    weight: 240,
    price: 19500,
    basePrice: 19500,
    discountRate: 0.077,
    factoryPrice: 17998.50,
    packagePrice: 17998.50,
    marketPrice: 21136.36,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ12.510",
    torque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 1800,
    weight: 280,
    price: 25000,
    basePrice: 25000,
    discountRate: 0.060,
    factoryPrice: 23500,
    packagePrice: 23500,
    marketPrice: 26590.91,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ16.10",
    torque: 16.0,
    maxTorque: 40.0,
    maxSpeed: 1600,
    weight: 320,
    price: 29500,
    basePrice: 29500,
    discountRate: 0.051,
    factoryPrice: 27995.50,
    packagePrice: 27995.50,
    marketPrice: 31079.55,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ20.15",
    torque: 20.0,
    maxTorque: 50.0,
    maxSpeed: 1500,
    weight: 380,
    price: 38500,
    basePrice: 38500,
    discountRate: 0.065,
    factoryPrice: 35997.50,
    packagePrice: 35997.50,
    marketPrice: 41193.18,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ25.20",
    torque: 25.0,
    maxTorque: 62.5,
    maxSpeed: 1300,
    weight: 480,
    price: 47000,
    basePrice: 47000,
    discountRate: 0.043,
    factoryPrice: 44979,
    packagePrice: 44979,
    marketPrice: 49090.91,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ25.20X",
    torque: 25.0,
    maxTorque: 62.5,
    maxSpeed: 1300,
    weight: 520,
    price: 63450,
    basePrice: 63450,
    discountRate: 0.043,
    factoryPrice: 60721.65,
    packagePrice: 60721.65,
    marketPrice: 66306.82,
    notes: "HGTQ系列，X型加强"
  },
  {
    model: "HGTQ32.20",
    torque: 32.0,
    maxTorque: 80.0,
    maxSpeed: 1100,
    weight: 620,
    price: 58000,
    basePrice: 58000,
    discountRate: 0.052,
    factoryPrice: 54984,
    packagePrice: 54984,
    marketPrice: 61193.18,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ40.20",
    torque: 40.0,
    maxTorque: 100.0,
    maxSpeed: 1000,
    weight: 780,
    price: 72000,
    basePrice: 72000,
    discountRate: 0.056,
    factoryPrice: 67968,
    packagePrice: 67968,
    marketPrice: 76306.82,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ50.20",
    torque: 50.0,
    maxTorque: 125.0,
    maxSpeed: 900,
    weight: 950,
    price: 88000,
    basePrice: 88000,
    discountRate: 0.045,
    factoryPrice: 84040,
    packagePrice: 84040,
    marketPrice: 92159.09,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ63.20",
    torque: 63.0,
    maxTorque: 157.5,
    maxSpeed: 800,
    weight: 1200,
    price: 110000,
    basePrice: 110000,
    discountRate: 0.045,
    factoryPrice: 105050,
    packagePrice: 105050,
    marketPrice: 115170.45,
    notes: "HGTQ系列"
  },
  {
    model: "HGTQ80.20",
    torque: 80.0,
    maxTorque: 200.0,
    maxSpeed: 700,
    weight: 1500,
    price: 135000,
    basePrice: 135000,
    discountRate: 0.052,
    factoryPrice: 127980,
    packagePrice: 127980,
    marketPrice: 142500.00,
    notes: "HGTQ系列，大功率型"
  },

];

// 默认导出
export default flexibleCouplings;
