// src/components/ProductCenter/ProductCard.js
// 单个产品卡片组件

import React from 'react';
import { Card, Badge, Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getImageUrl } from '../ProductThumbnail';

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

const ProductCard = ({
  product,
  onViewDetail,
  onToggleCompare,
  isInCompare,
  colors = {},
  theme = 'light'
}) => {
  const cardStyle = {
    backgroundColor: colors.card || '#fff',
    borderColor: colors.border || '#dee2e6',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  };

  // 格式化价格
  const formatPrice = (price) => {
    if (!price || price === 0) return '询价';
    if (price >= 10000) {
      return `¥${(price / 10000).toFixed(1)}万`;
    }
    return `¥${price.toLocaleString()}`;
  };

  // 格式化减速比
  const formatRatios = (ratios) => {
    if (!ratios || ratios.length === 0) return '-';
    if (ratios.length <= 3) {
      return ratios.map(r => r.toFixed(2)).join(' / ');
    }
    const min = Math.min(...ratios);
    const max = Math.max(...ratios);
    return `${min.toFixed(2)} - ${max.toFixed(2)} (${ratios.length}档)`;
  };

  // 格式化接口信息
  const formatInterfaces = (interfaces) => {
    if (!interfaces) return null;

    const badges = [];
    if (interfaces.sae && interfaces.sae.length > 0) {
      badges.push(
        <Badge key="sae" bg="primary" className="me-1" style={{ fontSize: '0.65rem' }}>
          SAE {interfaces.sae.length}种
        </Badge>
      );
    }
    if (interfaces.domestic && interfaces.domestic.length > 0) {
      badges.push(
        <Badge key="domestic" bg="info" className="me-1" style={{ fontSize: '0.65rem' }}>
          国内机 {interfaces.domestic.length}种
        </Badge>
      );
    }
    return badges.length > 0 ? badges : null;
  };

  const seriesColor = SERIES_COLORS[product.seriesKey] || 'secondary';

  return (
    <Card
      className="h-100 shadow-sm product-card"
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* 产品图片 */}
      <div
        className="position-relative"
        style={{
          height: '140px',
          backgroundColor: theme === 'dark' ? '#2d3748' : '#f8f9fa',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden'
        }}
        onClick={() => onViewDetail(product)}
      >
        <img
          src={getImageUrl(product.model, 'gearbox', 'thumbnail')}
          alt={product.model}
          style={{
            maxHeight: '120px',
            maxWidth: '90%',
            objectFit: 'contain'
          }}
          onError={(e) => {
            e.target.src = '/images/gearbox-placeholder.png';
          }}
        />
        {/* 系列标签 */}
        <Badge
          bg={seriesColor}
          className="position-absolute"
          style={{ top: '8px', left: '8px' }}
        >
          {product.seriesLabel}
        </Badge>
      </div>

      <Card.Body className="p-2" onClick={() => onViewDetail(product)}>
        {/* 型号名称 */}
        <Card.Title className="mb-2 d-flex justify-content-between align-items-start">
          <span className="fw-bold" style={{ fontSize: '1rem', color: colors.text }}>
            {product.model}
          </span>
        </Card.Title>

        {/* 参数列表 */}
        <div className="small" style={{ color: colors.textMuted || '#6c757d' }}>
          <div className="d-flex justify-content-between mb-1">
            <span><i className="bi bi-lightning me-1"></i>功率:</span>
            <span className="fw-medium">
              {product.minPower > 0 ? `${product.minPower}-${product.maxPower} kW` : '-'}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span><i className="bi bi-arrow-repeat me-1"></i>转速:</span>
            <span className="fw-medium">
              {product.minSpeed > 0 ? `${product.minSpeed}-${product.maxSpeed} rpm` : '-'}
            </span>
          </div>
          <div className="d-flex justify-content-between mb-1">
            <span><i className="bi bi-gear me-1"></i>减速比:</span>
            <span className="fw-medium" style={{ fontSize: '0.75rem' }}>
              {formatRatios(product.ratios)}
            </span>
          </div>
          {product.thrust && (
            <div className="d-flex justify-content-between mb-1">
              <span><i className="bi bi-arrows-expand me-1"></i>推力:</span>
              <span className="fw-medium">{product.thrust} kN</span>
            </div>
          )}
        </div>

        {/* 接口标签 */}
        {formatInterfaces(product.inputInterfaces) && (
          <div className="mt-2">
            {formatInterfaces(product.inputInterfaces)}
          </div>
        )}
      </Card.Body>

      {/* 底部：价格和操作 */}
      <Card.Footer
        className="bg-transparent border-top-0 pt-0 pb-2 px-2"
        style={{ borderColor: colors.border }}
      >
        <div className="d-flex justify-content-between align-items-center mb-2">
          <span
            className="fw-bold"
            style={{
              fontSize: '1.1rem',
              color: product.displayPrice > 0 ? '#dc3545' : colors.textMuted
            }}
          >
            {formatPrice(product.displayPrice)}
          </span>
          {product.weight && (
            <span className="small text-muted">{product.weight} kg</span>
          )}
        </div>

        <div className="d-flex gap-1">
          <OverlayTrigger
            placement="top"
            overlay={<Tooltip>{isInCompare ? '移出对比' : '加入对比'}</Tooltip>}
          >
            <Button
              variant={isInCompare ? 'primary' : 'outline-primary'}
              size="sm"
              className="flex-grow-1"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCompare(product);
              }}
            >
              <i className={`bi ${isInCompare ? 'bi-check-lg' : 'bi-plus-lg'} me-1`}></i>
              对比
            </Button>
          </OverlayTrigger>
          <Button
            variant="outline-success"
            size="sm"
            className="flex-grow-1"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetail(product);
            }}
          >
            <i className="bi bi-eye me-1"></i>详情
          </Button>
        </div>
      </Card.Footer>
    </Card>
  );
};

export default ProductCard;
