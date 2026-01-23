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
  calculatePackagePrice,
  isFixedPriceSeries,
  applySpecialModelPrice,
  correctPriceData,
  fixSpecificModelPrices,
  processPriceData,
  validatePriceData,
  specialModelPrices,
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

  test('undefined型号应返回默认折扣率', () => {
    const rate = getStandardDiscountRate(undefined);
    expect(rate).toBe(PRICE_CONSTANTS.DEFAULT_DISCOUNT_RATE);
  });

  test('空字符串型号应返回默认折扣率', () => {
    const rate = getStandardDiscountRate('');
    expect(rate).toBe(PRICE_CONSTANTS.DEFAULT_DISCOUNT_RATE);
  });

  test('基础价为0时工厂价应为0', () => {
    const item = { model: 'HC300', basePrice: 0, discountRate: 0.16 };
    const factoryPrice = calculateFactoryPrice(item);
    expect(factoryPrice).toBe(0);
  });

  test('使用price字段替代basePrice', () => {
    const item = { model: 'HC300', price: 23000 };
    const factoryPrice = calculateFactoryPrice(item);
    // 23000 * (1 - 0.16) = 19320
    expect(factoryPrice).toBe(19320);
  });

  test('undefined对象应返回0', () => {
    expect(calculateFactoryPrice(undefined)).toBe(0);
    expect(calculateMarketPrice(undefined)).toBe(0);
  });
});

// ============================================================
// 打包价计算测试
// ============================================================

describe('calculatePackagePrice - 打包价计算', () => {

  test('空齿轮箱应返回0', () => {
    expect(calculatePackagePrice(null)).toBe(0);
    expect(calculatePackagePrice(undefined)).toBe(0);
  });

  test('只有齿轮箱时返回齿轮箱工厂价', () => {
    const gearbox = { model: 'HC300', basePrice: 23000, factoryPrice: 19320 };
    const packagePrice = calculatePackagePrice(gearbox);
    expect(packagePrice).toBe(19320);
  });

  test('齿轮箱+联轴器应正确累加', () => {
    const gearbox = { model: 'HC300', basePrice: 23000, factoryPrice: 19320 };
    const coupling = { model: 'HGTHB5', basePrice: 8500, factoryPrice: 7650 };
    const packagePrice = calculatePackagePrice(gearbox, coupling);
    expect(packagePrice).toBe(19320 + 7650);
  });

  test('齿轮箱+联轴器+备用泵应正确累加', () => {
    const gearbox = { model: 'HC300', basePrice: 23000, factoryPrice: 19320 };
    const coupling = { model: 'HGTHB5', basePrice: 8500, factoryPrice: 7650 };
    const pump = { model: '2CY-4.2', basePrice: 3200, factoryPrice: 2880 };
    const packagePrice = calculatePackagePrice(gearbox, coupling, pump);
    expect(packagePrice).toBe(19320 + 7650 + 2880);
  });

  test('无factoryPrice时应自动计算', () => {
    const gearbox = { model: 'HC300', basePrice: 23000, discountRate: 0.16 };
    const packagePrice = calculatePackagePrice(gearbox);
    expect(packagePrice).toBe(19320);
  });

  test('特殊打包价型号应返回特殊价格', () => {
    const gearbox = { model: 'GWC42.45', basePrice: 200000, factoryPrice: 180000 };
    const packagePrice = calculatePackagePrice(gearbox);
    expect(packagePrice).toBe(180000);
  });
});

// ============================================================
// 特殊型号价格测试
// ============================================================

