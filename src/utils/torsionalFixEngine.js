/**
 * 扭振分析智能错误修复引擎
 *
 * 功能：诊断错误根因，生成修复建议
 *
 * @module torsionalFixEngine
 */

import {
  calculateShaftStiffness,
  calculateTwoMassFrequency,
  CRITICAL_SPEED_AVOIDANCE,
  STEEL_SHEAR_MODULUS
} from './torsionalVibration';

// ============================================================
// 错误类型枚举
// ============================================================

export const ERROR_TYPES = {
  RESONANCE_RISK: 'RESONANCE_RISK',           // 共振风险
  INVALID_INERTIA: 'INVALID_INERTIA',         // 惯量无效
  INVALID_STIFFNESS: 'INVALID_STIFFNESS',     // 刚度无效
  INVALID_SPEED: 'INVALID_SPEED',             // 转速无效
  INSUFFICIENT_MASSES: 'INSUFFICIENT_MASSES', // 质量数不足
  INSUFFICIENT_SHAFTS: 'INSUFFICIENT_SHAFTS', // 轴段数不足
  CALCULATION_ERROR: 'CALCULATION_ERROR',     // 计算异常
};

// ============================================================
// 修复类型枚举
// ============================================================

export const FIX_TYPES = {
  ADJUST_SPEED: 'ADJUST_SPEED',           // 调整转速
  ADJUST_DIAMETER: 'ADJUST_DIAMETER',     // 调整轴径
  ADJUST_INERTIA: 'ADJUST_INERTIA',       // 调整惯量
  ADJUST_LENGTH: 'ADJUST_LENGTH',         // 调整轴长
  RESET_DEFAULTS: 'RESET_DEFAULTS',       // 重置默认值
  RECALCULATE: 'RECALCULATE',             // 重新计算
};

// ============================================================
// 默认参数值（用于修复建议）
// ============================================================

const DEFAULT_VALUES = {
  inertia: {
    '飞轮': 5.0,
    '齿轮箱输入端': 0.5,
    '齿轮箱输出端': 0.8,
    '螺旋桨': 15.0,
    '电机转子': 3.0,
    '联轴器': 0.3,
    'default': 1.0,
  },
  stiffness: 1e6,  // 默认刚度 N·m/rad
  speed: [1000, 1200, 1500, 1800, 2000],  // 常用转速选项
};

// ============================================================
// 诊断函数
// ============================================================

/**
 * 诊断错误根因
 *
 * @param {string|null} error - 错误消息
 * @param {Object|null} result - 分析结果
 * @param {Object} input - 当前输入参数
 * @returns {Object} 诊断结果
 */
