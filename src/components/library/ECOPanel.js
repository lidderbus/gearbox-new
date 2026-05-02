// P2-1: 工程修订单管理面板
import React, { useState, useMemo, useCallback } from 'react';
import { Card, Row, Col, Button, Badge, Form, Modal, ListGroup, Alert, Table } from 'react-bootstrap';
import { ECO_STATES, listEco, createEco, transitionEco, removeEco, ecoStats } from '../../services/ecoStore';
import { RESOURCE_TYPES } from '../../data/resourceMetaSchema';

const TYPE_LABELS = Object.fromEntries(Object.entries(RESOURCE_TYPES).map(([k, v]) => [k, v.label]));

const ECOPanel = ({ defaultResourceType = 'manual', defaultResourceId = '' }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterState, setFilterState] = useState('');
  const [filterResource, setFilterResource] = useState(defaultResourceId);
  const [showCreate, setShowCreate] = useState(false);
  const [showDetail, setShowDetail] = useState(null);
  const [msg, setMsg] = useState(null);

  // 创建表单
  const [form, setForm] = useState({
    resourceType: defaultResourceType,
    resourceId: defaultResourceId,
    fromVersion: '',
    toVersion: '',
    reason: '',
    scope: '',
    author: '',
  });

  const refresh = () => setRefreshKey(k => k + 1);
  const flash = (text, variant = 'success') => {
    setMsg({ text, variant });
    setTimeout(() => setMsg(null), 3000);
  };

  const ecoList = useMemo(() => {
    void refreshKey;
    return listEco({ resourceId: filterResource || null, state: filterState || null });
  }, [refreshKey, filterResource, filterState]);

  const stats = useMemo(() => {
    void refreshKey;
    return ecoStats();
  }, [refreshKey]);

  const handleCreate = useCallback(() => {
    if (!form.resourceId.trim() || !form.reason.trim()) {
      flash('资源 ID 与修订理由为必填', 'danger');
      return;
    }
    try {
      const eco = createEco({
        resourceType: form.resourceType,
        resourceId: form.resourceId.trim(),
        fromVersion: form.fromVersion.trim(),
        toVersion: form.toVersion.trim(),
        reason: form.reason.trim(),
        scope: form.scope.trim(),
        author: form.author.trim(),
      });
      flash(`ECO ${eco.ecoId} 已创建`);
      setShowCreate(false);
      setForm({
        resourceType: defaultResourceType,
        resourceId: defaultResourceId,
        fromVersion: '',
        toVersion: '',
        reason: '',
        scope: '',
        author: '',
      });
      refresh();
    } catch (e) {
      flash('创建失败: ' + e.message, 'danger');
    }
  }, [form, defaultResourceType, defaultResourceId]);

  const handleTransition = useCallback((ecoId, nextState) => {
    const comment = window.prompt(`流转到 "${ECO_STATES[nextState]?.label || nextState}",请输入说明:`, '') || '';
    try {
      transitionEco(ecoId, nextState, '', comment);
      flash('已流转');
      refresh();
      // 关闭可能开着的详情
      if (showDetail?.ecoId === ecoId) {
        setShowDetail(null);
      }
    } catch (e) {
      flash('流转失败: ' + e.message, 'danger');
    }
  }, [showDetail]);

  const handleDelete = useCallback((ecoId) => {
    if (!window.confirm(`确认删除草稿 ${ecoId}？`)) return;
    try {
      removeEco(ecoId);
      flash('已删除');
      refresh();
    } catch (e) {
      flash('删除失败: ' + e.message, 'danger');
    }
  }, []);

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <strong><i className="bi bi-arrow-repeat me-2"></i>工程修订单 (ECO)</strong>
          <Badge bg="primary" className="ms-2">P2-1</Badge>
        </div>
        <Button size="sm" variant="primary" onClick={() => setShowCreate(true)}>
          <i className="bi bi-plus-lg me-1"></i>新建 ECO
        </Button>
      </Card.Header>
      <Card.Body>
        {msg && <Alert variant={msg.variant} dismissible onClose={() => setMsg(null)} className="py-2">{msg.text}</Alert>}

        {/* 统计 */}
        <Row className="mb-3 g-2">
          <Col xs={6} md={3}><Card className="text-center"><Card.Body className="py-2"><h5 className="mb-0">{stats.total}</h5><small>总数</small></Card.Body></Card></Col>
          <Col xs={6} md={3}><Card className="text-center" border="warning"><Card.Body className="py-2"><h5 className="mb-0 text-warning">{stats.byState.submitted}</h5><small>待审核</small></Card.Body></Card></Col>
          <Col xs={6} md={3}><Card className="text-center" border="success"><Card.Body className="py-2"><h5 className="mb-0 text-success">{stats.byState.effective}</h5><small>已生效</small></Card.Body></Card></Col>
          <Col xs={6} md={3}><Card className="text-center" border="danger"><Card.Body className="py-2"><h5 className="mb-0 text-danger">{stats.byState.rejected}</h5><small>已驳回</small></Card.Body></Card></Col>
        </Row>

        {/* 筛选 */}
        <Row className="mb-2 g-2">
          <Col md={4}>
            <Form.Select size="sm" value={filterState} onChange={e => setFilterState(e.target.value)}>
              <option value="">全部状态</option>
              {Object.entries(ECO_STATES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
            </Form.Select>
          </Col>
          <Col md={5}>
            <Form.Control size="sm" placeholder="按资源 ID 过滤..." value={filterResource} onChange={e => setFilterResource(e.target.value)} />
          </Col>
          <Col md={3} className="text-end">
            <small className="text-muted">{ecoList.length} 条</small>
          </Col>
        </Row>

        {/* 列表 */}
        {ecoList.length === 0 ? (
          <Alert variant="light" className="text-center py-3 mb-0">
            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
            暂无修订单
          </Alert>
        ) : (
          <Table size="sm" hover className="mb-0" style={{ fontSize: '0.85em' }}>
            <thead className="bg-light">
              <tr>
                <th>编号</th><th>资源</th><th>版本变更</th><th>修订理由</th><th>状态</th><th>更新</th><th style={{ width: 200 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {ecoList.map(eco => {
                const stateInfo = ECO_STATES[eco.state] || {};
                return (
                  <tr key={eco.ecoId}>
                    <td><code style={{ fontSize: '0.85em' }}>{eco.ecoId}</code></td>
                    <td>
                      <Badge bg="light" text="dark" className="me-1">{TYPE_LABELS[eco.resourceType] || eco.resourceType}</Badge>
                      <span style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>{eco.resourceId}</span>
                    </td>
                    <td className="text-nowrap">
                      <span className="text-muted">{eco.fromVersion || '-'}</span>
                      <i className="bi bi-arrow-right mx-1"></i>
                      <strong>{eco.toVersion || '-'}</strong>
                    </td>
                    <td className="text-truncate" style={{ maxWidth: 200 }}>{eco.reason}</td>
                    <td><Badge bg={stateInfo.color || 'secondary'}>{stateInfo.label || eco.state}</Badge></td>
                    <td className="text-nowrap small">{(eco.updatedAt || '').slice(0, 10)}</td>
                    <td className="text-nowrap">
                      <Button size="sm" variant="outline-info" className="me-1" title="详情" onClick={() => setShowDetail(eco)}>
                        <i className="bi bi-eye"></i>
                      </Button>
                      {(stateInfo.next || []).map(s => (
                        <Button key={s} size="sm" variant={ECO_STATES[s]?.color ? `outline-${ECO_STATES[s].color}` : 'outline-secondary'} className="me-1" onClick={() => handleTransition(eco.ecoId, s)}>
                          {ECO_STATES[s]?.label.replace('已', '').replace(',待审核', '')}
                        </Button>
                      ))}
                      {eco.state === 'draft' && (
                        <Button size="sm" variant="outline-danger" onClick={() => handleDelete(eco.ecoId)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        )}
      </Card.Body>

      {/* 创建 ECO Modal */}
      <Modal show={showCreate} onHide={() => setShowCreate(false)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.05rem' }}><i className="bi bi-plus-lg me-2"></i>新建工程修订单</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Row className="g-2">
            <Col md={3}>
              <Form.Group className="mb-2"><Form.Label className="small">资源类型</Form.Label>
                <Form.Select size="sm" value={form.resourceType} onChange={e => setForm({ ...form, resourceType: e.target.value })}>
                  {Object.entries(RESOURCE_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={5}>
              <Form.Group className="mb-2"><Form.Label className="small">资源 ID *</Form.Label>
                <Form.Control size="sm" value={form.resourceId} onChange={e => setForm({ ...form, resourceId: e.target.value })} placeholder="如 HC1000-manual" />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-2"><Form.Label className="small">申请人</Form.Label>
                <Form.Control size="sm" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="姓名/部门" />
              </Form.Group>
            </Col>
          </Row>
          <Row className="g-2">
            <Col md={6}>
              <Form.Group className="mb-2"><Form.Label className="small">旧版本</Form.Label>
                <Form.Control size="sm" value={form.fromVersion} onChange={e => setForm({ ...form, fromVersion: e.target.value })} placeholder="如 1.0" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-2"><Form.Label className="small">新版本(建议)</Form.Label>
                <Form.Control size="sm" value={form.toVersion} onChange={e => setForm({ ...form, toVersion: e.target.value })} placeholder="如 1.1" />
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-2"><Form.Label className="small">修订理由 *</Form.Label>
            <Form.Control size="sm" as="textarea" rows={2} value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} placeholder="如: 修正附录 B 安装尺寸表错误数据" />
          </Form.Group>
          <Form.Group className="mb-2"><Form.Label className="small">影响范围 (可选)</Form.Label>
            <Form.Control size="sm" as="textarea" rows={2} value={form.scope} onChange={e => setForm({ ...form, scope: e.target.value })} placeholder="如: 所有 HC1000 已交付项目, 涉及 14 份关联协议" />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={() => setShowCreate(false)}>取消</Button>
          <Button size="sm" variant="primary" onClick={handleCreate}><i className="bi bi-check-lg me-1"></i>提交草稿</Button>
        </Modal.Footer>
      </Modal>

      {/* 详情 Modal */}
      <Modal show={!!showDetail} onHide={() => setShowDetail(null)} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1.05rem' }}>
            <i className="bi bi-arrow-repeat me-2"></i>
            {showDetail?.ecoId}
            {showDetail && <Badge bg={ECO_STATES[showDetail.state]?.color || 'secondary'} className="ms-2">{ECO_STATES[showDetail.state]?.label}</Badge>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {showDetail && (
            <>
              <Row className="g-2 mb-2">
                <Col md={6}><strong>资源:</strong> <Badge bg="light" text="dark">{TYPE_LABELS[showDetail.resourceType]}</Badge> <code>{showDetail.resourceId}</code></Col>
                <Col md={6}><strong>申请人:</strong> {showDetail.author || '-'}</Col>
                <Col md={6}><strong>版本变更:</strong> {showDetail.fromVersion || '-'} → <strong>{showDetail.toVersion || '-'}</strong></Col>
                <Col md={6}><strong>创建:</strong> {new Date(showDetail.createdAt).toLocaleString('zh-CN')}</Col>
              </Row>
              <hr />
              <strong>修订理由:</strong>
              <p className="mt-1">{showDetail.reason}</p>
              {showDetail.scope && <><strong>影响范围:</strong><p className="mt-1 text-muted">{showDetail.scope}</p></>}
              <hr />
              <strong>流转历史:</strong>
              <ListGroup className="mt-2" variant="flush">
                {(showDetail.history || []).map((h, i) => (
                  <ListGroup.Item key={i} className="px-0 py-2" style={{ fontSize: '0.85em' }}>
                    <Badge bg={ECO_STATES[h.state]?.color || 'secondary'} className="me-2">{ECO_STATES[h.state]?.label || h.state}</Badge>
                    <span className="text-muted me-2">{new Date(h.at).toLocaleString('zh-CN')}</span>
                    {h.actor && <span className="me-2">by {h.actor}</span>}
                    {h.comment && <span>— {h.comment}</span>}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default ECOPanel;
