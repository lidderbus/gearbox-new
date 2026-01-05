// src/components/cpp/CPPSelectionView.js
// CPP可调桨系统选型主界面

import React, { useState, useCallback, useMemo } from 'react';
import { Card, Row, Col, Form, Button, Table, Alert, Badge, Tabs, Tab, InputGroup } from 'react-bootstrap';
import { cppGearboxes, cppPropellers, oilDistributors, cppHydraulicUnits } from '../../data/cppSystemData';
import {
  selectCPPGearbox,
  selectCPPPropeller,
  selectOilDistributor,
  selectHydraulicUnit,
  selectCPPSystem
} from '../../utils/cppSelectionAlgorithm';

const CPPSelectionView = ({ colors = {}, theme = 'light', onSystemSelect }) => {
  // 输入参数
  const [power, setPower] = useState('');
  const [speed, setSpeed] = useState('');
  const [targetRatio, setTargetRatio] = useState('');
  const [series, setSeries] = useState('');
  const [propellerDiameter, setPropellerDiameter] = useState('');

  // 选型结果
  const [selectionResult, setSelectionResult] = useState(null);
  const [selectedGearbox, setSelectedGearbox] = useState(null);
  const [selectedPropeller, setSelectedPropeller] = useState(null);
  const [selectedOilDistributor, setSelectedOilDistributor] = useState(null);
  const [selectedHydraulicUnit, setSelectedHydraulicUnit] = useState(null);

  // 浏览模式
  const [browseTab, setBrowseTab] = useState('gearbox');

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

  // 执行选型
  const handleSelection = useCallback(() => {
    const powerVal = parseFloat(power);
    const speedVal = parseFloat(speed);
    const ratioVal = parseFloat(targetRatio);

    if (isNaN(powerVal) || powerVal <= 0) {
      setSelectionResult({ success: false, message: '请输入有效的功率' });
      return;
    }
    if (isNaN(speedVal) || speedVal <= 0) {
      setSelectionResult({ success: false, message: '请输入有效的转速' });
      return;
    }
    if (isNaN(ratioVal) || ratioVal <= 0) {
      setSelectionResult({ success: false, message: '请输入有效的减速比' });
      return;
    }

    const result = selectCPPSystem({
      power: powerVal,
      speed: speedVal,
      targetRatio: ratioVal,
      vesselData: {
        propellerDiameter: propellerDiameter ? parseFloat(propellerDiameter) : null
      },
      options: {
        series: series || null
      }
    });

    setSelectionResult(result);
    if (result.success) {
      setSelectedGearbox(result.system.gearbox);
      setSelectedPropeller(result.system.propeller);
      setSelectedOilDistributor(result.system.oilDistributor);
      setSelectedHydraulicUnit(result.system.hydraulicUnit);
      if (onSystemSelect) {
        onSystemSelect(result.system);
      }
    }
  }, [power, speed, targetRatio, series, propellerDiameter, onSystemSelect]);

  // 重置
  const handleReset = () => {
    setPower('');
    setSpeed('');
    setTargetRatio('');
    setSeries('');
    setPropellerDiameter('');
    setSelectionResult(null);
    setSelectedGearbox(null);
    setSelectedPropeller(null);
    setSelectedOilDistributor(null);
    setSelectedHydraulicUnit(null);
  };

  // 格式化价格
  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(price);
  };

  // 渲染齿轮箱结果卡片
  const renderGearboxCard = (gearbox, matchInfo = null) => {
    if (!gearbox) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-gear-fill me-2"></i>
          CPP齿轮箱: {gearbox.model}
          <Badge bg="info" className="ms-2">{gearbox.series}</Badge>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <Table size="sm" bordered>
                <tbody>
                  <tr><td>型号</td><td><strong>{gearbox.model}</strong></td></tr>
                  <tr><td>系列</td><td>{gearbox.series} - {gearbox.type}</td></tr>
                  <tr><td>输入转速范围</td><td>{gearbox.inputSpeedRange?.join(' - ')} rpm</td></tr>
                  <tr><td>最大功率</td><td>{gearbox.maxPower} kW</td></tr>
                  <tr><td>选定减速比</td><td><strong>{gearbox.selectedRatio}</strong></td></tr>
                  <tr><td>传递能力</td><td>{gearbox.selectedCapacity} kW/(r/min)</td></tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table size="sm" bordered>
                <tbody>
                  <tr><td>推力</td><td>{gearbox.thrust} kN</td></tr>
                  <tr><td>重量</td><td>{gearbox.weight} kg</td></tr>
                  <tr><td>油量</td><td>{gearbox.oilCapacity} L</td></tr>
                  <tr><td>尺寸</td><td>{gearbox.dimensions}</td></tr>
                  <tr><td>市场价</td><td className="text-danger">{formatPrice(gearbox.marketPrice)}</td></tr>
                  {matchInfo && (
                    <tr><td>余量</td><td><Badge bg="success">{matchInfo.margin}%</Badge></td></tr>
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
          {gearbox.notes && <Alert variant="info" className="mb-0 mt-2"><small>{gearbox.notes}</small></Alert>}
        </Card.Body>
      </Card>
    );
  };

  // 渲染调距桨卡片
  const renderPropellerCard = (propeller) => {
    if (!propeller) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-fan me-2"></i>
          调距桨: {propeller.model}
          <Badge bg="warning" text="dark" className="ms-2">{propeller.series}</Badge>
        </Card.Header>
        <Card.Body>
          <Table size="sm" bordered>
            <tbody>
              <tr><td>型号</td><td><strong>{propeller.model}</strong></td></tr>
              <tr><td>类型</td><td>{propeller.type === 'heavy-duty' ? '重载型' : propeller.type === 'high-speed' ? '高速型' : '通用型'}</td></tr>
              <tr><td>直径范围</td><td>{propeller.diameterRange?.join(' - ')} m</td></tr>
              <tr><td>叶片数</td><td>{propeller.bladeCount?.join(' / ')}</td></tr>
              <tr><td>最大功率</td><td>{propeller.maxPower} kW</td></tr>
              <tr><td>桨距范围</td><td>{propeller.pitchRange?.join(' ~ ')}°</td></tr>
              <tr><td>叶片材料</td><td>{propeller.bladeMaterial}</td></tr>
              <tr><td>市场价</td><td className="text-danger">{formatPrice(propeller.marketPrice)}</td></tr>
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  // 渲染配油器和液压单元
  const renderAccessoriesCard = () => {
    if (!selectedOilDistributor && !selectedHydraulicUnit) return null;
    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-droplet-fill me-2"></i>
          配套设备
        </Card.Header>
        <Card.Body>
          <Row>
            {selectedOilDistributor && (
              <Col md={6}>
                <h6>配油器: {selectedOilDistributor.model}</h6>
                <Table size="sm" bordered>
                  <tbody>
                    <tr><td>最大压力</td><td>{selectedOilDistributor.maxPressure} MPa</td></tr>
                    <tr><td>流量</td><td>{selectedOilDistributor.flowRate} L/min</td></tr>
                    <tr><td>价格</td><td className="text-danger">{formatPrice(selectedOilDistributor.marketPrice)}</td></tr>
                  </tbody>
                </Table>
              </Col>
            )}
            {selectedHydraulicUnit && (
              <Col md={6}>
                <h6>液压站: {selectedHydraulicUnit.model}</h6>
                <Table size="sm" bordered>
                  <tbody>
                    <tr><td>功率</td><td>{selectedHydraulicUnit.power} kW</td></tr>
                    <tr><td>压力</td><td>{selectedHydraulicUnit.pressure} MPa</td></tr>
                    <tr><td>油箱</td><td>{selectedHydraulicUnit.tankCapacity} L</td></tr>
                    <tr><td>价格</td><td className="text-danger">{formatPrice(selectedHydraulicUnit.marketPrice)}</td></tr>
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
    <div className="cpp-selection-view">
      <Row>
        {/* 左侧：输入面板 */}
        <Col lg={4}>
          <Card style={cardStyle} className="mb-3">
            <Card.Header style={headerStyle}>
              <i className="bi bi-sliders me-2"></i>
              CPP系统选型参数
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>发动机功率 (kW) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    placeholder="例如: 800"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>发动机转速 (rpm) <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="例如: 1500"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>目标减速比 <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={targetRatio}
                    onChange={(e) => setTargetRatio(e.target.value)}
                    placeholder="例如: 3.5"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>齿轮箱系列 (可选)</Form.Label>
                  <Form.Select value={series} onChange={(e) => setSeries(e.target.value)}>
                    <option value="">全部系列</option>
                    <option value="GCS">GCS - 单级减速</option>
                    <option value="GCST">GCST - 单级带PTO</option>
                    <option value="GCD">GCD - 双级减速</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>螺旋桨直径 (m, 可选)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.1"
                    value={propellerDiameter}
                    onChange={(e) => setPropellerDiameter(e.target.value)}
                    placeholder="例如: 2.5"
                  />
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button variant="primary" onClick={handleSelection}>
                    <i className="bi bi-search me-2"></i>
                    开始选型
                  </Button>
                  <Button variant="outline-secondary" onClick={handleReset}>
                    <i className="bi bi-arrow-counterclockwise me-2"></i>
                    重置
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
                    <br />
                    <small>
                      齿轮箱: {formatPrice(selectionResult.pricing.gearbox)} |
                      调距桨: {formatPrice(selectionResult.pricing.propeller)} |
                      配件: {formatPrice(selectionResult.pricing.oilDistributor + selectionResult.pricing.hydraulicUnit)}
                    </small>
                  </Alert>
                )}
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* 右侧：结果展示 */}
        <Col lg={8}>
          <Tabs activeKey={browseTab} onSelect={(k) => setBrowseTab(k)} className="mb-3">
            <Tab eventKey="gearbox" title={<><i className="bi bi-gear me-1"></i>齿轮箱</>}>
              {selectedGearbox ? (
                renderGearboxCard(selectedGearbox, selectionResult?.recommendations?.[0]?.matchInfo)
              ) : (
                <Card style={cardStyle}>
                  <Card.Body>
                    <h5>CPP齿轮箱型号浏览</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>型号</th>
                          <th>系列</th>
                          <th>最大功率</th>
                          <th>减速比</th>
                          <th>推力</th>
                          <th>市场价</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cppGearboxes.map((g, idx) => (
                          <tr key={idx} style={{cursor: 'pointer'}} onClick={() => setSelectedGearbox(g)}>
                            <td><strong>{g.model}</strong></td>
                            <td><Badge bg="info">{g.series}</Badge></td>
                            <td>{g.maxPower} kW</td>
                            <td>{g.ratios?.join(', ')}</td>
                            <td>{g.thrust} kN</td>
                            <td className="text-danger">{formatPrice(g.marketPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </Tab>

            <Tab eventKey="propeller" title={<><i className="bi bi-fan me-1"></i>调距桨</>}>
              {selectedPropeller ? (
                renderPropellerCard(selectedPropeller)
              ) : (
                <Card style={cardStyle}>
                  <Card.Body>
                    <h5>调距桨型号浏览</h5>
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          <th>型号</th>
                          <th>系列</th>
                          <th>类型</th>
                          <th>直径范围</th>
                          <th>最大功率</th>
                          <th>市场价</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cppPropellers.map((p, idx) => (
                          <tr key={idx} style={{cursor: 'pointer'}} onClick={() => setSelectedPropeller(p)}>
                            <td><strong>{p.model}</strong></td>
                            <td><Badge bg="warning" text="dark">{p.series}</Badge></td>
                            <td>{p.type}</td>
                            <td>{p.diameterRange?.join(' - ')} m</td>
                            <td>{p.maxPower} kW</td>
                            <td className="text-danger">{formatPrice(p.marketPrice)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Card.Body>
                </Card>
              )}
            </Tab>

            <Tab eventKey="accessories" title={<><i className="bi bi-box me-1"></i>配套设备</>}>
              {renderAccessoriesCard() || (
                <Card style={cardStyle}>
                  <Card.Body>
                    <Row>
                      <Col md={6}>
                        <h5>配油器</h5>
                        <Table striped bordered size="sm">
                          <thead>
                            <tr><th>型号</th><th>压力</th><th>流量</th><th>价格</th></tr>
                          </thead>
                          <tbody>
                            {oilDistributors.map((o, idx) => (
                              <tr key={idx}>
                                <td>{o.model}</td>
                                <td>{o.maxPressure} MPa</td>
                                <td>{o.flowRate} L/min</td>
                                <td>{formatPrice(o.marketPrice)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                      <Col md={6}>
                        <h5>液压单元</h5>
                        <Table striped bordered size="sm">
                          <thead>
                            <tr><th>型号</th><th>功率</th><th>油箱</th><th>价格</th></tr>
                          </thead>
                          <tbody>
                            {cppHydraulicUnits.map((h, idx) => (
                              <tr key={idx}>
                                <td>{h.model}</td>
                                <td>{h.power} kW</td>
                                <td>{h.tankCapacity} L</td>
                                <td>{formatPrice(h.marketPrice)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </Tab>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};

export default CPPSelectionView;
