// P1-4: 文档版本历史抽屉 — 列出某文档所有版本,支持查看快照与字段 diff
import React, { useMemo, useState } from 'react';
import { Modal, Button, ListGroup, Badge, Form, Row, Col, Alert, Table } from 'react-bootstrap';
import { listVersions, diffSnapshots, getVersion } from '../../services/documentVersionStore';

const TYPE_NAMES = {
  inquiry: '技术询单',
  quotation: '报价单',
  agreement: '技术协议',
  contract: '销售合同',
};

const VersionHistoryDrawer = ({ show, onHide, type, docId, currentSnapshot, onSaveVersion, onRollback }) => {
  const [comment, setComment] = useState('');
  const [author, setAuthor] = useState('');
  const [activeVersionId, setActiveVersionId] = useState(null);

  const versions = useMemo(() => {
    if (!show || !type || !docId) return [];
    return listVersions(type, docId);
  }, [show, type, docId]);

  const activeVersion = useMemo(() => {
    if (!activeVersionId) return null;
    return getVersion(activeVersionId);
  }, [activeVersionId]);

  const diffWithCurrent = useMemo(() => {
    if (!activeVersion || !currentSnapshot) return [];
    return diffSnapshots(activeVersion.snapshot, currentSnapshot);
  }, [activeVersion, currentSnapshot]);

  const handleSave = () => {
    if (!onSaveVersion) return;
    onSaveVersion({ comment: comment.trim() || `第 ${versions.length + 1} 版`, author: author.trim() });
    setComment('');
  };

  const handleRollback = () => {
    if (!activeVersion || !onRollback) return;
    if (!window.confirm(`确定将 ${docId} 回滚到 v${activeVersion.version} (${new Date(activeVersion.savedAt).toLocaleString('zh-CN')})？\n当前内容会被覆盖,但旧版本仍保留在历史中。`)) return;
    onRollback(activeVersion.snapshot);
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title style={{ fontSize: '1.05rem' }}>
          <i className="bi bi-clock-history me-2"></i>
          {TYPE_NAMES[type] || type} 版本历史
          {docId && <small className="ms-2 text-muted" style={{ fontFamily: 'monospace', fontSize: '0.75em' }}>{docId}</small>}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* 保存新版本入口 */}
        {currentSnapshot && (
          <div className="mb-3 p-2 border rounded">
            <div className="fw-bold mb-2" style={{ fontSize: '0.85em' }}>
              <i className="bi bi-bookmark-plus me-1"></i>保存新版本
            </div>
            <Row className="g-2">
              <Col md={5}><Form.Control size="sm" placeholder="修订说明 (如: 修正交货日期)" value={comment} onChange={e => setComment(e.target.value)} /></Col>
              <Col md={4}><Form.Control size="sm" placeholder="修订人 (可选)" value={author} onChange={e => setAuthor(e.target.value)} /></Col>
              <Col md={3}>
                <Button size="sm" variant="primary" className="w-100" onClick={handleSave} disabled={!type || !docId}>
                  <i className="bi bi-save me-1"></i>另存为新版本
                </Button>
              </Col>
            </Row>
          </div>
        )}

        {/* 版本列表 */}
        {versions.length === 0 ? (
          <Alert variant="light" className="text-center py-3 mb-0">
            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '2rem' }}></i>
            该文档暂无历史版本。点击"另存为新版本"创建第一份快照。
          </Alert>
        ) : (
          <Row>
            <Col md={5}>
              <div className="fw-bold mb-2" style={{ fontSize: '0.85em' }}>
                历史版本 <Badge bg="secondary">{versions.length}</Badge>
              </div>
              <ListGroup style={{ maxHeight: 300, overflowY: 'auto' }}>
                {versions.map(v => (
                  <ListGroup.Item
                    key={v.versionId}
                    action
                    active={v.versionId === activeVersionId}
                    onClick={() => setActiveVersionId(v.versionId)}
                    style={{ fontSize: '0.85em' }}
                  >
                    <div className="d-flex justify-content-between">
                      <strong>v{v.version}</strong>
                      <small>{new Date(v.savedAt).toLocaleDateString('zh-CN')}</small>
                    </div>
                    <div className="text-truncate text-muted" style={{ fontSize: '0.9em' }}>
                      {v.comment || '(无说明)'}
                    </div>
                    {v.author && <small className="text-muted">by {v.author}</small>}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>

            <Col md={7}>
              <div className="fw-bold mb-2" style={{ fontSize: '0.85em' }}>
                与当前差异
              </div>
              {!activeVersion ? (
                <div className="text-muted text-center py-3" style={{ fontSize: '0.85em' }}>选择左侧版本查看差异</div>
              ) : diffWithCurrent.length === 0 ? (
                <Alert variant="success" className="py-2 small">
                  <i className="bi bi-check-circle me-1"></i>该版本内容与当前完全一致
                </Alert>
              ) : (
                <Table size="sm" striped className="mb-0" style={{ fontSize: '0.78em' }}>
                  <thead>
                    <tr><th>字段</th><th>历史值</th><th>当前值</th></tr>
                  </thead>
                  <tbody>
                    {diffWithCurrent.slice(0, 30).map((c, i) => (
                      <tr key={i}>
                        <td><code>{c.field}</code></td>
                        <td className="text-muted" style={{ maxWidth: 140, wordBreak: 'break-all' }}>{JSON.stringify(c.prev)?.slice(0, 80)}</td>
                        <td style={{ maxWidth: 140, wordBreak: 'break-all' }}>{JSON.stringify(c.curr)?.slice(0, 80)}</td>
                      </tr>
                    ))}
                    {diffWithCurrent.length > 30 && (
                      <tr><td colSpan={3} className="text-muted text-center">...另有 {diffWithCurrent.length - 30} 项变更未显示</td></tr>
                    )}
                  </tbody>
                </Table>
              )}
              {activeVersion && onRollback && (
                <Button size="sm" variant="outline-warning" className="mt-2 w-100" onClick={handleRollback}>
                  <i className="bi bi-arrow-counterclockwise me-1"></i>回滚到 v{activeVersion.version}
                </Button>
              )}
            </Col>
          </Row>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" size="sm" onClick={onHide}>关闭</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default VersionHistoryDrawer;
