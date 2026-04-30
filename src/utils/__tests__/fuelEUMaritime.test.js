import {
  computeFuelEU,
  getFuelEUTarget,
  FUELEU_BASELINE_INTENSITY,
  FUELEU_TARGETS,
} from '../fuelEUMaritime';

describe('FuelEU Maritime (REGULATION (EU) 2023/1805)', () => {
  describe('getFuelEUTarget — 目标轨迹', () => {
    it('returns 2025-2029 window for 2026', () => {
      const t = getFuelEUTarget(2026);
      expect(t.reduction).toBeCloseTo(0.02);
      expect(t.limit).toBeCloseTo(89.34);
    });
    it('returns 2030-2034 window for 2030', () => {
      expect(getFuelEUTarget(2030).limit).toBeCloseTo(85.69);
    });
    it('returns -80% target for 2050+', () => {
      expect(getFuelEUTarget(2055).reduction).toBeCloseTo(0.80);
      expect(getFuelEUTarget(2055).limit).toBeCloseTo(18.23);
    });
    it('falls back to baseline for pre-2025', () => {
      expect(getFuelEUTarget(2020).limit).toBeCloseTo(FUELEU_BASELINE_INTENSITY);
      expect(getFuelEUTarget(2020).reduction).toBe(0);
    });
  });

  describe('computeFuelEU — 合规计算', () => {
    it('HFO ship at 2026 is non-compliant (intensity > 89.34 limit)', () => {
      const r = computeFuelEU({
        year: 2026,
        annualFuelTons: 1000,
        fuelType: 'HFO',
        baselineCF: 3.114,
        baselineLHV: 40.2,
      });
      expect(r.actualIntensity).toBeCloseTo(91.6);
      expect(r.targetLimit).toBeCloseTo(89.34);
      expect(r.compliant).toBe(false);
      expect(r.deficitGCO2eq).toBeGreaterThan(0);
      expect(r.penaltyEUR).toBeGreaterThan(0);
    });

    it('LNG ship at 2026 is compliant (intensity 76.7 < 89.34)', () => {
      const r = computeFuelEU({
        year: 2026,
        annualFuelTons: 1000,
        fuelType: 'LNG',
        baselineCF: 2.75,
        baselineLHV: 48.0,
      });
      expect(r.actualIntensity).toBeCloseTo(76.7);
      expect(r.compliant).toBe(true);
      expect(r.penaltyEUR).toBe(0);
      expect(r.excessVLSFOTons).toBe(0);
    });

    it('penalty rises as target tightens (2030 vs 2026, same HFO ship)', () => {
      const params = { annualFuelTons: 1000, fuelType: 'HFO', baselineCF: 3.114, baselineLHV: 40.2 };
      const r2026 = computeFuelEU({ ...params, year: 2026 });
      const r2030 = computeFuelEU({ ...params, year: 2030 });
      expect(r2030.targetLimit).toBeLessThan(r2026.targetLimit);
      expect(r2030.penaltyEUR).toBeGreaterThan(r2026.penaltyEUR);
    });

    it('HFO ship at 2050 has massive penalty (limit drops to 18.23)', () => {
      const r = computeFuelEU({
        year: 2050,
        annualFuelTons: 1000,
        fuelType: 'HFO',
        baselineCF: 3.114,
        baselineLHV: 40.2,
      });
      expect(r.targetLimit).toBeCloseTo(18.23);
      expect(r.compliant).toBe(false);
      // 重大超额 (2050 限值是基线的 1/5)
      expect(r.excessVLSFOTons).toBeGreaterThan(50);
    });

    it('AMMONIA (zero-emission) is always compliant', () => {
      const r = computeFuelEU({
        year: 2050,
        annualFuelTons: 1000,
        fuelType: 'AMMONIA',
        baselineCF: 0,
        baselineLHV: 18.6,
      });
      expect(r.actualIntensity).toBe(0);
      expect(r.compliant).toBe(true);
      expect(r.penaltyEUR).toBe(0);
    });

    it('falls back to estimated intensity when fuelType unknown', () => {
      const r = computeFuelEU({
        year: 2026,
        annualFuelTons: 100,
        fuelType: 'UNKNOWN_FUEL',
        baselineCF: 3.0,
        baselineLHV: 40.0,
      });
      // Should derive from baselineCF/LHV × 1.13 WtW factor
      expect(r.actualIntensity).toBeCloseTo(3.0 * 1000 / 40.0 * 1.13, 1);
    });

    it('zero fuel returns zero penalty', () => {
      const r = computeFuelEU({
        year: 2026,
        annualFuelTons: 0,
        fuelType: 'HFO',
        baselineCF: 3.114,
        baselineLHV: 40.2,
      });
      expect(r.deficitGCO2eq).toBe(0);
      expect(r.penaltyEUR).toBe(0);
      expect(r.compliant).toBe(true);
    });
  });

  describe('FUELEU_TARGETS — 数据完整性', () => {
    it('has 6 windows covering 2025-2099', () => {
      expect(FUELEU_TARGETS).toHaveLength(6);
      expect(FUELEU_TARGETS[0].from).toBe(2025);
      expect(FUELEU_TARGETS[FUELEU_TARGETS.length - 1].to).toBeGreaterThanOrEqual(2050);
    });
    it('limits are monotonically decreasing', () => {
      for (let i = 1; i < FUELEU_TARGETS.length; i++) {
        expect(FUELEU_TARGETS[i].limit).toBeLessThan(FUELEU_TARGETS[i - 1].limit);
      }
    });
    it('reductions are monotonically increasing', () => {
      for (let i = 1; i < FUELEU_TARGETS.length; i++) {
        expect(FUELEU_TARGETS[i].reduction).toBeGreaterThan(FUELEU_TARGETS[i - 1].reduction);
      }
    });
  });
});
