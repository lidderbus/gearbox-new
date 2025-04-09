// src/data/initialData.js
export const initialData = {
  // HC系列齿轮箱数据 (中小功率)
  hcGearboxes: [
    {
      model: "HC300",
      inputSpeedRange: [750, 2500],
      ratios: [1.87, 2.04, 2.54, 3.00, 3.53, 4.10, 4.47, 4.61, 4.94, 5.44],
      transferCapacity: [0.257, 0.243, 0.221, 0.184, 0.147, 0.125],
      thrust: 50,
      centerDistance: 264,
      weight: 680,
      price: 23000,
      controlType: "推拉软轴/电控/气控"
    },
    {
      model: "HC400",
      inputSpeedRange: [1000, 1800],
      ratios: [1.50, 1.77, 2.04, 2.50, 2.86, 3.00, 3.25, 3.33, 3.42, 3.60, 3.96, 4.33, 4.43, 4.70, 5.00],
      transferCapacity: [0.331, 0.279, 0.190],
      thrust: 82,
      centerDistance: 264,
      weight: 820,
      price: 32150,
      controlType: "推拉软轴/电控/气控"
    },
    {
      model: "HC600A",
      inputSpeedRange: [1000, 2100],
      ratios: [2.00, 2.48, 2.63, 3.00, 3.58, 3.89],
      transferCapacity: [0.490],
      thrust: 90,
      centerDistance: 320,
      weight: 1300,
      price: 57200,
      controlType: "推拉软轴/电控/气控"
    },
    {
      model: "HC1000",
      inputSpeedRange: [600, 2100],
      ratios: [2.00, 2.17, 2.50, 2.64, 3.04, 3.23, 3.48, 3.59, 4.06, 5.47, 5.83],
      transferCapacity: [0.735, 0.65],
      thrust: 110,
      centerDistance: 335,
      weight: 1500,
      price: 81200,
      controlType: "推拉软轴/电控/气控"
    },
    {
      model: "HC1200",
      inputSpeedRange: [600, 1900],
      ratios: [1.60, 2.03, 2.48, 2.50, 2.96, 3.18, 3.33, 3.55, 3.79, 4.06, 4.20, 4.47],
      transferCapacity: [0.93, 0.88, 0.80, 0.695, 0.650],
      thrust: 120,
      centerDistance: 380,
      weight: 1870,
      price: 92000,
      controlType: "推拉软轴/电控/气控"
    },
    {
      model: "HC1600",
      inputSpeedRange: [500, 1650],
      ratios: [2.03, 2.54, 3.00, 3.50, 4.00],
      transferCapacity: [1.26],
      thrust: 170,
      centerDistance: 415,
      weight: 3000,
      price: 150000,
      controlType: "推拉软轴/电控/气控"
    },
    {
      model: "HC2000",
      inputSpeedRange: [600, 1500],
      ratios: [1.97, 2.28, 2.52, 3.13, 3.52, 3.91, 4.40, 4.5],
      transferCapacity: [1.58, 1.45, 1.36],
      thrust: 190,
      centerDistance: 450,
      weight: 3700,
      price: 180000,
      controlType: "推拉软轴/电控/气控"
    }
  ],
  
  // GW系列齿轮箱数据 (大功率)
  gwGearboxes: [
    {
      model: "GWC28.30",
      inputSpeedRange: [400, 2000],
      ratios: [2.06, 2.51, 3.08, 3.54, 4.05, 4.54, 5.09, 5.59, 6.14],
      transferCapacity: [0.865, 0.711, 0.578, 0.504, 0.44, 0.393, 0.35, 0.319, 0.29],
      thrust: 80,
      centerDistance: 280,
      weight: 1230,
      price: 72500,
      controlType: "气控/电控"
    },
    {
      model: "GWC30.32",
      inputSpeedRange: [400, 2000],
      ratios: [2.03, 2.55, 3.04, 3.52, 4.00, 4.55, 5.05, 5.64, 6.05],
      transferCapacity: [1.122, 0.894, 0.75, 0.647, 0.570, 0.501, 0.451, 0.404, 0.376],
      thrust: 100,
      centerDistance: 300,
      weight: 1460,
      price: 90800,
      controlType: "气控/电控"
    },
    {
      model: "GWC36.39",
      inputSpeedRange: [400, 1900],
      ratios: [1.97, 2.45, 2.98, 3.47, 3.95, 4.40, 5.01, 5.47, 5.97],
      transferCapacity: [1.92, 1.546, 1.272, 1.09, 0.96, 0.862, 0.756, 0.693, 0.634],
      thrust: 140,
      centerDistance: 360,
      weight: 2080,
      price: 123800,
      controlType: "气控/电控"
    },
    {
      model: "GWC45.49",
      inputSpeedRange: [400, 1600],
      ratios: [1.97, 2.47, 2.89, 3.47, 3.95, 4.37, 4.85, 5.50, 5.98],
      transferCapacity: [4.240, 3.392, 2.890, 2.414, 2.120, 1.913, 1.725, 1.520, 1.398],
      thrust: 270,
      centerDistance: 450,
      weight: 5500,
      price: 275800,
      controlType: "气控/电控"
    },
    {
      model: "GWC52.59",
      inputSpeedRange: [400, 1200],
      ratios: [1.93, 2.48, 2.96, 3.53, 3.95, 4.43, 4.97, 5.40, 5.93],
      transferCapacity: [7.438, 5.797, 4.853, 4.081, 3.640, 3.246, 2.893, 2.663, 2.426],
      thrust: 300,
      centerDistance: 520,
      weight: 11000,
      price: 545000,
      controlType: "气控/电控"
    },
    {
      model: "GWC60.66",
      inputSpeedRange: [400, 1200],
      ratios: [2.01, 2.50, 3.07, 3.57, 3.95, 4.49, 5.04, 5.51, 6.04, 6.50, 6.94],
      transferCapacity: [9.913, 7.982, 6.492, 5.581, 4.923, 4.448, 3.927, 3.622, 3.261, 3.06, 3],
      thrust: 450,
      centerDistance: 600,
      weight: 14500,
      price: 800000,
      controlType: "气控/电控"
    },
    {
      model: "GWC70.76",
      inputSpeedRange: [300, 950],
      ratios: [2.05, 2.53, 3.09, 3.58, 3.95, 4.57, 5.05, 5.58, 6.17],
      transferCapacity: [15.643, 12.673, 10.364, 8.943, 8.111, 7.005, 6.348, 5.745, 5.191],
      thrust: 750,
      centerDistance: 700,
      weight: 22500,
      price: 1100000,
      controlType: "气控/电控"
    }
  ],
  
  // HCM系列齿轮箱数据 (轻型高速)
  hcmGearboxes: [
    {
      model: "HCM70",
      inputSpeedRange: [1500, 4000],
      ratios: [1.00, 1.30, 2.00, 2.48, 2.78, 2.90, 3.00],
      transferCapacity: [0.0887, 0.0591, 0.0365, 0.0294, 0.0275, 0.0265, 0.0258],
      thrust: 14,
      centerDistance: 127,
      weight: 46,
      price: 56000,
      controlType: "电控"
    },
    {
      model: "HCM160",
      inputSpeedRange: [1500, 3600],
      ratios: [1.00, 1.57, 1.75, 1.96, 2.50, 2.48, 2.78, 2.90, 3.00],
      transferCapacity: [0.1783, 0.1136, 0.1021, 0.0914, 0.0718, 0.0726, 0.0653, 0.0625, 0.0603],
      thrust: 25,
      centerDistance: 155,
      weight: 98,
      price: 75000,
      controlType: "电控"
    },
    {
      model: "HCM250",
      inputSpeedRange: [1500, 3000],
      ratios: [1.22, 1.97, 2.92],
      transferCapacity: [0.2192, 0.1423, 0.1084],
      thrust: 30,
      centerDistance: 180,
      weight: 180,
      price: 89000,
      controlType: "电控"
    },
    {
      model: "HCM435",
      inputSpeedRange: [1500, 3000],
      ratios: [0.85, 0.93, 1.00, 1.11, 1.23, 1.53, 1.78, 2.03, 2.21, 2.60, 2.96],
      transferCapacity: [0.3196, 0.2917, 0.2714, 0.2449, 0.2210, 0.1780, 0.1529, 0.1338, 0.1232, 0.1048, 0.0924],
      thrust: 27.5,
      centerDistance: 175,
      weight: 160,
      price: 118000,
      controlType: "电控"
    },
    {
      model: "HCM600",
      inputSpeedRange: [1500, 3000],
      ratios: [1.11, 1.26, 1.74, 2.00, 2.59],
      transferCapacity: [0.4476, 0.3997, 0.3107, 0.2694, 0.2141],
      thrust: 40,
      centerDistance: 200,
      weight: 248,
      price: 138000,
      controlType: "电控"
    },
    {
      model: "HCM1250",
      inputSpeedRange: [1500, 2500],
      ratios: [1.53, 2.03, 2.50, 2.96],
      transferCapacity: [0.9435, 0.9157, 0.7466, 0.6319],
      thrust: 110,
      centerDistance: 340,
      weight: 950,
      price: 260000,
      controlType: "电控"
    },
    {
      model: "HCM1600",
      inputSpeedRange: [1000, 2100],
      ratios: [1.55, 1.83, 2.04, 2.23, 2.57, 2.77, 2.91, 3.17],
      transferCapacity: [1.4031, 1.2984, 1.1518, 1.0584, 0.9183, 0.8535, 0.8053, 0.7386],
      thrust: 135,
      centerDistance: 340,
      weight: 1230,
      price: 320000,
      controlType: "电控"
    }
  ],
  
  // DT系列齿轮箱数据 (电推)
  dtGearboxes: [
    {
      model: "DT180",
      inputSpeedRange: [750, 1500],
      ratios: [1.53, 2.03, 2.50, 2.96, 3.54, 3.96, 4.48, 4.96, 5.52, 5.98],
      transferCapacity: [0.083, 0.067, 0.056, 0.047, 0.042, 0.033, 0.030, 0.024, 0.014],
      thrust: 14.7,
      centerDistance: 142,
      weight: 130,
      price: 23000,
      controlType: "电控"
    },
    {
      model: "DT240",
      inputSpeedRange: [750, 1500],
      ratios: [1.53, 2.03, 2.50, 2.96, 3.55, 4.00, 4.53, 5.05],
      transferCapacity: [0.160, 0.150, 0.134, 0.092, 0.073, 0.050, 0.040, 0.022, 0.020],
      thrust: 30,
      centerDistance: 165,
      weight: 240,
      price: 39000,
      controlType: "电控"
    },
    {
      model: "DT580",
      inputSpeedRange: [750, 1500],
      ratios: [1.46, 2.05, 2.55, 2.95, 3.48, 3.96, 4.52, 4.94, 5.41, 5.83],
      transferCapacity: [0.336, 0.270, 0.250, 0.210, 0.160, 0.140, 0.123, 0.112, 0.102, 0.086],
      thrust: 40,
      centerDistance: 203,
      weight: 370,
      price: 52000,
      controlType: "电控"
    },
    {
      model: "DT770",
      inputSpeedRange: [750, 1500],
      ratios: [1.54, 1.96, 2.50, 3.05, 3.47, 3.95, 4.57, 5.10, 5.62, 5.98],
      transferCapacity: [0.480, 0.443, 0.400, 0.327, 0.283, 0.214, 0.186, 0.166, 0.134, 0.106],
      thrust: 50,
      centerDistance: 220,
      weight: 480,
      price: 58000,
      controlType: "电控"
    },
    {
      model: "DT900",
      inputSpeedRange: [750, 1500],
      ratios: [1.50, 2.03, 2.48, 2.96, 3.57, 4.05, 4.52, 4.99, 5.50, 5.94],
      transferCapacity: [0.634, 0.527, 0.446, 0.408, 0.332, 0.243, 0.206, 0.173, 0.133],
      thrust: 60,
      centerDistance: 264,
      weight: 700,
      price: 63000,
      controlType: "电控"
    },
    {
      model: "DT1400",
      inputSpeedRange: [750, 1500],
      ratios: [1.47, 1.96, 2.48, 3.04, 3.44, 4.09, 4.44, 4.95, 5.53, 6.08],
      transferCapacity: [0.800, 0.770, 0.663, 0.566, 0.519, 0.451, 0.416, 0.333, 0.300, 0.272],
      thrust: 90,
      centerDistance: 290,
      weight: 900,
      price: 100000,
      controlType: "电控"
    },
    {
      model: "DT1500",
      inputSpeedRange: [750, 1500],
      ratios: [1.54, 1.96, 2.52, 3.05, 3.47, 3.95, 4.45, 5.00, 5.49, 6.03],
      transferCapacity: [1.125, 0.967, 0.813, 0.713, 0.637, 0.537, 0.410, 0.313, 0.285, 0.259],
      thrust: 100,
      centerDistance: 310,
      weight: 1100,
      price: 120000,
      controlType: "电控"
    }
  ],
  
  // 高弹性联轴器数据
  flexibleCouplings: [
    {
      model: "HGTHB3.2",
      torque: 3.2,
      maxSpeed: 5000,
      weight: 60,
      price: 11000
    },
    {
      model: "HGTHB5",
      torque: 5.0,
      maxSpeed: 4500,
      weight: 80,
      price: 13000
    },
    {
      model: "HGTHB6.3",
      torque: 6.3,
      maxSpeed: 4000,
      weight: 90,
      price: 15400
    },
    {
      model: "HGTHB8",
      torque: 8.0,
      maxSpeed: 3800,
      weight: 110,
      price: 18500
    },
    {
      model: "HGTHB10",
      torque: 10.0,
      maxSpeed: 3500,
      weight: 130,
      price: 22000
    },
    {
      model: "HGTHB12.5",
      torque: 12.5,
      maxSpeed: 3200,
      weight: 160,
      price: 25000
    },
    {
      model: "HGTHB16",
      torque: 16.0,
      maxSpeed: 3000,
      weight: 200,
      price: 29500
    },
    {
      model: "HGTHB20",
      torque: 20.0,
      maxSpeed: 2800,
      weight: 240,
      price: 37400
    },
    {
      model: "HGTHB25",
      torque: 25.0,
      maxSpeed: 2500,
      weight: 300,
      price: 47000
    },
    {
      model: "HGT1020",
      torque: 10.0,
      maxSpeed: 3000,
      weight: 280,
      price: 11000
    },
    {
      model: "HGT1220",
      torque: 12.5,
      maxSpeed: 2800,
      weight: 340,
      price: 13000
    },
    {
      model: "HGT1620",
      torque: 16.0,
      maxSpeed: 2600,
      weight: 400,
      price: 15400
    },
    {
      model: "HGT2020",
      torque: 20.0,
      maxSpeed: 2400,
      weight: 480,
      price: 18500
    },
    {
      model: "HGT2520",
      torque: 25.0,
      maxSpeed: 2200,
      weight: 540,
      price: 22000
    },
    {
      model: "HGT3020",
      torque: 31.5,
      maxSpeed: 2000,
      weight: 600,
      price: 25000
    },
    {
      model: "HGT4020",
      torque: 40.0,
      maxSpeed: 1800,
      weight: 720,
      price: 29500
    },
    {
      model: "HGT5020",
      torque: 50.0,
      maxSpeed: 1600,
      weight: 900,
      price: 37400
    },
    {
      model: "HGT6320",
      torque: 63.0,
      maxSpeed: 1400,
      weight: 1100,
      price: 47000
    },
    {
      model: "HGT8020",
      torque: 80.0,
      maxSpeed: 1200,
      weight: 1350,
      price: 58000
    },
    {
      model: "HGT10020",
      torque: 100.0,
      maxSpeed: 1000,
      weight: 1650,
      price: 71500
    },
    {
      model: "HGT12520",
      torque: 125.0,
      maxSpeed: 900,
      weight: 2000,
      price: 85800
    },
    {
      model: "HGT16020",
      torque: 160.0,
      maxSpeed: 800,
      weight: 2400,
      price: 118000
    },
    {
      model: "HGT20020",
      torque: 200.0,
      maxSpeed: 700,
      weight: 2850,
      price: 154000
    },
    {
      model: "HGT25020",
      torque: 250.0,
      maxSpeed: 600,
      weight: 3300,
      price: 195000
    },
    {
      model: "HGTQ1215",
      torque: 12.15,
      maxSpeed: 3000,
      weight: 150,
      price: 25000
    }
  ],
  
  // 备用泵数据
  standbyPumps: [
    {
      model: "2CY7.5/2.5D",
      flow: 7.5,
      pressure: 2.5,
      motorPower: 3.0,
      weight: 45,
      price: 5800
    },
    {
      model: "2CY14.2/2.5D",
      flow: 14.2,
      pressure: 2.5,
      motorPower: 5.5,
      weight: 65,
      price: 8500
    },
    {
      model: "2CY19.2/2.5D",
      flow: 19.2,
      pressure: 2.5,
      motorPower: 7.5,
      weight: 80,
      price: 10800
    },
    {
      model: "2CY24.8/2.5D",
      flow: 24.8,
      pressure: 2.5,
      motorPower: 11.0,
      weight: 110,
      price: 14500
    },
    {
      model: "2CY34.5/2.5D",
      flow: 34.5,
      pressure: 2.5,
      motorPower: 15.0,
      weight: 150,
      price: 19500
    },
    {
      model: "2CY48.2/2.5D",
      flow: 48.2,
      pressure: 2.5,
      motorPower: 22.0,
      weight: 215,
      price: 26800
    }
  ]
};

