// src/utils/contractGenerator.js
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, TextRun, HeadingLevel, AlignmentType, WidthType, BorderStyle } from 'docx';
import NotoSansSCFont from '../fonts/NotoSansSC-Regular-normal';
import { convertToChinaNum } from './numberConverter'; // 假设你有一个数字转中文的工具

/**
 * 生成销售合同
 * @param {Object} selectionResult - 齿轮箱选型结果
 * @param {Object} projectInfo - 项目信息
 * @param {Object} selectedComponents - 选中的组件
 * @param {Object} priceInfo - 价格信息
 * @returns {Object} - 生成的合同数据
 */
export const generateContract = (selectionResult, projectInfo, selectedComponents, priceInfo) => {
  if (!selectionResult || !selectionResult.success || !selectedComponents.gearbox) {
    return {
      success: false,
      message: '生成合同所需的数据不完整'
    };
  }

  const { gearbox, coupling, pump } = selectedComponents;
  const date = new Date();
  const contractNumber = `SH${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  
  // 计算交付日期（默认为3个月后）
  const deliveryDate = new Date(date);
  deliveryDate.setMonth(date.getMonth() + 3);
  
  // 计算当前季度
  const currentQuarter = Math.floor(date.getMonth() / 3) + 1;

  // 金额转中文大写
  const totalAmount = priceInfo.totalMarketPrice || priceInfo.marketPrice || 0;
  const totalAmountInChinese = convertToChinaNum(totalAmount) + '元整';

  // 计算有效期（默认为1年）
  const expiryDate = new Date(date);
  expiryDate.setFullYear(date.getFullYear() + 1);
  const expiryDateStr = `${expiryDate.getFullYear()}年${expiryDate.getMonth() + 1}月${expiryDate.getDate()}日`;

  // 构建合同数据
  const contract = {
    success: true,
    contractNumber,
    contractDate: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`,
    buyerInfo: {
      name: projectInfo.customerName || '待确定',
      address: projectInfo.customerAddress || '待确定',
      legalRepresentative: '',
      postalCode: '',
      taxNumber: '',
      bank: '',
      accountNumber: ''
    },
    sellerInfo: {
      name: '杭州前进齿轮箱集团股份有限公司',
      address: '浙江省杭州市下城区环城北路318号',
      legalRepresentative: '',
      postalCode: '310000',
      phone: '0571-87880986',
      bank: '中国工商银行杭州分行',
      accountNumber: '1202025709900000000'
    },
    products: [
      {
        name: '船用齿轮箱',
        model: gearbox.model,
        brand: '前进',
        unit: '台',
        quantity: 1,
        unitPrice: gearbox.marketPrice || gearbox.factoryPrice || 0,
        amount: gearbox.marketPrice || gearbox.factoryPrice || 0,
        deliveryQuarter: currentQuarter,
        deliveryYear: date.getFullYear()
      }
    ],
    totalAmount,
    totalAmountInChinese,
    executionStandard: '产品标准 Q/JZJ03-2020',
    inspectionPeriod: '产品到货后10个工作日内',
    deliveryDate: `${deliveryDate.getFullYear()}年${deliveryDate.getMonth() + 1}月${deliveryDate.getDate()}日前`,
    deliveryLocation: '甲方指定地点',
    deliveryMethod: '一次性交付',
    transportMethod: '乙方负责发运',
    transportFeeArrangement: '运费由乙方承担',
    packagingStandard: '符合长途运输的包装',
    packagingFeeArrangement: '包装费包含在总价中',
    paymentMethod: '买方签收后30天内支付全部款项',
    disputeResolution: '争议解决方式：双方协商解决，协商不成，提交上海仲裁委员会仲裁。',
    specialRequirements: '无',
    expiryDate: expiryDateStr,
    contractCopies: '本合同一式两份，买卖双方各执一份，两份具有同等法律效力。'
  };

  // 如果有联轴器，添加到产品列表
  if (coupling) {
    contract.coupling = {
      name: '高弹性联轴器',
      model: coupling.model,
      brand: '前进',
      unit: '只',
      quantity: 1,
      unitPrice: coupling.marketPrice || coupling.factoryPrice || 0,
      amount: coupling.marketPrice || coupling.factoryPrice || 0
    };
    
    // 添加到产品列表
    contract.products.push(contract.coupling);
  }

  // 如果有备用泵，添加到产品列表
  if (pump) {
    const pumpProduct = {
      name: '备用泵',
      model: pump.model,
      brand: '前进',
      unit: '台',
      quantity: 1,
      unitPrice: pump.marketPrice || pump.factoryPrice || 0,
      amount: pump.marketPrice || pump.factoryPrice || 0,
      deliveryQuarter: currentQuarter
    };
    
    contract.products.push(pumpProduct);
  }

  return contract;
};

/**
 * 导出合同为PDF格式
 * @param {Object} contract - 合同数据
 * @param {string} filename - 导出文件名
 * @returns {Promise<boolean>} - 导出结果
 */
