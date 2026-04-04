// src/components/SystemSolutionView.js
// 系统级整体方案推荐：根据船型/用途推荐齿轮箱+联轴器+备用泵完整方案
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup } from 'react-bootstrap';
import { getRecommendedPump, getRecommendedCouplingInfo } from '../data/gearboxMatchingMaps';
import { calculateFactoryPrice, getStandardDiscountRate } from '../utils/priceManager';

let embeddedData = [];
try {
  const raw = require('../data/embeddedData').embeddedGearboxData || {};
  Object.keys(raw).forEach(k => { if (Array.isArray(raw[k])) embeddedData = embeddedData.concat(raw[k]); });
} catch(e) {}

const VESSEL_TYPES = [
  { value: 'cargo', label: '散货船', powerRange: [500, 3000], seriesPrefer: ['HC', 'HCD'], icon: 'bi-box-seam' },
  { value: 'tanker', label: '油轮/化学品船', powerRange: [800, 5000], seriesPrefer: ['HC', 'HCD'], icon: 'bi-droplet' },
  { value: 'container', label: '集装箱船', powerRange: [1000, 8000], seriesPrefer: ['HC', 'GWC'], icon: 'bi-boxes' },
  { value: 'fishing', label: '渔船', powerRange: [100, 800], seriesPrefer: ['HC', 'HCA', 'GW', 'HCM'], icon: 'bi-water' },
  { value: 'tug', label: '拖轮', powerRange: [300, 3000], seriesPrefer: ['HC', 'HCD'], icon: 'bi-life-preserver' },
  { value: 'passenger', label: '客船/渡轮', powerRange: [200, 2000], seriesPrefer: ['HC', 'GWC', 'HCM'], icon: 'bi-people' },
  { value: 'offshore', label: '海工船', powerRange: [1000, 6000], seriesPrefer: ['GWC', 'GW', 'HC'], icon: 'bi-gear-wide-connected' },
  { value: 'naval', label: '公务船/军辅', powerRange: [500, 4000], seriesPrefer: ['GWC', 'GW', 'HCM'], icon: 'bi-shield' },
  { value: 'yacht', label: '游艇', powerRange: [50, 500], seriesPrefer: ['HCM', 'HC'], icon: 'bi-tsunami' },
  { value: 'dredger', label: '疏浚船', powerRange: [500, 4000], seriesPrefer: ['HC', 'HCD'], icon: 'bi-bucket' },
];

const PROPULSION_TYPES = [
  { value: 'single', label: '单机单桨', count: 1 },
  { value: 'twin', label: '双机双桨', count: 2 },
  { value: 'cpp', label: '单机可调桨', count: 1, cpp: true },
  { value: 'twin-cpp', label: '双机可调桨', count: 2, cpp: true },
];

function getSeries(model) {
  const m = (model || '').toUpperCase();
  for (const s of ['HCD', 'HCA', 'HCM', 'HCQ', 'HCV', 'HCX', 'GWC', 'SGW', 'HC', 'GW', 'GC', 'MV', 'DT']) {
    if (m.startsWith(s)) return s;
  }
  return '';
}

function generateSolution(vesselType, propulsion, power, speed) {
  const vessel = VESSEL_TYPES.find(v => v.value === vesselType);
  const propConfig = PROPULSION_TYPES.find(p => p.value === propulsion);
  if (!vessel || !power) return null;

  const powerNum = parseFloat(power);
  const speedNum = parseFloat(speed) || 1000;
  const requiredCap = powerNum / speedNum;

  const candidates = embeddedData.filter(item => {
    const model = item.model || item.name || '';
    const series = getSeries(model);
    if (!vessel.seriesPrefer.includes(series)) return false;

    const caps = Array.isArray(item.transferCapacity) ? item.transferCapacity.filter(v => typeof v === 'number') : [];
    const maxCap = caps.length ? Math.max(...caps) : 0;
    if (maxCap < requiredCap) return false;

    const minSpd = item.inputSpeedRange ? item.inputSpeedRange[0] : 0;
    const maxSpd = item.inputSpeedRange ? item.inputSpeedRange[1] : 99999;
    if (speedNum < minSpd || speedNum > maxSpd) return false;

    return true;
  }).map(item => {
    const model = item.model || item.name;
    const caps = Array.isArray(item.transferCapacity) ? item.transferCapacity.filter(v => typeof v === 'number') : [];
    const maxCap = caps.length ? Math.max(...caps) : 0;
    const margin = ((maxCap / requiredCap - 1) * 100);

    // 配套设备
    const pump = getRecommendedPump(model);
    const coupling = getRecommendedCouplingInfo(model);

    // 价格
    const price = item.price || 0;
    const factoryPrice = price > 0 ? calculateFactoryPrice({
      model, basePrice: price,
      discountRate: item.discountRate ?? getStandardDiscountRate(model)
    }) : 0;

    return {
      model,
      series: getSeries(model),
      maxCapacity: maxCap,
      margin: Math.round(margin * 10) / 10,
      ratioCount: (Array.isArray(item.ratios) ? item.ratios : []).length,
      weight: item.weight || item.dryWeight || null,
      thrust: item.thrust || null,
      factoryPrice,
      pump: pump?.model || pump?.pump || null,
      coupling: coupling?.model || coupling?.coupling || null,
    };
  }).filter(c => c.margin >= 5 && c.margin <= 150)
    .sort((a, b) => a.margin - b.margin)
    .slice(0, 12);

  // 计算整套方案价格估算
  const topGearbox = candidates[0];
  const totalPriceEst = topGearbox && topGearbox.factoryPrice > 0
    ? topGearbox.factoryPrice * propConfig.count
    : null;

  return {
    vessel, propConfig, power: powerNum, speed: speedNum, requiredCap,
    gearboxOptions: candidates,
    needsCPP: propConfig.cpp,
    totalPriceEst,
  };
}

