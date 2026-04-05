// src/components/TrendAnalysisView.js
// 历史数据趋势分析：选型频次、报价趋势、热门型号分析 (Recharts版)
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, ButtonGroup, Button, Alert } from 'react-bootstrap';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8',
  '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'];

const PERIOD_OPTIONS = [
  { key: 'all', label: '全部' },
  { key: '30d', label: '近30天' },
  { key: '90d', label: '近90天' },
  { key: '180d', label: '近半年' },
];

function safeJsonParse(key, fallback = []) {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; }
}

function getSelectionHistory() { return safeJsonParse('selectionHistory', []); }
function getQuotationHistory() { return safeJsonParse('gearbox_quotations', []); }

function getDateValue(item) { return item.date || item.createdAt || ''; }

function filterByPeriod(items, period) {
  if (period === 'all') return items;
  const cutoff = new Date();
  const days = period === '30d' ? 30 : period === '90d' ? 90 : 180;
  cutoff.setDate(cutoff.getDate() - days);
  return items.filter(item => { const d = getDateValue(item); return d && new Date(d) >= cutoff; });
}

/** Build last-12-month array with selection + quotation counts merged */
function buildMonthlyData(selections, quotations) {
  const counts = {};
  selections.forEach(item => {
    const d = getDateValue(item); if (!d) return;
    const m = d.substring(0, 7);
    if (!counts[m]) counts[m] = { selections: 0, quotations: 0 };
    counts[m].selections++;
  });
  quotations.forEach(item => {
    const d = getDateValue(item); if (!d) return;
    const m = d.substring(0, 7);
    if (!counts[m]) counts[m] = { selections: 0, quotations: 0 };
    counts[m].quotations++;
  });
  return Object.entries(counts)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-12)
    .map(([month, v]) => {
      const [, mm] = month.split('-');
      return { month, label: `${parseInt(mm)}月`, selections: v.selections, quotations: v.quotations };
    });
}

/** Count occurrences of a field, return sorted desc */
function countByField(items, field) {
  const map = {};
  items.forEach(item => { const v = item[field] || '未知'; map[v] = (map[v] || 0) + 1; });
  return Object.entries(map).sort((a, b) => b[1] - a[1]);
}

/** Group by year for YoY comparison */
function buildYoyData(selections) {
  const yearMap = {};
  selections.forEach(item => {
    const d = getDateValue(item); if (!d) return;
    const year = d.substring(0, 4);
    const mm = parseInt(d.substring(5, 7));
    if (!yearMap[year]) yearMap[year] = {};
    yearMap[year][mm] = (yearMap[year][mm] || 0) + 1;
  });
  const years = Object.keys(yearMap).sort();
  if (years.length < 2) return null;
  const recent2 = years.slice(-2);
  const data = [];
  for (let m = 1; m <= 12; m++) {
    const row = { label: `${m}月` };
    recent2.forEach(y => { row[y] = yearMap[y]?.[m] || 0; });
    data.push(row);
  }
  return { years: recent2, data };
}

/** Custom tooltip for consistent styling */
const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', padding: '8px 12px', borderRadius: 4, fontSize: 13, boxShadow: '0 2px 6px rgba(0,0,0,0.1)' }}>
      <strong>{label}</strong>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>{p.name}: {p.value}</div>
      ))}
    </div>
  );
};

/** Pie chart label renderer */
const renderPieLabel = ({ name, percent }) =>
  percent > 0.04 ? `${name} ${(percent * 100).toFixed(0)}%` : '';

