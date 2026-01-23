/**
 * 强迫振动分析模块测试
 *
 * @module forcedVibrationAnalysis.test
 */

import {
  DIESEL_HARMONIC_COEFFICIENTS,
  ELECTRIC_MOTOR_HARMONICS,
  PROPELLER_HARMONIC_COEFFICIENTS,
  PROPELLER_SHAFT_STRESS_FACTOR,
  calculateAllowableStress,
  calculateAllAllowableStresses,
  calculateDieselExcitationTorque,
  calculateElectricExcitationTorque,
  calculatePropellerExcitationTorque,
  calculateForcedResponse,
  calculateTorsionalStress,
  calculateStressFromAmplitude
} from '../forcedVibrationAnalysis';

// ============================================================
// 常量测试
// ============================================================

describe('DIESEL_HARMONIC_COEFFICIENTS - 柴油机谐波系数', () => {
  test('应包含四冲程柴油机数据', () => {
    expect(DIESEL_HARMONIC_COEFFICIENTS['4-stroke']).toBeDefined();
  });

  test('应包含二冲程柴油机数据', () => {
    expect(DIESEL_HARMONIC_COEFFICIENTS['2-stroke']).toBeDefined();
  });

  test('四冲程应包含4/6/8/12缸配置', () => {
    const fourStroke = DIESEL_HARMONIC_COEFFICIENTS['4-stroke'];
    expect(fourStroke[4]).toBeDefined();
    expect(fourStroke[6]).toBeDefined();
    expect(fourStroke[8]).toBeDefined();
    expect(fourStroke[12]).toBeDefined();
  });

  test('二冲程应包含4/6/8缸配置', () => {
    const twoStroke = DIESEL_HARMONIC_COEFFICIENTS['2-stroke'];
    expect(twoStroke[4]).toBeDefined();
    expect(twoStroke[6]).toBeDefined();
    expect(twoStroke[8]).toBeDefined();
  });

  test('6缸四冲程应有正确的主谐波', () => {
    const coeff = DIESEL_HARMONIC_COEFFICIENTS['4-stroke'][6];
    // 6缸四冲程主要阶次: 3, 6
    expect(coeff[3]).toBe(0.50);
    expect(coeff[6]).toBe(0.35);
  });

  test('所有系数应在0到1之间', () => {
    for (const strokeType of Object.keys(DIESEL_HARMONIC_COEFFICIENTS)) {
      for (const cylCount of Object.keys(DIESEL_HARMONIC_COEFFICIENTS[strokeType])) {
        const coeffs = DIESEL_HARMONIC_COEFFICIENTS[strokeType][cylCount];
        for (const order of Object.keys(coeffs)) {
          expect(coeffs[order]).toBeGreaterThan(0);
          expect(coeffs[order]).toBeLessThanOrEqual(1);
        }
      }
    }
  });
});

describe('ELECTRIC_MOTOR_HARMONICS - 电机谐波系数', () => {
  test('应包含主要谐波阶次', () => {
    expect(ELECTRIC_MOTOR_HARMONICS[1]).toBeDefined();
    expect(ELECTRIC_MOTOR_HARMONICS[2]).toBeDefined();
    expect(ELECTRIC_MOTOR_HARMONICS[6]).toBeDefined();
    expect(ELECTRIC_MOTOR_HARMONICS[12]).toBeDefined();
  });

  test('基波应为最大系数', () => {
    expect(ELECTRIC_MOTOR_HARMONICS[1]).toBeGreaterThan(ELECTRIC_MOTOR_HARMONICS[2]);
    expect(ELECTRIC_MOTOR_HARMONICS[2]).toBeGreaterThan(ELECTRIC_MOTOR_HARMONICS[6]);
  });

  test('系数应校准到很小的值（电机激励小）', () => {
    // 电机激励远小于柴油机
    expect(ELECTRIC_MOTOR_HARMONICS[1]).toBeLessThan(0.01);
  });
});

describe('PROPELLER_HARMONIC_COEFFICIENTS - 螺旋桨谐波系数', () => {
  test('应包含3/4/5/6叶桨数据', () => {
    expect(PROPELLER_HARMONIC_COEFFICIENTS[3]).toBeDefined();
    expect(PROPELLER_HARMONIC_COEFFICIENTS[4]).toBeDefined();
    expect(PROPELLER_HARMONIC_COEFFICIENTS[5]).toBeDefined();
    expect(PROPELLER_HARMONIC_COEFFICIENTS[6]).toBeDefined();
  });

  test('4叶桨主谐波应为叶片数的倍数', () => {
    const coeff = PROPELLER_HARMONIC_COEFFICIENTS[4];
    expect(coeff[4]).toBeDefined();
    expect(coeff[8]).toBeDefined();
    expect(coeff[12]).toBeDefined();
  });

  test('主阶次系数应大于高阶次', () => {
    const coeff = PROPELLER_HARMONIC_COEFFICIENTS[4];
    expect(coeff[4]).toBeGreaterThan(coeff[8]);
    expect(coeff[8]).toBeGreaterThan(coeff[12]);
  });
});

