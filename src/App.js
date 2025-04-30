// src/App.js - Main Application Component (Modified with Enhanced Features)
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Tab, Tabs, Alert, Spinner, Modal, Badge, ListGroup } from 'react-bootstrap';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { userRoles, permissions } from './auth/roles';
import './styles/global.css';
// 导入增强版备用泵选型功能
import { enhancedSelectPump, needsStandbyPump } from './utils/enhancedPumpSelection';

// 导入新的模态组件
import QuotationOptionsModal from './components/QuotationOptionsModal';
import CustomQuotationItemModal from './components/CustomQuotationItemModal';
import QuotationHistoryModal from './components/QuotationHistoryModal';

// 导入数据修复工具
import { correctDatabase } from './utils/dataCorrector';

// 导入选型结果组件
import EnhancedGearboxSelectionResult from './components/EnhancedGearboxSelectionResult';
import CouplingSelectionResultComponent from './components/CouplingSelectionResultComponent';

// 价格模块相关工具
import {
  validatePriceData,
  correctPriceData,
  calculateFactoryPrice,
  calculateMarketPrice,
  calculatePackagePrice,
  processPriceData,
  fixSpecificModelPrices,
  getStandardDiscountRate
} from './utils/priceManager';

import { validateDatabase, validateGearbox, validateCoupling, validatePump } from './utils/dataValidator';
import { savePriceHistory, compareAndTrackChanges, getPriceHistory, clearPriceHistory } from './utils/priceHistoryTracker';
import { parseTextPriceTable, calculateDiscountRates } from './utils/officialPriceParser';
import PriceCalculator from './components/PriceCalculator';
import BatchPriceAdjustment from './components/BatchPriceAdjustment';

// Custom Components
import LoginPage from './components/LoginPage';
import UserManagementView from './components/UserManagementView';
import DatabaseManagementView from './components/DatabaseManagementView';
import QuotationView from './components/QuotationView';
import AgreementView from './components/AgreementView';
import ContractView from './components/ContractView';
import GearboxComparisonView from './components/GearboxComparisonView';
import DataQuery from './components/DataQuery';
import DiagnosticPanel from './components/DiagnosticPanel';
import TechnicalAgreementView from './components/TechnicalAgreementView';

// Utils and API functions
import { selectGearbox, autoSelectGearbox } from './utils/selectionAlgorithm';
import { selectFlexibleCoupling } from './utils/couplingSelection';
import enhancedCouplingSelection from './utils/enhancedCouplingSelection'; // 导入增强联轴器选型函数
import { 
  generateQuotation, 
  exportQuotationToExcel, 
  exportQuotationToPDF,
  addCustomItemToQuotation,
  removeItemFromQuotation,
  createQuotationPreview
} from './utils/quotationGenerator';
import { generateAgreement, exportAgreementToWord, exportAgreementToPDFFormat } from './utils/agreementGenerator';
import { generateContract, exportContractToWord, exportContractToPDF } from './utils/contractGenerator';
import { getCouplingSpecifications } from './data/gearboxMatchingMaps';
import { 
  optimizedHtmlToPdf, 
  exportHtmlContentToPDF 
} from './utils/pdfExportUtils';
import { numberToChinese } from './utils/quotationGenerator'; // <-- Import numberToChinese

// 导入报价单管理工具
import { 
  saveQuotation, 
  getSavedQuotations, 
  loadSavedQuotation, 
  deleteSavedQuotation, 
  compareQuotations,
  exportComparisonToExcel
} from './utils/quotationManager';

// 导入价格修复工具
import fixHCMSeriesPrices from './utils/priceFixers';

// 导入GW系列特殊打包价格配置
import { getGWPackagePriceConfig, checkPackageMatch } from './data/packagePriceConfig';

// 数据持久化键名 (Still relevant for history/user settings)
const STORAGE_KEY = 'gearbox_app_data';

