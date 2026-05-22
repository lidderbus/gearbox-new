// src/components/selection/StructuralFormFilter.js
// GW 系列结构形式双层 chip 过滤器
//
// 上层: 4 个结构桶 (同中心/垂直异中心/水平异中心/角向异中心) — 点击一键勾选/取消该桶下所有子系列
// 下层: 6 个子系列 (GWC/GWL/GWS/GWK/GWH/GWD) — 多选切换，结构桶按勾选数量呈 all/some/none

import React from 'react';
import { Badge, Button, ButtonGroup, OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';
import {
  STRUCTURAL_BUCKETS,
  STRUCTURAL_BUCKET_LIST,
  GW_SUB_SERIES_LIST,
  GW_SUB_SERIES_META,
  getBucketStates,
} from '../../utils/gwStructuralForm';
import { BucketIcon, StructuralIconLegend } from './StructuralFormIcons';

/**
 * @param {Object} props
 * @param {string[]} props.value 当前选中的子系列前缀（空数组 = 不限制）
 * @param {(subSeries: string[]) => void} props.onChange 选中变化回调
 * @param {{ [subSeries: string]: number }} [props.counts] 每个子系列当前候选数量（可选）
 * @param {boolean} [props.compact] 紧凑模式（结果页用）
 * @param {string} [props.title] 标题文字
 */
const StructuralFormFilter = ({
  value = [],
  onChange,
  counts = null,
  compact = false,
  title = 'GW 子系列结构形式',
}) => {
  const selected = new Set(value || []);
  const bucketStates = getBucketStates(value);
  const isAll = !value || value.length === 0;

  const handleClearAll = () => onChange([]);

  const handleToggleBucket = (bucket) => {
    const members = STRUCTURAL_BUCKETS[bucket] || [];
    const state = bucketStates[bucket];
    const next = new Set(selected);
    if (state === 'all') {
      // 全选状态 → 取消该桶下所有子系列
      members.forEach((m) => next.delete(m));
    } else {
      // 部分或未选 → 勾选该桶下全部子系列
      members.forEach((m) => next.add(m));
    }
    onChange(Array.from(next));
  };

  const handleToggleSub = (sub) => {
    const next = new Set(selected);
    if (next.has(sub)) next.delete(sub);
    else next.add(sub);
    onChange(Array.from(next));
  };

  const renderBucketBtn = (bucket) => {
    const state = bucketStates[bucket];
    const variant = state === 'all'
      ? 'primary'
      : state === 'some'
        ? 'info'
        : 'outline-secondary';
    const indicator = state === 'all' ? '✓' : state === 'some' ? '◐' : '';

    // 悬停 popover: 放大示意图 + 描述
    const popover = (
      <Popover id={`pop-${bucket}`} style={{ maxWidth: 240 }}>
        <Popover.Header as="div" className="py-1 px-2 d-flex align-items-center" style={{ fontSize: '0.85rem' }}>
          <span className="me-2" style={{ color: '#0d6efd' }}>
            <BucketIcon bucket={bucket} size={32} />
          </span>
          <strong>{bucket}</strong>
        </Popover.Header>
        <Popover.Body className="py-2 px-2" style={{ fontSize: '0.8rem' }}>
          <div className="mb-1">包含子系列: {STRUCTURAL_BUCKETS[bucket].join(' · ')}</div>
          <StructuralIconLegend />
        </Popover.Body>
      </Popover>
    );

    return (
      <OverlayTrigger key={bucket} placement="top" overlay={popover} delay={{ show: 250, hide: 100 }}>
        <Button
          size="sm"
          variant={variant}
          onClick={() => handleToggleBucket(bucket)}
          className="me-1 mb-1 d-inline-flex align-items-center"
        >
          {indicator && <span className="me-1">{indicator}</span>}
          <span className="me-1 d-inline-flex" style={{ lineHeight: 0 }}>
            <BucketIcon bucket={bucket} size={16} />
          </span>
          {bucket}
        </Button>
      </OverlayTrigger>
    );
  };

  const renderSubBtn = (sub) => {
    const meta = GW_SUB_SERIES_META[sub];
    const isSelected = selected.has(sub);
    const count = counts ? counts[sub] : null;
    const countSuffix = count != null ? ` (${count})` : '';

    const btn = (
      <Button
        key={sub}
        size="sm"
        variant={isSelected ? 'success' : 'outline-success'}
        onClick={() => handleToggleSub(sub)}
        className="me-1 mb-1 d-inline-flex align-items-center"
        disabled={count === 0}
      >
        {meta && (
          <span className="me-1 d-inline-flex" style={{ lineHeight: 0, opacity: 0.85 }}>
            <BucketIcon bucket={meta.bucket} size={14} />
          </span>
        )}
        {sub}
        {countSuffix}
      </Button>
    );

    if (!meta) return btn;
    return (
      <OverlayTrigger
        key={sub}
        placement="top"
        overlay={<Tooltip id={`tt-${sub}`}>{meta.desc}</Tooltip>}
      >
        {btn}
      </OverlayTrigger>
    );
  };

  return (
    <div className={`structural-form-filter ${compact ? 'compact' : ''}`}>
      {!compact && (
        <>
          <div className="mb-1 d-flex align-items-center justify-content-between flex-wrap">
            <small className="text-muted">
              <i className="bi bi-funnel me-1"></i>
              {title}
              {!isAll && (
                <Badge bg="secondary" className="ms-2">
                  已选 {value.length}/{GW_SUB_SERIES_LIST.length}
                </Badge>
              )}
            </small>
            {!isAll && (
              <Button size="sm" variant="link" onClick={handleClearAll} className="p-0 ms-2">
                清除筛选
              </Button>
            )}
          </div>
          <div className="mb-2">
            <StructuralIconLegend />
          </div>
        </>
      )}

      <div className="mb-1">
        <small className="text-muted me-2">结构形式:</small>
        <ButtonGroup size="sm" className="me-2 flex-wrap">
          {STRUCTURAL_BUCKET_LIST.map(renderBucketBtn)}
        </ButtonGroup>
        {compact && !isAll && (
          <Button size="sm" variant="link" onClick={handleClearAll} className="p-0">
            清除
          </Button>
        )}
      </div>

      <div>
        <small className="text-muted me-2">子系列:</small>
        <ButtonGroup size="sm" className="flex-wrap">
          {GW_SUB_SERIES_LIST.map(renderSubBtn)}
        </ButtonGroup>
      </div>
    </div>
  );
};

export default StructuralFormFilter;
