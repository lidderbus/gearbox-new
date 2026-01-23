/**
 * 品牌选择器组件
 * Brand Selector Component
 *
 * 创建日期: 2026-01-04
 * 版本: 1.0.0
 *
 * 功能:
 *   - 多品牌切换选择
 *   - 品牌信息展示
 *   - 品牌功率范围对比
 *   - 混动支持状态显示
 */

import React, { useState, useMemo } from 'react';
import { Card, Form, Row, Col, Badge, OverlayTrigger, Tooltip, Collapse } from 'react-bootstrap';
import {
  BRAND_IDS,
  DEFAULT_BRAND,
  BRAND_CONFIG,
  BRAND_LIST,
  getBrandConfig,
  isBrandHybridEnabled,
  getBrandsForPower
} from '../data/brandConfig';

/**
 * 品牌Logo占位符
 */
const BrandLogo = ({ brand, size = 40 }) => {
  const colors = {
    [BRAND_IDS.ADVANCE]: '#1E3A8A',
    [BRAND_IDS.CHONGCHI]: '#059669',
    [BRAND_IDS.NGC]: '#DC2626',
    [BRAND_IDS.ZF_MARINE]: '#7C3AED'
  };

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '8px',
        backgroundColor: colors[brand.id] || '#6B7280',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: size * 0.4
      }}
    >
      {brand.shortNameEN?.substring(0, 2) || brand.id.substring(0, 2)}
    </div>
  );
};

/**
 * 品牌卡片组件
 */
