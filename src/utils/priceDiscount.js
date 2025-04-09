// utils/priceDiscount.js

// 计算工厂价格
export const calculateFactoryPrice = (item) => {
  if (!item) return 0;
  
  const basePrice = item.basePrice || item.price || 0;
  const discountRate = typeof item.discountRate === 'number' ? item.discountRate : 0;
  
  return Math.round(basePrice * (1 - discountRate / 100));
};

// 计算打包价格
export const calculatePackagePrice = (gearbox, coupling, pump) => {
  let total = 0;
  
  if (gearbox) {
    total += gearbox.price || 0;
  }
  
  if (coupling) {
    total += coupling.price || 0;
  }
  
  if (pump) {
    total += pump.price || 0;
  }
  
  return total;
};

// 计算市场价格（封装为函数，基于打包价格）
export const calculateMarketPrice = (item, packagePrice) => {
  if (!item) return 0;
  
  // 默认是打包价格乘以 1.1
  const baseForCalculation = packagePrice || item.price || item.basePrice || 0;
  return Math.round(baseForCalculation * 1.1);
};

// 获取折扣率
export const getDiscountRate = (model) => {
  // 根据型号返回默认折扣率
  if (!model) return 0;
  
  // HC系列折扣率
  if (model.startsWith('HC')) return 10;
  
  // GW系列折扣率
  if (model.startsWith('GW')) return 8;
  
  // 其他系列折扣率
  return 5;
};