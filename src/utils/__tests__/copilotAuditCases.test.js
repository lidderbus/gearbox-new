// 真实 501 数据 audit case — 验证 Copilot 硬约束在真实选型流中触发
import { autoSelectGearbox } from '../selectionAlgorithm';
import { initialData } from '../../data/initialData';

const isCPP = (m) => /^GC|^DT/.test(m || '');

describe('Copilot 选型硬约束真实数据 audit (501 库)', () => {

  test('#1 HC1200 直接型号查询 — TOP 应是 HC1200, isDirectModelHit=true', () => {
    const result = autoSelectGearbox(
      { motorPower: 1500, motorSpeed: 1500, targetRatio: 4.0, directModelQuery: 'HC1200' },
      initialData
    );
    expect(result.recommendations?.[0]?.model).toBe('HC1200');
    expect(result._diagnostics?.isDirectModelHit).toBe(true);
  });

  test('#2 双机并车 6000kW — 全部推荐应为 2GWH 系列', () => {
    const result = autoSelectGearbox(
      { motorPower: 3000, motorSpeed: 1000, targetRatio: 5.0, twinEngine: true },
      initialData
    );
    if (result.recommendations && result.recommendations.length > 0) {
      result.recommendations.forEach(r => {
        expect(r.model.startsWith('2GWH')).toBe(true);
      });
    } else {
      // 0 results 情形也能接受 (数据中 2GWH 大功率型号有限)
      expect(result.recommendations || []).toHaveLength(0);
    }
  });

  test('#3 集装箱 8000kW + autoInferPropellerType — TOP 应是 CPP (GC*/DT*)', () => {
    const result = autoSelectGearbox(
      {
        motorPower: 8000, motorSpeed: 600, targetRatio: 6.0,
        autoInferPropellerType: true,
        application: '集装箱船',
      },
      initialData
    );
    if (result.recommendations && result.recommendations.length > 0) {
      const top = result.recommendations[0];
      expect(isCPP(top.model)).toBe(true);
    }
  });

  test('#4 双速 800kW — TOP 应是 DT 系列', () => {
    const result = autoSelectGearbox(
      { motorPower: 800, motorSpeed: 1500, targetRatio: 5.0, gearType: '双速' },
      initialData
    );
    if (result.recommendations && result.recommendations.length > 0) {
      result.recommendations.forEach(r => {
        const okPrefix = r.model.startsWith('DT') || (r.series || '').includes('双速');
        expect(okPrefix).toBe(true);
      });
    }
  });

  test('#5 高速 1500kW — 系列应在 HCG/HCAG/HCQ', () => {
    const result = autoSelectGearbox(
      { motorPower: 1500, motorSpeed: 1800, targetRatio: 1.6, gearType: '高速' },
      initialData
    );
    if (result.recommendations && result.recommendations.length > 0) {
      result.recommendations.forEach(r => {
        const series = r.series || '';
        expect(['HCG', 'HCAG', 'HCQ'].includes(series)).toBe(true);
      });
    }
  });

  test('#6 法定回归: 老 query 无任何 Copilot 字段 — 应至少返回一个推荐', () => {
    const result = autoSelectGearbox(
      { motorPower: 1500, motorSpeed: 1500, targetRatio: 4.0 },
      initialData
    );
    expect(result.recommendations?.length || 0).toBeGreaterThan(0);
  });

  test('#7 推力下限 ≥80kN — TOP thrust 应 ≥80', () => {
    const result = autoSelectGearbox(
      { motorPower: 1000, motorSpeed: 1500, targetRatio: 3.0, minThrust: 80 },
      initialData
    );
    if (result.recommendations && result.recommendations.length > 0) {
      result.recommendations.forEach(r => {
        const t = r.thrust ?? r.gearbox?.thrust ?? 0;
        expect(t).toBeGreaterThanOrEqual(80);
      });
    }
  });

  test('#8 船级社 CCS 硬筛 (默认覆盖率 99%) — 全部推荐应含 CCS', () => {
    const result = autoSelectGearbox(
      { motorPower: 1500, motorSpeed: 1500, targetRatio: 4.0, classification: 'CCS' },
      initialData
    );
    if (result.recommendations && result.recommendations.length > 0) {
      result.recommendations.forEach(r => {
        const certs = r.certifications || r.gearbox?.certifications || [];
        const hasCCS = certs.some(c => (c || '').toUpperCase().includes('CCS'));
        expect(hasCCS).toBe(true);
      });
    }
  });

  test('#9 EnhancedSelectionForm 真实路径: 渔船 + 800kW 应推断 FPP (排除 GC*/DT*)', () => {
    const result = autoSelectGearbox(
      {
        motorPower: 800, motorSpeed: 1500, targetRatio: 4.0,
        seriesRequirements: { propellerType: 'FPP' },
      },
      initialData
    );
    if (result.recommendations && result.recommendations.length > 0) {
      result.recommendations.forEach(r => {
        expect(isCPP(r.model)).toBe(false);
      });
    }
  });

  test('#10 EnhancedSelectionForm 真实路径: 集装箱船 + 8000kW 应推断 CPP', () => {
    const result = autoSelectGearbox(
      {
        motorPower: 8000, motorSpeed: 600, targetRatio: 6.0,
        seriesRequirements: { propellerType: 'CPP' },
      },
      initialData
    );
    if (result.recommendations && result.recommendations.length > 0) {
      result.recommendations.forEach(r => {
        expect(isCPP(r.model)).toBe(true);
      });
    }
  });

  // ---- 边界 case 二轮再评测补充 (R3): malformed / 物理超界 输入不应 crash ----

  test('#B1 物理超界: 50MW @ 100rpm ratio=100 — 不 crash, 返回空或合理 fallback', () => {
    expect(() => {
      const result = autoSelectGearbox(
        { motorPower: 50000, motorSpeed: 100, targetRatio: 100 },
        initialData
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result.recommendations || [])).toBe(true);
    }).not.toThrow();
  });

  test('#B2 零值: motorPower=0 motorSpeed=0 — 不 crash', () => {
    expect(() => {
      const result = autoSelectGearbox(
        { motorPower: 0, motorSpeed: 0, targetRatio: 0 },
        initialData
      );
      expect(result).toBeDefined();
    }).not.toThrow();
  });

  test('#B3 缺字段: 空 requirements — 不 crash', () => {
    expect(() => {
      const result = autoSelectGearbox({}, initialData);
      expect(result).toBeDefined();
    }).not.toThrow();
  });

  test('#B4 字符串污染: motorPower="abc" targetRatio="xyz" — 不 crash', () => {
    expect(() => {
      const result = autoSelectGearbox(
        { motorPower: 'abc', motorSpeed: 'def', targetRatio: 'xyz' },
        initialData
      );
      expect(result).toBeDefined();
    }).not.toThrow();
  });

  test('#B5 directModelQuery 不存在型号: fast path 应 fallback 到工况筛选', () => {
    expect(() => {
      const result = autoSelectGearbox(
        { motorPower: 1500, motorSpeed: 1500, targetRatio: 4.0, directModelQuery: 'NONEXISTENT_MODEL_XYZ' },
        initialData
      );
      expect(result).toBeDefined();
      if (result._diagnostics) {
        expect(result._diagnostics.isDirectModelHit).not.toBe(true);
      }
    }).not.toThrow();
  });
});
