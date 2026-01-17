/**
 * 混合动力推进系统数据库
 * Hybrid Propulsion System Database
 *
 * 创建日期: 2026-01-03
 * 更新日期: 2026-01-04 (多品牌支持)
 * 版本: 2.0.0
 *
 * 数据来源:
 *   - 杭州前进齿轮箱集团 (Hangchi/Advance) - BRAND: ADVANCE
 *   - 重庆齿轮箱 - BRAND: CHONGCHI
 *   - 南高齿 - BRAND: NGC
 *   - ZF Marine - BRAND: ZF_MARINE
 *   - Kongsberg Maritime (竞品参考)
 *   - RENK Group (竞品参考)
 *
 * PTI/PTO/PTH 工作模式说明:
 *   PTO (Power Take-Off): 轴带发电模式 - 主机驱动发电机发电
 *   PTI (Power Take-In): 混合动力模式 - 电机辅助主机推进
 *   PTH (Power Take-Home): 纯电推模式 - 仅电机驱动,主机脱开
 */

import { BRAND_IDS, DEFAULT_BRAND } from './brandConfig';

// 混合动力工作模式定义
export const HYBRID_MODES = {
  PTO: {
    code: 'PTO',
    name: 'Power Take-Off',
    nameCN: '轴带发电模式',
    description: '主机通过齿轮箱驱动发电机,为船舶电网供电或为电池充电',
    descriptionEN: 'Main engine drives generator through gearbox to supply ship grid or charge batteries',
    typicalPowerRange: '10-30% of main engine power',
    fuelSavings: '5-15%',
    applications: ['航行发电', '电池充电', '减少辅机运行']
  },
  PTI: {
    code: 'PTI',
    name: 'Power Take-In',
    nameCN: '混合动力模式',
    description: '电机辅助主机推进,提供额外10-15%功率',
    descriptionEN: 'Electric motor assists main engine propulsion, providing additional 10-15% power',
    typicalPowerRange: '10-15% of main engine power',
    fuelSavings: '10-20%',
    applications: ['负荷高峰', '加速航行', '恶劣海况']
  },
  PTH: {
    code: 'PTH',
    name: 'Power Take-Home',
    nameCN: '纯电推模式',
    description: '主机脱开,仅由电机驱动螺旋桨',
    descriptionEN: 'Main engine disengaged, propeller driven by electric motor only',
    typicalPowerRange: '5-20% of main engine power',
    fuelSavings: '100% (零排放)',
    applications: ['港口进出', '紧急回港', '环保区域', '静音航行']
  }
};

