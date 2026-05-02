// src/utils/propulsionMatchingSolver.js
// P1-1: 系统级匹配求解器 — 输入船型/排水量/航速/吃水, 输出桨直径/盘面比/减速比/桨型推荐
//
// 设计原则:
//   - 工程估算级 (符合早期可研阶段精度), 不替代专业 CFD/水池试验
//   - 公式来源在 JSDoc 标注, 与 P0-2 公式溯源约定一致
//   - 默认走 Wageningen B 系列开式桨; 拖轮/AHTS/推船切到 Ka-19A 导管桨

import { calculatePerformance } from '../data/propellerSeriesDB';
import { calculateOpenWaterPerformance_ITTC } from './cppHydrodynamics';

/**
 * 船型快速参数表 — 用于初值估算
 * 每种船型给出: 典型阻力系数 Cr*1000 (vs Fn 关系不需要, 这里用经验值)
 *               推荐桨叶数, 默认伴流分数 w, 推力减额 t, 桨型偏好
 */
export const VESSEL_TYPES = {
  cargo:     { label: '货船',   blades: 4, w: 0.30, t: 0.20, prefer: 'WAGENINGEN_B', appR2D: 0.65 },
  fishing:   { label: '渔船',   blades: 4, w: 0.25, t: 0.18, prefer: 'WAGENINGEN_B', appR2D: 0.62 },
  tug:       { label: '拖轮',   blades: 4, w: 0.18, t: 0.10, prefer: 'KA_19A',       appR2D: 0.70 }, // 大盘面比 + 导管
  ahts:      { label: 'AHTS/工作船', blades: 4, w: 0.20, t: 0.12, prefer: 'KA_19A',  appR2D: 0.68 },
  pusher:    { label: '推船',   blades: 4, w: 0.15, t: 0.08, prefer: 'KA_19A',       appR2D: 0.70 },
  passenger: { label: '客船',   blades: 5, w: 0.22, t: 0.16, prefer: 'WAGENINGEN_B', appR2D: 0.60 },
  oil:       { label: '油船',   blades: 4, w: 0.32, t: 0.22, prefer: 'WAGENINGEN_B', appR2D: 0.66 },
  engineering: { label: '工程船', blades: 4, w: 0.22, t: 0.18, prefer: 'WAGENINGEN_B', appR2D: 0.65 },
};

const KNOTS_TO_MS = 0.5144;

/**
 * 估算所需推进功率 (PB) ≈ 海军部系数法
 *
 * 公式: PB = Δ^(2/3) × Vs³ / Cn
 *   - Δ: 排水量 (吨)
 *   - Vs: 设计航速 (节)
 *   - Cn: 海军部系数, 不同船型典型值: 货船 ~330, 渔船 ~280, 拖轮 ~200, 客船 ~360
 *
 * 参考: 《船舶原理》第 8 章; van Manen & van Oossanen, "Propulsion" (PNA Vol II, 1988)
 *
 * @param {Object} params {displacement, speed, vesselType}
 * @returns {{PB: number, Cn: number, method: string}}
 */
export const estimateRequiredPower = ({ displacement, speed, vesselType }) => {
  const Cn_TABLE = {
    cargo: 330, fishing: 280, tug: 200, ahts: 220, pusher: 210,
    passenger: 360, oil: 320, engineering: 280,
  };
  const Cn = Cn_TABLE[vesselType] || 300;
  const PB = Math.pow(displacement, 2 / 3) * Math.pow(speed, 3) / Cn;
  return {
    PB: Math.round(PB),
    Cn,
    method: 'admiralty_coefficient',
    formula: 'PB = Δ^(2/3) × Vs³ / Cn',
    reference: 'PNA Vol II §3.1 / 《船舶原理》§8.3',
  };
};

/**
 * 估算桨直径 — 经验法 (基于船型比例 D ≈ ratio × draft)
 *
 * 拖轮/AHTS: D ≈ 0.70 × draft (导管桨可用更大直径)
 * 商船:      D ≈ 0.65 × draft
 * 客船:      D ≈ 0.60 × draft  (噪声/振动控制)
 *
 * 同时校验最大允许直径 = 0.85 × draft (露出水面/触底安全)
 *
 * @param {Object} params {draft, vesselType}
 * @returns {{D: number, Dmax: number, ratio: number}}
 */
