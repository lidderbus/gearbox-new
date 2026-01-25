// src/components/ClauseKnowledgeBase/ClauseSearchPanel.js
// 条款搜索面板组件

import React from 'react';
import { Row, Col, Form, InputGroup, Button, Badge } from 'react-bootstrap';

/**
 * 条款搜索面板
 * 包含搜索框、分类筛选、系列筛选
 */
const ClauseSearchPanel = ({
  colors,
  searchTerm,
  setSearchTerm,
  activeCategory,
  setActiveCategory,
  activeSeries,
  setActiveSeries,
  categories,
  availableSeries,
  stats,
  onClear
}) => {
  // 判断是否有活跃的筛选条件
  const hasActiveFilters = searchTerm || activeCategory !== 'all' || activeSeries;

  return (
    <div
      className="clause-search-panel p-3 mb-3 rounded"
      style={{
        backgroundColor: colors?.card,
        border: `1px solid ${colors?.border}`
      }}
    >
      <Row className="g-3">
        {/* 搜索框 */}
        <Col md={6} lg={5}>
          <InputGroup>
            <InputGroup.Text style={{ backgroundColor: colors?.inputBg }}>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="搜索条款标题、内容或关键词..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                backgroundColor: colors?.inputBg,
                color: colors?.text,
                borderColor: colors?.border
              }}
            />
            {searchTerm && (
              <Button
                variant="outline-secondary"
                onClick={() => setSearchTerm('')}
                title="清除搜索"
              >
                <i className="bi bi-x-lg"></i>
              </Button>
            )}
          </InputGroup>
        </Col>

        {/* 分类筛选 */}
        <Col md={3} lg={3}>
          <Form.Select
            value={activeCategory}
            onChange={(e) => setActiveCategory(e.target.value)}
            style={{
              backgroundColor: colors?.inputBg,
              color: colors?.text,
              borderColor: colors?.border
            }}
          >
            <option value="all">
              全部分类 ({stats.total})
            </option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name} ({stats.byCategory[cat.id] || 0})
              </option>
            ))}
          </Form.Select>
        </Col>

        {/* 系列筛选 */}
        <Col md={3} lg={3}>
          <Form.Select
            value={activeSeries}
            onChange={(e) => setActiveSeries(e.target.value)}
            style={{
              backgroundColor: colors?.inputBg,
              color: colors?.text,
              borderColor: colors?.border
            }}
          >
            <option value="">全部系列</option>
            {availableSeries.map(series => (
              <option key={series} value={series}>
                {series} ({stats.bySeries[series] || 0})
              </option>
            ))}
          </Form.Select>
        </Col>

        {/* 清除筛选按钮 */}
        <Col md={12} lg={1} className="d-flex align-items-center">
          {hasActiveFilters && (
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={onClear}
              className="w-100"
              title="清除所有筛选"
            >
              <i className="bi bi-arrow-counterclockwise me-1"></i>
              重置
            </Button>
          )}
        </Col>
      </Row>

      {/* 分类快捷标签 */}
      <div className="clause-category-tags mt-3 d-flex flex-wrap gap-2">
        <Badge
          bg={activeCategory === 'all' ? 'primary' : 'secondary'}
          className="clause-category-tag"
          style={{ cursor: 'pointer' }}
          onClick={() => setActiveCategory('all')}
        >
          <i className="bi bi-grid me-1"></i>
          全部
        </Badge>
        {categories.map(cat => (
          <Badge
            key={cat.id}
            bg={activeCategory === cat.id ? 'primary' : 'secondary'}
            className="clause-category-tag"
            style={{ cursor: 'pointer' }}
            onClick={() => setActiveCategory(cat.id)}
          >
            <i className={`${cat.icon} me-1`}></i>
            {cat.name}
            <span className="ms-1 opacity-75">
              {stats.byCategory[cat.id] || 0}
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
};

export default ClauseSearchPanel;
