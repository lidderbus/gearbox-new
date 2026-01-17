/**
 * 应力-转速曲线图表组件
 *
 * 使用ECharts绘制扭振分析的应力曲线
 * 包含许用应力线、危险转速区间标注
 *
 * @module StressSpeedChart
 */

import React, { useMemo, useRef, useEffect } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import ReactECharts from 'echarts-for-react';
import { FiActivity, FiAlertTriangle } from 'react-icons/fi';

/**
 * 应力-转速曲线组件
 *
 * @param {Object} props
 * @param {Object} props.forcedVibrationResult - 强迫振动分析结果
 * @param {Object} props.systemInfo - 系统信息（工况转速范围等）
 * @param {Object} props.colors - 主题颜色
 * @param {string} props.theme - 主题模式
 * @param {Function} props.onChartReady - 图表ready回调（用于PDF导出）
 */
const StressSpeedChart = ({
  forcedVibrationResult = {},
  systemInfo = {},
  colors = {},
  theme = 'light',
  onChartReady
}) => {
  const chartRef = useRef(null);
  const propellerChartRef = useRef(null);

  // 主题样式
  const cardStyle = useMemo(() => ({
    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
    borderColor: theme === 'dark' ? '#333' : '#dee2e6',
    color: theme === 'dark' ? '#e0e0e0' : '#212529'
  }), [theme]);

  // 提取分析结果数据
  const {
    speedRange = [],
    intermediateShaftStress = [],
    propellerShaftStress = [],
    allowableStress = {},
    dangerZones = [],
    harmonicContributions = []
  } = forcedVibrationResult;

  // 工况转速范围
  const operatingSpeedMin = systemInfo.operatingSpeedMin || 500;
  const operatingSpeedMax = systemInfo.operatingSpeedMax || 2000;

  // 中间轴应力曲线配置
  const intermediateShaftOptions = useMemo(() => {
    if (!speedRange.length || !intermediateShaftStress.length) {
      return getEmptyChartOptions('中间轴扭振应力曲线', theme);
    }

    const totalStress = intermediateShaftStress.map(s => s.total || 0);
    const allowable = allowableStress.intermediateShaft || 35;

    // 找出超限转速点
    const overLimitPoints = [];
    speedRange.forEach((speed, i) => {
      if (totalStress[i] > allowable) {
        overLimitPoints.push([speed, totalStress[i]]);
      }
    });

    // 各谐次应力数据
    const harmonicSeries = [];
    if (harmonicContributions.length > 0) {
      const harmonicOrders = [0.5, 1, 1.5, 2, 3, 4, 6];
      harmonicOrders.forEach((order, idx) => {
        const data = intermediateShaftStress.map(s =>
          s.harmonics?.[idx] || 0
        );
        harmonicSeries.push({
          name: `${order}阶谐次`,
          type: 'line',
          data: speedRange.map((speed, i) => [speed, data[i]]),
          lineStyle: { width: 1, type: 'dashed' },
          showSymbol: false,
          opacity: 0.6
        });
      });
    }

    return {
      title: {
        text: '中间轴扭振应力曲线',
        left: 'center',
        textStyle: {
          color: theme === 'dark' ? '#e0e0e0' : '#333',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let result = `转速: ${params[0]?.axisValue} r/min<br/>`;
          params.forEach(p => {
            if (p.value && p.value[1] !== undefined) {
              result += `${p.seriesName}: ${p.value[1].toFixed(2)} N/mm²<br/>`;
            }
          });
          return result;
        }
      },
      legend: {
        data: ['合成应力', '许用应力', ...harmonicSeries.map(s => s.name)],
        bottom: 0,
        textStyle: { color: theme === 'dark' ? '#ccc' : '#666', fontSize: 10 }
      },
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '15%'
      },
      xAxis: {
        type: 'value',
        name: '转速 (r/min)',
        nameLocation: 'middle',
        nameGap: 25,
        axisLabel: { color: theme === 'dark' ? '#ccc' : '#666' },
        axisLine: { lineStyle: { color: theme === 'dark' ? '#555' : '#ccc' } },
        splitLine: { lineStyle: { color: theme === 'dark' ? '#333' : '#eee' } }
      },
      yAxis: {
        type: 'value',
        name: '应力 (N/mm²)',
        nameLocation: 'middle',
        nameGap: 40,
        axisLabel: { color: theme === 'dark' ? '#ccc' : '#666' },
        axisLine: { lineStyle: { color: theme === 'dark' ? '#555' : '#ccc' } },
        splitLine: { lineStyle: { color: theme === 'dark' ? '#333' : '#eee' } }
      },
      series: [
        // 合成应力曲线
        {
          name: '合成应力',
          type: 'line',
          data: speedRange.map((speed, i) => [speed, totalStress[i]]),
          lineStyle: { width: 2, color: colors.primary || '#3b82f6' },
          showSymbol: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
                { offset: 1, color: 'rgba(59, 130, 246, 0.05)' }
              ]
            }
          }
        },
        // 许用应力线
        {
          name: '许用应力',
          type: 'line',
          data: [[speedRange[0], allowable], [speedRange[speedRange.length - 1], allowable]],
          lineStyle: { width: 2, color: '#ef4444', type: 'dashed' },
          showSymbol: false
        },
        // 超限点标记
        {
          name: '超限点',
          type: 'scatter',
          data: overLimitPoints,
          symbol: 'triangle',
          symbolSize: 10,
          itemStyle: { color: '#ef4444' }
        },
        // 工况范围标记
        {
          name: '工况范围',
          type: 'line',
          markArea: {
            silent: true,
            itemStyle: {
              color: 'rgba(34, 197, 94, 0.1)'
            },
            data: [[
              { xAxis: operatingSpeedMin },
              { xAxis: operatingSpeedMax }
            ]]
          }
        },
        // 危险区域标记
        ...dangerZones.map((zone, idx) => ({
          name: `危险区${idx + 1}`,
          type: 'line',
          markArea: {
            silent: true,
            itemStyle: {
              color: 'rgba(239, 68, 68, 0.15)'
            },
            data: [[
              { xAxis: zone.minSpeed },
              { xAxis: zone.maxSpeed }
            ]]
          }
        })),
        // 各谐次曲线
        ...harmonicSeries
      ]
    };
  }, [speedRange, intermediateShaftStress, allowableStress, dangerZones, theme, colors, operatingSpeedMin, operatingSpeedMax, harmonicContributions]);

  // 螺旋桨轴应力曲线配置
  const propellerShaftOptions = useMemo(() => {
    if (!speedRange.length || !propellerShaftStress.length) {
      return getEmptyChartOptions('螺旋桨轴扭振应力曲线', theme);
    }

    const totalStress = propellerShaftStress.map(s => s.total || 0);
    const allowable = allowableStress.propellerShaft || 30;

    // 找出超限转速点
    const overLimitPoints = [];
    speedRange.forEach((speed, i) => {
      if (totalStress[i] > allowable) {
        overLimitPoints.push([speed, totalStress[i]]);
      }
    });

    return {
      title: {
        text: '螺旋桨轴扭振应力曲线',
        left: 'center',
        textStyle: {
          color: theme === 'dark' ? '#e0e0e0' : '#333',
          fontSize: 14
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params) => {
          let result = `转速: ${params[0]?.axisValue} r/min<br/>`;
          params.forEach(p => {
            if (p.value && p.value[1] !== undefined) {
              result += `${p.seriesName}: ${p.value[1].toFixed(2)} N/mm²<br/>`;
            }
          });
          return result;
        }
      },
      legend: {
        data: ['合成应力', '许用应力'],
        bottom: 0,
        textStyle: { color: theme === 'dark' ? '#ccc' : '#666', fontSize: 10 }
      },
      grid: {
        left: '10%',
        right: '5%',
        top: '15%',
        bottom: '12%'
      },
      xAxis: {
        type: 'value',
        name: '转速 (r/min)',
        nameLocation: 'middle',
        nameGap: 25,
        axisLabel: { color: theme === 'dark' ? '#ccc' : '#666' },
        axisLine: { lineStyle: { color: theme === 'dark' ? '#555' : '#ccc' } },
        splitLine: { lineStyle: { color: theme === 'dark' ? '#333' : '#eee' } }
      },
      yAxis: {
        type: 'value',
        name: '应力 (N/mm²)',
        nameLocation: 'middle',
        nameGap: 40,
        axisLabel: { color: theme === 'dark' ? '#ccc' : '#666' },
        axisLine: { lineStyle: { color: theme === 'dark' ? '#555' : '#ccc' } },
        splitLine: { lineStyle: { color: theme === 'dark' ? '#333' : '#eee' } }
      },
      series: [
        // 合成应力曲线
        {
          name: '合成应力',
          type: 'line',
          data: speedRange.map((speed, i) => [speed, totalStress[i]]),
          lineStyle: { width: 2, color: '#22c55e' },
          showSymbol: false,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
                { offset: 1, color: 'rgba(34, 197, 94, 0.05)' }
              ]
            }
          }
        },
        // 许用应力线
        {
          name: '许用应力',
          type: 'line',
          data: [[speedRange[0], allowable], [speedRange[speedRange.length - 1], allowable]],
          lineStyle: { width: 2, color: '#ef4444', type: 'dashed' },
          showSymbol: false
        },
        // 超限点标记
        {
          name: '超限点',
          type: 'scatter',
          data: overLimitPoints,
          symbol: 'triangle',
          symbolSize: 10,
          itemStyle: { color: '#ef4444' }
        },
        // 工况范围标记
        {
          name: '工况范围',
          type: 'line',
          markArea: {
            silent: true,
            itemStyle: {
              color: 'rgba(34, 197, 94, 0.1)'
            },
            data: [[
              { xAxis: operatingSpeedMin },
              { xAxis: operatingSpeedMax }
            ]]
          }
        }
      ]
    };
  }, [speedRange, propellerShaftStress, allowableStress, theme, operatingSpeedMin, operatingSpeedMax]);

  // 图表ready回调
  useEffect(() => {
    if (onChartReady && chartRef.current && propellerChartRef.current) {
      onChartReady({
        intermediateShaft: chartRef.current.getEchartsInstance(),
        propellerShaft: propellerChartRef.current.getEchartsInstance()
      });
    }
  }, [onChartReady, speedRange]);

  // 计算安全裕度
  const safetyMargin = useMemo(() => {
    if (!intermediateShaftStress.length || !propellerShaftStress.length) {
      return { intermediate: null, propeller: null };
    }

    const maxIntermediateStress = Math.max(...intermediateShaftStress.map(s => s.total || 0));
    const maxPropellerStress = Math.max(...propellerShaftStress.map(s => s.total || 0));

    const intermediateAllowable = allowableStress.intermediateShaft || 35;
    const propellerAllowable = allowableStress.propellerShaft || 30;

    return {
      intermediate: ((intermediateAllowable - maxIntermediateStress) / intermediateAllowable * 100).toFixed(1),
      propeller: ((propellerAllowable - maxPropellerStress) / propellerAllowable * 100).toFixed(1)
    };
  }, [intermediateShaftStress, propellerShaftStress, allowableStress]);

  // 判断是否安全
  const isSafe = useMemo(() => ({
    intermediate: parseFloat(safetyMargin.intermediate) > 0,
    propeller: parseFloat(safetyMargin.propeller) > 0
  }), [safetyMargin]);

  return (
    <div className="stress-speed-chart">
      {/* 安全评估汇总 */}
      <Card style={cardStyle} className="mb-3">
        <Card.Header style={{ backgroundColor: colors.primary || '#3b82f6', color: '#fff' }}>
          <FiActivity className="me-2" />
          强迫振动应力分析结果
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6} className="text-center border-end">
              <h6 className="text-muted">中间轴安全裕度</h6>
              <h3 className={isSafe.intermediate ? 'text-success' : 'text-danger'}>
                {safetyMargin.intermediate !== null ? (
                  <>
                    {safetyMargin.intermediate}%
                    {!isSafe.intermediate && <FiAlertTriangle className="ms-2" />}
                  </>
                ) : '-'}
              </h3>
              <Badge bg={isSafe.intermediate ? 'success' : 'danger'}>
                {isSafe.intermediate ? '满足要求' : '超出许用值'}
              </Badge>
            </Col>
            <Col md={6} className="text-center">
              <h6 className="text-muted">螺旋桨轴安全裕度</h6>
              <h3 className={isSafe.propeller ? 'text-success' : 'text-danger'}>
                {safetyMargin.propeller !== null ? (
                  <>
                    {safetyMargin.propeller}%
                    {!isSafe.propeller && <FiAlertTriangle className="ms-2" />}
                  </>
                ) : '-'}
              </h3>
              <Badge bg={isSafe.propeller ? 'success' : 'danger'}>
                {isSafe.propeller ? '满足要求' : '超出许用值'}
              </Badge>
            </Col>
          </Row>

          {/* 危险转速区间提示 */}
          {dangerZones.length > 0 && (
            <div className="mt-3 p-2 bg-warning bg-opacity-10 rounded">
              <strong className="text-warning">
                <FiAlertTriangle className="me-1" />
                危险转速区间:
              </strong>
              <div className="mt-1">
                {dangerZones.map((zone, idx) => (
                  <Badge key={idx} bg="warning" text="dark" className="me-2">
                    {zone.minSpeed}~{zone.maxSpeed} r/min ({zone.order}阶共振)
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* 图表区域 */}
      <Row>
        <Col lg={6}>
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <ReactECharts
                ref={chartRef}
                option={intermediateShaftOptions}
                style={{ height: '350px' }}
                theme={theme === 'dark' ? 'dark' : undefined}
                notMerge={true}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6}>
          <Card style={cardStyle} className="mb-3">
            <Card.Body>
              <ReactECharts
                ref={propellerChartRef}
                option={propellerShaftOptions}
                style={{ height: '350px' }}
                theme={theme === 'dark' ? 'dark' : undefined}
                notMerge={true}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 图例说明 */}
      <Card style={cardStyle}>
        <Card.Body className="py-2">
          <Row className="small text-muted align-items-center">
            <Col xs="auto">
              <strong>图例说明:</strong>
            </Col>
            <Col xs="auto">
              <span style={{ display: 'inline-block', width: 20, height: 3, backgroundColor: '#3b82f6', marginRight: 5 }}></span>
              中间轴应力
            </Col>
            <Col xs="auto">
              <span style={{ display: 'inline-block', width: 20, height: 3, backgroundColor: '#22c55e', marginRight: 5 }}></span>
              螺旋桨轴应力
            </Col>
            <Col xs="auto">
              <span style={{ display: 'inline-block', width: 20, height: 3, backgroundColor: '#ef4444', borderStyle: 'dashed', marginRight: 5 }}></span>
              许用应力
            </Col>
            <Col xs="auto">
              <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: 'rgba(34, 197, 94, 0.2)', marginRight: 5 }}></span>
              工况范围
            </Col>
            <Col xs="auto">
              <span style={{ display: 'inline-block', width: 12, height: 12, backgroundColor: 'rgba(239, 68, 68, 0.2)', marginRight: 5 }}></span>
              危险区域
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

