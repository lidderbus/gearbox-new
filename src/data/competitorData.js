/**
 * 竞品对比数据库
 *
 * 包含主要竞争对手产品数据：
 * - 重齿 (CZCG) - 重庆齿轮箱有限责任公司
 * - 南高精 (NGC) - 南京高精船用设备有限公司
 * - ZF - ZF Marine (德国采埃孚)
 *
 * 数据来源：公开官网资料、行业报告、代理商信息
 * 注意：价格为市场估算值，仅供参考
 */

// 竞争对手公司信息
export const competitors = {
  CZCG: {
    id: 'CZCG',
    name: '重庆齿轮箱有限责任公司',
    shortName: '重齿',
    englishName: 'Chongqing Gearbox Co., Ltd.',
    country: '中国',
    city: '重庆江津',
    website: 'www.chongchi.com',
    parentCompany: '中国船舶集团',
    foundedYear: 1966,
    certifications: ['CCS', 'ABS', 'LR', 'BV', 'GL', 'DNV', 'NK'],
    marketPosition: '国内大功率船用齿轮箱市场领导者',
    specialization: '军用舰船、大型商船',
    annualCapacity: '500+ 套/年',
    technology: '引进德国罗曼(Lohmann)技术',
    strengths: [
      '军工品质，可靠性高',
      '大功率覆盖全面 (最大10000+HP)',
      '船级社认证齐全',
      '国产自主可控',
      '技术积累深厚(50+年)'
    ],
    weaknesses: [
      '价格相对较高',
      '交货周期长 (10-16周)',
      '中小功率产品线相对较弱',
      '售后网点集中在沿海'
    ],
    logo: null, // 可添加logo URL
    color: '#C41E3A' // 品牌主色
  },

  NGC: {
    id: 'NGC',
    name: '南京高精船用设备有限公司',
    shortName: '南高精',
    englishName: 'Nanjing High Accurate Marine Equipment Co., Ltd.',
    country: '中国',
    city: '南京',
    website: 'www.ngc-marine.com',
    parentCompany: '中国传动',
    foundedYear: 1969,
    certifications: ['ABS', 'LR', 'CCS', 'BV', 'RINA', 'DNV', 'RMRS'],
    marketPosition: '大型船舶/疏浚船齿轮箱专家',
    specialization: 'CPP系统集成、疏浚船传动',
    annualCapacity: '1000+ 套/年',
    technology: '自主研发 + 引进技术',
    strengths: [
      'CPP调距桨系统集成能力强',
      '疏浚船传动系统经验丰富',
      '产能大，交期有保障',
      '大型船舶配套经验丰富',
      '海外市场开拓积极'
    ],
    weaknesses: [
      '中小功率市场覆盖弱',
      '品牌知名度不如ZF',
      '价格竞争力一般',
      '售后服务网络有待完善'
    ],
    logo: null,
    color: '#1E90FF' // 品牌主色
  },

  ZF: {
    id: 'ZF',
    name: 'ZF Friedrichshafen AG',
    shortName: 'ZF',
    englishName: 'ZF Marine',
    country: '德国',
    city: 'Friedrichshafen',
    website: 'www.zf.com/marine',
    parentCompany: 'ZF集团',
    foundedYear: 1915,
    certifications: ['ISO9001', 'ABS', 'LR', 'DNV-GL', 'CCS', 'BV', 'RINA', 'NK'],
    marketPosition: '全球船用齿轮箱高端市场标杆',
    specialization: '全系列船用齿轮箱，从游艇到商船',
    annualCapacity: '10000+ 套/年(全球)',
    technology: '德国自主研发，全球领先',
    strengths: [
      '德国制造，品质卓越',
      '全功率范围覆盖 (10HP-3500kW)',
      '全球品牌认可度最高',
      '技术领先，创新能力强',
      '全球售后服务网络'
    ],
    weaknesses: [
      '价格昂贵 (溢价30-50%)',
      '进口周期长 (12-20周)',
      '配件成本高',
      '本地化服务响应慢',
      '汇率波动影响价格'
    ],
    logo: null,
    color: '#003366' // 品牌主色
  },

  // 杭齿信息（用于对比展示）
  HANGCHI: {
    id: 'HANGCHI',
    name: '杭州前进齿轮箱集团股份有限公司',
    shortName: '杭齿',
    englishName: 'Hangzhou Advance Gearbox Group Co., Ltd.',
    country: '中国',
    city: '杭州',
    website: 'www.hzqj.com',
    parentCompany: '中国船舶集团',
    foundedYear: 1960,
    certifications: ['CCS', 'ABS', 'LR', 'BV', 'GL', 'DNV', 'NK', 'RINA', 'RS'],
    marketPosition: '中国船用齿轮箱市场领导者',
    specialization: '全系列船用齿轮箱',
    annualCapacity: '10000+ 套/年',
    technology: '自主研发 + 国际合作',
    strengths: [
      '性价比高',
      '交货快 (4-8周)',
      '产品线齐全',
      '售后服务网络完善 (全国50+网点)',
      '技术成熟稳定',
      '国产替代首选'
    ],
    weaknesses: [],
    logo: null,
    color: '#D4AF37' // 品牌主色 - 金色
  }
};

