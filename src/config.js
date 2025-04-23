// src/config.js

export const APP_DATA_VERSION = 2; // 应用程序数据版本号

export const DEFAULTS = {
    gearbox: {
        efficiency: 0.97, // 默认效率
        inputSpeedRange: [500, 2500], // 默认输入转速范围
        ratios: [1.5, 2.0, 2.5, 3.0, 3.5], // 默认减速比列表
        thrust: 0, // 默认推力
        centerDistance: 0, // 默认中心距
        weight: 50, // 默认重量
        transferCapacity: 0.1, // 默认传递能力 (per ratio)
         model: 'DEFAULT_GEARBOX', // 用于校验中的默认项目标识
    },
    coupling: {
        torque: 1.0, // 默认额定扭矩 (kN.m)
        maxTorque: 2.5, // 默认最大扭矩 (kN.m) - 基于额定扭矩 * 2.5
        maxSpeed: 3000, // 默认最高转速 (rpm)
        weight: 50, // 默认重量 (kg)
        priceFactor: 1.1, // 默认价格系数 (用于计算市场价)
         model: 'DEFAULT_COUPLING', // 用于校验中的默认项目标识
    },
    sparePump: {
        flow: 10.0, // 默认流量 (L/min)
        pressure: 2.5, // 默认压力 (MPa)
        motorPower: 2.2, // 默认电机功率 (kW)
        weight: 30, // 默认重量 (kg)
        price: 8000, // 默认价格 (元)
         model: 'DEFAULT_PUMP', // 用于校验中的默认项目标识
    },
    highElastic: {
        priceFactor: 1.2, // 高弹性联轴器价格加价系数
    },
    // 其他默认配置...
};

// 市场价乘数
export const MARKET_PRICE_MULTIPLIER = 1.1;

// 折扣率默认值（如果数据中没有）
export const DEFAULT_DISCOUNT_RATE = 0.10;

// 其他配置项...