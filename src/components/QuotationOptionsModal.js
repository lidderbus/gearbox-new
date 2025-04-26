// src/components/QuotationOptionsModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

/**
 * 报价单选项对话框组件
 * 允许用户配置报价单生成选项
 */
const QuotationOptionsModal = ({ 
  show, 
  onHide, 
  onApply, 
  selectedComponents,
  colors,
  theme
}) => {
  // 选项状态
  const [options, setOptions] = useState({
    showCouplingPrice: true,
    showPumpPrice: true,
    taxRate: 0,
    includeDelivery: false,
    deliveryCost: 0,
    includeInstallation: false,
    installationCost: 0,
    discountPercentage: 0,
    validityDays: 30,
    paymentTerms: '合同签订后支付30%预付款，发货前付清全款',
    deliveryTime: '合同签订生效后3个月内发货',
    currency: 'CNY',
    language: 'zh-CN',
    format: 'standard'
  });

  // 确定齿轮箱系列
  const isGWSeries = selectedComponents?.gearbox?.model?.toUpperCase()?.includes('GW') || false;

  // 重置选项为默认值
  const resetToDefaults = () => {
    setOptions({
      // 根据齿轮箱系列设置不同默认值
      showCouplingPrice: isGWSeries,
      showPumpPrice: isGWSeries,
      taxRate: 0,
      includeDelivery: false,
      deliveryCost: 0,
      includeInstallation: false,
      installationCost: 0,
      discountPercentage: 0,
      validityDays: 30,
      paymentTerms: '合同签订后支付30%预付款，发货前付清全款',
      deliveryTime: '合同签订生效后3个月内发货',
      currency: 'CNY',
      language: 'zh-CN',
      format: 'standard'
    });
  };

  // 初始化默认选项
  React.useEffect(() => {
    if (show) {
      resetToDefaults();
    }
  }, [show, isGWSeries]);

  // 处理选项变更
  const handleOptionChange = (name, value) => {
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 应用选项并关闭对话框
  const handleApply = () => {
    onApply(options);
    onHide();
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      backdrop="static"
      size="lg"
    >
      <Modal.Header 
        closeButton
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>报价单生成选项</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: colors?.card, color: colors?.text }}>
        <Alert variant="info" className="mb-3">
          <i className="bi bi-info-circle me-2"></i>
          通过调整以下选项自定义报价单内容和格式
        </Alert>

        <h6 className="mb-3 border-bottom pb-2" style={{ color: colors?.headerText }}>价格显示选项</h6>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="showCouplingPrice"
                label="联轴器单独显示价格"
                checked={options.showCouplingPrice}
                onChange={(e) => handleOptionChange('showCouplingPrice', e.target.checked)}
              />
              <Form.Text style={{ color: colors?.muted }}>
                {isGWSeries 
                  ? 'GW系列齿轮箱默认单独显示联轴器价格' 
                  : '非GW系列齿轮箱默认包含联轴器价格'}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="showPumpPrice"
                label="备用泵单独显示价格"
                checked={options.showPumpPrice}
                onChange={(e) => handleOptionChange('showPumpPrice', e.target.checked)}
              />
              <Form.Text style={{ color: colors?.muted }}>
                {isGWSeries 
                  ? 'GW系列齿轮箱默认单独显示备用泵价格' 
                  : '非GW系列齿轮箱默认包含备用泵价格'}
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <h6 className="mb-3 border-bottom pb-2" style={{ color: colors?.headerText }}>税率和折扣</h6>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>增值税率 (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="1"
                value={options.taxRate}
                onChange={(e) => handleOptionChange('taxRate', parseFloat(e.target.value) || 0)}
                style={{
                  backgroundColor: colors?.inputBg,
                  color: colors?.text,
                  borderColor: colors?.inputBorder
                }}
              />
              <Form.Text style={{ color: colors?.muted }}>
                设置为0表示不含税价格，设置为13表示含13%增值税
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>折扣百分比 (%)</Form.Label>
              <Form.Control
                type="number"
                min="0"
                max="100"
                step="0.5"
                value={options.discountPercentage}
                onChange={(e) => handleOptionChange('discountPercentage', parseFloat(e.target.value) || 0)}
                style={{
                  backgroundColor: colors?.inputBg,
                  color: colors?.text,
                  borderColor: colors?.inputBorder
                }}
              />
              <Form.Text style={{ color: colors?.muted }}>
                应用于总价的折扣比例
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>报价有效期 (天)</Form.Label>
              <Form.Control
                type="number"
                min="1"
                max="365"
                step="1"
                value={options.validityDays}
                onChange={(e) => handleOptionChange('validityDays', parseInt(e.target.value) || 30)}
                style={{
                  backgroundColor: colors?.inputBg,
                  color: colors?.text,
                  borderColor: colors?.inputBorder
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <h6 className="mb-3 border-bottom pb-2" style={{ color: colors?.headerText }}>额外服务</h6>
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="includeDelivery"
                label="包含运输服务"
                checked={options.includeDelivery}
                onChange={(e) => handleOptionChange('includeDelivery', e.target.checked)}
              />
              {options.includeDelivery && (
                <Form.Control
                  type="number"
                  placeholder="运输费用 (元)"
                  min="0"
                  value={options.deliveryCost}
                  onChange={(e) => handleOptionChange('deliveryCost', parseFloat(e.target.value) || 0)}
                  className="mt-2"
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              )}
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Check
                type="switch"
                id="includeInstallation"
                label="包含安装调试服务"
                checked={options.includeInstallation}
                onChange={(e) => handleOptionChange('includeInstallation', e.target.checked)}
              />
              {options.includeInstallation && (
                <Form.Control
                  type="number"
                  placeholder="安装费用 (元)"
                  min="0"
                  value={options.installationCost}
                  onChange={(e) => handleOptionChange('installationCost', parseFloat(e.target.value) || 0)}
                  className="mt-2"
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              )}
            </Form.Group>
          </Col>
        </Row>

        <h6 className="mb-3 border-bottom pb-2" style={{ color: colors?.headerText }}>合同条款</h6>
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>付款条件</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={options.paymentTerms}
                onChange={(e) => handleOptionChange('paymentTerms', e.target.value)}
                style={{
                  backgroundColor: colors?.inputBg,
                  color: colors?.text,
                  borderColor: colors?.inputBorder
                }}
              />
            </Form.Group>
          </Col>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>交货时间</Form.Label>
              <Form.Control
                type="text"
                value={options.deliveryTime}
                onChange={(e) => handleOptionChange('deliveryTime', e.target.value)}
                style={{
                  backgroundColor: colors?.inputBg,
                  color: colors?.text,
                  borderColor: colors?.inputBorder
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <h6 className="mb-3 border-bottom pb-2" style={{ color: colors?.headerText }}>格式设置</h6>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>报价单格式</Form.Label>
              <Form.Select
                value={options.format}
                onChange={(e) => handleOptionChange('format', e.target.value)}
                style={{
                  backgroundColor: colors?.inputBg,
                  color: colors?.text,
                  borderColor: colors?.inputBorder
                }}
              >
                <option value="standard">标准报价单</option>
                <option value="detailed">详细报价单</option>
                <option value="simplified">简化报价单</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>语言</Form.Label>
              <Form.Select
                value={options.language}
                onChange={(e) => handleOptionChange('language', e.target.value)}
                style={{
                  backgroundColor: colors?.inputBg,
                  color: colors?.text,
                  borderColor: colors?.inputBorder
                }}
              >
                <option value="zh-CN">中文</option>
                <option value="en-US">英文</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: colors?.card }}>
        <Button 
          variant="outline-secondary" 
          onClick={resetToDefaults}
        >
          重置默认值
        </Button>
        <Button 
          variant="secondary" 
          onClick={onHide}
        >
          取消
        </Button>
        <Button 
          variant="primary" 
          onClick={handleApply}
          style={{
            backgroundColor: colors?.primary,
            borderColor: colors?.primary
          }}
        >
          应用设置并生成报价单
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuotationOptionsModal;