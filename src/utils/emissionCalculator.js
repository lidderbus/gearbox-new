/**
 * 碳排放计算器
 * Carbon Emission Calculator
 *
 * 创建日期: 2026-01-04
 *
 * 功能:
 *   - 燃油消耗计算
 *   - CO2/NOx/SOx/PM排放计算
 *   - 年度排放报告
 *   - 减排效益评估
 *   - 碳足迹计算
 */

import { CARBON_FACTORS, SFC_REFERENCE } from './energyEfficiency';

/**
 * 其他排放物排放因子 (kg/t fuel)
 * Emission Factors for Other Pollutants
 */
export const EMISSION_FACTORS = {
  // 氮氧化物 NOx (取决于发动机类型和Tier标准)
  NOx: {
    tier1: 17.0,    // kg NOx / t fuel (pre-2000)
    tier2: 14.4,    // kg NOx / t fuel (2011-2015)
    tier3: 3.4,     // kg NOx / t fuel (2016+ in ECA)
    default: 14.4
  },
  // 硫氧化物 SOx (取决于燃油硫含量)
  SOx: {
    hfoGlobal: 10.5,    // 0.5% S (2020后全球限制)
    hfoECA: 2.1,        // 0.1% S (ECA区域)
    mgo: 2.1,           // 低硫燃油
    lng: 0,             // LNG无SOx
    default: 10.5
  },
  // 颗粒物 PM
  PM: {
    hfo: 1.5,           // kg PM / t fuel
    mdo: 0.5,
    mgo: 0.3,
    lng: 0.02,
    default: 0.8
  },
  // 一氧化碳 CO
  CO: {
    default: 7.4        // kg CO / t fuel
  },
  // 碳氢化合物 HC/VOC
  HC: {
    default: 2.7        // kg HC / t fuel
  }
};

/**
 * 碳价格参数 (USD/t CO2)
 * Carbon Price References
 */
export const CARBON_PRICES = {
  euETS: 85,            // EU ETS 2024平均价格
  china: 70,            // 中国碳市场价格 (CNY)
  imoPotential: 100,    // IMO未来可能碳税
  voluntary: 15,        // 自愿碳市场
  socialCost: 185       // 社会碳成本估算
};

/**
 * 燃油价格参考 (USD/t)
 */
export const FUEL_PRICES = {
  HFO: 450,
  LFO: 550,
  MDO: 750,
  MGO: 850,
  LNG: 600,      // 波动较大
  METHANOL: 400,
  AMMONIA: 700
};

/**
 * 计算燃油消耗
 * @param {Object} params - 参数
 * @param {number} params.power - 功率 (kW)
 * @param {number} params.sfc - 比油耗 (g/kWh)
 * @param {number} params.hours - 运行小时数
 * @param {number} params.loadFactor - 负荷率 (0-1)
 * @returns {number} 燃油消耗量 (吨)
 */
export const calculateFuelConsumption = (params) => {
  const {
    power,
    sfc = SFC_REFERENCE.mainEngine.default,
    hours,
    loadFactor = 0.75
  } = params;

  // 燃油消耗 (吨) = 功率 × 负荷率 × 比油耗 × 时间 / 1,000,000
  return (power * loadFactor * sfc * hours) / 1000000;
};

/**
 * 计算年度燃油消耗
 * @param {Object} params - 船舶参数
 * @returns {Object} 年度燃油消耗明细
 */
