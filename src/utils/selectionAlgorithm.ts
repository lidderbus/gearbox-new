// src/utils/selectionAlgorithm.ts
// 齿轮箱选型算法 - TypeScript版本

import { logger } from '../config/logging';
import {
  DEFAULT_SCORING_WEIGHTS,
  COPILOT_SCORING_WEIGHTS,
  COPILOT_STRICT_SCORING_WEIGHTS,
  DEFAULT_TOLERANCES,
  SORTING_THRESHOLDS
} from '../config/selectionConfig';
import {
  getRecommendedCouplingInfo,
  couplingWorkFactorMap,
  getTemperatureFactor,
  getRecommendedPump,
  getCouplingSpecifications,
  couplingSpecificationsMap
} from '../data/gearboxMatchingMaps';
import {
  calculateFactoryPrice,
  calculateMarketPrice,
  getStandardDiscountRate
} from './priceManager';
import { safeParseFloat } from './dataHelpers';
import { selectFlexibleCoupling, selectStandbyPump, fixCouplingTorque } from './couplingSelection';
import { getGWPackagePriceConfig, checkPackageMatch } from '../data/packagePriceConfig';
import { deriveShaftArrangement, matchesShaftArrangement } from '../config/shaftArrangementConfig';
import { matchesSeriesRequirements } from '../config/seriesCapabilityConfig';
import { matchesStructuralFilter } from './gwStructuralForm';
import { performCriticalSpeedCheck } from './criticalSpeedCheck';
import {
  applyCopilotHardConstraints,
  inferPropellerType,
  isCPPGearbox,
  findDirectModel,
  COPILOT_RULES,
  type CopilotRuleId,
  type CopilotExclusionStats,
  type CopilotConstraintInput,
} from './copilotRules';

// 导入类型定义
import type {
  Gearbox,
  GearboxSeries,
  Coupling,
  StandbyPump,
  SelectionInput,
  SelectionResult,
  SelectionRecommendation,
  SelectionDebugInfo,
  CouplingMatchResult,
  PumpMatchResult,
  AppData,
  HybridConfig
} from '../types';

// ============= 内部类型定义 =============

/**
 * 联轴器罩壳映射
 */
interface CouplingCoverMap {
  [key: string]: string;
}

/**
 * 接口匹配结果
 */
interface InterfaceMatch {
  matched: boolean;         // 是否匹配
  type?: 'sae' | 'domestic'; // 接口类型
  spec?: string;            // 匹配的规格
  needsAdapter?: boolean;   // 是否需要转接
}

/**
 * 轴布置过滤条件
 */
interface ShaftArrangementFilter {
  axisAlignment?: 'any' | 'concentric' | 'eccentric';  // 同心/异心
  offsetDirection?: 'any' | 'vertical-offset' | 'horizontal-offset' | 'diagonal-offset';  // 偏置方向
  reversingFunction?: 'any' | 'with-reverse' | 'no-reverse';  // 倒顺功能
}

/**
 * 原动机类型 → 高弹联轴器额定扭矩安全系数
 * 柴油机: 1.5 (扭矩脉动大)
 * 电动机: 1.8 (启停冲击大)
 * 用于联轴器选型: 所需扭矩 = 发动机扭矩 × K × St × 原动机系数
 */
export const PRIME_MOVER_CAPACITY_FACTOR: Record<string, { label: string; factor: number; description: string }> = {
  diesel: { label: '柴油机', factor: 1.5, description: '扭矩脉动，标准工况' },
  electric: { label: '电动机', factor: 1.8, description: '启停冲击大，需更高裕量' },
  none: { label: '不考虑', factor: 1.0, description: '不应用原动机系数' },
};

/**
 * 选型配置选项
 */
interface SelectionOptions {
  workCondition?: string;
  workFactorMode?: 'FACTORY' | 'JB_CCS';  // 工况系数模式: 厂家标准 或 JB/CCS船级社标准
  temperature?: number;
  hasCover?: boolean;
  application?: string;
  hybridConfig?: HybridConfig;
  tolerances?: ToleranceConfig;
  scoringWeights?: ScoringWeights;
  // 接口筛选选项
  interfaceType?: 'sae' | 'domestic' | '无要求';  // 接口类型
  interfaceSpec?: string;                          // 接口规格 (如 SAE14寸、φ450)
  interfaceFilterMode?: 'prefer' | 'strict';       // 筛选模式: prefer(优先) | strict(严格)
  // 轴布置筛选选项
  shaftArrangement?: ShaftArrangementFilter;
  // 系列特性需求
  seriesRequirements?: {
    needsClutch?: boolean | null;
    needsReverse?: boolean | null;
    preferConcentric?: boolean | null;
    needsHighThrust?: boolean;
    propellerType?: 'FPP' | 'CPP' | null;
  };
  // GW 子系列结构形式过滤（仅对 GW 系列生效；空数组或缺省 = 不限制）
  gwStructuralFilter?: string[];
  // Copilot 对齐硬约束 (任一未指定即不触发该约束)
  twinEngine?: boolean;                       // 双机并车 → 仅 2GWH
  gearType?: '双速' | '高速' | null;          // 双速 → DT, 高速 → HCG/HCAG/HCQ
  minThrust?: number;                         // 推力下限 kN, 硬筛
  classification?: string;                    // CCS/DNV/LR/BV/ABS/KR/NK/RINA, 硬匹配
  autoInferPropellerType?: boolean;           // true 时根据 application 自动推断 CPP/FPP
  scoringProfile?: 'copilot' | 'legacy' | 'copilot-strict';      // 评分公式切换 (默认 copilot, 'copilot-strict' 严格复刻 Copilot HTML 5 维)
}

/**
 * 容差配置
 */
interface ToleranceConfig {
  maxRatioDiffPercent?: number;
  maxCapacityMargin?: number;
  minCapacityMargin?: number;
}

/**
 * 评分权重配置
 */
interface ScoringWeights {
  costEffectiveness?: number;
  ratioMatch?: number;
  capacityMargin?: number;
  thrustSatisfy?: number;
  specialPackage?: number;
  shaftMatch?: number;
  seriesCapabilityFit?: number;
  interfaceMatch?: number;
}

/**
 * 拒绝原因统计
 */
interface RejectionReasons {
  speedRange: number;
  ratioOutOfRange: number;
  capacityTooLow: number;
  capacityTooHigh: number;
  thrustInsufficient: number;
  interfaceMismatch: number;          // 接口不匹配
  shaftMismatch: number;              // 轴布置不匹配
  seriesCapabilityMismatch: number;   // 系列特性不匹配
}

/**
 * 约束放宽建议
 */
export interface RelaxationSuggestion {
  parameter: string;
  currentValue: string;
  suggestedValue: string;
  additionalMatches: number;
  models: string[];
}

/**
 * 近似匹配结果
 */
interface NearMatch extends Partial<Gearbox> {
  selectedRatio?: number;
  selectedCapacity?: number;
  capacityMargin?: number;
  ratioDiffPercent?: number;
  thrustMet?: boolean;
  failureReason?: string;
  score?: number;
  hasSpecialPackagePrice?: boolean;
  gwPackageConfig?: unknown;
  basePrice?: number;
  price?: number;
  discountRate?: number;
  factoryPrice?: number;
  packagePrice?: number;
  marketPrice?: number;
  _priceDataMissing?: boolean;
}

/**
 * 内部匹配齿轮箱（带计算字段）
 */
interface MatchingGearbox extends Gearbox {
  selectedRatio: number;
  selectedCapacity: number;
  capacityMargin: number;
  thrustMet: boolean;
  ratio: number;
  engineTorque: number;
  ratioDiffPercent: number;
  safetyFactor: number;
  basePrice: number;
  price: number;
  discountRate: number;
  factoryPrice: number;
  packagePrice: number;
  marketPrice: number;
  hasSpecialPackagePrice: boolean;
  gwPackageConfig?: unknown;
  score?: number;
  interfaceMatch?: InterfaceMatch;  // 接口匹配结果
  _pricePerCapacity?: number;
  _priceDataMissing?: boolean;
  _scoringWeights?: ScoringWeights;
  _displayFields?: {
    capacityText: string;
    requiredCapacityText: string;
    capacityMarginText: string;
    selectedRatioText: string;
    ratioDiffText: string;
  };
}

/**
 * 自动选型需求
 */
interface AutoSelectRequirements {
  motorPower: number;
  motorSpeed: number;
  targetRatio: number;
  thrust?: number;
  workCondition?: string;
  workFactorMode?: 'FACTORY' | 'JB_CCS';  // 工况系数模式: 厂家标准 或 JB/CCS船级社标准
  temperature?: number;
  hasCover?: boolean;
  application?: string;
  hybridConfig?: HybridConfig;
  tolerances?: ToleranceConfig;
  scoringWeights?: ScoringWeights;
  // 接口筛选选项
  interfaceType?: 'sae' | 'domestic' | '无要求';
  interfaceSpec?: string;
  interfaceFilterMode?: 'prefer' | 'strict';
  // B1: 多品牌柴油机库追溯 — 选型结果中保留 engineId, 供 IMO 合规 / TCO 计算等下游
  engineId?: string;
  // 轴布置筛选选项
  shaftArrangement?: ShaftArrangementFilter;
  // 系列特性需求
  seriesRequirements?: {
    needsClutch?: boolean | null;
    needsReverse?: boolean | null;
    preferConcentric?: boolean | null;
    needsHighThrust?: boolean;
    propellerType?: 'FPP' | 'CPP' | null;
  };
  // GW 子系列结构形式过滤（仅对 GW 系列生效；空数组或缺省 = 不限制）
  gwStructuralFilter?: string[];
  // Copilot 对齐硬约束
  twinEngine?: boolean;
  gearType?: '双速' | '高速' | null;
  minThrust?: number;
  classification?: string;
  autoInferPropellerType?: boolean;
  scoringProfile?: 'copilot' | 'legacy' | 'copilot-strict';
  // 直接型号 fast path: 命中后跳过工况筛选直接返回
  directModelQuery?: string;
}

/**
 * 内部选型结果（扩展）
 */
interface InternalSelectionResult extends SelectionResult {
  flexibleCoupling?: CouplingMatchResult | null;
  standbyPump?: PumpMatchResult | null;
  engineTorque?: number;
  requiredTransferCapacity?: number;
  enginePower?: number;
  engineSpeed?: number;
  engineId?: string;     // B1: 透传柴油机库 id, 供下游 IMO/TCO
  targetRatio?: number;
  thrustRequirement?: number;
  options?: SelectionOptions;
  warning?: string;
  priceInfo?: string;
  rejectionReasons?: RejectionReasons;
  relaxationSuggestions?: RelaxationSuggestion[];
  _diagnostics?: {
    scoringWeights: ScoringWeights;
    tolerances: {
      maxRatioDiffPercent: number;
      maxCapacityMargin: number;
      minCapacityMargin: number;
    };
    rejectionReasons: RejectionReasons;
    copilotExclusions?: Partial<Record<CopilotRuleId, number>>;  // Copilot 9 硬约束排除统计
    appliedRules?: CopilotRuleId[];  // 实际触发的规则 ID
    inferredPropellerType?: 'CPP' | 'FPP' | null;  // 自动推断结果 (autoInferPropellerType=true 时填充)
    isDirectModelHit?: boolean;  // 直接型号 fast path 是否命中
    scoringProfile?: 'copilot' | 'legacy' | 'copilot-strict';
    nearMatchCount: number;
    totalScanned: number;
    totalMatched: number;
  };
}

/**
 * 自动选型结果
 */
interface AutoSelectResult extends InternalSelectionResult {
  recommendedType?: string;
  partialMatchCount?: number;
  allResults?: InternalSelectionResult[];
  _meta?: {
    calculationTime: string;
    version: string;
    dataVersion: string;
  };
}

// ============= 常量定义 =============

/**
 * 联轴器罩壳映射
 */
const couplingWithCoverMap: CouplingCoverMap = {
  'HGTHB5': 'HGTHJB5',
  'HGTHB6.3A': 'HGTHJB6.3A',
};

// 调试模式
const DEBUG_MODE = process.env.NODE_ENV !== 'production';

/**
 * 调试日志
 */
const DEBUG_LOG = (message: string, data?: unknown): void => {
  if (DEBUG_MODE) {
    if (data !== undefined) {
      logger.debug(message, data);
    } else {
      logger.debug(message);
    }
  }
};

// ============= 接口匹配辅助函数 =============

/**
 * 检查齿轮箱是否支持指定接口
 * @param gearbox 齿轮箱数据
 * @param interfaceType 接口类型 (sae | domestic)
 * @param interfaceSpec 接口规格 (如 SAE14寸、φ450)
 * @returns 接口匹配结果
 */
function checkInterfaceMatch(
  gearbox: Gearbox,
  interfaceType: 'sae' | 'domestic' | '无要求' | undefined,
  interfaceSpec: string | undefined
): InterfaceMatch {
  // 无接口要求，直接返回匹配
  if (!interfaceType || interfaceType === '无要求' || !interfaceSpec) {
    return { matched: true };
  }

  // 获取齿轮箱的接口数据
  const inputInterfaces = (gearbox as any).inputInterfaces;
  if (!inputInterfaces) {
    // 无接口数据，返回不匹配但可能需要转接
    return {
      matched: false,
      type: interfaceType,
      spec: interfaceSpec,
      needsAdapter: true
    };
  }

  // 检查SAE接口
  if (interfaceType === 'sae') {
    const saeInterfaces = inputInterfaces.sae as string[] | undefined;
    if (Array.isArray(saeInterfaces) && saeInterfaces.length > 0) {
      // 标准化规格名称进行比较 (SAE14寸 vs SAE 14寸)
      const normalizedSpec = interfaceSpec.replace(/\s+/g, '').toUpperCase();
      const matched = saeInterfaces.some(spec => {
        const normalizedGbSpec = spec.replace(/\s+/g, '').toUpperCase();
        return normalizedGbSpec === normalizedSpec ||
               normalizedGbSpec.includes(normalizedSpec) ||
               normalizedSpec.includes(normalizedGbSpec);
      });

      if (matched) {
        return {
          matched: true,
          type: 'sae',
          spec: interfaceSpec
        };
      }
    }
    // SAE接口不匹配
    return {
      matched: false,
      type: 'sae',
      spec: interfaceSpec,
      needsAdapter: true
    };
  }

  // 检查国内机接口
  if (interfaceType === 'domestic') {
    const domesticInterfaces = inputInterfaces.domestic as string[] | undefined;
    if (Array.isArray(domesticInterfaces) && domesticInterfaces.length > 0) {
      // 标准化规格名称进行比较 (φ450 vs Φ450)
      const normalizedSpec = interfaceSpec.replace(/[Φφ]/g, 'φ').replace(/\s+/g, '');
      const matched = domesticInterfaces.some(spec => {
        const normalizedGbSpec = spec.replace(/[Φφ]/g, 'φ').replace(/\s+/g, '');
        return normalizedGbSpec === normalizedSpec;
      });

      if (matched) {
        return {
          matched: true,
          type: 'domestic',
          spec: interfaceSpec
        };
      }
    }
    // 国内机接口不匹配
    return {
      matched: false,
      type: 'domestic',
      spec: interfaceSpec,
      needsAdapter: true
    };
  }

  return { matched: true };
}

