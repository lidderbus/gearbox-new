// src/components/CouplingSelectionResultComponent.js - 增强版本
import React, { useState } from 'react';
import { Card, Row, Col, Table, Badge, Button, Alert, ProgressBar } from 'react-bootstrap';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

/**
 * 联轴器选型结果组件 - 增强版
 * 显示多个可选联轴器并支持切换选择
 */
const CouplingSelectionResultComponent = ({
  couplingResult,
  engineTorque,
  workCondition,
  temperature,
  hasCover,
  onReset,
  onSelectCoupling, // 联轴器选择回调
  colors,
  theme = 'light'
}) => {
  // 状态初始化
  const [showDetails, setShowDetails] = useState(false);
  const [showAllOptions, setShowAllOptions] = useState(false);
  
  // 创建联轴器扭矩组成饼图数据
  const createCouplingTorquePieData = () => {
    if (!couplingResult || !couplingResult.success) return [];
    
    const requiredTorque = couplingResult.requiredTorque || 0;
    const actualTorque = couplingResult.torque || 0;
    
    // 处理可能的负扭矩余量情况
    if (actualTorque < requiredTorque) {
      return [
        { name: '实际扭矩', value: actualTorque, fill: '#f28c81' },
        { name: '扭矩缺口', value: requiredTorque - actualTorque, fill: '#ffb3b3' }
      ];
    }
    
    const margin = Math.max(0, actualTorque - requiredTorque);
    
    return [
      { name: '所需扭矩', value: requiredTorque, fill: '#82ca9d' },
      { name: '扭矩余量', value: margin, fill: '#8884d8' }
    ];
  };
  
  // 获取扭矩余量的显示类型
  const getTorqueMarginBadge = (margin) => {
    if (margin === undefined || margin === null) return null;
    
    if (margin < 0) {
      return <Badge bg="danger" className="ms-2">负余量</Badge>;
    } else if (margin < 5) {
      return <Badge bg="warning" className="ms-2">过低</Badge>;
    } else if (margin > 50) {
      return <Badge bg="warning" className="ms-2">过高</Badge>;
    } else if (margin < 10) {
      return <Badge bg="info" className="ms-2">偏低</Badge>;
    } else {
      return <Badge bg="success" className="ms-2">合适</Badge>;
    }
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

  // 获取默认显示的推荐选项数量
  const recommendationsToShow = showAllOptions ? 
    couplingResult.recommendations : 
    couplingResult.recommendations?.slice(0, Math.min(5, couplingResult.recommendations?.length || 0));

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
                        {getTorqueMarginBadge(couplingResult.torqueMargin)}
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
                <div style={{ width: '100%', height: 200, minWidth: 200, minHeight: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
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
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 style={{ color: colors?.headerText, margin: 0 }}>其他可选联轴器</h6>
                      {couplingResult.recommendations.length > 5 && (
                        <Button 
                          variant="link" 
                          size="sm"
                          onClick={() => setShowAllOptions(!showAllOptions)}
                          style={{ padding: '0', color: colors?.primary }}
                        >
                          {showAllOptions ? '只显示前5个选项' : `显示全部${couplingResult.recommendations.length}个选项`}
                        </Button>
                      )}
                    </div>
                    <Table bordered hover size="sm" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                      <thead>
                        <tr>
                          <th>型号</th>
                          <th>扭矩</th>
                          <th>评分</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recommendationsToShow.slice(1).map((rec, idx) => {
                          // 特殊标记低余量联轴器
                          const isLowMargin = rec.torqueMargin < 5;
                          const isNegativeMargin = rec.torqueMargin < 0;
                          
                          return (
                            <tr 
                              key={`rec-${idx}`} 
                              style={isNegativeMargin ? {backgroundColor: '#fff6f6'} : 
                                     isLowMargin ? {backgroundColor: '#fff9e6'} : {}}
                            >
                              <td>
                                {rec.model}
                                {isNegativeMargin && (
                                  <Badge bg="danger" style={{fontSize: '0.7em'}} className="ms-1">负余量</Badge>
                                )}
                                {!isNegativeMargin && isLowMargin && (
                                  <Badge bg="warning" style={{fontSize: '0.7em'}} className="ms-1">低余量</Badge>
                                )}
                              </td>
                              <td>{rec.torque} {rec.torqueUnit || 'kN·m'}</td>
                              <td>
                                {rec.score || '-'}
                                <small className="d-block text-muted">
                                  余量: {rec.torqueMargin?.toFixed(1)}%
                                  {rec.torqueMargin < 0 && (
                                    <span className="text-danger"> (负余量)</span>
                                  )}
                                  {rec.torqueMargin >= 0 && rec.torqueMargin < 5 && (
                                    <span className="text-warning"> (过低)</span>
                                  )}
                                </small>
                              </td>
                              <td>
                                <Button 
                                  variant={isNegativeMargin ? "outline-danger" : isLowMargin ? "outline-warning" : "outline-primary"}
                                  size="sm" 
                                  onClick={() => onSelectCoupling && onSelectCoupling(idx + 1)}
                                >
                                  选择
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                )}
              </Col>
            </Row>
            
            {couplingResult.warning && (
              <Alert variant={couplingResult.warning.includes('负值') ? 'danger' : 'info'} className="mt-3">
                <i className={`bi bi-${couplingResult.warning.includes('负值') ? 'exclamation-triangle' : 'info-circle'} me-2`}></i>
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