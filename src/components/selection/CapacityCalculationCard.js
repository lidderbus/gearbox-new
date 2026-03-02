// src/components/selection/CapacityCalculationCard.js
// Capacity calculation visualization card
import React from 'react';
import { Card, ProgressBar } from 'react-bootstrap';

const CapacityCalculationCard = ({ power, speed, gearboxCapacity, workCondition }) => {
  const required = power && speed && speed > 0 ? power / speed : 0;
  if (!required || !gearboxCapacity) return null;

  const margin = ((gearboxCapacity - required) / required) * 100;
  const marginRounded = Math.round(margin * 10) / 10;

  // Work condition multiplier info
  const conditionInfo = {
    'I类 (轻载)': { range: '0.8-1.0', desc: '平稳负载，如发电机组' },
    'II类 (中载)': { range: '1.0-1.2', desc: '一般工况，如商船推进' },
    'III类 (重载)': { range: '1.2-1.5', desc: '冲击负载，如拖轮/渔船' }
  };
  const currentCondition = conditionInfo[workCondition] || conditionInfo['II类 (中载)'];

  // Color based on margin
  let variant = 'success';
  if (marginRounded < 5) variant = 'danger';
  else if (marginRounded > 40) variant = 'warning';

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
        {currentCondition && (
          <small className="text-muted d-block mt-1">
            <i className="bi bi-info-circle me-1"></i>
            {workCondition || 'II类 (中载)'}: 推荐余量 {currentCondition.range}倍 — {currentCondition.desc}
          </small>
        )}
      </Card.Body>
    </Card>
  );
};

export default CapacityCalculationCard;
