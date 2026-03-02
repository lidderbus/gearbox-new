// src/components/thruster/ThrusterSelector.js
// 侧推器选型界面

import React, { useState, useCallback } from 'react';
import { toast } from '../../utils/toast';
import { Card, Row, Col, Form, Button, Table, Alert, Badge, Tabs, Tab } from 'react-bootstrap';
import {
  electricThrusters,
  hydraulicThrusters,
  controllablePitchThrusters,
  retractableThrusters,
  thrusterControlSystems
} from '../../data/thrusterData';
import {
  selectThruster,
  selectThrusterSystem,
  calculateRequiredThrust,
  estimateThrustFromPower
} from '../../utils/thrusterSelectionAlgorithm';

const ThrusterSelector = ({ colors = {}, theme = 'light', onSystemSelect }) => {
  // 输入参数
  const [thrust, setThrust] = useState('');
  const [power, setPower] = useState('');
  const [tunnelDiameter, setTunnelDiameter] = useState('');
  const [position, setPosition] = useState('');
  const [voltage, setVoltage] = useState('');
  const [thrusterType, setThrusterType] = useState('');
  const [count, setCount] = useState('1');

  // 船舶参数 (用于推力计算)
  const [vesselLength, setVesselLength] = useState('');
  const [windArea, setWindArea] = useState('');
  const [windSpeed, setWindSpeed] = useState('15');

  // 选型结果
  const [selectionResult, setSelectionResult] = useState(null);
  const [selectedThruster, setSelectedThruster] = useState(null);
  const [selectedControlSystem, setSelectedControlSystem] = useState(null);

  // 浏览模式
  const [browseTab, setBrowseTab] = useState('electric');

  // 样式
  const cardStyle = {
    backgroundColor: colors.cardBg || '#fff',
    borderColor: colors.border || '#dee2e6'
  };

  const headerStyle = {
    backgroundColor: colors.headerBg || '#f8f9fa',
    color: colors.headerText || '#212529',
    borderBottom: `1px solid ${colors.border || '#dee2e6'}`
  };

  // 推力计算结果
  const [thrustCalcResult, setThrustCalcResult] = useState(null);

  // 计算推力需求
  const handleCalculateThrust = () => {
    if (!windArea && !vesselLength) {
      toast.warning('请输入受风面积或船长');
      return;
    }

    const result = calculateRequiredThrust({
      length: parseFloat(vesselLength) || 0,
      windArea: parseFloat(windArea) || 0,
      windSpeed: parseFloat(windSpeed) || 15
    });

    setThrust(result.thrustPerThruster);
    setThrustCalcResult(result);
  };

  // 根据功率估算推力
  const handleEstimateThrust = () => {
    if (!power) {
      toast.warning('请先输入功率');
      return;
    }
    const estimated = estimateThrustFromPower(parseFloat(power), thrusterType || 'fixed-pitch-electric');
    setThrust(estimated.toFixed(1));
    setThrustCalcResult({ method: 'power', power: parseFloat(power), estimated: estimated.toFixed(1) });
  };

  // 执行选型
  const handleSelection = useCallback(() => {
    const requirements = {
      thrust: thrust ? parseFloat(thrust) : null,
      power: power ? parseFloat(power) : null,
      tunnelDiameter: tunnelDiameter ? parseFloat(tunnelDiameter) : null,
      position: position || null,
      voltage: voltage ? parseInt(voltage) : null
    };

    const options = {
      type: thrusterType || null
    };

    const result = selectThrusterSystem({
      requirements,
      options,
      count: parseInt(count) || 1
    });

    setSelectionResult(result);
    if (result.success) {
      setSelectedThruster(result.system.thruster);
      setSelectedControlSystem(result.system.controlSystem);
      if (onSystemSelect) {
        onSystemSelect(result.system);
      }
    }
  }, [thrust, power, tunnelDiameter, position, voltage, thrusterType, count, onSystemSelect]);

  // 重置
  const handleReset = () => {
    setThrust('');
    setPower('');
    setTunnelDiameter('');
    setPosition('');
    setVoltage('');
    setThrusterType('');
    setCount('1');
    setVesselLength('');
    setWindArea('');
    setSelectionResult(null);
    setSelectedThruster(null);
    setSelectedControlSystem(null);
  };

  // 格式化价格
  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(price);
  };

  // 获取类型名称
  const getTypeName = (type) => {
    const typeNames = {
      'electric': '电动定距',
      'hydraulic': '液压',
      'controllable-pitch': '调距',
      'retractable': '可收放'
    };
    return typeNames[type] || type;
  };

  // 获取类型徽章颜色
  const getTypeBadge = (type) => {
    const colors = {
      'electric': 'primary',
      'hydraulic': 'warning',
      'controllable-pitch': 'info',
      'retractable': 'success'
    };
    return colors[type] || 'secondary';
  };

  // 渲染推进器卡片
  const renderThrusterCard = (thruster) => {
    if (!thruster) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-arrows-expand me-2"></i>
          侧推器: {thruster.model}
          <Badge bg={getTypeBadge(thruster.category)} className="ms-2">
            {getTypeName(thruster.category)}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table size="sm" bordered>
                <tbody>
                  <tr><td>型号</td><td><strong>{thruster.model}</strong></td></tr>
                  <tr><td>系列</td><td>{thruster.series}</td></tr>
                  <tr><td>推力</td><td><strong>{thruster.thrust} kN</strong></td></tr>
                  <tr><td>电机功率</td><td>{thruster.motorPower} kW</td></tr>
                  <tr><td>螺旋桨直径</td><td>{thruster.propellerDiameter} mm</td></tr>
                  <tr><td>筒体内径</td><td>{thruster.tunnelInnerDiameter || thruster.tunnelDiameter} mm</td></tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table size="sm" bordered>
                <tbody>
                  <tr><td>电机电压</td><td>{thruster.motorVoltage?.join('/') || '-'} V</td></tr>
                  <tr><td>电机转速</td><td>{thruster.motorSpeed || '-'} rpm</td></tr>
                  <tr><td>桨叶数</td><td>{thruster.bladeCount || 4}</td></tr>
                  <tr><td>安装位置</td><td>{thruster.installPosition?.join('/') || '艏/艉'}</td></tr>
                  <tr><td>重量</td><td>{thruster.weight || '-'} kg</td></tr>
                  <tr><td>市场价</td><td className="text-danger">{formatPrice(thruster.marketPrice)}</td></tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          {thruster.features && (
            <Alert variant="info" className="mb-0 mt-2">
              <small><strong>特点:</strong> {thruster.features.join('、')}</small>
            </Alert>
          )}
        </Card.Body>
      </Card>
    );
  };

  // 渲染控制系统卡片
  const renderControlSystemCard = () => {
    if (!selectedControlSystem) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-toggles me-2"></i>
          控制系统
        </Card.Header>
        <Card.Body>
          <Table size="sm" bordered>
            <tbody>
              <tr><td>型号</td><td><strong>{selectedControlSystem.model}</strong></td></tr>
              <tr><td>类型</td><td>{selectedControlSystem.type === 'single' ? '单台控制' : '双台/多台控制'}</td></tr>
              <tr><td>功能</td><td><small>{selectedControlSystem.features?.join('、')}</small></td></tr>
              <tr><td>价格</td><td className="text-danger">{formatPrice(selectedControlSystem.marketPrice)}</td></tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  // 渲染推进器列表
  const renderThrusterList = (thrusters, category) => {
    if (!thrusters || thrusters.length === 0) {
      return <Alert variant="info">暂无数据</Alert>;
    }
    return (
      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>型号</th>
            <th>推力(kN)</th>
            <th>功率(kW)</th>
            <th>桨径(mm)</th>
            <th>筒径(mm)</th>
            <th>市场价</th>
          </tr>
        </thead>
        <tbody>
          {thrusters.map((t, idx) => (
            <tr
              key={idx}
              style={{cursor: 'pointer'}}
              onClick={() => setSelectedThruster({...t, category})}
            >
              <td><strong>{t.model}</strong></td>
              <td>{t.thrust}</td>
              <td>{t.motorPower}</td>
              <td>{t.propellerDiameter}</td>
              <td>{t.tunnelInnerDiameter || t.tunnelDiameter}</td>
              <td className="text-danger">{formatPrice(t.marketPrice)}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div className="thruster-selector">
      <Row>
        {/* 左侧：输入面板 */}
        <Col lg={4}>
          <Card style={cardStyle} className="mb-3">
            <Card.Header style={headerStyle}>
              <i className="bi bi-sliders me-2"></i>
              侧推器选型参数
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>所需推力 (kN)</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        value={thrust}
                        onChange={(e) => setThrust(e.target.value)}
                        placeholder="例如: 50"
                      />
                    </Col>
                    <Col xs="auto">
                      <Button variant="outline-secondary" size="sm" onClick={handleCalculateThrust}>
                        风载计算
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>电机功率 (kW)</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        value={power}
                        onChange={(e) => setPower(e.target.value)}
                        placeholder="例如: 315"
                      />
                    </Col>
                    <Col xs="auto">
                      <Button variant="outline-secondary" size="sm" onClick={handleEstimateThrust}>
                        功率估算
                      </Button>
                    </Col>
                  </Row>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>侧推类型</Form.Label>
                  <Form.Select value={thrusterType} onChange={(e) => setThrusterType(e.target.value)}>
                    <option value="">全部类型</option>
                    <option value="electric">电动定距桨</option>
                    <option value="hydraulic">液压驱动</option>
                    <option value="controllable-pitch">调距桨</option>
                    <option value="retractable">可收放式</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>安装位置</Form.Label>
                  <Form.Select value={position} onChange={(e) => setPosition(e.target.value)}>
                    <option value="">不限</option>
                    <option value="bow">艏部</option>
                    <option value="stern">艉部</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>电压 (V)</Form.Label>
                  <Form.Select value={voltage} onChange={(e) => setVoltage(e.target.value)}>
                    <option value="">不限</option>
                    <option value="380">380V</option>
                    <option value="440">440V</option>
                    <option value="690">690V</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>筒体直径限制 (mm)</Form.Label>
                  <Form.Control
                    type="number"
                    value={tunnelDiameter}
                    onChange={(e) => setTunnelDiameter(e.target.value)}
                    placeholder="最大允许筒径"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>数量</Form.Label>
                  <Form.Select value={count} onChange={(e) => setCount(e.target.value)}>
                    <option value="1">1台</option>
                    <option value="2">2台</option>
                    <option value="3">3台</option>
                  </Form.Select>
                </Form.Group>

                <hr />
                <small className="text-muted">推力计算辅助参数:</small>

                <Form.Group className="mb-2">
                  <Form.Label><small>船长 (m)</small></Form.Label>
                  <Form.Control size="sm" type="number" value={vesselLength} onChange={(e) => setVesselLength(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label><small>受风面积 (m²)</small></Form.Label>
                  <Form.Control size="sm" type="number" value={windArea} onChange={(e) => setWindArea(e.target.value)} placeholder="拖轮80-200, 工作船200-500" />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><small>设计风速 (m/s) <Badge bg="secondary" className="ms-1">6级风=13m/s</Badge></small></Form.Label>
                  <Form.Control size="sm" type="number" value={windSpeed} onChange={(e) => setWindSpeed(e.target.value)} />
                </Form.Group>

                {thrustCalcResult && (
                  <Alert variant="info" className="py-2 mb-3">
                    <small>
                      {thrustCalcResult.method === 'power' ? (
                        <><strong>功率估算:</strong> {thrustCalcResult.power}kW × 0.145 ≈ {thrustCalcResult.estimated} kN</>
                      ) : (
                        <>
                          <strong>风载推力:</strong> F = 0.5×Cd×ρ×A×V²<br/>
                          风力 {thrustCalcResult.windForce?.toFixed?.(1) || '-'} kN,
                          安全系数1.3 → 需 {thrustCalcResult.totalRequired?.toFixed?.(1) || '-'} kN
                          {thrustCalcResult.recommendedCount > 1 && <><br/>建议 {thrustCalcResult.recommendedCount} 台, 每台 {thrustCalcResult.thrustPerThruster?.toFixed?.(1) || '-'} kN</>}
                        </>
                      )}
                    </small>
                  </Alert>
                )}

                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={handleSelection}>
                    <i className="bi bi-search me-2"></i>开始选型
                  </Button>
                  <Button variant="outline-secondary" onClick={handleReset}>
                    <i className="bi bi-arrow-counterclockwise me-2"></i>重置
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>

          {/* 选型结果摘要 */}
          {selectionResult && (
            <Card style={cardStyle}>
              <Card.Header style={{...headerStyle, backgroundColor: selectionResult.success ? '#d4edda' : '#f8d7da'}}>
                {selectionResult.success ? (
                  <><i className="bi bi-check-circle-fill me-2 text-success"></i>选型成功</>
                ) : (
                  <><i className="bi bi-x-circle-fill me-2 text-danger"></i>选型失败</>
                )}
              </Card.Header>
              <Card.Body>
                <p className="mb-2">{selectionResult.message}</p>
                {selectionResult.success && selectionResult.pricing && (
                  <>
                    <Table size="sm" className="mb-2">
                      <tbody>
                        <tr><td>单台价格</td><td>{formatPrice(selectionResult.pricing.thrusterUnit)}</td></tr>
                        <tr><td>侧推器({count}台)</td><td>{formatPrice(selectionResult.pricing.thrusterTotal)}</td></tr>
                        <tr><td>控制系统</td><td>{formatPrice(selectionResult.pricing.controlSystem)}</td></tr>
                      </tbody>
                    </Table>
                    <Alert variant="warning" className="mb-0">
                      <strong>系统总价:</strong> {formatPrice(selectionResult.pricing.total)}
                    </Alert>
                  </>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* 右侧：结果展示 */}
        <Col lg={8}>
          <Tabs activeKey={browseTab} onSelect={(k) => setBrowseTab(k)} className="mb-3">
            <Tab eventKey="electric" title={<><i className="bi bi-lightning me-1"></i>电动</>}>
              {selectedThruster && selectedThruster.category === 'electric' ? (
                <>
                  {renderThrusterCard(selectedThruster)}
                  {renderControlSystemCard()}
                </>
              ) : (
                <Card style={cardStyle}>
                  <Card.Body>
                    <h5>电动定距侧推器</h5>
                    {renderThrusterList(electricThrusters, 'electric')}
                  </Card.Body>
                </Card>
              )}
            </Tab>

            <Tab eventKey="hydraulic" title={<><i className="bi bi-droplet me-1"></i>液压</>}>
              {selectedThruster && selectedThruster.category === 'hydraulic' ? (
                <>
                  {renderThrusterCard(selectedThruster)}
                  {renderControlSystemCard()}
                </>
              ) : (
                <Card style={cardStyle}>
                  <Card.Body>
                    <h5>液压驱动侧推器</h5>
                    {renderThrusterList(hydraulicThrusters, 'hydraulic')}
                  </Card.Body>
                </Card>
              )}
            </Tab>

            <Tab eventKey="cpp" title={<><i className="bi bi-gear me-1"></i>调距</>}>
              {selectedThruster && selectedThruster.category === 'controllable-pitch' ? (
                <>
                  {renderThrusterCard(selectedThruster)}
                  {renderControlSystemCard()}
                </>
              ) : (
                <Card style={cardStyle}>
                  <Card.Body>
                    <h5>调距桨侧推器</h5>
                    {renderThrusterList(controllablePitchThrusters, 'controllable-pitch')}
                  </Card.Body>
                </Card>
              )}
            </Tab>

            <Tab eventKey="retractable" title={<><i className="bi bi-box-arrow-down me-1"></i>可收放</>}>
              {selectedThruster && selectedThruster.category === 'retractable' ? (
                <>
                  {renderThrusterCard(selectedThruster)}
                  {renderControlSystemCard()}
                </>
              ) : (
                <Card style={cardStyle}>
                  <Card.Body>
                    <h5>可收放侧推器</h5>
                    {renderThrusterList(retractableThrusters, 'retractable')}
                  </Card.Body>
                </Card>
              )}
            </Tab>

            <Tab eventKey="control" title={<><i className="bi bi-toggles me-1"></i>控制系统</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  <h5>侧推器控制系统</h5>
                  <Table striped bordered size="sm">
                    <thead>
                      <tr>
                        <th>型号</th>
                        <th>类型</th>
                        <th>适用型号</th>
                        <th>功能</th>
                        <th>价格</th>
                      </tr>
                    </thead>
                    <tbody>
                      {thrusterControlSystems.map((cs, idx) => (
                        <tr key={idx}>
                          <td><strong>{cs.model}</strong></td>
                          <td>{cs.type === 'single' ? '单台' : '多台'}</td>
                          <td><small>{cs.applicableModels?.join(', ')}</small></td>
                          <td><small>{cs.features?.join(', ')}</small></td>
                          <td className="text-danger">{formatPrice(cs.marketPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default ThrusterSelector;
