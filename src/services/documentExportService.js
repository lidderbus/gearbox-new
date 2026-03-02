// src/services/documentExportService.js
// 统一文档导出服务

import { loadJsPDF, loadHtml2Canvas } from '../utils/dynamicImports';
import { logger } from '../config/logging';

// 公司信息
const COMPANY_INFO = {
  name: '杭州前进齿轮箱集团股份有限公司',
  nameEn: 'Hangzhou Advance Gearbox Group Co., Ltd.',
  address: '浙江省杭州市萧山区市心北路898号',
  phone: '0571-82738888',
  fax: '0571-82726868',
  website: 'www.advance-gearbox.com',
};

/**
 * 统一的文档导出选项
 */
const defaultOptions = {
  orientation: 'portrait',
  format: 'a4',
  includeHeader: true,
  includeFooter: true,
  watermark: '',
  confidential: false,
  scale: 2,
};

/**
 * 从HTML元素导出PDF（基于html2canvas）
 * 使用已有的 pdfExportUtils.optimizedHtmlToPdf 作为底层
 */
export const exportToPDF = async (element, options = {}) => {
  const opts = { ...defaultOptions, ...options };
  const { loadJsPDF: loadPDF, loadHtml2Canvas: loadCanvas } = await import('../utils/dynamicImports');
  const [jsPDFModule, html2canvas] = await Promise.all([loadPDF(), loadCanvas()]);
  const { jsPDF } = jsPDFModule;

  const canvas = await html2canvas(element, {
    scale: opts.scale,
    useCORS: true,
    allowTaint: true,
    logging: false,
  });

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF({
    orientation: opts.orientation,
    unit: 'mm',
    format: opts.format,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 10;
  const contentWidth = pageWidth - 2 * margin;
  const headerHeight = opts.includeHeader ? 15 : 0;
  const footerHeight = opts.includeFooter ? 10 : 0;
  const contentHeight = pageHeight - headerHeight - footerHeight - 2 * margin;

  const imgWidth = contentWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;
  const totalPages = Math.ceil(imgHeight / contentHeight);

  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    // 页眉
    if (opts.includeHeader) {
      pdf.setFontSize(8);
      pdf.setTextColor(128, 128, 128);
      pdf.text(COMPANY_INFO.name, margin, 8);
      if (opts.docType) {
        pdf.text(opts.docType, pageWidth - margin, 8, { align: 'right' });
      }
      pdf.setDrawColor(200, 200, 200);
      pdf.line(margin, 12, pageWidth - margin, 12);
    }

    // 内容
    const yOffset = headerHeight + margin - page * contentHeight;
    pdf.addImage(imgData, 'PNG', margin, yOffset, imgWidth, imgHeight);

    // 页脚
    if (opts.includeFooter) {
      const footerY = pageHeight - 5;
      pdf.setFontSize(7);
      pdf.setTextColor(150, 150, 150);
      pdf.text(`第 ${page + 1} / ${totalPages} 页`, pageWidth / 2, footerY, { align: 'center' });
      const dateStr = new Date().toLocaleDateString('zh-CN');
      pdf.text(dateStr, margin, footerY);
      if (opts.confidential) {
        pdf.text('机密', pageWidth - margin, footerY, { align: 'right' });
      }
    }
  }

  const filename = opts.filename || `文档-${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(filename);
  return true;
};

/**
 * 从HTML字符串导出Word文档（基于Blob下载）
 */
export const exportToWord = (htmlContent, options = {}) => {
  const { filename = '文档.doc', title = '' } = options;

  const header = `
    <html xmlns:o='urn:schemas-microsoft-com:office:office'
          xmlns:w='urn:schemas-microsoft-com:office:word'
          xmlns='http://www.w3.org/TR/REC-html40'>
    <head>
      <meta charset='utf-8'>
      <title>${title}</title>
      <style>
        body { font-family: '宋体', SimSun, serif; font-size: 12pt; line-height: 1.6; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid #000; padding: 6px 8px; }
        h1 { font-size: 18pt; text-align: center; }
        h2 { font-size: 14pt; }
        h3 { font-size: 12pt; }
        .header { text-align: center; margin-bottom: 20px; }
        .signature-area { margin-top: 40px; }
        @page { size: A4; margin: 2cm; }
      </style>
    </head>
    <body>
  `;
  const footer = '</body></html>';
  const fullHtml = header + htmlContent + footer;

  const blob = new Blob(['\ufeff' + fullHtml], {
    type: 'application/msword;charset=utf-8',
  });

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.doc') ? filename : `${filename}.doc`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

/**
 * 打印HTML内容
 */
export const printDocument = (element, options = {}) => {
  const { title = '打印预览' } = options;
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    logger.warn('无法打开打印窗口，请检查弹窗拦截设置');
    return false;
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        body { font-family: '宋体', SimSun, serif; margin: 0; padding: 20px; }
        @page { size: A4; margin: 1.5cm; }
        @media print { body { padding: 0; } }
      </style>
    </head>
    <body>${element.innerHTML}</body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
  return true;
};

/**
 * 导出数据为JSON备份文件
 */
export const exportToJSON = (data, filename = 'backup.json') => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return true;
};

/**
 * 从JSON文件导入数据
 * @returns {Promise<Object>} 解析后的JSON数据
 */
export const importFromJSON = () => {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) {
        reject(new Error('未选择文件'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const data = JSON.parse(event.target.result);
          resolve(data);
        } catch (err) {
          reject(new Error('JSON解析失败: ' + err.message));
        }
      };
      reader.onerror = () => reject(new Error('文件读取失败'));
      reader.readAsText(file);
    };
    input.click();
  });
};

export default {
  exportToPDF,
  exportToWord,
  printDocument,
  exportToJSON,
  importFromJSON,
  COMPANY_INFO,
};
