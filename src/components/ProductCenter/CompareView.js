// src/components/ProductCenter/CompareView.js
// 产品对比表格视图

import React from 'react';
import { Modal, Table, Button, Badge, ProgressBar } from 'react-bootstrap';

// 对比参数配置
const COMPARE_FIELDS = [
  { key: 'seriesLabel', label: '系列', type: 'text' },
  { key: 'minPower', label: '最小功率 (kW)', type: 'number', compare: 'higher' },
  { key: 'maxPower', label: '最大功率 (kW)', type: 'number', compare: 'higher' },
  { key: 'minSpeed', label: '最小转速 (rpm)', type: 'number' },
  { key: 'maxSpeed', label: '最大转速 (rpm)', type: 'number' },
  { key: 'thrust', label: '额定推力 (kN)', type: 'number', compare: 'higher' },
  { key: 'weight', label: '重量 (kg)', type: 'number', compare: 'lower' },
  { key: 'efficiency', label: '传动效率', type: 'percent' },
  { key: 'controlType', label: '控制方式', type: 'text' },
  { key: 'centerDistance', label: '中心距 (mm)', type: 'number' },
  { key: 'dimensions', label: '外形尺寸', type: 'text' },
  { key: 'displayPrice', label: '市场价 (元)', type: 'price', compare: 'lower' }
];

