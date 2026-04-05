// src/utils/unifiedExporter.js
// 统一导出工具 — CSV/XLSX/打印 三合一
import { printHtmlContent } from './pdfExportUtils';

const BOM = '\uFEFF';

/**
 * CSV导出
 * @param {Object} options
 * @param {string} options.filename - 文件名(不含扩展名)
 * @param {string[]} options.headers - 列标题
 * @param {Array<Array>} options.rows - 数据行(二维数组)
 */
export function exportCSV({ filename, headers, rows }) {
  const lines = [headers.join(',')];
  rows.forEach(row => {
    lines.push(row.map(cell => {
      const s = String(cell ?? '');
      return s.includes(',') || s.includes('"') || s.includes('\n')
        ? `"${s.replace(/"/g, '""')}"` : s;
    }).join(','));
  });
  const blob = new Blob([BOM + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * XLSX导出
 * @param {Object} options
 * @param {string} options.filename - 文件名
 * @param {Array<{name: string, headers: string[], rows: Array<Array>}>} options.sheets - 多Sheet数据
 */
export async function exportXLSX({ filename, sheets }) {
  const { loadXLSX } = await import('./dynamicImports');
  const XLSX = await loadXLSX();
  const wb = XLSX.utils.book_new();
  sheets.forEach(sheet => {
    const data = [sheet.headers, ...sheet.rows];
    const ws = XLSX.utils.aoa_to_sheet(data);
    // Auto column widths
    ws['!cols'] = sheet.headers.map((h, i) => {
      const maxLen = Math.max(h.length, ...sheet.rows.map(r => String(r[i] ?? '').length));
      return { wch: Math.min(Math.max(maxLen + 2, 8), 40) };
    });
    XLSX.utils.book_append_sheet(wb, ws, sheet.name.slice(0, 31));
  });
  XLSX.writeFile(wb, `${filename}_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

/**
 * 打印导出 — 生成标准格式HTML并调用打印
 * @param {Object} options
 * @param {string} options.title - 报告标题
 * @param {string} options.subtitle - 副标题(可选)
 * @param {string} options.content - HTML内容主体
 * @param {boolean} options.landscape - 横向(默认false)
 */
export function exportPrint({ title, subtitle, content, landscape = false }) {
  const html = `
    <div class="unified-print-report">
      <div class="print-header">
        <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:2px solid #1a73e8;padding-bottom:8px;margin-bottom:16px">
          <div>
            <h2 style="margin:0;color:#1a73e8;font-size:18px">${title}</h2>
            ${subtitle ? `<div style="color:#666;font-size:12px;margin-top:4px">${subtitle}</div>` : ''}
          </div>
          <div style="text-align:right;font-size:11px;color:#888">
            <div>杭州前进齿轮箱集团股份有限公司</div>
            <div>上海前进齿轮经营有限公司</div>
            <div>${new Date().toLocaleDateString('zh-CN')}</div>
          </div>
        </div>
      </div>
      <div class="print-body">${content}</div>
      <div class="print-footer" style="margin-top:24px;padding-top:8px;border-top:1px solid #ddd;font-size:10px;color:#999;text-align:center">
        杭州前进齿轮箱集团股份有限公司 · 船用齿轮箱智能选型系统 · ${new Date().toLocaleDateString('zh-CN')}
      </div>
    </div>
  `;
  const container = document.createElement('div');
  container.innerHTML = html;
  document.body.appendChild(container);
  printHtmlContent(container, {
    title,
    afterPrint: () => document.body.removeChild(container)
  });
}

/**
 * 从表格数据生成HTML表格字符串(供打印用)
 */
export function buildHtmlTable(headers, rows, { caption } = {}) {
  let html = '<table style="width:100%;border-collapse:collapse;font-size:12px;margin:8px 0">';
  if (caption) html += `<caption style="text-align:left;font-weight:bold;margin-bottom:4px">${caption}</caption>`;
  html += '<thead><tr>';
  headers.forEach(h => { html += `<th style="border:1px solid #ddd;padding:4px 8px;background:#f5f5f5;text-align:left">${h}</th>`; });
  html += '</tr></thead><tbody>';
  rows.forEach(row => {
    html += '<tr>';
    row.forEach(cell => { html += `<td style="border:1px solid #ddd;padding:4px 8px">${cell ?? ''}</td>`; });
    html += '</tr>';
  });
  html += '</tbody></table>';
  return html;
}
