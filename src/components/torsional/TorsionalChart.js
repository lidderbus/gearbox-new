/**
 * Campbell图组件 — 交互式ECharts实现
 *
 * X轴=转速(rpm), Y轴=频率(Hz)
 * 对角线=各阶激励频率线, 水平线=固有频率
 * 红点=共振交叉点, 黄色竖线=工作转速
 * 危险区间半透明红色阴影
 */
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

const TorsionalChart = ({
  criticalSpeeds = [],
  operatingSpeed = 0,
  avoidanceChecks = [],
  naturalFrequencyHz = 0,
  gearRatio = 1,
  barredSpeedRanges = [],
  colors = {},
  theme = 'light'
}) => {
  const option = useMemo(() => {
    // 从criticalSpeeds提取固有频率
    const fn = naturalFrequencyHz || (criticalSpeeds[0]
      ? criticalSpeeds[0].criticalSpeed * criticalSpeeds[0].order / 60
      : 0);

    if (!fn || fn <= 0) return null;

    // 输出转速(用于X轴范围)
    const outputSpeed = gearRatio > 1 ? operatingSpeed / gearRatio : operatingSpeed;
    const maxSpeed = Math.max(outputSpeed * 1.6, 1500);
    const speedStep = 25;

    // 激励阶次
    const orders = [...new Set(criticalSpeeds.map(cs => cs.order))].sort((a, b) => a - b);
    const maxFreq = fn * 1.8;

    // 颜色
    const isDark = theme === 'dark';
    const textColor = isDark ? '#e0e0e0' : '#333';
    const gridColor = isDark ? '#444' : '#e0e0e0';
    const orderColors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

    // 生成激励线数据
    const excitationSeries = orders.map((order, idx) => {
      const data = [];
      for (let spd = 0; spd <= maxSpeed; spd += speedStep) {
        const freq = order * spd / 60;
        if (freq <= maxFreq) data.push([spd, freq]);
      }
      return {
        name: `${order}阶激励`,
        type: 'line',
        data,
        lineStyle: { width: 2, color: orderColors[idx % orderColors.length] },
        symbol: 'none',
        z: 2
      };
    });

    // 固有频率水平线
    const fnLine = {
      name: `fn = ${fn.toFixed(1)} Hz`,
      type: 'line',
      data: [[0, fn], [maxSpeed, fn]],
      lineStyle: { width: 2.5, color: '#ef4444', type: 'solid' },
      symbol: 'none',
      z: 3
    };

    // 共振交叉点
    const intersections = criticalSpeeds.map(cs => {
      const check = avoidanceChecks.find(a => a.order === cs.order);
      return {
        value: [cs.criticalSpeed, fn],
        order: cs.order,
        inDanger: check?.inDangerZone || false
      };
    }).filter(p => p.value[0] > 0 && p.value[0] <= maxSpeed);

    const intersectionSeries = {
      name: '共振点',
      type: 'scatter',
      data: intersections.map(p => ({
        value: p.value,
        itemStyle: { color: p.inDanger ? '#ef4444' : '#f59e0b' }
      })),
      symbolSize: 12,
      z: 10,
      label: {
        show: true,
        formatter: (p) => {
          const pt = intersections[p.dataIndex];
          return pt ? `${pt.order}阶\n${Math.round(pt.value[0])}rpm` : '';
        },
        position: 'top',
        fontSize: 10,
        color: textColor
      }
    };

    // 危险区间(barredSpeedRanges)阴影
    const markAreas = barredSpeedRanges.map(range => ([
      { xAxis: range.min, itemStyle: { color: 'rgba(239,68,68,0.12)' } },
      { xAxis: range.max }
    ]));

    // 工作转速竖线
    const workingSpeedLine = {
      name: `工作转速`,
      type: 'line',
      data: [[outputSpeed, 0], [outputSpeed, maxFreq]],
      lineStyle: { width: 2.5, color: '#fbbf24', type: 'dashed' },
      symbol: 'none',
      z: 5,
      markArea: markAreas.length > 0 ? { silent: true, data: markAreas } : undefined
    };

    return {
      backgroundColor: 'transparent',
      title: {
        text: 'Campbell 图',
        subtext: `固有频率 fn = ${fn.toFixed(2)} Hz | 工作转速 ${Math.round(outputSpeed)} rpm`,
        left: 'center',
        textStyle: { color: textColor, fontSize: 14 },
        subtextStyle: { color: isDark ? '#aaa' : '#666', fontSize: 11 }
      },
      tooltip: {
        trigger: 'item',
        formatter: (p) => {
          if (p.seriesType === 'scatter') {
            return `<b>共振点</b><br/>转速: ${Math.round(p.value[0])} rpm<br/>频率: ${p.value[1].toFixed(1)} Hz`;
          }
          if (p.seriesType === 'line' && p.value) {
            return `${p.seriesName}<br/>转速: ${Math.round(p.value[0])} rpm<br/>频率: ${p.value[1].toFixed(1)} Hz`;
          }
          return '';
        }
      },
      legend: {
        data: [...excitationSeries.map(s => s.name), fnLine.name, '共振点'],
        bottom: 0,
        textStyle: { color: textColor, fontSize: 10 },
        itemWidth: 16, itemHeight: 8
      },
      grid: { left: 60, right: 30, top: 65, bottom: 50 },
      xAxis: {
        type: 'value',
        name: '转速 (rpm)',
        nameLocation: 'middle',
        nameGap: 28,
        min: 0, max: maxSpeed,
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' } }
      },
      yAxis: {
        type: 'value',
        name: '频率 (Hz)',
        nameLocation: 'middle',
        nameGap: 45,
        min: 0, max: Math.ceil(maxFreq / 10) * 10,
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' } }
      },
      series: [
        ...excitationSeries,
        fnLine,
        intersectionSeries,
        workingSpeedLine
      ]
    };
  }, [criticalSpeeds, operatingSpeed, avoidanceChecks, naturalFrequencyHz, gearRatio, barredSpeedRanges, theme, colors]);

  if (!option) {
    return (
      <div className="text-muted text-center py-5">
        暂无图表数据，请先执行分析
      </div>
    );
  }

  return (
    <div className="torsional-campbell-chart">
      <ReactECharts
        option={option}
        style={{ height: 380, width: '100%' }}
        theme={theme === 'dark' ? 'dark' : undefined}
        notMerge={true}
      />
    </div>
  );
};

export default TorsionalChart;
