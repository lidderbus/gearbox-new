// src/App.js - Main Application Component
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Tab, Tabs, Alert, Spinner, Modal, Badge, ListGroup } from 'react-bootstrap';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { userRoles, permissions } from './auth/roles';
import './styles/global.css';
import QuotationOptionsModal from './components/QuotationOptionsModal';
// import { ThemeProvider, createTheme } from '@mui/material/styles'; // Material UI not used directly here
// import { initialData } from './data/initialData'; // initialData is handled in repair.js now
// import { adaptEnhancedData } from './utils/dataAdapter'; // adaptEnhancedData is used in repair.js

// 导入数据修复工具
import { correctDatabase } from './utils/dataCorrector'; // correctDatabase is still used in DatabaseManagementView

// 导入选型结果组件
import GearboxSelectionResult from './components/GearboxSelectionResult';

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
// import ProtectedRoute from './components/ProtectedRoute'; // ProtectedRoute is handled in AppContent now
import DiagnosticPanel from './components/DiagnosticPanel'; // 引入诊断面板组件

// Utils and API functions
import { selectGearbox, autoSelectGearbox } from './utils/selectionAlgorithm';
import { selectFlexibleCoupling, selectStandbyPump } from './utils/couplingSelection';
import { generateQuotation, exportQuotationToExcel, exportQuotationToPDF } from './utils/quotationGenerator';
import { generateAgreement, exportAgreementToWord, exportAgreementToPDFFormat } from './utils/agreementGenerator';
import { generateContract, exportContractToWord, exportContractToPDF } from './utils/contractGenerator';
import { getCouplingSpecifications } from './data/gearboxMatchingMaps';

