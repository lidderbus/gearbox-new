// src/components/ProductCenter/ProductGrid.js
// 产品卡片网格

import React, { useState } from 'react';
import { Row, Col, Pagination, Form, Button, Dropdown } from 'react-bootstrap';
import ProductCard from './ProductCard';
import { SORT_OPTIONS } from './useProductFilter';

const PAGE_SIZE_OPTIONS = [12, 24, 48, 96];

const ProductGrid = ({
  products,
  onViewDetail,
  onToggleCompare,
  isInCompare,
  sortBy,
  onSortChange,
  onExport,
  colors = {},
  theme = 'light'
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(24);

  // 计算分页
  const totalPages = Math.ceil(products.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentProducts = products.slice(startIndex, endIndex);

  // 页码变化时重置到第一页
  const handlePageSizeChange = (newSize) => {
    setPageSize(newSize);
    setCurrentPage(1);
  };

  // 生成分页项
  const renderPaginationItems = () => {
    const items = [];
    const maxVisible = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      items.push(
        <Pagination.Item key={1} onClick={() => setCurrentPage(1)}>1</Pagination.Item>
      );
      if (startPage > 2) {
        items.push(<Pagination.Ellipsis key="start-ellipsis" disabled />);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <Pagination.Item
          key={i}
          active={i === currentPage}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </Pagination.Item>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(<Pagination.Ellipsis key="end-ellipsis" disabled />);
      }
      items.push(
        <Pagination.Item key={totalPages} onClick={() => setCurrentPage(totalPages)}>
          {totalPages}
        </Pagination.Item>
      );
    }

    return items;
  };

  return (
    <div>
      {/* 工具栏 */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
          <span className="text-muted">
            共 <strong>{products.length}</strong> 个产品
          </span>
          <span className="text-muted">|</span>
          <span className="text-muted small">
            显示 {startIndex + 1}-{Math.min(endIndex, products.length)}
          </span>
        </div>

        <div className="d-flex align-items-center gap-2">
          {/* 排序 */}
          <Form.Select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            size="sm"
            style={{ width: '150px' }}
          >
            {SORT_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </Form.Select>

          {/* 每页数量 */}
          <Dropdown>
            <Dropdown.Toggle variant="outline-secondary" size="sm">
              每页 {pageSize}
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {PAGE_SIZE_OPTIONS.map(size => (
                <Dropdown.Item
                  key={size}
                  active={pageSize === size}
                  onClick={() => handlePageSizeChange(size)}
                >
                  {size} 个
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>

          {/* 导出按钮 */}
          <Button variant="outline-success" size="sm" onClick={onExport}>
            <i className="bi bi-download me-1"></i>导出
          </Button>
        </div>
      </div>

      {/* 产品网格 */}
      {currentProducts.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={4} className="g-3">
          {currentProducts.map((product, index) => (
            <Col key={`${product.model}-${index}`}>
              <ProductCard
                product={product}
                onViewDetail={onViewDetail}
                onToggleCompare={onToggleCompare}
                isInCompare={isInCompare(product.model)}
                colors={colors}
                theme={theme}
              />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-5">
          <i className="bi bi-inbox display-1 text-muted"></i>
          <p className="mt-3 text-muted">没有找到符合条件的产品</p>
          <p className="small text-muted">请尝试调整筛选条件</p>
        </div>
      )}

      {/* 分页 */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(1)}
            />
            <Pagination.Prev
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
            />
            {renderPaginationItems()}
            <Pagination.Next
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
            />
            <Pagination.Last
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(totalPages)}
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ProductGrid;
