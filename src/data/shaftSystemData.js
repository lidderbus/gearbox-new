// src/data/shaftSystemData.js
// 轴系配件数据
// 包含中间轴、尾轴、轴承、密封等

/**
 * 轴系配件类型:
 * - 中间轴承 (Intermediate Bearing)
 * - 推力轴承 (Thrust Bearing)
 * - 尾轴密封 (Stern Tube Seal)
 * - 轴系联轴器 (Shaft Coupling)
 * - 法兰 (Flange)
 */

export const intermediateBearings = [
  // === 滚动轴承式中间轴承 ===
  {
    model: "IB-80",
    type: "roller",
    description: "滚动轴承式中间轴承",
    shaftDiameterRange: [60, 80], // mm
    maxLoad: 25, // kN
    maxSpeed: 2500, // rpm
    lubrication: "油润滑",
    material: "铸钢座+进口轴承",
    weight: 45,
    basePrice: 8500,
    discountRate: 0.15,
    factoryPrice: 7225,
    marketPrice: 9350
  },
  {
    model: "IB-120",
    type: "roller",
    description: "滚动轴承式中间轴承",
    shaftDiameterRange: [80, 120],
    maxLoad: 45,
    maxSpeed: 2200,
    lubrication: "油润滑",
    material: "铸钢座+进口轴承",
    weight: 85,
    basePrice: 15000,
    discountRate: 0.15,
    factoryPrice: 12750,
    marketPrice: 16500
  },
  {
    model: "IB-160",
    type: "roller",
    description: "滚动轴承式中间轴承",
    shaftDiameterRange: [120, 160],
    maxLoad: 80,
    maxSpeed: 1800,
    lubrication: "油润滑",
    material: "铸钢座+进口轴承",
    weight: 150,
    basePrice: 25000,
    discountRate: 0.12,
    factoryPrice: 22000,
    marketPrice: 27500
  },
  {
    model: "IB-200",
    type: "roller",
    description: "滚动轴承式中间轴承",
    shaftDiameterRange: [160, 200],
    maxLoad: 120,
    maxSpeed: 1500,
    lubrication: "油润滑",
    material: "铸钢座+进口轴承",
    weight: 250,
    basePrice: 38000,
    discountRate: 0.12,
    factoryPrice: 33440,
    marketPrice: 41800
  },
  {
    model: "IB-260",
    type: "roller",
    description: "滚动轴承式中间轴承，大轴径",
    shaftDiameterRange: [200, 260],
    maxLoad: 180,
    maxSpeed: 1200,
    lubrication: "油润滑",
    material: "铸钢座+进口轴承",
    weight: 380,
    basePrice: 55000,
    discountRate: 0.10,
    factoryPrice: 49500,
    marketPrice: 60500
  },

  // === 滑动轴承式中间轴承 ===
  {
    model: "IBS-120",
    type: "sliding",
    description: "滑动轴承式中间轴承",
    shaftDiameterRange: [80, 120],
    maxLoad: 60,
    maxSpeed: 1800,
    lubrication: "压力油润滑",
    material: "铸钢座+白合金衬",
    weight: 95,
    basePrice: 22000,
    discountRate: 0.15,
    factoryPrice: 18700,
    marketPrice: 24200
  },
  {
    model: "IBS-180",
    type: "sliding",
    description: "滑动轴承式中间轴承",
    shaftDiameterRange: [140, 180],
    maxLoad: 100,
    maxSpeed: 1500,
    lubrication: "压力油润滑",
    material: "铸钢座+白合金衬",
    weight: 180,
    basePrice: 35000,
    discountRate: 0.12,
    factoryPrice: 30800,
    marketPrice: 38500
  },
  {
    model: "IBS-250",
    type: "sliding",
    description: "滑动轴承式中间轴承，重载型",
    shaftDiameterRange: [200, 250],
    maxLoad: 200,
    maxSpeed: 1000,
    lubrication: "压力油润滑",
    material: "铸钢座+白合金衬",
    weight: 420,
    basePrice: 68000,
    discountRate: 0.10,
    factoryPrice: 61200,
    marketPrice: 74800
  }
];

