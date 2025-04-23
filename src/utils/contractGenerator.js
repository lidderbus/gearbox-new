// utils/contractGenerator.js
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, HeadingLevel, VerticalAlign } from 'docx'; // Added VerticalAlign
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';
import { loadChineseFont } from './fontLoader'; // 添加字体加载器引用
import html2canvas from 'html2canvas';

// --- Font Configuration ---
// 不再使用静态Base64编码，改为动态加载
const FONT_NAME = 'NotoSansSC';

/**
 * 将数字金额转换为中文大写
 * @param {number} n - 数字金额
 * @returns {string} 中文大写金额
 */
const numberToChinese = (n) => {
  if (isNaN(n) || n === null || n === undefined) return '零元整'; // Handle null/undefined
  if (n === 0) return '零元整';

  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟']
  ];

  // 处理小数点和四舍五入 (保留两位小数)
  const head = n < 0 ? '负' : '';
  n = Math.abs(parseFloat(n.toFixed(2))); // Ensure number and fix precision

  let s = '';
  // 处理整数部分
  let integerPart = Math.floor(n);

  if (integerPart > 0) {
    let zeroCount = 0;
    for (let i = 0; i < unit[0].length && integerPart > 0; i++) {
      let p = '';
      let segmentIsEmpty = true; // Flag for checking if a 4-digit segment is all zero
      for (let j = 0; j < unit[1].length && integerPart > 0; j++) {
        const d = integerPart % 10;
        if (d === 0) {
          zeroCount++;
        } else {
          segmentIsEmpty = false;
          if (zeroCount > 0) {
            p = digit[0] + p; // Add '零' before non-zero digit if zeros were skipped
          }
          p = digit[d] + unit[1][j] + p;
          zeroCount = 0;
        }
        integerPart = Math.floor(integerPart / 10);
      }
       // Append unit ('万', '亿') only if the segment wasn't empty or it's the '元' unit
      if (!segmentIsEmpty || unit[0][i] === '元') {
         s = p.replace(/(零+)$/, '') + unit[0][i] + s; // Remove trailing zeros in segment + add unit
      } else if (s.length > 0 && !s.startsWith('零')) {
         // If segment is empty (like 0000万), but previous segments exist, add a single '零'
         // unless the result already starts with '零' (e.g., 0.10 -> 壹角)
         s = digit[0] + s;
      }
    }
     // Cleanup: remove redundant '零's, handle case like "壹拾元" -> "拾元" (optional), ensure '元' is present
    s = s.replace(/^壹拾/, '拾'); // "壹拾元" -> "拾元"
    s = s.replace(/(零{2,})/g, '零'); // "零零" -> "零"
    s = s.replace(/(零$)/, ''); // Remove trailing zero if no decimal part
    s = s.replace(/零([万亿元])/g, '$1'); // "零万" -> "万"
    if (s.startsWith('元')) { // Handle cases like 0.5 -> 元伍角 -> 伍角
        s = s.substring(1);
    }
     if (!s.includes('元') && integerPart === 0) { // Ensure 元 is added if only decimal exists
        // Check required because integerPart might become 0 after processing
        // But we still need the 元 if the original number was >= 1
        // Let's re-evaluate the need for Yuan based on the original integer presence
        if (Math.floor(Math.abs(parseFloat(n.toFixed(2)))) > 0 || s.length === 0) { // Check original value or if string is empty
            // s = '元' + s; // This causes issues like 100 -> 壹佰元元整
            // Let's rethink. The loop should handle the '元' correctly.
            // The issue might be with cleanup.
        }
    }
     if (s.length === 0 && Math.floor(n) > 0) { // e.g. 100000000 -> "" situation
        s = '零元'; // Should be handled by loops correctly, but as fallback
     }
     // Final cleanup after integer processing
     s = s.replace(/零([万亿])/g, '$1'); // "零万" -> "万" (again)
     s = s.replace(/亿万/g, '亿'); // Handle "亿万" if it appears
     s = s.replace(/零{2,}/g, '零'); // Cleanup again
     s = s.replace(/^$/, '零'); // If empty, it's zero

  } else {
      s = '零'; // If integer part was 0 initially
  }


  // 处理小数部分
  // Use Math.round to handle precision issues like n=1.00 -> n.toString() = "1"
  let decimalPartStr = (Math.round((n - Math.floor(n)) * 100)).toString();
  let decimalVal = parseInt(decimalPartStr);

  if (decimalVal > 0) {
      if (integerPart > 0 && !s.endsWith('零')) { // Add '元' if integer exists and doesn't end with zero
          // Check if '元' already exists
          if (!s.includes('元')) {
             s += '元';
          }
      } else if (integerPart === 0) { // If only decimal part exists
          s = ''; // Start fresh, like 0.5 -> 伍角
      }

      let jiao = Math.floor(decimalVal / 10);
      let fen = decimalVal % 10;
      let decimalStr = '';

      if(integerPart > 0 && jiao === 0 && fen > 0 && !s.endsWith('零')) {
          // Add '零' if integer part exists, 角 is zero, but 分 exists (e.g., 1.05 -> 壹元零伍分)
          decimalStr += digit[0];
      }

      if (jiao > 0) {
        decimalStr += digit[jiao] + fraction[0];
      } else if (integerPart > 0 && fen > 0) {
         // If integer exists, jiao is 0, but fen exists, we need the '零' added above
         // If integer is 0, jiao is 0, fen exists (e.g. 0.05), we don't add leading '零' (伍分)
         // The logic above handles the integer case.
      }

      if (fen > 0) {
        decimalStr += digit[fen] + fraction[1];
      }

      s += decimalStr;

  } else {
    // No decimal part or decimal is zero
    if (s === '零' && integerPart === 0) { // Handle input 0
        return '零元整';
    }
    // Append '元整' if integer part exists and no decimal
    if (!s.includes('元')) {
       s += '元';
    }
    s += '整';
  }

  // Final cleanup for edge cases
  s = s.replace(/零元$/, '元'); // Cleanup "壹仟零元整" -> "壹仟元整"
  if (s !== '零元整' && s.endsWith('元整') && s.length > 2 && !s.startsWith('拾') && !s.startsWith('佰') && !s.startsWith('仟')) {
      // If it ends with '元整' but is just 'X元整', it's fine.
      // If it's like '壹拾元整', '壹百元整', it's fine.
      // If it's like '壹万零元整', cleanup needed.
      // Let's simplify: if it ends with '零元', replace with '元' before adding '整'
  }
  if (!s.endsWith('整') && decimalVal === 0) { // Ensure '整' is added if no decimal value
      s += '整';
  }
  if(s.startsWith('元')) { // Like 0.5 -> 元伍角 -> 伍角
      s = s.substring(1);
  }
  if(s.startsWith('零') && s !== '零元整') { // Like 0.5 -> 零伍角 -> 伍角
      s = s.substring(1);
  }
  if (s.endsWith('零整')) { // Cleanup 10.00 -> "拾元零整" -> "拾元整"
      s = s.replace(/零整$/, '整');
  }
  if (s === '整') return '零元整'; // Should not happen, but safeguard

  return head + s;
};


