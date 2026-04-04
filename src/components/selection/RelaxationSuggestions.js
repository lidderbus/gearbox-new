// src/components/selection/RelaxationSuggestions.js
// Displays constraint relaxation suggestions when selection fails
import React from 'react';
import { Alert, Badge, ListGroup } from 'react-bootstrap';

/**
 * Shows parameter adjustment suggestions that could unlock additional gearbox matches
 * Only rendered when selection fails and relaxation analysis found viable alternatives
 */
export default function RelaxationSuggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  return (
    <Alert variant="info" className="mt-3">
      <Alert.Heading className="h6">
        <i className="bi bi-lightbulb me-2"></i>参数调整建议
      </Alert.Heading>
      <small className="text-muted d-block mb-2">
        放宽以下参数可能找到更多匹配型号：
      </small>
      <ListGroup variant="flush" className="bg-transparent">
        {suggestions.map((s, i) => (
          <ListGroup.Item
            key={i}
            className="bg-transparent px-0 py-2 border-bottom"
          >
            <div className="d-flex justify-content-between align-items-start">
              <div>
                <strong>{s.parameter}</strong>
                <div className="small text-muted">
                  {s.currentValue} →{' '}
                  <span className="text-primary">{s.suggestedValue}</span>
                </div>
              </div>
              <Badge bg="primary" pill>
                +{s.additionalMatches} 型号
              </Badge>
            </div>
            {s.models && s.models.length > 0 && (
              <small className="text-muted">
                如: {s.models.join(', ')}
                {s.additionalMatches > s.models.length ? ' 等' : ''}
              </small>
            )}
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Alert>
  );
}