// 竞品产品数据库
export const competitorProducts = [
  // ============================================================
  // 重齿 (CZCG) 产品系列
  // ============================================================

  // GW系列 - 大功率船用齿轮箱
  {
    manufacturer: 'CZCG',
    model: 'GW10',
    series: 'GW',
    type: '船用减速齿轮箱',
    description: 'GW系列小型船用齿轮箱，适用于渔船、小型工作船',
    equivalentHangchi: ['HC65', 'HC100'],
    powerRange: [50, 200],
    speedRange: [1000, 2500],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5],
    transferCapacity: 0.12,
    thrust: 15,
    weight: 120,
    dimensions: '350x300x400',
    efficiency: 0.97,
    estimatedPrice: 35000,
    deliveryWeeks: 8,
    warrantyMonths: 12,
    features: ['正倒车离合', '硬齿面', '结构紧凑']
  },
  {
    manufacturer: 'CZCG',
    model: 'GW20',
    series: 'GW',
    type: '船用减速齿轮箱',
    description: 'GW系列中型船用齿轮箱',
    equivalentHangchi: ['HC138', 'HCM140'],
    powerRange: [100, 400],
    speedRange: [800, 2200],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: 0.25,
    thrust: 30,
    weight: 280,
    dimensions: '500x450x550',
    efficiency: 0.97,
    estimatedPrice: 58000,
    deliveryWeeks: 10,
    warrantyMonths: 12,
    features: ['正倒车离合', '可配PTO', '硬齿面']
  },
  {
    manufacturer: 'CZCG',
    model: 'GW30',
    series: 'GW',
    type: '船用减速齿轮箱',
    description: 'GW系列中大型船用齿轮箱',
    equivalentHangchi: ['HCM300', 'HC300'],
    powerRange: [200, 800],
    speedRange: [600, 1800],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
    transferCapacity: 0.55,
    thrust: 60,
    weight: 650,
    dimensions: '700x600x750',
    efficiency: 0.97,
    estimatedPrice: 125000,
    deliveryWeeks: 10,
    warrantyMonths: 12,
    features: ['正倒车离合', '多PTO输出', '液压控制']
  },
  {
    manufacturer: 'CZCG',
    model: 'GW40',
    series: 'GW',
    type: '船用减速齿轮箱',
    description: 'GW系列大型船用齿轮箱',
    equivalentHangchi: ['HCD400', 'HCM400'],
    powerRange: [500, 2000],
    speedRange: [600, 1800],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
    transferCapacity: 2.5,
    thrust: 150,
    weight: 2800,
    dimensions: '1200x1000x1100',
    efficiency: 0.97,
    estimatedPrice: 380000,
    deliveryWeeks: 12,
    warrantyMonths: 18,
    features: ['正倒车离合', '双PTO', '液压控制', '推力轴承']
  },
  {
    manufacturer: 'CZCG',
    model: 'GW60',
    series: 'GW',
    type: '船用减速齿轮箱',
    description: 'GW系列超大型船用齿轮箱',
    equivalentHangchi: ['HCD600', 'HCDX600'],
    powerRange: [1500, 5000],
    speedRange: [500, 1500],
    ratios: [2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0],
    transferCapacity: 6.0,
    thrust: 350,
    weight: 8500,
    dimensions: '1800x1500x1600',
    efficiency: 0.97,
    estimatedPrice: 850000,
    deliveryWeeks: 16,
    warrantyMonths: 18,
    features: ['正倒车离合', '多功率输出', '全液压控制']
  },

  // GC系列 - 定距/变距桨齿轮箱
  {
    manufacturer: 'CZCG',
    model: 'GCS300',
    series: 'GC',
    type: 'CPP/FPP船用齿轮箱',
    description: 'GCS系列单级减速齿轮箱，适用于CPP/FPP',
    equivalentHangchi: ['GCS320', 'GCS450'],
    powerRange: [300, 800],
    speedRange: [900, 1800],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: 0.6,
    thrust: 80,
    weight: 1200,
    dimensions: '900x750x850',
    efficiency: 0.97,
    estimatedPrice: 280000,
    deliveryWeeks: 12,
    warrantyMonths: 18,
    features: ['配油器安装', '单级减速', 'CPP适用']
  },
  {
    manufacturer: 'CZCG',
    model: 'GCD500',
    series: 'GC',
    type: 'CPP/FPP船用齿轮箱',
    description: 'GCD系列两级减速齿轮箱，大速比',
    equivalentHangchi: ['GCD560', 'GCD710'],
    powerRange: [800, 2500],
    speedRange: [600, 1500],
    ratios: [5.0, 5.5, 6.0, 6.5, 7.0, 7.5, 8.0],
    transferCapacity: 1.8,
    thrust: 200,
    weight: 4500,
    dimensions: '1400x1100x1200',
    efficiency: 0.96,
    estimatedPrice: 620000,
    deliveryWeeks: 14,
    warrantyMonths: 18,
    features: ['两级减速', '大速比', '配油器安装']
  },

  // ============================================================
  // 南高精 (NGC) 产品系列
  // ============================================================

  // CG系列 - FPP定距桨齿轮箱
  {
    manufacturer: 'NGC',
    model: 'CGC200',
    series: 'CG',
    type: 'FPP船用齿轮箱',
    description: 'CG系列紧凑型定距桨齿轮箱',
    equivalentHangchi: ['HC200', 'HCM200'],
    powerRange: [150, 500],
    speedRange: [800, 2000],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: 0.35,
    thrust: 40,
    weight: 450,
    dimensions: '600x500x600',
    efficiency: 0.97,
    estimatedPrice: 95000,
    deliveryWeeks: 8,
    warrantyMonths: 12,
    features: ['紧凑设计', '液压离合']
  },
  {
    manufacturer: 'NGC',
    model: 'CGS400',
    series: 'CG',
    type: 'FPP船用齿轮箱',
    description: 'CG系列标准型定距桨齿轮箱',
    equivalentHangchi: ['HCD400', 'HCM400'],
    powerRange: [400, 1800],
    speedRange: [600, 1500],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: 2.2,
    thrust: 140,
    weight: 2600,
    dimensions: '1100x900x1000',
    efficiency: 0.97,
    estimatedPrice: 350000,
    deliveryWeeks: 10,
    warrantyMonths: 12,
    features: ['标准结构', '液压离合', '可配PTO']
  },
  {
    manufacturer: 'NGC',
    model: 'CGD600',
    series: 'CG',
    type: 'FPP船用齿轮箱',
    description: 'CG系列双输入型齿轮箱',
    equivalentHangchi: ['HCD600', 'HCDX600'],
    powerRange: [1000, 4000],
    speedRange: [500, 1200],
    ratios: [2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
    transferCapacity: 5.5,
    thrust: 280,
    weight: 7500,
    dimensions: '1600x1300x1400',
    efficiency: 0.96,
    estimatedPrice: 780000,
    deliveryWeeks: 12,
    warrantyMonths: 12,
    features: ['双输入', '大功率', '液压控制']
  },

  // CK系列 - CPP调距桨齿轮箱
  {
    manufacturer: 'NGC',
    model: 'CK350',
    series: 'CK',
    type: 'CPP调距桨齿轮箱',
    description: 'CK系列小型CPP齿轮箱',
    equivalentHangchi: ['GCS320', 'GCS450'],
    powerRange: [200, 600],
    speedRange: [800, 1800],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: 0.45,
    thrust: 50,
    weight: 850,
    dimensions: '800x650x750',
    efficiency: 0.97,
    estimatedPrice: 220000,
    deliveryWeeks: 10,
    warrantyMonths: 12,
    features: ['配油器', 'CPP专用', '紧凑设计']
  },
  {
    manufacturer: 'NGC',
    model: 'CK600',
    series: 'CK',
    type: 'CPP调距桨齿轮箱',
    description: 'CK系列中型CPP齿轮箱',
    equivalentHangchi: ['GCS560', 'GCS710'],
    powerRange: [500, 1600],
    speedRange: [600, 1500],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5],
    transferCapacity: 1.2,
    thrust: 120,
    weight: 2800,
    dimensions: '1100x900x1000',
    efficiency: 0.97,
    estimatedPrice: 480000,
    deliveryWeeks: 12,
    warrantyMonths: 12,
    features: ['配油器', 'CPP专用', '液压控制']
  },
  {
    manufacturer: 'NGC',
    model: 'CK1000',
    series: 'CK',
    type: 'CPP调距桨齿轮箱',
    description: 'CK系列大型CPP齿轮箱',
    equivalentHangchi: ['GCST710', 'GCD710'],
    powerRange: [1200, 4000],
    speedRange: [500, 1200],
    ratios: [2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
    transferCapacity: 4.5,
    thrust: 250,
    weight: 6500,
    dimensions: '1500x1200x1300',
    efficiency: 0.96,
    estimatedPrice: 920000,
    deliveryWeeks: 14,
    warrantyMonths: 18,
    features: ['配油器', 'CPP专用', '大功率', 'PTO可选']
  },

  // 疏浚船专用系列
  {
    manufacturer: 'NGC',
    model: 'DG800',
    series: 'DG',
    type: '疏浚船传动齿轮箱',
    description: '疏浚船泥泵驱动齿轮箱',
    equivalentHangchi: ['HCD600'],
    powerRange: [800, 3300],
    speedRange: [600, 1500],
    ratios: [1.5, 2.0, 2.5, 3.0],
    transferCapacity: 3.0,
    thrust: 0, // 非推进用途
    weight: 5500,
    dimensions: '1400x1100x1200',
    efficiency: 0.96,
    estimatedPrice: 680000,
    deliveryWeeks: 14,
    warrantyMonths: 12,
    features: ['双速比', '重载设计', '疏浚专用']
  },

  // ============================================================
  // ZF Marine 产品系列
  // ============================================================

  // 小型机械系列 (12-45)
  {
    manufacturer: 'ZF',
    model: 'ZF15M',
    series: 'Small',
    type: '机械式船用齿轮箱',
    description: 'ZF小型机械式齿轮箱，游艇用',
    equivalentHangchi: ['HC65'],
    powerRange: [15, 75],
    speedRange: [1500, 4000],
    ratios: [1.5, 2.0, 2.5],
    transferCapacity: 0.025,
    thrust: 5,
    weight: 28,
    dimensions: '250x200x250',
    efficiency: 0.98,
    estimatedPrice: 28000,
    deliveryWeeks: 12,
    warrantyMonths: 24,
    features: ['机械式', '轻量化', '游艇专用']
  },
  {
    manufacturer: 'ZF',
    model: 'ZF25',
    series: 'Small',
    type: '液压式船用齿轮箱',
    description: 'ZF小型液压式齿轮箱',
    equivalentHangchi: ['HC100', 'HC120'],
    powerRange: [40, 150],
    speedRange: [1500, 3500],
    ratios: [1.5, 2.0, 2.5, 3.0],
    transferCapacity: 0.055,
    thrust: 10,
    weight: 45,
    dimensions: '320x280x320',
    efficiency: 0.97,
    estimatedPrice: 45000,
    deliveryWeeks: 12,
    warrantyMonths: 24,
    features: ['液压式', '紧凑设计']
  },
  {
    manufacturer: 'ZF',
    model: 'ZF45',
    series: 'Small',
    type: '液压式船用齿轮箱',
    description: 'ZF小型液压式齿轮箱',
    equivalentHangchi: ['HC138', 'HCM140'],
    powerRange: [75, 220],
    speedRange: [1200, 3000],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5],
    transferCapacity: 0.09,
    thrust: 15,
    weight: 68,
    dimensions: '380x330x380',
    efficiency: 0.97,
    estimatedPrice: 68000,
    deliveryWeeks: 12,
    warrantyMonths: 24,
    features: ['液压式', '多配置']
  },

  // 中型系列 (63-305)
  {
    manufacturer: 'ZF',
    model: 'ZF80',
    series: 'Medium',
    type: '液压式船用齿轮箱',
    description: 'ZF中型液压式齿轮箱',
    equivalentHangchi: ['HC200', 'HCM200'],
    powerRange: [110, 330],
    speedRange: [1000, 2800],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: 0.15,
    thrust: 25,
    weight: 115,
    dimensions: '480x420x480',
    efficiency: 0.97,
    estimatedPrice: 95000,
    deliveryWeeks: 14,
    warrantyMonths: 24,
    features: ['液压式', '多角度配置']
  },
  {
    manufacturer: 'ZF',
    model: 'ZF220',
    series: 'Medium',
    type: '液压式船用齿轮箱',
    description: 'ZF中型液压式齿轮箱',
    equivalentHangchi: ['HC300', 'HCM300'],
    powerRange: [220, 600],
    speedRange: [800, 2500],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5],
    transferCapacity: 0.30,
    thrust: 45,
    weight: 280,
    dimensions: '600x550x620',
    efficiency: 0.97,
    estimatedPrice: 145000,
    deliveryWeeks: 14,
    warrantyMonths: 24,
    features: ['液压式', 'DropCenter可选']
  },
  {
    manufacturer: 'ZF',
    model: 'ZF305',
    series: 'Medium',
    type: '液压式船用齿轮箱',
    description: 'ZF中大型液压式齿轮箱',
    equivalentHangchi: ['HCM400', 'HC400'],
    powerRange: [400, 1100],
    speedRange: [800, 2200],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
    transferCapacity: 0.58,
    thrust: 80,
    weight: 520,
    dimensions: '750x680x780',
    efficiency: 0.97,
    estimatedPrice: 215000,
    deliveryWeeks: 16,
    warrantyMonths: 24,
    features: ['液压式', 'SuperShift控制']
  },

  // 商业W系列
  {
    manufacturer: 'ZF',
    model: 'W320',
    series: 'W',
    type: '商业船用齿轮箱',
    description: 'ZF W系列商业船用齿轮箱',
    equivalentHangchi: ['HC400', 'HCM400'],
    powerRange: [300, 800],
    speedRange: [1000, 2500],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5],
    transferCapacity: 0.35,
    thrust: 80,
    weight: 450,
    dimensions: '680x600x700',
    efficiency: 0.97,
    estimatedPrice: 180000,
    deliveryWeeks: 16,
    warrantyMonths: 24,
    features: ['铸铁壳体', '深减速比', '商船专用']
  },
  {
    manufacturer: 'ZF',
    model: 'W650',
    series: 'W',
    type: '商业船用齿轮箱',
    description: 'ZF W系列大型商业船用齿轮箱',
    equivalentHangchi: ['HCD600', 'HCDX600'],
    powerRange: [600, 1800],
    speedRange: [800, 2000],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5],
    transferCapacity: 1.0,
    thrust: 180,
    weight: 1200,
    dimensions: '950x850x950',
    efficiency: 0.97,
    estimatedPrice: 380000,
    deliveryWeeks: 18,
    warrantyMonths: 24,
    features: ['铸铁壳体', '重载设计', '商船专用']
  },

  // 大功率系列 (2000-9000)
  {
    manufacturer: 'ZF',
    model: 'ZF3000',
    series: 'Heavy',
    type: '大功率船用齿轮箱',
    description: 'ZF 3000系列大功率齿轮箱',
    equivalentHangchi: ['HCD600', 'HCDX600'],
    powerRange: [1164, 1682],
    speedRange: [600, 1500],
    ratios: [2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5],
    transferCapacity: 1.5,
    thrust: 250,
    weight: 3800,
    dimensions: '1300x1100x1200',
    efficiency: 0.96,
    estimatedPrice: 620000,
    deliveryWeeks: 20,
    warrantyMonths: 24,
    features: ['重载设计', '多配置', '全球服务']
  },
  {
    manufacturer: 'ZF',
    model: 'ZF5000',
    series: 'Heavy',
    type: '大功率船用齿轮箱',
    description: 'ZF 5000系列超大功率齿轮箱',
    equivalentHangchi: ['HCDX800'],
    powerRange: [1941, 2312],
    speedRange: [500, 1200],
    ratios: [3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0],
    transferCapacity: 2.5,
    thrust: 400,
    weight: 6500,
    dimensions: '1600x1350x1450',
    efficiency: 0.96,
    estimatedPrice: 950000,
    deliveryWeeks: 22,
    warrantyMonths: 24,
    features: ['超大功率', '高可靠性', '全球服务']
  },
  {
    manufacturer: 'ZF',
    model: 'ZF9000',
    series: 'Heavy',
    type: '大功率船用齿轮箱',
    description: 'ZF 9000系列顶级大功率齿轮箱',
    equivalentHangchi: ['HCDX1000'],
    powerRange: [3150, 3479],
    speedRange: [400, 1000],
    ratios: [3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0],
    transferCapacity: 4.5,
    thrust: 600,
    weight: 12000,
    dimensions: '2000x1700x1800',
    efficiency: 0.96,
    estimatedPrice: 1650000,
    deliveryWeeks: 24,
    warrantyMonths: 24,
    features: ['顶级配置', '极高可靠性', '全球服务']
  },

  // ============================================================
  // 补充竞品型号 - 常见中小功率段
  // ============================================================

  // 重齿补充型号
  {
    manufacturer: 'CZCG',
    model: 'GW15',
    series: 'GW',
    type: '船用减速齿轮箱',
    description: 'GW系列小中型船用齿轮箱',
    equivalentHangchi: ['HC120', 'HC138'],
    powerRange: [80, 300],
    speedRange: [900, 2300],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5],
    transferCapacity: 0.18,
    thrust: 22,
    weight: 180,
    dimensions: '420x380x450',
    efficiency: 0.97,
    estimatedPrice: 45000,
    deliveryWeeks: 8,
    warrantyMonths: 12,
    features: ['正倒车离合', '硬齿面', '紧凑设计']
  },
  {
    manufacturer: 'CZCG',
    model: 'GW25',
    series: 'GW',
    type: '船用减速齿轮箱',
    description: 'GW系列中型船用齿轮箱',
    equivalentHangchi: ['HCM200', 'HC200'],
    powerRange: [150, 500],
    speedRange: [700, 2000],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: 0.35,
    thrust: 45,
    weight: 420,
    dimensions: '580x520x600',
    efficiency: 0.97,
    estimatedPrice: 85000,
    deliveryWeeks: 10,
    warrantyMonths: 12,
    features: ['正倒车离合', '可配PTO', '硬齿面']
  },
  {
    manufacturer: 'CZCG',
    model: 'GW50',
    series: 'GW',
    type: '船用减速齿轮箱',
    description: 'GW系列大型船用齿轮箱',
    equivalentHangchi: ['HCD500', 'HCDX500'],
    powerRange: [1000, 3500],
    speedRange: [500, 1600],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5],
    transferCapacity: 4.0,
    thrust: 220,
    weight: 5800,
    dimensions: '1500x1200x1300',
    efficiency: 0.97,
    estimatedPrice: 580000,
    deliveryWeeks: 14,
    warrantyMonths: 18,
    features: ['正倒车离合', '多PTO输出', '全液压控制']
  },

  // 南高精补充型号
  {
    manufacturer: 'NGC',
    model: 'CGC150',
    series: 'CG',
    type: 'FPP船用齿轮箱',
    description: 'CG系列小型定距桨齿轮箱',
    equivalentHangchi: ['HC138', 'HCM140'],
    powerRange: [100, 300],
    speedRange: [1000, 2500],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5],
    transferCapacity: 0.18,
    thrust: 25,
    weight: 280,
    dimensions: '480x420x500',
    efficiency: 0.97,
    estimatedPrice: 65000,
    deliveryWeeks: 8,
    warrantyMonths: 12,
    features: ['紧凑设计', '机械离合']
  },
  {
    manufacturer: 'NGC',
    model: 'CGS300',
    series: 'CG',
    type: 'FPP船用齿轮箱',
    description: 'CG系列中型定距桨齿轮箱',
    equivalentHangchi: ['HC300', 'HCM300'],
    powerRange: [250, 1000],
    speedRange: [700, 1800],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: 0.75,
    thrust: 80,
    weight: 1200,
    dimensions: '850x720x800',
    efficiency: 0.97,
    estimatedPrice: 195000,
    deliveryWeeks: 10,
    warrantyMonths: 12,
    features: ['标准结构', '液压离合', '可配PTO']
  },
  {
    manufacturer: 'NGC',
    model: 'CK800',
    series: 'CK',
    type: 'CPP调距桨齿轮箱',
    description: 'CK系列中大型CPP齿轮箱',
    equivalentHangchi: ['GCS710', 'GCST710'],
    powerRange: [800, 2500],
    speedRange: [500, 1400],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0],
    transferCapacity: 2.5,
    thrust: 180,
    weight: 4200,
    dimensions: '1250x1050x1150',
    efficiency: 0.96,
    estimatedPrice: 680000,
    deliveryWeeks: 12,
    warrantyMonths: 15,
    features: ['配油器', 'CPP专用', 'PTO可选']
  },

  // ZF补充型号
  {
    manufacturer: 'ZF',
    model: 'ZF63',
    series: 'Medium',
    type: '液压式船用齿轮箱',
    description: 'ZF中小型液压式齿轮箱',
    equivalentHangchi: ['HC138', 'HCM150'],
    powerRange: [80, 250],
    speedRange: [1200, 3200],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5],
    transferCapacity: 0.10,
    thrust: 18,
    weight: 85,
    dimensions: '420x380x420',
    efficiency: 0.97,
    estimatedPrice: 78000,
    deliveryWeeks: 14,
    warrantyMonths: 24,
    features: ['液压式', '高精度']
  },
  {
    manufacturer: 'ZF',
    model: 'ZF150',
    series: 'Medium',
    type: '液压式船用齿轮箱',
    description: 'ZF中型液压式齿轮箱',
    equivalentHangchi: ['HC200', 'HCM250'],
    powerRange: [150, 450],
    speedRange: [1000, 2800],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: 0.22,
    thrust: 35,
    weight: 180,
    dimensions: '550x480x550',
    efficiency: 0.97,
    estimatedPrice: 125000,
    deliveryWeeks: 14,
    warrantyMonths: 24,
    features: ['液压式', '多配置选项']
  },
  {
    manufacturer: 'ZF',
    model: 'ZF500',
    series: 'High-Performance',
    type: '高性能船用齿轮箱',
    description: 'ZF高性能系列齿轮箱',
    equivalentHangchi: ['HCD500', 'HCM500'],
    powerRange: [600, 1500],
    speedRange: [800, 2200],
    ratios: [1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5],
    transferCapacity: 0.80,
    thrust: 120,
    weight: 850,
    dimensions: '900x780x880',
    efficiency: 0.97,
    estimatedPrice: 320000,
    deliveryWeeks: 16,
    warrantyMonths: 24,
    features: ['高性能', '角驱动可选', 'SuperShift']
  },
  {
    manufacturer: 'ZF',
    model: 'W450',
    series: 'W',
    type: '商业船用齿轮箱',
    description: 'ZF W系列中型商业船用齿轮箱',
    equivalentHangchi: ['HCD400', 'HCM450'],
    powerRange: [400, 1200],
    speedRange: [900, 2200],
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5],
    transferCapacity: 0.65,
    thrust: 110,
    weight: 720,
    dimensions: '800x700x820',
    efficiency: 0.97,
    estimatedPrice: 260000,
    deliveryWeeks: 16,
    warrantyMonths: 24,
    features: ['铸铁壳体', '商船专用', '耐用可靠']
  }
];

