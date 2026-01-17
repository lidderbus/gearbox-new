// src/data/standbyPumps.js
// 船用齿轮箱备用泵数据库
// 版本: v4.0 (2025-12-15) - 补充完整D系列泵型号
// 数据来源: 齿轮箱高弹和备用泵机组汇总表

export const standbyPumps = [
  // ========== D系列齿轮泵 (传统齿轮箱用) ==========
  {
    model: "2CY-3.3/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 3.3,
    pressure: 2.5,
    motorPower: 0.75,
    weight: 22,
    price: 6500,
    basePrice: 6500,
    discountRate: 0.10,
    factoryPrice: 5850,
    packagePrice: 5850,
    marketPrice: 6648,
    applicableGearbox: ["HC300", "HC400", "HC600A", "HCD350", "HCD400A"],
    notes: "中小型齿轮箱备用泵"
  },
  {
    model: "2CY-5/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 5.0,
    pressure: 2.5,
    motorPower: 1.1,
    weight: 25,
    price: 7500,
    basePrice: 7500,
    discountRate: 0.10,
    factoryPrice: 6750,
    packagePrice: 6750,
    marketPrice: 7670,
    applicableGearbox: ["HC1000", "HC1200", "HC1200/1", "HCD1000", "HCT1100", "HCW1100", "HCT1200", "HCT1200/1", "HCM1250", "HCA1000"],
    notes: "中型齿轮箱标配泵"
  },
  {
    model: "2CY-7.5/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 7.5,
    pressure: 2.5,
    motorPower: 1.5,
    weight: 30,
    price: 8500,
    basePrice: 8500,
    discountRate: 0.10,
    factoryPrice: 7650,
    packagePrice: 7650,
    marketPrice: 8693,
    applicableGearbox: ["HC1400", "HC1600", "HC2000", "HCD1400", "HCD1600", "HCD2000", "HCT1400", "HCT1400/2", "HCT1600", "HCT1600/1", "HCT2000", "HCT2000/1", "HCW1400", "HCM1400", "HCM1600", "GWC28.30", "GWC30.32", "GWC32.35", "GWC36.39", "GWC39.41", "GWC42.45", "GWC45.49"],
    notes: "中大型齿轮箱标配泵"
  },
  {
    model: "2CY-8.3/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 8.3,
    pressure: 2.5,
    motorPower: 1.5,
    weight: 32,
    price: 8800,
    basePrice: 8800,
    discountRate: 0.10,
    factoryPrice: 7920,
    packagePrice: 7920,
    marketPrice: 9000,
    applicableGearbox: ["HC1400", "HC1600", "HCD1400", "HCD1600", "GCS320", "GCS350", "GCS390"],
    notes: "中型齿轮箱备用泵"
  },
  {
    model: "2CY-12/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 12.0,
    pressure: 2.5,
    motorPower: 2.2,
    weight: 38,
    price: 9800,
    basePrice: 9800,
    discountRate: 0.10,
    factoryPrice: 8820,
    packagePrice: 8820,
    marketPrice: 10023,
    applicableGearbox: ["HC2000", "HCD2000", "HCT2000", "GCS410", "GCS450", "GCS490"],
    notes: "中大型齿轮箱备用泵"
  },
  {
    model: "2CY-14.2/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 14.2,
    pressure: 2.5,
    motorPower: 2.2,
    weight: 40,
    price: 10500,
    basePrice: 10500,
    discountRate: 0.10,
    factoryPrice: 9450,
    packagePrice: 9450,
    marketPrice: 10739,
    applicableGearbox: ["HC2700", "HCD2700", "HCT2700", "HCT2700/1", "GWC49.54", "GWC49.59", "GWC49.59A", "GWC52.59", "GWC52.59A", "GWC52.62"],
    notes: "大型齿轮箱备用泵"
  },
  {
    model: "2CY-17/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 17.0,
    pressure: 2.5,
    motorPower: 3.0,
    weight: 43,
    price: 12500,
    basePrice: 12500,
    discountRate: 0.10,
    factoryPrice: 11250,
    packagePrice: 11250,
    marketPrice: 12784,
    applicableGearbox: ["GCS540", "GCS590", "GCS660", "GCST26", "GCST33"],
    notes: "大型工程船用齿轮箱备用泵"
  },
  {
    model: "2CY-19.2/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 19.2,
    pressure: 2.5,
    motorPower: 3.0,
    weight: 45,
    price: 13500,
    basePrice: 13500,
    discountRate: 0.10,
    factoryPrice: 12150,
    packagePrice: 12150,
    marketPrice: 13807,
    applicableGearbox: ["GWC60.66", "GWC60.66A", "GWC60.74", "GWC60.74B"],
    notes: "大型工程船用齿轮箱备用泵"
  },
  {
    model: "2CY-21/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 21.0,
    pressure: 2.5,
    motorPower: 3.0,
    weight: 47,
    price: 14500,
    basePrice: 14500,
    discountRate: 0.10,
    factoryPrice: 13050,
    packagePrice: 13050,
    marketPrice: 14829,
    applicableGearbox: ["GCS750", "GCS760", "GCST44", "GCST66"],
    notes: "大型工程船用齿轮箱备用泵"
  },
  {
    model: "2CY-24.8/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 24.8,
    pressure: 2.5,
    motorPower: 4.0,
    weight: 50,
    price: 16500,
    basePrice: 16500,
    discountRate: 0.10,
    factoryPrice: 14850,
    packagePrice: 14850,
    marketPrice: 16875,
    applicableGearbox: ["GWC63.71", "GWC66.75", "GWC70.76", "GWC70.76C", "GWC70.85", "GWC70.85A", "GWC75.90", "GWC78.88", "GWC78.88A"],
    notes: "超大型工程船用齿轮箱备用泵"
  },
  {
    model: "2CY-28/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 28.0,
    pressure: 2.5,
    motorPower: 4.0,
    weight: 55,
    price: 17500,
    basePrice: 17500,
    discountRate: 0.10,
    factoryPrice: 15750,
    packagePrice: 15750,
    marketPrice: 17897,
    applicableGearbox: ["GCS850", "GCST77", "GCST91", "2GWH1060", "2GWH1830"],
    notes: "超大型工程船用齿轮箱备用泵"
  },
  {
    model: "2CY-34.5/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 34.5,
    pressure: 2.5,
    motorPower: 5.5,
    weight: 65,
    price: 16000,
    basePrice: 16000,
    discountRate: 0.10,
    factoryPrice: 14400,
    packagePrice: 14400,
    marketPrice: 16364,
    applicableGearbox: ["GCST108", "GCST115", "2GWH3140"],
    notes: "特大流量备用泵"
  },
  {
    model: "2CY-38/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 38.0,
    pressure: 2.5,
    motorPower: 5.5,
    weight: 70,
    price: 17000,
    basePrice: 17000,
    discountRate: 0.10,
    factoryPrice: 15300,
    packagePrice: 15300,
    marketPrice: 17386,
    applicableGearbox: ["GCST135", "2GWH5410"],
    notes: "特大流量备用泵"
  },
  {
    model: "2CY-48.2/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 48.2,
    pressure: 2.5,
    motorPower: 7.5,
    weight: 80,
    price: 19000,
    basePrice: 19000,
    discountRate: 0.10,
    factoryPrice: 17100,
    packagePrice: 17100,
    marketPrice: 19432,
    applicableGearbox: ["GCST170", "2GWH7050"],
    notes: "超大流量备用泵"
  },
  {
    model: "2CY-58/2.5D",
    series: "2CY-D",
    type: "mechanical",
    flow: 58.0,
    pressure: 2.5,
    motorPower: 11.0,
    weight: 95,
    price: 22000,
    basePrice: 22000,
    discountRate: 0.10,
    factoryPrice: 19800,
    packagePrice: 19800,
    marketPrice: 22499,
    applicableGearbox: ["2GWH9250"],
    notes: "超大流量备用泵"
  },

  // ========== DT系列专用电动备用泵 (2CYA系列) ==========
  {
    model: "2CYA-1.1/0.8D",
    series: "2CYA",
    type: "electric",
    flow: 1.1,
    pressure: 0.8,
    motorPower: 0.37,
    voltage: "380V",
    phase: "三相",
    weight: 20,
    price: 5500,
    basePrice: 5500,
    discountRate: 0.10,
    factoryPrice: 4950,
    packagePrice: 4950,
    marketPrice: 5625,
    applicableGearbox: ["DT180", "DT240", "DT580", "DT770"],
    notes: "DT系列小功率电推系统专用电动备用泵"
  },
  {
    model: "2CYA-1.7/0.8D",
    series: "2CYA",
    type: "electric",
    flow: 1.7,
    pressure: 0.8,
    motorPower: 0.55,
    voltage: "380V",
    phase: "三相",
    weight: 25,
    price: 6500,
    basePrice: 6500,
    discountRate: 0.10,
    factoryPrice: 5850,
    packagePrice: 5850,
    marketPrice: 6648,
    applicableGearbox: ["DT900", "DT1400"],
    notes: "DT系列中功率电推系统专用电动备用泵"
  },
  {
    model: "2CYA-2.2/1D",
    series: "2CYA",
    type: "electric",
    flow: 2.2,
    pressure: 1.0,
    motorPower: 0.75,
    voltage: "380V",
    phase: "三相",
    weight: 30,
    price: 7500,
    basePrice: 7500,
    discountRate: 0.10,
    factoryPrice: 6750,
    packagePrice: 6750,
    marketPrice: 7670,
    applicableGearbox: ["DT1500", "DT2400"],
    notes: "DT系列大功率电推系统专用电动备用泵"
  },

  // ========== 其他型号 (兼容旧数据) ==========
  {
    model: "2CY10/3.0",
    series: "2CY",
    type: "mechanical",
    flow: 10.0,
    pressure: 3.0,
    motorPower: 2.2,
    weight: 35,
    price: 9000,
    basePrice: 9000,
    discountRate: 0.10,
    factoryPrice: 8100,
    packagePrice: 8100,
    marketPrice: 9205,
    applicableGearbox: [],
    notes: ""
  },
  {
    model: "2CY16/4.0",
    series: "2CY",
    type: "mechanical",
    flow: 16.0,
    pressure: 4.0,
    motorPower: 3.0,
    weight: 45,
    price: 11000,
    basePrice: 11000,
    discountRate: 0.10,
    factoryPrice: 9900,
    packagePrice: 9900,
    marketPrice: 11250,
    applicableGearbox: [],
    notes: ""
  },
  {
    model: "2CY25/6.3",
    series: "2CY",
    type: "mechanical",
    flow: 25.0,
    pressure: 6.3,
    motorPower: 5.5,
    weight: 60,
    price: 15000,
    basePrice: 15000,
    discountRate: 0.10,
    factoryPrice: 13500,
    packagePrice: 13500,
    marketPrice: 15341,
    applicableGearbox: [],
    notes: ""
  },
  {
    model: "SPF20-40",
    series: "SPF",
    type: "mechanical",
    flow: 20,
    pressure: 4.0,
    motorPower: 4.0,
    weight: 50,
    price: 8000,
    basePrice: 8000,
    discountRate: 0.10,
    factoryPrice: 7200,
    packagePrice: 7200,
    marketPrice: 7920,
    applicableGearbox: [],
    notes: ""
  }
];

