// src/App.js - Main Application Component (Modified with Enhanced Features)
// 性能优化: 使用React.lazy实现代码分割

// === 所有import语句必须放在文件最前面 ===
import React, { useState, useEffect, useCallback, useMemo, lazy, Suspense, useRef } from 'react';
import { Container, Row, Col, Button, Card, Tab, Tabs, Spinner, Offcanvas, Alert } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { userRoles } from './auth/roles';
import './App.css';
import ModernNavBar from './components/ModernNavBar';
import { suppressRepairWarnings, logger } from './config/logging';
import { toast } from './utils/toast';
import { needsStandbyPump } from './utils/enhancedPumpSelection';
import { correctDatabase } from './utils/dataCorrector';
import { correctPriceData } from './utils/priceManager';
import { validateDatabase } from './utils/dataValidator';
import { savePriceHistory, compareAndTrackChanges, getPriceHistory, clearPriceHistory } from './utils/priceHistoryTracker';
import BatchPriceAdjustment from './components/BatchPriceAdjustment';
import { getGWPackagePriceConfig } from './data/packagePriceConfig';
import { enhanceGearboxData } from './utils/gearboxDataEnhancer';
import { useSelectionConfig } from './contexts/SelectionConfigContext';
import { SelectionResultProvider } from './contexts/SelectionResultContext';
import PriceWarningBanner from './components/PriceWarningBanner';
import FeedbackWidget from './components/FeedbackWidget';
import ToastContainer from './components/ToastContainer';
import SidebarNav from './components/SidebarNav';
import { useIsMobile } from './hooks/useIsMobile';
import { trackPageView, trackFeature } from './utils/analytics';
import { useInIframe } from './hooks/useInIframe';
import ComparisonResultModal from './components/ComparisonResultModal';
import InputParametersTab from './components/InputParametersTab';
import AppHeader from './components/AppHeader';
import QuotationEnhancedOptions from './components/QuotationEnhancedOptions';
import SelectionResultTab from './components/SelectionResultTab';
import HistoryTabContent from './components/HistoryTabContent';
import useQuotationHandlers from './hooks/useQuotationHandlers';
import useExportHandlers from './hooks/useExportHandlers';
import useHistoryHandlers from './hooks/useHistoryHandlers';
import useSelectionHandlers from './hooks/useSelectionHandlers';
import usePriceHandlers from './hooks/usePriceHandlers';
import useFormHandlers from './hooks/useFormHandlers';

// === 非import语句 (lazy组件、常量等) ===
// 性能优化: 非关键组件使用React.lazy懒加载
// 这些组件只在用户导航到对应Tab时才加载，减少首屏加载时间60-70%
const QuotationView = lazy(() => import('./components/QuotationView'));
const ContractView = lazy(() => import('./components/ContractView'));
const DataQuery = lazy(() => import('./components/DataQuery'));
const DiagnosticPanel = lazy(() => import('./components/DiagnosticPanel'));
const TechnicalAgreementView = lazy(() => import('./components/TechnicalAgreementView'));
const HCCouplingVisualization = lazy(() => import('./components/HCCouplingVisualization'));
const BatchSelectionView = lazy(() => import('./components/BatchSelectionView'));
const PumpSelectionView = lazy(() => import('./components/PumpSelectionView'));
const OutlineDrawingQuery = lazy(() => import('./components/OutlineDrawingQuery'));
const StatisticsDashboard = lazy(() => import('./components/StatisticsDashboard'));
const AnalyticsDashboard = lazy(() => import('./components/AnalyticsDashboard'));
const CouplingSelectionPage = lazy(() => import('./pages/CouplingSelection/CouplingSelectionPage'));
const TorsionalAnalysis = lazy(() => import('./components/torsional/TorsionalAnalysis'));
const EnergyDashboard = lazy(() => import('./components/EnergyDashboard'));
const DocumentDashboard = lazy(() => import('./components/DocumentDashboard'));

// 新增推进系统模块 (性能优化: lazy加载)
const CPPSelectionView = lazy(() => import('./components/cpp/CPPSelectionView'));
const AzimuthThrusterSelector = lazy(() => import('./components/azimuth/AzimuthThrusterSelector'));
const ThrusterSelector = lazy(() => import('./components/thruster/ThrusterSelector'));
const ShaftSystemSelector = lazy(() => import('./components/shaft/ShaftSystemSelector'));
const CompetitorComparisonView = lazy(() => import('./components/competitor/CompetitorComparisonView'));
const CumminsMatchingView = lazy(() => import('./components/CumminsMatchingView'));

// HCM轻型高速系列专用模块 (2026-01-08新增)
const HCMSelectionModule = lazy(() => import('./components/HCMSelectionModule'));
const EngineMatchingCases = lazy(() => import('./components/EngineMatchingCases'));

// 产品中心 - 综合产品库 (2026-01-11新增)
const ProductCenter = lazy(() => import('./components/ProductCenter'));

// 说明书库 - 产品说明书浏览 (2026-01-20新增)
const ManualLibrary = lazy(() => import('./components/ManualLibrary'));

// 技术协议模板库 - 历史技术协议模板 (2026-01-22新增)
const TemplateLibrary = lazy(() => import('./components/TemplateLibrary'));

// 首页Dashboard (2026-02-18新增)
const HomeView = lazy(() => import('./components/HomeView'));

// 上海公司审计整改模块 (2026-01-15新增)
const InventoryManagement = lazy(() => import('./components/InventoryManagement'));
const ReceivablesManagement = lazy(() => import('./components/ReceivablesManagement'));

// 增强选型表单 - 完整技术询单 (2026-01-10新增)
const EnhancedSelectionForm = lazy(() => import('./components/EnhancedSelectionForm'));

// Modal components (lazy loaded - only loaded when opened)
const QuotationOptionsModal = lazy(() => import('./components/QuotationOptionsModal'));
const CustomQuotationItemModal = lazy(() => import('./components/CustomQuotationItemModal'));
const QuotationHistoryModal = lazy(() => import('./components/QuotationHistoryModal'));

// 懒加载组件的加载指示器
const LazyLoadFallback = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <Spinner animation="border" variant="primary" />
    <span className="ms-2">加载中...</span>
  </div>
);

