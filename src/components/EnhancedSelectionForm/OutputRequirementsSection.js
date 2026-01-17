// src/components/EnhancedSelectionForm/OutputRequirementsSection.js
// 输出需求区块组件

import React, { useRef } from 'react';
import { Card, Form, Row, Col, Badge, Button, ListGroup } from 'react-bootstrap';
import { FORM_OPTIONS } from './useEnhancedSelectionForm';

/**
 * 输出需求区块
 * 包含: 输出要求(多选)、输出要求时间、相关附件
 */
const OutputRequirementsSection = ({
  formData,
  errors,
  updateField,
  toggleOutputRequirement,
  addAttachment,
  removeAttachment,
  colors = {},
  theme = 'light'
}) => {
  const fileInputRef = useRef(null);

  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  // 处理文件选择
  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      addAttachment({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
    });
    // 重置input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // 格式化文件大小
  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa', color: colors.headerText || '#212529' }}>
        <strong>输出需求</strong>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>
                输出要求 <span className="text-danger">*</span>
              </Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {FORM_OPTIONS.outputRequirements.map(opt => (
                  <Badge
                    key={opt.value}
                    bg={formData.outputRequirements?.includes(opt.value) ? 'primary' : 'secondary'}
                    style={{
                      cursor: 'pointer',
                      fontSize: '0.9em',
                      padding: '8px 12px'
                    }}
                    onClick={() => toggleOutputRequirement(opt.value)}
                  >
                    {formData.outputRequirements?.includes(opt.value) ? '✓ ' : ''}{opt.label}
                  </Badge>
                ))}
              </div>
              {errors.outputRequirements && (
                <div className="text-danger mt-2" style={{ fontSize: '0.875em' }}>
                  {errors.outputRequirements}
                </div>
              )}
              <Form.Text className="text-muted">
                点击选择需要的输出文档类型
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>输出要求时间</Form.Label>
              <Form.Control
                type="date"
                value={formData.deadline}
                onChange={(e) => updateField('deadline', e.target.value)}
                style={inputStyle}
              />
              <Form.Text className="text-muted">
                期望交付日期
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>相关附件</Form.Label>
              <div className="d-flex gap-2 mb-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  + 添加附件
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
              </div>

              {formData.attachments?.length > 0 && (
                <ListGroup>
                  {formData.attachments.map((file, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                      style={{
                        backgroundColor: colors.inputBg || '#fff',
                        color: colors.text || '#212529'
                      }}
                    >
                      <div>
                        <span>{file.name}</span>
                        <small className="text-muted ms-2">({formatFileSize(file.size)})</small>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        删除
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              {(!formData.attachments || formData.attachments.length === 0) && (
                <div className="text-muted" style={{ fontSize: '0.9em' }}>
                  暂无附件，点击上方按钮添加
                </div>
              )}
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default OutputRequirementsSection;
