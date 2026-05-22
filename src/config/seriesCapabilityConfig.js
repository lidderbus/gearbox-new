// src/config/seriesCapabilityConfig.js
// 系列特性元数据注册表 — 用于选型过滤和评分
// 数据来源: SelectionGuidelines.js:seriesInfo + 杭齿厂选型手册2025版

/**
 * 23个系列的结构化能力标志
 *
 * hasClutch      — 是否有液压离合器（湿式多片摩擦离合器）
 * hasReverse     — 是否有倒顺车（正倒车换向）功能
 * isConcentric   — 输入输出是否同中心（同轴线）
 * isCPPOnly      — 是否专用于CPP（可调螺距桨），不适用于FPP
 * isHighThrust   — 是否大推力设计
 * isElectricDrive— 是否电力推进专用（无离合器直接传动）
 * isDualSpeed    — 是否双速齿轮箱
 * isDualEngine   — 是否双机并车齿轮箱
 */
export const SERIES_CAPABILITIES = {
  GWC:    { hasClutch: true,  hasReverse: true,  isConcentric: true,  isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  GWL:    { hasClutch: true,  hasReverse: false, isConcentric: true,  isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  GWS:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  GWD:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  GWH:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  GWK:    { hasClutch: true,  hasReverse: false, isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  HC:     { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  HCM:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  HCD:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  HCQ:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  HCA:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  HCV:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  HCX:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  GC:     { hasClutch: true,  hasReverse: false, isConcentric: true,  isCPPOnly: true,  isHighThrust: false, isElectricDrive: false },
  DT:     { hasClutch: false, hasReverse: false, isConcentric: false, isCPPOnly: false, isHighThrust: true,  isElectricDrive: true  },
  HCS:    { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false, isDualSpeed: true },
  HCDS:   { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false, isDualSpeed: true },
  HCTS:   { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false, isDualSpeed: true },
  SGWC:   { hasClutch: true,  hasReverse: true,  isConcentric: true,  isCPPOnly: false, isHighThrust: false, isElectricDrive: false, isDualSpeed: true },
  SGWS:   { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false, isDualSpeed: true },
  SGWH:   { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false, isDualSpeed: true },
  SGWD:   { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false, isDualSpeed: true },
  '2GWH': { hasClutch: true,  hasReverse: false, isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false, isDualEngine: true },
  HCL:    { hasClutch: true,  hasReverse: false, isConcentric: true,  isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
  MV:     { hasClutch: true,  hasReverse: true,  isConcentric: false, isCPPOnly: false, isHighThrust: false, isElectricDrive: false },
};

// 前缀匹配顺序（长前缀优先）
const SERIES_PREFIXES = [
  '2GWH', 'SGWS', 'SGWH', 'SGWD', 'SGWC',
  'HCTS', 'HCDS', 'HCS',
  'GWC', 'GWL', 'GWS', 'GWD', 'GWH', 'GWK',
  'HCM', 'HCL', 'HCV', 'HCD', 'HCQ', 'HCA', 'HCX', 'HC',
  'GC', 'DT', 'MV'
];

/**
 * 从型号名推导系列前缀并返回能力标志
 * @param {string} model - 齿轮箱型号名（如 "GWC3871", "HC138", "DT900"）
 * @returns {{ prefix: string, ...capabilities } | null}
 */
export function getSeriesCapability(model) {
  if (!model || typeof model !== 'string') return null;
  const upper = model.toUpperCase().replace(/[-\s]/g, '');

  for (const prefix of SERIES_PREFIXES) {
    if (upper.startsWith(prefix) && SERIES_CAPABILITIES[prefix]) {
      return { prefix, ...SERIES_CAPABILITIES[prefix] };
    }
  }
  return null;
}

/**
 * 检查型号是否满足系列需求
 *
 * @param {string} model - 齿轮箱型号名
 * @param {Object} requirements - 系列需求
 * @param {boolean|null} [requirements.needsClutch]      - 是否需要离合器
 * @param {boolean|null} [requirements.needsReverse]      - 是否需要倒顺车
 * @param {boolean|null} [requirements.preferConcentric]  - 是否偏好同中心
 * @param {boolean}      [requirements.needsHighThrust]   - 是否需要大推力
 * @param {'FPP'|'CPP'|null} [requirements.propellerType] - 螺旋桨类型
 * @returns {{ matched: boolean, reasons: string[], score: number }}
 */
export function matchesSeriesRequirements(model, requirements) {
  if (!requirements || Object.keys(requirements).length === 0) {
    return { matched: true, reasons: [], score: 5 };
  }

  const cap = getSeriesCapability(model);
  if (!cap) {
    // 未知系列不过滤，给中性分
    return { matched: true, reasons: [], score: 5 };
  }

  const reasons = [];
  let score = 0;
  const maxScore = 10;

  // --- 硬过滤 ---

  // 离合器需求
  if (requirements.needsClutch === true && !cap.hasClutch) {
    return {
      matched: false,
      reasons: [`${cap.prefix}系列无离合器（电推专用直接传动）`],
      score: 0
    };
  }
  if (requirements.needsClutch === false && cap.hasClutch) {
    return {
      matched: false,
      reasons: [`${cap.prefix}系列带离合器，不符合无离合器要求`],
      score: 0
    };
  }

  // 倒顺车需求
  if (requirements.needsReverse === true && !cap.hasReverse) {
    return {
      matched: false,
      reasons: [`${cap.prefix}系列无倒顺车功能`],
      score: 0
    };
  }

  // CPP/FPP 螺旋桨类型
  if (requirements.propellerType === 'FPP' && cap.isCPPOnly) {
    return {
      matched: false,
      reasons: [`${cap.prefix}系列专用于CPP变距桨，不适用于FPP固定螺距桨`],
      score: 0
    };
  }

  // 原动机类型 → 电推/非电推匹配 (硬过滤)
  // diesel: 柴油机原动机, 排除 DT 等电推专用系列
  // electric: 电动机原动机, 仅允许电推专用系列 (DT)
  // none / undefined: 不过滤
  if (requirements.engineType === 'diesel' && cap.isElectricDrive) {
    return {
      matched: false,
      reasons: [`${cap.prefix}系列电推专用，不适配柴油机原动机`],
      score: 0
    };
  }
  if (requirements.engineType === 'electric' && !cap.isElectricDrive) {
    return {
      matched: false,
      reasons: [`${cap.prefix}系列非电推（有离合/有倒顺），不适配电动机原动机`],
      score: 0
    };
  }

  // --- 软评分 ---

  // 离合匹配评分
  if (requirements.needsClutch === true && cap.hasClutch) {
    score += 3;
    reasons.push('离合匹配');
  } else if (requirements.needsClutch == null) {
    score += 1.5; // 无要求给基础分
  }

  // 倒顺匹配评分
  if (requirements.needsReverse === true && cap.hasReverse) {
    score += 3;
    reasons.push('倒顺匹配');
  } else if (requirements.needsReverse === false && !cap.hasReverse) {
    score += 2;
    reasons.push('无倒顺（适合CPP）');
  } else if (requirements.needsReverse === false && cap.hasReverse) {
    // 不需要倒顺但系列有倒顺 → 不排除，但不加分
    score += 0.5;
  } else if (requirements.needsReverse == null) {
    score += 1.5;
  }

  // 同中心偏好评分
  if (requirements.preferConcentric === true) {
    if (cap.isConcentric) {
      score += 2;
      reasons.push('同中心布置');
    }
    // 不匹配时不加分（但不排除，轴布置过滤已处理硬排除）
  } else {
    score += 1;
  }

  // 高推力需求评分
  if (requirements.needsHighThrust) {
    if (cap.isHighThrust) {
      score += 2;
      reasons.push('大推力设计');
    }
  } else {
    score += 1;
  }

  // CPP匹配加分
  if (requirements.propellerType === 'CPP') {
    if (cap.isCPPOnly) {
      score += 2;
      reasons.push('CPP专用');
    } else if (!cap.hasReverse) {
      score += 1;
      reasons.push('无倒顺（适合CPP）');
    }
  }

  // 归一化到0-10
  score = Math.min(maxScore, Math.round(score * 10) / 10);

  return { matched: true, reasons, score };
}