/**
 * 生成空图表配置
 */
function getEmptyChartOptions(title, theme) {
  return {
    title: {
      text: title,
      left: 'center',
      textStyle: {
        color: theme === 'dark' ? '#e0e0e0' : '#333',
        fontSize: 14
      }
    },
    graphic: {
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: '暂无数据\n请先执行强迫振动分析',
        textAlign: 'center',
        fill: theme === 'dark' ? '#666' : '#999',
        fontSize: 14
      }
    },
    xAxis: { show: false },
    yAxis: { show: false }
  };
}

/**
 * 导出图表为PNG图片（用于PDF报告）
 *
 * @param {Object} chartInstance - ECharts实例
 * @returns {string} Base64图片数据
 */
export function exportChartAsImage(chartInstance) {
  if (!chartInstance) return null;

  try {
    // 检查ECharts实例是否有效
    const dom = chartInstance.getDom?.();
    if (!dom) {
      console.warn('Chart DOM element not available');
      return null;
    }

    // 检查DOM尺寸是否有效
    const width = dom.offsetWidth || dom.clientWidth;
    const height = dom.offsetHeight || dom.clientHeight;
    if (!width || !height || width <= 0 || height <= 0) {
      console.warn('Chart has zero dimensions, skipping export');
      return null;
    }

    return chartInstance.getDataURL({
      type: 'png',
      pixelRatio: 2,
      backgroundColor: '#fff'
    });
  } catch (err) {
    console.warn('Failed to export chart image:', err.message);
    return null;
  }
}

export default StressSpeedChart;
