// src/data/packagePriceConfigExtended.js
// HC / HCT / HCD 系列的配套包默认配置 — 不修改原 packagePriceConfig.js 结构
//
// 数据策略：
//   - 此处不预先固化整套打包价 (HC/HCT/HCD 系列每年价格变动较大)
//   - 仅声明常见型号的"成员组合"（齿轮箱 + 高弹 + 备用泵）
//   - 实际打包价 = 三者各自当前价格之和 (运行时由 packageResolver 计算)
//
// 维护说明：未列入下列数组的型号将由 packageResolver 走 gearboxMatchingMaps
// 的 getRecommendedCouplingInfo + getRecommendedPump 动态推断。

const NULL_PRICE = null;

export const hcPackagePriceConfigs = [
  { gearboxModel: 'HC400',  recommendedCoupling: 'HGTHB4',   recommendedPump: '2CY-3.3/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HC600',  recommendedCoupling: 'HGTHB4',   recommendedPump: '2CY-3.3/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HC1000', recommendedCoupling: 'HGTHB5A',  recommendedPump: '2CY-5/2.5D',   packagePrice: NULL_PRICE },
  { gearboxModel: 'HC1200', recommendedCoupling: 'HGTHB5A',  recommendedPump: '2CY-5/2.5D',   packagePrice: NULL_PRICE },
  { gearboxModel: 'HC1400', recommendedCoupling: 'HGTHB5A',  recommendedPump: '2CY-7.5/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HC1600', recommendedCoupling: 'HGTHB5A',  recommendedPump: '2CY-7.5/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HC2000', recommendedCoupling: 'HGTHB6A',  recommendedPump: '2CY-7.5/2.5D', packagePrice: NULL_PRICE }
];

export const hctPackagePriceConfigs = [
  { gearboxModel: 'HCT400',  recommendedCoupling: 'HGTHB4',  recommendedPump: '2CY-3.3/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HCT600',  recommendedCoupling: 'HGTHB4',  recommendedPump: '2CY-5/2.5D',   packagePrice: NULL_PRICE },
  { gearboxModel: 'HCT800',  recommendedCoupling: 'HGTHB5A', recommendedPump: '2CY-5/2.5D',   packagePrice: NULL_PRICE },
  { gearboxModel: 'HCT1100', recommendedCoupling: 'HGTHB5A', recommendedPump: '2CY-5/2.5D',   packagePrice: NULL_PRICE },
  { gearboxModel: 'HCT1200', recommendedCoupling: 'HGTHB5A', recommendedPump: '2CY-5/2.5D',   packagePrice: NULL_PRICE },
  { gearboxModel: 'HCT1400', recommendedCoupling: 'HGTHB5A', recommendedPump: '2CY-7.5/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HCT1600', recommendedCoupling: 'HGTHB5A', recommendedPump: '2CY-7.5/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HCT2000', recommendedCoupling: 'HGTHB6A', recommendedPump: '2CY-7.5/2.5D', packagePrice: NULL_PRICE }
];

export const hcdPackagePriceConfigs = [
  { gearboxModel: 'HCD400',  recommendedCoupling: 'HGTHB4',  recommendedPump: '2CY-3.3/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HCD600',  recommendedCoupling: 'HGTHB4',  recommendedPump: '2CY-5/2.5D',   packagePrice: NULL_PRICE },
  { gearboxModel: 'HCD800',  recommendedCoupling: 'HGTHB5A', recommendedPump: '2CY-5/2.5D',   packagePrice: NULL_PRICE },
  { gearboxModel: 'HCD1000', recommendedCoupling: 'HGTHB5A', recommendedPump: '2CY-5/2.5D',   packagePrice: NULL_PRICE },
  { gearboxModel: 'HCD1400', recommendedCoupling: 'HGTHB5A', recommendedPump: '2CY-7.5/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HCD1600', recommendedCoupling: 'HGTHB5A', recommendedPump: '2CY-7.5/2.5D', packagePrice: NULL_PRICE },
  { gearboxModel: 'HCD2000', recommendedCoupling: 'HGTHB6A', recommendedPump: '2CY-7.5/2.5D', packagePrice: NULL_PRICE }
];

export default {
  hcPackagePriceConfigs,
  hctPackagePriceConfigs,
  hcdPackagePriceConfigs
};
