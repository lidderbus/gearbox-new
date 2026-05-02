// src/utils/engineDatabaseUtils.js
// 柴油机数据库 helper API — B1 投产前外部数据融合
// 提供搜索 / 单条查询 / 工况点查询 / 选型表单适配

import {
  marineEngines,
  enginesById,
  enginesByBrand,
  availableBrands,
  calcRatedTorque_Nm
} from '../data/marineEngineDatabase';

/**
 * 根据 id 查询柴油机
 * @param {string} id
 * @returns {object|null}
 */
export const getEngineById = (id) => {
  if (!id) return null;
  return enginesById[id] || null;
};

/**
 * 关键字搜索 (品牌 / 系列 / 型号 / 应用类型, 大小写不敏感)
 * 返回最多 maxResults 条, 按 confidence A>B>C 排序
 * @param {string} query
 * @param {{ brand?: string, applicationType?: string, maxResults?: number }} [opts]
 */
export const searchEngines = (query, opts = {}) => {
  const { brand, applicationType, maxResults = 50 } = opts;
  const q = (query || '').trim().toLowerCase();
  let pool = marineEngines;
  if (brand && brand !== '无要求' && brand !== 'all') {
    pool = pool.filter(e => e.brand.toLowerCase() === brand.toLowerCase());
  }
  if (applicationType) {
    pool = pool.filter(e => e.applicationTypes.includes(applicationType));
  }
  if (q) {
    pool = pool.filter(e => {
      return (
        e.brand.toLowerCase().includes(q) ||
        e.series.toLowerCase().includes(q) ||
        e.model.toLowerCase().includes(q) ||
        e.id.toLowerCase().includes(q)
      );
    });
  }
  const confidenceOrder = { A: 0, B: 1, C: 2 };
  return pool
    .slice()
    .sort((a, b) => {
      const ca = confidenceOrder[a.confidence] ?? 9;
      const cb = confidenceOrder[b.confidence] ?? 9;
      if (ca !== cb) return ca - cb;
      return a.brand.localeCompare(b.brand) || a.model.localeCompare(b.model);
    })
    .slice(0, maxResults);
};

/**
 * 在 torqueCurve 上线性插值, 返回该 rpm 工况下的 power_kW + sfc_g_kWh
 * @param {object} engine
 * @param {number} rpm
 * @returns {{ power_kW: number|null, sfc_g_kWh: number|null }}
 */
export const interpolateAtRpm = (engine, rpm) => {
  if (!engine || !Array.isArray(engine.torqueCurve) || engine.torqueCurve.length === 0) {
    return { power_kW: null, sfc_g_kWh: null };
  }
  const points = engine.torqueCurve.slice().sort((a, b) => a.rpm - b.rpm);
  if (rpm <= points[0].rpm) return { power_kW: points[0].power_kW, sfc_g_kWh: points[0].sfc_g_kWh ?? null };
  if (rpm >= points[points.length - 1].rpm) {
    const last = points[points.length - 1];
    return { power_kW: last.power_kW, sfc_g_kWh: last.sfc_g_kWh ?? null };
  }
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    if (rpm >= a.rpm && rpm <= b.rpm) {
      const t = (rpm - a.rpm) / (b.rpm - a.rpm);
      const power = a.power_kW + (b.power_kW - a.power_kW) * t;
      const sfc = (a.sfc_g_kWh != null && b.sfc_g_kWh != null)
        ? a.sfc_g_kWh + (b.sfc_g_kWh - a.sfc_g_kWh) * t
        : null;
      return { power_kW: power, sfc_g_kWh: sfc };
    }
  }
  return { power_kW: null, sfc_g_kWh: null };
};

/**
 * 把柴油机转换为表单字段, 用于 EngineInfoSection Autocomplete 自动填充
 * 返回的字段会 merge 到 formData
 * @param {object} engine
 * @returns {object}
 */
export const toFormFields = (engine) => {
  if (!engine) return {};
  return {
    engineBrand: engine.brand,
    engineModel: engine.model,
    motorPower: engine.ratedPower_kW,
    motorSpeed: engine.ratedSpeed_rpm,
    engineTorque: calcRatedTorque_Nm(engine.ratedPower_kW, engine.ratedSpeed_rpm),
    engineId: engine.id,
    engineDisplacement_L: engine.displacement_L ?? null,
    engineCylinders: engine.cylinders,
    engineEmissionTier: engine.emissionTier,
    engineWeight_kg: engine.weight_kg ?? null
  };
};

/**
 * 数据库容量统计 (供 KPI / 数据质量面板)
 */
export const getDatabaseStats = () => {
  const total = marineEngines.length;
  const byBrand = {};
  const byTier = {};
  const byConfidence = { A: 0, B: 0, C: 0 };
  marineEngines.forEach(e => {
    byBrand[e.brand] = (byBrand[e.brand] || 0) + 1;
    byTier[e.emissionTier] = (byTier[e.emissionTier] || 0) + 1;
    byConfidence[e.confidence] = (byConfidence[e.confidence] || 0) + 1;
  });
  return { total, byBrand, byTier, byConfidence };
};

export { availableBrands, enginesByBrand, calcRatedTorque_Nm };

const _exports = {
  getEngineById,
  searchEngines,
  interpolateAtRpm,
  toFormFields,
  getDatabaseStats,
  availableBrands,
  enginesByBrand,
  calcRatedTorque_Nm
};
export default _exports;
