// src/data/cppSystemData.js
// CPP (Controllable Pitch Propeller) 可调螺距螺旋桨系统数据
// 包含CPP专用齿轮箱、调距桨、配油器等产品

/**
 * CPP齿轮箱系列:
 * - GCS: 单级减速CPP齿轮箱
 * - GCST: 单级减速带PTO的CPP齿轮箱
 * - GCD: 双级减速CPP齿轮箱
 * - GSH: 侧向输出CPP齿轮箱
 * - GCC: 紧凑型CPP齿轮箱
 */

export const cppGearboxes = [
  // === GCS系列 - 单级减速 ===
  {
    model: "GCS320",
    series: "GCS",
    type: "single-stage",
    description: "单级减速CPP齿轮箱，配油器前置",
    inputSpeedRange: [750, 2100],
    ratios: [2.5, 3.0, 3.5, 4.0],
    transferCapacity: [0.25, 0.22, 0.19, 0.16], // kW/(r/min)
    maxPower: 550,
    thrust: 60,
    weight: 1200,
    oilDistributorMount: "front",
    applicablePropellers: ["HI-320", "HF-320"],
    dimensions: "850x950x1100",
    oilCapacity: 80,
    basePrice: 180000,
    discountRate: 0.15,
    factoryPrice: 153000,
    marketPrice: 198000,
    notes: "适用于中型渔船、工作船"
  },
  {
    model: "GCS450",
    series: "GCS",
    type: "single-stage",
    description: "单级减速CPP齿轮箱，中大功率",
    inputSpeedRange: [600, 1800],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5],
    transferCapacity: [0.50, 0.45, 0.40, 0.36, 0.32, 0.28],
    maxPower: 900,
    thrust: 100,
    weight: 2200,
    oilDistributorMount: "front",
    applicablePropellers: ["HI-450", "HF-450"],
    dimensions: "1050x1150x1350",
    oilCapacity: 150,
    basePrice: 320000,
    discountRate: 0.15,
    factoryPrice: 272000,
    marketPrice: 352000,
    notes: "适用于大型渔船、拖轮"
  },
  {
    model: "GCS560",
    series: "GCS",
    type: "single-stage",
    description: "单级减速CPP齿轮箱，大功率",
    inputSpeedRange: [500, 1500],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
    transferCapacity: [0.80, 0.72, 0.64, 0.58, 0.52, 0.46, 0.41],
    maxPower: 1600,
    thrust: 160,
    weight: 3800,
    oilDistributorMount: "front",
    applicablePropellers: ["HI-560", "HF-560"],
    dimensions: "1250x1400x1600",
    oilCapacity: 280,
    basePrice: 520000,
    discountRate: 0.15,
    factoryPrice: 442000,
    marketPrice: 572000,
    notes: "适用于大型拖轮、工程船"
  },
  {
    model: "GCS710",
    series: "GCS",
    type: "single-stage",
    description: "单级减速CPP齿轮箱，超大功率",
    inputSpeedRange: [500, 1500],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
    transferCapacity: [1.25, 1.12, 1.00, 0.90, 0.82, 0.74, 0.67], // kW/(r/min)
    maxPower: 2200,
    thrust: 220,
    weight: 5800,
    oilDistributorMount: "front",
    applicablePropellers: ["HI-710", "HF-710"],
    dimensions: "1500x1650x1900",
    oilCapacity: 450,
    basePrice: 820000,
    discountRate: 0.12,
    factoryPrice: 721600,
    marketPrice: 902000,
    notes: "适用于大型拖轮、AHTS、工程船"
  },

  // === GCST系列 - 单级减速带PTO ===
  {
    model: "GCST450",
    series: "GCST",
    type: "single-stage-pto",
    description: "单级减速CPP齿轮箱，带动力输出(PTO)",
    inputSpeedRange: [600, 1800],
    ratios: [2.5, 3.0, 3.5, 4.0],
    transferCapacity: [0.45, 0.40, 0.36, 0.32],
    maxPower: 800,
    thrust: 90,
    weight: 2500,
    oilDistributorMount: "front",
    ptoOutput: { position: "top", maxPower: 150, speed: "1:1" },
    applicablePropellers: ["HI-450", "HF-450"],
    dimensions: "1100x1200x1450",
    oilCapacity: 160,
    basePrice: 380000,
    discountRate: 0.15,
    factoryPrice: 323000,
    marketPrice: 418000,
    notes: "适用于需要辅助动力输出的船舶"
  },
  {
    model: "GCST560",
    series: "GCST",
    type: "single-stage-pto",
    description: "单级减速CPP齿轮箱，带PTO，大功率",
    inputSpeedRange: [500, 1500],
    ratios: [2.5, 3.0, 3.5, 4.0, 4.5],
    transferCapacity: [0.70, 0.62, 0.56, 0.50, 0.44],
    maxPower: 1400,
    thrust: 140,
    weight: 4200,
    oilDistributorMount: "front",
    ptoOutput: { position: "top", maxPower: 250, speed: "1:1" },
    applicablePropellers: ["HI-560", "HF-560"],
    dimensions: "1300x1450x1700",
    oilCapacity: 300,
    basePrice: 620000,
    discountRate: 0.15,
    factoryPrice: 527000,
    marketPrice: 682000,
    notes: "适用于大型作业船"
  },
  {
    model: "GCST710",
    series: "GCST",
    type: "single-stage-pto",
    description: "单级减速CPP齿轮箱，带PTO，超大功率，双机并车",
    inputSpeedRange: [500, 1500],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
    transferCapacity: [1.10, 1.00, 0.90, 0.82, 0.74, 0.67, 0.60], // kW/(r/min)
    maxPower: 2000,
    thrust: 200,
    weight: 6500,
    oilDistributorMount: "front",
    ptoOutput: { position: "top", maxPower: 350, speed: "1:1" },
    applicablePropellers: ["HI-710", "HF-710"],
    dimensions: "1600x1750x2000",
    oilCapacity: 500,
    basePrice: 980000,
    discountRate: 0.12,
    factoryPrice: 862400,
    marketPrice: 1078000,
    notes: "适用于大型拖轮、AHTS、PSV等需要辅助动力输出的船舶"
  },

  // === GCD系列 - 双级减速 ===
  {
    model: "GCD560",
    series: "GCD",
    type: "two-stage",
    description: "双级减速CPP齿轮箱，高减速比",
    inputSpeedRange: [750, 2100],
    ratios: [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0],
    transferCapacity: [0.65, 0.60, 0.55, 0.50, 0.46, 0.42, 0.39],
    maxPower: 1400,
    thrust: 150,
    weight: 4800,
    oilDistributorMount: "front",
    applicablePropellers: ["HI-560", "HF-560", "HS-560"],
    dimensions: "1400x1500x1800",
    oilCapacity: 350,
    basePrice: 680000,
    discountRate: 0.15,
    factoryPrice: 578000,
    marketPrice: 748000,
    notes: "适用于需要高减速比的大直径螺旋桨船舶"
  },
  {
    model: "GCD710",
    series: "GCD",
    type: "two-stage",
    description: "双级减速CPP齿轮箱，超大功率",
    inputSpeedRange: [600, 1800],
    ratios: [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0, 8.5],
    transferCapacity: [1.20, 1.10, 1.00, 0.92, 0.85, 0.78, 0.72, 0.67],
    maxPower: 2500,
    thrust: 280,
    weight: 8500,
    oilDistributorMount: "front",
    applicablePropellers: ["HI-710", "HF-710"],
    dimensions: "1800x1900x2200",
    oilCapacity: 600,
    basePrice: 1200000,
    discountRate: 0.12,
    factoryPrice: 1056000,
    marketPrice: 1320000,
    notes: "适用于大型船舶和海工平台"
  }
];

