// 康明斯主机与杭齿齿轮箱配套数据
// 数据来源: 杭齿前进实际订单数据
// 更新日期: 2026-01-08

// 康明斯主机详细规格
export const cumminsEngines = [
  {
    model: 'K19-M',
    series: 'K19',
    powerRange: '373-522kW',
    powerMin: 373,
    powerMax: 522,
    rpmRange: '1800-2100rpm',
    rpmMin: 1800,
    rpmMax: 2100,
    displacement: '19L',
    cylinders: 6,
    application: '中型船舶',
    features: ['高可靠性', '低油耗', '维护便捷'],
    image: 'k19-m.jpg'
  },
  {
    model: 'KT19-M',
    series: 'K19',
    powerRange: '410-522kW',
    powerMin: 410,
    powerMax: 522,
    rpmRange: '2100rpm',
    rpmMin: 2100,
    rpmMax: 2100,
    displacement: '19L',
    cylinders: 6,
    application: '高速船舶',
    features: ['涡轮增压', '高转速', '大功率密度'],
    image: 'kt19-m.jpg'
  },
  {
    model: 'K38-M',
    series: 'K38',
    powerRange: '746-1044kW',
    powerMin: 746,
    powerMax: 1044,
    rpmRange: '1800-1900rpm',
    rpmMin: 1800,
    rpmMax: 1900,
    displacement: '38L',
    cylinders: 12,
    application: '大型船舶/风电运维',
    features: ['V12布局', '大扭矩', '稳定可靠'],
    image: 'k38-m.jpg'
  },
  {
    model: 'KTA38-M2',
    series: 'K38',
    powerRange: '882-1200HP',
    powerMin: 658,
    powerMax: 895,
    rpmRange: '1744-1900rpm',
    rpmMin: 1744,
    rpmMax: 1900,
    displacement: '38L',
    cylinders: 12,
    application: '巡逻船/渔船',
    features: ['双增压', '高海拔适应', '船检认证'],
    image: 'kta38-m2.jpg'
  },
  {
    model: 'K50-M',
    series: 'K50',
    powerRange: '1268-1641kW',
    powerMin: 1268,
    powerMax: 1641,
    rpmRange: '1800-1900rpm',
    rpmMin: 1800,
    rpmMax: 1900,
    displacement: '50L',
    cylinders: 16,
    application: '大型渡轮/货船',
    features: ['V16布局', '顶级功率', '远洋级别'],
    image: 'k50-m.jpg'
  },
  {
    model: 'KTA50',
    series: 'K50',
    powerRange: '1268-1475HP',
    powerMin: 946,
    powerMax: 1100,
    rpmRange: '1800rpm',
    rpmMin: 1800,
    rpmMax: 1800,
    displacement: '50L',
    cylinders: 16,
    application: '货船',
    features: ['经济航速优化', '低振动', '长寿命'],
    image: 'kta50.jpg'
  },
  {
    model: 'QSNT-M350',
    series: 'QSN',
    powerRange: '261kW',
    powerMin: 261,
    powerMax: 261,
    rpmRange: '1800rpm',
    rpmMin: 1800,
    rpmMax: 1800,
    displacement: '14L',
    cylinders: 6,
    application: '公安巡逻船',
    features: ['紧凑设计', '快速响应', '电控系统'],
    image: 'qsnt-m350.jpg'
  },
  {
    model: 'QSNT-M400C2',
    series: 'QSN',
    powerRange: '298-400kW',
    powerMin: 298,
    powerMax: 400,
    rpmRange: '1800rpm',
    rpmMin: 1800,
    rpmMax: 1800,
    displacement: '14L',
    cylinders: 6,
    application: '监督艇',
    features: ['Tier III排放', '智能监控', '低噪音'],
    image: 'qsnt-m400.jpg'
  }
];