// 泵型号分类
export const pumpCategories = {
  "D系列齿轮泵": [
    "2CY-3.3/2.5D",
    "2CY-5/2.5D",
    "2CY-7.5/2.5D",
    "2CY-8.3/2.5D",
    "2CY-12/2.5D",
    "2CY-14.2/2.5D",
    "2CY-17/2.5D",
    "2CY-19.2/2.5D",
    "2CY-21/2.5D",
    "2CY-24.8/2.5D",
    "2CY-28/2.5D",
    "2CY-34.5/2.5D",
    "2CY-38/2.5D",
    "2CY-48.2/2.5D",
    "2CY-58/2.5D"
  ],
  "DT系列电动泵": [
    "2CYA-1.1/0.8D",
    "2CYA-1.7/0.8D",
    "2CYA-2.2/1D"
  ],
  "其他型号": [
    "2CY10/3.0",
    "2CY16/4.0",
    "2CY25/6.3",
    "SPF20-40"
  ]
};

// 泵系列信息
export const pumpSeriesInfo = {
  "2CY-D": {
    name: "D系列齿轮泵",
    description: "传统船用齿轮箱备用泵，适用于HC/HCD/GWC/GCS/GCST/2GWH等系列",
    pressureRange: "2.5 MPa",
    flowRange: "3.3-58 L/min",
    type: "mechanical"
  },
  "2CYA": {
    name: "DT系列专用电动泵",
    description: "电力推进系统专用电动备用泵，适用于DT系列齿轮箱",
    pressureRange: "0.8-1.0 MPa",
    flowRange: "1.1-2.2 L/min",
    type: "electric",
    voltage: "380V 三相"
  },
  "2CY": {
    name: "通用齿轮泵",
    description: "通用型齿轮泵，适用于多种应用场景",
    pressureRange: "3.0-6.3 MPa",
    flowRange: "10-25 L/min",
    type: "mechanical"
  },
  "SPF": {
    name: "SPF系列泵",
    description: "特种应用泵",
    pressureRange: "4.0 MPa",
    flowRange: "20 L/min",
    type: "mechanical"
  }
};

