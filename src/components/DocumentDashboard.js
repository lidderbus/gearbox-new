// src/components/DocumentDashboard.js
// 文档管理仪表板 — 展示所有文档类型的概览、统计和快捷操作

import React, { useState, useMemo, useCallback } from 'react';
import { Card, Row, Col, Badge, Button, ListGroup, Form, Modal, Nav } from 'react-bootstrap';
import {
  inquiryStore,
  quotationStore,
  agreementStore,
  contractStore,
  relationStore,
  getDocumentStats,
  exportAllDocuments,
  importAllDocuments,
} from '../services/documentStorage';
import { getAllDocCounts, getDocTypeName } from '../utils/documentNumbering';
import { useProject } from '../contexts/ProjectContext';
import { saveVersion, listVersions } from '../services/documentVersionStore';
import VersionHistoryDrawer from './common/VersionHistoryDrawer';

const DOC_TYPES = [
  { key: 'inquiry', label: '技术询单', icon: 'bi-file-earmark-text', color: '#0d6efd', store: inquiryStore },
  { key: 'quotation', label: '报价单', icon: 'bi-currency-yen', color: '#198754', store: quotationStore },
  { key: 'agreement', label: '技术协议', icon: 'bi-file-earmark-check', color: '#6f42c1', store: agreementStore },
  { key: 'contract', label: '销售合同', icon: 'bi-file-earmark-ruled', color: '#dc3545', store: contractStore },
];

/** 计算文档年龄的友好显示 */
const getDocAge = (dateStr) => {
  if (!dateStr) return '';
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}天前`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}个月前`;
  return `${Math.floor(months / 12)}年前`;
};

/** 计算文档相关localStorage占用大小 (MB) */
const getDocStorageSize = () => {
  const keys = ['doc_inquiries', 'doc_quotations', 'doc_agreements', 'doc_contracts', 'doc_relations'];
  let total = 0;
  keys.forEach(key => {
    const val = localStorage.getItem(key);
    if (val) total += val.length * 2; // UTF-16 每字符2字节
  });
  return (total / (1024 * 1024)).toFixed(2);
};

/** 获取文档预览字段 */
const getDocPreviewFields = (doc, type) => {
  switch (type) {
    case 'quotation':
      return [
        { label: '客户', value: doc.customerName || doc.buyerName || '-' },
        { label: '项目', value: doc.projectName || '-' },
        { label: '产品', value: (doc.items || []).map(i => i.model || i.name || '').filter(Boolean).join(', ') || '-' },
        { label: '数量', value: (doc.items || []).length ? `${doc.items.length} 项` : '-' },
        { label: '总金额', value: doc.totalAmount ? `¥${Number(doc.totalAmount).toLocaleString()}` : '-' },
        { label: '状态', value: doc.status === 'submitted' ? '已提交' : doc.status === 'draft' ? '草稿' : (doc.status || '-') },
      ];
    case 'contract':
      return [
        { label: '买方', value: doc.buyerName || doc.customerName || '-' },
        { label: '项目', value: doc.projectName || '-' },
        { label: '产品', value: doc.products || doc.model || '-' },
        { label: '合同金额', value: doc.totalAmount ? `¥${Number(doc.totalAmount).toLocaleString()}` : '-' },
        { label: '合同编号', value: doc.contractNumber || '-' },
        { label: '签订日期', value: doc.signDate || doc.createdAt ? new Date(doc.signDate || doc.createdAt).toLocaleDateString('zh-CN') : '-' },
      ];
    case 'agreement':
      return [
        { label: '齿轮箱型号', value: doc.model || doc.gearboxModel || '-' },
        { label: '客户', value: doc.customerName || doc.buyerName || '-' },
        { label: '项目', value: doc.projectName || '-' },
        { label: '船级社', value: doc.classification || doc.classificationSociety || '-' },
        { label: '功率', value: doc.power ? `${doc.power} kW` : '-' },
        { label: '转速', value: doc.speed ? `${doc.speed} rpm` : '-' },
      ];
    case 'inquiry':
      return [
        { label: '客户', value: doc.customerName || doc.company || '-' },
        { label: '功率', value: doc.power ? `${doc.power} kW` : '-' },
        { label: '转速', value: doc.speed ? `${doc.speed} rpm` : '-' },
        { label: '船型', value: doc.shipType || doc.vesselType || '-' },
        { label: '用途', value: doc.application || '-' },
        { label: '联系人', value: doc.contactName || doc.contact || '-' },
      ];
    default:
      return [
        { label: 'ID', value: doc.id || '-' },
        { label: '创建时间', value: doc.createdAt ? new Date(doc.createdAt).toLocaleString('zh-CN') : '-' },
      ];
  }
};

