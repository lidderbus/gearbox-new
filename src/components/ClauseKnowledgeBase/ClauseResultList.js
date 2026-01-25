// src/components/ClauseKnowledgeBase/ClauseResultList.js
// 条款搜索结果列表组件

import React from 'react';
import { Row, Col, Alert } from 'react-bootstrap';
import ClauseCard from './ClauseCard';

/**
 * 条款搜索结果列表
 * 以卡片网格形式展示搜索结果
 */
const ClauseResultList = ({
  colors,
  results,
  selectedClauses,
  onSelect,
  onViewDetail
}) => {
  // 空结果提示
  if (!results || results.length === 0) {
    return (
      <Alert variant="info" className="text-center">
        <i className="bi bi-search me-2"></i>
        未找到匹配的条款，请尝试其他搜索词或调整筛选条件
      </Alert>
    );
  }

  // 检查条款是否被选中
  const isSelected = (clauseId) => {
    return selectedClauses.some(c => c.id === clauseId);
  };

  return (
    <div className="clause-result-list">
      <Row className="g-3">
        {results.map((result) => {
          const clause = result.item;
          const matches = result.matches || [];
          const score = result.score || 0;

          return (
            <Col key={clause.id} xs={12} md={6} lg={4} xl={3}>
              <ClauseCard
                clause={clause}
                matches={matches}
                score={score}
                colors={colors}
                selected={isSelected(clause.id)}
                onSelect={() => onSelect(clause)}
                onViewDetail={() => onViewDetail(clause)}
              />
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default ClauseResultList;