// 报价单比较结果对话框组件
const ComparisonResultModal = ({
  show,
  onHide,
  comparisonResult,
  colors,
  theme
}) => {
  if (!comparisonResult) return null;
  
  // 格式化价格显示
  const formatPrice = (price) => {
    if (typeof price !== 'number') return '-';
    return price.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };
  
  // 格式化百分比显示
  const formatPercent = (value) => {
    if (typeof value !== 'number') return '-';
    return value.toFixed(2) + '%';
  };
  
  // 获取差异项的图标和样式
  const getDifferenceStyle = (type, percentChange) => {
    if (type === 'itemRemoved') {
      return {
        icon: <i className="bi bi-dash-circle text-danger me-1"></i>,
        className: 'text-danger'
      };
    } else if (type === 'itemAdded') {
      return {
        icon: <i className="bi bi-plus-circle text-success me-1"></i>,
        className: 'text-success'
      };
    } else if (percentChange > 0) {
      return {
        icon: <i className="bi bi-arrow-up-circle text-danger me-1"></i>,
        className: 'text-danger'
      };
    } else if (percentChange < 0) {
      return {
        icon: <i className="bi bi-arrow-down-circle text-success me-1"></i>,
        className: 'text-success'
      };
    }
    return {
      icon: <i className="bi bi-dash-circle text-muted me-1"></i>,
      className: ''
    };
  };
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="xl"
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>报价单比较结果</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: colors?.card, color: colors?.text }}>
        <Row className="mb-4">
          <Col md={6}>
            <h6>报价单 A</h6>
            <Table bordered size="sm">
              <tbody>
                <tr>
                  <td width="30%">报价单号</td>
                  <td>{comparisonResult.quotationA.id}</td>
                </tr>
                <tr>
                  <td>日期</td>
                  <td>{comparisonResult.quotationA.date}</td>
                </tr>
                <tr>
                  <td>总金额</td>
                  <td>{formatPrice(comparisonResult.quotationA.totalAmount)}元</td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <h6>报价单 B</h6>
            <Table bordered size="sm">
              <tbody>
                <tr>
                  <td width="30%">报价单号</td>
                  <td>{comparisonResult.quotationB.id}</td>
                </tr>
                <tr>
                  <td>日期</td>
                  <td>{comparisonResult.quotationB.date}</td>
                </tr>
                <tr>
                  <td>总金额</td>
                  <td>{formatPrice(comparisonResult.quotationB.totalAmount)}元</td>
                </tr>
              </tbody>
            </Table>
          </Col>
        </Row>
        
        <h6 className="border-bottom pb-2 mb-3">价格差异明细</h6>
        
        <Table bordered responsive>
          <thead>
            <tr>
              <th>项目</th>
              <th>描述</th>
              <th>报价单A价格</th>
              <th>报价单B价格</th>
              <th>差异</th>
              <th>变化率</th>
            </tr>
          </thead>
          <tbody>
            {comparisonResult.differences.map((diff, index) => {
              const { icon, className } = getDifferenceStyle(diff.type, diff.percentChange);
              return (
                <tr key={index} className={className}>
                  <td>{icon} {diff.type === 'totalAmount' ? '总金额' : diff.model}</td>
                  <td>{diff.description}</td>
                  <td className="text-end">{formatPrice(diff.valueA)}</td>
                  <td className="text-end">{formatPrice(diff.valueB)}</td>
                  <td className={`text-end ${diff.difference > 0 ? 'text-danger' : diff.difference < 0 ? 'text-success' : ''}`}>
                    {diff.difference > 0 ? '+' : ''}{formatPrice(diff.difference)}
                  </td>
                  <td className="text-end">
                    {diff.percentChange > 0 ? '+' : ''}{formatPercent(diff.percentChange)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        
        <Alert variant="info" className="mt-3">
          <i className="bi bi-info-circle me-2"></i>
          总体变化: 报价单B比报价单A
          {comparisonResult.differences[0]?.difference > 0 ? '增加了' : '减少了'}
          {formatPrice(Math.abs(comparisonResult.differences[0]?.difference || 0))}元
          ({formatPercent(Math.abs(comparisonResult.differences[0]?.percentChange || 0))})
        </Alert>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: colors?.card }}>
        <Button
          variant="secondary"
          onClick={onHide}
        >
          关闭
        </Button>
        <Button
          variant="primary"
          onClick={() => {
            // 导出比较结果为Excel
            exportComparisonToExcel(comparisonResult, `报价单比较-${new Date().toISOString().slice(0, 10)}`);
            onHide();
          }}
        >
          <i className="bi bi-file-earmark-excel me-1"></i> 导出比较结果
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const forceReset = () => {
  try {
    console.log("开始强制重置数据...");
    localStorage.clear();
    console.log("localStorage已清除");

    sessionStorage.clear();
    console.log("sessionStorage已清除");

    if (window.indexedDB) {
        indexedDB.databases().then(dbs => {
            dbs.forEach(db => {
                console.log(`尝试删除indexedDB数据库 ${db.name}`);
                indexedDB.deleteDatabase(db.name).onsuccess = () => console.log(`indexedDB数据库 ${db.name} 已删除`);
                indexedDB.deleteDatabase(db.name).onerror = (event) => console.error(`删除indexedDB数据库 ${db.name} 失败`, event.target.error);
            });
        }).catch(err => console.error("枚举indexedDB数据库失败:", err));
    }

    document.cookie.split(";").forEach(c => {
      document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    console.log("Cookies已清除");

    alert("所有本地数据和设置已清除，页面将在3秒后重新加载...");

    setTimeout(() => {
      window.location.href = window.location.pathname + "?reset=" + new Date().getTime();
    }, 3000);
  } catch (error) {
    console.error("重置过程出错:", error);
    alert("重置过程出错: " + error.message + "。尝试手动刷新页面。");
    window.location.reload();
  }
};

function App({ appData: initialAppData, setAppData }) {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [appDataState, setAppDataState] = useState(initialAppData);

  const [dataFixed, setDataFixed] = useState(false);

  const [dataChecked, setDataChecked] = useState(false);

  const [engineData, setEngineData] = useState({ power: '', speed: '' });
  const [requirementData, setRequirementData] = useState({
    targetRatio: '',
    thrustRequirement: '',
    workCondition: "III类:扭矩变化中等",
    temperature: "30",
    hasCover: false,
    application: 'propulsion'
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
  const [activeTab, setActiveTab] = useState('input');
  const [selectionHistory, setSelectionHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [selectedGearboxIndex, setSelectedGearboxIndex] = useState(0);
  const [selectedComponents, setSelectedComponents] = useState({
    gearbox: null,
    coupling: null,
    pump: null
  });

  // 原有的价格状态 - 保留兼容性
  const [packagePrice, setPackagePrice] = useState(0);
  const [marketPrice, setMarketPrice] = useState(0);
  const [totalMarketPrice, setTotalMarketPrice] = useState(0);
  
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
  const [savedQuotation, setSavedQuotation] = useState(null);

  const [showDiagnosticPanel, setShowDiagnosticPanel] = useState(false);

  // --- Start: Define Validation Helpers Here (Moved) ---
  const getFieldValidationState = useCallback((fieldName, value) => {
    const numValue = parseFloat(value);
    const requiredPos = ['enginePower', 'engineSpeed', 'targetRatio'];
    const optionalNonNeg = ['thrustRequirement', 'temperature'];

    if (requiredPos.includes(fieldName)) {
      if (value === '' || value === null || isNaN(numValue) || numValue <= 0) return 'invalid';
      if ((fieldName === 'enginePower' && numValue > 5000) || 
          (fieldName === 'engineSpeed' && numValue > 3000) ||
          (fieldName === 'targetRatio' && numValue > 20)) return 'warning'; // Example warning thresholds
    }

    if (optionalNonNeg.includes(fieldName)) {
        if (value !== '' && value !== null && (isNaN(numValue) || numValue < 0)) return 'invalid';
        if (fieldName === 'thrustRequirement' && numValue > 1000) return 'warning';
        if (fieldName === 'temperature' && (numValue < -20 || numValue > 60)) return 'warning';
    }

    // Add other field checks if needed

    return 'valid'; // Default to valid if no issues found
  }, []);

  const getValidationClassName = useCallback((state) => {
    if (state === 'invalid') return 'is-invalid';
    if (state === 'warning') return 'is-warning'; // Assuming you have styles for .is-warning
    return ''; // Valid or no state
  }, []);

  const isFormValid = useCallback(() => {
    const states = [
      getFieldValidationState('enginePower', engineData.power),
      getFieldValidationState('engineSpeed', engineData.speed),
      getFieldValidationState('targetRatio', requirementData.targetRatio),
      getFieldValidationState('thrustRequirement', requirementData.thrustRequirement),
      getFieldValidationState('temperature', requirementData.temperature)
    ];

    const isValid = states.every(state => state === 'valid' || state === 'warning');
    const warnings = states.filter(state => state === 'warning').length;

    return { isValid, warnings };

  }, [engineData, requirementData, getFieldValidationState]);
  // --- End: Define Validation Helpers Here ---

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      console.log(`Redirecting to login from ${location.pathname}`);
      navigate('/login', { state: { from: location.pathname }, replace: true });
    } else if (isAuthenticated && location.pathname === '/login') {
      const redirectPath = location.state?.from || '/';
       console.log(`Authenticated, redirecting from login to ${redirectPath}`);
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  const isAdmin = user && (user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN);

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
            console.log(`已记录${allChanges.length}项价格变更到历史记录 (updateAppDataAndPersist)`);
        }
    } catch (e) {
        console.warn('记录价格历史变更失败 (in updateAppDataAndPersist):', e);
    }

    setAppDataState(dataToUpdate);

    if (setAppData && typeof setAppData === 'function') {
        setAppData(dataToUpdate);
    } else {
       console.warn("App Component: setAppData prop is not a function. Data changes won't be persisted to parent.");
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
      console.log("App Component received new initialAppData prop. Updating internal state.");
      setAppDataState(initialAppData);
  }, [initialAppData]);

  const handleEngineDataChange = useCallback((data) => {
    setEngineData(prevData => ({ ...prevData, ...data }));
    setError('');
  }, []);

  const handleRequirementDataChange = useCallback((data) => {
    if (data.temperature !== undefined) {
        data.temperature = String(data.temperature);
    }
    setRequirementData(prevData => ({ ...prevData, ...data }));
    setError('');
  }, []);

  const handleProjectInfoChange = useCallback((data) => {
    setProjectInfo(prevData => ({ ...prevData, ...data }));
    setError('');
  }, []);

  const handleGearboxTypeChange = useCallback((type) => {
    setGearboxType(type);
    setError('');
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  const safeNumberFormat = useCallback((value, decimals = 2) => {
    const num = parseFloat(value);
    if (typeof num !== 'number' || isNaN(num)) {
      return '-';
    }
    return num.toFixed(decimals);
  }, []);

  // 新增：统一的价格计算函数
  const calculateAllPrices = useCallback((gearbox, coupling, pump, options = {}) => {
    // 默认选项
    const defaultOptions = {
      includePump: true
    };
    
    // 合并选项
    const finalOptions = { ...defaultOptions, ...options };
    
    // 检查是否需要备用泵
    const needsPumpFlag = gearbox ? needsStandbyPump(gearbox.model, {
      power: gearbox.power
    }) : false;
    
    // 最终决定是否包含泵
    const effectiveIncludePump = needsPumpFlag && finalOptions.includePump;
    
    // 创建要使用的泵对象（如果不包含泵则为null）
    const pumpToUse = effectiveIncludePump ? pump : null;
    
    // 检查是否有特殊打包价格
    let hasSpecialPackagePrice = false;
    let specialPackageConfig = null;
    let packagePrice = 0;
    let marketPrice = 0;
    let totalMarketPrice = 0;
    
    if (gearbox && gearbox.model) {
      const gwConfig = getGWPackagePriceConfig(gearbox.model);
      if (gwConfig && !gwConfig.isSmallGWModel) {
        // 检查组件组合是否符合打包价格条件
        if (checkPackageMatch(gearbox, coupling, pumpToUse, gwConfig)) {
          hasSpecialPackagePrice = true;
          specialPackageConfig = gwConfig;
          
          // 使用特殊打包价格
          packagePrice = gwConfig.packagePrice;
          marketPrice = gwConfig.packagePrice;
          totalMarketPrice = gwConfig.packagePrice;
          
          console.log(`使用GW系列特殊打包价格: ${gwConfig.packagePrice}`);
        }
      }
    }
    
    // 如果没有特殊打包价格，则进行常规价格计算
    if (!hasSpecialPackagePrice) {
      // 计算打包价格
      packagePrice = calculatePackagePrice(gearbox, coupling, pumpToUse);
      
      // 计算市场价
      marketPrice = calculateMarketPrice(gearbox, packagePrice);
      
      // 计算总市场价格
      totalMarketPrice = (gearbox?.marketPrice || 0) + 
                        (coupling?.marketPrice || 0) + 
                        (pumpToUse?.marketPrice || 0);
    }
    
    // 返回完整的价格数据对象
    return {
      packagePrice,
      marketPrice,
      totalMarketPrice,
      gearbox: gearbox ? { ...gearbox } : null,
      coupling: coupling ? { ...coupling } : null,
      pump: pump ? { ...pump } : null,
      hasSpecialPackagePrice,
      specialPackageConfig,
      needsPump: needsPumpFlag,
      includePump: effectiveIncludePump
    };
  }, []);

  useEffect(() => {
    if (selectionResult && selectionResult.success && Array.isArray(selectionResult.recommendations) && selectionResult.recommendations.length > 0) {
      console.log("New selection result received, updating components...");
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
        
        console.log(`应用GW系列特殊打包价格: ${currentGearbox.model}, 价格: ${gwConfig.packagePrice}`);
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

      console.log("Selected Components Updated:", {
        gearbox: currentGearbox?.model,
        coupling: currentCoupling?.model,
        pump: currentPump?.model,
        hasSpecialPackagePrice: currentGearbox.hasSpecialPackagePrice || false
      });
      console.log("Prices Updated:", {
        packagePrice: newPriceData.packagePrice,
        marketPrice: newPriceData.marketPrice,
        totalMarketPrice: newPriceData.totalMarketPrice
      });
    } else if (selectionResult && !selectionResult.success) {
      console.log("Selection failed, clearing components and prices.");
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
             console.log(`Loaded ${parsedHistory.length} history entries from localStorage.`);
        } else {
            console.warn("Stored history is not an array, ignoring.");
             localStorage.removeItem('selectionHistory');
        }
      } catch (e) {
        console.error("无法解析存储的历史记录:", e);
        localStorage.removeItem('selectionHistory');
      }
    }
  }, []);

  // 修改：更新价格变更处理函数
  const handlePriceChange = useCallback((component, field, value) => {
    if (value === '') {
      setSelectedComponents(prev => ({
        ...prev,
        [component]: { ...prev[component], [field]: undefined }
      }));
      return;
    }

    const parsedValue = parseFloat(value);
    if (field === 'discountRate' && (isNaN(parsedValue) || parsedValue < 0 || parsedValue > 100)) {
        console.warn(`Invalid input for discountRate: ${value}`);
        return;
    } else if (field !== 'discountRate' && isNaN(parsedValue)) {
        console.warn(`Invalid number input for ${field}: ${value}`);
        return;
    }

    console.log(`价格变更: 组件=${component}, 字段=${field}, 值=${value} (parsed=${parsedValue})`);

    setSelectedComponents(prev => {
      if (!prev[component]) {
         console.warn(`组件 ${component} 在selectedComponents中未找到`);
         return prev;
      }

      const updatedComponent = { ...prev[component] };

       if (field === 'discountRate') {
            updatedComponent[field] = parsedValue / 100;
       } else {
            updatedComponent[field] = parsedValue;
       }

      if (field === 'basePrice' || field === 'discountRate') {
         if (updatedComponent.basePrice !== undefined && updatedComponent.discountRate !== undefined) {
            updatedComponent.factoryPrice = calculateFactoryPrice(updatedComponent);
         } else {
             updatedComponent.factoryPrice = undefined;
         }
      }

      // 检查特殊打包价格
      if (component === 'gearbox' && (field === 'basePrice' || field === 'factoryPrice' || field === 'marketPrice')) {
        // 如果是修改齿轮箱价格，检查是否有特殊打包价格
        const gwConfig = getGWPackagePriceConfig(updatedComponent.model);
        if (gwConfig && !gwConfig.isSmallGWModel) {
          // 保留特殊打包价格标记
          updatedComponent.hasSpecialPackagePrice = true;
          updatedComponent.gwPackageConfig = gwConfig;
          // 但如果用户手动修改价格，提供覆盖选项
          if (field === 'marketPrice') {
            // 如果直接修改市场价，临时关闭特殊打包价格
            updatedComponent._userOverridePrice = true;
            console.log(`用户手动修改市场价，临时覆盖特殊打包价格`);
          }
        }
      }

      const newComponents = { ...prev, [component]: updatedComponent };

      // 使用统一的价格计算函数更新价格
      const newPriceData = calculateAllPrices(
        newComponents.gearbox,
        newComponents.coupling,
        newComponents.pump,
        { includePump: priceData.includePump }
      );
      
      // 更新统一的价格状态
      setPriceData(newPriceData);
      
      // 保持对原有状态的更新，以便兼容性
      setPackagePrice(newPriceData.packagePrice);
      setMarketPrice(newPriceData.marketPrice);
      setTotalMarketPrice(newPriceData.totalMarketPrice);

      console.log("价格变更后更新组件:", newComponents);
      return newComponents;
    });

    setQuotation(null);
    setAgreement(null);
    setContract(null);
  }, [calculateAllPrices, priceData.includePump]);

  const handleBatchPriceAdjustment = useCallback((adjustmentInfo) => {
    const { category, field, type, value, reason } = adjustmentInfo;

     if (!appDataState || Object.keys(appDataState).length === 0) {
      setError("应用数据未加载，无法进行批量调整。");
      return;
    }
    if (!field || !type || value === undefined || value === null) {
      setError("批量调整参数无效。");
      return;
    }
    let totalAdjustedCount = 0;
    setLoading(true);
    setError('正在应用批量价格调整...');

    updateAppDataAndPersist(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));

      const updateItemPrice = (item) => {
        if (!item || typeof item !== 'object') return false;
        if (!item.model) {
            console.warn("Skipping item without model in batch update:", item);
            return false;
        }

        if (field !== 'discountRate' && (item[field] === undefined || item[field] === null || typeof item[field] !== 'number')) {
             if (field !== 'discountRate') return false;
        }

        let originalValue = item[field];
         if (field === 'discountRate' && (originalValue === undefined || originalValue === null)) {
             originalValue = getStandardDiscountRate(item.model);
         }


        let newValue = originalValue;
        let appliedAdjustment = false;

        try {
          const adjustmentValue = parseFloat(value);
          if (isNaN(adjustmentValue)) throw new Error("调整值不是数字");

          const method = type; // 定义局部变量method，值为type参数
          if (method === 'percentage') {
            if (field === 'discountRate') {
                 const currentRate = originalValue;
                 const adjustmentFactor = adjustmentValue / 100;
                 let newRate = currentRate + adjustmentFactor;
                 newRate = Math.max(0, Math.min(1, newRate));
                 newValue = parseFloat(newRate.toFixed(4));
            } else {
                const current = originalValue || 0;
                const factor = 1 + adjustmentValue / 100;
                newValue = current * factor;
                newValue = Math.max(0, parseFloat(newValue.toFixed(2)));
            }
          } else if (method === 'amount') {
            if (field === 'discountRate') {
                const currentRate = originalValue;
                 const adjustmentDecimal = adjustmentValue / 100;
                 let newRate = currentRate + adjustmentDecimal;
                 newRate = Math.max(0, Math.min(1, newRate));
                 newValue = parseFloat(newRate.toFixed(4));
            } else {
                const current = originalValue || 0;
                newValue = current + adjustmentValue;
                newValue = Math.max(0, parseFloat(newValue.toFixed(2)));
            }
          } else {
            throw new Error(`无效的调整类型: ${type}`);
          }

          if (newValue !== originalValue) {
             item[field] = newValue;
             appliedAdjustment = true;

             let itemNeedsRecalc = false;
             if (field === 'basePrice' || field === 'discountRate' || field === 'factoryPrice') {
                  itemNeedsRecalc = true;
             }

             if (itemNeedsRecalc) {
                  const correctedItem = correctPriceData(item);
                  item.basePrice = correctedItem.basePrice;
                  item.price = correctedItem.price;
                  item.discountRate = correctedItem.discountRate;
                  item.factoryPrice = correctedItem.factoryPrice;
                  item.packagePrice = correctedItem.packagePrice;
                  item.marketPrice = correctedItem.marketPrice;
             }
          }

        } catch (e) {
          console.error(`批量调整价格失败，项目 ${item?.model}:`, e);
        }
        return appliedAdjustment;
      };

      const updateCategory = (catKey) => {
        if (newData[catKey] && Array.isArray(newData[catKey])) {
          let adjustedCountInCategory = 0;
          newData[catKey].forEach(item => {
            if (updateItemPrice(item)) {
              adjustedCountInCategory++;
            }
          });
          totalAdjustedCount += adjustedCountInCategory;
          console.log(`类别 ${catKey}: ${adjustedCountInCategory} 项已更新。`);
        } else {
          console.warn(`类别 ${catKey} 在数据中未找到或不是数组。`);
        }
      };

      const allCollections = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'];
      const gearboxCollections = allCollections.filter(key => key.endsWith('Gearboxes'));
      const accessoryCollections = ['flexibleCouplings', 'standbyPumps'];


      if (category === 'all') {
        allCollections.forEach(updateCategory);
      } else if (category === 'allGearboxes') {
        gearboxCollections.forEach(updateCategory);
      } else if (category === 'allAccessories') {
         accessoryCollections.forEach(updateCategory);
      }
       else if (allCollections.includes(category) && newData[category]) {
        updateCategory(category);
      } else {
        console.warn(`批量调整指定了无效的类别: ${category}`);
        setError(`无效的调整类别: ${category}`);
        return prevData;
      }

      console.log(`批量调整已应用。共 ${totalAdjustedCount} 项已更新。`);

      return newData;
    });

    const adjustmentDesc = type === 'percentage' ?
        `${value > 0 ? '增加' : '减少'}${Math.abs(value)}%` :
        `${value > 0 ? '增加' : '减少'}${Math.abs(value)}元`;

    setSuccess(`批量价格调整已应用 (${totalAdjustedCount} 项已更新${reason ? '，原因: ' + reason : ''})。请在数据库管理界面保存更改。`);
    setError('');

    setLoading(false);
    setShowBatchPriceAdjustment(false);

    setQuotation(null);
    setAgreement(null);
    setContract(null);

  }, [appDataState, updateAppDataAndPersist]);

  // 修改：更新齿轮箱选择函数，使用统一价格计算
  const handleGearboxSelection = useCallback((index) => {
    // 首先进行更完善的验证
    if (!selectionResult) {
      console.error("Cannot select gearbox, selection result is null or undefined");
      setError("无法选择齿轮箱，请先进行选型。");
      return;
    }
    
    if (!Array.isArray(selectionResult.recommendations)) {
      console.error("Cannot select gearbox, recommendations is not an array:", selectionResult);
      setError("无法选择齿轮箱，选型结果格式错误。");
      return;
    }
    
    if (index < 0 || index >= selectionResult.recommendations.length) {
      console.error(`Cannot select gearbox, index ${index} out of range (0-${selectionResult.recommendations.length - 1})`);
      setError(`无法选择齿轮箱，索引 ${index} 超出范围。`);
      return;
    }
  
    // 确认可以选择齿轮箱
    setSelectedGearboxIndex(index);
    const selectedGearbox = { ...selectionResult.recommendations[index] };
    console.log(`User selected gearbox at index ${index}:`, selectedGearbox.model);
  
    // 如果是部分匹配的齿轮箱，显示警告
    if (selectedGearbox.isPartialMatch) {
      setSuccess(''); // 清除成功消息
      setError(`注意: 选择的齿轮箱 ${selectedGearbox.model} 是部分匹配结果，${selectedGearbox.failureReason || '不完全满足所有要求'}`);
    } else {
      setError(''); // 清除错误消息
    }
  
    // 修正价格和其他数据
    const correctedGearbox = correctPriceData(selectedGearbox);
    
    // 检查是否有特殊打包价格配置
    const gwConfig = getGWPackagePriceConfig(correctedGearbox.model);
    if (gwConfig && !gwConfig.isSmallGWModel) {
      // 标记为特殊打包价格型号
      correctedGearbox.hasSpecialPackagePrice = true;
      correctedGearbox.gwPackageConfig = gwConfig;
      correctedGearbox.packagePrice = gwConfig.packagePrice;
      // 对于特殊打包价格，市场价等于打包价
      correctedGearbox.marketPrice = gwConfig.packagePrice;
      
      console.log(`选中的齿轮箱适用GW系列特殊打包价格: ${correctedGearbox.model}, 价格: ${gwConfig.packagePrice}`);
    }
  
    // 确保engineTorque存在，否则使用计算值
    const engineTorque = selectionResult.engineTorque || 
                       (parseFloat(engineData.power) * 9550 / parseFloat(engineData.speed));
  
    // 确保appDataState包含必要的数据
    if (!appDataState || !Array.isArray(appDataState.flexibleCouplings) || !Array.isArray(appDataState.standbyPumps)) {
      setError("数据加载不完整，无法选择配件。");
      console.error("Missing data for coupling/pump selection:", appDataState);
      
      // 即使缺少配件数据，也设置齿轮箱
      setSelectedComponents(prev => ({
        ...prev,
        gearbox: correctedGearbox
      }));
      
      // 使用统一的价格计算函数
      const newPriceData = calculateAllPrices(
        correctedGearbox, 
        null, 
        null,
        { includePump: true }
      );
      
      // 更新统一的价格状态
      setPriceData(newPriceData);
      
      // 保持对原有状态的更新，以便兼容性
      setPackagePrice(newPriceData.packagePrice);
      setMarketPrice(newPriceData.marketPrice);
      setTotalMarketPrice(newPriceData.totalMarketPrice);
      
      setActiveTab('result');
      return;
    }
  
    // 使用增强型联轴器选型功能
    let updatedCouplingResult;
    
    try {
      // 如果不是首选齿轮箱(index=0)，或者没有预先计算好的联轴器，则重新选择
      if (index !== 0 || !selectionResult.flexibleCoupling) {
        // 使用增强型联轴器选型
        updatedCouplingResult = enhancedCouplingSelection(
          {
            ...selectionResult,
            recommendations: [correctedGearbox],  // 使用当前选中的齿轮箱
            engineTorque,
            engineSpeed: parseFloat(engineData.speed)
          },
          appDataState.flexibleCouplings,
          {
            workCondition: requirementData.workCondition,
            temperature: parseFloat(requirementData.temperature) || 30,
            hasCover: requirementData.hasCover
          }
        );
      } else {
        // 使用原有选型结果中的联轴器
        updatedCouplingResult = selectionResult.flexibleCoupling;
      }
    } catch (error) {
      console.error("联轴器选择失败:", error);
      updatedCouplingResult = { success: false, message: "联轴器选择过程中出错: " + error.message };
    }
  
    // 获取或重新选择备用泵
    let updatedPumpResult;
    const pumpOptions = { power: correctedGearbox.power };

    try {
      // 使用增强版备用泵选型函数
      updatedPumpResult = enhancedSelectPump(
        correctedGearbox.model,
        appDataState.standbyPumps,
        pumpOptions
      );
      
      // 如果返回的结果表示不需要备用泵，需要进行特殊处理
      if (updatedPumpResult && !updatedPumpResult.requiresPump) {
        console.log(`齿轮箱 ${correctedGearbox.model} 不需要配备备用泵`);
        // 在界面上可以显示不需要备用泵的提示
      }
    } catch (error) {
      console.error("备用泵选择失败:", error);
      updatedPumpResult = { 
        success: false, 
        message: "备用泵选择过程中出错: " + error.message,
        requiresPump: needsStandbyPump(correctedGearbox.model, pumpOptions)
      };
    }
  
    const currentCoupling = updatedCouplingResult?.success ? correctPriceData({ ...updatedCouplingResult }) : null;
    const currentPump = updatedPumpResult?.success ? correctPriceData({ ...updatedPumpResult }) : null;
  
    setSelectedComponents({
      gearbox: correctedGearbox,
      coupling: currentCoupling,
      pump: currentPump
    });
  
    // 使用统一的价格计算函数
    const newPriceData = calculateAllPrices(
      correctedGearbox, 
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
  
    console.log("Selected Components Updated:", {
      gearbox: correctedGearbox?.model,
      coupling: currentCoupling?.model,
      pump: currentPump?.model,
      hasSpecialPackagePrice: correctedGearbox.hasSpecialPackagePrice || false,
      needsPump: newPriceData.needsPump,
      includePump: newPriceData.includePump
    });
    console.log("Prices Updated:", {
      packagePrice: newPriceData.packagePrice,
      marketPrice: newPriceData.marketPrice,
      totalMarketPrice: newPriceData.totalMarketPrice
    });
  
    setQuotation(null);
    setAgreement(null);
    setContract(null);
    setActiveTab('result');
  }, [selectionResult, appDataState, requirementData, engineData, setActiveTab, calculateAllPrices]);

  // 新增处理联轴器选择的函数
  const handleCouplingSelection = useCallback((index) => {
    if (!selectionResult || !selectionResult.flexibleCoupling || 
        !selectionResult.flexibleCoupling.recommendations || 
        index >= selectionResult.flexibleCoupling.recommendations.length) {
      setError('无法选择联轴器，选型结果无效或索引超出范围');
      return;
    }
    
    try {
      // 获取选中的联轴器
      const selectedCoupling = selectionResult.flexibleCoupling.recommendations[index];
      console.log(`选择联轴器: ${selectedCoupling.model}`);
      
      // 创建新的选型结果对象，用选中的联轴器替换原来的最佳匹配
      const updatedCouplingResult = {
        ...selectionResult.flexibleCoupling,
        model: selectedCoupling.model,
        torque: selectedCoupling.torque,
        torqueUnit: selectedCoupling.torqueUnit,
        maxSpeed: selectedCoupling.maxSpeed,
        torqueMargin: selectedCoupling.torqueMargin,
        score: selectedCoupling.score,
        scoreDetails: selectedCoupling.scoreDetails,
        weight: selectedCoupling.weight,
        factoryPrice: selectedCoupling.factoryPrice,
        marketPrice: selectedCoupling.marketPrice
      };
      
      // 更新选型结果
      setSelectionResult(prev => ({
        ...prev,
        flexibleCoupling: updatedCouplingResult
      }));
      
      // 如果需要更新选中组件和价格
      const correctedCoupling = correctPriceData(selectedCoupling);
      
      setSelectedComponents(prev => ({
        ...prev,
        coupling: correctedCoupling
      }));
      
      // 使用统一的价格计算函数更新价格
      const newPriceData = calculateAllPrices(
        selectedComponents.gearbox,
        correctedCoupling,
        selectedComponents.pump,
        { includePump: priceData.includePump }
      );
      
      // 更新统一的价格状态
      setPriceData(newPriceData);
      
      // 保持对原有状态的更新，以便兼容性
      setPackagePrice(newPriceData.packagePrice);
      setMarketPrice(newPriceData.marketPrice);
      setTotalMarketPrice(newPriceData.totalMarketPrice);
      
      // 清除之前的报价单和协议
      setQuotation(null);
      setAgreement(null);
      setContract(null);
      
      setSuccess(`已选择联轴器: ${selectedCoupling.model}`);
    } catch (error) {
      console.error("选择联轴器出错:", error);
      setError('选择联轴器时出错: ' + error.message);
    }
  }, [selectionResult, selectedComponents, priceData.includePump, calculateAllPrices]);

  // 修改后的生成报价单函数 - 显示选项对话框
  const handleGenerateQuotation = useCallback(() => {
    if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
      setActiveTab('input');
      return;
    }
     if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成报价单。');
      return;
    }

    // 弹出报价选项设置对话框
    setShowQuotationOptions(true);
  }, [selectedComponents, selectionResult, setActiveTab]);

  // 修改：更新报价单生成函数，使用统一的价格数据
  const generateQuotationWithOptions = useCallback((options = {}) => {
    setLoading(true);
    setError('');
    setSuccess('正在生成报价单...');
    
    try {
      // 创建新的组件对象，并确保价格数据正确
      const finalComponents = {
        gearbox: selectedComponents.gearbox ? correctPriceData(selectedComponents.gearbox) : null,
        coupling: selectedComponents.coupling ? correctPriceData(selectedComponents.coupling) : null,
        pump: selectedComponents.pump ? correctPriceData(selectedComponents.pump) : null,
      };
      
      // 使用统一的价格计算函数更新价格 - 传入用户选择的配件显示选项
      const quotationPriceData = calculateAllPrices(
        finalComponents.gearbox,
        finalComponents.coupling,
        finalComponents.pump,
        { includePump: options.includePump }
      );
      
      // 根据特殊打包价格配置调整显示选项
      if (quotationPriceData.hasSpecialPackagePrice) {
        // 对于特殊打包价格，默认不显示联轴器和泵的单独价格
        options.showCouplingPrice = false;
        options.showPumpPrice = false;
        console.log("使用GW系列特殊打包价格，不显示联轴器和泵的单独价格");
      }
      
      console.log("准备生成报价单，组件:", {
        gearbox: finalComponents.gearbox?.model,
        coupling: finalComponents.coupling?.model,
        pump: finalComponents.pump?.model,
        hasSpecialPackagePrice: quotationPriceData.hasSpecialPackagePrice,
        needsPump: quotationPriceData.needsPump,
        includePump: quotationPriceData.includePump,
        options
      });
      
      // 生成报价单，使用统一的价格数据
      const quotationData = generateQuotation(
        selectionResult,
        projectInfo,
        finalComponents,
        {
          packagePrice: quotationPriceData.packagePrice,
          marketPrice: quotationPriceData.marketPrice,
          totalMarketPrice: quotationPriceData.totalMarketPrice,
          componentPrices: {
            gearbox: finalComponents.gearbox ? {
              factoryPrice: finalComponents.gearbox.factoryPrice,
              marketPrice: finalComponents.gearbox.marketPrice,
              basePrice: finalComponents.gearbox.basePrice || finalComponents.gearbox.price,
              packagePrice: finalComponents.gearbox.packagePrice
            } : null,
            coupling: finalComponents.coupling ? {
              factoryPrice: finalComponents.coupling.factoryPrice,
              marketPrice: finalComponents.coupling.marketPrice,
              basePrice: finalComponents.coupling.basePrice || finalComponents.coupling.price
            } : null,
            pump: finalComponents.pump ? {
              factoryPrice: finalComponents.pump.factoryPrice,
              marketPrice: finalComponents.pump.marketPrice,
              basePrice: finalComponents.pump.basePrice || finalComponents.pump.price
            } : null
          },
          // 添加标准化的备用泵需求信息
          needsPump: quotationPriceData.needsPump,
          includePump: quotationPriceData.includePump,
          hasSpecialPackagePrice: quotationPriceData.hasSpecialPackagePrice,
          specialPackageConfig: quotationPriceData.specialPackageConfig
        },
        options // 传递报价单选项
      );
      
      // 更新价格数据状态，确保包含最新用户选择
      setPriceData({
        ...quotationPriceData,
        includePump: options.includePump
      });
      
      setQuotation(quotationData);
      setActiveTab('quotation');
      setError('');
      setSuccess('报价单生成成功');
      
    } catch (error) {
      console.error("生成报价单错误:", error);
      setError('生成报价单失败: ' + error.message);
    } finally {
      setLoading(false);
      setShowQuotationOptions(false); // 关闭选项对话框
    }
  }, [selectedComponents, selectionResult, projectInfo, setActiveTab, calculateAllPrices]);

  // 处理自定义报价项目添加
  const handleAddCustomQuotationItem = useCallback((itemData) => {
    if (!quotation || !quotation.success) {
      setError('请先生成基本报价单');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 添加自定义项目到报价单
      const updatedQuotation = addCustomItemToQuotation(quotation, itemData);
      
      // 更新状态
      setQuotation(updatedQuotation);
      setSuccess(`已添加自定义项目: ${itemData.name}`);
    } catch (error) {
      console.error("添加自定义项目错误:", error);
      setError('添加自定义项目失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [quotation]);

  // 处理移除报价项目
  const handleRemoveQuotationItem = useCallback((itemId) => {
    if (!quotation || !quotation.success || !Array.isArray(quotation.items)) {
      return;
    }
    
    // 确认是否删除
    if (window.confirm("确定要从报价单中移除此项目?")) {
      setLoading(true);
      
      try {
        // 从报价单移除项目
        const updatedQuotation = removeItemFromQuotation(quotation, itemId);
        
        // 更新状态
        setQuotation(updatedQuotation);
        setSuccess('已从报价单移除项目');
      } catch (error) {
        console.error("移除项目错误:", error);
        setError('移除项目失败: ' + error.message);
      } finally {
        setLoading(false);
      }
    }
  }, [quotation]);

  // 保存当前报价单
  const handleSaveQuotation = useCallback((name) => {
    if (!quotation || !quotation.success) {
      setError('请先生成报价单');
      return;
    }
    
    try {
      const success = saveQuotation(quotation, name, projectInfo);
      
      if (success) {
        setSuccess(`报价单已保存${name ? ': ' + name : ''}`);
      } else {
        setError('保存报价单失败');
      }
    } catch (error) {
      console.error("保存报价单错误:", error);
      setError('保存报价单失败: ' + error.message);
    }
  }, [projectInfo, quotation]);

  // 加载保存的报价单
  const handleLoadSavedQuotation = useCallback((quotationId) => {
    try {
      const savedQuotation = loadSavedQuotation(quotationId);
      
      if (!savedQuotation || !savedQuotation.data) {
        setError('找不到指定的保存报价单');
        return;
      }
      
      // 加载报价单
      setQuotation(savedQuotation.data);
      
      // 如果有项目信息，也加载项目信息
      if (savedQuotation.projectInfo) {
        setProjectInfo(prev => ({
          ...prev,
          projectName: savedQuotation.projectInfo.projectName || prev.projectName,
          customerName: savedQuotation.projectInfo.customerName || prev.customerName
        }));
      }
      
      // 更新状态为成功
      setSuccess(`已加载保存的报价单: ${savedQuotation.name || savedQuotation.id}`);
      setActiveTab('quotation');
    } catch (error) {
      console.error("加载保存报价单错误:", error);
      setError('加载保存报价单失败: ' + error.message);
    }
  }, [setActiveTab, setProjectInfo]);

  // 比较两个报价单
  const handleCompareQuotations = useCallback((quotationA, quotationB) => {
   // 比较两个报价单
    if (!quotationA || !quotationB) {
      setError('请选择两个需要比较的报价单');
      return;
    }
    
    try {
      const comparisonData = compareQuotations(quotationA, quotationB);
      
      if (!comparisonData) {
        setError('比较报价单失败：无法生成比较数据');
        return;
      }
      
      // 保存比较结果
      setComparisonResult(comparisonData);
      setShowComparisonModal(true);
    } catch (error) {
      console.error("比较报价单错误:", error);
      setError('比较报价单失败: ' + error.message);
    }
  }, []);

  // 更新报价单价格
  const handleUpdateQuotationPrices = useCallback(() => {
    if (!quotation || !quotation.success) {
      setError('请先生成报价单');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('正在更新报价单价格...');
    
    try {
      // 创建新的报价单对象
      const updatedQuotation = {
        ...quotation,
        items: [...quotation.items]
      };
      
      // 更新每个项目的价格
      let totalAmount = 0;
      let usingSpecialPackagePrice = false;
      let specialPackagePrice = 0;
      
      // 判断是否需要备用泵
      const needsPump = selectedComponents.gearbox && needsStandbyPump(
        selectedComponents.gearbox.model,
        { power: selectedComponents.gearbox.power }
      );
      
      // 从原报价单中获取是否包含备用泵的设置
      const includePump = updatedQuotation.options?.includePump !== undefined ? 
                         updatedQuotation.options.includePump : 
                         needsPump; // 默认值基于型号判断
      
      // 如果不需要备用泵或用户选择不包含，则移除备用泵项目
      if (!needsPump || !includePump) {
        const pumpIndex = updatedQuotation.items.findIndex(item => item.name === "备用泵");
        if (pumpIndex >= 0) {
          updatedQuotation.items.splice(pumpIndex, 1);
        }
      }
      
      updatedQuotation.items.forEach(item => {
        // 对于齿轮箱项目，使用当前选中的组件价格
        if (item.name === "船用齿轮箱" && selectedComponents.gearbox) {
          const gearbox = selectedComponents.gearbox;
          
          // 检查是否有特殊打包价格
          const gwConfig = getGWPackagePriceConfig(gearbox.model);
          const hasSpecialPackagePrice = gwConfig && !gwConfig.isSmallGWModel;
          
          // 更新价格
          if (hasSpecialPackagePrice) {
            // 使用特殊打包价格
            item.prices.market = gwConfig.packagePrice;
            item.prices.factory = gwConfig.packagePrice * 0.85;
            item.prices.package = gwConfig.packagePrice;
            // 添加特殊打包价格标记
            item.hasSpecialPackagePrice = true;
            item.gwPackageConfig = gwConfig;
            
            // 设置标志和特殊价格，用于计算总金额
            usingSpecialPackagePrice = true;
            specialPackagePrice = gwConfig.packagePrice;
          } else {
            // 常规价格
            const marketPrice = gearbox.marketPrice || gearbox.factoryPrice * 1.15;
            item.prices.market = marketPrice;
            item.prices.factory = gearbox.factoryPrice || marketPrice * 0.85;
            item.prices.package = gearbox.factoryPrice || marketPrice * 0.85;
          }
        }
        
        // 对于联轴器项目，使用当前选中的组件价格
        if (item.name === "高弹性联轴器" && selectedComponents.coupling) {
          const coupling = selectedComponents.coupling;
          const marketPrice = coupling.marketPrice || coupling.factoryPrice * 1.15;
          
          // 更新价格
          item.prices.market = marketPrice;
          item.prices.factory = coupling.factoryPrice || marketPrice * 0.85;
          item.prices.package = coupling.factoryPrice || marketPrice * 0.85;
        }
        
        // 对于备用泵项目，使用当前选中的组件价格
        if (item.name === "备用泵" && selectedComponents.pump && needsPump && includePump) {
          const pump = selectedComponents.pump;
          const marketPrice = pump.marketPrice || pump.factoryPrice * 1.15;
          
          // 更新价格
          item.prices.market = marketPrice;
          item.prices.factory = pump.factoryPrice || marketPrice * 0.85;
          item.prices.package = pump.factoryPrice || marketPrice * 0.85;
        }
        
        // 重新计算金额
        item.unitPrice = item.prices[item.selectedPrice] || 0;
        item.amount = item.unitPrice * item.quantity;
      });
      
      // 关键修改：使用特殊打包价格计算总金额
      if (usingSpecialPackagePrice) {
        // 如果使用特殊打包价格，总金额就等于特殊打包价格
        totalAmount = specialPackagePrice;
        
        // 标记报价单使用特殊打包价格
        updatedQuotation.usingSpecialPackagePrice = true;
        updatedQuotation.specialPackageConfig = updatedQuotation.items.find(
          item => item.name === "船用齿轮箱" && item.hasSpecialPackagePrice
        )?.gwPackageConfig;
      } else {
        // 常规方式计算总金额
        totalAmount = updatedQuotation.items.reduce((sum, item) => sum + item.amount, 0);
      }
      
      // 更新总金额
      updatedQuotation.totalAmount = totalAmount;
      updatedQuotation.originalAmount = totalAmount;
      
      // 应用折扣（如果有）
      if (updatedQuotation.discountPercentage > 0) {
        updatedQuotation.discountAmount = Math.round(updatedQuotation.originalAmount * (updatedQuotation.discountPercentage / 100));
        updatedQuotation.totalAmount = updatedQuotation.originalAmount - updatedQuotation.discountAmount;
      }
      
      // 更新总金额大写
      updatedQuotation.totalAmountInChinese = numberToChinese(updatedQuotation.totalAmount);
      
      // 更新状态
      setQuotation(updatedQuotation);
      setSuccess('报价单价格已更新');
    } catch (error) {
      console.error("更新报价单价格错误:", error);
      setError('更新报价单价格失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [quotation, selectedComponents]);

  const handleExportQuotation = useCallback(async (format) => {
    if (!quotation) {
      setError('请先生成报价单');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(`正在导出报价单为 ${format.toUpperCase()}...`);
    
    try {
      const filename = `${projectInfo.projectName || '未命名项目'}-报价单`;
      
      if (format === 'excel') {
        try {
          await exportQuotationToExcel(quotation, filename);
          setSuccess('报价单已成功导出为Excel格式');
        } catch (excelError) {
          console.error("Excel导出错误:", excelError);
          setError('Excel导出失败: ' + excelError.message);
        }
      } else if (format === 'pdf') {
        try {
          // 获取报价单预览元素
          const previewElement = document.querySelector('.quotation-preview-content');
          
          if (previewElement) {
            // 如果已有预览元素，使用优化的PDF导出函数
            await optimizedHtmlToPdf(previewElement, {
              filename: `${filename}.pdf`,
              orientation: 'portrait',
              format: 'a4',
              scale: 2
            });
            setSuccess('报价单已成功导出为PDF格式');
          } else {
            // 否则使用原生导出函数
            await exportQuotationToPDF(quotation, filename);
            setSuccess('报价单已成功导出为PDF格式');
          }
        } catch (pdfError) {
          console.error("PDF导出错误:", pdfError);
          setError('PDF导出失败: ' + pdfError.message);
        }
      } else {
        setError('不支持的导出格式: ' + format);
      }
    } catch (error) {
      console.error("导出报价单错误:", error);
      setError('导出报价单失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [quotation, projectInfo.projectName]);

  // 修改后的生成技术协议函数 - 用于跳转到技术协议选项卡
  const handleGenerateAgreement = useCallback(() => {
    if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
      return;
    }
    if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成技术协议。');
      return;
    }
    
    // 在跳转前，确保selectionResult包含最新的价格信息
    if (selectionResult && !selectionResult.priceData) {
      setSelectionResult(prev => ({
        ...prev,
        priceData: { ...priceData }
      }));
    }
    
    // 直接跳转到技术协议选项卡
    setActiveTab('agreement');
    setSuccess('请在技术协议选项卡中选择所需的协议模板和配置');
  }, [selectedComponents, selectionResult, priceData, setActiveTab]);

  const handleExportAgreement = useCallback(async (format) => {
    if (!agreement) {
      setError('请先生成技术协议');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess(`正在导出技术协议为 ${format.toUpperCase()}...`);
    try {
      const filename = `${projectInfo.projectName || '未命名项目'}-技术协议`;
      if (format === 'word') {
        exportAgreementToWord(agreement, filename);
        setSuccess('技术协议已导出为Word格式');
      } else if (format === 'pdf') {
        // 获取技术协议预览元素
        const previewElement = document.querySelector('.agreement-preview-content');
        
        if (previewElement) {
          // 如果已有预览元素，使用优化的PDF导出函数
          await optimizedHtmlToPdf(previewElement, {
            filename: `${filename}.pdf`,
            orientation: 'portrait',
            format: 'a4',
            scale: 2,
            fontSize: '14px',
            lineHeight: '1.5'
          });
          setSuccess('技术协议已导出为PDF格式');
        } else {
          // 否则使用原生导出函数
          await exportAgreementToPDFFormat(agreement, filename);
          setSuccess('技术协议已导出为PDF格式');
        }
      } else if (format === 'copy') {
        const contentToCopy = agreement?.details || JSON.stringify(agreement, null, 2);
        navigator.clipboard.writeText(contentToCopy)
          .then(() => setSuccess('技术协议内容已复制到剪贴板'))
          .catch(err => {
               console.error("复制失败:", err);
               setError('复制技术协议失败: ' + err.message);
           })
           .finally(() => setLoading(false));
           return;
      } else {
           setError('不支持的导出格式');
      }
    } catch (error) {
      console.error("导出技术协议错误:", error);
      setError('导出技术协议失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [agreement, projectInfo.projectName]);

  // 修改：更新合同生成函数，使用统一的价格数据
  const handleGenerateContract = useCallback(() => {
    if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
      return;
    }
    if (!quotation) {
      setError('请先生成报价单，合同需要报价信息');
      setActiveTab('quotation');
      return;
    }
    if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成合同。');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('正在生成销售合同...');
    
    try {
      // 使用报价单中的价格信息 - 报价单生成时已经包含了正确的价格和配件选项
      const contractPackagePrice = quotation.summary?.packagePrice;
      const contractMarketPrice = quotation.summary?.marketPrice;
      const contractTotalMarketPrice = quotation.summary?.totalMarketPrice;
      
      // 确保使用与报价单一致的价格
      const contractData = generateContract(
        selectionResult,
        projectInfo,
        selectedComponents,
        {
          packagePrice: contractPackagePrice,
          marketPrice: contractMarketPrice,
          totalMarketPrice: contractTotalMarketPrice,
          quotationDetails: quotation,
          // 直接传递报价单中的备用泵需求信息，确保一致性
          needsPump: quotation.options?.needsPump,
          includePump: quotation.options?.includePump,
          hasSpecialPackagePrice: quotation.usingSpecialPackagePrice,
          specialPackageConfig: quotation.specialPackageConfig
        }
      );
      
      setContract(contractData);
      setActiveTab('contract');
      setSuccess('销售合同生成成功');
    } catch (error) {
      console.error("生成销售合同错误:", error);
      setError('生成销售合同失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedComponents, selectionResult, projectInfo, quotation, setActiveTab]);

  // 添加缺失的合同导出函数
  const handleExportContract = useCallback(async (format) => {
    if (!contract) {
      setError('请先生成销售合同');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess(`正在导出销售合同为 ${format.toUpperCase()}...`);
    
    try {
      const filename = `${projectInfo.projectName || '未命名项目'}-销售合同`;
      
      if (format === 'word') {
        exportContractToWord(contract, filename);
        setSuccess('销售合同已导出为Word格式');
        setLoading(false);
      } else if (format === 'pdf') {
        // 获取合同预览元素
        const previewElement = document.querySelector('.contract-preview-content');
        
        if (previewElement) {
          // 添加延时确保内容完全渲染
          setTimeout(async () => {
            try {
              // 使用优化的PDF导出函数
              await optimizedHtmlToPdf(previewElement, {
                filename: `${filename}.pdf`,
                orientation: 'portrait',
                format: 'a4',
                scale: 2,
                fontSize: '14px',
                lineHeight: '1.5',
                useCORS: true,
                allowTaint: true,
                logging: true
              });
              setSuccess('销售合同已导出为PDF格式');
            } catch (pdfError) {
              console.error("PDF导出详细错误:", pdfError);
              setError('PDF导出失败: ' + pdfError.message);
            }
            setLoading(false);
          }, 800); // 使用更长的延时(800ms)确保复杂内容渲染完成
        } else {
          // 未找到预览元素
          setError('无法找到合同预览内容，请确保合同正确生成');
          setLoading(false);
        }
      } else {
        setError('不支持的导出格式');
        setLoading(false);
      }
    } catch (error) {
      console.error("导出销售合同错误:", error);
      setError('导出销售合同失败: ' + error.message);
      setLoading(false);
    }
  }, [contract, projectInfo.projectName]);

  // 添加缺失的历史记录加载函数
  const handleLoadHistoryEntry = useCallback((historyId) => {
    const entry = selectionHistory.find(item => item.id === historyId);
    
    if (entry && entry.selectionResult) {
      setLoading(true);
      setError('');
      setSuccess('正在加载历史记录...');
      
      setProjectInfo(entry.projectInfo || { projectName: '', customerName: '', projectNumber: '', contactPerson: '', contactPhone: '', contactEmail: '', engineModel: '' });
      setEngineData(entry.engineData || { power: '', speed: '' });
      setRequirementData(entry.requirementData || { targetRatio: '', thrustRequirement: '', workCondition: "III类:扭矩变化中等", temperature: "30", hasCover: false, application: 'propulsion' });
      
      const historyGearboxType = entry.selectionResult?.gearboxTypeUsed || 'auto';
      setGearboxType(historyGearboxType);
      
      setSelectionResult(entry.selectionResult);
      
      setQuotation(null);
      setAgreement(null);
      setContract(null);
      
      setActiveTab('result');
      setLoading(false);
      setSuccess(`已成功加载历史选型数据 (ID: ${historyId})`);
    } else {
      setError('未找到指定的历史记录或历史记录无效');
      console.error("Failed to load history entry:", entry);
      setLoading(false);
    }
  }, [selectionHistory, setActiveTab]);

  // 添加缺失的历史记录删除函数
  const handleDeleteHistoryEntry = useCallback((historyId) => {
    if (window.confirm("确定要删除此历史记录吗？")) {
      setSelectionHistory(prev => {
        const filtered = prev.filter(entry => entry.id !== historyId);
        try {
          localStorage.setItem('selectionHistory', JSON.stringify(filtered));
          setSuccess('历史记录已成功删除');
          setError('');
        } catch (lsError) {
          console.error("无法更新LocalStorage中的历史记录:", lsError);
          setError('历史记录删除失败 (无法更新存储)');
        }
        return filtered;
      });
    }
  }, [setError, setSuccess]);

  // 修改后的选型处理函数 - 使用增强型联轴器选型
  const handleSelectGearbox = useCallback(() => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
        // 使用已计算的表单验证结果
        const validation = isFormValid(); // 直接调用 isFormValid
        if (!validation.isValid) { // 使用调用结果
            setError('请完成所有必填项，并确保数值有效');
            setLoading(false);
            return;
        }

        // 准备选型参数 - 添加详细日志
        const selectionParams = {
            power: parseFloat(engineData.power),
            speed: parseFloat(engineData.speed),
            targetRatio: parseFloat(requirementData.targetRatio),
            thrustRequirement: parseFloat(requirementData.thrustRequirement) || 0,
            gearboxType: gearboxType,
            application: requirementData.application
        };
        
        console.log("开始进行选型，参数:", selectionParams);

        // 执行选型算法
        let result;
        if (gearboxType === 'auto') {
            // 自动选型模式，传递完整选项
            result = autoSelectGearbox(
                {
                    motorPower: selectionParams.power,
                    motorSpeed: selectionParams.speed,
                    targetRatio: selectionParams.targetRatio,
                    thrust: selectionParams.thrustRequirement,
                    workCondition: requirementData.workCondition,
                    temperature: parseFloat(requirementData.temperature) || 30,
                    hasCover: requirementData.hasCover,
                    application: requirementData.application
                },
                appDataState
            );
        } else {
            // 指定系列选型模式
            result = selectGearbox(
                selectionParams.power,
                selectionParams.speed,
                selectionParams.targetRatio,
                selectionParams.thrustRequirement,
                gearboxType,
                appDataState,
                {
                    workCondition: requirementData.workCondition,
                    temperature: parseFloat(requirementData.temperature) || 30,
                    hasCover: requirementData.hasCover,
                    application: requirementData.application
                }
            );
        }

        // 记录原始选型结果
        console.log("原始选型结果:", result);

        // 如果没有联轴器选型结果，使用增强型联轴器选型
        if (result.success && result.recommendations && result.recommendations.length > 0 && !result.flexibleCoupling) {
            // 准备增强型联轴器选型参数
            const selectedGearbox = result.recommendations[0];
            const engineTorque = result.engineTorque || (selectionParams.power * 9550 / selectionParams.speed);
            
            try {
                console.log("使用增强型联轴器选型...");
                const enhancedCouplingResult = enhancedCouplingSelection(
                    {
                        success: true,
                        recommendations: [selectedGearbox],
                        engineTorque,
                        engineSpeed: selectionParams.speed
                    },
                    appDataState.flexibleCouplings,
                    {
                        workCondition: requirementData.workCondition,
                        temperature: parseFloat(requirementData.temperature) || 30,
                        hasCover: requirementData.hasCover
                    }
                );
                
                // 将增强型联轴器选型结果添加到选型结果中
                result.flexibleCoupling = enhancedCouplingResult;
                console.log("增强型联轴器选型结果:", enhancedCouplingResult);
            } catch (couplingError) {
                console.error("增强型联轴器选型失败:", couplingError);
                // 联轴器选型失败不影响整体选型结果
            }
        }

        // 处理特殊打包价格 - 检查结果中的齿轮箱是否适用特殊打包价格
        if (result.success && result.recommendations && result.recommendations.length > 0) {
            result.recommendations.forEach(gearbox => {
                const gwConfig = getGWPackagePriceConfig(gearbox.model);
                if (gwConfig && !gwConfig.isSmallGWModel) {
                    // 标记为特殊打包价格型号
                    gearbox.hasSpecialPackagePrice = true;
                    gearbox.gwPackageConfig = gwConfig;
                    gearbox.packagePrice = gwConfig.packagePrice;
                    gearbox.marketPrice = gwConfig.packagePrice;
                    console.log(`齿轮箱 ${gearbox.model} 适用GW系列特殊打包价格: ${gwConfig.packagePrice}`);
                }
            });
        }

        setSelectionResult(result);
        
        // 如果选型成功，处理推荐的齿轮箱
        if (result.success && result.recommendations && result.recommendations.length > 0) {
            // 自动选择第一个推荐项
            handleGearboxSelection(0);
            setActiveTab('result');
            
            // 检查首选齿轮箱是否有特殊打包价格
            const topRecommendation = result.recommendations[0];
            if (topRecommendation.hasSpecialPackagePrice) {
                setSuccess(`选型成功，已找到符合条件的齿轮箱。该型号采用市场常规打包价${topRecommendation.packagePrice.toLocaleString()}元。`);
            } else {
                setSuccess('选型成功，已找到符合条件的齿轮箱');
            }
            
            // 保存选型历史
            try {
                const historyEntry = {
                    id: Date.now().toString(),
                    timestamp: new Date().toISOString(),
                    selectionResult: result,
                    engineData: {...engineData},
                    requirementData: {...requirementData},
                    projectInfo: {...projectInfo},
                    gearboxType
                };
                
                setSelectionHistory(prev => {
                    const updatedHistory = [historyEntry, ...prev].slice(0, 20); // 限制历史记录数量
                    localStorage.setItem('selectionHistory', JSON.stringify(updatedHistory));
                    return updatedHistory;
                });
                
                console.log("选型结果已保存到历史记录");
            } catch (historyError) {
                console.warn("保存选型历史失败:", historyError);
            }
        } else {
            let errorMessage = result.message || '选型失败，未找到合适的齿轮箱';
            
            // 检查是否有近似匹配推荐
            if (result.recommendations && result.recommendations.length > 0) {
                // 显示近似匹配推荐的提示
                errorMessage += "。发现接近条件的齿轮箱，请查看结果选项卡。";
                setActiveTab('result'); // 自动切换到结果选项卡
                setSuccess('发现近似匹配的齿轮箱，但未找到完全符合条件的型号');
            } else {
                // 添加更详细的失败原因
                if (result.rejectionReasons) {
                    const reasons = Object.entries(result.rejectionReasons)
                        .filter(([_, count]) => count > 0)
                        .map(([reason, count]) => {
                            switch(reason) {
                                case 'speedRange': return `${count}个型号因转速范围不匹配被排除`;
                                case 'ratioOutOfRange': return `${count}个型号因减速比偏差过大被排除`;
                                case 'capacityTooLow': return `${count}个型号因传递能力不足被排除`;
                                case 'capacityTooHigh': return `${count}个型号因传递能力余量过大被排除`;
                                case 'thrustInsufficient': return `${count}个型号因推力不满足要求被排除`;
                                default: return `${reason}: ${count}`;
                            }
                        })
                        .join("；");
                    
                    if (reasons) {
                        errorMessage += `\n筛选情况：${reasons}`;
                    }
                }
                
                setError(errorMessage);
            }
        }
    } catch (error) {
        console.error('选型过程中发生错误:', error);
        setError('选型过程中发生错误: ' + error.message);
    } finally {
        setLoading(false);
    }
  }, [engineData, requirementData, gearboxType, appDataState, handleGearboxSelection, setActiveTab, isFormValid]); // <-- 确保 isFormValid 在依赖项中

  const inputStyles = useMemo(() => ({
    backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder,
    '::placeholder': { color: colors.muted },
  }), [colors]);

  const focusStyles = useMemo(() => ({
    '&:focus': { borderColor: colors.primary, boxShadow: `0 0 0 0.2rem ${colors.focusRing}` }
  }), [colors]);

  // 渲染报价单增强选项区域
  const renderQuotationEnhancedOptions = () => {
    if (!quotation || !quotation.success) return null;
    
    return (
      <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          报价单增强功能
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Button 
                variant="outline-primary" 
                className="w-100 mb-2"
                onClick={() => setShowCustomItemModal(true)}
              >
                <i className="bi bi-plus-circle me-2"></i> 添加自定义项目
              </Button>
            </Col>
            <Col md={6}>
              <Button 
                variant="outline-success" 
                className="w-100 mb-2"
                onClick={() => handleSaveQuotation()}
              >
                <i className="bi bi-save me-2"></i> 保存此报价单
              </Button>
            </Col>
            <Col md={6}>
              <Button 
                variant="outline-secondary" 
                className="w-100 mb-2"
                onClick={() => setShowQuotationHistoryModal(true)}
              >
                <i className="bi bi-clock-history me-2"></i> 查看保存的报价单
              </Button>
            </Col>
            <Col md={6}>
              <Button 
                variant="outline-info" 
                className="w-100 mb-2"
                onClick={() => handleUpdateQuotationPrices()}
              >
                <i className="bi bi-currency-exchange me-2"></i> 更新所有价格
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  if (location.pathname === '/users' || location.pathname === '/database' || location.pathname === '/login') {
    return null;
  }

  return (
    <Container fluid className="app-container" style={{ backgroundColor: colors.bg, color: colors.text }}>
      <Row className="mb-4 align-items-center">
        <Col>
         <h2 className="mb-0" style={{ color: colors.headerText }}>船用齿轮箱选型系统</h2>
          <p className="mb-0" style={{ color: colors.muted }}>自动选型、报价和技术协议生成</p>
        </Col>
        <Col xs="auto" className="d-flex align-items-center gap-2">
         {user && <span style={{ color: colors.muted, fontSize: '0.9em' }} className="me-2">用户: {user.username} ({user.role})</span>}
          {isAdmin && (
            <>
              <Button as={Link} to="/users" variant="outline-success" size="sm" title="管理用户">
                <i className="bi bi-people me-1"></i> 用户管理
              </Button>
              <Button as={Link} to="/database" variant="outline-success" size="sm" title="管理数据库">
                <i className="bi bi-database me-1"></i> 数据库管理
              </Button>
              <Button variant="outline-info" size="sm" onClick={() => setShowDiagnosticPanel(true)} title="系统诊断">
                <i className="bi bi-wrench-adjustable me-1"></i> 系统诊断
              </Button>
            </>
          )}
          <Button
            variant={theme === 'light' ? 'outline-secondary' : 'outline-light'}
            size="sm"
            onClick={toggleTheme}
            title={`切换${theme === 'light' ? '深色' : '浅色'}主题`}
            style={{ borderColor: colors.inputBorder, color: colors.muted }}
            className="theme-toggle-button"
          >
            <i className={`bi bi-${theme === 'light' ? 'moon-stars-fill' : 'sun-fill'} me-1`}></i>
          </Button>
          {user && (
            <Button variant="outline-danger" size="sm" onClick={logout} title="退出登录">
              <i className="bi bi-box-arrow-right me-1"></i> 退出
            </Button>
          )}
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert
              variant={error.includes('成功') ? 'success' : error.includes('警告') || error.includes('无法加载') || error.includes('注意') || error.includes('失败') || error.includes('错误') ? 'warning' : 'danger'}
              onClose={() => setError('')}
              dismissible={!loading}
              className={`app-alert alert-${theme}`}
            >
              {loading && <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />}
              {error}
            </Alert>
          </Col>
        </Row>
      )}
      
      {success && (
        <Row className="mb-4">
          <Col>
            <Alert
              variant="success"
              onClose={() => setSuccess('')}
              dismissible
              className={`app-alert alert-${theme}`}
            >
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </Alert>
          </Col>
        </Row>
      )}
      
       {loading && !error && !success && (
          <Row className="mb-4">
              <Col className="text-center">
                  <Spinner animation="border" variant="primary" />
                  <p className="mt-2" style={{ color: colors.text }}>正在执行操作...</p>
          </Col>
        </Row>
      )}

      {!appDataState || Object.keys(appDataState).length === 0 ? (
          <Row className="mb-4">
              <Col>
                  <Alert variant="info" className="text-center">
                      <i className="bi bi-info-circle me-2"></i> 系统数据正在加载中或加载失败。
                  </Alert>
              </Col>
          </Row>
      ) : (
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        style={{ borderBottomColor: colors.border }}
      >
          <Tab eventKey="input" title={<span><i className="bi bi-input-cursor-text me-1"></i>输入参数</span>}>
          <Row>
              <Col md={6}>
              <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
                 <i className="bi bi-sliders me-2"></i>发动机 & 要求
                </Card.Header>
                <Card.Body style={{ padding: '1.5rem' }}>
                  <Form>
                    <h6 style={{ color: colors.headerText }}>发动机参数</h6>
                    
                    <Form.Group className="mb-3" controlId="enginePower">
                      <Form.Label style={{ color: colors.text }}>主机功率 (kW) <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        value={engineData.power}
                        onChange={(e) => handleEngineDataChange({ power: e.target.value })}
                        placeholder="例如: 350"
                        min="1"
                        step="any"
                        required
                        style={{...inputStyles, ...focusStyles}}
                        className={`${getValidationClassName(getFieldValidationState('enginePower', engineData.power))}`}
                      />
                      <div className="form-feedback invalid">
                        请输入有效的主机功率 (大于0)
                      </div>
                      <div className="form-feedback warning">
                        功率值较大，请确认是否正确
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="engineSpeed">
                      <Form.Label style={{ color: colors.text }}>主机转速 (r/min) <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        value={engineData.speed}
                        onChange={(e) => handleEngineDataChange({ speed: e.target.value })}
                        placeholder="例如: 1800"
                        min="1"
                        step="any"
                        required
                        style={{...inputStyles, ...focusStyles}}
                        className={`${getValidationClassName(getFieldValidationState('engineSpeed', engineData.speed))}`}
                      />
                      <div className="form-feedback invalid">
                        请输入有效的主机转速 (大于0)
                      </div>
                      <div className="form-feedback warning">
                        转速值较高，请确认是否正确
                      </div>
                      <div className="field-info">
                        常见柴油机转速范围: 750-2200 r/min
                      </div>
                    </Form.Group>

                    <h6 style={{ color: colors.headerText }} className="mt-4">选型要求</h6>
                    <Form.Group className="mb-3" controlId="targetRatio">
                      <Form.Label style={{ color: colors.text }}>目标减速比 <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        value={requirementData.targetRatio}
                        onChange={(e) => handleRequirementDataChange({ targetRatio: e.target.value })}
                        placeholder="例如: 4.5"
                        min="0.1"
                        step="any"
                        required
                        style={{...inputStyles, ...focusStyles}}
                        className={`${getValidationClassName(getFieldValidationState('targetRatio', requirementData.targetRatio))}`}
                      />
                      <div className="form-feedback invalid">
                        请输入有效的目标减速比 (大于0)
                      </div>
                      <div className="form-feedback warning">
                        减速比较大，请确认是否正确
                      </div>
                      <div className="field-info">
                         常见减速比范围: 1.5-10
                      </div>  
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="thrustRequirement">
                      <Form.Label style={{ color: colors.text }}>推力要求 (kN, 可选)</Form.Label>
                      <Form.Control
                        type="number"
                        value={requirementData.thrustRequirement}
                        onChange={(e) => handleRequirementDataChange({ thrustRequirement: e.target.value })}
                        placeholder="留空则不强制匹配推力"
                        min="0"
                        step="any"
                        style={{...inputStyles, ...focusStyles}}
                        className={`${getValidationClassName(getFieldValidationState('thrustRequirement', requirementData.thrustRequirement))}`}
                      />
                      <div className="form-feedback invalid">
                        推力要求不能为负数
                      </div>
                      <div className="form-feedback warning">
                        推力值较大，请确认是否正确
                      </div>
                      <div className="field-info">
                        更高的推力要求会限制可选齿轮箱型号
                      </div>
                    </Form.Group>
                    
                    <Form.Group className="mb-3 work-condition-selector" controlId="workCondition">
                      <Form.Label style={{ color: colors.text }}>工作条件</Form.Label>
                      <Form.Select 
                        value={requirementData.workCondition} 
                        onChange={(e) => handleRequirementDataChange({ workCondition: e.target.value })}
                        style={{...inputStyles, ...focusStyles}}
                        aria-label="选择工作条件"
                      >
                        {workConditionOptions.map(option => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </Form.Select>
                      <div className="field-info">
                        工作条件影响联轴器选型，类别越高代表负载变化越大
                      </div>
                    </Form.Group>
                    </Form>		                  		
                </Card.Body>
              </Card>
            </Col>

              <Col md={6}>
              <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                 <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
                     <i className="bi bi-folder-fill me-2"></i>项目信息 & 选型设置
                 </Card.Header>
                 <Card.Body style={{ padding: '1.5rem' }}>
                    <Form>
                       <h6 style={{ color: colors.headerText }}>项目信息 (用于文档生成)</h6>
                       <Row>
                         <Col sm={6}>
                           <Form.Group className="mb-3" controlId="projectName">
                             <Form.Label style={{ color: colors.text }}>项目名称</Form.Label>
                             <Form.Control type="text" placeholder="例如: 38m渔船" value={projectInfo.projectName} onChange={(e) => handleProjectInfoChange({ projectName: e.target.value })} style={{...inputStyles, ...focusStyles}}/>
                           </Form.Group>
                         </Col>
                         <Col sm={6}>
                           <Form.Group className="mb-3" controlId="customerName">
                             <Form.Label style={{ color: colors.text }}>客户名称</Form.Label>
                             <Form.Control type="text" placeholder="例如: 舟山渔业公司" value={projectInfo.customerName} onChange={(e) => handleProjectInfoChange({ customerName: e.target.value })} style={{...inputStyles, ...focusStyles}}/>
                           </Form.Group>
                         </Col>
                         <Col sm={6}>
                           <Form.Group className="mb-3" controlId="engineModel">
                              <Form.Label style={{ color: colors.text }}>主机型号 (可选)</Form.Label>
                              <Form.Control
                                type="text"
                                value={projectInfo.engineModel}
                                onChange={(e) => handleProjectInfoChange({ engineModel: e.target.value })}
                                placeholder="例如: Weichai WP6"
                                style={{...inputStyles, ...focusStyles}}
                              />
                           </Form.Group>
                         </Col>
                         <Col sm={6}>
                            <Form.Group className="mb-3" controlId="contactPerson">
                                <Form.Label style={{ color: colors.text }}>联系人</Form.Label>
                                <Form.Control type="text" value={projectInfo.contactPerson} onChange={(e) => handleProjectInfoChange({ contactPerson: e.target.value })} style={{...inputStyles, ...focusStyles}}/>
                            </Form.Group>
                          </Col>
                          <Col sm={6}>
                              <Form.Group className="mb-3" controlId="contactPhone">
                                  <Form.Label style={{ color: colors.text }}>联系电话</Form.Label>
                                  <Form.Control type="tel" value={projectInfo.contactPhone} onChange={(e) => handleProjectInfoChange({ contactPhone: e.target.value })} style={{...inputStyles, ...focusStyles}}/>
                              </Form.Group>
                          </Col>
                       </Row>

                       <h6 style={{ color: colors.headerText }} className="mt-4">选型与配件设置</h6>
                       
                       <Form.Group className="mb-4" controlId="gearboxType">
                          <Form.Label style={{ color: colors.text, fontWeight: 500 }}>齿轮箱系列</Form.Label>
                          <div className="gearbox-type-selector">
                            <Button 
                              variant={gearboxType === 'auto' ? 'primary' : 'outline-primary'} 
                              onClick={() => handleGearboxTypeChange('auto')}
                            >
                              自动选择
                            </Button>
                            {appDataState?.hcGearboxes?.length > 0 && 
                              <Button 
                                variant={gearboxType === 'HC' ? 'primary' : 'outline-primary'} 
                                onClick={() => handleGearboxTypeChange('HC')}
                              >
                                HC系列
                              </Button>
                            }
                            {appDataState?.gwGearboxes?.length > 0 && 
                              <Button 
                                variant={gearboxType === 'GW' ? 'primary' : 'outline-primary'} 
                                onClick={() => handleGearboxTypeChange('GW')}
                              >
                                GW系列
                              </Button>
                            }
                            {appDataState?.hcmGearboxes?.length > 0 && 
                              <Button 
                                variant={gearboxType === 'HCM' ? 'primary' : 'outline-primary'} 
                                onClick={() => handleGearboxTypeChange('HCM')}
                              >
                                HCM系列
                              </Button>
                            }
                            {appDataState?.dtGearboxes?.length > 0 && 
                              <Button 
                                variant={gearboxType === 'DT' ? 'primary' : 'outline-primary'} 
                                onClick={() => handleGearboxTypeChange('DT')}
                              >
                                DT系列
                              </Button>
                            }
                            {appDataState?.hcqGearboxes?.length > 0 && 
                              <Button 
                                variant={gearboxType === 'HCQ' ? 'primary' : 'outline-primary'} 
                                onClick={() => handleGearboxTypeChange('HCQ')}
                              >
                                HCQ系列
                              </Button>
                            }
                            {appDataState?.gcGearboxes?.length > 0 && 
                              <Button 
                                variant={gearboxType === 'GC' ? 'primary' : 'outline-primary'} 
                                onClick={() => handleGearboxTypeChange('GC')}
                              >
                                GC系列
                              </Button>
                            }
                          </div>
                          <div className="field-info">
                            不同系列齿轮箱适合不同应用场景。自动选择会搜索所有系列找到最佳匹配。
                          </div>
                        </Form.Group>

                        <Row>
                          <Col sm={6}>
                      <Form.Group className="mb-3" controlId="temperature">
                      <Form.Label style={{ color: colors.text }}>工作温度 (°C)</Form.Label>
                              <Form.Control
                                type="number"
                                value={requirementData.temperature}
                                onChange={(e) => handleRequirementDataChange({ temperature: e.target.value })}
                                placeholder="默认 30"
                                step="1"
                                style={{...inputStyles, ...focusStyles}}
                                className={`${getValidationClassName(getFieldValidationState('temperature', requirementData.temperature))}`}
                              />
                              <div className="form-feedback invalid">
                                请输入有效的工作温度
                              </div>
                              <div className="form-feedback warning">
                                温度超出常规范围，请确认是否正确
                              </div>
                              <div className="field-info">
                                常规工作温度范围: -10°C ~ 50°C
                              </div>
                    </Form.Group>
                          </Col>
                        </Row>
                    <Form.Group className="mb-3" controlId="hasCover">
                          <Form.Check
                            type="checkbox"
                            label="联轴器需要带罩壳"
                            checked={requirementData.hasCover}
                            onChange={(e) => handleRequirementDataChange({ hasCover: e.target.checked })}
                            style={{ color: colors.text }}
                          />
                          <div className="field-info">
                            带罩壳联轴器有更好的保护效果，但价格更高
                          </div>
                    </Form.Group>

                        <Form.Group className="mb-3" controlId="application">
                          <Form.Label style={{ color: colors.text }}>应用场景</Form.Label>
                          <Form.Select
                            value={requirementData.application}
                            onChange={(e) => handleRequirementDataChange({ application: e.target.value })}
                            style={{...inputStyles, ...focusStyles}}
                            aria-label="选择应用场景"
                          >
                            {applicationOptions.map(option => (
                             <option key={option.value} value={option.value}>{option.label}</option>
                            ))}
                           </Form.Select>
                           <Form.Text style={{ color: colors.muted }}>影响服务系数和选型策略</Form.Text>
                          </Form.Group>

                        <div className="d-grid mt-4">
                          <Button
                            variant="primary"
                            onClick={handleSelectGearbox}
                            disabled={loading || !isFormValid().isValid || !appDataState || Object.keys(appDataState).length === 0} // 直接调用 isFormValid().isValid
                            style={{
                              backgroundColor: colors.primary,
                              borderColor: colors.primary,
                              color: colors.primaryText
                            }}
                            className="btn-lg"
                          >
                            {loading ? (
                              <>
                                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                                选型中...
                              </>
                            ) : (
                              <>
                               <i className="bi bi-calculator-fill me-2"></i>
                               开始选型
                              </>
                            )}
                          </Button>
                        </div>
                   </Form>
                 </Card.Body>
               </Card>
            </Col>
          </Row>
       </Tab>

          <Tab eventKey="result" title={<span><i className="bi bi-graph-up me-1"></i>选型结果</span>} disabled={!selectionResult}>
            {selectionResult ? (
              <Row>
                <Col>
                  <EnhancedGearboxSelectionResult
                    result={selectionResult}
                    selectedIndex={selectedGearboxIndex}
                    onSelectGearbox={handleGearboxSelection}
                    onGenerateQuotation={handleGenerateQuotation}
                    onGenerateAgreement={handleGenerateAgreement}
                    colors={colors}
                    theme={theme}
                  />
                  
                  {/* 联轴器选型结果 - 使用修改后的组件，传递onSelectCoupling参数 */}
                  <CouplingSelectionResultComponent
                    couplingResult={selectionResult?.flexibleCoupling}
                    engineTorque={selectionResult?.engineTorque}
                    workCondition={requirementData.workCondition}
                    temperature={requirementData.temperature}
                    hasCover={requirementData.hasCover}
                    onReset={() => handleSelectGearbox()}
                    onSelectCoupling={handleCouplingSelection} /* 添加联轴器选择函数 */
                    colors={colors}
                    theme={theme}
                  />
                </Col>
              </Row>
            ) : (
              <Alert variant="info" className="text-center">
                <i className="bi bi-info-circle me-2"></i>请先输入参数并执行选型
              </Alert>
            )}
          </Tab>

          <Tab eventKey="quotation" title={<span><i className="bi bi-currency-yen me-1"></i>报价单</span>} disabled={!quotation}>
              {quotation && (
                  <Row>
                      <Col>
                        {/* 增强选项区域 */}
                        {renderQuotationEnhancedOptions()}
                        
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
                      </Col>
                  </Row>
              )}
        </Tab>

          <Tab eventKey="agreement" title={<span><i className="bi bi-file-earmark-text me-1"></i>技术协议</span>} disabled={!selectionResult}>
            {selectionResult && (
              <Row>
                <Col>
                  <TechnicalAgreementView
                    selectionResult={selectionResult}
                    projectInfo={projectInfo}
                    selectedComponents={selectedComponents}
                    colors={colors}
                    theme={theme}
                    onNavigateToQuotation={() => setActiveTab('quotation')}
                    onNavigateToContract={() => handleGenerateContract()}
                  />
                </Col>
              </Row>
            )}
          </Tab>

          <Tab eventKey="contract" title={<span><i className="bi bi-file-earmark-ruled me-1"></i>销售合同</span>} disabled={!contract}>
            {contract && (
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
                      <ContractView
                        contract={contract}
                        onExportWord={() => handleExportContract('word')}
                        onExportPDF={() => handleExportContract('pdf')}
                        theme={theme}
                        colors={colors}
                       />
                      </Card.Body>
                      </Card>
                  </Col>
                </Row>
              )}
          </Tab>

          <Tab eventKey="query" title={<span><i className="bi bi-search me-1"></i>数据查询</span>}>
            <Row>
              <Col>
                <DataQuery
                  appData={appDataState}
                  theme={theme}
                  colors={colors}
                />
              </Col>
            </Row>
          </Tab>

          <Tab eventKey="history" title={<span><i className="bi bi-clock-history me-1"></i>选型历史</span>}>
            <Row>
              <Col>
                <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                  <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>选型历史记录</Card.Header>
                  <Card.Body>
                    {selectionHistory.length > 0 ? (
                      <ListGroup variant="flush">
                        {selectionHistory.map(entry => (
                          <ListGroup.Item key={entry.id} className="d-flex justify-content-between align-items-center" style={{ backgroundColor: 'transparent', color: colors.text, borderColor: colors.border }}>
                            <div>
                              <span className="fw-bold me-2">{entry.projectInfo?.projectName || '未命名项目'}</span>
                              <small className="text-muted">{new Date(entry.timestamp).toLocaleString()}</small>
                              <br />
                              <small style={{ color: colors.muted }}>
                                {entry.engineData?.power}kW / {entry.engineData?.speed}rpm / Ratio {entry.requirementData?.targetRatio}
                                {entry.selectionResult?.recommendations?.[0] ? ` -> ${entry.selectionResult.recommendations[0].model}` : ''}
                              </small>
                            </div>
                            <div>
                             <Button key={`${entry.id}-load`} variant="outline-primary" size="sm" className="me-2" onClick={() => handleLoadHistoryEntry(entry.id)}>
                                <i className="bi bi-box-arrow-up-left me-1"></i> 加载
                             </Button>
                             <Button key={`${entry.id}-delete`} variant="outline-danger" size="sm" onClick={() => handleDeleteHistoryEntry(entry.id)}>
                                <i className="bi bi-trash me-1"></i> 删除
                              </Button>
                            </div>
                          </ListGroup.Item>
                        ))}
                      </ListGroup>
                    ) : (
                     <p style={{ color: colors.muted }}>没有历史记录</p>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
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
      )}

      {/* 报价选项对话框 */}
      {showQuotationOptions && (
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
      )}

      {/* 自定义报价项目对话框 */}
      {showCustomItemModal && (
        <CustomQuotationItemModal
          show={showCustomItemModal}
          onHide={() => setShowCustomItemModal(false)}
          onAdd={handleAddCustomQuotationItem}
          existingItems={quotation?.items || []}
          colors={colors}
          theme={theme}
		 />
      )}

      {/* 保存的报价单历史对话框 */}
      {showQuotationHistoryModal && (
        <QuotationHistoryModal
          show={showQuotationHistoryModal}
          onHide={() => setShowQuotationHistoryModal(false)}
          onLoad={handleLoadSavedQuotation}
          onCompare={handleCompareQuotations}
          colors={colors}
          theme={theme}
        />
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
    </Container>
  );
}

export default App;