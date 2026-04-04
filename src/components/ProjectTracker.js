// src/components/ProjectTracker.js
// 项目追踪看板 - 选型项目进度管理
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup, InputGroup } from 'react-bootstrap';

const STATUSES = [
  { key: 'inquiry', label: '询价中', color: 'info', icon: 'bi-chat-dots' },
  { key: 'quoting', label: '报价中', color: 'warning', icon: 'bi-calculator' },
  { key: 'negotiating', label: '商务谈判', color: 'primary', icon: 'bi-handshake' },
  { key: 'contracted', label: '已签合同', color: 'success', icon: 'bi-file-earmark-check' },
  { key: 'production', label: '生产中', color: 'dark', icon: 'bi-gear' },
  { key: 'delivered', label: '已交付', color: 'secondary', icon: 'bi-truck' },
  { key: 'lost', label: '丢单', color: 'danger', icon: 'bi-x-circle' },
];

const SAMPLE_PROJECTS = [
  { id: 'PJ2026-088', name: '浙嵊渔冷05688配套', customer: '浙江嵊泗渔业', gearbox: 'HCD400A', status: 'production', amount: 185000, date: '2026-03-01', salesman: '张工' },
  { id: 'PJ2026-092', name: '粤珠海拖0236配套', customer: '珠海拖轮公司', gearbox: 'HCD800', status: 'contracted', amount: 420000, date: '2026-03-08', salesman: '李工' },
  { id: 'PJ2026-095', name: '闽霞渔运09166配套', customer: '福建霞浦航运', gearbox: 'HC300', status: 'quoting', amount: 96000, date: '2026-03-12', salesman: '王工' },
  { id: 'PJ2026-098', name: '长航集02068配套', customer: '长江航运集团', gearbox: 'HCD600A', status: 'negotiating', amount: 280000, date: '2026-03-15', salesman: '张工' },
  { id: 'PJ2026-101', name: '琼海渔12088配套', customer: '海南琼海渔业', gearbox: 'HC200', status: 'inquiry', amount: 65000, date: '2026-03-18', salesman: '陈工' },
  { id: 'PJ2026-103', name: '鲁威海港拖5号配套', customer: '威海港务局', gearbox: 'GWC52.59', status: 'quoting', amount: 580000, date: '2026-03-20', salesman: '李工' },
];

export default function ProjectTracker({ colors, theme }) {
  const [projects] = useState(SAMPLE_PROJECTS);
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return projects.filter(p => {
      if (statusFilter !== 'all' && p.status !== statusFilter) return false;
      if (search) {
        const q = search.toUpperCase();
        return p.id.toUpperCase().includes(q) || p.name.includes(search) || p.customer.includes(search) || p.gearbox.toUpperCase().includes(q);
      }
      return true;
    });
  }, [projects, statusFilter, search]);

  const statusCounts = useMemo(() => {
    const counts = {};
    projects.forEach(p => { counts[p.status] = (counts[p.status] || 0) + 1; });
    return counts;
  }, [projects]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-kanban me-2"></i>项目追踪</h5></Col>
      </Row>

      <Row className="mb-3">
        {STATUSES.filter(s => s.key !== 'lost').map(s => (
          <Col key={s.key}>
            <Card className={`text-center ${statusFilter === s.key ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setStatusFilter(statusFilter === s.key ? 'all' : s.key)}>
              <Card.Body className="py-2">
                <h4 className="mb-0"><Badge bg={s.color}>{statusCounts[s.key] || 0}</Badge></h4>
                <small>{s.label}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mb-3">
        <Card.Body className="py-2">
          <Row>
            <Col md={4}>
              <InputGroup size="sm">
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                <Form.Control placeholder="搜索项目/客户/型号..." value={search} onChange={e => setSearch(e.target.value)} />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select size="sm" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                <option value="all">全部状态</option>
                {STATUSES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
              </Form.Select>
            </Col>
            <Col md={5} className="text-end">
              <Badge bg="info" className="py-2 px-3">{filtered.length} / {projects.length} 个项目</Badge>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr><th>项目编号</th><th>项目名称</th><th>客户</th><th>齿轮箱</th><th>金额(元)</th><th>状态</th><th>日期</th><th>负责人</th></tr>
            </thead>
            <tbody>
              {filtered.map(p => {
                const s = STATUSES.find(st => st.key === p.status);
                return (
                  <tr key={p.id}>
                    <td><strong>{p.id}</strong></td>
                    <td>{p.name}</td>
                    <td>{p.customer}</td>
                    <td><Badge bg="primary">{p.gearbox}</Badge></td>
                    <td className="text-end">¥{p.amount.toLocaleString()}</td>
                    <td><Badge bg={s?.color || 'secondary'}><i className={`bi ${s?.icon} me-1`}></i>{s?.label}</Badge></td>
                    <td className="small">{p.date}</td>
                    <td>{p.salesman}</td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
}
