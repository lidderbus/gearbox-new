// src/components/Skeleton/SkeletonCard.js
import React from 'react';
import './Skeleton.css';

/**
 * 卡片式骨架屏 — 顶部标题 + N 行内容
 * @param {number} lines 内容行数, 默认 3
 * @param {string} className 额外 class
 */
const SkeletonCard = ({ lines = 3, className = '', style = {} }) => (
  <div
    className={`skeleton-card ${className}`}
    style={style}
    role="status"
    aria-label="正在加载"
  >
    <div className="skeleton-base skeleton-line lg" style={{ width: '60%' }} />
    {Array.from({ length: lines }).map((_, i) => (
      <div
        key={i}
        className="skeleton-base skeleton-line"
        style={{ width: `${90 - i * 10}%` }}
      />
    ))}
    <span className="visually-hidden">加载中…</span>
  </div>
);

export default SkeletonCard;
