// src/components/SelectionComparisonCharts.js
// 选型结果高级可视化对比图表 — 雷达图 / 散点图 / 平行坐标图
import React, { useState, useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '../config/echartsSetup';
import { formatPrice } from '../utils/priceFormatter';

// Series color mapping
const SERIES_COLORS = {
  HC: '#3b82f6',
  HCM: '#f97316',
  HCQ: '#8b5cf6',
  HCT: '#06b6d4',
  HCA: '#14b8a6',
  HCV: '#ec4899',
  HCD: '#6366f1',
  HCG: '#0ea5e9',
  HCS: '#a855f7',
  GW: '#22c55e',
  GC: '#84cc16',
  DT: '#ef4444',
  MV: '#f59e0b',
  J: '#64748b',
};

const RADAR_COLORS = [
  '#3b82f6', '#ef4444', '#22c55e', '#f59e0b', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#84cc16',
];

/**
 * Extract series prefix from model name
 */
const getSeriesKey = (model) => {
  if (!model) return 'OTHER';
  const upper = model.toUpperCase();
  // Order matters: longer prefixes first
  const prefixes = ['HCM', 'HCQ', 'HCT', 'HCA', 'HCV', 'HCD', 'HCG', 'HCS', 'HC', 'GWC', 'GWS', 'GWD', 'GWH', 'GWL', 'GWK', 'GW', 'SGW', 'GC', 'DT', 'MV', 'J'];
  for (const prefix of prefixes) {
    if (upper.startsWith(prefix)) {
      // Normalize GW sub-series
      if (['GWC', 'GWS', 'GWD', 'GWH', 'GWL', 'GWK', 'SGW'].includes(prefix)) return 'GW';
      return prefix;
    }
  }
  return 'OTHER';
};

const getSeriesColor = (model) => SERIES_COLORS[getSeriesKey(model)] || '#94a3b8';

/**
 * Collapsible section wrapper
 */
const ChartSection = ({ title, icon, defaultExpanded = true, children, colors, theme }) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const isDark = theme === 'dark';

  return (
    <div style={{
      border: `1px solid ${colors?.border || (isDark ? '#444' : '#e0e0e0')}`,
      borderRadius: '8px',
      marginBottom: '16px',
      overflow: 'hidden',
      backgroundColor: colors?.card || (isDark ? '#1e1e1e' : '#fff'),
    }}>
      <div
        onClick={() => setExpanded(!expanded)}
        style={{
          padding: '10px 16px',
          backgroundColor: colors?.headerBg || (isDark ? '#2a2a2a' : '#f5f5f5'),
          color: colors?.headerText || (isDark ? '#e0e0e0' : '#333'),
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none',
          fontWeight: 600,
          fontSize: '14px',
        }}
      >
        <span>
          <i className={`bi bi-${icon} me-2`}></i>
          {title}
        </span>
        <i className={`bi bi-chevron-${expanded ? 'up' : 'down'}`} style={{ fontSize: '12px' }}></i>
      </div>
      {expanded && (
        <div style={{ padding: '8px' }}>
          {children}
        </div>
      )}
    </div>
  );
};

/**
 * Chart 1: Radar comparison of top 5 recommendations across 6 dimensions
 */
