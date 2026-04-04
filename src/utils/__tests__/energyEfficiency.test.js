import {
  CARBON_FACTORS,
  SFC_REFERENCE,
  REDUCTION_FACTORS,
  EEDI_REFERENCE_LINES,
  calculateEEDIReferenceLine,
  calculateRequiredEEDI,
  estimateAuxiliaryPower,
  calculateAttainedEEDI,
  evaluateEEDICompliance,
  calculateCII,
  estimateHybridEfficiencyGain,
  generateEnergyEfficiencyReport
} from '../energyEfficiency';

// ============================================================
// Carbon factor lookups
// ============================================================
describe('CARBON_FACTORS', () => {
  test('HFO carbon factor is 3.114', () => {
    expect(CARBON_FACTORS.HFO.CF).toBe(3.114);
  });

  test('LNG carbon factor is 2.750 (lower than HFO)', () => {
    expect(CARBON_FACTORS.LNG.CF).toBe(2.750);
    expect(CARBON_FACTORS.LNG.CF).toBeLessThan(CARBON_FACTORS.HFO.CF);
  });

  test('MDO and MGO share the same carbon factor', () => {
    expect(CARBON_FACTORS.MDO.CF).toBe(CARBON_FACTORS.MGO.CF);
    expect(CARBON_FACTORS.MDO.CF).toBe(3.206);
  });

  test('Ammonia has zero carbon factor', () => {
    expect(CARBON_FACTORS.AMMONIA.CF).toBe(0);
  });

  test('Methanol has lower CF than conventional fuels', () => {
    expect(CARBON_FACTORS.METHANOL.CF).toBe(1.375);
    expect(CARBON_FACTORS.METHANOL.CF).toBeLessThan(CARBON_FACTORS.MDO.CF);
  });

  test('all fuel types have CF, lowerHeat, and density', () => {
    Object.entries(CARBON_FACTORS).forEach(([key, fuel]) => {
      expect(typeof fuel.CF).toBe('number');
      expect(typeof fuel.lowerHeat).toBe('number');
      expect(typeof fuel.density).toBe('number');
      expect(fuel.lowerHeat).toBeGreaterThan(0);
      expect(fuel.density).toBeGreaterThan(0);
    });
  });
});

// ============================================================
// EEDI reference line
// ============================================================
describe('calculateEEDIReferenceLine', () => {
  test('bulk carrier reference line follows power law a * DWT^(-c)', () => {
    const dwt = 50000;
    const { a, c } = EEDI_REFERENCE_LINES.bulkCarrier;
    const expected = a * Math.pow(dwt, -c);
    expect(calculateEEDIReferenceLine('bulkCarrier', dwt)).toBeCloseTo(expected, 4);
  });

  test('larger ships have lower reference EEDI', () => {
    const small = calculateEEDIReferenceLine('bulkCarrier', 10000);
    const large = calculateEEDIReferenceLine('bulkCarrier', 100000);
    expect(large).toBeLessThan(small);
  });

  test('unknown ship type falls back to bulkCarrier with console warning', () => {
    const spy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const result = calculateEEDIReferenceLine('unknownType', 50000);
    expect(result).toBeGreaterThan(0);
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });
});

// ============================================================
// Required EEDI (with phase reduction)
// ============================================================
describe('calculateRequiredEEDI', () => {
  test('phase0 has no reduction (equals reference line)', () => {
    const ref = calculateEEDIReferenceLine('bulkCarrier', 50000);
    const required = calculateRequiredEEDI('bulkCarrier', 50000, 'phase0');
    expect(required).toBeCloseTo(ref, 4);
  });

  test('phase3 reduces by 30% for bulk carrier', () => {
    const ref = calculateEEDIReferenceLine('bulkCarrier', 50000);
    const required = calculateRequiredEEDI('bulkCarrier', 50000, 'phase3');
    expect(required).toBeCloseTo(ref * 0.70, 4);
  });

  test('each successive phase is stricter', () => {
    const p0 = calculateRequiredEEDI('tanker', 80000, 'phase0');
    const p1 = calculateRequiredEEDI('tanker', 80000, 'phase1');
    const p2 = calculateRequiredEEDI('tanker', 80000, 'phase2');
    const p3 = calculateRequiredEEDI('tanker', 80000, 'phase3');
    expect(p1).toBeLessThan(p0);
    expect(p2).toBeLessThan(p1);
    expect(p3).toBeLessThan(p2);
  });
});

