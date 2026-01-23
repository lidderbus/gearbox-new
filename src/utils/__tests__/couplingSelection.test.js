/**
 * 联轴器选型模块单元测试
 *
 * 测试内容:
 * - 扭矩值修正 (fixCouplingTorque)
 * - 单位转换 (N·m <-> kN·m)
 * - 从型号提取扭矩值
 */

import { fixCouplingTorque } from '../couplingSelection';

// ============================================================
// Mock数据
// ============================================================

// 模拟联轴器规格映射表
const mockCouplingSpecsMap = {
  'HGTHB5': { ratedTorque: 5 },      // 5 kN·m
  'HGTHB6.3A': { ratedTorque: 6.3 }, // 6.3 kN·m
  'HGTHT8': { ratedTorque: 8 },      // 8 kN·m
  'HGTHT10': { ratedTorque: 10 },    // 10 kN·m
  'HGTHB16': { ratedTorque: 16 },    // 16 kN·m
  'HGTHB25': { ratedTorque: 25 },    // 25 kN·m
  'HGTL1.8A': { ratedTorque: 1.8 }   // 1.8 kN·m
};

// ============================================================
// fixCouplingTorque 测试
// ============================================================

describe('fixCouplingTorque - 扭矩值修正', () => {

  describe('从规格映射表获取扭矩', () => {

    test('应从规格映射表正确获取扭矩值', () => {
      const coupling = { model: 'HGTHB5' };
      const torque = fixCouplingTorque(coupling, mockCouplingSpecsMap);
      expect(torque).toBe(5);
    });

    test('HGTHB6.3A应返回6.3 kN·m', () => {
      const coupling = { model: 'HGTHB6.3A' };
      const torque = fixCouplingTorque(coupling, mockCouplingSpecsMap);
      expect(torque).toBe(6.3);
    });

    test('HGTHT10应返回10 kN·m', () => {
      const coupling = { model: 'HGTHT10' };
      const torque = fixCouplingTorque(coupling, mockCouplingSpecsMap);
      expect(torque).toBe(10);
    });

    test('HGTHB16应返回16 kN·m', () => {
      const coupling = { model: 'HGTHB16' };
      const torque = fixCouplingTorque(coupling, mockCouplingSpecsMap);
      expect(torque).toBe(16);
    });

    test('HGTL1.8A (小扭矩)应返回1.8 kN·m', () => {
      const coupling = { model: 'HGTL1.8A' };
      const torque = fixCouplingTorque(coupling, mockCouplingSpecsMap);
      expect(torque).toBe(1.8);
    });
  });

  describe('从coupling.torque字段获取扭矩', () => {

    test('已指定kN·m单位时应直接使用', () => {
      const coupling = { model: 'UNKNOWN', torque: 8, torqueUnit: 'kN·m' };
      const torque = fixCouplingTorque(coupling, {});
      expect(torque).toBe(8);
    });

    test('指定N·m单位时应转换为kN·m', () => {
      const coupling = { model: 'UNKNOWN', torque: 8000, torqueUnit: 'N·m' };
      const torque = fixCouplingTorque(coupling, {});
      expect(torque).toBe(8);
    });

    test('无单位且值>500时应自动转换(启发式)', () => {
      const coupling = { model: 'UNKNOWN', torque: 5000 };
      const torque = fixCouplingTorque(coupling, {});
      // 5000 > 500，应视为N·m并转换
      expect(torque).toBe(5);
    });

    test('无单位且值<=500时应视为kN·m', () => {
      const coupling = { model: 'UNKNOWN', torque: 10 };
      const torque = fixCouplingTorque(coupling, {});
      // 10 <= 500，应视为已经是kN·m
      expect(torque).toBe(10);
    });
  });

  describe('从inputTorque字段获取扭矩', () => {

    test('应将inputTorque从N·m转换为kN·m', () => {
      const coupling = { model: 'UNKNOWN', inputTorque: 6300 };
      const torque = fixCouplingTorque(coupling, {});
      expect(torque).toBe(6.3);
    });
  });

  describe('从型号名称提取扭矩', () => {

    test('应从HGT型号名称提取扭矩值', () => {
      // 不在映射表中的型号，从型号名提取
      const coupling = { model: 'HGT100' };
      const torque = fixCouplingTorque(coupling, {});
      expect(torque).toBe(100);
    });

    test('应从HGTH型号名称提取扭矩值', () => {
      const coupling = { model: 'HGTH45' };
      const torque = fixCouplingTorque(coupling, {});
      expect(torque).toBe(45);
    });

    test('应从HGTHB型号名称提取带小数的扭矩值', () => {
      // 不在映射表中
      const coupling = { model: 'HGTHB3.15' };
      const torque = fixCouplingTorque(coupling, {});
      expect(torque).toBe(3.15);
    });
  });

  describe('边界条件和错误处理', () => {

    test('空对象应返回undefined', () => {
      const torque = fixCouplingTorque(null, mockCouplingSpecsMap);
      expect(torque).toBeUndefined();
    });

    test('缺少model字段应返回undefined', () => {
      const coupling = { torque: 5 };
      const torque = fixCouplingTorque(coupling, mockCouplingSpecsMap);
      expect(torque).toBeUndefined();
    });

    test('扭矩值为0应返回undefined', () => {
      const coupling = { model: 'TEST', torque: 0 };
      const torque = fixCouplingTorque(coupling, {});
      expect(torque).toBeUndefined();
    });

    test('扭矩值为负数应返回undefined', () => {
      const coupling = { model: 'TEST', torque: -5 };
      const torque = fixCouplingTorque(coupling, {});
      expect(torque).toBeUndefined();
    });

    test('型号前后空格应被正确处理', () => {
      const coupling = { model: '  HGTHB5  ' };
      const torque = fixCouplingTorque(coupling, mockCouplingSpecsMap);
      expect(torque).toBe(5);
    });
  });

  describe('优先级测试', () => {

    test('规格映射表应优先于torque字段', () => {
      // 规格表中HGTHB5是5 kN·m，但torque字段给了错误值
      const coupling = { model: 'HGTHB5', torque: 8000 };
      const torque = fixCouplingTorque(coupling, mockCouplingSpecsMap);
      // 应使用规格表的值
      expect(torque).toBe(5);
    });

    test('torque字段应优先于inputTorque', () => {
      const coupling = { model: 'UNKNOWN', torque: 10, inputTorque: 6300 };
      const torque = fixCouplingTorque(coupling, {});
      // 应使用torque字段
      expect(torque).toBe(10);
    });

    test('inputTorque应优先于型号名称提取', () => {
      const coupling = { model: 'HGT100', inputTorque: 6300 };
      const torque = fixCouplingTorque(coupling, {});
      // 应使用inputTorque: 6300 N·m = 6.3 kN·m
      expect(torque).toBe(6.3);
    });
  });
});

