/**
 * 扭振计算书PDF生成器
 *
 * 生成COMPASS格式的完整扭振计算报告（10页）
 * 格式参考：CCS船级社标准扭振计算书
 *
 * @module torsionalPdfGenerator
 */

import { loadJsPDF } from './dynamicImports';
import { logger } from '../config/logging';

// ============================================================
// 常量定义
// ============================================================

const PAGE_WIDTH = 595.28;  // A4宽度 (pt)
const PAGE_HEIGHT = 841.89; // A4高度 (pt)
const MARGIN = 40;          // 页边距
const CONTENT_WIDTH = PAGE_WIDTH - 2 * MARGIN;
const LINE_HEIGHT = 16;     // 行高

// 章节标题
const SECTION_TITLES = {
  cover: '扭转振动计算书',
  systemLayout: '第一章 轴系布置数据',
  inertiaTable: '第二章 转动惯量-柔度表',
  equivalentDiagram: '第三章 轴系等效系统',
  freeVibration: '第四章 自由振动计算',
  forcedVibration: '第五章 强迫振动分析',
  harmonicAnalysis: '第六章 单谐次分析',
  intermediateStress: '第七章 中间轴应力曲线',
  propellerStress: '第八章 螺旋桨轴应力曲线',
  torqueCurves: '第九章 齿轮/联轴器扭矩曲线',
  conclusion: '第十章 结论与建议'
};

// ============================================================
// 主导出函数
// ============================================================

/**
 * 生成完整扭振计算书PDF
 *
 * @param {Object} reportData - 报告数据
 * @param {Object} reportData.metadata - 项目元数据
 * @param {Object} reportData.systemInput - 系统输入数据
 * @param {Object} reportData.freeVibrationResult - 自由振动结果
 * @param {Object} reportData.forcedVibrationResult - 强迫振动结果
 * @param {Object} reportData.chartImages - 图表图片(Base64)
 * @param {Object} options - 生成选项
 * @returns {Promise<Blob>} PDF文件Blob
 */
export async function generateTorsionalReport(reportData, options = {}) {
  const {
    filename = '扭振计算书',
    includeCharts = true,
    debug = false
  } = options;

  try {
    logger.info('开始生成扭振计算书PDF');

    // 动态导入jsPDF
    const jsPDF = await loadJsPDF();

    // 创建PDF文档
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: 'a4'
    });

    // 加载中文字体
    await loadChineseFont(doc);

    // PDF生成器上下文
    const ctx = {
      doc,
      currentPage: 1,
      y: MARGIN,
      debug
    };

    // 生成各章节
    await generateCoverPage(ctx, reportData);
    await generateSystemLayoutSection(ctx, reportData);
    await generateInertiaTableSection(ctx, reportData);
    await generateEquivalentDiagramSection(ctx, reportData);
    await generateFreeVibrationSection(ctx, reportData);
    await generateForcedVibrationSection(ctx, reportData);

    if (includeCharts && reportData.chartImages) {
      await generateStressChartSections(ctx, reportData);
    }

    await generateConclusionSection(ctx, reportData);

    // 添加页码
    addPageNumbers(ctx);

    // 保存文件
    doc.save(`${filename}.pdf`);

    logger.info('扭振计算书PDF生成完成');
    return doc.output('blob');

  } catch (error) {
    logger.error('扭振计算书PDF生成失败:', error);
    throw error;
  }
}

// ============================================================
// 字体加载
// ============================================================

/**
 * 加载中文字体
 */
