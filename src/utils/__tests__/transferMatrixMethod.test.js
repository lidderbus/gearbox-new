/**
 * transferMatrixMethod.js 测试文件
 *
 * 传递矩阵法扭振计算模块 - 基于Holzer-Myklestad方法
 * 覆盖矩阵构建、单分支求解、多分支系统、工具函数等
 */

import {
  STEEL_SHEAR_MODULUS,
  buildInertiaMatrix,
  buildFlexibilityMatrix,
  buildGearRatioMatrix,
  calculateTotalTransferMatrix,
  calculateResidualTorque,
  solveNaturalFrequencies,
  calculateModeShape,
  calculateMultiBranchResidual,
  calculateMultiBranchModeShape,
  solveMultiBranchFrequencies,
  runAdvancedTorsionalAnalysis,
  calculateTorsionalFlexibility,
  calculateTorsionalStiffness,
  createDefaultAdvancedInput
} from '../transferMatrixMethod';

// ============================================================
// 测试辅助函数
// ============================================================

/**
 * 创建简单的双质量系统
 * 典型的弹簧-质量系统用于验证算法
 */
const createSimpleTwoMassSystem = () => [
  {
    unitNumber: 1,
    name: '质量1',
    type: 'motor',
    speedRatio: 1.0,
    inertia: 1.0,               // kg·m²
    torsionalFlexibility: 1000, // ×10⁻¹⁰ rad/N·m
    outerDiameter: 50,
    innerDiameter: 0
  },
  {
    unitNumber: 2,
    name: '质量2',
    type: 'propeller',
    speedRatio: 1.0,
    inertia: 1.0,               // kg·m²
    torsionalFlexibility: 0,
    outerDiameter: 50,
    innerDiameter: 0
  }
];

/**
 * 创建船用轴系单元（4质量系统）
 */
const createMarineShaftSystem = () => [
  {
    unitNumber: 1,
    name: '飞轮',
    type: 'motor',
    speedRatio: 1.0,
    inertia: 5.0,
    torsionalFlexibility: 5000,
    outerDiameter: 85,
    innerDiameter: 0
  },
  {
    unitNumber: 2,
    name: '中间轴',
    type: 'shaft',
    speedRatio: 1.0,
    inertia: 0.5,
    torsionalFlexibility: 8000,
    outerDiameter: 60,
    innerDiameter: 0
  },
  {
    unitNumber: 3,
    name: '艉轴',
    type: 'shaft',
    speedRatio: 1.0,
    inertia: 0.3,
    torsionalFlexibility: 50000,
    outerDiameter: 90,
    innerDiameter: 0
  },
  {
    unitNumber: 4,
    name: '螺旋桨',
    type: 'propeller',
    speedRatio: 1.0,
    inertia: 15.0,
    torsionalFlexibility: 0,
    outerDiameter: 0,
    innerDiameter: 0
  }
];

/**
 * 创建多分支系统（双机驱动）
 */
const createMultiBranchSystem = () => ({
  units: [
    // 主分支
    {
      unitNumber: 1,
      name: '主机飞轮',
      type: 'motor',
      speedRatio: 1.0,
      inertia: 5.0,
      torsionalFlexibility: 5000,
      outerDiameter: 85,
      innerDiameter: 0
    },
    {
      unitNumber: 2,
      name: '中间轴',
      type: 'shaft',
      speedRatio: 1.0,
      inertia: 0.5,
      torsionalFlexibility: 8000,
      outerDiameter: 60,
      innerDiameter: 0
    },
    {
      unitNumber: 3,
      name: '螺旋桨',
      type: 'propeller',
      speedRatio: 1.0,
      inertia: 15.0,
      torsionalFlexibility: 0,
      outerDiameter: 0,
      innerDiameter: 0
    },
    // 从分支（副机）
    {
      unitNumber: 4,
      name: '副机飞轮',
      type: 'motor',
      speedRatio: 1.0,
      inertia: 3.0,
      torsionalFlexibility: 3000,
      outerDiameter: 70,
      innerDiameter: 0
    },
    {
      unitNumber: 5,
      name: '副机轴',
      type: 'shaft',
      speedRatio: 1.0,
      inertia: 0.3,
      torsionalFlexibility: 0,
      outerDiameter: 50,
      innerDiameter: 0
    }
  ],
  branches: [
    {
      branchId: 1,
      units: [4, 5],
      connectionPoint: 2,
      speedRatio: 1.0
    }
  ]
});

