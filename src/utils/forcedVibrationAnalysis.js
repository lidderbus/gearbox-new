/**
 * 强迫振动分析模块
 *
 * 实现船舶轴系扭振强迫响应计算
 * 包括柴油机激励、螺旋桨激励、复数Holzer直接法
 *
 * v2.0 (2026-04-04) COMPASS校准修正:
 *   - T_mean = 9550 × P / n (N·m, 不×1000)
 *   - 螺旋桨叶片次频率 = z × n_motor / (60 × i) (基于螺旋桨转速)
 *   - 每谐次独立计算复数振幅差→应力→RMS合成 (保留相位信息)
 *   - 螺旋桨阻尼: dp(n) = dp_rated × (n/n_rated) (线性)
 *   - 广义质量: M_r = Σ(J_i × φ_i²) (不再近似为1)
 *   - 移除 PROPELLER_SHAFT_STRESS_FACTOR 经验因子
 *
 * @module forcedVibrationAnalysis
 */

import { calculateModeShape } from './transferMatrixMethod';

// ============================================================
// 物理常量
// ============================================================

/** 钢材剪切模量 G (Pa) */
const STEEL_SHEAR_MODULUS = 8.1e10;

/** 圆周率 */
const PI = Math.PI;

// ============================================================
// 复数算术 (v3.1 复数Holzer直接法)
// ============================================================

/** 精简复数类 — 支持复数Holzer传递矩阵计算 */
class Complex {
  constructor(re, im = 0) { this.re = re; this.im = im; }
  add(b) { return new Complex(this.re + b.re, this.im + b.im); }
  sub(b) { return new Complex(this.re - b.re, this.im - b.im); }
  mul(b) { return new Complex(this.re * b.re - this.im * b.im, this.re * b.im + this.im * b.re); }
  div(b) { const d = b.re * b.re + b.im * b.im; return new Complex((this.re * b.re + this.im * b.im) / d, (this.im * b.re - this.re * b.im) / d); }
  abs() { return Math.sqrt(this.re * this.re + this.im * this.im); }
  neg() { return new Complex(-this.re, -this.im); }
}
const C0 = new Complex(0), C1 = new Complex(1);

/** 2×2复数矩阵乘法 */
function cmul22(A, B) {
  return [
    [A[0][0].mul(B[0][0]).add(A[0][1].mul(B[1][0])), A[0][0].mul(B[0][1]).add(A[0][1].mul(B[1][1]))],
    [A[1][0].mul(B[0][0]).add(A[1][1].mul(B[1][0])), A[1][0].mul(B[0][1]).add(A[1][1].mul(B[1][1]))]
  ];
}

/** 2×2复数矩阵×向量 */
function cmv(M, v) {
  return [M[0][0].mul(v[0]).add(M[0][1].mul(v[1])), M[1][0].mul(v[0]).add(M[1][1].mul(v[1]))];
}

// ============================================================
// 复数Holzer直接法 (v3.1)
// ============================================================

/**
 * 复数Holzer直接法 — 精确频域强迫响应
 *
 * 替代模态叠加法, 无模态截断, 所有阻尼效应精确包含
 * - 联轴器: 复数柔度 c* = c_s(1-jη)/(1+η²)
 * - 螺旋桨: 惯量矩阵附加粘性阻尼 jωdp
 * - 边界: 自由-自由 (T₁=0, Tₙ=0)
 *
 * @param {Object[]} units - 单元数组 (inertia, torsionalFlexibility, type, speedRatio)
 * @param {number} excFreqHz - 激励频率 (Hz)
 * @param {number} excUnitIdx - 激励作用位置 (单元索引)
 * @param {number} excTorque - 激励扭矩幅值 (N·m, 实数)
 * @param {number} couplingEta - 联轴器损耗因子η
 * @param {number} propDampingEquiv - 螺旋桨等效阻尼系数 dp_eq (N·m·s/rad, 已折算到等效系统)
 * @returns {number[]} 各单元角位移振幅的模 (rad)
 */
function solveComplexHolzer(units, excFreqHz, excUnitIdx, excTorque, couplingEta, propDampingEquiv) {
  const n = units.length;
  const omega = 2 * PI * excFreqHz;
  if (omega < 0.01) return new Array(n).fill(0);
  const omega2 = omega * omega;

  // 找螺旋桨单元索引
  let propIdx = n - 1;
  for (let i = n - 1; i >= 0; i--) {
    if (units[i].type === 'propeller') { propIdx = i; break; }
  }

  // 正向扫描: 累积传递矩阵M和激励向量v
  let M = [[C1, C0], [C0, C1]];
  let v = [C0, C0];

  for (let i = 0; i < n; i++) {
    // 惯量矩阵 P = [[1,0],[ω²J + jωdp, 1]]
    let w2J;
    if (i === propIdx && propDampingEquiv > 0) {
      w2J = new Complex(omega2 * units[i].inertia, omega * propDampingEquiv);
    } else {
      w2J = new Complex(omega2 * units[i].inertia);
    }
    const P = [[C1, C0], [w2J, C1]];
    M = cmul22(P, M);
    v = cmv(P, v);

    // 外部激励
    if (i === excUnitIdx) {
      v[1] = v[1].add(new Complex(excTorque));
    }

    // 柔度矩阵 F = [[1, -c*], [0, 1]]
    if (i < n - 1 && units[i].torsionalFlexibility > 0) {
      let cc;
      if (units[i].type === 'coupling' && couplingEta > 0) {
        // 复数柔度: c* = c_s(1-jη)/(1+η²)
        const cs = units[i].torsionalFlexibility * 1e-10;
        const denom = 1 + couplingEta * couplingEta;
        cc = new Complex(cs / denom, -cs * couplingEta / denom);
      } else {
        cc = new Complex(units[i].torsionalFlexibility * 1e-10);
      }
      const F = [[C1, cc.neg()], [C0, C1]];
      M = cmul22(F, M);
      v = cmv(F, v);
    }
  }

  // 边界条件: T₁=0 → θ₁ = -v[1] / M[1][0]
  const th1 = v[1].neg().div(M[1][0]);

  // 反向扫描: 恢复各单元振幅
  const amps = [];
  let th = th1, T = C0;
  for (let i = 0; i < n; i++) {
    amps.push(th.abs());
    let w2J;
    if (i === propIdx && propDampingEquiv > 0) {
      w2J = new Complex(omega2 * units[i].inertia, omega * propDampingEquiv);
    } else {
      w2J = new Complex(omega2 * units[i].inertia);
    }
    T = T.add(w2J.mul(th));
    if (i === excUnitIdx) T = T.add(new Complex(excTorque));
    if (i < n - 1 && units[i].torsionalFlexibility > 0) {
      let cc;
      if (units[i].type === 'coupling' && couplingEta > 0) {
        const cs = units[i].torsionalFlexibility * 1e-10;
        const denom = 1 + couplingEta * couplingEta;
        cc = new Complex(cs / denom, -cs * couplingEta / denom);
      } else {
        cc = new Complex(units[i].torsionalFlexibility * 1e-10);
      }
      th = th.sub(cc.mul(T));
    }
  }

  return amps; // 各单元振幅模值 (rad)
}

// ============================================================
// 柴油机激励谐波数据
// ============================================================

/**
 * 柴油机扭矩谐波系数（相对于平均扭矩的百分比）
 * 数据来源：典型船用柴油机实测数据
 */
export const DIESEL_HARMONIC_COEFFICIENTS = {
  // 四冲程柴油机
  '4-stroke': {
    4: { // 4缸
      0.5: 0.35, 1: 0.25, 1.5: 0.18, 2: 0.45,
      2.5: 0.12, 3: 0.20, 3.5: 0.08, 4: 0.30
    },
    6: { // 6缸
      0.5: 0.30, 1: 0.22, 1.5: 0.15, 2: 0.20,
      3: 0.50, 4.5: 0.12, 6: 0.35
    },
    8: { // 8缸
      0.5: 0.25, 1: 0.18, 2: 0.22, 4: 0.45, 8: 0.30
    },
    12: { // 12缸
      0.5: 0.20, 1: 0.15, 2: 0.18, 3: 0.15,
      6: 0.40, 12: 0.25
    }
  },
  // 二冲程柴油机
  '2-stroke': {
    4: {
      1: 0.40, 2: 0.35, 3: 0.25, 4: 0.45
    },
    6: {
      1: 0.35, 2: 0.30, 3: 0.50, 6: 0.40
    },
    8: {
      1: 0.30, 2: 0.25, 4: 0.45, 8: 0.35
    }
  }
};