export const calculateAnnualFuelConsumption = (params) => {
  const {
    mainEnginePower,
    auxEnginePower,
    annualOperatingHours = 5000,
    seaHours = 4000,          // 航行小时
    portHours = 1000,         // 港口小时
    loadFactorSea = 0.75,
    loadFactorPort = 0.20,
    sfcMain = SFC_REFERENCE.mainEngine.default,
    sfcAux = SFC_REFERENCE.auxiliaryEngine.default
  } = params;

  // 辅机功率估算
  const pae = auxEnginePower || (mainEnginePower >= 10000
    ? 0.025 * mainEnginePower + 250
    : 0.05 * mainEnginePower);

  // 主机燃油消耗 (仅航行时)
  const mainEngineFuel = calculateFuelConsumption({
    power: mainEnginePower,
    sfc: sfcMain,
    hours: seaHours,
    loadFactor: loadFactorSea
  });

  // 辅机燃油消耗 (航行+港口)
  const auxEngineFuelSea = calculateFuelConsumption({
    power: pae,
    sfc: sfcAux,
    hours: seaHours,
    loadFactor: 0.5
  });

  const auxEngineFuelPort = calculateFuelConsumption({
    power: pae,
    sfc: sfcAux,
    hours: portHours,
    loadFactor: 0.3
  });

  const totalAuxFuel = auxEngineFuelSea + auxEngineFuelPort;
  const totalFuel = mainEngineFuel + totalAuxFuel;

  return {
    mainEngine: {
      power: mainEnginePower + ' kW',
      hours: seaHours + ' h',
      loadFactor: (loadFactorSea * 100) + '%',
      fuelConsumption: Math.round(mainEngineFuel * 10) / 10 + ' t'
    },
    auxEngine: {
      power: Math.round(pae) + ' kW',
      seaHours: seaHours + ' h',
      portHours: portHours + ' h',
      fuelConsumption: Math.round(totalAuxFuel * 10) / 10 + ' t'
    },
    total: {
      annualHours: annualOperatingHours + ' h',
      fuelConsumption: Math.round(totalFuel * 10) / 10 + ' t',
      fuelConsumptionRaw: totalFuel
    }
  };
};

/**
 * 计算排放量
 * @param {number} fuelConsumption - 燃油消耗量 (吨)
 * @param {string} fuelType - 燃料类型
 * @param {Object} options - 选项
 * @returns {Object} 排放量明细
 */
export const calculateEmissions = (fuelConsumption, fuelType = 'MDO', options = {}) => {
  const {
    noxTier = 'tier2',
    isECA = false
  } = options;

  // 获取碳转换系数
  const cf = CARBON_FACTORS[fuelType]?.CF || 3.206;

  // CO2排放
  const co2 = fuelConsumption * cf;

  // NOx排放
  const noxFactor = EMISSION_FACTORS.NOx[noxTier] || EMISSION_FACTORS.NOx.default;
  const nox = fuelConsumption * noxFactor / 1000; // 转换为吨

  // SOx排放
  const soxFactor = isECA
    ? EMISSION_FACTORS.SOx.hfoECA
    : EMISSION_FACTORS.SOx[fuelType === 'HFO' ? 'hfoGlobal' : 'mgo'];
  const sox = fuelConsumption * soxFactor / 1000;

  // PM排放
  const pmFactor = EMISSION_FACTORS.PM[fuelType.toLowerCase()] || EMISSION_FACTORS.PM.default;
  const pm = fuelConsumption * pmFactor / 1000;

  // CO排放
  const co = fuelConsumption * EMISSION_FACTORS.CO.default / 1000;

  // HC排放
  const hc = fuelConsumption * EMISSION_FACTORS.HC.default / 1000;

  return {
    fuelConsumption: Math.round(fuelConsumption * 10) / 10,
    fuelType: CARBON_FACTORS[fuelType]?.name || fuelType,
    emissions: {
      CO2: { value: Math.round(co2 * 10) / 10, unit: 't' },
      NOx: { value: Math.round(nox * 100) / 100, unit: 't' },
      SOx: { value: Math.round(sox * 100) / 100, unit: 't' },
      PM: { value: Math.round(pm * 1000) / 1000, unit: 't' },
      CO: { value: Math.round(co * 100) / 100, unit: 't' },
      HC: { value: Math.round(hc * 100) / 100, unit: 't' }
    },
    factors: {
      cf: cf + ' t CO₂/t fuel',
      noxTier,
      isECA
    }
  };
};

/**
 * 计算碳足迹
 * @param {number} co2Emissions - CO2排放量 (吨)
 * @param {number} distance - 航行距离 (海里)
 * @param {number} cargo - 货运量 (吨)
 * @returns {Object} 碳足迹指标
 */
