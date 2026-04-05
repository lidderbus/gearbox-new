// src/components/InquiryView.js
// 技术询单管理 - 客户技术需求收集与跟踪
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup } from 'react-bootstrap';
import { inquiryStore } from '../services/documentStorage';
import { generateDocNumber } from '../utils/documentNumbering';

const STATUSES = [
  { key: 'new', label: '新建', color: 'info' },
  { key: 'processing', label: '处理中', color: 'warning' },
  { key: 'quoted', label: '已报价', color: 'success' },
  { key: 'expired', label: '已过期', color: 'secondary' },
  { key: 'closed', label: '已成交', color: 'primary' },
];

const SHIP_TYPES = ['渔船', '货船', '拖轮', '客船', '工作船', '工程船', '油船', '其他'];
const CLASS_SOCIETIES = ['CCS', 'DNV', 'LR', 'ABS', 'BV', '无'];

const EMPTY_FORM = {
  customer: '', contact: '', phone: '', email: '',
  shipType: '渔船', power: '', speed: '', ratioTarget: '', thrustReq: '',
  model: '', classSociety: 'CCS', specialReq: '',
  deliveryDate: '', deliveryPlace: '',
};

const SEED_DATA = [
  { id: 'TI-2026-0001', customer: '浙江嵊泗渔业', contact: '周经理', phone: '138****5566', email: 'zhou@ssfish.cn', shipType: '渔船', power: '450', speed: '1800', ratioTarget: '4.0', thrustReq: '', model: 'HCD400A', classSociety: 'CCS', specialReq: '', deliveryDate: '2026-06-15', deliveryPlace: '舟山', status: 'quoted', createdAt: '2026-03-15T08:30:00Z' },
  { id: 'TI-2026-0002', customer: '威海港务局', contact: '刘主任', phone: '139****7788', email: 'liu@whport.cn', shipType: '拖轮', power: '1200', speed: '1000', ratioTarget: '5.5', thrustReq: '85', model: 'GWC52.59', classSociety: 'CCS', specialReq: '需配备全回转推进装置', deliveryDate: '2026-08-01', deliveryPlace: '威海', status: 'processing', createdAt: '2026-03-18T10:00:00Z' },
  { id: 'TI-2026-0003', customer: '广州远洋运输', contact: '陈总工', phone: '137****4455', email: 'chen@gzocean.com', shipType: '货船', power: '735', speed: '1000', ratioTarget: '3.5', thrustReq: '60', model: '', classSociety: 'DNV', specialReq: '远洋航线，要求DNV入级', deliveryDate: '2026-09-01', deliveryPlace: '广州', status: 'new', createdAt: '2026-03-25T14:20:00Z' },
  { id: 'TI-2026-0004', customer: '海南琼海渔业', contact: '吴船长', phone: '136****2233', email: '', shipType: '渔船', power: '220', speed: '1500', ratioTarget: '', thrustReq: '', model: '', classSociety: 'CCS', specialReq: '小型拖网渔船，经济型', deliveryDate: '2026-07-01', deliveryPlace: '海口', status: 'new', createdAt: '2026-04-01T09:00:00Z' },
  { id: 'TI-2026-0005', customer: '中远海运重工', contact: '张工', phone: '135****9900', email: 'zhang@cosco-hw.com', shipType: '工程船', power: '2200', speed: '750', ratioTarget: '6.0', thrustReq: '150', model: 'GWC62.71', classSociety: 'LR', specialReq: '海工平台供应船，需DP2配置', deliveryDate: '2026-10-15', deliveryPlace: '南通', status: 'processing', createdAt: '2026-04-02T11:30:00Z' },
  { id: 'TI-2026-0006', customer: '福建马尾造船', contact: '林经理', phone: '159****6677', email: 'lin@mwship.com', shipType: '客船', power: '880', speed: '1200', ratioTarget: '4.5', thrustReq: '70', model: 'HC1000', classSociety: 'CCS', specialReq: '客滚船，振动噪声要求高', deliveryDate: '2026-11-01', deliveryPlace: '福州', status: 'closed', createdAt: '2026-02-20T16:00:00Z' },
];

