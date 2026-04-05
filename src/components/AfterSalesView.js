// src/components/AfterSalesView.js
// 售后服务 - 齿轮箱售后工单管理系统 (localStorage持久化)
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, InputGroup, Modal, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { trackFeature } from '../utils/analytics';
import ExportToolbar from './ExportToolbar';

const STORAGE_KEY = 'aftersales_tickets';
const MAX_TICKETS = 200;

const SERVICE_TYPES = [
  { key: 'repair', label: '维修', color: 'danger', icon: 'bi-wrench' },
  { key: 'maintenance', label: '保养', color: 'info', icon: 'bi-droplet' },
  { key: 'inspection', label: '检测', color: 'warning', icon: 'bi-search' },
  { key: 'spare', label: '备件供应', color: 'primary', icon: 'bi-box-seam' },
  { key: 'technical', label: '技术支持', color: 'success', icon: 'bi-headset' },
  { key: 'complaint', label: '投诉处理', color: 'dark', icon: 'bi-exclamation-triangle' },
];

const STATUS_MAP = {
  pending:    { label: '待分配', color: 'secondary' },
  processing: { label: '处理中', color: 'warning' },
  waiting:    { label: '等待配件', color: 'info' },
  completed:  { label: '已完成', color: 'success' },
  closed:     { label: '已关闭', color: 'dark' },
};

const STATUS_TRANSITIONS = {
  pending: ['processing'],
  processing: ['waiting', 'completed'],
  waiting: ['processing', 'completed'],
  completed: ['closed'],
  closed: [],
};

const PRIORITY_MAP = {
  normal: { label: '普通', color: '' },
  urgent: { label: '紧急', color: 'warning' },
  critical: { label: '特急', color: 'danger' },
};

const SEED_TICKETS = [
  { id: 'AS-2026-001', customer: '浙江嵊泗渔业', gearbox: 'HCD400A', sn: 'HCD400A-20250188', type: 'repair', priority: 'urgent', desc: '齿轮箱异常噪声，高速运转时尤为明显，疑似轴承磨损', status: 'processing', date: '2026-03-18', engineer: '赵工', phone: '13800001111', notes: '', statusHistory: [{ status: 'pending', time: '2026-03-18T08:00:00' }, { status: 'processing', time: '2026-03-18T10:30:00' }] },
  { id: 'AS-2026-002', customer: '长江航运集团', gearbox: 'HCD600A', sn: 'HCD600A-20241055', type: 'maintenance', priority: 'normal', desc: '首次5000小时保养，更换润滑油及滤芯', status: 'completed', date: '2026-03-10', engineer: '钱工', phone: '13800002222', notes: '', statusHistory: [{ status: 'pending', time: '2026-03-10T09:00:00' }, { status: 'processing', time: '2026-03-10T14:00:00' }, { status: 'completed', time: '2026-03-12T16:00:00' }] },
  { id: 'AS-2026-003', customer: '珠海拖轮公司', gearbox: 'HCD800', sn: 'HCD800-20250032', type: 'spare', priority: 'critical', desc: '更换主轴承及密封件，船舶停航等待中', status: 'waiting', date: '2026-03-05', engineer: '孙工', phone: '13800003333', notes: '', statusHistory: [{ status: 'pending', time: '2026-03-05T08:00:00' }, { status: 'processing', time: '2026-03-05T09:00:00' }, { status: 'waiting', time: '2026-03-06T11:00:00' }] },
  { id: 'AS-2026-004', customer: '海南琼海渔业', gearbox: 'HC200', sn: 'HC200-20240866', type: 'technical', priority: 'normal', desc: '调试减速比切换问题，操作手柄反馈不灵敏', status: 'completed', date: '2026-02-28', engineer: '赵工', phone: '13800004444', notes: '', statusHistory: [{ status: 'pending', time: '2026-02-28T08:00:00' }, { status: 'processing', time: '2026-02-28T13:00:00' }, { status: 'completed', time: '2026-03-01T10:00:00' }] },
  { id: 'AS-2026-005', customer: '福建霞浦航运', gearbox: 'HC300', sn: 'HC300-20250105', type: 'inspection', priority: 'normal', desc: '船级社年检配合，CCS检验师现场检测', status: 'processing', date: '2026-02-20', engineer: '钱工', phone: '13800005555', notes: '', statusHistory: [{ status: 'pending', time: '2026-02-20T08:00:00' }, { status: 'processing', time: '2026-02-21T09:00:00' }] },
];