async function loadChineseFont(pdf) {
  try {
    const fontUrls = [
      // 本地服务器字体 - 最可靠
      '/fonts/NotoSansSC-Regular.ttf',
      // Google Fonts 直接链接
      'https://fonts.gstatic.com/s/notosanssc/v39/k3kCo84MPvpLmixcA63oeAL7Iqp5IZJF9bmaG9_FnYw.ttf'
    ];

    for (const fontUrl of fontUrls) {
      try {
        const response = await fetch(fontUrl, { timeout: 5000 });
        if (response.ok) {
          const fontData = await response.arrayBuffer();
          const base64Font = btoa(
            new Uint8Array(fontData).reduce((data, byte) => data + String.fromCharCode(byte), '')
          );
          const fontName = fontUrl.endsWith('.otf') ? 'NotoSansSC.otf' : 'NotoSansSC.ttf';
          pdf.addFileToVFS(fontName, base64Font);
          pdf.addFont(fontName, 'NotoSansSC', 'normal');
          pdf.setFont('NotoSansSC', 'normal');
          return true;
        }
      } catch {
        continue;
      }
    }

    pdf.setFont('helvetica', 'normal');
    return false;
  } catch (error) {
    logger.warn('中文字体加载失败:', error);
    pdf.setFont('helvetica', 'normal');
    return false;
  }
}

// ============================================================
// 封面页
// ============================================================

async function generateCoverPage(ctx, reportData) {
  const { doc } = ctx;
  const { metadata = {} } = reportData;

  // 标题
  doc.setFontSize(24);
  doc.setTextColor(0, 51, 102);
  centerText(doc, SECTION_TITLES.cover, 200);

  // 副标题
  doc.setFontSize(16);
  doc.setTextColor(80, 80, 80);
  centerText(doc, metadata.projectName || '船舶轴系扭转振动分析', 250);

  // 分隔线
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(2);
  doc.line(MARGIN + 100, 280, PAGE_WIDTH - MARGIN - 100, 280);

  // 项目信息表
  doc.setFontSize(12);
  doc.setTextColor(40, 40, 40);

  const infoItems = [
    ['项目编号', metadata.projectNumber || '-'],
    ['船舶类型', metadata.vesselType || '-'],
    ['主机型号', metadata.mainEngineModel || '-'],
    ['齿轮箱型号', metadata.gearboxModel || '-'],
    ['计算人员', metadata.calculator || '-'],
    ['审核人员', metadata.reviewer || '-'],
    ['计算日期', metadata.date || new Date().toLocaleDateString('zh-CN')]
  ];

  let y = 340;
  infoItems.forEach(([label, value]) => {
    doc.text(`${label}：`, PAGE_WIDTH / 2 - 100, y);
    doc.text(value, PAGE_WIDTH / 2 + 20, y);
    y += 30;
  });

  // 底部信息
  doc.setFontSize(10);
  doc.setTextColor(120, 120, 120);
  centerText(doc, '依据CCS《钢质海船入级规范》计算', PAGE_HEIGHT - 100);
  centerText(doc, '使用传递矩阵法(Holzer-Myklestad)进行分析', PAGE_HEIGHT - 80);

  // 新页
  doc.addPage();
  ctx.currentPage++;
  ctx.y = MARGIN;
}

// ============================================================
// 第一章：轴系布置数据
// ============================================================

async function generateSystemLayoutSection(ctx, reportData) {
  const { doc } = ctx;
  const { systemInput = {} } = reportData;

  // 章节标题
  addSectionTitle(ctx, SECTION_TITLES.systemLayout);

  // 1.1 主要设备参数
  addSubsectionTitle(ctx, '1.1 主要设备参数');

  const deviceData = [
    ['主机类型', systemInput.powerSource?.type || '柴油机'],
    ['主机功率 (kW)', systemInput.powerSource?.power || '-'],
    ['主机转速 (rpm)', systemInput.powerSource?.speed || '-'],
    ['主机气缸数', systemInput.powerSource?.cylinderCount || '-'],
    ['螺旋桨叶数', systemInput.propeller?.bladeCount || '-'],
    ['齿轮箱速比', systemInput.gearMeshes?.[0]?.ratio || '-'],
    ['联轴器类型', systemInput.elasticCouplings?.[0]?.type || '-']
  ];

  addSimpleTable(ctx, ['参数', '数值'], deviceData);

  // 1.2 工况范围
  addSubsectionTitle(ctx, '1.2 工况转速范围');

  doc.setFontSize(11);
  ctx.y += LINE_HEIGHT;
  doc.text(`主机转速范围: ${systemInput.analysisSettings?.minSpeed || 400} ~ ${systemInput.analysisSettings?.maxSpeed || 2200} rpm`, MARGIN, ctx.y);
  ctx.y += LINE_HEIGHT;
  doc.text(`常用工况范围: ${systemInput.analysisSettings?.operatingMin || 600} ~ ${systemInput.analysisSettings?.operatingMax || 2000} rpm`, MARGIN, ctx.y);
  ctx.y += LINE_HEIGHT * 2;

  checkPageBreak(ctx, 100);
}

