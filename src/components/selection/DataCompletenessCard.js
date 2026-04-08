// src/components/selection/DataCompletenessCard.js
// Shows data completeness metrics for the selected gearbox

import React, { useMemo } from 'react';
import { Card, Badge, ProgressBar } from 'react-bootstrap';

const FIELDS = [
  { key: 'transferCapacity', label: '传递能力', weight: 3 },
  { key: 'ratios', label: '减速比', weight: 3 },
  { key: 'thrust', label: '推力', weight: 2 },
  { key: 'weight', label: '重量', weight: 1 },
  { key: 'dimensions', label: '外形尺寸', weight: 1 },
  { key: 'centerDistance', label: '中心距', weight: 1 },
  { key: 'price', label: '价格', weight: 2, altKeys: ['basePrice', 'marketPrice'] },
  { key: 'image', label: '图片', weight: 1, altKeys: ['imageUrl'] },
  { key: 'inputSpeedRange', label: '转速范围', weight: 2 },
  { key: 'introduction', label: '产品介绍', weight: 1 },
];

const hasValue = (gearbox, field) => {
  const keys = [field.key, ...(field.altKeys || [])];
  for (const k of keys) {
    const v = gearbox[k];
    if (v === undefined || v === null || v === '' || v === 0) continue;
    if (Array.isArray(v) && v.length === 0) continue;
    return true;
  }
  return false;
};

const DataCompletenessCard = ({ gearbox }) => {
  const stats = useMemo(() => {
    if (!gearbox) return null;

    let totalWeight = 0;
    let filledWeight = 0;
    const missing = [];

    for (const f of FIELDS) {
      totalWeight += f.weight;
      if (hasValue(gearbox, f)) {
        filledWeight += f.weight;
      } else {
        missing.push(f.label);
      }
    }

    const pct = Math.round((filledWeight / totalWeight) * 100);
    return { pct, missing, filled: FIELDS.length - missing.length, total: FIELDS.length };
  }, [gearbox]);

  if (!stats) return null;

  const variant = stats.pct >= 90 ? 'success' : stats.pct >= 70 ? 'info' : stats.pct >= 50 ? 'warning' : 'danger';

  return (
    <Card className="mb-3" style={{ borderColor: '#e0e0e0' }}>
      <Card.Body className="py-2 px-3">
        <div className="d-flex align-items-center justify-content-between mb-1">
          <div style={{ fontSize: '0.85rem' }}>
            <i className="bi bi-clipboard-data me-1 text-primary"></i>
            <strong>数据完整度</strong>
          </div>
          <Badge bg={variant}>{stats.pct}%</Badge>
        </div>
        <ProgressBar now={stats.pct} variant={variant} style={{ height: '6px', marginBottom: '4px' }} />
        <div style={{ fontSize: '0.7rem', color: '#888' }}>
          {stats.filled}/{stats.total} 项完整
          {stats.missing.length > 0 && (
            <span className="text-warning ms-1">
              缺: {stats.missing.join('、')}
            </span>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

export default DataCompletenessCard;
