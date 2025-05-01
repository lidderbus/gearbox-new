// src/components/DiagnosticPanel.js
import React, { useState } from 'react';
import { Card, Button, ListGroup, Accordion, Alert, Badge } from 'react-bootstrap';

/**
 * 诊断面板组件
 * 提供应用状态显示和多种重置选项
 * 
 * @param {Object} props
 * @param {Object} props.appData - 应用数据对象
 * @param {Function} props.onReset - 数据重置回调函数
 * @param {Function} props.onHide - 关闭面板回调函数
 * @param {Object} props.colors - 主题颜色设置
 * @param {string} props.theme - 当前主题模式
 * @returns {JSX.Element}
 */
const DiagnosticPanel = ({ appData, onReset, onHide, colors, theme }) => {
  const [activeKey, setActiveKey] = useState('data-status');
  const [statusMessage, setStatusMessage] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  // 统计数据集合状态
  const getDataStatus = () => {
    const collections = [
      { key: 'hcGearboxes', name: 'HC系列齿轮箱' },
      { key: 'gwGearboxes', name: 'GW系列齿轮箱' },
      { key: 'hcmGearboxes', name: 'HCM系列齿轮箱' },
      { key: 'dtGearboxes', name: 'DT系列齿轮箱' },
      { key: 'hcqGearboxes', name: 'HCQ系列齿轮箱' },
      { key: 'gcGearboxes', name: 'GC系列齿轮箱' },
      { key: 'flexibleCouplings', name: '高弹性联轴器' },
      { key: 'standbyPumps', name: '备用泵' },
    ];

    return collections.map(col => {
      const count = appData && appData[col.key] && Array.isArray(appData[col.key]) 
        ? appData[col.key].length 
        : 0;
      
      return {
        ...col,
        count,
        status: count > 0 ? 'normal' : 'empty'
      };
    });
  };

  // 清除特定数据
  const clearSpecificData = (key) => {
    try {
      if (key === 'selection-history') {
        localStorage.removeItem('selectionHistory');
        setStatusMessage('选型历史记录已清除');
      } else if (key === 'export-cache') {
        // 清除导出相关的缓存
        const cacheKeys = Object.keys(localStorage).filter(k => 
          k.includes('export') || k.includes('pdf') || k.includes('doc') || k.includes('cache')
        );
        
        cacheKeys.forEach(k => localStorage.removeItem(k));
        setStatusMessage(`已清除 ${cacheKeys.length} 项导出缓存`);
      } else if (key === 'app-settings') {
        // 清除应用设置
        const settingsKeys = Object.keys(localStorage).filter(k => 
          k.includes('settings') || k.includes('config') || k.includes('theme') || k.includes('preferences')
        );
        
        settingsKeys.forEach(k => localStorage.removeItem(k));
        setStatusMessage(`已清除 ${settingsKeys.length} 项应用设置`);
      }
    } catch (err) {
      console.error('清除数据失败:', err);
      setStatusMessage('操作失败: ' + err.message);
    }
  };

  // 运行数据完整性检查
  const runDataIntegrityCheck = () => {
    try {
      const missingCollections = [];
      const requiredCollections = ['hcGearboxes', 'gwGearboxes', 'flexibleCouplings', 'standbyPumps'];
      
      requiredCollections.forEach(collection => {
        if (!appData[collection] || !Array.isArray(appData[collection]) || appData[collection].length === 0) {
          missingCollections.push(collection);
        }
      });
      
      // 检查价格字段
      const pricingIssues = [];
      Object.keys(appData).forEach(collection => {
        if (Array.isArray(appData[collection])) {
          appData[collection].forEach((item, index) => {
            if (!item.price && !item.basePrice) {
              pricingIssues.push(`${collection}[${index}]: ${item.model || '未知'}`);
            }
          });
        }
      });
      
      // 检查传递能力数组与减速比数组长度是否一致
      const arrayLengthIssues = [];
      ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes'].forEach(collection => {
        if (Array.isArray(appData[collection])) {
          appData[collection].forEach((item, index) => {
            if (Array.isArray(item.ratios) && Array.isArray(item.transferCapacity) && 
                item.ratios.length !== item.transferCapacity.length) {
              arrayLengthIssues.push(`${collection}[${index}]: ${item.model || '未知'}`);
            }
          });
        }
      });
      
      if (missingCollections.length > 0 || pricingIssues.length > 0 || arrayLengthIssues.length > 0) {
        let message = '';
        
        if (missingCollections.length > 0) {
          message += `检测到 ${missingCollections.length} 个关键数据集合缺失或为空:\n`;
          message += missingCollections.join(', ') + '\n\n';
        }
        
        if (pricingIssues.length > 0) {
          message += `发现 ${pricingIssues.length} 个组件价格字段缺失\n`;
        }
        
        if (arrayLengthIssues.length > 0) {
          message += `发现 ${arrayLengthIssues.length} 个齿轮箱的传递能力数组长度与减速比数组长度不一致\n`;
        }
        
        message += '建议重置数据以解决问题。';
        setStatusMessage(message);
        return false;
      } else {
        setStatusMessage('数据完整性检查通过！未发现明显问题。');
        return true;
      }
    } catch (err) {
      console.error('数据完整性检查失败:', err);
      setStatusMessage('检查失败: ' + err.message);
      return false;
    }
  };

  // 获取浏览器存储信息
  const getStorageInfo = () => {
    try {
      const localStorage = window.localStorage;
      const sessionStorage = window.sessionStorage;
      
      const localStorageSize = new Blob(
        Object.values(localStorage)
      ).size;
      
      const sessionStorageSize = new Blob(
        Object.values(sessionStorage)
      ).size;
      
      const localStorageItems = Object.keys(localStorage).length;
      const sessionStorageItems = Object.keys(sessionStorage).length;
      
      return {
        localStorageSize: (localStorageSize / 1024).toFixed(2) + ' KB',
        localStorageItems,
        localStorageLimit: '5 MB',
        localStorageUsage: Math.round((localStorageSize / (5 * 1024 * 1024)) * 100) + '%',
        sessionStorageSize: (sessionStorageSize / 1024).toFixed(2) + ' KB',
        sessionStorageItems
      };
    } catch (err) {
      console.error('获取存储信息失败:', err);
      return {
        error: err.message
      };
    }
  };

  // 获取实际存储项目列表
  const getStorageItems = () => {
    try {
      return Object.keys(localStorage).map(key => {
        let size = localStorage.getItem(key) ? new Blob([localStorage.getItem(key)]).size : 0;
        return {
          key,
          size: (size / 1024).toFixed(2) + ' KB',
          type: key.includes('appData') ? 'app-data' : 
                key.includes('history') ? 'history' :
                key.includes('user') || key.includes('auth') ? 'auth' : 'other'
        };
      });
    } catch (err) {
      console.error('获取存储项目列表失败:', err);
      return [];
    }
  };

  // 创建诊断报告
  const createDiagnosticReport = () => {
    try {
      const dataStatus = getDataStatus();
      const storageInfo = getStorageInfo();
      const missingCollections = dataStatus.filter(item => item.status === 'empty').map(item => item.key);
      
      const report = {
        timestamp: new Date().toISOString(),
        browser: navigator.userAgent,
        dataCollections: dataStatus.map(item => ({
          name: item.name,
          key: item.key,
          count: item.count
        })),
        storageInfo,
        missingCollections,
        dataStatus: missingCollections.length > 0 ? 'incomplete' : 'ok'
      };
      
      const reportStr = JSON.stringify(report, null, 2);
      
      // 复制到剪贴板
      navigator.clipboard.writeText(reportStr)
        .then(() => {
          setStatusMessage('诊断报告已复制到剪贴板');
        })
        .catch(err => {
          console.error("复制失败:", err);
          setStatusMessage('复制诊断报告失败: ' + err.message);
          
          // 备用方案：显示报告
          setStatusMessage('无法复制到剪贴板，请手动复制下方报告:\n\n' + reportStr);
        });
    } catch (err) {
      console.error('创建诊断报告失败:', err);
      setStatusMessage('创建诊断报告失败: ' + err.message);
    }
  };

  // 获取存储信息
  const storageInfo = getStorageInfo();
  const dataStatus = getDataStatus();
  const storageItems = getStorageItems();

  // 面板样式
  const panelStyle = {
    position: 'fixed',
    bottom: '70px',
    left: '20px',
    width: '450px',
    maxWidth: '95vw',
    maxHeight: '80vh',
    overflowY: 'auto',
    zIndex: 1000,
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: '6px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    padding: 0
  };

  // 标题栏样式
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 15px',
    borderBottom: `1px solid ${colors.border}`,
    backgroundColor: colors.headerBg,
    color: colors.headerText,
    borderRadius: '5px 5px 0 0'
  };

  // 内容区样式
  const contentStyle = {
    padding: '15px',
    color: colors.text
  };

  // 状态指示器样式函数
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'empty':
        return 'danger';
      case 'warning':
        return 'warning';
      case 'normal':
        return 'success';
      default:
        return 'secondary';
    }
  };

  return (
    <Card style={panelStyle}>
      <div style={headerStyle}>
        <h5 style={{ margin: 0 }}>
          <i className="bi bi-tools me-2"></i>
          系统诊断工具
        </h5>
        <Button 
          variant="link" 
          size="sm" 
          onClick={onHide}
          style={{ color: colors.headerText, textDecoration: 'none', padding: '4px 8px' }}
        >
          <i className="bi bi-x-lg"></i>
        </Button>
      </div>

      <Card.Body style={contentStyle}>
        {statusMessage && (
          <Alert 
            variant="info" 
            onClose={() => setStatusMessage('')} 
            dismissible
            className="mb-3"
          >
            {statusMessage.split('\n').map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </Alert>
        )}

        {showConfirmReset && (
          <Alert variant="danger" className="mb-3">
            <Alert.Heading>确认重置</Alert.Heading>
            <p>此操作将清除所有应用数据并刷新页面。继续吗？</p>
            <div className="d-flex justify-content-end">
              <Button 
                variant="outline-secondary" 
                size="sm" 
                onClick={() => setShowConfirmReset(false)}
                className="me-2"
              >
                取消
              </Button>
              <Button 
                variant="danger" 
                size="sm" 
                onClick={() => {
                  setShowConfirmReset(false);
                  onReset();
                }}
              >
                确认重置
              </Button>
            </div>
          </Alert>
        )}

        <Accordion activeKey={activeKey} onSelect={(k) => setActiveKey(k)}>
          <Accordion.Item eventKey="data-status">
            <Accordion.Header>数据集合状态</Accordion.Header>
            <Accordion.Body>
              <ListGroup variant="flush">
                {dataStatus.map((item) => (
                  <ListGroup.Item 
                    key={item.key}
                    className="d-flex justify-content-between align-items-center"
                    style={{ 
                      backgroundColor: colors.card, 
                      color: colors.text,
                      padding: '8px 10px',
                      borderColor: colors.border
                    }}
                  >
                    {item.name}
                    <div>
                      <Badge 
                        bg={getStatusBadgeVariant(item.status)}
                        style={{ marginRight: '8px' }}
                      >
                        {item.status === 'empty' ? '空' : '正常'}
                      </Badge>
                      <span>{item.count} 项</span>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              
              <div className="mt-3">
                <Button 
                  variant="primary" 
                  size="sm" 
                  onClick={runDataIntegrityCheck}
                  className="me-2"
                >
                  <i className="bi bi-check-circle me-1"></i>
                  运行完整性检查
                </Button>
                <Button 
                  variant="outline-info" 
                  size="sm" 
                  onClick={() => {
                    console.log('当前应用数据:', appData);
                    setStatusMessage('应用数据已输出到浏览器控制台 (F12)');
                  }}
                >
                  <i className="bi bi-terminal me-1"></i>
                  在控制台输出数据
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="storage-status">
            <Accordion.Header>存储状态</Accordion.Header>
            <Accordion.Body>
              {storageInfo.error ? (
                <Alert variant="danger">{storageInfo.error}</Alert>
              ) : (
                <>
                  <div className="mb-3">
                    <h6>本地存储 (localStorage)</h6>
                    <ListGroup variant="flush">
                      <ListGroup.Item
                        style={{ 
                          backgroundColor: colors.card, 
                          color: colors.text,
                          borderColor: colors.border
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <span>使用量:</span>
                          <strong>{storageInfo.localStorageUsage} ({storageInfo.localStorageSize})</strong>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item
                        style={{ 
                          backgroundColor: colors.card, 
                          color: colors.text,
                          borderColor: colors.border
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <span>项目数:</span>
                          <strong>{storageInfo.localStorageItems}</strong>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>

                  <div className="mb-3">
                    <h6>会话存储 (sessionStorage)</h6>
                    <ListGroup variant="flush">
                      <ListGroup.Item
                        style={{ 
                          backgroundColor: colors.card, 
                          color: colors.text,
                          borderColor: colors.border
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <span>大小:</span>
                          <strong>{storageInfo.sessionStorageSize}</strong>
                        </div>
                      </ListGroup.Item>
                      <ListGroup.Item
                        style={{ 
                          backgroundColor: colors.card, 
                          color: colors.text,
                          borderColor: colors.border
                        }}
                      >
                        <div className="d-flex justify-content-between">
                          <span>项目数:</span>
                          <strong>{storageInfo.sessionStorageItems}</strong>
                        </div>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>

                  <div className="mb-3">
                    <h6>存储项目 (按大小排序)</h6>
                    <div style={{ maxHeight: '200px', overflowY: 'auto', border: `1px solid ${colors.border}`, borderRadius: '4px' }}>
                      <ListGroup variant="flush">
                        {storageItems
                          .sort((a, b) => parseFloat(b.size) - parseFloat(a.size))
                          .slice(0, 10)
                          .map((item, index) => (
                            <ListGroup.Item 
                              key={index}
                              className="d-flex justify-content-between align-items-center"
                              style={{ 
                                backgroundColor: colors.card, 
                                color: colors.text,
                                fontSize: '0.85rem',
                                padding: '6px 10px',
                                borderColor: colors.border
                              }}
                            >
                              <div style={{ 
                                maxWidth: '250px', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap' 
                              }}>
                                {item.key}
                              </div>
                              <div>
                                {item.type === 'app-data' && (
                                  <Badge bg="primary" style={{ marginRight: '5px' }}>数据</Badge>
                                )}
                                {item.type === 'history' && (
                                  <Badge bg="info" style={{ marginRight: '5px' }}>历史</Badge>
                                )}
                                {item.type === 'auth' && (
                                  <Badge bg="warning" style={{ marginRight: '5px' }}>认证</Badge>
                                )}
                                <span>{item.size}</span>
                              </div>
                            </ListGroup.Item>
                          ))}
                      </ListGroup>
                    </div>
                  </div>
                </>
              )}
              
              <div className="mt-3">
                <Button 
                  variant="outline-danger" 
                  size="sm" 
                  onClick={() => clearSpecificData('export-cache')}
                  className="me-2"
                >
                  <i className="bi bi-trash me-1"></i>
                  清除导出缓存
                </Button>
                <Button 
                  variant="outline-warning" 
                  size="sm" 
                  onClick={() => clearSpecificData('selection-history')}
                >
                  <i className="bi bi-clock-history me-1"></i>
                  清除选型历史
                </Button>
              </div>
            </Accordion.Body>
          </Accordion.Item>

          <Accordion.Item eventKey="diagnostics">
            <Accordion.Header>诊断与故障排除</Accordion.Header>
            <Accordion.Body>
              <Alert variant="info" className="mb-3">
                <strong>常见问题:</strong>
                <ul className="mb-0 ps-3 mt-1">
                  <li>PDF导出中文乱码 - 尝试清除导出缓存</li>
                  <li>技术协议第二页空白 - 尝试重置数据或使用Word导出</li>
                  <li>数据加载问题 - 检查数据完整性或重置数据</li>
                </ul>
              </Alert>
              
              <div className="mb-3">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={createDiagnosticReport}
                  className="me-2"
                >
                  <i className="bi bi-file-earmark-text me-1"></i>
                  生成诊断报告
                </Button>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => {
                    // 检查应用版本
                    const appVersion = '1.5.1'; // 从页脚获取
                    setStatusMessage(`应用版本: ${appVersion}\n浏览器: ${navigator.userAgent}`);
                  }}
                >
                  <i className="bi bi-info-circle me-1"></i>
                  版本信息
                </Button>
              </div>
              
              <div className="mt-4">
                <Alert variant="warning">
                  <strong>数据重置操作:</strong>
                  <p className="mb-2 mt-1">此操作将清除所有本地存储的数据并重新加载应用。</p>
                  <div className="d-flex justify-content-end">
                    <Button 
                      variant="danger" 
                      size="sm"
                      onClick={() => setShowConfirmReset(true)}
                    >
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      强制重置应用数据
                    </Button>
                  </div>
                </Alert>
              </div>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </Card.Body>
    </Card>
  );
};

export default DiagnosticPanel;