// src/components/azimuth/AzimuthThrusterSelector.js
// 全回转舵桨选型界面

import React, { useState, useCallback } from 'react';
import { toast } from '../../utils/toast';
import { Card, Row, Col, Form, Button, Table, Alert, Badge, Tabs, Tab, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { azimuthThrusters, slewingDrives, azimuthControlSystems } from '../../data/azimuthThrusterData';
import {
  selectAzimuthThruster,
  selectSlewingDrive,
  selectControlSystem,
  selectAzimuthSystem,
  calculateBollardPull,
  calculateRequiredThrust
} from '../../utils/azimuthSelectionAlgorithm';

const AzimuthThrusterSelector = ({ colors = {}, theme = 'light', onSystemSelect }) => {
  // 输入参数
  const [power, setPower] = useState('');
  const [thrust, setThrust] = useState('');
  const [propellerDiameter, setPropellerDiameter] = useState('');
  const [series, setSeries] = useState('');
  const [dpLevel, setDpLevel] = useState('Basic');
  const [application, setApplication] = useState('');

  // 船舶参数 (用于推力计算)
  const [vesselLength, setVesselLength] = useState('');
  const [windArea, setWindArea] = useState('');
  const [windSpeed, setWindSpeed] = useState('15');

  // 选型结果
  const [selectionResult, setSelectionResult] = useState(null);
  const [selectedThruster, setSelectedThruster] = useState(null);
  const [selectedSlewingDrive, setSelectedSlewingDrive] = useState(null);
  const [selectedControlSystem, setSelectedControlSystem] = useState(null);

  // 浏览模式
  const [browseTab, setBrowseTab] = useState('thruster');

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

  // 推力计算结果详情
  const [thrustCalcDetail, setThrustCalcDetail] = useState(null);

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

    setThrust(result.totalRequired);
    setThrustCalcDetail(result);
    toast.success(`计算完成: 所需推力 ${result.totalRequired} kN`);
  };

  // 执行选型
  const handleSelection = useCallback(() => {
    const requirements = {
      power: power ? parseFloat(power) : null,
      thrust: thrust ? parseFloat(thrust) : null,
      propellerDiameter: propellerDiameter ? parseFloat(propellerDiameter) : null,
      application: application || null
    };

    const options = {
      series: series || null
    };

    const result = selectAzimuthSystem({
      requirements,
      options,
      dpLevel
    });

    setSelectionResult(result);
    if (result.success) {
      setSelectedThruster(result.system.thruster);
      setSelectedSlewingDrive(result.system.slewingDrive);
      setSelectedControlSystem(result.system.controlSystem);
      if (onSystemSelect) {
        onSystemSelect(result.system);
      }
    }
  }, [power, thrust, propellerDiameter, series, application, dpLevel, onSystemSelect]);

  // 重置
  const handleReset = () => {
    setPower('');
    setThrust('');
    setPropellerDiameter('');
    setSeries('');
    setDpLevel('Basic');
    setApplication('');
    setVesselLength('');
    setWindArea('');
    setSelectionResult(null);
    setSelectedThruster(null);
    setSelectedSlewingDrive(null);
    setSelectedControlSystem(null);
  };

  // 格式化价格
  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(price);
  };

  // 渲染推进器卡片
  const renderThrusterCard = (thruster) => {
    if (!thruster) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-compass me-2"></i>
          全回转推进器: {thruster.model}
          <Badge bg={thruster.series === 'ZP' ? 'primary' : thruster.series === 'LP' ? 'info' : 'success'} className="ms-2">
            {thruster.series}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table size="sm" bordered>
                <tbody>
                  <tr><td>型号</td><td><strong>{thruster.model}</strong></td></tr>
                  <tr><td>类型</td><td>{thruster.type === 'z-drive' ? 'Z形传动' : thruster.type === 'l-drive' ? 'L形传动' : '电驱动吊舱'}</td></tr>
                  <tr><td>功率范围</td><td>{thruster.powerRange?.join(' - ')} kW</td></tr>
                  <tr><td>连续推力</td><td>{thruster.thrust?.continuous} kN</td></tr>
                  <tr><td>系泊推力</td><td><strong>{thruster.thrust?.bollard} kN</strong></td></tr>
                  <tr><td>螺旋桨直径</td><td>{thruster.propellerDiameter?.join(' - ')} m</td></tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table size="sm" bordered>
                <tbody>
                  <tr><td>回转角度</td><td>{thruster.rotationAngle}°</td></tr>
                  <tr><td>回转速度</td><td>{thruster.rotationSpeed} rpm</td></tr>
                  <tr><td>效率</td><td><Badge bg="success">{(thruster.efficiency * 100).toFixed(0)}%</Badge></td></tr>
                  <tr><td>重量</td><td>{thruster.weight} kg</td></tr>
                  <tr><td>浸没深度</td><td>{thruster.immersionDepth} mm</td></tr>
                  <tr><td>市场价</td><td className="text-danger">{formatPrice(thruster.marketPrice)}</td></tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          {thruster.applications && (
            <Alert variant="info" className="mb-0 mt-2">
              <small><strong>适用场景:</strong> {thruster.applications.join('、')}</small>
            </Alert>
          )}
        </Card.Body>
      </Card>
    );
  };

  // 渲染配套设备
  const renderAccessoriesCard = () => {
    if (!selectedSlewingDrive && !selectedControlSystem) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-tools me-2"></i>
          配套设备
        </Card.Header>
        <Card.Body>
          <Row>
            {selectedSlewingDrive && (
              <Col md={6}>
                <h6>回转驱动: {selectedSlewingDrive.model}</h6>
                <Table size="sm" bordered>
                  <tbody>
                    <tr><td>功率</td><td>{selectedSlewingDrive.power} kW</td></tr>
                    <tr><td>扭矩</td><td>{selectedSlewingDrive.torque} N.m</td></tr>
                    <tr><td>速度</td><td>{selectedSlewingDrive.speed} rpm</td></tr>
                    <tr><td>价格</td><td className="text-danger">{formatPrice(selectedSlewingDrive.marketPrice)}</td></tr>
                  </tbody>
                </Table>
              </Col>
            )}
            {selectedControlSystem && (
              <Col md={6}>
                <h6>控制系统: {selectedControlSystem.model}</h6>
                <Table size="sm" bordered>
                  <tbody>
                    <tr><td>等级</td><td><Badge bg="primary">{selectedControlSystem.model}</Badge></td></tr>
                    <tr><td>功能</td><td><small>{selectedControlSystem.features?.join('、')}</small></td></tr>
                    <tr><td>价格</td><td className="text-danger">{formatPrice(selectedControlSystem.marketPrice)}</td></tr>
                  </tbody>
                </Table>
              </Col>
            )}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="azimuth-thruster-selector">
      <Row>
        {/* 左侧：输入面板 */}
        <Col lg={4}>
          <Card style={cardStyle} className="mb-3">
            <Card.Header style={headerStyle}>
              <i className="bi bi-sliders me-2"></i>
              全回转选型参数
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>可用功率 (kW)</Form.Label>
                  <Form.Control
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    placeholder="例如: 500"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>所需推力 (kN)</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        value={thrust}
                        onChange={(e) => { setThrust(e.target.value); setThrustCalcDetail(null); }}
                        placeholder="例如: 80"
                      />
                    </Col>
                    <Col xs="auto">
                      <OverlayTrigger placement="top" overlay={<Tooltip>根据受风面积和设计风速计算风载推力需求</Tooltip>}>
                        <Button variant="outline-info" size="sm" onClick={handleCalculateThrust}>
                          <i className="bi bi-calculator me-1"></i>风载计算
                        </Button>
                      </OverlayTrigger>
                    </Col>
                  </Row>
                  {thrustCalcDetail && (
                    <Alert variant="light" className="mt-2 mb-0 py-1 px-2" style={{fontSize: '0.8em', border: '1px solid #dee2e6'}}>
                      <strong>计算公式:</strong> F = 0.5 × Cd × ρ × A × V²
                      <br />
                      <span className="text-muted">
                        Cd=1.2(风压系数) | ρ=1.225 kg/m³(空气密度) | A={windArea || '?'} m² | V={windSpeed} m/s
                      </span>
                      <br />
                      <strong>结果: {thrustCalcDetail.totalRequired} kN</strong> (含1.2安全系数)
                    </Alert>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>系列</Form.Label>
                  <Form.Select value={series} onChange={(e) => setSeries(e.target.value)}>
                    <option value="">全部系列</option>
                    <option value="ZP">ZP - Z形传动 (机械传动，高效率)</option>
                    <option value="LP">LP - L形传动 (紧凑布局，适合受限空间)</option>
                    <option value="EP">EP - 电驱吊舱 (电力推进，低噪声)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    DP等级
                    <OverlayTrigger placement="right" overlay={<Tooltip>DP(动力定位): Basic=常规操纵; DP1=单系统动力定位(IMO Class 1); DP2=冗余系统动力定位(IMO Class 2/3)</Tooltip>}>
                      <i className="bi bi-question-circle text-muted ms-1" style={{cursor: 'help'}}></i>
                    </OverlayTrigger>
                  </Form.Label>
                  <Form.Select value={dpLevel} onChange={(e) => setDpLevel(e.target.value)}>
                    <option value="Basic">基础型 - 常规操纵</option>
                    <option value="DP1">DP1 - 单系统定位</option>
                    <option value="DP2">DP2 - 冗余定位 (IMO Class 2/3)</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>应用场景</Form.Label>
                  <Form.Select value={application} onChange={(e) => setApplication(e.target.value)}>
                    <option value="">不限</option>
                    <option value="港作拖轮">港作拖轮</option>
                    <option value="工作船">工作船</option>
                    <option value="AHTS">AHTS (三用工作船)</option>
                    <option value="OSV">OSV/PSV (平台供应船)</option>
                    <option value="调查船">调查船/科考船</option>
                  </Form.Select>
                </Form.Group>

                <hr />
                <small className="text-muted">
                  <i className="bi bi-wind me-1"></i>推力计算辅助参数 (用于风载推力估算):
                </small>

                <Form.Group className="mb-2 mt-2">
                  <Form.Label><small>受风面积 (m²)</small></Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    value={windArea}
                    onChange={(e) => setWindArea(e.target.value)}
                    placeholder="拖轮80-200, OSV 300-800, 客船1000+"
                  />
                  <Form.Text className="text-muted" style={{fontSize: '0.75em'}}>
                    典型值: 拖轮 80~200 | 工作船 200~500 | AHTS 300~800
                  </Form.Text>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>
                    <small>设计风速 (m/s)</small>
                    <OverlayTrigger placement="right" overlay={<Tooltip>依据DNV-ST-0111: DP操作典型设计风速为15-25 m/s (约30-50节)。IMO MSC.1/Circ.1580推荐25.7 m/s作为极端工况。</Tooltip>}>
                      <i className="bi bi-question-circle text-muted ms-1" style={{cursor: 'help', fontSize: '0.8em'}}></i>
                    </OverlayTrigger>
                  </Form.Label>
                  <Form.Control
                    size="sm"
                    type="number"
                    value={windSpeed}
                    onChange={(e) => setWindSpeed(e.target.value)}
                    min={5} max={40}
                  />
                  <Form.Text className="text-muted" style={{fontSize: '0.75em'}}>
                    蒲氏5级≈10 | 6级≈13 | 7级≈17 | 8级≈21 | 9级≈25 m/s
                  </Form.Text>
                </Form.Group>

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
                  <Alert variant="warning" className="mb-0">
                    <strong>系统总价:</strong> {formatPrice(selectionResult.pricing.total)}
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* 右侧：结果展示 */}
        <Col lg={8}>
          <Tabs activeKey={browseTab} onSelect={(k) => setBrowseTab(k)} className="mb-3">
            <Tab eventKey="thruster" title={<><i className="bi bi-compass me-1"></i>推进器</>}>
              {selectedThruster ? (
                <>
                  {renderThrusterCard(selectedThruster)}
                  {renderAccessoriesCard()}
                </>
              ) : (
                <Card style={cardStyle}>
                  <Card.Body>
                    <h5>全回转推进器型号浏览</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>型号</th>
                          <th>系列</th>
                          <th>功率范围</th>
                          <th>系泊推力</th>
                          <th>效率</th>
                          <th>市场价</th>
                        </tr>
                      </thead>
                      <tbody>
                        {azimuthThrusters.map((t, idx) => (
                          <tr key={idx} style={{cursor: 'pointer'}} onClick={() => setSelectedThruster(t)}>
                            <td><strong>{t.model}</strong></td>
                            <td><Badge bg={t.series === 'ZP' ? 'primary' : t.series === 'LP' ? 'info' : 'success'}>{t.series}</Badge></td>
                            <td>{t.powerRange?.join('-')} kW</td>
                            <td>{t.thrust?.bollard} kN</td>
                            <td>{(t.efficiency * 100).toFixed(0)}%</td>
                            <td className="text-danger">{formatPrice(t.marketPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </Tab>

            <Tab eventKey="accessories" title={<><i className="bi bi-tools me-1"></i>配套设备</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h5>回转驱动单元</h5>
                      <Table striped bordered size="sm">
                        <thead><tr><th>型号</th><th>功率</th><th>扭矩</th><th>价格</th></tr></thead>
                        <tbody>
                          {slewingDrives.map((s, idx) => (
                            <tr key={idx}>
                              <td>{s.model}</td>
                              <td>{s.power} kW</td>
                              <td>{s.torque} N.m</td>
                              <td>{formatPrice(s.marketPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                    <Col md={6}>
                      <h5>控制系统</h5>
                      <Table striped bordered size="sm">
                        <thead><tr><th>型号</th><th>等级</th><th>价格</th></tr></thead>
                        <tbody>
                          {azimuthControlSystems.map((c, idx) => (
                            <tr key={idx}>
                              <td>{c.model}</td>
                              <td>{c.description}</td>
                              <td>{formatPrice(c.marketPrice)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default AzimuthThrusterSelector;