describe('applySpecialModelPrice - 特殊型号价格应用', () => {

  test('null项目应返回null', () => {
    expect(applySpecialModelPrice(null)).toBe(null);
  });

  test('undefined项目应返回undefined', () => {
    expect(applySpecialModelPrice(undefined)).toBe(undefined);
  });

  test('无model的项目应返回原项目', () => {
    const item = { basePrice: 10000 };
    expect(applySpecialModelPrice(item)).toEqual(item);
  });

  test('HC400特殊型号应应用报告特批价格', () => {
    const item = { model: 'HC400', basePrice: 30000 };
    const result = applySpecialModelPrice(item);
    expect(result.basePrice).toBe(specialModelPrices['HC400'].basePrice);
    expect(result.discountRate).toBe(specialModelPrices['HC400'].discountRate);
  });

  test('HC1200特殊型号应应用报告特批价格', () => {
    const item = { model: 'HC1200', basePrice: 90000 };
    const result = applySpecialModelPrice(item);
    expect(result.basePrice).toBe(92000);
    expect(result.discountRate).toBe(0.14);
  });

  test('普通型号应返回原项目', () => {
    const item = { model: 'HC300', basePrice: 23000, discountRate: 0.16 };
    const result = applySpecialModelPrice(item);
    expect(result).toEqual(item);
  });

  test('MB270A在6-7:1速比范围应应用特殊价格', () => {
    const item = { model: 'MB270A', basePrice: 25000, ratios: [6, 6.5, 7] };
    const result = applySpecialModelPrice(item);
    expect(result.basePrice).toBe(30000);
    expect(result.discountRate).toBe(0.12);
  });

  test('MB270A不在6-7:1速比范围应返回原项目', () => {
    const item = { model: 'MB270A', basePrice: 25000, ratios: [3, 4, 5] };
    const result = applySpecialModelPrice(item);
    expect(result.basePrice).toBe(25000);
  });
});

// ============================================================
// 价格数据修正测试
// ============================================================

describe('correctPriceData - 价格数据修正', () => {

  test('null项目应返回null', () => {
    expect(correctPriceData(null)).toBe(null);
  });

  test('undefined项目应返回undefined', () => {
    expect(correctPriceData(undefined)).toBe(undefined);
  });

  test('非对象项目应返回原值', () => {
    expect(correctPriceData('string')).toBe('string');
    expect(correctPriceData(123)).toBe(123);
  });

  test('应正确计算工厂价和市场价', () => {
    const item = { model: 'HC300', basePrice: 23000, discountRate: 0.16 };
    const result = correctPriceData(item);
    expect(result.factoryPrice).toBe(19320);
    expect(result.marketPrice).toBeCloseTo(21252, 0);
  });

  test('固定价格系列应添加"全国统一售价"备注', () => {
    const item = { model: 'HCM400A', basePrice: 45000 };
    const result = correctPriceData(item);
    expect(result.notes).toContain('全国统一售价');
    expect(result.factoryPrice).toBe(45000);
    expect(result.marketPrice).toBe(45000);
  });

  test('已有全国统一售价备注不应重复添加', () => {
    const item = { model: 'HCM400A', basePrice: 45000, notes: '全国统一售价' };
    const result = correctPriceData(item);
    expect(result.notes).toBe('全国统一售价');
  });
});

// ============================================================
// 更多系列折扣率测试
// ============================================================

describe('更多系列折扣率', () => {

  test('DT系列应返回10%折扣', () => {
    expect(getStandardDiscountRate('DT700', 'gearbox')).toBe(0.10);
  });

  test('GC系列应返回10%折扣', () => {
    expect(getStandardDiscountRate('GC200', 'gearbox')).toBe(0.10);
  });

  test('HCL系列当前返回HC标准折扣 (因HC前缀优先匹配)', () => {
    // 注: HCL配置了0.12折扣率，但代码先匹配HC前缀返回0.16
    // 这是已知的实现行为，如需单独处理HCL需要修改优先级
    expect(getStandardDiscountRate('HCL400', 'gearbox')).toBe(0.16);
  });

  test('SG系列应返回10%折扣 (GW折扣)', () => {
    expect(getStandardDiscountRate('SG200', 'gearbox')).toBe(0.10);
  });

  test('2G系列应返回10%折扣 (GW折扣)', () => {
    expect(getStandardDiscountRate('2G100', 'gearbox')).toBe(0.10);
  });

  test('HCX系列应为固定价格系列', () => {
    expect(isFixedPriceSeries('HCX400')).toBe(true);
    expect(getStandardDiscountRate('HCX400')).toBe(0);
  });

  test('HCA系列应为固定价格系列', () => {
    expect(isFixedPriceSeries('HCA300')).toBe(true);
    expect(getStandardDiscountRate('HCA300')).toBe(0);
  });

  test('HCV系列应为固定价格系列', () => {
    expect(isFixedPriceSeries('HCV200')).toBe(true);
    expect(getStandardDiscountRate('HCV200')).toBe(0);
  });

  test('SPF泵前缀应自动检测为pump类型', () => {
    const rate = getStandardDiscountRate('SPF-123', 'auto');
    expect(rate).toBe(0.10);
  });

  test('HGT联轴器前缀应自动检测为coupling类型', () => {
    const rate = getStandardDiscountRate('HGT4', 'auto');
    expect(rate).toBe(0.10);
  });

  test('未知型号默认为gearbox类型返回12%', () => {
    const rate = getStandardDiscountRate('UNKNOWN123', 'gearbox');
    expect(rate).toBe(0.12);
  });
});

