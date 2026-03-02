// src/data/hcCouplingData.js
// HC高弹联轴器及主机配套数据 - 基于2021-04-26大功率汇总Excel
// 包含完整的联轴器系列规格、飞轮配置和齿轮箱匹配映射

/**
 * 联轴器系列技术参数
 * 包含扭矩、转速、重量等核心规格
 */
export const couplingSeriespecs = {
  // HGTHT系列 - 适用于800系列齿轮箱
  'HGTHT8.6': {
    name: 'HGTHT8.6',
    fullName: 'HGTHT8.6高弹性联轴器',
    torque: 8.6,           // 额定扭矩 (kN·m)
    maxTorque: 21.5,       // 最大扭矩 (kN·m)
    maxSpeed: 2000,        // 最高转速 (rpm)
    weight: 180,           // 重量 (kg)
    basePrice: 32000,      // 基础价格 (元)
    applicableGearboxes: ['HCD800', 'HCT800', 'HCT800/1', 'HCT800/2', 'HCT800/3'],
    flywheelOptions: ['SAE14"', 'SAE16"', 'SAE18"', 'SAE21"', 'φ505', 'φ518'],
    hasDetachable: true,   // 是否有可拆式版本
    hasCover: false,       // 是否有带罩壳版本
    description: '适用于800系列大功率齿轮箱'
  },

  // HGTHB系列 - 无罩壳标准型
  'HGTHB5': {
    name: 'HGTHB5',
    fullName: 'HGTHB5高弹性联轴器',
    torque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 3000,
    weight: 130,
    basePrice: 22000,
    applicableGearboxes: ['HC1000', 'HCD1000'],
    flywheelOptions: ['SAE18"', 'SAE21"', 'φ505', 'φ518', 'φ640', 'φ640A'],
    hasDetachable: true,
    hasCover: true,        // HGTHJB5
    description: '适用于1000系列齿轮箱，常规配置无罩'
  },

  'HGTHB6.3': {
    name: 'HGTHB6.3',
    fullName: 'HGTHB6.3高弹性联轴器',
    torque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 3000,
    weight: 155,
    basePrice: 24500,
    applicableGearboxes: ['HC1200', 'HC1200/1', 'HCT1100', 'HCT1200', 'HCT1200/1'],
    flywheelOptions: ['SAE16"', 'SAE18"', 'SAE21"', 'φ290', 'φ518', 'φ640', 'φ640A'],
    hasDetachable: true,
    hasCover: true,        // HGTHJB6.3
    description: '适用于1100-1200系列齿轮箱'
  },

  'HGTHB8': {
    name: 'HGTHB8',
    fullName: 'HGTHB8高弹性联轴器',
    torque: 8.0,
    maxTorque: 20.0,
    maxSpeed: 2800,
    weight: 200,
    basePrice: 29500,
    applicableGearboxes: ['HCD1400', 'HCT1400', 'HCT1400/2'],
    flywheelOptions: ['SAE18"', 'SAE21"', 'φ518', 'φ540', 'φ640', 'φ640A', 'φ720'],
    hasDetachable: true,
    hasCover: true,        // HGTHJB8
    description: '适用于1400系列齿轮箱'
  },

  'HGTHB10': {
    name: 'HGTHB10',
    fullName: 'HGTHB10高弹性联轴器',
    torque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 2500,
    weight: 240,
    basePrice: 37400,
    applicableGearboxes: ['HC1600', 'HCD1600', 'HCT1600', 'HCT1600/1'],
    flywheelOptions: ['SAE18"', 'SAE21"', 'φ518', 'φ540'],
    hasDetachable: false,
    hasCover: true,        // HGTHJB10
    description: '适用于1600系列齿轮箱'
  },

  'HGTHB12.5': {
    name: 'HGTHB12.5',
    fullName: 'HGTHB12.5高弹性联轴器',
    torque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 2200,
    weight: 300,
    basePrice: 47000,
    applicableGearboxes: ['HC2000', 'HCD2000', 'HCT2000', 'HCT2000/1'],
    flywheelOptions: ['SAE18"', 'SAE21"', 'φ518', 'φ640', 'φ640A', 'φ700', 'φ770'],
    hasDetachable: false,
    hasCover: false,
    description: '适用于2000系列齿轮箱'
  },

  'HGTHB16': {
    name: 'HGTHB16',
    fullName: 'HGTHB16高弹性联轴器',
    torque: 16.0,
    maxTorque: 40.0,
    maxSpeed: 2000,
    weight: 380,
    basePrice: 58000,
    applicableGearboxes: ['HCD2700', 'HC2700'],
    flywheelOptions: ['φ770'],
    hasDetachable: true,
    hasCover: false,
    description: '适用于2700系列齿轮箱'
  },

  // HGTHJB系列 - 带罩壳加强型
  'HGTHJB5': {
    name: 'HGTHJB5',
    fullName: 'HGTHJB5带罩壳高弹性联轴器',
    torque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 3000,
    weight: 160,
    basePrice: 25000,
    applicableGearboxes: ['HC1000', 'HCD1000'],
    flywheelOptions: ['SAE18"', 'SAE21"'],
    hasDetachable: false,
    hasCover: true,
    baseSeries: 'HGTHB5',
    description: '带罩壳加强型，适用于1000系列齿轮箱'
  },

  'HGTHJB6.3': {
    name: 'HGTHJB6.3',
    fullName: 'HGTHJB6.3带罩壳高弹性联轴器',
    torque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 3000,
    weight: 185,
    basePrice: 28000,
    applicableGearboxes: ['HC1200', 'HC1200/1', 'HCT1100', 'HCT1200'],
    flywheelOptions: ['SAE16"', 'SAE18"', 'SAE21"', 'φ518'],
    hasDetachable: false,
    hasCover: true,
    baseSeries: 'HGTHB6.3',
    description: '带罩壳加强型，适用于1100-1200系列齿轮箱'
  },

  'HGTHJB8': {
    name: 'HGTHJB8',
    fullName: 'HGTHJB8带罩壳高弹性联轴器',
    torque: 8.0,
    maxTorque: 20.0,
    maxSpeed: 2800,
    weight: 230,
    basePrice: 34000,
    applicableGearboxes: ['HCD1400'],
    flywheelOptions: ['SAE18"', 'SAE21"', 'φ518'],
    hasDetachable: false,
    hasCover: true,
    baseSeries: 'HGTHB8',
    description: '带罩壳加强型，适用于1400系列齿轮箱'
  },

  'HGTHJB10': {
    name: 'HGTHJB10',
    fullName: 'HGTHJB10带罩壳高弹性联轴器',
    torque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 2500,
    weight: 280,
    basePrice: 43000,
    applicableGearboxes: ['HC1600'],
    flywheelOptions: ['SAE18"'],
    hasDetachable: false,
    hasCover: true,
    baseSeries: 'HGTHB10',
    description: '带罩壳加强型，适用于1600系列齿轮箱'
  },

  // HGTQ系列 - 高扭矩型
  'HGTQ1215': {
    name: 'HGTQ1215',
    fullName: 'HGTQ1215高扭矩联轴器',
    torque: 12.15,
    maxTorque: 30.0,
    maxSpeed: 2500,
    weight: 280,
    basePrice: 45000,
    applicableGearboxes: ['HC1200', 'HC1200/1', 'HCT1100', 'HCT1200'],
    flywheelOptions: ['SAE16"', 'SAE18"', 'SAE21"', 'φ290', 'φ518', 'φ640', 'φ640A', 'φ800'],
    hasDetachable: false,
    hasCover: false,
    variants: ['HGTQ1215ⅠD', 'HGTQ1210ⅠW', 'HGTQ1215ⅡW'],
    description: '高扭矩型，适用于1100-1200系列齿轮箱常规配置'
  },

  // HGT3020系列 - 超大扭矩型
  'HGT3020': {
    name: 'HGT3020',
    fullName: 'HGT3020ⅢD超大扭矩联轴器',
    torque: 30.0,
    maxTorque: 75.0,
    maxSpeed: 1800,
    weight: 500,
    basePrice: 85000,
    applicableGearboxes: ['HCT2700'],
    flywheelOptions: [],
    hasDetachable: false,
    hasCover: false,
    description: '超大扭矩型，适用于HCT2700系列齿轮箱'
  },

  // HGTLX系列 - 齿形块联轴器
  'HGTLX8.6': {
    name: 'HGTLX8.6',
    fullName: 'HGTLX8.6齿形块联轴器',
    torque: 8.6,
    maxTorque: 21.5,
    maxSpeed: 2000,
    weight: 150,
    basePrice: 28000,
    applicableGearboxes: ['HCD800', 'HCT800'],
    flywheelOptions: ['SAE16"', 'SAE18"', 'SAE21"'],
    hasDetachable: false,
    hasCover: false,
    description: '齿形块联轴器，800系列选配'
  }
};

