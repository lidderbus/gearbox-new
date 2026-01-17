// src/components/HCCouplingVisualization.js
// HC高弹联轴器及主机配套图形化展示组件

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Table, Badge, ProgressBar, Form, Tab, Tabs, Alert, Button } from 'react-bootstrap';
import GearboxCouplingDetailModal from './GearboxCouplingDetailModal';
import {
  couplingSeriespecs,
  flywheelSpecs,
  gearboxToCouplingMap,
  couplingDetailedModels,
  getRecommendedCouplingForGearbox,
  getFlywheelOptionsForSeries,
  getCouplingTorqueChartData,
  getGearboxConfigStats
} from '../data/hcCouplingData';

/**
 * 联轴器扭矩条形图组件
 */
const TorqueBarChart = ({ data }) => {
  const maxTorque = Math.max(...data.map(d => d.maxTorque));

  return (
    <div className="torque-chart">
      {data.map((item, index) => {
        const torquePercent = (item.torque / maxTorque) * 100;
        const maxTorquePercent = (item.maxTorque / maxTorque) * 100;

        return (
          <div key={item.name} className="mb-3">
            <div className="d-flex justify-content-between align-items-center mb-1">
              <span className="fw-bold" style={{ fontSize: '14px' }}>{item.name}</span>
              <span className="text-muted" style={{ fontSize: '12px' }}>
                额定: {item.torque} kN·m | 最大: {item.maxTorque} kN·m
              </span>
            </div>
            <div style={{ position: 'relative', height: '24px', backgroundColor: '#e9ecef', borderRadius: '4px' }}>
              {/* 最大扭矩背景 */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${maxTorquePercent}%`,
                  backgroundColor: '#ffc107',
                  borderRadius: '4px',
                  opacity: 0.4
                }}
              />
              {/* 额定扭矩 */}
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: `${torquePercent}%`,
                  backgroundColor: getColorByIndex(index),
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }}
              />
              {/* 数值标签 */}
              <span
                style={{
                  position: 'absolute',
                  right: '8px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '11px',
                  fontWeight: 'bold',
                  color: '#333'
                }}
              >
                {item.maxSpeed} rpm | ¥{(item.price / 1000).toFixed(1)}k
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

const getColorByIndex = (index) => {
  const colors = [
    '#0d6efd', '#198754', '#dc3545', '#fd7e14', '#6f42c1',
    '#20c997', '#0dcaf0', '#6610f2', '#d63384', '#ffc107'
  ];
  return colors[index % colors.length];
};

/**
 * 齿轮箱-联轴器匹配关系图
 */
const GearboxMappingDiagram = ({ selectedGearbox, onSelectGearbox }) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedSeriesForDetail, setSelectedSeriesForDetail] = useState(null);

  const gearboxSeries = useMemo(() => {
    const series = {};
    Object.keys(gearboxToCouplingMap).forEach(model => {
      const match = model.match(/^(HC[DT]?)(\d+)/);
      if (match) {
        const prefix = match[1];
        const number = match[2];
        const key = `${prefix}${number}`;
        if (!series[key]) {
          series[key] = [];
        }
        series[key].push(model);
      }
    });
    return series;
  }, []);

  const handleShowDetail = (e, seriesKey, models) => {
    e.stopPropagation(); // 阻止卡片点击事件
    setSelectedSeriesForDetail({ key: seriesKey, models });
    setShowDetailModal(true);
  };

  return (
    <div className="mapping-diagram">
      <Row>
        {Object.entries(gearboxSeries).map(([seriesKey, models]) => {
          const firstModel = models[0];
          const mapping = gearboxToCouplingMap[firstModel];

          return (
            <Col md={4} lg={3} key={seriesKey} className="mb-3">
              <Card
                className={`h-100 ${selectedGearbox === firstModel ? 'border-primary' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={() => onSelectGearbox(firstModel)}
              >
                <Card.Header className="py-2" style={{ backgroundColor: getSeriesColor(seriesKey) }}>
                  <strong style={{ color: '#fff' }}>{seriesKey}系列</strong>
                </Card.Header>
                <Card.Body className="py-2">
                  <div style={{ fontSize: '12px' }}>
                    <div className="mb-1">
                      <strong>型号:</strong> {models.join(', ')}
                    </div>
                    <div className="mb-1">
                      <strong>标准:</strong>{' '}
                      <Badge bg="primary">{mapping?.standard || '-'}</Badge>
                    </div>
                    {mapping?.withCover && (
                      <div className="mb-1">
                        <strong>带罩:</strong>{' '}
                        <Badge bg="success">{mapping.withCover}</Badge>
                      </div>
                    )}
                    {mapping?.detachable && (
                      <div className="mb-1">
                        <strong>可拆:</strong>{' '}
                        <Badge bg="warning" text="dark">{mapping.detachable}</Badge>
                      </div>
                    )}
                  </div>
                  {/* 查看详细接口按钮 */}
                  <div className="mt-2 text-center">
                    <Button
                      size="sm"
                      variant="outline-info"
                      onClick={(e) => handleShowDetail(e, seriesKey, models)}
                    >
                      查看详细接口 →
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 详情模态框 */}
      {selectedSeriesForDetail && (
        <GearboxCouplingDetailModal
          show={showDetailModal}
          onHide={() => setShowDetailModal(false)}
          gearboxModels={selectedSeriesForDetail.models}
          seriesName={selectedSeriesForDetail.key}
        />
      )}
    </div>
  );
};

const getSeriesColor = (seriesKey) => {
  const number = parseInt(seriesKey.match(/\d+/)?.[0] || '0');
  if (number <= 1000) return '#0d6efd';
  if (number <= 1400) return '#198754';
  if (number <= 1600) return '#fd7e14';
  if (number <= 2000) return '#6f42c1';
  return '#dc3545';
};

/**
 * 联轴器详细信息面板
 */
const CouplingDetailPanel = ({ seriesName }) => {
  const series = couplingSeriespecs[seriesName];
  if (!series) return <Alert variant="info">请选择一个联轴器系列</Alert>;

  const flywheelOptions = getFlywheelOptionsForSeries(seriesName);

  // 获取该系列的所有详细型号
  const detailedModels = Object.entries(couplingDetailedModels)
    .filter(([_, data]) => data.series === seriesName)
    .map(([model, data]) => ({ model, ...data }));

  return (
    <Card>
      <Card.Header className="bg-primary text-white">
        <h5 className="mb-0">{series.fullName}</h5>
      </Card.Header>
      <Card.Body>
        {/* 技术参数 */}
        <Row className="mb-4">
          <Col md={6}>
            <h6 className="border-bottom pb-2 mb-3">技术参数</h6>
            <Table size="sm" bordered>
              <tbody>
                <tr>
                  <td className="bg-light" style={{ width: '40%' }}>额定扭矩</td>
                  <td><strong>{series.torque}</strong> kN·m</td>
                </tr>
                <tr>
                  <td className="bg-light">最大扭矩</td>
                  <td><strong>{series.maxTorque}</strong> kN·m</td>
                </tr>
                <tr>
                  <td className="bg-light">最高转速</td>
                  <td><strong>{series.maxSpeed}</strong> rpm</td>
                </tr>
                <tr>
                  <td className="bg-light">重量</td>
                  <td><strong>{series.weight}</strong> kg</td>
                </tr>
                <tr>
                  <td className="bg-light">基础价格</td>
                  <td><strong>¥{series.basePrice.toLocaleString()}</strong></td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={6}>
            <h6 className="border-bottom pb-2 mb-3">配置选项</h6>
            <div className="mb-2">
              <Badge bg={series.hasDetachable ? 'success' : 'secondary'} className="me-2">
                {series.hasDetachable ? '✓' : '✗'} 可拆式
              </Badge>
              <Badge bg={series.hasCover ? 'success' : 'secondary'}>
                {series.hasCover ? '✓' : '✗'} 带罩壳
              </Badge>
            </div>
            <div className="mt-3">
              <strong>适用齿轮箱:</strong>
              <div className="mt-1">
                {series.applicableGearboxes.map(gb => (
                  <Badge key={gb} bg="info" className="me-1 mb-1">{gb}</Badge>
                ))}
              </div>
            </div>
          </Col>
        </Row>

        {/* 飞轮配置 */}
        <Row className="mb-4">
          <Col>
            <h6 className="border-bottom pb-2 mb-3">飞轮配置选项</h6>
            <Row>
              <Col md={6}>
                <strong>SAE标准飞轮:</strong>
                <div className="mt-1">
                  {flywheelOptions.sae.length > 0 ? (
                    flywheelOptions.sae.map(fw => (
                      <Badge key={fw.name} bg="primary" className="me-1 mb-1">
                        {fw.name} (φ{fw.diameter}mm)
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">无</span>
                  )}
                </div>
              </Col>
              <Col md={6}>
                <strong>国内规格飞轮:</strong>
                <div className="mt-1">
                  {flywheelOptions.domestic.length > 0 ? (
                    flywheelOptions.domestic.map(fw => (
                      <Badge key={fw.name} bg="warning" text="dark" className="me-1 mb-1">
                        {fw.name}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-muted">无</span>
                  )}
                </div>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* 详细型号列表 */}
        {detailedModels.length > 0 && (
          <div>
            <h6 className="border-bottom pb-2 mb-3">详细型号列表 ({detailedModels.length}个)</h6>
            <Table size="sm" striped bordered hover responsive>
              <thead className="bg-light">
                <tr>
                  <th>型号</th>
                  <th>物料编码</th>
                  <th>规格说明</th>
                  <th>特性</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '12px' }}>
                {detailedModels.map(item => (
                  <tr key={item.model}>
                    <td><strong>{item.model}</strong></td>
                    <td>{item.partNumber}</td>
                    <td>{item.spec}</td>
                    <td>
                      {item.detachable && <Badge bg="warning" text="dark" className="me-1">可拆式</Badge>}
                      {item.hasCover && <Badge bg="success">带罩壳</Badge>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

/**
 * 统计概览面板
 */
const StatisticsPanel = () => {
  const stats = getGearboxConfigStats();
  const chartData = getCouplingTorqueChartData();

  return (
    <Row>
      <Col md={4}>
        <Card className="text-center mb-3">
          <Card.Body>
            <h3 className="text-primary">{stats.totalGearboxes}</h3>
            <small className="text-muted">支持齿轮箱型号</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="text-center mb-3">
          <Card.Body>
            <h3 className="text-success">{Object.keys(couplingSeriespecs).length}</h3>
            <small className="text-muted">联轴器系列</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={4}>
        <Card className="text-center mb-3">
          <Card.Body>
            <h3 className="text-warning">{Object.keys(couplingDetailedModels).length}</h3>
            <small className="text-muted">详细型号</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="mb-3">
          <Card.Header>配置类型分布</Card.Header>
          <Card.Body>
            <div className="mb-2">
              <div className="d-flex justify-content-between">
                <span>带罩壳配置</span>
                <span>{stats.withCoverCount}/{stats.totalGearboxes}</span>
              </div>
              <ProgressBar
                now={(stats.withCoverCount / stats.totalGearboxes) * 100}
                variant="success"
              />
            </div>
            <div>
              <div className="d-flex justify-content-between">
                <span>可拆式配置</span>
                <span>{stats.withDetachableCount}/{stats.totalGearboxes}</span>
              </div>
              <ProgressBar
                now={(stats.withDetachableCount / stats.totalGearboxes) * 100}
                variant="warning"
              />
            </div>
          </Card.Body>
        </Card>
      </Col>
      <Col md={6}>
        <Card className="mb-3">
          <Card.Header>联轴器系列使用统计</Card.Header>
          <Card.Body>
            {Object.entries(stats.byCouplingSeries)
              .sort((a, b) => b[1] - a[1])
              .slice(0, 5)
              .map(([series, count]) => (
                <div key={series} className="mb-2">
                  <div className="d-flex justify-content-between">
                    <span>{series}</span>
                    <Badge bg="primary">{count}个齿轮箱</Badge>
                  </div>
                </div>
              ))}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

/**
 * 主组件
 */
const HCCouplingVisualization = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGearbox, setSelectedGearbox] = useState('HCD800');
  const [selectedSeries, setSelectedSeries] = useState('HGTHT8.6');

  const chartData = useMemo(() => getCouplingTorqueChartData(), []);

  const recommendedConfig = useMemo(() => {
    return getRecommendedCouplingForGearbox(selectedGearbox);
  }, [selectedGearbox]);

  return (
    <div className="hc-coupling-visualization p-3">
      <Card className="mb-4">
        <Card.Header className="bg-dark text-white">
          <h4 className="mb-0">
            HC高弹联轴器及主机配套系统
            <small className="ms-2 text-light" style={{ fontSize: '14px' }}>
              基于2021-04-26大功率汇总数据
            </small>
          </h4>
        </Card.Header>
        <Card.Body>
          <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
            <Tab eventKey="overview" title="概览统计">
              <StatisticsPanel />
              <Card className="mt-3">
                <Card.Header>联轴器扭矩对比图</Card.Header>
                <Card.Body>
                  <TorqueBarChart data={chartData} />
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="mapping" title="齿轮箱匹配">
              <Row>
                <Col md={12}>
                  <Alert variant="info" className="mb-3">
                    点击齿轮箱卡片查看详细配置信息
                  </Alert>
                  <GearboxMappingDiagram
                    selectedGearbox={selectedGearbox}
                    onSelectGearbox={setSelectedGearbox}
                  />
                </Col>
              </Row>
              {recommendedConfig && (
                <Row className="mt-4">
                  <Col>
                    <Card>
                      <Card.Header className="bg-success text-white">
                        <strong>{selectedGearbox}</strong> 推荐配置
                      </Card.Header>
                      <Card.Body>
                        <Row>
                          <Col md={4}>
                            <h6>标准配置</h6>
                            <Badge bg="primary" className="fs-6">
                              {recommendedConfig.allOptions.standard || '-'}
                            </Badge>
                          </Col>
                          <Col md={4}>
                            <h6>带罩壳配置</h6>
                            <Badge bg="success" className="fs-6">
                              {recommendedConfig.allOptions.withCover || '-'}
                            </Badge>
                          </Col>
                          <Col md={4}>
                            <h6>可拆式配置</h6>
                            <Badge bg="warning" text="dark" className="fs-6">
                              {recommendedConfig.allOptions.detachable || '-'}
                            </Badge>
                          </Col>
                        </Row>
                        {recommendedConfig.configRules.length > 0 && (
                          <div className="mt-3">
                            <h6>配置规则:</h6>
                            <ul className="mb-0" style={{ fontSize: '13px' }}>
                              {recommendedConfig.configRules.map((rule, idx) => (
                                <li key={idx}>{rule}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Tab>

            <Tab eventKey="series" title="联轴器系列">
              <Row>
                <Col md={3}>
                  <Card className="mb-3">
                    <Card.Header>选择系列</Card.Header>
                    <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
                      {Object.keys(couplingSeriespecs).map(name => (
                        <div
                          key={name}
                          className={`p-2 mb-1 rounded ${selectedSeries === name ? 'bg-primary text-white' : 'bg-light'}`}
                          style={{ cursor: 'pointer' }}
                          onClick={() => setSelectedSeries(name)}
                        >
                          <strong>{name}</strong>
                          <br />
                          <small>{couplingSeriespecs[name].torque} kN·m</small>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={9}>
                  <CouplingDetailPanel seriesName={selectedSeries} />
                </Col>
              </Row>
            </Tab>

            <Tab eventKey="flywheel" title="飞轮规格">
              <Row>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-primary text-white">SAE国际标准飞轮</Card.Header>
                    <Card.Body>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>规格</th>
                            <th>直径(mm)</th>
                            <th>螺栓数</th>
                            <th>螺栓圆(mm)</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(flywheelSpecs.sae).map(([name, spec]) => (
                            <tr key={name}>
                              <td><strong>{name}</strong></td>
                              <td>{spec.diameter}</td>
                              <td>{spec.boltCount}</td>
                              <td>{spec.boltCircle}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="mb-3">
                    <Card.Header className="bg-warning">国内规格飞轮</Card.Header>
                    <Card.Body>
                      <Table striped bordered hover size="sm">
                        <thead>
                          <tr>
                            <th>规格</th>
                            <th>直径(mm)</th>
                            <th>说明</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(flywheelSpecs.domestic).map(([name, spec]) => (
                            <tr key={name}>
                              <td><strong>{name}</strong></td>
                              <td>{spec.diameter}</td>
                              <td>{spec.description}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Tab>
          </Tabs>
        </Card.Body>
      </Card>
    </div>
  );
};

export default HCCouplingVisualization;
