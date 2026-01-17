// src/data/receivables.js
// 应收账款管理数据结构 - 解决审计发现的长期应收款问题

/**
 * 账龄分类枚举 (按审计标准)
 */
export const AgingCategory = {
  CURRENT: 'current',       // 1年以内
  ONE_TO_TWO: 'one_to_two', // 1-2年 (计提20%)
  OVER_THREE: 'over_three'  // 3年以上 (计提100%)
};

/**
 * 催收状态枚举
 */
export const CollectionStatus = {
  NORMAL: 'normal',         // 正常
  OVERDUE: 'overdue',       // 逾期
  IN_COLLECTION: 'in_collection', // 催收中
  DISPUTED: 'disputed',     // 有争议
  BAD_DEBT: 'bad_debt',     // 坏账
  WRITTEN_OFF: 'written_off' // 已核销
};

/**
 * 客户信用等级
 */
export const CreditRating = {
  A: { level: 'A', label: '优质', creditLimit: 500000, paymentDays: 90 },
  B: { level: 'B', label: '良好', creditLimit: 300000, paymentDays: 60 },
  C: { level: 'C', label: '一般', creditLimit: 100000, paymentDays: 30 },
  D: { level: 'D', label: '风险', creditLimit: 0, paymentDays: 0 }  // 需预付款
};

/**
 * 应收账款记录数据结构
 */
export const createReceivable = ({
  id = null,
  customerName = '',
  customerId = '',
  invoiceNo = '',         // 发票号
  contractNo = '',        // 合同号
  amount = 0,             // 应收金额
  paidAmount = 0,         // 已收金额
  invoiceDate = null,     // 开票日期
  dueDate = null,         // 到期日期
  status = CollectionStatus.NORMAL,
  creditRating = 'B',
  salesperson = '',       // 业务员
  products = [],          // 产品明细
  remark = ''
}) => ({
  id: id || `AR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  customerName,
  customerId,
  invoiceNo,
  contractNo,
  amount,
  paidAmount,
  balance: amount - paidAmount,  // 未收余额
  invoiceDate: invoiceDate || new Date().toISOString(),
  dueDate,
  status,
  creditRating,
  salesperson,
  products,
  createdAt: new Date().toISOString(),
  remark
});

/**
 * 催收记录数据结构
 */
export const createCollectionRecord = ({
  id = null,
  receivableId = '',
  customerId = '',
  customerName = '',
  method = 'phone',       // phone | email | visit | letter | legal
  operator = '',
  result = '',            // 催收结果
  promisedDate = null,    // 承诺还款日期
  promisedAmount = 0,     // 承诺还款金额
  nextFollowUp = null,    // 下次跟进日期
  createdAt = null,
  remark = ''
}) => ({
  id: id || `COL-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  receivableId,
  customerId,
  customerName,
  method,
  operator,
  result,
  promisedDate,
  promisedAmount,
  nextFollowUp,
  createdAt: createdAt || new Date().toISOString(),
  remark
});

/**
 * 计算账龄
 * @param {string} invoiceDate - 开票日期
 * @returns {AgingCategory}
 */
export const calculateAging = (invoiceDate) => {
  const now = new Date();
  const invoice = new Date(invoiceDate);
  const diffYears = (now - invoice) / (1000 * 60 * 60 * 24 * 365);

  if (diffYears < 1) {
    return AgingCategory.CURRENT;
  } else if (diffYears < 2) {
    return AgingCategory.ONE_TO_TWO;
  } else {
    return AgingCategory.OVER_THREE;
  }
};

/**
 * 计算账龄天数
 */
export const calculateAgingDays = (invoiceDate) => {
  const now = new Date();
  const invoice = new Date(invoiceDate);
  return Math.floor((now - invoice) / (1000 * 60 * 60 * 24));
};

/**
 * 计算坏账计提金额 (按审计标准)
 * 1-2年: 20%
 * 3年以上: 100%
 */
export const calculateProvision = (amount, aging) => {
  switch (aging) {
    case AgingCategory.ONE_TO_TWO:
      return amount * 0.2;
    case AgingCategory.OVER_THREE:
      return amount * 1.0;
    default:
      return 0;
  }
};

/**
 * 初始应收账款数据 (根据审计报告 2025-10-31)
 * 期末应收账款余额: 5,278,737.20元
 * 1-2年: 557,900.00元
 * 3年以上: 551,285.60元
 */
