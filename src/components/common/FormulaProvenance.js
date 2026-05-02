// P0-2: 公式/标准条文溯源浮层 — 让校核结果可点击查看公式与规范出处
import React, { useState } from 'react';
import { OverlayTrigger, Popover } from 'react-bootstrap';

/**
 * @param {Object} props
 * @param {string} props.title - 校核项名称, 如 "齿轮接触强度"
 * @param {string} props.formula - 公式文本 (LaTeX-lite, 例如 "σH = ZH·ZE·...")
 * @param {string} props.standard - 标准代号, 如 "ISO 6336-2"
 * @param {string} [props.section] - 章节, 如 "§7.2"
 * @param {string} [props.page] - 页码或位置
 * @param {string} [props.notes] - 推导备注
 * @param {string} [props.doi] - DOI 或 URL
 * @param {React.ReactNode} [props.children] - 触发器,默认 ℹ️ 图标
 * @param {string} [props.placement] - 浮层位置
 */
const FormulaProvenance = ({
  title,
  formula,
  standard,
  section,
  page,
  notes,
  doi,
  children,
  placement = 'auto',
}) => {
  const [show, setShow] = useState(false);

  const popover = (
    <Popover id={`fp-${(title || 'formula').replace(/\s+/g, '-')}`} style={{ maxWidth: 480 }}>
      <Popover.Header style={{ fontSize: '0.85em' }}>
        <i className="bi bi-info-circle me-1"></i>
        {title || '公式溯源'}
      </Popover.Header>
      <Popover.Body style={{ fontSize: '0.82em' }}>
        {formula && (
          <div className="mb-2">
            <div style={{ fontSize: '0.78em', color: '#888', fontWeight: 600, marginBottom: 2 }}>公式</div>
            <code style={{ display: 'block', whiteSpace: 'pre-wrap', backgroundColor: '#f6f8fa', padding: '6px 8px', borderRadius: 4, fontSize: '0.92em' }}>
              {formula}
            </code>
          </div>
        )}
        {standard && (
          <div className="mb-2">
            <div style={{ fontSize: '0.78em', color: '#888', fontWeight: 600, marginBottom: 2 }}>依据标准</div>
            <div>
              <strong>{standard}</strong>
              {section && <span className="ms-1" style={{ color: '#555' }}>{section}</span>}
              {page && <span className="ms-1" style={{ color: '#888', fontSize: '0.9em' }}>(p.{page})</span>}
            </div>
          </div>
        )}
        {notes && (
          <div className="mb-2">
            <div style={{ fontSize: '0.78em', color: '#888', fontWeight: 600, marginBottom: 2 }}>推导备注</div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{notes}</div>
          </div>
        )}
        {doi && (
          <div>
            <div style={{ fontSize: '0.78em', color: '#888', fontWeight: 600, marginBottom: 2 }}>原始文献</div>
            <a href={doi} target="_blank" rel="noopener noreferrer">{doi}</a>
          </div>
        )}
      </Popover.Body>
    </Popover>
  );

  return (
    <OverlayTrigger
      trigger={['hover', 'focus', 'click']}
      placement={placement}
      overlay={popover}
      show={show}
      onToggle={setShow}
      rootClose
    >
      <span
        style={{ cursor: 'help', color: '#0d6efd', marginLeft: 4 }}
        role="button"
        tabIndex={0}
        aria-label={`查看 ${title || '公式'} 出处`}
      >
        {children || <i className="bi bi-info-circle"></i>}
      </span>
    </OverlayTrigger>
  );
};

export default FormulaProvenance;
