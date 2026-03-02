/**
 * 优势分析报告组件
 * Advantage Report Component
 *
 * 生成可打印的销售话术和竞品对比报告
 */

import React, { useRef, useMemo, useState, useCallback } from 'react';
import { Card, Row, Col, Badge, Button, Alert, ListGroup, Toast, ToastContainer } from 'react-bootstrap';
import ReactECharts from 'echarts-for-react';
import {
  generateComparisonReport,
  generateSalesPitch,
  generateRadarData,
  formatPrice,
  getManufacturerInfo,
  saveCompetitorComparison,
  generateQuotationAttachment,
  calculateEnhancedAdvantages
} from '../../utils/competitorAnalysis';
import { manufacturerColors } from '../../data/competitorData';
import { techDimensionsTemplate } from '../../data/competitorDataEnhanced';

const AdvantageReport = ({
  hangchiProduct,
  competitors,
  colors,
  onExportPDF,
  projectInfo = {}
}) => {
  const reportRef = useRef(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({ title: '', body: '', variant: 'success' });

  // 保存对比记录
  const handleSaveComparison = useCallback(() => {
    const result = saveCompetitorComparison(hangchiProduct, competitors, projectInfo);
    if (result.success) {
      setToastMessage({
        title: '保存成功',
        body: '竞品对比已保存，可在历史记录中查看',
        variant: 'success'
      });
    } else {
      setToastMessage({
        title: '保存失败',
        body: result.message,
        variant: 'danger'
      });
    }
    setShowToast(true);
  }, [hangchiProduct, competitors, projectInfo]);

  // 复制到剪贴板
  const handleCopyToClipboard = useCallback(() => {
    const attachment = generateQuotationAttachment(hangchiProduct, competitors);
    const text = `【竞品对比分析】\n` +
      `杭齿产品: ${attachment.hangchiProduct.model}\n` +
      `竞品: ${attachment.competitors.map(c => `${c.manufacturer} ${c.model}`).join(', ')}\n` +
      `核心优势: ${attachment.advantages.join('、')}\n` +
      `推荐结论: ${attachment.recommendation}`;

    navigator.clipboard.writeText(text).then(() => {
      setToastMessage({
        title: '复制成功',
        body: '对比摘要已复制到剪贴板',
        variant: 'success'
      });
      setShowToast(true);
    }).catch(() => {
      setToastMessage({
        title: '复制失败',
        body: '无法访问剪贴板',
        variant: 'danger'
      });
      setShowToast(true);
    });
  }, [hangchiProduct, competitors]);

  // 生成报告数据 (即使为空也需要调用以保持hooks顺序)
  const report = useMemo(() => {
    if (!hangchiProduct || !competitors || competitors.length === 0) return null;
    return generateComparisonReport(hangchiProduct, competitors);
  }, [hangchiProduct, competitors]);

  const radarData = useMemo(() => {
    if (!hangchiProduct || !competitors || competitors.length === 0) return null;
    return generateRadarData(hangchiProduct, competitors);
  }, [hangchiProduct, competitors]);

  // ECharts雷达图配置 (8维增强版)
  const radarChartOption = useMemo(() => {
    if (!radarData) return null;
    // 扩展到8维: 原5维 + 技术得分 + 环保合规 + 生命周期成本
    const dimensions = [...radarData.dimensions, '技术得分', '环保合规', '生命周期'];

    // 计算增强维度数据
    const hangchiTech = techDimensionsTemplate?.['HANGCHI'] || {};
    const getTechScore = (mfg) => {
      const tech = techDimensionsTemplate?.[mfg] || {};
      let score = 0;
      if (tech.propellerType === 'both') score += 20; else if (tech.propellerType) score += 10;
      if (tech.digitalMonitoring === true) score += 20; else if (tech.digitalMonitoring === 'partial') score += 10;
      if (tech.hybridReady === true) score += 20; else if (tech.hybridReady === 'partial') score += 10;
      if (tech.efficiencyClass === 'premium') score += 20; else if (tech.efficiencyClass === 'high') score += 15; else score += 8;
      if (tech.environmentalCompliance) score += Math.min(tech.environmentalCompliance.length * 7, 20);
      return score;
    };
    const getEnvScore = (mfg) => {
      const tech = techDimensionsTemplate?.[mfg] || {};
      return Math.min((tech.environmentalCompliance || []).length * 30, 100);
    };

    const hangchiEnhanced = [
      ...radarData.hangchi.data,
      getTechScore('HANGCHI'),
      getEnvScore('HANGCHI'),
      75 // 生命周期成本优势默认75
    ];

    // 构建雷达图指标
    const indicator = dimensions.map(dim => ({
      name: dim,
      max: 100
    }));

    // 构建系列数据
    const seriesData = [
      {
        name: '杭齿前进',
        value: hangchiEnhanced,
        itemStyle: { color: manufacturerColors?.HANGCHI || '#D4AF37' },
        areaStyle: { opacity: 0.3 },
        lineStyle: { width: 2 }
      },
      ...radarData.competitors.map(comp => ({
        name: comp.name,
        value: [
          ...comp.data,
          getTechScore(comp.manufacturer),
          getEnvScore(comp.manufacturer),
          55 // 竞品生命周期成本默认55
        ],
        itemStyle: { color: manufacturerColors?.[comp.manufacturer] || '#999' },
        areaStyle: { opacity: 0.2 },
        lineStyle: { width: 2, type: 'dashed' }
      }))
    ];

    return {
      title: {
        text: '多维性能对比',
        left: 'center',
        top: 10,
        textStyle: {
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: (params) => {
          const values = params.value || [];
          let html = `<strong>${params.seriesName}</strong><br/>`;
          dimensions.forEach((dim, idx) => {
            const val = values[idx];
            html += `${dim}: ${typeof val === 'number' ? val.toFixed(1) : (parseFloat(val) || 0).toFixed(1)}<br/>`;
          });
          return html;
        }
      },
      legend: {
        data: ['杭齿前进', ...radarData.competitors.map(c => c.name)],
        bottom: 10,
        itemWidth: 14,
        itemHeight: 14,
        textStyle: { fontSize: 12 }
      },
      radar: {
        center: ['50%', '50%'],
        radius: '60%',
        startAngle: 90,
        splitNumber: 4,
        indicator: indicator,
        axisName: {
          color: '#333',
          fontSize: 11
        },
        splitArea: {
          areaStyle: {
            color: ['rgba(253, 126, 20, 0.05)', 'rgba(253, 126, 20, 0.1)',
                    'rgba(253, 126, 20, 0.15)', 'rgba(253, 126, 20, 0.2)']
          }
        },
        axisLine: {
          lineStyle: { color: 'rgba(0, 0, 0, 0.1)' }
        },
        splitLine: {
          lineStyle: { color: 'rgba(0, 0, 0, 0.1)' }
        }
      },
      series: [{
        type: 'radar',
        emphasis: {
          lineStyle: { width: 3 }
        },
        data: seriesData
      }]
    };
  }, [radarData]);

  // ECharts柱状图配置 - 价格与传递能力对比
  const barChartOption = useMemo(() => {
    if (!hangchiProduct || !competitors || competitors.length === 0) return null;

    const allProducts = [
      { name: '杭齿 ' + (hangchiProduct.model || ''), price: hangchiProduct.price || 0, capacity: hangchiProduct.transferCapacity || 0, color: manufacturerColors.HANGCHI },
      ...competitors.map(c => ({
        name: (getManufacturerInfo(c.manufacturer)?.shortName || c.manufacturer) + ' ' + c.model,
        price: c.estimatedPrice || 0,
        capacity: c.transferCapacity || 0,
        color: manufacturerColors[c.manufacturer]
      }))
    ];

    return {
      title: {
        text: '价格与传递能力对比',
        left: 'center',
        top: 10,
        textStyle: { fontSize: 14, fontWeight: 'bold' }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' },
        formatter: (params) => {
          let html = `<strong>${params[0].axisValue}</strong><br/>`;
          params.forEach(p => {
            const unit = p.seriesName === '价格' ? '万元' : 'kW/(r/min)';
            html += `${p.marker} ${p.seriesName}: ${p.value} ${unit}<br/>`;
          });
          return html;
        }
      },
      legend: {
        data: ['价格', '传递能力'],
        bottom: 10
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        top: '20%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: allProducts.map(p => p.name),
        axisLabel: {
          rotate: 15,
          fontSize: 10
        }
      },
      yAxis: [
        {
          type: 'value',
          name: '价格(万元)',
          position: 'left',
          axisLabel: { formatter: '{value}' }
        },
        {
          type: 'value',
          name: '传递能力',
          position: 'right',
          axisLabel: { formatter: '{value}' }
        }
      ],
      series: [
        {
          name: '价格',
          type: 'bar',
          data: allProducts.map((p, i) => ({
            value: ((typeof p.price === 'number' ? p.price : parseFloat(p.price) || 0) / 10000).toFixed(1),
            itemStyle: { color: i === 0 ? manufacturerColors.HANGCHI : '#999' }
          })),
          barWidth: '30%'
        },
        {
          name: '传递能力',
          type: 'bar',
          yAxisIndex: 1,
          data: allProducts.map((p, i) => ({
            value: (typeof p.capacity === 'number' ? p.capacity : parseFloat(p.capacity) || 0).toFixed(3),
            itemStyle: { color: i === 0 ? 'rgba(253, 126, 20, 0.6)' : 'rgba(150, 150, 150, 0.6)' }
          })),
          barWidth: '30%'
        }
      ]
    };
  }, [hangchiProduct, competitors]);

  // ECharts散点图配置 - 性价比分布
  const scatterChartOption = useMemo(() => {
    if (!hangchiProduct || !competitors || competitors.length === 0) return null;

    const hangchiData = {
      name: '杭齿 ' + (hangchiProduct.model || ''),
      value: [
        hangchiProduct.price ? hangchiProduct.price / 10000 : 0,
        hangchiProduct.transferCapacity || 0
      ],
      symbol: 'diamond',
      symbolSize: 20,
      itemStyle: { color: manufacturerColors.HANGCHI }
    };

    const compData = competitors.map(c => ({
      name: (getManufacturerInfo(c.manufacturer)?.shortName || c.manufacturer) + ' ' + c.model,
      value: [
        c.estimatedPrice ? c.estimatedPrice / 10000 : 0,
        c.transferCapacity || 0
      ],
      symbol: 'circle',
      symbolSize: 15,
      itemStyle: { color: manufacturerColors[c.manufacturer] }
    }));

    return {
      title: {
        text: '性价比分布',
        subtext: '越靠右上角性价比越高',
        left: 'center',
        top: 5,
        textStyle: { fontSize: 14, fontWeight: 'bold' },
        subtextStyle: { fontSize: 11 }
      },
      tooltip: {
        formatter: (params) => {
          const val = params.data?.value || [0, 0];
          const price = typeof val[0] === 'number' ? val[0] : parseFloat(val[0]) || 0;
          const capacity = typeof val[1] === 'number' ? val[1] : parseFloat(val[1]) || 0;
          return `<strong>${params.data?.name || ''}</strong><br/>` +
            `价格: ${price.toFixed(1)}万元<br/>` +
            `传递能力: ${capacity.toFixed(3)} kW/(r/min)`;
        }
      },
      grid: {
        left: '10%',
        right: '10%',
        bottom: '15%',
        top: '20%'
      },
      xAxis: {
        type: 'value',
        name: '价格(万元)',
        nameLocation: 'center',
        nameGap: 30,
        inverse: true // 价格越低越靠右
      },
      yAxis: {
        type: 'value',
        name: '传递能力 kW/(r/min)',
        nameLocation: 'center',
        nameGap: 40
      },
      series: [{
        type: 'scatter',
        data: [hangchiData, ...compData],
        label: {
          show: true,
          formatter: (params) => params.data.name.split(' ')[0],
          position: 'top',
          fontSize: 10
        }
      }]
    };
  }, [hangchiProduct, competitors]);

  // 无数据时的空状态
  if (!hangchiProduct || !competitors || competitors.length === 0 || !report || !radarData) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <i className="bi bi-file-earmark-text fs-1 text-muted mb-3 d-block"></i>
          <p className="text-muted">请先选择杭齿产品和竞品进行对比</p>
        </Card.Body>
      </Card>
    );
  }

  // 渲染ECharts雷达图
  const renderRadarChart = () => {
    return (
      <div className="radar-chart-container">
        <ReactECharts
          option={radarChartOption}
          style={{ height: '350px', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    );
  };

  // 渲染ECharts柱状图
  const renderBarChart = () => {
    if (!barChartOption) return null;
    return (
      <div className="bar-chart-container">
        <ReactECharts
          option={barChartOption}
          style={{ height: '300px', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    );
  };

  // 渲染ECharts散点图
  const renderScatterChart = () => {
    if (!scatterChartOption) return null;
    return (
      <div className="scatter-chart-container">
        <ReactECharts
          option={scatterChartOption}
          style={{ height: '300px', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>
    );
  };

  return (
    <div ref={reportRef}>
      <Card className="shadow-sm mb-4">
        <Card.Header
          style={{ background: colors?.primary || '#2c5282', color: 'white' }}
          className="d-flex justify-content-between align-items-center"
        >
          <span>
            <i className="bi bi-file-earmark-richtext me-2"></i>
            竞品对比分析报告
          </span>
          <div className="d-flex gap-2">
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleCopyToClipboard}
              title="复制摘要"
            >
              <i className="bi bi-clipboard me-1"></i>复制
            </Button>
            <Button
              variant="outline-light"
              size="sm"
              onClick={handleSaveComparison}
              title="保存对比"
            >
              <i className="bi bi-bookmark me-1"></i>保存
            </Button>
            <Button
              variant="light"
              size="sm"
              onClick={() => onExportPDF?.(reportRef.current)}
            >
              <i className="bi bi-download me-1"></i>导出PDF
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* 报告头部 */}
          <div className="text-center mb-4 pb-3 border-bottom">
            <h4 className="mb-2">
              <Badge bg="warning" text="dark" className="me-2">杭齿前进</Badge>
              {hangchiProduct.model || '选型产品'}
            </h4>
            <p className="text-muted mb-0">
              vs.
              {competitors.map((c, i) => (
                <span key={c.model}>
                  {i > 0 && ' / '}
                  <Badge
                    className="mx-1"
                    style={{ backgroundColor: manufacturerColors[c.manufacturer] }}
                  >
                    {getManufacturerInfo(c.manufacturer)?.shortName} {c.model}
                  </Badge>
                </span>
              ))}
            </p>
            <small className="text-muted">
              生成时间: {new Date().toLocaleString()}
            </small>
          </div>

          {/* 推荐结论 */}
          <Alert
            variant={report.summary.totalAdvantages >= 5 ? 'success' : 'info'}
            className="mb-4"
          >
            <Alert.Heading className="fs-6">
              <i className="bi bi-lightbulb me-2"></i>
              推荐结论
            </Alert.Heading>
            <p className="mb-2">{report.summary.recommendation}</p>
            <div className="d-flex flex-wrap gap-2">
              {report.summary.keyPoints.map((point, i) => (
                <Badge key={i} bg="light" text="dark" className="py-2 px-3">
                  <i className="bi bi-check2 text-success me-1"></i>
                  {point}
                </Badge>
              ))}
            </div>
          </Alert>

          {/* 性能对比图 */}
          <Card className="mb-4">
            <Card.Header>
              <i className="bi bi-graph-up me-2"></i>
              可视化分析
            </Card.Header>
            <Card.Body>
              <Row>
                <Col lg={6} className="mb-3">
                  {renderRadarChart()}
                </Col>
                <Col lg={6} className="mb-3">
                  {renderScatterChart()}
                </Col>
              </Row>
              <Row>
                <Col>
                  {renderBarChart()}
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 逐项对比分析 */}
          <Row>
            {report.competitors.map((comp, idx) => {
              const pitches = generateSalesPitch(hangchiProduct, comp.product);
              return (
                <Col key={comp.product.model} md={6} className="mb-4">
                  <Card className="h-100">
                    <Card.Header
                      style={{
                        backgroundColor: manufacturerColors[comp.product.manufacturer],
                        color: 'white'
                      }}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>
                          vs. {comp.manufacturer.shortName} {comp.product.model}
                        </span>
                        <Badge bg="light" text="dark">
                          {comp.advantages.highlights.length}项优势
                        </Badge>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      {/* 优势清单 */}
                      <ListGroup variant="flush" className="mb-3">
                        {comp.advantages.priceAdvantage?.isAdvantage && (
                          <ListGroup.Item className="d-flex align-items-center">
                            <i className="bi bi-currency-yen text-success me-3 fs-5"></i>
                            <div>
                              <strong>价格优势</strong>
                              <div className="text-success">
                                便宜 {comp.advantages.priceAdvantage.percent}%
                                ({formatPrice(comp.advantages.priceAdvantage.diff)})
                              </div>
                            </div>
                          </ListGroup.Item>
                        )}
                        {comp.advantages.deliveryAdvantage?.isAdvantage && (
                          <ListGroup.Item className="d-flex align-items-center">
                            <i className="bi bi-truck text-success me-3 fs-5"></i>
                            <div>
                              <strong>交期优势</strong>
                              <div className="text-success">
                                快 {comp.advantages.deliveryAdvantage.diff} 周
                              </div>
                            </div>
                          </ListGroup.Item>
                        )}
                        {comp.advantages.capacityAdvantage?.isAdvantage && (
                          <ListGroup.Item className="d-flex align-items-center">
                            <i className="bi bi-gear text-success me-3 fs-5"></i>
                            <div>
                              <strong>性能优势</strong>
                              <div className="text-success">
                                传递能力高 {comp.advantages.capacityAdvantage.percent}%
                              </div>
                            </div>
                          </ListGroup.Item>
                        )}
                        {comp.advantages.serviceAdvantage?.isAdvantage && (
                          <ListGroup.Item className="d-flex align-items-center">
                            <i className="bi bi-headset text-success me-3 fs-5"></i>
                            <div>
                              <strong>服务优势</strong>
                              <div className="text-success">
                                {comp.advantages.serviceAdvantage.responseTime}小时响应，
                                {comp.advantages.serviceAdvantage.servicePoints}个服务点
                              </div>
                            </div>
                          </ListGroup.Item>
                        )}
                      </ListGroup>

                      {/* 销售话术 */}
                      <div className="mt-3">
                        <h6 className="mb-2">
                          <i className="bi bi-chat-quote me-2"></i>
                          销售话术建议
                        </h6>
                        {pitches.slice(0, 3).map((pitch, i) => (
                          <div
                            key={i}
                            className="p-2 mb-2 bg-light rounded"
                            style={{ fontSize: '0.9rem' }}
                          >
                            <Badge bg="secondary" className="me-2">{pitch.category}</Badge>
                            {pitch.pitch}
                          </div>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>

          {/* 厂商背景对比 */}
          <Card className="mt-4">
            <Card.Header>
              <i className="bi bi-building me-2"></i>
              厂商背景对比
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <div className="p-3 h-100" style={{ backgroundColor: 'rgba(253, 126, 20, 0.1)', borderRadius: '8px' }}>
                    <h6 style={{ color: manufacturerColors.HANGCHI }}>
                      <i className="bi bi-star-fill me-2"></i>
                      杭州前进齿轮箱
                    </h6>
                    <ul className="small mb-0">
                      <li>国内船用齿轮箱龙头企业</li>
                      <li>70+年行业经验</li>
                      <li>全国50个服务网点</li>
                      <li>CCS/ABS/LR/BV/DNV等认证</li>
                      <li>国产替代首选品牌</li>
                    </ul>
                  </div>
                </Col>
                {competitors.slice(0, 2).map(comp => {
                  const info = getManufacturerInfo(comp.manufacturer);
                  return (
                    <Col key={comp.model} md={4} className="mb-3">
                      <div
                        className="p-3 h-100"
                        style={{
                          backgroundColor: `${manufacturerColors[comp.manufacturer]}10`,
                          borderRadius: '8px'
                        }}
                      >
                        <h6 style={{ color: manufacturerColors[comp.manufacturer] }}>
                          {info?.name}
                        </h6>
                        <div className="small">
                          <p className="mb-1"><strong>定位:</strong> {info?.marketPosition}</p>
                          <p className="mb-1">
                            <strong className="text-success">优势:</strong>{' '}
                            {info?.strengths?.slice(0, 2).join('、')}
                          </p>
                          <p className="mb-0">
                            <strong className="text-danger">劣势:</strong>{' '}
                            {info?.weaknesses?.slice(0, 2).join('、')}
                          </p>
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </Card.Body>
          </Card>

          {/* 报告尾部 */}
          <div className="text-center mt-4 pt-3 border-top text-muted small">
            <p className="mb-1">
              本报告由齿轮箱智能选型系统自动生成
            </p>
            <p className="mb-1">
              <i className="bi bi-globe me-1"></i>
              http://47.99.181.195/gearbox-app/
            </p>
            <p className="mb-0" style={{ fontSize: '0.75rem', color: '#999' }}>
              <i className="bi bi-shield-exclamation me-1"></i>
              数据可信度声明：竞品价格为市场估算值（标注"估算"），技术参数基于公开资料，市场份额为行业推算。仅供内部销售参考，不作为正式商业报价依据。
            </p>
          </div>
        </Card.Body>
      </Card>

      {/* Toast通知 */}
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 9999 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg={toastMessage.variant}
        >
          <Toast.Header>
            <i className={`bi ${toastMessage.variant === 'success' ? 'bi-check-circle' : 'bi-exclamation-circle'} me-2`}></i>
            <strong className="me-auto">{toastMessage.title}</strong>
          </Toast.Header>
          <Toast.Body className={toastMessage.variant === 'success' ? '' : 'text-white'}>
            {toastMessage.body}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default AdvantageReport;