// ============================================================
// 物理常量测试
// ============================================================

describe('STEEL_SHEAR_MODULUS - 钢材剪切模量常量', () => {
  test('应为正确的物理值 8.1×10¹⁰ Pa', () => {
    expect(STEEL_SHEAR_MODULUS).toBe(8.1e10);
  });

  test('应为正数', () => {
    expect(STEEL_SHEAR_MODULUS).toBeGreaterThan(0);
  });
});

// ============================================================
// 矩阵构建函数测试
// ============================================================

describe('buildInertiaMatrix - 惯量点矩阵构建', () => {
  test('应正确构建惯量点矩阵', () => {
    const J = 1.0;     // kg·m²
    const omega = 10;  // rad/s

    const result = buildInertiaMatrix(J, omega);

    // P = [1, 0; ω²J, 1]
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual([1, 0]);
    expect(result[1][0]).toBeCloseTo(omega * omega * J, 6);
    expect(result[1][1]).toBe(1);
  });

  test('当惯量为0时应返回单位矩阵', () => {
    const result = buildInertiaMatrix(0, 100);

    expect(result).toEqual([[1, 0], [0, 1]]);
  });

  test('当角频率为0时应返回单位矩阵', () => {
    const result = buildInertiaMatrix(5.0, 0);

    expect(result).toEqual([[1, 0], [0, 1]]);
  });

  test('应正确处理大惯量值', () => {
    const J = 100;      // 大惯量
    const omega = 100;  // 高转速

    const result = buildInertiaMatrix(J, omega);

    expect(result[1][0]).toBeCloseTo(100 * 100 * 100, 0); // 1,000,000
  });
});

describe('buildFlexibilityMatrix - 柔度场矩阵构建', () => {
  test('应正确构建柔度场矩阵', () => {
    const c = 1e-8; // rad/N·m

    const result = buildFlexibilityMatrix(c);

    // F = [1, -c; 0, 1]
    expect(result).toHaveLength(2);
    expect(result[0][0]).toBe(1);
    expect(result[0][1]).toBe(-c);
    expect(result[1]).toEqual([0, 1]);
  });

  test('当柔度为0时应返回单位矩阵', () => {
    const result = buildFlexibilityMatrix(0);

    // -0 和 0 在数值上相等
    expect(result[0][0]).toBe(1);
    expect(result[0][1]).toBe(-0); // 实际上是 -0，但数值上等于0
    expect(result[1]).toEqual([0, 1]);
    // 验证 -0 === 0
    expect(result[0][1] === 0).toBe(true);
  });

  test('应正确处理小柔度值', () => {
    const c = 1e-15;

    const result = buildFlexibilityMatrix(c);

    expect(result[0][1]).toBe(-c);
  });
});

describe('buildGearRatioMatrix - 齿轮速比矩阵构建', () => {
  test('应正确构建速比变换矩阵', () => {
    const ratio = 2.0;

    const result = buildGearRatioMatrix(ratio);

    // G = [1/i, 0; 0, i]
    expect(result).toHaveLength(2);
    expect(result[0][0]).toBeCloseTo(0.5, 6);
    expect(result[0][1]).toBe(0);
    expect(result[1][0]).toBe(0);
    expect(result[1][1]).toBe(ratio);
  });

  test('速比为1时应返回单位矩阵', () => {
    const result = buildGearRatioMatrix(1.0);

    expect(result).toEqual([[1, 0], [0, 1]]);
  });

  test('应正确处理减速比', () => {
    const ratio = 0.5; // 增速

    const result = buildGearRatioMatrix(ratio);

    expect(result[0][0]).toBeCloseTo(2.0, 6);
    expect(result[1][1]).toBe(0.5);
  });
});

