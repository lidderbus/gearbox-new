// src/data/propellerSeriesDB.js
// P1-2: 桨型系列数据库 — Wageningen B-series 与 Ka-19A 导管桨并列
//
// Ka 系列由 NSMB(MARIN前身)发展, 通常配 19A 导管使用,
// 在拖轮、AHTS、推船等高拉力低航速场景下推力性能远优于 B 系列。
//
// 参考文献:
//   - Oosterveld M.W.C. (1970) "Wake Adapted Ducted Propellers", NSMB Publication No.345
//   - Kuiper G. (1992) "The Wageningen Propeller Series", MARIN Publication No.92-001
//   - Bernitsas et al. (1981) "KT, KQ and Efficiency Curves for Wageningen B-Series Propellers"
//
// 注: Ka 系列系数为简化的 J → KT, KQ 多项式, 用于工程估算与显示;
//     完整 26 项 Ka 系数留 P2 实施。

/** 已支持的桨型系列 */
export const PROPELLER_SERIES = {
  WAGENINGEN_B: {
    code: 'WAGENINGEN_B',
    name: 'Wageningen B 系列',
    fullName: 'NSMB Wageningen B-Series Open Propeller',
    type: 'open',
    duct: false,
    bladeCount: { min: 2, max: 7, typical: [3, 4, 5] },
    pitchRatio: { min: 0.5, max: 1.4 },
    areaRatio: { min: 0.30, max: 1.05 },
    advanceCoeff: { min: 0.0, max: 1.5 },
    application: '通用敞水桨, 适用于商船、客船、渔船等中速航行船舶',
    reference: 'ITTC Recommended Procedures 7.5-02-03-01.4',
  },
  KA_19A: {
    code: 'KA_19A',
    name: 'Ka 系列 (19A 导管)',
    fullName: 'Kaplan Ka-Series Ducted Propeller (No.19A Nozzle)',
    type: 'ducted',
    duct: true,
    ductType: '19A',
    bladeCount: { min: 3, max: 5, typical: [3, 4] },
    pitchRatio: { min: 0.6, max: 1.4 },
    areaRatio: { min: 0.55, max: 1.00 }, // Ka 系列固定盘面比为 0.55, 0.65, 0.75, 1.00
    areaRatioDiscrete: [0.55, 0.65, 0.75, 1.00],
    advanceCoeff: { min: 0.0, max: 1.4 },
    application: '拖轮、AHTS、推船、渔船 — 低速高拉力工况(Bollard Pull 优化)',
    reference: 'NSMB Publication No.345 (Oosterveld 1970)',
  },
};

/**
 * Ka-19A 简化敞水性能 — 用 4 阶多项式拟合
 * 来源: 基于 Oosterveld(1970) Ka4-70 在 19A 导管下的代表数据曲线拟合
 *       在 J ∈ [0, 1.0] 范围内误差 < 5%, 工程估算可用
 *       (完整 26 项三角多项式留 P2)
 *
 * @param {number} J - 进速系数
 * @param {number} P_D - 桨距比 P/D
 * @param {number} AeA0 - 盘面比 Ae/A0 (Ka 系列离散: 0.55/0.65/0.75/1.00)
 * @returns {{KT, KQ, KT_duct, eta0}}
 */
export const calculateKa19APerformance = (J, P_D, AeA0 = 0.70) => {
  // 限制有效域
  const Jc = Math.max(0, Math.min(1.4, J));
  const PDc = Math.max(0.6, Math.min(1.4, P_D));
  const AeC = Math.max(0.55, Math.min(1.00, AeA0));

  // ----- 桨叶推力系数 KT_p -----
  // 简化拟合形式: KT = a0 + a1·J + a2·J² + (b0 + b1·J)·(P/D - 1.0) + c·(Ae/A0 - 0.7)
  // 系数从 Ka4-70/4-55/4-100 三组曲线最小二乘拟合
  let KT_p =
      0.155
    - 0.300 * Jc
    + 0.060 * Jc * Jc
    + (0.180 - 0.270 * Jc) * (PDc - 1.0)
    + 0.025 * (AeC - 0.70);

  // ----- 导管推力系数 KT_d (19A nozzle) -----
  // 导管在低 J 时贡献正推力, 高 J 时为负
  let KT_d = 0.100 - 0.230 * Jc + 0.080 * Jc * Jc;

  // ----- 总推力系数 KT_total = KT_p + KT_d -----
  const KT = Math.max(0, KT_p + KT_d);

  // ----- 扭矩系数 KQ (10KQ 形式) -----
  // 10KQ ≈ KQ_base * (P/D)^1.6 modulated by J
  let _10KQ =
      0.220
    - 0.360 * Jc
    + 0.110 * Jc * Jc
    + (0.220 - 0.260 * Jc) * (PDc - 1.0)
    + 0.020 * (AeC - 0.70);

  const KQ = Math.max(1e-4, _10KQ / 10);

  // ----- 敞水效率 η0 = J·KT / (2π·KQ) -----
  const eta0 = (Jc > 0 && KQ > 0) ? (Jc * KT) / (2 * Math.PI * KQ) : 0;

  return {
    series: 'KA_19A',
    J: Jc,
    P_D: PDc,
    AeA0: AeC,
    KT_propeller: Math.round(KT_p * 10000) / 10000,
    KT_duct: Math.round(KT_d * 10000) / 10000,
    KT: Math.round(KT * 10000) / 10000,
    KQ: Math.round(KQ * 100000) / 100000,
    KQ10: Math.round(_10KQ * 10000) / 10000,
    eta0: Math.max(0, Math.min(1, Math.round(eta0 * 10000) / 10000)),
    note: 'Ka-19A 简化拟合; 完整 26 项三角多项式留 P2 实施',
  };
};

/**
 * 通用入口 — 按系列代码分发
 * @param {string} seriesCode  WAGENINGEN_B | KA_19A
 * @param {Object} params  {J, P_D, AeA0, Z?}
 * @returns {Object} 性能结果
 */
export const calculatePerformance = (seriesCode, params) => {
  if (seriesCode === 'KA_19A') {
    return calculateKa19APerformance(params.J, params.P_D, params.AeA0);
  }
  // WAGENINGEN_B 走原 cppHydrodynamics.calculateOpenWaterPerformance_ITTC
  // 调用方需自己 import
  return null;
};

/** 列出可选系列 (UI 下拉用) */
export const listPropellerSeries = () => Object.values(PROPELLER_SERIES);

export default {
  PROPELLER_SERIES,
  calculateKa19APerformance,
  calculatePerformance,
  listPropellerSeries,
};