/**
 * 电机激励谐波系数 (相对于平均扭矩)
 *
 * 校准基准: COMPASS SRM09 64TEU电池动力集装箱船
 * - 电机功率: 249kW / 1500rpm, 弹性联轴器HGTHT4
 * - 激励阶次: 1, 2, 6, 12 (电磁激励)
 *
 * 注: COMPASS参考资料中 1次0.005, 2次0.003, 6次0.001, 12次0.0005
 */
export const ELECTRIC_MOTOR_HARMONICS = {
  1: 0.005,    // 基波（电磁不平衡）
  2: 0.003,    // 二次
  6: 0.001,    // 六次
  12: 0.0005   // 十二次
};

/**
 * 螺旋桨激励谐波系数
 * 相对于平均推力的百分比
 */
export const PROPELLER_HARMONIC_COEFFICIENTS = {
  3: { // 3叶桨
    3: 0.08, 6: 0.03, 9: 0.01
  },
  4: { // 4叶桨
    4: 0.06, 8: 0.02, 12: 0.008
  },
  5: { // 5叶桨
    5: 0.05, 10: 0.015, 15: 0.005
  },
  6: { // 6叶桨
    6: 0.04, 12: 0.012, 18: 0.004
  }
};

// ============================================================
// 许用应力计算（IACS UR M68 术语: T1=连续, T2=瞬态）
// ============================================================

/**
 * 计算轴的许用扭振应力
 * T1 = 持续运行许用应力 (continuous)
 * T2 = T1 × 1.7 瞬态许用应力 (transient) — IACS UR M68
 *
 * @param {string} shaftType - 轴类型 ('intermediate' | 'propeller')
 * @param {number} tensileStrength - 抗拉强度 Rm (MPa)
 * @param {string} operatingCondition - 运行条件 ('continuous'=T1 | 'transient'=T2)
 * @returns {number} 许用应力 (N/mm²)
 */
export function calculateAllowableStress(shaftType, tensileStrength, operatingCondition = 'continuous') {
  const Rm = tensileStrength;
  let T1; // 持续许用应力

  if (shaftType === 'intermediate') {
    // 中间轴: T1 = 18 + Rm/36
    T1 = 18 + Rm / 36;
  } else if (shaftType === 'propeller') {
    // 螺旋桨轴: T1 = 18 × √(560/(Rm+160)) + Rm/48
    T1 = 18 * Math.sqrt(560 / (Rm + 160)) + Rm / 48;
  } else {
    T1 = 18 + Rm / 36;
  }

  // T2 = T1 × 1.7 (IACS UR M68)
  const TRANSIENT_FACTOR = 1.7;

  if (operatingCondition === 'transient') {
    return T1 * TRANSIENT_FACTOR;
  }

  return T1;
}

/**
 * 计算所有轴的许用应力数据
 *
 * @param {Object} systemInput - 系统输入
 * @returns {Object} 许用应力数据
 */
export function calculateAllAllowableStresses(systemInput) {
  const {
    systemLayout,
    propeller,
    units
  } = systemInput;

  // 中间轴许用应力
  const intermediateStrength = systemLayout?.intermediateShaftTensileStrength || 650;
  const intermediate = {
    continuous: calculateAllowableStress('intermediate', intermediateStrength, 'continuous'),
    transient: calculateAllowableStress('intermediate', intermediateStrength, 'transient')
  };

  // 螺旋桨轴许用应力
  const propellerStrength = propeller?.shaftTensileStrength || 520;
  const propellerShaft = {
    continuous: calculateAllowableStress('propeller', propellerStrength, 'continuous'),
    transient: calculateAllowableStress('propeller', propellerStrength, 'transient')
  };

  return {
    intermediateShaft: intermediate,
    propellerShaft: propellerShaft
  };
}

// ============================================================
// 激励力矩计算
// ============================================================

/**
 * 计算柴油机激励扭矩幅值
 *
 * T_q = T_mean × μ_q
 * T_mean = 9550 × P / n
 *
 * @param {Object} params - 参数
 * @param {number} params.power - 功率 (kW)
 * @param {number} params.speed - 转速 (rpm)
 * @param {number} params.cylinderCount - 气缸数
 * @param {number} params.harmonicOrder - 谐波阶次
 * @param {string} [params.strokeType='4-stroke'] - 冲程类型
 * @returns {number} 激励扭矩幅值 (N·m)
 */
export function calculateDieselExcitationTorque(params) {
  const {
    power,
    speed,
    cylinderCount,
    harmonicOrder,
    strokeType = '4-stroke'
  } = params;

  // 平均扭矩 (N·m): T = 9550 × P(kW) / n(rpm)
  const T_mean = 9550 * power / speed;

  // 获取谐波系数
  const coefficients = DIESEL_HARMONIC_COEFFICIENTS[strokeType]?.[cylinderCount] || {};
  const mu = coefficients[harmonicOrder] || 0.1; // 默认系数

  // 激励扭矩幅值
  return T_mean * mu;
}

/**
 * 计算电机激励扭矩幅值
 *
 * @param {Object} params - 参数
 * @param {number} params.power - 功率 (kW)
 * @param {number} params.speed - 转速 (rpm)
 * @param {number} params.harmonicOrder - 谐波阶次
 * @returns {number} 激励扭矩幅值 (N·m)
 */
export function calculateElectricExcitationTorque(params) {
  const { power, speed, harmonicOrder } = params;

  // 平均扭矩 (N·m): T = 9550 × P(kW) / n(rpm)
  const T_mean = 9550 * power / speed;

  // 获取谐波系数
  const mu = ELECTRIC_MOTOR_HARMONICS[harmonicOrder] || 0.01;

  return T_mean * mu;
}

/**
 * 计算螺旋桨激励扭矩幅值
 *
 * @param {Object} params - 参数
 * @param {number} params.power - 功率 (kW)
 * @param {number} params.speed - 转速 (rpm)
 * @param {number} params.bladeCount - 叶片数
 * @param {number} params.harmonicOrder - 谐波阶次
 * @returns {number} 激励扭矩幅值 (N·m)
 */
export function calculatePropellerExcitationTorque(params) {
  const { power, speed, bladeCount, harmonicOrder } = params;

  // 平均扭矩 (N·m): T = 9550 × P(kW) / n(rpm)
  const T_mean = 9550 * power / speed;

  // 获取谐波系数
  const coefficients = PROPELLER_HARMONIC_COEFFICIENTS[bladeCount] || {};
  const mu = coefficients[harmonicOrder] || 0.02;

  return T_mean * mu;
}

// ============================================================
// 模态阻尼比计算 (v3.0 COMPASS校准改进)
// ============================================================

/** 钢轴基底结构阻尼比 */
const STRUCTURAL_DAMPING_RATIO = 0.005;

/**
 * 模态应变能法计算每阶模态的等效粘性阻尼比
 *
 * v3.0: 替代全局标量dampingRatio=0.02, 实现物理正确的阻尼分配
 *
 * 每阶模态的有效阻尼比 = 结构阻尼 + 联轴器滞后阻尼 + 螺旋桨粘性阻尼
 *   ζ_r = ζ_structural + η × U_coupling / (2 × U_total) + dp × φ_prop² / (2 × ω_n × M_r)
 *
 * @param {Object[]} naturalModes - 自由振动结果 [{omega, modeShape:{amplitudes}}]
 * @param {Object[]} units - 单元数组 [{inertia, torsionalFlexibility, type, unitNumber}]
 * @param {Object[]} elasticCouplings - 联轴器数据 [{unitNumber, dampingCoefficient}]
 * @param {number} propellerDamping - 当前转速的螺旋桨阻尼系数 dp (N·m·s/rad)
 * @returns {number[]} 每阶模态的等效粘性阻尼比
 */
