// src/components/common/WeightAdjusterPanel.js
// 评分权重透明化面板 — 显示当前模式各维度权重，并允许"高级用户"覆盖
// 不直接驱动选型重算，由父组件通过 onApplyWeights 回调接管

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Button, Row, Col, OverlayTrigger, Tooltip, Badge, Collapse } from 'react-bootstrap';
import {
  SCORING_DIMENSION_LABELS,
  SCORING_DIMENSION_DESCRIPTIONS,
  SCORING_MODE_LABELS
} from '../../data/gearboxMatchingMaps';

/**
 * @param {Object} props
 * @param {Object} props.weights         当前模式的默认权重 { torqueMargin, recommendation, speedMargin, price, weight }
 * @param {string} [props.mode]          当前模式名（用于显示标签）
 * @param {Function} [props.onApplyWeights] 应用按钮回调 (overrideWeights => void)
 * @param {boolean} [props.defaultExpanded=false]
 */
const WeightAdjusterPanel = ({
  weights,
  mode = 'BALANCED',
  onApplyWeights,
  defaultExpanded = false
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [override, setOverride] = useState({ ...weights });

  useEffect(() => {
    setOverride({ ...weights });
  }, [weights]);

  const total = Object.values(override).reduce((s, v) => s + (Number(v) || 0), 0);

  const handleSlider = useCallback((dim, value) => {
    setOverride(prev => ({ ...prev, [dim]: Number(value) }));
  }, []);

  const handleReset = useCallback(() => {
    setOverride({ ...weights });
  }, [weights]);

  const handleApply = useCallback(() => {
    if (!onApplyWeights) return;
    // 归一化到 100
    const norm = {};
    Object.entries(override).forEach(([k, v]) => {
      norm[k] = total > 0 ? Math.round((Number(v) / total) * 100) : 0;
    });
    onApplyWeights(norm);
  }, [override, total, onApplyWeights]);

  if (!weights) return null;

  return (
    <Card className="mb-3 border-0" style={{ backgroundColor: 'rgba(13, 110, 253, 0.04)' }}>
      <Card.Body className="py-2">
        <div className="d-flex align-items-center" style={{ cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
          <i className={`bi ${expanded ? 'bi-chevron-down' : 'bi-chevron-right'} me-2`}></i>
          <strong>评分权重透明面板</strong>
          <Badge bg="info" className="ms-2">
            模式: {SCORING_MODE_LABELS[mode] || mode}
          </Badge>
          <small className="text-muted ms-auto">
            点击{expanded ? '折叠' : '展开'}查看权重详情 · 高级用户可调整
          </small>
        </div>

        <Collapse in={expanded}>
          <div className="mt-3">
            {/* 权重展示 + 滑块 */}
            <Row className="g-2">
              {Object.keys(weights).map(dim => (
                <Col xs={12} md={6} key={dim}>
                  <Form.Group className="mb-2">
                    <Form.Label className="d-flex align-items-center small mb-1">
                      <span className="me-2">{SCORING_DIMENSION_LABELS[dim] || dim}</span>
                      <OverlayTrigger
                        placement="top"
                        overlay={
                          <Tooltip>{SCORING_DIMENSION_DESCRIPTIONS[dim] || dim}</Tooltip>
                        }
                      >
                        <i className="bi bi-info-circle text-muted" style={{ cursor: 'help' }}></i>
                      </OverlayTrigger>
                      <strong className="ms-auto text-primary">{override[dim]}%</strong>
                    </Form.Label>
                    <Form.Range
                      min={0}
                      max={60}
                      step={5}
                      value={override[dim]}
                      onChange={(e) => handleSlider(dim, e.target.value)}
                    />
                  </Form.Group>
                </Col>
              ))}
            </Row>

            <div className="d-flex align-items-center justify-content-between mt-2">
              <small className={total === 100 ? 'text-success' : 'text-warning'}>
                当前合计: <strong>{total}%</strong>
                {total !== 100 && (
                  <span className="ms-2 text-muted">
                    (应用时将按比例归一化到 100%)
                  </span>
                )}
              </small>
              <div>
                <Button variant="outline-secondary" size="sm" onClick={handleReset} className="me-2">
                  恢复默认
                </Button>
                <Button variant="primary" size="sm" onClick={handleApply} disabled={!onApplyWeights}>
                  <i className="bi bi-arrow-clockwise me-1"></i>应用并重排
                </Button>
              </div>
            </div>
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

export default WeightAdjusterPanel;