/**
 * Fritsch-Carlson monotone cubic interpolation
 * Preserves monotonicity of the data, avoiding overshoot
 */
function monotoneCubicInterpolate(xs: number[], ys: number[], x: number): number | null {
  const n = xs.length;
  if (n < 2) return null;
  if (x <= xs[0]) return ys[0];
  if (x >= xs[n - 1]) return ys[n - 1];

  // Find interval
  let i = 0;
  while (i < n - 1 && xs[i + 1] < x) i++;

  const h = xs[i + 1] - xs[i];
  if (h === 0) return ys[i];

  // Compute slopes
  const delta: number[] = [];
  for (let j = 0; j < n - 1; j++) {
    delta.push((ys[j + 1] - ys[j]) / (xs[j + 1] - xs[j]));
  }

  // Fritsch-Carlson tangents
  const m: number[] = new Array(n);
  m[0] = delta[0];
  m[n - 1] = delta[n - 2];
  for (let j = 1; j < n - 1; j++) {
    if (delta[j - 1] * delta[j] <= 0) {
      m[j] = 0;
    } else {
      m[j] = (delta[j - 1] + delta[j]) / 2;
    }
  }

  // Monotonicity constraints
  for (let j = 0; j < n - 1; j++) {
    if (Math.abs(delta[j]) < 1e-12) {
      m[j] = 0;
      m[j + 1] = 0;
    } else {
      const alpha = m[j] / delta[j];
      const beta = m[j + 1] / delta[j];
      const sq = alpha * alpha + beta * beta;
      if (sq > 9) {
        const tau = 3 / Math.sqrt(sq);
        m[j] = tau * alpha * delta[j];
        m[j + 1] = tau * beta * delta[j];
      }
    }
  }

  // Hermite interpolation
  const t = (x - xs[i]) / h;
  const t2 = t * t;
  const t3 = t2 * t;
  const h00 = 2 * t3 - 3 * t2 + 1;
  const h10 = t3 - 2 * t2 + t;
  const h01 = -2 * t3 + 3 * t2;
  const h11 = t3 - t2;

  return h00 * ys[i] + h10 * h * m[i] + h01 * ys[i + 1] + h11 * h * m[i + 1];
}

// ============= 约束放宽建议生成 =============

/**
 * 测试放宽各项约束后能解锁多少额外匹配型号
 * 在选型失败时调用，帮助用户了解如何调整参数
 */
function generateRelaxationSuggestions(
  gearboxes: Gearbox[],
  enginePower: number,
  engineSpeed: number,
  targetRatio: number,
  thrustRequirement: number,
  rejectionReasons: RejectionReasons,
  minCapacityMargin: number
): RelaxationSuggestion[] {
  const suggestions: RelaxationSuggestion[] = [];
  const requiredTC = enginePower / engineSpeed;

  // Helper: check if a gearbox passes speed filter
  const passesSpeed = (g: Gearbox): boolean => {
    if (!Array.isArray(g.inputSpeedRange) || g.inputSpeedRange.length < 2) return true;
    let [minSpd, maxSpd] = g.inputSpeedRange;
    if (minSpd > maxSpd) [minSpd, maxSpd] = [maxSpd, minSpd];
    return engineSpeed >= minSpd && engineSpeed <= maxSpd;
  };

  // Helper: check if a gearbox has any ratio within a given tolerance
  const hasRatioWithin = (g: Gearbox, tolerancePct: number): boolean => {
    if (!Array.isArray(g.ratios)) return false;
    return g.ratios.some((r: number) =>
      typeof r === 'number' && !isNaN(r) && r > 0 &&
      (Math.abs(r - targetRatio) / targetRatio) * 100 <= tolerancePct
    );
  };

  // Helper: check if a gearbox has capacity meeting a given minimum margin
  const hasCapacityWithMargin = (g: Gearbox, minMarginPct: number): boolean => {
    const tcpr = (g as any).transmissionCapacityPerRatio as number[] | undefined;
    const tc = g.transferCapacity;
    const caps = Array.isArray(tcpr) ? tcpr : (Array.isArray(tc) ? tc : []);
    return caps.some((c: any) => {
      if (typeof c !== 'number' || c <= 0) return false;
      return ((c - requiredTC) / requiredTC) * 100 >= minMarginPct;
    });
  };

  // 1. Test: relax ratio tolerance to 30% (from default ~25%)
  if (rejectionReasons.ratioOutOfRange > 0) {
    const relaxedModels = gearboxes.filter(g => {
      if (!g || !g.model) return false;
      if (!passesSpeed(g)) return false;
      // Must have ratio within 30% but NOT within 25% (i.e. newly unlocked)
      return hasRatioWithin(g, 30) && !hasRatioWithin(g, 25);
    });
    if (relaxedModels.length > 0) {
      suggestions.push({
        parameter: '速比偏差容差',
        currentValue: '默认(25%)',
        suggestedValue: '放宽至30%',
        additionalMatches: relaxedModels.length,
        models: relaxedModels.slice(0, 3).map(g => g.model || '')
      });
    }
  }

  // 2. Test: relax speed range by +/-10%
  if (rejectionReasons.speedRange > 0) {
    const relaxedSpeedLow = engineSpeed * 0.9;
    const relaxedSpeedHigh = engineSpeed * 1.1;
    const relaxedModels = gearboxes.filter(g => {
      if (!g || !g.model) return false;
      if (!Array.isArray(g.inputSpeedRange) || g.inputSpeedRange.length < 2) return false;
      let [minSpd, maxSpd] = g.inputSpeedRange;
      if (minSpd > maxSpd) [minSpd, maxSpd] = [maxSpd, minSpd];
      // Would fail with exact speed but pass with relaxed range
      const failsExact = engineSpeed < minSpd || engineSpeed > maxSpd;
      const passesRelaxed = relaxedSpeedLow <= maxSpd && relaxedSpeedHigh >= minSpd;
      return failsExact && passesRelaxed;
    });
    if (relaxedModels.length > 0) {
      suggestions.push({
        parameter: '主机转速',
        currentValue: `${engineSpeed} rpm`,
        suggestedValue: `${Math.round(relaxedSpeedLow)}-${Math.round(relaxedSpeedHigh)} rpm (±10%)`,
        additionalMatches: relaxedModels.length,
        models: relaxedModels.slice(0, 3).map(g => g.model || '')
      });
    }
  }

  // 3. Test: relax capacity margin to 5% (from default 10%)
  if (rejectionReasons.capacityTooLow > 0 && minCapacityMargin > 5) {
    const relaxedModels = gearboxes.filter(g => {
      if (!g || !g.model) return false;
      if (!passesSpeed(g)) return false;
      if (!hasRatioWithin(g, 25)) return false;
      // Has capacity with 5% margin but not with current min margin
      return hasCapacityWithMargin(g, 5) && !hasCapacityWithMargin(g, minCapacityMargin);
    });
    if (relaxedModels.length > 0) {
      suggestions.push({
        parameter: '最小容量余量',
        currentValue: `${minCapacityMargin}% (JB/CCS标准)`,
        suggestedValue: '5% (需船级社确认)',
        additionalMatches: relaxedModels.length,
        models: relaxedModels.slice(0, 3).map(g => g.model || '')
      });
    }
  }

  // 4. Test: remove thrust requirement
  if (rejectionReasons.thrustInsufficient > 0 && thrustRequirement > 0) {
    const relaxedModels = gearboxes.filter(g => {
      if (!g || !g.model) return false;
      if (!passesSpeed(g)) return false;
      if (!hasRatioWithin(g, 25)) return false;
      if (!hasCapacityWithMargin(g, minCapacityMargin)) return false;
      // Would pass everything except thrust
      const thrustFails = typeof g.thrust === 'number' && g.thrust < thrustRequirement;
      return thrustFails;
    });
    if (relaxedModels.length > 0) {
      suggestions.push({
        parameter: '推力要求',
        currentValue: `${thrustRequirement} kN`,
        suggestedValue: '不限 (另行配置推力轴承)',
        additionalMatches: relaxedModels.length,
        models: relaxedModels.slice(0, 3).map(g => g.model || '')
      });
    }
  }

  // 5. Test: reduce power by 10% (suggest engine re-evaluation)
  if (rejectionReasons.capacityTooLow > 0) {
    const reducedPower = enginePower * 0.9;
    const reducedTC = reducedPower / engineSpeed;
    const relaxedModels = gearboxes.filter(g => {
      if (!g || !g.model) return false;
      if (!passesSpeed(g)) return false;
      if (!hasRatioWithin(g, 25)) return false;
      const tcpr = (g as any).transmissionCapacityPerRatio as number[] | undefined;
      const tc = g.transferCapacity;
      const caps = Array.isArray(tcpr) ? tcpr : (Array.isArray(tc) ? tc : []);
      const passesReduced = caps.some((c: any) =>
        typeof c === 'number' && c > 0 && ((c - reducedTC) / reducedTC) * 100 >= minCapacityMargin
      );
      const failsOriginal = !hasCapacityWithMargin(g, minCapacityMargin);
      return passesReduced && failsOriginal;
    });
    if (relaxedModels.length > 0) {
      suggestions.push({
        parameter: '发动机功率',
        currentValue: `${enginePower} kW`,
        suggestedValue: `${Math.round(reducedPower)} kW (-10%, 重新评估主机选型)`,
        additionalMatches: relaxedModels.length,
        models: relaxedModels.slice(0, 3).map(g => g.model || '')
      });
    }
  }

  return suggestions.sort((a, b) => b.additionalMatches - a.additionalMatches);
}

/**
 * Aggregate relaxation suggestions from multiple sub-results (used by autoSelectGearbox)
 * Merges suggestions with the same parameter, summing counts and deduplicating models
 */
function aggregateRelaxationSuggestions(allResults: InternalSelectionResult[]): RelaxationSuggestion[] {
  const mergedMap = new Map<string, RelaxationSuggestion>();

  for (const result of allResults) {
    if (!result.relaxationSuggestions) continue;
    for (const s of result.relaxationSuggestions) {
      const existing = mergedMap.get(s.parameter);
      if (existing) {
        existing.additionalMatches += s.additionalMatches;
        const modelSet = new Set([...existing.models, ...s.models]);
        existing.models = Array.from(modelSet).slice(0, 5);
      } else {
        mergedMap.set(s.parameter, { ...s, models: [...s.models] });
      }
    }
  }

  return Array.from(mergedMap.values()).sort((a, b) => b.additionalMatches - a.additionalMatches);
}

// ============= 主要函数 =============

/**
 * 齿轮箱选型函数
 * @param enginePower 发动机功率 kW
 * @param engineSpeed 发动机转速 rpm
 * @param targetRatio 目标减速比
 * @param thrustRequirement 推力需求 kN
 * @param gearboxType 齿轮箱系列
 * @param data 应用数据
 * @param options 选型选项
 * @returns 选型结果
 */
