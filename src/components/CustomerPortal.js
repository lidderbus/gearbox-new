// src/components/CustomerPortal.js
// 客户询价门户 - 客户自助询价与订单查询
import React, { useState, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup, InputGroup } from 'react-bootstrap';

const INQUIRY_STATUSES = [
  { key: 'new', label: '新询价', color: 'info' },
  { key: 'processing', label: '报价中', color: 'warning' },
  { key: 'quoted', label: '已报价', color: 'success' },
  { key: 'expired', label: '已过期', color: 'secondary' },
];

const SAMPLE_INQUIRIES = [
  { id: 'INQ2026-156', customer: '浙江嵊泗渔业', contact: '周经理', phone: '138****5566', gearbox: 'HCD400A', power: '450kW', speed: '1800rpm', application: '渔船', status: 'quoted', date: '2026-03-18' },
  { id: 'INQ2026-158', customer: '威海港务局', contact: '刘主任', phone: '139****7788', gearbox: 'GWC52.59', power: '1200kW', speed: '1000rpm', application: '拖轮', status: 'processing', date: '2026-03-19' },
  { id: 'INQ2026-160', customer: '海南琼海渔业', contact: '吴船长', phone: '136****2233', gearbox: '待推荐', power: '220kW', speed: '1500rpm', application: '渔船', status: 'new', date: '2026-03-20' },
  { id: 'INQ2026-162', customer: '广州远洋运输', contact: '陈总工', phone: '137****4455', gearbox: 'HC600', power: '735kW', speed: '1000rpm', application: '散货船', status: 'new', date: '2026-03-21' },
];

export default function CustomerPortal({ colors, theme }) {
  const [inquiries] = useState(SAMPLE_INQUIRIES);
  const [showForm, setShowForm] = useState(false);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-person-badge me-2"></i>客户询价门户</h5>
          <small className="text-muted">客户自助提交询价、查询报价进度</small>
        </Col>
        <Col xs="auto">
          <Button variant="primary" size="sm" onClick={() => setShowForm(!showForm)}>
            <i className="bi bi-plus me-1"></i>{showForm ? '收起' : '新建询价'}
          </Button>
        </Col>
      </Row>

      {showForm && (
        <Card className="mb-3 border-primary">
          <Card.Header className="bg-primary text-white">新建询价单</Card.Header>
          <Card.Body>
            <Row>
              <Col md={3}><Form.Group className="mb-2"><Form.Label className="small">单位名称</Form.Label><Form.Control size="sm" placeholder="公司/船东名称" /></Form.Group></Col>
              <Col md={2}><Form.Group className="mb-2"><Form.Label className="small">联系人</Form.Label><Form.Control size="sm" placeholder="姓名" /></Form.Group></Col>
              <Col md={2}><Form.Group className="mb-2"><Form.Label className="small">电话</Form.Label><Form.Control size="sm" placeholder="手机号" /></Form.Group></Col>
              <Col md={2}><Form.Group className="mb-2"><Form.Label className="small">主机功率(kW)</Form.Label><Form.Control size="sm" type="number" placeholder="kW" /></Form.Group></Col>
              <Col md={2}><Form.Group className="mb-2"><Form.Label className="small">转速(rpm)</Form.Label><Form.Control size="sm" type="number" placeholder="rpm" /></Form.Group></Col>
              <Col md={1} className="d-flex align-items-end mb-2"><Button variant="success" size="sm" className="w-100">提交</Button></Col>
            </Row>
            <Row>
              <Col md={3}><Form.Group className="mb-2"><Form.Label className="small">用途/船型</Form.Label><Form.Select size="sm"><option>渔船</option><option>货船</option><option>拖轮</option><option>客船</option><option>工作船</option><option>其他</option></Form.Select></Form.Group></Col>
              <Col md={3}><Form.Group className="mb-2"><Form.Label className="small">意向型号（如已知）</Form.Label><Form.Control size="sm" placeholder="型号，如HC300" /></Form.Group></Col>
              <Col md={6}><Form.Group className="mb-2"><Form.Label className="small">备注</Form.Label><Form.Control size="sm" placeholder="其他技术要求或说明" /></Form.Group></Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Row className="mb-3">
        {INQUIRY_STATUSES.map(s => {
          const count = inquiries.filter(i => i.status === s.key).length;
          return (
            <Col key={s.key} md={3}>
              <Card className="text-center">
                <Card.Body className="py-2">
                  <h4><Badge bg={s.color}>{count}</Badge></h4>
                  <small>{s.label}</small>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      <Card>
        <Card.Header>询价记录</Card.Header>
        <Card.Body className="p-0">
          <Table hover className="mb-0">
            <thead className="bg-light">
              <tr><th>询价编号</th><th>客户</th><th>联系人</th><th>型号/功率</th><th>用途</th><th>状态</th><th>日期</th><th>操作</th></tr>
            </thead>
            <tbody>
              {inquiries.map(inq => {
                const s = INQUIRY_STATUSES.find(st => st.key === inq.status);
                return (
                  <tr key={inq.id}>
                    <td><strong>{inq.id}</strong></td>
                    <td>{inq.customer}</td>
                    <td>{inq.contact}<br /><small className="text-muted">{inq.phone}</small></td>
                    <td><Badge bg="primary">{inq.gearbox}</Badge><br /><small>{inq.power} / {inq.speed}</small></td>
                    <td>{inq.application}</td>
                    <td><Badge bg={s?.color}>{s?.label}</Badge></td>
                    <td className="small">{inq.date}</td>
                    <td>
                      <Button size="sm" variant="outline-primary" className="me-1"><i className="bi bi-eye"></i></Button>
                      <Button size="sm" variant="outline-success"><i className="bi bi-reply"></i></Button>
                    </td>
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
