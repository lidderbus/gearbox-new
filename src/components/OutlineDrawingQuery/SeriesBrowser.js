// src/components/OutlineDrawingQuery/SeriesBrowser.js
// Gearbox and coupling series browser with accordion
import React from 'react';
import { Row, Col, Card, Accordion, Badge, ListGroup } from 'react-bootstrap';
import FavoriteButton from './FavoriteButton';

/**
 * Series browser component for gearbox and coupling
 */
const SeriesBrowser = ({
  gearboxSeries,
  couplingSeries,
  selectedModel,
  onModelSelect,
  getModelsForSeries,
  onToggleFavorite,
  colors = {}
}) => {
  return (
    <Row>
      {/* Gearbox series */}
      <Col md={6}>
        <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
            <i className="bi bi-gear-wide-connected me-2"></i>齿轮箱系列
          </Card.Header>
          <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Accordion flush>
              {gearboxSeries.map((series, index) => (
                <Accordion.Item
                  key={series.code}
                  eventKey={`gearbox-${index}`}
                  style={{ backgroundColor: colors.card }}
                >
                  <Accordion.Header>
                    <span style={{ color: colors.text }}>
                      <Badge bg="primary" className="me-2">{series.code}</Badge>
                      {series.name || series.code}
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {series.description && (
                      <p className="text-muted small mb-2">{series.description}</p>
                    )}
                    {series.powerRange && (
                      <p className="small mb-2">
                        <strong>功率范围:</strong> {series.powerRange}
                      </p>
                    )}
                    <ListGroup variant="flush">
                      {getModelsForSeries(series.code, 'gearbox').map((item) => (
                        <ListGroup.Item
                          key={item.model}
                          action
                          active={selectedModel?.model === item.model}
                          onClick={() => onModelSelect(item.model, 'gearbox')}
                          className="py-2 d-flex justify-content-between align-items-center"
                          style={{
                            backgroundColor: selectedModel?.model === item.model
                              ? colors.primary
                              : 'transparent',
                            color: selectedModel?.model === item.model
                              ? '#ffffff'
                              : colors.text
                          }}
                        >
                          <span>
                            {item.model}
                            {item.available === false && (
                              <Badge bg="secondary" className="ms-2" style={{ fontSize: '10px' }}>
                                待补充
                              </Badge>
                            )}
                          </span>
                          <FavoriteButton
                            model={item.model}
                            type="gearbox"
                            onToggle={onToggleFavorite}
                          />
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      </Col>

      {/* Coupling series */}
      <Col md={6}>
        <Card className="mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
            <i className="bi bi-link-45deg me-2"></i>联轴器系列
          </Card.Header>
          <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
            <Accordion flush>
              {couplingSeries.map((series, index) => (
                <Accordion.Item
                  key={series.code}
                  eventKey={`coupling-${index}`}
                  style={{ backgroundColor: colors.card }}
                >
                  <Accordion.Header>
                    <span style={{ color: colors.text }}>
                      <Badge bg="success" className="me-2">{series.code}</Badge>
                      {series.name || series.code}
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {series.description && (
                      <p className="text-muted small mb-2">{series.description}</p>
                    )}
                    {series.torqueRange && (
                      <p className="small mb-2">
                        <strong>扭矩范围:</strong> {series.torqueRange}
                      </p>
                    )}
                    <ListGroup variant="flush">
                      {getModelsForSeries(series.code, 'coupling').map((item) => (
                        <ListGroup.Item
                          key={item.model}
                          action
                          active={selectedModel?.model === item.model}
                          onClick={() => onModelSelect(item.model, 'coupling')}
                          className="py-2 d-flex justify-content-between align-items-center"
                          style={{
                            backgroundColor: selectedModel?.model === item.model
                              ? colors.primary
                              : 'transparent',
                            color: selectedModel?.model === item.model
                              ? '#ffffff'
                              : colors.text
                          }}
                        >
                          <span>
                            {item.model}
                            {item.recommended && (
                              <Badge bg="warning" text="dark" className="ms-2" style={{ fontSize: '10px' }}>
                                推荐
                              </Badge>
                            )}
                            {item.available === false && (
                              <Badge bg="secondary" className="ms-2" style={{ fontSize: '10px' }}>
                                待补充
                              </Badge>
                            )}
                          </span>
                          <FavoriteButton
                            model={item.model}
                            type="coupling"
                            onToggle={onToggleFavorite}
                          />
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SeriesBrowser;
