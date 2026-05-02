// src/utils/__tests__/vesselTypeUtils.test.js
// B3 标准船型库 utils 测试
import {
  getVesselTypeById,
  listByCategory,
  toSelectionFormDefaults,
  findVesselTypesByOperatingPoint,
  getVesselDatabaseStats,
  vesselCategories
} from '../vesselTypeUtils';
import { standardVesselTypes } from '../../data/standardVesselTypes';

describe('vesselTypeUtils', () => {
  describe('getVesselTypeById', () => {
    it('找到 capesize 散货船', () => {
      const v = getVesselTypeById('bulker_capesize');
      expect(v).not.toBeNull();
      expect(v.category).toBe('bulker');
      expect(v.segment).toBe('capesize');
    });

    it('未知 type 返回 null', () => {
      expect(getVesselTypeById('nope')).toBeNull();
      expect(getVesselTypeById(null)).toBeNull();
    });
  });

  describe('listByCategory', () => {
    it('bulker 类别返回 4 个尺度', () => {
      const r = listByCategory('bulker');
      expect(r.length).toBe(4);
      expect(r.map(v => v.segment)).toEqual(expect.arrayContaining(['handysize', 'handymax', 'panamax', 'capesize']));
    });

    it('未知 category 返回空数组', () => {
      expect(listByCategory('xxx')).toEqual([]);
      expect(listByCategory(null)).toEqual([]);
    });
  });

  describe('toSelectionFormDefaults', () => {
    it('Capesize 散货船返回 motorPower 中位 (16000-21000 → 18500)', () => {
      const f = toSelectionFormDefaults('bulker_capesize');
      expect(f).not.toBeNull();
      expect(f.motorPower).toBe(18500);
      expect(f.targetRatio).toBe(4.7);
      expect(f.vesselType).toBe('cargo');
      expect(f.suggestedEngines.length).toBeGreaterThan(0);
    });

    it('未知 type 返回 null', () => {
      expect(toSelectionFormDefaults('nope')).toBeNull();
    });

    it('motorSpeed = propellerRPM × ratio', () => {
      const f = toSelectionFormDefaults('bulker_capesize');
      // 95 × 4.7 ≈ 446.5 → round 447
      expect(f.motorSpeed).toBeCloseTo(447, 0);
    });
  });

  describe('findVesselTypesByOperatingPoint', () => {
    it('18000 kW + 4.7 ratio 命中 Capesize', () => {
      const r = findVesselTypesByOperatingPoint({ power_kW: 18000, ratio: 4.7 });
      expect(r.some(v => v.type === 'bulker_capesize')).toBe(true);
    });

    it('3000 kW + 6.5 ratio 命中 tug', () => {
      const r = findVesselTypesByOperatingPoint({ power_kW: 3000, ratio: 6.5 });
      expect(r.some(v => v.category === 'tug')).toBe(true);
    });

    it('无 power 返回空', () => {
      expect(findVesselTypesByOperatingPoint({})).toEqual([]);
    });
  });

  describe('getVesselDatabaseStats', () => {
    it('返回总数 + byCategory + categories', () => {
      const s = getVesselDatabaseStats();
      expect(s.total).toBe(standardVesselTypes.length);
      expect(s.total).toBeGreaterThanOrEqual(15);
      expect(s.byCategory.bulker).toBe(4);
      expect(s.byCategory.tanker).toBeGreaterThanOrEqual(2);
      expect(s.categories).toBe(vesselCategories.length);
    });
  });

  describe('legacyKey 兼容', () => {
    it('每个船型都有 legacyKey 字段', () => {
      standardVesselTypes.forEach(v => {
        expect(v.legacyKey).toBeDefined();
        expect(typeof v.legacyKey).toBe('string');
      });
    });
  });
});
