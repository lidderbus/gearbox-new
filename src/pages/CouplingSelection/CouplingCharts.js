/**
 * 高弹联轴器选型 - ECharts数据可视化组件
 * 包含: 扭矩对比柱状图、评分雷达图、扭矩余量仪表盘
 */
import React, { useMemo, useRef, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';
import { Card, Row, Col } from 'react-bootstrap';

// 颜色配置
const CHART_COLORS = {
  primary: '#0d6efd',
  success: '#198754',
  warning: '#ffc107',
  danger: '#dc3545',
  info: '#0dcaf0',
  secondary: '#6c757d',
  gradient: ['#667eea', '#764ba2'],
  torque: {
    required: '#ff6b6b',
    actual: '#4ecdc4',
    max: '#95a5a6'
  }
};

/**
 * 扭矩对比柱状图
 */
export const TorqueComparisonChart = ({
  requiredTorque,
  actualTorque,
  maxTorque,
  couplingName = '联轴器',
  height = 280
}) => {
  const option = useMemo(() => ({
    title: {
      text: '扭矩对比分析',
      left: 'center',
      top: 10,
      textStyle: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#333'
      }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params) => {
        let result = `<strong>${params[0].name}</strong><br/>`;
        params.forEach(p => {
          result += `${p.marker} ${p.seriesName}: <strong>${p.value.toFixed(2)} kN·m</strong><br/>`;
        });
        return result;
      }
    },
    legend: {
      data: ['所需扭矩', '额定扭矩', '最大扭矩'],
      bottom: 5,
      textStyle: { fontSize: 11 }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '18%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: [couplingName],
      axisLabel: {
        fontSize: 11,
        interval: 0,
        rotate: 0
      }
    },
    yAxis: {
      type: 'value',
      name: 'kN·m',
      nameTextStyle: { fontSize: 11 },
      axisLabel: { fontSize: 10 }
    },
    series: [
      {
        name: '所需扭矩',
        type: 'bar',
        data: [requiredTorque],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#ff6b6b' },
              { offset: 1, color: '#ee5a5a' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '20%',
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          formatter: '{c}'
        }
      },
      {
        name: '额定扭矩',
        type: 'bar',
        data: [actualTorque],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#4ecdc4' },
              { offset: 1, color: '#44a08d' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '20%',
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          formatter: '{c}'
        }
      },
      {
        name: '最大扭矩',
        type: 'bar',
        data: [maxTorque],
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: '#95a5a6' },
              { offset: 1, color: '#7f8c8d' }
            ]
          },
          borderRadius: [4, 4, 0, 0]
        },
        barWidth: '20%',
        label: {
          show: true,
          position: 'top',
          fontSize: 10,
          formatter: '{c}'
        }
      }
    ],
    animationDuration: 800,
    animationEasing: 'elasticOut'
  }), [requiredTorque, actualTorque, maxTorque, couplingName]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

/**
 * 评分雷达图
 */