// 杭齿优势配置
export const hangchiAdvantages = {
  // 价格优势
  priceAdvantage: {
    vsCZCG: 0.12,    // 比重齿便宜约12%
    vsNGC: 0.10,     // 比南高精便宜约10%
    vsZF: 0.35,      // 比ZF便宜约35%
    average: 0.19    // 平均便宜约19%
  },

  // 交期优势
  deliveryAdvantage: {
    hangchiWeeks: 6,       // 杭齿标准交期6周
    vsCZCG: 4,             // 比重齿快4周
    vsNGC: 3,              // 比南高精快3周
    vsZF: 10,              // 比ZF快10周
    average: 5.7           // 平均快5.7周
  },

  // 服务优势
  serviceAdvantage: {
    responseTime: 24,      // 24小时响应
    servicePoints: 50,     // 全国50+服务网点
    spareParts: '国内现货',
    technicalSupport: '7x24'
  },

  // 质保优势
  warrantyAdvantage: {
    hangchiMonths: 18,     // 杭齿标准质保18个月
    vsCZCG: 0,             // 与重齿相当
    vsNGC: 6,              // 比南高精多6个月
    vsZF: -6               // 比ZF少6个月（ZF质保24个月）
  },

  // 质保（兼容旧代码）
  warrantyDefault: 18,     // 默认质保18个月
  warrantyExtended: 24,    // 可延保至24个月

  // 本地化
  localization: {
    manufacturing: '杭州',
    rndCenter: '杭州',
    partsWarehouse: ['杭州', '上海', '广州', '青岛', '大连'],
    trainingCenter: '杭州'
  }
};

