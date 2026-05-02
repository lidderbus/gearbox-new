// 模块状态服务 — 为侧边栏子项提供「已用 / 未用 / 数据完整度」徽标信号
//
// Step 3a (MVP): 仅"已用/未用",依赖 localStorage `module_recent_visits`
// Step 3b: 接入数据完整度信号(各模块自报)

const VISITS_KEY = 'module_recent_visits';
const READY_THRESHOLD_MS = 7 * 24 * 60 * 60 * 1000; // 7 天

const safeReadVisits = () => {
  try {
    const raw = localStorage.getItem(VISITS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
};

const safeWriteVisits = (visits) => {
  try {
    localStorage.setItem(VISITS_KEY, JSON.stringify(visits));
  } catch (e) {
    // 静默失败 — 状态徽标缺失不应影响导航
  }
};

/**
 * 标记模块被访问。在 setActiveTab 时调用。
 * @param {string} key — 模块 key (与 SidebarNav NAV_GROUPS items[].key 一致)
 */
export const markVisited = (key) => {
  if (!key) return;
  const visits = safeReadVisits();
  visits[key] = new Date().toISOString();
  safeWriteVisits(visits);
};

/**
 * 获取模块上次访问时间戳。
 * @returns {string|null} ISO timestamp 或 null
 */
export const getLastVisit = (key) => {
  const visits = safeReadVisits();
  return visits[key] || null;
};

/**
 * 判断模块是否"已用"(近 7 天访问过)
 */
export const isReady = (key) => {
  const last = getLastVisit(key);
  if (!last) return false;
  const age = Date.now() - new Date(last).getTime();
  return age >= 0 && age <= READY_THRESHOLD_MS;
};

/**
 * 数据完整度信号注册表。
 * 每个 key 返回 { count, total, label } 或 null(无信号)。
 *
 * 取值时用 try/catch 包裹,任一模块异常不影响其它徽标渲染。
 */
const COMPLETENESS_REGISTRY = {
  // 产品中心 / 数据查询 — 价格覆盖率(696 型号 / 292 命中,2026-04-24 经审计)
  'product-center': () => readPriceCoverage(),
  'query': () => readPriceCoverage(),

  // 数据导入 — 最近导入次数
  'data-import': () => {
    const raw = localStorage.getItem('importHistory');
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return arr.length > 0 ? { count: arr.length, total: 20, label: `${arr.length} 次` } : null;
  },

  // 选型历史 — 记录数
  'history': () => {
    const raw = localStorage.getItem('gearbox_selection_history');
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return arr.length > 0 ? { count: arr.length, total: arr.length, label: `${arr.length}` } : null;
  },

  // 报价单 — QuoteDB / localStorage 双源
  'quotation': () => {
    const raw = localStorage.getItem('gearbox_quotations');
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return arr.length > 0 ? { count: arr.length, total: arr.length, label: `${arr.length}` } : null;
  },

  // 销售合同 — cm_contracts
  'contract': () => {
    const raw = localStorage.getItem('cm_contracts');
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return arr.length > 0 ? { count: arr.length, total: arr.length, label: `${arr.length}` } : null;
  },

  // 操作审计日志 — auditStats 总数
  'operation-audit': () => {
    const raw = localStorage.getItem('lib_audit_log');
    if (!raw) return null;
    const arr = JSON.parse(raw);
    return arr.length > 0 ? { count: arr.length, total: 1000, label: `${arr.length}` } : null;
  },

  // ---- 资料库 8 子项 (数据基底已盘点,以静态条目数为信号) ----
  // 外形图库: outlineDrawings + dwgDrawings 合计 ~200+
  'drawings': () => ({ count: 200, total: 300, label: '200+' }),
  // 说明书库: gearboxManuals 35 条
  'manuals': () => ({ count: 35, total: 50, label: '35' }),
  // 协议模板库: technicalAgreementTemplates 50 条
  'templates': () => ({ count: 50, total: 60, label: '50' }),
  // 配机案例: 99 (Cummins) + 554 (HCM) = 653 条
  'engine-cases': () => ({ count: 653, total: 800, label: '653' }),
  // 安装指导: INSTALL_STEPS 常量 8 大步骤
  'installation-guide': () => ({ count: 8, total: 8, label: '8' }),
  // 标准法规: STANDARDS_DATA 常量 51 条
  'standards-library': () => ({ count: 51, total: 60, label: '51' }),
  // 参数对照: 696 型号
  'tech-comparison': () => ({ count: 696, total: 696, label: '696' }),
  // 资料版本: localStorage version_registry
  'resource-versions': () => {
    const raw = localStorage.getItem('version_registry');
    if (!raw) return null;
    try {
      const obj = JSON.parse(raw);
      const n = Array.isArray(obj) ? obj.length : Object.keys(obj || {}).length;
      return n > 0 ? { count: n, total: n, label: `${n}` } : null;
    } catch (e) { return null; }
  },
};

const readPriceCoverage = () => {
  // 服务静态:696 型号中已知 292 有价、404 缺价(经 audit-price-coverage.js 核查)
  // 真实命中率需要运行时遍历 gearboxPriceData;为避免循环依赖与启动开销,使用静态值
  const total = 696;
  const covered = 292;
  return { count: covered, total, label: `${covered}/${total}` };
};

/**
 * 获取模块完整度信号(Step 3b).
 * @returns {{count, total, label}|null}
 */
export const getDataCompleteness = (key) => {
  const fn = COMPLETENESS_REGISTRY[key];
  if (!fn) return null;
  try {
    return fn();
  } catch (e) {
    return null;
  }
};

/**
 * 综合返回模块状态徽标描述(SidebarNav 直接消费)
 * @returns {{ kind: 'ready'|'data'|null, color, label, tooltip }}
 */
export const getModuleStatus = (key) => {
  // 优先级 1:数据完整度(信息量更大)
  const data = getDataCompleteness(key);
  if (data && data.count > 0) {
    const ratio = data.total > 0 ? data.count / data.total : 1;
    const color = ratio < 0.6 ? 'warning' : 'info';
    return {
      kind: 'data',
      color,
      label: data.label,
      tooltip: `数据量:${data.label}`,
    };
  }
  // 优先级 2:已用
  if (isReady(key)) {
    const last = getLastVisit(key);
    const days = Math.max(0, Math.round((Date.now() - new Date(last).getTime()) / (24 * 60 * 60 * 1000)));
    return {
      kind: 'ready',
      color: 'success',
      label: '·',
      tooltip: days === 0 ? '今日使用' : `${days} 天前使用`,
    };
  }
  return null;
};

const moduleStatus = {
  markVisited,
  getLastVisit,
  isReady,
  getDataCompleteness,
  getModuleStatus,
};

export default moduleStatus;
