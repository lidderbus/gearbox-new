// src/components/shaft/ShaftSystemSelector.js
// 轴系配件选型界面

import React, { useState, useCallback } from 'react';
import { Card, Row, Col, Form, Button, Table, Alert, Badge, Tabs, Tab } from 'react-bootstrap';
import {
  intermediateBearings,
  thrustBearings,
  sternTubeSeals,
  shaftCouplings,
  shaftFlanges
} from '../../data/shaftSystemData';
import {
  selectShaftSystem,
  estimateShaftDiameter,
  calculateShaftTorque,
  selectIntermediateBearing,
  selectSternTubeSeal,
  selectShaftCoupling
} from '../../utils/shaftSelectionAlgorithm';

const ShaftSystemSelector = ({ colors = {}, theme = 'light', onSystemSelect }) => {
  // 输入参数
  const [power, setPower] = useState('');
  const [speed, setSpeed] = useState('');
  const [shaftDiameter, setShaftDiameter] = useState('');
  const [thrust, setThrust] = useState('');

  // 选项
  const [bearingType, setBearingType] = useState('');
  const [sealType, setSealType] = useState('');
  const [couplingType, setCouplingType] = useState('');

  // 选型结果
  const [selectionResult, setSelectionResult] = useState(null);
  const [selectedBearing, setSelectedBearing] = useState(null);
  const [selectedSeal, setSelectedSeal] = useState(null);
  const [selectedCoupling, setSelectedCoupling] = useState(null);
  const [selectedFlange, setSelectedFlange] = useState(null);

  // 计算值显示
  const [calculatedDiameter, setCalculatedDiameter] = useState(null);
  const [calculatedTorque, setCalculatedTorque] = useState(null);

  // 浏览模式
  const [browseTab, setBrowseTab] = useState('bearing');

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

  // 估算轴径
  const handleEstimateDiameter = () => {
    if (!power || !speed) {
      alert('请输入功率和转速');
      return;
    }
    const diameter = estimateShaftDiameter(parseFloat(power), parseFloat(speed));
    setShaftDiameter(diameter.toString());
    setCalculatedDiameter(diameter);

    // 同时计算扭矩
    const torque = calculateShaftTorque(parseFloat(power), parseFloat(speed));
    setCalculatedTorque(torque.toFixed(2));
  };

  // 执行选型
  const handleSelection = useCallback(() => {
    const params = {
      power: power ? parseFloat(power) : null,
      speed: speed ? parseFloat(speed) : null,
      thrust: thrust ? parseFloat(thrust) : null,
      shaftDiameter: shaftDiameter ? parseFloat(shaftDiameter) : null,
      options: {
        bearing: { type: bearingType || null },
        seal: { type: sealType || null },
        coupling: { type: couplingType || null }
      }
    };

    const result = selectShaftSystem(params);

    setSelectionResult(result);
    if (result.success) {
      setSelectedBearing(result.system.intermediateBearing);
      setSelectedSeal(result.system.sternTubeSeal);
      setSelectedCoupling(result.system.shaftCoupling);
      setSelectedFlange(result.system.shaftFlange);
      if (result.calculatedParams) {
        setCalculatedDiameter(result.calculatedParams.shaftDiameter);
        setCalculatedTorque(result.calculatedParams.torque);
      }
      if (onSystemSelect) {
        onSystemSelect(result.system);
      }
    }
  }, [power, speed, thrust, shaftDiameter, bearingType, sealType, couplingType, onSystemSelect]);

  // 重置
  const handleReset = () => {
    setPower('');
    setSpeed('');
    setShaftDiameter('');
    setThrust('');
    setBearingType('');
    setSealType('');
    setCouplingType('');
    setSelectionResult(null);
    setSelectedBearing(null);
    setSelectedSeal(null);
    setSelectedCoupling(null);
    setSelectedFlange(null);
    setCalculatedDiameter(null);
    setCalculatedTorque(null);
  };

  // 格式化价格
  const formatPrice = (price) => {
    if (!price) return '-';
    return new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(price);
  };

  // 渲染选型结果摘要卡片
  const renderResultSummary = () => {
    if (!selectionResult || !selectionResult.success) return null;

    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={{...headerStyle, backgroundColor: '#d4edda'}}>
          <i className="bi bi-check-circle-fill me-2 text-success"></i>
          轴系配件选型完成
        </Card.Header>
        <Card.Body>
          <Row className="mb-3">
            <Col md={6}>
              <Alert variant="info" className="py-2 mb-2">
                <small><strong>计算轴径:</strong> {calculatedDiameter} mm</small>
              </Alert>
            </Col>
            <Col md={6}>
              <Alert variant="info" className="py-2 mb-2">
                <small><strong>计算扭矩:</strong> {calculatedTorque} kN.m</small>
              </Alert>
            </Col>
          </Row>

          <Table size="sm" bordered>
            <thead>
              <tr className="table-secondary">
                <th>配件类型</th>
                <th>型号</th>
                <th>规格</th>
                <th>价格</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><i className="bi bi-circle-fill text-primary me-1"></i>中间轴承</td>
                <td><strong>{selectedBearing?.model || '-'}</strong></td>
                <td>{selectedBearing?.shaftDiameterRange?.join('-') || '-'} mm</td>
                <td className="text-danger">{formatPrice(selectedBearing?.marketPrice)}</td>
              </tr>
              <tr>
                <td><i className="bi bi-circle-fill text-success me-1"></i>尾轴密封</td>
                <td><strong>{selectedSeal?.model || '-'}</strong></td>
                <td>{selectedSeal?.type === 'lip-seal' ? '唇形密封' : '机械密封'}</td>
                <td className="text-danger">{formatPrice(selectedSeal?.marketPrice)}</td>
              </tr>
              <tr>
                <td><i className="bi bi-circle-fill text-warning me-1"></i>轴联轴器</td>
                <td><strong>{selectedCoupling?.model || '-'}</strong></td>
                <td>{selectedCoupling?.maxTorque} kN.m</td>
                <td className="text-danger">{formatPrice(selectedCoupling?.marketPrice)}</td>
              </tr>
              <tr>
                <td><i className="bi bi-circle-fill text-info me-1"></i>法兰</td>
                <td><strong>{selectedFlange?.model || '-'}</strong></td>
                <td>Φ{selectedFlange?.shaftDiameter} mm</td>
                <td className="text-danger">{formatPrice(selectedFlange?.marketPrice)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="table-warning">
                <td colSpan="3"><strong>系统总价</strong></td>
                <td className="text-danger"><strong>{formatPrice(selectionResult.pricing?.total)}</strong></td>
              </tr>
            </tfoot>
          </Table>
        </Card.Body>
      </Card>
    );
  };

  // 渲染轴承表格
  const renderBearingTable = (bearings, title) => {
    return (
      <>
        <h5>{title}</h5>
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>型号</th>
              <th>类型</th>
              <th>轴径范围(mm)</th>
              <th>最大载荷(kN)</th>
              <th>最高转速(rpm)</th>
              <th>市场价</th>
            </tr>
          </thead>
          <tbody>
            {bearings.map((b, idx) => (
              <tr
                key={idx}
                style={{cursor: 'pointer'}}
                className={selectedBearing?.model === b.model ? 'table-primary' : ''}
                onClick={() => setSelectedBearing(b)}
              >
                <td><strong>{b.model}</strong></td>
                <td><Badge bg={b.type === 'roller' ? 'primary' : 'success'}>{b.type === 'roller' ? '滚动' : '滑动'}</Badge></td>
                <td>{b.shaftDiameterRange?.join(' - ')}</td>
                <td>{b.maxLoad}</td>
                <td>{b.maxSpeed}</td>
                <td className="text-danger">{formatPrice(b.marketPrice)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
    );
  };

  return (
    <div className="shaft-system-selector">
      <Row>
        {/* 左侧：输入面板 */}
        <Col lg={4}>
          <Card style={cardStyle} className="mb-3">
            <Card.Header style={headerStyle}>
              <i className="bi bi-gear-wide-connected me-2"></i>
              轴系配件选型参数
            </Card.Header>
            <Card.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>主机功率 (kW)</Form.Label>
                  <Form.Control
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    placeholder="例如: 500"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>主机转速 (rpm)</Form.Label>
                  <Form.Control
                    type="number"
                    value={speed}
                    onChange={(e) => setSpeed(e.target.value)}
                    placeholder="例如: 1000"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>轴径 (mm)</Form.Label>
                  <Row>
                    <Col>
                      <Form.Control
                        type="number"
                        value={shaftDiameter}
                        onChange={(e) => setShaftDiameter(e.target.value)}
                        placeholder="自动计算或手动输入"
                      />
                    </Col>
                    <Col xs="auto">
                      <Button variant="outline-secondary" size="sm" onClick={handleEstimateDiameter}>
                        估算
                      </Button>
                    </Col>
                  </Row>
                  {calculatedDiameter && (
                    <Form.Text className="text-muted">
                      计算轴径: {calculatedDiameter}mm, 扭矩: {calculatedTorque}kN.m
                    </Form.Text>
                  )}
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>推力 (kN) - 可选</Form.Label>
                  <Form.Control
                    type="number"
                    value={thrust}
                    onChange={(e) => setThrust(e.target.value)}
                    placeholder="用于推力轴承选型"
                  />
                </Form.Group>

                <hr />
                <small className="text-muted d-block mb-2">配件类型偏好:</small>

                <Form.Group className="mb-2">
                  <Form.Label><small>轴承类型</small></Form.Label>
                  <Form.Select size="sm" value={bearingType} onChange={(e) => setBearingType(e.target.value)}>
                    <option value="">不限</option>
                    <option value="roller">滚动轴承</option>
                    <option value="sliding">滑动轴承</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label><small>密封类型</small></Form.Label>
                  <Form.Select size="sm" value={sealType} onChange={(e) => setSealType(e.target.value)}>
                    <option value="">不限</option>
                    <option value="lip-seal">唇形密封</option>
                    <option value="mechanical-seal">机械密封</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label><small>联轴器类型</small></Form.Label>
                  <Form.Select size="sm" value={couplingType} onChange={(e) => setCouplingType(e.target.value)}>
                    <option value="">不限</option>
                    <option value="rigid">刚性联轴器</option>
                    <option value="disc">膜片联轴器</option>
                  </Form.Select>
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
          {selectionResult && !selectionResult.success && (
            <Card style={cardStyle}>
              <Card.Header style={{...headerStyle, backgroundColor: '#f8d7da'}}>
                <i className="bi bi-x-circle-fill me-2 text-danger"></i>选型失败
              </Card.Header>
              <Card.Body>
                <p className="mb-0">{selectionResult.message}</p>
              </Card.Body>
            </Card>
          )}
        </Col>

        {/* 右侧：结果展示 */}
        <Col lg={8}>
          {selectionResult?.success && renderResultSummary()}

          <Tabs activeKey={browseTab} onSelect={(k) => setBrowseTab(k)} className="mb-3">
            <Tab eventKey="bearing" title={<><i className="bi bi-circle me-1"></i>轴承</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  {renderBearingTable(intermediateBearings, '中间轴承')}
                  <hr />
                  <h5>推力轴承</h5>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>型号</th>
                        <th>推力范围(kN)</th>
                        <th>轴径范围(mm)</th>
                        <th>最高转速(rpm)</th>
                        <th>市场价</th>
                      </tr>
                    </thead>
                    <tbody>
                      {thrustBearings.map((b, idx) => (
                        <tr key={idx}>
                          <td><strong>{b.model}</strong></td>
                          <td>{b.thrustRange?.join(' - ')}</td>
                          <td>{b.shaftDiameterRange?.join(' - ')}</td>
                          <td>{b.maxSpeed}</td>
                          <td className="text-danger">{formatPrice(b.marketPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="seal" title={<><i className="bi bi-shield me-1"></i>密封</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  <h5>尾轴密封</h5>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>型号</th>
                        <th>类型</th>
                        <th>轴径范围(mm)</th>
                        <th>密封环数</th>
                        <th>特点</th>
                        <th>市场价</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sternTubeSeals.map((s, idx) => (
                        <tr
                          key={idx}
                          style={{cursor: 'pointer'}}
                          className={selectedSeal?.model === s.model ? 'table-success' : ''}
                          onClick={() => setSelectedSeal(s)}
                        >
                          <td><strong>{s.model}</strong></td>
                          <td>
                            <Badge bg={s.type === 'lip-seal' ? 'secondary' : 'primary'}>
                              {s.type === 'lip-seal' ? '唇形' : '机械'}
                            </Badge>
                          </td>
                          <td>{s.shaftDiameterRange?.join(' - ')}</td>
                          <td>{s.sealRings || '-'}</td>
                          <td><small>{s.features?.join(', ')}</small></td>
                          <td className="text-danger">{formatPrice(s.marketPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="coupling" title={<><i className="bi bi-link-45deg me-1"></i>联轴器</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  <h5>轴联轴器</h5>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>型号</th>
                        <th>类型</th>
                        <th>轴径范围(mm)</th>
                        <th>最大扭矩(kN.m)</th>
                        <th>最高转速(rpm)</th>
                        <th>市场价</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shaftCouplings.map((c, idx) => (
                        <tr
                          key={idx}
                          style={{cursor: 'pointer'}}
                          className={selectedCoupling?.model === c.model ? 'table-warning' : ''}
                          onClick={() => setSelectedCoupling(c)}
                        >
                          <td><strong>{c.model}</strong></td>
                          <td>
                            <Badge bg={c.type === 'rigid' ? 'dark' : 'info'}>
                              {c.type === 'rigid' ? '刚性' : '膜片'}
                            </Badge>
                          </td>
                          <td>{c.shaftDiameterRange?.join(' - ')}</td>
                          <td>{c.maxTorque}</td>
                          <td>{c.maxSpeed}</td>
                          <td className="text-danger">{formatPrice(c.marketPrice)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Tab>

            <Tab eventKey="flange" title={<><i className="bi bi-record-circle me-1"></i>法兰</>}>
              <Card style={cardStyle}>
                <Card.Body>
                  <h5>轴法兰</h5>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>型号</th>
                        <th>轴径(mm)</th>
                        <th>外径(mm)</th>
                        <th>螺栓数量</th>
                        <th>螺栓规格</th>
                        <th>市场价</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shaftFlanges.map((f, idx) => (
                        <tr
                          key={idx}
                          style={{cursor: 'pointer'}}
                          className={selectedFlange?.model === f.model ? 'table-info' : ''}
                          onClick={() => setSelectedFlange(f)}
                        >
                          <td><strong>{f.model}</strong></td>
                          <td>{f.shaftDiameter}</td>
                          <td>{f.outerDiameter}</td>
                          <td>{f.boltCount}</td>
                          <td>M{f.boltSize}</td>
                          <td className="text-danger">{formatPrice(f.marketPrice)}</td>
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

export default ShaftSystemSelector;
