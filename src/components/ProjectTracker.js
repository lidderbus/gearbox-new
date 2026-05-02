// src/components/ProjectTracker.js
// 项目追踪看板 - 选型项目进度管理 (v2.0 - 完整CRUD + localStorage持久化)
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Modal, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { trackFeature } from '../utils/analytics';
import ExportToolbar from './ExportToolbar';
import { getProjectDocuments } from '../services/documentStorage';

// ── 常量 ──
const STORAGE_KEY = 'gearbox_projects';
const MAX_PROJECTS = 200;

const STATUSES = [
  { key: 'inquiry', label: '询价中', color: 'info', icon: 'bi-chat-dots' },
  { key: 'quoting', label: '报价中', color: 'warning', icon: 'bi-calculator' },
  { key: 'negotiating', label: '商务谈判', color: 'primary', icon: 'bi-handshake' },
  { key: 'contracted', label: '已签合同', color: 'success', icon: 'bi-file-earmark-check' },
  { key: 'production', label: '生产中', color: 'dark', icon: 'bi-gear' },
  { key: 'delivered', label: '已交付', color: 'secondary', icon: 'bi-truck' },
  { key: 'lost', label: '丢单', color: 'danger', icon: 'bi-x-circle' },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.key, s]));

// Status machine: allowed transitions
const STATUS_TRANSITIONS = {
  inquiry: ['quoting', 'lost'],
  quoting: ['negotiating', 'lost'],
  negotiating: ['contracted', 'lost'],
  contracted: ['production', 'lost'],
  production: ['delivered', 'lost'],
  delivered: [],
  lost: [],
};

const ACTIVE_STATUSES = ['inquiry', 'quoting', 'negotiating', 'contracted', 'production'];

const SEED_PROJECTS = [
  { id: 'PJ-2026-001', name: '浙嵊渔冷05688配套', customer: '浙江嵊泗渔业', gearbox: 'HCD400A', status: 'production', amount: 185000, date: '2026-03-01', salesman: '张工', note: '', statusHistory: [{ status: 'inquiry', time: '2026-02-15T08:00:00' }, { status: 'quoting', time: '2026-02-18T10:00:00' }, { status: 'negotiating', time: '2026-02-22T14:00:00' }, { status: 'contracted', time: '2026-02-28T09:00:00' }, { status: 'production', time: '2026-03-01T08:00:00' }] },
  { id: 'PJ-2026-002', name: '粤珠海拖0236配套', customer: '珠海拖轮公司', gearbox: 'HCD800', status: 'contracted', amount: 420000, date: '2026-03-08', salesman: '李工', note: '', statusHistory: [{ status: 'inquiry', time: '2026-02-20T08:00:00' }, { status: 'quoting', time: '2026-02-25T10:00:00' }, { status: 'negotiating', time: '2026-03-02T14:00:00' }, { status: 'contracted', time: '2026-03-08T09:00:00' }] },
  { id: 'PJ-2026-003', name: '闽霞渔运09166配套', customer: '福建霞浦航运', gearbox: 'HC300', status: 'quoting', amount: 96000, date: '2026-03-12', salesman: '王工', note: '', statusHistory: [{ status: 'inquiry', time: '2026-03-10T08:00:00' }, { status: 'quoting', time: '2026-03-12T10:00:00' }] },
  { id: 'PJ-2026-004', name: '长航集02068配套', customer: '长江航运集团', gearbox: 'HCD600A', status: 'negotiating', amount: 280000, date: '2026-03-15', salesman: '张工', note: '', statusHistory: [{ status: 'inquiry', time: '2026-03-05T08:00:00' }, { status: 'quoting', time: '2026-03-10T10:00:00' }, { status: 'negotiating', time: '2026-03-15T14:00:00' }] },
  { id: 'PJ-2026-005', name: '琼海渔12088配套', customer: '海南琼海渔业', gearbox: 'HC200', status: 'inquiry', amount: 65000, date: '2026-03-18', salesman: '陈工', note: '', statusHistory: [{ status: 'inquiry', time: '2026-03-18T08:00:00' }] },
  { id: 'PJ-2026-006', name: '鲁威海港拖5号配套', customer: '威海港务局', gearbox: 'GWC52.59', status: 'quoting', amount: 580000, date: '2026-03-20', salesman: '李工', note: '', statusHistory: [{ status: 'inquiry', time: '2026-03-15T08:00:00' }, { status: 'quoting', time: '2026-03-20T10:00:00' }] },
];

