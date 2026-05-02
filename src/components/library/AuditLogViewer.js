// P3-3: 审计日志查看器 — 统一展示资料库下载/浏览/拒绝/水印事件
import React, { useState, useMemo, useCallback } from 'react';
import { Card, Row, Col, Form, Badge, Button, Table, Alert } from 'react-bootstrap';
import { listAudit, exportAuditCSV, clearAudit, auditStats, AUDIT_EVENTS } from '../../services/auditLog';

const AuditLogViewer = ({ title = '资料库审计日志', badge = 'P3-3', eventFilter = null }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filterEvent, setFilterEvent] = useState('');
  const [filterUser, setFilterUser] = useState('');
  const [filterResource, setFilterResource] = useState('');
  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const visibleEvents = useMemo(() => {
    if (!eventFilter || eventFilter.length === 0) return AUDIT_EVENTS;
    const filtered = {};
    eventFilter.forEach(k => { if (AUDIT_EVENTS[k]) filtered[k] = AUDIT_EVENTS[k]; });
    return filtered;
  }, [eventFilter]);

  const entries = useMemo(() => {
    void refreshKey;
    let all = listAudit({
      event: filterEvent || null,
      userId: filterUser || null,
      resourceId: filterResource || null,
    });
    if (eventFilter && eventFilter.length > 0) {
      const allowed = new Set(eventFilter);
      all = all.filter(e => allowed.has(e.event));
    }
    return all;
  }, [refreshKey, filterEvent, filterUser, filterResource, eventFilter]);

  const stats = useMemo(() => {
    void refreshKey;
    return auditStats();
  }, [refreshKey]);

  const handleExport = () => {
    const csv = exportAuditCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  const handleClear = () => {
    if (!window.confirm(`确认清空全部 ${stats.total} 条审计日志？此操作不可撤销。`)) return;
    clearAudit();
    refresh();
  };

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <strong><i className="bi bi-shield-check me-2"></i>{title}</strong>
          {badge && <Badge bg="primary" className="ms-2">{badge}</Badge>}
        </div>
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-success" onClick={handleExport} disabled={stats.total === 0}>
            <i className="bi bi-download me-1"></i>导出 CSV
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={refresh}>
            <i className="bi bi-arrow-clockwise"></i>
          </Button>
          <Button size="sm" variant="outline-danger" onClick={handleClear} disabled={stats.total === 0}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {/* 统计卡 */}
        <Row className="mb-3 g-2">
          <Col xs={6} md={2}>
            <Card className="text-center"><Card.Body className="py-2">
              <h5 className="mb-0">{stats.total}</h5><small>总条数 / {stats.capacity}</small>
            </Card.Body></Card>
          </Col>
          {Object.entries(visibleEvents).map(([k, v]) => (
            <Col xs={6} md={2} key={k}>
              <Card className="text-center" border={v.color}>
                <Card.Body className="py-2">
                  <i className={`bi ${v.icon} d-block text-${v.color}`}></i>
                  <strong>{stats.byEvent[k] || 0}</strong>
                  <small className="d-block">{v.label}</small>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* 筛选 */}
        <Row className="g-2 mb-2">
          <Col md={3}>
            <Form.Select size="sm" value={filterEvent} onChange={e => setFilterEvent(e.target.value)}>
              <option value="">全部事件</option>
              {Object.entries(visibleEvents).map(([k, v]) => (
                <option key={k} value={k}>{v.label}</option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Control size="sm" placeholder="按用户过滤..." value={filterUser} onChange={e => setFilterUser(e.target.value)} />
          </Col>
          <Col md={4}>
            <Form.Control size="sm" placeholder="按资源 ID 过滤..." value={filterResource} onChange={e => setFilterResource(e.target.value)} />
          </Col>
          <Col md={2} className="text-end">
            <small className="text-muted">{entries.length} 条结果</small>
          </Col>
        </Row>

        {/* 列表 */}
        {entries.length === 0 ? (
          <Alert variant="light" className="text-center py-3 mb-0">
            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
            暂无审计日志
          </Alert>
        ) : (
          <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            <Table size="sm" hover className="mb-0" style={{ fontSize: '0.82em' }}>
              <thead className="bg-light sticky-top">
                <tr>
                  <th>时间</th><th>事件</th><th>资源</th><th>用户</th><th>详情</th>
                </tr>
              </thead>
              <tbody>
                {entries.slice(0, 200).map(e => {
                  const ev = AUDIT_EVENTS[e.event] || {};
                  return (
                    <tr key={e.id}>
                      <td className="text-nowrap">{new Date(e.timestamp).toLocaleString('zh-CN')}</td>
                      <td>
                        <Badge bg={ev.color || 'secondary'}>
                          <i className={`bi ${ev.icon} me-1`}></i>{ev.label || e.event}
                        </Badge>
                      </td>
                      <td>
                        {e.resourceType && <Badge bg="light" text="dark" className="me-1">{e.resourceType}</Badge>}
                        <code style={{ fontSize: '0.85em' }}>{e.resourceId || '-'}</code>
                      </td>
                      <td>{e.userId || '匿名'}{e.userRole && <small className="text-muted ms-1">({e.userRole})</small>}</td>
                      <td className="text-truncate" style={{ maxWidth: 260 }}>{e.detail || '-'}</td>
                    </tr>
                  );
                })}
                {entries.length > 200 && (
                  <tr><td colSpan={5} className="text-center text-muted small">仅显示最近 200 条, 完整数据请导出 CSV</td></tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default AuditLogViewer;
