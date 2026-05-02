// src/components/Skeleton/SkeletonTable.js
import React from 'react';
import './Skeleton.css';

/**
 * 表格式骨架屏 — N 行 × M 列
 * @param {number} rows 行数, 默认 5
 * @param {number} cols 列数, 默认 4
 */
const SkeletonTable = ({ rows = 5, cols = 4, className = '', style = {} }) => (
  <div
    className={`skeleton-table ${className}`}
    style={style}
    role="status"
    aria-label="正在加载表格数据"
  >
    {Array.from({ length: rows }).map((_, r) => (
      <div key={r} className="skeleton-table-row">
        {Array.from({ length: cols }).map((__, c) => (
          <div
            key={c}
            className="skeleton-base skeleton-table-cell"
            style={{ flex: c === 0 ? 2 : 1 }}
          />
        ))}
      </div>
    ))}
    <span className="visually-hidden">加载中…</span>
  </div>
);

export default SkeletonTable;
