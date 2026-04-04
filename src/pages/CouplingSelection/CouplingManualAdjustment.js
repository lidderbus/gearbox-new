// src/pages/CouplingSelection/CouplingManualAdjustment.js
// 联轴器手动调整面板

import React, { useState, useMemo } from 'react';
import { Card, Form, Button, Row, Col, InputGroup, Badge } from 'react-bootstrap';
import { getAllCouplings } from '../../services/couplingSelectionService';

const CouplingManualAdjustment = ({
  selectionResult,
  currentParams,
  onRecalculate,
  colors = {}
}) => {
  const [collapsed, setCollapsed] = useState(true);
  const [manualTorque, setManualTorque] = useState('');
  const [manualModel, setManualModel] = useState('');
  const [manualK, setManualK] = useState('');
  const [marginPercent, setMarginPercent] = useState(15);

  const allCouplings = useMemo(() => {
    const couplings = getAllCouplings();
    return couplings.sort((a, b) => (a.torque || 0) - (b.torque || 0));
  }, []);

  const kModeHint = currentParams?.workFactorMode === 'JB_CCS'
    ? 'CCS标准: I类1.3, II类1.75, III类2.5, IV类2.75, V类3.0'
    : '厂家标准: I类1.0, II类1.2, III类1.4, IV类1.6, V类1.8';

  const handleApplyTorque = () => {
    if (!manualTorque || !onRecalculate) return;
    onRecalculate({ ...currentParams, overrideTorque: parseFloat(manualTorque) });
  };

  const handleApplyModel = () => {
    if (!manualModel || !onRecalculate) return;
    onRecalculate({ ...currentParams, forceModel: manualModel });
  };

  const handleRecalculate = () => {
    if (!onRecalculate) return;
    const params = { ...currentParams };
    if (manualK) params.overrideK = parseFloat(manualK);
    if (marginPercent !== 15) params.marginPercent = marginPercent;
    onRecalculate(params);
  };

  if (!selectionResult) return null;

  return (
    <Card className="shadow-sm mb-3" style={{ backgroundColor: colors.card || 'white' }}>
      <Card.Header
        style={{ backgroundColor: '#fff3cd', cursor: 'pointer' }}
        onClick={() => setCollapsed(!collapsed)}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-wrench me-2"></i>
            <strong>人工调整选择</strong>
          </span>
          <i className={`bi bi-chevron-${collapsed ? 'down' : 'up'}`}></i>
        </div>
      </Card.Header>
      {!collapsed && (
        <Card.Body>
          {/* 手动扭矩 */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">手动指定所需扭矩 (kN·m)</Form.Label>
            <InputGroup size="sm">
              <Form.Control
                type="number"
                step="0.1"
                min="0"
                placeholder={`当前计算值: ${selectionResult.requiredCouplingTorque?.toFixed(3) || ''}`}
                value={manualTorque}
                onChange={(e) => setManualTorque(e.target.value)}
              />
              <Button variant="primary" onClick={handleApplyTorque} disabled={!manualTorque}>
                应用
              </Button>
            </InputGroup>
          </Form.Group>

          {/* 手动选择型号 */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">手动选择联轴器型号</Form.Label>
            <InputGroup size="sm">
              <Form.Select value={manualModel} onChange={(e) => setManualModel(e.target.value)}>
                <option value="">-- 从所有型号选择 --</option>
                {allCouplings.map(c => (
                  <option key={c.model} value={c.model}>
                    {c.model} ({c.torque?.toFixed(2)} kN·m, {c.maxSpeed} rpm)
                  </option>
                ))}
              </Form.Select>
              <Button variant="primary" onClick={handleApplyModel} disabled={!manualModel}>
                应用
              </Button>
            </InputGroup>
          </Form.Group>

          {/* 调整K值 */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold">调整工况系数 K</Form.Label>
            <Row>
              <Col xs={5}>
                <Form.Control
                  size="sm"
                  type="number"
                  step="0.1"
                  min="1.0"
                  max="3.0"
                  placeholder="自动"
                  value={manualK}
                  onChange={(e) => setManualK(e.target.value)}
                />
              </Col>
              <Col xs={7}>
                <Form.Text className="text-muted" style={{ fontSize: '0.75rem' }}>
                  {kModeHint}
                </Form.Text>
              </Col>
            </Row>
          </Form.Group>

          {/* 余量滑块 */}
          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold d-flex justify-content-between">
              <span>期望扭矩余量 (%)</span>
              <Badge bg="info">{marginPercent}%</Badge>
            </Form.Label>
            <Form.Range
              min={0}
              max={50}
              value={marginPercent}
              onChange={(e) => setMarginPercent(parseInt(e.target.value))}
            />
            <div className="d-flex justify-content-between" style={{ fontSize: '0.7rem' }}>
              <span className="text-danger">0% 最小</span>
              <span className="text-success">10-30% 最佳</span>
              <span className="text-warning">50% 充裕</span>
            </div>
          </Form.Group>

          <Button variant="warning" size="sm" className="w-100" onClick={handleRecalculate}>
            <i className="bi bi-arrow-repeat me-1"></i>
            按调整参数重新计算
          </Button>
        </Card.Body>
      )}
    </Card>
  );
};

export default CouplingManualAdjustment;
