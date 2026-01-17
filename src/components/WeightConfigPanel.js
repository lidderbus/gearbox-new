// src/components/WeightConfigPanel.js
/**
 * 评分权重配置面板
 * 允许用户调整选型算法的评分权重
 */

import React, { useState, useCallback } from 'react';
import { Card, Button, Form, Row, Col, ProgressBar, ButtonGroup, Collapse } from 'react-bootstrap';
import { useSelectionConfig } from '../contexts/SelectionConfigContext';
import { getPresetList } from '../config/selectionConfig';

const WEIGHT_LABELS = {
  costEffectiveness: { label: '性价比', color: '#28a745', icon: 'bi-currency-yen' },
  ratioMatch: { label: '速比匹配', color: '#007bff', icon: 'bi-gear' },
  capacityMargin: { label: '能力余量', color: '#fd7e14', icon: 'bi-bar-chart' },
  thrustSatisfy: { label: '推力满足', color: '#6610f2', icon: 'bi-arrow-right-circle' },
  specialPackage: { label: '特价优惠', color: '#dc3545', icon: 'bi-tag' }
};

const WeightConfigPanel = ({ colors = {}, compact = false }) => {
  const {
    weights,
    activePreset,
    showAdvancedWeights,
    setWeights,
    setPreset,
    toggleAdvancedWeights,
    weightsValid,
    validationErrors
  } = useSelectionConfig();

  const [tempWeights, setTempWeights] = useState({ ...weights });

  // 预设配置列表
  const presets = getPresetList();

  // 处理预设选择
  const handlePresetSelect = useCallback((presetId) => {
    setPreset(presetId);
  }, [setPreset]);

  // 处理单个权重调整
  const handleWeightChange = useCallback((key, value) => {
    const numValue = Math.max(0, Math.min(100, parseInt(value) || 0));
    const newWeights = { ...tempWeights, [key]: numValue };
    setTempWeights(newWeights);
  }, [tempWeights]);

  // 应用自定义权重
  const applyCustomWeights = useCallback(() => {
    setWeights(tempWeights);
  }, [tempWeights, setWeights]);

  // 权重总和
  const totalWeight = Object.values(tempWeights).reduce((sum, v) => sum + v, 0);

  // 紧凑模式只显示预设按钮
  if (compact) {
    return (
      <div className="weight-config-compact mb-3">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted small">评分模式:</span>
          <ButtonGroup size="sm">
            {presets.slice(0, 4).map(preset => (
              <Button
                key={preset.id}
                variant={activePreset === preset.id ? 'primary' : 'outline-secondary'}
                onClick={() => handlePresetSelect(preset.id)}
                title={preset.description}
              >
                {preset.label}
              </Button>
            ))}
          </ButtonGroup>
        </div>
      </div>
    );
  }

  return (
    <Card className="weight-config-panel mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header
        style={{
          backgroundColor: colors.headerBg,
          color: colors.headerText,
          borderBottomColor: colors.border,
          cursor: 'pointer'
        }}
        onClick={toggleAdvancedWeights}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-sliders me-2"></i>
            评分权重配置
          </span>
          <i className={`bi bi-chevron-${showAdvancedWeights ? 'up' : 'down'}`}></i>
        </div>
      </Card.Header>

      <Collapse in={showAdvancedWeights}>
        <Card.Body>
          {/* 预设选择 */}
          <div className="preset-selection mb-4">
            <Form.Label className="small text-muted">快速预设</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {presets.map(preset => (
                <Button
                  key={preset.id}
                  variant={activePreset === preset.id ? 'primary' : 'outline-secondary'}
                  size="sm"
                  onClick={() => handlePresetSelect(preset.id)}
                  title={preset.description}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
            {activePreset !== 'custom' && (
              <div className="preset-description small text-muted mt-2">
                {presets.find(p => p.id === activePreset)?.description}
              </div>
            )}
          </div>

          {/* 权重可视化 */}
          <div className="weight-visualization mb-4">
            <Form.Label className="small text-muted">当前权重分布</Form.Label>
            <ProgressBar style={{ height: '24px' }}>
              {Object.entries(weights).map(([key, value]) => (
                <ProgressBar
                  key={key}
                  now={value}
                  label={value >= 10 ? `${WEIGHT_LABELS[key].label} ${value}` : ''}
                  style={{ backgroundColor: WEIGHT_LABELS[key].color }}
                />
              ))}
            </ProgressBar>
            <div className="d-flex justify-content-between mt-1 small">
              {Object.entries(WEIGHT_LABELS).map(([key, config]) => (
                <span key={key} style={{ color: config.color }}>
                  <i className={`bi ${config.icon} me-1`}></i>
                  {weights[key]}
                </span>
              ))}
            </div>
          </div>

          {/* 详细权重调整 */}
          <div className="weight-sliders">
            <Form.Label className="small text-muted">自定义权重 (总和应为100)</Form.Label>
            <Row className="g-2">
              {Object.entries(WEIGHT_LABELS).map(([key, config]) => (
                <Col md={6} lg={4} key={key}>
                  <Form.Group className="mb-2">
                    <div className="d-flex justify-content-between">
                      <Form.Label className="small" style={{ color: config.color }}>
                        <i className={`bi ${config.icon} me-1`}></i>
                        {config.label}
                      </Form.Label>
                      <span className="small">{tempWeights[key]}</span>
                    </div>
                    <Form.Range
                      min={0}
                      max={60}
                      value={tempWeights[key]}
                      onChange={(e) => handleWeightChange(key, e.target.value)}
                      style={{ accentColor: config.color }}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            {/* 权重总和提示 */}
            <div className={`total-weight mt-2 small ${totalWeight === 100 ? 'text-success' : 'text-warning'}`}>
              <i className={`bi ${totalWeight === 100 ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-1`}></i>
              当前总和: {totalWeight} {totalWeight !== 100 && '(将自动归一化到100)'}
            </div>

            {/* 应用按钮 */}
            <div className="d-flex justify-content-end mt-3">
              <Button
                variant="primary"
                size="sm"
                onClick={applyCustomWeights}
                disabled={activePreset === 'custom' && JSON.stringify(weights) === JSON.stringify(tempWeights)}
              >
                应用自定义权重
              </Button>
            </div>

            {/* 验证错误 */}
            {!weightsValid && validationErrors.length > 0 && (
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
        </Card.Body>
      </Collapse>
    </Card>
  );
};

export default WeightConfigPanel;
