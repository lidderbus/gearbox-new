// src/utils/__tests__/gwStructuralForm.test.js
import {
  STRUCTURAL_BUCKETS,
  GW_SUB_SERIES_META,
  GW_SUB_SERIES_LIST,
  getGwSubSeries,
  matchesStructuralFilter,
  getBucketStates,
} from '../gwStructuralForm';

describe('gwStructuralForm', () => {
  describe('数据完整性', () => {
    test('STRUCTURAL_BUCKETS 覆盖全部 6 个 GW 子系列', () => {
      const allMembers = Object.values(STRUCTURAL_BUCKETS).flat().sort();
      expect(allMembers).toEqual([...GW_SUB_SERIES_LIST].sort());
    });

    test('GW_SUB_SERIES_META 每个条目都有 bucket/levels/hasReverse/desc', () => {
      GW_SUB_SERIES_LIST.forEach((sub) => {
        const meta = GW_SUB_SERIES_META[sub];
        expect(meta).toBeDefined();
        expect(meta.bucket).toBeTruthy();
        expect(meta.levels).toBeTruthy();
        expect(typeof meta.hasReverse).toBe('boolean');
        expect(meta.desc).toBeTruthy();
      });
    });
  });

  describe('getGwSubSeries', () => {
    test('GWC60.66 → "GWC"', () => {
      expect(getGwSubSeries('GWC60.66')).toBe('GWC');
    });
    test('GWS60.66 → "GWS"', () => {
      expect(getGwSubSeries('GWS60.66')).toBe('GWS');
    });
    test('GWD78.88 → "GWD"', () => {
      expect(getGwSubSeries('GWD78.88')).toBe('GWD');
    });
    test('非 GW 系列 (HC600) → null', () => {
      expect(getGwSubSeries('HC600')).toBeNull();
    });
    test('null/undefined/空串 → null', () => {
      expect(getGwSubSeries(null)).toBeNull();
      expect(getGwSubSeries(undefined)).toBeNull();
      expect(getGwSubSeries('')).toBeNull();
    });
  });

  describe('matchesStructuralFilter', () => {
    test('GWC 在 ["GWC","GWS"] 集合内 → true', () => {
      expect(matchesStructuralFilter('GWC60.66', ['GWC', 'GWS'])).toBe(true);
    });
    test('GWD 不在 ["GWC"] 集合内 → false', () => {
      expect(matchesStructuralFilter('GWD78.88', ['GWC'])).toBe(false);
    });
    test('非 GW 系列 (HC600) 不受 GW 过滤器影响 → true', () => {
      expect(matchesStructuralFilter('HC600', ['GWC'])).toBe(true);
    });
    test('空数组 = 不限制 → true', () => {
      expect(matchesStructuralFilter('GWC60.66', [])).toBe(true);
      expect(matchesStructuralFilter('GWD78.88', [])).toBe(true);
    });
    test('null/undefined = 不限制 → true', () => {
      expect(matchesStructuralFilter('GWC60.66', null)).toBe(true);
      expect(matchesStructuralFilter('GWC60.66', undefined)).toBe(true);
    });
  });

  describe('getBucketStates', () => {
    test('空选 → 全部 none', () => {
      const s = getBucketStates([]);
      expect(s['同中心']).toBe('none');
      expect(s['垂直异中心']).toBe('none');
      expect(s['水平异中心']).toBe('none');
      expect(s['角向异中心']).toBe('none');
    });
    test('GWC+GWL 全选 → 同中心 all', () => {
      const s = getBucketStates(['GWC', 'GWL']);
      expect(s['同中心']).toBe('all');
      expect(s['垂直异中心']).toBe('none');
    });
    test('只选 GWS → 垂直异中心 some', () => {
      const s = getBucketStates(['GWS']);
      expect(s['垂直异中心']).toBe('some');
    });
    test('GWH 单一成员桶选中 → 水平异中心 all', () => {
      const s = getBucketStates(['GWH']);
      expect(s['水平异中心']).toBe('all');
    });
  });
});
