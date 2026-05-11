// src/utils/copilotRules.ts
// Copilot 选型规则对齐工具集 — 9 条硬约束 + 船型→桨型推断 + 直接型号 fast path
// 源对照: /Users/lidder/erp-dashboard/public/gearbox-copilot.html:1170-1320

import type { Gearbox } from '../types';

// ============================================================================
// 业务规则 ID 注册表 (用于规则溯源, 与 Copilot 一致)
// ============================================================================

export const COPILOT_RULES = {
  PROP_INFER: 'R-PROP-INFER',           // 船型→桨型推断
  PROP_CPP: 'R-PROP-CPP',               // CPP→GC*/DT* 硬约束
  PROP_FPP: 'R-PROP-FPP',               // FPP→排除 GC*/DT*
  TWIN_2GWH: 'R-TWIN-2GWH',             // 双机并车→2GWH 硬约束
  GEAR_DUAL_SPEED: 'R-GEAR-DUAL-SPEED', // 双速→DT/船用双速
  GEAR_HIGH_SPEED: 'R-GEAR-HIGH-SPEED', // 高速→HCG/HCAG/HCQ
  THRUST_MIN: 'R-THRUST-MIN',           // 推力 ≥minThrust 硬筛
  CERT_MATCH: 'R-CERT-MATCH',           // 船级社硬匹配
  DIRECT_MODEL: 'R-DIRECT-MODEL',       // 直接型号 fast path
} as const;

export type CopilotRuleId = typeof COPILOT_RULES[keyof typeof COPILOT_RULES];

// ============================================================================
// 船型 → 桨型自动推断
// 源: gearbox-copilot.html:987-1002
// ============================================================================

// 含中文同义词覆盖 (油船/油轮 / 拖船/拖轮 / 客滚/客船)
const CPP_KEYWORDS = ['集装箱', '散货', 'LNG', '油船', '油轮', '海工', '客滚', '客船', '工程船'];
const FPP_KEYWORDS = ['渔船', '拖网', '拖船', '拖轮', '工作船', '内河', '游艇'];

/**
 * 从应用清单/船型字段推断桨型
 * @param applications 应用场景数组 (如 ['集装箱', '8MW 以上'])
 * @param power 功率 kW (≥8000 倾向 CPP)
 * @returns 'CPP' | 'FPP' | null (无法推断)
 */
export function inferPropellerType(
  applications: string[] | undefined,
  power?: number
): 'CPP' | 'FPP' | null {
  if (power && power >= 8000) return 'CPP';
  if (!applications || applications.length === 0) return null;
  const text = applications.join(' ');
  for (const kw of CPP_KEYWORDS) {
    if (text.includes(kw)) return 'CPP';
  }
  for (const kw of FPP_KEYWORDS) {
    if (text.includes(kw)) return 'FPP';
  }
  return null;
}

// ============================================================================
// 齿轮箱 CPP 判定 (无离合: GC*/DT* + "变距桨"/"电推" 含义)
// 源: gearbox-copilot.html:1178-1190
// React SPA 字段差异: series 字段值如 "GC配变距桨"/"GCH"/"GCS"/"GCHT"/"GCHE"/"DT"
// ============================================================================

export function isCPPGearbox(gb: Pick<Gearbox, 'model' | 'series'> | null | undefined): boolean {
  if (!gb) return false;
  const model = (gb.model || '').toUpperCase();
  const series = (gb.series || '').toString();
  if (model.startsWith('GC')) return true;
  if (model.startsWith('DT')) return true;
  if (series.startsWith('GC')) return true;
  if (series === 'DT') return true;
  if (series.includes('变距桨')) return true;
  if (series.includes('电推')) return true;
  return false;
}

// ============================================================================
// 直接型号 fast path
// 源: gearbox-copilot.html:1203-1232
// 规则: 长度倒序匹配防 HC 误匹 HC1200, word boundary 防部分匹配
// ============================================================================

const NUMERIC_ONLY_RE = /^\d+$/;

/**
 * 在 query 中扫描是否命中已知齿轮箱 model
 * @param query 用户输入或表单组合的搜索串
 * @param allGearboxes 完整型号库
 * @returns 命中的 Gearbox 对象, 或 null
 */
export function findDirectModel(
  query: string,
  allGearboxes: Gearbox[] | undefined
): Gearbox | null {
  if (!query || !allGearboxes || allGearboxes.length === 0) return null;
  const q = query.toUpperCase();
  // 长度倒序: 防止 HC 抢先匹配 HC1200
  const sorted = [...allGearboxes]
    .filter(g => g && g.model)
    .sort((a, b) => (b.model.length - a.model.length));
  for (const gb of sorted) {
    const m = gb.model.toUpperCase();
    // 跳过纯数字 model (如 "06", "120B" 中 "120" 部分) 防止误匹 "300 马力"
    if (NUMERIC_ONLY_RE.test(m)) continue;
    // word boundary regex (转义 model 中的特殊字符)
    const escaped = m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const re = new RegExp(`(?:^|[^A-Z0-9])${escaped}(?:[^A-Z0-9]|$)`);
    if (re.test(q)) return gb;
  }
  return null;
}

// ============================================================================
// 9 条硬约束统一执行
// 源: gearbox-copilot.html:1241-1265
// ============================================================================

export interface CopilotConstraintInput {
  propellerType?: 'CPP' | 'FPP' | null;
  twinEngine?: boolean;
  gearType?: '双速' | '高速' | null;
  minThrust?: number;
  classification?: string; // CCS/DNV/LR/BV/ABS/KR/NK/RINA
}

