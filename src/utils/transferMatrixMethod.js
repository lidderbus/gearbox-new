/**
 * 传递矩阵法扭振计算模块
 *
 * 基于Holzer-Myklestad方法实现多自由度轴系扭振分析
 * 支持多分支系统（双机、多机）
 *
 * @module transferMatrixMethod
 */

// ============================================================
// 物理常量
// ============================================================

/** 钢材剪切模量 G (Pa) */
export const STEEL_SHEAR_MODULUS = 8.1e10;

/** 圆周率 */
const PI = Math.PI;

// ============================================================
// 数据结构定义
// ============================================================

/**
 * @typedef {Object} TorsionalUnit - 轴系单元
 * @property {number} unitNumber - 单元编号
 * @property {string} name - 单元名称
 * @property {string} type - 类型 ('motor'|'gear'|'shaft'|'propeller'|'coupling')
 * @property {number} speedRatio - 速比（相对于参考轴）
 * @property {number} inertia - 转动惯量 J (kg·m²)
 * @property {number} torsionalFlexibility - 扭转柔度 c (×10⁻¹⁰ rad/N·m)
 * @property {number} outerDiameter - 外径 (mm)
 * @property {number} innerDiameter - 内径 (mm)
 * @property {number} [dampingCoeff] - 阻尼系数
 */

/**
 * @typedef {Object} BranchConnection - 分支连接点
 * @property {number} branchId - 分支ID
 * @property {number[]} units - 分支上的单元编号
 * @property {number} connectionPoint - 连接到主轴的单元
 * @property {number} speedRatio - 相对于主轴的速比
 */

/**
 * @typedef {Object} GearMesh - 齿轮啮合
 * @property {number} meshLevel - 啮合级数
 * @property {number} drivingUnit - 主动单元
 * @property {number} drivenUnit - 从动单元
 * @property {number} ratio - 传动比
 * @property {number} [meshStiffness] - 啮合刚度 (N·m/rad), 0表示刚性
 */

/**
 * @typedef {Object} NaturalFrequencyResult - 固有频率结果
 * @property {number} order - 阶次 (1, 2, 3...)
 * @property {number} frequency - 频率 (Hz)
 * @property {number} frequencyRpm - 频率 (1/min)
 * @property {number} omega - 角频率 (rad/s)
 * @property {Object} modeShape - 振型数据
 * @property {number[]} modeShape.amplitudes - 各单元相对振幅
 * @property {number[]} modeShape.torques - 各轴段振动扭矩 (kN·m)
 */

// ============================================================
// 矩阵运算工具函数
// ============================================================

/**
 * 2x2矩阵乘法
 * @param {number[][]} A - 矩阵A
 * @param {number[][]} B - 矩阵B
 * @returns {number[][]} 结果矩阵
 */
function multiplyMatrix2x2(A, B) {
  return [
    [
      A[0][0] * B[0][0] + A[0][1] * B[1][0],
      A[0][0] * B[0][1] + A[0][1] * B[1][1]
    ],
    [
      A[1][0] * B[0][0] + A[1][1] * B[1][0],
      A[1][0] * B[0][1] + A[1][1] * B[1][1]
    ]
  ];
}

/**
 * 2x2单位矩阵
 * @returns {number[][]} 单位矩阵
 */
function identityMatrix2x2() {
  return [[1, 0], [0, 1]];
}

/**
 * 矩阵与向量乘法
 * @param {number[][]} M - 2x2矩阵
 * @param {number[]} v - 2元向量
 * @returns {number[]} 结果向量
 */
function multiplyMatrixVector(M, v) {
  return [
    M[0][0] * v[0] + M[0][1] * v[1],
    M[1][0] * v[0] + M[1][1] * v[1]
  ];
}

// ============================================================
// 传递矩阵构建
// ============================================================

