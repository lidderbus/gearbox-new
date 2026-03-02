// src/components/ClauseKnowledgeBase/ClauseDetailModal.js
// 条款详情弹窗组件

import React, { useState } from 'react';
import { Modal, Badge, Button, Alert } from 'react-bootstrap';

// 分类图标映射
const categoryIcons = {
  pump: 'bi-droplet-half',
  valve: 'bi-sliders',
  cooling: 'bi-snow',
  control: 'bi-gear-wide-connected',
  safety: 'bi-shield-check',
  testing: 'bi-clipboard-check',
  structure: 'bi-diagram-3',
  installation: 'bi-tools',
  lubrication: 'bi-droplet',
  accessories: 'bi-box-seam',
  maintenance: 'bi-wrench-adjustable',
  troubleshooting: 'bi-exclamation-diamond'
};

// 分类名称映射
const categoryNames = {
  pump: '泵与液压',
  valve: '阀门与管路',
  cooling: '冷却系统',
  control: '控制系统',
  safety: '安全要求',
  testing: '测试验收',
  structure: '产品结构',
  installation: '安装校正',
  lubrication: '润滑系统',
  accessories: '附件规格',
  maintenance: '维护保养',
  troubleshooting: '故障排除'
};

// 分类颜色映射
const categoryColors = {
  pump: 'primary',
  valve: 'info',
  cooling: 'success',
  control: 'warning',
  safety: 'danger',
  testing: 'secondary',
  structure: 'dark',
  installation: 'primary',
  lubrication: 'info',
  accessories: 'success',
  maintenance: 'warning',
  troubleshooting: 'danger'
};

/**
 * 条款详情弹窗组件
 * 展示条款的完整信息，支持复制
 */
