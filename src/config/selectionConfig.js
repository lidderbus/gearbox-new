// src/config/selectionConfig.js
/**
 * 齿轮箱选型算法配置模块
 * 提供可配置的评分权重、应用场景容差、预设配置
 */

// ========== 默认评分权重 ==========
export const DEFAULT_SCORING_WEIGHTS = {
  costEffectiveness: 45,  // 性价比权重
  ratioMatch: 25,         // 速比匹配权重
  capacityMargin: 15,     // 能力余量权重
  thrustSatisfy: 10,      // 推力满足权重
  specialPackage: 5       // 特价打包权重
};

// ========== 预设配置 ==========
export const PRESET_CONFIGURATIONS = {
  balanced: {
    id: 'balanced',
    label: '均衡模式',
    description: '综合考虑各项指标，适合大多数场景',
    weights: { ...DEFAULT_SCORING_WEIGHTS }
  },
  costPriority: {
    id: 'costPriority',
    label: '性价比优先',
    description: '优先考虑价格因素，适合预算敏感项目',
    weights: {
      costEffectiveness: 55,
      ratioMatch: 20,
      capacityMargin: 12,
      thrustSatisfy: 8,
      specialPackage: 5
    }
  },
  precisionPriority: {
    id: 'precisionPriority',
    label: '精度优先',
    description: '优先考虑速比精确匹配，适合高精度应用',
    weights: {
      costEffectiveness: 25,
      ratioMatch: 35,
      capacityMargin: 25,
      thrustSatisfy: 10,
      specialPackage: 5
    }
  },
  performancePriority: {
    id: 'performancePriority',
    label: '性能优先',
    description: '优先考虑能力余量和推力，适合重载工况',
    weights: {
      costEffectiveness: 20,
      ratioMatch: 25,
      capacityMargin: 30,
      thrustSatisfy: 20,
      specialPackage: 5
    }
  }
};

// ========== 应用场景容差配置 ==========
export const APPLICATION_TOLERANCES = {
  propulsion: {
    id: 'propulsion',
    label: '主推进',
    description: '船舶主推进系统，标准容差',
    tolerances: {
      maxRatioDiffPercent: 10,
      maxCapacityMargin: 50,
      minCapacityMargin: 5
    }
  },
  auxiliary: {
    id: 'auxiliary',
    label: '辅机',
    description: '辅助设备驱动，要求更精确匹配',
    tolerances: {
      maxRatioDiffPercent: 10,
      maxCapacityMargin: 30,
      minCapacityMargin: 10
    }
  },
  special: {
    id: 'special',
    label: '特殊应用',
    description: '疏浚、拖轮等特殊工况，放宽容差',
    tolerances: {
      maxRatioDiffPercent: 20,
      maxCapacityMargin: 100,
      minCapacityMargin: 0
    }
  },
  highSpeed: {
    id: 'highSpeed',
    label: '高速船',
    description: '高速客船、快艇，中等容差',
    tolerances: {
      maxRatioDiffPercent: 10,
      maxCapacityMargin: 40,
      minCapacityMargin: 10
    }
  },
  workboat: {
    id: 'workboat',
    label: '工作船',
    description: '渔船、工程船，允许较大余量',
    tolerances: {
      maxRatioDiffPercent: 15,
      maxCapacityMargin: 80,
      minCapacityMargin: 5
    }
  },
  hybrid: {
    id: 'hybrid',
    label: '混动系统',
    description: 'PTO/PTI混合动力，最大容差',
    tolerances: {
      maxRatioDiffPercent: 15,
      maxCapacityMargin: 500,
      minCapacityMargin: 0
    }
  }
};

// ========== 默认容差设置 ==========
export const DEFAULT_TOLERANCES = {
  maxRatioDiffPercent: 10,
  maxCapacityMargin: 50,
  minCapacityMargin: 5
};

// ========== 辅助函数 ==========

/**
 * 验证权重配置是否有效
 * @param {Object} weights - 权重配置对象
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateWeights(weights) {
  const errors = [];
  const requiredKeys = ['costEffectiveness', 'ratioMatch', 'capacityMargin', 'thrustSatisfy', 'specialPackage'];

  // 检查必需字段
  for (const key of requiredKeys) {
    if (typeof weights[key] !== 'number') {
      errors.push(`缺少或无效的权重字段: ${key}`);
    } else if (weights[key] < 0 || weights[key] > 100) {
      errors.push(`权重 ${key} 必须在 0-100 之间`);
    }
  }

  // 检查权重总和
  const total = requiredKeys.reduce((sum, key) => sum + (weights[key] || 0), 0);
  if (Math.abs(total - 100) > 0.01) {
    errors.push(`权重总和必须为100，当前为 ${total.toFixed(1)}`);
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 归一化权重到总和为100
 * @param {Object} weights - 权重配置对象
 * @returns {Object} - 归一化后的权重
 */
