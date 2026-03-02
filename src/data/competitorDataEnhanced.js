/**
 * competitorDataEnhanced.js
 * 竞品数据增强层 — 不修改原始 competitorData.js，import后overlay增强
 * 
 * 架构决策：遵守CLAUDE.md "不修改src/data/数据结构"规则
 * 新文件import原始数据后overlay增强字段
 */

import { competitors, competitorProducts } from './competitorData';

// ============================================================
// 数据版本控制
// ============================================================
export const DATA_VERSION = {
  version: '2.0.0',
  lastFullUpdate: '2025-06',
  schema: 'enhanced-v2',
  notes: '增强版：新增技术维度、新鲜度追踪、市场分段、TCO参数'
};

// ============================================================
// 产品新鲜度追踪 (Product Freshness Tracking)
// ============================================================
// priceConfidence: 'confirmed' | 'estimated' | 'outdated'
// lastVerified: 'YYYY-MM' 格式
export const productFreshnessData = {
  // --- 杭齿产品 ---
  'HC65': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HC135': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HC138': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HC200': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HC300': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HC400': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HC600': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HC1000': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HC1200': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HC1400': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HCQ138': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HCQ300': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HCQ400': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HCQ502': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HCQ700': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HCA138': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HCA300': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'HCA400': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'GWC': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'GWD': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },
  'GWE': { lastVerified: '2025-06', priceConfidence: 'confirmed', source: '内部价格表' },

  // --- 重齿 (CZCG) ---
  'MG-5540': { lastVerified: '2025-03', priceConfidence: 'estimated', source: '代理商报价' },
  'MG-5555': { lastVerified: '2025-03', priceConfidence: 'estimated', source: '代理商报价' },
  'MG-5570': { lastVerified: '2025-03', priceConfidence: 'estimated', source: '代理商报价' },
  'MG-5600': { lastVerified: '2025-03', priceConfidence: 'estimated', source: '代理商报价' },
  'MG-5610': { lastVerified: '2024-12', priceConfidence: 'estimated', source: '市场调研' },
  'MG-5620': { lastVerified: '2024-12', priceConfidence: 'estimated', source: '市场调研' },
  'MG-5655': { lastVerified: '2024-12', priceConfidence: 'estimated', source: '市场调研' },
  'MG-5680': { lastVerified: '2024-08', priceConfidence: 'outdated', source: '历史报价' },
  'MG-5690': { lastVerified: '2024-08', priceConfidence: 'outdated', source: '历史报价' },
  'GS301': { lastVerified: '2025-01', priceConfidence: 'estimated', source: '代理商报价' },
  'GS350': { lastVerified: '2025-01', priceConfidence: 'estimated', source: '代理商报价' },
  'GS360': { lastVerified: '2025-01', priceConfidence: 'estimated', source: '代理商报价' },

  // --- 南高齿 (NGC) ---
  'NGC-GS228': { lastVerified: '2025-02', priceConfidence: 'estimated', source: '市场调研' },
  'NGC-GS236': { lastVerified: '2025-02', priceConfidence: 'estimated', source: '市场调研' },
  'NGC-GS240': { lastVerified: '2025-02', priceConfidence: 'estimated', source: '市场调研' },
  'NGC-GS250': { lastVerified: '2025-02', priceConfidence: 'estimated', source: '市场调研' },
  'NGC-GS255': { lastVerified: '2024-10', priceConfidence: 'estimated', source: '行业展会' },
  'NGC-GS260': { lastVerified: '2024-10', priceConfidence: 'estimated', source: '行业展会' },

  // --- ZF ---
  'ZF-W2100': { lastVerified: '2024-11', priceConfidence: 'estimated', source: '代理商报价' },
  'ZF-W2200': { lastVerified: '2024-11', priceConfidence: 'estimated', source: '代理商报价' },
  'ZF-W2500': { lastVerified: '2024-06', priceConfidence: 'outdated', source: '历史报价' },
  'ZF-W2600': { lastVerified: '2024-06', priceConfidence: 'outdated', source: '历史报价' },
  'ZF-W2700': { lastVerified: '2024-06', priceConfidence: 'outdated', source: '历史报价' },
  'ZF-W3300': { lastVerified: '2024-06', priceConfidence: 'outdated', source: '历史报价' },

  // --- Reintjes ---
  'WAF-362': { lastVerified: '2024-09', priceConfidence: 'estimated', source: '代理商报价' },
  'WAF-440': { lastVerified: '2024-09', priceConfidence: 'estimated', source: '代理商报价' },
  'WAF-540': { lastVerified: '2024-09', priceConfidence: 'estimated', source: '代理商报价' },
  'WAF-660': { lastVerified: '2024-09', priceConfidence: 'estimated', source: '代理商报价' },

  // --- TwinDisc ---
  'MG-5091': { lastVerified: '2024-07', priceConfidence: 'outdated', source: '历史报价' },
  'MG-5111': { lastVerified: '2024-07', priceConfidence: 'outdated', source: '历史报价' },
  'MG-5114': { lastVerified: '2024-07', priceConfidence: 'outdated', source: '历史报价' },

  // --- DCSG (大齿) ---
  'GCD600': { lastVerified: '2025-01', priceConfidence: 'estimated', source: '经销商询价' },
  'GCD700': { lastVerified: '2025-01', priceConfidence: 'estimated', source: '经销商询价' },
  'GCD800': { lastVerified: '2024-10', priceConfidence: 'estimated', source: '行业展会' },

  // --- FADA ---
  'FD-135': { lastVerified: '2025-04', priceConfidence: 'estimated', source: '竞标比价' },
  'FD-170': { lastVerified: '2025-04', priceConfidence: 'estimated', source: '竞标比价' },
  'FD-300': { lastVerified: '2025-04', priceConfidence: 'estimated', source: '竞标比价' },
  'FD-400': { lastVerified: '2025-02', priceConfidence: 'estimated', source: '竞标比价' },

  // --- 奋进 (Fenjin) ---
  'FJ-06': { lastVerified: '2024-12', priceConfidence: 'estimated', source: '区域调研' },
  'FJ-10': { lastVerified: '2024-12', priceConfidence: 'estimated', source: '区域调研' },
  'FJ-16': { lastVerified: '2024-12', priceConfidence: 'estimated', source: '区域调研' },
};

