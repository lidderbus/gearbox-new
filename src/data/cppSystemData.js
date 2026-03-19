// src/data/cppSystemData.js
// CPP (Controllable Pitch Propeller) 可调螺距螺旋桨系统数据
// 包含CPP专用齿轮箱、调距桨、配油器等产品
// 增强版 v2.0: 包含水动力计算、多船级社规范校核、EEXI/CII能效、智能监控、空泡防护
// 更新日期: 2026-01-08

/**
 * CPP齿轮箱系列:
 * - GCS: 单级减速CPP齿轮箱
 * - GCST: 单级减速带PTO的CPP齿轮箱
 * - GCD: 双级减速CPP齿轮箱
 * - GSH: 侧向输出CPP齿轮箱
 * - GCC: 紧凑型CPP齿轮箱
 */

/**
 * IACS成员船级社列表
 * 国际船级社协会 (International Association of Classification Societies)
 */
export const IACS_CLASSIFICATION_SOCIETIES = {
  CCS: {
    code: 'CCS',
    name: '中国船级社',
    fullName: 'China Classification Society',
    country: 'China',
    rules: 'CCS Rules 2024'
  },
  DNV: {
    code: 'DNV',
    name: 'DNV-GL',
    fullName: 'Det Norske Veritas Germanischer Lloyd',
    country: 'Norway/Germany',
    rules: 'DNV Rules July 2025'
  },
  LR: {
    code: 'LR',
    name: '劳氏船级社',
    fullName: "Lloyd's Register",
    country: 'UK',
    rules: 'LR Rules 2024'
  },
  ABS: {
    code: 'ABS',
    name: '美国船级社',
    fullName: 'American Bureau of Shipping',
    country: 'USA',
    rules: 'ABS Rules 2024'
  },
  BV: {
    code: 'BV',
    name: '法国船级社',
    fullName: 'Bureau Veritas',
    country: 'France',
    rules: 'BV Rules 2024'
  },
  RINA: {
    code: 'RINA',
    name: '意大利船级社',
    fullName: 'Registro Italiano Navale',
    country: 'Italy',
    rules: 'RINA Rules 2024'
  },
  NK: {
    code: 'NK',
    name: '日本海事协会',
    fullName: 'Nippon Kaiji Kyokai',
    country: 'Japan',
    rules: 'NK Rules 2024'
  },
  KR: {
    code: 'KR',
    name: '韩国船级社',
    fullName: 'Korean Register',
    country: 'Korea',
    rules: 'KR Rules 2024'
  },
  ClassNK: {
    code: 'ClassNK',
    name: 'ClassNK',
    fullName: 'Nippon Kaiji Kyokai (ClassNK)',
    country: 'Japan',
    rules: 'ClassNK Rules 2024'
  }
};

/**
 * 能效合规标准 (IMO MEPC)
 */
export const ENERGY_EFFICIENCY_STANDARDS = {
  EEXI: {
    name: 'Energy Efficiency Existing Ship Index',
    regulation: 'MEPC.333(76)',
    effectiveDate: '2023-01-01',
    unit: 'g CO₂/ton·mile'
  },
  CII: {
    name: 'Carbon Intensity Indicator',
    regulation: 'MEPC.339(76)',
    effectiveDate: '2023-01-01',
    ratings: ['A', 'B', 'C', 'D', 'E'],
    ratingDescriptions: {
      A: '大幅优于要求',
      B: '略优于要求',
      C: '符合要求',
      D: '略低于要求',
      E: '大幅低于要求'
    }
  },
  EEDI: {
    name: 'Energy Efficiency Design Index',
    regulation: 'MEPC.203(62)',
    phases: {
      phase1: { reduction: 10, period: '2015-2019' },
      phase2: { reduction: 20, period: '2020-2024' },
      phase3: { reduction: 30, period: '2025+' }
    }
  }
};

/**
 * CO₂排放因子 (IMO标准)
 */
export const CO2_EMISSION_FACTORS = {
  HFO: { factor: 3.114, name: '重燃油', fullName: 'Heavy Fuel Oil' },
  MDO: { factor: 3.206, name: '船用柴油', fullName: 'Marine Diesel Oil' },
  MGO: { factor: 3.206, name: '船用轻油', fullName: 'Marine Gas Oil' },
  LNG: { factor: 2.750, name: '液化天然气', fullName: 'Liquefied Natural Gas' },
  LPG: { factor: 3.030, name: '液化石油气', fullName: 'Liquefied Petroleum Gas' },
  Methanol: { factor: 1.375, name: '甲醇', fullName: 'Methanol' },
  Ammonia: { factor: 0.000, name: '氨', fullName: 'Ammonia (Green)' }
};

/**
 * 空泡防护技术选项
 */
export const CAVITATION_PREVENTION_TECHNOLOGIES = {
  standard: {
    code: 'standard',
    name: '标准设计',
    description: '传统叶片设计，满足基本空泡要求',
    cavitationReduction: 0,
    noiseReduction: 0,
    costMultiplier: 1.0
  },
  pressurePores: {
    code: 'pressurePores',
    name: 'PressurePores技术',
    description: '叶片表面微孔泄压技术，有效抑制空泡发生',
    cavitationReduction: 14, // %
    noiseReduction: 21,      // dB
    costMultiplier: 1.25
  },
  composite: {
    code: 'composite',
    name: '复合材料桨叶',
    description: '碳纤维/玻纤复合材料，弹性变形吸收空泡冲击',
    cavitationReduction: 50, // %
    noiseReduction: 15,      // dB
    costMultiplier: 1.80
  },
  coating: {
    code: 'coating',
    name: '纳米涂层',
    description: '表面纳米陶瓷涂层，提高抗侵蚀能力',
    cavitationReduction: 5,  // %
    noiseReduction: 3,       // dB
    costMultiplier: 1.15
  }
};

/**
 * 智能监控传感器类型
 */
export const SMART_MONITORING_SENSORS = {
  pitchSensor: {
    LVDT: { type: 'LVDT', name: '线性可变差动变压器', accuracy: '±0.1°' },
    potentiometer: { type: 'potentiometer', name: '电位计', accuracy: '±0.3°' },
    encoder: { type: 'encoder', name: '编码器', accuracy: '±0.05°' }
  },
  vibrationSensor: {
    piezoelectric: { type: 'piezoelectric', name: '压电式', range: '0-20kHz' },
    MEMS: { type: 'MEMS', name: 'MEMS加速度计', range: '0-10kHz' },
    eddy: { type: 'eddy', name: '电涡流', range: '0-5kHz' }
  },
  temperatureSensor: {
    thermocouple: { type: 'thermocouple', name: '热电偶', accuracy: '±1°C' },
    RTD: { type: 'RTD', name: '热电阻', accuracy: '±0.3°C' },
    infrared: { type: 'infrared', name: '红外', accuracy: '±2°C' }
  },
  oilCondition: {
    particle: { type: 'particle', name: '颗粒计数器', detection: '4-100μm' },
    moisture: { type: 'moisture', name: '水分传感器', detection: '0-100%RH' },
    viscosity: { type: 'viscosity', name: '粘度传感器', range: '1-500cSt' }
  }
};

/**
 * 远程监控通信协议
 */
