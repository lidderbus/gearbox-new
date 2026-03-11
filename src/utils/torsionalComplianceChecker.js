/**
 * 规范合规性自动校验模块
 *
 * 输入: 分析结果 + 选定规范
 * 输出: 逐条规范检查(轴径/共振裕度/应力限值/禁止转速区间)
 */

import { getStandard, checkForbiddenZone } from '../data/torsionalStandardsDB';
import { calculateAllowableStress } from './forcedVibrationAnalysis';

/**
 * 执行规范合规性校验
 *
 * @param {Object} analysisResult - 扭振分析结果
 * @param {Object} systemInput - 系统输入参数
 * @param {string} standardCode - 规范代码 (如 'CCS_MARINE_2024')
 * @returns {Object} 合规性报告
 */
export function checkCompliance(analysisResult, systemInput, standardCode = 'CCS_MARINE_2024') {
  const standard = getStandard(standardCode);
  const checks = [];
  let passCount = 0;
  let failCount = 0;
  let warnCount = 0;

  // 1. 轴径校核
  if (systemInput?.shaftDiameter && systemInput?.motorPower) {
    const shaftCheck = checkShaftDiameter(systemInput, standard);
    checks.push(shaftCheck);
    if (shaftCheck.status === 'pass') passCount++;
    else if (shaftCheck.status === 'fail') failCount++;
    else warnCount++;
  }

  // 2. 共振裕度校核
  if (analysisResult?.criticalSpeeds || analysisResult?.avoidanceChecks) {
    const resonanceCheck = checkResonanceMargin(analysisResult, systemInput, standard);
    checks.push(resonanceCheck);
    if (resonanceCheck.status === 'pass') passCount++;
    else if (resonanceCheck.status === 'fail') failCount++;
    else warnCount++;
  }

  // 3. 应力限值校核 (T1/T2)
  if (analysisResult?.verification || analysisResult?.combinedResults) {
    const stressCheck = checkStressLimits(analysisResult, systemInput, standard);
    checks.push(stressCheck);
    if (stressCheck.status === 'pass') passCount++;
    else if (stressCheck.status === 'fail') failCount++;
    else warnCount++;
  }

  // 4. 禁止转速区间校核
  if (analysisResult?.barredSpeedRanges) {
    const barredCheck = checkBarredSpeedRanges(analysisResult, systemInput, standard);
    checks.push(barredCheck);
    if (barredCheck.status === 'pass') passCount++;
    else if (barredCheck.status === 'fail') failCount++;
    else warnCount++;
  }

  const overallStatus = failCount > 0 ? 'fail' : (warnCount > 0 ? 'warning' : 'pass');

  return {
    standardCode,
    standardName: standard.name,
    checks,
    summary: { passCount, failCount, warnCount, total: checks.length },
    overallStatus,
    overallLabel: overallStatus === 'pass' ? '合规' : (overallStatus === 'fail' ? '不合规' : '需关注'),
    timestamp: new Date().toISOString()
  };
}

function checkShaftDiameter(systemInput, standard) {
  const { motorPower, motorSpeed, propSpeed, shaftDiameter, materialStrength = 600 } = systemInput;
  const formula = standard.shaftFormula;

  // CCS公式: d = F × K × [Ne × 560 / ne / (Rm + 160)]^(1/3)
  let F = 100, K = 1.15; // 螺旋桨轴默认
  if (formula?.coefficients?.F) F = formula.coefficients.F.propellerShaft || 100;
  if (formula?.coefficients?.K) K = formula.coefficients.K.propellerShaft || 1.15;

  // 轴径校核应使用螺旋桨轴转速（低速侧），而非电机转速
  const speed = propSpeed || motorSpeed || 1800;
  const Rm = materialStrength;
  const minDia = F * K * Math.pow((motorPower * 560) / speed / (Rm + 160), 1 / 3);
  const margin = ((shaftDiameter - minDia) / minDia * 100);

  return {
    name: '轴径校核',
    description: `最小轴径 ${minDia.toFixed(1)}mm, 实际 ${shaftDiameter}mm`,
    formula: formula?.formula || 'd = F×K×[Ne×560/ne/(Rm+160)]^(1/3)',
    calculated: minDia.toFixed(1),
    actual: shaftDiameter,
    margin: margin.toFixed(1) + '%',
    status: shaftDiameter >= minDia ? 'pass' : 'fail',
    icon: shaftDiameter >= minDia ? '✓' : '✗'
  };
}

function checkResonanceMargin(analysisResult, systemInput, standard) {
  const zone = standard.torsionalVibration?.forbiddenZone || { min: 0.8, max: 1.2 };
  const requiredMargin = standard.torsionalVibration?.operatingMargin || 0.15;

  const avoidanceChecks = analysisResult.avoidanceChecks || [];
  const dangerCount = avoidanceChecks.filter(c => c.inDangerZone).length;
  const minMargin = avoidanceChecks.length > 0
    ? Math.min(...avoidanceChecks.map(c => parseFloat(c.margin) || 100))
    : 100;

  return {
    name: '共振裕度校核',
    description: `禁区 ${(zone.min * 100).toFixed(0)}%~${(zone.max * 100).toFixed(0)}%, 要求裕度≥${(requiredMargin * 100).toFixed(0)}%`,
    forbiddenZone: zone,
    requiredMargin: (requiredMargin * 100).toFixed(0) + '%',
    actualMinMargin: minMargin.toFixed(1) + '%',
    dangerCount,
    status: dangerCount === 0 && minMargin >= requiredMargin * 100 ? 'pass' : (dangerCount > 0 ? 'fail' : 'warning'),
    icon: dangerCount === 0 ? '✓' : '✗'
  };
}

function checkStressLimits(analysisResult, systemInput, standard) {
  const verification = analysisResult.verification;
  if (!verification) {
    return { name: '应力限值校核', description: '无强迫振动数据', status: 'warning', icon: '–' };
  }

  const intOK = verification.intermediateMargin >= 0;
  const propOK = verification.propellerMargin >= 0;

  return {
    name: '应力限值校核 (T1/T2)',
    description: `中间轴max=${verification.maxIntermediateStress?.toFixed(3)||'-'}N/mm², 螺旋桨轴max=${verification.maxPropellerStress?.toFixed(3)||'-'}N/mm²`,
    intermediateOK: intOK,
    propellerOK: propOK,
    status: intOK && propOK ? 'pass' : 'fail',
    icon: intOK && propOK ? '✓' : '✗'
  };
}

function checkBarredSpeedRanges(analysisResult, systemInput, standard) {
  const ranges = analysisResult.barredSpeedRanges || [];
  const operatingMin = systemInput?.analysisSettings?.operatingMin || systemInput?.operatingSpeed * 0.5;
  const operatingMax = systemInput?.analysisSettings?.operatingMax || systemInput?.operatingSpeed;

  // 检查禁止区间是否与工作转速范围重叠
  const overlapping = ranges.filter(r =>
    r.min <= operatingMax && r.max >= operatingMin
  );

  return {
    name: '禁止转速区间',
    description: overlapping.length > 0
      ? `${overlapping.length}个禁止区间与工作范围重叠`
      : (ranges.length > 0 ? `共${ranges.length}个禁止区间，均不在工作范围内` : '无禁止转速区间'),
    totalRanges: ranges.length,
    overlappingRanges: overlapping.length,
    ranges: ranges.map(r => `${r.start || r.min}-${r.end || r.max} rpm`),
    status: overlapping.length === 0 ? 'pass' : 'fail',
    icon: overlapping.length === 0 ? '✓' : '✗'
  };
}

export default { checkCompliance };
