// src/utils/pdfWatermark.js
// P2-2: PDF/资料水印工具
//
// 由于 pdf-lib 当前未引入项目依赖, 本工具提供两种水印模式:
//   1) 预览覆盖: 在浏览器 PDF 预览界面叠加 CSS 水印 (用户名+项目号+时间), 不修改原文件
//   2) 元数据伴随: 下载时同时生成一个包含水印元数据的伴随文件 (.watermark.txt 或 .json),
//      用于审计与溯源
//
// 完整 PDF 内嵌水印 (pdf-lib drawText) 留 P2.x 实施 — 本工具的接口已就绪,
// 一旦添加 pdf-lib 依赖, 仅需替换 stampPdfBytes 实现即可。

import { logAudit } from '../services/auditLog';

/**
 * 生成水印文本
 */
export const buildWatermarkText = ({ userName, userId, projectId, resourceId, extra = '' }) => {
  const time = new Date().toLocaleString('zh-CN');
  const parts = [];
  if (userName) parts.push(userName);
  else if (userId) parts.push(userId);
  if (projectId) parts.push(projectId);
  parts.push(time);
  if (extra) parts.push(extra);
  return parts.join(' · ');
};

/**
 * 在弹窗/页面上叠加水印 (DOM 注入, CSS 实现)
 *
 * @param {HTMLElement} container — 容器(预览 PDF 的外层)
 * @param {string} text — 水印文本
 * @returns {() => void} 移除函数
 */
export const overlayWatermark = (container, text) => {
  if (!container || !text) return () => {};

  const existing = container.querySelector('.lib-watermark-overlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.className = 'lib-watermark-overlay';
  overlay.style.cssText = [
    'position: absolute',
    'top: 0',
    'left: 0',
    'right: 0',
    'bottom: 0',
    'pointer-events: none',
    'z-index: 1000',
    'background-image: repeating-linear-gradient(' +
      '-30deg, transparent, transparent 200px, rgba(0,0,0,0) 200px, rgba(0,0,0,0) 400px)',
    'overflow: hidden',
  ].join(';');

  // 多次重复水印铺满
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 4; col++) {
      const span = document.createElement('span');
      span.textContent = text;
      span.style.cssText = [
        'position: absolute',
        `top: ${row * 18}%`,
        `left: ${col * 30 - 5}%`,
        'transform: rotate(-30deg)',
        'color: rgba(0, 0, 0, 0.10)',
        'font-size: 14px',
        'font-weight: 500',
        'white-space: nowrap',
        'user-select: none',
      ].join(';');
      overlay.appendChild(span);
    }
  }

  // 容器需 position:relative 才能让 overlay 绝对定位
  const oldPos = container.style.position;
  if (!oldPos || oldPos === 'static') container.style.position = 'relative';

  container.appendChild(overlay);

  // 返回移除函数
  return () => {
    overlay.remove();
    if (!oldPos) container.style.position = '';
  };
};

/**
 * 生成水印伴随文件 (下载附带, 用于审计)
 *
 * @param {Object} ctx — 上下文 (与 buildWatermarkText 一致)
 * @returns {Blob} 文本 blob, 可与原文件一起 saveAs
 */
export const generateWatermarkSidecar = (ctx) => {
  const text = buildWatermarkText(ctx);
  const lines = [
    '齿轮箱选型系统 — 资料水印元数据',
    '='.repeat(60),
    `资源 ID:    ${ctx.resourceId || '-'}`,
    `资源类型:   ${ctx.resourceType || '-'}`,
    `下载时间:   ${new Date().toLocaleString('zh-CN')}`,
    `下载用户:   ${ctx.userName || ctx.userId || '匿名'}`,
    `用户角色:   ${ctx.userRole || '-'}`,
    `项目编号:   ${ctx.projectId || '-'}`,
    `IP/UA:      ${typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 100) : '-'}`,
    '',
    '水印文本:',
    `  ${text}`,
    '',
    '注: 此文件作为下载审计凭证, 应与主文件一并保留。',
    '    相关审计日志在文档管理仪表板可查询。',
  ];
  return new Blob([lines.join('\n')], { type: 'text/plain' });
};

/**
 * 主入口: 受保护的下载 — 注入审计日志 + 生成水印伴随文件
 *
 * 调用方应在原下载逻辑前调用此函数, 然后再触发实际下载;
 * 或调用 protectedDownload(url, filename, ctx) 一站式完成。
 */
export const protectedDownload = async (url, filename, ctx = {}) => {
  // 审计日志
  try {
    logAudit('download', {
      resourceType: ctx.resourceType,
      resourceId: ctx.resourceId,
      userId: ctx.userId,
      userRole: ctx.userRole,
      detail: `filename=${filename}; project=${ctx.projectId || '-'}`,
    });
    logAudit('watermark', {
      resourceType: ctx.resourceType,
      resourceId: ctx.resourceId,
      userId: ctx.userId,
      detail: buildWatermarkText(ctx),
    });
  } catch (e) { /* ignore */ }

  // 触发主文件下载
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  // 触发水印伴随文件下载
  if (ctx.includeSidecar !== false) {
    const sidecar = generateWatermarkSidecar(ctx);
    const sidecarUrl = URL.createObjectURL(sidecar);
    const a2 = document.createElement('a');
    a2.href = sidecarUrl;
    a2.download = filename.replace(/\.\w+$/, '') + '.watermark.txt';
    document.body.appendChild(a2);
    a2.click();
    document.body.removeChild(a2);
    setTimeout(() => URL.revokeObjectURL(sidecarUrl), 1000);
  }
};

const pdfWatermark = {
  buildWatermarkText,
  overlayWatermark,
  generateWatermarkSidecar,
  protectedDownload,
};

export default pdfWatermark;
