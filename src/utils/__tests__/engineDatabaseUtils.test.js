// src/utils/__tests__/engineDatabaseUtils.test.js
// B1 多品牌柴油机库 — utils API 单测
import {
  getEngineById,
  searchEngines,
  interpolateAtRpm,
  toFormFields,
  getDatabaseStats,
  availableBrands
} from '../engineDatabaseUtils';
import { marineEngines, calcRatedTorque_Nm } from '../../data/marineEngineDatabase';

describe('engineDatabaseUtils', () => {
  describe('getEngineById', () => {
    it('找到已知 id', () => {
      const e = getEngineById('man-l27-38-9l');
      expect(e).not.toBeNull();
      expect(e.brand).toBe('MAN');
      expect(e.cylinders).toBe(9);
    });

    it('未知 id 返回 null', () => {
      expect(getEngineById('nonexistent')).toBeNull();
      expect(getEngineById('')).toBeNull();
      expect(getEngineById(null)).toBeNull();
    });
  });

  describe('searchEngines', () => {
    it('空 query 返回全部 (上限 maxResults)', () => {
      const r = searchEngines('');
      expect(r.length).toBeGreaterThan(0);
      expect(r.length).toBeLessThanOrEqual(50);
    });

    it('按品牌过滤', () => {
      const r = searchEngines('', { brand: 'MAN' });
      expect(r.length).toBeGreaterThan(0);
      expect(r.every(e => e.brand === 'MAN')).toBe(true);
    });

    it('按 query 命中型号 (大小写不敏感)', () => {
      const r = searchEngines('w20');
      expect(r.length).toBeGreaterThan(0);
      expect(r.some(e => e.model.toLowerCase().includes('20'))).toBe(true);
    });

    it('按品牌+应用类型联合过滤', () => {
      const r = searchEngines('', { brand: 'Caterpillar', applicationType: 'tug' });
      expect(r.length).toBeGreaterThan(0);
      expect(r.every(e => e.brand === 'Caterpillar' && e.applicationTypes.includes('tug'))).toBe(true);
    });

    it('confidence A 排在 B/C 前', () => {
      const r = searchEngines('', { maxResults: 50 });
      const aIdx = r.findIndex(e => e.confidence === 'A');
      const bIdx = r.findIndex(e => e.confidence === 'B');
      if (aIdx >= 0 && bIdx >= 0) {
        expect(aIdx).toBeLessThan(bIdx);
      }
    });

    it('maxResults 限流', () => {
      const r = searchEngines('', { maxResults: 3 });
      expect(r.length).toBeLessThanOrEqual(3);
    });
  });

  describe('interpolateAtRpm', () => {
    const engine = getEngineById('man-l21-31-6l');

    it('rpm 在曲线点之间线性插值', () => {
      const { power_kW, sfc_g_kWh } = interpolateAtRpm(engine, 850);
      // 850rpm 是 85% load 工况点
      expect(power_kW).toBeCloseTo(1122, 0);
      expect(sfc_g_kWh).toBeCloseTo(175, 0);
    });

    it('rpm 低于最低点取最低', () => {
      const { power_kW } = interpolateAtRpm(engine, 100);
      expect(power_kW).toBe(792);
    });

    it('rpm 高于最高点取最高', () => {
      const { power_kW } = interpolateAtRpm(engine, 99999);
      expect(power_kW).toBe(1452);
    });

    it('engine 缺 torqueCurve 返回 null', () => {
      const e = { id: 'fake', torqueCurve: null };
      const r = interpolateAtRpm(e, 1000);
      expect(r.power_kW).toBeNull();
    });
  });

  describe('toFormFields', () => {
    it('正确填充表单字段', () => {
      const e = getEngineById('man-l27-38-9l');
      const f = toFormFields(e);
      expect(f.engineBrand).toBe('MAN');
      expect(f.engineModel).toBe('9L27/38');
      expect(f.motorPower).toBe(3060);
      expect(f.motorSpeed).toBe(800);
      expect(f.engineId).toBe('man-l27-38-9l');
      expect(f.engineCylinders).toBe(9);
      // 9550 * 3060 / 800 ≈ 36529 Nm
      expect(f.engineTorque).toBeCloseTo(36529, -2);
    });

    it('engine 为 null 返回空对象', () => {
      expect(toFormFields(null)).toEqual({});
      expect(toFormFields(undefined)).toEqual({});
    });
  });

  describe('calcRatedTorque_Nm', () => {
    it('T = 9550 * P / n', () => {
      expect(calcRatedTorque_Nm(1000, 1500)).toBe(Math.round(9550 * 1000 / 1500));
      expect(calcRatedTorque_Nm(3060, 800)).toBe(Math.round(9550 * 3060 / 800));
    });

    it('零或负数返回 null', () => {
      expect(calcRatedTorque_Nm(0, 1500)).toBeNull();
      expect(calcRatedTorque_Nm(1000, 0)).toBeNull();
      expect(calcRatedTorque_Nm(null, null)).toBeNull();
    });
  });

  describe('getDatabaseStats', () => {
    it('返回总数 / brand / tier / confidence 分布', () => {
      const stats = getDatabaseStats();
      expect(stats.total).toBe(marineEngines.length);
      expect(stats.byBrand).toEqual(expect.objectContaining({ MAN: expect.any(Number) }));
      expect(stats.byConfidence.A + stats.byConfidence.B + stats.byConfidence.C).toBe(stats.total);
    });
  });

  describe('availableBrands', () => {
    it('包含已知品牌', () => {
      expect(availableBrands).toEqual(expect.arrayContaining(['MAN', 'Wartsila', 'Caterpillar', 'MTU', 'Yanmar']));
    });

    it('已排序且无重复', () => {
      const set = new Set(availableBrands);
      expect(set.size).toBe(availableBrands.length);
      const sorted = [...availableBrands].sort();
      expect(availableBrands).toEqual(sorted);
    });
  });
});
