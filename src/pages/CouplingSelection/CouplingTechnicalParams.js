// src/pages/CouplingSelection/CouplingTechnicalParams.js
// 联轴器技术参数详情组件

import React, { useState } from 'react';
import { Card, Table, Badge, Tabs, Tab, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { getCouplingSeriesInfo } from '../../services/couplingSelectionService';

/**
 * 联轴器技术参数详情组件
 */
const CouplingTechnicalParams = ({
  coupling,
  calculationDetails,
  colors = {}
}) => {
  const [activeTab, setActiveTab] = useState('technical');

  if (!coupling) {
    return null;
  }

  const seriesInfo = getCouplingSeriesInfo(coupling.model);

  // 渲染技术参数表格
  const renderTechnicalParams = () => (
    <Table bordered hover size="sm">
      <tbody>
        <tr>
          <td width="30%"><strong>型号</strong></td>
          <td>
            <strong style={{ color: seriesInfo.color }}>{coupling.model}</strong>
            <Badge bg="secondary" className="ms-2">{seriesInfo.name}</Badge>
          </td>
        </tr>
        <tr>
          <td><strong>额定扭矩</strong></td>
          <td>{coupling.torque?.toFixed(2)} kN·m ({(coupling.torque * 1000).toFixed(0)} N·m)</td>
        </tr>
        <tr>
          <td><strong>最大扭矩</strong></td>
          <td>{coupling.maxTorque?.toFixed(2) || (coupling.torque * 2.5).toFixed(2)} kN·m</td>
        </tr>
        <tr>
          <td><strong>最高转速</strong></td>
          <td>{coupling.maxSpeed} rpm</td>
        </tr>
        <tr>
          <td><strong>重量</strong></td>
          <td>{coupling.weight} kg</td>
        </tr>
        <tr className="table-info">
          <td><strong>所需扭矩</strong></td>
          <td>{coupling.requiredTorque?.toFixed(3)} kN·m</td>
        </tr>
        <tr className={coupling.torqueMargin >= 10 && coupling.torqueMargin <= 30 ? 'table-success' :
          coupling.torqueMargin < 5 ? 'table-danger' : 'table-warning'}>
          <td><strong>扭矩余量</strong></td>
          <td>
            {coupling.torqueMargin?.toFixed(1)}%
            {coupling.torqueMargin >= 10 && coupling.torqueMargin <= 30 && <span className="text-success ms-2">(理想范围)</span>}
            {coupling.torqueMargin < 5 && <span className="text-danger ms-2">(过低)</span>}
            {coupling.torqueMargin > 50 && <span className="text-warning ms-2">(偏高)</span>}
          </td>
        </tr>
        <tr>
          <td><strong>速度余量</strong></td>
          <td>{coupling.speedMarginPercent?.toFixed(1)}%</td>
        </tr>
        {coupling.notes && (
          <tr>
            <td><strong>备注</strong></td>
            <td>{coupling.notes}</td>
          </tr>
        )}
      </tbody>
    </Table>
  );

  // 渲染价格信息
  const renderPriceInfo = () => (
    <Table bordered hover size="sm">
      <tbody>
        <tr>
          <td width="30%"><strong>基准价格</strong></td>
          <td>{coupling.basePrice?.toLocaleString() || coupling.price?.toLocaleString()} 元</td>
        </tr>
        <tr>
          <td><strong>折扣率</strong></td>
          <td>{((coupling.discountRate || 0.10) * 100).toFixed(1)}%</td>
        </tr>
        <tr>
          <td><strong>出厂价</strong></td>
          <td>{coupling.factoryPrice?.toLocaleString()} 元</td>
        </tr>
        <tr className="table-warning">
          <td><strong>市场价</strong></td>
          <td className="fw-bold text-danger">{coupling.marketPrice?.toLocaleString()} 元</td>
        </tr>
      </tbody>
    </Table>
  );

  // 渲染计算过程
  const renderCalculationProcess = () => (
    <div>
      <h6>扭矩计算过程</h6>
      <ListGroup variant="flush" className="mb-3">
        <ListGroup.Item className="d-flex justify-content-between">
          <span>1. 发动机扭矩</span>
          <span>
            T = P × 9550 / n = {calculationDetails?.power} × 9550 / {calculationDetails?.speed} = <strong>{calculationDetails?.engineTorque?.toFixed(2)} N·m</strong>
          </span>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          <span>2. 工况系数 K</span>
          <span><strong>{calculationDetails?.kFactor?.toFixed(2)}</strong></span>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          <span>3. 温度系数 St</span>
          <span><strong>{calculationDetails?.stFactor?.toFixed(2)}</strong></span>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between bg-light">
          <span>4. 所需联轴器扭矩</span>
          <span>
            Tc = T × K × St / 1000 = <strong>{calculationDetails?.requiredTorque_kNm?.toFixed(3)} kN·m</strong>
          </span>
        </ListGroup.Item>
      </ListGroup>

      <h6>选型匹配结果</h6>
      <ListGroup variant="flush">
        <ListGroup.Item className="d-flex justify-content-between">
          <span>联轴器额定扭矩</span>
          <span><strong>{coupling.torque?.toFixed(2)} kN·m</strong></span>
        </ListGroup.Item>
        <ListGroup.Item className="d-flex justify-content-between">
          <span>扭矩余量</span>
          <span>
            ({coupling.torque?.toFixed(3)} - {calculationDetails?.requiredTorque_kNm?.toFixed(3)}) / {calculationDetails?.requiredTorque_kNm?.toFixed(3)} × 100% =
            <strong className={coupling.torqueMargin >= 10 ? 'text-success' : 'text-warning'}> {coupling.torqueMargin?.toFixed(1)}%</strong>
          </span>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );

  // 渲染系列信息
  const renderSeriesInfo = () => (
    <div>
      <div className="d-flex align-items-center mb-3">
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            backgroundColor: seriesInfo.color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            marginRight: 15
          }}
        >
          {seriesInfo.prefix?.substring(0, 2) || 'HG'}
        </div>
        <div>
          <h5 className="mb-0">{seriesInfo.name}</h5>
          <small className="text-muted">{seriesInfo.description}</small>
        </div>
      </div>

      <Table bordered size="sm">
        <tbody>
          <tr>
            <td width="30%"><strong>系列前缀</strong></td>
            <td>{seriesInfo.prefix || coupling.model.substring(0, 4)}</td>
          </tr>
          <tr>
            <td><strong>适用范围</strong></td>
            <td>{seriesInfo.description}</td>
          </tr>
          <tr>
            <td><strong>典型特点</strong></td>
            <td>
              {coupling.model.includes('JB') && <Badge bg="info" className="me-1">带罩壳</Badge>}
              {coupling.model.includes('X') && <Badge bg="warning" className="me-1">可拆式</Badge>}
              {coupling.model.includes('A') && <Badge bg="primary" className="me-1">A型</Badge>}
              {coupling.model.includes('B') && <Badge bg="secondary" className="me-1">B型</Badge>}
              {coupling.model.includes('Q') && <Badge bg="success" className="me-1">Q型</Badge>}
              {!coupling.model.match(/[JBXABQ]/) && <Badge bg="light" text="dark">标准型</Badge>}
            </td>
          </tr>
        </tbody>
      </Table>
    </div>
  );

  return (
    <Card className="shadow-sm mb-4" style={{ backgroundColor: colors.card || 'white' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-gear me-2"></i>
            技术参数详情
          </span>
          <Badge
            style={{ backgroundColor: seriesInfo.color }}
            className="px-3"
          >
            {coupling.model}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <Tabs
          id="coupling-params-tabs"
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="technical" title="技术参数">
            {renderTechnicalParams()}
          </Tab>
          <Tab eventKey="price" title="价格信息">
            {renderPriceInfo()}
          </Tab>
          <Tab eventKey="calculation" title="计算过程">
            {calculationDetails ? renderCalculationProcess() : (
              <p className="text-muted">暂无计算过程数据</p>
            )}
          </Tab>
          <Tab eventKey="series" title="系列信息">
            {renderSeriesInfo()}
          </Tab>
        </Tabs>

        {/* 综合评分 */}
        <Row className="mt-3 pt-3 border-top">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <span>综合评分</span>
              <div>
                <Badge
                  bg={coupling.score >= 80 ? 'success' : coupling.score >= 60 ? 'primary' : 'warning'}
                  className="px-3 py-2"
                  style={{ fontSize: '1.1em' }}
                >
                  {coupling.score} / 100 分
                </Badge>
              </div>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default CouplingTechnicalParams;
