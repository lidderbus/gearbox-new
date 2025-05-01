/**
 * 高级数据验证与清洗模块
 * 用于数据导入前的验证、清洗和修复处理
 */

// 导入依赖项
import { isValidNumber } from './numberUtils';
import { isValidModel } from './modelUtils';

/**
 * 齿轮箱数据验证器 - 验证齿轮箱数据完整性和有效性
 * @param {Object} data - 待验证的齿轮箱数据对象
 * @returns {Object} - 验证结果 {valid: boolean, errors: Array, warnings: Array}
 */
export function validateGearboxData(data) {
  const errors = [];
  const warnings = [];
  const validationResult = { valid: true, errors, warnings };
  
  // 基本字段验证
  if (!data) {
    errors.push('数据对象为空');
    validationResult.valid = false;
    return validationResult;
  }
  
  // 必填字段验证
  const requiredFields = ['model', 'series', 'ratio', 'power', 'inputSpeed'];
  requiredFields.forEach(field => {
    if (data[field] === undefined || data[field] === null || data[field] === '') {
      errors.push(`缺少必填字段: ${field}`);
      validationResult.valid = false;
    }
  });
  
  // 数值字段验证
  const numericFields = ['ratio', 'power', 'inputSpeed', 'outputSpeed', 'weight', 'length', 'width', 'height', 
                        'inputShaftDiameter', 'outputShaftDiameter', 'thrustCapacity', 'basePrice'];
  
  numericFields.forEach(field => {
    if (data[field] !== undefined && data[field] !== null) {
      if (!isValidNumber(data[field])) {
        errors.push(`字段 ${field} 必须是有效数字`);
        validationResult.valid = false;
      } else if (data[field] < 0) {
        errors.push(`字段 ${field} 不能为负数`);
        validationResult.valid = false;
      }
    }
  });
  
  // 型号格式验证
  if (data.model && !isValidModel(data.model)) {
    warnings.push(`型号 ${data.model} 格式不符合标准命名规范`);
  }
  
  // 齿轮箱关系验证
  if (data.inputSpeed && data.outputSpeed && data.ratio) {
    const calculatedOutputSpeed = data.inputSpeed / data.ratio;
    const deviation = Math.abs(calculatedOutputSpeed - data.outputSpeed) / data.outputSpeed;
    
    if (deviation > 0.01) { // 超过1%的误差
      warnings.push(`输入转速、输出转速与减速比不匹配: 计算值=${calculatedOutputSpeed}, 给定值=${data.outputSpeed}`);
    }
  }
  
  // 特定字段验证
  if (data.mountingPosition && !['horizontal', 'vertical', 'inclined'].includes(data.mountingPosition.toLowerCase())) {
    warnings.push(`安装位置值 "${data.mountingPosition}" 不是标准安装位置类型`);
  }
  
  // 价格验证
  if (data.basePrice && data.factoryPrice && data.basePrice > data.factoryPrice) {
    warnings.push('基础价格高于出厂价格，请确认价格设置是否正确');
  }
  
  return validationResult;
}

/**
 * 数据清洗函数 - 处理和修复常见数据问题
 * @param {Object} data - 待清洗的数据对象
 * @returns {Object} - 清洗后的数据对象
 */
export function cleanGearboxData(data) {
  if (!data) return null;
  
  const cleanData = { ...data };
  
  // 处理基础字段
  if (cleanData.model) {
    cleanData.model = cleanData.model.trim().toUpperCase(); // 标准化型号为大写
  }
  
  if (cleanData.series) {
    cleanData.series = cleanData.series.trim();
  }
  
  // 处理数字类型字段 - 去除无效值并转换为数字
  const numericFields = ['ratio', 'power', 'inputSpeed', 'outputSpeed', 'weight', 
                        'length', 'width', 'height', 'thrustCapacity', 'basePrice'];
  
  numericFields.forEach(field => {
    if (cleanData[field] !== undefined && cleanData[field] !== null) {
      // 尝试转换为有效数字
      const numValue = parseFloat(cleanData[field]);
      if (!isNaN(numValue)) {
        cleanData[field] = numValue;
      } else {
        // 无法转换为数字，设置为null
        cleanData[field] = null;
      }
    }
  });
  
  // 修复输出转速（如果缺失但有输入转速和减速比）
  if (cleanData.inputSpeed && cleanData.ratio && !cleanData.outputSpeed) {
    cleanData.outputSpeed = cleanData.inputSpeed / cleanData.ratio;
  }
  
  // 处理基础价格（如果为0或负值）
  if (cleanData.basePrice !== undefined && (cleanData.basePrice <= 0 || isNaN(cleanData.basePrice))) {
    cleanData.basePrice = null; // 设置为null，表示价格未定义
  }
  
  // 规范化安装位置字段
  if (cleanData.mountingPosition) {
    const position = cleanData.mountingPosition.toLowerCase().trim();
    if (position.includes('hor')) {
      cleanData.mountingPosition = 'horizontal';
    } else if (position.includes('ver')) {
      cleanData.mountingPosition = 'vertical';
    } else if (position.includes('inc')) {
      cleanData.mountingPosition = 'inclined';
    }
  }
  
  return cleanData;
}