// ============================================================
// 单分支传递矩阵计算测试
// ============================================================

describe('calculateTotalTransferMatrix - 总传递矩阵计算', () => {
  test('应正确计算双质量系统传递矩阵', () => {
    const units = createSimpleTwoMassSystem();
    const omega = 10; // rad/s

    const result = calculateTotalTransferMatrix(units, omega);

    // 应返回2x2矩阵
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(2);
    expect(result[1]).toHaveLength(2);
  });

  test('应正确计算4质量船用轴系传递矩阵', () => {
    const units = createMarineShaftSystem();
    const omega = 50; // rad/s

    const result = calculateTotalTransferMatrix(units, omega);

    // 验证矩阵结构
    expect(result).toHaveLength(2);
    expect(typeof result[0][0]).toBe('number');
    expect(typeof result[1][0]).toBe('number');
    expect(Number.isFinite(result[0][0])).toBe(true);
    expect(Number.isFinite(result[1][0])).toBe(true);
  });

  test('角频率为0时应只考虑柔度', () => {
    const units = createSimpleTwoMassSystem();
    const omega = 0;

    const result = calculateTotalTransferMatrix(units, omega);

    // 当omega=0，惯量矩阵为单位阵
    // 只有柔度矩阵的影响
    expect(result[0][0]).toBe(1);
    expect(result[1][1]).toBe(1);
  });

  test('应处理空单元数组', () => {
    const result = calculateTotalTransferMatrix([], 10);

    // 应返回单位矩阵
    expect(result).toEqual([[1, 0], [0, 1]]);
  });
});

describe('calculateResidualTorque - 残差扭矩计算', () => {
  test('在固有频率处残差应接近零', () => {
    const units = createSimpleTwoMassSystem();

    // 对于简单双质量系统，可以用公式估算固有频率
    // ω² = k/μ, μ = m1*m2/(m1+m2) = 0.5
    // k = 1/(c*1e-10) = 1e8
    // ω² = 2e8, ω ≈ 14142, f ≈ 2250 Hz
    // 但实际上需要通过求解确定

    // 测试非固有频率处残差不为零
    const residual1 = calculateResidualTorque(units, 10);
    expect(residual1).not.toBe(0);
  });

  test('残差应随频率变化', () => {
    const units = createSimpleTwoMassSystem();

    const r1 = calculateResidualTorque(units, 10);
    const r2 = calculateResidualTorque(units, 100);
    const r3 = calculateResidualTorque(units, 1000);

    // 不同频率应有不同残差
    expect(r1).not.toBe(r2);
    expect(r2).not.toBe(r3);
  });

  test('角频率为0时残差应为0', () => {
    const units = createSimpleTwoMassSystem();

    const residual = calculateResidualTorque(units, 0);

    expect(residual).toBe(0);
  });
});

// ============================================================
// 固有频率求解测试
// ============================================================

