// src/components/EnhancedSelectionForm/CustomerInfoSection.js
// 客户与项目信息区块组件

import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { FORM_OPTIONS } from './useEnhancedSelectionForm';

/**
 * 客户与项目信息区块
 * 包含: 船东/需方、联系人、电话、邮箱、项目名称、项目编号、建造船厂、船舶类型
 * 注: 所有字段可选，但填写时验证格式
 */
const CustomerInfoSection = ({
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

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa', color: colors.headerText || '#212529' }}>
        <strong>客户与项目信息</strong>
        <small className="text-muted ms-2">(选填)</small>
      </Card.Header>
      <Card.Body>
        {/* 客户信息 */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>船东/需方名称</Form.Label>
              <Form.Control
                type="text"
                value={formData.customerName || ''}
                onChange={(e) => updateField('customerName', e.target.value)}
                placeholder="例如: 浙江XX渔业公司"
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>联系人</Form.Label>
              <Form.Control
                type="text"
                value={formData.contactPerson || ''}
                onChange={(e) => updateField('contactPerson', e.target.value)}
                placeholder="例如: 张三"
                style={inputStyle}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>联系电话</Form.Label>
              <Form.Control
                type="tel"
                value={formData.contactPhone || ''}
                onChange={(e) => updateField('contactPhone', e.target.value)}
                placeholder="例如: 13800138000"
                isInvalid={!!errors.contactPhone}
                style={inputStyle}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contactPhone}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>电子邮箱</Form.Label>
              <Form.Control
                type="email"
                value={formData.contactEmail || ''}
                onChange={(e) => updateField('contactEmail', e.target.value)}
                placeholder="例如: contact@example.com"
                isInvalid={!!errors.contactEmail}
                style={inputStyle}
              />
              <Form.Control.Feedback type="invalid">
                {errors.contactEmail}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <hr />

        {/* 项目信息 */}
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>项目名称/船名</Form.Label>
              <Form.Control
                type="text"
                value={formData.projectName || ''}
                onChange={(e) => updateField('projectName', e.target.value)}
                placeholder="例如: 浙普渔XXX"
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>项目编号</Form.Label>
              <Form.Control
                type="text"
                value={formData.projectNumber || ''}
                onChange={(e) => updateField('projectNumber', e.target.value)}
                placeholder="例如: ZP2026-001"
                style={inputStyle}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>建造船厂</Form.Label>
              <Form.Control
                type="text"
                value={formData.shipyard || ''}
                onChange={(e) => updateField('shipyard', e.target.value)}
                placeholder="例如: XX船舶修造厂"
                style={inputStyle}
              />
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>船舶类型</Form.Label>
              <Form.Select
                value={formData.shipType || '渔船'}
                onChange={(e) => updateField('shipType', e.target.value)}
                style={inputStyle}
              >
                {FORM_OPTIONS.shipType.map(opt => (
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

export default CustomerInfoSection;