const RadarComparisonChart = ({ recommendations, theme, colors }) => {
  const option = useMemo(() => {
    const top5 = recommendations.slice(0, 5);
    if (top5.length === 0) return null;

    const isDark = theme === 'dark';
    const textColor = isDark ? '#e0e0e0' : '#333';

    // Compute price range for normalization
    const prices = top5.map(r => r.factoryPrice || r.marketPrice || r.basePrice || 0).filter(p => p > 0);
    const maxPrice = Math.max(...prices, 1);
    const minPrice = Math.min(...prices, 0);
    const priceRange = maxPrice - minPrice || 1;

    // Compute safetyFactor range
    const safetyFactors = top5.map(r => r.safetyFactor || 0).filter(f => f > 0);
    const maxSafety = Math.max(...safetyFactors, 3);

    const indicators = [
      { name: '容量余量', max: 100 },
      { name: '速比匹配', max: 100 },
      { name: '综合评分', max: 100 },
      { name: '价格竞争力', max: 100 },
      { name: '推力满足', max: 100 },
      { name: '安全系数', max: 100 },
    ];

    const seriesData = top5.map((rec, idx) => {
      // Capacity margin: optimal at ~15%, normalize so 15%=100, 0%=0, 50%=30
      const marginScore = Math.max(0, Math.min(100, 100 - Math.abs((rec.capacityMargin || 0) - 15) * 2));
      // Ratio match: lower diff = better
      const ratioScore = Math.max(0, Math.min(100, 100 - (rec.ratioDiffPercent || 0) * 3));
      // Score: already 0-100
      const overallScore = rec.score || 0;
      // Price competitiveness: cheapest = 100
      const price = rec.factoryPrice || rec.marketPrice || rec.basePrice || 0;
      const priceScore = price > 0 ? Math.max(0, Math.min(100, 100 - ((price - minPrice) / priceRange) * 100)) : 50;
      // Thrust
      const thrustScore = rec.thrustMet === false ? 0 : 100;
      // Safety factor: normalize to 0-100, assume 1.0-3.0 range
      const sf = rec.safetyFactor || 0;
      const safetyScore = sf > 0 ? Math.min(100, (sf / maxSafety) * 100) : 50;

      return {
        name: rec.model,
        value: [marginScore, ratioScore, overallScore, priceScore, thrustScore, safetyScore],
        _raw: {
          capacityMargin: rec.capacityMargin,
          ratioDiffPercent: rec.ratioDiffPercent,
          score: rec.score,
          price,
          thrustMet: rec.thrustMet,
          safetyFactor: sf,
        },
      };
    });

    return {
      backgroundColor: 'transparent',
      title: {
        text: '雷达对比图',
        left: 'center',
        textStyle: { color: textColor, fontSize: 14, fontWeight: 600 },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (!params.data || !params.data._raw) return '';
          const raw = params.data._raw;
          return `<b>${params.name}</b><br/>` +
            `容量余量: ${raw.capacityMargin?.toFixed(1) ?? '-'}%<br/>` +
            `速比偏差: ${raw.ratioDiffPercent?.toFixed(1) ?? '-'}%<br/>` +
            `综合评分: ${raw.score?.toFixed(0) ?? '-'}<br/>` +
            `出厂价: ${formatPrice(raw.price)}<br/>` +
            `推力满足: ${raw.thrustMet === false ? '否' : '是'}<br/>` +
            `安全系数: ${raw.safetyFactor ? raw.safetyFactor.toFixed(2) : '-'}`;
        },
      },
      legend: {
        data: seriesData.map(d => d.name),
        bottom: 0,
        textStyle: { color: textColor, fontSize: 11 },
        itemWidth: 14,
        itemHeight: 8,
      },
      radar: {
        indicator: indicators,
        center: ['50%', '52%'],
        radius: '62%',
        axisName: {
          color: textColor,
          fontSize: 11,
        },
        splitArea: {
          areaStyle: {
            color: isDark
              ? ['rgba(60,60,60,0.3)', 'rgba(50,50,50,0.3)']
              : ['rgba(245,245,245,0.8)', 'rgba(255,255,255,0.8)'],
          },
        },
        axisLine: { lineStyle: { color: isDark ? '#555' : '#ccc' } },
        splitLine: { lineStyle: { color: isDark ? '#444' : '#ddd' } },
      },
      series: [{
        type: 'radar',
        data: seriesData.map((d, idx) => ({
          ...d,
          lineStyle: { width: 2, color: RADAR_COLORS[idx % RADAR_COLORS.length] },
          itemStyle: { color: RADAR_COLORS[idx % RADAR_COLORS.length] },
          areaStyle: { color: RADAR_COLORS[idx % RADAR_COLORS.length], opacity: 0.15 },
        })),
        emphasis: {
          lineStyle: { width: 3 },
          areaStyle: { opacity: 0.3 },
        },
      }],
    };
  }, [recommendations, theme]);

  if (!option) return null;

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 350, width: '100%' }}
      theme={theme === 'dark' ? 'dark' : undefined}
      notMerge={true}
    />
  );
};

/**
 * Chart 2: Scatter plot — ratio vs capacity, bubble size = score, color by series
 */