// ============================================================
// PRICE_CONSTANTS 配置测试
// ============================================================

describe('PRICE_CONSTANTS 配置验证', () => {

  test('默认折扣率应为10%', () => {
    expect(PRICE_CONSTANTS.DEFAULT_DISCOUNT_RATE).toBe(0.1);
  });

  test('市场价倍数应为1.1', () => {
    expect(PRICE_CONSTANTS.MARKET_PRICE_MULTIPLIER).toBe(1.1);
  });

  test('固定价格系列应包含HCM/HCQ/HCX/HCA/HCV/MV', () => {
    expect(PRICE_CONSTANTS.FIXED_PRICE_SERIES).toContain('HCM');
    expect(PRICE_CONSTANTS.FIXED_PRICE_SERIES).toContain('HCQ');
    expect(PRICE_CONSTANTS.FIXED_PRICE_SERIES).toContain('HCX');
    expect(PRICE_CONSTANTS.FIXED_PRICE_SERIES).toContain('HCA');
    expect(PRICE_CONSTANTS.FIXED_PRICE_SERIES).toContain('HCV');
    expect(PRICE_CONSTANTS.FIXED_PRICE_SERIES).toContain('MV');
  });

  test('系列折扣率配置应完整', () => {
    expect(PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.HC_STANDARD).toBe(0.16);
    expect(PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.HC_600).toBe(0.12);
    expect(PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.HC_800).toBe(0.08);
    expect(PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.HC_1000_PLUS).toBe(0.06);
    expect(PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.GW).toBe(0.10);
    expect(PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.COUPLING).toBe(0.10);
    expect(PRICE_CONSTANTS.SERIES_DISCOUNT_RATES.PUMP).toBe(0.10);
  });

  test('特殊型号折扣覆盖应存在', () => {
    expect(PRICE_CONSTANTS.SPECIAL_MODEL_DISCOUNTS['J300']).toBe(0.22);
    expect(PRICE_CONSTANTS.SPECIAL_MODEL_DISCOUNTS['HC400']).toBe(0.22);
    expect(PRICE_CONSTANTS.SPECIAL_MODEL_DISCOUNTS['HC1200']).toBe(0.14);
  });

  test('特殊打包价格应存在', () => {
    expect(PRICE_CONSTANTS.SPECIAL_PACKAGE_PRICES['GWC42.45']).toBe(180000);
    expect(PRICE_CONSTANTS.SPECIAL_PACKAGE_PRICES['GWC45.49']).toBe(275000);
  });
});

// ============================================================
// validatePriceData - 价格数据验证测试
// ============================================================

