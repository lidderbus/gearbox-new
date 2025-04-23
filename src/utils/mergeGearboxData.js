// src/utils/mergeGearboxData.js
/**
 * 齿轮箱数据合并工具
 * 此工具用于将OCR解析的数据与更新的embeddednew.js数据合并到现有系统
 */

/**
 * 从字符串中提取JavaScript对象
 * @param {string} content 包含JavaScript代码的字符串
 * @param {string} objectName 要提取的对象名称 (如 'embeddedGearboxData')
 * @returns {Object|null} 提取的对象或null
 */
function extractObjectFromString(content, objectName) {
  try {
    // 寻找对象定义的起始位置
    const startPattern = new RegExp(`(export\\s+)?const\\s+${objectName}\\s*=\\s*\\{`);
    const match = content.match(startPattern);
    
    if (!match) {
      console.error(`找不到对象定义: ${objectName}`);
      return null;
    }
    
    const startPos = match.index;
    let braceCount = 1;
    let endPos = startPos + match[0].length;
    
    // 查找匹配的大括号以确定对象结束位置
    while (braceCount > 0 && endPos < content.length) {
      const char = content[endPos];
      if (char === '{') braceCount++;
      else if (char === '}') braceCount--;
      endPos++;
    }
    
    if (braceCount !== 0) {
      console.error('无法找到对象的结束位置');
      return null;
    }
    
    // 提取完整的对象定义
    const objectCode = content.substring(startPos, endPos);
    
    // 准备执行代码 - 将export替换为let，以便在函数中使用
    const execCode = objectCode.replace(/export\s+const/, 'const');
    
    // 使用Function构造器执行代码并返回对象
    const extractFn = new Function(`
      ${execCode}
      return ${objectName};
    `);
    
    return extractFn();
  } catch (error) {
    console.error('从字符串中提取对象时出错:', error);
    return null;
  }
}

/**
 * 将两个齿轮箱数据对象合并
 * @param {Object} targetData 目标数据对象 (现有系统数据)
 * @param {Object} sourceData 源数据对象 (新的更新数据)
 * @returns {Object} 合并后的数据
 */
function mergeGearboxData(targetData, sourceData) {
  if (!targetData) return sourceData;
  if (!sourceData) return targetData;
  
  // 创建目标数据的深拷贝
  const result = JSON.parse(JSON.stringify(targetData));
  
  // 更新元数据
  if (sourceData._version) result._version = sourceData._version;
  if (sourceData._lastFixed) result._lastFixed = sourceData._lastFixed;
  
  // 处理每个齿轮箱类别 (hcGearboxes, gwGearboxes, etc.)
  Object.keys(sourceData).forEach(category => {
    // 跳过非数组属性
    if (!Array.isArray(sourceData[category])) {
      if (!['_version', '_lastFixed'].includes(category)) {
        result[category] = sourceData[category];
      }
      return;
    }
    
    // 确保目标中有相应类别数组
    if (!Array.isArray(result[category])) {
      result[category] = [];
    }
    
    // 为目标类别创建型号映射，便于快速查找
    const modelMap = new Map(
      result[category].map(item => [item.model, item])
    );
    
    // 处理源数据中的每一项
    sourceData[category].forEach(sourceItem => {
      if (!sourceItem.model) return; // 跳过无效项
      
      const existingItem = modelMap.get(sourceItem.model);
      
      if (existingItem) {
        // 更新现有项
        Object.keys(sourceItem).forEach(key => {
          // 对于价格相关字段，优先使用源数据
          if (['basePrice', 'price', 'discountRate', 'factoryPrice', 
               'packagePrice', 'marketPrice', 'notes'].includes(key)) {
            existingItem[key] = sourceItem[key];
          }
          // 对于其他关键技术参数，当现有数据字段为空或0时更新
          else if (existingItem[key] === null || existingItem[key] === undefined || 
                  existingItem[key] === 0 || existingItem[key] === '' || 
                  existingItem[key] === '-') {
            existingItem[key] = sourceItem[key];
          }
        });
      } else {
        // 添加新项
        result[category].push(JSON.parse(JSON.stringify(sourceItem)));
        modelMap.set(sourceItem.model, result[category][result[category].length - 1]);
      }
    });
  });
  
  return result;
}

/**
 * 将数据对象转换为JavaScript代码字符串
 * @param {Object} data 要转换的数据对象
 * @param {boolean} includeFunction 是否包含applyPriceUpdates函数
 * @returns {string} JavaScript代码字符串
 */
function convertToJsCode(data, includeFunction = true) {
  const now = new Date();
  const dateStr = now.toISOString().split('T')[0];
  
  let code = `// src/data/embeddedData.js
// 船用齿轮箱内置数据 - 自动更新于 ${dateStr}
// 数据来源：
// - OCR价格表及其他更新来源
// - embeddednew.js价格及参数数据
//
// 更新逻辑：
// - 保留现有数据结构和非价格参数字段
// - 专注于更新价格相关字段(basePrice, price, discountRate, factoryPrice, packagePrice, marketPrice)
// - 当现有技术参数字段为空或0时，使用新数据替换

/**
 * 嵌入式齿轮箱数据集
 * key 为分类，value 为对应数组
 */
export const embeddedGearboxData = ${JSON.stringify(data, null, 2)};
`;

  if (includeFunction) {
    code += `

/**
 * 根据外部价格表更新齿轮箱价格
 * @param {object} data 嵌入式数据
 * @param {Array<{model:string,basePrice:number,discountRate:number,discountedPrice:number}>} priceList 外部价格列表
 * @returns {object} 更新后的数据
 */
export function applyPriceUpdates(data, priceList) {
  const priceMap = new Map();
  priceList.forEach((item) => {
    const key = item.model.trim();
    priceMap.set(key, item);
  });

  const updated = JSON.parse(JSON.stringify(data));
  Object.values(updated).forEach((arr) => {
    if (!Array.isArray(arr)) return;
    arr.forEach((g) => {
      const p = priceMap.get(g.model);
      if (p) {
        g.basePrice = p.basePrice;
        g.price = p.basePrice;
        g.discountRate = p.discountRate;
        g.factoryPrice = p.discountedPrice;
        g.packagePrice = p.discountedPrice;
        g.marketPrice = g.factoryPrice
          ? parseFloat((g.factoryPrice / (1 - 0.12)).toFixed(2))
          : 0;
        g.priceWarning = false;
      }
    });
  });
  return updated;
}`;
  }
  
  return code;
}

/**
 * 主函数：合并齿轮箱数据并生成更新后的代码
 * @param {string} targetCode 目标代码字符串（现有系统代码）
 * @param {string} sourceCode 源代码字符串（新的更新代码）
 * @returns {string} 合并后的JavaScript代码
 */
function mergeGearboxDataCode(targetCode, sourceCode) {
  // 从目标代码和源代码中提取对象
  const targetData = extractObjectFromString(targetCode, 'embeddedGearboxData');
  const sourceData = extractObjectFromString(sourceCode, 'embeddedGearboxData');
  
  if (!targetData || !sourceData) {
    throw new Error('提取数据对象失败');
  }
  
  // 合并数据
  const mergedData = mergeGearboxData(targetData, sourceData);
  
  // 将合并后的数据转换为JavaScript代码
  return convertToJsCode(mergedData);
}

// 导出工具函数
export {
  extractObjectFromString,
  mergeGearboxData,
  convertToJsCode,
  mergeGearboxDataCode
};
