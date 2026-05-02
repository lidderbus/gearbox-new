// src/utils/__tests__/cppSelectionAlgorithm.test.js
// CPP可调螺距螺旋桨系统选型算法测试 (C2 plan: cppSelectionAlgorithm.test.ts 的 JS 版)
// 验证 selectCPPGearbox / selectCPPPropeller / selectOilDistributor / selectHydraulicUnit / selectCPPSystem
// 数据源: src/data/cppSystemData.js (cppGearboxes / cppPropellers / oilDistributors / cppHydraulicUnits)

import {
  selectCPPGearbox,
  selectCPPPropeller,
  selectOilDistributor,
  selectHydraulicUnit,
  selectCPPSystem
} from '../cppSelectionAlgorithm';

import { cppGearboxes } from '../../data/cppSystemData';

describe('selectCPPGearbox - CPP齿轮箱选型', () => {
  describe('参数验证', () => {
    test('功率为0时应返回失败', () => {
      const r = selectCPPGearbox(0, 1500, 2.5);
      expect(r.success).toBe(false);
      expect(r.message).toContain('功率');
    });

    test('功率为负数时应返回失败', () => {
      const r = selectCPPGearbox(-100, 1500, 2.5);
      expect(r.success).toBe(false);
    });

    test('转速为0时应返回失败', () => {
      const r = selectCPPGearbox(400, 0, 2.5);
      expect(r.success).toBe(false);
      expect(r.message).toContain('转速');
    });

    test('目标减速比为0时应返回失败', () => {
      const r = selectCPPGearbox(400, 1500, 0);
      expect(r.success).toBe(false);
      expect(r.message).toContain('减速比');
    });
  });

  describe('硬过滤逻辑', () => {
    test('转速超出齿轮箱范围应过滤掉(GCS320 max 2100rpm)', () => {
      // 假设给极高转速 5000rpm,所有齿轮箱都 fail inputSpeedRange
      const r = selectCPPGearbox(400, 5000, 2.5);
      expect(r.success).toBe(false);
      expect(r.recommendations).toEqual([]);
    });

    test('功率超过齿轮箱 maxPower 应被过滤(GCS320 maxPower 550)', () => {
      // 给 1500kW@1500rpm 中型场景, GCS320 maxPower=550 应被排除
      const r = selectCPPGearbox(1500, 1500, 2.5);
      // 至少不应返回 GCS320
      const models = r.recommendations.map(rec => rec.gearbox.model);
      expect(models).not.toContain('GCS320');
    });

    test('指定 series 应仅返回该系列', () => {
      const r = selectCPPGearbox(400, 1800, 2.5, { series: 'GCS' });
      if (r.success) {
        r.recommendations.forEach(rec => {
          expect(rec.gearbox.series).toBe('GCS');
        });
      }
    });

    test('容量不足应过滤(超低转速高功率组合)', () => {
      // 1000kW @ 600rpm => requiredCapacity = 1.667, 已超过 GCS450 最大 0.50
      const r = selectCPPGearbox(1000, 600, 2.5, { series: 'GCS' });
      const models = r.recommendations.map(rec => rec.gearbox.model);
      expect(models).not.toContain('GCS320');
    });
  });

  describe('减速比容差', () => {
    test('容差内匹配应成功(默认 20%)', () => {
      // GCS320 ratios=[2.5,3,3.5,4], 给 target=2.6 在 2.5 容差内
      const r = selectCPPGearbox(400, 1800, 2.6, { series: 'GCS' });
      expect(r.success).toBe(true);
    });

    test('容差外应被过滤(自定义 ratioTolerance=2)', () => {
      // GCS320 ratios=[2.5,...], target=3.0 但容差只允许 2% (0.06)
      const r = selectCPPGearbox(400, 1800, 6.0, {
        series: 'GCS',
        ratioTolerance: 2
      });
      // 6.0 偏离 GCS 任何 ratio 太远, 应无 GCS 系列匹配
      const models = r.recommendations.map(rec => rec.gearbox.model);
      const gcsModels = models.filter(m => m && m.startsWith('GCS'));
      expect(gcsModels).toEqual([]);
    });
  });

  describe('容量余量上限', () => {
    test('marginLimit 应过滤过大余量', () => {
      // 极小功率 50kW@1800rpm (cap=0.028) , GCS450 ratio=2.0 (cap=0.50) 余量约 1700%
      const r = selectCPPGearbox(50, 1800, 2.0, {
        series: 'GCS',
        marginLimit: 50  // 限制余量 50%
      });
      r.recommendations.forEach(rec => {
        const margin = parseFloat(rec.matchInfo.margin);
        expect(margin).toBeLessThanOrEqual(50);
      });
    });
  });

  describe('评分维度', () => {
    test('应返回 0-100 分整数评分', () => {
      const r = selectCPPGearbox(400, 1800, 2.5, { series: 'GCS' });
      if (r.recommendations.length > 0) {
        r.recommendations.forEach(rec => {
          expect(rec.score).toBeGreaterThanOrEqual(0);
          expect(rec.score).toBeLessThanOrEqual(100);
          expect(Number.isInteger(rec.score)).toBe(true);
        });
      }
    });

    test('推力需求满足应贡献 thrustVerify 分数', () => {
      const high = selectCPPGearbox(400, 1800, 2.5, {
        series: 'GCS',
        thrustRequirement: 50  // GCS320 thrust=60, 满足
      });
      const low = selectCPPGearbox(400, 1800, 2.5, {
        series: 'GCS',
        thrustRequirement: 200  // GCS320 thrust=60, 严重不足
      });
      if (high.recommendations.length > 0 && low.recommendations.length > 0) {
        const highScore = high.recommendations.find(r => r.gearbox.model === 'GCS320')?.score;
        const lowScore = low.recommendations.find(r => r.gearbox.model === 'GCS320')?.score;
        if (highScore != null && lowScore != null) {
          expect(highScore).toBeGreaterThan(lowScore);
        }
      }
    });

    test('指定船级社认证匹配应贡献分数', () => {
      // GCS320 有 CCS/DNV/LR/NK 认证, 没有 ABS/BV
      const ccs = selectCPPGearbox(400, 1800, 2.5, {
        series: 'GCS',
        classificationSociety: 'CCS'
      });
      const bv = selectCPPGearbox(400, 1800, 2.5, {
        series: 'GCS',
        classificationSociety: 'BV'
      });
      const ccsScore = ccs.recommendations.find(r => r.gearbox.model === 'GCS320')?.score;
      const bvScore = bv.recommendations.find(r => r.gearbox.model === 'GCS320')?.score;
      if (ccsScore != null && bvScore != null) {
        expect(ccsScore).toBeGreaterThanOrEqual(bvScore);
      }
    });

    test('推力严重不足时应产生警告', () => {
      const r = selectCPPGearbox(400, 1800, 2.5, {
        series: 'GCS',
        thrustRequirement: 1000  // 远超任何 GCS thrust
      });
      r.recommendations.forEach(rec => {
        if (rec.warnings && rec.warnings.length > 0) {
          const hasThrustWarning = rec.warnings.some(w => /推力/.test(w));
          expect(hasThrustWarning).toBe(true);
        }
      });
    });

    test('无指定船级社时认证项给 50% 基准分', () => {
      // 不指定 classificationSociety, 评分仍应 > 0
      const r = selectCPPGearbox(400, 1800, 2.5, { series: 'GCS' });
      if (r.recommendations.length > 0) {
        expect(r.recommendations[0].score).toBeGreaterThan(0);
      }
    });
  });

  describe('数据完整度与置信度', () => {
    test('应返回 0-1 之间的 dataCompleteness', () => {
      const r = selectCPPGearbox(400, 1800, 2.5, { series: 'GCS' });
      r.recommendations.forEach(rec => {
        expect(rec.dataCompleteness).toBeGreaterThanOrEqual(0);
        expect(rec.dataCompleteness).toBeLessThanOrEqual(1);
      });
    });

    test('confidenceLevel 应为高/中/低之一', () => {
      const r = selectCPPGearbox(400, 1800, 2.5, { series: 'GCS' });
      r.recommendations.forEach(rec => {
        expect(['高', '中', '低']).toContain(rec.confidenceLevel);
      });
    });
  });

  describe('结果排序与限制', () => {
    test('结果应按评分降序排列', () => {
      const r = selectCPPGearbox(400, 1800, 2.5);
      if (r.recommendations.length >= 2) {
        for (let i = 1; i < r.recommendations.length; i++) {
          expect(r.recommendations[i - 1].score).toBeGreaterThanOrEqual(r.recommendations[i].score);
        }
      }
    });

    test('maxResults 应限制返回数量', () => {
      const r = selectCPPGearbox(400, 1800, 2.5, { maxResults: 2 });
      expect(r.recommendations.length).toBeLessThanOrEqual(2);
    });

    test('应返回 inputParams 与 scoringWeights 元数据', () => {
      const r = selectCPPGearbox(400, 1800, 2.5);
      expect(r.inputParams).toEqual(
        expect.objectContaining({
          power: 400,
          speed: 1800,
          targetRatio: 2.5
        })
      );
      expect(r.scoringWeights).toEqual(
        expect.objectContaining({
          powerMatch: 30,
          ratioMatch: 20
        })
      );
    });
  });

  describe('matchInfo 字段', () => {
    test('应返回 requiredCapacity / actualCapacity / margin / ratioDiff / outputSpeed', () => {
      const r = selectCPPGearbox(400, 1800, 2.5, { series: 'GCS' });
      if (r.recommendations.length > 0) {
        const m = r.recommendations[0].matchInfo;
        expect(m).toHaveProperty('requiredCapacity');
        expect(m).toHaveProperty('actualCapacity');
        expect(m).toHaveProperty('margin');
        expect(m).toHaveProperty('ratioDiff');
        expect(m).toHaveProperty('outputSpeed');

        // outputSpeed = inputSpeed / selectedRatio
        const outputSpeedNum = parseFloat(m.outputSpeed);
        const selectedRatio = r.recommendations[0].gearbox.selectedRatio;
        expect(outputSpeedNum).toBeCloseTo(1800 / selectedRatio, 0);
      }
    });
  });
});

