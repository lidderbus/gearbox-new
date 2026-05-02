// src/utils/foreignGearboxAnalysis.js
// 国外齿轮箱参数级匹配 + 三方对比工具 — B2 投产前外部数据融合

import {
  foreignGearboxes,
  foreignGearboxesById
} from '../data/foreignGearboxMapping';

const RATIO_TOLERANCE = 0.20;     // 速比容差 ±20%
const POWER_TOLERANCE = 0.25;     // 功率容差 ±25%
const SPEED_TOLERANCE = 0.20;     // 输入转速容差 ±20%

const matchRatio = (foreignRatios, target) => {
  if (!Array.isArray(foreignRatios) || foreignRatios.length === 0) return { hit: false, distance: Infinity };
  const closest = foreignRatios.reduce((best, r) => {
    const d = Math.abs(r - target);
    return d < best.d ? { d, ratio: r } : best;
  }, { d: Infinity, ratio: null });
  const tolerance = Math.abs(target) * RATIO_TOLERANCE;
  return { hit: closest.d <= tolerance, distance: closest.d, matched: closest.ratio };
};

const matchPower = (foreignPower, target) => {
  const tolerance = target * POWER_TOLERANCE;
  return { hit: Math.abs(foreignPower - target) <= tolerance, distance: Math.abs(foreignPower - target) };
};

const matchSpeed = (foreignSpeed, target) => {
  const tolerance = target * SPEED_TOLERANCE;
  return { hit: Math.abs(foreignSpeed - target) <= tolerance, distance: Math.abs(foreignSpeed - target) };
};

/**
 * 给定工况找海外齿轮箱候选
 * @param {{ power_kW: number, ratio: number, inputSpeed_rpm: number }} input
 * @param {{ brand?: string, maxResults?: number }} [opts]
 * @returns {Array<ForeignGearbox & { matchScore: number, matchDetails: object }>}
 */
export const findEquivalentForeign = (input, opts = {}) => {
  const { brand, maxResults = 8 } = opts;
  if (!input || !input.power_kW || !input.ratio || !input.inputSpeed_rpm) return [];
  let pool = foreignGearboxes;
  if (brand) pool = pool.filter(fg => fg.brand === brand);

  const scored = pool.map(fg => {
    const ratioMatch = matchRatio(fg.ratios, input.ratio);
    const powerMatch = matchPower(fg.power_kW, input.power_kW);
    const speedMatch = matchSpeed(fg.inputSpeed_rpm, input.inputSpeed_rpm);
    // 综合得分 0-100, 三维各占 1/3, 越接近越高
    const ratioScore = ratioMatch.hit ? 100 - Math.min(100, (ratioMatch.distance / input.ratio) * 200) : 0;
    const powerScore = powerMatch.hit ? 100 - Math.min(100, (powerMatch.distance / input.power_kW) * 200) : 0;
    const speedScore = speedMatch.hit ? 100 - Math.min(100, (speedMatch.distance / input.inputSpeed_rpm) * 200) : 0;
    const matchScore = (ratioScore + powerScore + speedScore) / 3;
    return {
      ...fg,
      matchScore: Math.round(matchScore * 10) / 10,
      matchDetails: { ratio: ratioMatch, power: powerMatch, speed: speedMatch }
    };
  });

  return scored
    .filter(s => s.matchScore > 0 && s.matchDetails.ratio.hit && s.matchDetails.power.hit && s.matchDetails.speed.hit)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxResults);
};

/**
 * 取价格中点 (USD), 用于对比
 */
export const priceMidpointUSD = (foreignGearbox, exchangeUSDperEUR = 1.08) => {
  const refPrice = foreignGearbox?.referencePrice;
  if (!refPrice) return null;
  if (refPrice.USD) return Math.round((refPrice.USD.min + refPrice.USD.max) / 2);
  if (refPrice.EUR) return Math.round((refPrice.EUR.min + refPrice.EUR.max) / 2 * exchangeUSDperEUR);
  return null;
};

/**
 * 性价比评分 — 杭齿与海外品牌
 * costPerformanceScore = (海外参考价 / 杭齿价) × (杭齿匹配度 / 海外匹配度)
 * 越高表示杭齿越具性价比
 */
export const calcCostPerformanceScore = ({ hangchiPrice, foreignPriceUSD, hangchiMatchScore = 90, foreignMatchScore = 80 }) => {
  if (!hangchiPrice || !foreignPriceUSD || hangchiPrice <= 0) return null;
  const priceRatio = foreignPriceUSD * 7.2 / hangchiPrice; // USD → CNY 粗换算
  const perfRatio = hangchiMatchScore / Math.max(1, foreignMatchScore);
  return Math.round(priceRatio * perfRatio * 100) / 100;
};

/**
 * 给定海外型号 id, 返回它对应的杭齿候选 (从 hangchiMatches 字段)
 */
export const getHangchiMatchesForForeign = (foreignId) => {
  const fg = foreignGearboxesById[foreignId];
  if (!fg) return [];
  return fg.hangchiMatches || [];
};

/**
 * 数据库统计
 */
export const getForeignDatabaseStats = () => {
  const byBrand = {};
  foreignGearboxes.forEach(fg => {
    byBrand[fg.brand] = (byBrand[fg.brand] || 0) + 1;
  });
  return {
    total: foreignGearboxes.length,
    byBrand
  };
};

const _exports = {
  findEquivalentForeign,
  priceMidpointUSD,
  calcCostPerformanceScore,
  getHangchiMatchesForForeign,
  getForeignDatabaseStats
};
export default _exports;