export const REMOTE_MONITORING_PROTOCOLS = {
  NMEA2000: { name: 'NMEA 2000', type: 'CAN-based', bandwidth: '250kbps' },
  CANBUS: { name: 'CAN Bus', type: 'Industrial', bandwidth: '1Mbps' },
  MODBUS: { name: 'Modbus TCP/RTU', type: 'Industrial', bandwidth: '115.2kbps' },
  PROFINET: { name: 'PROFINET', type: 'Ethernet', bandwidth: '100Mbps' },
  satellite: { name: '卫星通信', type: 'Iridium/VSAT', bandwidth: 'Variable' }
};

/**
 * 船型伴流系数库 (用于推进效率计算)
 */
export const vesselWakeCoefficients = {
  tug: { w: 0.20, t: 0.18, name: '拖轮', description: '系泊牵引、港口作业' },
  fishingTrawler: { w: 0.25, t: 0.20, name: '拖网渔船', description: '拖网作业船' },
  fishingPurse: { w: 0.22, t: 0.18, name: '围网渔船', description: '围网捕捞船' },
  workboat: { w: 0.22, t: 0.18, name: '工作船', description: '工程船、DP定位' },
  psv: { w: 0.30, t: 0.25, name: 'PSV', description: '平台供应船' },
  ahts: { w: 0.25, t: 0.22, name: 'AHTS', description: '三用工作船' },
  dredger: { w: 0.20, t: 0.16, name: '挖泥船', description: '耙吸船、绞吸船' },
  ferry: { w: 0.28, t: 0.24, name: '渡轮', description: '客滚船、车客渡船' },
  cargo: { w: 0.35, t: 0.28, name: '货船', description: '散货船、多用途船' }
};

/**
 * 操作工况参数
 */
export const operatingConditions = {
  bollardPull: {
    name: '系泊工况',
    J: 0,
    loadFactor: 1.2,
    description: '零航速全功率，最大推力',
    typical: '拖轮系泊、DP定位'
  },
  freeRunning: {
    name: '自由航行',
    J: 0.6,
    loadFactor: 1.0,
    description: '设计航速，稳态航行',
    typical: '经济航速巡航'
  },
  maneuver: {
    name: '机动工况',
    J: 0.3,
    loadFactor: 1.1,
    description: '低速机动操纵',
    typical: '港内调头、靠泊'
  },
  crash: {
    name: '紧急倒车',
    loadFactor: 2.0,
    pitchRange: [-15, 30],
    description: '紧急停船制动',
    typical: '避碰紧急制动'
  },
  trawling: {
    name: '拖网工况',
    J: 0.35,
    loadFactor: 1.3,
    description: '拖曳作业，高推力需求',
    typical: '拖网渔船作业'
  }
};

/**
 * 材料强度参数 (CCS规范)
 */
