// src/data/azimuthThrusterData.js
// 全回转舵桨/推进器数据
// 适用于港作拖轮、工作船、调查船、海工船等需要高机动性的船舶

/**
 * 全回转推进器系列:
 * - ZP: Z形传动推进器 (锥齿轮+垂直轴+锥齿轮)
 * - LP: L形传动推进器 (单级锥齿轮)
 * - EP: 电驱动吊舱推进器
 */

export const azimuthThrusters = [
  // === ZP系列 - Z形传动 ===
  {
    model: "ZP-300",
    series: "ZP",
    type: "z-drive",
    description: "Z形传动全回转推进器，紧凑型",
    powerRange: [150, 300],
    thrust: { continuous: 45, bollard: 55 }, // kN
    propellerDiameter: [0.9, 1.4],
    inputSpeedRange: [1000, 1800],
    ratios: [2.5, 3.0, 3.5],
    rotationAngle: 360, // 度
    rotationSpeed: 2.5, // rpm (回转速度)
    efficiency: 0.88,
    weight: 2800,
    dimensions: "1600x1400x2200",
    immersionDepth: 1800, // mm
    applications: ["港作拖轮", "工作船", "引航艇"],
    propellerType: ["FPP", "CPP"],
    basePrice: 450000,
    discountRate: 0.12,
    factoryPrice: 396000,
    marketPrice: 495000,
    notes: "CCS/DNV/BV船级社认证可选"
  },
  {
    model: "ZP-500",
    series: "ZP",
    type: "z-drive",
    description: "Z形传动全回转推进器，标准型",
    powerRange: [300, 500],
    thrust: { continuous: 80, bollard: 95 },
    propellerDiameter: [1.2, 1.8],
    inputSpeedRange: [900, 1600],
    ratios: [2.5, 3.0, 3.5, 4.0],
    rotationAngle: 360,
    rotationSpeed: 2.0,
    efficiency: 0.90,
    weight: 4500,
    dimensions: "1900x1700x2800",
    immersionDepth: 2400,
    applications: ["港作拖轮", "工作船", "调查船"],
    propellerType: ["FPP", "CPP"],
    basePrice: 680000,
    discountRate: 0.12,
    factoryPrice: 598400,
    marketPrice: 748000,
    notes: "可选配冰级加强"
  },
  {
    model: "ZP-750",
    series: "ZP",
    type: "z-drive",
    description: "Z形传动全回转推进器，中型",
    powerRange: [500, 750],
    thrust: { continuous: 110, bollard: 135 },
    propellerDiameter: [1.5, 2.2],
    inputSpeedRange: [750, 1400],
    ratios: [3.0, 3.5, 4.0, 4.5],
    rotationAngle: 360,
    rotationSpeed: 1.8,
    efficiency: 0.91,
    weight: 6800,
    dimensions: "2200x2000x3200",
    immersionDepth: 2800,
    applications: ["AHTS", "OSV", "大型拖轮"],
    propellerType: ["FPP", "CPP"],
    basePrice: 980000,
    discountRate: 0.10,
    factoryPrice: 882000,
    marketPrice: 1078000
  },
  {
    model: "ZP-1000",
    series: "ZP",
    type: "z-drive",
    description: "Z形传动全回转推进器，大型",
    powerRange: [750, 1000],
    thrust: { continuous: 150, bollard: 180 },
    propellerDiameter: [1.8, 2.6],
    inputSpeedRange: [600, 1200],
    ratios: [3.5, 4.0, 4.5, 5.0],
    rotationAngle: 360,
    rotationSpeed: 1.5,
    efficiency: 0.92,
    weight: 9500,
    dimensions: "2600x2400x3800",
    immersionDepth: 3200,
    applications: ["AHTS", "PSV", "海工船"],
    propellerType: ["CPP"],
    basePrice: 1350000,
    discountRate: 0.10,
    factoryPrice: 1215000,
    marketPrice: 1485000,
    notes: "标配DP动力定位接口"
  },
  {
    model: "ZP-1500",
    series: "ZP",
    type: "z-drive",
    description: "Z形传动全回转推进器，超大型",
    powerRange: [1000, 1500],
    thrust: { continuous: 220, bollard: 270 },
    propellerDiameter: [2.2, 3.2],
    inputSpeedRange: [500, 1000],
    ratios: [4.0, 4.5, 5.0, 5.5, 6.0],
    rotationAngle: 360,
    rotationSpeed: 1.2,
    efficiency: 0.92,
    weight: 14000,
    dimensions: "3000x2800x4500",
    immersionDepth: 4000,
    applications: ["大型AHTS", "钻井船", "FPSO"],
    propellerType: ["CPP"],
    basePrice: 2100000,
    discountRate: 0.08,
    factoryPrice: 1932000,
    marketPrice: 2310000
  },

  // === LP系列 - L形传动 ===
  {
    model: "LP-300",
    series: "LP",
    type: "l-drive",
    description: "L形传动全回转推进器，简化结构",
    powerRange: [150, 300],
    thrust: { continuous: 42, bollard: 52 },
    propellerDiameter: [0.9, 1.4],
    inputSpeedRange: [1000, 1800],
    ratios: [2.0, 2.5, 3.0],
    rotationAngle: 360,
    rotationSpeed: 3.0,
    efficiency: 0.86,
    weight: 2200,
    dimensions: "1400x1300x2000",
    immersionDepth: 1600,
    applications: ["小型工作艇", "引航艇", "巡逻艇"],
    propellerType: ["FPP"],
    basePrice: 380000,
    discountRate: 0.15,
    factoryPrice: 323000,
    marketPrice: 418000,
    notes: "经济实用型"
  },
  {
    model: "LP-500",
    series: "LP",
    type: "l-drive",
    description: "L形传动全回转推进器，标准型",
    powerRange: [300, 500],
    thrust: { continuous: 72, bollard: 88 },
    propellerDiameter: [1.2, 1.7],
    inputSpeedRange: [900, 1600],
    ratios: [2.5, 3.0, 3.5],
    rotationAngle: 360,
    rotationSpeed: 2.5,
    efficiency: 0.87,
    weight: 3800,
    dimensions: "1700x1500x2500",
    immersionDepth: 2200,
    applications: ["港作拖轮", "工作船"],
    propellerType: ["FPP", "CPP"],
    basePrice: 550000,
    discountRate: 0.12,
    factoryPrice: 484000,
    marketPrice: 605000
  },

  // === EP系列 - 电驱动吊舱 ===
  {
    model: "EP-500",
    series: "EP",
    type: "electric-pod",
    description: "电驱动吊舱推进器",
    powerRange: [300, 500],
    thrust: { continuous: 85, bollard: 100 },
    propellerDiameter: [1.3, 1.9],
    voltage: [690, 3300, 6600],
    frequency: [50, 60],
    motorType: "永磁同步电机",
    rotationAngle: 360,
    rotationSpeed: 2.0,
    efficiency: 0.94, // 电驱动效率更高
    weight: 5200,
    dimensions: "2000x1800x2600",
    immersionDepth: 2400,
    applications: ["DP2/DP3船舶", "科考船", "豪华游艇"],
    propellerType: ["FPP"],
    basePrice: 1200000,
    discountRate: 0.08,
    factoryPrice: 1104000,
    marketPrice: 1320000,
    notes: "低噪声、免维护"
  },
  {
    model: "EP-1000",
    series: "EP",
    type: "electric-pod",
    description: "电驱动吊舱推进器，大功率",
    powerRange: [750, 1000],
    thrust: { continuous: 160, bollard: 190 },
    propellerDiameter: [1.9, 2.7],
    voltage: [3300, 6600],
    frequency: [50, 60],
    motorType: "永磁同步电机",
    rotationAngle: 360,
    rotationSpeed: 1.5,
    efficiency: 0.95,
    weight: 10500,
    dimensions: "2800x2500x3800",
    immersionDepth: 3400,
    applications: ["豪华邮轮", "科考船", "海工DP船"],
    propellerType: ["FPP", "CPP"],
    basePrice: 2500000,
    discountRate: 0.05,
    factoryPrice: 2375000,
    marketPrice: 2750000,
    notes: "振动噪声最低"
  }
];