export function calculateModalDampingRatios(naturalModes, units, elasticCouplings = [], propellerDamping = 0) {
  if (!naturalModes || !units || naturalModes.length === 0) return [];

  const n = units.length;

  // 找出联轴器所在单元号 (用于识别联轴器弹性段)
  const couplingUnitNumbers = new Set(
    elasticCouplings.map(c => c.unitNumber).filter(u => u != null)
  );

  // 预计算各弹性段的刚度 (SI: N·m/rad)
  const segmentStiffness = [];
  for (let i = 0; i < n - 1; i++) {
    const c = units[i].torsionalFlexibility;
    if (c > 0) {
      segmentStiffness.push({ idx: i, K: 1 / (c * 1e-10), isCoupling: false });
    }
  }

  // 标记联轴器段
  // Holzer约定: units[i].torsionalFlexibility 是单元i与单元i+1之间的弹性段
  // 联轴器的柔度挂在联轴器质量单元自身上 (即units[coupling_idx].torsionalFlexibility)
  // 因此只需检查拥有柔度的单元(units[seg.idx])是否为联轴器
  for (const seg of segmentStiffness) {
    const ownerUnit = units[seg.idx];
    if (ownerUnit?.type === 'coupling') {
      seg.isCoupling = true;
    } else if (couplingUnitNumbers.has(ownerUnit?.unitNumber)) {
      seg.isCoupling = true;
    }
  }

  // 获取联轴器的滞后损耗因子η
  // 制造商标称的"相对阻尼"ψ = kd/ks (动态/静态刚度比)
  // 损耗因子: η = √(ψ² - 1), 当ψ≤1时退化为η=ψ/2
  // 校准基准: COMPASS SRM09 64TEU, HGTHT4(ψ=1.15→η=0.568)
  const psi = elasticCouplings.reduce((max, c) => {
    const d = c.dampingCoefficient || c.damping || 0;
    return d > max ? d : max;
  }, 0);
  const eta = psi > 1 ? Math.sqrt(psi * psi - 1) : psi / 2;

  // 找螺旋桨单元 (最后一个type=propeller的单元, 或最后一个单元)
  let propellerIdx = n - 1;
  for (let i = n - 1; i >= 0; i--) {
    if (units[i].type === 'propeller') {
      propellerIdx = i;
      break;
    }
  }

  // 对每阶模态计算等效阻尼比
  return naturalModes.map(mode => {
    const omegaN = mode.omega;
    const phi = mode.modeShape?.amplitudes;
    if (!phi || phi.length < 2 || omegaN <= 0) return STRUCTURAL_DAMPING_RATIO;

    // 1. 计算各弹性段应变能
    let U_total = 0;
    let U_coupling = 0;
    for (const seg of segmentStiffness) {
      const i = seg.idx;
      if (i >= phi.length || i + 1 >= phi.length) continue;
      const deltaPhi = phi[i] - phi[i + 1];
      const U = 0.5 * seg.K * deltaPhi * deltaPhi;
      U_total += U;
      if (seg.isCoupling) U_coupling += U;
    }

    // 2. 联轴器阻尼贡献 (模态应变能法)
    let zetaCoupling = 0;
    if (eta > 0 && U_total > 0) {
      zetaCoupling = eta * U_coupling / (2 * U_total);
    }

    // 3. 广义质量 M_r
    let M_r = 0;
    for (let i = 0; i < Math.min(n, phi.length); i++) {
      M_r += (units[i].inertia || 0) * phi[i] * phi[i];
    }
    if (M_r <= 0) M_r = 1;

    // 4. 螺旋桨阻尼贡献 (粘性阻尼转模态阻尼比)
    //    dp 为螺旋桨实际坐标系下的阻尼系数
    //    等效系统中需折算: dp_eq = dp / i² (能量等效)
    //    ζ_prop = dp_eq × φ_prop² / (2 × ω_n × M_r)
    let zetaPropeller = 0;
    if (propellerDamping > 0 && propellerIdx < phi.length) {
      const propellerSpeedRatio = units[propellerIdx].speedRatio || 1;
      const dpEquiv = propellerDamping / (propellerSpeedRatio * propellerSpeedRatio);
      const phiProp = phi[propellerIdx];
      zetaPropeller = dpEquiv * phiProp * phiProp / (2 * omegaN * M_r);
    }

    // 5. 合成
    const zetaTotal = STRUCTURAL_DAMPING_RATIO + zetaCoupling + zetaPropeller;

    // 限制在合理范围内 (防止数值异常)
    return Math.max(0.001, Math.min(zetaTotal, 2.0));
  });
}

// ============================================================
// 强迫振动响应计算
// ============================================================

/**
 * 计算单一激励频率下的强迫振动响应
 * 使用模态叠加法
 *
 * v2.0修正: 广义质量 M_r = Σ(J_i × φ_i²) 替代近似值1
 * v3.0修正: 支持每阶独立模态阻尼比 (联轴器+螺旋桨)
 *
 * @param {Object} params - 参数
 * @param {Object[]} params.naturalModes - 固有振型数据
 * @param {number[]} params.excitationTorques - 各单元激励扭矩 (N·m)
 * @param {number} params.excitationFreq - 激励频率 (Hz)
 * @param {number} params.dampingRatio - 阻尼比 (标量兜底)
 * @param {number[]} [params.dampingRatios] - 每阶模态阻尼比数组 (v3.0, 优先使用)
 * @param {Object[]} [params.units] - 单元数组 (含inertia, 用于广义质量计算)
 * @returns {Object} 响应数据
 */
export function calculateForcedResponse(params) {
  const {
    naturalModes,
    excitationTorques,
    excitationFreq,
    dampingRatio = 0.02,
    dampingRatios = null,
    units = null
  } = params;

  const omegaExc = 2 * PI * excitationFreq;
  const n = excitationTorques.length;

  // 各单元响应振幅
  const responseAmplitudes = new Array(n).fill(0);

  // 模态叠加 (v3.0: 索引遍历, 支持每阶独立阻尼)
  for (let modeIdx = 0; modeIdx < naturalModes.length; modeIdx++) {
    const mode = naturalModes[modeIdx];
    const omegaN = mode.omega;
    const phi = mode.modeShape.amplitudes;

    // 广义质量 M_r = Σ(J_i × φ_i²)
    let M_r = 0;
    if (units && units.length === n) {
      for (let i = 0; i < n; i++) {
        M_r += (units[i].inertia || 0) * phi[i] * phi[i];
      }
    }
    if (M_r <= 0) M_r = 1; // 兼容无units的旧调用

    // 广义力
    let F_r = 0;
    for (let i = 0; i < n; i++) {
      F_r += phi[i] * excitationTorques[i];
    }

    // 频率比
    const r = omegaExc / omegaN;

    // v3.0: 每阶模态独立阻尼比 (联轴器+螺旋桨+结构)
    const zeta = (dampingRatios && dampingRatios[modeIdx] != null)
      ? dampingRatios[modeIdx]
      : dampingRatio;

    // 动力放大系数 (复数形式的模)
    // H(r) = 1 / sqrt((1-r²)² + (2ζr)²)
    const denominator = Math.sqrt(
      Math.pow(1 - r * r, 2) + Math.pow(2 * zeta * r, 2)
    );
    const H = 1 / denominator;

    // 该阶模态的贡献
    const modalResponse = F_r * H / (omegaN * omegaN * M_r);

    // 叠加到各单元
    for (let i = 0; i < n; i++) {
      responseAmplitudes[i] += phi[i] * modalResponse;
    }
  }

  return {
    excitationFreq,
    responseAmplitudes,
    maxAmplitude: Math.max(...responseAmplitudes.map(Math.abs))
  };
}

/**
 * 计算扭振应力
 *
 * τ = T / W_p = 16T / (πd³)
 *
 * @param {number} torque - 振动扭矩 (N·m)
 * @param {number} diameter - 轴外径 (mm)
 * @param {number} [innerDiameter=0] - 轴内径 (mm)
 * @returns {number} 应力 (N/mm² = MPa)
 */
