// src/components/EnhancedSelectionForm/BasicParamsSection.js
// 基本参数区块组件

import React from 'react';
import { Card, Form, Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import ShaftArrangementSelector from '../ShaftArrangementSelector';

/**
 * 基本参数区块
 * 包含: 轴布置方式、主机功率、主机转速、速比
 */
const HelpTip = ({ text }) => (
  <OverlayTrigger placement="top" overlay={<Tooltip>{text}</Tooltip>}>
    <i className="bi bi-info-circle ms-1" style={{ cursor: 'pointer', color: '#6c757d', fontSize: '0.85em' }}></i>
  </OverlayTrigger>
);

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
                <HelpTip text="发动机额定连续功率(MCR)，单位千瓦。与转速一起决定传递能力需求 P/N" />
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
                <HelpTip text="发动机额定转速，单位转/分钟。低速750-1000(柴油机)，中速1000-1500，高速1500-2200，>3000将自动触发临界转速预检" />
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

        {/* 传递能力实时计算 */}
        {parseFloat(formData.enginePower) > 0 && parseFloat(formData.engineSpeed) > 0 && (
          <div
            className="mb-3 p-2 rounded"
            style={{
              backgroundColor: colors.inputBg || '#f8f9fa',
              border: `1px dashed ${colors.border || '#dee2e6'}`,
              fontSize: '0.9rem'
            }}
          >
            <i className="bi bi-calculator me-2"></i>
            <strong>传递能力需求 (P/N)：</strong>
            <span style={{ color: '#0d6efd', fontWeight: 'bold' }}>
              {(parseFloat(formData.enginePower) / parseFloat(formData.engineSpeed)).toFixed(4)}
            </span>
            <span className="text-muted ms-1">kW/(r/min)</span>
            {parseFloat(formData.enginePower) / parseFloat(formData.engineSpeed) > 0.5 && (
              <Badge bg="warning" text="dark" className="ms-2">大功率工况</Badge>
            )}
            {parseFloat(formData.enginePower) / parseFloat(formData.engineSpeed) < 0.01 && (
              <Badge bg="info" className="ms-2">小型应用</Badge>
            )}
          </div>
        )}

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                速比 <span className="text-danger">*</span>
                <HelpTip text="齿轮箱减速比 = 输入转速 / 输出转速。常见值: 2.0~6.0。速比越大输出转速越低，适合大直径螺旋桨" />
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
