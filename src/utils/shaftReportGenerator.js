/**
 * 轴系计算报告生成模块 - 数据结构与常量定义
 *
 * 功能：生成预览HTML、导出PDF/Word格式报告
 * 依赖：jspdf, jspdf-autotable, docx, file-saver
 *
 * @module shaftReportGenerator
 */

// ============================================================
// 报告模板常量
// ============================================================

/** 报告标题模板 */
export const REPORT_TITLES = {
  SHAFT_STRENGTH: '轴系强度校核计算书',
  TORSIONAL_VIBRATION: '扭振动态分析报告',
  COMBINED: '轴系综合分析报告',
};

/** 报告章节定义 */
export const REPORT_SECTIONS = {
  COVER: { id: 'cover', title: '封面', order: 0 },
  KNOWN_DATA: { id: 'knownData', title: '已知数据', order: 1 },
  SHAFT_DIAMETER: { id: 'shaftDiameter', title: '基本轴径计算', order: 2 },
  COUPLING: { id: 'coupling', title: '可拆联轴器计算', order: 3 },
  KEY_STRENGTH: { id: 'keyStrength', title: '键强度校核', order: 4 },
  BOLT_STRENGTH: { id: 'boltStrength', title: '螺栓强度校核', order: 5 },
  BEARING: { id: 'bearing', title: '轴承长度校核', order: 6 },
  TORSIONAL: { id: 'torsional', title: '扭振分析', order: 7 },
  CONCLUSION: { id: 'conclusion', title: '结论', order: 8 },
};

/** 报告样式配置 */
export const REPORT_STYLES = {
  PAGE: {
    width: 210,      // A4宽度 (mm)
    height: 297,     // A4高度 (mm)
    marginTop: 25,
    marginBottom: 20,
    marginLeft: 25,
    marginRight: 20,
  },
  FONTS: {
    title: { size: 18, weight: 'bold' },
    heading1: { size: 14, weight: 'bold' },
    heading2: { size: 12, weight: 'bold' },
    body: { size: 10.5, weight: 'normal' },
    table: { size: 9, weight: 'normal' },
    formula: { size: 10, weight: 'normal', style: 'italic' },
  },
  COLORS: {
    primary: '#1a4b8c',
    secondary: '#2d6cb5',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    text: '#333333',
    border: '#dee2e6',
  },
};

/** 表格样式配置 */
export const TABLE_STYLES = {
  headerBackground: '#f8f9fa',
  headerTextColor: '#212529',
  borderColor: '#dee2e6',
  alternateRowColor: '#f8f9fa',
  cellPadding: 5,
};

// ============================================================
// 数据结构定义 (JSDoc类型)
// ============================================================

/**
 * @typedef {Object} ReportMetadata - 报告元数据
 * @property {string} projectName - 项目名称
 * @property {string} projectNumber - 项目编号
 * @property {string} shipName - 船名
 * @property {string} designer - 设计者
 * @property {string} checker - 校核者
 * @property {string} approver - 批准者
 * @property {string} date - 日期
 * @property {string} version - 版本号
 */

/**
 * @typedef {Object} ReportSection - 报告章节
 * @property {string} id - 章节ID
 * @property {string} title - 章节标题
 * @property {string} content - 章节内容 (HTML或纯文本)
 * @property {Object[]} [tables] - 表格数据
 * @property {Object[]} [formulas] - 公式数据
 * @property {string[]} [images] - 图片路径
 */

/**
 * @typedef {Object} ReportData - 完整报告数据
 * @property {ReportMetadata} metadata - 元数据
 * @property {ReportSection[]} sections - 章节列表
 * @property {Object} calculationResults - 计算结果
 * @property {string} generatedAt - 生成时间
 */

/**
 * @typedef {Object} ExportOptions - 导出选项
 * @property {'pdf'|'docx'|'html'} format - 导出格式
 * @property {boolean} includeFormulas - 是否包含公式
 * @property {boolean} includeCharts - 是否包含图表
 * @property {string} [filename] - 自定义文件名
 * @property {string} [watermark] - 水印文字
 */

// ============================================================
// 默认模板
// ============================================================

/** 创建默认报告元数据 */
export function createDefaultMetadata() {
  return {
    projectName: '',
    projectNumber: '',
    shipName: '',
    designer: '',
    checker: '',
    approver: '',
    date: new Date().toISOString().split('T')[0],
    version: '1.0',
  };
}

