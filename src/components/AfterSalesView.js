// src/components/AfterSalesView.js
// 售后服务 - 齿轮箱售后工单与维保管理
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup, InputGroup } from 'react-bootstrap';

const SERVICE_TYPES = [
  { key: 'repair', label: '维修', color: 'danger', icon: 'bi-wrench' },
  { key: 'maintenance', label: '保养', color: 'info', icon: 'bi-droplet' },
  { key: 'inspection', label: '检测', color: 'warning', icon: 'bi-search' },
  { key: 'spare', label: '备件供应', color: 'primary', icon: 'bi-box-seam' },
  { key: 'technical', label: '技术支持', color: 'success', icon: 'bi-headset' },
  { key: 'complaint', label: '投诉处理', color: 'dark', icon: 'bi-exclamation-triangle' },
];

const SAMPLE_TICKETS = [
  { id: 'AS2026-031', customer: '浙江嵊泗渔业', gearbox: 'HCD400A', sn: 'HCD400A-20250188', type: 'repair', desc: '齿轮箱异常噪声', status: 'processing', date: '2026-03-18', engineer: '赵工' },
  { id: 'AS2026-028', customer: '长江航运集团', gearbox: 'HCD600A', sn: 'HCD600A-20241055', type: 'maintenance', desc: '首次5000小时保养', status: 'completed', date: '2026-03-10', engineer: '钱工' },
  { id: 'AS2026-025', customer: '珠海拖轮公司', gearbox: 'HCD800', sn: 'HCD800-20250032', type: 'spare', desc: '更换主轴承及密封件', status: 'waiting', date: '2026-03-05', engineer: '孙工' },
  { id: 'AS2026-022', customer: '海南琼海渔业', gearbox: 'HC200', sn: 'HC200-20240866', type: 'technical', desc: '调试减速比切换问题', status: 'completed', date: '2026-02-28', engineer: '赵工' },
  { id: 'AS2026-019', customer: '福建霞浦航运', gearbox: 'HC300', sn: 'HC300-20250105', type: 'inspection', desc: '船级社年检配合', status: 'processing', date: '2026-02-20', engineer: '钱工' },
];

const STATUS_MAP = {
  processing: { label: '处理中', color: 'warning' },
  completed: { label: '已完成', color: 'success' },
  waiting: { label: '等待配件', color: 'info' },
  pending: { label: '待分配', color: 'secondary' },
};

export default function AfterSalesView({ colors, theme }) {
  const [tickets] = useState(SAMPLE_TICKETS);
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return tickets.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (search) {
        const q = search.toUpperCase();
        return t.id.toUpperCase().includes(q) || t.customer.includes(search) || t.gearbox.toUpperCase().includes(q) || t.desc.includes(search);
      }
      return true;
    });
  }, [tickets, typeFilter, search]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-wrench-adjustable me-2"></i>售后服务</h5>
          <small className="text-muted">齿轮箱售后工单管理、维保记录追踪</small>
        </Col>
        <Col xs="auto"><Button variant="primary" size="sm"><i className="bi bi-plus me-1"></i>新建工单</Button></Col>
      </Row>

      <Row className="mb-3">
        {SERVICE_TYPES.map(s => (
          <Col key={s.key} xs={4} md={2}>
            <Card className={`text-center mb-2 ${typeFilter === s.key ? 'border-primary' : ''}`} style={{ cursor: 'pointer' }} onClick={() => setTypeFilter(typeFilter === s.key ? 'all' : s.key)}>
              <Card.Body className="py-2 px-1">
                <i className={`bi ${s.icon} fs-4 text-${s.color}`}></i>
                <div className="small mt-1">{s.label}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="mb-3">
        <Card.Body className="py-2">
          <InputGroup size="sm">
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="搜索工单号/客户/型号..." value={search} onChange={e => setSearch(e.target.value)} />
          </InputGroup>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body className="p-0">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr><th>工单号</th><th>客户</th><th>齿轮箱</th><th>类型</th><th>描述</th><th>状态</th><th>日期</th><th>工程师</th></tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const sType = SERVICE_TYPES.find(s => s.key === t.type);
                const sStatus = STATUS_MAP[t.status];
                return (
                  <tr key={t.id}>
                    <td><strong>{t.id}</strong></td>
                    <td>{t.customer}</td>
                    <td><Badge bg="primary">{t.gearbox}</Badge><br /><small className="text-muted">{t.sn}</small></td>
                    <td><Badge bg={sType?.color}><i className={`bi ${sType?.icon} me-1`}></i>{sType?.label}</Badge></td>
                    <td className="small">{t.desc}</td>
                    <td><Badge bg={sStatus?.color}>{sStatus?.label}</Badge></td>
                    <td className="small">{t.date}</td>
                    <td>{t.engineer}</td>
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