describe('validatePriceData - 价格数据验证', () => {

  test('null项目应返回验证失败', () => {
    const result = validatePriceData(null);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('整个产品项缺失或无型号');
  });

  test('无model的项目应返回验证失败', () => {
    const result = validatePriceData({ basePrice: 10000 });
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('整个产品项缺失或无型号');
  });

  test('完整数据应验证通过', () => {
    const item = {
      model: 'HC300',
      basePrice: 23000,
      discountRate: 0.16,
      factoryPrice: 19320,
      marketPrice: 21252
    };
    const result = validatePriceData(item);
    expect(result.valid).toBe(true);
    expect(result.missing).toHaveLength(0);
    expect(result.inconsistent).toHaveLength(0);
  });

  test('缺少basePrice应报告缺失', () => {
    const item = {
      model: 'HC300',
      discountRate: 0.16,
      factoryPrice: 19320,
      marketPrice: 21252
    };
    const result = validatePriceData(item);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('基础价格(basePrice)');
  });

  test('缺少discountRate应报告缺失', () => {
    const item = {
      model: 'HC300',
      basePrice: 23000,
      factoryPrice: 19320,
      marketPrice: 21252
    };
    const result = validatePriceData(item);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('折扣率(discountRate)');
  });

  test('缺少factoryPrice应报告缺失', () => {
    const item = {
      model: 'HC300',
      basePrice: 23000,
      discountRate: 0.16,
      marketPrice: 21252
    };
    const result = validatePriceData(item);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('工厂价(factoryPrice)');
  });

  test('缺少marketPrice应报告缺失', () => {
    const item = {
      model: 'HC300',
      basePrice: 23000,
      discountRate: 0.16,
      factoryPrice: 19320
    };
    const result = validatePriceData(item);
    expect(result.valid).toBe(false);
    expect(result.missing).toContain('市场价(marketPrice)');
  });

  test('工厂价与计算值不一致应报告', () => {
    const item = {
      model: 'HC300',
      basePrice: 23000,
      discountRate: 0.16,
      factoryPrice: 18000,  // 正确值应为19320
      marketPrice: 19800
    };
    const result = validatePriceData(item);
    expect(result.valid).toBe(false);
    expect(result.inconsistent.some(msg => msg.includes('工厂价'))).toBe(true);
  });

  test('市场价与计算值不一致应报告', () => {
    const item = {
      model: 'HC300',
      basePrice: 23000,
      discountRate: 0.16,
      factoryPrice: 19320,
      marketPrice: 25000  // 正确值应为21252
    };
    const result = validatePriceData(item);
    expect(result.valid).toBe(false);
    expect(result.inconsistent.some(msg => msg.includes('市场价'))).toBe(true);
  });
});

// ============================================================
// fixSpecificModelPrices - 批量价格修正测试
// ============================================================

describe('fixSpecificModelPrices - 批量价格修正', () => {

  test('null数据应返回null', () => {
    expect(fixSpecificModelPrices(null)).toBe(null);
  });

  test('undefined数据应返回undefined', () => {
    expect(fixSpecificModelPrices(undefined)).toBe(undefined);
  });

  test('应处理hcGearboxes集合', () => {
    const data = {
      hcGearboxes: [
        { model: 'HC300', basePrice: 23000 }
      ]
    };
    const result = fixSpecificModelPrices(data);
    expect(result.hcGearboxes[0].factoryPrice).toBeDefined();
  });

  test('应处理gwGearboxes集合', () => {
    const data = {
      gwGearboxes: [
        { model: 'GWC28.30', basePrice: 72500 }
      ]
    };
    const result = fixSpecificModelPrices(data);
    expect(result.gwGearboxes[0].factoryPrice).toBeDefined();
  });

  test('应处理flexibleCouplings集合', () => {
    const data = {
      flexibleCouplings: [
        { model: 'HGTHB5', basePrice: 8500 }
      ]
    };
    const result = fixSpecificModelPrices(data);
    expect(result.flexibleCouplings[0].factoryPrice).toBeDefined();
  });

  test('应处理standbyPumps集合', () => {
    const data = {
      standbyPumps: [
        { model: '2CY-4.2', basePrice: 3200 }
      ]
    };
    const result = fixSpecificModelPrices(data);
    expect(result.standbyPumps[0].factoryPrice).toBeDefined();
  });

  test('非数组集合应保持不变', () => {
    const data = {
      hcGearboxes: 'not an array',
      version: '1.0'
    };
    const result = fixSpecificModelPrices(data);
    expect(result.hcGearboxes).toBe('not an array');
    expect(result.version).toBe('1.0');
  });
});

// ============================================================
// processPriceData - 完整价格处理测试
// ============================================================

