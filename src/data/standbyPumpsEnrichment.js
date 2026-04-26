// src/data/standbyPumpsEnrichment.js
// 备用泵参数补全 (additive metadata, 不修改 standbyPumps.js)
//
// 该文件以 series → 缺省值 + model → 覆盖值 两层结构表达。
// 在运行时由 pumpSelectionAlgorithm.formatPumpInfo() 合并到泵对象。
//
// 数据来源（典型值，可由数据库管理员补录）:
// - 2CY-D 机械泵: 由齿轮箱主泵驱动, 不含独立电机, 主要电气项 N/A
// - 2CYA 电动泵: 三相 380V/50Hz, 防护 IP55, 一般 Ex d IIB T4 防爆可选配
// - DT/2CYA-DT 大功率电推电动泵: 三相 380V/50Hz, IP55, NPSH 较高
// - SPF 螺杆泵: 三相 380V/50Hz, IP54

const SERIES_DEFAULTS = {
  '2CY-D': {
    voltage: null,
    frequency: null,
    phase: null,
    ipRating: null,
    exRating: null,
    npshRequired: 3.5,            // m, 典型机械齿轮泵
    oilViscosity: ['VG46', 'VG68'],
    certifications: ['CCS'],      // 默认 CCS 入级, 其余按订单
    drivenBy: '主齿轮箱传动',
    notes: '机械泵无独立电机, 电气参数不适用'
  },
  '2CY': {
    voltage: null,
    frequency: null,
    phase: null,
    ipRating: null,
    exRating: null,
    npshRequired: 3.0,
    oilViscosity: ['VG46', 'VG68'],
    certifications: ['CCS'],
    drivenBy: '主齿轮箱传动'
  },
  '2CYA': {
    voltage: '380V',
    frequency: '50Hz',
    phase: 3,
    ipRating: 'IP55',
    exRating: 'Ex d IIB T4 (可选)',
    npshRequired: 4.0,
    oilViscosity: ['VG46', 'VG68'],
    certifications: ['CCS', 'DNV'],
    drivenBy: '独立电机驱动'
  },
  'SPF': {
    voltage: '380V',
    frequency: '50Hz',
    phase: 3,
    ipRating: 'IP54',
    exRating: null,
    npshRequired: 5.0,
    oilViscosity: ['VG32', 'VG46'],
    certifications: ['CCS'],
    drivenBy: '独立电机驱动'
  }
};

// 个别型号覆盖（仅用于特殊规格）
const MODEL_OVERRIDES = {
  // 大流量 D 系列推荐 VG46 (低粘度更易启动)
  '2CY-48.2/2.5D': { oilViscosity: ['VG46'] },
  '2CY-58/2.5D':   { oilViscosity: ['VG46'] },
  // 高压 2CY25/6.3
  '2CY25/6.3':     { oilViscosity: ['VG68'], npshRequired: 4.5 }
};

/**
 * 获取指定泵型号的补全字段
 * @param {string} model - 泵型号
 * @param {string} series - 泵系列
 * @returns {Object} 补全字段对象 (永远返回非 null)
 */
export const getPumpEnrichment = (model, series) => {
  const seriesDefault = SERIES_DEFAULTS[series] || {};
  const modelOverride = MODEL_OVERRIDES[model] || {};
  const merged = {
    ...seriesDefault,
    ...modelOverride
  };
  // 完整度标记（用于 UI 展示置信度）
  const totalFields = ['voltage', 'frequency', 'phase', 'ipRating', 'exRating', 'npshRequired', 'oilViscosity', 'certifications'];
  const filled = totalFields.filter(f => merged[f] != null && merged[f] !== '').length;
  merged.dataCompleteness = filled === totalFields.length ? 'full' : filled === 0 ? 'empty' : 'partial';
  return merged;
};

/**
 * 批量列举系列默认（供 UI 调试展示用）
 */
export const getAllSeriesDefaults = () => SERIES_DEFAULTS;

export default {
  getPumpEnrichment,
  getAllSeriesDefaults,
  SERIES_DEFAULTS,
  MODEL_OVERRIDES
};
