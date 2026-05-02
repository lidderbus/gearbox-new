// src/utils/iceClassThrust.js
// P2#2 (2026-04-24): 冰级推力需求动态放大因子
// 参照 IACS URI 2 (Polar Class) 与 CCS 冰级入级规范:
//   冰区航行时, 螺旋桨与齿轮箱需承受冰块冲击,推力瞬时峰值可达常规工况 1.2-1.6 倍
// 实现策略: 不强制拒选,而是将用户给的 thrustRequirement 按等级放大,
// 后续算法照常进行 "推力是否满足" 判定 → 冰级项目自动更严格

/**
 * 冰级等级与推力需求放大因子 (乘在 thrustRequirement 上)
 * none / 无要求          → 1.0
 * ICE-3 / FSICR 1C       → 1.1
 * ICE-2 / FSICR 1B       → 1.2
 * ICE-1 / FSICR 1A       → 1.35
 * ICE-1A SUPER           → 1.5
 * PC6-7 (Polar)          → 1.5
 * PC3-5 (Polar)          → 1.7
 */
export const ICE_CLASS_THRUST_FACTOR = {
  'none': 1.0,
  'ICE-3': 1.1,
  'ICE-2': 1.2,
  'ICE-1': 1.35,
  'ICE-1A SUPER': 1.5,
  'PC6': 1.5,
  'PC7': 1.5,
  'PC5': 1.7,
  'PC4': 1.7,
  'PC3': 1.7
};

/**
 * 获取冰级对应的推力放大因子
 * @param {string} iceClass - 冰级标识 (可缺省/'none')
 * @returns {number}
 */
export function getIceClassThrustFactor(iceClass) {
  if (!iceClass) return 1.0;
  const key = String(iceClass).toUpperCase().replace(/\s+/g, ' ').trim();
  return ICE_CLASS_THRUST_FACTOR[key] || 1.0;
}

/**
 * 根据冰级调整推力需求
 * @param {number} thrustRequirement - 基础推力需求 (kN)
 * @param {string} iceClass - 冰级等级
 * @returns {{ adjustedThrust: number, factor: number, description: string }}
 */
export function adjustThrustForIceClass(thrustRequirement, iceClass) {
  const factor = getIceClassThrustFactor(iceClass);
  const adjustedThrust = (Number(thrustRequirement) || 0) * factor;
  let description = '无冰级要求';
  if (factor > 1) {
    description = `冰级 ${iceClass}: 推力需求放大 ${((factor - 1) * 100).toFixed(0)}% (${thrustRequirement}→${adjustedThrust.toFixed(1)}kN)`;
  }
  return { adjustedThrust, factor, description };
}

export default adjustThrustForIceClass;