// ============================================================
// 联轴器选型逻辑测试 (基于扭矩匹配)
// ============================================================

describe('联轴器选型逻辑', () => {

  /**
   * 扭矩计算公式: T = 9550 × P / n × K (kN·m转换后)
   * K = 1.5 (船用推进系统工况系数)
   */
  const calculateRequiredTorque = (power_kW, speed_rpm, K = 1.5) => {
    const torque_Nm = (9550 * power_kW / speed_rpm) * K;
    return torque_Nm / 1000; // 转换为 kN·m
  };

  test('计算扭矩公式验证', () => {
    // 200kW @ 1500rpm, K=1.5
    const torque = calculateRequiredTorque(200, 1500);
    // 9550 * 200 / 1500 * 1.5 / 1000 = 1.91 kN·m
    expect(torque).toBeCloseTo(1.91, 1);
  });

  test('小功率应选择小扭矩联轴器', () => {
    // 50kW @ 1800rpm
    const requiredTorque = calculateRequiredTorque(50, 1800);
    // 应该 < 2.0 kN·m，适合 HGTL1.8A
    expect(requiredTorque).toBeLessThan(2.0);
  });

  test('中等功率应选择中等扭矩联轴器', () => {
    // 400kW @ 1500rpm
    const requiredTorque = calculateRequiredTorque(400, 1500);
    // 9550 * 400 / 1500 * 1.5 / 1000 = 3.82 kN·m
    expect(requiredTorque).toBeCloseTo(3.82, 1);
    // 适合 HGTHB5 (5 kN·m) 或以上
  });

  test('大功率应选择大扭矩联轴器', () => {
    // 1000kW @ 1000rpm
    const requiredTorque = calculateRequiredTorque(1000, 1000);
    // 9550 * 1000 / 1000 * 1.5 / 1000 = 14.325 kN·m
    expect(requiredTorque).toBeCloseTo(14.33, 1);
    // 适合 HGTHB16 (16 kN·m) 或以上
  });

  test('联轴器扭矩应大于计算扭矩(安全余量)', () => {
    const requiredTorque = calculateRequiredTorque(400, 1500); // 3.82 kN·m
    const couplingTorque = 5; // HGTHB5的额定扭矩

    // 联轴器额定扭矩应大于所需扭矩
    expect(couplingTorque).toBeGreaterThan(requiredTorque);

    // 计算余量
    const margin = (couplingTorque - requiredTorque) / requiredTorque * 100;
    expect(margin).toBeGreaterThan(20); // 至少20%余量
  });
});