// ============================================================
// 技术维度模板 (Technology Dimensions by Manufacturer)
// ============================================================
// propellerType: 'FPP' | 'CPP' | 'both'
// noiseLevel: 'low' | 'medium' | 'high' 
// digitalMonitoring: true | false | 'partial'
// hybridReady: true | false | 'partial'
// efficiencyClass: 'premium' | 'high' | 'standard'
// environmentalCompliance: string[] 认证列表
export const techDimensionsTemplate = {
  HANGCHI: {
    propellerType: 'both',
    noiseLevel: 'low',
    digitalMonitoring: true,
    hybridReady: 'partial',
    efficiencyClass: 'high',
    environmentalCompliance: ['CCS', 'IMO Tier II', 'GB标准'],
    maxRPM: 2500,
    transmissionType: ['单速', '双速', '带PTO'],
    clutchType: '液压多片'
  },
  CZCG: {
    propellerType: 'both',
    noiseLevel: 'medium',
    digitalMonitoring: 'partial',
    hybridReady: 'partial',
    efficiencyClass: 'high',
    environmentalCompliance: ['CCS', 'IMO Tier II'],
    maxRPM: 2300,
    transmissionType: ['单速', '双速'],
    clutchType: '液压多片'
  },
  NGC: {
    propellerType: 'both',
    noiseLevel: 'medium',
    digitalMonitoring: true,
    hybridReady: 'partial',
    efficiencyClass: 'high',
    environmentalCompliance: ['CCS', 'IMO Tier II', 'DNV'],
    maxRPM: 2200,
    transmissionType: ['单速', '双速', '带PTO'],
    clutchType: '液压多片'
  },
  ZF: {
    propellerType: 'both',
    noiseLevel: 'low',
    digitalMonitoring: true,
    hybridReady: true,
    efficiencyClass: 'premium',
    environmentalCompliance: ['CCS', 'IMO Tier II', 'DNV', 'LR', 'ABS', 'EU Stage V'],
    maxRPM: 2600,
    transmissionType: ['单速', '双速', '无级变速'],
    clutchType: '液压多片/电磁'
  },
  Reintjes: {
    propellerType: 'both',
    noiseLevel: 'low',
    digitalMonitoring: true,
    hybridReady: true,
    efficiencyClass: 'premium',
    environmentalCompliance: ['CCS', 'IMO Tier II', 'DNV', 'LR', 'GL'],
    maxRPM: 2400,
    transmissionType: ['单速', '双速', '带PTO'],
    clutchType: '液压多片'
  },
  TwinDisc: {
    propellerType: 'FPP',
    noiseLevel: 'medium',
    digitalMonitoring: 'partial',
    hybridReady: false,
    efficiencyClass: 'high',
    environmentalCompliance: ['ABS', 'LR'],
    maxRPM: 2800,
    transmissionType: ['单速'],
    clutchType: '液压多片'
  },
  DCSG: {
    propellerType: 'both',
    noiseLevel: 'medium',
    digitalMonitoring: 'partial',
    hybridReady: false,
    efficiencyClass: 'standard',
    environmentalCompliance: ['CCS'],
    maxRPM: 2000,
    transmissionType: ['单速', '双速'],
    clutchType: '液压多片'
  },
  FADA: {
    propellerType: 'FPP',
    noiseLevel: 'high',
    digitalMonitoring: false,
    hybridReady: false,
    efficiencyClass: 'standard',
    environmentalCompliance: ['CCS'],
    maxRPM: 2200,
    transmissionType: ['单速'],
    clutchType: '液压单片/多片'
  },
  Fenjin: {
    propellerType: 'FPP',
    noiseLevel: 'high',
    digitalMonitoring: false,
    hybridReady: false,
    efficiencyClass: 'standard',
    environmentalCompliance: ['CCS'],
    maxRPM: 2000,
    transmissionType: ['单速'],
    clutchType: '液压单片'
  },
  MassonMarine: {
    propellerType: 'both',
    noiseLevel: 'low',
    digitalMonitoring: true,
    hybridReady: true,
    efficiencyClass: 'premium',
    environmentalCompliance: ['CCS', 'DNV', 'LR', 'BV'],
    maxRPM: 2400,
    transmissionType: ['单速', '双速', '带PTO'],
    clutchType: '液压多片'
  },
  DongI: {
    propellerType: 'both',
    noiseLevel: 'medium',
    digitalMonitoring: 'partial',
    hybridReady: false,
    efficiencyClass: 'high',
    environmentalCompliance: ['KR', 'CCS'],
    maxRPM: 2300,
    transmissionType: ['单速', '双速'],
    clutchType: '液压多片'
  },
  Kanzaki: {
    propellerType: 'FPP',
    noiseLevel: 'low',
    digitalMonitoring: 'partial',
    hybridReady: false,
    efficiencyClass: 'high',
    environmentalCompliance: ['NK', 'CCS'],
    maxRPM: 3000,
    transmissionType: ['单速'],
    clutchType: '液压多片'
  },
  PRM: {
    propellerType: 'FPP',
    noiseLevel: 'medium',
    digitalMonitoring: false,
    hybridReady: false,
    efficiencyClass: 'standard',
    environmentalCompliance: ['LR'],
    maxRPM: 2500,
    transmissionType: ['单速'],
    clutchType: '液压多片'
  }
};