// ============================================================
// 第二章：转动惯量-柔度表
// ============================================================

async function generateInertiaTableSection(ctx, reportData) {
  const { doc } = ctx;
  const { systemInput = {} } = reportData;
  const units = systemInput.units || [];

  addSectionTitle(ctx, SECTION_TITLES.inertiaTable);

  if (units.length === 0) {
    doc.text('暂无单元数据', MARGIN, ctx.y);
    ctx.y += LINE_HEIGHT * 2;
    return;
  }

  // 表头
  const headers = ['单元号', '名称', '转动惯量\n(kg.m²)', '扭转柔度\n(E-10 rad/N.m)', '直径\n(mm)', '长度\n(mm)'];

  // 数据行
  const tableData = units.map(unit => [
    unit.unitNumber || '-',
    unit.name || '-',
    formatNumber(unit.inertia, 4),
    formatNumber(unit.torsionalFlexibility, 4),
    formatNumber(unit.diameter, 0),
    formatNumber(unit.length, 0)
  ]);

  // 使用autoTable生成表格
  doc.autoTable({
    startY: ctx.y,
    head: [headers],
    body: tableData,
    theme: 'striped',
    tableWidth: CONTENT_WIDTH,
    styles: {
      font: 'NotoSansSC',
      fontStyle: 'normal'
    },
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: 255,
      fontSize: 8,
      halign: 'center',
      cellPadding: 3
    },
    bodyStyles: {
      fontSize: 8,
      halign: 'center',
      cellPadding: 3,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 'auto', halign: 'left' },
      2: { cellWidth: 70 },
      3: { cellWidth: 85 },
      4: { cellWidth: 50 },
      5: { cellWidth: 50 }
    },
    margin: { left: MARGIN, right: MARGIN }
  });

  ctx.y = doc.lastAutoTable.finalY + 20;
  checkPageBreak(ctx, 100);
}

// ============================================================
// 第三章：等效系统示意图
// ============================================================

async function generateEquivalentDiagramSection(ctx, reportData) {
  const { doc } = ctx;
  const { chartImages = {} } = reportData;

  addSectionTitle(ctx, SECTION_TITLES.equivalentDiagram);

  if (chartImages.equivalentDiagram) {
    // 嵌入等效系统图
    try {
      doc.addImage(
        chartImages.equivalentDiagram,
        'PNG',
        MARGIN,
        ctx.y,
        CONTENT_WIDTH,
        200
      );
      ctx.y += 220;
    } catch (error) {
      doc.text('等效系统图加载失败', MARGIN, ctx.y);
      ctx.y += LINE_HEIGHT;
    }
  } else {
    // 绘制简化示意图
    drawSimpleEquivalentDiagram(ctx, reportData);
  }

  // 说明文字
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('图3.1 轴系等效振动系统示意图', PAGE_WIDTH / 2, ctx.y, { align: 'center' });
  ctx.y += LINE_HEIGHT * 2;

  checkPageBreak(ctx, 100);
}

/**
 * 绘制简化等效系统图
 */
