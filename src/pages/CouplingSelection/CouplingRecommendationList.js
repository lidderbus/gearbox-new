// src/pages/CouplingSelection/CouplingRecommendationList.js
// 联轴器推荐列表组件

import React, { useState, useMemo, useCallback } from 'react';
import { Card, Table, Badge, Button, ProgressBar, Alert, Row, Col, Collapse, Form } from 'react-bootstrap';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { getCouplingSeriesInfo } from '../../services/couplingSelectionService';
import GenericComparisonTable from '../../components/common/GenericComparisonTable';
import WeightAdjusterPanel from '../../components/common/WeightAdjusterPanel';
import { formatPrice } from '../../utils/priceFormatter';
import { getScoringWeights, ScoringMode } from '../../data/gearboxMatchingMaps';

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
  colors = {},
  isCompared = false,
  onToggleCompare,
  compareDisabled = false
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
          {onToggleCompare && (
            <Form.Check
              type="checkbox"
              checked={isCompared}
              disabled={!isCompared && compareDisabled}
              onChange={() => onToggleCompare(coupling)}
              title="勾选加入对比 (最多 4 个)"
              aria-label={`勾选 ${coupling.model} 加入对比`}
            />
          )}
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

  // M2: 评分权重透明化 — 当前应用的权重 (来自结果或默认 BALANCED)
  const inferredMode = result?.scoringMode || ScoringMode.BALANCED;
  const defaultWeights = useMemo(() => getScoringWeights(inferredMode), [inferredMode]);
  const [overrideWeights, setOverrideWeights] = useState(null);
  const activeWeights = overrideWeights || defaultWeights;

  /**
   * M2: 用 override 权重对推荐重新打分排序
   * 公式: newScore = Σ (detail.score / detail.maxScore × newWeight)
   * 不改原始 scoreDetails (保留作为对照)
   */
  const rerankedRecommendations = useMemo(() => {
    if (!result?.recommendations) return [];
    if (!overrideWeights) return result.recommendations;
    return [...result.recommendations].map(rec => {
      const det = rec.scoreDetails || {};
      const newScore = Object.keys(overrideWeights).reduce((sum, dim) => {
        const d = det[dim];
        if (!d || !d.maxScore) return sum;
        return sum + (d.score / d.maxScore) * overrideWeights[dim];
      }, 0);
      return { ...rec, score: Math.round(newScore * 10) / 10, _isReranked: true };
    }).sort((a, b) => (b.score || 0) - (a.score || 0));
  }, [result?.recommendations, overrideWeights]);

  // S5: 多选对比
  const [comparedCouplings, setComparedCouplings] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const toggleCompare = useCallback((coupling) => {
    setComparedCouplings(prev => {
      const exists = prev.find(c => c.model === coupling.model);
      if (exists) return prev.filter(c => c.model !== coupling.model);
      if (prev.length >= 4) return prev;
      return [...prev, coupling];
    });
  }, []);

  const compareColumns = useMemo(() => ([
    { key: 'series',         label: '系列',           highlightDiff: true,
      format: (_, r) => getCouplingSeriesInfo(r.model)?.name || r.series || '—' },
    { key: 'ratedTorque',    label: '额定扭矩 (kN·m)', bestPolicy: 'max' },
    { key: 'maxTorque',      label: '最大扭矩 (kN·m)', bestPolicy: 'max' },
    { key: 'torqueMargin',   label: '扭矩余量 (%)',
      format: (v) => v == null ? '—' : `${Number(v).toFixed(1)}%` },
    { key: 'maxSpeed',       label: '最大转速 (rpm)',  bestPolicy: 'max' },
    { key: 'weight',         label: '重量 (kg)',       bestPolicy: 'min' },
    { key: 'score',          label: '综合评分',         bestPolicy: 'max',
      format: (v) => v == null ? '—' : Number(v).toFixed(1) },
    { key: 'basePrice',      label: '基础价 (元)',      bestPolicy: 'min',
      format: (v) => v ? formatPrice(v) : '询价' },
    { key: 'classificationApproved', label: '船检证书', highlightDiff: true,
      format: (v) => Array.isArray(v) ? v.join(', ') : (v || '—') }
  ]), []);

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

  const { warning, calculationDetails } = result;
  const recommendations = rerankedRecommendations.length ? rerankedRecommendations : result.recommendations;
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

        {/* M2: 评分权重透明面板 */}
        <WeightAdjusterPanel
          weights={activeWeights}
          mode={inferredMode}
          onApplyWeights={(w) => setOverrideWeights(w)}
        />
        {overrideWeights && (
          <div className="mb-2 d-flex align-items-center">
            <Badge bg="warning" text="dark">已使用自定义权重重排序</Badge>
            <Button variant="link" size="sm" className="ms-2" onClick={() => setOverrideWeights(null)}>
              恢复默认排序
            </Button>
          </div>
        )}

        {/* S5: 多选对比浮动操作条 */}
        {comparedCouplings.length > 0 && (
          <Alert variant="primary" className="d-flex align-items-center justify-content-between py-2 mb-2">
            <div>
              <strong>已勾选 {comparedCouplings.length} 个候选</strong>
              <small className="text-muted ms-2">{comparedCouplings.map(c => c.model).join('、')}</small>
            </div>
            <div className="d-flex" style={{ gap: '0.5rem' }}>
              <Button
                variant="primary"
                size="sm"
                disabled={comparedCouplings.length < 2}
                onClick={() => setShowCompareModal(true)}
              >
                <i className="bi bi-columns-gap me-1"></i>对比 ({comparedCouplings.length})
              </Button>
              <Button variant="outline-secondary" size="sm" onClick={() => setComparedCouplings([])}>
                清空
              </Button>
            </div>
          </Alert>
        )}

        <GenericComparisonTable
          show={showCompareModal}
          onHide={() => setShowCompareModal(false)}
          rows={comparedCouplings}
          columns={compareColumns}
          title="联轴器型号对比"
        />

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
            isCompared={comparedCouplings.some(c => c.model === coupling.model)}
            onToggleCompare={toggleCompare}
            compareDisabled={comparedCouplings.length >= 4}
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