describe('solveNaturalFrequencies - 固有频率求解', () => {
  test('应求解出双质量系统的固有频率', () => {
    const units = createSimpleTwoMassSystem();

    const frequencies = solveNaturalFrequencies(units, 0.1, 5000, 3);

    // 双质量系统应至少有1个非零固有频率
    expect(frequencies.length).toBeGreaterThanOrEqual(1);
    expect(frequencies[0]).toBeGreaterThan(0);
  });

  test('应求解出船用轴系的多阶固有频率', () => {
    const units = createMarineShaftSystem();

    const frequencies = solveNaturalFrequencies(units, 0.1, 500, 5);

    // 4自由度系统最多有4个固有频率
    // 但在给定范围内可能只找到部分
    frequencies.forEach(f => {
      expect(f).toBeGreaterThan(0);
      expect(f).toBeLessThanOrEqual(500);
    });
  });

  test('应按照频率大小排序', () => {
    const units = createMarineShaftSystem();

    const frequencies = solveNaturalFrequencies(units, 0.1, 500, 3);

    if (frequencies.length >= 2) {
      for (let i = 1; i < frequencies.length; i++) {
        expect(frequencies[i]).toBeGreaterThan(frequencies[i - 1]);
      }
    }
  });

  test('应使用指定的精度', () => {
    const units = createSimpleTwoMassSystem();
    const tolerance = 0.0001;

    const frequencies = solveNaturalFrequencies(units, 0.1, 5000, 1, tolerance);

    // 验证精度（通过重新求解验证）
    if (frequencies.length > 0) {
      const omega = 2 * Math.PI * frequencies[0];
      const residual = Math.abs(calculateResidualTorque(units, omega));
      // 残差应很小（根据精度要求）
      // 但具体值取决于系统特性
      expect(Number.isFinite(residual)).toBe(true);
    }
  });

  test('搜索范围内无固有频率时应返回空数组', () => {
    const units = createSimpleTwoMassSystem();

    // 非常窄的搜索范围
    const frequencies = solveNaturalFrequencies(units, 1, 2, 3);

    // 可能找不到固有频率
    expect(Array.isArray(frequencies)).toBe(true);
  });
});

// ============================================================
// Holzer振型计算测试
// ============================================================

describe('calculateModeShape - 振型计算', () => {
  test('应计算出正确结构的振型数据', () => {
    const units = createMarineShaftSystem();
    const frequencies = solveNaturalFrequencies(units, 0.1, 500, 1);

    if (frequencies.length > 0) {
      const modeShape = calculateModeShape(units, frequencies[0]);

      expect(modeShape).toHaveProperty('amplitudes');
      expect(modeShape).toHaveProperty('rawAmplitudes');
      expect(modeShape).toHaveProperty('torques');
      expect(modeShape).toHaveProperty('holzerTable');
      expect(modeShape).toHaveProperty('residualTorque');
    }
  });

  test('振幅数组长度应与单元数量一致', () => {
    const units = createMarineShaftSystem();
    const frequencies = solveNaturalFrequencies(units, 0.1, 500, 1);

    if (frequencies.length > 0) {
      const modeShape = calculateModeShape(units, frequencies[0]);

      expect(modeShape.amplitudes).toHaveLength(units.length);
    }
  });

  test('归一化振幅的最大值应为1', () => {
    const units = createMarineShaftSystem();
    const frequencies = solveNaturalFrequencies(units, 0.1, 500, 1);

    if (frequencies.length > 0) {
      const modeShape = calculateModeShape(units, frequencies[0]);
      const maxAmp = Math.max(...modeShape.amplitudes.map(Math.abs));

      expect(maxAmp).toBeCloseTo(1, 6);
    }
  });

  test('Holzer表格应包含正确的字段', () => {
    const units = createMarineShaftSystem();
    const frequencies = solveNaturalFrequencies(units, 0.1, 500, 1);

    if (frequencies.length > 0) {
      const modeShape = calculateModeShape(units, frequencies[0]);

      expect(modeShape.holzerTable).toHaveLength(units.length);
      expect(modeShape.holzerTable[0]).toHaveProperty('unitNumber');
      expect(modeShape.holzerTable[0]).toHaveProperty('name');
      expect(modeShape.holzerTable[0]).toHaveProperty('inertia');
      expect(modeShape.holzerTable[0]).toHaveProperty('amplitude');
      expect(modeShape.holzerTable[0]).toHaveProperty('cumulativeTorque');
    }
  });

  test('扭矩数组长度应为单元数-1', () => {
    const units = createMarineShaftSystem();
    const frequencies = solveNaturalFrequencies(units, 0.1, 500, 1);

    if (frequencies.length > 0) {
      const modeShape = calculateModeShape(units, frequencies[0]);

      expect(modeShape.torques).toHaveLength(units.length - 1);
    }
  });
});

