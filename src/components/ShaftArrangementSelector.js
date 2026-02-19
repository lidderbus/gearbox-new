// src/components/ShaftArrangementSelector.js
// 轴布置选择器组件 — 卡片式同心/异心选择 + 偏置方向二级选择

import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { AXIS_ALIGNMENT_OPTIONS, OFFSET_DIRECTION_OPTIONS, REVERSING_FUNCTION_OPTIONS } from '../config/shaftArrangementConfig';

/**
 * 轴布置示意图 (内联SVG)
 */
const ShaftDiagram = ({ type, size = 48 }) => {
  const s = size;
  const half = s / 2;

  const diagrams = {
    concentric: (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <line x1="4" y1={half} x2={s - 4} y2={half} stroke="#666" strokeWidth="2" />
        <circle cx={s * 0.25} cy={half} r="6" fill="#4a90d9" stroke="#2c5f9e" strokeWidth="1.5" />
        <circle cx={s * 0.75} cy={half} r="6" fill="#e8a838" stroke="#c08520" strokeWidth="1.5" />
        <text x={half} y={s - 2} textAnchor="middle" fontSize="7" fill="#888">同心</text>
      </svg>
    ),
    'horizontal-offset': (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <line x1="4" y1={half - 6} x2={half} y2={half - 6} stroke="#666" strokeWidth="2" />
        <line x1={half} y1={half - 6} x2={half} y2={half + 6} stroke="#666" strokeWidth="2" />
        <line x1={half} y1={half + 6} x2={s - 4} y2={half + 6} stroke="#666" strokeWidth="2" />
        <circle cx={s * 0.2} cy={half - 6} r="5" fill="#4a90d9" stroke="#2c5f9e" strokeWidth="1.5" />
        <circle cx={s * 0.8} cy={half + 6} r="5" fill="#e8a838" stroke="#c08520" strokeWidth="1.5" />
        <text x={half} y={s - 2} textAnchor="middle" fontSize="7" fill="#888">水平</text>
      </svg>
    ),
    'vertical-offset': (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <line x1={half} y1="6" x2={half} y2={half} stroke="#666" strokeWidth="2" />
        <line x1={half} y1={half} x2={half} y2={s - 10} stroke="#666" strokeWidth="2" />
        <circle cx={half} cy="10" r="5" fill="#4a90d9" stroke="#2c5f9e" strokeWidth="1.5" />
        <circle cx={half} cy={s - 14} r="5" fill="#e8a838" stroke="#c08520" strokeWidth="1.5" />
        <text x={half} y={s - 2} textAnchor="middle" fontSize="7" fill="#888">垂直</text>
      </svg>
    ),
    'diagonal-offset': (
      <svg width={s} height={s} viewBox={`0 0 ${s} ${s}`}>
        <line x1="8" y1="10" x2={half} y2={half} stroke="#666" strokeWidth="2" />
        <line x1={half} y1={half} x2={s - 8} y2={s - 14} stroke="#666" strokeWidth="2" />
        <circle cx="10" cy="12" r="5" fill="#4a90d9" stroke="#2c5f9e" strokeWidth="1.5" />
        <circle cx={s - 10} cy={s - 16} r="5" fill="#e8a838" stroke="#c08520" strokeWidth="1.5" />
        <text x={half} y={s - 2} textAnchor="middle" fontSize="7" fill="#888">角向</text>
      </svg>
    )
  };

  return diagrams[type] || null;
};

/**
 * 轴布置选择器组件
 *
 * @param {Object} props
 * @param {{ axisAlignment: string, offsetDirection: string, reversingFunction: string }} props.value - 当前值
 * @param {Function} props.onChange - 值变更回调
 * @param {Object} props.colors - 主题颜色
 * @param {string} props.gearboxType - 当前选择的齿轮箱类型
 * @param {boolean} props.disabled - 是否禁用
 */
