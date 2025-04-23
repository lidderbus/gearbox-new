// src/utils/dataLoader.js
import { embeddedGearboxData } from '../data/embeddedData';
import { flexibleCouplings } from '../data/flexibleCouplings';
import { standbyPumps } from '../data/standbyPumps';
import { adaptBasicData } from './dataAdapter';
import { validateCriticalData } from './dataValidator';
import { 
  processPriceData,
  fixSpecificModelPrices,
  getStandardDiscountRate 
} from './priceManager';

export async function loadAndPrepareData(options = {}) {
  const { onProgress } = options;
  
  try {
    // 1. 加载基础数据
    onProgress?.('loading base data');
    console.log("DataLoader: 加载基础数据...");
    
    let baseData = {
      ...embeddedGearboxData,
      flexibleCouplings: flexibleCouplings || [],
      standbyPumps: standbyPumps || [],
      _version: 2,
      _lastFixed: new Date().toISOString()
    };
    
    // 2. 加载本地存储的数据（如果有）
    onProgress?.('checking local storage');
    const savedData = loadFromLocalStorage();
    if (savedData) {
      baseData = mergeData(baseData, savedData);
    }
    
    // 3. 尝试加载外部数据文件（可选）
    onProgress?.('loading external data');
    try {
      const externalData = await loadExternalData();
      if (externalData) {
        baseData = mergeData(baseData, externalData);
      }
    } catch (error) {
      console.warn("DataLoader: 外部数据加载失败，使用基础数据", error);
    }
    
    // 4. 基础数据适配
    onProgress?.('adapting data');
    const adaptedData = adaptBasicData(baseData);
    
    // 5. 价格修正
    onProgress?.('correcting prices');
    const priceFixResult = processPriceData(adaptedData);
    const finalData = fixSpecificModelPrices(priceFixResult.data);
    
    // 6. 关键数据验证
    onProgress?.('validating data');
    const validation = validateCriticalData(finalData);
    if (!validation.success) {
      console.warn("DataLoader: 验证发现问题，但继续运行:", validation.issues);
    }
    
    // 7. 保存到本地
    saveToLocalStorage(finalData);
    
    return finalData;
    
  } catch (error) {
    console.error("DataLoader: 加载过程出错", error);
    // 返回最小可用数据
    return {
      ...embeddedGearboxData,
      flexibleCouplings: [],
      standbyPumps: [],
      _error: error.message
    };
  }
}

function loadFromLocalStorage() {
  try {
    const savedData = localStorage.getItem('gearboxAppData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      // 检查版本
      if (parsed._version === 2) {
        return parsed;
      }
      console.warn("DataLoader: 本地存储版本不匹配，忽略");
    }
  } catch (error) {
    console.warn("DataLoader: 读取本地存储失败", error);
  }
  return null;
}

function saveToLocalStorage(data) {
  try {
    const toSave = {
      ...data,
      _lastSaved: new Date().toISOString()
    };
    localStorage.setItem('gearboxAppData', JSON.stringify(toSave));
  } catch (error) {
    console.warn("DataLoader: 保存到本地存储失败", error);
  }
}

async function loadExternalData() {
  try {
    const response = await fetch('./gearbox-data.json');
    if (response.ok) {
      const data = await response.json();
      console.log("DataLoader: 成功加载外部数据文件");
      return data;
    }
  } catch (error) {
    console.warn("DataLoader: 外部数据文件加载失败", error);
  }
  return null;
}

function mergeData(baseData, newData) {
  const merged = { ...baseData };
  
  // 合并每个集合
  Object.keys(newData).forEach(key => {
    if (Array.isArray(newData[key]) && Array.isArray(baseData[key])) {
      merged[key] = mergeArrays(baseData[key], newData[key]);
    } else if (key.startsWith('_')) {
      // 系统字段，如果新数据有就覆盖
      merged[key] = newData[key];
    } else {
      // 其他字段，优先使用新数据
      merged[key] = newData[key] || baseData[key];
    }
  });
  
  return merged;
}

function mergeArrays(baseArray, newArray) {
  const modelMap = new Map();
  
  // 先添加基础数据
  baseArray.forEach(item => {
    if (item && item.model) {
      modelMap.set(item.model, item);
    }
  });
  
  // 用新数据覆盖或添加
  newArray.forEach(item => {
    if (item && item.model) {
      modelMap.set(item.model, item);
    }
  });
  
  return Array.from(modelMap.values());
}