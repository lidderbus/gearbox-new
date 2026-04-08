/**
 * SeriesOverviewDashboard - 产品系列总览仪表盘
 *
 * 4个ECharts图表 (2x2网格):
 * A: 功率范围 (水平条形图)
 * B: 速比分布 (min-max-median可视化 + scatter)
 * C: 价格对比 (分组柱状图: min/avg/max)
 * D: 型号数量帕累托 (堆叠条+累计线)
 *
 * 底部: 各系列汇总统计表
 */
import React, { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '../config/echartsSetup';
import { embeddedGearboxData } from '../data/embeddedData';

// 系列key到中文名映射
const SERIES_LABEL_MAP = {
  hcGearboxes: 'HC',
  gwGearboxes: 'GW',
  hcmGearboxes: 'HCM',
  dtGearboxes: 'DT',
  hcqGearboxes: 'HCQ',
  gcGearboxes: 'GC',
  hcxGearboxes: 'HCX',
  mvGearboxes: 'MV',
  hcaGearboxes: 'HCA',
  hcvGearboxes: 'HCV',
  otherGearboxes: '其他',
};

// 系列配色 (区分度高的调色板)
const SERIES_COLORS = [
  '#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1', '#14b8a6',
];

/**
 * 从嵌入数据中提取所有型号并按系列分组
 */
function extractSeriesData() {
  const seriesMap = {};

  Object.entries(embeddedGearboxData).forEach(([key, value]) => {
    if (!Array.isArray(value)) return;
    const label = SERIES_LABEL_MAP[key] || key.replace('Gearboxes', '').toUpperCase();
    if (!seriesMap[label]) seriesMap[label] = [];
    value.forEach((model) => {
      // 计算功率: transferCapacity * maxInputSpeed
      const maxSpeed = Array.isArray(model.inputSpeedRange)
        ? Math.max(...model.inputSpeedRange)
        : 0;
      const capacities = Array.isArray(model.transferCapacity)
        ? model.transferCapacity
        : [];
      const maxCapacity = capacities.length > 0 ? Math.max(...capacities) : 0;
      const power = maxCapacity * maxSpeed; // kW

      const ratios = Array.isArray(model.ratios) ? model.ratios : [];
      const price = model.price || model.basePrice || 0;

      seriesMap[label].push({
        model: model.model,
        power,
        ratios,
        price,
        controlType: model.controlType || '未知',
        weight: model.weight || 0,
        thrust: model.thrust || 0,
      });
    });
  });

  return seriesMap;
}

/**
 * 计算每系列的统计汇总
 */
function computeSeriesStats(seriesMap) {
  return Object.entries(seriesMap)
    .map(([name, models]) => {
      const powers = models.map((m) => m.power).filter((p) => p > 0);
      const allRatios = models.flatMap((m) => m.ratios).filter((r) => r > 0);
      const prices = models.map((m) => m.price).filter((p) => p > 0);

      return {
        name,
        count: models.length,
        models,
        minPower: powers.length ? Math.min(...powers) : 0,
        maxPower: powers.length ? Math.max(...powers) : 0,
        avgPower: powers.length ? powers.reduce((a, b) => a + b, 0) / powers.length : 0,
        minRatio: allRatios.length ? Math.min(...allRatios) : 0,
        maxRatio: allRatios.length ? Math.max(...allRatios) : 0,
        medianRatio: allRatios.length
          ? (() => {
              const sorted = [...allRatios].sort((a, b) => a - b);
              const mid = Math.floor(sorted.length / 2);
              return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
            })()
          : 0,
        allRatios,
        minPrice: prices.length ? Math.min(...prices) : 0,
        maxPrice: prices.length ? Math.max(...prices) : 0,
        avgPrice: prices.length ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : 0,
        priceCount: prices.length,
      };
    })
    .filter((s) => s.count > 0)
    .sort((a, b) => b.maxPower - a.maxPower);
}

const SeriesOverviewDashboard = ({ theme = 'light', colors = {} }) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e0e0e0' : '#333';
  const subTextColor = isDark ? '#aaa' : '#666';
  const gridColor = isDark ? '#444' : '#e0e0e0';
  const cardBg = isDark ? '#1e1e1e' : '#fff';
  const cardBorder = isDark ? '#333' : '#e5e7eb';
  const pageBg = isDark ? '#121212' : '#f5f5f5';

  const seriesMap = useMemo(() => extractSeriesData(), []);
  const stats = useMemo(() => computeSeriesStats(seriesMap), [seriesMap]);
  const totalModels = useMemo(() => stats.reduce((s, g) => s + g.count, 0), [stats]);

  // ========== Chart A: 功率范围 (水平条形图) ==========
  const chartAPowerRange = useMemo(() => {
    const sorted = [...stats].sort((a, b) => a.maxPower - b.maxPower);
    const names = sorted.map((s) => s.name);
    return {
      backgroundColor: 'transparent',
      title: {
        text: '功率范围 (kW)',
        left: 'center',
        textStyle: { color: textColor, fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const idx = params[0]?.dataIndex;
          if (idx == null) return '';
          const s = sorted[idx];
          return `<b>${s.name}</b><br/>最小: ${s.minPower.toFixed(1)} kW<br/>最大: ${s.maxPower.toFixed(1)} kW<br/>型号数: ${s.count}`;
        },
      },
      grid: { left: 60, right: 30, top: 40, bottom: 20 },
      xAxis: {
        type: 'value',
        name: 'kW',
        axisLabel: { color: textColor },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
      },
      yAxis: {
        type: 'category',
        data: names,
        axisLabel: { color: textColor, fontWeight: 600 },
        axisLine: { lineStyle: { color: gridColor } },
      },
      series: [
        {
          name: '起始功率',
          type: 'bar',
          stack: 'power',
          data: sorted.map((s) => s.minPower),
          itemStyle: { color: 'transparent' },
          emphasis: { itemStyle: { color: 'transparent' } },
        },
        {
          name: '功率范围',
          type: 'bar',
          stack: 'power',
          data: sorted.map((s, i) => ({
            value: s.maxPower - s.minPower,
            itemStyle: { color: SERIES_COLORS[i % SERIES_COLORS.length], borderRadius: [0, 4, 4, 0] },
          })),
          label: {
            show: true,
            position: 'right',
            formatter: (p) => {
              const s = sorted[p.dataIndex];
              return `${s.minPower.toFixed(0)}-${s.maxPower.toFixed(0)}`;
            },
            color: textColor,
            fontSize: 10,
          },
        },
      ],
    };
  }, [stats, textColor, gridColor]);

  // ========== Chart B: 速比分布 (min-max-median + scatter) ==========
  const chartBRatioDist = useMemo(() => {
    const sorted = [...stats].filter((s) => s.allRatios.length > 0);
    const names = sorted.map((s) => s.name);

    // Custom series using renderItem for box-like bars
    const boxData = sorted.map((s, i) => [i, s.minRatio, s.medianRatio, s.maxRatio]);

    // Scatter overlay: sample ratios per series (limit to 50 per series)
    const scatterData = [];
    sorted.forEach((s, i) => {
      const sampled = s.allRatios.length > 50
        ? s.allRatios.filter((_, j) => j % Math.ceil(s.allRatios.length / 50) === 0)
        : s.allRatios;
      sampled.forEach((r) => {
        scatterData.push([i, r]);
      });
    });

    return {
      backgroundColor: 'transparent',
      title: {
        text: '速比分布',
        left: 'center',
        textStyle: { color: textColor, fontSize: 14 },
      },
      tooltip: {
        trigger: 'item',
        formatter: (p) => {
          if (p.seriesIndex === 0) {
            const d = boxData[p.dataIndex];
            return `<b>${names[d[0]]}</b><br/>最小: ${d[1].toFixed(2)}<br/>中位数: ${d[2].toFixed(2)}<br/>最大: ${d[3].toFixed(2)}`;
          }
          return `速比: ${p.value[1].toFixed(2)}`;
        },
      },
      grid: { left: 50, right: 30, top: 40, bottom: 30 },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: { color: textColor, fontWeight: 600 },
        axisLine: { lineStyle: { color: gridColor } },
      },
      yAxis: {
        type: 'value',
        name: '速比',
        axisLabel: { color: textColor },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
      },
      series: [
        {
          name: '速比范围',
          type: 'custom',
          renderItem: (params, api) => {
            const idx = api.value(0);
            const minVal = api.value(1);
            const medVal = api.value(2);
            const maxVal = api.value(3);
            const catIdx = api.coord([idx, 0]);
            const minPt = api.coord([idx, minVal]);
            const medPt = api.coord([idx, medVal]);
            const maxPt = api.coord([idx, maxVal]);
            const barWidth = 20;
            const x = catIdx[0];
            const clr = SERIES_COLORS[idx % SERIES_COLORS.length];

            return {
              type: 'group',
              children: [
                // Vertical line (whisker)
                {
                  type: 'line',
                  shape: { x1: x, y1: minPt[1], x2: x, y2: maxPt[1] },
                  style: { stroke: clr, lineWidth: 2 },
                },
                // Min cap
                {
                  type: 'line',
                  shape: { x1: x - barWidth / 2, y1: minPt[1], x2: x + barWidth / 2, y2: minPt[1] },
                  style: { stroke: clr, lineWidth: 2 },
                },
                // Max cap
                {
                  type: 'line',
                  shape: { x1: x - barWidth / 2, y1: maxPt[1], x2: x + barWidth / 2, y2: maxPt[1] },
                  style: { stroke: clr, lineWidth: 2 },
                },
                // Median diamond
                {
                  type: 'circle',
                  shape: { cx: x, cy: medPt[1], r: 5 },
                  style: { fill: clr, stroke: '#fff', lineWidth: 1 },
                },
              ],
            };
          },
          data: boxData,
          z: 5,
        },
        {
          name: '速比点',
          type: 'scatter',
          data: scatterData,
          symbolSize: 4,
          itemStyle: {
            color: (p) => {
              const idx = p.value[0];
              return SERIES_COLORS[idx % SERIES_COLORS.length] + '80'; // semi-transparent
            },
          },
          z: 3,
        },
      ],
    };
  }, [stats, textColor, gridColor]);

  // ========== Chart C: 价格对比 (分组柱状图) ==========
  const chartCPrice = useMemo(() => {
    const withPrice = stats.filter((s) => s.priceCount > 0);
    const names = withPrice.map((s) => s.name);

    return {
      backgroundColor: 'transparent',
      title: {
        text: '价格对比 (元)',
        left: 'center',
        textStyle: { color: textColor, fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          const idx = params[0]?.dataIndex;
          if (idx == null) return '';
          const s = withPrice[idx];
          return `<b>${s.name}</b> (${s.priceCount}个有价格)<br/>最低: ${s.minPrice.toLocaleString()} 元<br/>均价: ${s.avgPrice.toLocaleString()} 元<br/>最高: ${s.maxPrice.toLocaleString()} 元`;
        },
      },
      legend: {
        data: ['最低价', '均价', '最高价'],
        bottom: 0,
        textStyle: { color: textColor, fontSize: 11 },
      },
      grid: { left: 70, right: 30, top: 40, bottom: 40 },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: { color: textColor, fontWeight: 600 },
        axisLine: { lineStyle: { color: gridColor } },
      },
      yAxis: {
        type: 'value',
        name: '元',
        axisLabel: {
          color: textColor,
          formatter: (v) => {
            if (v >= 10000) return (v / 10000).toFixed(0) + '万';
            return v.toLocaleString();
          },
        },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
      },
      series: [
        {
          name: '最低价',
          type: 'bar',
          data: withPrice.map((s) => s.minPrice),
          itemStyle: { color: '#10b981' },
          barGap: '10%',
        },
        {
          name: '均价',
          type: 'bar',
          data: withPrice.map((s) => s.avgPrice),
          itemStyle: { color: '#3b82f6' },
          label: {
            show: true,
            position: 'top',
            formatter: (p) => withPrice[p.dataIndex].priceCount + '个',
            color: subTextColor,
            fontSize: 10,
          },
        },
        {
          name: '最高价',
          type: 'bar',
          data: withPrice.map((s) => s.maxPrice),
          itemStyle: { color: '#ef4444' },
        },
      ],
    };
  }, [stats, textColor, subTextColor, gridColor]);

  // ========== Chart D: 型号数量帕累托 (堆叠条+累计线) ==========
  const chartDPareto = useMemo(() => {
    const sorted = [...stats].sort((a, b) => b.count - a.count);
    const names = sorted.map((s) => s.name);

    // Control type breakdown
    const controlTypes = new Set();
    sorted.forEach((s) => {
      s.models.forEach((m) => {
        controlTypes.add(m.controlType);
      });
    });
    const ctArray = [...controlTypes].slice(0, 5); // top 5 control types

    // Cumulative percentage
    let cumSum = 0;
    const cumPercent = sorted.map((s) => {
      cumSum += s.count;
      return Math.round((cumSum / totalModels) * 100);
    });

    // Stacked bars by control type
    const barSeries = ctArray.map((ct, ci) => ({
      name: ct,
      type: 'bar',
      stack: 'models',
      data: sorted.map((s) => s.models.filter((m) => m.controlType === ct).length),
      itemStyle: { color: SERIES_COLORS[ci % SERIES_COLORS.length] },
    }));

    // "Other" control types
    barSeries.push({
      name: '其他类型',
      type: 'bar',
      stack: 'models',
      data: sorted.map((s) =>
        s.models.filter((m) => !ctArray.includes(m.controlType)).length
      ),
      itemStyle: { color: '#9ca3af' },
    });

    return {
      backgroundColor: 'transparent',
      title: {
        text: '型号数量与覆盖',
        left: 'center',
        textStyle: { color: textColor, fontSize: 14 },
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' },
        formatter: (params) => {
          const idx = params[0]?.dataIndex;
          if (idx == null) return '';
          const s = sorted[idx];
          let html = `<b>${s.name}</b> — ${s.count} 型号<br/>`;
          params.forEach((p) => {
            if (p.seriesType === 'bar' && p.value > 0) {
              html += `${p.marker} ${p.seriesName}: ${p.value}<br/>`;
            }
          });
          html += `累计占比: ${cumPercent[idx]}%`;
          return html;
        },
      },
      legend: {
        data: [...ctArray, '其他类型', '累计占比'],
        bottom: 0,
        textStyle: { color: textColor, fontSize: 10 },
        type: 'scroll',
      },
      grid: { left: 50, right: 50, top: 40, bottom: 50 },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: { color: textColor, fontWeight: 600, rotate: names.length > 8 ? 30 : 0 },
        axisLine: { lineStyle: { color: gridColor } },
      },
      yAxis: [
        {
          type: 'value',
          name: '型号数',
          axisLabel: { color: textColor },
          splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
        },
        {
          type: 'value',
          name: '累计%',
          min: 0,
          max: 100,
          axisLabel: { color: textColor, formatter: '{value}%' },
          splitLine: { show: false },
        },
      ],
      series: [
        ...barSeries,
        {
          name: '累计占比',
          type: 'line',
          yAxisIndex: 1,
          data: cumPercent,
          lineStyle: { width: 2.5, color: '#f59e0b' },
          symbol: 'circle',
          symbolSize: 6,
          itemStyle: { color: '#f59e0b' },
          label: {
            show: true,
            position: 'top',
            formatter: '{c}%',
            color: subTextColor,
            fontSize: 10,
          },
        },
      ],
    };
  }, [stats, totalModels, textColor, subTextColor, gridColor]);

  // ========== Summary Table ==========
  const summaryTable = useMemo(() => {
    return [...stats].sort((a, b) => b.count - a.count);
  }, [stats]);

  const chartStyle = { height: 380, width: '100%' };

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  };

  return (
    <div style={{ padding: '16px 0', background: pageBg, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 20 }}>
        <h3 style={{ color: textColor, marginBottom: 4 }}>
          <i className="bi bi-grid-3x3-gap me-2"></i>产品系列总览
        </h3>
        <p style={{ color: subTextColor, margin: 0 }}>
          共 {totalModels} 个型号 / {stats.length} 个系列
        </p>
      </div>

      {/* 2x2 Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
          gap: 16,
          padding: '0 8px',
        }}
      >
        {/* Chart A */}
        <div style={cardStyle}>
          <ReactEChartsCore
            echarts={echarts}
            option={chartAPowerRange}
            style={chartStyle}
            theme={isDark ? 'dark' : undefined}
            notMerge={true}
          />
        </div>

        {/* Chart B */}
        <div style={cardStyle}>
          <ReactEChartsCore
            echarts={echarts}
            option={chartBRatioDist}
            style={chartStyle}
            theme={isDark ? 'dark' : undefined}
            notMerge={true}
          />
        </div>

        {/* Chart C */}
        <div style={cardStyle}>
          <ReactEChartsCore
            echarts={echarts}
            option={chartCPrice}
            style={chartStyle}
            theme={isDark ? 'dark' : undefined}
            notMerge={true}
          />
        </div>

        {/* Chart D */}
        <div style={cardStyle}>
          <ReactEChartsCore
            echarts={echarts}
            option={chartDPareto}
            style={chartStyle}
            theme={isDark ? 'dark' : undefined}
            notMerge={true}
          />
        </div>
      </div>

      {/* Summary Table */}
      <div style={{ ...cardStyle, margin: '0 8px' }}>
        <h5 style={{ color: textColor, marginBottom: 12 }}>
          <i className="bi bi-table me-2"></i>各系列汇总统计
        </h5>
        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: 13,
              color: textColor,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `2px solid ${gridColor}`,
                  textAlign: 'left',
                }}
              >
                <th style={{ padding: '8px 12px' }}>系列</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>型号数</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>功率范围 (kW)</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>速比范围</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>价格范围 (元)</th>
                <th style={{ padding: '8px 12px', textAlign: 'right' }}>有价格</th>
              </tr>
            </thead>
            <tbody>
              {summaryTable.map((s, i) => (
                <tr
                  key={s.name}
                  style={{
                    borderBottom: `1px solid ${gridColor}`,
                    background: i % 2 === 0 ? 'transparent' : (isDark ? '#252525' : '#fafafa'),
                  }}
                >
                  <td style={{ padding: '6px 12px', fontWeight: 600 }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 10,
                        height: 10,
                        borderRadius: '50%',
                        backgroundColor: SERIES_COLORS[i % SERIES_COLORS.length],
                        marginRight: 8,
                      }}
                    />
                    {s.name}
                  </td>
                  <td style={{ padding: '6px 12px', textAlign: 'right' }}>{s.count}</td>
                  <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                    {s.minPower > 0 ? `${s.minPower.toFixed(0)} - ${s.maxPower.toFixed(0)}` : '-'}
                  </td>
                  <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                    {s.minRatio > 0 ? `${s.minRatio.toFixed(2)} - ${s.maxRatio.toFixed(2)}` : '-'}
                  </td>
                  <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                    {s.minPrice > 0
                      ? `${s.minPrice.toLocaleString()} - ${s.maxPrice.toLocaleString()}`
                      : '-'}
                  </td>
                  <td style={{ padding: '6px 12px', textAlign: 'right' }}>
                    {s.priceCount > 0 ? `${s.priceCount}/${s.count}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ borderTop: `2px solid ${gridColor}`, fontWeight: 700 }}>
                <td style={{ padding: '8px 12px' }}>合计</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }}>{totalModels}</td>
                <td style={{ padding: '8px 12px', textAlign: 'right' }} colSpan={4}></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SeriesOverviewDashboard;
