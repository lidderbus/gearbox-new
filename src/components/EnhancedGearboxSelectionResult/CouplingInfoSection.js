// src/components/EnhancedGearboxSelectionResult/CouplingInfoSection.js
// 高弹联轴器信息展示组件
import React from 'react';
import { Row, Col, Table, Badge, Alert } from 'react-bootstrap';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import ProductThumbnail from '../ProductThumbnail';
import ValidationWarnings from './ValidationWarnings';

/**
 * 高弹联轴器信息展示组件
 * 显示选型的联轴器详细信息和扭矩饼图
 */
const CouplingInfoSection = ({
  couplingResult,
  options = {},
  validation,
  colors = {},
  onImageClick
}) => {
  // 未找到联轴器
  if (!couplingResult || !couplingResult.success) {
    return (
      <Alert variant="warning">
        <i className="bi bi-exclamation-triangle me-2"></i>
        未能找到匹配的高弹联轴器
        {couplingResult && couplingResult.message && (
          <p className="mt-2 mb-0"><small>{couplingResult.message}</small></p>
        )}
      </Alert>
    );
  }

  // 创建联轴器扭矩组成饼图数据
  const createCouplingTorquePieData = () => {
    const requiredTorque = couplingResult.requiredTorque || 0;
    const actualTorque = couplingResult.torque || 0;
    const margin = Math.max(0, actualTorque - requiredTorque);

    return [
      { name: '所需扭矩', value: requiredTorque, fill: '#82ca9d' },
      { name: '扭矩余量', value: margin, fill: '#8884d8' }
    ];
  };

  return (
    <div className="coupling-section">
      <Row>
        <Col md={7}>
          <div className="d-flex align-items-center mb-2">
            <ProductThumbnail
              model={couplingResult.model}
              type="coupling"
              size={50}
              onClick={onImageClick}
              className="me-2"
            />
            <h6 style={{ color: colors?.headerText, margin: 0 }}>高弹联轴器: {couplingResult.model}</h6>
          </div>
          <Table bordered size="sm" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
            <tbody>
              <tr>
                <td width="40%">额定扭矩</td>
                <td>{couplingResult.torque} {couplingResult.torqueUnit || 'kN·m'}</td>
              </tr>
              <tr>
                <td>所需扭矩</td>
                <td>{couplingResult.requiredTorque?.toFixed(3) || '-'} kN·m</td>
              </tr>
              <tr>
                <td>扭矩余量</td>
                <td>
                  {couplingResult.torqueMargin?.toFixed(1)}%
                  {couplingResult.torqueMargin < 5 ? (
                    <Badge bg="danger" className="ms-2">过低</Badge>
                  ) : couplingResult.torqueMargin > 50 ? (
                    <Badge bg="warning" className="ms-2">过高</Badge>
                  ) : (
                    <Badge bg="success" className="ms-2">合适</Badge>
                  )}
                </td>
              </tr>
              <tr>
                <td>最大转速</td>
                <td>{couplingResult.maxSpeed} rpm</td>
              </tr>
              <tr>
                <td>工作条件</td>
                <td>{options?.workCondition || '-'}</td>
              </tr>
              <tr>
                <td>是否带罩壳</td>
                <td>{options?.hasCover ? '是' : '否'}</td>
              </tr>
              <tr>
                <td>重量</td>
                <td>{couplingResult.weight || '-'} kg</td>
              </tr>
              <tr>
                <td>价格</td>
                <td>{(couplingResult.marketPrice || 0).toLocaleString()} 元</td>
              </tr>
            </tbody>
          </Table>
        </Col>
        <Col md={5}>
          <h6 style={{ color: colors?.headerText }}>扭矩组成</h6>
          <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={createCouplingTorquePieData()}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {createCouplingTorquePieData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
      {couplingResult.warning && (
        <Alert variant="info" className="mt-2">
          <i className="bi bi-info-circle me-2"></i>
          {couplingResult.warning}
        </Alert>
      )}
      {/* 联轴器数据验证警告 */}
      <ValidationWarnings validation={validation} type="coupling" />
    </div>
  );
};

export default CouplingInfoSection;
