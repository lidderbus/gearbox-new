// src/components/competitor/ParametricCompareView.js
// B2: 参数级三方对比视图 — 输入工况 → 杭齿/ZF/Reintjes/Twin Disc/Masson/Kanzaki 候选 + 价差表 + 醒目免责
//
// 依赖: src/data/foreignGearboxMapping.js + src/utils/foreignGearboxAnalysis.js
// 接入示例: 在 CompetitorComparisonView 加 Tab "参数级对比" 并 import 本组件

import React, { useMemo, useState } from 'react';
import { Card, Form, Row, Col, Button, Badge, Alert, Table } from 'react-bootstrap';
import {
  findEquivalentForeign,
  priceMidpointUSD,
  getForeignDatabaseStats
} from '../../utils/foreignGearboxAnalysis';
import {
  foreignBrands,
  PRICE_DISCLAIMER
} from '../../data/foreignGearboxMapping';

const BrandColor = {
  'ZF Marine': 'primary',
  'Reintjes': 'info',
  'Twin Disc': 'warning',
  'Masson Marine': 'success',
  'Kanzaki': 'secondary'
};

const ConfidenceBadge = ({ confidence }) => (
  <Badge bg={confidence === 'high' ? 'success' : confidence === 'medium' ? 'warning' : 'secondary'} pill>
    {confidence}
  </Badge>
);

const fmtUSD = (n) => n == null ? '—' : `$${n.toLocaleString('en-US')}`;
const fmtEUR = (n) => n == null ? '—' : `€${n.toLocaleString('en-US')}`;
const fmtCNY = (n) => n == null ? '—' : `¥${n.toLocaleString('zh-CN')}`;

