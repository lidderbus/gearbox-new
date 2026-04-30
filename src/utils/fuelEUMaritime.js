// src/utils/fuelEUMaritime.js
// FuelEU Maritime — REGULATION (EU) 2023/1805 温室气体强度合规计算
// 适用 ≥5000 GT 商船, 自 2025-01-01 生效
// 参考: Annex II (GHG intensity per fuel) + Annex IV (penalty formula)

export const FUELEU_BASELINE_INTENSITY = 91.16;     // gCO2eq/MJ (2020 基准)
export const FUELEU_VLSFO_LHV = 41000;              // MJ/t VLSFO
export const FUELEU_PENALTY_PER_T_VLSFO = 2400;     // €/t VLSFO 当量 (Article 23)

/** 目标轨迹 (Article 4) */
export const FUELEU_TARGETS = [
  { from: 2025, to: 2029, reduction: 0.02,  limit: 89.34 },
  { from: 2030, to: 2034, reduction: 0.06,  limit: 85.69 },
  { from: 2035, to: 2039, reduction: 0.145, limit: 77.94 },
  { from: 2040, to: 2044, reduction: 0.31,  limit: 62.90 },
  { from: 2045, to: 2049, reduction: 0.62,  limit: 34.64 },
  { from: 2050, to: 2099, reduction: 0.80,  limit: 18.23 },
];

/** Annex II well-to-wake GHG 强度因子 (gCO2eq/MJ) */
export const FUELEU_WTW_INTENSITY = {
  HFO: 91.6, LFO: 91.4, MDO: 91.5, MGO: 91.5,
  LNG: 76.7, LPG: 75.5, METHANOL: 99.5, AMMONIA: 0,
};

/**
 * 查询给定年份的目标条目
 * @param {number} year
 * @returns {{from: number, to: number, reduction: number, limit: number}}
 */
export function getFuelEUTarget(year) {
  return FUELEU_TARGETS.find(t => year >= t.from && year <= t.to)
    || { limit: FUELEU_BASELINE_INTENSITY, reduction: 0, from: '—', to: '—' };
}

/**
 * 计算 FuelEU Maritime 合规
 *
 * @param {object} params
 * @param {number} params.year 船龄年份
 * @param {number} params.annualFuelTons 年燃油消耗 (吨)
 * @param {string} params.fuelType 燃油类型 (HFO/LFO/MDO/MGO/LNG/LPG/METHANOL/AMMONIA)
 * @param {number} [params.baselineCF] CO2 转换系数 (t CO2 / t fuel) — 用于回退估算
 * @param {number} [params.baselineLHV] 低热值 (MJ/kg) — 用于能量换算
 * @returns {object} { actualIntensity, targetLimit, deficitGCO2eq, excessVLSFOTons, penaltyEUR, compliant, ... }
 */
export function computeFuelEU({ year, annualFuelTons, fuelType, baselineCF, baselineLHV }) {
  // AMMONIA = 0 是合法零值, 必须用 ?? 而非 ||
  const actualIntensity = FUELEU_WTW_INTENSITY[fuelType]
    ?? (baselineCF && baselineLHV ? (baselineCF * 1000 / baselineLHV) * 1.13 : FUELEU_BASELINE_INTENSITY);
  const target = getFuelEUTarget(year);
  const annualEnergyMJ = (annualFuelTons || 0) * 1000 * (baselineLHV || 42.7);
  const deficitGCO2eq = (actualIntensity - target.limit) * annualEnergyMJ;
  const excessVLSFOTons = deficitGCO2eq > 0
    ? deficitGCO2eq / (FUELEU_VLSFO_LHV * FUELEU_BASELINE_INTENSITY)
    : 0;
  const penaltyEUR = Math.round(excessVLSFOTons * FUELEU_PENALTY_PER_T_VLSFO);
  return {
    year,
    actualIntensity,
    targetLimit: target.limit,
    targetReduction: target.reduction,
    targetWindow: `${target.from}-${target.to}`,
    annualEnergyMJ,
    deficitGCO2eq,
    excessVLSFOTons,
    penaltyEUR,
    compliant: deficitGCO2eq <= 0,
  };
}