export function calculateTorsionalStress(torque, diameter, innerDiameter = 0) {
  const d = diameter / 1000; // 转换为米
  const di = innerDiameter / 1000;

  // 极截面模数 W_p = π(d⁴-di⁴)/(16d)
  const Wp = PI * (Math.pow(d, 4) - Math.pow(di, 4)) / (16 * d);

  // 应力 (Pa → N/mm²)
  const stress = torque / Wp / 1e6;

  return Math.abs(stress);
}

/**
 * 从振动振幅计算扭矩和应力
 *
 * T = K × Δθ
 * τ = T / W_p
 *
 * @param {number} amplitude1 - 前端振幅 (rad)
 * @param {number} amplitude2 - 后端振幅 (rad)
 * @param {number} stiffness - 扭转刚度 (N·m/rad)
 * @param {number} diameter - 轴外径 (mm)
 * @param {number} [innerDiameter=0] - 轴内径 (mm)
 * @returns {Object} 扭矩和应力
 */
export function calculateStressFromAmplitude(amplitude1, amplitude2, stiffness, diameter, innerDiameter = 0) {
  // 相对角位移
  const deltaTheta = Math.abs(amplitude1 - amplitude2);

  // 振动扭矩
  const torque = stiffness * deltaTheta;

  // 应力
  const stress = calculateTorsionalStress(torque, diameter, innerDiameter);

  return {
    relativeTwist: deltaTheta,
    torque,
    torqueKNm: torque / 1000,
    stress
  };
}

// ============================================================
// 完整强迫振动分析
// ============================================================

/**
 * 执行完整的强迫振动分析
 *
 * @param {Object} systemInput - 系统输入
 * @param {Object} freeVibrationResults - 自由振动结果
 * @returns {Object} 强迫振动分析结果
 */
export function runForcedVibrationAnalysis(systemInput, freeVibrationResults) {
  const {
    units,
    powerSource,
    propeller,
    elasticCouplings = [],
    analysisSettings = {}
  } = systemInput;

  const {
    speedRange = { min: 100, max: 2000 },
    speedStep = 10,
    dampingRatio = 0.02
  } = analysisSettings;

  const { naturalFrequencies } = freeVibrationResults;

  // 确定激励阶次
  const excitationOrders = getExcitationOrders(powerSource, propeller);

  // 许用应力
  const allowableStress = calculateAllAllowableStresses(systemInput);

  // 各转速点的结果
  const combinedResults = [];

  // v3.0/v3.1: 预计算阻尼参数
  const ratedPower = powerSource?.ratedPower || 400;
  const ratedSpeed = powerSource?.ratedSpeed || 1500;

  // 确定齿轮减速比 (提到循环外, 只需计算一次)
  const gearRatio = systemInput.systemLayout?.gearRatio ||
    (units.find(u => u.speedRatio > 1)?.speedRatio) || 1;

  // 额定螺旋桨转速和阻尼
  const ratedPropellerSpeed = ratedSpeed / gearRatio;

  // v3.1: 复数Holzer直接法为可选模式
  // 默认使用模态应变能法 (v3.0, RMSE=0.35, 1500rpm误差-0.3%)
  // 复数Holzer通过analysisSettings.useComplexHolzer=true启用
  // (直接法在共振区峰值偏锐, 适合过共振区研究)
  const hasCouplingDamping = elasticCouplings.some(c =>
    (c.dampingCoefficient || c.damping || 0) > 0
  );
  const useDirectMethod = hasCouplingDamping &&
    (analysisSettings.useComplexHolzer === true);

  // v3.1: 联轴器损耗因子 η = √(ψ² - 1), ψ = 制造商"相对阻尼"(kd/ks)
  let couplingEta = 0;
  if (useDirectMethod) {
    const psi = elasticCouplings.reduce((max, c) => {
      const d = c.dampingCoefficient || c.damping || 0;
      return d > max ? d : max;
    }, 0);
    couplingEta = psi > 1 ? Math.sqrt(psi * psi - 1) : psi / 2;
  }

  // v3.1: 螺旋桨额定阻尼 (Archer法, 折算到等效系统)
  const dpRated = calculatePropellerDampingArcher(ratedPower, ratedPropellerSpeed);
  const dpEqRated = dpRated / (gearRatio * gearRatio);

  for (let speed = speedRange.min; speed <= speedRange.max; speed += speedStep) {
    const speedResult = {
      speed,
      harmonicResults: [],
      intermediateShaftStress: 0,
      propellerShaftStress: 0,
      gearMeshTorques: [],
      couplingTorque: 0,
      massAmplitude: 0
    };

    // v3.1: 当前转速螺旋桨等效阻尼 (线性: dp ∝ n)
    const dpEquiv = dpEqRated * (speed / ratedSpeed);

    // v3.0 fallback: 模态阻尼比 (用于无联轴器的模态叠加法)
    let modalDampingRatios = null;
    if (!useDirectMethod) {
      let dp = 0;
      const propellerSpeed = speed / gearRatio;
      dp = calculatePropellerDampingAtSpeed(ratedPower, ratedPropellerSpeed, propellerSpeed);
      modalDampingRatios = calculateModalDampingRatios(
        naturalFrequencies, units, elasticCouplings, dp
      );
    }

    // 各激励阶次的响应
    for (const order of excitationOrders) {
      // v2.0修正: 螺旋桨激励阶次的频率 = z × n_motor / (60 × i)
      // 电机激励阶次的频率 = q × n_motor / 60
      const isPropellerOrder = propeller?.considerPropellerExcitation &&
        isPropellerHarmonic(order, propeller.bladeCount || 4);
      const excitationFreq = isPropellerOrder
        ? order * speed / (60 * gearRatio)  // 螺旋桨: 基于螺旋桨转速
        : order * speed / 60;               // 电机: 基于电机转速

      // 计算激励扭矩
      const excitationTorques = calculateExcitationTorques(
        units, powerSource, propeller, order, speed
      );

      let response;
      if (useDirectMethod) {
        // v3.1: 复数Holzer直接法 — 精确频域响应, 无模态截断
        // 找激励位置和扭矩幅值
        let excIdx = 0, excT = 0;
        for (let i = 0; i < excitationTorques.length; i++) {
          if (Math.abs(excitationTorques[i]) > Math.abs(excT)) {
            excIdx = i; excT = excitationTorques[i];
          }
        }

        const responseAmplitudes = solveComplexHolzer(
          units, excitationFreq, excIdx, excT, couplingEta, dpEquiv
        );

        response = {
          excitationFreq,
          responseAmplitudes,
          maxAmplitude: Math.max(...responseAmplitudes)
        };
      } else {
        // v3.0 fallback: 模态叠加法 (无联轴器系统)
        response = calculateForcedResponse({
          naturalModes: naturalFrequencies,
          excitationTorques,
          excitationFreq,
          dampingRatios: modalDampingRatios,
          dampingRatio,
          units
        });
      }

      speedResult.harmonicResults.push({
        order,
        excitationFreq,
        response,
        isPropellerOrder
      });
    }

    // 合成响应 (RMS叠加)
    speedResult.massAmplitude = calculateRMSSum(
      speedResult.harmonicResults.map(h => h.response.maxAmplitude)
    );

    // v2.0修正: 每谐次独立计算应力→RMS合成 (保留相位信息)
    const stresses = calculateKeyStressesV2(
      units, speedResult, systemInput
    );

    speedResult.intermediateShaftStress = stresses.intermediateShaft;
    speedResult.propellerShaftStress = stresses.propellerShaft;
    speedResult.gearMeshTorques = stresses.gearMeshTorques;
    speedResult.couplingTorque = stresses.couplingTorque;

    combinedResults.push(speedResult);
  }

  // 生成图表数据
  const chartData = generateChartData(combinedResults, allowableStress);

  // 验证结果
  const verification = verifyResults(combinedResults, allowableStress, speedRange);

  // 识别禁止转速区间 (Barred Speed Ranges)
  const barredSpeedRanges = identifyBarredSpeedRanges(combinedResults, allowableStress, speedStep);

  return {
    combinedResults,
    allowableStress,
    chartData,
    verification,
    excitationOrders,
    barredSpeedRanges,
    timestamp: new Date().toISOString()
  };
}

