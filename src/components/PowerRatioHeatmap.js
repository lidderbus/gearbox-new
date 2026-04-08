/**
 * PowerRatioHeatmap - 功率-速比覆盖矩阵 (热力图)
 *
 * X轴: 速比分段 (8个桶)
 * Y轴: 功率分段 (8个桶, 基于 transferCapacity * maxInputSpeed)
 * 单元格值: 落入该功率x速比交叉区的型号数
 * 颜色深浅 = 型号密度; tooltip 列出型号名
 * 支持目标功率/速比十字标记 + 单元格点击弹窗
 */
import React, { useMemo, useState, useCallback } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import echarts from '../config/echartsSetup';
import { embeddedGearboxData } from '../data/embeddedData';

// 速比分段
const RATIO_BANDS = [
  { min: 1.0, max: 1.5, label: '1.0-1.5' },
  { min: 1.5, max: 2.0, label: '1.5-2.0' },
  { min: 2.0, max: 2.5, label: '2.0-2.5' },
  { min: 2.5, max: 3.0, label: '2.5-3.0' },
  { min: 3.0, max: 4.0, label: '3.0-4.0' },
  { min: 4.0, max: 5.0, label: '4.0-5.0' },
  { min: 5.0, max: 7.0, label: '5.0-7.0' },
  { min: 7.0, max: 10.0, label: '7.0-10.0' },
];

// 功率分段 (kW)
const POWER_BANDS = [
  { min: 0, max: 50, label: '0-50' },
  { min: 50, max: 100, label: '50-100' },
  { min: 100, max: 200, label: '100-200' },
  { min: 200, max: 500, label: '200-500' },
  { min: 500, max: 1000, label: '500-1000' },
  { min: 1000, max: 2000, label: '1000-2000' },
  { min: 2000, max: 5000, label: '2000-5000' },
  { min: 5000, max: Infinity, label: '5000+' },
];

/**
 * 提取所有型号平铺列表, 每个包含型号名 + 所有可用的 (功率, 速比) 对
 */
function extractAllModels() {
  const models = [];
  Object.entries(embeddedGearboxData).forEach(([key, value]) => {
    if (!Array.isArray(value)) return;
    const seriesKey = key.replace('Gearboxes', '').toUpperCase();
    value.forEach((m) => {
      const maxSpeed = Array.isArray(m.inputSpeedRange)
        ? Math.max(...m.inputSpeedRange)
        : 0;
      const capacities = Array.isArray(m.transferCapacity) ? m.transferCapacity : [];
      const ratios = Array.isArray(m.ratios) ? m.ratios : [];

      // Each model can cover multiple ratios; compute power per ratio
      ratios.forEach((ratio, ri) => {
        const cap = capacities[ri] !== undefined ? capacities[ri] : (capacities[0] || 0);
        const power = cap * maxSpeed;
        if (power > 0 && ratio > 0) {
          models.push({
            name: m.model,
            series: seriesKey,
            power,
            ratio,
          });
        }
      });
    });
  });
  return models;
}

/**
 * 构建热力图矩阵 [ratioBandIdx, powerBandIdx] => { count, models[] }
 */
function buildMatrix(allModels) {
  // matrix[powerIdx][ratioIdx]
  const matrix = POWER_BANDS.map(() =>
    RATIO_BANDS.map(() => ({ count: 0, models: [] }))
  );

  allModels.forEach((m) => {
    const ri = RATIO_BANDS.findIndex((b) => m.ratio >= b.min && m.ratio < b.max);
    const pi = POWER_BANDS.findIndex((b) => m.power >= b.min && m.power < b.max);
    if (ri >= 0 && pi >= 0) {
      const cell = matrix[pi][ri];
      // Avoid duplicate model names in same cell
      if (!cell.models.some((x) => x.name === m.name && x.series === m.series)) {
        cell.models.push({ name: m.name, series: m.series });
      }
      cell.count = cell.models.length;
    }
  });

  return matrix;
}

