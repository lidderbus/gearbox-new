// src/components/QuotationEnhancedOptions.js
// 报价单增强选项组件

import React from 'react';
import { Card, Row, Col, Button } from 'react-bootstrap';

/**
 * 报价单增强功能选项区域
 */
const QuotationEnhancedOptions = ({
  quotation,
  onAddCustomItem,
  onSave,
  onViewHistory,
  onUpdatePrices,
  colors
}) => {
  if (!quotation || !quotation.success) return null;

  return (
    <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        报价单增强功能
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Button
              variant="outline-primary"
              className="w-100 mb-2"
              onClick={onAddCustomItem}
            >
              <i className="bi bi-plus-circle me-2"></i> 添加自定义项目
            </Button>
          </Col>
          <Col md={6}>
            <Button
              variant="outline-success"
              className="w-100 mb-2"
              onClick={onSave}
            >
              <i className="bi bi-save me-2"></i> 保存此报价单
            </Button>
          </Col>
          <Col md={6}>
            <Button
              variant="outline-secondary"
              className="w-100 mb-2"
              onClick={onViewHistory}
            >
              <i className="bi bi-clock-history me-2"></i> 查看保存的报价单
            </Button>
          </Col>
          <Col md={6}>
            <Button
              variant="outline-info"
              className="w-100 mb-2"
              onClick={onUpdatePrices}
            >
              <i className="bi bi-currency-exchange me-2"></i> 更新所有价格
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default QuotationEnhancedOptions;