export const selectGearbox = (
  enginePower: number,
  engineSpeed: number,
  targetRatio: number,
  thrustRequirement: number = 0,
  gearboxType: GearboxSeries | string = 'HC',
  data: AppData | null,
  options: SelectionOptions = {}
): InternalSelectionResult => {
  logger.log(`开始 ${gearboxType} 系列齿轮箱选型:`, { enginePower, engineSpeed, targetRatio, thrustRequirement, options });

  // 日志记录：检查高弹数据是否正确加载
  logger.debug("flexibleCouplings 数据:", data?.flexibleCouplings?.length || 0, "条记录");
  if (data?.flexibleCouplings && data.flexibleCouplings.length > 0) {
    logger.debug("flexibleCouplings 示例:", data.flexibleCouplings[0]);
  }

  // --- Parameter validation ---
  if (!enginePower || enginePower <= 0) {
    return { success: false, message: '发动机功率必须大于0', recommendations: [] };
  }
  if (!engineSpeed || engineSpeed <= 0) {
    return { success: false, message: '发动机转速必须大于0', recommendations: [] };
  }
  if (!targetRatio || targetRatio <= 0) {
    return { success: false, message: '目标减速比必须大于0', recommendations: [] };
  }
  if (!data) {
    return { success: false, message: '选型数据不存在', recommendations: [] };
  }

  // --- Get specific gearbox data ---
  const gearboxTypeName = `${gearboxType.toLowerCase()}Gearboxes` as keyof AppData;
  let gearboxes = data[gearboxTypeName] as Gearbox[] | undefined;

  if (!Array.isArray(gearboxes) || gearboxes.length === 0) {
    logger.error(`${gearboxType} 系列数据无效或缺失`);
    return {
      success: false,
      message: `没有找到 ${gearboxType} 系列齿轮箱数据`,
      recommendations: [],
      gearboxTypeUsed: gearboxType
    };
  }

  // --- 混动模式筛选: PTI/PTO启用时优先选择P后缀型号 ---
  const { hybridConfig } = options;
  const isPTOorPTIEnabled = hybridConfig?.modes?.pto || hybridConfig?.modes?.pti;
  let hybridWarning: string | null = null;

  if (isPTOorPTIEnabled) {
    logger.log('混动模式已启用，筛选专用PTO型号 (P后缀)...');
    const originalCount = gearboxes.length;

    // 筛选带P后缀的型号
    const ptoGearboxes = gearboxes.filter(g => {
      if (!g || !g.model) return false;
      const model = g.model.toUpperCase();
      return model.endsWith('P') || model.includes('/1P');
    });

    if (ptoGearboxes.length > 0) {
      gearboxes = ptoGearboxes;
      logger.log(`找到 ${ptoGearboxes.length} 个专用PTO型号 (从 ${originalCount} 个中筛选)`);
    } else {
      hybridWarning = '未找到专用PTO型号(带P后缀)，当前显示标准型号，请确认混动接口兼容性';
      logger.warn(hybridWarning);
    }
  }

  // --- Calculate required capacity and torque ---
  if (engineSpeed <= 0) {
    return { success: false, message: '发动机转速必须大于0（除零保护）', recommendations: [] };
  }
  const requiredTransferCapacity = enginePower / engineSpeed;
  const engineTorque_Nm = (enginePower * 9550) / engineSpeed;
  logger.log(`计算参数: Required Capacity=${requiredTransferCapacity.toFixed(6)} kW/rpm, Engine Torque=${engineTorque_Nm.toFixed(2)} N·m`);

  // --- 创建失败原因收集器 ---
  const rejectionReasons: RejectionReasons = {
    speedRange: 0,
    ratioOutOfRange: 0,
    capacityTooLow: 0,
    capacityTooHigh: 0,
    thrustInsufficient: 0,
    interfaceMismatch: 0,          // 接口不匹配
    shaftMismatch: 0,              // 轴布置不匹配
    seriesCapabilityMismatch: 0    // 系列特性不匹配
  };

  // --- Copilot 对齐硬约束输入 (任一字段未指定则不触发该约束) ---
  // 推断桨型: autoInferPropellerType=true 且 seriesRequirements.propellerType 未显式指定时
  let effectivePropellerType: 'CPP' | 'FPP' | null | undefined =
    options.seriesRequirements?.propellerType ?? null;
  if (options.autoInferPropellerType && !effectivePropellerType) {
    const appField = options.application;
    const inferred = inferPropellerType(
      appField ? [appField] : [],
      enginePower
    );
    if (inferred) {
      effectivePropellerType = inferred;
      logger.log(`Copilot 规则 ${COPILOT_RULES.PROP_INFER}: 推断桨型 ${inferred} (来自应用=${appField || '无'}, 功率=${enginePower}kW)`);
    }
  }
  const copilotConstraints: CopilotConstraintInput = {
    propellerType: effectivePropellerType ?? null,
    twinEngine: options.twinEngine,
    gearType: options.gearType ?? null,
    minThrust: options.minThrust,
    classification: options.classification,
  };
  const copilotExclusions: CopilotExclusionStats = {};

  // --- 接口筛选参数 ---
  const { interfaceType, interfaceSpec, interfaceFilterMode = 'prefer' } = options;
  const hasInterfaceRequirement = interfaceType && interfaceType !== '无要求' && interfaceSpec;
  if (hasInterfaceRequirement) {
    logger.log(`接口筛选: ${interfaceType} ${interfaceSpec}, 模式: ${interfaceFilterMode}`);
  }

  // --- 可配置容差参数 ---
  const configTolerances = options.tolerances || DEFAULT_TOLERANCES;
  const MAX_RATIO_DIFF_PERCENT = configTolerances.maxRatioDiffPercent || 25;
  const MAX_CAPACITY_MARGIN = isPTOorPTIEnabled ? 500 : (configTolerances.maxCapacityMargin || 50);
  const MIN_CAPACITY_MARGIN = configTolerances.minCapacityMargin ?? 0;

  // 近似匹配列表
  let nearMatches: NearMatch[] = [];

  // --- Filter and score gearboxes ---
  const matchingGearboxes: MatchingGearbox[] = [];

  for (const gearbox of gearboxes) {
    if (!gearbox || typeof gearbox !== 'object' || !gearbox.model) {
      logger.warn(`Skipping invalid gearbox data in ${gearboxType} series:`, gearbox);
      continue;
    }

    // HCL是液压离合器(减速比1:1)，不参与齿轮箱选型
    if (gearbox.model.startsWith('HCL')) {
      continue;
    }

    let failureReason: string | null = null;

    // ============================================================
    // Copilot 对齐 9 条硬约束 (CPP/FPP/双机/双速/高速/推力/船级社)
    // 源: gearbox-copilot.html:1241-1265, 移植 src/utils/copilotRules.ts
    // ============================================================
    {
      const c = applyCopilotHardConstraints(gearbox, copilotConstraints);
      if (!c.pass) {
        DEBUG_LOG(`Copilot 硬约束排除 ${gearbox.model}: ${c.reason}`);
        if (c.rejectedRule) {
          copilotExclusions[c.rejectedRule] = (copilotExclusions[c.rejectedRule] || 0) + 1;
        }
        // 复用现有 rejectionReasons 桶, 让 UI 提示链路保持一致
        if (c.rejectedRule === COPILOT_RULES.THRUST_MIN) {
          rejectionReasons.thrustInsufficient++;
        } else {
          rejectionReasons.seriesCapabilityMismatch++;
        }
        continue;
      }
    }

    // 系列特性过滤（替代旧的离合器硬编码过滤）
    // 向后兼容: hasClutch → seriesRequirements.needsClutch
    const effectiveSeriesReqs = options.seriesRequirements || (
      (options as any).hasClutch != null
        ? { needsClutch: (options as any).hasClutch }
        : null
    );
    if (effectiveSeriesReqs) {
      const capMatch = matchesSeriesRequirements(gearbox.model, effectiveSeriesReqs);
      if (!capMatch.matched) {
        DEBUG_LOG(`Skipping ${gearbox.model}: 系列特性不匹配 - ${capMatch.reasons.join('; ')}`);
        rejectionReasons.seriesCapabilityMismatch++;
        failureReason = `系列特性不匹配: ${capMatch.reasons.join('; ')}`;
        continue;
      }
      // 保存匹配分数供后续评分使用
      (gearbox as any)._seriesCapScore = capMatch.score;
      (gearbox as any)._seriesCapReasons = capMatch.reasons;
    }

    // GW 子系列结构形式过滤（仅对 GW 系列生效；非 GW 直通）
    if (options.gwStructuralFilter && options.gwStructuralFilter.length > 0) {
      if (!matchesStructuralFilter(gearbox.model, options.gwStructuralFilter)) {
        DEBUG_LOG(`Skipping ${gearbox.model}: GW 结构形式不在过滤集 [${options.gwStructuralFilter.join(',')}]`);
        rejectionReasons.seriesCapabilityMismatch++;
        failureReason = `GW 结构形式过滤: 不在 [${options.gwStructuralFilter.join(', ')}] 集合内`;
        continue;
      }
    }

    // Check speed range
    if (Array.isArray(gearbox.inputSpeedRange) && gearbox.inputSpeedRange.length === 2) {
      // 防御性检查：确保 min < max，若数据反转则自动交换
      let [minSpeed, maxSpeed] = gearbox.inputSpeedRange;
      if (minSpeed > maxSpeed) {
        [minSpeed, maxSpeed] = [maxSpeed, minSpeed];
      }
      if (engineSpeed < minSpeed || engineSpeed > maxSpeed) {
        DEBUG_LOG(`Skipping ${gearbox.model}: Speed ${engineSpeed} outside range [${minSpeed}, ${maxSpeed}]`);
        rejectionReasons.speedRange++;
        failureReason = `转速 ${engineSpeed} 超出范围 [${minSpeed}, ${maxSpeed}]`;
        continue;
      }
    } else {
      logger.warn(`Gearbox ${gearbox.model} has invalid inputSpeedRange. Skipping range check.`);
    }

    // Check interface match (严格模式下筛选)
    let currentInterfaceMatch: InterfaceMatch = { matched: true };
    if (hasInterfaceRequirement) {
      currentInterfaceMatch = checkInterfaceMatch(gearbox, interfaceType, interfaceSpec);

      // 严格模式下，接口不匹配则跳过
      if (interfaceFilterMode === 'strict' && !currentInterfaceMatch.matched) {
        DEBUG_LOG(`Skipping ${gearbox.model}: Interface ${interfaceType} ${interfaceSpec} not matched`);
        rejectionReasons.interfaceMismatch++;
        failureReason = `接口 ${interfaceType} ${interfaceSpec} 不匹配`;
        continue;
      }
    }

    // Check shaft arrangement match
    if (options.shaftArrangement && (
      (options.shaftArrangement.axisAlignment && options.shaftArrangement.axisAlignment !== 'any') ||
      (options.shaftArrangement.reversingFunction && options.shaftArrangement.reversingFunction !== 'any')
    )) {
      const shaftMatch = matchesShaftArrangement(gearbox.model, options.shaftArrangement as any);
      if (!shaftMatch.matched) {
        DEBUG_LOG(`Skipping ${gearbox.model}: Shaft arrangement mismatch - ${shaftMatch.reason}`);
        rejectionReasons.shaftMismatch++;
        failureReason = `轴布置不匹配: ${shaftMatch.reason}`;
        continue;
      }
    }

    // Check ratios and find best match
    if (!Array.isArray(gearbox.ratios) || gearbox.ratios.length === 0) {
      logger.warn(`Gearbox ${gearbox.model} has no ratios.`);
      continue;
    }

    let bestRatioIndex = -1;
    let minRatioDiff = Infinity;
    let bestRatioDiffPercent = Infinity;

    gearbox.ratios.forEach((ratio, index) => {
      if (typeof ratio !== 'number' || isNaN(ratio) || ratio <= 0) {
        logger.warn(`Gearbox ${gearbox.model} has invalid ratio value at index ${index}: ${ratio}`);
        return;
      }
      const diff = Math.abs(ratio - targetRatio);
      const ratioDiffPercent = (diff / targetRatio) * 100;

      if (ratioDiffPercent <= MAX_RATIO_DIFF_PERCENT && diff < minRatioDiff) {
        minRatioDiff = diff;
        bestRatioIndex = index;
        bestRatioDiffPercent = ratioDiffPercent;
      }
    });

    if (bestRatioIndex === -1) {
      DEBUG_LOG(`Skipping ${gearbox.model}: No ratio within ${MAX_RATIO_DIFF_PERCENT}% of target ${targetRatio}`);
      rejectionReasons.ratioOutOfRange++;
      failureReason = `没有减速比在目标值 ${targetRatio} 的 ${MAX_RATIO_DIFF_PERCENT}% 偏差范围内`;

      // 查找最接近的比例作为近似匹配
      const closestRatioResult = gearbox.ratios.reduce<{ index: number; diffPercent: number; ratio: number }>(
        (closest, ratio, index) => {
          const diff = Math.abs(ratio - targetRatio);
          const diffPercent = (diff / targetRatio) * 100;
          if (diffPercent < closest.diffPercent) {
            return { index, diffPercent, ratio };
          }
          return closest;
        },
        { index: -1, diffPercent: Infinity, ratio: 0 }
      );

      if (closestRatioResult.index !== -1 && closestRatioResult.diffPercent <= 35) {
        // 计算该减速比对应的传递能力，防止近似匹配缺失容量数据
        let nearCapacity = 0;
        const nearTcpr = (gearbox as any).transmissionCapacityPerRatio as number[] | undefined;
        if (Array.isArray(nearTcpr) && nearTcpr[closestRatioResult.index] != null) {
          nearCapacity = nearTcpr[closestRatioResult.index];
        } else if (Array.isArray(gearbox.transferCapacity) && gearbox.transferCapacity[closestRatioResult.index] != null) {
          nearCapacity = gearbox.transferCapacity[closestRatioResult.index] as number;
        }
        const nearMargin = nearCapacity > 0
          ? ((nearCapacity - requiredTransferCapacity) / requiredTransferCapacity) * 100
          : -100;

        // 只有传递能力在合理范围内才作为近似匹配
        if (nearCapacity > 0 && nearMargin >= MIN_CAPACITY_MARGIN && nearMargin <= MAX_CAPACITY_MARGIN) {
          const nearMatch: NearMatch = {
            ...gearbox,
            selectedRatio: closestRatioResult.ratio,
            selectedCapacity: nearCapacity,
            capacityMargin: nearMargin,
            ratioDiffPercent: closestRatioResult.diffPercent,
            failureReason
          };
          nearMatches.push(nearMatch);
        }
      }
      continue;
    }

    // Get capacity for the best ratio (with interpolation for intermediate ratios)
    let capacity: number | undefined;

    // Helper: get capacity from available arrays at a given index
    const getCapacityAtIndex = (idx: number): number | undefined => {
      const tcpr = (gearbox as any).transmissionCapacityPerRatio as number[] | undefined;
      if (Array.isArray(tcpr) && idx < tcpr.length && typeof tcpr[idx] === 'number') return tcpr[idx];
      if (Array.isArray(gearbox.transferCapacity) && idx < gearbox.transferCapacity.length) {
        const tc = gearbox.transferCapacity[idx];
        if (typeof tc === 'number') return tc;
      }
      return undefined;
    };

    // Try interpolation if target ratio falls between two discrete ratios
    const bestRatio = gearbox.ratios[bestRatioIndex];
    const ratiosDiff = bestRatio - targetRatio;
    if (gearbox.ratios.length >= 2 && Math.abs(ratiosDiff) > 0.01) {
      // For 4+ ratios, use monotone cubic interpolation for better accuracy
      if (gearbox.ratios.length >= 4) {
        const allCaps: number[] = gearbox.ratios.map((_, idx) => getCapacityAtIndex(idx)).filter((c): c is number => c != null && c > 0);
        if (allCaps.length === gearbox.ratios.length) {
          const sortedIndices = gearbox.ratios.map((r, i) => i).sort((a, b) => gearbox.ratios[a] - gearbox.ratios[b]);
          const sortedRatios = sortedIndices.map(i => gearbox.ratios[i]);
          const sortedCaps = sortedIndices.map(i => allCaps[i]);
          const interpolated = monotoneCubicInterpolate(sortedRatios, sortedCaps, targetRatio);
          if (interpolated != null && interpolated > 0) {
            capacity = interpolated;
            DEBUG_LOG(`Gearbox ${gearbox.model} monotone cubic interpolated capacity: ${capacity.toFixed(6)} for ratio ${targetRatio} (${gearbox.ratios.length} ratios)`);
          }
        }
      }
      // Fall through to linear interpolation if cubic didn't produce a result
      if (capacity == null) {
        // Find the adjacent ratio on the other side of targetRatio
        let adjIndex = -1;
        if (ratiosDiff > 0 && bestRatioIndex > 0) {
          adjIndex = bestRatioIndex - 1;
        } else if (ratiosDiff < 0 && bestRatioIndex < gearbox.ratios.length - 1) {
          adjIndex = bestRatioIndex + 1;
        }
        if (adjIndex >= 0) {
          const adjRatio = gearbox.ratios[adjIndex];
          // Only interpolate if targetRatio is between the two ratios
          if ((bestRatio - targetRatio) * (adjRatio - targetRatio) < 0) {
            const capBest = getCapacityAtIndex(bestRatioIndex);
            const capAdj = getCapacityAtIndex(adjIndex);
            if (capBest != null && capAdj != null && capBest > 0 && capAdj > 0) {
              const t = (targetRatio - bestRatio) / (adjRatio - bestRatio);
              capacity = capBest + t * (capAdj - capBest);
              DEBUG_LOG(`Gearbox ${gearbox.model} linear interpolated capacity: ${capacity?.toFixed(6)} between ratio ${bestRatio}(${capBest}) and ${adjRatio}(${capAdj})`);
            }
          }
        }
      }
    }

    // Fallback: use exact index capacity if interpolation not applicable
    if (!capacity) {
      capacity = getCapacityAtIndex(bestRatioIndex);
      if (capacity != null) {
        DEBUG_LOG(`Gearbox ${gearbox.model} using capacity at index ${bestRatioIndex}: ${capacity}`);
      }
    }

    // Last resort: clamp index for mismatched arrays
    if (!capacity) {
      const tcpr = (gearbox as any).transmissionCapacityPerRatio as number[] | undefined;
      if (Array.isArray(tcpr) && tcpr.length > 0) {
        const clampedIdx = Math.min(bestRatioIndex, tcpr.length - 1);
        if (typeof tcpr[clampedIdx] === 'number' && tcpr[clampedIdx] > 0) {
          capacity = tcpr[clampedIdx];
          logger.warn(`Gearbox ${gearbox.model} using clamped transmissionCapacityPerRatio[${clampedIdx}]`);
        }
      }
      if (!capacity && Array.isArray(gearbox.transferCapacity) && gearbox.transferCapacity.length > 0) {
        const clampedIndex = Math.min(bestRatioIndex, gearbox.transferCapacity.length - 1);
        const tc = gearbox.transferCapacity[clampedIndex];
        if (typeof tc === 'number') {
          capacity = tc;
          logger.warn(`Gearbox ${gearbox.model} using fallback transferCapacity[${clampedIndex}] (ratioIndex=${bestRatioIndex}, arrayLen=${gearbox.transferCapacity.length})`);
        }
      }
    }

    // No valid data -> skip
    if (!capacity) {
      logger.warn(`Gearbox ${gearbox.model} has no valid capacity data.`);
      continue;
    }

    // Calculate capacity margin
    if (capacity <= 0) {
      logger.warn(`Skipping ${gearbox.model}: Capacity is not positive (${capacity})`);
      continue;
    }
    const capacityMargin = ((capacity - requiredTransferCapacity) / requiredTransferCapacity) * 100;

    // 检查容量余量要求
    if (capacity < requiredTransferCapacity) {
      DEBUG_LOG(`Skipping ${gearbox.model}: Capacity ${capacity} too low (Required ${requiredTransferCapacity})`);
      rejectionReasons.capacityTooLow++;
      failureReason = `传递能力 ${capacity} 不足以满足需求 ${requiredTransferCapacity.toFixed(6)}`;

      // 容量接近的情况保存为近似匹配(扩大到80%阈值，捕获更多候选)
      if (capacity >= requiredTransferCapacity * 0.80) {
        const nearMatch: NearMatch = {
          ...gearbox,
          selectedRatio: gearbox.ratios[bestRatioIndex],
          selectedCapacity: capacity,
          capacityMargin: ((capacity - requiredTransferCapacity) / requiredTransferCapacity) * 100,
          ratioDiffPercent: bestRatioDiffPercent,
          failureReason
        };
        nearMatches.push(nearMatch);
      }
      continue;
    }

    // 传递能力余量低于安全下限（硬过滤，0-5%余量不推荐）
    if (capacityMargin < MIN_CAPACITY_MARGIN) {
      DEBUG_LOG(`Gearbox ${gearbox.model} capacity margin ${capacityMargin.toFixed(1)}% below minimum ${MIN_CAPACITY_MARGIN}%, excluded`);
      rejectionReasons.capacityTooLow++;
      const nearMatch: NearMatch = {
        ...gearbox,
        selectedRatio: gearbox.ratios[bestRatioIndex],
        selectedCapacity: capacity,
        capacityMargin,
        ratioDiffPercent: bestRatioDiffPercent,
        failureReason: `传递能力余量 ${capacityMargin.toFixed(1)}% 低于最小要求 ${MIN_CAPACITY_MARGIN}%`
      };
      nearMatches.push(nearMatch);
      continue;
    }

    // 传递能力余量超过上限：加入近似匹配而非静默丢弃
    if (capacityMargin > MAX_CAPACITY_MARGIN) {
      DEBUG_LOG(`Gearbox ${gearbox.model} capacity margin ${capacityMargin.toFixed(1)}% exceeds ${MAX_CAPACITY_MARGIN}%, added to near-matches`);
      rejectionReasons.capacityTooHigh++;
      if (capacityMargin <= MAX_CAPACITY_MARGIN * 2) {
        const nearMatch: NearMatch = {
          ...gearbox,
          selectedRatio: gearbox.ratios[bestRatioIndex],
          selectedCapacity: capacity,
          capacityMargin,
          ratioDiffPercent: bestRatioDiffPercent,
          failureReason: `传递能力余量 ${capacityMargin.toFixed(1)}% 超过推荐上限 ${MAX_CAPACITY_MARGIN}%（偏大）`
        };
        nearMatches.push(nearMatch);
      }
      continue;
    }

    // Check thrust requirement
    let thrustMet = true;
    if (thrustRequirement > 0) {
      if (typeof gearbox.thrust === 'number' && !isNaN(gearbox.thrust)) {
        thrustMet = gearbox.thrust >= thrustRequirement;
        if (!thrustMet) {
          DEBUG_LOG(`Gearbox ${gearbox.model} thrust ${gearbox.thrust}kN does not meet requirement ${thrustRequirement}kN`);
          rejectionReasons.thrustInsufficient++;
          failureReason = `推力 ${gearbox.thrust}kN 不满足需求 ${thrustRequirement}kN`;

          // 推力60%-100%保存为近似匹配供参考，<60%直接丢弃
          if (gearbox.thrust >= thrustRequirement * 0.6) {
            const thrustPct = (gearbox.thrust / thrustRequirement * 100).toFixed(0);
            const nearMatch: NearMatch = {
              ...gearbox,
              selectedRatio: gearbox.ratios[bestRatioIndex],
              selectedCapacity: capacity,
              capacityMargin: capacityMargin,
              ratioDiffPercent: bestRatioDiffPercent,
              thrustMet: false,
              failureReason: gearbox.thrust < thrustRequirement * 0.8
                ? `推力严重不足: ${gearbox.thrust}kN 仅为需求 ${thrustRequirement}kN 的 ${thrustPct}% (安全风险)`
                : failureReason
            };
            nearMatches.push(nearMatch);
          }
          continue;
        }
      } else {
        // 无推力数据时加入近似匹配而非静默排除
        thrustMet = false;
        logger.debug(`Gearbox ${gearbox.model} has no thrust data, requirement ${thrustRequirement}kN cannot be verified, added to near-matches`);
        const nearMatch: NearMatch = {
          ...gearbox,
          selectedRatio: gearbox.ratios[bestRatioIndex],
          selectedCapacity: capacity,
          capacityMargin,
          ratioDiffPercent: bestRatioDiffPercent,
          thrustMet: false,
          failureReason: `无推力数据，无法验证 ${thrustRequirement}kN 需求`
        };
        nearMatches.push(nearMatch);
        continue;
      }
    }

    // Calculate ratio diff and safety factor
    const ratioSelected = gearbox.ratios[bestRatioIndex];
    const ratioDiffPercent = (Math.abs(ratioSelected - targetRatio) / targetRatio) * 100;
    const safetyFactor = capacity / requiredTransferCapacity;

    // Ensure price fields
    const gbBasePrice = gearbox.basePrice || (gearbox as any).price || 0;
    const gbDiscountRate = gearbox.discountRate ?? getStandardDiscountRate(gearbox.model);
    const gbFactoryPrice = gearbox.factoryPrice || calculateFactoryPrice({
      ...gearbox,
      basePrice: gbBasePrice,
      discountRate: gbDiscountRate
    });

    // 检查是否有特殊打包价格配置
    const gwConfig = getGWPackagePriceConfig(gearbox.model);

    // 处理GW特殊价格
    let gwPackagePrice: number | null = null;
    if (gwConfig && !gwConfig.isSmallGWModel) {
      gwPackagePrice = gwConfig.packagePrice;
    }

    const matchingGearbox: MatchingGearbox = {
      ...gearbox,
      selectedRatio: ratioSelected,
      selectedCapacity: capacity,
      capacityMargin: capacityMargin,
      thrustMet: thrustMet,
      ratio: ratioSelected,
      engineTorque: engineTorque_Nm,
      ratioDiffPercent: ratioDiffPercent,
      safetyFactor: safetyFactor,
      basePrice: gbBasePrice,
      price: gbBasePrice,
      discountRate: gbDiscountRate,
      factoryPrice: gbFactoryPrice,
      packagePrice: gwPackagePrice || gbFactoryPrice,
      marketPrice: gwPackagePrice || calculateMarketPrice({ factoryPrice: gbFactoryPrice }),
      hasSpecialPackagePrice: !!gwPackagePrice,
      gwPackageConfig: gwConfig,
      interfaceMatch: currentInterfaceMatch,  // 接口匹配结果
      _displayFields: {
        capacityText: `${capacity.toFixed(6)} kW/rpm`,
        requiredCapacityText: `${requiredTransferCapacity.toFixed(6)} kW/rpm`,
        capacityMarginText: `${capacityMargin.toFixed(1)}%`,
        selectedRatioText: ratioSelected.toFixed(2),
        ratioDiffText: `${ratioDiffPercent.toFixed(1)}%`,
      }
    };

    // 生成结构化安全警告
    const warnings: string[] = [];
    if (capacityMargin < 15) {
      warnings.push(`容量余量偏低 (${capacityMargin.toFixed(1)}%)，建议 ≥ 15%`);
    }
    if (thrustRequirement > 0 && thrustMet && typeof gearbox.thrust === 'number') {
      const thrustMarginPct = ((gearbox.thrust - thrustRequirement) / thrustRequirement) * 100;
      if (thrustMarginPct < 20) {
        warnings.push(`推力余量偏低 (${thrustMarginPct.toFixed(0)}%)，${gearbox.thrust}kN / 需求 ${thrustRequirement}kN`);
      }
    }
    if (ratioDiffPercent > 5) {
      warnings.push(`速比偏差 ${ratioDiffPercent.toFixed(1)}%，目标 ${targetRatio.toFixed(2)} vs 实际 ${ratioSelected.toFixed(2)}`);
    }
    (matchingGearbox as any).warnings = warnings;

    matchingGearboxes.push(matchingGearbox);
  }

  logger.log(`${gearboxType} 系列找到 ${matchingGearboxes.length} 个初步匹配的齿轮箱`);

  // --- 可配置评分权重 (提前声明，近似匹配和正选评分共用) ---
  // 优先级: options.scoringWeights (调用方显式传) > scoringProfile (legacy/copilot/copilot-strict) > 默认 Copilot
  const scoringWeights = options.scoringWeights || (
    options.scoringProfile === 'legacy'
      ? DEFAULT_SCORING_WEIGHTS
      : options.scoringProfile === 'copilot-strict'
        ? COPILOT_STRICT_SCORING_WEIGHTS
        : COPILOT_SCORING_WEIGHTS  // 默认 'copilot' (含未指定情形)
  );
  const W_COST = scoringWeights.costEffectiveness || 30;
  const W_RATIO = scoringWeights.ratioMatch || 21;
  const W_CAPACITY = scoringWeights.capacityMargin || 12;
  const W_THRUST = scoringWeights.thrustSatisfy || 8;
  const W_PACKAGE = scoringWeights.specialPackage || 5;
  const W_SHAFT = scoringWeights.shaftMatch || 7;
  const W_SERIES = scoringWeights.seriesCapabilityFit || 9;

  // 如果没有匹配的齿轮箱，返回近似匹配
  if (matchingGearboxes.length === 0) {
    logger.log(`匹配失败原因统计:`, rejectionReasons);

    if (nearMatches.length > 0) {
      // 对近似匹配使用与正选相同的7维加权评分体系
      nearMatches.forEach(match => {
        let score = 0;

        // 1. 能力余量评分 — 钟形曲线(与正选一致)，负余量给最低分
        if (match.capacityMargin !== undefined) {
          if (match.capacityMargin >= 0) {
            const optimalMargin = 15;
            const marginDev = (match.capacityMargin - optimalMargin) / 15;
            score += W_CAPACITY * Math.exp(-0.8 * marginDev * marginDev);
          } else if (match.capacityMargin >= -15) {
            score += W_CAPACITY * 0.1; // 传递能力不足，安全风险
          }
        }

        // 2. 减速比匹配评分 — 平滑幂函数(与正选一致)，近似匹配允许到35%
        if (match.ratioDiffPercent !== undefined) {
          const nearRatioFit = Math.max(0, 1 - Math.pow(match.ratioDiffPercent / 37, 1.8));
          score += W_RATIO * nearRatioFit;
        }

        // 3. 推力评分 (推力为安全硬约束，不足时严格降级)
        if (thrustRequirement > 0) {
          if (match.thrustMet === true) {
            score += W_THRUST;
          } else if (typeof match.thrust === 'number' && match.thrust > 0) {
            const thrustRatio = match.thrust / thrustRequirement;
            if (thrustRatio >= 0.8) {
              // 80%-100%: 仅给少量分数，标记需关注
              score += W_THRUST * 0.3;
            } else {
              // <80%: 不给分并施加惩罚，安全风险
              score -= W_THRUST * 0.5;
            }
          }
        } else {
          score += W_THRUST * 0.5;
        }

        // 4. 打包价加分
        const gwConfig = getGWPackagePriceConfig(match.model || '');
        if (gwConfig && !gwConfig.isSmallGWModel) {
          score += W_PACKAGE;
        }

        // 5. 轴布置基础分 (近似匹配无法确定匹配度，给50%)
        score += W_SHAFT * 0.5;

        // 6. 系列适配基础分
        score += W_SERIES * 0.5;

        // 7. 性价比基础分 (近似匹配无法跨候选归一化，按价格有无给分)
        const nearBasePrice = match.basePrice || (match as any).price || 0;
        if (nearBasePrice > 0) {
          score += W_COST * 0.5;
        } else {
          score += W_COST * 0.4;  // 缺价格型号给中性分，不惩罚也不奖励
          (match as any)._priceDataMissing = true;
        }

        match.score = Math.max(0, Math.min(100, Math.round(score)));

        // 生成近似匹配结构化警告
        const matchWarnings: string[] = [];
        if (match.failureReason) {
          matchWarnings.push(match.failureReason);
        }
        if (match.capacityMargin !== undefined && match.capacityMargin < 0) {
          matchWarnings.push(`传递能力不足 (余量 ${match.capacityMargin.toFixed(1)}%)，存在过载风险`);
        }
        if (thrustRequirement > 0 && !match.thrustMet) {
          const thrust = typeof match.thrust === 'number' ? match.thrust : 0;
          matchWarnings.push(`推力不足: ${thrust}kN / 需求 ${thrustRequirement}kN`);
        }
        if (match.ratioDiffPercent !== undefined && match.ratioDiffPercent > 10) {
          matchWarnings.push(`速比偏差过大 (${match.ratioDiffPercent.toFixed(1)}%)`);
        }
        (match as any).warnings = matchWarnings;
        (match as any).isPartialMatch = true;

        // 确保价格字段
        const gbBasePrice = match.basePrice || match.price || 0;
        const gbDiscountRate = match.discountRate ?? getStandardDiscountRate(match.model || '');
        const gbFactoryPrice = match.factoryPrice || calculateFactoryPrice({
          model: match.model || '',
          basePrice: gbBasePrice,
          discountRate: gbDiscountRate
        });

        // 处理GW特殊价格
        let gwPackagePrice: number | null = null;
        if (gwConfig && !gwConfig.isSmallGWModel) {
          gwPackagePrice = gwConfig.packagePrice;
          match.hasSpecialPackagePrice = true;
          match.gwPackageConfig = gwConfig;
        }

        match.basePrice = gbBasePrice;
        match.price = gbBasePrice;
        match.discountRate = gbDiscountRate;
        match.factoryPrice = gbFactoryPrice;
        match.packagePrice = gwPackagePrice || gbFactoryPrice;
        match.marketPrice = gwPackagePrice || calculateMarketPrice({ factoryPrice: gbFactoryPrice });
      });

      // 排序
      nearMatches.sort((a, b) => {
        if (a.hasSpecialPackagePrice !== b.hasSpecialPackagePrice) {
          return a.hasSpecialPackagePrice ? -1 : 1;
        }
        return (b.score || 0) - (a.score || 0);
      });

      nearMatches = nearMatches.slice(0, 5);

      const mainReason = Object.entries(rejectionReasons)
        .sort((a, b) => b[1] - a[1])
        .filter(entry => entry[1] > 0)
        .map(([reason]) => {
          switch (reason) {
            case 'speedRange': return '转速超出范围';
            case 'ratioOutOfRange': return '减速比偏差过大';
            case 'capacityTooLow': return '传递能力不足';
            case 'capacityTooHigh': return '传递能力余量过大';
            case 'thrustInsufficient': return '推力要求不满足';
            case 'interfaceMismatch': return `接口(${interfaceSpec})不匹配`;
            case 'shaftMismatch': return '轴布置方式不匹配';
            default: return reason;
          }
        })
        .join('、');

      // Generate constraint relaxation suggestions
      const relaxationSuggestions = generateRelaxationSuggestions(
        gearboxes, enginePower, engineSpeed, targetRatio,
        thrustRequirement, rejectionReasons, MIN_CAPACITY_MARGIN
      );

      return {
        success: false,
        message: `没有找到符合所有条件的 ${gearboxType} 系列齿轮箱，主要原因: ${mainReason}`,
        recommendations: nearMatches as SelectionRecommendation[],
        gearboxTypeUsed: gearboxType,
        rejectionReasons,
        relaxationSuggestions,
        engineTorque: engineTorque_Nm,
        requiredTransferCapacity: requiredTransferCapacity,
        warning: "找到一些接近条件的齿轮箱，但它们不满足全部选型要求。请考虑调整输入参数。"
      };
    }

    // Generate constraint relaxation suggestions for empty results too
    const relaxationSuggestions = generateRelaxationSuggestions(
      gearboxes, enginePower, engineSpeed, targetRatio,
      thrustRequirement, rejectionReasons, MIN_CAPACITY_MARGIN
    );

    return {
      success: false,
      message: `没有找到符合条件的 ${gearboxType} 系列齿轮箱`,
      recommendations: [],
      gearboxTypeUsed: gearboxType,
      rejectionReasons,
      relaxationSuggestions
    };
  }

  // --- Score the matching gearboxes (权重已在上方声明) ---
  const scoredGearboxes = matchingGearboxes.map(gearbox => {
    let score = 0;

    // 1. Capacity Margin Score — 钟形曲线，最优点随工况系数 K 动态偏移 (P1#2, 2026-04-24)
    // I类稳定 K=1.3 → optimal 12%;  III类中等 K=1.75 → 15% (默认);  V类剧烈 K=2.25 → 19%
    // 低工况允许更紧裕度,高工况推动更大裕度,避免"一刀切 15%"
    {
      const wc = String(options.workCondition || '');
      let workFactorK = 1.75; // III 类中等 默认
      if (wc.includes('I类')) workFactorK = 1.3;
      else if (wc.includes('II类')) workFactorK = 1.5;
      else if (wc.includes('III类')) workFactorK = 1.75;
      else if (wc.includes('IV类')) workFactorK = 2.0;
      else if (wc.includes('V类')) workFactorK = 2.25;
      const kRatio = Math.max(0.8, Math.min(1.3, workFactorK / 1.75));
      const optimalMargin = 15 * kRatio; // 12..19.5
      const marginDev = (gearbox.capacityMargin - optimalMargin) / 15;
      const capacityFit = Math.exp(-0.8 * marginDev * marginDev);
      score += W_CAPACITY * capacityFit;
    }

    // 2. Ratio Match Score — 平滑幂函数，消除阶梯断崖
    {
      const ratioFit = Math.max(0, 1 - Math.pow(gearbox.ratioDiffPercent / (MAX_RATIO_DIFF_PERCENT * 1.05), 1.8));
      score += W_RATIO * ratioFit;
    }

    // 3. Cost-Effectiveness Score - calculated later
    const basePrice = gearbox.basePrice || gearbox.price || 0;

    // 4. Thrust Match Score — 连续余量评分
    if (thrustRequirement > 0) {
      if (gearbox.thrustMet && typeof gearbox.thrust === 'number' && gearbox.thrust > 0) {
        const thrustMarginPct = ((gearbox.thrust - thrustRequirement) / thrustRequirement) * 100;
        // 推力余量越大越好，但收益递减: 0%→70%基础分，20%+→100%
        const thrustFit = 0.7 + 0.3 * Math.min(1, thrustMarginPct / 20);
        score += W_THRUST * thrustFit;
        (gearbox as any)._thrustMargin = thrustMarginPct;
      } else if (gearbox.thrustMet) {
        score += W_THRUST * 0.7; // 无推力数据但标记已满足
      } else {
        score += 0;
      }
    } else {
      score += W_THRUST * 0.5;
    }

    // 5. Special package price bonus
    if (gearbox.hasSpecialPackagePrice) {
      score += W_PACKAGE;
      logger.debug(`为GW系列特殊打包价格齿轮箱 ${gearbox.model} 加分${W_PACKAGE}分`);
    }

    // 6. Interface Match Score (仅在prefer模式下加分，权重来自统一配置)
    const W_INTERFACE = scoringWeights.interfaceMatch || 8;
    if (hasInterfaceRequirement && gearbox.interfaceMatch) {
      if (gearbox.interfaceMatch.matched) {
        score += W_INTERFACE;
        logger.debug(`齿轮箱 ${gearbox.model} 接口匹配，加分${W_INTERFACE}分`);
      } else if (gearbox.interfaceMatch.needsAdapter) {
        // 需要转接的情况扣分
        score -= W_INTERFACE * 0.5;
        logger.debug(`齿轮箱 ${gearbox.model} 接口需转接，扣分${W_INTERFACE * 0.5}分`);
      }
    }

    // 7. Shaft Arrangement Match Score
    if (options.shaftArrangement && (
      (options.shaftArrangement.axisAlignment && options.shaftArrangement.axisAlignment !== 'any') ||
      (options.shaftArrangement.reversingFunction && options.shaftArrangement.reversingFunction !== 'any')
    )) {
      // 已经通过了过滤，说明匹配成功，加满分
      score += W_SHAFT;
      logger.debug(`齿轮箱 ${gearbox.model} 轴布置匹配，加分${W_SHAFT}分`);
    } else {
      // 无轴布置要求时给基础分
      score += W_SHAFT * 0.5;
    }

    // 8. Series Capability Fit Score
    if ((gearbox as any)._seriesCapScore != null) {
      score += W_SERIES * ((gearbox as any)._seriesCapScore / 10);
      if ((gearbox as any)._seriesCapReasons?.length > 0) {
        logger.debug(`齿轮箱 ${gearbox.model} 系列适配: ${(gearbox as any)._seriesCapReasons.join(', ')}, 加分${(W_SERIES * (gearbox as any)._seriesCapScore / 10).toFixed(1)}`);
      }
    } else {
      // 无系列要求时给基础分
      score += W_SERIES * 0.5;
    }

    // 9. Critical Speed Penalty (P0#6, 2026-04-24) — 扭振共振禁区强制校核
    // 工作频率落在 [0.8ω_c, 1.2ω_c] 扣 22 分 (共振); 裕度<20% 扣 10 分 (接近临界)
    // 降低门槛到 engineSpeed > 2000 以覆盖更多船用柴油机工况
    if (engineSpeed > 2000 || isPTOorPTIEnabled) {
      const csCheck = performCriticalSpeedCheck({
        enginePower,
        engineSpeed,
        ratio: gearbox.selectedRatio,
        isPTO: !!isPTOorPTIEnabled
      });
      if (csCheck) {
        (gearbox as any).criticalSpeedCheck = csCheck;
        if (csCheck.isInForbiddenZone) {
          score -= 22;
          logger.log(`齿轮箱 ${gearbox.model} 临界转速禁区: score-22 (${csCheck.recommendation})`);
        } else if (csCheck.marginPercent < 20) {
          score -= 10;
          logger.log(`齿轮箱 ${gearbox.model} 临界转速裕度${csCheck.marginPercent}%: score-10`);
        }
      }
    }

    gearbox.score = score;
    gearbox._scoringWeights = scoringWeights;

    // Add price per capacity for normalization
    if (basePrice > 0 && gearbox.selectedCapacity > 0) {
      gearbox._pricePerCapacity = basePrice / gearbox.selectedCapacity;
    } else {
      gearbox._pricePerCapacity = Infinity;
      gearbox._priceDataMissing = true;
    }

    return gearbox;
  });

  // Normalize Price Score + TCO生命周期成本调整
  if (scoredGearboxes.length > 1) {
    let minPPC = Infinity;
    let maxPPC = 0;
    let minWeight = Infinity;
    let maxWeight = 0;
    scoredGearboxes.forEach(g => {
      if (g._pricePerCapacity !== Infinity) {
        if (g._pricePerCapacity! < minPPC) minPPC = g._pricePerCapacity!;
        if (g._pricePerCapacity! > maxPPC) maxPPC = g._pricePerCapacity!;
      }
      // 收集重量范围用于TCO计算
      if (typeof g.weight === 'number' && g.weight > 0) {
        if (g.weight < minWeight) minWeight = g.weight;
        if (g.weight > maxWeight) maxWeight = g.weight;
      }
    });

    const priceRange = maxPPC - minPPC;
    const weightRange = maxWeight - minWeight;

    // 先计算所有有价格型号的priceScore，用于求中位数给缺价格型号
    const pricedScores: number[] = [];
    scoredGearboxes.forEach(g => {
      if (g._pricePerCapacity !== Infinity) {
        let ps = 0;
        if (priceRange > 0) {
          ps = W_COST * (1 - (g._pricePerCapacity! - minPPC) / priceRange);
        } else {
          ps = W_COST;
        }
        pricedScores.push(ps);
      }
    });
    // 计算有价格型号的中位数分数，作为缺价格型号的中性得分
    let medianPriceScore = W_COST * 0.5; // 默认中性值
    if (pricedScores.length > 0) {
      const sorted = [...pricedScores].sort((a, b) => a - b);
      const mid = Math.floor(sorted.length / 2);
      medianPriceScore = sorted.length % 2 !== 0
        ? sorted[mid]
        : (sorted[mid - 1] + sorted[mid]) / 2;
    }

    scoredGearboxes.forEach(g => {
      let priceScore = 0;
      if (g._pricePerCapacity !== Infinity) {
        if (priceRange > 0) {
          priceScore = W_COST * (1 - (g._pricePerCapacity! - minPPC) / priceRange);
        } else {
          priceScore = W_COST;
        }
      } else {
        // 缺价格型号：使用有价格型号的中位数分数，不惩罚也不奖励
        priceScore = medianPriceScore;
      }

      // TCO调整1: 过大选型增加维护/能耗成本 (余量>30%时渐进惩罚，最多15%)
      if (g.capacityMargin > 30) {
        const oversizePenalty = Math.min(0.15, (g.capacityMargin - 30) / 200);
        priceScore *= (1 - oversizePenalty);
      }
      // TCO调整2: 同能力下重量越大运维成本越高 (最多8%惩罚)
      if (typeof g.weight === 'number' && g.weight > 0 && weightRange > 0) {
        const weightPenalty = ((g.weight - minWeight) / weightRange) * 0.08;
        priceScore *= (1 - weightPenalty);
      }

      g.score = Math.max(0, Math.min(100, Math.round((g.score || 0) + priceScore)));
      delete g._pricePerCapacity;
    });
  } else if (scoredGearboxes.length === 1) {
    if ((scoredGearboxes[0].basePrice || scoredGearboxes[0].price) > 0) {
      scoredGearboxes[0].score = Math.max(0, Math.min(100, Math.round((scoredGearboxes[0].score || 0) + W_COST)));
    } else {
      // 缺价格单型号：给50%中性分
      scoredGearboxes[0].score = Math.max(0, Math.min(100, Math.round((scoredGearboxes[0].score || 0) + W_COST * 0.5)));
    }
  }

  // --- Sort scored gearboxes (阈值来自可配置SORTING_THRESHOLDS) ---
  const ST = SORTING_THRESHOLDS;
  scoredGearboxes.sort((a, b) => {
    // 1. 性能满足检查（余量>=0视为满足）
    const aOk = a.capacityMargin >= 0;
    const bOk = b.capacityMargin >= 0;
    if (aOk !== bOk) return aOk ? -1 : 1;

    // 1.5. 接口匹配优先 (有接口要求时)
    if (hasInterfaceRequirement) {
      const aMatched = a.interfaceMatch?.matched || false;
      const bMatched = b.interfaceMatch?.matched || false;
      if (aMatched !== bMatched) return aMatched ? -1 : 1;
    }

    // 2. 综合评分优先 (阈值可配置，默认3分)
    if (Math.abs((b.score || 0) - (a.score || 0)) > ST.scoreDiffThreshold) {
      return (b.score || 0) - (a.score || 0);
    }

    // 3. 按单位容量价格排序 (阈值可配置，默认1000元)
    const aPrice = a.factoryPrice || a.basePrice || a.price || 0;
    const bPrice = b.factoryPrice || b.basePrice || b.price || 0;
    if (aPrice > 0 && bPrice > 0 && a.selectedCapacity > 0 && b.selectedCapacity > 0) {
      const aPricePerCap = aPrice / a.selectedCapacity;
      const bPricePerCap = bPrice / b.selectedCapacity;
      if (Math.abs(aPricePerCap - bPricePerCap) > ST.pricePerCapacityDiffThreshold) {
        return aPricePerCap - bPricePerCap;
      }
    }

    // 4. 特殊打包价格
    if (a.hasSpecialPackagePrice !== b.hasSpecialPackagePrice) {
      return a.hasSpecialPackagePrice ? -1 : 1;
    }

    // 5. 余量最优 (最优中心点可配置，默认12.5%)
    const aOptimalMargin = Math.abs(a.capacityMargin - ST.optimalCapacityMargin);
    const bOptimalMargin = Math.abs(b.capacityMargin - ST.optimalCapacityMargin);
    return aOptimalMargin - bOptimalMargin;
  });

  // --- Prepare result ---
  const recommendations = scoredGearboxes;
  const topRecommendation = recommendations.length > 0 ? recommendations[0] : null;

  let finalCouplingResult: CouplingMatchResult | null = null;
  let finalPumpResult: PumpMatchResult | null = null;
  let couplingWarning: string | undefined;
  let pumpWarning: string | undefined;

  if (topRecommendation) {
    logger.log("开始为齿轮箱选择联轴器...");
    logger.debug("flexibleCouplings数据:", data.flexibleCouplings?.length || 0, "条");

    const couplingRes = selectFlexibleCoupling(
      engineTorque_Nm,
      topRecommendation.model,
      data.flexibleCouplings,
      couplingSpecificationsMap,
      options.workCondition,
      options.temperature,
      options.hasCover,
      engineSpeed,
      options.workFactorMode  // 工况系数模式: FACTORY | JB_CCS
    );

    finalCouplingResult = couplingRes.success ? couplingRes as unknown as CouplingMatchResult : null;
    couplingWarning = couplingRes.warning;

    const pumpRes = selectStandbyPump(topRecommendation.model, data.standbyPumps);
    finalPumpResult = pumpRes.success ? pumpRes as unknown as PumpMatchResult : null;
    pumpWarning = pumpRes.warning;
  }

  const result: InternalSelectionResult = {
    success: recommendations.length > 0,
    message: recommendations.length > 0
      ? `在 ${gearboxType} 系列中找到 ${recommendations.length} 个符合条件的齿轮箱`
      : `在 ${gearboxType} 系列中没有找到符合条件的齿轮箱`,
    recommendations: recommendations.map(g => ({
      ...g,
      power: enginePower,
      speed: engineSpeed
    } as SelectionRecommendation)),
    flexibleCoupling: finalCouplingResult,
    standbyPump: finalPumpResult,
    engineTorque: engineTorque_Nm,
    requiredTransferCapacity: requiredTransferCapacity,
    gearboxTypeUsed: gearboxType,
    enginePower: enginePower,
    engineSpeed: engineSpeed,
    targetRatio: targetRatio,
    thrustRequirement: thrustRequirement,
    options: options,
    _diagnostics: {
      scoringWeights: scoringWeights,
      tolerances: {
        maxRatioDiffPercent: MAX_RATIO_DIFF_PERCENT,
        maxCapacityMargin: MAX_CAPACITY_MARGIN,
        minCapacityMargin: MIN_CAPACITY_MARGIN
      },
      rejectionReasons: rejectionReasons,
      copilotExclusions: copilotExclusions,
      inferredPropellerType: effectivePropellerType ?? null,
      scoringProfile: options.scoringProfile,
      nearMatchCount: nearMatches.length,
      totalScanned: gearboxes.length,
      totalMatched: matchingGearboxes.length
    }
  };

  // Critical speed pre-check for high-speed applications
  if (engineSpeed > 3000 || isPTOorPTIEnabled) {
    recommendations.forEach(rec => {
      const csCheck = performCriticalSpeedCheck({
        enginePower,
        engineSpeed,
        ratio: rec.selectedRatio,
        isPTO: !!isPTOorPTIEnabled
      });
      if (csCheck) {
        (rec as any).criticalSpeedCheck = csCheck;
        if (!csCheck.safe) {
          const existingWarnings: string[] = (rec as any).warnings || [];
          existingWarnings.push(`⚠ 临界转速风险: ${csCheck.recommendation}`);
          (rec as any).warnings = existingWarnings;
        }
      }
    });
  }

  // --- Add consolidated warning ---
  let consolidatedWarning: string | null = null;
  if (result.success && topRecommendation) {
    if (topRecommendation.capacityMargin < 10) {
      consolidatedWarning = `警告：首选齿轮箱(${topRecommendation.model})功率余量(${topRecommendation.capacityMargin.toFixed(1)}%)偏低，JB/CCS建议≥10%`;
    }
    if (thrustRequirement > 0 && !topRecommendation.thrustMet) {
      const thrustWarn = `警告：首选齿轮箱(${topRecommendation.model})推力不满足要求(${thrustRequirement}kN)`;
      consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${thrustWarn}` : thrustWarn;
    }
    if (topRecommendation.ratioDiffPercent > 10) {
      const ratioWarning = `注意: 首选齿轮箱(${topRecommendation.model})的减速比(${topRecommendation.selectedRatio.toFixed(2)})与目标值(${targetRatio.toFixed(2)})偏差达${topRecommendation.ratioDiffPercent.toFixed(1)}%。`;
      consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${ratioWarning}` : ratioWarning;
    }

    if (couplingWarning) consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${couplingWarning}` : couplingWarning;
    if (pumpWarning) consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${pumpWarning}` : pumpWarning;
    if (hybridWarning) consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${hybridWarning}` : hybridWarning;

    // Critical speed warning for top recommendation
    if ((topRecommendation as any).criticalSpeedCheck && !(topRecommendation as any).criticalSpeedCheck.safe) {
      const csWarn = `临界转速预警: ${(topRecommendation as any).criticalSpeedCheck.recommendation}`;
      consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${csWarn}` : csWarn;
    }

    if (topRecommendation.hasSpecialPackagePrice) {
      result.priceInfo = `该型号采用市场常规打包价${topRecommendation.packagePrice.toLocaleString()}元。`;
    }
  } else if (!result.success) {
    consolidatedWarning = result.message || null;
  }

  if (consolidatedWarning) {
    result.warning = consolidatedWarning;
  }

  logger.log(`${gearboxType} 系列选型最终结果:`, result);

  return result;
};


