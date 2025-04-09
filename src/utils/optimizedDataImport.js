// src/utils/optimizedDataImport.js
import * as XLSX from 'xlsx';

// 主导入函数，用于处理各种格式的数据文件
export const importData = async (file) => {
  try {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    
    // 根据文件扩展名选择处理方法
    if (fileExtension === 'json') {
      return await importDataFromJson(file);
    } else if (['xlsx', 'xls'].includes(fileExtension)) {
      return await importDataFromExcel(file);
    } else {
      throw new Error(`不支持的文件格式: ${fileExtension}`);
    }
  } catch (error) {
    console.error('数据导入错误:', error);
    throw error;
  }
};

// 从JSON文件导入数据
const importDataFromJson = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        
        // 验证数据结构
        if (!data.hcGearboxes && !data.gwGearboxes && !data.hcmGearboxes) {
          throw new Error('JSON文件格式无效，缺少必要的齿轮箱数据');
        }
        
        // 确保所有必要的集合都存在
        const result = {
          hcGearboxes: data.hcGearboxes || [],
          gwGearboxes: data.gwGearboxes || [],
          hcmGearboxes: data.hcmGearboxes || [],
          dtGearboxes: data.dtGearboxes || [],
          hcqGearboxes: data.hcqGearboxes || [],
          gcGearboxes: data.gcGearboxes || [],
          flexibleCouplings: data.flexibleCouplings || [],
          standbyPumps: data.standbyPumps || []
        };
        
        // 如果有扩展数据结构，保留它们
        if (data.selectionGuidelines) result.selectionGuidelines = data.selectionGuidelines;
        if (data.applicationScenarios) result.applicationScenarios = data.applicationScenarios;
        if (data.packagePriceTable) result.packagePriceTable = data.packagePriceTable;
        
        // 处理齿轮箱数据
        const processGearboxData = (gearboxes) => {
          return gearboxes.map(gearbox => {
            // 确保必要字段存在且格式正确
            const processed = {
              model: gearbox.model || '',
              inputSpeedRange: Array.isArray(gearbox.inputSpeedRange) ? 
                gearbox.inputSpeedRange.map(v => parseFloat(v)).filter(v => !isNaN(v)) : [],
              ratios: Array.isArray(gearbox.ratios) ? 
                gearbox.ratios.map(v => parseFloat(v)).filter(v => !isNaN(v)) : [],
              transferCapacity: Array.isArray(gearbox.transferCapacity) ? 
                gearbox.transferCapacity.map(v => parseFloat(v)).filter(v => !isNaN(v)) : [],
              thrust: parseFloat(gearbox.thrust) || 0,
              centerDistance: parseFloat(gearbox.centerDistance) || 0,
              weight: parseFloat(gearbox.weight) || 0,
              dimensions: gearbox.dimensions || '',
              controlType: gearbox.controlType || '',
              price: parseFloat(gearbox.price) || 0,
              discountRate: parseFloat(gearbox.discountRate) || 0,
              factoryPrice: parseFloat(gearbox.factoryPrice) || 0,
              packagePrice: parseFloat(gearbox.packagePrice) || 0,
              marketPrice: parseFloat(gearbox.marketPrice) || 0,
              recommendedHighFlex: gearbox.recommendedHighFlex || '',
              recommendedPump: gearbox.recommendedPump || ''
            };
            
            // 验证必要字段
            if (!processed.model || 
                processed.inputSpeedRange.length < 2 || 
                processed.ratios.length === 0 || 
                processed.transferCapacity.length === 0 || 
                processed.thrust <= 0) {
              console.warn(`齿轮箱数据无效: ${processed.model || '未知型号'}`);
              return null;
            }
            
            return processed;
          }).filter(Boolean);
        };
        
        // 处理高弹性联轴器数据
        const processCouplingData = (couplings) => {
          return couplings.map(coupling => {
            const processed = {
              model: coupling.model || '',
              torque: parseFloat(coupling.torque) || 0,
              weight: parseFloat(coupling.weight) || 0,
              price: parseFloat(coupling.price) || 0,
              discountRate: parseFloat(coupling.discountRate) || 0,
              factoryPrice: parseFloat(coupling.factoryPrice) || 0
            };
            
            if (!processed.model || processed.torque <= 0 || processed.weight <= 0 || processed.price <= 0) {
              console.warn(`联轴器数据无效: ${processed.model || '未知型号'}`);
              return null;
            }
            
            return processed;
          }).filter(Boolean);
        };
        
        // 处理备用泵数据
        const processPumpData = (pumps) => {
          return pumps.map(pump => {
            const processed = {
              model: pump.model || '',
              flow: parseFloat(pump.flow) || 0,
              pressure: parseFloat(pump.pressure) || 0,
              motorPower: parseFloat(pump.motorPower) || 0,
              price: parseFloat(pump.price) || 0,
              discountRate: parseFloat(pump.discountRate) || 0,
              factoryPrice: parseFloat(pump.factoryPrice) || 0
            };
            
            if (!processed.model || processed.flow <= 0 || processed.pressure <= 0 || 
                processed.motorPower <= 0 || processed.price <= 0) {
              console.warn(`备用泵数据无效: ${processed.model || '未知型号'}`);
              return null;
            }
            
            return processed;
          }).filter(Boolean);
        };
        
        // 处理所有数据
        result.hcGearboxes = processGearboxData(result.hcGearboxes);
        result.gwGearboxes = processGearboxData(result.gwGearboxes);
        result.hcmGearboxes = processGearboxData(result.hcmGearboxes);
        result.dtGearboxes = processGearboxData(result.dtGearboxes);
        result.hcqGearboxes = processGearboxData(result.hcqGearboxes);
        result.gcGearboxes = processGearboxData(result.gcGearboxes);
        result.flexibleCouplings = processCouplingData(result.flexibleCouplings);
        result.standbyPumps = processPumpData(result.standbyPumps);
        
        // 验证处理后的数据
        if (result.hcGearboxes.length === 0 && result.gwGearboxes.length === 0 && 
            result.hcmGearboxes.length === 0 && result.dtGearboxes.length === 0) {
          throw new Error('没有找到有效的齿轮箱数据');
        }
        
        if (result.flexibleCouplings.length === 0) {
          throw new Error('没有找到有效的高弹性联轴器数据');
        }
        
        if (result.standbyPumps.length === 0) {
          throw new Error('没有找到有效的备用泵数据');
        }
        
        resolve(result);
      } catch (error) {
        console.error('JSON处理错误:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsText(file);
  });
};

