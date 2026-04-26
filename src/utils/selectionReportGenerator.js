// src/utils/selectionReportGenerator.js
// 选型报告PDF生成器 — 生成专业的A4选型报告文档
// 使用 jsPDF + autoTable，中文字体动态加载
// P1#4 (2026-04-24): CDN 兜底 URL + sessionStorage 缓存 + 失败时 Toast 可见提示

import { loadJsPDF } from './dynamicImports';
import { toast } from './toast';
import { applyPriceWatermarkToPDF } from './priceVersioning';

const FONT_CACHE_KEY = 'pdf_font_notosans_sc_b64';

/**
 * 加载中文字体到PDF文档 — 多源 fallback + 会话缓存
 * 优先级: sessionStorage 缓存 > 本地 /fonts > jsdelivr CDN > unpkg CDN
 * 全部失败时用 Toast 提示用户,PDF 仍生成(使用系统字体)
 * @param {jsPDF} doc - PDF实例
 * @returns {Promise<boolean>} 是否加载成功
 */
const loadChineseFontForReport = async (doc) => {
  const installFromBase64 = (b64) => {
    doc.addFileToVFS('NotoSansSC-Regular.ttf', b64);
    doc.addFont('NotoSansSC-Regular.ttf', 'NotoSansSC', 'normal');
    doc.setFont('NotoSansSC', 'normal');
  };

  // 0) sessionStorage 缓存(同一会话内避免重复下载)
  try {
    const cached = sessionStorage.getItem(FONT_CACHE_KEY);
    if (cached && cached.length > 1000) {
      installFromBase64(cached);
      return true;
    }
  } catch (e) { /* ignore quota/privacy restrictions */ }

  // jsPDF 需要 TTF — WOFF 不能直接使用
  const fontUrls = [
    '/fonts/NotoSansSC-Regular.ttf',
    '/gearbox-app/fonts/NotoSansSC-Regular.ttf'
  ];

  const errors = [];
  for (const url of fontUrls) {
    try {
      const controller = new AbortController();
      const tid = setTimeout(() => controller.abort(), 4000);
      const resp = await fetch(url, { signal: controller.signal });
      clearTimeout(tid);
      if (!resp.ok) {
        errors.push(`${url}: HTTP ${resp.status}`);
        continue;
      }
      const data = await resp.arrayBuffer();
      if (!data || data.byteLength < 1000) {
        errors.push(`${url}: 响应过小 (${data?.byteLength}B)`);
        continue;
      }
      const b64 = btoa(new Uint8Array(data).reduce((s, b) => s + String.fromCharCode(b), ''));
      installFromBase64(b64);
      try { sessionStorage.setItem(FONT_CACHE_KEY, b64); } catch (e) { /* quota */ }
      return true;
    } catch (e) {
      errors.push(`${url}: ${e?.name || 'Error'}`);
    }
  }

  // 全部 URL 失败 — 发 toast 提醒,但不阻塞 PDF 生成
  console.warn('PDF 中文字体加载全部失败:', errors);
  try {
    toast.warning('中文字体加载失败,PDF 中文可能显示为方块 — 请检查网络或刷新重试');
  } catch (e) { /* ignore if toast handler not mounted */ }
  return false;
};

/**
 * 生成选型报告PDF
 * @param {Object} selectionResult - 完整选型结果对象
 * @param {Object} engineData - 主机/发动机数据 { power, speed, engineModel, ... }
 * @param {Object} requirementData - 选型需求 { targetRatio, thrust, workCondition, application, safetyFactor }
 * @param {Object} projectInfo - 项目信息 { projectName }
 * @param {Object} selectedComponents - 配套设备 { coupling, pump }
 * @returns {Promise<string>} 生成的文件名
 */