export function diagnoseError(error, result, input) {
  const diagnosis = {
    errorTypes: [],
    severity: 'low',  // low, medium, high, critical
    details: [],
    causes: [],
    affectedParams: [],
  };

  // 1. 检查参数验证错误
  if (error) {
    if (error.includes('惯量') || error.includes('J')) {
      diagnosis.errorTypes.push(ERROR_TYPES.INVALID_INERTIA);
      diagnosis.severity = 'high';
      diagnosis.details.push('存在无效的转动惯量参数');
      diagnosis.causes.push('惯量值必须大于0');

      // 找出无效的质量
      const invalidMasses = input.masses?.filter(m => !m.J || m.J <= 0) || [];
      invalidMasses.forEach(m => {
        diagnosis.affectedParams.push({
          type: 'mass',
          name: m.name,
          field: 'J',
          currentValue: m.J,
          issue: '惯量无效',
        });
      });
    }

    if (error.includes('刚度') || error.includes('K')) {
      diagnosis.errorTypes.push(ERROR_TYPES.INVALID_STIFFNESS);
      diagnosis.severity = 'high';
      diagnosis.details.push('存在无效的轴段刚度参数');
      diagnosis.causes.push('刚度值必须大于0');

      const invalidShafts = input.shafts?.filter(s => !s.K || s.K <= 0) || [];
      invalidShafts.forEach(s => {
        diagnosis.affectedParams.push({
          type: 'shaft',
          name: s.name,
          field: 'K',
          currentValue: s.K,
          issue: '刚度无效',
        });
      });
    }

    if (error.includes('转速') || error.includes('rpm')) {
      diagnosis.errorTypes.push(ERROR_TYPES.INVALID_SPEED);
      diagnosis.severity = 'medium';
      diagnosis.details.push('工作转速参数无效');
      diagnosis.causes.push('转速必须大于0');
      diagnosis.affectedParams.push({
        type: 'param',
        name: 'operatingSpeed',
        field: 'operatingSpeed',
        currentValue: input.operatingSpeed,
        issue: '转速无效',
      });
    }

    if (error.includes('质量') && error.includes('2个')) {
      diagnosis.errorTypes.push(ERROR_TYPES.INSUFFICIENT_MASSES);
      diagnosis.severity = 'high';
      diagnosis.details.push('集中质量数量不足');
      diagnosis.causes.push('至少需要2个集中质量才能进行扭振分析');
    }

    if (error.includes('轴段') && error.includes('1个')) {
      diagnosis.errorTypes.push(ERROR_TYPES.INSUFFICIENT_SHAFTS);
      diagnosis.severity = 'high';
      diagnosis.details.push('轴段数量不足');
      diagnosis.causes.push('至少需要1个轴段连接质量');
    }
  }

  // 2. 检查共振风险
  if (result && !result.isValid) {
    diagnosis.errorTypes.push(ERROR_TYPES.RESONANCE_RISK);
    diagnosis.severity = diagnosis.severity === 'high' ? 'critical' : 'high';

    const dangerousOrders = result.avoidanceChecks?.filter(c => c.inDangerZone) || [];

    dangerousOrders.forEach(check => {
      diagnosis.details.push(
        `${check.order}阶激励临界转速 ${check.criticalSpeed} rpm 在工作转速 ${check.operatingSpeed} rpm 附近`
      );
      diagnosis.causes.push(
        `工作转速位于 ${check.order}阶共振危险区间 [${check.lowerLimit}-${check.upperLimit}] rpm`
      );
    });

    diagnosis.affectedParams.push({
      type: 'resonance',
      dangerousOrders: dangerousOrders,
      naturalFrequency: result.naturalFrequency,
      operatingSpeed: input.operatingSpeed,
    });
  }

  // 3. 检查计算异常
  if (result && (
    isNaN(parseFloat(result.naturalFrequency?.frequency)) ||
    result.equivalentStiffness === '0.000e+0'
  )) {
    diagnosis.errorTypes.push(ERROR_TYPES.CALCULATION_ERROR);
    diagnosis.severity = 'critical';
    diagnosis.details.push('计算结果异常，可能存在参数配置问题');
    diagnosis.causes.push('检查所有参数是否合理');
  }

  return diagnosis;
}

// ============================================================
// 修复建议生成函数
// ============================================================

/**
 * 生成修复建议
 *
 * @param {Object} diagnosis - 诊断结果
 * @param {Object} input - 当前输入参数
 * @param {Object} result - 分析结果（包含所有临界转速信息）
 * @returns {Object[]} 修复建议列表
 */
export function generateFixSuggestions(diagnosis, input, result = null) {
  const suggestions = [];

  // 根据错误类型生成对应建议
  diagnosis.errorTypes.forEach(errorType => {
    switch (errorType) {
      case ERROR_TYPES.RESONANCE_RISK:
        suggestions.push(...generateResonanceFixSuggestions(diagnosis, input, result));
        break;

      case ERROR_TYPES.INVALID_INERTIA:
        suggestions.push(...generateInertiaFixSuggestions(diagnosis, input));
        break;

      case ERROR_TYPES.INVALID_STIFFNESS:
        suggestions.push(...generateStiffnessFixSuggestions(diagnosis, input));
        break;

      case ERROR_TYPES.INVALID_SPEED:
        suggestions.push(...generateSpeedFixSuggestions(diagnosis, input));
        break;

      case ERROR_TYPES.INSUFFICIENT_MASSES:
      case ERROR_TYPES.INSUFFICIENT_SHAFTS:
        suggestions.push(generateResetSuggestion());
        break;

      case ERROR_TYPES.CALCULATION_ERROR:
        suggestions.push(generateResetSuggestion());
        break;

      default:
        break;
    }
  });

  // 按优先级排序
  suggestions.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2);
  });

  // 标记推荐方案
  if (suggestions.length > 0) {
    suggestions[0].isRecommended = true;
  }

  return suggestions;
}