/**
 * 自动选型函数 - 跨所有系列搜索最佳匹配
 * @param requirements 选型需求
 * @param appData 应用数据
 * @returns 自动选型结果
 */
export const autoSelectGearbox = (
  requirements: AutoSelectRequirements,
  appData: AppData
): AutoSelectResult => {
  logger.log('开始自动选型 (autoSelectGearbox)...', requirements);
  const { motorPower, motorSpeed, targetRatio, thrust, ...options } = requirements;

  // 日志记录：检查高弹数据是否正确加载
  logger.debug("flexibleCouplings 数据:", appData?.flexibleCouplings?.length || 0, "条记录");
  if (appData?.flexibleCouplings && appData.flexibleCouplings.length > 0) {
    logger.debug("flexibleCouplings 示例:", appData.flexibleCouplings[0]);
  }

  // ============================================================
  // Copilot 对齐: 直接型号 fast path (R-DIRECT-MODEL)
  // 命中后跳过工况筛选直接返回该型号 (减速比若指定取最接近)
  // 源: gearbox-copilot.html:1203-1232
  // ============================================================
  if (requirements.directModelQuery && typeof requirements.directModelQuery === 'string') {
    // 收集全部齿轮箱用于 model 扫描
    const allGearboxes: Gearbox[] = [];
    const seriesKeys: (keyof AppData)[] = [
      'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
      'hcqGearboxes', 'gcGearboxes', 'hcaGearboxes', 'hcvGearboxes',
      'hcxGearboxes', 'mvGearboxes', 'otherGearboxes'
    ];
    for (const k of seriesKeys) {
      const arr = appData[k] as Gearbox[] | undefined;
      if (Array.isArray(arr)) allGearboxes.push(...arr);
    }
    const hit = findDirectModel(requirements.directModelQuery, allGearboxes);
    if (hit) {
      logger.log(`Copilot 规则 ${COPILOT_RULES.DIRECT_MODEL}: 直接型号命中 ${hit.model} (query=${requirements.directModelQuery})`);
      // Copilot 行为: 跳过工况筛选, 直接返回该型号 + 选最近的 ratio + 计算容量/余量
      // 源: gearbox-copilot.html:1203-1232
      const ratios = Array.isArray(hit.ratios) ? hit.ratios.filter((r: any) => typeof r === 'number' && r > 0) : [];
      let bestIdx = 0;
      if (targetRatio && ratios.length > 0) {
        let minDiff = Infinity;
        ratios.forEach((r: number, i: number) => {
          const d = Math.abs(r - targetRatio);
          if (d < minDiff) { minDiff = d; bestIdx = i; }
        });
      }
      const selectedRatio = ratios[bestIdx] || (ratios[0] || 1);
      const tcpr = (hit as any).transmissionCapacityPerRatio as number[] | undefined;
      const transferArr = Array.isArray(hit.transferCapacity) ? hit.transferCapacity : undefined;
      let selectedCapacity = 0;
      if (Array.isArray(tcpr) && tcpr[bestIdx] != null) selectedCapacity = tcpr[bestIdx];
      else if (transferArr && transferArr[bestIdx] != null) selectedCapacity = transferArr[bestIdx] as number;
      const required = motorSpeed > 0 ? motorPower / motorSpeed : 0;
      const margin = selectedCapacity > 0 && required > 0
        ? ((selectedCapacity - required) / required) * 100
        : 0;
      const ratioDiffPercent = targetRatio > 0
        ? (Math.abs(selectedRatio - targetRatio) / targetRatio) * 100
        : 0;
      const thrustMet = (hit.thrust ?? 0) >= (thrust || 0);
      const directRec: any = {
        ...hit,
        selectedRatio,
        selectedCapacity,
        capacityMargin: margin,
        ratioDiffPercent,
        thrustMet,
        score: 100,
        ratio: selectedRatio,
        engineTorque: required > 0 ? motorPower * 9550 / motorSpeed : 0,
        warnings: ['直接型号查询 — 已跳过工况筛选, 显示该型号详情 + 配套'],
        reason: `用户指定型号 ${hit.model}${targetRatio ? ` (减速比 ${selectedRatio} 最接近 ${targetRatio})` : ''}`,
      };
      const directResult: AutoSelectResult = {
        success: true,
        recommendations: [directRec],
        message: `直接型号查询: ${hit.model}`,
        engineTorque: required > 0 ? motorPower * 9550 / motorSpeed : 0,
        requiredTransferCapacity: required,
        gearboxTypeUsed: typeof hit.series === 'string' ? hit.series : 'OTHER',
        enginePower: motorPower,
        engineSpeed: motorSpeed,
        targetRatio: targetRatio,
        thrustRequirement: thrust || 0,
        _diagnostics: {
          scoringWeights: COPILOT_SCORING_WEIGHTS,
          tolerances: { maxRatioDiffPercent: 100, maxCapacityMargin: 1000, minCapacityMargin: -100 },
          rejectionReasons: { speedRange: 0, ratioOutOfRange: 0, capacityTooLow: 0, capacityTooHigh: 0, thrustInsufficient: 0, interfaceMismatch: 0, shaftMismatch: 0, seriesCapabilityMismatch: 0 },
          isDirectModelHit: true,
          appliedRules: [COPILOT_RULES.DIRECT_MODEL],
          nearMatchCount: 0,
          totalScanned: allGearboxes.length,
          totalMatched: 1,
        } as any,
      };
      return directResult;
    }
  }

  // Define types to check (SGW 包含在 gwGearboxes 中，已覆盖)
  const availableTypes = (
    ['HC', 'GW', 'HCM', 'DT', 'HCQ', 'GC', 'HCA', 'HCV', 'HCX', 'MV', 'OTHER'] as const
  ).filter(type => {
    const key = `${type.toLowerCase()}Gearboxes` as keyof AppData;
    const data = appData[key];
    return Array.isArray(data) && data.length > 0;
  });

  if (availableTypes.length === 0) {
    logger.error("自动选型失败：没有可用的齿轮箱数据系列。");
    return {
      success: false,
      message: '没有可用的齿轮箱数据系列进行自动选型',
      recommendations: []
    };
  }

  logger.log('将搜索以下齿轮箱类型:', availableTypes);

  let allRecommendations: SelectionRecommendation[] = [];
  const allResults: InternalSelectionResult[] = [];

  // 1. Run selection for each available type
  availableTypes.forEach(type => {
    logger.log(`--- 自动选型: 正在检查 ${type} 系列 ---`);
    const result = selectGearbox(
      motorPower,
      motorSpeed,
      targetRatio,
      thrust || 0,
      type,
      appData,
      options
    );

    allResults.push(result);

    // 构建系列需求（向后兼容 hasClutch）
    const autoSeriesReqs = options.seriesRequirements || (
      (options as any).hasClutch != null
        ? { needsClutch: (options as any).hasClutch }
        : null
    );

    if (result.success && result.recommendations.length > 0) {
      logger.log(`${type} 系列找到 ${result.recommendations.length} 个推荐`);
      result.recommendations.forEach(rec => {
        (rec as any).originalType = type;
        // 系列特性适配评分（替代旧的硬编码加成）
        if (autoSeriesReqs) {
          const capMatch = matchesSeriesRequirements(rec.model, autoSeriesReqs);
          rec.score = (rec.score || 0) + capMatch.score;
          (rec as any)._seriesMatchInfo = capMatch;
        }
        if (rec.hasSpecialPackagePrice) {
          rec.score = (rec.score || 0) + SORTING_THRESHOLDS.autoSelectPackageBonus;
        }
        // 归一化: 防止加分后超过100
        rec.score = Math.min(100, Math.round(rec.score || 0));
      });
      allRecommendations.push(...result.recommendations);
    } else {
      logger.log(`${type} 系列没有找到完全符合条件的齿轮箱: ${result.message}`);

      if (result.recommendations && result.recommendations.length > 0) {
        logger.log(`${type} 系列找到 ${result.recommendations.length} 个近似推荐`);
        result.recommendations.forEach(rec => {
          (rec as any).originalType = type;
          (rec as any).isPartialMatch = true;

          if (rec.score) {
            rec.score = rec.score * SORTING_THRESHOLDS.nearMatchPenalty;
          }

          // 近似匹配也加系列适配评分
          if (autoSeriesReqs) {
            const capMatch = matchesSeriesRequirements(rec.model, autoSeriesReqs);
            rec.score = (rec.score || 0) + capMatch.score * 0.5;
            (rec as any)._seriesMatchInfo = capMatch;
          }

          if (rec.hasSpecialPackagePrice) {
            rec.score = (rec.score || 0) + SORTING_THRESHOLDS.autoSelectPartialPackageBonus;
          }
          // 归一化: 防止加分后超过100
          rec.score = Math.min(100, Math.round(rec.score || 0));

          (rec as any).failureReason = (rec as any).failureReason || "不满足部分选型条件";
        });

        const topPartialMatches = result.recommendations
          .filter(rec => (rec.score || 0) > SORTING_THRESHOLDS.nearMatchMinScore || rec.hasSpecialPackagePrice)
          .slice(0, SORTING_THRESHOLDS.nearMatchMaxPerSeries);

        if (topPartialMatches.length > 0) {
          allRecommendations.push(...topPartialMatches);
        }
      }
    }
  });

  logger.log(`总共找到 ${allRecommendations.length} 个来自不同系列的推荐`);

  // 如果没有找到任何推荐
  if (allRecommendations.length === 0) {
    const allNearMatches = allResults
      .filter(r => r.recommendations && r.recommendations.length > 0)
      .flatMap(r => r.recommendations.map(rec => ({
        ...rec,
        originalType: r.gearboxTypeUsed
      })));

    if (allNearMatches.length > 0) {
      allNearMatches.forEach(match => {
        (match as any).score = (match as any).score || 50;
        if (match.hasSpecialPackagePrice) {
          (match as any).score += 15;
        }
      });

      allNearMatches.sort((a, b) => {
        if (a.hasSpecialPackagePrice !== b.hasSpecialPackagePrice) {
          return a.hasSpecialPackagePrice ? -1 : 1;
        }
        return ((b as any).score || 0) - ((a as any).score || 0);
      });

      const bestNearMatches = allNearMatches.slice(0, 5);

      // Aggregate relaxation suggestions from all sub-results
      const aggregatedSuggestions = aggregateRelaxationSuggestions(allResults);

      return {
        success: false,
        message: '在所有相关系列中均未找到完全符合条件的齿轮箱，但有一些近似匹配',
        recommendations: bestNearMatches as SelectionRecommendation[],
        engineTorque: motorPower * 9550 / motorSpeed,
        requiredTransferCapacity: motorPower / motorSpeed,
        relaxationSuggestions: aggregatedSuggestions,
        warning: "以下是部分符合条件的齿轮箱，请评估是否可以调整需求或选择其他参数。",
        allResults
      };
    }

    // Aggregate relaxation suggestions from all sub-results
    const aggregatedSuggestions = aggregateRelaxationSuggestions(allResults);

    return {
      success: false,
      message: '在所有相关系列中均未找到符合条件的齿轮箱',
      recommendations: [],
      relaxationSuggestions: aggregatedSuggestions,
      allResults
    };
  }

  // 2. Sort all combined recommendations globally (阈值来自SORTING_THRESHOLDS)
  allRecommendations.sort((a, b) => {
    if (a.hasSpecialPackagePrice !== b.hasSpecialPackagePrice) {
      return a.hasSpecialPackagePrice ? -1 : 1;
    }

    if ((a as any).isPartialMatch !== (b as any).isPartialMatch) {
      return (a as any).isPartialMatch ? 1 : -1;
    }

    if (Math.abs((b.score || 0) - (a.score || 0)) > SORTING_THRESHOLDS.autoSelectScoreDiffThreshold) {
      return (b.score || 0) - (a.score || 0);
    }

    const aIdealMargin = a.capacityMargin >= 10 && a.capacityMargin <= 20;
    const bIdealMargin = b.capacityMargin >= 10 && b.capacityMargin <= 20;
    if (aIdealMargin && !bIdealMargin) return -1;
    if (!aIdealMargin && bIdealMargin) return 1;

    return Math.abs(a.capacityMargin - SORTING_THRESHOLDS.optimalCapacityMargin) - Math.abs(b.capacityMargin - SORTING_THRESHOLDS.optimalCapacityMargin);
  });

  // 3. Select the best overall gearbox
  const bestOverallGearbox = allRecommendations[0];
  const bestType = (bestOverallGearbox as any).originalType;
  logger.log(`自动选型最终推荐: ${bestOverallGearbox.model} (来自 ${bestType} 系列), 评分: ${bestOverallGearbox.score}, 特殊打包价格: ${bestOverallGearbox.hasSpecialPackagePrice ? '是' : '否'}`);

  // 4. Re-select accessories
  const engineTorque_Nm = (bestOverallGearbox as any).engineTorque || (motorPower * 9550) / motorSpeed;

  logger.log("开始选择高弹联轴器...");
  const finalCouplingResult = selectFlexibleCoupling(
    engineTorque_Nm,
    bestOverallGearbox.model,
    appData.flexibleCouplings,
    couplingSpecificationsMap,
    options.workCondition,
    options.temperature,
    options.hasCover,
    motorSpeed,
    options.workFactorMode  // 工况系数模式: FACTORY | JB_CCS
  );

  logger.log("联轴器选择结果:", finalCouplingResult?.success ? "成功" : "失败",
    finalCouplingResult?.model || "(无匹配型号)");

  const finalPumpResult = selectStandbyPump(bestOverallGearbox.model, appData.standbyPumps);

  // 5. Build the final result object
  const finalResult: AutoSelectResult = {
    success: true,
    message: `自动选型完成，最佳推荐来自 ${bestType} 系列。`,
    recommendations: allRecommendations,
    flexibleCoupling: finalCouplingResult as unknown as CouplingMatchResult,
    standbyPump: finalPumpResult as unknown as PumpMatchResult,
    engineTorque: engineTorque_Nm,
    requiredTransferCapacity: motorPower / motorSpeed,
    recommendedType: bestType,
    gearboxTypeUsed: 'auto',
    enginePower: motorPower,
    engineSpeed: motorSpeed,
    targetRatio: targetRatio,
    thrustRequirement: thrust,
    options: options,
    // B1: 透传 engineId 供下游 IMO 合规 / TCO / 工况图等
    engineId: requirements.engineId,
    partialMatchCount: allRecommendations.filter(r => (r as any).isPartialMatch).length,
    _meta: {
      calculationTime: new Date().toISOString(),
      version: '1.0',
      dataVersion: appData?._version || 'unknown'
    }
  };

  // 5.5 临界转速简化预检 (高转速或PTO工况自动触发)
  if (finalResult.success && bestOverallGearbox) {
    try {
      const criticalCheck = performCriticalSpeedCheck({
        enginePower: motorPower,
        engineSpeed: motorSpeed,
        ratio: bestOverallGearbox.selectedRatio,
        isPTO: !!(options as any)?.ptoEnabled
      });
      if (criticalCheck) {
        (finalResult as any).criticalSpeedCheck = criticalCheck;
        if (!criticalCheck.safe) {
          // 将临界转速风险添加到最佳推荐的warnings中
          const bestRec = allRecommendations[0];
          if (bestRec) {
            const warningMsg = criticalCheck.recommendation;
            if (!(bestRec as any).warnings) (bestRec as any).warnings = [];
            (bestRec as any).warnings.push(warningMsg);
          }
        }
      }
    } catch (e) {
      logger.debug('临界转速预检跳过:', e);
    }
  }

  // 6. Generate final consolidated warning
  let consolidatedWarning: string | null = null;
  if (finalResult.success && bestOverallGearbox) {
    if ((bestOverallGearbox as any).isPartialMatch) {
      consolidatedWarning = `警告：最终推荐的齿轮箱(${bestOverallGearbox.model})是部分匹配结果，${(bestOverallGearbox as any).failureReason || '不完全满足所有要求'}`;
    }

    if (bestOverallGearbox.capacityMargin < 10) {
      const capacityWarning = `警告：最终推荐齿轮箱(${bestOverallGearbox.model})功率余量(${bestOverallGearbox.capacityMargin.toFixed(1)}%)偏低，JB/CCS建议≥10%`;
      consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${capacityWarning}` : capacityWarning;
    }

    if (thrust && thrust > 0 && !(bestOverallGearbox as any).thrustMet) {
      const thrustWarn = `警告：最终推荐齿轮箱(${bestOverallGearbox.model})推力不满足要求(${thrust}kN)`;
      consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${thrustWarn}` : thrustWarn;
    }

    if (bestOverallGearbox.ratioDiffPercent > 10) {
      const ratioWarning = `注意: 最终推荐齿轮箱(${bestOverallGearbox.model})的减速比(${bestOverallGearbox.selectedRatio.toFixed(2)})与目标值(${targetRatio.toFixed(2)})偏差达${bestOverallGearbox.ratioDiffPercent.toFixed(1)}%。`;
      consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${ratioWarning}` : ratioWarning;
    }

    if (finalCouplingResult?.warning) {
      consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${finalCouplingResult.warning}` : finalCouplingResult.warning;
    }
    if (finalPumpResult?.warning) {
      consolidatedWarning = consolidatedWarning ? `${consolidatedWarning}; ${finalPumpResult.warning}` : finalPumpResult.warning;
    }

    if (bestOverallGearbox.hasSpecialPackagePrice) {
      finalResult.priceInfo = `该型号采用市场常规打包价${bestOverallGearbox.packagePrice?.toLocaleString()}元。`;
    }
  } else if (!finalResult.success) {
    consolidatedWarning = finalResult.message || null;
  }

  if (consolidatedWarning) {
    finalResult.warning = consolidatedWarning;
  }

  logger.log("Auto Select Final Result:", finalResult);
  return finalResult;
};