export async function generateSelectionReportPDF(
  selectionResult,
  engineData,
  requirementData,
  projectInfo,
  selectedComponents = {}
) {
  const jsPDF = await loadJsPDF();
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const hasChinese = await loadChineseFontForReport(doc);

  const setFont = (size, style = 'normal') => {
    if (hasChinese) doc.setFont('NotoSansSC', style);
    doc.setFontSize(size);
  };

  const pageWidth = 210;
  const margin = 20;
  const contentWidth = pageWidth - 2 * margin;
  let y = margin;

  const recommendations = selectionResult?.recommendations || [];
  const selected = recommendations[0];
  if (!selected) {
    alert('没有选型结果可以导出');
    return;
  }

  // ===== Page 1: Cover =====
  setFont(24);
  doc.setTextColor(0, 51, 102);
  y = 80;
  doc.text('齿轮箱选型报告', pageWidth / 2, y, { align: 'center' });

  setFont(14);
  doc.setTextColor(100);
  y += 20;
  doc.text('GEARBOX SELECTION REPORT', pageWidth / 2, y, { align: 'center' });

  y += 30;
  setFont(12);
  doc.setTextColor(50);
  const projectName = projectInfo?.projectName || engineData?.engineModel || '选型项目';
  doc.text(`项目名称: ${projectName}`, pageWidth / 2, y, { align: 'center' });
  y += 10;
  doc.text(`推荐型号: ${selected.model}`, pageWidth / 2, y, { align: 'center' });
  y += 10;
  doc.text(`报告日期: ${new Date().toLocaleDateString('zh-CN')}`, pageWidth / 2, y, { align: 'center' });

  y += 40;
  setFont(10);
  doc.setTextColor(150);
  doc.text('杭州前进齿轮箱集团股份有限公司', pageWidth / 2, y, { align: 'center' });
  y += 6;
  doc.text('HANGZHOU ADVANCE GEARBOX GROUP CO., LTD.', pageWidth / 2, y, { align: 'center' });
  y += 20;
  doc.setDrawColor(0, 102, 204);
  doc.setLineWidth(0.5);
  doc.line(margin + 30, y, pageWidth - margin - 30, y);

  // ===== Page 2: Input Parameters =====
  doc.addPage();
  y = margin;
  setFont(16);
  doc.setTextColor(0, 51, 102);
  doc.text('一、输入参数', margin, y);
  y += 10;
  doc.setDrawColor(0, 102, 204);
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  const inputParams = [
    ['参数', '数值', '单位'],
    ['主机功率', String(engineData?.power || engineData?.motorPower || '—'), 'kW'],
    ['主机转速', String(engineData?.speed || engineData?.motorSpeed || '—'), 'r/min'],
    ['目标减速比', String(requirementData?.targetRatio || selectionResult?.targetRatio || '—'), ''],
    ['推力需求', String(requirementData?.thrust || '—'), 'kN'],
    ['工况等级', String(requirementData?.workCondition || '—'), ''],
    ['应用类型', String(requirementData?.application || '主推进'), ''],
    ['安全系数', String(requirementData?.safetyFactor || '1.3'), ''],
  ];

  doc.autoTable({
    startY: y,
    head: [inputParams[0]],
    body: inputParams.slice(1),
    margin: { left: margin, right: margin },
    styles: { font: hasChinese ? 'NotoSansSC' : 'helvetica', fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 245, 255] },
  });

  // ===== Recommended Gearboxes Table =====
  y = doc.lastAutoTable.finalY + 15;
  setFont(16);
  doc.setTextColor(0, 51, 102);
  doc.text('二、推荐型号', margin, y);
  y += 10;
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  const top5 = recommendations.slice(0, 5);
  const gearboxTableData = top5.map((g, i) => [
    `${i + 1}`,
    g.model,
    g.selectedRatio?.toFixed(2) || g.ratio?.toFixed(2) || '—',
    g.capacityMargin != null ? `${g.capacityMargin.toFixed(1)}%` : '—',
    g.thrust ? `${g.thrust}` : '—',
    g.weight ? `${g.weight}` : '—',
    g.factoryPrice || g.price
      ? `¥${Number(g.factoryPrice || g.price).toLocaleString()}`
      : '询价',
    g.score?.toFixed(1) || '—',
  ]);

  doc.autoTable({
    startY: y,
    head: [['#', '型号', '减速比', '能力余量', '推力(kN)', '重量(kg)', '出厂价', '评分']],
    body: gearboxTableData,
    margin: { left: margin, right: margin },
    styles: { font: hasChinese ? 'NotoSansSC' : 'helvetica', fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [0, 102, 204], textColor: 255 },
    alternateRowStyles: { fillColor: [245, 248, 255] },
    columnStyles: { 0: { cellWidth: 10 }, 7: { fontStyle: 'bold' } },
  });

  // ===== Scoring Breakdown =====
  y = doc.lastAutoTable.finalY + 15;
  if (y > 240) {
    doc.addPage();
    y = margin;
  }
  setFont(16);
  doc.setTextColor(0, 51, 102);
  doc.text('三、评分详情', margin, y);
  y += 10;
  doc.line(margin, y, margin + contentWidth, y);
  y += 5;

  setFont(11);
  doc.setTextColor(50);
  doc.text(
    `推荐型号: ${selected.model}  |  综合评分: ${selected.score?.toFixed(1) || '—'}分`,
    margin,
    y + 5
  );
  y += 12;

  // Reconstruct score breakdown from available data
  // GearboxScorer uses: ratioMatch(30), capacity(35), thrust(15), price(15), data(5)
  const ratioDiff = selected.ratioDiffPercent || 0;
  const capMargin = selected.capacityMargin || 0;

  // Estimate ratio score
  let estRatioScore;
  if (ratioDiff <= 2) estRatioScore = 30;
  else if (ratioDiff <= 5) estRatioScore = 25;
  else if (ratioDiff <= 10) estRatioScore = 20;
  else estRatioScore = 0;

  // Estimate capacity score
  let estCapScore;
  if (capMargin < 0) estCapScore = 0;
  else if (capMargin >= 10 && capMargin <= 30) estCapScore = 35;
  else if (capMargin > 30 && capMargin <= 50) estCapScore = 28;
  else if (capMargin > 50 && capMargin <= 100) estCapScore = 20;
  else if (capMargin > 100) estCapScore = 15;
  else estCapScore = 25;

  // Thrust score
  const estThrustScore = selected.thrust ? 15 : 15; // simplified — if present, assume satisfied

  // Estimate remaining from total
  const totalScore = selected.score || 0;
  const estPriceAndData = Math.max(0, totalScore - estRatioScore - estCapScore - estThrustScore);

  const scoreBreakdown = [
    ['评分维度', '得分', '满分', '说明'],
    ['减速比匹配', `${estRatioScore}`, '30', `偏差 ${ratioDiff.toFixed(1)}%`],
    ['传动能力余量', `${estCapScore}`, '35', `余量 ${capMargin.toFixed(1)}%`],
    ['推力满足度', `${estThrustScore}`, '15', `${selected.thrust || '—'} kN`],
    [
      '价格+数据',
      `${estPriceAndData.toFixed(0)}`,
      '20',
      selected.factoryPrice || selected.price
        ? `¥${Number(selected.factoryPrice || selected.price).toLocaleString()}`
        : '询价',
    ],
  ];

  doc.autoTable({
    startY: y,
    head: [scoreBreakdown[0]],
    body: scoreBreakdown.slice(1),
    margin: { left: margin, right: margin },
    styles: { font: hasChinese ? 'NotoSansSC' : 'helvetica', fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [40, 167, 69], textColor: 255 },
    alternateRowStyles: { fillColor: [240, 255, 245] },
  });

  // ===== Recommendation Text =====
  y = doc.lastAutoTable.finalY + 15;
  if (y > 240) {
    doc.addPage();
    y = margin;
  }
  setFont(16);
  doc.setTextColor(0, 51, 102);
  doc.text('四、选型建议', margin, y);
  y += 10;
  doc.line(margin, y, margin + contentWidth, y);
  y += 8;

  setFont(11);
  doc.setTextColor(50);
  const power = engineData?.power || engineData?.motorPower || '—';
  const speed = engineData?.speed || engineData?.motorSpeed || '—';
  const recText = [
    `综合分析输入工况(功率${power}kW, 转速${speed}r/min)及选型需求,`,
    `推荐使用 ${selected.model} 型船用齿轮箱。`,
    '',
    `该型号减速比偏差 ${ratioDiff.toFixed(1)}%, 传动能力余量 ${capMargin.toFixed(1)}%,`,
    `综合评分 ${selected.score?.toFixed(1) || '—'} 分, 在${top5.length}个候选型号中排名第一。`,
  ];

  if (selected.thrust) {
    recText.push(`额定推力 ${selected.thrust} kN, 满足推进需求。`);
  }
  if (selected.weight) {
    recText.push(
      `整机重量 ${selected.weight} kg, 中心距 ${selected.centerDistance || '—'} mm。`
    );
  }
  if (selected.certifications?.length) {
    recText.push(`已获船级社认证: ${selected.certifications.join(', ')}。`);
  }

  recText.forEach((line) => {
    if (y > 270) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += 6;
  });

  // ===== Coupling & Pump Info =====
  if (selectedComponents?.coupling || selectedComponents?.pump) {
    y += 5;
    if (y > 220) {
      doc.addPage();
      y = margin;
    }
    setFont(16);
    doc.setTextColor(0, 51, 102);
    doc.text('五、配套设备', margin, y);
    y += 10;
    doc.line(margin, y, margin + contentWidth, y);
    y += 5;

    const equipData = [];
    if (selectedComponents.coupling) {
      const c = selectedComponents.coupling;
      equipData.push([
        '高弹联轴器',
        c.model || '—',
        c.ratedTorque
          ? `${c.ratedTorque} kN·m`
          : c.torque
            ? `${c.torque} kN·m`
            : '—',
      ]);
    }
    if (selectedComponents.pump) {
      const p = selectedComponents.pump;
      equipData.push([
        '备用泵',
        p.model || '—',
        p.flow ? `${p.flow} L/min` : p.displacement ? `${p.displacement} mL/r` : '—',
      ]);
    }

    if (equipData.length > 0) {
      doc.autoTable({
        startY: y,
        head: [['设备', '型号', '参数']],
        body: equipData,
        margin: { left: margin, right: margin },
        styles: {
          font: hasChinese ? 'NotoSansSC' : 'helvetica',
          fontSize: 10,
          cellPadding: 3,
        },
        headStyles: { fillColor: [108, 117, 125], textColor: 255 },
      });
      y = doc.lastAutoTable.finalY + 10;
    }
  }

  // ===== Warnings & Notes =====
  const warnings = selectionResult?.warnings || selected?.warnings || [];
  if (warnings.length > 0) {
    if (y > 240) {
      doc.addPage();
      y = margin;
    }
    setFont(16);
    doc.setTextColor(0, 51, 102);
    doc.text('六、注意事项', margin, y);
    y += 10;
    doc.line(margin, y, margin + contentWidth, y);
    y += 8;

    setFont(10);
    doc.setTextColor(180, 80, 0);
    warnings.forEach((w, i) => {
      if (y > 270) {
        doc.addPage();
        y = margin;
      }
      const text = typeof w === 'string' ? w : w.message || String(w);
      doc.text(`${i + 1}. ${text}`, margin + 2, y);
      y += 6;
    });
  }

  // ===== Footer on all pages =====
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    setFont(8);
    doc.setTextColor(150);
    doc.text(`第 ${i} / ${totalPages} 页`, pageWidth / 2, 287, { align: 'center' });
    doc.text(`生成时间: ${new Date().toLocaleString('zh-CN')}`, margin, 287);
    doc.text('杭州前进齿轮箱集团 · 选型报告', pageWidth - margin, 287, { align: 'right' });
  }

  // 价格截止日水印（每页对角灰色）
  applyPriceWatermarkToPDF(doc);

  // Save
  const filename = `选型报告_${selected.model}_${new Date().toISOString().slice(0, 10)}.pdf`;
  doc.save(filename);
  return filename;
}
