// src/components/GearboxDataImporter.js
import React, { useState, useRef } from 'react';
import { Card, Button, Tab, Tabs, Alert, Form, InputGroup, Row, Col, Table, Badge, Modal, Spinner } from 'react-bootstrap';

/**
 * 前进牌齿轮箱数据导入组件
 * 专用于前进牌齿轮箱技术规格数据的导入，支持特殊数据结构
 */
function GearboxDataImporter({ onDataUpdate }) {
  // 状态
  const [activeTab, setActiveTab] = useState('paste');
  const [pasteContent, setPasteContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [importedData, setImportedData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [previewMode, setPreviewMode] = useState('summary'); // summary, details
  const fileInputRef = useRef(null);

  // 集合映射配置 - 决定导入数据如何映射到系统中的集合
  const collectionMapping = {
    // 标准集合直接映射
    "hcGearboxes": "hcGearboxes",         // HC系列齿轮箱
    "gwGearboxes": "gwGearboxes",         // GW系列齿轮箱
    "hcmGearboxes": "hcmGearboxes",       // HCM系列齿轮箱
    "dtGearboxes": "dtGearboxes",         // DT系列齿轮箱
    "hcqGearboxes": "hcqGearboxes",       // HCQ系列齿轮箱
    "gcGearboxes": "gcGearboxes",         // GC系列齿轮箱
    
    // 特殊类型映射到标准集合
    "hcmAluminumGearboxes": "hcmGearboxes", // 铝合金HCM映射到标准HCM
    "twoSpeedGearboxes": "hcqGearboxes",    // 双速齿轮箱映射到HCQ特种
    "hybridGearboxes": "hcqGearboxes",      // 混合动力映射到HCQ特种
    "twinInputGearboxes": "gwGearboxes",    // 双输入映射到GW系列
    
    // 附件类映射
    "flexibleCouplings": "flexibleCouplings", // 高弹性联轴器
    "standbyPumps": "standbyPumps",           // 备用泵
    "hclClutches": "flexibleCouplings"        // 液压离合器映射到联轴器
  };

  // 处理文件选择
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);
    setError('');
    setSuccess('');

    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const fileContent = e.target.result;
        const fileExtension = file.name.split('.').pop().toLowerCase();
        
        if (fileExtension === 'json') {
          // 处理JSON文件
          const jsonData = JSON.parse(fileContent);
          setImportedData(jsonData);
          setShowPreview(true);
          setSuccess('JSON文件解析成功，请检查预览并确认导入');
        } else if (fileExtension === 'py' || fileExtension === 'js') {
          // 处理Python或JavaScript格式文件
          const exportMatch = fileContent.match(/export\s+const\s+(\w+)\s*=\s*/);
          if (exportMatch) {
            const varName = exportMatch[1]; // 例如 advanceGearboxData
            try {
              // 安全地执行代码提取数据
              const funcBody = `
                ${fileContent}
                return typeof ${varName} !== 'undefined' ? ${varName} : null;
              `;
              const dataFunc = new Function(funcBody);
              const result = dataFunc();
              
              if (result && typeof result === 'object') {
                setImportedData(result);
                setShowPreview(true);
                setSuccess(`${file.name} 文件解析成功，请检查预览并确认导入`);
              } else {
                throw new Error(`无法从${file.name}提取有效数据`);
              }
            } catch (execError) {
              setError(`执行文件代码失败: ${execError.message}`);
            }
          } else {
            setError(`未找到导出常量定义，请确保文件格式正确，应包含如 "export const xxxx = {...}" 的格式`);
          }
        } else {
          setError(`不支持的文件类型: ${fileExtension}，请使用JSON、JS或PY文件`);
        }
      } catch (err) {
        setError(`解析文件失败: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    
    reader.onerror = () => {
      setError('读取文件失败');
      setLoading(false);
    };
    
    reader.readAsText(file);
  };

  // 处理粘贴内容变化
  const handlePasteContentChange = (e) => {
    setPasteContent(e.target.value);
    setError('');
    setSuccess('');
  };
  
  // 处理粘贴内容导入
  const handlePasteImport = async () => {
    if (!pasteContent.trim()) {
      setError('请先粘贴数据内容');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 检查是否为JavaScript导出格式
      const jsCodePattern = /export\s+const\s+(\w+)\s*=\s*/;
      const match = pasteContent.match(jsCodePattern);
      
      if (match) {
        // 尝试作为JavaScript对象解析
        try {
          const varName = match[1]; // 提取变量名，例如 advanceGearboxData
          // 安全地执行代码提取数据
          const funcBody = `
            ${pasteContent}
            return typeof ${varName} !== 'undefined' ? ${varName} : null;
          `;
          const dataFunc = new Function(funcBody);
          const result = dataFunc();
          
          if (result && typeof result === 'object') {
            setImportedData(result);
            setShowPreview(true);
            setSuccess('数据解析成功，请检查预览并确认导入');
          } else {
            throw new Error('无法从JS代码中提取有效数据');
          }
        } catch (execError) {
          console.error('执行JS代码失败:', execError);
          setError(`解析JS数据失败: ${execError.message}`);
        }
      } else {
        // 尝试作为JSON解析
        try {
          const jsonData = JSON.parse(pasteContent);
          setImportedData(jsonData);
          setShowPreview(true);
          setSuccess('数据解析成功，请检查预览并确认导入');
        } catch (jsonError) {
          setError(`解析数据失败: 内容既不是有效的JS也不是有效的JSON格式。${jsonError.message}`);
        }
      }
    } catch (err) {
      console.error('处理粘贴内容失败:', err);
      setError(`处理数据失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 预处理特殊格式的数据
  const preprocessSpecialData = (data) => {
    const result = { ...data };
    
    // 处理铝合金箱体齿轮箱
    if (result.hcmAluminumGearboxes && Array.isArray(result.hcmAluminumGearboxes)) {
      result.hcmAluminumGearboxes = result.hcmAluminumGearboxes.map(item => {
        const newItem = { ...item };
        // 标记来源
        newItem._sourceType = 'hcmAluminumGearboxes';
        
        // 处理复杂的 transferCapacity
        if (newItem.transferCapacity && typeof newItem.transferCapacity === 'object') {
          // 保存原始结构
          newItem._originalCapacity = { ...newItem.transferCapacity };
          
          // 使用 P 工况(休闲工况)作为默认值
          if (Array.isArray(newItem.transferCapacity.P)) {
            newItem.transferCapacity = newItem.transferCapacity.P;
          } else {
            // 创建一个简化的传递能力数组或值
            newItem.transferCapacity = 
              Array.isArray(newItem.transferCapacity.M) ? newItem.transferCapacity.M : 
              Array.isArray(newItem.transferCapacity.P) ? newItem.transferCapacity.P : 
              typeof newItem.transferCapacity.M === 'number' ? newItem.transferCapacity.M :
              typeof newItem.transferCapacity.P === 'number' ? newItem.transferCapacity.P : 0.1;
          }
        }
        return newItem;
      });
    }
    
    // 处理双速齿轮箱
    if (result.twoSpeedGearboxes && Array.isArray(result.twoSpeedGearboxes)) {
      result.twoSpeedGearboxes = result.twoSpeedGearboxes.map(item => {
        const newItem = { ...item };
        // 标记来源
        newItem._sourceType = 'twoSpeedGearboxes';
        newItem._isTwoSpeed = true;
        
        // 处理 slowRatios 和 fastRatios
        if (item.slowRatios) {
          // 使用慢速比作为主要减速比
          newItem.ratios = item.slowRatios;
          newItem._fastRatios = item.fastRatios; // 保存快速比数据
          delete newItem.slowRatios;
          delete newItem.fastRatios;
        }
        
        // 如果 transferCapacity 是字符串，尝试转换为数值
        if (typeof newItem.transferCapacity === 'string') {
          const match = newItem.transferCapacity.match(/\d+(\.\d+)?/);
          if (match) {
            newItem._originalCapacityString = newItem.transferCapacity;
            newItem.transferCapacity = parseFloat(match[0]);
          }
        }
        
        return newItem;
      });
    }
    
    // 处理混合动力齿轮箱
    if (result.hybridGearboxes && Array.isArray(result.hybridGearboxes)) {
      result.hybridGearboxes = result.hybridGearboxes.map(item => {
        const newItem = { ...item };
        // 标记来源
        newItem._sourceType = 'hybridGearboxes';
        newItem._isHybrid = true;
        
        // 使用主输入减速比作为标准减速比
        if (newItem.mainRatios) {
          newItem.ratios = newItem.mainRatios;
          newItem._mainRatios = newItem.mainRatios; // 保留原字段
          
          // 保留PTI相关信息
          newItem._ptiRatios = newItem.ptiRatios;
          newItem._ptiTransferCapacity = newItem.ptiTransferCapacity;
          newItem._ptiInputSpeedRange = newItem.ptiInputSpeedRange;
          newItem._ptiRotationDirection = newItem.ptiRotationDirection;
          
          delete newItem.mainRatios;
          delete newItem.ptiRatios;
          delete newItem.ptiTransferCapacity;
          delete newItem.ptiInputSpeedRange;
          delete newItem.ptiRotationDirection;
        }
        
        // 使用主输入传递能力作为标准传递能力
        if (newItem.mainTransferCapacity) {
          newItem.transferCapacity = newItem.mainTransferCapacity;
          newItem._mainTransferCapacity = newItem.mainTransferCapacity; // 保留原字段
          delete newItem.mainTransferCapacity;
        }
        
        return newItem;
      });
    }
    
    return result;
  };
  
  // 执行导入
  const handleImport = () => {
    if (!importedData) {
      setError('没有可导入的数据');
      return;
    }

    setLoading(true);
    
    try {
      // 预处理特殊格式的数据
      const processedData = preprocessSpecialData(importedData);
      
      // 创建最终导入数据结构
      const finalData = {};
      
      // 处理数据映射
      Object.keys(processedData).forEach(sourceKey => {
        if (Array.isArray(processedData[sourceKey]) && collectionMapping[sourceKey]) {
          const targetKey = collectionMapping[sourceKey];
          
          if (!finalData[targetKey]) {
            finalData[targetKey] = [];
          }
          
          // 合并数据
          finalData[targetKey] = [
            ...finalData[targetKey],
            ...processedData[sourceKey]
          ];
        }
      });
      
      // 如果有onDataUpdate回调，调用它
      if (onDataUpdate && typeof onDataUpdate === 'function') {
        onDataUpdate(prevData => {
          // 合并到现有数据
          const result = { ...prevData };
          
          // 遍历最终数据的每个集合
          Object.keys(finalData).forEach(key => {
            if (!Array.isArray(result[key])) {
              result[key] = [];
            }
            
            // 合并数组，保留唯一model
            const existingModels = new Set(result[key].map(item => item.model));
            const newItems = finalData[key].filter(item => !existingModels.has(item.model));
            
            result[key] = [...result[key], ...newItems];
          });
          
          return result;
        });
        
        const totalItemCount = Object.values(finalData).reduce((total, items) => 
          total + (Array.isArray(items) ? items.length : 0), 0);
        
        setSuccess(`导入完成！已导入${Object.keys(finalData).length}个分类的数据，共计${totalItemCount}个项目`);
        
        // 重置状态
        setTimeout(() => {
          setPasteContent('');
          setImportedData(null);
          setShowPreview(false);
        }, 2000);
      } else {
        setError('未提供数据更新函数');
      }
    } catch (err) {
      setError(`导入失败: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 触发文件选择
  const triggerFileSelect = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // 数据集合类型名称映射
  const collectionTypes = {
    hcGearboxes: 'HC系列齿轮箱',
    gwGearboxes: 'GW系列齿轮箱',
    hcmGearboxes: 'HCM系列齿轮箱',
    dtGearboxes: 'DT系列齿轮箱',
    hcqGearboxes: 'HCQ系列齿轮箱',
    gcGearboxes: 'GC系列齿轮箱',
    twoSpeedGearboxes: '双速齿轮箱',
    hybridGearboxes: '混合动力齿轮箱',
    flexibleCouplings: '高弹性联轴器',
    standbyPumps: '备用泵',
    hclClutches: '液压离合器',
    hcmAluminumGearboxes: 'HCM铝合金齿轮箱',
    twinInputGearboxes: '双输入齿轮箱'
  };

  return (
    <div className="p-0">
      <Card className="mb-4">
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="paste" title={<span><i className="bi bi-clipboard me-1"></i>粘贴导入</span>}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>粘贴要导入的数据 (支持JSON或JavaScript格式)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={10}
                    value={pasteContent}
                    onChange={handlePasteContentChange}
                    placeholder="粘贴JSON数据或JavaScript对象定义..."
                    className="font-monospace"
                  />
                  <Form.Text className="text-muted">
                    支持标准JSON格式或JavaScript导出格式，例如: export const gearboxData = &#123;...&#125;
                  </Form.Text>
                </Form.Group>
                <Button 
                  variant="primary"
                  onClick={handlePasteImport}
                  disabled={loading || !pasteContent.trim()}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      解析中...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle me-2"></i>
                      解析数据
                    </>
                  )}
                </Button>
              </Form>
            </Tab>
            
            <Tab eventKey="file" title={<span><i className="bi bi-file-earmark-arrow-up me-1"></i>文件导入</span>}>
              <div className="text-center p-5 bg-light rounded mb-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                  accept=".json,.js,.py"
                />
                <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
                <h4 className="mt-3">点击选择文件上传</h4>
                <p className="text-muted">支持 JSON, JavaScript 或 Python 数据文件</p>
                <Button 
                  variant="outline-primary" 
                  onClick={triggerFileSelect}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" className="me-2" />
                      处理中...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-folder me-2"></i>
                      浏览文件
                    </>
                  )}
                </Button>
              </div>
              <div className="text-muted">
                <h6>支持的文件格式:</h6>
                <ul className="mb-0">
                  <li><code>.json</code> - 标准JSON格式文件</li>
                  <li><code>.js</code> - 包含导出常量的JavaScript文件 (例如: <code>export const data = &#123;...&#125;</code>)</li>
                  <li><code>.py</code> - 包含Python数据结构的文件</li>
                </ul>
              </div>
            </Tab>
          </Tabs>
          
          {error && (
            <Alert variant="danger" className="mt-3" dismissible onClose={() => setError('')}>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mt-3" dismissible onClose={() => setSuccess('')}>
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {/* 数据预览和导入确认 */}
      {showPreview && importedData && (
        <Card className="mt-4">
          <Card.Header className="bg-light d-flex justify-content-between align-items-center">
            <h5 className="mb-0">数据预览</h5>
            <div>
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-2"
                onClick={() => setPreviewMode(previewMode === 'summary' ? 'details' : 'summary')}
              >
                <i className={`bi bi-${previewMode === 'summary' ? 'list-columns-reverse' : 'list'} me-1`}></i>
                {previewMode === 'summary' ? '详细视图' : '摘要视图'}
              </Button>
            </div>
          </Card.Header>
          <Card.Body>
            {/* 检查数据中是否有特殊类型需要特别处理 */}
            {Object.keys(importedData).some(key => 
              ['hcmAluminumGearboxes', 'twoSpeedGearboxes', 'hybridGearboxes', 'hclClutches', 'twinInputGearboxes'].includes(key)
            ) && (
              <Alert variant="warning" className="mb-4">
                <i className="bi bi-info-circle-fill me-2"></i>
                <strong>注意:</strong> 检测到特殊类型的齿轮箱数据（如混合动力、双速齿轮箱等）。系统将自动处理这些特殊数据结构，使其适配现有系统。
              </Alert>
            )}
            
            <div className="mb-4">
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th>数据集合</th>
                    <th>项目数</th>
                    <th>映射目标</th>
                    <th>状态</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(importedData)
                    .filter(key => Array.isArray(importedData[key]))
                    .map(key => {
                      const items = importedData[key];
                      const targetCollection = collectionMapping[key];
                      const isSpecialType = ['hcmAluminumGearboxes', 'twoSpeedGearboxes', 'hybridGearboxes'].includes(key);
                      
                      return (
                        <tr key={key}>
                          <td>{collectionTypes[key] || key}</td>
                          <td>{items.length}</td>
                          <td>
                            {targetCollection ? 
                              <span>{collectionTypes[targetCollection] || targetCollection}</span> : 
                              <Badge bg="danger">未映射</Badge>
                            }
                          </td>
                          <td>
                            {isSpecialType ? 
                              <Badge bg="warning">需特殊处理</Badge> : 
                              <Badge bg="success">标准格式</Badge>
                            }
                          </td>
                        </tr>
                      );
                    })
                  }
                </tbody>
                <tfoot>
                  <tr>
                    <th>总计</th>
                    <th colSpan={3}>
                      {Object.values(importedData).reduce((total, items) => 
                        total + (Array.isArray(items) ? items.length : 0), 0)} 项
                    </th>
                  </tr>
                </tfoot>
              </Table>
            </div>
            
            {previewMode === 'details' && (
              <Tabs defaultActiveKey={Object.keys(importedData).find(k => Array.isArray(importedData[k]))} className="mb-3">
                {Object.keys(importedData)
                  .filter(key => Array.isArray(importedData[key]) && importedData[key].length > 0)
                  .map(key => (
                    <Tab 
                      key={key} 
                      eventKey={key} 
                      title={
                        <span>
                          {collectionTypes[key] || key}
                          <Badge bg="secondary" className="ms-2">{importedData[key].length}</Badge>
                        </span>
                      }
                    >
                      <div style={{maxHeight: '400px', overflowY: 'auto'}}>
                        <Table striped bordered hover responsive size="sm">
                          <thead>
                            <tr>
                              <th>#</th>
                              <th>型号</th>
                              <th>减速比</th>
                              <th>传递能力</th>
                              <th>推力(kN)</th>
                              <th>重量(kg)</th>
                              <th>中心距(mm)</th>
                              {key === 'twoSpeedGearboxes' && <th>快档减速比</th>}
                              {key === 'hybridGearboxes' && <th>PTI输入</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {importedData[key].slice(0, 100).map((item, idx) => (
                              <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td>{item.model || "-"}</td>
                                <td>
                                  {Array.isArray(item.ratios) ? 
                                    (item.ratios.length > 3 ? `${item.ratios.slice(0, 3).join(', ')}...` : item.ratios.join(', ')) : 
                                    item.ratios || 
                                    (key === 'twoSpeedGearboxes' && Array.isArray(item.slowRatios) ? 
                                      item.slowRatios.join(', ') : "-")}
                                </td>
                                <td>
                                  {typeof item.transferCapacity === 'object' ? 
                                    '复杂结构' : 
                                    Array.isArray(item.transferCapacity) ? 
                                      (item.transferCapacity.length > 2 ? 
                                        `${item.transferCapacity.slice(0, 2).join(', ')}...` : 
                                        item.transferCapacity.join(', ')) : 
                                      item.transferCapacity || "-"}
                                </td>
                                <td>{item.thrust || "-"}</td>
                                <td>{item.weight || "-"}</td>
                                <td>{item.centerDistance || "-"}</td>
                                {key === 'twoSpeedGearboxes' && (
                                  <td>
                                    {Array.isArray(item.fastRatios) ? 
                                      (item.fastRatios.length > 3 ? 
                                        `${item.fastRatios.slice(0, 3).join(', ')}...` : 
                                        item.fastRatios.join(', ')) : 
                                      "-"}
                                  </td>
                                )}
                                {key === 'hybridGearboxes' && (
                                  <td>
                                    {item.ptiInputSpeedRange ? 
                                      `${item.ptiInputSpeedRange[0]}-${item.ptiInputSpeedRange[1]} rpm` : 
                                      "-"}
                                  </td>
                                )}
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        {importedData[key].length > 100 && (
                          <div className="text-center text-muted py-2">
                            显示前100项，共 {importedData[key].length} 项...
                          </div>
                        )}
                      </div>
                    </Tab>
                  ))
                }
              </Tabs>
            )}
            
            <div className="d-flex justify-content-end mt-4">
              <Button 
                variant="secondary" 
                className="me-2" 
                onClick={() => {
                  setShowPreview(false);
                  setImportedData(null);
                }}
              >
                取消
              </Button>
              <Button 
                variant="primary" 
                onClick={handleImport}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    导入中...
                  </>
                ) : (
                  <>
                    <i className="bi bi-cloud-upload-fill me-2"></i>
                    确认导入
                  </>
                )}
              </Button>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default GearboxDataImporter;