/**
 * 批量数据验证处理函数
 * @param {Array} dataArray - 数据对象数组
 * @returns {Object} - 批量验证结果
 */
export function batchValidateGearboxData(dataArray) {
  if (!Array.isArray(dataArray)) {
    return {
      valid: false,
      invalidCount: 1,
      validCount: 0,
      totalCount: 1,
      allErrors: ['提供的数据不是有效数组']
    };
  }
  
  let validCount = 0;
  let invalidCount = 0;
  const validItems = [];
  const invalidItems = [];
  const allErrors = [];
  const allWarnings = [];
  
  // 处理每个数据项
  dataArray.forEach((item, index) => {
    const result = validateGearboxData(item);
    
    if (result.valid) {
      validCount++;
      validItems.push(item);
    } else {
      invalidCount++;
      invalidItems.push({
        index,
        item,
        errors: result.errors
      });
      
      // 收集错误信息
      result.errors.forEach(error => {
        allErrors.push(`[项目 ${index}] ${error}`);
      });
    }
    
    // 收集警告信息
    result.warnings.forEach(warning => {
      allWarnings.push(`[项目 ${index}] ${warning}`);
    });
  });
  
  return {
    valid: invalidCount === 0,
    invalidCount,
    validCount,
    totalCount: dataArray.length,
    validItems,
    invalidItems,
    allErrors,
    allWarnings
  };
}

/**
 * 批量数据清洗函数
 * @param {Array} dataArray - 数据对象数组
 * @returns {Object} - 清洗结果
 */
export function batchCleanGearboxData(dataArray) {
  if (!Array.isArray(dataArray)) {
    return {
      success: false,
      message: '提供的数据不是有效数组',
      cleanedData: []
    };
  }
  
  const cleanedData = dataArray.map(item => cleanGearboxData(item));
  
  // 过滤掉null项
  const filteredData = cleanedData.filter(item => item !== null);
  
  return {
    success: true,
    message: `成功清洗 ${filteredData.length}/${dataArray.length} 个数据项`,
    cleanedData: filteredData,
    originalCount: dataArray.length,
    cleanedCount: filteredData.length
  };
}

/**
 * 智能数据修复函数 - 尝试修复常见数据问题
 * @param {Object} data - 待修复的数据对象
 * @returns {Object} - 修复结果
 */