/**
 * 判断一个激励阶次是否属于螺旋桨谐波
 *
 * @param {number} order - 激励阶次
 * @param {number} bladeCount - 叶片数
 * @returns {boolean}
 */
function isPropellerHarmonic(order, bladeCount) {
  const propCoeffs = PROPELLER_HARMONIC_COEFFICIENTS[bladeCount];
  return propCoeffs ? propCoeffs[order] !== undefined : false;
}

/**
 * 获取激励阶次
 *
 * @param {Object} powerSource - 动力源数据
 * @param {Object} propeller - 螺旋桨数据
 * @returns {number[]} 激励阶次数组
 */
function getExcitationOrders(powerSource, propeller) {
  const orders = new Set();

  // 动力源激励
  if (powerSource?.type === 'diesel') {
    const cylCount = powerSource.cylinderCount || 6;
    const dieselOrders = Object.keys(
      DIESEL_HARMONIC_COEFFICIENTS['4-stroke'][cylCount] || {}
    ).map(Number);
    dieselOrders.forEach(o => orders.add(o));
  } else if (powerSource?.type === 'electric') {
    Object.keys(ELECTRIC_MOTOR_HARMONICS).map(Number).forEach(o => orders.add(o));
  }

  // 螺旋桨激励
  if (propeller?.considerPropellerExcitation) {
    const bladeCount = propeller.bladeCount || 4;
    const propOrders = Object.keys(
      PROPELLER_HARMONIC_COEFFICIENTS[bladeCount] || {}
    ).map(Number);
    propOrders.forEach(o => orders.add(o));
  }

  return Array.from(orders).sort((a, b) => a - b);
}

/**
 * 计算各单元的激励扭矩
 *
 * @param {Object[]} units - 单元数组
 * @param {Object} powerSource - 动力源
 * @param {Object} propeller - 螺旋桨
 * @param {number} order - 激励阶次
 * @param {number} speed - 转速 (rpm)
 * @returns {number[]} 各单元激励扭矩
 */
function calculateExcitationTorques(units, powerSource, propeller, order, speed) {
  const torques = new Array(units.length).fill(0);

  // 动力源激励（作用在第一个单元）
  if (powerSource) {
    const ratedPower = powerSource.ratedPower || 400;
    const ratedSpeed = powerSource.ratedSpeed || 1500;

    if (powerSource.type === 'diesel') {
      // 柴油机: 激励基于额定工况扭矩 (气缸压力谐波与转速无关)
      torques[0] = calculateDieselExcitationTorque({
        power: ratedPower,
        speed: ratedSpeed,
        cylinderCount: powerSource.cylinderCount || 6,
        harmonicOrder: order
      });
    } else if (powerSource.type === 'electric') {
      // v3.0修正: 电机激励基于当前运行扭矩 (电磁谐波与负载成比例)
      // 螺旋桨定律: P(n) = P_rated × (n/n_rated)³
      const powerAtSpeed = ratedPower * Math.pow(speed / ratedSpeed, 3);
      torques[0] = calculateElectricExcitationTorque({
        power: powerAtSpeed,
        speed,
        harmonicOrder: order
      });
    }
  }

  // 螺旋桨激励（作用在最后一个单元）
  // v3.0修正: 螺旋桨定律 P(n) = P_rated × (n/n_rated)³
  // 使用实际功率而非额定功率，否则低速时激励严重高估
  if (propeller?.considerPropellerExcitation) {
    const ratedPower = powerSource?.ratedPower || 400;
    const ratedSpeed = powerSource?.ratedSpeed || 1500;
    const powerAtSpeed = ratedPower * Math.pow(speed / ratedSpeed, 3);
    const propTorque = calculatePropellerExcitationTorque({
      power: powerAtSpeed,
      speed,
      bladeCount: propeller.bladeCount || 4,
      harmonicOrder: order
    });
    torques[torques.length - 1] = propTorque;
  }

  return torques;
}

/**
 * 计算RMS叠加
 *
 * @param {number[]} values - 值数组
 * @returns {number} RMS结果
 */
function calculateRMSSum(values) {
  const sumSquares = values.reduce((sum, v) => sum + v * v, 0);
  return Math.sqrt(sumSquares);
}

/**
 * 计算Holzer表扭矩（用于应力计算）
 *
 * Holzer法：从首质量开始，累积惯性力矩
 * T_i = Σ(ω² × J_j × θ_j), j = 1 to i
 *
 * @param {Object[]} units - 单元数组
 * @param {number} frequency - 固有频率 (Hz)
 * @returns {Object} Holzer表数据
 */
function calculateHolzerTorques(units, frequency) {
  const omega = 2 * PI * frequency;
  const omega2 = omega * omega;
  const n = units.length;

  let theta = 1.0;  // 初始振幅（归一化）
  let T = 0;

  const amplitudes = [theta];
  const torques = [];

  for (let i = 0; i < n; i++) {
    const unit = units[i];
    const J = unit.inertia;

    // 惯性力矩: ω² × J × θ
    const inertiaT = omega2 * J * theta;
    T = T + inertiaT;

    // 记录该段后的累积扭矩
    torques.push(T);

    // 角位移变化
    if (i < n - 1 && unit.torsionalFlexibility > 0) {
      const c = unit.torsionalFlexibility * 1e-10;
      theta = theta - c * T;
      amplitudes.push(theta);
    } else if (i < n - 1) {
      amplitudes.push(theta);
    }
  }

  return { amplitudes, torques, frequency };
}

/**
 * 计算关键轴段应力
 *
 * 方法：Holzer扭矩法（COMPASS标准方法）
 * 1. 使用各阶固有频率计算Holzer表（单位振幅）
 * 2. 用强迫振动响应振幅缩放Holzer扭矩
 * 3. 计算应力 τ = T / Wp = 16T / (π(d⁴-di⁴)/d)
 *
 * @param {Object[]} units - 单元数组
 * @param {Object} speedResult - 转速点结果
 * @param {Object[]} naturalFrequencies - 固有频率数据
 * @param {Object} systemInput - 系统输入
 * @returns {Object} 应力数据
 */
