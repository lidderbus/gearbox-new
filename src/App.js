// App.js - Main Application Component
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Row, Col, Form, Button, Card, Table, Tab, Tabs, Alert, Spinner } from 'react-bootstrap';
import { Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { userRoles, permissions } from './auth/roles';
import './styles/global.css';

// Custom Components
import LoginPage from './components/LoginPage';
import UserManagementView from './components/UserManagementView';
import DatabaseManagementView from './components/DatabaseManagementView';
import QuotationView from './components/QuotationView';
import AgreementView from './components/AgreementView';
import ContractView from './components/ContractView';
import GearboxComparisonView from './components/GearboxComparisonView';
import PriceCalculator from './components/PriceCalculator';
import BatchPriceAdjustment from './components/BatchPriceAdjustment';
import DataQuery from './components/DataQuery';
import ProtectedRoute from './components/ProtectedRoute';

// Utils and API functions
import { selectGearbox, selectFlexibleCoupling, selectStandbyPump, autoSelectGearbox } from './utils/selectionAlgorithm';
import { generateQuotation, exportQuotationToExcel, exportQuotationToPDF } from './utils/quotationGenerator';
import { generateAgreement, exportAgreementToWord, exportAgreementToPDFFormat } from './utils/agreementGenerator';
import { generateContract, exportContractToWord, exportContractToPDF } from './utils/contractGenerator';
import { calculateFactoryPrice, calculatePackagePrice, getDiscountRate, calculateMarketPrice } from './utils/priceDiscount';
import { adaptEnhancedData } from './utils/dataAdapter';

// Ensure all gearbox data collections exist
const ensureDataCollections = (data) => {
  const collections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'
  ];

  const updatedData = { ...data };

  collections.forEach(collection => {
    if (!updatedData[collection] || !Array.isArray(updatedData[collection])) {
      updatedData[collection] = [];
      console.log(`初始化空数组: ${collection}`);
    }
  });

  // Add default data if collections are empty (Example - adjust as needed)
  if (updatedData.hcGearboxes && updatedData.hcGearboxes.length === 0) {
      updatedData.hcGearboxes = [{ model: "HC138", inputSpeedRange: [750, 2500], ratios: [2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0, 6.5, 7.0], transferCapacity: [0.06, 0.06, 0.06, 0.06, 0.055, 0.05, 0.045, 0.04, 0.035, 0.03, 0.025], thrust: 12, centerDistance: 138, weight: 95, price: 15000 }];
      console.log('添加默认HC齿轮箱数据');
  }
  if (updatedData.flexibleCouplings && updatedData.flexibleCouplings.length === 0) {
      // Use data from flexibleCouplings.js if available, otherwise provide defaults
      updatedData.flexibleCouplings = [{ model: "HGTHT4", torque: 4.0, maxSpeed: 2400, weight: 90, price: 16500 }];
      console.log('添加默认联轴器数据');
  }
   if (updatedData.standbyPumps && updatedData.standbyPumps.length === 0) {
      updatedData.standbyPumps = [{ model: "2CY7.5/2.5D", flow: 7.5, pressure: 2.5, weight: 50, price: 8000 }];
      console.log('添加默认备用泵数据');
  }
  // Add default data for other types if needed...
  if (updatedData.hcqGearboxes.length === 0) {
    updatedData.hcqGearboxes = [{
      model: "HCQ400",
      inputSpeedRange: [1200, 2500],
      ratios: [4.0, 4.5, 5.0],
      transferCapacity: [0.14, 0.13, 0.12],
      thrust: 55,
      centerDistance: 400,
      weight: 650,
      price: 65000,
      controlType: "电控"
    }];
    console.log('添加默认HCQ齿轮箱数据');
  }

  if (updatedData.gcGearboxes.length === 0) {
    updatedData.gcGearboxes = [{
      model: "GC500",
      inputSpeedRange: [1000, 2200],
      ratios: [4.5, 5.0, 5.5],
      transferCapacity: [0.18, 0.17, 0.16],
      thrust: 70,
      centerDistance: 500,
      weight: 950,
      price: 85000,
      controlType: "气控/电控"
    }];
    console.log('添加默认GC齿轮箱数据');
  }

  return updatedData;
};

