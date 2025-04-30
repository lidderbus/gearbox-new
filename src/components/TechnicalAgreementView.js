// src/components/TechnicalAgreementView.js - 修改版，支持中英文对照
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Alert, Card, Badge } from 'react-bootstrap';
import AgreementGenerator from './AgreementGenerator';
import ErrorBoundary from './ErrorBoundary'; // 导入错误边界组件
import { exportHtmlContentToPDF, printHtmlContent } from '../utils/pdfExportUtils';
import { needsStandbyPump } from '../utils/enhancedPumpSelection';

/**
 * 技术协议视图组件
 * 用于管理技术协议的生成、预览和导出
 */
const TechnicalAgreementView = ({
  selectionResult,
  projectInfo,
  selectedComponents,
  colors,
  theme,
  onNavigateToQuotation,
  onNavigateToContract
}) => {
  const [agreement, setAgreement] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);
  
  // 检查备用泵需求
  useEffect(() => {
    if (selectedComponents && selectedComponents.gearbox) {
      const gearboxModel = selectedComponents.gearbox.model;
      
      // 使用与其他组件一致的判断逻辑
      const requiresPump = needsStandbyPump(gearboxModel, { 
        power: selectedComponents.gearbox.power 
      });
      
      // 检查是否存在备用泵需求不匹配的情况
      if (requiresPump && !selectedComponents.pump) {
        setWarning("注意: 当前选择的齿轮箱型号需要配备备用泵，但技术协议中未包含备用泵信息。");
      } else if (!requiresPump && selectedComponents.pump) {
        setWarning("注意: 当前选择的齿轮箱型号不需要配备备用泵，但技术协议中包含了备用泵信息。");
      } else {
        setWarning("");
      }
    }
  }, [selectedComponents]);
  
  // 处理协议生成完成
  const handleAgreementGenerated = (generatedAgreement) => {
    setAgreement(generatedAgreement);
    
    // 根据协议语言设置成功消息
    if (generatedAgreement.language === 'bilingual') {
      setSuccess(`中英文对照技术协议已成功生成 (布局: ${getBilingualLayoutName(generatedAgreement.bilingualLayout)})`);
    } else {
      setSuccess(`${generatedAgreement.language === 'zh' ? '中文' : '英文'}技术协议已成功生成`);
    }
    
    setError('');
  };
  
  // 获取布局名称
  const getBilingualLayoutName = (layout) => {
    switch (layout) {
      case 'side-by-side': return '左右对照';
      case 'sequential': return '分段对照';
      case 'complete': return '全文对照';
      default: return layout;
    }
  };
  
  // 导出为Word
  const exportToWord = () => {
    if (!agreement) {
      setError('请先生成技术协议');
      return;
    }

    try {
      // 创建一个新的Blob对象，内容为HTML
      const blob = new Blob([agreement.html], { 
        type: 'application/msword',
        encoding: 'UTF-8'
      });
      
      // 创建下载链接
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      
      // 构建文件名，包含语言信息
      let filename = `${projectInfo?.projectName || '齿轮箱'}_技术协议`;
      if (agreement.language === 'bilingual') {
        filename += '_中英文对照';
      } else if (agreement.language === 'en') {
        filename += '_英文版';
      } else {
        filename += '_中文版';
      }
      
      link.download = `${filename}.doc`;
      
      // 模拟点击下载
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setSuccess('技术协议已导出为Word格式');
    } catch (error) {
      console.error('导出Word失败:', error);
      setError(`导出Word失败: ${error.message}`);
    }
  };
  
  // 导出为PDF - 修改版
  const exportToPDF = () => {
    if (!agreement) {
      setError('请先生成技术协议');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      // 获取预览元素
      const previewElement = document.querySelector('.agreement-preview-content');
      
      if (!previewElement) {
        throw new Error('无法找到预览内容');
      }
      
      // 构建文件名，包含语言信息
      let filename = `${projectInfo?.projectName || '齿轮箱'}_技术协议`;
      if (agreement.language === 'bilingual') {
        filename += '_中英文对照';
      } else if (agreement.language === 'en') {
        filename += '_英文版';
      } else {
        filename += '_中文版';
      }
      
      // 添加延迟确保内容渲染完成
      setTimeout(() => {
        // 导出PDF
        exportHtmlContentToPDF(previewElement, {
          filename: `${filename}.pdf`,
          orientation: 'portrait',
          format: 'a4',
          margin: { top: 20, right: 20, bottom: 20, left: 20 },
          scale: 1.5,
          useCORS: true,
          allowTaint: true
        })
        .then(() => {
          setSuccess('技术协议已导出为PDF格式');
          setLoading(false);
        })
        .catch((err) => {
          console.error('导出PDF失败:', err);
          setError(`导出PDF失败: ${err.message}`);
          setLoading(false);
        });
      }, 500); // 添加500ms延时确保DOM渲染完成
    } catch (error) {
      console.error('导出PDF失败:', error);
      setError(`导出PDF失败: ${error.message}`);
      setLoading(false);
    }
  };
  
  // 复制到剪贴板
  const copyToClipboard = () => {
    if (!agreement) {
      setError('请先生成技术协议');
      return;
    }

    try {
      // 创建一个临时元素用于复制
      const tempElement = document.createElement('div');
      tempElement.innerHTML = agreement.html;
      
      // 获取纯文本
      const plainText = tempElement.textContent || tempElement.innerText;
      
      // 复制到剪贴板
      navigator.clipboard.writeText(plainText)
        .then(() => {
          setSuccess('技术协议内容已复制到剪贴板');
        })
        .catch((err) => {
          console.error('复制到剪贴板失败:', err);
          setError(`复制到剪贴板失败: ${err.message}`);
        });
    } catch (error) {
      console.error('复制到剪贴板失败:', error);
      setError(`复制到剪贴板失败: ${error.message}`);
    }
  };
  
  // 打印功能 - 新增
  const handlePrint = () => {
    if (!agreement) {
      setError('请先生成技术协议');
      return;
    }

    const previewElement = document.querySelector('.agreement-preview-content');
    
    if (!previewElement) {
      setError('无法找到预览内容');
      return;
    }
    
    setLoading(true);
    
    try {
      printHtmlContent(previewElement, {
        title: `${projectInfo?.projectName || '齿轮箱'}_技术协议`,
        beforePrint: () => setSuccess('正在准备打印...'),
        afterPrint: () => {
          setLoading(false);
          setSuccess('打印准备完成');
        }
      });
    } catch (error) {
      console.error('打印失败:', error);
      setError(`打印失败: ${error.message}`);
      setLoading(false);
    }
  };

  // 当技术协议组件出错时渲染的备用UI
  const agreementFallback = (
    <Card className="mt-3">
      <Card.Body className="text-center">
        <p>无法渲染技术协议生成器组件。请尝试以下操作：</p>
        <ul className="text-start">
          <li>刷新页面重试</li>
          <li>暂时禁用特殊订货要求模板选择功能</li>
          <li>联系系统管理员</li>
        </ul>
        <Button 
          variant="primary" 
          onClick={onNavigateToQuotation}
        >
          返回报价单
        </Button>
      </Card.Body>
    </Card>
  );
  
  return (
    <Container fluid>
      {error && (
        <Row className="mb-3">
          <Col>
            <Alert variant="danger" onClose={() => setError('')} dismissible>
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </Alert>
          </Col>
        </Row>
      )}
      
      {success && (
        <Row className="mb-3">
          <Col>
            <Alert variant="success" onClose={() => setSuccess('')} dismissible>
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </Alert>
          </Col>
        </Row>
      )}
      
      {warning && (
        <Row className="mb-3">
          <Col>
            <Alert variant="warning" onClose={() => setWarning('')} dismissible>
              <i className="bi bi-exclamation-circle-fill me-2"></i>
              {warning}
            </Alert>
          </Col>
        </Row>
      )}
      
      {/* 备用泵需求提示 */}
      {selectedComponents?.gearbox && (
        <Row className="mb-3">
          <Col>
            <Alert variant="info">
              <i className="bi bi-info-circle-fill me-2"></i>
              <strong>备用泵需求检查：</strong> 当前选择的齿轮箱型号 ({selectedComponents.gearbox.model}) 
              {needsStandbyPump(selectedComponents.gearbox.model, { power: selectedComponents.gearbox.power }) ? 
                <strong> 需要配备备用泵</strong> : 
                <strong> 不需要配备备用泵</strong>
              }。
              {needsStandbyPump(selectedComponents.gearbox.model, { power: selectedComponents.gearbox.power }) && !selectedComponents.pump && 
                <span className="ms-2 text-danger">请确保在技术协议中正确考虑备用泵配套要求。</span>
              }
            </Alert>
          </Col>
        </Row>
      )}
      
      <Row className="mb-3">
        <Col>
          <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-file-earmark-text me-2"></i>
                  技术协议管理
                  {agreement && agreement.language === 'bilingual' && (
                    <Badge bg="info" className="ms-2">中英文对照</Badge>
                  )}
                  {agreement && agreement.language === 'en' && (
                    <Badge bg="secondary" className="ms-2">英文版</Badge>
                  )}
                </div>
                <div>
                  {agreement && (
                    <>
                      <Button variant="outline-primary" size="sm" className="me-2" onClick={exportToWord}>
                        <i className="bi bi-file-earmark-word me-1"></i> 导出Word
                      </Button>
                      <Button variant="outline-danger" size="sm" className="me-2" onClick={exportToPDF}>
                        <i className="bi bi-file-earmark-pdf me-1"></i> 导出PDF
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={handlePrint}>
                        <i className="bi bi-printer me-1"></i> 打印
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="me-2" onClick={copyToClipboard}>
                        <i className="bi bi-clipboard me-1"></i> 复制内容
                      </Button>
                    </>
                  )}
                  <Button variant="outline-success" size="sm" className="me-2" onClick={onNavigateToQuotation}>
                    <i className="bi bi-currency-yen me-1"></i> 返回报价单
                  </Button>
                  <Button variant="outline-info" size="sm" onClick={onNavigateToContract}>
                    <i className="bi bi-file-earmark-ruled me-1"></i> 生成合同
                  </Button>
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              {/* 使用错误边界包裹AgreementGenerator组件 */}
              <ErrorBoundary fallback={agreementFallback}>
                <AgreementGenerator
                  selectionResult={selectionResult}
                  projectInfo={projectInfo}
                  selectedComponents={selectedComponents}
                  colors={colors}
                  theme={theme}
                  onGenerated={handleAgreementGenerated}
                />
              </ErrorBoundary>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TechnicalAgreementView;