function calculateKeyStresses(units, speedResult, naturalFrequencies, systemInput) {
  const n = units.length;

  // 从各谐波响应中获取各单元振幅，进行RMS叠加
  const unitAmplitudes = new Array(n).fill(0);

  for (const harmonic of speedResult.harmonicResults) {
    if (harmonic.response && harmonic.response.responseAmplitudes) {
      const respAmp = harmonic.response.responseAmplitudes;
      for (let i = 0; i < Math.min(n, respAmp.length); i++) {
        unitAmplitudes[i] = Math.sqrt(unitAmplitudes[i] ** 2 + respAmp[i] ** 2);
      }
    }
  }

  // 取首质量振幅作为缩放因子
  const amplitudeScale = unitAmplitudes[0] || 1e-5;

  // 找到中间轴和螺旋桨轴位置
  let intermediateIdx = units.findIndex(u =>
    u.type === 'shaft' && (u.name?.includes('中间') || u.name?.includes('I.S.'))
  );
  if (intermediateIdx < 0) {
    intermediateIdx = units.findIndex(u => u.type === 'shaft');
  }
  if (intermediateIdx < 0) intermediateIdx = Math.min(2, n - 1);

  let propellerIdx = units.findIndex(u =>
    u.type === 'shaft' && (u.name?.includes('艉') || u.name?.includes('P.S.') || u.name?.includes('螺旋桨'))
  );
  if (propellerIdx < 0) {
    // 查找最后一个shaft类型
    for (let i = n - 1; i >= 0; i--) {
      if (units[i].type === 'shaft') {
        propellerIdx = i;
        break;
      }
    }
  }
  if (propellerIdx < 0) propellerIdx = Math.max(0, n - 2);

  const intermediateUnit = units[intermediateIdx];
  const propellerUnit = units[propellerIdx];

  // 使用主模态（1阶）计算Holzer扭矩
  const firstModeFreq = naturalFrequencies[0]?.frequency ||
    (naturalFrequencies[0]?.omega ? naturalFrequencies[0].omega / (2 * PI) : 20);
  const holzer = calculateHolzerTorques(units, firstModeFreq);

  // 计算中间轴应力
  const holzerT_intermediate = holzer.torques[intermediateIdx] || 0;
  const intermediateD = intermediateUnit?.outerDiameter || 60;
  const intermediateInnerD = intermediateUnit?.innerDiameter || 0;

  // 缩放Holzer扭矩
  const scaledT_intermediate = holzerT_intermediate * amplitudeScale;
  const intermediateStress = calculateTorsionalStress(
    scaledT_intermediate, intermediateD, intermediateInnerD
  );

  // 计算螺旋桨轴应力
  const holzerT_propeller = holzer.torques[propellerIdx] || 0;
  const propellerD = propellerUnit?.outerDiameter || 90;
  const propellerInnerD = propellerUnit?.innerDiameter || 0;

  // 螺旋桨轴振幅通常更大，使用该位置振幅
  // 注: v2.0已不再使用此方法,保留向后兼容
  const propellerScale = unitAmplitudes[propellerIdx] || amplitudeScale;
  const scaledT_propeller = holzerT_propeller * propellerScale;
  const propellerStress = calculateTorsionalStress(
    scaledT_propeller, propellerD, propellerInnerD
  );

  // 计算齿轮啮合扭矩
  const gearMeshTorques = calculateGearMeshTorques(
    units, unitAmplitudes, systemInput.gearMeshes
  );

  // 计算联轴器扭矩
  const couplingTorque = calculateCouplingTorque(
    units, unitAmplitudes, systemInput.elasticCouplings
  );

  return {
    intermediateShaft: intermediateStress,
    propellerShaft: propellerStress,
    intermediateShaftTorque: scaledT_intermediate / 1000,
    propellerShaftTorque: scaledT_propeller / 1000,
    gearMeshTorques,
    couplingTorque,
    // 调试信息
    _debug: {
      holzerT_intermediate,
      holzerT_propeller,
      amplitudeScale,
      propellerScale,
      intermediateIdx,
      propellerIdx
    }
  };
}

/**
 * v2.0: 每谐次独立计算应力, 然后RMS合成
 *
 * COMPASS方法:
 *   1. 对每个激励阶次, 模态叠加得到各质量响应振幅
 *   2. 用相邻质量的振幅差 × 刚度 = 该谐次的扭矩
 *   3. 扭矩 / Wp = 该谐次应力
 *   4. RMS合成所有谐次应力 → 合成应力
 *
 * 关键: 不能先对振幅RMS再算应力(丢失相位信息), 必须先算应力再RMS
 *
 * @param {Object[]} units - 单元数组
 * @param {Object} speedResult - 含 harmonicResults 的转速点结果
 * @param {Object} systemInput - 系统输入
 * @returns {Object} 应力数据
 */
function calculateKeyStressesV2(units, speedResult, systemInput) {
  const n = units.length;
  const gearRatio = systemInput.systemLayout?.gearRatio ||
    (units.find(u => u.speedRatio > 1)?.speedRatio) || 1;

  // 找中间轴和螺旋桨轴位置
  let intermediateIdx = findShaftIndex(units, 'intermediate');
  let propellerIdx = findShaftIndex(units, 'propeller');

  // 每个轴段: 收集各谐次的应力
  const shaftSegments = [];
  for (let i = 0; i < n - 1; i++) {
    if (units[i].torsionalFlexibility > 0) {
      const K = 1 / (units[i].torsionalFlexibility * 1e-10);
      const isLowSpeed = (units[i + 1].speedRatio || 1) > 1;
      const ratio = isLowSpeed ? (units[i + 1].speedRatio || 1) : 1;
      const d = units[i + 1].outerDiameter || units[i].outerDiameter || 0;
      const di = units[i + 1].innerDiameter || units[i].innerDiameter || 0;
      shaftSegments.push({ idx: i, K, ratio, d, di, stresses: [] });
    }
  }

  // 对每个谐次, 独立计算各轴段应力
  for (const harmonic of speedResult.harmonicResults) {
    if (!harmonic.response?.responseAmplitudes) continue;
    const amp = harmonic.response.responseAmplitudes;

    for (const seg of shaftSegments) {
      const i = seg.idx;
      if (i >= amp.length || i + 1 >= amp.length) {
        seg.stresses.push(0);
        continue;
      }

      // 振幅差 × 刚度 = 等效扭矩
      const deltaTheta = Math.abs(amp[i] - amp[i + 1]);
      const T_eq = seg.K * deltaTheta;

      // 低速侧需速比换算: T_real = T_eq × i
      const T_real = T_eq * seg.ratio;

      // 应力 = T_real / Wp
      if (seg.d > 0) {
        const stress = calculateTorsionalStress(T_real, seg.d, seg.di);
        seg.stresses.push(stress);
      } else {
        seg.stresses.push(0);
      }
    }
  }

  // RMS合成各谐次应力
  for (const seg of shaftSegments) {
    seg.rmsStress = Math.sqrt(seg.stresses.reduce((s, v) => s + v * v, 0));
  }

  // 提取中间轴和螺旋桨轴应力
  let intermediateStress = 0;
  let propellerStress = 0;

  // 中间轴: 找柔度段索引匹配中间轴位置
  const isSeg = shaftSegments.find(s => s.idx === intermediateIdx || s.idx === intermediateIdx - 1);
  if (isSeg) intermediateStress = isSeg.rmsStress;

  // 螺旋桨轴: 找最后的有直径轴段
  const psSeg = shaftSegments.find(s => s.idx === propellerIdx || s.idx === propellerIdx - 1);
  if (psSeg) propellerStress = psSeg.rmsStress;

  // 如果没有精确匹配, 用位置推断
  if (intermediateStress === 0 && shaftSegments.length > 0) {
    // 低速侧第一个有直径的轴段
    const lowSpeedSegs = shaftSegments.filter(s => s.ratio > 1 && s.d > 0);
    if (lowSpeedSegs.length > 0) intermediateStress = lowSpeedSegs[0].rmsStress;
  }
  if (propellerStress === 0 && shaftSegments.length > 0) {
    const lowSpeedSegs = shaftSegments.filter(s => s.ratio > 1 && s.d > 0);
    if (lowSpeedSegs.length > 1) propellerStress = lowSpeedSegs[lowSpeedSegs.length - 1].rmsStress;
    else if (lowSpeedSegs.length === 1 && intermediateStress > 0) propellerStress = lowSpeedSegs[0].rmsStress;
  }

  // 齿轮和联轴器扭矩 (同样逐谐次RMS)
  const gearMeshTorques = calculateGearMeshTorquesV2(units, speedResult.harmonicResults);
  const couplingTorque = calculateCouplingTorqueV2(units, speedResult.harmonicResults);

  return {
    intermediateShaft: intermediateStress,
    propellerShaft: propellerStress,
    gearMeshTorques,
    couplingTorque,
    _shaftSegments: shaftSegments
  };
}

/**
 * 查找轴段索引
 */
function findShaftIndex(units, type) {
  const n = units.length;
  if (type === 'intermediate') {
    let idx = units.findIndex(u =>
      u.type === 'shaft' && (u.name?.includes('中间') || u.name?.includes('I.S.'))
    );
    if (idx < 0) idx = units.findIndex(u => u.type === 'shaft');
    if (idx < 0) idx = Math.min(2, n - 1);
    return idx;
  }
  if (type === 'propeller') {
    let idx = -1;
    for (let i = n - 1; i >= 0; i--) {
      if (units[i].type === 'shaft' && (
        units[i].name?.includes('艉') || units[i].name?.includes('P.S.') ||
        units[i].name?.includes('螺旋桨')
      )) { idx = i; break; }
    }
    if (idx < 0) {
      for (let i = n - 1; i >= 0; i--) {
        if (units[i].type === 'shaft') { idx = i; break; }
      }
    }
    if (idx < 0) idx = Math.max(0, n - 2);
    return idx;
  }
  return 0;
}

