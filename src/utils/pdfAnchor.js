// 2026-05-23 P2-11: 杭齿 2025-05 选型手册 PDF 锚点工具
// 与 ERP 仓 public/js/pdf-anchor-util.js 算法等价 (data 来自 src/data/manualPdfMeta.js)
//
// 用法:
//   import { modelPdfPage, seriesPdfPage, pdfHrefForModel, MANUAL_PDF_URL } from '@/utils/pdfAnchor';
//   const page = modelPdfPage('HC600A', 'HC'); // → 6 (audit-verified 精确页)
//   const url  = pdfHrefForModel('HC600A', 'HC'); // → /docs/manuals/...pdf#page=6
//
// SPA 内通常 PDF 不在 SPA 域名下, 而是部署到 nginx /docs/manuals/, MANUAL_PDF_URL 走绝对路径或 BASE_URL 拼接

import { MANUAL_PDF_META } from '../data/manualPdfMeta';

// 默认 PDF URL — SPA build 后跑在 /gearbox-app/ 路径下, PDF 部署到 /docs/manuals/
// 如果 SPA 直接打开 PDF, 用户需先有 nginx /docs/ 路由, 否则给 fallback 提示
export const MANUAL_PDF_URL = MANUAL_PDF_META.url;
export const MANUAL_PDF_VERSION = MANUAL_PDF_META.version;
export const MANUAL_PDF_PAGE_COUNT = MANUAL_PDF_META.pageCount;

const SERIES_PAGES = MANUAL_PDF_META.seriesPages || {};
const MODEL_PAGES = MANUAL_PDF_META.modelPages || {};
const CHAPTER_PAGES = MANUAL_PDF_META.chapterPages || {};

/**
 * 系列代码 → PDF 章节起始页
 * 优先 seriesPages (38 series_code 全覆盖), 再 chapterPages (按中文章节名), 再前缀匹配
 * @param {string} series — series_code 如 'HCT' 或 series 中文名 '中小功率系列'
 * @returns {number | null}
 */
export function seriesPdfPage(series) {
  if (!series) return null;
  if (SERIES_PAGES[series] && SERIES_PAGES[series].start != null) return SERIES_PAGES[series].start;
  if (CHAPTER_PAGES[series] != null) return CHAPTER_PAGES[series];
  for (const key in CHAPTER_PAGES) {
    if (Object.prototype.hasOwnProperty.call(CHAPTER_PAGES, key) && String(series).indexOf(key) === 0) {
      return CHAPTER_PAGES[key];
    }
  }
  return null;
}

/**
 * 具体型号 → PDF 精确页 (audit-verified 107 型号), 否则降级 series 起始页
 * @param {string} model — 型号代号, 如 'HC600A'
 * @param {string} [seriesCode] — 可选, 用于 fallback
 * @returns {number | null}
 */
export function modelPdfPage(model, seriesCode) {
  if (!model) return seriesCode ? seriesPdfPage(seriesCode) : null;
  if (MODEL_PAGES[model] != null) return MODEL_PAGES[model];
  // 去变体后缀 (如 'HC600A(倾角7°)' → 'HC600A')
  const stripped = String(model).replace(/[（(].*?[)）]/g, '').trim();
  if (stripped !== model && MODEL_PAGES[stripped] != null) return MODEL_PAGES[stripped];
  return seriesCode ? seriesPdfPage(seriesCode) : null;
}

/**
 * 构造可点击的 PDF 链接 (Adobe / Chrome 都认 #page=N)
 * @param {string} model
 * @param {string} [seriesCode]
 * @returns {string | null}
 */
export function pdfHrefForModel(model, seriesCode) {
  const pg = modelPdfPage(model, seriesCode);
  if (!pg) return null;
  return MANUAL_PDF_URL + '#page=' + pg;
}

/**
 * 判定该型号在 PDF 中是否有 audit-verified 精确页 (vs 章节 fallback)
 * @param {string} model
 * @returns {boolean}
 */
export function isExactModelPage(model) {
  return !!(model && MODEL_PAGES[model] != null);
}

/**
 * 获取该型号的完整 PDF audit 记录 (含 verified_ratios/capacities/note/fix)
 * @param {string} model
 * @returns {object | null}
 */
export function getModelPdfRecord(model) {
  if (!model || !MODEL_PAGES[model]) return null;
  return {
    page: MODEL_PAGES[model],
    isExact: true
  };
}
