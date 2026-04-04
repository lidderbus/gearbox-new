// src/components/OfflinePackageView.js
// 离线资料包 - 按型号/系列打包下载选型资料
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup, ProgressBar } from 'react-bootstrap';

const DOCUMENT_TYPES = [
  { key: 'datasheet', label: '技术参数表', icon: 'bi-file-earmark-text', ext: 'PDF' },
  { key: 'drawing', label: '外形图', icon: 'bi-image', ext: 'PDF/DWG' },
  { key: 'manual', label: '使用说明书', icon: 'bi-book', ext: 'PDF' },
  { key: 'certificate', label: '船级社证书', icon: 'bi-patch-check', ext: 'PDF' },
  { key: 'quotation', label: '报价单', icon: 'bi-receipt', ext: 'PDF' },
  { key: 'agreement', label: '技术协议', icon: 'bi-file-earmark-ruled', ext: 'DOCX' },
  { key: 'torsional', label: '扭振计算书', icon: 'bi-graph-up', ext: 'PDF' },
];

const PACKAGE_PRESETS = [
  { name: '询价资料包', desc: '技术参数 + 外形图 + 报价单', docs: ['datasheet', 'drawing', 'quotation'] },
  { name: '技术评审包', desc: '全部技术文档 + 扭振计算书', docs: ['datasheet', 'drawing', 'manual', 'torsional'] },
  { name: '船检资料包', desc: '技术参数 + 证书 + 技术协议', docs: ['datasheet', 'certificate', 'agreement'] },
  { name: '完整资料包', desc: '所有文档', docs: DOCUMENT_TYPES.map(d => d.key) },
];

export default function OfflinePackageView({ colors, theme }) {
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedDocs, setSelectedDocs] = useState(new Set(['datasheet', 'drawing']));
  const [packaging, setPackaging] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const toggleDoc = useCallback((key) => {
    setSelectedDocs(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const applyPreset = useCallback((preset) => {
    setSelectedDocs(new Set(preset.docs));
  }, []);

  const handlePackage = useCallback(() => {
    setPackaging(true);
    setProgress(0);
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(timerRef.current); timerRef.current = null; setPackaging(false); return 100; }
        return prev + 10;
      });
    }, 300);
  }, []);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-file-zip me-2"></i>离线资料打包</h5>
          <small className="text-muted">按需选择文档类型，一键打包下载齿轮箱资料</small>
        </Col>
      </Row>

      <Row>
        <Col md={4}>
          <Card className="mb-3">
            <Card.Header>选择型号</Card.Header>
            <Card.Body>
              <Form.Control type="text" placeholder="输入齿轮箱型号，如 HC300, GWC38.42..." value={selectedModel} onChange={e => setSelectedModel(e.target.value)} />
              <small className="text-muted mt-1 d-block">支持输入多个型号，用逗号分隔</small>
            </Card.Body>
          </Card>

          <Card className="mb-3">
            <Card.Header>快捷模板</Card.Header>
            <ListGroup variant="flush">
              {PACKAGE_PRESETS.map(p => (
                <ListGroup.Item key={p.name} action onClick={() => applyPreset(p)}>
                  <strong>{p.name}</strong><br />
                  <small className="text-muted">{p.desc}</small>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="mb-3">
            <Card.Header>文档类型选择</Card.Header>
            <Card.Body>
              {DOCUMENT_TYPES.map(d => (
                <Form.Check key={d.key} type="checkbox" className="py-1" id={`doc-${d.key}`} label={
                  <span><i className={`bi ${d.icon} me-2`}></i>{d.label} <Badge bg="light" text="dark">{d.ext}</Badge></span>
                } checked={selectedDocs.has(d.key)} onChange={() => toggleDoc(d.key)} />
              ))}
            </Card.Body>
          </Card>
        </Col>

        <Col md={3}>
          <Card className="mb-3">
            <Card.Header>打包信息</Card.Header>
            <Card.Body>
              <div className="mb-2"><strong>型号:</strong> {selectedModel || '未选择'}</div>
              <div className="mb-2"><strong>文档数:</strong> {selectedDocs.size} 种</div>
              <div className="mb-3"><strong>预估大小:</strong> ~{selectedDocs.size * 2}MB</div>
              {packaging ? (
                <ProgressBar now={progress} label={`${progress}%`} animated striped />
              ) : (
                <Button variant="primary" className="w-100" onClick={handlePackage} disabled={!selectedModel || selectedDocs.size === 0}>
                  <i className="bi bi-download me-1"></i>打包下载
                </Button>
              )}
              {progress >= 100 && (
                <Alert variant="success" className="mt-2 mb-0 py-1 small">
                  <i className="bi bi-check-circle me-1"></i>打包完成！资料包已准备好下载。
                </Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
