// src/components/MultiConditionSelection.js
// 多工况复合选型：同时指定多组工况参数，筛选满足所有工况的齿轮箱
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup } from 'react-bootstrap';

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

const EMPTY_CONDITION = { power: '', speed: '', ratio: '', label: '' };

function checkModelFit(item, conditions) {
  const ratios = Array.isArray(item.ratios) ? item.ratios : [];
  const caps = Array.isArray(item.transferCapacity) ? item.transferCapacity : [];
  const minSpeed = item.inputSpeedRange ? item.inputSpeedRange[0] : 0;
  const maxSpeed = item.inputSpeedRange ? item.inputSpeedRange[1] : 99999;

  let totalScore = 0;
  let matchCount = 0;
  const details = [];

  conditions.forEach((cond, idx) => {
    const power = parseFloat(cond.power);
    const speed = parseFloat(cond.speed);
    const ratio = parseFloat(cond.ratio);
    if (isNaN(power) && isNaN(speed) && isNaN(ratio)) return;

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
      // 找最接近的减速比
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

        // 用该减速比对应的传递能力校验功率
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
      // 只有功率+转速，检查任意减速比能否满足
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
    totalScore += condScore;
    details.push({ idx: idx + 1, checks, matched: condMatch, label: cond.label || `工况${idx + 1}` });
  });

  return { score: totalScore, matchCount, details, model: item.model || item.name, series: getSeries(item.model || item.name) };
}

export default function MultiConditionSelection({ colors, theme }) {
  const [conditions, setConditions] = useState([{ ...EMPTY_CONDITION, label: '自由航行' }, { ...EMPTY_CONDITION, label: '满载工况' }]);
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [results, setResults] = useState(null);

  const updateCondition = useCallback((idx, field, value) => {
    setConditions(prev => prev.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  }, []);

  const addCondition = useCallback(() => {
    if (conditions.length >= 5) return;
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

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-layers me-2"></i>多工况复合选型</h5>
          <small className="text-muted">同时指定多组工况（如自由航行+拖带），筛选满足所有工况的齿轮箱 ({embeddedData.length}型号)</small>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>工况参数 ({conditions.length}/5)</span>
          <div className="d-flex gap-2">
            <Form.Select size="sm" style={{ width: 150 }} value={seriesFilter} onChange={e => setSeriesFilter(e.target.value)}>
              <option value="all">全部系列</option>
              {['HC','HCD','HCA','GWC','GW','GC','HCM','DT','MV','SGW','HCQ'].map(s => <option key={s} value={s}>{s}系列</option>)}
            </Form.Select>
            <Button size="sm" variant="outline-primary" onClick={addCondition} disabled={conditions.length >= 5}><i className="bi bi-plus"></i> 添加工况</Button>
          </div>
        </Card.Header>
        <Card.Body>
          {conditions.map((cond, idx) => (
            <Row key={idx} className="mb-2 align-items-center">
              <Col xs="auto">
                <Form.Control size="sm" style={{ width: 100 }} placeholder="工况名" value={cond.label} onChange={e => updateCondition(idx, 'label', e.target.value)} />
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
                <Button size="sm" variant="outline-danger" onClick={() => removeCondition(idx)} disabled={conditions.length <= 1}><i className="bi bi-trash"></i></Button>
              </Col>
            </Row>
          ))}
          <div className="mt-3 text-end">
            <Button variant="primary" onClick={runSelection}><i className="bi bi-play-fill me-1"></i>开始选型</Button>
          </div>
        </Card.Body>
      </Card>

      {results && (
        <Card>
          <Card.Header>选型结果 — {results.items.length} 个型号满足 {results.totalConditions} 组工况中的至少1组</Card.Header>
          <Card.Body className="p-0">
            {results.items.length === 0 ? (
              <Alert variant="warning" className="m-3">未找到满足任何工况的型号</Alert>
            ) : (
              <div style={{ maxHeight: '50vh', overflowY: 'auto' }}>
                <Table hover size="sm" className="mb-0">
                  <thead className="sticky-top bg-light">
                    <tr><th>型号</th><th>系列</th><th>满足工况</th><th>得分</th><th>校验详情</th></tr>
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
                                  {d.label}: {d.matched ? '✓' : '✗'}
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
      )}
    </Container>
  );
}