// 杭州前进混合动力齿轮箱系列 (基于2024年8月发布的机电一体化系统)
// 2026-01-15更新: 补充GC系列PTO/PTI详细参数 (来源: chinaadvance.com官网)
export const ADVANCE_HYBRID_SERIES = {
  brandId: BRAND_IDS.ADVANCE,  // 品牌标识符
  manufacturer: '杭州前进齿轮箱集团股份有限公司',
  manufacturerEN: 'Hangzhou Advance Gearbox Group Co., Ltd.',
  stockCode: '601177',
  releaseDate: '2024-08',
  systemName: '机电一体化船用混合动力齿轮箱成套系统',
  systemNameEN: 'Mechatronic Marine Hybrid Power Gearbox System',
  website: 'https://www.chinaadvance.com',

  // 系统组成
  components: [
    'PTO增强型齿轮箱',      // PTO-enhanced gearbox
    'PTI/PTO高效永磁电机',  // PTI/PTO high-efficiency PM motor
    '混动控制柜'            // Hybrid control cabinet
  ],

  // 支持的工作模式
  supportedModes: ['PTO', 'PTI', 'PTH'],

  // 技术特点
  features: [
    '借鉴车载油电混合动力系统设计理念',
    '高效永磁电机,单位能量密度大',
    '专利技术与增强型齿轮箱有机结合',
    '整体船检认证',
    '5G远程监控技术',
    'EMS自动管理电能',
    'PMS自动管理功率分配',
    '电力驱动可额外提供10-15%发动机功率',
    '适用于船舶负荷高峰值运行工况'
  ],

  // 节能效果
  fuelSavingsRange: {
    min: 15,  // %
    max: 30,  // %
    note: '每航次预计节省燃油15%-30%'
  },

  // GC系列船用齿轮箱 (带PTO/PTI) - 官网确认型号
  // 来源: https://www.chinaadvance.com/products/
  gcSeries: {
    name: 'GC系列船用齿轮箱 (带PTO/PTI)',
    nameEN: 'GC-Series Marine Gearbox with PTO/PTI',
    description: '与发动机和CPP配合组成主推进系统，广泛用于货船、油轮和集装箱船',
    features: [
      '离合、减速、承受螺旋桨推力功能',
      '模块化设计，支持PTO和PTI功能',
      '成熟可靠的液压控制系列',
      '机械和自动控制，本地应急控制和远程控制'
    ],

    // 子系列详细配置 - 2026-01-15更新: 添加官网详细技术参数
    // 数据来源: https://www.chinaadvance.com/products/18.html + WebSearch行业数据
    subSeries: [
      {
        code: 'GCS',
        name: 'GCS系列',
        config: '垂直异心',
        stages: 1,
        hybridModes: ['PTO'],
        application: 'CPP系统主推进',
        status: 'confirmed',
        // 详细技术参数 (官网数据)
        specs: {
          ratioRange: { min: 2, max: 4 },
          transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
          inputSpeedRange: { min: 900, max: 1800, unit: 'rpm' },
          ptoPosition: '输出垂直上方',
          description: '一级减速，离合减速功能，输出垂直上方带辅助功率输出轴(PTO)'
        }
      },
      {
        code: 'GCST',
        name: 'GCST系列',
        config: '垂直异心',
        stages: 1,
        hybridModes: ['PTO', 'PTI'],  // 关键: 同时支持PTO和PTI!
        application: 'CPP系统主推进 (加强型/混动型)',
        status: 'confirmed',
        // 详细技术参数 (官网数据)
        specs: {
          ratioRange: { min: 4, max: 6 },
          transmissionCapacity: { min: 3.446, max: 6.99, unit: 'kW/(r/min)' },
          inputSpeedRange: { min: 900, max: 1800, unit: 'rpm' },
          ptoPosition: '辅助功率输出轴',
          ptiPosition: '辅助功率输入轴',
          description: '一级减速，输入输出垂直异中心，同时支持PTO和PTI混动功能'
        },
        highlight: true  // 标记为混动核心产品
      },
      {
        code: 'GCSE',
        name: 'GCSE系列',
        config: '垂直异心',
        stages: 1,
        hybridModes: ['PTO'],
        application: 'CPP系统主推进 (经济型)',
        status: 'confirmed',
        specs: {
          ratioRange: { min: 2, max: 4 },
          transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
          inputSpeedRange: { min: 900, max: 1800, unit: 'rpm' },
          description: '经济型配置，支持PTO输出'
        }
      },
      {
        code: 'GCH',
        name: 'GCH系列',
        config: '水平异心',
        stages: 1,
        hybridModes: ['PTO'],
        application: 'CPP系统主推进',
        status: 'confirmed',
        specs: {
          ratioRange: { min: 2, max: 4 },
          transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
          inputSpeedRange: { min: 900, max: 1800, unit: 'rpm' },
          ptoPosition: '输出垂直上方',
          description: '水平异心配置，一级减速，支持PTO输出'
        }
      },
      {
        code: 'GCHT',
        name: 'GCHT系列',
        config: '水平异心',
        stages: 1,
        hybridModes: ['PTO', 'PTI'],  // 加强型也支持PTI
        application: 'CPP系统主推进 (加强型/混动型)',
        status: 'confirmed',
        specs: {
          ratioRange: { min: 4, max: 6 },
          transmissionCapacity: { min: 3.446, max: 6.99, unit: 'kW/(r/min)' },
          inputSpeedRange: { min: 900, max: 1800, unit: 'rpm' },
          description: '水平异心加强型，支持PTO/PTI混动'
        },
        highlight: true
      },
      {
        code: 'GCHE',
        name: 'GCHE系列',
        config: '水平异心',
        stages: 1,
        hybridModes: ['PTO'],
        application: 'CPP系统主推进 (经济型)',
        status: 'confirmed',
        specs: {
          ratioRange: { min: 2, max: 4 },
          transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
          inputSpeedRange: { min: 900, max: 1800, unit: 'rpm' },
          description: '水平异心经济型配置'
        }
      },
      {
        code: 'GCD',
        name: 'GCD系列',
        config: '水平异心',
        stages: 1,
        hybridModes: ['PTO'],
        application: '倒顺离合减速一体',
        status: 'confirmed',
        specs: {
          ratioRange: { min: 2, max: 4 },
          transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
          inputSpeedRange: { min: 900, max: 1800, unit: 'rpm' },
          ptoPosition: '输出垂直上方',
          description: '一级减速，倒顺离合减速一体，支持PTO输出'
        }
      },
      {
        code: 'GCC',
        name: 'GCC系列',
        config: '二级减速',
        stages: 2,
        hybridModes: ['PTO'],
        application: '大速比需求',
        status: 'confirmed',
        specs: {
          ratioRange: { min: 2, max: 6 },
          transmissionCapacity: { min: 0.257, max: 19.101, unit: 'kW/(r/min)' },
          inputSpeedRange: { min: 900, max: 1800, unit: 'rpm' },
          ptoPosition: '输出水平异侧',
          description: '二级减速，输入输出同中心，输出水平异侧可带PTO'
        }
      }
    ]
  },

  // 船舶辅助齿轮箱 (专用PTO输出)
  auxiliaryGearbox: {
    name: '船舶辅助齿轮箱',
    nameEN: 'Marine Auxiliary Gearbox',
    description: '用于非主推进用途，驱动液压泵、发电机、泥浆泵等',
    features: [
      '离合功能',
      '增速或减速',
      '制动功能',
      '多PTO输出'
    ],
    applications: ['液压泵驱动', '轴带发电机', '泥浆泵', '消防泵', '货油泵'],
    status: 'confirmed'
  },

  // "上海之星"号游船应用案例 (2024年)
  applicationCases: [
    {
      vessel: '上海之星号',
      vesselEN: 'Star of Shanghai',
      type: '游船',
      owner: '东方明珠',
      year: 2024,
      features: [
        '搭载PTI、PTH模块',
        '混动（柴油机、电机）双输入模式',
        '独立驱动模式',
        '正倒车各三种工况'
      ],
      status: '已交付'
    }
  ],

  // 预估可用型号 (基于现有HC/HCD系列推断)
  estimatedModels: [
    {
      baseModel: 'HC1400',
      hybridModel: 'HC1400-PTI',
      minPower: 360,
      maxPower: 1000,
      ptiPowerEstimate: '100-150 kW',
      ptoPowerEstimate: '80-120 kW',
      status: '预估型号，待厂家确认'
    },
    {
      baseModel: 'HCD1400',
      hybridModel: 'HCD1400-PTI',
      minPower: 400,
      maxPower: 1200,
      ptiPowerEstimate: '120-180 kW',
      ptoPowerEstimate: '100-150 kW',
      status: '预估型号，待厂家确认'
    },
    {
      baseModel: 'HC2000',
      hybridModel: 'HC2000-PTI',
      minPower: 600,
      maxPower: 1500,
      ptiPowerEstimate: '150-225 kW',
      ptoPowerEstimate: '120-180 kW',
      status: '预估型号，待厂家确认'
    },
    {
      baseModel: 'HCD2000',
      hybridModel: 'HCD2000-PTI',
      minPower: 700,
      maxPower: 1800,
      ptiPowerEstimate: '180-270 kW',
      ptoPowerEstimate: '150-220 kW',
      status: '预估型号，待厂家确认'
    }
  ],

  // 混动状态 - 2026-01-15更新: 根据官网数据修正混动支持状态
  hybridStatus: {
    available: true,
    modes: ['PTO', 'PTI', 'PTH'],
    // 所有支持PTO/PTI的GC系列
    hybridSeries: ['GCS', 'GCST', 'GCSE', 'GCH', 'GCHT', 'GCHE', 'GCC', 'GCD'],
    // 仅支持PTO的系列
    ptoOnlySeries: ['GCS', 'GCSE', 'GCH', 'GCHE', 'GCD', 'GCC'],
    // 支持完整PTO+PTI混动的系列 (T=加强型)
    fullHybridSeries: ['GCST', 'GCHT'],  // 只有加强型(T)系列同时支持PTO和PTI
    confirmed: true,
    note: 'GCST/GCHT加强型系列同时支持PTO和PTI混动，2024年8月机电一体化系统正式推向市场'
  },

  // 数据状态
  dataStatus: 'imported',
  dataVersion: '2026.01.15',
  note: '数据来源杭齿官网及行业资料，2026-01-15更新GC系列PTO/PTI详细参数'
};

