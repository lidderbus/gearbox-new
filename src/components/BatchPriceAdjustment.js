// components/BatchPriceAdjustment.js
import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup } from 'react-bootstrap';

/**
 * Modal component for batch adjusting prices across multiple components
 * @param {Object} props - Component props
 * @param {boolean} props.show - Whether the modal is visible
 * @param {Function} props.onHide - Function to handle hiding the modal
 * @param {Function} props.onApply - Function to apply the price adjustments
 * @param {string} props.theme - Current theme ('light' or 'dark')
 * @returns {JSX.Element} Batch price adjustment modal
 */
const BatchPriceAdjustment = ({ 
  show, 
  onHide, 
  onApply,
  theme = 'light' 
}) => {
  // State for the adjustment form
  const [category, setCategory] = useState('allGearboxes');
  const [field, setField] = useState('basePrice');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState('');
  const [error, setError] = useState('');

  // Reset form when modal is opened
  React.useEffect(() => {
    if (show) {
      setCategory('allGearboxes');
      setField('basePrice');
      setType('percent');
      setValue('');
      setError('');
    }
  }, [show]);

  // Handle input change for adjustment value
  const handleValueChange = (e) => {
    const newValue = e.target.value;
    
    // Allow empty string or valid numbers
    if (newValue === '' || (!isNaN(newValue) && parseFloat(newValue) !== 0)) {
      setValue(newValue);
      setError('');
    } else {
      setError('请输入有效的数值，不能为0');
    }
  };

  // Handle submission
  const handleSubmit = () => {
    if (!value) {
      setError('请输入调整值');
      return;
    }

    const numValue = parseFloat(value);
    
    // Validate value based on type
    if (type === 'percent') {
      if (numValue <= -100) {
        setError('百分比不能小于或等于-100%');
        return;
      }
    }

    // Apply adjustment and close modal
    onApply({
      category,
      field,
      type,
      value: numValue
    });
  };

  return (
    <Modal 
      show={show} 
      onHide={onHide}
      centered
      backdrop="static"
      style={{ color: theme === 'light' ? '#212529' : '#e2e8f0' }}
    >
      <Modal.Header 
        closeButton
        style={{ 
          backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
          borderBottom: theme === 'light' ? '1px solid #dee2e6' : '1px solid #4a5568'
        }}
      >
        <Modal.Title>批量价格调整</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ 
        backgroundColor: theme === 'light' ? '#ffffff' : '#1a202c',
        padding: '1.5rem'
      }}>
        <Form>
          {/* Category selection */}
          <Form.Group className="mb-3">
            <Form.Label>调整范围</Form.Label>
            <Form.Select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              style={{ 
                backgroundColor: theme === 'light' ? '#ffffff' : '#2d3748',
                color: theme === 'light' ? '#212529' : '#e2e8f0',
                borderColor: theme === 'light' ? '#ced4da' : '#4a5568'
              }}
            >
              <option value="allGearboxes">所有齿轮箱</option>
              <option value="hcGearboxes">HC系列齿轮箱</option>
              <option value="gwGearboxes">GW系列齿轮箱</option>
              <option value="hcmGearboxes">HCM系列齿轮箱</option>
              <option value="dtGearboxes">DT系列齿轮箱</option>
              <option value="hcqGearboxes">HCQ系列齿轮箱</option>
              <option value="gcGearboxes">GC系列齿轮箱</option>
              <option value="flexibleCouplings">高弹性联轴器</option>
              <option value="standbyPumps">备用泵</option>
              <option value="all">所有组件</option>
            </Form.Select>
          </Form.Group>

          {/* Field selection */}
          <Form.Group className="mb-3">
            <Form.Label>调整字段</Form.Label>
            <Form.Select 
              value={field} 
              onChange={(e) => setField(e.target.value)}
              style={{ 
                backgroundColor: theme === 'light' ? '#ffffff' : '#2d3748',
                color: theme === 'light' ? '#212529' : '#e2e8f0',
                borderColor: theme === 'light' ? '#ced4da' : '#4a5568'
              }}
            >
              <option value="basePrice">基本价格</option>
              <option value="price">打包价格</option>
              <option value="marketPrice">市场价格</option>
            </Form.Select>
          </Form.Group>

          {/* Adjustment type */}
          <Form.Group className="mb-3">
            <Form.Label>调整方式</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="百分比"
                name="adjustmentType"
                id="percent"
                checked={type === 'percent'}
                onChange={() => setType('percent')}
              />
              <Form.Check
                inline
                type="radio"
                label="固定金额"
                name="adjustmentType"
                id="amount"
                checked={type === 'amount'}
                onChange={() => setType('amount')}
              />
            </div>
          </Form.Group>

          {/* Adjustment value */}
          <Form.Group className="mb-3">
            <Form.Label>调整值</Form.Label>
            <InputGroup>
              <Form.Control
                type="number"
                placeholder={type === 'percent' ? "如: 10 表示增加10%" : "如: 1000 表示增加1000元"}
                value={value}
                onChange={handleValueChange}
                isInvalid={!!error}
                style={{ 
                  backgroundColor: theme === 'light' ? '#ffffff' : '#2d3748',
                  color: theme === 'light' ? '#212529' : '#e2e8f0',
                  borderColor: theme === 'light' ? '#ced4da' : '#4a5568'
                }}
              />
              <InputGroup.Text style={{ 
                backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
                color: theme === 'light' ? '#212529' : '#e2e8f0',
                borderColor: theme === 'light' ? '#ced4da' : '#4a5568'
              }}>
                {type === 'percent' ? '%' : '元'}
              </InputGroup.Text>
              <Form.Control.Feedback type="invalid">
                {error}
              </Form.Control.Feedback>
            </InputGroup>
            <div className="text-muted mt-2" style={{ fontSize: '0.85rem' }}>
              {type === 'percent' 
                ? '正值表示涨价，负值表示降价，例如: 10 表示价格上涨10%' 
                : '正值表示增加，负值表示减少，例如: 1000 表示增加1000元'}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ 
        backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
        borderTop: theme === 'light' ? '1px solid #dee2e6' : '1px solid #4a5568'
      }}>
        <Button 
          variant="secondary" 
          onClick={onHide}
          style={{
            backgroundColor: theme === 'light' ? '#6c757d' : '#4a5568',
            borderColor: theme === 'light' ? '#6c757d' : '#4a5568',
          }}
        >
          取消
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={!value || !!error}
          style={{
            backgroundColor: theme === 'light' ? '#2e7d32' : '#38b2ac',
            borderColor: theme === 'light' ? '#2e7d32' : '#38b2ac',
          }}
        >
          应用调整
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BatchPriceAdjustment;