/**
 * 价格管理模块单元测试
 *
 * 测试内容:
 * - 标准折扣率获取
 * - 工厂价计算
 * - 市场价计算
 * - 固定价格系列判断
 */

import {
  getStandardDiscountRate,
  calculateFactoryPrice,
  calculateMarketPrice,
  isFixedPriceSeries,
  PRICE_CONSTANTS
} from '../priceManager';

// ============================================================
// 测试数据
// ============================================================

const TEST_PRODUCTS = {
  // HC系列标准型号
  hcStandard: {
    model: 'HC300',
    basePrice: 23000,
    discountRate: 0.16
  },
  // HC600系列
  hc600: {
    model: 'HC600A',
    basePrice: 57200,
    discountRate: 0.12
  },
  // HC1000+系列 (大型号，低折扣)
  hc1000: {
    model: 'HC1000',
    basePrice: 81200,
    discountRate: 0.06
  },
  // GW系列
  gwSeries: {
    model: 'GWC28.30',
    basePrice: 72500,
    discountRate: 0.10
  },
  // HCM系列 (全国统一售价)
  hcmFixed: {
    model: 'HCM400A',
    basePrice: 45000,
    notes: '全国统一售价'
  },
  // HCQ系列 (全国统一售价)
  hcqFixed: {
    model: 'HCQ502',
    basePrice: 38000
  },
  // 联轴器
  coupling: {
    model: 'HGTHB5',
    basePrice: 8500,
    discountRate: 0.10
  },
  // 备用泵
  pump: {
    model: '2CY-4.2',
    basePrice: 3200,
    discountRate: 0.10
  },
  // 特殊型号 (报告特批)
  specialModel: {
    model: 'HC400',
    basePrice: 32150,
    discountRate: 0.22
  }
};

// ============================================================
// 折扣率测试
// ============================================================

describe('getStandardDiscountRate - 标准折扣率获取', () => {

  test('HC系列标准型号应返回16%折扣', () => {
    const rate = getStandardDiscountRate('HC300', 'gearbox');
    expect(rate).toBe(0.16);
  });

  test('HC600系列应返回12%折扣', () => {
    const rate = getStandardDiscountRate('HC600A', 'gearbox');
    expect(rate).toBe(0.12);
  });

  test('HC800系列应返回8%折扣', () => {
    const rate = getStandardDiscountRate('HC800', 'gearbox');
    expect(rate).toBe(0.08);
  });

  test('HC1000及以上系列应返回6%折扣', () => {
    expect(getStandardDiscountRate('HC1000', 'gearbox')).toBe(0.06);
    expect(getStandardDiscountRate('HC1200', 'gearbox')).toBe(0.14); // 特殊型号
    expect(getStandardDiscountRate('HC1400', 'gearbox')).toBe(0.06);
  });

  test('GW系列应返回10%折扣', () => {
    const rate = getStandardDiscountRate('GWC28.30', 'gearbox');
    expect(rate).toBe(0.10);
  });

  test('HCQ系列应返回0%折扣(全国统一售价)', () => {
    const rate = getStandardDiscountRate('HCQ502', 'gearbox');
    expect(rate).toBe(0);
  });

  test('联轴器应返回10%折扣', () => {
    const rate = getStandardDiscountRate('HGTHB5', 'coupling');
    expect(rate).toBe(0.10);
  });

  test('备用泵应返回10%折扣', () => {
    const rate = getStandardDiscountRate('2CY-4.2', 'pump');
    expect(rate).toBe(0.10);
  });

  test('自动类型检测应正确识别联轴器', () => {
    const rate = getStandardDiscountRate('HGTHB5', 'auto');
    expect(rate).toBe(0.10);
  });

  test('自动类型检测应正确识别备用泵', () => {
    const rate = getStandardDiscountRate('2CY-4.2', 'auto');
    expect(rate).toBe(0.10);
  });

  test('特殊型号应返回报告特批折扣率', () => {
    expect(getStandardDiscountRate('HC400')).toBe(0.22);
    expect(getStandardDiscountRate('HC1200')).toBe(0.14);
  });

  test('空型号应返回默认折扣率10%', () => {
    const rate = getStandardDiscountRate(null);
    expect(rate).toBe(PRICE_CONSTANTS.DEFAULT_DISCOUNT_RATE);
  });
});

// ============================================================
// 固定价格系列测试
// ============================================================

describe('isFixedPriceSeries - 固定价格系列判断', () => {

  test('HCM系列应为固定价格系列', () => {
    expect(isFixedPriceSeries('HCM400A')).toBe(true);
    expect(isFixedPriceSeries('HCM200')).toBe(true);
  });

  test('HCQ系列应为固定价格系列', () => {
    expect(isFixedPriceSeries('HCQ502')).toBe(true);
    expect(isFixedPriceSeries('HCQ300')).toBe(true);
  });

  test('MV系列应为固定价格系列', () => {
    expect(isFixedPriceSeries('MV100')).toBe(true);
  });

  test('HC系列不应为固定价格系列', () => {
    expect(isFixedPriceSeries('HC300')).toBe(false);
    expect(isFixedPriceSeries('HC1000')).toBe(false);
  });

  test('GW系列不应为固定价格系列', () => {
    expect(isFixedPriceSeries('GWC28.30')).toBe(false);
  });

  test('空值应返回false', () => {
    expect(isFixedPriceSeries(null)).toBe(false);
    expect(isFixedPriceSeries('')).toBe(false);
  });
});

// ============================================================
// 工厂价计算测试
// ============================================================

