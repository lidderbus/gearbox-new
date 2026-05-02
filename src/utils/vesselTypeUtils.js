// src/utils/vesselTypeUtils.js
// 标准船型库 helper API — B3
//
// 与 propulsionMatchingSolver.js#VESSEL_TYPES (旧 8 类) 兼容: 通过 legacyKey 字段映射

import {
  standardVesselTypes,
  standardVesselTypesById,
  standardVesselTypesByCategory,
  vesselCategories
} from '../data/standardVesselTypes';

export { vesselCategories };

/**
 * 获取船型详细规格
 */
export const getVesselTypeById = (type) => {
  if (!type) return null;
  return standardVesselTypesById[type] || null;
};

/**
 * 按 category 列出
 */
export const listByCategory = (category) => {
  if (!category) return [];
  return standardVesselTypesByCategory[category] || [];
};

/**
 * Quick mode: 给定船型 → 推荐选型表单初值
 * 返回 { motorPower, motorSpeed, targetRatio, suggestedEngines[], thrust, vesselType, draft }
 */
export const toSelectionFormDefaults = (vesselTypeId) => {
  const v = getVesselTypeById(vesselTypeId);
  if (!v) return null;
  // motorPower 取 typicalEngineRange 中位
  const [pmin, pmax] = v.typicalEngineRange_kW;
  const motorPower = Math.round((pmin + pmax) / 2);
  // motorSpeed: 如果有 commonSetups, 倾向取常见主机额定 rpm; 否则用 1500 (中速默认)
  const motorSpeed = v.propulsion?.rpm?.typical
    ? Math.round(v.propulsion.rpm.typical * v.typicalGearboxRatio.typical)
    : 1500;
  return {
    vesselType: v.legacyKey || 'cargo',
    motorPower,
    motorSpeed,
    targetRatio: v.typicalGearboxRatio.typical,
    propellerSpeed_rpm: v.propulsion?.rpm?.typical,
    propellerDiameter_m: v.propulsion?.diameter_m?.typical,
    propellerType: v.propulsion?.type,
    propellerCount: v.propulsion?.count,
    draft_m: v.draft_m,
    displacement_t: v.displacement_t?.typical,
    designSpeed_kn: v.designSpeed_kn,
    serviceSpeed_kn: v.serviceSpeed_kn,
    suggestedEngines: v.commonSetups?.map(s => s.engine) || [],
    suggestedGearboxes: v.commonSetups?.map(s => s.gearbox) || [],
    nameZh: v.nameZh,
    nameEn: v.nameEn
  };
};

/**
 * 按工况(功率/转速)反向找适合的船型清单
 */
export const findVesselTypesByOperatingPoint = ({ power_kW, ratio }) => {
  if (!power_kW) return [];
  return standardVesselTypes
    .filter(v => {
      const [pmin, pmax] = v.typicalEngineRange_kW;
      const inPower = power_kW >= pmin * 0.8 && power_kW <= pmax * 1.2;
      if (!inPower) return false;
      if (ratio) {
        const [rmin, rmax] = v.typicalGearboxRatio.range;
        return ratio >= rmin * 0.85 && ratio <= rmax * 1.15;
      }
      return true;
    })
    .map(v => ({
      type: v.type,
      nameZh: v.nameZh,
      nameEn: v.nameEn,
      category: v.category,
      typicalEngineRange_kW: v.typicalEngineRange_kW,
      typicalGearboxRatio: v.typicalGearboxRatio
    }));
};

/**
 * 数据库统计
 */
export const getVesselDatabaseStats = () => {
  const byCategory = {};
  standardVesselTypes.forEach(v => {
    byCategory[v.category] = (byCategory[v.category] || 0) + 1;
  });
  return {
    total: standardVesselTypes.length,
    byCategory,
    categories: vesselCategories.length
  };
};

const _exports = {
  getVesselTypeById,
  listByCategory,
  toSelectionFormDefaults,
  findVesselTypesByOperatingPoint,
  getVesselDatabaseStats,
  vesselCategories
};
export default _exports;