// 按主机型号分类的配套汇总
export const matchingSummary = [
  {
    engineSeries: 'K19-M / KT19',
    powerRange: '373-522kW',
    rpm: '1800-2100rpm',
    gearboxes: ['HC300', 'HC400', 'HCQ300', 'HCQ401'],
    ratioRange: '2.0-3.0',
    shipTypes: ['航标船', '监督艇', '客船'],
    totalUnits: '50+',
    icon: '🚢',
    color: '#3498db'
  },
  {
    engineSeries: 'K38 / KTA38',
    powerRange: '746-1044kW',
    rpm: '1800-1900rpm',
    gearboxes: ['HC1000', 'HCA700', 'HCQ700', 'HCQ1001'],
    ratioRange: '2.5-3.23',
    shipTypes: ['风电运维', '巡逻船'],
    totalUnits: '80+',
    icon: '⚡',
    color: '#e74c3c'
  },
  {
    engineSeries: 'K50 / KTA50',
    powerRange: '1268-1641kW',
    rpm: '1800-1900rpm',
    gearboxes: ['HC1000', 'HC1200', 'HCM1250'],
    ratioRange: '2.0-3.55',
    shipTypes: ['渡轮', '货船'],
    totalUnits: '30+',
    icon: '🚀',
    color: '#27ae60'
  },
  {
    engineSeries: 'QSNT-M系列',
    powerRange: '261-400kW',
    rpm: '1800rpm',
    gearboxes: ['HC200', 'HC300'],
    ratioRange: '2.0-2.5',
    shipTypes: ['公安巡逻船'],
    totalUnits: '10+',
    icon: '🛥️',
    color: '#9b59b6'
  }
];

// 典型配套项目详情
export const typicalProjects = [
  {
    project: '东海航保150吨航标夹持船',
    engine: 'K19-M',
    power: '373kW',
    gearbox: 'HC300',
    ratio: '3:1',
    quantity: 6,
    shipyard: '江苏通洋船舶',
    designer: '七零八研究所',
    classification: 'CCS入级',
    year: 2023,
    highlight: true
  },
  {
    project: '风电运维船系列',
    engine: 'K38',
    power: '1044kW',
    gearbox: 'HCA700 (倾角8°)',
    ratio: '2.5',
    quantity: 16,
    shipyard: '中船英辉',
    designer: '605院',
    classification: 'CCS入级',
    year: 2023,
    highlight: true
  },
  {
    project: '风电运维船',
    engine: 'K38-M',
    power: '972kW',
    gearbox: 'HC1000',
    ratio: '2.64',
    quantity: 4,
    shipyard: '-',
    designer: '-',
    classification: 'CCS入级',
    year: 2023
  },
  {
    project: '48米巡逻船',
    engine: 'KTA38-M2',
    power: '1007kW',
    gearbox: 'HCQ700',
    ratio: '2.25',
    quantity: 16,
    shipyard: '-',
    designer: '-',
    classification: 'CCS入级',
    year: 2023,
    highlight: true
  },
  {
    project: '190客位双体客船',
    engine: 'K19-M',
    power: '552kW',
    gearbox: 'HCQ401',
    ratio: '2.5',
    quantity: 8,
    shipyard: '-',
    designer: '-',
    classification: 'CCS入级',
    year: 2024
  },
  {
    project: '17米公安巡逻船',
    engine: 'QSNT-M350',
    power: '261kW',
    gearbox: 'HC200',
    ratio: '2',
    quantity: 4,
    shipyard: '-',
    designer: '-',
    classification: 'CCS入级',
    owner: '长江航运公安局',
    year: 2022
  },
  {
    project: '26米监督艇',
    engine: 'QSNT-M400C2',
    power: '298kW',
    gearbox: 'HC300',
    ratio: '2.04',
    quantity: 2,
    shipyard: '-',
    designer: '-',
    classification: 'CCS非入级',
    year: 2024
  },
  {
    project: '渡轮',
    engine: 'K50-M',
    power: '1342kW',
    gearbox: 'HC1000',
    ratio: '2.5',
    quantity: 2,
    shipyard: '-',
    designer: '-',
    classification: 'CCS入级',
    year: 2023
  },
  {
    project: '货船系列',
    engine: 'KTA50',
    power: '1475HP',
    gearbox: 'HC1200',
    ratio: '2.96',
    quantity: 9,
    shipyard: '-',
    designer: '-',
    classification: 'CCS入级',
    year: 2024
  }
];

