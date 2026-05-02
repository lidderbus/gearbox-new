// src/components/shaft/ShaftVibrationPanel.js
// P2-3: 轴系三振动校核面板 — 扭振 (已有) + 纵振 + 回旋
//
// 扭振由 TorsionalAnalysis 完整模块承担, 这里聚焦"纵振 + 回旋"两项简化校核

import React, { useState, useCallback, useMemo } from 'react';
import { Card, Row, Col, Form, Button, Alert, Badge, Table, Tabs, Tab } from 'react-bootstrap';
import { analyzeLongitudinalVibration } from '../../utils/longitudinalVibration';
import { analyzeWhirlingVibration } from '../../utils/whirlingVibration';
import { useSelectionResult } from '../../contexts/SelectionResultContext';
import FormulaProvenance from '../common/FormulaProvenance';

const ShaftVibrationPanel = ({ colors = {}, theme = 'light' }) => {
  const { propulsionPayload } = useSelectionResult();

  // 输入参数 (默认值或从 propulsionPayload 取)
  const [shaftDiameter, setShaftDiameter] = useState('150'); // mm
  const [shaftLength, setShaftLength] = useState('5.0');     // m
  const [propellerMass, setPropellerMass] = useState('800'); // kg
  const [bladeCount, setBladeCount] = useState(propulsionPayload?.bladeCount?.toString() || '4');
  const [operatingSpeed, setOperatingSpeed] = useState(
    propulsionPayload?.outputSpeed?.toString() || '300'
  );

  const [longitudinalResult, setLongitudinalResult] = useState(null);
  const [whirlingResult, setWhirlingResult] = useState(null);
  const [error, setError] = useState(null);

  const handleAnalyze = useCallback(() => {
    const params = {
      shaftDiameter_mm: parseFloat(shaftDiameter) || 0,
      shaftLength_m: parseFloat(shaftLength) || 0,
      propellerMass_kg: parseFloat(propellerMass) || 0,
      bladeCount: parseInt(bladeCount) || 4,
      operatingSpeed_rpm: parseFloat(operatingSpeed) || 0,
    };
    const longRes = analyzeLongitudinalVibration(params);
    const whirlRes = analyzeWhirlingVibration(params);
    if (!longRes.success || !whirlRes.success) {
      setError([...(longRes.errors || []), ...(whirlRes.errors || [])].join('; '));
      setLongitudinalResult(null);
      setWhirlingResult(null);
      return;
    }
    setError(null);
    setLongitudinalResult(longRes);
    setWhirlingResult(whirlRes);
  }, [shaftDiameter, shaftLength, propellerMass, bladeCount, operatingSpeed]);

  const overallPass = useMemo(() => {
    if (!longitudinalResult || !whirlingResult) return null;
    return longitudinalResult.pass.overall && whirlingResult.overallPass;
  }, [longitudinalResult, whirlingResult]);

  const cardStyle = { backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' };

  return (
    <Card style={cardStyle} className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <strong><i className="bi bi-activity me-2"></i>轴系三振动校核 (扭振 + 纵振 + 回旋)</strong>
          <Badge bg="primary" className="ms-2">P2-3</Badge>
        </div>
        {overallPass !== null && (
          <Badge bg={overallPass ? 'success' : 'danger'}>
            {overallPass ? '通过' : '存在共振风险'}
          </Badge>
        )}
      </Card.Header>
      <Card.Body>
        {propulsionPayload && (
          <Alert variant="info" className="py-2 mb-3" style={{ fontSize: '0.85em' }}>
            <i className="bi bi-link-45deg me-2"></i>
            已从上游 <strong>{propulsionPayload.source}</strong> 读取桨叶数 / 输出转速;
            扭振校核请前往 "扭振分析" Tab (含 IACS UR M51)。
          </Alert>
        )}

        {/* 输入区 */}
        <Row className="g-2 mb-3">
          <Col md={2}>
            <Form.Group><Form.Label className="small">轴径 (mm)</Form.Label>
              <Form.Control size="sm" type="number" value={shaftDiameter} onChange={e => setShaftDiameter(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group><Form.Label className="small">轴长 (m)</Form.Label>
              <Form.Control size="sm" type="number" step="0.1" value={shaftLength} onChange={e => setShaftLength(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group><Form.Label className="small">桨质量 (kg)</Form.Label>
              <Form.Control size="sm" type="number" value={propellerMass} onChange={e => setPropellerMass(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group><Form.Label className="small">桨叶数 Z</Form.Label>
              <Form.Control size="sm" type="number" value={bladeCount} onChange={e => setBladeCount(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group><Form.Label className="small">桨转速 (rpm)</Form.Label>
              <Form.Control size="sm" type="number" value={operatingSpeed} onChange={e => setOperatingSpeed(e.target.value)} />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <Button size="sm" variant="primary" className="w-100" onClick={handleAnalyze}>
              <i className="bi bi-play-fill me-1"></i>分析
            </Button>
          </Col>
        </Row>

        {error && <Alert variant="danger" className="py-2">{error}</Alert>}

        {/* 结果 */}
        {(longitudinalResult || whirlingResult) && (
          <Tabs defaultActiveKey="longitudinal" className="mb-2">

            <Tab eventKey="longitudinal" title={
              <span>
                <i className="bi bi-arrow-left-right me-1"></i>纵振 (Lewis)
                {longitudinalResult && (
                  <Badge bg={longitudinalResult.pass.overall ? 'success' : 'danger'} className="ms-2">
                    {longitudinalResult.pass.overall ? '通过' : '不通过'}
                  </Badge>
                )}
              </span>
            }>
              {longitudinalResult && (
                <Card body style={cardStyle}>
                  <Row>
                    <Col md={6}>
                      <Table size="sm" borderless className="mb-0">
                        <tbody>
                          <tr><td className="text-muted">等效质量 M_eff</td><td>{longitudinalResult.geometry.effectiveMass_kg} kg</td></tr>
                          <tr><td className="text-muted">轴向刚度 K</td><td>{(longitudinalResult.geometry.axialStiffness_Npm / 1e6).toFixed(2)} MN/m</td></tr>
                          <tr><td className="text-muted">固有频率 f_n</td><td><strong>{longitudinalResult.naturalFrequency_Hz} Hz</strong></td></tr>
                          <tr>
                            <td className="text-muted">纵振临界转速</td>
                            <td>
                              <strong className="text-primary">{longitudinalResult.criticalSpeed_rpm} rpm</strong>
                              <FormulaProvenance
                                title="纵振临界转速"
                                formula={'f_n = (1/2π) × √(K_axial / M_eff)\nK_axial = E·A / L\nM_eff = M_prop·1.10 + M_shaft/3\nn_cr = (f_n × 60) / Z'}
                                standard="Lewis (1963) / BV NR583"
                                section="Lewis: SNAME Trans. (1963)"
                                notes="单自由度模型, 桨水动力虚质量系数 1.10"
                              />
                            </td>
                          </tr>
                          <tr><td className="text-muted">禁区</td><td>{longitudinalResult.forbiddenZone_rpm.min} – {longitudinalResult.forbiddenZone_rpm.max} rpm</td></tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={6}>
                      <Table size="sm" borderless className="mb-0">
                        <tbody>
                          <tr><td className="text-muted">激励频率 f_excite</td><td>{longitudinalResult.excitationFrequency_Hz} Hz</td></tr>
                          <tr><td className="text-muted">速比 n / n_cr</td><td>{longitudinalResult.speedRatio}</td></tr>
                          <tr><td className="text-muted">距临界距离</td><td>{longitudinalResult.distanceFromCritical_pct}%</td></tr>
                          <tr>
                            <td className="text-muted">持续运行</td>
                            <td><Badge bg={longitudinalResult.pass.continuous ? 'success' : 'danger'}>{longitudinalResult.pass.continuous ? '通过 (≥5%)' : '不足'}</Badge></td>
                          </tr>
                          <tr>
                            <td className="text-muted">短时通过</td>
                            <td><Badge bg={longitudinalResult.pass.transient ? 'success' : 'danger'}>{longitudinalResult.pass.transient ? '通过 (≥10%)' : '不足'}</Badge></td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <hr/>
                  <small className="text-muted">{longitudinalResult.notes}</small>
                  <div className="mt-1">
                    {longitudinalResult.references.map((r, i) => (
                      <Badge key={i} bg="light" text="dark" className="me-1" style={{ fontSize: '0.7em' }}>{r}</Badge>
                    ))}
                  </div>
                </Card>
              )}
            </Tab>

            <Tab eventKey="whirling" title={
              <span>
                <i className="bi bi-arrow-clockwise me-1"></i>回旋 (Dunkerley)
                {whirlingResult && (
                  <Badge bg={whirlingResult.overallPass ? 'success' : 'danger'} className="ms-2">
                    {whirlingResult.overallPass ? '通过' : '不通过'}
                  </Badge>
                )}
              </span>
            }>
              {whirlingResult && (
                <Card body style={cardStyle}>
                  <Row>
                    <Col md={6}>
                      <Table size="sm" borderless className="mb-0">
                        <tbody>
                          <tr><td className="text-muted">截面惯性矩 I</td><td>{(whirlingResult.geometry.sectionInertia_m4 * 1e6).toFixed(4)} ×10⁻⁶ m⁴</td></tr>
                          <tr><td className="text-muted">抗弯刚度 K</td><td>{(whirlingResult.geometry.bendingStiffness_Npm / 1e6).toFixed(2)} MN/m</td></tr>
                          <tr><td className="text-muted">梁基阶频率</td><td>{whirlingResult.frequencies.beamOnly_Hz} Hz</td></tr>
                          <tr><td className="text-muted">桨质量频率</td><td>{whirlingResult.frequencies.propOnly_Hz} Hz</td></tr>
                          <tr>
                            <td className="text-muted">合并频率 (Dunkerley)</td>
                            <td>
                              <strong>{whirlingResult.frequencies.combined_Hz} Hz</strong>
                              <FormulaProvenance
                                title="回旋临界 (Dunkerley)"
                                formula={'1/ω_total² = 1/ω_beam² + 1/ω_prop²\nω_beam = (π²/L²) × √(EI / m_distributed)\nω_prop = √(K_bending / M_prop)\nK_bending = 48EI / L³'}
                                standard="《船舶动力装置振动》Ch.5 / DNV-CG-0038"
                                section="DNV-CG-0038 §6.3"
                                notes="未含陀螺效应分裂与轴承油膜非线性,工程估算用"
                              />
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={6}>
                      <Table size="sm" borderless className="mb-0">
                        <thead><tr><th>激励主谐</th><th>临界转速</th><th>禁区</th><th>状态</th></tr></thead>
                        <tbody>
                          {whirlingResult.checks.map((c, i) => (
                            <tr key={i}>
                              <td>{c.mode}</td>
                              <td><strong>{c.criticalRpm}</strong> rpm</td>
                              <td className="text-muted small">{c.forbiddenMin}–{c.forbiddenMax}</td>
                              <td><Badge bg={c.pass ? 'success' : 'danger'}>{c.pass ? '通过' : '禁区'}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                  <hr/>
                  <small className="text-muted">{whirlingResult.notes}</small>
                  <div className="mt-1">
                    {whirlingResult.references.map((r, i) => (
                      <Badge key={i} bg="light" text="dark" className="me-1" style={{ fontSize: '0.7em' }}>{r}</Badge>
                    ))}
                  </div>
                </Card>
              )}
            </Tab>

            <Tab eventKey="torsional" title={<span><i className="bi bi-arrow-repeat me-1"></i>扭振 (跳转)</span>}>
              <Alert variant="info" className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                扭振校核已由独立的 <strong>"扭振计算书 / 扭振分析"</strong> 模块承担,
                包含 Holzer / 传递矩阵 / IACS UR M51 / CCS / DNV / LR 多规范支持。
                <br/>
                <a href="#/torsional" className="btn btn-sm btn-outline-primary mt-2">
                  <i className="bi bi-arrow-right me-1"></i>前往扭振分析
                </a>
              </Alert>
            </Tab>

          </Tabs>
        )}
      </Card.Body>
    </Card>
  );
};

export default ShaftVibrationPanel;