// 从Excel文件导入数据
const importDataFromExcel = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'array' });
        
        // 创建结果对象
        const result = {
          hcGearboxes: [],
          gwGearboxes: [],
          hcmGearboxes: [],
          dtGearboxes: [],
          hcqGearboxes: [],
          gcGearboxes: [],
          flexibleCouplings: [],
          standbyPumps: []
        };
        
        // 提取不同类型的齿轮箱数据
        const sheetNameMap = {
          'HC': { result: 'hcGearboxes', processor: processGearboxData },
          'GW': { result: 'gwGearboxes', processor: processGearboxData },
          'HCM': { result: 'hcmGearboxes', processor: processGearboxData },
          'DT': { result: 'dtGearboxes', processor: processGearboxData },
          'HCQ': { result: 'hcqGearboxes', processor: processGearboxData },
          'GC': { result: 'gcGearboxes', processor: processGearboxData },
          'HIGH_FLEX': { result: 'flexibleCouplings', processor: processCouplingData },
          'FLEXIBLE': { result: 'flexibleCouplings', processor: processCouplingData },
          'COUPLING': { result: 'flexibleCouplings', processor: processCouplingData },
          'PUMP': { result: 'standbyPumps', processor: processPumpData },
          'STANDBY': { result: 'standbyPumps', processor: processPumpData }
        };
        
        // 遍历所有工作表
        workbook.SheetNames.forEach(sheetName => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          
          if (jsonData.length === 0) return;
          
          // Define a function to determine the category and processor
          const getCategoryInfo = (sheetNameStr) => {
              const upperSheetName = sheetNameStr.toUpperCase().trim();
              // Check for specific Chinese names first
              if (upperSheetName.includes('HC齿轮箱') && !upperSheetName.includes('HCM') && !upperSheetName.includes('HCQ')) return { key: 'hcGearboxes', processor: processGearboxData };
              if (upperSheetName.includes('GW齿轮箱')) return { key: 'gwGearboxes', processor: processGearboxData };
              if (upperSheetName.includes('HCM齿轮箱')) return { key: 'hcmGearboxes', processor: processGearboxData };
              if (upperSheetName.includes('DT齿轮箱')) return { key: 'dtGearboxes', processor: processGearboxData };
              if (upperSheetName.includes('HCQ齿轮箱')) return { key: 'hcqGearboxes', processor: processGearboxData };
              if (upperSheetName.includes('GC齿轮箱') || upperSheetName.includes('GCS齿轮箱')) return { key: 'gcGearboxes', processor: processGearboxData };
              if (upperSheetName.includes('高弹性联轴器') || upperSheetName.includes('高弹') || upperSheetName.includes('联轴器')) return { key: 'flexibleCouplings', processor: processCouplingData };
              if (upperSheetName.includes('备用泵')) return { key: 'standbyPumps', processor: processPumpData };

              // Fallback to keyword matching
              for (const [keyword, mapping] of Object.entries(sheetNameMap)) {
                  if (upperSheetName.includes(keyword)) {
                      return { key: mapping.result, processor: mapping.processor };
                  }
              }
              return null; // No match found
          };

          const categoryInfo = getCategoryInfo(sheetName);

          if (categoryInfo) {
              const { key, processor } = categoryInfo;
              // Process and append data, handling potential duplicates later if needed
              const processedData = processor(jsonData);
              result[key] = (result[key] || []).concat(processedData);
              console.log(`从工作表 ${sheetName} 加载 ${key} 数据，处理后新增 ${processedData.length} 条`);
          } else {
              console.warn(`工作表 ${sheetName} 未匹配到任何已知类别`);
          }
        });

        // Remove duplicates after processing all sheets (based on model)
        Object.keys(result).forEach(categoryKey => {
            if (Array.isArray(result[categoryKey])) {
                const uniqueMap = new Map();
                result[categoryKey].forEach(item => {
                    if(item && item.model) { // Ensure item and model exist
                        uniqueMap.set(item.model, item);
                    }
                });
                result[categoryKey] = Array.from(uniqueMap.values());
                console.log(`类别 ${categoryKey} 去重后剩余 ${result[categoryKey].length} 项`);
            }
        });

        // Final validation after processing and deduplication
        const hasGearboxData = result.hcGearboxes.length > 0 ||
                               result.gwGearboxes.length > 0 ||
                               result.hcmGearboxes.length > 0 ||
                               result.dtGearboxes.length > 0 ||
                               result.hcqGearboxes.length > 0 ||
                               result.gcGearboxes.length > 0;

        if (!hasGearboxData) {
          throw new Error('Excel文件中没有找到有效的齿轮箱数据');
        }
        // Optional: Add checks for couplings and pumps if they are strictly required
        // if (result.flexibleCouplings.length === 0) {
        //   throw new Error('Excel文件中没有找到有效的联轴器数据');
        // }
        // if (result.standbyPumps.length === 0) {
        //   throw new Error('Excel文件中没有找到有效的备用泵数据');
        // }

        resolve(result);
      } catch (error) {
        console.error('Excel处理错误:', error);
        reject(error);
      }
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
    
    reader.readAsArrayBuffer(file);
  });
};