/**
 * CPP调距桨系列:
 * - HI: 重载型 (Heavy-duty Ice)
 * - HF: 通用型 (General Fishing)
 * - HS: 高速型 (High Speed)
 */
export const cppPropellers = [
  // === HI系列 - 重载型 ===
  {
    model: "HI-320",
    series: "HI",
    type: "heavy-duty",
    description: "重载型调距桨，适用于冰区和恶劣工况",
    diameterRange: [1.8, 3.2],
    bladeCount: [4, 5],
    maxPower: 800,
    pitchRange: [-15, 25],
    bladeMaterial: "NAB", // 镍铝青铜
    hubMaterial: "铸钢",
    maxSpeed: 350, // rpm
    matchingGearboxes: ["GCS320", "GCST450"],
    weight: 1800,
    basePrice: 350000,
    discountRate: 0.12,
    factoryPrice: 308000,
    marketPrice: 385000,
    notes: "CCS船级社认证"
  },
  {
    model: "HI-450",
    series: "HI",
    type: "heavy-duty",
    diameterRange: [2.5, 4.5],
    bladeCount: [4, 5],
    maxPower: 1500,
    pitchRange: [-15, 28],
    bladeMaterial: "NAB",
    hubMaterial: "铸钢",
    maxSpeed: 280,
    matchingGearboxes: ["GCS450", "GCST450", "GCD560"],
    weight: 3200,
    basePrice: 580000,
    discountRate: 0.12,
    factoryPrice: 510400,
    marketPrice: 638000
  },
  {
    model: "HI-560",
    series: "HI",
    type: "heavy-duty",
    diameterRange: [3.5, 5.6],
    bladeCount: [4, 5, 6],
    maxPower: 2800,
    pitchRange: [-18, 30],
    bladeMaterial: "NAB",
    hubMaterial: "铸钢",
    maxSpeed: 220,
    matchingGearboxes: ["GCS560", "GCST560", "GCD560"],
    weight: 5500,
    basePrice: 920000,
    discountRate: 0.12,
    factoryPrice: 809600,
    marketPrice: 1012000
  },
  {
    model: "HI-710",
    series: "HI",
    type: "heavy-duty",
    diameterRange: [4.5, 7.1],
    bladeCount: [4, 5, 6],
    maxPower: 4500,
    pitchRange: [-20, 32],
    bladeMaterial: "NAB",
    hubMaterial: "铸钢",
    maxSpeed: 180,
    matchingGearboxes: ["GCS710", "GCST710", "GCD710"],
    weight: 9800,
    basePrice: 1600000,
    discountRate: 0.10,
    factoryPrice: 1440000,
    marketPrice: 1760000
  },

  // === HF系列 - 通用型 ===
  {
    model: "HF-320",
    series: "HF",
    type: "general",
    description: "通用型调距桨，经济实用",
    diameterRange: [1.6, 3.2],
    bladeCount: [4],
    maxPower: 700,
    pitchRange: [-12, 22],
    bladeMaterial: "铜合金",
    hubMaterial: "铸铁",
    maxSpeed: 380,
    matchingGearboxes: ["GCS320"],
    weight: 1500,
    basePrice: 280000,
    discountRate: 0.15,
    factoryPrice: 238000,
    marketPrice: 308000
  },
  {
    model: "HF-450",
    series: "HF",
    type: "general",
    diameterRange: [2.2, 4.5],
    bladeCount: [4],
    maxPower: 1200,
    pitchRange: [-12, 25],
    bladeMaterial: "铜合金",
    hubMaterial: "铸铁",
    maxSpeed: 300,
    matchingGearboxes: ["GCS450", "GCST450"],
    weight: 2800,
    basePrice: 450000,
    discountRate: 0.15,
    factoryPrice: 382500,
    marketPrice: 495000
  },
  {
    model: "HF-560",
    series: "HF",
    type: "general",
    diameterRange: [3.0, 5.6],
    bladeCount: [4, 5],
    maxPower: 2200,
    pitchRange: [-15, 28],
    bladeMaterial: "铜合金",
    hubMaterial: "铸钢",
    maxSpeed: 250,
    matchingGearboxes: ["GCS560", "GCST560", "GCD560"],
    weight: 4800,
    basePrice: 720000,
    discountRate: 0.15,
    factoryPrice: 612000,
    marketPrice: 792000
  },
  {
    model: "HF-710",
    series: "HF",
    type: "general",
    description: "通用型调距桨，大功率",
    diameterRange: [4.0, 7.1],
    bladeCount: [4, 5],
    maxPower: 3500,
    pitchRange: [-18, 30],
    bladeMaterial: "铜合金",
    hubMaterial: "铸钢",
    maxSpeed: 200,
    matchingGearboxes: ["GCS710", "GCST710", "GCD710"],
    weight: 8500,
    basePrice: 1250000,
    discountRate: 0.12,
    factoryPrice: 1100000,
    marketPrice: 1375000
  },

  // === HS系列 - 高速型 ===
  {
    model: "HS-320",
    series: "HS",
    type: "high-speed",
    description: "高速型调距桨，适用于高速船",
    diameterRange: [1.2, 2.5],
    bladeCount: [4, 5],
    maxPower: 600,
    pitchRange: [-10, 20],
    bladeMaterial: "不锈钢",
    hubMaterial: "不锈钢",
    maxSpeed: 500,
    matchingGearboxes: ["GCS320"],
    weight: 1200,
    basePrice: 320000,
    discountRate: 0.12,
    factoryPrice: 281600,
    marketPrice: 352000
  },
  {
    model: "HS-450",
    series: "HS",
    type: "high-speed",
    diameterRange: [1.8, 3.5],
    bladeCount: [4, 5],
    maxPower: 1000,
    pitchRange: [-12, 22],
    bladeMaterial: "不锈钢",
    hubMaterial: "不锈钢",
    maxSpeed: 420,
    matchingGearboxes: ["GCS450", "GCST450"],
    weight: 2200,
    basePrice: 480000,
    discountRate: 0.12,
    factoryPrice: 422400,
    marketPrice: 528000
  }
];

