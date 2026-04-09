// src/components/ParetoFrontChart.js
// Pareto Front Analysis (E7) - multi-objective scatter chart with interactive weight sliders
import React, { useState, useMemo, useCallback } from 'react';
import { Card, Form, Badge, Row, Col } from 'react-bootstrap';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '../config/echartsSetup';
import {
  computeParetoFront,
  computeBounds,
  computeTradeoffScore,
  DEFAULT_OBJECTIVES,
} from '../utils/paretoAnalysis';

const ParetoFrontChart = ({ recommendations = [], onSelectGearbox }) => {
  const [weights, setWeights] = useState([1, 1, 1]);
  const objectives = DEFAULT_OBJECTIVES;

  const { paretoFront, dominated } = useMemo(
    () => computeParetoFront(recommendations, objectives),
    [recommendations, objectives]
  );

  const bounds = useMemo(
    () => computeBounds(recommendations, objectives),
    [recommendations, objectives]
  );

  const rankedPareto = useMemo(() => {
    return paretoFront
      .map(p => ({
        ...p,
        tradeoffScore: computeTradeoffScore(p, objectives, weights, bounds),
      }))
      .sort((a, b) => a.tradeoffScore - b.tradeoffScore);
  }, [paretoFront, weights, bounds, objectives]);

  const bestPoint = rankedPareto[0];

  const chartOption = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (p) => {
        const d = p.data;
        if (!d || !d.model) return '';
        return `<b>${d.model}</b><br/>` +
          `重量: ${d.weight || '\u2014'}kg<br/>` +
          `价格: \u00A5${(d.factoryPrice || 0).toLocaleString()}<br/>` +
          `余量: ${((d.capacityMargin || 0) * 100).toFixed(1)}%<br/>` +
          `评分: ${(d.score || 0).toFixed(1)}`;
      },
    },
    xAxis: {
      type: 'value',
      name: '重量 (kg)',
      nameLocation: 'center',
      nameGap: 30,
    },
    yAxis: {
      type: 'value',
      name: '出厂价 (元)',
      nameLocation: 'center',
      nameGap: 60,
    },
    series: [
      {
        name: '非帕累托解',
        type: 'scatter',
        data: dominated.map(d => ({
          value: [d.weight || 0, d.factoryPrice || 0],
          ...d,
        })),
        symbolSize: (val) => Math.max(8, Math.min(30, ((val && val[2]) || 0.1) * 30)),
        itemStyle: { color: '#ccc', opacity: 0.5 },
      },
      {
        name: '帕累托最优',
        type: 'scatter',
        data: paretoFront.map(d => ({
          value: [d.weight || 0, d.factoryPrice || 0],
          ...d,
        })),
        symbolSize: 14,
        itemStyle: { color: '#5470c6', borderColor: '#fff', borderWidth: 2 },
        emphasis: { scale: 1.5 },
      },
      ...(bestPoint
        ? [
            {
              name: '当前最优',
              type: 'effectScatter',
              data: [
                {
                  value: [bestPoint.weight || 0, bestPoint.factoryPrice || 0],
                  ...bestPoint,
                },
              ],
              symbolSize: 20,
              itemStyle: { color: '#ee6666' },
              rippleEffect: { brushType: 'stroke', scale: 3 },
            },
          ]
        : []),
      {
        name: '帕累托前沿',
        type: 'line',
        data: [...paretoFront]
          .sort((a, b) => (a.weight || 0) - (b.weight || 0))
          .map(d => [d.weight || 0, d.factoryPrice || 0]),
        lineStyle: { color: '#5470c6', type: 'dashed', width: 2 },
        symbol: 'none',
        z: -1,
      },
    ],
    legend: { bottom: 0 },
    grid: { top: 30, bottom: 60, left: 80, right: 30 },
  }), [paretoFront, dominated, bestPoint]);

  const handleChartClick = useCallback(
    (params) => {
      if (params.data?.model && onSelectGearbox) {
        const idx = recommendations.findIndex(r => r.model === params.data.model);
        if (idx >= 0) onSelectGearbox(idx);
      }
    },
    [recommendations, onSelectGearbox]
  );

  if (recommendations.length < 3) return null;

  return (
    <Card className="mt-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>
          <i className="bi bi-diagram-3 me-2"></i>
          多目标优化 &middot; 帕累托前沿
        </span>
        <Badge bg="info">{paretoFront.length} 个最优解</Badge>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={9}>
            <ReactEChartsCore
              echarts={echarts}
              option={chartOption}
              style={{ height: 350 }}
              onEvents={{ click: handleChartClick }}
              notMerge={true}
            />
          </Col>
          <Col md={3}>
            <div className="mb-3">
              <h6>偏好权重调节</h6>
              <small className="text-muted">拖动滑块调整优化偏好</small>
            </div>
            {objectives.map((obj, i) => (
              <Form.Group key={obj.key} className="mb-3">
                <Form.Label className="small mb-1 d-flex justify-content-between">
                  <span style={{ color: obj.color }}>{'\u25CF'} {obj.label}</span>
                  <span>{weights[i].toFixed(1)}</span>
                </Form.Label>
                <Form.Range
                  min={0}
                  max={2}
                  step={0.1}
                  value={weights[i]}
                  onChange={e => {
                    const w = [...weights];
                    w[i] = parseFloat(e.target.value);
                    setWeights(w);
                  }}
                />
              </Form.Group>
            ))}
            {bestPoint && (
              <div className="mt-3 p-2 bg-light rounded">
                <small className="text-muted">当前最优推荐:</small>
                <div className="fw-bold">{bestPoint.model}</div>
                <div className="small">
                  评分: {bestPoint.score?.toFixed(1)} | 余量:{' '}
                  {((bestPoint.capacityMargin || 0) * 100).toFixed(1)}%
                </div>
              </div>
            )}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ParetoFrontChart;
