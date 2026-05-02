// src/utils/dwgExporter.js
// 图纸模块导出工具：批量打包(zip)、规格书(pdf)、规格矩阵(xlsx)
//
// 使用方式: 通过 utils/dynamicImports 的 loadJsPDF/loadXLSX 共享缓存，减小首屏 bundle

import { getDwgDownloadUrl, getPdfPreviewUrl } from '../data/outlineDrawings';
import { loadJsPDF, loadXLSX } from './dynamicImports';

/**
 * 触发浏览器下载二进制 Blob
 */
const downloadBlob = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/**
 * 安全 fetch：失败返回 null 而不是抛
 */
const safeFetch = async (url) => {
  try {
    const res = await fetch(url, { method: 'GET', credentials: 'omit' });
    if (!res.ok) return null;
    return await res.blob();
  } catch (e) {
    return null;
  }
};

/**
 * 批量打包 DWG/PDF 文件下载
 *
 * @param {Array<{model:string, filePath:string, fileName?:string, type?:string}>} files
 *   要打包的图纸文件列表（来自收藏夹/搜索结果）
 * @param {Object} opts
 * @param {boolean} opts.includePdf  是否同时附带 PDF 版本（默认 true）
 * @param {(progress:{done:number,total:number,current:string})=>void} opts.onProgress
 * @returns {Promise<{ok:boolean, succeeded:number, failed:string[]}>}
 */
export const exportDwgZip = async (files, opts = {}) => {
  const { includePdf = true, onProgress } = opts;
  if (!Array.isArray(files) || files.length === 0) {
    return { ok: false, succeeded: 0, failed: [], message: '没有可下载的图纸' };
  }
  const { default: JSZip } = await import('jszip');
  const zip = new JSZip();

  const failed = [];
  let done = 0;
  const total = files.length;

  // README 列表（中文目录）
  const lines = [
    '齿轮箱图纸打包清单',
    '生成时间: ' + new Date().toLocaleString('zh-CN'),
    `文件数: ${total}`,
    '',
    '型号\t文件名\t类型\t下载地址'
  ];

  for (const file of files) {
    onProgress?.({ done, total, current: file.model || file.fileName || '' });

    const dwgUrl = getDwgDownloadUrl(file.filePath);
    if (!dwgUrl) {
      failed.push(`${file.model || file.fileName} (路径无效)`);
      done++;
      continue;
    }

    const dwgBlob = await safeFetch(dwgUrl);
    if (dwgBlob) {
      const fname = file.fileName || `${file.model}.dwg`;
      zip.file(`dwg/${fname}`, dwgBlob);
    } else {
      failed.push(`${file.model || file.fileName} DWG`);
    }

    if (includePdf) {
      const pdfUrl = getPdfPreviewUrl(file.filePath);
      if (pdfUrl) {
        const pdfBlob = await safeFetch(pdfUrl);
        if (pdfBlob) {
          const pdfName = (file.fileName || `${file.model}.dwg`).replace(/\.dwg$/i, '.pdf');
          zip.file(`pdf/${pdfName}`, pdfBlob);
        }
      }
    }

    lines.push(`${file.model}\t${file.fileName || ''}\t${file.type || ''}\t${dwgUrl}`);
    done++;
  }

  zip.file('README.txt', lines.join('\n'));

  onProgress?.({ done: total, total, current: '生成 zip…' });
  const blob = await zip.generateAsync({ type: 'blob' });
  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  downloadBlob(blob, `gearbox-drawings-${stamp}.zip`);

  return {
    ok: true,
    succeeded: total - failed.length,
    failed,
    message: failed.length
      ? `打包完成，${failed.length} 项失败`
      : `打包完成，共 ${total} 项`
  };
};

/**
 * 生成型号技术规格书 PDF（封面 + 参数 + 图纸预览 + 安装提示）
 *
 * @param {Object} model  来自 completeGearboxData 的型号记录
 * @param {Object} dwgFile  对应 DWG 文件（可空）
 * @returns {Promise<void>}
 */
