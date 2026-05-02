// src/data/standardVesselTypes.js
// 标准船型库 — B3 投产前外部数据融合 (2026-05-02)
//
// 17 类标准船型 (国际航运标准 IHS Sea-web / Significant Ships 分类):
//   bulker (Handysize/Handymax/Panamax/Capesize)
//   container (Feeder/SubPanamax/Panamax/PostPanamax/ULCV)
//   tanker (LR1/LR2/Aframax/Suezmax/VLCC)
//   chemical · gasCarrier · roPax · tug · AHTS · PSV · workboat · fishing
//
// Schema: 每船型给出
//   loa (m), dwt (t), displacement (t), serviceSpeed (kn), designSpeed (kn),
//   cb (方形系数), propulsion {count, type FPP/CPP, diameter, rpm},
//   typicalEngineRange (kW), typicalGearboxRatio,
//   commonSetups[] (公开案例引用, 不暴露具体客户)
//
// 数据源: Significant Ships (RINA) + IHS Sea-web 公开年鉴 + 厂商 Project Guide
// 与 propulsionMatchingSolver.js#VESSEL_TYPES 兼容: legacyKey 字段提供旧键映射

export const VESSEL_TYPES_VERSION = '1.0.0';
export const VESSEL_TYPES_LAST_UPDATED = '2026-05-02';

/**
 * @typedef {Object} CommonSetup
 * @property {string} engine                示例主机 (公开)
 * @property {string} gearbox               杭齿型号建议
 * @property {number} ratio
 * @property {string} [source]              数据出处
 */

/**
 * @typedef {Object} StandardVesselType
 * @property {string} type
 * @property {string} category               bulker | container | tanker | gasCarrier | chemical | roPax | tug | AHTS | PSV | workboat | fishing
 * @property {string} segment                如 capesize / ulcv / vlcc
 * @property {string} nameZh
 * @property {string} nameEn
 * @property {{ typical_m: number, range: [number, number] }} loa
 * @property {{ typical_t: number, range: [number, number] }} dwt
 * @property {{ typical: number }} displacement_t
 * @property {number} serviceSpeed_kn
 * @property {number} designSpeed_kn
 * @property {number} cb
 * @property {number} draft_m
 * @property {Object} propulsion
 * @property {number[]} typicalEngineRange_kW
 * @property {{ range: [number, number], typical: number }} typicalGearboxRatio
 * @property {CommonSetup[]} commonSetups
 * @property {string} legacyKey              对应旧 propulsionMatchingSolver VESSEL_TYPES 的键
 * @property {string} dataSource
 */

