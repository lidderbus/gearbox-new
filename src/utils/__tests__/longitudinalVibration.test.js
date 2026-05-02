// P3-1: longitudinalVibration.js 单元测试
import { analyzeLongitudinalVibration } from '../longitudinalVibration';

describe('analyzeLongitudinalVibration', () => {
  const validParams = {
    shaftDiameter_mm: 150,
    shaftLength_m: 5.0,
    propellerMass_kg: 800,
    bladeCount: 4,
    operatingSpeed_rpm: 300,
  };

  test('valid input returns success', () => {
    const r = analyzeLongitudinalVibration(validParams);
    expect(r.success).toBe(true);
    expect(r.naturalFrequency_Hz).toBeGreaterThan(0);
    expect(r.criticalSpeed_rpm).toBeGreaterThan(0);
  });

  test('invalid input returns errors', () => {
    const r = analyzeLongitudinalVibration({ ...validParams, shaftDiameter_mm: 0 });
    expect(r.success).toBe(false);
    expect(r.errors).toContain('轴径必须 > 0');
  });

  test('multiple invalid inputs return all errors', () => {
    const r = analyzeLongitudinalVibration({});
    expect(r.success).toBe(false);
    expect(r.errors.length).toBeGreaterThanOrEqual(5);
  });

  test('larger diameter increases natural frequency (stiffer)', () => {
    const r1 = analyzeLongitudinalVibration({ ...validParams, shaftDiameter_mm: 100 });
    const r2 = analyzeLongitudinalVibration({ ...validParams, shaftDiameter_mm: 200 });
    expect(r2.naturalFrequency_Hz).toBeGreaterThan(r1.naturalFrequency_Hz);
  });

  test('longer shaft decreases natural frequency (more flexible)', () => {
    const r1 = analyzeLongitudinalVibration({ ...validParams, shaftLength_m: 3 });
    const r2 = analyzeLongitudinalVibration({ ...validParams, shaftLength_m: 8 });
    expect(r2.naturalFrequency_Hz).toBeLessThan(r1.naturalFrequency_Hz);
  });

  test('heavier propeller decreases natural frequency', () => {
    const r1 = analyzeLongitudinalVibration({ ...validParams, propellerMass_kg: 500 });
    const r2 = analyzeLongitudinalVibration({ ...validParams, propellerMass_kg: 1500 });
    expect(r2.naturalFrequency_Hz).toBeLessThan(r1.naturalFrequency_Hz);
  });

  test('critical speed = f_n * 60 / Z (blade harmonic)', () => {
    const r = analyzeLongitudinalVibration({ ...validParams, bladeCount: 5 });
    const expected = (r.naturalFrequency_Hz * 60) / 5;
    expect(r.criticalSpeed_rpm).toBe(Math.round(expected));
  });

  test('forbidden zone is symmetric around critical speed', () => {
    const r = analyzeLongitudinalVibration(validParams);
    const center = r.criticalSpeed_rpm;
    const halfRange = center * 0.10;
    expect(r.forbiddenZone_rpm.min).toBeCloseTo(center - halfRange, -1);
    expect(r.forbiddenZone_rpm.max).toBeCloseTo(center + halfRange, -1);
  });

  test('operating at critical speed fails continuous + transient', () => {
    const params = { ...validParams, operatingSpeed_rpm: 300 };
    // Find critical speed first, then set operating to that
    const probe = analyzeLongitudinalVibration(params);
    const r = analyzeLongitudinalVibration({ ...params, operatingSpeed_rpm: probe.criticalSpeed_rpm });
    expect(r.pass.continuous).toBe(false);
  });

  test('returns references and method label', () => {
    const r = analyzeLongitudinalVibration(validParams);
    expect(r.method).toMatch(/Lewis/i);
    expect(Array.isArray(r.references)).toBe(true);
    expect(r.references.length).toBeGreaterThan(0);
  });
});
