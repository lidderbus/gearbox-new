import { evaluatePumpNPSHRisk } from '../pumpNPSHAdvisor';

describe('pumpNPSHAdvisor (P2#1)', () => {
  it('returns low risk for normal operating conditions', () => {
    const r = evaluatePumpNPSHRisk({
      pump: { model: '2CY-3.3/2.5D', pressure: 2.5, flow: 3.3 },
      inputSpeed: 1500, ratio: 3.0, temperature: 30
    });
    expect(r.risk).toBe('low');
    expect(r.warnings).toHaveLength(0);
  });

  it('flags high risk for high-speed + high-pressure + hot', () => {
    const r = evaluatePumpNPSHRisk({
      pump: { model: 'HIGH-PRESS', pressure: 4.5, flow: 10 },
      inputSpeed: 2800, ratio: 2.0, temperature: 65
    });
    expect(r.risk).toBe('high');
    expect(r.warnings.length).toBeGreaterThan(0);
    expect(r.recommendations.some(s => s.includes('NPSH'))).toBe(true);
  });

  it('flags medium risk for moderate conditions', () => {
    const r = evaluatePumpNPSHRisk({
      pump: { model: 'MED', pressure: 3.2, flow: 5 },
      inputSpeed: 2100, ratio: 3.0, temperature: 55
    });
    expect(r.risk).toBe('medium');
  });

  it('handles missing pump gracefully', () => {
    const r = evaluatePumpNPSHRisk({ inputSpeed: 2000, ratio: 3.0 });
    expect(r.risk).toBe('low');
    expect(r.warnings).toHaveLength(0);
  });

  it('handles missing ratio (div/0) gracefully', () => {
    expect(() => evaluatePumpNPSHRisk({
      pump: { model: 'X', pressure: 2.5 },
      inputSpeed: 1500, ratio: 0
    })).not.toThrow();
  });
});
