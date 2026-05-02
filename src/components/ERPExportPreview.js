// src/components/ERPExportPreview.js
// P2#6 (2026-04-24): ERP 同步数据预览面板
// 让销售/工程师在保存报价单前清楚看到: 哪些字段会同步到 ERP 的哪些系统
// 避免"黑盒同步"疑虑, 并提供 JSON copy 以便 ERP 侧排障

import React, { useState, useMemo } from 'react';
import { Modal, Button, Card, Badge, Alert, Form, Tabs, Tab } from 'react-bootstrap';

/**
 * 预测保存报价单时 3 处 ERP 同步目标的 payload
 * 与 src/utils/quotationManager.js 中 saveQuotation 逻辑保持一致
 */
const buildERPPayloads = (quotation, projectInfo) => {
  if (!quotation) return null;
  const now = new Date().toISOString();
  const saveId = `quotation_${Date.now()}_preview`;
  const firstItem = quotation.items?.[0] || {};
  const gearboxModel = quotation.selectedComponents?.gearbox?.model || firstItem.model || '';
  const customerName = projectInfo?.customerName || quotation.customerInfo?.name || '';
  const projectName = projectInfo?.projectName || '';

  return {
    // 目标 1: localStorage key `quotationSaves` → 本地报价单库
    local_quotationSaves: {
      _target: 'localStorage: quotationSaves',
      _purpose: '本地报价单历史 (最近 20 条, 供比较/查询)',
      id: saveId,
      name: `${projectName || '未命名项目'} - ${new Date().toLocaleDateString()}`,
      date: now,
      data: quotation, // 完整报价单对象
      projectInfo: { customerName, projectName }
    },

    // 目标 2: quotationStore (document-storage service) → 文档管理仪表板
    documentStore_quotation: {
      _target: 'documentStorage.quotationStore',
      _purpose: 'ERP 文档管理仪表板 (跨系统可见, 文档溯源链)',
      id: saveId,
      docNumber: quotation.quotationNumber || saveId,
      customerName,
      projectName,
      items: (quotation.items || []).map((it) => ({
        name: it.name,
        model: it.model,
        quantity: it.quantity,
        unitPrice: it.unitPrice,
        totalPrice: it.totalPrice
      })),
      totalAmount: quotation.totalAmount,
      status: 'draft',
      model: gearboxModel
    },

    // 目标 3: localStorage key `gearbox_quotations` → 智能报价引擎 + 趋势分析
    local_gearboxQuotations: {
      _target: 'localStorage: gearbox_quotations',
      _purpose: 'ERP 智能报价引擎 (价格趋势/客户分析, 最近 100 条)',
      id: saveId,
      date: now,
      items: (quotation.items || []).map((it) => ({
        name: it.name,
        model: it.model,
        quantity: it.quantity,
        unitPrice: it.unitPrice
      })),
      totalAmount: quotation.totalAmount,
      discountPercentage: quotation.discountPercentage || quotation.options?.discountPercentage || 10,
      customerInfo: { name: customerName },
      model: gearboxModel
    }
  };
};

/**
 * 汇总关键同步字段(跨三个目标)
 */
const summarizeFields = (payloads) => {
  if (!payloads) return [];
  return [
    { label: '报价单号', value: payloads.documentStore_quotation.docNumber, targets: ['文档仪表板'] },
    { label: '客户名称', value: payloads.local_quotationSaves.projectInfo.customerName || '(未填写)', targets: ['本地库', '文档仪表板', '智能报价'] },
    { label: '项目名称', value: payloads.local_quotationSaves.projectInfo.projectName || '(未填写)', targets: ['本地库', '文档仪表板'] },
    { label: '齿轮箱型号', value: payloads.documentStore_quotation.model, targets: ['文档仪表板', '智能报价'] },
    { label: '报价总金额', value: `¥${(payloads.documentStore_quotation.totalAmount || 0).toLocaleString()}`, targets: ['文档仪表板', '智能报价'] },
    { label: '商品行数', value: `${payloads.documentStore_quotation.items.length} 项`, targets: ['文档仪表板', '智能报价'] },
    { label: '下浮比率', value: `${payloads.local_gearboxQuotations.discountPercentage}%`, targets: ['智能报价'] },
    { label: '报价日期', value: new Date(payloads.local_quotationSaves.date).toLocaleString('zh-CN'), targets: ['全部'] }
  ];
};

