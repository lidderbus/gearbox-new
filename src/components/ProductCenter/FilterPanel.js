// src/components/ProductCenter/FilterPanel.js
// 左侧筛选面板

import React from 'react';
import { Card, Form, Button, Badge, Accordion } from 'react-bootstrap';
import { SERIES_CONFIG, SORT_OPTIONS } from './useProductFilter';

// SAE接口选项
const SAE_OPTIONS = [
  'SAE10寸', 'SAE11.5寸', 'SAE14寸', 'SAE16寸',
  'SAE18寸', 'SAE21寸', 'SAE24寸', 'SAE30寸', 'SAE36寸'
];

// 国内机接口选项
const DOMESTIC_OPTIONS = [
  'φ290', 'φ350', 'φ405', 'φ450', 'φ480',
  'φ505', 'φ518', 'φ530', 'φ540', 'φ570',
  'φ640', 'φ730', 'φ860', 'φ920', 'φ1110'
];

const FilterPanel = ({
  filters,
  updateFilter,
  resetFilters,
  seriesCounts,
  totalCount,
  filteredCount,
  colors = {},
  theme = 'light'
}) => {
  const cardStyle = {
    backgroundColor: colors.card || '#fff',
    borderColor: colors.border || '#dee2e6'
  };

  const headerStyle = {
    backgroundColor: colors.headerBg || '#f8f9fa',
    color: colors.headerText || '#212529'
  };

  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  // 切换系列选中
  const toggleSeries = (seriesKey) => {
    const newSeries = filters.series.includes(seriesKey)
      ? filters.series.filter(s => s !== seriesKey)
      : [...filters.series, seriesKey];
    updateFilter('series', newSeries);
  };

  // 全选/清空系列
  const selectAllSeries = () => {
    updateFilter('series', SERIES_CONFIG.map(s => s.key));
  };

  const clearSeries = () => {
    updateFilter('series', []);
  };

  return (
    <Card style={cardStyle} className="shadow-sm">
      <Card.Header style={headerStyle} className="d-flex justify-content-between align-items-center">
        <span><i className="bi bi-funnel me-2"></i>筛选条件</span>
        <Badge bg="primary">{filteredCount} / {totalCount}</Badge>
      </Card.Header>
      <Card.Body className="p-0">
        <Accordion defaultActiveKey={['0', '1', '2']} alwaysOpen flush>
          {/* 搜索框 */}
          <div className="p-3 border-bottom">
            <Form.Group>
              <Form.Label className="small fw-bold">
                <i className="bi bi-search me-1"></i>快速搜索
              </Form.Label>
              <Form.Control
                type="text"
                placeholder="输入型号或关键字..."
                value={filters.searchText}
                onChange={(e) => updateFilter('searchText', e.target.value)}
                style={inputStyle}
                size="sm"
              />
            </Form.Group>
          </div>

          {/* 产品系列 */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>
              <i className="bi bi-collection me-2"></i>产品系列
              {filters.series.length > 0 && (
                <Badge bg="primary" className="ms-2">{filters.series.length}</Badge>
              )}
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex gap-1 mb-2">
                <Button variant="outline-primary" size="sm" onClick={selectAllSeries}>
                  全选
                </Button>
                <Button variant="outline-secondary" size="sm" onClick={clearSeries}>
                  清空
                </Button>
              </div>
              {SERIES_CONFIG.map(series => (
                <Form.Check
                  key={series.key}
                  type="checkbox"
                  id={`series-${series.key}`}
                  label={
                    <span>
                      {series.label}
                      <Badge bg="secondary" className="ms-1" pill>
                        {seriesCounts[series.key] || 0}
                      </Badge>
                    </span>
                  }
                  checked={filters.series.includes(series.key)}
                  onChange={() => toggleSeries(series.key)}
                  className="mb-1"
                />
              ))}
            </Accordion.Body>
          </Accordion.Item>

          {/* 功率范围 */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>
              <i className="bi bi-lightning me-2"></i>功率范围 (kW)
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="number"
                  placeholder="最小"
                  value={filters.powerRange[0]}
                  onChange={(e) => updateFilter('powerRange', [Number(e.target.value), filters.powerRange[1]])}
                  style={inputStyle}
                  size="sm"
                />
                <span>-</span>
                <Form.Control
                  type="number"
                  placeholder="最大"
                  value={filters.powerRange[1]}
                  onChange={(e) => updateFilter('powerRange', [filters.powerRange[0], Number(e.target.value)])}
                  style={inputStyle}
                  size="sm"
                />
              </div>
              <Form.Range
                min={0}
                max={3000}
                step={50}
                value={filters.powerRange[1]}
                onChange={(e) => updateFilter('powerRange', [filters.powerRange[0], Number(e.target.value)])}
                className="mt-2"
              />
            </Accordion.Body>
          </Accordion.Item>

          {/* 转速范围 */}
          <Accordion.Item eventKey="2">
            <Accordion.Header>
              <i className="bi bi-arrow-repeat me-2"></i>转速范围 (rpm)
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="number"
                  placeholder="最小"
                  value={filters.speedRange[0]}
                  onChange={(e) => updateFilter('speedRange', [Number(e.target.value), filters.speedRange[1]])}
                  style={inputStyle}
                  size="sm"
                />
                <span>-</span>
                <Form.Control
                  type="number"
                  placeholder="最大"
                  value={filters.speedRange[1]}
                  onChange={(e) => updateFilter('speedRange', [filters.speedRange[0], Number(e.target.value)])}
                  style={inputStyle}
                  size="sm"
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* 减速比范围 */}
          <Accordion.Item eventKey="3">
            <Accordion.Header>
              <i className="bi bi-gear me-2"></i>减速比范围
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex gap-2 align-items-center">
                <Form.Control
                  type="number"
                  step="0.1"
                  placeholder="最小"
                  value={filters.ratioRange[0]}
                  onChange={(e) => updateFilter('ratioRange', [Number(e.target.value), filters.ratioRange[1]])}
                  style={inputStyle}
                  size="sm"
                />
                <span>-</span>
                <Form.Control
                  type="number"
                  step="0.1"
                  placeholder="最大"
                  value={filters.ratioRange[1]}
                  onChange={(e) => updateFilter('ratioRange', [filters.ratioRange[0], Number(e.target.value)])}
                  style={inputStyle}
                  size="sm"
                />
              </div>
            </Accordion.Body>
          </Accordion.Item>

          {/* 接口类型 */}
          <Accordion.Item eventKey="4">
            <Accordion.Header>
              <i className="bi bi-plug me-2"></i>接口类型
            </Accordion.Header>
            <Accordion.Body>
              <Form.Group className="mb-2">
                <Form.Select
                  value={filters.interfaceType}
                  onChange={(e) => {
                    updateFilter('interfaceType', e.target.value);
                    updateFilter('interfaceSpec', '');
                  }}
                  style={inputStyle}
                  size="sm"
                >
                  <option value="全部">全部接口</option>
                  <option value="sae">SAE接口</option>
                  <option value="domestic">国内机接口</option>
                </Form.Select>
              </Form.Group>
              {filters.interfaceType === 'sae' && (
                <Form.Select
                  value={filters.interfaceSpec}
                  onChange={(e) => updateFilter('interfaceSpec', e.target.value)}
                  style={inputStyle}
                  size="sm"
                >
                  <option value="">选择SAE规格</option>
                  {SAE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Form.Select>
              )}
              {filters.interfaceType === 'domestic' && (
                <Form.Select
                  value={filters.interfaceSpec}
                  onChange={(e) => updateFilter('interfaceSpec', e.target.value)}
                  style={inputStyle}
                  size="sm"
                >
                  <option value="">选择国内机规格</option>
                  {DOMESTIC_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </Form.Select>
              )}
            </Accordion.Body>
          </Accordion.Item>

          {/* 价格范围 */}
          <Accordion.Item eventKey="5">
            <Accordion.Header>
              <i className="bi bi-currency-yen me-2"></i>价格范围 (元)
            </Accordion.Header>
            <Accordion.Body>
              <div className="d-flex gap-2 align-items-center mb-2">
                <Form.Control
                  type="number"
                  placeholder="最小"
                  value={filters.priceRange[0]}
                  onChange={(e) => updateFilter('priceRange', [Number(e.target.value), filters.priceRange[1]])}
                  style={inputStyle}
                  size="sm"
                />
                <span>-</span>
                <Form.Control
                  type="number"
                  placeholder="最大"
                  value={filters.priceRange[1]}
                  onChange={(e) => updateFilter('priceRange', [filters.priceRange[0], Number(e.target.value)])}
                  style={inputStyle}
                  size="sm"
                />
              </div>
              <Form.Check
                type="checkbox"
                id="hasPrice"
                label="仅显示有价格的产品"
                checked={filters.hasPrice}
                onChange={(e) => updateFilter('hasPrice', e.target.checked)}
              />
            </Accordion.Body>
          </Accordion.Item>

          {/* 排序方式 */}
          <Accordion.Item eventKey="6">
            <Accordion.Header>
              <i className="bi bi-sort-down me-2"></i>排序方式
            </Accordion.Header>
            <Accordion.Body>
              <Form.Select
                value={filters.sortBy}
                onChange={(e) => updateFilter('sortBy', e.target.value)}
                style={inputStyle}
                size="sm"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>

        {/* 重置按钮 */}
        <div className="p-3 border-top">
          <Button
            variant="outline-secondary"
            size="sm"
            className="w-100"
            onClick={resetFilters}
          >
            <i className="bi bi-arrow-counterclockwise me-1"></i>
            重置筛选条件
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default FilterPanel;