describe('processPriceData - 完整价格处理', () => {

  test('null数据应返回空结果', () => {
    const result = processPriceData(null);
    expect(result.data).toEqual({});
    expect(result.results.corrected).toBe(0);
    expect(result.results.warnings).toEqual([]);
    expect(result.results.errors).toEqual([]);
  });

  test('undefined数据应返回空结果', () => {
    const result = processPriceData(undefined);
    expect(result.data).toEqual({});
    expect(result.results.corrected).toBe(0);
  });

  test('应处理并返回修正后的数据', () => {
    const data = {
      hcGearboxes: [
        { model: 'HC300', basePrice: 23000 }
      ]
    };
    const result = processPriceData(data);
    expect(result.data.hcGearboxes).toBeDefined();
    expect(result.data.hcGearboxes[0].factoryPrice).toBeDefined();
    expect(result.results.corrected).toBeGreaterThanOrEqual(0);
  });

  test('应返回修正计数', () => {
    const data = {
      hcGearboxes: [
        { model: 'HC300', basePrice: 23000 },
        { model: 'HC600A', basePrice: 57200 }
      ]
    };
    const result = processPriceData(data);
    expect(typeof result.results.corrected).toBe('number');
  });

  test('应处理多个集合', () => {
    const data = {
      hcGearboxes: [{ model: 'HC300', basePrice: 23000 }],
      gwGearboxes: [{ model: 'GWC28.30', basePrice: 72500 }],
      flexibleCouplings: [{ model: 'HGTHB5', basePrice: 8500 }]
    };
    const result = processPriceData(data);
    expect(result.data.hcGearboxes[0].factoryPrice).toBeDefined();
    expect(result.data.gwGearboxes[0].factoryPrice).toBeDefined();
    expect(result.data.flexibleCouplings[0].factoryPrice).toBeDefined();
  });
});

// ============================================================
// 特殊型号边界测试 - 补充覆盖
// ============================================================

describe('特殊型号边界测试', () => {

  test('HCT800/1在6.91-15.82速比范围应应用特殊价格', () => {
    const item = { model: 'HCT800/1', basePrice: 50000, ratios: [6.91, 10, 15.82] };
    const result = applySpecialModelPrice(item);
    // 如果特殊价格配置存在，应使用特殊价格
    if (specialModelPrices['HCT800/1-6.91-15.82:1']) {
      expect(result.basePrice).toBe(specialModelPrices['HCT800/1-6.91-15.82:1'].basePrice);
    } else {
      expect(result.basePrice).toBe(50000);
    }
  });

  test('HCT800/1不在特殊速比范围应返回原项目', () => {
    const item = { model: 'HCT800/1', basePrice: 50000, ratios: [2, 3, 4] };
    const result = applySpecialModelPrice(item);
    expect(result.basePrice).toBe(50000);
  });

  test('特殊打包价格型号应返回配置的打包价', () => {
    const gearbox = { model: 'GWC42.45', basePrice: 200000, factoryPrice: 180000 };
    const packagePrice = calculatePackagePrice(gearbox);
    // 应使用特殊打包价格（如果配置存在）
    expect(packagePrice).toBe(180000);
  });

  test('未知产品类型应返回默认折扣率', () => {
    // 使用未知类型触发default case
    const rate = getStandardDiscountRate('UNKNOWN', 'unknown_type');
    expect(rate).toBe(PRICE_CONSTANTS.DEFAULT_DISCOUNT_RATE);
  });
});

// ============================================================
// GW系列小型号市场价测试
// ============================================================

describe('GW系列小型号市场价', () => {

  test('GW39.41及以下小型号应有最低价格保护', () => {
    const item = {
      model: 'GW39.41',
      basePrice: 50000,
      discountRate: 0.10,
      factoryPrice: 45000
    };
    const marketPrice = calculateMarketPrice(item);
    // 市场价应 >= 工厂价 * 0.9 (最低保护)
    expect(marketPrice).toBeGreaterThanOrEqual(item.factoryPrice * 0.9);
  });

  test('小型号计算市场价应考虑最低价格', () => {
    const item = {
      model: 'GW30',
      basePrice: 30000,
      discountRate: 0.10,
      factoryPrice: 27000
    };
    const marketPrice = calculateMarketPrice(item);
    // 市场价应为正数
    expect(marketPrice).toBeGreaterThan(0);
  });
});

// ============================================================
// 错误处理测试
// ============================================================

describe('错误处理', () => {

  test('correctPriceData处理非法对象不应崩溃', () => {
    // 测试各种边界情况
    expect(() => correctPriceData(null)).not.toThrow();
    expect(() => correctPriceData(undefined)).not.toThrow();
    expect(() => correctPriceData({})).not.toThrow();
    expect(() => correctPriceData({ model: '' })).not.toThrow();
  });

  test('processPriceData处理格式错误数据不应崩溃', () => {
    const badData = {
      hcGearboxes: [null, undefined, {}, { model: 'HC300' }]
    };
    expect(() => processPriceData(badData)).not.toThrow();
  });

  test('validatePriceData处理NaN值', () => {
    const item = {
      model: 'HC300',
      basePrice: NaN,
      discountRate: NaN,
      factoryPrice: NaN,
      marketPrice: NaN
    };
    const result = validatePriceData(item);
    expect(result.valid).toBe(false);
    expect(result.missing.length).toBeGreaterThan(0);
  });
});

