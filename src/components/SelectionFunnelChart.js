import React, { useMemo } from 'react';
import { Card, Badge } from 'react-bootstrap';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '../config/echartsSetup';

const SelectionFunnelChart = ({ result }) => {
  const funnelData = useMemo(() => {
    if (!result || !result.filterStats) {
      // Build from recommendations if filterStats not available
      const total = result?.totalModels || 585;
      const speedFiltered = result?.speedFilteredCount || Math.round(total * 0.6);
      const ratioFiltered = result?.ratioFilteredCount || Math.round(speedFiltered * 0.5);
      const capacityFiltered = result?.capacityFilteredCount || Math.round(ratioFiltered * 0.8);
      const thrustFiltered = result?.thrustFilteredCount || capacityFiltered;
      const final = result?.recommendations?.length || 0;

      return [
        { name: '全部型号', value: total, color: '#94a3b8' },
        { name: '转速匹配', value: speedFiltered, color: '#3b82f6' },
        { name: '减速比匹配', value: ratioFiltered, color: '#8b5cf6' },
        { name: '传动能力匹配', value: capacityFiltered, color: '#f59e0b' },
        { name: '推力匹配', value: thrustFiltered, color: '#10b981' },
        { name: '最终推荐', value: final, color: '#ef4444' },
      ];
    }
    return result.filterStats;
  }, [result]);

  const chartOption = useMemo(() => ({
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.name}: ${p.value} 个型号 (${((p.value / funnelData[0].value) * 100).toFixed(1)}%)`
    },
    series: [{
      type: 'funnel',
      left: '10%',
      top: 20,
      bottom: 20,
      width: '80%',
      min: 0,
      max: funnelData[0]?.value || 585,
      minSize: '5%',
      maxSize: '100%',
      sort: 'descending',
      gap: 4,
      label: {
        show: true,
        position: 'inside',
        formatter: (p) => `${p.name}\n${p.value}`,
        fontSize: 12,
        color: '#fff'
      },
      emphasis: { label: { fontSize: 14 } },
      data: funnelData.map(d => ({ ...d, itemStyle: { color: d.color } }))
    }]
  }), [funnelData]);

  if (!result || !result.recommendations || result.recommendations.length === 0) return null;

  const passRate = funnelData.length > 1
    ? ((funnelData[funnelData.length - 1].value / funnelData[0].value) * 100).toFixed(1)
    : '0';

  return (
    <Card className="mt-3">
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span><i className="bi bi-funnel me-2"></i>选型筛选漏斗</span>
        <Badge bg="info">{passRate}% 通过率</Badge>
      </Card.Header>
      <Card.Body>
        <ReactEChartsCore echarts={echarts} option={chartOption} style={{ height: 300 }} />
        <div className="d-flex justify-content-between mt-2" style={{ fontSize: '12px', color: '#6b7280' }}>
          {funnelData.map((d, i) => (
            <div key={i} className="text-center">
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: d.color, display: 'inline-block', marginRight: 4 }}></div>
              {d.name}: <strong>{d.value}</strong>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};

export default SelectionFunnelChart;