export interface CopilotConstraintResult {
  pass: boolean;
  rejectedRule?: CopilotRuleId;
  reason?: string;
}

// HIGH_SPEED 白名单: Copilot HTML 原始仅 HCG/HCAG/HCQ 三系列 (高速主轴款).
// SPA 扩展加入 HCM/HCAM (倾角款, 倾角变体常配高速场景) + HCV/HCVG (垂直输出款, 中转速但常被销售归入"高速"类口语).
// 扩展依据: 内部销售反馈 + completeGearboxData 中这 4 系列 maxSpeed 与 HCG/HCAG 同档.
// 若需严格双端对齐 Copilot HTML, 可在 'copilot-strict' profile 下回退到 3 系列 (参见 selectionConfig.js).
const HIGH_SPEED_SERIES = new Set(['HCG', 'HCAG', 'HCQ', 'HCM', 'HCAM', 'HCV', 'HCVG']);
const DUAL_SPEED_KEYWORDS = ['双速'];

/**
 * 对单个齿轮箱执行 9 条硬约束 (任一不通过即返回 pass=false)
 * 调用顺序与 Copilot 一致: CPP/FPP → 双机 → 双速/高速 → 推力 → 船级社
 */
export function applyCopilotHardConstraints(
  gb: Gearbox,
  input: CopilotConstraintInput
): CopilotConstraintResult {
  if (!gb || !gb.model) return { pass: true };

  // 1. 桨型: CPP 必走无离合 (GC*/DT*)
  const isCPP = isCPPGearbox(gb);
  if (input.propellerType === 'CPP' && !isCPP) {
    return {
      pass: false,
      rejectedRule: COPILOT_RULES.PROP_CPP,
      reason: 'CPP(变距桨)硬约束: 仅匹配 GC*/DT* 系列',
    };
  }

  // 2. 桨型: FPP 必排无离合
  if (input.propellerType === 'FPP' && isCPP) {
    return {
      pass: false,
      rejectedRule: COPILOT_RULES.PROP_FPP,
      reason: 'FPP(定距桨)硬约束: 排除 GC*/DT* 无离合系列',
    };
  }

  // 3. 双机并车: 必走 2GWH (model 前缀, 与 series 字段无关)
  if (input.twinEngine === true) {
    const m = (gb.model || '').toUpperCase();
    if (!m.startsWith('2GWH')) {
      return {
        pass: false,
        rejectedRule: COPILOT_RULES.TWIN_2GWH,
        reason: '双机并车硬约束: 仅匹配 2GWH 系列',
      };
    }
  }

  // 4. 双速: series 含"双速" 或 series=="DT"
  if (input.gearType === '双速') {
    const s = (gb.series || '').toString();
    const m = (gb.model || '').toUpperCase();
    const hit = DUAL_SPEED_KEYWORDS.some(kw => s.includes(kw)) || s === 'DT' || m.startsWith('DT');
    if (!hit) {
      return {
        pass: false,
        rejectedRule: COPILOT_RULES.GEAR_DUAL_SPEED,
        reason: '双速硬约束: 仅匹配 DT 或船用双速系列',
      };
    }
  }

  // 5. 高速: series 在 {HCG, HCAG, HCQ, HCM, HCAM, HCV, HCVG}
  if (input.gearType === '高速') {
    const s = (gb.series || '').toString();
    if (!HIGH_SPEED_SERIES.has(s)) {
      return {
        pass: false,
        rejectedRule: COPILOT_RULES.GEAR_HIGH_SPEED,
        reason: '高速硬约束: 仅匹配 HCG/HCAG/HCQ/HCM/HCAM/HCV/HCVG 系列',
      };
    }
  }

  // 6. 推力下限: gb.thrust < minThrust 直接排
  if (typeof input.minThrust === 'number' && input.minThrust > 0) {
    const t = typeof gb.thrust === 'number' ? gb.thrust : Number(gb.thrust);
    if (!isFinite(t) || t < input.minThrust) {
      return {
        pass: false,
        rejectedRule: COPILOT_RULES.THRUST_MIN,
        reason: `推力硬约束: 需 ≥${input.minThrust}kN, 实际 ${isFinite(t) ? t : '缺失'}`,
      };
    }
  }

  // 7. 船级社硬匹配
  if (input.classification && input.classification.trim()) {
    const certs = Array.isArray((gb as any).certifications)
      ? ((gb as any).certifications as string[])
      : [];
    const target = input.classification.trim().toUpperCase();
    const hit = certs.some(c => (c || '').toUpperCase().includes(target));
    if (!hit) {
      return {
        pass: false,
        rejectedRule: COPILOT_RULES.CERT_MATCH,
        reason: `船级社硬约束: 需含 ${input.classification}, 实际 [${certs.join(',') || '空'}]`,
      };
    }
  }

  return { pass: true };
}

// ============================================================================
// 拒绝统计聚合 (供 UI 展示 "因 CPP 排除 N 条" 等诊断信息)
// ============================================================================

export type CopilotExclusionStats = Partial<Record<CopilotRuleId, number>>;

export function emptyExclusionStats(): CopilotExclusionStats {
  return {};
}

export function bumpExclusion(
  stats: CopilotExclusionStats,
  rule: CopilotRuleId | undefined
): void {
  if (!rule) return;
  stats[rule] = (stats[rule] || 0) + 1;
}