export const bladeMaterials = {
  'NAB': {
    name: '镍铝青铜',
    code: 'Cu3',
    yieldStrength: 245,      // MPa
    tensileStrength: 590,    // MPa
    fatigueStrength: 98,     // MPa
    safetyFactor: 2.5,       // CCS规范安全系数
    density: 7600,           // kg/m³
    corrosionResistance: 'excellent',
    iceClass: 'IC',
    notes: 'CCS认证，冰区增强'
  },
  'MnBz': {
    name: '锰青铜',
    code: 'Cu1',
    yieldStrength: 175,
    tensileStrength: 450,
    fatigueStrength: 70,
    safetyFactor: 2.8,
    density: 8200,
    corrosionResistance: 'good',
    iceClass: null,
    notes: '经济型选择'
  },
  'stainless': {
    name: '不锈钢',
    code: 'CF8M',
    yieldStrength: 280,
    tensileStrength: 520,
    fatigueStrength: 110,
    safetyFactor: 2.3,
    density: 7800,
    corrosionResistance: 'excellent',
    iceClass: null,
    notes: '高速桨首选'
  },
  'Cu4': {
    name: '高强镍铝青铜',
    code: 'Cu4',
    yieldStrength: 275,
    tensileStrength: 650,
    fatigueStrength: 115,
    safetyFactor: 2.4,
    density: 7650,
    corrosionResistance: 'excellent',
    iceClass: 'IB',
    notes: '重载冰区首选'
  }
};

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
    applicablePropellers: ["HI-320", "HF-320", "HS-320"],
    dimensions: "850x950x1100",
    oilCapacity: 80,
    basePrice: 180000,
    discountRate: 0.15,
    factoryPrice: 153000,
    marketPrice: 198000,
    // 多船级社认证
    certifications: {
      CCS: { certificate: "MC2024-GCS320", iceClass: null, notation: null, validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-320", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-320", notation: null, validity: "2028-12-31" },
      ABS: null,
      BV: null,
      RINA: null,
      NK: { certificate: "NK-2024-320", notation: "a-EMC", validity: "2028-09-30" },
      KR: null,
      ClassNK: null
    },
    // 能效参数
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -2.5,  // % 对EEXI的贡献(负值=有利)
      ciiImpact: 'positive',   // 对CII的影响
      hybridReady: false,
      electricCompatible: false,
      pto电动化: false,
      fuelTypes: ['HFO', 'MDO'],
      specificFuelConsumption: 195  // g/kWh 标定燃油消耗率
    },
    // 智能监控
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing'],
      oilConditionMonitoring: false,
      predictiveMaintenance: {
        mtbf: 20000,
        bearingLife: 35000,
        sealLife: 4,
        maintenanceInterval: 6000
      },
      remoteMonitoring: {
        nmea2000: true,
        canbus: true,
        satellite: false
      }
    },
    // 空泡防护配置
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: false,
      urnReduction: 0,
      cavitationMargin: 1.15
    },
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
    applicablePropellers: ["HI-450", "HF-450", "HS-450"],
    dimensions: "1050x1150x1350",
    oilCapacity: 150,
    basePrice: 320000,
    discountRate: 0.15,
    factoryPrice: 272000,
    marketPrice: 352000,
    certifications: {
      CCS: { certificate: "MC2024-GCS450", iceClass: null, notation: null, validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-450", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-450", notation: "EP", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-450", notation: "ENVIRO+", validity: "2029-03-31" },
      BV: null,
      RINA: null,
      NK: { certificate: "NK-2024-450", notation: "a-EMC", validity: "2028-09-30" },
      KR: null,
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -3.0,
      ciiImpact: 'positive',
      hybridReady: true,
      electricCompatible: false,
      fuelTypes: ['HFO', 'MDO', 'LNG'],
      specificFuelConsumption: 190
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 22000,
        bearingLife: 38000,
        sealLife: 5,
        maintenanceInterval: 7000
      },
      remoteMonitoring: {
        nmea2000: true,
        canbus: true,
        satellite: false
      }
    },
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: true,
      urnReduction: 0,
      cavitationMargin: 1.15
    },
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
    certifications: {
      CCS: { certificate: "MC2024-GCS560", iceClass: "IC", notation: null, validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-560", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-560", notation: "EP", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-560", notation: "ENVIRO+", validity: "2029-03-31" },
      BV: { certificate: "BV-2024-560", notation: null, validity: "2028-12-31" },
      RINA: null,
      NK: { certificate: "NK-2024-560", notation: "a-EMC", validity: "2028-09-30" },
      KR: { certificate: "KR-2024-560", notation: null, validity: "2028-12-31" },
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -3.5,
      ciiImpact: 'positive',
      hybridReady: true,
      electricCompatible: true,
      fuelTypes: ['HFO', 'MDO', 'LNG'],
      specificFuelConsumption: 185
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 24000,
        bearingLife: 40000,
        sealLife: 5,
        maintenanceInterval: 7500
      },
      remoteMonitoring: {
        nmea2000: true,
        canbus: true,
        satellite: true
      }
    },
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: true,
      urnReduction: 0,
      cavitationMargin: 1.18
    },
    notes: "适用于大型拖轮、工程船"
  },
  {
    model: "GCS660",
    series: "GCS",
    type: "single-stage-pto",
    description: "单级减速CPP齿轮箱，垂直异中心布置，大功率带PTO",
    inputSpeedRange: [400, 1200],
    ratios: [2.0, 2.54, 2.96, 3.5, 3.95, 4.464],
    transferCapacity: [5.05, 5.05, 5.05, 5.05, 5.05, 4.0],
    maxPower: 3000,
    thrust: 540,
    weight: 5200,
    oilDistributorMount: "front",
    ptoOutput: { position: "top", maxPower: 2750, speed: 1500, ratio: "1:1" },
    applicablePropellers: ["HS-080", "HI-710"],
    dimensions: "待补充",
    oilCapacity: 400,
    centerDistance: 668,
    layout: "垂直异中心",
    efficiency: 0.98,
    basePrice: 1200000,
    discountRate: 0.10,
    factoryPrice: 1080000,
    marketPrice: 1320000,
    certifications: {
      CCS: { certificate: "MC2024-GCS660", iceClass: "IC", notation: "耙吸船", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-660", notation: "CLEAN DESIGN, DP", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-660", notation: "EP, ENVIRO", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-660", notation: "ENVIRO+, DP-2", validity: "2029-03-31" },
      BV: { certificate: "BV-2024-660", notation: "CLEANSHIP", validity: "2028-12-31" },
      RINA: { certificate: "RINA-2024-660", notation: "GREEN PLUS", validity: "2028-12-31" },
      NK: { certificate: "NK-2024-660", notation: "a-EMC, DSS", validity: "2028-09-30" },
      KR: { certificate: "KR-2024-660", notation: null, validity: "2028-12-31" },
      ClassNK: { certificate: "ClassNK-2024-660", validity: "2029-01-31" }
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -5.0,
      ciiImpact: 'very_positive',
      hybridReady: true,
      electricCompatible: true,
      ptoElectrification: true,
      fuelTypes: ['HFO', 'MDO', 'LNG', 'Methanol'],
      specificFuelConsumption: 180
    },
    smartMonitoring: {
      pitchSensor: { type: 'encoder', accuracy: '±0.05°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade', 'pto'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 28000,
        bearingLife: 45000,
        sealLife: 6,
        maintenanceInterval: 8000
      },
      remoteMonitoring: {
        nmea2000: true,
        canbus: true,
        profinet: true,
        satellite: true
      }
    },
    cavitationPrevention: {
      technology: 'pressurePores',
      bladeCoating: 'ceramic',
      compositeOption: true,
      urnReduction: 21,
      cavitationMargin: 1.25
    },
    notes: "4500方耙吸船项目专用配置，支持PTO输出2750kW/1500rpm，全船级社认证"
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
    certifications: {
      CCS: { certificate: "MC2024-GCS710", iceClass: "IB", notation: null, validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-710", notation: "CLEAN DESIGN, ICE C", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-710", notation: "EP, ICE 1C", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-710", notation: "ENVIRO+, ICE C", validity: "2029-03-31" },
      BV: { certificate: "BV-2024-710", notation: "CLEANSHIP", validity: "2028-12-31" },
      RINA: { certificate: "RINA-2024-710", notation: "GREEN PLUS", validity: "2028-12-31" },
      NK: { certificate: "NK-2024-710", notation: "a-EMC, ICE-C", validity: "2028-09-30" },
      KR: { certificate: "KR-2024-710", notation: "ICE C", validity: "2028-12-31" },
      ClassNK: { certificate: "ClassNK-2024-710", validity: "2029-01-31" }
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -4.5,
      ciiImpact: 'very_positive',
      hybridReady: true,
      electricCompatible: true,
      fuelTypes: ['HFO', 'MDO', 'LNG', 'Methanol'],
      specificFuelConsumption: 182
    },
    smartMonitoring: {
      pitchSensor: { type: 'encoder', accuracy: '±0.05°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 26000,
        bearingLife: 42000,
        sealLife: 5,
        maintenanceInterval: 8000
      },
      remoteMonitoring: {
        nmea2000: true,
        canbus: true,
        profinet: true,
        satellite: true
      }
    },
    cavitationPrevention: {
      technology: 'pressurePores',
      bladeCoating: 'ceramic',
      compositeOption: true,
      urnReduction: 18,
      cavitationMargin: 1.20
    },
    notes: "适用于大型拖轮、AHTS、工程船，全船级社认证"
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
    ptoOutput: { position: "top", maxPower: 150, speed: 1500, ratio: "1:1" },
    applicablePropellers: ["HI-450", "HF-450", "HS-450"],
    dimensions: "1100x1200x1450",
    oilCapacity: 160,
    basePrice: 380000,
    discountRate: 0.15,
    factoryPrice: 323000,
    marketPrice: 418000,
    certifications: {
      CCS: { certificate: "MC2024-GCST450", iceClass: null, notation: "PTO", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-T450", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-T450", notation: "EP", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-T450", notation: "ENVIRO+", validity: "2029-03-31" },
      BV: null,
      RINA: null,
      NK: { certificate: "NK-2024-T450", notation: "a-EMC", validity: "2028-09-30" },
      KR: null,
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -3.0,
      ciiImpact: 'positive',
      hybridReady: true,
      electricCompatible: true,
      ptoElectrification: true,
      fuelTypes: ['HFO', 'MDO', 'LNG'],
      specificFuelConsumption: 188
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade', 'pto'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 22000,
        bearingLife: 38000,
        sealLife: 5,
        maintenanceInterval: 7000
      },
      remoteMonitoring: { nmea2000: true, canbus: true, satellite: false }
    },
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: true,
      urnReduction: 0,
      cavitationMargin: 1.15
    },
    notes: "适用于需要辅助动力输出的船舶，PTO电动化ready"
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
    ptoOutput: { position: "top", maxPower: 250, speed: 1500, ratio: "1:1" },
    applicablePropellers: ["HI-560", "HF-560"],
    dimensions: "1300x1450x1700",
    oilCapacity: 300,
    basePrice: 620000,
    discountRate: 0.15,
    factoryPrice: 527000,
    marketPrice: 682000,
    certifications: {
      CCS: { certificate: "MC2024-GCST560", iceClass: "IC", notation: "PTO", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-T560", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-T560", notation: "EP", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-T560", notation: "ENVIRO+", validity: "2029-03-31" },
      BV: { certificate: "BV-2024-T560", notation: null, validity: "2028-12-31" },
      RINA: null,
      NK: { certificate: "NK-2024-T560", notation: "a-EMC", validity: "2028-09-30" },
      KR: { certificate: "KR-2024-T560", notation: null, validity: "2028-12-31" },
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -3.8,
      ciiImpact: 'positive',
      hybridReady: true,
      electricCompatible: true,
      ptoElectrification: true,
      fuelTypes: ['HFO', 'MDO', 'LNG'],
      specificFuelConsumption: 185
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade', 'pto'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 24000,
        bearingLife: 40000,
        sealLife: 5,
        maintenanceInterval: 7500
      },
      remoteMonitoring: { nmea2000: true, canbus: true, satellite: true }
    },
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: true,
      urnReduction: 0,
      cavitationMargin: 1.18
    },
    notes: "适用于大型作业船，支持混合动力升级"
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
    ptoOutput: { position: "top", maxPower: 350, speed: 1500, ratio: "1:1" },
    applicablePropellers: ["HI-710", "HF-710", "HS-080"],
    dimensions: "1600x1750x2000",
    oilCapacity: 500,
    basePrice: 980000,
    discountRate: 0.12,
    factoryPrice: 862400,
    marketPrice: 1078000,
    certifications: {
      CCS: { certificate: "MC2024-GCST710", iceClass: "IB", notation: "PTO, 双机并车", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-T710", notation: "CLEAN DESIGN, ICE C", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-T710", notation: "EP, ICE 1C", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-T710", notation: "ENVIRO+, ICE C", validity: "2029-03-31" },
      BV: { certificate: "BV-2024-T710", notation: "CLEANSHIP", validity: "2028-12-31" },
      RINA: { certificate: "RINA-2024-T710", notation: "GREEN PLUS", validity: "2028-12-31" },
      NK: { certificate: "NK-2024-T710", notation: "a-EMC, ICE-C", validity: "2028-09-30" },
      KR: { certificate: "KR-2024-T710", notation: "ICE C", validity: "2028-12-31" },
      ClassNK: { certificate: "ClassNK-2024-T710", validity: "2029-01-31" }
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -4.5,
      ciiImpact: 'very_positive',
      hybridReady: true,
      electricCompatible: true,
      ptoElectrification: true,
      fuelTypes: ['HFO', 'MDO', 'LNG', 'Methanol'],
      specificFuelConsumption: 180
    },
    smartMonitoring: {
      pitchSensor: { type: 'encoder', accuracy: '±0.05°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade', 'pto'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 26000,
        bearingLife: 42000,
        sealLife: 5,
        maintenanceInterval: 8000
      },
      remoteMonitoring: { nmea2000: true, canbus: true, profinet: true, satellite: true }
    },
    cavitationPrevention: {
      technology: 'pressurePores',
      bladeCoating: 'ceramic',
      compositeOption: true,
      urnReduction: 18,
      cavitationMargin: 1.20
    },
    notes: "适用于大型拖轮、AHTS、PSV等，支持混合动力和双机并车"
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
    applicablePropellers: ["HI-560", "HF-560", "HI-450"],
    dimensions: "1400x1500x1800",
    oilCapacity: 350,
    basePrice: 680000,
    discountRate: 0.15,
    factoryPrice: 578000,
    marketPrice: 748000,
    certifications: {
      CCS: { certificate: "MC2024-GCD560", iceClass: "IC", notation: "双级减速", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-D560", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-D560", notation: "EP", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-D560", notation: "ENVIRO+", validity: "2029-03-31" },
      BV: { certificate: "BV-2024-D560", notation: null, validity: "2028-12-31" },
      RINA: null,
      NK: { certificate: "NK-2024-D560", notation: "a-EMC", validity: "2028-09-30" },
      KR: { certificate: "KR-2024-D560", notation: null, validity: "2028-12-31" },
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -4.0,
      ciiImpact: 'positive',
      hybridReady: true,
      electricCompatible: false,
      fuelTypes: ['HFO', 'MDO', 'LNG'],
      specificFuelConsumption: 183
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 24000,
        bearingLife: 40000,
        sealLife: 5,
        maintenanceInterval: 7500
      },
      remoteMonitoring: { nmea2000: true, canbus: true, satellite: true }
    },
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: true,
      urnReduction: 0,
      cavitationMargin: 1.18
    },
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
    applicablePropellers: ["HI-710", "HF-710", "HS-080"],
    dimensions: "1800x1900x2200",
    oilCapacity: 600,
    basePrice: 1200000,
    discountRate: 0.12,
    factoryPrice: 1056000,
    marketPrice: 1320000,
    certifications: {
      CCS: { certificate: "MC2024-GCD710", iceClass: "IB", notation: "双级减速, 海工", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-D710", notation: "CLEAN DESIGN, ICE C", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-D710", notation: "EP, ICE 1C", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-D710", notation: "ENVIRO+, ICE C", validity: "2029-03-31" },
      BV: { certificate: "BV-2024-D710", notation: "CLEANSHIP", validity: "2028-12-31" },
      RINA: { certificate: "RINA-2024-D710", notation: "GREEN PLUS", validity: "2028-12-31" },
      NK: { certificate: "NK-2024-D710", notation: "a-EMC, ICE-C", validity: "2028-09-30" },
      KR: { certificate: "KR-2024-D710", notation: "ICE C", validity: "2028-12-31" },
      ClassNK: { certificate: "ClassNK-2024-D710", validity: "2029-01-31" }
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -5.0,
      ciiImpact: 'very_positive',
      hybridReady: true,
      electricCompatible: true,
      fuelTypes: ['HFO', 'MDO', 'LNG', 'Methanol'],
      specificFuelConsumption: 178
    },
    smartMonitoring: {
      pitchSensor: { type: 'encoder', accuracy: '±0.05°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 28000,
        bearingLife: 45000,
        sealLife: 6,
        maintenanceInterval: 8000
      },
      remoteMonitoring: { nmea2000: true, canbus: true, profinet: true, satellite: true }
    },
    cavitationPrevention: {
      technology: 'pressurePores',
      bladeCoating: 'ceramic',
      compositeOption: true,
      urnReduction: 21,
      cavitationMargin: 1.22
    },
    notes: "适用于大型船舶和海工平台，全船级社认证"
  },

  // === GSH系列 - 侧向输出 ===
  {
    model: "GSH320",
    series: "GSH",
    type: "side-output",
    description: "侧向输出CPP齿轮箱，适用于特殊布置",
    inputSpeedRange: [750, 2100],
    ratios: [2.5, 3.0, 3.5, 4.0],
    transferCapacity: [0.22, 0.20, 0.18, 0.15],
    maxPower: 480,
    thrust: 55,
    weight: 1400,
    oilDistributorMount: "side",
    outputAngle: 90,
    applicablePropellers: ["HI-320", "HF-320", "HS-320"],
    dimensions: "900x1100x950",
    oilCapacity: 90,
    efficiency: 0.965,
    noiseLevel: { freeRunning: 82, bollardPull: 87 },
    basePrice: 210000,
    discountRate: 0.15,
    factoryPrice: 178500,
    marketPrice: 231000,
    certifications: {
      CCS: { certificate: "MC2024-GSH320", iceClass: null, notation: "侧向输出", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-S320", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-S320", notation: null, validity: "2028-12-31" },
      ABS: null,
      BV: null,
      RINA: null,
      NK: { certificate: "NK-2024-S320", notation: "a-EMC", validity: "2028-09-30" },
      KR: null,
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -2.0,
      ciiImpact: 'positive',
      hybridReady: false,
      electricCompatible: false,
      fuelTypes: ['HFO', 'MDO'],
      specificFuelConsumption: 198
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing'],
      oilConditionMonitoring: false,
      predictiveMaintenance: {
        mtbf: 20000,
        bearingLife: 35000,
        sealLife: 4,
        maintenanceInterval: 6000
      },
      remoteMonitoring: { nmea2000: true, canbus: true, satellite: false }
    },
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: false,
      urnReduction: 0,
      cavitationMargin: 1.15
    },
    notes: "输出轴90°侧向布置，适用于双尾鳍船型"
  },
  {
    model: "GSH450",
    series: "GSH",
    type: "side-output",
    description: "侧向输出CPP齿轮箱，中功率",
    inputSpeedRange: [600, 1800],
    ratios: [2.5, 3.0, 3.5, 4.0],
    transferCapacity: [0.42, 0.38, 0.34, 0.30],
    maxPower: 750,
    thrust: 85,
    weight: 2600,
    oilDistributorMount: "side",
    outputAngle: 90,
    applicablePropellers: ["HI-450", "HF-450", "HS-450"],
    dimensions: "1100x1300x1150",
    oilCapacity: 160,
    efficiency: 0.963,
    noiseLevel: { freeRunning: 84, bollardPull: 89 },
    basePrice: 380000,
    discountRate: 0.15,
    factoryPrice: 323000,
    marketPrice: 418000,
    certifications: {
      CCS: { certificate: "MC2024-GSH450", iceClass: null, notation: "侧向输出", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-S450", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-S450", notation: "EP", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-S450", notation: "ENVIRO+", validity: "2029-03-31" },
      BV: null,
      RINA: null,
      NK: { certificate: "NK-2024-S450", notation: "a-EMC", validity: "2028-09-30" },
      KR: null,
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -2.8,
      ciiImpact: 'positive',
      hybridReady: true,
      electricCompatible: false,
      fuelTypes: ['HFO', 'MDO', 'LNG'],
      specificFuelConsumption: 192
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 22000,
        bearingLife: 38000,
        sealLife: 5,
        maintenanceInterval: 7000
      },
      remoteMonitoring: { nmea2000: true, canbus: true, satellite: false }
    },
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: true,
      urnReduction: 0,
      cavitationMargin: 1.15
    },
    notes: "中功率侧向输出，适用于特种工作船"
  },
  {
    model: "GSH560",
    series: "GSH",
    type: "side-output",
    description: "侧向输出CPP齿轮箱，大功率",
    inputSpeedRange: [500, 1500],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: [0.70, 0.65, 0.58, 0.52, 0.46],
    maxPower: 1400,
    thrust: 145,
    weight: 4200,
    oilDistributorMount: "side",
    outputAngle: 90,
    applicablePropellers: ["HI-560", "HF-560"],
    dimensions: "1350x1550x1400",
    oilCapacity: 300,
    efficiency: 0.960,
    noiseLevel: { freeRunning: 86, bollardPull: 91 },
    basePrice: 620000,
    discountRate: 0.12,
    factoryPrice: 545600,
    marketPrice: 682000,
    certifications: {
      CCS: { certificate: "MC2024-GSH560", iceClass: "IC", notation: "侧向输出", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-S560", notation: "CLEAN DESIGN, ICE C", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-S560", notation: "EP, ICE 1C", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-S560", notation: "ENVIRO+", validity: "2029-03-31" },
      BV: { certificate: "BV-2024-S560", notation: null, validity: "2028-12-31" },
      RINA: null,
      NK: { certificate: "NK-2024-S560", notation: "a-EMC, ICE-C", validity: "2028-09-30" },
      KR: { certificate: "KR-2024-S560", notation: null, validity: "2028-12-31" },
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -3.5,
      ciiImpact: 'positive',
      hybridReady: true,
      electricCompatible: true,
      fuelTypes: ['HFO', 'MDO', 'LNG'],
      specificFuelConsumption: 186
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 24000,
        bearingLife: 40000,
        sealLife: 5,
        maintenanceInterval: 7500
      },
      remoteMonitoring: { nmea2000: true, canbus: true, satellite: true }
    },
    cavitationPrevention: {
      technology: 'pressurePores',
      bladeCoating: 'ceramic',
      compositeOption: true,
      urnReduction: 14,
      cavitationMargin: 1.18
    },
    notes: "大功率侧向输出，支持冰区增强"
  },

  // === GCC系列 - 紧凑型 ===
  {
    model: "GCC320",
    series: "GCC",
    type: "compact",
    description: "紧凑型CPP齿轮箱，空间受限船舶首选",
    inputSpeedRange: [750, 2100],
    ratios: [2.5, 3.0, 3.5],
    transferCapacity: [0.22, 0.20, 0.18],
    maxPower: 500,
    thrust: 58,
    weight: 980,
    oilDistributorMount: "integrated",
    applicablePropellers: ["HI-320", "HF-320", "HS-320"],
    dimensions: "750x850x900",
    oilCapacity: 65,
    efficiency: 0.970,
    noiseLevel: { freeRunning: 80, bollardPull: 85 },
    compactRatio: 0.82,
    basePrice: 195000,
    discountRate: 0.15,
    factoryPrice: 165750,
    marketPrice: 214500,
    certifications: {
      CCS: { certificate: "MC2024-GCC320", iceClass: null, notation: "紧凑型", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-C320", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-C320", notation: null, validity: "2028-12-31" },
      ABS: null,
      BV: null,
      RINA: null,
      NK: { certificate: "NK-2024-C320", notation: "a-EMC", validity: "2028-09-30" },
      KR: null,
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -2.2,
      ciiImpact: 'positive',
      hybridReady: false,
      electricCompatible: false,
      fuelTypes: ['HFO', 'MDO'],
      specificFuelConsumption: 195
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'MEMS', range: '0-10kHz' },
      temperatureSensors: ['oil', 'bearing'],
      oilConditionMonitoring: false,
      predictiveMaintenance: {
        mtbf: 20000,
        bearingLife: 35000,
        sealLife: 4,
        maintenanceInterval: 6000
      },
      remoteMonitoring: { nmea2000: true, canbus: true, satellite: false }
    },
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: false,
      urnReduction: 0,
      cavitationMargin: 1.15
    },
    notes: "紧凑设计，体积比标准型小18%，内置配油器"
  },
  {
    model: "GCC450",
    series: "GCC",
    type: "compact",
    description: "紧凑型CPP齿轮箱，中功率紧凑设计",
    inputSpeedRange: [600, 1800],
    ratios: [2.5, 3.0, 3.5, 4.0],
    transferCapacity: [0.42, 0.38, 0.34, 0.30],
    maxPower: 800,
    thrust: 92,
    weight: 1850,
    oilDistributorMount: "integrated",
    applicablePropellers: ["HI-450", "HF-450", "HS-450"],
    dimensions: "950x1050x1100",
    oilCapacity: 120,
    efficiency: 0.968,
    noiseLevel: { freeRunning: 82, bollardPull: 87 },
    compactRatio: 0.85,
    basePrice: 350000,
    discountRate: 0.15,
    factoryPrice: 297500,
    marketPrice: 385000,
    certifications: {
      CCS: { certificate: "MC2024-GCC450", iceClass: null, notation: "紧凑型", validity: "2029-12-31" },
      DNV: { certificate: "DNV-GL-2024-C450", notation: "CLEAN DESIGN", validity: "2028-06-30" },
      LR: { certificate: "LR-2024-C450", notation: "EP", validity: "2028-12-31" },
      ABS: { certificate: "ABS-2024-C450", notation: "ENVIRO+", validity: "2029-03-31" },
      BV: null,
      RINA: null,
      NK: { certificate: "NK-2024-C450", notation: "a-EMC", validity: "2028-09-30" },
      KR: null,
      ClassNK: null
    },
    energyEfficiency: {
      eexiCompliant: true,
      eexiContribution: -2.8,
      ciiImpact: 'positive',
      hybridReady: true,
      electricCompatible: false,
      fuelTypes: ['HFO', 'MDO', 'LNG'],
      specificFuelConsumption: 190
    },
    smartMonitoring: {
      pitchSensor: { type: 'LVDT', accuracy: '±0.1°' },
      vibrationSensor: { type: 'piezoelectric', range: '0-20kHz' },
      temperatureSensors: ['oil', 'bearing', 'blade'],
      oilConditionMonitoring: true,
      predictiveMaintenance: {
        mtbf: 22000,
        bearingLife: 38000,
        sealLife: 5,
        maintenanceInterval: 7000
      },
      remoteMonitoring: { nmea2000: true, canbus: true, satellite: false }
    },
    cavitationPrevention: {
      technology: 'standard',
      bladeCoating: 'antifouling',
      compositeOption: true,
      urnReduction: 0,
      cavitationMargin: 1.15
    },
    notes: "中功率紧凑型，体积比标准型小15%"
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
    bladeMaterial: "NAB",
    hubMaterial: "铸钢",
    maxSpeed: 350,
    matchingGearboxes: ["GCS320", "GSH320", "GCC320"],
    weight: 1800,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.55,        // 盘面比 Ae/A0
      pitchRatio: 1.0,        // 设计桨距比 P/D
      skew: 20,               // 侧斜角 度
      rake: 8,                // 纵倾角 度
      thickness035R: 0.048,   // 0.35R厚度比 t/D
      thickness060R: 0.030    // 0.60R厚度比 t/D
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 1.8,     // 临界空泡数
      backCavitationLimit: 5, // 背面空泡限制 %
      faceCavitationLimit: 2, // 正面空泡限制 %
      marginFactor: 1.15      // 安全裕度系数
    },
    // CCS强度校核
    strength: {
      material: 'NAB',
      yieldStrength: 245,
      fatigueStrength: 98,
      safetyFactor: 2.5,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-320HI",
      iceClass: "IC",
      valid: "2027-12-31"
    },
    basePrice: 350000,
    discountRate: 0.12,
    factoryPrice: 308000,
    marketPrice: 385000,
    notes: "CCS船级社认证，冰区增强型"
  },
  {
    model: "HI-450",
    series: "HI",
    type: "heavy-duty",
    description: "重载型调距桨，中大功率，冰区增强",
    diameterRange: [2.5, 4.5],
    bladeCount: [4, 5],
    maxPower: 1500,
    pitchRange: [-15, 28],
    bladeMaterial: "NAB",
    hubMaterial: "铸钢",
    maxSpeed: 280,
    matchingGearboxes: ["GCS450", "GCST450", "GCD560", "GSH450", "GCC450"],
    weight: 3200,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.58,
      pitchRatio: 1.05,
      skew: 22,
      rake: 10,
      thickness035R: 0.046,
      thickness060R: 0.028
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 1.6,
      backCavitationLimit: 5,
      faceCavitationLimit: 2,
      marginFactor: 1.15
    },
    // CCS强度校核
    strength: {
      material: 'NAB',
      yieldStrength: 245,
      fatigueStrength: 98,
      safetyFactor: 2.5,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-450HI",
      iceClass: "IC",
      valid: "2027-12-31"
    },
    basePrice: 580000,
    discountRate: 0.12,
    factoryPrice: 510400,
    marketPrice: 638000,
    notes: "CCS船级社认证，冰区增强型，中大功率"
  },
  {
    model: "HI-560",
    series: "HI",
    type: "heavy-duty",
    description: "重载型调距桨，大功率，冰区增强",
    diameterRange: [3.5, 5.6],
    bladeCount: [4, 5, 6],
    maxPower: 2800,
    pitchRange: [-18, 30],
    bladeMaterial: "NAB",
    hubMaterial: "铸钢",
    maxSpeed: 220,
    matchingGearboxes: ["GCS560", "GCST560", "GCD560", "GSH560"],
    weight: 5500,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.60,
      pitchRatio: 1.08,
      skew: 25,
      rake: 12,
      thickness035R: 0.044,
      thickness060R: 0.026
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 1.4,
      backCavitationLimit: 6,
      faceCavitationLimit: 2.5,
      marginFactor: 1.18
    },
    // CCS强度校核
    strength: {
      material: 'NAB',
      yieldStrength: 245,
      fatigueStrength: 98,
      safetyFactor: 2.5,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-560HI",
      iceClass: "IB",
      valid: "2027-12-31"
    },
    basePrice: 920000,
    discountRate: 0.12,
    factoryPrice: 809600,
    marketPrice: 1012000,
    notes: "CCS船级社认证，冰区IB级增强，大功率"
  },
  {
    model: "HI-710",
    series: "HI",
    type: "heavy-duty",
    description: "重载型调距桨，超大功率，极区冰区首选",
    diameterRange: [4.5, 7.1],
    bladeCount: [4, 5, 6],
    maxPower: 4500,
    pitchRange: [-20, 32],
    bladeMaterial: "NAB",
    hubMaterial: "铸钢",
    maxSpeed: 180,
    matchingGearboxes: ["GCS710", "GCST710", "GCD710", "GCS660"],
    weight: 9800,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.62,
      pitchRatio: 1.10,
      skew: 28,
      rake: 15,
      thickness035R: 0.042,
      thickness060R: 0.024
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 1.2,
      backCavitationLimit: 7,
      faceCavitationLimit: 3,
      marginFactor: 1.20
    },
    // CCS强度校核
    strength: {
      material: 'Cu4',
      yieldStrength: 275,
      fatigueStrength: 115,
      safetyFactor: 2.4,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-710HI",
      iceClass: "IA",
      valid: "2027-12-31"
    },
    basePrice: 1600000,
    discountRate: 0.10,
    factoryPrice: 1440000,
    marketPrice: 1760000,
    notes: "CCS船级社认证，极区IA级冰区增强，Cu4高强材料"
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
    bladeMaterial: "MnBz",
    hubMaterial: "铸铁",
    maxSpeed: 380,
    matchingGearboxes: ["GCS320", "GSH320", "GCC320"],
    weight: 1500,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.50,
      pitchRatio: 0.95,
      skew: 15,
      rake: 5,
      thickness035R: 0.052,
      thickness060R: 0.034
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 2.0,
      backCavitationLimit: 4,
      faceCavitationLimit: 1.5,
      marginFactor: 1.12
    },
    // CCS强度校核
    strength: {
      material: 'MnBz',
      yieldStrength: 175,
      fatigueStrength: 70,
      safetyFactor: 2.8,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-320HF",
      iceClass: null,
      valid: "2027-12-31"
    },
    basePrice: 280000,
    discountRate: 0.15,
    factoryPrice: 238000,
    marketPrice: 308000,
    notes: "CCS船级社认证，经济型渔船首选"
  },
  {
    model: "HF-450",
    series: "HF",
    type: "general",
    description: "通用型调距桨，中功率经济型",
    diameterRange: [2.2, 4.5],
    bladeCount: [4],
    maxPower: 1200,
    pitchRange: [-12, 25],
    bladeMaterial: "MnBz",
    hubMaterial: "铸铁",
    maxSpeed: 300,
    matchingGearboxes: ["GCS450", "GCST450", "GSH450", "GCC450"],
    weight: 2800,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.52,
      pitchRatio: 0.98,
      skew: 18,
      rake: 6,
      thickness035R: 0.050,
      thickness060R: 0.032
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 1.9,
      backCavitationLimit: 4.5,
      faceCavitationLimit: 1.8,
      marginFactor: 1.12
    },
    // CCS强度校核
    strength: {
      material: 'MnBz',
      yieldStrength: 175,
      fatigueStrength: 70,
      safetyFactor: 2.8,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-450HF",
      iceClass: null,
      valid: "2027-12-31"
    },
    basePrice: 450000,
    discountRate: 0.15,
    factoryPrice: 382500,
    marketPrice: 495000,
    notes: "CCS船级社认证，中功率经济型"
  },
  {
    model: "HF-560",
    series: "HF",
    type: "general",
    description: "通用型调距桨，大功率经济型",
    diameterRange: [3.0, 5.6],
    bladeCount: [4, 5],
    maxPower: 2200,
    pitchRange: [-15, 28],
    bladeMaterial: "MnBz",
    hubMaterial: "铸钢",
    maxSpeed: 250,
    matchingGearboxes: ["GCS560", "GCST560", "GCD560", "GSH560"],
    weight: 4800,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.55,
      pitchRatio: 1.00,
      skew: 20,
      rake: 8,
      thickness035R: 0.048,
      thickness060R: 0.030
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 1.7,
      backCavitationLimit: 5,
      faceCavitationLimit: 2,
      marginFactor: 1.15
    },
    // CCS强度校核
    strength: {
      material: 'MnBz',
      yieldStrength: 175,
      fatigueStrength: 70,
      safetyFactor: 2.8,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-560HF",
      iceClass: null,
      valid: "2027-12-31"
    },
    basePrice: 720000,
    discountRate: 0.15,
    factoryPrice: 612000,
    marketPrice: 792000,
    notes: "CCS船级社认证，大功率经济型"
  },
  {
    model: "HF-710",
    series: "HF",
    type: "general",
    description: "通用型调距桨，超大功率经济型",
    diameterRange: [4.0, 7.1],
    bladeCount: [4, 5],
    maxPower: 3500,
    pitchRange: [-18, 30],
    bladeMaterial: "NAB",
    hubMaterial: "铸钢",
    maxSpeed: 200,
    matchingGearboxes: ["GCS710", "GCST710", "GCD710"],
    weight: 8500,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.58,
      pitchRatio: 1.02,
      skew: 22,
      rake: 10,
      thickness035R: 0.045,
      thickness060R: 0.028
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 1.5,
      backCavitationLimit: 5.5,
      faceCavitationLimit: 2.2,
      marginFactor: 1.15
    },
    // CCS强度校核
    strength: {
      material: 'NAB',
      yieldStrength: 245,
      fatigueStrength: 98,
      safetyFactor: 2.5,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-710HF",
      iceClass: null,
      valid: "2027-12-31"
    },
    basePrice: 1250000,
    discountRate: 0.12,
    factoryPrice: 1100000,
    marketPrice: 1375000,
    notes: "CCS船级社认证，超大功率通用型，NAB材料"
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
    bladeMaterial: "stainless",
    hubMaterial: "不锈钢",
    maxSpeed: 500,
    matchingGearboxes: ["GCS320", "GSH320", "GCC320"],
    weight: 1200,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.45,
      pitchRatio: 1.15,
      skew: 12,
      rake: 3,
      thickness035R: 0.038,
      thickness060R: 0.022
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 2.2,
      backCavitationLimit: 3,
      faceCavitationLimit: 1,
      marginFactor: 1.25
    },
    // CCS强度校核
    strength: {
      material: 'stainless',
      yieldStrength: 280,
      fatigueStrength: 110,
      safetyFactor: 2.3,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-320HS",
      iceClass: null,
      valid: "2027-12-31"
    },
    basePrice: 320000,
    discountRate: 0.12,
    factoryPrice: 281600,
    marketPrice: 352000,
    notes: "CCS船级社认证，高速船专用，不锈钢材料"
  },
  {
    model: "HS-450",
    series: "HS",
    type: "high-speed",
    description: "高速型调距桨，中功率高速船",
    diameterRange: [1.8, 3.5],
    bladeCount: [4, 5],
    maxPower: 1000,
    pitchRange: [-12, 22],
    bladeMaterial: "stainless",
    hubMaterial: "不锈钢",
    maxSpeed: 420,
    matchingGearboxes: ["GCS450", "GCST450", "GSH450", "GCC450"],
    weight: 2200,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.48,
      pitchRatio: 1.18,
      skew: 15,
      rake: 5,
      thickness035R: 0.036,
      thickness060R: 0.020
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 2.0,
      backCavitationLimit: 3.5,
      faceCavitationLimit: 1.2,
      marginFactor: 1.22
    },
    // CCS强度校核
    strength: {
      material: 'stainless',
      yieldStrength: 280,
      fatigueStrength: 110,
      safetyFactor: 2.3,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-450HS",
      iceClass: null,
      valid: "2027-12-31"
    },
    basePrice: 480000,
    discountRate: 0.12,
    factoryPrice: 422400,
    marketPrice: 528000,
    notes: "CCS船级社认证，中功率高速船，不锈钢材料"
  },

  // === HS-080 - 重载型桨毂 (4500方耙吸船专用) ===
  {
    model: "HS-080",
    series: "HS",
    type: "heavy-duty-hub",
    description: "重载型可调桨桨毂，适用于大型挖泥船",
    hubDiameter: 800,  // mm，桨毂直径
    propellerDiameter: 3000,  // mm，设计螺旋桨直径
    diameterRange: [2.8, 3.5],  // m，可适配螺旋桨直径范围
    bladeCount: [4],
    maxPower: 3000,
    pitchRange: [-20, 30],
    bladeMaterial: "NAB",  // 镍铝青铜 Cu3
    hubMaterial: "铸钢",
    maxSpeed: 200,  // rpm
    outputSpeed: 168,  // 额定输出转速
    bollardThrust: 260,  // 系泊推力 kN
    blockedThrust: 540,  // 堵转推力 kN
    matchingGearboxes: ["GCS660", "GCST710", "GCD710"],
    matchingOilDistributor: "OD-660",  // 配套配油器
    matchingHydraulicUnit: "HPU-22-660",  // 配套液压站
    weight: 6500,
    // 叶片几何参数
    bladeGeometry: {
      areaRatio: 0.65,
      pitchRatio: 0.85,
      skew: 30,
      rake: 18,
      thickness035R: 0.055,
      thickness060R: 0.035
    },
    // 空泡性能参数
    cavitation: {
      criticalSigma: 1.0,
      backCavitationLimit: 8,
      faceCavitationLimit: 4,
      marginFactor: 1.25
    },
    // CCS强度校核
    strength: {
      material: 'NAB',
      yieldStrength: 245,
      fatigueStrength: 98,
      safetyFactor: 2.5,
      ccsCompliant: true
    },
    // CCS认证
    classification: {
      society: "CCS",
      certificate: "MC2024-HS-080",
      iceClass: "IC",
      valid: "2027-12-31"
    },
    basePrice: 1800000,
    discountRate: 0.10,
    factoryPrice: 1620000,
    marketPrice: 1980000,
    hydraulicSystem: {
      brand: "Parker或同等",
      flowRate: 52,  // L/min
      pressure: 90   // bar
    },
    controlSystem: {
      brand: "Noris或同等",
      type: "电动随动式",
      locations: ["驾驶室", "机舱集控室", "现场"]  // 控制点位
    },
    sternSeal: {
      brand: "Lagersmit或同等",
      type: "空气密封"
    },
    notes: "CCS船级社认证，适用于4500方耙吸船项目，中交广州航道局"
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
    applicableGearboxes: ["GCS320", "GCST450", "GSH320", "GCC320"],
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
    applicableGearboxes: ["GCS450", "GCST450", "GCD560", "GSH450", "GCC450"],
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
    applicableGearboxes: ["GCS560", "GCS710", "GCST560", "GCST710", "GCD560", "GCD710", "GSH560"],
    maxPressure: 25,
    flowRate: 60,
    mountType: "flange",
    weight: 180,
    basePrice: 95000,
    factoryPrice: 80750,
    marketPrice: 104500
  },
  {
    model: "OD-660",
    alias: "HOD160",  // Parker内部型号
    description: "大型配油器，适用于GCS660/HS-080系统",
    applicableGearboxes: ["GCS660"],
    maxPressure: 9,   // MPa (90bar)
    pressureBar: 90,  // bar，保留原值供参考
    flowRate: 52,     // L/min
    mountType: "flange",
    weight: 200,
    brand: "Parker或同等",
    basePrice: 120000,
    factoryPrice: 102000,
    marketPrice: 132000,
    notes: "4500方耙吸船项目配套，Parker型号HOD160，工作压力90bar"
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
    applicableGearboxes: ["GCS320", "GSH320", "GCC320"],
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
    applicableGearboxes: ["GCS450", "GCST450", "GCD560", "GSH450", "GCC450"],
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
    applicableGearboxes: ["GCS560", "GCS710", "GCST560", "GCST710", "GCD560", "GCD710", "GSH560"],
    weight: 850,
    basePrice: 185000,
    factoryPrice: 157250,
    marketPrice: 203500
  },
  {
    model: "HPU-22-660",
    description: "中型液压站，4500方耙吸船项目专用",
    power: 22,  // 11kW × 2 电机
    motorConfig: "11kW × 2",  // 双电机配置
    pressure: 90,  // bar (9MPa)
    flowRate: 52,  // L/min
    tankCapacity: 200,  // L
    applicableGearboxes: ["GCS660"],
    brand: "Parker或同等",
    weight: 580,
    basePrice: 168000,
    factoryPrice: 142800,
    marketPrice: 184800,
    notes: "4500方耙吸船项目配套，双11kW电机配置"
  },
  {
    model: "HPU-45",
    description: "大型液压站，适用于超大功率CPP系统",
    power: 45,
    pressure: 90,  // bar (9MPa)
    flowRate: 75,  // L/min
    tankCapacity: 500,
    applicableGearboxes: ["GCS710", "GCST710", "GCD710"],
    brand: "Parker或同等",
    weight: 950,
    basePrice: 220000,
    factoryPrice: 187000,
    marketPrice: 242000,
    notes: "适用于超大功率CPP系统"
  }
];