const ClauseDetailModal = ({ show, onHide, clause, colors }) => {
  const [copied, setCopied] = useState(false);
  const [copiedSection, setCopiedSection] = useState('');

  if (!clause) return null;

  // 复制文本到剪贴板
  const copyToClipboard = async (text, section = 'content') => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setCopiedSection(section);
      setTimeout(() => {
        setCopied(false);
        setCopiedSection('');
      }, 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 复制完整条款
  const copyFullClause = () => {
    let text = `【${clause.title}】\n\n${clause.content}`;

    if (clause.variants && clause.variants.length > 0) {
      text += '\n\n【变体条款】\n';
      clause.variants.forEach((v, i) => {
        text += `${i + 1}. ${v.condition}: ${v.text}\n`;
      });
    }

    if (clause.references && clause.references.length > 0) {
      text += `\n参考标准: ${clause.references.join(', ')}`;
    }

    copyToClipboard(text, 'full');
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      className="clause-detail-modal"
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: colors?.headerBg,
          borderColor: colors?.border
        }}
      >
        <Modal.Title style={{ color: colors?.headerText }}>
          <Badge bg={categoryColors[clause.category]} className="me-2">
            <i className={`${categoryIcons[clause.category]} me-1`}></i>
            {categoryNames[clause.category]}
          </Badge>
          {clause.title}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: colors?.card }}>
        {/* 复制成功提示 */}
        {copied && (
          <Alert variant="success" className="py-2 mb-3">
            <i className="bi bi-check-circle me-2"></i>
            {copiedSection === 'full' ? '完整条款已复制到剪贴板' : '内容已复制到剪贴板'}
          </Alert>
        )}

        {/* 条款ID和适用系列 */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <small className="text-muted">
            条款编号: <code>{clause.id}</code>
          </small>
          <div>
            {clause.applicableSeries && clause.applicableSeries.map((series, idx) => (
              <Badge key={idx} bg="outline-primary" className="me-1" style={{
                border: '1px solid #0d6efd',
                color: '#0d6efd',
                backgroundColor: 'transparent'
              }}>
                {series}
              </Badge>
            ))}
          </div>
        </div>

        {/* 条款内容 */}
        <div className="clause-detail-section">
          <h6>
            <i className="bi bi-file-text me-2"></i>
            条款内容
            <Button
              variant="link"
              size="sm"
              className="float-end py-0"
              onClick={() => copyToClipboard(clause.content, 'content')}
              title="复制内容"
            >
              <i className={`bi ${copiedSection === 'content' && copied ? 'bi-check' : 'bi-clipboard'}`}></i>
            </Button>
          </h6>
          <div
            className="clause-detail-content p-3 rounded"
            style={{
              backgroundColor: colors?.inputBg || '#f8f9fa',
              color: colors?.text
            }}
          >
            {clause.content}
          </div>
        </div>

        {/* 变体条款 */}
        {clause.variants && clause.variants.length > 0 && (
          <div className="clause-detail-section">
            <h6>
              <i className="bi bi-diagram-3 me-2"></i>
              变体条款
            </h6>
            {clause.variants.map((variant, idx) => (
              <div key={idx} className="clause-variant-item">
                <div className="clause-variant-condition mb-1">
                  <i className="bi bi-arrow-right-circle me-1"></i>
                  {variant.condition}
                </div>
                <div style={{ color: colors?.text }}>
                  {variant.text}
                </div>
                <Button
                  variant="link"
                  size="sm"
                  className="p-0 mt-1"
                  onClick={() => copyToClipboard(variant.text, `variant-${idx}`)}
                >
                  <i className={`bi ${copiedSection === `variant-${idx}` && copied ? 'bi-check' : 'bi-clipboard'} me-1`}></i>
                  复制此变体
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* 技术参数 */}
        {clause.technicalParams && Object.keys(clause.technicalParams).length > 0 && (
          <div className="clause-detail-section">
            <h6>
              <i className="bi bi-speedometer2 me-2"></i>
              技术参数
            </h6>
            <div className="p-2 rounded" style={{ backgroundColor: colors?.inputBg || '#f0f7ff', fontSize: '0.9rem' }}>
              {Object.entries(clause.technicalParams).map(([key, value], idx) => (
                <div key={idx} className="d-flex mb-1">
                  <span className="text-muted me-2" style={{ minWidth: '120px' }}>{key}:</span>
                  <span style={{ color: colors?.text }}><strong>{String(value)}</strong></span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 关键词 */}
        {clause.keywords && clause.keywords.length > 0 && (
          <div className="clause-detail-section">
            <h6>
              <i className="bi bi-tags me-2"></i>
              关键词
            </h6>
            <div>
              {clause.keywords.map((keyword, idx) => (
                <Badge key={idx} bg="secondary" className="me-1 mb-1">
                  {keyword}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 参考标准 */}
        {clause.references && clause.references.length > 0 && (
          <div className="clause-detail-section">
            <h6>
              <i className="bi bi-book me-2"></i>
              参考标准
            </h6>
            <div>
              {clause.references.map((ref, idx) => (
                <Badge key={idx} bg="light" text="dark" className="me-1 mb-1">
                  <i className="bi bi-journal-text me-1"></i>
                  {ref}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 数据来源与重要性 */}
        <div className="clause-detail-section mb-0 d-flex justify-content-between align-items-center">
          {clause.source && (
            <small className="text-muted">
              <i className="bi bi-journal-text me-1"></i>
              来源: {clause.source}
            </small>
          )}
          {clause.importance && (
            <Badge bg={clause.importance === 'critical' ? 'danger' : clause.importance === 'mandatory' ? 'primary' : 'secondary'}>
              {clause.importance === 'critical' ? '关键' : clause.importance === 'mandatory' ? '必须' : clause.importance === 'conditional' ? '条件性' : '推荐'}
            </Badge>
          )}
          {clause.lastUsed && (
            <small className="text-muted">
              <i className="bi bi-clock-history me-1"></i>
              最近使用: {clause.lastUsed}
            </small>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer
        style={{
          backgroundColor: colors?.headerBg,
          borderColor: colors?.border
        }}
      >
        <Button variant="outline-secondary" onClick={onHide}>
          关闭
        </Button>
        <Button variant="primary" onClick={copyFullClause}>
          <i className="bi bi-clipboard me-1"></i>
          复制完整条款
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClauseDetailModal;
