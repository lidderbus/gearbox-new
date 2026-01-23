/**
 * shaftCalculations.js 测试文件
 *
 * 轴系强度校核计算模块
 * 覆盖常量定义、计算函数、完整计算流程等
 */

import {
  // 常量
  SHAFT_F_COEFFICIENTS,
  POWER_SOURCE_K_COEFFICIENTS,
  FLANGE_COEFFICIENTS,
  KEY_STRESS_COEFFICIENTS,
  BOLT_FRICTION_COEFFICIENT,
  STERN_BEARING_MIN_LENGTH_RATIO,
  SHAFT_MATERIALS,
  BOLT_MATERIALS,
  BEARING_ALLOWABLE_PRESSURE,
  // 函数
  createDefaultInput,
  calculateBasicShaftDiameter,
  calculateCouplingFlange,
  calculateKeyStrength,
  calculateBoltStrength,
  calculateBearingLength,
  runFullCalculation
} from '../shaftCalculations';

// ============================================================
// 常量测试
// ============================================================

describe('SHAFT_F_COEFFICIENTS - 轴径计算系数', () => {
  test('艉轴系数应为100', () => {
    expect(SHAFT_F_COEFFICIENTS.STERN_SHAFT).toBe(100);
  });

  test('中间轴系数应为95', () => {
    expect(SHAFT_F_COEFFICIENTS.INTERMEDIATE_SHAFT).toBe(95);
  });
});

describe('POWER_SOURCE_K_COEFFICIENTS - 动力源类型系数', () => {
  test('内燃机系数应为1.0', () => {
    expect(POWER_SOURCE_K_COEFFICIENTS.DIESEL).toBe(1.0);
  });

  test('电机系数应为0.9 (振动小)', () => {
    expect(POWER_SOURCE_K_COEFFICIENTS.ELECTRIC).toBe(0.9);
  });
});

describe('FLANGE_COEFFICIENTS - 法兰设计系数', () => {
  test('最小厚度比应为0.2', () => {
    expect(FLANGE_COEFFICIENTS.MIN_THICKNESS_RATIO).toBe(0.2);
  });

  test('最小圆角比应为0.08', () => {
    expect(FLANGE_COEFFICIENTS.MIN_RADIUS_RATIO).toBe(0.08);
  });
});

describe('KEY_STRESS_COEFFICIENTS - 键强度许用应力系数', () => {
  test('剪切许用比应为0.25', () => {
    expect(KEY_STRESS_COEFFICIENTS.SHEAR_ALLOWABLE_RATIO).toBe(0.25);
  });

  test('挤压许用比应为0.5', () => {
    expect(KEY_STRESS_COEFFICIENTS.COMPRESSION_ALLOWABLE_RATIO).toBe(0.5);
  });
});

describe('BOLT_FRICTION_COEFFICIENT - 螺栓摩擦系数', () => {
  test('默认摩擦系数应为0.2', () => {
    expect(BOLT_FRICTION_COEFFICIENT).toBe(0.2);
  });
});

describe('STERN_BEARING_MIN_LENGTH_RATIO - 艉轴承最小长度系数', () => {
  test('最小长度比应为2 (2倍轴径)', () => {
    expect(STERN_BEARING_MIN_LENGTH_RATIO).toBe(2);
  });
});

