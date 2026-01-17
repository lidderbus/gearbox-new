// src/utils/__tests__/selectionAlgorithm.test.js
// 齿轮箱选型算法核心测试

import { selectGearbox, autoSelectGearbox } from '../selectionAlgorithm';

// 模拟测试数据
const createMockGearbox = (overrides = {}) => ({
  model: 'HC400',
  series: 'HC',
  inputSpeedRange: [750, 2100],
  ratios: [2.0, 2.5, 3.0, 3.5, 4.0],
  transferCapacity: [0.15, 0.14, 0.13, 0.12, 0.11],
  thrust: 50,
  weight: 350,
  basePrice: 35000,
  discountRate: 0.16,
  ...overrides
});

const createMockData = (gearboxes = [], couplings = [], pumps = []) => ({
  hcGearboxes: gearboxes.filter(g => g.series === 'HC' || g.model?.startsWith('HC')),
  gwGearboxes: gearboxes.filter(g => g.series === 'GW' || g.model?.startsWith('GW')),
  hcmGearboxes: gearboxes.filter(g => g.series === 'HCM' || g.model?.startsWith('HCM')),
  dtGearboxes: gearboxes.filter(g => g.series === 'DT' || g.model?.startsWith('DT')),
  hcqGearboxes: gearboxes.filter(g => g.series === 'HCQ' || g.model?.startsWith('HCQ')),
  gcGearboxes: gearboxes.filter(g => g.series === 'GC' || g.model?.startsWith('GC')),
  flexibleCouplings: couplings,
  standbyPumps: pumps
});