/**
 * 船型数据 (用于UI选择和效率计算)
 */
export const vesselTypes = [
  { name: '拖轮', wakeCoefficient: 0.20, thrustDeduction: 0.18, description: '系泊牵引' },
  { name: '渔船', wakeCoefficient: 0.25, thrustDeduction: 0.20, description: '拖网作业' },
  { name: '工程船', wakeCoefficient: 0.22, thrustDeduction: 0.18, description: 'DP定位作业' },
  { name: 'PSV', wakeCoefficient: 0.30, thrustDeduction: 0.25, description: '平台供应' },
  { name: 'AHTS', wakeCoefficient: 0.25, thrustDeduction: 0.22, description: '三用工作船' },
  { name: '挖泥船', wakeCoefficient: 0.20, thrustDeduction: 0.16, description: '耙吸/绞吸' },
  { name: '客船', wakeCoefficient: 0.28, thrustDeduction: 0.24, description: '客滚渡轮' },
  { name: '货船', wakeCoefficient: 0.35, thrustDeduction: 0.28, description: '散货多用途' }
];

/**
 * CPP型号命名映射表
 * 将CPP数据库的虚拟型号名映射到实际项目中使用的真实型号名
 * 基于2026年3月销售部项目跟踪Excel数据
 */
export const cppModelNameMapping = {
  gearbox: {
    'GCS320': {
      realModels: ['GCS320'],
      note: '中型渔船、工作船'
    },
    'GCS450': {
      realModels: ['GCS450'],
      note: '大型渔船、拖轮'
    },
    'GCS560': {
      realModels: ['GCS560'],
      note: '大型拖轮、工程船'
    },
    'GCS660': {
      realModels: ['GCS660', 'GCS49.61'],
      note: '已签项目: 1400m车道滚装船(GCS660), 中心距.减速比格式(GCS49.61)',
      projects: ['1400m车道滚装船']
    },
    'GCS710': {
      realModels: ['GCS710'],
      note: '大型拖轮、AHTS'
    },
    'GCST450': {
      realModels: ['GCST44', 'GCST44B', 'GCST44C', 'GCST33', 'GCST15', 'GCST11'],
      note: '覆盖多型号: GCST11(46mAHTS), GCST15(拖网渔船), GCST33(173mLNG), GCST44B/C(工作船/渔船)',
      projects: ['46mAHTS', '拖网渔船T400K', '173米LNG甲板运输船', '73m工作船', '66m拖网渔船']
    },
    'GCST560': {
      realModels: ['GCST55'],
      note: '73.8m拖网渔船',
      projects: ['73.8m拖网渔船']
    },
    'GCST710': {
      realModels: ['GCST710'],
      note: '大型作业船'
    }
  },
  propeller: {
    'HF-320': {
      realModels: ['4HF065'],
      note: '4HF系列65型'
    },
    'HS-320': {
      realModels: ['4HS070', '4HS085', '4HS095'],
      note: '4HS系列70/85/95型'
    },
    'HS-450': {
      realModels: ['4HS130'],
      note: '4HS系列130型'
    },
    'HS-080': {
      realModels: ['HS080', 'HS100', 'HS140'],
      note: 'HS系列(非4叶)80/100/140型'
    }
  }
};

