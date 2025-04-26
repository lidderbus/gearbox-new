// src/utils/contractExporter.js
/**
 * 合同导出工具
 * 提供导出合同为PDF和Word格式的功能
 */

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle } from 'docx';
import NotoSansSCFont from '../fonts/NotoSansSC-Regular-normal';
// 移除有问题的导入
// import { PDFGenerationErrorHandler } from './dataValidator';
import { convertToChinaNum } from './numberConverter';

// 创建自定义错误处理器类
class PDFErrorHandler {
  constructor() {
    this.errors = [];
  }
  
  handleFontLoadingError(error) {
    console.warn('PDF字体加载失败:', error);
    this.errors.push({
      type: 'font',
      error,
      message: '加载中文字体失败，将使用默认字体',
      timestamp: new Date()
    });
  }
  
  handleTableGenerationError(error, data) {
    console.error('PDF表格生成失败:', error, data);
    this.errors.push({
      type: 'table',
      error,
      data,
      message: '表格生成失败，将使用简化表格',
      timestamp: new Date()
    });
  }
  
  handleFileSavingError(error, filename) {
    console.error(`保存文件 ${filename} 失败:`, error);
    this.errors.push({
      type: 'file',
      error,
      filename,
      message: `文件 ${filename} 保存失败`,
      timestamp: new Date()
    });
  }
  
  getUserFriendlyErrorMessage(error) {
    if (!error) return null;
    
    if (error.message && error.message.includes('font')) {
      return '生成文档时字体加载失败，某些中文字符可能显示不正确。';
    }
    
    if (error.message && error.message.includes('table')) {
      return '生成表格时出现问题，表格可能无法正确显示。';
    }
    
    if (error.message && error.message.includes('save')) {
      return '保存文件时出现问题，请检查您的存储空间和权限。';
    }
    
    return `生成文档时出现错误: ${error.message || error}`;
  }
  
  clear() {
    this.errors = [];
  }
}

// 创建错误处理器实例
const pdfErrorHandler = new PDFErrorHandler();

/**
 * PDF导出状态管理类
 * 管理导出过程中的状态和错误处理
 */
export class ExportManager {
  constructor() {
    this.status = 'idle'; // idle, preparing, generating, exporting, completed, error
    this.progress = 0;    // 0-100
    this.error = null;
    this.result = null;
    this.onStatusChange = null;
    this.errorHandler = pdfErrorHandler;
  }
  
  // 更新状态并触发回调
  updateStatus(status, progress = null, error = null, result = null) {
    this.status = status;
    if (progress !== null) this.progress = progress;
    if (error !== null) this.error = error;
    if (result !== null) this.result = result;
    
    if (typeof this.onStatusChange === 'function') {
      this.onStatusChange({
        status: this.status,
        progress: this.progress,
        error: this.error,
        result: this.result
      });
    }
  }
  
  // 获取当前状态
  getStatus() {
    return {
      status: this.status,
      progress: this.progress,
      error: this.error,
      result: this.result
    };
  }
  
  // 重置状态
  reset() {
    this.status = 'idle';
    this.progress = 0;
    this.error = null;
    this.result = null;
    this.errorHandler.clear();
    
    if (typeof this.onStatusChange === 'function') {
      this.onStatusChange({
        status: this.status,
        progress: this.progress,
        error: this.error,
        result: this.result
      });
    }
  }
}

/**
 * PDF导出器
 * 处理将合同导出为PDF的全过程
 */
