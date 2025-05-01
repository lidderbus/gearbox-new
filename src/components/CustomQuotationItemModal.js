import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';

/**
 * 自定义报价项目对话框
 * 用于添加自定义项目到报价单中
 */
const CustomQuotationItemModal = ({
  show,
  onHide,
  onAdd,
  existingItems = [],
  colors,
  theme
}) => {
  // 状态
  const [itemData, setItemData] = useState({
    name: '',
    model: '',
    description: '',
    quantity: 1,
    unit: '台',
    unitPrice: 0,
    remarks: ''
  });
  
  const [error, setError] = useState('');
  const [formTouched, setFormTouched] = useState(false);
  
  // 重置表单
  useEffect(() => {
    if (show) {
      setItemData({
        name: '',
        model: '',
        description: '',
        quantity: 1,
        unit: '台',
        unitPrice: 0,
        remarks: ''
      });
      setError('');
      setFormTouched(false);
    }
  }, [show]);
  
  // 处理输入变化
  const handleChange = (field, value) => {
    // 数值字段处理
    if (field === 'quantity' || field === 'unitPrice') {
      const numValue = value === '' ? '' : parseFloat(value);
      value = numValue === '' || isNaN(numValue) ? 0 : numValue;
    }
    
    setItemData(prevData => ({
      ...prevData,
      [field]: value
    }));
    
    // 标记表单已修改
    if (!formTouched) {
      setFormTouched(true);
    }
    
    // 清除错误消息
    if (error) {
      setError('');
    }
  };
  
  // 验证表单
  const validateForm = () => {
    if (!itemData.name.trim()) {
      setError('请输入项目名称');
      return false;
    }
    
    if (itemData.quantity <= 0) {
      setError('数量必须大于0');
      return false;
    }
    
    if (itemData.unitPrice < 0) {
      setError('单价不能为负数');
      return false;
    }
    
    // 检查是否与现有项目重复
    const duplicate = existingItems.find(
      item => item.name === itemData.name && item.model === itemData.model
    );
    
    if (duplicate) {
      setError('该项目已存在于报价单中，请修改名称或型号');
      return false;
    }
    
    return true;
  };
  
  // 处理添加
  const handleAdd = () => {
    if (!validateForm()) return;
    
    // 计算金额
    const amount = itemData.quantity * itemData.unitPrice;
    
    // 准备完整的项目数据
    const customItem = {
      ...itemData,
      id: `custom-${Date.now()}`,
      amount,
      isCustomItem: true,
      selectedPrice: 'market', // 默认使用市场价
      prices: {
        market: itemData.unitPrice,
        factory: itemData.unitPrice,
        package: itemData.unitPrice
      }
    };
    
    // 调用添加函数
    onAdd(customItem);
    
    // 关闭对话框
    onHide();
  };
  
  // 快速添加模板项目
  const templateItems = [
    { name: '技术服务费', unit: '项', unitPrice: 5000 },
    { name: '运输费', unit: '项', unitPrice: 3000 },
    { name: '现场调试', unit: '天', unitPrice: 2000 },
    { name: '备品备件包', unit: '套', unitPrice: 1500 }
  ];
  
  const applyTemplate = (template) => {
    setItemData(prevData => ({
      ...prevData,
      name: template.name,
      unit: template.unit,
      unitPrice: template.unitPrice
    }));
    
    setFormTouched(true);
  };
  
  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      size="lg"
      backdrop="static"
      style={{ color: colors?.text }}
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>添加自定义项目</Modal.Title>
      </Modal.Header>
      
      <Modal.Body style={{ backgroundColor: colors?.card }}>
        {error && (
          <Alert variant="danger" onClose={() => setError('')} dismissible>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        <Form>
          <Row>
            <Col md={8}>
              <Form.Group className="mb-3" controlId="itemName">
                <Form.Label>项目名称 <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={itemData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
            
            <Col md={4}>
              <Form.Group className="mb-3" controlId="itemModel">
                <Form.Label>型号</Form.Label>
                <Form.Control
                  type="text"
                  value={itemData.model}
                  onChange={(e) => handleChange('model', e.target.value)}
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3" controlId="itemDescription">
            <Form.Label>描述</Form.Label>
            <Form.Control
              type="text"
              value={itemData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              style={{
                backgroundColor: colors?.inputBg,
                color: colors?.text,
                borderColor: colors?.inputBorder
              }}
            />
          </Form.Group>
          
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3" controlId="itemQuantity">
                <Form.Label>数量 <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  value={itemData.quantity}
                  onChange={(e) => handleChange('quantity', e.target.value)}
                  min="1"
                  step="1"
                  required
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
            
            <Col md={3}>
              <Form.Group className="mb-3" controlId="itemUnit">
                <Form.Label>单位 <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  value={itemData.unit}
                  onChange={(e) => handleChange('unit', e.target.value)}
                  required
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
            
            <Col md={5}>
              <Form.Group className="mb-3" controlId="itemUnitPrice">
                <Form.Label>单价 (元) <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  value={itemData.unitPrice}
                  onChange={(e) => handleChange('unitPrice', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                  style={{
                    backgroundColor: colors?.inputBg,
                    color: colors?.text,
                    borderColor: colors?.inputBorder
                  }}
                />
              </Form.Group>
            </Col>
          </Row>
          
          <Form.Group className="mb-3" controlId="itemRemarks">
            <Form.Label>备注</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={itemData.remarks}
              onChange={(e) => handleChange('remarks', e.target.value)}
              style={{
                backgroundColor: colors?.inputBg,
                color: colors?.text,
                borderColor: colors?.inputBorder
              }}
            />
          </Form.Group>
        </Form>
        
        <div className="mt-4">
          <h6 style={{ color: colors?.headerText }}>快速添加模板</h6>
          <div className="d-flex flex-wrap gap-2 mt-2">
            {templateItems.map((template, index) => (
              <Button
                key={index}
                variant="outline-secondary"
                size="sm"
                onClick={() => applyTemplate(template)}
                style={{
                  borderColor: colors?.border,
                  color: colors?.text
                }}
              >
                {template.name} ({template.unitPrice}元/{template.unit})
              </Button>
            ))}
          </div>
          <div className="text-muted mt-2" style={{ fontSize: '0.9em' }}>
            <i className="bi bi-info-circle-fill me-1"></i>
            点击模板快速填充项目数据，您仍可以修改详细信息
          </div>
        </div>
      </Modal.Body>
      
      <Modal.Footer style={{ backgroundColor: colors?.card }}>
        <Button variant="secondary" onClick={onHide}>
          取消
        </Button>
        <Button
          variant="primary"
          onClick={handleAdd}
          disabled={!formTouched}
        >
          添加项目
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CustomQuotationItemModal;