/**
 * 生成共振风险修复建议
 */
function generateResonanceFixSuggestions(diagnosis, input, result) {
  const suggestions = [];
  const resonanceInfo = diagnosis.affectedParams.find(p => p.type === 'resonance');

  if (!resonanceInfo) return suggestions;

  const { dangerousOrders, operatingSpeed } = resonanceInfo;

  // 获取所有阶次的临界转速信息（用于验证安全转速不会落入其他危险区间）
  const allAvoidanceChecks = result?.avoidanceChecks || [];

  // 方案1: 调整工作转速（推荐）
  const safeSpeedSuggestions = calculateSafeSpeedOptions(dangerousOrders, operatingSpeed, allAvoidanceChecks);
  if (safeSpeedSuggestions.length > 0) {
    const bestSafeSpeed = safeSpeedSuggestions[0];
    suggestions.push({
      id: `speed-${Date.now()}`,
      type: FIX_TYPES.ADJUST_SPEED,
      title: '调整工作转速',
      description: `将工作转速从 ${operatingSpeed} rpm 调整到 ${bestSafeSpeed.speed} rpm`,
      priority: 'high',
      effect: `避开 ${dangerousOrders.map(d => d.order + '阶').join('、')} 共振区间`,
      sideEffect: '可能影响船舶航速和推进效率',
      changes: {
        operatingSpeed: bestSafeSpeed.speed,
      },
      alternativeValues: safeSpeedSuggestions.map(s => s.speed),
    });
  }

  // 方案2: 增加轴径（提高刚度）
  const diameterSuggestion = calculateDiameterIncrease(input, dangerousOrders);
  if (diameterSuggestion) {
    suggestions.push({
      id: `diameter-${Date.now()}`,
      type: FIX_TYPES.ADJUST_DIAMETER,
      title: '增加轴径',
      description: `将 ${diameterSuggestion.shaftName} 直径从 ${diameterSuggestion.oldDiameter}mm 增加到 ${diameterSuggestion.newDiameter}mm`,
      priority: 'medium',
      effect: '提高轴段刚度，使固有频率远离工作频率',
      sideEffect: '增加轴的重量和成本',
      changes: {
        shafts: diameterSuggestion.newShafts,
      },
    });
  }

  // 方案3: 调整惯量配置
  const inertiaSuggestion = calculateInertiaAdjustment(input, dangerousOrders);
  if (inertiaSuggestion) {
    suggestions.push({
      id: `inertia-${Date.now()}`,
      type: FIX_TYPES.ADJUST_INERTIA,
      title: '调整惯量配置',
      description: inertiaSuggestion.description,
      priority: 'low',
      effect: '改变系统固有频率',
      sideEffect: '可能需要更换飞轮或增加配重',
      changes: {
        masses: inertiaSuggestion.newMasses,
      },
    });
  }

  return suggestions;
}

/**
 * 计算安全转速选项
 * @param {Object[]} dangerousOrders - 当前危险的阶次
 * @param {number} currentSpeed - 当前工作转速
 * @param {Object[]} allAvoidanceChecks - 所有阶次的临界转速校核结果
 */
function calculateSafeSpeedOptions(dangerousOrders, currentSpeed, allAvoidanceChecks = []) {
  const candidateOptions = [];

  dangerousOrders.forEach(check => {
    const lowerSafe = Math.floor(check.lowerLimit * 0.95);  // 低于下限5%
    const upperSafe = Math.ceil(check.upperLimit * 1.05);   // 高于上限5%

    // 向下调整
    if (lowerSafe > 100) {
      const diff = currentSpeed - lowerSafe;
      candidateOptions.push({
        speed: lowerSafe,
        direction: 'down',
        diff: Math.abs(diff),
        margin: ((check.lowerLimit - lowerSafe) / check.lowerLimit * 100).toFixed(1),
        sourceOrder: check.order,
      });
    }

    // 向上调整
    if (upperSafe < 5000) {
      const diff = upperSafe - currentSpeed;
      candidateOptions.push({
        speed: upperSafe,
        direction: 'up',
        diff: Math.abs(diff),
        margin: ((upperSafe - check.upperLimit) / check.upperLimit * 100).toFixed(1),
        sourceOrder: check.order,
      });
    }
  });

  // 过滤掉会落入其他阶次危险区间的候选转速
  const safeOptions = candidateOptions.filter(option => {
    // 检查此转速是否落入任何阶次的危险区间
    const conflictingOrder = allAvoidanceChecks.find(check => {
      const inDangerZone = option.speed >= check.lowerLimit && option.speed <= check.upperLimit;
      return inDangerZone;
    });

    if (conflictingOrder) {
      console.log(`转速 ${option.speed} rpm 避开了 ${option.sourceOrder}阶，但落入了 ${conflictingOrder.order}阶危险区间 [${conflictingOrder.lowerLimit}-${conflictingOrder.upperLimit}]`);
      return false;
    }
    return true;
  });

  // 按调整幅度排序（优先选择调整最小的）
  safeOptions.sort((a, b) => a.diff - b.diff);

  return safeOptions;
}

/**
 * 计算轴径增加建议
 *
 * 改进：检测用户是否手动设置了高于几何计算值的刚度，
 * 确保增加轴径后的刚度确实高于当前值
 */
function calculateDiameterIncrease(input, dangerousOrders) {
  if (!input.shafts || input.shafts.length === 0) return null;

  // 找到刚度最低的轴段（瓶颈）
  const sortedShafts = [...input.shafts].sort((a, b) => a.K - b.K);
  const weakestShaft = sortedShafts[0];

  if (!weakestShaft.diameter || !weakestShaft.length) {
    return null;
  }

  const currentK = weakestShaft.K;
  const currentDiameter = weakestShaft.diameter;
  const shaftLength = weakestShaft.length;

  // 计算当前几何参数对应的理论刚度
  const geometricStiffnessResult = calculateShaftStiffness({
    diameter: currentDiameter,
    length: shaftLength,
    innerDiameter: weakestShaft.innerDiameter || 0,
    G: STEEL_SHEAR_MODULUS,
  });
  const geometricK = geometricStiffnessResult.stiffness;

  // 检测用户是否手动设置了高于几何计算值的刚度
  const isManualOverride = currentK > geometricK * 1.1; // 10%容差

  // 目标：提高系统刚度约70% (因为 ω ∝ √K，提高70%刚度可提高约30%频率)
  const stiffnessRatio = 1.7;

  let targetK;
  let newDiameter;

  if (isManualOverride) {
    // 用户手动设置了更高的刚度值
    // 需要计算使几何刚度达到 currentK * stiffnessRatio 所需的直径
    targetK = currentK * stiffnessRatio;

    // K = G × Ip / L = G × (π × d⁴ / 32) / L
    // d = (32 × K × L / (G × π))^0.25
    const G = STEEL_SHEAR_MODULUS;
    const requiredDiameter = Math.pow(
      (32 * targetK * (shaftLength / 1000)) / (G * Math.PI),
      0.25
    ) * 1000; // 转回mm

    newDiameter = Math.ceil(requiredDiameter / 5) * 5; // 取整到5mm

    // 检查新直径是否合理（不超过原直径的2倍）
    if (newDiameter > currentDiameter * 2) {
      console.log(`增加轴径方案不可行: 需要直径 ${newDiameter}mm 超过当前直径 ${currentDiameter}mm 的2倍`);
      console.log(`原因: 当前刚度 ${currentK.toExponential(2)} 远高于几何计算值 ${geometricK.toExponential(2)}`);
      return null;
    }
  } else {
    // 正常情况：基于几何参数计算
    // K ∝ d^4 / L，所以 d_new = d_old × (K_ratio)^0.25
    const diameterRatio = Math.pow(stiffnessRatio, 0.25);
    newDiameter = Math.ceil(currentDiameter * diameterRatio / 5) * 5;
    targetK = geometricK * stiffnessRatio;
  }

  // 重新计算新直径对应的刚度
  const newStiffnessResult = calculateShaftStiffness({
    diameter: newDiameter,
    length: shaftLength,
    innerDiameter: weakestShaft.innerDiameter || 0,
    G: STEEL_SHEAR_MODULUS,
  });

  const newK = newStiffnessResult.stiffness;

  // 最终验证：确保新刚度确实高于当前刚度
  if (newK <= currentK) {
    console.log(`增加轴径方案验证失败: 新刚度 ${newK.toExponential(2)} <= 当前刚度 ${currentK.toExponential(2)}`);
    return null;
  }

  const newShafts = input.shafts.map(s => {
    if (s.name === weakestShaft.name) {
      return {
        ...s,
        diameter: newDiameter,
        K: newK,
      };
    }
    return s;
  });

  // 计算刚度提升百分比
  const stiffnessIncrease = ((newK - currentK) / currentK * 100).toFixed(1);

  return {
    shaftName: weakestShaft.name,
    oldDiameter: currentDiameter,
    newDiameter: newDiameter,
    oldK: currentK,
    newK: newK,
    stiffnessIncrease: stiffnessIncrease,
    isManualOverride: isManualOverride,
    newShafts: newShafts,
  };
}

