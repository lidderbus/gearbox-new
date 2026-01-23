/**
 * 多品牌齿轮箱配置文件
 * Multi-Brand Gearbox Configuration
 *
 * 创建日期: 2026-01-04
 * 版本: 2.0.0 (数据验证更新)
 * 更新日期: 2026-01-04
 * 数据来源: 官网爬取 + 行业资料
 *
 * 支持品牌:
 *   - ADVANCE (杭州前进) - 当前主要品牌
 *   - CHONGCHI (重庆齿轮箱)
 *   - NGC (南高齿)
 *   - ZF_MARINE (ZF Marine)
 *
 * 设计原则:
 *   1. 向后兼容 - 不影响现有杭州前进数据
 *   2. 品牌无关 - 选型算法独立于品牌
 *   3. 可扩展 - 易于添加新品牌
 */

// 品牌标识符常量
export const BRAND_IDS = {
  ADVANCE: 'ADVANCE',
  CHONGCHI: 'CHONGCHI',
  NGC: 'NGC',
  ZF_MARINE: 'ZF_MARINE'
};

// 默认品牌 (保持向后兼容)
export const DEFAULT_BRAND = BRAND_IDS.ADVANCE;

// 品牌详细配置
export const BRAND_CONFIG = {
  [BRAND_IDS.ADVANCE]: {
    id: BRAND_IDS.ADVANCE,
    name: '杭州前进齿轮箱集团',
    nameEN: 'Hangzhou Advance Gearbox Group',
    shortName: '杭齿/前进',
    shortNameEN: 'Advance',
    country: 'CN',
    stockCode: '601177',
    website: 'http://www.advance-gearbox.com',
    founded: 1960,
    logo: '/images/brands/advance-logo.png',

    // 产品系列
    series: ['HC', 'HCD', 'HCM', 'HCQ', 'HCT', 'HCA', 'HCV', 'GW', 'GC', 'DT', 'MA', 'MB', 'MV'],

    // 功率覆盖范围
    powerRange: {
      min: 10,      // kW
      max: 4000,    // kW
      unit: 'kW'
    },

    // 混合动力支持
    hybridSupport: {
      available: true,
      modes: ['PTO', 'PTI', 'PTH'],
      status: 'estimated',  // estimated / confirmed / not_available
      note: '基于2024年8月发布的机电一体化系统推算'
    },

    // 认证资质
    certifications: ['CCS', 'BV', 'DNV', 'LR', 'ABS', 'NK', 'KR'],

    // 特色功能
    features: [
      '5G远程监控',
      'EMS能量管理',
      'PMS功率分配',
      '机电一体化设计'
    ],

    // 市场定位
    positioning: {
      segment: 'mid-range',     // budget / mid-range / premium
      mainMarket: '中国沿海及内河船舶',
      exportMarkets: ['东南亚', '非洲', '南美'],
      competitiveAdvantage: '性价比高，本土服务网络完善'
    },

    // 数据来源标记
    dataSource: 'primary',  // primary / imported / estimated
    dataVersion: '2025.12',

    // 是否为当前系统主品牌
    isPrimary: true
  },

  [BRAND_IDS.CHONGCHI]: {
    id: BRAND_IDS.CHONGCHI,
    name: '重庆齿轮箱有限责任公司',
    nameEN: 'Chongqing Gearbox Co., Ltd.',
    shortName: '重齿',
    shortNameEN: 'CGBX',
    country: 'CN',
    stockCode: null,  // 中船集团子公司
    website: 'http://www.chongchi.com',
    founded: 1966,
    logo: '/images/brands/chongchi-logo.png',
    parent: '中国船舶集团有限公司(CSSC)',

    // 产品系列 - 来源: 德国LOHMANN引进技术
    // GW系列: 传统船用齿轮箱
    // GC系列: 一级/二级减速齿轮箱 (部分支持PTO/PTI)
    series: [
      // GW系列 (传统船用)
      'GWC', 'GWL', 'GWS', 'GWH', 'GWD', 'GWK',
      'GW6675', 'GW7085', 'GW7590', 'GW8095', 'GW85100',
      // GC系列 (一级/二级减速，部分支持PTO/PTI)
      'GCS', 'GCD', 'GCH', 'GCC', 'GCST'
    ],

    // 功率覆盖范围 - 来源: 官网数据 (最大超过10000kW)
    powerRange: {
      min: 150,       // 基于输出转速150-2000 rpm范围
      max: 10000,     // 官网确认: 最大传递功率超过10000kW
      unit: 'kW'
    },

    // 传递能力参数 - 来源: 行业资料
    transmissionCapacity: {
      min: 0.257,     // kW/r/min - GCC系列最小
      max: 35.429,    // kW/r/min - GW族系最大传递能力
      unit: 'kW/(r/min)'
    },

    // 速比范围
    ratioRange: {
      min: 1.94,
      max: 7.48
    },

    // GC系列详细参数 (2026-01-04 官网数据更新)
    gcSeries: {
      GCS: { ratioRange: [2, 4], capacity: [0.537, 12.063], pto: true, pti: false, config: '垂直异心', stages: 1 },
      GCD: { ratioRange: [2, 4], capacity: [0.537, 12.063], pto: true, pti: false, config: '水平异心', stages: 1 },
      GCH: { ratioRange: [2, 4], capacity: [0.537, 12.063], pto: true, pti: false, config: '水平异心', stages: 1 },
      GCST: { ratioRange: [4, 6], capacity: [3.446, 6.99], pto: true, pti: true, config: '垂直异心', stages: 1 },
      GCC: { ratioRange: [2, 6], capacity: [0.257, 19.101], pto: true, pti: false, config: '二级减速', stages: 2 }
    },

    // 混合动力支持 - 2026-01-04更新: GCST系列支持PTI/PTO
    hybridSupport: {
      available: true,  // GCST系列支持混动
      modes: ['PTO', 'PTI'],
      status: 'confirmed',
      note: 'GCST系列支持PTI/PTO，GCS/GCD/GCH/GCC支持PTO驱动消防泵/发电机',
      hybridSeries: ['GCST'],  // 明确支持混动的系列
      ptoOnlySeries: ['GCS', 'GCD', 'GCH', 'GCC']  // 仅支持PTO的系列
    },

    // 认证资质 - 来源: 官网
    certifications: ['CCS', 'BV', 'DNV', 'LR', 'ABS', 'NK'],

    // 特色功能
    features: [
      '大功率船用减速器 (10000kW+)',
      '德国LOHMANN引进技术',
      '国内大功率市场占有率80%',
      '硬齿面齿轮专业制造',
      'GCST系列支持PTI/PTO混动',
      'GC系列可配置功率分支输出(消防泵/货油泵/发电机)'
    ],

    // 市场定位
    positioning: {
      segment: 'mid-range',
      mainMarket: '大型散货船、远洋渔船、油轮',
      exportMarkets: ['东南亚', '非洲'],
      competitiveAdvantage: '大功率产品技术领先，国内80%市场份额'
    },

    // 数据来源标记
    dataSource: 'imported',  // 从官网爬取
    dataVersion: '2026.01.04',

    isPrimary: false
  },

  [BRAND_IDS.NGC]: {
    id: BRAND_IDS.NGC,
    name: '南京高精船用设备有限公司',
    nameEN: 'Nanjing High Accurate Marine Equipment Co., Ltd.',
    shortName: '南高齿船用',
    shortNameEN: 'NGC Marine',
    country: 'CN',
    stockCode: '600885',  // 母公司中国传动上市代码
    website: 'http://www.ngc-marine.com',
    founded: 2007,  // 船用公司独立成立年份
    logo: '/images/brands/ngc-logo.png',
    parent: '中国传动集团 (China Transmission)',

    // 产品系列 - 来源: NGC Marine官网
    series: [
      'CK',     // 可调桨齿轮箱 (CKV/CKH/CKTS)
      'CG',     // 固定桨齿轮箱 (CGC/CGS/CGD/CGH/CGL/CGK)
      'NCP',    // 可调桨推进系统
      'NRP',    // 舵桨推进器
      'NEPod',  // 电动吊舱推进系统
      'NFT',    // 侧向推进器
      'NCT',    // 隧道推进器
      'FP'      // 消防泵齿轮箱
    ],

    // 功率覆盖范围 - 来源: CK系列规格
    powerRange: {
      min: 500,       // 估算最小功率
      max: 17000,     // CK系列最大传递功率
      unit: 'kW'
    },

    // 传递能力参数 - 来源: CK系列规格
    transmissionCapacity: {
      min: 5,         // 估算
      max: 50,        // CK系列最大传递能力 50kW/rpm
      unit: 'kW/(r/min)'
    },

    // 推力能力
    thrustCapacity: {
      max: 1850,      // CK系列最大推力 1850kN
      unit: 'kN'
    },

    // 混合动力支持 - 来源: CK系列规格明确支持PTO/PTI
    hybridSupport: {
      available: true,
      modes: ['PTO', 'PTI'],
      status: 'confirmed',
      note: 'CK系列支持PTO/PTI功能，适用于不可逆柴油机'
    },

    // 认证资质 - 来源: 官网
    certifications: ['CCS', 'DNV', 'LR', 'BV', 'ABS', 'NK', 'KR'],

    // 特色功能
    features: [
      'CK系列可调桨齿轮箱 (PTO/PTI)',
      'CG系列大功率固定桨齿轮箱',
      'NEPod电动吊舱推进系统',
      '挖泥船动力传动系统',
      '50年传动装备研制经验'
    ],

    // 市场定位
    positioning: {
      segment: 'premium',
      mainMarket: '高技术船舶、海工平台、挖泥船',
      exportMarkets: ['欧洲', '东南亚', '中东'],
      competitiveAdvantage: '大功率CPP系统、完整推进解决方案'
    },

    // 数据来源标记
    dataSource: 'imported',  // 从官网爬取
    dataVersion: '2026.01',

    isPrimary: false
  },

  [BRAND_IDS.ZF_MARINE]: {
    id: BRAND_IDS.ZF_MARINE,
    name: 'ZF Friedrichshafen AG Marine',
    nameEN: 'ZF Friedrichshafen AG Marine',
    shortName: 'ZF Marine',
    shortNameEN: 'ZF Marine',
    country: 'DE',
    stockCode: null,  // 非上市，家族企业
    website: 'https://www.zf.com/products/en/marine/',
    founded: 1915,
    logo: '/images/brands/zf-marine-logo.png',

    // 产品系列 - 来源: ZF官网 (2026-01-04 完整更新)
    series: [
      // 小型机械换向 (10-1500 HP)
      'ZF 12M', 'ZF 15M', 'ZF 15MA', 'ZF 15MIV', 'ZF 25M', 'ZF 25MA', 'ZF 30M',
      // 小型液压换向
      'ZF 25', 'ZF 25A', 'ZF 45-1', 'ZF 45A', 'ZF 45C',
      // 中型液压
      'ZF 63', 'ZF 68', 'ZF 85A', 'ZF 90TS', 'ZF 115IVTS',
      // 高性能系列
      'ZF 220', 'ZF 280', 'ZF 286', 'ZF 301', 'ZF 325', 'ZF 360', 'ZF 400', 'ZF 500', 'ZF 550', 'ZF 665',
      // 商用重载系列
      'ZF W220', 'ZF W320', 'ZF W325', 'ZF W340', 'ZF W350-1', 'ZF W650',
      // 大型商用
      'ZF 2000', 'ZF 2050', 'ZF 2150', 'ZF 3000', 'ZF 5000', 'ZF 8000', 'ZF 9000 A', 'ZF 9000 V',
      // PTI混动专用系列
      'ZF 3200 A PTI', 'ZF 3200 V PTI', 'ZF 3300 PTI', 'ZF 5200 A PTI', 'ZF 3000 NRD PTI', 'ZF 8300 PTI'
    ],

    // 产品分类索引 (2026-01-04 新增)
    modelIndex: {
      mechanical: ['ZF 12M', 'ZF 15M', 'ZF 15MA', 'ZF 15MIV', 'ZF 25M', 'ZF 25MA', 'ZF 30M'],
      hydraulic: ['ZF 25', 'ZF 25A', 'ZF 45-1', 'ZF 45A', 'ZF 45C'],
      midRange: ['ZF 63', 'ZF 68', 'ZF 85A', 'ZF 90TS', 'ZF 115IVTS'],
      highPerformance: ['ZF 220', 'ZF 280', 'ZF 286', 'ZF 301', 'ZF 325', 'ZF 360', 'ZF 400', 'ZF 500', 'ZF 550', 'ZF 665'],
      commercial: ['ZF W220', 'ZF W320', 'ZF W325', 'ZF W340', 'ZF W350-1', 'ZF W650'],
      large: ['ZF 2000', 'ZF 2050', 'ZF 2150', 'ZF 3000', 'ZF 5000', 'ZF 8000', 'ZF 9000 A', 'ZF 9000 V'],
      hybrid: ['ZF 3200 A PTI', 'ZF 3200 V PTI', 'ZF 3300 PTI', 'ZF 5200 A PTI', 'ZF 3000 NRD PTI', 'ZF 8300 PTI']
    },

    // 功率覆盖范围 - 来源: 官网确认 (2026-01-04 更新: 从10kW起)
    powerRange: {
      min: 10,            // ZF 12M系列最小 (~10 HP = ~7.5 kW)
      max: 12000,         // ZF 8300系列最大功率
      unit: 'kW'
    },

    // PTI混动型号详细参数 (2026-01-04 扩展)
    hybridModels: {
      'ZF 3300 PTI': {
        powerRange: { min: 600, max: 1200 },
        note: '并车混动配置'
      },
      'ZF 3200 A PTI': {
        powerRange: { min: 1295, max: 1940 },
        ratioRange: { main: { min: 1.351, max: 3.444 }, pti: { min: 1.892, max: 4.240 } },
        ptiPower: 500,    // kW
        torque: { main: 7560, pti: 1500 },  // Nm
        note: '紧凑型铝壳体，适合快艇/游艇'
      },
      'ZF 3200 V PTI': {
        powerRange: { min: 1295, max: 1940 },
        ratioRange: { min: 2.588, max: 4.250 },
        note: 'V驱动配置'
      },
      'ZF 5200 A PTI': {
        powerRange: { min: 1500, max: 2463 },
        ratioRange: { main: { min: 2.588, max: 4.250 }, pti: { min: 2.588, max: 13.813 } },
        note: '可A/V两种安装方式，适合快船/渡轮'
      },
      'ZF 3000 NRD PTI': {
        powerRange: { min: 1000, max: 1940 },
        ptiPower: 250,    // kW
        torque: { pti: 1500 },  // Nm
        ratioRange: { min: 1.093, max: 2.952 },
        note: '喷水推进专用'
      },
      'ZF 8300 PTI': {
        powerRange: { min: 5000, max: 11500 },
        note: '大型船舶混动'
      }
    },

    // 混合动力支持 - 来源: 官网确认
    hybridSupport: {
      available: true,
      modes: ['PTO', 'PTI', 'PTH'],
      status: 'confirmed',
      note: '全系列PTI支持，可选配电机+变频器完整系统'
    },

    // 支持的推进类型
    propulsionTypes: ['FPP', 'CPP', 'Waterjet'],

    // 认证资质
    certifications: ['DNV', 'LR', 'BV', 'ABS', 'CCS', 'NK', 'KR', 'RINA', 'GL'],

    // 特色功能
    features: [
      'PTI/PTO混动全系列覆盖 (600-11500 kW)',
      '功率覆盖10-12000 kW全范围',
      'ZF Connect远程监控平台',
      '数字孪生支持',
      '电机+变频器完整解决方案',
      '全球服务网络',
      '小型机械/液压/大型商用全覆盖'
    ],

    // 市场定位
    positioning: {
      segment: 'premium',
      mainMarket: '游艇、快艇、渡轮、政府船舶、巡逻船、大型商船',
      exportMarkets: ['全球'],
      competitiveAdvantage: '混动技术市场领先，完整系统解决方案，功率全覆盖'
    },

    // 数据来源标记
    dataSource: 'imported',  // 从官网爬取验证
    dataVersion: '2026.01.04',

    isPrimary: false
  }
};