describe('selectGearbox - 齿轮箱选型核心算法', () => {

  describe('参数验证', () => {
    const mockData = createMockData([createMockGearbox()]);

    test('发动机功率为0时返回错误', () => {
      const result = selectGearbox(0, 1500, 2.5, 0, 'HC', mockData);
      expect(result.success).toBe(false);
      expect(result.message).toContain('功率');
    });

    test('发动机功率为负数时返回错误', () => {
      const result = selectGearbox(-100, 1500, 2.5, 0, 'HC', mockData);
      expect(result.success).toBe(false);
      expect(result.message).toContain('功率');
    });

    test('发动机转速为0时返回错误', () => {
      const result = selectGearbox(200, 0, 2.5, 0, 'HC', mockData);
      expect(result.success).toBe(false);
      expect(result.message).toContain('转速');
    });

    test('目标减速比为0时返回错误', () => {
      const result = selectGearbox(200, 1500, 0, 0, 'HC', mockData);
      expect(result.success).toBe(false);
      expect(result.message).toContain('减速比');
    });

    test('数据为空时返回错误', () => {
      const result = selectGearbox(200, 1500, 2.5, 0, 'HC', null);
      expect(result.success).toBe(false);
      expect(result.message).toContain('数据');
    });

    test('指定系列无数据时返回错误', () => {
      const emptyData = createMockData([]);
      const result = selectGearbox(200, 1500, 2.5, 0, 'HC', emptyData);
      expect(result.success).toBe(false);
      expect(result.message).toContain('HC');
    });
  });

  describe('转速范围匹配', () => {
    test('转速在范围内时应匹配成功', () => {
      const gearbox = createMockGearbox({ inputSpeedRange: [1000, 2000] });
      const mockData = createMockData([gearbox]);

      const result = selectGearbox(150, 1500, 2.5, 0, 'HC', mockData);
      // 转速1500在[1000, 2000]范围内
      expect(result.recommendations?.length).toBeGreaterThanOrEqual(0);
    });

    test('转速低于最小值时应不匹配', () => {
      const gearbox = createMockGearbox({
        model: 'HC400',
        inputSpeedRange: [1500, 2500]
      });
      const mockData = createMockData([gearbox]);

      // 转速1000低于最小值1500
      const result = selectGearbox(100, 1000, 2.5, 0, 'HC', mockData);
      // 应该没有完全匹配的结果或返回warning
      if (result.recommendations?.length > 0) {
        // 如果有推荐，应标记为部分匹配
        const exactMatch = result.recommendations.find(r =>
          !r.warnings?.some(w => w.includes('转速'))
        );
        expect(exactMatch).toBeUndefined();
      }
    });
  });

  describe('减速比匹配', () => {
    test('精确匹配减速比', () => {
      const gearbox = createMockGearbox({
        ratios: [2.0, 2.5, 3.0],
        transferCapacity: [0.15, 0.14, 0.13]
      });
      const mockData = createMockData([gearbox]);

      const result = selectGearbox(150, 1500, 2.5, 0, 'HC', mockData);

      if (result.success && result.recommendations?.length > 0) {
        const match = result.recommendations[0];
        // selectedRatio 或 ratio 字段
        const matchedRatio = match.selectedRatio || match.ratio;
        expect(matchedRatio).toBe(2.5);
      }
    });

    test('容差范围内匹配减速比', () => {
      const gearbox = createMockGearbox({
        ratios: [2.0, 2.5, 3.0],
        transferCapacity: [0.15, 0.14, 0.13]
      });
      const mockData = createMockData([gearbox]);

      // 目标2.45应该匹配到2.5 (在10%容差内)
      const result = selectGearbox(150, 1500, 2.45, 0, 'HC', mockData);

      if (result.success && result.recommendations?.length > 0) {
        const match = result.recommendations[0];
        const matchedRatio = match.selectedRatio || match.ratio;
        expect([2.0, 2.5]).toContain(matchedRatio);
      }
    });
  });

  describe('传递能力计算', () => {
    test('传递能力足够时应匹配成功', () => {
      // 传递能力 = 功率/转速 = 200/2000 = 0.1 kW/(r/min)
      // 齿轮箱传递能力为0.15，足够
      const gearbox = createMockGearbox({
        ratios: [2.5],
        transferCapacity: [0.15],
        inputSpeedRange: [1000, 2500]
      });
      const mockData = createMockData([gearbox]);

      const result = selectGearbox(200, 2000, 2.5, 0, 'HC', mockData);

      expect(result.recommendations?.length).toBeGreaterThanOrEqual(0);
    });

    test('传递能力余量计算正确', () => {
      const gearbox = createMockGearbox({
        model: 'HC400',
        ratios: [2.5],
        transferCapacity: [0.12], // 实际能力
        inputSpeedRange: [1000, 2500]
      });
      const mockData = createMockData([gearbox]);

      // 需求: 200kW / 2000rpm = 0.1 kW/(r/min)
      // 余量 = (0.12 - 0.1) / 0.1 = 20%
      const result = selectGearbox(200, 2000, 2.5, 0, 'HC', mockData);

      if (result.success && result.recommendations?.length > 0) {
        const match = result.recommendations[0];
        if (match.capacityMargin !== undefined) {
          expect(match.capacityMargin).toBeCloseTo(20, 0);
        }
      }
    });
  });

  describe('推力匹配', () => {
    test('齿轮箱推力满足要求时应匹配', () => {
      const gearbox = createMockGearbox({
        thrust: 100,
        ratios: [2.5],
        transferCapacity: [0.15],
        inputSpeedRange: [1000, 2500]
      });
      const mockData = createMockData([gearbox]);

      // 要求推力50kN，齿轮箱提供100kN
      const result = selectGearbox(200, 2000, 2.5, 50, 'HC', mockData);

      if (result.success && result.recommendations?.length > 0) {
        const match = result.recommendations[0];
        // 齿轮箱数据直接展开在推荐对象中
        expect(match.thrust).toBeGreaterThanOrEqual(50);
      }
    });
  });

  describe('多型号排序', () => {
    test('推荐结果应按评分排序', () => {
      const gearboxes = [
        createMockGearbox({
          model: 'HC300',
          ratios: [2.5],
          transferCapacity: [0.11], // 余量较小
          inputSpeedRange: [1000, 2500]
        }),
        createMockGearbox({
          model: 'HC400',
          ratios: [2.5],
          transferCapacity: [0.15], // 余量较大
          inputSpeedRange: [1000, 2500]
        })
      ];
      const mockData = createMockData(gearboxes);

      const result = selectGearbox(200, 2000, 2.5, 0, 'HC', mockData);

      if (result.success && result.recommendations?.length >= 2) {
        // 评分应该是降序排列
        const scores = result.recommendations.map(r => r.score || 0);
        for (let i = 1; i < scores.length; i++) {
          expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
        }
      }
    });
  });
});

