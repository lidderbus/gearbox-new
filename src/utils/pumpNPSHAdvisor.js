// src/utils/pumpNPSHAdvisor.js
// P2#1 (2026-04-24): 备用泵汽蚀 (NPSH) 预警
// 由于 standbyPumps 数据表未直接包含 NPSH_required, 本模块基于高风险工况启发式判定:
//   - 齿轮箱输出转速 (outputSpeed = inputSpeed / ratio) > 2500 rpm → 高速运行,吸入端易出现负压
//   - 泵额定压力 ≥ 3.5 MPa → 高压泵对吸入端要求更苛刻
//   - 工作温度 > 50°C → 油液粘度下降,汽蚀阈值降低
// 返回 risk 等级与建议,供 UI 显示预警徽章和细节

/**
 * 备用泵 NPSH 风险评估
 * @param {Object} params
 * @param {Object} params.pump - 选中的备用泵 { model, flow, pressure, motorPower }
 * @param {number} params.inputSpeed - 齿轮箱输入转速 rpm
 * @param {number} params.ratio - 减速比
 * @param {number} [params.temperature=30] - 工作温度 °C
 * @returns {{ risk: 'low'|'medium'|'high', warnings: string[], recommendations: string[], factors: Object }}
 */
export function evaluatePumpNPSHRisk({ pump, inputSpeed, ratio, temperature = 30 }) {
  const result = {
    risk: 'low',
    warnings: [],
    recommendations: [],
    factors: {}
  };
  if (!pump || !pump.model) {
    return result;
  }

  const outputSpeed = ratio > 0 ? inputSpeed / ratio : inputSpeed;
  const pressure = Number(pump.pressure) || 0;
  const temp = Number(temperature) || 30;

  result.factors = { outputSpeed: Math.round(outputSpeed), inputSpeed, ratio, pressure, temperature: temp };

  let riskScore = 0;

  // 因子 1: 高速运行
  if (inputSpeed > 2500) {
    riskScore += 2;
    result.warnings.push(`主机转速 ${inputSpeed} rpm 偏高,吸入端负压风险增加`);
  } else if (inputSpeed > 2000) {
    riskScore += 1;
  }

  // 因子 2: 高压泵
  if (pressure >= 4) {
    riskScore += 2;
    result.warnings.push(`泵额定压力 ${pressure} MPa 较高,NPSH 余量敏感`);
  } else if (pressure >= 3) {
    riskScore += 1;
  }

  // 因子 3: 高温
  if (temp > 60) {
    riskScore += 2;
    result.warnings.push(`工作温度 ${temp}°C 偏高,油液粘度下降,汽蚀阈值降低`);
  } else if (temp > 50) {
    riskScore += 1;
  }

  // 因子 4: 输出转速 (影响泵吸入工况的振动)
  if (outputSpeed > 1500) {
    riskScore += 1;
  }

  if (riskScore >= 4) {
    result.risk = 'high';
    result.recommendations.push('建议核实 NPSH_available ≥ NPSH_required + 0.5m 安全裕度');
    result.recommendations.push('建议将油箱液位提高至泵中心线以上 ≥ 0.3m,或选用沉没式安装');
    result.recommendations.push('管路建议加粗吸入管直径,避免急弯,吸入管长度不超过 3m');
  } else if (riskScore >= 2) {
    result.risk = 'medium';
    result.recommendations.push('建议在安装阶段核实 NPSH 裕度 ≥ 0.3m');
  }

  return result;
}

export default evaluatePumpNPSHRisk;
