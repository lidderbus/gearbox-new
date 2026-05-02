import React, { useMemo, useState } from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';
import { getPricingStrategy } from '../utils/smartPricingEngine';
import { formatPrice } from '../utils/priceFormatter';

const SmartPricingCard = ({ model, basePrice, quantity = 1, customerName = '', onSelectStrategy }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const strategy = useMemo(() => {
    if (!model || !basePrice) return null;
    setSelectedIndex(null);
    return getPricingStrategy(model, basePrice, quantity, customerName);
  }, [model, basePrice, quantity, customerName]);

  if (!strategy) return null;

  const confColor = { high: 'success', medium: 'warning', low: 'secondary' }[strategy.confidence] || 'secondary';
  const confLabel = { high: '高', medium: '中', low: '低' }[strategy.confidence] || '低';

  return (
    <Card className="mt-3 border-primary" style={{ borderWidth: '2px' }}>
      <Card.Header className="bg-primary bg-opacity-10 d-flex justify-content-between align-items-center">
        <span><i className="bi bi-lightbulb me-2" style={{ color: '#f59e0b' }}></i><strong>智能报价建议</strong></span>
        <Badge bg={confColor} pill>置信度: {confLabel}</Badge>
      </Card.Header>
      <Card.Body>
        <Row className="mb-3">
          <Col md={4} className="text-center">
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#10b981' }}>{strategy.suggestedDiscount}%</div>
            <div className="text-muted small">推荐折扣</div>
          </Col>
          <Col md={4} className="text-center">
            <div style={{ fontSize: '20px', fontWeight: '600' }}>{formatPrice(strategy.discountedPrice)}</div>
            <div className="text-muted small">推荐单价</div>
          </Col>
          <Col md={4} className="text-center">
            <div style={{ fontSize: '20px', fontWeight: '600', color: '#3b82f6' }}>{formatPrice(strategy.totalPrice)}</div>
            <div className="text-muted small">总价 ({quantity}台)</div>
          </Col>
        </Row>

        {strategy.reasoning.length > 0 && (
          <div className="mb-3">
            <small className="text-muted">定价依据:</small>
            <div className="d-flex flex-wrap gap-1 mt-1">
              {strategy.reasoning.map((r, i) => (
                <Badge key={i} bg="light" text="dark" className="fw-normal">{r}</Badge>
              ))}
            </div>
          </div>
        )}

        <div className="mb-2"><small className="text-muted fw-bold">报价策略对比<span className="text-primary">（点击选择）</span>:</small></div>
        {strategy.strategies.map((s, i) => {
          const isSelected = selectedIndex === i;
          const isRecommended = s.recommended && selectedIndex === null;
          return (
            <div
              key={i}
              onClick={() => {
                setSelectedIndex(i);
                if (onSelectStrategy) {
                  onSelectStrategy({ name: s.name, discount: s.discount, price: s.price });
                }
              }}
              style={{ cursor: 'pointer', transition: 'all 0.2s' }}
              className={`d-flex align-items-center p-2 mb-1 rounded ${
                isSelected
                  ? 'bg-primary bg-opacity-10 border border-primary border-2'
                  : isRecommended
                    ? 'bg-success bg-opacity-10 border border-success'
                    : 'bg-light border border-transparent'
              }`}
            >
              <div className="me-2">
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  border: isSelected ? '2px solid #0d6efd' : '2px solid #adb5bd',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {isSelected && <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#0d6efd' }} />}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="d-flex align-items-center gap-2">
                  <strong className="small">{s.name}</strong>
                  {s.recommended && <Badge bg="success" pill style={{ fontSize: '10px' }}>推荐</Badge>}
                  {isSelected && <Badge bg="primary" pill style={{ fontSize: '10px' }}>已选</Badge>}
                </div>
                <div className="text-muted" style={{ fontSize: '11px' }}>{s.desc}</div>
              </div>
              <div className="text-end">
                <div className={`fw-bold ${isSelected ? 'text-primary' : ''}`}>{formatPrice(s.price)}</div>
                <div className="text-muted" style={{ fontSize: '11px' }}>下浮{s.discount}%</div>
              </div>
            </div>
          );
        })}

        {strategy.historicalDiscount.count > 0 && (
          <div className="mt-3 p-2 bg-light rounded">
            <small className="text-muted">
              <i className="bi bi-clock-history me-1"></i>
              历史: {strategy.historicalDiscount.count}单, 折扣 {strategy.historicalDiscount.range[0]}%-{strategy.historicalDiscount.range[1]}%
              {strategy.historicalDiscount.customerAvg !== null && `, 该客户均${strategy.historicalDiscount.customerAvg.toFixed(1)}%`}
            </small>
          </div>
        )}
        {strategy.loyaltyDiscount > 0 && (
          <div className="mt-2 p-2 bg-warning bg-opacity-10 rounded">
            <small><i className="bi bi-star-fill me-1" style={{ color: '#f59e0b' }}></i>老客户优惠: 额外{strategy.loyaltyDiscount}%</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SmartPricingCard;