/**
 * 飞轮规格数据
 * 包含SAE国际标准和国内规格
 */
export const flywheelSpecs = {
  // SAE国际标准飞轮
  sae: {
    'SAE14"': { size: 14, diameter: 355.6, boltCount: 8, boltCircle: 298.45 },
    'SAE16"': { size: 16, diameter: 406.4, boltCount: 8, boltCircle: 349.25 },
    'SAE18"': { size: 18, diameter: 457.2, boltCount: 10, boltCircle: 390.53 },
    'SAE21"': { size: 21, diameter: 533.4, boltCount: 12, boltCircle: 457.20 }
  },
  // 国内规格飞轮
  domestic: {
    'φ290': { diameter: 290, description: '国内机290' },
    'φ505': { diameter: 505, description: '国内机505' },
    'φ518': { diameter: 518, description: '国内机518' },
    'φ540': { diameter: 540, description: '国内机540' },
    'φ640': { diameter: 640, description: '国内机640' },
    'φ640A': { diameter: 640, description: '国内机640(A型)' },
    'φ700': { diameter: 700, description: '国内机700' },
    'φ720': { diameter: 720, description: '国内机720' },
    'φ770': { diameter: 770, description: '国内机770' },
    'φ800': { diameter: 800, description: '国内机800' }
  }
};

/**
 * 齿轮箱到联轴器完整映射
 * 包含常规配置、选配和可拆式选项
 */
