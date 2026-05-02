// src/components/propulsion/PropulsionMatchingHub.js
// P1-1: 推进系统级匹配 Hub — 输入船型/排水量/航速/吃水, 联动推荐 桨直径/盘面比/减速比/桨型/齿轮箱

import React, { useState, useCallback, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Badge, Table, ListGroup } from 'react-bootstrap';
import { solveSystemMatch, VESSEL_TYPES } from '../../utils/propulsionMatchingSolver';
import { useSelectionResult } from '../../contexts/SelectionResultContext';
import FormulaProvenance from '../common/FormulaProvenance';
import AlgorithmReferenceCard from './AlgorithmReferenceCard';

const PropulsionMatchingHub = ({ colors = {}, theme = 'light' }) => {
  const { setPropulsionPayload } = useSelectionResult();

  // 输入参数
  const [vesselType, setVesselType] = useState('cargo');
  const [displacement, setDisplacement] = useState('5000');
  const [speed, setSpeed] = useState('12');
  const [draft, setDraft] = useState('5.5');
  const [engineSpeed, setEngineSpeed] = useState('1500');
  const [engineCount, setEngineCount] = useState('1');

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSolve = useCallback(() => {
    const out = solveSystemMatch({
      vesselType,
      displacement: parseFloat(displacement) || 0,
      speed: parseFloat(speed) || 0,
      draft: parseFloat(draft) || 0,
      engineSpeed: parseFloat(engineSpeed) || 1500,
      engineCount: parseInt(engineCount) || 1,
    });
    if (out.success) {
      setResult(out);
      setError(null);
    } else {
      setError(out.error);
      setResult(null);
    }
  }, [vesselType, displacement, speed, draft, engineSpeed, engineCount]);

  const handleApplyToCpp = useCallback(() => {
    if (!result || !result.success) return;
    // 写入推进载荷, CPP/Shaft/Torsional 自动读取
    try {
      setPropulsionPayload({
        source: 'PropulsionHub',
        timestamp: new Date().toISOString(),
        power: result.power.perEngine_kW,
        inputSpeed: parseFloat(engineSpeed) || 1500,
        outputSpeed: result.gearbox.propellerSpeed_rpm,
        ratio: result.gearbox.targetRatio,
        propellerDiameter: result.propeller.diameter_m,
        bladeCount: result.propeller.bladeCount,
        series: result.propeller.series,
        thrust: result.propeller.estimatedThrust_kN,
      });
      window.alert(`Hub 求解结果已写入推进载荷,可在 CPP / 轴系设计 / 扭振分析 自动加载`);
    } catch (e) { /* ignore */ }
  }, [result, setPropulsionPayload, engineSpeed]);

  const vesselOptions = useMemo(() => Object.entries(VESSEL_TYPES).map(([k, v]) => ({ key: k, label: v.label })), []);

  const cardStyle = { backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' };

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h5><i className="bi bi-diagram-3 me-2"></i>推进系统级匹配 Hub
            <Badge bg="primary" className="ms-2">P1-1</Badge>
          </h5>
          <small className="text-muted">输入船型 / 排水量 / 航速 / 吃水, 一次求解 桨直径 + 盘面比 + 减速比 + 桨型 + 齿轮箱</small>
        </Col>
      </Row>

      <AlgorithmReferenceCard module="propulsion-hub" colors={colors} />

      <Row>
        <Col md={4}>
          <Card style={cardStyle} className="mb-3">
            <Card.Header>船舶参数输入</Card.Header>
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label className="small">船型</Form.Label>
                <Form.Select value={vesselType} onChange={e => setVesselType(e.target.value)} size="sm">
                  {vesselOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">排水量 Δ (吨)</Form.Label>
                <Form.Control type="number" size="sm" value={displacement} onChange={e => setDisplacement(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">设计航速 Vs (节)</Form.Label>
                <Form.Control type="number" size="sm" value={speed} onChange={e => setSpeed(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">设计吃水 T (m)</Form.Label>
                <Form.Control type="number" size="sm" value={draft} onChange={e => setDraft(e.target.value)} step="0.1" />
              </Form.Group>
              <Row>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">主机转速 (rpm)</Form.Label>
                    <Form.Control type="number" size="sm" value={engineSpeed} onChange={e => setEngineSpeed(e.target.value)} />
                  </Form.Group>
                </Col>
                <Col>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">主机数</Form.Label>
                    <Form.Control type="number" size="sm" value={engineCount} onChange={e => setEngineCount(e.target.value)} min="1" max="4" />
                  </Form.Group>
                </Col>
              </Row>
              <Button variant="primary" size="sm" className="w-100 mt-2" onClick={handleSolve}>
                <i className="bi bi-calculator me-1"></i>系统级求解
              </Button>
              {error && <Alert variant="danger" className="py-2 mt-2 mb-0 small">{error}</Alert>}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          {!result ? (
            <Card style={cardStyle}>
              <Card.Body className="text-center text-muted py-5">
                <i className="bi bi-arrow-left-circle d-block" style={{ fontSize: '2.5rem', opacity: 0.4 }}></i>
                <div className="mt-2">输入船舶参数后点击"系统级求解"查看推进系统建议</div>
              </Card.Body>
            </Card>
          ) : (
            <>
              <Card style={cardStyle} className="mb-3">
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <span><i className="bi bi-check2-circle me-2 text-success"></i>系统级匹配结果</span>
                  <Button variant="outline-primary" size="sm" onClick={handleApplyToCpp}>
                    <i className="bi bi-link-45deg me-1"></i>应用到 CPP/轴系/扭振
                  </Button>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Table size="sm" borderless className="mb-0">
                        <tbody>
                          <tr>
                            <td className="text-muted">推进总功率 PB</td>
                            <td><strong>{result.power.total_kW} kW</strong> ({result.input.engineCount} 台 × {result.power.perEngine_kW} kW)
                              <FormulaProvenance
                                title="海军部系数法"
                                formula={'PB = Δ^(2/3) × Vs³ / Cn\n' + `当前 Cn = ${result.power.Cn} (${result.input.vesselType})`}
                                standard="PNA Vol II / 《船舶原理》"
                                section="§3.1 / §8.3"
                                notes="工程估算精度, 需结合阻力曲线和螺旋桨敞水曲线复核"
                              />
                            </td>
                          </tr>
                          <tr><td className="text-muted">桨直径 D</td><td><strong>{result.propeller.diameter_m} m</strong> (上限 {result.propeller.maxAllowed_m} m)</td></tr>
                          <tr><td className="text-muted">桨叶数 Z</td><td>{result.propeller.bladeCount}</td></tr>
                          <tr><td className="text-muted">盘面比 Ae/A0</td><td>{result.propeller.areaRatio}</td></tr>
                          <tr><td className="text-muted">桨距比 P/D</td><td>{result.propeller.pitchRatio}</td></tr>
                          <tr>
                            <td className="text-muted">推荐桨型</td>
                            <td>
                              <Badge bg={result.propeller.series === 'KA_19A' ? 'warning' : 'info'} text={result.propeller.series === 'KA_19A' ? 'dark' : undefined}>
                                {result.propeller.seriesName}
                              </Badge>
                            </td>
                          </tr>
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={6}>
                      <Table size="sm" borderless className="mb-0">
                        <tbody>
                          <tr><td className="text-muted">桨工作转速</td><td><strong>{result.gearbox.propellerSpeed_rpm} rpm</strong></td></tr>
                          <tr>
                            <td className="text-muted">推荐减速比</td>
                            <td><strong className="text-primary">{result.gearbox.targetRatio}</strong>
                              <small className="text-muted ms-2">{result.gearbox.note}</small>
                            </td>
                          </tr>
                          <tr><td className="text-muted">敞水效率 η0</td><td>{result.propeller.eta0 ? (result.propeller.eta0 * 100).toFixed(1) + '%' : '-'}</td></tr>
                          <tr><td className="text-muted">进速系数 J</td><td>{result.propeller.J ?? '-'}</td></tr>
                          <tr><td className="text-muted">伴流分数 w</td><td>{result.propeller.wakeFraction}</td></tr>
                          <tr><td className="text-muted">推力减额 t</td><td>{result.propeller.thrustDeduction}</td></tr>
                          <tr><td className="text-muted">估算推力 T</td><td>{result.propeller.estimatedThrust_kN ? result.propeller.estimatedThrust_kN + ' kN' : '-'}</td></tr>
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card style={cardStyle}>
                <Card.Header><i className="bi bi-bookmark-star me-2"></i>计算依据 / 文献</Card.Header>
                <ListGroup variant="flush">
                  {result.references.map((ref, i) => (
                    <ListGroup.Item key={i} style={{ fontSize: '0.85em' }}>
                      <i className="bi bi-book me-2 text-primary"></i>{ref}
                    </ListGroup.Item>
                  ))}
                  <ListGroup.Item style={{ fontSize: '0.78em' }} className="text-muted">
                    注: 本求解器为早期可研阶段工程估算; 终值需经螺旋桨敞水试验、CFD 仿真及主机匹配性试验确认
                  </ListGroup.Item>
                </ListGroup>
              </Card>
            </>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default PropulsionMatchingHub;
