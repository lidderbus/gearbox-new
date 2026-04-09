// src/components/ApplicationScenarioSelector.js
// Application Scenario Recommender (E3) - clickable scenario cards that fill input form
import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Badge, Form } from 'react-bootstrap';
import { SELECTION_PRESETS } from '../data/selectionPresets';

const ApplicationScenarioSelector = ({ onApplyPreset, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const categories = useMemo(() => Object.entries(SELECTION_PRESETS).map(([key, val]) => ({
    key, ...val
  })), []);

  const filteredPresets = useMemo(() => {
    let allPresets = [];
    categories.forEach(cat => {
      if (selectedCategory && cat.key !== selectedCategory) return;
      cat.presets.forEach(p => {
        if (searchTerm && !p.name.includes(searchTerm) && !p.description.includes(searchTerm)) return;
        allPresets.push({ ...p, categoryIcon: cat.icon, categoryName: cat.category });
      });
    });
    return allPresets;
  }, [categories, selectedCategory, searchTerm]);

  return (
    <div className="scenario-selector">
      <div className="d-flex gap-2 mb-3 flex-wrap">
        <Form.Control
          size="sm"
          placeholder="搜索船型..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{ maxWidth: 200 }}
        />
        <div className="d-flex gap-1 flex-wrap">
          <Badge
            bg={selectedCategory ? 'light' : 'primary'}
            text={selectedCategory ? 'dark' : 'white'}
            role="button"
            onClick={() => setSelectedCategory('')}
            className="px-2 py-1"
          >
            全部
          </Badge>
          {categories.map(cat => (
            <Badge
              key={cat.key}
              bg={selectedCategory === cat.key ? 'primary' : 'light'}
              text={selectedCategory === cat.key ? 'white' : 'dark'}
              role="button"
              onClick={() => setSelectedCategory(cat.key)}
              className="px-2 py-1"
            >
              {cat.icon} {cat.category}
            </Badge>
          ))}
        </div>
      </div>
      <Row xs={1} sm={2} md={3} lg={4} className="g-2">
        {filteredPresets.map(preset => (
          <Col key={preset.id}>
            <Card
              className="h-100 scenario-card"
              role="button"
              onClick={() => {
                onApplyPreset(preset.params);
                if (onClose) onClose();
              }}
              style={{ cursor: 'pointer', transition: 'box-shadow .2s', fontSize: '0.85rem' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = ''; }}
            >
              <Card.Body className="p-2">
                <div className="d-flex align-items-center mb-1">
                  <span className="me-1" style={{ fontSize: '1.2rem' }}>{preset.categoryIcon}</span>
                  <strong>{preset.name}</strong>
                </div>
                <div className="text-muted small mb-2">{preset.description}</div>
                <div className="d-flex flex-wrap gap-1">
                  <Badge bg="info" className="fw-normal">{preset.params.motorPower}kW</Badge>
                  <Badge bg="secondary" className="fw-normal">{preset.params.motorSpeed}rpm</Badge>
                  <Badge bg="success" className="fw-normal">i={preset.params.targetRatio}</Badge>
                  {preset.params.thrust > 0 && (
                    <Badge bg="warning" text="dark" className="fw-normal">{preset.params.thrust}kN</Badge>
                  )}
                </div>
                {preset.recommendedSeries && (
                  <div className="mt-1 small text-muted">
                    推荐系列: {preset.recommendedSeries.join(', ')}
                  </div>
                )}
                {preset.certifications && (
                  <div className="small text-muted">
                    船级社: {preset.certifications.join(', ')}
                  </div>
                )}
                {preset.controlType && (
                  <div className="small text-muted">
                    操控: {preset.controlType}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      {filteredPresets.length === 0 && (
        <div className="text-center text-muted py-4">未找到匹配的应用场景</div>
      )}
    </div>
  );
};

export default ApplicationScenarioSelector;
