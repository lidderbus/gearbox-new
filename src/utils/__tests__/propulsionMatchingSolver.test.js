// P3-1: propulsionMatchingSolver.js 单元测试
import {
  estimateRequiredPower,
  estimatePropellerDiameter,
  estimatePropellerSpeed,
  solveSystemMatch,
  VESSEL_TYPES,
} from '../propulsionMatchingSolver';

describe('estimateRequiredPower', () => {
  test('admiralty coefficient for cargo ship returns reasonable PB', () => {
    const r = estimateRequiredPower({ displacement: 5000, speed: 12, vesselType: 'cargo' });
    // ~5000^(2/3) * 12^3 / 330 ≈ 1606 kW
    expect(r.PB).toBeGreaterThan(1200);
    expect(r.PB).toBeLessThan(2200);
    expect(r.Cn).toBe(330);
    expect(r.method).toBe('admiralty_coefficient');
  });

  test('tug uses lower Cn (200) than cargo (330)', () => {
    const tug = estimateRequiredPower({ displacement: 1000, speed: 10, vesselType: 'tug' });
    const cargo = estimateRequiredPower({ displacement: 1000, speed: 10, vesselType: 'cargo' });
    expect(tug.Cn).toBeLessThan(cargo.Cn);
    expect(tug.PB).toBeGreaterThan(cargo.PB); // Lower Cn → higher PB for same Δ,Vs
  });

  test('higher speed cubed scaling', () => {
    const r1 = estimateRequiredPower({ displacement: 1000, speed: 10, vesselType: 'cargo' });
    const r2 = estimateRequiredPower({ displacement: 1000, speed: 20, vesselType: 'cargo' });
    expect(r2.PB / r1.PB).toBeCloseTo(8, 0); // 2^3 = 8
  });
});

describe('estimatePropellerDiameter', () => {
  test('uses vessel-specific ratio', () => {
    const cargo = estimatePropellerDiameter({ draft: 5, vesselType: 'cargo' });
    const tug = estimatePropellerDiameter({ draft: 5, vesselType: 'tug' });
    expect(tug.D).toBeGreaterThan(cargo.D); // Tug uses 0.70 vs cargo 0.65
  });

  test('Dmax is always 0.85 × draft', () => {
    const r = estimatePropellerDiameter({ draft: 6, vesselType: 'cargo' });
    expect(r.Dmax).toBeCloseTo(6 * 0.85, 1);
  });
});

describe('estimatePropellerSpeed', () => {
  test('returns valid result for reasonable inputs', () => {
    const r = estimatePropellerSpeed({
      power_kW: 1500, speed_kn: 12, D: 3.5, vesselType: 'cargo',
      blades: 4, P_D: 0.95, AeA0: 0.65,
    });
    expect(r.valid).toBe(true);
    expect(r.n_propeller_rpm).toBeGreaterThan(0);
    expect(r.eta0).toBeGreaterThan(0);
    expect(r.eta0).toBeLessThan(1);
    expect(r.J).toBeGreaterThan(0);
  });
});

describe('solveSystemMatch', () => {
  test('full pipeline for cargo ship returns success', () => {
    const r = solveSystemMatch({
      vesselType: 'cargo',
      displacement: 5000,
      speed: 12,
      draft: 5.5,
      engineSpeed: 1500,
      engineCount: 1,
    });
    expect(r.success).toBe(true);
    expect(r.power.total_kW).toBeGreaterThan(0);
    expect(r.propeller.diameter_m).toBeGreaterThan(0);
    expect(r.propeller.series).toBe('WAGENINGEN_B');
    expect(r.gearbox.targetRatio).toBeGreaterThan(0);
  });

  test('tug recommends Ka-19A series', () => {
    const r = solveSystemMatch({
      vesselType: 'tug',
      displacement: 800,
      speed: 10,
      draft: 4,
      engineSpeed: 1500,
      engineCount: 1,
    });
    expect(r.success).toBe(true);
    expect(r.propeller.series).toBe('KA_19A');
  });

  test('invalid vessel type returns error', () => {
    const r = solveSystemMatch({
      vesselType: 'unknown',
      displacement: 5000,
      speed: 12,
      draft: 5,
    });
    expect(r.success).toBe(false);
    expect(r.error).toBeDefined();
  });

  test('zero displacement returns error', () => {
    const r = solveSystemMatch({
      vesselType: 'cargo',
      displacement: 0,
      speed: 12,
      draft: 5,
    });
    expect(r.success).toBe(false);
  });

  test('multiple engines reduces per-engine power', () => {
    const single = solveSystemMatch({
      vesselType: 'cargo', displacement: 5000, speed: 12, draft: 5, engineCount: 1,
    });
    const dual = solveSystemMatch({
      vesselType: 'cargo', displacement: 5000, speed: 12, draft: 5, engineCount: 2,
    });
    expect(dual.power.perEngine_kW).toBeCloseTo(single.power.perEngine_kW / 2, -1);
    expect(dual.power.total_kW).toBe(single.power.total_kW);
  });

  test('VESSEL_TYPES has 8 entries with required fields', () => {
    const types = Object.values(VESSEL_TYPES);
    expect(types.length).toBeGreaterThanOrEqual(8);
    types.forEach(t => {
      expect(t.label).toBeDefined();
      expect(t.blades).toBeDefined();
      expect(t.w).toBeGreaterThan(0);
      expect(t.t).toBeGreaterThan(0);
      expect(['WAGENINGEN_B', 'KA_19A']).toContain(t.prefer);
    });
  });

  test('result includes references for traceability', () => {
    const r = solveSystemMatch({ vesselType: 'tug', displacement: 1000, speed: 10, draft: 4 });
    expect(r.references).toBeDefined();
    expect(r.references.some(ref => ref.includes('PNA'))).toBe(true);
    expect(r.references.some(ref => ref.includes('Ka'))).toBe(true);
  });
});