const forceReset = () => {
  try {
    logger.log("开始强制重置数据...");

    // 只清除选型系统自己的 localStorage 键，保护报价系统等其他应用数据
    const gearboxKeys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      // 保护报价系统数据: gearbox_quotations, quote_*, QuoteDB 相关键
      if (key && !key.startsWith('quote') && !key.startsWith('Quote') && key !== 'gearbox_quotations') {
        gearboxKeys.push(key);
      }
    }
    gearboxKeys.forEach(key => localStorage.removeItem(key));
    logger.log(`localStorage已清除 ${gearboxKeys.length} 个选型系统键（保留报价数据）`);

    sessionStorage.clear();
    logger.log("sessionStorage已清除");

    // 只删除选型系统的 IndexedDB，保护 QuoteDB 等其他应用数据库
    const PROTECTED_DBS = ['QuoteDB', 'QuoteDatabase'];
    if (window.indexedDB) {
        indexedDB.databases().then(dbs => {
            dbs.forEach(db => {
                if (PROTECTED_DBS.includes(db.name)) {
                    logger.log(`跳过受保护的数据库: ${db.name}`);
                    return;
                }
                logger.log(`尝试删除indexedDB数据库 ${db.name}`);
                indexedDB.deleteDatabase(db.name).onsuccess = () => logger.log(`indexedDB数据库 ${db.name} 已删除`);
                indexedDB.deleteDatabase(db.name).onerror = (event) => logger.error(`删除indexedDB数据库 ${db.name} 失败`, event.target.error);
            });
        }).catch(err => logger.error("枚举indexedDB数据库失败:", err));
    }

    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    logger.log("Cookies已清除");

    toast.success("所有本地数据和设置已清除，页面将在3秒后重新加载...");

    setTimeout(() => {
      window.location.href = window.location.pathname + "?reset=" + new Date().getTime();
    }, 3000);
  } catch (error) {
    logger.error("重置过程出错:", error);
    toast.error("重置过程出错: " + error.message + "。尝试手动刷新页面。");
    window.location.reload();
  }
};

