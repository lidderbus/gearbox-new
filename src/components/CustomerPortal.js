// src/components/CustomerPortal.js
// 客户询价管理 - 询价提交、状态流转、统计分析
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, InputGroup } from 'react-bootstrap';
import { trackFeature } from '../utils/analytics';
import { inquiryStore } from '../services/documentStorage';
import { generateDocNumber } from '../utils/documentNumbering';

const STORAGE_KEY = 'customer_inquiries';
const MAX_ITEMS = 200;

const STATUS_FLOW = {
  new: ['processing'],
  processing: ['quoted'],
  quoted: ['expired', 'closed'],
  expired: [],
  closed: [],
};

const STATUS_MAP = [
  { key: 'new', label: '新询价', color: 'info' },
  { key: 'processing', label: '报价中', color: 'warning' },
  { key: 'quoted', label: '已报价', color: 'success' },
  { key: 'expired', label: '已过期', color: 'secondary' },
  { key: 'closed', label: '已成交', color: 'dark' },
];

const APP_OPTIONS = ['渔船', '货船', '拖轮', '客船', '工作船', '游艇', '海工船', '其他'];

const SEED_DATA = [
  { id: 'INQ-2026-001', customer: '浙江嵊泗渔业', contact: '周经理', phone: '138****5566', power: 450, speed: 1800, application: '渔船', gearbox: 'HCD400A', ratio: '', thrust: '', remark: '', status: 'quoted', createdAt: '2026-03-18T08:00:00Z', updatedAt: '2026-03-19T10:00:00Z' },
  { id: 'INQ-2026-002', customer: '威海港务局', contact: '刘主任', phone: '139****7788', power: 1200, speed: 1000, application: '拖轮', gearbox: 'GWC52.59', ratio: '5.59', thrust: '', remark: '需CCS船检', status: 'processing', createdAt: '2026-03-19T09:00:00Z', updatedAt: '2026-03-19T09:00:00Z' },
  { id: 'INQ-2026-003', customer: '海南琼海渔业', contact: '吴船长', phone: '136****2233', power: 220, speed: 1500, application: '渔船', gearbox: '', ratio: '', thrust: '', remark: '预算有限，希望推荐性价比高的型号', status: 'new', createdAt: '2026-03-20T14:00:00Z', updatedAt: '2026-03-20T14:00:00Z' },
  { id: 'INQ-2026-004', customer: '广州远洋运输', contact: '陈总工', phone: '137****4455', power: 735, speed: 1000, application: '散货船', gearbox: 'HC600', ratio: '', thrust: '60kN', remark: '', status: 'new', createdAt: '2026-03-21T11:00:00Z', updatedAt: '2026-03-21T11:00:00Z' },
];

function safeRead() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr : null;
  } catch { return null; }
}

function safeWrite(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data.slice(0, MAX_ITEMS)));
  } catch (e) { console.error('CustomerPortal: localStorage write failed', e); }
}

function generateId(list) {
  const year = new Date().getFullYear();
  const existing = list
    .map(i => { const m = i.id.match(/^INQ-\d{4}-(\d+)$/); return m ? parseInt(m[1], 10) : 0; })
    .filter(Boolean);
  const next = existing.length ? Math.max(...existing) + 1 : 1;
  return `INQ-${year}-${String(next).padStart(3, '0')}`;
}

function daysSince(dateStr) {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
}

function fmtDate(iso) {
  if (!iso) return '-';
  return iso.slice(0, 10);
}