export const ScoreRadarChart = ({
  scoreBreakdown,
  height = 280
}) => {
  const option = useMemo(() => {
    // 标准化评分到0-100
    const indicators = [
      { name: '扭矩余量', max: 100 },
      { name: '推荐匹配', max: 100 },
      { name: '速度余量', max: 100 },
      { name: '价格评分', max: 100 },
      { name: '重量评分', max: 100 }
    ];

    // 将实际分数转换为百分比
    const values = [
      (scoreBreakdown.torqueMargin / 25) * 100,
      (scoreBreakdown.recommendedMatch / 30) * 100,
      (scoreBreakdown.speedMargin / 15) * 100,
      (scoreBreakdown.priceScore / 20) * 100,
      (scoreBreakdown.weightScore / 10) * 100
    ];

    return {
      title: {
        text: '综合评分分析',
        left: 'center',
        top: 5,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#333'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const data = params.data.value;
          return `<strong>评分明细</strong><br/>
            扭矩余量: ${data[0].toFixed(0)}%<br/>
            推荐匹配: ${data[1].toFixed(0)}%<br/>
            速度余量: ${data[2].toFixed(0)}%<br/>
            价格评分: ${data[3].toFixed(0)}%<br/>
            重量评分: ${data[4].toFixed(0)}%`;
        }
      },
      radar: {
        indicator: indicators,
        center: ['50%', '55%'],
        radius: '60%',
        splitNumber: 4,
        axisName: {
          color: '#666',
          fontSize: 10
        },
        splitLine: {
          lineStyle: {
            color: ['#ddd', '#ccc', '#bbb', '#aaa'].reverse()
          }
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(13, 110, 253, 0.05)', 'rgba(13, 110, 253, 0.1)',
                   'rgba(13, 110, 253, 0.15)', 'rgba(13, 110, 253, 0.2)']
          }
        }
      },
      series: [{
        type: 'radar',
        data: [{
          value: values,
          name: '评分',
          symbol: 'circle',
          symbolSize: 6,
          lineStyle: {
            width: 2,
            color: '#0d6efd'
          },
          areaStyle: {
            color: {
              type: 'radial',
              x: 0.5, y: 0.5, r: 0.5,
              colorStops: [
                { offset: 0, color: 'rgba(13, 110, 253, 0.6)' },
                { offset: 1, color: 'rgba(13, 110, 253, 0.2)' }
              ]
            }
          },
          itemStyle: {
            color: '#0d6efd',
            borderColor: '#fff',
            borderWidth: 2
          }
        }]
      }],
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };
  }, [scoreBreakdown]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

/**
 * 扭矩余量仪表盘
 */
export const TorqueMarginGauge = ({
  margin,
  height = 200
}) => {
  const getColor = (value) => {
    if (value < 10) return '#dc3545';
    if (value < 20) return '#ffc107';
    if (value < 50) return '#198754';
    return '#0d6efd';
  };

  const option = useMemo(() => ({
    series: [{
      type: 'gauge',
      startAngle: 200,
      endAngle: -20,
      min: 0,
      max: 100,
      splitNumber: 10,
      center: ['50%', '60%'],
      radius: '85%',
      itemStyle: {
        color: getColor(margin)
      },
      progress: {
        show: true,
        roundCap: true,
        width: 12
      },
      pointer: {
        show: true,
        length: '60%',
        width: 6,
        itemStyle: {
          color: 'auto'
        }
      },
      axisLine: {
        roundCap: true,
        lineStyle: {
          width: 12,
          color: [
            [0.1, '#dc3545'],
            [0.2, '#ffc107'],
            [0.5, '#198754'],
            [1, '#0d6efd']
          ]
        }
      },
      axisTick: {
        splitNumber: 2,
        lineStyle: {
          width: 2,
          color: '#999'
        }
      },
      splitLine: {
        length: 10,
        lineStyle: {
          width: 3,
          color: '#999'
        }
      },
      axisLabel: {
        distance: 18,
        fontSize: 10,
        color: '#666'
      },
      title: {
        show: true,
        offsetCenter: [0, '80%'],
        fontSize: 12,
        color: '#333'
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        fontSize: 20,
        fontWeight: 'bold',
        offsetCenter: [0, '40%'],
        color: getColor(margin)
      },
      data: [{
        value: margin.toFixed(1),
        name: '扭矩余量'
      }]
    }],
    animationDuration: 1500,
    animationEasing: 'bounceOut'
  }), [margin]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

/**
 * 多联轴器对比图
 */
export const MultiCouplingComparison = ({
  couplings,
  requiredTorque,
  height = 320
}) => {
  const option = useMemo(() => {
    const names = couplings.map(c => c.model);
    const ratedTorques = couplings.map(c => c.ratedTorque);
    const margins = couplings.map(c => ((c.ratedTorque - requiredTorque) / requiredTorque * 100).toFixed(1));
    const scores = couplings.map(c => c.score);

    return {
      title: {
        text: '联轴器对比分析',
        left: 'center',
        top: 5,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'cross' }
      },
      legend: {
        data: ['额定扭矩', '扭矩余量', '综合评分'],
        bottom: 5,
        textStyle: { fontSize: 10 }
      },
      grid: {
        left: '3%',
        right: '8%',
        bottom: '15%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: names,
        axisLabel: {
          fontSize: 10,
          interval: 0,
          rotate: 30
        }
      },
      yAxis: [
        {
          type: 'value',
          name: 'kN·m / %',
          position: 'left',
          axisLabel: { fontSize: 10 }
        },
        {
          type: 'value',
          name: '评分',
          position: 'right',
          min: 0,
          max: 100,
          axisLabel: { fontSize: 10 }
        }
      ],
      series: [
        {
          name: '额定扭矩',
          type: 'bar',
          data: ratedTorques,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#4ecdc4' },
                { offset: 1, color: '#44a08d' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '25%'
        },
        {
          name: '扭矩余量',
          type: 'bar',
          data: margins,
          itemStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: '#667eea' },
                { offset: 1, color: '#764ba2' }
              ]
            },
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '25%'
        },
        {
          name: '综合评分',
          type: 'line',
          yAxisIndex: 1,
          data: scores,
          smooth: true,
          symbol: 'circle',
          symbolSize: 8,
          lineStyle: {
            width: 3,
            color: '#ff6b6b'
          },
          itemStyle: {
            color: '#ff6b6b',
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: 'rgba(255, 107, 107, 0.3)' },
                { offset: 1, color: 'rgba(255, 107, 107, 0.05)' }
              ]
            }
          }
        }
      ],
      animationDuration: 1000
    };
  }, [couplings, requiredTorque]);

  return (
    <ReactECharts
      option={option}
      style={{ height, width: '100%' }}
      opts={{ renderer: 'canvas' }}
    />
  );
};

