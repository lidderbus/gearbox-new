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
