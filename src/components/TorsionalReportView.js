// src/components/TorsionalReportView.js
// 扭振计算书生成与管理
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup, ProgressBar } from 'react-bootstrap';

const REPORT_TEMPLATES = [
  { id: 'standard', name: '标准扭振计算书', desc: 'CCS/DNV标准格式，含轴系自由振动+强迫振动分析', pages: '~35页' },
  { id: 'simplified', name: '简化计算书', desc: '单频激励快速评估，适用于常规项目', pages: '~15页' },
  { id: 'detailed', name: '详细分析报告', desc: '含多阶模态分析、阻尼器选型建议', pages: '~50页' },
];

const RECENT_REPORTS = [
  { id: 1, project: '浙嵊渔冷05688', engine: 'CAT C18 @ 1800rpm', gearbox: 'HCD400A i=4.06', date: '2026-03-18', status: '已完成' },
  { id: 2, project: '闽霞渔运09166', engine: 'Cummins KTA19 @ 1800rpm', gearbox: 'HC300 i=3.04', date: '2026-03-15', status: '已完成' },
  { id: 3, project: '粤珠海拖0236', engine: 'CAT C32 @ 1800rpm', gearbox: 'HCD800 i=4.04', date: '2026-03-12', status: '审核中' },
  { id: 4, project: '长航集02068', engine: 'Cummins KTA38 @ 1800rpm', gearbox: 'HCD600A i=4.10', date: '2026-03-10', status: '已完成' },
];

export default function TorsionalReportView({ colors, theme }) {
  const [selectedTemplate, setSelectedTemplate] = useState('standard');
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const handleGenerate = useCallback(() => {
    setGenerating(true);
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timerRef.current); timerRef.current = null; setGenerating(false); return 100; }
        return prev + 5;
      });
    }, 200);
  }, []);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-file-earmark-pdf me-2"></i>扭振计算书</h5>
          <small className="text-muted">自动生成标准格式扭振计算书，支持CCS/DNV/LR等船级社规范</small>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Header>报告模板</Card.Header>
            <ListGroup variant="flush">
              {REPORT_TEMPLATES.map(t => (
                <ListGroup.Item key={t.id} action active={selectedTemplate === t.id} onClick={() => setSelectedTemplate(t.id)}>
                  <div className="d-flex justify-content-between">
                    <strong>{t.name}</strong>
                    <Badge bg="light" text="dark">{t.pages}</Badge>
                  </div>
                  <small>{t.desc}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>

          <Card className="mb-3">
            <Card.Header>生成参数</Card.Header>
            <Card.Body>
              <Form.Group className="mb-2">
                <Form.Label className="small">项目/船名</Form.Label>
                <Form.Control size="sm" placeholder="输入项目或船名" />
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">船级社</Form.Label>
                <Form.Select size="sm">
                  <option>CCS 中国船级社</option>
                  <option>DNV</option>
                  <option>LR 劳氏</option>
                  <option>ABS</option>
                  <option>BV 法国船级社</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-2">
                <Form.Label className="small">语言</Form.Label>
                <Form.Select size="sm">
                  <option>中文</option>
                  <option>英文</option>
                  <option>中英双语</option>
                </Form.Select>
              </Form.Group>
              {generating ? (
                <ProgressBar now={progress} label={`${progress}%`} animated striped className="mt-2" />
              ) : (
                <Button variant="primary" className="w-100 mt-2" onClick={handleGenerate}>
                  <i className="bi bi-file-earmark-pdf me-1"></i>生成计算书
                </Button>
              )}
              {progress >= 100 && (
                <Alert variant="success" className="mt-2 mb-0 py-1 small">
                  <i className="bi bi-check-circle me-1"></i>计算书已生成！
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={8}>
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>历史计算书</span>
              <Badge bg="info">{RECENT_REPORTS.length} 份</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover size="sm" className="mb-0">
                <thead><tr><th>项目</th><th>主机</th><th>齿轮箱</th><th>日期</th><th>状态</th><th>操作</th></tr></thead>
                <tbody>
                  {RECENT_REPORTS.map(r => (
                    <tr key={r.id}>
                      <td><strong>{r.project}</strong></td>
                      <td className="small">{r.engine}</td>
                      <td><Badge bg="primary">{r.gearbox}</Badge></td>
                      <td className="small">{r.date}</td>
                      <td><Badge bg={r.status === '已完成' ? 'success' : 'warning'}>{r.status}</Badge></td>
                      <td>
                        <Button size="sm" variant="outline-primary" className="me-1"><i className="bi bi-download"></i></Button>
                        <Button size="sm" variant="outline-secondary"><i className="bi bi-eye"></i></Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
