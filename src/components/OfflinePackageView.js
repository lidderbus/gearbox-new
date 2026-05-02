// src/components/OfflinePackageView.js
// P1-5 重写: 支持"按项目"维度真实打包,沿用"按型号"模拟模板
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Badge, Button, Alert, ListGroup, ProgressBar, Tab, Tabs } from 'react-bootstrap';
import { packProject, listPackageableProjects } from '../utils/projectPackager';
import { useProject } from '../contexts/ProjectContext';

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
  const [tab, setTab] = useState('project'); // P1-5: 默认进入项目维度

  // === 按型号 (旧 UI 模拟) ===
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedDocs, setSelectedDocs] = useState(new Set(['datasheet', 'drawing']));
  const [packagingModel, setPackagingModel] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!packagingModel) return;
    const t = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(t); setPackagingModel(false); return 100; }
        return prev + 10;
      });
    }, 300);
    return () => clearInterval(t);
  }, [packagingModel]);

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

  const handleModelPackage = useCallback(() => {
    setPackagingModel(true);
    setProgress(0);
  }, []);

  // === 按项目 (P1-5 真实打包) ===
  const { currentProjectId, currentProjectName } = useProject();
  const [chosenProjectId, setChosenProjectId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);
  const [packagingProject, setPackagingProject] = useState(false);
  const [packageResult, setPackageResult] = useState(null);
  const [packageError, setPackageError] = useState(null);
  const [includeJson, setIncludeJson] = useState(true);
  const [includeManifest, setIncludeManifest] = useState(true);

  const projects = useMemo(() => {
    void refreshKey;
    return listPackageableProjects();
  }, [refreshKey]);

  // 默认锁定当前项目
  useEffect(() => {
    if (currentProjectId && !chosenProjectId) setChosenProjectId(currentProjectId);
  }, [currentProjectId, chosenProjectId]);

  const chosen = useMemo(() => projects.find(p => p.projectId === chosenProjectId), [projects, chosenProjectId]);

  const handleProjectPackage = useCallback(async () => {
    if (!chosenProjectId) { setPackageError('请先选择项目'); return; }
    setPackagingProject(true);
    setPackageError(null);
    setPackageResult(null);
    try {
      const result = await packProject(chosenProjectId, {
        projectName: chosen?.projectName || currentProjectName || '',
        includeJson,
        includeManifest,
      });
      setPackageResult(result);
    } catch (e) {
      setPackageError(e.message || String(e));
    } finally {
      setPackagingProject(false);
      setRefreshKey(k => k + 1);
    }
  }, [chosenProjectId, chosen, currentProjectName, includeJson, includeManifest]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h5><i className="bi bi-file-zip me-2"></i>资料打包</h5>
          <small className="text-muted">按项目(P1-5 真实落地) 或按型号 一键打包资料</small>
        </Col>
      </Row>

      <Tabs activeKey={tab} onSelect={(k) => setTab(k)} className="mb-3">
        <Tab eventKey="project" title={<span><i className="bi bi-folder me-1"></i>按项目 (推荐)</span>}>
          <Row>
            <Col md={5}>
              <Card className="mb-3">
                <Card.Header>选择项目</Card.Header>
                <Card.Body>
                  {currentProjectId && (
                    <Alert variant="info" className="py-2 mb-2" style={{ fontSize: '0.85em' }}>
                      <i className="bi bi-bookmark-check me-2"></i>
                      当前项目: <strong>{currentProjectId}</strong>
                      {currentProjectName && <span className="ms-1 text-muted">{currentProjectName}</span>}
                    </Alert>
                  )}
                  <Form.Select
                    value={chosenProjectId}
                    onChange={e => setChosenProjectId(e.target.value)}
                  >
                    <option value="">— 选择项目 —</option>
                    {projects.map(p => (
                      <option key={p.projectId} value={p.projectId}>
                        {p.projectId} {p.projectName !== p.projectId ? `· ${p.projectName}` : ''} ({p.total})
                      </option>
                    ))}
                  </Form.Select>
                  <small className="text-muted mt-1 d-block">
                    共 {projects.length} 个可打包项目 (含至少 1 份文档)
                  </small>
                </Card.Body>
              </Card>

              <Card className="mb-3">
                <Card.Header>打包选项</Card.Header>
                <Card.Body>
                  <Form.Check type="switch" id="opt-json" label="包含 project.json (完整 JSON 备份, 可重新导入)" checked={includeJson} onChange={e => setIncludeJson(e.target.checked)} />
                  <Form.Check type="switch" id="opt-manifest" label="包含 manifest.txt (说明文档)" checked={includeManifest} onChange={e => setIncludeManifest(e.target.checked)} />
                </Card.Body>
              </Card>
            </Col>

            <Col md={4}>
              <Card className="mb-3">
                <Card.Header>项目内容预览</Card.Header>
                <Card.Body>
                  {chosen ? (
                    <>
                      <div className="mb-2"><strong>{chosen.projectName}</strong></div>
                      <div className="text-muted mb-3" style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>{chosen.projectId}</div>
                      <ListGroup variant="flush">
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span><i className="bi bi-file-earmark-text me-2"></i>技术询单</span>
                          <Badge bg="secondary">{chosen.counts.inquiry}</Badge>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span><i className="bi bi-currency-yen me-2"></i>报价单</span>
                          <Badge bg="secondary">{chosen.counts.quotation}</Badge>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span><i className="bi bi-file-earmark-check me-2"></i>技术协议</span>
                          <Badge bg="secondary">{chosen.counts.agreement}</Badge>
                        </ListGroup.Item>
                        <ListGroup.Item className="d-flex justify-content-between px-0">
                          <span><i className="bi bi-file-earmark-ruled me-2"></i>销售合同</span>
                          <Badge bg="secondary">{chosen.counts.contract}</Badge>
                        </ListGroup.Item>
                      </ListGroup>
                      <small className="text-muted mt-2 d-block">
                        最近活动: {chosen.latestDate ? new Date(chosen.latestDate).toLocaleString('zh-CN') : '-'}
                      </small>
                    </>
                  ) : (
                    <div className="text-muted text-center py-3">请先选择项目</div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            <Col md={3}>
              <Card className="mb-3">
                <Card.Header>打包</Card.Header>
                <Card.Body>
                  <Button
                    variant="primary"
                    className="w-100"
                    onClick={handleProjectPackage}
                    disabled={!chosenProjectId || packagingProject}
                  >
                    {packagingProject ? (
                      <span><i className="bi bi-hourglass-split me-1"></i>打包中…</span>
                    ) : (
                      <span><i className="bi bi-download me-1"></i>生成 ZIP</span>
                    )}
                  </Button>
                  {packageError && (
                    <Alert variant="danger" className="mt-2 mb-0 py-1 small">
                      <i className="bi bi-exclamation-triangle me-1"></i>{packageError}
                    </Alert>
                  )}
                  {packageResult && (
                    <Alert variant="success" className="mt-2 mb-0 py-1 small">
                      <i className="bi bi-check-circle me-1"></i>
                      {packageResult.filename}<br/>
                      <span className="text-muted">{(packageResult.sizeBytes / 1024).toFixed(1)} KB · {Object.values(packageResult.docCounts).reduce((a,b) => a+b, 0)} 份文档</span>
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="model" title={<span><i className="bi bi-tag me-1"></i>按型号 (UI 演示)</span>}>
          <Alert variant="warning" className="py-2 small">
            <i className="bi bi-info-circle me-2"></i>
            按型号打包当前为 UI 演示,实际从原厂资料服务器获取 PDF/DWG 的能力将在 P2 落地。
          </Alert>
          <Row>
            <Col md={4}>
              <Card className="mb-3">
                <Card.Header>选择型号</Card.Header>
                <Card.Body>
                  <Form.Control type="text" placeholder="输入齿轮箱型号,如 HC300, GWC38.42..." value={selectedModel} onChange={e => setSelectedModel(e.target.value)} />
                  <small className="text-muted mt-1 d-block">支持输入多个型号,用逗号分隔</small>
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
                  {packagingModel ? (
                    <ProgressBar now={progress} label={`${progress}%`} animated striped />
                  ) : (
                    <Button variant="outline-primary" className="w-100" onClick={handleModelPackage} disabled={!selectedModel || selectedDocs.size === 0}>
                      <i className="bi bi-download me-1"></i>模拟打包
                    </Button>
                  )}
                  {progress >= 100 && (
                    <Alert variant="success" className="mt-2 mb-0 py-1 small">
                      <i className="bi bi-check-circle me-1"></i>模拟打包完成。
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
}
