// src/components/PriceMaintenanceTool.js
// 价格数据维护工具组件 - 重构版本，使用子组件
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Card, Button, Form, Alert, Spinner, Tab, Tabs, Badge } from 'react-bootstrap';
import Papa from 'papaparse';
import { calculateFactoryPrice, calculateMarketPrice } from '../utils/priceManager';
import { parseTextPriceTable, calculateDiscountRates } from '../utils/officialPriceParser';
import { savePriceHistory, getPriceHistory, compareAndTrackChanges } from '../utils/priceHistoryTracker';
import PriceComparisonTool from './PriceComparisonTool';

// 导入子组件
import {
  PriceTable,
  BulkUpdatePanel,
  ImportModal,
  OfficialPriceModal,
  PriceHistoryModal
} from './PriceMaintenanceTool/index';

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
  const [originalData, setOriginalData] = useState([]);
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

  const fileInputRef = useRef(null);

  // 初始化系列选择
  useEffect(() => {
    if (appData) {
      const seriesWithData = seriesOptions.find(option =>
        Array.isArray(appData[option.value]) && appData[option.value].length > 0
      );
      if (seriesWithData) {
        setSelectedSeries(seriesWithData.value);
      }
    }
  }, [appData]);

  // 初始化数据
  useEffect(() => {
    if (appData && selectedSeries) {
      if (appData[selectedSeries] && Array.isArray(appData[selectedSeries])) {
        const currentData = [...appData[selectedSeries]];
        setPriceData(currentData);
        setOriginalData(JSON.parse(JSON.stringify(currentData)));
        setError('');
      } else {
        setPriceData([]);
        setOriginalData([]);
        setError(`未找到${selectedSeries}的数据或数据格式不正确`);
      }
    } else {
      setPriceData([]);
      setOriginalData([]);
      if (!appData) {
        setError('应用数据未加载');
      }
    }
  }, [appData, selectedSeries]);

  // 加载价格历史
  useEffect(() => {
    setPriceHistory(getPriceHistory());
  }, []);

  // 处理单个价格字段变更
  const handlePriceChange = useCallback((index, field, value) => {
    setPriceData(prevData => {
      if (!prevData) return prevData;
      const numValue = parseFloat(value);
      if (isNaN(numValue) && field !== 'model') return prevData;

      const updatedData = [...prevData];
      const item = { ...updatedData[index] };

      if (field === 'discountRate') {
        item[field] = numValue / 100;
      } else if (field !== 'model') {
        item[field] = numValue;
      } else {
        item[field] = value;
      }

      if (field === 'basePrice') {
        item.price = item.basePrice;
        if (typeof item.discountRate === 'number') {
          item.factoryPrice = calculateFactoryPrice(item);
        }
      } else if (field === 'discountRate') {
        if (typeof item.basePrice === 'number') {
          item.factoryPrice = calculateFactoryPrice(item);
        }
      }

      if (field === 'basePrice' || field === 'discountRate' || field === 'factoryPrice') {
        item.marketPrice = calculateMarketPrice(item, item.factoryPrice);
      }

      updatedData[index] = item;
      return updatedData;
    });
  }, []);

  // 保存价格变更
  const handleSaveChanges = () => {
    if (!priceData || !appData) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const updatedAppData = { ...appData };
      updatedAppData[selectedSeries] = [...priceData];

      const changes = compareAndTrackChanges(originalData, priceData);

      if (changes.length > 0) {
        savePriceHistory(changes, `手动更新${seriesOptions.find(s => s.value === selectedSeries)?.label || selectedSeries}价格`);
        setPriceHistory(getPriceHistory());
      }

      setAppData(updatedAppData);
      setOriginalData(JSON.parse(JSON.stringify(priceData)));
      setSuccess(`已成功保存${selectedSeries}的价格数据 (${priceData.length}项，${changes.length}个变更)`);
    } catch (err) {
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
      const { updateField, method, value } = bulkUpdateConfig;
      const numValue = parseFloat(value);

      if (isNaN(numValue)) {
        throw new Error("请输入有效的数值");
      }

      const updatedData = [...priceData].map(item => {
        const updated = { ...item };

        if (method === 'percentage') {
          if (updateField === 'discountRate') {
            const currentRate = updated.discountRate || 0;
            const adjustmentFactor = numValue / 100;
            let newRate = currentRate;
            if (numValue >= 0) {
              newRate = Math.min(1, currentRate + adjustmentFactor * (1 - currentRate));
            } else {
              newRate = Math.max(0, currentRate + adjustmentFactor * currentRate);
            }
            updated.discountRate = parseFloat(newRate.toFixed(4));
          } else {
            const current = updated[updateField] || 0;
            const newValue = current * (1 + numValue / 100);
            updated[updateField] = Math.max(0, parseFloat(newValue.toFixed(2)));
          }
        } else {
          if (updateField === 'discountRate') {
            const currentRate = updated.discountRate || 0;
            const newRate = Math.max(0, Math.min(1, currentRate + numValue / 100));
            updated.discountRate = parseFloat(newRate.toFixed(4));
          } else {
            const current = updated[updateField] || 0;
            const newValue = current + numValue;
            updated[updateField] = Math.max(0, parseFloat(newValue.toFixed(2)));
          }
        }

        if (updateField === 'basePrice') {
          updated.price = updated.basePrice;
          updated.factoryPrice = calculateFactoryPrice(updated);
          updated.marketPrice = calculateMarketPrice(updated, updated.factoryPrice);
        } else if (updateField === 'discountRate') {
          updated.factoryPrice = calculateFactoryPrice(updated);
          updated.marketPrice = calculateMarketPrice(updated, updated.factoryPrice);
        }

        return updated;
      });

      setPriceData(updatedData);

      const changeDesc = method === 'percentage'
        ? `调整${numValue > 0 ? '增加' : '减少'} ${Math.abs(numValue)}%`
        : `调整${numValue > 0 ? '增加' : '减少'} ${Math.abs(numValue)}元`;

      setSuccess(`已批量${changeDesc}${priceFields.find(f => f.value === updateField)?.label || updateField}，共更新${updatedData.length}项`);
    } catch (err) {
      setError(`批量更新失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 处理文件选择
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    if (fileName.endsWith('.csv')) {
      setImportType('csv');
    } else if (fileName.endsWith('.json')) {
      setImportType('json');
    } else if (fileName.endsWith('.txt')) {
      setImportType('csv');
    } else {
      setError('不支持的文件类型，请选择CSV、JSON或TXT文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImportText(event.target.result.toString());
        setShowImportModal(true);
      }
    };
    reader.onerror = () => setError('读取文件失败');
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

    Papa.parse(importText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
      complete: (results) => {
        if (results.errors?.length > 0) {
          setError(`CSV解析错误: ${results.errors[0].message}`);
          setLoading(false);
          return;
        }
        if (!results.data || results.data.length === 0) {
          setError('CSV解析后没有有效数据');
          setLoading(false);
          return;
        }
        handleProcessImportedData(results.data);
      },
      error: (err) => {
        setError(`CSV解析错误: ${err.message}`);
        setLoading(false);
      }
    });
  };

  // 处理导入JSON
  const handleImportJSON = () => {
    if (!importText.trim()) {
      setError('没有可导入的数据');
      return;
    }

    setLoading(true);
    setError('');

    try {
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
      handleProcessImportedData(jsonData);
    } catch (err) {
      setError(`导入失败: ${err.message}`);
      setLoading(false);
    }
  };

  // 处理导入的数据
  const handleProcessImportedData = (importedData) => {
    try {
      const hasModelField = importedData.every(item => item.model || item.型号 || item.Model);
      if (!hasModelField) {
        setError('导入的数据需要包含model字段(或型号/Model)');
        setLoading(false);
        return;
      }

      const normalizedData = importedData.map(item => {
        const normalizedItem = {};
        normalizedItem.model = item.model || item.型号 || item.Model || '';

        priceFields.forEach(field => {
          const matchingField = Object.keys(item).find(key =>
            key.toLowerCase() === field.value.toLowerCase() ||
            key.toLowerCase() === field.label.toLowerCase()
          );

          if (matchingField && item[matchingField] !== null && item[matchingField] !== undefined) {
            const value = parseFloat(item[matchingField]);
            if (!isNaN(value)) {
              if (field.value === 'discountRate' && value > 1) {
                normalizedItem[field.value] = value / 100;
              } else {
                normalizedItem[field.value] = value;
              }
            }
          }
        });

        return normalizedItem;
      });

      let updatedCount = 0;
      const updatedData = [...priceData];

      normalizedData.forEach(importedItem => {
        if (!importedItem.model) return;

        const existingIndex = updatedData.findIndex(item =>
          item.model && item.model.trim().toLowerCase() === importedItem.model.trim().toLowerCase()
        );

        if (existingIndex >= 0) {
          const updatedItem = { ...updatedData[existingIndex] };

          Object.keys(importedItem).forEach(key => {
            if (key !== 'model' && importedItem[key] !== undefined) {
              updatedItem[key] = importedItem[key];
            }
          });

          if (importedItem.basePrice !== undefined) {
            updatedItem.price = updatedItem.basePrice;
            if (updatedItem.discountRate !== undefined) {
              updatedItem.factoryPrice = calculateFactoryPrice(updatedItem);
            }
          }

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
      setError(`处理导入数据失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 加载官方价格
  const handleLoadOfficialPrices = () => {
    setLoading(true);
    setError('');

    try {
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

      const parsedPrices = parseTextPriceTable(officialPriceText);
      const enhancedPrices = calculateDiscountRates(parsedPrices);

      setOfficialPriceData(enhancedPrices);
      setSelectedOfficialItems([]);
      setShowOfficialPriceModal(true);
      setSuccess('成功加载官方价格数据');
    } catch (err) {
      setError(`加载官方价格失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 应用官方价格
  const applyOfficialPrices = () => {
    if (selectedOfficialItems.length === 0) {
      setError('请先选择要应用的价格项');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let updatedCount = 0;
      const updatedData = [...priceData];

      selectedOfficialItems.forEach(selectedModel => {
        const officialItem = officialPriceData.find(item => item.model === selectedModel);
        if (!officialItem) return;

        const existingIndex = updatedData.findIndex(item =>
          item.model && item.model.trim() === officialItem.model.trim()
        );

        if (existingIndex >= 0) {
          const updatedItem = { ...updatedData[existingIndex] };

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
            updatedItem.factoryPrice = calculateFactoryPrice(updatedItem);
          }

          updatedData[existingIndex] = updatedItem;
          updatedCount++;
        }
      });

      if (updatedCount === 0) {
        setError('没有匹配的型号，未更新任何数据');
      } else {
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
      setError(`应用官方价格失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 同步折扣价格
  const syncToDiscountPrices = () => {
    if (!priceData || priceData.length === 0) {
      setError('没有可同步的数据');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const defaultDiscounts = {
        'hcGearboxes': 0.16, 'gwGearboxes': 0.10, 'hcmGearboxes': 0.16,
        'dtGearboxes': 0.10, 'hcqGearboxes': 0.12, 'gcGearboxes': 0.10,
        'flexibleCouplings': 0.10, 'standbyPumps': 0.10
      };

      const specialDiscounts = {
        'HC400': 0.22, 'HC600A': 0.12, 'HC1000': 0.06, 'HC1200': 0.14,
        'HC1600': 0.16, 'HC2000': 0.16, 'GWC28.30': 0.10, 'GWC30.32': 0.10,
        'GWC36.39': 0.10, 'GWC45.49': 0.10, 'GWC52.59': 0.10,
        'GWC60.66': 0.10, 'GWC70.85': 0.10
      };

      const updatedData = priceData.map(item => {
        const newItem = { ...item };
        const discountRate = specialDiscounts[item.model] !== undefined
          ? specialDiscounts[item.model]
          : defaultDiscounts[selectedSeries] || 0.10;

        newItem.discountRate = discountRate;
        if (newItem.basePrice) {
          newItem.factoryPrice = Math.round(newItem.basePrice * (1 - discountRate));
        }
        if (newItem.factoryPrice) {
          newItem.marketPrice = Math.round(newItem.factoryPrice * 1.12);
        }
        return newItem;
      });

      const changes = compareAndTrackChanges(originalData, updatedData);
      if (changes.length > 0) {
        savePriceHistory(changes, `应用折扣率规则同步了${seriesOptions.find(s => s.value === selectedSeries)?.label || selectedSeries}的${updatedData.length}个产品价格`);
        setPriceHistory(getPriceHistory());
      }

      setPriceData(updatedData);
      setSuccess(`已根据各型号折扣率更新${updatedData.length}个产品的价格`);
    } catch (err) {
      setError(`同步折扣价格失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
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
            <Badge bg="secondary">{priceData ? priceData.length : 0} 项</Badge>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>{error}
          </Alert>
        )}

        {success && (
          <Alert variant="success" onClose={() => setSuccess('')} dismissible>
            <i className="bi bi-check-circle-fill me-2"></i>{success}
          </Alert>
        )}

        {/* 工具栏 */}
        <div className="mb-4 d-flex flex-wrap justify-content-between align-items-center">
          <div className="d-flex flex-wrap align-items-center mb-2 mb-md-0">
            <Form.Group className="me-3 mb-2 mb-md-0">
              <Form.Label>选择产品系列</Form.Label>
              <Form.Select
                value={selectedSeries}
                onChange={(e) => setSelectedSeries(e.target.value)}
                style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
              >
                {seriesOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" onClick={handleSaveChanges} disabled={loading} className="me-2 mb-2 mb-md-0">
              {loading ? <><Spinner as="span" animation="border" size="sm" className="me-1" />保存中...</> : <><i className="bi bi-save-fill me-1"></i>保存更改</>}
            </Button>

            <Button variant="success" onClick={syncToDiscountPrices} disabled={loading} className="me-2 mb-2 mb-md-0">
              <i className="bi bi-arrow-repeat me-1"></i>同步折扣价
            </Button>

            <Button variant="outline-secondary" onClick={() => { setPriceHistory(getPriceHistory()); setSelectedHistoryEntry(null); setShowHistoryModal(true); }} disabled={loading} className="mb-2 mb-md-0">
              <i className="bi bi-clock-history me-1"></i>价格历史
            </Button>
          </div>

          <div className="d-flex flex-wrap">
            <Button variant="info" onClick={() => fileInputRef.current?.click()} disabled={loading} className="me-2 mb-2 mb-md-0">
              <i className="bi bi-upload me-1"></i>导入价格数据
            </Button>
            <input type="file" ref={fileInputRef} onChange={handleFileSelect} style={{ display: 'none' }} accept=".csv,.txt,.json" />

            <Button variant="outline-info" onClick={handleLoadOfficialPrices} disabled={loading} className="mb-2 mb-md-0">
              <i className="bi bi-file-earmark-text me-1"></i>导入官方价格
            </Button>
          </div>
        </div>

        {/* 内容标签页 */}
        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="priceTable" title="价格表">
            <PriceTable
              priceData={priceData}
              loading={loading}
              onPriceChange={handlePriceChange}
              colors={colors}
              theme={theme}
            />
          </Tab>

          <Tab eventKey="bulkUpdate" title="批量更新">
            <BulkUpdatePanel
              bulkUpdateConfig={bulkUpdateConfig}
              onConfigChange={setBulkUpdateConfig}
              priceFields={priceFields}
              onBulkUpdate={handleBulkUpdate}
              loading={loading}
              colors={colors}
              theme={theme}
            />
          </Tab>

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

      {/* 模态框 */}
      <ImportModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        importType={importType}
        setImportType={setImportType}
        importText={importText}
        setImportText={setImportText}
        onImportCSV={handleImportCSV}
        onImportJSON={handleImportJSON}
        loading={loading}
        colors={colors}
      />

      <OfficialPriceModal
        show={showOfficialPriceModal}
        onHide={() => setShowOfficialPriceModal(false)}
        officialPriceData={officialPriceData}
        selectedOfficialItems={selectedOfficialItems}
        onToggleSelection={(model) => {
          setSelectedOfficialItems(prev =>
            prev.includes(model) ? prev.filter(m => m !== model) : [...prev, model]
          );
        }}
        onSelectAll={(checked) => {
          setSelectedOfficialItems(checked ? officialPriceData.map(item => item.model) : []);
        }}
        onApply={applyOfficialPrices}
        loading={loading}
      />

      <PriceHistoryModal
        show={showHistoryModal}
        onHide={() => setShowHistoryModal(false)}
        priceHistory={priceHistory}
        selectedHistoryEntry={selectedHistoryEntry}
        onSelectEntry={setSelectedHistoryEntry}
      />
    </Card>
  );
};

export default PriceMaintenanceTool;