export class PDFExporter extends ExportManager {
  /**
   * 导出合同为PDF
   * @param {Object} contract - 合同数据
   * @param {string} filename - 导出文件名
   * @returns {Promise<boolean>} - 导出结果
   */
  async exportContract(contract, filename = 'contract') {
    try {
      this.reset();
      this.updateStatus('preparing', 10);
      
      // 验证合同数据
      if (!contract || !contract.success) {
        throw new Error('合同数据无效');
      }
      
      // 创建PDF实例
      const doc = new jsPDF({
        orientation: 'p', // 纵向
        unit: 'mm',
        format: 'a4',
      });
      
      this.updateStatus('generating', 20);
      
      // 添加中文字体支持
      try {
        doc.addFileToVFS('NotoSansSC-Regular-normal.ttf', NotoSansSCFont.font);
        doc.addFont('NotoSansSC-Regular-normal.ttf', 'NotoSansSC', 'normal');
        doc.setFont('NotoSansSC');
      } catch (fontError) {
        this.errorHandler.handleFontLoadingError(fontError);
        // 继续使用默认字体
      }
      
      // 设置基本样式
      doc.setFontSize(14);
      
      this.updateStatus('generating', 30);
      
      // 添加标题
      doc.setFontSize(16);
      doc.text('上海前进齿轮经营有限公司产品销售合同', doc.internal.pageSize.getWidth() / 2, 20, {
        align: 'center',
      });
      
      // 合同编号等基本信息
      doc.setFontSize(10);
      doc.text(`签订地点：上海`, 20, 30);
      doc.text(`合同编号：${contract.contractNumber || ''}`, 120, 30);
      doc.text(`签订日期：${contract.contractDate || ''}`, 20, 35);
      doc.text(`统计编号：`, 120, 35);
      
      this.updateStatus('generating', 40);
      
      // 需方和供方信息
      doc.setFontSize(12);
      doc.text('需方信息：', 20, 45);
      doc.setFontSize(10);
      doc.text(`单位名称：${contract.buyerInfo?.name || ''}`, 25, 50);
      doc.text(`通讯地址：${contract.buyerInfo?.address || ''}`, 25, 55);
      doc.text(`法定代表人：${contract.buyerInfo?.legalRepresentative || ''}`, 25, 60);
      doc.text(`银行及账号：${contract.buyerInfo?.bank || ''} ${contract.buyerInfo?.accountNumber || ''}`, 25, 65);
      
      doc.setFontSize(12);
      doc.text('供方信息：', 120, 45);
      doc.setFontSize(10);
      doc.text(`单位名称：${contract.sellerInfo?.name || ''}`, 125, 50);
      doc.text(`通讯地址：${contract.sellerInfo?.address || ''}`, 125, 55);
      doc.text(`法定代表人：${contract.sellerInfo?.legalRepresentative || ''}`, 125, 60);
      doc.text(`银行及账号：${contract.sellerInfo?.bank || ''} ${contract.sellerInfo?.accountNumber || ''}`, 125, 65);
      
      this.updateStatus('generating', 50);
      
      // 产品信息表格
      try {
        const tableData = Array.isArray(contract.products) ? contract.products.map((product, index) => [
          index + 1,
          product.name || '',
          product.model || '',
          product.unit || '',
          product.quantity || '',
          product.unitPrice ? product.unitPrice.toLocaleString() : '',
          product.amount ? product.amount.toLocaleString() : '',
          product.deliveryQuarter ? `第${product.deliveryQuarter}季度` : '',
        ]) : [];
        
        doc.autoTable({
          startY: 75,
          head: [['序号', '产品名称', '规格型号', '单位', '数量', '单价(元)', '金额', '交货期']],
          body: tableData,
          theme: 'grid',
          styles: { 
            font: doc.getFont().fontName === 'NotoSansSC' ? 'NotoSansSC' : undefined,
            fontSize: 9 
          },
          headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
        });
      } catch (tableError) {
        this.errorHandler.handleTableGenerationError(tableError, contract.products);
        
        // 添加简单的备用文本
        doc.text('产品表格生成失败，请检查产品数据', 20, 80);
        
        // 创建一个简单的表格作为备用
        doc.autoTable({
          startY: 85,
          head: [['序号', '产品名称', '规格型号', '单位', '数量', '单价(元)', '金额']],
          body: [
            ['1', contract.products && contract.products[0] ? contract.products[0].name : '船用齿轮箱', '', '台', '1', '', ''],
          ],
          theme: 'grid',
        });
      }
      
      this.updateStatus('generating', 60);
      
      // 合计金额
      const tableHeight = doc.lastAutoTable ? doc.lastAutoTable.finalY : 120;
      doc.setFontSize(10);
      doc.text(`合计人民币(大写)：${contract.totalAmountInChinese || ''}`, 20, tableHeight + 10);
      doc.text(`¥(小写)：${contract.totalAmount ? contract.totalAmount.toLocaleString() : '0'}`, 120, tableHeight + 10);
      
      // 合同条款
      doc.setFontSize(12);
      doc.text('合同条款：', 20, tableHeight + 20);
      doc.setFontSize(9);
      
      this.updateStatus('generating', 70);
      
      // 创建一个函数来处理可能的溢出文本
      const addText = (text, x, yPos) => {
        // 检查是否将要超出页面底部
        if (yPos > doc.internal.pageSize.getHeight() - 20) {
          doc.addPage();
          return 20; // 新页面的起始y坐标
        }
        doc.text(text, x, yPos);
        return yPos + 5; // 行高
      };
      
      let y = tableHeight + 25;
      y = addText(`1. 执行质量标准：${contract.executionStandard || '按国家标准'}`, 25, y);
      y = addText(`2. 验收及提出质量异议期限：${contract.inspectionPeriod || ''}`, 25, y);
      y = addText(`3. 交货时间：${contract.deliveryDate || ''}`, 25, y);
      y = addText(`4. 交货地点：${contract.deliveryLocation || ''}`, 25, y);
      y = addText(`5. 交货方式：${contract.deliveryMethod || ''}`, 25, y);
      y = addText(`6. 运输方式：${contract.transportMethod || ''} 运费结算：${contract.transportFeeArrangement || ''}`, 25, y);
      y = addText(`7. 包装标准：${contract.packagingStandard || ''} 包装费：${contract.packagingFeeArrangement || ''}`, 25, y);
      y = addText(`8. 结算方式及期限：${contract.paymentMethod || ''}`, 25, y);
      y = addText(`9. 违约责任：按"民法典"规定条款执行。`, 25, y);
      y = addText(`10. ${contract.disputeResolution || ''}`, 25, y);
      y = addText(`11. 其他约定事项或特殊订货要求：${contract.specialRequirements || '无'}`, 25, y);
      y = addText(`12. 合同有效期限：自签订日起至${contract.expiryDate || ''}止`, 25, y);
      y = addText(`13. ${contract.contractCopies || '本合同一式两份，双方各持一份。'}`, 25, y);
      
      y += 15; // 添加额外的间距
      
      this.updateStatus('generating', 80);
      
      // 签名区域
      if (y > doc.internal.pageSize.getHeight() - 60) {
        doc.addPage();
        y = 30;
      }
      
      doc.text('需方(盖章)：', 30, y);
      doc.text('供方(盖章)：', 120, y);
      y += 20;
      doc.text('法定代表人或委托代理人(签字)：', 30, y);
      doc.text('法定代表人或委托代理人(签字)：', 120, y);
      y += 15;
      doc.text('日期：', 30, y);
      doc.text('日期：', 120, y);
      
      this.updateStatus('exporting', 90);
      
      // 保存文件
      try {
        doc.save(`${filename}.pdf`);
      } catch (saveError) {
        this.errorHandler.handleFileSavingError(saveError, `${filename}.pdf`);
        throw saveError;
      }
      
      this.updateStatus('completed', 100, null, { filename: `${filename}.pdf` });
      return true;
    } catch (error) {
      console.error('导出合同PDF失败:', error);
      this.updateStatus('error', 0, error);
      return false;
    }
  }
  