// ── localStorage helpers (safe pattern from documentStorage.js) ──
const safeRead = () => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.warn('读取项目数据失败:', e);
    return null;
  }
};

const safeWrite = (projects) => {
  try {
    const trimmed = projects.slice(0, MAX_PROJECTS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    return true;
  } catch (e) {
    console.warn('写入项目数据失败:', e);
    if (e.name === 'QuotaExceededError') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(projects.slice(-50)));
        return true;
      } catch (_) { /* ignore */ }
    }
    return false;
  }
};

const loadProjects = () => {
  const stored = safeRead();
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  safeWrite(SEED_PROJECTS);
  return [...SEED_PROJECTS];
};

// ── ID generator ──
const generateId = (projects) => {
  const year = new Date().getFullYear();
  const prefix = `PJ-${year}-`;
  let max = 0;
  projects.forEach(p => {
    if (p.id && p.id.startsWith('PJ-')) {
      const num = parseInt(p.id.split('-').pop(), 10);
      if (!isNaN(num) && num > max) max = num;
    }
  });
  return `${prefix}${String(max + 1).padStart(3, '0')}`;
};

// ── CSV export ──
const exportCSV = (rows) => {
  const headers = ['项目编号', '项目名称', '客户', '齿轮箱型号', '金额(元)', '状态', '日期', '负责人', '备注'];
  const lines = [headers.join(',')];
  rows.forEach(p => {
    const s = STATUS_MAP[p.status];
    lines.push([p.id, p.name, p.customer, p.gearbox, p.amount, s?.label || p.status, p.date, p.salesman, p.note || ''].map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  });
  const blob = new Blob(['\uFEFF' + lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `项目列表_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
};

// ── Empty form ──
const emptyForm = () => ({ name: '', customer: '', gearbox: '', amount: '', salesman: '', note: '' });

// ── Component ──
// 把项目 ID(PJ-2026-001) 与文档 projectId(PRJ-2026-...) 都尝试一遍,兼容两种命名
const lookupRelatedDocs = (project) => {
  const candidates = new Set();
  if (project.id) {
    candidates.add(project.id);
    candidates.add(project.id.replace(/^PJ-/, 'PRJ-'));
    candidates.add(project.id.replace(/^PJ-/, 'TI-'));
  }
  if (project.name) candidates.add(`legacy:${project.name}`);
  const merged = { inquiry: [], quotation: [], agreement: [], contract: [] };
  candidates.forEach(pid => {
    const docs = getProjectDocuments(pid);
    Object.keys(merged).forEach(k => {
      docs[k].forEach(d => {
        if (!merged[k].some(existing => existing.id === d.id)) merged[k].push(d);
      });
    });
  });
  return merged;
};

const DOC_TYPE_META = {
  inquiry: { label: '技术询单', icon: 'bi-file-earmark-plus', color: 'primary', tabKey: 'inquiry' },
  quotation: { label: '报价单', icon: 'bi-currency-yen', color: 'success', tabKey: 'quotation' },
  agreement: { label: '技术协议', icon: 'bi-file-earmark-text', color: 'info', tabKey: 'agreement' },
  contract: { label: '销售合同', icon: 'bi-file-earmark-ruled', color: 'warning', tabKey: 'contract' },
};

export default function ProjectTracker({ colors, theme, onNavigate }) {
  const [projects, setProjects] = useState(loadProjects);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [sortKey, setSortKey] = useState('date');
  const [sortAsc, setSortAsc] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [expandedId, setExpandedId] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const saveTimer = useRef(null);

  // Persist on change (debounced)
  useEffect(() => {
    clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => safeWrite(projects), 300);
    return () => clearTimeout(saveTimer.current);
  }, [projects]);

  // ── Filtering + sorting ──
  const filtered = useMemo(() => {
    let list = projects.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toUpperCase();
        return p.id.toUpperCase().includes(q) || p.name.includes(search) || p.customer.includes(search) || p.gearbox.toUpperCase().includes(q) || (p.salesman && p.salesman.includes(search));
      }
      return true;
    });
    list.sort((a, b) => {
      let va = a[sortKey], vb = b[sortKey];
      if (sortKey === 'amount') { va = Number(va) || 0; vb = Number(vb) || 0; }
      if (sortKey === 'status') {
        va = STATUSES.findIndex(s => s.key === va);
        vb = STATUSES.findIndex(s => s.key === vb);
      }
      if (va < vb) return sortAsc ? -1 : 1;
      if (va > vb) return sortAsc ? 1 : -1;
      return 0;
    });
    return list;
  }, [projects, statusFilter, search, sortKey, sortAsc]);

  // ── Statistics ──
  const stats = useMemo(() => {
    const counts = {};
    let totalAmount = 0, activeAmount = 0, monthNew = 0;
    let wonCount = 0;
    const now = new Date();
    const monthStart = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    projects.forEach(p => {
      counts[p.status] = (counts[p.status] || 0) + 1;
      totalAmount += Number(p.amount) || 0;
      if (ACTIVE_STATUSES.includes(p.status)) activeAmount += Number(p.amount) || 0;
      if (['contracted', 'production', 'delivered'].includes(p.status)) wonCount++;
      if (p.date && p.date.startsWith(monthStart)) monthNew++;
    });
    const total = projects.length;
    const convRate = total > 0 ? ((wonCount / total) * 100).toFixed(1) : '0.0';
    return { counts, totalAmount, activeAmount, monthNew, convRate, total };
  }, [projects]);

  // ── Handlers ──
  const handleSort = useCallback((key) => {
    setSortKey(prev => { if (prev === key) { setSortAsc(a => !a); return key; } setSortAsc(false); return key; });
  }, []);

  const openNew = useCallback(() => { setEditId(null); setForm(emptyForm()); setShowModal(true); }, []);

  const openEdit = useCallback((p) => {
    setEditId(p.id);
    setForm({ name: p.name, customer: p.customer, gearbox: p.gearbox, amount: String(p.amount), salesman: p.salesman, note: p.note || '' });
    setShowModal(true);
  }, []);

  const handleSave = useCallback(() => {
    if (!form.name.trim() || !form.customer.trim()) return;
    const amt = Math.max(0, parseInt(form.amount, 10) || 0);
    if (editId) {
      setProjects(prev => prev.map(p => p.id === editId ? { ...p, name: form.name.trim(), customer: form.customer.trim(), gearbox: form.gearbox.trim(), amount: amt, salesman: form.salesman.trim(), note: form.note.trim() } : p));
    } else {
      setProjects(prev => {
        const newP = {
          id: generateId(prev), name: form.name.trim(), customer: form.customer.trim(),
          gearbox: form.gearbox.trim(), amount: amt, salesman: form.salesman.trim(),
          note: form.note.trim(), status: 'inquiry',
          date: new Date().toISOString().slice(0, 10),
          statusHistory: [{ status: 'inquiry', time: new Date().toISOString() }],
        };
        trackFeature('project_create', { id: newP.id, customer: newP.customer });
        return [newP, ...prev];
      });
    }
    setShowModal(false);
  }, [form, editId]);

  const handleDelete = useCallback(() => {
    if (!deleteTarget) return;
    setProjects(prev => prev.filter(p => p.id !== deleteTarget));
    setDeleteTarget(null);
    if (expandedId === deleteTarget) setExpandedId(null);
  }, [deleteTarget, expandedId]);

  const handleStatusChange = useCallback((id, newStatus) => {
    trackFeature('project_status_change', { id, status: newStatus });
    setProjects(prev => prev.map(p => {
      if (p.id !== id) return p;
      const history = Array.isArray(p.statusHistory) ? [...p.statusHistory] : [];
      history.push({ status: newStatus, time: new Date().toISOString() });
      return { ...p, status: newStatus, statusHistory: history };
    }));
  }, []);

  const getExportData = useCallback(() => {
    const headers = ['项目编号', '项目名称', '客户', '齿轮箱型号', '金额(元)', '状态', '日期', '负责人', '备注'];
    const rows = filtered.map(p => {
      const s = STATUS_MAP[p.status];
      return [p.id, p.name, p.customer, p.gearbox, p.amount, s?.label || p.status, p.date, p.salesman, p.note || ''];
    });
    return {
      filename: `项目列表_${new Date().toISOString().slice(0, 10)}`,
      title: '项目追踪',
      headers,
      rows,
    };
  }, [filtered]);

  const formField = (label, key, placeholder, type = 'text') => (
    <Form.Group className="mb-2">
      <Form.Label className="small mb-1">{label}</Form.Label>
      <Form.Control size="sm" type={type} placeholder={placeholder} value={form[key]}
        onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))} />
    </Form.Group>
  );

  const SortIcon = ({ col }) => sortKey === col ? <i className={`bi bi-caret-${sortAsc ? 'up' : 'down'}-fill ms-1`}></i> : null;
  const thStyle = { cursor: 'pointer', userSelect: 'none' };

  return (
    <Container fluid className="py-3">
      {/* Header */}
      <Row className="mb-3 align-items-center">
        <Col><h5 className="mb-0"><i className="bi bi-kanban me-2"></i>项目追踪</h5></Col>
        <Col xs="auto">
          <span className="me-2"><ExportToolbar getData={getExportData} disabled={filtered.length === 0} /></span>
          <Button size="sm" variant="primary" onClick={openNew}>
            <i className="bi bi-plus-lg me-1"></i>新建项目
          </Button>
        </Col>
      </Row>

      {/* Statistics cards */}
      <Row className="mb-3 g-2">
        {STATUSES.filter(s => s.key !== 'lost').map(s => (
          <Col key={s.key}>
            <Card className={`text-center ${statusFilter === s.key ? 'border-primary shadow-sm' : ''}`}
              style={{ cursor: 'pointer' }} onClick={() => setStatusFilter(prev => prev === s.key ? 'all' : s.key)}>
              <Card.Body className="py-2 px-1">
                <h4 className="mb-0"><Badge bg={s.color}>{stats.counts[s.key] || 0}</Badge></h4>
                <small>{s.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
        <Col>
          <Card className={`text-center ${statusFilter === 'lost' ? 'border-danger shadow-sm' : ''}`}
            style={{ cursor: 'pointer' }} onClick={() => setStatusFilter(prev => prev === 'lost' ? 'all' : 'lost')}>
            <Card.Body className="py-2 px-1">
              <h4 className="mb-0"><Badge bg="danger">{stats.counts.lost || 0}</Badge></h4>
              <small>丢单</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mb-3 g-2">
        <Col md={3}>
          <Card className="text-center h-100"><Card.Body className="py-2">
            <div className="text-muted small">在途金额</div>
            <div className="fw-bold" style={{ color: '#e67e22' }}>¥{stats.activeAmount.toLocaleString()}</div>
          </Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100"><Card.Body className="py-2">
            <div className="text-muted small">总金额</div>
            <div className="fw-bold">¥{stats.totalAmount.toLocaleString()}</div>
          </Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100"><Card.Body className="py-2">
            <div className="text-muted small">本月新增</div>
            <div className="fw-bold text-primary">{stats.monthNew}</div>
          </Card.Body></Card>
        </Col>
        <Col md={3}>
          <Card className="text-center h-100"><Card.Body className="py-2">
            <div className="text-muted small">转化率</div>
            <div className="fw-bold text-success">{stats.convRate}%</div>
          </Card.Body></Card>
        </Col>
      </Row>

      {/* Search / Filter bar */}
      <Card className="mb-3">
        <Card.Body className="py-2">
          <Row className="align-items-center">
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control placeholder="搜索项目/客户/型号/负责人..." value={search} onChange={e => setSearch(e.target.value)} />
                {search && <Button variant="outline-secondary" size="sm" onClick={() => setSearch('')}><i className="bi bi-x"></i></Button>}
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select size="sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">全部状态 ({stats.total})</option>
                {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label} ({stats.counts[s.key] || 0})</option>)}
              </Form.Select>
            </Col>
            <Col md={5} className="text-end">
              <Badge bg="info" className="py-2 px-3">{filtered.length} / {stats.total} 个项目</Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Project table */}
      <Card>
        <Card.Body className="p-0">
          <Table hover className="mb-0" size="sm">
            <thead className="bg-light">
              <tr>
                <th style={thStyle} onClick={() => handleSort('id')}>项目编号<SortIcon col="id" /></th>
                <th style={thStyle} onClick={() => handleSort('name')}>项目名称<SortIcon col="name" /></th>
                <th>客户</th>
                <th>齿轮箱</th>
                <th style={thStyle} onClick={() => handleSort('amount')} className="text-end">金额(元)<SortIcon col="amount" /></th>
                <th style={thStyle} onClick={() => handleSort('status')}>状态<SortIcon col="status" /></th>
                <th style={thStyle} onClick={() => handleSort('date')}>日期<SortIcon col="date" /></th>
                <th>负责人</th>
                <th style={{ width: 100 }}>操作</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={9} className="text-center text-muted py-4">暂无匹配项目</td></tr>
              )}
              {filtered.map(p => {
                const s = STATUS_MAP[p.status];
                const transitions = STATUS_TRANSITIONS[p.status] || [];
                const isExpanded = expandedId === p.id;
                return (
                  <React.Fragment key={p.id}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => setExpandedId(prev => prev === p.id ? null : p.id)}>
                      <td><strong>{p.id}</strong></td>
                      <td>{p.name}</td>
                      <td>{p.customer}</td>
                      <td><Badge bg="primary">{p.gearbox}</Badge></td>
                      <td className="text-end">¥{(Number(p.amount) || 0).toLocaleString()}</td>
                      <td>
                        {transitions.length > 0 ? (
                          <Form.Select size="sm" value={p.status} style={{ width: 110, display: 'inline-block', fontSize: '0.8rem' }}
                            onClick={e => e.stopPropagation()}
                            onChange={e => { e.stopPropagation(); handleStatusChange(p.id, e.target.value); }}>
                            <option value={p.status}>{s?.label}</option>
                            {transitions.map(t => <option key={t} value={t}>{STATUS_MAP[t]?.label}</option>)}
                          </Form.Select>
                        ) : (
                          <Badge bg={s?.color || 'secondary'}><i className={`bi ${s?.icon} me-1`}></i>{s?.label}</Badge>
                        )}
                      </td>
                      <td className="small">{p.date}</td>
                      <td>{p.salesman}</td>
                      <td onClick={e => e.stopPropagation()}>
                        <OverlayTrigger placement="top" overlay={<Tooltip>编辑</Tooltip>}>
                          <Button variant="link" size="sm" className="p-0 me-2" onClick={() => openEdit(p)}>
                            <i className="bi bi-pencil"></i>
                          </Button>
                        </OverlayTrigger>
                        <OverlayTrigger placement="top" overlay={<Tooltip>删除</Tooltip>}>
                          <Button variant="link" size="sm" className="p-0 text-danger" onClick={() => setDeleteTarget(p.id)}>
                            <i className="bi bi-trash"></i>
                          </Button>
                        </OverlayTrigger>
                      </td>
                    </tr>
                    {/* Expanded panel:状态历史 + 关联文档 */}
                    {isExpanded && (
                      <tr>
                        <td colSpan={9} className="bg-light px-4 py-2">
                          {Array.isArray(p.statusHistory) && p.statusHistory.length > 0 && (
                            <div className="d-flex align-items-center flex-wrap gap-1 mb-2">
                              <small className="text-muted me-2"><i className="bi bi-clock-history me-1"></i>状态历史:</small>
                              {p.statusHistory.map((h, i) => {
                                const hs = STATUS_MAP[h.status];
                                return (
                                  <React.Fragment key={i}>
                                    {i > 0 && <i className="bi bi-arrow-right text-muted mx-1"></i>}
                                    <Badge bg={hs?.color || 'secondary'} className="py-1">
                                      {hs?.label || h.status}
                                      <span className="ms-1 fw-normal" style={{ fontSize: '0.7rem' }}>
                                        {h.time ? new Date(h.time).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : ''}
                                      </span>
                                    </Badge>
                                  </React.Fragment>
                                );
                              })}
                            </div>
                          )}

                          {/* 关联文档 — 跨 inquiry/quotation/agreement/contract 4 类聚合 */}
                          <RelatedDocsPanel project={p} onNavigate={onNavigate} />

                          {p.note && <div className="mt-2"><small className="text-muted"><i className="bi bi-sticky me-1"></i>备注: {p.note}</small></div>}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* New / Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ fontSize: '1rem' }}>{editId ? '编辑项目' : '新建项目'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {formField('项目名称 *', 'name', '例: 浙嵊渔冷05688配套')}
          {formField('客户 *', 'customer', '客户名称')}
          {formField('齿轮箱型号', 'gearbox', '例: HCD400A')}
          {formField('金额(元)', 'amount', '0', 'number')}
          {formField('负责人', 'salesman', '例: 张工')}
          {formField('备注', 'note', '可选备注信息')}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowModal(false)}>取消</Button>
          <Button variant="primary" size="sm" onClick={handleSave} disabled={!form.name.trim() || !form.customer.trim()}>
            {editId ? '保存修改' : '创建项目'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete confirm Modal */}
      <Modal show={!!deleteTarget} onHide={() => setDeleteTarget(null)} centered size="sm">
        <Modal.Header closeButton><Modal.Title style={{ fontSize: '1rem' }}>确认删除</Modal.Title></Modal.Header>
        <Modal.Body>确定要删除项目 <strong>{deleteTarget}</strong> 吗？此操作不可撤销。</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setDeleteTarget(null)}>取消</Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>确认删除</Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

// 关联文档面板 — 显示该项目下 inquiry/quotation/agreement/contract 4 类文档
// 跳转前把 sessionStorage.current_project_id 设为项目 ID,让下游 quotation/agreement/contract 保存时自动归档
const RelatedDocsPanel = ({ project, onNavigate }) => {
  const docs = useMemo(() => lookupRelatedDocs(project), [project]);
  const totalCount = ['inquiry', 'quotation', 'agreement', 'contract']
    .reduce((s, k) => s + (docs[k]?.length || 0), 0);

  const navigateWithProject = (tabKey) => {
    try {
      sessionStorage.setItem('current_project_id', project.id);
      if (project.name) sessionStorage.setItem('current_project_name', project.name);
    } catch (e) { /* ignore */ }
    if (onNavigate) onNavigate(tabKey);
  };

  return (
    <div>
      <div className="d-flex align-items-center flex-wrap gap-2 mb-1">
        <small className="text-muted me-1">
          <i className="bi bi-files me-1"></i>关联文档:
        </small>
        {totalCount === 0 ? (
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>暂无 — 可点击下方按钮新建,会自动挂入此项目
          </small>
        ) : (
          ['inquiry', 'quotation', 'agreement', 'contract'].map(k => {
            const meta = DOC_TYPE_META[k];
            const list = docs[k] || [];
            if (list.length === 0) return null;
            return (
              <Button
                key={k}
                size="sm"
                variant={`outline-${meta.color}`}
                onClick={() => navigateWithProject(meta.tabKey)}
                style={{ fontSize: '0.78rem', padding: '0.15em 0.5em' }}
                title={`已有 ${list.length} 份${meta.label},点击查看`}
              >
                <i className={`bi ${meta.icon} me-1`}></i>
                {meta.label}
                <Badge bg={meta.color} className="ms-1">{list.length}</Badge>
              </Button>
            );
          })
        )}
      </div>
      {/* 快捷新建 — 始终展示,点击会先设 sessionStorage 项目 ID,新文档保存时自动归档 */}
      <div className="d-flex align-items-center flex-wrap gap-2">
        <small className="text-muted me-1">
          <i className="bi bi-plus-circle me-1"></i>新建到此项目:
        </small>
        {['inquiry', 'quotation', 'agreement', 'contract'].map(k => {
          const meta = DOC_TYPE_META[k];
          return (
            <Button
              key={k}
              size="sm"
              variant="link"
              onClick={() => navigateWithProject(meta.tabKey)}
              style={{ fontSize: '0.78rem', padding: 0, textDecoration: 'none' }}
            >
              <i className={`bi ${meta.icon} me-1 text-${meta.color}`}></i>{meta.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};
