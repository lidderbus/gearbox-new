// src/components/EnhancedSelectionForm/ClassificationSection.js
// 船检要求区块组件

import React from 'react';
import { Card, Form, Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FORM_OPTIONS } from './useEnhancedSelectionForm';

const HelpTip = ({ text }) => (
  <OverlayTrigger placement="top" overlay={<Tooltip>{text}</Tooltip>}>
    <i className="bi bi-info-circle ms-1" style={{ cursor: 'pointer', color: '#6c757d', fontSize: '0.85em' }}></i>
  </OverlayTrigger>
);

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
              <Form.Label>船检类型 <HelpTip text="国内船检遵循中国海事法规(CCS/ZY)，国外船检遵循IMO标准或船旗国法规(LR/DNV/BV/ABS等)" /></Form.Label>
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
              <Form.Label>船检机构 <HelpTip text="选择具有法律资格的船级社。机构的证书等级决定船舶的可保性和市场准入。杭齿主要产品已获CCS/DNV/LR/ABS等多家认证" /></Form.Label>
              <Form.Select
                value={classification.society || (classificationType === '国内' ? 'CCS' : 'LR')}
                onChange={(e) => updateClassification('society', e.target.value)}
                style={inputStyle}
              >
                {societyOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
              {/* Copilot 对齐: 严格船级社硬筛 toggle, 默认关 */}
              <Form.Check
                className="mt-2"
                type="switch"
                id="strict-classification-switch"
                label={
                  <span style={{ fontSize: '0.85em' }}>
                    严格船级社匹配 (硬筛, 仅返回含 {classification.society || 'CCS'} 证书的型号)
                    <HelpTip text="默认关闭, 船级社仅作偏好评分。开启后不含此证书的齿轮箱被直接排除, 与 Copilot 行为一致。注: LR/ABS/KR/NK/RINA 当前数据覆盖率为 0, 选这些时硬筛将返回空" />
                  </span>
                }
                checked={!!formData.strictClassification}
                onChange={(e) => updateField('strictClassification', e.target.checked)}
              />
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