export const estimatePropellerDiameter = ({ draft, vesselType }) => {
  const v = VESSEL_TYPES[vesselType] || VESSEL_TYPES.cargo;
  const D = draft * v.appR2D;
  const Dmax = draft * 0.85;
  return {
    D: Math.round(D * 100) / 100,
    Dmax: Math.round(Dmax * 100) / 100,
    ratio: v.appR2D,
    note: 'D 由 draft 经验比例估算; 终值需结合主机转速、桨负荷、空泡反馈',
  };
};

/**
 * 估算最佳桨转速 (n_propeller) — 通过迭代搜索使 J 落在 0.5-0.8 高效区
 *
 * @param {Object} params {power_kW, speed_kn, D, vesselType, blades, P_D, AeA0}
 * @returns {{n_propeller_rpm, J, eta0, KT, KQ, valid}}
 */
export const estimatePropellerSpeed = (params) => {
  const v = VESSEL_TYPES[params.vesselType] || VESSEL_TYPES.cargo;
  const wake = v.w;
  const Vs_ms = params.speed_kn * KNOTS_TO_MS;
  const Va = Vs_ms * (1 - wake);
  const D = params.D;
  const Z = params.blades || v.blades;
  const P_D = params.P_D || 0.95;
  const AeA0 = params.AeA0 || 0.65;
  const useKa = v.prefer === 'KA_19A';

  let bestN = null;
  let bestEta = 0;
  let best = null;
  // 在 60-300 rpm 范围搜索
  for (let n_rpm = 60; n_rpm <= 300; n_rpm += 5) {
    const n_rps = n_rpm / 60;
    if (n_rps * D <= 0) continue;
    const J = Va / (n_rps * D);
    if (J <= 0 || J >= 1.4) continue;
    const perf = useKa
      ? calculatePerformance('KA_19A', { J, P_D, AeA0 })
      : calculateOpenWaterPerformance_ITTC(J, P_D, AeA0, Z);
    if (!perf) continue;
    if (perf.eta0 > bestEta && perf.eta0 < 1.0) {
      bestEta = perf.eta0;
      bestN = n_rpm;
      best = perf;
    }
  }
  return bestN
    ? {
        n_propeller_rpm: bestN,
        J: best.J,
        KT: best.KT,
        KQ: best.KQ,
        eta0: best.eta0,
        Va_ms: Math.round(Va * 100) / 100,
        wakeFraction: wake,
        series: useKa ? 'KA_19A' : 'WAGENINGEN_B',
        valid: true,
      }
    : { valid: false, reason: '未在 60-300 rpm 找到合适桨转速,请调整 P/D 或 D' };
};

/**
 * 主入口: 系统级匹配求解
 *
 * 流程: 船型/排水量/航速/吃水 →
 *       (1) 海军部系数估算 PB
 *       (2) 经验比例估算桨直径 D
 *       (3) 迭代搜索最佳桨转速 + η0
 *       (4) 计算减速比 i = n_engine / n_propeller
 *       (5) 推荐桨型/盘面比/叶数
 *
 * @param {Object} input
 * @param {string} input.vesselType
 * @param {number} input.displacement  — 排水量 t
 * @param {number} input.speed         — 设计航速 节
 * @param {number} input.draft         — 设计吃水 m
 * @param {number} [input.engineSpeed] — 主机额定转速 rpm (默认 1500)
 * @param {number} [input.engineCount] — 主机数量 (默认 1)
 * @returns {Object} 完整推进系统建议
 */
