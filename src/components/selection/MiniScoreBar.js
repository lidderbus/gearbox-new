// src/components/selection/MiniScoreBar.js
// Compact inline score visualization for candidate list tables

import React from 'react';

const SEGMENTS = [
  { key: 'ratio', color: '#0d6efd', weight: 21, label: '速比' },
  { key: 'cost', color: '#198754', weight: 30, label: '性价比' },
  { key: 'capacity', color: '#0dcaf0', weight: 12, label: '容量' },
  { key: 'thrust', color: '#fd7e14', weight: 8, label: '推力' },
  { key: 'other', color: '#6c757d', weight: 29, label: '其他' },
];

/**
 * Compute quick dimension scores from gearbox result fields
 * Lightweight version — no allRecs normalization needed
 */
const quickScores = (g) => {
  if (!g || !g.score) return null;
  const total = g.score;

  // Ratio: smooth power curve
  const ratioDiff = g.ratioDiffPercent ?? 0;
  const ratioFit = Math.max(0, 1 - Math.pow(ratioDiff / 10.5, 1.8));
  const ratio = 21 * ratioFit;

  // Capacity: bell curve
  const margin = g.capacityMargin ?? 15;
  const dev = (margin - 15) / 15;
  const capacity = 12 * Math.exp(-0.8 * dev * dev);

  // Thrust: continuous
  let thrust = 4;
  if (g._thrustMargin != null) {
    thrust = 8 * (0.7 + 0.3 * Math.min(1, g._thrustMargin / 20));
  } else if (g.thrustMet === true) {
    thrust = 5.6;
  } else if (g.thrustMet === false) {
    thrust = 0;
  }

  // Cost: derive from total
  const known = ratio + capacity + thrust;
  const cost = Math.max(0, Math.min(30, total - known - 16)); // ~16 for shaft+series+pkg median
  const other = Math.max(0, total - ratio - cost - capacity - thrust);

  return { ratio, cost, capacity, thrust, other, total };
};

/**
 * MiniScoreBar — stacked horizontal bar, 80px wide
 */
const MiniScoreBar = ({ gearbox, width = 80, height = 12, showNumber = true }) => {
  const scores = quickScores(gearbox);
  if (!scores) return <span style={{ color: '#ccc', fontSize: '0.7rem' }}>-</span>;

  const total = scores.total;
  const color = total >= 85 ? '#198754' : total >= 70 ? '#0d6efd' : total >= 55 ? '#ffc107' : '#dc3545';

  // Build tooltip text
  const tipParts = [];
  if (scores.ratio > 0) tipParts.push(`速比${Math.round(scores.ratio)}`);
  if (scores.cost > 0) tipParts.push(`性价比${Math.round(scores.cost)}`);
  if (scores.capacity > 0) tipParts.push(`容量${Math.round(scores.capacity)}`);
  if (scores.thrust > 0) tipParts.push(`推力${Math.round(scores.thrust)}`);
  const tip = `${Math.round(total)}分 = ${tipParts.join('+')}+其他${Math.round(scores.other)}`;

  // Segments for stacked bar
  const segs = [
    { w: scores.ratio, c: SEGMENTS[0].color },
    { w: scores.cost, c: SEGMENTS[1].color },
    { w: scores.capacity, c: SEGMENTS[2].color },
    { w: scores.thrust, c: SEGMENTS[3].color },
    { w: scores.other, c: SEGMENTS[4].color },
  ];

  return (
    <div className="d-flex align-items-center" title={tip} style={{ cursor: 'default' }}>
      <svg width={width} height={height} style={{ display: 'block', flexShrink: 0 }}>
        <rect x={0} y={0} width={width} height={height} rx={3} fill="#e9ecef" />
        {(() => {
          let x = 0;
          return segs.map((seg, i) => {
            const w = (seg.w / 100) * width;
            const el = w > 0.5 ? (
              <rect key={i} x={x} y={0} width={w} height={height}
                rx={i === 0 ? 3 : 0} fill={seg.c} opacity={0.85} />
            ) : null;
            x += w;
            return el;
          });
        })()}
      </svg>
      {showNumber && (
        <span style={{
          fontSize: '0.7rem', fontWeight: 600, color,
          marginLeft: 4, minWidth: 22, textAlign: 'right'
        }}>
          {Math.round(total)}
        </span>
      )}
    </div>
  );
};

export default MiniScoreBar;
