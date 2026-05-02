// P3-1: whirlingVibration.js 单元测试
import { analyzeWhirlingVibration } from '../whirlingVibration';

describe('analyzeWhirlingVibration', () => {
  const validParams = {
    shaftDiameter_mm: 150,
    shaftLength_m: 5.0,
    propellerMass_kg: 800,
    bladeCount: 4,
    operatingSpeed_rpm: 300,
  };

  test('valid input returns success', () => {
    const r = analyzeWhirlingVibration(validParams);
    expect(r.success).toBe(true);
    expect(r.frequencies.combined_Hz).toBeGreaterThan(0);
    expect(r.checks).toHaveLength(2);
  });

  test('returns 1× and Z× critical speeds', () => {
    const r = analyzeWhirlingVibration(validParams);
    const unbalance = r.checks.find(c => c.mode.includes('1×'));
    const blade = r.checks.find(c => c.mode.includes('4×'));
    expect(unbalance).toBeDefined();
    expect(blade).toBeDefined();
    // Z× critical speed should be 1× / Z
    expect(blade.criticalRpm).toBeCloseTo(unbalance.criticalRpm / 4, 0);
  });

  test('Dunkerley combined frequency is below both inputs', () => {
    const r = analyzeWhirlingVibration(validParams);
    expect(r.frequencies.combined_Hz).toBeLessThanOrEqual(r.frequencies.beamOnly_Hz);
    expect(r.frequencies.combined_Hz).toBeLessThanOrEqual(r.frequencies.propOnly_Hz);
  });

  test('larger diameter increases bending stiffness (and frequency)', () => {
    const r1 = analyzeWhirlingVibration({ ...validParams, shaftDiameter_mm: 100 });
    const r2 = analyzeWhirlingVibration({ ...validParams, shaftDiameter_mm: 200 });
    expect(r2.frequencies.combined_Hz).toBeGreaterThan(r1.frequencies.combined_Hz);
  });

  test('invalid input returns errors', () => {
    const r = analyzeWhirlingVibration({});
    expect(r.success).toBe(false);
    expect(r.errors.length).toBeGreaterThan(0);
  });

  test('forbidden zone is asymmetric (-15% to +5%)', () => {
    const r = analyzeWhirlingVibration(validParams);
    const c = r.checks[0];
    expect(c.forbiddenMin).toBeCloseTo(c.criticalRpm * 0.85, -1);
    expect(c.forbiddenMax).toBeCloseTo(c.criticalRpm * 1.05, -1);
  });

  test('overallPass true when both modes pass', () => {
    // 操作转速远低于任何临界
    const r = analyzeWhirlingVibration({ ...validParams, operatingSpeed_rpm: 10 });
    expect(r.overallPass).toBe(true);
  });

  test('returns method label and references', () => {
    const r = analyzeWhirlingVibration(validParams);
    expect(r.method).toMatch(/Dunkerley/);
    expect(r.references.length).toBeGreaterThan(0);
  });
});