/** 创建默认导出选项 */
export function createDefaultExportOptions() {
  return {
    format: 'pdf',
    includeFormulas: true,
    includeCharts: true,
    filename: null,
    watermark: null,
  };
}

// ============================================================
// HTML预览生成
// ============================================================

/**
 * 生成报告预览HTML
 * @param {ReportData} reportData - 报告数据
 * @returns {string} HTML字符串
 */
export function generatePreviewHTML(reportData) {
  const { metadata, sections, calculationResults } = reportData;
  const styles = REPORT_STYLES;

  // 封面HTML
  const coverHTML = `
    <div class="report-cover" style="text-align:center; padding:60px 40px;">
      <h1 style="font-size:${styles.FONTS.title.size}pt; color:${styles.COLORS.primary}; margin-bottom:40px;">
        ${metadata.projectName || REPORT_TITLES.SHAFT_STRENGTH}
      </h1>
      <div style="margin:30px 0;">
        <p><strong>项目编号：</strong>${metadata.projectNumber || '-'}</p>
        <p><strong>船　　名：</strong>${metadata.shipName || '-'}</p>
      </div>
      <div style="margin-top:80px; text-align:left; display:inline-block;">
        <p>设　计：${metadata.designer || '_______'}</p>
        <p>校　核：${metadata.checker || '_______'}</p>
        <p>批　准：${metadata.approver || '_______'}</p>
        <p>日　期：${metadata.date}</p>
      </div>
    </div>
  `;

  // 章节HTML
  const sectionsHTML = sections.map((section, idx) => {
    let content = `
      <div class="report-section" style="margin-bottom:20px; page-break-inside:avoid;">
        <h2 style="font-size:${styles.FONTS.heading1.size}pt; color:${styles.COLORS.primary}; border-bottom:2px solid ${styles.COLORS.primary}; padding-bottom:5px;">
          ${idx + 1}. ${section.title}
        </h2>
        <div style="padding:10px 0;">${section.content || ''}</div>
    `;

    // 添加表格
    if (section.tables && section.tables.length > 0) {
      section.tables.forEach(table => {
        content += createTableHTML(table.headers, table.rows, table.title);
      });
    }

    // 添加公式
    if (section.formulas && section.formulas.length > 0) {
      content += '<div class="formulas" style="background:#f8f9fa; padding:15px; margin:10px 0; border-radius:4px;">';
      section.formulas.forEach(f => {
        content += `<p style="font-family:serif; font-style:italic;">${formatFormula(f)}</p>`;
      });
      content += '</div>';
    }

    content += '</div>';
    return content;
  }).join('');

  // 结论HTML
  const conclusionHTML = calculationResults?.isValid !== undefined ? `
    <div class="report-conclusion" style="margin-top:30px; padding:20px; background:${calculationResults.isValid ? '#d4edda' : '#f8d7da'}; border-radius:4px;">
      <h3 style="color:${calculationResults.isValid ? styles.COLORS.success : styles.COLORS.danger};">
        ${calculationResults.isValid ? '✓ 校核通过' : '✗ 校核未通过'}
      </h3>
      ${calculationResults.warnings?.length > 0 ? `
        <ul style="color:${styles.COLORS.warning};">
          ${calculationResults.warnings.map(w => `<li>${w}</li>`).join('')}
        </ul>
      ` : ''}
    </div>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${metadata.projectName || '轴系计算报告'}</title>
      <style>
        body { font-family: 'SimSun', serif; font-size:${styles.FONTS.body.size}pt; color:${styles.COLORS.text}; line-height:1.6; }
        table { width:100%; border-collapse:collapse; margin:10px 0; }
        th, td { border:1px solid ${styles.COLORS.border}; padding:8px; text-align:left; }
        th { background:${TABLE_STYLES.headerBackground}; }
        @media print { .report-section { page-break-inside:avoid; } }
      </style>
    </head>
    <body>
      ${coverHTML}
      <div style="page-break-before:always;"></div>
      ${sectionsHTML}
      ${conclusionHTML}
      <div style="text-align:center; margin-top:40px; color:#999; font-size:9pt;">
        生成时间: ${reportData.generatedAt || new Date().toLocaleString()}
      </div>
    </body>
    </html>
  `;
}

/**
 * 创建表格HTML
 */
