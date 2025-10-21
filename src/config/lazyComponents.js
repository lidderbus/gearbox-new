/**
 * 懒加载组件配置
 * 使用React.lazy实现路由级别的代码分割
 */

import { lazy } from 'react';

// 懒加载页面组件
export const LoginPage = lazy(() => import('../components/LoginPage'));
export const UserManagementView = lazy(() => import('../components/UserManagementView'));
export const DatabaseManagementView = lazy(() => import('../components/DatabaseManagementView'));
export const QuotationView = lazy(() => import('../components/QuotationView'));
export const AgreementView = lazy(() => import('../components/AgreementView'));
export const ContractView = lazy(() => import('../components/ContractView'));
export const GearboxComparisonView = lazy(() => import('../components/GearboxComparisonView'));
export const DataQuery = lazy(() => import('../components/DataQuery'));
export const DiagnosticPanel = lazy(() => import('../components/DiagnosticPanel'));
export const TechnicalAgreementView = lazy(() => import('../components/TechnicalAgreementView'));
export const PriceCalculator = lazy(() => import('../components/PriceCalculator'));
export const BatchPriceAdjustment = lazy(() => import('../components/BatchPriceAdjustment'));

// 懒加载大型工具组件
export const GearboxDataImporter = lazy(() => import('../components/GearboxDataImporter'));
export const JsonDataImporter = lazy(() => import('../components/JsonDataImporter'));

/**
 * 预加载关键路由
 * 在用户可能访问前提前加载
 */
export const preloadCriticalRoutes = () => {
  // 预加载报价视图（最常用的功能）
  import('../components/QuotationView');
  // 预加载技术协议（常用功能）
  import('../components/TechnicalAgreementView');
};

/**
 * 预加载指定组件
 */
export const preloadComponent = (componentName) => {
  const importMap = {
    'QuotationView': () => import('../components/QuotationView'),
    'AgreementView': () => import('../components/AgreementView'),
    'ContractView': () => import('../components/ContractView'),
    'DiagnosticPanel': () => import('../components/DiagnosticPanel'),
  };

  const loader = importMap[componentName];
  if (loader) {
    return loader();
  }
};

export default {
  LoginPage,
  UserManagementView,
  DatabaseManagementView,
  QuotationView,
  AgreementView,
  ContractView,
  GearboxComparisonView,
  DataQuery,
  DiagnosticPanel,
  TechnicalAgreementView,
  PriceCalculator,
  BatchPriceAdjustment,
  preloadCriticalRoutes,
  preloadComponent,
};
