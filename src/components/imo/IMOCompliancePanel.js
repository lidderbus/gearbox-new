// src/components/imo/IMOCompliancePanel.js
// B4: IMO 合规评估面板 — 在选型结果页可选展示 EEXI/EEDI/CII + 减排建议
//
// 接入方式 (选型结果页):
//   import IMOCompliancePanel from './imo/IMOCompliancePanel';
//   <IMOCompliancePanel selectionResult={result} />
//
// 用户可在面板内输入船型 / DWT / Vref 等参数后点击"评估"按钮触发
// 评估结果实时计算, 不依赖网络

import React, { useMemo, useState } from 'react';
import { Card, Form, Row, Col, Button, Badge, Alert, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { evaluateCompliance, getSupportedShipTypes, IMO_VERSION } from '../../utils/imoComplianceEngine';

const RatingColor = {
  A: 'success',
  B: 'info',
  C: 'warning',
  D: 'warning',
  E: 'danger'
};

const PriorityColor = {
  low: 'secondary',
  medium: 'info',
  high: 'warning',
  critical: 'danger'
};

const HelpTip = ({ text }) => (
  <OverlayTrigger placement="top" overlay={<Tooltip>{text}</Tooltip>}>
    <i className="bi bi-info-circle ms-1" style={{ cursor: 'pointer', color: '#6c757d', fontSize: '0.85em' }}></i>
  </OverlayTrigger>
);

/**
 * @param {Object} props
 * @param {Object} [props.selectionResult]  选型结果, 含 engineId / enginePower / 推荐齿轮箱
 * @param {Object} [props.colors]           主题色
 */
const IMOCompliancePanel = ({ selectionResult, colors = {} }) => {
  const supportedTypes = useMemo(() => getSupportedShipTypes(), []);

  // 表单 state — 默认值优先用 selectionResult 的字段
  const [shipType, setShipType] = useState(supportedTypes[0]?.key || 'generalCargo');
  const [dwt, setDwt] = useState('');
  const [referenceSpeed, setReferenceSpeed] = useState('');
  const [fuelType, setFuelType] = useState('HFO');
  const [annualFuel, setAnnualFuel] = useState('');
  const [annualDistance, setAnnualDistance] = useState('');
  const [evaluateEEDI, setEvaluateEEDI] = useState(false);
  const [year, setYear] = useState(new Date().getFullYear());
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  const handleEvaluate = (e) => {
    e?.preventDefault?.();
    setError(null);
    if (!dwt || !referenceSpeed) {
      setError('载重量(DWT) 与 参考航速(节) 必填');
      return;
    }
    const params = {
      shipType,
      dwt: Number(dwt),
      referenceSpeed: Number(referenceSpeed),
      fuelType,
      evaluateEEDI,
      year: Number(year)
    };
    if (selectionResult?.engineId) {
      params.engineId = selectionResult.engineId;
    }
    if (selectionResult?.enginePower && !params.engineId) {
      params.installedPower = Number(selectionResult.enginePower);
    }
    if (annualFuel && annualDistance) {
      params.annualFuelConsumption = Number(annualFuel);
      params.annualDistance = Number(annualDistance);
    }
    const result = evaluateCompliance(params);
    if (!result.success) {
      setError(result.message || '评估失败, 请检查输入');
      setReport(null);
      return;
    }
    setReport(result);
  };

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#e8f4ff', color: colors.headerText || '#0a58ca' }}>
        <strong>
          <i className="bi bi-globe me-2"></i>
          IMO 合规评估 (EEXI / EEDI / CII)
        </strong>
        <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.7em' }}>{IMO_VERSION}</Badge>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleEvaluate}>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>船型 <HelpTip text="按 IMO MEPC.333(76) 附录船型分类" /></Form.Label>
                <Form.Select value={shipType} onChange={(e) => setShipType(e.target.value)} style={inputStyle}>
                  {supportedTypes.map(t => (
                    <option key={t.key} value={t.key}>{t.nameZh} {t.nameEn ? `(${t.nameEn})` : ''}</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label>载重量 DWT (吨) *</Form.Label>
                <Form.Control type="number" value={dwt} onChange={(e) => setDwt(e.target.value)} placeholder="180000" style={inputStyle} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label>参考航速 Vref (节) *</Form.Label>
                <Form.Control type="number" step="0.1" value={referenceSpeed} onChange={(e) => setReferenceSpeed(e.target.value)} placeholder="14.5" style={inputStyle} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label>燃料</Form.Label>
                <Form.Select value={fuelType} onChange={(e) => setFuelType(e.target.value)} style={inputStyle}>
                  <option value="HFO">HFO 重燃油</option>
                  <option value="MDO">MDO 船用柴油</option>
                  <option value="MGO">MGO 轻柴油</option>
                  <option value="LSFO">LSFO 低硫</option>
                  <option value="LNG">LNG</option>
                  <option value="Methanol">Methanol</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Check
                  type="switch"
                  id="evaluate-eedi-switch"
                  label="同时评估 EEDI (新建船 Phase 3)"
                  checked={evaluateEEDI}
                  onChange={(e) => setEvaluateEEDI(e.target.checked)}
                  className="mt-4"
                />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>年燃料消耗 (吨, CII 用)</Form.Label>
                <Form.Control type="number" value={annualFuel} onChange={(e) => setAnnualFuel(e.target.value)} placeholder="可选" style={inputStyle} />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group className="mb-2">
                <Form.Label>年航行里程 (海里, CII 用)</Form.Label>
                <Form.Control type="number" value={annualDistance} onChange={(e) => setAnnualDistance(e.target.value)} placeholder="可选" style={inputStyle} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group className="mb-2">
                <Form.Label>评估年份</Form.Label>
                <Form.Control type="number" value={year} onChange={(e) => setYear(e.target.value)} style={inputStyle} />
              </Form.Group>
            </Col>
            <Col md={4} className="d-flex align-items-end">
              <Button type="submit" variant="primary" className="mb-2">
                <i className="bi bi-calculator me-1"></i>
                评估 IMO 合规性
              </Button>
            </Col>
          </Row>
        </Form>

        {error && <Alert variant="warning" className="mt-2">{error}</Alert>}

        {report && report.success && (
          <div className="mt-3">
            {report.engine && (
              <Alert variant="info" className="py-2 px-3" style={{ fontSize: '0.9em' }}>
                <strong>柴油机数据源:</strong> {report.engine.brand} {report.engine.model}
                {report.engine.sfc && <> · SFC ≈ {Math.round(report.engine.sfc)} g/kWh (100% 工况)</>}
                · 齿轮箱效率 {(report.gearboxEfficiency * 100).toFixed(1)}%
                · 推进端有效功率 {report.effectivePropulsionPower} kW
              </Alert>
            )}

            <Table bordered hover size="sm" className="mt-2">
              <thead>
                <tr style={{ backgroundColor: '#f0f4f8' }}>
                  <th>指标</th>
                  <th>实际值</th>
                  <th>限值</th>
                  <th>合规</th>
                  <th>说明</th>
                </tr>
              </thead>
              <tbody>
                {report.eexi?.success && (
                  <tr>
                    <td><strong>EEXI</strong></td>
                    <td>{report.eexi.attainedEEXI} <small className="text-muted">{report.eexi.unit}</small></td>
                    <td>{report.eexi.requiredEEXI}</td>
                    <td>
                      {report.eexi.compliant
                        ? <Badge bg="success">合规</Badge>
                        : <Badge bg="danger">超标 {report.eexi.reductionNeeded}%</Badge>}
                    </td>
                    <td style={{ fontSize: '0.85em' }}>{report.eexi.message}</td>
                  </tr>
                )}
                {report.eedi?.success && (
                  <tr>
                    <td><strong>EEDI</strong> <Badge bg="info" pill style={{ fontSize: '0.65em' }}>Phase 3</Badge></td>
                    <td>{report.eedi.attainedEEDI}</td>
                    <td>{report.eedi.requiredEEDI}</td>
                    <td>
                      {report.eedi.compliant
                        ? <Badge bg="success">合规</Badge>
                        : <Badge bg="danger">超标 {report.eedi.reductionNeeded}%</Badge>}
                    </td>
                    <td style={{ fontSize: '0.85em' }}>{report.eedi.message}</td>
                  </tr>
                )}
                {report.cii?.success && (
                  <tr>
                    <td><strong>CII 评级</strong></td>
                    <td>{report.cii.attainedCII}</td>
                    <td>参考 {report.cii.ciiReference}</td>
                    <td>
                      <Badge bg={RatingColor[report.cii.rating] || 'secondary'} style={{ fontSize: '0.95em' }}>
                        {report.cii.rating} 级 — {report.cii.ratingDescription?.level}
                      </Badge>
                    </td>
                    <td style={{ fontSize: '0.85em' }}>{report.cii.ratingDescription?.action}</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {report.recommendations && report.recommendations.length > 0 && (
              <div className="mt-3">
                <h6 className="mb-2">
                  <i className="bi bi-lightbulb me-1 text-warning"></i>
                  减排建议 ({report.recommendations.length} 条)
                </h6>
                {report.recommendations.map((rec, idx) => (
                  <Alert
                    key={idx}
                    variant={PriorityColor[rec.priority] === 'danger' ? 'danger'
                          : PriorityColor[rec.priority] === 'warning' ? 'warning'
                          : 'light'}
                    className="py-2 px-3 mb-2"
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <Badge bg={PriorityColor[rec.priority] || 'secondary'} className="me-2">
                          {rec.category} · {rec.priority}
                        </Badge>
                        <strong>{rec.action}</strong>
                      </div>
                      {rec.co2ReductionExpected && (
                        <Badge bg="info">预期减排 {rec.co2ReductionExpected}</Badge>
                      )}
                    </div>
                    <div style={{ fontSize: '0.88em', color: '#555', marginTop: 6 }}>{rec.detail}</div>
                  </Alert>
                ))}
              </div>
            )}

            <div className="mt-2 text-muted" style={{ fontSize: '0.78em' }}>
              依据: {report.imoVersion} · 计算结果仅供工程参考, 正式合规需船级社核发证书
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default IMOCompliancePanel;
