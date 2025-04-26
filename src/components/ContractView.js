// src/components/ContractView.js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, Alert, ProgressBar, Row, Col, Table, Spinner } from 'react-bootstrap';
import { contractExportHelper } from '../utils/contractExporter';

/**
 * 合同视图组件
 * 展示合同内容并提供导出功能
 */
const ContractView = ({ 
  contract, 
  onExportWord = () => {}, 
  onExportPDF = () => {}, 
  theme, 
  colors 
}) => {
  // 导出状态管理
  const [exportState, setExportState] = useState({
    status: 'idle',
    progress: 0,
    error: null,
    result: null
  });
  
  // 处理导出进度回调
  const handleExportProgress = useCallback((state) => {
    setExportState(state);
  }, []);
  
  // 处理PDF导出
  const handleExportPDF = useCallback(async () => {
    // 先执行自定义处理函数
    if (typeof onExportPDF === 'function') {
      onExportPDF();
    }
    
    // 验证合同数据
    const validation = contractExportHelper.validateContract(contract);
    if (!validation.valid) {
      setExportState({
        status: 'error',
        error: {
          message: `合同数据验证失败: ${validation.errors.join('; ')}`
        }
      });
      return;
    }
    
    // 创建文件名
    const filename = contractExportHelper.createDefaultFilename(contract);
    
    // 导出合同
    try {
      await contractExportHelper.exportToPDF(contract, filename, handleExportProgress);
    } catch (error) {
      console.error("PDF导出处理失败:", error);
    }
  }, [contract, onExportPDF, handleExportProgress]);
  
  // 处理Word导出
  const handleExportWord = useCallback(async () => {
    // 先执行自定义处理函数
    if (typeof onExportWord === 'function') {
      onExportWord();
    }
    
    // 验证合同数据
    const validation = contractExportHelper.validateContract(contract);
    if (!validation.valid) {
      setExportState({
        status: 'error',
        error: {
          message: `合同数据验证失败: ${validation.errors.join('; ')}`
        }
      });
      return;
    }
    
    // 创建文件名
    const filename = contractExportHelper.createDefaultFilename(contract);
    
    // 导出合同
    try {
      await contractExportHelper.exportToWord(contract, filename, handleExportProgress);
    } catch (error) {
      console.error("Word导出处理失败:", error);
    }
  }, [contract, onExportWord, handleExportProgress]);
  
  // 处理导出状态重置
  const handleResetExportState = useCallback(() => {
    contractExportHelper.reset();
    setExportState({
      status: 'idle',
      progress: 0,
      error: null,
      result: null
    });
  }, []);
  
  // 清理导出状态（组件卸载时）
  useEffect(() => {
    return () => {
      contractExportHelper.reset();
    };
  }, []);
  
  // 渲染导出状态
  const renderExportStatus = () => {
    const { status, progress, error } = exportState;
    
    if (status === 'error') {
      return (
        <Alert variant="danger" dismissible onClose={handleResetExportState}>
          <Alert.Heading>导出失败</Alert.Heading>
          <p>{error?.message || '未知错误'}</p>
        </Alert>
      );
    }
    
    if (status === 'idle' || status === 'completed') {
      return null;
    }
    
    return (
      <div className="export-progress mt-3">
        <ProgressBar 
          now={progress} 
          label={`${progress}%`} 
          variant={status === 'preparing' ? 'info' : (status === 'generating' ? 'primary' : 'success')}
          animated={status !== 'completed'} 
        />
        <div className="export-status-text text-muted mt-1">
          {status === 'preparing' && '准备导出文件...'}
          {status === 'generating' && '正在生成文档内容...'}
          {status === 'exporting' && '正在导出文件...'}
          {status === 'completed' && '导出完成!'}
        </div>
      </div>
    );
  };
  
  // 如果没有合同数据，显示错误信息
  if (!contract) {
    return (
      <Alert variant="warning">
        <i className="bi bi-exclamation-triangle me-2"></i>
        未加载合同数据，请先生成合同。
      </Alert>
    );
  }
  
  // 如果合同生成失败，显示错误信息
  if (!contract.success) {
    return (
      <Alert variant="danger">
        <i className="bi bi-x-circle me-2"></i>
        合同生成失败: {contract.message || '未知错误'}
      </Alert>
    );
  }
  
  return (
    <div className="contract-view">
      {/* 顶部操作栏 */}
      <div className="contract-actions mb-3 d-flex justify-content-between align-items-center">
        <h3 style={{ color: colors?.headerText }}>
          <i className="bi bi-file-earmark-text me-2"></i>
          销售合同
        </h3>
        
        <div>
          <Button 
            variant="outline-primary" 
            size="sm" 
            className="me-2" 
            onClick={handleExportWord}
            disabled={exportState.status !== 'idle' && exportState.status !== 'completed' && exportState.status !== 'error'}
          >
            <i className="bi bi-file-earmark-word me-1"></i> 导出Word
          </Button>
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={handleExportPDF}
            disabled={exportState.status !== 'idle' && exportState.status !== 'completed' && exportState.status !== 'error'}
          >
            <i className="bi bi-file-earmark-pdf me-1"></i> 导出PDF
          </Button>
        </div>
      </div>
      
      {/* 导出状态 */}
      {renderExportStatus()}
      
      {/* 合同内容预览 */}
      <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
        <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
          合同基本信息
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>合同编号：</strong> {contract.contractNumber}</p>
              <p><strong>签订日期：</strong> {contract.contractDate}</p>
              <p><strong>买方单位：</strong> {contract.buyerInfo?.name}</p>
            </Col>
            <Col md={6}>
              <p><strong>交货日期：</strong> {contract.deliveryDate}</p>
              <p><strong>交货地点：</strong> {contract.deliveryLocation}</p>
              <p><strong>总金额：</strong> ¥{contract.totalAmount?.toLocaleString()}</p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* 产品信息表 */}
      <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
        <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
          产品明细
        </Card.Header>
        <Card.Body style={{ padding: 0 }}>
          <Table responsive bordered hover style={{ margin: 0 }}>
            <thead style={{ backgroundColor: colors?.headerBg }}>
              <tr>
                <th style={{ width: '5%' }}>序号</th>
                <th style={{ width: '20%' }}>产品名称</th>
                <th style={{ width: '20%' }}>规格型号</th>
                <th style={{ width: '10%' }}>单位</th>
                <th style={{ width: '10%' }}>数量</th>
                <th style={{ width: '15%' }}>单价(元)</th>
                <th style={{ width: '15%' }}>金额</th>
                <th style={{ width: '15%' }}>交货期</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(contract.products) && contract.products.map((product, index) => (
                <tr key={`product-${index}`}>
                  <td style={{ textAlign: 'center' }}>{index + 1}</td>
                  <td>{product.name || '-'}</td>
                  <td>{product.model || '-'}</td>
                  <td style={{ textAlign: 'center' }}>{product.unit || '-'}</td>
                  <td style={{ textAlign: 'center' }}>{product.quantity || '-'}</td>
                  <td style={{ textAlign: 'right' }}>{product.unitPrice ? product.unitPrice.toLocaleString() : '-'}</td>
                  <td style={{ textAlign: 'right' }}>{product.amount ? product.amount.toLocaleString() : '-'}</td>
                  <td>{product.deliveryQuarter ? `第${product.deliveryQuarter}季度` : '-'}</td>
                </tr>
              ))}
              
              {/* 合计行 */}
              <tr style={{ backgroundColor: colors?.headerBg, fontWeight: 'bold' }}>
                <td colSpan={6} style={{ textAlign: 'right' }}>合计：</td>
                <td style={{ textAlign: 'right' }}>{contract.totalAmount ? contract.totalAmount.toLocaleString() : '-'}</td>
                <td></td>
              </tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
      
      {/* 合计金额（中文大写） */}
      <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
        <Card.Body>
          <p className="mb-0">
            <strong>合计人民币（大写）：</strong> {contract.totalAmountInChinese || ''}
            <span className="ms-4"><strong>¥（小写）：</strong> {contract.totalAmount ? contract.totalAmount.toLocaleString() : '0'}</span>
          </p>
        </Card.Body>
      </Card>
      
      {/* 合同条款 */}
      <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
        <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
          合同条款
        </Card.Header>
        <Card.Body>
          <p><strong>1. 执行质量标准：</strong>{contract.executionStandard || '按国家标准'}</p>
          <p><strong>2. 验收及质量异议期限：</strong>{contract.inspectionPeriod || ''}</p>
          <p><strong>3. 交货时间：</strong>{contract.deliveryDate || ''}</p>
          <p><strong>4. 交货地点：</strong>{contract.deliveryLocation || ''}</p>
          <p><strong>5. 交货方式：</strong>{contract.deliveryMethod || ''}</p>
          <p><strong>6. 运输方式：</strong>{contract.transportMethod || ''} <strong>运费结算：</strong>{contract.transportFeeArrangement || ''}</p>
          <p><strong>7. 包装标准：</strong>{contract.packagingStandard || ''} <strong>包装费：</strong>{contract.packagingFeeArrangement || ''}</p>
          <p><strong>8. 结算方式及期限：</strong>{contract.paymentMethod || ''}</p>
          <p><strong>9. 违约责任：</strong>按"民法典"规定条款执行。</p>
          <p><strong>10. 争议解决：</strong>{contract.disputeResolution || ''}</p>
          <p><strong>11. 其他约定事项或特殊订货要求：</strong>{contract.specialRequirements || '无'}</p>
          <p><strong>12. 合同有效期限：</strong>自签订日起至{contract.expiryDate || ''}止</p>
          <p><strong>13. 其他：</strong>{contract.contractCopies || '本合同一式两份，双方各持一份。'}</p>
        </Card.Body>
      </Card>
      
      {/* 签名区域 */}
      <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
        <Card.Body>
          <Row>
            <Col md={6}>
              <p><strong>需方（盖章）：</strong></p>
              <div style={{ height: '80px' }}></div>
              <p><strong>法定代表人或委托代理人（签字）：</strong></p>
              <div style={{ height: '40px' }}></div>
              <p><strong>日期：</strong></p>
            </Col>
            <Col md={6}>
              <p><strong>供方（盖章）：</strong></p>
              <div style={{ height: '80px' }}></div>
              <p><strong>法定代表人或委托代理人（签字）：</strong></p>
              <div style={{ height: '40px' }}></div>
              <p><strong>日期：</strong></p>
            </Col>
          </Row>
        </Card.Body>
      </Card>
      
      {/* 底部导出按钮 */}
      <div className="contract-actions d-flex justify-content-center mb-4">
        <Button 
          variant="primary" 
          onClick={handleExportWord}
          className="me-4"
          disabled={exportState.status !== 'idle' && exportState.status !== 'completed' && exportState.status !== 'error'}
        >
          {exportState.status === 'generating' || exportState.status === 'exporting' ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              正在导出...
            </>
          ) : (
            <>
              <i className="bi bi-file-earmark-word me-2"></i>
              导出Word文档
            </>
          )}
        </Button>
        <Button 
          variant="danger" 
          onClick={handleExportPDF}
          disabled={exportState.status !== 'idle' && exportState.status !== 'completed' && exportState.status !== 'error'}
        >
          {exportState.status === 'generating' || exportState.status === 'exporting' ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              正在导出...
            </>
          ) : (
            <>
              <i className="bi bi-file-earmark-pdf me-2"></i>
              导出PDF文档
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ContractView;