/**
 * 生成销售合同
 * @param {Object} selectionResult - 选型结果
 * @param {Object} projectInfo - 项目信息
 * @param {Object} selectedComponents - 选中的组件(齿轮箱、联轴器、备用泵)
 * @param {Object} priceInfo - 价格信息 (包含 marketPrice for gearbox)
 * @returns {Object} 生成的合同数据对象
 */
export const generateContract = (selectionResult, projectInfo, selectedComponents, priceInfo) => {
  try {
    const today = new Date();
    const formattedDate = `${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日`;

    // 生成合同流水号
    const contractNumber = `SHQJ-${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}-${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`; // Added Day

    // 计算交货月份（默认为合同签订后3个月）
    const deliveryDate = new Date(today);
    deliveryDate.setMonth(today.getMonth() + 3); // Add 3 months for delivery

    const deliveryYear = deliveryDate.getFullYear();
    const deliveryMonth = deliveryDate.getMonth() + 1; // getMonth is 0-indexed
    const deliveryQuarter = Math.ceil(deliveryMonth / 3);

    // 计算合同有效期截止日期（默认为1年后）
    const expiryDateValue = new Date(today);
    expiryDateValue.setFullYear(today.getFullYear() + 1);
    const expiryDate = `${expiryDateValue.getFullYear()}年${expiryDateValue.getMonth() + 1}月${expiryDateValue.getDate()}日`;

    // --- 产品信息处理 ---
    // 确保齿轮箱信息有效
    if (!selectedComponents.gearbox || !selectedComponents.gearbox.model) {
        throw new Error("缺少有效的齿轮箱选型信息");
    }

    // 获取齿轮箱价格，优先使用传入的价格信息
    let gearboxMarketPrice = 0;
    if (priceInfo && typeof priceInfo.marketPrice === 'number' && priceInfo.marketPrice > 0) {
        gearboxMarketPrice = priceInfo.marketPrice;
    } else if (selectedComponents.gearbox && typeof selectedComponents.gearbox.marketPrice === 'number' && selectedComponents.gearbox.marketPrice > 0) {
        gearboxMarketPrice = selectedComponents.gearbox.marketPrice;
    } else if (selectedComponents.gearbox && typeof selectedComponents.gearbox.price === 'number' && selectedComponents.gearbox.price > 0) {
        gearboxMarketPrice = selectedComponents.gearbox.price;
    } else {
        console.warn("generateContract: 无法获取有效的齿轮箱价格，请检查价格信息");
    }

    // 创建产品信息 (齿轮箱)
    const gearboxProduct = {
      name: "船用齿轮箱",
      model: selectedComponents.gearbox.model,
      brand: "前进",
      unit: "台",
      quantity: 1,
      unitPrice: gearboxMarketPrice,
      amount: gearboxMarketPrice * 1,
      deliveryYear: deliveryYear,
      deliveryQuarter: deliveryQuarter
    };

    const products = [gearboxProduct];

    // 如果有联轴器，添加联轴器信息
    let couplingInfo = null;
    if (selectedComponents.coupling && selectedComponents.coupling.model) {
      // 获取联轴器的价格信息
      const couplingPrice = selectedComponents.coupling.marketPrice || selectedComponents.coupling.price || 0;
      
      couplingInfo = {
        name: "高弹性联轴器",
        model: selectedComponents.coupling.model,
        brand: "前进",
        unit: "套",
        quantity: 1, // 确保数量为1
        unitPrice: couplingPrice, // 使用实际价格，而非0
        amount: couplingPrice * 1 // 计算总价
      };
    }

    // 备用泵信息 (Currently not added to contract tables, add if needed)
    // let pumpInfo = null;
    // if (selectedComponents.pump && selectedComponents.pump.model) {
    //    pumpInfo = { ... };
    // }


    // 总金额 (包含齿轮箱和联轴器)
    const totalAmount = gearboxProduct.amount + (couplingInfo ? couplingInfo.amount : 0);
    const totalAmountInChinese = numberToChinese(totalAmount);

    // 构建完整的合同对象
    const contract = {
      success: true,
      contractNumber,
      contractDate: formattedDate,

      // 需方(买方)信息 - Use projectInfo or provide defaults
      buyerInfo: {
        name: projectInfo?.customerName || "___________",
        legalRepresentative: projectInfo?.legalRepresentative || "", // Add if available in projectInfo
        address: projectInfo?.customerAddress || "", // Add if available
        postalCode: projectInfo?.customerPostalCode || "", // Add if available
        taxNumber: projectInfo?.customerTaxNumber || "", // Add if available
        bank: projectInfo?.customerBank || "", // Add if available
        accountNumber: projectInfo?.customerAccountNumber || "", // Add if available
        contactPerson: projectInfo?.contactPerson || "", // Add from projectInfo
        phone: projectInfo?.contactPhone || "", // Add from projectInfo
        fax: projectInfo?.contactFax || "" // Add if available
      },

      // 供方(卖方)信息 - Hardcoded
      sellerInfo: {
        name: "上海前进齿轮经营有限公司",
        legalRepresentative: "张明", // Example
        agent: "", // 委托代理人 - Add if needed
        address: "上海市浦东新区浦东大道2123号3B-1室",
        postalCode: "201202",
        phone: "021-58208956",
        fax: "", // Add if needed
        taxNumber: "91310115050845085X",
        bank: "中国银行上海市益民支行",
        accountNumber: "452759227880"
      },

      // 产品信息
      products, // Array containing gearbox product
      coupling: couplingInfo, // Separate coupling info if exists
      // pump: pumpInfo, // Separate pump info if exists
      totalAmount,
      totalAmountInChinese,

      // 合同条款 - Use defaults or potentially values from projectInfo/config
      executionStandard: "按国家标准及前进企业标准执行",
      inspectionPeriod: "产品到货验收合格后7天内",
      deliveryDate: `合同签订生效后${3}个月内`, // Changed wording slightly
      deliveryLocation: projectInfo?.deliveryAddress || "需方指定地点", // Use project info or default
      deliveryMethod: "一次性交付",
      transportMethod: "陆运",
      transportFeeArrangement: "运费由供方承担至需方指定地点", // Example change
      packagingStandard: "标准出口包装，适合长途运输", // Example change
      packagingFeeArrangement: "包装费含在总价内", // Example change
      paymentMethod: "合同签订生效后支付30%预付款，发货前支付60%货款，设备验收合格后支付10%尾款", // More explicit
      disputeResolution: "因履行本合同发生的争议，由双方协商解决；协商不成的，应向供方所在地有管辖权的人民法院提起诉讼。", // Changed jurisdiction
      specialRequirements: projectInfo?.projectName ? `用于 ${projectInfo.projectName} 项目` : "无特殊要求", // Default if no project name
      expiryDate, // Calculated expiry date
      contractCopies: "本合同一式肆份，需方执贰份，供方执贰份，具有同等法律效力，自双方签字盖章之日起生效。" // Changed copies and effective date
    };

    return contract;
  } catch (error) {
    console.error("生成合同失败:", error);
    return {
      success: false,
      message: "生成合同失败: " + error.message
    };
  }
};