describe('SHAFT_MATERIALS - 轴材料数据库', () => {
  test('应包含35号钢', () => {
    expect(SHAFT_MATERIALS['35']).toBeDefined();
    expect(SHAFT_MATERIALS['35'].Rm).toBe(530);
    expect(SHAFT_MATERIALS['35'].ReL).toBe(315);
  });

  test('应包含45号钢', () => {
    expect(SHAFT_MATERIALS['45']).toBeDefined();
    expect(SHAFT_MATERIALS['45'].Rm).toBe(600);
    expect(SHAFT_MATERIALS['45'].ReL).toBe(355);
  });

  test('应包含40Cr合金钢', () => {
    expect(SHAFT_MATERIALS['40Cr']).toBeDefined();
    expect(SHAFT_MATERIALS['40Cr'].Rm).toBe(785);
    expect(SHAFT_MATERIALS['40Cr'].ReL).toBe(540);
  });

  test('应包含42CrMo高强度钢', () => {
    expect(SHAFT_MATERIALS['42CrMo']).toBeDefined();
    expect(SHAFT_MATERIALS['42CrMo'].Rm).toBe(1080);
    expect(SHAFT_MATERIALS['42CrMo'].ReL).toBe(930);
  });

  test('所有材料应有必要属性', () => {
    Object.values(SHAFT_MATERIALS).forEach(material => {
      expect(material.grade).toBeDefined();
      expect(material.Rm).toBeGreaterThan(0);
      expect(material.ReL).toBeGreaterThan(0);
      expect(material.description).toBeDefined();
    });
  });
});

describe('BOLT_MATERIALS - 螺栓材料数据库', () => {
  test('应包含35号钢螺栓 (6.6级)', () => {
    expect(BOLT_MATERIALS['35']).toBeDefined();
    expect(BOLT_MATERIALS['35'].strengthClass).toBe('6.6');
  });

  test('应包含45号钢螺栓 (8.8级)', () => {
    expect(BOLT_MATERIALS['45']).toBeDefined();
    expect(BOLT_MATERIALS['45'].strengthClass).toBe('8.8');
  });

  test('应包含40Cr螺栓 (10.9级)', () => {
    expect(BOLT_MATERIALS['40Cr']).toBeDefined();
    expect(BOLT_MATERIALS['40Cr'].strengthClass).toBe('10.9');
  });
});

describe('BEARING_ALLOWABLE_PRESSURE - 轴承许用压强', () => {
  test('白合金轴承许用压强应为0.8 MPa', () => {
    expect(BEARING_ALLOWABLE_PRESSURE.WHITE_METAL).toBe(0.8);
  });

  test('橡胶轴承许用压强应为0.55 MPa', () => {
    expect(BEARING_ALLOWABLE_PRESSURE.RUBBER).toBe(0.55);
  });

  test('合成树脂轴承许用压强应为0.65 MPa', () => {
    expect(BEARING_ALLOWABLE_PRESSURE.SYNTHETIC_RESIN).toBe(0.65);
  });
});

// ============================================================
// createDefaultInput 测试
// ============================================================

describe('createDefaultInput - 默认输入模板', () => {
  test('应返回完整的输入结构', () => {
    const input = createDefaultInput();

    expect(input).toHaveProperty('powerSource');
    expect(input).toHaveProperty('gearbox');
    expect(input).toHaveProperty('shaftMaterial');
    expect(input).toHaveProperty('boltMaterial');
    expect(input).toHaveProperty('shaftDimensions');
    expect(input).toHaveProperty('bearingType');
    expect(input).toHaveProperty('propeller');
  });

  test('powerSource 应有默认值', () => {
    const input = createDefaultInput();

    expect(input.powerSource.type).toBe('diesel');
    expect(input.powerSource.power).toBe(200);
    expect(input.powerSource.speed).toBe(1500);
  });

  test('gearbox 应有默认值', () => {
    const input = createDefaultInput();

    expect(input.gearbox.ratio).toBe(3.0);
  });

  test('shaftMaterial 应默认为35号钢', () => {
    const input = createDefaultInput();

    expect(input.shaftMaterial.grade).toBe('35');
    expect(input.shaftMaterial.Rm).toBe(530);
  });

  test('shaftDimensions 应包含艉轴和中间轴', () => {
    const input = createDefaultInput();

    expect(input.shaftDimensions.sternShaft).toBeDefined();
    expect(input.shaftDimensions.intermediateShaft).toBeDefined();
  });

  test('bearingType 应默认为白合金', () => {
    const input = createDefaultInput();

    expect(input.bearingType).toBe('WHITE_METAL');
  });

  test('propeller 应有默认叶片数', () => {
    const input = createDefaultInput();

    expect(input.propeller.bladeCount).toBe(4);
  });
});

