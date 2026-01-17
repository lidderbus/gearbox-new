// src/utils/selectionDiagnostics.js
/**
 * 选型诊断模块
 * 分析选型失败原因，提供智能调整建议
 */

import { APPLICATION_TOLERANCES, PRESET_CONFIGURATIONS } from '../config/selectionConfig';

/**
 * 分析选型拒绝原因
 * @param {Object} diagnostics - 选型算法返回的诊断信息
 * @returns {Object} - 分析结果
 */
export function analyzeRejections(diagnostics) {
  if (!diagnostics || !diagnostics.rejectionReasons) {
    return { success: false, message: '无诊断数据' };
  }

  const { rejectionReasons, totalScanned, totalMatched, tolerances } = diagnostics;
  const totalRejected = Object.values(rejectionReasons).reduce((sum, v) => sum + v, 0);

  // 计算各原因占比
  const analysis = {
    summary: {
      totalScanned,
      totalMatched,
      totalRejected,
      matchRate: totalScanned > 0 ? ((totalMatched / totalScanned) * 100).toFixed(1) : 0
    },
    reasons: [],
    dominantReason: null,
    suggestions: []
  };

  // 按拒绝数量排序
  const sortedReasons = Object.entries(rejectionReasons)
    .filter(([_, count]) => count > 0)
    .sort((a, b) => b[1] - a[1]);

  if (sortedReasons.length > 0) {
    analysis.dominantReason = sortedReasons[0][0];
  }

  // 转换为详细分析
  sortedReasons.forEach(([reason, count]) => {
    const percentage = totalRejected > 0 ? ((count / totalRejected) * 100).toFixed(1) : 0;

    analysis.reasons.push({
      code: reason,
      label: getReasonLabel(reason),
      count,
      percentage,
      suggestion: getReasonSuggestion(reason, tolerances)
    });
  });

  // 生成综合建议
  analysis.suggestions = generateSuggestions(analysis, tolerances);

  return {
    success: true,
    analysis
  };
}

/**
 * 获取拒绝原因的中文标签
 */
function getReasonLabel(reasonCode) {
  const labels = {
    speedRange: '转速超出范围',
    ratioOutOfRange: '减速比偏差过大',
    capacityTooLow: '传递能力不足',
    capacityTooHigh: '传递能力余量过大',
    thrustInsufficient: '推力不满足要求'
  };
  return labels[reasonCode] || reasonCode;
}

/**
 * 获取拒绝原因的调整建议
 */
function getReasonSuggestion(reasonCode, tolerances) {
  const suggestions = {
    speedRange: {
      text: '输入转速超出齿轮箱支持范围',
      actions: [
        { type: 'adjustInput', label: '调整发动机转速', field: 'engineSpeed' },
        { type: 'switchSeries', label: '切换其他系列', field: 'gearboxType' }
      ]
    },
    ratioOutOfRange: {
      text: `当前减速比容差为${tolerances?.maxRatioDiffPercent || 25}%，可放宽容差`,
      actions: [
        { type: 'adjustTolerance', label: '放宽速比容差', field: 'maxRatioDiffPercent', suggestedValue: Math.min((tolerances?.maxRatioDiffPercent || 25) + 10, 40) },
        { type: 'adjustInput', label: '调整目标减速比', field: 'targetRatio' },
        { type: 'switchPreset', label: '切换到"特殊应用"模式', preset: 'special' }
      ]
    },
    capacityTooLow: {
      text: '功率需求超出齿轮箱传递能力',
      actions: [
        { type: 'adjustInput', label: '降低发动机功率', field: 'enginePower' },
        { type: 'adjustInput', label: '提高发动机转速', field: 'engineSpeed' },
        { type: 'switchSeries', label: '选择更大型号系列', field: 'gearboxType' }
      ]
    },
    capacityTooHigh: {
      text: `传递能力余量超过${tolerances?.maxCapacityMargin || 50}%，可放宽限制`,
      actions: [
        { type: 'adjustTolerance', label: '放宽余量上限', field: 'maxCapacityMargin', suggestedValue: Math.min((tolerances?.maxCapacityMargin || 50) + 30, 100) },
        { type: 'switchPreset', label: '切换到"工作船"模式', preset: 'workboat' },
        { type: 'adjustInput', label: '调整输入参数', field: 'enginePower' }
      ]
    },
    thrustInsufficient: {
      text: '推力要求高于齿轮箱额定推力',
      actions: [
        { type: 'adjustInput', label: '降低推力要求', field: 'thrustRequirement' },
        { type: 'switchSeries', label: '选择更大推力型号', field: 'gearboxType' }
      ]
    }
  };

  return suggestions[reasonCode] || { text: '未知原因', actions: [] };
}

/**
 * 生成综合调整建议
 */