  // 获取用户友好的错误消息
  getErrorMessage() {
    if (!this.error) return null;
    
    return this.errorHandler.getUserFriendlyErrorMessage(this.error);
  }
}

/**
 * Word导出器
 * 处理将合同导出为Word的全过程
 */
export class WordExporter extends ExportManager {
  /**
   * 导出合同为Word
   * @param {Object} contract - 合同数据
   * @param {string} filename - 导出文件名
   * @returns {Promise<boolean>} - 导出结果
   */
  async exportContract(contract, filename = 'contract') {
    try {
      this.reset();
      this.updateStatus('preparing', 10);
      
      // 验证合同数据
      if (!contract || !contract.success) {
        throw new Error('合同数据无效');
      }
      
      this.updateStatus('generating', 30);
      
      // 创建Document
      const doc = new Document({
        styles: {
          paragraphStyles: [
            {
              id: 'Normal',
              name: 'Normal',
              quickFormat: true,
              run: {
                size: 24, // 12pt
                font: 'SimSun', // 宋体，通常Word中文兼容性好
              },
              paragraph: {
                spacing: {
                  line: 360, // 1.5倍行距
                },
              },
            },
            {
              id: 'Heading1',
              name: 'Heading 1',
              quickFormat: true,
              run: {
                size: 32, // 16pt
                bold: true,
                font: 'SimHei', // 黑体
              },
              paragraph: {
                spacing: {
                  before: 240, // 前间距12pt
                  after: 120, // 后间距6pt
                },
              },
            },
          ],
        },
        sections: [
          {
            properties: {},
            children: [
              // 标题
              new Paragraph({
                text: '上海前进齿轮经营有限公司产品销售合同',
                heading: HeadingLevel.HEADING_1,
                alignment: AlignmentType.CENTER,
              }),
              
              // 合同基本信息
              new Paragraph({
                spacing: {
                  before: 400,
                  after: 200,
                },
                children: [
                  new TextRun({ text: '签订地点：上海', size: 24 }),
                  new TextRun({ text: '\t\t', size: 24 }),
                  new TextRun({ text: `合同编号：${contract.contractNumber || ''}`, size: 24 }),
                  new TextRun({ text: '\n', size: 24 }),
                  new TextRun({ text: `签订日期：${contract.contractDate || ''}`, size: 24 }),
                  new TextRun({ text: '\t\t', size: 24 }),
                  new TextRun({ text: `统计编号：`, size: 24 }),
                ],
              }),
              
              // 创建买卖方信息表格
              new Table({
                width: {
                  size: 100,
                  type: WidthType.PERCENTAGE,
                },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                },
                rows: [
                  // 标题行
                  new TableRow({
                    children: [
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ 
                          text: '需方', 
                          alignment: AlignmentType.CENTER 
                        })],
                        columnSpan: 1,
                      }),
                      new TableCell({
                        width: { size: 50, type: WidthType.PERCENTAGE },
                        children: [new Paragraph({ 
                          text: '供方', 
                          alignment: AlignmentType.CENTER 
                        })],
                        columnSpan: 1,
                      }),
                    ],
                  }),
                  // 单位名称行
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: `单位名称：${contract.buyerInfo?.name || ''}` })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: `单位名称：${contract.sellerInfo?.name || ''}` })],
                      }),
                    ],
                  }),
                  // 通讯地址行
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: `通讯地址：${contract.buyerInfo?.address || ''}` })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: `通讯地址：${contract.sellerInfo?.address || ''}` })],
                      }),
                    ],
                  }),
                  // 法定代表人行
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: `法定代表人：${contract.buyerInfo?.legalRepresentative || ''}` })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: `法定代表人：${contract.sellerInfo?.legalRepresentative || ''}` })],
                      }),
                    ],
                  }),
                  // 银行及账号行
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ text: `银行及账号：${contract.buyerInfo?.bank || ''} ${contract.buyerInfo?.accountNumber || ''}` })],
                      }),
                      new TableCell({
                        children: [new Paragraph({ text: `银行及账号：${contract.sellerInfo?.bank || ''} ${contract.sellerInfo?.accountNumber || ''}` })],
                      }),
                    ],
                  }),
                ],
              }),
              
              // 空白行
              new Paragraph({ text: '' }),
              
              // 添加产品信息表格
              new Table({
                width: { size: 100, type: WidthType.PERCENTAGE },
                borders: {
                  top: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  bottom: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  left: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  right: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                  insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "auto" },
                },
                rows: [
                  // 表头
                  new TableRow({
                    children: [
                      new TableCell({ children: [new Paragraph({ text: '序号', alignment: AlignmentType.CENTER })], width: { size: 5, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ text: '产品名称', alignment: AlignmentType.CENTER })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ text: '规格型号', alignment: AlignmentType.CENTER })], width: { size: 20, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ text: '单位', alignment: AlignmentType.CENTER })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ text: '数量', alignment: AlignmentType.CENTER })], width: { size: 10, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ text: '单价(元)', alignment: AlignmentType.CENTER })], width: { size: 15, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ text: '金额', alignment: AlignmentType.CENTER })], width: { size: 15, type: WidthType.PERCENTAGE } }),
                      new TableCell({ children: [new Paragraph({ text: '交货期', alignment: AlignmentType.CENTER })], width: { size: 15, type: WidthType.PERCENTAGE } }),
                    ],
                  }),
                  // 产品行 - 创建产品行函数
                  ...(Array.isArray(contract.products) ? contract.products.map((product, index) => 
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ text: (index + 1).toString(), alignment: AlignmentType.CENTER })]}),
                        new TableCell({ children: [new Paragraph({ text: product.name || '' })]}),
                        new TableCell({ children: [new Paragraph({ text: product.model || '' })]}),
                        new TableCell({ children: [new Paragraph({ text: product.unit || '', alignment: AlignmentType.CENTER })]}),
                        new TableCell({ children: [new Paragraph({ text: product.quantity ? product.quantity.toString() : '', alignment: AlignmentType.CENTER })]}),
                        new TableCell({ children: [new Paragraph({ text: product.unitPrice ? product.unitPrice.toLocaleString() : '', alignment: AlignmentType.RIGHT })]}),
                        new TableCell({ children: [new Paragraph({ text: product.amount ? product.amount.toLocaleString() : '', alignment: AlignmentType.RIGHT })]}),
                        new TableCell({ children: [new Paragraph({ text: `${product.deliveryYear || ''}年第${product.deliveryQuarter || ''}季度` })]}),
                      ],
                    })
                  ) : [
                    // 如果没有产品，至少添加一个空行
                    new TableRow({
                      children: [
                        new TableCell({ children: [new Paragraph({ text: '1', alignment: AlignmentType.CENTER })]}),
                        new TableCell({ children: [new Paragraph({ text: '船用齿轮箱' })]}),
                        new TableCell({ children: [new Paragraph({ text: '' })]}),
                        new TableCell({ children: [new Paragraph({ text: '台', alignment: AlignmentType.CENTER })]}),
                        new TableCell({ children: [new Paragraph({ text: '1', alignment: AlignmentType.CENTER })]}),
                        new TableCell({ children: [new Paragraph({ text: '', alignment: AlignmentType.RIGHT })]}),
                        new TableCell({ children: [new Paragraph({ text: '', alignment: AlignmentType.RIGHT })]}),
                        new TableCell({ children: [new Paragraph({ text: '' })]}),
                      ],
                    })
                  ]),
                ],
              }),
              
              // 合计行
              new Paragraph({
                spacing: { before: 200, after: 200 },
                children: [
                  new TextRun({ text: `合计人民币(大写)：${contract.totalAmountInChinese || ''}`, size: 24, bold: true }),
                  new TextRun({ text: '\t', size: 24 }),
                  new TextRun({ text: `¥(小写)：${contract.totalAmount ? contract.totalAmount.toLocaleString() : '0'}`, size: 24, bold: true }),
                ],
              }),
              
              // 合同条款
              new Paragraph({ text: '合同条款：', bold: true }),
              new Paragraph({ text: `1. 执行质量标准：${contract.executionStandard || '按国家标准'}` }),
              new Paragraph({ text: `2. 验收及提出质量异议期限：${contract.inspectionPeriod || ''}` }),
              new Paragraph({ text: `3. 交货时间：${contract.deliveryDate || ''}` }),
              new Paragraph({ text: `4. 交货地点：${contract.deliveryLocation || ''}` }),
              new Paragraph({ text: `5. 交货方式：${contract.deliveryMethod || ''}` }),
              new Paragraph({ text: `6. 运输方式：${contract.transportMethod || ''} 运费结算：${contract.transportFeeArrangement || ''}` }),
              new Paragraph({ text: `7. 包装标准：${contract.packagingStandard || ''} 包装费：${contract.packagingFeeArrangement || ''}` }),
              new Paragraph({ text: `8. 结算方式及期限：${contract.paymentMethod || ''}` }),
              new Paragraph({ text: `9. 违约责任：按"民法典"规定条款执行。` }),
              new Paragraph({ text: `10. ${contract.disputeResolution || ''}` }),
              new Paragraph({ text: `11. 其他约定事项或特殊订货要求：${contract.specialRequirements || '无'}` }),
              new Paragraph({ text: `12. 合同有效期限：自签订日起至${contract.expiryDate || ''}止` }),
              new Paragraph({ text: `13. ${contract.contractCopies || '本合同一式两份，双方各持一份。'}` }),
              
              // 签名区域
              new Paragraph({
                spacing: {
                  before: 800,
                },
                children: [
                  new TextRun({ text: '需方（盖章）：', size: 24 }),
                  new TextRun({ text: '\t\t\t\t\t', size: 24 }),
                  new TextRun({ text: '供方（盖章）：', size: 24 }),
                  new TextRun({ text: '\n\n\n', size: 24 }),
                  new TextRun({ text: '法定代表人或委托代理人（签字）：', size: 24 }),
                  new TextRun({ text: '\t\t', size: 24 }),
                  new TextRun({ text: '法定代表人或委托代理人（签字）：', size: 24 }),
                  new TextRun({ text: '\n\n', size: 24 }),
                  new TextRun({ text: '日期：', size: 24 }),
                  new TextRun({ text: '\t\t\t\t\t\t', size: 24 }),
                  new TextRun({ text: '日期：', size: 24 }),
                ],
              }),
            ],
          },
        ],
      });
      
      this.updateStatus('exporting', 90);
      
      // 导出Word文档
      try {
        await Packer.toBlob(doc).then(blob => {
          saveAs(blob, `${filename}.docx`);
          this.updateStatus('completed', 100, null, { filename: `${filename}.docx` });
        });
        
        return true;
      } catch (saveError) {
        this.errorHandler.handleFileSavingError(saveError, `${filename}.docx`);
        throw saveError;
      }
    } catch (error) {
      console.error('导出合同Word失败:', error);
      this.updateStatus('error', 0, error);
      return false;
    }
  }
}

