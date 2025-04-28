/**
 * 文件: src/utils/enhancedPumpSelection.js
 * 描述: 增强版备用泵选型规则，避免命名冲突
 */

/**
 * GW系列齿轮箱与备用泵对应关系
 */
const gwSeriesPumpRules = [
  {
    range: ['GW28.30', 'GW45.49'],
    pumpModel: '2CY-7.5/2.5D'
  },
  {
    range: ['GW49.54', 'GW52.62'],
    pumpModel: '2CY-14.2/2.5D'
  },
  {
    range: ['GW60.66', 'GW60.74'],
    pumpModel: '2CY-19.2/2.5D'
  },
  {
    range: ['GW63.71', 'GW999.99'],
    pumpModel: '2CY-24.8/2.5D'
  }
];

/**
 * HC系列齿轮箱与备用泵对应关系
 */
const hcSeriesPumpRules = [
  {
    series: '1000-1200',
    pumpModel: '2CY-5/2.5D'
  },
  {
    series: '1400-2000',
    pumpModel: '2CY-7.5/2.5D'
  },
  {
    series: '2700',
    pumpModel: '2CY-14.2/2.5D'
  }
];

/**
 * DT系列齿轮箱与备用泵对应关系
 */
const dtSeriesPumpRules = [
  {
    range: ['DT180', 'DT770'],
    pumpModel: '2CYA-1.1/0.8D'
  },
  {
    range: ['DT900', 'DT1400'],
    pumpModel: '2CYA-1.7/0.8D'
  },
  {
    range: ['DT1500', 'DT2400'],
    pumpModel: '2CYA-2.2/1D'
  }
];

/**
 * 增强版备用泵选型函数
 * 根据齿轮箱型号自动选择匹配的备用泵
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {Array} pumpList - 备用泵列表
 * @returns {Object} - 匹配的备用泵对象
 */
export const enhancedSelectPump = (gearboxModel, pumpList) => {
  // 验证输入
  if (!gearboxModel || typeof gearboxModel !== 'string') {
    console.error('无效的齿轮箱型号');
    return {
      success: false,
      message: '无效的齿轮箱型号'
    };
  }
  
  if (!Array.isArray(pumpList) || pumpList.length === 0) {
    console.error('备用泵列表为空或无效');
    return {
      success: false,
      message: '备用泵列表为空或无效'
    };
  }
  
  // 标准化齿轮箱型号（去除空格和转为大写）
  const normalizedModel = gearboxModel.toUpperCase().trim();
  
  // 确定齿轮箱系列
  let targetPumpModel = null;
  
  // 检查GW系列
  if (normalizedModel.startsWith('GW')) {
    targetPumpModel = findMatchingPumpForGWModel(normalizedModel);
  } 
  // 检查HC系列
  else if (normalizedModel.startsWith('HC')) {
    targetPumpModel = findMatchingPumpForHCModel(normalizedModel);
  } 
  // 检查DT系列
  else if (normalizedModel.startsWith('DT')) {
    targetPumpModel = findMatchingPumpForDTModel(normalizedModel);
  }
  
  // 如果没有找到匹配的型号，返回错误
  if (!targetPumpModel) {
    console.warn(`找不到与齿轮箱型号 ${gearboxModel} 匹配的备用泵`);
    return {
      success: false,
      message: `找不到与齿轮箱型号 ${gearboxModel} 匹配的备用泵`
    };
  }
  
  // 在泵列表中查找匹配的泵型号
  const matchedPump = findPumpInList(targetPumpModel, pumpList);
  
  if (matchedPump) {
    console.log(`成功匹配备用泵: ${matchedPump.model} 用于齿轮箱: ${gearboxModel}`);
    return {
      success: true,
      model: matchedPump.model,
      ...matchedPump,
      message: `已自动选择与齿轮箱 ${gearboxModel} 匹配的备用泵`
    };
  } else {
    // 在列表中找不到对应型号，返回建议型号
    console.warn(`在备用泵库中找不到型号为 ${targetPumpModel} 的泵，但这是推荐型号`);
    return {
      success: false,
      suggestedModel: targetPumpModel,
      message: `在备用泵库中找不到型号为 ${targetPumpModel} 的泵，请手动选择或添加此型号`
    };
  }
};