export const standardVesselTypes = /** @type {StandardVesselType[]} */ ([

  // ==================== Bulk Carrier (散货船) ====================
  {
    type: 'bulker_handysize',
    category: 'bulker',
    segment: 'handysize',
    nameZh: '灵便型散货船', nameEn: 'Handysize Bulk Carrier',
    loa: { typical_m: 175, range: [150, 200] },
    dwt: { typical_t: 35000, range: [25000, 40000] },
    displacement_t: { typical: 45000 },
    serviceSpeed_kn: 13.5, designSpeed_kn: 14.5,
    cb: 0.82, draft_m: 9.5,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 5.8, range: [5.5, 6.0] }, rpm: { typical: 110, range: [100, 120] } },
    typicalEngineRange_kW: [4500, 7500],
    typicalGearboxRatio: { range: [3.5, 5.0], typical: 4.2 },
    commonSetups: [
      { engine: 'MAN 5S40ME-B9', gearbox: 'GW650', ratio: 4.0, source: 'Significant Ships 2022' },
      { engine: 'Wartsila W31 6L', gearbox: 'HCT2700', ratio: 4.5, source: 'IHS Sea-web 公开样本' }
    ],
    legacyKey: 'cargo',
    dataSource: 'Significant Ships 2022 / IHS Sea-web'
  },
  {
    type: 'bulker_handymax',
    category: 'bulker',
    segment: 'handymax',
    nameZh: '大灵便型散货船', nameEn: 'Handymax / Supramax Bulk Carrier',
    loa: { typical_m: 195, range: [180, 210] },
    dwt: { typical_t: 56000, range: [40000, 65000] },
    displacement_t: { typical: 70000 },
    serviceSpeed_kn: 14.0, designSpeed_kn: 14.5,
    cb: 0.84, draft_m: 12.0,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 6.5, range: [6.2, 7.0] }, rpm: { typical: 105, range: [95, 115] } },
    typicalEngineRange_kW: [7500, 10000],
    typicalGearboxRatio: { range: [3.8, 5.2], typical: 4.5 },
    commonSetups: [
      { engine: 'MAN 6S50ME-C', gearbox: 'GW900', ratio: 4.5, source: 'Significant Ships 2022' }
    ],
    legacyKey: 'cargo',
    dataSource: 'Significant Ships 2022'
  },
  {
    type: 'bulker_panamax',
    category: 'bulker',
    segment: 'panamax',
    nameZh: '巴拿马型散货船', nameEn: 'Panamax Bulk Carrier',
    loa: { typical_m: 225, range: [200, 230] },
    dwt: { typical_t: 76000, range: [65000, 80000] },
    displacement_t: { typical: 95000 },
    serviceSpeed_kn: 14.0, designSpeed_kn: 14.5,
    cb: 0.85, draft_m: 13.0,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 7.0, range: [6.8, 7.5] }, rpm: { typical: 100, range: [90, 110] } },
    typicalEngineRange_kW: [9500, 12500],
    typicalGearboxRatio: { range: [4.0, 5.5], typical: 4.7 },
    commonSetups: [
      { engine: 'MAN 6S60ME-C', gearbox: 'GW1100', ratio: 4.7, source: '公开样本' }
    ],
    legacyKey: 'cargo',
    dataSource: 'Significant Ships 2022'
  },
  {
    type: 'bulker_capesize',
    category: 'bulker',
    segment: 'capesize',
    nameZh: '好望角型散货船', nameEn: 'Capesize Bulk Carrier',
    loa: { typical_m: 290, range: [270, 320] },
    dwt: { typical_t: 180000, range: [150000, 210000] },
    displacement_t: { typical: 200000 },
    serviceSpeed_kn: 14.5, designSpeed_kn: 15.0,
    cb: 0.85, draft_m: 18.0,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 8.5, range: [7.5, 9.5] }, rpm: { typical: 95, range: [85, 105] } },
    typicalEngineRange_kW: [16000, 21000],
    typicalGearboxRatio: { range: [4.0, 5.5], typical: 4.7 },
    commonSetups: [
      { engine: 'MAN 6S70ME-C8.5', gearbox: 'HCT3300', ratio: 4.5, source: 'Significant Ships 2021' }
    ],
    legacyKey: 'cargo',
    dataSource: 'Significant Ships 2021-2023'
  },

  // ==================== Container Ship (集装箱船) ====================
  {
    type: 'container_feeder',
    category: 'container',
    segment: 'feeder',
    nameZh: '支线集装箱船', nameEn: 'Feeder Container Ship (1000-3000 TEU)',
    loa: { typical_m: 200, range: [170, 220] },
    dwt: { typical_t: 35000, range: [20000, 45000] },
    displacement_t: { typical: 45000 },
    serviceSpeed_kn: 19.0, designSpeed_kn: 20.0,
    cb: 0.66, draft_m: 11.5,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 6.5, range: [6.0, 7.0] }, rpm: { typical: 130, range: [115, 145] } },
    typicalEngineRange_kW: [10000, 14000],
    typicalGearboxRatio: { range: [3.5, 4.5], typical: 4.0 },
    commonSetups: [
      { engine: 'MAN 7S50ME-C', gearbox: 'HCT2700', ratio: 4.0, source: 'Significant Ships 2022' }
    ],
    legacyKey: 'cargo',
    dataSource: 'IHS Sea-web 公开样本'
  },
  {
    type: 'container_panamax',
    category: 'container',
    segment: 'panamax',
    nameZh: '巴拿马型集装箱船', nameEn: 'Panamax Container Ship (4000-5000 TEU)',
    loa: { typical_m: 290, range: [275, 295] },
    dwt: { typical_t: 65000, range: [55000, 75000] },
    displacement_t: { typical: 80000 },
    serviceSpeed_kn: 23.0, designSpeed_kn: 24.0,
    cb: 0.62, draft_m: 13.5,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 8.0, range: [7.5, 8.5] }, rpm: { typical: 105, range: [95, 115] } },
    typicalEngineRange_kW: [35000, 50000],
    typicalGearboxRatio: { range: [4.5, 5.5], typical: 5.0 },
    commonSetups: [
      { engine: 'MAN 8K90ME-C', gearbox: 'GW1500', ratio: 5.0, source: '公开样本' }
    ],
    legacyKey: 'cargo',
    dataSource: 'Significant Ships 2021'
  },
  {
    type: 'container_ulcv',
    category: 'container',
    segment: 'ulcv',
    nameZh: '超大型集装箱船', nameEn: 'ULCV Container Ship (18000+ TEU)',
    loa: { typical_m: 400, range: [380, 420] },
    dwt: { typical_t: 200000, range: [180000, 230000] },
    displacement_t: { typical: 240000 },
    serviceSpeed_kn: 22.0, designSpeed_kn: 23.0,
    cb: 0.66, draft_m: 16.0,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 10.0, range: [9.5, 10.5] }, rpm: { typical: 80, range: [75, 90] } },
    typicalEngineRange_kW: [60000, 80000],
    typicalGearboxRatio: { range: [5.0, 6.5], typical: 5.7 },
    commonSetups: [
      { engine: 'MAN G95ME-C9.5', gearbox: '直驱(无齿轮)', ratio: 1.0, source: 'Significant Ships 2020' }
    ],
    legacyKey: 'cargo',
    dataSource: 'Significant Ships 2020-2023'
  },

  // ==================== Tanker (油轮) ====================
  {
    type: 'tanker_aframax',
    category: 'tanker',
    segment: 'aframax',
    nameZh: '阿芙拉型油轮', nameEn: 'Aframax Tanker',
    loa: { typical_m: 245, range: [230, 250] },
    dwt: { typical_t: 110000, range: [80000, 120000] },
    displacement_t: { typical: 130000 },
    serviceSpeed_kn: 14.5, designSpeed_kn: 15.0,
    cb: 0.83, draft_m: 14.0,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 7.5, range: [7.0, 8.0] }, rpm: { typical: 95, range: [85, 105] } },
    typicalEngineRange_kW: [12500, 16000],
    typicalGearboxRatio: { range: [4.2, 5.5], typical: 4.7 },
    commonSetups: [
      { engine: 'MAN 6S60ME-C8.5', gearbox: 'HCT2700', ratio: 4.5, source: 'Significant Ships 2022' }
    ],
    legacyKey: 'oil',
    dataSource: 'Significant Ships 2022'
  },
  {
    type: 'tanker_suezmax',
    category: 'tanker',
    segment: 'suezmax',
    nameZh: '苏伊士型油轮', nameEn: 'Suezmax Tanker',
    loa: { typical_m: 275, range: [260, 285] },
    dwt: { typical_t: 158000, range: [140000, 170000] },
    displacement_t: { typical: 185000 },
    serviceSpeed_kn: 14.5, designSpeed_kn: 15.0,
    cb: 0.83, draft_m: 16.0,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 8.2, range: [7.8, 8.8] }, rpm: { typical: 90, range: [80, 100] } },
    typicalEngineRange_kW: [16000, 20000],
    typicalGearboxRatio: { range: [4.2, 5.5], typical: 4.8 },
    commonSetups: [
      { engine: 'MAN 6S70ME-C8.5', gearbox: 'GW1300', ratio: 4.8, source: 'Significant Ships 2021' }
    ],
    legacyKey: 'oil',
    dataSource: 'Significant Ships 2021'
  },
  {
    type: 'tanker_vlcc',
    category: 'tanker',
    segment: 'vlcc',
    nameZh: '超大型油轮 VLCC', nameEn: 'VLCC Tanker',
    loa: { typical_m: 333, range: [320, 360] },
    dwt: { typical_t: 320000, range: [280000, 350000] },
    displacement_t: { typical: 350000 },
    serviceSpeed_kn: 15.0, designSpeed_kn: 16.0,
    cb: 0.84, draft_m: 22.5,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 10.0, range: [9.5, 10.5] }, rpm: { typical: 75, range: [70, 80] } },
    typicalEngineRange_kW: [25000, 32000],
    typicalGearboxRatio: { range: [4.5, 6.0], typical: 5.0 },
    commonSetups: [
      { engine: 'MAN 7G80ME-C', gearbox: '直驱', ratio: 1.0, source: 'Significant Ships 2020' }
    ],
    legacyKey: 'oil',
    dataSource: 'Significant Ships 2020-2022'
  },

  // ==================== Specialized ====================
  {
    type: 'gas_carrier_lng',
    category: 'gasCarrier',
    segment: 'lng_large',
    nameZh: 'LNG 运输船', nameEn: 'LNG Carrier (174k m³)',
    loa: { typical_m: 295, range: [280, 305] },
    dwt: { typical_t: 95000, range: [85000, 105000] },
    displacement_t: { typical: 130000 },
    serviceSpeed_kn: 19.5, designSpeed_kn: 20.0,
    cb: 0.74, draft_m: 12.0,
    propulsion: { count: 2, type: 'CPP', diameter_m: { typical: 7.5, range: [7.0, 8.0] }, rpm: { typical: 90, range: [85, 100] } },
    typicalEngineRange_kW: [25000, 35000],
    typicalGearboxRatio: { range: [4.5, 6.0], typical: 5.2 },
    commonSetups: [
      { engine: 'Wartsila 12V50DF (双燃料)', gearbox: 'GW1100', ratio: 5.2, source: 'Significant Ships 2022' }
    ],
    legacyKey: 'cargo',
    dataSource: 'Significant Ships 2022'
  },
  {
    type: 'chemical_tanker',
    category: 'chemical',
    segment: 'medium',
    nameZh: '化学品船 (中型)', nameEn: 'Chemical Tanker (20-40k DWT)',
    loa: { typical_m: 175, range: [160, 195] },
    dwt: { typical_t: 30000, range: [20000, 40000] },
    displacement_t: { typical: 38000 },
    serviceSpeed_kn: 14.5, designSpeed_kn: 15.5,
    cb: 0.78, draft_m: 10.5,
    propulsion: { count: 1, type: 'FPP', diameter_m: { typical: 5.8, range: [5.5, 6.2] }, rpm: { typical: 115, range: [105, 125] } },
    typicalEngineRange_kW: [5500, 8500],
    typicalGearboxRatio: { range: [3.8, 5.0], typical: 4.3 },
    commonSetups: [
      { engine: 'MAN 6S40ME-B9', gearbox: 'HCT2300', ratio: 4.3, source: '公开样本' }
    ],
    legacyKey: 'oil',
    dataSource: 'IHS Sea-web 公开样本'
  },
  {
    type: 'ropax_ferry',
    category: 'roPax',
    segment: 'medium',
    nameZh: '客滚船 (中型渡轮)', nameEn: 'Ro-Pax Ferry (Medium)',
    loa: { typical_m: 175, range: [150, 200] },
    dwt: { typical_t: 8000, range: [6000, 10000] },
    displacement_t: { typical: 18000 },
    serviceSpeed_kn: 22.0, designSpeed_kn: 24.0,
    cb: 0.55, draft_m: 6.5,
    propulsion: { count: 2, type: 'CPP', diameter_m: { typical: 4.8, range: [4.5, 5.2] }, rpm: { typical: 175, range: [150, 200] } },
    typicalEngineRange_kW: [12000, 22000],
    typicalGearboxRatio: { range: [4.0, 6.0], typical: 5.0 },
    commonSetups: [
      { engine: 'Wartsila 9L46F', gearbox: 'HCT2700', ratio: 5.0, source: 'Significant Ships 2022' }
    ],
    legacyKey: 'passenger',
    dataSource: 'Significant Ships 2022'
  },

  // ==================== Workboat / Tug / AHTS / PSV ====================
  {
    type: 'tug_harbor',
    category: 'tug',
    segment: 'harbor_asd',
    nameZh: '港作 ASD 拖轮', nameEn: 'Harbor ASD Tug (60-80 t bollard pull)',
    loa: { typical_m: 32, range: [28, 38] },
    dwt: { typical_t: 250, range: [200, 350] },
    displacement_t: { typical: 600 },
    serviceSpeed_kn: 12.0, designSpeed_kn: 13.0,
    cb: 0.55, draft_m: 5.5,
    propulsion: { count: 2, type: 'Z-drive', diameter_m: { typical: 2.5, range: [2.3, 2.8] }, rpm: { typical: 220, range: [180, 260] } },
    typicalEngineRange_kW: [2000, 3500],
    typicalGearboxRatio: { range: [5.5, 7.5], typical: 6.5 },
    commonSetups: [
      { engine: 'Caterpillar 3516C', gearbox: 'GW400', ratio: 6.0, source: '公开样本' },
      { engine: 'MTU 16V4000 M73L', gearbox: 'HCT800', ratio: 6.5, source: '公开样本' }
    ],
    legacyKey: 'tug',
    dataSource: 'Damen Tug Catalog / 公开'
  },
  {
    type: 'ahts_dp2',
    category: 'AHTS',
    segment: 'medium',
    nameZh: 'AHTS 锚抛/起拖船', nameEn: 'Anchor Handling Tug Supply (Medium)',
    loa: { typical_m: 75, range: [65, 90] },
    dwt: { typical_t: 2000, range: [1500, 3000] },
    displacement_t: { typical: 4500 },
    serviceSpeed_kn: 14.0, designSpeed_kn: 16.0,
    cb: 0.62, draft_m: 6.5,
    propulsion: { count: 2, type: 'CPP', diameter_m: { typical: 3.4, range: [3.0, 3.8] }, rpm: { typical: 200, range: [180, 230] } },
    typicalEngineRange_kW: [4500, 8000],
    typicalGearboxRatio: { range: [5.0, 6.5], typical: 5.7 },
    commonSetups: [
      { engine: 'MTU 12V4000 M65', gearbox: 'HCT1100', ratio: 5.7, source: '公开样本' }
    ],
    legacyKey: 'ahts',
    dataSource: 'Damen / Ulstein 公开样本'
  },
  {
    type: 'psv_supply',
    category: 'PSV',
    segment: 'platform_supply',
    nameZh: '平台补给船 PSV', nameEn: 'Platform Supply Vessel',
    loa: { typical_m: 85, range: [70, 100] },
    dwt: { typical_t: 4000, range: [3000, 5000] },
    displacement_t: { typical: 6500 },
    serviceSpeed_kn: 14.0, designSpeed_kn: 15.5,
    cb: 0.68, draft_m: 6.0,
    propulsion: { count: 2, type: 'CPP', diameter_m: { typical: 3.0, range: [2.8, 3.4] }, rpm: { typical: 220, range: [200, 240] } },
    typicalEngineRange_kW: [3500, 6000],
    typicalGearboxRatio: { range: [4.5, 6.0], typical: 5.2 },
    commonSetups: [
      { engine: 'CAT 3512C HD', gearbox: 'HCT600', ratio: 5.2, source: '公开样本' }
    ],
    legacyKey: 'ahts',
    dataSource: 'Damen / 公开'
  },
  {
    type: 'fishing_trawler',
    category: 'fishing',
    segment: 'oceanic',
    nameZh: '远洋渔船', nameEn: 'Oceanic Fishing Trawler',
    loa: { typical_m: 60, range: [45, 80] },
    dwt: { typical_t: 800, range: [500, 1500] },
    displacement_t: { typical: 1800 },
    serviceSpeed_kn: 12.5, designSpeed_kn: 14.0,
    cb: 0.55, draft_m: 5.5,
    propulsion: { count: 1, type: 'CPP', diameter_m: { typical: 3.0, range: [2.5, 3.5] }, rpm: { typical: 250, range: [200, 300] } },
    typicalEngineRange_kW: [800, 2500],
    typicalGearboxRatio: { range: [4.5, 6.5], typical: 5.5 },
    commonSetups: [
      { engine: 'Yanmar 6EY26W', gearbox: 'HC600', ratio: 5.5, source: '公开样本' }
    ],
    legacyKey: 'fishing',
    dataSource: '公开'
  }
]);

// 索引: 按 type
export const standardVesselTypesById = Object.freeze(
  standardVesselTypes.reduce((acc, v) => { acc[v.type] = v; return acc; }, {})
);

// 索引: 按 category
export const standardVesselTypesByCategory = Object.freeze(
  standardVesselTypes.reduce((acc, v) => {
    if (!acc[v.category]) acc[v.category] = [];
    acc[v.category].push(v);
    return acc;
  }, {})
);

export const vesselCategories = Object.freeze(
  Array.from(new Set(standardVesselTypes.map(v => v.category))).sort()
);

const _exports = {
  VESSEL_TYPES_VERSION,
  VESSEL_TYPES_LAST_UPDATED,
  standardVesselTypes,
  standardVesselTypesById,
  standardVesselTypesByCategory,
  vesselCategories
};
export default _exports;