// ============= PTO离合器借用选型 (增强版) =============

/**
 * PTO应用类型定义
 */
export const PTO_APPLICATION_TYPES = {
  generator: { label: '轴带发电机', kFactor: 1.0, description: '连续运行，扭矩平稳' },
  hydraulicPump: { label: '液压泵', kFactor: 1.4, description: '中等冲击，周期性负载' },
  firePump: { label: '消防泵', kFactor: 1.6, description: '突发高扭矩，应急启动' },
  bilgePump: { label: '舱底泵', kFactor: 1.3, description: '间歇运行，低冲击' },
  cargoPump: { label: '货油泵', kFactor: 1.5, description: '高粘度介质，启动冲击大' },
  winch: { label: '绞车/绞盘', kFactor: 1.8, description: '冲击载荷大，频繁启停' },
  compressor: { label: '压缩机', kFactor: 1.5, description: '脉动负载，中等冲击' },
  other: { label: '其他', kFactor: 1.4, description: '默认中等工况' }
} as const;

export type PTOApplicationType = keyof typeof PTO_APPLICATION_TYPES;

/**
 * PTO离合器需求参数 (增强版)
 */
export interface PTOClutchRequirements {
  power: number;                    // PTO功率 (kW)
  speed: number;                    // PTO输入转速 (rpm)
  application?: PTOApplicationType; // PTO用途
  temperature?: number;             // 工作温度 (°C)
  workFactorMode?: 'FACTORY' | 'JB_CCS'; // 工况系数模式
}

