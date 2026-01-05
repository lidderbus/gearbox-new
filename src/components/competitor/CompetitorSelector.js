/**
 * 竞品选择器组件
 * Competitor Product Selector
 *
 * 支持按厂商/系列/型号选择竞品进行对比
 */

import React, { useState, useMemo } from 'react';
import { Card, Form, Row, Col, Badge, Button, ListGroup } from 'react-bootstrap';
import {
  getAllManufacturers,
  getProductsBySeries,
  selectCompetitorProducts,
  formatPrice
} from '../../utils/competitorAnalysis';

const CompetitorSelector = ({
  selectedProducts,
  onProductsChange,
  maxSelections = 3,
  power,
  speed,
  ratio,
  colors
}) => {
  const [activeManufacturer, setActiveManufacturer] = useState(null);
  const [selectionMode, setSelectionMode] = useState('browse'); // 'browse' | 'match'

  const manufacturers = useMemo(() => getAllManufacturers(), []);

  // 按系列分组的产品
  const productsBySeries = useMemo(() => {
    return getProductsBySeries(activeManufacturer);
  }, [activeManufacturer]);

  // 参数匹配的产品
  const matchedProducts = useMemo(() => {
    if (!power || !speed || !ratio) return [];
    return selectCompetitorProducts(power, speed, ratio);
  }, [power, speed, ratio]);

  const handleProductToggle = (product) => {
    const isSelected = selectedProducts.some(p => p.model === product.model);
    if (isSelected) {
      onProductsChange(selectedProducts.filter(p => p.model !== product.model));
    } else if (selectedProducts.length < maxSelections) {
      onProductsChange([...selectedProducts, product]);
    }
  };

  const isProductSelected = (product) => {
    return selectedProducts.some(p => p.model === product.model);
  };

  const manufacturerColors = {
    CZCG: '#dc3545',
    NGC: '#198754',
    ZF: '#0d6efd',
    HANGCHI: '#fd7e14'
  };

  return (
    <Card className="shadow-sm">
      <Card.Header style={{ background: colors?.primary || '#2c5282', color: 'white' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span><i className="bi bi-list-check me-2"></i>竞品选择</span>
          <Badge bg="light" text="dark">
            已选 {selectedProducts.length}/{maxSelections}
          </Badge>
        </div>
      </Card.Header>
      <Card.Body>
        {/* 选择模式切换 */}
        <div className="mb-3">
          <Form.Check
            inline
            type="radio"
            label="按品牌浏览"
            name="selectionMode"
            checked={selectionMode === 'browse'}
            onChange={() => setSelectionMode('browse')}
          />
          <Form.Check
            inline
            type="radio"
            label="按参数匹配"
            name="selectionMode"
            checked={selectionMode === 'match'}
            onChange={() => setSelectionMode('match')}
            disabled={!power || !speed || !ratio}
          />
        </div>

        {selectionMode === 'browse' ? (
          <>
            {/* 厂商选择 */}
            <Row className="mb-3">
              <Col>
                <div className="d-flex gap-2 flex-wrap">
                  <Button
                    size="sm"
                    variant={activeManufacturer === null ? 'primary' : 'outline-primary'}
                    onClick={() => setActiveManufacturer(null)}
                  >
                    全部
                  </Button>
                  {manufacturers.filter(m => m.id !== 'HANGCHI').map(m => (
                    <Button
                      key={m.id}
                      size="sm"
                      variant={activeManufacturer === m.id ? 'primary' : 'outline-secondary'}
                      onClick={() => setActiveManufacturer(m.id)}
                      style={{
                        borderColor: manufacturerColors[m.id],
                        color: activeManufacturer === m.id ? 'white' : manufacturerColors[m.id],
                        backgroundColor: activeManufacturer === m.id ? manufacturerColors[m.id] : 'transparent'
                      }}
                    >
                      {m.shortName}
                    </Button>
                  ))}
                </div>
              </Col>
            </Row>

            {/* 产品列表 */}
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {productsBySeries.map(group => (
                <div key={`${group.manufacturer}-${group.series}`} className="mb-3">
                  <div className="d-flex align-items-center mb-2">
                    <Badge
                      bg="secondary"
                      style={{ backgroundColor: manufacturerColors[group.manufacturer] }}
                    >
                      {group.manufacturerName}
                    </Badge>
                    <span className="ms-2 fw-bold">{group.series}系列</span>
                  </div>
                  <ListGroup variant="flush">
                    {group.products.map(product => (
                      <ListGroup.Item
                        key={product.model}
                        action
                        active={isProductSelected(product)}
                        onClick={() => handleProductToggle(product)}
                        className="d-flex justify-content-between align-items-center py-2"
                        style={{
                          cursor: selectedProducts.length >= maxSelections && !isProductSelected(product)
                            ? 'not-allowed'
                            : 'pointer',
                          opacity: selectedProducts.length >= maxSelections && !isProductSelected(product)
                            ? 0.5
                            : 1
                        }}
                      >
                        <div>
                          <strong>{product.model}</strong>
                          <small className="text-muted ms-2">
                            {product.powerRange[0]}-{product.powerRange[1]}kW
                          </small>
                        </div>
                        <div className="text-end">
                          <small className="text-muted">
                            {formatPrice(product.estimatedPrice)}
                          </small>
                          {isProductSelected(product) && (
                            <i className="bi bi-check-circle-fill text-success ms-2"></i>
                          )}
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* 参数匹配结果 */}
            <div className="mb-3 p-3 bg-light rounded">
              <Row>
                <Col xs={4}>
                  <small className="text-muted">功率</small>
                  <div className="fw-bold">{power} kW</div>
                </Col>
                <Col xs={4}>
                  <small className="text-muted">转速</small>
                  <div className="fw-bold">{speed} rpm</div>
                </Col>
                <Col xs={4}>
                  <small className="text-muted">速比</small>
                  <div className="fw-bold">{ratio}</div>
                </Col>
              </Row>
            </div>

            {matchedProducts.length > 0 ? (
              <ListGroup variant="flush" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                {matchedProducts.map(product => (
                  <ListGroup.Item
                    key={product.model}
                    action
                    active={isProductSelected(product)}
                    onClick={() => handleProductToggle(product)}
                    className="py-2"
                    style={{
                      cursor: selectedProducts.length >= maxSelections && !isProductSelected(product)
                        ? 'not-allowed'
                        : 'pointer',
                      opacity: selectedProducts.length >= maxSelections && !isProductSelected(product)
                        ? 0.5
                        : 1
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <Badge
                          className="me-2"
                          style={{ backgroundColor: manufacturerColors[product.manufacturer] }}
                        >
                          {product.manufacturer}
                        </Badge>
                        <strong>{product.model}</strong>
                      </div>
                      <div className="text-end">
                        <small className="text-muted me-2">
                          余量 {product.margin}%
                        </small>
                        {isProductSelected(product) && (
                          <i className="bi bi-check-circle-fill text-success"></i>
                        )}
                      </div>
                    </div>
                    <small className="text-muted">
                      速比 {product.matchedRatio} | {formatPrice(product.estimatedPrice)}
                    </small>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            ) : (
              <div className="text-center text-muted py-4">
                <i className="bi bi-search fs-1 mb-2 d-block"></i>
                {power && speed && ratio
                  ? '未找到符合条件的竞品'
                  : '请先输入功率、转速、速比参数'}
              </div>
            )}
          </>
        )}

        {/* 已选产品 */}
        {selectedProducts.length > 0 && (
          <div className="mt-3 pt-3 border-top">
            <small className="text-muted mb-2 d-block">已选竞品:</small>
            <div className="d-flex gap-2 flex-wrap">
              {selectedProducts.map(p => (
                <Badge
                  key={p.model}
                  bg="secondary"
                  className="d-flex align-items-center py-2 px-3"
                  style={{ backgroundColor: manufacturerColors[p.manufacturer] }}
                >
                  {p.model}
                  <i
                    className="bi bi-x-circle ms-2"
                    style={{ cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductToggle(p);
                    }}
                  ></i>
                </Badge>
              ))}
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CompetitorSelector;
