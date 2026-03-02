/**
 * TCO总拥有成本分析组件
 * Total Cost of Ownership Calculator
 */

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Form, Badge, Alert } from 'react-bootstrap';
import ReactECharts from 'echarts-for-react';
import { calculateTCO, compareTCO, getShipTypeOptions, formatTCOForChart, tcoDefaults } from '../../utils/tcoCalculator';
import { getManufacturerInfo } from '../../utils/competitorAnalysis';
import { manufacturerColors } from '../../data/competitorData';

const TCOCalculator = ({ hangchiProduct, competitors = [], colors }) => {
  const [shipType, setShipType] = useState('fishing');
  const [years, setYears] = useState(10);
  const [customHours, setCustomHours] = useState('');

  const shipTypeOptions = useMemo(() => getShipTypeOptions(), []);

  // 计算TCO对比数据
  const tcoResults = useMemo(() => {
    if (!hangchiProduct || competitors.length === 0) return null;

    const config = {
      years,
      shipType,
      annualRunningHours: customHours ? parseInt(customHours) : undefined
    };

    const hangchiTCO = calculateTCO(
      { ...hangchiProduct, estimatedPrice: hangchiProduct.price, manufacturer: 'HANGCHI' },
      config
    );

    const comparisons = competitors.map(comp => {
      const result = compareTCO(
        { ...hangchiProduct, estimatedPrice: hangchiProduct.price, manufacturer: 'HANGCHI' },
        comp,
        config
      );
      return { competitor: comp, ...result };
    });

    return { hangchiTCO, comparisons };
  }, [hangchiProduct, competitors, shipType, years, customHours]);

  // 堆叠柱状图配置
  const stackedBarOption = useMemo(() => {
    if (!tcoResults) return null;
    const categories = ['杭齿 ' + (hangchiProduct?.model || '')];
    const purchase = [tcoResults.hangchiTCO.purchaseCost / 10000];
    const maintenance = [tcoResults.hangchiTCO.maintenanceCost / 10000];
    const overhaul = [tcoResults.hangchiTCO.overhaulCost / 10000];
    const spareParts = [tcoResults.hangchiTCO.sparePartsCost / 10000];
    const downtime = [tcoResults.hangchiTCO.downtimeCost / 10000];

    tcoResults.comparisons.forEach(c => {
      const name = (getManufacturerInfo(c.competitor.manufacturer)?.shortName || c.competitor.manufacturer) + ' ' + c.competitor.model;
      categories.push(name);
      purchase.push(c.competitor.totalTCO ? c.competitor.purchaseCost / 10000 : 0);
      maintenance.push(c.competitor.maintenanceCost / 10000);
      overhaul.push(c.competitor.overhaulCost / 10000);
      spareParts.push(c.competitor.sparePartsCost / 10000);
      downtime.push(c.competitor.downtimeCost / 10000);
    });

    return {
      title: { text: `${years}年总拥有成本分解`, left: 'center', top: 5, textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: (params) => {
        let html = `<strong>${params[0].axisValue}</strong><br/>`;
        let total = 0;
        params.forEach(p => { html += `${p.marker} ${p.seriesName}: ${p.value.toFixed(1)}万元<br/>`; total += p.value; });
        html += `<strong>合计: ${total.toFixed(1)}万元</strong>`;
        return html;
      }},
      legend: { bottom: 5, itemWidth: 12, textStyle: { fontSize: 11 } },
      grid: { left: '3%', right: '3%', bottom: '18%', top: '15%', containLabel: true },
      xAxis: { type: 'category', data: categories, axisLabel: { fontSize: 10, rotate: 15 } },
      yAxis: { type: 'value', name: '万元', axisLabel: { formatter: '{value}' } },
      series: [
        { name: '购置成本', type: 'bar', stack: 'total', data: purchase, itemStyle: { color: '#4e79a7' } },
        { name: '维护保养', type: 'bar', stack: 'total', data: maintenance, itemStyle: { color: '#f28e2b' } },
        { name: '大修费用', type: 'bar', stack: 'total', data: overhaul, itemStyle: { color: '#e15759' } },
        { name: '配件费用', type: 'bar', stack: 'total', data: spareParts, itemStyle: { color: '#76b7b2' } },
        { name: '停机损失', type: 'bar', stack: 'total', data: downtime, itemStyle: { color: '#59a14f' } }
      ]
    };
  }, [tcoResults, hangchiProduct, years]);

  // 累积TCO曲线图
  const cumulativeOption = useMemo(() => {
    if (!tcoResults || !tcoResults.hangchiTCO.breakdown) return null;

    const yearLabels = tcoResults.hangchiTCO.breakdown.map(b => `第${b.year}年`);
    const hangchiCum = tcoResults.hangchiTCO.breakdown.map(b => (b.cumulative / 10000).toFixed(1));

    const series = [{
      name: '杭齿 ' + (hangchiProduct?.model || ''),
      type: 'line',
      data: hangchiCum,
      lineStyle: { width: 3, color: manufacturerColors?.HANGCHI || '#fd7e14' },
      itemStyle: { color: manufacturerColors?.HANGCHI || '#fd7e14' },
      symbol: 'circle',
      symbolSize: 6
    }];

    tcoResults.comparisons.forEach(c => {
      if (c.competitor && c.competitor.breakdown) {
        const name = (getManufacturerInfo(c.competitor.manufacturer)?.shortName || '') + ' ' + c.competitor.model;
        series.push({
          name,
          type: 'line',
          data: c.competitor.breakdown.map(b => (b.cumulative / 10000).toFixed(1)),
          lineStyle: { width: 2, type: 'dashed', color: manufacturerColors?.[c.competitor.manufacturer] || '#999' },
          itemStyle: { color: manufacturerColors?.[c.competitor.manufacturer] || '#999' },
          symbol: 'diamond',
          symbolSize: 5
        });
      }
    });

    return {
      title: { text: '累积TCO对比曲线', left: 'center', top: 5, textStyle: { fontSize: 14 } },
      tooltip: { trigger: 'axis', formatter: (params) => {
        let html = `<strong>${params[0].axisValue}</strong><br/>`;
        params.forEach(p => { html += `${p.marker} ${p.seriesName}: ${p.value}万元<br/>`; });
        return html;
      }},
      legend: { bottom: 5, itemWidth: 14, textStyle: { fontSize: 11 } },
      grid: { left: '3%', right: '5%', bottom: '18%', top: '15%', containLabel: true },
      xAxis: { type: 'category', data: yearLabels, boundaryGap: false },
      yAxis: { type: 'value', name: '累积成本(万元)' },
      series
    };
  }, [tcoResults, hangchiProduct]);

  if (!hangchiProduct || competitors.length === 0) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center text-muted py-5">
          <i className="bi bi-calculator fs-1 mb-3 d-block"></i>
          请选择杭齿产品和竞品进行TCO分析
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header style={{ background: colors?.primary || '#2c5282', color: 'white' }}>
        <i className="bi bi-calculator me-2"></i>
        总拥有成本(TCO)分析
      </Card.Header>
      <Card.Body>
        {/* 参数配置 */}
        <Row className="mb-4 align-items-end">
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small text-muted mb-1">船型</Form.Label>
              <Form.Select size="sm" value={shipType} onChange={e => setShipType(e.target.value)}>
                {shipTypeOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small text-muted mb-1">分析年限</Form.Label>
              <Form.Select size="sm" value={years} onChange={e => setYears(parseInt(e.target.value))}>
                <option value={5}>5年</option>
                <option value={10}>10年</option>
                <option value={15}>15年</option>
                <option value={20}>20年</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label className="small text-muted mb-1">年运行小时(可选)</Form.Label>
              <Form.Control
                size="sm"
                type="number"
                placeholder="留空使用船型默认值"
                value={customHours}
                onChange={e => setCustomHours(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <small className="text-muted d-block">
              <i className="bi bi-info-circle me-1"></i>
              TCO = 购置 + 维护 + 大修 + 配件 + 停机损失
            </small>
          </Col>
        </Row>

        {/* 节省金额汇总 */}
        <Row className="mb-4">
          {tcoResults?.comparisons.map(c => {
            const savings = c.savings || 0;
            const savingsPercent = c.savingsPercent || 0;
            const isAdvantage = savings > 0;
            const compName = (getManufacturerInfo(c.competitor.manufacturer)?.shortName || c.competitor.manufacturer) + ' ' + c.competitor.model;
            return (
              <Col key={c.competitor.model} md={Math.min(6, Math.floor(12 / tcoResults.comparisons.length))}>
                <Alert variant={isAdvantage ? 'success' : 'warning'} className="text-center py-2">
                  <small className="d-block text-muted">vs {compName}</small>
                  <div className="fs-5 fw-bold" style={{ color: isAdvantage ? '#28a745' : '#dc3545' }}>
                    {isAdvantage ? '节省' : '多出'} ¥{Math.abs(savings / 10000).toFixed(1)}万
                  </div>
                  <Badge bg={isAdvantage ? 'success' : 'danger'}>
                    {isAdvantage ? '↓' : '↑'} {Math.abs(savingsPercent).toFixed(1)}%
                  </Badge>
                  {c.breakEvenYear && (
                    <small className="d-block mt-1 text-muted">
                      第{c.breakEvenYear}年回本
                    </small>
                  )}
                </Alert>
              </Col>
            );
          })}
        </Row>

        {/* 图表 */}
        <Row>
          <Col lg={6} className="mb-3">
            {stackedBarOption && (
              <ReactECharts option={stackedBarOption} style={{ height: '350px', width: '100%' }} opts={{ renderer: 'svg' }} />
            )}
          </Col>
          <Col lg={6} className="mb-3">
            {cumulativeOption && (
              <ReactECharts option={cumulativeOption} style={{ height: '350px', width: '100%' }} opts={{ renderer: 'svg' }} />
            )}
          </Col>
        </Row>

        {/* 假设说明 */}
        <div className="mt-3 p-2 bg-light rounded">
          <small className="text-muted">
            <i className="bi bi-exclamation-circle me-1"></i>
            <strong>说明：</strong>TCO分析基于行业平均维护参数估算。换油成本¥{tcoDefaults.oilCostPerChange}/次，
            大修成本为购置价的{tcoDefaults.overhaulCostFactor * 100}%/次，人工费¥{tcoDefaults.laborRate}/小时。
            实际成本因使用条件不同可能有差异。数据标注为"估算"，仅供参考。
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TCOCalculator;