// ============================================================
// 市场分段数据 (Market Segments)
// ============================================================
export const marketSegments = {
  fishing: {
    id: 'fishing',
    name: '渔船',
    icon: '🎣',
    powerRange: [30, 500],
    description: '近海/远洋渔船，注重可靠性和维护便利性',
    keyFactors: ['可靠性', '维修便利', '价格', '油耗'],
    shares: {
      HANGCHI: 45,
      FADA: 20,
      Fenjin: 15,
      CZCG: 8,
      DCSG: 5,
      others: 7
    },
    totalMarketSize: '约25亿元/年',
    growth: '+3%',
    notes: '杭齿在渔船市场占据绝对优势，HC系列在沿海渔船中认知度最高'
  },
  inlandCargo: {
    id: 'inlandCargo',
    name: '内河货船',
    icon: '🚢',
    powerRange: [50, 800],
    description: '长江/珠江/京杭运河货运船舶',
    keyFactors: ['价格', '可靠性', '配件供应', '油耗'],
    shares: {
      HANGCHI: 40,
      CZCG: 22,
      FADA: 15,
      NGC: 10,
      Fenjin: 8,
      others: 5
    },
    totalMarketSize: '约30亿元/年',
    growth: '+2%',
    notes: '内河船标准化程度高，价格竞争激烈，杭齿HC系列是主流选择'
  },
  coastalCargo: {
    id: 'coastalCargo',
    name: '沿海货船',
    icon: '⛴️',
    powerRange: [200, 2000],
    description: '沿海散货/集装箱/多用途货船',
    keyFactors: ['可靠性', '功率匹配', '船级社认证', '交付周期'],
    shares: {
      HANGCHI: 35,
      CZCG: 30,
      NGC: 18,
      ZF: 5,
      DCSG: 7,
      others: 5
    },
    totalMarketSize: '约45亿元/年',
    growth: '+4%',
    notes: '中型沿海船市场竞争激烈，杭齿与重齿正面竞争'
  },
  mediumCommercial: {
    id: 'mediumCommercial',
    name: '中型商船',
    icon: '🚧',
    powerRange: [500, 3000],
    description: '中型散货船/油轮/化学品船',
    keyFactors: ['船级社认证', '技术参数', '交付周期', '售后服务'],
    shares: {
      HANGCHI: 32,
      CZCG: 28,
      NGC: 20,
      ZF: 8,
      Reintjes: 5,
      others: 7
    },
    totalMarketSize: '约60亿元/年',
    growth: '+5%',
    notes: '中型商船是核心战场，杭齿GW/HC大功率系列vs重齿MG系列'
  },
  largeCommercial: {
    id: 'largeCommercial',
    name: '大型商船',
    icon: '🏗️',
    powerRange: [2000, 8000],
    description: '大型散货船/集装箱船/VLCC',
    keyFactors: ['可靠性记录', '全球服务网络', '技术先进性', '认证齐全'],
    shares: {
      CZCG: 30,
      NGC: 25,
      HANGCHI: 18,
      ZF: 12,
      Reintjes: 8,
      others: 7
    },
    totalMarketSize: '约80亿元/年',
    growth: '+6%',
    notes: '大型船市场重齿/南高齿占优，杭齿正在追赶，GW系列是突破口'
  },
  specialVessel: {
    id: 'specialVessel',
    name: '特种船舶',
    icon: '⚓',
    powerRange: [200, 5000],
    description: '拖轮/挖泥船/工程船/消防船/公务船',
    keyFactors: ['可靠性', '操控性', '抗冲击', '定制能力'],
    shares: {
      HANGCHI: 30,
      CZCG: 25,
      NGC: 15,
      ZF: 12,
      Reintjes: 8,
      others: 10
    },
    totalMarketSize: '约35亿元/年',
    growth: '+4%',
    notes: '特种船利润率高，对产品定制能力要求高'
  },
  yacht: {
    id: 'yacht',
    name: '游艇/快艇',
    icon: '🛥️',
    powerRange: [50, 1500],
    description: '商务游艇/公务快艇/豪华游艇',
    keyFactors: ['噪声', '振动', '品牌', '轻量化', '操控'],
    shares: {
      ZF: 35,
      TwinDisc: 20,
      HANGCHI: 12,
      Kanzaki: 10,
      Reintjes: 8,
      others: 15
    },
    totalMarketSize: '约15亿元/年',
    growth: '+8%',
    notes: '进口品牌在高端游艇市场占优，杭齿HCQ系列正在突破中端市场'
  },
  military: {
    id: 'military',
    name: '军用/公务船',
    icon: '🛡️',
    powerRange: [300, 5000],
    description: '军用舰艇/海事/渔政/海关',
    keyFactors: ['国产化要求', '可靠性', '抗冲击', '噪声'],
    shares: {
      HANGCHI: 40,
      CZCG: 30,
      NGC: 15,
      DCSG: 10,
      others: 5
    },
    totalMarketSize: '约50亿元/年（估算）',
    growth: '+7%',
    notes: '军品市场国产化率要求100%，杭齿传统优势领域'
  }
};

