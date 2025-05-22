// src/components/BatchPriceAdjustment.jsx
import React, { useState } from 'react';
import { Modal, Button, Form, InputGroup, Alert, Spinner } from 'react-bootstrap';

/**
 * 批量价格调整组件
 * 用于对数据库中的价格进行批量调整
 */
const BatchPriceAdjustment = ({ 
  show, 
  onHide, 
  onApply,
  theme = 'light',
  colors = {}
}) => {
  const [category, setCategory] = useState('all');
  const [field, setField] = useState('basePrice');
  const [type, setType] = useState('percent');
  const [value, setValue] = useState('');
  const [reason, setReason] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 重置表单
  const resetForm = () => {
    setCategory('all');
    setField('basePrice');
    setType('percent');
    setValue('');
    setReason('');
    setError('');
  };
  
  // 处理提交
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!field || !category) {
      setError('请选择要调整的字段和产品类别');
      return;
    }
    
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      setError('请输入有效的调整值');
      return;
    }
    
    // 针对百分比调整的特殊检查
    if (type === 'percent' && numValue <= -100) {
      setError('百分比调整不能小于或等于-100%');
      return;
    }
    
    // 针对折扣率调整的特殊检查
    if (field === 'discountRate') {
      if (type === 'amount' && Math.abs(numValue) > 0.5) {
        setError('折扣率调整绝对值不能大于0.5（50%）');
        return;
      }
      
      if (type === 'percent' && numValue > 100) {
        setError('折扣率百分比增加不能超过100%');
        return;
      }
    }
    
    setLoading(true);
    
    // 准备调整信息对象
    const adjustmentInfo = {
      category,
      field,
      type,
      value: numValue,
      reason: reason || `批量${type === 'percent' ? '百分比' : '金额'}调整${field}`
    };
    
    // 调用父组件的处理函数
    if (typeof onApply === 'function') {
      onApply(adjustmentInfo);
    }
    
    // 这里不重置表单，由父组件在处理完成后调用onHide关闭模态框
    setLoading(false);
  };
  
  // 处理关闭
  const handleClose = () => {
    resetForm();
    if (typeof onHide === 'function') {
      onHide();
    }
  };
  
  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <Modal.Title>批量价格调整</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: colors.bg, color: colors.text }}>
        <Form onSubmit={handleSubmit}>
          {/* 产品类别选择 */}
          <Form.Group className="mb-3">
            <Form.Label>选择产品类别</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
              style={{ 
                backgroundColor: colors.inputBg, 
                color: colors.text,
                borderColor: colors.inputBorder
              }}
            >
              <option value="all">所有产品</option>
              <option value="allGearboxes">所有齿轮箱</option>
              <option value="hcGearboxes">HC系列齿轮箱</option>
              <option value="gwGearboxes">GW系列齿轮箱</option>
              <option value="hcmGearboxes">HCM系列齿轮箱</option>
              <option value="dtGearboxes">DT系列齿轮箱</option>
              <option value="hcqGearboxes">HCQ系列齿轮箱</option>
              <option value="gcGearboxes">GC系列齿轮箱</option>
              <option value="flexibleCouplings">高弹性联轴器</option>
              <option value="standbyPumps">备用泵</option>
            </Form.Select>
            <Form.Text style={{ color: colors.muted }}>
              选择要批量调整价格的产品类别
            </Form.Text>
          </Form.Group>
          
          {/* 价格字段选择 */}
          <Form.Group className="mb-3">
            <Form.Label>调整价格字段</Form.Label>
            <Form.Select
              value={field}
              onChange={(e) => setField(e.target.value)}
              disabled={loading}
              style={{ 
                backgroundColor: colors.inputBg, 
                color: colors.text,
                borderColor: colors.inputBorder
              }}
            >
              <option value="basePrice">基础价格</option>
              <option value="discountRate">折扣率</option>
              <option value="factoryPrice">工厂价格</option>
              <option value="marketPrice">市场价格</option>
            </Form.Select>
            <Form.Text style={{ color: colors.muted }}>
              选择要调整的价格字段，注意折扣率使用小数表示(0-1)
            </Form.Text>
          </Form.Group>
          
          {/* 调整类型 */}
          <Form.Group className="mb-3">
            <Form.Label>调整类型</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                label="百分比调整"
                name="adjustmentType"
                id="percent-adjustment"
                checked={type === 'percent'}
                onChange={() => setType('percent')}
                disabled={loading}
                style={{ color: colors.text }}
              />
              <Form.Check
                inline
                type="radio"
                label="金额调整"
                name="adjustmentType"
                id="amount-adjustment"
                checked={type === 'amount'}
                onChange={() => setType('amount')}
                disabled={loading}
                style={{ color: colors.text }}
              />
            </div>
            <Form.Text style={{ color: colors.muted }}>
              百分比调整基于当前值计算，如10%表示增加10%；金额调整为直接增减金额
            </Form.Text>
          </Form.Group>
          
          {/* 调整值 */}
          <Form.Group className="mb-3">
            <Form.Label>调整值</Form.Label>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={type === 'percent' ? "例如: 5 表示增加5%" : "例如: 1000 表示增加1000元"}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                disabled={loading}
                style={{ 
                  backgroundColor: colors.inputBg, 
                  color: colors.text,
                  borderColor: colors.inputBorder
                }}
              />
              <InputGroup.Text>
                {type === 'percent' ? '%' : field === 'discountRate' ? '' : '元'}
              </InputGroup.Text>
            </InputGroup>
            <Form.Text style={{ color: colors.muted }}>
              {type === 'percent'
                ? '正数表示增加，负数表示减少，如5表示增加5%，-10表示减少10%'
                : `正数表示增加，负数表示减少，如${field === 'discountRate' ? '0.01表示增加1%折扣，-0.02表示减少2%折扣' : '1000表示增加1000元，-500表示减少500元'}`}
            </Form.Text>
          </Form.Group>
          
          {/* 调整原因 */}
          <Form.Group className="mb-3">
            <Form.Label>调整原因 (可选)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              placeholder="例如: 原材料成本上涨"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={loading}
              style={{ 
                backgroundColor: colors.inputBg, 
                color: colors.text,
                borderColor: colors.inputBorder
              }}
            />
            <Form.Text style={{ color: colors.muted }}>
              记录调整原因，将显示在价格历史记录中
            </Form.Text>
          </Form.Group>
          
          {/* 错误提示 */}
          {error && (
            <Alert variant="danger" className="mt-3 mb-3">
              {error}
            </Alert>
          )}
          
          {/* 警告提示 */}
          <Alert variant="warning" className="mt-3 mb-3">
            <p className="mb-0"><strong>注意事项:</strong></p>
            <ul className="mb-0">
              <li>批量调整将影响所选类别的所有产品价格</li>
              <li>调整后的价格如果为负数将被设为0</li>
              <li>调整折扣率时，结果将被限制在0-1之间</li>
              <li>此操作不可撤销，请谨慎操作</li>
            </ul>
          </Alert>
        </Form>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: colors.bg, borderTopColor: colors.border }}>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          取消
        </Button>
        <Button 
          variant="primary" 
          onClick={handleSubmit}
          disabled={loading || !value || isNaN(parseFloat(value))}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              处理中...
            </>
          ) : '应用调整'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BatchPriceAdjustment;
