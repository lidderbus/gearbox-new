// src/components/selection/MarginIndicator.js
// Capacity margin visual gauge component

import React from 'react';

const ZONES = [
  { min: 0, max: 5, color: '#dc3545', label: '不足' },
  { min: 5, max: 10, color: '#ffc107', label: '偏小' },
  { min: 10, max: 20, color: '#28a745', label: '理想' },
  { min: 20, max: 35, color: '#0d6efd', label: '充裕' },
  { min: 35, max: 50, color: '#6c757d', label: '偏大' },
];

const SCALE_MAX = 50;

/**
 * Margin Indicator - colored bar showing capacity margin zones
 * @param {{ margin: number }} props
 */
const MarginIndicator = ({ margin }) => {
  if (margin === undefined || margin === null) return null;

  const clampedMargin = Math.max(0, Math.min(margin, SCALE_MAX));
  const pointerLeft = `${(clampedMargin / SCALE_MAX) * 100}%`;

  return (
    <div style={{ marginTop: '6px', marginBottom: '4px' }}>
      {/* Zone bar */}
      <div style={{ position: 'relative', height: '14px', display: 'flex', borderRadius: '7px', overflow: 'hidden' }}>
        {ZONES.map((zone) => (
          <div
            key={zone.label}
            style={{
              flex: `${zone.max - zone.min} 0 0`,
              backgroundColor: zone.color,
              opacity: 0.75,
            }}
            title={`${zone.label}: ${zone.min}-${zone.max}%`}
          />
        ))}
        {/* Pointer */}
        <div
          style={{
            position: 'absolute',
            left: pointerLeft,
            top: '-2px',
            transform: 'translateX(-50%)',
            width: '12px',
            height: '18px',
            borderRadius: '50%',
            backgroundColor: '#fff',
            border: '2px solid #333',
            boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            zIndex: 1,
          }}
          title={`当前余量: ${margin.toFixed(1)}%`}
        />
      </div>
      {/* Scale labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#999', marginTop: '2px', paddingLeft: '2px', paddingRight: '2px' }}>
        <span>0%</span>
        <span>5%</span>
        <span>10%</span>
        <span>20%</span>
        <span>35%</span>
        <span>50%</span>
      </div>
    </div>
  );
};

export default MarginIndicator;
