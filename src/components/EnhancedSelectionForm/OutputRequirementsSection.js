// src/components/EnhancedSelectionForm/OutputRequirementsSection.js
// 输出需求区块组件

import React, { useRef, useState } from 'react';
import { Card, Form, Row, Col, Badge, Button, ListGroup, Alert } from 'react-bootstrap';
import { FORM_OPTIONS } from './useEnhancedSelectionForm';

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB per file
const MAX_TOTAL_SIZE = 50 * 1024 * 1024; // 50MB total

// 文件类型图标映射
const FILE_ICONS = {
  pdf: 'bi-file-earmark-pdf text-danger',
  doc: 'bi-file-earmark-word text-primary',
  docx: 'bi-file-earmark-word text-primary',
  xls: 'bi-file-earmark-excel text-success',
  xlsx: 'bi-file-earmark-excel text-success',
  jpg: 'bi-file-earmark-image text-warning',
  jpeg: 'bi-file-earmark-image text-warning',
  png: 'bi-file-earmark-image text-info',
  dwg: 'bi-file-earmark-binary text-secondary',
};

const getFileIcon = (filename) => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  return FILE_ICONS[ext] || 'bi-file-earmark text-muted';
};

/**
 * 输出需求区块
 * 包含: 输出要求(多选+全选)、输出要求时间、相关附件(带限制)
 */
const OutputRequirementsSection = ({
  formData,
  errors,
  updateField,
  toggleOutputRequirement,
  selectAllOutputRequirements,
  addAttachment,
  removeAttachment,
  colors = {},
  theme = 'light'
}) => {
  const fileInputRef = useRef(null);
  const [fileError, setFileError] = useState('');

  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  const allOptions = FORM_OPTIONS.outputRequirements.map(o => o.value);
  const allSelected = allOptions.every(opt => formData.outputRequirements?.includes(opt));

  // 计算当前附件总大小
  const totalAttachmentSize = (formData.attachments || []).reduce((sum, f) => sum + (f.size || 0), 0);

  // 处理文件选择（带大小限制）
  const handleFileSelect = (e) => {
    setFileError('');
    const files = Array.from(e.target.files);
    const rejected = [];

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        rejected.push(`${file.name} (${formatFileSize(file.size)}) 超过单文件20MB限制`);
        continue;
      }
      if (totalAttachmentSize + file.size > MAX_TOTAL_SIZE) {
        rejected.push(`添加 ${file.name} 后总大小超过50MB限制`);
        continue;
      }
      addAttachment({
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
    }

    if (rejected.length > 0) {
      setFileError(rejected.join('；'));
    }

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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">
                  输出要求 <span className="text-danger">*</span>
                </Form.Label>
                <Button
                  variant={allSelected ? 'outline-secondary' : 'outline-primary'}
                  size="sm"
                  onClick={() => selectAllOutputRequirements?.(allOptions)}
                >
                  {allSelected ? '取消全选' : '全选'}
                </Button>
              </div>
              <div className="d-flex flex-wrap gap-2">
                {FORM_OPTIONS.outputRequirements.map(opt => {
                  const selected = formData.outputRequirements?.includes(opt.value);
                  return (
                    <div
                      key={opt.value}
                      onClick={() => toggleOutputRequirement(opt.value)}
                      style={{
                        cursor: 'pointer',
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '0.9em',
                        fontWeight: 500,
                        transition: 'all 0.15s ease',
                        border: selected
                          ? '2px solid #0d6efd'
                          : `2px solid ${colors.inputBorder || '#ced4da'}`,
                        backgroundColor: selected
                          ? '#0d6efd'
                          : 'transparent',
                        color: selected
                          ? '#fff'
                          : (colors.text || '#212529'),
                      }}
                    >
                      {selected && <i className="bi bi-check2 me-1"></i>}
                      {opt.label}
                    </div>
                  );
                })}
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
              <div className="d-flex justify-content-between align-items-center mb-2">
                <Form.Label className="mb-0">相关附件</Form.Label>
                <small className="text-muted">
                  {formatFileSize(totalAttachmentSize)} / {formatFileSize(MAX_TOTAL_SIZE)}
                </small>
              </div>

              <div className="d-flex gap-2 mb-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <i className="bi bi-paperclip me-1"></i>添加附件
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.dwg"
                  onChange={handleFileSelect}
                  style={{ display: 'none' }}
                />
                <small className="text-muted align-self-center">
                  支持 PDF/Word/Excel/图片/DWG，单文件最大20MB
                </small>
              </div>

              {fileError && (
                <Alert variant="warning" className="py-2" dismissible onClose={() => setFileError('')}>
                  <small>{fileError}</small>
                </Alert>
              )}

              {formData.attachments?.length > 0 && (
                <ListGroup>
                  {formData.attachments.map((file, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center py-2"
                      style={{
                        backgroundColor: colors.inputBg || '#fff',
                        color: colors.text || '#212529'
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <i className={`bi ${getFileIcon(file.name)} me-2`} style={{ fontSize: '1.2em' }}></i>
                        <div>
                          <span>{file.name}</span>
                          <small className="text-muted ms-2">({formatFileSize(file.size)})</small>
                        </div>
                      </div>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                      >
                        <i className="bi bi-x"></i>
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}

              {(!formData.attachments || formData.attachments.length === 0) && (
                <div className="text-muted text-center py-3" style={{ fontSize: '0.9em', border: `1px dashed ${colors.inputBorder || '#ced4da'}`, borderRadius: '6px' }}>
                  <i className="bi bi-cloud-upload d-block mb-1" style={{ fontSize: '1.5em' }}></i>
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