export function normalizeWeights(weights) {
  const keys = ['costEffectiveness', 'ratioMatch', 'capacityMargin', 'thrustSatisfy', 'specialPackage'];
  const total = keys.reduce((sum, key) => sum + (weights[key] || 0), 0);

  if (total === 0) {
    return { ...DEFAULT_SCORING_WEIGHTS };
  }

  const normalized = {};
  const scale = 100 / total;

  for (const key of keys) {
    normalized[key] = Math.round((weights[key] || 0) * scale * 10) / 10;
  }

  // 确保总和精确为100（处理舍入误差）
  const newTotal = keys.reduce((sum, key) => sum + normalized[key], 0);
  const diff = 100 - newTotal;
  if (Math.abs(diff) > 0.01) {
    normalized.costEffectiveness += diff;
  }

  return normalized;
}

/**
 * 验证容差配置是否有效
 * @param {Object} tolerances - 容差配置对象
 * @returns {Object} - { valid: boolean, errors: string[] }
 */
export function validateTolerances(tolerances) {
  const errors = [];

  if (typeof tolerances.maxRatioDiffPercent !== 'number' ||
      tolerances.maxRatioDiffPercent < 0 ||
      tolerances.maxRatioDiffPercent > 100) {
    errors.push('速比容差必须在 0-100% 之间');
  }

  if (typeof tolerances.maxCapacityMargin !== 'number' ||
      tolerances.maxCapacityMargin < 0 ||
      tolerances.maxCapacityMargin > 1000) {
    errors.push('最大余量必须在 0-1000% 之间');
  }

  if (typeof tolerances.minCapacityMargin !== 'number' ||
      tolerances.minCapacityMargin < 0 ||
      tolerances.minCapacityMargin > 100) {
    errors.push('最小余量必须在 0-100% 之间');
  }

  if (tolerances.minCapacityMargin > tolerances.maxCapacityMargin) {
    errors.push('最小余量不能大于最大余量');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * 根据应用场景和输入参数计算自适应容差
 * @param {string} applicationId - 应用场景ID
 * @param {Object} inputParams - 输入参数 { power, speed, ratio }
 * @returns {Object} - 调整后的容差配置
 */
export function calculateAdaptiveTolerances(applicationId, inputParams = {}) {
  const baseConfig = APPLICATION_TOLERANCES[applicationId] || APPLICATION_TOLERANCES.propulsion;
  const tolerances = { ...baseConfig.tolerances };

  const { power, speed, ratio } = inputParams;

  // 大功率应用：适当放宽速比容差
  if (power && power > 1000) {
    tolerances.maxRatioDiffPercent = Math.min(
      tolerances.maxRatioDiffPercent * 1.2,
      40
    );
  }

  // 低速应用：收紧余量要求
  if (speed && speed < 500) {
    tolerances.minCapacityMargin = Math.max(
      tolerances.minCapacityMargin,
      10
    );
  }

  // 高减速比：放宽容差
  if (ratio && ratio > 5) {
    tolerances.maxRatioDiffPercent = Math.min(
      tolerances.maxRatioDiffPercent * 1.3,
      50
    );
  }

  return tolerances;
}

/**
 * 获取预设配置列表（用于UI展示）
 * @returns {Array} - 预设配置数组
 */
export function getPresetList() {
  return Object.values(PRESET_CONFIGURATIONS);
}

/**
 * 获取应用场景列表（用于UI展示）
 * @returns {Array} - 应用场景数组
 */
export function getApplicationList() {
  return Object.values(APPLICATION_TOLERANCES);
}

/**
 * 根据ID获取预设配置
 * @param {string} presetId - 预设ID
 * @returns {Object|null} - 预设配置或null
 */
export function getPresetById(presetId) {
  return PRESET_CONFIGURATIONS[presetId] || null;
}

/**
 * 根据ID获取应用场景配置
 * @param {string} applicationId - 应用场景ID
 * @returns {Object|null} - 应用场景配置或null
 */
export function getApplicationById(applicationId) {
  return APPLICATION_TOLERANCES[applicationId] || null;
}

export default {
  DEFAULT_SCORING_WEIGHTS,
  PRESET_CONFIGURATIONS,
  APPLICATION_TOLERANCES,
  DEFAULT_TOLERANCES,
  validateWeights,
  normalizeWeights,
  validateTolerances,
  calculateAdaptiveTolerances,
  getPresetList,
  getApplicationList,
  getPresetById,
  getApplicationById
};