// ZF Marine 混合动力齿轮箱数据
// 2026-01-04更新: 完整型号列表及详细参数
export const ZF_MARINE_HYBRID = {
  brandId: BRAND_IDS.ZF_MARINE,  // 品牌标识符
  manufacturer: 'ZF Friedrichshafen AG',
  country: 'Germany',
  website: 'https://www.zf.com/products/en/marine/',

  // 功率覆盖范围 (2026-01-04 官网数据)
  powerRange: {
    min: 10,     // kW (小型机械系列)
    max: 12000,  // kW (大型商用系列)
    unit: 'kW'
  },

  // PTI混动专用型号 (核心产品)
  hybridModels: [
    {
      model: 'ZF 3300 PTI',
      type: 'parallel',
      minPower: 600,
      maxPower: 1200,
      unit: 'kW',
      ptiPower: null,  // 待确认
      ptoPower: null,
      ratioRange: null,
      features: ['Parallel configuration', 'Hybrid transmission'],
      application: '并车混动推进',
      status: 'confirmed'
    },
    {
      model: 'ZF 3200 A PTI',
      type: 'down-angle',
      minPower: 1295,
      maxPower: 1940,
      unit: 'kW',
      ptiPower: 500,
      ptoPower: null,
      torqueMain: 7560,  // Nm
      torquePTI: 1500,   // Nm
      ratioRange: { main: { min: 1.351, max: 3.444 }, pti: { min: 1.892, max: 4.240 } },
      features: ['Down-angle design', 'Compact installation'],
      application: '快艇、游艇混动推进',
      status: 'confirmed'
    },
    {
      model: 'ZF 3200 V PTI',
      type: 'v-drive',
      minPower: 1295,
      maxPower: 1940,
      unit: 'kW',
      ratioRange: { main: { min: 2.588, max: 4.250 } },
      features: ['V-drive configuration', 'Engine amidships installation'],
      application: 'V型驱动配置',
      status: 'confirmed'
    },
    {
      model: 'ZF 5200 A PTI',
      type: 'down-angle',
      minPower: 1200,
      maxPower: 2463,
      unit: 'kW',
      ptiPower: null,
      ptoPower: null,
      ratioRange: { main: { min: 2.588, max: 4.250 }, pti: { min: 2.588, max: 13.813 } },
      features: ['Down-angle design', 'High power', 'Extended PTI ratio range'],
      application: '快船、渡轮混动推进',
      status: 'confirmed'
    },
    {
      model: 'ZF 3000 NRD PTI',
      type: 'waterjet',
      minPower: 1000,
      maxPower: 1940,
      unit: 'kW',
      ptiPower: 250,
      ptoPower: null,
      torquePTI: 1500,  // Nm
      ratioRange: { main: { min: 1.093, max: 2.952 } },
      features: ['Waterjet application', 'NRD configuration', 'No reverse'],
      application: '喷水推进混动',
      status: 'confirmed'
    },
    {
      model: 'ZF 8300 PTI',
      type: 'high-power',
      minPower: 5000,
      maxPower: 11500,
      unit: 'kW',
      ptiPower: null,
      ptoPower: null,
      features: ['High-power conventional transmission', 'PTI option', 'Large vessel'],
      application: '大型船舶混动推进',
      status: 'confirmed'
    }
  ],

  // 完整型号索引 (2026-01-04 官网数据)
  modelIndex: {
    // 小型机械换向系列 (10-1500 HP / 7.5-1120 kW)
    mechanical: {
      models: ['ZF 12M', 'ZF 15M', 'ZF 15MA', 'ZF 15MIV', 'ZF 25M', 'ZF 25MA', 'ZF 30M'],
      powerRange: { min: 10, max: 200, unit: 'kW' },
      configurations: ['Dropbox', 'Angle', 'V-drive'],
      features: ['Mechanical clutch', 'Direct drive option']
    },
    // 小型液压换向系列
    hydraulicSmall: {
      models: ['ZF 25', 'ZF 25A', 'ZF 45-1', 'ZF 45A', 'ZF 45C'],
      powerRange: { min: 30, max: 150, unit: 'kW' },
      configurations: ['Dropbox', 'Angle', 'Co-axial'],
      features: ['Hydraulic clutch', 'Smooth engagement']
    },
    // 中型液压系列
    hydraulicMid: {
      models: ['ZF 63', 'ZF 68', 'ZF 85A', 'ZF 90TS', 'ZF 115IVTS'],
      powerRange: { min: 100, max: 500, unit: 'kW' },
      configurations: ['Multiple'],
      features: ['Trolling valve option', 'Electronic controls']
    },
    // 高性能系列 (游艇/快艇)
    highPerformance: {
      models: ['ZF 220', 'ZF 280', 'ZF 286', 'ZF 301', 'ZF 325', 'ZF 360', 'ZF 400', 'ZF 500', 'ZF 550', 'ZF 665'],
      powerRange: { min: 200, max: 1500, unit: 'kW' },
      configurations: ['Dropbox', 'Angle', 'V-drive', 'Down-angle'],
      features: ['High-speed application', 'Light alloy housing']
    },
    // 商用重载系列 (铸铁)
    commercial: {
      models: ['ZF W220', 'ZF W320', 'ZF W325', 'ZF W340', 'ZF W350-1', 'ZF W650'],
      powerRange: { min: 300, max: 2000, unit: 'kW' },
      configurations: ['Cast iron housing'],
      features: ['Heavy-duty', 'Commercial vessels']
    },
    // 大型船舶系列
    largeSeries: {
      models: ['ZF 2000', 'ZF 2050', 'ZF 2150', 'ZF 3000', 'ZF 5000', 'ZF 8000', 'ZF 9000 A', 'ZF 9000 V'],
      powerRange: { min: 1053, max: 3440, unit: 'kW' },
      configurations: ['Vertical offset', 'Down-angle', 'Multiple engine'],
      features: ['High power', 'PTO options', 'Twin screw']
    },
    // PTI混动专用系列
    hybrid: {
      models: ['ZF 3200 A PTI', 'ZF 3200 V PTI', 'ZF 3300 PTI', 'ZF 5200 A PTI', 'ZF 3000 NRD PTI', 'ZF 8300 PTI'],
      powerRange: { min: 600, max: 11500, unit: 'kW' },
      configurations: ['Down-angle', 'V-drive', 'Parallel', 'Waterjet'],
      features: ['PTI electric motor interface', 'Hybrid propulsion', 'IMO compliance']
    }
  },

  // ZF支持的配置
  configurations: ['FPP', 'CPP', 'Waterjet'],
  housingMaterials: ['Cast Iron', 'Light Alloy'],
  reversing: ['DR (diagonal right)', 'DL (diagonal left)'],

  // 认证资质
  certifications: ['DNV', 'LR', 'BV', 'ABS', 'CCS', 'NK', 'KR', 'RINA', 'GL'],

  // 数据状态
  dataStatus: 'imported',
  dataVersion: '2026.01.04',
  note: '数据来源ZF Marine官网，2026-01-04更新完整型号索引'
};

// Kongsberg Maritime 减速齿轮箱数据
export const KONGSBERG_GEARBOX = {
  manufacturer: 'Kongsberg Maritime',
  country: 'Norway',
  website: 'https://www.kongsberg.com/maritime/products/reduction-gears/',
  note: '原Scana Volda产品线',

  powerRange: {
    min: 2000,
    max: 18000,
    unit: 'kW'
  },

  torqueRange: {
    min: 90,
    max: 1350,
    unit: 'kNm'
  },

  // GHC系列
  ghcSeries: {
    torqueRange: { min: 90, max: 950, unit: 'kNm' },
    sizes: [550, 650, 750, 850, 950, 1080, 1280],

    configurations: [
      { code: 'GHC', description: 'Standard propulsion only' },
      { code: 'GHC-P', description: 'Primary PTO/PTI shaft', example: '850GHC-P600' },
      { code: 'GHC-S', description: 'Secondary PTO shaft', example: '850GHC-S600' },
      { code: 'GHC-SC', description: 'Secondary PTO with clutch', example: '850GHC-SC600' },
      { code: 'GHC-PC/SC', description: 'Primary + Secondary with twin clutch', example: '850GHC-PC/SC600' }
    ],

    hydraulicVariants: [
      { code: 'GHC', description: 'Single-tube hydraulic, vertical 550-1080' },
      { code: 'GDC', description: 'Twin-tube system, V&H 650-1080' },
      { code: 'GFC', description: 'Separate hydraulic, V&H 550-1280' }
    ]
  },

  // 支持的模式
  supportedModes: ['PTO', 'PTI', 'PTH'],

  // 配置选项
  setupOptions: ['SISO', 'TISO', 'Vertical offset', 'Horizontal offset', 'Single clutch', 'Twin clutch']
};