function createTableHTML(headers, rows, title = '') {
  const headerRow = headers.map(h => `<th>${h}</th>`).join('');
  const bodyRows = rows.map((row, i) => {
    const bgColor = i % 2 === 1 ? TABLE_STYLES.alternateRowColor : 'white';
    const cells = row.map(cell => `<td>${cell}</td>`).join('');
    return `<tr style="background:${bgColor};">${cells}</tr>`;
  }).join('');

  return `
    <div style="margin:15px 0;">
      ${title ? `<p style="font-weight:bold; margin-bottom:5px;">${title}</p>` : ''}
      <table>
        <thead><tr>${headerRow}</tr></thead>
        <tbody>${bodyRows}</tbody>
      </table>
    </div>
  `;
}

/**
 * 格式化公式显示
 */
export function formatFormula(formula) {
  if (typeof formula === 'object') {
    return `${formula.name}: ${formula.expression} = ${formula.result} ${formula.unit || ''}`;
  }
  return formula;
}

// ============================================================
// PDF导出
// ============================================================

/**
 * 导出PDF报告
 * @param {ReportData} reportData - 报告数据
 * @param {ExportOptions} options - 导出选项
 */
export async function exportToPDF(reportData, options = {}) {
  const { default: jsPDF } = await import('jspdf');
  await import('jspdf-autotable');

  const { metadata, sections, calculationResults } = reportData;
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = REPORT_STYLES.PAGE.width;
  const margin = REPORT_STYLES.PAGE.marginLeft;
  let y = REPORT_STYLES.PAGE.marginTop;

  // 设置中文字体 (需要预加载)
  doc.setFont('helvetica');

  // 封面
  doc.setFontSize(18);
  doc.setTextColor(REPORT_STYLES.COLORS.primary);
  doc.text(metadata.projectName || REPORT_TITLES.SHAFT_STRENGTH, pageWidth / 2, 80, { align: 'center' });

  doc.setFontSize(12);
  doc.setTextColor(REPORT_STYLES.COLORS.text);
  doc.text(`Project: ${metadata.projectNumber || '-'}`, pageWidth / 2, 100, { align: 'center' });
  doc.text(`Ship: ${metadata.shipName || '-'}`, pageWidth / 2, 110, { align: 'center' });
  doc.text(`Date: ${metadata.date}`, pageWidth / 2, 130, { align: 'center' });

  // 章节内容
  sections.forEach((section, idx) => {
    doc.addPage();
    y = REPORT_STYLES.PAGE.marginTop;

    // 标题
    doc.setFontSize(14);
    doc.setTextColor(REPORT_STYLES.COLORS.primary);
    doc.text(`${idx + 1}. ${section.title}`, margin, y);
    y += 10;

    // 内容
    if (section.content) {
      doc.setFontSize(10);
      doc.setTextColor(REPORT_STYLES.COLORS.text);
      const lines = doc.splitTextToSize(section.content.replace(/<[^>]*>/g, ''), pageWidth - 2 * margin);
      doc.text(lines, margin, y);
      y += lines.length * 5 + 10;
    }

    // 表格
    if (section.tables && section.tables.length > 0) {
      section.tables.forEach(table => {
        doc.autoTable({
          startY: y,
          head: [table.headers],
          body: table.rows,
          margin: { left: margin, right: REPORT_STYLES.PAGE.marginRight },
          styles: { fontSize: 9, cellPadding: 3 },
          headStyles: { fillColor: [248, 249, 250], textColor: [33, 37, 41] },
        });
        y = doc.lastAutoTable.finalY + 10;
      });
    }
  });

  // 结论页
  if (calculationResults) {
    doc.addPage();
    y = REPORT_STYLES.PAGE.marginTop;
    doc.setFontSize(14);
    doc.text('Conclusion', margin, y);
    y += 10;

    doc.setFontSize(12);
    const status = calculationResults.isValid ? 'PASSED' : 'FAILED';
    doc.setTextColor(calculationResults.isValid ? '#28a745' : '#dc3545');
    doc.text(`Verification Status: ${status}`, margin, y);
  }

  // 保存
  const filename = options.filename || `shaft-report-${metadata.date}.pdf`;
  doc.save(filename);
  return filename;
}

// ============================================================
// Word导出
// ============================================================

/**
 * 导出Word报告
 * @param {ReportData} reportData - 报告数据
 * @param {ExportOptions} options - 导出选项
 */
