// src/components/TrendAnalysisView.js
// 历史数据趋势分析：选型频次、报价趋势、热门型号分析
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, Tab, Tabs } from 'react-bootstrap';

function getSelectionHistory() {
  try { return JSON.parse(localStorage.getItem('selectionHistory') || '[]'); } catch { return []; }
}

function getQuotationHistory() {
  try { return JSON.parse(localStorage.getItem('gearbox_quotations') || '[]'); } catch { return []; }
}

function groupByMonth(items, dateField) {
  const groups = {};
  items.forEach(item => {
    const d = item[dateField] || item.date || item.createdAt;
    if (!d) return;
    const month = d.substring(0, 7);
    groups[month] = (groups[month] || 0) + 1;
  });
  return Object.entries(groups).sort((a, b) => a[0].localeCompare(b[0]));
}

function countByField(items, field) {
  const counts = {};
  items.forEach(item => {
    const val = item[field] || '未知';
    counts[val] = (counts[val] || 0) + 1;
  });
  return Object.entries(counts).sort((a, b) => b[1] - a[1]);
}

function SimpleBarChart({ data, label, maxBars = 12 }) {
  const sliced = data.slice(-maxBars);
  if (sliced.length === 0) return <p className="text-muted text-center py-3">暂无数据</p>;
  const maxVal = Math.max(...sliced.map(d => d[1]), 1);
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 160, padding: '0 8px' }}>
      {sliced.map(([key, val], i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <small style={{ fontSize: '0.7rem' }}>{val}</small>
          <div style={{ width: '100%', height: `${(val / maxVal) * 120}px`, background: '#0d6efd', borderRadius: '3px 3px 0 0', minHeight: 2 }}></div>
          <small style={{ fontSize: '0.6rem', transform: 'rotate(-45deg)', transformOrigin: 'center', whiteSpace: 'nowrap', marginTop: 4 }}>{key.length > 7 ? key.slice(5) : key}</small>
        </div>
      ))}
    </div>
  );
}

export default function TrendAnalysisView({ colors, theme }) {
  const [period, setPeriod] = useState('all');

  const selectionHistory = useMemo(() => getSelectionHistory(), []);
  const quotationHistory = useMemo(() => getQuotationHistory(), []);

  const filterByPeriod = (items, dateField) => {
    if (period === 'all') return items;
    const now = new Date();
    const cutoff = new Date();
    if (period === '30d') cutoff.setDate(now.getDate() - 30);
    else if (period === '90d') cutoff.setDate(now.getDate() - 90);
    else if (period === '180d') cutoff.setDate(now.getDate() - 180);
    return items.filter(item => {
      const d = item[dateField] || item.date || item.createdAt;
      return d && new Date(d) >= cutoff;
    });
  };

  const filteredSelections = useMemo(() => filterByPeriod(selectionHistory, 'date'), [selectionHistory, period]);
  const filteredQuotations = useMemo(() => filterByPeriod(quotationHistory, 'createdAt'), [quotationHistory, period]);

  const selectionByMonth = useMemo(() => groupByMonth(filteredSelections, 'date'), [filteredSelections]);
  const quotationByMonth = useMemo(() => groupByMonth(filteredQuotations, 'createdAt'), [filteredQuotations]);
  const topModels = useMemo(() => countByField(filteredSelections, 'model').slice(0, 10), [filteredSelections]);
  const topCustomers = useMemo(() => countByField(filteredQuotations, 'customerName').slice(0, 10), [filteredQuotations]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3 align-items-center">
        <Col>
          <h5><i className="bi bi-graph-up me-2"></i>趋势分析</h5>
        </Col>
        <Col md={3}>
          <Form.Select size="sm" value={period} onChange={e => setPeriod(e.target.value)}>
            <option value="all">全部时间</option>
            <option value="30d">近30天</option>
            <option value="90d">近90天</option>
            <option value="180d">近半年</option>
          </Form.Select>
        </Col>
      </Row>

      {/* 概览卡片 */}
      <Row className="mb-3">
        {[
          { title: '选型记录', value: filteredSelections.length, icon: 'bi-crosshair', color: 'primary' },
          { title: '报价记录', value: filteredQuotations.length, icon: 'bi-currency-yen', color: 'success' },
          { title: '涉及型号', value: new Set(filteredSelections.map(s => s.model)).size, icon: 'bi-cpu', color: 'info' },
          { title: '客户数量', value: new Set(filteredQuotations.map(q => q.customerName).filter(Boolean)).size, icon: 'bi-people', color: 'warning' },
        ].map((item, i) => (
          <Col md={3} key={i}>
            <Card className="text-center">
              <Card.Body className="py-2">
                <i className={`bi ${item.icon} text-${item.color}`} style={{ fontSize: '1.5rem' }}></i>
                <h4 className="mb-0 mt-1">{item.value}</h4>
                <small className="text-muted">{item.title}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Tabs defaultActiveKey="selection" className="mb-3">
        <Tab eventKey="selection" title="选型趋势">
          <Row>
            <Col md={7}>
              <Card>
                <Card.Header>月度选型次数</Card.Header>
                <Card.Body>
                  <SimpleBarChart data={selectionByMonth} label="选型次数" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <Card>
                <Card.Header>热门型号 TOP 10</Card.Header>
                <Card.Body className="p-0">
                  <Table size="sm" className="mb-0">
                    <thead><tr><th>#</th><th>型号</th><th>次数</th></tr></thead>
                    <tbody>
                      {topModels.length === 0 ? (
                        <tr><td colSpan={3} className="text-center text-muted py-3">暂无选型记录</td></tr>
                      ) : topModels.map(([model, count], i) => (
                        <tr key={model}><td>{i + 1}</td><td>{model}</td><td><Badge bg="primary">{count}</Badge></td></tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="quotation" title="报价趋势">
          <Row>
            <Col md={7}>
              <Card>
                <Card.Header>月度报价单数</Card.Header>
                <Card.Body>
                  <SimpleBarChart data={quotationByMonth} label="报价数" />
                </Card.Body>
              </Card>
            </Col>
            <Col md={5}>
              <Card>
                <Card.Header>活跃客户 TOP 10</Card.Header>
                <Card.Body className="p-0">
                  <Table size="sm" className="mb-0">
                    <thead><tr><th>#</th><th>客户</th><th>报价数</th></tr></thead>
                    <tbody>
                      {topCustomers.length === 0 ? (
                        <tr><td colSpan={3} className="text-center text-muted py-3">暂无报价记录</td></tr>
                      ) : topCustomers.map(([name, count], i) => (
                        <tr key={name}><td>{i + 1}</td><td>{name || '未命名'}</td><td><Badge bg="success">{count}</Badge></td></tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}
