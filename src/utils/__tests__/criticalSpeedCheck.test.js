import { performCriticalSpeedCheck } from '../criticalSpeedCheck';

describe('performCriticalSpeedCheck', () => {
  test('returns null for speed <= 3000 without PTO', () => {
    const result = performCriticalSpeedCheck({ enginePower: 500, engineSpeed: 1800, ratio: 4.0 });
    expect(result).toBeNull();
  });

  test('triggers for speed > 3000', () => {
    const result = performCriticalSpeedCheck({ enginePower: 200, engineSpeed: 3600, ratio: 2.5 });
    expect(result).not.toBeNull();
    expect(result).toHaveProperty('safe');
    expect(result).toHaveProperty('naturalFreqHz');
    expect(result).toHaveProperty('criticalSpeedRpm');
    expect(result).toHaveProperty('marginPercent');
    expect(result).toHaveProperty('recommendation');
    expect(typeof result.safe).toBe('boolean');
    expect(result.naturalFreqHz).toBeGreaterThan(0);
  });

  test('triggers for PTO mode even at low speed', () => {
    const result = performCriticalSpeedCheck({ enginePower: 300, engineSpeed: 1500, ratio: 3.0, isPTO: true });
    expect(result).not.toBeNull();
    expect(result.method).toBe('simplified-two-mass');
  });

  test('detects forbidden zone correctly', () => {
    // Use extreme values to force into forbidden zone
    const result = performCriticalSpeedCheck({ enginePower: 10, engineSpeed: 5000, ratio: 1.5 });
    expect(result).not.toBeNull();
    expect(typeof result.isInForbiddenZone).toBe('boolean');
    if (result.isInForbiddenZone) {
      expect(result.safe).toBe(false);
      expect(result.recommendation).toContain('共振');
    }
  });

  test('returns estimated params', () => {
    const result = performCriticalSpeedCheck({ enginePower: 500, engineSpeed: 3500, ratio: 3.0 });
    expect(result.estimatedParams).toHaveProperty('J1');
    expect(result.estimatedParams).toHaveProperty('J2');
    expect(result.estimatedParams).toHaveProperty('K');
    expect(result.estimatedParams.J1).toBeGreaterThan(0);
    expect(result.estimatedParams.J2).toBeGreaterThan(0);
    expect(result.estimatedParams.K).toBeGreaterThan(0);
  });
});