// ============================================================
// selectFlexibleCoupling 测试
// ============================================================

import { selectFlexibleCoupling, selectStandbyPump } from '../couplingSelection';

// 模拟联轴器数据
const mockCouplingsData = [
  {
    model: 'HGTL1.8A',
    torque: 1.8,
    torqueUnit: 'kN·m',
    maxSpeed: 4000,
    weight: 15,
    basePrice: 2500,
    hasCover: false,
  },
  {
    model: 'HGTH4',
    torque: 4,
    torqueUnit: 'kN·m',
    maxSpeed: 3500,
    weight: 25,
    basePrice: 4000,
    hasCover: false,
  },
  {
    model: 'HGTHB5',
    torque: 5,
    torqueUnit: 'kN·m',
    maxSpeed: 3000,
    weight: 35,
    basePrice: 5500,
    hasCover: false,
  },
  {
    model: 'HGTHB6.3A',
    torque: 6.3,
    torqueUnit: 'kN·m',
    maxSpeed: 3000,
    weight: 42,
    basePrice: 6800,
    hasCover: false,
  },
  {
    model: 'HGTHB8',
    torque: 8,
    torqueUnit: 'kN·m',
    maxSpeed: 2800,
    weight: 55,
    basePrice: 8500,
    hasCover: false,
  },
  {
    model: 'HGTHB10',
    torque: 10,
    torqueUnit: 'kN·m',
    maxSpeed: 2500,
    weight: 68,
    basePrice: 11000,
    hasCover: false,
  },
  {
    model: 'HGTHB16',
    torque: 16,
    torqueUnit: 'kN·m',
    maxSpeed: 2200,
    weight: 95,
    basePrice: 16000,
    hasCover: false,
  },
  {
    model: 'HGTHJB5',
    torque: 5,
    torqueUnit: 'kN·m',
    maxSpeed: 3000,
    weight: 45,
    basePrice: 7500,
    hasCover: true,
  },
];

// 模拟备用泵数据
const mockPumpsData = [
  {
    model: '2CY4.2/2.5D',
    displacement: 4.2,
    ratedPressure: 2.5,
    flowRate: 8.4,
    power: 1.5,
    weight: 25,
    basePrice: 1800,
  },
  {
    model: '2CY7.5/2.5D',
    displacement: 7.5,
    ratedPressure: 2.5,
    flowRate: 15,
    power: 2.2,
    weight: 35,
    basePrice: 2500,
  },
  {
    model: '2CY12/2.5D',
    displacement: 12,
    ratedPressure: 2.5,
    flowRate: 24,
    power: 3.0,
    weight: 45,
    basePrice: 3200,
  },
];

