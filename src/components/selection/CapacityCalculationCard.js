// src/components/selection/CapacityCalculationCard.js
// Capacity calculation visualization card
import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';

const CapacityCalculationCard = ({ power, speed, gearboxCapacity }) => {
  const required = power && speed && speed > 0 ? power / speed : 0;
  if (!required || !gearboxCapacity) return null;

  const margin = ((gearboxCapacity - required) / required) * 100;
  const marginRounded = Math.round(margin * 10) / 10;

  // 手册传递能力已含安全系数：齿轮箱能力 ≥ 所需能力即满足要求；不再叠加联轴器 K 因子的"推荐余量"
  let variant = 'success';
  if (marginRounded < 0) variant = 'danger';

  // Cap progress bar at 100%
  const progressValue = Math.min(Math.max(marginRounded, 0), 100);

  return (
    <Card className="mb-3 border-0" style={{ backgroundColor: '#f0f7ff' }}>
      <Card.Body className="py-2 px-3">
        <small className="text-muted d-block mb-2">
          <i className="bi bi-calculator me-1"></i>传递能力计算
        </small>
        <div className="mb-1" style={{ fontSize: '0.85rem' }}>
          <span className="text-muted">所需能力 = </span>
          <strong>{power}</strong> kW <span className="text-muted">/</span> <strong>{speed}</strong> rpm
          <span className="text-muted"> = </span>
          <strong>{required.toFixed(6)}</strong> kW/rpm
        </div>
        <div className="mb-1" style={{ fontSize: '0.85rem' }}>
          <span className="text-muted">齿轮箱能力 = </span>
          <strong>{gearboxCapacity.toFixed(6)}</strong> kW/rpm
        </div>
        <div className="d-flex align-items-center gap-2 mt-2">
          <small className="text-muted text-nowrap">余量</small>
          <ProgressBar
            now={progressValue}
            variant={variant}
            className="flex-grow-1"
            style={{ height: '12px' }}
            label={`${marginRounded}%`}
          />
        </div>
        <small className="text-muted d-block mt-1">
          <i className="bi bi-info-circle me-1"></i>
          齿轮箱能力 ≥ 所需能力即满足要求（手册传递能力已含安全系数）
        </small>
      </Card.Body>
    </Card>
  );
};

export default CapacityCalculationCard;