describe('PROPELLER_SHAFT_STRESS_FACTOR - 螺旋桨轴应力修正系数', () => {
  test('应为5.0（COMPASS校准值）', () => {
    expect(PROPELLER_SHAFT_STRESS_FACTOR).toBe(5.0);
  });
});

// ============================================================
// calculateAllowableStress - 许用应力计算
// ============================================================

describe('calculateAllowableStress - 许用应力计算', () => {
  test('中间轴持续许用应力公式: τ_c = 18 + Rm/36', () => {
    // Rm = 650 MPa
    // τ_c = 18 + 650/36 = 18 + 18.06 = 36.06
    const result = calculateAllowableStress('intermediate', 650, 'continuous');
    expect(result).toBeCloseTo(36.06, 1);
  });

  test('螺旋桨轴持续许用应力公式', () => {
    // Rm = 520 MPa
    // τ_c = 18 × √(560/(520+160)) + 520/48
    // τ_c = 18 × √(560/680) + 10.83
    // τ_c = 18 × 0.907 + 10.83 = 16.33 + 10.83 = 27.16
    const result = calculateAllowableStress('propeller', 520, 'continuous');
    expect(result).toBeCloseTo(27.16, 0);
  });

  test('瞬时许用应力应为持续的1.7倍', () => {
    const continuous = calculateAllowableStress('intermediate', 650, 'continuous');
    const transient = calculateAllowableStress('intermediate', 650, 'transient');
    expect(transient).toBeCloseTo(continuous * 1.7, 2);
  });

  test('未知轴类型应使用中间轴公式', () => {
    const intermediate = calculateAllowableStress('intermediate', 600, 'continuous');
    const unknown = calculateAllowableStress('unknown', 600, 'continuous');
    expect(unknown).toBe(intermediate);
  });

  test('默认为持续工况', () => {
    const result = calculateAllowableStress('intermediate', 650);
    const continuous = calculateAllowableStress('intermediate', 650, 'continuous');
    expect(result).toBe(continuous);
  });

  test('高强度材料应有更高许用应力', () => {
    const low = calculateAllowableStress('intermediate', 500, 'continuous');
    const high = calculateAllowableStress('intermediate', 700, 'continuous');
    expect(high).toBeGreaterThan(low);
  });
});

// ============================================================
// calculateAllAllowableStresses - 所有轴许用应力
// ============================================================

describe('calculateAllAllowableStresses - 所有轴许用应力', () => {
  test('应返回中间轴和螺旋桨轴许用应力', () => {
    const input = {
      systemLayout: { intermediateShaftTensileStrength: 650 },
      propeller: { shaftTensileStrength: 520 }
    };

    const result = calculateAllAllowableStresses(input);

    expect(result.intermediateShaft).toBeDefined();
    expect(result.propellerShaft).toBeDefined();
    expect(result.intermediateShaft.continuous).toBeDefined();
    expect(result.intermediateShaft.transient).toBeDefined();
    expect(result.propellerShaft.continuous).toBeDefined();
    expect(result.propellerShaft.transient).toBeDefined();
  });

  test('应使用默认强度值', () => {
    const input = {};

    const result = calculateAllAllowableStresses(input);

    // 默认: intermediate = 650 MPa, propeller = 520 MPa
    expect(result.intermediateShaft.continuous).toBeCloseTo(36.06, 0);
    expect(result.propellerShaft.continuous).toBeGreaterThan(20);
  });

  test('应正确使用输入的强度值', () => {
    const input = {
      systemLayout: { intermediateShaftTensileStrength: 700 },
      propeller: { shaftTensileStrength: 600 }
    };

    const result = calculateAllAllowableStresses(input);

    // 700 MPa: 18 + 700/36 = 37.44
    expect(result.intermediateShaft.continuous).toBeCloseTo(37.44, 1);
  });
});

// ============================================================
// calculateDieselExcitationTorque - 柴油机激励扭矩
// ============================================================

