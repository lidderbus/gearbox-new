// src/utils/couplingTorsionalQuickEstimate.js
// 联轴器扭振 1-DOF 快速估算 — 仅用于表单实时反馈，不替代完整传递矩阵法。
// 工程使用：估算第一阶自然转速 + 与避振区间的裕度。

/**
 * 估算第一阶自然转速 (rpm)
 *   ω = √(k_eq / J_eq)   (rad/s)
 *   n = 60 ω / (2π) = (60/2π) √(k/J)
 *
 * @param {Object} params
 * @param {number} params.couplingTorsionalStiffness - 联轴器扭转刚度 k (kN·m/rad)
 * @param {number} params.flywheelInertia            - 飞轮惯量 J_flywheel (kg·m²)
 * @param {number} [params.shaftEquivalentInertia=0] - 轴系当量惯量 (kg·m²)
 * @param {number} [params.propellerInertia=0]       - 推进器惯量 (kg·m²)
 * @param {number} [params.operatingSpeed]           - 工作转速 (rpm), 用于裕度判定
 * @param {Array<{lo:number, hi:number}>} [params.avoidanceZones=[]] - 避振区间数组
 * @returns {Object} {success, firstNaturalSpeed_rpm, marginPct, withinAvoidanceZone, message}
 */
export const estimateFirstResonance = ({
  couplingTorsionalStiffness,
  flywheelInertia,
  shaftEquivalentInertia = 0,
  propellerInertia = 0,
  operatingSpeed = null,
  avoidanceZones = []
} = {}) => {
  const k = Number(couplingTorsionalStiffness); // kN·m/rad
  const Jf = Number(flywheelInertia);
  const Js = Number(shaftEquivalentInertia) || 0;
  const Jp = Number(propellerInertia) || 0;
  const Jeq = Jf + Js + Jp;

  if (!Number.isFinite(k) || k <= 0) {
    return { success: false, message: '请输入联轴器扭转刚度 k (kN·m/rad)' };
  }
  if (!Number.isFinite(Jeq) || Jeq <= 0) {
    return { success: false, message: '请输入有效的等效惯量 (J_flywheel + J_shaft + J_prop)' };
  }

  // k 单位转换: kN·m/rad → N·m/rad
  const kSi = k * 1000;
  const omega = Math.sqrt(kSi / Jeq); // rad/s
  const firstNaturalSpeed_rpm = (60 * omega) / (2 * Math.PI);

  // 避振裕度判定
  const opS = Number(operatingSpeed);
  let marginPct = null;
  let withinAvoidanceZone = false;
  if (Number.isFinite(opS) && opS > 0) {
    const diff = firstNaturalSpeed_rpm - opS;
    marginPct = Math.abs(diff) / opS * 100;
  }
  if (Array.isArray(avoidanceZones) && avoidanceZones.length) {
    withinAvoidanceZone = avoidanceZones.some(
      z => firstNaturalSpeed_rpm >= z.lo && firstNaturalSpeed_rpm <= z.hi
    );
  }

  return {
    success: true,
    firstNaturalSpeed_rpm: Math.round(firstNaturalSpeed_rpm * 10) / 10,
    Jeq: Math.round(Jeq * 1000) / 1000,
    omega_rad_s: Math.round(omega * 100) / 100,
    marginPct: marginPct == null ? null : Math.round(marginPct * 10) / 10,
    withinAvoidanceZone,
    formula: 'n₁ = (60/2π) × √(k/J_eq)',
    note: '1-DOF 快速估算; 工程用必须复算 (传递矩阵 / 受迫振动)'
  };
};

export default { estimateFirstResonance };