// ============================================================
// SWOT分析（按市场分段）
// ============================================================
export const swotBySegment = {
  fishing: {
    strengths: ['市场认知度最高', '服务网点覆盖全面', '配件随处可得', '性价比优势'],
    weaknesses: ['低端产品利润薄', '品牌溢价不足'],
    opportunities: ['智能化渔船升级', '远洋渔船市场拓展'],
    threats: ['FADA/奋进低价竞争', '渔船数量政策性减少']
  },
  inlandCargo: {
    strengths: ['产品线齐全', '交付快速', '价格有竞争力'],
    weaknesses: ['与重齿在大功率段差距缩小但仍存在', '部分型号交付周期长'],
    opportunities: ['内河船标准化', '绿色航运政策', 'LNG动力船'],
    threats: ['重齿价格战', '内河船市场增长放缓']
  },
  coastalCargo: {
    strengths: ['HC/GW系列覆盖完整功率段', '服务响应快'],
    weaknesses: ['超大功率段产品较少', '部分船东认为不如重齿'],
    opportunities: ['老旧船淘汰更新', '沿海航运增长'],
    threats: ['重齿/南高齿加大沿海市场投入']
  },
  mediumCommercial: {
    strengths: ['GW系列技术成熟', '认证齐全', '本土服务优势'],
    weaknesses: ['品牌认知不如重齿/南高齿', '大型项目经验积累不足'],
    opportunities: ['中型船市场持续增长', '替代进口需求'],
    threats: ['ZF等进口品牌降价', '重齿/NGC技术升级']
  },
  largeCommercial: {
    strengths: ['GW大功率系列性能优', '价格比进口有优势'],
    weaknesses: ['大型船业绩不如重齿/NGC', '全球服务网络薄弱'],
    opportunities: ['超大型船国产替代', '一带一路海外项目'],
    threats: ['重齿/NGC市场份额固化', '进口品牌渠道下沉']
  },
  specialVessel: {
    strengths: ['定制化能力强', '快速响应技术需求', 'HCQ系列操控性好'],
    weaknesses: ['部分特种需求经验不足'],
    opportunities: ['海上风电运维船', '深远海养殖工程船'],
    threats: ['进口品牌在高端特种船市场优势明显']
  },
  yacht: {
    strengths: ['HCQ系列噪振控制改善明显', '价格优势'],
    weaknesses: ['品牌形象不如ZF/Twin Disc', '轻量化技术差距'],
    opportunities: ['国内游艇市场增长', '中端游艇国产替代'],
    threats: ['ZF/TwinDisc品牌壁垒', '终端用户对进口品牌偏好']
  },
  military: {
    strengths: ['国产化100%', '军品资质齐全', '可靠性记录好'],
    weaknesses: ['军品研发周期长', '利润受限于定价机制'],
    opportunities: ['海军现代化', '海警/渔政装备升级'],
    threats: ['军工体系改革', 'CZCG/NGC争夺军品份额']
  }
};

