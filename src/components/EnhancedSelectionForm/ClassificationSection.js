// src/components/EnhancedSelectionForm/ClassificationSection.js
// 船检要求区块组件

import React from 'react';
import { Card, Form, Row, Col, Badge } from 'react-bootstrap';
import { FORM_OPTIONS } from './useEnhancedSelectionForm';

/**
 * 船检要求区块
 * 包含: 船检类型(国内/国外)、船检机构、所需证书
 */
const ClassificationSection = ({
  formData,
  errors,
  updateField,
  updateClassification,
  colors = {},
  theme = 'light'
}) => {
  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  const classification = formData.classification || { type: '国内', society: 'CCS', certificates: [] };
  const classificationType = classification.type || '国内';

  // 根据船检类型获取可选机构
  const societyOptions = classificationType === '国内'
    ? FORM_OPTIONS.classificationSociety.domestic
    : FORM_OPTIONS.classificationSociety.foreign;

  // 切换证书选择
  const toggleCertificate = (cert) => {
    const currentCerts = classification.certificates || [];
    const isSelected = currentCerts.includes(cert);
    const newCerts = isSelected
      ? currentCerts.filter(c => c !== cert)
      : [...currentCerts, cert];
    updateClassification('certificates', newCerts);
  };

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa', color: colors.headerText || '#212529' }}>
        <strong>船检要求</strong>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>船检类型</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="class-domestic"
                  label="国内船检"
                  name="classificationType"
                  checked={classificationType === '国内'}
                  onChange={() => {
                    updateClassification('type', '国内');
                    // 切换类型时重置船检机构
                    updateClassification('society', 'CCS');
                  }}
                />
                <Form.Check
                  inline
                  type="radio"
                  id="class-foreign"
                  label="国外船检"
                  name="classificationType"
                  checked={classificationType === '国外'}
                  onChange={() => {
                    updateClassification('type', '国外');
                    // 切换类型时重置船检机构
                    updateClassification('society', 'LR');
                  }}
                />
              </div>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>船检机构</Form.Label>
              <Form.Select
                value={classification.society || (classificationType === '国内' ? 'CCS' : 'LR')}
                onChange={(e) => updateClassification('society', e.target.value)}
                style={inputStyle}
              >
                {societyOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>所需证书</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {FORM_OPTIONS.certificates.map(cert => (
                  <Badge
                    key={cert.value}
                    bg={classification.certificates?.includes(cert.value) ? 'primary' : 'secondary'}
                    style={{
                      cursor: 'pointer',
                      fontSize: '0.9em',
                      padding: '8px 12px'
                    }}
                    onClick={() => toggleCertificate(cert.value)}
                  >
                    {classification.certificates?.includes(cert.value) ? '✓ ' : ''}{cert.label}
                  </Badge>
                ))}
              </div>
              <Form.Text className="text-muted">
                点击选择需要的证书类型
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        {/* 船检机构说明 */}
        <div
          className="p-2 mt-2"
          style={{
            backgroundColor: theme === 'dark' ? '#2d3748' : '#f8f9fa',
            borderRadius: '4px',
            fontSize: '0.85em'
          }}
        >
          <small className="text-muted">
            {classificationType === '国内' ? (
              <>
                <strong>CCS:</strong> 中国船级社 | <strong>ZY:</strong> 中国渔业船舶检验局
              </>
            ) : (
              <>
                <strong>LR:</strong> 英国劳氏 | <strong>DNV:</strong> 挪威船级社 |
                <strong>BV:</strong> 法国船级社 | <strong>ABS:</strong> 美国船级社 |
                <strong>NK:</strong> 日本船级社 | <strong>KR:</strong> 韩国船级社
              </>
            )}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ClassificationSection;