// 对比维度配置
export const comparisonDimensions = {
  technical: [
    { key: 'powerRange', label: '功率范围', unit: 'kW', type: 'range' },
    { key: 'speedRange', label: '转速范围', unit: 'rpm', type: 'range' },
    { key: 'ratios', label: '速比范围', unit: '', type: 'array' },
    { key: 'transferCapacity', label: '传递能力', unit: 'kW/(r·min)', type: 'number' },
    { key: 'thrust', label: '推力', unit: 'kN', type: 'number' },
    { key: 'weight', label: '重量', unit: 'kg', type: 'number' },
    { key: 'efficiency', label: '效率', unit: '%', type: 'percent' },
    { key: 'dimensions', label: '外形尺寸', unit: 'mm', type: 'string' }
  ],
  commercial: [
    { key: 'estimatedPrice', label: '市场价格', unit: '元', type: 'currency' },
    { key: 'deliveryWeeks', label: '交货周期', unit: '周', type: 'number' },
    { key: 'warrantyMonths', label: '质保期', unit: '月', type: 'number' }
  ],
  qualitative: [
    { key: 'certifications', label: '船级社认证' },
    { key: 'features', label: '产品特点' },
    { key: 'strengths', label: '优势' },
    { key: 'weaknesses', label: '劣势' }
  ]
};

// 根据功率范围查找竞品
export const findCompetitorsByPower = (power, speed, ratio) => {
  return competitorProducts.filter(p => {
    const powerMatch = power >= p.powerRange[0] && power <= p.powerRange[1];
    const speedMatch = speed >= p.speedRange[0] && speed <= p.speedRange[1];
    const ratioMatch = p.ratios.some(r => Math.abs(r - ratio) / ratio <= 0.25);
    return powerMatch && speedMatch && ratioMatch;
  });
};

// 根据杭齿型号查找对标竞品
export const findEquivalentCompetitors = (hangchiModel) => {
  return competitorProducts.filter(p =>
    p.equivalentHangchi &&
    (Array.isArray(p.equivalentHangchi)
      ? p.equivalentHangchi.includes(hangchiModel)
      : p.equivalentHangchi === hangchiModel)
  );
};

export default {
  competitors,
  competitorProducts,
  hangchiAdvantages,
  comparisonDimensions,
  findCompetitorsByPower,
  findEquivalentCompetitors
};
