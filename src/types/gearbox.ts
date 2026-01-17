// src/types/gearbox.ts
// 齿轮箱选型系统核心类型定义

/**
 * 齿轮箱系列类型
 */
export type GearboxSeries =
  | 'HC' | 'HCM' | 'HCQ' | 'HCX' | 'HCA' | 'HCV'
  | 'GW' | 'GC' | 'DT' | 'MV' | 'OTHER';

/**
 * 齿轮箱基础数据结构
 */
export interface Gearbox {
  /** 型号 */
  model: string;
  /** 系列 */
  series?: GearboxSeries | string;
  /** 输入转速范围 [min, max] rpm */
  inputSpeedRange: [number, number];
  /** 减速比数组 */
  ratios: number[];
  /** 传递能力数组 kW/(r/min) - 与ratios一一对应 */
  transferCapacity: number[];
  /** 推力 kN */
  thrust?: number;
  /** 重量 kg */
  weight?: number;
  /** 中心距 mm */
  centerDistance?: number;
  /** 标准中心距 mm */
  standardCenterDistance?: number;
  /** 基准价格 元 */
  basePrice?: number;
  /** 折扣率 0-1 */
  discountRate?: number;
  /** 工厂价 元 */
  factoryPrice?: number;
  /** 市场价 元 */
  marketPrice?: number;
  /** 备注 */
  notes?: string;
  /** 图片URL */
  imageUrl?: string;
}

/**
 * 联轴器类型
 */
export type CouplingType = 'HGTL' | 'HGTH' | 'HGTHB' | 'HGTHJB';

/**
 * 联轴器数据结构
 */
export interface Coupling {
  /** 型号 */
  model: string;
  /** 类型 */
  type?: CouplingType | string;
  /** 额定扭矩 kN·m */
  ratedTorque?: number;
  /** 最大扭矩 kN·m */
  maxTorque?: number;
  /** 转动惯量 kg·m² */
  inertia?: number;
  /** 重量 kg */
  weight?: number;
  /** 是否带罩壳 */
  hasCover?: boolean;
  /** 基准价格 元 */
  basePrice?: number;
  /** 折扣率 0-1 */
  discountRate?: number;
  /** 工厂价 元 */
  factoryPrice?: number;
  /** 市场价 元 */
  marketPrice?: number;
  /** 备注 */
  notes?: string;
  /** 允许额外字段 */
  [key: string]: unknown;
}

/**
 * 备用泵数据结构
 */
export interface StandbyPump {
  /** 型号 */
  model: string;
  /** 排量 mL/r */
  displacement?: number;
  /** 额定压力 MPa */
  ratedPressure?: number;
  /** 流量 L/min */
  flowRate?: number;
  /** 功率 kW */
  power?: number;
  /** 重量 kg */
  weight?: number;
  /** 基准价格 元 */
  basePrice?: number;
  /** 折扣率 0-1 */
  discountRate?: number;
  /** 工厂价 元 */
  factoryPrice?: number;
  /** 市场价 元 */
  marketPrice?: number;
  /** 备注 */
  notes?: string;
  /** 允许额外字段 */
  [key: string]: unknown;
}

/**
 * 选型输入参数
 */
export interface SelectionInput {
  /** 发动机功率 kW */
  enginePower: number;
  /** 发动机转速 rpm */
  engineSpeed: number;
  /** 目标减速比 */
  targetRatio: number;
  /** 推力需求 kN */
  thrustRequirement?: number;
  /** 齿轮箱系列 */
  gearboxType?: GearboxSeries | string;
  /** 工况条件 */
  workCondition?: string;
  /** 工作温度 °C */
  temperature?: number;
  /** 是否带罩壳 */
  hasCover?: boolean;
  /** 应用场景 */
  application?: string;
  /** 混动配置 */
  hybridConfig?: HybridConfig;
}

/**
 * 混动配置
 */
