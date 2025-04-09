// src/data/flexibleCouplings.js
// 高弹性联轴器数据库

export const flexibleCouplings = [
  // HGTHT系列 - 适用于300-800系列齿轮箱
  {
    model: "HGTHT4",
    torque: 4.0,        // 额定扭矩 (kN·m)
    maxTorque: 10.0,    // 最大扭矩 (kN·m)
    maxSpeed: 2400,     // 最高转速 (rpm)
    weight: 90,         // 重量 (kg)
    price: 16500,       // 价格 (元)
    notes: "适用于300系列齿轮箱"
  },
  {
    model: "HGTHT4.5",
    torque: 4.5,
    maxTorque: 12.0,
    maxSpeed: 2400,
    weight: 95,
    price: 17800,
    notes: "适用于400系列齿轮箱"
  },
  {
    model: "HGTHT5",
    torque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 2400,
    weight: 100,
    price: 18500,
    notes: "适用于HCT400/HCT400A齿轮箱"
  },
  {
    model: "HGTHT6.3A",
    torque: 6.3,
    maxTorque: 18.0,
    maxSpeed: 2400,
    weight: 135,
    price: 24000,
    notes: "适用于600系列齿轮箱"
  },
  {
    model: "HGTHT8.6",
    torque: 8.6,
    maxTorque: 21.5,
    maxSpeed: 2000,
    weight: 180,
    price: 32000,
    notes: "适用于800系列齿轮箱"
  },
  
  // HGTHB系列 - 适用于1000-2700系列齿轮箱
  {
    model: "HGTHB5",
    torque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 3000,
    weight: 130,
    price: 22000,
    notes: "适用于1000系列齿轮箱"
  },
  {
    model: "HGTHB6.3A",
    torque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 3000,
    weight: 160,
    price: 25000,
    notes: "适用于1200系列齿轮箱(选配)"
  },
  {
    model: "HGTHB8",
    torque: 8.0,
    maxTorque: 20.0,
    maxSpeed: 2800,
    weight: 200,
    price: 29500,
    notes: "适用于1400系列齿轮箱"
  },
  {
    model: "HGTHB10",
    torque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 2500,
    weight: 240,
    price: 37400,
    notes: "适用于1600系列齿轮箱"
  },
  {
    model: "HGTHB12.5",
    torque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 2200,
    weight: 300,
    price: 47000,
    notes: "适用于2000系列齿轮箱"
  },
  {
    model: "HGTHB16",
    torque: 16.0,
    maxTorque: 40.0,
    maxSpeed: 2000,
    weight: 380,
    price: 58000,
    notes: "适用于2700系列齿轮箱"
  },
  
  // HGTHJB系列 - 带罩壳的联轴器
  {
    model: "HGTHJB5",
    torque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 3000,
    weight: 160,
    price: 25000,
    notes: "带罩壳，适用于1000系列齿轮箱"
  },
  {
    model: "HGTHJB6.3A",
    torque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 3000,
    weight: 190,
    price: 28500,
    notes: "带罩壳，适用于1200系列齿轮箱"
  },
  
  // 特殊型号
  {
    model: "HGHQT1210IW",
    torque: 12.0,
    maxTorque: 30.0,
    maxSpeed: 1800,
    weight: 320,
    price: 52000,
    notes: "适用于1100-1200系列齿轮箱"
  },
  {
    model: "HGT3020",
    torque: 31.5,
    maxTorque: 78.75,
    maxSpeed: 1800,
    weight: 600,
    price: 85000,
    notes: "适用于T2700齿轮箱"
  },
  
  // HGT系列 - 标准通用型
  {
    model: "HGT1020",
    torque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 3000,
    weight: 280,
    price: 29000,
    notes: "标准通用型"
  },
  {
    model: "HGT1220",
    torque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 2800,
    weight: 340,
    price: 33000,
    notes: "标准通用型"
  },
  {
    model: "HGT1620",
    torque: 16.0,
    maxTorque: 40.0,
    maxSpeed: 2600,
    weight: 400,
    price: 38000,
    notes: "标准通用型"
  },
  {
    model: "HGT2020",
    torque: 20.0,
    maxTorque: 50.0,
    maxSpeed: 2400,
    weight: 480,
    price: 45000,
    notes: "标准通用型"
  },
  {
    model: "HGT2520",
    torque: 25.0,
    maxTorque: 62.5,
    maxSpeed: 2200,
    weight: 540,
    price: 52000,
    notes: "标准通用型"
  },
  {
    model: "HGT3020",
    torque: 31.5,
    maxTorque: 78.75,
    maxSpeed: 2000,
    weight: 600,
    price: 65000,
    notes: "标准通用型"
  },
  {
    model: "HGT4020",
    torque: 40.0,
    maxTorque: 100.0,
    maxSpeed: 1800,
    weight: 720,
    price: 82000,
    notes: "标准通用型"
  },
  {
    model: "HGT5020",
    torque: 50.0,
    maxTorque: 125.0,
    maxSpeed: 1600,
    weight: 900,
    price: 98000,
    notes: "标准通用型"
  },
  {
    model: "HGT6320",
    torque: 63.0,
    maxTorque: 157.5,
    maxSpeed: 1400,
    weight: 1100,
    price: 120000,
    notes: "标准通用型"
  },
  {
    model: "HGT8020",
    torque: 80.0,
    maxTorque: 200.0,
    maxSpeed: 1200,
    weight: 1350,
    price: 150000,
    notes: "标准通用型"
  },
  {
    model: "HGT10020",
    torque: 100.0,
    maxTorque: 250.0,
    maxSpeed: 1000,
    weight: 1650,
    price: 180000,
    notes: "标准通用型"
  },
  {
    model: "HGT12520",
    torque: 125.0,
    maxTorque: 312.5,
    maxSpeed: 900,
    weight: 2000,
    price: 215000,
    notes: "标准通用型"
  },
  {
    model: "HGT16020",
    torque: 160.0,
    maxTorque: 400.0,
    maxSpeed: 800,
    weight: 2400,
    price: 260000,
    notes: "标准通用型"
  }
];

// 默认导出
export default flexibleCouplings;

