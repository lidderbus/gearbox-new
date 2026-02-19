// src/components/EnhancedSelectionForm/BasicParamsSection.js
// 基本参数区块组件

import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import ShaftArrangementSelector from '../ShaftArrangementSelector';

/**
 * 基本参数区块
 * 包含: 轴布置方式、主机功率、主机转速、速比
 */
const BasicParamsSection = ({
  formData,
  errors,
  updateField,
  colors = {},
  theme = 'light'
}) => {
  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  // 处理arrangement兼容性 — 旧版可能是字符串
  const arrangementValue = (() => {
    const arr = formData.arrangement;
    if (!arr || typeof arr === 'string') {
      return { axisAlignment: 'any', offsetDirection: 'any' };
    }
    return arr;
  })();

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa', color: colors.headerText || '#212529' }}>
        <strong>基本参数</strong>
      </Card.Header>
      <Card.Body>
        {/* 轴布置方式选择器 */}
        <Form.Group className="mb-3">
          <Form.Label>轴布置方式</Form.Label>
          <ShaftArrangementSelector
            value={arrangementValue}
            onChange={(val) => updateField('arrangement', val)}
            colors={colors}
            gearboxType="GW"
          />
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                主机功率 (kW) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={formData.enginePower}
                onChange={(e) => updateField('enginePower', e.target.value)}
                placeholder="例如: 228"
                isInvalid={!!errors.enginePower}
                style={inputStyle}
              />
              <Form.Control.Feedback type="invalid">
                {errors.enginePower}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                主机转速 (rpm) <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                value={formData.engineSpeed}
                onChange={(e) => updateField('engineSpeed', e.target.value)}
                placeholder="例如: 2000"
                isInvalid={!!errors.engineSpeed}
                style={inputStyle}
              />
              <Form.Control.Feedback type="invalid">
                {errors.engineSpeed}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                速比 <span className="text-danger">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                value={formData.ratio}
                onChange={(e) => updateField('ratio', e.target.value)}
                placeholder="例如: 2.96"
                isInvalid={!!errors.ratio}
                style={inputStyle}
              />
              <Form.Control.Feedback type="invalid">
                {errors.ratio}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BasicParamsSection;
