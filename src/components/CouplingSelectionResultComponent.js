// src/components/CouplingSelectionResultComponent.js - 修复版本
import React, { useState } from 'react';
import { Card, Row, Col, Table, Badge, Button, Alert, ProgressBar } from 'react-bootstrap';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

/**
 * 联轴器选型结果组件
 * 展示联轴器选型结果和性能指标
 */
const CouplingSelectionResultComponent = ({
  couplingResult,
  engineTorque,
  workCondition,
  temperature,
  hasCover,
  onReset,
  colors,
  theme = 'light'
}) => {
  // 状态初始化
  const [showDetails, setShowDetails] = useState(false);
  
  // 创建联轴器扭矩组成饼图数据
  const createCouplingTorquePieData = () => {
    if (!couplingResult || !couplingResult.success) return [];
    
    const requiredTorque = couplingResult.requiredTorque || 0;
    const actualTorque = couplingResult.torque || 0;
    const margin = Math.max(0, actualTorque - requiredTorque);
    
    return [
      { name: '所需扭矩', value: requiredTorque, fill: '#82ca9d' },
      { name: '扭矩余量', value: margin, fill: '#8884d8' }
    ];
  };
  
  // 获取评分详情
  const getScoreDetailText = (scoreDetail) => {
    if (!scoreDetail) return '未评分';
    return `${scoreDetail.score.toFixed(0)}/${scoreDetail.maxScore} (${scoreDetail.explanation})`;
  };

  // 如果没有结果，显示无结果信息
  if (!couplingResult) {
    return (
      <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }}>
        <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
          <i className="bi bi-link-45deg me-2"></i>联轴器选型结果
        </Card.Header>
        <Card.Body>
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            尚未执行联轴器选型，请先进行齿轮箱选型。
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  // 渲染联轴器选型结果
  return (
    <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }}>
      <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span><i className="bi bi-link-45deg me-2"></i>联轴器选型结果</span>
          <div>
            {couplingResult.success ? (
              <Badge bg="success">选型成功</Badge>
            ) : (
              <Badge bg="danger">选型失败</Badge>
            )}
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {!couplingResult.success ? (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            联轴器选型失败: {couplingResult.message || '未找到合适的联轴器'}
            {onReset && (
              <div className="mt-3">
                <Button variant="outline-primary" size="sm" onClick={onReset}>
                  <i className="bi bi-arrow-repeat me-1"></i> 重新选型
                </Button>
              </div>
            )}
          </Alert>
        ) : (
          <>
            <Row>
              <Col md={7}>
                <h6 style={{ color: colors?.headerText }}>高弹联轴器: {couplingResult.model}</h6>
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
                      <td>{workCondition || '-'}</td>
                    </tr>
                    <tr>
                      <td>是否带罩壳</td>
                      <td>{hasCover ? '是' : '否'}</td>
                    </tr>
                    <tr>
                      <td>重量</td>
                      <td>{couplingResult.weight || '-'} kg</td>
                    </tr>
                    <tr>
                      <td>价格</td>
                      <td>{(couplingResult.marketPrice || 0).toLocaleString()} 元</td>
                    </tr>
                    {couplingResult.score && (
                      <tr>
                        <td>综合评分</td>
                        <td>
                          {couplingResult.score} / 100
                          <ProgressBar 
                            now={couplingResult.score} 
                            variant={
                              couplingResult.score >= 80 ? 'success' : 
                              couplingResult.score >= 60 ? 'info' : 
                              couplingResult.score >= 40 ? 'warning' : 'danger'
                            }
                            className="mt-1"
                          />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
                
                <Button 
                  variant="link" 
                  className="p-0 mt-2" 
                  onClick={() => setShowDetails(!showDetails)}
                  style={{ color: colors?.primary }}
                >
                  {showDetails ? '隐藏详细评分' : '显示详细评分'}
                </Button>
                
                {showDetails && couplingResult.scoreDetails && (
                  <Table bordered size="sm" className="mt-2" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                    <thead>
                      <tr>
                        <th>评分项目</th>
                        <th>得分</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>扭矩余量</td>
                        <td>{getScoreDetailText(couplingResult.scoreDetails.torqueMargin)}</td>
                      </tr>
                      <tr>
                        <td>推荐匹配</td>
                        <td>{getScoreDetailText(couplingResult.scoreDetails.recommendation)}</td>
                      </tr>
                      <tr>
                        <td>速度余量</td>
                        <td>{getScoreDetailText(couplingResult.scoreDetails.speedMargin)}</td>
                      </tr>
                      <tr>
                        <td>价格评分</td>
                        <td>{getScoreDetailText(couplingResult.scoreDetails.price)}</td>
                      </tr>
                      <tr>
                        <td>重量评分</td>
                        <td>{getScoreDetailText(couplingResult.scoreDetails.weight)}</td>
                      </tr>
                      {couplingResult.scoreDetails.total && (
                        <tr className="table-info">
                          <td>评分说明</td>
                          <td>{couplingResult.scoreDetails.total.explanation}</td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                )}
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
                
                {couplingResult.recommendations && couplingResult.recommendations.length > 1 && (
                  <div className="mt-3">
                    <h6 style={{ color: colors?.headerText }}>其他可选联轴器</h6>
                    <Table bordered size="sm" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                      <thead>
                        <tr>
                          <th>型号</th>
                          <th>扭矩</th>
                          <th>评分</th>
                        </tr>
                      </thead>
                      <tbody>
                        {couplingResult.recommendations.slice(1, 4).map((rec, idx) => (
                          <tr key={`rec-${idx}`}>
                            <td>{rec.model}</td>
                            <td>{rec.torque} {rec.torqueUnit || 'kN·m'}</td>
                            <td>
                              {rec.score || '-'}
                              <small className="d-block text-muted">
                                余量: {rec.torqueMargin?.toFixed(1)}%
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Col>
            </Row>
            
            {couplingResult.warning && (
              <Alert variant="info" className="mt-3">
                <i className="bi bi-info-circle me-2"></i>
                {couplingResult.warning}
              </Alert>
            )}
            
            {onReset && (
              <div className="d-flex justify-content-end mt-3">
                <Button variant="outline-primary" size="sm" onClick={onReset}>
                  <i className="bi bi-arrow-repeat me-1"></i> 重新选型
                </Button>
              </div>
            )}
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default CouplingSelectionResultComponent;