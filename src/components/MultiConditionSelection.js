// src/components/MultiConditionSelection.js
// 多工况复合选型：同时指定多组工况参数，筛选满足所有工况的齿轮箱
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup } from 'react-bootstrap';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend, ResponsiveContainer, Tooltip } from 'recharts';

let embeddedData = [];
try {
  const raw = require('../data/embeddedData').embeddedGearboxData || {};
  Object.keys(raw).forEach(k => { if (Array.isArray(raw[k])) embeddedData = embeddedData.concat(raw[k]); });
} catch(e) {}

function getSeries(model) {
  const m = (model || '').toUpperCase();
  for (const s of ['HCD', 'HCA', 'HCM', 'HCQ', 'HCV', 'HCX', 'GWC', 'SGW', 'HC', 'GW', 'GC', 'MV', 'DT']) {
    if (m.startsWith(s)) return s;
  }
  return '';
}

const EMPTY_CONDITION = { power: '', speed: '', ratio: '', label: '', weight: 2 };
const MAX_CONDITIONS = 8;
const WEIGHT_OPTIONS = [
  { value: 3, label: '高(3x)' },
  { value: 2, label: '中(2x)' },
  { value: 1, label: '低(1x)' },
];
const RADAR_COLORS = ['#0d6efd', '#dc3545', '#198754'];

function checkModelFit(item, conditions) {
  const ratios = Array.isArray(item.ratios) ? item.ratios : [];
  const caps = Array.isArray(item.transferCapacity) ? item.transferCapacity : [];
  const minSpeed = item.inputSpeedRange ? item.inputSpeedRange[0] : 0;
  const maxSpeed = item.inputSpeedRange ? item.inputSpeedRange[1] : 99999;

  let totalWeightedScore = 0;
  let totalWeight = 0;
  let matchCount = 0;
  const details = [];
  const conditionScores = []; // per-condition normalized scores (0-100) for radar chart

  conditions.forEach((cond, idx) => {
    const power = parseFloat(cond.power);
    const speed = parseFloat(cond.speed);
    const ratio = parseFloat(cond.ratio);
    if (isNaN(power) && isNaN(speed) && isNaN(ratio)) return;

    const condWeight = cond.weight || 2;
    let condScore = 0;
    let condMatch = true;
    const checks = [];

    // 检查转速
    if (!isNaN(speed)) {
      if (speed >= minSpeed && speed <= maxSpeed) {
        condScore += 25;
        checks.push({ param: '转速', ok: true });
      } else {
        condMatch = false;
        checks.push({ param: '转速', ok: false, reason: `${speed}rpm不在${minSpeed}~${maxSpeed}` });
      }
    }

    // 检查减速比 + 传递能力（联合校验）
    if (!isNaN(ratio)) {
      let bestIdx = -1, bestDiff = Infinity;
      ratios.forEach((r, i) => {
        if (typeof r === 'number') {
          const diff = Math.abs(r - ratio);
          if (diff < bestDiff) { bestDiff = diff; bestIdx = i; }
        }
      });

      if (bestIdx >= 0 && bestDiff / ratio < 0.1) {
        condScore += 25;
        checks.push({ param: '减速比', ok: true, detail: `i=${ratios[bestIdx]} (偏差${(bestDiff/ratio*100).toFixed(1)}%)` });

        if (!isNaN(power) && !isNaN(speed) && speed > 0) {
          const requiredCap = power / speed;
          const actualCap = caps[bestIdx] || 0;
          if (actualCap >= requiredCap) {
            const margin = ((actualCap / requiredCap - 1) * 100).toFixed(1);
            condScore += 50;
            checks.push({ param: '功率', ok: true, detail: `余量+${margin}%` });
          } else if (actualCap > 0) {
            condMatch = false;
            checks.push({ param: '功率', ok: false, reason: `需${requiredCap.toFixed(4)},实际${actualCap}kW/rpm` });
          }
        }
      } else if (bestIdx >= 0) {
        condMatch = false;
        checks.push({ param: '减速比', ok: false, reason: `最近${ratios[bestIdx]}偏差${(bestDiff/ratio*100).toFixed(1)}%` });
      } else {
        condMatch = false;
        checks.push({ param: '减速比', ok: false, reason: '无数据' });
      }
    } else if (!isNaN(power) && !isNaN(speed) && speed > 0) {
      const requiredCap = power / speed;
      const maxCap = caps.length ? Math.max(...caps.filter(v => typeof v === 'number')) : 0;
      if (maxCap >= requiredCap) {
        const margin = ((maxCap / requiredCap - 1) * 100).toFixed(1);
        condScore += 50;
        checks.push({ param: '功率', ok: true, detail: `最大余量+${margin}%` });
      } else if (maxCap > 0) {
        condMatch = false;
        checks.push({ param: '功率', ok: false, reason: `需${requiredCap.toFixed(4)},最大${maxCap}kW/rpm` });
      }
    }

    if (condMatch) matchCount++;
    totalWeightedScore += condScore * condWeight;
    totalWeight += condWeight;
    conditionScores.push(condScore); // raw score per condition (0-100)
    details.push({ idx: idx + 1, checks, matched: condMatch, label: cond.label || `工况${idx + 1}`, weight: condWeight });
  });

  const weightedScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;

  return {
    score: Math.round(weightedScore * 100) / 100,
    matchCount,
    details,
    conditionScores,
    model: item.model || item.name,
    series: getSeries(item.model || item.name)
  };
}