function drawSimpleEquivalentDiagram(ctx, reportData) {
  const { doc } = ctx;
  const { systemInput = {} } = reportData;
  const units = systemInput.units || [];

  const diagramY = ctx.y + 20;
  const diagramHeight = 120;
  const unitWidth = Math.min(60, CONTENT_WIDTH / (units.length + 1));

  // 绘制轴线
  doc.setDrawColor(100, 100, 100);
  doc.setLineWidth(1);
  doc.line(MARGIN, diagramY + diagramHeight / 2, PAGE_WIDTH - MARGIN, diagramY + diagramHeight / 2);

  // 绘制各质量单元
  units.forEach((unit, i) => {
    const x = MARGIN + 40 + i * unitWidth;
    const y = diagramY + diagramHeight / 2;

    // 质量块
    doc.setFillColor(0, 102, 204);
    doc.rect(x - 15, y - 25, 30, 50, 'F');

    // 单元编号
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text(String(unit.unitNumber || i + 1), x, y + 3, { align: 'center' });

    // 弹簧符号（柔度）
    if (i < units.length - 1) {
      drawSpring(doc, x + 15, y, unitWidth - 30);
    }
  });

  // 标注
  doc.setFontSize(8);
  doc.setTextColor(40, 40, 40);
  doc.text('主机', MARGIN + 40, diagramY + diagramHeight / 2 + 45, { align: 'center' });
  doc.text('螺旋桨', PAGE_WIDTH - MARGIN - 40, diagramY + diagramHeight / 2 + 45, { align: 'center' });

  ctx.y = diagramY + diagramHeight + 20;
}

/**
 * 绘制弹簧符号
 */
function drawSpring(doc, x, y, width) {
  const coils = 4;
  const amplitude = 8;
  const step = width / (coils * 2);

  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(0.5);

  let currentX = x;
  for (let i = 0; i < coils * 2; i++) {
    const nextX = currentX + step;
    const yOffset = i % 2 === 0 ? amplitude : -amplitude;
    doc.line(currentX, y, nextX, y + yOffset);
    currentX = nextX;
  }
}

// ============================================================
// 第四章：自由振动计算
// ============================================================

async function generateFreeVibrationSection(ctx, reportData) {
  const { doc } = ctx;
  const { freeVibrationResult = {} } = reportData;
  const { naturalFrequencies = [] } = freeVibrationResult;

  // 新页
  doc.addPage();
  ctx.currentPage++;
  ctx.y = MARGIN;

  addSectionTitle(ctx, SECTION_TITLES.freeVibration);

  // 4.1 固有频率汇总
  addSubsectionTitle(ctx, '4.1 固有频率汇总');

  if (naturalFrequencies.length === 0) {
    doc.text('暂无自由振动计算结果', MARGIN, ctx.y);
    ctx.y += LINE_HEIGHT * 2;
    return;
  }

  const freqHeaders = ['阶次', '固有频率\n(Hz)', '固有频率\n(1/min)', '角频率\n(rad/s)'];
  const freqData = naturalFrequencies.map((mode, i) => [
    `${mode.order || i + 1}阶`,
    formatNumber(mode.frequency, 2),
    formatNumber(mode.frequencyRpm, 1),
    formatNumber(mode.omega, 2)
  ]);

  doc.autoTable({
    startY: ctx.y,
    head: [freqHeaders],
    body: freqData,
    theme: 'striped',
    tableWidth: CONTENT_WIDTH,
    styles: {
      font: 'NotoSansSC',
      fontStyle: 'normal'
    },
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: 255,
      fontSize: 9,
      halign: 'center',
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 9,
      halign: 'center',
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 'auto' }
    },
    margin: { left: MARGIN, right: MARGIN }
  });

  ctx.y = doc.lastAutoTable.finalY + 20;

  // 4.2 各阶Holzer表
  for (let i = 0; i < Math.min(naturalFrequencies.length, 3); i++) {
    const mode = naturalFrequencies[i];

    checkPageBreak(ctx, 250);
    addSubsectionTitle(ctx, `4.${i + 2} 第${mode.order || i + 1}阶固有频率Holzer迭代表`);

    doc.setFontSize(10);
    doc.text(`F = ${formatNumber(mode.frequencyRpm, 1)} 1/min (${formatNumber(mode.frequency, 2)} Hz)`, MARGIN, ctx.y);
    ctx.y += LINE_HEIGHT;
    doc.text(`ω = ${formatNumber(mode.omega, 2)} rad/s`, MARGIN, ctx.y);
    ctx.y += LINE_HEIGHT;

    // Holzer表格
    if (mode.modeShape?.holzerTable) {
      const holzerHeaders = ['质量号', '转动惯量\n(kg.m²)', '扭转柔度\n(E-10)', '相对振幅', '惯性力矩\n(N.m)', '累计扭矩\n(N.m)'];
      const holzerData = mode.modeShape.holzerTable.map(row => [
        row.unitNumber,
        formatNumber(row.inertia, 4),
        formatNumber(row.flexibility, 4),
        formatNumber(row.amplitude, 6),
        formatNumber(row.inertiaForce, 4),
        formatNumber(row.cumulativeTorque, 4)
      ]);

      doc.autoTable({
        startY: ctx.y,
        head: [holzerHeaders],
        body: holzerData,
        theme: 'grid',
        tableWidth: CONTENT_WIDTH,
        styles: {
          font: 'NotoSansSC',
          fontStyle: 'normal'
        },
        headStyles: {
          fillColor: [70, 70, 70],
          textColor: 255,
          fontSize: 8,
          halign: 'center',
          cellPadding: 3
        },
        bodyStyles: {
          fontSize: 8,
          halign: 'right',
          cellPadding: 3
        },
        columnStyles: {
          0: { halign: 'center', cellWidth: 45 },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' },
          5: { cellWidth: 'auto' }
        },
        margin: { left: MARGIN, right: MARGIN }
      });

      ctx.y = doc.lastAutoTable.finalY + 15;
    }
  }

  checkPageBreak(ctx, 100);
}