describe('calculateFactoryPrice - 工厂价计算', () => {

  test('标准HC型号工厂价计算正确', () => {
    const item = TEST_PRODUCTS.hcStandard;
    const factoryPrice = calculateFactoryPrice(item);
    // 23000 * (1 - 0.16) = 19320
    expect(factoryPrice).toBe(19320);
  });

  test('HC600系列工厂价计算正确', () => {
    const item = TEST_PRODUCTS.hc600;
    const factoryPrice = calculateFactoryPrice(item);
    // 57200 * (1 - 0.12) = 50336
    expect(factoryPrice).toBe(50336);
  });

  test('HC1000系列工厂价计算正确', () => {
    const item = TEST_PRODUCTS.hc1000;
    const factoryPrice = calculateFactoryPrice(item);
    // 81200 * (1 - 0.06) = 76328
    expect(factoryPrice).toBe(76328);
  });

  test('GW系列工厂价计算正确', () => {
    const item = TEST_PRODUCTS.gwSeries;
    const factoryPrice = calculateFactoryPrice(item);
    // 72500 * (1 - 0.10) = 65250
    expect(factoryPrice).toBe(65250);
  });

  test('固定价格系列工厂价应等于基础价', () => {
    const item = TEST_PRODUCTS.hcmFixed;
    const factoryPrice = calculateFactoryPrice(item);
    // HCM系列为全国统一售价，工厂价 = 基础价
    expect(factoryPrice).toBe(45000);
  });

  test('缺少折扣率时应使用标准折扣率', () => {
    const item = { model: 'HC300', basePrice: 23000 };
    const factoryPrice = calculateFactoryPrice(item);
    // 应使用HC系列标准折扣率16%
    expect(factoryPrice).toBe(19320);
  });

  test('空对象应返回0', () => {
    expect(calculateFactoryPrice(null)).toBe(0);
    expect(calculateFactoryPrice({})).toBe(0);
  });
});

// ============================================================
// 市场价计算测试
// ============================================================

describe('calculateMarketPrice - 市场价计算', () => {

  test('标准型号市场价应为工厂价的1.1倍', () => {
    const item = { ...TEST_PRODUCTS.hcStandard, factoryPrice: 19320 };
    const marketPrice = calculateMarketPrice(item);
    // 19320 * 1.1 = 21252
    expect(marketPrice).toBe(21252);
  });

  test('固定价格系列市场价应等于基础价', () => {
    const item = TEST_PRODUCTS.hcmFixed;
    const marketPrice = calculateMarketPrice(item);
    // HCM系列为全国统一售价
    expect(marketPrice).toBe(45000);
  });

  test('已有市场价时应优先使用', () => {
    const item = { model: 'HC300', basePrice: 23000, factoryPrice: 19320, marketPrice: 25000 };
    const marketPrice = calculateMarketPrice(item);
    expect(marketPrice).toBe(25000);
  });

  test('空对象应返回0', () => {
    expect(calculateMarketPrice(null)).toBe(0);
    expect(calculateMarketPrice({})).toBe(0);
  });
});

// ============================================================
// 价格计算一致性测试
// ============================================================

describe('价格计算一致性', () => {

  test('工厂价应始终小于等于基础价', () => {
    Object.values(TEST_PRODUCTS).forEach(item => {
      if (item.basePrice) {
        const factoryPrice = calculateFactoryPrice(item);
        expect(factoryPrice).toBeLessThanOrEqual(item.basePrice);
      }
    });
  });

  test('市场价应始终大于等于工厂价', () => {
    const testItems = [
      TEST_PRODUCTS.hcStandard,
      TEST_PRODUCTS.hc600,
      TEST_PRODUCTS.gwSeries
    ];

    testItems.forEach(item => {
      const factoryPrice = calculateFactoryPrice(item);
      const marketPrice = calculateMarketPrice({ ...item, factoryPrice });
      expect(marketPrice).toBeGreaterThanOrEqual(factoryPrice);
    });
  });

  test('价格链路完整性: 基础价 -> 工厂价 -> 市场价', () => {
    const item = TEST_PRODUCTS.hcStandard;
    const factoryPrice = calculateFactoryPrice(item);
    const marketPrice = calculateMarketPrice({ ...item, factoryPrice });

    // 验证价格链路
    expect(item.basePrice).toBe(23000);
    expect(factoryPrice).toBe(19320);
    expect(marketPrice).toBe(21252);

    // 验证比例关系
    expect(factoryPrice / item.basePrice).toBeCloseTo(0.84, 2); // 1 - 0.16
    expect(marketPrice / factoryPrice).toBeCloseTo(1.1, 2);
  });
});

// ============================================================
// 边界条件测试
// ============================================================

describe('边界条件测试', () => {

  test('折扣率为0时工厂价应等于基础价', () => {
    const item = { model: 'HCQ502', basePrice: 38000, discountRate: 0 };
    const factoryPrice = calculateFactoryPrice(item);
    expect(factoryPrice).toBe(38000);
  });

  test('折扣率为100%时工厂价应为0', () => {
    const item = { model: 'TEST', basePrice: 10000, discountRate: 1 };
    const factoryPrice = calculateFactoryPrice(item);
    expect(factoryPrice).toBe(0);
  });

  test('负折扣率应使用标准折扣率', () => {
    const item = { model: 'HC300', basePrice: 23000, discountRate: -0.1 };
    const factoryPrice = calculateFactoryPrice(item);
    // 应忽略负折扣率，使用标准折扣率16%
    expect(factoryPrice).toBe(19320);
  });

  test('超过100%的折扣率应使用标准折扣率', () => {
    const item = { model: 'HC300', basePrice: 23000, discountRate: 1.5 };
    const factoryPrice = calculateFactoryPrice(item);
    // 应忽略超过100%的折扣率
    expect(factoryPrice).toBe(19320);
  });
});