function exportResultsCSV(results, conditions) {
  if (!results || !results.items.length) return;

  const validConds = conditions.filter(c => c.power || c.speed || c.ratio);
  const headers = ['排名', '型号', '系列', '满足工况数', '加权得分'];
  validConds.forEach((c, i) => {
    const label = c.label || `工况${i + 1}`;
    headers.push(`${label}(匹配)`, `${label}(得分)`);
  });

  const rows = results.items.map((r, i) => {
    const row = [i + 1, r.model, r.series, `${r.matchCount}/${results.totalConditions}`, r.score];
    r.details.forEach(d => {
      row.push(d.matched ? '是' : '否', r.conditionScores[d.idx - 1] || 0);
    });
    return row;
  });

  const BOM = '\uFEFF';
  const csv = BOM + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `多工况选型结果_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function MultiConditionSelection({ colors, theme }) {
  const [conditions, setConditions] = useState([
    { ...EMPTY_CONDITION, label: '自由航行' },
    { ...EMPTY_CONDITION, label: '满载工况' }
  ]);
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [results, setResults] = useState(null);

  const updateCondition = useCallback((idx, field, value) => {
    setConditions(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  }, []);

  const addCondition = useCallback(() => {
    if (conditions.length >= MAX_CONDITIONS) return;
    setConditions(prev => [...prev, { ...EMPTY_CONDITION, label: `工况${prev.length + 1}` }]);
  }, [conditions.length]);

  const removeCondition = useCallback((idx) => {
    if (conditions.length <= 1) return;
    setConditions(prev => prev.filter((_, i) => i !== idx));
  }, [conditions.length]);

  const runSelection = useCallback(() => {
    const validConds = conditions.filter(c => c.power || c.speed || c.ratio);
    if (validConds.length === 0) return;

    let filtered = embeddedData;
    if (seriesFilter !== 'all') filtered = filtered.filter(item => getSeries(item.model || item.name) === seriesFilter);

    const scored = filtered
      .map(item => checkModelFit(item, validConds))
      .filter(r => r.matchCount > 0)
      .sort((a, b) => b.matchCount !== a.matchCount ? b.matchCount - a.matchCount : b.score - a.score)
      .slice(0, 30);

    setResults({ items: scored, totalConditions: validConds.length });
  }, [conditions, seriesFilter]);

  // Radar chart data for top 3 models
  const radarData = useMemo(() => {
    if (!results || results.items.length === 0) return null;
    const top3 = results.items.slice(0, 3);
    // Each condition becomes an axis
    const validConds = conditions.filter(c => c.power || c.speed || c.ratio);
    if (validConds.length < 2) return null; // radar needs at least 2 axes

    const data = validConds.map((cond, ci) => {
      const point = { condition: cond.label || `工况${ci + 1}` };
      top3.forEach((r, mi) => {
        point[r.model] = r.conditionScores[ci] || 0;
      });
      return point;
    });

    return { data, models: top3.map(r => r.model) };
  }, [results, conditions]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-layers me-2"></i>多工况复合选型</h5>
          <small className="text-muted">同时指定多组工况（如自由航行+拖带），筛选满足所有工况的齿轮箱 ({embeddedData.length}型号)</small>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>工况参数 ({conditions.length}/{MAX_CONDITIONS})</span>
          <div className="d-flex gap-2">
            <Form.Select size="sm" style={{ width: 150 }} value={seriesFilter} onChange={e => setSeriesFilter(e.target.value)}>
              <option value="all">全部系列</option>
              {['HC','HCD','HCA','GWC','GW','GC','HCM','DT','MV','SGW','HCQ'].map(s => <option key={s} value={s}>{s}系列</option>)}
            </Form.Select>
            <Button size="sm" variant="outline-primary" onClick={addCondition} disabled={conditions.length >= MAX_CONDITIONS}>
              <i className="bi bi-plus"></i> 添加工况
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {conditions.map((cond, idx) => (
            <Row key={idx} className="mb-2 align-items-center">
              <Col xs="auto">
                <Form.Control size="sm" style={{ width: 90 }} placeholder="工况名" value={cond.label} onChange={e => updateCondition(idx, 'label', e.target.value)} />
              </Col>
              <Col>
                <InputGroup size="sm">
                  <InputGroup.Text>功率kW</InputGroup.Text>
                  <Form.Control type="number" placeholder="248" value={cond.power} onChange={e => updateCondition(idx, 'power', e.target.value)} />
                  <InputGroup.Text>转速rpm</InputGroup.Text>
                  <Form.Control type="number" placeholder="1500" value={cond.speed} onChange={e => updateCondition(idx, 'speed', e.target.value)} />
                  <InputGroup.Text>减速比</InputGroup.Text>
                  <Form.Control type="number" step="0.01" placeholder="3.5" value={cond.ratio} onChange={e => updateCondition(idx, 'ratio', e.target.value)} />
                </InputGroup>
              </Col>
              <Col xs="auto">
                <Form.Select size="sm" style={{ width: 90 }} value={cond.weight} onChange={e => updateCondition(idx, 'weight', parseInt(e.target.value))}>
                  {WEIGHT_OPTIONS.map(w => <option key={w.value} value={w.value}>{w.label}</option>)}
                </Form.Select>
              </Col>
              <Col xs="auto">
                <Button size="sm" variant="outline-danger" onClick={() => removeCondition(idx)} disabled={conditions.length <= 1}><i className="bi bi-trash"></i></Button>
              </Col>
            </Row>
          ))}
          <div className="mt-2 d-flex justify-content-between align-items-center">
            <small className="text-muted">权重: 高(3x)=关键工况, 中(2x)=常用工况, 低(1x)=偶尔工况</small>
            <Button variant="primary" onClick={runSelection}><i className="bi bi-play-fill me-1"></i>开始选型</Button>
          </div>
        </Card.Body>
      </Card>

      {results && (
        <>
          <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>选型结果 — {results.items.length} 个型号满足 {results.totalConditions} 组工况中的至少1组</span>
              <Button size="sm" variant="outline-success" onClick={() => exportResultsCSV(results, conditions)} disabled={results.items.length === 0}>
                <i className="bi bi-download me-1"></i>导出CSV
              </Button>
            </Card.Header>
            <Card.Body className="p-0">
              {results.items.length === 0 ? (
                <Alert variant="warning" className="m-3">未找到满足任何工况的型号</Alert>
              ) : (
                <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                  <Table hover size="sm" className="mb-0">
                    <thead className="sticky-top bg-light">
                      <tr><th>型号</th><th>系列</th><th>满足工况</th><th>加权得分</th><th>校验详情</th></tr>
                    </thead>
                    <tbody>
                      {results.items.map((r, i) => (
                        <tr key={r.model + i} className={r.matchCount === results.totalConditions ? 'table-success' : ''}>
                          <td><strong>{r.model}</strong></td>
                          <td><Badge bg="secondary">{r.series}</Badge></td>
                          <td><Badge bg={r.matchCount === results.totalConditions ? 'success' : 'warning'}>{r.matchCount}/{results.totalConditions}</Badge></td>
                          <td>{r.score}</td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {r.details.map((d, di) => (
                                <span key={di}>
                                  <Badge bg={d.matched ? 'outline-success' : 'outline-danger'} text={d.matched ? 'success' : 'danger'} className="border me-1">
                                    {d.label}({WEIGHT_OPTIONS.find(w => w.value === d.weight)?.label || '中'}): {d.matched ? '\u2713' : '\u2717'}
                                  </Badge>
                                  {d.checks.filter(c => c.detail || !c.ok).map((c, ci) => (
                                    <small key={ci} className={`me-1 ${c.ok ? 'text-success' : 'text-danger'}`}>
                                      {c.param}{c.detail ? `(${c.detail})` : c.reason ? `(${c.reason})` : ''}
                                    </small>
                                  ))}
                                </span>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              )}
            </Card.Body>
          </Card>

          {/* Radar chart for top 3 models */}
          {radarData && (
            <Card className="mb-3">
              <Card.Header>Top 3 型号工况得分雷达图</Card.Header>
              <Card.Body>
                <ResponsiveContainer width="100%" height={340}>
                  <RadarChart data={radarData.data} cx="50%" cy="50%" outerRadius="75%">
                    <PolarGrid strokeDasharray="3 3" />
                    <PolarAngleAxis dataKey="condition" tick={{ fontSize: 12 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Tooltip />
                    {radarData.models.map((model, i) => (
                      <Radar
                        key={model}
                        name={model}
                        dataKey={model}
                        stroke={RADAR_COLORS[i]}
                        fill={RADAR_COLORS[i]}
                        fillOpacity={0.15}
                        strokeWidth={2}
                        dot={{ r: 3 }}
                      />
                    ))}
                    <Legend wrapperStyle={{ fontSize: 12 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Container>
  );
}