const DocumentDashboard = ({ colors = {}, theme = 'light', onNavigate }) => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [selectedType, setSelectedType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBackupModal, setShowBackupModal] = useState(false);
  // Selective export state
  const [checkedIds, setCheckedIds] = useState(new Set());
  // Project bundling state
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'project'
  const [selectedProject, setSelectedProject] = useState(null);
  // Document preview state
  const [previewDoc, setPreviewDoc] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  // P0-1: ProjectID 主线 hook
  const { currentProjectId, currentProjectName, setCurrentProject, clearCurrentProject } = useProject();
  // P3-2: 版本历史抽屉
  const [versionDrawer, setVersionDrawer] = useState({ show: false, type: null, doc: null });

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

  // localStorage 文档占用大小
  const storageSize = useMemo(() => {
    void refreshKey;
    return getDocStorageSize();
  }, [refreshKey]);

  // 选择性导出：切换选中
  const toggleCheck = useCallback((id) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  }, []);

  // 全选/取消
  const toggleSelectAll = useCallback(() => {
    if (checkedIds.size === docList.length) {
      setCheckedIds(new Set());
    } else {
      setCheckedIds(new Set(docList.map(d => d.id)));
    }
  }, [checkedIds.size, docList]);

  // 导出选中文档
  const handleExportSelected = useCallback(() => {
    const selected = docList.filter(d => checkedIds.has(d.id));
    if (selected.length === 0) { alert('请先勾选要导出的文档'); return; }
    const blob = new Blob([JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      type: selectedType,
      typeName: DOC_TYPES.find(t => t.key === selectedType)?.label,
      documents: selected,
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${DOC_TYPES.find(t => t.key === selectedType)?.label || '文档'}_选中导出_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [docList, checkedIds, selectedType]);

  // 按项目分组的所有文档
  // P0-1: 优先按 projectId 分组,缺失时回退到 projectName,确保新老数据共存
  const projectGroups = useMemo(() => {
    void refreshKey;
    const groups = {};
    DOC_TYPES.forEach(dt => {
      dt.store.getAll().forEach(doc => {
        const projectKey = doc.projectId || (doc.projectName ? `name:${doc.projectName}` : '未分配项目');
        if (!groups[projectKey]) {
          groups[projectKey] = {
            projectId: doc.projectId || null,
            projectName: doc.projectName || (projectKey === '未分配项目' ? '未分配项目' : projectKey.replace(/^name:/, '')),
            inquiry: [], quotation: [], agreement: [], contract: [],
          };
        }
        groups[projectKey][dt.key].push(doc);
        // 让 projectName 用最新的非空值
        if (doc.projectName && !groups[projectKey].projectName.startsWith(doc.projectName)) {
          groups[projectKey].projectName = doc.projectName;
        }
      });
    });
    return Object.entries(groups)
      .map(([key, group]) => ({
        key,
        name: group.projectName,
        projectId: group.projectId,
        docs: { inquiry: group.inquiry, quotation: group.quotation, agreement: group.agreement, contract: group.contract },
        total: group.inquiry.length + group.quotation.length + group.agreement.length + group.contract.length,
      }))
      .sort((a, b) => {
        if (a.name === '未分配项目') return 1;
        if (b.name === '未分配项目') return -1;
        // 当前项目置顶
        if (a.projectId === currentProjectId) return -1;
        if (b.projectId === currentProjectId) return 1;
        return b.total - a.total;
      });
  }, [refreshKey, currentProjectId]);

  // 导出项目包
  const handleExportProject = useCallback((project) => {
    const blob = new Blob([JSON.stringify({
      version: '1.0',
      exportedAt: new Date().toISOString(),
      projectName: project.name,
      ...project.docs,
    }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `项目包_${project.name}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  // 清除选中状态当切换类型
  const handleTypeSelect = useCallback((key) => {
    setSelectedType(prev => prev === key ? null : key);
    setCheckedIds(new Set());
    setViewMode('list');
  }, []);

  const cardBg = colors.card || (theme === 'dark' ? '#2d2d2d' : '#fff');
  const borderColor = colors.border || (theme === 'dark' ? '#444' : '#dee2e6');
  const textColor = colors.text || (theme === 'dark' ? '#e0e0e0' : '#212529');
  const mutedColor = colors.muted || (theme === 'dark' ? '#999' : '#6c757d');

  return (
    <div>
      {/* P0-1: 当前项目主线指示器 */}
      {currentProjectId && (
        <Card className="mb-3" style={{ backgroundColor: cardBg, borderColor: '#0d6efd', borderWidth: 2 }}>
          <Card.Body className="py-2 px-3 d-flex justify-content-between align-items-center" style={{ color: textColor }}>
            <div>
              <i className="bi bi-bookmark-check-fill me-2" style={{ color: '#0d6efd' }}></i>
              <strong style={{ fontSize: '0.9em' }}>当前项目主线</strong>
              <span className="ms-2" style={{ fontFamily: 'monospace', fontSize: '0.85em' }}>{currentProjectId}</span>
              {currentProjectName && <span className="ms-2" style={{ color: mutedColor, fontSize: '0.85em' }}>· {currentProjectName}</span>}
              <small className="ms-3" style={{ color: mutedColor }}>
                后续创建的报价/协议/合同将自动归入此项目
              </small>
            </div>
            <Button variant="outline-secondary" size="sm" onClick={clearCurrentProject} title="清除当前项目">
              <i className="bi bi-x-lg"></i>
            </Button>
          </Card.Body>
        </Card>
      )}
      {/* 统计卡片 */}
      <Row className="mb-4">
        {DOC_TYPES.map(dt => {
          const countKey = dt.key === 'inquiry' ? 'inquiries'
            : dt.key === 'quotation' ? 'quotations'
            : dt.key === 'agreement' ? 'agreements'
            : 'contracts';
          const count = stats[countKey] || 0;
          const recentKey = `recent${dt.key.charAt(0).toUpperCase()}${dt.key.slice(1)}`;
          const recentDoc = stats[recentKey];
          const isActive = selectedType === dt.key;
          return (
            <Col key={dt.key} xs={6} md={3} className="mb-3">
              <Card
                onClick={() => handleTypeSelect(dt.key)}
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
                  {recentDoc && recentDoc.createdAt && (
                    <div style={{ fontSize: '0.72em', opacity: 0.65, marginTop: 2 }}>
                      最近: {getDocAge(recentDoc.createdAt)}
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
      {/* localStorage 文档存储大小 */}
      <div className="text-end mb-2" style={{ fontSize: '0.78em', color: mutedColor }}>
        <i className="bi bi-database me-1"></i>文档存储占用: {storageSize} MB
      </div>

      {/* 工具栏 */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center gap-2">
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
          {/* 视图模式切换 */}
          {!selectedType && (
            <Nav variant="pills" activeKey={viewMode} onSelect={setViewMode} className="ms-3">
              <Nav.Item>
                <Nav.Link eventKey="list" style={{ fontSize: '0.8em', padding: '2px 10px' }}>
                  <i className="bi bi-list-ul me-1"></i>列表
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="project" style={{ fontSize: '0.8em', padding: '2px 10px' }}>
                  <i className="bi bi-folder me-1"></i>按项目
                </Nav.Link>
              </Nav.Item>
            </Nav>
          )}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {selectedType && (
            <>
              <Form.Control
                size="sm"
                type="text"
                placeholder="搜索..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                style={{ width: 160, backgroundColor: colors.inputBg, color: textColor, borderColor }}
              />
              <Button variant="outline-info" size="sm" onClick={toggleSelectAll} title={checkedIds.size === docList.length ? '取消全选' : '全选'}>
                <i className={`bi ${checkedIds.size === docList.length && docList.length > 0 ? 'bi-check-square' : 'bi-square'} me-1`}></i>
                {checkedIds.size === docList.length && docList.length > 0 ? '取消' : '全选'}
              </Button>
              {checkedIds.size > 0 && (
                <Button variant="outline-success" size="sm" onClick={handleExportSelected}>
                  <i className="bi bi-download me-1"></i>导出选中 ({checkedIds.size})
                </Button>
              )}
            </>
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
                  {/* 复选框 */}
                  <Form.Check
                    type="checkbox"
                    checked={checkedIds.has(doc.id)}
                    onChange={() => toggleCheck(doc.id)}
                    className="me-2"
                    style={{ minWidth: 20 }}
                  />
                  <div
                    style={{ minWidth: 0, flex: 1, cursor: 'pointer' }}
                    onClick={() => { setPreviewDoc(doc); setPreviewType(selectedType); }}
                    title="点击查看详情"
                  >
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
                        {doc.createdAt ? (
                          <span>{getDocAge(doc.createdAt)} ({new Date(doc.createdAt).toLocaleString('zh-CN')})</span>
                        ) : ''}
                        {doc.updatedAt && doc.updatedAt !== doc.createdAt && (
                          <span className="ms-2">更新: {getDocAge(doc.updatedAt)}</span>
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
      ) : viewMode === 'project' ? (
        /* 按项目分组视图 */
        <div>
          {projectGroups.length === 0 ? (
            <Card style={{ backgroundColor: cardBg, borderColor }}>
              <Card.Body className="text-center py-4" style={{ color: mutedColor }}>
                <i className="bi bi-folder2-open d-block mb-2" style={{ fontSize: '2rem' }}></i>
                暂无项目文档
              </Card.Body>
            </Card>
          ) : (
            projectGroups.map(project => {
              const isExpanded = selectedProject === project.key;
              const isCurrent = project.projectId && project.projectId === currentProjectId;
              return (
                <Card key={project.key} className="mb-2" style={{ backgroundColor: cardBg, borderColor: isCurrent ? '#0d6efd' : borderColor, borderWidth: isCurrent ? 2 : 1 }}>
                  <Card.Header
                    style={{ backgroundColor: cardBg, borderColor, color: textColor, cursor: 'pointer' }}
                    onClick={() => setSelectedProject(isExpanded ? null : project.key)}
                  >
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <i className={`bi ${isExpanded ? 'bi-folder2-open' : 'bi-folder'} me-2`} style={{ color: '#f0ad4e' }}></i>
                        <strong>{project.name}</strong>
                        {project.projectId && (
                          <small className="ms-2" style={{ color: mutedColor, fontFamily: 'monospace' }}>{project.projectId}</small>
                        )}
                        {isCurrent && <Badge bg="primary" className="ms-2">当前</Badge>}
                        <Badge bg="secondary" className="ms-2">{project.total}</Badge>
                      </div>
                      <div className="d-flex align-items-center gap-2">
                        {DOC_TYPES.map(dt => {
                          const cnt = project.docs[dt.key].length;
                          return cnt > 0 ? (
                            <Badge key={dt.key} style={{ backgroundColor: dt.color, fontSize: '0.7em' }}>
                              {dt.label.slice(0, 2)} {cnt}
                            </Badge>
                          ) : null;
                        })}
                        {project.projectId && !isCurrent && (
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={(e) => { e.stopPropagation(); setCurrentProject(project.projectId, project.name); }}
                            title="设为当前项目"
                          >
                            <i className="bi bi-bookmark-check me-1"></i>设为当前
                          </Button>
                        )}
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={(e) => { e.stopPropagation(); handleExportProject({ name: project.name, docs: project.docs }); }}
                          title="导出项目包"
                        >
                          <i className="bi bi-box-arrow-up me-1"></i>导出
                        </Button>
                      </div>
                    </div>
                  </Card.Header>
                  {isExpanded && (
                    <ListGroup variant="flush">
                      {DOC_TYPES.map(dt =>
                        project.docs[dt.key].map(doc => (
                          <ListGroup.Item
                            key={doc.id}
                            style={{ backgroundColor: cardBg, borderColor, color: textColor, cursor: 'pointer', paddingLeft: 24 }}
                            onClick={() => { setPreviewDoc(doc); setPreviewType(dt.key); }}
                          >
                            <div className="d-flex justify-content-between align-items-center">
                              <div>
                                <i className={`bi ${dt.icon} me-2`} style={{ color: dt.color, fontSize: '0.85em' }}></i>
                                <span style={{ fontSize: '0.9em' }}>{doc.docNumber || doc.contractNumber || doc.id}</span>
                                <Badge bg="light" text="dark" className="ms-2" style={{ fontSize: '0.65em' }}>{dt.label}</Badge>
                              </div>
                              <small style={{ color: mutedColor, fontSize: '0.75em' }}>
                                {getDocAge(doc.createdAt)}
                              </small>
                            </div>
                          </ListGroup.Item>
                        ))
                      )}
                    </ListGroup>
                  )}
                </Card>
              );
            })
          )}
        </div>
      ) : (
        /* 最近文档概览 (列表模式) */
        <Row>
          {DOC_TYPES.map(dt => {
            const recent = dt.store.getRecent(3);
            return (
              <Col key={dt.key} md={6} className="mb-3">
                <Card style={{ backgroundColor: cardBg, borderColor }} className="h-100">
                  <Card.Header
                    style={{ backgroundColor: cardBg, borderColor, color: textColor, cursor: 'pointer' }}
                    onClick={() => handleTypeSelect(dt.key)}
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
                        <ListGroup.Item
                          key={doc.id}
                          style={{ backgroundColor: cardBg, borderColor, color: textColor, fontSize: '0.85em', cursor: 'pointer' }}
                          onClick={() => { setPreviewDoc(doc); setPreviewType(dt.key); }}
                        >
                          <div className="d-flex justify-content-between">
                            <span>{doc.docNumber || doc.contractNumber || doc.projectName || doc.id}</span>
                            <small style={{ color: mutedColor }}>
                              {getDocAge(doc.createdAt)}
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

      {/* 文档预览模态框 */}
      <Modal show={!!previewDoc} onHide={() => { setPreviewDoc(null); setPreviewType(null); }} centered size="lg">
        <Modal.Header closeButton style={{ backgroundColor: cardBg, color: textColor, borderColor }}>
          <Modal.Title style={{ fontSize: '1.1rem' }}>
            <i className={`bi ${DOC_TYPES.find(t => t.key === previewType)?.icon || 'bi-file-text'} me-2`}
               style={{ color: DOC_TYPES.find(t => t.key === previewType)?.color }}></i>
            {DOC_TYPES.find(t => t.key === previewType)?.label || '文档'}详情
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: cardBg, color: textColor }}>
          {previewDoc && (
            <div>
              {/* 文档编号和状态 */}
              <div className="d-flex align-items-center gap-2 mb-3 pb-2" style={{ borderBottom: `1px solid ${borderColor}` }}>
                <h5 className="mb-0" style={{ color: DOC_TYPES.find(t => t.key === previewType)?.color }}>
                  {previewDoc.docNumber || previewDoc.contractNumber || previewDoc.id}
                </h5>
                {previewDoc.status && (
                  <Badge bg={previewDoc.status === 'submitted' ? 'success' : previewDoc.status === 'draft' ? 'warning' : 'secondary'}>
                    {previewDoc.status === 'submitted' ? '已提交' : previewDoc.status === 'draft' ? '草稿' : previewDoc.status}
                  </Badge>
                )}
              </div>
              {/* 关键字段 */}
              <Row>
                {getDocPreviewFields(previewDoc, previewType).map((field, idx) => (
                  <Col xs={6} key={idx} className="mb-3">
                    <div style={{ fontSize: '0.78em', color: mutedColor, marginBottom: 2 }}>{field.label}</div>
                    <div style={{ fontSize: '0.95em', fontWeight: 500 }}>{field.value}</div>
                  </Col>
                ))}
              </Row>
              {/* 关联文档 (文档溯源链) */}
              {(() => {
                const relations = relationStore.findRelations(previewDoc.id);
                if (relations.length === 0) return null;
                const TYPE_LABELS = { inquiry: '技术询单', quotation: '报价单', agreement: '技术协议', contract: '销售合同' };
                return (
                  <div className="mt-3 pt-2" style={{ borderTop: `1px solid ${borderColor}` }}>
                    <div style={{ fontSize: '0.85em', fontWeight: 600, marginBottom: 6 }}>
                      <i className="bi bi-diagram-3 me-1"></i>关联文档
                    </div>
                    <ListGroup variant="flush">
                      {relations.map((r, i) => {
                        const isSource = r.sourceId === previewDoc.id;
                        const linkedId = isSource ? r.targetId : r.sourceId;
                        const linkedType = isSource ? r.targetType : r.sourceType;
                        return (
                          <ListGroup.Item key={i} className="py-1 px-0" style={{ backgroundColor: 'transparent', borderColor, fontSize: '0.85em', color: textColor }}>
                            <Badge bg={r.relationType === 'derived_from' ? 'info' : 'secondary'} className="me-2">
                              {isSource ? (r.relationType === 'derived_from' ? '来源' : '关联') : (r.relationType === 'derived_from' ? '派生' : '关联')}
                            </Badge>
                            {TYPE_LABELS[linkedType] || linkedType}: <strong>{linkedId}</strong>
                          </ListGroup.Item>
                        );
                      })}
                    </ListGroup>
                  </div>
                );
              })()}
              {/* 时间信息 */}
              <div className="mt-2 pt-2" style={{ borderTop: `1px solid ${borderColor}`, fontSize: '0.8em', color: mutedColor }}>
                {previewDoc.createdAt && (
                  <span>
                    <i className="bi bi-clock me-1"></i>创建: {getDocAge(previewDoc.createdAt)} ({new Date(previewDoc.createdAt).toLocaleString('zh-CN')})
                  </span>
                )}
                {previewDoc.updatedAt && previewDoc.updatedAt !== previewDoc.createdAt && (
                  <span className="ms-3">
                    <i className="bi bi-pencil me-1"></i>更新: {getDocAge(previewDoc.updatedAt)}
                  </span>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: cardBg, borderColor }}>
          {previewDoc && previewType && (
            <Button
              variant="outline-info"
              size="sm"
              className="me-auto"
              onClick={() => setVersionDrawer({ show: true, type: previewType, doc: previewDoc })}
            >
              <i className="bi bi-clock-history me-1"></i>
              版本历史 ({listVersions(previewType, previewDoc.id).length})
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => { setPreviewDoc(null); setPreviewType(null); }}>
            关闭
          </Button>
        </Modal.Footer>
      </Modal>

      {/* P3-2: 跨四类文档统一版本历史抽屉 */}
      <VersionHistoryDrawer
        show={versionDrawer.show}
        onHide={() => setVersionDrawer({ show: false, type: null, doc: null })}
        type={versionDrawer.type}
        docId={versionDrawer.doc?.id}
        currentSnapshot={versionDrawer.doc}
        onSaveVersion={({ comment, author }) => {
          if (!versionDrawer.doc) return;
          try {
            saveVersion({ type: versionDrawer.type, docId: versionDrawer.doc.id, snapshot: versionDrawer.doc, comment, author });
            refresh();
          } catch (e) { /* ignore */ }
        }}
        onRollback={(snapshot) => {
          if (!versionDrawer.doc || !versionDrawer.type) return;
          const t = DOC_TYPES.find(dt => dt.key === versionDrawer.type);
          if (t) {
            t.store.save({ ...snapshot, id: versionDrawer.doc.id });
            refresh();
            setVersionDrawer({ show: false, type: null, doc: null });
          }
        }}
      />
    </div>
  );
};

export default DocumentDashboard;