/**
 * 配油器
 * 用于CPP液压调距系统的核心部件
 */
export const oilDistributors = [
  {
    model: "OD-320",
    description: "标准配油器",
    applicableGearboxes: ["GCS320", "GCST450"],
    maxPressure: 16, // MPa
    flowRate: 25, // L/min
    mountType: "flange",
    weight: 85,
    basePrice: 45000,
    factoryPrice: 38250,
    marketPrice: 49500
  },
  {
    model: "OD-450",
    description: "中型配油器",
    applicableGearboxes: ["GCS450", "GCST450", "GCD560"],
    maxPressure: 20,
    flowRate: 40,
    mountType: "flange",
    weight: 120,
    basePrice: 68000,
    factoryPrice: 57800,
    marketPrice: 74800
  },
  {
    model: "OD-560",
    description: "大型配油器",
    applicableGearboxes: ["GCS560", "GCS710", "GCST560", "GCST710", "GCD560", "GCD710"],
    maxPressure: 25,
    flowRate: 60,
    mountType: "flange",
    weight: 180,
    basePrice: 95000,
    factoryPrice: 80750,
    marketPrice: 104500
  }
];

/**
 * CPP液压控制系统
 */
export const cppHydraulicUnits = [
  {
    model: "HPU-15",
    description: "小型液压站",
    power: 15, // kW
    pressure: 16, // MPa
    tankCapacity: 100, // L
    applicableGearboxes: ["GCS320"],
    weight: 350,
    basePrice: 85000,
    factoryPrice: 72250,
    marketPrice: 93500
  },
  {
    model: "HPU-22",
    description: "中型液压站",
    power: 22,
    pressure: 20,
    tankCapacity: 200,
    applicableGearboxes: ["GCS450", "GCST450", "GCD560"],
    weight: 520,
    basePrice: 125000,
    factoryPrice: 106250,
    marketPrice: 137500
  },
  {
    model: "HPU-37",
    description: "大型液压站",
    power: 37,
    pressure: 25,
    tankCapacity: 400,
    applicableGearboxes: ["GCS560", "GCS710", "GCST560", "GCST710", "GCD560", "GCD710"],
    weight: 850,
    basePrice: 185000,
    factoryPrice: 157250,
    marketPrice: 203500
  }
];

// 导出汇总
export const cppSystemData = {
  gearboxes: cppGearboxes,
  propellers: cppPropellers,
  oilDistributors,
  hydraulicUnits: cppHydraulicUnits
};

export default cppSystemData;
