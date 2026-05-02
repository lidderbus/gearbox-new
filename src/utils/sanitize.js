// src/utils/sanitize.js
// 统一 HTML 净化层 — 包装 DOMPurify, 配置面向打印/导出/预览三种场景
//
// 使用规则:
// - 任何 dangerouslySetInnerHTML 或 element.innerHTML 赋值 必须 走本模块,不允许直接传原始字符串
// - 用户输入字段(客户名/项目名/备注/导入数据)在拼入 HTML 模板前用 escapeHtml 转义
// - sanitizeHtml 供"完整 HTML 文档片段"使用(协议/报告); sanitizeInline 供"行内片段"使用(高亮/标记)

import DOMPurify from 'dompurify';

// 完整 HTML 片段净化 (协议、报告、打印模板)
// 允许常见结构标签 + style 属性, 禁止 script/iframe/onclick 等
export function sanitizeHtml(dirty) {
  if (dirty == null) return '';
  return DOMPurify.sanitize(String(dirty), {
    USE_PROFILES: { html: true },
    ADD_ATTR: ['target', 'colspan', 'rowspan'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'base'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'formaction']
  });
}

// 行内片段净化 (搜索高亮、徽章、tooltip)
// 禁所有结构性标签, 仅允许 b/i/em/strong/mark/span
export function sanitizeInline(dirty) {
  if (dirty == null) return '';
  return DOMPurify.sanitize(String(dirty), {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'mark', 'span'],
    ALLOWED_ATTR: ['class', 'style']
  });
}

// 字符串硬转义 (用于把用户输入拼入 HTML 模板字符串)
// 比如 `<h1>${escapeHtml(customerName)}</h1>`
export function escapeHtml(s) {
  if (s == null) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