const ScatterPlotChart = ({ recommendations, targetRatio, theme, colors }) => {
  const option = useMemo(() => {
    if (recommendations.length === 0) return null;

    const isDark = theme === 'dark';
    const textColor = isDark ? '#e0e0e0' : '#333';
    const gridColor = isDark ? '#444' : '#e0e0e0';

    // Group by series
    const seriesMap = {};
    recommendations.forEach(rec => {
      const key = getSeriesKey(rec.model);
      if (!seriesMap[key]) seriesMap[key] = [];
      seriesMap[key].push(rec);
    });

    const scatterSeries = Object.entries(seriesMap).map(([seriesKey, recs]) => ({
      name: `${seriesKey}系列`,
      type: 'scatter',
      data: recs.map(rec => ({
        value: [
          rec.selectedRatio || rec.ratio || 0,
          rec.selectedCapacity || 0,
          rec.score || 0,
        ],
        _rec: rec,
      })),
      symbolSize: (val) => Math.max(8, Math.min(40, (val[2] || 0) / 2.5)),
      itemStyle: { color: SERIES_COLORS[seriesKey] || '#94a3b8', opacity: 0.8 },
      emphasis: {
        itemStyle: { opacity: 1, borderWidth: 2, borderColor: '#fff' },
      },
    }));

    // Target ratio marker and optimal zone
    const ratio = targetRatio || 0;
    const markLineSeries = [];

    if (ratio > 0) {
      // Add crosshair mark lines to the first scatter series
      if (scatterSeries.length > 0) {
        scatterSeries[0].markLine = {
          silent: true,
          symbol: 'none',
          data: [
            {
              xAxis: ratio,
              lineStyle: { color: '#ef4444', type: 'dashed', width: 2 },
              label: { formatter: `目标 ${ratio.toFixed(2)}`, position: 'end', color: textColor, fontSize: 10 },
            },
          ],
        };

        // Optimal zone: +/- 10% ratio deviation
        const lo = ratio * 0.9;
        const hi = ratio * 1.1;
        scatterSeries[0].markArea = {
          silent: true,
          data: [[
            {
              xAxis: lo,
              itemStyle: {
                color: isDark ? 'rgba(34,197,94,0.1)' : 'rgba(34,197,94,0.08)',
              },
              label: {
                show: true,
                formatter: '最佳区间 (\u00b110%)',
                position: 'insideTop',
                color: isDark ? '#86efac' : '#16a34a',
                fontSize: 10,
              },
            },
            { xAxis: hi },
          ]],
        };
      }
    }

    // Axes range
    const allRatios = recommendations.map(r => r.selectedRatio || r.ratio || 0).filter(v => v > 0);
    const allCapacities = recommendations.map(r => r.selectedCapacity || 0).filter(v => v > 0);
    const minRatio = Math.min(...allRatios, ratio || Infinity) * 0.85;
    const maxRatio = Math.max(...allRatios, ratio || 0) * 1.15;
    const maxCapacity = Math.max(...allCapacities) * 1.15;

    return {
      backgroundColor: 'transparent',
      title: {
        text: '功率-速比散点图',
        left: 'center',
        textStyle: { color: textColor, fontSize: 14, fontWeight: 600 },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (!params.data || !params.data._rec) return '';
          const rec = params.data._rec;
          return `<b>${rec.model}</b><br/>` +
            `速比: ${(rec.selectedRatio || rec.ratio || 0).toFixed(2)}<br/>` +
            `传递能力: ${(rec.selectedCapacity || 0).toFixed(4)} kW/rpm<br/>` +
            `容量余量: ${(rec.capacityMargin || 0).toFixed(1)}%<br/>` +
            `综合评分: ${(rec.score || 0).toFixed(0)}<br/>` +
            `价格: ${formatPrice(rec.factoryPrice || rec.marketPrice)}`;
        },
      },
      legend: {
        data: scatterSeries.map(s => s.name),
        bottom: 0,
        textStyle: { color: textColor, fontSize: 11 },
        itemWidth: 14,
        itemHeight: 10,
      },
      grid: { left: 70, right: 30, top: 50, bottom: 50 },
      xAxis: {
        type: 'value',
        name: '速比',
        nameLocation: 'middle',
        nameGap: 28,
        min: minRatio > 0 && isFinite(minRatio) ? Math.floor(minRatio * 10) / 10 : undefined,
        max: maxRatio > 0 && isFinite(maxRatio) ? Math.ceil(maxRatio * 10) / 10 : undefined,
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
      },
      yAxis: {
        type: 'value',
        name: '传递能力 (kW/rpm)',
        nameLocation: 'middle',
        nameGap: 55,
        min: 0,
        max: maxCapacity > 0 && isFinite(maxCapacity) ? undefined : undefined,
        axisLabel: { color: textColor, formatter: (v) => v.toFixed(3) },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' } },
      },
      series: scatterSeries,
    };
  }, [recommendations, targetRatio, theme]);

  if (!option) return null;

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 350, width: '100%' }}
      theme={theme === 'dark' ? 'dark' : undefined}
      notMerge={true}
    />
  );
};