export const solveSystemMatch = (input) => {
  const {
    vesselType,
    displacement,
    speed,
    draft,
    engineSpeed = 1500,
    engineCount = 1,
  } = input;

  // 输入校验
  if (!vesselType || !VESSEL_TYPES[vesselType]) {
    return { success: false, error: '请选择有效船型' };
  }
  if (!displacement || displacement <= 0) {
    return { success: false, error: '排水量必须大于 0' };
  }
  if (!speed || speed <= 0) {
    return { success: false, error: '设计航速必须大于 0' };
  }
  if (!draft || draft <= 0) {
    return { success: false, error: '设计吃水必须大于 0' };
  }

  const vesselProfile = VESSEL_TYPES[vesselType];

  // (1) 估算 PB
  const powerEst = estimateRequiredPower({ displacement, speed, vesselType });
  const PB_per_engine = powerEst.PB / engineCount;

  // (2) 估算 D
  const diameterEst = estimatePropellerDiameter({ draft, vesselType });

  // (3) 推荐盘面比与叶数
  const useKa = vesselProfile.prefer === 'KA_19A';
  const recommendedAeA0 = useKa
    ? (PB_per_engine > 1500 ? 0.75 : 0.65)   // 高负荷取大盘面比
    : (PB_per_engine > 2000 ? 0.75 : 0.55);
  const recommendedBlades = vesselProfile.blades;
  const recommendedPD = useKa ? 1.05 : 0.95;

  // (4) 搜索最佳桨转速
  const propEst = estimatePropellerSpeed({
    power_kW: PB_per_engine,
    speed_kn: speed,
    D: diameterEst.D,
    vesselType,
    blades: recommendedBlades,
    P_D: recommendedPD,
    AeA0: recommendedAeA0,
  });

  // (5) 减速比
  const targetRatio = propEst.valid
    ? Math.round((engineSpeed / propEst.n_propeller_rpm) * 100) / 100
    : null;

  // 推力 (T = KT × ρ × n² × D⁴) — 用于校验是否够用
  let estimatedThrust_kN = null;
  if (propEst.valid && propEst.KT) {
    const n_rps = propEst.n_propeller_rpm / 60;
    const T = propEst.KT * 1025 * n_rps * n_rps * Math.pow(diameterEst.D, 4);
    estimatedThrust_kN = Math.round(T / 1000);
  }

  return {
    success: true,
    timestamp: new Date().toISOString(),
    input,
    vesselProfile,
    power: {
      total_kW: powerEst.PB,
      perEngine_kW: Math.round(PB_per_engine),
      ...powerEst,
    },
    propeller: {
      diameter_m: diameterEst.D,
      maxAllowed_m: diameterEst.Dmax,
      bladeCount: recommendedBlades,
      pitchRatio: recommendedPD,
      areaRatio: recommendedAeA0,
      series: useKa ? 'KA_19A' : 'WAGENINGEN_B',
      seriesName: useKa ? 'Ka 系列 (19A 导管)' : 'Wageningen B 系列',
      n_propeller_rpm: propEst.valid ? propEst.n_propeller_rpm : null,
      eta0: propEst.valid ? propEst.eta0 : null,
      J: propEst.valid ? propEst.J : null,
      KT: propEst.valid ? propEst.KT : null,
      Va_ms: propEst.valid ? propEst.Va_ms : null,
      wakeFraction: vesselProfile.w,
      thrustDeduction: vesselProfile.t,
      estimatedThrust_kN,
    },
    gearbox: {
      engineSpeed_rpm: engineSpeed,
      propellerSpeed_rpm: propEst.valid ? propEst.n_propeller_rpm : null,
      targetRatio,
      note: targetRatio
        ? `减速比 ≈ ${targetRatio} (主机 ${engineSpeed} → 桨 ${propEst.n_propeller_rpm} rpm)`
        : '未求得有效桨转速,请调整输入',
    },
    references: [
      'PNA Vol II §3.1 (Admiralty coefficient)',
      'NSMB Wageningen B-Series (Bernitsas 1981)',
      useKa ? 'Oosterveld 1970 — Ka 系列 19A 导管' : null,
    ].filter(Boolean),
  };
};

export default {
  VESSEL_TYPES,
  estimateRequiredPower,
  estimatePropellerDiameter,
  estimatePropellerSpeed,
  solveSystemMatch,
};