// RENK Group 混合动力系统数据
export const RENK_HYBRID = {
  manufacturer: 'RENK Group',
  country: 'Germany',
  website: 'https://www.renk.com/en/products/marine/',

  // MARHY系列 (Maritime Hybrid Drive)
  marhy: {
    name: 'MARHY',
    fullName: 'Maritime Hybrid Drive',
    description: 'Geared PTO/PTI/PTH system mounted on propulsion shaft line',

    powerRange: {
      pto: { min: 500, max: 10000, unit: 'kW' },
      pti: { min: 500, max: 3000, unit: 'kW' },
      pth: { min: 500, max: 10000, unit: 'kW' }
    },

    // 可服务的主推进功率
    maxPropulsionPower: 60000,  // kW (60 MW)

    centerDistance: {
      min: 1135,
      max: 2500,
      unit: 'mm',
      note: 'PTO shaft to propeller shaft'
    },

    // 系统组成
    components: [
      'RENK Propeller Shaft Clutch (PSC)',
      'RENK tunnel gearbox',
      'Highly flexible couplings',
      'Electric motor/generator',
      'Frequency converter with harmonic filters',
      'Digital control & monitoring system'
    ],

    supportedPropellers: ['FPP', 'CPP'],
    supportedModes: ['PTO', 'PTI', 'PTH'],

    // 实际应用案例
    applications: [
      {
        vessel: 'Knutsen OAS small LNG carrier',
        capacity: '30,000 m³',
        builder: 'Hyundai Mipo Dockyard',
        engine: 'WINGD 5X52 dual-fuel',
        enginePower: 6710,  // kW
        engineRPM: 93.7,
        ptoPower: 1000,  // kW
        pthPower: 1000   // kW
      }
    ]
  },

  // IFPS系列 (Integrated Front-end Power System)
  ifps: {
    name: 'IFPS',
    fullName: 'Integrated Front-end Power System',
    description: 'Geared PTO system mounted on front of two-stroke engine',

    powerOptions: [500, 1000, 1500, 2000],  // kW
    unit: 'kW',

    components: [
      'Elastic coupling',
      'Frequency converter',
      'Generator'
    ],

    // 实际应用案例
    applications: [
      {
        vessel: 'Stena Bulk chemical/product tankers',
        class: 'IMOII MeMax',
        capacity: '49,900 dwt',
        builder: 'Guangzhou International Shipyard',
        engine: 'MAN 6G50ME-C9.6-LGMIN',
        enginePower: 7600,  // kW
        engineRPM: 84.4,
        ptoPower: 1000   // kW
      }
    ]
  }
};

// 重庆齿轮箱混合动力系列 - GC系列专用混动配置
// 2026-01-04新增: 基于官网数据整理的详细混动参数
export const CHONGCHI_HYBRID_SERIES = {
  brandId: BRAND_IDS.CHONGCHI,
  manufacturer: '重庆齿轮箱有限责任公司',
  manufacturerEN: 'Chongqing Gearbox Co., Ltd.',
  parent: '中国船舶集团有限公司(CSSC)',
  technology: '德国LOHMANN技术引进',
  releaseDate: '2020+',  // GC系列混动配置推出时间
  systemName: 'GC系列混合动力齿轮箱系统',
  systemNameEN: 'GC Series Hybrid Gearbox System',

  // 支持的工作模式
  supportedModes: ['PTO', 'PTI'],  // GCST系列支持双模式

  // 系统组成
  components: [
    'GC系列齿轮箱本体',
    'PTO功率分支输出接口',
    'PTI电机接入接口 (GCST系列)',
    '离合器系统',
    '液压控制系统'
  ],

  // 技术特点
  features: [
    '德国LOHMANN成熟技术基础',
    'GCST系列支持PTI/PTO双模式',
    'GCS/GCD/GCH/GCC系列支持PTO驱动',
    '可配置消防泵/货油泵/发电机驱动',
    '国内大功率市场占有率80%',
    '硬齿面齿轮专业制造'
  ],

  // GCST系列 - 唯一支持完整PTI/PTO的系列 (核心混动产品)
  gcstSeries: {
    name: 'GCST系列一级减速齿轮箱',
    config: '垂直异心',
    stages: 1,
    ratioRange: { min: 4, max: 6 },
    transmissionCapacity: { min: 3.446, max: 6.99, unit: 'kW/(r/min)' },

    // 混动能力
    hybridCapability: {
      ptoSupport: true,
      ptiSupport: true,
      modes: ['PTO', 'PTI'],
      description: '重庆齿轮箱唯一支持PTI/PTO双模式的系列'
    },

    // 预估型号 (基于传递能力范围)
    estimatedModels: [
      {
        model: 'GCST-350',
        transmissionCapacity: 3.5,
        estimatedPower: { min: 500, max: 1050 },  // 基于150-300rpm输出
        ptiPowerEstimate: '50-100 kW',
        ptoPowerEstimate: '80-150 kW',
        application: '中型船舶混动推进',
        status: '预估型号，待厂家确认'
      },
      {
        model: 'GCST-500',
        transmissionCapacity: 5.0,
        estimatedPower: { min: 750, max: 1500 },
        ptiPowerEstimate: '75-150 kW',
        ptoPowerEstimate: '100-200 kW',
        application: '中大型船舶混动推进',
        status: '预估型号，待厂家确认'
      },
      {
        model: 'GCST-700',
        transmissionCapacity: 7.0,
        estimatedPower: { min: 1050, max: 2100 },
        ptiPowerEstimate: '100-200 kW',
        ptoPowerEstimate: '150-300 kW',
        application: '大型船舶混动推进',
        status: '预估型号，待厂家确认'
      }
    ]
  },

  // GC系列PTO专用 (仅支持PTO，不支持PTI)
  gcPtoSeries: [
    {
      code: 'GCS',
      name: 'GCS系列一级减速齿轮箱',
      config: '垂直异心',
      stages: 1,
      ratioRange: { min: 2, max: 4 },
      transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
      hybridModes: ['PTO'],
      application: '消防泵、货油泵、发电机驱动',
      note: '支持PTO功率分支输出'
    },
    {
      code: 'GCD',
      name: 'GCD系列一级减速齿轮箱',
      config: '水平异心',
      stages: 1,
      ratioRange: { min: 2, max: 4 },
      transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
      hybridModes: ['PTO'],
      application: '消防泵、货油泵、发电机驱动',
      note: '水平偏置配置，支持PTO'
    },
    {
      code: 'GCH',
      name: 'GCH系列一级减速齿轮箱',
      config: '水平异心',
      stages: 1,
      ratioRange: { min: 2, max: 4 },
      transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
      hybridModes: ['PTO'],
      application: '消防泵、货油泵、发电机驱动',
      note: '水平配置变种，支持PTO'
    },
    {
      code: 'GCC',
      name: 'GCC系列二级减速齿轮箱',
      config: '二级减速',
      stages: 2,
      ratioRange: { min: 2, max: 6 },
      transmissionCapacity: { min: 0.257, max: 19.101, unit: 'kW/(r/min)' },
      hybridModes: ['PTO'],
      application: '大速比需求，消防泵、发电机',
      note: '二级减速大速比，支持PTO'
    }
  ],

  // 节能效果估算
  fuelSavingsRange: {
    ptoMode: { min: 5, max: 12 },  // % - 轴带发电取代辅机
    ptiMode: { min: 8, max: 15 },  // % - GCST系列混动助推
    note: 'GCST系列支持PTI混动，可实现8-15%节能'
  },

  // 数据状态
  dataStatus: 'estimated',
  dataVersion: '2026.01.04',
  note: 'GCST系列混动参数基于官网传递能力推算，具体型号待厂家确认'
};

