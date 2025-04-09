// src/utils/dataAdapter.js
// 数据适配器

// 导入辅助函数
import { safeParseFloat, ensureRangeArray, ensureArrayOfNumbers } from './dataHelpers';
import { getDiscountRate, calculateFactoryPrice, calculatePackagePrice, calculateMarketPrice } from '../data/priceDiscount';

// 多项式拟合函数
function polyFit(x, y, degree = 2) {
  // 简单的多项式拟合实现
  // 注: 实际生产环境中建议使用专业的数学库如mathjs
  
  // 构建矩阵
  const matrix = [];
  for (let i = 0; i <= degree; i++) {
    const row = [];
    for (let j = 0; j <= degree; j++) {
      let sum = 0;
      for (let k = 0; k < x.length; k++) {
        sum += Math.pow(x[k], i + j);
      }
      row.push(sum);
    }
    matrix.push(row);
  }
  
  // 构建右侧向量
  const vector = [];
  for (let i = 0; i <= degree; i++) {
    let sum = 0;
    for (let k = 0; k < x.length; k++) {
      sum += y[k] * Math.pow(x[k], i);
    }
    vector.push(sum);
  }
  
  // 解线性方程组 (简化版高斯消元法)
  const coefficients = new Array(degree + 1).fill(0);
  
  // 前向消元
  for (let i = 0; i < degree; i++) {
    for (let j = i + 1; j <= degree; j++) {
      const factor = matrix[j][i] / matrix[i][i];
      for (let k = i; k <= degree; k++) {
        matrix[j][k] -= factor * matrix[i][k];
      }
      vector[j] -= factor * vector[i];
    }
  }
  
  // 回代
  for (let i = degree; i >= 0; i--) {
    let sum = vector[i];
    for (let j = i + 1; j <= degree; j++) {
      sum -= matrix[i][j] * coefficients[j];
    }
    coefficients[i] = sum / matrix[i][i];
  }
  
  return coefficients;
}

// 多项式求值函数
function polyEval(coefficients, x) {
  return coefficients.reduce((sum, coef, i) => sum + coef * Math.pow(x, i), 0);
}

// 主要适配函数
export function adaptEnhancedData(rawData) {
  if (!rawData) return initializeEmptyCollections({});

  // 确保所有集合存在，即使为空
  const data = initializeEmptyCollections(rawData);

  // 处理各类数据
  const gearboxTypes = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes'];
  gearboxTypes.forEach(type => {
    data[type] = adaptItems(data[type] || [], adaptGearboxItem);
  });

  data.flexibleCouplings = adaptItems(data.flexibleCouplings || [], adaptCouplingItem);
  data.standbyPumps = adaptItems(data.standbyPumps || [], adaptPumpItem);

  console.log("数据适配完成。");
  return data;
}

// 初始化空集合
function initializeEmptyCollections(data) {
  const collections = [
    'hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes',
    'hcqGearboxes', 'gcGearboxes', 'flexibleCouplings', 'standbyPumps'
  ];
  const initializedData = { ...data };
  collections.forEach(col => {
    if (!initializedData[col] || !Array.isArray(initializedData[col])) {
      initializedData[col] = [];
    }
  });
  return initializedData;
}

// 适配项目函数
function adaptItems(items, adapterFn) {
  if (!Array.isArray(items)) return [];
  return items.map(item => adapterFn(item)).filter(Boolean); // 过滤掉null
}

