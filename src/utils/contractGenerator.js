// utils/contractGenerator.js
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle, WidthType, AlignmentType, HeadingLevel, VerticalAlign } from 'docx'; // Added VerticalAlign
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { saveAs } from 'file-saver';

// --- Font Embedding (Placeholder) ---
// IMPORTANT: Replace the placeholder below with the actual Base64 encoded string of your TTF font file.
//            Choose a font that supports Simplified Chinese characters (e.g., Noto Sans SC, Source Han Sans SC).
//            You can find online tools or use scripts to convert .ttf to Base64.
const simplifiedChineseFontBase64 = 'YOUR_BASE64_ENCODED_FONT_STRING_HERE'; // <--- REPLACE THIS
const FONT_NAME = 'SimplifiedChineseFont'; // Choose a name for the font in the PDF

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
    // 确保价格信息有效
    const gearboxMarketPrice = priceInfo?.marketPrice ?? selectedComponents.gearbox?.marketPrice ?? 0;
    if (typeof gearboxMarketPrice !== 'number' || gearboxMarketPrice <= 0) {
       console.warn("generateContract: Gearbox market price is missing or invalid, using 0.");
       // Consider throwing an error if price is mandatory:
       // throw new Error("缺少有效的齿轮箱市场价格");
    }


    // 创建产品信息 (齿轮箱)
    const gearboxProduct = {
      name: "船用齿轮箱",
      model: selectedComponents.gearbox.model,
      brand: "前进", // Assuming brand is always "前进"
      unit: "台",
      quantity: 1, // 修改为1
      unitPrice: gearboxMarketPrice,
      amount: gearboxMarketPrice * 1, // 修改为单价乘以1
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
      // return `¥${value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}`; // Add commas if needed
      return `¥${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
   // Helper to create a paragraph, handles undefined/null
   const createPara = (text, alignment = AlignmentType.LEFT, bold = false) => new Paragraph({ text: text || "", alignment: alignment, children: [new TextRun({ text: text || "", bold: bold })]});
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
      new TableCell({ width: { size: 24, type: WidthType.PERCENTAGE }, columnSpan: 4, children: [createCenterPara(`交货期（${contract.products[0]?.deliveryYear || new Date().getFullYear()}年度）`)] }), // Use delivery year from product
      new TableCell({ width: { size: 8, type: WidthType.PERCENTAGE }, children: [createCenterPara("备注")] }),
    ],
  });

  const headerRow2 = new TableRow({
    children: [
      new TableCell({ columnSpan: 8, children: [createPara("")] }), // Empty cells spanning first 8 columns
      new TableCell({ children: [createCenterPara("一季度")] }),
      new TableCell({ children: [createCenterPara("二季度")] }),
      new TableCell({ children: [createCenterPara("三季度")] }),
      new TableCell({ children: [createCenterPara("四季度")] }),
      new TableCell({ children: [createPara("")] }), // Empty cell for Remarks column header part
    ],
  });

  // --- Product Rows ---
  const productRows = [];
  const firstProduct = contract.products[0]; // Gearbox
  const rowSpanCount = contract.coupling ? 2 : 1; // Determine rowspan based on coupling presence

  // Gearbox Row
  const gearboxRow = new TableRow({
    children: [
      new TableCell({ rowSpan: rowSpanCount, verticalAlign: VerticalAlign.CENTER, children: [createCenterPara("2")] }),
      new TableCell({ children: [createPara(firstProduct.name)] }),
      new TableCell({ children: [createPara(firstProduct.model)] }),
      new TableCell({ children: [createPara(firstProduct.brand)] }),
      new TableCell({ children: [createCenterPara(firstProduct.unit)] }),
      new TableCell({ children: [createCenterPara(firstProduct.quantity.toString())] }),
      new TableCell({ children: [createRightPara(formatCurrency(firstProduct.unitPrice))] }),
      new TableCell({ children: [createRightPara(formatCurrency(firstProduct.amount))] }),
      new TableCell({ children: [createCenterPara(firstProduct.deliveryQuarter === 1 ? "√" : "")] }), // Q1
      new TableCell({ children: [createCenterPara(firstProduct.deliveryQuarter === 2 ? "√" : "")] }), // Q2
      new TableCell({ children: [createCenterPara(firstProduct.deliveryQuarter === 3 ? "√" : "")] }), // Q3
      new TableCell({ children: [createCenterPara(firstProduct.deliveryQuarter === 4 ? "√" : "")] }), // Q4
      new TableCell({ rowSpan: rowSpanCount, verticalAlign: VerticalAlign.CENTER, children: [createPara("")] }), // Remarks cell with rowspan
    ],
  });
  productRows.push(gearboxRow);

  // Coupling Row (if exists)
  if (contract.coupling) {
    const couplingRow = new TableRow({
      children: [
        // No序号 cell due to rowspan
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
        // No Remarks cell due to rowspan
      ],
    });
    productRows.push(couplingRow);
  }

  // --- Total Row ---
  const totalRow = new TableRow({
    children: [
      new TableCell({
        columnSpan: 2,
        children: [createPara("合计人民币（大写）：", AlignmentType.LEFT, true)], // Bold total label
      }),
      new TableCell({
        columnSpan: 5, // Span 5 columns (Model to Quantity)
        children: [createPara(contract.totalAmountInChinese)],
      }),
      new TableCell({
        columnSpan: 6, // Span remaining 6 columns (UnitPrice to Remarks)
        children: [createPara(`¥（小写）：${formatCurrency(contract.totalAmount)}`)],
      }),
    ],
  });
  productRows.push(totalRow);

  // --- Combine and Return Table ---
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    borders: { /* ... Standard Borders ... */
        top: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        bottom: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        left: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        right: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideHorizontal: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
        insideVertical: { style: BorderStyle.SINGLE, size: 1, color: "000000" },
    },
    rows: [headerRow1, headerRow2, ...productRows],
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
             // Example:
             // page: {
             //   margin: {
             //     top: 720, // 0.5 inch -> 720 twentieths of a point
             //     right: 720,
             //     bottom: 720,
             //     left: 720,
             //   },
             // },
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
              // tabStops: [ { type: TabStopType.RIGHT, position: TabStopPosition.MAX } ],
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

          ], // <--- End of main document content
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
 * 导出合同为PDF文档
 * @param {Object} contract - 合同数据
 * @param {string} [filename] - 文件名 (可选)
 */
export const exportContractToPDF = (contract, filename) => {
    if (!contract || !contract.success) {
        console.error("无法导出PDF：无效的合同数据");
        return;
    }
  try {
    // --- PDF Setup ---
    const doc = new jsPDF('p', 'pt', 'a4'); // Use points for better control, A4 size
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;
    const margin = 40; // Page margin in points
    const contentWidth = pageWidth - 2 * margin;
    let currentY = margin; // Track current Y position

    // --- Font Loading (Crucial for Chinese) ---
    // Add the Base64 encoded font to the PDF document
    if (simplifiedChineseFontBase64 && simplifiedChineseFontBase64 !== 'YOUR_BASE64_ENCODED_FONT_STRING_HERE') {
        doc.addFileToVFS(`${FONT_NAME}.ttf`, simplifiedChineseFontBase64);
        doc.addFont(`${FONT_NAME}.ttf`, FONT_NAME, 'normal');
        doc.setFont(FONT_NAME);
        console.log(`Font ${FONT_NAME} embedded.`);
    } else {
        console.warn("Chinese font Base64 string not provided or is still the placeholder. PDF might have garbled text.");
        // Fallback font if Base64 is missing
        doc.setFont('helvetica', 'normal');
    }

    // --- Helper function for adding text and updating Y ---
    const addText = (text, x, y, options = {}) => {
        const defaultOptions = { maxWidth: contentWidth, align: 'left', fontSize: 10, lineSpacingFactor: 1.15 };
        const mergedOptions = { ...defaultOptions, ...options };

        doc.setFontSize(mergedOptions.fontSize);
        const lines = doc.splitTextToSize(text || "", mergedOptions.maxWidth);
        doc.text(lines, x, y, { align: mergedOptions.align });
        return y + lines.length * mergedOptions.fontSize * mergedOptions.lineSpacingFactor; // Return new Y
    };

    // --- Title ---
    currentY = addText("上海前进齿轮经营有限公司产品销售合同", pageWidth / 2, currentY, { align: 'center', fontSize: 16 });
    currentY += 10; // Spacing

    // --- Header Info ---
    doc.setFontSize(9);
    const headerLeft = `签订地点：上海`;
    const headerRight = `合同编号：${contract.contractNumber}`;
    const headerRightWidth = doc.getTextWidth(headerRight);
    doc.text(headerLeft, margin, currentY);
    doc.text(headerRight, pageWidth - margin - headerRightWidth, currentY);
    currentY += 15;

    const dateLeft = `签订日期：${contract.contractDate}`;
    const dateRight = `统计编号：`; // Leave blank or fill
    const dateRightWidth = doc.getTextWidth(dateRight);
    doc.text(dateLeft, margin, currentY);
    doc.text(dateRight, pageWidth - margin - dateRightWidth, currentY);
    currentY += 25; // More spacing before table

    // --- Buyer/Seller Table ---
    const buyerSellerHead = [
      { content: '序号', styles: { halign: 'center', cellWidth: 30 } },
      { content: '项目', styles: { cellWidth: 70 } },
      { content: '需方信息', styles: { cellWidth: 180 } }, // Adjusted width
      { content: '项目', styles: { cellWidth: 70 } },
      { content: '供方信息', styles: { cellWidth: 180 } }, // Adjusted width
    ];
    const buyerSellerBody = [
      ['1', '单位名称', contract.buyerInfo.name,          '单位名称', contract.sellerInfo.name],
      ['', '法定代表人', contract.buyerInfo.legalRepresentative, '法定代表人', contract.sellerInfo.legalRepresentative],
      ['', '委托代理人', contract.buyerInfo.agent || '',          '委托代理人', contract.sellerInfo.agent || ''], // Add agent if available
      ['', '通讯地址', contract.buyerInfo.address,       '通讯地址', contract.sellerInfo.address],
      ['', '邮政编码', contract.buyerInfo.postalCode,    '邮政编码', contract.sellerInfo.postalCode],
      ['', '电话/传真', `${contract.buyerInfo.phone || ''}${contract.buyerInfo.fax ? ' / '+contract.buyerInfo.fax : ''}`, '电话/传真', `${contract.sellerInfo.phone || ''}${contract.sellerInfo.fax ? ' / '+contract.sellerInfo.fax : ''}`],
      ['', '税号', contract.buyerInfo.taxNumber,       '税号', contract.sellerInfo.taxNumber],
      ['', '银行及账号', `${contract.buyerInfo.bank || ''}\n${contract.buyerInfo.accountNumber || ''}`, '银行及账号', `${contract.sellerInfo.bank}\n${contract.sellerInfo.accountNumber}`]
    ];

    doc.autoTable({
      startY: currentY,
      head: [buyerSellerHead],
      body: buyerSellerBody,
      theme: 'grid',
      styles: { 
          fontSize: 8, 
          cellPadding: 3, 
          font: FONT_NAME // Apply the embedded font to the table
      },
      headStyles: { 
          fillColor: [230, 230, 230], 
          textColor: 0, 
          halign: 'center', 
          fontStyle: 'bold', 
          font: FONT_NAME // Apply font to header
      },
      columnStyles: {
        0: { halign: 'center', valign: 'middle' }, // Seq No
        2: { cellWidth: 180 }, // Buyer info
        4: { cellWidth: 180 }, // Seller info
      },
      didParseCell: function (data) {
         // Vertical centering for row-spanned "1"
        if (data.section === 'body' && data.column.index === 0 && data.row.index === 0) {
            data.cell.rowSpan = buyerSellerBody.length; // Span all body rows
            data.cell.styles.valign = 'middle';
        }
      },
      didDrawPage: (data) => { currentY = data.cursor.y; } // Update Y after table draw
    });
    currentY += 10; // Spacing

    // --- Products Table ---
     const productHead = [
        // Row 1
        [
            { content: '序号', rowSpan: 2, styles: { halign: 'center', valign: 'middle'} },
            { content: '产品名称', rowSpan: 2, styles: { halign: 'center', valign: 'middle'} },
            { content: '规格型号', rowSpan: 2, styles: { halign: 'center', valign: 'middle'} },
            { content: '商标', rowSpan: 2, styles: { halign: 'center', valign: 'middle'} },
            { content: '计量单位', rowSpan: 2, styles: { halign: 'center', valign: 'middle'} },
            { content: '数量', rowSpan: 2, styles: { halign: 'center', valign: 'middle'} },
            { content: '单价（元）', rowSpan: 2, styles: { halign: 'center', valign: 'middle'} },
            { content: '金额（元）', rowSpan: 2, styles: { halign: 'center', valign: 'middle'} },
            { content: `交货期（${contract.products[0]?.deliveryYear || new Date().getFullYear()}年度）`, colSpan: 4, styles: { halign: 'center', valign: 'middle'} },
            { content: '备注', rowSpan: 2, styles: { halign: 'center', valign: 'middle'} },
        ],
        // Row 2 (Delivery Quarters)
        [
            { content: '一季度', styles: { halign: 'center', valign: 'middle', minCellWidth: 25 } },
            { content: '二季度', styles: { halign: 'center', valign: 'middle', minCellWidth: 25 } },
            { content: '三季度', styles: { halign: 'center', valign: 'middle', minCellWidth: 25 } },
            { content: '四季度', styles: { halign: 'center', valign: 'middle', minCellWidth: 25 } },
        ]
    ];

    const productBody = [];
    // Gearbox Row
    const firstProduct = contract.products[0];
    productBody.push([
        { content: '2', rowSpan: contract.coupling ? 2 : 1, styles: { halign: 'center', valign: 'middle'} },
        firstProduct.name,
        firstProduct.model,
        firstProduct.brand,
        { content: firstProduct.unit, styles: { halign: 'center'} },
        { content: firstProduct.quantity, styles: { halign: 'center'} },
        { content: firstProduct.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { halign: 'right'} },
        { content: firstProduct.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { halign: 'right'} },
        { content: firstProduct.deliveryQuarter === 1 ? '√' : '', styles: { halign: 'center'} },
        { content: firstProduct.deliveryQuarter === 2 ? '√' : '', styles: { halign: 'center'} },
        { content: firstProduct.deliveryQuarter === 3 ? '√' : '', styles: { halign: 'center'} },
        { content: firstProduct.deliveryQuarter === 4 ? '√' : '', styles: { halign: 'center'} },
        { content: '', rowSpan: contract.coupling ? 2 : 1, styles: { valign: 'middle' } }, // Remark cell with rowspan
    ]);

    // Coupling Row (if exists)
    if (contract.coupling) {
        productBody.push([
            // Seq num covered by rowspan
            contract.coupling.name,
            contract.coupling.model,
            contract.coupling.brand,
            { content: contract.coupling.unit, styles: { halign: 'center'} },
            { content: contract.coupling.quantity, styles: { halign: 'center'} },
            { content: contract.coupling.unitPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { halign: 'right'} },
            { content: contract.coupling.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }), styles: { halign: 'right'} },
            '', '', '', '', // Quarters empty
            // Remark covered by rowspan
        ]);
    }

    // Total Row
    productBody.push([
       { content: '合计人民币（大写）：', colSpan: 2, styles: { fontStyle: 'bold' } },
       { content: contract.totalAmountInChinese, colSpan: 5 }, // Spans Model to Amount
       { content: `¥（小写）：${contract.totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, colSpan: 6 } // Spans Quarters + Remarks
    ]);


    doc.autoTable({
      startY: currentY,
      head: productHead,
      body: productBody,
      theme: 'grid',
      styles: { 
          fontSize: 8, 
          cellPadding: 3, 
          font: FONT_NAME // Apply the embedded font
      },
      headStyles: { 
          fillColor: [230, 230, 230], 
          textColor: 0, 
          halign: 'center', 
          fontStyle: 'bold', 
          font: FONT_NAME // Apply font to header
      },
      didDrawPage: (data) => { currentY = data.cursor.y; }
    });
    currentY += 10; // Spacing

    // --- Terms Table ---
    // Needs careful multi-row span handling in body definition for autoTable
     const termsBody = [
        [ // Row 1
            { content: '3', styles: { halign: 'center' } },
            `执行质量标准：${contract.executionStandard}`,
            { content: '11', styles: { halign: 'center' } },
            `违约责任：按《中华人民共和国民法典》相关规定执行。`,
        ],
        [ // Row 2
            { content: '4', styles: { halign: 'center' } },
            `需方验收及提出质量异议期限：${contract.inspectionPeriod}`,
            { content: '12', rowSpan: 2, styles: { halign: 'center', valign: 'middle' } },
            { content: contract.disputeResolution, rowSpan: 2 },
        ],
        [ // Row 3
            { content: '5', styles: { halign: 'center' } },
            `交货时间：${contract.deliveryDate}`,
             // Cells 12 covered by rowspan
        ],
        [ // Row 4
            { content: '6', styles: { halign: 'center' } },
            `交货地点：${contract.deliveryLocation}`,
            { content: '13', rowSpan: 3, styles: { halign: 'center', valign: 'middle' } },
            { content: `其他约定事项或特殊订货要求：${contract.specialRequirements}`, rowSpan: 3 },
        ],
        [ // Row 5
             { content: '7', styles: { halign: 'center' } },
            `交货方式：${contract.deliveryMethod}`,
            // Cells 13 covered by rowspan
        ],
        [ // Row 6
            { content: '8', styles: { halign: 'center' } },
            `运输方式及费用承担：${contract.transportMethod}，${contract.transportFeeArrangement}`,
             // Cells 13 covered by rowspan
        ],
        [ // Row 7
            { content: '9', styles: { halign: 'center' } },
            `包装标准及费用承担：${contract.packagingStandard}，${contract.packagingFeeArrangement}`,
            { content: '14', styles: { halign: 'center' } },
            `合同有效期限：${contract.expiryDate}`,
        ],
        [ // Row 8
            { content: '10', styles: { halign: 'center' } },
            `结算方式及期限：${contract.paymentMethod}`,
            { content: '15', styles: { halign: 'center' } },
            contract.contractCopies,
        ],
    ];

    doc.autoTable({
      startY: currentY,
      body: termsBody,
      theme: 'grid',
      styles: { 
          fontSize: 8, 
          cellPadding: 3, 
          font: FONT_NAME // Apply the embedded font
      },
      columnStyles: { // Define widths for the 4 logical columns
        0: { cellWidth: 30, halign: 'center' }, // Seq No 1
        1: { cellWidth: 205 }, // Content 1
        2: { cellWidth: 30, halign: 'center' }, // Seq No 2
        3: { cellWidth: 205 }, // Content 2
      },
      didDrawPage: (data) => { currentY = data.cursor.y; }
    });
    currentY += 30; // Spacing before signatures

    // --- Signature Area ---
     // Check if signature area fits on the current page, otherwise add new page
     const signatureHeight = 80; // Estimated height needed for signature block
     if (currentY + signatureHeight > pageHeight - margin) {
         doc.addPage();
         currentY = margin;
     }

    doc.setFontSize(9);
    const sigLeftX = margin;
    const sigRightX = margin + contentWidth / 2 + 10;

    doc.text("需方（盖章）：", sigLeftX, currentY);
    doc.text("供方（盖章）：", sigRightX, currentY);
    currentY += 25;
    doc.text("法定代表人或委托代理人（签字）：", sigLeftX, currentY);
    doc.text("法定代表人或委托代理人（签字）：", sigRightX, currentY);
    currentY += 15;
    doc.text("________________________", sigLeftX + doc.getTextWidth("法定代表人或委托代理人（签字）：")-30, currentY); // Underline approx position
    doc.text("________________________", sigRightX + doc.getTextWidth("法定代表人或委托代理人（签字）：")-30, currentY);
    currentY += 25;
    doc.text("日期：________________________", sigLeftX, currentY);
    doc.text("日期：________________________", sigRightX, currentY);

    // --- Save PDF ---
    doc.save(`${filename || '销售合同'}.pdf`);
  } catch (error) {
    console.error("导出PDF文档失败:", error);
    throw new Error("导出PDF文档失败: " + error.message);
  }
};