// ============================================================
// 分段销售话术 (Segment-Specific Sales Pitches)
// ============================================================
export const segmentSalesPitches = {
  fishing: [
    {
      pitch: '渔船出海作业，最怕的就是齿轮箱半路出问题。杭齿HC系列在全国渔船上装机量最大，任何渔港基本都有配件和维修师傅。',
      keyPoints: ['装机量最大', '配件全国覆盖', '渔港维修便利']
    },
    {
      pitch: '算一笔经济账：进口齿轮箱一个配件等两个月，渔汛期少出一趟海损失多少？杭齿配件当天就能发货。',
      keyPoints: ['配件即时供应', '减少停机损失', '渔汛期保障']
    }
  ],
  inlandCargo: [
    {
      pitch: '长江航运讲究的是稳定运营。HC系列在内河船上跑了几十年，船东口碑就是最好的广告。而且我们在沿江每个主要港口都有服务站。',
      keyPoints: ['几十年内河经验', '船东口碑', '沿江服务网络']
    },
    {
      pitch: '内河船最在意油耗和可靠性。杭齿的传动效率能帮您每年省下不少油钱，算TCO(总持有成本)比竞品更划算。',
      keyPoints: ['传动效率高', '节省油耗', 'TCO优势']
    }
  ],
  coastalCargo: [
    {
      pitch: '沿海货船营运强度大，齿轮箱质量直接影响营运天数。杭齿HC/GW系列在沿海船市场占有率第一，24小时服务响应是我们的标配。',
      keyPoints: ['沿海市场第一', '营运天数保障', '24小时响应']
    },
    {
      pitch: '跟重齿比，我们在中小功率段性价比更高。跟进口品牌比，我们服务更快、配件更便宜。这就是杭齿在沿海船市场的独特优势。',
      keyPoints: ['性价比优势', '服务速度', '配件成本低']
    }
  ],
  mediumCommercial: [
    {
      pitch: '中型商船选齿轮箱，最重要的是技术可靠和认证齐全。杭齿GW系列通过了CCS/DNV/LR等主要船级社认证，技术参数完全满足要求。',
      keyPoints: ['多船级社认证', 'GW系列技术参数', '可靠性验证']
    },
    {
      pitch: '跟进口ZF/Reintjes比，杭齿价格优势在30-50%。且在国内有完整的服务网络，不需要等进口配件。五年TCO算下来，差距更明显。',
      keyPoints: ['价格优势30-50%', '国内服务网络', '五年TCO优势']
    }
  ],
  largeCommercial: [
    {
      pitch: '大型商船选型，船东最关注的是实船业绩。杭齿GW系列已在多艘万吨级船舶上成功运行，我们可以提供完整的业绩清单供参考。',
      keyPoints: ['实船业绩', '万吨级验证', '业绩清单']
    },
    {
      pitch: '目前大型船市场国产替代是趋势。杭齿作为上市公司（601177），技术投入持续增加，GW系列在国际上的竞争力越来越强。',
      keyPoints: ['国产替代趋势', '上市公司实力', '技术投入增长']
    }
  ],
  specialVessel: [
    {
      pitch: '特种船对齿轮箱要求高，需要定制化方案。杭齿有专门的特种船技术团队，从选型到调试全程技术支持，HCQ系列操控性特别适合拖轮和工程船。',
      keyPoints: ['专业技术团队', '全程技术支持', 'HCQ操控性']
    }
  ],
  yacht: [
    {
      pitch: '游艇对噪声和振动要求极高。杭齿HCQ系列在NVH方面做了大量优化，在中端游艇市场性价比远超进口品牌。',
      keyPoints: ['NVH优化', '中端游艇定位', '性价比优势']
    }
  ],
  military: [
    {
      pitch: '军用船舶要求国产化率100%，杭齿是军品齿轮箱主力供应商，军品资质齐全。从小型公务艇到大型军用舰艇，都有成熟方案。',
      keyPoints: ['100%国产化', '军品资质齐全', '全功率段方案']
    }
  ]
};