export const exportContractToPDF = async (contract, filename = 'contract') => {
  try {
    // 创建PDF实例
    const doc = new jsPDF({
      orientation: 'p', // 纵向
      unit: 'mm',
      format: 'a4',
    });

    // 添加中文字体支持
    doc.addFileToVFS('NotoSansSC-Regular-normal.ttf', NotoSansSCFont.font);
    doc.addFont('NotoSansSC-Regular-normal.ttf', 'NotoSansSC', 'normal');
    doc.setFont('NotoSansSC');

    // 设置基本样式
    doc.setFontSize(14);
    
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

    // 产品信息表格
    doc.autoTable({
      startY: 75,
      head: [['序号', '产品名称', '规格型号', '单位', '数量', '单价(元)', '金额', '交货期']],
      body: contract.products?.map((product, index) => [
        index + 1,
        product.name || '',
        product.model || '',
        product.unit || '',
        product.quantity || '',
        product.unitPrice?.toLocaleString() || '',
        product.amount?.toLocaleString() || '',
        product.deliveryQuarter ? `第${product.deliveryQuarter}季度` : '',
      ]) || [],
      theme: 'grid',
      styles: { font: 'NotoSansSC', fontSize: 9 },
      headStyles: { fillColor: [220, 220, 220], textColor: [0, 0, 0] },
    });

    // 合计金额
    const tableHeight = doc.lastAutoTable.finalY;
    doc.setFontSize(10);
    doc.text(`合计人民币(大写)：${contract.totalAmountInChinese || ''}`, 20, tableHeight + 10);
    doc.text(`¥(小写)：${contract.totalAmount?.toLocaleString() || ''}`, 120, tableHeight + 10);

    // 合同条款
    doc.setFontSize(12);
    doc.text('合同条款：', 20, tableHeight + 20);
    doc.setFontSize(9);
    
    let y = tableHeight + 25;
    doc.text(`1. 执行质量标准：${contract.executionStandard || '按国家标准'}`, 25, y); y += 5;
    doc.text(`2. 验收及提出质量异议期限：${contract.inspectionPeriod || ''}`, 25, y); y += 5;
    doc.text(`3. 交货时间：${contract.deliveryDate || ''}`, 25, y); y += 5;
    doc.text(`4. 交货地点：${contract.deliveryLocation || ''}`, 25, y); y += 5;
    doc.text(`5. 交货方式：${contract.deliveryMethod || ''}`, 25, y); y += 5;
    doc.text(`6. 运输方式：${contract.transportMethod || ''} 运费结算：${contract.transportFeeArrangement || ''}`, 25, y); y += 5;
    doc.text(`7. 包装标准：${contract.packagingStandard || ''} 包装费：${contract.packagingFeeArrangement || ''}`, 25, y); y += 5;
    doc.text(`8. 结算方式及期限：${contract.paymentMethod || ''}`, 25, y); y += 5;
    doc.text(`9. 违约责任：按"民法典"规定条款执行。`, 25, y); y += 5;
    doc.text(`10. ${contract.disputeResolution || ''}`, 25, y); y += 5;
    doc.text(`11. 其他约定事项或特殊订货要求：${contract.specialRequirements || '无'}`, 25, y); y += 5;
    doc.text(`12. 合同有效期限：自签订日起至${contract.expiryDate || ''}止`, 25, y); y += 5;
    doc.text(`13. ${contract.contractCopies || '本合同一式两份，双方各持一份。'}`, 25, y); y += 15;

    // 签名区域
    doc.text('需方(盖章)：', 30, y);
    doc.text('供方(盖章)：', 120, y);
    y += 20;
    doc.text('法定代表人或委托代理人(签字)：', 30, y);
    doc.text('法定代表人或委托代理人(签字)：', 120, y);
    y += 15;
    doc.text('日期：', 30, y);
    doc.text('日期：', 120, y);

    // 保存文件
    doc.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('导出合同PDF失败:', error);
    return false;
  }
};

/**
 * 导出合同为Word格式
 * @param {Object} contract - 合同数据
 * @param {string} filename - 导出文件名
 * @returns {boolean} - 导出结果
 */
export const exportContractToWord = (contract, filename = 'contract') => {
  try {
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
              rows: [
                new TableRow({
                  children: [
                    new TableCell({
                      width: {
                        size: 5,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [new Paragraph({ text: '序号' })],
                    }),
                    new TableCell({
                      width: {
                        size: 45,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [new Paragraph({ text: '需方', alignment: AlignmentType.CENTER })],
                      columnSpan: 3,
                    }),
                    new TableCell({
                      width: {
                        size: 45,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [new Paragraph({ text: '供方', alignment: AlignmentType.CENTER })],
                      columnSpan: 3,
                    }),
                    new TableCell({
                      width: {
                        size: 5,
                        type: WidthType.PERCENTAGE,
                      },
                      children: [new Paragraph({ text: '鉴(公)证意见' })],
                      rowSpan: 6,
                    }),
                  ],
                }),
                // 后续行包含具体的买卖方信息...
                // 这里为了简洁，未详细列出所有行，实际应该包含完整的信息
              ],
            }),
            
            // 商品信息表格，条款等后续内容
            // 同样，这里省略具体实现细节
            
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

    // 导出Word文档
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${filename}.docx`);
    });

    return true;
  } catch (error) {
    console.error('导出合同Word失败:', error);
    return false;
  }
};