describe('calculateDieselExcitationTorque - 柴油机激励扭矩', () => {
  test('应正确计算平均扭矩', () => {
    // T_mean = 9550 × P / n × 1000 (N·m)
    // P = 400 kW, n = 1000 rpm
    // T_mean = 9550 × 400 / 1000 × 1000 = 3820000 N·m
    const result = calculateDieselExcitationTorque({
      power: 400,
      speed: 1000,
      cylinderCount: 6,
      harmonicOrder: 3
    });

    // μ_3 for 6缸四冲程 = 0.50
    // T_q = 3820000 × 0.50 = 1910000 N·m
    expect(result).toBeCloseTo(1910000, -4);
  });

  test('应使用正确的谐波系数', () => {
    const params = {
      power: 100,
      speed: 1500,
      cylinderCount: 6,
      harmonicOrder: 6,
      strokeType: '4-stroke'
    };

    const result = calculateDieselExcitationTorque(params);

    // T_mean = 9550 × 100 / 1500 × 1000 = 636667 N·m
    // μ_6 = 0.35
    // T_q = 636667 × 0.35 ≈ 222833 N·m
    const T_mean = 9550 * 100 / 1500 * 1000;
    expect(result).toBeCloseTo(T_mean * 0.35, -2);
  });

  test('二冲程应使用不同系数', () => {
    // 使用阶次1，因为4-stroke和2-stroke在此阶次有不同系数
    // 4-stroke 6缸 1阶 = 0.22, 2-stroke 6缸 1阶 = 0.35
    const fourStroke = calculateDieselExcitationTorque({
      power: 400,
      speed: 1000,
      cylinderCount: 6,
      harmonicOrder: 1,
      strokeType: '4-stroke'
    });

    const twoStroke = calculateDieselExcitationTorque({
      power: 400,
      speed: 1000,
      cylinderCount: 6,
      harmonicOrder: 1,
      strokeType: '2-stroke'
    });

    expect(fourStroke).not.toBe(twoStroke);
    expect(twoStroke).toBeGreaterThan(fourStroke);  // 0.35 > 0.22
  });

  test('未知配置应使用默认系数0.1', () => {
    const result = calculateDieselExcitationTorque({
      power: 100,
      speed: 1000,
      cylinderCount: 99,  // 不存在的缸数
      harmonicOrder: 1
    });

    const T_mean = 9550 * 100 / 1000 * 1000;
    expect(result).toBeCloseTo(T_mean * 0.1, -2);
  });

  test('默认为四冲程', () => {
    const result = calculateDieselExcitationTorque({
      power: 100,
      speed: 1000,
      cylinderCount: 6,
      harmonicOrder: 3
    });

    const fourStroke = calculateDieselExcitationTorque({
      power: 100,
      speed: 1000,
      cylinderCount: 6,
      harmonicOrder: 3,
      strokeType: '4-stroke'
    });

    expect(result).toBe(fourStroke);
  });
});

// ============================================================
// calculateElectricExcitationTorque - 电机激励扭矩
// ============================================================

describe('calculateElectricExcitationTorque - 电机激励扭矩', () => {
  test('应正确计算电机激励扭矩', () => {
    const result = calculateElectricExcitationTorque({
      power: 400,
      speed: 1800,
      harmonicOrder: 1
    });

    // T_mean = 9550 × 400 / 1800 × 1000 = 2122222 N·m
    // μ_1 = 0.0012
    const T_mean = 9550 * 400 / 1800 * 1000;
    expect(result).toBeCloseTo(T_mean * 0.0012, -1);
  });

  test('电机激励应远小于柴油机', () => {
    const diesel = calculateDieselExcitationTorque({
      power: 400,
      speed: 1800,
      cylinderCount: 6,
      harmonicOrder: 1
    });

    const electric = calculateElectricExcitationTorque({
      power: 400,
      speed: 1800,
      harmonicOrder: 1
    });

    expect(electric).toBeLessThan(diesel / 10);
  });

  test('未知阶次应使用默认系数0.01', () => {
    const result = calculateElectricExcitationTorque({
      power: 100,
      speed: 1000,
      harmonicOrder: 99  // 不存在的阶次
    });

    const T_mean = 9550 * 100 / 1000 * 1000;
    expect(result).toBeCloseTo(T_mean * 0.01, -2);
  });
});

// ============================================================
// calculatePropellerExcitationTorque - 螺旋桨激励扭矩
// ============================================================

describe('calculatePropellerExcitationTorque - 螺旋桨激励扭矩', () => {
  test('应正确计算螺旋桨激励扭矩', () => {
    const result = calculatePropellerExcitationTorque({
      power: 400,
      speed: 300,  // 螺旋桨转速较低
      bladeCount: 4,
      harmonicOrder: 4
    });

    // T_mean = 9550 × 400 / 300 × 1000 = 12733333 N·m
    // μ_4 for 4叶 = 0.06
    const T_mean = 9550 * 400 / 300 * 1000;
    expect(result).toBeCloseTo(T_mean * 0.06, -3);
  });

  test('3叶桨主阶次应为3', () => {
    const result = calculatePropellerExcitationTorque({
      power: 100,
      speed: 300,
      bladeCount: 3,
      harmonicOrder: 3
    });

    const T_mean = 9550 * 100 / 300 * 1000;
    expect(result).toBeCloseTo(T_mean * 0.08, -2);
  });

  test('未知叶片数应使用默认系数0.02', () => {
    const result = calculatePropellerExcitationTorque({
      power: 100,
      speed: 300,
      bladeCount: 99,  // 不存在的叶片数
      harmonicOrder: 1
    });

    const T_mean = 9550 * 100 / 300 * 1000;
    expect(result).toBeCloseTo(T_mean * 0.02, -2);
  });
});

// ============================================================
// calculateForcedResponse - 强迫振动响应
// ============================================================