// --- Word Export Helper Functions ---

/**
 * 创建买方和卖方信息表格 (Helper for Word Export)
 * @param {Object} contract - 合同数据
 * @returns {Table} 创建的表格
 */
function createBuyerSellerTable(contract) {
  // Helper to create a paragraph, handles undefined/null
  const createPara = (text) => new Paragraph(text || "");
  const createCenteredPara = (text) => new Paragraph({ text: text || "", alignment: AlignmentType.CENTER });
  const createVerticallyCenteredPara = (text) => new Paragraph({ text: text || "", alignment: AlignmentType.CENTER }); // Use alignment for now, proper vertical requires cell properties

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [5, 10, 17.5, 17.5, 10, 17.5, 17.5, 5], // Adjusted for 8 columns
    borders: { /* ... Standard Borders ... */
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    },
    rows: [
      // Header Row
      new TableRow({
        children: [
          new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [createCenteredPara("序号")] }),
          new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, columnSpan: 3, children: [createCenteredPara("需方")] }),
          new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, columnSpan: 3, children: [createCenteredPara("供方")] }),
          new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [createCenteredPara("鉴（公）证意见：")] }),
        ],
      }),
      // Name Row
      new TableRow({
        children: [
          new TableCell({ rowSpan: 6, verticalAlign: VerticalAlign.CENTER, children: [createVerticallyCenteredPara("1")] }), // Increased rowspan
          new TableCell({ children: [createPara("单位名称")] }),
          new TableCell({ columnSpan: 2, children: [createPara(contract.buyerInfo.name)] }),
          new TableCell({ children: [createPara("单位名称")] }),
          new TableCell({ columnSpan: 2, children: [createPara(contract.sellerInfo.name)] }),
          new TableCell({ rowSpan: 7, children: [createPara("")] }), // Increased rowspan
        ],
      }),
      // Legal Rep Row
      new TableRow({
        children: [
          new TableCell({ children: [createPara("法定代表人")] }),
          new TableCell({ children: [createPara(contract.buyerInfo.legalRepresentative)] }),
          new TableCell({ children: [createPara("委托代理人")] }), // Added Buyer Agent field
          new TableCell({ children: [createPara("法定代表人")] }),
          new TableCell({ children: [createPara(contract.sellerInfo.legalRepresentative)] }),
          new TableCell({ children: [createPara(contract.sellerInfo.agent)] }), // Added Seller Agent field
        ],
      }),
      // Address Row
      new TableRow({
        children: [
          new TableCell({ children: [createPara("通讯地址")] }),
          new TableCell({ columnSpan: 2, children: [createPara(contract.buyerInfo.address)] }),
          new TableCell({ children: [createPara("通讯地址")] }),
          new TableCell({ columnSpan: 2, children: [createPara(contract.sellerInfo.address)] }),
        ],
      }),
      // Postal Code / Phone/Fax Row
      new TableRow({
        children: [
          new TableCell({ children: [createPara("邮政编码")] }),
          new TableCell({ children: [createPara(contract.buyerInfo.postalCode)] }),
          new TableCell({ children: [createPara("电话/传真")] }), // Combined Buyer Phone/Fax
          new TableCell({ children: [createPara("邮政编码")] }),
          new TableCell({ children: [createPara(contract.sellerInfo.postalCode)] }),
          new TableCell({ children: [createPara("电话/传真")] }), // Combined Seller Phone/Fax
        ],
      }),
       // Tax / Phone Row (Adjusted - Buyer Phone removed as it's above)
       new TableRow({
        children: [
          new TableCell({ children: [createPara("税号")] }),
          new TableCell({ columnSpan: 2, children: [createPara(contract.buyerInfo.taxNumber)] }),
          new TableCell({ children: [createPara("税号")] }), // Added Seller Tax No.
          new TableCell({ columnSpan: 2, children: [createPara(contract.sellerInfo.taxNumber)] }),
        ],
      }),
      // Bank Row
      new TableRow({
        children: [
          new TableCell({
            columnSpan: 3, // Span 3 columns
            children: [
              createPara("银行及账号"),
              createPara(contract.buyerInfo.bank),
              createPara(contract.buyerInfo.accountNumber),
            ],
          }),
          new TableCell({
            columnSpan: 3, // Span 3 columns
            children: [
              createPara("银行及账号"),
              createPara(contract.sellerInfo.bank),
              createPara(contract.sellerInfo.accountNumber),
            ],
          }),
        ],
      }),
       // Empty row for spacing if needed, or remove if rowSpan covers it
       new TableRow({ children: [ new TableCell({columnSpan: 7, children: [createPara("")]}) ]}),
    ],
  });
}


