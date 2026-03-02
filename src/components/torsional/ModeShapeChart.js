/**
 * 振型可视化组件
 * ECharts折线图: X轴=轴系位置(mm), Y轴=相对角位移
 * 多阶振型叠加显示，节点位置标注
 */
import React, { useMemo } from 'react';
import ReactECharts from 'echarts-for-react';

const ModeShapeChart = ({
  naturalFrequencies = [],
  units = [],
  colors = {},
  theme = 'light'
}) => {
  const option = useMemo(() => {
    if (!naturalFrequencies.length) return null;

    const isDark = theme === 'dark';
    const textColor = isDark ? '#e0e0e0' : '#333';
    const gridColor = isDark ? '#444' : '#e0e0e0';
    const modeColors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6'];

    // 计算轴系位置 (累计)
    const positions = [];
    let cumPos = 0;
    for (let i = 0; i < units.length; i++) {
      positions.push(cumPos);
      const unit = units[i];
      if (unit.outerDiameter && unit.torsionalFlexibility) {
        cumPos += 300; // 估计间距
      } else {
        cumPos += 200;
      }
    }

    // 各阶振型线
    const series = [];
    const maxModes = Math.min(naturalFrequencies.length, 4);

    for (let m = 0; m < maxModes; m++) {
      const mode = naturalFrequencies[m];
      const modeShape = mode?.modeShape;
      if (!modeShape) continue;

      const amplitudes = modeShape.amplitudes || modeShape;
      if (!Array.isArray(amplitudes) || amplitudes.length === 0) continue;

      const data = amplitudes.map((amp, i) => [positions[i] || i * 200, amp]);

      // 找节点(零交叉点)
      const nodePoints = [];
      for (let i = 0; i < amplitudes.length - 1; i++) {
        if (amplitudes[i] * amplitudes[i + 1] < 0) {
          // 线性插值找零点
          const x1 = positions[i] || i * 200;
          const x2 = positions[i + 1] || (i + 1) * 200;
          const y1 = amplitudes[i];
          const y2 = amplitudes[i + 1];
          const xNode = x1 + (x2 - x1) * Math.abs(y1) / (Math.abs(y1) + Math.abs(y2));
          nodePoints.push({ coord: [xNode, 0] });
        }
      }

      const freq = mode.frequency || (mode.omega ? mode.omega / (2 * Math.PI) : 0);

      series.push({
        name: `${m + 1}阶 (${typeof freq === 'number' ? freq.toFixed(1) : freq} Hz)`,
        type: 'line',
        data,
        smooth: true,
        lineStyle: { width: 2.5, color: modeColors[m] },
        symbol: 'circle',
        symbolSize: 6,
        itemStyle: { color: modeColors[m] },
        markPoint: nodePoints.length > 0 ? {
          data: nodePoints.map(np => ({
            coord: np.coord,
            symbol: 'diamond',
            symbolSize: 10,
            itemStyle: { color: '#fff', borderColor: modeColors[m], borderWidth: 2 },
            label: { show: true, formatter: '节点', fontSize: 9, color: textColor, position: 'bottom' }
          }))
        } : undefined
      });
    }

    // 零线
    const maxPos = Math.max(...positions, 1000);
    series.push({
      name: '零线',
      type: 'line',
      data: [[0, 0], [maxPos, 0]],
      lineStyle: { width: 1, color: gridColor, type: 'dashed' },
      symbol: 'none',
      silent: true
    });

    return {
      backgroundColor: 'transparent',
      title: {
        text: '振型图',
        left: 'center',
        textStyle: { color: textColor, fontSize: 14 }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          const items = params.filter(p => p.seriesName !== '零线');
          if (!items.length) return '';
          let html = `位置: ${Math.round(items[0].value[0])} mm<br/>`;
          items.forEach(p => {
            html += `${p.marker} ${p.seriesName}: ${p.value[1].toFixed(4)}<br/>`;
          });
          return html;
        }
      },
      legend: {
        bottom: 0,
        textStyle: { color: textColor, fontSize: 10 },
        data: series.filter(s => s.name !== '零线').map(s => s.name)
      },
      grid: { left: 60, right: 30, top: 50, bottom: 45 },
      xAxis: {
        type: 'value',
        name: '轴系位置 (mm)',
        nameLocation: 'middle',
        nameGap: 28,
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' } }
      },
      yAxis: {
        type: 'value',
        name: '相对角位移',
        nameLocation: 'middle',
        nameGap: 45,
        axisLabel: { color: textColor },
        axisLine: { lineStyle: { color: gridColor } },
        splitLine: { lineStyle: { color: gridColor, type: 'dashed' } }
      },
      series
    };
  }, [naturalFrequencies, units, theme, colors]);

  if (!option) {
    return <div className="text-muted text-center py-4">执行分析后显示振型图</div>;
  }

  return (
    <ReactECharts
      option={option}
      style={{ height: 350, width: '100%' }}
      theme={theme === 'dark' ? 'dark' : undefined}
      notMerge={true}
    />
  );
};

export default ModeShapeChart;
