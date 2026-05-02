// src/components/FatalScreen.js
// 启动数据校验硬阻断屏 — A4 投产硬阻断
// 当 loadAndRepairData 抛错时, 显示明细让工程师可定位, 而非笼统"应用启动失败"

import React, { useMemo, useState } from 'react';

const containerStyle = {
  minHeight: '100vh',
  background: '#fff7f7',
  color: '#222',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Microsoft YaHei", sans-serif'
};

const cardStyle = {
  maxWidth: 720,
  width: '100%',
  background: '#fff',
  border: '1px solid #f0c0c0',
  borderRadius: 12,
  boxShadow: '0 8px 24px rgba(192, 0, 0, 0.08)',
  padding: '28px 32px'
};

const titleStyle = {
  margin: 0,
  fontSize: 22,
  color: '#b00020',
  fontWeight: 700
};

const subTitleStyle = {
  marginTop: 8,
  marginBottom: 16,
  fontSize: 14,
  color: '#666'
};

const buttonRowStyle = {
  marginTop: 20,
  display: 'flex',
  gap: 10,
  flexWrap: 'wrap'
};

const primaryBtn = {
  background: '#1976d2',
  color: '#fff',
  border: 0,
  borderRadius: 6,
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: 14
};

const secondaryBtn = {
  background: '#fff',
  color: '#1976d2',
  border: '1px solid #1976d2',
  borderRadius: 6,
  padding: '8px 16px',
  cursor: 'pointer',
  fontSize: 14
};

const detailsStyle = {
  marginTop: 16,
  background: '#fafafa',
  border: '1px solid #eee',
  borderRadius: 6,
  padding: 12,
  fontSize: 12,
  color: '#444',
  fontFamily: 'Menlo, Consolas, monospace',
  maxHeight: 320,
  overflow: 'auto'
};

const errorListItem = {
  margin: '4px 0',
  paddingLeft: 8,
  borderLeft: '2px solid #f5b5b5'
};

const MAX_DETAIL_LINES = 10;

const extractInvalidItems = (errorDetails) => {
  if (!errorDetails) return [];
  const lines = [];
  const validation = errorDetails.validation;
  if (validation && validation.details) {
    Object.keys(validation.details).forEach((key) => {
      const collection = validation.details[key];
      if (collection && Array.isArray(collection.invalidItems)) {
        collection.invalidItems.forEach((item) => {
          const errs = (item.errors || []).join('; ');
          lines.push(`[${collection.name || key}] ${item.model || `#${item.originalIndex}`}: ${errs}`);
        });
      }
    });
  }
  if (Array.isArray(errorDetails.repairErrors)) {
    errorDetails.repairErrors.forEach((line) => lines.push(`[修复错误] ${line}`));
  }
  return lines;
};

const FatalScreen = ({ error, onRetry }) => {
  const [showAll, setShowAll] = useState(false);
  const allLines = useMemo(() => extractInvalidItems(error?.details), [error]);
  const visibleLines = showAll ? allLines : allLines.slice(0, MAX_DETAIL_LINES);
  const hasMore = allLines.length > MAX_DETAIL_LINES;
  const summary = error?.details?.validation?.summary;

  const copyDetails = () => {
    const payload = JSON.stringify({
      message: error?.message || '',
      summary,
      lines: allLines
    }, null, 2);
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(payload).catch(() => {});
    }
  };

  return (
    <div style={containerStyle} role="alert" aria-live="assertive">
      <div style={cardStyle}>
        <h1 style={titleStyle}>数据校验未通过, 应用已被阻止启动</h1>
        <div style={subTitleStyle}>
          这是一项投产前的硬性安全检查, 防止异常数据被分发到生产用户。请联系系统管理员处理后再重启应用。
        </div>
        {summary && (
          <div style={{ marginBottom: 12, fontSize: 13 }}>
            <strong>校验摘要:</strong> 总数 {summary.total}, 失败 {summary.invalid}, 警告 {summary.warnings}
          </div>
        )}
        <div style={{ fontSize: 13, color: '#b00020', marginBottom: 8 }}>
          <strong>错误信息:</strong> {error?.message || '未知错误'}
        </div>
        {visibleLines.length > 0 && (
          <details open style={{ marginTop: 8 }}>
            <summary style={{ cursor: 'pointer', fontSize: 13, color: '#444' }}>
              校验失败明细 ({visibleLines.length}{hasMore && !showAll ? `/${allLines.length}` : ''})
            </summary>
            <div style={detailsStyle}>
              {visibleLines.map((line, idx) => (
                <div key={idx} style={errorListItem}>{line}</div>
              ))}
              {hasMore && !showAll && (
                <button type="button" style={{ ...secondaryBtn, marginTop: 8 }} onClick={() => setShowAll(true)}>
                  展开全部 {allLines.length} 条
                </button>
              )}
            </div>
          </details>
        )}
        <div style={buttonRowStyle}>
          <button type="button" style={primaryBtn} onClick={onRetry || (() => window.location.reload())}>
            重新加载
          </button>
          <button type="button" style={secondaryBtn} onClick={copyDetails}>
            复制详情发管理员
          </button>
        </div>
        <div style={{ marginTop: 16, fontSize: 12, color: '#888' }}>
          联系管理员: lidderbus@gmail.com · 发送时附上"复制详情"内容以便快速定位
        </div>
      </div>
    </div>
  );
};

export default FatalScreen;