const ShaftArrangementSelector = ({
  value = { axisAlignment: 'any', offsetDirection: 'any', reversingFunction: 'any' },
  onChange,
  colors = {},
  gearboxType = '',
  disabled = false
}) => {
  const isGW = gearboxType === 'GW' || gearboxType === 'auto';
  const isEccentric = value.axisAlignment === 'eccentric';

  const handleReversingChange = (reversingFunction) => {
    if (disabled) return;
    onChange({
      ...value,
      reversingFunction
    });
  };

  const handleAlignmentChange = (alignment) => {
    if (disabled) return;
    onChange({
      ...value,
      axisAlignment: alignment,
      offsetDirection: alignment === 'eccentric' ? (value.offsetDirection || 'any') : 'any'
    });
  };

  const handleDirectionChange = (direction) => {
    if (disabled) return;
    onChange({
      ...value,
      offsetDirection: direction
    });
  };

  // 非GW系列提示
  if (!isGW) {
    return (
      <div style={{
        padding: '12px 16px',
        backgroundColor: colors.inputBg || '#f8f9fa',
        borderRadius: '6px',
        border: `1px solid ${colors.border || '#dee2e6'}`,
        color: colors.muted || '#6c757d',
        fontSize: '0.9rem'
      }}>
        <i className="bi bi-info-circle me-2"></i>
        {gearboxType} 系列固定为水平偏置布置，无需选择轴布置方式
      </div>
    );
  }

  const cardStyle = (isSelected) => ({
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: `2px solid ${isSelected ? '#0d6efd' : (colors.border || '#dee2e6')}`,
    backgroundColor: isSelected ? (colors.card === '#2d3748' ? '#2d4a6e' : '#e8f0fe') : (colors.card || '#fff'),
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1
  });

  const directionCardStyle = (isSelected) => ({
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: `2px solid ${isSelected ? '#198754' : (colors.border || '#dee2e6')}`,
    backgroundColor: isSelected ? (colors.card === '#2d3748' ? '#2d4a3e' : '#d4edda') : (colors.card || '#fff'),
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    padding: '8px 12px'
  });

  const reversingCardStyle = (isSelected) => ({
    cursor: disabled ? 'not-allowed' : 'pointer',
    border: `2px solid ${isSelected ? '#6f42c1' : (colors.border || '#dee2e6')}`,
    backgroundColor: isSelected ? (colors.card === '#2d3748' ? '#3d2d5e' : '#f0e6ff') : (colors.card || '#fff'),
    borderRadius: '6px',
    transition: 'all 0.2s ease',
    opacity: disabled ? 0.6 : 1,
    padding: '8px 12px'
  });

  return (
    <div>
      {/* 倒顺功能选择 */}
      <div style={{
        padding: '10px',
        backgroundColor: colors.inputBg || '#f8f9fa',
        borderRadius: '6px',
        border: `1px solid ${colors.border || '#dee2e6'}`,
        marginBottom: '8px'
      }}>
        <div style={{ fontSize: '0.8rem', color: colors.muted || '#6c757d', marginBottom: '8px' }}>
          <i className="bi bi-arrow-left-right me-1"></i>
          倒顺功能:
        </div>
        <Row className="g-2">
          {REVERSING_FUNCTION_OPTIONS.map(opt => (
            <Col key={opt.value} xs={4}>
              <div
                style={reversingCardStyle(value.reversingFunction === opt.value)}
                onClick={() => handleReversingChange(opt.value)}
                role="button"
                tabIndex={0}
                aria-label={opt.label}
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleReversingChange(opt.value); }}
              >
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    fontSize: '0.85rem',
                    fontWeight: value.reversingFunction === opt.value ? 'bold' : 'normal',
                    color: colors.text || '#212529'
                  }}>
                    {opt.label}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: colors.muted || '#6c757d', marginTop: '2px' }}>
                    {opt.description}
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
      </div>

      {/* 第一层: 同心/异心选择 */}
      <Row className="g-2 mb-2">
        {AXIS_ALIGNMENT_OPTIONS.map(opt => (
          <Col key={opt.value} xs={4}>
            <div
              style={cardStyle(value.axisAlignment === opt.value)}
              onClick={() => handleAlignmentChange(opt.value)}
              role="button"
              tabIndex={0}
              aria-label={opt.label}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleAlignmentChange(opt.value); }}
            >
              <div style={{ padding: '10px 8px', textAlign: 'center' }}>
                {opt.value === 'concentric' && <ShaftDiagram type="concentric" size={44} />}
                {opt.value === 'eccentric' && <ShaftDiagram type="horizontal-offset" size={44} />}
                {opt.value === 'any' && (
                  <div style={{ height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <i className="bi bi-arrows-move" style={{ fontSize: '1.5rem', color: colors.muted || '#6c757d' }}></i>
                  </div>
                )}
                <div style={{
                  fontSize: '0.85rem',
                  fontWeight: value.axisAlignment === opt.value ? 'bold' : 'normal',
                  color: colors.text || '#212529',
                  marginTop: '4px'
                }}>
                  {opt.label}
                </div>
                <div style={{ fontSize: '0.75rem', color: colors.muted || '#6c757d', marginTop: '2px' }}>
                  {opt.value === 'any' && '自动匹配'}
                  {opt.value === 'concentric' && 'GWC/GWL'}
                  {opt.value === 'eccentric' && 'GWS/D/H/K'}
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      {/* 第二层: 异心时展开偏置方向选择 */}
      {isEccentric && (
        <div style={{
          padding: '10px',
          backgroundColor: colors.inputBg || '#f8f9fa',
          borderRadius: '6px',
          border: `1px solid ${colors.border || '#dee2e6'}`
        }}>
          <div style={{ fontSize: '0.8rem', color: colors.muted || '#6c757d', marginBottom: '8px' }}>
            <i className="bi bi-arrow-return-right me-1"></i>
            选择偏置方向:
          </div>
          <Row className="g-2">
            {OFFSET_DIRECTION_OPTIONS.map(opt => (
              <Col key={opt.value} xs={6} sm={4} lg={true}>
                <div
                  style={directionCardStyle(value.offsetDirection === opt.value)}
                  onClick={() => handleDirectionChange(opt.value)}
                  role="button"
                  tabIndex={0}
                  aria-label={opt.label}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleDirectionChange(opt.value); }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    {opt.value !== 'any' && <ShaftDiagram type={opt.value} size={32} />}
                    {opt.value === 'any' && (
                      <i className="bi bi-arrows-move" style={{ fontSize: '1rem', color: colors.muted || '#6c757d' }}></i>
                    )}
                    <div>
                      <div style={{
                        fontSize: '0.8rem',
                        fontWeight: value.offsetDirection === opt.value ? 'bold' : 'normal',
                        color: colors.text || '#212529'
                      }}>
                        {opt.label}
                      </div>
                      {opt.subSeries && opt.subSeries.length > 0 && (
                        <div style={{ fontSize: '0.7rem', color: colors.muted || '#6c757d' }}>
                          {opt.subSeries.join('/')}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* 同心布置说明 */}
      {value.axisAlignment === 'concentric' && (
        <div style={{
          padding: '8px 12px',
          backgroundColor: colors.inputBg || '#f8f9fa',
          borderRadius: '6px',
          border: `1px solid ${colors.border || '#dee2e6'}`,
          fontSize: '0.8rem',
          color: colors.muted || '#6c757d'
        }}>
          <i className="bi bi-info-circle me-1"></i>
          同心布置: 输入轴与输出轴同轴线，匹配GWC/GWL子系列
        </div>
      )}
    </div>
  );
};

/**
 * 轴布置信息徽章 — 用于结果卡片展示
 *
 * @param {Object} props
 * @param {string} props.model - 齿轮箱型号
 */
export const ShaftArrangementBadge = ({ model }) => {
  const { deriveShaftArrangement: derive } = require('../config/shaftArrangementConfig');
  const info = derive(model);

  if (!info) return null;

  const bgMap = {
    'concentric': 'primary',
    'horizontal-offset': 'info',
    'vertical-offset': 'warning',
    'diagonal-offset': 'secondary',
    'unknown': 'light'
  };

  const textMap = {
    'concentric': undefined,
    'horizontal-offset': undefined,
    'vertical-offset': 'dark',
    'diagonal-offset': undefined,
    'unknown': 'dark'
  };

  const arrangementLabels = {
    'concentric': '同心',
    'horizontal-offset': '水平偏置',
    'vertical-offset': '垂直偏置',
    'diagonal-offset': '角向偏置',
    'unknown': '未知'
  };

  const reversingLabels = {
    'with-reverse': '倒顺',
    'no-reverse': '离合'
  };

  const transmissionLabels = {
    '1-stage': '1级传动',
    '2-stage': '2级传动'
  };

  const rotationLabels = {
    'same': '同向旋转',
    'reverse': '反向旋转'
  };

  return (
    <span className="d-inline-flex gap-1 flex-wrap">
      {info.subSeries && (
        <Badge bg="outline-secondary" style={{
          border: '1px solid #6c757d',
          color: '#6c757d',
          backgroundColor: 'transparent',
          fontSize: '0.75em'
        }}>
          {info.subSeries}
        </Badge>
      )}
      <Badge
        bg={bgMap[info.shaftArrangement] || 'secondary'}
        text={textMap[info.shaftArrangement]}
        style={{ fontSize: '0.75em' }}
      >
        {arrangementLabels[info.shaftArrangement] || info.shaftArrangement}
      </Badge>
      {info.reversingFunction && (
        <Badge
          bg={info.reversingFunction === 'with-reverse' ? 'danger' : 'success'}
          style={{ fontSize: '0.75em' }}
        >
          {reversingLabels[info.reversingFunction] || info.reversingFunction}
        </Badge>
      )}
      <Badge bg="light" text="dark" style={{ fontSize: '0.75em' }}>
        {transmissionLabels[info.transmissionType] || info.transmissionType}
      </Badge>
      <Badge bg="light" text="dark" style={{ fontSize: '0.75em' }}>
        {rotationLabels[info.rotationRelation] || info.rotationRelation}
      </Badge>
    </span>
  );
};

export default ShaftArrangementSelector;
