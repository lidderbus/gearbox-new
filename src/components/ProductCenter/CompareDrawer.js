// src/components/ProductCenter/CompareDrawer.js
// 底部对比抽屉栏

import React from 'react';
import { Button, Badge } from 'react-bootstrap';

const CompareDrawer = ({
  compareList,
  onRemove,
  onClear,
  onCompare,
  colors = {},
  theme = 'light'
}) => {
  if (compareList.length === 0) return null;

  const drawerStyle = {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme === 'dark' ? '#1a202c' : '#fff',
    borderTop: `2px solid ${colors.primary || '#0d6efd'}`,
    boxShadow: '0 -4px 20px rgba(0,0,0,0.15)',
    padding: '12px 20px',
    zIndex: 1050,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  };

  const itemStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: theme === 'dark' ? '#2d3748' : '#e9ecef',
    borderRadius: '20px',
    padding: '6px 12px',
    marginRight: '8px',
    fontSize: '0.9rem'
  };

  const closeButtonStyle = {
    background: 'none',
    border: 'none',
    padding: '0 0 0 8px',
    cursor: 'pointer',
    color: theme === 'dark' ? '#a0aec0' : '#6c757d',
    fontSize: '1rem'
  };

  return (
    <div style={drawerStyle}>
      <div className="d-flex align-items-center flex-wrap">
        <span className="me-3 fw-bold">
          <i className="bi bi-layers me-1"></i>
          对比列表
          <Badge bg="primary" className="ms-2">{compareList.length}/5</Badge>
        </span>

        <div className="d-flex flex-wrap">
          {compareList.map((product) => (
            <div key={product.model} style={itemStyle}>
              <span>{product.model}</span>
              <button
                style={closeButtonStyle}
                onClick={() => onRemove(product)}
                title="移除"
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="d-flex gap-2">
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onClear}
        >
          <i className="bi bi-trash me-1"></i>
          清空
        </Button>
        <Button
          variant="primary"
          size="sm"
          onClick={onCompare}
          disabled={compareList.length < 2}
        >
          <i className="bi bi-columns-gap me-1"></i>
          开始对比 ({compareList.length})
        </Button>
      </div>
    </div>
  );
};

export default CompareDrawer;