const BrandCard = ({ brand, isSelected, onSelect, disabled = false, themeColors = {} }) => {
  const config = getBrandConfig(brand.id);
  const hybridEnabled = isBrandHybridEnabled(brand.id);

  return (
    <Card
      onClick={() => !disabled && onSelect(brand.id)}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        border: isSelected ? '2px solid #3B82F6' : '1px solid #E5E7EB',
        backgroundColor: disabled ? '#F3F4F6' : (themeColors.card || '#FFFFFF'),
        opacity: disabled ? 0.6 : 1,
        transition: 'all 0.2s ease'
      }}
      className="mb-2"
    >
      <Card.Body className="p-2">
        <Row className="align-items-center">
          <Col xs="auto">
            <BrandLogo brand={brand} size={36} />
          </Col>
          <Col>
            <div style={{ fontWeight: 600, fontSize: '0.95rem', color: themeColors.text || '#1F2937' }}>
              {brand.shortName}
            </div>
            <div style={{ fontSize: '0.75rem', color: themeColors.muted || '#6B7280' }}>
              {config?.powerRange ? `${config.powerRange.min}-${config.powerRange.max} kW` : '-'}
            </div>
          </Col>
          <Col xs="auto">
            <div className="d-flex flex-column align-items-end">
              {isSelected && (
                <Badge bg="primary" className="mb-1" style={{ fontSize: '0.65rem' }}>
                  当前
                </Badge>
              )}
              {hybridEnabled && (
                <Badge bg="success" style={{ fontSize: '0.65rem' }}>
                  混动
                </Badge>
              )}
              {brand.isPrimary && (
                <Badge bg="warning" text="dark" style={{ fontSize: '0.65rem' }}>
                  主
                </Badge>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

/**
 * 品牌详情面板
 */
const BrandDetailPanel = ({ brandId, themeColors = {} }) => {
  const config = getBrandConfig(brandId);

  if (!config) return null;

  return (
    <Card className="mt-2" style={{ backgroundColor: themeColors.card || '#F9FAFB' }}>
      <Card.Body className="p-2">
        <div style={{ fontSize: '0.85rem', color: themeColors.text || '#374151' }}>
          <Row>
            <Col xs={6}>
              <strong>品牌:</strong> {config.name}
            </Col>
            <Col xs={6}>
              <strong>国家:</strong> {config.country === 'CN' ? '中国' : config.country === 'DE' ? '德国' : config.country}
            </Col>
          </Row>
          <Row className="mt-1">
            <Col xs={6}>
              <strong>功率范围:</strong> {config?.powerRange?.min || 0}-{config?.powerRange?.max || 0} kW
            </Col>
            <Col xs={6}>
              <strong>混动支持:</strong> {config.hybridSupport.available ? '是' : '否'}
            </Col>
          </Row>
          <Row className="mt-1">
            <Col xs={12}>
              <strong>产品系列:</strong> {config.series.slice(0, 5).join(', ')}{config.series.length > 5 ? '...' : ''}
            </Col>
          </Row>
          <Row className="mt-1">
            <Col xs={12}>
              <strong>认证资质:</strong> {config.certifications.join(', ')}
            </Col>
          </Row>
          {config.dataSource !== 'primary' && (
            <Row className="mt-1">
              <Col xs={12}>
                <Badge bg="info" style={{ fontSize: '0.7rem' }}>
                  数据状态: {config.dataSource === 'estimated' ? '待完善' : '部分导入'}
                </Badge>
              </Col>
            </Row>
          )}
        </div>
      </Card.Body>
    </Card>
  );
};

/**
 * 品牌选择器主组件
 * @param {Object} props
 * @param {string} props.selectedBrand - 当前选中的品牌ID
 * @param {Function} props.onBrandChange - 品牌变更回调
 * @param {number} props.requiredPower - 所需功率 (用于筛选)
 * @param {boolean} props.showDetails - 是否显示详情
 * @param {boolean} props.collapsed - 是否折叠
 * @param {Object} props.colors - 主题颜色
 */
const BrandSelector = ({
  selectedBrand = DEFAULT_BRAND,
  onBrandChange,
  requiredPower = 0,
  showDetails = true,
  collapsed = true,
  colors = {}
}) => {
  const [isExpanded, setIsExpanded] = useState(!collapsed);
  const [showBrandDetail, setShowBrandDetail] = useState(false);

  // 根据功率筛选可用品牌
  const availableBrands = useMemo(() => {
    if (requiredPower > 0) {
      const eligibleBrandIds = getBrandsForPower(requiredPower);
      return BRAND_LIST.map(brand => ({
        ...brand,
        disabled: !eligibleBrandIds.includes(brand.id)
      }));
    }
    return BRAND_LIST.map(brand => ({ ...brand, disabled: false }));
  }, [requiredPower]);

  // 处理品牌选择
  const handleBrandSelect = (brandId) => {
    if (onBrandChange) {
      onBrandChange(brandId);
    }
    setShowBrandDetail(true);
  };

  // 当前选中品牌配置
  const selectedBrandConfig = getBrandConfig(selectedBrand);

  return (
    <Card
      className="mb-3"
      style={{
        backgroundColor: colors.card || '#FFFFFF',
        borderColor: colors.border || '#E5E7EB'
      }}
    >
      <Card.Header
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          cursor: 'pointer',
          backgroundColor: colors.headerBg || '#F3F4F6',
          color: colors.headerText || '#1F2937',
          borderBottomColor: colors.border || '#E5E7EB',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontWeight: 600 }}>品牌选择</span>
          <Badge bg="secondary" style={{ fontSize: '0.7rem' }}>
            {selectedBrandConfig?.shortName || selectedBrand}
          </Badge>
          {selectedBrandConfig?.hybridSupport?.available && (
            <Badge bg="success" style={{ fontSize: '0.65rem' }}>混动</Badge>
          )}
        </div>
        <span style={{ fontSize: '0.85rem', color: colors.muted || '#6B7280' }}>
          {isExpanded ? '▲ 收起' : '▼ 展开'}
        </span>
      </Card.Header>

      <Collapse in={isExpanded}>
        <div>
          <Card.Body className="p-3">
            {/* 品牌选择模式切换 */}
            <Form.Group className="mb-3">
              <Form.Label style={{ fontSize: '0.85rem', color: colors.text || '#374151' }}>
                选择齿轮箱品牌
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>选择不同品牌可查看对应的产品数据和混动配置</Tooltip>}
                >
                  <span style={{ cursor: 'help', marginLeft: '5px', color: '#6c757d', fontSize: '0.85em' }}>ⓘ</span>
                </OverlayTrigger>
              </Form.Label>
            </Form.Group>

            {/* 品牌列表 */}
            <Row>
              {availableBrands.map(brand => (
                <Col key={brand.id} xs={6} md={6} lg={3}>
                  <BrandCard
                    brand={brand}
                    isSelected={selectedBrand === brand.id}
                    onSelect={handleBrandSelect}
                    disabled={brand.disabled}
                    themeColors={colors}
                  />
                </Col>
              ))}
            </Row>

            {/* 功率筛选提示 */}
            {requiredPower > 0 && (
              <div className="mt-2" style={{ fontSize: '0.8rem', color: colors.muted || '#6B7280' }}>
                根据所需功率 {requiredPower} kW 筛选可用品牌
              </div>
            )}

            {/* 品牌详情 */}
            {showDetails && showBrandDetail && (
              <BrandDetailPanel brandId={selectedBrand} themeColors={colors} />
            )}

            {/* 品牌对比表 */}
            <div className="mt-3">
              <div
                style={{
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  color: colors.text || '#374151',
                  marginBottom: '8px'
                }}
              >
                品牌功率覆盖对比
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table
                  style={{
                    width: '100%',
                    fontSize: '0.75rem',
                    borderCollapse: 'collapse'
                  }}
                >
                  <thead>
                    <tr style={{ backgroundColor: colors.headerBg || '#F3F4F6' }}>
                      <th style={{ padding: '6px', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>品牌</th>
                      <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>功率范围</th>
                      <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>混动</th>
                      <th style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>数据状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {BRAND_LIST.map(brand => {
                      const cfg = getBrandConfig(brand.id);
                      return (
                        <tr
                          key={brand.id}
                          style={{
                            backgroundColor: selectedBrand === brand.id ? '#EBF5FF' : 'transparent'
                          }}
                        >
                          <td style={{ padding: '6px', borderBottom: '1px solid #E5E7EB' }}>
                            {cfg?.shortName}
                            {cfg?.isPrimary && <Badge bg="warning" text="dark" className="ms-1" style={{ fontSize: '0.6rem' }}>主</Badge>}
                          </td>
                          <td style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>
                            {cfg?.powerRange?.min || 0}-{cfg?.powerRange?.max || 0} kW
                          </td>
                          <td style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>
                            {cfg?.hybridSupport.available ? (
                              <Badge bg="success" style={{ fontSize: '0.65rem' }}>支持</Badge>
                            ) : (
                              <Badge bg="secondary" style={{ fontSize: '0.65rem' }}>-</Badge>
                            )}
                          </td>
                          <td style={{ padding: '6px', textAlign: 'center', borderBottom: '1px solid #E5E7EB' }}>
                            {cfg?.dataSource === 'primary' ? (
                              <Badge bg="success" style={{ fontSize: '0.65rem' }}>完整</Badge>
                            ) : cfg?.dataSource === 'imported' ? (
                              <Badge bg="info" style={{ fontSize: '0.65rem' }}>部分</Badge>
                            ) : (
                              <Badge bg="warning" text="dark" style={{ fontSize: '0.65rem' }}>待完善</Badge>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </Card.Body>
        </div>
      </Collapse>
    </Card>
  );
};

export default BrandSelector;