/**
 * 创建默认的PDF导出器实例
 * @returns {PDFExporter} PDF导出器实例
 */
export const createPDFExporter = () => {
  return new PDFExporter();
};

/**
 * 创建默认的Word导出器实例
 * @returns {WordExporter} Word导出器实例
 */
export const createWordExporter = () => {
  return new WordExporter();
};

/**
 * 导出合同助手类
 * 提供常用的合同导出功能
 */
export class ContractExportHelper {
  constructor() {
    this.pdfExporter = new PDFExporter();
    this.wordExporter = new WordExporter();
  }
  
  /**
   * 导出为PDF
   * @param {Object} contract - 合同数据
   * @param {string} filename - 文件名
   * @param {function} onProgress - 进度回调函数
   * @returns {Promise<boolean>} 导出结果
   */
  async exportToPDF(contract, filename, onProgress) {
    // 设置进度回调
    if (typeof onProgress === 'function') {
      this.pdfExporter.onStatusChange = onProgress;
    }
    
    // 导出文件
    return await this.pdfExporter.exportContract(contract, filename);
  }
  
  /**
   * 导出为Word
   * @param {Object} contract - 合同数据
   * @param {string} filename - 文件名
   * @param {function} onProgress - 进度回调函数
   * @returns {Promise<boolean>} 导出结果
   */
  async exportToWord(contract, filename, onProgress) {
    // 设置进度回调
    if (typeof onProgress === 'function') {
      this.wordExporter.onStatusChange = onProgress;
    }
    
    // 导出文件
    return await this.wordExporter.exportContract(contract, filename);
  }
  