/**
 * PTO离合器推荐结果 (增强版)
 */
export interface ClutchRecommendation {
  model: string;
  series: string;
  clutchCapacity: number;      // 传递能力 kW/(r/min)
  clutchTorque: number;        // 离合器扭矩 (kN·m)
  requiredTorque: number;      // 所需扭矩 (kN·m)
  margin: number;              // 余量百分比
  torqueMargin: number;        // 扭矩余量百分比
  marginQuality: 'optimal' | 'acceptable' | 'marginal' | 'excessive'; // 余量质量
  isSameSeries: boolean;
  price?: number;
  weight?: number;
  score: number;               // 综合评分 (0-100)
  scoreDetails: {              // 评分细项
    torqueScore: number;
    seriesScore: number;
    marginScore: number;
    priceScore: number;
  };
  warnings: string[];          // 警告信息
  reasoning: string;           // 选型理由
}

/**
 * PTO离合器选型结果 (增强版)
 */
export interface PTOClutchSelectionResult {
  recommendations: ClutchRecommendation[];
  calculationDetails: {
    ptoPower: number;
    ptoSpeed: number;
    application: string;
    kFactor: number;
    stFactor: number;
    requiredCapacity: number;
    requiredTorque: number;
  };
  warnings: string[];
}

/**
 * 获取PTO温度系数
 */