export const gearboxToCouplingMap = {
  // 800系列
  'HCD800': {
    standard: 'HGTHT8.6',
    withCover: null,
    detachable: 'HGTHT8.6',
    alternative: 'HGTLX8.6',
    configRules: [
      '1、常规配置（带罩/无罩）：高弹HGTHT8.6系列',
      '2、选用配置：可拆式高弹HGTHT8.6系列',
      '3、选用配置：齿形块联轴器'
    ]
  },
  'HCT800': {
    standard: 'HGTHT8.6',
    withCover: null,
    detachable: 'HGTHT8.6',
    alternative: 'HGTLX8.6',
    configRules: ['同HCD800配置']
  },
  'HCT800/1': { standard: 'HGTHT8.6', withCover: null, detachable: 'HGTHT8.6' },
  'HCT800/2': { standard: 'HGTHT8.6', withCover: null, detachable: 'HGTHT8.6' },
  'HCT800/3': { standard: 'HGTHT8.6', withCover: null, detachable: 'HGTHT8.6' },

  // 1000系列
  'HC1000': {
    standard: 'HGTHB5',
    withCover: 'HGTHJB5',
    detachable: 'HGTHB5',
    alternative: null,
    configRules: [
      '1、常规配置："无罩"，高弹HGTHB5系列',
      '2、选用配置："带罩"，高弹HGTHJB5（加强型）系列',
      '3、选用配置："可拆式"高弹HGTHB5系列',
      '4、选用配置：齿形块联轴器'
    ]
  },
  'HCD1000': {
    standard: 'HGTHB5',
    withCover: 'HGTHJB5',
    detachable: 'HGTHB5',
    configRules: ['同HC1000配置']
  },

  // 1100-1200系列
  'HCT1100': {
    standard: 'HGTQ1215',
    withCover: 'HGTHJB6.3',
    detachable: 'HGTHB6.3',
    alternative: 'HGTHB6.3',
    configRules: [
      '1、常规配置："无罩"，高弹HGTQ1215系列',
      '2、选用配置："无罩"，高弹HGTHB6.3系列',
      '3、选用配置："可拆式"高弹HGTHB6.3系列',
      '4、选用配置："带罩"，高弹HGTHJB6.3（加强型）系列'
    ]
  },
  'HCT1200': {
    standard: 'HGTQ1215',
    withCover: 'HGTHJB6.3',
    detachable: 'HGTHB6.3',
    alternative: 'HGTHB6.3',
    configRules: ['同HCT1100配置']
  },
  'HCT1200/1': {
    standard: 'HGTHB6.3',
    withCover: null,
    detachable: 'HGTHB6.3',
    configRules: [
      '1、常规配置："无罩"，高弹HGTHB6.3系列',
      '2、选用配置："可拆式"高弹HGTHB6.3系列'
    ]
  },
  'HC1200': {
    standard: 'HGTQ1215',
    withCover: 'HGTHJB6.3',
    detachable: 'HGTHB6.3',
    alternative: 'HGTHB6.3',
    configRules: [
      '1、常规配置："无罩"，高弹HGTQ1215系列',
      '2、选用配置："无罩"，高弹HGTHB6.3系列',
      '3、选用配置："可拆式"高弹HGTHB6.3系列',
      '4、选用配置："带罩"，高弹HGTHJB6.3（加强型）系列',
      '5、选用配置：齿形块联轴器'
    ]
  },
  'HC1200/1': {
    standard: 'HGTQ1215',
    withCover: 'HGTHJB6.3',
    detachable: 'HGTHB6.3',
    configRules: ['同HC1200配置']
  },

  // 1400系列
  'HCD1400': {
    standard: 'HGTHB8',
    withCover: 'HGTHJB8',
    detachable: null,
    configRules: [
      '1、常规配置："无罩"，高弹HGTHB8系列',
      '2、选用配置："带罩"，高弹HGTHJB8（加强型）系列'
    ]
  },
  'HCT1400': {
    standard: 'HGTHB8',
    withCover: null,
    detachable: 'HGTHB6.3',
    configRules: [
      '1、常规配置：高弹HGTHB8系列',
      '2、"可拆式"高弹HGTHB6.3系列'
    ]
  },
  'HCT1400/2': {
    standard: 'HGTHB8',
    withCover: null,
    detachable: null
  },

  // 1600系列
  'HC1600': {
    standard: 'HGTHB10',
    withCover: 'HGTHJB10',
    detachable: null,
    configRules: [
      '1、常规配置："无罩"，高弹HGTHB10系列',
      '2、选用配置："带罩"，高弹HGTHJB10（加强型）系列'
    ]
  },
  'HCD1600': {
    standard: 'HGTHB10',
    withCover: null,
    detachable: null,
    configRules: ['1、常规配置：高弹HGTHB10系列']
  },
  'HCT1600': {
    standard: 'HGTHB10',
    withCover: null,
    detachable: null,
    configRules: ['1、常规配置：高弹HGTHB10系列']
  },
  'HCT1600/1': {
    standard: 'HGTHB10',
    withCover: null,
    detachable: null
  },

  // 2000系列
  'HC2000': {
    standard: 'HGTHB12.5',
    withCover: null,
    detachable: null,
    configRules: ['1、常规配置：高弹HGTHB12.5系列']
  },
  'HCD2000': {
    standard: 'HGTHB12.5',
    withCover: null,
    detachable: null,
    configRules: ['1、常规配置：高弹HGTHB12.5系列']
  },
  'HCT2000': {
    standard: 'HGTHB12.5',
    withCover: null,
    detachable: null,
    configRules: ['1、常规配置：高弹HGTHB12.5系列']
  },
  'HCT2000/1': {
    standard: 'HGTHB12.5',
    withCover: null,
    detachable: null
  },

  // 2700系列
  'HCD2700': {
    standard: 'HGTHB16',
    withCover: null,
    detachable: 'HGTHB16',
    configRules: [
      '1、常规配置：高弹HGTHB16系列',
      '2、选用配置："可拆式"高弹HGTHB16系列'
    ]
  },
  'HC2700': {
    standard: 'HGTHB16',
    withCover: null,
    detachable: 'HGTHB16',
    configRules: ['同HCD2700配置']
  },
  'HCT2700': {
    standard: 'HGT3020',
    withCover: null,
    detachable: null,
    configRules: ['HGT3020ⅢD']
  },
  'HCT2700/1': { standard: 'HGTHB16', withCover: null, detachable: null },

  // === 以下为增强版新增映射 (v9.0 合并自HTML版) ===

  // 800系列补充
  'HCW800': { standard: 'HGTHB5A', withCover: null, detachable: null },

  // 1000系列补充
  'HCQ1000': { standard: 'HGTHB5A', withCover: null, detachable: null },
  'HCQH1000': { standard: 'HGTHB5A', withCover: null, detachable: null },
  'HCQ1001': { standard: 'HGTHB5A', withCover: null, detachable: null },

  // 1100系列补充
  'HCW1100': { standard: 'HGTHB6.3A', withCover: null, detachable: null },

  // 1200系列补充
  'HCT1280/2': { standard: 'HGTHB6.3A', withCover: null, detachable: null },

  // 1400系列补充
  'HCW1400': { standard: 'HGTHB8A', withCover: null, detachable: null },
  'HCQ1400': { standard: 'HGTHB8A', withCover: null, detachable: null },
  'HCA1400': { standard: 'HGTHB8A', withCover: null, detachable: null },
  'HCAM1400': { standard: 'HGTHB8A', withCover: null, detachable: null },
  'HCA1401': { standard: 'HGTHB8A', withCover: null, detachable: null },
  'HCM1400': { standard: 'HGTHB8A', withCover: null, detachable: null },

  // 1600系列补充
  'HCQ1600': { standard: 'HGTHB10A', withCover: null, detachable: null },
  'HCQH1600': { standard: 'HGTHB10A', withCover: null, detachable: null },
  'HCQ1601': { standard: 'HGTHB10A', withCover: null, detachable: null },

  // 小型系列
  '120C': { standard: 'HGTH2', withCover: null, detachable: null },
  '120B': { standard: 'HGTH2', withCover: null, detachable: null },
  '135': { standard: 'HGTL1.8A', withCover: null, detachable: null },
  '135A': { standard: 'HGTL1.8A', withCover: null, detachable: null },
  'MB270A': { standard: 'HGTL2.2', withCover: null, detachable: null },
  'HC138': { standard: 'HGTH2', withCover: null, detachable: null },
  'HCD138': { standard: 'HGTL1.8B', withCover: null, detachable: null },
  'HC200': { standard: 'HGTL2.2A', withCover: null, detachable: null },
  'HC201': { standard: 'HGTL2.2', withCover: null, detachable: null },

  // 300系列
  '300': { standard: 'HGTHT4', withCover: null, detachable: null },
  'J300': { standard: 'HGTHT4', withCover: null, detachable: null },
  'HC300': { standard: 'HGTHT4', withCover: null, detachable: null },
  'D300A': { standard: 'HGTHT4', withCover: null, detachable: null },
  'T300': { standard: 'HGTHT4', withCover: null, detachable: null },
  'T300/1': { standard: 'HGTHT4', withCover: null, detachable: null },
  'HCA300': { standard: 'HGTL3.5Q', withCover: null, detachable: null },

  // 400系列
  'HC400': { standard: 'HGTHT4.5', withCover: null, detachable: null },
  'HCD400A': { standard: 'HGTHT4.5', withCover: null, detachable: null },
  'HCT400A': { standard: 'HGTHT5', withCover: null, detachable: null },
  'HCT400A/1': { standard: 'HGTHT5', withCover: null, detachable: null },

  // 600系列
  'HC600A': { standard: 'HGTHT6.3A', withCover: null, detachable: null },
  'HCD600A': { standard: 'HGTHT6.3A', withCover: null, detachable: null },
  'HCT600A': { standard: 'HGTHT6.3A', withCover: null, detachable: null },
  'HCT600A/1': { standard: 'HGTHT6.3A', withCover: null, detachable: null },

  // 700系列
  'HCQ700': { standard: 'HGTL7.5Q', withCover: null, detachable: null },

  // HCM系列 (高速齿轮箱)
  'HCM70': { standard: 'HGTHB3.2', withCover: null, detachable: null },
  'HCM160': { standard: 'HGTHB3.2', withCover: null, detachable: null },
  'HCM250': { standard: 'HGTHB5', withCover: null, detachable: null },
  'HCM435': { standard: 'HGTHB6.3', withCover: null, detachable: null },
  'HCM600': { standard: 'HGT1020', withCover: null, detachable: null },
  'HCM1250': { standard: 'HGT1620', withCover: null, detachable: null },
  'HCM1600': { standard: 'HGT2020', withCover: null, detachable: null },

  // DT系列 (电力推进齿轮箱)
  'DT180': { standard: 'HGTHB3.2', withCover: null, detachable: null },
  'DT210': { standard: 'HGTHB3.2', withCover: null, detachable: null },
  'DT240': { standard: 'HGTHB3.2', withCover: null, detachable: null },
  'DT280': { standard: 'HGTHB3.2', withCover: null, detachable: null },
  'DT580': { standard: 'HGTHB5', withCover: null, detachable: null },
  'DT770': { standard: 'HGTHB5', withCover: null, detachable: null },
  'DT900': { standard: 'HGTHB6.3', withCover: null, detachable: null },
  'DT1400': { standard: 'HGTHB8', withCover: null, detachable: null },
  'DT1500': { standard: 'HGTHB10', withCover: null, detachable: null },
  'DT2400': { standard: 'HGTHB12.5', withCover: null, detachable: null },
  'DT2500': { standard: 'HGTHB12.5', withCover: null, detachable: null },
  'DT4000': { standard: 'HGTHB16', withCover: null, detachable: null },
  'DT4300': { standard: 'HGTHB20', withCover: null, detachable: null },

  // GWC系列 (工程船用齿轮箱)
  'GWC28.30': { standard: 'HGT2520', withCover: null, detachable: null },
  'GWC30.32': { standard: 'HGT3020', withCover: null, detachable: null },
  'GWC32.35': { standard: 'HGT3020', withCover: null, detachable: null },
  'GWC36.39': { standard: 'HGT4020', withCover: null, detachable: null },
  'GWC39.41': { standard: 'HGT4020', withCover: null, detachable: null },
  'GWC42.45': { standard: 'HGT5020', withCover: null, detachable: null },
  'GWC45.49': { standard: 'HGT6320', withCover: null, detachable: null },
  'GWC45.52': { standard: 'HGT6320', withCover: null, detachable: null },
  'GWC49.54': { standard: 'HGT6320', withCover: null, detachable: null },
  'GWC49.59': { standard: 'HGT8020', withCover: null, detachable: null },
  'GWC52.59': { standard: 'HGT8020', withCover: null, detachable: null },
  'GWC52.62': { standard: 'HGT8020', withCover: null, detachable: null },
  'GWC60.66': { standard: 'HGT10020', withCover: null, detachable: null },
  'GWC60.74': { standard: 'HGT10020', withCover: null, detachable: null },
  'GWC63.71': { standard: 'HGT10020', withCover: null, detachable: null },
  'GWC66.75': { standard: 'HGT12520', withCover: null, detachable: null },
  'GWC70.76': { standard: 'HGT16020', withCover: null, detachable: null },
  'GWC70.85': { standard: 'HGT16020', withCover: null, detachable: null },
  'GWC75.90': { standard: 'HGT16020', withCover: null, detachable: null },
  'GWC78.88': { standard: 'HGT16020', withCover: null, detachable: null },

  // SGW系列
  'SGW39.41': { standard: 'HGT4020', withCover: null, detachable: null },
  'SGW42.45': { standard: 'HGT5020', withCover: null, detachable: null },
  'SGW49.54': { standard: 'HGT6320', withCover: null, detachable: null },

  // GCH系列 (工程船用齿轮箱)
  'GCH320': { standard: 'HGT2520', withCover: null, detachable: null },
  'GCH350': { standard: 'HGT3020', withCover: null, detachable: null },
  'GCH390': { standard: 'HGT4020', withCover: null, detachable: null },
  'GCH410': { standard: 'HGT4020', withCover: null, detachable: null },
  'GCH490': { standard: 'HGT6320', withCover: null, detachable: null },
  'GCH540': { standard: 'HGT6320', withCover: null, detachable: null },
  'GCH590': { standard: 'HGT8020', withCover: null, detachable: null },
  'GCH660': { standard: 'HGT8020', withCover: null, detachable: null },
  'GCH750': { standard: 'HGT10020', withCover: null, detachable: null },
  'GCH760': { standard: 'HGT10020', withCover: null, detachable: null },
  'GCH850': { standard: 'HGT12520', withCover: null, detachable: null },
  'GCH880': { standard: 'HGT12520', withCover: null, detachable: null },
  'GCH900': { standard: 'HGT16020', withCover: null, detachable: null },
  'GCH950': { standard: 'HGT16020', withCover: null, detachable: null },
  'GCH1000': { standard: 'HGT2020', withCover: null, detachable: null },

  // GCHE系列 (工程船用双速齿轮箱)
  'GCHE5': { standard: 'HGT4020', withCover: null, detachable: null },
  'GCHE6': { standard: 'HGT4020', withCover: null, detachable: null },
  'GCHE9': { standard: 'HGT6320', withCover: null, detachable: null },
  'GCHE11': { standard: 'HGT6320', withCover: null, detachable: null },
  'GCHE15': { standard: 'HGT8020', withCover: null, detachable: null },
  'GCHE20': { standard: 'HGT8020', withCover: null, detachable: null },
  'GCHE26': { standard: 'HGT10020', withCover: null, detachable: null },
  'GCHE33': { standard: 'HGT10020', withCover: null, detachable: null },
  'GCHE44': { standard: 'HGT12520', withCover: null, detachable: null },

  // GCHT系列 (工程船用推力齿轮箱)
  'GCHT5': { standard: 'HGT2520', withCover: null, detachable: null },
  'GCHT6': { standard: 'HGT3020', withCover: null, detachable: null },
  'GCHT9': { standard: 'HGT4020', withCover: null, detachable: null },
  'GCHT11': { standard: 'HGT4020', withCover: null, detachable: null },
  'GCHT15': { standard: 'HGT6320', withCover: null, detachable: null },
  'GCHT20': { standard: 'HGT6320', withCover: null, detachable: null },
  'GCHT26': { standard: 'HGT8020', withCover: null, detachable: null },
  'GCHT33': { standard: 'HGT8020', withCover: null, detachable: null },
  'GCHT44': { standard: 'HGT10020', withCover: null, detachable: null },
  'GCHT66': { standard: 'HGT10020', withCover: null, detachable: null },
  'GCHT77': { standard: 'HGT12520', withCover: null, detachable: null },
  'GCHT91': { standard: 'HGT12520', withCover: null, detachable: null },
  'GCHT108': { standard: 'HGT16020', withCover: null, detachable: null },
  'GCHT115': { standard: 'HGT16020', withCover: null, detachable: null },
  'GCHT135': { standard: 'HGT2020', withCover: null, detachable: null },
  'GCHT170': { standard: 'HGT2020', withCover: null, detachable: null },

  // GC系列 (工程船用齿轮箱)
  'GC600': { standard: 'HGT4020', withCover: null, detachable: null },
  'GC800': { standard: 'HGT6320', withCover: null, detachable: null },
  'GC1000': { standard: 'HGT8020', withCover: null, detachable: null },
  'GC1400': { standard: 'HGT10020', withCover: null, detachable: null }
};

