/**
 * 能效可视化仪表盘组件
 * Energy Efficiency Dashboard Component
 *
 * 展示EEDI/EEXI合规性、碳排放、燃油对比等
 * 创建日期: 2026-01-04
 */

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Form, Badge, ProgressBar, Table, Tabs, Tab, Alert } from 'react-bootstrap';
import ReactECharts from 'echarts-for-react';

import {
  CARBON_FACTORS,
  SFC_REFERENCE,
  calculateAttainedEEDI,
  evaluateEEDICompliance,
  calculateCII,
  estimateHybridEfficiencyGain,
  generateEnergyEfficiencyReport
} from '../utils/energyEfficiency';

import {
  calculateAnnualFuelConsumption,
  calculateEmissions,
  calculateCarbonFootprint,
  calculateCarbonCost,
  compareFuelEmissions,
  EMISSION_FACTORS,
  CARBON_PRICES
} from '../utils/emissionCalculator';

/**
 * 安全格式化数字 - 防止 toFixed 调用失败
 * @param {*} value - 要格式化的值
 * @param {number} decimals - 小数位数
 * @param {string} fallback - 非数字时的回退值
 * @returns {string}
 */
const safeFixed = (value, decimals = 2, fallback = '-') => {
  if (typeof value === 'number' && !isNaN(value) && isFinite(value)) {
    return value.toFixed(decimals);
  }
  return fallback;
};

/**
 * EEDI等级徽章组件
 */
const EEDIRatingBadge = ({ rating, size = 'normal' }) => {
  const ratingColors = {
    'A': '#28a745',
    'B': '#5cb85c',
    'C': '#f0ad4e',
    'D': '#d9534f',
    'E': '#c9302c'
  };

  const ratingLabels = {
    'A': '优秀',
    'B': '良好',
    'C': '达标',
    'D': '边缘',
    'E': '不合规'
  };

  const fontSize = size === 'large' ? '2rem' : '1rem';
  const padding = size === 'large' ? '0.5rem 1rem' : '0.25rem 0.5rem';

  return (
    <Badge
      style={{
        backgroundColor: ratingColors[rating] || '#6c757d',
        fontSize,
        padding,
        fontWeight: 'bold'
      }}
    >
      {rating} - {ratingLabels[rating] || '未知'}
    </Badge>
  );
};

/**
 * CII等级仪表盘
 */
const CIIGaugeMeter = ({ rating, value }) => {
  const option = {
    series: [{
      type: 'gauge',
      startAngle: 180,
      endAngle: 0,
      min: 0,
      max: 100,
      splitNumber: 5,
      itemStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 1, y2: 0,
          colorStops: [
            { offset: 0, color: '#28a745' },
            { offset: 0.4, color: '#f0ad4e' },
            { offset: 0.6, color: '#fd7e14' },
            { offset: 0.8, color: '#dc3545' },
            { offset: 1, color: '#c9302c' }
          ]
        }
      },
      progress: {
        show: true,
        width: 20
      },
      axisLine: {
        lineStyle: { width: 20 }
      },
      axisTick: { show: false },
      splitLine: { show: false },
      axisLabel: { show: false },
      pointer: {
        icon: 'triangle',
        length: '60%',
        width: 8,
        offsetCenter: [0, '-40%']
      },
      title: {
        offsetCenter: [0, '-10%'],
        fontSize: 14,
        color: '#666'
      },
      detail: {
        valueAnimation: true,
        offsetCenter: [0, '20%'],
        fontSize: 24,
        fontWeight: 'bold',
        formatter: () => rating,
        color: rating === 'A' ? '#28a745' : rating === 'B' ? '#5cb85c' : rating === 'C' ? '#f0ad4e' : '#dc3545'
      },
      data: [{ value: value || 50, name: 'CII Rating' }]
    }]
  };

  return <ReactECharts option={option} style={{ height: '200px' }} />;
};