describe('calculateForcedResponse - 强迫振动响应', () => {
  const mockNaturalModes = [
    {
      omega: 2 * Math.PI * 20,  // 20 Hz
      modeShape: { amplitudes: [1.0, 0.8, 0.5, 0.2] }
    },
    {
      omega: 2 * Math.PI * 50,  // 50 Hz
      modeShape: { amplitudes: [0.5, 0.3, -0.2, -0.8] }
    }
  ];

  test('应返回正确的响应结构', () => {
    const result = calculateForcedResponse({
      naturalModes: mockNaturalModes,
      excitationTorques: [1000, 0, 0, 500],
      excitationFreq: 15,
      dampingRatio: 0.02
    });

    expect(result.excitationFreq).toBe(15);
    expect(result.responseAmplitudes).toHaveLength(4);
    expect(result.maxAmplitude).toBeDefined();
  });

  test('共振附近应有大响应', () => {
    // 激励频率接近20Hz固有频率
    const nearResonance = calculateForcedResponse({
      naturalModes: mockNaturalModes,
      excitationTorques: [1000, 0, 0, 0],
      excitationFreq: 19.5,  // 接近20Hz
      dampingRatio: 0.02
    });

    // 激励频率远离固有频率
    const farFromResonance = calculateForcedResponse({
      naturalModes: mockNaturalModes,
      excitationTorques: [1000, 0, 0, 0],
      excitationFreq: 35,  // 远离20Hz和50Hz
      dampingRatio: 0.02
    });

    expect(nearResonance.maxAmplitude).toBeGreaterThan(farFromResonance.maxAmplitude);
  });

  test('高阻尼应减小响应', () => {
    const lowDamping = calculateForcedResponse({
      naturalModes: mockNaturalModes,
      excitationTorques: [1000, 0, 0, 0],
      excitationFreq: 20,
      dampingRatio: 0.01
    });

    const highDamping = calculateForcedResponse({
      naturalModes: mockNaturalModes,
      excitationTorques: [1000, 0, 0, 0],
      excitationFreq: 20,
      dampingRatio: 0.1
    });

    expect(lowDamping.maxAmplitude).toBeGreaterThan(highDamping.maxAmplitude);
  });

  test('默认阻尼比为0.02', () => {
    const withDefault = calculateForcedResponse({
      naturalModes: mockNaturalModes,
      excitationTorques: [1000, 0, 0, 0],
      excitationFreq: 15
    });

    const withExplicit = calculateForcedResponse({
      naturalModes: mockNaturalModes,
      excitationTorques: [1000, 0, 0, 0],
      excitationFreq: 15,
      dampingRatio: 0.02
    });

    expect(withDefault.maxAmplitude).toBeCloseTo(withExplicit.maxAmplitude, 10);
  });

  test('零激励应产生零响应', () => {
    const result = calculateForcedResponse({
      naturalModes: mockNaturalModes,
      excitationTorques: [0, 0, 0, 0],
      excitationFreq: 20,
      dampingRatio: 0.02
    });

    expect(result.maxAmplitude).toBe(0);
    expect(result.responseAmplitudes.every(a => a === 0)).toBe(true);
  });
});

// ============================================================
// calculateTorsionalStress - 扭转应力计算
// ============================================================

describe('calculateTorsionalStress - 扭转应力计算', () => {
  test('应正确计算实心轴应力', () => {
    // τ = 16T / (πd³)
    // T = 1000 N·m, d = 100mm = 0.1m
    // Wp = π × 0.1³ / 16 = π × 0.001 / 16 = 1.963e-4 m³
    // τ = 1000 / 1.963e-4 / 1e6 = 5.09 N/mm²
    const result = calculateTorsionalStress(1000, 100);
    expect(result).toBeCloseTo(5.09, 1);
  });

  test('应正确计算空心轴应力', () => {
    // Wp = π(d⁴-di⁴)/(16d)
    // d = 100mm, di = 50mm
    const solidStress = calculateTorsionalStress(1000, 100, 0);
    const hollowStress = calculateTorsionalStress(1000, 100, 50);

    // 空心轴截面模数更小，应力更大
    expect(hollowStress).toBeGreaterThan(solidStress);
  });

  test('大直径应产生小应力', () => {
    const smallShaft = calculateTorsionalStress(1000, 50);
    const largeShaft = calculateTorsionalStress(1000, 100);

    // 应力与直径³成反比
    expect(smallShaft).toBeGreaterThan(largeShaft);
    expect(smallShaft / largeShaft).toBeCloseTo(8, 0);  // (100/50)³ = 8
  });

  test('应返回正值（取绝对值）', () => {
    const result = calculateTorsionalStress(-1000, 100);
    expect(result).toBeGreaterThan(0);
  });
});

// ============================================================
// calculateStressFromAmplitude - 从振幅计算应力
// ============================================================

describe('calculateStressFromAmplitude - 从振幅计算应力', () => {
  test('应正确计算相对扭转角', () => {
    const result = calculateStressFromAmplitude(
      0.01,   // rad
      0.005,  // rad
      1e6,    // N·m/rad
      100     // mm
    );

    expect(result.relativeTwist).toBeCloseTo(0.005, 6);
  });

  test('应正确计算扭矩', () => {
    // T = K × Δθ
    // K = 1e6 N·m/rad, Δθ = 0.005 rad
    // T = 5000 N·m
    const result = calculateStressFromAmplitude(
      0.01,
      0.005,
      1e6,
      100
    );

    expect(result.torque).toBeCloseTo(5000, 0);
    expect(result.torqueKNm).toBeCloseTo(5, 2);
  });

  test('应正确计算应力', () => {
    const result = calculateStressFromAmplitude(
      0.01,
      0.005,
      1e6,
      100
    );

    // 使用calculateTorsionalStress验证
    const expectedStress = calculateTorsionalStress(5000, 100);
    expect(result.stress).toBeCloseTo(expectedStress, 2);
  });

  test('相同振幅应产生零应力', () => {
    const result = calculateStressFromAmplitude(
      0.01,
      0.01,  // 相同振幅
      1e6,
      100
    );

    expect(result.relativeTwist).toBe(0);
    expect(result.torque).toBe(0);
  });

  test('应支持空心轴', () => {
    const solidResult = calculateStressFromAmplitude(0.01, 0.005, 1e6, 100, 0);
    const hollowResult = calculateStressFromAmplitude(0.01, 0.005, 1e6, 100, 50);

    expect(hollowResult.stress).toBeGreaterThan(solidResult.stress);
  });
});

