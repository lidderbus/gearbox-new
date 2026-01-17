// src/components/DatabaseManagementView.jsx
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Card, Button, Tabs, Tab, Alert, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { validateDatabase } from '../utils/dataValidator';
import { correctDatabase } from '../utils/dataCorrector';
import { exportDataToJson, exportDataToExcel } from '../utils/dataExporter';
import { importData } from '../utils/optimizedDataImport';
import { mergeDataSources } from '../utils/dataMerger';
import { adaptEnhancedData } from '../utils/dataAdapter';

// Import components
import GearboxDataImporter from './GearboxDataImporter';
import PriceMaintenanceTool from './PriceMaintenanceTool';

// Import data utilities
import { getSeriesInfo } from '../data/couplingSeriesInfo';
import { getMatchingStats } from '../data/couplingGearboxMatching';

// Import sub-components
import {
  OverviewTab,
  ValidationResultsTab,
  CorrectionResultsTab,
  ImportHistoryTab,
  ExportModal,
  ImportModal
} from './DatabaseManagementView/index';

/**
 * DatabaseManagementView组件 - 数据库管理界面
 */
const DatabaseManagementView = ({ appData = {}, setAppData = () => {} }) => {
  // State variables
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [correctionResults, setCorrectionResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importProgress, setImportProgress] = useState(0);
  const [importStatus, setImportStatus] = useState('');
  const [importFiles, setImportFiles] = useState([]);
  const [importOptions, setImportOptions] = useState({
    mergeData: true,
    validateBeforeImport: true,
    autoCorrect: true
  });
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportFormat, setExportFormat] = useState('json');
  const [exportFilename, setExportFilename] = useState('gearbox-data');
  const [exportOptions, setExportOptions] = useState({
    includeGearboxes: true,
    includeCouplings: true,
    includePumps: true,
    includeHistory: false
  });
  const [isImporting, setIsImporting] = useState(false);
  const [importErrorCount, setImportErrorCount] = useState(0);
  const [importHistory, setImportHistory] = useState([]);
  const [theme, setTheme] = useState('light');

  const fileInputRef = useRef(null);

  // Data collections definition
  const dataCollections = [
    { key: 'hcGearboxes', name: 'HC系列齿轮箱', icon: 'gear-fill', color: '#4285F4' },
    { key: 'gwGearboxes', name: 'GW系列齿轮箱', icon: 'gear-wide-connected', color: '#DB4437' },
    { key: 'hcmGearboxes', name: 'HCM系列齿轮箱', icon: 'gear-wide', color: '#F4B400' },
    { key: 'dtGearboxes', name: 'DT系列齿轮箱', icon: 'gear', color: '#0F9D58' },
    { key: 'hcqGearboxes', name: 'HCQ系列齿轮箱', icon: 'gear-fill', color: '#4285F4' },
    { key: 'gcGearboxes', name: 'GC系列齿轮箱', icon: 'gear-wide', color: '#DB4437' },
    { key: 'flexibleCouplings', name: '高弹性联轴器', icon: 'link', color: '#673AB7' },
    { key: 'standbyPumps', name: '备用泵', icon: 'water-pump', color: '#03A9F4' }
  ];

  // Colors for price management component
  const colors = {
    card: theme === 'light' ? '#ffffff' : '#1a202c',
    border: theme === 'light' ? '#dee2e6' : '#4a5568',
    headerBg: theme === 'light' ? '#f8f9fa' : '#2d3748',
    headerText: theme === 'light' ? '#212529' : '#e2e8f0',
    text: theme === 'light' ? '#212529' : '#e2e8f0',
    muted: theme === 'light' ? '#6c757d' : '#a0aec0',
    inputBg: theme === 'light' ? '#ffffff' : '#2d3748',
    inputBorder: theme === 'light' ? '#ced4da' : '#4a5568'
  };

  // Validate database
  const handleValidateData = () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!appData || Object.keys(appData).length === 0) {
        setError('数据库未初始化或为空，无法验证');
        setLoading(false);
        return;
      }

      const results = validateDatabase(appData);
      setValidationResults(results);

      if (results.success) {
        setSuccess(results.message);
      } else {
        setError(results.message);
      }
      setActiveTab('validation');
    } catch (err) {
      console.error("数据验证出错:", err);
      setError('数据验证过程中发生错误: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Correct database
  const handleCorrectData = () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!appData || Object.keys(appData).length === 0) {
        setError('数据库未初始化或为空，无法修正');
        setLoading(false);
        return;
      }

      const { data, results } = correctDatabase(appData);

      if (setAppData && typeof setAppData === 'function') {
        setAppData(data);
        setCorrectionResults(results);
        if (results.corrected > 0) {
          setSuccess(`数据修正完成，已修正${results.corrected}个项目，${results.unchanged}个项目无需修正。`);
        } else {
          setSuccess('所有数据已是最优状态，无需修正。');
        }
        setActiveTab('correction');
      } else {
        setError('无法更新应用数据状态 (setAppData 未提供)');
      }
    } catch (err) {
      console.error("数据修正出错:", err);
      setError('数据修正过程中发生错误: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Export database
  const handleExportData = (format = 'modal') => {
    setLoading(true);
    setError('');
    setSuccess('');

    if (format === 'modal') {
      setShowExportModal(true);
      setLoading(false);
      return;
    }

    try {
      if (!appData || Object.keys(appData).length === 0) {
        setError('数据库未初始化或为空，无法导出');
        setLoading(false);
        return;
      }

      const filename = exportFilename || 'gearbox-data';
      let dataToExport = { ...appData };

      if (!exportOptions.includeGearboxes) {
        dataCollections.filter(c => c.key.endsWith('Gearboxes')).forEach(c => delete dataToExport[c.key]);
      }
      if (!exportOptions.includeCouplings) {
        delete dataToExport.flexibleCouplings;
      }
      if (!exportOptions.includePumps) {
        delete dataToExport.standbyPumps;
      }

      if (Object.keys(dataToExport).length === 0) {
        setError('没有选择任何数据进行导出');
        setLoading(false);
        return;
      }

      if (format === 'json') {
        const successExport = exportDataToJson(dataToExport, filename);
        if (successExport) {
          setSuccess(`数据已成功导出为 ${filename}.json`);
        } else {
          setError('导出JSON失败，请查看控制台日志');
        }
      } else if (format === 'excel') {
        const successExport = exportDataToExcel(dataToExport, filename);
        if (successExport) {
          setSuccess(`数据已成功导出为 ${filename}.xlsx`);
        } else {
          setError('导出Excel失败，请查看控制台日志');
        }
      } else {
        setError('不支持的导出格式');
      }
    } catch (err) {
      console.error("数据导出出错:", err);
      setError('数据导出过程中发生错误: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmExport = () => {
    setShowExportModal(false);
    handleExportData(exportFormat);
  };

  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImportFiles(Array.from(files));
      setImportProgress(0);
      setImportStatus('');
      setError('');
      setSuccess('');
      setShowImportModal(true);
    }
  };

  const handleOptionChange = (event) => {
    const { id, checked } = event.target;
    setImportOptions(prev => ({ ...prev, [id]: checked }));
  };

  const addImportHistory = (data, sourceInfo) => {
    const entry = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      source: sourceInfo,
      collections: Object.keys(data).map(key => ({
        name: key,
        count: Array.isArray(data[key]) ? data[key].length : 0
      })),
      totalItems: Object.keys(data).reduce((sum, key) =>
        sum + (Array.isArray(data[key]) ? data[key].length : 0), 0)
    };
    setImportHistory(prev => [entry, ...prev].slice(0, 10));
  };

  // Import data
  const handleImportData = async () => {
    if (importFiles.length === 0) {
      setError('没有选择文件');
      return;
    }

    setIsImporting(true);
    setImportProgress(0);
    setImportStatus(`开始导入 ${importFiles.length} 个文件...`);
    setError('');
    setSuccess('');
    setImportErrorCount(0);

    let accumulatedData = {};
    let filesProcessed = 0;
    let errorsFound = [];

    for (const file of importFiles) {
      try {
        setImportStatus(`正在处理文件: ${file.name}`);
        const importedFileData = await importData(file);
        const adaptedData = adaptEnhancedData(importedFileData);

        if (importOptions.validateBeforeImport) {
          const validation = validateDatabase(adaptedData);
          if (!validation.success) {
            throw new Error(`验证失败: ${validation.message}`);
          }
        }

        let dataToMerge = adaptedData;
        if (importOptions.autoCorrect) {
          setImportStatus(`正在修正文件: ${file.name}`);
          const correctionResult = correctDatabase(dataToMerge);
          dataToMerge = correctionResult.data;
        }

        accumulatedData = mergeDataSources(accumulatedData, dataToMerge);
        filesProcessed++;
        setImportProgress(Math.round((filesProcessed / importFiles.length) * 100));
      } catch (err) {
        console.error(`导入或处理文件 ${file.name} 时出错:`, err);
        errorsFound.push({ name: file.name, error: err.message || '未知导入错误' });
        setImportProgress(Math.round(((filesProcessed + errorsFound.length) / importFiles.length) * 100));
      }
    }

    setImportErrorCount(errorsFound.length);

    if (Object.keys(accumulatedData).length > 0 && typeof setAppData === 'function') {
      if (importOptions.mergeData) {
        setAppData(prevData => {
          const mergedData = mergeDataSources(prevData, accumulatedData);
          addImportHistory(accumulatedData, { type: 'file', files: importFiles.map(f => f.name) });
          return mergedData;
        });
        if (errorsFound.length === 0) {
          setSuccess(`成功导入并合并 ${filesProcessed} 个文件的数据。`);
        } else {
          setSuccess(`成功导入并合并了 ${filesProcessed} 个文件的数据，但有 ${errorsFound.length} 个文件处理失败。`);
          setError(`部分文件处理失败 (${errorsFound.length}/${importFiles.length})。`);
        }
      } else {
        setAppData(accumulatedData);
        addImportHistory(accumulatedData, { type: 'file', files: importFiles.map(f => f.name) });
        if (errorsFound.length === 0) {
          setSuccess(`成功导入并替换了 ${filesProcessed} 个文件的数据。`);
        } else {
          setSuccess(`成功导入并替换了 ${filesProcessed} 个文件的数据，但有 ${errorsFound.length} 个文件处理失败。`);
          setError(`部分文件处理失败 (${errorsFound.length}/${importFiles.length})。`);
        }
      }
    } else if (errorsFound.length === importFiles.length) {
      setError(`所有 ${importFiles.length} 个文件导入失败。`);
    } else if (errorsFound.length > 0 && filesProcessed === 0) {
      setError(`导入失败，未能从任何文件中获取有效数据 (${errorsFound.length}/${importFiles.length} 个文件处理出错)。`);
    } else {
      setError('导入完成，但未能获取任何有效数据或无法更新应用状态。');
    }

    if (errorsFound.length > 0) {
      console.error("导入错误详情:", errorsFound);
      const errorDetails = errorsFound.map(e => `${e.name}: ${e.error}`).join('; ');
      setError(prevError => `${prevError ? prevError + ' ' : ''}错误详情: ${errorDetails}`);
    }

    setImportStatus('导入完成');
    setShowImportModal(false);
    setIsImporting(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImportFiles([]);
  };

  // Calculate statistics
  const calculateStats = () => {
    const stats = { totalItems: 0, categoryCounts: {} };

    if (!appData || typeof appData !== 'object') {
      return stats;
    }

    dataCollections.forEach(collection => {
      const count = Array.isArray(appData[collection.key]) ? appData[collection.key].length : 0;
      stats.totalItems += count;
      stats.categoryCounts[collection.key] = count;
    });

    return stats;
  };

  const stats = calculateStats();

  // Calculate coupling series distribution
  const couplingSeriesStats = useMemo(() => {
    const couplings = appData?.flexibleCouplings || [];
    const seriesCount = {};
    const seriesDetails = {};

    couplings.forEach(coupling => {
      const seriesInfo = getSeriesInfo(coupling.model);
      const seriesMatch = coupling.model?.match(/^([A-Z]+)/);
      const seriesName = seriesMatch ? seriesMatch[1] : 'OTHER';

      if (!seriesCount[seriesName]) {
        seriesCount[seriesName] = 0;
        seriesDetails[seriesName] = {
          name: seriesInfo?.name || seriesName + '系列',
          description: seriesInfo?.description || '',
          models: [],
          detailUrl: seriesInfo?.detailUrl || ''
        };
      }

      seriesCount[seriesName]++;
      seriesDetails[seriesName].models.push(coupling.model);
    });

    return { seriesCount, seriesDetails, total: couplings.length };
  }, [appData?.flexibleCouplings]);

  // Get matching stats
  const matchingStats = useMemo(() => {
    try {
      return getMatchingStats();
    } catch (e) {
      return { couplingCount: 0, gearboxCount: 0, totalMappings: 0, couplingsBySeries: {} };
    }
  }, []);

  const openCouplingSelectionPage = () => {
    window.open('/coupling-selection-enhanced.html', '_blank');
  };

  return (
    <div className="container-fluid py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="mb-0">数据库管理</h3>
          <p className="text-muted mb-0">管理、验证和导出数据库内容</p>
        </Col>
        <Col xs="auto">
          <Button as={Link} to="/" variant="outline-secondary" size="sm" className="me-2">
            <i className="bi bi-arrow-left me-1"></i>返回主页
          </Button>
        </Col>
      </Row>

      {/* Error and success messages */}
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

      {/* Action buttons card */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0">数据库操作</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3} className="mb-3 mb-md-0">
              <div className="d-grid">
                <Button variant="primary" onClick={handleValidateData} disabled={loading || isImporting}>
                  <i className="bi bi-check-circle me-2"></i>验证数据
                </Button>
              </div>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <div className="d-grid">
                <Button variant="warning" onClick={handleCorrectData} disabled={loading || isImporting}>
                  <i className="bi bi-tools me-2"></i>自动修正数据
                </Button>
              </div>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <div className="d-grid">
                <Button variant="success" onClick={() => handleExportData('modal')} disabled={loading || isImporting}>
                  <i className="bi bi-download me-2"></i>导出数据
                </Button>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-grid">
                <Button variant="info" onClick={handleImportClick} disabled={loading || isImporting}>
                  <i className="bi bi-upload me-2"></i>导入数据
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept=".json,.xlsx,.xls"
                  multiple
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Content tabs */}
      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4" fill>
        <Tab eventKey="overview" title="数据库概览">
          <OverviewTab
            stats={stats}
            dataCollections={dataCollections}
            couplingSeriesStats={couplingSeriesStats}
            matchingStats={matchingStats}
            onOpenCouplingSelection={openCouplingSelectionPage}
          />
        </Tab>

        <Tab eventKey="validation" title="验证结果">
          <ValidationResultsTab
            validationResults={validationResults}
            dataCollections={dataCollections}
          />
        </Tab>

        <Tab eventKey="correction" title="修正结果">
          <CorrectionResultsTab
            correctionResults={correctionResults}
            dataCollections={dataCollections}
          />
        </Tab>

        <Tab eventKey="priceManagement" title={<span><i className="bi bi-currency-yen me-1"></i>价格管理</span>}>
          {appData ? (
            <PriceMaintenanceTool
              appData={appData}
              setAppData={setAppData}
              theme={theme}
              colors={colors}
            />
          ) : (
            <Card className="shadow-sm">
              <Card.Body>
                <Alert variant="warning">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  数据未加载，无法管理价格。请确保系统数据已正确加载。
                </Alert>
              </Card.Body>
            </Card>
          )}
        </Tab>

        <Tab eventKey="importHistory" title="导入历史">
          <ImportHistoryTab importHistory={importHistory} />
        </Tab>

        <Tab eventKey="gearboxImport" title={<span><i className="bi bi-gear-fill me-1"></i>齿轮箱专业导入</span>}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">前进牌齿轮箱数据导入工具</h5>
              <p className="small text-muted mb-0">专用于导入前进牌技术手册数据，支持特殊数据结构处理</p>
            </Card.Header>
            <Card.Body>
              <GearboxDataImporter
                onDataUpdate={(updater) => {
                  const result = setAppData(updater);
                  if (typeof updater === 'function') {
                    const currentData = { ...appData };
                    try {
                      const newData = updater(currentData);
                      addImportHistory(newData, { type: 'gearbox', description: '齿轮箱专业导入' });
                    } catch (err) {
                      console.error("无法记录导入历史:", err);
                    }
                  } else {
                    addImportHistory(updater, { type: 'gearbox', description: '齿轮箱专业导入' });
                  }
                  return result;
                }}
              />
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Export modal */}
      <ExportModal
        show={showExportModal}
        onHide={() => setShowExportModal(false)}
        exportFormat={exportFormat}
        onFormatChange={setExportFormat}
        exportFilename={exportFilename}
        onFilenameChange={setExportFilename}
        exportOptions={exportOptions}
        onOptionsChange={setExportOptions}
        onConfirm={confirmExport}
      />

      {/* Import modal */}
      <ImportModal
        show={showImportModal}
        onHide={() => setShowImportModal(false)}
        importFiles={importFiles}
        importOptions={importOptions}
        onOptionChange={handleOptionChange}
        importProgress={importProgress}
        importStatus={importStatus}
        importErrorCount={importErrorCount}
        isImporting={isImporting}
        onImport={handleImportData}
      />
    </div>
  );
};

export default DatabaseManagementView;