// ============================================================
// 第五章：强迫振动分析
// ============================================================

async function generateForcedVibrationSection(ctx, reportData) {
  const { doc } = ctx;
  const { forcedVibrationResult = {} } = reportData;

  // 新页
  doc.addPage();
  ctx.currentPage++;
  ctx.y = MARGIN;

  addSectionTitle(ctx, SECTION_TITLES.forcedVibration);

  // 5.1 激励源参数
  addSubsectionTitle(ctx, '5.1 激励源参数');

  const excitationData = [
    ['柴油机激励阶次', '0.5, 1, 1.5, 2, 3, 4, 6'],
    ['螺旋桨激励阶次', String(reportData.systemInput?.propeller?.bladeCount || 4)],
    ['分析转速范围', `${forcedVibrationResult.speedRange?.[0] || 400} ~ ${forcedVibrationResult.speedRange?.slice(-1)[0] || 2200} rpm`]
  ];

  addSimpleTable(ctx, ['参数', '数值'], excitationData);

  // 5.2 许用应力
  addSubsectionTitle(ctx, '5.2 许用应力计算');

  const allowable = forcedVibrationResult.allowableStress || {};
  const stressData = [
    ['中间轴许用应力', `${formatNumber(allowable.intermediateShaft, 1)} N/mm²`],
    ['螺旋桨轴许用应力', `${formatNumber(allowable.propellerShaft, 1)} N/mm²`],
    ['计算依据', 'CCS《钢质海船入级规范》']
  ];

  addSimpleTable(ctx, ['项目', '数值'], stressData);

  // 5.3 应力校核结果
  addSubsectionTitle(ctx, '5.3 应力校核结果');

  const intermediateMax = Math.max(...(forcedVibrationResult.intermediateShaftStress?.map(s => s.total) || [0]));
  const propellerMax = Math.max(...(forcedVibrationResult.propellerShaftStress?.map(s => s.total) || [0]));

  const resultData = [
    ['中间轴最大应力', `${formatNumber(intermediateMax, 2)} N/mm²`, intermediateMax <= (allowable.intermediateShaft || 35) ? '合格' : '不合格'],
    ['螺旋桨轴最大应力', `${formatNumber(propellerMax, 2)} N/mm²`, propellerMax <= (allowable.propellerShaft || 30) ? '合格' : '不合格']
  ];

  doc.autoTable({
    startY: ctx.y,
    head: [['项目', '计算值', '校核结果']],
    body: resultData,
    theme: 'striped',
    tableWidth: CONTENT_WIDTH,
    styles: {
      font: 'NotoSansSC',
      fontStyle: 'normal'
    },
    headStyles: {
      fillColor: [0, 51, 102],
      textColor: 255,
      fontSize: 9,
      halign: 'center',
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 9,
      halign: 'center',
      cellPadding: 4
    },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 100 }
    },
    didParseCell: (data) => {
      if (data.column.index === 2 && data.section === 'body') {
        if (data.cell.raw === '合格') {
          data.cell.styles.textColor = [34, 139, 34];
        } else {
          data.cell.styles.textColor = [220, 53, 69];
        }
      }
    },
    margin: { left: MARGIN, right: MARGIN }
  });

  ctx.y = doc.lastAutoTable.finalY + 20;

  // 5.4 危险转速区间
  const dangerZones = forcedVibrationResult.dangerZones || [];
  if (dangerZones.length > 0) {
    addSubsectionTitle(ctx, '5.4 危险转速区间');

    const dangerData = dangerZones.map((zone, i) => [
      `危险区${i + 1}`,
      `${zone.minSpeed} ~ ${zone.maxSpeed} rpm`,
      `${zone.order}阶共振`,
      zone.inOperatingRange ? '在工况范围内' : '不在工况范围内'
    ]);

    doc.autoTable({
      startY: ctx.y,
      head: [['区间', '转速范围', '类型', '备注']],
      body: dangerData,
      theme: 'striped',
      tableWidth: CONTENT_WIDTH,
      styles: {
        font: 'NotoSansSC',
        fontStyle: 'normal'
      },
      headStyles: {
        fillColor: [220, 53, 69],
        textColor: 255,
        fontSize: 9,
        halign: 'center',
        cellPadding: 4
      },
      bodyStyles: {
        fontSize: 9,
        halign: 'center',
        cellPadding: 4
      },
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: 'auto' },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 'auto' }
      },
      margin: { left: MARGIN, right: MARGIN }
    });

    ctx.y = doc.lastAutoTable.finalY + 20;
  }

  checkPageBreak(ctx, 100);
}