// ============================================================
// Auxiliary power estimation
// ============================================================
describe('estimateAuxiliaryPower', () => {
  test('uses 5% rule for power < 10000 kW', () => {
    expect(estimateAuxiliaryPower(5000)).toBe(250); // 0.05 * 5000
  });

  test('uses 2.5% + 250 rule for power >= 10000 kW', () => {
    expect(estimateAuxiliaryPower(10000)).toBe(500); // 0.025 * 10000 + 250
    expect(estimateAuxiliaryPower(20000)).toBe(750); // 0.025 * 20000 + 250
  });
});

// ============================================================
// Attained EEDI calculation
// ============================================================
describe('calculateAttainedEEDI', () => {
  const baseParams = {
    mainEnginePower: 5000,  // kW
    capacity: 30000,        // DWT
    speed: 14,              // knots
    mainFuelType: 'MDO'
  };

  test('returns positive EEDI for valid inputs', () => {
    const result = calculateAttainedEEDI(baseParams);
    expect(result.attainedEEDI).toBeGreaterThan(0);
    expect(result.unit).toBe('g CO\u2082/t\u00b7nm');
  });

  test('EEDI components contain expected fields', () => {
    const result = calculateAttainedEEDI(baseParams);
    expect(result.components.mainEnginePower).toBe(5000 * 0.75);
    expect(result.components.cfMain).toBe(CARBON_FACTORS.MDO.CF);
    expect(result.components.sfcMain).toBe(SFC_REFERENCE.mainEngine.default);
  });

  test('LNG fuel gives lower EEDI than MDO', () => {
    const mdoResult = calculateAttainedEEDI(baseParams);
    const lngResult = calculateAttainedEEDI({ ...baseParams, mainFuelType: 'LNG' });
    expect(lngResult.attainedEEDI).toBeLessThan(mdoResult.attainedEEDI);
  });

  test('higher speed reduces EEDI (denominator increases)', () => {
    const slow = calculateAttainedEEDI({ ...baseParams, speed: 10 });
    const fast = calculateAttainedEEDI({ ...baseParams, speed: 18 });
    expect(fast.attainedEEDI).toBeLessThan(slow.attainedEEDI);
  });

  test('annual estimates are returned', () => {
    const result = calculateAttainedEEDI(baseParams);
    expect(result.annualEstimates.fuelConsumption.total).toBeGreaterThan(0);
    expect(result.annualEstimates.co2Emissions.total).toBeGreaterThan(0);
  });

  test('custom gearbox efficiency affects result', () => {
    const high = calculateAttainedEEDI({ ...baseParams, gearboxEfficiency: 0.99 });
    const low = calculateAttainedEEDI({ ...baseParams, gearboxEfficiency: 0.90 });
    // Higher efficiency means more effective power, hence higher EEDI (more CO2 per work)
    expect(high.attainedEEDI).toBeGreaterThan(low.attainedEEDI);
  });
});

// ============================================================
// EEDI compliance evaluation
// ============================================================
describe('evaluateEEDICompliance', () => {
  test('a very low EEDI is compliant and rated A', () => {
    const result = evaluateEEDICompliance(1.0, 'bulkCarrier', 100000, 2025);
    expect(result.isCompliant).toBe(true);
    expect(result.rating).toBe('A');
  });

  test('a very high EEDI is not compliant', () => {
    const result = evaluateEEDICompliance(999, 'bulkCarrier', 50000, 2025);
    expect(result.isCompliant).toBe(false);
  });

  test('phase is determined by build year', () => {
    const old = evaluateEEDICompliance(5, 'tanker', 80000, 2010);
    const new_ = evaluateEEDICompliance(5, 'tanker', 80000, 2026);
    expect(old.phase).toBe('phase0');
    expect(new_.phase).toBe('phase3');
  });

  test('result contains required fields', () => {
    const result = evaluateEEDICompliance(5, 'generalCargo', 10000, 2022);
    expect(result).toHaveProperty('isCompliant');
    expect(result).toHaveProperty('attainedEEDI');
    expect(result).toHaveProperty('requiredEEDI');
    expect(result).toHaveProperty('referenceLine');
    expect(result).toHaveProperty('rating');
    expect(result).toHaveProperty('recommendation');
  });
});