/**
 * 联轴器动态特性参数 (v9.0 合并自HTML版)
 * 用于扭振分析计算
 * - staticStiffness: 静态扭转刚度 (kN·m/rad)
 * - dynamicStiffness: 动态扭转刚度 (kN·m/rad)
 * - dampingCoefficient: 阻尼系数
 * - inertia: 转动惯量 (kg·m²)
 * - compensation: 偏差补偿能力 (轴向mm/径向mm/角向°)
 * - rubberType: 橡胶材质
 * - tempRange: 工作温度范围
 * - fatigueLife: 设计疲劳寿命 (小时)
 */
export const couplingDynamicData = {
  'HGTL': {
    staticStiffness: 280,
    dynamicStiffness: 350,
    dampingCoefficient: 0.08,
    inertia: 0.015,
    compensation: { axial: 3, radial: 1.0, angular: 1.0 },
    rubberType: 'NBR丁腈橡胶',
    tempRange: '-20°C ~ +60°C',
    fatigueLife: 20000,
    hardness: '55±5 Shore A'
  },
  'HGTH': {
    staticStiffness: 450,
    dynamicStiffness: 580,
    dampingCoefficient: 0.10,
    inertia: 0.035,
    compensation: { axial: 4, radial: 1.2, angular: 1.2 },
    rubberType: 'NBR丁腈橡胶',
    tempRange: '-20°C ~ +60°C',
    fatigueLife: 20000,
    hardness: '55±5 Shore A'
  },
  'HGTHB': {
    staticStiffness: 680,
    dynamicStiffness: 880,
    dampingCoefficient: 0.12,
    inertia: 0.065,
    compensation: { axial: 5, radial: 1.5, angular: 1.5 },
    rubberType: 'NBR丁腈橡胶',
    tempRange: '-20°C ~ +60°C',
    fatigueLife: 20000,
    hardness: '58±5 Shore A'
  },
  'HGTHJB': {
    staticStiffness: 720,
    dynamicStiffness: 920,
    dampingCoefficient: 0.11,
    inertia: 0.075,
    compensation: { axial: 4, radial: 1.3, angular: 1.3 },
    rubberType: 'NBR丁腈橡胶',
    tempRange: '-20°C ~ +60°C',
    fatigueLife: 20000,
    hardness: '58±5 Shore A'
  },
  'HGTQ': {
    staticStiffness: 950,
    dynamicStiffness: 1200,
    dampingCoefficient: 0.09,
    inertia: 0.12,
    compensation: { axial: 6, radial: 1.8, angular: 1.8 },
    rubberType: 'CR氯丁橡胶',
    tempRange: '-30°C ~ +80°C',
    fatigueLife: 25000,
    hardness: '60±5 Shore A'
  },
  'HGT': {
    staticStiffness: 1100,
    dynamicStiffness: 1400,
    dampingCoefficient: 0.10,
    inertia: 0.18,
    compensation: { axial: 8, radial: 2.0, angular: 2.0 },
    rubberType: 'CR氯丁橡胶',
    tempRange: '-30°C ~ +80°C',
    fatigueLife: 25000,
    hardness: '62±5 Shore A'
  },
  'HGTLX': {
    staticStiffness: 520,
    dynamicStiffness: 680,
    dampingCoefficient: 0.07,
    inertia: 0.045,
    compensation: { axial: 4, radial: 1.0, angular: 1.0 },
    rubberType: 'NBR丁腈橡胶',
    tempRange: '-20°C ~ +60°C',
    fatigueLife: 18000,
    hardness: '55±5 Shore A'
  }
};

/**
 * 根据联轴器型号获取动态特性数据
 * @param {string} model - 联轴器型号
 * @param {number} ratedTorque - 额定扭矩 (kN·m)，用于按比例缩放
 * @returns {object|null} 动态特性参数
 */
export const getCouplingDynamicParams = (model, ratedTorque = null) => {
  const seriesPrefixes = ['HGTHJB', 'HGTHB', 'HGTHT', 'HGTLX', 'HGTQ', 'HGTL', 'HGTH', 'HGT'];
  let baseData = null;
  for (const prefix of seriesPrefixes) {
    if (model.startsWith(prefix)) {
      baseData = couplingDynamicData[prefix] || couplingDynamicData['HGTH'];
      break;
    }
  }
  if (!baseData) return null;
  if (!ratedTorque) return { ...baseData };

  // Scale by torque ratio (reference: 5 kN·m)
  const torqueFactor = Math.sqrt(ratedTorque / 5);
  return {
    ...baseData,
    staticStiffness: Math.round(baseData.staticStiffness * torqueFactor),
    dynamicStiffness: Math.round(baseData.dynamicStiffness * torqueFactor),
    inertia: baseData.inertia * torqueFactor
  };
};

/**
 * 联轴器详细型号列表（含物料编码）
 * 从Excel提取的完整型号数据
 */