function safeReadTickets() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : null;
  } catch { return null; }
}

function safeWriteTickets(tickets) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets.slice(0, MAX_TICKETS)));
  } catch (e) { console.error('AfterSales: localStorage write failed', e); }
}

function generateId(tickets) {
  const year = new Date().getFullYear();
  const existing = tickets.map(t => {
    const m = t.id.match(/AS-(\d{4})-(\d{3})/);
    return m && parseInt(m[1]) === year ? parseInt(m[2]) : 0;
  });
  const next = Math.max(0, ...existing) + 1;
  return `AS-${year}-${String(next).padStart(3, '0')}`;
}

function daysBetween(a, b) {
  return Math.max(0, Math.round((new Date(b) - new Date(a)) / 86400000));
}

const EMPTY_FORM = { customer: '', gearbox: '', sn: '', type: 'repair', priority: 'normal', desc: '', phone: '', engineer: '' };

const pulseKeyframes = `@keyframes aftersales-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`;

export default function AfterSalesView({ colors, theme }) {
  const [tickets, setTickets] = useState(() => {
    const stored = safeReadTickets();
    if (stored && stored.length > 0) return stored;
    safeWriteTickets(SEED_TICKETS);
    return SEED_TICKETS;
  });
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => { safeWriteTickets(tickets); }, [tickets]);

  const updateTicket = useCallback((id, updater) => {
    setTickets(prev => prev.map(t => t.id === id ? updater(t) : t));
  }, []);

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (search) {
        const q = search.toLowerCase();
        return [t.id, t.customer, t.gearbox, t.sn, t.desc, t.engineer].some(f => (f || '').toLowerCase().includes(q));
      }
      return true;
    });
  }, [tickets, typeFilter, search]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = tickets.filter(t => {
      const d = new Date(t.date);
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    });
    const done = tickets.filter(t => t.status === 'completed' || t.status === 'closed');
    const completedWithTime = tickets.filter(t => {
      if (t.status !== 'completed' && t.status !== 'closed') return false;
      const h = t.statusHistory || [];
      return h.find(s => s.status === 'pending') && h.find(s => s.status === 'completed');
    });
    let avgDays = 0;
    if (completedWithTime.length) {
      const total = completedWithTime.reduce((sum, t) => {
        const h = t.statusHistory;
        const start = h.find(s => s.status === 'pending').time;
        const end = h.find(s => s.status === 'completed').time;
        return sum + daysBetween(start, end);
      }, 0);
      avgDays = (total / completedWithTime.length).toFixed(1);
    }
    const pending = tickets.filter(t => t.status === 'pending' || t.status === 'processing').length;
    return { total: tickets.length, month: thisMonth.length, rate: tickets.length ? ((done.length / tickets.length) * 100).toFixed(0) : 0, avg: avgDays, pending };
  }, [tickets]);

  const handleCreate = () => {
    if (!form.customer.trim() || !form.gearbox.trim() || !form.desc.trim()) return;
    const now = new Date();
    const ticket = {
      id: generateId(tickets), customer: form.customer.trim(), gearbox: form.gearbox.trim().toUpperCase(),
      sn: form.sn.trim(), type: form.type, priority: form.priority, desc: form.desc.trim(),
      status: 'pending', date: now.toISOString().slice(0, 10), engineer: form.engineer.trim() || '待���配',
      phone: form.phone.trim(), notes: '',
      statusHistory: [{ status: 'pending', time: now.toISOString() }],
    };
    setTickets(prev => [ticket, ...prev].slice(0, MAX_TICKETS));
    trackFeature('ticket_create', { id: ticket.id, type: ticket.type, customer: ticket.customer });
    setForm({ ...EMPTY_FORM });
    setShowModal(false);
  };

  const handleStatusChange = (id, newStatus) => {
    updateTicket(id, t => ({
      ...t, status: newStatus,
      statusHistory: [...(t.statusHistory || []), { status: newStatus, time: new Date().toISOString() }],
    }));
  };

  const handleDelete = (id) => {
    if (!window.confirm(`确认删除工单 ${id}？此操作不可恢复。`)) return;
    setTickets(prev => prev.filter(t => t.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const getExportData = useCallback(() => {
    const headers = ['工单号', '客户', '齿轮箱型号', '序列号', '服务类型', '紧急程度', '状态', '故障描述', '工程师', '联系电话', '创建日期'];
    const rows = filtered.map(t => [
      t.id, t.customer, t.gearbox, t.sn,
      SERVICE_TYPES.find(s => s.key === t.type)?.label || '',
      PRIORITY_MAP[t.priority]?.label || '普通',
      STATUS_MAP[t.status]?.label || '',
      t.desc || '', t.engineer, t.phone || '', t.date,
    ]);
    return {
      filename: `售后工单_${new Date().toISOString().slice(0, 10)}`,
      title: '售后服务工单',
      headers,
      rows,
    };
  }, [filtered]);

  const typeCounts = useMemo(() => {
    const m = {};
    SERVICE_TYPES.forEach(s => { m[s.key] = 0; });
    tickets.forEach(t => { if (m[t.type] !== undefined) m[t.type]++; });
    return m;
  }, [tickets]);

  return (
    <Container fluid className="py-3">
      <style>{pulseKeyframes}</style>

      {/* Header */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h5 className="mb-0"><i className="bi bi-wrench-adjustable me-2"></i>售后服务</h5>
          <small className="text-muted">齿轮箱售后工单管理 &middot; 共 {tickets.length} 条工单</small>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <ExportToolbar getData={getExportData} disabled={filtered.length === 0} />
          <Button variant="primary" size="sm" onClick={() => setShowModal(true)}>
            <i className="bi bi-plus me-1"></i>新建工单
          </Button>
        </Col>
      </Row>

      {/* SLA Stats */}
      <Row className="mb-3 g-2">
        {[
          { label: '总工单', value: stats.total, icon: 'bi-clipboard-data', bg: 'primary' },
          { label: '本月新增', value: stats.month, icon: 'bi-calendar-event', bg: 'info' },
          { label: '完成率', value: `${stats.rate}%`, icon: 'bi-check-circle', bg: 'success' },
          { label: '平均处理', value: `${stats.avg}天`, icon: 'bi-clock-history', bg: 'warning' },
          { label: '待处理', value: stats.pending, icon: 'bi-hourglass-split', bg: 'danger' },
        ].map((s, i) => (
          <Col key={i} xs={6} md>
            <Card className="text-center h-100">
              <Card.Body className="py-2">
                <i className={`bi ${s.icon} text-${s.bg}`} style={{ fontSize: '1.2rem' }}></i>
                <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{s.value}</div>
                <small className="text-muted">{s.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Service Type Filter Cards */}
      <Row className="mb-3 g-2">
        {SERVICE_TYPES.map(s => (
          <Col key={s.key} xs={4} md={2}>
            <Card className={`text-center ${typeFilter === s.key ? 'border-primary shadow-sm' : ''}`}
              style={{ cursor: 'pointer', transition: 'all .15s' }}
              onClick={() => setTypeFilter(typeFilter === s.key ? 'all' : s.key)}>
              <Card.Body className="py-2 px-1">
                <i className={`bi ${s.icon} fs-4 text-${s.color}`}></i>
                <div className="small mt-1">{s.label}</div>
                <Badge bg={s.color} pill className="mt-1">{typeCounts[s.key]}</Badge>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Search */}
      <Card className="mb-3">
        <Card.Body className="py-2">
          <InputGroup size="sm">
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="搜索工单号/客户/型号/工程师..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <Button variant="outline-secondary" size="sm" onClick={() => setSearch('')}><i className="bi bi-x"></i></Button>}
          </InputGroup>
        </Card.Body>
      </Card>

      {/* Tickets Table */}
      <Card>
        <Card.Body className="p-0">
          {filtered.length === 0 ? (
            <div className="text-center text-muted py-5">
              <i className="bi bi-inbox fs-1 d-block mb-2"></i>
              {search || typeFilter !== 'all' ? '没有匹配的工单' : '暂无工单，点击"新建工单"开始'}
            </div>
          ) : (
            <Table hover responsive className="mb-0 align-middle" style={{ fontSize: '.875rem' }}>
              <thead className="bg-light">
                <tr>
                  <th style={{ width: 30 }}></th>
                  <th>工单号</th><th>客户</th><th>齿轮箱</th><th>类型</th><th>描述</th><th>状态</th><th>日期</th><th>工程师</th><th style={{ width: 60 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => {
                  const sType = SERVICE_TYPES.find(s => s.key === t.type);
                  const sStatus = STATUS_MAP[t.status] || {};
                  const pr = PRIORITY_MAP[t.priority] || PRIORITY_MAP.normal;
                  const isExpanded = expandedId === t.id;
                  const allowed = STATUS_TRANSITIONS[t.status] || [];
                  return (
                    <React.Fragment key={t.id}>
                      <tr style={{ cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : t.id)}>
                        <td className="text-center">
                          <i className={`bi bi-chevron-${isExpanded ? 'down' : 'right'} text-muted`}></i>
                        </td>
                        <td>
                          <strong>{t.id}</strong>
                          {t.priority === 'critical' && (
                            <Badge bg="danger" className="ms-1" style={{ animation: 'aftersales-pulse 1.2s infinite' }}>特急</Badge>
                          )}
                          {t.priority === 'urgent' && (
                            <Badge bg="warning" text="dark" className="ms-1">紧急</Badge>
                          )}
                        </td>
                        <td>{t.customer}</td>
                        <td>
                          <Badge bg="primary">{t.gearbox}</Badge>
                          {t.sn && <><br/><small className="text-muted">{t.sn}</small></>}
                        </td>
                        <td><Badge bg={sType?.color}><i className={`bi ${sType?.icon} me-1`}></i>{sType?.label}</Badge></td>
                        <td className="small text-truncate" style={{ maxWidth: 200 }}>{t.desc}</td>
                        <td onClick={e => e.stopPropagation()}>
                          {allowed.length > 0 ? (
                            <Form.Select size="sm" value={t.status} style={{ width: 110, fontSize: '.8rem' }}
                              onChange={e => handleStatusChange(t.id, e.target.value)}>
                              <option value={t.status}>{sStatus.label}</option>
                              {allowed.map(s => <option key={s} value={s}>{STATUS_MAP[s].label}</option>)}
                            </Form.Select>
                          ) : (
                            <Badge bg={sStatus.color}>{sStatus.label}</Badge>
                          )}
                        </td>
                        <td className="small">{t.date}</td>
                        <td>{t.engineer}</td>
                        <td onClick={e => e.stopPropagation()}>
                          <OverlayTrigger overlay={<Tooltip>删除</Tooltip>}>
                            <Button variant="outline-danger" size="sm" className="p-0 px-1" onClick={() => handleDelete(t.id)}>
                              <i className="bi bi-trash"></i>
                            </Button>
                          </OverlayTrigger>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan={10} className="bg-light px-4 py-3" style={{ borderTop: 'none' }}>
                            <Row>
                              <Col md={6}>
                                <h6 className="mb-2">故障描述</h6>
                                <p className="mb-2" style={{ whiteSpace: 'pre-wrap' }}>{t.desc}</p>
                                {t.phone && <div className="small text-muted mb-1"><i className="bi bi-telephone me-1"></i>{t.phone}</div>}
                                <div className="mt-2">
                                  <Form.Control as="textarea" rows={2} placeholder="添加备注..."
                                    value={t.notes || ''} onChange={e => updateTicket(t.id, prev => ({ ...prev, notes: e.target.value }))} />
                                </div>
                              </Col>
                              <Col md={6}>
                                <h6 className="mb-2">状态历史</h6>
                                {(t.statusHistory || []).length === 0 ? (
                                  <small className="text-muted">无状态记录</small>
                                ) : (
                                  <div style={{ position: 'relative', paddingLeft: 20 }}>
                                    <div style={{ position: 'absolute', left: 6, top: 4, bottom: 4, width: 2, background: '#dee2e6' }}></div>
                                    {(t.statusHistory || []).map((h, i) => {
                                      const st = STATUS_MAP[h.status] || {};
                                      return (
                                        <div key={i} className="mb-2 d-flex align-items-start">
                                          <div style={{ width: 14, height: 14, borderRadius: '50%', flexShrink: 0, marginTop: 2, position: 'relative', zIndex: 1 }}
                                            className={`bg-${st.color || 'secondary'}`}></div>
                                          <div className="ms-2">
                                            <Badge bg={st.color} className="me-1">{st.label}</Badge>
                                            <small className="text-muted">{new Date(h.time).toLocaleString('zh-CN')}</small>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
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
          )}
        </Card.Body>
      </Card>

      {/* New Ticket Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton><Modal.Title>新建售后工单</Modal.Title></Modal.Header>
        <Modal.Body>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>客户名称 <span className="text-danger">*</span></Form.Label>
                <Form.Control value={form.customer} onChange={e => setForm(f => ({ ...f, customer: e.target.value }))} placeholder="输入客户名称" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>齿轮箱型号 <span className="text-danger">*</span></Form.Label>
                <Form.Control value={form.gearbox} onChange={e => setForm(f => ({ ...f, gearbox: e.target.value }))} placeholder="如 HCD400A" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>序列号</Form.Label>
                <Form.Control value={form.sn} onChange={e => setForm(f => ({ ...f, sn: e.target.value }))} placeholder="出厂序列号(可选)" />
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>服务类型</Form.Label>
                <Form.Select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                  {SERVICE_TYPES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col md={3}>
              <Form.Group>
                <Form.Label>紧急程度</Form.Label>
                <Form.Select value={form.priority} onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}>
                  <option value="normal">普通</option>
                  <option value="urgent">紧急</option>
                  <option value="critical">特急</option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs={12}>
              <Form.Group>
                <Form.Label>故障描述 <span className="text-danger">*</span></Form.Label>
                <Form.Control as="textarea" rows={3} value={form.desc} onChange={e => setForm(f => ({ ...f, desc: e.target.value }))} placeholder="详细描述故障现象、发生时间、运行工况等" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>联系电话</Form.Label>
                <Form.Control value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="客户联系电话" />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>指派工程师</Form.Label>
                <Form.Control value={form.engineer} onChange={e => setForm(f => ({ ...f, engineer: e.target.value }))} placeholder='留空则显示"待分配"' />
              </Form.Group>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>取消</Button>
          <Button variant="primary" onClick={handleCreate} disabled={!form.customer.trim() || !form.gearbox.trim() || !form.desc.trim()}>
            <i className="bi bi-plus-circle me-1"></i>创建工单
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
