// src/components/selection/NearMatchBanner.js
// Banner shown when selection returns partial/near matches instead of exact matches

import React from 'react';
import { Alert, Badge, Row, Col, ProgressBar } from 'react-bootstrap';

/**
 * Categorize failure reason into icon + short label
 */
const categorizeFailure = (reason) => {
  if (!reason) return { icon: 'bi-question-circle', label: '未知', color: 'secondary' };
  if (reason.includes('传递能力') && reason.includes('不足')) return { icon: 'bi-speedometer', label: '容量不足', color: 'danger' };
  if (reason.includes('余量') && reason.includes('低于')) return { icon: 'bi-speedometer2', label: '余量过低', color: 'warning' };
  if (reason.includes('余量') && reason.includes('超过')) return { icon: 'bi-arrow-up-circle', label: '余量过大', color: 'info' };
  if (reason.includes('推力')) return { icon: 'bi-arrow-right-circle', label: '推力不足', color: 'danger' };
  if (reason.includes('减速比') || reason.includes('偏差')) return { icon: 'bi-rulers', label: '速比偏差', color: 'warning' };
  if (reason.includes('转速')) return { icon: 'bi-activity', label: '转速超范围', color: 'danger' };
  if (reason.includes('接口')) return { icon: 'bi-plug', label: '接口不匹配', color: 'warning' };
  return { icon: 'bi-exclamation-triangle', label: '条件不满足', color: 'warning' };
};

/**
 * Calculate a "closeness" percentage — how close this near-match is to passing
 */
const getClosenessPct = (gearbox) => {
  let factors = [];

  // Capacity closeness
  if (gearbox.capacityMargin != null) {
    if (gearbox.capacityMargin < 0) {
      // Negative margin: how close to 0%
      factors.push(Math.max(0, 100 + gearbox.capacityMargin * 5)); // -20% → 0, 0% → 100
    } else if (gearbox.capacityMargin < 10) {
      // Below minimum 10%: how close to 10%
      factors.push(gearbox.capacityMargin * 10); // 0% → 0, 10% → 100
    } else if (gearbox.capacityMargin <= 50) {
      factors.push(100); // In range
    } else {
      factors.push(Math.max(0, 100 - (gearbox.capacityMargin - 50) * 2)); // Above 50%
    }
  }

  // Ratio closeness
  if (gearbox.ratioDiffPercent != null) {
    factors.push(Math.max(0, 100 - gearbox.ratioDiffPercent * 4)); // 25% diff → 0
  }

  // Thrust closeness
  if (gearbox.thrustMet === false && gearbox.thrust > 0 && gearbox.failureReason?.includes('推力')) {
    // Extract thrust requirement from failure reason
    const match = gearbox.failureReason.match(/需求\s*(\d+)/);
    if (match) {
      const required = parseFloat(match[1]);
      factors.push(Math.max(0, (gearbox.thrust / required) * 100));
    }
  }

  if (factors.length === 0) return 50; // Unknown
  return Math.round(factors.reduce((a, b) => a + b, 0) / factors.length);
};

const NearMatchBanner = ({ result, recommendations }) => {
  if (!result || result.success !== false || !recommendations?.length) return null;

  // Analyze rejection reasons
  const rejectionReasons = result.rejectionReasons || {};
  const totalRejections = Object.values(rejectionReasons).reduce((a, b) => a + b, 0);
  const topReasons = Object.entries(rejectionReasons)
    .filter(([, count]) => count > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const reasonLabels = {
    speedRange: '转速超范围',
    ratioOutOfRange: '减速比偏差过大',
    capacityTooLow: '传递能力不足',
    capacityTooHigh: '传递能力过大',
    thrustInsufficient: '推力不足',
    interfaceMismatch: '接口不匹配',
    shaftMismatch: '轴布置不匹配',
    seriesCapabilityMismatch: '系列特性不匹配',
  };

  // Calculate closeness for each recommendation
  const recCloseness = recommendations.map(r => ({
    model: r.model,
    closeness: getClosenessPct(r),
    failure: categorizeFailure(r.failureReason),
    failureReason: r.failureReason,
  }));

  const bestCloseness = Math.max(...recCloseness.map(r => r.closeness));
  const closenessVariant = bestCloseness >= 80 ? 'warning' : bestCloseness >= 50 ? 'info' : 'danger';

  return (
    <Alert variant={closenessVariant} className="mb-3">
      <div className="d-flex align-items-start">
        <i className="bi bi-search me-2 mt-1" style={{ fontSize: '1.2rem' }}></i>
        <div style={{ flex: 1 }}>
          <div className="d-flex justify-content-between align-items-center mb-1">
            <strong>
              未找到完全匹配 — 以下为最接近的 {recommendations.length} 个近似候选
            </strong>
            {bestCloseness >= 80 && (
              <Badge bg="success" className="ms-2">接近通过</Badge>
            )}
          </div>

          {/* Rejection reason summary */}
          {topReasons.length > 0 && (
            <div className="mb-2" style={{ fontSize: '0.8rem' }}>
              主要排除原因：
              {topReasons.map(([reason, count], i) => (
                <Badge key={reason} bg="outline-secondary" className="me-1 border"
                  style={{ color: '#555', fontWeight: 'normal' }}>
                  {reasonLabels[reason] || reason} ({count})
                </Badge>
              ))}
              {totalRejections > 0 && (
                <span className="text-muted ms-1">共排除 {totalRejections} 个型号</span>
              )}
            </div>
          )}

          {/* Per-recommendation closeness bars */}
          <div style={{ fontSize: '0.78rem' }}>
            {recCloseness.slice(0, 5).map((r, i) => (
              <Row key={r.model + i} className="align-items-center mb-1 g-1">
                <Col xs={2} className="text-truncate">
                  <strong>{r.model}</strong>
                </Col>
                <Col xs={4}>
                  <ProgressBar
                    now={r.closeness}
                    variant={r.closeness >= 80 ? 'success' : r.closeness >= 50 ? 'warning' : 'danger'}
                    style={{ height: 8 }}
                    label={r.closeness >= 30 ? `${r.closeness}%` : ''}
                  />
                </Col>
                <Col xs={6} className="text-muted" style={{ fontSize: '0.72rem' }}>
                  <i className={`bi ${r.failure.icon} me-1`}></i>
                  {r.failureReason
                    ? (r.failureReason.length > 60 ? r.failureReason.substring(0, 58) + '…' : r.failureReason)
                    : r.failure.label
                  }
                </Col>
              </Row>
            ))}
          </div>
        </div>
      </div>
    </Alert>
  );
};

export default NearMatchBanner;
