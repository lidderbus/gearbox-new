// src/components/OutlineDrawingQuery/SearchResults.js
// Search results list component
import React from 'react';
import { Card, ListGroup, Badge, Alert } from 'react-bootstrap';

/**
 * Search results component
 */
const SearchResults = ({
  searchKeyword,
  searchResults,
  selectedModel,
  onModelSelect,
  colors = {}
}) => {
  if (!searchKeyword.trim()) return null;

  if (searchResults.length === 0) {
    return (
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        未找到匹配 "<strong>{searchKeyword}</strong>" 的图纸
      </Alert>
    );
  }

  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <i className="bi bi-list-ul me-2"></i>
        搜索结果 ({searchResults.length}项)
      </Card.Header>
      <ListGroup variant="flush">
        {searchResults.map((item, index) => (
          <ListGroup.Item
            key={`${item.type}-${item.model}-${index}`}
            action
            active={selectedModel?.model === item.model}
            onClick={() => onModelSelect(item.model, item.type)}
            style={{
              backgroundColor: selectedModel?.model === item.model
                ? colors.primary
                : colors.card,
              color: selectedModel?.model === item.model
                ? '#ffffff'
                : colors.text,
              borderColor: colors.border
            }}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Badge
                  bg={item.type === 'gearbox' ? 'primary' : 'success'}
                  className="me-2"
                >
                  {item.type === 'gearbox' ? '齿轮箱' : '联轴器'}
                </Badge>
                <strong>{item.model}</strong>
                {item.description && (
                  <small className="ms-2" style={{ opacity: 0.7 }}>
                    {item.description}
                  </small>
                )}
              </div>
              {item.recommended && (
                <Badge bg="warning" text="dark">
                  <i className="bi bi-star-fill me-1"></i>推荐
                </Badge>
              )}
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Card>
  );
};

export default SearchResults;
