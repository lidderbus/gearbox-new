// src/components/EnergyOptimizationView.js
// 能效优化建议：根据工况分析齿轮箱效率，提供节能建议
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup, ProgressBar } from 'react-bootstrap';

const EFFICIENCY_MAP = {
  HC: { base: 0.97, label: '中速' },
  HCD: { base: 0.965, label: '带离合器' },
  HCA: { base: 0.96, label: '带PTO' },
  GWC: { base: 0.975, label: '高速标准' },
  GW: { base: 0.975, label: '高速' },
  GC: { base: 0.965, label: 'CPP' },
  HCM: { base: 0.98, label: '轻型高速' },
  MV: { base: 0.955, label: '舵桨' },
  SGW: { base: 0.97, label: 'SGW' },
};

const OPERATING_PROFILES = [
  { value: 'full', label: '满负荷', loadFactor: 1.0 },
  { value: 'cruise', label: '经济航速', loadFactor: 0.75 },
  { value: 'slow', label: '慢速', loadFactor: 0.5 },
  { value: 'idle', label: '怠速', loadFactor: 0.25 },
  { value: 'mixed', label: '混合工况', loadFactor: 0.65 },
];

function getSeries(model) {
  const m = (model || '').toUpperCase();
  for (const s of ['HCD', 'HCA', 'HCM', 'GWC', 'HC', 'GW', 'GC', 'MV', 'SGW']) {
    if (m.startsWith(s)) return s;
  }
  return 'HC';
}

function calcEfficiency(series, loadFactor, ratio) {
  const base = EFFICIENCY_MAP[series]?.base || 0.97;
  // 效率随负载率下降
  const loadPenalty = loadFactor < 0.3 ? 0.03 : loadFactor < 0.5 ? 0.015 : loadFactor < 0.75 ? 0.005 : 0;
  // 高减速比略有损失
  const ratioPenalty = ratio > 4 ? 0.005 : ratio > 3 ? 0.002 : 0;
  return Math.max(0.90, base - loadPenalty - ratioPenalty);
}

function generateSuggestions(model, power, loadFactor, ratio, hoursPerYear) {
  const series = getSeries(model);
  const eff = calcEfficiency(series, loadFactor, ratio);
  const powerNum = parseFloat(power) || 0;
  const hours = parseFloat(hoursPerYear) || 4000;
  const lossKW = powerNum * (1 - eff);
  const annualLossMWh = (lossKW * hours) / 1000;
  const fuelCostPerMWh = 280; // 约280美元/MWh（船用柴油）
  const annualFuelCost = annualLossMWh * fuelCostPerMWh;

  const suggestions = [];

  if (loadFactor < 0.5) {
    suggestions.push({
      title: '避免长时间低负荷运行',
      desc: '低于50%负荷时齿轮箱效率显著下降，建议优化航速计划',
      impact: '可节能 1-3%',
      priority: 'high',
    });
  }

  if (ratio > 4) {
    suggestions.push({
      title: '评估减速比优化可能性',
      desc: '当前减速比较大，考虑是否可选用更低减速比来提高传动效率',
      impact: '可提效 0.5%',
      priority: 'medium',
    });
  }

  if (series === 'HCA' || series === 'HCD') {
    suggestions.push({
      title: '离合器/PTO维护检查',
      desc: `${series === 'HCA' ? 'PTO' : '离合器'}组件磨损会增加额外损耗，建议定期检查`,
      impact: '保持设计效率',
      priority: 'medium',
    });
  }

  suggestions.push({
    title: '润滑油品质管理',
    desc: '使用推荐品牌和粘度的润滑油，定期检测油品质量，按时换油',
    impact: '维持效率 0.3-0.5%',
    priority: 'low',
  });

  suggestions.push({
    title: '齿轮箱温度监控',
    desc: '油温超过设计值每10°C，效率约降低0.5%，确保冷却系统正常',
    impact: '防止效率下降',
    priority: 'medium',
  });

  return { eff, lossKW, annualLossMWh, annualFuelCost, suggestions };
}

