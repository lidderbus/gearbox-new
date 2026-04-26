// src/components/common/GenericComparisonTable.js
// 通用多型号对比表格 — 支持任意列配置 + 自动差异高亮 + Modal 容器
// 用于备用泵 / 联轴器多选对比

import React, { useMemo } from 'react';
import { Table, Modal, Button, Badge } from 'react-bootstrap';

/**
 * @typedef {Object} ComparisonColumn
 * @property {string} key - 行对象上的字段名（或自定义 accessor 返回值绑定的占位 key）
 * @property {string} label - 表头文案
 * @property {(row:Object) => any} [accessor] - 自定义取值函数 (优先于 key)
 * @property {(value:any) => any} [format]   - 自定义渲染（返回 ReactNode 或字符串）
 * @property {'min'|'max'|null} [bestPolicy] - 标记最优值（'min' 越小越好 / 'max' 越大越好）
 * @property {boolean} [highlightDiff]       - true 时不同值会用底色提示
 */

const valueOf = (col, row) => (col.accessor ? col.accessor(row) : row[col.key]);

const isNumeric = (v) => typeof v === 'number' && !Number.isNaN(v);

/**
 * 计算每列最优值（用于高亮）
 */
function computeBestValues(rows, columns) {
  const out = {};
  columns.forEach(col => {
    if (!col.bestPolicy) return;
    const vals = rows.map(r => valueOf(col, r)).filter(isNumeric);
    if (!vals.length) return;
    out[col.key] = col.bestPolicy === 'min' ? Math.min(...vals) : Math.max(...vals);
  });
  return out;
}

/**
 * 内联对比表（不带 Modal 包装）
 */
export const ComparisonTableBody = ({ rows, columns, highlightDiffs = true }) => {
  const best = useMemo(() => computeBestValues(rows, columns), [rows, columns]);

  // 找出 columns 中"行内不同值"的列（支持高亮"差异"）
  const diffColumnKeys = useMemo(() => {
    if (!highlightDiffs || rows.length < 2) return new Set();
    const set = new Set();
    columns.forEach(col => {
      if (!col.highlightDiff) return;
      const vals = rows.map(r => JSON.stringify(valueOf(col, r) ?? null));
      const uniq = new Set(vals);
      if (uniq.size > 1) set.add(col.key);
    });
    return set;
  }, [rows, columns, highlightDiffs]);

  if (!rows || rows.length === 0) {
    return <div className="text-muted small">尚未勾选任何对比项</div>;
  }

  return (
    <Table bordered hover responsive size="sm" className="mb-0">
      <thead>
        <tr>
          <th style={{ minWidth: 110 }}>项目</th>
          {rows.map((r, i) => (
            <th key={i}><strong>{r.model || r.name || `候选${i + 1}`}</strong></th>
          ))}
        </tr>
      </thead>
      <tbody>
        {columns.map(col => (
          <tr key={col.key}>
            <td className="text-muted">{col.label}</td>
            {rows.map((r, i) => {
              const v = valueOf(col, r);
              const isBest = col.bestPolicy && isNumeric(v) && v === best[col.key];
              const isDiff = diffColumnKeys.has(col.key);
              const cellStyle = {};
              if (isBest) {
                cellStyle.color = '#198754';
                cellStyle.fontWeight = 'bold';
              } else if (isDiff) {
                cellStyle.backgroundColor = 'rgba(255, 193, 7, 0.08)';
              }
              return (
                <td key={i} style={cellStyle}>
                  {col.format ? col.format(v, r) : (v == null || v === '' ? '—' : v)}
                  {isBest && (
                    <Badge bg="success" className="ms-1" style={{ fontSize: '0.6em' }}>最优</Badge>
                  )}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

/**
 * 弹窗版对比表（带遮罩+关闭按钮+尺寸 lg）
 */
const GenericComparisonTable = ({
  show,
  onHide,
  rows = [],
  columns = [],
  title = '型号对比',
  highlightDiffs = true
}) => (
  <Modal show={show} onHide={onHide} size="lg" scrollable>
    <Modal.Header closeButton>
      <Modal.Title>
        <i className="bi bi-columns-gap me-2"></i>
        {title}
        <Badge bg="secondary" className="ms-2">{rows.length} 项</Badge>
      </Modal.Title>
    </Modal.Header>
    <Modal.Body>
      <ComparisonTableBody rows={rows} columns={columns} highlightDiffs={highlightDiffs} />
    </Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onHide}>关闭</Button>
    </Modal.Footer>
  </Modal>
);

export default GenericComparisonTable;