/** Export trend data to CSV */
function exportCsv(monthlyData, topModels) {
  const BOM = '\uFEFF';
  let csv = BOM + '月度趋势\n月份,选型次数,报价次数\n';
  monthlyData.forEach(r => { csv += `${r.month},${r.selections},${r.quotations}\n`; });
  csv += '\n热门型号 TOP10\n排名,型号,次数\n';
  topModels.forEach(([model, count], i) => { csv += `${i + 1},${model},${count}\n`; });
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `趋势分析_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

export default function TrendAnalysisView({ colors, theme }) {
  const [period, setPeriod] = useState('all');

  const selectionHistory = useMemo(() => getSelectionHistory(), []);
  const quotationHistory = useMemo(() => getQuotationHistory(), []);

  const filteredSelections = useMemo(() => filterByPeriod(selectionHistory, period), [selectionHistory, period]);
  const filteredQuotations = useMemo(() => filterByPeriod(quotationHistory, period), [quotationHistory, period]);

  const monthlyData = useMemo(() => buildMonthlyData(filteredSelections, filteredQuotations), [filteredSelections, filteredQuotations]);
  const topModels = useMemo(() => countByField(filteredSelections, 'model').slice(0, 10), [filteredSelections]);
  const yoyResult = useMemo(() => buildYoyData(selectionHistory), [selectionHistory]);

  const pieData = useMemo(() =>
    topModels.map(([name, value]) => ({ name, value })),
    [topModels]
  );

  // KPIs
  const totalCount = filteredSelections.length;
  const now = new Date();
  const thisMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const thisMonthCount = filteredSelections.filter(s => (getDateValue(s) || '').startsWith(thisMonthKey)).length;
  const monthSpan = monthlyData.length || 1;
  const monthlyAvg = (totalCount / monthSpan).toFixed(1);
  const hotModel = topModels.length > 0 ? topModels[0][0] : '-';

  const hasQuotations = filteredQuotations.length > 0;

  const handleExport = useCallback(() => exportCsv(monthlyData, topModels), [monthlyData, topModels]);

  const noData = totalCount === 0 && filteredQuotations.length === 0;

  return (
    <Container fluid className="py-3">
      {/* Header row with filters and export */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h5 className="mb-0"><i className="bi bi-graph-up me-2"></i>趋势分析</h5>
        </Col>
        <Col xs="auto">
          <ButtonGroup size="sm">
            {PERIOD_OPTIONS.map(opt => (
              <Button key={opt.key} variant={period === opt.key ? 'primary' : 'outline-secondary'}
                onClick={() => setPeriod(opt.key)}>{opt.label}</Button>
            ))}
          </ButtonGroup>
        </Col>
        <Col xs="auto">
          <Button size="sm" variant="outline-success" onClick={handleExport} disabled={noData}>
            <i className="bi bi-download me-1"></i>导出CSV
          </Button>
        </Col>
      </Row>

      {noData && (
        <Alert variant="info" className="text-center">暂无选型或报价历史数据，开始使用选型功能后将自动生成趋势分析。</Alert>
      )}

      {/* KPI cards */}
      <Row className="mb-3 g-2">
        {[
          { title: '总选型次数', value: totalCount, icon: 'bi-crosshair', color: 'primary' },
          { title: '本月新增', value: thisMonthCount, icon: 'bi-calendar-plus', color: 'success' },
          { title: '月均选型', value: monthlyAvg, icon: 'bi-bar-chart-line', color: 'info' },
          { title: '最热门型号', value: hotModel, icon: 'bi-trophy', color: 'warning', isText: true },
        ].map((item, i) => (
          <Col md={3} sm={6} key={i}>
            <Card className="text-center h-100">
              <Card.Body className="py-2">
                <i className={`bi ${item.icon} text-${item.color}`} style={{ fontSize: '1.4rem' }}></i>
                <div className={`${item.isText ? 'fs-6' : 'fs-4'} fw-bold mb-0 mt-1`}>{item.value}</div>
                <small className="text-muted">{item.title}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Monthly trend chart */}
      <Row className="mb-3">
        <Col lg={7}>
          <Card className="h-100">
            <Card.Header className="py-2 d-flex justify-content-between align-items-center">
              <span>月度选型趋势{hasQuotations ? ' / 报价对比' : ''}</span>
              <small className="text-muted">最近12个月</small>
            </Card.Header>
            <Card.Body>
              {monthlyData.length === 0 ? (
                <p className="text-muted text-center py-5">暂无数据</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={monthlyData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar dataKey="selections" name="选型次数" fill="#0088FE" radius={[3, 3, 0, 0]} />
                    {hasQuotations && (
                      <Line type="monotone" dataKey="quotations" name="报价次数" stroke="#FF8042" strokeWidth={2} dot={{ r: 3 }} />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Pie chart - top 10 models */}
        <Col lg={5}>
          <Card className="h-100">
            <Card.Header className="py-2">热门型号 TOP 10</Card.Header>
            <Card.Body>
              {pieData.length === 0 ? (
                <p className="text-muted text-center py-5">暂无选型记录</p>
              ) : (
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%"
                      outerRadius={95} innerRadius={40} paddingAngle={2}
                      label={renderPieLabel} labelLine={{ strokeWidth: 1 }}>
                      {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip formatter={(value, name) => [`${value} 次`, name]} />
                    <Legend layout="vertical" align="right" verticalAlign="middle"
                      formatter={(value) => <span style={{ fontSize: 12 }}>{value}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Year-over-year comparison */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="py-2">年度同比对比</Card.Header>
            <Card.Body>
              {!yoyResult ? (
                <p className="text-muted text-center py-4">
                  <i className="bi bi-info-circle me-1"></i>数据不足 - 需要至少2个年度的选型数据才能生成同比分析
                </p>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={yoyResult.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip content={<ChartTooltip />} />
                    <Legend />
                    <Bar dataKey={yoyResult.years[0]} name={`${yoyResult.years[0]}年`} fill="#8884D8" radius={[3, 3, 0, 0]} />
                    <Bar dataKey={yoyResult.years[1]} name={`${yoyResult.years[1]}年`} fill="#00C49F" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