function getPTOTemperatureFactor(temperature: number = 30): { factor: number; warning: string | null } {
  let factor = 1.0;
  let warning: string | null = null;

  if (temperature <= 20) {
    factor = 1.0;
  } else if (temperature <= 40) {
    factor = 1.1;
  } else if (temperature <= 60) {
    factor = 1.2;
  } else {
    factor = 1.3;
    warning = `工作温度${temperature}°C较高，建议确认离合器热容量是否满足`;
  }

  return { factor, warning };
}

/**
 * 评估余量质量
 */
function evaluateMarginQuality(margin: number): 'optimal' | 'acceptable' | 'marginal' | 'excessive' {
  if (margin >= 0.10 && margin <= 0.30) return 'optimal';      // 10-30%最优
  if (margin >= 0.05 && margin < 0.10) return 'marginal';      // 5-10%偏小
  if (margin > 0.30 && margin <= 0.50) return 'acceptable';    // 30-50%可接受
  return 'excessive';                                           // >50%过大
}

/**
 * 计算综合评分
 */
function calculateClutchScore(
  torqueMargin: number,
  isSameSeries: boolean,
  capacityMargin: number,
  price: number | undefined,
  avgPrice: number
): { total: number; details: { torqueScore: number; seriesScore: number; marginScore: number; priceScore: number } } {
  // 扭矩余量评分 (30分) - 10-30%最优
  let torqueScore = 0;
  if (torqueMargin >= 0.10 && torqueMargin <= 0.30) {
    torqueScore = 30;
  } else if (torqueMargin >= 0.05 && torqueMargin < 0.10) {
    torqueScore = 20;  // 余量偏小
  } else if (torqueMargin > 0.30 && torqueMargin <= 0.50) {
    torqueScore = 25;  // 余量稍大
  } else if (torqueMargin > 0.50) {
    torqueScore = 15;  // 过度选型
  } else {
    torqueScore = 5;   // 余量不足
  }

  // 同系列评分 (25分)
  const seriesScore = isSameSeries ? 25 : 10;

  // 传递能力余量评分 (25分)
  let marginScore = 0;
  if (capacityMargin >= 0.05 && capacityMargin <= 0.30) {
    marginScore = 25;
  } else if (capacityMargin > 0.30 && capacityMargin <= 0.50) {
    marginScore = 20;
  } else {
    marginScore = 10;
  }

  // 价格评分 (20分)
  let priceScore = 20;
  if (price && avgPrice > 0) {
    const priceRatio = price / avgPrice;
    if (priceRatio <= 0.8) priceScore = 20;
    else if (priceRatio <= 1.0) priceScore = 18;
    else if (priceRatio <= 1.2) priceScore = 15;
    else priceScore = 10;
  }

  return {
    total: torqueScore + seriesScore + marginScore + priceScore,
    details: { torqueScore, seriesScore, marginScore, priceScore }
  };
}