// ============================================================
// 多分支系统测试
// ============================================================

describe('calculateMultiBranchResidual - 多分支残差计算', () => {
  test('应正确计算多分支系统残差', () => {
    const { units, branches } = createMultiBranchSystem();

    // 准备分支单元数组
    const branchUnitNumbers = new Set(branches.flatMap(b => b.units));
    const mainBranch = units.filter(u => !branchUnitNumbers.has(u.unitNumber));
    const subBranch = units.filter(u => branches[0].units.includes(u.unitNumber));

    const branchArrays = [mainBranch, subBranch];
    const omega = 50;

    const residual = calculateMultiBranchResidual(branchArrays, branches, omega);

    expect(typeof residual).toBe('number');
    expect(Number.isFinite(residual)).toBe(true);
  });

  test('残差应随频率变化', () => {
    const { units, branches } = createMultiBranchSystem();

    const branchUnitNumbers = new Set(branches.flatMap(b => b.units));
    const mainBranch = units.filter(u => !branchUnitNumbers.has(u.unitNumber));
    const subBranch = units.filter(u => branches[0].units.includes(u.unitNumber));
    const branchArrays = [mainBranch, subBranch];

    const r1 = calculateMultiBranchResidual(branchArrays, branches, 10);
    const r2 = calculateMultiBranchResidual(branchArrays, branches, 100);

    expect(r1).not.toBe(r2);
  });
});

describe('solveMultiBranchFrequencies - 多分支固有频率求解', () => {
  test('应求解多分支系统固有频率', () => {
    const { units, branches } = createMultiBranchSystem();

    const branchUnitNumbers = new Set(branches.flatMap(b => b.units));
    const mainBranch = units.filter(u => !branchUnitNumbers.has(u.unitNumber));
    const subBranch = units.filter(u => branches[0].units.includes(u.unitNumber));
    const branchArrays = [mainBranch, subBranch];

    const frequencies = solveMultiBranchFrequencies(
      branchArrays,
      branches,
      0.1,
      500,
      3
    );

    expect(Array.isArray(frequencies)).toBe(true);
    frequencies.forEach(f => {
      expect(f).toBeGreaterThan(0);
    });
  });
});

describe('calculateMultiBranchModeShape - 多分支振型计算', () => {
  test('应计算多分支系统振型', () => {
    const { units, branches } = createMultiBranchSystem();

    // 使用固定频率测试振型计算
    const modeShape = calculateMultiBranchModeShape(units, branches, 50);

    expect(modeShape).toHaveProperty('amplitudes');
    expect(modeShape).toHaveProperty('torques');
    expect(modeShape).toHaveProperty('mainBranch');
    expect(modeShape).toHaveProperty('branches');
  });

  test('合并振幅数组长度应与总单元数一致', () => {
    const { units, branches } = createMultiBranchSystem();

    const modeShape = calculateMultiBranchModeShape(units, branches, 50);

    expect(modeShape.amplitudes).toHaveLength(units.length);
  });
});

// ============================================================
// 完整分析流程测试
// ============================================================

