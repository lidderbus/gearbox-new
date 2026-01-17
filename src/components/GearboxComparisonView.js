// components/GearboxComparisonView.js
import React, { useState, useMemo } from 'react';
import { Card, Table, Badge, Form, Button, Modal, ListGroup, Row, Col } from 'react-bootstrap';

/**
 * Enhanced Gearbox Comparison Component
 * Supports two modes:
 * 1. Selection refinement - compare results from selection algorithm
 * 2. Manual comparison - directly choose models to compare
 */
const GearboxComparisonView = ({
  recommendations = [],
  selectedIndex = 0,
  onSelect,
  theme = 'light',
  colors = {},
  gearboxDatabase = []  // Full database for manual selection
}) => {
  // Column visibility state
  const [visibleColumns, setVisibleColumns] = useState({
    ratio: true,
    capacity: true,
    capacityMargin: true,
    thrust: false,
    weight: true,
    dimensions: false,
    price: true,
    score: true
  });

  // Manual comparison mode state
  const [isManualMode, setIsManualMode] = useState(false);
  const [manualModels, setManualModels] = useState([]);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [seriesFilter, setSeriesFilter] = useState('all');
  const [expandedRow, setExpandedRow] = useState(null);

  // Column definitions
  const columnConfig = {
    ratio: '减速比',
    capacity: '传递能力',
    capacityMargin: '余量',
    thrust: '推力',
    weight: '重量',
    dimensions: '尺寸',
    price: '价格',
    score: '匹配度'
  };

  // Get unique series for filter dropdown
  const seriesList = useMemo(() => {
    const series = [...new Set(gearboxDatabase.map(g => g.series).filter(Boolean))];
    return series.sort();
  }, [gearboxDatabase]);

  // Filter gearboxes for search modal
  const filteredGearboxes = useMemo(() => {
    if (!gearboxDatabase || gearboxDatabase.length === 0) return [];
    return gearboxDatabase.filter(g => {
      const matchesSearch = g.model?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSeries = seriesFilter === 'all' || g.series === seriesFilter;
      const notAlreadySelected = !manualModels.some(s => s.model === g.model);
      return matchesSearch && matchesSeries && notAlreadySelected;
    }).slice(0, 30);
  }, [gearboxDatabase, searchTerm, seriesFilter, manualModels]);

  // Data to display based on mode
  const displayData = isManualMode ? manualModels : recommendations;

  // Get capacity margin status
  const getCapacityMarginStatus = (margin) => {
    if (margin === undefined || margin === null) return { text: '-', color: 'secondary' };
    if (margin <= 5) return { text: '偏小', color: 'warning' };
    if (margin <= 15) return { text: '合适', color: 'success' };
    if (margin <= 30) return { text: '良好', color: 'primary' };
    return { text: '过大', color: 'danger' };
  };

  // Safe number formatting
  const safeNumberFormat = (value, decimals = 2) => {
    if (typeof value === 'number' && !isNaN(value)) return value.toFixed(decimals);
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'number') {
      return value[0].toFixed(decimals);
    }
    return '-';
  };

  // Add model to manual comparison
  const handleAddModel = (gearbox) => {
    if (manualModels.length < 6) {
      setManualModels(prev => [...prev, gearbox]);
    }
  };

  // Remove model from manual comparison
  const handleRemoveModel = (index) => {
    setManualModels(prev => prev.filter((_, i) => i !== index));
  };

  // Empty state
  if (!displayData || displayData.length === 0) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <div className="d-flex justify-content-between align-items-center">
            <span>齿轮箱比较</span>
            {gearboxDatabase.length > 0 && (
              <div className="d-flex gap-2">
                <Button
                  variant={!isManualMode ? 'light' : 'outline-light'}
                  size="sm"
                  onClick={() => setIsManualMode(false)}
                >
                  选型结果
                </Button>
                <Button
                  variant={isManualMode ? 'light' : 'outline-light'}
                  size="sm"
                  onClick={() => setIsManualMode(true)}
                >
                  手动对比
                </Button>
              </div>
            )}
          </div>
        </Card.Header>
        <Card.Body>
          <p style={{ color: colors.text }}>
            {isManualMode ? '点击下方按钮添加型号进行对比' : '没有可用的齿轮箱数据'}
          </p>
          {isManualMode && (
            <Button variant="primary" onClick={() => setShowSearchModal(true)}>
              + 添加型号
            </Button>
          )}
        </Card.Body>

        {/* Search Modal */}
        <ModelSearchModal
          show={showSearchModal}
          onHide={() => setShowSearchModal(false)}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          seriesFilter={seriesFilter}
          setSeriesFilter={setSeriesFilter}
          seriesList={seriesList}
          filteredGearboxes={filteredGearboxes}
          onAddModel={handleAddModel}
          manualModels={manualModels}
          colors={colors}
        />
      </Card>
    );
  }

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            齿轮箱比较 ({displayData.length} 个{isManualMode ? '已选' : '候选'})
          </span>
          {gearboxDatabase.length > 0 && (
            <div className="d-flex gap-2">
              <Button
                variant={!isManualMode ? 'light' : 'outline-light'}
                size="sm"
                onClick={() => setIsManualMode(false)}
              >
                选型结果
              </Button>
              <Button
                variant={isManualMode ? 'light' : 'outline-light'}
                size="sm"
                onClick={() => setIsManualMode(true)}
              >
                手动对比
              </Button>
            </div>
          )}
        </div>
      </Card.Header>
      <Card.Body style={{ padding: '1rem' }}>
        {/* Column Toggles */}
        <div className="mb-3 d-flex flex-wrap align-items-center gap-3">
          <span style={{ color: colors.muted, fontSize: '0.85rem' }}>显示列:</span>
          {Object.entries(columnConfig).map(([key, label]) => (
            <Form.Check
              key={key}
              type="switch"
              id={`col-${key}`}
              label={label}
              checked={visibleColumns[key]}
              onChange={(e) => setVisibleColumns(prev => ({
                ...prev,
                [key]: e.target.checked
              }))}
              style={{ fontSize: '0.85rem' }}
            />
          ))}
        </div>

        {/* Manual mode: Add button */}
        {isManualMode && (
          <div className="mb-3">
            <Button
              variant="success"
              size="sm"
              onClick={() => setShowSearchModal(true)}
              disabled={manualModels.length >= 6}
            >
              + 添加型号 {manualModels.length >= 6 && '(已达上限)'}
            </Button>
          </div>
        )}

        {/* Comparison Table */}
        <div style={{ overflowX: 'auto' }}>
          <Table hover bordered responsive style={{ marginBottom: 0, color: colors.text }}>
            <thead>
              <tr>
                {!isManualMode && <th style={{ width: '50px', textAlign: 'center' }}>选择</th>}
                <th>型号</th>
                <th>系列</th>
                {visibleColumns.ratio && <th>减速比</th>}
                {visibleColumns.capacity && <th>传递能力</th>}
                {visibleColumns.capacityMargin && <th>余量</th>}
                {visibleColumns.thrust && <th>推力(kN)</th>}
                {visibleColumns.weight && <th>重量(kg)</th>}
                {visibleColumns.dimensions && <th>尺寸(mm)</th>}
                {visibleColumns.price && <th>价格(元)</th>}
                {visibleColumns.score && <th style={{ width: '90px', textAlign: 'center' }}>匹配度</th>}
                {isManualMode && <th style={{ width: '60px' }}>操作</th>}
              </tr>
            </thead>
            <tbody>
              {displayData.map((gearbox, index) => {
                const marginStatus = getCapacityMarginStatus(gearbox.capacityMargin);
                const isExpanded = expandedRow === index;

                return (
                  <React.Fragment key={`${gearbox.model}-${index}`}>
                    <tr
                      onClick={() => {
                        if (!isManualMode) onSelect?.(index);
                        setExpandedRow(isExpanded ? null : index);
                      }}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: !isManualMode && index === selectedIndex ?
                          (theme === 'light' ? '#e8f5e9' : '#1a365d') : 'transparent'
                      }}
                    >
                      {!isManualMode && (
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <input
                            type="radio"
                            checked={index === selectedIndex}
                            onChange={() => onSelect?.(index)}
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                      )}
                      <td>
                        <strong>{gearbox.model}</strong>
                        <span style={{ marginLeft: '5px', color: colors.muted, fontSize: '0.8rem' }}>
                          {isExpanded ? '▼' : '▶'}
                        </span>
                      </td>
                      <td><Badge bg="secondary">{gearbox.series}</Badge></td>
                      {visibleColumns.ratio && (
                        <td>{gearbox.ratio?.toFixed(2) || gearbox.ratios?.[0]?.toFixed(2) || '-'}</td>
                      )}
                      {visibleColumns.capacity && (
                        <td>
                          {Array.isArray(gearbox.transferCapacity) && gearbox.ratios?.indexOf(gearbox.ratio) >= 0 ?
                            safeNumberFormat(gearbox.transferCapacity[gearbox.ratios.indexOf(gearbox.ratio)], 4) :
                            safeNumberFormat(gearbox.transferCapacity, 4)
                          }
                        </td>
                      )}
                      {visibleColumns.capacityMargin && (
                        <td>{gearbox.capacityMargin ? `${safeNumberFormat(gearbox.capacityMargin, 1)}%` : '-'}</td>
                      )}
                      {visibleColumns.thrust && <td>{gearbox.thrust || '-'}</td>}
                      {visibleColumns.weight && <td>{gearbox.weight || '-'}</td>}
                      {visibleColumns.dimensions && <td>{gearbox.dimensions || '-'}</td>}
                      {visibleColumns.price && (
                        <td>{gearbox.price ? gearbox.price.toLocaleString() : '-'}</td>
                      )}
                      {visibleColumns.score && (
                        <td style={{ textAlign: 'center', verticalAlign: 'middle' }}>
                          <Badge bg={marginStatus.color} style={{ fontSize: '0.8rem' }}>
                            {marginStatus.text}
                          </Badge>
                          {gearbox.score && (
                            <div style={{ fontSize: '0.7rem', color: colors.muted }}>
                              {gearbox.score}分
                            </div>
                          )}
                        </td>
                      )}
                      {isManualMode && (
                        <td style={{ textAlign: 'center' }}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveModel(index);
                            }}
                          >
                            ✕
                          </Button>
                        </td>
                      )}
                    </tr>

                    {/* Expanded Details Row */}
                    {isExpanded && (
                      <tr>
                        <td
                          colSpan={Object.values(visibleColumns).filter(Boolean).length + (isManualMode ? 3 : 4)}
                          style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748', padding: '1rem' }}
                        >
                          <Row>
                            <Col md={4}>
                              <strong>功率范围:</strong> {gearbox.minPower}-{gearbox.maxPower} kW
                            </Col>
                            <Col md={4}>
                              <strong>转速范围:</strong> {gearbox.minSpeed}-{gearbox.maxSpeed} rpm
                            </Col>
                            <Col md={4}>
                              <strong>控制方式:</strong> {gearbox.controlType || '-'}
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col md={8}>
                              <strong>全部减速比:</strong> {gearbox.ratios?.join(', ') || '-'}
                            </Col>
                            <Col md={4}>
                              <strong>联轴器:</strong> {gearbox.couplingConfig?.standard?.model || '-'}
                            </Col>
                          </Row>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </div>
      </Card.Body>

      {/* Search Modal */}
      <ModelSearchModal
        show={showSearchModal}
        onHide={() => setShowSearchModal(false)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        seriesFilter={seriesFilter}
        setSeriesFilter={setSeriesFilter}
        seriesList={seriesList}
        filteredGearboxes={filteredGearboxes}
        onAddModel={handleAddModel}
        manualModels={manualModels}
        colors={colors}
      />
    </Card>
  );
};

/**
 * Model Search Modal Component
 */
const ModelSearchModal = ({
  show,
  onHide,
  searchTerm,
  setSearchTerm,
  seriesFilter,
  setSeriesFilter,
  seriesList,
  filteredGearboxes,
  onAddModel,
  manualModels,
  colors
}) => {
  const isMaxReached = manualModels.length >= 6;

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <Modal.Title>添加型号进行对比</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ backgroundColor: colors.card }}>
        <div className="d-flex gap-2 mb-3">
          <Form.Control
            type="text"
            placeholder="搜索型号 (如: HCM400, HC1000)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 2 }}
            autoFocus
          />
          <Form.Select
            value={seriesFilter}
            onChange={(e) => setSeriesFilter(e.target.value)}
            style={{ flex: 1 }}
          >
            <option value="all">全部系列</option>
            {seriesList.map(series => (
              <option key={series} value={series}>{series}</option>
            ))}
          </Form.Select>
        </div>

        {isMaxReached && (
          <div className="alert alert-warning mb-3">
            已达到最大对比数量 (6)，请先移除已选型号
          </div>
        )}

        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <ListGroup>
            {filteredGearboxes.map(gearbox => (
              <ListGroup.Item
                key={gearbox.model}
                action
                onClick={() => {
                  if (!isMaxReached) {
                    onAddModel(gearbox);
                  }
                }}
                disabled={isMaxReached}
                className="d-flex justify-content-between align-items-center"
                style={{ cursor: isMaxReached ? 'not-allowed' : 'pointer' }}
              >
                <div>
                  <strong>{gearbox.model}</strong>
                  <Badge bg="secondary" className="ms-2">{gearbox.series}</Badge>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#6c757d' }}>
                  {gearbox.minPower}-{gearbox.maxPower}kW |
                  {gearbox.ratios?.length || 0}个速比 |
                  {gearbox.price ? `¥${gearbox.price.toLocaleString()}` : '价格待询'}
                </div>
              </ListGroup.Item>
            ))}
            {filteredGearboxes.length === 0 && (
              <ListGroup.Item className="text-center text-muted">
                {searchTerm ? '未找到匹配的型号' : '输入型号名称开始搜索'}
              </ListGroup.Item>
            )}
          </ListGroup>
        </div>
      </Modal.Body>
      <Modal.Footer style={{ backgroundColor: colors.card }}>
        <span className="me-auto text-muted">
          已选 {manualModels.length}/6 个型号
        </span>
        <Button variant="secondary" onClick={onHide}>关闭</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default GearboxComparisonView;