export const thrustBearings = [
  // === 推力轴承 (齿轮箱内置时通常不单独配置) ===
  {
    model: "TB-50",
    type: "tilting-pad",
    description: "可倾瓦推力轴承",
    thrustRange: [20, 50], // kN
    shaftDiameterRange: [60, 100],
    maxSpeed: 2500,
    lubrication: "压力油润滑",
    padCount: 6,
    weight: 85,
    basePrice: 35000,
    discountRate: 0.12,
    factoryPrice: 30800,
    marketPrice: 38500
  },
  {
    model: "TB-100",
    type: "tilting-pad",
    description: "可倾瓦推力轴承",
    thrustRange: [50, 100],
    shaftDiameterRange: [80, 140],
    maxSpeed: 2000,
    lubrication: "压力油润滑",
    padCount: 8,
    weight: 150,
    basePrice: 65000,
    discountRate: 0.12,
    factoryPrice: 57200,
    marketPrice: 71500
  },
  {
    model: "TB-200",
    type: "tilting-pad",
    description: "可倾瓦推力轴承，中型",
    thrustRange: [100, 200],
    shaftDiameterRange: [120, 200],
    maxSpeed: 1500,
    lubrication: "压力油润滑",
    padCount: 8,
    weight: 280,
    basePrice: 120000,
    discountRate: 0.10,
    factoryPrice: 108000,
    marketPrice: 132000
  },
  {
    model: "TB-350",
    type: "tilting-pad",
    description: "可倾瓦推力轴承，大型",
    thrustRange: [200, 350],
    shaftDiameterRange: [180, 280],
    maxSpeed: 1200,
    lubrication: "压力油润滑",
    padCount: 10,
    weight: 520,
    basePrice: 220000,
    discountRate: 0.08,
    factoryPrice: 202400,
    marketPrice: 242000
  }
];

export const sternTubeSeals = [
  // === 尾轴密封 ===
  {
    model: "STS-80",
    type: "lip-seal",
    description: "唇形密封尾轴密封装置",
    shaftDiameterRange: [60, 80],
    sealRings: 3, // 道
    lubrication: "油润滑",
    material: "丁腈橡胶+不锈钢",
    weight: 25,
    basePrice: 12000,
    discountRate: 0.15,
    factoryPrice: 10200,
    marketPrice: 13200,
    notes: "适用于内河船舶"
  },
  {
    model: "STS-120",
    type: "lip-seal",
    description: "唇形密封尾轴密封装置",
    shaftDiameterRange: [80, 120],
    sealRings: 4,
    lubrication: "油润滑",
    material: "丁腈橡胶+不锈钢",
    weight: 45,
    basePrice: 22000,
    discountRate: 0.12,
    factoryPrice: 19360,
    marketPrice: 24200
  },
  {
    model: "STS-160",
    type: "lip-seal",
    description: "唇形密封尾轴密封装置",
    shaftDiameterRange: [120, 160],
    sealRings: 4,
    lubrication: "油润滑",
    material: "氟橡胶+不锈钢",
    weight: 75,
    basePrice: 35000,
    discountRate: 0.12,
    factoryPrice: 30800,
    marketPrice: 38500
  },
  {
    model: "STS-200",
    type: "lip-seal",
    description: "唇形密封尾轴密封装置",
    shaftDiameterRange: [160, 200],
    sealRings: 5,
    lubrication: "油润滑",
    material: "氟橡胶+不锈钢",
    weight: 120,
    basePrice: 52000,
    discountRate: 0.10,
    factoryPrice: 46800,
    marketPrice: 57200
  },
  {
    model: "STS-260",
    type: "lip-seal",
    description: "唇形密封尾轴密封装置，大型",
    shaftDiameterRange: [200, 260],
    sealRings: 5,
    lubrication: "油润滑",
    material: "氟橡胶+不锈钢",
    weight: 180,
    basePrice: 78000,
    discountRate: 0.10,
    factoryPrice: 70200,
    marketPrice: 85800
  },

  // === 机械密封 ===
  {
    model: "STS-M120",
    type: "mechanical-seal",
    description: "机械密封尾轴密封装置",
    shaftDiameterRange: [80, 120],
    sealType: "端面密封",
    lubrication: "海水润滑",
    material: "碳化硅+碳石墨",
    weight: 65,
    basePrice: 48000,
    discountRate: 0.10,
    factoryPrice: 43200,
    marketPrice: 52800,
    notes: "零泄漏设计，环保型"
  },
  {
    model: "STS-M180",
    type: "mechanical-seal",
    description: "机械密封尾轴密封装置",
    shaftDiameterRange: [140, 180],
    sealType: "端面密封",
    lubrication: "海水润滑",
    material: "碳化硅+碳石墨",
    weight: 120,
    basePrice: 85000,
    discountRate: 0.10,
    factoryPrice: 76500,
    marketPrice: 93500
  },
  {
    model: "STS-M250",
    type: "mechanical-seal",
    description: "机械密封尾轴密封装置，大型",
    shaftDiameterRange: [200, 250],
    sealType: "端面密封",
    lubrication: "海水润滑",
    material: "碳化硅+碳石墨",
    weight: 200,
    basePrice: 150000,
    discountRate: 0.08,
    factoryPrice: 138000,
    marketPrice: 165000
  }
];