// 数据持久化键名 (Still relevant for history/user settings)
const STORAGE_KEY = 'gearbox_app_data';

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
  const [success, setSuccess] = useState(''); // 添加成功消息状态
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

  const [packagePrice, setPackagePrice] = useState(0);
  const [marketPrice, setMarketPrice] = useState(0);
  const [totalMarketPrice, setTotalMarketPrice] = useState(0);
  const [showBatchPriceAdjustment, setShowBatchPriceAdjustment] = useState(false);
  const [showQuotationOptions, setShowQuotationOptions] = useState(false);

  const [showDiagnosticPanel, setShowDiagnosticPanel] = useState(false);

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

  useEffect(() => {
    if (selectionResult && selectionResult.success && Array.isArray(selectionResult.recommendations) && selectionResult.recommendations.length > 0) {
      console.log("New selection result received, updating components...");
      setSelectedGearboxIndex(0);
      const firstGearbox = { ...selectionResult.recommendations[0] };
      const firstCouplingResult = selectionResult.flexibleCoupling;
      const firstPumpResult = selectionResult.standbyPump;

      const currentGearbox = correctPriceData(firstGearbox);

      const currentCoupling = firstCouplingResult?.success ? correctPriceData({ ...firstCouplingResult }) : null;

      const currentPump = firstPumpResult?.success ? correctPriceData({ ...firstPumpResult }) : null;

      setSelectedComponents({
        gearbox: currentGearbox,
        coupling: currentCoupling,
        pump: currentPump
      });

      const calcPackagePrice = calculatePackagePrice(currentGearbox, currentCoupling, currentPump);
      setPackagePrice(calcPackagePrice);

      const initialMarketPrice = calculateMarketPrice(currentGearbox, calcPackagePrice);
      setMarketPrice(initialMarketPrice);
      setTotalMarketPrice(initialMarketPrice);

      console.log("Selected Components Updated:", {
        gearbox: currentGearbox?.model,
        coupling: currentCoupling?.model,
        pump: currentPump?.model
      });
      console.log("Prices Updated:", {
        packagePrice: calcPackagePrice,
        marketPrice: initialMarketPrice,
        totalMarketPrice: initialMarketPrice
      });
    } else if (selectionResult && !selectionResult.success) {
      console.log("Selection failed, clearing components and prices.");
      setSelectedGearboxIndex(0);
      setSelectedComponents({ gearbox: null, coupling: null, pump: null });
      setPackagePrice(0);
      setMarketPrice(0);
      setTotalMarketPrice(0);
    }
  }, [selectionResult]);

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

  const handlePriceChange = useCallback((component, field, value) => {
    if (value === '') {
      setSelectedComponents(prev => ({
        ...prev,
        [component]: { ...prev[component], [field]: undefined }
      }));
       if (field === 'basePrice' || field === 'factoryPrice' || field === 'marketPrice' || field === 'discountRate') {
       }
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

      const newComponents = { ...prev, [component]: updatedComponent };

      const newPackagePrice = calculatePackagePrice(newComponents.gearbox, newComponents.coupling, newComponents.pump);
      setPackagePrice(newPackagePrice);

      let newMarketPrice;
      if (component === 'gearbox' && (field === 'basePrice' || field === 'discountRate' || field === 'factoryPrice' || field === 'marketPrice')) {
           newMarketPrice = calculateMarketPrice(newComponents.gearbox, newPackagePrice);
           setMarketPrice(newMarketPrice);
           setTotalMarketPrice(newMarketPrice);
      } else {
             const updatedGearbox = newComponents.gearbox ? correctPriceData(newComponents.gearbox) : null;
             const updatedCoupling = newComponents.coupling ? correctPriceData(newComponents.coupling) : null;
             const updatedPump = newComponents.pump ? correctPriceData(newComponents.pump) : null;

             setMarketPrice(updatedGearbox?.marketPrice || 0);
             setTotalMarketPrice((updatedGearbox?.marketPrice || 0) + (updatedCoupling?.marketPrice || 0) + (updatedPump?.marketPrice || 0));
      }

      console.log("价格变更后更新组件:", newComponents);
      return newComponents;
    });

    setQuotation(null);
    setAgreement(null);
    setContract(null);
  }, []);

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

  // 修改后的 handleGearboxSelection 函数
  const handleGearboxSelection = useCallback((index) => {
    if (!selectionResult || !Array.isArray(selectionResult.recommendations) || !selectionResult.recommendations[index]) {
        console.error("Cannot select gearbox, invalid state or index:", index, selectionResult);
        setError("无法选择齿轮箱，内部状态错误。");
        return;
    }

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

    const engineTorque = selectionResult.engineTorque;

     if (!appDataState || !Array.isArray(appDataState.flexibleCouplings) || !Array.isArray(appDataState.standbyPumps)) {
       setError("数据加载不完整，无法选择配件。");
       console.error("Missing data for coupling/pump selection:", appDataState);
       return;
     }

    // 获取或重新选择联轴器和备用泵
    let updatedCouplingResult, updatedPumpResult;
    
    // 如果选型结果中已经有配件信息，优先使用
    if (index === 0 && selectionResult.flexibleCoupling) {
        updatedCouplingResult = selectionResult.flexibleCoupling;
    } else {
        // 为选定齿轮箱重新选择联轴器
        updatedCouplingResult = selectFlexibleCoupling(
          engineTorque,
          correctedGearbox.model,
          appDataState.flexibleCouplings,
          getCouplingSpecifications,
          requirementData.workCondition,
          parseFloat(requirementData.temperature) || 30,
          requirementData.hasCover,
          selectionResult.engineSpeed || parseFloat(engineData.speed)
        );
    }

    if (index === 0 && selectionResult.standbyPump) {
        updatedPumpResult = selectionResult.standbyPump;
    } else {
        updatedPumpResult = selectStandbyPump(
          correctedGearbox.model,
          appDataState.standbyPumps
        );
    }

    const currentCoupling = updatedCouplingResult?.success ? correctPriceData({ ...updatedCouplingResult }) : null;

    const currentPump = updatedPumpResult?.success ? correctPriceData({ ...updatedPumpResult }) : null;

    setSelectedComponents({
      gearbox: correctedGearbox,
      coupling: currentCoupling,
      pump: currentPump
    });

    const newPackagePrice = calculatePackagePrice(correctedGearbox, currentCoupling, currentPump);
    setPackagePrice(newPackagePrice);

    const newMarketPrice = calculateMarketPrice(correctedGearbox, newPackagePrice);
    setMarketPrice(newMarketPrice);

     const totalMarket = (correctedGearbox?.marketPrice || 0) + (currentCoupling?.marketPrice || 0) + (currentPump?.marketPrice || 0);
     setTotalMarketPrice(totalMarket);


    console.log("Selected Components Updated:", {
        gearbox: correctedGearbox?.model,
        coupling: currentCoupling?.model,
        pump: currentPump?.model
      });
      console.log("Prices Updated:", {
        packagePrice: newPackagePrice,
        marketPrice: newMarketPrice,
        totalMarketPrice: totalMarket
      });


    setQuotation(null);
    setAgreement(null);
    setContract(null);
    setActiveTab('result');
  }, [selectionResult, appDataState, requirementData, engineData, setActiveTab]);

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

  // 添加新的生成报价单处理函数，接受选项参数
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

      console.log("准备生成报价单，组件:", {
        gearbox: finalComponents.gearbox?.model,
        coupling: finalComponents.coupling?.model,
        pump: finalComponents.pump?.model,
        options
      });

      // 计算价格
      const currentPackagePrice = calculatePackagePrice(finalComponents.gearbox, finalComponents.coupling, finalComponents.pump);
      const currentMarketPrice = calculateMarketPrice(finalComponents.gearbox, currentPackagePrice);
      const currentTotalMarketPrice = (finalComponents.gearbox?.marketPrice || 0) + 
                                     (finalComponents.coupling?.marketPrice || 0) + 
                                     (finalComponents.pump?.marketPrice || 0);

      console.log("报价单价格信息:", {
        packagePrice: currentPackagePrice,
        marketPrice: currentMarketPrice,
        totalMarketPrice: currentTotalMarketPrice,
        componentPrices: {
          gearbox: finalComponents.gearbox ? {
            basePrice: finalComponents.gearbox.basePrice,
            factoryPrice: finalComponents.gearbox.factoryPrice,
            marketPrice: finalComponents.gearbox.marketPrice
          } : null,
          coupling: finalComponents.coupling ? {
            basePrice: finalComponents.coupling.basePrice,
            factoryPrice: finalComponents.coupling.factoryPrice,
            marketPrice: finalComponents.coupling.marketPrice
          } : null,
          pump: finalComponents.pump ? {
            basePrice: finalComponents.pump.basePrice,
            factoryPrice: finalComponents.pump.factoryPrice,
            marketPrice: finalComponents.pump.marketPrice
          } : null
        }
      });

      // 确保每个组件都有明确的价格数据，即使组件不存在，也传入null
      const quotationData = generateQuotation(
        selectionResult,
        projectInfo,
        finalComponents,
        {
          packagePrice: currentPackagePrice,
          marketPrice: currentMarketPrice,
          totalMarketPrice: currentTotalMarketPrice,
          componentPrices: {
             gearbox: finalComponents.gearbox ? {
                factoryPrice: finalComponents.gearbox.factoryPrice,
                marketPrice: finalComponents.gearbox.marketPrice,
                basePrice: finalComponents.gearbox.basePrice || finalComponents.gearbox.price
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
          }
        },
        options // 传递报价单选项
      );

      // 记录生成的报价单
      console.log("生成的报价单:", {
        success: quotationData.success,
        items: quotationData.items?.length,
        options: quotationData.options
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
  }, [selectedComponents, selectionResult, projectInfo, setActiveTab]);

  const handleExportQuotation = useCallback((format) => {
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
        exportQuotationToExcel(quotation, filename);
        setSuccess('报价单已导出为Excel格式');
      } else if (format === 'pdf') {
        exportQuotationToPDF(quotation, filename);
        setSuccess('报价单已导出为PDF格式');
      } else {
          setError('不支持的导出格式');
      }
    } catch (error) {
      console.error("导出报价单错误:", error);
      setError('导出报价单失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [quotation, projectInfo.projectName]);

  const handleGenerateAgreement = useCallback(() => {
     if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
      return;
    }
     if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成技术协议。');
      return;
    }
    setLoading(true);
    setError('');
    setSuccess('正在生成技术协议...');
    try {
      const agreementData = generateAgreement(
        selectionResult,
        projectInfo,
        selectedComponents
      );
      setAgreement(agreementData);
      setActiveTab('agreement');
      setSuccess('技术协议生成成功');
    } catch (error) {
       console.error("生成技术协议错误:", error);
      setError('生成技术协议失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedComponents, selectionResult, projectInfo]);

  const handleExportAgreement = useCallback((format) => {
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
        exportAgreementToPDFFormat(agreement, filename);
        setSuccess('技术协议已导出为PDF格式');
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

  // 添加缺失的合同生成函数
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
      const contractPackagePrice = quotation?.summary?.packagePrice ?? packagePrice;
      const contractMarketPrice = quotation?.summary?.marketPrice ?? marketPrice;
      const contractTotalMarketPrice = quotation?.summary?.totalMarketPrice ?? totalMarketPrice;

      const contractData = generateContract(
        selectionResult,
        projectInfo,
        selectedComponents,
        {
          packagePrice: contractPackagePrice,
          marketPrice: contractMarketPrice,
          totalMarketPrice: contractTotalMarketPrice,
          quotationDetails: quotation
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
  }, [selectedComponents, selectionResult, projectInfo, quotation, packagePrice, marketPrice, totalMarketPrice, setActiveTab, setContract, setError, setLoading, setSuccess]);

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
      } else if (format === 'pdf') {
        await exportContractToPDF(contract, filename);
        setSuccess('销售合同已导出为PDF格式');
      } else {
        setError('不支持的导出格式');
      }
    } catch (error) {
      console.error("导出销售合同错误:", error);
      setError('导出销售合同失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [contract, projectInfo.projectName, setError, setLoading, setSuccess]);

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
  }, [selectionHistory, setActiveTab, setAgreement, setContract, setEngineData, setError, setGearboxType, setLoading, setProjectInfo, setQuotation, setRequirementData, setSelectionResult, setSuccess]);

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
  }, [setError, setSelectionHistory, setSuccess]);

  // 增强的表单验证函数
  const isFormValid = useCallback(() => {
    // 基本验证：检查必填字段是否有值且为合法数字
    const powerValid = engineData.power !== '' && !isNaN(parseFloat(engineData.power)) && parseFloat(engineData.power) > 0;
    const speedValid = engineData.speed !== '' && !isNaN(parseFloat(engineData.speed)) && parseFloat(engineData.speed) > 0;
    const ratioValid = requirementData.targetRatio !== '' && !isNaN(parseFloat(requirementData.targetRatio)) && parseFloat(requirementData.targetRatio) > 0;
    const thrustValid = requirementData.thrustRequirement === '' || (!isNaN(parseFloat(requirementData.thrustRequirement)) && parseFloat(requirementData.thrustRequirement) >= 0);
    const tempValid = requirementData.temperature === '' || !isNaN(parseFloat(requirementData.temperature));

    // 增强验证：检查数值范围是否合理
    let validationErrors = [];
    if (powerValid && parseFloat(engineData.power) > 10000) {
        validationErrors.push('主机功率超过 10000kW，请确认是否正确');
    }
    
    if (speedValid && parseFloat(engineData.speed) > 3500) {
        validationErrors.push('主机转速超过 3500rpm，请确认是否正确');
    }
    
    if (ratioValid && parseFloat(requirementData.targetRatio) > 20) {
        validationErrors.push('目标减速比超过 20，请确认是否正确');
    }
    
    if (thrustValid && requirementData.thrustRequirement !== '' && parseFloat(requirementData.thrustRequirement) > 1000) {
        validationErrors.push('推力要求超过 1000kN，请确认是否正确');
    }
    
    if (tempValid && requirementData.temperature !== '' && (parseFloat(requirementData.temperature) < -20 || parseFloat(requirementData.temperature) > 80)) {
        validationErrors.push('工作温度超出正常范围 (-20°C ~ 80°C)，请确认是否正确');
    }
    
    return {
      isValid: powerValid && speedValid && ratioValid && thrustValid && tempValid,
      validationErrors
    };
  }, [engineData.power, engineData.speed, requirementData.targetRatio, requirementData.thrustRequirement, requirementData.temperature]);

  // 使用useMemo存储表单验证结果，避免在渲染过程中调用函数
  const formValidation = useMemo(() => isFormValid(), [isFormValid]);
  
  // 在effect中处理错误消息
  useEffect(() => {
    if (formValidation.validationErrors.length > 0 && formValidation.isValid) {
      setError('警告: ' + formValidation.validationErrors.join('; ') + '。如确认无误，仍可进行选型。');
    } else if (formValidation.isValid) {
      setError(''); // 如果表单有效且没有警告，清除错误消息
    }
  }, [formValidation]);

  // 字段验证状态函数
  const getFieldValidationState = (fieldName, value) => {
    if (value === '') return null; // 未填写的字段不显示验证状态
    
    switch (fieldName) {
        case 'enginePower':
            return !isNaN(parseFloat(value)) && parseFloat(value) > 0 
                ? (parseFloat(value) <= 10000 ? 'valid' : 'warning') 
                : 'invalid';
        
        case 'engineSpeed':
            return !isNaN(parseFloat(value)) && parseFloat(value) > 0 
                ? (parseFloat(value) <= 3500 ? 'valid' : 'warning') 
                : 'invalid';
        
        case 'targetRatio':
            return !isNaN(parseFloat(value)) && parseFloat(value) > 0 
                ? (parseFloat(value) <= 20 ? 'valid' : 'warning') 
                : 'invalid';
        
        case 'thrustRequirement':
            return value === '' || (!isNaN(parseFloat(value)) && parseFloat(value) >= 0)
                ? (value === '' || parseFloat(value) <= 1000 ? 'valid' : 'warning')
                : 'invalid';
        
        case 'temperature':
            return value === '' || !isNaN(parseFloat(value))
                ? (value === '' || (parseFloat(value) >= -20 && parseFloat(value) <= 80) ? 'valid' : 'warning')
                : 'invalid';
        
        default:
            return 'valid';
    }
  };

  // 获取验证状态对应的样式类名
  const getValidationClassName = (state) => {
    if (!state) return '';
    switch (state) {
        case 'valid': return 'is-valid';
        case 'invalid': return 'is-invalid';
        case 'warning': return 'is-warning'; // 需要在CSS中定义此类
        default: return '';
    }
  };

  // 获取验证状态对应的反馈信息
  const getValidationFeedback = (fieldName, value) => {
    if (value === '') return '';
    const state = getFieldValidationState(fieldName, value);
    
    if (state === 'invalid') {
        switch (fieldName) {
            case 'enginePower':
                return '请输入有效的主机功率（大于0）';
            case 'engineSpeed':
                return '请输入有效的主机转速（大于0）';
            case 'targetRatio':
                return '请输入有效的目标减速比（大于0）';
            case 'thrustRequirement':
                return '推力要求必须为正数或留空';
            case 'temperature':
                return '请输入有效的温度值';
            default:
                return '输入值无效';
        }
    } else if (state === 'warning') {
        switch (fieldName) {
            case 'enginePower':
                return '功率值较大，请确认是否正确';
            case 'engineSpeed':
                return '转速值较高，请确认是否正确';
            case 'targetRatio':
                return '减速比较大，请确认是否正确';
            case 'thrustRequirement':
                return '推力值较大，请确认是否正确';
            case 'temperature':
                return '温度超出常规范围，请确认是否正确';
            default:
                return '输入值超出常规范围';
        }
    }
    
    return '';
  };

  // 修改后的选型处理函数
  const handleSelectGearbox = useCallback(() => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
        // 使用已计算的表单验证结果
        if (!formValidation.isValid) {
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
            // 自动选型模式
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

        setSelectionResult(result);
        
        // 如果选型成功，处理推荐的齿轮箱
        if (result.success && result.recommendations && result.recommendations.length > 0) {
            // 自动选择第一个推荐项
            handleGearboxSelection(0);
            setActiveTab('result');
            setSuccess('选型成功，已找到符合条件的齿轮箱');
            
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
  }, [engineData, requirementData, gearboxType, appDataState, isAdmin, handleGearboxSelection, setActiveTab, formValidation]);

  const inputStyles = useMemo(() => ({
    backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder,
    '::placeholder': { color: colors.muted },
  }), [colors]);

   const focusStyles = useMemo(() => ({
     '&:focus': { borderColor: colors.primary, boxShadow: `0 0 0 0.2rem ${colors.focusRing}` }
   }), [colors]);

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
       {loading && !error && (
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
                        disabled={loading || !formValidation.isValid || !appDataState || Object.keys(appDataState).length === 0}
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
                      
                      {success && (
                        <div className="alert alert-success mt-3">
                          <i className="bi bi-check-circle-fill me-2"></i>
                          {success}
                        </div>
                      )}
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
                  <GearboxSelectionResult
                    result={selectionResult}
                    selectedIndex={selectedGearboxIndex}
                    onSelectGearbox={handleGearboxSelection}
                    onGenerateQuotation={handleGenerateQuotation}
                    onGenerateAgreement={handleGenerateAgreement}
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
                          <QuotationView
                            quotation={quotation}
                            onExport={handleExportQuotation}
                            onGenerateAgreement={handleGenerateAgreement}
                            colors={colors}
                            theme={theme}
                           />
                      </Col>
                  </Row>
              )}
        </Tab>

          <Tab eventKey="agreement" title={<span><i className="bi bi-file-earmark-text me-1"></i>技术协议</span>} disabled={!agreement}>
             {agreement && (
                 <Row>
                     <Col>
                        <AgreementView
                          agreement={agreement}
                          onExport={handleExportAgreement}
                          onGenerateContract={handleGenerateContract}
                          colors={colors}
                          theme={theme}
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


      <BatchPriceAdjustment
        show={showBatchPriceAdjustment}
        onHide={() => setShowBatchPriceAdjustment(false)}
        onApply={handleBatchPriceAdjustment}
        theme={theme}
        colors={colors}
      />

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
	  {showQuotationOptions && (
  <QuotationOptionsModal
    show={showQuotationOptions}
    onHide={() => setShowQuotationOptions(false)}
    onApply={generateQuotationWithOptions}
    selectedComponents={selectedComponents}
    colors={colors}
    theme={theme}
  />
)}
    </Container>
  );
}

export default App;