/**
 * Chart 3: Parallel coordinates for multi-dimensional comparison
 */
const ParallelCoordinatesChart = ({ recommendations, theme, colors }) => {
  const option = useMemo(() => {
    if (recommendations.length === 0) return null;

    const isDark = theme === 'dark';
    const textColor = isDark ? '#e0e0e0' : '#333';

    // Build model list for category axis
    const models = recommendations.map(r => r.model);

    // Axis ranges
    const ratios = recommendations.map(r => r.selectedRatio || r.ratio || 0);
    const margins = recommendations.map(r => r.capacityMargin || 0);
    const diffs = recommendations.map(r => r.ratioDiffPercent || 0);
    const prices = recommendations.map(r => r.factoryPrice || r.marketPrice || r.basePrice || 0);
    const scores = recommendations.map(r => r.score || 0);

    const maxScore = Math.max(...scores, 100);
    const minScore = Math.min(...scores, 0);

    const parallelAxis = [
      {
        dim: 0,
        name: '型号',
        type: 'category',
        data: models,
        axisLabel: { fontSize: 10, color: textColor, rotate: 30 },
        nameTextStyle: { color: textColor },
      },
      {
        dim: 1,
        name: '速比',
        type: 'value',
        min: Math.floor(Math.min(...ratios) * 0.9 * 10) / 10,
        max: Math.ceil(Math.max(...ratios) * 1.1 * 10) / 10,
        nameTextStyle: { color: textColor },
        axisLabel: { color: textColor },
      },
      {
        dim: 2,
        name: '容量余量%',
        type: 'value',
        min: 0,
        max: Math.ceil(Math.max(...margins, 50) / 10) * 10,
        nameTextStyle: { color: textColor },
        axisLabel: { color: textColor },
      },
      {
        dim: 3,
        name: '速比偏差%',
        type: 'value',
        // Inverted: lower is better, display with inverse so better goes up
        inverse: true,
        min: 0,
        max: Math.ceil(Math.max(...diffs, 20) / 5) * 5,
        nameTextStyle: { color: textColor },
        axisLabel: { color: textColor },
      },
      {
        dim: 4,
        name: '出厂价 (万元)',
        type: 'value',
        min: 0,
        max: Math.ceil(Math.max(...prices) / 10000) + 1,
        nameTextStyle: { color: textColor },
        axisLabel: { color: textColor },
      },
      {
        dim: 5,
        name: '综合评分',
        type: 'value',
        min: Math.max(0, Math.floor(minScore / 10) * 10 - 10),
        max: Math.min(100, Math.ceil(maxScore / 10) * 10 + 10),
        nameTextStyle: { color: textColor },
        axisLabel: { color: textColor },
      },
    ];

    // Build data rows
    const data = recommendations.map((rec, idx) => [
      idx, // category index for model
      rec.selectedRatio || rec.ratio || 0,
      rec.capacityMargin || 0,
      rec.ratioDiffPercent || 0,
      (rec.factoryPrice || rec.marketPrice || rec.basePrice || 0) / 10000,
      rec.score || 0,
    ]);

    return {
      backgroundColor: 'transparent',
      title: {
        text: '平行坐标多维对比',
        left: 'center',
        textStyle: { color: textColor, fontSize: 14, fontWeight: 600 },
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          if (!params.data) return '';
          const d = params.data;
          const modelIdx = typeof d[0] === 'number' ? d[0] : 0;
          const model = models[modelIdx] || '?';
          return `<b>${model}</b><br/>` +
            `速比: ${(d[1] || 0).toFixed(2)}<br/>` +
            `容量余量: ${(d[2] || 0).toFixed(1)}%<br/>` +
            `速比偏差: ${(d[3] || 0).toFixed(1)}%<br/>` +
            `出厂价: ${(d[4] || 0).toFixed(1)}万元<br/>` +
            `综合评分: ${(d[5] || 0).toFixed(0)}`;
        },
      },
      parallelAxis,
      parallel: {
        left: 60,
        right: 60,
        top: 50,
        bottom: 40,
        parallelAxisDefault: {
          type: 'value',
          nameLocation: 'end',
          nameGap: 15,
          nameTextStyle: { fontSize: 11, color: textColor },
          axisLine: { lineStyle: { color: isDark ? '#555' : '#ccc' } },
          axisTick: { lineStyle: { color: isDark ? '#555' : '#ccc' } },
          splitLine: { show: false },
          axisLabel: { fontSize: 10, color: textColor },
        },
      },
      visualMap: {
        show: true,
        min: minScore,
        max: maxScore,
        dimension: 5,
        orient: 'horizontal',
        left: 'center',
        bottom: 0,
        text: ['高分', '低分'],
        textStyle: { color: textColor, fontSize: 10 },
        inRange: {
          color: ['#fdae61', '#fee08b', '#d9ef8b', '#66bd63', '#1a9850'],
        },
        itemWidth: 12,
        itemHeight: 120,
      },
      series: {
        type: 'parallel',
        lineStyle: {
          width: 2,
          opacity: 0.6,
        },
        emphasis: {
          lineStyle: {
            width: 4,
            opacity: 1,
          },
        },
        smooth: true,
        data,
      },
    };
  }, [recommendations, theme]);

  if (!option) return null;

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={option}
      style={{ height: 350, width: '100%' }}
      theme={theme === 'dark' ? 'dark' : undefined}
      notMerge={true}
    />
  );
};

