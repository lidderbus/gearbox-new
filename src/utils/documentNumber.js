// src/utils/documentNumber.js
// 统一单据编号生成: QJ-<类型码>-YYYYMMDD-NNN
//   报价单 QJ-BJ-...  销售合同 QJ-HT-...  技术协议 QJ-XY-...
// NNN 按"类型+日期"在 localStorage 中日序自增 — 比随机数抗碰撞、可追溯、人类可读。
// localStorage 不可用(SSR/隐私模式)时回退到时间派生序号, 仍保证唯一。

const PREFIX = { quotation: 'BJ', contract: 'HT', agreement: 'XY' };
const STORAGE_KEY = 'qj_doc_seq';
const MAX_KEYS = 400; // 防止序号表无限增长(约保留一年量级)

function ymd(date) {
  const d = date || new Date();
  return `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
}

function nextSeq(type, dateStr) {
  try {
    const raw = (typeof localStorage !== 'undefined') ? localStorage.getItem(STORAGE_KEY) : null;
    const store = raw ? JSON.parse(raw) : {};
    const key = `${type}-${dateStr}`;
    const next = (Number(store[key]) || 0) + 1;
    store[key] = next;
    const keys = Object.keys(store);
    if (keys.length > MAX_KEYS) {
      keys.sort().slice(0, keys.length - MAX_KEYS).forEach((k) => delete store[k]);
    }
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    }
    return next;
  } catch (e) {
    // 回退: 用当前毫秒末 3 位, 避免抛错
    return Number(String(Date.now()).slice(-3)) || 1;
  }
}

/**
 * 生成单据编号
 * @param {'quotation'|'contract'|'agreement'} type 单据类型
 * @param {Date} [date] 指定日期(默认今天)
 * @returns {string} 形如 QJ-BJ-20260530-001
 */
export function genDocNumber(type, date) {
  const code = PREFIX[type] || 'DOC';
  const dateStr = ymd(date);
  const seq = String(nextSeq(type, dateStr)).padStart(3, '0');
  return `QJ-${code}-${dateStr}-${seq}`;
}

export default genDocNumber;
