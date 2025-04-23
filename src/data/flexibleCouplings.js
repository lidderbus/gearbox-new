
// src/data/flexibleCouplings.js
// 高弹性联轴器数据库
// 根据验证结果修正了 torque 单位和 maxTorque 缺失的问题 (2024-07-29)
// Added price fields consistent with embeddedData (basePrice, discountRate, factoryPrice, packagePrice, marketPrice)

export const flexibleCouplings = [
  // HGTHT系列 - 适用于300-800系列齿轮箱
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
    notes: "适用于600系列齿轮箱"
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
    notes: "适用于1000系列齿轮箱"
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
    notes: "适用于1400系列齿轮箱"
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
    notes: "适用于1600系列齿轮箱"
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
    notes: "适用于2000系列齿轮箱"
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

];

// 默认导出
export default flexibleCouplings;
