// src/components/selection/ScoreBreakdownCard.js
// Visual breakdown of the 7-dimension selection scoring algorithm

import React, { useMemo } from 'react';
import { Card, OverlayTrigger, Tooltip } from 'react-bootstrap';

/**
 * Calculate individual dimension scores matching selectionAlgorithm.ts
 */
const computeDimensionScores = (gearbox, allRecs, thrustRequirement, targetRatio) => {
  if (!gearbox) return null;

  const W = {
    cost: 30, ratio: 21, capacity: 12, thrust: 8,
    pkg: 5, shaft: 7, series: 9, iface: 8
  };

  // 1. Capacity — bell curve centered on 15%
  const margin = gearbox.capacityMargin ?? 0;
  const marginDev = (margin - 15) / 15;
  const capScore = W.capacity * Math.exp(-0.8 * marginDev * marginDev);

  // 2. Ratio — smooth power curve
  const ratioDiff = gearbox.ratioDiffPercent ?? 0;
  const maxRatio = 10; // DEFAULT_TOLERANCES.maxRatioDiffPercent
  const ratioFit = Math.max(0, 1 - Math.pow(ratioDiff / (maxRatio * 1.05), 1.8));
  const ratioScore = W.ratio * ratioFit;

  // 3. Thrust — continuous margin
  let thrustScore = W.thrust * 0.5;
  let thrustMarginPct = null;
  if (thrustRequirement > 0) {
    if (gearbox.thrust >= thrustRequirement) {
      thrustMarginPct = ((gearbox.thrust - thrustRequirement) / thrustRequirement) * 100;
      thrustScore = W.thrust * (0.7 + 0.3 * Math.min(1, thrustMarginPct / 20));
    } else {
      thrustScore = 0;
    }
  }

  // 4. Cost — estimate from price rank
  let costScore = W.cost * 0.5;
  if (gearbox.marketPrice > 0 && allRecs?.length > 1) {
    const prices = allRecs.filter(r => r.marketPrice > 0).map(r => r.marketPrice).sort((a, b) => a - b);
    if (prices.length > 0) {
      const rank = prices.findIndex(p => p >= gearbox.marketPrice);
      costScore = W.cost * (1 - rank / Math.max(prices.length - 1, 1));
    }
  } else if (gearbox.marketPrice > 0) {
    costScore = W.cost;
  }

  // 5-7. Package / shaft / series — use stored or estimate
  const pkgScore = gearbox.hasSpecialPackagePrice ? W.pkg : 0;
  const shaftScore = W.shaft * 0.5; // 基础分(无法从结果推断匹配度)
  const seriesScore = gearbox._seriesCapScore != null
    ? W.series * (gearbox._seriesCapScore / 10)
    : W.series * 0.5;

  const dims = [
    { key: 'ratio', label: '速比匹配', score: ratioScore, max: W.ratio, color: '#0d6efd',
      tip: ratioDiff < 0.1 ? '精确匹配' : `偏差${ratioDiff.toFixed(1)}%` },
    { key: 'cost', label: '性价比', score: costScore, max: W.cost, color: '#198754',
      tip: gearbox.marketPrice > 0 ? `¥${(gearbox.marketPrice/10000).toFixed(1)}万` : '暂无价格' },
    { key: 'capacity', label: '容量余量', score: capScore, max: W.capacity, color: '#0dcaf0',
      tip: `余量${margin.toFixed(1)}%` + (margin >= 10 && margin <= 20 ? ' (最优区间)' : '') },
    { key: 'series', label: '系列适配', score: seriesScore, max: W.series, color: '#6f42c1',
      tip: (gearbox.series || '') + '系列' },
    { key: 'thrust', label: '推力', score: thrustScore, max: W.thrust, color: '#fd7e14',
      tip: thrustMarginPct != null ? `余量${thrustMarginPct.toFixed(0)}%` : (thrustRequirement > 0 ? '数据不足' : '无要求') },
    { key: 'shaft', label: '轴布置', score: shaftScore, max: W.shaft, color: '#6c757d',
      tip: gearbox.controlType || '标准' },
    { key: 'pkg', label: '打包优惠', score: pkgScore, max: W.pkg, color: '#d63384',
      tip: gearbox.hasSpecialPackagePrice ? '有打包价' : '无' },
  ];

  const total = dims.reduce((s, d) => s + d.score, 0);
  return { dims, total, actualScore: gearbox.score || total };
};

