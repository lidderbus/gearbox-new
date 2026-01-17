// src/components/OutlineDrawingQuery/DrawingViewer.js
// SVG Drawing viewer component
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import OutlineDrawingViewer from '../OutlineDrawingViewer';

/**
 * Drawing viewer component for SVG drawings
 */
const DrawingViewer = ({
  selectedModel,
  onClose,
  colors = {},
  theme = 'light'
}) => {
  if (!selectedModel) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Body className="text-center py-5">
          <i
            className="bi bi-image"
            style={{ fontSize: '64px', color: colors.text, opacity: 0.3 }}
          ></i>
          <p style={{ color: colors.text, opacity: 0.7 }} className="mt-3">
            请从左侧选择型号查看外形图
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header
        style={{ backgroundColor: colors.headerBg, color: colors.headerText }}
        className="d-flex justify-content-between align-items-center"
      >
        <span>
          <i className={`bi ${selectedModel.type === 'gearbox' ? 'bi-gear-wide-connected' : 'bi-link-45deg'} me-2`}></i>
          {selectedModel.model} 外形图
        </span>
        <Button
          variant="outline-secondary"
          size="sm"
          onClick={onClose}
        >
          <i className="bi bi-x"></i>
        </Button>
      </Card.Header>
      <Card.Body>
        <OutlineDrawingViewer
          model={selectedModel.model}
          drawingData={selectedModel.data}
          type={selectedModel.type}
          colors={colors}
          theme={theme}
        />
      </Card.Body>
    </Card>
  );
};

export default DrawingViewer;