// ============================================================
// CII calculation
// ============================================================
describe('calculateCII', () => {
  test('calculates CII from positional args', () => {
    const result = calculateCII(5000, 50000, 100000);
    expect(result.attainedCII).toBeGreaterThan(0);
    expect(result.unit).toBe('g CO\u2082/t\u00b7nm');
    // 5000 * 1e6 / (50000 * 100000) = 1.0
    expect(result.attainedCII).toBeCloseTo(1.0, 2);
    expect(result.rating).toBe('A'); // <= 5
  });

  test('calculates CII from object params', () => {
    const result = calculateCII({ annualCO2: 5000, capacity: 50000, distance: 100000 });
    expect(result.attainedCII).toBeCloseTo(1.0, 2);
  });

  test('returns N/A for zero capacity', () => {
    const result = calculateCII(5000, 0, 100000);
    expect(result.rating).toBe('N/A');
    expect(result.attainedCII).toBe(0);
  });

  test('returns N/A for zero distance', () => {
    const result = calculateCII(5000, 50000, 0);
    expect(result.rating).toBe('N/A');
  });

  test('high CII gets poor rating', () => {
    // 100000 * 1e6 / (10000 * 10000) = 1000 => rating E
    const result = calculateCII(100000, 10000, 10000);
    expect(result.rating).toBe('E');
  });
});

// ============================================================
// Hybrid efficiency estimation
// ============================================================
describe('estimateHybridEfficiencyGain', () => {
  const baselineEEDI = {
    attainedEEDI: 10.0,
    annualEstimates: {
      fuelConsumption: { total: 500 },
      co2Emissions: { total: 1600 }
    }
  };

  test('returns not improved when hybrid not enabled', () => {
    const result = estimateHybridEfficiencyGain(baselineEEDI, null);
    expect(result.improved).toBe(false);
  });

  test('PTO mode gives 8% efficiency gain', () => {
    const result = estimateHybridEfficiencyGain(baselineEEDI, {
      enabled: true,
      modes: { pto: true }
    });
    expect(result.improved).toBe(true);
    expect(result.hybrid.eedi).toBeCloseTo(10.0 * 0.92, 1);
  });

  test('PTO + PTI combined gives 13% efficiency gain', () => {
    const result = estimateHybridEfficiencyGain(baselineEEDI, {
      enabled: true,
      modes: { pto: true, pti: true }
    });
    expect(result.hybrid.eedi).toBeCloseTo(10.0 * 0.87, 1);
  });
});

// ============================================================
// Full report generation
// ============================================================
describe('generateEnergyEfficiencyReport', () => {
  test('generates complete report with required sections', () => {
    const report = generateEnergyEfficiencyReport({
      shipName: 'TestShip',
      shipType: 'bulkCarrier',
      capacity: 50000,
      mainEnginePower: 8000,
      speed: 14,
      fuelType: 'MDO',
      buildYear: 2025
    });
    expect(report.metadata.shipName).toBe('TestShip');
    expect(report.baseline.eedi.attainedEEDI).toBeGreaterThan(0);
    expect(report.baseline.compliance).toHaveProperty('isCompliant');
    expect(report.summary).toHaveProperty('currentEEDI');
    expect(report.summary).toHaveProperty('requiredEEDI');
    expect(report.hybrid).toBeNull(); // no hybrid config
  });

  test('includes hybrid section when enabled', () => {
    const report = generateEnergyEfficiencyReport({
      shipType: 'tanker',
      capacity: 80000,
      mainEnginePower: 12000,
      speed: 15,
      hybridConfig: { enabled: true, modes: { pto: true, pti: true } }
    });
    expect(report.hybrid).not.toBeNull();
    expect(report.hybrid.benefits.improved).toBe(true);
    expect(report.hybrid.compliance).not.toBeNull();
  });
});