export function repairGearboxData(data) {
  // 首先进行基础清洗
  let repairedData = cleanGearboxData(data);
  if (!repairedData) return { success: false, data: null, repairs: [] };
  
  const repairs = []; // 记录修复操作
  
  // 1. 检查并修复减速比、输入转速和输出转速之间的关系
  if (repairedData.inputSpeed && repairedData.outputSpeed && !repairedData.ratio) {
    // 如果有输入转速和输出转速但没有减速比，计算减速比
    repairedData.ratio = repairedData.inputSpeed / repairedData.outputSpeed;
    repairs.push(`根据输入转速(${repairedData.inputSpeed})和输出转速(${repairedData.outputSpeed})计算减速比为 ${repairedData.ratio.toFixed(3)}`);
  } else if (repairedData.inputSpeed && repairedData.ratio && !repairedData.outputSpeed) {
    // 如果有输入转速和减速比但没有输出转速，计算输出转速
    repairedData.outputSpeed = repairedData.inputSpeed / repairedData.ratio;
    repairs.push(`根据输入转速(${repairedData.inputSpeed})和减速比(${repairedData.ratio})计算输出转速为 ${repairedData.outputSpeed.toFixed(2)}`);
  } else if (repairedData.outputSpeed && repairedData.ratio && !repairedData.inputSpeed) {
    // 如果有输出转速和减速比但没有输入转速，计算输入转速
    repairedData.inputSpeed = repairedData.outputSpeed * repairedData.ratio;
    repairs.push(`根据输出转速(${repairedData.outputSpeed})和减速比(${repairedData.ratio})计算输入转速为 ${repairedData.inputSpeed.toFixed(2)}`);
  }
  
  // 2. 基于型号规则推断缺失字段
  if (repairedData.model) {
    const modelInfo = extractInfoFromModel(repairedData.model);
    
    // 如果型号解析成功，使用解析信息补充缺失字段
    if (modelInfo.success) {
      if (!repairedData.series && modelInfo.series) {
        repairedData.series = modelInfo.series;
        repairs.push(`从型号 ${repairedData.model} 解析得到系列 ${modelInfo.series}`);
      }
      
      if (!repairedData.ratio && modelInfo.ratio) {
        repairedData.ratio = modelInfo.ratio;
        repairs.push(`从型号 ${repairedData.model} 解析得到减速比 ${modelInfo.ratio}`);
      }
      
      if (!repairedData.power && modelInfo.power) {
        repairedData.power = modelInfo.power;
        repairs.push(`从型号 ${repairedData.model} 解析得到功率 ${modelInfo.power} kW`);
      }
    }
  }
  
  // 3. 处理缺失的价格字段
  if (!repairedData.basePrice && repairedData.factoryPrice) {
    // 如果没有基础价格但有出厂价格，估算基础价格
    repairedData.basePrice = repairedData.factoryPrice * 0.85; // 假设基础价格是出厂价格的85%
    repairs.push(`根据出厂价格 ${repairedData.factoryPrice} 估算基础价格为 ${repairedData.basePrice.toFixed(2)}`);
  }
  
  // 4. 检查并修复尺寸比例问题
  if (repairedData.length && repairedData.width && repairedData.height) {
    const aspectRatios = validateDimensionRatios(repairedData.length, repairedData.width, repairedData.height);
    
    if (!aspectRatios.valid) {
      // 尺寸比例异常，尝试修复
      if (aspectRatios.suspiciousDimension === 'length') {
        const oldLength = repairedData.length;
        repairedData.length = estimateCorrectLength(repairedData.width, repairedData.height, repairedData.power);
        repairs.push(`长度 ${oldLength} 可能有误，修正为 ${repairedData.length} mm`);
      } else if (aspectRatios.suspiciousDimension === 'width') {
        const oldWidth = repairedData.width;
        repairedData.width = estimateCorrectWidth(repairedData.length, repairedData.height, repairedData.power);
        repairs.push(`宽度 ${oldWidth} 可能有误，修正为 ${repairedData.width} mm`);
      } else if (aspectRatios.suspiciousDimension === 'height') {
        const oldHeight = repairedData.height;
        repairedData.height = estimateCorrectHeight(repairedData.length, repairedData.width, repairedData.power);
        repairs.push(`高度 ${oldHeight} 可能有误，修正为 ${repairedData.height} mm`);
      }
    }
  }
  
  return {
    success: true,
    data: repairedData,
    repairs: repairs,
    repairCount: repairs.length
  };
}

/**
 * 从型号提取信息函数
 * @param {string} model - 齿轮箱型号
 * @returns {Object} - 提取结果
 */