/**
 * 构建惯量点矩阵 P_i
 *
 * P_i = [1, 0; ω²J_i, 1]
 *
 * @param {number} J - 转动惯量 (kg·m²)
 * @param {number} omega - 角频率 (rad/s)
 * @returns {number[][]} 惯量点矩阵
 */
export function buildInertiaMatrix(J, omega) {
  const omega2J = omega * omega * J;
  return [
    [1, 0],
    [omega2J, 1]
  ];
}

/**
 * 构建柔度场矩阵 F_i
 *
 * F_i = [1, -c_i; 0, 1]
 *
 * @param {number} c - 扭转柔度 (rad/N·m)
 * @returns {number[][]} 柔度场矩阵
 */
export function buildFlexibilityMatrix(c) {
  return [
    [1, -c],
    [0, 1]
  ];
}

/**
 * 构建齿轮速比变换矩阵
 *
 * G = [1/i, 0; 0, i]
 *
 * @param {number} ratio - 传动比 (从动/主动)
 * @returns {number[][]} 速比变换矩阵
 */
export function buildGearRatioMatrix(ratio) {
  return [
    [1 / ratio, 0],
    [0, ratio]
  ];
}

// ============================================================
// 单分支传递矩阵求解
// ============================================================

/**
 * 计算单分支系统的总传递矩阵
 *
 * @param {TorsionalUnit[]} units - 单元数组（按顺序排列）
 * @param {number} omega - 角频率 (rad/s)
 * @returns {number[][]} 总传递矩阵
 */
export function calculateTotalTransferMatrix(units, omega) {
  let totalMatrix = identityMatrix2x2();

  for (let i = 0; i < units.length; i++) {
    const unit = units[i];

    // 惯量点矩阵
    const P = buildInertiaMatrix(unit.inertia, omega);
    totalMatrix = multiplyMatrix2x2(P, totalMatrix);

    // 柔度场矩阵（最后一个单元后无柔度）
    if (i < units.length - 1 && unit.torsionalFlexibility > 0) {
      // 柔度单位转换: ×10⁻¹⁰ rad/N·m → rad/N·m
      const c = unit.torsionalFlexibility * 1e-10;
      const F = buildFlexibilityMatrix(c);
      totalMatrix = multiplyMatrix2x2(F, totalMatrix);
    }
  }

  return totalMatrix;
}

/**
 * 计算残差扭矩（用于求解固有频率）
 *
 * 边界条件：θ₁ = 1, T₁ = 0 (自由端)
 * 残差：T_n (应为0)
 *
 * @param {TorsionalUnit[]} units - 单元数组
 * @param {number} omega - 角频率 (rad/s)
 * @returns {number} 残差扭矩
 */
export function calculateResidualTorque(units, omega) {
  const T = calculateTotalTransferMatrix(units, omega);

  // 初始状态向量 [θ₁, T₁] = [1, 0]
  // 末端状态 [θ_n, T_n] = T × [1, 0]
  // 残差 = T[1][0] × 1 + T[1][1] × 0 = T[1][0]
  return T[1][0];
}

// ============================================================
// 固有频率求解算法
// ============================================================

/**
 * 使用二分法求解固有频率
 *
 * @param {TorsionalUnit[]} units - 单元数组
 * @param {number} freqMin - 搜索下限 (Hz)
 * @param {number} freqMax - 搜索上限 (Hz)
 * @param {number} numModes - 需要求解的阶数
 * @param {number} [tolerance=0.001] - 频率精度 (Hz)
 * @returns {number[]} 各阶固有频率 (Hz)
 */
export function solveNaturalFrequencies(units, freqMin, freqMax, numModes, tolerance = 0.001) {
  const naturalFrequencies = [];
  const freqStep = 0.1; // 初始搜索步长 (Hz)

  let prevResidual = null;
  let prevFreq = null;

  for (let f = freqMin; f <= freqMax && naturalFrequencies.length < numModes; f += freqStep) {
    const omega = 2 * PI * f;
    const residual = calculateResidualTorque(units, omega);

    // 检测符号变化（零点）
    if (prevResidual !== null && prevResidual * residual < 0) {
      // 使用二分法精确求解
      const refinedFreq = bisectionMethod(
        units,
        prevFreq,
        f,
        tolerance
      );
      naturalFrequencies.push(refinedFreq);
    }

    prevResidual = residual;
    prevFreq = f;
  }

  return naturalFrequencies;
}