export const initialReceivables = [
  // 3年以上应收款 (100%计提)
  createReceivable({
    customerName: '申佳船厂(上海4805厂)',
    customerId: 'CUST-001',
    invoiceNo: 'INV-2021-0001',
    amount: 22500,
    paidAmount: 0,
    invoiceDate: '2021-06-15',
    status: CollectionStatus.BAD_DEBT,
    creditRating: 'D',
    remark: '已提交核销申请'
  }),
  createReceivable({
    customerName: '镇江索普船舶修造有限公司',
    customerId: 'CUST-002',
    invoiceNo: 'INV-2021-0002',
    amount: 41450,
    paidAmount: 0,
    invoiceDate: '2021-08-20',
    status: CollectionStatus.BAD_DEBT,
    creditRating: 'D',
    remark: '已提交核销申请'
  }),
  createReceivable({
    customerName: '上海宗宝齿轮箱配件经营部',
    customerId: 'CUST-003',
    invoiceNo: 'INV-2021-0003',
    amount: 26930.40,
    paidAmount: 0,
    invoiceDate: '2021-09-10',
    status: CollectionStatus.IN_COLLECTION,
    creditRating: 'C',
    remark: '与客户协商，预估年底收回'
  }),
  createReceivable({
    customerName: '永济新时速电机电器有限责任公司',
    customerId: 'CUST-004',
    invoiceNo: 'INV-2020-0001',
    amount: 255380,
    paidAmount: 0,
    invoiceDate: '2020-03-15',
    status: CollectionStatus.BAD_DEBT,
    creditRating: 'D',
    remark: '年份时间较长，无对接业务员，较难收回'
  }),
  createReceivable({
    customerName: '扬州龙和造船有限公司',
    customerId: 'CUST-005',
    invoiceNo: 'INV-2021-0004',
    amount: 40000,
    paidAmount: 0,
    invoiceDate: '2021-11-20',
    status: CollectionStatus.IN_COLLECTION,
    creditRating: 'C',
    remark: '与客户协商，预估年底收回'
  }),
  createReceivable({
    customerName: '上海凯泉泵业(集团）有限公司',
    customerId: 'CUST-006',
    invoiceNo: 'INV-2021-0005',
    amount: 6100,
    paidAmount: 6100,  // 已收回
    invoiceDate: '2021-12-10',
    status: CollectionStatus.NORMAL,
    creditRating: 'B',
    remark: '已收回'
  }),
  createReceivable({
    customerName: '上海亚域动力工程有限公司',
    customerId: 'CUST-007',
    invoiceNo: 'INV-2021-0006',
    amount: 42401.70,
    paidAmount: 42401.70,  // 已收回
    invoiceDate: '2021-12-15',
    status: CollectionStatus.NORMAL,
    creditRating: 'B',
    remark: '已收回'
  }),

  // 1-2年应收款 (20%计提)
  createReceivable({
    customerName: '江苏海宏建设工程有限公司',
    customerId: 'CUST-008',
    invoiceNo: 'INV-2023-0001',
    amount: 201675,
    paidAmount: 0,
    invoiceDate: '2023-08-15',
    status: CollectionStatus.DISPUTED,
    creditRating: 'C',
    remark: '有质量问题纠纷，目前还在沟通'
  }),
  createReceivable({
    customerName: '上海凌耀船舶工程有限公司',
    customerId: 'CUST-009',
    invoiceNo: 'INV-2023-0002',
    contractNo: 'HT-2023-0088',
    amount: 136700,
    paidAmount: 0,
    invoiceDate: '2023-06-20',
    status: CollectionStatus.IN_COLLECTION,
    creditRating: 'C',
    salesperson: '张经理'
  }),
  createReceivable({
    customerName: '硕海（西安）国际贸易有限公司',
    customerId: 'CUST-010',
    invoiceNo: 'INV-2023-0003',
    amount: 219200,
    paidAmount: 0,
    invoiceDate: '2023-09-10',
    status: CollectionStatus.OVERDUE,
    creditRating: 'D',
    remark: '对方公司目前较为困难，款项暂时无法及时支付'
  }),
  createReceivable({
    customerName: '江苏海新船务重工有限公司',
    customerId: 'CUST-011',
    invoiceNo: 'INV-2021-0007',
    amount: 3023.50,
    paidAmount: 0,
    invoiceDate: '2021-07-15',
    status: CollectionStatus.BAD_DEBT,
    creditRating: 'D'
  }),
  createReceivable({
    customerName: '深圳市若雅方舟科技有限公司',
    customerId: 'CUST-012',
    invoiceNo: 'INV-2022-0001',
    amount: 15000,
    paidAmount: 0,
    invoiceDate: '2022-03-20',
    status: CollectionStatus.IN_COLLECTION,
    creditRating: 'C',
    remark: '已向客户催讨'
  })
];

