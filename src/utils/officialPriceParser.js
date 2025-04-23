// src/utils/officialPriceParser.js
/**
 * 官方价格文档解析工具
 * 用于从PDF或文本格式的官方价格文档中提取结构化数据
 */

/**
 * 解析纯文本格式的价格表格
 * @param {string} text - 包含价格数据的文本
 * @returns {Array} 解析后的价格对象数组
 */
export const parseTextPriceTable = (text) => {
  if (!text || typeof text !== 'string') {
    return [];
  }
  
  const result = [];
  // 按行分割文本
  const lines = text.split('\n').filter(line => line.trim().length > 0);
  
  // 尝试识别表格结构
  let currentSection = '';
  let headerLine = null;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // 跳过空行
    if (line.length === 0) continue;
    
    // 检查是否是章节标题
    if (line.includes('系列') || line.includes('价格表') || line.includes('出厂价格')) {
      currentSection = line;
      continue;
    }
    
    // 尝试找到表头行
    if (line.includes('型号') && line.includes('价格')) {
      headerLine = line;
      continue;
    }
    
    // 如果有表头且当前行不是表头，尝试解析为数据行
    if (headerLine && line !== headerLine) {
      // 简单的分割策略，针对空格或制表符分隔的文本
      const parts = line.split(/\s+/);
      
      // 确保至少有两个部分：型号和价格
      if (parts.length >= 2) {
        const model = parts[0].trim();
        
        // 尝试找到价格值（通常是数字）
        let basePrice = null;
        let marketPrice = null;
        
        for (let j = 1; j < parts.length; j++) {
          const potential = parseFloat(parts[j].replace(/[^\d.]/g, ''));
          if (!isNaN(potential) && potential > 0) {
            if (basePrice === null) {
              basePrice = potential;
            } else if (marketPrice === null) {
              marketPrice = potential;
            }
          }
        }
        
        // 如果至少找到了型号和一个价格，添加到结果
        if (model && (basePrice !== null || marketPrice !== null)) {
          result.push({
            model,
            basePrice: basePrice || 0,
            marketPrice: marketPrice || 0,
            section: currentSection
          });
        }
      }
    }
  }
  
  return result;
};

/**
 * 从官方价格数据中计算折扣率
 * @param {Array} priceData - 官方价格数据数组
 * @returns {Array} 包含折扣率信息的价格数据
 */
export const calculateDiscountRates = (priceData) => {
  if (!Array.isArray(priceData)) return [];
  
  return priceData.map(item => {
    const newItem = { ...item };
    
    // 如果有基础价格和市场价格，计算隐含的折扣率
    if (newItem.basePrice > 0 && newItem.marketPrice > 0) {
      // 假设市场价 = 出厂价 * 1.12，则出厂价 = 市场价 / 1.12
      const impliedFactoryPrice = newItem.marketPrice / 1.12;
      // 折扣率 = 1 - (出厂价 / 基础价格)
      newItem.discountRate = Math.max(0, Math.min(0.5, 1 - (impliedFactoryPrice / newItem.basePrice)));
      // 计算出厂价
      newItem.factoryPrice = Math.round(newItem.basePrice * (1 - newItem.discountRate));
    }
    
    return newItem;
  });
};