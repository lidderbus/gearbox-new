// src/services/auditLog.js
// P2-2: 资料库审计日志 — 记录浏览/下载/分享/水印事件,供合规审查与异常排查
//
// 存储: localStorage (上限 1000 条, FIFO 滚动)
// 后端对接: 提供 export() / flush() 接口,可对接公司 SIEM

const STORAGE_KEY = 'lib_audit_log';
const MAX_ENTRIES = 1000;

const safeRead = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

const safeWrite = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    return true;
  } catch (e) {
    // 若超额, 滚动丢弃最早一半
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data.slice(-Math.floor(MAX_ENTRIES / 2))));
      return true;
    } catch (e2) {
      return false;
    }
  }
};

/**
 * 审计事件类型
 */
export const AUDIT_EVENTS = {
  view: { label: '浏览', icon: 'bi-eye', color: 'info' },
  download: { label: '下载', icon: 'bi-download', color: 'success' },
  share: { label: '分享', icon: 'bi-share', color: 'warning' },
  watermark: { label: '加水印', icon: 'bi-droplet', color: 'primary' },
  search: { label: '搜索', icon: 'bi-search', color: 'secondary' },
  permission_deny: { label: '权限拒绝', icon: 'bi-shield-slash', color: 'danger' },
  selection: { label: '选型', icon: 'bi-crosshair', color: 'primary' },
  export: { label: '导出', icon: 'bi-box-arrow-up', color: 'success' },
  role_change: { label: '权限变更', icon: 'bi-people-fill', color: 'warning' },
  backup: { label: '备份', icon: 'bi-cloud-upload', color: 'info' },
};

/**
 * 记录审计事件
 *
 * @param {string} event — 事件类型 (AUDIT_EVENTS 的 key)
 * @param {Object} payload — 上下文数据
 * @param {string} [payload.resourceType]
 * @param {string} [payload.resourceId]
 * @param {string} [payload.userId]
 * @param {string} [payload.userRole]
 * @param {string} [payload.detail] — 详细说明
 */
export const logAudit = (event, payload = {}) => {
  if (!event || !AUDIT_EVENTS[event]) {
    console.warn(`[auditLog] 未知事件类型: ${event}`);
    return;
  }
  const entry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    event,
    timestamp: new Date().toISOString(),
    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent.slice(0, 80) : null,
    ...payload,
  };
  const all = safeRead();
  all.push(entry);
  // FIFO 滚动
  const trimmed = all.length > MAX_ENTRIES ? all.slice(-MAX_ENTRIES) : all;
  safeWrite(trimmed);
  return entry;
};

/**
 * 列出全部日志, 可按字段过滤
 *
 * @param {Object} [opts]
 * @param {string} [opts.event]
 * @param {string} [opts.resourceId]
 * @param {string} [opts.userId]
 * @param {string} [opts.from] — ISO 起始时间
 * @param {string} [opts.to]   — ISO 终止时间
 */
export const listAudit = (opts = {}) => {
  let all = safeRead();
  if (opts.event) all = all.filter(e => e.event === opts.event);
  if (opts.resourceId) all = all.filter(e => e.resourceId === opts.resourceId);
  if (opts.userId) all = all.filter(e => e.userId === opts.userId);
  if (opts.from) all = all.filter(e => e.timestamp >= opts.from);
  if (opts.to) all = all.filter(e => e.timestamp <= opts.to);
  return all.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
};

/**
 * 导出 CSV (供合规审查)
 */
export const exportAuditCSV = () => {
  const all = listAudit();
  const headers = ['timestamp', 'event', 'resourceType', 'resourceId', 'userId', 'userRole', 'detail'];
  const rows = all.map(e =>
    headers.map(h => {
      const v = e[h] || '';
      return /[,"\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : v;
    }).join(',')
  );
  return [headers.join(','), ...rows].join('\n');
};

/**
 * 清除日志 (慎用, 仅管理员)
 */
export const clearAudit = () => safeWrite([]);

/**
 * 统计
 */
export const auditStats = () => {
  const all = safeRead();
  const byEvent = {};
  Object.keys(AUDIT_EVENTS).forEach(k => { byEvent[k] = 0; });
  all.forEach(e => { if (byEvent[e.event] !== undefined) byEvent[e.event] += 1; });
  return {
    total: all.length,
    byEvent,
    capacity: MAX_ENTRIES,
    oldestAt: all[0]?.timestamp || null,
    latestAt: all[all.length - 1]?.timestamp || null,
  };
};

const auditLog = {
  AUDIT_EVENTS,
  logAudit,
  listAudit,
  exportAuditCSV,
  clearAudit,
  auditStats,
};

export default auditLog;