function App({ appData: initialAppData, setAppData }) {
  // Suppress repair warnings in development
  if (process.env.NODE_ENV === 'development') {
    suppressRepairWarnings();
  }
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // 选型配置 - 可配置权重和容差
  const { getEffectiveConfig } = useSelectionConfig();

  const [appDataState, setAppDataState] = useState(initialAppData);

  // 选型诊断信息 - 用于智能提示 (值未直接使用，但setter传递给hooks)
  const [, setSelectionDiagnostics] = useState(null);


  const [engineData, setEngineData] = useState({ power: '', speed: '' });
  const [hybridConfig, setHybridConfig] = useState({
    enabled: false,
    modes: { pto: false, pti: false, pth: false },
    ptoPower: '',
    ptiPower: '',
    fuelType: 'MDO'
  });
  const [requirementData, setRequirementData] = useState({
    targetRatio: '',
    thrustRequirement: '',
    workCondition: "III类:扭矩变化中等",
    temperature: "30",
    hasCover: false,
    application: 'propulsion',
    // HCG铝合金系列工况 (P/L/M/C)
    hcgWorkload: 'C',  // 默认: C-持续工况
    // 推进配置
    engineConfiguration: 'single',      // 'single' | 'dual'
    inputRotation: 'clockwise',         // 'clockwise' | 'counterclockwise'
    outputRotation: 'clockwise',        // 'clockwise' | 'counterclockwise'
    propellerConfig: 'outward',         // 'outward' | 'inward' (仅双机)
    // 双机配置
    portEngineRotation: null,           // null=自动, 'clockwise', 'counterclockwise'
    starboardEngineRotation: null,
    portUseReverse: false,
    starboardUseReverse: false,
    // 轴布置方式
    shaftArrangement: { axisAlignment: 'any', offsetDirection: 'any' },
    // 离合器需求
    hasClutch: null,   // null=不限, true=需要带离合器, false=不需要离合器
  });
  const [projectInfo, setProjectInfo] = useState({
    projectName: '',
    customerName: '',
    projectNumber: '',
    contactPerson: '',
    contactPhone: '',
    contactEmail: '',
    engineModel: ''
  });
  const [gearboxType, setGearboxType] = useState('auto');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectionResult, setSelectionResult] = useState(null);
  const [quotation, setQuotation] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [contract, setContract] = useState(null);
  // 技术协议特殊订货要求 - 用于与合同同步
  const [agreementSpecialRequirements, setAgreementSpecialRequirements] = useState('');
  const [activeTab, setActiveTabRaw] = useState('home');
  const tabToPathRef = useRef({});
  const setActiveTab = useCallback((tab) => {
    setActiveTabRaw(tab);
    trackPageView(tab);
    // Reverse sync: update URL hash when tab changes
    const path = tabToPathRef.current[tab];
    if (path) {
      const newHash = '#' + path;
      if (window.location.hash !== newHash) {
        window.history.replaceState(null, '', newHash);
      }
    }
    // 切换tab时滚动到页面顶部，避免短页面内容超出视口
    window.scrollTo(0, 0);
  }, []);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { isMobile } = useIsMobile();
  const [selectionHistory, setSelectionHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [selectedGearboxIndex, setSelectedGearboxIndex] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState({
    gearbox: null,
    coupling: null,
    pump: null
  });

  // 用于追踪上一次的推荐列表，避免在 priceData 更新时错误重置用户的手动选择
  const prevRecommendationsRef = useRef(null);

  // 原有的价格状态 - 保留兼容性 (值未直接使用，但setter传递给hooks)
  const [, setPackagePrice] = useState(0);
  const [, setMarketPrice] = useState(0);
  const [, setTotalMarketPrice] = useState(0);
  
  // 新增统一的价格状态对象 - 修改部分，新增更详细的价格状态 
  const [priceData, setPriceData] = useState({
    packagePrice: 0,
    marketPrice: 0,
    totalMarketPrice: 0,
    gearbox: null,
    coupling: null,
    pump: null,
    hasSpecialPackagePrice: false,
    specialPackageConfig: null,
    needsPump: false,
    includePump: true
  });
  
  const [showBatchPriceAdjustment, setShowBatchPriceAdjustment] = useState(false);
  
  // 新增报价单相关状态
  const [showQuotationOptions, setShowQuotationOptions] = useState(false);
  const [showCustomItemModal, setShowCustomItemModal] = useState(false);
  const [showQuotationHistoryModal, setShowQuotationHistoryModal] = useState(false);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [comparisonResult, setComparisonResult] = useState(null);

  const [showDiagnosticPanel, setShowDiagnosticPanel] = useState(false);

  // 使用表单处理函数 Hook
  const {
    getFieldValidationState,
    getValidationClassName,
    isFormValid,
    handleEngineDataChange,
    handleRequirementDataChange,
    handleProjectInfoChange,
    handleGearboxTypeChange
  } = useFormHandlers({
    engineData,
    requirementData,
    setEngineData,
    setRequirementData,
    setProjectInfo,
    setGearboxType,
    setError
  });

  // 初始化页面浏览追踪
  useEffect(() => {
    trackPageView('home');
    trackFeature('app_init');
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Hash-based navigation sync with activeTab
  const pathToTab = useMemo(() => ({
    '/': 'home',
    '/home': 'home',
    '/selection': 'input',
    '/input': 'input',
    '/comparison': 'result',
    '/result': 'result',
    '/batch': 'batch',
    '/pump-selection': 'pump-selection',
    '/coupling-selection': 'coupling-selection',
    '/coupling-system': 'coupling-system',
    '/cummins': 'cummins',
    '/inquiry': 'inquiry',
    '/quotation': 'quotation',
    '/technical': 'agreement',
    '/agreement': 'agreement',
    '/contract': 'contract',
    '/drawings': 'drawings',
    '/manuals': 'manuals',
    '/templates': 'templates',
    '/engine-cases': 'engine-cases',
    '/torsional': 'torsional',
    '/energy': 'energy',
    '/statistics': 'statistics',
    '/analytics': 'analytics',
    '/competitor': 'competitor',
    '/query': 'query',
    '/product-center': 'product-center',
    '/history': 'history',
    '/hcm-selection': 'hcm-selection',
    '/cpp': 'cpp',
    '/azimuth': 'azimuth',
    '/thruster': 'thruster',
    '/shaft': 'shaft',
    '/inventory': 'inventory',
    '/receivables': 'receivables',
  }), []);

  const tabToPath = useMemo(() => {
    const map = {};
    Object.entries(pathToTab).forEach(([path, tab]) => {
      if (!map[tab]) map[tab] = path; // first mapping wins
    });
    return map;
  }, [pathToTab]);

  // Keep ref in sync so setActiveTab callback can access without dependency
  useEffect(() => {
    tabToPathRef.current = tabToPath;
  }, [tabToPath]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '') || '/';
      const tab = pathToTab[hash];
      if (tab) {
        setActiveTabRaw(tab);
      }
    };

    // Initial sync on mount
    handleHashChange();

    // Listen for hash changes (browser back/forward)
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [pathToTab]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      logger.log(`Redirecting to login from ${location.pathname}`);
      navigate('/login', { state: { from: location.pathname }, replace: true });
    } else if (isAuthenticated && location.pathname === '/login') {
      const redirectPath = location.state?.from || '/';
       logger.log(`Authenticated, redirecting from login to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  const isAdmin = user && (user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN);
  const inIframe = useInIframe();

  const workConditionOptions = useMemo(() => [
    'I类:扭矩变化很小',
    'II类:扭矩变化小',
    'III类:扭矩变化中等',
    'IV类:扭矩变化大',
    'V类:扭矩变化很大'
  ], []);

  const applicationOptions = useMemo(() => [
    { value: 'propulsion', label: '主推进' },
    { value: 'auxiliary', label: '辅助推进' },
    { value: 'winch', label: '绞车' },
    { value: 'other', label: '其他' }
  ], []);

  const updateAppDataAndPersist = useCallback((newData) => {
    let dataToUpdate;
    if (typeof newData === 'function') {
      dataToUpdate = newData(appDataState);
    } else {
      dataToUpdate = newData;
    }

    try {
        const collectionsToTrack = [
            'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
            'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'
        ];
        let allChanges = [];

        collectionsToTrack.forEach(type => {
            const oldCollection = Array.isArray(appDataState?.[type]) ? appDataState[type] : [];
            const newCollection = Array.isArray(dataToUpdate?.[type]) ? dataToUpdate[type] : [];
             const oldCleaned = oldCollection.filter(item => item && item.model);
             const newCleaned = newCollection.filter(item => item && item.model);

            const changes = compareAndTrackChanges(oldCleaned, newCleaned);
            allChanges = [...allChanges, ...changes];
        });

        if (allChanges.length > 0) {
            savePriceHistory(allChanges, '数据更新（通过UI修改或导入）');
            logger.log(`已记录${allChanges.length}项价格变更到历史记录 (updateAppDataAndPersist)`);
        }
    } catch (e) {
        logger.warn('记录价格历史变更失败 (in updateAppDataAndPersist):', e);
    }

    setAppDataState(dataToUpdate);

    if (setAppData && typeof setAppData === 'function') {
        setAppData(dataToUpdate);
    } else {
       logger.warn("App Component: setAppData prop is not a function. Data changes won't be persisted to parent.");
    }

    return dataToUpdate;
  }, [appDataState, setAppData]);

  const colors = useMemo(() => {
    const light = {
      bg: '#f0f7f0', card: '#ffffff', text: '#263238', border: '#d0e0d0',
      headerBg: '#e0f0e0', headerText: '#1b5e20', inputBg: '#ffffff',
      inputBorder: '#b0d0b0', muted: '#546e7a', primary: '#2e7d32',
      primaryText: '#ffffff', focusRing: 'rgba(46, 125, 50, 0.3)'
    };
    const dark = {
      bg: '#1a202c', card: '#2d3748', text: '#e2e8f0', border: '#4a5568',
      headerBg: '#2d3748', headerText: '#a0aec0', inputBg: '#2d3748',
      inputBorder: '#4a5568', muted: '#718096', primary: '#38b2ac',
      primaryText: '#1a202c', focusRing: 'rgba(56, 178, 172, 0.5)'
    };
    return theme === 'light' ? light : dark;
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--app-${key}`, value);
    });
  }, [colors]);

  useEffect(() => {
      logger.log("App Component received new initialAppData prop. Updating internal state.");
      setAppDataState(initialAppData);
  }, [initialAppData]);

  // Combined gearbox database for comparison tool (with power range enhancement)
  const allGearboxes = useMemo(() => {
    if (!appDataState) return [];
    const gearboxArrays = Object.keys(appDataState)
      .filter(key => key.endsWith('Gearboxes'))
      .map(key => appDataState[key])
      .filter(Array.isArray);
    const rawData = gearboxArrays.flat();
    // 增强数据: 添加 minPower/maxPower (根据传递能力推算)
    return enhanceGearboxData(rawData);
  }, [appDataState]);

  /* handleEngineDataChange, handleRequirementDataChange, handleProjectInfoChange, handleGearboxTypeChange 已移至 useFormHandlers hook */

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  // 使用价格处理函数 Hook
  const {
    calculateAllPrices,
    handleBatchPriceAdjustment
  } = usePriceHandlers({
    appDataState,
    priceData,
    updateAppDataAndPersist,
    setSelectedComponents,
    setPriceData,
    setPackagePrice,
    setMarketPrice,
    setTotalMarketPrice,
    setQuotation,
    setAgreement,
    setContract,
    setLoading,
    setError,
    setSuccess,
    setShowBatchPriceAdjustment
  });

  /* calculateAllPrices 已移至 usePriceHandlers hook */

  useEffect(() => {
    if (selectionResult && selectionResult.success && Array.isArray(selectionResult.recommendations) && selectionResult.recommendations.length > 0) {
      // 检查推荐列表是否真正发生了变化（通过比较型号列表）
      // 这可以避免在 selectionResult 仅更新 priceData 时错误地重置用户的手动选择
      const currentModels = selectionResult.recommendations.map(r => r.model).join(',');
      const prevModels = prevRecommendationsRef.current;

      // 只有在推荐列表确实发生变化时才重置选择
      if (currentModels !== prevModels) {
        logger.log("New selection result received, updating components...");
        prevRecommendationsRef.current = currentModels; // 更新ref

        setSelectedGearboxIndex(0);
        const firstGearbox = { ...selectionResult.recommendations[0] };
        const firstCouplingResult = selectionResult.flexibleCoupling;
        const firstPumpResult = selectionResult.standbyPump;

        // 确保价格数据正确，同时检查特殊打包价格
        const currentGearbox = correctPriceData(firstGearbox);

        // 检查是否有特殊打包价格配置
        const gwConfig = getGWPackagePriceConfig(currentGearbox.model);
        if (gwConfig && !gwConfig.isSmallGWModel) {
          // 标记为特殊打包价格型号
          currentGearbox.hasSpecialPackagePrice = true;
          currentGearbox.gwPackageConfig = gwConfig;
          currentGearbox.packagePrice = gwConfig.packagePrice;
          // 对于特殊打包价格，市场价等于打包价
          currentGearbox.marketPrice = gwConfig.packagePrice;

          logger.log(`应用GW系列特殊打包价格: ${currentGearbox.model}, 价格: ${gwConfig.packagePrice}`);
        }

        const currentCoupling = firstCouplingResult?.success ? correctPriceData({ ...firstCouplingResult }) : null;

        const currentPump = firstPumpResult?.success ? correctPriceData({ ...firstPumpResult }) : null;

        setSelectedComponents({
          gearbox: currentGearbox,
          coupling: currentCoupling,
          pump: currentPump
        });

        // 使用统一的价格计算函数
        const newPriceData = calculateAllPrices(
          currentGearbox,
          currentCoupling,
          currentPump,
          { includePump: true } // 默认包含备用泵
        );

        // 更新统一的价格状态
        setPriceData(newPriceData);

        // 保持对原有状态的更新，以便兼容性
        setPackagePrice(newPriceData.packagePrice);
        setMarketPrice(newPriceData.marketPrice);
        setTotalMarketPrice(newPriceData.totalMarketPrice);

        logger.log("Selected Components Updated:", {
          gearbox: currentGearbox?.model,
          coupling: currentCoupling?.model,
          pump: currentPump?.model,
          hasSpecialPackagePrice: currentGearbox.hasSpecialPackagePrice || false
        });
        logger.log("Prices Updated:", {
          packagePrice: newPriceData.packagePrice,
          marketPrice: newPriceData.marketPrice,
          totalMarketPrice: newPriceData.totalMarketPrice
        });
      } else {
        logger.log("Selection result updated but recommendations unchanged, preserving user selection.");
      }
    } else if (selectionResult && !selectionResult.success) {
      logger.log("Selection failed, clearing components and prices.");
      prevRecommendationsRef.current = null; // 清除ref
      setSelectedGearboxIndex(0);
      setSelectedComponents({ gearbox: null, coupling: null, pump: null });
      setPriceData({
        packagePrice: 0,
        marketPrice: 0,
        totalMarketPrice: 0,
        gearbox: null,
        coupling: null,
        pump: null,
        hasSpecialPackagePrice: false,
        specialPackageConfig: null,
        needsPump: false,
        includePump: true
      });
      setPackagePrice(0);
      setMarketPrice(0);
      setTotalMarketPrice(0);
    }
  }, [selectionResult, calculateAllPrices]);

  useEffect(() => {
    const storedHistory = localStorage.getItem('selectionHistory');
    if (storedHistory) {
      try {
        const parsedHistory = JSON.parse(storedHistory);
        if (Array.isArray(parsedHistory)) {
             setSelectionHistory(parsedHistory);
             logger.log(`Loaded ${parsedHistory.length} history entries from localStorage.`);
        } else {
            logger.warn("Stored history is not an array, ignoring.");
             localStorage.removeItem('selectionHistory');
        }
      } catch (e) {
        logger.error("无法解析存储的历史记录:", e);
        localStorage.removeItem('selectionHistory');
      }
    }
  }, []);

  /* handlePriceChange, handleBatchPriceAdjustment 已移至 usePriceHandlers hook */

  // 使用选型处理函数 Hook
  const {
    handleGearboxSelection,
    handleCouplingSelection,
    handleSelectGearbox
  } = useSelectionHandlers({
    selectionResult,
    appDataState,
    engineData,
    requirementData,
    gearboxType,
    hybridConfig,
    selectedComponents,
    priceData,
    projectInfo,
    isFormValid,
    getEffectiveConfig,
    calculateAllPrices,
    setSelectionResult,
    setSelectedGearboxIndex,
    setSelectedComponents,
    setSelectionHistory,
    setSelectionDiagnostics,
    setPriceData,
    setPackagePrice,
    setMarketPrice,
    setTotalMarketPrice,
    setQuotation,
    setAgreement,
    setContract,
    setLoading,
    setError,
    setSuccess,
    setActiveTab
  });

  /* selection handlers (handleGearboxSelection, handleCouplingSelection, handleSelectGearbox) 已移至 useSelectionHandlers hook */

  // 使用报价单处理函数 Hook
  const {
    handleGenerateQuotation,
    generateQuotationWithOptions,
    handleAddCustomQuotationItem,
    handleRemoveQuotationItem,
    handleSaveQuotation,
    handleLoadSavedQuotation,
    handleCompareQuotations,
    handleUpdateQuotationPrices,
    handleExportQuotation
  } = useQuotationHandlers({
    selectedComponents,
    selectionResult,
    projectInfo,
    quotation,
    setQuotation,
    setProjectInfo,
    setPriceData,
    setLoading,
    setError,
    setSuccess,
    setActiveTab,
    setShowQuotationOptions,
    setComparisonResult,
    setShowComparisonModal,
    calculateAllPrices
  });

  // 使用导出处理函数 Hook
  const {
    handleGenerateAgreement,
    handleGenerateContract,
    handleExportContract
  } = useExportHandlers({
    selectedComponents,
    selectionResult,
    projectInfo,
    quotation,
    agreement,
    contract,
    priceData,
    agreementSpecialRequirements,
    setSelectionResult,
    setContract,
    setLoading,
    setError,
    setSuccess,
    setActiveTab
  });

  /* quotation/export handlers 已移至 useQuotationHandlers 和 useExportHandlers hooks */

  // 使用历史记录处理函数 Hook
  const {
    handleLoadFromHistoryManager
  } = useHistoryHandlers({
    selectionHistory,
    setSelectionHistory,
    setProjectInfo,
    setEngineData,
    setRequirementData,
    setGearboxType,
    setSelectionResult,
    setSelectedComponents,
    setQuotation,
    setAgreement,
    setContract,
    setLoading,
    setError,
    setSuccess,
    setActiveTab
  });

  /* history handlers 已移至 useHistoryHandlers hook */

  /* handleSelectGearbox 已移至 useSelectionHandlers hook */

  const inputStyles = useMemo(() => ({
    backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder,
    '::placeholder': { color: colors.muted },
  }), [colors]);

  const focusStyles = useMemo(() => ({
    '&:focus': { borderColor: colors.primary, boxShadow: `0 0 0 0.2rem ${colors.focusRing}` }
  }), [colors]);

  const selectionContextValue = useMemo(() => ({
    selectedGearbox: selectedComponents.gearbox,
    engineData,
    requirementData,
    selectionResult,
    couplingResult: selectedComponents.coupling,
    pumpResult: selectedComponents.pump,
  }), [selectedComponents, engineData, requirementData, selectionResult]);

  if (location.pathname === '/users' || location.pathname === '/database' || location.pathname === '/login') {
    return null;
  }

  return (
    <SelectionResultProvider value={selectionContextValue}>
    <div className="App">
      {!inIframe && <PriceWarningBanner />}
      {!inIframe && (
        <ModernNavBar
          activeTab={activeTab}
          onNavigate={setActiveTab}
          isMobile={isMobile}
          onMenuToggle={() => setMobileSidebarOpen(true)}
        />
      )}
      <Container fluid className="app-container">
        {!inIframe && (
          <AppHeader
            user={user}
            isAdmin={isAdmin}
            logout={logout}
            theme={theme}
            toggleTheme={toggleTheme}
            colors={colors}
            loading={loading}
            error={error}
            success={success}
            setError={setError}
            setSuccess={setSuccess}
            setShowDiagnosticPanel={setShowDiagnosticPanel}
            appDataState={appDataState}
          />
        )}

      {appDataState && Object.keys(appDataState).length > 0 && (
      <div style={{ display: 'flex', gap: 0 }}>
      {!inIframe && !isMobile && (
        <SidebarNav
          activeTab={activeTab}
          onNavigate={setActiveTab}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((c) => !c)}
        />
      )}
      {!inIframe && isMobile && (
        <Offcanvas
          show={mobileSidebarOpen}
          onHide={() => setMobileSidebarOpen(false)}
          placement="start"
          style={{ width: 260 }}
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title>导航菜单</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body style={{ padding: 0 }}>
            <SidebarNav
              activeTab={activeTab}
              onNavigate={setActiveTab}
              collapsed={false}
              onToggle={() => {}}
              onItemClick={() => setMobileSidebarOpen(false)}
            />
          </Offcanvas.Body>
        </Offcanvas>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4 d-none"
        style={{ borderBottomColor: colors.border }}
      >
          <Tab eventKey="home" title={<span><i className="bi bi-house-door me-1"></i>首页</span>}>
            <Suspense fallback={<LazyLoadFallback />}>
              <HomeView
                appData={appDataState}
                colors={colors}
                theme={theme}
                onNavigate={setActiveTab}
                selectionHistory={selectionHistory}
              />
            </Suspense>
          </Tab>

          <Tab eventKey="input" title={<span><i className="bi bi-input-cursor-text me-1"></i>输入参数</span>}>
            <InputParametersTab
              engineData={engineData}
              requirementData={requirementData}
              projectInfo={projectInfo}
              gearboxType={gearboxType}
              hybridConfig={hybridConfig}
              loading={loading}
              appDataState={appDataState}
              handleEngineDataChange={handleEngineDataChange}
              handleRequirementDataChange={handleRequirementDataChange}
              handleProjectInfoChange={handleProjectInfoChange}
              handleGearboxTypeChange={handleGearboxTypeChange}
              setHybridConfig={setHybridConfig}
              handleSelectGearbox={handleSelectGearbox}
              isFormValid={isFormValid}
              getFieldValidationState={getFieldValidationState}
              getValidationClassName={getValidationClassName}
              workConditionOptions={workConditionOptions}
              applicationOptions={applicationOptions}
              colors={colors}
              theme={theme}
              inputStyles={inputStyles}
              focusStyles={focusStyles}
            />
          </Tab>

          <Tab eventKey="result" title={<span><i className="bi bi-graph-up me-1"></i>选型结果</span>} disabled={!selectionResult}>
            <SelectionResultTab
              selectionResult={selectionResult}
              selectedGearboxIndex={selectedGearboxIndex}
              requirementData={requirementData}
              allGearboxes={allGearboxes}
              onGearboxSelection={handleGearboxSelection}
              onCouplingSelection={handleCouplingSelection}
              onGenerateQuotation={handleGenerateQuotation}
              onGenerateAgreement={handleGenerateAgreement}
              onSelectGearbox={() => handleSelectGearbox()}
              colors={colors}
              theme={theme}
            />
          </Tab>

          <Tab eventKey="inquiry" title={<span><i className="bi bi-file-earmark-plus me-1"></i>技术询单</span>}>
            <Suspense fallback={<LazyLoadFallback />}>
              <EnhancedSelectionForm theme={theme} colors={colors} />
            </Suspense>
          </Tab>

          <Tab eventKey="quotation" title={<span><i className="bi bi-currency-yen me-1"></i>报价单</span>}>
              {quotation ? (
                  <Row>
                      <Col>
                        {/* 增强选项区域 */}
                        <QuotationEnhancedOptions
                          quotation={quotation}
                          onAddCustomItem={() => setShowCustomItemModal(true)}
                          onSave={handleSaveQuotation}
                          onViewHistory={() => setShowQuotationHistoryModal(true)}
                          onUpdatePrices={handleUpdateQuotationPrices}
                          colors={colors}
                        />

                        <Suspense fallback={<LazyLoadFallback />}>
                          <QuotationView
                            quotation={quotation}
                            onExport={handleExportQuotation}
                            onGenerateAgreement={handleGenerateAgreement}
                            onAddCustomItem={() => setShowCustomItemModal(true)}
                            onRemoveItem={handleRemoveQuotationItem}
                            onUpdatePrices={handleUpdateQuotationPrices}
                            onSave={handleSaveQuotation}
                            colors={colors}
                            theme={theme}
                          />
                        </Suspense>
                      </Col>
                  </Row>
              ) : (
                <div className="d-flex justify-content-center align-items-center py-5">
                  <Card style={{ maxWidth: 520, backgroundColor: colors.card, borderColor: colors.border }}>
                    <Card.Body className="py-4 text-center">
                      <i className="bi bi-currency-yen" style={{ fontSize: '3rem', color: colors.primary || '#2e7d32' }}></i>
                      <h4 className="mt-3" style={{ color: colors.text }}>报价单</h4>
                      <p style={{ color: colors.muted }}>
                        您可以通过选型结果自动生成报价单，也可以从历史记录中加载已保存的报价单。
                      </p>
                      <div className="d-flex gap-2 justify-content-center flex-wrap mt-3">
                        <Button variant="primary" onClick={() => setActiveTab('input')}>
                          <i className="bi bi-gear me-1"></i>从选型生成
                        </Button>
                        <Button variant="outline-primary" onClick={() => setShowQuotationHistoryModal(true)}>
                          <i className="bi bi-clock-history me-1"></i>历史报价单
                        </Button>
                        <Button variant="outline-secondary" onClick={() => setActiveTab('product-center')}>
                          <i className="bi bi-box-seam me-1"></i>浏览产品库
                        </Button>
                      </div>
                      <hr className="my-3" />
                      <h6 style={{ color: colors.text }}>报价单包含的主要内容：</h6>
                      <Row className="text-start mt-2" style={{ color: colors.muted, fontSize: '0.9rem' }}>
                        <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>齿轮箱型号及价格</Col>
                        <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>配套联轴器</Col>
                        <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>备用泵及附件</Col>
                        <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>打包优惠价格</Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              )}
        </Tab>

          <Tab eventKey="agreement" title={<span><i className="bi bi-file-earmark-text me-1"></i>技术协议</span>}>
            {selectionResult ? (
              <Row>
                <Col>
                  <Suspense fallback={<LazyLoadFallback />}>
                    <TechnicalAgreementView
                      selectionResult={selectionResult}
                      projectInfo={projectInfo}
                      requirementData={requirementData}
                      selectedComponents={selectedComponents}
                      colors={colors}
                      theme={theme}
                      onNavigateToQuotation={() => setActiveTab('quotation')}
                      onNavigateToContract={() => handleGenerateContract()}
                      onSpecialRequirementsChange={setAgreementSpecialRequirements}
                    />
                  </Suspense>
                </Col>
              </Row>
            ) : (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Card style={{ maxWidth: 560, backgroundColor: colors.card, borderColor: colors.border }}>
                  <Card.Body className="py-4 text-center">
                    <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem', color: colors.primary || '#2e7d32' }}></i>
                    <h4 className="mt-3" style={{ color: colors.text }}>技术协议生成</h4>
                    <p style={{ color: colors.muted, maxWidth: 400, margin: '0 auto' }}>
                      技术协议是齿轮箱订货前的重要技术文件，包含产品规格、性能参数、验收标准等关键信息。
                    </p>
                    <Alert variant="info" className="mt-3 text-start" style={{ maxWidth: 420, margin: '0 auto' }}>
                      <i className="bi bi-info-circle me-2"></i>
                      生成技术协议前，请先完成齿轮箱选型以确定产品型号和配置参数。
                    </Alert>
                    <div className="d-flex gap-2 justify-content-center mt-3 flex-wrap">
                      <Button variant="primary" onClick={() => setActiveTab('input')}>
                        <i className="bi bi-gear me-1"></i>去选型
                      </Button>
                      <Button variant="outline-primary" onClick={() => setActiveTab('templates')}>
                        <i className="bi bi-file-earmark-text me-1"></i>浏览模板库
                      </Button>
                    </div>
                    <hr className="my-3" />
                    <h6 style={{ color: colors.text }}>技术协议包含的主要内容：</h6>
                    <Row className="text-start mt-2" style={{ color: colors.muted, fontSize: '0.9rem' }}>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>产品型号及规格</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>性能参数及曲线</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>外形尺寸图</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>配套联轴器信息</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>船检要求及证书</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>质量保证条款</Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Tab>

          <Tab eventKey="contract" title={<span><i className="bi bi-file-earmark-ruled me-1"></i>销售合同</span>}>
            {contract ? (
              <Row>
                <Col>
                     <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                    <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span><i className="bi bi-file-earmark-ruled me-2"></i>销售合同</span>
                        <div>
                          <Button variant="outline-primary" size="sm" className="me-2" onClick={() => handleExportContract('word')}>
                            <i className="bi bi-file-earmark-word me-1"></i> 导出Word
                          </Button>
                          <Button variant="outline-danger" size="sm" onClick={() => handleExportContract('pdf')}>
                            <i className="bi bi-file-earmark-pdf me-1"></i> 导出PDF
                          </Button>
                        </div>
                      </div>
                        </Card.Header>
                    <Card.Body style={{ padding: 0 }}>
                      <Suspense fallback={<LazyLoadFallback />}>
                        <ContractView
                          contract={contract}
                          onExportWord={() => handleExportContract('word')}
                          onExportPDF={() => handleExportContract('pdf')}
                          theme={theme}
                          colors={colors}
                        />
                      </Suspense>
                      </Card.Body>
                      </Card>
                  </Col>
                </Row>
            ) : (
              <div className="d-flex justify-content-center align-items-center py-5">
                <Card style={{ maxWidth: 560, backgroundColor: colors.card, borderColor: colors.border }}>
                  <Card.Body className="py-4 text-center">
                    <i className="bi bi-file-earmark-ruled" style={{ fontSize: '3rem', color: colors.primary || '#2e7d32' }}></i>
                    <h4 className="mt-3" style={{ color: colors.text }}>销售合同生成</h4>
                    <p style={{ color: colors.muted, maxWidth: 420, margin: '0 auto' }}>
                      销售合同基于报价单和技术协议自动生成，包含产品明细、价格条款、交货条件、质量保证等完整合同内容。
                    </p>
                    <Alert variant="info" className="mt-3 text-start" style={{ maxWidth: 420, margin: '0 auto' }}>
                      <i className="bi bi-info-circle me-2"></i>
                      生成销售合同前，请先完成以下步骤：
                      <ol className="mb-0 mt-1 ps-3" style={{ fontSize: '0.85rem' }}>
                        <li>完成齿轮箱选型</li>
                        <li>生成报价单（确定价格）</li>
                        <li>在技术协议页面点击"生成合同"</li>
                      </ol>
                    </Alert>
                    <div className="d-flex gap-2 justify-content-center mt-3 flex-wrap">
                      {!selectionResult ? (
                        <Button variant="primary" onClick={() => setActiveTab('input')}>
                          <i className="bi bi-gear me-1"></i>去选型
                        </Button>
                      ) : !quotation ? (
                        <Button variant="primary" onClick={() => setActiveTab('quotation')}>
                          <i className="bi bi-currency-yen me-1"></i>生成报价单
                        </Button>
                      ) : (
                        <Button variant="primary" onClick={() => handleGenerateContract()}>
                          <i className="bi bi-file-earmark-ruled me-1"></i>生成销售合同
                        </Button>
                      )}
                    </div>
                    <hr className="my-3" />
                    <h6 style={{ color: colors.text }}>销售合同包含的主要内容：</h6>
                    <Row className="text-start mt-2" style={{ color: colors.muted, fontSize: '0.9rem' }}>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>合同编号与日期</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>甲乙方信息</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>产品明细与价格</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>交货与运输条款</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>质量验收标准</Col>
                      <Col xs={6} className="mb-1"><i className="bi bi-check-circle text-success me-1"></i>违约与争议条款</Col>
                    </Row>
                  </Card.Body>
                </Card>
              </div>
            )}
          </Tab>

          <Tab eventKey="query" title={<span><i className="bi bi-search me-1"></i>数据查询</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <DataQuery
                    appData={appDataState}
                    theme={theme}
                    colors={colors}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="product-center" title={<span><i className="bi bi-box-seam me-1"></i>产品中心</span>}>
            <Suspense fallback={<LazyLoadFallback />}>
              <ProductCenter
                gearboxData={appDataState}
                colors={colors}
                theme={theme}
                onNavigateToQuotation={(products) => {
                  // 可以扩展：将选中产品传递到报价页面
                  setActiveTab('quotation');
                }}
              />
            </Suspense>
          </Tab>

          <Tab eventKey="history" title={<span><i className="bi bi-clock-history me-1"></i>选型历史</span>}>
            <HistoryTabContent
              isVisible={activeTab === 'history'}
              onLoadHistory={handleLoadFromHistoryManager}
              colors={colors}
            />
          </Tab>

          <Tab eventKey="batch" title={<span><i className="bi bi-list-task me-1"></i>批量选型</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <BatchSelectionView
                    colors={colors}
                    theme={theme}
                    onSelectionComplete={(results) => {
                      logger.log('批量选型完成:', results);
                      // 刷新历史记录
                      try {
                        const storedHistory = localStorage.getItem('selectionHistory');
                        if (storedHistory) {
                          const parsedHistory = JSON.parse(storedHistory);
                          if (Array.isArray(parsedHistory)) {
                            setSelectionHistory(parsedHistory);
                          }
                        }
                      } catch (e) {
                        logger.error('刷新历史记录失败:', e);
                      }
                    }}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="coupling-system" title={<span><i className="bi bi-gear-wide-connected me-1"></i>联轴器配套</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <HCCouplingVisualization />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="coupling-selection" title={<span><i className="bi bi-link-45deg me-1"></i>高弹选型</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <CouplingSelectionPage
                    embedded={true}
                    colors={colors}
                    onCouplingSelected={(coupling) => {
                      setSelectedComponents(prev => ({...prev, coupling}));
                    }}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="pump-selection" title={<span><i className="bi bi-droplet me-1"></i>备用泵选型</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <PumpSelectionView
                    appData={appDataState}
                    selectedGearbox={selectedComponents.gearbox}
                    onSelectPump={(pump) => setSelectedComponents(prev => ({...prev, pump}))}
                    theme={theme}
                    colors={colors}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="cummins" title={<span><i className="bi bi-gear-wide-connected me-1"></i>康明斯配套</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <CumminsMatchingView theme={theme} colors={colors} />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="drawings" title={<span><i className="bi bi-image me-1"></i>外形图库</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <OutlineDrawingQuery
                    theme={theme}
                    colors={colors}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="manuals" title={<span><i className="bi bi-book me-1"></i>说明书库</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <ManualLibrary
                    theme={theme}
                    colors={colors}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="templates" title={<span><i className="bi bi-file-earmark-text me-1"></i>协议模板库</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <TemplateLibrary
                    theme={theme}
                    colors={colors}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="statistics" title={<span><i className="bi bi-bar-chart me-1"></i>数据统计</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <StatisticsDashboard />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="analytics" title={<span><i className="bi bi-graph-up-arrow me-1"></i>使用分析</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <AnalyticsDashboard />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="doc-dashboard" title={<span><i className="bi bi-archive me-1"></i>文档管理</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <DocumentDashboard
                    colors={colors}
                    theme={theme}
                    onNavigate={(tab) => setActiveTab(tab)}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="torsional" title={<span><i className="bi bi-activity me-1"></i>扭振分析</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <TorsionalAnalysis
                    colors={colors}
                    theme={theme}
                    selectionResult={selectionResult}
                    engineData={engineData}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="energy" title={<span><i className="bi bi-lightning-charge me-1"></i>能效分析</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <EnergyDashboard
                    gearbox={selectionResult?.recommendations?.[0] || selectionResult?.results?.[0] || null}
                    engineData={engineData}
                    shipData={{}}
                    hybridConfig={hybridConfig}
                    colors={colors}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          {/* 新增推进系统模块 */}
          <Tab eventKey="cpp" title={<span><i className="bi bi-arrow-repeat me-1"></i>可调桨</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <CPPSelectionView
                    colors={colors}
                    theme={theme}
                    engineData={engineData}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="azimuth" title={<span><i className="bi bi-compass me-1"></i>全回转</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <AzimuthThrusterSelector
                    colors={colors}
                    theme={theme}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="thruster" title={<span><i className="bi bi-arrows-expand me-1"></i>侧推器</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <ThrusterSelector
                    colors={colors}
                    theme={theme}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="shaft" title={<span><i className="bi bi-gear-wide-connected me-1"></i>轴系</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <ShaftSystemSelector
                    colors={colors}
                    theme={theme}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="competitor" title={<span><i className="bi bi-bar-chart-fill me-1"></i>竞品对比</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <CompetitorComparisonView
                    colors={colors}
                    hangchiData={allGearboxes}
                    selectionResult={selectionResult}
                    engineData={engineData}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="hcm-selection" title={<span><i className="bi bi-speedometer2 me-1"></i>HCM高速</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <HCMSelectionModule />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="engine-cases" title={<span><i className="bi bi-journal-text me-1"></i>配机案例</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <EngineMatchingCases />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          {/* 上海公司审计整改模块 */}
          <Tab eventKey="inventory" title={<span><i className="bi bi-box-seam me-1"></i>库存管理</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <InventoryManagement
                    colors={colors}
                    theme={theme}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="receivables" title={<span><i className="bi bi-cash-stack me-1"></i>应收账款</span>}>
            <Row>
              <Col>
                <Suspense fallback={<LazyLoadFallback />}>
                  <ReceivablesManagement
                    colors={colors}
                    theme={theme}
                  />
                </Suspense>
              </Col>
            </Row>
          </Tab>
        </Tabs>
      </div>
      </div>
      )}

      {/* 批量价格调整对话框 */}
      <BatchPriceAdjustment
        show={showBatchPriceAdjustment}
        onHide={() => setShowBatchPriceAdjustment(false)}
        onApply={handleBatchPriceAdjustment}
        theme={theme}
        colors={colors}
      />

      {/* 系统诊断面板 */}
      {showDiagnosticPanel && (
        <Suspense fallback={<LazyLoadFallback />}>
          <DiagnosticPanel
            appData={appDataState}
            onReset={forceReset}
            onHide={() => setShowDiagnosticPanel(false)}
            validateDatabase={validateDatabase}
            correctDatabase={correctDatabase}
            getPriceHistory={getPriceHistory}
            clearPriceHistory={clearPriceHistory}
            updateAppData={updateAppDataAndPersist}
            colors={colors}
            theme={theme}
          />
        </Suspense>
      )}

      {/* 报价选项对话框 */}
      {showQuotationOptions && (
        <Suspense fallback={<div />}>
          <QuotationOptionsModal
            show={showQuotationOptions}
            onHide={() => setShowQuotationOptions(false)}
            onApply={generateQuotationWithOptions}
            selectedComponents={selectedComponents}
            // 传递特殊打包价格相关信息
            hasSpecialPackagePrice={selectedComponents.gearbox?.hasSpecialPackagePrice}
            specialPackageConfig={selectedComponents.gearbox?.gwPackageConfig}
            // 传递备用泵需求信息 - 新增
            needsPump={selectedComponents.gearbox && needsStandbyPump(
              selectedComponents.gearbox.model,
              { power: selectedComponents.gearbox.power }
            )}
            colors={colors}
            theme={theme}
          />
        </Suspense>
      )}

      {/* 自定义报价项目对话框 */}
      {showCustomItemModal && (
        <Suspense fallback={<div />}>
          <CustomQuotationItemModal
            show={showCustomItemModal}
            onHide={() => setShowCustomItemModal(false)}
            onAdd={handleAddCustomQuotationItem}
            existingItems={quotation?.items || []}
            colors={colors}
            theme={theme}
		   />
        </Suspense>
      )}

      {/* 保存的报价单历史对话框 */}
      {showQuotationHistoryModal && (
        <Suspense fallback={<div />}>
          <QuotationHistoryModal
            show={showQuotationHistoryModal}
            onHide={() => setShowQuotationHistoryModal(false)}
            onLoad={handleLoadSavedQuotation}
            onCompare={handleCompareQuotations}
            colors={colors}
            theme={theme}
          />
        </Suspense>
      )}

      {/* 报价单比较对话框 */}
      {showComparisonModal && comparisonResult && (
        <ComparisonResultModal
          show={showComparisonModal}
          onHide={() => setShowComparisonModal(false)}
          comparisonResult={comparisonResult}
          colors={colors}
          theme={theme}
        />
      )}

      {/* 用户反馈浮动按钮 */}
      <FeedbackWidget position="bottom-right" />
      <ToastContainer />
      </Container>
    </div>
    </SelectionResultProvider>
  );
}

export default App;