// src/utils/gearboxDataUpdater.js
// 导入价格计算函数
import { calculateFactoryPrice, getDiscountRate } from './priceDiscount';
function updateHCGearboxes(data) {
  const hcGearboxes = data.hcGearboxes || [];
  
  // 添加HCD1580型号数据
  const hcd1580Data = {
    model: 'HCD1580',
    inputSpeed: 1650,
    ratios: [3.5, 3.83, 4.04, 4.27, 4.32, 4.52, 4.8, 5.05, 5.5, 5.86],
    power: {
      standard: 1.23,
      special: 1.045  // 5.86减速比时的传递能力
    },
    ratedThrust: 200,  // 额定推力 kN
    centerDistance: 485,  // 中心距 mm
    dimensions: {
      length: 1260,
      width: 1380,
      height: 1360
    },
    weight: 2800,  // 净重 kg
    operationMode: ['推拉软轴', '电控', '气控'],
    engineConnection: '接主机飞轮',
    sealConnection: '无罩壳',
    rotationDirection: '相反',
    factoryPrice: 125000,  // 出厂价 12.5万
    marketPrice: 137500    // 市场价按出厂价+10%计算
  };

  return {
    ...data,
    hcGearboxes: hcGearboxes.map(gearbox => {
      if (gearbox.model === 'HCD1580') {
        return {
          ...gearbox,
          ...hcd1580Data
        };
      }
      if (gearbox.marketPrice && gearbox.factoryPrice) {
        return {
          ...gearbox,
          marketPrice: Math.round(gearbox.factoryPrice * 1.1)  // 统一使用出厂价+10%
        };
      }
      return gearbox;
    })
  };
}

function updateGWGearboxes(data) {
  const gwGearboxes = data.gwGearboxes || [];
  return {
    ...data,
    gwGearboxes: gwGearboxes.map(gearbox => {
      if (gearbox.marketPrice && gearbox.factoryPrice) {
        return {
          ...gearbox,
          marketPrice: Math.round(gearbox.factoryPrice * 1.1),  // 统一使用出厂价+10%
          priceWarning: false
        };
      }
      return gearbox;
    })
  };
}

function updateDTGearboxes(data) {
  const dtGearboxes = data.dtGearboxes || [];
  return {
    ...data,
    dtGearboxes: dtGearboxes.map(gearbox => {
      if (gearbox.marketPrice && gearbox.factoryPrice) {
        return {
          ...gearbox,
          marketPrice: Math.round(gearbox.factoryPrice * 1.1)  // 统一使用出厂价+10%
        };
      }
      return gearbox;
    })
  };
}

// 齿轮箱与高弹性联轴器配套关系映射
const gearboxCouplingMap = {
  '300': 'HGTHT4',
  '400': 'HGTHT4.5',
  'HCT400': 'HGTHT5',
  '600': 'HGTHT6.3A',
  '800': 'HGTHT8.6',
  '1000': 'HGTHB5',  // 带章壳时默认HGTHJB5
  '1100': 'HGTHB6.3A',  // 带章壳时默认HGTHJB6.3A
  '1200': 'HGTHB6.3A',  // 带章壳时默认HGTHJB6.3A
  'HCT1200/1': 'HGTHB6.3A',  // 带章壳时默认HGTHJB6.3A
  '1400': 'HGTHB8',
  '1600': 'HGTHB10',
  '2000': 'HGTHB12.5',
  '2700': 'HGT3020',  // 其中T2700采用HGT3020
  'T2700': 'HGT3020'
};