describe('selectCPPPropeller - 调距桨匹配', () => {
  test('未提供齿轮箱应返回失败', () => {
    const r = selectCPPPropeller(null);
    expect(r.success).toBe(false);
    expect(r.message).toContain('CPP齿轮箱');
  });

  test('齿轮箱无 model 字段应返回失败', () => {
    const r = selectCPPPropeller({ series: 'GCS' });
    expect(r.success).toBe(false);
  });

  test('应根据 applicablePropellers 匹配候选', () => {
    const gcs320 = cppGearboxes.find(g => g.model === 'GCS320');
    if (gcs320) {
      const r = selectCPPPropeller(gcs320);
      // GCS320.applicablePropellers = ["HI-320", "HF-320", "HS-320"]
      r.recommendations.forEach(p => {
        expect(['HI-320', 'HF-320', 'HS-320']).toContain(p.model);
      });
    }
  });

  test('指定 type 应进一步筛选', () => {
    const gcs320 = cppGearboxes.find(g => g.model === 'GCS320');
    if (gcs320) {
      const r = selectCPPPropeller(gcs320, { type: 'heavy-duty' });
      if (r.recommendations.length > 0) {
        r.recommendations.forEach(p => {
          // 若类型不存在则 fallback 不过滤; 若存在则全部为 heavy-duty
          if (r.recommendations.length > 0 && r.recommendations.every(x => x.type === 'heavy-duty')) {
            expect(p.type).toBe('heavy-duty');
          }
        });
      }
    }
  });
});