export const calculateCarbonFootprint = (co2Emissions, distance, cargo) => {
  // 每海里碳排放
  const co2PerNm = co2Emissions / distance;

  // 每吨货物每海里碳排放
  const co2PerTonNm = co2Emissions / (cargo * distance) * 1000000; // g CO2/t·nm

  // 每吨货物碳排放
  const co2PerTon = co2Emissions / cargo;

  return {
    total: {
      value: Math.round(co2Emissions * 10) / 10,
      unit: 't CO₂'
    },
    perDistance: {
      value: Math.round(co2PerNm * 100) / 100,
      unit: 't CO₂/nm'
    },
    perCargoDistance: {
      value: Math.round(co2PerTonNm * 100) / 100,
      unit: 'g CO₂/t·nm'
    },
    perCargo: {
      value: Math.round(co2PerTon * 1000) / 1000,
      unit: 't CO₂/t cargo'
    }
  };
};

/**
 * 计算碳成本
 * @param {number} co2Emissions - CO2排放量 (吨)
 * @param {string} scheme - 碳定价机制
 * @returns {Object} 碳成本估算
 */
export const calculateCarbonCost = (co2Emissions, scheme = 'euETS') => {
  const prices = {};

  Object.entries(CARBON_PRICES).forEach(([key, price]) => {
    prices[key] = {
      price: price + ' USD/t',
      cost: Math.round(co2Emissions * price),
      unit: 'USD'
    };
  });

  const primaryCost = co2Emissions * CARBON_PRICES[scheme];

  return {
    co2Emissions: co2Emissions + ' t',
    scheme,
    primaryCost: {
      value: Math.round(primaryCost),
      unit: 'USD'
    },
    allSchemes: prices
  };
};

/**
 * 计算减排效益
 * @param {Object} baseline - 基准排放
 * @param {Object} improved - 改进后排放
 * @returns {Object} 减排效益
 */
export const calculateEmissionReduction = (baseline, improved) => {
  const co2Reduction = baseline.co2 - improved.co2;
  const reductionPercent = (co2Reduction / baseline.co2) * 100;

  // 碳成本节省
  const carbonCostSaved = co2Reduction * CARBON_PRICES.euETS;

  // 燃油成本节省
  const fuelReduction = baseline.fuel - improved.fuel;
  const fuelCostSaved = fuelReduction * FUEL_PRICES.MDO;

  return {
    emission: {
      co2Reduction: Math.round(co2Reduction * 10) / 10 + ' t',
      reductionPercent: Math.round(reductionPercent * 10) / 10 + '%'
    },
    cost: {
      carbonCostSaved: Math.round(carbonCostSaved) + ' USD',
      fuelCostSaved: Math.round(fuelCostSaved) + ' USD',
      totalSaved: Math.round(carbonCostSaved + fuelCostSaved) + ' USD'
    },
    environmental: {
      treesEquivalent: Math.round(co2Reduction / 0.022), // 1棵树年吸收约22kg CO2
      carsEquivalent: Math.round(co2Reduction / 4.6)     // 1辆车年排放约4.6t CO2
    }
  };
};

/**
 * 比较不同燃料的排放
 * @param {number} power - 功率 (kW)
 * @param {number} hours - 运行小时
 * @returns {Object} 燃料比较
 */