// 品牌列表 (用于UI展示)
export const BRAND_LIST = Object.values(BRAND_CONFIG)
  .filter(brand => brand && brand.id)
  .map(brand => ({
    id: brand.id,
    name: brand.name,
    shortName: brand.shortName,
    shortNameEN: brand.shortNameEN,
    country: brand.country,
    isPrimary: brand.isPrimary,
    powerRange: brand.powerRange,
    hybridSupport: brand.hybridSupport?.available || false
  }));

// 按国家分组的品牌
export const BRANDS_BY_COUNTRY = {
  CN: [BRAND_IDS.ADVANCE, BRAND_IDS.CHONGCHI, BRAND_IDS.NGC],
  DE: [BRAND_IDS.ZF_MARINE]
};

// 支持混动的品牌
export const HYBRID_ENABLED_BRANDS = Object.values(BRAND_CONFIG)
  .filter(brand => brand.hybridSupport.available)
  .map(brand => brand.id);

// 品牌功率范围比较
export const BRAND_POWER_COMPARISON = Object.values(BRAND_CONFIG)
  .filter(brand => brand && brand.powerRange)
  .map(brand => ({
    id: brand.id,
    name: brand.shortName,
    minPower: brand.powerRange.min,
    maxPower: brand.powerRange.max
  })).sort((a, b) => a.maxPower - b.maxPower);