/**
 * SelectionComparisonCharts
 *
 * Renders 3 ECharts visualizations for gearbox selection results:
 * 1. Radar comparison (top 5 across 6 dimensions)
 * 2. Scatter plot (ratio vs capacity, bubble size = score, color by series)
 * 3. Parallel coordinates (multi-dimensional brushable comparison)
 *
 * @param {Object} props
 * @param {Array}  props.recommendations - SelectionRecommendation[] from selection algorithm
 * @param {string} props.theme - 'light' or 'dark'
 * @param {Object} props.colors - { headerBg, border, card, text, headerText }
 * @param {number} [props.targetRatio] - user-requested target ratio (for scatter crosshair)
 */
const SelectionComparisonCharts = ({
  recommendations = [],
  theme = 'light',
  colors = {},
  targetRatio,
}) => {
  const isDark = theme === 'dark';

  // Empty state
  if (!recommendations || recommendations.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        color: colors?.text || (isDark ? '#aaa' : '#999'),
        border: `1px solid ${colors?.border || (isDark ? '#444' : '#e0e0e0')}`,
        borderRadius: '8px',
        backgroundColor: colors?.card || (isDark ? '#1e1e1e' : '#fff'),
      }}>
        <i className="bi bi-bar-chart-line" style={{ fontSize: '2.5rem', opacity: 0.4 }}></i>
        <p style={{ marginTop: '12px', fontSize: '14px' }}>
          无选型结果，请先执行选型计算
        </p>
      </div>
    );
  }

  return (
    <div className="selection-comparison-charts">
      <ChartSection
        title="雷达对比图 (Top 5)"
        icon="diagram-3"
        defaultExpanded={true}
        colors={colors}
        theme={theme}
      >
        <RadarComparisonChart
          recommendations={recommendations}
          theme={theme}
          colors={colors}
        />
      </ChartSection>

      <ChartSection
        title="功率-速比散点图"
        icon="scatter-chart"
        defaultExpanded={true}
        colors={colors}
        theme={theme}
      >
        <ScatterPlotChart
          recommendations={recommendations}
          targetRatio={targetRatio}
          theme={theme}
          colors={colors}
        />
      </ChartSection>

      <ChartSection
        title="平行坐标多维对比"
        icon="list-columns-reverse"
        defaultExpanded={true}
        colors={colors}
        theme={theme}
      >
        <ParallelCoordinatesChart
          recommendations={recommendations}
          theme={theme}
          colors={colors}
        />
      </ChartSection>
    </div>
  );
};

export default SelectionComparisonCharts;
