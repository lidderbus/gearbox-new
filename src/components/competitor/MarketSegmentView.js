/**
 * 市场情报看板组件
 * Market Segment Intelligence View
 */

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Badge, ListGroup, Form } from 'react-bootstrap';
import ReactECharts from 'echarts-for-react';
import {
  getSegmentList,
  getSegmentAnalysis,
  getMarketShareData,
  getSwotForSegment,
  getSegmentPitches,
  getSegmentRecommendation
} from '../../utils/marketIntelligence';

const MarketSegmentView = ({ hangchiProduct, competitors = [], colors }) => {
  const [selectedSegment, setSelectedSegment] = useState('mediumCommercial');

  const segments = useMemo(() => getSegmentList(), []);
  const analysis = useMemo(() => getSegmentAnalysis(selectedSegment), [selectedSegment]);
  const shareData = useMemo(() => getMarketShareData(selectedSegment), [selectedSegment]);
  const swot = useMemo(() => getSwotForSegment(selectedSegment), [selectedSegment]);
  const pitches = useMemo(() => getSegmentPitches(selectedSegment), [selectedSegment]);
  const recommendation = useMemo(() => getSegmentRecommendation(selectedSegment), [selectedSegment]);

  // 饼图配置
  const pieOption = useMemo(() => {
    if (!shareData) return null;
    return {
      title: { text: `${analysis?.segment?.name || ''}市场份额`, left: 'center', top: 5, textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'item', formatter: '{b}: {d}%' },
      legend: { bottom: 5, itemWidth: 10, textStyle: { fontSize: 11 } },
      series: [{
        type: 'pie',
        radius: ['35%', '65%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: true,
        itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
        label: { show: true, formatter: '{b}\n{d}%', fontSize: 11 },
        data: shareData.data.map((d, i) => ({
          ...d,
          itemStyle: { color: shareData.colors[i] }
        }))
      }]
    };
  }, [shareData, analysis]);

  // 定位散点图
  const positioningOption = useMemo(() => {
    if (!hangchiProduct || competitors.length === 0) return null;

    const allData = [];
    // Hangchi
    if (hangchiProduct.price) {
      allData.push({
        name: '杭齿 ' + hangchiProduct.model,
        value: [hangchiProduct.price / 10000, hangchiProduct.transferCapacity || 0],
        symbol: 'diamond',
        symbolSize: 20,
        itemStyle: { color: '#D4AF37' },
        label: { show: true, formatter: '杭齿', position: 'top', fontSize: 10 }
      });
    }
    // Competitors
    competitors.forEach(c => {
      if (c.estimatedPrice) {
        const mfgColors = { CZCG: '#C41E3A', NGC: '#1E90FF', ZF: '#003366', Reintjes: '#4169E1', TwinDisc: '#B22222', DCSG: '#228B22', FADA: '#FF8C00' };
        allData.push({
          name: c.model,
          value: [c.estimatedPrice / 10000, c.transferCapacity || 0],
          symbol: 'circle',
          symbolSize: 14,
          itemStyle: { color: mfgColors[c.manufacturer] || '#999' },
          label: { show: true, formatter: c.model.substring(0, 8), position: 'right', fontSize: 9 }
        });
      }
    });

    if (allData.length === 0) return null;

    return {
      title: { text: '价格-性能定位图', left: 'center', top: 5, textStyle: { fontSize: 14 } },
      tooltip: { formatter: (p) => `<strong>${p.data.name}</strong><br/>价格: ${p.data.value[0].toFixed(1)}万<br/>传递能力: ${(typeof p.data.value[1] === 'number' ? p.data.value[1] : 0).toFixed(3)}` },
      grid: { left: '12%', right: '8%', bottom: '12%', top: '15%' },
      xAxis: { type: 'value', name: '价格(万元)', inverse: true, nameLocation: 'center', nameGap: 30 },
      yAxis: { type: 'value', name: '传递能力', nameLocation: 'center', nameGap: 45 },
      series: [{ type: 'scatter', data: allData }]
    };
  }, [hangchiProduct, competitors]);

  const swotColors = { strengths: '#28a745', weaknesses: '#dc3545', opportunities: '#0d6efd', threats: '#ffc107' };
  const swotLabels = { strengths: '优势 (S)', weaknesses: '劣势 (W)', opportunities: '机会 (O)', threats: '威胁 (T)' };
  const swotIcons = { strengths: 'bi-shield-check', weaknesses: 'bi-shield-exclamation', opportunities: 'bi-rocket-takeoff', threats: 'bi-exclamation-triangle' };

  return (
    <Card className="shadow-sm">
      <Card.Header style={{ background: colors?.primary || '#2c5282', color: 'white' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span><i className="bi bi-pie-chart me-2"></i>市场情报分析</span>
          <Form.Select
            size="sm"
            style={{ width: '200px', display: 'inline-block' }}
            value={selectedSegment}
            onChange={e => setSelectedSegment(e.target.value)}
          >
            {segments.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </Form.Select>
        </div>
      </Card.Header>
      <Card.Body>
        {/* 分段概况 */}
        <Row className="mb-4">
          <Col md={8}>
            <div className="d-flex align-items-center mb-2">
              <h5 className="mb-0 me-3">{analysis?.segment?.name}</h5>
              <Badge bg="info">杭齿份额: {analysis?.hangchiShare || 0}%</Badge>
              <Badge bg="secondary" className="ms-2">排名: 第{analysis?.hangchiRank || '-'}位</Badge>
            </div>
            <p className="text-muted small mb-2">{analysis?.segment?.description}</p>
            {analysis?.segment?.powerRange && (
              <small className="text-muted">功率范围: {analysis.segment.powerRange[0]}-{analysis.segment.powerRange[1]} kW</small>
            )}
          </Col>
          <Col md={4}>
            <Card className="border-primary">
              <Card.Body className="py-2 px-3">
                <small className="text-muted d-block mb-1"><strong>关键购买因素</strong></small>
                {(analysis?.keyBuyingFactors || []).slice(0, 4).map((f, i) => (
                  <Badge key={i} bg="light" text="dark" className="me-1 mb-1">{i + 1}. {f}</Badge>
                ))}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 图表区 */}
        <Row className="mb-4">
          <Col lg={6} className="mb-3">
            {pieOption && <ReactECharts option={pieOption} style={{ height: '320px', width: '100%' }} opts={{ renderer: 'svg' }} />}
          </Col>
          <Col lg={6} className="mb-3">
            {positioningOption ? (
              <ReactECharts option={positioningOption} style={{ height: '320px', width: '100%' }} opts={{ renderer: 'svg' }} />
            ) : (
              <div className="text-center text-muted py-5 border rounded h-100 d-flex align-items-center justify-content-center">
                <div>
                  <i className="bi bi-scatter-chart fs-1 d-block mb-2"></i>
                  选择杭齿产品和竞品后显示定位图
                </div>
              </div>
            )}
          </Col>
        </Row>

        {/* SWOT分析 */}
        {swot && (
          <Card className="mb-4">
            <Card.Header className="py-2">
              <i className="bi bi-diagram-3 me-2"></i>
              杭齿SWOT分析 - {analysis?.segment?.name}
            </Card.Header>
            <Card.Body className="p-0">
              <Row className="g-0">
                {['strengths', 'weaknesses', 'opportunities', 'threats'].map(key => (
                  <Col md={6} key={key} className="p-3" style={{ borderBottom: '1px solid #dee2e6', borderRight: key === 'strengths' || key === 'opportunities' ? '1px solid #dee2e6' : 'none' }}>
                    <h6 style={{ color: swotColors[key] }}>
                      <i className={`bi ${swotIcons[key]} me-2`}></i>
                      {swotLabels[key]}
                    </h6>
                    <ul className="small mb-0 ps-3">
                      {(swot[key] || []).map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        )}

        {/* 销售策略建议 */}
        {recommendation && (
          <Row>
            <Col md={6}>
              <Card className="h-100">
                <Card.Header className="py-2">
                  <i className="bi bi-lightbulb me-2"></i>竞争策略
                </Card.Header>
                <Card.Body>
                  <p className="small">{recommendation.recommendation}</p>
                  <p className="small mb-1"><strong>竞争策略:</strong> {recommendation.competitiveStrategy}</p>
                  <div className="mt-2">
                    <small className="text-muted d-block mb-1">核心差异化:</small>
                    {(recommendation.keyDifferentiators || []).map((d, i) => (
                      <Badge key={i} bg="success" className="me-1 mb-1">{d}</Badge>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100">
                <Card.Header className="py-2">
                  <i className="bi bi-chat-quote me-2"></i>分段话术
                </Card.Header>
                <Card.Body style={{ maxHeight: '250px', overflowY: 'auto' }}>
                  {(pitches || []).map((p, i) => (
                    <div key={i} className="mb-2 p-2 bg-light rounded">
                      <Badge bg="secondary" className="me-2">{p.scenario}</Badge>
                      <small>{p.pitch}</small>
                    </div>
                  ))}
                  {(!pitches || pitches.length === 0) && (
                    <div className="text-center text-muted py-3">暂无专项话术</div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}

        {/* 免责声明 */}
        <div className="mt-3 text-center">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            市场份额数据基于公开信息估算，仅供内部参考，不作为正式市场报告使用。
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MarketSegmentView;