/**
 * 二分法精确求解单个固有频率
 *
 * @param {TorsionalUnit[]} units - 单元数组
 * @param {number} fLow - 下界频率 (Hz)
 * @param {number} fHigh - 上界频率 (Hz)
 * @param {number} tolerance - 精度 (Hz)
 * @returns {number} 精确频率 (Hz)
 */
function bisectionMethod(units, fLow, fHigh, tolerance) {
  const maxIter = 50;
  let iter = 0;

  while (fHigh - fLow > tolerance && iter < maxIter) {
    const fMid = (fLow + fHigh) / 2;
    const omegaLow = 2 * PI * fLow;
    const omegaMid = 2 * PI * fMid;

    const residualLow = calculateResidualTorque(units, omegaLow);
    const residualMid = calculateResidualTorque(units, omegaMid);

    if (residualLow * residualMid < 0) {
      fHigh = fMid;
    } else {
      fLow = fMid;
    }

    iter++;
  }

  return (fLow + fHigh) / 2;
}

// ============================================================
// Holzer迭代法计算振型
// ============================================================

/**
 * Holzer迭代法计算振型
 *
 * 对于给定固有频率，计算各单元的相对振幅和振动扭矩
 *
 * @param {TorsionalUnit[]} units - 单元数组
 * @param {number} frequency - 固有频率 (Hz)
 * @returns {Object} 振型数据
 */
export function calculateModeShape(units, frequency) {
  const omega = 2 * PI * frequency;
  const omega2 = omega * omega;
  const n = units.length;

  // 初始条件：第一个质量的角位移为1，扭矩为0
  let theta = 1.0;
  let T = 0;

  const amplitudes = [theta];
  const torques = [];
  const holzerTable = [];

  // Holzer迭代
  for (let i = 0; i < n; i++) {
    const unit = units[i];
    const J = unit.inertia;

    // 惯量力矩
    const inertiaT = omega2 * J * theta;

    // 累积扭矩
    T = T + inertiaT;

    // 记录该单元后的扭矩
    if (i < n - 1) {
      torques.push(T / 1000); // 转换为 kN·m
    }

    // Holzer表格记录
    holzerTable.push({
      unitNumber: unit.unitNumber,
      name: unit.name,
      inertia: J,
      flexibility: unit.torsionalFlexibility,
      amplitude: theta,
      inertiaForce: inertiaT,
      cumulativeTorque: T,
      torqueKNm: T / 1000
    });

    // 柔度变形（最后一个单元后无变形）
    if (i < n - 1 && unit.torsionalFlexibility > 0) {
      const c = unit.torsionalFlexibility * 1e-10;
      theta = theta - c * T;
    }

    amplitudes.push(theta);
  }

  // 移除最后一个多余的振幅
  amplitudes.pop();

  // 归一化振幅（使最大绝对值为1）
  const maxAmp = Math.max(...amplitudes.map(Math.abs));
  const normalizedAmplitudes = amplitudes.map(a => a / maxAmp);

  return {
    amplitudes: normalizedAmplitudes,
    rawAmplitudes: amplitudes,
    torques,
    holzerTable,
    residualTorque: T
  };
}

// ============================================================
// 多分支系统求解
// ============================================================

/**
 * 构建多分支系统的耦合方程
 *
 * 对于分支连接点：
 * 1. 角位移连续: θ_branch = θ_main × ratio
 * 2. 扭矩平衡: T_main = Σ(T_branch / ratio)
 *
 * @param {TorsionalUnit[][]} branches - 各分支的单元数组
 * @param {BranchConnection[]} connections - 分支连接信息
 * @param {number} omega - 角频率 (rad/s)
 * @returns {number} 残差（用于求解固有频率）
 */
