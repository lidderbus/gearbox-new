/**
 * CompetitorDrawingCatalog.js
 * 竞品外形图/产品手册目录 — 左侧厂商浏览 + 右侧PDF预览
 */
import React, { useState, useMemo } from 'react';
import { Card, Row, Col, ListGroup, Badge, Button, Form, InputGroup, Alert } from 'react-bootstrap';
import CompetitorPdfViewer from './CompetitorPdfViewer';
import { competitors, manufacturerColors } from '../../data/competitorData';
import {
  getDrawingAvailability,
  getCatalogsForManufacturer,
  searchCompetitorDrawings,
  getCompetitorDrawingStats
} from '../../data/competitorDrawings';

const CompetitorDrawingCatalog = ({ colors = {} }) => {
  const [selectedMfg, setSelectedMfg] = useState(null);
  const [selectedCatalog, setSelectedCatalog] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');

  const availability = useMemo(() => getDrawingAvailability(), []);
  const stats = useMemo(() => getCompetitorDrawingStats(), []);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchKeyword.trim()) return null;
    return searchCompetitorDrawings(searchKeyword);
  }, [searchKeyword]);

  // 当前厂商的目录
  const currentMfgData = useMemo(() => {
    if (!selectedMfg) return null;
    return getCatalogsForManufacturer(selectedMfg);
  }, [selectedMfg]);

  const handleSelectMfg = (mfgId) => {
    setSelectedMfg(mfgId);
    setSelectedCatalog(null);
    setSearchKeyword('');
  };

  const handleSelectCatalog = (catalog) => {
    setSelectedCatalog(catalog);
  };

  const handleSearchResultClick = (result) => {
    setSelectedMfg(result.manufacturer);
    setSelectedCatalog(result);
    setSearchKeyword('');
  };

  // 有图纸的品牌排前面
  const sortedAvailability = useMemo(() => {
    return [...availability].sort((a, b) => {
      if (a.status === 'available' && b.status !== 'available') return -1;
      if (a.status !== 'available' && b.status === 'available') return 1;
      return a.name.localeCompare(b.name);
    });
  }, [availability]);

  return (
    <div className="mt-3">
      {/* 顶部统计和搜索 */}
      <Row className="mb-3">
        <Col md={6}>
          <div className="d-flex align-items-center gap-2">
            <Badge bg="success" className="px-3 py-2">
              <i className="bi bi-check-circle me-1"></i>
              {stats.availableManufacturers}家有图纸
            </Badge>
            <Badge bg="secondary" className="px-3 py-2">
              共{stats.totalCatalogs}份PDF文档
            </Badge>
            <Badge bg="light" text="dark" className="px-3 py-2 border">
              {stats.unavailableManufacturers}家暂无
            </Badge>
          </div>
        </Col>
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text>
              <i className="bi bi-search"></i>
            </InputGroup.Text>
            <Form.Control
              placeholder="搜索厂商、型号或文档..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            {searchKeyword && (
              <Button variant="outline-secondary" onClick={() => setSearchKeyword('')}>
                <i className="bi bi-x"></i>
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      {/* 搜索结果 */}
      {searchResults && searchResults.length > 0 && (
        <Card className="mb-3 border-primary">
          <Card.Header className="bg-primary text-white py-2">
            <i className="bi bi-search me-2"></i>
            搜索到 {searchResults.length} 个结果
          </Card.Header>
          <ListGroup variant="flush">
            {searchResults.map(result => (
              <ListGroup.Item
                key={result.id}
                action
                onClick={() => handleSearchResultClick(result)}
                className="d-flex justify-content-between align-items-center"
              >
                <div>
                  <Badge
                    style={{ backgroundColor: manufacturerColors[result.manufacturer] || '#999' }}
                    className="me-2"
                  >
                    {result.manufacturerName}
                  </Badge>
                  {result.title}
                </div>
                <Badge bg="light" text="dark">{result.year}</Badge>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Card>
      )}
      {searchResults && searchResults.length === 0 && (
        <Alert variant="warning" className="mb-3">
          <i className="bi bi-exclamation-triangle me-2"></i>
          未找到匹配 "{searchKeyword}" 的文档
        </Alert>
      )}

      {/* 主区域：左侧浏览 + 右侧预览 */}
      <Row>
        {/* 左栏：厂商列表 */}
        <Col lg={4} className="mb-3">
          <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
              <i className="bi bi-building me-2"></i>厂商列表
            </Card.Header>
            <ListGroup variant="flush" style={{ maxHeight: '700px', overflowY: 'auto' }}>
              {sortedAvailability.map(item => (
                <ListGroup.Item
                  key={item.manufacturer}
                  action
                  active={selectedMfg === item.manufacturer}
                  onClick={() => handleSelectMfg(item.manufacturer)}
                  className="d-flex justify-content-between align-items-center"
                  style={selectedMfg === item.manufacturer ? {
                    backgroundColor: item.color,
                    borderColor: item.color,
                    color: '#fff'
                  } : {}}
                >
                  <div className="d-flex align-items-center">
                    <div
                      style={{
                        width: 8, height: 8, borderRadius: '50%',
                        backgroundColor: item.status === 'available' ? '#28a745' : '#adb5bd',
                        marginRight: 8, flexShrink: 0
                      }}
                    />
                    <span>{item.name}</span>
                    {item.manufacturer !== 'HANGCHI' && competitors[item.manufacturer]?.country && (
                      <small className="ms-1 opacity-75">({competitors[item.manufacturer].country})</small>
                    )}
                  </div>
                  {item.status === 'available' && (
                    <Badge bg="success" pill>{item.catalogCount}</Badge>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          {/* 选中厂商的目录列表 */}
          {selectedMfg && currentMfgData && (
            <Card className="mt-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
              <Card.Header
                style={{
                  backgroundColor: manufacturerColors[selectedMfg] || '#6c757d',
                  color: '#fff'
                }}
              >
                <i className="bi bi-folder2-open me-2"></i>
                {competitors[selectedMfg]?.shortName || selectedMfg} 图册
              </Card.Header>

              {currentMfgData.status === 'available' ? (
                <ListGroup variant="flush">
                  {currentMfgData.catalogs.map(catalog => (
                    <ListGroup.Item
                      key={catalog.id}
                      action
                      active={selectedCatalog?.id === catalog.id}
                      onClick={() => handleSelectCatalog(catalog)}
                    >
                      <div className="d-flex align-items-start">
                        <i className="bi bi-file-earmark-pdf text-danger me-2 mt-1" style={{ fontSize: '1.2rem' }}></i>
                        <div>
                          <div className="fw-semibold" style={{ fontSize: '0.9rem' }}>{catalog.title}</div>
                          <div className="d-flex gap-1 mt-1">
                            {catalog.year && <Badge bg="info" className="fw-normal">{catalog.year}</Badge>}
                            {catalog.fileSize && <Badge bg="light" text="dark" className="border fw-normal">{catalog.fileSize}</Badge>}
                            {catalog.hasOutlineDrawings && <Badge bg="success" className="fw-normal">外形图</Badge>}
                          </div>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Card.Body>
                  <Alert variant="secondary" className="mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    {currentMfgData.reason}
                  </Alert>
                </Card.Body>
              )}
            </Card>
          )}
        </Col>

        {/* 右栏：PDF预览 */}
        <Col lg={8}>
          <CompetitorPdfViewer
            selectedCatalog={selectedCatalog}
            manufacturer={selectedMfg ? competitors[selectedMfg] : null}
            onClose={() => setSelectedCatalog(null)}
            colors={colors}
            theme={colors.headerBg ? 'dark' : 'light'}
          />
        </Col>
      </Row>
    </div>
  );
};

export default CompetitorDrawingCatalog;
