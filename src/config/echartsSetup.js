// src/config/echartsSetup.js
// ECharts 按需导入 — 仅注册实际使用的图表类型和组件
// 替代全量 import 可减少 ~1MB bundle 体积

import * as echarts from 'echarts/core';
import { BarChart, LineChart, ScatterChart, PieChart, RadarChart, GaugeChart, ParallelChart, HeatmapChart, CustomChart, EffectScatterChart } from 'echarts/charts';
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
  MarkAreaComponent,
  MarkPointComponent,
  MarkLineComponent,
  DataZoomComponent,
  ToolboxComponent,
  VisualMapComponent,
  ParallelComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart, LineChart, ScatterChart, PieChart, RadarChart, GaugeChart, ParallelChart, HeatmapChart, CustomChart, EffectScatterChart,
  GridComponent, TooltipComponent, LegendComponent, TitleComponent,
  MarkAreaComponent, MarkPointComponent, MarkLineComponent,
  DataZoomComponent, ToolboxComponent, VisualMapComponent, ParallelComponent,
  CanvasRenderer,
]);

export default echarts;
