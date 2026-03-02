// src/components/SalesContractGenerator.js
// 销售合同生成器 - 带编辑表单的完整合同生成工作流

import React, { useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Card, Form, Row, Col, Button, Alert, Badge, Spinner } from 'react-bootstrap';
import { generateContract } from '../utils/contractGenerator';
import { generateDocNumber } from '../utils/documentNumbering';
import { contractStore } from '../services/documentStorage';

const ContractView = lazy(() => import('./ContractView'));

const PAYMENT_PRESETS = [
  { label: '签收后30天内全款', value: '买方签收后30天内支付全部款项' },
  { label: '30%预付+70%发货前', value: '合同签订后30%预付款，发货前付清全款' },
  { label: '30%预付+70%验收后30天', value: '合同签订后30%预付款，货到验收合格后30天内付清余款' },
  { label: '50%预付+50%安装后', value: '合同签订后50%预付款，安装调试完毕后付清余款' },
  { label: '信用证(L/C)', value: '信用证（L/C）支付' },
  { label: '自定义', value: 'custom' },
];

const LazyFallback = () => (
  <div className="d-flex justify-content-center py-4">
    <Spinner animation="border" size="sm" />
  </div>
);

const SalesContractGenerator = ({
  selectionResult,
  quotation,
  projectInfo,
  selectedComponents,
  agreementSpecialRequirements,
  colors = {},
  theme,
  onContractGenerated,
  onExportContract,
  onNavigate,
}) => {
  const [mode, setMode] = useState('edit'); // 'edit' | 'preview'
  const [contract, setContract] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Default delivery date: 3 months from now
  const defaultDeliveryDate = useMemo(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 3);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }, []);

  const [formData, setFormData] = useState({
    // Buyer info
    buyerName: projectInfo?.customerName || '',
    buyerAddress: projectInfo?.customerAddress || '',
    buyerLegalRep: '',
    buyerBank: '',
    buyerAccount: '',
    // Payment
    paymentPreset: '合同签订后30%预付款，发货前付清全款',
    paymentCustom: '',
    // Delivery
    deliveryDate: defaultDeliveryDate,
    deliveryLocation: '甲方指定地点',
    deliveryMethod: '一次性交付',
    // Transport
    transportMethod: '乙方负责发运',
    transportFee: '运费由乙方承担',
    // Packaging
    packagingStandard: '符合长途运输的包装',
    packagingFee: '包装费包含在总价中',
    // Other
    specialRequirements: agreementSpecialRequirements || '',
    validityMonths: 12,
    disputeResolution: '争议解决方式：双方协商解决，协商不成，提交上海仲裁委员会仲裁。',
  });

  const handleChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const paymentMethod = useMemo(() => {
    if (formData.paymentPreset === 'custom') return formData.paymentCustom;
    return formData.paymentPreset;
  }, [formData.paymentPreset, formData.paymentCustom]);

  const canGenerate = useMemo(() => {
    return selectionResult && quotation && selectedComponents?.gearbox;
  }, [selectionResult, quotation, selectedComponents]);

  const handleGenerate = useCallback(() => {
    if (!canGenerate) {
      setError('缺少选型结果或报价数据，无法生成合同');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const contractData = generateContract(
        selectionResult,
        {
          ...projectInfo,
          customerName: formData.buyerName || projectInfo?.customerName,
          customerAddress: formData.buyerAddress || projectInfo?.customerAddress,
        },
        selectedComponents,
        {
          packagePrice: quotation?.summary?.packagePrice,
          marketPrice: quotation?.summary?.marketPrice,
          totalMarketPrice: quotation?.summary?.totalMarketPrice,
          quotationDetails: quotation,
          needsPump: quotation?.options?.needsPump,
          includePump: quotation?.options?.includePump,
          hasSpecialPackagePrice: quotation?.usingSpecialPackagePrice,
          specialPackageConfig: quotation?.specialPackageConfig,
          specialRequirements: formData.specialRequirements,
          paymentMethod,
        }
      );

      if (!contractData || !contractData.success) {
        setError(contractData?.message || '合同生成失败');
        setLoading(false);
        return;
      }

      // Override with form data
      contractData.buyerInfo = {
        ...contractData.buyerInfo,
        name: formData.buyerName || contractData.buyerInfo?.name,
        address: formData.buyerAddress || contractData.buyerInfo?.address,
        legalRepresentative: formData.buyerLegalRep,
        bank: formData.buyerBank,
        accountNumber: formData.buyerAccount,
      };
      contractData.paymentMethod = paymentMethod;
      contractData.deliveryLocation = formData.deliveryLocation;
      contractData.deliveryMethod = formData.deliveryMethod;
      contractData.transportMethod = formData.transportMethod;
      contractData.transportFeeArrangement = formData.transportFee;
      contractData.packagingStandard = formData.packagingStandard;
      contractData.packagingFeeArrangement = formData.packagingFee;
      contractData.specialRequirements = formData.specialRequirements || '无';
      contractData.disputeResolution = formData.disputeResolution;

      // Delivery date from form
      if (formData.deliveryDate) {
        const dd = new Date(formData.deliveryDate);
        contractData.deliveryDate = `${dd.getFullYear()}年${dd.getMonth() + 1}月${dd.getDate()}日前`;
      }

      // Generate document number
      try {
        contractData.docNumber = generateDocNumber('contract');
      } catch (e) {
        // Non-critical
      }

      // Save to document storage
      try {
        contractStore.save({
          id: contractData.docNumber || contractData.contractNumber,
          contractNumber: contractData.contractNumber,
          docNumber: contractData.docNumber,
          buyerName: contractData.buyerInfo?.name,
          totalAmount: contractData.totalAmount,
          model: selectedComponents?.gearbox?.model,
          data: contractData,
        });
      } catch (e) {
        // Non-critical
      }

      setContract(contractData);
      setMode('preview');

      if (onContractGenerated) {
        onContractGenerated(contractData);
      }
    } catch (err) {
      setError('生成合同失败: ' + (err.message || '未知错误'));
    } finally {
      setLoading(false);
    }
  }, [canGenerate, selectionResult, projectInfo, selectedComponents, quotation, formData, paymentMethod, onContractGenerated]);

  const handleBackToEdit = useCallback(() => {
    setMode('edit');
  }, []);

  // Preview mode
  if (mode === 'preview' && contract) {
    return (
      <div>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <Button variant="outline-secondary" size="sm" onClick={handleBackToEdit}>
              <i className="bi bi-arrow-left me-1"></i>返回编辑
            </Button>
            {contract.docNumber && (
              <Badge bg="info" className="ms-2">{contract.docNumber}</Badge>
            )}
          </div>
          <div>
            <Button variant="outline-primary" size="sm" className="me-2"
              onClick={() => onExportContract?.('word')}>
              <i className="bi bi-file-earmark-word me-1"></i>导出Word
            </Button>
            <Button variant="outline-danger" size="sm"
              onClick={() => onExportContract?.('pdf')}>
              <i className="bi bi-file-earmark-pdf me-1"></i>导出PDF
            </Button>
          </div>
        </div>
        <Suspense fallback={<LazyFallback />}>
          <ContractView
            contract={contract}
            onExportWord={() => onExportContract?.('word')}
            onExportPDF={() => onExportContract?.('pdf')}
            theme={theme}
            colors={colors}
          />
        </Suspense>
      </div>
    );
  }

  // Edit mode
  return (
    <div>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <i className="bi bi-exclamation-triangle me-2"></i>{error}
        </Alert>
      )}

      {!canGenerate && (
        <Alert variant="warning">
          <i className="bi bi-info-circle me-2"></i>
          生成销售合同需要：
          {!selectionResult && <Badge bg="secondary" className="ms-1">选型结果</Badge>}
          {!quotation && <Badge bg="secondary" className="ms-1">报价单</Badge>}
          {!selectedComponents?.gearbox && <Badge bg="secondary" className="ms-1">齿轮箱选型</Badge>}
          <div className="mt-2">
            <Button size="sm" variant="primary" onClick={() => onNavigate?.('input')}>
              <i className="bi bi-gear me-1"></i>去选型
            </Button>
          </div>
        </Alert>
      )}

      {/* Buyer Info */}
      <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <i className="bi bi-person me-2"></i>买方信息
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>单位名称</Form.Label>
                <Form.Control size="sm" value={formData.buyerName}
                  onChange={e => handleChange('buyerName', e.target.value)}
                  placeholder="买方公司名称" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>法定代表人</Form.Label>
                <Form.Control size="sm" value={formData.buyerLegalRep}
                  onChange={e => handleChange('buyerLegalRep', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label>通讯地址</Form.Label>
                <Form.Control size="sm" value={formData.buyerAddress}
                  onChange={e => handleChange('buyerAddress', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>开户银行</Form.Label>
                <Form.Control size="sm" value={formData.buyerBank}
                  onChange={e => handleChange('buyerBank', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>银行账号</Form.Label>
                <Form.Control size="sm" value={formData.buyerAccount}
                  onChange={e => handleChange('buyerAccount', e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Payment & Delivery */}
      <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <i className="bi bi-cash-stack me-2"></i>付款与交货条款
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>付款方式</Form.Label>
                <Form.Select size="sm" value={formData.paymentPreset}
                  onChange={e => handleChange('paymentPreset', e.target.value)}>
                  {PAYMENT_PRESETS.map(p => (
                    <option key={p.value} value={p.value}>{p.label}</option>
                  ))}
                </Form.Select>
              </Form.Group>
              {formData.paymentPreset === 'custom' && (
                <Form.Group className="mb-2">
                  <Form.Control size="sm" as="textarea" rows={2}
                    value={formData.paymentCustom}
                    onChange={e => handleChange('paymentCustom', e.target.value)}
                    placeholder="输入自定义付款方式" />
                </Form.Group>
              )}
            </Col>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>交货日期</Form.Label>
                <Form.Control size="sm" type="date" value={formData.deliveryDate}
                  onChange={e => handleChange('deliveryDate', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>交货地点</Form.Label>
                <Form.Control size="sm" value={formData.deliveryLocation}
                  onChange={e => handleChange('deliveryLocation', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>交货方式</Form.Label>
                <Form.Control size="sm" value={formData.deliveryMethod}
                  onChange={e => handleChange('deliveryMethod', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>运输方式</Form.Label>
                <Form.Control size="sm" value={formData.transportMethod}
                  onChange={e => handleChange('transportMethod', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>运费结算</Form.Label>
                <Form.Control size="sm" value={formData.transportFee}
                  onChange={e => handleChange('transportFee', e.target.value)} />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Packaging & Other */}
      <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <i className="bi bi-box-seam me-2"></i>包装与其他条款
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>包装标准</Form.Label>
                <Form.Control size="sm" value={formData.packagingStandard}
                  onChange={e => handleChange('packagingStandard', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2">
                <Form.Label>包装费</Form.Label>
                <Form.Control size="sm" value={formData.packagingFee}
                  onChange={e => handleChange('packagingFee', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label>争议解决</Form.Label>
                <Form.Control size="sm" as="textarea" rows={2}
                  value={formData.disputeResolution}
                  onChange={e => handleChange('disputeResolution', e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group className="mb-2">
                <Form.Label>特殊订货要求</Form.Label>
                <Form.Control size="sm" as="textarea" rows={3}
                  value={formData.specialRequirements}
                  onChange={e => handleChange('specialRequirements', e.target.value)}
                  placeholder="如无特殊要求可留空" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2">
                <Form.Label>合同有效期(月)</Form.Label>
                <Form.Control size="sm" type="number" min={1} max={60}
                  value={formData.validityMonths}
                  onChange={e => handleChange('validityMonths', parseInt(e.target.value) || 12)} />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Product Summary (read-only from quotation) */}
      {quotation && (
        <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
            <i className="bi bi-list-check me-2"></i>产品明细 (来自报价单)
          </Card.Header>
          <Card.Body>
            <div style={{ fontSize: '0.9rem', color: colors.muted }}>
              {selectedComponents?.gearbox && (
                <div><strong>齿轮箱:</strong> {selectedComponents.gearbox.model}</div>
              )}
              {selectedComponents?.coupling && (
                <div><strong>联轴器:</strong> {selectedComponents.coupling.model}</div>
              )}
              {selectedComponents?.pump && (
                <div><strong>备用泵:</strong> {selectedComponents.pump.model}</div>
              )}
              {quotation.summary && (
                <div className="mt-1">
                  <strong>总金额:</strong> ¥{(quotation.summary.totalMarketPrice || quotation.summary.marketPrice || 0).toLocaleString()}
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Generate Button */}
      <div className="d-flex justify-content-center">
        <Button
          variant="primary"
          size="lg"
          onClick={handleGenerate}
          disabled={!canGenerate || loading}
        >
          {loading ? (
            <><Spinner as="span" animation="border" size="sm" className="me-2" />正在生成...</>
          ) : (
            <><i className="bi bi-file-earmark-ruled me-2"></i>生成销售合同</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default SalesContractGenerator;
