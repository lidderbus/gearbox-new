// src/components/ToleranceConfigPanel.js
/**
 * 容差配置面板
 * 允许用户选择应用场景和调整匹配容差
 */

import React, { useState, useCallback } from 'react';
import { Card, Button, Form, Row, Col, Badge, ButtonGroup, Collapse } from 'react-bootstrap';
import { useSelectionConfig } from '../contexts/SelectionConfigContext';
import { getApplicationList } from '../config/selectionConfig';

const APPLICATION_ICONS = {
  propulsion: 'bi-speedometer2',
  auxiliary: 'bi-gear-wide-connected',
  special: 'bi-tsunami',
  highSpeed: 'bi-lightning',
  workboat: 'bi-truck',
  hybrid: 'bi-battery-charging'
};

const ToleranceConfigPanel = ({ colors = {}, compact = false }) => {
  const {
    tolerances,
    activeApplication,
    useAdaptiveTolerances,
    showAdvancedTolerances,
    setTolerances,
    setApplication,
    setAdaptiveMode,
    toggleAdvancedTolerances,
    tolerancesValid,
    validationErrors
  } = useSelectionConfig();

  const [tempTolerances, setTempTolerances] = useState({ ...tolerances });

  // 应用场景列表
  const applications = getApplicationList();

  // 处理应用场景选择
  const handleApplicationSelect = useCallback((appId) => {
    setApplication(appId);
  }, [setApplication]);

  // 处理单个容差调整
  const handleToleranceChange = useCallback((key, value) => {
    const numValue = Math.max(0, parseInt(value) || 0);
    const newTolerances = { ...tempTolerances, [key]: numValue };
    setTempTolerances(newTolerances);
  }, [tempTolerances]);

  // 应用自定义容差
  const applyCustomTolerances = useCallback(() => {
    setTolerances(tempTolerances);
  }, [tempTolerances, setTolerances]);

  // 紧凑模式只显示应用场景按钮
  if (compact) {
    return (
      <div className="tolerance-config-compact mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">应用场景:</span>
          <ButtonGroup size="sm">
            {applications.slice(0, 4).map(app => (
              <Button
                key={app.id}
                variant={activeApplication === app.id ? 'success' : 'outline-secondary'}
                onClick={() => handleApplicationSelect(app.id)}
                title={app.description}
              >
                <i className={`bi ${APPLICATION_ICONS[app.id]} me-1`}></i>
                {app.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
    );
  }

  return (
    <Card className="tolerance-config-panel mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header
        style={{
          backgroundColor: colors.headerBg,
          color: colors.headerText,
          borderBottomColor: colors.border,
          cursor: 'pointer'
        }}
        onClick={toggleAdvancedTolerances}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-rulers me-2"></i>
            匹配容差配置
          </span>
          <i className={`bi bi-chevron-${showAdvancedTolerances ? 'up' : 'down'}`}></i>
        </div>
      </Card.Header>

      <Collapse in={showAdvancedTolerances}>
        <Card.Body>
          {/* 应用场景选择 */}
          <div className="application-selection mb-4">
            <Form.Label className="small text-muted">应用场景预设</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {applications.map(app => (
                <Button
                  key={app.id}
                  variant={activeApplication === app.id ? 'success' : 'outline-secondary'}
                  size="sm"
                  onClick={() => handleApplicationSelect(app.id)}
                  title={app.description}
                  className="d-flex align-items-center"
                >
                  <i className={`bi ${APPLICATION_ICONS[app.id]} me-1`}></i>
                  {app.label}
                </Button>
              ))}
            </div>
            {activeApplication !== 'custom' && (
              <div className="application-description small text-muted mt-2">
                <i className="bi bi-info-circle me-1"></i>
                {applications.find(a => a.id === activeApplication)?.description}
              </div>
            )}
          </div>

          {/* 自适应容差开关 */}
          <div className="adaptive-mode mb-4">
            <Form.Check
              type="switch"
              id="adaptive-tolerances"
              label={
                <span>
                  <i className="bi bi-magic me-1"></i>
                  自适应容差调整
                  <Badge bg="info" className="ms-2">推荐</Badge>
                </span>
              }
              checked={useAdaptiveTolerances}
              onChange={(e) => setAdaptiveMode(e.target.checked)}
            />
            <div className="small text-muted mt-1">
              根据输入参数（功率、转速、速比）自动微调容差范围
            </div>
          </div>

          {/* 当前容差显示 */}
          <div className="current-tolerances mb-4">
            <Form.Label className="small text-muted">当前容差设置</Form.Label>
            <Row className="g-2">
              <Col md={4}>
                <div className="tolerance-card p-2 border rounded text-center">
                  <div className="small text-muted">速比容差</div>
                  <div className="h5 mb-0 text-primary">
                    ±{tolerances.maxRatioDiffPercent}%
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="tolerance-card p-2 border rounded text-center">
                  <div className="small text-muted">最大余量</div>
                  <div className="h5 mb-0 text-warning">
                    {tolerances.maxCapacityMargin}%
                  </div>
                </div>
              </Col>
              <Col md={4}>
                <div className="tolerance-card p-2 border rounded text-center">
                  <div className="small text-muted">最小余量</div>
                  <div className="h5 mb-0 text-success">
                    {tolerances.minCapacityMargin}%
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          {/* 详细容差调整 */}
          <div className="tolerance-sliders">
            <Form.Label className="small text-muted">自定义容差</Form.Label>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between">
                <Form.Label className="small">
                  <i className="bi bi-percent me-1"></i>
                  速比容差 (%)
                </Form.Label>
                <span className="small">{tempTolerances.maxRatioDiffPercent}%</span>
              </div>
              <Form.Range
                min={5}
                max={50}
                value={tempTolerances.maxRatioDiffPercent}
                onChange={(e) => handleToleranceChange('maxRatioDiffPercent', e.target.value)}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>严格 5%</span>
                <span>宽松 50%</span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between">
                <Form.Label className="small">
                  <i className="bi bi-arrow-up-circle me-1"></i>
                  最大余量 (%)
                </Form.Label>
                <span className="small">{tempTolerances.maxCapacityMargin}%</span>
              </div>
              <Form.Range
                min={20}
                max={200}
                step={10}
                value={tempTolerances.maxCapacityMargin}
                onChange={(e) => handleToleranceChange('maxCapacityMargin', e.target.value)}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>紧凑 20%</span>
                <span>宽裕 200%</span>
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <div className="d-flex justify-content-between">
                <Form.Label className="small">
                  <i className="bi bi-arrow-down-circle me-1"></i>
                  最小余量 (%)
                </Form.Label>
                <span className="small">{tempTolerances.minCapacityMargin}%</span>
              </div>
              <Form.Range
                min={0}
                max={30}
                value={tempTolerances.minCapacityMargin}
                onChange={(e) => handleToleranceChange('minCapacityMargin', e.target.value)}
              />
              <div className="d-flex justify-content-between small text-muted">
                <span>无要求 0%</span>
                <span>高要求 30%</span>
              </div>
            </Form.Group>

            {/* 容差有效性检查 */}
            {tempTolerances.minCapacityMargin > tempTolerances.maxCapacityMargin && (
              <div className="alert alert-warning small py-2">
                <i className="bi bi-exclamation-triangle me-1"></i>
                最小余量不能大于最大余量
              </div>
            )}

            {/* 应用按钮 */}
            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="success"
                size="sm"
                onClick={applyCustomTolerances}
                disabled={
                  tempTolerances.minCapacityMargin > tempTolerances.maxCapacityMargin ||
                  (activeApplication === 'custom' && JSON.stringify(tolerances) === JSON.stringify(tempTolerances))
                }
              >
                应用自定义容差
              </Button>
            </div>

            {/* 验证错误 */}
            {!tolerancesValid && validationErrors.length > 0 && (
              <div className="validation-errors mt-2">
                {validationErrors.map((error, idx) => (
                  <div key={idx} className="small text-danger">
                    <i className="bi bi-x-circle me-1"></i>
                    {error}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 应用场景说明表 */}
          <div className="application-reference mt-4">
            <details>
              <summary className="small text-muted" style={{ cursor: 'pointer' }}>
                <i className="bi bi-table me-1"></i>
                应用场景参考表
              </summary>
              <table className="table table-sm table-bordered mt-2 small">
                <thead>
                  <tr>
                    <th>场景</th>
                    <th>速比容差</th>
                    <th>最大余量</th>
                    <th>最小余量</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map(app => (
                    <tr key={app.id} className={activeApplication === app.id ? 'table-active' : ''}>
                      <td>
                        <i className={`bi ${APPLICATION_ICONS[app.id]} me-1`}></i>
                        {app.label}
                      </td>
                      <td>{app.tolerances.maxRatioDiffPercent}%</td>
                      <td>{app.tolerances.maxCapacityMargin}%</td>
                      <td>{app.tolerances.minCapacityMargin}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </details>
          </div>
        </Card.Body>
      </Collapse>
    </Card>
  );
};

export default ToleranceConfigPanel;