/**
 * 获取品牌配置
 * @param {string} brandId - 品牌标识符
 * @returns {Object|null} - 品牌配置对象
 */
export function getBrandConfig(brandId) {
  return BRAND_CONFIG[brandId] || null;
}

/**
 * 检查品牌是否支持混动
 * @param {string} brandId - 品牌标识符
 * @returns {boolean}
 */
export function isBrandHybridEnabled(brandId) {
  const brand = BRAND_CONFIG[brandId];
  return brand ? brand.hybridSupport.available : false;
}

/**
 * 获取品牌的混动模式
 * @param {string} brandId - 品牌标识符
 * @returns {string[]} - 支持的模式数组
 */
export function getBrandHybridModes(brandId) {
  const brand = BRAND_CONFIG[brandId];
  return brand ? brand.hybridSupport.modes : [];
}

/**
 * 根据功率范围筛选品牌
 * @param {number} power - 所需功率 (kW)
 * @returns {string[]} - 符合条件的品牌ID数组
 */
export function getBrandsForPower(power) {
  return Object.values(BRAND_CONFIG)
    .filter(brand => brand && brand.powerRange && power >= brand.powerRange.min && power <= brand.powerRange.max)
    .map(brand => brand.id);
}

/**
 * 品牌数据完整性检查
 * @param {string} brandId - 品牌标识符
 * @returns {Object} - 数据状态报告
 */
export function checkBrandDataStatus(brandId) {
  const brand = BRAND_CONFIG[brandId];
  if (!brand) {
    return { exists: false, status: 'not_found' };
  }

  return {
    exists: true,
    isPrimary: brand.isPrimary,
    dataSource: brand.dataSource,
    dataVersion: brand.dataVersion,
    status: brand.dataSource === 'primary' ? 'complete' :
            brand.dataSource === 'imported' ? 'partial' : 'estimated',
    hybridDataStatus: brand.hybridSupport.status
  };
}

// 导出默认配置
export default {
  BRAND_IDS,
  DEFAULT_BRAND,
  BRAND_CONFIG,
  BRAND_LIST,
  BRANDS_BY_COUNTRY,
  HYBRID_ENABLED_BRANDS,
  BRAND_POWER_COMPARISON,
  getBrandConfig,
  isBrandHybridEnabled,
  getBrandHybridModes,
  getBrandsForPower,
  checkBrandDataStatus
};
