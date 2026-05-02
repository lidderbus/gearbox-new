// src/api/__tests__/gearboxRepo.test.js
import {
  listAll,
  listBySeries,
  findById,
  searchByKeyword,
  _resetCacheForTest
} from '../gearboxRepo';

// Mock 数据避免真实加载 902KB 文件
jest.mock('../../data/embeddedData', () => ({
  embeddedGearboxData: {
    hcGearboxes: [
      { model: 'HC400', ratios: [2.0, 2.5], dimensions: '500x300x200' },
      { model: 'HC600', ratios: [3.0, 3.5], dimensions: '600x400x250' }
    ],
    gwGearboxes: [
      { model: 'GW1000', ratios: [4.0], dimensions: '800x600x400' }
    ]
  }
}));

jest.mock('../../utils/priceFormatter', () => ({
  lookupPriceByModel: jest.fn(),
  getPriceBadge: jest.fn(),
  isPriceMissing: jest.fn()
}));

describe('gearboxRepo', () => {
  beforeEach(() => _resetCacheForTest());

  describe('listAll', () => {
    test('返回所有系列拍平后的型号', () => {
      const all = listAll();
      expect(all.length).toBe(3);
      expect(all.map(g => g.model).sort()).toEqual(['GW1000', 'HC400', 'HC600']);
    });

    test('每条记录含 _seriesKey', () => {
      const all = listAll();
      const hc400 = all.find(g => g.model === 'HC400');
      expect(hc400._seriesKey).toBe('hcGearboxes');
      const gw = all.find(g => g.model === 'GW1000');
      expect(gw._seriesKey).toBe('gwGearboxes');
    });

    test('多次调用走缓存 (返回引用相等)', () => {
      const a = listAll();
      const b = listAll();
      expect(a).toBe(b); // 同引用
    });
  });

  describe('listBySeries', () => {
    test('返回指定系列', () => {
      expect(listBySeries('hcGearboxes').length).toBe(2);
      expect(listBySeries('gwGearboxes').length).toBe(1);
    });

    test('未知系列返回空数组', () => {
      expect(listBySeries('unknownGearboxes')).toEqual([]);
    });

    test('空 key 返回空数组', () => {
      expect(listBySeries('')).toEqual([]);
      expect(listBySeries(null)).toEqual([]);
      expect(listBySeries(undefined)).toEqual([]);
    });
  });

  describe('findById', () => {
    test('精确匹配', () => {
      const r = findById('HC400');
      expect(r).toBeTruthy();
      expect(r.model).toBe('HC400');
    });

    test('归一化匹配 (空格/大小写)', () => {
      expect(findById('hc400')?.model).toBe('HC400');
      expect(findById('  HC400  ')?.model).toBe('HC400');
      expect(findById('hc 400')?.model).toBe('HC400');
    });

    test('未找到返回 null', () => {
      expect(findById('NOT_EXIST')).toBeNull();
      expect(findById('')).toBeNull();
      expect(findById(null)).toBeNull();
    });
  });

  describe('searchByKeyword', () => {
    test('按型号子串搜索', () => {
      const r = searchByKeyword('HC');
      expect(r.length).toBe(2);
      expect(r.every(g => g.model.startsWith('HC'))).toBe(true);
    });

    test('按 dimensions 子串', () => {
      const r = searchByKeyword('800x600');
      expect(r.length).toBe(1);
      expect(r[0].model).toBe('GW1000');
    });

    test('空关键字返回空数组', () => {
      expect(searchByKeyword('')).toEqual([]);
      expect(searchByKeyword('   ')).toEqual([]);
      expect(searchByKeyword(null)).toEqual([]);
    });
  });

  describe('_resetCacheForTest', () => {
    test('重置后 listAll 重新计算', () => {
      const a = listAll();
      _resetCacheForTest();
      const b = listAll();
      expect(a).not.toBe(b); // 缓存已清, 新引用
      expect(a).toEqual(b);  // 但内容相同
    });
  });
});
