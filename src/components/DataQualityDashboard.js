// src/components/DataQualityDashboard.js
// E8: Data Quality Dashboard - analyzes gearbox data completeness
// Computes all metrics from runtime embedded data (no server needed)

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Badge, Row, Col, ProgressBar, Alert, Modal, Button } from 'react-bootstrap';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '../config/echartsSetup';
import marketEnrichment from '../data/marketEnrichment.json';

const MARKET_RECORDS = (marketEnrichment && marketEnrichment.records) || {};
const MARKET_META = (marketEnrichment && marketEnrichment._meta) || {};

// Critical fields that should be populated for a complete gearbox record
// Note: embeddedData uses transferCapacity (not transmissionCapacityPerRatio)
//       and inputSpeedRange array (not minSpeed/maxSpeed)
const CRITICAL_FIELDS = [
  'model',
  'ratios',
  'transferCapacity',
  'thrust',
  'centerDistance',
  'weight',
  'dimensions',
  'price',
  'inputSpeedRange',
  'controlType',
  'efficiency',
  'notes',
];

const fieldLabels = {
  model: '型号',
  ratios: '减速比',
  transferCapacity: '传递能力',
  thrust: '推力(kN)',
  centerDistance: '中心距(mm)',
  weight: '重量(kg)',
  dimensions: '尺寸',
  price: '价格',
  inputSpeedRange: '转速范围',
  controlType: '操纵方式',
  efficiency: '效率',
  notes: '备注',
};

/**
 * Extract series prefix from model name
 */
function extractSeries(model) {
  if (!model) return 'other';
  const m = model.match(
    /^(HCTS|HCDS|HCT|HCD|HCQ|HCA|HCM|HCW|HCG|HCN|HCV|HCAG|HCAM|HCL|HC|GWC|GWS|GWL|GWK|GWH|GWD|SGW|SGWS|DT|GCS|GCH|GCST|GCHT|GCSE|GCHE|2GWH|MA|MB|MV)/i
  );
  return m ? m[1].toUpperCase() : 'other';
}

/**
 * Check if a field value counts as "filled"
 */
