// src/components/EnhancedSelectionForm/EngineInfoSection.js
// 主机信息区块组件

import React from 'react';
import { Card, Form, Row, Col } from 'react-bootstrap';
import { FORM_OPTIONS } from './useEnhancedSelectionForm';

/**
 * 主机信息区块
 * 包含: 主机品牌、主机型号、飞轮型号、输入转向
 */
const EngineInfoSection = ({
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
        <strong>主机信息</strong>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>主机品牌</Form.Label>
              <Form.Select
                value={formData.engineBrand || '潍柴'}
                onChange={(e) => updateField('engineBrand', e.target.value)}
                style={inputStyle}
              >
                {FORM_OPTIONS.engineBrand.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>主机型号</Form.Label>
              <Form.Control
                type="text"
                value={formData.engineModel || ''}
                onChange={(e) => updateField('engineModel', e.target.value)}
                placeholder="例如: WP10.270E41"
                style={inputStyle}
              />
              <Form.Text className="text-muted">
                完整主机型号便于技术协议生成
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>飞轮型号 (手动输入)</Form.Label>
              <Form.Control
                type="text"
                value={formData.flywheelSpec || ''}
                onChange={(e) => updateField('flywheelSpec', e.target.value)}
                placeholder="例如: SAE14"
                style={inputStyle}
              />
              <Form.Text className="text-muted">
                用于技术协议生成
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>输入转向 (面向飞轮)</Form.Label>
              <Form.Select
                value={formData.engineRotation || '无要求'}
                onChange={(e) => updateField('engineRotation', e.target.value)}
                style={inputStyle}
              >
                {FORM_OPTIONS.engineRotation.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* 接口筛选 - 新增 */}
        <Row className="mt-2 pt-2" style={{ borderTop: `1px dashed ${colors.border || '#dee2e6'}` }}>
          <Col md={12}>
            <Form.Label className="fw-bold text-primary">
              <i className="bi bi-plug me-1"></i>
              主机接口筛选 (可选)
            </Form.Label>
            <Form.Text className="d-block text-muted mb-2">
              选择主机接口规格，系统将筛选出支持该接口的齿轮箱
            </Form.Text>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>接口类型</Form.Label>
              <Form.Select
                value={formData.interfaceType || '无要求'}
                onChange={(e) => {
                  updateField('interfaceType', e.target.value);
                  updateField('interfaceSpec', ''); // 切换类型时清空规格
                }}
                style={inputStyle}
              >
                {FORM_OPTIONS.interfaceType.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>接口规格</Form.Label>
              <Form.Select
                value={formData.interfaceSpec || ''}
                onChange={(e) => updateField('interfaceSpec', e.target.value)}
                style={inputStyle}
                disabled={!formData.interfaceType || formData.interfaceType === '无要求'}
              >
                <option value="">请选择规格</option>
                {formData.interfaceType === 'sae' && FORM_OPTIONS.saeInterfaces.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                {formData.interfaceType === 'domestic' && FORM_OPTIONS.domesticInterfaces.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
              {formData.interfaceType === '无要求' && (
                <Form.Text className="text-muted">先选择接口类型</Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>筛选模式</Form.Label>
              <Form.Select
                value={formData.interfaceFilterMode || 'prefer'}
                onChange={(e) => updateField('interfaceFilterMode', e.target.value)}
                style={inputStyle}
                disabled={!formData.interfaceSpec}
              >
                <option value="prefer">优先显示 (匹配的排前面)</option>
                <option value="strict">严格筛选 (只显示匹配的)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default EngineInfoSection;