// 重庆齿轮箱数据 - 来源: 官网 (http://www.chongchi.com) + 德国LOHMANN技术
// 2026-01-04更新: 新增GC系列详细参数，GCST系列支持PTI/PTO
export const CHONGCHI_GEARBOX = {
  brandId: BRAND_IDS.CHONGCHI,  // 品牌标识符
  manufacturer: '重庆齿轮箱有限责任公司',
  manufacturerEN: 'Chongqing Gearbox Co., Ltd.',
  parent: '中国船舶集团有限公司(CSSC)',
  country: 'China',
  website: 'http://www.chongchi.com',
  technology: '引进德国LOHMANN公司成熟技术',

  // 总体技术参数
  overallSpecs: {
    transmissionCapacity: { min: 0.257, max: 35.429, unit: 'kW/(r/min)' },  // GCC系列最小0.257
    ratioRange: { min: 1.94, max: 7.48 },
    marketShare: '国内大功率齿轮箱市场占有率80%以上',
    applications: ['普通散货船', '集装箱船', '油轮', '化学品船', '内河船舶', '海洋渔船', '公务船', '工作船']
  },

  // GW系列齿轮箱 (传统船用)
  gwSeries: [
    {
      code: 'GWC',
      name: 'GWC系列船用齿轮箱',
      powerRange: { min: 150, max: 2000, unit: 'kW' },
      transmissionCapacity: { min: 0.29, max: 2.0, unit: 'kW/(r/min)' },
      application: '内河船舶、小型沿海船',
      hybridSupport: false
    },
    {
      code: 'GWL',
      name: 'GWL系列船用齿轮箱',
      powerRange: { min: 300, max: 4000, unit: 'kW' },
      transmissionCapacity: { min: 1.0, max: 8.0, unit: 'kW/(r/min)' },
      application: '沿海船舶、中型货船',
      hybridSupport: false
    },
    {
      code: 'GWS',
      name: 'GWS系列船用齿轮箱',
      powerRange: { min: 500, max: 6000, unit: 'kW' },
      transmissionCapacity: { min: 2.0, max: 15.0, unit: 'kW/(r/min)' },
      application: '大型船舶、远洋货船',
      hybridSupport: false
    },
    {
      code: 'GWH',
      name: 'GWH系列高速船用齿轮箱',
      powerRange: { min: 200, max: 3500, unit: 'kW' },
      transmissionCapacity: { min: 0.5, max: 5.0, unit: 'kW/(r/min)' },
      application: '高速船艇、工作船',
      hybridSupport: false
    },
    {
      code: 'GWD',
      name: 'GWD系列船用齿轮箱',
      powerRange: { min: 800, max: 8000, unit: 'kW' },
      transmissionCapacity: { min: 3.0, max: 20.0, unit: 'kW/(r/min)' },
      application: '大型远洋船舶',
      hybridSupport: false
    },
    {
      code: 'GWK',
      name: 'GWK系列船用齿轮箱',
      powerRange: { min: 1500, max: 10000, unit: 'kW' },
      transmissionCapacity: { min: 5.0, max: 35.429, unit: 'kW/(r/min)' },
      application: '超大型船舶、特种船',
      hybridSupport: false
    }
  ],

  // GC系列齿轮箱 - 2026-01-04 官网数据新增 (部分支持PTO/PTI)
  gcSeries: [
    {
      code: 'GCS',
      name: 'GCS系列一级减速齿轮箱',
      config: '垂直异心',
      stages: 1,
      ratioRange: { min: 2, max: 4 },
      transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
      application: '消防泵、货油泵、发电机驱动',
      hybridSupport: true,
      hybridModes: ['PTO'],
      note: '支持PTO驱动功率分支输出'
    },
    {
      code: 'GCD',
      name: 'GCD系列一级减速齿轮箱',
      config: '水平异心',
      stages: 1,
      ratioRange: { min: 2, max: 4 },
      transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
      application: '消防泵、货油泵、发电机驱动',
      hybridSupport: true,
      hybridModes: ['PTO'],
      note: '水平偏置配置，支持PTO'
    },
    {
      code: 'GCH',
      name: 'GCH系列一级减速齿轮箱',
      config: '水平异心',
      stages: 1,
      ratioRange: { min: 2, max: 4 },
      transmissionCapacity: { min: 0.537, max: 12.063, unit: 'kW/(r/min)' },
      application: '消防泵、货油泵、发电机驱动',
      hybridSupport: true,
      hybridModes: ['PTO'],
      note: '水平配置变种，支持PTO'
    },
    {
      code: 'GCST',
      name: 'GCST系列一级减速齿轮箱',
      config: '垂直异心',
      stages: 1,
      ratioRange: { min: 4, max: 6 },
      transmissionCapacity: { min: 3.446, max: 6.99, unit: 'kW/(r/min)' },
      application: '混合动力推进系统',
      hybridSupport: true,
      hybridModes: ['PTO', 'PTI'],  // 关键: 支持PTI!
      note: '重庆齿轮箱唯一支持PTI/PTO的系列'
    },
    {
      code: 'GCC',
      name: 'GCC系列二级减速齿轮箱',
      config: '二级减速',
      stages: 2,
      ratioRange: { min: 2, max: 6 },
      transmissionCapacity: { min: 0.257, max: 19.101, unit: 'kW/(r/min)' },
      application: '大速比需求，消防泵、发电机',
      hybridSupport: true,
      hybridModes: ['PTO'],
      note: '二级减速大速比，支持PTO'
    }
  ],

  // 常用型号 (用于快速匹配)
  commonModels: [
    'GW6675', 'GW7085', 'GW7590', 'GW8095', 'GW85100'
  ],

  // 混合动力支持状态 - 2026-01-04更新
  hybridStatus: {
    available: true,  // GCST系列支持
    modes: ['PTO', 'PTI'],
    hybridSeries: ['GCST'],  // 完整混动支持
    ptoOnlySeries: ['GCS', 'GCD', 'GCH', 'GCC'],  // 仅PTO
    note: 'GCST系列支持PTI/PTO混动，GCS/GCD/GCH/GCC系列支持PTO驱动消防泵/发电机',
    confirmed: true
  },

  // 技术特点
  features: [
    '引进德国LOHMANN公司成熟技术',
    '国内大功率齿轮箱市场占有率80%以上',
    '传递能力范围: 0.257-35.429 kW/(r/min)',
    '速比范围: 1.94-7.48',
    '主力型号涵盖150kW-10000kW功率段',
    'GCST系列支持PTI/PTO混合动力',
    'GC系列可配置功率分支输出'
  ],

  // 数据状态
  dataStatus: 'imported',  // 从官网和行业资料爬取
  dataVersion: '2026.01.04',
  note: '数据来源官网及行业数据，2026-01-04更新GC系列混动参数'
};