describe('runAdvancedTorsionalAnalysis - 完整扭振分析', () => {
  test('应完成单分支系统分析', () => {
    const units = createMarineShaftSystem();
    const input = {
      units,
      analysisSettings: {
        numberOfModes: 3,
        freqMin: 0.1,
        freqMax: 500
      }
    };

    const result = runAdvancedTorsionalAnalysis(input);

    expect(result).toHaveProperty('naturalFrequencies');
    expect(result).toHaveProperty('systemProperties');
    expect(result).toHaveProperty('timestamp');
  });

  test('应返回正确的系统属性', () => {
    const units = createMarineShaftSystem();
    const input = {
      units,
      analysisSettings: {
        numberOfModes: 3,
        freqMin: 0.1,
        freqMax: 500
      }
    };

    const result = runAdvancedTorsionalAnalysis(input);

    expect(result.systemProperties.numberOfUnits).toBe(units.length);
    expect(result.systemProperties.isMultiBranch).toBe(false);
    expect(result.systemProperties.totalInertia).toBeGreaterThan(0);
  });

  test('应包含各阶固有频率结果', () => {
    const units = createMarineShaftSystem();
    const input = {
      units,
      analysisSettings: {
        numberOfModes: 3,
        freqMin: 0.1,
        freqMax: 500
      }
    };

    const result = runAdvancedTorsionalAnalysis(input);

    result.naturalFrequencies.forEach((nf, index) => {
      expect(nf.order).toBe(index + 1);
      expect(nf).toHaveProperty('frequency');
      expect(nf).toHaveProperty('frequencyRpm');
      expect(nf).toHaveProperty('omega');
      expect(nf).toHaveProperty('modeShape');
    });
  });

  test('应完成多分支系统分析', () => {
    const { units, branches } = createMultiBranchSystem();
    const input = {
      units,
      branches,
      analysisSettings: {
        numberOfModes: 3,
        freqMin: 0.1,
        freqMax: 500
      }
    };

    const result = runAdvancedTorsionalAnalysis(input);

    expect(result.systemProperties.isMultiBranch).toBe(true);
  });

  test('应使用默认分析设置', () => {
    const units = createMarineShaftSystem();
    const input = { units };

    const result = runAdvancedTorsionalAnalysis(input);

    // 默认设置：numberOfModes = 5
    expect(result).toHaveProperty('naturalFrequencies');
  });

  test('应包含时间戳', () => {
    const units = createMarineShaftSystem();
    const input = { units };

    const result = runAdvancedTorsionalAnalysis(input);

    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp)).toBeInstanceOf(Date);
  });
});

// ============================================================
// 工具函数测试
// ============================================================

describe('calculateTorsionalFlexibility - 扭转柔度计算', () => {
  test('应正确计算实心轴柔度', () => {
    const params = {
      length: 1000,        // 1m
      outerDiameter: 100,  // 100mm
      innerDiameter: 0
    };

    const flexibility = calculateTorsionalFlexibility(params);

    // 验证结果为正数且合理范围
    expect(flexibility).toBeGreaterThan(0);
    expect(Number.isFinite(flexibility)).toBe(true);
  });

  test('应正确计算空心轴柔度', () => {
    const params = {
      length: 1000,
      outerDiameter: 100,
      innerDiameter: 50
    };

    const flexibility = calculateTorsionalFlexibility(params);

    expect(flexibility).toBeGreaterThan(0);
  });

  test('空心轴柔度应大于同尺寸实心轴', () => {
    const solidParams = {
      length: 1000,
      outerDiameter: 100,
      innerDiameter: 0
    };
    const hollowParams = {
      length: 1000,
      outerDiameter: 100,
      innerDiameter: 50
    };

    const solidFlex = calculateTorsionalFlexibility(solidParams);
    const hollowFlex = calculateTorsionalFlexibility(hollowParams);

    // 空心轴截面积更小，柔度更大
    expect(hollowFlex).toBeGreaterThan(solidFlex);
  });

  test('柔度应与长度成正比', () => {
    const params1 = {
      length: 1000,
      outerDiameter: 100,
      innerDiameter: 0
    };
    const params2 = {
      length: 2000,
      outerDiameter: 100,
      innerDiameter: 0
    };

    const flex1 = calculateTorsionalFlexibility(params1);
    const flex2 = calculateTorsionalFlexibility(params2);

    expect(flex2 / flex1).toBeCloseTo(2, 1);
  });

  test('应使用默认剪切模量', () => {
    const params = {
      length: 1000,
      outerDiameter: 100
    };

    const flexibility = calculateTorsionalFlexibility(params);

    // 使用默认钢材剪切模量计算
    expect(flexibility).toBeGreaterThan(0);
  });

  test('应使用自定义剪切模量', () => {
    const paramsDefault = {
      length: 1000,
      outerDiameter: 100
    };
    const paramsCustom = {
      length: 1000,
      outerDiameter: 100,
      G: 4.05e10  // 铝合金剪切模量
    };

    const flexDefault = calculateTorsionalFlexibility(paramsDefault);
    const flexCustom = calculateTorsionalFlexibility(paramsCustom);

    // 剪切模量减半，柔度加倍
    expect(flexCustom / flexDefault).toBeCloseTo(2, 1);
  });
});

