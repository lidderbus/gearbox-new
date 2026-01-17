// src/pages/CouplingSelection/CouplingRecommendationList.js
// 联轴器推荐列表组件

import React, { useState, useMemo } from 'react';
import { Card, Table, Badge, Button, ProgressBar, Alert, Row, Col, Collapse } from 'react-bootstrap';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getCouplingSeriesInfo } from '../../services/couplingSelectionService';

/**
 * 获取扭矩余量状态
 */
const getTorqueMarginStatus = (margin) => {
  if (margin === undefined || margin === null) return { variant: 'secondary', text: '未知' };
  if (margin < 0) return { variant: 'danger', text: '负余量' };
  if (margin < 5) return { variant: 'warning', text: '过低' };
  if (margin > 50) return { variant: 'info', text: '偏高' };
  if (margin >= 10 && margin <= 30) return { variant: 'success', text: '理想' };
  return { variant: 'primary', text: '合适' };
};

/**
 * 获取评分等级
 */
const getScoreGrade = (score) => {
  if (score >= 85) return { variant: 'success', grade: 'A', text: '优秀' };
  if (score >= 70) return { variant: 'primary', grade: 'B', text: '良好' };
  if (score >= 55) return { variant: 'info', grade: 'C', text: '合格' };
  if (score >= 40) return { variant: 'warning', grade: 'D', text: '较差' };
  return { variant: 'danger', grade: 'F', text: '不推荐' };
};

/**
 * 单个联轴器推荐卡片
 */