export default function SystemSolutionView({ colors, theme }) {
  const [vesselType, setVesselType] = useState('');
  const [propulsion, setPropulsion] = useState('single');
  const [power, setPower] = useState('');
  const [speed, setSpeed] = useState('1000');
  const [solution, setSolution] = useState(null);

  const handleGenerate = useCallback(() => {
    setSolution(generateSolution(vesselType, propulsion, power, speed));
  }, [vesselType, propulsion, power, speed]);

  const vesselInfo = VESSEL_TYPES.find(v => v.value === vesselType);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-diagram-3 me-2"></i>整体方案推荐</h5>
          <small className="text-muted">根据船型、推进方式和功率，自动推荐齿轮箱+联轴器+备用泵完整方案 ({embeddedData.length}型号)</small>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Header>需求参数</Card.Header>
        <Card.Body>
          <Row>
            <Col md={3}>
              <Form.Group>
                <Form.Label>船型</Form.Label>
                <Form.Select value={vesselType} onChange={e => setVesselType(e.target.value)}>
                  <option value="">选择船型...</option>
                  {VESSEL_TYPES.map(v => <option key={v.value} value={v.value}>{v.label} ({v.powerRange[0]}~{v.powerRange[1]}kW)</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>推进方式</Form.Label>
                <Form.Select value={propulsion} onChange={e => setPropulsion(e.target.value)}>
                  {PROPULSION_TYPES.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>主机功率(kW)</Form.Label>
                <Form.Control type="number" placeholder="kW" value={power} onChange={e => setPower(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>主机转速(rpm)</Form.Label>
                <Form.Control type="number" placeholder="rpm" value={speed} onChange={e => setSpeed(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleGenerate} disabled={!vesselType || !power} className="w-100">
                <i className="bi bi-magic me-1"></i>生成方案
              </Button>
            </Col>
          </Row>
          {vesselInfo && (
            <Alert variant="info" className="mt-2 mb-0 py-1 small">
              <i className={`bi ${vesselInfo.icon} me-1`}></i>
              {vesselInfo.label}: 典型{vesselInfo.powerRange[0]}~{vesselInfo.powerRange[1]}kW，推荐系列 {vesselInfo.seriesPrefer.join('/')}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {solution && (
        <Card>
          <Card.Header className="bg-primary text-white">
            <i className="bi bi-check-circle me-1"></i>
            方案 — {solution.vessel.label} / {solution.propConfig.label} / {solution.power}kW@{solution.speed}rpm
            <small className="ms-2">(需{solution.requiredCap.toFixed(4)} kW/rpm)</small>
          </Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}>
                <h6>配置摘要</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>齿轮箱</span><Badge bg="primary">{solution.propConfig.count}台</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>推进类型</span><span>{solution.needsCPP ? '可调桨' : '定距桨'}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>候选型号</span><Badge bg="success">{solution.gearboxOptions.length}</Badge>
                  </ListGroup.Item>
                  {solution.totalPriceEst > 0 && (
                    <ListGroup.Item className="d-flex justify-content-between py-1">
                      <span>齿轮箱估价</span><strong className="text-success">¥{solution.totalPriceEst.toLocaleString()}</strong>
                    </ListGroup.Item>
                  )}
                </ListGroup>
              </Col>
              <Col md={9}>
                <h6>推荐方案</h6>
                {solution.gearboxOptions.length === 0 ? (
                  <Alert variant="warning">未找到满足条件的齿轮箱</Alert>
                ) : (
                  <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                    <Table size="sm" hover className="mb-0">
                      <thead className="sticky-top bg-light">
                        <tr><th></th><th>型号</th><th>系列</th><th>最大能力</th><th>余量</th><th>推力</th><th>重量</th><th>出厂价</th><th>联轴器</th><th>备用泵</th></tr>
                      </thead>
                      <tbody>
                        {solution.gearboxOptions.map((g, i) => (
                          <tr key={g.model} className={i === 0 ? 'table-success' : ''}>
                            <td>{i === 0 ? <Badge bg="success">最佳</Badge> : i < 3 ? <Badge bg="info">推荐</Badge> : <Badge bg="secondary">{i+1}</Badge>}</td>
                            <td><strong>{g.model}</strong></td>
                            <td>{g.series}</td>
                            <td>{g.maxCapacity}</td>
                            <td><Badge bg={g.margin < 15 ? 'warning' : g.margin < 50 ? 'success' : 'info'}>+{g.margin}%</Badge></td>
                            <td>{g.thrust || '—'}</td>
                            <td>{g.weight ? `${g.weight}kg` : '—'}</td>
                            <td>{g.factoryPrice > 0 ? `¥${g.factoryPrice.toLocaleString()}` : '询价'}</td>
                            <td><small>{g.coupling || '—'}</small></td>
                            <td><small>{g.pump || '—'}</small></td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
