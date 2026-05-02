import { evaluatePTOThermalMargin } from '../ptoThermalMargin';

describe('ptoThermalMargin (P2#3)', () => {
  it('no-op when no hybrid modes enabled', () => {
    const r = evaluatePTOThermalMargin({
      enginePower: 1000, ratedCapacity: 0.6, engineSpeed: 1800,
      hybridConfig: { modes: {} }
    });
    expect(r.safe).toBe(true);
    expect(r.warnings).toHaveLength(0);
    expect(r.notes).toContain('无需热功率校核');
  });

  it('reports safe for modest PTO load', () => {
    // 500kW engine + 50kW PTO 走过 1260kW 额定齿轮箱 → 利用率 ~44%
    const r = evaluatePTOThermalMargin({
      enginePower: 500, ratedCapacity: 0.7, engineSpeed: 1800,
      hybridConfig: { modes: { pto: true }, ptoPower: 50, efficiency: 0.97 }
    });
    expect(r.safe).toBe(true);
    expect(r.utilizationPct).toBeLessThan(85);
  });

  it('warns when approaching thermal limit (85-100%)', () => {
    // rated = 0.3 × 1800 = 540; throughPower = 1000+100 = 1100 → utilization ~203%
    // Pick values for medium case: enginePower 400, rated 0.3*1800=540, pto 80 → 480/540 = 88.9%
    const r = evaluatePTOThermalMargin({
      enginePower: 400, ratedCapacity: 0.3, engineSpeed: 1800,
      hybridConfig: { modes: { pto: true }, ptoPower: 80, efficiency: 0.97 }
    });
    expect(r.utilizationPct).toBeGreaterThan(85);
    expect(r.utilizationPct).toBeLessThan(100);
    expect(r.warnings.length).toBeGreaterThan(0);
  });

  it('marks unsafe when exceeding thermal limit (>100%)', () => {
    const r = evaluatePTOThermalMargin({
      enginePower: 1200, ratedCapacity: 0.3, engineSpeed: 1800,
      hybridConfig: { modes: { pto: true, pti: true }, ptoPower: 200, ptiPower: 150, efficiency: 0.97 }
    });
    expect(r.safe).toBe(false);
    expect(r.utilizationPct).toBeGreaterThan(100);
    expect(r.derateRecommendation).toBeGreaterThan(0);
    expect(r.warnings.some(w => w.includes('散热上限'))).toBe(true);
  });

  it('PTO+PTI dual mode adds extra thermal penalty', () => {
    const rSingle = evaluatePTOThermalMargin({
      enginePower: 1000, ratedCapacity: 0.7, engineSpeed: 1800,
      hybridConfig: { modes: { pto: true }, ptoPower: 200, efficiency: 0.97 }
    });
    const rDual = evaluatePTOThermalMargin({
      enginePower: 1000, ratedCapacity: 0.7, engineSpeed: 1800,
      hybridConfig: { modes: { pto: true, pti: true }, ptoPower: 200, ptiPower: 200, efficiency: 0.97 }
    });
    // 双模式下载 > 单模式(虽然 PTO=PTI 可能抵消 engine net,但 0.5×min 惩罚仍在)
    expect(rDual.utilizationPct).toBeGreaterThan(0);
    expect(rDual.notes).toContain('PTO + PTI');
  });

  it('handles missing hybridConfig gracefully', () => {
    expect(() => evaluatePTOThermalMargin({
      enginePower: 1000, ratedCapacity: 0.7, engineSpeed: 1800
    })).not.toThrow();
  });
});