export function calculateMultiBranchResidual(branches, connections, omega) {
  // 简化实现：假设主分支为第一个，其他为从分支
  const mainBranch = branches[0];

  // 计算主分支传递矩阵
  let totalResidual = calculateResidualTorque(mainBranch, omega);

  // 添加从分支的影响
  for (let i = 1; i < branches.length; i++) {
    const branch = branches[i];
    const conn = connections[i - 1];

    // 计算分支的等效惯量（折算到主轴）
    const branchMatrix = calculateTotalTransferMatrix(branch, omega * conn.speedRatio);

    // 分支对主轴的扭矩贡献
    // T_contribution = T_branch × ratio²（惯量折算）
    const branchResidual = branchMatrix[1][0] * conn.speedRatio * conn.speedRatio;

    totalResidual += branchResidual;
  }

  return totalResidual;
}

/**
 * 计算多分支系统的振型
 *
 * @param {TorsionalUnit[]} allUnits - 所有单元
 * @param {BranchConnection[]} branches - 分支连接
 * @param {number} frequency - 固有频率 (Hz)
 * @returns {Object} 振型数据（含各分支）
 */
export function calculateMultiBranchModeShape(allUnits, branches, frequency) {
  const omega = 2 * PI * frequency;
  const omega2 = omega * omega;

  // 分离主分支和从分支单元
  const branchUnitNumbers = new Set(branches.flatMap(b => b.units || []));
  const mainBranchUnits = allUnits.filter(u => !branchUnitNumbers.has(u.unitNumber));

  // 计算主分支振型
  const mainResult = calculateModeShape(mainBranchUnits, frequency);

  // 计算各从分支振型
  const branchResults = [];
  for (const branch of branches) {
    const branchUnits = allUnits.filter(u => (branch.units || []).includes(u.unitNumber));
    if (branchUnits.length === 0) continue;

    // 分支连接点的振幅（从主分支获取）
    const connIdx = branch.connectionPoint - 1;
    const connAmplitude = mainResult.amplitudes[connIdx] || 1.0;

    // 分支频率需按速比调整
    const branchFreq = frequency * (branch.speedRatio || 1.0);
    const branchShape = calculateBranchModeShape(branchUnits, branchFreq, connAmplitude);

    branchResults.push({
      branchId: branch.branchId,
      connectionPoint: branch.connectionPoint,
      speedRatio: branch.speedRatio,
      ...branchShape
    });
  }

  // 合并所有单元的振幅到统一数组
  const combinedAmplitudes = new Array(allUnits.length).fill(0);
  const combinedTorques = new Array(allUnits.length - 1).fill(0);

  // 填入主分支数据
  for (let i = 0; i < mainBranchUnits.length; i++) {
    const unitIdx = allUnits.findIndex(u => u.unitNumber === mainBranchUnits[i].unitNumber);
    if (unitIdx >= 0) {
      combinedAmplitudes[unitIdx] = mainResult.amplitudes[i] || 0;
      if (i < mainResult.torques.length) {
        combinedTorques[unitIdx] = mainResult.torques[i] || 0;
      }
    }
  }

  // 填入从分支数据
  for (const branchRes of branchResults) {
    const branchUnits = allUnits.filter(u =>
      (branches.find(b => b.branchId === branchRes.branchId)?.units || []).includes(u.unitNumber)
    );
    for (let i = 0; i < branchUnits.length; i++) {
      const unitIdx = allUnits.findIndex(u => u.unitNumber === branchUnits[i].unitNumber);
      if (unitIdx >= 0) {
        combinedAmplitudes[unitIdx] = branchRes.amplitudes[i] || 0;
        if (i < branchRes.torques.length) {
          combinedTorques[unitIdx] = branchRes.torques[i] || 0;
        }
      }
    }
  }

  // 归一化
  const maxAmp = Math.max(...combinedAmplitudes.map(Math.abs));
  const normalizedAmplitudes = maxAmp > 0
    ? combinedAmplitudes.map(a => a / maxAmp)
    : combinedAmplitudes;

  return {
    amplitudes: normalizedAmplitudes,
    rawAmplitudes: combinedAmplitudes,
    torques: combinedTorques,
    mainBranch: mainResult,
    branches: branchResults,
    residualTorque: mainResult.residualTorque,
    holzerTable: mainResult.holzerTable // 主分支Holzer表
  };
}