// 向后兼容: 保留旧的series属性
CHONGCHI_GEARBOX.series = CHONGCHI_GEARBOX.gwSeries;

// 南高齿混合动力系列 - CK系列/NEPod/NRP专用混动配置
// 2026-01-04新增: 基于NGC Marine官网数据整理的详细混动参数
export const NGC_HYBRID_SERIES = {
  brandId: BRAND_IDS.NGC,
  manufacturer: '南京高精船用设备有限公司',
  manufacturerEN: 'Nanjing High Accurate Marine Equipment Co., Ltd.',
  parent: '中国传动集团 (China High Speed Transmission Equipment Group)',
  parentEN: 'China High Speed Transmission Equipment Group',
  stockCode: '00658.HK',
  country: 'China',
  website: 'http://www.ngc-marine.com',
  releaseDate: '2020+',
  systemName: '南高齿船用混合动力推进系统',
  systemNameEN: 'NGC Marine Hybrid Propulsion System',

  // 支持的工作模式
  supportedModes: ['PTO', 'PTI', 'Full Electric'],

  // 系统组成
  components: [
    'CK系列可调桨齿轮箱 (PTI/PTO)',
    'NEPod电动吊舱推进系统',
    'NRP舵桨推进系统',
    '高精度齿轮传动组件',
    '液压多片摩擦离合器',
    '功率管理系统'
  ],

  // 技术特点
  features: [
    '最大传递功率55MW (55,000kW)',
    '最高齿轮线速度176m/s',
    '最高转速67,000rpm',
    '最大扭矩750kN·m',
    '最高精度ISO-3级',
    'CK系列最大传递能力50kW/rpm',
    'CK系列最大推力1850kN',
    '50年传动装备研制经验',
    '挖泥船动力传动系统专家'
  ],

  // CK系列 - 核心混动产品 (可调桨齿轮箱)
  ckSeries: {
    name: 'CK系列可调桨齿轮箱',
    nameEN: 'CK Series CPP Gearbox',
    subSeries: ['CKV', 'CKH', 'CKTS'],
    powerRange: { min: 1000, max: 17000, unit: 'kW' },
    transmissionCapacity: { max: 50, unit: 'kW/rpm' },
    thrustCapacity: { max: 1850, unit: 'kN' },

    // 混动能力 - 核心
    hybridCapability: {
      ptoSupport: true,
      ptiSupport: true,
      modes: ['PTO', 'PTI'],
      description: '南高齿核心混动产品，支持可调桨系统的完整PTI/PTO功能'
    },

    // 技术规格
    specs: {
      gearMaterial: '优质低碳合金钢',
      heatTreatment: '渗碳淬火',
      clutchType: '液压多片摩擦离合器',
      application: 'CPP系统，不可逆中速柴油机'
    },

    // 子系列配置
    subSeriesConfig: [
      {
        code: 'CKV',
        name: 'CKV垂直偏置型',
        config: '垂直偏置',
        description: '输入输出轴垂直方向偏置',
        application: '紧凑机舱布局'
      },
      {
        code: 'CKH',
        name: 'CKH水平偏置型',
        config: '水平偏置',
        description: '输入输出轴水平方向偏置',
        application: '宽敞机舱布局'
      },
      {
        code: 'CKTS',
        name: 'CKTS双输入型',
        config: '双机输入',
        description: '双主机输入单输出',
        application: '双机并车推进系统'
      }
    ],

    // 预估混动型号
    estimatedModels: [
      {
        model: 'CK-1000',
        transmissionCapacity: 10,
        estimatedPower: { min: 1000, max: 3000 },
        ptiPowerEstimate: '100-300 kW',
        ptoPowerEstimate: '150-400 kW',
        thrustCapacity: 300,
        application: '中型CPP船舶混动推进',
        status: '预估型号，待厂家确认'
      },
      {
        model: 'CK-2500',
        transmissionCapacity: 25,
        estimatedPower: { min: 3000, max: 7500 },
        ptiPowerEstimate: '300-750 kW',
        ptoPowerEstimate: '400-1000 kW',
        thrustCapacity: 800,
        application: '大型CPP船舶混动推进',
        status: '预估型号，待厂家确认'
      },
      {
        model: 'CK-5000',
        transmissionCapacity: 50,
        estimatedPower: { min: 7500, max: 17000 },
        ptiPowerEstimate: '750-1700 kW',
        ptoPowerEstimate: '1000-2500 kW',
        thrustCapacity: 1850,
        application: '超大型CPP船舶混动推进',
        status: '预估型号，待厂家确认'
      }
    ]
  },

  // NEPod电动吊舱推进系统 - 全电推进
  nepodSeries: {
    name: 'NEPod电动吊舱推进系统',
    nameEN: 'NEPod Electric Pod Propulsion System',
    type: 'Full Electric',
    powerRange: { min: 500, max: 5000, unit: 'kW' },

    // 电动推进能力
    hybridCapability: {
      ptoSupport: false,
      ptiSupport: false,
      fullElectric: true,
      modes: ['Full Electric'],
      description: '全电动吊舱推进，360度回转，卓越操纵性'
    },

    features: [
      '360度全回转',
      '无轴系设计',
      '卓越操纵性',
      '适合DP动态定位',
      '低噪音低振动',
      '模块化设计'
    ],

    applications: [
      '海工船舶',
      '科考船',
      '邮轮',
      '渡轮',
      '特种船舶'
    ]
  },

  // NRP舵桨推进系统 - 支持混动
  nrpSeries: {
    name: 'NRP舵桨推进系统',
    nameEN: 'NRP Rudder Propeller System',
    type: 'Hybrid',

    // 混动能力
    hybridCapability: {
      ptoSupport: true,
      ptiSupport: true,
      modes: ['PTO', 'PTI'],
      description: '舵桨一体化推进，支持混动配置，动态定位专用'
    },

    features: [
      '舵桨一体化',
      '动态定位(DP)能力',
      'PTI/PTO接口',
      '高机动性',
      '冗余设计'
    ],

    applications: [
      '动态定位船舶',
      '海工支持船',
      '海洋工程船',
      '港口拖轮',
      '特种作业船'
    ]
  },

  // 节能效果估算
  fuelSavingsRange: {
    ptoMode: { min: 5, max: 15 },       // % - CK系列轴带发电
    ptiMode: { min: 10, max: 20 },      // % - CK系列混动助推
    fullElectric: { min: 15, max: 30 }, // % - NEPod全电推进
    dpMode: { min: 20, max: 40 },       // % - 动态定位工况
    note: 'CK系列PTI/PTO可实现10-20%节能，NEPod在特定工况可达30%'
  },

  // 认证资质 (10家船级社)
  certifications: ['CCS', 'DNV', 'LR', 'BV', 'ABS', 'NK', 'KR', 'RMRS', 'RINA', 'IRS'],

  // 技术成就
  achievements: {
    maxTransmissionPower: 55000,  // kW (55 MW)
    maxGearLineSpeed: 176,        // m/s
    maxRotationSpeed: 67000,      // rpm
    maxTorque: 750,               // kN·m
    maxPrecision: 'ISO-3',
    experience: '50年传动装备研制经验'
  },

  // 数据状态
  dataStatus: 'imported',
  dataVersion: '2026.01.04',
  note: '数据来源NGC Marine官网，CK系列PTI/PTO参数基于官网传递能力推算'
};

