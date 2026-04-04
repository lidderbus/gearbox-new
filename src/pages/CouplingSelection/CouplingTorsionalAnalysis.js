// src/pages/CouplingSelection/CouplingTorsionalAnalysis.js
// 联轴器扭振分析组件

import React, { useMemo, useState } from 'react';
import { Card, Table, Badge, Row, Col, Form, Alert } from 'react-bootstrap';
import { getCouplingDynamicData, adjustStiffnessByTorque } from '../../data/couplingDynamicData';

const CouplingTorsionalAnalysis = ({
  selectedCoupling,
  engineData = {},
  colors = {}
}) => {
  const [cylinderCount, setCylinderCount] = useState(6);
  const engineSpeed = engineData.speed || 1500;

  const analysis = useMemo(() => {
    if (!selectedCoupling) return null;

    let dynamicData = getCouplingDynamicData(selectedCoupling.model);
    if (!dynamicData) return null;

    dynamicData = adjustStiffnessByTorque(dynamicData, selectedCoupling.torque);

    // 固有频率 fn = (1/(2*PI)) * sqrt(K/J)
    const K = dynamicData.dynamicStiffness * 1000; // kN·m/rad → N·m/rad
    const J = dynamicData.inertia;
    const fn = (1 / (2 * Math.PI)) * Math.sqrt(K / J);

    // 激励频率 fe = speed * cylinders / (60 * 2) (四冲程)
    const fe = (engineSpeed * cylinderCount) / (60 * 2);

    // 共振裕度
    const resonanceMargin = Math.abs(fn - fe) / fn * 100;
    const isSafe = resonanceMargin > 20;
    const isCaution = resonanceMargin > 10 && resonanceMargin <= 20;

    // 临界转速
    const criticalSpeed = Math.round((fn * 60 * 2) / cylinderCount);

    return {
      dynamicData,
      fn: fn.toFixed(1),
      fe: fe.toFixed(1),
      resonanceMargin: resonanceMargin.toFixed(1),
      isSafe,
      isCaution,
      criticalSpeed,
      safeRangeLow: Math.round(criticalSpeed * 0.85),
      safeRangeHigh: Math.round(criticalSpeed * 1.15)
    };
  }, [selectedCoupling, engineSpeed, cylinderCount]);

  if (!selectedCoupling) return null;
  if (!analysis) {
    return (
      <Alert variant="info" className="mb-0">
        <i className="bi bi-info-circle me-2"></i>
        该系列联轴器暂无扭振动态特性数据
      </Alert>
    );
  }

  const { dynamicData } = analysis;
  const statusColor = analysis.isSafe ? '#4caf50' : analysis.isCaution ? '#ff9800' : '#f44336';
  const statusText = analysis.isSafe ? '安全' : analysis.isCaution ? '注意' : '危险';

  // 转速范围可视化
  const speedBarWidth = 100;
  const maxBarSpeed = Math.max(engineSpeed * 1.5, analysis.safeRangeHigh * 1.3);
  const currentPos = (engineSpeed / maxBarSpeed) * speedBarWidth;
  const dangerLow = (analysis.safeRangeLow / maxBarSpeed) * speedBarWidth;
  const dangerHigh = (analysis.safeRangeHigh / maxBarSpeed) * speedBarWidth;

  return (
    <div>
      {/* 缸数选择 */}
      <Form.Group className="mb-3">
        <Form.Label className="small fw-bold">发动机缸数 (影响激励频率)</Form.Label>
        <Form.Select size="sm" value={cylinderCount} onChange={e => setCylinderCount(parseInt(e.target.value))}>
          {[2, 3, 4, 5, 6, 8, 10, 12, 16].map(n => (
            <option key={n} value={n}>{n}缸</option>
          ))}
        </Form.Select>
      </Form.Group>

      {/* 频率分析 */}
      <Row className="mb-3 text-center">
        <Col xs={4}>
          <Card className="h-100 border-primary">
            <Card.Body className="py-2">
              <div style={{ fontSize: '0.7rem', color: '#666' }}>固有频率</div>
              <div className="fw-bold text-primary" style={{ fontSize: '1.1rem' }}>{analysis.fn} Hz</div>
              <div style={{ fontSize: '0.65rem', color: '#999' }}>
                K={dynamicData.dynamicStiffness} kN·m/rad
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={4}>
          <Card className="h-100 border-warning">
            <Card.Body className="py-2">
              <div style={{ fontSize: '0.7rem', color: '#666' }}>激励频率</div>
              <div className="fw-bold text-warning" style={{ fontSize: '1.1rem' }}>{analysis.fe} Hz</div>
              <div style={{ fontSize: '0.65rem', color: '#999' }}>
                {engineSpeed}rpm × {cylinderCount}缸
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={4}>
          <Card className="h-100" style={{ borderColor: statusColor, borderWidth: 2 }}>
            <Card.Body className="py-2">
              <div style={{ fontSize: '0.7rem', color: '#666' }}>共振裕度</div>
              <div className="fw-bold" style={{ fontSize: '1.1rem', color: statusColor }}>
                {analysis.resonanceMargin}%
              </div>
              <Badge style={{ backgroundColor: statusColor, fontSize: '0.65rem' }}>
                {statusText}
              </Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 安全转速范围 */}
      <Card className="mb-3">
        <Card.Body className="py-2">
          <div className="small fw-bold mb-2">安全转速范围</div>
          <div style={{ position: 'relative', height: 30, backgroundColor: '#e8f5e9', borderRadius: 4, overflow: 'hidden' }}>
            {/* 危险区 */}
            <div style={{
              position: 'absolute', left: `${dangerLow}%`, width: `${dangerHigh - dangerLow}%`,
              height: '100%', backgroundColor: '#ffcdd2', borderLeft: '2px solid #f44336', borderRight: '2px solid #f44336'
            }} />
            {/* 当前转速标记 */}
            <div style={{
              position: 'absolute', left: `${currentPos}%`, top: 0, width: 3,
              height: '100%', backgroundColor: '#1976d2', zIndex: 2
            }} />
            <div style={{
              position: 'absolute', left: `${currentPos - 2}%`, top: -2,
              fontSize: '0.6rem', color: '#1976d2', fontWeight: 'bold', zIndex: 3
            }}>
              ▼{engineSpeed}
            </div>
          </div>
          <div className="d-flex justify-content-between mt-1" style={{ fontSize: '0.65rem', color: '#888' }}>
            <span>0 rpm</span>
            <span style={{ color: '#f44336' }}>共振区 {analysis.safeRangeLow}-{analysis.safeRangeHigh} rpm</span>
            <span>{Math.round(maxBarSpeed)} rpm</span>
          </div>
        </Card.Body>
      </Card>

      {/* 动态特性参数 */}
      <Table bordered size="sm" className="mb-3" style={{ fontSize: '0.8rem' }}>
        <thead className="table-light">
          <tr><th colSpan={2}>动态特性参数</th></tr>
        </thead>
        <tbody>
          <tr><td>静态扭转刚度</td><td>{dynamicData.staticStiffness} kN·m/rad</td></tr>
          <tr><td>动态扭转刚度</td><td>{dynamicData.dynamicStiffness} kN·m/rad</td></tr>
          <tr><td>阻尼系数</td><td>{dynamicData.dampingCoefficient}</td></tr>
          <tr><td>转动惯量</td><td>{dynamicData.inertia} kg·m²</td></tr>
        </tbody>
      </Table>

      {/* 补偿能力 */}
      <Table bordered size="sm" className="mb-3" style={{ fontSize: '0.8rem' }}>
        <thead className="table-light">
          <tr><th colSpan={2}>偏差补偿能力</th></tr>
        </thead>
        <tbody>
          <tr><td>轴向补偿</td><td>±{dynamicData.compensation.axial} mm</td></tr>
          <tr><td>径向补偿</td><td>±{dynamicData.compensation.radial} mm</td></tr>
          <tr><td>角向补偿</td><td>±{dynamicData.compensation.angular}°</td></tr>
        </tbody>
      </Table>

      {/* 材质信息 */}
      <Table bordered size="sm" style={{ fontSize: '0.8rem' }}>
        <thead className="table-light">
          <tr><th colSpan={2}>弹性元件特性</th></tr>
        </thead>
        <tbody>
          <tr><td>橡胶材质</td><td>{dynamicData.rubberType}</td></tr>
          <tr><td>工作温度</td><td>{dynamicData.tempRange}</td></tr>
          <tr><td>设计寿命</td><td>{dynamicData.fatigueLife.toLocaleString()} 小时</td></tr>
          <tr><td>橡胶硬度</td><td>{dynamicData.hardness}</td></tr>
        </tbody>
      </Table>

      {/* 分析结论 */}
      <Alert variant={analysis.isSafe ? 'success' : analysis.isCaution ? 'warning' : 'danger'} className="mb-0">
        <strong>分析结论：</strong>
        {analysis.isSafe && `扭振分析通过 — 共振裕度 ${analysis.resonanceMargin}% > 20% 安全值，当前转速 ${engineSpeed} rpm 远离共振区(${analysis.safeRangeLow}-${analysis.safeRangeHigh} rpm)。`}
        {analysis.isCaution && `需要注意 — 共振裕度 ${analysis.resonanceMargin}% 处于10-20%警告区间，建议复核扭振计算或调整转速避开共振区(${analysis.safeRangeLow}-${analysis.safeRangeHigh} rpm)。`}
        {!analysis.isSafe && !analysis.isCaution && `扭振危险 — 共振裕度仅 ${analysis.resonanceMargin}% < 10%，当前转速接近共振区(${analysis.safeRangeLow}-${analysis.safeRangeHigh} rpm)，强烈建议更换联轴器或调整系统参数！`}
      </Alert>
    </div>
  );
};

export default CouplingTorsionalAnalysis;
