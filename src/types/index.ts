/**
 * 类型定义入口文件
 * 集中导出所有类型定义
 */

// 齿轮箱相关类型
export type {
  GearboxSeries,
  Gearbox,
  SelectionParams,
  SelectionOptions,
  SelectionResult,
  CouplingInfo,
  PumpInfo,
  PackagePriceConfig,
  PriceInfo,
  ValidationResult,
} from './gearbox.types';

// 报价单相关类型
export type {
  QuotationItem,
  Quotation,
  QuotationComparison,
  QuotationDifference,
  QuotationExportOptions,
  QuotationHistory,
} from './quotation.types';

// 认证相关类型
export type {
  UserRole,
  Permission,
  User,
  LoginCredentials,
  LoginResult,
  AuthContextType,
} from './auth.types';

// 通用类型
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
  total?: number;
}

export interface SortParams {
  field: string;
  order: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}