// HGT系列高弹性联轴器数据 (修正了HGT6320型号的扭矩值)
const hgtSeriesData = {
  'HGT1020': { torque: 10, factoryPrice: 11000, marketPrice: 12100, weight: 280, springSet: { price: 4100, weight: 33 }, plateSet: { price: 1300, weight: 4.8 } },
  'HGT1220': { torque: 12.5, factoryPrice: 13000, marketPrice: 14300, weight: 340, springSet: { price: 4600, weight: 38 }, plateSet: { price: 1400, weight: 5.7 } },
  'HGT1620': { torque: 16, factoryPrice: 15400, marketPrice: 16940, weight: 400, springSet: { price: 5000, weight: 46 }, plateSet: { price: 1600, weight: 6.9 } },
  'HGT2020': { torque: 20, factoryPrice: 18500, marketPrice: 20350, weight: 480, springSet: { price: 5500, weight: 57 }, plateSet: { price: 1750, weight: 7.5 } },
  'HGT2520': { torque: 25, factoryPrice: 22000, marketPrice: 24200, weight: 540, springSet: { price: 6100, weight: 73 }, plateSet: { price: 1950, weight: 8.3 } },
  'HGT3020': { torque: 31.5, factoryPrice: 25000, marketPrice: 27500, weight: 600, springSet: { price: 7200, weight: 93 }, plateSet: { price: 2300, weight: 10.8 } },
  'HGT4020': { torque: 40, factoryPrice: 29500, marketPrice: 32450, weight: 720, springSet: { price: 8800, weight: 114 }, plateSet: { price: 2600, weight: 12.9 } },
  'HGT5020': { torque: 50, factoryPrice: 37400, marketPrice: 41140, weight: 900, springSet: { price: 11400, weight: 141 }, plateSet: { price: 3000, weight: 15.3 } },
  'HGT6320': { torque: 63, factoryPrice: 47000, marketPrice: 51700, weight: 1100, springSet: { price: 14300, weight: 174 }, plateSet: { price: 3950, weight: 17.7 } }, // 修正扭矩值
  'HGTHT4': { type: 'HGTHT', series: '4', factoryPrice: 11000 },
  'HGTHT4.5': { type: 'HGTHT', series: '4.5', factoryPrice: 13000 },
  'HGTHT5': { type: 'HGTHT', series: '5', factoryPrice: 15400 },
  'HGTHT6.3A': { type: 'HGTHT', series: '6.3A', factoryPrice: 25000 },
  'HGTHT8.6': { type: 'HGTHT', series: '8.6', factoryPrice: 29500 },
  'HGTHB5': { type: 'HGTHB', series: '5', factoryPrice: 37400 },
  'HGTHB6.3A': { type: 'HGTHB', series: '6.3A', factoryPrice: 47000 },
  'HGTHB8': { type: 'HGTHB', series: '8', factoryPrice: 58000 },
  'HGTHB10': { type: 'HGTHB', series: '10', factoryPrice: 71500 },
  'HGTHB12.5': { type: 'HGTHB', series: '12.5', factoryPrice: 85800 },
  'HGTHB16': { type: 'HGTHB', series: '16', factoryPrice: 118000 },
  'HGTHJB5': { type: 'HGTHJB', series: '5', factoryPrice: 37400 },
  'HGTHJB6.3A': { type: 'HGTHJB', series: '6.3A', factoryPrice: 47000 },
  'HGHQT12101W': { type: 'HGHQT', series: '12101W', factoryPrice: 85800 }
};

// 更新高弹配套关系检查函数
function checkCouplingMatch(gearboxModel, couplingModel) {
  // 获取齿轮箱系列
  let series = gearboxModel;
  if (gearboxModel.startsWith('HC')) {
    series = gearboxModel;  // 对于特殊型号，直接使用完整型号
  } else {
    // 提取系列号
    const match = gearboxModel.match(/\d+/);
    if (match) {
      series = match[0];
    }
  }

  // 获取推荐的联轴器型号
  const recommendedCoupling = gearboxCouplingMap[series];
  
  // 特殊情况处理
  if (series === '1000' && couplingModel === 'HGTHJB5') {
    return true;  // 带章壳时允许使用HGTHJB5
  }
  if ((series === '1100' || series === '1200' || series === 'HCT1200/1') && 
      couplingModel === 'HGTHJB6.3A') {
    return true;  // 带章壳时允许使用HGTHJB6.3A
  }
  if (series === '1100' || series === '1200') {
    // 1100、1200系列特殊处理
    if (couplingModel === 'HGHQT12101W') {
      return false;  // 带章时不选此款
    }
  }

  return couplingModel === recommendedCoupling;
}

