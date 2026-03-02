// src/components/DocumentDashboard.js
// 文档管理仪表板 — 展示所有文档类型的概览、统计和快捷操作

import React, { useState, useMemo, useCallback } from 'react';
import { Card, Row, Col, Badge, Button, ListGroup, Form, Modal } from 'react-bootstrap';
import {
  inquiryStore,
  quotationStore,
  agreementStore,
  contractStore,
  getDocumentStats,
  exportAllDocuments,
  importAllDocuments,
} from '../services/documentStorage';
import { getAllDocCounts, getDocTypeName } from '../utils/documentNumbering';

const DOC_TYPES = [
  { key: 'inquiry', label: '技术询单', icon: 'bi-file-earmark-text', color: '#0d6efd', store: inquiryStore },
  { key: 'quotation', label: '报价单', icon: 'bi-currency-yen', color: '#198754', store: quotationStore },
  { key: 'agreement', label: '技术协议', icon: 'bi-file-earmark-check', color: '#6f42c1', store: agreementStore },
  { key: 'contract', label: '销售合同', icon: 'bi-file-earmark-ruled', color: '#dc3545', store: contractStore },
];

const DocumentDashboard = ({ colors = {}, theme = 'light', onNavigate }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackupModal, setShowBackupModal] = useState(false);

  const refresh = useCallback(() => setRefreshKey(k => k + 1), []);

  // 统计数据
  const stats = useMemo(() => {
    void refreshKey; // trigger recalc
    return getDocumentStats();
  }, [refreshKey]);

  const numberCounts = useMemo(() => {
    void refreshKey;
    return getAllDocCounts();
  }, [refreshKey]);

  // 某类型的文档列表
  const docList = useMemo(() => {
    if (!selectedType) return [];
    const type = DOC_TYPES.find(t => t.key === selectedType);
    if (!type) return [];
    const items = type.store.getAll();
    if (!searchTerm) return items.slice(-50).reverse();
    const term = searchTerm.toLowerCase();
    return items
      .filter(item => {
        const text = JSON.stringify(item).toLowerCase();
        return text.includes(term);
      })
      .slice(-50)
      .reverse();
  }, [selectedType, searchTerm, refreshKey]);

  // 导出备份
  const handleExportBackup = useCallback(() => {
    const data = exportAllDocuments();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `文档备份_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setShowBackupModal(false);
  }, []);

  // 导入备份
  const handleImportBackup = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        importAllDocuments(data);
        refresh();
        alert('备份恢复成功');
      } catch (err) {
        alert('备份文件格式错误: ' + err.message);
      }
    };
    reader.readAsText(file);
    setShowBackupModal(false);
  }, [refresh]);

  // 删除文档
  const handleDelete = useCallback((type, id) => {
    if (!window.confirm('确定要删除这条记录吗？')) return;
    const t = DOC_TYPES.find(dt => dt.key === type);
    if (t) {
      t.store.remove(id);
      refresh();
    }
  }, [refresh]);

  const cardBg = colors.card || (theme === 'dark' ? '#2d2d2d' : '#fff');
  const borderColor = colors.border || (theme === 'dark' ? '#444' : '#dee2e6');
  const textColor = colors.text || (theme === 'dark' ? '#e0e0e0' : '#212529');
  const mutedColor = colors.muted || (theme === 'dark' ? '#999' : '#6c757d');

  return (
    <div>
      {/* 统计卡片 */}
      <Row className="mb-4">
        {DOC_TYPES.map(dt => {
          const countKey = dt.key === 'inquiry' ? 'inquiries'
            : dt.key === 'quotation' ? 'quotations'
            : dt.key === 'agreement' ? 'agreements'
            : 'contracts';
          const count = stats[countKey] || 0;
          const isActive = selectedType === dt.key;
          return (
            <Col key={dt.key} xs={6} md={3} className="mb-3">
              <Card
                onClick={() => setSelectedType(isActive ? null : dt.key)}
                style={{
                  cursor: 'pointer',
                  backgroundColor: isActive ? dt.color : cardBg,
                  borderColor: isActive ? dt.color : borderColor,
                  color: isActive ? '#fff' : textColor,
                  transition: 'all 0.2s',
                }}
                className="h-100 shadow-sm"
              >
                <Card.Body className="text-center py-3">
                  <i className={`bi ${dt.icon} d-block mb-2`} style={{ fontSize: '2rem', opacity: 0.85 }}></i>
                  <h3 className="mb-1">{count}</h3>
                  <div style={{ fontSize: '0.85em' }}>{dt.label}</div>
                  {numberCounts[dt.key] > 0 && (
                    <small style={{ opacity: 0.7 }}>
                      本年编号: {numberCounts[dt.key]}
                    </small>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* 工具栏 */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div>
          {selectedType ? (
            <h5 style={{ color: textColor, margin: 0 }}>
              <i className={`bi ${DOC_TYPES.find(t => t.key === selectedType)?.icon} me-2`}></i>
              {DOC_TYPES.find(t => t.key === selectedType)?.label}列表
              <Badge bg="secondary" className="ms-2">{docList.length}</Badge>
            </h5>
          ) : (
            <h5 style={{ color: textColor, margin: 0 }}>
              <i className="bi bi-grid me-2"></i>文档总览
            </h5>
          )}
        </div>
        <div className="d-flex gap-2">
          {selectedType && (
            <Form.Control
              size="sm"
              type="text"
              placeholder="搜索..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              style={{ width: 200, backgroundColor: colors.inputBg, color: textColor, borderColor }}
            />
          )}
          <Button variant="outline-secondary" size="sm" onClick={() => setShowBackupModal(true)}>
            <i className="bi bi-download me-1"></i>备份/恢复
          </Button>
          <Button variant="outline-primary" size="sm" onClick={refresh}>
            <i className="bi bi-arrow-clockwise"></i>
          </Button>
        </div>
      </div>

      {/* 文档列表 */}
      {selectedType ? (
        <Card style={{ backgroundColor: cardBg, borderColor }}>
          <ListGroup variant="flush">
            {docList.length === 0 ? (
              <ListGroup.Item style={{ backgroundColor: cardBg, color: mutedColor, textAlign: 'center', padding: '2rem' }}>
                <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '2rem' }}></i>
                暂无{getDocTypeName(selectedType)}记录
              </ListGroup.Item>
            ) : (
              docList.map(doc => (
                <ListGroup.Item
                  key={doc.id}
                  style={{ backgroundColor: cardBg, borderColor, color: textColor }}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div className="d-flex align-items-center gap-2">
                      <strong style={{ fontSize: '0.95em' }}>
                        {doc.docNumber || doc.contractNumber || doc.id}
                      </strong>
                      {doc.status && (
                        <Badge bg={doc.status === 'submitted' ? 'success' : doc.status === 'draft' ? 'warning' : 'secondary'} style={{ fontSize: '0.7em' }}>
                          {doc.status === 'submitted' ? '已提交' : doc.status === 'draft' ? '草稿' : doc.status}
                        </Badge>
                      )}
                    </div>
                    <small style={{ color: mutedColor }}>
                      {doc.projectName || doc.buyerName || doc.customerName || doc.engineInfo || ''}
                      {doc.model && <span className="ms-2">{doc.model}</span>}
                      {doc.totalAmount && <span className="ms-2">¥{Number(doc.totalAmount).toLocaleString()}</span>}
                    </small>
                    <div>
                      <small style={{ color: mutedColor, fontSize: '0.75em' }}>
                        {doc.createdAt ? new Date(doc.createdAt).toLocaleString('zh-CN') : ''}
                        {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
                          <span className="ms-2">更新: {new Date(doc.updatedAt).toLocaleString('zh-CN')}</span>
                        )}
                      </small>
                    </div>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDelete(selectedType, doc.id)}
                    title="删除"
                  >
                    <i className="bi bi-trash"></i>
                  </Button>
                </ListGroup.Item>
              ))
            )}
          </ListGroup>
        </Card>
      ) : (
        /* 最近文档概览 */
        <Row>
          {DOC_TYPES.map(dt => {
            const recent = dt.store.getRecent(3);
            return (
              <Col key={dt.key} md={6} className="mb-3">
                <Card style={{ backgroundColor: cardBg, borderColor }} className="h-100">
                  <Card.Header
                    style={{ backgroundColor: cardBg, borderColor, color: textColor, cursor: 'pointer' }}
                    onClick={() => setSelectedType(dt.key)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <span><i className={`bi ${dt.icon} me-2`} style={{ color: dt.color }}></i>{dt.label}</span>
                      <Badge bg="light" text="dark">{dt.store.count()}</Badge>
                    </div>
                  </Card.Header>
                  <ListGroup variant="flush">
                    {recent.length === 0 ? (
                      <ListGroup.Item style={{ backgroundColor: cardBg, color: mutedColor, fontSize: '0.85em' }}>
                        暂无记录
                      </ListGroup.Item>
                    ) : (
                      recent.map(doc => (
                        <ListGroup.Item key={doc.id} style={{ backgroundColor: cardBg, borderColor, color: textColor, fontSize: '0.85em' }}>
                          <div className="d-flex justify-content-between">
                            <span>{doc.docNumber || doc.contractNumber || doc.projectName || doc.id}</span>
                            <small style={{ color: mutedColor }}>
                              {doc.createdAt ? new Date(doc.createdAt).toLocaleDateString('zh-CN') : ''}
                            </small>
                          </div>
                        </ListGroup.Item>
                      ))
                    )}
                  </ListGroup>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* 备份/恢复模态框 */}
      <Modal show={showBackupModal} onHide={() => setShowBackupModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: cardBg, color: textColor, borderColor }}>
          <Modal.Title style={{ fontSize: '1.1rem' }}>
            <i className="bi bi-archive me-2"></i>文档备份与恢复
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: cardBg, color: textColor }}>
          <div className="mb-4">
            <h6>导出备份</h6>
            <p style={{ color: mutedColor, fontSize: '0.85em' }}>
              将所有文档数据导出为JSON文件，可用于备份或迁移。
            </p>
            <Button variant="primary" size="sm" onClick={handleExportBackup}>
              <i className="bi bi-download me-1"></i>导出全部文档
            </Button>
          </div>
          <hr style={{ borderColor }} />
          <div>
            <h6>恢复备份</h6>
            <p style={{ color: mutedColor, fontSize: '0.85em' }}>
              从JSON备份文件恢复文档数据。注意：这将覆盖现有数据。
            </p>
            <Form.Control
              type="file"
              accept=".json"
              size="sm"
              onChange={handleImportBackup}
              style={{ backgroundColor: colors.inputBg, color: textColor, borderColor }}
            />
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DocumentDashboard;
