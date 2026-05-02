// src/hooks/__tests__/usePriceHandlers.test.js
import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';

// Mock external deps before import
jest.mock('../../config/logging', () => ({
  logger: { log: jest.fn(), warn: jest.fn(), error: jest.fn() }
}));

jest.mock('../../utils/enhancedPumpSelection', () => ({
  needsStandbyPump: jest.fn(() => false)
}));

jest.mock('../../data/packagePriceConfig', () => ({
  getGWPackagePriceConfig: jest.fn(() => null),
  checkPackageMatch: jest.fn(() => false)
}));

jest.mock('../../utils/priceManager', () => ({
  correctPriceData: jest.fn(item => item),
  calculateFactoryPrice: jest.fn(({ basePrice, discountRate }) =>
    basePrice * (1 - (discountRate || 0))
  ),
  calculateMarketPrice: jest.fn((_g, packagePrice) => packagePrice * 1.1),
  calculatePackagePrice: jest.fn((g, c, p) =>
    (g?.factoryPrice || 0) + (c?.factoryPrice || 0) + (p?.factoryPrice || 0)
  ),
  getStandardDiscountRate: jest.fn(() => 0.1)
}));

import usePriceHandlers from '../usePriceHandlers';
import { needsStandbyPump } from '../../utils/enhancedPumpSelection';
import { getGWPackagePriceConfig, checkPackageMatch } from '../../data/packagePriceConfig';

// Helper: mock setters
function makeSetters() {
  return {
    setSelectedComponents: jest.fn(),
    setPriceData: jest.fn(),
    setPackagePrice: jest.fn(),
    setMarketPrice: jest.fn(),
    setTotalMarketPrice: jest.fn(),
    setQuotation: jest.fn(),
    setAgreement: jest.fn(),
    setContract: jest.fn(),
    setLoading: jest.fn(),
    setError: jest.fn(),
    setSuccess: jest.fn(),
    setShowBatchPriceAdjustment: jest.fn(),
    updateAppDataAndPersist: jest.fn()
  };
}

function makeProps(overrides = {}) {
  return {
    appDataState: {},
    priceData: { includePump: true },
    ...makeSetters(),
    ...overrides
  };
}

describe('usePriceHandlers', () => {
  beforeEach(() => jest.clearAllMocks());

  describe('calculateAllPrices', () => {
    test('返回完整价格对象 + 默认 includePump=true', () => {
      const { result } = renderHook(() => usePriceHandlers(makeProps()));
      const gearbox = { model: 'HC400', factoryPrice: 1000, marketPrice: 1500 };
      const coupling = { model: 'HGT0', factoryPrice: 200, marketPrice: 300 };
      const pump = { model: 'P1', factoryPrice: 50, marketPrice: 80 };

      const out = result.current.calculateAllPrices(gearbox, coupling, pump);

      expect(out).toMatchObject({
        gearbox: expect.objectContaining({ model: 'HC400' }),
        coupling: expect.objectContaining({ model: 'HGT0' }),
        pump: expect.objectContaining({ model: 'P1' })
      });
      // 验证返回对象有所有必要键
      expect(out).toHaveProperty('packagePrice');
      expect(out).toHaveProperty('marketPrice');
      expect(out).toHaveProperty('totalMarketPrice');
      expect(out).toHaveProperty('hasSpecialPackagePrice');
    });

    test('options.includePump=false 时强制不计入泵', () => {
      needsStandbyPump.mockReturnValueOnce(true);
      const { result } = renderHook(() => usePriceHandlers(makeProps()));
      const out = result.current.calculateAllPrices(
        { model: 'HC400' },
        { model: 'HGT0' },
        { model: 'P1' },
        { includePump: false }
      );
      expect(out.includePump).toBe(false);
    });

    test('GW 特殊打包价识别 — 命中时返回 hasSpecialPackagePrice=true', () => {
      getGWPackagePriceConfig.mockReturnValueOnce({
        packagePrice: 12345,
        isSmallGWModel: false
      });
      checkPackageMatch.mockReturnValueOnce(true);
      const { result } = renderHook(() => usePriceHandlers(makeProps()));
      const out = result.current.calculateAllPrices(
        { model: 'GW1000' },
        { model: 'HGT' },
        null
      );
      expect(out.hasSpecialPackagePrice).toBe(true);
      expect(out.packagePrice).toBe(12345);
      expect(out.marketPrice).toBe(12345);
    });

    test('null gearbox 不应抛错', () => {
      const { result } = renderHook(() => usePriceHandlers(makeProps()));
      expect(() =>
        result.current.calculateAllPrices(null, null, null)
      ).not.toThrow();
    });
  });

  describe('handlePriceChange', () => {
    test('字段为空字符串时清除该字段', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => usePriceHandlers(makeProps(setters)));
      act(() => {
        result.current.handlePriceChange('gearbox', 'basePrice', '');
      });
      expect(setters.setSelectedComponents).toHaveBeenCalled();
      const updater = setters.setSelectedComponents.mock.calls[0][0];
      const next = updater({ gearbox: { basePrice: 1000 } });
      expect(next.gearbox.basePrice).toBeUndefined();
    });

    test('discountRate 超出 [0,100] 不应触发更新', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => usePriceHandlers(makeProps(setters)));
      act(() => {
        result.current.handlePriceChange('gearbox', 'discountRate', '150');
      });
      // setSelectedComponents 不应被调用 (return 在 validation 之前)
      expect(setters.setSelectedComponents).not.toHaveBeenCalled();
    });

    test('非数字输入 (basePrice="abc") 不应触发更新', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => usePriceHandlers(makeProps(setters)));
      act(() => {
        result.current.handlePriceChange('gearbox', 'basePrice', 'abc');
      });
      expect(setters.setSelectedComponents).not.toHaveBeenCalled();
    });

    test('合法 basePrice 变更后清空 quotation/agreement/contract', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => usePriceHandlers(makeProps(setters)));
      act(() => {
        result.current.handlePriceChange('gearbox', 'basePrice', '5000');
      });
      expect(setters.setQuotation).toHaveBeenCalledWith(null);
      expect(setters.setAgreement).toHaveBeenCalledWith(null);
      expect(setters.setContract).toHaveBeenCalledWith(null);
    });
  });

  describe('handleBatchPriceAdjustment', () => {
    test('appData 为空时设置 error 并返回', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => usePriceHandlers(makeProps({
        ...setters,
        appDataState: {}
      })));
      act(() => {
        result.current.handleBatchPriceAdjustment({
          category: 'all', field: 'basePrice', type: 'percentage', value: 10
        });
      });
      expect(setters.setError).toHaveBeenCalledWith(
        expect.stringContaining('应用数据未加载')
      );
    });

    test('参数缺失 (无 field) 设置 error', () => {
      const setters = makeSetters();
      const { result } = renderHook(() => usePriceHandlers(makeProps({
        ...setters,
        appDataState: { hcGearboxes: [{ model: 'HC400', basePrice: 1000 }] }
      })));
      act(() => {
        result.current.handleBatchPriceAdjustment({
          category: 'all', type: 'percentage', value: 10
          // field 缺失
        });
      });
      expect(setters.setError).toHaveBeenCalledWith(
        expect.stringContaining('参数无效')
      );
    });
  });
});
