// src/components/ClauseKnowledgeBase/ClauseCompareView.js
// 多条款对比视图组件

import React, { useState } from 'react';
import { Modal, Table, Badge, Button, Alert } from 'react-bootstrap';

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
 * 多条款对比视图组件
 * 并排对比选中的条款
 */
const ClauseCompareView = ({ show, onHide, clauses, colors, categories }) => {
  const [copied, setCopied] = useState(false);

  if (!clauses || clauses.length < 2) return null;

  // 复制所有条款
  const copyAllClauses = async () => {
    let text = '【条款对比】\n\n';
    clauses.forEach((clause, idx) => {
      text += `=== ${idx + 1}. ${clause.title} ===\n`;
      text += `分类: ${categoryNames[clause.category]}\n`;
      text += `内容: ${clause.content}\n`;
      if (clause.references && clause.references.length > 0) {
        text += `参考标准: ${clause.references.join(', ')}\n`;
      }
      text += '\n';
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('复制失败:', err);
    }
  };

  // 对比行数据
  const compareRows = [
    {
      label: '分类',
      icon: 'bi-folder',
      render: (clause) => (
        <Badge bg={categoryColors[clause.category]}>
          {categoryNames[clause.category]}
        </Badge>
      )
    },
    {
      label: '条款内容',
      icon: 'bi-file-text',
      render: (clause) => (
        <div style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>
          {clause.content}
        </div>
      )
    },
    {
      label: '变体条款',
      icon: 'bi-diagram-3',
      render: (clause) => (
        clause.variants && clause.variants.length > 0 ? (
          <ul className="mb-0 ps-3" style={{ fontSize: '0.85rem' }}>
            {clause.variants.map((v, i) => (
              <li key={i}>
                <strong>{v.condition}:</strong> {v.text}
              </li>
            ))}
          </ul>
        ) : (
          <span className="text-muted">无变体</span>
        )
      )
    },
    {
      label: '适用系列',
      icon: 'bi-collection',
      render: (clause) => (
        <div>
          {clause.applicableSeries && clause.applicableSeries.map((s, i) => (
            <Badge key={i} bg="outline-secondary" className="me-1" style={{
              border: '1px solid #6c757d',
              color: '#6c757d',
              backgroundColor: 'transparent',
              fontSize: '0.75rem'
            }}>
              {s}
            </Badge>
          ))}
        </div>
      )
    },
    {
      label: '关键词',
      icon: 'bi-tags',
      render: (clause) => (
        <div>
          {clause.keywords && clause.keywords.map((k, i) => (
            <Badge key={i} bg="light" text="dark" className="me-1 mb-1" style={{ fontSize: '0.7rem' }}>
              {k}
            </Badge>
          ))}
        </div>
      )
    },
    {
      label: '参考标准',
      icon: 'bi-book',
      render: (clause) => (
        clause.references && clause.references.length > 0 ? (
          <div>
            {clause.references.map((r, i) => (
              <Badge key={i} bg="secondary" className="me-1" style={{ fontSize: '0.7rem' }}>
                {r}
              </Badge>
            ))}
          </div>
        ) : (
          <span className="text-muted">无</span>
        )
      )
    }
  ];

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      className="clause-compare-modal"
      fullscreen="lg-down"
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: colors?.headerBg,
          borderColor: colors?.border
        }}
      >
        <Modal.Title style={{ color: colors?.headerText }}>
          <i className="bi bi-columns-gap me-2"></i>
          条款对比 ({clauses.length} 条)
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{ backgroundColor: colors?.card }}
        className="p-0"
      >
        {/* 复制成功提示 */}
        {copied && (
          <Alert variant="success" className="m-3 py-2">
            <i className="bi bi-check-circle me-2"></i>
            所有条款已复制到剪贴板
          </Alert>
        )}

        <div className="clause-compare-view">
          <Table bordered responsive className="clause-compare-table mb-0">
            {/* 表头 - 条款标题 */}
            <thead>
              <tr>
                <th
                  style={{
                    width: '120px',
                    backgroundColor: colors?.headerBg,
                    color: colors?.headerText
                  }}
                >
                  对比项目
                </th>
                {clauses.map((clause, idx) => (
                  <th
                    key={clause.id}
                    className="clause-compare-header"
                    style={{
                      backgroundColor: colors?.headerBg,
                      color: colors?.headerText,
                      minWidth: '250px'
                    }}
                  >
                    <div className="d-flex flex-column align-items-center">
                      <Badge bg={categoryColors[clause.category]} className="mb-1">
                        {categoryNames[clause.category]}
                      </Badge>
                      <span style={{ fontSize: '0.9rem' }}>{clause.title}</span>
                      <small className="text-muted">{clause.id}</small>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* 表体 - 对比内容 */}
            <tbody>
              {compareRows.map((row, rowIdx) => (
                <tr key={rowIdx}>
                  <th
                    style={{
                      backgroundColor: colors?.headerBg,
                      color: colors?.headerText,
                      verticalAlign: 'middle'
                    }}
                  >
                    <i className={`bi ${row.icon} me-1`}></i>
                    {row.label}
                  </th>
                  {clauses.map((clause) => (
                    <td
                      key={clause.id}
                      className="clause-compare-cell"
                      style={{ backgroundColor: colors?.card }}
                    >
                      {row.render(clause)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Modal.Body>

      <Modal.Footer
        style={{
          backgroundColor: colors?.headerBg,
          borderColor: colors?.border
        }}
      >
        <small className="text-muted me-auto">
          提示: 选择相似分类的条款进行对比效果更好
        </small>
        <Button variant="outline-secondary" onClick={onHide}>
          关闭
        </Button>
        <Button variant="primary" onClick={copyAllClauses}>
          <i className="bi bi-clipboard me-1"></i>
          复制全部
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ClauseCompareView;
