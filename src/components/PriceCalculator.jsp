// src/components/PriceCalculator.jsx
import React, { useState, useEffect } from 'react';
import { Card, Form, Row, Col, Table, InputGroup, Alert } from 'react-bootstrap';

/**
 * 价格计算器组件
 * 用于显示和调整选中组件的价格
 */
const PriceCalculator = ({
  selectedComponents,
  packagePrice,
  marketPrice,
  totalMarketPrice,
  onPriceChange,
  onTotalMarketPriceChange,
  colors,
  theme = 'light',
  selectionDetails = {}
}) => {
  const [showPriceDetails, setShowPriceDetails] = useState(false);
  const [priceDifference, setPriceDifference] = useState(0);
  
  // 计算基础价格与市场价的差异
  useEffect(() => {
    if (totalMarketPrice && selectedComponents?.gearbox?.basePrice) {
      const diff = totalMarketPrice - selectedComponents.gearbox.basePrice;
      const diffPercent = selectedComponents.gearbox.basePrice > 0 
        ? (diff / selectedComponents.gearbox.basePrice * 100).toFixed(1) 
        : 0;
      setPriceDifference(diffPercent);
    } else {
      setPriceDifference(0);
    }
  }, [totalMarketPrice, selectedComponents]);

  // 渲染价格输入字段
  const renderPriceInput = (component, field, label, readOnly = false, suffix = '') => {
    if (!selectedComponents[component]) return null;
    
    const value = selectedComponents[component][field] || 0;
    
    return (
      <Form.Group className="mb-2">
        <Form.Label className="small mb-0">{label}</Form.Label>
        <InputGroup size="sm">
          <Form.Control
            type="number"
            min="0"
            step="100"
            value={value}
            onChange={(e) => onPriceChange(component, field, e.target.value)}
            readOnly={readOnly}
            disabled={readOnly}
            style={{
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.inputBorder
            }}
          />
          {suffix && <InputGroup.Text>{suffix}</InputGroup.Text>}
        </InputGroup>
      </Form.Group>
    );
  };

  // 渲染折扣率输入字段
  const renderDiscountInput = (component, field, label) => {
    if (!selectedComponents[component]) return null;
    
    const value = selectedComponents[component][field] || 0;
    const displayValue = (value * 100).toFixed(1);
    
    return (
      <Form.Group className="mb-2">
        <Form.Label className="small mb-0">{label}</Form.Label>
        <InputGroup size="sm">
          <Form.Control
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={displayValue}
            onChange={(e) => {
              const newValue = parseFloat(e.target.value) / 100;
              onPriceChange(component, field, newValue);
            }}
            style={{
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.inputBorder
            }}
          />
          <InputGroup.Text>%</InputGroup.Text>
        </InputGroup>
      </Form.Group>
    );
  };

  // 获取推荐价格范围
  const getRecommendedPriceRange = () => {
    if (!selectedComponents.gearbox?.factoryPrice) return null;
    
    const basePrice = selectedComponents.gearbox.basePrice || 0;
    const factoryPrice = selectedComponents.gearbox.factoryPrice || 0;
    const minMarketPrice = Math.round(factoryPrice * 1.05); // 最小5%加价
    const maxMarketPrice = Math.round(factoryPrice * 1.25); // 最大25%加价
    
    return {
      min: minMarketPrice,
      max: maxMarketPrice,
      base: basePrice
    };
  };

  // 渲染价格评估
  const renderPriceAssessment = () => {
    const range = getRecommendedPriceRange();
    if (!range) return null;
    
    // 计算价格合理性
    let assessment = '';
    let variant = 'info';
    
    if (totalMarketPrice < range.min) {
      assessment = '当前定价偏低，可能影响利润';
      variant = 'warning';
    } else if (totalMarketPrice > range.max) {
      assessment = '当前定价偏高，可能影响竞争力';
      variant = 'warning';
    } else if (totalMarketPrice > range.min && totalMarketPrice < range.min * 1.1) {
      assessment = '当前定价处于合理的低区间';
      variant = 'success';
    } else {
      assessment = '当前定价处于合理区间';
      variant = 'success';
    }
    
    return (
      <Alert variant={variant} className="p-2 mb-2">
        <small>{assessment}</small>
      </Alert>
    );
  };

  // 计算安全系数评估
  const getSafetyFactorAssessment = () => {
    const { safetyFactor, capacityMargin, ratioDiffPercent } = selectionDetails;
    
    if (!safetyFactor) return null;
    
    let assessment = '';
    let variant = 'info';
    
    if (safetyFactor >= 1.2) {
      assessment = '安全系数良好，允许适当降价';
      variant = 'success';
    } else if (safetyFactor >= 1.0) {
      assessment = '安全系数合格但偏低，建议维持标准价格';
      variant = 'warning';
    } else {
      assessment = '安全系数不足，不建议降价';
      variant = 'danger';
    }
    
    return { assessment, variant };
  };

  return (
    <div className="price-calculator">
      <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header 
          style={{ backgroundColor: colors.headerBg, color: colors.headerText }}
          onClick={() => setShowPriceDetails(!showPriceDetails)}
          className="cursor-pointer d-flex justify-content-between align-items-center"
        >
          <span>价格计算</span>
          <i className={`bi bi-chevron-${showPriceDetails ? 'up' : 'down'}`}></i>
        </Card.Header>
        
        {showPriceDetails && (
          <Card.Body>
            <Row>
              {/* 齿轮箱价格设置 */}
              <Col md={4}>
                <h6 style={{ color: colors.headerText }}>齿轮箱价格</h6>
                {renderPriceInput('gearbox', 'basePrice', '基础价格')}
                {renderDiscountInput('gearbox', 'discountRate', '折扣率')}
                {renderPriceInput('gearbox', 'factoryPrice', '工厂价格', true)}
                {renderPriceInput('gearbox', 'marketPrice', '市场价格')}
              </Col>
              
              {/* 配件价格设置 */}
              <Col md={4}>
                <h6 style={{ color: colors.headerText }}>配件价格</h6>
                <div className="mb-3">
                  <h6 className="small" style={{ color: colors.muted }}>高弹性联轴器</h6>
                  {selectedComponents.coupling ? (
                    <>
                      {renderPriceInput('coupling', 'basePrice', '基础价格')}
                      {renderDiscountInput('coupling', 'discountRate', '折扣率')}
                      {renderPriceInput('coupling', 'factoryPrice', '工厂价格', true)}
                    </>
                  ) : (
                    <small className="text-muted">未选配联轴器</small>
                  )}
                </div>
                
                <div>
                  <h6 className="small" style={{ color: colors.muted }}>备用泵</h6>
                  {selectedComponents.pump ? (
                    <>
                      {renderPriceInput('pump', 'basePrice', '基础价格')}
                      {renderDiscountInput('pump', 'discountRate', '折扣率')}
                      {renderPriceInput('pump', 'factoryPrice', '工厂价格', true)}
                    </>
                  ) : (
                    <small className="text-muted">未选配备用泵</small>
                  )}
                </div>
              </Col>
              
              {/* 总价格设置 */}
              <Col md={4}>
                <h6 style={{ color: colors.headerText }}>总价格</h6>
                <Form.Group className="mb-2">
                  <Form.Label className="small mb-0">打包价格</Form.Label>
                  <Form.Control
                    type="number"
                    value={packagePrice || 0}
                    readOnly
                    disabled
                    size="sm"
                    style={{
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      borderColor: colors.inputBorder
                    }}
                  />
                  <Form.Text style={{ color: colors.muted }}>
                    打包价格是所有组件工厂价的总和
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label className="small mb-0">市场价格</Form.Label>
                  <Form.Control
                    type="number"
                    value={marketPrice || 0}
                    readOnly
                    disabled
                    size="sm"
                    style={{
                      backgroundColor: colors.inputBg,
                      color: colors.text,
                      borderColor: colors.inputBorder
                    }}
                  />
                  <Form.Text style={{ color: colors.muted }}>
                    齿轮箱市场价（默认为工厂价的1.1倍）
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-2">
                  <Form.Label className="small mb-0">最终报价</Form.Label>
                  <InputGroup size="sm">
                    <Form.Control
                      type="number"
                      value={totalMarketPrice || 0}
                      onChange={(e) => onTotalMarketPriceChange(parseFloat(e.target.value))}
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        borderColor: colors.inputBorder,
                        fontWeight: 'bold'
                      }}
                    />
                    <InputGroup.Text>元</InputGroup.Text>
                  </InputGroup>
                  <Form.Text style={{ color: colors.muted }}>
                    最终报价，报价单将使用此价格
                  </Form.Text>
                </Form.Group>
                
                {/* 价格评估 */}
                {renderPriceAssessment()}
                
                {/* 安全系数评估 */}
                {getSafetyFactorAssessment() && (
                  <Alert variant={getSafetyFactorAssessment().variant} className="p-2 mb-0">
                    <small>{getSafetyFactorAssessment().assessment}</small>
                  </Alert>
                )}
              </Col>
            </Row>
            
            {/* 价格说明 */}
            <div className="mt-3">
              <small style={{ color: colors.muted }}>
                <i className="bi bi-info-circle me-1"></i>
                基础价格是官方定价。工厂价格为基础价格乘以(1-折扣率)。市场价格为工厂价格的1.1倍。
                最终报价可手动调整，将用于生成报价单和合同。当前最终报价与基础价格
                {priceDifference > 0 ? '高出' : '低于'}
                <strong> {Math.abs(priceDifference)}% </strong>
              </small>
            </div>
          </Card.Body>
        )}
      </Card>
    </div>
  );
};

export default PriceCalculator;