/**
 * 根据CPP数据库型号获取真实型号名列表
 * @param {string} category - 'gearbox' 或 'propeller'
 * @param {string} dbModel - 数据库中的型号名
 * @returns {string[]} 真实型号名列表
 */
export function getRealModelNames(category, dbModel) {
  const mapping = cppModelNameMapping[category]?.[dbModel];
  return mapping ? mapping.realModels : [dbModel];
}

/**
 * 根据真实型号名反查CPP数据库型号
 * @param {string} category - 'gearbox' 或 'propeller'
 * @param {string} realModel - 真实型号名
 * @returns {string|null} 数据库中的型号名
 */
export function getDBModelName(category, realModel) {
  const mappings = cppModelNameMapping[category];
  if (!mappings) return null;
  for (const [dbModel, info] of Object.entries(mappings)) {
    if (info.realModels.includes(realModel)) return dbModel;
  }
  return null;
}

// 导出汇总
export const cppSystemData = {
  gearboxes: cppGearboxes,
  propellers: cppPropellers,
  oilDistributors,
  hydraulicUnits: cppHydraulicUnits,
  vesselTypes,
  // v2.0 新增数据
  classificationSocieties: IACS_CLASSIFICATION_SOCIETIES,
  energyEfficiencyStandards: ENERGY_EFFICIENCY_STANDARDS,
  co2EmissionFactors: CO2_EMISSION_FACTORS,
  cavitationTechnologies: CAVITATION_PREVENTION_TECHNOLOGIES,
  smartMonitoringSensors: SMART_MONITORING_SENSORS,
  remoteMonitoringProtocols: REMOTE_MONITORING_PROTOCOLS,
  // v3.0 命名映射
  modelNameMapping: cppModelNameMapping
};

export default cppSystemData;