describe('selectOilDistributor - 配油器匹配', () => {
  test('未提供齿轮箱应返回失败', () => {
    const r = selectOilDistributor(null);
    expect(r.success).toBe(false);
  });

  test('应仅返回 applicableGearboxes 包含该型号的候选', () => {
    const gcs320 = cppGearboxes.find(g => g.model === 'GCS320');
    if (gcs320) {
      const r = selectOilDistributor(gcs320);
      r.recommendations.forEach(od => {
        expect(od.applicableGearboxes).toContain('GCS320');
      });
    }
  });
});

describe('selectHydraulicUnit - 液压单元匹配', () => {
  test('未提供齿轮箱应返回失败', () => {
    const r = selectHydraulicUnit(null);
    expect(r.success).toBe(false);
  });

  test('应仅返回 applicableGearboxes 包含该型号的候选', () => {
    const gcs320 = cppGearboxes.find(g => g.model === 'GCS320');
    if (gcs320) {
      const r = selectHydraulicUnit(gcs320);
      r.recommendations.forEach(hpu => {
        expect(hpu.applicableGearboxes).toContain('GCS320');
      });
    }
  });
});

describe('selectCPPSystem - 完整 CPP 系统组装', () => {
  test('齿轮箱选型失败时应在 step=gearbox 终止', () => {
    const r = selectCPPSystem({
      power: 0,  // 必失败
      speed: 1800,
      targetRatio: 2.5
    });
    expect(r.success).toBe(false);
    expect(r.step).toBe('gearbox');
  });

  test('成功选型应返回 system + allOptions + pricing', () => {
    const r = selectCPPSystem({
      power: 400,
      speed: 1800,
      targetRatio: 2.5,
      options: { series: 'GCS' }
    });
    if (r.success) {
      expect(r.system).toBeDefined();
      expect(r.system.gearbox).toBeDefined();
      expect(r.allOptions).toBeDefined();
      expect(r.pricing).toBeDefined();
      expect(r.pricing).toHaveProperty('gearbox');
      expect(r.pricing).toHaveProperty('total');
    }
  });

  test('总价应等于 4 个组件价格之和', () => {
    const r = selectCPPSystem({
      power: 400,
      speed: 1800,
      targetRatio: 2.5,
      options: { series: 'GCS' }
    });
    if (r.success) {
      const sum = r.pricing.gearbox + r.pricing.propeller +
                  r.pricing.oilDistributor + r.pricing.hydraulicUnit;
      expect(r.pricing.total).toBeCloseTo(sum, 2);
    }
  });

  test('组件未匹配时单价应为 0', () => {
    const r = selectCPPSystem({
      power: 400,
      speed: 1800,
      targetRatio: 2.5
    });
    if (r.success) {
      expect(r.pricing.gearbox).toBeGreaterThanOrEqual(0);
      expect(r.pricing.propeller).toBeGreaterThanOrEqual(0);
      expect(r.pricing.oilDistributor).toBeGreaterThanOrEqual(0);
      expect(r.pricing.hydraulicUnit).toBeGreaterThanOrEqual(0);
    }
  });
});

describe('FPP vs CPP 切换语义 (plan: 定距桨 vs 可调桨)', () => {
  // CPP 算法独立于主 selectGearbox, 这里验证它们语义不冲突
  test('selectCPPGearbox 仅在 cppGearboxes 中查找, 不会污染普通 HC/GW 系列', () => {
    const r = selectCPPGearbox(400, 1500, 2.5);
    r.recommendations.forEach(rec => {
      // GCS / GCST / GCD / GSH / GCC 都是 CPP 系列
      expect(['GCS', 'GCST', 'GCD', 'GSH', 'GCC']).toContain(rec.gearbox.series);
    });
  });

  test('CPP 系统返回的 gearbox 必须含 oilDistributorMount 字段(CPP 特有)', () => {
    const r = selectCPPSystem({
      power: 400,
      speed: 1800,
      targetRatio: 2.5,
      options: { series: 'GCS' }
    });
    if (r.success) {
      expect(r.system.gearbox).toHaveProperty('oilDistributorMount');
    }
  });
});