function extractInfoFromModel(model) {
  // 针对常见齿轮箱型号格式进行解析
  // 例如: GWC50-35.67 表示 GWC系列 50kW 减速比35.67的齿轮箱
  
  const result = {
    success: false,
    series: null,
    power: null,
    ratio: null
  };
  
  if (!model) return result;
  
  // 匹配系列名称（字母部分）
  const seriesMatch = model.match(/^([A-Za-z]+)/);
  if (seriesMatch) {
    result.series = seriesMatch[1];
  }
  
  // 匹配功率值（第一组数字）
  const powerMatch = model.match(/([0-9]+)/);
  if (powerMatch) {
    result.power = parseFloat(powerMatch[1]);
  }
  
  // 匹配减速比（带小数点的数字，通常在连字符或斜杠后面）
  const ratioMatch = model.match(/[-\/]([0-9]+\.[0-9]+)/);
  if (ratioMatch) {
    result.ratio = parseFloat(ratioMatch[1]);
  }
  
  // 判断解析是否成功
  if (result.series || result.power || result.ratio) {
    result.success = true;
  }
  
  return result;
}

/**
 * 验证尺寸比例是否合理
 * @param {number} length - 长度(mm)
 * @param {number} width - 宽度(mm)
 * @param {number} height - 高度(mm)
 * @returns {Object} - 验证结果
 */
function validateDimensionRatios(length, width, height) {
  // 典型船用齿轮箱的长宽高比例范围
  const typicalRatios = {
    lengthToWidth: { min: 1.2, max: 3.0 },
    lengthToHeight: { min: 0.8, max: 2.5 },
    widthToHeight: { min: 0.6, max: 1.5 }
  };
  
  const result = {
    valid: true,
    suspiciousDimension: null
  };
  
  // 计算实际比例
  const lengthToWidth = length / width;
  const lengthToHeight = length / height;
  const widthToHeight = width / height;
  
  // 检查比例是否在合理范围内
  if (lengthToWidth < typicalRatios.lengthToWidth.min || lengthToWidth > typicalRatios.lengthToWidth.max) {
    result.valid = false;
    
    // 判断哪个维度更可能有问题
    if (lengthToHeight < typicalRatios.lengthToHeight.min || lengthToHeight > typicalRatios.lengthToHeight.max) {
      result.suspiciousDimension = 'length';
    } else {
      result.suspiciousDimension = 'width';
    }
  } else if (lengthToHeight < typicalRatios.lengthToHeight.min || lengthToHeight > typicalRatios.lengthToHeight.max) {
    result.valid = false;
    
    if (widthToHeight < typicalRatios.widthToHeight.min || widthToHeight > typicalRatios.widthToHeight.max) {
      result.suspiciousDimension = 'height';
    } else {
      result.suspiciousDimension = 'length';
    }
  } else if (widthToHeight < typicalRatios.widthToHeight.min || widthToHeight > typicalRatios.widthToHeight.max) {
    result.valid = false;
    result.suspiciousDimension = 'height';
  }
  
  return result;
}

/**
 * 估算合理的长度值
 * @param {number} width - 宽度(mm)
 * @param {number} height - 高度(mm)
 * @param {number} power - 功率(kW)
 * @returns {number} - 估算的长度
 */
function estimateCorrectLength(width, height, power) {
  // 基于宽度和高度估算合理的长度
  // 对于小功率齿轮箱，长度约为宽度的1.5倍
  // 对于大功率齿轮箱，长度约为宽度的2倍或更多
  
  let lengthFactor = 1.5; // 默认因子
  
  if (power) {
    // 根据功率调整长度因子
    if (power <= 50) {
      lengthFactor = 1.5;
    } else if (power <= 200) {
      lengthFactor = 1.8;
    } else if (power <= 500) {
      lengthFactor = 2.0;
    } else {
      lengthFactor = 2.3;
    }
  }
  
  return Math.round(width * lengthFactor);
}

/**
 * 估算合理的宽度值
 * @param {number} length - 长度(mm)
 * @param {number} height - 高度(mm)
 * @param {number} power - 功率(kW)
 * @returns {number} - 估算的宽度
 */
function estimateCorrectWidth(length, height, power) {
  // 基于长度估算合理的宽度
  let widthFactor = 0.6; // 默认因子
  
  if (power) {
    // 根据功率调整宽度因子
    if (power <= 50) {
      widthFactor = 0.67;
    } else if (power <= 200) {
      widthFactor = 0.6;
    } else if (power <= 500) {
      widthFactor = 0.55;
    } else {
      widthFactor = 0.5;
    }
  }
  
  return Math.round(length * widthFactor);
}

/**
 * 估算合理的高度值
 * @param {number} length - 长度(mm)
 * @param {number} width - 宽度(mm)
 * @param {number} power - 功率(kW)
 * @returns {number} - 估算的高度
 */