// ============================================================
// 应力曲线章节
// ============================================================

async function generateStressChartSections(ctx, reportData) {
  const { doc } = ctx;
  const { chartImages = {} } = reportData;

  // 中间轴应力曲线
  doc.addPage();
  ctx.currentPage++;
  ctx.y = MARGIN;

  addSectionTitle(ctx, SECTION_TITLES.intermediateStress);

  if (chartImages.intermediateShaft) {
    try {
      doc.addImage(
        chartImages.intermediateShaft,
        'PNG',
        MARGIN,
        ctx.y,
        CONTENT_WIDTH,
        280
      );
      ctx.y += 300;
    } catch (error) {
      doc.text('中间轴应力曲线图加载失败', MARGIN, ctx.y);
      ctx.y += LINE_HEIGHT;
    }
  } else {
    doc.text('中间轴应力曲线图未生成', MARGIN, ctx.y);
    ctx.y += LINE_HEIGHT;
  }

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('图7.1 中间轴扭振应力-转速曲线', PAGE_WIDTH / 2, ctx.y, { align: 'center' });

  // 螺旋桨轴应力曲线
  doc.addPage();
  ctx.currentPage++;
  ctx.y = MARGIN;

  addSectionTitle(ctx, SECTION_TITLES.propellerStress);

  if (chartImages.propellerShaft) {
    try {
      doc.addImage(
        chartImages.propellerShaft,
        'PNG',
        MARGIN,
        ctx.y,
        CONTENT_WIDTH,
        280
      );
      ctx.y += 300;
    } catch (error) {
      doc.text('螺旋桨轴应力曲线图加载失败', MARGIN, ctx.y);
      ctx.y += LINE_HEIGHT;
    }
  } else {
    doc.text('螺旋桨轴应力曲线图未生成', MARGIN, ctx.y);
    ctx.y += LINE_HEIGHT;
  }

  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text('图8.1 螺旋桨轴扭振应力-转速曲线', PAGE_WIDTH / 2, ctx.y, { align: 'center' });
}