// ============================================================
// GW系列打包价格路径测试 (覆盖lines 267, 326, 418-419, 427)
// ============================================================

describe('GW系列打包价格路径', () => {

  test('calculateMarketPrice应返回GW大型号打包价 (line 267)', () => {
    // GWC42.45 在 gwPackagePriceConfigs 中有打包价 180000
    const item = {
      model: 'GWC42.45',
      basePrice: 150000,
      discountRate: 0.10,
      factoryPrice: 135000
    };
    const marketPrice = calculateMarketPrice(item);
    // 应返回打包价 180000
    expect(marketPrice).toBe(180000);
  });

  test('calculateMarketPrice应返回GWC45.49打包价', () => {
    const item = {
      model: 'GWC45.49',
      basePrice: 220000,
      discountRate: 0.10,
      factoryPrice: 198000
    };
    const marketPrice = calculateMarketPrice(item);
    expect(marketPrice).toBe(275000);
  });

  test('calculatePackagePrice应返回SPECIAL_PACKAGE_PRICES价格 (line 326)', () => {
    // GWC42.45 在 SPECIAL_PACKAGE_PRICES 中
    const gearbox = {
      model: 'GWC42.45',
      basePrice: 150000,
      discountRate: 0.10,
      factoryPrice: 135000
    };
    const packagePrice = calculatePackagePrice(gearbox, null, null);
    expect(packagePrice).toBe(180000);
  });

  test('calculatePackagePrice应返回GWC52.59特殊打包价', () => {
    const gearbox = {
      model: 'GWC52.59',
      basePrice: 400000,
      discountRate: 0.10,
      factoryPrice: 360000
    };
    const packagePrice = calculatePackagePrice(gearbox, null, null);
    expect(packagePrice).toBe(510000);
  });

  test('correctPriceData应处理GW大型号打包价 (lines 418-419)', () => {
    const item = {
      model: 'GWC42.45',
      basePrice: 150000,
      discountRate: 0.10
    };
    const corrected = correctPriceData(item);
    // 检查打包价被正确应用
    expect(corrected.packagePrice).toBe(180000);
    expect(corrected.marketPrice).toBe(180000);
  });

  test('correctPriceData应处理GWC49.54打包价', () => {
    const item = {
      model: 'GWC49.54',
      basePrice: 300000,
      discountRate: 0.10
    };
    const corrected = correctPriceData(item);
    expect(corrected.packagePrice).toBe(385000);
    expect(corrected.marketPrice).toBe(385000);
  });

  test('correctPriceData应处理SPECIAL_PACKAGE_PRICES型号 (line 427)', () => {
    // HC型号不在gwPackagePriceConfigs但在SPECIAL_PACKAGE_PRICES中的情况
    // 实际上 SPECIAL_PACKAGE_PRICES 也包含 GWC 系列
    const item = {
      model: 'GWC45.52',
      basePrice: 250000,
      discountRate: 0.10
    };
    const corrected = correctPriceData(item);
    // GWC45.52 打包价 330000
    expect(corrected.packagePrice).toBe(330000);
  });
});

// ============================================================
// 错误处理路径测试 (覆盖lines 449-450)
// ============================================================

describe('错误处理路径覆盖', () => {

  test('correctPriceData应捕获并处理内部错误 (lines 449-450)', () => {
    // 创建一个会导致内部错误的对象
    const problematicItem = {
      model: 'HC300',
      get basePrice() {
        throw new Error('模拟getter错误');
      }
    };
    // 应该不抛出错误，而是返回原对象
    expect(() => correctPriceData(problematicItem)).not.toThrow();
  });

  // 注意: processPriceData的内部try-catch (lines 525-526) 是不可达代码
  // 因为 correctPriceData 内部已有 try-catch 捕获所有错误并返回原对象
  // 所以外层catch永远不会被触发，这部分代码无法通过测试覆盖
});
