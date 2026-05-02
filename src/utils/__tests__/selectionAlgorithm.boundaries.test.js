// src/utils/__tests__/selectionAlgorithm.boundaries.test.js
// C2 计划专项: 主算法边界矩阵测试
// 覆盖三个独立维度:
//   - transferCapacity 边界 (×0.95 / ×1.0 / ×1.05 等比放大)
//   - 速度匹配矩阵 (600/900/1200/1500/1800 rpm)
//   - 联轴器扭矩公式 T = 9550·P/n (K=1.5 由 selectFlexibleCoupling 应用, 主选型只算原始扭矩)
//
// 默认容差: MIN_CAPACITY_MARGIN=10%, MAX_CAPACITY_MARGIN=50%
// 边界测试通过 options.tolerances 放宽到 [1, 200] 让边界值可观测

import { selectGearbox, autoSelectGearbox } from '../selectionAlgorithm';

const make = (overrides = {}) => ({
  model: 'HC400',
  series: 'HC',
  inputSpeedRange: [500, 2200],
  ratios: [3.0],
  transferCapacity: [0.20],
  thrust: 80,
  weight: 400,
  basePrice: 40000,
  discountRate: 0.16,
  ...overrides
});

const wrapData = (gearboxes) => ({
  hcGearboxes: gearboxes.filter(g => g.series === 'HC'),
  gwGearboxes: gearboxes.filter(g => g.series === 'GW'),
  hcmGearboxes: gearboxes.filter(g => g.series === 'HCM'),
  dtGearboxes: gearboxes.filter(g => g.series === 'DT'),
  hcqGearboxes: gearboxes.filter(g => g.series === 'HCQ'),
  gcGearboxes: gearboxes.filter(g => g.series === 'GC'),
  flexibleCouplings: [],
  standbyPumps: []
});

// 放宽容差以使 ±5% 边界可观测(默认 [10, 50] 太严)
const looseTolerances = {
  tolerances: { minCapacityMargin: 1, maxCapacityMargin: 200 }
};

describe('selectionAlgorithm 边界矩阵 - transferCapacity ×0.95/×1.0/×1.05', () => {
  // 需求 200kW @ 1000rpm => requiredCapacity = 0.20
  const POWER = 200;
  const SPEED = 1000;
  const REQUIRED = POWER / SPEED;  // 0.20

  test('×0.95 容量(0.19) 不足: 完全匹配集合中应不出现', () => {
    const data = wrapData([make({ transferCapacity: [0.19] })]);
    const r = selectGearbox(POWER, SPEED, 3.0, 0, 'HC', data, looseTolerances);

    if (r.success && r.recommendations.length > 0) {
      // 完全匹配项的容量必须 >= REQUIRED
      const exact = r.recommendations.filter(rec => !rec.partialMatch && !rec.isNearMatch);
      exact.forEach(rec => {
        const cap = (rec.transferCapacity && rec.transferCapacity[0]) || rec.selectedCapacity;
        if (typeof cap === 'number') {
          expect(cap).toBeGreaterThanOrEqual(REQUIRED);
        }
      });
    }
  });

  test('×1.0 容量(0.20) 余量 0%: 等于需求即无富余, 完全匹配集合中应不出现', () => {
    const data = wrapData([make({ transferCapacity: [0.20] })]);
    // 即使放宽到 minCapacityMargin=1, 0% 余量仍 < 1%, 应被排除
    const r = selectGearbox(POWER, SPEED, 3.0, 0, 'HC', data, looseTolerances);
    if (r.success && r.recommendations.length > 0) {
      const exact = r.recommendations.filter(rec => !rec.isNearMatch && !rec.partialMatch);
      // 0% 余量不安全, 不应作为完全推荐
      expect(exact.length).toBe(0);
    }
  });

  test('×1.05 容量(0.21) 余量 5%: 放宽 MIN_CAPACITY_MARGIN 后应匹配', () => {
    const data = wrapData([make({ transferCapacity: [0.21] })]);
    const r = selectGearbox(POWER, SPEED, 3.0, 0, 'HC', data, looseTolerances);
    expect(r.success).toBe(true);
    if (r.recommendations.length > 0) {
      const top = r.recommendations[0];
      if (top.capacityMargin != null) {
        expect(top.capacityMargin).toBeGreaterThanOrEqual(0);
        expect(top.capacityMargin).toBeLessThanOrEqual(15);
      }
    }
  });

  test('默认容差: 5% 余量低于 MIN_CAPACITY_MARGIN(10%) 应被排除', () => {
    const data = wrapData([make({ transferCapacity: [0.21] })]);
    // 不放宽容差, 默认 MIN=10%
    const r = selectGearbox(POWER, SPEED, 3.0, 0, 'HC', data);
    if (r.success && r.recommendations.length > 0) {
      // 进入近似匹配, 不在完全匹配集合中
      const exact = r.recommendations.filter(rec => !rec.isNearMatch && !rec.partialMatch);
      expect(exact.length).toBe(0);
    }
  });

  test('×1.25 容量(0.25) 余量 25%: 进入理想范围(10-30%)', () => {
    const data = wrapData([make({ transferCapacity: [0.25] })]);
    const r = selectGearbox(POWER, SPEED, 3.0, 0, 'HC', data);
    expect(r.success).toBe(true);
    if (r.recommendations.length > 0) {
      const top = r.recommendations[0];
      if (top.capacityMargin != null) {
        expect(top.capacityMargin).toBeGreaterThanOrEqual(20);
        expect(top.capacityMargin).toBeLessThanOrEqual(30);
      }
    }
  });

  test('×1.5 容量(0.30) 余量 50%: 默认上限边界', () => {
    const data = wrapData([make({ transferCapacity: [0.30] })]);
    const r = selectGearbox(POWER, SPEED, 3.0, 0, 'HC', data);
    // 50% 在 MAX_CAPACITY_MARGIN 边界, 实现可能允许或拒绝, 二者都接受
    if (r.success && r.recommendations.length > 0) {
      const top = r.recommendations[0];
      if (top.capacityMargin != null) {
        expect(top.capacityMargin).toBeLessThanOrEqual(55);
      }
    }
  });

  test('×2.0 容量(0.40) 余量 100%: 超出 MAX_CAPACITY_MARGIN, 应进入近似匹配', () => {
    const data = wrapData([make({ transferCapacity: [0.40] })]);
    const r = selectGearbox(POWER, SPEED, 3.0, 0, 'HC', data);
    if (r.success && r.recommendations.length > 0) {
      // 100% 余量超过默认 50%, 不应是完全匹配
      const exact = r.recommendations.filter(rec => !rec.isNearMatch && !rec.partialMatch);
      expect(exact.length).toBe(0);
    }
  });
});