const CouplingRecommendationCard = ({
  coupling,
  rank,
  isSelected,
  onSelect,
  showDetails = false,
  colors = {}
}) => {
  const [expanded, setExpanded] = useState(showDetails);
  const seriesInfo = getCouplingSeriesInfo(coupling.model);
  const marginStatus = getTorqueMarginStatus(coupling.torqueMargin);
  const scoreGrade = getScoreGrade(coupling.score);

  // 扭矩饼图数据
  const torquePieData = useMemo(() => {
    const required = coupling.requiredTorque || 0;
    const actual = coupling.torque || 0;
    if (actual < required) {
      return [
        { name: '实际扭矩', value: actual, fill: '#f28c81' },
        { name: '扭矩缺口', value: required - actual, fill: '#ffb3b3' }
      ];
    }
    return [
      { name: '所需扭矩', value: required, fill: '#82ca9d' },
      { name: '扭矩余量', value: actual - required, fill: '#8884d8' }
    ];
  }, [coupling.requiredTorque, coupling.torque]);

  return (
    <Card
      className={`mb-3 ${isSelected ? 'border-primary border-2' : ''}`}
      style={{ backgroundColor: colors.card || 'white' }}
    >
      <Card.Header className="d-flex justify-content-between align-items-center">
        <div className="d-flex align-items-center gap-2">
          {rank <= 3 && (
            <Badge bg={rank === 1 ? 'warning' : rank === 2 ? 'secondary' : 'info'} className="me-2">
              #{rank}
            </Badge>
          )}
          <strong style={{ color: seriesInfo.color }}>{coupling.model}</strong>
          <Badge bg={marginStatus.variant} pill className="ms-2">
            {marginStatus.text}
          </Badge>
        </div>
        <div className="d-flex align-items-center gap-2">
          <Badge bg={scoreGrade.variant} className="px-3">
            {scoreGrade.grade} {coupling.score}分
          </Badge>
          <Button
            variant={isSelected ? 'success' : 'outline-primary'}
            size="sm"
            onClick={() => onSelect && onSelect(coupling)}
          >
            {isSelected ? '已选择' : '选择'}
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={8}>
            <Table size="sm" borderless>
              <tbody>
                <tr>
                  <td width="35%"><strong>额定扭矩</strong></td>
                  <td>{coupling.torque?.toFixed(2)} kN·m</td>
                  <td width="35%"><strong>所需扭矩</strong></td>
                  <td>{coupling.requiredTorque?.toFixed(3)} kN·m</td>
                </tr>
                <tr>
                  <td><strong>扭矩余量</strong></td>
                  <td>
                    <span className={`text-${marginStatus.variant}`}>
                      {coupling.torqueMargin?.toFixed(1)}%
                    </span>
                  </td>
                  <td><strong>最大转速</strong></td>
                  <td>{coupling.maxSpeed} rpm</td>
                </tr>
                <tr>
                  <td><strong>重量</strong></td>
                  <td>{coupling.weight} kg</td>
                  <td><strong>市场价</strong></td>
                  <td className="text-danger fw-bold">
                    {coupling.marketPrice?.toLocaleString()} 元
                  </td>
                </tr>
              </tbody>
            </Table>

            {/* 评分进度条 */}
            <div className="mt-2">
              <small className="text-muted mb-1 d-block">综合评分</small>
              <ProgressBar style={{ height: '8px' }}>
                <ProgressBar
                  variant={scoreGrade.variant}
                  now={coupling.score}
                  key={1}
                />
              </ProgressBar>
            </div>

            {/* 系列标签 */}
            <div className="mt-2">
              <Badge
                style={{ backgroundColor: seriesInfo.color }}
                className="me-2"
              >
                {seriesInfo.name}
              </Badge>
              <small className="text-muted">{seriesInfo.description}</small>
            </div>
          </Col>
          <Col md={4}>
            <div style={{ width: '100%', height: 120 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={torquePieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={45}
                    innerRadius={25}
                  >
                    {torquePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value.toFixed(3)} kN·m`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>

        {/* 详细评分（可展开） */}
        <div className="mt-2">
          <Button
            variant="link"
            size="sm"
            onClick={() => setExpanded(!expanded)}
            className="p-0"
          >
            <i className={`bi bi-chevron-${expanded ? 'up' : 'down'} me-1`}></i>
            {expanded ? '收起评分详情' : '查看评分详情'}
          </Button>
        </div>

        <Collapse in={expanded}>
          <div className="mt-3">
            {coupling.scoreDetails && (
              <Table size="sm" bordered className="mb-0">
                <thead>
                  <tr>
                    <th>评分项</th>
                    <th>得分</th>
                    <th>满分</th>
                    <th>说明</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(coupling.scoreDetails)
                    .filter(([key]) => key !== 'total')
                    .map(([key, detail]) => (
                      <tr key={key}>
                        <td>
                          {key === 'torqueMargin' ? '扭矩余量' :
                            key === 'recommendation' ? '推荐匹配' :
                              key === 'speedMargin' ? '速度余量' :
                                key === 'price' ? '价格评分' :
                                  key === 'weight' ? '重量评分' : key}
                        </td>
                        <td>{Math.round(detail.score)}</td>
                        <td>{detail.maxScore}</td>
                        <td><small className="text-muted">{detail.explanation}</small></td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            )}
          </div>
        </Collapse>
      </Card.Body>
    </Card>
  );
};

/**
 * 联轴器推荐列表主组件
 */
const CouplingRecommendationList = ({
  result,
  selectedCoupling,
  onSelectCoupling,
  showAllResults = false,
  maxInitialDisplay = 5,
  colors = {}
}) => {
  const [showAll, setShowAll] = useState(showAllResults);

  // 没有结果时显示
  if (!result || !result.success) {
    return (
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <i className="bi bi-list-check me-2"></i>
          选型结果
        </Card.Header>
        <Card.Body>
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {result?.message || '未找到合适的联轴器，请调整选型参数'}
          </Alert>
        </Card.Body>
      </Card>
    );
  }

  const { recommendations, warning, calculationDetails } = result;
  const displayedCouplings = showAll
    ? recommendations
    : recommendations.slice(0, maxInitialDisplay);

  return (
    <Card className="shadow-sm mb-4" style={{ backgroundColor: colors.card || 'white' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-list-check me-2"></i>
            选型结果
            <Badge bg="success" className="ms-2">
              {recommendations.length} 个推荐
            </Badge>
          </span>
          {recommendations.length > maxInitialDisplay && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? '只显示前5个' : `显示全部 ${recommendations.length} 个`}
            </Button>
          )}
        </div>
      </Card.Header>
      <Card.Body>
        {/* 计算过程显示 */}
        {calculationDetails && (
          <Alert variant="info" className="mb-3">
            <small>
              <strong>计算过程：</strong>
              功率 {calculationDetails.power} kW ×
              转速 {calculationDetails.speed} rpm →
              发动机扭矩 {calculationDetails.engineTorque?.toFixed(2)} N·m ×
              K={calculationDetails.kFactor?.toFixed(2)} ×
              St={calculationDetails.stFactor?.toFixed(2)} →
              所需联轴器扭矩 {calculationDetails.requiredTorque_kNm?.toFixed(3)} kN·m
            </small>
          </Alert>
        )}

        {/* 警告信息 */}
        {warning && (
          <Alert variant={warning.includes('警告') ? 'danger' : 'warning'} className="mb-3">
            <i className="bi bi-exclamation-circle me-2"></i>
            {warning}
          </Alert>
        )}

        {/* 推荐列表 */}
        {displayedCouplings.map((coupling, index) => (
          <CouplingRecommendationCard
            key={coupling.model}
            coupling={coupling}
            rank={index + 1}
            isSelected={selectedCoupling?.model === coupling.model}
            onSelect={onSelectCoupling}
            showDetails={index === 0}
            colors={colors}
          />
        ))}

        {/* 显示更多按钮 */}
        {!showAll && recommendations.length > maxInitialDisplay && (
          <div className="text-center mt-3">
            <Button
              variant="outline-primary"
              onClick={() => setShowAll(true)}
            >
              <i className="bi bi-plus-circle me-1"></i>
              显示更多 ({recommendations.length - maxInitialDisplay} 个)
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CouplingRecommendationList;
