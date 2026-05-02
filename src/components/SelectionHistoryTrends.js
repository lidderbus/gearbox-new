import React, { useMemo } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '../config/echartsSetup';

function extractSeries(model) {
  if (!model) return '';
  const m = model.match(/^(HCT|HCD|HCQ|HCA|HCM|HCW|HC|GWC|GWS|GWL|GWK|SGW|DT|GCS|2GWH)/i);
  return m ? m[1].toUpperCase() : '';
}

const SelectionHistoryTrends = () => {
  const history = useMemo(() => {
    try { return JSON.parse(localStorage.getItem('gearbox_selection_history') || '[]'); }
    catch { return []; }
  }, []);

  const stats = useMemo(() => {
    if (history.length === 0) return null;

    // Power distribution
    const powerBuckets = { '0-100kW': 0, '100-300kW': 0, '300-600kW': 0, '600-1000kW': 0, '1000-3000kW': 0, '3000+kW': 0 };
    // Speed distribution
    const speedBuckets = { '0-750': 0, '750-1200': 0, '1200-1500': 0, '1500-1800': 0, '1800-2500': 0, '2500+': 0 };
    // Series popularity
    const seriesCount = {};
    // Monthly trend
    const monthlyCount = {};

    history.forEach(h => {
      const power = h.enginePower || h.power || 0;
      if (power <= 100) powerBuckets['0-100kW']++;
      else if (power <= 300) powerBuckets['100-300kW']++;
      else if (power <= 600) powerBuckets['300-600kW']++;
      else if (power <= 1000) powerBuckets['600-1000kW']++;
      else if (power <= 3000) powerBuckets['1000-3000kW']++;
      else powerBuckets['3000+kW']++;

      const speed = h.engineSpeed || h.speed || 0;
      if (speed <= 750) speedBuckets['0-750']++;
      else if (speed <= 1200) speedBuckets['750-1200']++;
      else if (speed <= 1500) speedBuckets['1200-1500']++;
      else if (speed <= 1800) speedBuckets['1500-1800']++;
      else if (speed <= 2500) speedBuckets['1800-2500']++;
      else speedBuckets['2500+']++;

      const series = h.selectedModel ? extractSeries(h.selectedModel) : '';
      if (series) { seriesCount[series] = (seriesCount[series] || 0) + 1; }

      const month = (h.timestamp || h.date || '').substring(0, 7);
      if (month) { monthlyCount[month] = (monthlyCount[month] || 0) + 1; }
    });

    return { powerBuckets, speedBuckets, seriesCount, monthlyCount, total: history.length };
  }, [history]);

  if (!stats || stats.total === 0) {
    return (
      <Card className="mt-3">
        <Card.Body className="text-center text-muted py-4">
          <i className="bi bi-clock-history" style={{ fontSize: 32 }}></i>
          <p className="mt-2">暂无选型历史数据</p>
        </Card.Body>
      </Card>
    );
  }

  const powerChartOption = {
    tooltip: { trigger: 'axis' },
    xAxis: { type: 'category', data: Object.keys(stats.powerBuckets), axisLabel: { fontSize: 10, rotate: 20 } },
    yAxis: { type: 'value', name: '次数' },
    series: [{ type: 'bar', data: Object.values(stats.powerBuckets), itemStyle: { color: '#3b82f6', borderRadius: [4, 4, 0, 0] } }],
    grid: { top: 30, bottom: 40, left: 40, right: 10 }
  };

  const seriesEntries = Object.entries(stats.seriesCount).sort((a, b) => b[1] - a[1]).slice(0, 8);
  const seriesChartOption = {
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    series: [{
      type: 'pie', radius: ['35%', '65%'],
      data: seriesEntries.map(([name, value]) => ({ name, value })),
      label: { show: true, fontSize: 10, formatter: '{b}\n{c}' }
    }]
  };

  return (
    <Card className="mt-3">
      <Card.Header>
        <i className="bi bi-graph-up me-2"></i>选型历史趋势
        <Badge bg="secondary" className="ms-2">{stats.total} 次选型</Badge>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <h6 className="text-center mb-2" style={{ fontSize: 13 }}>功率分布</h6>
            <ReactEChartsCore echarts={echarts} option={powerChartOption} style={{ height: 220 }} />
          </Col>
          <Col md={6}>
            <h6 className="text-center mb-2" style={{ fontSize: 13 }}>系列偏好</h6>
            <ReactEChartsCore echarts={echarts} option={seriesChartOption} style={{ height: 220 }} />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SelectionHistoryTrends;