/**
 * 创建产品信息表格 (Helper for Word Export)
 * @param {Object} contract - 合同数据
 * @returns {Table} 创建的表格
 */
function createProductsTable(contract) {
  // Helper for formatting currency
  const formatCurrency = (value) => {
      if (typeof value !== 'number' || isNaN(value)) return "";
      return `¥${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
  
  // 修改Helper函数，避免在paragraph中重复text属性
  const createPara = (text, alignment = AlignmentType.LEFT, bold = false) => {
      return new Paragraph({
          alignment: alignment,
          children: [
              new TextRun({
                  text: text || "",
                  bold: bold
              })
          ]
      });
  };
  
  const createRightPara = (text) => createPara(text, AlignmentType.RIGHT);
  const createCenterPara = (text) => createPara(text, AlignmentType.CENTER);

  // --- Table Header ---
  const headerRow1 = new TableRow({
    children: [
      new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [createCenterPara("序号")] }),
      new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [createCenterPara("产品名称")] }),
      new TableCell({ width: { size: 12, type: WidthType.PERCENTAGE }, children: [createCenterPara("规格型号")] }),
      new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [createCenterPara("商标")] }),
      new TableCell({ width: { size: 6, type: WidthType.PERCENTAGE }, children: [createCenterPara("计量单位")] }),
      new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [createCenterPara("数量")] }),
      new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [createCenterPara("单价（元）")] }),
      new TableCell({ width: { size: 10, type: WidthType.PERCENTAGE }, children: [createCenterPara("金额")] }),
      new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, columnSpan: 4, children: [createCenterPara(`交货期（${contract.products[0]?.deliveryYear || new Date().getFullYear()}年度）`)] }),
      new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [createCenterPara("备注")] }),
    ],
  });

  // --- Product Rows ---
  const productRows = [];
  
  // 如果有齿轮箱产品
  if (contract.products && contract.products.length > 0) {
    const gearboxProduct = contract.products[0]; // 获取齿轮箱产品
    
    // 计算行数，用于确定需要应用rowSpan的单元格数
    const productCount = 1 + (contract.coupling ? 1 : 0); // 齿轮箱 + 可能的联轴器
    
    // 齿轮箱行
    const gearboxRow = new TableRow({
      children: [
        // 修正序号为1
        new TableCell({ 
          rowSpan: productCount, 
          verticalAlign: VerticalAlign.CENTER, 
          children: [createCenterPara("1")] 
        }),
        new TableCell({ children: [createPara(gearboxProduct.name)] }),
        new TableCell({ children: [createPara(gearboxProduct.model)] }),
        new TableCell({ children: [createPara(gearboxProduct.brand)] }),
        new TableCell({ children: [createCenterPara(gearboxProduct.unit)] }),
        new TableCell({ children: [createCenterPara(gearboxProduct.quantity.toString())] }),
        new TableCell({ children: [createRightPara(formatCurrency(gearboxProduct.unitPrice))] }),
        new TableCell({ children: [createRightPara(formatCurrency(gearboxProduct.amount))] }),
        new TableCell({ children: [createCenterPara(gearboxProduct.deliveryQuarter === 1 ? "√" : "")] }),
        new TableCell({ children: [createCenterPara(gearboxProduct.deliveryQuarter === 2 ? "√" : "")] }),
        new TableCell({ children: [createCenterPara(gearboxProduct.deliveryQuarter === 3 ? "√" : "")] }),
        new TableCell({ children: [createCenterPara(gearboxProduct.deliveryQuarter === 4 ? "√" : "")] }),
        new TableCell({ 
          rowSpan: productCount, 
          verticalAlign: VerticalAlign.CENTER, 
          children: [createPara("")] 
        }),
      ],
    });
    productRows.push(gearboxRow);

    // 联轴器行 (如果存在)
    if (contract.coupling) {
      const couplingRow = new TableRow({
        children: [
          // 序号单元格由于rowSpan被省略
          new TableCell({ children: [createPara(contract.coupling.name)] }),
          new TableCell({ children: [createPara(contract.coupling.model)] }),
          new TableCell({ children: [createPara(contract.coupling.brand)] }),
          new TableCell({ children: [createCenterPara(contract.coupling.unit)] }),
          new TableCell({ children: [createCenterPara(contract.coupling.quantity.toString())] }),
          new TableCell({ children: [createRightPara(formatCurrency(contract.coupling.unitPrice))] }),
          new TableCell({ children: [createRightPara(formatCurrency(contract.coupling.amount))] }),
          new TableCell({ children: [createPara("")] }), // Q1
          new TableCell({ children: [createPara("")] }), // Q2
          new TableCell({ children: [createPara("")] }), // Q3
          new TableCell({ children: [createPara("")] }), // Q4
          // 备注单元格由于rowSpan被省略
        ],
      });
      productRows.push(couplingRow);
    }
  }

  // --- Total Row ---
  const totalRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        children: [createPara("合计人民币（大写）：", AlignmentType.LEFT, true)],
      }),
      new TableCell({
        columnSpan: 5,
        children: [createPara(contract.totalAmountInChinese)],
      }),
      new TableCell({
        columnSpan: 6,
        children: [createPara(`¥（小写）：${formatCurrency(contract.totalAmount)}`)],
      }),
    ],
  });
  productRows.push(totalRow);

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: {
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    },
    rows: [headerRow1, ...productRows],
  });
}


/**
 * 创建合同条款表格 (Helper for Word Export)
 * @param {Object} contract - 合同数据
 * @returns {Table} 创建的表格
 */
function createTermsTable(contract) {
  // Helper to create paragraphs
  const createPara = (text) => new Paragraph(text || "");
  const createCenterPara = (text) => new Paragraph({ text: text || "", alignment: AlignmentType.CENTER });

  // Define standard borders
  const borders = {
    top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
  };

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    columnWidths: [5, 45, 5, 45], // Define column widths
    borders: borders,
    rows: [
      // Row 1: Quality Standard & Liability
      new TableRow({
        children: [
          new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [createCenterPara("3")] }),
          new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, children: [createPara(`执行质量标准：${contract.executionStandard}`)] }),
          new TableCell({ width: { size: 5, type: WidthType.PERCENTAGE }, children: [createCenterPara("11")] }),
          new TableCell({ width: { size: 45, type: WidthType.PERCENTAGE }, children: [createPara(`违约责任：按《中华人民共和国民法典》相关规定执行。`)] }), // Updated text
        ],
      }),
      // Row 2: Inspection & Dispute Resolution (Part 1)
      new TableRow({
        children: [
          new TableCell({ children: [createCenterPara("4")] }),
          new TableCell({ children: [createPara(`需方验收及提出质量异议期限：${contract.inspectionPeriod}`)] }),
          new TableCell({ rowSpan: 2, verticalAlign: VerticalAlign.CENTER, children: [createCenterPara("12")] }), // Add vertical align
          new TableCell({ rowSpan: 2, children: [createPara(contract.disputeResolution)] }), // Text will align top by default
        ],
      }),
      // Row 3: Delivery Time & Dispute Resolution (Part 2)
      new TableRow({
        children: [
          new TableCell({ children: [createCenterPara("5")] }),
          new TableCell({ children: [createPara(`交货时间：${contract.deliveryDate}`)] }),
          // Cells for 12 are covered by rowSpan from above
        ],
      }),
      // Row 4: Delivery Location & Special Req (Part 1)
      new TableRow({
        children: [
          new TableCell({ children: [createCenterPara("6")] }),
          new TableCell({ children: [createPara(`交货地点：${contract.deliveryLocation}`)] }),
          new TableCell({ rowSpan: 3, verticalAlign: VerticalAlign.CENTER, children: [createCenterPara("13")] }), // Add vertical align
          new TableCell({ rowSpan: 3, children: [createPara(`其他约定事项或特殊订货要求：${contract.specialRequirements}`)] }),
        ],
      }),
      // Row 5: Delivery Method & Special Req (Part 2)
      new TableRow({
        children: [
          new TableCell({ children: [createCenterPara("7")] }),
          new TableCell({ children: [createPara(`交货方式：${contract.deliveryMethod}`)] }),
          // Cells for 13 are covered by rowSpan
        ],
      }),
      // Row 6: Transport & Special Req (Part 3)
      new TableRow({
        children: [
          new TableCell({ children: [createCenterPara("8")] }),
          new TableCell({ children: [createPara(`运输方式及费用承担：${contract.transportMethod}，${contract.transportFeeArrangement}`)] }), // Combined transport info
          // Cells for 13 are covered by rowSpan
        ],
      }),
      // Row 7: Packaging & Validity
      new TableRow({
        children: [
          new TableCell({ children: [createCenterPara("9")] }),
          new TableCell({ children: [createPara(`包装标准及费用承担：${contract.packagingStandard}，${contract.packagingFeeArrangement}`)] }), // Combined packaging info
          new TableCell({ children: [createCenterPara("14")] }),
          new TableCell({ children: [createPara(`合同有效期限：${contract.expiryDate}`)] }), // Removed "自签订日起至...止" assuming expiryDate is the end date string
        ],
      }),
      // Row 8: Payment & Copies
      new TableRow({
        children: [
          new TableCell({ children: [createCenterPara("10")] }),
          new TableCell({ children: [createPara(`结算方式及期限：${contract.paymentMethod}`)] }),
          new TableCell({ children: [createCenterPara("15")] }),
          new TableCell({ children: [createPara(contract.contractCopies)] }),
        ],
      }),
    ],
  });
}


/**
 * 导出合同为Word文档
 * @param {Object} contract - 合同数据
 * @param {string} [filename] - 文件名 (可选)
 */
export const exportContractToWord = (contract, filename) => {
  if (!contract || !contract.success) {
    console.error("无法导出Word：无效的合同数据");
    return; // Prevent execution with invalid data
  }
  try {
    const doc = new Document({
      sections: [
        {
          properties: {
             // Define page margins, etc., if needed
          },
          children: [ // <--- Main document content starts here
            // Title
            new Paragraph({
              text: "上海前进齿轮经营有限公司产品销售合同",
              heading: HeadingLevel.HEADING_1,
              alignment: AlignmentType.CENTER,
              spacing: { after: 200 },
            }),

            // Contract Number and Location
            new Paragraph({
              alignment: AlignmentType.JUSTIFIED, // Justify to spread text
              children: [
                new TextRun("签订地点：上海"),
                new TextRun("\t\t\t\t\t\t"), // Use tabs for spacing (adjust count)
                new TextRun(`合同编号：${contract.contractNumber}`),
              ],
              spacing: { after: 100 },
              // Add tab stops if needed for precise alignment
            }),

            // Date and Stats Number
            new Paragraph({
                alignment: AlignmentType.JUSTIFIED,
                children: [
                  new TextRun(`签订日期：${contract.contractDate}`),
                  new TextRun("\t\t\t\t\t\t"), // Use tabs
                  new TextRun("统计编号："), // Leave blank or fill if needed
                ],
                spacing: { after: 400 }
            }),

            // Buyer/Seller Info Table
            createBuyerSellerTable(contract),

            new Paragraph({ spacing: { after: 200 } }), // Spacing

            // Products Table
            createProductsTable(contract),

            new Paragraph({ spacing: { after: 200 } }), // Spacing

            // Terms Table
            createTermsTable(contract),

            new Paragraph({ spacing: { after: 600 } }), // Spacing before signatures

            // Signature Area (Using a Table for better alignment)
            new Table({
              width: { size: 100, type: WidthType.PERCENTAGE },
              borders: { // No borders for signature table
                  top: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  bottom: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  left: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  right: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  insideHorizontal: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
                  insideVertical: { style: BorderStyle.NONE, size: 0, color: "FFFFFF" },
              },
              columnWidths: [50, 50], // Equal columns
              rows: [
                  new TableRow({
                      children: [
                          new TableCell({ children: [new Paragraph("需方（盖章）：")] }),
                          new TableCell({ children: [new Paragraph("供方（盖章）：")] }),
                      ],
                  }),
                  new TableRow({ // Empty row for spacing
                      children: [
                          new TableCell({ children: [new Paragraph({ spacing: { before: 200 } })] }),
                          new TableCell({ children: [new Paragraph({ spacing: { before: 200 } })] }),
                      ],
                  }),
                  new TableRow({
                      children: [
                          new TableCell({ children: [new Paragraph("法定代表人或委托代理人（签字）：_______________")] }),
                          new TableCell({ children: [new Paragraph("法定代表人或委托代理人（签字）：_______________")] }),
                      ],
                  }),
                  new TableRow({ // Empty row for spacing
                      children: [
                          new TableCell({ children: [new Paragraph({ spacing: { before: 200 } })] }),
                          new TableCell({ children: [new Paragraph({ spacing: { before: 200 } })] }),
                      ],
                  }),
                  new TableRow({
                      children: [
                          new TableCell({ children: [new Paragraph("日期：_______________")] }),
                          new TableCell({ children: [new Paragraph("日期：_______________")] }),
                      ],
                  }),
              ],
            }),
          ],
        },
      ],
    });

    // Generate and save document
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, `${filename || '销售合同'}.docx`);
    }).catch(err => {
      console.error("Packer.toBlob failed:", err);
      throw new Error("导出Word文档失败: Packer Error - " + err.message);
    });
  } catch (error) {
    console.error("导出Word文档失败:", error);
    // Avoid throwing another error here if Packer failed, as it's already caught
    if (!error.message.includes("Packer Error")) {
      throw new Error("导出Word文档失败: " + error.message);
    }
  }
};


/**
 * 格式化合同内容为PDF文本
 * @param {Object} contract - 合同数据
 * @returns {string} 格式化后的合同文本
 */
const formatContractContent = (contract) => {
  let content = '';

  // 添加合同基本信息
  content += `合同编号：${contract.contractNumber}\n`;
  content += `签订日期：${contract.contractDate}\n\n`;

  // 添加买方信息
  content += '买方信息：\n';
  content += `单位名称：${contract.buyerInfo.name}\n`;
  content += `法定代表人：${contract.buyerInfo.legalRepresentative}\n`;
  content += `地址：${contract.buyerInfo.address}\n`;
  content += `邮编：${contract.buyerInfo.postalCode}\n`;
  content += `税号：${contract.buyerInfo.taxNumber}\n`;
  content += `银行：${contract.buyerInfo.bank}\n`;
  content += `账号：${contract.buyerInfo.accountNumber}\n\n`;

  // 添加卖方信息
  content += '卖方信息：\n';
  content += `单位名称：${contract.sellerInfo.name}\n`;
  content += `法定代表人：${contract.sellerInfo.legalRepresentative}\n`;
  content += `地址：${contract.sellerInfo.address}\n`;
  content += `邮编：${contract.sellerInfo.postalCode}\n`;
  content += `税号：${contract.sellerInfo.taxNumber}\n`;
  content += `银行：${contract.sellerInfo.bank}\n`;
  content += `账号：${contract.sellerInfo.accountNumber}\n\n`;

  // 添加产品信息
  content += '产品信息：\n';
  contract.products.forEach((product, index) => {
    content += `产品${index + 1}：\n`;
    content += `名称：${product.name}\n`;
    content += `型号：${product.model}\n`;
    content += `品牌：${product.brand}\n`;
    content += `单位：${product.unit}\n`;
    content += `数量：${product.quantity}\n`;
    content += `单价：${product.unitPrice}\n`;
    content += `金额：${product.amount}\n`;
    content += `交货期：${product.deliveryYear}年第${product.deliveryQuarter}季度\n\n`;
  });

  // 添加合同条款
  content += '合同条款：\n';
  content += `执行标准：${contract.executionStandard}\n`;
  content += `验收期限：${contract.inspectionPeriod}\n`;
  content += `交货时间：${contract.deliveryDate}\n`;
  content += `交货地点：${contract.deliveryLocation}\n`;
  content += `交货方式：${contract.deliveryMethod}\n`;
  content += `运输方式：${contract.transportMethod}\n`;
  content += `包装标准：${contract.packagingStandard}\n`;
  content += `付款方式：${contract.paymentMethod}\n`;
  content += `争议解决：${contract.disputeResolution}\n`;
  content += `特殊要求：${contract.specialRequirements}\n`;
  content += `合同有效期：${contract.expiryDate}\n`;
  content += `合同份数：${contract.contractCopies}\n\n`;

  // 添加总金额
  content += `总金额（大写）：${contract.totalAmountInChinese}\n`;
  content += `总金额（小写）：${contract.totalAmount}\n`;

  return content;
};

/**
 * 导出合同为PDF文档
 * @param {Object} contract - 合同数据
 * @param {string} [filename] - 文件名 (可选)
 */
export const exportContractToPDF = async (contract, filename = '销售合同.pdf') => {
    if (!contract || !contract.success) {
        console.error("无法导出PDF：无效的合同数据");
        throw new Error("无效的合同数据");
    }

    try {
        console.log("开始导出PDF...");
        
        // 使用更简单的方法：直接用文本内容创建PDF
        const doc = new jsPDF({
            orientation: 'landscape',
            unit: 'mm',
            format: 'a4'
        });
        
        // 添加基本字体支持
        await loadChineseFont(doc);
        
        // 设置基本内容
        doc.setFontSize(18);
        doc.text("上海前进齿轮经营有限公司产品销售合同", 150, 20, { align: 'center' });
        
        doc.setFontSize(10);
        doc.text(`合同编号: ${contract.contractNumber}`, 20, 30);
        doc.text(`签订日期: ${contract.contractDate}`, 20, 35);
        
        // 添加买方信息
        doc.setFontSize(12);
        doc.text("买方信息:", 20, 45);
        doc.setFontSize(10);
        doc.text(`单位名称: ${contract.buyerInfo.name}`, 20, 50);
        doc.text(`法定代表人: ${contract.buyerInfo.legalRepresentative}`, 20, 55);
        
        // 添加卖方信息
        doc.setFontSize(12);
        doc.text("卖方信息:", 150, 45);
        doc.setFontSize(10);
        doc.text(`单位名称: 上海前进齿轮经营有限公司`, 150, 50);
        doc.text(`法定代表人: 张明`, 150, 55);
        
        // 添加产品信息
        doc.setFontSize(12);
        doc.text("产品信息:", 20, 70);
        doc.setFontSize(10);
        
        // 表格表头
        const headers = [["序号", "产品名称", "规格型号", "单价", "数量", "金额"]];
        
        // 产品数据
        const data = contract.products.map((product, index) => [
            String(index + 1),
            product.name,
            product.model,
            String(product.unitPrice.toFixed(2)),
            String(product.quantity),
            String(product.amount.toFixed(2))
        ]);
        
        // 添加表格
        doc.autoTable({
            startY: 75,
            head: headers,
            body: data,
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185], textColor: 255 },
            styles: { font: 'NotoSansSC', fontSize: 9 }
        });
        
        // 添加总金额
        const finalY = doc.autoTable.previous.finalY;
        doc.text(`总金额: ${contract.totalAmount.toFixed(2)} 元`, 20, finalY + 10);
        doc.text(`总金额大写: ${contract.totalAmountInChinese}`, 20, finalY + 15);
        
        // 添加主要条款
        doc.setFontSize(12);
        doc.text("主要条款:", 20, finalY + 25);
        doc.setFontSize(10);
        doc.text(`交货时间: ${contract.deliveryDate}`, 20, finalY + 30);
        doc.text(`交货地点: ${contract.deliveryLocation}`, 20, finalY + 35);
        doc.text(`付款方式: ${contract.paymentMethod}`, 20, finalY + 40);
        
        // 添加签名区域
        doc.text("需方(盖章):", 20, finalY + 60);
        doc.text("供方(盖章):", 150, finalY + 60);
        
        // 保存PDF
        doc.save(filename);
        
        console.log("PDF导出完成:", filename);
        return true;
    } catch (error) {
        console.error('导出PDF失败:', error);
        throw new Error("导出PDF失败: " + error.message);
    }
};