// 完整订单记录
export const orderRecords = [
  { gearbox: 'HC300', ratio: '3', engine: 'K19-M', power: '373kW', rpm: 1800, shipType: '航标船', qty: 4, year: 2022 },
  { gearbox: 'HC300', ratio: '3:1', engine: 'K19-M', power: '373kW', rpm: 1800, shipType: '150吨航标夹持船', qty: 6, shipyard: '江苏通洋船舶', year: 2023 },
  { gearbox: 'GWC32.35', ratio: '5.57', engine: 'K38', power: '746kW', rpm: 1800, shipType: '散货船', qty: 2, year: 2024 },
  { gearbox: 'GWC36.39', ratio: '4.40', engine: 'K50-M1342C2', power: '1342kW', rpm: 1900, shipType: '-', qty: 2, year: 2024 },
  { gearbox: 'HC1000', ratio: '2', engine: 'K38', power: '1007kW', rpm: 1900, shipType: '-', qty: 2, year: 2022 },
  { gearbox: 'HC1000', ratio: '2.64', engine: 'K38-M', power: '972kW', rpm: 1800, shipType: '风电运维', qty: 4, year: 2023 },
  { gearbox: 'HC1000', ratio: '2.00', engine: 'KTA50', power: '1268kW', rpm: 1800, shipType: '-', qty: 1, year: 2024 },
  { gearbox: 'HC1000', ratio: '3.04', engine: '康明斯', power: '1342kW', rpm: 1900, shipType: '-', qty: 8, year: 2023 },
  { gearbox: 'HC1000', ratio: '2.5', engine: 'K50-M', power: '1342kW', rpm: 1900, shipType: '渡轮', qty: 2, year: 2023 },
  { gearbox: 'HC1200', ratio: '2.96', engine: 'K50', power: '1641kW', rpm: 1900, shipType: '-', qty: 1, year: 2022 },
  { gearbox: 'HC1200', ratio: '3.55', engine: 'K50-M', power: '1324kW', rpm: 1900, shipType: '-', qty: 4, year: 2022 },
  { gearbox: 'HC1200', ratio: '2.96', engine: 'KTA50', power: '1475HP', rpm: 1800, shipType: '货船', qty: 9, year: 2024 },
  { gearbox: 'HC1200/1', ratio: '3.95-4.14', engine: 'KTA38', power: '1300HP', rpm: 1800, shipType: '-', qty: 3, year: 2024 },
  { gearbox: 'HC138', ratio: '2.23', engine: '康明斯', power: '180kW', rpm: 1500, shipType: '-', qty: 4, year: 2022 },
  { gearbox: 'HC200', ratio: '2', engine: 'QSNT-M350', power: '261kW', rpm: 1800, shipType: '17米公安巡逻船', qty: 4, owner: '长江航运公安局', year: 2022 },
  { gearbox: 'HC300', ratio: '2.04', engine: 'QSNT-M400C2', power: '298kW', rpm: 1800, shipType: '26米监督艇', qty: 2, year: 2024 },
  { gearbox: 'HC300', ratio: '2.54', engine: 'K19', power: '600HP', rpm: 1800, shipType: '-', qty: 1, year: 2022 },
  { gearbox: 'HC300', ratio: '3:1', engine: 'K19', power: '447kW', rpm: 1800, shipType: '库区管理', qty: 2, year: 2023 },
  { gearbox: 'HC400', ratio: '1.405', engine: 'K19-M', power: '477kW', rpm: 1800, shipType: '-', qty: 1, year: 2022 },
  { gearbox: 'HC400', ratio: '2.50', engine: 'K19', power: '522kW', rpm: 2100, shipType: '-', qty: 4, year: 2023 },
  { gearbox: 'HCA138(7°)', ratio: '2.52', engine: '康明斯', power: '151kW', rpm: 2200, shipType: '-', qty: 20, year: 2022 },
  { gearbox: 'HCA700', ratio: '2.5', engine: 'K38', power: '1044kW', rpm: 1900, shipType: '-', qty: 2, year: 2022 },
  { gearbox: 'HCA700', ratio: '2.50', engine: 'K38', power: '1044kW', rpm: 1900, shipType: '运维船', qty: 4, year: 2023 },
  { gearbox: 'HCA700(倾角8°)', ratio: '2.5', engine: '康明斯', power: '1007kW', rpm: 1900, shipType: '30m风电运维', qty: 10, shipyard: '中船英辉', year: 2023 },
  { gearbox: 'HCAM1400(倾角7°)', ratio: '2.93', engine: '康明斯', power: '1324ps', rpm: 1900, shipType: '风电运维', qty: 4, shipyard: '中船英辉', designer: '605院', year: 2023 },
  { gearbox: 'HCQ1001', ratio: '3.23', engine: 'K38', power: '1044kW', rpm: 1900, shipType: '风电运维', qty: 12, shipyard: '平湖华海', year: 2023 },
  { gearbox: 'HCQ300', ratio: '2.55', engine: 'KT19-M', power: '410kW', rpm: 2100, shipType: '-', qty: 4, shipyard: '江龙船艇', year: 2024 },
  { gearbox: 'HCQ300', ratio: '2.05', engine: 'K19-M4', power: '522kW', rpm: 2100, shipType: '-', qty: 14, year: 2023 },
  { gearbox: 'HCQ401', ratio: '2.5', engine: 'K19-M', power: '552kW', rpm: 2100, shipType: '190客位双体客船', qty: 8, year: 2024 },
  { gearbox: 'HCQ700', ratio: '2.25-2.5', engine: 'KTA38-M2', power: '1007kW', rpm: 1900, shipType: '28m-48m巡逻船', qty: 24, year: 2023 }
];