export const couplingDetailedModels = {
  // HGTHT8.6系列
  'HGTHT8.6/14': { partNumber: '10071467', spec: '配SAE14"', series: 'HGTHT8.6' },
  'HGTHT8.6/16': { partNumber: '10043443', spec: '配SAE16"', series: 'HGTHT8.6' },
  'HGTHT8.6/18': { partNumber: '10043444', spec: '配SAE18"', series: 'HGTHT8.6' },
  'HGTHT8.6/21': { partNumber: '10043445', spec: '配SAE21"', series: 'HGTHT8.6' },
  'HGTHT8.6/φ505': { partNumber: '10043446', spec: '配国内机505', series: 'HGTHT8.6' },
  'HGTHT8.6/φ518': { partNumber: '10043447', spec: '配国内机518', series: 'HGTHT8.6' },
  'HGTHT8.6/18X3': { partNumber: '10083772', spec: '可拆式，SAE18"', series: 'HGTHT8.6', detachable: true },
  'HGTHT8.6/21X11': { partNumber: '10098850', spec: '可拆式，SAE21"', series: 'HGTHT8.6', detachable: true },

  // HGTLX8.6系列 - 齿形块
  'HGTLX8.6/16-03': { partNumber: '10059486', spec: '', series: 'HGTLX8.6' },
  'HGTLX8.6/18-03': { partNumber: '10056723', spec: '', series: 'HGTLX8.6' },
  'HGTLX8.6/21-03': { partNumber: '10066390', spec: '', series: 'HGTLX8.6' },

  // HGTHB5系列
  'HGTHB5/18': { partNumber: '10044917', spec: '配SAE18"', series: 'HGTHB5' },
  'HGTHB5/21': { partNumber: '10044918', spec: '配SAE21"', series: 'HGTHB5' },
  'HGTHB5/φ505': { partNumber: '10059932', spec: '配国内机505', series: 'HGTHB5' },
  'HGTHB5/φ518': { partNumber: '10030718', spec: '配国内机518', series: 'HGTHB5' },
  'HGTHB5/φ640': { partNumber: '10078735', spec: '配国内机640', series: 'HGTHB5' },
  'HGTHB5/φ640A': { partNumber: '10078736', spec: '配国内机640', series: 'HGTHB5' },

  // HGTHJB5系列 - 带罩壳
  'HGTHJB5/18': { partNumber: '10030719', spec: '配SAE18"，带罩', series: 'HGTHJB5', hasCover: true },
  'HGTHJB5/21': { partNumber: '10044919', spec: '配SAE21"，带罩', series: 'HGTHJB5', hasCover: true },

  // HGTQ1215系列
  'HGTQ1215ⅠD/16': { partNumber: '10078731', spec: '配SAE16"', series: 'HGTQ1215' },
  'HGTQ1215ⅠD/18': { partNumber: '10044078', spec: '配SAE18"', series: 'HGTQ1215' },
  'HGTQ1215ⅠD/21': { partNumber: '10044256', spec: '配SAE21"', series: 'HGTQ1215' },
  'HGTQ1215ⅠD/φ518': { partNumber: '10044077', spec: '配国内机518', series: 'HGTQ1215' },
  'HGTQ1215ⅠD/φ640': { partNumber: '10051916', spec: '配国内机640', series: 'HGTQ1215' },
  'HGTQ1215ⅠD/φ640A': { partNumber: '10051917', spec: '配国内机640', series: 'HGTQ1215' },
  'HGTQ1215ⅡW/φ290': { partNumber: '10078732', spec: '配国内机290', series: 'HGTQ1215' },
  'HGTQ1215ⅠD/φ800': { partNumber: '10078902', spec: '配国内机800', series: 'HGTQ1215' },

  // HGTHB6.3系列
  'HGTHB6.3/16': { partNumber: '10078730', spec: '配SAE16"', series: 'HGTHB6.3' },
  'HGTHB6.3/18': { partNumber: '10058824', spec: '配SAE18"', series: 'HGTHB6.3' },
  'HGTHB6.3/21': { partNumber: '10058823', spec: '配SAE21"', series: 'HGTHB6.3' },
  'HGTHB6.3/φ518': { partNumber: '10058822', spec: '配国内机518', series: 'HGTHB6.3' },
  'HGTHB6.3/φ640': { partNumber: '10045917', spec: '配国内机640', series: 'HGTHB6.3' },
  'HGTHB6.3/φ640A': { partNumber: '10058821', spec: '配国内机640', series: 'HGTHB6.3' },
  'HGTHB6.3/φ290': { partNumber: '10068959', spec: '配国内机290', series: 'HGTHB6.3' },

  // HGTHJB6.3系列 - 带罩壳
  'HGTHJB6.3/16': { partNumber: '10078729', spec: '配SAE16"，带罩', series: 'HGTHJB6.3', hasCover: true },
  'HGTHJB6.3/18': { partNumber: '10058826', spec: '配SAE18"，带罩', series: 'HGTHJB6.3', hasCover: true },
  'HGTHJB6.3/21': { partNumber: '10058825', spec: '配SAE21"，带罩', series: 'HGTHJB6.3', hasCover: true },
  'HGTHJB6.3/φ518': { partNumber: '10058827', spec: '配国内518，带罩', series: 'HGTHJB6.3', hasCover: true },

  // HGTHB8系列
  'HGTHB8/18': { partNumber: '10044482', spec: '配SAE18"', series: 'HGTHB8' },
  'HGTHB8/21': { partNumber: '10038157', spec: '配SAE21"', series: 'HGTHB8' },
  'HGTHB8/φ518': { partNumber: '10044483', spec: '配国内机518', series: 'HGTHB8' },
  'HGTHB8/φ540': { partNumber: '10050401', spec: '配国内机540', series: 'HGTHB8' },
  'HGTHB8/φ640': { partNumber: '10058830', spec: '配国内机640', series: 'HGTHB8' },
  'HGTHB8/φ640A': { partNumber: '10058829', spec: '配国内机640', series: 'HGTHB8' },
  'HGTHB8/φ720': { partNumber: '10060157', spec: '配国内机720', series: 'HGTHB8' },

  // HGTHJB8系列 - 带罩壳
  'HGTHJB8/18': { partNumber: '10058832', spec: '配SAE18"，带罩', series: 'HGTHJB8', hasCover: true },
  'HGTHJB8/21': { partNumber: '10058833', spec: '配SAE21"，带罩', series: 'HGTHJB8', hasCover: true },
  'HGTHJB8/φ518': { partNumber: '10058834', spec: '配国内518，带罩', series: 'HGTHJB8', hasCover: true },

  // HGTHB10系列
  'HGTHB10/18': { partNumber: '10049315', spec: '配SAE18"', series: 'HGTHB10' },
  'HGTHB10/21': { partNumber: '10049316', spec: '配SAE21"', series: 'HGTHB10' },
  'HGTHB10/φ518': { partNumber: '10049867', spec: '配国内机518', series: 'HGTHB10' },
  'HGTHB10/φ540': { partNumber: '10057831', spec: '配国内机540', series: 'HGTHB10' },

  // HGTHJB10系列 - 带罩壳
  'HGTHJB10/18': { partNumber: '10058838', spec: '配SAE18"，带罩', series: 'HGTHJB10', hasCover: true },

  // HGTHB12.5系列
  'HGTHB12.5/18': { partNumber: '10046048', spec: '配SAE18"', series: 'HGTHB12.5' },
  'HGTHB12.5/21': { partNumber: '10046049', spec: '配SAE21"', series: 'HGTHB12.5' },
  'HGTHB12.5/φ518': { partNumber: '10058840', spec: '配国内机518', series: 'HGTHB12.5' },
  'HGTHB12.5/φ640': { partNumber: '10058839', spec: '配国内机640', series: 'HGTHB12.5' },
  'HGTHB12.5/φ640A': { partNumber: '10058841', spec: '配国内机640', series: 'HGTHB12.5' },
  'HGTHB12.5/φ700': { partNumber: '10079988', spec: '配国内机700', series: 'HGTHB12.5' },
  'HGTHB12.5/φ770': { partNumber: '10048125', spec: '配国内机770', series: 'HGTHB12.5' },

  // HGTHB16系列
  'HGTHB16/φ770': { partNumber: '10057428', spec: '配国内机770', series: 'HGTHB16' }
};

/**
 * 获取齿轮箱推荐的联轴器配置
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {boolean} hasCover - 是否需要带罩壳
 * @param {boolean} detachable - 是否需要可拆式
 * @returns {object} 推荐配置
 */
export const getRecommendedCouplingForGearbox = (gearboxModel, hasCover = false, detachable = false) => {
  const mapping = gearboxToCouplingMap[gearboxModel];
  if (!mapping) {
    // 尝试模糊匹配
    const baseModel = gearboxModel.replace(/\/\d+$/, '');
    const fuzzyMapping = gearboxToCouplingMap[baseModel];
    if (!fuzzyMapping) {
      return null;
    }
    return getRecommendedFromMapping(fuzzyMapping, hasCover, detachable);
  }
  return getRecommendedFromMapping(mapping, hasCover, detachable);
};

