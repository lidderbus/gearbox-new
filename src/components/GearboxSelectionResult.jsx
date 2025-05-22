// src/components/GearboxSelectionResult.js
import React from 'react';
import { Card, Button, Table, Badge, Row, Col, Alert, ListGroup } from 'react-bootstrap';

const GearboxSelectionResult = ({ 
  result, 
  selectedIndex, 
  onSelectGearbox, 
  onGenerateQuotation,
  onGenerateAgreement,
  colors,
  theme
}) => {
  if (!result) {
    return (
      <div className="no-result">
        <p>请先进行选型操作</p>
      </div>
    );
  }

  if (!result.success && (!result.recommendations || result.recommendations.length === 0)) {
    return (
      <div className="no-result">
        <p>{result.message || '未找到合适的齿轮箱'}</p>
        {result.rejectionReasons && Object.values(result.rejectionReasons).some(v => v > 0) && (
          <div className="selection-info">
            <h6>筛选情况:</h6>
            <ul>
              {result.rejectionReasons.speedRange > 0 && (
                <li>{result.rejectionReasons.speedRange} 个型号因转速范围不匹配被排除</li>
              )}
              {result.rejectionReasons.ratioOutOfRange > 0 && (
                <li>{result.rejectionReasons.ratioOutOfRange} 个型号因减速比偏差过大被排除</li>
              )}
              {result.rejectionReasons.capacityTooLow > 0 && (
                <li>{result.rejectionReasons.capacityTooLow} 个型号因传递能力不足被排除</li>
              )}
              {result.rejectionReasons.capacityTooHigh > 0 && (
                <li>{result.rejectionReasons.capacityTooHigh} 个型号因传递能力余量过大被排除</li>
              )}
              {result.rejectionReasons.thrustInsufficient > 0 && (
                <li>{result.rejectionReasons.thrustInsufficient} 个型号因推力不满足要求被排除</li>
              )}
            </ul>
            <p>建议尝试:</p>
            <ul>
              <li>调整目标减速比，允许更大的偏差</li>
              <li>选择不同系列的齿轮箱</li>
              <li>调整主机参数如功率或转速</li>
              <li>降低推力要求（如果设置了）</li>
            </ul>
          </div>
        )}
      </div>
    );
  }

  // 对于无成功结果但有推荐的情况 或 有成功结果的情况
  const recommendations = result.recommendations || [];
  const selectedGearbox = recommendations[selectedIndex] || recommendations[0];
  
  if (!selectedGearbox) {
    return (
      <div className="no-result">
        <p>推荐列表中没有可选的齿轮箱</p>
      </div>
    );
  }

  // 显示近似匹配的警告
  const renderWarningAlert = () => {
    if (!result.success || selectedGearbox.isPartialMatch) {
      return (
        <Alert variant="warning" className="mt-3 mb-3">
          <Alert.Heading>近似匹配警告</Alert.Heading>
          <p>
            {selectedGearbox.failureReason || result.warning || '此齿轮箱不完全满足所有选型条件，但为最接近的匹配。'}
          </p>
          <hr />
          <p className="mb-0">
            请评估是否可接受这些偏差，或考虑调整您的选型要求。
          </p>
        </Alert>
      );
    }
    return null;
  };

  // 渲染警告信息，如有
  const renderGeneralWarning = () => {
    if (result.warning && result.success && !selectedGearbox.isPartialMatch) {
      return (
        <Alert variant="info" className="mt-3 mb-3">
          <i className="bi bi-info-circle-fill me-2"></i>
          {result.warning}
        </Alert>
      );
    }
    return null;
  };

  // 渲染齿轮箱选择按钮组
  const renderGearboxSelector = () => {
    if (recommendations.length <= 1) return null;
    
    return (
      <div className="mb-3">
        <h6>可选齿轮箱:</h6>
        <div className="gearbox-type-selector">
          {recommendations.map((gearbox, index) => (
            <Button
              key={`${gearbox.model}-${index}`}
              variant={selectedIndex === index ? 'primary' : 'outline-primary'}
              size="sm"
              onClick={() => onSelectGearbox(index)}
              className={gearbox.isPartialMatch ? 'has-warning' : ''}
            >
              {gearbox.model}
              {gearbox.isPartialMatch && (
                <span className="partial-match-badge">近似</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    );
  };

  // 计算安全系数和评分的类别
  const getSafetyClass = (safety) => {
    if (safety >= 1.2) return 'success';
    if (safety >= 1.0) return 'warning';
    return 'danger';
  };

  const getCapacityMarginClass = (margin) => {
    if (margin >= 5 && margin <= 20) return 'success';
    if (margin > 0) return 'warning';
    return 'danger';
  };

  const getRatioDiffClass = (diff) => {
    if (diff <= 5) return 'success';
    if (diff <= 10) return 'warning';
    return 'danger';
  };

  // 格式化数值
  const formatNumber = (num, decimals = 2) => {
    if (num === undefined || num === null) return '-';
    return typeof num === 'number' ? num.toFixed(decimals) : num;
  };

  // 格式化价格
  const formatPrice = (price) => {
    if (!price) return '¥0';
    return `¥${parseInt(price).toLocaleString('zh-CN')}`;
  };

  return (
    <div className="gearbox-selection-result">
      {renderGearboxSelector()}
      {renderWarningAlert()}
      {renderGeneralWarning()}
      
      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
            <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="bi bi-gear-fill me-2"></i>
                  齿轮箱信息 - {selectedGearbox.model}
                </span>
                <div>
                  <Badge bg="info" className="me-1">
                    {selectedGearbox.originalType || result.gearboxTypeUsed}系列
                  </Badge>
                  {selectedGearbox.isPartialMatch && (
                    <Badge bg="warning">近似匹配</Badge>
                  )}
                </div>
              </div>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <Badge 
                    bg={getCapacityMarginClass(selectedGearbox.capacityMargin)}
                    className="me-2"
                  >
                    容量余量: {formatNumber(selectedGearbox.capacityMargin)}%
                  </Badge>
                  <Badge 
                    bg={getRatioDiffClass(selectedGearbox.ratioDiffPercent)}
                    className="me-2"
                  >
                    减速比偏差: {formatNumber(selectedGearbox.ratioDiffPercent)}%
                  </Badge>
                  <Badge 
                    bg={getSafetyClass(selectedGearbox.safetyFactor)}
                  >
                    安全系数: {formatNumber(selectedGearbox.safetyFactor)}
                  </Badge>
                </div>
                <div>
                  <Badge bg="secondary">评分: {selectedGearbox.score || '-'}</Badge>
                </div>
              </div>
              
              <Row>
                <Col md={6}>
                  <Table bordered hover size="sm" responsive>
                    <tbody>
                      <tr>
                        <td className="fw-bold" style={{ width: '40%' }}>减速比</td>
                        <td>{formatNumber(selectedGearbox.ratio || selectedGearbox.selectedRatio)}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">传递功率</td>
                        <td>{formatNumber(selectedGearbox.power)} kW</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">输入转速</td>
                        <td>{formatNumber(selectedGearbox.speed)} r/min</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">输出转速</td>
                        <td>{formatNumber(selectedGearbox.speed / (selectedGearbox.ratio || selectedGearbox.selectedRatio))} r/min</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">输入扭矩</td>
                        <td>{formatNumber(result.engineTorque / 1000, 3)} kN·m</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">输出扭矩</td>
                        <td>{formatNumber((result.engineTorque * (selectedGearbox.ratio || selectedGearbox.selectedRatio)) / 1000, 3)} kN·m</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <Table bordered hover size="sm" responsive>
                    <tbody>
                      <tr>
                        <td className="fw-bold" style={{ width: '40%' }}>中心距</td>
                        <td>{selectedGearbox.centerDistance || '-'} mm</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">倾角</td>
                        <td>{selectedGearbox.shaftAngle || '-'} °</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">允许推力</td>
                        <td>
                          {selectedGearbox.thrust || '-'} kN
                          {result.thrustRequirement > 0 && !selectedGearbox.thrustMet && (
                            <Badge bg="danger" className="ms-2" style={{ fontSize: '0.7rem' }}>不满足</Badge>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">油泵流量</td>
                        <td>{selectedGearbox.pumpFlow || '-'} L/min</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">润滑油量</td>
                        <td>{selectedGearbox.oilVolume || '-'} L</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">重量</td>
                        <td>{selectedGearbox.weight || '-'} kg</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
              
              {selectedGearbox.failureReason && (
                <div className="info-box info-box-warning mt-3">
                  <div className="info-box-title">匹配问题:</div>
                  <p className="mb-0">{selectedGearbox.failureReason}</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={6}>
          <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
            <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
              <i className="bi bi-tools me-2"></i>配套设备 &amp; 价格信息
            </Card.Header>
            <Card.Body>
              <h6 className="mb-2">价格信息</h6>
              <Table bordered hover size="sm" responsive>
                <tbody>
                  <tr>
                    <td className="fw-bold" style={{ width: '40%' }}>基础价格</td>
                    <td>{formatPrice(selectedGearbox.basePrice)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">折扣率</td>
                    <td>{selectedGearbox.discountRate ? `${(selectedGearbox.discountRate * 100).toFixed(1)}%` : '-'}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">出厂价格</td>
                    <td>{formatPrice(selectedGearbox.factoryPrice)}</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">市场价格</td>
                    <td className="fw-bold text-primary">{formatPrice(selectedGearbox.marketPrice)}</td>
                  </tr>
                </tbody>
              </Table>
              
              {result.flexibleCoupling && (
                <>
                  <h6 className="mt-3 mb-2">高弹性联轴器</h6>
                  <Table bordered hover size="sm" responsive>
                    <tbody>
                      <tr>
                        <td className="fw-bold" style={{ width: '40%' }}>型号</td>
                        <td>{result.flexibleCoupling.model}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">额定扭矩</td>
                        <td>{formatNumber(result.flexibleCoupling.torque, 1)} kN·m</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">最高转速</td>
                        <td>{result.flexibleCoupling.maxSpeed || '-'} r/min</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">价格</td>
                        <td>{formatPrice(result.flexibleCoupling.price)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              )}
              
              {result.standbyPump && (
                <>
                  <h6 className="mt-3 mb-2">备用泵</h6>
                  <Table bordered hover size="sm" responsive>
                    <tbody>
                      <tr>
                        <td className="fw-bold" style={{ width: '40%' }}>型号</td>
                        <td>{result.standbyPump.model}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">流量</td>
                        <td>{formatNumber(result.standbyPump.flow)} L/min</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">压力</td>
                        <td>{formatNumber(result.standbyPump.pressure)} MPa</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">价格</td>
                        <td>{formatPrice(result.standbyPump.price)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </>
              )}
              
              <div className="mt-4">
                <Button 
                  variant="primary" 
                  onClick={onGenerateQuotation} 
                  className="me-2"
                >
                  <i className="bi bi-currency-yen me-1"></i> 生成报价单
                </Button>
                <Button 
                  variant="outline-primary" 
                  onClick={onGenerateAgreement}
                >
                  <i className="bi bi-file-earmark-text me-1"></i> 生成技术协议
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      {result.success && recommendations.length > 1 && selectedIndex === 0 && (
        <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
          <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
            <i className="bi bi-list-check me-2"></i>其他推荐选项
          </Card.Header>
          <Card.Body>
            <Table hover responsive>
              <thead>
                <tr>
                  <th>型号</th>
                  <th>系列</th>
                  <th>减速比</th>
                  <th>容量余量</th>
                  <th>评分</th>
                  <th>价格</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                {recommendations.slice(1, 5).map((gearbox, index) => (
                  <tr key={`rec-${index + 1}`}>
                    <td>
                      {gearbox.model}
                      {gearbox.isPartialMatch && (
                        <Badge bg="warning" className="ms-1" style={{ fontSize: '0.7rem' }}>近似</Badge>
                      )}
                    </td>
                    <td>{gearbox.originalType || result.gearboxTypeUsed}</td>
                    <td>{formatNumber(gearbox.ratio || gearbox.selectedRatio)}</td>
                    <td>
                      <Badge bg={getCapacityMarginClass(gearbox.capacityMargin)}>
                        {formatNumber(gearbox.capacityMargin)}%
                      </Badge>
                    </td>
                    <td>{gearbox.score || '-'}</td>
                    <td>{formatPrice(gearbox.marketPrice)}</td>
                    <td>
                      <Button 
                        variant="outline-secondary" 
                        size="sm"
                        onClick={() => onSelectGearbox(index + 1)}
                      >
                        选择
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default GearboxSelectionResult;
