// src/config/shaftArrangementConfig.js
// 轴布置配置 — GW子系列映射与轴布置类型定义

/**
 * GW子系列 → 轴布置特征映射
 * 从型号名前缀推导子系列和轴布置方式
 */
export const SUB_SERIES_MAP = {
  GWC: {
    transmissionType: '2-stage',
    rotationRelation: 'same',
    shaftArrangement: 'concentric',
    label: 'GWC 同心布置'
  },
  GWS: {
    transmissionType: '1-stage',
    rotationRelation: 'reverse',
    shaftArrangement: 'horizontal-offset',
    label: 'GWS 垂直异中心'
  },
  GWD: {
    transmissionType: '1-stage',
    rotationRelation: 'reverse',
    shaftArrangement: 'vertical-down',
    label: 'GWD 角向异中心'
  },
  GWH: {
    transmissionType: '1-stage',
    rotationRelation: 'reverse',
    shaftArrangement: 'horizontal-offset',
    label: 'GWH 水平异中心'
  },
  GWK: {
    transmissionType: '1-stage',
    rotationRelation: 'reverse',
    shaftArrangement: 'k-shape',
    label: 'GWK 垂直异中心'
  },
  GWL: {
    transmissionType: '2-stage',
    rotationRelation: 'same',
    shaftArrangement: 'l-shape',
    label: 'GWL L型/直角'
  },
  // 非GW系列 — 固定布置方式
  HC: {
    transmissionType: '1-stage',
    rotationRelation: 'reverse',
    shaftArrangement: 'horizontal-offset',
    label: 'HC 标准型'
  },
  HCM: {
    transmissionType: '1-stage',
    rotationRelation: 'reverse',
    shaftArrangement: 'horizontal-offset',
    label: 'HCM 中型'
  },
  DT: {
    transmissionType: '1-stage',
    rotationRelation: 'reverse',
    shaftArrangement: 'horizontal-offset',
    label: 'DT 大型'
  },
  HCQ: {
    transmissionType: '1-stage',
    rotationRelation: 'reverse',
    shaftArrangement: 'horizontal-offset',
    label: 'HCQ 轻量化'
  },
  GC: {
    transmissionType: '1-stage',
    rotationRelation: 'reverse',
    shaftArrangement: 'horizontal-offset',
    label: 'GC 特种'
  }
};

/**
 * 从型号名推导子系列和轴布置特征
 * 例如: "GWC3871" → { subSeries: 'GWC', ...SUB_SERIES_MAP.GWC }
 *       "HC138" → { subSeries: 'HC', ...SUB_SERIES_MAP.HC }
 *
 * @param {string} model - 齿轮箱型号名
 * @returns {{ subSeries: string, transmissionType: string, rotationRelation: string, shaftArrangement: string, label: string } | null}
 */
export function deriveShaftArrangement(model) {
  if (!model || typeof model !== 'string') return null;

  const upper = model.toUpperCase().replace(/[-\s]/g, '');

  // 优先匹配较长的前缀（GWC 在 GW 之前）
  const prefixes = ['GWC', 'GWS', 'GWD', 'GWH', 'GWK', 'GWL', 'HCM', 'HCQ', 'HC', 'GC', 'DT'];

  for (const prefix of prefixes) {
    if (upper.startsWith(prefix)) {
      const info = SUB_SERIES_MAP[prefix];
      if (info) {
        return { subSeries: prefix, ...info };
      }
    }
  }

  // 处理GW前缀但没有具体子系列字母的情况
  if (upper.startsWith('GW')) {
    return {
      subSeries: 'GW',
      transmissionType: '2-stage',
      rotationRelation: 'same',
      shaftArrangement: 'unknown',
      label: 'GW 未知子系列'
    };
  }

  return null;
}

/**
 * 轴对齐方式选项 (第一层选择)
 */
export const AXIS_ALIGNMENT_OPTIONS = [
  { value: 'any', label: '自动选择', description: '不限制轴布置方式，系统自动匹配最佳型号' },
  { value: 'concentric', label: '同心布置', description: '输入轴与输出轴同轴线，适用于GWC系列' },
  { value: 'eccentric', label: '异心布置', description: '输入轴与输出轴不同轴线，需选择偏置方向' }
];

/**
 * 偏置方向选项 (第二层选择，异心时展开)
 */
export const OFFSET_DIRECTION_OPTIONS = [
  { value: 'any', label: '不限方向', description: '自动匹配所有异心子系列', subSeries: [] },
  { value: 'horizontal-offset', label: '水平偏置', description: '输入输出轴水平方向偏置', subSeries: ['GWS', 'GWH'] },
  { value: 'vertical-down', label: '垂直向下', description: '输出轴在输入轴正下方', subSeries: ['GWD'] },
  { value: 'k-shape', label: 'K型布置', description: 'K型空间布置结构', subSeries: ['GWK'] },
  { value: 'l-shape', label: 'L型/直角', description: '输入输出轴成直角或L型布置', subSeries: ['GWL'] }
];

/**
 * 综合轴布置选项（用于UI完整展示）
 */
export const SHAFT_ARRANGEMENT_OPTIONS = [
  { value: 'any', label: '自动选择', group: 'auto' },
  { value: 'concentric', label: '同心布置 (GWC)', group: 'concentric' },
  { value: 'horizontal-offset', label: '水平偏置 (GWS/GWH)', group: 'eccentric' },
  { value: 'vertical-down', label: '垂直向下 (GWD)', group: 'eccentric' },
  { value: 'k-shape', label: 'K型布置 (GWK)', group: 'eccentric' },
  { value: 'l-shape', label: 'L型/直角 (GWL)', group: 'eccentric' }
];

/**
 * 检查齿轮箱是否匹配指定的轴布置过滤条件
 *
 * @param {string} model - 齿轮箱型号
 * @param {{ axisAlignment: string, offsetDirection: string }} filter - 过滤条件
 * @returns {{ matched: boolean, reason?: string }}
 */
export function matchesShaftArrangement(model, filter) {
  if (!filter || filter.axisAlignment === 'any') {
    return { matched: true };
  }

  const info = deriveShaftArrangement(model);
  if (!info) {
    // 无法推导的型号不过滤
    return { matched: true };
  }

  // 非GW系列不按轴布置过滤（固定为水平偏置）
  if (!info.subSeries.startsWith('GW')) {
    return { matched: true };
  }

  // 同心布置筛选
  if (filter.axisAlignment === 'concentric') {
    if (info.shaftArrangement === 'concentric') {
      return { matched: true };
    }
    return { matched: false, reason: `${info.label} 不是同心布置` };
  }

  // 异心布置筛选
  if (filter.axisAlignment === 'eccentric') {
    // 同心的不匹配异心
    if (info.shaftArrangement === 'concentric') {
      return { matched: false, reason: `${info.label} 是同心布置，不是异心布置` };
    }

    // 检查具体偏置方向
    if (filter.offsetDirection && filter.offsetDirection !== 'any') {
      if (info.shaftArrangement === filter.offsetDirection) {
        return { matched: true };
      }
      return { matched: false, reason: `${info.label} 不匹配偏置方向 ${filter.offsetDirection}` };
    }

    // 异心 + 不限方向
    return { matched: true };
  }

  return { matched: true };
}