// ============================================================
// 边界条件和特殊情况
// ============================================================

describe('边界条件测试', () => {
  test('calculateAllowableStress 应处理极低强度', () => {
    const result = calculateAllowableStress('intermediate', 100, 'continuous');
    expect(result).toBeGreaterThan(18);  // 至少有基础值18
  });

  test('calculateAllowableStress 应处理极高强度', () => {
    const result = calculateAllowableStress('intermediate', 1500, 'continuous');
    expect(result).toBeLessThan(100);  // 应力应有上限
  });

  test('calculateTorsionalStress 应处理小扭矩', () => {
    const result = calculateTorsionalStress(1, 100);
    expect(result).toBeGreaterThan(0);
    expect(Number.isFinite(result)).toBe(true);
  });

  test('calculateTorsionalStress 应处理大扭矩', () => {
    const result = calculateTorsionalStress(1e9, 100);
    expect(result).toBeGreaterThan(0);
    expect(Number.isFinite(result)).toBe(true);
  });

  test('calculateForcedResponse 应处理空模态数组', () => {
    const result = calculateForcedResponse({
      naturalModes: [],
      excitationTorques: [1000, 0],
      excitationFreq: 20
    });

    // 无模态时响应为零
    expect(result.responseAmplitudes).toHaveLength(2);
    expect(result.maxAmplitude).toBe(0);
  });

  test('calculateForcedResponse 应处理单模态', () => {
    const result = calculateForcedResponse({
      naturalModes: [{
        omega: 2 * Math.PI * 20,
        modeShape: { amplitudes: [1.0, 0.5] }
      }],
      excitationTorques: [1000, 500],
      excitationFreq: 15
    });

    expect(result.maxAmplitude).toBeGreaterThan(0);
  });
});

// ============================================================
// 公式验证
// ============================================================

describe('公式验证', () => {
  test('许用应力公式 - CCS规范', () => {
    // 中间轴: τ_c = 18 + Rm/36
    // 测试几个典型值
    const cases = [
      { Rm: 500, expected: 18 + 500/36 },
      { Rm: 600, expected: 18 + 600/36 },
      { Rm: 700, expected: 18 + 700/36 }
    ];

    for (const { Rm, expected } of cases) {
      const result = calculateAllowableStress('intermediate', Rm, 'continuous');
      expect(result).toBeCloseTo(expected, 2);
    }
  });

  test('扭矩公式 - T = 9550 × P / n', () => {
    // 激励扭矩基于平均扭矩
    const P = 400;  // kW
    const n = 1500; // rpm
    const T_mean_expected = 9550 * P / n * 1000;  // N·m

    // 使用6缸四冲程3阶作为测试
    const mu = 0.50;  // 6缸四冲程3阶系数
    const result = calculateDieselExcitationTorque({
      power: P,
      speed: n,
      cylinderCount: 6,
      harmonicOrder: 3
    });

    expect(result).toBeCloseTo(T_mean_expected * mu, -3);
  });

  test('极截面模数公式 - Wp = π(d⁴-di⁴)/(16d)', () => {
    // 验证通过应力计算
    const T = 1000;  // N·m
    const d = 80;    // mm
    const di = 40;   // mm

    const d_m = d / 1000;
    const di_m = di / 1000;
    const Wp = Math.PI * (Math.pow(d_m, 4) - Math.pow(di_m, 4)) / (16 * d_m);
    const expectedStress = T / Wp / 1e6;

    const result = calculateTorsionalStress(T, d, di);
    expect(result).toBeCloseTo(expectedStress, 4);
  });
});

// ============================================================
// 工程案例验证
// ============================================================

describe('工程案例验证', () => {
  test('海巡06402电机系统参考', () => {
    // 400kW / 1800rpm 电机
    // COMPASS参考: 中间轴应力 0.022 N/mm²

    // 计算电机激励
    const torque = calculateElectricExcitationTorque({
      power: 400,
      speed: 1800,
      harmonicOrder: 1
    });

    // 激励扭矩应在合理范围
    expect(torque).toBeGreaterThan(1000);
    expect(torque).toBeLessThan(10000);
  });

  test('典型6缸柴油机激励', () => {
    // 400kW / 1000rpm 柴油机
    const torque = calculateDieselExcitationTorque({
      power: 400,
      speed: 1000,
      cylinderCount: 6,
      harmonicOrder: 3  // 主阶次
    });

    // 平均扭矩 ≈ 3.82 kN·m, 激励扭矩 ≈ 1.91 kN·m (50%)
    expect(torque).toBeGreaterThan(1000000);
  });

  test('许用应力应在合理范围', () => {
    // 35号钢: Rm ≈ 530 MPa
    // 45号钢: Rm ≈ 600 MPa

    const stress35 = calculateAllowableStress('intermediate', 530, 'continuous');
    const stress45 = calculateAllowableStress('intermediate', 600, 'continuous');

    // 许用应力通常在25-45 N/mm²范围
    expect(stress35).toBeGreaterThan(25);
    expect(stress35).toBeLessThan(45);
    expect(stress45).toBeGreaterThan(stress35);
  });
});