// ============================================================
// 第十章：结论与建议
// ============================================================

async function generateConclusionSection(ctx, reportData) {
  const { doc } = ctx;
  const { forcedVibrationResult = {}, systemInput = {} } = reportData;

  doc.addPage();
  ctx.currentPage++;
  ctx.y = MARGIN;

  addSectionTitle(ctx, SECTION_TITLES.conclusion);

  // 10.1 计算结论
  addSubsectionTitle(ctx, '10.1 计算结论');

  const allowable = forcedVibrationResult.allowableStress || {};
  const intermediateMax = Math.max(...(forcedVibrationResult.intermediateShaftStress?.map(s => s.total) || [0]));
  const propellerMax = Math.max(...(forcedVibrationResult.propellerShaftStress?.map(s => s.total) || [0]));

  const isIntermediateSafe = intermediateMax <= (allowable.intermediateShaft || 35);
  const isPropellerSafe = propellerMax <= (allowable.propellerShaft || 30);
  const overallSafe = isIntermediateSafe && isPropellerSafe;

  doc.setFontSize(11);
  ctx.y += LINE_HEIGHT;

  const conclusions = [
    `1. 本轴系共计${systemInput.units?.length || 0}个质量单元，采用传递矩阵法进行扭振计算。`,
    `2. 中间轴最大扭振应力${formatNumber(intermediateMax, 2)} N/mm²，许用应力${formatNumber(allowable.intermediateShaft, 1)} N/mm²，${isIntermediateSafe ? '满足要求' : '不满足要求'}。`,
    `3. 螺旋桨轴最大扭振应力${formatNumber(propellerMax, 2)} N/mm²，许用应力${formatNumber(allowable.propellerShaft, 1)} N/mm²，${isPropellerSafe ? '满足要求' : '不满足要求'}。`,
    `4. 综合评定：本轴系扭振${overallSafe ? '满足CCS规范要求' : '不满足CCS规范要求，需采取措施'}。`
  ];

  conclusions.forEach(text => {
    doc.text(text, MARGIN, ctx.y, { maxWidth: CONTENT_WIDTH });
    ctx.y += LINE_HEIGHT * 1.5;
  });

  // 10.2 建议
  const dangerZones = forcedVibrationResult.dangerZones || [];
  if (dangerZones.length > 0 || !overallSafe) {
    addSubsectionTitle(ctx, '10.2 建议措施');

    const suggestions = [];

    if (!overallSafe) {
      suggestions.push('1. 建议优化轴系设计，降低扭振应力水平。');
      suggestions.push('2. 可考虑增加扭振减振器或更换高弹联轴器。');
    }

    if (dangerZones.some(z => z.inOperatingRange)) {
      suggestions.push('3. 在危险转速区间内应快速通过，避免长时间运行。');
    }

    suggestions.forEach(text => {
      doc.text(text, MARGIN, ctx.y, { maxWidth: CONTENT_WIDTH });
      ctx.y += LINE_HEIGHT * 1.5;
    });
  }

  // 签名区
  ctx.y += 50;
  doc.setFontSize(10);
  doc.text('计算人员：________________', MARGIN + 50, ctx.y);
  doc.text('审核人员：________________', PAGE_WIDTH / 2 + 50, ctx.y);
  ctx.y += 30;
  doc.text('日    期：________________', MARGIN + 50, ctx.y);
  doc.text('日    期：________________', PAGE_WIDTH / 2 + 50, ctx.y);
}