const CompareView = ({
  show,
  onHide,
  products,
  onRemove,
  onGenerateQuotation,
  colors = {},
  theme = 'light'
}) => {
  if (!products || products.length === 0) return null;

  // 获取最大/最小值用于高亮
  const getFieldStats = (key) => {
    const values = products.map(p => {
      const val = p[key];
      return typeof val === 'number' ? val : 0;
    }).filter(v => v > 0);

    return {
      min: Math.min(...values),
      max: Math.max(...values)
    };
  };

  // 格式化值
  const formatValue = (product, field) => {
    const value = product[field.key];

    if (value === undefined || value === null || value === 0) {
      return <span className="text-muted">-</span>;
    }

    switch (field.type) {
      case 'percent':
        return `${(value * 100).toFixed(0)}%`;
      case 'price':
        return `¥${value.toLocaleString()}`;
      case 'number':
        return value.toLocaleString();
      default:
        return value;
    }
  };

  // 渲染价格柱状图
  const renderPriceBar = (product) => {
    const prices = products.map(p => p.displayPrice || 0).filter(p => p > 0);
    if (prices.length === 0) return '-';

    const maxPrice = Math.max(...prices);
    const price = product.displayPrice || 0;
    const percent = maxPrice > 0 ? (price / maxPrice) * 100 : 0;

    if (price === 0) return <span className="text-muted">询价</span>;

    return (
      <div>
        <div className="d-flex justify-content-between small mb-1">
          <span>¥{price.toLocaleString()}</span>
        </div>
        <ProgressBar
          now={percent}
          variant={percent < 50 ? 'success' : percent < 80 ? 'warning' : 'danger'}
          style={{ height: '8px' }}
        />
      </div>
    );
  };

  // 判断是否高亮（最优值）
  const isHighlighted = (product, field) => {
    if (!field.compare) return false;

    const stats = getFieldStats(field.key);
    const value = product[field.key];

    if (typeof value !== 'number' || value === 0) return false;

    if (field.compare === 'higher') {
      return value === stats.max;
    } else if (field.compare === 'lower') {
      return value === stats.min;
    }
    return false;
  };

  // 格式化减速比
  const formatRatios = (ratios) => {
    if (!ratios || ratios.length === 0) return '-';
    return `${Math.min(...ratios).toFixed(2)} - ${Math.max(...ratios).toFixed(2)} (${ratios.length}档)`;
  };

  // 格式化接口
  const formatInterfaces = (interfaces) => {
    if (!interfaces) return <span className="text-muted">无数据</span>;

    const badges = [];
    if (interfaces.sae && interfaces.sae.length > 0) {
      badges.push(
        <Badge key="sae" bg="primary" className="me-1">
          SAE×{interfaces.sae.length}
        </Badge>
      );
    }
    if (interfaces.domestic && interfaces.domestic.length > 0) {
      badges.push(
        <Badge key="domestic" bg="info">
          国内机×{interfaces.domestic.length}
        </Badge>
      );
    }
    return badges.length > 0 ? badges : <span className="text-muted">无</span>;
  };

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: colors.headerBg || '#f8f9fa',
          borderColor: colors.border
        }}
      >
        <Modal.Title>
          <i className="bi bi-columns-gap me-2"></i>
          产品对比
          <Badge bg="primary" className="ms-2">{products.length}个型号</Badge>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: colors.card }} className="p-0">
        <div className="table-responsive">
          <Table bordered hover className="mb-0" style={{ backgroundColor: colors.card }}>
            <thead>
              <tr>
                <th
                  className="sticky-top"
                  style={{
                    backgroundColor: colors.headerBg || '#f8f9fa',
                    minWidth: '120px'
                  }}
                >
                  参数
                </th>
                {products.map((product) => (
                  <th
                    key={product.model}
                    className="text-center sticky-top position-relative"
                    style={{
                      backgroundColor: colors.headerBg || '#f8f9fa',
                      minWidth: '180px'
                    }}
                  >
                    <Button
                      variant="link"
                      size="sm"
                      className="position-absolute p-0"
                      style={{ top: '4px', right: '8px' }}
                      onClick={() => onRemove(product)}
                      title="移除"
                    >
                      <i className="bi bi-x-lg text-danger"></i>
                    </Button>
                    <div className="fw-bold">{product.model}</div>
                    <Badge bg="secondary" className="mt-1">{product.seriesLabel}</Badge>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* 产品图片 */}
              <tr>
                <td className="table-secondary">产品图片</td>
                {products.map((product) => (
                  <td key={product.model} className="text-center">
                    <img
                      src={`https://omo-oss-image.thefastimg.com/portal-saas/pg2024010511133434452/cms/image/default_gearbox.png`}
                      alt={product.model}
                      style={{ maxHeight: '80px', maxWidth: '100%' }}
                    />
                  </td>
                ))}
              </tr>

              {/* 基本参数 */}
              {COMPARE_FIELDS.map((field) => (
                <tr key={field.key}>
                  <td className="table-secondary">{field.label}</td>
                  {products.map((product) => (
                    <td
                      key={product.model}
                      className={`text-center ${isHighlighted(product, field) ? 'table-success fw-bold' : ''}`}
                    >
                      {field.key === 'displayPrice'
                        ? renderPriceBar(product)
                        : formatValue(product, field)
                      }
                      {isHighlighted(product, field) && (
                        <i className="bi bi-star-fill text-warning ms-1" title="最优"></i>
                      )}
                    </td>
                  ))}
                </tr>
              ))}

              {/* 减速比 */}
              <tr>
                <td className="table-secondary">减速比范围</td>
                {products.map((product) => (
                  <td key={product.model} className="text-center">
                    {formatRatios(product.ratios)}
                  </td>
                ))}
              </tr>

              {/* 接口信息 */}
              <tr>
                <td className="table-secondary">输入接口</td>
                {products.map((product) => (
                  <td key={product.model} className="text-center">
                    {formatInterfaces(product.inputInterfaces)}
                  </td>
                ))}
              </tr>

              {/* 备注 */}
              <tr>
                <td className="table-secondary">备注</td>
                {products.map((product) => (
                  <td key={product.model} className="text-center small">
                    {product.notes || '-'}
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: colors.headerBg, borderColor: colors.border }}>
        <Button variant="outline-success" onClick={() => onGenerateQuotation(products)}>
          <i className="bi bi-file-earmark-text me-1"></i>
          批量生成报价单
        </Button>
        <Button variant="secondary" onClick={onHide}>
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CompareView;
