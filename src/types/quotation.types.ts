/**
 * 报价单相关类型定义
 */

/**
 * 报价单项目
 */
export interface QuotationItem {
  id: string;
  name: string;
  model: string;
  specification?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  remark?: string;
  category?: 'gearbox' | 'coupling' | 'pump' | 'accessory' | 'custom';
}

/**
 * 报价单
 */
export interface Quotation {
  id: string;
  quotationNumber: string;
  date: string;
  customer?: {
    name: string;
    contact?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  items: QuotationItem[];
  subtotal: number;
  tax?: number;
  totalAmount: number;
  discount?: number;
  validityPeriod?: number; // 有效期（天数）
  paymentTerms?: string;
  deliveryTerms?: string;
  notes?: string;
  createdBy?: string;
  status?: 'draft' | 'sent' | 'accepted' | 'rejected';
}

/**
 * 报价单比较结果
 */
export interface QuotationComparison {
  quotationA: Quotation;
  quotationB: Quotation;
  differences: QuotationDifference[];
  summary: {
    totalDifference: number;
    percentChange: number;
    itemsAdded: number;
    itemsRemoved: number;
    itemsModified: number;
  };
}

/**
 * 报价单差异项
 */
export interface QuotationDifference {
  type: 'itemAdded' | 'itemRemoved' | 'priceChanged' | 'quantityChanged' | 'totalAmount';
  model?: string;
  description: string;
  valueA: number;
  valueB: number;
  difference: number;
  percentChange: number;
}

/**
 * 报价单导出选项
 */
export interface QuotationExportOptions {
  format: 'excel' | 'pdf' | 'word';
  includeImages?: boolean;
  language?: 'zh' | 'en';
  template?: string;
}

/**
 * 报价单历史记录
 */
export interface QuotationHistory {
  quotations: Quotation[];
  lastModified: string;
  totalCount: number;
}
