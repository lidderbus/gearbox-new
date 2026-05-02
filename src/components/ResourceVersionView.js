// src/components/ResourceVersionView.js
// 资料版本管理与更新通知组件
// 功能: 跟踪和展示资料库的版本变更,通知用户已更新的文档
// 创建时间: 2026-03-21

import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup, ListGroup, Tab, Tabs, Modal } from 'react-bootstrap';
import {
  getVersionRegistry,
  updateResourceVersion,
  getUpdatedResources,
  getRecentUpdates,
  getVersionStats,
  markAsViewed,
  hasUnviewedUpdate,
  batchUpdateVersions,
} from '../utils/resourceVersionManager';
import ECOPanel from './library/ECOPanel'; // P2-1
import AuditLogViewer from './library/AuditLogViewer'; // P3-3

const CATEGORY_LABELS = {
  manuals: { label: '产品说明书', icon: 'bi-book', color: 'primary' },
  templates: { label: '协议模板', icon: 'bi-file-earmark-text', color: 'success' },
  drawings: { label: '外形图纸', icon: 'bi-image', color: 'info' },
};

function ResourceVersionView({ theme, colors }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [registry, setRegistry] = useState(() => getVersionRegistry());
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = useMemo(() => getVersionStats(), [registry]);
  const updatedResources = useMemo(() => getUpdatedResources(), [registry]);
  const recentUpdates = useMemo(() => getRecentUpdates(180), [registry]);

  const handleMarkViewed = useCallback((category, id) => {
    markAsViewed(category, id);
    setRegistry(getVersionRegistry());
  }, []);

  const handleMarkAllViewed = useCallback(() => {
    updatedResources.forEach(r => markAsViewed(r.category, r.id));
    setRegistry(getVersionRegistry());
  }, [updatedResources]);

  const handleEditVersion = useCallback((category, id, info) => {
    setEditItem({ category, id, ...info });
    setShowEditModal(true);
  }, []);

  const handleSaveVersion = useCallback(() => {
    if (!editItem) return;
    updateResourceVersion(editItem.category, editItem.id, {
      version: editItem.version,
      updateDate: editItem.updateDate,
      notes: editItem.notes,
    });
    setRegistry(getVersionRegistry());
    setShowEditModal(false);
    setEditItem(null);
  }, [editItem]);

  const handleAddResource = useCallback(() => {
    setEditItem({
      category: 'manuals',
      id: '',
      version: '1.0',
      updateDate: new Date().toISOString().slice(0, 10),
      notes: '',
      isNew: true,
    });
    setShowEditModal(true);
  }, []);

  const filteredResources = useMemo(() => {
    let items = [];
    const cats = filterCategory === 'all' ? Object.keys(registry) : [filterCategory];
    cats.forEach(cat => {
      if (registry[cat]) {
        Object.entries(registry[cat]).forEach(([id, info]) => {
          items.push({ category: cat, id, ...info });
        });
      }
    });
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      items = items.filter(item =>
        item.id.toLowerCase().includes(term) ||
        (item.notes || '').toLowerCase().includes(term)
      );
    }
    return items.sort((a, b) => new Date(b.updateDate) - new Date(a.updateDate));
  }, [registry, filterCategory, searchTerm]);

  const cardStyle = {
    backgroundColor: colors?.cardBg || '#fff',
    borderColor: colors?.border || '#dee2e6',
    color: colors?.text || '#212529',
  };

  return (
    <Container fluid className="py-3">
      {/* 更新通知横幅 */}
      {updatedResources.length > 0 && (
        <Alert variant="info" className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <i className="bi bi-bell-fill me-2"></i>
            <strong>{updatedResources.length}</strong> 份资料有更新，请及时查看
          </div>
          <Button variant="outline-info" size="sm" onClick={handleMarkAllViewed}>
            全部标为已读
          </Button>
        </Alert>
      )}

      {/* 统计卡片 */}
      <Row className="mb-4 g-3">
        <Col xs={6} md={3}>
          <Card style={cardStyle}>
            <Card.Body className="text-center py-3">
              <div className="fs-2 fw-bold text-primary">{stats.total}</div>
              <div className="text-muted small">资料总数</div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card style={cardStyle}>
            <Card.Body className="text-center py-3">
              <div className="fs-2 fw-bold text-danger">{stats.updated}</div>
              <div className="text-muted small">待查看更新</div>
            </Card.Body>
          </Card>
        </Col>
        {Object.entries(stats.categories).map(([cat, catStats]) => (
          <Col xs={6} md={3} key={cat}>
            <Card style={cardStyle}>
              <Card.Body className="text-center py-3">
                <div className="fs-2 fw-bold" style={{ color: `var(--bs-${CATEGORY_LABELS[cat]?.color || 'secondary'})` }}>
                  {catStats.total}
                </div>
                <div className="text-muted small">
                  {CATEGORY_LABELS[cat]?.label || cat}
                  {catStats.updated > 0 && (
                    <Badge bg="danger" pill className="ms-1">{catStats.updated}更新</Badge>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        {/* 概览Tab */}
        <Tab eventKey="overview" title={<span><i className="bi bi-bell me-1"></i>更新通知{updatedResources.length > 0 && <Badge bg="danger" pill className="ms-1">{updatedResources.length}</Badge>}</span>}>
          <Card style={cardStyle}>
            <Card.Header>
              <h6 className="mb-0"><i className="bi bi-clock-history me-2"></i>最近更新的资料</h6>
            </Card.Header>
            <Card.Body className="p-0">
              {recentUpdates.length === 0 ? (
                <div className="text-center text-muted py-4">暂无更新记录</div>
              ) : (
                <ListGroup variant="flush">
                  {recentUpdates.map((item, idx) => (
                    <ListGroup.Item
                      key={`${item.category}-${item.id}-${idx}`}
                      className="d-flex align-items-center"
                      style={{ backgroundColor: item.isNew ? 'rgba(13,110,253,0.05)' : 'transparent' }}
                    >
                      <div className="me-3">
                        <i className={`bi ${CATEGORY_LABELS[item.category]?.icon || 'bi-file'} fs-4`}
                          style={{ color: `var(--bs-${CATEGORY_LABELS[item.category]?.color || 'secondary'})` }}
                        ></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-semibold">
                          {item.id}
                          {item.isNew && <Badge bg="danger" className="ms-2">新</Badge>}
                        </div>
                        <div className="small text-muted">
                          <Badge bg={CATEGORY_LABELS[item.category]?.color || 'secondary'} className="me-2">
                            {CATEGORY_LABELS[item.category]?.label || item.category}
                          </Badge>
                          v{item.version} · {item.updateDate}
                          {item.notes && ` · ${item.notes}`}
                        </div>
                      </div>
                      {item.isNew && (
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleMarkViewed(item.category, item.id)}
                        >
                          标为已读
                        </Button>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* 全部资料Tab */}
        <Tab eventKey="all" title={<span><i className="bi bi-list-ul me-1"></i>全部资料</span>}>
          <Card style={cardStyle}>
            <Card.Header>
              <Row className="g-2 align-items-center">
                <Col md={4}>
                  <InputGroup size="sm">
                    <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                    <Form.Control
                      placeholder="搜索资料..."
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3}>
                  <Form.Select size="sm" value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                    <option value="all">全部类别</option>
                    {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                      <option key={key} value={key}>{val.label}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={5} className="text-end">
                  <Button variant="primary" size="sm" onClick={handleAddResource}>
                    <i className="bi bi-plus-lg me-1"></i>添加资料版本
                  </Button>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover responsive className="mb-0">
                <thead>
                  <tr>
                    <th>资料名称</th>
                    <th>类别</th>
                    <th>版本</th>
                    <th>更新日期</th>
                    <th>更新说明</th>
                    <th>状态</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredResources.map((item, idx) => {
                    const isUpdated = hasUnviewedUpdate(item.category, item.id);
                    return (
                      <tr key={`${item.category}-${item.id}-${idx}`}>
                        <td>
                          <i className={`bi ${CATEGORY_LABELS[item.category]?.icon || 'bi-file'} me-2`}></i>
                          {item.id}
                        </td>
                        <td>
                          <Badge bg={CATEGORY_LABELS[item.category]?.color || 'secondary'}>
                            {CATEGORY_LABELS[item.category]?.label || item.category}
                          </Badge>
                        </td>
                        <td><code>v{item.version}</code></td>
                        <td>{item.updateDate}</td>
                        <td className="text-muted small">{item.notes || '-'}</td>
                        <td>
                          {isUpdated ? (
                            <Badge bg="danger">待查看</Badge>
                          ) : (
                            <Badge bg="success">已查看</Badge>
                          )}
                        </td>
                        <td>
                          <Button variant="link" size="sm" className="p-0 me-2"
                            onClick={() => handleEditVersion(item.category, item.id, item)}>
                            <i className="bi bi-pencil"></i>
                          </Button>
                          {isUpdated && (
                            <Button variant="link" size="sm" className="p-0"
                              onClick={() => handleMarkViewed(item.category, item.id)}>
                              <i className="bi bi-check-lg text-success"></i>
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              {filteredResources.length === 0 && (
                <div className="text-center text-muted py-4">无匹配资料</div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* 版本变更历史Tab */}
        <Tab eventKey="changelog" title={<span><i className="bi bi-journal-text me-1"></i>变更记录</span>}>
          <Card style={cardStyle}>
            <Card.Header>
              <h6 className="mb-0"><i className="bi bi-journal-text me-2"></i>版本变更时间线</h6>
            </Card.Header>
            <Card.Body>
              {recentUpdates.length === 0 ? (
                <div className="text-center text-muted py-4">暂无变更记录</div>
              ) : (
                <div className="position-relative" style={{ paddingLeft: 30 }}>
                  <div
                    className="position-absolute"
                    style={{ left: 11, top: 0, bottom: 0, width: 2, backgroundColor: colors?.border || '#dee2e6' }}
                  ></div>
                  {recentUpdates.map((item, idx) => (
                    <div key={idx} className="mb-3 position-relative">
                      <div
                        className="position-absolute rounded-circle"
                        style={{
                          left: -25,
                          top: 4,
                          width: 12,
                          height: 12,
                          backgroundColor: `var(--bs-${CATEGORY_LABELS[item.category]?.color || 'secondary'})`,
                          border: '2px solid #fff',
                        }}
                      ></div>
                      <div className="small text-muted mb-1">{item.updateDate}</div>
                      <div>
                        <Badge bg={CATEGORY_LABELS[item.category]?.color || 'secondary'} className="me-2">
                          {CATEGORY_LABELS[item.category]?.label || item.category}
                        </Badge>
                        <strong>{item.id}</strong> 更新至 v{item.version}
                      </div>
                      {item.notes && <div className="small text-muted mt-1">{item.notes}</div>}
                    </div>
                  ))}
                </div>
              )}
            </Card.Body>
          </Card>
        </Tab>

        {/* P2-1: 工程修订单 (ECO) 流程 */}
        <Tab eventKey="eco" title={<span><i className="bi bi-arrow-repeat me-1"></i>修订单 ECO</span>}>
          <ECOPanel defaultResourceType="manual" defaultResourceId="" />
        </Tab>

        {/* P3-3: 审计日志 */}
        <Tab eventKey="audit" title={<span><i className="bi bi-shield-check me-1"></i>审计日志</span>}>
          <AuditLogViewer />
        </Tab>
      </Tabs>

      {/* 编辑版本Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editItem?.isNew ? '添加资料版本' : '编辑版本信息'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editItem && (
            <Form>
              {editItem.isNew && (
                <>
                  <Form.Group className="mb-3">
                    <Form.Label>类别</Form.Label>
                    <Form.Select
                      value={editItem.category}
                      onChange={e => setEditItem({ ...editItem, category: e.target.value })}
                    >
                      {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                        <option key={key} value={key}>{val.label}</option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>资料标识/型号</Form.Label>
                    <Form.Control
                      value={editItem.id}
                      onChange={e => setEditItem({ ...editItem, id: e.target.value })}
                      placeholder="如 HC300、gwc3941-1"
                    />
                  </Form.Group>
                </>
              )}
              <Form.Group className="mb-3">
                <Form.Label>版本号</Form.Label>
                <Form.Control
                  value={editItem.version}
                  onChange={e => setEditItem({ ...editItem, version: e.target.value })}
                  placeholder="如 1.0, 2.1"
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>更新日期</Form.Label>
                <Form.Control
                  type="date"
                  value={editItem.updateDate}
                  onChange={e => setEditItem({ ...editItem, updateDate: e.target.value })}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>更新说明</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={editItem.notes || ''}
                  onChange={e => setEditItem({ ...editItem, notes: e.target.value })}
                  placeholder="描述本次更新内容..."
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>取消</Button>
          <Button variant="primary" onClick={handleSaveVersion}>保存</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ResourceVersionView;
