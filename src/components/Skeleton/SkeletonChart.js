// src/components/Skeleton/SkeletonChart.js
import React from 'react';
import './Skeleton.css';

/**
 * 图表式骨架屏 — N 根高低柱
 * @param {number} bars 柱子数, 默认 8
 * @param {number} height 高度 px, 默认 240
 */
const SkeletonChart = ({ bars = 8, height = 240, className = '', style = {} }) => {
  const heights = Array.from({ length: bars }).map(() => 30 + Math.random() * 70);
  return (
    <div
      className={`skeleton-chart ${className}`}
      style={{ height, ...style }}
      role="status"
      aria-label="正在加载图表"
    >
      {heights.map((h, i) => (
        <div
          key={i}
          className="skeleton-base skeleton-bar"
          style={{ height: `${h}%` }}
        />
      ))}
      <span className="visually-hidden">加载中…</span>
    </div>
  );
};

export default SkeletonChart;