/**
 * v2.0: 齿轮扭矩 - 逐谐次RMS
 */
function calculateGearMeshTorquesV2(units, harmonicResults) {
  const gearUnits = units
    .map((u, idx) => ({ ...u, idx }))
    .filter(u => u.type === 'gear');

  if (gearUnits.length < 2) return [];

  const torques = [];
  for (let g = 0; g < gearUnits.length - 1; g += 2) {
    const driving = gearUnits[g];
    const driven = gearUnits[g + 1];

    const stiffness = driving.torsionalFlexibility
      ? 1 / (driving.torsionalFlexibility * 1e-10)
      : 1e7;

    let sumSq = 0;
    for (const h of harmonicResults) {
      if (!h.response?.responseAmplitudes) continue;
      const amp = h.response.responseAmplitudes;
      const dTh = Math.abs((amp[driving.idx] || 0) - (amp[driven.idx] || 0));
      const ratio = (driven.speedRatio || 1) > 1 ? (driven.speedRatio || 1) : 1;
      const t = stiffness * dTh * ratio / 1000;
      sumSq += t * t;
    }
    torques.push(Math.sqrt(sumSq));
  }
  return torques;
}

/**
 * v2.0: 联轴器扭矩 - 逐谐次RMS
 */
function calculateCouplingTorqueV2(units, harmonicResults) {
  const couplingUnits = units
    .map((u, idx) => ({ ...u, idx }))
    .filter(u => u.type === 'coupling');

  if (couplingUnits.length === 0) return 0;

  let maxRmsTorque = 0;
  for (const coupling of couplingUnits) {
    const idx = coupling.idx;
    const stiffness = coupling.torsionalFlexibility
      ? 1 / (coupling.torsionalFlexibility * 1e-10)
      : 5e5;

    let sumSq = 0;
    for (const h of harmonicResults) {
      if (!h.response?.responseAmplitudes) continue;
      const amp = h.response.responseAmplitudes;
      if (idx > 0 && idx < amp.length) {
        const dTh = Math.abs(amp[idx] - amp[idx - 1]);
        const t = stiffness * dTh / 1000;
        sumSq += t * t;
      }
    }
    maxRmsTorque = Math.max(maxRmsTorque, Math.sqrt(sumSq));
  }
  return maxRmsTorque;
}

/**
 * 计算齿轮啮合扭矩 (旧版, 保留兼容)
 *
 * @param {Object[]} units - 单元数组
 * @param {number[]} amplitudes - 各单元振幅
 * @param {Object[]} gearMeshes - 齿轮啮合数据
 * @returns {number[]} 各啮合处扭矩 (kN·m)
 */
function calculateGearMeshTorques(units, amplitudes, gearMeshes = []) {
  if (!gearMeshes || gearMeshes.length === 0) {
    // 自动检测齿轮单元
    const gearUnits = units
      .map((u, idx) => ({ ...u, idx }))
      .filter(u => u.type === 'gear');

    if (gearUnits.length < 2) return [];

    const torques = [];
    for (let i = 0; i < gearUnits.length - 1; i += 2) {
      const driving = gearUnits[i];
      const driven = gearUnits[i + 1];

      // 使用齿轮的刚度计算扭矩
      const stiffness = driving.torsionalFlexibility
        ? 1 / (driving.torsionalFlexibility * 1e-10)
        : 1e7; // 默认刚性齿轮

      const deltaTheta = Math.abs(
        (amplitudes[driving.idx] || 0) - (amplitudes[driven.idx] || 0)
      );
      const torque = stiffness * deltaTheta / 1000; // kN·m
      torques.push(torque);
    }
    return torques;
  }

  // 使用提供的齿轮啮合数据
  return gearMeshes.map(mesh => {
    const drivingAmp = amplitudes[mesh.drivingUnit - 1] || 0;
    const drivenAmp = amplitudes[mesh.drivenUnit - 1] || 0;
    const stiffness = mesh.meshStiffness || 1e7;
    const deltaTheta = Math.abs(drivingAmp - drivenAmp / mesh.ratio);
    return stiffness * deltaTheta / 1000; // kN·m
  });
}

/**
 * 计算联轴器扭矩
 *
 * @param {Object[]} units - 单元数组
 * @param {number[]} amplitudes - 各单元振幅
 * @param {Object[]} elasticCouplings - 弹性联轴器数据
 * @returns {number} 最大联轴器扭矩 (kN·m)
 */
function calculateCouplingTorque(units, amplitudes, elasticCouplings = []) {
  if (!elasticCouplings || elasticCouplings.length === 0) {
    // 自动检测联轴器单元
    const couplingUnits = units
      .map((u, idx) => ({ ...u, idx }))
      .filter(u => u.type === 'coupling');

    if (couplingUnits.length === 0) return 0;

    let maxTorque = 0;
    for (const coupling of couplingUnits) {
      const idx = coupling.idx;
      if (idx > 0 && idx < amplitudes.length) {
        // 联轴器刚度（从柔度计算）
        const stiffness = coupling.torsionalFlexibility
          ? 1 / (coupling.torsionalFlexibility * 1e-10)
          : 5e5; // 默认弹性联轴器刚度

        const deltaTheta = Math.abs(amplitudes[idx] - amplitudes[idx - 1]);
        const torque = stiffness * deltaTheta / 1000; // kN·m
        maxTorque = Math.max(maxTorque, torque);
      }
    }
    return maxTorque;
  }

  // 使用提供的联轴器数据
  let maxTorque = 0;
  for (const coupling of elasticCouplings) {
    const unitIdx = coupling.unitNumber - 1;
    if (unitIdx > 0 && unitIdx < amplitudes.length) {
      const stiffness = coupling.torsionalStiffness || 5e5;
      const deltaTheta = Math.abs(amplitudes[unitIdx] - amplitudes[unitIdx - 1]);
      const torque = stiffness * deltaTheta / 1000; // kN·m
      maxTorque = Math.max(maxTorque, torque);
    }
  }
  return maxTorque;
}

/**
 * 生成图表数据
 *
 * @param {Object[]} combinedResults - 合成结果
 * @param {Object} allowableStress - 许用应力
 * @returns {Object} 图表数据
 */
function generateChartData(combinedResults, allowableStress) {
  const speeds = combinedResults.map(r => r.speed);

  return {
    stressVsSpeed: {
      intermediateShaft: {
        speeds,
        stresses: combinedResults.map(r => r.intermediateShaftStress),
        allowableContinuous: allowableStress.intermediateShaft.continuous,
        allowableTransient: allowableStress.intermediateShaft.transient
      },
      propellerShaft: {
        speeds,
        stresses: combinedResults.map(r => r.propellerShaftStress),
        allowableContinuous: allowableStress.propellerShaft.continuous,
        allowableTransient: allowableStress.propellerShaft.transient
      }
    },
    torqueVsSpeed: {
      gearMeshes: [],
      elasticCouplings: combinedResults.map(r => ({
        speed: r.speed,
        torque: r.couplingTorque
      }))
    },
    amplitudeVsSpeed: {
      speeds,
      amplitudes: combinedResults.map(r => r.massAmplitude)
    }
  };
}

/**
 * 验证分析结果
 *
 * @param {Object[]} combinedResults - 合成结果
 * @param {Object} allowableStress - 许用应力
 * @param {Object} speedRange - 转速范围
 * @returns {Object} 验证结果
 */