export const compareFuelEmissions = (power, hours) => {
  const fuelTypes = ['HFO', 'MDO', 'MGO', 'LNG', 'METHANOL', 'AMMONIA'];
  const results = {};

  fuelTypes.forEach(fuelType => {
    // 不同燃料的SFC略有不同
    const sfcMultiplier = {
      HFO: 1.0,
      MDO: 1.0,
      MGO: 1.0,
      LNG: 0.85,      // LNG效率更高
      METHANOL: 1.8,  // 甲醇热值低，消耗更多
      AMMONIA: 2.2    // 氨热值最低
    };

    const baseSfc = SFC_REFERENCE.mainEngine.default;
    const sfc = baseSfc * (sfcMultiplier[fuelType] || 1.0);

    const fuel = calculateFuelConsumption({ power, sfc, hours, loadFactor: 0.75 });
    const emissions = calculateEmissions(fuel, fuelType);

    results[fuelType] = {
      name: CARBON_FACTORS[fuelType]?.name || fuelType,
      fuelConsumption: Math.round(fuel * 10) / 10 + ' t',
      co2: emissions.emissions.CO2.value + ' t',
      nox: emissions.emissions.NOx.value + ' t',
      sox: emissions.emissions.SOx.value + ' t',
      pm: emissions.emissions.PM.value + ' t',
      fuelCost: Math.round(fuel * (FUEL_PRICES[fuelType] || 700)) + ' USD',
      carbonCost: Math.round(emissions.emissions.CO2.value * CARBON_PRICES.euETS) + ' USD'
    };
  });

  return results;
};

/**
 * 生成年度排放报告
 * @param {Object} params - 船舶和运营参数
 * @returns {Object} 年度排放报告
 */
export const generateAnnualEmissionReport = (params) => {
  const {
    shipName = '未命名船舶',
    mainEnginePower,
    auxEnginePower,
    fuelType = 'MDO',
    annualOperatingHours = 5000,
    annualDistance = 50000,      // 海里
    cargoCapacity = 10000,       // DWT
    averageCargoLoad = 0.8,      // 平均载货率
    noxTier = 'tier2'
  } = params;

  // 计算年度燃油消耗
  const fuelConsumption = calculateAnnualFuelConsumption({
    mainEnginePower,
    auxEnginePower,
    annualOperatingHours
  });

  // 计算排放
  const emissions = calculateEmissions(
    fuelConsumption.total.fuelConsumptionRaw,
    fuelType,
    { noxTier }
  );

  // 碳足迹
  const carbonFootprint = calculateCarbonFootprint(
    emissions.emissions.CO2.value,
    annualDistance,
    cargoCapacity * averageCargoLoad
  );

  // 碳成本
  const carbonCost = calculateCarbonCost(emissions.emissions.CO2.value, 'euETS');

  // 燃料成本
  const fuelCost = fuelConsumption.total.fuelConsumptionRaw * (FUEL_PRICES[fuelType] || 750);

  // 燃料比较
  const fuelComparison = compareFuelEmissions(mainEnginePower, annualOperatingHours * 0.8);

  return {
    metadata: {
      reportDate: new Date().toISOString().split('T')[0],
      reportYear: new Date().getFullYear(),
      shipName
    },
    specifications: {
      mainEnginePower: mainEnginePower + ' kW',
      fuelType: CARBON_FACTORS[fuelType]?.name || fuelType,
      annualOperatingHours: annualOperatingHours + ' h',
      annualDistance: annualDistance + ' nm',
      cargoCapacity: cargoCapacity + ' DWT'
    },
    fuelConsumption,
    emissions,
    carbonFootprint,
    costs: {
      fuel: {
        price: FUEL_PRICES[fuelType] + ' USD/t',
        annual: Math.round(fuelCost) + ' USD'
      },
      carbon: carbonCost
    },
    fuelComparison,
    summary: {
      totalCO2: emissions.emissions.CO2.value + ' t',
      carbonIntensity: carbonFootprint.perCargoDistance.value + ' g CO₂/t·nm',
      totalFuelCost: Math.round(fuelCost) + ' USD',
      totalCarbonCost: carbonCost.primaryCost.value + ' USD',
      totalOperatingCost: Math.round(fuelCost + carbonCost.primaryCost.value) + ' USD'
    }
  };
};

export default {
  EMISSION_FACTORS,
  CARBON_PRICES,
  FUEL_PRICES,
  calculateFuelConsumption,
  calculateAnnualFuelConsumption,
  calculateEmissions,
  calculateCarbonFootprint,
  calculateCarbonCost,
  calculateEmissionReduction,
  compareFuelEmissions,
  generateAnnualEmissionReport
};