function isFilled(field, value) {
  if (value === undefined || value === null || value === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  // Numeric fields: 0 means missing for physical measurements
  if (value === 0 && ['thrust', 'centerDistance', 'weight', 'price'].includes(field)) return false;
  return true;
}

/**
 * Flatten the embeddedGearboxData object into a single array
 */
function flattenData(dataObj) {
  if (!dataObj || typeof dataObj !== 'object') return [];
  const result = [];
  for (const key of Object.keys(dataObj)) {
    if (Array.isArray(dataObj[key])) {
      result.push(...dataObj[key]);
    }
  }
  return result;
}

const DataQualityDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import('../data/embeddedData')
      .then((mod) => {
        const raw = mod.default || mod.embeddedGearboxData;
        // embeddedData is an object with multiple *Gearboxes arrays
        const flattened = Array.isArray(raw) ? raw : flattenData(raw);
        setData(flattened);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const analysis = useMemo(() => {
    if (!data || !Array.isArray(data) || data.length === 0) return null;

    // Group by series
    const seriesMap = {};
    data.forEach((g) => {
      const series = g.series || extractSeries(g.model) || 'other';
      if (!seriesMap[series]) seriesMap[series] = [];
      seriesMap[series].push(g);
    });

    // Field completeness per series
    const seriesNames = Object.keys(seriesMap).sort();
    const heatmapData = [];
    const fieldStats = {};

    CRITICAL_FIELDS.forEach((field, fi) => {
      fieldStats[field] = { total: 0, filled: 0 };
      seriesNames.forEach((series, si) => {
        const models = seriesMap[series];
        const filled = models.filter((g) => isFilled(field, g[field])).length;
        const pct = models.length > 0 ? Math.round((filled / models.length) * 100) : 0;
        heatmapData.push([si, fi, pct]);
        fieldStats[field].total += models.length;
        fieldStats[field].filled += filled;
      });
    });

    // Overall health score
    let totalCritical = 0;
    let filledCritical = 0;
    Object.values(fieldStats).forEach((s) => {
      totalCritical += s.total;
      filledCritical += s.filled;
    });
    const healthScore = totalCritical > 0 ? Math.round((filledCritical / totalCritical) * 100) : 0;

    // Per-series summary
    const seriesSummary = seriesNames.map((series) => {
      const models = seriesMap[series];
      let filledCount = 0;
      let totalCount = 0;
      CRITICAL_FIELDS.forEach((field) => {
        models.forEach((g) => {
          totalCount++;
          if (isFilled(field, g[field])) {
            filledCount++;
          }
        });
      });
      return {
        series,
        count: models.length,
        completeness: totalCount > 0 ? Math.round((filledCount / totalCount) * 100) : 0,
      };
    });

    // Missing price (common issue)
    const missingPrice = data.filter((g) => !g.price || g.price === 0).length;

    // Missing thrust
    const missingThrust = data.filter((g) => !g.thrust || g.thrust === 0).length;

    // 市场数据覆盖率 (有 ERP 销售/合同/采购记录的型号)
    const hasMarketList = [];
    const noMarketList = [];
    data.forEach((g) => {
      const hit = g.model && MARKET_RECORDS[String(g.model).toUpperCase()];
      if (hit) hasMarketList.push(g);
      else if (g.model) noMarketList.push(g);
    });
    const marketCoverage = data.length > 0
      ? Math.round((hasMarketList.length / data.length) * 100)
      : 0;

    return {
      heatmapData,
      seriesNames,
      fieldStats,
      healthScore,
      seriesSummary,
      totalModels: data.length,
      missingPrice,
      missingThrust,
      marketCoverage,
      marketHitCount: hasMarketList.length,
      noMarketList,
    };
  }, [data]);

  const [showNoMarketModal, setShowNoMarketModal] = useState(false);

  if (loading) {
    return <div className="text-center py-5">加载数据中...</div>;
  }
  if (!analysis) {
    return <Alert variant="warning">数据加载失败或数据为空</Alert>;
  }

  const heatmapOption = {
    tooltip: {
      formatter: (p) =>
        `${analysis.seriesNames[p.data[0]]} - ${fieldLabels[CRITICAL_FIELDS[p.data[1]]] || CRITICAL_FIELDS[p.data[1]]}: ${p.data[2]}%`,
    },
    grid: { top: 10, bottom: 60, left: 110, right: 30 },
    xAxis: {
      type: 'category',
      data: analysis.seriesNames,
      axisLabel: { rotate: 45, fontSize: 10 },
      splitArea: { show: true },
    },
    yAxis: {
      type: 'category',
      data: CRITICAL_FIELDS.map((f) => fieldLabels[f] || f),
      axisLabel: { fontSize: 10 },
      splitArea: { show: true },
    },
    visualMap: {
      min: 0,
      max: 100,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      inRange: { color: ['#ff4d4f', '#faad14', '#52c41a'] },
    },
    series: [
      {
        type: 'heatmap',
        data: analysis.heatmapData,
        label: {
          show: true,
          fontSize: 9,
          formatter: (p) => (p.data[2] > 0 ? `${p.data[2]}` : ''),
        },
        emphasis: {
          itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' },
        },
      },
    ],
  };

  const gaugeOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        pointer: { show: true },
        progress: { show: true, width: 18 },
        axisLine: { lineStyle: { width: 18 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 24,
          offsetCenter: [0, '60%'],
          formatter: '{value}%',
        },
        title: { offsetCenter: [0, '85%'], fontSize: 14 },
        data: [{ value: analysis.healthScore, name: '数据健康' }],
        itemStyle: {
          color:
            analysis.healthScore >= 80
              ? '#52c41a'
              : analysis.healthScore >= 60
                ? '#faad14'
                : '#ff4d4f',
        },
      },
    ],
  };

  const marketGaugeOption = {
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        pointer: { show: true },
        progress: { show: true, width: 18 },
        axisLine: { lineStyle: { width: 18 } },
        axisTick: { show: false },
        splitLine: { show: false },
        axisLabel: { show: false },
        detail: {
          valueAnimation: true,
          fontSize: 22,
          offsetCenter: [0, '60%'],
          formatter: '{value}%',
        },
        title: { offsetCenter: [0, '85%'], fontSize: 13 },
        data: [{ value: analysis.marketCoverage, name: '市场数据覆盖' }],
        itemStyle: {
          color:
            analysis.marketCoverage >= 30
              ? '#52c41a'
              : analysis.marketCoverage >= 15
                ? '#faad14'
                : '#1890ff',
        },
      },
    ],
  };

  return (
    <div className="data-quality-dashboard p-2">
      <h5 className="mb-3">
        <i className="bi bi-clipboard-data me-2"></i>数据质量仪表盘
      </h5>

      <Row className="mb-3">
        <Col md={3}>
          <Card className="text-center h-100">
            <Card.Body>
              <ReactEChartsCore
                echarts={echarts}
                option={gaugeOption}
                style={{ height: 200 }}
                notMerge
                lazyUpdate
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100" style={{ cursor: 'pointer' }} onClick={() => setShowNoMarketModal(true)} title="点击查看无市场数据的型号">
            <Card.Body className="p-2">
              <ReactEChartsCore
                echarts={echarts}
                option={marketGaugeOption}
                style={{ height: 160 }}
                notMerge
                lazyUpdate
              />
              <div className="text-muted" style={{ fontSize: 12 }}>
                {analysis.marketHitCount}/{analysis.totalModels} 型号有 ERP 交易记录
                {MARKET_META.marketDataTag && <span className="ms-1">({MARKET_META.marketDataTag})</span>}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Body className="d-flex flex-column justify-content-center text-center p-2">
              <h3 className="text-primary mb-1">{analysis.totalModels}</h3>
              <div className="text-muted" style={{ fontSize: 12 }}>型号总数</div>
              <hr className="my-2" />
              <h4 className="text-warning mb-1">{analysis.missingPrice}</h4>
              <div className="text-muted" style={{ fontSize: 12 }}>缺失价格</div>
              <hr className="my-2" />
              <h4 className="text-danger mb-1">{analysis.missingThrust}</h4>
              <div className="text-muted" style={{ fontSize: 12 }}>缺失推力</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100">
            <Card.Header className="py-2">
              <strong>系列完整度排名</strong>
            </Card.Header>
            <Card.Body className="p-2" style={{ maxHeight: 240, overflowY: 'auto' }}>
              {analysis.seriesSummary
                .sort((a, b) => b.completeness - a.completeness)
                .map((s) => (
                  <div key={s.series} className="d-flex align-items-center mb-1">
                    <Badge bg="secondary" className="me-2" style={{ minWidth: 55, fontFamily: 'monospace' }}>
                      {s.series}
                    </Badge>
                    <ProgressBar
                      now={s.completeness}
                      label={`${s.completeness}%`}
                      variant={
                        s.completeness >= 80 ? 'success' : s.completeness >= 60 ? 'warning' : 'danger'
                      }
                      style={{ flex: 1, height: 18 }}
                    />
                    <small className="ms-2 text-muted" style={{ minWidth: 50, textAlign: 'right' }}>
                      {s.count}型号
                    </small>
                  </div>
                ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mb-3">
        <Card.Header>
          <strong>字段完整度热力图</strong>{' '}
          <small className="text-muted">(按系列 x 字段, 数值为填充百分比)</small>
        </Card.Header>
        <Card.Body>
          <ReactEChartsCore
            echarts={echarts}
            option={heatmapOption}
            style={{ height: Math.max(350, CRITICAL_FIELDS.length * 28 + 80) }}
            notMerge
            lazyUpdate
          />
        </Card.Body>
      </Card>

      <Card>
        <Card.Header>
          <strong>关键字段统计</strong>
        </Card.Header>
        <Card.Body className="p-0">
          <Table striped hover size="sm" className="mb-0">
            <thead>
              <tr>
                <th>字段</th>
                <th>已填充</th>
                <th>总计</th>
                <th>完整度</th>
              </tr>
            </thead>
            <tbody>
              {CRITICAL_FIELDS.map((field) => {
                const s = analysis.fieldStats[field];
                const pct = s.total > 0 ? Math.round((s.filled / s.total) * 100) : 0;
                return (
                  <tr key={field}>
                    <td>{fieldLabels[field] || field}</td>
                    <td>{s.filled}</td>
                    <td>{s.total}</td>
                    <td>
                      <Badge bg={pct >= 90 ? 'success' : pct >= 70 ? 'warning' : 'danger'}>
                        {pct}%
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showNoMarketModal} onHide={() => setShowNoMarketModal(false)} size="lg" scrollable>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
            无 ERP 交易记录的型号 ({analysis.noMarketList.length})
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info" className="py-2">
            这些型号在近 15 个月的销售发票 / 采购发票 / 合同中未出现。可能是冷门型号、新型号、或历史型号。
            市场数据来源版本: <strong>{MARKET_META.marketDataTag || 'N/A'}</strong>,
            生成时间: <small>{MARKET_META.generatedAt || '—'}</small>
          </Alert>
          <Table striped size="sm">
            <thead>
              <tr>
                <th>型号</th>
                <th>系列</th>
                <th>价格</th>
                <th>状态</th>
              </tr>
            </thead>
            <tbody>
              {analysis.noMarketList.slice(0, 30).map((g) => (
                <tr key={g.model}>
                  <td><code>{g.model}</code></td>
                  <td><Badge bg="secondary">{g.series || extractSeries(g.model)}</Badge></td>
                  <td>{g.price ? `¥${g.price.toLocaleString()}` : <span className="text-muted">询价</span>}</td>
                  <td>
                    {!g.price && <Badge bg="warning" text="dark" className="me-1">缺价</Badge>}
                    <Badge bg="info">无交易</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {analysis.noMarketList.length > 30 && (
            <div className="text-center text-muted">
              仅显示前 30 条,总计 {analysis.noMarketList.length} 条
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNoMarketModal(false)}>关闭</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DataQualityDashboard;
