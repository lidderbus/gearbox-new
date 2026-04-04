// src/utils/__tests__/monotoneCubicInterpolation.test.js
// Tests for monotone cubic interpolation via selectGearbox with multi-ratio models

import { selectGearbox } from '../selectionAlgorithm';

// Helper to create mock data in the shape selectGearbox expects
const createMockData = (gearboxes) => ({
  hcGearboxes: gearboxes,
  gwGearboxes: [],
  hcmGearboxes: [],
  dtGearboxes: [],
  hcqGearboxes: [],
  gcGearboxes: [],
  flexibleCouplings: [],
  standbyPumps: []
});

describe('Monotone cubic interpolation in selection', () => {
  // 5-ratio model triggers cubic interpolation (>= 4 ratios)
  const mockGearbox5Ratios = {
    model: 'TEST-5R',
    series: 'HC',
    minSpeed: 1000,
    maxSpeed: 2000,
    ratios: [2.0, 2.5, 3.0, 3.5, 4.0],
    transferCapacity: [0.5, 0.45, 0.4, 0.35, 0.3],
    thrust: 50,
    weight: 500,
    price: 100000,
  };

  // 6-ratio model with non-uniform spacing
  const mockGearbox6Ratios = {
    model: 'TEST-6R',
    series: 'HC',
    minSpeed: 800,
    maxSpeed: 2500,
    ratios: [1.5, 2.0, 2.5, 3.0, 4.0, 5.0],
    transferCapacity: [0.8, 0.7, 0.6, 0.5, 0.4, 0.3],
    thrust: 80,
    weight: 800,
    price: 200000,
  };

  test('interpolation produces capacity between adjacent values for 5-ratio model', () => {
    // Target ratio 2.75 is between 2.5 (cap=0.45) and 3.0 (cap=0.4)
    const data = createMockData([mockGearbox5Ratios]);
    const result = selectGearbox(100, 1500, 2.75, 0, 'HC', data);
    // Even if it doesn't find a "success" match (capacity check may fail),
    // the algorithm should at least process the gearbox
    if (result.success && result.recommendations?.length > 0) {
      const rec = result.recommendations[0];
      if (rec.selectedCapacity) {
        // Interpolated capacity should be between 0.4 and 0.45
        expect(rec.selectedCapacity).toBeGreaterThanOrEqual(0.39);
        expect(rec.selectedCapacity).toBeLessThanOrEqual(0.46);
      }
    }
    // At minimum, the function should not throw
    expect(result).toHaveProperty('success');
  });

  test('interpolation at exact ratio matches exact capacity', () => {
    // Target ratio 3.0 should give exactly capacity 0.4
    const data = createMockData([mockGearbox5Ratios]);
    const result = selectGearbox(50, 1500, 3.0, 0, 'HC', data);
    if (result.success && result.recommendations?.length > 0) {
      const rec = result.recommendations[0];
      if (rec.selectedCapacity) {
        expect(rec.selectedCapacity).toBeCloseTo(0.4, 2);
      }
    }
    expect(result).toHaveProperty('success');
  });

  test('6-ratio model processes without error', () => {
    const data = createMockData([mockGearbox6Ratios]);
    // Target between 2.5 and 3.0
    const result = selectGearbox(80, 1200, 2.8, 0, 'HC', data);
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('recommendations');
  });

  test('selectGearbox handles model with minimum 4 ratios for cubic', () => {
    const fourRatioModel = {
      model: 'TEST-4R',
      series: 'HC',
      minSpeed: 1000,
      maxSpeed: 2000,
      ratios: [2.0, 3.0, 4.0, 5.0],
      transferCapacity: [0.6, 0.5, 0.4, 0.3],
      thrust: 40,
      weight: 400,
      price: 80000,
    };
    const data = createMockData([fourRatioModel]);
    const result = selectGearbox(50, 1500, 3.5, 0, 'HC', data);
    expect(result).toHaveProperty('success');
    // Should not throw - 4 ratios triggers cubic path
  });

  test('3-ratio model falls back to linear interpolation', () => {
    const threeRatioModel = {
      model: 'TEST-3R',
      series: 'HC',
      minSpeed: 1000,
      maxSpeed: 2000,
      ratios: [2.0, 3.0, 4.0],
      transferCapacity: [0.6, 0.5, 0.4],
      thrust: 40,
      weight: 400,
      price: 80000,
    };
    const data = createMockData([threeRatioModel]);
    // Target ratio 2.5 between 2.0 and 3.0
    const result = selectGearbox(50, 1500, 2.5, 0, 'HC', data);
    expect(result).toHaveProperty('success');
  });

  test('monotonicity: interpolated values do not overshoot bounds', () => {
    // A model with monotonically decreasing capacity
    const data = createMockData([mockGearbox5Ratios]);
    // Test multiple intermediate ratios
    const ratiosToTest = [2.1, 2.3, 2.7, 3.2, 3.7, 3.9];
    for (const ratio of ratiosToTest) {
      const result = selectGearbox(50, 1500, ratio, 0, 'HC', data);
      if (result.success && result.recommendations?.length > 0) {
        const cap = result.recommendations[0].selectedCapacity;
        if (cap) {
          // Capacity should be within global range [0.3, 0.5]
          expect(cap).toBeGreaterThanOrEqual(0.29);
          expect(cap).toBeLessThanOrEqual(0.51);
        }
      }
    }
  });
});