function estimateCorrectHeight(length, width, power) {
  // 基于宽度估算合理的高度
  let heightFactor = 1.1; // 默认因子
  
  if (power) {
    // 根据功率调整高度因子
    if (power <= 50) {
      heightFactor = 1.1;
    } else if (power <= 200) {
      heightFactor = 1.2;
    } else if (power <= 500) {
      heightFactor = 1.3;
    } else {
      heightFactor = 1.4;
    }
  }
  
  return Math.round(width * heightFactor);
}

/**
 * 检测并修复齿轮箱数据集中的异常值
 * @param {Array} dataArray - 齿轮箱数据数组
 * @returns {Object} - 修复结果
 */
export function detectAndFixOutliers(dataArray) {
  if (!Array.isArray(dataArray) || dataArray.length < 3) {
    return {
      success: false,
      message: '数据集太小，无法进行异常值检测',
      data: dataArray
    };
  }
  
  // 复制原始数据
  const fixedData = JSON.parse(JSON.stringify(dataArray));
  const outlierReport = [];
  
  // 检测各字段的异常值
  const numericFields = ['ratio', 'power', 'inputSpeed', 'outputSpeed', 'weight', 
                        'length', 'width', 'height', 'basePrice'];
  
  numericFields.forEach(field => {
    // 提取字段值
    const values = dataArray
      .map(item => item[field])
      .filter(val => val !== undefined && val !== null && !isNaN(parseFloat(val)));
    
    if (values.length < 3) return; // 数据点太少，跳过
    
    // 计算统计值
    const stats = calculateStatistics(values);
    
    // 使用IQR方法检测异常值
    const lowerBound = stats.q1 - 1.5 * stats.iqr;
    const upperBound = stats.q3 + 1.5 * stats.iqr;
    
    // 修复异常值
    fixedData.forEach((item, index) => {
      if (item[field] !== undefined && item[field] !== null && !isNaN(item[field])) {
        const value = parseFloat(item[field]);
        
        if (value < lowerBound || value > upperBound) {
          const oldValue = item[field];
          
          // 修复方法：用中位数替换，或者截断到边界值
          if (value < lowerBound) {
            item[field] = lowerBound;
          } else {
            item[field] = upperBound;
          }
          
          outlierReport.push({
            index,
            field,
            oldValue,
            newValue: item[field],
            reason: `超出正常范围(${lowerBound.toFixed(2)}-${upperBound.toFixed(2)})`
          });
        }
      }
    });
  });
  
  return {
    success: true,
    message: `检测并修复了 ${outlierReport.length} 个异常值`,
    data: fixedData,
    outlierReport,
    outlierCount: outlierReport.length
  };
}

/**
 * 计算数值数组的基本统计量
 * @param {Array} values - 数值数组
 * @returns {Object} - 统计结果
 */
function calculateStatistics(values) {
  // 排序数值
  const sortedValues = [...values].sort((a, b) => a - b);
  const n = sortedValues.length;
  
  // 计算平均值
  const sum = sortedValues.reduce((a, b) => a + b, 0);
  const mean = sum / n;
  
  // 计算中位数
  let median;
  if (n % 2 === 0) {
    median = (sortedValues[n / 2 - 1] + sortedValues[n / 2]) / 2;
  } else {
    median = sortedValues[Math.floor(n / 2)];
  }
  
  // 计算四分位数
  const q1Index = Math.floor(n / 4);
  const q3Index = Math.floor(3 * n / 4);
  const q1 = sortedValues[q1Index];
  const q3 = sortedValues[q3Index];
  const iqr = q3 - q1;
  
  // 计算标准差
  const squaredDiffs = sortedValues.map(value => Math.pow(value - mean, 2));
  const variance = squaredDiffs.reduce((a, b) => a + b, 0) / n;
  const stdDev = Math.sqrt(variance);
  
  return {
    min: sortedValues[0],
    max: sortedValues[n - 1],
    mean,
    median,
    q1,
    q3,
    iqr,
    stdDev
  };
}

/**
 * 高级数据导入处理函数
 * @param {Object} rawData - 原始导入数据
 * @param {Object} options - 导入选项
 * @returns {Promise} - 导入处理结果
 */
