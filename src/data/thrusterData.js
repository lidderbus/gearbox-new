// src/data/thrusterData.js
// 侧推器数据 (艏侧推/艉侧推)
// 数据来源: 杭齿前进技术协议 (TF110等型号)

/**
 * 侧推器类型:
 * - TF: 定距桨电动侧推 (Fixed Pitch, Electric)
 * - TC: 可调桨电动侧推 (Controllable Pitch, Electric)
 * - TH: 液压驱动侧推 (Hydraulic)
 * - TR: 可收放侧推 (Retractable)
 */

export const electricThrusters = [
  // === TF系列 - 定距桨电动侧推 ===
  // 基于技术协议真实数据 - TF110
  {
    model: "TF50",
    series: "TF",
    type: "fixed-pitch-electric",
    description: "定距侧向推进器，小型",
    propellerDiameter: 500, // mm
    tunnelInnerDiameter: 515,
    tunnelOuterDiameter: 545,
    thrust: 12, // kN
    tunnelLength: 580,
    bladeCount: 4,
    bladeMaterial: "铝青铜",
    motorPower: 75, // kW
    motorVoltage: [380, 440],
    motorFrequency: 50,
    motorSpeed: 1480,
    motorProtection: "IP44",
    frequencyControlled: true,
    frequencyRange: "0-±50Hz",
    installPosition: ["bow", "stern"],
    weight: 850,
    basePrice: 85000,
    discountRate: 0.15,
    factoryPrice: 72250,
    marketPrice: 93500,
    notes: "适用于小型工作船"
  },
  {
    model: "TF80",
    series: "TF",
    type: "fixed-pitch-electric",
    description: "定距侧向推进器，中小型",
    propellerDiameter: 800,
    tunnelInnerDiameter: 820,
    tunnelOuterDiameter: 860,
    thrust: 28,
    tunnelLength: 900,
    bladeCount: 4,
    bladeMaterial: "镍铝青铜",
    motorPower: 150,
    motorVoltage: [380, 440, 690],
    motorFrequency: 50,
    motorSpeed: 1485,
    motorProtection: "IP44",
    frequencyControlled: true,
    frequencyRange: "0-±50Hz",
    installPosition: ["bow", "stern"],
    weight: 1800,
    basePrice: 145000,
    discountRate: 0.12,
    factoryPrice: 127600,
    marketPrice: 159500
  },
  {
    model: "TF090",
    series: "TF",
    type: "fixed-pitch-electric",
    description: "定距侧向推进器，中小型",
    propellerDiameter: 900,
    tunnelInnerDiameter: 920,
    tunnelOuterDiameter: 955,
    thrust: 35,
    tunnelLength: 1000,
    bladeCount: 4,
    bladeMaterial: "镍铝青铜",
    motorPower: 200,
    motorVoltage: [380, 440],
    motorFrequency: 50,
    motorSpeed: 1485,
    motorProtection: "IP44",
    frequencyControlled: true,
    frequencyRange: "0-±50Hz",
    installPosition: ["bow", "stern"],
    weight: 2800,
    basePrice: 195000,
    discountRate: 0.12,
    factoryPrice: 171600,
    marketPrice: 214500,
    notes: "适用于中小型工程船、内河船"
  },
  // 技术协议真实型号 TF110
  {
    model: "TF110",
    series: "TF",
    type: "fixed-pitch-electric",
    description: "定距侧向推进器 - 技术协议标准型",
    propellerDiameter: 1100, // mm - 来自技术协议
    tunnelInnerDiameter: 1130, // 来自技术协议
    tunnelOuterDiameter: 1166, // 来自技术协议
    thrust: 46, // kN - 来自技术协议
    tunnelLength: 1190, // 来自技术协议
    bladeCount: 4, // 来自技术协议
    bladeMaterial: "Cu3 (镍铝青铜)", // 来自技术协议
    motorPower: 315, // kW - 来自技术协议
    motorVoltage: [380], // 来自技术协议
    motorFrequency: 50, // 来自技术协议
    motorSpeed: 1490, // 来自技术协议
    motorProtection: "IP44", // 来自技术协议
    controlCabinetProtection: "IP23", // 来自技术协议
    frequencyControlled: true,
    frequencyRange: "0-±50Hz", // 来自技术协议
    installPosition: ["bow", "stern"],
    weight: 4200,
    // 供货清单
    supplyScope: [
      "侧推本体",
      "弹性联轴器",
      "驱动电机",
      "变频柜",
      "重力油箱",
      "手摇泵",
      "驾驶室控制面板",
      "备件"
    ],
    basePrice: 280000,
    discountRate: 0.12,
    factoryPrice: 246400,
    marketPrice: 308000,
    notes: "680TEU集装箱船配套产品"
  },
  {
    model: "TF140",
    series: "TF",
    type: "fixed-pitch-electric",
    description: "定距侧向推进器，大型",
    propellerDiameter: 1400,
    tunnelInnerDiameter: 1430,
    tunnelOuterDiameter: 1480,
    thrust: 72,
    tunnelLength: 1500,
    bladeCount: 4,
    bladeMaterial: "Cu3 (镍铝青铜)",
    motorPower: 500,
    motorVoltage: [380, 690],
    motorFrequency: 50,
    motorSpeed: 1488,
    motorProtection: "IP44",
    frequencyControlled: true,
    frequencyRange: "0-±50Hz",
    installPosition: ["bow", "stern"],
    weight: 6800,
    basePrice: 420000,
    discountRate: 0.10,
    factoryPrice: 378000,
    marketPrice: 462000
  },
  {
    model: "TF180",
    series: "TF",
    type: "fixed-pitch-electric",
    description: "定距侧向推进器，超大型",
    propellerDiameter: 1800,
    tunnelInnerDiameter: 1840,
    tunnelOuterDiameter: 1900,
    thrust: 120,
    tunnelLength: 1950,
    bladeCount: 4,
    bladeMaterial: "Cu3 (镍铝青铜)",
    motorPower: 800,
    motorVoltage: [690, 3300],
    motorFrequency: 50,
    motorSpeed: 1490,
    motorProtection: "IP44",
    frequencyControlled: true,
    frequencyRange: "0-±50Hz",
    installPosition: ["bow", "stern"],
    weight: 11500,
    basePrice: 680000,
    discountRate: 0.08,
    factoryPrice: 625600,
    marketPrice: 748000
  },
  {
    model: "TF220",
    series: "TF",
    type: "fixed-pitch-electric",
    description: "定距侧向推进器，巨型",
    propellerDiameter: 2200,
    tunnelInnerDiameter: 2250,
    tunnelOuterDiameter: 2320,
    thrust: 180,
    tunnelLength: 2400,
    bladeCount: 5,
    bladeMaterial: "Cu3 (镍铝青铜)",
    motorPower: 1200,
    motorVoltage: [3300, 6600],
    motorFrequency: 50,
    motorSpeed: 1492,
    motorProtection: "IP44",
    frequencyControlled: true,
    frequencyRange: "0-±50Hz",
    installPosition: ["bow", "stern"],
    weight: 18000,
    basePrice: 950000,
    discountRate: 0.08,
    factoryPrice: 874000,
    marketPrice: 1045000,
    notes: "适用于大型散货船、油轮"
  }
];

