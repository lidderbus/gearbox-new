// src/components/selection/RecommendationReasonCard.js
// Shows why this gearbox is recommended with key metrics

import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';

/**
 * Get margin rating info
 */
const getMarginRating = (margin) => {
  if (margin === undefined || margin === null) return { text: '-', bg: 'secondary', desc: '无数据' };
  if (margin >= 10 && margin <= 20) return { text: '理想', bg: 'success', desc: `余量${margin.toFixed(1)}%，在最佳范围(10-20%)内` };
  if (margin >= 5 && margin < 10) return { text: '偏小', bg: 'warning', desc: `余量${margin.toFixed(1)}%，建议选择余量更大的型号` };
  if (margin > 20 && margin <= 35) return { text: '充裕', bg: 'info', desc: `余量${margin.toFixed(1)}%，能力充足` };
  if (margin < 5) return { text: '不足', bg: 'danger', desc: `余量仅${margin.toFixed(1)}%，可能不满足要求` };
  return { text: '过大', bg: 'secondary', desc: `余量${margin.toFixed(1)}%，可能过度选型` };
};

/**
 * Get ratio rating info
 */
const getRatioRating = (diffPercent) => {
  if (diffPercent === undefined || diffPercent === null) return { text: '-', bg: 'secondary', desc: '无数据' };
  if (diffPercent <= 2) return { text: '精确', bg: 'success', desc: `偏差仅${diffPercent.toFixed(1)}%` };
  if (diffPercent <= 5) return { text: '良好', bg: 'info', desc: `偏差${diffPercent.toFixed(1)}%` };
  if (diffPercent <= 10) return { text: '可接受', bg: 'warning', desc: `偏差${diffPercent.toFixed(1)}%` };
  return { text: '偏差大', bg: 'danger', desc: `偏差${diffPercent.toFixed(1)}%，可能影响效率` };
};

/**
 * Get price rank among all recommendations
 */
const getPriceRank = (price, allRecommendations) => {
  if (!price || price <= 0) return { text: '询价', bg: 'secondary', desc: '暂无价格数据' };
  const prices = allRecommendations
    .filter(r => r.marketPrice > 0)
    .map(r => r.marketPrice)
    .sort((a, b) => a - b);
  if (prices.length === 0) return { text: '-', bg: 'secondary', desc: '无可比数据' };
  const rank = prices.findIndex(p => p >= price) + 1;
  const percentile = Math.round((rank / prices.length) * 100);
  if (percentile <= 25) return { text: '高性价比', bg: 'success', desc: `价格排名 ${rank}/${prices.length}，前${percentile}%` };
  if (percentile <= 50) return { text: '中等', bg: 'info', desc: `价格排名 ${rank}/${prices.length}` };
  if (percentile <= 75) return { text: '偏高', bg: 'warning', desc: `价格排名 ${rank}/${prices.length}` };
  return { text: '较贵', bg: 'danger', desc: `价格排名 ${rank}/${prices.length}` };
};

const RecommendationReasonCard = ({ selectedGearbox, allRecommendations = [], targetRatio }) => {
  if (!selectedGearbox) return null;

  const marginInfo = getMarginRating(selectedGearbox.capacityMargin);
  const ratioInfo = getRatioRating(selectedGearbox.ratioDiffPercent);
  const priceInfo = getPriceRank(selectedGearbox.marketPrice, allRecommendations);

  return (
    <Card className="border-success mb-3" style={{ borderWidth: '2px' }}>
      <Card.Body className="py-2 px-3">
        <div className="d-flex align-items-center mb-2">
          <i className="bi bi-lightbulb-fill text-success me-2"></i>
          <strong style={{ fontSize: '0.9rem' }}>推荐理由</strong>
        </div>
        <Row className="g-2">
          <Col xs={4}>
            <div className="text-center">
              <Badge bg={marginInfo.bg} style={{ fontSize: '0.8rem' }}>{marginInfo.text}</Badge>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>能力余量</div>
              <div style={{ fontSize: '0.7rem', color: '#999' }}>{marginInfo.desc}</div>
            </div>
          </Col>
          <Col xs={4}>
            <div className="text-center">
              <Badge bg={ratioInfo.bg} style={{ fontSize: '0.8rem' }}>{ratioInfo.text}</Badge>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>速比匹配</div>
              <div style={{ fontSize: '0.7rem', color: '#999' }}>
                {selectedGearbox.selectedRatio ? `${selectedGearbox.selectedRatio.toFixed(2)}` : '-'}
                {targetRatio ? ` vs ${targetRatio.toFixed(2)}` : ''}
              </div>
            </div>
          </Col>
          <Col xs={4}>
            <div className="text-center">
              <Badge bg={priceInfo.bg} style={{ fontSize: '0.8rem' }}>{priceInfo.text}</Badge>
              <div style={{ fontSize: '0.75rem', color: '#666', marginTop: '2px' }}>性价比</div>
              <div style={{ fontSize: '0.7rem', color: '#999' }}>{priceInfo.desc}</div>
            </div>
          </Col>
        </Row>
        {selectedGearbox.ratioDiffPercent > 0 && selectedGearbox.selectedRatio && targetRatio && (
          <div style={{ fontSize: '0.7rem', color: '#888', marginTop: '6px', borderTop: '1px solid #eee', paddingTop: '4px' }}>
            <i className="bi bi-info-circle me-1"></i>
            实际减速比 {selectedGearbox.selectedRatio.toFixed(2)} {selectedGearbox.selectedRatio > targetRatio ? '大于' : '小于'}目标值 {targetRatio.toFixed(2)}，
            {selectedGearbox.selectedRatio > targetRatio ? '螺旋桨转速将略低，推力可能略有变化' : '螺旋桨转速将略高'}
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default RecommendationReasonCard;