function generateSuggestions(analysis, tolerances) {
  const suggestions = [];

  // 根据主要拒绝原因生成建议
  if (analysis.dominantReason === 'ratioOutOfRange') {
    suggestions.push({
      priority: 'high',
      type: 'tolerance',
      label: '放宽减速比容差',
      description: `当前容差${tolerances?.maxRatioDiffPercent || 25}%可能过于严格`,
      action: {
        type: 'adjustTolerance',
        field: 'maxRatioDiffPercent',
        currentValue: tolerances?.maxRatioDiffPercent || 25,
        suggestedValue: 35
      }
    });

    suggestions.push({
      priority: 'medium',
      type: 'preset',
      label: '切换应用场景',
      description: '尝试"特殊应用"预设，允许更大的速比偏差',
      action: {
        type: 'switchApplication',
        preset: 'special'
      }
    });
  }

  if (analysis.dominantReason === 'capacityTooLow') {
    suggestions.push({
      priority: 'high',
      type: 'input',
      label: '降低传递能力需求',
      description: '可通过提高转速来降低所需传递能力',
      action: {
        type: 'adjustInput',
        field: 'engineSpeed',
        direction: 'increase'
      }
    });
  }

  if (analysis.dominantReason === 'capacityTooHigh') {
    suggestions.push({
      priority: 'high',
      type: 'tolerance',
      label: '放宽余量上限',
      description: `当前上限${tolerances?.maxCapacityMargin || 50}%，可放宽到80-100%`,
      action: {
        type: 'adjustTolerance',
        field: 'maxCapacityMargin',
        currentValue: tolerances?.maxCapacityMargin || 50,
        suggestedValue: 80
      }
    });
  }

  // 匹配率过低时的通用建议
  if (parseFloat(analysis.summary.matchRate) < 5) {
    suggestions.push({
      priority: 'medium',
      type: 'general',
      label: '检查输入参数',
      description: '匹配率极低，建议核实输入参数是否正确',
      action: {
        type: 'checkInputs'
      }
    });
  }

  return suggestions;
}

/**
 * 获取过滤管道状态
 * @param {Object} result - 选型结果
 * @returns {Object} - 管道状态
 */
export function getFilterStatus(result) {
  const diagnostics = result?._diagnostics;
  if (!diagnostics) {
    return null;
  }

  const { totalScanned, totalMatched, rejectionReasons } = diagnostics;

  // 计算各阶段通过数量
  const stages = [
    {
      name: '数据加载',
      passed: totalScanned,
      total: totalScanned,
      description: '加载的齿轮箱总数'
    },
    {
      name: '转速过滤',
      passed: totalScanned - (rejectionReasons.speedRange || 0),
      rejected: rejectionReasons.speedRange || 0,
      description: '输入转速在支持范围内'
    },
    {
      name: '速比过滤',
      passed: totalScanned - (rejectionReasons.speedRange || 0) - (rejectionReasons.ratioOutOfRange || 0),
      rejected: rejectionReasons.ratioOutOfRange || 0,
      description: `速比偏差≤${diagnostics.tolerances?.maxRatioDiffPercent || 25}%`
    },
    {
      name: '容量过滤',
      passed: totalMatched + (rejectionReasons.thrustInsufficient || 0),
      rejected: (rejectionReasons.capacityTooLow || 0) + (rejectionReasons.capacityTooHigh || 0),
      description: `余量${diagnostics.tolerances?.minCapacityMargin || 0}%-${diagnostics.tolerances?.maxCapacityMargin || 50}%`
    },
    {
      name: '推力过滤',
      passed: totalMatched,
      rejected: rejectionReasons.thrustInsufficient || 0,
      description: '推力满足要求'
    },
    {
      name: '最终匹配',
      passed: totalMatched,
      total: totalMatched,
      description: '符合所有条件的型号'
    }
  ];

  return {
    stages,
    summary: {
      input: totalScanned,
      output: totalMatched,
      conversionRate: totalScanned > 0 ? ((totalMatched / totalScanned) * 100).toFixed(1) : 0
    }
  };
}

/**
 * 获取建议的应用场景预设
 * @param {Object} inputParams - 输入参数
 * @returns {string} - 推荐的应用场景ID
 */
export function suggestApplicationPreset(inputParams) {
  const { power, speed, ratio, thrust, application } = inputParams;

  // 如果用户已指定应用场景，保持不变
  if (application && APPLICATION_TOLERANCES[application]) {
    return application;
  }

  // 根据输入参数智能推荐
  if (power > 2000) {
    return 'propulsion'; // 大功率主推进
  }

  if (ratio > 5) {
    return 'special'; // 高减速比特殊应用
  }

  if (speed > 2500) {
    return 'highSpeed'; // 高速船
  }

  if (thrust > 100) {
    return 'workboat'; // 工作船
  }

  return 'propulsion'; // 默认主推进
}

/**
 * 格式化诊断结果为用户友好的文本
 */
export function formatDiagnosticsMessage(diagnostics) {
  const { analysis } = analyzeRejections(diagnostics);
  if (!analysis) return '无诊断信息';

  let message = `扫描${analysis.summary.totalScanned}个型号，匹配${analysis.summary.totalMatched}个`;

  if (analysis.reasons.length > 0) {
    message += '\n主要排除原因:\n';
    analysis.reasons.slice(0, 3).forEach(reason => {
      message += `• ${reason.label}: ${reason.count}个 (${reason.percentage}%)\n`;
    });
  }

  if (analysis.suggestions.length > 0) {
    message += '\n建议:\n';
    analysis.suggestions.slice(0, 2).forEach(suggestion => {
      message += `• ${suggestion.label}: ${suggestion.description}\n`;
    });
  }

  return message;
}

export default {
  analyzeRejections,
  getFilterStatus,
  suggestApplicationPreset,
  formatDiagnosticsMessage
};