function updateFlexibleCouplings(data) {
  const flexibleCouplings = data.flexibleCouplings || [];
  
  // 更新联轴器数据时添加配套关系验证
  const updatedCouplings = flexibleCouplings.map(coupling => {
    if (coupling.model && coupling.model.startsWith('HGT')) {
      const hgtData = hgtSeriesData[coupling.model];
      if (hgtData) {
        // 验证并修正扭矩值
        let torque = hgtData.torque;
        if (torque < 1 && coupling.model.includes('HGT')) {
          // 如果扭矩值异常小，可能是单位错误，尝试修正
          console.warn(`联轴器 ${coupling.model} 扭矩值(${torque})可能有误，尝试修正`);
          torque = torque * 1000;
        }
        
        return {
          ...coupling,
          ...hgtData,
          torque: torque, // 使用验证后的扭矩值
          type: 'HGT',
          validated: true,
          marketPrice: Math.round(hgtData.factoryPrice * 1.1),  // 统一使用出厂价+10%
          compatibleGearboxes: Object.entries(gearboxCouplingMap)
            .filter(([_, couplingModel]) => couplingModel === coupling.model)
            .map(([gearboxSeries]) => gearboxSeries)
        };
      }
    }
    return coupling;
  });

  return {
    ...data,
    flexibleCouplings: updatedCouplings
  };
}

// 添加备用泵更新函数
function updateBackupPumps(data) {
  const backupPumps = data.backupPumps || [];
  return {
    ...data,
    backupPumps: backupPumps.map(pump => {
      if (pump.model === 'PUMP-200') {
        return {
          ...pump,
          flowRate: pump.flowRate || 100,
          pressure: pump.pressure || 10,
          motorPower: pump.motorPower || 5.5,
          marketPrice: Math.round(pump.factoryPrice * 1.1)  // 统一使用出厂价+10%
        };
      }
      return pump;
    })
  };
}

// 价格计算函数 - 修正版
function calculatePrices(components) {
  const prices = {
    gearbox: 0,
    coupling: 0,
    pump: 0,
    total: 0
  };

  // 计算齿轮箱价格
  if (components.gearbox) {
    prices.gearbox = components.gearbox.factoryPrice || 0;
    prices.gearbox = Math.round(prices.gearbox * 1.1); // 市场价 = 出厂价 + 10%
  }

  // 计算联轴器价格
  if (components.coupling) {
    prices.coupling = components.coupling.factoryPrice || 0;
    prices.coupling = Math.round(prices.coupling * 1.1);
  }

  // 计算备用泵价格
  if (components.pump) {
    prices.pump = components.pump.factoryPrice || 0;
    prices.pump = Math.round(prices.pump * 1.1);
  }

  // 计算总价
  prices.total = prices.gearbox + prices.coupling + prices.pump;

  return prices;
}

