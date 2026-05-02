// src/services/documentVersionStore.js
// P1-4: 文档版本管理 — 跨四类文档(询单/报价/协议/合同)的统一版本快照存储

const STORAGE_KEY = 'doc_versions';
const MAX_VERSIONS_PER_DOC = 20;

const safeRead = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.warn('读取文档版本失败:', e);
    return [];
  }
};

const safeWrite = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn('写入文档版本失败:', e);
    return false;
  }
};

/**
 * 给某个文档保存新版本快照
 * @param {Object} params
 * @param {string} params.type  — inquiry|quotation|agreement|contract
 * @param {string} params.docId — 文档主键 (如 TI-2026-0001)
 * @param {Object} params.snapshot — 文档完整 JSON 快照
 * @param {string} [params.comment] — 修订说明 (ECO 简化版)
 * @param {string} [params.author]  — 修订人
 * @returns {{version: number, versionId: string, savedAt: string}}
 */
export const saveVersion = ({ type, docId, snapshot, comment = '', author = '' }) => {
  if (!type || !docId || !snapshot) {
    throw new Error('saveVersion 需要 type/docId/snapshot 三个参数');
  }
  const all = safeRead();
  const docVersions = all.filter(v => v.docId === docId && v.type === type);
  const nextVer = docVersions.length + 1;
  const versionId = `${docId}_v${nextVer}_${Date.now().toString(36)}`;
  const entry = {
    versionId,
    type,
    docId,
    version: nextVer,
    snapshot: JSON.parse(JSON.stringify(snapshot)), // deep clone
    comment: comment || `第 ${nextVer} 版`,
    author,
    savedAt: new Date().toISOString(),
  };

  // 限制条数 (单个文档最多保留 MAX_VERSIONS_PER_DOC 版)
  let updated = [...all, entry];
  const overflow = updated.filter(v => v.docId === docId && v.type === type);
  if (overflow.length > MAX_VERSIONS_PER_DOC) {
    const keepIds = new Set(overflow.slice(-MAX_VERSIONS_PER_DOC).map(v => v.versionId));
    updated = updated.filter(v => v.docId !== docId || v.type !== type || keepIds.has(v.versionId));
  }
  safeWrite(updated);
  return { version: nextVer, versionId, savedAt: entry.savedAt };
};

/**
 * 列出某个文档的所有版本(按时间倒序)
 */
export const listVersions = (type, docId) => {
  if (!type || !docId) return [];
  return safeRead()
    .filter(v => v.type === type && v.docId === docId)
    .sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt));
};

/**
 * 取某个具体版本
 */
export const getVersion = (versionId) => {
  return safeRead().find(v => v.versionId === versionId) || null;
};

/**
 * 删除某个版本
 */
export const removeVersion = (versionId) => {
  const all = safeRead();
  return safeWrite(all.filter(v => v.versionId !== versionId));
};

/**
 * 全局统计
 */
export const versionStats = () => {
  const all = safeRead();
  const byDoc = {};
  all.forEach(v => {
    const key = `${v.type}:${v.docId}`;
    byDoc[key] = (byDoc[key] || 0) + 1;
  });
  return {
    totalVersions: all.length,
    docsWithVersions: Object.keys(byDoc).length,
    averageVersionsPerDoc: Object.keys(byDoc).length > 0
      ? (all.length / Object.keys(byDoc).length).toFixed(1)
      : 0,
  };
};

/**
 * 简单字段差异 (返回前后值不同的字段名)
 */
export const diffSnapshots = (prev, curr) => {
  if (!prev || !curr) return [];
  const fields = new Set([...Object.keys(prev), ...Object.keys(curr)]);
  const changes = [];
  fields.forEach(f => {
    if (f === 'updatedAt' || f === 'createdAt') return; // 时间戳总是变, 忽略
    const a = prev[f];
    const b = curr[f];
    if (JSON.stringify(a) !== JSON.stringify(b)) {
      changes.push({ field: f, prev: a, curr: b });
    }
  });
  return changes;
};

const documentVersionStore = {
  saveVersion,
  listVersions,
  getVersion,
  removeVersion,
  versionStats,
  diffSnapshots,
};

export default documentVersionStore;
