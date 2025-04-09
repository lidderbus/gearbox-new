const calculatePrices = (price: number, discount: number) => {
  // 基础价格（成本价，来自API数据）
  const basePrice = price;
  
  // 计算折扣率（总下浮率）
  const discountRate = discount;
  
  // 销售价格固定为最高价格（我们设定为basePrice）
  const salePrice = basePrice;
  
  // 计算代理商价格（基于销售价格，使用总下浮率减去1%）
  const agentDiscountRate = discountRate - 1;
  const agentPrice = Math.round(salePrice * (1 - agentDiscountRate / 100));

  // 验证计算结果（调试用）
  console.log("基础价格:", basePrice);
  console.log("销售价格:", salePrice);
  console.log("总下浮率:", discountRate);
  console.log("代理商下浮率:", agentDiscountRate);
  console.log("计算的代理商价格:", agentPrice);

  return {
    basePrice,
    discountRate,
    agentPrice,
    salePrice
  };
}; 