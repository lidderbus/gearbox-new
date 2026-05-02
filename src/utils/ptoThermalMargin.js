// src/utils/ptoThermalMargin.js
// P2#3 (2026-04-24): PTO/PTI 混合动力热功率建模
// 渡轮/拖轮类双动力系统可能同时吸收 (PTO: 齿轮箱向外取力) 与注入 (PTI: 电机助力)
// 齿轮箱齿轮接触面 + 油液散热能力是总功率的散热上限,简化模型:
//
//   effectivePower = |enginePower + ptoPower * ptoFlag - ptiPower * ptiFlag|   (kW, 有方向)
//   thermalLoad    = effectivePower × (1 - efficiency)                         (散热负载)
//   thermalLimit   = ratedPower × (1 - efficiency) × 1.0   (额定散热=出厂标称)
//
// 判定: 若 thermalLoad / thermalLimit > 1.0 → 热过载; > 0.85 → 接近极限
// 输出: capacity 降额建议 + 预警标签

/**
 * 计算 PTO/PTI 热功率裕度
 *
 * @param {Object} params
 * @param {number} params.enginePower - 主机功率 kW
 * @param {number} params.ratedCapacity - 齿轮箱额定传递能力 (kW/rpm × rpm = kW等效)
 * @param {number} params.engineSpeed - 转速 rpm
 * @param {Object} params.hybridConfig - { modes:{pto,pti}, ptoPower, ptiPower, efficiency }
 * @returns {{
 *   safe: boolean,
 *   thermalLoadKW: number,
 *   thermalLimitKW: number,
 *   utilizationPct: number,
 *   derateRecommendation: number,  // 建议功率降额 (kW)
 *   warnings: string[],
 *   notes: string
 * }}
 */
export function evaluatePTOThermalMargin({
  enginePower,
  ratedCapacity,
  engineSpeed,
  hybridConfig = {}
}) {
  const result = {
    safe: true,
    thermalLoadKW: 0,
    thermalLimitKW: 0,
    utilizationPct: 0,
    derateRecommendation: 0,
    warnings: [],
    notes: ''
  };

  const engineKw = Number(enginePower) || 0;
  const ratedKw = Number(ratedCapacity) > 0 ? Number(ratedCapacity) * Number(engineSpeed) : engineKw * 1.2;
  const modes = hybridConfig.modes || {};
  const ptoKw = modes.pto ? Number(hybridConfig.ptoPower || 0) : 0;
  const ptiKw = modes.pti ? Number(hybridConfig.ptiPower || 0) : 0;
  const efficiency = Math.min(0.99, Math.max(0.9, Number(hybridConfig.efficiency) || 0.97));
  const thermalFraction = 1 - efficiency; // 热损失系数

  if (!modes.pto && !modes.pti) {
    result.notes = '无混动模式,无需热功率校核';
    return result;
  }

  // 同时 PTO+PTI 是最严苛工况: 双向功率流过齿轮副
  const throughPower = Math.abs(engineKw + ptoKw - ptiKw) +
    (modes.pto && modes.pti ? Math.min(ptoKw, ptiKw) * 0.5 : 0); // 双向叠加惩罚

  result.thermalLoadKW = +(throughPower * thermalFraction).toFixed(2);
  result.thermalLimitKW = +(ratedKw * thermalFraction).toFixed(2);
  result.utilizationPct = result.thermalLimitKW > 0
    ? +((result.thermalLoadKW / result.thermalLimitKW) * 100).toFixed(1)
    : 0;

  if (result.utilizationPct > 100) {
    result.safe = false;
    result.derateRecommendation = +(throughPower - ratedKw * 0.95).toFixed(1);
    result.warnings.push(
      `热功率 ${result.thermalLoadKW}kW 超出齿轮箱散热上限 ${result.thermalLimitKW}kW (${result.utilizationPct}%),存在过热风险`
    );
    result.warnings.push(
      `建议降功率 ${result.derateRecommendation} kW 运行,或升级至上一档齿轮箱`
    );
  } else if (result.utilizationPct > 85) {
    result.warnings.push(
      `热功率接近散热极限 (${result.utilizationPct}%),建议加装独立油冷器或缩短 PTO/PTI 连续运行时间`
    );
  }

  if (modes.pto && modes.pti) {
    result.notes = 'PTO + PTI 同时启用: 双向功率流,散热负载按 1.5 倍累加';
  } else if (modes.pto) {
    result.notes = `PTO 单向取力 ${ptoKw} kW, 热功率占 ${result.utilizationPct}%`;
  } else {
    result.notes = `PTI 单向注入 ${ptiKw} kW, 热功率占 ${result.utilizationPct}%`;
  }

  return result;
}

export default evaluatePTOThermalMargin;
