// src/components/SystemSolutionView.js
// 系统级整体方案推荐：根据船型/用途推荐齿轮箱+联轴器+备用泵完整方案
import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup } from 'react-bootstrap';
import { getRecommendedPump, getRecommendedCouplingInfo } from '../data/gearboxMatchingMaps';
import { calculateFactoryPrice, getStandardDiscountRate } from '../utils/priceManager';
import { printHtmlContent } from '../utils/pdfExportUtils';

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

const CUSTOM_SERIES_OPTIONS = ['HC', 'GW', 'HCM', 'DT', 'HCQ', 'GC'];
const LS_KEY = 'custom_vessel_types';

function loadCustomTypes() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || []; } catch { return []; }
}
function saveCustomTypes(list) {
  localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 10)));
}

function getSeries(model) {
  const m = (model || '').toUpperCase();
  for (const s of ['HCD', 'HCA', 'HCM', 'HCQ', 'HCV', 'HCX', 'GWC', 'SGW', 'HC', 'GW', 'GC', 'MV', 'DT']) {
    if (m.startsWith(s)) return s;
  }
  return '';
}

function generateSolution(vesselType, propulsion, power, speed, customVesselObj) {
  const vessel = vesselType === 'custom' ? customVesselObj : VESSEL_TYPES.find(v => v.value === vesselType);
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

function buildCostBreakdown(solution) {
  if (!solution || solution.gearboxOptions.length === 0) return null;
  const top = solution.gearboxOptions[0];
  const cnt = solution.propConfig.count;
  const gearboxUnit = top.factoryPrice || 0;
  const couplingUnit = 0; // coupling price not available in mapping data
  const pumpUnit = 0;
  const singleTotal = gearboxUnit + couplingUnit + pumpUnit;
  return { gearboxUnit, couplingUnit, pumpUnit, singleTotal, setCount: cnt, grandTotal: singleTotal * cnt, model: top.model };
}

function buildExportHtml(solution) {
  const top3 = solution.gearboxOptions.slice(0, 3);
  const cost = buildCostBreakdown(solution);
  const now = new Date().toLocaleDateString('zh-CN');
  const td = 'padding:4px 8px;border:1px solid #ccc', th = td + ';background:#f5f5f5';
  const hd = 'padding:6px;border:1px solid #ccc';
  const paramRow = (l, v) => `<tr><td style="${th};width:30%">${l}</td><td style="${td}">${v}</td></tr>`;
  const modelRow = (g, i) => `<tr${i === 0 ? ' style="background:#dcfce7"' : ''}><td style="${hd};text-align:center">${i === 0 ? '最佳' : '推荐'}</td><td style="${hd};font-weight:bold">${g.model}</td><td style="${hd}">${g.series}</td><td style="${hd}">${g.maxCapacity}</td><td style="${hd}">+${g.margin}%</td><td style="${hd}">${g.thrust || '-'}</td><td style="${hd}">${g.weight ? g.weight + 'kg' : '-'}</td><td style="${hd}">${g.factoryPrice > 0 ? '¥' + g.factoryPrice.toLocaleString() : '询价'}</td><td style="${hd}">${g.coupling || '-'}</td><td style="${hd}">${g.pump || '-'}</td></tr>`;
  return `<div style="font-family:SimSun,serif;padding:20px;max-width:800px;margin:auto">
<h2 style="text-align:center;border-bottom:2px solid #333;padding-bottom:8px">整体方案推荐报告</h2>
<p style="text-align:right;color:#666;font-size:12px">生成日期: ${now}</p>
<h4>一、需求参数</h4>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px">${paramRow('船型', solution.vessel.label)}${paramRow('推进方式', solution.propConfig.label)}${paramRow('主机功率', solution.power + ' kW')}${paramRow('主机转速', solution.speed + ' rpm')}${paramRow('所需传递能力', solution.requiredCap.toFixed(4) + ' kW/rpm')}</table>
<h4>二、推荐型号 (Top ${top3.length})</h4>
<table style="width:100%;border-collapse:collapse;margin-bottom:16px;font-size:13px">
<tr style="background:#2563eb;color:#fff">${['排名','型号','系列','最大能力','余量','推力','重量','出厂价','联轴器','备用泵'].map(h=>`<th style="${hd}">${h}</th>`).join('')}</tr>
${top3.map(modelRow).join('')}</table>
${cost && cost.gearboxUnit > 0 ? `<h4>三、费用估算 (${cost.model})</h4>
<table style="width:60%;border-collapse:collapse;margin-bottom:16px">${paramRow('齿轮箱单台', '¥' + cost.gearboxUnit.toLocaleString())}${paramRow('数量', cost.setCount + ' 台')}<tr style="font-weight:bold"><td style="${td};background:#e0f2fe">齿轮箱合计</td><td style="${td};text-align:right;background:#e0f2fe">¥${cost.grandTotal.toLocaleString()}</td></tr></table>` : ''}
<p style="color:#999;font-size:11px;margin-top:24px;border-top:1px solid #eee;padding-top:8px">杭州前进齿轮箱集团 - 齿轮箱选型系统自动生成</p></div>`;
}

export default function SystemSolutionView({ colors, theme }) {
  const [vesselType, setVesselType] = useState('');
  const [propulsion, setPropulsion] = useState('single');
  const [power, setPower] = useState('');
  const [speed, setSpeed] = useState('1000');
  const [solution, setSolution] = useState(null);
  const [customTypes, setCustomTypes] = useState(loadCustomTypes);
  const [customName, setCustomName] = useState('');
  const [customSeries, setCustomSeries] = useState([]);
  const exportRef = useRef(null);

  const activeVessel = useMemo(() => {
    if (vesselType === 'custom') {
      return customName ? { value: 'custom', label: customName, powerRange: [0, 99999], seriesPrefer: customSeries.length ? customSeries : ['HC'], icon: 'bi-pencil-square' } : null;
    }
    if (vesselType?.startsWith('saved-')) {
      return customTypes.find(c => c.value === vesselType) || null;
    }
    return VESSEL_TYPES.find(v => v.value === vesselType) || null;
  }, [vesselType, customName, customSeries, customTypes]);

  const handleGenerate = useCallback(() => {
    if (!activeVessel || !power) return;
    setSolution(generateSolution(vesselType, propulsion, power, speed, activeVessel));
  }, [vesselType, propulsion, power, speed, activeVessel]);

  const handleSaveCustomType = useCallback(() => {
    if (!customName.trim() || customSeries.length === 0) return;
    const id = 'saved-' + Date.now();
    const entry = { value: id, label: customName.trim(), powerRange: [0, 99999], seriesPrefer: [...customSeries], icon: 'bi-pencil-square' };
    const updated = [entry, ...customTypes].slice(0, 10);
    setCustomTypes(updated);
    saveCustomTypes(updated);
    setVesselType(id);
    setCustomName('');
    setCustomSeries([]);
  }, [customName, customSeries, customTypes]);

  const toggleSeries = useCallback((s) => {
    setCustomSeries(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  }, []);

  const handleExport = useCallback(() => {
    if (!solution) return;
    const div = document.createElement('div');
    div.innerHTML = buildExportHtml(solution);
    document.body.appendChild(div);
    printHtmlContent(div, { title: `方案报告-${solution.vessel.label}-${solution.power}kW` });
    setTimeout(() => document.body.removeChild(div), 1000);
  }, [solution]);

  const costInfo = useMemo(() => buildCostBreakdown(solution), [solution]);
  const vesselInfo = activeVessel;

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
                <Form.Select value={vesselType} onChange={e => { setVesselType(e.target.value); setSolution(null); }}>
                  <option value="">选择船型...</option>
                  {VESSEL_TYPES.map(v => <option key={v.value} value={v.value}>{v.label} ({v.powerRange[0]}~{v.powerRange[1]}kW)</option>)}
                  {customTypes.length > 0 && <option disabled>── 自定义船型 ──</option>}
                  {customTypes.map(c => <option key={c.value} value={c.value}>{c.label} ({c.seriesPrefer.join('/')})</option>)}
                  <option value="custom">其他(自定义)...</option>
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
              <Button variant="primary" onClick={handleGenerate} disabled={!activeVessel || !power} className="w-100">
                <i className="bi bi-magic me-1"></i>生成方案
              </Button>
            </Col>
          </Row>
          {vesselType === 'custom' && (
            <Card className="mt-2 border-dashed">
              <Card.Body className="py-2">
                <Row className="align-items-end">
                  <Col md={3}>
                    <Form.Label className="small mb-1">船型名称</Form.Label>
                    <Form.Control size="sm" placeholder="如: LNG运输船" value={customName} onChange={e => setCustomName(e.target.value)} />
                  </Col>
                  <Col md={6}>
                    <Form.Label className="small mb-1">推荐系列</Form.Label>
                    <div className="d-flex flex-wrap gap-2">
                      {CUSTOM_SERIES_OPTIONS.map(s => (
                        <Form.Check key={s} inline type="checkbox" label={s} checked={customSeries.includes(s)} onChange={() => toggleSeries(s)} />
                      ))}
                    </div>
                  </Col>
                  <Col md={3} className="d-flex align-items-end">
                    <Button size="sm" variant="outline-success" onClick={handleSaveCustomType} disabled={!customName.trim() || customSeries.length === 0}>
                      <i className="bi bi-save me-1"></i>保存船型
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
          {vesselInfo && vesselType !== 'custom' && (
            <Alert variant="info" className="mt-2 mb-0 py-1 small">
              <i className={`bi ${vesselInfo.icon} me-1`}></i>
              {vesselInfo.label}: {vesselInfo.powerRange[0] > 0 ? `典型${vesselInfo.powerRange[0]}~${vesselInfo.powerRange[1]}kW，` : ''}推荐系列 {vesselInfo.seriesPrefer.join('/')}
            </Alert>
          )}
        </Card.Body>
      </Card>

      {solution && (
        <>
          <Card className="mb-3">
            <Card.Header className="bg-primary text-white d-flex justify-content-between align-items-center">
              <span>
                <i className="bi bi-check-circle me-1"></i>
                方案 — {solution.vessel.label} / {solution.propConfig.label} / {solution.power}kW@{solution.speed}rpm
                <small className="ms-2">(需{solution.requiredCap.toFixed(4)} kW/rpm)</small>
              </span>
              <Button size="sm" variant="light" onClick={handleExport}>
                <i className="bi bi-file-earmark-pdf me-1"></i>导出方案
              </Button>
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
                        <span>齿轮箱估价</span><strong className="text-success">&yen;{solution.totalPriceEst.toLocaleString()}</strong>
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

          {costInfo && costInfo.gearboxUnit > 0 && (
            <Card className="mb-3 border-info">
              <Card.Header className="bg-info bg-opacity-10"><i className="bi bi-calculator me-1"></i>费用对比 ({costInfo.model})</Card.Header>
              <Card.Body className="py-2">
                <Row>
                  <Col md={4}>
                    <div className="text-center p-2 border rounded">
                      <div className="text-muted small">齿轮箱单台</div>
                      <div className="fs-5 fw-bold">&yen;{costInfo.gearboxUnit.toLocaleString()}</div>
                    </div>
                  </Col>
                  {costInfo.setCount > 1 && (
                    <Col md={4}>
                      <div className="text-center p-2 border rounded bg-warning bg-opacity-10">
                        <div className="text-muted small">双机合计 ({costInfo.setCount}台)</div>
                        <div className="fs-5 fw-bold text-warning">&yen;{costInfo.grandTotal.toLocaleString()}</div>
                      </div>
                    </Col>
                  )}
                  <Col md={costInfo.setCount > 1 ? 4 : 8}>
                    <div className="small text-muted mt-1">
                      <div><i className="bi bi-dot"></i>齿轮箱: &yen;{costInfo.gearboxUnit.toLocaleString()} x {costInfo.setCount}</div>
                      <div><i className="bi bi-dot"></i>联轴器: 以实际���套为准</div>
                      <div><i className="bi bi-dot"></i>备用泵: 以实际配套为准</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