// ============================================================
// 默认导出测试
// ============================================================

describe('默认导出', () => {
  test('应导出所有公共函数和常量', async () => {
    const module = await import('../forcedVibrationAnalysis');
    const defaultExport = module.default;

    expect(defaultExport.DIESEL_HARMONIC_COEFFICIENTS).toBeDefined();
    expect(defaultExport.ELECTRIC_MOTOR_HARMONICS).toBeDefined();
    expect(defaultExport.PROPELLER_HARMONIC_COEFFICIENTS).toBeDefined();
    expect(defaultExport.calculateAllowableStress).toBeDefined();
    expect(defaultExport.calculateAllAllowableStresses).toBeDefined();
    expect(defaultExport.calculateDieselExcitationTorque).toBeDefined();
    expect(defaultExport.calculateElectricExcitationTorque).toBeDefined();
    expect(defaultExport.calculatePropellerExcitationTorque).toBeDefined();
    expect(defaultExport.calculateForcedResponse).toBeDefined();
    expect(defaultExport.calculateTorsionalStress).toBeDefined();
    expect(defaultExport.calculateStressFromAmplitude).toBeDefined();
    expect(defaultExport.runForcedVibrationAnalysis).toBeDefined();
  });
});

// ============================================================
// runForcedVibrationAnalysis - 完整强迫振动分析集成测试
// ============================================================

import forcedVibrationModule from '../forcedVibrationAnalysis';

const { runForcedVibrationAnalysis } = forcedVibrationModule;