// 初始数据配置
export const initialGearboxData = {
  // HC系列
  '40A': {
    inputSpeedRange: [1000, 3000],
    ratios: [2.52, 3.05, 3.50],
    transferCapacity: 40,
    thrust: 2000,
    centerDistance: 200,
    weight: 120,
    dimensions: { length: 600, width: 400, height: 500 }
  },
  '120B': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 120,
    thrust: 5000,
    centerDistance: 300,
    weight: 350,
    dimensions: { length: 800, width: 500, height: 600 }
  },
  '120C': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 120,
    thrust: 5000,
    centerDistance: 300,
    weight: 380,
    dimensions: { length: 800, width: 500, height: 600 }
  },
  '135': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 135,
    thrust: 6000,
    centerDistance: 350,
    weight: 420,
    dimensions: { length: 850, width: 550, height: 650 }
  },
  '135A': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 135,
    thrust: 6000,
    centerDistance: 350,
    weight: 450,
    dimensions: { length: 850, width: 550, height: 650 }
  },
  'HC138': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 138,
    thrust: 6500,
    centerDistance: 380,
    weight: 480,
    dimensions: { length: 900, width: 600, height: 700 }
  },
  'HCD138': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 138,
    thrust: 6500,
    centerDistance: 380,
    weight: 520,
    dimensions: { length: 900, width: 600, height: 700 }
  },
  '300': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 300,
    thrust: 12000,
    centerDistance: 450,
    weight: 850,
    dimensions: { length: 1100, width: 700, height: 800 }
  },
  'J300': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 300,
    thrust: 12000,
    centerDistance: 450,
    weight: 900,
    dimensions: { length: 1100, width: 700, height: 800 }
  },
  'HC300': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 300,
    thrust: 12000,
    centerDistance: 450,
    weight: 880,
    dimensions: { length: 1100, width: 700, height: 800 }
  },
  'D300A': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 300,
    thrust: 12000,
    centerDistance: 450,
    weight: 950,
    dimensions: { length: 1100, width: 700, height: 800 }
  },
  'T300': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 300,
    thrust: 12000,
    centerDistance: 450,
    weight: 1000,
    dimensions: { length: 1100, width: 700, height: 800 }
  },
  'T300/1': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 300,
    thrust: 12000,
    centerDistance: 450,
    weight: 1050,
    dimensions: { length: 1100, width: 700, height: 800 }
  },
  'HC400': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 400,
    thrust: 15000,
    centerDistance: 500,
    weight: 1200,
    dimensions: { length: 1300, width: 800, height: 900 }
  },
  'HCD400A': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 400,
    thrust: 15000,
    centerDistance: 500,
    weight: 1250,
    dimensions: { length: 1300, width: 800, height: 900 }
  },
  'HCT400A': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 400,
    thrust: 15000,
    centerDistance: 500,
    weight: 1300,
    dimensions: { length: 1300, width: 800, height: 900 }
  },
  'HCT400A/1': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 400,
    thrust: 15000,
    centerDistance: 500,
    weight: 1350,
    dimensions: { length: 1300, width: 800, height: 900 }
  },
  'HC600A': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 600,
    thrust: 20000,
    centerDistance: 600,
    weight: 1800,
    dimensions: { length: 1500, width: 900, height: 1000 }
  },
  'HCD600A': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 600,
    thrust: 20000,
    centerDistance: 600,
    weight: 1850,
    dimensions: { length: 1500, width: 900, height: 1000 }
  },
  'HCT600A': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 600,
    thrust: 20000,
    centerDistance: 600,
    weight: 1900,
    dimensions: { length: 1500, width: 900, height: 1000 }
  },
  'HCT600A/1': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 600,
    thrust: 20000,
    centerDistance: 600,
    weight: 1950,
    dimensions: { length: 1500, width: 900, height: 1000 }
  },
  'HCD800': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 800,
    thrust: 25000,
    centerDistance: 700,
    weight: 2500,
    dimensions: { length: 1700, width: 1000, height: 1100 }
  },
  'HCT800': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 800,
    thrust: 25000,
    centerDistance: 700,
    weight: 2600,
    dimensions: { length: 1700, width: 1000, height: 1100 }
  },
  'HCT800/1': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 800,
    thrust: 25000,
    centerDistance: 700,
    weight: 2700,
    dimensions: { length: 1700, width: 1000, height: 1100 }
  },
  'HCT800/2': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 800,
    thrust: 25000,
    centerDistance: 700,
    weight: 2800,
    dimensions: { length: 1700, width: 1000, height: 1100 }
  },
  'HCT800/3': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 800,
    thrust: 25000,
    centerDistance: 700,
    weight: 2900,
    dimensions: { length: 1700, width: 1000, height: 1100 }
  },
  'HC1000': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 1000,
    thrust: 30000,
    centerDistance: 800,
    weight: 3200,
    dimensions: { length: 1900, width: 1100, height: 1200 }
  },
  'HCD1000': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 1000,
    thrust: 30000,
    centerDistance: 800,
    weight: 3300,
    dimensions: { length: 1900, width: 1100, height: 1200 }
  },
  'HC1200': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 1200,
    thrust: 35000,
    centerDistance: 900,
    weight: 3800,
    dimensions: { length: 2100, width: 1200, height: 1300 }
  },
  'HC1200/1': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 1200,
    thrust: 35000,
    centerDistance: 900,
    weight: 3900,
    dimensions: { length: 2100, width: 1200, height: 1300 }
  },
  'HCT1200': {
    inputSpeedRange: [1000, 2500],
    ratios: [2.96, 3.35],
    transferCapacity: 1200,
    thrust: 35000,
    centerDistance: 900,
    weight: 4000,
    dimensions: { length: 2100, width: 1200, height: 1300 }
  }
};