export default function EnergyOptimizationView({ colors, theme }) {
  const [model, setModel] = useState('');
  const [power, setPower] = useState('');
  const [ratio, setRatio] = useState('2');
  const [profile, setProfile] = useState('cruise');
  const [hours, setHours] = useState('4000');
  const [analysis, setAnalysis] = useState(null);

  const loadFactor = OPERATING_PROFILES.find(p => p.value === profile)?.loadFactor || 0.75;

  const handleAnalyze = useCallback(() => {
    if (!model || !power) return;
    const result = generateSuggestions(model, power, loadFactor, parseFloat(ratio), hours);
    setAnalysis(result);
  }, [model, power, loadFactor, ratio, hours]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h5><i className="bi bi-lightning me-2"></i>能效优化建议</h5>
          <small className="text-muted">分析齿轮箱运行能效，提供针对性节能建议和经济性评估</small>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Header>运行参数</Card.Header>
        <Card.Body>
          <Row>
            <Col md={2}>
              <Form.Group>
                <Form.Label>齿轮箱型号</Form.Label>
                <Form.Control placeholder="如 HC138" value={model} onChange={e => setModel(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>额定功率 (kW)</Form.Label>
                <Form.Control type="number" value={power} onChange={e => setPower(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>减速比</Form.Label>
                <Form.Control type="number" step="0.01" value={ratio} onChange={e => setRatio(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>运行工况</Form.Label>
                <Form.Select value={profile} onChange={e => setProfile(e.target.value)}>
                  {OPERATING_PROFILES.map(p => (
                    <option key={p.value} value={p.value}>{p.label} ({(p.loadFactor * 100)}%)</option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={2}>
              <Form.Group>
                <Form.Label>年运行小时</Form.Label>
                <Form.Control type="number" value={hours} onChange={e => setHours(e.target.value)} />
              </Form.Group>
            </Col>
            <Col md={2} className="d-flex align-items-end">
              <Button variant="primary" onClick={handleAnalyze} disabled={!model || !power} className="w-100">
                <i className="bi bi-calculator me-1"></i>分析
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {analysis && (
        <Row>
          <Col md={4}>
            <Card className="mb-3">
              <Card.Header>效率评估</Card.Header>
              <Card.Body className="text-center">
                <div style={{ fontSize: '3rem', fontWeight: 'bold', color: analysis.eff >= 0.97 ? '#198754' : analysis.eff >= 0.95 ? '#0d6efd' : '#dc3545' }}>
                  {(analysis.eff * 100).toFixed(1)}%
                </div>
                <p className="text-muted mb-2">预估传动效率</p>
                <ProgressBar
                  now={analysis.eff * 100}
                  min={90}
                  max={100}
                  variant={analysis.eff >= 0.97 ? 'success' : analysis.eff >= 0.95 ? 'primary' : 'danger'}
                  label={`${(analysis.eff * 100).toFixed(1)}%`}
                />
                <hr />
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span>功率损耗</span>
                    <strong>{analysis.lossKW.toFixed(1)} kW</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span>年能耗损失</span>
                    <strong>{analysis.annualLossMWh.toFixed(1)} MWh</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between px-0">
                    <span>年燃油成本</span>
                    <strong className="text-danger">${analysis.annualFuelCost.toFixed(0)}</strong>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            <Card>
              <Card.Header>优化建议</Card.Header>
              <Card.Body className="p-0">
                <ListGroup variant="flush">
                  {analysis.suggestions.map((s, i) => (
                    <ListGroup.Item key={i}>
                      <div className="d-flex justify-content-between align-items-start">
                        <div>
                          <strong>
                            <Badge bg={s.priority === 'high' ? 'danger' : s.priority === 'medium' ? 'warning' : 'info'} className="me-2">
                              {s.priority === 'high' ? '重要' : s.priority === 'medium' ? '建议' : '参考'}
                            </Badge>
                            {s.title}
                          </strong>
                          <p className="mb-0 mt-1 text-muted small">{s.desc}</p>
                        </div>
                        <Badge bg="success">{s.impact}</Badge>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      )}
    </Container>
  );
}