// 齿轮箱适配函数
function adaptGearboxItem(gearbox) {
  if (!gearbox || !gearbox.model) return null; // 基本验证

  const adapted = { ...gearbox }; // 复制原始数据

  // 确保基本字段类型
  adapted.model = String(adapted.model).trim();
  adapted.inputSpeedRange = ensureRangeArray(adapted.inputSpeedRange, [1000, 2500]);
  adapted.ratios = ensureArrayOfNumbers(adapted.ratios);
  adapted.transferCapacity = ensureArrayOfNumbers(adapted.transferCapacity);
  
  // 处理 transferCapacity 数组长度与 ratios 数组长度不匹配的情况
  if (adapted.transferCapacity.length === 1 && adapted.ratios.length > 1) {
    // 如果只有一个传递能力值，复制到所有减速比
    const singleValue = adapted.transferCapacity[0];
    adapted.transferCapacity = new Array(adapted.ratios.length).fill(singleValue);
  } 
  // 如果 transferCapacity 长度大于1但与 ratios 长度不匹配
  else if (adapted.transferCapacity.length > 1 && adapted.transferCapacity.length !== adapted.ratios.length) {
    console.log(`正在标准化 ${adapted.model} 的传递能力数组...`);
    
    // 创建一个新数组，长度与 ratios 相同
    const normalizedCapacity = new Array(adapted.ratios.length);
    
    // 使用多项式拟合进行插值
    if (adapted.transferCapacity.length >= 2) {
      try {
        // 创建x轴坐标数组 (基于减速比索引的归一化坐标)
        const xOriginal = adapted.ratios.map((_, index) => 
          index / (adapted.ratios.length - 1)
        );
        const xKnown = adapted.transferCapacity.map((_, index) => 
          index / (adapted.transferCapacity.length - 1)
        );
        
        // 获取已知y值
        const yKnown = adapted.transferCapacity;
        
        // 使用多项式拟合 (如果点数小于3使用线性拟合，否则使用二次拟合)
        const degree = adapted.transferCapacity.length < 3 ? 1 : 2;
        const coefficients = polyFit(xKnown, yKnown, degree);
        
        // 使用拟合曲线生成完整的传递能力数组
        for (let i = 0; i < adapted.ratios.length; i++) {
          normalizedCapacity[i] = polyEval(coefficients, xOriginal[i]);
          // 确保值为正
          if (normalizedCapacity[i] <= 0) {
            normalizedCapacity[i] = Math.max(...yKnown) * 0.5; // 防止出现负值或零
          }
        }
      } catch (e) {
        console.error(`拟合传递能力数组失败:`, e);
        // 回退到简单复制
        const fillValue = adapted.transferCapacity[0] || 0;
        normalizedCapacity.fill(fillValue);
      }
    } else {
      // 如果只有一个值或没有值，填充相同的值
      const defaultValue = adapted.transferCapacity[0] || 0;
      normalizedCapacity.fill(defaultValue);
    }
    
    adapted.transferCapacity = normalizedCapacity;
    console.log(`${adapted.model}的传递能力数组已标准化: [${adapted.transferCapacity.join(', ')}]`);
  }

  adapted.thrust = safeParseFloat(adapted.thrust);
  adapted.centerDistance = safeParseFloat(adapted.centerDistance);
  adapted.weight = safeParseFloat(adapted.weight);
  adapted.dimensions = String(adapted.dimensions || '-').trim();
  adapted.controlType = String(adapted.controlType || '推拉软轴').trim();

  // 价格计算和适配
  adapted.basePrice = safeParseFloat(adapted.basePrice || adapted.price);
  adapted.price = adapted.basePrice; // 保持一致
  adapted.discountRate = adapted.discountRate !== undefined ? safeParseFloat(adapted.discountRate) : getDiscountRate(adapted.model);
  adapted.factoryPrice = safeParseFloat(adapted.factoryPrice) || calculateFactoryPrice(adapted);

  // 计算打包价
  const currentPackagePrice = safeParseFloat(adapted.packagePrice);
  adapted.packagePrice = (currentPackagePrice > 0 && !adapted.recalculatePackagePrice)
                         ? currentPackagePrice
                         : calculatePackagePrice(adapted, null, null);

  // 计算市场价
  const currentMarketPrice = safeParseFloat(adapted.marketPrice);
  adapted.marketPrice = (currentMarketPrice > 0 && !adapted.recalculateMarketPrice)
                        ? currentMarketPrice
                        : calculateMarketPrice(adapted, adapted.packagePrice);

  // 移除临时标记
  delete adapted.recalculatePackagePrice;
  delete adapted.recalculateMarketPrice;

  return adapted;
}

// 联轴器适配函数
function adaptCouplingItem(coupling) {
  if (!coupling || !coupling.model) return null;

  const adapted = { ...coupling };

  adapted.model = String(adapted.model).trim();
  adapted.torque = safeParseFloat(adapted.torque);
  adapted.maxSpeed = safeParseFloat(adapted.maxSpeed);
  adapted.weight = safeParseFloat(adapted.weight);

  // 价格处理
  adapted.basePrice = safeParseFloat(adapted.basePrice || adapted.price);
  adapted.price = adapted.basePrice;
  adapted.discountRate = adapted.discountRate !== undefined ? safeParseFloat(adapted.discountRate) : getDiscountRate(adapted.model);
  adapted.factoryPrice = safeParseFloat(adapted.factoryPrice) || calculateFactoryPrice(adapted);
  
  // 市场价
  const currentMarketPrice = safeParseFloat(adapted.marketPrice);
  adapted.marketPrice = (currentMarketPrice > 0 && !adapted.recalculateMarketPrice)
                       ? currentMarketPrice
                       : Math.round(adapted.basePrice * 1.1);

  delete adapted.recalculateMarketPrice;

  return adapted;
}

// 备用泵适配函数
function adaptPumpItem(pump) {
  if (!pump || !pump.model) return null;

  const adapted = { ...pump };

  adapted.model = String(adapted.model).trim();
  adapted.flow = safeParseFloat(adapted.flow);
  adapted.pressure = safeParseFloat(adapted.pressure);
  adapted.motorPower = safeParseFloat(adapted.motorPower);
  adapted.weight = safeParseFloat(adapted.weight);

  // 价格处理
  adapted.basePrice = safeParseFloat(adapted.basePrice || adapted.price);
  adapted.price = adapted.basePrice;
  adapted.discountRate = adapted.discountRate !== undefined ? safeParseFloat(adapted.discountRate) : getDiscountRate(adapted.model);
  adapted.factoryPrice = safeParseFloat(adapted.factoryPrice) || calculateFactoryPrice(adapted);
  
  // 市场价
  const currentMarketPrice = safeParseFloat(adapted.marketPrice);
  adapted.marketPrice = (currentMarketPrice > 0 && !adapted.recalculateMarketPrice)
                       ? currentMarketPrice
                       : Math.round(adapted.basePrice * 1.1);

  delete adapted.recalculateMarketPrice;

  return adapted;
}