// --- Data Processing Helpers ---

// Helper to safely parse float, returning 0 for invalid values
const safeParseFloat = (value) => {
  if (value === null || value === undefined || value === '') return 0;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const cleaned = value.replace(/[^\d.-]/g, ''); // Corrected regex: remove negation
    const num = parseFloat(cleaned);
    return isNaN(num) ? 0 : num;
  }
  return 0;
};

// Helper to convert string to array of numbers
const stringToArrayOfNumbers = (str) => {
  if (!str) return [];
  if (typeof str !== 'string') str = String(str);
  return str.split(/[,;/\s]+/).map(v => safeParseFloat(v.trim())).filter(v => !isNaN(v));
};

// Helper to ensure a field is a range array [min, max]
const ensureRangeArray = (value, defaultRange = [0, 0]) => {
    let arr = [];
    if (Array.isArray(value)) {
        arr = value.map(safeParseFloat).filter(v => !isNaN(v));
    } else if (typeof value === 'string') {
        arr = stringToArrayOfNumbers(value);
    } else if (typeof value === 'number') {
        arr = [safeParseFloat(value)];
    }

    if (arr.length >= 2) {
        return [arr[0], arr[1]];
    } else if (arr.length === 1) {
        return [arr[0], arr[0]]; // Use single value for min/max
    }
    return defaultRange;
};

