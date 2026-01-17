// src/components/EnhancedSelectionForm/QualityRequirementsSection.js
// 质量要求区块组件

import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';

/**
 * 质量要求区块
 * 包含: 材料要求、工艺要求、特殊质量控制、外购件要求、检验要求
 */
const QualityRequirementsSection = ({
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
        <strong>质量要求</strong>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>材料要求</Form.Label>
              <Form.Control
                type="text"
                value={formData.materialRequirements}
                onChange={(e) => updateField('materialRequirements', e.target.value)}
                placeholder="无要求 或 具体材料要求"
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>工艺要求</Form.Label>
              <Form.Control
                type="text"
                value={formData.processRequirements}
                onChange={(e) => updateField('processRequirements', e.target.value)}
                placeholder="无要求 或 具体工艺要求"
                style={inputStyle}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>特殊质量控制</Form.Label>
              <Form.Control
                type="text"
                value={formData.specialQualityControl}
                onChange={(e) => updateField('specialQualityControl', e.target.value)}
                placeholder="无要求 或 具体控制要求"
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>外购件要求</Form.Label>
              <Form.Control
                type="text"
                value={formData.purchasedPartsRequirements}
                onChange={(e) => updateField('purchasedPartsRequirements', e.target.value)}
                placeholder="无要求 或 具体外购件要求"
                style={inputStyle}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>检验要求</Form.Label>
              <Form.Control
                type="text"
                value={formData.inspectionRequirements}
                onChange={(e) => updateField('inspectionRequirements', e.target.value)}
                placeholder="无要求 或 具体检验要求"
                style={inputStyle}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QualityRequirementsSection;