// 南高齿船用数据 - 来源: NGC Marine官网 (http://www.ngc-marine.com)
// 2026-01-04更新: 补充CG系列子型号详细参数
export const NGC_GEARBOX = {
  brandId: BRAND_IDS.NGC,  // 品牌标识符
  manufacturer: '南京高精船用设备有限公司',
  manufacturerEN: 'Nanjing High Accurate Marine Equipment Co., Ltd.',
  parent: '中国传动集团 (China Transmission)',
  parentEN: 'China High Speed Transmission Equipment Group',
  stockCode: '00658.HK',  // 港股代码
  country: 'China',
  website: 'http://www.ngc-marine.com',

  // 总体技术成就 (官网数据)
  achievements: {
    maxTransmissionPower: 55000,  // kW (55 MW)
    maxGearLineSpeed: 176,        // m/s
    maxRotationSpeed: 67000,      // rpm
    maxTorque: 750,               // kN·m
    maxPrecision: 'ISO-3'         // 等级
  },

  // 主要产品系列 - 来源: NGC Marine官网
  series: [
    {
      code: 'CK',
      name: 'CK系列可调桨齿轮箱',
      subSeries: ['CKV', 'CKH', 'CKTS'],
      powerRange: { min: 1000, max: 17000, unit: 'kW' },
      transmissionCapacity: { max: 50, unit: 'kW/rpm' },
      thrustCapacity: { max: 1850, unit: 'kN' },
      application: 'CPP系统，不可逆中速柴油机',
      hybridSupport: true,
      hybridModes: ['PTO', 'PTI'],
      gearMaterial: '优质低碳合金钢/渗碳淬火',
      clutchType: '液压多片摩擦离合器'
    },
    {
      code: 'CG',
      name: 'CG系列固定桨齿轮箱',
      subSeries: ['CGC', 'CGS', 'CGD', 'CGH', 'CGL', 'CGK'],
      powerRange: { min: 500, max: 15000, unit: 'kW' },
      application: 'FPP系统，可逆中速柴油机',
      hybridSupport: false,
      hybridModes: [],
      configurations: '同轴/水平/垂直/角向异心'
    },
    {
      code: 'NEPod',
      name: 'NEPod电动吊舱推进系统',
      powerRange: { min: 500, max: 5000, unit: 'kW' },
      application: '电动推进船舶',
      hybridSupport: true,
      hybridModes: ['Full Electric'],
      note: '全电动推进，非传统混动'
    },
    {
      code: 'NRP',
      name: 'NRP舵桨推进系统',
      application: '动态定位，海工船舶',
      hybridSupport: true,
      hybridModes: ['PTO', 'PTI']
    },
    {
      code: 'FPV/FPH',
      name: '消防泵齿轮箱',
      application: '消防泵驱动',
      hybridSupport: false,
      hybridModes: []
    },
    {
      code: 'NHF/NHC',
      name: '液压联轴器',
      application: '轴系连接',
      hybridSupport: false,
      hybridModes: []
    }
  ],

  // CG系列子型号详细配置 - 2026-01-04 官网数据
  cgSubModels: {
    CGC: {
      config: '同轴',
      stages: 1,
      description: '输入输出同中心线，结构紧凑',
      application: '空间受限的船舶机舱'
    },
    CGS: {
      config: '垂直异心',
      stages: 1,
      description: '输入轴与输出轴垂直偏置，运转方向相反',
      application: '需要反向输出的推进系统'
    },
    CGD: {
      config: '水平异心',
      stages: 1,
      description: '倒顺离合减速一体，水平偏置',
      application: '可逆柴油机推进系统'
    },
    CGH: {
      config: '水平偏置',
      stages: 1,
      description: '水平方向偏置输出',
      application: '多主机并车配置'
    },
    CGL: {
      config: '角向偏置',
      stages: 1,
      description: '输出轴倾斜角度偏置',
      application: '特殊轴系布局'
    },
    CGK: {
      config: '多配置',
      stages: 2,
      description: '大功率二级减速，多种布局',
      application: '大型船舶，高速比需求'
    }
  },

  // 混合动力支持状态 - 来源: CK系列明确支持PTO/PTI
  hybridStatus: {
    available: true,
    note: 'CK系列支持PTO/PTI功能，NEPod为全电推进，NRP舵桨支持混动',
    modes: ['PTO', 'PTI', 'Full Electric'],
    hybridSeries: ['CK', 'NEPod', 'NRP'],
    confirmed: true
  },

  // 技术特点
  features: [
    '最大传递功率55MW (55,000kW)',
    '最高齿轮线速度176m/s',
    '最高转速67,000rpm',
    '最大扭矩750kN·m',
    '最高精度ISO-3级',
    'CK系列最大传递能力50kW/rpm',
    'CK系列最大推力1850kN',
    'NEPod电动吊舱推进系统',
    '50年传动装备研制经验',
    '挖泥船动力传动系统专家'
  ],

  // 认证资质
  certifications: ['CCS', 'DNV', 'LR', 'BV', 'ABS', 'NK', 'KR', 'RMRS', 'RINA', 'IRS'],

  // 数据状态
  dataStatus: 'imported',  // 从官网爬取验证
  dataVersion: '2026.01.04',
  note: '数据来源NGC Marine官网，2026-01-04更新CG系列子型号详细参数'
};

// 多品牌混动数据索引 (便于统一查询)
// 2026-01-04更新: CHONGCHI和NGC都使用专用HYBRID_SERIES结构
export const BRAND_HYBRID_DATA = {
  [BRAND_IDS.ADVANCE]: ADVANCE_HYBRID_SERIES,
  [BRAND_IDS.CHONGCHI]: CHONGCHI_HYBRID_SERIES,  // 使用专用混动数据结构
  [BRAND_IDS.NGC]: NGC_HYBRID_SERIES,            // 使用专用混动数据结构
  [BRAND_IDS.ZF_MARINE]: ZF_MARINE_HYBRID
};