export const exportSpecPdf = async (model, dwgFile = null) => {
  const jsPDF = await loadJsPDF();
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const M = 18;            // 页边距
  const W = 210 - M * 2;
  let y = M;

  // 封面
  doc.setFontSize(22);
  doc.text('齿轮箱技术规格书', 105, y + 10, { align: 'center' });
  y += 22;
  doc.setFontSize(14);
  doc.text(`型号: ${model.model || model.id || '-'}`, M, y);
  y += 8;
  if (model.series) {
    doc.text(`系列: ${model.series}`, M, y);
    y += 8;
  }
  doc.setFontSize(10);
  doc.setTextColor(120);
  doc.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, M, y);
  doc.setTextColor(0);
  y += 12;

  // 关键参数表
  doc.setFontSize(12);
  doc.text('关键参数', M, y);
  y += 6;
  doc.setDrawColor(180);
  doc.line(M, y, M + W, y);
  y += 4;

  const rows = [
    ['传递能力 (kW/(r/min))', model.transferCapacity ?? model.transmissionCapacityPerRatio ?? '-'],
    ['输入转速范围 (r/min)', model.inputSpeedRange ?? `${model.minSpeed ?? '-'} ~ ${model.maxSpeed ?? '-'}`],
    ['减速比', Array.isArray(model.ratio) ? model.ratio.join(' / ') : (model.ratio ?? '-')],
    ['推力 (kN)', model.thrust ?? '-'],
    ['重量 (kg)', model.weight ?? '-'],
    ['中心距 (mm)', model.centerDistance ?? '-']
  ];
  doc.setFontSize(10);
  rows.forEach(([k, v]) => {
    doc.text(String(k), M, y);
    doc.text(String(v), M + 80, y);
    y += 6;
  });

  y += 6;
  doc.setFontSize(12);
  doc.text('安装与使用提示', M, y);
  y += 6;
  doc.setDrawColor(180);
  doc.line(M, y, M + W, y);
  y += 4;
  doc.setFontSize(10);
  const tips = [
    '1. 安装前请核对图纸尺寸，确保基础平面平整、固定螺栓符合规格。',
    '2. 首次启动前需注入推荐型号的齿轮油，并检查油位。',
    '3. 联轴器对中误差应在产品手册推荐范围内。',
    '4. 详见 DWG 原始图纸与厂家技术服务支持。'
  ];
  tips.forEach((t) => {
    doc.text(t, M, y);
    y += 6;
  });

  // 附 DWG 链接
  if (dwgFile?.filePath) {
    const url = getDwgDownloadUrl(dwgFile.filePath);
    if (url) {
      y += 6;
      doc.setFontSize(10);
      doc.setTextColor(13, 110, 253);
      doc.textWithLink('点此下载 DWG 原始文件', M, y, { url });
      doc.setTextColor(0);
    }
  }

  // 页脚
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text(
    '本规格书由齿轮箱选型系统自动生成，最终以厂家正式技术资料为准',
    105, 290, { align: 'center' }
  );

  doc.save(`${model.model || 'gearbox'}-spec.pdf`);
};

/**
 * 多型号尺寸对比导出（CSV，简单可靠）
 */
export const exportSizeCompareCsv = (models) => {
  if (!Array.isArray(models) || models.length === 0) return false;
  const header = ['型号', '系列', '传递能力 kW/(r/min)', '减速比', '推力 kN', '重量 kg', '中心距 mm'];
  const lines = [header.join(',')];
  models.forEach((m) => {
    lines.push([
      m.model ?? '',
      m.series ?? '',
      m.transferCapacity ?? m.transmissionCapacityPerRatio ?? '',
      Array.isArray(m.ratio) ? `"${m.ratio.join(' / ')}"` : (m.ratio ?? ''),
      m.thrust ?? '',
      m.weight ?? '',
      m.centerDistance ?? ''
    ].join(','));
  });
  // 加 BOM 防 Excel 中文乱码
  const blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
  downloadBlob(blob, `gearbox-size-compare-${Date.now()}.csv`);
  return true;
};

/**
 * 规格矩阵 Excel 导出 (多 Sheet: 齿轮箱 / 联轴器 / 匹配)
 */
export const exportSpecMatrixXlsx = async ({ gearboxes = [], couplings = [], pairs = [] }) => {
  const XLSX = await loadXLSX();
  const wb = XLSX.utils.book_new();

  const toRows = (list) =>
    list.map((m) => ({
      型号: m.model ?? m.id ?? '',
      系列: m.series ?? '',
      '传递能力 kW/(r/min)': m.transferCapacity ?? m.transmissionCapacityPerRatio ?? '',
      减速比: Array.isArray(m.ratio) ? m.ratio.join(' / ') : (m.ratio ?? ''),
      '推力 kN': m.thrust ?? '',
      '重量 kg': m.weight ?? '',
      '中心距 mm': m.centerDistance ?? '',
      '价格(元)': m.price ?? ''
    }));

  if (gearboxes.length) {
    const ws = XLSX.utils.json_to_sheet(toRows(gearboxes));
    XLSX.utils.book_append_sheet(wb, ws, '齿轮箱');
  }
  if (couplings.length) {
    const ws = XLSX.utils.json_to_sheet(toRows(couplings));
    XLSX.utils.book_append_sheet(wb, ws, '联轴器');
  }
  if (pairs.length) {
    const ws = XLSX.utils.json_to_sheet(pairs);
    XLSX.utils.book_append_sheet(wb, ws, '推荐匹配');
  }

  const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  XLSX.writeFile(wb, `gearbox-spec-matrix-${stamp}.xlsx`);
};

const exporter = { exportDwgZip, exportSpecPdf, exportSizeCompareCsv, exportSpecMatrixXlsx };
export default exporter;