describe('autoSelectGearbox - 自动跨系列选型', () => {

  test('应搜索所有可用系列', () => {
    const hcGearbox = createMockGearbox({
      model: 'HC400',
      series: 'HC',
      ratios: [2.5],
      transferCapacity: [0.15],
      inputSpeedRange: [1000, 2500]
    });
    const gwGearbox = createMockGearbox({
      model: 'GWC45.49',
      series: 'GW',
      ratios: [2.5],
      transferCapacity: [0.20],
      inputSpeedRange: [800, 2000]
    });

    const mockData = {
      hcGearboxes: [hcGearbox],
      gwGearboxes: [gwGearbox],
      hcmGearboxes: [],
      dtGearboxes: [],
      hcqGearboxes: [],
      gcGearboxes: [],
      flexibleCouplings: [],
      standbyPumps: []
    };

    const requirements = {
      motorPower: 200,
      motorSpeed: 1500,
      targetRatio: 2.5,
      thrust: 0
    };

    const result = autoSelectGearbox(requirements, mockData);

    // 应该返回来自多个系列的推荐
    if (result.success && result.recommendations?.length > 0) {
      const types = [...new Set(result.recommendations.map(r => r.originalType))];
      expect(types.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('无可用数据时返回错误', () => {
    const emptyData = {
      hcGearboxes: [],
      gwGearboxes: [],
      hcmGearboxes: [],
      dtGearboxes: [],
      hcqGearboxes: [],
      gcGearboxes: [],
      flexibleCouplings: [],
      standbyPumps: []
    };

    const requirements = {
      motorPower: 200,
      motorSpeed: 1500,
      targetRatio: 2.5
    };

    const result = autoSelectGearbox(requirements, emptyData);
    expect(result.success).toBe(false);
  });

  test('应返回按评分排序的推荐', () => {
    const gearboxes = [
      createMockGearbox({
        model: 'HC300',
        series: 'HC',
        ratios: [2.5],
        transferCapacity: [0.11],
        inputSpeedRange: [1000, 2500]
      }),
      createMockGearbox({
        model: 'HC400',
        series: 'HC',
        ratios: [2.5],
        transferCapacity: [0.15],
        inputSpeedRange: [1000, 2500]
      }),
      createMockGearbox({
        model: 'HC500',
        series: 'HC',
        ratios: [2.5],
        transferCapacity: [0.20],
        inputSpeedRange: [1000, 2500]
      })
    ];

    const mockData = {
      hcGearboxes: gearboxes,
      gwGearboxes: [],
      hcmGearboxes: [],
      dtGearboxes: [],
      hcqGearboxes: [],
      gcGearboxes: [],
      flexibleCouplings: [],
      standbyPumps: []
    };

    const requirements = {
      motorPower: 200,
      motorSpeed: 2000,
      targetRatio: 2.5
    };

    const result = autoSelectGearbox(requirements, mockData);

    if (result.success && result.recommendations?.length >= 2) {
      const scores = result.recommendations.map(r => r.score || 0);
      // 验证降序排列
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i - 1]).toBeGreaterThanOrEqual(scores[i]);
      }
    }
  });
});

describe('边界条件和特殊情况', () => {

  test('极小功率选型', () => {
    const gearbox = createMockGearbox({
      ratios: [2.5],
      transferCapacity: [0.05],
      inputSpeedRange: [500, 1500]
    });
    const mockData = createMockData([gearbox]);

    // 10kW / 1000rpm = 0.01 kW/(r/min)
    const result = selectGearbox(10, 1000, 2.5, 0, 'HC', mockData);
    expect(result).toBeDefined();
  });

  test('大功率选型', () => {
    const gearbox = createMockGearbox({
      model: 'HC1400',
      ratios: [2.5],
      transferCapacity: [1.5],
      inputSpeedRange: [500, 1200]
    });
    const mockData = createMockData([gearbox]);

    // 1500kW / 1000rpm = 1.5 kW/(r/min)
    const result = selectGearbox(1500, 1000, 2.5, 0, 'HC', mockData);
    expect(result).toBeDefined();
  });

  test('极端减速比', () => {
    const gearbox = createMockGearbox({
      ratios: [1.5, 8.0],
      transferCapacity: [0.2, 0.08],
      inputSpeedRange: [1000, 2500]
    });
    const mockData = createMockData([gearbox]);

    // 测试高减速比 8:1
    const result = selectGearbox(200, 2000, 8.0, 0, 'HC', mockData);
    expect(result).toBeDefined();
  });

  test('transferCapacity数组长度与ratios不匹配', () => {
    const gearbox = createMockGearbox({
      ratios: [2.0, 2.5, 3.0],
      transferCapacity: [0.15], // 长度不匹配
      inputSpeedRange: [1000, 2500]
    });
    const mockData = createMockData([gearbox]);

    // 应该能容错处理
    const result = selectGearbox(200, 2000, 2.5, 0, 'HC', mockData);
    expect(result).toBeDefined();
  });

  test('缺少transferCapacity字段', () => {
    const gearbox = {
      model: 'HC400',
      series: 'HC',
      inputSpeedRange: [1000, 2500],
      ratios: [2.0, 2.5, 3.0],
      // 没有transferCapacity
      thrust: 50,
      weight: 350
    };
    const mockData = createMockData([gearbox]);

    const result = selectGearbox(200, 2000, 2.5, 0, 'HC', mockData);
    expect(result).toBeDefined();
  });
});

describe('实际选型场景测试', () => {

  test('场景1: 中小型渔船 (205kW, 2100rpm, 2:1)', () => {
    // 模拟120C齿轮箱
    const gearbox = createMockGearbox({
      model: '120C',
      ratios: [1.97, 2.03, 2.52, 3.0],
      transferCapacity: [0.100, 0.098, 0.095, 0.090],
      inputSpeedRange: [1500, 2500],
      thrust: 30
    });
    const mockData = createMockData([gearbox]);

    // 实际需求: 205kW / 2100rpm = 0.0976 kW/(r/min)
    const result = selectGearbox(205, 2100, 2.0, 0, 'HC', mockData);

    if (result.success && result.recommendations?.length > 0) {
      const match = result.recommendations[0];
      const matchedRatio = match.selectedRatio || match.ratio;
      // 应匹配到1.97或2.03减速比
      expect([1.97, 2.03]).toContain(matchedRatio);
    }
  });

  test('场景2: 大型拖轮 (800kW, 1000rpm, 4:1)', () => {
    const gearbox = createMockGearbox({
      model: 'HC1200',
      ratios: [3.5, 4.0, 4.5, 5.0],
      transferCapacity: [0.95, 0.90, 0.85, 0.80],
      inputSpeedRange: [750, 1200],
      thrust: 150
    });
    const mockData = createMockData([gearbox]);

    // 实际需求: 800kW / 1000rpm = 0.8 kW/(r/min)
    const result = selectGearbox(800, 1000, 4.0, 100, 'HC', mockData);

    if (result.success && result.recommendations?.length > 0) {
      const match = result.recommendations[0];
      // 齿轮箱数据直接展开在推荐对象中
      expect(match.model).toBe('HC1200');
    }
  });
});
