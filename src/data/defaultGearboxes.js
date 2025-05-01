// data/defaultGearboxes.js
/**
 * 默认齿轮箱数据，用于系统初始化时没有外部数据时提供基础运行能力
 */

// HC系列默认数据
export const defaultHCGearbox = {
  model: "HC400",
  inputSpeedRange: [1000, 2500],
  ratios: [2.00, 2.54, 3.00, 3.57, 4.05],
  transferCapacity: [0.210],
  thrust: 35,
  centerDistance: 240,
  weight: 500,
  dimensions: "500×780×740",
  controlType: "推拉软轴",
  price: 24000,
  marketPrice: 28000,
  basePrice: 24000,
  discountRate: 0
};

// HCQ系列默认数据
export const defaultHCQGearbox = {
  model: "HCQ400",
  inputSpeedRange: [1000, 2500],
  ratios: [2.00, 2.54, 3.00, 3.57, 4.05],
  transferCapacity: [0.220],
  thrust: 40,
  centerDistance: 250,
  weight: 550,
  dimensions: "520×800×760",
  controlType: "推拉软轴",
  price: 26000,
  marketPrice: 30000,
  basePrice: 26000,
  discountRate: 0
};

// GCS系列默认数据
export const defaultGCSGearbox = {
  model: "GCS300",
  inputSpeedRange: [1000, 2300],
  ratios: [2.00, 2.50, 3.00, 3.50],
  transferCapacity: [0.200],
  thrust: 45,
  centerDistance: 260,
  weight: 620,
  dimensions: "550×820×780",
  controlType: "推拉软轴",
  price: 28000,
  marketPrice: 32000,
  basePrice: 28000,
  discountRate: 0
};

// GW系列默认数据
export const defaultGWGearbox = {
  model: "GW350",
  inputSpeedRange: [900, 2200],
  ratios: [2.10, 2.60, 3.10, 3.65],
  transferCapacity: [0.215],
  thrust: 42,
  centerDistance: 255,
  weight: 580,
  dimensions: "530×810×770",
  controlType: "压力阀",
  price: 25000,
  marketPrice: 29000,
  basePrice: 25000,
  discountRate: 0
};

// HCM系列默认数据
export const defaultHCMGearbox = {
  model: "HCM500",
  inputSpeedRange: [1100, 2600],
  ratios: [2.20, 2.70, 3.20, 3.75, 4.30],
  transferCapacity: [0.230],
  thrust: 50,
  centerDistance: 270,
  weight: 650,
  dimensions: "560×830×790",
  controlType: "液压系统",
  price: 30000,
  marketPrice: 35000,
  basePrice: 30000,
  discountRate: 0
};

// DT系列默认数据
export const defaultDTGearbox = {
  model: "DT600",
  inputSpeedRange: [1200, 2700],
  ratios: [2.30, 2.80, 3.30, 3.85],
  transferCapacity: [0.250],
  thrust: 60,
  centerDistance: 290,
  weight: 750,
  dimensions: "580×850×810",
  controlType: "电控系统",
  price: 35000,
  marketPrice: 40000,
  basePrice: 35000,
  discountRate: 0
};

// 默认高弹性联轴器数据
export const defaultFlexibleCoupling = {
  model: "YOX450",
  torque: 5.8,
  maxSpeed: 2800,
  weight: 85,
  price: 12000,
  marketPrice: 14000,
  basePrice: 12000,
  discountRate: 0
};

// 默认备用泵数据
export const defaultStandbyPump = {
  model: "CBF20-36",
  flow: 20,
  pressure: 0.36,
  motorPower: 4.0,
  weight: 65,
  price: 8000,
  marketPrice: 9500,
  basePrice: 8000,
  discountRate: 0
};

// 导出默认的完整数据集 - 用于初始化应用
export const defaultGearboxData = {
  hcGearboxes: [defaultHCGearbox],
  hcqGearboxes: [defaultHCQGearbox],
  gcGearboxes: [defaultGCSGearbox],
  gwGearboxes: [defaultGWGearbox],
  hcmGearboxes: [defaultHCMGearbox],
  dtGearboxes: [defaultDTGearbox],
  flexibleCouplings: [defaultFlexibleCoupling],
  standbyPumps: [defaultStandbyPump]
};