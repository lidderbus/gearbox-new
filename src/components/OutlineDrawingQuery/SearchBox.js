// src/components/OutlineDrawingQuery/SearchBox.js
// Search input with history dropdown
import React from 'react';
import { Card, InputGroup, Form, Button, ListGroup } from 'react-bootstrap';

/**
 * Search box component with search history
 */
const SearchBox = ({
  searchKeyword,
  onSearch,
  onSearchSubmit,
  onClear,
  filterType,
  onFilterType,
  searchHistory = [],
  showSearchHistory,
  onShowHistory,
  onHideHistory,
  onSelectHistory,
  onClearHistory,
  colors = {}
}) => {
  return (
    <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Body>
        <div style={{ position: 'relative' }}>
          <InputGroup>
            <InputGroup.Text style={{ backgroundColor: colors.headerBg, color: colors.text }}>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              type="text"
              className="dwg-search-input"
              placeholder="输入型号搜索 (如: HC400, HGTHT4) - Ctrl+F快捷搜索"
              value={searchKeyword}
              onChange={onSearch}
              onKeyDown={onSearchSubmit}
              onFocus={() => searchHistory.length > 0 && onShowHistory()}
              onBlur={() => setTimeout(onHideHistory, 200)}
              style={{
                backgroundColor: colors.card,
                color: colors.text,
                borderColor: colors.border
              }}
            />
            {searchKeyword && (
              <Button
                variant="outline-secondary"
                onClick={onClear}
              >
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>

          {/* Search history dropdown */}
          {showSearchHistory && searchHistory.length > 0 && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                backgroundColor: colors.card,
                border: `1px solid ${colors.border}`,
                borderRadius: '0 0 4px 4px',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                zIndex: 1000
              }}
            >
              <div className="d-flex justify-content-between align-items-center p-2 border-bottom" style={{ borderColor: colors.border }}>
                <small className="text-muted">
                  <i className="bi bi-clock-history me-1"></i>搜索历史
                </small>
                <Button variant="link" size="sm" className="p-0 text-danger" onClick={onClearHistory}>
                  清除
                </Button>
              </div>
              <ListGroup variant="flush">
                {searchHistory.map((term, index) => (
                  <ListGroup.Item
                    key={index}
                    action
                    onClick={() => onSelectHistory(term)}
                    style={{
                      backgroundColor: 'transparent',
                      color: colors.text,
                      cursor: 'pointer'
                    }}
                  >
                    <i className="bi bi-search me-2 text-muted"></i>
                    {term}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          )}
        </div>

        {/* Type filter */}
        <div className="mt-2 d-flex justify-content-between align-items-center">
          <div>
            <Button
              variant={filterType === 'all' ? 'primary' : 'outline-secondary'}
              size="sm"
              className="me-2"
              onClick={() => onFilterType('all')}
            >
              全部
            </Button>
            <Button
              variant={filterType === 'gearbox' ? 'primary' : 'outline-secondary'}
              size="sm"
              className="me-2"
              onClick={() => onFilterType('gearbox')}
            >
              <i className="bi bi-gear-wide-connected me-1"></i>齿轮箱
            </Button>
            <Button
              variant={filterType === 'coupling' ? 'success' : 'outline-secondary'}
              size="sm"
              onClick={() => onFilterType('coupling')}
            >
              <i className="bi bi-link-45deg me-1"></i>联轴器
            </Button>
          </div>
          <small className="text-muted">
            <kbd>Alt+1~7</kbd> 切换标签页
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SearchBox;
