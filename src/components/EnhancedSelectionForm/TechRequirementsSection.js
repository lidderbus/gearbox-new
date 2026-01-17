// src/components/EnhancedSelectionForm/TechRequirementsSection.js
// 技术要求区块组件

import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { FORM_OPTIONS } from './useEnhancedSelectionForm';

/**
 * 技术要求区块
 * 包含: 推力、监控系统、操控方式、输入转向
 */
const TechRequirementsSection = ({
  formData,
  updateField,
  colors = {},
  theme = 'light'
}) => {
  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa', color: colors.headerText || '#212529' }}>
        <strong>技术要求</strong>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>推力</Form.Label>
              <Form.Control
                type="text"
                value={formData.thrust}
                onChange={(e) => updateField('thrust', e.target.value)}
                placeholder="无要求 或 具体数值 (kN)"
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>监控系统</Form.Label>
              <Form.Select
                value={formData.monitoringSystem}
                onChange={(e) => updateField('monitoringSystem', e.target.value)}
                style={inputStyle}
              >
                {FORM_OPTIONS.monitoringSystem.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>操控方式</Form.Label>
              <Form.Select
                value={formData.controlMethod}
                onChange={(e) => updateField('controlMethod', e.target.value)}
                style={inputStyle}
              >
                {FORM_OPTIONS.controlMethod.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>输入转向 (面向飞轮)</Form.Label>
              <Form.Select
                value={formData.inputRotation}
                onChange={(e) => updateField('inputRotation', e.target.value)}
                style={inputStyle}
              >
                {FORM_OPTIONS.inputRotation.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default TechRequirementsSection;
