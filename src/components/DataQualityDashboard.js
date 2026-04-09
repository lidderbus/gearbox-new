// src/components/DataQualityDashboard.js
// E8: Data Quality Dashboard - analyzes gearbox data completeness
// Computes all metrics from runtime embedded data (no server needed)

import React, { useState, useEffect, useMemo } from 'react';
import { Card, Table, Badge, Row, Col, ProgressBar, Alert } from 'react-bootstrap';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '../config/echartsSetup';

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

    return {
      heatmapData,
      seriesNames,
      fieldStats,
      healthScore,
      seriesSummary,
      totalModels: data.length,
      missingPrice,
      missingThrust,
    };
  }, [data]);

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
          <Card className="h-100">
            <Card.Body className="d-flex flex-column justify-content-center text-center">
              <h2 className="text-primary mb-1">{analysis.totalModels}</h2>
              <div className="text-muted">型号总数</div>
              <hr />
              <h4 className="text-warning mb-1">{analysis.missingPrice}</h4>
              <div className="text-muted">缺失价格</div>
              <hr />
              <h4 className="text-danger mb-1">{analysis.missingThrust}</h4>
              <div className="text-muted">缺失推力</div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
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
    </div>
  );
};

export default DataQualityDashboard;
