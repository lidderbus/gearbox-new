import { getIceClassThrustFactor, adjustThrustForIceClass, ICE_CLASS_THRUST_FACTOR } from '../iceClassThrust';

describe('iceClassThrust (P2#2)', () => {
  it('returns 1.0 factor for no ice class', () => {
    expect(getIceClassThrustFactor('')).toBe(1.0);
    expect(getIceClassThrustFactor(null)).toBe(1.0);
    expect(getIceClassThrustFactor(undefined)).toBe(1.0);
    expect(getIceClassThrustFactor('none')).toBe(1.0);
  });

  it('returns correct factors for known ice classes', () => {
    expect(getIceClassThrustFactor('ICE-3')).toBe(1.1);
    expect(getIceClassThrustFactor('ICE-1')).toBe(1.35);
    expect(getIceClassThrustFactor('PC3')).toBe(1.7);
  });

  it('is case-insensitive', () => {
    expect(getIceClassThrustFactor('ice-1')).toBe(1.35);
    expect(getIceClassThrustFactor('Ice-3')).toBe(1.1);
  });

  it('adjusts thrust with description', () => {
    const r = adjustThrustForIceClass(100, 'ICE-1');
    expect(r.factor).toBe(1.35);
    expect(r.adjustedThrust).toBe(135);
    expect(r.description).toContain('ICE-1');
  });

  it('no-op when factor=1', () => {
    const r = adjustThrustForIceClass(100, 'none');
    expect(r.adjustedThrust).toBe(100);
    expect(r.description).toBe('无冰级要求');
  });

  it('fallback to 1.0 for unknown class', () => {
    const r = adjustThrustForIceClass(100, 'UNKNOWN-CLASS');
    expect(r.factor).toBe(1.0);
  });

  it('ICE_CLASS_THRUST_FACTOR table is monotonic', () => {
    const levels = ['none', 'ICE-3', 'ICE-2', 'ICE-1', 'ICE-1A SUPER', 'PC3'];
    let prev = 0;
    for (const lv of levels) {
      const factor = ICE_CLASS_THRUST_FACTOR[lv];
      expect(factor).toBeGreaterThanOrEqual(prev);
      prev = factor;
    }
  });
});