const ERPExportPreview = ({ show, onHide, quotation, projectInfo, colors }) => {
  const [activeTab, setActiveTab] = useState('summary');
  const [copyStatus, setCopyStatus] = useState({});

  const payloads = useMemo(() => buildERPPayloads(quotation, projectInfo), [quotation, projectInfo]);
  const summaryFields = useMemo(() => summarizeFields(payloads), [payloads]);

  const handleCopy = async (key, payload) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
      setCopyStatus((prev) => ({ ...prev, [key]: '✓ 已复制' }));
      setTimeout(() => setCopyStatus((prev) => ({ ...prev, [key]: '' })), 2000);
    } catch (e) {
      setCopyStatus((prev) => ({ ...prev, [key]: '✗ 复制失败' }));
    }
  };

  if (!payloads) {
    return (
      <Modal show={show} onHide={onHide} centered>
        <Modal.Header closeButton><Modal.Title className="fs-6">ERP 同步预览</Modal.Title></Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <i className="bi bi-exclamation-circle me-2"></i>
            当前无报价单数据,请先生成报价单后再预览同步内容
          </Alert>
        </Modal.Body>
      </Modal>
    );
  }

  const targets = [
    { key: 'local_quotationSaves', title: '本地报价库', icon: 'bi-archive', variant: 'primary' },
    { key: 'documentStore_quotation', title: '文档仪表板', icon: 'bi-diagram-3', variant: 'success' },
    { key: 'local_gearboxQuotations', title: '智能报价引擎', icon: 'bi-graph-up', variant: 'info' }
  ];

  return (
    <Modal show={show} onHide={onHide} size="xl" centered scrollable>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6">
          <i className="bi bi-shield-check me-2"></i>
          ERP 同步数据预览 — 点击"保存报价单"时实际写入的内容
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Alert variant="light" className="small mb-3" style={{ border: '1px solid #dee2e6' }}>
          <i className="bi bi-info-circle me-2"></i>
          保存报价单时,系统会向 <strong>3 个 ERP 目标</strong>同步数据。本面板展示每个目标将收到的字段,便于您核实无误后再保存。
        </Alert>

        <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-3">
          <Tab eventKey="summary" title="字段汇总">
            <p className="small text-muted">以下是会被同步到 ERP 各系统的关键字段:</p>
            <table className="table table-sm table-bordered">
              <thead style={{ backgroundColor: colors?.headerBg || '#f8f9fa' }}>
                <tr>
                  <th>字段</th>
                  <th>值</th>
                  <th>同步到</th>
                </tr>
              </thead>
              <tbody>
                {summaryFields.map((f, i) => (
                  <tr key={i}>
                    <td><strong>{f.label}</strong></td>
                    <td style={{ wordBreak: 'break-all' }}>{String(f.value)}</td>
                    <td>
                      {f.targets.map((t) => (
                        <Badge key={t} bg="secondary" className="me-1" style={{ fontSize: '0.7rem' }}>{t}</Badge>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Tab>

          {targets.map((t) => (
            <Tab key={t.key} eventKey={t.key} title={<><i className={`bi ${t.icon} me-1`}></i>{t.title}</>}>
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center">
                  <div>
                    <Badge bg={t.variant}>{t.title}</Badge>
                    <span className="ms-2 small text-muted">{payloads[t.key]._target}</span>
                  </div>
                  <Button
                    size="sm"
                    variant="outline-secondary"
                    onClick={() => handleCopy(t.key, payloads[t.key])}
                  >
                    <i className="bi bi-clipboard me-1"></i>
                    {copyStatus[t.key] || '复制 JSON'}
                  </Button>
                </Card.Header>
                <Card.Body className="p-2">
                  <div className="small text-muted mb-2">
                    <i className="bi bi-bullseye me-1"></i>{payloads[t.key]._purpose}
                  </div>
                  <Form.Control
                    as="textarea"
                    readOnly
                    value={JSON.stringify(payloads[t.key], null, 2)}
                    style={{
                      fontFamily: 'Menlo, Consolas, monospace',
                      fontSize: '0.78rem',
                      minHeight: 320,
                      backgroundColor: '#f8f9fa'
                    }}
                  />
                </Card.Body>
              </Card>
            </Tab>
          ))}
        </Tabs>

        <Alert variant="info" className="small mt-3 mb-0">
          <i className="bi bi-lightbulb me-2"></i>
          <strong>提示:</strong> 本面板为只读预览,关闭即可。实际同步发生在您点击"保存报价单"按钮时;若发现字段异常,请先返回修正报价单再保存。
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          <i className="bi bi-x-lg me-1"></i> 关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ERPExportPreview;