export const hydraulicThrusters = [
  // === TH系列 - 液压驱动侧推 ===
  {
    model: "TH50",
    series: "TH",
    type: "hydraulic",
    description: "液压侧向推进器，紧凑型",
    propellerDiameter: 500,
    tunnelDiameter: 520,
    thrust: 10,
    bladeCount: 4,
    hydraulicPressure: 16, // MPa
    hydraulicFlow: 80, // L/min
    installPosition: ["bow", "stern"],
    weight: 650,
    basePrice: 75000,
    discountRate: 0.15,
    factoryPrice: 63750,
    marketPrice: 82500,
    notes: "适用于小型船舶，无需大功率电源"
  },
  {
    model: "TH80",
    series: "TH",
    type: "hydraulic",
    description: "液压侧向推进器，标准型",
    propellerDiameter: 800,
    tunnelDiameter: 825,
    thrust: 25,
    bladeCount: 4,
    hydraulicPressure: 20,
    hydraulicFlow: 150,
    installPosition: ["bow", "stern"],
    weight: 1400,
    basePrice: 125000,
    discountRate: 0.12,
    factoryPrice: 110000,
    marketPrice: 137500
  },
  {
    model: "TH110",
    series: "TH",
    type: "hydraulic",
    description: "液压侧向推进器，中型",
    propellerDiameter: 1100,
    tunnelDiameter: 1130,
    thrust: 42,
    bladeCount: 4,
    hydraulicPressure: 25,
    hydraulicFlow: 280,
    installPosition: ["bow", "stern"],
    weight: 3200,
    basePrice: 220000,
    discountRate: 0.12,
    factoryPrice: 193600,
    marketPrice: 242000
  },
  {
    model: "TH140",
    series: "TH",
    type: "hydraulic",
    description: "液压侧向推进器，大型",
    propellerDiameter: 1400,
    tunnelDiameter: 1440,
    thrust: 68,
    bladeCount: 4,
    hydraulicPressure: 28,
    hydraulicFlow: 450,
    installPosition: ["bow", "stern"],
    weight: 5500,
    basePrice: 360000,
    discountRate: 0.10,
    factoryPrice: 324000,
    marketPrice: 396000
  }
];

