// src/data/resourceMetaSchema.js
// P2-1: 资料库统一元数据 schema — EDM/PLM-lite 基础
//
// 目标: 为所有资料库子模块(说明书/图纸/模板/法规/案例/版本)提供统一字段字典
// 不强制迁移现有数据,提供"扩展 + 适配器"模式让各模块逐步升级

/**
 * 资源类型枚举
 */
export const RESOURCE_TYPES = {
  manual: { label: '说明书', icon: 'bi-book', folder: 'manuals' },
  drawing: { label: '外形图', icon: 'bi-image', folder: 'drawings' },
  dwg: { label: 'DWG 图', icon: 'bi-file-earmark-binary', folder: 'dwg' },
  template: { label: '协议模板', icon: 'bi-file-earmark-text', folder: 'templates' },
  standard: { label: '标准法规', icon: 'bi-bookmark-check', folder: 'standards' },
  case: { label: '配机案例', icon: 'bi-collection', folder: 'cases' },
  certificate: { label: '船级社证书', icon: 'bi-patch-check', folder: 'certificates' },
};

/**
 * 资源生命周期状态 (类似 PLM)
 */
export const LIFECYCLE_STATES = {
  draft: { label: '草稿', color: 'secondary' },
  review: { label: '审核中', color: 'warning' },
  effective: { label: '生效', color: 'success' },
  superseded: { label: '已废止', color: 'danger' },
  archived: { label: '已归档', color: 'dark' },
};

/**
 * 保密等级
 */
export const CONFIDENTIALITY_LEVELS = {
  public: { label: '公开', color: 'light' },
  internal: { label: '内部', color: 'info' },
  confidential: { label: '商密', color: 'warning' },
  secret: { label: '机密', color: 'danger' },
};

/**
 * 入级机构枚举 (Classification Society)
 * 与 P0-2 ClassificationCompliancePanel 中 IACS 列表对齐
 */
export const CLASSIFICATION_SOCIETIES = [
  'CCS', 'DNV', 'LR', 'ABS', 'BV', 'RINA', 'NK', 'KR', 'IRS', 'CRS', 'PRS',
];

/**
 * 适用船型
 */
export const VESSEL_APPLICATIONS = [
  '货船', '渔船', '拖轮', 'AHTS/工作船', '推船', '客船', '油船',
  '工程船', '军用', '内河', '远洋', '通用',
];

/**
 * 统一元数据字典 — 描述每个字段的语义/类型/示例
 * 适配器函数会把旧数据映射到这个 schema
 */
export const RESOURCE_META_FIELDS = {
  // ===== 标识 =====
  id: { type: 'string', required: true, desc: '资源唯一 ID', example: 'MNL-HC1000-2026' },
  resourceType: { type: 'enum', enum: Object.keys(RESOURCE_TYPES), required: true, desc: '资源类型' },

  // ===== 业务属性 =====
  title: { type: 'string', required: true, desc: '中文标题', example: 'HC1000 船用齿轮箱使用说明书' },
  titleEn: { type: 'string', desc: '英文标题(可选)' },
  model: { type: 'string', desc: '关联齿轮箱型号', example: 'HC1000' },
  modelSeries: { type: 'string', desc: '系列', example: 'HC' },
  torqueLevel: { type: 'number', desc: '扭矩等级 (kN·m)' },
  appliesTo: { type: 'array', items: 'string', desc: '适用范围 (船型列表)' },
  classifiedBy: { type: 'array', items: 'enum', enum: CLASSIFICATION_SOCIETIES, desc: '入级机构列表' },

  // ===== 版本与状态 =====
  version: { type: 'string', required: true, desc: '语义化版本号', example: '2.1' },
  revision: { type: 'string', desc: 'Rev 字母', example: 'B' },
  status: { type: 'enum', enum: Object.keys(LIFECYCLE_STATES), required: true, desc: '生命周期状态' },
  effectiveDate: { type: 'date', desc: '生效日期' },
  supersededBy: { type: 'string', desc: '若已废止,指向新版本资源 ID' },
  supersedes: { type: 'array', items: 'string', desc: '本资源所替代的旧版本 ID 列表' },

  // ===== 文件 =====
  filePath: { type: 'string', desc: '文件相对/绝对路径' },
  fileSize: { type: 'string', desc: '文件大小(人类可读)', example: '15.3 MB' },
  fileFormat: { type: 'string', desc: '格式', example: 'pdf' },
  pageCount: { type: 'number', desc: '页数(PDF/Word)' },

  // ===== 治理 =====
  owner: { type: 'string', desc: '所有人(部门/个人)' },
  classification: { type: 'enum', enum: Object.keys(CONFIDENTIALITY_LEVELS), default: 'internal', desc: '保密等级' },
  ecoIds: { type: 'array', items: 'string', desc: '关联的修订单 ID 列表' },

  // ===== 时间戳 =====
  createdAt: { type: 'datetime', desc: '创建时间(ISO)' },
  updatedAt: { type: 'datetime', desc: '最近更新时间(ISO)' },
  reviewedAt: { type: 'datetime', desc: '最近审核时间' },

  // ===== 自由扩展 =====
  notes: { type: 'string', desc: '备注' },
  tags: { type: 'array', items: 'string', desc: '标签' },
  customFields: { type: 'object', desc: '自定义键值对(供子模块扩展用)' },
};

