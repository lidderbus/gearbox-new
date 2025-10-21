/**
 * 齿轮箱相关类型定义
 */

/**
 * 齿轮箱系列类型
 */
export type GearboxSeries = 'HC' | 'GW' | 'HCM' | 'DT' | 'GC' | '2GWH' | 'Hybrid';

/**
 * 齿轮箱型号
 */
export interface Gearbox {
  id: string;
  model: string;
  series: GearboxSeries;
  maxPower: number;
  maxTorque: number;
  ratios: number[];
  inputSpeedRange?: {
    min: number;
    max: number;
  };
  price?: {
    factory: number;
    market: number;
  };
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  hasSpecialPackagePrice?: boolean;
  gwPackageConfig?: PackagePriceConfig;
}

/**
 * 选型参数
 */
export interface SelectionParams {
  enginePower: number;
  engineSpeed: number;
  targetRatio: number;
  thrustRequirement?: number;
  gearboxType?: GearboxSeries;
  options?: SelectionOptions;
}

/**
 * 选型选项
 */
export interface SelectionOptions {
  workCondition?: 'light' | 'medium' | 'heavy';
  temperature?: number;
  hasCover?: boolean;
  application?: string;
  safetyFactor?: number;
}

/**
 * 选型结果
 */
export interface SelectionResult {
  success: boolean;
  message?: string;
  gearbox?: Gearbox;
  selectedRatio?: number;
  recommendations?: Gearbox[];
  gearboxTypeUsed?: GearboxSeries;
  coupling?: CouplingInfo;
  pump?: PumpInfo;
}

/**
 * 联轴器信息
 */
export interface CouplingInfo {
  model: string;
  type: string;
  torque: number;
  bore?: number;
  price?: number;
}

/**
 * 泵信息
 */
export interface PumpInfo {
  model: string;
  type: string;
  flow: number;
  pressure: number;
  price?: number;
}

/**
 * 特殊打包价格配置
 */
export interface PackagePriceConfig {
  baseModel: string;
  couplingModel: string;
  pumpModel: string;
  packagePrice: number;
  individualPriceSum: number;
  discount: number;
}

/**
 * 价格信息
 */
export interface PriceInfo {
  factoryPrice: number;
  marketPrice: number;
  discountRate?: number;
  currency?: 'CNY' | 'USD';
}

/**
 * 数据验证结果
 */
export interface ValidationResult {
  valid: boolean;
  errors?: string[];
  warnings?: string[];
}