/**
 * 综合可视化面板
 */
const CouplingCharts = ({
  selectedCoupling,
  recommendations,
  calculationDetails,
  colors = {}
}) => {
  if (!selectedCoupling || !calculationDetails) {
    return null;
  }

  const { requiredTorque } = calculationDetails;
  const margin = ((selectedCoupling.ratedTorque - requiredTorque) / requiredTorque * 100);

  // 获取前5个推荐用于对比
  const topCouplings = recommendations?.slice(0, 5) || [selectedCoupling];

  return (
    <Card className="shadow-sm mb-3">
      <Card.Header className="bg-white py-2">
        <div className="d-flex align-items-center">
          <i className="bi bi-bar-chart-fill text-primary me-2"></i>
          <strong>数据可视化分析</strong>
        </div>
      </Card.Header>
      <Card.Body className="p-2">
        <Row className="g-2">
          {/* 扭矩余量仪表盘 */}
          <Col xs={12} md={4}>
            <Card className="h-100 border-0 bg-light">
              <Card.Body className="p-2">
                <TorqueMarginGauge margin={margin} height={180} />
              </Card.Body>
            </Card>
          </Col>

          {/* 扭矩对比柱状图 */}
          <Col xs={12} md={4}>
            <Card className="h-100 border-0 bg-light">
              <Card.Body className="p-2">
                <TorqueComparisonChart
                  requiredTorque={requiredTorque}
                  actualTorque={selectedCoupling.ratedTorque}
                  maxTorque={selectedCoupling.maxTorque || selectedCoupling.ratedTorque * 1.5}
                  couplingName={selectedCoupling.model}
                  height={180}
                />
              </Card.Body>
            </Card>
          </Col>

          {/* 评分雷达图 */}
          <Col xs={12} md={4}>
            <Card className="h-100 border-0 bg-light">
              <Card.Body className="p-2">
                <ScoreRadarChart
                  scoreBreakdown={selectedCoupling.scoreBreakdown}
                  height={180}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 多联轴器对比 */}
        {topCouplings.length > 1 && (
          <Row className="mt-2">
            <Col xs={12}>
              <Card className="border-0 bg-light">
                <Card.Body className="p-2">
                  <MultiCouplingComparison
                    couplings={topCouplings}
                    requiredTorque={requiredTorque}
                    height={260}
                  />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default CouplingCharts;