function verifyResults(combinedResults, allowableStress, speedRange) {
  // 找最大应力
  let maxIntermediateStress = 0;
  let maxIntermediateSpeed = 0;
  let maxPropellerStress = 0;
  let maxPropellerSpeed = 0;

  for (const result of combinedResults) {
    if (result.intermediateShaftStress > maxIntermediateStress) {
      maxIntermediateStress = result.intermediateShaftStress;
      maxIntermediateSpeed = result.speed;
    }
    if (result.propellerShaftStress > maxPropellerStress) {
      maxPropellerStress = result.propellerShaftStress;
      maxPropellerSpeed = result.speed;
    }
  }

  // 检查是否超过许用值
  const intermediateOK = maxIntermediateStress <= allowableStress.intermediateShaft.continuous;
  const propellerOK = maxPropellerStress <= allowableStress.propellerShaft.continuous;

  const warnings = [];
  const recommendations = [];

  if (!intermediateOK) {
    warnings.push(`中间轴最大应力 ${maxIntermediateStress.toFixed(3)} N/mm² 超过许用值 ${allowableStress.intermediateShaft.continuous.toFixed(1)} N/mm²`);
    recommendations.push('建议增加中间轴直径或调整轴系刚度');
  }

  if (!propellerOK) {
    warnings.push(`螺旋桨轴最大应力 ${maxPropellerStress.toFixed(3)} N/mm² 超过许用值 ${allowableStress.propellerShaft.continuous.toFixed(1)} N/mm²`);
    recommendations.push('建议增加螺旋桨轴直径或添加减振措施');
  }

  return {
    isValid: intermediateOK && propellerOK,
    maxIntermediateStress,
    maxIntermediateSpeed,
    maxPropellerStress,
    maxPropellerSpeed,
    intermediateMargin: allowableStress.intermediateShaft.continuous - maxIntermediateStress,
    propellerMargin: allowableStress.propellerShaft.continuous - maxPropellerStress,
    warnings,
    recommendations
  };
}

// ============================================================
// T1/T2 许用应力 (IACS UR M68 术语)
// ============================================================

/**
 * 计算T1 (连续许用应力) 和 T2 (瞬态许用应力)
 * 对齐 IACS UR M68 标准术语:
 *   T1 = τ_c (continuous allowable)
 *   T2 = T1 × 1.7 (transient allowable)
 *
 * @param {string} shaftType - 'intermediate' | 'propeller'
 * @param {number} tensileStrength - Rm (MPa)
 * @returns {{ T1: number, T2: number }}
 */
export function calculateT1T2(shaftType, tensileStrength) {
  const T1 = calculateAllowableStress(shaftType, tensileStrength, 'continuous');
  const T2 = T1 * 1.7;
  return { T1, T2 };
}

// ============================================================
// 禁止转速区间识别
// ============================================================

/**
 * 扫描全转速范围，找出应力超过T1的转速区间
 *
 * @param {Object[]} combinedResults - runForcedVibrationAnalysis().combinedResults
 * @param {Object} allowableStress - 许用应力
 * @param {string} shaftKey - 'intermediateShaftStress' | 'propellerShaftStress'
 * @param {number} allowableValue - T1许用值
 * @returns {Array<{start: number, end: number, maxStress: number}>}
 */
/**
 * 识别禁止转速区间 (Barred Speed Ranges)
 * 扫描全转速范围，找出应力超过T1的转速区间
 *
 * @param {Object[]} combinedResults - 各转速点分析结果
 * @param {Object} allowableStress - 许用应力 {intermediateShaft:{continuous}, propellerShaft:{continuous}}
 * @param {number} speedStep - 转速步长(用于区间扩展)
 * @returns {Object[]} barredSpeedRanges [{min, max, shaftType, maxStress}]
 */
export function identifyBarredSpeedRanges(combinedResults, allowableStress, speedStep = 10) {
  if (!combinedResults || !allowableStress) return [];
  const ranges = [];
  let currentRange = null;

  for (const result of combinedResults) {
    const intLimit = allowableStress.intermediateShaft?.continuous || 999;
    const propLimit = allowableStress.propellerShaft?.continuous || 999;
    const intExceeded = (result.intermediateShaftStress || 0) > intLimit;
    const propExceeded = (result.propellerShaftStress || 0) > propLimit;
    const exceeded = intExceeded || propExceeded;

    if (exceeded && !currentRange) {
      currentRange = {
        min: Math.max(result.speed - speedStep, 0),
        max: result.speed,
        shaftType: intExceeded ? 'intermediate' : 'propeller',
        maxStress: Math.max(result.intermediateShaftStress || 0, result.propellerShaftStress || 0)
      };
    } else if (exceeded && currentRange) {
      currentRange.max = result.speed;
      currentRange.maxStress = Math.max(currentRange.maxStress,
        result.intermediateShaftStress || 0, result.propellerShaftStress || 0);
    } else if (!exceeded && currentRange) {
      currentRange.max += speedStep;
      ranges.push(currentRange);
      currentRange = null;
    }
  }
  if (currentRange) ranges.push(currentRange);
  return ranges;
}

// ============================================================
// 螺旋桨阻尼计算
// ============================================================

/**
 * Archer法螺旋桨阻尼 (额定工况)
 * dp_rated = P_rated / (2π × n_rated²)
 *
 * 注: 实际工况阻尼 dp(n) = dp_rated × (n/n_rated)
 * 因为 P(n) = P_rated × (n/n_rated)³ (螺旋桨定律)
 * 代入 dp = P/(2πn²) 得 dp(n) = dp_rated × (n/n_rated)
 *
 * @param {number} power - 额定功率 (kW)
 * @param {number} speed - 额定转速 (rpm)
 * @returns {number} 额定阻尼系数 (N·m·s/rad)
 */
export function calculatePropellerDampingArcher(power, speed) {
  if (speed <= 0) return 0;
  const P_watts = power * 1000;
  const n_rps = speed / 60;
  return P_watts / (2 * Math.PI * n_rps * n_rps);
}

/**
 * 计算指定转速下的螺旋桨阻尼 (线性模型)
 * dp(n) = dp_rated × (n / n_rated)
 *
 * @param {number} ratedPower - 额定功率 (kW)
 * @param {number} ratedSpeed - 额定转速 (rpm)
 * @param {number} actualSpeed - 实际转速 (rpm)
 * @returns {number} 实际阻尼系数 (N·m·s/rad)
 */
export function calculatePropellerDampingAtSpeed(ratedPower, ratedSpeed, actualSpeed) {
  if (ratedSpeed <= 0 || actualSpeed <= 0) return 0;
  const dpRated = calculatePropellerDampingArcher(ratedPower, ratedSpeed);
  return dpRated * (actualSpeed / ratedSpeed);
}

/**
 * Schwaneke经验法螺旋桨阻尼
 * dp = 0.6 × P / (2π × n²)  (经验修正系数0.6)
 *
 * @param {number} power - 功率 (kW)
 * @param {number} speed - 转速 (rpm)
 * @returns {number} 阻尼系数 (N·m·s/rad)
 */
export function calculatePropellerDampingSchwaneke(power, speed) {
  return 0.6 * calculatePropellerDampingArcher(power, speed);
}

/**
 * 计算螺旋桨阻尼 (统一入口)
 * @param {number} power - 功率 (kW)
 * @param {number} speed - 转速 (rpm)
 * @param {'Archer'|'Schwaneke'} method - 计算方法
 * @returns {number} 阻尼系数
 */
export function calculatePropellerDamping(power, speed, method = 'Archer') {
  if (method === 'Schwaneke') return calculatePropellerDampingSchwaneke(power, speed);
  return calculatePropellerDampingArcher(power, speed);
}

// ============================================================
// 导出
// ============================================================

export default {
  DIESEL_HARMONIC_COEFFICIENTS,
  ELECTRIC_MOTOR_HARMONICS,
  PROPELLER_HARMONIC_COEFFICIENTS,
  calculateAllowableStress,
  calculateAllAllowableStresses,
  calculateT1T2,
  calculateDieselExcitationTorque,
  calculateElectricExcitationTorque,
  calculatePropellerExcitationTorque,
  calculateForcedResponse,
  calculateTorsionalStress,
  calculateStressFromAmplitude,
  runForcedVibrationAnalysis,
  identifyBarredSpeedRanges,
  calculatePropellerDamping,
  calculatePropellerDampingArcher,
  calculatePropellerDampingSchwaneke,
  calculatePropellerDampingAtSpeed
};
