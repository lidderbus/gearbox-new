// src/components/ContractView.js
import React, { useState, useCallback, useEffect } from 'react';
import { Card, Button, Alert, ProgressBar, Row, Col, Table, Spinner } from 'react-bootstrap';
import { contractExportHelper } from '../utils/contractExporter';
import { printHtmlContent } from '../utils/pdfExportUtils';

// 合同多语言标签
const contractLabels = {
  zh: {
    title: '销售合同', basicInfo: '合同基本信息', productDetails: '产品明细', terms: '合同条款',
    contractNo: '合同编号', signDate: '签订日期', buyer: '买方单位', deliveryDate: '交货日期',
    deliveryPlace: '交货地点', totalAmount: '总金额',
    no: '序号', productName: '产品名称', spec: '规格型号', unit: '单位', qty: '数量',
    unitPrice: '单价(元)', amount: '金额', deliveryPeriod: '交货期',
    subtotal: '合计', totalChinese: '合计人民币（大写）', totalLower: '¥（小写）',
    clause1: '执行质量标准', clause2: '验收及质量异议期限', clause3: '交货时间',
    clause4: '交货地点', clause5: '交货方式', clause6: '运输方式', freightSettle: '运费结算',
    clause7: '包装标准', packFee: '包装费', clause8: '结算方式及期限',
    clause9: '违约责任', clause9v: '按"民法典"规定条款执行。',
    clause10: '争议解决', clause11: '其他约定事项或特殊订货要求',
    clause12: '合同有效期限', validUntil: '自签订日起至', validEnd: '止',
    clause13: '其他', defaultCopies: '本合同一式两份，双方各持一份。',
    buyerSeal: '需方（盖章）', sellerSeal: '供方（盖章）',
    legalRep: '法定代表人或委托代理人（签字）', date: '日期',
    quarter: (q) => `第${q}季度`, print: '打印合同', exportWord: '导出Word文档', exportPdf: '导出PDF文档',
    sellerName: '上海前进齿轮经营有限公司',
  },
  en: {
    title: 'Sales Contract', basicInfo: 'Contract Information', productDetails: 'Product Details', terms: 'Contract Terms',
    contractNo: 'Contract No.', signDate: 'Date', buyer: 'Buyer', deliveryDate: 'Delivery Date',
    deliveryPlace: 'Delivery Location', totalAmount: 'Total Amount',
    no: 'No.', productName: 'Product', spec: 'Model/Spec', unit: 'Unit', qty: 'Qty',
    unitPrice: 'Unit Price (CNY)', amount: 'Amount', deliveryPeriod: 'Delivery',
    subtotal: 'Total', totalChinese: 'Total Amount (in words)', totalLower: '¥ (in figures)',
    clause1: 'Quality Standard', clause2: 'Inspection Period', clause3: 'Delivery Date',
    clause4: 'Delivery Location', clause5: 'Delivery Method', clause6: 'Transport Method', freightSettle: 'Freight Settlement',
    clause7: 'Packaging Standard', packFee: 'Packaging Fee', clause8: 'Payment Terms',
    clause9: 'Breach of Contract', clause9v: 'Governed by the Civil Code of the People\'s Republic of China.',
    clause10: 'Dispute Resolution', clause11: 'Special Requirements',
    clause12: 'Contract Validity', validUntil: 'From signing date until ', validEnd: '',
    clause13: 'Others', defaultCopies: 'This contract is made in duplicate, one copy for each party.',
    buyerSeal: 'Buyer (Seal)', sellerSeal: 'Seller (Seal)',
    legalRep: 'Legal Representative / Authorized Agent (Signature)', date: 'Date',
    quarter: (q) => `Q${q}`, print: 'Print', exportWord: 'Export Word', exportPdf: 'Export PDF',
    sellerName: 'Shanghai Advance Gear Trading Co., Ltd.',
  },
};

const getLabels = (lang) => {
  if (lang === 'bilingual') return { zh: contractLabels.zh, en: contractLabels.en };
  return contractLabels[lang] || contractLabels.zh;
};

