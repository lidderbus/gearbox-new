// src/components/DatabaseManagementView.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Tabs, Tab, Alert, Spinner, ListGroup, Badge, Table, Row, Col, Form, InputGroup, Modal, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { validateDatabase } from '../utils/dataValidator';
import { correctDatabase } from '../utils/dataCorrector';
import { exportDataToJson, exportDataToExcel } from '../utils/dataExporter';
// 导入实际的导入函数和合并函数
import { importData } from '../utils/optimizedDataImport';
import { mergeDataSources } from '../utils/dataMerger'; // 假设您有 dataMerger.js 文件
import { adaptEnhancedData } from '../utils/dataAdapter'; // 可能需要适配导入的数据

// 导入新的齿轮箱数据导入组件
import GearboxDataImporter from './GearboxDataImporter';

/**
 * DatabaseManagementView组件 - 数据库管理界面
 *
 * 该组件提供以下功能：
 * - 数据库概览：显示各类数据的数量和状态
 * - 数据验证：检查数据格式和值的有效性
 * - 数据修正：自动修复常见数据问题
 * - 数据导出：将数据库导出为JSON或Excel格式
 * - 数据导入：从文件导入数据
 * - 齿轮箱专业导入：专门用于前进牌齿轮箱数据导入
 */
const DatabaseManagementView = ({ appData = {}, setAppData = () => {} }) => {
  // 状态变量
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationResults, setValidationResults] = useState(null);
  const [correctionResults, setCorrectionResults] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [showImportModal, setShowImportModal] = useState(false);
  const [importProgress, setImportProgress] = useState(0); // 进度可能不再精确，但可用于显示状态
  const [importStatus, setImportStatus] = useState('');
  const [importFiles, setImportFiles] = useState([]);
  const [importOptions, setImportOptions] = useState({ // 导入选项
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
    includeHistory: false // 历史记录导出可能需要单独处理
  });
  const [isImporting, setIsImporting] = useState(false); // 用于禁用按钮
  const [importErrorCount, setImportErrorCount] = useState(0); // 跟踪导入错误数量的状态
  const [importHistory, setImportHistory] = useState([]); // 导入历史记录

  // 文件输入引用
  const fileInputRef = useRef(null);

  // 数据集合定义，用于UI显示
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

  // 验证数据库中所有数据的有效性
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

  // 自动修正数据库中的问题
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

  // 导出数据库
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

      // --- 准备要导出的数据 ---
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
      // 注意：历史记录导出需要额外逻辑，这里暂时忽略 exportOptions.includeHistory

       // --- 执行导出 ---
      if (Object.keys(dataToExport).length === 0) {
          setError('没有选择任何数据进行导出');
          setLoading(false);
          return;
      }


      if (format === 'json') {
        const successExport = exportDataToJson(dataToExport, filename);
        if(successExport) {
           setSuccess(`数据已成功导出为 ${filename}.json`);
        } else {
           setError('导出JSON失败，请查看控制台日志');
        }
      } else if (format === 'excel') {
        const successExport = exportDataToExcel(dataToExport, filename);
         if(successExport) {
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

  // 确认并执行导出操作
  const confirmExport = () => {
    setShowExportModal(false);
    // 调用 handleExportData，传入模态框选择的格式
    handleExportData(exportFormat);
  };

  // 打开文件选择对话框
  const handleImportClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 处理文件选择
  const handleFileSelect = (event) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setImportFiles(Array.from(files));
      setImportProgress(0); // 重置进度
      setImportStatus(''); // 重置状态
      setError(''); // 清除旧错误
      setSuccess(''); // 清除旧成功消息
      setShowImportModal(true);
    }
  };

  // 处理导入选项变更
  const handleOptionChange = (event) => {
    const { id, checked } = event.target;
    setImportOptions(prev => ({
        ...prev,
        [id]: checked
    }));
  };

  // 添加导入历史记录
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
    
    setImportHistory(prev => [entry, ...prev].slice(0, 10)); // 保留最近10条记录
  };

