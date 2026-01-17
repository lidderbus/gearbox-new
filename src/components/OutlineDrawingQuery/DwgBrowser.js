// src/components/OutlineDrawingQuery/DwgBrowser.js
// DWG file browser component
import React from 'react';
import { Card, InputGroup, Form, Button, Accordion, Badge, ListGroup, Alert } from 'react-bootstrap';
import FavoriteButton from './FavoriteButton';

/**
 * DWG file browser component
 */
const DwgBrowser = ({
  dwgStats,
  dwgSearchKeyword,
  onSearchChange,
  onClearSearch,
  dwgSearchResults,
  dwgSeries,
  dwgSeriesInfo,
  getDwgFilesBySeries,
  selectedDwgFile,
  onSelectFile,
  onToggleFavorite,
  colors = {}
}) => {
  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <i className="bi bi-file-earmark-binary me-2"></i>
        DWG图纸系列
        <Badge bg="info" className="ms-2">{dwgStats.total}个文件</Badge>
      </Card.Header>
      <Card.Body style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {/* DWG search box */}
        <InputGroup className="mb-3">
          <InputGroup.Text style={{ backgroundColor: colors.headerBg, color: colors.text }}>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
          <Form.Control
            type="text"
            placeholder="搜索DWG文件..."
            value={dwgSearchKeyword}
            onChange={(e) => onSearchChange(e.target.value)}
            style={{
              backgroundColor: colors.card,
              color: colors.text,
              borderColor: colors.border
            }}
          />
          {dwgSearchKeyword && (
            <Button
              variant="outline-secondary"
              onClick={onClearSearch}
            >
              <i className="bi bi-x"></i>
            </Button>
          )}
        </InputGroup>

        {/* Search results or series browse */}
        {dwgSearchKeyword.trim() ? (
          // Show search results
          dwgSearchResults.length > 0 ? (
            <ListGroup variant="flush">
              {dwgSearchResults.map((file, index) => (
                <ListGroup.Item
                  key={file.id || index}
                  action
                  active={selectedDwgFile?.id === file.id}
                  onClick={() => onSelectFile(file)}
                  style={{
                    backgroundColor: selectedDwgFile?.id === file.id
                      ? colors.primary
                      : colors.card,
                    color: selectedDwgFile?.id === file.id
                      ? '#ffffff'
                      : colors.text,
                    borderColor: colors.border
                  }}
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <Badge bg={file.type === 'gearbox' ? 'primary' : 'success'} className="me-2">
                        {file.type === 'gearbox' ? '齿轮箱' : '联轴器'}
                      </Badge>
                      <strong>{file.model}</strong>
                    </div>
                    <small style={{ opacity: 0.7 }}>{file.fileSize}</small>
                  </div>
                  <small style={{ opacity: 0.7 }}>{file.fileName}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          ) : (
            <Alert variant="info">
              <i className="bi bi-info-circle me-2"></i>
              未找到匹配 "<strong>{dwgSearchKeyword}</strong>" 的DWG文件
            </Alert>
          )
        ) : (
          // Show series browse
          <Accordion flush>
            {dwgSeries.map((series, index) => {
              const seriesInfo = dwgSeriesInfo[series.code] || {};
              const files = getDwgFilesBySeries(series.code);
              return (
                <Accordion.Item
                  key={series.code}
                  eventKey={`dwg-${index}`}
                  style={{ backgroundColor: colors.card }}
                >
                  <Accordion.Header>
                    <span style={{ color: colors.text }}>
                      <Badge
                        bg={seriesInfo.type === 'coupling' ? 'success' : 'primary'}
                        className="me-2"
                      >
                        {series.code}
                      </Badge>
                      {seriesInfo.name || `${series.code}系列`}
                      <small className="ms-2 text-muted">({series.count})</small>
                    </span>
                  </Accordion.Header>
                  <Accordion.Body>
                    {seriesInfo.description && (
                      <p className="text-muted small mb-2">{seriesInfo.description}</p>
                    )}
                    <ListGroup variant="flush">
                      {files.map((file, fileIndex) => (
                        <ListGroup.Item
                          key={file.id || fileIndex}
                          action
                          active={selectedDwgFile?.id === file.id}
                          onClick={() => onSelectFile(file)}
                          className="py-2"
                          style={{
                            backgroundColor: selectedDwgFile?.id === file.id
                              ? colors.primary
                              : 'transparent',
                            color: selectedDwgFile?.id === file.id
                              ? '#ffffff'
                              : colors.text
                          }}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <span>{file.model}</span>
                            <div className="d-flex align-items-center">
                              <small style={{ opacity: 0.7 }}>{file.fileSize}</small>
                              <FavoriteButton
                                model={file.model}
                                type={file.type || 'gearbox'}
                                onToggle={onToggleFavorite}
                              />
                            </div>
                          </div>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Accordion.Body>
                </Accordion.Item>
              );
            })}
          </Accordion>
        )}
      </Card.Body>
    </Card>
  );
};

export default DwgBrowser;
