// src/components/DataBackupView.js
// 数据备份与恢复 - localStorage/IndexedDB 数据管理
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, ListGroup, ProgressBar } from 'react-bootstrap';

// 2026-05-31 P0: keyPattern 必须与各模块真实写入键一致, 否则"成功备份"实为空。
// 已核实修正: 价格历史 priceHistory→gearbox_price_history (priceHistoryTracker.PRICE_HISTORY_KEY);
//            项目数据 projects→gearbox_projects (ProjectTracker.STORAGE_KEY)。
// 合同数据: 本 App 的 ContractView 不落 localStorage(合同存 QuoteDB/IndexedDB), 故标注待 IndexedDB 导出覆盖。
const DATA_SOURCES = [
  { key: 'quotations', label: '报价数据', storage: 'localStorage', keyPattern: 'gearbox_quotations', icon: 'bi-receipt' },
  { key: 'contracts', label: '合同数据 (存于 QuoteDB)', storage: 'IndexedDB', keyPattern: 'QuoteDB', icon: 'bi-file-earmark-text' },
  { key: 'projects', label: '项目数据', storage: 'localStorage', keyPattern: 'gearbox_projects', icon: 'bi-kanban' },
  { key: 'selection_history', label: '选型历史', storage: 'localStorage', keyPattern: 'selectionHistory', icon: 'bi-clock-history' },
  { key: 'price_history', label: '价格变更记录', storage: 'localStorage', keyPattern: 'gearbox_price_history', icon: 'bi-currency-yuan' },
  { key: 'quotedb', label: '报价数据库(IndexedDB)', storage: 'IndexedDB', keyPattern: 'QuoteDB', icon: 'bi-database' },
  { key: 'settings', label: '系统设置', storage: 'localStorage', keyPattern: 'gearbox_settings', icon: 'bi-gear' },
];

function getStorageSize(key) {
  try {
    const val = localStorage.getItem(key);
    if (!val) return 0;
    return new Blob([val]).size;
  } catch { return 0; }
}

function formatSize(bytes) {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}

export default function DataBackupView({ colors, theme }) {
  const [selected, setSelected] = useState(new Set(DATA_SOURCES.map(d => d.key)));
  const [backing, setBacking] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastBackup, setLastBackup] = useState(null);
  const [restoreFile, setRestoreFile] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => { return () => { if (timerRef.current) clearInterval(timerRef.current); }; }, []);

  const storageInfo = useMemo(() => {
    return DATA_SOURCES.map(d => {
      const size = d.storage === 'localStorage' ? getStorageSize(d.keyPattern) : 0;
      const hasData = d.storage === 'localStorage' ? !!localStorage.getItem(d.keyPattern) : true;
      return { ...d, size, hasData };
    });
  }, []);

  const totalSize = useMemo(() => storageInfo.reduce((sum, d) => sum + d.size, 0), [storageInfo]);

  const toggleSource = useCallback((key) => {
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  }, []);

  const handleBackup = useCallback(() => {
    setBacking(true);
    setProgress(0);
    const backup = {};
    DATA_SOURCES.forEach(d => {
      if (selected.has(d.key) && d.storage === 'localStorage') {
        const val = localStorage.getItem(d.keyPattern);
        if (val) backup[d.keyPattern] = val;
      }
    });
    timerRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timerRef.current); timerRef.current = null;
          setBacking(false);
          const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `gearbox-backup-${new Date().toISOString().slice(0, 10)}.json`;
          a.click();
          URL.revokeObjectURL(url);
          setLastBackup(new Date().toLocaleString());
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  }, [selected]);

  const handleRestore = useCallback(() => {
    if (!restoreFile) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        Object.entries(data).forEach(([key, val]) => {
          localStorage.setItem(key, val);
        });
        alert(`成功恢复 ${Object.keys(data).length} 项数据！`);
      } catch (err) {
        alert('恢复失败：文件格式不正确');
      }
    };
    reader.readAsText(restoreFile);
  }, [restoreFile]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-cloud-upload me-2"></i>数据备份与恢复</h5>
          <small className="text-muted">备份/恢复本地存储的报价、合同、选型历史等数据</small>
        </Col>
      </Row>

      <Row>
        <Col md={7}>
          <Card className="mb-3">
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>数据源</span>
              <small className="text-muted">总计: {formatSize(totalSize)}</small>
            </Card.Header>
            <Card.Body className="p-0">
              <Table className="mb-0">
                <thead><tr><th></th><th>数据</th><th>存储</th><th>大小</th><th>状态</th></tr></thead>
                <tbody>
                  {storageInfo.map(d => (
                    <tr key={d.key}>
                      <td><Form.Check type="checkbox" checked={selected.has(d.key)} onChange={() => toggleSource(d.key)} /></td>
                      <td><i className={`bi ${d.icon} me-1`}></i>{d.label}</td>
                      <td><Badge bg="light" text="dark">{d.storage}</Badge></td>
                      <td>{formatSize(d.size)}</td>
                      <td>{d.hasData ? <Badge bg="success">有数据</Badge> : <Badge bg="secondary">空</Badge>}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>

        <Col md={5}>
          <Card className="mb-3">
            <Card.Header className="bg-primary text-white"><i className="bi bi-download me-1"></i>备份</Card.Header>
            <Card.Body>
              <p className="small text-muted">已选 {selected.size}/{DATA_SOURCES.length} 项数据源</p>
              {backing ? (
                <ProgressBar now={progress} label={`${progress}%`} animated striped />
              ) : (
                <Button variant="primary" className="w-100" onClick={handleBackup} disabled={selected.size === 0}>
                  <i className="bi bi-cloud-download me-1"></i>导出备份文件
                </Button>
              )}
              {lastBackup && <Alert variant="success" className="mt-2 mb-0 py-1 small">上次备份: {lastBackup}</Alert>}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header className="bg-warning text-dark"><i className="bi bi-upload me-1"></i>恢复</Card.Header>
            <Card.Body>
              <Form.Control type="file" accept=".json" size="sm" className="mb-2" onChange={e => setRestoreFile(e.target.files[0])} />
              <Button variant="warning" className="w-100" onClick={handleRestore} disabled={!restoreFile}>
                <i className="bi bi-arrow-counterclockwise me-1"></i>从备份恢复
              </Button>
              <Alert variant="warning" className="mt-2 mb-0 py-1 small">
                <i className="bi bi-exclamation-triangle me-1"></i>恢复操作将覆盖现有数据，请谨慎操作
              </Alert>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