/**
 * Ring gauge for total score
 */
const ScoreRing = ({ score, size = 64 }) => {
  const r = (size - 8) / 2;
  const circumference = 2 * Math.PI * r;
  const pct = Math.min(100, Math.max(0, score));
  const offset = circumference * (1 - pct / 100);
  const color = pct >= 85 ? '#198754' : pct >= 70 ? '#0d6efd' : pct >= 55 ? '#ffc107' : '#dc3545';

  return (
    <svg width={size} height={size} style={{ display: 'block' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e9ecef" strokeWidth="5" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
        style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      <text x={size/2} y={size/2} textAnchor="middle" dominantBaseline="central"
        fontSize="16" fontWeight="700" fill={color}>
        {Math.round(pct)}
      </text>
    </svg>
  );
};

/**
 * Single dimension bar
 */
const DimBar = ({ dim }) => {
  const pct = dim.max > 0 ? (dim.score / dim.max) * 100 : 0;
  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{dim.tip} ({dim.score.toFixed(1)}/{dim.max}分)</Tooltip>}>
      <div className="d-flex align-items-center mb-1" style={{ fontSize: '0.72rem', cursor: 'default' }}>
        <div style={{ width: 56, color: '#666', flexShrink: 0 }}>{dim.label}</div>
        <div style={{ flex: 1, height: 10, backgroundColor: '#e9ecef', borderRadius: 5, overflow: 'hidden', marginRight: 4 }}>
          <div style={{
            width: `${pct}%`, height: '100%', backgroundColor: dim.color,
            borderRadius: 5, transition: 'width 0.5s ease',
            minWidth: pct > 0 ? 3 : 0
          }} />
        </div>
        <div style={{ width: 22, textAlign: 'right', color: '#999', fontSize: '0.65rem' }}>
          {Math.round(dim.score)}
        </div>
      </div>
    </OverlayTrigger>
  );
};

const ScoreBreakdownCard = ({ selectedGearbox, allRecommendations = [], thrustRequirement = 0, targetRatio }) => {
  const breakdown = useMemo(() =>
    computeDimensionScores(selectedGearbox, allRecommendations, thrustRequirement, targetRatio),
    [selectedGearbox, allRecommendations, thrustRequirement, targetRatio]
  );

  if (!breakdown) return null;

  const { dims, actualScore } = breakdown;

  return (
    <Card className="mb-3" style={{ borderColor: '#e0e0e0' }}>
      <Card.Body className="py-2 px-3">
        <div className="d-flex align-items-start gap-3">
          {/* Left: score ring */}
          <div className="text-center" style={{ flexShrink: 0 }}>
            <ScoreRing score={actualScore} />
            <div style={{ fontSize: '0.65rem', color: '#999', marginTop: 2 }}>综合评分</div>
          </div>
          {/* Right: dimension bars */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: '0.78rem', fontWeight: 600, marginBottom: 4, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span><i className="bi bi-bar-chart-fill me-1 text-primary"></i>评分分解 <span className="text-muted" style={{ fontWeight: 400, fontSize: '0.7rem' }}>(权重总 100)</span></span>
              <OverlayTrigger placement="left" overlay={
                <Tooltip>
                  综合分由 8 维加权求和:<br/>
                  性价比 30 · 速比 21 · 容量 12<br/>
                  系列 9 · 推力 8 · 接口 8 · 轴布置 7 · 打包 5<br/>
                  各维度按高斯/幂函数曲线计算适配度,<br/>
                  非简单线性,故标签数字加和与综合分不一致。
                </Tooltip>
              }>
                <i className="bi bi-info-circle text-secondary" style={{ cursor: 'help', fontSize: '0.75rem' }}></i>
              </OverlayTrigger>
            </div>
            {dims.map(d => <DimBar key={d.key} dim={d} />)}
            <div style={{ fontSize: '0.65rem', color: '#999', marginTop: 4, paddingTop: 4, borderTop: '1px dashed #e0e0e0' }}>
              综合分 = Σ (维度权重 × 适配度), 见上方 ⓘ 提示
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ScoreBreakdownCard;