/**
 * 生成选型理由
 */
function generateReasoning(rec: Partial<ClutchRecommendation>, application: string): string {
  const parts: string[] = [];

  if (rec.isSameSeries) {
    parts.push('同系列产品，兼容性好');
  }

  if (rec.marginQuality === 'optimal') {
    parts.push('余量适中(10-30%)');
  } else if (rec.marginQuality === 'acceptable') {
    parts.push('余量充足');
  } else if (rec.marginQuality === 'marginal') {
    parts.push('余量偏小，建议关注');
  }

  if (application && application !== 'other') {
    parts.push(`适合${PTO_APPLICATION_TYPES[application as PTOApplicationType]?.label || application}工况`);
  }

  return parts.length > 0 ? parts.join('；') : '满足基本选型要求';
}

/**
 * PTO离合器借用选型 (增强版)
 * 基于扭矩计算、工况系数、多维评分的科学选型
 *
 * @param ptoRequirements PTO需求参数
 * @param mainGearbox 已选主推进齿轮箱
 * @param allGearboxes 全部齿轮箱数据
 * @param marginRange 余量范围，默认10%-50%
 * @returns 增强版选型结果
 */
export function selectPTOClutch(
  ptoRequirements: PTOClutchRequirements | { power: number; speed: number },
  mainGearbox: Gearbox,
  allGearboxes: Gearbox[],
  marginRange: { min: number; max: number } = { min: 0.10, max: 0.50 }
): ClutchRecommendation[] {
  // 兼容旧版调用
  const requirements: PTOClutchRequirements = {
    power: ptoRequirements.power,
    speed: ptoRequirements.speed,
    application: (ptoRequirements as PTOClutchRequirements).application || 'other',
    temperature: (ptoRequirements as PTOClutchRequirements).temperature || 30,
    workFactorMode: (ptoRequirements as PTOClutchRequirements).workFactorMode || 'FACTORY'
  };

  const { power, speed, application = 'other', temperature = 30 } = requirements;

  // 参数验证：防止除零
  if (!power || power <= 0 || !speed || speed <= 0) {
    logger.warn(`PTO选型参数无效: power=${power}, speed=${speed}`);
    return [];
  }

  const mainSeries = mainGearbox.series || '';

  // 获取工况系数
  const appConfig = PTO_APPLICATION_TYPES[application] || PTO_APPLICATION_TYPES.other;
  const kFactor = appConfig.kFactor;

  // 获取温度系数
  const tempResult = getPTOTemperatureFactor(temperature);
  const stFactor = tempResult.factor;

  // 计算PTO扭矩 (N·m): T = 9550 × P / n
  const ptoTorque_Nm = (9550 * power) / speed;
  // 计算所需离合器扭矩 (kN·m)
  const requiredTorque_kNm = (ptoTorque_Nm * kFactor * stFactor) / 1000;
  // 计算所需传递能力
  const requiredCapacity = power / speed;

  logger.log(`===== PTO离合器增强选型 =====`);
  logger.log(`PTO功率: ${power} kW, 转速: ${speed} rpm`);
  logger.log(`应用类型: ${appConfig.label} (K=${kFactor})`);
  logger.log(`温度系数: St=${stFactor} (${temperature}°C)`);
  logger.log(`PTO扭矩: ${ptoTorque_Nm.toFixed(2)} N·m`);
  logger.log(`所需离合器扭矩: ${requiredTorque_kNm.toFixed(3)} kN·m (含工况系数)`);
  logger.log(`所需传递能力: ${requiredCapacity.toFixed(4)} kW/(r/min)`);
  logger.log(`主推进系列: ${mainSeries}`);

  // 收集所有候选者价格用于评分
  const allPrices: number[] = [];

  // 筛选候选离合器
  const candidates: ClutchRecommendation[] = [];

  for (const gb of allGearboxes) {
    const capacityArray = (gb as any).transmissionCapacityPerRatio || (gb as any).transferCapacity || [];
    const capacity = Array.isArray(capacityArray) && capacityArray.length > 0 ? capacityArray[0] : null;

    if (!capacity || typeof capacity !== 'number' || capacity <= 0) {
      continue;
    }

    // 检查是否满足传递能力需求
    if (capacity < requiredCapacity) {
      continue;
    }

    // 计算传递能力余量
    const capacityMargin = (capacity - requiredCapacity) / requiredCapacity;

    // 使用更宽松的初始筛选范围，后续通过评分排序
    if (capacityMargin < 0.05 || capacityMargin > 1.0) {
      continue;
    }

    // 估算离合器扭矩 (基于传递能力和转速)
    // 简化计算: 离合器扭矩 ≈ 传递能力 × 转速 × 9.55 / 1000
    const clutchTorque_kNm = (capacity * speed * 9.55) / 1000;

    // 计算扭矩余量
    const torqueMargin = requiredTorque_kNm > 0
      ? (clutchTorque_kNm - requiredTorque_kNm) / requiredTorque_kNm
      : capacityMargin;

    // 扭矩余量过小的警告
    if (torqueMargin < 0.05) {
      continue;  // 扭矩余量不足5%不推荐
    }

    const gbSeries = gb.series || '';
    const isSameSeries = gbSeries === mainSeries && gbSeries !== '';
    const price = (gb as any).price || (gb as any).factoryPrice || (gb as any).marketPrice;
    const weight = (gb as any).weight;

    if (price) allPrices.push(price);

    const marginQuality = evaluateMarginQuality(torqueMargin);
    const warnings: string[] = [];

    // 生成警告
    if (torqueMargin < 0.10) {
      warnings.push('扭矩余量偏小(<10%)，建议关注安全裕度');
    }
    if (torqueMargin > 0.50) {
      warnings.push('扭矩余量较大(>50%)，可能存在过度选型');
    }
    if (tempResult.warning) {
      warnings.push(tempResult.warning);
    }
    if (!isSameSeries && mainSeries) {
      warnings.push('非同系列产品，需确认接口兼容性');
    }

    candidates.push({
      model: gb.model,
      series: gbSeries,
      clutchCapacity: capacity,
      clutchTorque: clutchTorque_kNm,
      requiredTorque: requiredTorque_kNm,
      margin: capacityMargin,
      torqueMargin: torqueMargin,
      marginQuality,
      isSameSeries,
      price,
      weight,
      score: 0,  // 稍后计算
      scoreDetails: { torqueScore: 0, seriesScore: 0, marginScore: 0, priceScore: 0 },
      warnings,
      reasoning: ''
    });
  }

  // 计算平均价格用于评分
  const avgPrice = allPrices.length > 0
    ? allPrices.reduce((a, b) => a + b, 0) / allPrices.length
    : 0;

  // 计算评分并生成理由
  for (const candidate of candidates) {
    const scoreResult = calculateClutchScore(
      candidate.torqueMargin,
      candidate.isSameSeries,
      candidate.margin,
      candidate.price,
      avgPrice
    );
    candidate.score = scoreResult.total;
    candidate.scoreDetails = scoreResult.details;
    candidate.reasoning = generateReasoning(candidate, application);
  }

  logger.log(`PTO离合器候选数量: ${candidates.length}`);

  // 排序: 按综合评分降序
  candidates.sort((a, b) => {
    // 首先按评分
    if (b.score !== a.score) {
      return b.score - a.score;
    }
    // 评分相同时，同系列优先
    if (a.isSameSeries !== b.isSameSeries) {
      return a.isSameSeries ? -1 : 1;
    }
    // 最后按余量从小到大
    return a.torqueMargin - b.torqueMargin;
  });

  // 返回前5个推荐
  const result = candidates.slice(0, 5);

  if (result.length > 0) {
    const top = result[0];
    logger.log(`PTO离合器推荐TOP1: ${top.model}`);
    logger.log(`  - 传递能力: ${top.clutchCapacity.toFixed(4)} kW/(r/min)`);
    logger.log(`  - 离合器扭矩: ${top.clutchTorque.toFixed(3)} kN·m`);
    logger.log(`  - 扭矩余量: ${(top.torqueMargin * 100).toFixed(1)}% (${top.marginQuality})`);
    logger.log(`  - 综合评分: ${top.score}/100`);
    logger.log(`  - 同系列: ${top.isSameSeries}`);
    logger.log(`  - 选型理由: ${top.reasoning}`);
    if (top.warnings.length > 0) {
      logger.log(`  - 警告: ${top.warnings.join('; ')}`);
    }
  } else {
    logger.log('PTO离合器选型: 未找到合适的离合器');
  }

  return result;
}

/**
 * 获取完整的PTO离合器选型结果 (含计算详情)
 */
export function selectPTOClutchWithDetails(
  ptoRequirements: PTOClutchRequirements,
  mainGearbox: Gearbox,
  allGearboxes: Gearbox[]
): PTOClutchSelectionResult {
  const { power, speed, application = 'other', temperature = 30 } = ptoRequirements;

  // 参数验证：防止除零
  if (!power || power <= 0 || !speed || speed <= 0) {
    logger.warn(`PTO详细选型参数无效: power=${power}, speed=${speed}`);
    return {
      recommendations: [],
      calculationDetails: {
        ptoPower: power || 0,
        ptoSpeed: speed || 0,
        application,
        kFactor: 1,
        stFactor: 1,
        requiredCapacity: 0,
        requiredTorque: 0
      },
      warnings: ['PTO功率或转速参数无效']
    };
  }

  const appConfig = PTO_APPLICATION_TYPES[application] || PTO_APPLICATION_TYPES.other;
  const kFactor = appConfig.kFactor;
  const tempResult = getPTOTemperatureFactor(temperature);
  const stFactor = tempResult.factor;

  const ptoTorque_Nm = (9550 * power) / speed;
  const requiredTorque_kNm = (ptoTorque_Nm * kFactor * stFactor) / 1000;
  const requiredCapacity = power / speed;

  const recommendations = selectPTOClutch(ptoRequirements, mainGearbox, allGearboxes);

  const warnings: string[] = [];
  if (tempResult.warning) {
    warnings.push(tempResult.warning);
  }
  if (recommendations.length === 0) {
    warnings.push('未找到满足条件的离合器，建议放宽筛选范围或确认输入参数');
  }

  return {
    recommendations,
    calculationDetails: {
      ptoPower: power,
      ptoSpeed: speed,
      application: appConfig.label,
      kFactor,
      stFactor,
      requiredCapacity,
      requiredTorque: requiredTorque_kNm
    },
    warnings
  };
}