function exportCSV(rows) {
  const headers = ['编号', '单位名称', '联系人', '电话', '功率(kW)', '转速(rpm)', '用途', '意向型号', '速比', '推力', '状态', '创建日期', '备注'];
  const sLabel = (k) => STATUS_MAP.find(s => s.key === k)?.label || k;
  const lines = rows.map(r => [
    r.id, r.customer, r.contact, r.phone, r.power, r.speed, r.application,
    r.gearbox, r.ratio, r.thrust, sLabel(r.status), fmtDate(r.createdAt), r.remark,
  ].map(v => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','));
  const csv = '\uFEFF' + [headers.join(','), ...lines].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `询价记录_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(a.href);
}

const EMPTY_FORM = { customer: '', contact: '', phone: '', power: '', speed: '', application: '渔船', gearbox: '', ratio: '', thrust: '', remark: '' };

export default function CustomerPortal({ colors, theme }) {
  const [inquiries, setInquiries] = useState(() => {
    const stored = safeRead();
    if (stored && stored.length) return stored;
    safeWrite(SEED_DATA);
    return SEED_DATA;
  });
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const formRef = useRef(null);

  useEffect(() => { safeWrite(inquiries); }, [inquiries]);

  const setField = useCallback((k, v) => setForm(prev => ({ ...prev, [k]: v })), []);

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!form.customer.trim() || !form.power) return;
    const now = new Date().toISOString();
    const entry = {
      ...form,
      power: Number(form.power),
      speed: form.speed ? Number(form.speed) : '',
      id: generateId(inquiries),
      status: 'new',
      createdAt: now,
      updatedAt: now,
    };
    setInquiries(prev => [entry, ...prev]);
    trackFeature('customer_inquiry_submit', { id: entry.id, customer: entry.customer });
    setForm({ ...EMPTY_FORM });
    setShowForm(false);
  }, [form, inquiries]);

  const changeStatus = useCallback((id, newStatus) => {
    setInquiries(prev => prev.map(i => {
      if (i.id !== id) return i;
      const updated = { ...i, status: newStatus, updatedAt: new Date().toISOString() };
      // When reaching "已报价", sync to document management inquiryStore for cross-module visibility
      if (newStatus === 'quoted') {
        try {
          const docId = generateDocNumber('inquiry');
          inquiryStore.save({
            id: docId,
            customer: updated.customer,
            contact: updated.contact,
            phone: updated.phone,
            shipType: updated.application || '',
            power: String(updated.power || ''),
            speed: String(updated.speed || ''),
            ratioTarget: updated.ratio || '',
            thrustReq: updated.thrust || '',
            model: updated.gearbox || '',
            classSociety: '',
            specialReq: updated.remark || '',
            status: 'quoted',
            sourcePortalId: updated.id,
          });
        } catch (e) { /* ignore sync errors */ }
      }
      return updated;
    }));
  }, []);

  const deleteInquiry = useCallback((id) => {
    if (!window.confirm(`确认删除询价 ${id}？`)) return;
    setInquiries(prev => prev.filter(i => i.id !== id));
  }, []);

  const goSelection = useCallback((inq) => {
    // Save inquiry params to selection wizard storage for InputParametersTab to pick up
    try {
      const params = {
        power: String(inq.power || ''),
        speed: String(inq.speed || ''),
        targetRatio: inq.ratio || '',
        thrustRequirement: inq.thrust || '',
        workCondition: '',
      };
      localStorage.setItem('selection_wizard_params', JSON.stringify(params));
    } catch (e) { /* ignore storage errors */ }
    trackFeature('customer_inquiry_to_selection', { id: inq.id });
    // Navigate to the input parameters tab
    window.location.hash = '#/input';
  }, []);

  const filtered = useMemo(() => {
    let list = inquiries;
    if (filterStatus !== 'all') list = list.filter(i => i.status === filterStatus);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(i =>
        (i.customer || '').toLowerCase().includes(q) ||
        (i.id || '').toLowerCase().includes(q) ||
        (i.gearbox || '').toLowerCase().includes(q) ||
        (i.contact || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [inquiries, filterStatus, search]);

  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const total = inquiries.length;
    const byStatus = (k) => inquiries.filter(i => i.status === k).length;
    const thisMonth = inquiries.filter(i => i.createdAt >= monthStart).length;
    const closedCount = byStatus('closed');
    const convRate = total > 0 ? ((closedCount / total) * 100).toFixed(1) : '0.0';
    return {
      new: byStatus('new'), processing: byStatus('processing'),
      quoted: byStatus('quoted'), thisMonth, convRate,
    };
  }, [inquiries]);

  const overdueTag = useCallback((inq) => {
    const days = daysSince(inq.createdAt);
    if (inq.status === 'new' && days > 7) return <Badge bg="danger" className="ms-1">超期</Badge>;
    if (inq.status === 'processing' && days > 14) return <Badge bg="warning" text="dark" className="ms-1">提醒</Badge>;
    return null;
  }, []);

  const cardStyle = { borderRadius: 8 };
  const statCards = [
    { label: '新询价', value: stats.new, bg: 'info' },
    { label: '处理中', value: stats.processing, bg: 'warning' },
    { label: '已报价', value: stats.quoted, bg: 'success' },
    { label: '本月新增', value: stats.thisMonth, bg: 'primary' },
    { label: '转化率', value: `${stats.convRate}%`, bg: 'dark' },
  ];

  return (
    <Container fluid className="py-3">
      {/* Header */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h5 className="mb-0"><i className="bi bi-person-badge me-2"></i>客户询价管理</h5>
          <small className="text-muted">询价提交 / 状态跟踪 / 数据导出（共 {inquiries.length} 条）</small>
        </Col>
        <Col xs="auto" className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={() => exportCSV(filtered)}>
            <i className="bi bi-download me-1"></i>导出CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
            <i className={`bi bi-${showForm ? 'chevron-up' : 'plus'} me-1`}></i>{showForm ? '收起' : '新建询价'}
          </Button>
        </Col>
      </Row>

      {/* Form */}
      {showForm && (
        <Card className="mb-3 border-primary" style={cardStyle}>
          <Card.Header className="bg-primary text-white py-2">
            <i className="bi bi-pencil-square me-1"></i>新建询价单
          </Card.Header>
          <Card.Body>
            <Form ref={formRef} onSubmit={handleSubmit}>
              <Row>
                <Col md={3}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-bold">单位名称 <span className="text-danger">*</span></Form.Label>
                    <Form.Control size="sm" required value={form.customer} onChange={e => setField('customer', e.target.value)} placeholder="公司/船东名称" />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">联系人</Form.Label>
                    <Form.Control size="sm" value={form.contact} onChange={e => setField('contact', e.target.value)} placeholder="姓名" />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">电话</Form.Label>
                    <Form.Control size="sm" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="手机号" />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small fw-bold">主机功率(kW) <span className="text-danger">*</span></Form.Label>
                    <Form.Control size="sm" type="number" min="1" required value={form.power} onChange={e => setField('power', e.target.value)} placeholder="kW" />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">转速(rpm)</Form.Label>
                    <Form.Control size="sm" type="number" min="1" value={form.speed} onChange={e => setField('speed', e.target.value)} placeholder="rpm" />
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">用途/船型</Form.Label>
                    <Form.Select size="sm" value={form.application} onChange={e => setField('application', e.target.value)}>
                      {APP_OPTIONS.map(o => <option key={o}>{o}</option>)}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">意向型号</Form.Label>
                    <Form.Control size="sm" value={form.gearbox} onChange={e => setField('gearbox', e.target.value)} placeholder="如 HC300" />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">速比</Form.Label>
                    <Form.Control size="sm" value={form.ratio} onChange={e => setField('ratio', e.target.value)} placeholder="如 2.03" />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">推力</Form.Label>
                    <Form.Control size="sm" value={form.thrust} onChange={e => setField('thrust', e.target.value)} placeholder="如 60kN" />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-2">
                    <Form.Label className="small">备注</Form.Label>
                    <Form.Control size="sm" value={form.remark} onChange={e => setField('remark', e.target.value)} placeholder="其他技术要求或说明" />
                  </Form.Group>
                </Col>
              </Row>
              <div className="text-end mt-1">
                <Button variant="secondary" size="sm" className="me-2" onClick={() => { setForm({ ...EMPTY_FORM }); setShowForm(false); }}>取消</Button>
                <Button variant="success" size="sm" type="submit"><i className="bi bi-check-lg me-1"></i>提交询价</Button>
              </div>
            </Form>
          </Card.Body>
        </Card>
      )}

      {/* Stats */}
      <Row className="mb-3 g-2">
        {statCards.map(c => (
          <Col key={c.label}>
            <Card className="text-center h-100" style={cardStyle}>
              <Card.Body className="py-2 px-1">
                <h4 className="mb-0"><Badge bg={c.bg}>{c.value}</Badge></h4>
                <small className="text-muted">{c.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Filters */}
      <Row className="mb-2 g-2">
        <Col md={4}>
          <InputGroup size="sm">
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="搜索客户/编号/型号/联系人..." value={search} onChange={e => setSearch(e.target.value)} />
            {search && <Button variant="outline-secondary" onClick={() => setSearch('')}><i className="bi bi-x"></i></Button>}
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select size="sm" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">全部状态</option>
            {STATUS_MAP.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
          </Form.Select>
        </Col>
        <Col className="text-end text-muted small pt-1">
          显示 {filtered.length} / {inquiries.length} 条
        </Col>
      </Row>

      {/* Table */}
      <Card style={cardStyle}>
        <Card.Body className="p-0">
          <div style={{ overflowX: 'auto' }}>
            <Table hover className="mb-0 align-middle" size="sm">
              <thead className="bg-light">
                <tr>
                  <th>编号</th><th>客户</th><th>联系人</th><th>功率/转速</th>
                  <th>用途</th><th>意向型号</th><th>状态</th><th>日期</th><th style={{ minWidth: 160 }}>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={9} className="text-center text-muted py-4">暂无询价记录</td></tr>
                )}
                {filtered.map(inq => {
                  const s = STATUS_MAP.find(st => st.key === inq.status);
                  const nextStatuses = STATUS_FLOW[inq.status] || [];
                  return (
                    <tr key={inq.id}>
                      <td><strong className="text-nowrap">{inq.id}</strong></td>
                      <td>{inq.customer}</td>
                      <td>
                        {inq.contact && <span>{inq.contact}</span>}
                        {inq.phone && <><br /><small className="text-muted">{inq.phone}</small></>}
                      </td>
                      <td>
                        <span className="fw-bold">{inq.power}kW</span>
                        {inq.speed && <span className="text-muted"> / {inq.speed}rpm</span>}
                      </td>
                      <td>{inq.application}</td>
                      <td>{inq.gearbox ? <Badge bg="primary">{inq.gearbox}</Badge> : <span className="text-muted">-</span>}</td>
                      <td className="text-nowrap">
                        {nextStatuses.length > 0 ? (
                          <Form.Select size="sm" style={{ width: 100 }} value={inq.status}
                            onChange={e => changeStatus(inq.id, e.target.value)}>
                            <option value={inq.status}>{s?.label}</option>
                            {nextStatuses.map(ns => {
                              const ns_ = STATUS_MAP.find(x => x.key === ns);
                              return <option key={ns} value={ns}>{ns_?.label}</option>;
                            })}
                          </Form.Select>
                        ) : (
                          <Badge bg={s?.color}>{s?.label}</Badge>
                        )}
                        {overdueTag(inq)}
                      </td>
                      <td className="small text-nowrap">{fmtDate(inq.createdAt)}</td>
                      <td className="text-nowrap">
                        <Button size="sm" variant="outline-success" className="me-1" title="一键选型"
                          onClick={() => goSelection(inq)}>
                          <i className="bi bi-gear"></i>
                        </Button>
                        <Button size="sm" variant="outline-danger" title="删除"
                          onClick={() => deleteInquiry(inq.id)}>
                          <i className="bi bi-trash"></i>
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
