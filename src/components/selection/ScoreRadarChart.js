// src/components/selection/ScoreRadarChart.js
// SVG radar chart for 5-dimension gearbox scoring

import React from 'react';

const SIZE = 200;
const CENTER = SIZE / 2;
const RADIUS = 70;
const LEVELS = 5;

const DIMENSIONS = [
  { key: 'capacity', label: '传递能力' },
  { key: 'ratio', label: '减速比' },
  { key: 'price', label: '经济性' },
  { key: 'weight', label: '重量尺寸' },
  { key: 'thrust', label: '推力' },
];

/**
 * Calculate polygon point for a given dimension index and value (0-100)
 */
const getPoint = (index, value, total = DIMENSIONS.length) => {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2;
  const r = (value / 100) * RADIUS;
  return {
    x: CENTER + r * Math.cos(angle),
    y: CENTER + r * Math.sin(angle),
  };
};

/**
 * Build polygon points string from scores
 */
const buildPolygon = (scores) => {
  return DIMENSIONS.map((dim, i) => {
    const pt = getPoint(i, scores[dim.key] || 0);
    return `${pt.x},${pt.y}`;
  }).join(' ');
};

/**
 * Build grid polygon at a given level
 */
const buildGrid = (level) => {
  return DIMENSIONS.map((_, i) => {
    const pt = getPoint(i, (level / LEVELS) * 100);
    return `${pt.x},${pt.y}`;
  }).join(' ');
};

const ScoreRadarChart = ({ scores = {} }) => {
  return (
    <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
      {/* Background grid */}
      {Array.from({ length: LEVELS }, (_, i) => (
        <polygon
          key={`grid-${i}`}
          points={buildGrid(i + 1)}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth="0.5"
        />
      ))}

      {/* Axis lines */}
      {DIMENSIONS.map((_, i) => {
        const pt = getPoint(i, 100);
        return (
          <line
            key={`axis-${i}`}
            x1={CENTER}
            y1={CENTER}
            x2={pt.x}
            y2={pt.y}
            stroke="#e0e0e0"
            strokeWidth="0.5"
          />
        );
      })}

      {/* Data polygon */}
      <polygon
        points={buildPolygon(scores)}
        fill="rgba(40, 167, 69, 0.25)"
        stroke="#28a745"
        strokeWidth="1.5"
      />

      {/* Data points */}
      {DIMENSIONS.map((dim, i) => {
        const pt = getPoint(i, scores[dim.key] || 0);
        return (
          <circle
            key={`point-${i}`}
            cx={pt.x}
            cy={pt.y}
            r="3"
            fill="#28a745"
            stroke="#fff"
            strokeWidth="1"
          />
        );
      })}

      {/* Labels */}
      {DIMENSIONS.map((dim, i) => {
        const pt = getPoint(i, 120);
        return (
          <text
            key={`label-${i}`}
            x={pt.x}
            y={pt.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize="10"
            fill="#666"
          >
            {dim.label}
          </text>
        );
      })}
    </svg>
  );
};

export default ScoreRadarChart;