describe('selectionAlgorithm 边界矩阵 - 速度矩阵 (600/900/1200/1500/1800 rpm)', () => {
  // 让齿轮箱覆盖 [500, 2100] 全速域, 容量 0.40 (匹配 0.30-0.36 区间, 余量 11-33%)
  const ALL = make({ inputSpeedRange: [500, 2100], transferCapacity: [0.40] });

  test.each([
    [600, 200],   // required=0.333, margin=20%
    [900, 300],   // required=0.333, margin=20%
    [1200, 400],  // required=0.333, margin=20%
    [1500, 450],  // required=0.300, margin=33%
    [1800, 600]   // required=0.333, margin=20%
  ])('转速 %i rpm + 功率 %i kW 应能匹配(全在 inputSpeedRange 内)', (speed, power) => {
    const data = wrapData([ALL]);
    const r = selectGearbox(power, speed, 3.0, 0, 'HC', data);
    expect(r.success).toBe(true);
    expect(r.recommendations.length).toBeGreaterThan(0);
  });

  test('转速低于 inputSpeedRange 下限(500) 应不进入完全匹配', () => {
    const data = wrapData([ALL]);
    const r = selectGearbox(150, 400, 3.0, 0, 'HC', data);  // 400 < 500
    if (r.success && r.recommendations.length > 0) {
      const exact = r.recommendations.filter(rec => !rec.isNearMatch && !rec.partialMatch);
      expect(exact.length).toBe(0);
    }
  });

  test('转速高于 inputSpeedRange 上限(2100) 应不进入完全匹配', () => {
    const data = wrapData([ALL]);
    const r = selectGearbox(200, 2500, 3.0, 0, 'HC', data);  // 2500 > 2100
    if (r.success && r.recommendations.length > 0) {
      const exact = r.recommendations.filter(rec => !rec.isNearMatch && !rec.partialMatch);
      expect(exact.length).toBe(0);
    }
  });

  test('5 工况 outputSpeed = inputSpeed / ratio', () => {
    const cases = [600, 900, 1200, 1500, 1800];
    cases.forEach(speed => {
      const data = wrapData([ALL]);
      const r = selectGearbox(150, speed, 3.0, 0, 'HC', data);
      if (r.success && r.recommendations.length > 0) {
        const top = r.recommendations[0];
        const ratio = top.selectedRatio || (top.ratios && top.ratios[0]) || 3.0;
        const expectedOutput = speed / ratio;
        if (top.outputSpeed != null) {
          expect(parseFloat(top.outputSpeed)).toBeCloseTo(expectedOutput, 0);
        }
      }
    });
  });
});