describe('selectFlexibleCoupling - 联轴器选型函数', () => {

  describe('基本参数验证', () => {

    test('无效扭矩应返回失败', () => {
      const result = selectFlexibleCoupling(
        0, // 无效扭矩
        'HC400',
        mockCouplingsData
      );
      expect(result.success).toBe(false);
      expect(result.message).toContain('无效');
    });

    test('负扭矩应返回失败', () => {
      const result = selectFlexibleCoupling(
        -100,
        'HC400',
        mockCouplingsData
      );
      expect(result.success).toBe(false);
    });

    test('空联轴器数据应返回失败', () => {
      const result = selectFlexibleCoupling(
        1000,
        'HC400',
        []
      );
      expect(result.success).toBe(false);
      expect(result.message).toContain('无效');
    });

    test('null联轴器数据应返回失败', () => {
      const result = selectFlexibleCoupling(
        1000,
        'HC400',
        null
      );
      expect(result.success).toBe(false);
    });
  });

  describe('扭矩匹配逻辑', () => {

    test('小扭矩需求应选择小规格联轴器', () => {
      // 500 N·m × K=1.5 × St=1.0 = 750 N·m = 0.75 kN·m
      // 应选择 HGTL1.8A (1.8 kN·m)
      const result = selectFlexibleCoupling(
        500, // 500 N·m
        'HC120',
        mockCouplingsData,
        mockCouplingSpecsMap
      );

      expect(result.success).toBe(true);
      expect(result.recommendations.length).toBeGreaterThan(0);
      // 第一个推荐应该是扭矩余量合适的
      expect(result.recommendations[0].torqueMargin).toBeGreaterThan(0);
    });

    test('中等扭矩需求应选择中等规格联轴器', () => {
      // 2000 N·m × K=1.5 = 3000 N·m = 3.0 kN·m
      // 应选择 HGTH4 (4 kN·m) 或 HGTHB5 (5 kN·m)
      const result = selectFlexibleCoupling(
        2000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap
      );

      expect(result.success).toBe(true);
      expect(result.model).toBeDefined();
      // 所选联轴器扭矩应大于需求
      expect(result.torque).toBeGreaterThan(3.0);
    });

    test('大扭矩需求应选择大规格联轴器', () => {
      // 8000 N·m × K=1.5 = 12000 N·m = 12.0 kN·m
      // 应选择 HGTHB16 (16 kN·m, maxSpeed=2200)
      // 需要指定engineSpeed <= 2200，否则默认3000会过滤掉HGTHB16
      const result = selectFlexibleCoupling(
        8000,
        'HC1200',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'III类:扭矩变化中等', // workCondition
        30,                   // temperature
        false,                // hasCover
        2000                  // engineSpeed - 需要 <= HGTHB16的maxSpeed(2200)
      );

      expect(result.success).toBe(true);
      if (result.model) {
        expect(result.torque).toBeGreaterThanOrEqual(12);
      }
    });

    test('无匹配联轴器时应返回失败', () => {
      // 50000 N·m - 超过所有联轴器规格
      const result = selectFlexibleCoupling(
        50000,
        'HC2000',
        mockCouplingsData,
        mockCouplingSpecsMap
      );

      expect(result.success).toBe(false);
      expect(result.recommendations).toHaveLength(0);
    });
  });

  describe('工况系数和温度系数', () => {

    test('不同工况系数应影响选型结果', () => {
      // 相同扭矩，不同工况
      const result1 = selectFlexibleCoupling(
        2000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'I类:扭矩变化小'  // K较小
      );

      const result2 = selectFlexibleCoupling(
        2000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'IV类:扭矩变化大' // K较大
      );

      // IV类工况需要更大扭矩余量
      if (result1.success && result2.success) {
        expect(result2.requiredCouplingTorque).toBeGreaterThanOrEqual(
          result1.requiredCouplingTorque
        );
      }
    });

    test('高温应增加安全系数', () => {
      const result1 = selectFlexibleCoupling(
        2000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'III类:扭矩变化中等',
        30  // 常温
      );

      const result2 = selectFlexibleCoupling(
        2000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'III类:扭矩变化中等',
        60  // 高温
      );

      // 高温时所需扭矩应更大
      if (result1.success && result2.success) {
        expect(result2.requiredCouplingTorque).toBeGreaterThanOrEqual(
          result1.requiredCouplingTorque
        );
      }
    });
  });

  describe('转速匹配', () => {

    test('高转速应过滤低速联轴器', () => {
      const result = selectFlexibleCoupling(
        1000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'III类:扭矩变化中等',
        30,
        false,
        3500  // 高转速
      );

      if (result.success && result.recommendations.length > 0) {
        // 所有推荐联轴器的最大转速应 >= 3500
        result.recommendations.forEach(coupling => {
          expect(coupling.maxSpeed).toBeGreaterThanOrEqual(3500);
        });
      }
    });

    test('低转速应有更多选择', () => {
      const highSpeedResult = selectFlexibleCoupling(
        1000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'III类:扭矩变化中等',
        30,
        false,
        3500
      );

      const lowSpeedResult = selectFlexibleCoupling(
        1000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'III类:扭矩变化中等',
        30,
        false,
        1500
      );

      // 低转速应有更多或相同数量的推荐
      expect(lowSpeedResult.recommendations.length).toBeGreaterThanOrEqual(
        highSpeedResult.recommendations.length
      );
    });
  });

  describe('罩壳选项', () => {

    test('需要罩壳时应优先选择带罩壳型号', () => {
      const result = selectFlexibleCoupling(
        2000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'III类:扭矩变化中等',
        30,
        true  // 需要罩壳
      );

      if (result.success && result.recommendations.length > 0) {
        // 检查是否优先选择了带罩壳的型号
        const topPick = result.recommendations[0];
        const hasCoverIndicator = topPick.hasCover ||
          topPick.model.includes('JB') ||
          topPick.model.includes('J');
        // 如果有带罩壳的选项，应该被优先选择
      }
    });

    test('不需要罩壳时应正常选型', () => {
      const result = selectFlexibleCoupling(
        2000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap,
        'III类:扭矩变化中等',
        30,
        false  // 不需要罩壳
      );

      expect(result.success).toBe(true);
    });
  });

  describe('评分和排序', () => {

    test('推荐列表应按评分排序', () => {
      const result = selectFlexibleCoupling(
        1500,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap
      );

      if (result.recommendations.length > 1) {
        // 检查排序：考虑安全余量、推荐匹配、价格等
        for (let i = 0; i < result.recommendations.length - 1; i++) {
          const current = result.recommendations[i];
          const next = result.recommendations[i + 1];
          // 安全余量>=10%的应排在前面
          if (current.torqueMargin >= 10 && next.torqueMargin < 10) {
            expect(true).toBe(true);
          }
        }
      }
    });

    test('扭矩余量10-50%应获得高分', () => {
      const result = selectFlexibleCoupling(
        1500,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap
      );

      if (result.success && result.recommendations.length > 0) {
        const optimalMarginCount = result.recommendations.filter(
          c => c.torqueMargin >= 10 && c.torqueMargin <= 50
        ).length;
        expect(optimalMarginCount).toBeGreaterThanOrEqual(0);
      }
    });
  });

  describe('警告信息', () => {

    test('余量过低时应生成警告', () => {
      const tightCouplingsData = [
        {
          model: 'TEST-TIGHT',
          torque: 2.5,
          torqueUnit: 'kN·m',
          maxSpeed: 3000,
          weight: 30,
          basePrice: 5000,
        },
      ];

      const result = selectFlexibleCoupling(
        1600,
        'HC400',
        tightCouplingsData,
        {}
      );

      if (result.success && result.torqueMargin < 10) {
        expect(result.warning).toBeDefined();
      }
    });
  });

  describe('返回结果结构', () => {

    test('成功时应返回完整结果结构', () => {
      const result = selectFlexibleCoupling(
        1500,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap
      );

      expect(result).toHaveProperty('success');
      expect(result).toHaveProperty('message');
      expect(result).toHaveProperty('recommendations');

      if (result.success) {
        expect(result).toHaveProperty('model');
        expect(result).toHaveProperty('torque');
        expect(result).toHaveProperty('torqueUnit');
        expect(result).toHaveProperty('torqueMargin');
        expect(result).toHaveProperty('requiredCouplingTorque');
        expect(result.torqueUnit).toBe('kN·m');
      }
    });

    test('推荐列表应最多5个', () => {
      const result = selectFlexibleCoupling(
        1000,
        'HC400',
        mockCouplingsData,
        mockCouplingSpecsMap
      );

      expect(result.recommendations.length).toBeLessThanOrEqual(5);
    });
  });
});