export const controllablePitchThrusters = [
  // === TC系列 - 可调桨电动侧推 ===
  {
    model: "TC80",
    series: "TC",
    type: "controllable-pitch-electric",
    description: "可调桨侧向推进器，紧凑型",
    propellerDiameter: 800,
    tunnelDiameter: 825,
    thrust: 30, // 可调桨效率略高
    pitchRange: [-20, 20], // 度
    bladeCount: 4,
    motorPower: 150,
    motorVoltage: [380, 440, 690],
    installPosition: ["bow", "stern"],
    weight: 2200,
    basePrice: 220000,
    discountRate: 0.12,
    factoryPrice: 193600,
    marketPrice: 242000,
    notes: "无需变频器，通过桨距调节推力"
  },
  {
    model: "TC110",
    series: "TC",
    type: "controllable-pitch-electric",
    description: "可调桨侧向推进器，标准型",
    propellerDiameter: 1100,
    tunnelDiameter: 1130,
    thrust: 50,
    pitchRange: [-22, 22],
    bladeCount: 4,
    motorPower: 315,
    motorVoltage: [380, 690],
    installPosition: ["bow", "stern"],
    weight: 4800,
    basePrice: 380000,
    discountRate: 0.10,
    factoryPrice: 342000,
    marketPrice: 418000
  },
  {
    model: "TC140",
    series: "TC",
    type: "controllable-pitch-electric",
    description: "可调桨侧向推进器，大型",
    propellerDiameter: 1400,
    tunnelDiameter: 1440,
    thrust: 80,
    pitchRange: [-25, 25],
    bladeCount: 4,
    motorPower: 500,
    motorVoltage: [690, 3300],
    installPosition: ["bow", "stern"],
    weight: 7500,
    basePrice: 550000,
    discountRate: 0.08,
    factoryPrice: 506000,
    marketPrice: 605000
  }
];

export const retractableThrusters = [
  // === TR系列 - 可收放侧推 ===
  {
    model: "TR80",
    series: "TR",
    type: "retractable",
    description: "可收放侧向推进器，紧凑型",
    propellerDiameter: 800,
    thrust: 28,
    motorPower: 150,
    retractTime: 45, // 秒
    installPosition: ["bow", "stern"],
    weight: 3500,
    basePrice: 450000,
    discountRate: 0.10,
    factoryPrice: 405000,
    marketPrice: 495000,
    notes: "适用于需要减小阻力的高速船"
  },
  {
    model: "TR110",
    series: "TR",
    type: "retractable",
    description: "可收放侧向推进器，标准型",
    propellerDiameter: 1100,
    thrust: 48,
    motorPower: 315,
    retractTime: 60,
    installPosition: ["bow", "stern"],
    weight: 6500,
    basePrice: 680000,
    discountRate: 0.08,
    factoryPrice: 625600,
    marketPrice: 748000
  }
];

/**
 * 侧推控制系统
 */
export const thrusterControlSystems = [
  {
    model: "TCS-Single",
    description: "单侧推控制系统",
    features: ["手柄操控", "本地/遥控切换", "过载保护"],
    applicableModels: ["TF50", "TF80", "TH50", "TH80"],
    basePrice: 35000,
    factoryPrice: 29750,
    marketPrice: 38500
  },
  {
    model: "TCS-Dual",
    description: "双侧推控制系统",
    features: ["双手柄操控", "同步/独立模式", "故障诊断", "数据记录"],
    applicableModels: ["TF110", "TF140", "TH110", "TH140", "TC110", "TC140"],
    basePrice: 65000,
    factoryPrice: 55250,
    marketPrice: 71500
  },
  {
    model: "TCS-DP",
    description: "DP级侧推控制系统",
    features: ["DP接口", "冗余设计", "自动推力分配", "黑匣子"],
    applicableModels: ["TF180", "TF220", "TC140", "TR110"],
    basePrice: 150000,
    factoryPrice: 127500,
    marketPrice: 165000
  }
];

/**
 * 侧推液压系统 (用于TH系列)
 */
export const thrusterHydraulicUnits = [
  {
    model: "THU-80",
    description: "小型侧推液压站",
    power: 22,
    pressure: 20,
    tankCapacity: 150,
    applicableModels: ["TH50", "TH80"],
    weight: 280,
    basePrice: 65000,
    factoryPrice: 55250,
    marketPrice: 71500
  },
  {
    model: "THU-150",
    description: "中型侧推液压站",
    power: 45,
    pressure: 25,
    tankCapacity: 300,
    applicableModels: ["TH110", "TH140"],
    weight: 520,
    basePrice: 120000,
    factoryPrice: 102000,
    marketPrice: 132000
  }
];

// 导出汇总
export const thrusterData = {
  electricThrusters,
  hydraulicThrusters,
  controllablePitchThrusters,
  retractableThrusters,
  controlSystems: thrusterControlSystems,
  hydraulicUnits: thrusterHydraulicUnits
};

export default thrusterData;