// ============================================================
// 辅助函数
// ============================================================

/**
 * 居中文本
 */
function centerText(doc, text, y) {
  doc.text(text, PAGE_WIDTH / 2, y, { align: 'center' });
}

/**
 * 添加章节标题
 */
function addSectionTitle(ctx, title) {
  const { doc } = ctx;

  doc.setFontSize(16);
  doc.setTextColor(0, 51, 102);
  doc.text(title, MARGIN, ctx.y);

  // 下划线
  doc.setDrawColor(0, 51, 102);
  doc.setLineWidth(1);
  doc.line(MARGIN, ctx.y + 5, PAGE_WIDTH - MARGIN, ctx.y + 5);

  ctx.y += 30;
  doc.setTextColor(40, 40, 40);
}

/**
 * 添加小节标题
 */
function addSubsectionTitle(ctx, title) {
  const { doc } = ctx;

  doc.setFontSize(12);
  doc.setTextColor(60, 60, 60);
  doc.text(title, MARGIN, ctx.y);
  ctx.y += 20;
  doc.setTextColor(40, 40, 40);
}

/**
 * 添加简单表格
 */
function addSimpleTable(ctx, headers, data) {
  const { doc } = ctx;

  doc.autoTable({
    startY: ctx.y,
    head: [headers],
    body: data,
    theme: 'striped',
    tableWidth: CONTENT_WIDTH,
    styles: {
      font: 'NotoSansSC',
      fontStyle: 'normal'
    },
    headStyles: {
      fillColor: [70, 70, 70],
      textColor: 255,
      fontSize: 9,
      halign: 'center',
      cellPadding: 4
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 4,
      overflow: 'linebreak'
    },
    columnStyles: {
      0: { cellWidth: 140 },
      1: { cellWidth: 'auto' }
    },
    margin: { left: MARGIN, right: MARGIN }
  });

  ctx.y = doc.lastAutoTable.finalY + 15;
}

/**
 * 检查是否需要换页
 */
function checkPageBreak(ctx, requiredSpace) {
  if (ctx.y + requiredSpace > PAGE_HEIGHT - MARGIN) {
    ctx.doc.addPage();
    ctx.currentPage++;
    ctx.y = MARGIN;
  }
}

/**
 * 添加页码
 */
function addPageNumbers(ctx) {
  const { doc } = ctx;
  const totalPages = doc.internal.getNumberOfPages();

  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);

    // 跳过封面页
    if (i > 1) {
      doc.text(
        `第 ${i - 1} 页 / 共 ${totalPages - 1} 页`,
        PAGE_WIDTH / 2,
        PAGE_HEIGHT - 20,
        { align: 'center' }
      );
    }
  }
}

/**
 * 格式化数字
 */
function formatNumber(value, decimals = 2) {
  if (value === undefined || value === null || isNaN(value)) return '-';
  return Number(value).toFixed(decimals);
}

// ============================================================
// 报告数据构建器
// ============================================================

/**
 * 从分析结果构建报告数据
 *
 * @param {Object} analysisResult - 完整分析结果
 * @param {Object} metadata - 项目元数据
 * @returns {Object} 报告数据
 */
export function buildReportData(analysisResult, metadata = {}) {
  return {
    metadata: {
      projectName: metadata.projectName || '船舶轴系扭振分析',
      projectNumber: metadata.projectNumber || '',
      vesselType: metadata.vesselType || '',
      mainEngineModel: metadata.mainEngineModel || '',
      gearboxModel: metadata.gearboxModel || '',
      calculator: metadata.calculator || '',
      reviewer: metadata.reviewer || '',
      date: metadata.date || new Date().toLocaleDateString('zh-CN')
    },
    systemInput: analysisResult.systemInput || {},
    freeVibrationResult: analysisResult.freeVibration || {},
    forcedVibrationResult: analysisResult.forcedVibration || {},
    chartImages: {}  // 由UI组件填充
  };
}

export default generateTorsionalReport;