/**
 * 碳排放饼图
 */
const EmissionPieChart = ({ emissions, title = '排放组成' }) => {
  const data = [
    { value: emissions.CO2 || 0, name: 'CO₂' },
    { value: (emissions.NOx || 0) * 100, name: 'NOx (×100)' },
    { value: (emissions.SOx || 0) * 100, name: 'SOx (×100)' },
    { value: (emissions.PM || 0) * 1000, name: 'PM (×1000)' }
  ].filter(d => d.value > 0);

  const option = {
    title: {
      text: title,
      left: 'center',
      textStyle: { fontSize: 14, color: '#666' }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      top: 'middle'
    },
    series: [{
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['60%', '55%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 4,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: { show: false },
      emphasis: {
        label: {
          show: true,
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      labelLine: { show: false },
      data,
      color: ['#5470c6', '#91cc75', '#fac858', '#ee6666']
    }]
  };

  return <ReactECharts option={option} style={{ height: '250px' }} />;
};

/**
 * 燃油对比柱状图
 */
const FuelComparisonChart = ({ comparisonData }) => {
  if (!comparisonData || comparisonData.length === 0) return null;

  const fuelNames = comparisonData.map(d => d.fuelName);
  const co2Data = comparisonData.map(d => d.CO2);
  const costData = comparisonData.map(d => d.annualCost / 10000); // 万元

  const option = {
    title: {
      text: '不同燃油年度排放与成本对比',
      left: 'center',
      textStyle: { fontSize: 14, color: '#666' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' }
    },
    legend: {
      data: ['CO₂排放 (吨)', '年度成本 (万元)'],
      bottom: 0
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '15%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: fuelNames,
      axisLabel: { rotate: 15 }
    },
    yAxis: [
      {
        type: 'value',
        name: 'CO₂ (吨)',
        position: 'left'
      },
      {
        type: 'value',
        name: '成本 (万元)',
        position: 'right'
      }
    ],
    series: [
      {
        name: 'CO₂排放 (吨)',
        type: 'bar',
        data: co2Data,
        itemStyle: { color: '#5470c6' }
      },
      {
        name: '年度成本 (万元)',
        type: 'line',
        yAxisIndex: 1,
        data: costData,
        itemStyle: { color: '#ee6666' },
        lineStyle: { width: 2 }
      }
    ]
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />;
};

/**
 * 混合动力效益对比图
 */
const HybridBenefitChart = ({ baseline, hybrid }) => {
  const option = {
    title: {
      text: '混合动力节能效益',
      left: 'center',
      textStyle: { fontSize: 14, color: '#666' }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['传统动力', '混合动力'],
      bottom: 0
    },
    radar: {
      indicator: [
        { name: 'EEDI指数', max: baseline?.eedi * 1.5 || 20 },
        { name: '燃油消耗', max: baseline?.fuel * 1.2 || 1000 },
        { name: 'CO₂排放', max: baseline?.co2 * 1.2 || 3000 },
        { name: '年度成本', max: baseline?.cost * 1.2 || 500 }
      ],
      center: ['50%', '55%'],
      radius: '65%'
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: [baseline?.eedi || 0, baseline?.fuel || 0, baseline?.co2 || 0, baseline?.cost || 0],
          name: '传统动力',
          areaStyle: { opacity: 0.3 },
          lineStyle: { color: '#ee6666' },
          itemStyle: { color: '#ee6666' }
        },
        {
          value: [hybrid?.eedi || 0, hybrid?.fuel || 0, hybrid?.co2 || 0, hybrid?.cost || 0],
          name: '混合动力',
          areaStyle: { opacity: 0.3 },
          lineStyle: { color: '#91cc75' },
          itemStyle: { color: '#91cc75' }
        }
      ]
    }]
  };

  return <ReactECharts option={option} style={{ height: '300px' }} />;
};

/**
 * 主仪表盘组件
 */
const EnergyDashboard = ({
  gearbox = null,
  engineData = {},
  shipData = {},
  hybridConfig = null,
  colors = {}
}) => {
  // 输入状态
  const [localShipData, setLocalShipData] = useState({
    type: shipData.type || 'bulkCarrier',
    capacity: shipData.capacity || 10000,
    speed: shipData.speed || 14,
    buildYear: shipData.buildYear || 2020,
    fuelType: shipData.fuelType || 'MDO',
    annualDistance: shipData.annualDistance || 50000,
    annualHours: shipData.annualHours || 5000
  });

  const [activeTab, setActiveTab] = useState('overview');

  // 船舶类型选项
  const shipTypes = {
    bulkCarrier: '散货船',
    tanker: '油轮',
    containerShip: '集装箱船',
    generalCargo: '杂货船',
    roRo: '滚装船',
    passenger: '客船',
    gasCarrier: '气体运输船',
    cruiseShip: '邮轮'
  };

  // 燃油类型选项
  const fuelTypes = Object.entries(CARBON_FACTORS).map(([key, val]) => ({
    value: key,
    label: `${val.name} (${key})`
  }));

  // 计算数据
  const calculatedData = useMemo(() => {
    const enginePower = parseFloat(engineData.power) || 1000;
    const engineSpeed = parseFloat(engineData.speed) || 1800;
    const { type, capacity, speed, buildYear, fuelType, annualDistance, annualHours } = localShipData;

    // EEDI计算
    const eediParams = {
      mainEnginePower: enginePower,
      mainEngineSFC: SFC_REFERENCE.mainEngine.medium,
      fuelType,
      capacity: parseFloat(capacity),
      speed: parseFloat(speed),
      auxiliaryPower: enginePower * 0.05
    };

    const eediResult = calculateAttainedEEDI(eediParams);
    const attainedEEDI = eediResult?.attainedEEDI || 0;
    const compliance = evaluateEEDICompliance(attainedEEDI, type, parseFloat(capacity), parseInt(buildYear));

    // CII计算
    const ciiResult = calculateCII({
      annualCO2: attainedEEDI * parseFloat(capacity) * parseFloat(annualDistance) / 1000000,
      capacity: parseFloat(capacity),
      distance: parseFloat(annualDistance),
      shipType: type
    });

    // 燃油消耗
    const annualFuel = calculateAnnualFuelConsumption(
      enginePower,
      SFC_REFERENCE.mainEngine.medium,
      parseFloat(annualHours),
      0.75
    );

    // 排放计算
    const emissions = calculateEmissions(annualFuel, fuelType, {
      engineType: 'slow',
      inECA: false
    });

    // 碳足迹
    const carbonFootprint = calculateCarbonFootprint(
      emissions.CO2,
      parseFloat(annualDistance),
      parseFloat(capacity) * 0.7
    );

    // 碳成本
    const carbonCost = calculateCarbonCost(emissions.CO2, 'euETS');

    // 燃油对比 - 将对象转换为数组格式
    const fuelComparisonRaw = compareFuelEmissions(annualFuel, fuelType);
    const fuelComparison = fuelComparisonRaw ? Object.entries(fuelComparisonRaw).map(([key, val]) => ({
      fuelType: key,
      fuelName: val.name || key,
      CO2: parseFloat(val.co2) || 0,
      annualCost: parseFloat(val.fuelCost) || 0,
      carbonCost: parseFloat(val.carbonCost) || 0,
      fuelConsumption: parseFloat(val.fuelConsumption) || 0
    })) : [];

    // 混合动力效益
    let hybridBenefit = null;
    if (hybridConfig?.enabled) {
      hybridBenefit = estimateHybridEfficiencyGain({
        baselineEEDI: attainedEEDI,
        hybridConfig,
        enginePower
      });
    }

    // 安全获取值，防止undefined
    const safeEmissions = emissions || { CO2: 0, NOx: 0, SOx: 0, PM: 0 };
    const safeCarbonCost = carbonCost || { cost: 0 };
    const safeCarbonFootprint = carbonFootprint || { perNauticalMile: 0, perTonMile: 0, perCargoTon: 0 };
    const safeAnnualFuel = annualFuel || 0;

    return {
      eedi: {
        attained: attainedEEDI,
        ...(compliance || {})
      },
      cii: ciiResult || { rating: 'N/A', value: 0 },
      fuel: {
        annual: safeAnnualFuel,
        daily: safeAnnualFuel / 365
      },
      emissions: safeEmissions,
      carbonFootprint: safeCarbonFootprint,
      carbonCost: safeCarbonCost,
      fuelComparison: fuelComparison || [],
      hybridBenefit,
      baseline: {
        eedi: attainedEEDI,
        fuel: safeAnnualFuel,
        co2: safeEmissions.CO2,
        cost: safeCarbonCost.cost / 10000
      },
      hybrid: hybridBenefit ? {
        eedi: attainedEEDI * (1 - (hybridBenefit.eediReduction || 0) / 100),
        fuel: safeAnnualFuel * (1 - (hybridBenefit.fuelSavings || 0) / 100),
        co2: safeEmissions.CO2 * (1 - (hybridBenefit.fuelSavings || 0) / 100),
        cost: safeCarbonCost.cost * (1 - (hybridBenefit.fuelSavings || 0) / 100) / 10000
      } : null
    };
  }, [engineData, localShipData, hybridConfig]);

  const handleInputChange = (field, value) => {
    setLocalShipData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header
        style={{
          backgroundColor: colors.headerBg,
          color: colors.headerText,
          borderBottomColor: colors.border
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>能效与排放分析仪表盘</span>
          <Badge bg="info">IMO MEPC.333(76)</Badge>
        </div>
      </Card.Header>

      <Card.Body>
        {/* 输入参数区 */}
        <Row className="mb-4">
          <Col md={12}>
            <Card className="mb-3" style={{ backgroundColor: colors.inputBg }}>
              <Card.Body>
                <h6 className="mb-3">船舶参数配置</h6>
                <Row>
                  <Col md={3} sm={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>船舶类型</Form.Label>
                      <Form.Select
                        value={localShipData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        style={{ backgroundColor: colors.inputBg, color: colors.text }}
                      >
                        {Object.entries(shipTypes).map(([key, label]) => (
                          <option key={key} value={key}>{label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={2} sm={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>载重吨 (DWT)</Form.Label>
                      <Form.Control
                        type="number"
                        value={localShipData.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                        style={{ backgroundColor: colors.inputBg, color: colors.text }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} sm={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>设计航速 (节)</Form.Label>
                      <Form.Control
                        type="number"
                        value={localShipData.speed}
                        onChange={(e) => handleInputChange('speed', e.target.value)}
                        style={{ backgroundColor: colors.inputBg, color: colors.text }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2} sm={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>建造年份</Form.Label>
                      <Form.Control
                        type="number"
                        value={localShipData.buildYear}
                        onChange={(e) => handleInputChange('buildYear', e.target.value)}
                        style={{ backgroundColor: colors.inputBg, color: colors.text }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} sm={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>燃油类型</Form.Label>
                      <Form.Select
                        value={localShipData.fuelType}
                        onChange={(e) => handleInputChange('fuelType', e.target.value)}
                        style={{ backgroundColor: colors.inputBg, color: colors.text }}
                      >
                        {fuelTypes.map(f => (
                          <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-2">
                  <Col md={3} sm={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>年航行里程 (海里)</Form.Label>
                      <Form.Control
                        type="number"
                        value={localShipData.annualDistance}
                        onChange={(e) => handleInputChange('annualDistance', e.target.value)}
                        style={{ backgroundColor: colors.inputBg, color: colors.text }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} sm={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>年运行小时</Form.Label>
                      <Form.Control
                        type="number"
                        value={localShipData.annualHours}
                        onChange={(e) => handleInputChange('annualHours', e.target.value)}
                        style={{ backgroundColor: colors.inputBg, color: colors.text }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} sm={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>主机功率 (kW)</Form.Label>
                      <Form.Control
                        type="text"
                        value={engineData.power || '未设置'}
                        readOnly
                        style={{ backgroundColor: colors.inputBg, color: colors.muted }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3} sm={6} className="mb-2">
                    <Form.Group>
                      <Form.Label>混合动力</Form.Label>
                      <Form.Control
                        type="text"
                        value={hybridConfig?.enabled ? '已启用' : '未启用'}
                        readOnly
                        style={{
                          backgroundColor: hybridConfig?.enabled ? '#d4edda' : colors.inputBg,
                          color: hybridConfig?.enabled ? '#155724' : colors.muted
                        }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* 结果展示区 - 标签页 */}
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          {/* 概览标签 */}
          <Tab eventKey="overview" title="能效概览">
            <Row>
              {/* EEDI指标卡 */}
              <Col lg={4} md={6} className="mb-3">
                <Card className="h-100" style={{ borderColor: calculatedData.eedi.isCompliant ? '#28a745' : '#dc3545' }}>
                  <Card.Header className="text-center">
                    <strong>EEDI 能效设计指数</strong>
                  </Card.Header>
                  <Card.Body className="text-center">
                    <h2 style={{ color: colors.primary }}>
                      {safeFixed(calculatedData.eedi.attained, 2, 'N/A')}
                    </h2>
                    <p className="text-muted mb-2">g CO₂ / t·nm</p>
                    <EEDIRatingBadge rating={calculatedData.eedi.rating} size="large" />
                    <div className="mt-3">
                      <small className="text-muted">
                        基准线: {safeFixed(calculatedData.eedi.referenceLine, 2, 'N/A')}
                      </small>
                      <ProgressBar
                        now={calculatedData.eedi.margin ? 100 - calculatedData.eedi.margin : 50}
                        variant={calculatedData.eedi.isCompliant ? 'success' : 'danger'}
                        className="mt-2"
                        label={`${safeFixed(calculatedData.eedi.margin, 1, '0')}% 余量`}
                      />
                    </div>
                    {!calculatedData.eedi.isCompliant && (
                      <Alert variant="warning" className="mt-3 mb-0 py-2">
                        <small>{calculatedData.eedi.recommendation}</small>
                      </Alert>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              {/* CII指标卡 */}
              <Col lg={4} md={6} className="mb-3">
                <Card className="h-100">
                  <Card.Header className="text-center">
                    <strong>CII 碳强度指标</strong>
                  </Card.Header>
                  <Card.Body>
                    <CIIGaugeMeter
                      rating={calculatedData.cii.rating}
                      value={calculatedData.cii.rating === 'A' ? 20 :
                             calculatedData.cii.rating === 'B' ? 40 :
                             calculatedData.cii.rating === 'C' ? 60 :
                             calculatedData.cii.rating === 'D' ? 80 : 95}
                    />
                    <div className="text-center mt-2">
                      <small className="text-muted">
                        CII值: {safeFixed(calculatedData.cii?.value, 4, 'N/A')} g CO₂/t·nm
                      </small>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              {/* 年度排放摘要卡 */}
              <Col lg={4} md={12} className="mb-3">
                <Card className="h-100">
                  <Card.Header className="text-center">
                    <strong>年度排放摘要</strong>
                  </Card.Header>
                  <Card.Body>
                    <Table size="sm" borderless>
                      <tbody>
                        <tr>
                          <td>年燃油消耗</td>
                          <td className="text-end"><strong>{safeFixed(calculatedData.fuel?.annual, 1)} 吨</strong></td>
                        </tr>
                        <tr>
                          <td>日均消耗</td>
                          <td className="text-end">{safeFixed(calculatedData.fuel?.daily, 2)} 吨/天</td>
                        </tr>
                        <tr>
                          <td>CO₂排放</td>
                          <td className="text-end"><strong>{safeFixed(calculatedData.emissions?.CO2, 1)} 吨</strong></td>
                        </tr>
                        <tr>
                          <td>NOx排放</td>
                          <td className="text-end">{safeFixed(calculatedData.emissions?.NOx, 2)} 吨</td>
                        </tr>
                        <tr>
                          <td>SOx排放</td>
                          <td className="text-end">{safeFixed(calculatedData.emissions?.SOx, 2)} 吨</td>
                        </tr>
                        <tr className="border-top">
                          <td>EU ETS碳成本</td>
                          <td className="text-end text-danger">
                            <strong>${(calculatedData.carbonCost?.cost || 0).toLocaleString()}</strong>
                          </td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* 混合动力效益展示 */}
            {calculatedData.hybridBenefit && (
              <Row className="mt-3">
                <Col md={12}>
                  <Alert variant="success">
                    <Alert.Heading>混合动力效益分析</Alert.Heading>
                    <Row>
                      <Col md={3}>
                        <strong>EEDI改善:</strong> -{calculatedData.hybridBenefit.eediReduction}%
                      </Col>
                      <Col md={3}>
                        <strong>燃油节省:</strong> -{calculatedData.hybridBenefit.fuelSavings}%
                      </Col>
                      <Col md={3}>
                        <strong>年节省燃油:</strong> {safeFixed(calculatedData.fuel?.annual * calculatedData.hybridBenefit?.fuelSavings / 100, 1)} 吨
                      </Col>
                      <Col md={3}>
                        <strong>年减排CO₂:</strong> {safeFixed(calculatedData.emissions?.CO2 * calculatedData.hybridBenefit?.fuelSavings / 100, 1)} 吨
                      </Col>
                    </Row>
                  </Alert>
                </Col>
              </Row>
            )}
          </Tab>

          {/* 排放详情标签 */}
          <Tab eventKey="emissions" title="排放详情">
            <Row>
              <Col md={6}>
                <EmissionPieChart emissions={calculatedData.emissions} />
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>排放因子参考 (kg/吨燃油)</Card.Header>
                  <Card.Body>
                    <Table size="sm" striped>
                      <thead>
                        <tr>
                          <th>污染物</th>
                          <th>排放因子</th>
                          <th>来源</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>CO₂</td>
                          <td>{CARBON_FACTORS[localShipData.fuelType]?.CF * 1000 || 3206} kg/t</td>
                          <td>IMO MEPC</td>
                        </tr>
                        <tr>
                          <td>NOx</td>
                          <td>{EMISSION_FACTORS.NOx.tier2} kg/t (Tier II)</td>
                          <td>IMO NOx规则</td>
                        </tr>
                        <tr>
                          <td>SOx</td>
                          <td>{EMISSION_FACTORS.SOx.mgo} kg/t (MGO)</td>
                          <td>IMO MARPOL</td>
                        </tr>
                        <tr>
                          <td>PM</td>
                          <td>{EMISSION_FACTORS.PM.mgo} kg/t (MGO)</td>
                          <td>EPA AP-42</td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col md={12}>
                <Card>
                  <Card.Header>碳足迹分析</Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4} className="text-center">
                        <h4>{safeFixed(calculatedData.carbonFootprint?.perNauticalMile, 2)}</h4>
                        <p className="text-muted">kg CO₂ / 海里</p>
                      </Col>
                      <Col md={4} className="text-center">
                        <h4>{safeFixed(calculatedData.carbonFootprint?.perTonMile, 4)}</h4>
                        <p className="text-muted">kg CO₂ / 吨·海里</p>
                      </Col>
                      <Col md={4} className="text-center">
                        <h4>{safeFixed(calculatedData.carbonFootprint?.perCargoTon, 2)}</h4>
                        <p className="text-muted">kg CO₂ / 货物吨</p>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>

          {/* 燃油对比标签 */}
          <Tab eventKey="fuelComparison" title="燃油对比">
            <Row>
              <Col md={12}>
                <FuelComparisonChart comparisonData={calculatedData.fuelComparison} />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col md={12}>
                <Table responsive striped bordered hover size="sm">
                  <thead>
                    <tr>
                      <th>燃油类型</th>
                      <th>CO₂排放 (吨/年)</th>
                      <th>NOx (吨/年)</th>
                      <th>SOx (吨/年)</th>
                      <th>PM (吨/年)</th>
                      <th>年度成本 (万元)</th>
                      <th>相对当前</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculatedData.fuelComparison?.map((fuel, idx) => (
                      <tr key={idx} style={fuel.fuelType === localShipData.fuelType ? { backgroundColor: '#e8f5e9' } : {}}>
                        <td>
                          {fuel.fuelName}
                          {fuel.fuelType === localShipData.fuelType && <Badge bg="success" className="ms-2">当前</Badge>}
                        </td>
                        <td>{safeFixed(fuel.CO2, 1)}</td>
                        <td>{safeFixed(fuel.NOx, 2)}</td>
                        <td>{safeFixed(fuel.SOx, 2)}</td>
                        <td>{safeFixed(fuel.PM, 3)}</td>
                        <td>{safeFixed(fuel.annualCost / 10000, 1)}</td>
                        <td>
                          {fuel.fuelType === localShipData.fuelType ? '-' : (
                            <span style={{ color: fuel.CO2 < calculatedData.emissions?.CO2 ? 'green' : 'red' }}>
                              {fuel.CO2 < calculatedData.emissions?.CO2 ? '↓' : '↑'}
                              {safeFixed(Math.abs((fuel.CO2 / (calculatedData.emissions?.CO2 || 1) - 1) * 100), 1)}%
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>
          </Tab>

          {/* 混合动力对比标签 */}
          <Tab eventKey="hybrid" title="混合动力">
            {hybridConfig?.enabled ? (
              <Row>
                <Col md={6}>
                  <HybridBenefitChart
                    baseline={calculatedData.baseline}
                    hybrid={calculatedData.hybrid}
                  />
                </Col>
                <Col md={6}>
                  <Card>
                    <Card.Header>混合动力效益详情</Card.Header>
                    <Card.Body>
                      <Table size="sm">
                        <thead>
                          <tr>
                            <th>指标</th>
                            <th>传统动力</th>
                            <th>混合动力</th>
                            <th>节省</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>EEDI (g CO₂/t·nm)</td>
                            <td>{safeFixed(calculatedData.baseline?.eedi, 2)}</td>
                            <td>{safeFixed(calculatedData.hybrid?.eedi, 2)}</td>
                            <td className="text-success">
                              -{calculatedData.hybridBenefit?.eediReduction || 0}%
                            </td>
                          </tr>
                          <tr>
                            <td>年燃油 (吨)</td>
                            <td>{safeFixed(calculatedData.baseline?.fuel, 1)}</td>
                            <td>{safeFixed(calculatedData.hybrid?.fuel, 1)}</td>
                            <td className="text-success">
                              -{safeFixed((calculatedData.baseline?.fuel || 0) - (calculatedData.hybrid?.fuel || 0), 1)}
                            </td>
                          </tr>
                          <tr>
                            <td>年CO₂ (吨)</td>
                            <td>{safeFixed(calculatedData.baseline?.co2, 1)}</td>
                            <td>{safeFixed(calculatedData.hybrid?.co2, 1)}</td>
                            <td className="text-success">
                              -{safeFixed((calculatedData.baseline?.co2 || 0) - (calculatedData.hybrid?.co2 || 0), 1)}
                            </td>
                          </tr>
                          <tr>
                            <td>碳成本 (万元)</td>
                            <td>{safeFixed(calculatedData.baseline?.cost, 1)}</td>
                            <td>{safeFixed(calculatedData.hybrid?.cost, 1)}</td>
                            <td className="text-success">
                              -{safeFixed((calculatedData.baseline?.cost || 0) - (calculatedData.hybrid?.cost || 0), 1)}
                            </td>
                          </tr>
                        </tbody>
                      </Table>

                      <Alert variant="info" className="mt-3">
                        <strong>混合动力配置:</strong>
                        <ul className="mb-0 mt-2">
                          {hybridConfig.modes?.pto && <li>PTO模式: {hybridConfig.ptoPower || '?'}kW</li>}
                          {hybridConfig.modes?.pti && <li>PTI模式: {hybridConfig.ptiPower || '?'}kW</li>}
                          {hybridConfig.modes?.pth && <li>PTH模式 (应急回港)</li>}
                        </ul>
                      </Alert>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            ) : (
              <Alert variant="secondary">
                <Alert.Heading>混合动力未启用</Alert.Heading>
                <p>请在选型参数中启用混合动力配置以查看节能效益分析。</p>
                <hr />
                <p className="mb-0">
                  混合动力(PTI/PTO)可降低EEDI 10-20%，年节省燃油15-25%。
                </p>
              </Alert>
            )}
          </Tab>

          {/* 碳成本标签 */}
          <Tab eventKey="carbonCost" title="碳成本">
            <Row>
              <Col md={6}>
                <Card>
                  <Card.Header>碳定价方案对比</Card.Header>
                  <Card.Body>
                    <Table striped>
                      <thead>
                        <tr>
                          <th>碳市场</th>
                          <th>碳价 ($/t)</th>
                          <th>年度成本 ($)</th>
                          <th>年度成本 (¥)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Object.entries(CARBON_PRICES).map(([market, price]) => (
                          <tr key={market}>
                            <td>
                              {market === 'euETS' ? 'EU ETS' :
                               market === 'china' ? '中国碳市场' :
                               market === 'imoPotential' ? 'IMO预期' : market}
                            </td>
                            <td>${price}</td>
                            <td>${((calculatedData.emissions?.CO2 || 0) * price).toLocaleString()}</td>
                            <td>¥{((calculatedData.emissions?.CO2 || 0) * price * 7.2).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={6}>
                <Card>
                  <Card.Header>碳成本趋势预测</Card.Header>
                  <Card.Body>
                    <Alert variant="warning">
                      <strong>EU ETS 2024执行</strong>
                      <p className="mb-0 mt-2">
                        自2024年起，大型船舶纳入EU ETS。
                        预计2025年碳价将达100-150$/吨。
                      </p>
                    </Alert>
                    <div className="mt-3">
                      <h5>10年碳成本预测</h5>
                      <p>基于当前排放量，假设碳价年增5%:</p>
                      <ul>
                        <li>第1年: ${((calculatedData.emissions?.CO2 || 0) * 85).toLocaleString()}</li>
                        <li>第5年: ${((calculatedData.emissions?.CO2 || 0) * 85 * Math.pow(1.05, 4)).toLocaleString()}</li>
                        <li>第10年: ${((calculatedData.emissions?.CO2 || 0) * 85 * Math.pow(1.05, 9)).toLocaleString()}</li>
                        <li><strong>10年累计: ${((calculatedData.emissions?.CO2 || 0) * 85 * ((Math.pow(1.05, 10) - 1) / 0.05)).toLocaleString()}</strong></li>
                      </ul>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>

        {/* 底部说明 */}
        <div className="mt-4 text-muted small">
          <p className="mb-1">
            <strong>数据来源:</strong> IMO MEPC.333(76) EEXI计算指南, IMO DCS数据, EPA AP-42排放因子
          </p>
          <p className="mb-0">
            <strong>免责声明:</strong> 本计算结果仅供参考，实际能效指标以船级社认证为准。
          </p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default EnergyDashboard;