const PowerRatioHeatmap = ({
  theme = 'light',
  colors = {},
  targetPower,
  targetRatio,
}) => {
  const isDark = theme === 'dark';
  const textColor = isDark ? '#e0e0e0' : '#333';
  const subTextColor = isDark ? '#aaa' : '#666';
  const cardBg = isDark ? '#1e1e1e' : '#fff';
  const cardBorder = isDark ? '#333' : '#e5e7eb';

  const [selectedCell, setSelectedCell] = useState(null);

  const allModels = useMemo(() => extractAllModels(), []);
  const matrix = useMemo(() => buildMatrix(allModels), [allModels]);

  // Find target cell indices
  const targetRatioIdx = useMemo(() => {
    if (targetRatio == null) return -1;
    return RATIO_BANDS.findIndex((b) => targetRatio >= b.min && targetRatio < b.max);
  }, [targetRatio]);
  const targetPowerIdx = useMemo(() => {
    if (targetPower == null) return -1;
    return POWER_BANDS.findIndex((b) => targetPower >= b.min && targetPower < b.max);
  }, [targetPower]);

  // ECharts heatmap data: [ratioIdx, powerIdx, count]
  const heatmapData = useMemo(() => {
    const data = [];
    matrix.forEach((row, pi) => {
      row.forEach((cell, ri) => {
        data.push([ri, pi, cell.count]);
      });
    });
    return data;
  }, [matrix]);

  const maxCount = useMemo(
    () => Math.max(1, ...heatmapData.map((d) => d[2])),
    [heatmapData]
  );

  // Build markPoint for target crosshair
  const targetMarkData = useMemo(() => {
    if (targetRatioIdx < 0 || targetPowerIdx < 0) return [];
    return [
      {
        coord: [targetRatioIdx, targetPowerIdx],
        symbol: 'pin',
        symbolSize: 40,
        label: { show: true, formatter: '目标', color: '#fff', fontSize: 10 },
        itemStyle: { color: '#ef4444' },
      },
    ];
  }, [targetRatioIdx, targetPowerIdx]);

  const option = useMemo(() => {
    const xLabels = RATIO_BANDS.map((b) => b.label);
    const yLabels = POWER_BANDS.map((b) => b.label);

    // Mark lines for target crosshair
    const markLineData = [];
    if (targetRatioIdx >= 0) {
      markLineData.push({
        xAxis: targetRatioIdx,
        lineStyle: { color: '#ef4444', width: 2, type: 'dashed' },
        label: { show: false },
      });
    }
    if (targetPowerIdx >= 0) {
      markLineData.push({
        yAxis: targetPowerIdx,
        lineStyle: { color: '#ef4444', width: 2, type: 'dashed' },
        label: { show: false },
      });
    }

    return {
      backgroundColor: 'transparent',
      title: {
        text: '功率-速比覆盖矩阵',
        subtext: `共 ${allModels.length} 个功率-速比组合点`,
        left: 'center',
        textStyle: { color: textColor, fontSize: 15 },
        subtextStyle: { color: subTextColor, fontSize: 11 },
      },
      tooltip: {
        position: 'top',
        formatter: (p) => {
          const [ri, pi, count] = p.data;
          if (count === 0) return `速比 ${xLabels[ri]} / 功率 ${yLabels[pi]} kW<br/>无可用型号`;
          const cell = matrix[pi][ri];
          const names = cell.models
            .slice(0, 10)
            .map((m) => `${m.series}-${m.name}`)
            .join(', ');
          const more = cell.models.length > 10 ? `<br/>... 还有 ${cell.models.length - 10} 个` : '';
          return `<b>速比 ${xLabels[ri]} / 功率 ${yLabels[pi]} kW</b><br/>型号数: <b>${count}</b><br/>${names}${more}`;
        },
      },
      grid: { left: 80, right: 60, top: 55, bottom: 60 },
      xAxis: {
        type: 'category',
        data: xLabels,
        name: '速比',
        nameLocation: 'middle',
        nameGap: 30,
        axisLabel: { color: textColor },
        splitArea: { show: true },
      },
      yAxis: {
        type: 'category',
        data: yLabels,
        name: '功率 (kW)',
        nameLocation: 'middle',
        nameGap: 60,
        axisLabel: { color: textColor },
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: maxCount,
        calculable: true,
        orient: 'vertical',
        right: 0,
        top: 'center',
        inRange: {
          color: isDark
            ? ['#1a1a2e', '#16213e', '#0f3460', '#3b82f6', '#60a5fa', '#93c5fd']
            : ['#f0f9ff', '#bae6fd', '#7dd3fc', '#38bdf8', '#0284c7', '#075985'],
        },
        textStyle: { color: textColor },
      },
      dataZoom: [
        { type: 'inside', xAxisIndex: 0 },
        { type: 'inside', yAxisIndex: 0 },
      ],
      series: [
        {
          name: '型号覆盖',
          type: 'heatmap',
          data: heatmapData,
          label: {
            show: true,
            formatter: (p) => (p.data[2] > 0 ? String(p.data[2]) : ''),
            color: (p) => {
              // white text for dark cells, dark text for light cells
              const ratio = p.data[2] / maxCount;
              return ratio > 0.4 ? '#fff' : textColor;
            },
            fontSize: 13,
            fontWeight: 600,
          },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
          markPoint:
            targetMarkData.length > 0
              ? { data: targetMarkData, animation: true }
              : undefined,
          markLine:
            markLineData.length > 0
              ? { data: markLineData, silent: true, symbol: 'none' }
              : undefined,
        },
      ],
    };
  }, [
    heatmapData,
    maxCount,
    matrix,
    allModels.length,
    targetMarkData,
    targetRatioIdx,
    targetPowerIdx,
    textColor,
    subTextColor,
    isDark,
  ]);

  const onChartClick = useCallback(
    (params) => {
      if (params.componentType === 'series' && params.seriesType === 'heatmap') {
        const [ri, pi] = params.data;
        const cell = matrix[pi]?.[ri];
        if (cell && cell.count > 0) {
          setSelectedCell({
            ratioLabel: RATIO_BANDS[ri].label,
            powerLabel: POWER_BANDS[pi].label,
            models: cell.models,
          });
        }
      }
    },
    [matrix]
  );

  const onEvents = useMemo(() => ({ click: onChartClick }), [onChartClick]);

  const cardStyle = {
    background: cardBg,
    border: `1px solid ${cardBorder}`,
    borderRadius: 8,
    padding: 16,
    margin: '0 8px',
  };

  return (
    <div style={{ padding: '16px 0' }}>
      <div style={cardStyle}>
        <ReactEChartsCore
          echarts={echarts}
          option={option}
          style={{ height: 500, width: '100%' }}
          theme={isDark ? 'dark' : undefined}
          notMerge={true}
          onEvents={onEvents}
        />

        {/* Legend / Help text */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginTop: 12,
            padding: '8px 12px',
            borderTop: `1px solid ${cardBorder}`,
            fontSize: 12,
            color: subTextColor,
          }}
        >
          <span>
            <i className="bi bi-info-circle me-1"></i>
            颜色越深代表可用型号越多。点击单元格查看详细型号列表。支持鼠标滚轮缩放。
          </span>
          {targetPower != null && targetRatio != null && (
            <span style={{ color: '#ef4444', fontWeight: 600 }}>
              <i className="bi bi-crosshair me-1"></i>
              目标: {targetPower} kW / 速比 {targetRatio}
            </span>
          )}
        </div>
      </div>

      {/* Detail popup */}
      {selectedCell && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onClick={() => setSelectedCell(null)}
        >
          <div
            style={{
              background: cardBg,
              borderRadius: 12,
              padding: 24,
              maxWidth: 520,
              maxHeight: '70vh',
              overflowY: 'auto',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              color: textColor,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h5 style={{ margin: 0 }}>
                功率 {selectedCell.powerLabel} kW / 速比 {selectedCell.ratioLabel}
              </h5>
              <button
                onClick={() => setSelectedCell(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: 20,
                  cursor: 'pointer',
                  color: textColor,
                  padding: '0 4px',
                }}
                aria-label="关闭"
              >
                &times;
              </button>
            </div>
            <p style={{ color: subTextColor, fontSize: 13 }}>
              共 {selectedCell.models.length} 个型号
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                gap: 8,
              }}
            >
              {selectedCell.models.map((m, i) => (
                <div
                  key={i}
                  style={{
                    padding: '6px 10px',
                    borderRadius: 6,
                    background: isDark ? '#2a2a2a' : '#f3f4f6',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  <span style={{ color: subTextColor, fontSize: 11 }}>{m.series}</span>
                  <br />
                  {m.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PowerRatioHeatmap;