// Process gearbox data from a sheet
const processGearboxData = (jsonData) => {
  return jsonData.map(item => {
    const basePrice = safeParseFloat(item['成本价'] || item.price || item.basePrice);
    const discountRate = item['下浮率(%)'] !== undefined ? safeParseFloat(item['下浮率(%)']) : undefined; // Keep undefined if not present
    const factoryPrice = safeParseFloat(item['出厂价'] || item.factoryPrice);

    const processed = {
      model: String(item['型号'] || item.model || '').trim(),
      inputSpeedRange: ensureRangeArray(item['输入转速范围(r/min)'] || item.inputSpeedRange, [1000, 2500]),
      ratios: stringToArrayOfNumbers(item['减速比'] || item.ratios),
      transferCapacity: stringToArrayOfNumbers(item['传递能力(kW/r/min)'] || item.transferCapacity),
      thrust: safeParseFloat(item['额定推力(kN)'] || item.thrust),
      centerDistance: safeParseFloat(item['中心距(mm)'] || item.centerDistance),
      weight: safeParseFloat(item['重量(kg)'] || item.weight),
      dimensions: String(item['外形尺寸(mm)'] || item.dimensions || '-').trim(),
      controlType: String(item['控制方式'] || item.controlType || '推拉软轴').trim(),
      price: basePrice, // Use price = basePrice convention
      basePrice: basePrice,
      // Only include discountRate/factoryPrice if they were present or calculable
      ...(discountRate !== undefined && { discountRate }),
      ...(factoryPrice > 0 && { factoryPrice }),
      packagePrice: safeParseFloat(item['打包价'] || item.packagePrice),
      marketPrice: safeParseFloat(item['市场价'] || item.marketPrice),
      recommendedHighFlex: String(item['推荐高弹'] || item.recommendedHighFlex || '').trim(),
      recommendedPump: String(item['推荐泵'] || item.recommendedPump || '').trim()
    };

    // Basic validation
    if (!processed.model || processed.ratios.length === 0 || processed.thrust <= 0) {
      console.warn(`Excel导入：齿轮箱数据无效或不完整: ${processed.model || JSON.stringify(item)}`);
      return null; // Skip invalid items
    }
    return processed;
  }).filter(Boolean);
};

// Process coupling data from a sheet
const processCouplingData = (jsonData) => {
   return jsonData.map(item => {
    const basePrice = safeParseFloat(item['成本价'] || item.price || item.basePrice);
    const discountRate = item['下浮率(%)'] !== undefined ? safeParseFloat(item['下浮率(%)']) : undefined;
    const factoryPrice = safeParseFloat(item['出厂价'] || item.factoryPrice);

    const processed = {
        model: String(item['型号'] || item.model || '').trim(),
        torque: safeParseFloat(item['额定扭矩(kN.m)'] || item.torque),
        maxSpeed: safeParseFloat(item['最高转速(r/min)'] || item.maxSpeed),
        weight: safeParseFloat(item['重量(kg)'] || item.weight),
        price: basePrice,
        basePrice: basePrice,
        ...(discountRate !== undefined && { discountRate }),
        ...(factoryPrice > 0 && { factoryPrice }),
        marketPrice: safeParseFloat(item['市场价'] || item.marketPrice)
    };
     if (!processed.model || processed.torque <= 0 || processed.price <= 0) {
          console.warn(`Excel导入：联轴器数据无效或不完整: ${processed.model || JSON.stringify(item)}`);
          return null;
     }
    return processed;
  }).filter(Boolean);
};

// Process pump data from a sheet
const processPumpData = (jsonData) => {
   return jsonData.map(item => {
     const basePrice = safeParseFloat(item['成本价'] || item.price || item.basePrice);
     const discountRate = item['下浮率(%)'] !== undefined ? safeParseFloat(item['下浮率(%)']) : undefined;
     const factoryPrice = safeParseFloat(item['出厂价'] || item.factoryPrice);

    const processed = {
        model: String(item['型号'] || item.model || '').trim(),
        flow: safeParseFloat(item['流量(m³/h)'] || item.flow),
        pressure: safeParseFloat(item['压力(MPa)'] || item.pressure),
        motorPower: safeParseFloat(item['电机功率(kW)'] || item.motorPower),
        weight: safeParseFloat(item['重量(kg)'] || item.weight),
        price: basePrice,
        basePrice: basePrice,
        ...(discountRate !== undefined && { discountRate }),
        ...(factoryPrice > 0 && { factoryPrice }),
        marketPrice: safeParseFloat(item['市场价'] || item.marketPrice)
    };
     if (!processed.model || processed.flow <= 0 || processed.price <= 0) {
         console.warn(`Excel导入：备用泵数据无效或不完整: ${processed.model || JSON.stringify(item)}`);
         return null;
     }
    return processed;
  }).filter(Boolean);
};