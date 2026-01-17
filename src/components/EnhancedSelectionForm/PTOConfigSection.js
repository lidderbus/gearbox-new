// src/components/EnhancedSelectionForm/PTOConfigSection.js
// PTO配置区块组件 (增强版)

import React from 'react';
import { Card, Form, Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';

/**
 * PTO应用类型定义 (与selectionAlgorithm.ts保持一致)
 */
const PTO_APPLICATION_TYPES = {
  generator: { label: '轴带发电机', kFactor: 1.0, description: '连续运行，扭矩平稳' },
  hydraulicPump: { label: '液压泵', kFactor: 1.4, description: '中等冲击，周期性负载' },
  firePump: { label: '消防泵', kFactor: 1.6, description: '突发高扭矩，应急启动' },
  bilgePump: { label: '舱底泵', kFactor: 1.3, description: '间歇运行，低冲击' },
  cargoPump: { label: '货油泵', kFactor: 1.5, description: '高粘度介质，启动冲击大' },
  winch: { label: '绞车/绞盘', kFactor: 1.8, description: '冲击载荷大，频繁启停' },
  compressor: { label: '压缩机', kFactor: 1.5, description: '脉动负载，中等冲击' },
  other: { label: '其他', kFactor: 1.4, description: '默认中等工况' }
};

/**
 * PTO配置区块 (增强版)
 * 包含: PTO启用开关、PTO功率、PTO转速、PTO应用类型、工作温度、PTH速比
 */
const PTOConfigSection = ({
  formData,
  errors,
  updateField,
  updatePTO,
  colors = {},
  theme = 'light'
}) => {
  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  const ptoEnabled = formData.pto?.enabled || false;
  const selectedApp = formData.pto?.application || 'other';
  const appConfig = PTO_APPLICATION_TYPES[selectedApp] || PTO_APPLICATION_TYPES.other;

  return (
    <Card
      className="mb-4"
      style={{
        backgroundColor: colors.card || '#fff',
        borderColor: ptoEnabled ? '#28a745' : (colors.border || '#dee2e6'),
        borderWidth: ptoEnabled ? '2px' : '1px'
      }}
    >
      <Card.Header
        style={{
          backgroundColor: ptoEnabled ? '#d4edda' : (colors.headerBg || '#f8f9fa'),
          color: ptoEnabled ? '#155724' : (colors.headerText || '#212529')
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <strong>PTO/PTH配置</strong>
            {ptoEnabled && <Badge bg="success" className="ms-2">已启用</Badge>}
          </span>
        </div>
      </Card.Header>
      <Card.Body>
        <Form.Group className="mb-3">
          <Form.Check
            type="switch"
            id="pto-enabled"
            label="启用PTO功率输出"
            checked={ptoEnabled}
            onChange={(e) => updatePTO('enabled', e.target.checked)}
          />
          <Form.Text className="text-muted">
            PTO (Power Take-Off): 从齿轮箱输出功率驱动消防泵、发电机等设备
          </Form.Text>
        </Form.Group>

        {ptoEnabled && (
          <>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    PTO功率 (kW) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.pto?.power || ''}
                    onChange={(e) => updatePTO('power', e.target.value)}
                    placeholder="例如: 37"
                    isInvalid={!!errors.ptoPower}
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ptoPower}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    PTO转速 (rpm) <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.pto?.speed || ''}
                    onChange={(e) => updatePTO('speed', e.target.value)}
                    placeholder="例如: 2950"
                    isInvalid={!!errors.ptoSpeed}
                    style={inputStyle}
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.ptoSpeed}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    PTO应用类型 <span className="text-danger">*</span>
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>不同应用类型有不同的工况系数(K)，影响离合器选型</Tooltip>}
                    >
                      <i className="bi bi-info-circle ms-1" style={{ cursor: 'pointer', color: '#6c757d' }}></i>
                    </OverlayTrigger>
                  </Form.Label>
                  <Form.Select
                    value={formData.pto?.application || 'other'}
                    onChange={(e) => updatePTO('application', e.target.value)}
                    style={inputStyle}
                  >
                    {Object.entries(PTO_APPLICATION_TYPES).map(([key, config]) => (
                      <option key={key} value={key}>
                        {config.label} (K={config.kFactor})
                      </option>
                    ))}
                  </Form.Select>
                  <Form.Text className="text-muted">
                    {appConfig.description}
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>
                    工作温度 (°C)
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>高温环境需要更高的安全余量，影响温度系数(St)</Tooltip>}
                    >
                      <i className="bi bi-info-circle ms-1" style={{ cursor: 'pointer', color: '#6c757d' }}></i>
                    </OverlayTrigger>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.pto?.temperature || 30}
                    onChange={(e) => updatePTO('temperature', e.target.value)}
                    placeholder="默认: 30"
                    style={inputStyle}
                    min={-10}
                    max={80}
                  />
                  <Form.Text className="text-muted">
                    {formData.pto?.temperature > 40 ? '高温环境，St=1.1~1.3' : '常温环境，St=1.0'}
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>PTO用途备注</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.pto?.purpose || ''}
                    onChange={(e) => updatePTO('purpose', e.target.value)}
                    placeholder="可选，补充说明"
                    style={inputStyle}
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>PTH速比</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.pthRatio || ''}
                    onChange={(e) => updateField('pthRatio', e.target.value)}
                    placeholder="例如: 五"
                    style={inputStyle}
                  />
                  <Form.Text className="text-muted">
                    PTH (Power Take Home): 备用推进速比
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>

            {/* 工况系数说明卡片 */}
            <div
              className="p-2 mb-2"
              style={{
                backgroundColor: theme === 'dark' ? '#2d3748' : '#f8f9fa',
                borderRadius: '4px',
                fontSize: '0.85em'
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <strong>离合器选型参数:</strong>
                </span>
                <Badge bg={appConfig.kFactor >= 1.5 ? 'warning' : 'info'} text={appConfig.kFactor >= 1.5 ? 'dark' : 'white'}>
                  K={appConfig.kFactor}
                </Badge>
              </div>
              <small className="text-muted">
                扭矩计算: T = 9550 × P / n × K × St
              </small>
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default PTOConfigSection;
