// src/utils/criticalSpeedCheck.js
// 简化临界转速预检模块 — 用于选型结果自动安全验证
// 使用简化两质量模型，仅在高转速(>3000rpm)或PTO工况时触发

import { calculateTwoMassFrequency, CRITICAL_SPEED_AVOIDANCE } from './torsionalVibration';

/**
 * 基础轴刚度估算 (N·m/rad)
 * 经验公式：基于典型船用齿轮箱传动轴参数
 * K ≈ baseStiffness × (power/1000)^0.5
 */
const BASE_STIFFNESS = 2.5e6; // N·m/rad, 典型中等功率齿轮箱轴刚度

/**
 * 估算发动机端转动惯量 (kg·m²)
 * 经验公式：J ≈ torque × 0.001 (粗略估算)
 */
function estimateEngineInertia(torque_Nm) {
  return Math.max(0.01, torque_Nm * 0.001);
}

/**
 * 估算负载端(螺旋桨)转动惯量 (kg·m²)
 * 通常为发动机端的 20-40%
 */
function estimateLoadInertia(engineInertia) {
  return engineInertia * 0.3;
}

/**
 * 估算轴系等效刚度 (N·m/rad)
 * @param {number} power - 功率 (kW)
 */
function estimateShaftStiffness(power) {
  return BASE_STIFFNESS * Math.pow(power / 1000, 0.5);
}

/**
 * 执行简化临界转速预检
 * @param {Object} params
 * @param {number} params.enginePower - 主机功率 (kW)
 * @param {number} params.engineSpeed - 主机转速 (rpm)
 * @param {number} params.ratio - 减速比
 * @param {boolean} [params.isPTO] - 是否PTO模式
 * @returns {Object|null} 预检结果，不需检查时返回null
 */
export function performCriticalSpeedCheck({ enginePower, engineSpeed, ratio, isPTO = false }) {
  // 仅在高转速或PTO模式时触发
  if (engineSpeed <= 3000 && !isPTO) {
    return null;
  }

  // 计算额定扭矩 T = 9550 × P / n (N·m)
  const torque_Nm = (9550 * enginePower) / engineSpeed;

  // 估算参数
  const J1 = estimateEngineInertia(torque_Nm);
  const J2 = estimateLoadInertia(J1);
  const K = estimateShaftStiffness(enginePower);

  // 调用两质量模型计算固有频率
  const freqResult = calculateTwoMassFrequency({ J1, J2, K });
  const naturalFreqHz = parseFloat(freqResult.frequency);
  const criticalSpeedRpm = parseInt(freqResult.criticalSpeed, 10);

  // 工作频率 (Hz) — 考虑减速比后的输出轴
  const operatingFreqHz = engineSpeed / 60;

  // 检查是否在禁止区 [fn×0.8, fn×1.2]
  const lowerBound = naturalFreqHz * CRITICAL_SPEED_AVOIDANCE.LOWER_RATIO;
  const upperBound = naturalFreqHz * CRITICAL_SPEED_AVOIDANCE.UPPER_RATIO;
  const isInForbiddenZone = operatingFreqHz >= lowerBound && operatingFreqHz <= upperBound;

  // 计算安全裕度
  let margin;
  if (operatingFreqHz < naturalFreqHz) {
    margin = ((naturalFreqHz - operatingFreqHz) / naturalFreqHz) * 100;
  } else {
    margin = ((operatingFreqHz - naturalFreqHz) / naturalFreqHz) * 100;
  }

  // 生成建议
  let recommendation;
  if (isInForbiddenZone) {
    recommendation = `工作频率 ${operatingFreqHz.toFixed(1)}Hz 处于临界转速禁止区 [${lowerBound.toFixed(1)}-${upperBound.toFixed(1)}Hz]，存在共振风险，强烈建议进行详细扭振分析`;
  } else if (margin < 20) {
    recommendation = `工作频率距临界转速裕度仅 ${margin.toFixed(0)}%，建议进行详细扭振分析确认安全`;
  } else {
    recommendation = `工作频率距临界转速裕度 ${margin.toFixed(0)}%，初步评估安全`;
  }

  return {
    safe: !isInForbiddenZone && margin >= 20,
    naturalFreqHz: parseFloat(naturalFreqHz.toFixed(2)),
    criticalSpeedRpm,
    operatingFreqHz: parseFloat(operatingFreqHz.toFixed(2)),
    marginPercent: parseFloat(margin.toFixed(1)),
    isInForbiddenZone,
    method: 'simplified-two-mass',
    recommendation,
    estimatedParams: { J1: parseFloat(J1.toFixed(4)), J2: parseFloat(J2.toFixed(4)), K: Math.round(K) }
  };
}

export default performCriticalSpeedCheck;