// Main App Component
function App({ appData: initialAppData, setAppData }) {
  // Auth context for user authentication
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  // State management with useCallback for handlers
  const [appData, setAppDataState] = useState(() => ensureDataCollections(initialAppData || {}));
  const [engineData, setEngineData] = useState({ power: '', speed: '' });
  const [requirementData, setRequirementData] = useState({
    targetRatio: '',
    thrustRequirement: '',
    workCondition: "III类:扭矩变化中等", // Default coupling work condition
    temperature: "30",             // Default coupling temperature
    hasCover: false,               // Default coupling cover state
    application: 'propulsion'      // Default application scenario
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
  const [gearboxType, setGearboxType] = useState('auto'); // Default to auto selection
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectionResult, setSelectionResult] = useState(null); // Stores the complete result object from selection algorithm
  const [quotation, setQuotation] = useState(null);
  const [agreement, setAgreement] = useState(null);
  const [contract, setContract] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [selectionHistory, setSelectionHistory] = useState([]);
  const [theme, setTheme] = useState('light');
  const [selectedGearboxIndex, setSelectedGearboxIndex] = useState(0); // Index within recommendations array
  const [selectedComponents, setSelectedComponents] = useState({ // Holds the *currently displayed* components after selection/adjustment
    gearbox: null,
    coupling: null,
    pump: null
  });
  const [packagePrice, setPackagePrice] = useState(0); // Calculated cost price
  const [marketPrice, setMarketPrice] = useState(0); // Calculated selling price (might be adjustable)
  const [totalMarketPrice, setTotalMarketPrice] = useState(0); // Final market price including extras (potentially same as marketPrice)
  const [showBatchPriceAdjustment, setShowBatchPriceAdjustment] = useState(false);

  // Check if user is authenticated, if not redirect to login
  useEffect(() => {
    if (!isAuthenticated && location.pathname !== '/login') {
      navigate('/login', { state: { from: location }, replace: true });
    }
  }, [isAuthenticated, location, navigate]);

  // Check if user is admin
  const isAdmin = user && (user.role === userRoles.ADMIN || user.role === userRoles.SUPER_ADMIN);

  // Work condition options for coupling selection
  const workConditionOptions = useMemo(() => [
    'I类:扭矩变化很小',
    'II类:扭矩变化小',
    'III类:扭矩变化中等',
    'IV类:扭矩变化大',
    'V类:扭矩变化很大'
  ], []);

  // Application scenario options
  const applicationOptions = useMemo(() => [
    { value: 'propulsion', label: '主推进' },
    { value: 'auxiliary', label: '辅助推进' },
    { value: 'winch', label: '绞车' },
    { value: 'other', label: '其他' }
  ], []);

  // Function to update both local and parent state
  const updateAppData = (newData) => {
    let dataToUpdate;
    if (typeof newData === 'function') {
      dataToUpdate = newData(appData);
    } else {
      dataToUpdate = newData;
    }
    
    const adaptedData = adaptEnhancedData(ensureDataCollections(dataToUpdate)); // Ensure structure and adapt
    setAppDataState(adaptedData);
    if (setAppData && typeof setAppData === 'function') {
      setAppData(adaptedData); // Call the setter passed from AppWrapper
    }
    // Save to localStorage after update
    try {
      localStorage.setItem('appData', JSON.stringify(adaptedData));
      console.log('App data saved to localStorage after update.');
    } catch (e) {
      console.warn('Failed to save app data to localStorage:', e);
    }
    
    return adaptedData;
  };

  // Memoized theme colors
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

  // Update CSS variables for theme
  useEffect(() => {
    const root = document.documentElement;
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--app-${key}`, value);
    });
  }, [colors]);

  // Callbacks for event handlers
  const handleEngineDataChange = useCallback((data) => {
    setEngineData(prevData => ({ ...prevData, ...data }));
    setError('');
  }, []);

  const handleRequirementDataChange = useCallback((data) => {
    // Ensure temperature is stored as string for input control
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

  // Safe number formatting function
  const safeNumberFormat = useCallback((value, decimals = 2) => {
    const num = parseFloat(value); // Try parsing first
    if (typeof num !== 'number' || isNaN(num)) {
      return '-'; // Return dash for non-numbers or NaN
    }
    return num.toFixed(decimals);
  }, []);


   // Load data on mount - Uses data passed from AppWrapper
   useEffect(() => {
       console.log("App Component Mounted. Received appData keys:", Object.keys(initialAppData || {}));
       // Ensure data structure on initial load within the component as well
       const dataToUse = ensureDataCollections(initialAppData || {});
       // Adapt data if needed (might be redundant if AppWrapper adapted, but safe)
       const adaptedData = adaptEnhancedData(dataToUse);
       setAppDataState(adaptedData);
       // No need to call setAppData here, it was set in the wrapper
   }, [initialAppData]); // Depend only on the prop from wrapper

   // Initialize components and prices when selection result changes
   useEffect(() => {
    if (selectionResult && selectionResult.success && Array.isArray(selectionResult.recommendations) && selectionResult.recommendations.length > 0) {
      console.log("New selection result received, updating components...");
      // Always select the first recommendation initially when a new result comes in
      setSelectedGearboxIndex(0);
      const firstGearbox = selectionResult.recommendations[0]; // Gearbox from the top recommendation
      const firstCouplingResult = selectionResult.flexibleCoupling; // Coupling result object (contains success flag, etc.)
      const firstPumpResult = selectionResult.standbyPump; // Pump result object

      // Ensure selected components have calculated prices
      // Create copies to avoid mutating the selectionResult state directly
      const currentGearbox = { ...firstGearbox };
      if (!currentGearbox.basePrice && currentGearbox.price) currentGearbox.basePrice = currentGearbox.price;
      if (!currentGearbox.discountRate) currentGearbox.discountRate = getDiscountRate(currentGearbox.model);
      currentGearbox.factoryPrice = calculateFactoryPrice(currentGearbox);
      // Use the more flexible market price calculation initially
      currentGearbox.marketPrice = calculateMarketPrice(currentGearbox, calculatePackagePrice(currentGearbox, null, null));


      const currentCoupling = firstCouplingResult?.success ? { ...firstCouplingResult } : null;
      if (currentCoupling) {
        if (!currentCoupling.basePrice && currentCoupling.price) currentCoupling.basePrice = currentCoupling.price;
         if (!currentCoupling.discountRate) currentCoupling.discountRate = getDiscountRate(currentCoupling.model);
        currentCoupling.factoryPrice = calculateFactoryPrice(currentCoupling);
        currentCoupling.marketPrice = calculateMarketPrice(currentCoupling, currentCoupling.factoryPrice); // Calculate market price for coupling
      }

      const currentPump = firstPumpResult?.success ? { ...firstPumpResult } : null;
       if (currentPump) {
        if (!currentPump.basePrice && currentPump.price) currentPump.basePrice = currentPump.price;
         if (!currentPump.discountRate) currentPump.discountRate = getDiscountRate(currentPump.model);
        currentPump.factoryPrice = calculateFactoryPrice(currentPump);
        currentPump.marketPrice = calculateMarketPrice(currentPump, currentPump.factoryPrice); // Calculate market price for pump
      }

      setSelectedComponents({
        gearbox: currentGearbox,
        coupling: currentCoupling,
        pump: currentPump
      });

      // Recalculate prices based on the newly selected components
      const calcPackagePrice = calculatePackagePrice(currentGearbox, currentCoupling, currentPump);
      setPackagePrice(calcPackagePrice);

      // Use the calculated market price for the gearbox as the main display price
      const initialMarketPrice = currentGearbox.marketPrice;
      setMarketPrice(initialMarketPrice);
      setTotalMarketPrice(initialMarketPrice); // Start total market price with this

      console.log("Selected Components Updated:", { gearbox: currentGearbox.model, coupling: currentCoupling?.model, pump: currentPump?.model });
      console.log("Prices Updated:", { packagePrice: calcPackagePrice, marketPrice: initialMarketPrice });


    } else if (selectionResult && !selectionResult.success) {
        console.log("Selection failed, clearing components and prices.");
        // Clear selections if selection failed
        setSelectedGearboxIndex(0);
        setSelectedComponents({ gearbox: null, coupling: null, pump: null });
        setPackagePrice(0);
        setMarketPrice(0);
        setTotalMarketPrice(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [selectionResult]); // Rerun only when selectionResult object changes


  // Load selection history from localStorage
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

  // Handler functions

  // Main selection handler - Uses autoSelectGearbox or selectGearbox
  const handleSelection = useCallback(() => {
    setLoading(true);
    setError('正在执行选型...');
    setSelectionResult(null); // Clear previous results
    setQuotation(null);
    setAgreement(null);
    setContract(null);
    setActiveTab('input'); // Stay on input tab until results are ready

    // Use setTimeout to allow UI update before blocking calculation
    setTimeout(() => {
        try {
          // Debugging log
          console.log('开始选型，当前状态:', {
            engineData,
            requirementData, // Includes workCondition, temperature, hasCover
            gearboxType,
            appDataKeys: Object.keys(appData)
          });

          const powerValue = parseFloat(engineData.power) || 0;
          const speedValue = parseFloat(engineData.speed) || 0;
          const ratioValue = parseFloat(requirementData.targetRatio) || 0;
          const thrustValue = parseFloat(requirementData.thrustRequirement) || 0;

          // Extract coupling parameters and application from requirementData
          const workCondition = requirementData.workCondition || "III类:扭矩变化中等";
          const temperature = parseFloat(requirementData.temperature) || 30;
          const hasCover = !!requirementData.hasCover;
          const application = requirementData.application || 'propulsion';

          if (powerValue <= 0) throw new Error('主机功率必须大于0');
          if (speedValue <= 0) throw new Error('主机转速必须大于0');
          if (ratioValue <= 0) throw new Error('目标减速比必须大于0');
          if (thrustValue < 0) throw new Error('推力要求不能为负数');
           if (isNaN(temperature)) throw new Error('工作温度输入无效');


          console.log('执行选型算法，参数:', {
            powerValue, speedValue, ratioValue, thrustValue, gearboxType,
            workCondition, temperature, hasCover, application,
            appDataSize: Object.keys(appData).length
          });

          let result;
          const selectionOptions = { workCondition, temperature, hasCover, application }; // Bundle options

          // Decide which selection function to use
          if (gearboxType === 'auto') {
            // Use the comprehensive auto-selection algorithm
             const requirements = {
              motorPower: powerValue,
              motorSpeed: speedValue,
              targetRatio: ratioValue,
              thrust: thrustValue,
              ...selectionOptions // Pass all options
            };
             console.log('调用 autoSelectGearbox, requirements:', requirements);
             result = autoSelectGearbox(requirements, appData);
          } else {
            // Use the specific gearbox type selection, passing options
            console.log('调用 selectGearbox for type:', gearboxType, 'with options:', selectionOptions);
            result = selectGearbox(
              powerValue,
              speedValue,
              ratioValue,
              thrustValue,
              gearboxType, // Pass the specific type ('HC', 'GW', etc.)
              appData,
              selectionOptions // Pass coupling and other options
            );
          }


          console.log('选型算法返回结果:', result);
          setSelectionResult(result); // Update state with the complete result object

          if (result.success) {
            setActiveTab('result'); // Switch tab only on success
            setError(result.warning ?
              `选型成功，但有警告: ${result.warning}` :
              '选型成功'
            );

            // Save to history
             const historyEntry = {
                id: Date.now(),
                timestamp: new Date().toISOString(),
                projectInfo: { ...projectInfo },
                engineData: { ...engineData },
                requirementData: { ...requirementData }, // Capture current requirements
                selectionResult: { ...result },          // Save the full result object
                // Selected components are derived from selectionResult in useEffect
             };

             setSelectionHistory(prev => {
                const updatedHistory = [historyEntry, ...prev].slice(0, 50); // Keep latest 50
                try {
                    localStorage.setItem('selectionHistory', JSON.stringify(updatedHistory));
                } catch (lsError) {
                    console.error("无法保存历史记录到LocalStorage:", lsError);
                     setError(prevError => prevError + " (无法保存历史记录)");
                }
                return updatedHistory;
             });

          } else {
            setError(`选型失败${result.message ? ': ' + result.message : ''}`);
            setActiveTab('input'); // Remain on input tab if failed
          }
        } catch (err) {
          console.error("选型过程出错:", err);
          setError('选型过程出错: ' + err.message);
          setActiveTab('input'); // Remain on input tab on error
        } finally {
          setLoading(false);
        }
    }, 50); // Short delay
  // Dependencies for useCallback
  }, [engineData, requirementData, gearboxType, appData, projectInfo]); // Removed setAppData


  // Handler when user selects a different gearbox from the recommendations list
  const handleGearboxSelection = useCallback((index) => {
    if (!selectionResult || !selectionResult.success || !Array.isArray(selectionResult.recommendations) || !selectionResult.recommendations[index]) {
        console.error("Cannot select gearbox, invalid state or index:", index, selectionResult);
        setError("无法选择齿轮箱，内部状态错误。");
        return;
    }

    setSelectedGearboxIndex(index);
    const selectedGearbox = { ...selectionResult.recommendations[index] }; // Get the newly chosen gearbox
    console.log(`User selected gearbox at index ${index}:`, selectedGearbox.model);

    // Ensure price fields are calculated for the newly selected gearbox
    if (!selectedGearbox.basePrice && selectedGearbox.price) selectedGearbox.basePrice = selectedGearbox.price;
    if (selectedGearbox.discountRate === undefined) selectedGearbox.discountRate = getDiscountRate(selectedGearbox.model);
    selectedGearbox.factoryPrice = calculateFactoryPrice(selectedGearbox);
    // Recalculate market price based on its own merits
    selectedGearbox.marketPrice = calculateMarketPrice(selectedGearbox, calculatePackagePrice(selectedGearbox));


    // Re-select coupling and pump based on the *newly selected* gearbox and *current requirementData*
    const engineTorque = selectionResult.engineTorque; // From the original selection run

    console.log(`Re-selecting accessories for gearbox ${selectedGearbox.model} using requirements:`, requirementData);

    const updatedCouplingResult = selectFlexibleCoupling(
      engineTorque,
      selectedGearbox.model,
      appData.flexibleCouplings,
      requirementData.workCondition, // Use current state
      parseFloat(requirementData.temperature) || 30,
      requirementData.hasCover
    );
    console.log("New coupling result:", updatedCouplingResult);


    const updatedPumpResult = selectStandbyPump(
      selectedGearbox.model,
      appData.standbyPumps
    );
     console.log("New pump result:", updatedPumpResult);

    // Update selected components state with the new selections
    const currentCoupling = updatedCouplingResult?.success ? { ...updatedCouplingResult } : null;
     if (currentCoupling) { // Calculate prices for new coupling
       if (!currentCoupling.basePrice && currentCoupling.price) currentCoupling.basePrice = currentCoupling.price;
        if (currentCoupling.discountRate === undefined) currentCoupling.discountRate = getDiscountRate(currentCoupling.model);
       currentCoupling.factoryPrice = calculateFactoryPrice(currentCoupling);
       currentCoupling.marketPrice = calculateMarketPrice(currentCoupling, currentCoupling.factoryPrice);
     }

    const currentPump = updatedPumpResult?.success ? { ...updatedPumpResult } : null;
     if (currentPump) { // Calculate prices for new pump
       if (!currentPump.basePrice && currentPump.price) currentPump.basePrice = currentPump.price;
       if (currentPump.discountRate === undefined) currentPump.discountRate = getDiscountRate(currentPump.model);
       currentPump.factoryPrice = calculateFactoryPrice(currentPump);
       currentPump.marketPrice = calculateMarketPrice(currentPump, currentPump.factoryPrice);
     }

    setSelectedComponents({
      gearbox: selectedGearbox,
      coupling: currentCoupling,
      pump: currentPump
    });

    // Recalculate total prices based on the new combination
    const newPackagePrice = calculatePackagePrice(selectedGearbox, currentCoupling, currentPump);
    setPackagePrice(newPackagePrice);

    // Use the *selected gearbox's* market price as the primary market price display
    const newMarketPrice = selectedGearbox.marketPrice;
    setMarketPrice(newMarketPrice);
    setTotalMarketPrice(newMarketPrice); // Update the total as well

    console.log("Selected Components Updated after re-selection:", { gearbox: selectedGearbox.model, coupling: currentCoupling?.model, pump: currentPump?.model });
    console.log("Prices Updated after re-selection:", { packagePrice: newPackagePrice, marketPrice: newMarketPrice });


    // Clear downstream generated documents as the core selection changed
    setQuotation(null);
    setAgreement(null);
    setContract(null);
    setActiveTab('result'); // Ensure we stay on the result tab

  // Dependencies for useCallback
  }, [selectionResult, appData, requirementData]); // Depend on requirementData for coupling re-selection


  // Price change handler - Handles user input in PriceCalculator
  const handlePriceChange = useCallback((component, field, value) => {
    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue)) return; // Ignore invalid input

    console.log(`Price Change: Component=${component}, Field=${field}, Value=${parsedValue}`);

    setSelectedComponents(prev => {
      if (!prev[component]) {
           console.warn(`Component ${component} not found in selectedComponents`);
           return prev;
      }

      // Create a mutable copy of the specific component
      const updatedComponent = { ...prev[component] };
      updatedComponent[field] = parsedValue; // Update the field

      // --- Recalculate derived prices based on the change ---
      let needsPackageRecalc = false;
      let needsMarketRecalc = false;

      if (field === 'basePrice') {
        updatedComponent.factoryPrice = calculateFactoryPrice(updatedComponent);
        needsPackageRecalc = true;
        needsMarketRecalc = true; // Market price usually depends on factory/package price
      } else if (field === 'discountRate') {
        // Assuming discountRate is stored as percentage (e.g., 10 for 10%)
        // If getDiscountRate returns fraction (0.10), adjust calculateFactoryPrice accordingly
        updatedComponent.factoryPrice = calculateFactoryPrice(updatedComponent); // Pass the object with updated rate
        needsPackageRecalc = true;
        needsMarketRecalc = true;
      } else if (field === 'factoryPrice') {
        // If factory price is manually set, package price changes
        needsPackageRecalc = true;
        needsMarketRecalc = true; // Market price might also change
      } else if (field === 'marketPrice') {
        // Market price set directly, no other prices need recalculation based on this
        // Total market price will be updated outside this function
      } else if (field === 'price') {
          // If 'price' field exists and is changed (might be base or something else)
          // Assume it behaves like basePrice for recalculation purposes
          updatedComponent.basePrice = parsedValue; // Sync basePrice if 'price' is used
          updatedComponent.factoryPrice = calculateFactoryPrice(updatedComponent);
          needsPackageRecalc = true;
          needsMarketRecalc = true;
      }

      // Create the new components state
      const newComponents = { ...prev, [component]: updatedComponent };

      // Recalculate total package price if needed
      if (needsPackageRecalc) {
        setPackagePrice(calculatePackagePrice(newComponents.gearbox, newComponents.coupling, newComponents.pump));
      }

      // Recalculate or set the main market price (usually driven by gearbox)
      if (component === 'gearbox' && field === 'marketPrice') {
        setMarketPrice(parsedValue); // Use direct input if gearbox market price was changed
        setTotalMarketPrice(parsedValue); // Keep total aligned with main market price
      } else if (needsMarketRecalc) {
        // Recalculate based on potentially new package price
        const newMarketPrice = calculateMarketPrice(
          newComponents.gearbox, 
          calculatePackagePrice(newComponents.gearbox, newComponents.coupling, newComponents.pump)
        );
        setMarketPrice(newMarketPrice);
        setTotalMarketPrice(newMarketPrice);
      }

      console.log("Updated components after price change:", newComponents);
      return newComponents; // Return the new state for setSelectedComponents
    });

    // Clear downstream documents after price change
    setQuotation(null);
    setAgreement(null);
    setContract(null);
  }, []); // No dependencies needed as it uses state updater form


  // Batch Price Adjustment handler - Updated
  const handleBatchPriceAdjustment = useCallback((adjustmentInfo) => {
    const { category, field, type, value } = adjustmentInfo;
    if (!field || !type || value === undefined || value === null) {
        setError("批量调整参数无效。");
        return;
    }
    let totalAdjustedCount = 0;
    setLoading(true);
    setError('正在应用批量价格调整...');

    updateAppData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData)); // Deep copy

      const updateItemPrice = (item) => {
          // Ensure field exists and is a number
          if (!item || typeof item[field] !== 'number') {
              return false;
          }

          let originalValue = item[field];
          let newValue;
           try {
              const adjustmentValue = parseFloat(value); // Ensure value is number
              if (isNaN(adjustmentValue)) throw new Error("Adjustment value is not a number");

              if (type === 'percent') {
                newValue = Math.round(originalValue * (1 + adjustmentValue / 100));
              } else if (type === 'amount') {
                newValue = Math.round(originalValue + adjustmentValue);
              } else {
                  throw new Error(`Invalid adjustment type: ${type}`);
              }
              newValue = Math.max(0, newValue); // Prevent negative prices

              if (newValue !== originalValue) {
                  item[field] = newValue;
                  // Mark for recalculation by adapter (safer than direct calc here)
                  item.recalculatePrices = true; // Generic flag for adapter
                  // If basePrice changed, ensure price field is synced if it exists
                  if (field === 'basePrice' && item.price !== undefined) item.price = newValue;
                  return true; // Item adjusted
              }
            } catch (e) {
              console.error(`调整价格失败 for item ${item?.model}:`, e);
            }
          return false; // Item not adjusted
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
          console.log(`Category ${catKey}: ${adjustedCountInCategory} items updated.`);
        } else {
            console.warn(`Category ${catKey} not found or not an array in data.`);
        }
      };

      const gearboxCategories = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes'];
      const otherCategories = ['flexibleCouplings', 'standbyPumps'];

      if (category === 'all') {
          [...gearboxCategories, ...otherCategories].forEach(updateCategory);
      } else if (category === 'allGearboxes') {
          gearboxCategories.forEach(updateCategory);
      } else if (newData[category]) {
          updateCategory(category);
      } else {
          console.warn(`Invalid category specified for batch adjustment: ${category}`);
          setError(`无效的调整类别: ${category}`);
          return prevData; // Return original data if category is invalid
      }

      console.log(`Batch adjustment applied. Total ${totalAdjustedCount} items updated.`);
      // adaptEnhancedData will be called by updateAppData which will handle recalculations based on the flag
      return newData;
    });

    setError(`批量价格调整已应用 (${totalAdjustedCount} 项已更新)。数据将在下次加载或适配时重新计算衍生价格。如果当前选型受影响，请重新生成报价/协议。`);
    setLoading(false);
    setShowBatchPriceAdjustment(false);

    // Clear downstream documents as base data has changed
    setQuotation(null);
    setAgreement(null);
    setContract(null);
  }, [updateAppData]); // Dependency on updateAppData


  // Generate Quotation handler - Updated
  const handleGenerateQuotation = useCallback(() => {
    if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
      setActiveTab('input');
      return;
    }
     if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成报价单。');
      setActiveTab('input');
      return;
    }


    setLoading(true);
    setError('正在生成报价单...');

    try {
      // Use the components currently in state (reflecting user selections/adjustments)
      const finalComponents = { ...selectedComponents };

      // Ensure prices in finalComponents are up-to-date before passing
      // It's better if PriceCalculator directly updates factory/market prices in selectedComponents state
      // Let's assume selectedComponents already has the correct prices from handlePriceChange or initial selection

      const currentPackagePrice = calculatePackagePrice(finalComponents.gearbox, finalComponents.coupling, finalComponents.pump);
      // Use the market price currently displayed, which reflects adjustments
      const currentMarketPrice = marketPrice;


      const quotationData = generateQuotation(
        selectionResult, // Pass the original full selection result for technical details
        projectInfo,
        finalComponents, // Pass the currently selected components with potentially adjusted prices
        {
          packagePrice: currentPackagePrice, // Pass the current calculated package price
          marketPrice: currentMarketPrice,   // Pass the current displayed/adjusted market price
          totalMarketPrice: totalMarketPrice, // Pass the current total market price
          // Provide component prices explicitly for the generator
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
        }
      );

      setQuotation(quotationData);
      setActiveTab('quotation');
      setError('报价单生成成功');
    } catch (error) {
       console.error("生成报价单错误:", error);
      setError('生成报价单失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  // Depend on selectedComponents and prices states
  }, [selectedComponents, selectionResult, projectInfo, packagePrice, marketPrice, totalMarketPrice]);


  const handleExportQuotation = useCallback((format) => {
    if (!quotation) {
      setError('请先生成报价单');
      return;
    }
    setLoading(true);
    setError(`正在导出报价单为 ${format.toUpperCase()}...`);
    try {
      const filename = `${projectInfo.projectName || '未命名项目'}-报价单`;
      if (format === 'excel') {
        exportQuotationToExcel(quotation, filename);
        setError('报价单已导出为Excel格式');
      } else if (format === 'pdf') {
        exportQuotationToPDF(quotation, filename);
        setError('报价单已导出为PDF格式');
      }
    } catch (error) {
      console.error("导出报价单错误:", error);
      setError('导出报价单失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [quotation, projectInfo.projectName]);

  // Generate Agreement handler
  const handleGenerateAgreement = useCallback(() => {
     if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
      setActiveTab('input');
      return;
    }
     if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成技术协议。');
      setActiveTab('input');
      return;
    }
    setLoading(true);
    setError('正在生成技术协议...');
    try {
       // Pass the full original selection result for technical data
       // and the current components for model numbers etc.
      const agreementData = generateAgreement(
        selectionResult,
        projectInfo,
        selectedComponents
      );
      setAgreement(agreementData);
      setActiveTab('agreement');
      setError('技术协议生成成功');
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
    setError(`正在导出技术协议为 ${format.toUpperCase()}...`);
    try {
      const filename = `${projectInfo.projectName || '未命名项目'}-技术协议`;
      if (format === 'word') {
        exportAgreementToWord(agreement, filename);
        setError('技术协议已导出为Word格式');
      } else if (format === 'pdf') {
        exportAgreementToPDFFormat(agreement, filename);
        setError('技术协议已导出为PDF格式');
      } else if (format === 'copy') {
        // Adjust content to copy based on actual agreement structure
        const contentToCopy = agreement?.details || JSON.stringify(agreement, null, 2);
        navigator.clipboard.writeText(contentToCopy)
          .then(() => setError('技术协议内容已复制到剪贴板'))
          .catch(err => {
               console.error("复制失败:", err);
               setError('复制技术协议失败: ' + err.message);
           });
      }
    } catch (error) {
      console.error("导出技术协议错误:", error);
      setError('导出技术协议失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [agreement, projectInfo.projectName]);

  // Generate Contract handler - Updated
  const handleGenerateContract = useCallback(() => {
     if (!selectedComponents.gearbox) {
      setError('请先完成选型，确保有选中的齿轮箱');
       setActiveTab('input');
      return;
    }
     if (!quotation) {
      setError('请先生成报价单，合同需要报价信息');
      setActiveTab('quotation');
      return;
    }
     if (!selectionResult || !selectionResult.success) {
      setError('当前的选型结果无效，无法生成合同。');
       setActiveTab('input');
      return;
    }
    setLoading(true);
    setError('正在生成销售合同...');
    try {
       // Use the prices from the *quotation* object for consistency in the contract
       const contractPackagePrice = quotation?.summary?.packagePrice || packagePrice;
       const contractMarketPrice = quotation?.summary?.marketPrice || marketPrice;
       const contractTotalMarketPrice = quotation?.summary?.totalMarketPrice || totalMarketPrice;


       const contractData = generateContract(
        selectionResult, // Original selection result for technical data
        projectInfo,
        selectedComponents, // Currently selected components for model numbers
        {
          packagePrice: contractPackagePrice, // Use prices from quotation
          marketPrice: contractMarketPrice,
          totalMarketPrice: contractTotalMarketPrice,
          quotationDetails: quotation // Pass the whole quotation object
        }
      );
      setContract(contractData);
      setActiveTab('contract');
      setError('销售合同生成成功');
    } catch (error) {
      console.error("生成销售合同错误:", error);
      setError('生成销售合同失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [selectedComponents, selectionResult, projectInfo, quotation, packagePrice, marketPrice, totalMarketPrice]); // Added quotation dependency


  const handleExportContract = useCallback((format) => {
    if (!contract) {
      setError('请先生成销售合同');
      return;
    }
    setLoading(true);
    setError(`正在导出销售合同为 ${format.toUpperCase()}...`);
    try {
      const filename = `${projectInfo.projectName || '未命名项目'}-销售合同`;
      if (format === 'word') {
        exportContractToWord(contract, filename);
        setError('销售合同已导出为Word格式');
      } else if (format === 'pdf') {
        exportContractToPDF(contract, filename);
        setError('销售合同已导出为PDF格式');
      }
    } catch (error) {
      console.error("导出销售合同错误:", error);
      setError('导出销售合同失败: ' + error.message);
    } finally {
      setLoading(false);
    }
  }, [contract, projectInfo.projectName]);

  // Load History Entry handler - Updated
  const handleLoadHistoryEntry = useCallback((historyId) => {
    const entry = selectionHistory.find(item => item.id === historyId);

    if (entry && entry.selectionResult) { // Ensure selectionResult exists
      setLoading(true);
      setError('正在加载历史记录...');

      // Restore state from the history entry
      setProjectInfo(entry.projectInfo || { projectName: '', customerName: '', projectNumber: '', contactPerson: '', contactPhone: '', contactEmail: '', engineModel: '' });
      setEngineData(entry.engineData || { power: '', speed: '' });
      // Restore requirementData including coupling params
      setRequirementData(entry.requirementData || { targetRatio: '', thrustRequirement: '', workCondition: "III类:扭矩变化中等", temperature: "30", hasCover: false, application: 'propulsion' });

      // Determine gearbox type used (if stored, otherwise default)
      // Use the type stored in the result itself
      const historyGearboxType = entry.selectionResult?.gearboxTypeUsed || 'auto';
      setGearboxType(historyGearboxType);

      // Set the selectionResult - this will trigger the useEffect to update components and prices
      setSelectionResult(entry.selectionResult); // Restore the full result object

      // Clear any previously generated documents
      setQuotation(null);
      setAgreement(null);
      setContract(null);

      setActiveTab('result'); // Go to result tab
      setLoading(false);
      setError(`已成功加载历史选型数据 (ID: ${historyId})`);
    } else {
      setError('未找到指定的历史记录或历史记录无效');
      console.error("Failed to load history entry:", entry);
      setLoading(false);
    }
  }, [selectionHistory]); // Dependency on history


  const handleDeleteHistoryEntry = useCallback((historyId) => {
    setSelectionHistory(prev => {
      const filtered = prev.filter(entry => entry.id !== historyId);
       try {
           localStorage.setItem('selectionHistory', JSON.stringify(filtered));
           setError('历史记录已成功删除');
       } catch (lsError) {
           console.error("无法更新LocalStorage中的历史记录:", lsError);
           setError('历史记录删除失败 (无法更新存储)');
       }
      return filtered;
    });
  }, []); // No dependency needed

  // Check if form is valid
  const isFormValid = useCallback(() => {
    const powerValid = !!engineData.power && !isNaN(parseFloat(engineData.power)) && parseFloat(engineData.power) > 0;
    const speedValid = !!engineData.speed && !isNaN(parseFloat(engineData.speed)) && parseFloat(engineData.speed) > 0;
    const ratioValid = !!requirementData.targetRatio && !isNaN(parseFloat(requirementData.targetRatio)) && parseFloat(requirementData.targetRatio) > 0;
    const thrustValid = requirementData.thrustRequirement === '' || (!isNaN(parseFloat(requirementData.thrustRequirement)) && parseFloat(requirementData.thrustRequirement) >= 0);
    // Add checks for coupling params if needed (e.g., temperature range)
    const tempValid = !isNaN(parseFloat(requirementData.temperature));

    return powerValid && speedValid && ratioValid && thrustValid && tempValid;
  }, [engineData.power, engineData.speed, requirementData.targetRatio, requirementData.thrustRequirement, requirementData.temperature]);

  // Form input styles
  const inputStyles = useMemo(() => ({
    backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder,
    '::placeholder': { color: colors.muted },
  }), [colors]);
   const focusStyles = useMemo(() => ({
     '&:focus': { borderColor: colors.primary, boxShadow: `0 0 0 0.2rem ${colors.focusRing}` }
   }), [colors]);

  // Check if we should render different views based on path
  if (location.pathname === '/login') {
    return <LoginPage />;
  }

  if (location.pathname === '/users' && isAdmin) {
    return <UserManagementView appData={appData} setAppData={updateAppData} />;
  }

  if (location.pathname === '/database' && isAdmin) {
    return <DatabaseManagementView appData={appData} setAppData={updateAppData} />;
  }

  // --- JSX Rendering for Main App ---
  return (
    <Container fluid className="app-container" style={{ backgroundColor: colors.bg, color: colors.text }}>
      {/* Header Row */}
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

      {/* Error/Loading Alert */}
      {error && (
        <Row className="mb-4">
          <Col>
            <Alert
              variant={error.includes('成功') ? 'success' : error.includes('警告') || error.includes('无法加载') || error.includes('注意') ? 'warning' : 'danger'}
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

      {/* Main Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className={`mb-4 app-tabs tabs-${theme}`}
        id="main-tabs"
      >
        {/* Input Tab */}
        <Tab eventKey="input" title={<span><i className="bi bi-pencil-square me-1"></i>选型输入</span>}>
          <Row>
            {/* Basic Info Column */}
            <Col lg={4} md={6} sm={12}>
              <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
                  <i className="bi bi-info-circle me-2"></i>基本信息
                </Card.Header>
                <Card.Body style={{ padding: '1.5rem' }}>
                  <Form>
                    {/* Project Name */}
                    <Form.Group className="mb-3" controlId="projectName">
                      <Form.Label style={{ color: colors.text }}>项目名称</Form.Label>
                      <Form.Control type="text" value={projectInfo.projectName} onChange={(e) => handleProjectInfoChange({ projectName: e.target.value })} placeholder="例如：XX船厂38m渔船" style={{...inputStyles, ...focusStyles}}/>
                    </Form.Group>
                    {/* Customer Name */}
                    <Form.Group className="mb-3" controlId="customerName">
                      <Form.Label style={{ color: colors.text }}>客户名称</Form.Label>
                      <Form.Control type="text" value={projectInfo.customerName} onChange={(e) => handleProjectInfoChange({ customerName: e.target.value })} placeholder="请输入客户公司全称" style={{...inputStyles, ...focusStyles}}/>
                    </Form.Group>
                    {/* Project Number */}
                     <Form.Group className="mb-3" controlId="projectNumber">
                        <Form.Label style={{ color: colors.text }}>项目编号 (可选)</Form.Label>
                        <Form.Control type="text" value={projectInfo.projectNumber} onChange={(e) => handleProjectInfoChange({ projectNumber: e.target.value })} placeholder="内部项目或订单号" style={{...inputStyles, ...focusStyles}}/>
                     </Form.Group>
                     {/* Contact Person */}
                    <Form.Group className="mb-3" controlId="contactPerson">
                      <Form.Label style={{ color: colors.text }}>联系人</Form.Label>
                      <Form.Control type="text" value={projectInfo.contactPerson} onChange={(e) => handleProjectInfoChange({ contactPerson: e.target.value })} placeholder="请输入联系人姓名" style={{...inputStyles, ...focusStyles}}/>
                    </Form.Group>
                    {/* Contact Phone */}
                    <Form.Group className="mb-3" controlId="contactPhone">
                      <Form.Label style={{ color: colors.text }}>联系电话</Form.Label>
                      <Form.Control type="text" value={projectInfo.contactPhone} onChange={(e) => handleProjectInfoChange({ contactPhone: e.target.value })} placeholder="请输入联系电话" style={{...inputStyles, ...focusStyles}}/>
                    </Form.Group>
                    {/* Contact Email */}
                      <Form.Group className="mb-3" controlId="contactEmail">
                        <Form.Label style={{ color: colors.text }}>联系邮箱 (可选)</Form.Label>
                        <Form.Control type="email" value={projectInfo.contactEmail} onChange={(e) => handleProjectInfoChange({ contactEmail: e.target.value })} placeholder="用于发送报价和协议" style={{...inputStyles, ...focusStyles}}/>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Engine & Requirements Column */}
            <Col lg={4} md={6} sm={12}>
              {/* Engine & Requirements content */}
              <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
                 <i className="bi bi-sliders me-2"></i>发动机 & 要求
                </Card.Header>
                <Card.Body style={{ padding: '1.5rem' }}>
                  <Form>
                    {/* Engine Params */}
                    <h6 style={{ color: colors.headerText }}>发动机参数</h6>
                    {/* Engine Power */}
                    <Form.Group className="mb-3" controlId="enginePower">
                        <Form.Label style={{ color: colors.text }}>主机功率 (kW) <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="number" value={engineData.power} onChange={(e) => handleEngineDataChange({ power: e.target.value })} placeholder="例如: 350" min="1" step="any" required style={{...inputStyles, ...focusStyles}} className={!engineData.power || isNaN(parseFloat(engineData.power)) || parseFloat(engineData.power) <= 0 ? 'is-invalid' : ''} />
                         <Form.Control.Feedback type="invalid">请输入有效的主机功率 (大于0)</Form.Control.Feedback>
                     </Form.Group>
                    {/* Engine Speed */}
                    <Form.Group className="mb-3" controlId="engineSpeed">
                        <Form.Label style={{ color: colors.text }}>主机转速 (r/min) <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="number" value={engineData.speed} onChange={(e) => handleEngineDataChange({ speed: e.target.value })} placeholder="例如: 1800" min="1" step="any" required style={{...inputStyles, ...focusStyles}} className={!engineData.speed || isNaN(parseFloat(engineData.speed)) || parseFloat(engineData.speed) <= 0 ? 'is-invalid' : ''} />
                        <Form.Control.Feedback type="invalid">请输入有效的主机转速 (大于0)</Form.Control.Feedback>
                    </Form.Group>
                    {/* Engine Model */}
                     <Form.Group className="mb-3" controlId="engineModel">
                        <Form.Label style={{ color: colors.text }}>主机型号 (可选)</Form.Label>
                        <Form.Control type="text" value={projectInfo.engineModel} onChange={(e) => handleProjectInfoChange({ engineModel: e.target.value })} placeholder="例如: Weichai WP6" style={{...inputStyles, ...focusStyles}} />
                     </Form.Group>

                    {/* Requirements */}
                    <h6 style={{ color: colors.headerText }} className="mt-4">选型要求</h6>
                    {/* Target Ratio */}
                     <Form.Group className="mb-3" controlId="targetRatio">
                        <Form.Label style={{ color: colors.text }}>目标减速比 <span className="text-danger">*</span></Form.Label>
                        <Form.Control type="number" value={requirementData.targetRatio} onChange={(e) => handleRequirementDataChange({ targetRatio: e.target.value })} placeholder="例如: 4.5" min="0.1" step="any" required style={{...inputStyles, ...focusStyles}} className={!requirementData.targetRatio || isNaN(parseFloat(requirementData.targetRatio)) || parseFloat(requirementData.targetRatio) <= 0 ? 'is-invalid' : ''} />
                         <Form.Control.Feedback type="invalid">请输入有效的目标减速比 (大于0)</Form.Control.Feedback>
                    </Form.Group>
                    {/* Thrust Requirement */}
                    <Form.Group className="mb-3" controlId="thrustRequirement">
                      <Form.Label style={{ color: colors.text }}>推力要求 (kN, 可选)</Form.Label>
                      <Form.Control type="number" value={requirementData.thrustRequirement} onChange={(e) => handleRequirementDataChange({ thrustRequirement: e.target.value })} placeholder="留空则不强制匹配推力" min="0" step="any" style={{...inputStyles, ...focusStyles}} className={requirementData.thrustRequirement !== '' && (isNaN(parseFloat(requirementData.thrustRequirement)) || parseFloat(requirementData.thrustRequirement) < 0) ? 'is-invalid' : ''} />
                      <Form.Control.Feedback type="invalid">推力要求不能为负数</Form.Control.Feedback>
                    </Form.Group>
                    {/* Application Scenario */}
                     <Form.Group className="mb-3" controlId="application">
                      <Form.Label style={{ color: colors.text }}>应用场景</Form.Label>
                      <Form.Select value={requirementData.application} onChange={(e) => handleRequirementDataChange({ application: e.target.value })} style={{...inputStyles, ...focusStyles}} aria-label="选择应用场景">
                        {applicationOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
                      </Form.Select>
                       <Form.Text style={{ color: colors.muted }}>影响服务系数和选型策略</Form.Text>
                    </Form.Group>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* Gearbox Type & Coupling Params Column */}
            <Col lg={4} md={12} sm={12}>
              {/* Gearbox & Coupling content */}
              <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                 <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
                    <i className="bi bi-gear-wide-connected me-2"></i>齿轮箱 & 联轴器
                 </Card.Header>
                 <Card.Body style={{ padding: '1.5rem' }}>
                    <Form>
                    {/* Gearbox Type */}
                    <h6 style={{ color: colors.headerText }}>齿轮箱类型</h6>
                    <Form.Group className="mb-3" controlId="gearboxType">
                      <Form.Select value={gearboxType} onChange={(e) => handleGearboxTypeChange(e.target.value)} style={{...inputStyles, ...focusStyles}} aria-label="选择齿轮箱类型">
                        <option value="auto">自动选择最佳系列</option>
                        <option value="HC">HC系列 (中小功率)</option>
                        <option value="GW">GW系列 (大功率)</option>
                        <option value="HCM">HCM系列 (轻型高速)</option>
                        <option value="DT">DT系列 (电推)</option>
                        <option value="HCQ">HCQ系列 (特种)</option>
                        <option value="GC">GC系列 (通用)</option>
                      </Form.Select>
                      <Form.Text style={{ color: colors.muted }}>自动选择会综合考虑参数推荐最合适的系列。</Form.Text>
                    </Form.Group>

                     {/* Coupling Parameters */}
                     <h6 style={{ color: colors.headerText }} className="mt-4">联轴器参数 (可选)</h6>
                     {/* Work Condition */}
                     <Form.Group className="mb-3" controlId="workCondition">
                      <Form.Label style={{ color: colors.text }}>工作条件</Form.Label>
                      <Form.Select value={requirementData.workCondition} onChange={(e) => handleRequirementDataChange({ workCondition: e.target.value })} style={{...inputStyles, ...focusStyles}} aria-label="选择工作条件">
                        {workConditionOptions.map(option => (<option key={option} value={option}>{option}</option>))}
                      </Form.Select>
                      <Form.Text style={{ color: colors.muted }}>影响联轴器选型的工况系数。</Form.Text>
                    </Form.Group>
                    {/* Temperature */}
                    <Form.Group className="mb-3" controlId="temperature">
                      <Form.Label style={{ color: colors.text }}>工作温度 (°C)</Form.Label>
                      <Form.Control type="number" value={requirementData.temperature} onChange={(e) => handleRequirementDataChange({ temperature: e.target.value })} min="-20" max="120" placeholder="默认 30" style={{...inputStyles, ...focusStyles}} className={isNaN(parseFloat(requirementData.temperature)) ? 'is-invalid' : ''}/>
                      <Form.Control.Feedback type="invalid">请输入有效的温度</Form.Control.Feedback>
                      <Form.Text style={{ color: colors.muted }}>影响联轴器选型的温度系数 (通常 0-80°C)。</Form.Text>
                    </Form.Group>
                    {/* Has Cover */}
                    <Form.Group className="mb-3" controlId="hasCover">
                      <Form.Check type="checkbox" id="couplingCoverCheckbox" label="联轴器带罩壳" checked={requirementData.hasCover || false} onChange={(e) => handleRequirementDataChange({ hasCover: e.target.checked })} style={{ color: colors.text }} className="form-check-inline"/>
                      <Form.Text style={{ color: colors.muted }}>(特定型号联轴器可选)。</Form.Text>
                    </Form.Group>
                   </Form>
                 </Card.Body>
               </Card>
            </Col>
          </Row>
          {/* Action Button Row */}
          <Row>
            <Col className="text-center">
              <Button variant="primary" size="lg" onClick={handleSelection} disabled={loading || !isFormValid()} className="w-50 shadow-sm" style={{ backgroundColor: colors.primary, borderColor: colors.primary, color: colors.primaryText }}>
                  {loading ? (<><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />正在计算...</>) : (<><i className="bi bi-calculator-fill me-2"></i>执行选型</>)}
                </Button>
                 {!isFormValid() && !loading && (<p className="mt-2 text-danger"><small>请填写所有必填项 (*) 并确保输入有效。</small></p>)}
            </Col>
          </Row>
        </Tab>

        {/* Result Tab */}
        <Tab eventKey="result" title={<span><i className="bi bi-check2-circle me-1"></i>选型结果</span>} disabled={!selectionResult || !selectionResult.success}>
           {/* Conditional rendering for result content */}
           {selectionResult && selectionResult.success && Array.isArray(selectionResult.recommendations) && selectionResult.recommendations.length > 0 && (
             <div className="mt-3">
               {/* Top Row: Parameters and Analysis */}
              <Row className="mb-4">
                <Col>
                  <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                    <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
                      <h5 className="mb-0"><i className="bi bi-clipboard-data me-2"></i>选型概览</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {/* Input Parameters Column */}
                        <Col md={6} className="border-end" style={{ borderColor: `${colors.border} !important` }}>
                          <h6>输入参数</h6>
                          <Table responsive size="sm" bordered hover style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }}>
                            <tbody>
                              <tr><td width="40%">主机功率</td><td>{engineData.power} kW</td></tr>
                              <tr><td>主机转速</td><td>{engineData.speed} r/min</td></tr>
                              <tr><td>目标减速比</td><td>{requirementData.targetRatio}</td></tr>
                              <tr><td>应用场景</td><td>{applicationOptions.find(opt => opt.value === requirementData.application)?.label || '-'}</td></tr>
                              <tr><td>推力要求</td><td>{requirementData.thrustRequirement ? `${requirementData.thrustRequirement} kN` : '未指定'}</td></tr>
                              <tr><td>联轴器工况</td><td>{requirementData.workCondition}</td></tr>
                              <tr><td>联轴器温度</td><td>{requirementData.temperature} °C</td></tr>
                              <tr><td>联轴器带罩壳</td><td>{requirementData.hasCover ? '是' : '否'}</td></tr>
                            </tbody>
                          </Table>
                        </Col>
                         {/* Analysis Column */}
                        <Col md={6}>
                          <h6>性能分析</h6>
                          <Table responsive size="sm" bordered hover style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }}>
                           <tbody>
                            <tr><td width="40%">需求传递能力</td><td>{safeNumberFormat(selectionResult?.requiredTransferCapacity, 4)} kW/rpm</td></tr>
                            <tr><td>主机扭矩</td><td>{safeNumberFormat(selectionResult?.engineTorque / 1000, 2)} kN·m</td></tr>
                             <tr><td>推荐齿轮箱系列</td><td>{selectionResult?.recommendedType || '-'}</td></tr>
                             <tr><td>联轴器计算扭矩</td><td>{safeNumberFormat(selectionResult?.flexibleCoupling?.requiredTorque, 2) || '-'} kN·m</td></tr>
                           </tbody>
                          </Table>
                           {selectionResult?.warning && ( <Alert variant="warning" className={`alert-${theme}`} style={{ fontSize: '0.9em' }}><strong>注意:</strong> {selectionResult.warning}</Alert> )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

               {/* Gearbox Comparison View */}
              <GearboxComparisonView
                recommendations={selectionResult.recommendations || []} // Ensure it's an array
                selectedIndex={selectedGearboxIndex}
                onSelect={handleGearboxSelection}
                theme={theme}
                colors={colors}
                requiredCapacity={selectionResult?.requiredTransferCapacity}
                requiredThrust={parseFloat(requirementData.thrustRequirement) || 0}
              />

               {/* Bottom Row: Selected Config, Price, Actions */}
              <Row className="mb-4 mt-4">
                 {/* Left Column: Detailed Selected Components */}
                <Col md={8}>
                  <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                    <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
                      <h5 className="mb-0"><i className="bi bi-list-check me-2"></i>已选配置详情</h5>
                    </Card.Header>
                    <Card.Body>
                      <Row>
                        {/* Component Tables */}
                        <Col md={12}>
                            {/* Gearbox Details */}
                            <h6><i className="bi bi-gear me-1"></i>齿轮箱: {selectedComponents.gearbox?.model || '-'}</h6>
                            {selectedComponents.gearbox ? (
                                <Table striped bordered hover responsive size="sm" style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }}>
                                    <tbody>
                                    <tr><td width="30%">型号</td><td>{selectedComponents.gearbox.model}</td></tr>
                                    <tr><td>减速比</td><td>{safeNumberFormat(selectedComponents.gearbox.ratio, 3)}</td></tr>
                                    <tr><td>传递能力 (kW/rpm)</td><td>{safeNumberFormat(selectedComponents.gearbox.selectedCapacity ?? selectedComponents.gearbox.transferCapacity?.[0], 4)}</td></tr>
                                    <tr><td>能力安全系数</td><td>{safeNumberFormat(selectedComponents.gearbox.safetyFactor, 2)}</td></tr>
                                    <tr><td>能力余量</td><td className={(selectedComponents.gearbox.capacityMargin ?? 0) < 10 ? 'text-warning' : (selectedComponents.gearbox.capacityMargin ?? 0) < 0 ? 'text-danger' : ''}>{safeNumberFormat(selectedComponents.gearbox.capacityMargin, 1)}%</td></tr>
                                    <tr><td>推力 (kN)</td><td>{safeNumberFormat(selectedComponents.gearbox.thrust, 1) || '-'}</td></tr>
                                    <tr><td>推力满足</td><td>{selectedComponents.gearbox.thrustMet === undefined ? '-' : selectedComponents.gearbox.thrustMet ? <span className="text-success">是</span> : <span className="text-danger">否</span>}</td></tr>
                                    <tr><td>重量 (kg)</td><td>{safeNumberFormat(selectedComponents.gearbox.weight, 0) || '-'}</td></tr>
                                    <tr><td>中心距 (mm)</td><td>{safeNumberFormat(selectedComponents.gearbox.centerDistance, 0) || '-'}</td></tr>
                                    <tr><td>控制方式</td><td>{selectedComponents.gearbox.controlType || '-'}</td></tr>
                                    </tbody>
                                </Table>
                            ) : <p style={{color: colors.muted}}>未选择齿轮箱</p>}

                            {/* Coupling Details */}
                           <h6 className="mt-3"><i className="bi bi-link-45deg me-1"></i>高弹性联轴器: {selectedComponents.coupling?.model || (selectionResult?.flexibleCoupling?.message ?? '未选择/不适用')}</h6>
                            {selectedComponents.coupling ? (
                                <Table striped bordered hover responsive size="sm" style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }}>
                                <tbody>
                                    <tr><td width="30%">型号</td><td>{selectedComponents.coupling.model}</td></tr>
                                    <tr><td>额定扭矩 (kN·m)</td><td>{safeNumberFormat(selectedComponents.coupling.torque, 2)}</td></tr>
                                    <tr><td>需求扭矩 (kN·m)</td><td>{safeNumberFormat(selectedComponents.coupling.requiredTorque, 2)}</td></tr>
                                    <tr><td>扭矩余量</td><td className={(selectedComponents.coupling.torqueMargin ?? 0) < 10 ? 'text-warning' : (selectedComponents.coupling.torqueMargin ?? 0) < 0 ? 'text-danger' : ''}>{safeNumberFormat(selectedComponents.coupling.torqueMargin, 1)}%</td></tr>
                                    <tr><td>最大转速 (rpm)</td><td>{selectedComponents.coupling.maxSpeed || '-'}</td></tr>
                                    {/* Speed check might require engine speed context */}
                                    {/* <tr><td>转速满足</td><td>{selectedComponents.coupling.speedMet === undefined ? '-' : selectedComponents.coupling.speedMet ? <span className="text-success">是</span> : <span className="text-danger">否</span>}</td></tr> */}
                                    <tr><td>重量 (kg)</td><td>{safeNumberFormat(selectedComponents.coupling.weight, 0) || '-'}</td></tr>
                                </tbody>
                                </Table>
                            ) : selectionResult?.flexibleCoupling?.message && ( // Show message even if not successful
                                <Alert variant={selectionResult.flexibleCoupling.success ? "info" : "warning"} className={`alert-${theme}`} style={{fontSize: '0.9em'}}>{selectionResult.flexibleCoupling.message}</Alert>
                            )}

                             {/* Standby Pump Details */}
                            <h6 className="mt-3"><i className="bi bi-life-preserver me-1"></i>备用泵: {selectedComponents.pump?.model || (selectionResult?.standbyPump?.message ?? '未选择/不适用')}</h6>
                             {selectedComponents.pump ? (
                                <Table striped bordered hover responsive size="sm" style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }}>
                                <tbody>
                                    <tr><td width="30%">型号</td><td>{selectedComponents.pump.model}</td></tr>
                                    <tr><td>流量 (m³/h)</td><td>{safeNumberFormat(selectedComponents.pump.flow, 1) || '-'}</td></tr>
                                    <tr><td>压力 (MPa)</td><td>{safeNumberFormat(selectedComponents.pump.pressure, 1) || '-'}</td></tr>
                                    <tr><td>重量 (kg)</td><td>{safeNumberFormat(selectedComponents.pump.weight, 0) || '-'}</td></tr>
                                </tbody>
                                </Table>
                             ) : selectionResult?.standbyPump?.message && ( // Show message even if not successful
                                <Alert variant={selectionResult.standbyPump.success ? "info" : "warning"} className={`alert-${theme}`} style={{fontSize: '0.9em'}}>{selectionResult.standbyPump.message}</Alert>
                             )}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Right Column: Price Calculator and Actions */}
                <Col md={4}>
                   {/* Price Calculator */}
                   <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
                         <h5 className="mb-0"><i className="bi bi-tags-fill me-2"></i>价格配置</h5>
                      </Card.Header>
                      <Card.Body>
                         <PriceCalculator
                            selectedComponents={selectedComponents}
                            packagePrice={packagePrice}
                            marketPrice={marketPrice} // Pass the main market price
                            onPriceChange={handlePriceChange}
                            theme={theme}
                            colors={colors}
                         />
                         {isAdmin && ( // Only show batch adjustment to admins
                             <div className="d-grid gap-2 mt-4">
                                <Button variant="outline-secondary" size="sm" onClick={() => setShowBatchPriceAdjustment(true)} style={{color: colors.muted, borderColor: colors.border}}>
                                <i className="bi bi-pencil-fill me-2"></i> 批量调整基础价格
                                </Button>
                            </div>
                         )}
                      </Card.Body>
                   </Card>

                    {/* Action Buttons */}
                    <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
                        <h5 className="mb-0"><i className="bi bi-file-earmark-arrow-down-fill me-2"></i>生成文档</h5>
                        </Card.Header>
                        <Card.Body>
                        <div className="mb-3">
                            <h6>当前配置总价</h6>
                            <Table bordered size="sm" style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.border }}>
                            <tbody>
                                <tr><td>打包成本价</td><td className="text-end">{packagePrice > 0 ? packagePrice.toLocaleString() : '-'} 元</td></tr>
                                <tr style={{ backgroundColor: theme === 'light' ? '#cfe2ff' : '#0a2b5c', color: theme === 'light' ? '#084298' : '#ffffff' }}>
                                <td ><strong>市场报价</strong></td><td className="text-end"><strong>{marketPrice > 0 ? marketPrice.toLocaleString() : '-'} 元</strong></td>
                                </tr>
                            </tbody>
                            </Table>
                        </div>
                        <div className="d-grid gap-2">
                            <Button variant="primary" onClick={handleGenerateQuotation} disabled={loading || !selectedComponents.gearbox} style={{ backgroundColor: colors.primary, borderColor: colors.primary, color: colors.primaryText }}><i className="bi bi-file-earmark-text me-2"></i> 生成报价单</Button>
                            <Button variant="outline-success" onClick={handleGenerateAgreement} disabled={loading || !selectedComponents.gearbox}><i className="bi bi-file-earmark-richtext me-2"></i> 生成技术协议</Button>
                            <Button variant="outline-info" onClick={handleGenerateContract} disabled={loading || !selectedComponents.gearbox || !quotation}><i className="bi bi-file-earmark-medical me-2"></i> 生成销售合同 {(!quotation && selectedComponents.gearbox) && <small>(需先生成报价)</small>}</Button>
                        </div>
                        </Card.Body>
                    </Card>
                </Col>
              </Row>
            </div>
           )}
           {/* Add a message if selection succeeded but no recommendations found */}
            {selectionResult && selectionResult.success && (!Array.isArray(selectionResult.recommendations) || selectionResult.recommendations.length === 0) && (
                <Alert variant="warning" className={`alert-${theme}`}>选型成功，但数据库中没有找到完全满足所有条件的齿轮箱推荐。</Alert>
            )}
        </Tab>

        {/* Quotation Tab */}
        <Tab eventKey="quotation" title={<span><i className="bi bi-file-earmark-text-fill me-1"></i>报价单</span>} disabled={!quotation}>
          {quotation && (<QuotationView quotation={quotation} onExport={handleExportQuotation} onGenerateAgreement={handleGenerateAgreement} onGenerateContract={handleGenerateContract} colors={colors} theme={theme} />)}
        </Tab>

        {/* Agreement Tab */}
        <Tab eventKey="agreement" title={<span><i className="bi bi-file-earmark-richtext-fill me-1"></i>技术协议</span>} disabled={!agreement}>
          {agreement && (<AgreementView agreement={agreement} onExport={handleExportAgreement} onGenerateContract={handleGenerateContract} colors={colors} theme={theme} />)}
        </Tab>

        {/* Contract Tab */}
        <Tab eventKey="contract" title={<span><i className="bi bi-file-earmark-medical-fill me-1"></i>销售合同</span>} disabled={!contract}>
          {contract && (<ContractView contract={contract} onExportWord={() => handleExportContract('word')} onExportPDF={() => handleExportContract('pdf')} colors={colors} theme={theme} />)}
        </Tab>

        {/* History Tab */}
        <Tab eventKey="history" title={<span><i className="bi bi-clock-history me-1"></i>选型历史 ({selectionHistory.length})</span>} disabled={selectionHistory.length === 0}>
            <Card className="mt-3 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderColor: colors.border }}>历史选型记录 (最近 {selectionHistory.length} 条)</Card.Header>
                <Card.Body>
                {selectionHistory.length > 0 ? (
                    <Table striped bordered hover responsive size="sm" style={{ color: colors.text, backgroundColor: colors.inputBg, borderColor: colors.border }}>
                    <thead style={{backgroundColor: colors.headerBg, color: colors.headerText}}>
                        <tr><th>#</th><th>时间</th><th>项目名称</th><th>客户名称</th><th>主机 (kW@rpm)</th><th>速比</th><th>选定齿轮箱</th><th>操作</th></tr>
                    </thead>
                    <tbody>
                        {selectionHistory.map((entry, index) => (
                        <tr key={entry.id}>
                            <td>{index + 1}</td>
                            <td>{new Date(entry.timestamp).toLocaleString()}</td>
                            <td>{entry.projectInfo?.projectName || '-'}</td>
                            <td>{entry.projectInfo?.customerName || '-'}</td>
                            <td>{entry.engineData?.power || '?'}@{entry.engineData?.speed || '?'}</td>
                            <td>{entry.requirementData?.targetRatio || '-'}</td>
                             {/* Safely access the top recommendation model */}
                            <td>{entry.selectionResult?.recommendations?.[0]?.model || 'N/A'}</td>
                            <td>
                            <Button variant="outline-info" size="sm" onClick={() => handleLoadHistoryEntry(entry.id)} className="me-2" title="加载此历史记录"><i className="bi bi-box-arrow-down"></i> 加载</Button>
                            <Button variant="outline-danger" size="sm" onClick={() => handleDeleteHistoryEntry(entry.id)} title="删除此历史记录"><i className="bi bi-trash"></i> 删除</Button>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </Table>
                ) : (<p style={{ color: colors.muted }}>暂无选型历史记录。</p>)}
                </Card.Body>
            </Card>
        </Tab>

        {/* Data Query Tab */}
        <Tab eventKey="query" title={<span><i className="bi bi-search me-1"></i>数据查询</span>}>
           <DataQuery appData={appData} colors={colors} theme={theme}/>
        </Tab>
      </Tabs>

      {/* Batch Price Adjustment Modal */}
      <BatchPriceAdjustment
        show={showBatchPriceAdjustment}
        onHide={() => setShowBatchPriceAdjustment(false)}
        onApply={handleBatchPriceAdjustment} // Pass memoized handler
        theme={theme}
        colors={colors} // Pass colors for styling consistency
      />

       {/* Footer */}
      <footer className="mt-5 pt-4 text-center" style={{ borderTop: `1px solid ${colors.border}`, color: colors.muted, fontSize: '0.85rem' }}>
        <p className="mb-1">© {new Date().getFullYear()} 杭州前进齿轮箱集团股份有限公司</p>
        <p className="mb-0">船用齿轮箱选型与报价系统 v1.5.1</p>
      </footer>
    </Container>
  );
}

// Now we set up the main routing
function AppWithRoutes({ appData, setAppData }) {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={
        <ProtectedRoute>
          <App appData={appData} setAppData={setAppData} />
        </ProtectedRoute>
      } />
      <Route path="/users" element={
        <ProtectedRoute requiredRoles={[userRoles.ADMIN, userRoles.SUPER_ADMIN]}>
          <UserManagementView appData={appData} setAppData={setAppData} />
        </ProtectedRoute>
      } />
      <Route path="/database" element={
        <ProtectedRoute requiredRoles={[userRoles.ADMIN, userRoles.SUPER_ADMIN]}>
          <DatabaseManagementView appData={appData} setAppData={setAppData} />
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export { AppWithRoutes as default, App };