/**
 * 计算惯量调整建议
 */
function calculateInertiaAdjustment(input, dangerousOrders) {
  if (!input.masses || input.masses.length < 2) return null;

  // 策略：增加飞轮惯量以降低固有频率
  const flywheel = input.masses.find(m =>
    m.name.includes('飞轮') || m.name.includes('电机')
  ) || input.masses[0];

  const newInertia = flywheel.J * 1.5;  // 增加50%

  const newMasses = input.masses.map(m => {
    if (m.name === flywheel.name) {
      return { ...m, J: parseFloat(newInertia.toFixed(2)) };
    }
    return m;
  });

  return {
    description: `将 ${flywheel.name} 惯量从 ${flywheel.J} kg·m² 增加到 ${newInertia.toFixed(2)} kg·m²`,
    massName: flywheel.name,
    oldInertia: flywheel.J,
    newInertia: parseFloat(newInertia.toFixed(2)),
    newMasses: newMasses,
  };
}

/**
 * 生成惯量修复建议
 */
function generateInertiaFixSuggestions(diagnosis, input) {
  const suggestions = [];

  diagnosis.affectedParams
    .filter(p => p.type === 'mass')
    .forEach(param => {
      // 根据名称推荐默认值
      let recommendedValue = DEFAULT_VALUES.inertia.default;
      Object.keys(DEFAULT_VALUES.inertia).forEach(key => {
        if (param.name.includes(key)) {
          recommendedValue = DEFAULT_VALUES.inertia[key];
        }
      });

      const newMasses = input.masses.map(m => {
        if (m.name === param.name) {
          return { ...m, J: recommendedValue };
        }
        return m;
      });

      suggestions.push({
        id: `inertia-fix-${Date.now()}-${param.name}`,
        type: FIX_TYPES.ADJUST_INERTIA,
        title: `修复 ${param.name} 惯量`,
        description: `将惯量设置为推荐值 ${recommendedValue} kg·m²`,
        priority: 'high',
        effect: '恢复有效的惯量参数',
        sideEffect: '无',
        changes: {
          masses: newMasses,
        },
      });
    });

  return suggestions;
}

