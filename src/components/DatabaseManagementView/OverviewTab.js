// src/components/DatabaseManagementView/OverviewTab.js
// Database overview tab component
import React from 'react';
import { Card, Row, Col, Badge, Button } from 'react-bootstrap';

/**
 * Overview tab component showing database statistics
 */
const OverviewTab = ({
  stats,
  dataCollections,
  couplingSeriesStats,
  matchingStats,
  onOpenCouplingSelection
}) => {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">数据库内容概览</h5>
          <Badge bg="primary" pill>总计 {stats.totalItems} 项</Badge>
        </div>
      </Card.Header>
      <Card.Body>
        <Row>
          {dataCollections.map(collection => (
            <Col md={3} sm={6} key={collection.key} className="mb-4">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Body className="d-flex align-items-center">
                  <div
                    className="rounded-circle me-3 d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      backgroundColor: collection.color,
                      color: 'white'
                    }}
                  >
                    <i className={`bi bi-${collection.icon}`} style={{ fontSize: '1.5rem' }}></i>
                  </div>
                  <div>
                    <h6 className="mb-0">{collection.name}</h6>
                    <div className="d-flex align-items-center mt-1">
                      <span className="fs-4 fw-bold">{stats.categoryCounts[collection.key] || 0}</span>
                      <span className="ms-2 text-muted">项</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {stats.totalItems === 0 && (
          <div className="text-center py-5">
            <i className="bi bi-database-x text-muted" style={{ fontSize: '3rem' }}></i>
            <p className="mt-3 text-muted">数据库中暂无数据，请导入数据后再进行操作</p>
          </div>
        )}

        {/* Coupling series statistics */}
        {couplingSeriesStats.total > 0 && (
          <div className="mt-4 pt-4 border-top">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0">
                <i className="bi bi-link-45deg me-2" style={{ color: '#673AB7' }}></i>
                高弹联轴器系列分布
              </h5>
              <Button
                variant="outline-success"
                size="sm"
                onClick={onOpenCouplingSelection}
              >
                <i className="bi bi-box-arrow-up-right me-1"></i>
                进入高弹选型系统
              </Button>
            </div>

            <Row>
              {Object.entries(couplingSeriesStats.seriesCount)
                .sort((a, b) => b[1] - a[1])
                .map(([series, count]) => {
                  const details = couplingSeriesStats.seriesDetails[series];
                  return (
                    <Col md={4} sm={6} key={series} className="mb-3">
                      <Card className="h-100 border-0 shadow-sm">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{series}系列</h6>
                              <small className="text-muted d-block" style={{ maxWidth: '200px' }}>
                                {details.description?.substring(0, 30) || '高弹性联轴器'}
                                {details.description?.length > 30 ? '...' : ''}
                              </small>
                            </div>
                            <Badge bg="primary" pill className="fs-6">{count}</Badge>
                          </div>

                          <div className="mt-2">
                            <small className="text-muted">
                              型号: {details.models.slice(0, 3).join(', ')}
                              {details.models.length > 3 ? ` +${details.models.length - 3}个` : ''}
                            </small>
                          </div>

                          {details.detailUrl && (
                            <div className="mt-2">
                              <a
                                href={details.detailUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="small"
                              >
                                <i className="bi bi-box-arrow-up-right me-1"></i>
                                查看详情
                              </a>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
            </Row>

            {/* Matching statistics */}
            <div className="mt-3 p-3 bg-light rounded">
              <Row>
                <Col md={3} sm={6} className="text-center mb-2 mb-md-0">
                  <div className="fs-4 fw-bold text-primary">{couplingSeriesStats.total}</div>
                  <small className="text-muted">联轴器型号总数</small>
                </Col>
                <Col md={3} sm={6} className="text-center mb-2 mb-md-0">
                  <div className="fs-4 fw-bold text-success">{Object.keys(couplingSeriesStats.seriesCount).length}</div>
                  <small className="text-muted">系列数量</small>
                </Col>
                <Col md={3} sm={6} className="text-center mb-2 mb-md-0">
                  <div className="fs-4 fw-bold text-info">{matchingStats.gearboxCount}</div>
                  <small className="text-muted">已映射齿轮箱</small>
                </Col>
                <Col md={3} sm={6} className="text-center">
                  <div className="fs-4 fw-bold text-warning">{matchingStats.totalMappings}</div>
                  <small className="text-muted">匹配关系总数</small>
                </Col>
              </Row>
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default OverviewTab;