// 根据齿轮箱型号获取推荐泵
export function getRecommendedPump(gearboxModel) {
  const pump = standbyPumps.find(p =>
    p.applicableGearbox && p.applicableGearbox.includes(gearboxModel)
  );
  return pump || null;
}

// 根据流量和压力需求选择泵
export function selectPumpByRequirement(flowRequired, pressureRequired, options = {}) {
  const { seriesPreference, type } = options;

  let candidates = standbyPumps.filter(pump =>
    pump.flow >= flowRequired && pump.pressure >= pressureRequired
  );

  // 按系列筛选
  if (seriesPreference) {
    candidates = candidates.filter(p => p.series === seriesPreference);
  }

  // 按类型筛选 (electric/mechanical)
  if (type) {
    candidates = candidates.filter(p => p.type === type);
  }

  // 排序: 优先选择流量和压力接近需求的泵
  return candidates.sort((a, b) => {
    const scoreA = Math.abs(a.flow - flowRequired) + Math.abs(a.pressure - pressureRequired) * 10;
    const scoreB = Math.abs(b.flow - flowRequired) + Math.abs(b.pressure - pressureRequired) * 10;
    return scoreA - scoreB;
  });
}

// 获取DT系列专用泵
export function getDTSeriesPumps() {
  return standbyPumps.filter(p => p.series === '2CYA');
}

// 获取传统D系列泵
export function getDSeriesPumps() {
  return standbyPumps.filter(p => p.series === '2CY-D');
}

// 检查是否为电动泵
export function isElectricPump(pumpModel) {
  const pump = standbyPumps.find(p => p.model === pumpModel);
  return pump?.type === 'electric';
}

// Default export
export default standbyPumps;
