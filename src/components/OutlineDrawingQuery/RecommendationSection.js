// src/components/OutlineDrawingQuery/RecommendationSection.js
// Coupling recommendation calculator
import React from 'react';
import { Card, Row, Col, Form, Button, Alert, Badge } from 'react-bootstrap';

/**
 * Recommendation section for coupling selection
 */
const RecommendationSection = ({
  recommendPower,
  recommendSpeed,
  recommendations,
  onPowerChange,
  onSpeedChange,
  onRecommend,
  onModelSelect,
  colors = {}
}) => {
  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <i className="bi bi-calculator me-2"></i>联轴器推荐计算
      </Card.Header>
      <Card.Body>
        <Alert variant="info" className="mb-3">
          <i className="bi bi-info-circle me-2"></i>
          根据电机功率和转速，系统将自动计算所需扭矩并推荐合适的联轴器型号。
          <br />
          <strong>计算公式:</strong> T = 9550 × P / n × 安全系数(1.5)
        </Alert>

        <Row className="mb-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: colors.text }}>电机功率 (kW)</Form.Label>
              <Form.Control
                type="number"
                placeholder="如: 249"
                value={recommendPower}
                onChange={(e) => onPowerChange(e.target.value)}
                style={{
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group>
              <Form.Label style={{ color: colors.text }}>转速 (rpm)</Form.Label>
              <Form.Control
                type="number"
                placeholder="如: 1500"
                value={recommendSpeed}
                onChange={(e) => onSpeedChange(e.target.value)}
                style={{
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderColor: colors.border
                }}
              />
            </Form.Group>
          </Col>
          <Col md={4} className="d-flex align-items-end">
            <Button
              variant="primary"
              onClick={onRecommend}
              disabled={!recommendPower}
              className="w-100"
            >
              <i className="bi bi-search me-2"></i>计算推荐
            </Button>
          </Col>
        </Row>

        {/* Recommendation results */}
        {recommendations.length > 0 && (
          <div>
            <h6 style={{ color: colors.headerText }}>
              <i className="bi bi-check-circle me-2"></i>
              推荐联轴器 (计算扭矩: {recommendations[0].calculatedTorque} kN·m,
              选择扭矩: {recommendations[0].requiredTorque} kN·m)
            </h6>
            <Row>
              {recommendations.map((item, index) => (
                <Col md={4} key={item.model} className="mb-3">
                  <Card
                    style={{
                      backgroundColor: index === 0 ? 'rgba(25, 135, 84, 0.1)' : colors.card,
                      borderColor: index === 0 ? '#198754' : colors.border,
                      cursor: 'pointer'
                    }}
                    onClick={() => onModelSelect(item.model, 'coupling')}
                  >
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <h5 style={{ color: colors.text }}>{item.model}</h5>
                          <p className="text-muted small mb-1">{item.description}</p>
                        </div>
                        {index === 0 && (
                          <Badge bg="success">首选</Badge>
                        )}
                      </div>
                      <hr />
                      <Row className="small">
                        <Col xs={6}>
                          <strong>额定扭矩:</strong> {item.torque}
                        </Col>
                        <Col xs={6}>
                          <strong>最大扭矩:</strong> {item.maxTorque}
                        </Col>
                        <Col xs={12} className="mt-1">
                          <strong>孔径范围:</strong> {item.boreRange}
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        )}

        {/* 64T project example */}
        <Alert variant="secondary" className="mt-3">
          <strong>案例参考 (64T项目):</strong>
          <br />
          电机: TYP249-8, 249kW, 1500rpm, φ80m6轴径
          <br />
          计算: T = 9550 × 249 / 1500 = 1585 N·m → 选择扭矩 2.378 kN·m
          <br />
          <strong>推荐型号: HGTHT4</strong> (额定4kN·m, 最大10kN·m, 孔径40-80mm)
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default RecommendationSection;