// 导入数据并合并，包含错误捕获和数据验证
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
  setImportErrorCount(0); // 重置错误计数

  let accumulatedData = {};
  let filesProcessed = 0;
  let errorsFound = []; // errorsFound 仍然在函数内部使用

  for (const file of importFiles) {
    try {
      setImportStatus(`正在处理文件: ${file.name}`);
      // 1. 导入文件
      const importedFileData = await importData(file);
      // 2. 适配数据
      const adaptedData = adaptEnhancedData(importedFileData); // 使用 adaptEnhancedData

      // 3. （可选）验证适配后的数据
      if (importOptions.validateBeforeImport) {
        const validation = validateDatabase(adaptedData);
        if (!validation.success) {
          // 如果验证失败，可以决定是跳过此文件还是中止整个导入过程
          // 这里选择记录错误并继续处理下一个文件
          console.warn(`File ${file.name} validation failed after adaptation:`, validation.message, validation.details);
          throw new Error(`验证失败: ${validation.message}`); // 抛出错误，进入 catch 块
        }
      }

       // 4. （可选）修正数据 - 注意：修正应在验证之后，对验证通过的数据进行
       let dataToMerge = adaptedData;
       if (importOptions.autoCorrect) {
            setImportStatus(`正在修正文件: ${file.name}`);
            const correctionResult = correctDatabase(dataToMerge); // 修正适配且验证过的数据
            dataToMerge = correctionResult.data;
            if(correctionResult.results.corrected > 0) {
                console.log(`File ${file.name} corrected ${correctionResult.results.corrected} items.`);
            }
       }

      // 5. 合并数据
      accumulatedData = mergeDataSources(accumulatedData, dataToMerge); // 使用 dataToMerge
      filesProcessed++;
      setImportProgress(Math.round((filesProcessed / importFiles.length) * 100)); // 更新进度

    } catch (err) {
      console.error(`导入或处理文件 ${file.name} 时出错:`, err);
      errorsFound.push({ name: file.name, error: err.message || '未知导入错误' });
      // 即使此文件失败，也更新进度，确保进度条最终能到100%
       setImportProgress(Math.round(((filesProcessed + errorsFound.length) / importFiles.length) * 100));
    }
  } // for 循环结束

  setImportErrorCount(errorsFound.length); // 更新错误计数状态

    // 更新最终状态 (这部分逻辑是正确的，用于处理合并/替换和报告结果)
    if (Object.keys(accumulatedData).length > 0 && typeof setAppData === 'function') {
      if (importOptions.mergeData) {
        // 合并模式：将新数据合并到现有数据
        setAppData(prevData => {
          const mergedData = mergeDataSources(prevData, accumulatedData);
          
          // 添加到导入历史
          addImportHistory(accumulatedData, {
            type: 'file',
            files: importFiles.map(f => f.name)
          });
          
          return mergedData;
        });
         // 根据是否有错误显示不同的成功消息
         if (errorsFound.length === 0) {
            setSuccess(`成功导入并合并 ${filesProcessed} 个文件的数据。`);
         } else {
             setSuccess(`成功导入并合并了 ${filesProcessed} 个文件的数据，但有 ${errorsFound.length} 个文件处理失败。`);
             // 可以在这里附加错误信息到 setError
             setError(`部分文件处理失败 (${errorsFound.length}/${importFiles.length})。`);
         }
      } else {
        // 替换模式：用新数据完全替换旧数据
        setAppData(accumulatedData);
        
        // 添加到导入历史
        addImportHistory(accumulatedData, {
          type: 'file',
          files: importFiles.map(f => f.name)
        });
        
         if (errorsFound.length === 0) {
             setSuccess(`成功导入并替换了 ${filesProcessed} 个文件的数据。`);
         } else {
             setSuccess(`成功导入并替换了 ${filesProcessed} 个文件的数据，但有 ${errorsFound.length} 个文件处理失败。`);
             // 可以在这里附加错误信息到 setError
             setError(`部分文件处理失败 (${errorsFound.length}/${importFiles.length})。`);
         }
      }
        // 可能需要重新验证合并后的数据
        // handleValidateData(); // 可以选择在导入后自动验证
    } else if (errorsFound.length === importFiles.length) {
        // 所有文件导入都失败了
        setError(`所有 ${importFiles.length} 个文件导入失败。`);
    } else if (errorsFound.length > 0 && filesProcessed === 0) {
         // 有错误，但没有任何文件成功处理（例如，验证都失败了或文件无法读取）
        setError(`导入失败，未能从任何文件中获取有效数据 (${errorsFound.length}/${importFiles.length} 个文件处理出错)。`);
    } else if (filesProcessed > 0 && errorsFound.length > 0) {
        // 部分成功，部分失败，已在上面 if/else 处理合并/替换时设置了 success 和 error 消息
    } else {
        // 捕获其他情况，例如没有选中文件但走到了这里，或 setAppData 未定义等
        setError('导入完成，但未能获取任何有效数据或无法更新应用状态。');
    }

     // 显示错误详情到控制台和可能的消息框
    if(errorsFound.length > 0) {
        console.error("导入错误详情:", errorsFound);
        // 可以考虑将错误详情添加到 error 状态中，以便在UI中显示更详细的信息
        const errorDetails = errorsFound.map(e => `${e.name}: ${e.error}`).join('; ');
        setError(prevError => `${prevError ? prevError + ' ' : ''}错误详情: ${errorDetails}`);
    }

    setImportStatus('导入完成');
    setShowImportModal(false);
    setIsImporting(false); // 结束导入，启用按钮

    // 清理
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    setImportFiles([]);
  };

  // 计算数据库统计信息
  const calculateStats = () => {
    const stats = {
      totalItems: 0,
      categoryCounts: {}
    };

    if (!appData || typeof appData !== 'object') {
      console.warn('appData is undefined or not an object in DatabaseManagementView');
      return stats;
    }

    dataCollections.forEach(collection => {
      const count = Array.isArray(appData[collection.key]) ? appData[collection.key].length : 0;
      stats.totalItems += count;
      stats.categoryCounts[collection.key] = count;
    });

    return stats;
  };

  // 数据库统计信息
  const stats = calculateStats();

  return (
    <div className="container-fluid py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h3 className="mb-0">数据库管理</h3>
          <p className="text-muted mb-0">管理、验证和导出数据库内容</p>
        </Col>
        <Col xs="auto">
          <Button
            as={Link}
            to="/"
            variant="outline-secondary"
            size="sm"
            className="me-2"
          >
            <i className="bi bi-arrow-left me-1"></i>
            返回主页
          </Button>
        </Col>
      </Row>

      {/* 错误和成功消息显示 */}
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

      {/* 操作卡片 */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h5 className="mb-0">数据库操作</h5>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={3} className="mb-3 mb-md-0">
              <div className="d-grid">
                <Button
                  variant="primary"
                  onClick={handleValidateData}
                  disabled={loading || isImporting} // 导入时也禁用
                >
                  <i className="bi bi-check-circle me-2"></i>
                  验证数据
                </Button>
              </div>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <div className="d-grid">
                <Button
                  variant="warning"
                  onClick={handleCorrectData}
                  disabled={loading || isImporting} // 导入时也禁用
                >
                  <i className="bi bi-tools me-2"></i>
                  自动修正数据
                </Button>
              </div>
            </Col>
            <Col md={3} className="mb-3 mb-md-0">
              <div className="d-grid">
                <Button
                  variant="success"
                  onClick={() => handleExportData('modal')}
                  disabled={loading || isImporting} // 导入时也禁用
                >
                  <i className="bi bi-download me-2"></i>
                  导出数据
                </Button>
              </div>
            </Col>
            <Col md={3}>
              <div className="d-grid">
                <Button
                  variant="info"
                  onClick={handleImportClick}
                  disabled={loading || isImporting} // 导入时也禁用
                >
                  <i className="bi bi-upload me-2"></i>
                  导入数据
                </Button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept=".json,.xlsx,.xls" // 接受 JSON 和 Excel 文件
                  multiple
                />
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 内容标签页 */}
       <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
        fill
      >
        {/* 概览标签页 */}
        <Tab eventKey="overview" title="数据库概览">
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">数据库内容概览</h5>
                <Badge bg="primary" pill>总计 {stats.totalItems} 项</Badge>
              </div>
            </Card.Header>
            <Card.Body>
              <Row>
                {dataCollections.map(collection => (
                  <Col md={3} sm={6} key={collection.key} className="mb-4">
                    <Card className="h-100 border-0 shadow-sm">
                      <Card.Body className="d-flex align-items-center">
                        <div
                          className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                          style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: collection.color,
                            color: 'white'
                          }}
                        >
                          <i className={`bi bi-${collection.icon}`} style={{ fontSize: '1.5rem' }}></i>
                        </div>
                        <div>
                          <h6 className="mb-0">{collection.name}</h6>
                          <div className="d-flex align-items-center mt-1">
                            <span className="fs-4 fw-bold">{stats.categoryCounts[collection.key] || 0}</span>
                            <span className="ms-2 text-muted">项</span>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              {stats.totalItems === 0 && (
                <div className="text-center py-5">
                  <i className="bi bi-database-x text-muted" style={{ fontSize: '3rem' }}></i>
                  <p className="mt-3 text-muted">数据库中暂无数据，请导入数据后再进行操作</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* 验证结果标签页 */}
        <Tab eventKey="validation" title="验证结果">
          {!validationResults ? (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <i className="bi bi-clipboard-check text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3 text-muted">请先点击"验证数据"按钮执行数据验证</p>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">数据验证结果</h5>
                  <div>
                    <Badge bg="success" className="me-2">
                      有效: {validationResults.summary.valid}
                    </Badge>
                    <Badge bg="danger" className="me-2">
                      无效: {validationResults.summary.invalid}
                    </Badge>
                    <Badge bg="warning">
                      警告: {validationResults.summary.warnings}
                    </Badge>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                <Tabs defaultActiveKey="summary" className="mb-3">
                  <Tab eventKey="summary" title="摘要">
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr>
                          <th>数据集合</th>
                          <th>总项目数</th>
                          <th>有效项目</th>
                          <th>无效项目</th>
                          <th>警告数</th>
                          <th>状态</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(validationResults.details).map(([key, detail]) => (
                          <tr key={key}>
                            <td>{dataCollections.find(c => c.key === key)?.name || key}</td>
                            <td>{detail.total}</td>
                            <td className="text-success">{detail.valid}</td>
                            <td className="text-danger">{detail.invalid}</td>
                            <td className="text-warning">{detail.warnings}</td>
                            <td>
                              {detail.invalid > 0 ? (
                                <Badge bg="danger">存在问题</Badge>
                              ) : detail.warnings > 0 ? (
                                <Badge bg="warning">有警告</Badge>
                              ) : (
                                <Badge bg="success">正常</Badge>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Tab>

                  <Tab eventKey="errors" title="错误详情">
                    {Object.entries(validationResults.details).map(([key, detail]) => (
                      detail.invalidItems && detail.invalidItems.length > 0 ? (
                        <div key={key} className="mb-4">
                          <h6 className="border-bottom pb-2">
                            {dataCollections.find(c => c.key === key)?.name || key}
                            <Badge bg="danger" className="ms-2">{detail.invalidItems.length}个错误</Badge>
                          </h6>
                          <ListGroup variant="flush">
                            {detail.invalidItems.map((item, index) => (
                              <ListGroup.Item key={index} className="border-start border-danger border-4">
                                <div className="fw-bold text-danger">{item.model || `项目 #${item.originalIndex !== undefined ? item.originalIndex + 1 : index + 1}`}</div> {/* 尝试使用原始索引 */}
                                <ul className="mb-0 ps-3">
                                  {item.errors.map((error, i) => (
                                    <li key={i}>{error}</li>
                                  ))}
                                </ul>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </div>
                      ) : null
                    ))}

                    {Object.values(validationResults.details).every(detail =>
                      !detail.invalidItems || detail.invalidItems.length === 0
                    ) && (
                      <div className="text-center py-4">
                        <i className="bi bi-emoji-smile text-success" style={{ fontSize: '2rem' }}></i>
                        <p className="mt-2 text-success">没有发现错误，所有数据有效</p>
                      </div>
                    )}
                  </Tab>

                  <Tab eventKey="warnings" title="警告详情">
                    {Object.entries(validationResults.details).map(([key, detail]) => (
                      detail.warningItems && detail.warningItems.length > 0 ? (
                        <div key={key} className="mb-4">
                          <h6 className="border-bottom pb-2">
                            {dataCollections.find(c => c.key === key)?.name || key}
                            <Badge bg="warning" className="ms-2">{detail.warningItems.length}个警告</Badge>
                          </h6>
                          <ListGroup variant="flush">
                            {detail.warningItems.map((item, index) => (
                              <ListGroup.Item key={index} className="border-start border-warning border-4">
                                <div className="fw-bold text-warning">{item.model || `项目 #${item.originalIndex !== undefined ? item.originalIndex + 1 : index + 1}`}</div> {/* 尝试使用原始索引 */}
                                <ul className="mb-0 ps-3">
                                  {item.warnings.map((warning, i) => (
                                    <li key={i}>{warning}</li>
                                  ))}
                                </ul>
                              </ListGroup.Item>
                            ))}
                          </ListGroup>
                        </div>
                      ) : null
                    ))}

                    {Object.values(validationResults.details).every(detail =>
                      !detail.warningItems || detail.warningItems.length === 0
                    ) && (
                      <div className="text-center py-4">
                        <i className="bi bi-emoji-smile text-success" style={{ fontSize: '2rem' }}></i>
                        <p className="mt-2 text-success">没有发现警告，所有数据正常</p>
                      </div>
                    )}
                  </Tab>
                </Tabs>
              </Card.Body>
            </Card>
          )}
        </Tab>

        {/* 修正结果标签页 */}
        <Tab eventKey="correction" title="修正结果">
          {!correctionResults ? (
            <Card className="shadow-sm">
              <Card.Body className="text-center py-5">
                <i className="bi bi-tools text-muted" style={{ fontSize: '3rem' }}></i>
                <p className="mt-3 text-muted">请先点击"自动修正数据"按钮执行数据修正</p>
              </Card.Body>
            </Card>
          ) : (
            <Card className="shadow-sm">
              <Card.Header className="bg-light">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">数据修正结果</h5>
                  <div>
                    <Badge bg="warning" className="me-2">
                      已修正: {correctionResults.corrected}
                    </Badge>
                    <Badge bg="secondary">
                      未变更: {correctionResults.unchanged}
                    </Badge>
                  </div>
                </div>
              </Card.Header>
              <Card.Body>
                {correctionResults.details && correctionResults.details.length > 0 ? ( // 检查 details 是否存在且有内容
                  <div>
                    <h6 className="mb-3">修正详情</h6>
                    <ListGroup>
                      {correctionResults.details.map((item, index) => (
                        <ListGroup.Item key={index} className="border-start border-warning border-4">
                          <div className="fw-bold">{dataCollections.find(c=>c.key === item.type)?.name || item.type} - {item.model || `项目 #${item.originalIndex !== undefined ? item.originalIndex + 1 : index + 1}`}</div> {/* 尝试使用原始索引 */}
                          <ul className="mb-0 ps-3">
                            {item.corrections.map((correction, i) => (
                              <li key={i}>{correction}</li>
                            ))}
                          </ul>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <i className="bi bi-emoji-smile text-success" style={{ fontSize: '2rem' }}></i>
                    <p className="mt-2 text-success">所有数据已是最优状态，无需修正，或未执行修正操作</p>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Tab>
        
        {/* 导入历史记录标签页 */}
        <Tab eventKey="importHistory" title="导入历史">
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">数据导入历史</h5>
            </Card.Header>
            <Card.Body>
              {importHistory.length > 0 ? (
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>时间</th>
                      <th>来源</th>
                      <th>导入数据</th>
                      <th>总项目数</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importHistory.map((entry, index) => (
                      <tr key={entry.id}>
                        <td>{index + 1}</td>
                        <td>{new Date(entry.timestamp).toLocaleString()}</td>
                        <td>
                          {entry.source?.type === 'file' 
                            ? `文件导入: ${entry.source.files.join(', ')}` 
                            : entry.source?.type === 'paste' 
                            ? '文本粘贴导入' 
                            : entry.source?.type === 'gearbox' 
                            ? '齿轮箱专业导入' 
                            : '未知来源'}
                        </td>
                        <td>
                          {entry.collections.map(c => `${c.name}(${c.count})`).join(', ')}
                        </td>
                        <td>{entry.totalItems}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-clock-history text-muted" style={{ fontSize: '2rem' }}></i>
                  <p className="mt-2 text-muted">暂无导入历史记录</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>
        
        {/* 齿轮箱专业导入标签页 */}
        <Tab eventKey="gearboxImport" title={<span><i className="bi bi-gear-fill me-1"></i>齿轮箱专业导入</span>}>
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">前进牌齿轮箱数据导入工具</h5>
              <p className="small text-muted mb-0">专用于导入前进牌技术手册数据，支持特殊数据结构处理</p>
            </Card.Header>
            <Card.Body>
              <GearboxDataImporter 
                onDataUpdate={(updater) => {
                  // 调用原有的 setAppData
                  const result = setAppData(updater);
                  
                  // 添加到历史记录
                  if (typeof updater === 'function') {
                    // 暂存当前数据
                    const currentData = { ...appData };
                    // 预估新数据 (实际会在setAppData中处理)
                    try {
                      const newData = updater(currentData);
                      // 添加到历史记录
                      addImportHistory(newData, {
                        type: 'gearbox',
                        description: '齿轮箱专业导入'
                      });
                    } catch (err) {
                      console.error("无法记录导入历史:", err);
                    }
                  } else {
                    // 直接添加到历史记录
                    addImportHistory(updater, {
                      type: 'gearbox',
                      description: '齿轮箱专业导入'
                    });
                  }
                  
                  return result;
                }}
              />
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* 导出数据模态框 */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>导出数据库</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>导出格式</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  name="exportFormat" // 确保 name 相同
                  id="export-json"
                  label="JSON 格式"
                  checked={exportFormat === 'json'}
                  onChange={() => setExportFormat('json')}
                />
                <Form.Check
                  inline
                  type="radio"
                  name="exportFormat" // 确保 name 相同
                  id="export-excel"
                  label="Excel 格式"
                  checked={exportFormat === 'excel'}
                  onChange={() => setExportFormat('excel')}
                />
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>文件名</Form.Label>
              <Form.Control
                type="text"
                value={exportFilename}
                onChange={(e) => setExportFilename(e.target.value)}
                placeholder="gearbox-data"
              />
              <Form.Text className="text-muted">
                文件扩展名将自动添加，无需输入
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>导出内容</Form.Label>
              <div>
                <Form.Check
                  type="checkbox"
                  id="export-gearboxes"
                  label="包含齿轮箱数据"
                  checked={exportOptions.includeGearboxes}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeGearboxes: e.target.checked })}
                />
                <Form.Check
                  type="checkbox"
                  id="export-couplings"
                  label="包含联轴器数据"
                  checked={exportOptions.includeCouplings}
                  onChange={(e) => setExportOptions({ ...exportOptions, includeCouplings: e.target.checked })}
                />
                <Form.Check
                  type="checkbox"
                  id="export-pumps"
                  label="包含备用泵数据"
                  checked={exportOptions.includePumps}
                  onChange={(e) => setExportOptions({ ...exportOptions, includePumps: e.target.checked })}
                />
                 {/* 历史记录导出需要单独实现
                 <Form.Check
                   type="checkbox"
                   id="export-history"
                   label="包含选型历史记录"
                   checked={exportOptions.includeHistory}
                   onChange={(e) => setExportOptions({ ...exportOptions, includeHistory: e.target.checked })}
                 /> */}
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowExportModal(false)}>
            取消
          </Button>
          <Button variant="primary" onClick={confirmExport}>
            确认导出
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 导入数据模态框 */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>导入数据确认</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <h6>选中的文件 ({importFiles.length})</h6>
            <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
              {importFiles.map((file, index) => (
                <ListGroup.Item key={index} className="d-flex align-items-center py-1">
                  <i className={`bi bi-${file.name.endsWith('.json') ? 'filetype-json' : 'filetype-xlsx'} me-2`} style={{ fontSize: '1.2rem' }}></i>
                  <div style={{ fontSize: '0.9rem' }}>
                    <div>{file.name}</div>
                    <small className="text-muted">{(file.size / 1024).toFixed(2)} KB</small>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>

          <div className="mb-3">
            <h6>导入选项</h6>
            <Form>
              <Form.Check
                type="checkbox"
                id="mergeData"
                label="与现有数据合并（否则将替换）"
                checked={importOptions.mergeData}
                onChange={handleOptionChange}
              />
              <Form.Check
                type="checkbox"
                id="validateBeforeImport"
                label="导入前验证数据有效性"
                 checked={importOptions.validateBeforeImport}
                 onChange={handleOptionChange}
              />
              <Form.Check
                type="checkbox"
                id="autoCorrect"
                label="自动修正导入数据中的问题"
                 checked={importOptions.autoCorrect}
                 onChange={handleOptionChange}
              />
            </Form>
          </div>

          {isImporting && ( // 仅在导入进行时显示进度
            <div className="mb-3">
              <h6>导入进度</h6>
              <ProgressBar
                now={importProgress}
                label={`${importProgress}%`}
                // 使用 importErrorCount 状态变量判断颜色
                variant={importProgress === 100 ? (importErrorCount > 0 ? "danger" : "success") : "primary"}
                animated={importProgress < 100}
                style={{ height: '20px' }}
              />
              <p className="mt-2 text-center text-muted small">{importStatus}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowImportModal(false)} disabled={isImporting}>
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleImportData}
            disabled={isImporting} // 导入过程中禁用按钮
          >
            {isImporting ? (
              <>
                <Spinner as="span" size="sm" animation="border" className="me-2" />
                导入中...
              </>
            ) : (
              <>
                <i className="bi bi-upload me-2"></i>
                开始导入
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default DatabaseManagementView;