// 双语文本渲染
const BiText = ({ zh, en, lang }) => {
  if (lang === 'bilingual') return <>{zh}<br /><span className="text-muted" style={{ fontSize: '0.9em' }}>{en}</span></>;
  if (lang === 'en') return <>{en}</>;
  return <>{zh}</>;
};

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
  
  // 新增：加载、错误、成功状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // 处理导出进度回调
  const handleExportProgress = useCallback((state) => {
    setExportState(state);
  }, []);
  
  // 处理PDF导出
  const handleExportPDF = useCallback(async () => {
    // 先执行自定义处理函数
    if (typeof onExportPDF === 'function') {
      try {
        onExportPDF();
      } catch (error) {
        console.warn("执行自定义PDF导出函数失败，将使用备用方法:", error);
      }
    }
    
    // 显示导出状态
    setExportState({
      status: 'preparing',
      progress: 10,
      error: null
    });
    
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
    const filename = contract.buyerInfo?.name 
      ? `${contract.buyerInfo.name}-销售合同-${new Date().toISOString().slice(0, 10)}`
      : `销售合同-${new Date().toISOString().slice(0, 10)}`;
    
    // 使用简单方式导出
    try {
      // 尝试获取预览元素
      const previewElement = document.querySelector('.contract-preview-content');
      setExportState({
        status: 'generating',
        progress: 30
      });
      
      // 如果有预览元素，使用HTML转PDF方式
      if (previewElement) {
        setExportState({
          status: 'generating',
          progress: 50,
          message: "正在从HTML生成PDF..."
        });
        
        // 获取预览元素并直接导出为PDF
        const element = document.querySelector('.contract-view');
        if (element) {
          const options = {
            margin: 10,
            filename: `${filename}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
          };
          
          // 使用 html2pdf 或其他导出库
          // 这里使用简单的直接调用原始导出函数代替
          try {
            setExportState({
              status: 'exporting',
              progress: 80
            });
            
            // 调用简单导出函数
            import('../utils/contractGenerator').then(module => {
              module.exportContractToPDF(contract, filename)
                .then(success => {
                  if (success) {
                    setExportState({
                      status: 'completed',
                      progress: 100,
                      result: { filename: `${filename}.pdf` }
                    });
                  } else {
                    throw new Error("导出PDF失败");
                  }
                })
                .catch(err => {
                  console.error("导出PDF错误:", err);
                  setExportState({
                    status: 'error',
                    error: { message: "导出PDF失败: " + (err.message || "未知错误") }
                  });
                });
            }).catch(err => {
              console.error("导入导出模块失败:", err);
              setExportState({
                status: 'error',
                error: { message: "导入导出模块失败: " + (err.message || "未知错误") }
              });
            });
          } catch (exportError) {
            console.error("导出过程中出错:", exportError);
            setExportState({
              status: 'error',
              error: { message: "导出过程中出错: " + (exportError.message || "未知错误") }
            });
          }
        } else {
          throw new Error("找不到合同预览元素");
        }
      } else {
        // 尝试使用 contractExportHelper
        try {
          await contractExportHelper.exportToPDF(contract, filename, handleExportProgress);
        } catch (helperError) {
          console.error("使用Helper导出失败，尝试直接导出:", helperError);
          
          // 尝试直接导出
          import('../utils/contractGenerator').then(module => {
            module.exportContractToPDF(contract, filename)
              .then(success => {
                if (success) {
                  setExportState({
                    status: 'completed',
                    progress: 100,
                    result: { filename: `${filename}.pdf` }
                  });
                } else {
                  throw new Error("导出PDF失败");
                }
              })
              .catch(err => {
                setExportState({
                  status: 'error',
                  error: { message: "导出PDF失败: " + (err.message || "未知错误") }
                });
              });
          }).catch(err => {
            setExportState({
              status: 'error',
              error: { message: "导入导出模块失败: " + (err.message || "未知错误") }
            });
          });
        }
      }
    } catch (error) {
      console.error("PDF导出处理失败:", error);
      setExportState({
        status: 'error',
        error: { message: "PDF导出失败: " + (error.message || "未知错误") }
      });
    }
  }, [contract, onExportPDF, handleExportProgress]);
  
  // 处理Word导出
  const handleExportWord = useCallback(async () => {
    // 先执行自定义处理函数
    if (typeof onExportWord === 'function') {
      try {
        onExportWord();
      } catch (error) {
        console.warn("执行自定义Word导出函数失败:", error);
      }
    }
    
    // 显示导出状态
    setExportState({
      status: 'preparing',
      progress: 10,
      error: null
    });
    
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
    const filename = contract.buyerInfo?.name 
      ? `${contract.buyerInfo.name}-销售合同-${new Date().toISOString().slice(0, 10)}`
      : `销售合同-${new Date().toISOString().slice(0, 10)}`;
    
    // 导出合同
    try {
      setExportState({
        status: 'generating',
        progress: 50
      });
      
      // 尝试使用 contractExportHelper
      try {
        await contractExportHelper.exportToWord(contract, filename, handleExportProgress);
      } catch (helperError) {
        console.error("使用Helper导出Word失败，尝试直接导出:", helperError);
        
        // 尝试直接导出
        import('../utils/contractGenerator').then(module => {
          const success = module.exportContractToWord(contract, filename);
          
          if (success) {
            setExportState({
              status: 'completed',
              progress: 100,
              result: { filename: `${filename}.docx` }
            });
          } else {
            throw new Error("导出Word失败");
          }
        }).catch(err => {
          setExportState({
            status: 'error',
            error: { message: "导出Word失败: " + (err.message || "未知错误") }
          });
        });
      }
    } catch (error) {
      console.error("Word导出处理失败:", error);
      setExportState({
        status: 'error',
        error: { message: "导出Word失败: " + (error.message || "未知错误") }
      });
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
  
  // 新增：打印功能
  const handlePrint = () => {
    if (!contract) {
      setError('请先生成销售合同');
      return;
    }

    const previewElement = document.querySelector('.contract-preview-content');
    
    if (!previewElement) {
      setError('无法找到预览内容');
      return;
    }
    
    setLoading(true);
    
    try {
      printHtmlContent(previewElement, {
        title: `销售合同 - ${contract.contractNumber || '未命名'}`,
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
  
  const lang = contract.language || 'zh';
  const L = lang === 'bilingual' ? contractLabels.zh : (contractLabels[lang] || contractLabels.zh);
  const Le = contractLabels.en;
  const isBi = lang === 'bilingual';
  const isEn = lang === 'en';
  const t = (zhText, enText) => {
    if (isBi) return `${zhText} / ${enText}`;
    if (isEn) return enText;
    return zhText;
  };

  return (
    <div className="contract-view">
      {/* 顶部操作栏 */}
      <div className="contract-actions mb-3 d-flex justify-content-between align-items-center">
        <h3 style={{ color: colors?.headerText }}>
          <i className="bi bi-file-earmark-text me-2"></i>
          {t('销售合同', 'Sales Contract')}
          {(isEn || isBi) && <span className="badge bg-info ms-2" style={{ fontSize: '12px' }}>{isEn ? 'EN' : 'CN/EN'}</span>}
        </h3>
        
        <div>
          <Button 
            variant="outline-secondary" 
            size="sm" 
            className="me-2" 
            onClick={handlePrint}
            disabled={loading || (exportState.status !== 'idle' && exportState.status !== 'completed' && exportState.status !== 'error')}
          >
            <i className="bi bi-printer me-1"></i> 打印
          </Button>
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
      
      {/* 新增：错误和成功消息 */}
      {error && (
        <Alert variant="danger" className="mb-3" onClose={() => setError('')} dismissible>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-3" onClose={() => setSuccess('')} dismissible>
          <i className="bi bi-check-circle-fill me-2"></i>
          {success}
        </Alert>
      )}
      
      {/* 导出状态 */}
      {renderExportStatus()}
      
      {/* 合同内容预览 */}
      <div className="contract-preview-content">
        <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
          <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
            {t('合同基本信息', 'Contract Information')}
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>{t('合同编号', 'Contract No.')}：</strong> {contract.contractNumber}</p>
                <p><strong>{t('签订日期', 'Date')}：</strong> {contract.contractDate}</p>
                <p><strong>{t('买方单位', 'Buyer')}：</strong> {contract.buyerInfo?.name}</p>
              </Col>
              <Col md={6}>
                <p><strong>{t('交货日期', 'Delivery Date')}：</strong> {contract.deliveryDate}</p>
                <p><strong>{t('交货地点', 'Delivery Location')}：</strong> {contract.deliveryLocation}</p>
                <p><strong>{t('总金额', 'Total Amount')}：</strong> ¥{contract.totalAmount?.toLocaleString()}</p>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* 产品信息表 */}
        <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
          <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
            {t('产品明细', 'Product Details')}
          </Card.Header>
          <Card.Body style={{ padding: 0 }}>
            <Table responsive bordered hover style={{ margin: 0 }}>
              <thead style={{ backgroundColor: colors?.headerBg }}>
                <tr>
                  <th style={{ width: '5%' }}>{t('序号', 'No.')}</th>
                  <th style={{ width: '20%' }}>{t('产品名称', 'Product')}</th>
                  <th style={{ width: '20%' }}>{t('规格型号', 'Model/Spec')}</th>
                  <th style={{ width: '10%' }}>{t('单位', 'Unit')}</th>
                  <th style={{ width: '10%' }}>{t('数量', 'Qty')}</th>
                  <th style={{ width: '15%' }}>{t('单价(元)', 'Unit Price (CNY)')}</th>
                  <th style={{ width: '15%' }}>{t('金额', 'Amount')}</th>
                  <th style={{ width: '15%' }}>{t('交货期', 'Delivery')}</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(contract.products) && contract.products.map((product, index) => {
                  const pNames = { '船用齿轮箱': 'Marine Gearbox', '高弹性联轴器': 'Flexible Coupling', '备用泵': 'Standby Pump' };
                  const pName = isEn ? (pNames[product.name] || product.name) : isBi ? `${product.name} / ${pNames[product.name] || ''}` : product.name;
                  const pUnit = isEn ? (product.unit === '台' ? 'set' : product.unit === '只' ? 'pc' : product.unit) : product.unit;
                  return (
                    <tr key={`product-${index}`}>
                      <td style={{ textAlign: 'center' }}>{index + 1}</td>
                      <td>{pName || '-'}</td>
                      <td>{product.model || '-'}</td>
                      <td style={{ textAlign: 'center' }}>{pUnit || '-'}</td>
                      <td style={{ textAlign: 'center' }}>{product.quantity || '-'}</td>
                      <td style={{ textAlign: 'right' }}>{product.unitPrice ? product.unitPrice.toLocaleString() : '-'}</td>
                      <td style={{ textAlign: 'right' }}>{product.amount ? product.amount.toLocaleString() : '-'}</td>
                      <td>{product.deliveryQuarter ? (isEn ? `Q${product.deliveryQuarter}` : `第${product.deliveryQuarter}季度`) : '-'}</td>
                    </tr>
                  );
                })}

                {/* 合计行 */}
                <tr style={{ backgroundColor: colors?.headerBg, fontWeight: 'bold' }}>
                  <td colSpan={6} style={{ textAlign: 'right' }}>{t('合计', 'Total')}：</td>
                  <td style={{ textAlign: 'right' }}>{contract.totalAmount ? contract.totalAmount.toLocaleString() : '-'}</td>
                  <td></td>
                </tr>
              </tbody>
            </Table>
          </Card.Body>
        </Card>

        {/* 合计金额 */}
        <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
          <Card.Body>
            <p className="mb-0">
              <strong>{t('合计人民币（大写）', 'Total Amount (in words)')}：</strong> {contract.totalAmountInChinese || ''}
              <span className="ms-4"><strong>{t('¥（小写）', '¥ (in figures)')}：</strong> {contract.totalAmount ? contract.totalAmount.toLocaleString() : '0'}</span>
            </p>
          </Card.Body>
        </Card>

        {/* 合同条款 */}
        <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
          <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
            {t('合同条款', 'Contract Terms')}
          </Card.Header>
          <Card.Body>
            <p><strong>1. {t('执行质量标准', 'Quality Standard')}：</strong>{contract.executionStandard || t('按国家标准', 'Per national standards')}</p>
            <p><strong>2. {t('验收及质量异议期限', 'Inspection Period')}：</strong>{contract.inspectionPeriod || ''}</p>
            <p><strong>3. {t('交货时间', 'Delivery Date')}：</strong>{contract.deliveryDate || ''}</p>
            <p><strong>4. {t('交货地点', 'Delivery Location')}：</strong>{contract.deliveryLocation || ''}</p>
            <p><strong>5. {t('交货方式', 'Delivery Method')}：</strong>{contract.deliveryMethod || ''}</p>
            <p><strong>6. {t('运输方式', 'Transport Method')}：</strong>{contract.transportMethod || ''} <strong>{t('运费结算', 'Freight Settlement')}：</strong>{contract.transportFeeArrangement || ''}</p>
            <p><strong>7. {t('包装标准', 'Packaging Standard')}：</strong>{contract.packagingStandard || ''} <strong>{t('包装费', 'Packaging Fee')}：</strong>{contract.packagingFeeArrangement || ''}</p>
            <p><strong>8. {t('结算方式及期限', 'Payment Terms')}：</strong>{contract.paymentMethod || ''}</p>
            <p><strong>9. {t('违约责任', 'Breach of Contract')}：</strong>{t('按"民法典"规定条款执行。', 'Governed by the Civil Code of the People\'s Republic of China.')}</p>
            <p><strong>10. {t('争议解决', 'Dispute Resolution')}：</strong>{contract.disputeResolution || ''}</p>
            <p><strong>11. {t('其他约定事项或特殊订货要求', 'Special Requirements')}：</strong>{contract.specialRequirements || t('无', 'None')}</p>
            <p><strong>12. {t('合同有效期限', 'Contract Validity')}：</strong>{t('自签订日起至', 'From signing date until ')}{contract.expiryDate || ''}{t('止', '')}</p>
            <p><strong>13. {t('其他', 'Others')}：</strong>{contract.contractCopies || t('本合同一式两份，双方各持一份。', 'This contract is made in duplicate, one copy for each party.')}</p>
          </Card.Body>
        </Card>

        {/* 签名区域 */}
        <Card className="mb-4" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
          <Card.Body>
            <Row>
              <Col md={6}>
                <p><strong>{t('需方（盖章）', 'Buyer (Seal)')}：</strong></p>
                <div style={{ height: '80px' }}></div>
                <p><strong>{t('法定代表人或委托代理人（签字）', 'Legal Representative / Authorized Agent (Signature)')}：</strong></p>
                <div style={{ height: '40px' }}></div>
                <p><strong>{t('日期', 'Date')}：</strong></p>
              </Col>
              <Col md={6}>
                <p><strong>{t('供方（盖章）', 'Seller (Seal)')}：</strong></p>
                <div style={{ height: '80px' }}></div>
                <p><strong>{t('法定代表人或委托代理人（签字）', 'Legal Representative / Authorized Agent (Signature)')}：</strong></p>
                <div style={{ height: '40px' }}></div>
                <p><strong>{t('日期', 'Date')}：</strong></p>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>
      
      {/* 底部导出按钮 */}
      <div className="contract-actions d-flex justify-content-center mb-4">
        <Button 
          variant="outline-secondary" 
          onClick={handlePrint}
          className="me-2"
          disabled={loading || (exportState.status !== 'idle' && exportState.status !== 'completed' && exportState.status !== 'error')}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              正在准备打印...
            </>
          ) : (
            <>
              <i className="bi bi-printer me-2"></i>
              打印合同
            </>
          )}
        </Button>
        <Button 
          variant="primary" 
          onClick={handleExportWord}
          className="me-2"
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