/**
 * 根据GW系列齿轮箱型号查找匹配的备用泵型号
 */
function findMatchingPumpForGWModel(gearboxModel) {
  // 从型号中提取数字部分
  const match = gearboxModel.match(/GW(\d+\.\d+)/);
  if (!match) return null;
  
  const modelNumber = parseFloat(match[1]);
  
  // 按照定义的规则进行匹配
  for (const rule of gwSeriesPumpRules) {
    const lowerBound = rule.range[0].match(/GW(\d+\.\d+)/);
    const upperBound = rule.range[1].match(/GW(\d+\.\d+)/);
    
    if (!lowerBound || !upperBound) continue;
    
    const lowerValue = parseFloat(lowerBound[1]);
    const upperValue = parseFloat(upperBound[1]);
    
    if (modelNumber >= lowerValue && modelNumber <= upperValue) {
      return rule.pumpModel;
    }
  }
  
  return null;
}

/**
 * 根据HC系列齿轮箱型号查找匹配的备用泵型号
 */
function findMatchingPumpForHCModel(gearboxModel) {
  // 尝试提取HC系列号码
  const match = gearboxModel.match(/HC(\d+)/);
  if (!match) return null;
  
  const seriesNumber = parseInt(match[1]);
  
  // 检查是否在1000-1200系列范围内
  if (seriesNumber >= 1000 && seriesNumber <= 1200) {
    return hcSeriesPumpRules[0].pumpModel;
  }
  // 检查是否在1400-2000系列范围内
  else if (seriesNumber >= 1400 && seriesNumber <= 2000) {
    return hcSeriesPumpRules[1].pumpModel;
  }
  // 检查是否为2700系列
  else if (seriesNumber >= 2700 && seriesNumber < 2800) {
    return hcSeriesPumpRules[2].pumpModel;
  }
  
  return null;
}

/**
 * 根据DT系列齿轮箱型号查找匹配的备用泵型号
 */
function findMatchingPumpForDTModel(gearboxModel) {
  // 尝试提取DT系列号码
  const match = gearboxModel.match(/DT(\d+)/);
  if (!match) return null;
  
  const seriesNumber = parseInt(match[1]);
  
  // 根据系列号码范围匹配对应的泵型号
  if (seriesNumber >= 180 && seriesNumber <= 770) {
    return dtSeriesPumpRules[0].pumpModel;
  }
  else if (seriesNumber >= 900 && seriesNumber <= 1400) {
    return dtSeriesPumpRules[1].pumpModel;
  }
  else if (seriesNumber >= 1500 && seriesNumber <= 2400) {
    return dtSeriesPumpRules[2].pumpModel;
  }
  
  return null;
}

/**
 * 在泵列表中查找匹配的泵型号
 */
function findPumpInList(targetModel, pumpList) {
  // 标准化目标型号（去除空格和大小写差异）
  const normalizedTarget = targetModel.replace(/\s+/g, '').toUpperCase();
  
  // 在列表中查找完全匹配的型号
  const exactMatch = pumpList.find(pump => {
    const normalizedPumpModel = (pump.model || '').replace(/\s+/g, '').toUpperCase();
    return normalizedPumpModel === normalizedTarget;
  });
  
  if (exactMatch) return exactMatch;
  
  // 如果找不到完全匹配，尝试查找部分匹配
  // 提取型号的主要部分（例如，从2CY-7.5/2.5D提取2CY和7.5）
  const targetMainPart = normalizedTarget.split('-')[0];
  const targetCapacityMatch = normalizedTarget.match(/([\d.]+)/);
  const targetCapacity = targetCapacityMatch ? targetCapacityMatch[1] : null;
  
  if (!targetMainPart || !targetCapacity) return null;
  
  // 查找部分匹配的型号
  return pumpList.find(pump => {
    const normalizedPumpModel = (pump.model || '').replace(/\s+/g, '').toUpperCase();
    return normalizedPumpModel.includes(targetMainPart) && 
           normalizedPumpModel.includes(targetCapacity);
  });
}

// 导出规则，以便在其他地方可能需要直接引用
export const pumpMatchingRules = {
  GW: gwSeriesPumpRules,
  HC: hcSeriesPumpRules,
  DT: dtSeriesPumpRules
};