/**
 * 催收记录 (初始为空)
 */
export const initialCollectionRecords = [];

/**
 * 应收账款统计
 */
export const calculateReceivablesStats = (receivables) => {
  const stats = {
    totalReceivables: 0,      // 应收总额
    totalPaid: 0,             // 已收金额
    totalBalance: 0,          // 未收余额
    currentBalance: 0,        // 1年以内
    oneToTwoBalance: 0,       // 1-2年
    overThreeBalance: 0,      // 3年以上
    totalProvision: 0,        // 坏账计提总额
    overdueCount: 0,          // 逾期笔数
    disputedCount: 0,         // 争议笔数
    customerCount: 0          // 客户数
  };

  const customerSet = new Set();

  receivables.forEach(item => {
    stats.totalReceivables += item.amount;
    stats.totalPaid += item.paidAmount;
    stats.totalBalance += item.balance;

    const aging = calculateAging(item.invoiceDate);

    if (aging === AgingCategory.CURRENT) {
      stats.currentBalance += item.balance;
    } else if (aging === AgingCategory.ONE_TO_TWO) {
      stats.oneToTwoBalance += item.balance;
      stats.totalProvision += item.balance * 0.2;
    } else {
      stats.overThreeBalance += item.balance;
      stats.totalProvision += item.balance;
    }

    if (item.status === CollectionStatus.OVERDUE || item.status === CollectionStatus.IN_COLLECTION) {
      stats.overdueCount++;
    }

    if (item.status === CollectionStatus.DISPUTED) {
      stats.disputedCount++;
    }

    customerSet.add(item.customerId);
  });

  stats.customerCount = customerSet.size;

  return stats;
};

/**
 * 获取需要催收的应收款
 * @param {number} daysBeforeDue - 到期前多少天开始提醒
 */
export const getReceivablesNeedingCollection = (receivables, daysBeforeDue = 15) => {
  const now = new Date();

  return receivables.filter(item => {
    if (item.balance <= 0) return false;  // 已结清

    // 已逾期
    if (item.dueDate && new Date(item.dueDate) < now) {
      return true;
    }

    // 即将到期
    if (item.dueDate) {
      const dueDate = new Date(item.dueDate);
      const daysUntilDue = (dueDate - now) / (1000 * 60 * 60 * 24);
      if (daysUntilDue <= daysBeforeDue && daysUntilDue > 0) {
        return true;
      }
    }

    // 账龄超过1年
    const agingDays = calculateAgingDays(item.invoiceDate);
    if (agingDays > 365) {
      return true;
    }

    return false;
  });
};

/**
 * 按客户汇总应收款
 */
export const summarizeByCustomer = (receivables) => {
  const summary = {};

  receivables.forEach(item => {
    if (!summary[item.customerId]) {
      summary[item.customerId] = {
        customerId: item.customerId,
        customerName: item.customerName,
        creditRating: item.creditRating,
        totalAmount: 0,
        totalPaid: 0,
        totalBalance: 0,
        invoiceCount: 0,
        oldestInvoice: item.invoiceDate,
        latestInvoice: item.invoiceDate
      };
    }

    const cust = summary[item.customerId];
    cust.totalAmount += item.amount;
    cust.totalPaid += item.paidAmount;
    cust.totalBalance += item.balance;
    cust.invoiceCount++;

    if (new Date(item.invoiceDate) < new Date(cust.oldestInvoice)) {
      cust.oldestInvoice = item.invoiceDate;
    }
    if (new Date(item.invoiceDate) > new Date(cust.latestInvoice)) {
      cust.latestInvoice = item.invoiceDate;
    }
  });

  return Object.values(summary);
};

const receivablesModule = {
  AgingCategory,
  CollectionStatus,
  CreditRating,
  createReceivable,
  createCollectionRecord,
  calculateAging,
  calculateAgingDays,
  calculateProvision,
  initialReceivables,
  initialCollectionRecords,
  calculateReceivablesStats,
  getReceivablesNeedingCollection,
  summarizeByCustomer
};

export default receivablesModule;