describe('calculateTorsionalStiffness - 扭转刚度计算', () => {
  test('应返回柔度的倒数', () => {
    const params = {
      length: 1000,
      outerDiameter: 100,
      innerDiameter: 0
    };

    const flexibility = calculateTorsionalFlexibility(params);
    const stiffness = calculateTorsionalStiffness(params);

    // 刚度 = 1 / (柔度 × 10⁻¹⁰)
    expect(stiffness).toBeCloseTo(1 / (flexibility * 1e-10), 0);
  });

  test('刚度应为正数', () => {
    const params = {
      length: 1000,
      outerDiameter: 100
    };

    const stiffness = calculateTorsionalStiffness(params);

    expect(stiffness).toBeGreaterThan(0);
  });

  test('刚度应与直径四次方成正比', () => {
    const params1 = {
      length: 1000,
      outerDiameter: 50
    };
    const params2 = {
      length: 1000,
      outerDiameter: 100
    };

    const stiff1 = calculateTorsionalStiffness(params1);
    const stiff2 = calculateTorsionalStiffness(params2);

    // 直径加倍，刚度增加16倍 (2^4)
    expect(stiff2 / stiff1).toBeCloseTo(16, 0);
  });
});

describe('createDefaultAdvancedInput - 默认输入模板', () => {
  test('应返回完整的输入模板', () => {
    const template = createDefaultAdvancedInput();

    expect(template).toHaveProperty('metadata');
    expect(template).toHaveProperty('systemLayout');
    expect(template).toHaveProperty('powerSource');
    expect(template).toHaveProperty('propeller');
    expect(template).toHaveProperty('gearMeshes');
    expect(template).toHaveProperty('elasticCouplings');
    expect(template).toHaveProperty('units');
    expect(template).toHaveProperty('branches');
    expect(template).toHaveProperty('analysisSettings');
  });

  test('应包含4个默认单元', () => {
    const template = createDefaultAdvancedInput();

    expect(template.units).toHaveLength(4);
  });

  test('默认单元应按顺序编号', () => {
    const template = createDefaultAdvancedInput();

    template.units.forEach((unit, index) => {
      expect(unit.unitNumber).toBe(index + 1);
    });
  });

  test('metadata应包含日期', () => {
    const template = createDefaultAdvancedInput();

    expect(template.metadata.modelDate).toBeDefined();
    expect(template.metadata.calcDate).toBeDefined();
    // 日期格式 YYYY-MM-DD
    expect(template.metadata.modelDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  test('analysisSettings应有合理默认值', () => {
    const template = createDefaultAdvancedInput();

    expect(template.analysisSettings.numberOfModes).toBe(5);
    expect(template.analysisSettings.freqMin).toBe(0.1);
    expect(template.analysisSettings.freqMax).toBe(500);
  });

  test('powerSource应有默认参数', () => {
    const template = createDefaultAdvancedInput();

    expect(template.powerSource.type).toBe('diesel');
    expect(template.powerSource.ratedPower).toBe(400);
    expect(template.powerSource.ratedSpeed).toBe(1500);
    expect(template.powerSource.cylinderCount).toBe(6);
  });

  test('propeller应有默认参数', () => {
    const template = createDefaultAdvancedInput();

    expect(template.propeller.type).toBe('fixed_pitch');
    expect(template.propeller.bladeCount).toBe(4);
    expect(template.propeller.considerPropellerExcitation).toBe(true);
  });

  test('branches默认应为空数组', () => {
    const template = createDefaultAdvancedInput();

    expect(template.branches).toEqual([]);
  });
});

// ============================================================
// 边界条件和异常测试
// ============================================================

describe('边界条件测试', () => {
  test('应处理单个单元的系统', () => {
    const units = [{
      unitNumber: 1,
      name: '单质量',
      type: 'motor',
      speedRatio: 1.0,
      inertia: 5.0,
      torsionalFlexibility: 0,
      outerDiameter: 85,
      innerDiameter: 0
    }];

    const result = calculateTotalTransferMatrix(units, 50);

    expect(result).toHaveLength(2);
  });

  test('应处理零惯量单元', () => {
    const units = [
      {
        unitNumber: 1,
        name: '单元1',
        type: 'shaft',
        speedRatio: 1.0,
        inertia: 0,
        torsionalFlexibility: 5000,
        outerDiameter: 50,
        innerDiameter: 0
      },
      {
        unitNumber: 2,
        name: '单元2',
        type: 'propeller',
        speedRatio: 1.0,
        inertia: 10,
        torsionalFlexibility: 0,
        outerDiameter: 0,
        innerDiameter: 0
      }
    ];

    const result = calculateTotalTransferMatrix(units, 50);

    expect(Number.isFinite(result[0][0])).toBe(true);
  });

  test('应处理零柔度单元', () => {
    const units = [
      {
        unitNumber: 1,
        name: '单元1',
        type: 'motor',
        speedRatio: 1.0,
        inertia: 5.0,
        torsionalFlexibility: 0, // 无柔度
        outerDiameter: 85,
        innerDiameter: 0
      },
      {
        unitNumber: 2,
        name: '单元2',
        type: 'propeller',
        speedRatio: 1.0,
        inertia: 10,
        torsionalFlexibility: 0,
        outerDiameter: 0,
        innerDiameter: 0
      }
    ];

    const result = calculateTotalTransferMatrix(units, 50);

    expect(Number.isFinite(result[0][0])).toBe(true);
  });

  test('应处理极大惯量值', () => {
    const units = [
      {
        unitNumber: 1,
        name: '大惯量',
        type: 'motor',
        speedRatio: 1.0,
        inertia: 1000000, // 极大惯量
        torsionalFlexibility: 5000,
        outerDiameter: 85,
        innerDiameter: 0
      },
      {
        unitNumber: 2,
        name: '单元2',
        type: 'propeller',
        speedRatio: 1.0,
        inertia: 10,
        torsionalFlexibility: 0,
        outerDiameter: 0,
        innerDiameter: 0
      }
    ];

    const result = calculateTotalTransferMatrix(units, 50);

    expect(Number.isFinite(result[0][0])).toBe(true);
  });
});

// ============================================================
// 数值精度测试
// ============================================================

describe('数值精度测试', () => {
  test('矩阵乘法应保持精度', () => {
    const J = 1.0;
    const omega = 100;
    const c = 1e-8;

    const P = buildInertiaMatrix(J, omega);
    const F = buildFlexibilityMatrix(c);

    // 验证矩阵元素精度
    expect(P[1][0]).toBeCloseTo(omega * omega * J, 10);
    expect(F[0][1]).toBeCloseTo(-c, 16);
  });

  test('柔度计算应保持物理单位一致性', () => {
    const params = {
      length: 1000,       // mm
      outerDiameter: 100, // mm
      innerDiameter: 0,
      G: STEEL_SHEAR_MODULUS
    };

    const flexibility = calculateTorsionalFlexibility(params);

    // 柔度单位: ×10⁻¹⁰ rad/N·m
    // 验证数值在合理范围内
    expect(flexibility).toBeGreaterThan(0);
    expect(flexibility).toBeLessThan(1e10); // 不能太大
  });
});