// ============================================================
// TCO参数 (Total Cost of Ownership Parameters)
// ============================================================
export const tcoParameters = {
  // 通用TCO因子
  annualOperatingHours: {
    fishing: 3000,
    inlandCargo: 4500,
    coastalCargo: 5000,
    mediumCommercial: 5500,
    largeCommercial: 6000,
    specialVessel: 3500,
    yacht: 800,
    military: 2000
  },
  fuelCostPerLiter: 7.5,  // 元/升 (0号柴油)
  laborCostPerHour: 150,   // 元/小时 (维修技师)
  
  // 厂商TCO乘数 (相对于杭齿=1.0)
  manufacturerTCOFactors: {
    HANGCHI: {
      acquisition: 1.0,
      maintenance: 1.0,
      spareParts: 1.0,
      fuelEfficiency: 1.0,
      downtime: 1.0,
      description: '基准线'
    },
    CZCG: {
      acquisition: 1.05,
      maintenance: 1.0,
      spareParts: 1.05,
      fuelEfficiency: 0.98,
      downtime: 1.1,
      description: '采购略贵，效率接近，配件渠道稍窄'
    },
    NGC: {
      acquisition: 1.08,
      maintenance: 1.0,
      spareParts: 1.05,
      fuelEfficiency: 0.98,
      downtime: 1.05,
      description: '采购贵，技术好，配件渠道一般'
    },
    ZF: {
      acquisition: 1.80,
      maintenance: 1.5,
      spareParts: 2.5,
      fuelEfficiency: 0.94,
      downtime: 1.8,
      description: '采购贵近一倍，配件进口贵且慢，但效率最高'
    },
    Reintjes: {
      acquisition: 1.70,
      maintenance: 1.4,
      spareParts: 2.3,
      fuelEfficiency: 0.95,
      downtime: 1.7,
      description: '类似ZF定位，欧洲品牌进口'
    },
    TwinDisc: {
      acquisition: 1.50,
      maintenance: 1.3,
      spareParts: 2.0,
      fuelEfficiency: 0.98,
      downtime: 1.5,
      description: '美系品牌，中高端定位'
    },
    DCSG: {
      acquisition: 0.90,
      maintenance: 1.1,
      spareParts: 1.1,
      fuelEfficiency: 1.02,
      downtime: 1.2,
      description: '采购便宜但效率略低'
    },
    FADA: {
      acquisition: 0.80,
      maintenance: 1.2,
      spareParts: 1.0,
      fuelEfficiency: 1.05,
      downtime: 1.3,
      description: '低价策略，效率和维护成本偏高'
    },
    Fenjin: {
      acquisition: 0.70,
      maintenance: 1.3,
      spareParts: 1.0,
      fuelEfficiency: 1.08,
      downtime: 1.5,
      description: '最低价，但效率和可靠性明显低于杭齿'
    },
    MassonMarine: {
      acquisition: 2.00,
      maintenance: 1.5,
      spareParts: 2.8,
      fuelEfficiency: 0.93,
      downtime: 2.0,
      description: '法国高端品牌，全面进口'
    },
    DongI: {
      acquisition: 1.15,
      maintenance: 1.1,
      spareParts: 1.3,
      fuelEfficiency: 0.99,
      downtime: 1.2,
      description: '韩国品牌，中高端定位'
    },
    Kanzaki: {
      acquisition: 1.30,
      maintenance: 1.2,
      spareParts: 1.5,
      fuelEfficiency: 0.97,
      downtime: 1.3,
      description: '日本品牌，小功率精密'
    },
    PRM: {
      acquisition: 1.20,
      maintenance: 1.2,
      spareParts: 1.8,
      fuelEfficiency: 1.0,
      downtime: 1.4,
      description: '英国品牌，中低功率'
    }
  }
};