/**
 * 计算从分支的振型（给定连接点振幅）
 *
 * @param {TorsionalUnit[]} units - 分支单元
 * @param {number} frequency - 分支频率 (Hz)
 * @param {number} connAmplitude - 连接点振幅
 * @returns {Object} 分支振型
 */
function calculateBranchModeShape(units, frequency, connAmplitude) {
  const omega = 2 * PI * frequency;
  const omega2 = omega * omega;
  const n = units.length;

  // 初始条件：连接点振幅
  let theta = connAmplitude;
  let T = 0;

  const amplitudes = [theta];
  const torques = [];

  for (let i = 0; i < n; i++) {
    const unit = units[i];
    const J = unit.inertia;

    // 惯量力矩
    const inertiaT = omega2 * J * theta;
    T = T + inertiaT;

    if (i < n - 1) {
      torques.push(T / 1000);
    }

    // 柔度变形
    if (i < n - 1 && unit.torsionalFlexibility > 0) {
      const c = unit.torsionalFlexibility * 1e-10;
      theta = theta - c * T;
    }

    if (i < n - 1) {
      amplitudes.push(theta);
    }
  }

  return {
    amplitudes,
    torques,
    residualTorque: T
  };
}

/**
 * 求解多分支系统固有频率
 *
 * @param {TorsionalUnit[][]} branches - 各分支的单元数组
 * @param {BranchConnection[]} connections - 分支连接信息
 * @param {number} freqMin - 搜索下限 (Hz)
 * @param {number} freqMax - 搜索上限 (Hz)
 * @param {number} numModes - 需要求解的阶数
 * @returns {number[]} 各阶固有频率 (Hz)
 */
export function solveMultiBranchFrequencies(branches, connections, freqMin, freqMax, numModes) {
  const naturalFrequencies = [];
  const freqStep = 0.1;
  const tolerance = 0.001;

  let prevResidual = null;
  let prevFreq = null;

  for (let f = freqMin; f <= freqMax && naturalFrequencies.length < numModes; f += freqStep) {
    const omega = 2 * PI * f;
    const residual = calculateMultiBranchResidual(branches, connections, omega);

    if (prevResidual !== null && prevResidual * residual < 0) {
      // 二分法精确求解
      const refinedFreq = bisectionMethodMultiBranch(
        branches,
        connections,
        prevFreq,
        f,
        tolerance
      );
      naturalFrequencies.push(refinedFreq);
    }

    prevResidual = residual;
    prevFreq = f;
  }

  return naturalFrequencies;
}

/**
 * 多分支系统二分法
 */
function bisectionMethodMultiBranch(branches, connections, fLow, fHigh, tolerance) {
  const maxIter = 50;
  let iter = 0;

  while (fHigh - fLow > tolerance && iter < maxIter) {
    const fMid = (fLow + fHigh) / 2;
    const omegaLow = 2 * PI * fLow;
    const omegaMid = 2 * PI * fMid;

    const residualLow = calculateMultiBranchResidual(branches, connections, omegaLow);
    const residualMid = calculateMultiBranchResidual(branches, connections, omegaMid);

    if (residualLow * residualMid < 0) {
      fHigh = fMid;
    } else {
      fLow = fMid;
    }

    iter++;
  }

  return (fLow + fHigh) / 2;
}

// ============================================================
// 完整分析流程
// ============================================================

