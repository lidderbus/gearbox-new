// src/data/packagePriceConfig.js
/**
 * GW系列市场常规打包价格表配置
 * 该配置定义了特定型号齿轮箱的打包价格策略
 */

// GW系列市场常规打包价格配置
export const gwPackagePriceConfigs = [
  {
    gearboxModel: 'GWC42.45',
    recommendedCoupling: 'HGT3020 IIID',
    recommendedPump: '2CY7.5/2.5D',
    packagePrice: 180000, // 18万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC45.49',
    recommendedCoupling: 'HGT4020 IIID',
    recommendedPump: '2CY7.5/2.5D',
    packagePrice: 275000, // 27.5万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC45.52',
    recommendedCoupling: 'HGT4020 IIID',
    recommendedPump: '2CY7.5/2.5D',
    packagePrice: 330000, // 33万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC49.54',
    recommendedCoupling: 'HGT4020 IIID',
    recommendedPump: '2CY14.2/2.5D',
    packagePrice: 385000, // 38.5万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC49.59',
    recommendedCoupling: 'HGT5020 IIID',
    recommendedPump: '2CY14.2/2.5D',
    packagePrice: 430000, // 43万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC52.59',
    recommendedCoupling: 'HGT5020 IIID',
    recommendedPump: '2CY14.2/2.5D',
    packagePrice: 510000, // 51万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC52.62',
    recommendedCoupling: 'HGT5020 IIID',
    recommendedPump: '2CY14.2/2.5D',
    packagePrice: 530000, // 53万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC60.66',
    recommendedCoupling: 'HGT6320 IIID',
    recommendedPump: '2CY19.2/2.5D',
    packagePrice: 720000, // 72万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC60.74',
    recommendedCoupling: 'HGT6320 IIID',
    recommendedPump: '2CY19.2/2.5D',
    packagePrice: 820000, // 82万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC63.71',
    recommendedCoupling: 'HGT6320 IIID',
    recommendedPump: '2CY24.8/2.5D',
    packagePrice: 860000, // 86万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC66.75',
    recommendedCoupling: 'HGT8020 IIID',
    recommendedPump: '2CY24.8/2.5D',
    packagePrice: 960000, // 96万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC70.76',
    recommendedCoupling: 'HGT10020 IIID',
    recommendedPump: '2CY24.8/2.5D',
    packagePrice: 1050000, // 105万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC70.82',
    recommendedCoupling: 'HGT10020 IIID',
    recommendedPump: '2CY24.8/2.5D',
    packagePrice: 1120000, // 112万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC70.85',
    recommendedCoupling: 'HGT12520 IIID',
    recommendedPump: '2CY24.8/2.5D',
    packagePrice: 1420000, // 142万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC75.90',
    recommendedCoupling: 'HGT12520 IIID',
    recommendedPump: '2CY24.8/2.5D',
    packagePrice: 1490000, // 149万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC78.88',
    recommendedCoupling: 'HGT12520 IIID',
    recommendedPump: '2CY24.8/2.5D',
    packagePrice: 1520000, // 152万
    effectiveDate: new Date('2025-03-07')
  },
  {
    gearboxModel: 'GWC78.96',
    recommendedCoupling: 'HGT12520 IIID',
    recommendedPump: '2CY24.8/2.5D',
    packagePrice: 1630000, // 163万
    effectiveDate: new Date('2025-03-07')
  }
];

/**
 * 获取GW系列齿轮箱的打包价格配置
 * @param {string} gearboxModel - 齿轮箱型号
 * @returns {Object|null} - 打包价格配置或null
 */
export const getGWPackagePriceConfig = (gearboxModel) => {
  if (!gearboxModel) return null;
  
  // 标准化型号格式
  const normalizedModel = gearboxModel.toUpperCase().trim();
  
  // 查找匹配的配置
  const config = gwPackagePriceConfigs.find(
    c => normalizedModel === c.gearboxModel.toUpperCase()
  );
  
  // 找到匹配配置，直接返回
  if (config) {
    return config;
  }
  
  // 检查GWS系列 - 在GWC基础上下浮3%
  if (normalizedModel.startsWith('GWS')) {
    const gwcModel = 'GWC' + normalizedModel.substring(3);
    const gwcConfig = gwPackagePriceConfigs.find(
      c => gwcModel.toUpperCase() === c.gearboxModel.toUpperCase()
    );
    
    if (gwcConfig) {
      return {
        ...gwcConfig,
        gearboxModel: normalizedModel,
        packagePrice: Math.round(gwcConfig.packagePrice * 0.97), // 下浮3%
        isGWSVariant: true
      };
    }
  }
  
  // 检查小型号特殊政策 (GW39.41及以下)
  if (normalizedModel.startsWith('GW')) {
    // 提取型号中的数字部分进行比较
    const modelNumber = extractModelNumber(normalizedModel);
    if (modelNumber <= 39.41) {
      return {
        gearboxModel: normalizedModel,
        isSmallGWModel: true,
        effectiveDate: new Date('2025-03-07')
        // 小型号需要严格按照销售政策，不使用打包价
      };
    }
  }
  
  return null;
};

// 辅助函数：从型号中提取数值部分
const extractModelNumber = (model) => {
  const matches = model.match(/GW[CS]?(\d+\.\d+)/i);
  return matches ? parseFloat(matches[1]) : 999; // 默认返回一个大数值
};

/**
 * 检查组件组合是否符合打包价格要求
 * @param {Object} gearbox - 齿轮箱对象
 * @param {Object} coupling - 联轴器对象
 * @param {Object} pump - 备用泵对象
 * @param {Object} config - 打包价格配置
 * @returns {boolean} - 是否符合打包价格条件
 */
export const checkPackageMatch = (gearbox, coupling, pump, config) => {
  if (!gearbox || !config) return false;
  
  // 检查执行日期
  const currentDate = new Date();
  if (currentDate < config.effectiveDate) {
    console.log(`打包价格未生效, 当前: ${currentDate}, 生效: ${config.effectiveDate}`);
    return false;
  }
  
  // 小型号特殊政策，不使用打包价
  if (config.isSmallGWModel) return false;
  
  // 检查齿轮箱型号是否匹配
  if (gearbox.model.toUpperCase() !== config.gearboxModel.toUpperCase()) return false;
  
  // 联轴器检查 - 允许部分匹配
  let couplingMatch = !coupling || !config.recommendedCoupling; // 没有配置时默认匹配
  if (coupling && config.recommendedCoupling) {
    const couplingPrefix = config.recommendedCoupling.split(' ')[0].toUpperCase();
    couplingMatch = coupling.model && 
                   coupling.model.toUpperCase().includes(couplingPrefix);
  }
  
  // 备用泵检查 - 允许部分匹配
  let pumpMatch = !pump || !config.recommendedPump; // 没有配置时默认匹配
  if (pump && config.recommendedPump) {
    const pumpPrefix = config.recommendedPump.split('/')[0].toUpperCase();
    pumpMatch = pump.model && 
               pump.model.toUpperCase().includes(pumpPrefix);
  }
  
  return couplingMatch && pumpMatch;
};