// ============================================================
// 船型TCO默认值 (Ship Type TCO Defaults)
// ============================================================
export const shipTypeDefaults = {
  fishing: {
    name: '渔船',
    typicalPower: 200,      // kW
    lifespan: 15,           // 年
    annualHours: 3000,
    fuelConsumptionBase: 40, // L/h基准
    maintenanceInterval: 2000, // 小时/次
    maintenanceCostBase: 5000, // 元/次
    insuranceFactor: 1.0,
  },
  inlandCargo: {
    name: '内河货船',
    typicalPower: 400,
    lifespan: 20,
    annualHours: 4500,
    fuelConsumptionBase: 80,
    maintenanceInterval: 2500,
    maintenanceCostBase: 8000,
    insuranceFactor: 1.0,
  },
  coastalCargo: {
    name: '沿海货船',
    typicalPower: 800,
    lifespan: 20,
    annualHours: 5000,
    fuelConsumptionBase: 150,
    maintenanceInterval: 3000,
    maintenanceCostBase: 15000,
    insuranceFactor: 1.1,
  },
  mediumCommercial: {
    name: '中型商船',
    typicalPower: 1500,
    lifespan: 25,
    annualHours: 5500,
    fuelConsumptionBase: 280,
    maintenanceInterval: 3000,
    maintenanceCostBase: 25000,
    insuranceFactor: 1.2,
  },
  largeCommercial: {
    name: '大型商船',
    typicalPower: 4000,
    lifespan: 25,
    annualHours: 6000,
    fuelConsumptionBase: 600,
    maintenanceInterval: 4000,
    maintenanceCostBase: 50000,
    insuranceFactor: 1.3,
  },
  specialVessel: {
    name: '特种船舶',
    typicalPower: 1000,
    lifespan: 20,
    annualHours: 3500,
    fuelConsumptionBase: 180,
    maintenanceInterval: 2500,
    maintenanceCostBase: 20000,
    insuranceFactor: 1.2,
  },
  yacht: {
    name: '游艇',
    typicalPower: 300,
    lifespan: 15,
    annualHours: 800,
    fuelConsumptionBase: 60,
    maintenanceInterval: 500,
    maintenanceCostBase: 10000,
    insuranceFactor: 1.5,
  },
  military: {
    name: '军用船舶',
    typicalPower: 2000,
    lifespan: 30,
    annualHours: 2000,
    fuelConsumptionBase: 350,
    maintenanceInterval: 2000,
    maintenanceCostBase: 40000,
    insuranceFactor: 1.0,
  }
};