export interface HybridConfig {
  enabled: boolean;
  modes?: {
    pto?: boolean;  // Power Take Off
    pti?: boolean;  // Power Take In
  };
  motorPower?: number;
  motorSpeed?: number;
}

/**
 * 选型推荐结果
 */
export interface SelectionRecommendation {
  /** 齿轮箱数据 (展开) */
  model: string;
  series?: string;
  ratios: number[];
  transferCapacity: number[];
  /** 匹配的减速比 */
  selectedRatio: number;
  ratio: number;
  /** 匹配的传递能力 */
  selectedCapacity: number;
  /** 传递能力余量 % */
  capacityMargin: number;
  /** 推力是否满足 */
  thrustMet?: boolean;
  /** 减速比偏差 % */
  ratioDiffPercent: number;
  /** 安全系数 */
  safetyFactor?: number;
  /** 评分 */
  score: number;
  /** 发动机扭矩 N·m */
  engineTorque?: number;
  /** 价格信息 */
  basePrice?: number;
  factoryPrice?: number;
  marketPrice?: number;
  packagePrice?: number;
  /** 是否有特殊打包价格 */
  hasSpecialPackagePrice?: boolean;
  /** 联轴器匹配结果 */
  couplingMatch?: CouplingMatchResult;
  /** 备用泵匹配结果 */
  pumpMatch?: PumpMatchResult;
  /** 警告信息 */
  warnings?: string[];
  /** 是否为部分匹配 */
  isPartialMatch?: boolean;
  /** 失败原因 */
  failureReason?: string;
  /** 原始系列类型 */
  originalType?: string;
}

/**
 * 联轴器匹配结果
 */
export interface CouplingMatchResult {
  success: boolean;
  coupling?: Coupling;
  message?: string;
  torqueMargin?: number;
  recommendations?: Coupling[];
}

/**
 * 备用泵匹配结果
 */
export interface PumpMatchResult {
  success: boolean;
  pump?: StandbyPump;
  message?: string;
  recommendations?: StandbyPump[];
}

/**
 * 选型结果
 */
export interface SelectionResult {
  /** 是否成功 */
  success: boolean;
  /** 消息 */
  message?: string;
  /** 推荐列表 */
  recommendations: SelectionRecommendation[];
  /** 使用的齿轮箱类型 */
  gearboxTypeUsed?: string;
  /** 调试信息 */
  debugInfo?: SelectionDebugInfo;
}

/**
 * 选型调试信息
 */
export interface SelectionDebugInfo {
  inputParams: SelectionInput;
  scoringWeights?: Record<string, number>;
  tolerances?: Record<string, number>;
  rejectionReasons?: Record<string, number>;
  nearMatchCount?: number;
  totalScanned?: number;
  totalMatched?: number;
}

/**
 * 应用数据集合
 */
export interface AppData {
  hcGearboxes?: Gearbox[];
  gwGearboxes?: Gearbox[];
  hcmGearboxes?: Gearbox[];
  dtGearboxes?: Gearbox[];
  hcqGearboxes?: Gearbox[];
  gcGearboxes?: Gearbox[];
  hcxGearboxes?: Gearbox[];
  hcaGearboxes?: Gearbox[];
  hcvGearboxes?: Gearbox[];
  mvGearboxes?: Gearbox[];
  otherGearboxes?: Gearbox[];
  flexibleCouplings?: Coupling[];
  standbyPumps?: StandbyPump[];
  _version?: string;
  _lastUpdated?: string;
}

/**
 * 验证结果
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  model?: string;
  originalIndex?: number;
}

/**
 * 价格常量
 */
export interface PriceConstants {
  DEFAULT_DISCOUNT_RATE: number;
  MARKET_PRICE_MULTIPLIER: number;
  SERIES_DISCOUNT_RATES: Record<string, number>;
  FIXED_PRICE_SERIES: string[];
  SPECIAL_MODEL_DISCOUNTS: Record<string, number>;
  SPECIAL_PACKAGE_PRICES: Record<string, number>;
}