export async function exportToWord(reportData, options = {}) {
  const { Document, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, AlignmentType, Packer } = await import('docx');
  const { saveAs } = await import('file-saver');

  const { metadata, sections, calculationResults } = reportData;

  // 创建文档
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // 封面标题
        new Paragraph({
          text: metadata.projectName || REPORT_TITLES.SHAFT_STRENGTH,
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: '' }),
        new Paragraph({
          children: [new TextRun({ text: `项目编号: ${metadata.projectNumber || '-'}` })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: `船名: ${metadata.shipName || '-'}` })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [new TextRun({ text: `日期: ${metadata.date}` })],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({ text: '', pageBreakBefore: true }),

        // 章节内容
        ...sections.flatMap((section, idx) => {
          const sectionParagraphs = [
            new Paragraph({
              text: `${idx + 1}. ${section.title}`,
              heading: HeadingLevel.HEADING_1,
            }),
          ];

          if (section.content) {
            sectionParagraphs.push(new Paragraph({
              children: [new TextRun({ text: section.content.replace(/<[^>]*>/g, '') })],
            }));
          }

          // 表格
          if (section.tables && section.tables.length > 0) {
            section.tables.forEach(table => {
              const tableRows = [
                new TableRow({
                  children: table.headers.map(h => new TableCell({
                    children: [new Paragraph({ text: h, bold: true })],
                  })),
                }),
                ...table.rows.map(row => new TableRow({
                  children: row.map(cell => new TableCell({
                    children: [new Paragraph({ text: String(cell) })],
                  })),
                })),
              ];
              sectionParagraphs.push(new Table({ rows: tableRows }));
              sectionParagraphs.push(new Paragraph({ text: '' }));
            });
          }

          return sectionParagraphs;
        }),

        // 结论
        ...(calculationResults ? [
          new Paragraph({
            text: '结论',
            heading: HeadingLevel.HEADING_1,
          }),
          new Paragraph({
            children: [new TextRun({
              text: calculationResults.isValid ? '✓ 校核通过' : '✗ 校核未通过',
              bold: true,
              color: calculationResults.isValid ? '28a745' : 'dc3545',
            })],
          }),
        ] : []),
      ],
    }],
  });

  // 导出
  const blob = await Packer.toBlob(doc);
  const filename = options.filename || `shaft-report-${metadata.date}.docx`;
  saveAs(blob, filename);
  return filename;
}

// ============================================================
// 辅助函数
// ============================================================

/**
 * 从计算结果构建报告数据
 */
export function buildReportFromResults(shaftResults, torsionalResults, metadata = {}) {
  const sections = [];

  // 已知数据章节
  if (shaftResults?.input) {
    sections.push({
      id: 'knownData',
      title: '已知数据',
      content: '以下为本次计算的输入参数：',
      tables: [{
        title: '动力源参数',
        headers: ['参数', '数值', '单位'],
        rows: [
          ['功率', shaftResults.input.powerSource?.power || '-', 'kW'],
          ['转速', shaftResults.input.powerSource?.speed || '-', 'rpm'],
          ['类型', shaftResults.input.powerSource?.type || '-', ''],
        ],
      }],
    });
  }

  // 轴径计算章节
  if (shaftResults?.shaftDiameter) {
    sections.push({
      id: 'shaftDiameter',
      title: '基本轴径计算',
      content: shaftResults.shaftDiameter.formula || '',
      tables: [{
        title: '轴径计算结果',
        headers: ['轴类型', '计算直径(mm)', '实际直径(mm)', '状态'],
        rows: [
          ['艉轴', shaftResults.shaftDiameter.calculated, shaftResults.shaftDiameter.actual || '-', shaftResults.shaftDiameter.isValid ? '✓' : '✗'],
        ],
      }],
    });
  }

  // 扭振分析章节
  if (torsionalResults) {
    sections.push({
      id: 'torsional',
      title: '扭振动态分析',
      content: `固有频率: ${torsionalResults.naturalFrequency?.frequency || '-'} Hz`,
      tables: [{
        title: '临界转速校核',
        headers: ['激励阶次', '临界转速(rpm)', '下限(rpm)', '上限(rpm)', '状态'],
        rows: (torsionalResults.avoidanceChecks || []).map(c => [
          c.order, c.criticalSpeed, c.lowerLimit, c.upperLimit, c.status
        ]),
      }],
    });
  }

  return {
    metadata: { ...createDefaultMetadata(), ...metadata },
    sections,
    calculationResults: {
      isValid: (shaftResults?.isValid !== false) && (torsionalResults?.isValid !== false),
      warnings: [...(shaftResults?.warnings || []), ...(torsionalResults?.warnings || [])],
    },
    generatedAt: new Date().toISOString(),
  };
}
