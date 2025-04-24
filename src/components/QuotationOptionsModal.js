import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

const QuotationOptionsModal = ({ show, onHide, onApply, selectedComponents, colors, theme }) => {
  const [options, setOptions] = useState({
    includeVAT: true,
    includeShipping: true,
    includeTechnicalData: true,
    validDays: 30,
    paymentTerms: '预付30%，发货前付款70%',
    deliveryTime: '合同签订后45天',
    customNote: '',
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOptions(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleApply = () => {
    onApply(options);
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide} 
      backdrop="static" 
      centered
      size="lg"
    >
      <Modal.Header closeButton style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
        <Modal.Title>报价单选项</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: colors?.bg, color: colors?.text }}>
        <Alert variant="info" className="mb-3">
          <i className="bi bi-info-circle me-2"></i>
          设置报价单的附加选项和条款
        </Alert>
        
        <Form>
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox"
                  id="includeVAT"
                  name="includeVAT"
                  label="包含增值税 (13%)"
                  checked={options.includeVAT}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox"
                  id="includeShipping"
                  name="includeShipping"
                  label="包含运输费用"
                  checked={options.includeShipping}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Check 
                  type="checkbox"
                  id="includeTechnicalData"
                  name="includeTechnicalData"
                  label="包含技术参数详情"
                  checked={options.includeTechnicalData}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>报价有效期（天）</Form.Label>
                <Form.Control
                  type="number"
                  name="validDays"
                  value={options.validDays}
                  onChange={handleChange}
                  min={1}
                  max={180}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3">
            <Form.Label>付款条件</Form.Label>
            <Form.Control
              type="text"
              name="paymentTerms"
              value={options.paymentTerms}
              onChange={handleChange}
              placeholder="例如：预付30%，发货前付款70%"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>交货时间</Form.Label>
            <Form.Control
              type="text"
              name="deliveryTime"
              value={options.deliveryTime}
              onChange={handleChange}
              placeholder="例如：合同签订后45天"
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>自定义备注</Form.Label>
            <Form.Control
              as="textarea"
              name="customNote"
              value={options.customNote}
              onChange={handleChange}
              rows={3}
              placeholder="添加到报价单底部的备注信息（可选）"
            />
          </Form.Group>
        </Form>
        
        <div className="mt-3">
          <h6>选中的组件：</h6>
          <ul className="ps-3">
            {selectedComponents.gearbox && (
              <li>齿轮箱：{selectedComponents.gearbox.model} - {selectedComponents.gearbox.marketPrice?.toLocaleString('zh-CN')}元</li>
            )}
            {selectedComponents.coupling && (
              <li>联轴器：{selectedComponents.coupling.model} - {selectedComponents.coupling.marketPrice?.toLocaleString('zh-CN')}元</li>
            )}
            {selectedComponents.pump && (
              <li>备用泵：{selectedComponents.pump.model} - {selectedComponents.pump.marketPrice?.toLocaleString('zh-CN')}元</li>
            )}
          </ul>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: colors?.bg, borderTopColor: colors?.border }}>
        <Button variant="secondary" onClick={onHide}>
          取消
        </Button>
        <Button variant="primary" onClick={handleApply}>
          生成报价单
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QuotationOptionsModal; 