const getRecommendedFromMapping = (mapping, hasCover, detachable) => {
  let recommendedSeries;

  if (detachable && mapping.detachable) {
    recommendedSeries = mapping.detachable;
  } else if (hasCover && mapping.withCover) {
    recommendedSeries = mapping.withCover;
  } else {
    recommendedSeries = mapping.standard;
  }

  const seriesSpec = couplingSeriespecs[recommendedSeries];

  return {
    recommendedSeries,
    seriesSpec,
    configRules: mapping.configRules || [],
    allOptions: {
      standard: mapping.standard,
      withCover: mapping.withCover,
      detachable: mapping.detachable,
      alternative: mapping.alternative
    }
  };
};

/**
 * 获取联轴器系列的飞轮选项
 * @param {string} seriesName - 联轴器系列名称
 * @returns {object} 飞轮选项
 */
export const getFlywheelOptionsForSeries = (seriesName) => {
  const series = couplingSeriespecs[seriesName];
  if (!series) return { sae: [], domestic: [] };

  const options = { sae: [], domestic: [] };

  series.flywheelOptions.forEach(opt => {
    if (opt.startsWith('SAE')) {
      options.sae.push({
        name: opt,
        ...flywheelSpecs.sae[opt]
      });
    } else {
      options.domestic.push({
        name: opt,
        ...flywheelSpecs.domestic[opt]
      });
    }
  });

  return options;
};

/**
 * 根据飞轮规格匹配联轴器型号
 * @param {string} seriesName - 联轴器系列
 * @param {string} flywheelSpec - 飞轮规格
 * @returns {object|null} 匹配的联轴器详细信息
 */
export const matchCouplingByFlywheel = (seriesName, flywheelSpec) => {
  // 标准化飞轮规格
  let normalizedSpec = flywheelSpec;
  if (flywheelSpec.match(/^\d+$/)) {
    normalizedSpec = `SAE${flywheelSpec}"`;
  } else if (flywheelSpec.match(/^SAE\d+$/)) {
    normalizedSpec = `${flywheelSpec}"`;
  }

  // 构建可能的型号名称
  const possibleModels = [
    `${seriesName}/${normalizedSpec}`,
    `${seriesName}/${normalizedSpec.replace('SAE', '').replace('"', '')}`,
    `${seriesName}/${flywheelSpec}`
  ];

  for (const modelName of possibleModels) {
    if (couplingDetailedModels[modelName]) {
      return {
        model: modelName,
        ...couplingDetailedModels[modelName]
      };
    }
  }

  return null;
};

/**
 * 获取联轴器系列扭矩图表数据
 * 用于图形化展示
 */
export const getCouplingTorqueChartData = () => {
  const chartData = [];

  Object.values(couplingSeriespecs).forEach(series => {
    if (!series.baseSeries) { // 排除带罩壳版本的重复数据
      chartData.push({
        name: series.name,
        torque: series.torque,
        maxTorque: series.maxTorque,
        maxSpeed: series.maxSpeed,
        weight: series.weight,
        price: series.basePrice,
        gearboxCount: series.applicableGearboxes.length
      });
    }
  });

  // 按扭矩排序
  return chartData.sort((a, b) => a.torque - b.torque);
};

/**
 * 获取齿轮箱系列配置统计
 */
export const getGearboxConfigStats = () => {
  const stats = {
    totalGearboxes: Object.keys(gearboxToCouplingMap).length,
    byCouplingSeries: {},
    withCoverCount: 0,
    withDetachableCount: 0
  };

  Object.values(gearboxToCouplingMap).forEach(mapping => {
    // 统计标准联轴器
    if (mapping.standard) {
      stats.byCouplingSeries[mapping.standard] = (stats.byCouplingSeries[mapping.standard] || 0) + 1;
    }
    // 统计带罩壳
    if (mapping.withCover) {
      stats.withCoverCount++;
    }
    // 统计可拆式
    if (mapping.detachable) {
      stats.withDetachableCount++;
    }
  });

  return stats;
};

// 详细联轴器-接口映射 (来源: HC高弹及主机配套20210426-大功率汇总.xlsx)
// 包含每个齿轮箱型号的全部联轴器型号和对应接口规格
export const detailedCouplingMappings = {
  "HCD800": {
    "standard": [
      {"model": "HGTHT8.6/14", "interface": "配SAE14\""},
      {"model": "HGTHT8.6/16", "interface": "配SAE16\""},
      {"model": "HGTHT8.6/18", "interface": "配SAE18\""},
      {"model": "HGTHT8.6/21", "interface": "配SAE21\""},
      {"model": "HGTHT8.6/φ505", "interface": "配国内机505"},
      {"model": "HGTHT8.6/φ518", "interface": "配国内机518"}
    ],
    "withCover": [],
    "detachable": [
      {"model": "HGTHT8.6/18X", "interface": "可拆式，SAE18\""},
      {"model": "HGTHT8.6/21X", "interface": "可拆式，SAE21\""},
      {"model": "HGTLX8.6/16", "interface": "齿形块"},
      {"model": "HGTLX8.6/18", "interface": "齿形块"},
      {"model": "HGTLX8.6/21", "interface": "齿形块"}
    ],
    "gearTooth": []
  },
  "HCT800": {
    "standard": [
      {"model": "HGTHT8.6/14", "interface": "配SAE14\""},
      {"model": "HGTHT8.6/16", "interface": "配SAE16\""},
      {"model": "HGTHT8.6/18", "interface": "配SAE18\""},
      {"model": "HGTHT8.6/21", "interface": "配SAE21\""},
      {"model": "HGTHT8.6/φ505", "interface": "配国内机505"},
      {"model": "HGTHT8.6/φ518", "interface": "配国内机518"}
    ],
    "withCover": [],
    "detachable": [
      {"model": "HGTHT8.6/18X", "interface": "可拆式，SAE18\""},
      {"model": "HGTHT8.6/21X", "interface": "可拆式，SAE21\""},
      {"model": "HGTLX8.6/16", "interface": "齿形块"},
      {"model": "HGTLX8.6/18", "interface": "齿形块"},
      {"model": "HGTLX8.6/21", "interface": "齿形块"}
    ],
    "gearTooth": []
  },
  "HCT800/1": {
    "standard": [
      {"model": "HGTHT8.6/14", "interface": "配SAE14\""},
      {"model": "HGTHT8.6/16", "interface": "配SAE16\""},
      {"model": "HGTHT8.6/18", "interface": "配SAE18\""},
      {"model": "HGTHT8.6/21", "interface": "配SAE21\""},
      {"model": "HGTHT8.6/φ505", "interface": "配国内机505"},
      {"model": "HGTHT8.6/φ518", "interface": "配国内机518"}
    ],
    "withCover": [],
    "detachable": [
      {"model": "HGTHT8.6/18X", "interface": "可拆式，SAE18\""},
      {"model": "HGTHT8.6/21X", "interface": "可拆式，SAE21\""}
    ],
    "gearTooth": []
  },
  "HCT800/2": {
    "standard": [
      {"model": "HGTHT8.6/14", "interface": "配SAE14\""},
      {"model": "HGTHT8.6/16", "interface": "配SAE16\""},
      {"model": "HGTHT8.6/18", "interface": "配SAE18\""},
      {"model": "HGTHT8.6/21", "interface": "配SAE21\""},
      {"model": "HGTHT8.6/φ505", "interface": "配国内机505"},
      {"model": "HGTHT8.6/φ518", "interface": "配国内机518"}
    ],
    "withCover": [],
    "detachable": [
      {"model": "HGTHT8.6/18X", "interface": "可拆式，SAE18\""},
      {"model": "HGTHT8.6/21X", "interface": "可拆式，SAE21\""}
    ],
    "gearTooth": []
  },
  "HCT800/3": {
    "standard": [
      {"model": "HGTHT8.6/14", "interface": "配SAE14\""},
      {"model": "HGTHT8.6/16", "interface": "配SAE16\""},
      {"model": "HGTHT8.6/18", "interface": "配SAE18\""},
      {"model": "HGTHT8.6/21", "interface": "配SAE21\""},
      {"model": "HGTHT8.6/φ505", "interface": "配国内机505"},
      {"model": "HGTHT8.6/φ518", "interface": "配国内机518"}
    ],
    "withCover": [],
    "detachable": [
      {"model": "HGTHT8.6/18X", "interface": "可拆式，SAE18\""},
      {"model": "HGTHT8.6/21X", "interface": "可拆式，SAE21\""}
    ],
    "gearTooth": []
  },
  "HC1000": {
    "standard": [
      {"model": "HGTHB5/18", "interface": "配SAE18\""},
      {"model": "HGTHB5/21", "interface": "配SAE21\""},
      {"model": "HGTHB5/φ505", "interface": "配国内机505"},
      {"model": "HGTHB5/φ518", "interface": "配国内机518"},
      {"model": "HGTHB5/φ640", "interface": "配国内机640"},
      {"model": "HGTHB5/φ640A", "interface": "配国内机640"}
    ],
    "withCover": [
      {"model": "HGTHJB5/18", "interface": "配SAE18\"，带罩"},
      {"model": "HGTHJB5/21", "interface": "配SAE21\"，带罩"}
    ],
    "detachable": [],
    "gearTooth": []
  },
  "HCD1000": {
    "standard": [
      {"model": "HGTHB5/18", "interface": "配SAE18\""},
      {"model": "HGTHB5/21", "interface": "配SAE21\""},
      {"model": "HGTHB5/φ505", "interface": "配国内机505"},
      {"model": "HGTHB5/φ518", "interface": "配国内机518"},
      {"model": "HGTHB5/φ640", "interface": "配国内机640"},
      {"model": "HGTHB5/φ640A", "interface": "配国内机640"}
    ],
    "withCover": [
      {"model": "HGTHJB5/18", "interface": "配SAE18\"，带罩"},
      {"model": "HGTHJB5/21", "interface": "配SAE21\"，带罩"}
    ],
    "detachable": [],
    "gearTooth": []
  },
  "HCT1100": {
    "standard": [
      {"model": "HGTQ1215ⅠD/18", "interface": "配SAE18\""},
      {"model": "HGTQ1215ⅠD/21", "interface": "配SAE21\""},
      {"model": "HGTQ1215ⅠD/φ518", "interface": "配国内机518"},
      {"model": "HGTHB6.3/18", "interface": "配SAE18\""},
      {"model": "HGTHB6.3/21", "interface": "配SAE21\""},
      {"model": "HGTHB6.3/φ518", "interface": "配国内机518"}
    ],
    "withCover": [
      {"model": "HGTHJB6.3/18", "interface": "配SAE18\"，带罩"},
      {"model": "HGTHJB6.3/21", "interface": "配SAE21\"，带罩"},
      {"model": "HGTHJB6.3/φ518", "interface": "配国内518，带罩"}
    ],
    "detachable": [],
    "gearTooth": []
  },
  "HCT1200": {
    "standard": [
      {"model": "HGTQ1215ⅠD/18", "interface": "配SAE18\""},
      {"model": "HGTQ1215ⅠD/21", "interface": "配SAE21\""},
      {"model": "HGTQ1215ⅠD/φ518", "interface": "配国内机518"},
      {"model": "HGTHB6.3/18", "interface": "配SAE18\""},
      {"model": "HGTHB6.3/21", "interface": "配SAE21\""},
      {"model": "HGTHB6.3/φ518", "interface": "配国内机518"}
    ],
    "withCover": [
      {"model": "HGTHJB6.3/18", "interface": "配SAE18\"，带罩"},
      {"model": "HGTHJB6.3/21", "interface": "配SAE21\"，带罩"},
      {"model": "HGTHJB6.3/φ518", "interface": "配国内518，带罩"}
    ],
    "detachable": [],
    "gearTooth": []
  },
  "HCT1200/1": {
    "standard": [
      {"model": "HGTHB6.3/18", "interface": "配SAE18\""},
      {"model": "HGTHB6.3/21", "interface": "配SAE21\""},
      {"model": "HGTHB6.3/φ518", "interface": "配国内机518"},
      {"model": "HGTHB6.3/φ640", "interface": "配国内机640"},
      {"model": "HGTHB6.3/φ640A", "interface": "配国内机640"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HC1200": {
    "standard": [
      {"model": "HGTQ1215ⅠD/16", "interface": "配SAE16\""},
      {"model": "HGTQ1215ⅠD/18", "interface": "配SAE18\""},
      {"model": "HGTQ1215ⅠD/21", "interface": "配SAE21\""},
      {"model": "HGTQ1215ⅠD/φ518", "interface": "配国内机518"},
      {"model": "HGTQ1215ⅠD/φ640", "interface": "配国内机640"},
      {"model": "HGTQ1215ⅠD/φ640A", "interface": "配国内机640"},
      {"model": "HGTQ1215ⅡW/φ290", "interface": "配国内机290"},
      {"model": "HGTQ1215ⅠD/φ800", "interface": "配国内机800"},
      {"model": "HGTHB6.3/16", "interface": "配SAE16\""},
      {"model": "HGTHB6.3/18", "interface": "配SAE18\""},
      {"model": "HGTHB6.3/21", "interface": "配SAE21\""},
      {"model": "HGTHB6.3/φ518", "interface": "配国内机518"},
      {"model": "HGTHB6.3/φ640", "interface": "配国内机640"},
      {"model": "HGTHB6.3/φ290", "interface": "配国内机290"}
    ],
    "withCover": [
      {"model": "HGTHJB6.3/16", "interface": "配SAE16\"，带罩"},
      {"model": "HGTHJB6.3/18", "interface": "配SAE18\"，带罩"},
      {"model": "HGTHJB6.3/21", "interface": "配SAE21\"，带罩"}
    ],
    "detachable": [],
    "gearTooth": []
  },
  "HC1200/1": {
    "standard": [
      {"model": "HGTQ1215ⅠD/16", "interface": "配SAE16\""},
      {"model": "HGTQ1215ⅠD/18", "interface": "配SAE18\""},
      {"model": "HGTQ1215ⅠD/21", "interface": "配SAE21\""},
      {"model": "HGTQ1215ⅠD/φ518", "interface": "配国内机518"},
      {"model": "HGTQ1215ⅠD/φ640", "interface": "配国内机640"},
      {"model": "HGTHB6.3/16", "interface": "配SAE16\""},
      {"model": "HGTHB6.3/18", "interface": "配SAE18\""},
      {"model": "HGTHB6.3/21", "interface": "配SAE21\""},
      {"model": "HGTHB6.3/φ518", "interface": "配国内机518"},
      {"model": "HGTHB6.3/φ640", "interface": "配国内机640"},
      {"model": "HGTHB6.3/φ290", "interface": "配国内机290"}
    ],
    "withCover": [
      {"model": "HGTHJB6.3/16", "interface": "配SAE16\"，带罩"},
      {"model": "HGTHJB6.3/18", "interface": "配SAE18\"，带罩"},
      {"model": "HGTHJB6.3/21", "interface": "配SAE21\"，带罩"}
    ],
    "detachable": [],
    "gearTooth": []
  },
  "HCD1400": {
    "standard": [
      {"model": "HGTHB8/18", "interface": "配SAE18\""},
      {"model": "HGTHB8/21", "interface": "配SAE21\""},
      {"model": "HGTHB8/φ518", "interface": "配国内机518"},
      {"model": "HGTHB8/φ640", "interface": "配国内机640"},
      {"model": "HGTHB8/φ640A", "interface": "配国内机640"}
    ],
    "withCover": [
      {"model": "HGTHJB8/18", "interface": "配SAE18\"，带罩"},
      {"model": "HGTHJB8/21", "interface": "配SAE21\"，带罩"},
      {"model": "HGTHJB8/φ518", "interface": "配国内518，带罩"}
    ],
    "detachable": [],
    "gearTooth": []
  },
  "HCT1400": {
    "standard": [
      {"model": "HGTHB8/18", "interface": "配SAE18\""},
      {"model": "HGTHB8/21", "interface": "配SAE21\""},
      {"model": "HGTHB8/φ518", "interface": "配国内机518"},
      {"model": "HGTHB8/φ540", "interface": "配国内机540"},
      {"model": "HGTHB8/φ720", "interface": "配国内机720"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HCT1400/2": {
    "standard": [
      {"model": "HGTHB8/18", "interface": "配SAE18\""}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HC1600": {
    "standard": [
      {"model": "HGTHB10/18", "interface": "配SAE18\""},
      {"model": "HGTHB10/21", "interface": "配SAE21\""},
      {"model": "HGTHB10/φ518", "interface": "配国内机518"},
      {"model": "HGTHB10/φ540", "interface": "配国内机540"}
    ],
    "withCover": [
      {"model": "HGTHJB10/18", "interface": "配SAE18\"，带罩"}
    ],
    "detachable": [],
    "gearTooth": []
  },
  "HCD1600": {
    "standard": [
      {"model": "HGTHB10/18", "interface": "配SAE18\""},
      {"model": "HGTHB10/21", "interface": "配SAE21\""},
      {"model": "HGTHB10/φ518", "interface": "配国内机518"},
      {"model": "HGTHB10/φ540", "interface": "配国内机540"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HCT1600": {
    "standard": [
      {"model": "HGTHB10/18", "interface": "配SAE18\""},
      {"model": "HGTHB10/21", "interface": "配SAE21\""},
      {"model": "HGTHB10/φ518", "interface": "配国内机518"},
      {"model": "HGTHB10/φ540", "interface": "配国内机540"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HCT1600/1": {
    "standard": [
      {"model": "HGTHB10/18", "interface": "配SAE18\""},
      {"model": "HGTHB10/21", "interface": "配SAE21\""},
      {"model": "HGTHB10/φ518", "interface": "配国内机518"},
      {"model": "HGTHB10/φ540", "interface": "配国内机540"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HC2000": {
    "standard": [
      {"model": "HGTHB12.5/18", "interface": "配SAE18\""},
      {"model": "HGTHB12.5/21", "interface": "配SAE21\""},
      {"model": "HGTHB12.5/φ518", "interface": "配国内机518"},
      {"model": "HGTHB12.5/φ640", "interface": "配国内机640"},
      {"model": "HGTHB12.5/φ700", "interface": "配国内机700"},
      {"model": "HGTHB12.5/φ770", "interface": "配国内机770"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HCD2000": {
    "standard": [
      {"model": "HGTHB12.5/18", "interface": "配SAE18\""},
      {"model": "HGTHB12.5/21", "interface": "配SAE21\""},
      {"model": "HGTHB12.5/φ518", "interface": "配国内机518"},
      {"model": "HGTHB12.5/φ640", "interface": "配国内机640"},
      {"model": "HGTHB12.5/φ700", "interface": "配国内机700"},
      {"model": "HGTHB12.5/φ770", "interface": "配国内机770"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HCT2000": {
    "standard": [
      {"model": "HGTHB12.5/18", "interface": "配SAE18\""},
      {"model": "HGTHB12.5/21", "interface": "配SAE21\""},
      {"model": "HGTHB12.5/φ518", "interface": "配国内机518"},
      {"model": "HGTHB12.5/φ640", "interface": "配国内机640"},
      {"model": "HGTHB12.5/φ700", "interface": "配国内机700"},
      {"model": "HGTHB12.5/φ770", "interface": "配国内机770"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HCT2000/1": {
    "standard": [
      {"model": "HGTHB12.5/18", "interface": "配SAE18\""},
      {"model": "HGTHB12.5/21", "interface": "配SAE21\""},
      {"model": "HGTHB12.5/φ700", "interface": "配Φ700飞轮"},
      {"model": "HGTHB12.5/φ770", "interface": "配Φ770飞轮"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HCD2700": {
    "standard": [
      {"model": "HGTHB16/φ770", "interface": "配国内机770"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HC2700": {
    "standard": [
      {"model": "HGTHB16/φ770", "interface": "配国内机770"}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  },
  "HCT2700": {
    "standard": [
      {"model": "HGT3020", "interface": ""}
    ],
    "withCover": [],
    "detachable": [],
    "gearTooth": []
  }
};

/**
 * 技术图片映射 - 齿轮箱型号到技术图纸的映射
 * 图片存放路径: /gearbox-app/images/coupling-tech/
 */
export const couplingTechImages = {
  // 800系列 - 使用HGTHB系列图和800安装图
  'HCD800': ['hgthb-series-matching-table.png', 'gearbox-800-coupling-diagram.png'],
  'HCT800': ['hgthb-series-matching-table.png', 'gearbox-800-coupling-diagram.png'],
  'HCT800/1': ['hgthb-series-matching-table.png', 'gearbox-800-coupling-diagram.png'],
  'HCT800/2': ['hgthb-series-matching-table.png', 'gearbox-800-coupling-diagram.png'],
  'HCT800/3': ['hgthb-series-matching-table.png', 'gearbox-800-coupling-diagram.png'],

  // 1000系列 - 使用HGTHB系列图和对照表
  'HC1000': ['hgthb-series-matching-table.png', 'coupling-model-comparison.png'],
  'HCD1000': ['hgthb-series-matching-table.png', 'coupling-model-comparison.png'],

  // 1100-1200系列 - 使用HGTQ1215配套图
  'HCT1100': ['hgtq1215-matching-diagram.png', 'hgthb-series-matching-table.png'],
  'HCT1200': ['hgtq1215-matching-diagram.png', 'hgthb-series-matching-table.png'],
  'HCT1200/1': ['hgtq1215-matching-diagram.png'],
  'HC1200': ['hgtq1215-matching-diagram.png', 'hgthb-series-matching-table.png'],
  'HC1200/1': ['hgtq1215-matching-diagram.png', 'hgthb-series-matching-table.png'],

  // 1400系列
  'HCD1400': ['hgthb-series-matching-table.png'],
  'HCT1400': ['hgthb-series-matching-table.png'],
  'HCT1400/2': ['hgthb-series-matching-table.png'],

  // 1600系列
  'HC1600': ['hgthb-series-matching-table.png'],
  'HCD1600': ['hgthb-series-matching-table.png'],
  'HCT1600': ['hgthb-series-matching-table.png'],
  'HCT1600/1': ['hgthb-series-matching-table.png'],

  // 2000系列
  'HC2000': ['hgthb-series-matching-table.png'],
  'HCD2000': ['hgthb-series-matching-table.png'],
  'HCT2000': ['hgthb-series-matching-table.png'],
  'HCT2000/1': ['hgthb-series-matching-table.png'],

  // 2700系列
  'HCD2700': ['hgthb-series-matching-table.png'],
  'HC2700': ['hgthb-series-matching-table.png'],
  'HCT2700': ['hgthb-series-matching-table.png']
};

/**
 * 技术图片详细信息
 * 包含标题、描述、适用系列
 */
export const techImageInfo = {
  'hgthb-series-matching-table.png': {
    title: 'HGTHB系列高弹常用主机配套表',
    description: '包含HGTHB5A/6.3A/8A/10A/12.5A系列与主机配套信息，含A/B/C/D四种联接方式图',
    series: ['HGTHB5', 'HGTHB6.3', 'HGTHB8', 'HGTHB10', 'HGTHB12.5']
  },
  'coupling-model-comparison.png': {
    title: '新老型号高弹对照表',
    description: '已被取代的新老型号高弹对照表，含齿形说明',
    series: ['HGTL', 'HGTLX', 'HGTHT', 'HGTHB']
  },
  'hgtq1215-matching-diagram.png': {
    title: 'HGTQ1215高弹常用主机配套表',
    description: 'HGTQ1215系列配套表，含A/B/C/D四种联接方式详图',
    series: ['HGTQ1215']
  },
  'hgtl86-installation-drawing.png': {
    title: 'HGTL8.6/18X2外形安装图',
    description: 'CAD详细外形尺寸图，含技术参数',
    series: ['HGTL8.6', 'HGTLX8.6']
  },
  'gearbox-800-coupling-diagram.png': {
    title: '800系列齿轮箱联轴器安装图',
    description: '800系列齿轮箱与联轴器连接示意图',
    series: ['HCD800', 'HCT800']
  },
  'hc-coupling-spec-sheet.png': {
    title: 'HC高弹工作联系单',
    description: '高弹联轴器技术要求和工作联系单文档',
    series: []
  }
};

/**
 * 获取齿轮箱相关的技术图片
 * @param {string} gearboxModel - 齿轮箱型号
 * @returns {Array} 图片信息数组
 */
export const getTechImagesForGearbox = (gearboxModel) => {
  const imageFiles = couplingTechImages[gearboxModel] || [];
  const basePath = '/gearbox-app/images/coupling-tech/';

  return imageFiles.map(filename => ({
    src: basePath + filename,
    ...techImageInfo[filename]
  }));
};

export default {
  couplingSeriespecs,
  flywheelSpecs,
  gearboxToCouplingMap,
  couplingDetailedModels,
  detailedCouplingMappings,
  couplingDynamicData,
  getCouplingDynamicParams,
  couplingTechImages,
  techImageInfo,
  getRecommendedCouplingForGearbox,
  getFlywheelOptionsForSeries,
  matchCouplingByFlywheel,
  getCouplingTorqueChartData,
  getGearboxConfigStats,
  getTechImagesForGearbox
};