export async function processDataImport(rawData, options = {}) {
  const defaultOptions = {
    validateData: true,      // 是否验证数据
    cleanData: true,         // 是否清洗数据
    repairData: true,        // 是否修复数据
    detectOutliers: true,    // 是否检测异常值
    importAllValid: true,    // 导入所有有效数据
    skipInvalidItems: false, // 跳过无效数据项
    abortOnError: false      // 出错时中止导入
  };
  
  const importOptions = { ...defaultOptions, ...options };
  
  try {
    // 解析原始数据
    let parsedData;
    if (typeof rawData === 'string') {
      try {
        parsedData = JSON.parse(rawData);
      } catch (error) {
        return {
          success: false,
          message: '无效的JSON数据',
          error: error.message
        };
      }
    } else {
      parsedData = rawData;
    }
    
    // 确保数据是数组
    let dataArray = Array.isArray(parsedData) ? parsedData : [parsedData];
    
    // 处理流程
    let processedData = dataArray;
    const processingLog = [];
    
    // 步骤1: 数据验证
    let validationResult = { valid: true };
    if (importOptions.validateData) {
      validationResult = batchValidateGearboxData(processedData);
      processingLog.push(`数据验证: ${validationResult.validCount}/${validationResult.totalCount} 个项目有效`);
      
      if (!validationResult.valid && importOptions.abortOnError) {
        return {
          success: false,
          message: '验证失败，导入已中止',
          validationResult,
          log: processingLog
        };
      }
      
      // 如果需要跳过无效项目
      if (importOptions.skipInvalidItems && validationResult.invalidCount > 0) {
        processedData = validationResult.validItems;
        processingLog.push(`已跳过 ${validationResult.invalidCount} 个无效项目`);
      }
    }
    
    // 步骤2: 数据清洗
    if (importOptions.cleanData) {
      const cleanResult = batchCleanGearboxData(processedData);
      processedData = cleanResult.cleanedData;
      processingLog.push(`数据清洗: ${cleanResult.cleanedCount}/${cleanResult.originalCount} 个项目已清洗`);
    }
    
    // 步骤3: 数据修复
    if (importOptions.repairData) {
      const repairedData = [];
      const repairLog = [];
      
      for (let i = 0; i < processedData.length; i++) {
        const repairResult = repairGearboxData(processedData[i]);
        
        if (repairResult.success) {
          repairedData.push(repairResult.data);
          
          if (repairResult.repairs.length > 0) {
            repairLog.push(`项目 ${i}: ${repairResult.repairs.join(', ')}`);
          }
        } else {
          // 修复失败，保留原始数据
          repairedData.push(processedData[i]);
        }
      }
      
      processedData = repairedData;
      if (repairLog.length > 0) {
        processingLog.push(`数据修复: 对 ${repairLog.length} 个项目进行了修复`);
        processingLog.push(...repairLog);
      } else {
        processingLog.push(`数据修复: 无需修复`);
      }
    }
    
    // 步骤4: 异常值检测与修复
    if (importOptions.detectOutliers && processedData.length >= 3) {
      const outlierResult = detectAndFixOutliers(processedData);
      
      if (outlierResult.success) {
        processedData = outlierResult.data;
        processingLog.push(`异常值检测: 修复了 ${outlierResult.outlierCount} 个异常值`);
        
        // 添加详细的异常值报告
        if (outlierResult.outlierCount > 0) {
          outlierResult.outlierReport.forEach(item => {
            processingLog.push(`异常值: 项目 ${item.index} 的 ${item.field} 从 ${item.oldValue} 修改为 ${item.newValue}`);
          });
        }
      }
    }
    
    return {
      success: true,
      message: `成功处理 ${processedData.length} 个数据项`,
      data: processedData,
      log: processingLog,
      originalCount: dataArray.length,
      processedCount: processedData.length,
      validationResult
    };
    
  } catch (error) {
    return {
      success: false,
      message: '数据导入处理失败',
      error: error.message
    };
  }
}

export default {
  validateGearboxData,
  cleanGearboxData,
  repairGearboxData,
  batchValidateGearboxData,
  batchCleanGearboxData,
  detectAndFixOutliers,
  processDataImport
};