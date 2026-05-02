// src/components/common/VirtualizedTable.js
// C1: 通用虚拟化表格 — 长列表 (>100 行) 性能优化基础设施
//
// 用法:
//   <VirtualizedTable
//     items={696 个齿轮箱}
//     rowHeight={36}
//     viewportHeight={540}
//     headers={[{ key, label, width }, ...]}
//     renderCell={(item, key) => 单元格内容}
//     virtualizationThreshold={100}     // 少于此项数直接全量渲染保留 a11y
//   />
//
// 实现:
//  - 当 items.length < virtualizationThreshold: 直接 <table> 全量渲染 (保留 table semantics + a11y)
//  - 当 items.length >= virtualizationThreshold: 切换为 div + react-window FixedSizeList
//    (牺牲一些 table semantics 换性能, 但仍显式 role="table"/role="row"/role="cell" 以保留 a11y)

import React, { useMemo } from 'react';
import { FixedSizeList } from 'react-window';

const DEFAULT_THRESHOLD = 100;

const inlineCellStyle = (width) => ({
  flex: width ? `0 0 ${width}px` : '1 1 auto',
  padding: '6px 12px',
  borderBottom: '1px solid #e8eaed',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
});

const VirtualRow = ({ index, style, data }) => {
  const { items, headers, renderCell, getRowKey } = data;
  const item = items[index];
  return (
    <div style={{ ...style, display: 'flex', alignItems: 'stretch', backgroundColor: index % 2 === 0 ? '#fff' : '#fafbfc' }} role="row" data-row-index={index} data-testid={`vrow-${index}`}>
      {headers.map(h => (
        <div key={h.key} style={inlineCellStyle(h.width)} role="cell" data-cell-key={h.key}>
          {renderCell ? renderCell(item, h.key, index) : item[h.key]}
        </div>
      ))}
    </div>
  );
};

const VirtualizedTable = ({
  items = [],
  headers = [],
  rowHeight = 36,
  viewportHeight = 540,
  renderCell,
  getRowKey = (item, idx) => item?.id ?? item?.key ?? `r-${idx}`,
  virtualizationThreshold = DEFAULT_THRESHOLD,
  className = '',
  emptyText = '无数据'
}) => {
  const useVirtualization = items.length >= virtualizationThreshold;

  const rowItemData = useMemo(() => ({ items, headers, renderCell, getRowKey }),
    [items, headers, renderCell, getRowKey]);

  if (items.length === 0) {
    return (
      <div className={className} role="table" aria-label="virtualized-table-empty">
        <div className="text-center text-muted py-4" data-testid="vt-empty">{emptyText}</div>
      </div>
    );
  }

  // 非虚拟化路径: 标准 <table>
  if (!useVirtualization) {
    return (
      <div className={className} role="region" aria-label="data-table">
        <table className="table table-sm table-hover mb-0" data-testid="vt-fulltable">
          <thead className="bg-light">
            <tr>
              {headers.map(h => (
                <th key={h.key} style={h.width ? { width: h.width } : undefined}>{h.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((item, idx) => (
              <tr key={getRowKey(item, idx)} data-testid={`vt-row-${idx}`}>
                {headers.map(h => (
                  <td key={h.key} data-cell-key={h.key}>
                    {renderCell ? renderCell(item, h.key, idx) : item[h.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  // 虚拟化路径: div + FixedSizeList
  return (
    <div className={className} role="table" aria-label="virtualized-table" aria-rowcount={items.length}>
      {/* 表头 */}
      <div style={{ display: 'flex', backgroundColor: '#f1f3f5', borderBottom: '2px solid #dee2e6', fontWeight: 600 }} role="row">
        {headers.map(h => (
          <div key={h.key} style={inlineCellStyle(h.width)} role="columnheader">
            {h.label}
          </div>
        ))}
      </div>
      <FixedSizeList
        height={viewportHeight}
        itemCount={items.length}
        itemSize={rowHeight}
        itemData={rowItemData}
        overscanCount={6}
        data-testid="vt-window"
      >
        {VirtualRow}
      </FixedSizeList>
      <div className="px-2 py-1 text-muted" style={{ fontSize: '0.78em' }}>
        共 {items.length} 行 · 已启用虚拟滚动 (阈值 {virtualizationThreshold} 行)
      </div>
    </div>
  );
};

export default VirtualizedTable;