/**
 * 回转驱动单元
 */
export const slewingDrives = [
  {
    model: "SD-300",
    description: "回转驱动单元，小型",
    applicableThrusters: ["ZP-300", "LP-300"],
    power: 7.5, // kW
    torque: 15000, // N.m
    speed: 3.0, // rpm
    gearType: "行星齿轮",
    weight: 450,
    basePrice: 65000,
    factoryPrice: 55250,
    marketPrice: 71500
  },
  {
    model: "SD-500",
    description: "回转驱动单元，中型",
    applicableThrusters: ["ZP-500", "LP-500"],
    power: 15,
    torque: 35000,
    speed: 2.5,
    gearType: "行星齿轮",
    weight: 780,
    basePrice: 95000,
    factoryPrice: 80750,
    marketPrice: 104500
  },
  {
    model: "SD-750",
    description: "回转驱动单元，大型",
    applicableThrusters: ["ZP-750", "ZP-1000"],
    power: 22,
    torque: 65000,
    speed: 2.0,
    gearType: "行星齿轮",
    weight: 1200,
    basePrice: 145000,
    factoryPrice: 123250,
    marketPrice: 159500
  },
  {
    model: "SD-1500",
    description: "回转驱动单元，超大型",
    applicableThrusters: ["ZP-1500"],
    power: 37,
    torque: 120000,
    speed: 1.5,
    gearType: "行星齿轮",
    weight: 2200,
    basePrice: 220000,
    factoryPrice: 187000,
    marketPrice: 242000
  }
];


/**
 * 全回转控制系统
 */
export const azimuthControlSystems = [
  {
    model: "ACS-Basic",
    description: "基础型控制系统",
    features: ["单杆操控", "本地控制", "应急操舵"],
    applicableThrusters: ["ZP-300", "LP-300", "ZP-500", "LP-500"],
    basePrice: 85000,
    factoryPrice: 72250,
    marketPrice: 93500
  },
  {
    model: "ACS-DP1",
    description: "DP1级控制系统",
    features: ["双杆操控", "遥控", "DP1接口", "故障报警"],
    applicableThrusters: ["ZP-500", "ZP-750", "ZP-1000"],
    basePrice: 180000,
    factoryPrice: 153000,
    marketPrice: 198000
  },
  {
    model: "ACS-DP2",
    description: "DP2级控制系统",
    features: ["双杆操控", "遥控", "DP2接口", "冗余设计", "自动定位"],
    applicableThrusters: ["ZP-1000", "ZP-1500", "EP-500", "EP-1000"],
    basePrice: 350000,
    factoryPrice: 297500,
    marketPrice: 385000
  }
];

// 导出汇总
export const azimuthThrusterData = {
  thrusters: azimuthThrusters,
  slewingDrives,
  controlSystems: azimuthControlSystems
};

export default azimuthThrusterData;