/**
 * 生成刚度修复建议
 */
function generateStiffnessFixSuggestions(diagnosis, input) {
  const suggestions = [];

  diagnosis.affectedParams
    .filter(p => p.type === 'shaft')
    .forEach(param => {
      const shaft = input.shafts.find(s => s.name === param.name);

      // 如果有几何参数，重新计算
      if (shaft && shaft.diameter && shaft.length) {
        const result = calculateShaftStiffness({
          diameter: shaft.diameter,
          length: shaft.length,
          innerDiameter: shaft.innerDiameter || 0,
        });

        const newShafts = input.shafts.map(s => {
          if (s.name === param.name) {
            return { ...s, K: result.stiffness };
          }
          return s;
        });

        suggestions.push({
          id: `stiffness-recalc-${Date.now()}-${param.name}`,
          type: FIX_TYPES.RECALCULATE,
          title: `重新计算 ${param.name} 刚度`,
          description: `根据轴径 ${shaft.diameter}mm 和轴长 ${shaft.length}mm 重新计算`,
          priority: 'high',
          effect: `刚度 = ${result.stiffnessFormatted} N·m/rad`,
          sideEffect: '无',
          changes: {
            shafts: newShafts,
          },
        });
      } else {
        // 使用默认值
        const newShafts = input.shafts.map(s => {
          if (s.name === param.name) {
            return { ...s, K: DEFAULT_VALUES.stiffness };
          }
          return s;
        });

        suggestions.push({
          id: `stiffness-default-${Date.now()}-${param.name}`,
          type: FIX_TYPES.ADJUST_DIAMETER,
          title: `设置 ${param.name} 默认刚度`,
          description: `使用默认刚度值 1×10⁶ N·m/rad`,
          priority: 'medium',
          effect: '恢复有效的刚度参数',
          sideEffect: '建议后续根据实际轴段参数重新计算',
          changes: {
            shafts: newShafts,
          },
        });
      }
    });

  return suggestions;
}

/**
 * 生成转速修复建议
 */
function generateSpeedFixSuggestions(diagnosis, input) {
  const suggestions = DEFAULT_VALUES.speed.map((speed, index) => ({
    id: `speed-fix-${Date.now()}-${speed}`,
    type: FIX_TYPES.ADJUST_SPEED,
    title: `设置转速为 ${speed} rpm`,
    description: `使用常用工作转速 ${speed} rpm`,
    priority: index === 2 ? 'high' : 'medium',  // 1500rpm 优先
    effect: '恢复有效的转速参数',
    sideEffect: '无',
    changes: {
      operatingSpeed: speed,
    },
    isRecommended: speed === 1500,
  }));

  return suggestions;
}

/**
 * 生成重置建议
 */
function generateResetSuggestion() {
  return {
    id: `reset-${Date.now()}`,
    type: FIX_TYPES.RESET_DEFAULTS,
    title: '重置为默认配置',
    description: '恢复系统默认的轴系配置（飞轮-齿轮箱-螺旋桨）',
    priority: 'high',
    effect: '恢复完整的可分析轴系模型',
    sideEffect: '将清除当前所有自定义参数',
    changes: {
      reset: true,
    },
  };
}

/**
 * 应用修复建议
 *
 * @param {Object} suggestion - 修复建议
 * @param {Object} currentInput - 当前输入
 * @param {Function} createDefault - 创建默认输入的函数
 * @returns {Object} 修复后的输入
 */
export function applyFix(suggestion, currentInput, createDefault) {
  if (suggestion.changes.reset) {
    return createDefault();
  }

  const newInput = { ...currentInput };

  if (suggestion.changes.operatingSpeed !== undefined) {
    newInput.operatingSpeed = suggestion.changes.operatingSpeed;
  }

  if (suggestion.changes.masses) {
    newInput.masses = suggestion.changes.masses;
  }

  if (suggestion.changes.shafts) {
    newInput.shafts = suggestion.changes.shafts;
  }

  return newInput;
}
