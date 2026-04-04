// src/pages/CouplingSelection/CouplingTechnicalParams.js
// 联轴器技术参数详情组件

import React, { useState } from 'react';
import { Card, Table, Badge, Tabs, Tab, Row, Col, Button, ListGroup } from 'react-bootstrap';
import { getCouplingSeriesInfo } from '../../services/couplingSelectionService';
import CouplingTorsionalAnalysis from './CouplingTorsionalAnalysis';

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

  // 渲染计算过程（增强版5步详解）
  const renderCalculationProcess = () => {
    const power = calculationDetails?.power;
    const speed = calculationDetails?.speed;
    const engineTorque = calculationDetails?.engineTorque;
    const kFactor = calculationDetails?.kFactor;
    const stFactor = calculationDetails?.stFactor;
    const reqTorque = calculationDetails?.requiredTorque_kNm;
    const isJbCcs = calculationDetails?.workFactorMode === 'JB_CCS';

    return (
      <div>
        <h6 className="mb-3">
          <i className="bi bi-calculator me-1"></i>
          选型计算过程详解
        </h6>

        {/* 步骤1 */}
        <Card className="mb-2 border-start border-primary border-3">
          <Card.Body className="py-2">
            <div className="small fw-bold text-primary">步骤1：计算发动机扭矩 T<sub>AN</sub></div>
            <div className="text-muted small">T<sub>AN</sub> = 9.55 × P<sub>w</sub> / n</div>
            <div className="small">= 9.55 × {power} kW / {speed} rpm</div>
            <div className="fw-bold">= {engineTorque?.toFixed(2)} N·m = {(engineTorque / 1000)?.toFixed(4)} kN·m</div>
          </Card.Body>
        </Card>

        {/* 步骤2 */}
        <Card className="mb-2 border-start border-success border-3">
          <Card.Body className="py-2">
            <div className="small fw-bold text-success">步骤2：确定工况系数 K</div>
            <div className="text-muted small">
              工况类型: {calculationDetails?.workCondition || 'III类'}
              {isJbCcs ? ' (CCS船级社标准)' : ' (厂家标准)'}
            </div>
            <div className="fw-bold">K = {kFactor?.toFixed(2)}</div>
          </Card.Body>
        </Card>

        {/* 步骤3 */}
        <Card className="mb-2 border-start border-info border-3">
          <Card.Body className="py-2">
            <div className="small fw-bold text-info">步骤3：确定温度系数 S<sub>t</sub></div>
            <div className="text-muted small">环境温度: {calculationDetails?.temperature || 30}°C</div>
            <div className="fw-bold">S<sub>t</sub> = {stFactor?.toFixed(2)}</div>
          </Card.Body>
        </Card>

        {/* 步骤4 */}
        <Card className="mb-2 border-start border-warning border-3">
          <Card.Body className="py-2">
            <div className="small fw-bold text-warning">步骤4：计算所需联轴器扭矩 T<sub>KN</sub></div>
            <div className="text-muted small">T<sub>KN</sub> = T<sub>AN</sub> × K × S<sub>t</sub></div>
            <div className="small">= {(engineTorque / 1000)?.toFixed(4)} × {kFactor?.toFixed(2)} × {stFactor?.toFixed(2)}</div>
            <div className="fw-bold text-danger" style={{ fontSize: '1.05em' }}>= {reqTorque?.toFixed(3)} kN·m</div>
          </Card.Body>
        </Card>

        {/* 步骤5 */}
        <Card className="mb-3 border-start border-danger border-3">
          <Card.Body className="py-2">
            <div className="small fw-bold" style={{ color: '#9c27b0' }}>步骤5：选型判定</div>
            <div className="text-muted small">选型依据: T<sub>KN30</sub> ≥ T<sub>KN</sub>，推荐余量 10%-30%</div>
            <div className="small">选择扭矩范围: ≥ {reqTorque?.toFixed(3)} kN·m</div>
            <div className="fw-bold">
              <span className="text-success">✅ 推荐型号 </span>
              <Badge bg="primary">{coupling.model}</Badge>
              <span className="ms-2">额定扭矩 {coupling.torque?.toFixed(2)} kN·m，余量 {coupling.torqueMargin?.toFixed(1)}%</span>
            </div>
          </Card.Body>
        </Card>

        {/* PDF参考公式 */}
        <Card className="bg-light">
          <Card.Body className="py-2">
            <h6 className="small fw-bold">
              <i className="bi bi-file-earmark-text me-1"></i>
              选型参考公式（来自PDF目录）
            </h6>
            <ul className="mb-0 small ps-3" style={{ fontSize: '0.8rem' }}>
              <li><strong>扭矩计算:</strong> T<sub>KN</sub> = K × 9.55 × P<sub>w</sub> / n</li>
              <li><strong>工况系数K范围{isJbCcs ? '（CCS船级社标准）' : '（厂家标准）'}:</strong>{' '}
                {isJbCcs
                  ? 'I类(1.3) → II类(1.75) → III类(2.5) → IV类(2.75) → V类(3.0)'
                  : 'I类(1.0) → II类(1.2) → III类(1.4) → IV类(1.6) → V类(1.8)'}
              </li>
              <li><strong>温度系数St:</strong> ≤20°C(1.0) → 40°C(1.1) → 60°C(1.2) → 80°C(1.3)</li>
              <li><strong>双缸柴油机:</strong> K值需增加0.2</li>
            </ul>
          </Card.Body>
        </Card>
      </div>
    );
  };

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
          <Tab eventKey="vibration" title="扭振分析">
            <CouplingTorsionalAnalysis
              selectedCoupling={coupling}
              engineData={{ speed: calculationDetails?.speed, power: calculationDetails?.power }}
            />
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