/**
 * 资源对象适配器 — 旧数据 → 统一 schema
 * 让 ManualLibrary/StandardsLibrary 等老结构无需迁移就能用统一接口浏览
 *
 * @param {Object} legacy — 旧数据对象
 * @param {string} resourceType — 类型
 * @returns {Object} 符合 RESOURCE_META_FIELDS 的统一对象
 */
export const adaptToUnifiedSchema = (legacy, resourceType) => {
  if (!legacy) return null;
  return {
    id: legacy.id || legacy.path || `${resourceType}-${legacy.model || legacy.title || Date.now()}`,
    resourceType,
    title: legacy.title || legacy.name || legacy.id || '未命名',
    titleEn: legacy.titleEn || null,
    model: legacy.model || legacy.gearbox || null,
    modelSeries: legacy.series || legacy.category || null,
    torqueLevel: legacy.torqueLevel || null,
    appliesTo: legacy.appliesTo || legacy.shipType || (legacy.shipTypes ? legacy.shipTypes : []),
    classifiedBy: legacy.classifiedBy || legacy.classification || legacy.classificationApproved
      ? Array.isArray(legacy.classifiedBy) ? legacy.classifiedBy
      : Array.isArray(legacy.classification) ? legacy.classification
      : Array.isArray(legacy.classificationApproved) ? legacy.classificationApproved
      : (legacy.classification ? [legacy.classification] : [])
      : [],
    version: legacy.version || '1.0',
    revision: legacy.revision || null,
    status: legacy.status || 'effective',
    effectiveDate: legacy.effectiveDate || legacy.year || legacy.updateDate || null,
    supersededBy: legacy.supersededBy || null,
    supersedes: legacy.supersedes || [],
    filePath: legacy.path || legacy.filePath || null,
    fileSize: legacy.fileSize || null,
    fileFormat: legacy.type || legacy.fileFormat || (legacy.path?.match(/\.(\w+)$/) || [])[1] || null,
    pageCount: legacy.pageCount || null,
    owner: legacy.owner || null,
    classification_level: legacy.classification_level || 'internal',
    ecoIds: legacy.ecoIds || [],
    createdAt: legacy.createdAt || null,
    updatedAt: legacy.updatedAt || legacy.lastModified || null,
    reviewedAt: legacy.reviewedAt || null,
    notes: legacy.notes || legacy.desc || null,
    tags: legacy.tags || [],
    customFields: legacy.customFields || {},
    _legacy: legacy, // 保留原始对象供兼容
  };
};

/**
 * 校验对象是否符合 schema
 */
export const validateSchema = (obj) => {
  const errors = [];
  Object.entries(RESOURCE_META_FIELDS).forEach(([field, def]) => {
    if (def.required && (obj[field] === undefined || obj[field] === null || obj[field] === '')) {
      errors.push(`字段 ${field} 为必填`);
    }
    if (def.enum && obj[field] && !def.enum.includes(obj[field])) {
      errors.push(`字段 ${field} 值 '${obj[field]}' 不在枚举 [${def.enum.join(', ')}] 中`);
    }
  });
  return { valid: errors.length === 0, errors };
};

const resourceMetaSchema = {
  RESOURCE_TYPES,
  LIFECYCLE_STATES,
  CONFIDENTIALITY_LEVELS,
  CLASSIFICATION_SOCIETIES,
  VESSEL_APPLICATIONS,
  RESOURCE_META_FIELDS,
  adaptToUnifiedSchema,
  validateSchema,
};

export default resourceMetaSchema;