describe('runForcedVibrationAnalysis - 完整强迫振动分析', () => {
  // 创建模拟的系统输入
  const createMockSystemInput = (overrides = {}) => ({
    units: [
      { type: 'mass', name: '发动机', inertia: 0.5, torsionalFlexibility: 0 },
      { type: 'shaft', name: '中间轴 I.S.', inertia: 0.02, torsionalFlexibility: 1e7, outerDiameter: 60 },
      { type: 'gear', name: '主动齿轮', inertia: 0.1, torsionalFlexibility: 5e6 },
      { type: 'gear', name: '从动齿轮', inertia: 0.15, torsionalFlexibility: 5e6 },
      { type: 'shaft', name: '艉轴 P.S.', inertia: 0.03, torsionalFlexibility: 2e7, outerDiameter: 90 },
      { type: 'mass', name: '螺旋桨', inertia: 1.2, torsionalFlexibility: 0 }
    ],
    powerSource: {
      type: 'diesel',
      ratedPower: 400,
      ratedSpeed: 1800,
      cylinderCount: 6
    },
    propeller: {
      bladeCount: 4,
      considerPropellerExcitation: true,
      shaftTensileStrength: 520
    },
    systemLayout: {
      intermediateShaftTensileStrength: 650
    },
    analysisSettings: {
      speedRange: { min: 500, max: 1000 },
      speedStep: 100,
      dampingRatio: 0.02
    },
    elasticCouplings: [],
    gearMeshes: [],
    ...overrides
  });

  // 创建模拟的自由振动结果
  const createMockFreeVibrationResults = () => ({
    naturalFrequencies: [
      {
        frequency: 25,
        omega: 2 * Math.PI * 25,
        modeShape: { amplitudes: [1.0, 0.8, 0.6, 0.5, 0.3, 0.1] }
      },
      {
        frequency: 60,
        omega: 2 * Math.PI * 60,
        modeShape: { amplitudes: [0.5, 0.2, -0.3, -0.5, -0.8, -1.0] }
      }
    ]
  });

  test('应返回完整的分析结果结构', () => {
    const systemInput = createMockSystemInput();
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result).toBeDefined();
    expect(result.combinedResults).toBeDefined();
    expect(result.allowableStress).toBeDefined();
    expect(result.chartData).toBeDefined();
    expect(result.verification).toBeDefined();
    expect(result.excitationOrders).toBeDefined();
    expect(result.timestamp).toBeDefined();
  });

  test('应计算多个转速点的结果', () => {
    const systemInput = createMockSystemInput({
      analysisSettings: {
        speedRange: { min: 500, max: 800 },
        speedStep: 100,
        dampingRatio: 0.02
      }
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    // 500, 600, 700, 800 = 4个点
    expect(result.combinedResults.length).toBe(4);
    expect(result.combinedResults[0].speed).toBe(500);
    expect(result.combinedResults[3].speed).toBe(800);
  });

  test('柴油机激励应包含正确的谐波阶次', () => {
    const systemInput = createMockSystemInput({
      powerSource: {
        type: 'diesel',
        ratedPower: 400,
        ratedSpeed: 1800,
        cylinderCount: 6
      },
      propeller: {
        bladeCount: 4,
        considerPropellerExcitation: false  // 禁用螺旋桨激励
      }
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    // 6缸四冲程柴油机阶次: 0.5, 1, 1.5, 2, 3, 4.5, 6
    expect(result.excitationOrders).toContain(3);
    expect(result.excitationOrders).toContain(6);
  });

  test('电机激励应包含正确的谐波阶次', () => {
    const systemInput = createMockSystemInput({
      powerSource: {
        type: 'electric',
        ratedPower: 400,
        ratedSpeed: 1800
      },
      propeller: {
        bladeCount: 4,
        considerPropellerExcitation: false
      }
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    // 电机阶次: 1, 2, 6, 12
    expect(result.excitationOrders).toContain(1);
    expect(result.excitationOrders).toContain(2);
  });

  test('启用螺旋桨激励时应包含叶片阶次', () => {
    const systemInput = createMockSystemInput({
      powerSource: {
        type: 'electric',
        ratedPower: 400,
        ratedSpeed: 1800
      },
      propeller: {
        bladeCount: 4,
        considerPropellerExcitation: true
      }
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    // 4叶桨阶次: 4, 8, 12
    expect(result.excitationOrders).toContain(4);
    expect(result.excitationOrders).toContain(8);
  });

  test('应计算中间轴和螺旋桨轴应力', () => {
    const systemInput = createMockSystemInput();
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    result.combinedResults.forEach(speedResult => {
      expect(speedResult.intermediateShaftStress).toBeDefined();
      expect(speedResult.propellerShaftStress).toBeDefined();
      expect(typeof speedResult.intermediateShaftStress).toBe('number');
      expect(typeof speedResult.propellerShaftStress).toBe('number');
    });
  });

  test('应返回许用应力数据', () => {
    const systemInput = createMockSystemInput();
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result.allowableStress.intermediateShaft.continuous).toBeGreaterThan(0);
    expect(result.allowableStress.intermediateShaft.transient).toBeGreaterThan(0);
    expect(result.allowableStress.propellerShaft.continuous).toBeGreaterThan(0);
    expect(result.allowableStress.propellerShaft.transient).toBeGreaterThan(0);
  });

  test('应生成图表数据', () => {
    const systemInput = createMockSystemInput();
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result.chartData.stressVsSpeed).toBeDefined();
    expect(result.chartData.stressVsSpeed.intermediateShaft).toBeDefined();
    expect(result.chartData.stressVsSpeed.propellerShaft).toBeDefined();
    expect(result.chartData.amplitudeVsSpeed).toBeDefined();
    expect(result.chartData.torqueVsSpeed).toBeDefined();
  });

  test('应返回验证结果', () => {
    const systemInput = createMockSystemInput();
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result.verification).toBeDefined();
    expect(typeof result.verification.isValid).toBe('boolean');
    expect(result.verification.maxIntermediateStress).toBeDefined();
    expect(result.verification.maxPropellerStress).toBeDefined();
    expect(result.verification.warnings).toBeDefined();
    expect(result.verification.recommendations).toBeDefined();
  });

  test('应使用默认分析设置', () => {
    const systemInput = createMockSystemInput({
      analysisSettings: undefined  // 未提供设置
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    // 应使用默认值: min=100, max=2000, step=10
    expect(result.combinedResults.length).toBeGreaterThan(0);
  });

  test('应处理无弹性联轴器的情况', () => {
    const systemInput = createMockSystemInput({
      elasticCouplings: undefined
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result).toBeDefined();
    expect(result.combinedResults.length).toBeGreaterThan(0);
  });

  test('应处理带联轴器单元的系统', () => {
    const systemInput = createMockSystemInput({
      units: [
        { type: 'mass', name: '发动机', inertia: 0.5, torsionalFlexibility: 0 },
        { type: 'coupling', name: '高弹联轴器', inertia: 0.01, torsionalFlexibility: 2e6 },
        { type: 'shaft', name: '中间轴', inertia: 0.02, torsionalFlexibility: 1e7, outerDiameter: 60 },
        { type: 'shaft', name: '螺旋桨轴', inertia: 0.03, torsionalFlexibility: 2e7, outerDiameter: 90 },
        { type: 'mass', name: '螺旋桨', inertia: 1.2, torsionalFlexibility: 0 }
      ]
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result).toBeDefined();
    // 联轴器扭矩应有值
    result.combinedResults.forEach(speedResult => {
      expect(speedResult.couplingTorque).toBeDefined();
    });
  });

  test('验证结果应标识超限情况', () => {
    // 创建一个可能超限的系统（小直径、大功率）
    const systemInput = createMockSystemInput({
      units: [
        { type: 'mass', name: '发动机', inertia: 0.5, torsionalFlexibility: 0 },
        { type: 'shaft', name: '中间轴', inertia: 0.02, torsionalFlexibility: 1e7, outerDiameter: 30 },  // 很小的轴
        { type: 'shaft', name: '螺旋桨轴', inertia: 0.03, torsionalFlexibility: 2e7, outerDiameter: 40 },
        { type: 'mass', name: '螺旋桨', inertia: 1.2, torsionalFlexibility: 0 }
      ],
      powerSource: {
        type: 'diesel',
        ratedPower: 1000,  // 大功率
        ratedSpeed: 1000,
        cylinderCount: 6
      }
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    // 验证结果应包含margin信息
    expect(result.verification.intermediateMargin).toBeDefined();
    expect(result.verification.propellerMargin).toBeDefined();
  });

  test('应记录谐波结果详情', () => {
    const systemInput = createMockSystemInput({
      analysisSettings: {
        speedRange: { min: 1000, max: 1000 },  // 单点
        speedStep: 100,
        dampingRatio: 0.02
      }
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    const speedResult = result.combinedResults[0];
    expect(speedResult.harmonicResults).toBeDefined();
    expect(speedResult.harmonicResults.length).toBeGreaterThan(0);

    speedResult.harmonicResults.forEach(harmonic => {
      expect(harmonic.order).toBeDefined();
      expect(harmonic.excitationFreq).toBeDefined();
      expect(harmonic.response).toBeDefined();
    });
  });

  test('应计算RMS合成振幅', () => {
    const systemInput = createMockSystemInput();
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    result.combinedResults.forEach(speedResult => {
      expect(speedResult.massAmplitude).toBeDefined();
      expect(typeof speedResult.massAmplitude).toBe('number');
      expect(speedResult.massAmplitude).toBeGreaterThanOrEqual(0);
    });
  });

  test('图表数据应包含许用应力线', () => {
    const systemInput = createMockSystemInput();
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    const intermediateChart = result.chartData.stressVsSpeed.intermediateShaft;
    expect(intermediateChart.allowableContinuous).toBeDefined();
    expect(intermediateChart.allowableTransient).toBeDefined();
    expect(intermediateChart.speeds.length).toBe(intermediateChart.stresses.length);
  });

  test('使用提供的齿轮啮合数据', () => {
    const systemInput = createMockSystemInput({
      gearMeshes: [
        {
          drivingUnit: 3,
          drivenUnit: 4,
          ratio: 2.5,
          meshStiffness: 1e8
        }
      ]
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result).toBeDefined();
    result.combinedResults.forEach(speedResult => {
      expect(speedResult.gearMeshTorques).toBeDefined();
    });
  });

  test('使用提供的弹性联轴器数据', () => {
    const systemInput = createMockSystemInput({
      elasticCouplings: [
        {
          unitNumber: 2,
          torsionalStiffness: 5e5
        }
      ]
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result).toBeDefined();
    result.combinedResults.forEach(speedResult => {
      expect(speedResult.couplingTorque).toBeDefined();
    });
  });

  test('应处理通用命名的轴单元（无中间轴/I.S.命名）', () => {
    // 创建一个系统，轴单元不包含'中间'或'I.S.'名称
    // 这将触发 intermediateIdx 的回退逻辑 (line 664)
    const systemInput = createMockSystemInput({
      units: [
        { type: 'mass', name: '发动机', inertia: 0.5, torsionalFlexibility: 0 },
        { type: 'shaft', name: '传动轴1', inertia: 0.02, torsionalFlexibility: 1e7, outerDiameter: 60 },
        { type: 'shaft', name: '传动轴2', inertia: 0.03, torsionalFlexibility: 2e7, outerDiameter: 90 },
        { type: 'mass', name: '螺旋桨', inertia: 1.2, torsionalFlexibility: 0 }
      ]
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result).toBeDefined();
    // 应正常计算中间轴应力（使用第一个shaft类型单元）
    expect(result.verification.intermediateMargin).toBeDefined();
  });

  test('应处理无螺旋桨轴命名的系统（触发回退循环）', () => {
    // 创建一个系统，轴单元不包含'艉'、'P.S.'或'螺旋桨'名称
    // 这将触发 propellerIdx 的回退循环逻辑 (lines 673-676)
    const systemInput = createMockSystemInput({
      units: [
        { type: 'mass', name: '发动机', inertia: 0.5, torsionalFlexibility: 0 },
        { type: 'shaft', name: '输出轴A', inertia: 0.02, torsionalFlexibility: 1e7, outerDiameter: 60 },
        { type: 'shaft', name: '输出轴B', inertia: 0.03, torsionalFlexibility: 2e7, outerDiameter: 90 },
        { type: 'mass', name: '负载', inertia: 1.2, torsionalFlexibility: 0 }
      ]
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result).toBeDefined();
    // 应正常计算螺旋桨轴应力（使用最后一个shaft类型单元）
    expect(result.verification.propellerMargin).toBeDefined();
  });

  test('应处理无任何轴单元的系统', () => {
    // 创建一个只有mass类型的系统
    // 这将触发所有回退逻辑
    const systemInput = createMockSystemInput({
      units: [
        { type: 'mass', name: '发动机', inertia: 0.5, torsionalFlexibility: 0 },
        { type: 'mass', name: '飞轮', inertia: 0.1, torsionalFlexibility: 5e6 },
        { type: 'mass', name: '负载', inertia: 1.2, torsionalFlexibility: 0 }
      ]
    });
    const freeVibrationResults = createMockFreeVibrationResults();

    const result = runForcedVibrationAnalysis(systemInput, freeVibrationResults);

    expect(result).toBeDefined();
    // 应使用默认索引进行计算
    expect(result.combinedResults.length).toBeGreaterThan(0);
  });
});