// 快速选型推荐矩阵
export const quickSelectionMatrix = {
  'K19': {
    '300-400kW': { gearbox: 'HC300', ratio: '2.5-3.0', confidence: 'high' },
    '400-500kW': { gearbox: 'HC400 / HCQ401', ratio: '2.0-2.5', confidence: 'high' },
    '500-550kW': { gearbox: 'HCQ401', ratio: '2.0-2.5', confidence: 'high' }
  },
  'K38': {
    '700-900kW': { gearbox: 'HCQ700 / HCA700', ratio: '2.25-2.96', confidence: 'high' },
    '900-1000kW': { gearbox: 'HC1000 / HCA700(倾角)', ratio: '2.0-2.64', confidence: 'high' },
    '1000-1100kW': { gearbox: 'HCQ1001 / HCA700', ratio: '2.5-3.23', confidence: 'high' }
  },
  'K50': {
    '1200-1350kW': { gearbox: 'HC1000 / HC1200', ratio: '2.5-3.55', confidence: 'high' },
    '1350-1650kW': { gearbox: 'HC1200 / HCM1250', ratio: '2.96-3.95', confidence: 'high' }
  },
  'QSN': {
    '250-300kW': { gearbox: 'HC200', ratio: '2.0', confidence: 'high' },
    '300-400kW': { gearbox: 'HC300', ratio: '2.0-2.5', confidence: 'high' }
  }
};

// 船型分类数据
export const shipTypeCategories = [
  { type: '风电运维', icon: '⚡', count: 34, color: '#e74c3c' },
  { type: '巡逻船', icon: '🚔', count: 44, color: '#3498db' },
  { type: '货船', icon: '🚢', count: 15, color: '#27ae60' },
  { type: '渡轮', icon: '⛴️', count: 4, color: '#9b59b6' },
  { type: '航标船', icon: '🚨', count: 10, color: '#f39c12' },
  { type: '客船', icon: '🛳️', count: 8, color: '#1abc9c' },
  { type: '其他', icon: '🔧', count: 85, color: '#95a5a6' }
];

// 年度趋势数据
export const yearlyTrends = [
  { year: 2022, units: 45, projects: 8 },
  { year: 2023, units: 95, projects: 15 },
  { year: 2024, units: 60, projects: 12 }
];

// 齿轮箱系列分布
export const gearboxDistribution = [
  { series: 'HC', count: 85, percentage: 42.5 },
  { series: 'HCQ', count: 62, percentage: 31 },
  { series: 'HCA', count: 36, percentage: 18 },
  { series: 'HCAM', count: 4, percentage: 2 },
  { series: 'GWC', count: 4, percentage: 2 },
  { series: '其他', count: 9, percentage: 4.5 }
];

// 统计数据
export const statistics = {
  totalUnits: 200,
  totalProjects: 35,
  engineSeries: ['K19', 'K38', 'K50', 'QSN'],
  gearboxSeries: ['HC', 'HCA', 'HCQ', 'HCAM', 'GWC'],
  topShipTypes: ['风电运维', '巡逻船', '货船', '渡轮', '航标船'],
  topShipyards: ['中船英辉', '江苏通洋船舶', '平湖华海', '江龙船艇'],
  yearRange: '2022-2024',
  avgUnitsPerProject: 5.7,
  successRate: '100%'
};

// 合作优势
export const cooperationAdvantages = [
  { title: '成熟配套经验', description: '10+年康明斯配套历史，200+台套实绩', icon: '🏆' },
  { title: '全系列覆盖', description: 'K19/K38/K50/QSN全系列主机配套方案', icon: '📋' },
  { title: '船检认证', description: 'CCS/BV/LR等多家船检认证', icon: '✅' },
  { title: '快速交付', description: '常用型号库存充足，交期有保障', icon: '⚡' },
  { title: '技术支持', description: '专业选型团队，提供全程技术服务', icon: '🔧' },
  { title: '售后保障', description: '全国服务网络，24小时响应', icon: '🛡️' }
];

export default {
  cumminsEngines,
  matchingSummary,
  typicalProjects,
  orderRecords,
  quickSelectionMatrix,
  shipTypeCategories,
  yearlyTrends,
  gearboxDistribution,
  statistics,
  cooperationAdvantages
};