const ParametricCompareView = ({ colors = {}, defaultPower, defaultRatio, defaultSpeed }) => {
  const [power, setPower] = useState(defaultPower != null ? String(defaultPower) : '1850');
  const [ratio, setRatio] = useState(defaultRatio != null ? String(defaultRatio) : '3.5');
  const [speed, setSpeed] = useState(defaultSpeed != null ? String(defaultSpeed) : '1800');
  const [brand, setBrand] = useState('all');
  const [exchangeUSD2CNY, setExchangeUSD2CNY] = useState('7.20');

  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  const stats = useMemo(() => getForeignDatabaseStats(), []);

  const candidates = useMemo(() => {
    const p = Number(power), r = Number(ratio), s = Number(speed);
    if (!p || !r || !s) return [];
    return findEquivalentForeign(
      { power_kW: p, ratio: r, inputSpeed_rpm: s },
      brand === 'all' ? {} : { brand }
    );
  }, [power, ratio, speed, brand]);

  const exch = Number(exchangeUSD2CNY) || 7.2;

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f1f7ff', color: colors.headerText || '#0a58ca' }}>
        <strong>
          <i className="bi bi-bar-chart me-2"></i>
          参数级三方对比 (杭齿 ↔ ZF / Reintjes / Twin Disc / Masson / Kanzaki)
        </strong>
        <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.7em' }}>库内 {stats.total} 海外型号</Badge>
      </Card.Header>
      <Card.Body>
        <Alert variant="warning" className="py-2 px-3 mb-3" style={{ fontSize: '0.88em' }}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          <strong>免责: </strong>{PRICE_DISCLAIMER}。海外参考价为公开 Catalog 区间(年份口径标注), 不代表当前实时报价。
        </Alert>

        <Form>
          <Row className="g-2 mb-3">
            <Col md={2}>
              <Form.Label>功率 kW *</Form.Label>
              <Form.Control type="number" value={power} onChange={e => setPower(e.target.value)} placeholder="1850" style={inputStyle} />
            </Col>
            <Col md={2}>
              <Form.Label>速比 *</Form.Label>
              <Form.Control type="number" step="0.1" value={ratio} onChange={e => setRatio(e.target.value)} placeholder="3.5" style={inputStyle} />
            </Col>
            <Col md={2}>
              <Form.Label>输入转速 rpm *</Form.Label>
              <Form.Control type="number" value={speed} onChange={e => setSpeed(e.target.value)} placeholder="1800" style={inputStyle} />
            </Col>
            <Col md={3}>
              <Form.Label>品牌过滤</Form.Label>
              <Form.Select value={brand} onChange={e => setBrand(e.target.value)} style={inputStyle}>
                <option value="all">全部 ({stats.total})</option>
                {foreignBrands.map(b => (
                  <option key={b} value={b}>{b} ({stats.byBrand[b] || 0})</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Label>USD→CNY 汇率</Form.Label>
              <Form.Control type="number" step="0.01" value={exchangeUSD2CNY} onChange={e => setExchangeUSD2CNY(e.target.value)} style={inputStyle} />
            </Col>
            <Col md={1} className="d-flex align-items-end">
              <Button variant="outline-secondary" onClick={() => { setPower('1850'); setRatio('3.5'); setSpeed('1800'); setBrand('all'); }}>
                <i className="bi bi-arrow-counterclockwise"></i>
              </Button>
            </Col>
          </Row>
        </Form>

        {candidates.length === 0 ? (
          <Alert variant="info" className="my-3">
            未找到匹配海外型号。请放宽输入或检查参数 (容差: 功率±25% · 速比±20% · 输入转速±20%)。
          </Alert>
        ) : (
          <>
            <Table striped bordered hover responsive size="sm" className="mt-3">
              <thead style={{ backgroundColor: '#eef4ff' }}>
                <tr>
                  <th>品牌</th>
                  <th>海外型号</th>
                  <th>功率 kW</th>
                  <th>速比范围</th>
                  <th>输入转速 rpm</th>
                  <th>重量 kg</th>
                  <th>船级社</th>
                  <th>参考价 (USD)</th>
                  <th>参考价 (EUR)</th>
                  <th>≈ ¥CNY 中位</th>
                  <th>匹配度</th>
                  <th>对位杭齿型号</th>
                </tr>
              </thead>
              <tbody>
                {candidates.map(c => {
                  const usdMid = priceMidpointUSD(c, 1.08);
                  const cnyMid = usdMid != null ? Math.round(usdMid * exch) : null;
                  const ratioRangeText = c.ratios.length > 0
                    ? `${Math.min(...c.ratios).toFixed(2)}–${Math.max(...c.ratios).toFixed(2)}`
                    : '—';
                  return (
                    <tr key={c.id}>
                      <td>
                        <Badge bg={BrandColor[c.brand] || 'secondary'}>{c.brand}</Badge>
                      </td>
                      <td><strong>{c.foreignModel}</strong></td>
                      <td>{c.power_kW}</td>
                      <td>{ratioRangeText}</td>
                      <td>{c.inputSpeed_rpm}</td>
                      <td>{c.weight_kg ?? '—'}</td>
                      <td style={{ fontSize: '0.8em' }}>{c.classifications.join('/')}</td>
                      <td>{c.referencePrice?.USD ? `${fmtUSD(c.referencePrice.USD.min)}–${fmtUSD(c.referencePrice.USD.max)}` : '—'}</td>
                      <td>{c.referencePrice?.EUR ? `${fmtEUR(c.referencePrice.EUR.min)}–${fmtEUR(c.referencePrice.EUR.max)}` : '—'}</td>
                      <td>{fmtCNY(cnyMid)}</td>
                      <td>
                        <Badge bg={c.matchScore >= 80 ? 'success' : c.matchScore >= 50 ? 'warning' : 'secondary'}>
                          {c.matchScore.toFixed(1)}
                        </Badge>
                      </td>
                      <td>
                        {c.hangchiMatches?.length > 0 ? (
                          <div>
                            {c.hangchiMatches.slice(0, 3).map((m, i) => (
                              <div key={i} style={{ marginBottom: 2, fontSize: '0.85em' }}>
                                <strong>{m.model}</strong> <ConfidenceBadge confidence={m.confidence} />
                                <span className="text-muted ms-1" style={{ fontSize: '0.85em' }}>· {m.reason}</span>
                              </div>
                            ))}
                          </div>
                        ) : <span className="text-muted">—</span>}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>

            <div className="mt-2 text-muted" style={{ fontSize: '0.78em' }}>
              数据源: 各厂商公开 Catalog · 参考价年份口径见原数据 · 海外参考价仅作"对位估算" · 国内成交以杭齿正式报价为准
            </div>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default ParametricCompareView;
