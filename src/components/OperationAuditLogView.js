// 操作审计日志统一中心 — 聚合资料库审计 / 价格历史 / 导入历史 / 全局时间线
import React, { useMemo, useState, useCallback } from 'react';
import { Card, Tabs, Tab, Row, Col, Badge, Table, Button, Alert } from 'react-bootstrap';
import AuditLogViewer from './library/AuditLogViewer';
import { listAudit, AUDIT_EVENTS, auditStats, exportAuditCSV } from '../services/auditLog';
import { getPriceHistory, clearPriceHistory } from '../utils/priceHistoryTracker';
import { getImportHistory, clearImportHistory } from './import-history';
import { hasPermission, permissions, userRoles } from '../auth/roles';

const fmtDate = (iso) => {
  if (!iso) return '-';
  try {
    return new Date(iso).toLocaleString('zh-CN');
  } catch (e) {
    return String(iso);
  }
};

const PriceHistoryPanel = ({ refreshKey, onRefresh }) => {
  const history = useMemo(() => {
    void refreshKey;
    return getPriceHistory({ limit: 200 });
  }, [refreshKey]);

  const totalChanges = history.reduce((sum, h) => sum + (h.items?.length || 0), 0);

  const handleClear = () => {
    if (!window.confirm(`确认清空全部 ${history.length} 条价格历史?此操作不可撤销。`)) return;
    clearPriceHistory();
    onRefresh();
  };

  const handleExport = () => {
    const headers = ['timestamp', 'user', 'reason', 'model', 'type', 'oldBasePrice', 'newBasePrice', 'oldFactoryPrice', 'newFactoryPrice'];
    const rows = [];
    history.forEach(entry => {
      (entry.items || []).forEach(item => {
        rows.push([
          entry.timestamp, entry.user || '', entry.reason || '',
          item.model || '', item.type || '', item.oldBasePrice ?? '', item.newBasePrice ?? '',
          item.oldFactoryPrice ?? '', item.newFactoryPrice ?? '',
        ].map(v => /[,"\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v).join(','));
      });
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `price_history_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <strong><i className="bi bi-currency-yen me-2"></i>价格变更历史</strong>
          <Badge bg="info" className="ms-2">{history.length} 批</Badge>
          <Badge bg="secondary" className="ms-1">{totalChanges} 项变更</Badge>
        </div>
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-success" onClick={handleExport} disabled={history.length === 0}>
            <i className="bi bi-download me-1"></i>导出 CSV
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={onRefresh}>
            <i className="bi bi-arrow-clockwise"></i>
          </Button>
          <Button size="sm" variant="outline-danger" onClick={handleClear} disabled={history.length === 0}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {history.length === 0 ? (
          <Alert variant="light" className="text-center py-3 mb-0">
            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
            暂无价格变更历史
          </Alert>
        ) : (
          <div style={{ maxHeight: 460, overflowY: 'auto' }}>
            <Table size="sm" hover className="mb-0" style={{ fontSize: '0.82em' }}>
              <thead className="bg-light sticky-top">
                <tr>
                  <th>时间</th><th>变更原因</th><th>用户</th><th>变更项数</th><th>明细预览</th>
                </tr>
              </thead>
              <tbody>
                {history.map((entry, idx) => (
                  <tr key={`${entry.timestamp}-${idx}`}>
                    <td className="text-nowrap">{fmtDate(entry.timestamp)}</td>
                    <td>{entry.reason || '-'}</td>
                    <td>{entry.user || '匿名'}</td>
                    <td><Badge bg="primary">{entry.items?.length || 0}</Badge></td>
                    <td className="text-truncate" style={{ maxWidth: 360 }}>
                      {(entry.items || []).slice(0, 3).map((it, i) => (
                        <Badge key={i} bg="light" text="dark" className="me-1">
                          {it.model} {it.type === 'add' ? '+' : it.type === 'delete' ? '-' : '↔'}
                          {it.newBasePrice != null ? ` ¥${it.newBasePrice}` : ''}
                        </Badge>
                      ))}
                      {(entry.items?.length || 0) > 3 && <small className="text-muted">+{entry.items.length - 3}</small>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const ImportHistoryPanel = ({ refreshKey, onRefresh }) => {
  const history = useMemo(() => {
    void refreshKey;
    return getImportHistory();
  }, [refreshKey]);

  const handleClear = () => {
    if (!window.confirm(`确认清空全部 ${history.length} 条导入历史?此操作不可撤销。`)) return;
    clearImportHistory();
    onRefresh();
  };

  return (
    <Card className="mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <strong><i className="bi bi-cloud-upload me-2"></i>数据导入历史</strong>
          <Badge bg="info" className="ms-2">{history.length}</Badge>
        </div>
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-secondary" onClick={onRefresh}>
            <i className="bi bi-arrow-clockwise"></i>
          </Button>
          <Button size="sm" variant="outline-danger" onClick={handleClear} disabled={history.length === 0}>
            <i className="bi bi-trash"></i>
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {history.length === 0 ? (
          <Alert variant="light" className="text-center py-3 mb-0">
            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
            暂无数据导入历史
          </Alert>
        ) : (
          <div style={{ maxHeight: 460, overflowY: 'auto' }}>
            <Table size="sm" hover className="mb-0" style={{ fontSize: '0.82em' }}>
              <thead className="bg-light sticky-top">
                <tr>
                  <th>时间</th><th>文件数</th><th>成功</th><th>失败</th><th>文件名</th>
                </tr>
              </thead>
              <tbody>
                {history.map(rec => (
                  <tr key={rec.id}>
                    <td className="text-nowrap">{fmtDate(rec.date)}</td>
                    <td><Badge bg="primary">{rec.totalFiles}</Badge></td>
                    <td><Badge bg="success">{rec.successCount}</Badge></td>
                    <td>{rec.failedCount > 0 ? <Badge bg="danger">{rec.failedCount}</Badge> : '-'}</td>
                    <td className="text-truncate" style={{ maxWidth: 360 }}>
                      {(rec.fileNames || []).slice(0, 3).map((n, i) => (
                        <Badge key={i} bg="light" text="dark" className="me-1">{n}</Badge>
                      ))}
                      {(rec.fileNames?.length || 0) > 3 && <small className="text-muted">+{rec.fileNames.length - 3}</small>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const TimelinePanel = ({ refreshKey }) => {
  const events = useMemo(() => {
    void refreshKey;
    const all = [];
    listAudit({}).forEach(e => {
      const ev = AUDIT_EVENTS[e.event] || {};
      all.push({
        timestamp: e.timestamp,
        source: 'audit',
        color: ev.color || 'secondary',
        icon: ev.icon || 'bi-circle',
        label: ev.label || e.event,
        detail: `${e.resourceType ? `[${e.resourceType}] ` : ''}${e.resourceId || ''} ${e.detail || ''}`.trim() || '-',
        user: e.userId || '匿名',
      });
    });
    getPriceHistory({ limit: 500 }).forEach(entry => {
      all.push({
        timestamp: entry.timestamp,
        source: 'price',
        color: 'warning',
        icon: 'bi-currency-yen',
        label: '价格变更',
        detail: `${entry.reason || ''} (${entry.items?.length || 0} 项)`,
        user: entry.user || '匿名',
      });
    });
    getImportHistory().forEach(rec => {
      all.push({
        timestamp: rec.date,
        source: 'import',
        color: rec.failedCount > 0 ? 'danger' : 'success',
        icon: 'bi-cloud-upload',
        label: '数据导入',
        detail: `${rec.totalFiles} 文件 / ${rec.successCount} 成功 / ${rec.failedCount} 失败`,
        user: '-',
      });
    });
    return all.sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
  }, [refreshKey]);

  return (
    <Card className="mb-3">
      <Card.Header>
        <strong><i className="bi bi-clock-history me-2"></i>统一时间线</strong>
        <Badge bg="primary" className="ms-2">{events.length}</Badge>
        <small className="text-muted ms-2">三源合并按时间倒序</small>
      </Card.Header>
      <Card.Body>
        {events.length === 0 ? (
          <Alert variant="light" className="text-center py-3 mb-0">
            <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
            暂无审计事件
          </Alert>
        ) : (
          <div style={{ maxHeight: 600, overflowY: 'auto' }}>
            <Table size="sm" hover className="mb-0" style={{ fontSize: '0.82em' }}>
              <thead className="bg-light sticky-top">
                <tr>
                  <th>时间</th><th>来源</th><th>事件</th><th>用户</th><th>详情</th>
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 500).map((e, i) => (
                  <tr key={`${e.timestamp}-${i}`}>
                    <td className="text-nowrap">{fmtDate(e.timestamp)}</td>
                    <td>
                      <Badge bg="light" text="dark">{
                        e.source === 'audit' ? '审计' : e.source === 'price' ? '价格' : '导入'
                      }</Badge>
                    </td>
                    <td>
                      <Badge bg={e.color}>
                        <i className={`bi ${e.icon} me-1`}></i>{e.label}
                      </Badge>
                    </td>
                    <td>{e.user}</td>
                    <td className="text-truncate" style={{ maxWidth: 360 }}>{e.detail}</td>
                  </tr>
                ))}
                {events.length > 500 && (
                  <tr><td colSpan={5} className="text-center text-muted small">仅显示最近 500 条</td></tr>
                )}
              </tbody>
            </Table>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

const OperationAuditLogView = ({ userRole = userRoles.USER, colors }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  const allowed = hasPermission(userRole, permissions.MANAGE_USERS) || hasPermission(userRole, permissions.SYSTEM_SETTINGS);

  const summary = useMemo(() => {
    void refreshKey;
    const audit = auditStats();
    const priceBatches = getPriceHistory({ limit: 1000 });
    const priceItems = priceBatches.reduce((s, b) => s + (b.items?.length || 0), 0);
    const imports = getImportHistory();
    return {
      auditTotal: audit.total,
      auditCapacity: audit.capacity,
      priceBatches: priceBatches.length,
      priceItems,
      imports: imports.length,
      latestAudit: audit.latestAt,
    };
  }, [refreshKey]);

  const handleExportAllAudit = () => {
    const csv = exportAuditCSV();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit_log_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  if (!allowed) {
    return (
      <div className="container py-4">
        <Alert variant="warning">
          <Alert.Heading><i className="bi bi-shield-slash me-2"></i>权限不足</Alert.Heading>
          <p className="mb-0">操作审计日志仅对管理员(ADMIN / SUPER_ADMIN)开放。当前角色:<code>{userRole}</code></p>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container-fluid py-3" style={{ background: colors?.background || '#f8f9fa', minHeight: 'calc(100vh - 60px)' }}>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          <h4 className="mb-1"><i className="bi bi-shield-check me-2"></i>操作审计日志</h4>
          <small className="text-muted">统一汇总资料库审计 · 价格变更 · 数据导入,供合规审查与异常排查</small>
        </div>
        <div className="d-flex gap-2">
          <Button size="sm" variant="outline-success" onClick={handleExportAllAudit}>
            <i className="bi bi-download me-1"></i>导出审计 CSV
          </Button>
          <Button size="sm" variant="outline-secondary" onClick={refresh}>
            <i className="bi bi-arrow-clockwise me-1"></i>刷新
          </Button>
        </div>
      </div>

      {/* 顶部统计卡 */}
      <Row className="mb-3 g-2">
        <Col xs={6} md={3}>
          <Card className="text-center" border="primary">
            <Card.Body className="py-2">
              <i className="bi bi-list-ul d-block text-primary mb-1" style={{ fontSize: '1.2rem' }}></i>
              <h5 className="mb-0">{summary.auditTotal}</h5>
              <small>资料库审计 / {summary.auditCapacity}</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="text-center" border="warning">
            <Card.Body className="py-2">
              <i className="bi bi-currency-yen d-block text-warning mb-1" style={{ fontSize: '1.2rem' }}></i>
              <h5 className="mb-0">{summary.priceItems}</h5>
              <small>价格变更项 / {summary.priceBatches} 批</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="text-center" border="info">
            <Card.Body className="py-2">
              <i className="bi bi-cloud-upload d-block text-info mb-1" style={{ fontSize: '1.2rem' }}></i>
              <h5 className="mb-0">{summary.imports}</h5>
              <small>数据导入次数</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="text-center" border="secondary">
            <Card.Body className="py-2">
              <i className="bi bi-clock-history d-block text-secondary mb-1" style={{ fontSize: '1.2rem' }}></i>
              <small className="d-block fw-bold">最近事件</small>
              <small>{summary.latestAudit ? fmtDate(summary.latestAudit) : '-'}</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="timeline" className="mb-3">
        <Tab eventKey="timeline" title={<span><i className="bi bi-clock-history me-1"></i>统一时间线</span>}>
          <TimelinePanel refreshKey={refreshKey} />
        </Tab>
        <Tab eventKey="audit" title={<span><i className="bi bi-shield-check me-1"></i>操作日志</span>}>
          <AuditLogViewer title="全部审计事件" badge={null} />
        </Tab>
        <Tab eventKey="price" title={<span><i className="bi bi-currency-yen me-1"></i>价格历史</span>}>
          <PriceHistoryPanel refreshKey={refreshKey} onRefresh={refresh} />
        </Tab>
        <Tab eventKey="import" title={<span><i className="bi bi-cloud-upload me-1"></i>导入历史</span>}>
          <ImportHistoryPanel refreshKey={refreshKey} onRefresh={refresh} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default OperationAuditLogView;
