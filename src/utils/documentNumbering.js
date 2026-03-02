// src/utils/documentNumbering.js
// 文档编号自动生成系统

const SEQUENCES_KEY = 'doc_number_sequences';

const DOC_PREFIXES = {
  inquiry: 'TI',     // Technical Inquiry
  quotation: 'QT',   // Quotation
  agreement: 'TA',   // Technical Agreement
  contract: 'SC',    // Sales Contract
};

/**
 * 获取当前编号序列
 */
const getSequences = () => {
  try {
    const data = localStorage.getItem(SEQUENCES_KEY);
    if (data) return JSON.parse(data);
  } catch (e) {
    console.warn('读取编号序列失败:', e);
  }
  return {};
};

/**
 * 保存编号序列
 */
const saveSequences = (sequences) => {
  try {
    localStorage.setItem(SEQUENCES_KEY, JSON.stringify(sequences));
  } catch (e) {
    console.warn('保存编号序列失败:', e);
  }
};

/**
 * 生成下一个文档编号
 * @param {'inquiry'|'quotation'|'agreement'|'contract'} type - 文档类型
 * @returns {string} 编号，如 TI-2026-0001
 */
export const generateDocNumber = (type) => {
  const prefix = DOC_PREFIXES[type];
  if (!prefix) {
    console.warn(`未知文档类型: ${type}`);
    return `DOC-${Date.now()}`;
  }

  const year = new Date().getFullYear();
  const yearKey = `${type}_${year}`;
  const sequences = getSequences();
  const nextSeq = (sequences[yearKey] || 0) + 1;
  sequences[yearKey] = nextSeq;
  saveSequences(sequences);

  return `${prefix}-${year}-${String(nextSeq).padStart(4, '0')}`;
};

/**
 * 获取当前年度某类型的文档计数
 * @param {'inquiry'|'quotation'|'agreement'|'contract'} type
 * @returns {number}
 */
export const getDocCount = (type) => {
  const year = new Date().getFullYear();
  const yearKey = `${type}_${year}`;
  const sequences = getSequences();
  return sequences[yearKey] || 0;
};

/**
 * 获取所有类型的文档计数
 * @returns {Object} { inquiry: n, quotation: n, agreement: n, contract: n }
 */
export const getAllDocCounts = () => {
  const year = new Date().getFullYear();
  const sequences = getSequences();
  return {
    inquiry: sequences[`inquiry_${year}`] || 0,
    quotation: sequences[`quotation_${year}`] || 0,
    agreement: sequences[`agreement_${year}`] || 0,
    contract: sequences[`contract_${year}`] || 0,
  };
};

/**
 * 获取文档类型的中文名称
 */
export const getDocTypeName = (type) => {
  const names = {
    inquiry: '技术询单',
    quotation: '报价单',
    agreement: '技术协议',
    contract: '销售合同',
  };
  return names[type] || type;
};

/**
 * 从编号解析文档类型
 * @param {string} docNumber - 如 TI-2026-0001
 * @returns {{ type: string, year: number, sequence: number } | null}
 */
export const parseDocNumber = (docNumber) => {
  const match = docNumber?.match(/^(TI|QT|TA|SC)-(\d{4})-(\d{4})$/);
  if (!match) return null;

  const prefixToType = {};
  Object.entries(DOC_PREFIXES).forEach(([type, prefix]) => {
    prefixToType[prefix] = type;
  });

  return {
    type: prefixToType[match[1]] || match[1],
    year: parseInt(match[2]),
    sequence: parseInt(match[3]),
  };
};

export default {
  generateDocNumber,
  getDocCount,
  getAllDocCounts,
  getDocTypeName,
  parseDocNumber,
  DOC_PREFIXES,
};