export const shaftCouplings = [
  // === 刚性联轴器 ===
  {
    model: "RC-80",
    type: "rigid",
    description: "刚性法兰联轴器",
    shaftDiameterRange: [60, 80],
    maxTorque: 8, // kN.m
    maxSpeed: 2500,
    material: "锻钢",
    weight: 35,
    basePrice: 6500,
    discountRate: 0.15,
    factoryPrice: 5525,
    marketPrice: 7150
  },
  {
    model: "RC-120",
    type: "rigid",
    description: "刚性法兰联轴器",
    shaftDiameterRange: [80, 120],
    maxTorque: 20,
    maxSpeed: 2200,
    material: "锻钢",
    weight: 65,
    basePrice: 12000,
    discountRate: 0.15,
    factoryPrice: 10200,
    marketPrice: 13200
  },
  {
    model: "RC-160",
    type: "rigid",
    description: "刚性法兰联轴器",
    shaftDiameterRange: [120, 160],
    maxTorque: 45,
    maxSpeed: 1800,
    material: "锻钢",
    weight: 120,
    basePrice: 22000,
    discountRate: 0.12,
    factoryPrice: 19360,
    marketPrice: 24200
  },
  {
    model: "RC-200",
    type: "rigid",
    description: "刚性法兰联轴器",
    shaftDiameterRange: [160, 200],
    maxTorque: 80,
    maxSpeed: 1500,
    material: "锻钢",
    weight: 200,
    basePrice: 35000,
    discountRate: 0.12,
    factoryPrice: 30800,
    marketPrice: 38500
  },

  // === 膜片联轴器 ===
  {
    model: "DC-80",
    type: "disc",
    description: "膜片联轴器",
    shaftDiameterRange: [60, 80],
    maxTorque: 6,
    maxSpeed: 3000,
    axialMisalignment: 2, // mm
    angularMisalignment: 1, // 度
    material: "不锈钢膜片",
    weight: 28,
    basePrice: 15000,
    discountRate: 0.12,
    factoryPrice: 13200,
    marketPrice: 16500,
    notes: "可补偿轴向和角向偏差"
  },
  {
    model: "DC-120",
    type: "disc",
    description: "膜片联轴器",
    shaftDiameterRange: [80, 120],
    maxTorque: 15,
    maxSpeed: 2500,
    axialMisalignment: 3,
    angularMisalignment: 1.5,
    material: "不锈钢膜片",
    weight: 55,
    basePrice: 28000,
    discountRate: 0.12,
    factoryPrice: 24640,
    marketPrice: 30800
  },
  {
    model: "DC-160",
    type: "disc",
    description: "膜片联轴器",
    shaftDiameterRange: [120, 160],
    maxTorque: 35,
    maxSpeed: 2000,
    axialMisalignment: 4,
    angularMisalignment: 1.5,
    material: "不锈钢膜片",
    weight: 95,
    basePrice: 45000,
    discountRate: 0.10,
    factoryPrice: 40500,
    marketPrice: 49500
  }
];

export const shaftFlanges = [
  // === 法兰 ===
  {
    model: "SF-80",
    type: "integral",
    description: "整体式轴法兰",
    shaftDiameter: 80,
    boltCount: 6,
    boltDiameter: "M16",
    pcd: 160, // 螺栓分布圆直径
    material: "锻钢",
    weight: 12,
    basePrice: 3500,
    factoryPrice: 2975,
    marketPrice: 3850
  },
  {
    model: "SF-120",
    type: "integral",
    description: "整体式轴法兰",
    shaftDiameter: 120,
    boltCount: 8,
    boltDiameter: "M20",
    pcd: 220,
    material: "锻钢",
    weight: 25,
    basePrice: 5800,
    factoryPrice: 4930,
    marketPrice: 6380
  },
  {
    model: "SF-160",
    type: "integral",
    description: "整体式轴法兰",
    shaftDiameter: 160,
    boltCount: 8,
    boltDiameter: "M24",
    pcd: 280,
    material: "锻钢",
    weight: 45,
    basePrice: 9500,
    factoryPrice: 8075,
    marketPrice: 10450
  },
  {
    model: "SF-200",
    type: "integral",
    description: "整体式轴法兰",
    shaftDiameter: 200,
    boltCount: 10,
    boltDiameter: "M27",
    pcd: 340,
    material: "锻钢",
    weight: 72,
    basePrice: 15000,
    factoryPrice: 12750,
    marketPrice: 16500
  }
];

// 导出汇总
export const shaftSystemData = {
  intermediateBearings,
  thrustBearings,
  sternTubeSeals,
  shaftCouplings,
  shaftFlanges
};

export default shaftSystemData;