/**
 * 根据品牌获取混动数据
 * @param {string} brandId - 品牌标识符
 * @returns {Object|null} - 品牌混动数据
 */
export function getHybridDataByBrand(brandId) {
  return BRAND_HYBRID_DATA[brandId] || null;
}

/**
 * 获取所有支持混动的品牌
 * @returns {string[]} - 品牌ID数组
 */
export function getHybridEnabledBrands() {
  return Object.entries(BRAND_HYBRID_DATA)
    .filter(([_, data]) => {
      if (data.hybridStatus) return data.hybridStatus.available;
      if (data.hybridSupport) return data.hybridSupport.available !== false;
      return data.supportedModes && data.supportedModes.length > 0;
    })
    .map(([brandId]) => brandId);
}

/**
 * 多品牌混动功率对比
 * @returns {Array} - 品牌功率范围对比数组 (仅混动支持品牌)
 * 2026-01-04更新: CHONGCHI GCST系列支持PTI/PTO
 */
export function getBrandHybridPowerComparison() {
  return [
    {
      brandId: BRAND_IDS.ADVANCE,
      name: '杭州前进',
      minPower: 360,
      maxPower: 1800,
      modes: ['PTO', 'PTI', 'PTH'],
      status: 'estimated',
      note: '基于HC/HCD系列推断，待厂家确认'
    },
    {
      brandId: BRAND_IDS.NGC,
      name: '南高齿',
      minPower: 1000,
      maxPower: 17000,
      modes: ['PTO', 'PTI', 'Full Electric'],
      status: 'confirmed',
      note: 'CK系列可调桨齿轮箱支持PTO/PTI，NEPod全电推进'
    },
    {
      brandId: BRAND_IDS.ZF_MARINE,
      name: 'ZF Marine',
      minPower: 10,       // 更新: 小型机械系列起步
      maxPower: 12000,    // 更新: 大型商用系列
      modes: ['PTO', 'PTI', 'PTH'],
      status: 'confirmed',
      note: 'ZF 3200/3300/5200/8300 PTI系列，覆盖10-12000kW'
    },
    {
      brandId: BRAND_IDS.CHONGCHI,
      name: '重庆齿轮箱',
      minPower: 150,
      maxPower: 10000,
      modes: ['PTO', 'PTI'],  // 2026-01-04更新: GCST系列支持PTI/PTO
      status: 'confirmed',    // 状态更新为confirmed
      hybridSeries: ['GCST'],
      ptoOnlySeries: ['GCS', 'GCD', 'GCH', 'GCC'],
      note: 'GCST系列支持PTI/PTO混动，GCS/GCD/GCH/GCC系列支持PTO驱动'
    }
  ].sort((a, b) => b.maxPower - a.maxPower);
}

// 混合动力选型计算器参数
export const HYBRID_SELECTION_PARAMS = {
  // PTI功率估算规则 (占主机功率百分比)
  ptiPowerRatio: {
    typical: 0.15,    // 典型15%
    min: 0.10,        // 最小10%
    max: 0.20         // 最大20%
  },

  // PTO功率估算规则
  ptoPowerRatio: {
    typical: 0.12,    // 典型12%
    min: 0.08,        // 最小8%
    max: 0.18         // 最大18%
  },

  // 燃油节省估算
  fuelSavingsEstimate: {
    ptoMode: { min: 5, max: 15 },   // %
    ptiMode: { min: 10, max: 20 },  // %
    pthMode: { min: 80, max: 100 }  // % (港区零排放)
  },

  // 能效系数
  efficiencyFactors: {
    gearboxEfficiency: 0.97,      // 齿轮箱效率
    motorGeneratorEfficiency: 0.95,  // 电机/发电机效率
    frequencyConverterEfficiency: 0.98  // 变频器效率
  }
};

// 船型与混合动力适用性映射
export const VESSEL_HYBRID_SUITABILITY = {
  // 非常适合混合动力的船型
  highSuitability: [
    { type: 'ferry', nameCN: '渡轮', reason: '频繁进出港,低速航行多' },
    { type: 'offshore_supply', nameCN: '海工供应船', reason: '动态定位需求,变工况多' },
    { type: 'tug', nameCN: '拖轮', reason: '工况变化大,港区作业多' },
    { type: 'cruise', nameCN: '邮轮', reason: '港口零排放要求' },
    { type: 'research', nameCN: '科考船', reason: '静音需求,多工况' }
  ],

  // 中等适合
  mediumSuitability: [
    { type: 'fishing', nameCN: '渔船', reason: '变工况,拖网需求' },
    { type: 'cargo', nameCN: '货船', reason: '长航线燃油优化' },
    { type: 'tanker', nameCN: '油轮', reason: '轴发减少辅机' }
  ],

  // 一般适合
  lowSuitability: [
    { type: 'container', nameCN: '集装箱船', reason: '定速航行为主' },
    { type: 'bulk', nameCN: '散货船', reason: '工况相对稳定' }
  ]
};

// 碳排放计算参数
export const EMISSION_FACTORS = {
  // 燃油碳排放因子 (kg CO2 / kg fuel)
  fuelTypes: {
    MGO: { factor: 3.206, name: '船用柴油', nameEN: 'Marine Gas Oil' },
    MDO: { factor: 3.206, name: '船用轻柴油', nameEN: 'Marine Diesel Oil' },
    HFO: { factor: 3.114, name: '重燃油', nameEN: 'Heavy Fuel Oil' },
    LNG: { factor: 2.750, name: '液化天然气', nameEN: 'LNG' },
    methanol: { factor: 1.375, name: '甲醇', nameEN: 'Methanol' }
  },

  // 电力碳排放因子 (kg CO2 / kWh) - 用于岸电
  electricity: {
    china_grid: 0.581,   // 中国电网平均
    eu_grid: 0.295,      // 欧盟电网平均
    renewable: 0         // 可再生能源
  }
};

// 导出所有数据
export default {
  // 品牌标识符
  BRAND_IDS,
  DEFAULT_BRAND,

  // 混动模式定义
  HYBRID_MODES,

  // 各品牌数据
  ADVANCE_HYBRID_SERIES,
  CHONGCHI_HYBRID_SERIES,  // 2026-01-04新增: 重庆齿轮箱GC系列混动数据
  CHONGCHI_GEARBOX,        // 保留完整齿轮箱数据
  NGC_HYBRID_SERIES,       // 2026-01-04新增: 南高齿CK/NEPod/NRP系列混动数据
  NGC_GEARBOX,             // 保留完整齿轮箱数据
  ZF_MARINE_HYBRID,
  KONGSBERG_GEARBOX,
  RENK_HYBRID,

  // 多品牌索引
  BRAND_HYBRID_DATA,

  // 计算参数
  HYBRID_SELECTION_PARAMS,
  VESSEL_HYBRID_SUITABILITY,
  EMISSION_FACTORS,

  // 工具函数
  getHybridDataByBrand,
  getHybridEnabledBrands,
  getBrandHybridPowerComparison
};
