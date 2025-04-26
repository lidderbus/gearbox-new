// src/components/CustomQuotationItemModal.js
import React, { useState } from 'react';
import { Modal, Button, Form, Row, Col, Alert } from 'react-bootstrap';

/**
 * 自定义报价项目对话框组件
 * 允许用户添加自定义项目到报价单
 */
const CustomQuotationItemModal = ({ 
  show, 
  onHide, 
  onAdd, 
  existingItems = [], 
  colors,
  theme
}) => {
  const [newItem, setNewItem] = useState({
    name: '',
    model: '',
    quantity: 1,
    unit: '个',
    unitPrice: 0,
    remarks: ''
  });
  
  // 验证状态
  const [validated, setValidated] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // 重置输入
  const resetInput = () => {
    setNewItem({
      name: '',
      model: '',
      quantity: 1,
      unit: '个',
      unitPrice: 0,
      remarks: ''
    });
    setValidated(false);
    setErrorMessage('');
  };
  
  // 处理变更
  const handleChange = (field, value) => {
    setNewItem(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // 处理提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 验证必填字段
    if (!newItem.name || !newItem.model) {
      setValidated(true);
      setErrorMessage('请至少填写产品名称和型号');
      return;
    }
    
    // 验证数字字段
    if (isNaN(newItem.quantity) || newItem.quantity <= 0) {
      setValidated(true);
      setErrorMessage('数量必须为大于0的数字');
      return;
    }
    
    if (isNaN(newItem.unitPrice) || newItem.unitPrice < 0) {
      setValidated(true);
      setErrorMessage('单价必须为非负数字');
      return;
    }
    
    // 提交数据
    onAdd && onAdd(newItem);
    resetInput();
    onHide();
  };
  
  return (
    <Modal 
      show={show} 
      onHide={() => {
        resetInput();
        onHide();
      }}
      centered
      backdrop="static"
      size="lg"
    >
      <Modal.Header 
        closeButton
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>添加自定义报价项目</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: colors?.card, color: colors?.text }}>
        {errorMessage && (
          <Alert variant="danger" onClose={() => setErrorMessage('')} dismissible>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {errorMessage}
          </Alert>
        )}
        
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>产品名称 <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text"
                  value={newItem.name}
                  onChange={e => handleChange('name', e.target.value)}
                  placeholder="例如: 减震器"
                  required
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  请输入产品名称
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>型号 <span className="text-danger">*</span></Form.Label>
                <Form.Control 
                  type="text"
                  value={newItem.model}
                  onChange={e => handleChange('model', e.target.value)}
                  placeholder="例如: ZD-100"
                  required
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  请输入型号
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>数量</Form.Label>
                <Form.Control 
                  type="number"
                  value={newItem.quantity}
                  onChange={e => handleChange('quantity', parseInt(e.target.value) || 1)}
                  min="1"
                  required
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  请输入有效的数量
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-3">
                <Form.Label>单位</Form.Label>
                <Form.Control 
                  type="text"
                  value={newItem.unit}
                  onChange={e => handleChange('unit', e.target.value)}
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>单价 (元)</Form.Label>
                <Form.Control 
                  type="number"
                  value={newItem.unitPrice}
                  onChange={e => handleChange('unitPrice', parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
                <Form.Control.Feedback type="invalid">
                  单价不能为负数
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
            <Form.Label>备注</Form.Label>
            <Form.Control 
              type="text"
              value={newItem.remarks}
              onChange={e => handleChange('remarks', e.target.value)}
              placeholder="可选"
              style={{
                backgroundColor: colors?.inputBg,
                color: colors?.text,
                borderColor: colors?.inputBorder
              }}
            />
          </Form.Group>
        </Form>
        
        {existingItems.length > 0 && (
          <Alert variant="info" className="mt-3">
            <i className="bi bi-info-circle me-2"></i>
            当前报价单已包含 {existingItems.length} 个项目
          </Alert>
        )}
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: colors?.card }}>
        <Button 
          variant="secondary" 
          onClick={() => {
            resetInput();
            onHide();
          }}
          style={{
            backgroundColor: theme === 'light' ? '#6c757d' : '#4a5568',
            borderColor: theme === 'light' ? '#6c757d' : '#4a5568'
          }}
        >
          取消
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          style={{
            backgroundColor: colors?.primary,
            borderColor: colors?.primary,
            color: colors?.primaryText
          }}
        >
          <i className="bi bi-plus-circle me-1"></i> 添加项目
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomQuotationItemModal;