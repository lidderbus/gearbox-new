// src/components/ProductCenter/ProductDetail.js
// 产品详情模态框

import React, { useState } from 'react';
import { Modal, Row, Col, Tab, Tabs, Table, Badge, Button, Card } from 'react-bootstrap';

// 系列颜色映射
const SERIES_COLORS = {
  hc: 'primary',
  hcm: 'success',
  hcd: 'info',
  gw: 'warning',
  gc: 'danger',
  dt: 'secondary',
  other: 'dark'
};

const ProductDetail = ({
  show,
  onHide,
  product,
  onAddToCompare,
  onGenerateQuotation,
  isInCompare,
  colors = {},
  theme = 'light'
}) => {
  const [activeTab, setActiveTab] = useState('basic');

  if (!product) return null;

  const seriesColor = SERIES_COLORS[product.seriesKey] || 'secondary';

  // 格式化价格
  const formatPrice = (price) => {
    if (!price || price === 0) return '-';
    return `¥${price.toLocaleString()}`;
  };

  // 格式化减速比数组
  const formatRatioTable = () => {
    const ratios = product.ratios || [];
    const capacities = product.transferCapacity || product.transmissionCapacityPerRatio || [];

    if (ratios.length === 0) return null;

    return (
      <Table bordered size="sm" className="mb-0">
        <thead>
          <tr>
            <th>减速比</th>
            {ratios.map((r, i) => (
              <th key={i} className="text-center">{r.toFixed(2)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>传递能力 (kW/rpm)</td>
            {ratios.map((_, i) => (
              <td key={i} className="text-center">
                {capacities[i]?.toFixed(4) || '-'}
              </td>
            ))}
          </tr>
        </tbody>
      </Table>
    );
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: colors.headerBg || '#f8f9fa',
          borderColor: colors.border
        }}
      >
        <Modal.Title className="d-flex align-items-center gap-2">
          <Badge bg={seriesColor}>{product.seriesLabel}</Badge>
          <span>{product.model}</span>
          <span className="text-muted small ms-2">船用齿轮箱</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: colors.card }}>
        <Row>
          {/* 左侧：产品图片 */}
          <Col md={4}>
            <div
              className="text-center p-3 rounded mb-3"
              style={{ backgroundColor: theme === 'dark' ? '#2d3748' : '#f8f9fa' }}
            >
              <img
                src={`https://omo-oss-image.thefastimg.com/portal-saas/pg2024010511133434452/cms/image/default_gearbox.png`}
                alt={product.model}
                style={{ maxWidth: '100%', maxHeight: '200px' }}
                onError={(e) => {
                  e.target.src = '/images/gearbox-placeholder.png';
                }}
              />
            </div>

            {/* 价格信息 */}
            <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>市场价:</span>
                  <span className="fw-bold text-danger" style={{ fontSize: '1.2rem' }}>
                    {formatPrice(product.marketPrice || product.displayPrice)}
                  </span>
                </div>
                {product.factoryPrice && (
                  <div className="d-flex justify-content-between mb-2">
                    <span>出厂价:</span>
                    <span className="fw-bold text-success">
                      {formatPrice(product.factoryPrice)}
                    </span>
                  </div>
                )}
                {product.discountRate && (
                  <div className="d-flex justify-content-between">
                    <span>折扣率:</span>
                    <Badge bg="warning" text="dark">
                      {(product.discountRate * 100).toFixed(0)}%
                    </Badge>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* 操作按钮 */}
            <div className="d-grid gap-2">
              <Button
                variant={isInCompare ? 'primary' : 'outline-primary'}
                onClick={() => onAddToCompare(product)}
              >
                <i className={`bi ${isInCompare ? 'bi-check-lg' : 'bi-plus-lg'} me-2`}></i>
                {isInCompare ? '已加入对比' : '加入对比'}
              </Button>
              <Button variant="outline-success" onClick={() => onGenerateQuotation(product)}>
                <i className="bi bi-file-earmark-text me-2"></i>
                生成报价单
              </Button>
            </div>
          </Col>

          {/* 右侧：参数标签页 */}
          <Col md={8}>
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              {/* 基本参数 */}
              <Tab eventKey="basic" title="基本参数">
                <Table bordered style={{ backgroundColor: colors.card }}>
                  <tbody>
                    <tr>
                      <td width="25%" className="table-secondary">型号</td>
                      <td width="25%">{product.model}</td>
                      <td width="25%" className="table-secondary">系列</td>
                      <td width="25%">{product.seriesLabel}</td>
                    </tr>
                    <tr>
                      <td className="table-secondary">输入转速</td>
                      <td>{product.inputSpeedRange?.join(' - ') || '-'} rpm</td>
                      <td className="table-secondary">功率范围</td>
                      <td>{product.minPower}-{product.maxPower} kW</td>
                    </tr>
                    <tr>
                      <td className="table-secondary">额定推力</td>
                      <td>{product.thrust || '-'} kN</td>
                      <td className="table-secondary">重量</td>
                      <td>{product.weight || '-'} kg</td>
                    </tr>
                    <tr>
                      <td className="table-secondary">传动效率</td>
                      <td>{product.efficiency ? (product.efficiency * 100).toFixed(0) + '%' : '-'}</td>
                      <td className="table-secondary">控制方式</td>
                      <td>{product.controlType || '-'}</td>
                    </tr>
                    <tr>
                      <td className="table-secondary">中心距</td>
                      <td>{product.centerDistance || '-'} mm</td>
                      <td className="table-secondary">外形尺寸</td>
                      <td>{product.dimensions || '-'}</td>
                    </tr>
                  </tbody>
                </Table>
              </Tab>

              {/* 减速比/传递能力 */}
              <Tab eventKey="ratios" title="减速比/传递能力">
                <div className="mb-3">
                  <h6>可用减速比及对应传递能力</h6>
                  {formatRatioTable() || <p className="text-muted">暂无数据</p>}
                </div>
                <div className="small text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  传递能力计算公式: 功率(kW) = 传递能力 × 输入转速(rpm)
                </div>
              </Tab>

              {/* 接口信息 */}
              <Tab eventKey="interface" title="接口信息">
                {product.inputInterfaces ? (
                  <div>
                    {product.inputInterfaces.sae && product.inputInterfaces.sae.length > 0 && (
                      <div className="mb-3">
                        <h6><i className="bi bi-plug me-2"></i>SAE接口</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {product.inputInterfaces.sae.map((spec, i) => (
                            <Badge key={i} bg="primary" className="fs-6 py-2 px-3">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.inputInterfaces.domestic && product.inputInterfaces.domestic.length > 0 && (
                      <div className="mb-3">
                        <h6><i className="bi bi-plug me-2"></i>国内机接口</h6>
                        <div className="d-flex flex-wrap gap-2">
                          {product.inputInterfaces.domestic.map((spec, i) => (
                            <Badge key={i} bg="info" className="fs-6 py-2 px-3">
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    {product.inputInterfaces.type && (
                      <div>
                        <h6>驱动类型</h6>
                        <Badge bg="secondary">{product.inputInterfaces.type}</Badge>
                        {product.inputInterfaces.note && (
                          <span className="ms-2 text-muted">{product.inputInterfaces.note}</span>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted">
                    <i className="bi bi-inbox display-4"></i>
                    <p className="mt-2">暂无接口数据</p>
                  </div>
                )}
              </Tab>

              {/* 备注 */}
              <Tab eventKey="notes" title="备注">
                <div className="p-3">
                  {product.notes ? (
                    <p>{product.notes}</p>
                  ) : (
                    <p className="text-muted">暂无备注信息</p>
                  )}
                </div>
              </Tab>
            </Tabs>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: colors.headerBg, borderColor: colors.border }}>
        <Button variant="secondary" onClick={onHide}>
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductDetail;