// 更新选型结果的价格信息 - 修正版
function updateSelectionPrices(selection) {
  if (!selection) return null;

  // 为每个组件确保基本价格字段存在并计算工厂价和市场价
  const processComponentPrices = (component) => {
    if (!component) return null;
    
    // 确保基本价格存在
    const basePrice = component.basePrice || component.price || 0;
    // 确保折扣率存在，如果没有就调用 getDiscountRate 函数
    const discountRate = component.discountRate !== undefined ? 
                         component.discountRate : 
                         (typeof getDiscountRate === 'function' ? getDiscountRate(component.model) : 0.1);
    // 计算工厂价(如果不存在)
    const factoryPrice = component.factoryPrice || 
                        (typeof calculateFactoryPrice === 'function' ? 
                         calculateFactoryPrice({...component, basePrice, discountRate}) : 
                         Math.round(basePrice * (1 - discountRate)));
    // 计算市场价(统一使用工厂价+10%)
    const marketPrice = component.marketPrice || Math.round(factoryPrice * 1.1);
    
    return {...component, basePrice, discountRate, factoryPrice, marketPrice};
  };

  // 获取高弹性联轴器数据
  let couplingData = null;
  if (selection.coupling?.model) {
    // 检查联轴器扭矩值是否合理
    if (selection.coupling.torque < 1 && selection.coupling.model.includes('HGT')) {
      // 如果扭矩值异常小，可能是单位错误，尝试修正
      console.warn(`联轴器 ${selection.coupling.model} 扭矩值(${selection.coupling.torque})可能有误，尝试修正`);
      selection.coupling.torque = selection.coupling.torque * 1000;
    }
    
    // 获取标准数据
    const hgtData = hgtSeriesData[selection.coupling.model];
    if (hgtData && hgtData.factoryPrice) {
      couplingData = {
        ...selection.coupling,
        ...hgtData,
        marketPrice: Math.round(hgtData.factoryPrice * 1.1)
      };
    } else {
      // 如果数据不完整，保留原始coupling数据或设置默认值
      couplingData = selection.coupling;
      console.warn(`联轴器数据或工厂价缺失，型号: ${selection.coupling.model}`);
    }
  }

  // 获取备用泵数据
  let pumpData = null;
  if (selection.pump?.model === 'PUMP-200') {
    const factoryPrice = selection.pump.factoryPrice || 8500; // 使用现有价格或默认值
    pumpData = {
      ...selection.pump,
      flowRate: selection.pump.flowRate || 100,
      pressure: selection.pump.pressure || 10,
      motorPower: selection.pump.motorPower || 5.5,
      factoryPrice: factoryPrice, // 使用备用泵出厂价
      marketPrice: Math.round(factoryPrice * 1.1) // 市场价按出厂价+10%计算
    };
  }

  // 处理每个组件
  const updatedGearbox = processComponentPrices(selection.gearbox);
  const updatedCoupling = processComponentPrices(couplingData || selection.coupling);
  const updatedPump = processComponentPrices(pumpData || selection.pump);
  
  // 计算总价
  const totalPrice = (updatedGearbox?.marketPrice || 0) + 
                     (updatedCoupling?.marketPrice || 0) + 
                     (updatedPump?.marketPrice || 0);

  return {
    ...selection,
    gearbox: updatedGearbox,
    coupling: updatedCoupling,
    pump: updatedPump,
    prices: {
      total: totalPrice,
      details: {
        gearbox: {
          factoryPrice: updatedGearbox?.factoryPrice || 0,
          marketPrice: updatedGearbox?.marketPrice || 0
        },
        coupling: {
          factoryPrice: updatedCoupling?.factoryPrice || 0,
          marketPrice: updatedCoupling?.marketPrice || 0
        },
        pump: {
          factoryPrice: updatedPump?.factoryPrice || 0,
          marketPrice: updatedPump?.marketPrice || 0
        }
      }
    }
  };
}

// 主更新函数
function updateGearboxData(appData) {
  // 深拷贝输入数据以避免直接修改
  const newData = JSON.parse(JSON.stringify(appData));
  
  // 顺序执行更新
  let result = updateHCGearboxes(newData);
  result = updateGWGearboxes(result);
  result = updateDTGearboxes(result);
  result = updateFlexibleCouplings(result);
  result = updateBackupPumps(result);
  
  // 更新选型结果的价格
  if (newData.currentSelection) {
    result.currentSelection = updateSelectionPrices(newData.currentSelection);
  }
  
  return result;
}

// 导出更新函数
export { 
  updateGearboxData,
  calculatePrices,
  updateSelectionPrices,
  checkCouplingMatch
};