  /**
   * 验证合同数据
   * @param {Object} contract - 合同数据
   * @returns {Object} 验证结果 { valid, errors, warnings }
   */
  validateContract(contract) {
    const errors = [];
    const warnings = [];
    
    // 基本验证
    if (!contract) {
      errors.push('合同数据为空');
      return { valid: false, errors, warnings };
    }
    
    if (!contract.success) {
      errors.push('合同数据标记为无效（success: false）');
    }
    
    // 检查必要字段
    if (!contract.contractNumber) {
      warnings.push('合同缺少合同编号');
    }
    
    if (!contract.contractDate) {
      warnings.push('合同缺少签订日期');
    }
    
    // 检查买方信息
    if (!contract.buyerInfo || !contract.buyerInfo.name) {
      warnings.push('合同缺少买方名称');
    }
    
    // 检查产品信息
    if (!contract.products || !Array.isArray(contract.products) || contract.products.length === 0) {
      errors.push('合同缺少产品信息');
    } else {
      // 检查每个产品
      contract.products.forEach((product, index) => {
        if (!product.name) {
          warnings.push(`第${index + 1}个产品缺少名称`);
        }
        
        if (!product.model) {
          warnings.push(`第${index + 1}个产品缺少型号`);
        }
        
        if (!product.unitPrice || isNaN(parseFloat(product.unitPrice))) {
          warnings.push(`第${index + 1}个产品缺少有效的单价`);
        }
        
        if (!product.amount || isNaN(parseFloat(product.amount))) {
          warnings.push(`第${index + 1}个产品缺少有效的金额`);
        }
      });
    }
    
    // 检查金额
    if (!contract.totalAmount || isNaN(parseFloat(contract.totalAmount))) {
      warnings.push('合同缺少有效的总金额');
    }
    
    if (!contract.totalAmountInChinese) {
      warnings.push('合同缺少中文大写金额');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
  
  /**
   * 创建基本合同名称
   * @param {Object} contract - 合同数据
   * @returns {string} 合同文件名（不含扩展名）
   */
  createDefaultFilename(contract) {
    // 获取当前日期字符串
    const dateStr = new Date().toISOString().split('T')[0];
    
    // 提取客户和项目名称
    const customerName = contract.buyerInfo?.name || '未命名客户';
    const projectName = contract.projectName || '';
    
    // 创建文件名
    return `${customerName}-${projectName ? projectName + '-' : ''}销售合同-${dateStr}`;
  }
  
  /**
   * 获取最近的错误信息
   * @returns {string|null} 错误信息
   */
  getLastErrorMessage() {
    // 优先返回PDF导出器的错误
    if (this.pdfExporter.error) {
      return this.pdfExporter.errorHandler.getUserFriendlyErrorMessage(this.pdfExporter.error);
    }
    
    // 其次返回Word导出器的错误
    if (this.wordExporter.error) {
      return this.wordExporter.errorHandler.getUserFriendlyErrorMessage(this.wordExporter.error);
    }
    
    return null;
  }
  
  /**
   * 重置导出器状态
   */
  reset() {
    this.pdfExporter.reset();
    this.wordExporter.reset();
  }
}

// 导出默认的合同导出助手实例
export const contractExportHelper = new ContractExportHelper();

// 导出PDF和Word导出函数
export const exportContractToPDF = async (contract, filename) => {
  const exporter = new PDFExporter();
  return await exporter.exportContract(contract, filename);
};

export const exportContractToWord = async (contract, filename) => {
  const exporter = new WordExporter();
  return await exporter.exportContract(contract, filename);
};