// ============================================================
// 竞争定位图数据 (Positioning Map Coordinates)
// ============================================================
// x轴: 价格(1-10, 10=最贵), y轴: 技术(1-10, 10=最先进), size: 市场份额估算
export const positioningMapData = {
  HANGCHI: { x: 5, y: 7, size: 35, label: '杭齿前进' },
  CZCG: { x: 5.5, y: 7, size: 25, label: '重齿' },
  NGC: { x: 6, y: 7.5, size: 18, label: '南高齿' },
  ZF: { x: 9, y: 9.5, size: 8, label: 'ZF' },
  Reintjes: { x: 8.5, y: 9, size: 5, label: 'Reintjes' },
  TwinDisc: { x: 7.5, y: 7, size: 3, label: 'TwinDisc' },
  DCSG: { x: 4, y: 5, size: 5, label: '大齿' },
  FADA: { x: 3, y: 4, size: 6, label: '法达' },
  Fenjin: { x: 2, y: 3, size: 4, label: '奋进' },
  MassonMarine: { x: 9.5, y: 9.5, size: 2, label: 'Masson' },
  DongI: { x: 6.5, y: 7, size: 2, label: '东一' },
  Kanzaki: { x: 7, y: 6.5, size: 1.5, label: '神崎' },
  PRM: { x: 6, y: 5, size: 1, label: 'PRM' },
};

// ============================================================
// 导出增强后的产品数据（合并新鲜度信息）
// ============================================================
export const getEnhancedProducts = () => {
  return competitorProducts.map(product => ({
    ...product,
    freshness: productFreshnessData[product.model] || {
      lastVerified: null,
      priceConfidence: 'unknown',
      source: '未知'
    },
    techDimensions: techDimensionsTemplate[product.manufacturer] || null
  }));
};

export default {
  DATA_VERSION,
  productFreshnessData,
  techDimensionsTemplate,
  marketSegments,
  swotBySegment,
  segmentSalesPitches,
  tcoParameters,
  shipTypeDefaults,
  positioningMapData,
  getEnhancedProducts
};
