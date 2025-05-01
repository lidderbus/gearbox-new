// src/components/PriceMaintenanceTool.js
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Table, Form, InputGroup, Alert, Spinner, Row, Col, Tab, Tabs, Badge, Modal } from 'react-bootstrap';
import Papa from 'papaparse'; // 确保已安装 papaparse
import { calculateFactoryPrice, calculateMarketPrice, getStandardDiscountRate } from '../utils/priceManager';
import { parseTextPriceTable, calculateDiscountRates } from '../utils/officialPriceParser';
import { savePriceHistory, getPriceHistory, compareAndTrackChanges } from '../utils/priceHistoryTracker';
import PriceComparisonTool from './PriceComparisonTool';

/**
 * 价格数据维护工具组件
 * 提供价格数据的查看、编辑、导入和批量调整功能
 */
const PriceMaintenanceTool = ({ appData, setAppData, theme = 'light', colors }) => {
  // 状态变量
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedSeries, setSelectedSeries] = useState('hcGearboxes');
  const [priceData, setPriceData] = useState([]);
  const [originalData, setOriginalData] = useState([]); // 用于比较和历史记录
  const [showImportModal, setShowImportModal] = useState(false);
  const [importType, setImportType] = useState('csv');
  const [importText, setImportText] = useState('');
  const [bulkUpdateConfig, setBulkUpdateConfig] = useState({
    updateField: 'basePrice',
    method: 'percentage',
    value: '',
    reason: ''
  });
  const [showOfficialPriceModal, setShowOfficialPriceModal] = useState(false);
  const [officialPriceData, setOfficialPriceData] = useState([]);
  const [selectedOfficialItems, setSelectedOfficialItems] = useState([]);
  const [activeTab, setActiveTab] = useState('priceTable');
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [priceHistory, setPriceHistory] = useState([]);
  const [selectedHistoryEntry, setSelectedHistoryEntry] = useState(null);
  
  // 文件输入引用
  const fileInputRef = useRef(null);
  
  // 可用的系列
  const seriesOptions = [
    { value: 'hcGearboxes', label: 'HC系列齿轮箱' },
    { value: 'gwGearboxes', label: 'GW系列齿轮箱' },
    { value: 'hcmGearboxes', label: 'HCM系列齿轮箱' },
    { value: 'dtGearboxes', label: 'DT系列齿轮箱' },
    { value: 'hcqGearboxes', label: 'HCQ系列齿轮箱' },
    { value: 'gcGearboxes', label: 'GC系列齿轮箱' },
    { value: 'flexibleCouplings', label: '高弹性联轴器' },
    { value: 'standbyPumps', label: '备用泵' }
  ];
  
  // 价格字段
  const priceFields = [
    { value: 'basePrice', label: '基础价格' },
    { value: 'price', label: '当前价格' },
    { value: 'discountRate', label: '折扣率' },
    { value: 'factoryPrice', label: '出厂价格' },
    { value: 'packagePrice', label: '打包价格' },
    { value: 'marketPrice', label: '市场价格' }
  ];

  // 添加调试输出以检查 appData
  useEffect(() => {
    // 检查 appData 是否存在以及其包含的数据
    console.log('PriceMaintenanceTool - appData:', appData);
    if (appData) {
      console.log('PriceMaintenanceTool - 可用系列:', Object.keys(appData));
      seriesOptions.forEach(option => {
        const seriesData = appData[option.value];
        console.log(`系列 ${option.value} 数据数量:`, Array.isArray(seriesData) ? seriesData.length : '无数据');
      });
    }
  }, [appData]);
  
  // 初始化系列选择，确保默认选择一个有数据的系列
  useEffect(() => {
    if (appData) {
      // 尝试找到第一个有数据的系列
      const seriesWithData = seriesOptions.find(option => 
        Array.isArray(appData[option.value]) && appData[option.value].length > 0
      );
      
      if (seriesWithData) {
        setSelectedSeries(seriesWithData.value);
        console.log('自动选择了有数据的系列:', seriesWithData.value);
      }
    }
  }, [appData]);

  // 初始化数据
  useEffect(() => {
    // 确保 appData 和选定的系列存在
    if (appData && selectedSeries) {
      // 如果选定系列存在且是数组，则使用它
      if (appData[selectedSeries] && Array.isArray(appData[selectedSeries])) {
        const currentData = [...appData[selectedSeries]];
        setPriceData(currentData);
        setOriginalData(JSON.parse(JSON.stringify(currentData))); // 深拷贝用于比较
        // 清除错误消息
        setError('');
      } else {
        // 如果选定系列不存在或不是数组，显示空数组和错误消息
        setPriceData([]);
        setOriginalData([]);
        setError(`未找到${selectedSeries}的数据或数据格式不正确`);
      }
    } else {
      // 如果 appData 或 selectedSeries 不存在
      setPriceData([]);
      setOriginalData([]);
      
      if (!appData) {
        setError('应用数据未加载');
      } else {
        setError('未选择产品系列');
      }
    }
  }, [appData, selectedSeries]); // 不要在依赖项中包含 error
  
  // 加载价格历史
  useEffect(() => {
    setPriceHistory(getPriceHistory());
  }, []);

  // 切换选择的系列
  const handleSeriesChange = (e) => {
    const series = e.target.value;
    setSelectedSeries(series);
    
    // 数据加载逻辑已移至 useEffect
    // 这里只需设置系列，useEffect 会处理数据加载
  };

  // 处理单个价格字段变更
  const handlePriceChange = (index, field, value) => {
    if (!priceData) return;
    
    // 解析数值
    const numValue = parseFloat(value);
    if (isNaN(numValue) && field !== 'model') return;
    
    // 创建新的数据副本
    const updatedData = [...priceData];
    const item = { ...updatedData[index] };
    
    if (field === 'discountRate') {
      // 折扣率需要转换为0-1之间的小数
      item[field] = numValue / 100;
    } else if (field !== 'model') {
      // 其他数值字段直接赋值
      item[field] = numValue;
    } else {
      // 模型名称字段
      item[field] = value;
    }
    
    // 更新相关字段
    if (field === 'basePrice') {
      item.price = item.basePrice; // 将当前价格同步为基础价格
      
      // 重新计算出厂价
      if (typeof item.discountRate === 'number') {
        item.factoryPrice = calculateFactoryPrice(item);
      }
    } else if (field === 'discountRate') {
      // 重新计算出厂价
      if (typeof item.basePrice === 'number') {
        item.factoryPrice = calculateFactoryPrice(item);
      }
    }
    
    // 更新市场价（如果有必要）
    if (field === 'basePrice' || field === 'discountRate' || field === 'factoryPrice') {
      item.marketPrice = calculateMarketPrice(item, item.factoryPrice);
    }
    
    updatedData[index] = item;
    setPriceData(updatedData);
  };

  // 保存价格变更
  const handleSaveChanges = () => {
    if (!priceData || !appData) return;
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // 创建更新后的应用数据
      const updatedAppData = { ...appData };
      updatedAppData[selectedSeries] = [...priceData];
      
      // 计算变更并记录历史
      const changes = compareAndTrackChanges(originalData, priceData);
      
      if (changes.length > 0) {
        savePriceHistory(changes, `手动更新${seriesOptions.find(s => s.value === selectedSeries)?.label || selectedSeries}价格`);
        setPriceHistory(getPriceHistory());
      }
      
      // 更新应用数据
      setAppData(updatedAppData);
      
      // 更新原始数据（用于下次比较）
      setOriginalData(JSON.parse(JSON.stringify(priceData)));
      
      // 显示成功消息
      setSuccess(`已成功保存${selectedSeries}的价格数据 (${priceData.length}项，${changes.length}个变更)`);
    } catch (err) {
      console.error("保存数据失败:", err);
      setError(`保存数据失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 批量更新价格
  const handleBulkUpdate = () => {
    if (!priceData || priceData.length === 0) {
      setError('没有可更新的数据');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const { updateField, method, value, reason } = bulkUpdateConfig;
      const numValue = parseFloat(value);
      
      if (isNaN(numValue)) {
        throw new Error("请输入有效的数值");
      }
      
      // 创建数据副本并应用批量更新
      const updatedData = [...priceData].map((item, index) => {
        // 每个项目单独处理
        const updated = { ...item };
        
        // 不同调整方式的处理
        if (method === 'percentage') {
          // 百分比调整 (除了discountRate字段)
          if (updateField === 'discountRate') {
            // 折扣率特殊处理 (0-1之间的小数)
            const currentRate = updated.discountRate || 0;
            const adjustmentFactor = numValue / 100; // 转换为小数
            let newRate = currentRate;
            
            if (numValue >= 0) {
              // 增加折扣率 (减少价格)
              newRate = Math.min(1, currentRate + adjustmentFactor * (1 - currentRate));
            } else {
              // 减少折扣率 (增加价格)
              newRate = Math.max(0, currentRate + adjustmentFactor * currentRate);
            }
            
            updated.discountRate = parseFloat(newRate.toFixed(4));
          } else {
            // 其他字段使用百分比调整
            const current = updated[updateField] || 0;
            const newValue = current * (1 + numValue / 100);
            updated[updateField] = Math.max(0, parseFloat(newValue.toFixed(2)));
          }
        } else {
          // 固定金额调整
          if (updateField === 'discountRate') {
            // 折扣率特殊处理 (0-1之间的小数)
            const currentRate = updated.discountRate || 0;
            // 每0.01相当于1个百分点
            const newRate = Math.max(0, Math.min(1, currentRate + numValue / 100));
            updated.discountRate = parseFloat(newRate.toFixed(4));
          } else {
            // 其他字段直接加减金额
            const current = updated[updateField] || 0;
            const newValue = current + numValue;
            updated[updateField] = Math.max(0, parseFloat(newValue.toFixed(2)));
          }
        }
        
        // 更新相关字段
        if (updateField === 'basePrice') {
          updated.price = updated.basePrice; // 将当前价格同步为基础价格
          updated.factoryPrice = calculateFactoryPrice(updated);
          updated.marketPrice = calculateMarketPrice(updated, updated.factoryPrice);
        } else if (updateField === 'discountRate') {
          updated.factoryPrice = calculateFactoryPrice(updated);
          updated.marketPrice = calculateMarketPrice(updated, updated.factoryPrice);
        }
        
        return updated;
      });
      
      // 更新状态
      setPriceData(updatedData);
      
      // 显示成功消息
      const changeDesc = method === 'percentage' 
        ? `调整${numValue > 0 ? '增加' : '减少'} ${Math.abs(numValue)}%` 
        : `调整${numValue > 0 ? '增加' : '减少'} ${Math.abs(numValue)}元`;
      
      setSuccess(`已批量${changeDesc}${priceFields.find(f => f.value === updateField)?.label || updateField}，共更新${updatedData.length}项`);
    } catch (err) {
      console.error("批量更新失败:", err);
      setError(`批量更新失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 点击导入按钮
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // 处理文件选择
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // 根据文件类型决定导入方式
    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.csv')) {
      setImportType('csv');
    } else if (fileName.endsWith('.json')) {
      setImportType('json');
    } else if (fileName.endsWith('.txt')) {
      // 文本文件可能是CSV或JSON，需要进一步判断
      setImportType('csv'); // 默认假设为CSV，用户可在UI中切换
    } else {
      setError('不支持的文件类型，请选择CSV、JSON或TXT文件');
      return;
    }
    
    // 读取文件内容
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImportText(event.target.result.toString());
        setShowImportModal(true);
      }
    };
    reader.onerror = () => {
      setError('读取文件失败');
    };
    
    reader.readAsText(file);
  };

  // 处理导入CSV
  const handleImportCSV = () => {
    if (!importText.trim()) {
      setError('没有可导入的数据');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // 使用PapaParse解析CSV
      Papa.parse(importText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        complete: (results) => {
          if (results.errors && results.errors.length > 0) {
            setError(`CSV解析错误: ${results.errors[0].message}`);
            setLoading(false);
            return;
          }
          
          if (!results.data || results.data.length === 0) {
            setError('CSV解析后没有有效数据');
            setLoading(false);
            return;
          }
          
          // 处理解析后的数据
          handleProcessImportedData(results.data);
        },
        error: (err) => {
          setError(`CSV解析错误: ${err.message}`);
          setLoading(false);
        }
      });
    } catch (err) {
      console.error("导入CSV失败:", err);
      setError(`导入失败: ${err.message}`);
      setLoading(false);
    }
  };

  // 处理导入JSON
  const handleImportJSON = () => {
    if (!importText.trim()) {
      setError('没有可导入的数据');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // 解析JSON
      const jsonData = JSON.parse(importText);
      
      if (!Array.isArray(jsonData)) {
        setError('导入的JSON必须是数组格式');
        setLoading(false);
        return;
      }
      
      if (jsonData.length === 0) {
        setError('JSON中没有数据');
        setLoading(false);
        return;
      }
      
      // 处理解析后的数据
      handleProcessImportedData(jsonData);
    } catch (err) {
      console.error("导入JSON失败:", err);
      setError(`导入失败: ${err.message}`);
      setLoading(false);
    }
  };

  // 处理导入的数据
  const handleProcessImportedData = (importedData) => {
    try {
      // 检查导入的数据是否包含model字段
      const hasModelField = importedData.every(item => item.model || item.型号 || item.Model);
      
      if (!hasModelField) {
        setError('导入的数据需要包含model字段(或型号/Model)');
        setLoading(false);
        return;
      }
      
      // 标准化导入的数据
      const normalizedData = importedData.map(item => {
        const normalizedItem = {};
        
        // 处理型号
        normalizedItem.model = item.model || item.型号 || item.Model || '';
        
        // 处理价格字段
        priceFields.forEach(field => {
          // 查找与该字段匹配的导入数据字段
          const matchingField = Object.keys(item).find(key => 
            key.toLowerCase() === field.value.toLowerCase() || 
            key.toLowerCase() === field.label.toLowerCase()
          );
          
          if (matchingField && item[matchingField] !== null && item[matchingField] !== undefined) {
            const value = parseFloat(item[matchingField]);
            if (!isNaN(value)) {
              if (field.value === 'discountRate' && value > 1) {
                // 如果是百分比格式的折扣率，转换为小数
                normalizedItem[field.value] = value / 100;
              } else {
                normalizedItem[field.value] = value;
              }
            }
          }
        });
        
        return normalizedItem;
      });
      
      // 更新现有数据
      let updatedCount = 0;
      const updatedData = [...priceData];
      
      normalizedData.forEach(importedItem => {
        if (!importedItem.model) return;
        
        // 查找匹配现有数据中的项
        const existingIndex = updatedData.findIndex(item => 
          item.model && item.model.trim().toLowerCase() === importedItem.model.trim().toLowerCase()
        );
        
        if (existingIndex >= 0) {
          // 更新现有项目
          const updatedItem = { ...updatedData[existingIndex] };
          
          // 更新导入的字段
          Object.keys(importedItem).forEach(key => {
            if (key !== 'model' && importedItem[key] !== undefined) {
              updatedItem[key] = importedItem[key];
            }
          });
          
          // 确保价格关系正确
          if (importedItem.basePrice !== undefined) {
            updatedItem.price = updatedItem.basePrice;
            
            if (updatedItem.discountRate !== undefined) {
              updatedItem.factoryPrice = calculateFactoryPrice(updatedItem);
            }
          }
          
          // 重新计算市场价
          if (importedItem.basePrice !== undefined || importedItem.discountRate !== undefined || importedItem.factoryPrice !== undefined) {
            updatedItem.marketPrice = calculateMarketPrice(updatedItem, updatedItem.factoryPrice);
          }
          
          updatedData[existingIndex] = updatedItem;
          updatedCount++;
        }
      });
      
      if (updatedCount === 0) {
        setError('没有找到匹配的型号，未更新任何数据');
      } else {
        // 计算变更并记录历史
        const changes = compareAndTrackChanges(originalData, updatedData);
        
        if (changes.length > 0) {
          savePriceHistory(changes, `从文件导入更新了${seriesOptions.find(s => s.value === selectedSeries)?.label || selectedSeries}的${updatedCount}个型号价格`);
          setPriceHistory(getPriceHistory());
        }
        
        setPriceData(updatedData);
        setSuccess(`成功更新${updatedCount}个型号的价格数据`);
        setShowImportModal(false);
      }
    } catch (err) {
      console.error("处理导入数据失败:", err);
      setError(`处理导入数据失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 加载官方价格文档数据
  const handleLoadOfficialPrices = () => {
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // 解析官方价格文本
      const officialPriceText = `
产品型号    速比    出厂价格    备注
HC300    1.87-5.44    23000    手控、带罩、齿形块、A1型监控
HC400    1.5-5.0    32150    手控、无罩、高弹、A1型监控
HC600A    2.0-3.89    57200    手控、无罩、高弹、A1型监控
HC1000    2.0-5.83    81200    手控、无罩、高弹、A2型监控
HC1200    1.6-4.47    92000    手控、无罩、高弹、A1型监控
HC1600    2.03-4.0    150000    手控、无罩、高弹、A2型监控
HC2000    1.97-4.5    180000    手控、无罩、高弹、A2型监控
GWC28.30    2-6:1    72500    电控或气控、无罩、无飞轮、B1型监控
GWC30.32    2-6:1    90800    电控或气控、无罩、无飞轮、B1型监控
GWC36.39    2-6:1    123800    电控或气控、无罩、无飞轮、B1型监控
GWC45.49    2-6:1    275800    电控或气控、无罩、无飞轮、B1型监控
GWC52.59    2-6:1    545000    电控或气控、无罩、无飞轮、B1型监控
GWC60.66    2-6:1    800000    电控或气控、无罩、无飞轮、B1型监控
GWC70.85    2-6:1    1100000    电控或气控、无罩、无飞轮、监控仪
      `;
      
      // 解析官方价格文本，转换为结构化数据
      const parsedPrices = parseTextPriceTable(officialPriceText);
      
      // 计算折扣率和市场价
      const enhancedPrices = calculateDiscountRates(parsedPrices);
      
      setOfficialPriceData(enhancedPrices);
      setSelectedOfficialItems([]);
      setShowOfficialPriceModal(true);
      setSuccess('成功加载官方价格数据');
    } catch (err) {
      console.error("加载官方价格失败:", err);
      setError(`加载官方价格失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 切换选择官方价格项
  const toggleOfficialItemSelection = (model) => {
    setSelectedOfficialItems(prev => {
      if (prev.includes(model)) {
        return prev.filter(m => m !== model);
      } else {
        return [...prev, model];
      }
    });
  };

  // 应用选中的官方价格
  const applyOfficialPrices = () => {
    if (selectedOfficialItems.length === 0) {
      setError('请先选择要应用的价格项');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // 更新现有数据
      let updatedCount = 0;
      const updatedData = [...priceData];
      
      selectedOfficialItems.forEach(selectedModel => {
        const officialItem = officialPriceData.find(item => item.model === selectedModel);
        if (!officialItem) return;
        
        // 查找匹配现有数据中的项
        const existingIndex = updatedData.findIndex(item => 
          item.model && item.model.trim() === officialItem.model.trim()
        );
        
        if (existingIndex >= 0) {
          // 更新现有项目
          const updatedItem = { ...updatedData[existingIndex] };
          
          // 更新价格字段
          if (officialItem.basePrice !== undefined) {
            updatedItem.basePrice = officialItem.basePrice;
            updatedItem.price = officialItem.basePrice;
          }
          
          if (officialItem.marketPrice !== undefined) {
            updatedItem.marketPrice = officialItem.marketPrice;
          }
          
          if (officialItem.discountRate !== undefined) {
            updatedItem.discountRate = officialItem.discountRate;
          }
          
          if (officialItem.factoryPrice !== undefined) {
            updatedItem.factoryPrice = officialItem.factoryPrice;
          } else if (updatedItem.basePrice > 0 && updatedItem.discountRate !== undefined) {
            // 重新计算出厂价
            updatedItem.factoryPrice = calculateFactoryPrice(updatedItem);
          }
          
          updatedData[existingIndex] = updatedItem;
          updatedCount++;
        }
      });
      
      if (updatedCount === 0) {
        setError('没有匹配的型号，未更新任何数据');
      } else {
        // 计算变更并记录历史
        const changes = compareAndTrackChanges(originalData, updatedData);
        
        if (changes.length > 0) {
          savePriceHistory(changes, `从官方价格文档导入了${updatedCount}个型号的价格数据`);
          setPriceHistory(getPriceHistory());
        }
        
        setPriceData(updatedData);
        setSuccess(`成功应用${updatedCount}个官方价格`);
        setShowOfficialPriceModal(false);
      }
    } catch (err) {
      console.error("应用官方价格失败:", err);
      setError(`应用官方价格失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 同步到折扣价格
  const syncToDiscountPrices = () => {
    if (!priceData || priceData.length === 0) {
      setError('没有可同步的数据');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // 各系列的默认折扣率映射
      const defaultDiscounts = {
        'hcGearboxes': 0.16,  // HC系列默认下浮16%
        'gwGearboxes': 0.10,  // GW系列默认下浮10%
        'hcmGearboxes': 0.16, // HCM系列默认下浮16%
        'dtGearboxes': 0.10,  // DT系列默认下浮10%
        'hcqGearboxes': 0.12, // HCQ系列默认下浮12%
        'gcGearboxes': 0.10,  // GC系列默认下浮10%
        'flexibleCouplings': 0.10, // 联轴器默认下浮10%
        'standbyPumps': 0.10  // 备用泵默认下浮10%
      };
      
      // 特殊型号的折扣率
      const specialDiscounts = {
        // HC系列特殊折扣
        'HC400': 0.22,
        'HC600A': 0.12,
        'HC1000': 0.06,
        'HC1200': 0.14,
        'HC1600': 0.16,
        'HC2000': 0.16,
        // GW系列特殊折扣
        'GWC28.30': 0.10,
        'GWC30.32': 0.10,
        'GWC36.39': 0.10,
        'GWC45.49': 0.10,
        'GWC52.59': 0.10,
        'GWC60.66': 0.10,
        'GWC70.85': 0.10
      };
      
      // 更新折扣率和价格
      const updatedData = priceData.map(item => {
        const newItem = { ...item };
        
        // 使用特殊折扣率或默认折扣率
        const discountRate = specialDiscounts[item.model] !== undefined
          ? specialDiscounts[item.model]
          : defaultDiscounts[selectedSeries] || 0.10;
          
        newItem.discountRate = discountRate;
        
        // 如果有基础价格，重新计算出厂价
        if (newItem.basePrice) {
          newItem.factoryPrice = Math.round(newItem.basePrice * (1 - discountRate));
        }
        
        // 重新计算市场价
        if (newItem.factoryPrice) {
          newItem.marketPrice = Math.round(newItem.factoryPrice * 1.12);
        }
        
        return newItem;
      });
      
      // 计算变更并记录历史
      const changes = compareAndTrackChanges(originalData, updatedData);
      
      if (changes.length > 0) {
        savePriceHistory(changes, `应用折扣率规则同步了${seriesOptions.find(s => s.value === selectedSeries)?.label || selectedSeries}的${updatedData.length}个产品价格`);
        setPriceHistory(getPriceHistory());
      }
      
      // 更新数据
      setPriceData(updatedData);
      setSuccess(`已根据各型号折扣率更新${updatedData.length}个产品的价格`);
    } catch (err) {
      console.error("同步折扣价格失败:", err);
      setError(`同步折扣价格失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 打开历史记录模态框
  const handleOpenHistoryModal = () => {
    setPriceHistory(getPriceHistory());
    setSelectedHistoryEntry(null);
    setShowHistoryModal(true);
  };
  
  // 查看历史记录条目详情
  const handleViewHistoryEntry = (entry) => {
    setSelectedHistoryEntry(entry);
  };

  return (
    <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">价格数据维护工具</h5>
          <div>
            <Badge bg="info" className="me-2">
              {selectedSeries && seriesOptions.find(opt => opt.value === selectedSeries)?.label}
            </Badge>
            <Badge bg="secondary">
              {priceData ? priceData.length : 0} 项
            </Badge>
          </div>
        </div>
      </Card.Header>
      
      <Card.Body>
        {/* 消息显示区域 */}
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            <i className="bi bi-check-circle-fill me-2"></i>
            {success}
          </Alert>
        )}
        
        {/* 工具栏 */}
        <div className="mb-4 d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex flex-wrap align-items-center mb-2 mb-md-0">
            <Form.Group className="me-3 mb-2 mb-md-0">
              <Form.Label>选择产品系列</Form.Label>
              <Form.Select 
                value={selectedSeries} 
                onChange={handleSeriesChange}
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.inputBorder
                }}
              >
                {seriesOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
            
            <Button 
              variant="primary" 
              onClick={handleSaveChanges} 
              disabled={loading}
              className="me-2 mb-2 mb-md-0"
            >
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                  保存中...
                </>
              ) : (
                <>
                  <i className="bi bi-save-fill me-1"></i>
                  保存更改
                </>
              )}
            </Button>
            
            <Button 
              variant="success" 
              onClick={syncToDiscountPrices} 
              disabled={loading}
              className="me-2 mb-2 mb-md-0"
            >
              <i className="bi bi-arrow-repeat me-1"></i>
              同步折扣价
            </Button>
            
            <Button
              variant="outline-secondary"
              onClick={handleOpenHistoryModal}
              disabled={loading}
              className="mb-2 mb-md-0"
            >
              <i className="bi bi-clock-history me-1"></i>
              价格历史
            </Button>
          </div>
          
          <div className="d-flex flex-wrap">
            <Button 
              variant="info" 
              onClick={handleImportClick} 
              disabled={loading}
              className="me-2 mb-2 mb-md-0"
            >
              <i className="bi bi-upload me-1"></i>
              导入价格数据
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
              accept=".csv,.txt,.json"
            />
            
            <Button 
              variant="outline-info" 
              onClick={handleLoadOfficialPrices} 
              disabled={loading}
              className="mb-2 mb-md-0"
            >
              <i className="bi bi-file-earmark-text me-1"></i>
              导入官方价格
            </Button>
          </div>
        </div>
        
        {/* 内容标签页 */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          {/* 价格表标签页 */}
          <Tab eventKey="priceTable" title="价格表">
            <div className="table-responsive">
              {priceData && priceData.length > 0 ? (
                <Table striped bordered hover responsive size="sm">
                  <thead>
                    <tr>
                      <th style={{ width: '50px' }}>#</th>
                      <th style={{ width: '150px' }}>型号</th>
                      <th>基础价格 (元)</th>
                      <th>折扣率 (%)</th>
                      <th>出厂价格 (元)</th>
                      <th>市场价格 (元)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {priceData.map((item, index) => (
                      <tr key={`${item.model}-${index}`}>
                        <td>{index + 1}</td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="text"
                            value={item.model || ''}
                            onChange={(e) => handlePriceChange(index, 'model', e.target.value)}
                            style={{
                              backgroundColor: colors.inputBg,
                              color: colors.text,
                              borderColor: colors.inputBorder
                            }}
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            value={item.basePrice || 0}
                            onChange={(e) => handlePriceChange(index, 'basePrice', e.target.value)}
                            style={{
                              backgroundColor: colors.inputBg,
                              color: colors.text,
                              borderColor: colors.inputBorder
                            }}
                          />
                        </td>
                        <td>
                          <InputGroup size="sm">
                            <Form.Control
                              type="number"
                              value={((item.discountRate || 0) * 100).toFixed(0)}
                              onChange={(e) => handlePriceChange(index, 'discountRate', e.target.value)}
                              min="0"
                              max="100"
                              style={{
                                backgroundColor: colors.inputBg,
                                color: colors.text,
                                borderColor: colors.inputBorder
                              }}
                            />
                            <InputGroup.Text style={{
                              backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
                              color: colors.text,
                              borderColor: colors.inputBorder
                            }}>%</InputGroup.Text>
                          </InputGroup>
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            value={item.factoryPrice || 0}
                            onChange={(e) => handlePriceChange(index, 'factoryPrice', e.target.value)}
                            style={{
                              backgroundColor: colors.inputBg,
                              color: colors.text,
                              borderColor: colors.inputBorder
                            }}
                          />
                        </td>
                        <td>
                          <Form.Control
                            size="sm"
                            type="number"
                            value={item.marketPrice || 0}
                            onChange={(e) => handlePriceChange(index, 'marketPrice', e.target.value)}
                            style={{
                              backgroundColor: colors.inputBg,
                              color: colors.text,
                              borderColor: colors.inputBorder
                            }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Alert variant="info">
                  {loading ? '正在加载数据...' : '没有可显示的价格数据'}
                </Alert>
              )}
            </div>
          </Tab>
          
          {/* 批量更新标签页 */}
          <Tab eventKey="bulkUpdate" title="批量更新">
            <div className="p-4 border rounded" style={{ borderColor: colors.border }}>
              <h5 className="mb-3">批量价格调整</h5>
              
              <Form>
                <Row className="g-3">
                 <Col md={3}>
                    <Form.Group>
                      <Form.Label>选择更新字段</Form.Label>
                      <Form.Select 
                        value={bulkUpdateConfig.updateField} 
                        onChange={(e) => setBulkUpdateConfig({...bulkUpdateConfig, updateField: e.target.value})}
                        style={{
                          backgroundColor: colors.inputBg,
                          color: colors.text,
                          borderColor: colors.inputBorder
                        }}
                      >
                        {priceFields.map(field => (
                          <option key={field.value} value={field.value}>{field.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>调整方式</Form.Label>
                      <Form.Select 
                        value={bulkUpdateConfig.method} 
                        onChange={(e) => setBulkUpdateConfig({...bulkUpdateConfig, method: e.target.value})}
                        style={{
                          backgroundColor: colors.inputBg,
                          color: colors.text,
                          borderColor: colors.inputBorder
                        }}
                      >
                        <option value="percentage">百分比</option>
                        <option value="amount">固定金额</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>调整值</Form.Label>
                      <InputGroup>
                        <Form.Control 
                          type="number" 
                          value={bulkUpdateConfig.value} 
                          onChange={(e) => setBulkUpdateConfig({...bulkUpdateConfig, value: e.target.value})}
                          placeholder={bulkUpdateConfig.method === 'percentage' ? "如10表示增加10%" : "如1000表示增加1000元"}
                          style={{
                            backgroundColor: colors.inputBg,
                            color: colors.text,
                            borderColor: colors.inputBorder
                          }}
                        />
                        <InputGroup.Text style={{
                          backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
                          color: colors.text,
                          borderColor: colors.inputBorder
                        }}>
                          {bulkUpdateConfig.method === 'percentage' ? '%' : '元'}
                        </InputGroup.Text>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        {bulkUpdateConfig.method === 'percentage' 
                          ? '正值表示涨价，负值表示降价，例如: 10 表示价格上涨10%' 
                          : '正值表示增加，负值表示减少，例如: 1000 表示增加1000元'}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                  
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>变更原因(可选)</Form.Label>
                      <Form.Control
                        type="text"
                        value={bulkUpdateConfig.reason}
                        onChange={(e) => setBulkUpdateConfig({...bulkUpdateConfig, reason: e.target.value})}
                        placeholder="如：市场调价、成本上涨等"
                        style={{
                          backgroundColor: colors.inputBg,
                          color: colors.text,
                          borderColor: colors.inputBorder
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <div className="d-flex justify-content-end mt-4">
                  <Button 
                    variant="primary" 
                    onClick={handleBulkUpdate}
                    disabled={loading || !bulkUpdateConfig.value}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                        更新中...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-all me-1"></i>
                        应用批量更新
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </div>
          </Tab>
          
          {/* 价格对比标签页 */}
          <Tab eventKey="priceComparison" title="价格对比">
            <PriceComparisonTool
              currentData={priceData}
              previousData={originalData}
              theme={theme}
              colors={colors}
            />
          </Tab>
        </Tabs>
      </Card.Body>
      
      {/* 导入模态框 */}
      <Modal 
        show={showImportModal} 
        onHide={() => setShowImportModal(false)}
        backdrop="static"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>导入价格数据</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6>导入格式</h6>
            <Form.Check
              inline
              type="radio"
              label="CSV格式"
              name="importType"
              id="import-csv"
              checked={importType === 'csv'}
              onChange={() => setImportType('csv')}
            />
            <Form.Check
              inline
              type="radio"
              label="JSON格式"
              name="importType"
              id="import-json"
              checked={importType === 'json'}
              onChange={() => setImportType('json')}
            />
          </div>
          
          <Form.Group className="mb-3">
            <Form.Label>{importType === 'csv' ? 'CSV内容' : 'JSON内容'}</Form.Label>
            <Form.Control
              as="textarea"
              rows={10}
              value={importText}
              onChange={(e) => setImportText(e.target.value)}
              style={{
                backgroundColor: colors.inputBg,
                color: colors.text,
                borderColor: colors.inputBorder,
                fontFamily: 'monospace',
                fontSize: '0.9rem'
              }}
            />
            <Form.Text className="text-muted">
              {importType === 'csv' 
                ? 'CSV格式需要包含表头行，且至少包含model字段和价格字段' 
                : 'JSON格式应为对象数组，每个对象至少包含model字段和价格字段'}
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowImportModal(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button 
            variant="primary" 
            onClick={importType === 'csv' ? handleImportCSV : handleImportJSON}
            disabled={loading || !importText.trim()}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                导入中...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-1"></i>
                确认导入
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* 官方价格模态框 */}
      <Modal 
        show={showOfficialPriceModal} 
        onHide={() => setShowOfficialPriceModal(false)}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>导入官方价格</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <Alert variant="info">
              以下是从官方价格文档中提取的价格数据。请选择要应用的项目，然后点击"应用所选价格"。
            </Alert>
          </div>
          
          <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Table striped bordered hover size="sm">
              <thead>
                <tr>
                  <th style={{ width: '50px' }}>
                    <Form.Check
                      type="checkbox"
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedOfficialItems(officialPriceData.map(item => item.model));
                        } else {
                          setSelectedOfficialItems([]);
                        }
                      }}
                      checked={selectedOfficialItems.length === officialPriceData.length && officialPriceData.length > 0}
                    />
                  </th>
                  <th>型号</th>
                  <th>基础价格 (元)</th>
                  <th>出厂价格 (元)</th>
                  <th>市场价格 (元)</th>
                  <th>折扣率 (%)</th>
                </tr>
              </thead>
              <tbody>
                {officialPriceData.map((item, index) => (
                  <tr key={`${item.model}-${index}`}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedOfficialItems.includes(item.model)}
                        onChange={() => toggleOfficialItemSelection(item.model)}
                      />
                    </td>
                    <td>{item.model}</td>
                    <td>{item.basePrice}</td>
                    <td>{item.factoryPrice || Math.round(item.basePrice * (1 - (item.discountRate || 0)))}</td>
                    <td>{item.marketPrice}</td>
                    <td>{((item.discountRate || 0) * 100).toFixed(0)}%</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowOfficialPriceModal(false)}
            disabled={loading}
          >
            取消
          </Button>
          <Button 
            variant="primary" 
            onClick={applyOfficialPrices}
            disabled={loading || selectedOfficialItems.length === 0}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                应用中...
              </>
            ) : (
              <>
                <i className="bi bi-check2-all me-1"></i>
                应用所选价格 ({selectedOfficialItems.length})
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
      
      {/* 价格历史模态框 */}
      <Modal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        backdrop="static"
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>价格变更历史</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col md={selectedHistoryEntry ? 5 : 12}>
              <div className="mb-3">
                <h6>历史记录列表</h6>
                {priceHistory.length === 0 ? (
                  <Alert variant="info">
                    没有找到价格变更历史记录。
                  </Alert>
                ) : (
                  <div className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                    {priceHistory.map((entry) => (
                      <button
                        key={entry.id}
                        type="button"
                        className={`list-group-item list-group-item-action ${selectedHistoryEntry?.id === entry.id ? 'active' : ''}`}
                        onClick={() => handleViewHistoryEntry(entry)}
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{entry.reason || '价格变更'}</h6>
                          <small>{new Date(entry.timestamp).toLocaleString()}</small>
                        </div>
                        <p className="mb-1">
                          变更 {entry.itemCount} 个产品的价格
                        </p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </Col>
            
            {selectedHistoryEntry && (
              <Col md={7}>
                <div className="mb-3">
                  <h6>变更详情</h6>
                  <div className="border p-3 mb-3 rounded">
                    <p className="mb-1"><strong>变更时间:</strong> {new Date(selectedHistoryEntry.timestamp).toLocaleString()}</p>
                    <p className="mb-1"><strong>变更原因:</strong> {selectedHistoryEntry.reason || '未指定'}</p>
                    <p className="mb-0"><strong>变更数量:</strong> {selectedHistoryEntry.itemCount} 个产品</p>
                  </div>
                  
                  <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>型号</th>
                          <th>基础价格变化</th>
                          <th>市场价格变化</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedHistoryEntry.changes.map((change, index) => (
                          <tr key={index}>
                            <td>{change.model}</td>
                            <td>
                              {change.oldBasePrice !== null ? (
                                <>
                                  {change.oldBasePrice} → {change.newBasePrice}
                                  {change.oldBasePrice && change.newBasePrice && (
                                    <Badge
                                      bg={change.newBasePrice > change.oldBasePrice ? 'danger' : change.newBasePrice < change.oldBasePrice ? 'success' : 'secondary'}
                                      className="ms-2"
                                    >
                                      {change.newBasePrice > change.oldBasePrice ? '+' : ''}
                                      {Math.round((change.newBasePrice - change.oldBasePrice) / change.oldBasePrice * 100)}%
                                    </Badge>
                                  )}
                                </>
                              ) : change.newBasePrice ? (
                                <Badge bg="primary">新增</Badge>
                              ) : (
                                <Badge bg="danger">删除</Badge>
                              )}
                            </td>
                            <td>
                              {change.oldMarketPrice !== null ? (
                                <>
                                  {change.oldMarketPrice} → {change.newMarketPrice}
                                  {change.oldMarketPrice && change.newMarketPrice && (
                                    <Badge
                                      bg={change.newMarketPrice > change.oldMarketPrice ? 'danger' : change.newMarketPrice < change.oldMarketPrice ? 'success' : 'secondary'}
                                      className="ms-2"
                                    >
                                      {change.newMarketPrice > change.oldMarketPrice ? '+' : ''}
                                      {Math.round((change.newMarketPrice - change.oldMarketPrice) / change.oldMarketPrice * 100)}%
                                    </Badge>
                                  )}
                                </>
                              ) : change.newMarketPrice ? (
                                <Badge bg="primary">新增</Badge>
                              ) : (
                                <Badge bg="danger">删除</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowHistoryModal(false)}
          >
            关闭
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default PriceMaintenanceTool;