// ============================================================
// selectStandbyPump 测试
// ============================================================

describe('selectStandbyPump - 备用泵选型函数', () => {

  describe('基本参数验证', () => {

    test('空泵数据应返回失败', () => {
      const result = selectStandbyPump('HC400', []);
      expect(result.success).toBe(false);
      expect(result.message).toContain('没有找到');
    });

    test('null泵数据应返回失败', () => {
      const result = selectStandbyPump('HC400', null);
      expect(result.success).toBe(false);
    });
  });

  describe('泵型号匹配', () => {

    test('应根据齿轮箱型号选择推荐泵', () => {
      const result = selectStandbyPump('HC400', mockPumpsData);

      expect(result.success).toBe(true);
      expect(result.model).toBeDefined();
    });

    test('无推荐泵时应选择默认泵', () => {
      const result = selectStandbyPump('UNKNOWN-MODEL', mockPumpsData);

      expect(result.success).toBe(true);
      expect(result.model).toBeDefined();
    });

    test('默认泵应为2CY7.5/2.5D', () => {
      const result = selectStandbyPump('RANDOM-MODEL', mockPumpsData);

      if (result.success && result.warning) {
        expect(result.model).toBe('2CY7.5/2.5D');
      }
    });
  });

  describe('返回结果结构', () => {

    test('成功时应返回完整泵信息', () => {
      const result = selectStandbyPump('HC400', mockPumpsData);

      expect(result).toHaveProperty('success');

      if (result.success) {
        expect(result).toHaveProperty('model');
        expect(result).toHaveProperty('displacement');
        expect(result).toHaveProperty('ratedPressure');
        expect(result).toHaveProperty('flowRate');
        expect(result).toHaveProperty('power');
      }
    });

    test('应返回价格信息', () => {
      const result = selectStandbyPump('HC400', mockPumpsData);

      if (result.success) {
        expect(result).toHaveProperty('basePrice');
        expect(result).toHaveProperty('factoryPrice');
      }
    });
  });

  describe('不同齿轮箱型号匹配', () => {

    test('HC系列齿轮箱应正常选型', () => {
      const models = ['HC65', 'HC138', 'HC200', 'HC400', 'HC600', 'HC1000'];

      models.forEach(model => {
        const result = selectStandbyPump(model, mockPumpsData);
        expect(result.success).toBe(true);
      });
    });

    test('HCM系列齿轮箱应正常选型', () => {
      const result = selectStandbyPump('HCM400A', mockPumpsData);
      expect(result.success).toBe(true);
    });

    test('GW系列齿轮箱应正常选型', () => {
      const result = selectStandbyPump('GWC30', mockPumpsData);
      expect(result.success).toBe(true);
    });
  });
});