/**
 * 执行完整的多自由度扭振分析
 *
 * @param {Object} systemInput - 系统输入数据
 * @param {TorsionalUnit[]} systemInput.units - 单元数组
 * @param {GearMesh[]} [systemInput.gearMeshes] - 齿轮啮合数据
 * @param {BranchConnection[]} [systemInput.branches] - 分支连接
 * @param {Object} systemInput.analysisSettings - 分析设置
 * @returns {Object} 完整分析结果
 */
export function runAdvancedTorsionalAnalysis(systemInput) {
  const {
    units,
    gearMeshes = [],
    branches = [],
    analysisSettings = {}
  } = systemInput;

  const {
    numberOfModes = 5,
    freqMin = 0.1,
    freqMax = 1000
  } = analysisSettings;

  // 判断是否为多分支系统
  const isMultiBranch = branches.length > 0;

  // 求解固有频率
  let naturalFrequencies;

  if (isMultiBranch) {
    // 多分支系统
    const branchUnits = prepareBranchUnits(units, branches);
    naturalFrequencies = solveMultiBranchFrequencies(
      branchUnits,
      branches,
      freqMin,
      freqMax,
      numberOfModes
    );
  } else {
    // 单分支系统
    naturalFrequencies = solveNaturalFrequencies(
      units,
      freqMin,
      freqMax,
      numberOfModes
    );
  }

  // 计算各阶振型
  const results = naturalFrequencies.map((freq, index) => {
    // 对多分支系统使用专用振型计算
    const modeShape = isMultiBranch
      ? calculateMultiBranchModeShape(units, branches, freq)
      : calculateModeShape(units, freq);

    return {
      order: index + 1,
      frequency: freq,
      frequencyRpm: freq * 60,
      omega: 2 * PI * freq,
      modeShape
    };
  });

  // 计算系统总惯量
  const totalInertia = units.reduce((sum, u) => sum + u.inertia, 0);

  // 计算等效柔度
  const totalFlexibility = units
    .filter(u => u.torsionalFlexibility > 0)
    .reduce((sum, u) => sum + u.torsionalFlexibility, 0);

  return {
    naturalFrequencies: results,
    systemProperties: {
      totalInertia,
      totalFlexibility,
      numberOfUnits: units.length,
      isMultiBranch
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * 准备分支单元数组
 *
 * @param {TorsionalUnit[]} allUnits - 所有单元
 * @param {BranchConnection[]} branches - 分支连接
 * @returns {TorsionalUnit[][]} 各分支的单元数组
 */
function prepareBranchUnits(allUnits, branches) {
  const branchUnits = [];

  // 主分支：不在任何从分支中的单元
  const branchUnitNumbers = new Set(branches.flatMap(b => b.units));
  const mainBranch = allUnits.filter(u => !branchUnitNumbers.has(u.unitNumber));
  branchUnits.push(mainBranch);

  // 从分支
  for (const branch of branches) {
    const units = allUnits.filter(u => branch.units.includes(u.unitNumber));
    branchUnits.push(units);
  }

  return branchUnits;
}

// ============================================================
// 工具函数
// ============================================================

/**
 * 根据轴段几何参数计算扭转柔度
 *
 * c = L / (G × Ip)
 * Ip = π(d⁴ - di⁴) / 32
 *
 * @param {Object} params - 轴段参数
 * @param {number} params.length - 长度 (mm)
 * @param {number} params.outerDiameter - 外径 (mm)
 * @param {number} [params.innerDiameter=0] - 内径 (mm)
 * @param {number} [params.G=STEEL_SHEAR_MODULUS] - 剪切模量 (Pa)
 * @returns {number} 扭转柔度 (×10⁻¹⁰ rad/N·m)
 */
export function calculateTorsionalFlexibility(params) {
  const {
    length,
    outerDiameter,
    innerDiameter = 0,
    G = STEEL_SHEAR_MODULUS
  } = params;

  // 转换为米
  const L = length / 1000;
  const d = outerDiameter / 1000;
  const di = innerDiameter / 1000;

  // 极惯性矩
  const Ip = PI * (Math.pow(d, 4) - Math.pow(di, 4)) / 32;

  // 扭转柔度
  const c = L / (G * Ip);

  // 转换为 ×10⁻¹⁰ 单位
  return c * 1e10;
}

/**
 * 计算扭转刚度（柔度的倒数）
 *
 * K = G × Ip / L
 *
 * @param {Object} params - 轴段参数
 * @returns {number} 扭转刚度 (N·m/rad)
 */
export function calculateTorsionalStiffness(params) {
  const flexibility = calculateTorsionalFlexibility(params);
  return 1 / (flexibility * 1e-10);
}

/**
 * 创建默认的多自由度系统输入模板
 *
 * @returns {Object} 系统输入模板
 */
export function createDefaultAdvancedInput() {
  return {
    metadata: {
      controlNumber: '',
      projectName: '',
      designOrg: '',
      manufacturer: '',
      calculator: '',
      modelDate: new Date().toISOString().split('T')[0],
      calcDate: new Date().toISOString().split('T')[0],
    },
    systemLayout: {
      mainEngineType: 'diesel', // 'diesel' | 'electric'
      mainEngineCount: 1,
      totalMassCount: 4,
      totalBranchCount: 0,
      intermediateShaftUnit: 2,
      intermediateShaftTensileStrength: 650,
      intermediateShaftConnectionType: 'integral_flange',
      driveSystem: 'propeller',
      iceClass: 'none',
    },
    powerSource: {
      type: 'diesel',
      manufacturer: '',
      model: '',
      unitNumber: 1,
      ratedPower: 400,
      ratedSpeed: 1500,
      cylinderCount: 6,
      firingOrder: [1, 5, 3, 6, 2, 4],
    },
    propeller: {
      manufacturer: '',
      type: 'fixed_pitch',
      model: '',
      bladeCount: 4,
      unitNumber: 4,
      shaftTensileStrength: 520,
      considerPropellerExcitation: true,
      addedInertia: 0.5,
    },
    gearMeshes: [],
    elasticCouplings: [],
    units: [
      {
        unitNumber: 1,
        name: '飞轮',
        type: 'motor',
        speedRatio: 1.0,
        inertia: 5.0,
        torsionalFlexibility: 5000,
        outerDiameter: 85,
        innerDiameter: 0,
      },
      {
        unitNumber: 2,
        name: '中间轴',
        type: 'shaft',
        speedRatio: 1.0,
        inertia: 0.5,
        torsionalFlexibility: 8000,
        outerDiameter: 60,
        innerDiameter: 0,
      },
      {
        unitNumber: 3,
        name: '艉轴',
        type: 'shaft',
        speedRatio: 1.0,
        inertia: 0.3,
        torsionalFlexibility: 50000,
        outerDiameter: 90,
        innerDiameter: 0,
      },
      {
        unitNumber: 4,
        name: '螺旋桨',
        type: 'propeller',
        speedRatio: 1.0,
        inertia: 15.0,
        torsionalFlexibility: 0,
        outerDiameter: 0,
        innerDiameter: 0,
      },
    ],
    branches: [],
    analysisSettings: {
      numberOfModes: 5,
      freqMin: 0.1,
      freqMax: 500,
      speedRange: { min: 100, max: 2000 },
      speedStep: 10,
    },
  };
}

export default {
  // 矩阵构建
  buildInertiaMatrix,
  buildFlexibilityMatrix,
  buildGearRatioMatrix,

  // 单分支求解
  calculateTotalTransferMatrix,
  calculateResidualTorque,
  solveNaturalFrequencies,
  calculateModeShape,

  // 多分支求解
  calculateMultiBranchResidual,
  solveMultiBranchFrequencies,

  // 完整分析
  runAdvancedTorsionalAnalysis,

  // 工具函数
  calculateTorsionalFlexibility,
  calculateTorsionalStiffness,
  createDefaultAdvancedInput,
};
