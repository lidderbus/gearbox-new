// src/components/responsive/SwipeableResultCards.js
import React, { useState, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Collapse } from 'react-bootstrap';
import './SwipeableResultCards.css';
import { calculatePowerRange } from '../../utils/gearboxDataEnhancer';

/**
 * Swipeable result cards for mobile view
 */
const SwipeableResultCards = ({
  result,
  selectedIndex,
  onSelectGearbox,
  onGenerateQuotation,
  onGenerateAgreement,
  onBack,
}) => {
  const [currentIndex, setCurrentIndex] = useState(selectedIndex || 0);
  const [isSwiping, setIsSwiping] = useState(false);
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [expandedSections, setExpandedSections] = useState({});

  const recommendations = result?.recommendations || [];
  const totalCount = recommendations.length;
  const couplingResult = result?.flexibleCoupling;
  const pumpResult = result?.standbyPump;

  const goToIndex = useCallback((index) => {
    const newIndex = Math.max(0, Math.min(index, totalCount - 1));
    setCurrentIndex(newIndex);
    if (onSelectGearbox) {
      onSelectGearbox(newIndex);
    }
  }, [totalCount, onSelectGearbox]);

  const handlers = useSwipeable({
    onSwiping: (e) => {
      setIsSwiping(true);
      setSwipeOffset(e.deltaX);
    },
    onSwipedLeft: () => {
      setIsSwiping(false);
      setSwipeOffset(0);
      if (currentIndex < totalCount - 1) {
        goToIndex(currentIndex + 1);
      }
    },
    onSwipedRight: () => {
      setIsSwiping(false);
      setSwipeOffset(0);
      if (currentIndex > 0) {
        goToIndex(currentIndex - 1);
      }
    },
    onSwiped: () => {
      setIsSwiping(false);
      setSwipeOffset(0);
    },
    trackMouse: false,
    trackTouch: true,
    delta: 50,
    preventScrollOnSwipe: true,
  });

  const toggleSection = (sectionId) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const translateX = -currentIndex * 100 + (swipeOffset / window.innerWidth) * 100;

  if (!recommendations.length) {
    return (
      <div className="swipeable-results">
        <button className="back-btn" onClick={onBack}>
          ← 返回修改参数
        </button>
        <div className="result-card">
          <div className="card-body" style={{ textAlign: 'center', padding: '40px' }}>
            <p>未找到匹配的齿轮箱</p>
            <p style={{ fontSize: '14px', color: '#666' }}>
              请调整参数后重新选型
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentGearbox = recommendations[currentIndex];
  const margin = currentGearbox?.margin || currentGearbox?.marginPercent || 0;

  return (
    <div className="swipeable-results">
      {/* Back button */}
      <button className="back-btn" onClick={onBack}>
        ← 返回修改参数
      </button>

      {/* Header */}
      <div className="swipe-header">
        <span className="swipe-hint">← 滑动切换 →</span>
        <span className="swipe-counter">{currentIndex + 1}/{totalCount}</span>
      </div>

      {/* Cards */}
      <div className="cards-viewport" {...handlers}>
        <div
          className={`cards-track ${isSwiping ? 'swiping' : ''}`}
          style={{ transform: `translateX(${translateX}%)` }}
        >
          {recommendations.map((gearbox, index) => (
            <div key={gearbox.model || index} className="result-card">
              {/* Card Header */}
              <div className="card-header">
                <div className="card-rank">
                  {index === 0 ? '🏆 最佳推荐' : `#${index + 1} 推荐`}
                </div>
                <div className="card-model">
                  {gearbox.model}
                </div>
              </div>

              {/* Card Body */}
              <div className="card-body">
                {/* Specs Grid */}
                <div className="specs-grid">
                  <div className="spec-item">
                    <span className="spec-label">功率范围</span>
                    <span className="spec-value">
                      {(() => {
                        if (gearbox.minPower && gearbox.maxPower)
                          return `${gearbox.minPower} - ${gearbox.maxPower} kW`;
                        const pr = calculatePowerRange(
                          gearbox.transmissionCapacityPerRatio || gearbox.transferCapacity,
                          gearbox.inputSpeedRange
                        );
                        return pr.minPower != null ? `${pr.minPower} - ${pr.maxPower} kW` : '-';
                      })()}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">转速范围</span>
                    <span className="spec-value">
                      {gearbox.minSpeed || gearbox.speedRange?.min || (Array.isArray(gearbox.inputSpeedRange) ? gearbox.inputSpeedRange[0] : '-')} - {gearbox.maxSpeed || gearbox.speedRange?.max || (Array.isArray(gearbox.inputSpeedRange) ? gearbox.inputSpeedRange[1] : '-')} rpm
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">可选速比</span>
                    <span className="spec-value">
                      {Array.isArray(gearbox.ratios)
                        ? gearbox.ratios.slice(0, 4).join(', ') + (gearbox.ratios.length > 4 ? '...' : '')
                        : gearbox.ratio || '-'}
                    </span>
                  </div>
                  <div className="spec-item">
                    <span className="spec-label">匹配速比</span>
                    <span className="spec-value highlight">
                      {gearbox.matchedRatio || gearbox.selectedRatio || '-'}
                    </span>
                  </div>
                </div>

                {/* Margin Bar */}
                <div className="margin-bar">
                  <div className="margin-label">
                    <span>传递能力余量</span>
                    <span>{typeof margin === 'number' ? margin.toFixed(1) : margin}%</span>
                  </div>
                  <div className="margin-track">
                    <div
                      className="margin-fill"
                      style={{ width: `${Math.min(margin, 100)}%` }}
                    />
                  </div>
                </div>

                {/* Detail Sections */}
                <div className="detail-sections">
                  {/* Coupling Info */}
                  {couplingResult && couplingResult.success && (
                    <div className="detail-section">
                      <div
                        className="detail-header"
                        onClick={() => toggleSection(`coupling-${index}`)}
                      >
                        <span className="detail-title">联轴器匹配</span>
                        <span className={`detail-icon ${expandedSections[`coupling-${index}`] ? 'open' : ''}`}>
                          ▼
                        </span>
                      </div>
                      <Collapse in={expandedSections[`coupling-${index}`]}>
                        <div>
                          <div className="detail-content">
                            <div className="detail-row">
                              <span className="detail-row-label">型号</span>
                              <span className="detail-row-value">{couplingResult.model}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-row-label">额定扭矩</span>
                              <span className="detail-row-value">{couplingResult.ratedTorque} kN·m</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-row-label">扭矩余量</span>
                              <span className="detail-row-value">{couplingResult.marginPercent?.toFixed(1)}%</span>
                            </div>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  )}

                  {/* Pump Info */}
                  {pumpResult && pumpResult.requiresPump && pumpResult.pump && (
                    <div className="detail-section">
                      <div
                        className="detail-header"
                        onClick={() => toggleSection(`pump-${index}`)}
                      >
                        <span className="detail-title">备用泵信息</span>
                        <span className={`detail-icon ${expandedSections[`pump-${index}`] ? 'open' : ''}`}>
                          ▼
                        </span>
                      </div>
                      <Collapse in={expandedSections[`pump-${index}`]}>
                        <div>
                          <div className="detail-content">
                            <div className="detail-row">
                              <span className="detail-row-label">型号</span>
                              <span className="detail-row-value">{pumpResult.pump.model}</span>
                            </div>
                            <div className="detail-row">
                              <span className="detail-row-label">流量</span>
                              <span className="detail-row-value">{pumpResult.pump.flowRate} L/min</span>
                            </div>
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  )}

                  {/* Technical Specs */}
                  <div className="detail-section">
                    <div
                      className="detail-header"
                      onClick={() => toggleSection(`tech-${index}`)}
                    >
                      <span className="detail-title">技术参数</span>
                      <span className={`detail-icon ${expandedSections[`tech-${index}`] ? 'open' : ''}`}>
                        ▼
                      </span>
                    </div>
                    <Collapse in={expandedSections[`tech-${index}`]}>
                      <div>
                        <div className="detail-content">
                          <div className="detail-row">
                            <span className="detail-row-label">系列</span>
                            <span className="detail-row-value">{gearbox.series || '-'}</span>
                          </div>
                          <div className="detail-row">
                            <span className="detail-row-label">重量</span>
                            <span className="detail-row-value">{gearbox.weight || '-'} kg</span>
                          </div>
                          {gearbox.price && (
                            <div className="detail-row">
                              <span className="detail-row-label">参考价格</span>
                              <span className="detail-row-value">¥{gearbox.price.toLocaleString()}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </Collapse>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Dots */}
      <div className="pagination-dots">
        {recommendations.map((_, index) => (
          <div
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => goToIndex(index)}
          />
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="bottom-actions">
        <button
          className="bottom-action-btn secondary"
          onClick={() => onGenerateQuotation && onGenerateQuotation(currentGearbox)}
        >
          📄 生成报价
        </button>
        <button
          className="bottom-action-btn primary"
          onClick={() => onGenerateAgreement && onGenerateAgreement(currentGearbox)}
        >
          📋 技术协议
        </button>
      </div>
    </div>
  );
};

export default SwipeableResultCards;
