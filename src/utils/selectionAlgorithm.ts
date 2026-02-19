// src/utils/selectionAlgorithm.ts
// 齿轮箱选型算法 - TypeScript版本

import { logger } from '../config/logging';
import {
  DEFAULT_SCORING_WEIGHTS,
  DEFAULT_TOLERANCES
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
  offsetDirection?: 'any' | 'horizontal-offset' | 'vertical-down' | 'k-shape' | 'l-shape';  // 偏置方向
}

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
  interfaceMismatch: number;  // 接口不匹配
  shaftMismatch: number;      // 轴布置不匹配
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
  // 轴布置筛选选项
  shaftArrangement?: ShaftArrangementFilter;
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
  targetRatio?: number;
  thrustRequirement?: number;
  options?: SelectionOptions;
  warning?: string;
  priceInfo?: string;
  rejectionReasons?: RejectionReasons;
  _diagnostics?: {
    scoringWeights: ScoringWeights;
    tolerances: {
      maxRatioDiffPercent: number;
      maxCapacityMargin: number;
      minCapacityMargin: number;
    };
    rejectionReasons: RejectionReasons;
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
    interfaceMismatch: 0,  // 接口不匹配
    shaftMismatch: 0       // 轴布置不匹配
  };

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
  const MIN_CAPACITY_MARGIN = configTolerances.minCapacityMargin || 5;

  // 近似匹配列表
  let nearMatches: NearMatch[] = [];

  // --- Filter and score gearboxes ---
  const matchingGearboxes: MatchingGearbox[] = [];

  for (const gearbox of gearboxes) {
    if (!gearbox || typeof gearbox !== 'object' || !gearbox.model) {
      logger.warn(`Skipping invalid gearbox data in ${gearboxType} series:`, gearbox);
      continue;
    }

    let failureReason: string | null = null;

    // Check speed range
    if (Array.isArray(gearbox.inputSpeedRange) && gearbox.inputSpeedRange.length === 2) {
      const [minSpeed, maxSpeed] = gearbox.inputSpeedRange;
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
    if (options.shaftArrangement && options.shaftArrangement.axisAlignment && options.shaftArrangement.axisAlignment !== 'any') {
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
        const nearMatch: NearMatch = {
          ...gearbox,
          selectedRatio: closestRatioResult.ratio,
          ratioDiffPercent: closestRatioResult.diffPercent,
          failureReason
        };
        nearMatches.push(nearMatch);
      }
      continue;
    }

    // Get capacity for the best ratio
    let capacity: number | undefined;

    // 1. 优先使用 transmissionCapacityPerRatio 数组
    const tcpr = (gearbox as any).transmissionCapacityPerRatio as number[] | undefined;
    if (Array.isArray(tcpr) && tcpr.length > bestRatioIndex && typeof tcpr[bestRatioIndex] === 'number') {
      capacity = tcpr[bestRatioIndex];
      DEBUG_LOG(`Gearbox ${gearbox.model} using transmissionCapacityPerRatio at index ${bestRatioIndex}: ${capacity}`);
    }
    // 2. transmissionCapacityPerRatio 数组不完整时使用最接近的有效值
    else if (Array.isArray(tcpr) && tcpr.length > 0) {
      const validCapacities = tcpr.filter(c => typeof c === 'number' && c > 0);
      if (validCapacities.length > 0) {
        capacity = validCapacities[Math.min(bestRatioIndex, validCapacities.length - 1)];
        DEBUG_LOG(`Gearbox ${gearbox.model} using transmissionCapacityPerRatio fallback: ${capacity}`);
      }
    }
    // 3. 回退到 transferCapacity 数组
    if (!capacity && Array.isArray(gearbox.transferCapacity) && gearbox.transferCapacity.length > bestRatioIndex) {
      const tc = gearbox.transferCapacity[bestRatioIndex];
      if (typeof tc === 'number') {
        capacity = tc;
      }
    }
    // 4. transferCapacity 数组存在但索引不匹配时使用第一个值
    else if (!capacity && Array.isArray(gearbox.transferCapacity) && gearbox.transferCapacity.length > 0) {
      const tc = gearbox.transferCapacity[0];
      if (typeof tc === 'number') {
        capacity = tc;
        logger.warn(`Gearbox ${gearbox.model} using fallback transferCapacity[0] due to index mismatch`);
      }
    }
    // 5. 无有效数据则跳过
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

      // 容量接近的情况保存为近似匹配
      if (capacity >= requiredTransferCapacity * 0.85) {
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

    // 传递能力余量超过上限不显示
    if (capacityMargin > MAX_CAPACITY_MARGIN) {
      DEBUG_LOG(`Gearbox ${gearbox.model} capacity margin ${capacityMargin.toFixed(1)}% exceeds ${MAX_CAPACITY_MARGIN}%, excluded`);
      rejectionReasons.capacityTooHigh++;
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

          // 推力接近的情况保存为近似匹配
          if (gearbox.thrust >= thrustRequirement * 0.8) {
            const nearMatch: NearMatch = {
              ...gearbox,
              selectedRatio: gearbox.ratios[bestRatioIndex],
              selectedCapacity: capacity,
              capacityMargin: capacityMargin,
              ratioDiffPercent: bestRatioDiffPercent,
              thrustMet: false,
              failureReason
            };
            nearMatches.push(nearMatch);
          }
          continue;
        }
      } else {
        thrustMet = false;
        logger.debug(`Gearbox ${gearbox.model} has no thrust data, requirement ${thrustRequirement}kN cannot be verified.`);
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

    matchingGearboxes.push(matchingGearbox);
  }

  logger.log(`${gearboxType} 系列找到 ${matchingGearboxes.length} 个初步匹配的齿轮箱`);

  // 如果没有匹配的齿轮箱，返回近似匹配
  if (matchingGearboxes.length === 0) {
    logger.log(`匹配失败原因统计:`, rejectionReasons);

    if (nearMatches.length > 0) {
      // 对近似匹配进行评分和排序
      nearMatches.forEach(match => {
        let score = 0;

        // 按减速比偏差评分
        if (match.ratioDiffPercent !== undefined) {
          if (match.ratioDiffPercent <= MAX_RATIO_DIFF_PERCENT) {
            score += 100 - match.ratioDiffPercent * 2;
          } else {
            score += 50 - match.ratioDiffPercent;
          }
        }

        // 按容量余量评分
        if (match.capacityMargin !== undefined) {
          if (match.capacityMargin >= 0 && match.capacityMargin <= MAX_CAPACITY_MARGIN) {
            score += 100 - Math.abs(match.capacityMargin - 15) * 2;
          } else if (match.capacityMargin < 0) {
            score += 50 + match.capacityMargin;
          } else {
            score += 50 - (match.capacityMargin - MAX_CAPACITY_MARGIN) / 2;
          }
        }

        // 按推力要求评分
        if (thrustRequirement > 0) {
          if (match.thrustMet === true) {
            score += 100;
          } else if (match.thrust !== undefined) {
            score += 50 * (match.thrust / thrustRequirement);
          }
        }

        // 特殊打包价格加分
        const gwConfig = getGWPackagePriceConfig(match.model || '');
        if (gwConfig && !gwConfig.isSmallGWModel) {
          score += 20;
        }

        match.score = score / 3;

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

      return {
        success: false,
        message: `没有找到符合所有条件的 ${gearboxType} 系列齿轮箱，主要原因: ${mainReason}`,
        recommendations: nearMatches as SelectionRecommendation[],
        gearboxTypeUsed: gearboxType,
        rejectionReasons,
        engineTorque: engineTorque_Nm,
        requiredTransferCapacity: requiredTransferCapacity,
        warning: "找到一些接近条件的齿轮箱，但它们不满足全部选型要求。请考虑调整输入参数。"
      };
    }

    return {
      success: false,
      message: `没有找到符合条件的 ${gearboxType} 系列齿轮箱`,
      recommendations: [],
      gearboxTypeUsed: gearboxType,
      rejectionReasons
    };
  }

  // --- 可配置评分权重 ---
  const scoringWeights = options.scoringWeights || DEFAULT_SCORING_WEIGHTS;
  const W_COST = scoringWeights.costEffectiveness || 37;
  const W_RATIO = scoringWeights.ratioMatch || 25;
  const W_CAPACITY = scoringWeights.capacityMargin || 15;
  const W_THRUST = scoringWeights.thrustSatisfy || 10;
  const W_PACKAGE = scoringWeights.specialPackage || 5;
  const W_SHAFT = scoringWeights.shaftMatch || 8;

  // --- Score the matching gearboxes ---
  const scoredGearboxes = matchingGearboxes.map(gearbox => {
    let score = 0;

    // 1. Capacity Margin Score
    if (gearbox.capacityMargin >= 5 && gearbox.capacityMargin <= 20) score += W_CAPACITY;
    else if (gearbox.capacityMargin > 20 && gearbox.capacityMargin <= 30) score += W_CAPACITY * 0.93;
    else if (gearbox.capacityMargin > 30 && gearbox.capacityMargin <= MAX_CAPACITY_MARGIN) score += W_CAPACITY * 0.8;
    else if (gearbox.capacityMargin >= 3 && gearbox.capacityMargin < 5) score += W_CAPACITY * 0.45;
    else if (gearbox.capacityMargin >= 0 && gearbox.capacityMargin < 3) score += W_CAPACITY * 0.15;

    // 2. Ratio Match Score
    if (gearbox.ratioDiffPercent <= 3) score += W_RATIO;
    else if (gearbox.ratioDiffPercent <= 7) score += W_RATIO * 0.88;
    else if (gearbox.ratioDiffPercent <= 12) score += W_RATIO * 0.72;
    else if (gearbox.ratioDiffPercent <= 18) score += W_RATIO * 0.48;
    else if (gearbox.ratioDiffPercent <= MAX_RATIO_DIFF_PERCENT) score += W_RATIO * 0.32;

    // 3. Cost-Effectiveness Score - calculated later
    const basePrice = gearbox.basePrice || gearbox.price || 0;

    // 4. Thrust Match Score
    if (thrustRequirement > 0) {
      score += gearbox.thrustMet ? W_THRUST : 0;
      if (!gearbox.thrustMet) logger.warn(`Gearbox ${gearbox.model} thrust ${gearbox.thrust} < required ${thrustRequirement}`);
    } else {
      score += W_THRUST * 0.5;
    }

    // 5. Special package price bonus
    if (gearbox.hasSpecialPackagePrice) {
      score += W_PACKAGE;
      logger.debug(`为GW系列特殊打包价格齿轮箱 ${gearbox.model} 加分${W_PACKAGE}分`);
    }

    // 6. Interface Match Score (仅在prefer模式下加分)
    const W_INTERFACE = 8;  // 接口匹配权重
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
    if (options.shaftArrangement && options.shaftArrangement.axisAlignment && options.shaftArrangement.axisAlignment !== 'any') {
      // 已经通过了过滤，说明匹配成功，加满分
      score += W_SHAFT;
      logger.debug(`齿轮箱 ${gearbox.model} 轴布置匹配，加分${W_SHAFT}分`);
    } else {
      // 无轴布置要求时给基础分
      score += W_SHAFT * 0.5;
    }

    gearbox.score = score;
    gearbox._scoringWeights = scoringWeights;

    // Add price per capacity for normalization
    if (basePrice > 0 && gearbox.selectedCapacity > 0) {
      gearbox._pricePerCapacity = basePrice / gearbox.selectedCapacity;
    } else {
      gearbox._pricePerCapacity = Infinity;
    }

    return gearbox;
  });

  // Normalize Price Score
  if (scoredGearboxes.length > 1) {
    let minPPC = Infinity;
    let maxPPC = 0;
    scoredGearboxes.forEach(g => {
      if (g._pricePerCapacity !== Infinity) {
        if (g._pricePerCapacity! < minPPC) minPPC = g._pricePerCapacity!;
        if (g._pricePerCapacity! > maxPPC) maxPPC = g._pricePerCapacity!;
      }
    });

    const priceRange = maxPPC - minPPC;

    scoredGearboxes.forEach(g => {
      let priceScore = 0;
      if (g._pricePerCapacity !== Infinity) {
        if (priceRange > 0) {
          priceScore = W_COST * (1 - (g._pricePerCapacity! - minPPC) / priceRange);
        } else {
          priceScore = W_COST;
        }
      }

      g.score = Math.max(0, Math.min(100, Math.round((g.score || 0) + priceScore)));
      delete g._pricePerCapacity;
    });
  } else if (scoredGearboxes.length === 1) {
    if ((scoredGearboxes[0].basePrice || scoredGearboxes[0].price) > 0) {
      scoredGearboxes[0].score = Math.max(0, Math.min(100, Math.round((scoredGearboxes[0].score || 0) + W_COST)));
    } else {
      scoredGearboxes[0].score = Math.max(0, Math.min(100, Math.round((scoredGearboxes[0].score || 0) + W_COST * 0.1)));
    }
  }

  // --- Sort scored gearboxes ---
  scoredGearboxes.sort((a, b) => {
    // 1. 性能满足检查
    const aOk = a.capacityMargin > 0;
    const bOk = b.capacityMargin > 0;
    if (aOk !== bOk) return aOk ? -1 : 1;

    // 1.5. 接口匹配优先 (有接口要求时)
    if (hasInterfaceRequirement) {
      const aMatched = a.interfaceMatch?.matched || false;
      const bMatched = b.interfaceMatch?.matched || false;
      if (aMatched !== bMatched) return aMatched ? -1 : 1;
    }

    // 2. 综合评分优先
    if (Math.abs((b.score || 0) - (a.score || 0)) > 3) {
      return (b.score || 0) - (a.score || 0);
    }

    // 3. 按单位容量价格排序
    const aPrice = a.factoryPrice || a.basePrice || a.price || 0;
    const bPrice = b.factoryPrice || b.basePrice || b.price || 0;
    if (aPrice > 0 && bPrice > 0 && a.selectedCapacity > 0 && b.selectedCapacity > 0) {
      const aPricePerCap = aPrice / a.selectedCapacity;
      const bPricePerCap = bPrice / b.selectedCapacity;
      if (Math.abs(aPricePerCap - bPricePerCap) > 1000) {
        return aPricePerCap - bPricePerCap;
      }
    }

    // 4. 特殊打包价格
    if (a.hasSpecialPackagePrice !== b.hasSpecialPackagePrice) {
      return a.hasSpecialPackagePrice ? -1 : 1;
    }

    // 5. 余量最优
    const aOptimalMargin = Math.abs(a.capacityMargin - 12.5);
    const bOptimalMargin = Math.abs(b.capacityMargin - 12.5);
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
      nearMatchCount: nearMatches.length,
      totalScanned: gearboxes.length,
      totalMatched: matchingGearboxes.length
    }
  };

  // --- Add consolidated warning ---
  let consolidatedWarning: string | null = null;
  if (result.success && topRecommendation) {
    if (topRecommendation.capacityMargin < 5) {
      consolidatedWarning = `警告：首选齿轮箱(${topRecommendation.model})功率余量(${topRecommendation.capacityMargin.toFixed(1)}%)过低`;
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

  // Define types to check
  const availableTypes = (
    ['HC', 'GW', 'HCM', 'DT', 'HCQ', 'GC'] as const
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

    if (result.success && result.recommendations.length > 0) {
      logger.log(`${type} 系列找到 ${result.recommendations.length} 个推荐`);
      result.recommendations.forEach(rec => {
        (rec as any).originalType = type;
        if (type === 'GW' && motorPower > 800) rec.score = (rec.score || 0) + 5;
        if (type === 'HCM' && motorSpeed > 2000) rec.score = (rec.score || 0) + 3;
        if (rec.hasSpecialPackagePrice) {
          rec.score = (rec.score || 0) + 15;
        }
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
            rec.score = rec.score * 0.85;
          }

          if (rec.hasSpecialPackagePrice) {
            rec.score = (rec.score || 0) + 10;
          }

          (rec as any).failureReason = (rec as any).failureReason || "不满足部分选型条件";
        });

        const topPartialMatches = result.recommendations
          .filter(rec => (rec.score || 0) > 60 || rec.hasSpecialPackagePrice)
          .slice(0, 2);

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

      return {
        success: false,
        message: '在所有相关系列中均未找到完全符合条件的齿轮箱，但有一些近似匹配',
        recommendations: bestNearMatches as SelectionRecommendation[],
        engineTorque: motorPower * 9550 / motorSpeed,
        requiredTransferCapacity: motorPower / motorSpeed,
        warning: "以下是部分符合条件的齿轮箱，请评估是否可以调整需求或选择其他参数。",
        allResults
      };
    }

    return {
      success: false,
      message: '在所有相关系列中均未找到符合条件的齿轮箱',
      recommendations: [],
      allResults
    };
  }

  // 2. Sort all combined recommendations globally
  allRecommendations.sort((a, b) => {
    if (a.hasSpecialPackagePrice !== b.hasSpecialPackagePrice) {
      return a.hasSpecialPackagePrice ? -1 : 1;
    }

    if ((a as any).isPartialMatch !== (b as any).isPartialMatch) {
      return (a as any).isPartialMatch ? 1 : -1;
    }

    if (Math.abs((b.score || 0) - (a.score || 0)) > 5) {
      return (b.score || 0) - (a.score || 0);
    }

    const aIdealMargin = a.capacityMargin >= 10 && a.capacityMargin <= 20;
    const bIdealMargin = b.capacityMargin >= 10 && b.capacityMargin <= 20;
    if (aIdealMargin && !bIdealMargin) return -1;
    if (!aIdealMargin && bIdealMargin) return 1;

    return Math.abs(a.capacityMargin - 15) - Math.abs(b.capacityMargin - 15);
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
    partialMatchCount: allRecommendations.filter(r => (r as any).isPartialMatch).length,
    _meta: {
      calculationTime: new Date().toISOString(),
      version: '1.0',
      dataVersion: appData?._version || 'unknown'
    }
  };

  // 6. Generate final consolidated warning
  let consolidatedWarning: string | null = null;
  if (finalResult.success && bestOverallGearbox) {
    if ((bestOverallGearbox as any).isPartialMatch) {
      consolidatedWarning = `警告：最终推荐的齿轮箱(${bestOverallGearbox.model})是部分匹配结果，${(bestOverallGearbox as any).failureReason || '不完全满足所有要求'}`;
    }

    if (bestOverallGearbox.capacityMargin < 5) {
      const capacityWarning = `警告：最终推荐齿轮箱(${bestOverallGearbox.model})功率余量(${bestOverallGearbox.capacityMargin.toFixed(1)}%)过低`;
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
