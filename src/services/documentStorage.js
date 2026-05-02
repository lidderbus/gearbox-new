// src/services/documentStorage.js
// 文档持久化存储服务 (localStorage)

const STORAGE_KEYS = {
  INQUIRIES: 'doc_inquiries',
  QUOTATIONS: 'doc_quotations',
  AGREEMENTS: 'doc_agreements',
  CONTRACTS: 'doc_contracts',
  RELATIONS: 'doc_relations',
};

const MAX_ITEMS = 100; // 每类最多存储条数

/**
 * 安全读取localStorage
 */
const safeRead = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.warn(`读取 ${key} 失败:`, e);
    return [];
  }
};

/**
 * 安全写入localStorage
 */
const safeWrite = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (e) {
    console.warn(`写入 ${key} 失败:`, e);
    // 尝试清理旧数据
    if (e.name === 'QuotaExceededError') {
      try {
        const items = safeRead(key);
        if (items.length > 20) {
          localStorage.setItem(key, JSON.stringify(items.slice(-20)));
          localStorage.setItem(key, JSON.stringify(data));
          return true;
        }
      } catch (e2) {
        console.error('存储空间不足:', e2);
      }
    }
    return false;
  }
};

/**
 * 创建文档存储操作集
 */
const createDocStore = (storageKey) => ({
  /**
   * 获取所有文档
   * @returns {Array}
   */
  getAll() {
    return safeRead(storageKey);
  },

  /**
   * 按ID获取文档
   * @param {string} id
   * @returns {Object|null}
   */
  getById(id) {
    const items = safeRead(storageKey);
    return items.find(item => item.id === id) || null;
  },

  /**
   * 保存文档（新建或更新）
   * @param {Object} doc - 必须有 id 字段
   * @returns {boolean}
   */
  save(doc) {
    if (!doc.id) {
      doc.id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    const items = safeRead(storageKey);
    const existingIdx = items.findIndex(item => item.id === doc.id);

    if (existingIdx >= 0) {
      items[existingIdx] = { ...items[existingIdx], ...doc, updatedAt: new Date().toISOString() };
    } else {
      doc.createdAt = doc.createdAt || new Date().toISOString();
      doc.updatedAt = new Date().toISOString();
      items.push(doc);
    }

    // 限制条数
    const trimmed = items.length > MAX_ITEMS ? items.slice(-MAX_ITEMS) : items;
    return safeWrite(storageKey, trimmed);
  },

  /**
   * 删除文档
   * @param {string} id
   * @returns {boolean}
   */
  remove(id) {
    const items = safeRead(storageKey);
    const filtered = items.filter(item => item.id !== id);
    return safeWrite(storageKey, filtered);
  },

  /**
   * 获取最近N条文档
   * @param {number} limit
   * @returns {Array}
   */
  getRecent(limit = 10) {
    const items = safeRead(storageKey);
    return items.slice(-limit).reverse();
  },

  /**
   * 按项目ID过滤文档 (P0-1: ProjectID 主线)
   * @param {string} projectId
   * @returns {Array}
   */
  getByProjectId(projectId) {
    if (!projectId) return [];
    return safeRead(storageKey).filter(item => item.projectId === projectId);
  },

  /**
   * 获取文档总数
   * @returns {number}
   */
  count() {
    return safeRead(storageKey).length;
  },

  /**
   * 清空所有文档
   * @returns {boolean}
   */
  clear() {
    return safeWrite(storageKey, []);
  },
});

// 各文档类型的存储操作
export const inquiryStore = createDocStore(STORAGE_KEYS.INQUIRIES);
export const quotationStore = createDocStore(STORAGE_KEYS.QUOTATIONS);
export const agreementStore = createDocStore(STORAGE_KEYS.AGREEMENTS);
export const contractStore = createDocStore(STORAGE_KEYS.CONTRACTS);

/**
 * 文档关联管理
 */
export const relationStore = {
  getAll() {
    return safeRead(STORAGE_KEYS.RELATIONS);
  },

  /**
   * 添加文档关联
   * @param {string} sourceId - 源文档ID
   * @param {string} sourceType - 源文档类型
   * @param {string} targetId - 目标文档ID
   * @param {string} targetType - 目标文档类型
   * @param {'derived_from'|'references'|'supersedes'} relationType
   */
  addRelation(sourceId, sourceType, targetId, targetType, relationType) {
    const relations = safeRead(STORAGE_KEYS.RELATIONS);
    // 避免重复
    const exists = relations.some(r =>
      r.sourceId === sourceId && r.targetId === targetId && r.relationType === relationType
    );
    if (exists) return true;

    relations.push({
      sourceId, sourceType, targetId, targetType, relationType,
      createdAt: new Date().toISOString(),
    });
    return safeWrite(STORAGE_KEYS.RELATIONS, relations);
  },

  /**
   * 查找某文档的所有关联文档
   * @param {string} docId
   * @returns {Array}
   */
  findRelations(docId) {
    const relations = safeRead(STORAGE_KEYS.RELATIONS);
    return relations.filter(r => r.sourceId === docId || r.targetId === docId);
  },
};

/**
 * 列出所有已知项目 (P0-1)
 * 聚合 4 类文档,以 projectId 为主键,projectName 为后备
 * @returns {Array<{projectId: string, projectName: string, total: number, latestDate: string, counts: {inquiry,quotation,agreement,contract}}>}
 */
export const listAllProjects = () => {
  const stores = [
    { key: 'inquiry', store: inquiryStore },
    { key: 'quotation', store: quotationStore },
    { key: 'agreement', store: agreementStore },
    { key: 'contract', store: contractStore },
  ];
  const map = new Map();
  stores.forEach(({ key, store }) => {
    store.getAll().forEach(doc => {
      const projectId = doc.projectId || `legacy:${doc.projectName || '未分配'}`;
      if (!map.has(projectId)) {
        map.set(projectId, {
          projectId,
          projectName: doc.projectName || (projectId.startsWith('legacy:') ? projectId.replace('legacy:', '') : projectId),
          total: 0,
          latestDate: '',
          counts: { inquiry: 0, quotation: 0, agreement: 0, contract: 0 },
        });
      }
      const entry = map.get(projectId);
      entry.counts[key] += 1;
      entry.total += 1;
      const docDate = doc.updatedAt || doc.createdAt || '';
      if (docDate > entry.latestDate) entry.latestDate = docDate;
      if (doc.projectName && !entry.projectName) entry.projectName = doc.projectName;
    });
  });
  return Array.from(map.values()).sort((a, b) => (b.latestDate || '').localeCompare(a.latestDate || ''));
};

/**
 * 获取一个项目下所有文档 (P0-1)
 * @param {string} projectId
 * @returns {{inquiry:Array, quotation:Array, agreement:Array, contract:Array}}
 */
export const getProjectDocuments = (projectId) => ({
  inquiry: inquiryStore.getByProjectId(projectId),
  quotation: quotationStore.getByProjectId(projectId),
  agreement: agreementStore.getByProjectId(projectId),
  contract: contractStore.getByProjectId(projectId),
});

/**
 * 从询单编号派生项目编号: TI-2026-0001 → PRJ-2026-0001
 * @param {string} inquiryId
 * @returns {string|null}
 */
export const deriveProjectIdFromInquiry = (inquiryId) => {
  if (!inquiryId) return null;
  if (inquiryId.startsWith('PRJ-')) return inquiryId;
  return inquiryId.replace(/^TI-/, 'PRJ-');
};

/**
 * 获取所有文档的统计信息
 */
export const getDocumentStats = () => ({
  inquiries: inquiryStore.count(),
  quotations: quotationStore.count(),
  agreements: agreementStore.count(),
  contracts: contractStore.count(),
  recentInquiry: inquiryStore.getRecent(1)[0] || null,
  recentQuotation: quotationStore.getRecent(1)[0] || null,
  recentAgreement: agreementStore.getRecent(1)[0] || null,
  recentContract: contractStore.getRecent(1)[0] || null,
});

/**
 * 导出所有文档为JSON备份
 */
export const exportAllDocuments = () => {
  return {
    version: '1.0',
    exportedAt: new Date().toISOString(),
    inquiries: inquiryStore.getAll(),
    quotations: quotationStore.getAll(),
    agreements: agreementStore.getAll(),
    contracts: contractStore.getAll(),
    relations: relationStore.getAll(),
  };
};

/**
 * 从备份恢复文档
 */
export const importAllDocuments = (backup) => {
  if (!backup || backup.version !== '1.0') {
    throw new Error('无效的备份文件格式');
  }
  if (backup.inquiries) safeWrite(STORAGE_KEYS.INQUIRIES, backup.inquiries);
  if (backup.quotations) safeWrite(STORAGE_KEYS.QUOTATIONS, backup.quotations);
  if (backup.agreements) safeWrite(STORAGE_KEYS.AGREEMENTS, backup.agreements);
  if (backup.contracts) safeWrite(STORAGE_KEYS.CONTRACTS, backup.contracts);
  if (backup.relations) safeWrite(STORAGE_KEYS.RELATIONS, backup.relations);
  return true;
};

export default {
  inquiryStore,
  quotationStore,
  agreementStore,
  contractStore,
  relationStore,
  getDocumentStats,
  exportAllDocuments,
  importAllDocuments,
  listAllProjects,
  getProjectDocuments,
  deriveProjectIdFromInquiry,
};