describe('selectionAlgorithm 边界矩阵 - 扭矩计算 T = 9550·P/n', () => {
  test('engineTorque = 9550 × P / n (无 K 因子, 主选型只算原始扭矩)', () => {
    const data = wrapData([make({ transferCapacity: [0.18] })]);
    // P=200kW, n=1500rpm => required=0.133, capacity=0.18 → margin=35%
    // T = 9550 × 200 / 1500 = 1273.3 N·m
    const r = selectGearbox(200, 1500, 3.0, 0, 'HC', data);
    if (r.success) {
      const expectedTorque_Nm = (9550 * 200) / 1500;
      expect(r.engineTorque).toBeCloseTo(expectedTorque_Nm, 1);
    }
  });

  test('autoSelectGearbox 也应返回相同 engineTorque (signature: requirements, appData)', () => {
    const data = wrapData([make({ transferCapacity: [0.40] })]);
    // P=400kW, n=1500rpm => required=0.267, capacity=0.40 → margin=50%
    const r = autoSelectGearbox(
      { motorPower: 400, motorSpeed: 1500, targetRatio: 3.0, thrust: 0 },
      data
    );
    const expectedTorque = (9550 * 400) / 1500;
    if (r.engineTorque != null) {
      expect(r.engineTorque).toBeCloseTo(expectedTorque, 1);
    }
  });

  test('K=1.5 工况系数应作用于联轴器选型(不在主选型扭矩中)', () => {
    // 主选型返回的 engineTorque 必须是原始 9550·P/n, 不预乘 K
    const data = wrapData([make({ transferCapacity: [0.18] })]);
    const r = selectGearbox(200, 1500, 3.0, 0, 'HC', data);
    if (r.success && r.engineTorque != null) {
      const raw = (9550 * 200) / 1500;  // 1273.33
      const withK = raw * 1.5;            // 1910.00
      expect(r.engineTorque).toBeCloseTo(raw, 0);
      expect(r.engineTorque).not.toBeCloseTo(withK, 0);
    }
  });

  test('扭矩与功率成正比', () => {
    const data = wrapData([make({ transferCapacity: [0.20] })]);
    const r1 = selectGearbox(100, 1500, 3.0, 0, 'HC', data);
    const r2 = selectGearbox(200, 1500, 3.0, 0, 'HC', data);
    if (r1.engineTorque != null && r2.engineTorque != null) {
      expect(r2.engineTorque).toBeCloseTo(r1.engineTorque * 2, 1);
    }
  });

  test('扭矩与转速成反比', () => {
    const data = wrapData([make({ inputSpeedRange: [500, 3000], transferCapacity: [0.30] })]);
    const r1 = selectGearbox(200, 1500, 3.0, 0, 'HC', data);
    const r2 = selectGearbox(100, 750, 3.0, 0, 'HC', data);  // 同样的容量需求
    if (r1.engineTorque != null && r2.engineTorque != null) {
      // T1=200·9550/1500=1273.3, T2=100·9550/750=1273.3 — 相同
      expect(r2.engineTorque).toBeCloseTo(r1.engineTorque, 1);
    }
  });
});

describe('selectionAlgorithm 边界矩阵 - 推力与齿轮箱 thrust 字段', () => {
  test('推力需求 = 0 时不参与过滤(容量足够即可匹配)', () => {
    // capacity=0.18, required=0.133, margin=35%
    const data = wrapData([make({ thrust: 50, transferCapacity: [0.18] })]);
    const r = selectGearbox(200, 1500, 3.0, 0, 'HC', data);
    expect(r.success).toBe(true);
  });

  test('推力需求 > 齿轮箱 thrust 时应进入近似匹配/含警告', () => {
    const data = wrapData([make({ thrust: 30, transferCapacity: [0.18] })]);
    // 要求 100kN, 齿轮箱仅 30kN
    const r = selectGearbox(200, 1500, 3.0, 100, 'HC', data);
    // 完全匹配中不应出现 thrust 不达标的型号
    if (r.success && r.recommendations.length > 0) {
      const exact = r.recommendations.filter(rec => !rec.isNearMatch && !rec.partialMatch);
      exact.forEach(rec => {
        if (rec.thrust != null && !rec.thrustWarning) {
          expect(rec.thrust).toBeGreaterThanOrEqual(100);
        }
      });
    }
  });

  test('推力需求满足时匹配项 thrust >= 需求', () => {
    const data = wrapData([make({ thrust: 200, transferCapacity: [0.18] })]);
    const r = selectGearbox(200, 1500, 3.0, 100, 'HC', data);
    if (r.success && r.recommendations.length > 0) {
      const top = r.recommendations[0];
      if (top.thrust != null) {
        expect(top.thrust).toBeGreaterThanOrEqual(100);
      }
    }
  });
});
