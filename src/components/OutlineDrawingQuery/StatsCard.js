// src/components/OutlineDrawingQuery/StatsCard.js
// Statistics display card
import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

/**
 * Stats card component showing drawing counts
 */
const StatsCard = ({ stats, dwgStats, colors = {} }) => {
  return (
    <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Body>
        <Row className="text-center">
          <Col xs={3}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: colors.primary }}>
              {stats.total + dwgStats.total}
            </div>
            <small style={{ color: colors.text }}>总图纸</small>
          </Col>
          <Col xs={3}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#198754' }}>
              {stats.gearbox.total}
            </div>
            <small style={{ color: colors.text }}>齿轮箱SVG</small>
          </Col>
          <Col xs={3}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fd7e14' }}>
              {stats.coupling.total}
            </div>
            <small style={{ color: colors.text }}>联轴器SVG</small>
          </Col>
          <Col xs={3}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6f42c1' }}>
              {dwgStats.total}
            </div>
            <small style={{ color: colors.text }}>DWG文件</small>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default StatsCard;
