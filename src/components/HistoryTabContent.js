// src/components/HistoryTabContent.js
// 选型历史Tab内容组件

import React, { Suspense, lazy } from 'react';
import { Row, Col, Card, Spinner } from 'react-bootstrap';

// 懒加载组件
const SelectionHistoryManager = lazy(() => import('./SelectionHistoryManager'));

// 加载指示器
const LazyLoadFallback = () => (
  <div className="d-flex justify-content-center align-items-center py-5">
    <Spinner animation="border" variant="primary" />
    <span className="ms-2">加载中...</span>
  </div>
);

/**
 * 选型历史Tab内容组件
 * 包含历史记录列表和加载功能
 */
const HistoryTabContent = ({
  isVisible,
  onLoadHistory,
  colors
}) => {
  return (
    <Row>
      <Col>
        <Card className="shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
            <i className="bi bi-clock-history me-2"></i>选型历史记录
          </Card.Header>
          <Card.Body>
            <Suspense fallback={<LazyLoadFallback />}>
              <SelectionHistoryManager
                onLoadFromHistory={onLoadHistory}
                isVisible={isVisible}
              />
            </Suspense>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default HistoryTabContent;
