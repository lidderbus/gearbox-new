// src/utils/__tests__/foreignGearboxAnalysis.test.js
// B2 国外齿轮箱分析工具测试
import {
  findEquivalentForeign,
  priceMidpointUSD,
  calcCostPerformanceScore,
  getHangchiMatchesForForeign,
  getForeignDatabaseStats
} from '../foreignGearboxAnalysis';
import { foreignGearboxesById } from '../../data/foreignGearboxMapping';

describe('foreignGearboxAnalysis', () => {
  describe('findEquivalentForeign', () => {
    it('1850kW + 3.5:1 + 1800rpm 工况命中 ZF W2050', () => {
      const r = findEquivalentForeign({ power_kW: 1850, ratio: 3.5, inputSpeed_rpm: 1800 });
      expect(r.length).toBeGreaterThan(0);
      const w2050 = r.find(g => g.id === 'zf-w2050');
      expect(w2050).toBeDefined();
      expect(w2050.matchScore).toBeGreaterThan(80);
    });

    it('返回 ZF + Reintjes + Twin Disc 多家候选', () => {
      const r = findEquivalentForeign({ power_kW: 1500, ratio: 3.0, inputSpeed_rpm: 1800 });
      const brands = new Set(r.map(g => g.brand));
      expect(brands.size).toBeGreaterThanOrEqual(2);
    });

    it('空 input 返回空数组', () => {
      expect(findEquivalentForeign({})).toEqual([]);
      expect(findEquivalentForeign(null)).toEqual([]);
    });

    it('按 brand 过滤', () => {
      const r = findEquivalentForeign(
        { power_kW: 1500, ratio: 3.0, inputSpeed_rpm: 1800 },
        { brand: 'ZF Marine' }
      );
      expect(r.every(g => g.brand === 'ZF Marine')).toBe(true);
    });

    it('matchScore 按降序排列', () => {
      const r = findEquivalentForeign({ power_kW: 1500, ratio: 3.0, inputSpeed_rpm: 1800 });
      for (let i = 1; i < r.length; i++) {
        expect(r[i - 1].matchScore).toBeGreaterThanOrEqual(r[i].matchScore);
      }
    });

    it('maxResults 限流', () => {
      const r = findEquivalentForeign(
        { power_kW: 1000, ratio: 3.0, inputSpeed_rpm: 1800 },
        { maxResults: 2 }
      );
      expect(r.length).toBeLessThanOrEqual(2);
    });
  });

  describe('priceMidpointUSD', () => {
    it('USD 价格直接取中位', () => {
      const fg = foreignGearboxesById['zf-w2050'];
      // USD 90000-105000 中位 = 97500
      expect(priceMidpointUSD(fg)).toBe(97500);
    });

    it('EUR 价格按汇率换算', () => {
      const fg = foreignGearboxesById['reintjes-laf5750'];
      // EUR 280000-320000 中位 = 320000, * 1.08 ≈ 345600
      expect(priceMidpointUSD(fg, 1.08)).toBeGreaterThan(300000);
    });

    it('缺价格返回 null', () => {
      expect(priceMidpointUSD({})).toBeNull();
      expect(priceMidpointUSD(null)).toBeNull();
    });
  });

  describe('calcCostPerformanceScore', () => {
    it('海外价高 + 杭齿匹配高 → 杭齿性价比高', () => {
      const score = calcCostPerformanceScore({
        hangchiPrice: 600000,
        foreignPriceUSD: 100000,
        hangchiMatchScore: 95,
        foreignMatchScore: 85
      });
      // priceRatio = 100000*7.2/600000 = 1.2; perfRatio = 95/85 ≈ 1.118 → 1.34
      expect(score).toBeGreaterThan(1);
    });

    it('杭齿价过高 → score < 1', () => {
      const score = calcCostPerformanceScore({
        hangchiPrice: 1500000,
        foreignPriceUSD: 100000,
        hangchiMatchScore: 90,
        foreignMatchScore: 90
      });
      expect(score).toBeLessThan(1);
    });

    it('缺数据返回 null', () => {
      expect(calcCostPerformanceScore({ hangchiPrice: 0, foreignPriceUSD: 100000 })).toBeNull();
      expect(calcCostPerformanceScore({ hangchiPrice: 100, foreignPriceUSD: null })).toBeNull();
    });
  });

  describe('getHangchiMatchesForForeign', () => {
    it('已知海外 id 返回杭齿候选', () => {
      const m = getHangchiMatchesForForeign('zf-w2050');
      expect(m.length).toBeGreaterThan(0);
      expect(m[0].model).toMatch(/HC|MV|GW|HCM/);
    });

    it('未知 id 返回空数组', () => {
      expect(getHangchiMatchesForForeign('nope')).toEqual([]);
    });
  });

  describe('getForeignDatabaseStats', () => {
    it('返回 total + byBrand', () => {
      const s = getForeignDatabaseStats();
      expect(s.total).toBeGreaterThan(0);
      expect(s.byBrand['ZF Marine']).toBeGreaterThan(0);
      expect(s.byBrand['Reintjes']).toBeGreaterThan(0);
    });
  });
});
