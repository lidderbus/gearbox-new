// src/services/ecoStore.js
// P2-1: 工程修订单 (Engineering Change Order, ECO) 流程
// 流程: draft → submitted → approved/rejected → effective
// ECO 关联到资源(说明书/图纸/法规等),驱动版本号变化与审计日志

const STORAGE_KEY = 'eco_records';
const NUMBER_KEY = 'eco_next_seq';
const MAX_RECORDS = 500;

const safeRead = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('读取 ECO 记录失败:', e);
    return [];
  }
};

const safeWrite = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('写入 ECO 记录失败:', e);
    return false;
  }
};

/**
 * 生成新 ECO 编号 (ECO-YYYY-XXXX)
 */
export const generateEcoNumber = () => {
  const year = new Date().getFullYear();
  const seqKey = `${NUMBER_KEY}_${year}`;
  let seq = 0;
  try { seq = parseInt(localStorage.getItem(seqKey) || '0', 10); } catch (e) { /* ignore */ }
  seq += 1;
  try { localStorage.setItem(seqKey, String(seq)); } catch (e) { /* ignore */ }
  return `ECO-${year}-${String(seq).padStart(4, '0')}`;
};

/**
 * ECO 流程状态
 */
export const ECO_STATES = {
  draft: { label: '草稿', color: 'secondary', next: ['submitted'] },
  submitted: { label: '已提交,待审核', color: 'warning', next: ['approved', 'rejected'] },
  approved: { label: '已批准', color: 'info', next: ['effective'] },
  rejected: { label: '已驳回', color: 'danger', next: [] },
  effective: { label: '已生效', color: 'success', next: [] },
};

/**
 * 创建 ECO 草稿
 *
 * @param {Object} params
 * @param {string} params.resourceType — 资源类型 (manual/drawing/template/standard/case)
 * @param {string} params.resourceId — 关联资源 ID
 * @param {string} params.fromVersion — 旧版本号
 * @param {string} params.toVersion — 新版本号 (建议)
 * @param {string} params.reason — 修订理由
 * @param {string} params.author — 申请人
 * @param {string} [params.scope] — 影响范围描述
 * @param {string} [params.attachments] — 附件 ID/路径
 * @returns {Object} 新建的 ECO 记录
 */
export const createEco = ({ resourceType, resourceId, fromVersion, toVersion, reason, author, scope = '', attachments = '' }) => {
  if (!resourceType || !resourceId || !reason) {
    throw new Error('resourceType / resourceId / reason 为必填');
  }
  const all = safeRead();
  const ecoId = generateEcoNumber();
  const eco = {
    ecoId,
    resourceType,
    resourceId,
    fromVersion: fromVersion || null,
    toVersion: toVersion || null,
    reason,
    scope,
    attachments,
    author: author || '',
    state: 'draft',
    history: [
      { state: 'draft', actor: author || '', at: new Date().toISOString(), comment: '创建草稿' },
    ],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const updated = [...all, eco];
  // 控制条数
  if (updated.length > MAX_RECORDS) {
    updated.splice(0, updated.length - MAX_RECORDS);
  }
  safeWrite(updated);
  return eco;
};

/**
 * 状态流转
 */
export const transitionEco = (ecoId, nextState, actor, comment = '') => {
  const all = safeRead();
  const idx = all.findIndex(e => e.ecoId === ecoId);
  if (idx < 0) throw new Error(`ECO ${ecoId} 不存在`);
  const eco = all[idx];
  const allowedNext = ECO_STATES[eco.state]?.next || [];
  if (!allowedNext.includes(nextState)) {
    throw new Error(`不允许从 ${eco.state} 流转到 ${nextState} (允许: ${allowedNext.join(', ') || '无'})`);
  }
  eco.state = nextState;
  eco.updatedAt = new Date().toISOString();
  eco.history = eco.history || [];
  eco.history.push({ state: nextState, actor: actor || '', at: eco.updatedAt, comment });
  all[idx] = eco;
  safeWrite(all);
  return eco;
};

/**
 * 列出全部 ECO (按时间倒序)
 */
export const listEco = ({ resourceId = null, state = null } = {}) => {
  let all = safeRead();
  if (resourceId) all = all.filter(e => e.resourceId === resourceId);
  if (state) all = all.filter(e => e.state === state);
  return all.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
};

/**
 * 取单条
 */
export const getEco = (ecoId) => {
  return safeRead().find(e => e.ecoId === ecoId) || null;
};

/**
 * 删除 (仅草稿允许删除)
 */
export const removeEco = (ecoId) => {
  const all = safeRead();
  const found = all.find(e => e.ecoId === ecoId);
  if (!found) return false;
  if (found.state !== 'draft') {
    throw new Error(`仅草稿状态可删除, 当前状态 ${found.state}`);
  }
  return safeWrite(all.filter(e => e.ecoId !== ecoId));
};

/**
 * 统计
 */
export const ecoStats = () => {
  const all = safeRead();
  const byState = { draft: 0, submitted: 0, approved: 0, rejected: 0, effective: 0 };
  all.forEach(e => { if (byState[e.state] !== undefined) byState[e.state] += 1; });
  return {
    total: all.length,
    byState,
    pending: byState.submitted + byState.approved,
  };
};

const ecoStore = {
  ECO_STATES,
  generateEcoNumber,
  createEco,
  transitionEco,
  listEco,
  getEco,
  removeEco,
  ecoStats,
};

export default ecoStore;