export default function InquiryView({ colors, theme }) {
  const [inquiries, setInquiries] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [search, setSearch] = useState('');
  const [msg, setMsg] = useState(null);

  // Load data on mount, seed if empty
  useEffect(() => {
    let data = inquiryStore.getAll();
    if (data.length === 0) {
      SEED_DATA.forEach(d => inquiryStore.save({ ...d }));
      data = inquiryStore.getAll();
    }
    setInquiries(data);
  }, []);

  const reload = useCallback(() => setInquiries(inquiryStore.getAll()), []);

  const flash = useCallback((text, variant = 'success') => {
    setMsg({ text, variant });
    setTimeout(() => setMsg(null), 3000);
  }, []);

  // Statistics
  const stats = useMemo(() => {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    return {
      newCount: inquiries.filter(i => i.status === 'new').length,
      processingCount: inquiries.filter(i => i.status === 'processing').length,
      quotedCount: inquiries.filter(i => i.status === 'quoted').length,
      monthCount: inquiries.filter(i => (i.createdAt || '') >= monthStart).length,
    };
  }, [inquiries]);

  // Filtered list
  const filtered = useMemo(() => {
    if (!search.trim()) return [...inquiries].reverse();
    const kw = search.toLowerCase();
    return [...inquiries].filter(i =>
      [i.id, i.customer, i.model, i.shipType, i.contact].some(f => (f || '').toLowerCase().includes(kw))
    ).reverse();
  }, [inquiries, search]);

  // Form handlers
  const setField = useCallback((k, v) => setForm(prev => ({ ...prev, [k]: v })), []);

  const handleSubmit = useCallback(() => {
    if (!form.customer.trim()) return flash('请填写客户单位名称', 'danger');
    if (!form.power || Number(form.power) <= 0) return flash('请填写有效的主机功率', 'danger');
    const docNumber = generateDocNumber('inquiry');
    const doc = { ...form, id: docNumber, status: 'new' };
    inquiryStore.save(doc);
    setForm(EMPTY_FORM);
    setShowForm(false);
    reload();
    flash(`询单 ${docNumber} 已保存`);
  }, [form, reload, flash]);

  const handleStatusChange = useCallback((id, newStatus) => {
    const item = inquiryStore.getById(id);
    if (item) {
      inquiryStore.save({ ...item, status: newStatus });
      reload();
    }
  }, [reload]);

  const handleDelete = useCallback((id) => {
    if (!window.confirm(`确认删除询单 ${id}？`)) return;
    inquiryStore.remove(id);
    reload();
    flash('已删除');
  }, [reload, flash]);

  const handleSelection = useCallback((inq) => {
    alert(`请在选型中心使用此参数：\n功率: ${inq.power} kW\n转速: ${inq.speed} rpm${inq.ratioTarget ? '\n目标速比: ' + inq.ratioTarget : ''}`);
  }, []);

  // CSV export
  const handleExport = useCallback(() => {
    const headers = ['编号', '客户', '联系人', '电话', '邮箱', '船型', '功率(kW)', '转速(rpm)', '目标速比', '推力(kN)', '意向型号', '船检', '特殊要求', '交货日期', '交货地点', '状态', '创建时间'];
    const statusMap = Object.fromEntries(STATUSES.map(s => [s.key, s.label]));
    const rows = inquiries.map(i => [i.id, i.customer, i.contact, i.phone, i.email, i.shipType, i.power, i.speed, i.ratioTarget, i.thrustReq, i.model, i.classSociety, i.specialReq, i.deliveryDate, i.deliveryPlace, statusMap[i.status] || i.status, i.createdAt]);
    const bom = '\uFEFF';
    const csv = bom + [headers, ...rows].map(r => r.map(c => `"${(c || '').toString().replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `技术询单_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
    flash('CSV导出成功');
  }, [inquiries, flash]);

  const statusBadge = (status) => {
    const s = STATUSES.find(st => st.key === status);
    return <Badge bg={s?.color || 'secondary'}>{s?.label || status}</Badge>;
  };

  return (
    <Container fluid className="py-3">
      {/* Header */}
      <Row className="mb-3 align-items-center">
        <Col>
          <h5 className="mb-0"><i className="bi bi-file-earmark-text me-2"></i>技术询单管理</h5>
          <small className="text-muted">客户技术需求收集、跟踪与转化</small>
        </Col>
        <Col xs="auto">
          <Button variant="outline-success" size="sm" className="me-2" onClick={handleExport}>
            <i className="bi bi-download me-1"></i>导出CSV
          </Button>
          <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
            <i className={`bi bi-${showForm ? 'chevron-up' : 'plus'} me-1`}></i>{showForm ? '收起' : '新建询单'}
          </Button>
        </Col>
      </Row>

      {msg && <Alert variant={msg.variant} dismissible onClose={() => setMsg(null)} className="py-2">{msg.text}</Alert>}

      {/* Statistics */}
      <Row className="mb-3 g-2">
        {[
          { label: '新询价', value: stats.newCount, color: 'info', icon: 'bi-inbox' },
          { label: '处理中', value: stats.processingCount, color: 'warning', icon: 'bi-hourglass-split' },
          { label: '已报价', value: stats.quotedCount, color: 'success', icon: 'bi-check2-circle' },
          { label: '本月新增', value: stats.monthCount, color: 'primary', icon: 'bi-calendar-plus' },
        ].map(s => (
          <Col key={s.label} md={3} xs={6}>
            <Card className="text-center h-100">
              <Card.Body className="py-2">
                <i className={`bi ${s.icon} me-1`}></i>
                <h4 className="mb-0"><Badge bg={s.color}>{s.value}</Badge></h4>
                <small className="text-muted">{s.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Inquiry Form */}
      {showForm && (
        <Card className="mb-3 border-primary">
          <Card.Header className="bg-primary text-white py-2">
            <i className="bi bi-pencil-square me-1"></i>新建技术询单
          </Card.Header>
          <Card.Body>
            {/* 客户信息 */}
            <div className="small fw-bold text-muted mb-1">客户信息</div>
            <Row className="mb-2">
              <Col md={3}><Form.Group><Form.Label className="small">单位名称 <span className="text-danger">*</span></Form.Label><Form.Control size="sm" value={form.customer} onChange={e => setField('customer', e.target.value)} placeholder="公司/船东名称" /></Form.Group></Col>
              <Col md={3}><Form.Group><Form.Label className="small">联系人</Form.Label><Form.Control size="sm" value={form.contact} onChange={e => setField('contact', e.target.value)} placeholder="姓名" /></Form.Group></Col>
              <Col md={3}><Form.Group><Form.Label className="small">电话</Form.Label><Form.Control size="sm" value={form.phone} onChange={e => setField('phone', e.target.value)} placeholder="手机号" /></Form.Group></Col>
              <Col md={3}><Form.Group><Form.Label className="small">邮箱</Form.Label><Form.Control size="sm" type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="电子邮箱" /></Form.Group></Col>
            </Row>
            {/* 技术需求 */}
            <div className="small fw-bold text-muted mb-1">技术需求</div>
            <Row className="mb-2">
              <Col md={2}><Form.Group><Form.Label className="small">船型</Form.Label><Form.Select size="sm" value={form.shipType} onChange={e => setField('shipType', e.target.value)}>{SHIP_TYPES.map(t => <option key={t}>{t}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label className="small">主机功率(kW) <span className="text-danger">*</span></Form.Label><Form.Control size="sm" type="number" value={form.power} onChange={e => setField('power', e.target.value)} placeholder="kW" /></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label className="small">转速(rpm)</Form.Label><Form.Control size="sm" type="number" value={form.speed} onChange={e => setField('speed', e.target.value)} placeholder="rpm" /></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label className="small">目标速比</Form.Label><Form.Control size="sm" type="number" step="0.1" value={form.ratioTarget} onChange={e => setField('ratioTarget', e.target.value)} placeholder="如 4.0" /></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label className="small">推力要求(kN)</Form.Label><Form.Control size="sm" type="number" value={form.thrustReq} onChange={e => setField('thrustReq', e.target.value)} placeholder="kN" /></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label className="small">意向型号</Form.Label><Form.Control size="sm" value={form.model} onChange={e => setField('model', e.target.value)} placeholder="如HC300" /></Form.Group></Col>
            </Row>
            {/* 配置与交货 */}
            <Row className="mb-2">
              <Col md={2}><Form.Group><Form.Label className="small">船检要求</Form.Label><Form.Select size="sm" value={form.classSociety} onChange={e => setField('classSociety', e.target.value)}>{CLASS_SOCIETIES.map(c => <option key={c}>{c}</option>)}</Form.Select></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label className="small">期望交货日期</Form.Label><Form.Control size="sm" type="date" value={form.deliveryDate} onChange={e => setField('deliveryDate', e.target.value)} /></Form.Group></Col>
              <Col md={2}><Form.Group><Form.Label className="small">交货地点</Form.Label><Form.Control size="sm" value={form.deliveryPlace} onChange={e => setField('deliveryPlace', e.target.value)} placeholder="城市/港口" /></Form.Group></Col>
              <Col md={6}><Form.Group><Form.Label className="small">特殊要求</Form.Label><Form.Control size="sm" as="textarea" rows={1} value={form.specialReq} onChange={e => setField('specialReq', e.target.value)} placeholder="振动噪声、DP配置、特殊工况等" /></Form.Group></Col>
            </Row>
            <div className="text-end mt-2">
              <Button variant="secondary" size="sm" className="me-2" onClick={() => { setForm(EMPTY_FORM); setShowForm(false); }}>取消</Button>
              <Button variant="success" size="sm" onClick={handleSubmit}><i className="bi bi-check-lg me-1"></i>保存询单</Button>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* History Table */}
      <Card>
        <Card.Header className="d-flex justify-content-between align-items-center py-2">
          <span><i className="bi bi-list-ul me-1"></i>询单记录 ({filtered.length})</span>
          <InputGroup size="sm" style={{ width: 220 }}>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="搜索客户/编号/型号..." value={search} onChange={e => setSearch(e.target.value)} />
          </InputGroup>
        </Card.Header>
        <Card.Body className="p-0">
          <div style={{ overflowX: 'auto' }}>
            <Table hover size="sm" className="mb-0" style={{ fontSize: '0.85rem' }}>
              <thead className="bg-light">
                <tr>
                  <th>编号</th><th>客户</th><th>型号/功率</th><th>船型</th><th>船检</th><th>状态</th><th>日期</th><th>操作</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="text-center text-muted py-3">暂无询单记录</td></tr>
                )}
                {filtered.map(inq => (
                  <tr key={inq.id}>
                    <td><strong>{inq.id}</strong></td>
                    <td>
                      {inq.customer}
                      {inq.contact && <><br /><small className="text-muted">{inq.contact} {inq.phone}</small></>}
                    </td>
                    <td>
                      {inq.model && <Badge bg="primary" className="me-1">{inq.model}</Badge>}
                      <small>{inq.power}kW{inq.speed ? ` / ${inq.speed}rpm` : ''}</small>
                    </td>
                    <td>{inq.shipType}</td>
                    <td><Badge bg={inq.classSociety === '无' ? 'light' : 'dark'} text={inq.classSociety === '无' ? 'dark' : undefined}>{inq.classSociety}</Badge></td>
                    <td>
                      <Form.Select size="sm" value={inq.status} onChange={e => handleStatusChange(inq.id, e.target.value)}
                        style={{ width: 90, fontSize: '0.8rem', padding: '2px 4px' }}>
                        {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                      </Form.Select>
                    </td>
                    <td className="small text-nowrap">{(inq.createdAt || '').slice(0, 10)}</td>
                    <td className="text-nowrap">
                      {inq.power && inq.speed && (
                        <Button size="sm" variant="outline-primary" className="me-1" title="一键选型" onClick={() => handleSelection(inq)}>
                          <i className="bi bi-gear"></i>
                        </Button>
                      )}
                      <Button size="sm" variant="outline-danger" title="删除" onClick={() => handleDelete(inq.id)}>
                        <i className="bi bi-trash"></i>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}