// ============================================================
// calculateBasicShaftDiameter 测试
// ============================================================

describe('calculateBasicShaftDiameter - 基本轴径计算', () => {
  test('应正确计算艉轴直径', () => {
    const result = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    expect(result.diameter).toBeGreaterThan(0);
    expect(result.diameterExact).toBeDefined();
    expect(result.F).toBe(100);
    expect(result.K).toBe(1.0);
    expect(result.shaftType).toBe('stern');
  });

  test('应正确计算中间轴直径', () => {
    const result = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530,
      shaftType: 'intermediate',
      powerSourceType: 'diesel'
    });

    expect(result.diameter).toBeGreaterThan(0);
    expect(result.F).toBe(95);
    expect(result.shaftType).toBe('intermediate');
  });

  test('中间轴直径应小于艉轴直径', () => {
    const sternResult = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    const intermediateResult = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530,
      shaftType: 'intermediate',
      powerSourceType: 'diesel'
    });

    expect(intermediateResult.diameter).toBeLessThanOrEqual(sternResult.diameter);
  });

  test('电机驱动应产生更小的轴径 (K=0.9)', () => {
    const dieselResult = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    const electricResult = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'electric'
    });

    expect(electricResult.K).toBe(0.9);
    expect(electricResult.diameter).toBeLessThan(dieselResult.diameter);
  });

  test('高强度材料应产生更小的轴径', () => {
    const steel35Result = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530, // 35号钢
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    const steel42CrMoResult = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 1080, // 42CrMo
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    expect(steel42CrMoResult.diameter).toBeLessThan(steel35Result.diameter);
  });

  test('更高功率应产生更大的轴径', () => {
    const lowPowerResult = calculateBasicShaftDiameter({
      power: 100,
      speed: 1500,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    const highPowerResult = calculateBasicShaftDiameter({
      power: 400,
      speed: 1500,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    expect(highPowerResult.diameter).toBeGreaterThan(lowPowerResult.diameter);
  });

  test('更高转速应产生更小的轴径', () => {
    const lowSpeedResult = calculateBasicShaftDiameter({
      power: 200,
      speed: 1000,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    const highSpeedResult = calculateBasicShaftDiameter({
      power: 200,
      speed: 2000,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    expect(highSpeedResult.diameter).toBeLessThan(lowSpeedResult.diameter);
  });

  test('应生成计算公式', () => {
    const result = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    expect(result.formula).toBeDefined();
    expect(result.formula).toContain('200');
    expect(result.formula).toContain('1500');
    expect(result.formula).toContain('530');
  });

  test('应使用默认值', () => {
    const result = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530
      // shaftType 和 powerSourceType 使用默认值
    });

    expect(result.shaftType).toBe('stern');
    expect(result.powerSourceType).toBe('diesel');
  });

  test('直径应向上取整', () => {
    const result = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    expect(Number.isInteger(result.diameter)).toBe(true);
    expect(result.diameter).toBeGreaterThanOrEqual(parseFloat(result.diameterExact));
  });
});

// ============================================================
// calculateCouplingFlange 测试
// ============================================================

describe('calculateCouplingFlange - 法兰参数计算', () => {
  test('应正确计算最小法兰厚度', () => {
    const result = calculateCouplingFlange({
      shaftDiameter: 100
    });

    // t1 ≥ 0.2d = 0.2 × 100 = 20mm
    expect(result.minThickness).toBe(20);
  });

  test('应正确计算最小过渡圆角', () => {
    const result = calculateCouplingFlange({
      shaftDiameter: 100
    });

    // r1 ≥ 0.08d = 0.08 × 100 = 8mm
    expect(result.minRadius).toBe(8);
  });

  test('应校核实际厚度 - 合格', () => {
    const result = calculateCouplingFlange({
      shaftDiameter: 100,
      actualThickness: 25
    });

    expect(result.thicknessValid).toBe(true);
  });

  test('应校核实际厚度 - 不合格', () => {
    const result = calculateCouplingFlange({
      shaftDiameter: 100,
      actualThickness: 15
    });

    expect(result.thicknessValid).toBe(false);
  });

  test('应校核实际圆角 - 合格', () => {
    const result = calculateCouplingFlange({
      shaftDiameter: 100,
      actualRadius: 10
    });

    expect(result.radiusValid).toBe(true);
  });

  test('应校核实际圆角 - 不合格', () => {
    const result = calculateCouplingFlange({
      shaftDiameter: 100,
      actualRadius: 5
    });

    expect(result.radiusValid).toBe(false);
  });

  test('未提供实际值时校核结果应为null', () => {
    const result = calculateCouplingFlange({
      shaftDiameter: 100
    });

    expect(result.thicknessValid).toBeNull();
    expect(result.radiusValid).toBeNull();
  });

  test('isValid 应正确判断', () => {
    // 全部合格
    const validResult = calculateCouplingFlange({
      shaftDiameter: 100,
      actualThickness: 25,
      actualRadius: 10
    });
    expect(validResult.isValid).toBe(true);

    // 有不合格项
    const invalidResult = calculateCouplingFlange({
      shaftDiameter: 100,
      actualThickness: 15,
      actualRadius: 10
    });
    expect(invalidResult.isValid).toBe(false);
  });

  test('应生成计算公式', () => {
    const result = calculateCouplingFlange({
      shaftDiameter: 100
    });

    expect(result.formulas).toBeDefined();
    expect(result.formulas.thickness).toContain('100');
    expect(result.formulas.radius).toContain('100');
  });
});

// ============================================================
// calculateKeyStrength 测试
// ============================================================

describe('calculateKeyStrength - 键强度校核', () => {
  const baseParams = {
    torque: 1000000,    // 1000 N·m = 1,000,000 N·mm
    keyWidth: 20,       // mm
    keyHeight: 12,      // mm
    keyLength: 100,     // mm
    shaftDiameter: 80,  // mm
    Rm: 600             // MPa (45号钢)
  };

  test('应正确计算剪切应力', () => {
    const result = calculateKeyStrength(baseParams);

    // τ = T / (0.5 × b × l × d)
    // τ = 1000000 / (0.5 × 20 × 100 × 80) = 12.5 MPa
    expect(parseFloat(result.shearStress)).toBeCloseTo(12.5, 1);
  });

  test('应正确计算挤压应力', () => {
    const result = calculateKeyStrength(baseParams);

    // σ = T / (0.25 × h × l × d)
    // σ = 1000000 / (0.25 × 12 × 100 × 80) = 41.67 MPa
    expect(parseFloat(result.compressStress)).toBeCloseTo(41.67, 0);
  });

  test('应正确计算许用剪切应力', () => {
    const result = calculateKeyStrength(baseParams);

    // [τ] = 0.25 × Rm = 0.25 × 600 = 150 MPa
    expect(parseFloat(result.allowableShear)).toBe(150);
  });

  test('应正确计算许用挤压应力', () => {
    const result = calculateKeyStrength(baseParams);

    // [σ] = 0.5 × Rm = 0.5 × 600 = 300 MPa
    expect(parseFloat(result.allowableCompress)).toBe(300);
  });

  test('应判断剪切校核通过', () => {
    const result = calculateKeyStrength(baseParams);

    expect(result.shearValid).toBe(true);
  });

  test('应判断挤压校核通过', () => {
    const result = calculateKeyStrength(baseParams);

    expect(result.compressValid).toBe(true);
  });

  test('应计算安全系数', () => {
    const result = calculateKeyStrength(baseParams);

    expect(parseFloat(result.safetyFactorShear)).toBeGreaterThan(1);
    expect(parseFloat(result.safetyFactorCompress)).toBeGreaterThan(1);
  });

  test('高扭矩应导致校核失败', () => {
    const highTorqueResult = calculateKeyStrength({
      ...baseParams,
      torque: 50000000 // 50000 N·m
    });

    // 剪切应力会很高
    expect(highTorqueResult.shearValid || highTorqueResult.compressValid).toBe(false);
  });

  test('应生成计算公式', () => {
    const result = calculateKeyStrength(baseParams);

    expect(result.formulas).toBeDefined();
    expect(result.formulas.shear).toBeDefined();
    expect(result.formulas.compress).toBeDefined();
  });

  test('isValid 应综合判断', () => {
    const result = calculateKeyStrength(baseParams);

    expect(result.isValid).toBe(result.shearValid && result.compressValid);
  });
});

// ============================================================
// calculateBoltStrength 测试
// ============================================================

describe('calculateBoltStrength - 螺栓强度校核', () => {
  const baseParams = {
    torque: 1000000,      // N·mm
    boltDiameter: 16,     // mm
    boltCount: 8,
    boltCircleDia: 200,   // mm
    preloadForce: 50000   // N
  };

  test('应正确计算预紧力矩', () => {
    const result = calculateBoltStrength(baseParams);

    // T0 = K × d × F0 = 0.2 × 16 × 50000 = 160,000 N·mm
    expect(parseFloat(result.preloadTorque)).toBeCloseTo(160000, 0);
  });

  test('应正确计算摩擦传递力矩', () => {
    const result = calculateBoltStrength(baseParams);

    // Tf = μ × n × F0 × D/2 = 0.2 × 8 × 50000 × 100 = 8,000,000 N·mm
    expect(parseFloat(result.frictionTorque)).toBeCloseTo(8000000, 0);
  });

  test('摩擦力矩足够时应通过校核', () => {
    const result = calculateBoltStrength(baseParams);

    expect(result.isValid).toBe(true);
  });

  test('摩擦力矩不足时应校核失败', () => {
    const insufficientResult = calculateBoltStrength({
      ...baseParams,
      torque: 20000000 // 很大的扭矩
    });

    expect(insufficientResult.isValid).toBe(false);
  });

  test('应计算安全系数', () => {
    const result = calculateBoltStrength(baseParams);

    expect(parseFloat(result.safetyFactor)).toBeGreaterThan(1);
  });

  test('应使用默认摩擦系数', () => {
    const result = calculateBoltStrength(baseParams);

    // 默认摩擦系数0.2
    expect(parseFloat(result.preloadTorque)).toBeCloseTo(0.2 * 16 * 50000, 0);
  });

  test('应支持自定义摩擦系数', () => {
    const customResult = calculateBoltStrength({
      ...baseParams,
      frictionCoef: 0.3
    });

    // T0 = 0.3 × 16 × 50000 = 240,000
    expect(parseFloat(customResult.preloadTorque)).toBeCloseTo(240000, 0);
  });

  test('应生成计算公式', () => {
    const result = calculateBoltStrength(baseParams);

    expect(result.formulas).toBeDefined();
    expect(result.formulas.preload).toBeDefined();
    expect(result.formulas.friction).toBeDefined();
  });
});

// ============================================================
// calculateBearingLength 测试
// ============================================================

describe('calculateBearingLength - 轴承长度校核', () => {
  test('应正确计算最小轴承长度', () => {
    const result = calculateBearingLength({
      shaftDiameter: 100
    });

    // Lm ≥ 2d = 2 × 100 = 200mm
    expect(result.minLength).toBe(200);
  });

  test('实际长度足够时应通过校核', () => {
    const result = calculateBearingLength({
      shaftDiameter: 100,
      actualLength: 250
    });

    expect(result.isValid).toBe(true);
  });

  test('实际长度不足时应校核失败', () => {
    const result = calculateBearingLength({
      shaftDiameter: 100,
      actualLength: 150
    });

    expect(result.isValid).toBe(false);
  });

  test('未提供实际长度时校核结果应为null', () => {
    const result = calculateBearingLength({
      shaftDiameter: 100
    });

    expect(result.isValid).toBeNull();
  });

  test('应返回轴承类型的许用压强', () => {
    const whiteMetalResult = calculateBearingLength({
      shaftDiameter: 100,
      bearingType: 'WHITE_METAL'
    });
    expect(whiteMetalResult.allowablePressure).toBe(0.8);

    const rubberResult = calculateBearingLength({
      shaftDiameter: 100,
      bearingType: 'RUBBER'
    });
    expect(rubberResult.allowablePressure).toBe(0.55);
  });

  test('未知轴承类型应使用白合金默认值', () => {
    const result = calculateBearingLength({
      shaftDiameter: 100,
      bearingType: 'UNKNOWN'
    });

    expect(result.allowablePressure).toBe(0.8);
  });

  test('应使用默认轴承类型', () => {
    const result = calculateBearingLength({
      shaftDiameter: 100
    });

    expect(result.bearingType).toBe('WHITE_METAL');
  });

  test('应生成计算公式', () => {
    const result = calculateBearingLength({
      shaftDiameter: 100
    });

    expect(result.formula).toBeDefined();
    expect(result.formula).toContain('100');
    expect(result.formula).toContain('200');
  });
});

// ============================================================
// runFullCalculation 测试
// ============================================================

describe('runFullCalculation - 完整轴系计算', () => {
  const createFullInput = (overrides = {}) => ({
    powerSource: {
      type: 'diesel',
      power: 200,
      speed: 1500,
      ...(overrides.powerSource || {})
    },
    gearbox: {
      model: 'HC400',
      ratio: 3.0,
      ...(overrides.gearbox || {})
    },
    shaftMaterial: {
      grade: '35',
      Rm: 530,
      ReL: 315,
      ...(overrides.shaftMaterial || {})
    },
    boltMaterial: {
      grade: '35',
      strengthClass: '6.6',
      ...(overrides.boltMaterial || {})
    },
    shaftDimensions: {
      sternShaft: { diameter: 100, length: 500 },
      intermediateShaft: { diameter: 90, length: 400 },
      ...(overrides.shaftDimensions || {})
    },
    bearingType: overrides.bearingType || 'WHITE_METAL'
  });

  test('应返回完整计算结果结构', () => {
    const input = createFullInput();
    const result = runFullCalculation(input);

    expect(result).toHaveProperty('basicDiameter');
    expect(result).toHaveProperty('flange');
    expect(result).toHaveProperty('bearing');
    expect(result).toHaveProperty('isValid');
    expect(result).toHaveProperty('warnings');
    expect(result).toHaveProperty('input');
    expect(result).toHaveProperty('timestamp');
  });

  test('应计算艉轴和中间轴直径', () => {
    const input = createFullInput();
    const result = runFullCalculation(input);

    expect(result.basicDiameter.sternShaft).toBeDefined();
    expect(result.basicDiameter.sternShaft.diameter).toBeGreaterThan(0);
    expect(result.basicDiameter.intermediateShaft).toBeDefined();
    expect(result.basicDiameter.intermediateShaft.diameter).toBeGreaterThan(0);
  });

  test('应计算法兰参数', () => {
    const input = createFullInput();
    const result = runFullCalculation(input);

    expect(result.flange.minThickness).toBeGreaterThan(0);
    expect(result.flange.minRadius).toBeGreaterThan(0);
  });

  test('应计算轴承长度', () => {
    const input = createFullInput();
    const result = runFullCalculation(input);

    expect(result.bearing.minLength).toBeGreaterThan(0);
  });

  test('实际轴径过小时应生成警告', () => {
    const input = createFullInput({
      shaftDimensions: {
        sternShaft: { diameter: 30, length: 500 }, // 太小
        intermediateShaft: { diameter: 25, length: 400 }
      }
    });
    const result = runFullCalculation(input);

    expect(result.warnings.length).toBeGreaterThan(0);
    expect(result.warnings[0]).toContain('艉轴实际直径');
    expect(result.isValid).toBe(false);
  });

  test('应保留原始输入', () => {
    const input = createFullInput();
    const result = runFullCalculation(input);

    expect(result.input).toEqual(input);
  });

  test('应包含时间戳', () => {
    const input = createFullInput();
    const result = runFullCalculation(input);

    expect(result.timestamp).toBeDefined();
    expect(new Date(result.timestamp)).toBeInstanceOf(Date);
  });

  test('不同材料应产生不同结果', () => {
    const steel35Input = createFullInput({
      shaftMaterial: { grade: '35', Rm: 530, ReL: 315 }
    });
    const steel42CrMoInput = createFullInput({
      shaftMaterial: { grade: '42CrMo', Rm: 1080, ReL: 930 }
    });

    const steel35Result = runFullCalculation(steel35Input);
    const steel42CrMoResult = runFullCalculation(steel42CrMoInput);

    expect(steel42CrMoResult.basicDiameter.sternShaft.diameter)
      .toBeLessThan(steel35Result.basicDiameter.sternShaft.diameter);
  });

  test('不同功率应产生不同结果', () => {
    const lowPowerInput = createFullInput({
      powerSource: { power: 100, speed: 1500, type: 'diesel' }
    });
    const highPowerInput = createFullInput({
      powerSource: { power: 400, speed: 1500, type: 'diesel' }
    });

    const lowPowerResult = runFullCalculation(lowPowerInput);
    const highPowerResult = runFullCalculation(highPowerInput);

    expect(highPowerResult.basicDiameter.sternShaft.diameter)
      .toBeGreaterThan(lowPowerResult.basicDiameter.sternShaft.diameter);
  });
});

// ============================================================
// 边界条件测试
// ============================================================

describe('边界条件测试', () => {
  test('calculateBasicShaftDiameter 应处理小功率', () => {
    const result = calculateBasicShaftDiameter({
      power: 10,
      speed: 3000,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    expect(result.diameter).toBeGreaterThan(0);
  });

  test('calculateBasicShaftDiameter 应处理大功率', () => {
    const result = calculateBasicShaftDiameter({
      power: 5000,
      speed: 500,
      Rm: 530,
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    expect(result.diameter).toBeGreaterThan(0);
    expect(Number.isFinite(result.diameter)).toBe(true);
  });

  test('calculateKeyStrength 应处理小扭矩', () => {
    const result = calculateKeyStrength({
      torque: 100,
      keyWidth: 10,
      keyHeight: 8,
      keyLength: 50,
      shaftDiameter: 40,
      Rm: 600
    });

    expect(parseFloat(result.shearStress)).toBeGreaterThan(0);
    expect(result.isValid).toBe(true);
  });

  test('calculateBoltStrength 应处理边界预紧力', () => {
    const result = calculateBoltStrength({
      torque: 1000,
      boltDiameter: 10,
      boltCount: 4,
      boltCircleDia: 100,
      preloadForce: 100
    });

    expect(Number.isFinite(parseFloat(result.safetyFactor))).toBe(true);
  });
});

// ============================================================
// 实际工程案例验证
// ============================================================

describe('工程案例验证', () => {
  test('200kW柴油机艉轴计算', () => {
    // 典型船用轴系案例
    const result = calculateBasicShaftDiameter({
      power: 200,
      speed: 1500,
      Rm: 530,  // 35号钢
      shaftType: 'stern',
      powerSourceType: 'diesel'
    });

    // 经验值范围检查 (200kW通常艉轴直径在45-90mm)
    expect(result.diameter).toBeGreaterThanOrEqual(45);
    expect(result.diameter).toBeLessThanOrEqual(120);
  });

  test('400kW电机艉轴计算', () => {
    const result = calculateBasicShaftDiameter({
      power: 400,
      speed: 1200,
      Rm: 600,  // 45号钢
      shaftType: 'stern',
      powerSourceType: 'electric'
    });

    // 电机驱动K=0.9，轴径略小
    expect(result.K).toBe(0.9);
    expect(result.diameter).toBeGreaterThanOrEqual(55);
    expect(result.diameter).toBeLessThanOrEqual(150);
  });
});
