// src/utils/seriesDefaultParams.js
/**
 * 各系列齿轮箱默认参数配置
 * 用于技术协议生成时自动填入标准参数
 *
 * 数据来源：实际技术协议文档归档
 * - DT系列：DT770电推齿轮箱技术协议-20251211.doc
 * - HC系列：HC系列订货技术协议（2025版）
 * - GWC系列：GWC系列订货技术协议
 * - HCT系列：HCT系列技术协议
 */

// DT系列默认参数 (电推齿轮箱)
export const dtSeriesDefaults = {
  // 基本功能描述
  gearboxFunction: '减速、承受螺旋桨推力',
  transmissionType: '圆柱斜齿轮传动',
  clutchType: '无离合器（电推专用）',
  inputCouplingType: '高弹性联轴器',

  // 润滑系统参数
  lubricationOilPressure: '0.1～0.4',
  maxOilTemperature: 75,
  oilGrade: 'CD40',
  workingOilPressure: '-', // 电推无工作油压

  // 冷却系统参数
  coolingWaterInletTemperature: 32,
  coolingWaterPressure: 0.35,
  minCoolingWaterFlow: 2, // t/h

  // 性能参数
  mechanicalEfficiency: 98,
  outputDirection: '相反',

  // 安装参数
  longitudinalInclination: 10,
  transverseInclination: 15,
  longitudinalShaking: 7.5,
  transverseShaking: 22.5,
  installationMethod: '电机、齿轮箱为刚性安装，齿轮箱与电机连接方式为高弹性联轴器',

  // 环境条件
  storageTemperature: '-15°C ~ +45°C',
  operatingTemperature: '-15°C ~ +45°C',
  seawaterTemperature: '-1°C ~ +32°C',
  relativeHumidity: '+35°C, 90%',
  workingInclination: '纵倾10°、横倾15°',

  // 维护参数
  overhaulTime: 10000,
  nameplateSpecification: '不锈钢，黑底白字阳文，中英文对照',

  // 仪表与报警
  instrumentsAndAlarms: '润滑油压表、润滑油温表各1只；润滑油低压报警、油温高报警控制器各1只',

  // 联轴器
  couplingManufacturer: '杭州前进联轴器有限公司',
  couplingConnections: '是',

  // 电动滑油泵参数（DT系列特有）
  oilPumpModel: '2CYA-1.1/0.8D(TS11)',
  oilPumpFlowRate: 1.1,
  oilPumpPower: 0.55,
  oilPumpVoltage: 'AC380V/50Hz',
  oilPumpProtection: 'IP44',
  oilPumpInsulation: 'F级',
  lubricationOilPump: '一台/齿轮箱',

  // 法规与规范
  regulations: [
    '中国船级社《钢质内河船舶建造规范》（2016年版）及有关修改通报',
    '中华人民共和国海事局《船舶与海上设施法定检验规则—内河船舶法定检验技术规则》（2019年版）及其修改和变更通报',
    '中国船级社《材料与焊接规范》（2021年版）及修改和变更通报'
  ],

  // 质量保证参数
  approvalPeriod: 10,
  feedbackPeriod: 10,
  warrantyPeriod: '十二个月',

  // 供货数量
  quantity: 2,

  // 转向
  engineRotation: '顺、逆时针（双向旋转）',

  // 外观
  appearance: '杭齿灰'
};

// GWC/GWL系列默认参数 (船用推进齿轮箱)
// 数据来源：GWC25.26、GWC34.44、GWC49.48、GWC60.59技术协议
export const gwcSeriesDefaults = {
  // 基本功能描述
  gearboxFunction: '倒顺离合、减速、承受螺旋桨推力',
  transmissionType: '圆柱斜齿轮三轴五齿轮传动',
  clutchType: '液压湿式多片摩擦离合器',
  inputCouplingType: '齿形块联轴器',

  // 润滑系统参数
  lubricationOilPressure: '0.15～0.45',
  maxOilTemperature: 80,
  oilGrade: 'HC-11、HQ-10 或 SAE30',
  workingOilPressure: '1.3～1.6',

  // 冷却系统参数
  coolingWaterInletTemperature: 32,
  coolingWaterPressure: 0.35,
  minCoolingWaterFlow: 2, // t/h，最小冷却水量

  // 性能参数
  mechanicalEfficiency: 96,
  outputDirection: '相反',
  directionChangeTime: 8, // 秒，可调节

  // 安装参数
  longitudinalInclination: 10, // 纵倾
  transverseInclination: 15,   // 横倾
  longitudinalShaking: 7.5,
  transverseShaking: 22.5,
  installationMethod: '齿轮箱支架与主机底座安装在同一刚性支撑上',

  // 环境条件
  storageTemperature: '-15°C ~ +45°C',
  operatingTemperature: '-15°C ~ +45°C',
  seawaterTemperature: '-1°C ~ +32°C',
  relativeHumidity: '+35°C, 90%',
  workingInclination: '纵倾10°、横倾15°',

  // 维护参数
  overhaulTime: 10000,
  nameplateSpecification: '不锈钢，黑底白字阳文，中英文对照',

  // 控制系统
  controlType: '推拉软轴',
  controlTypeOptions: '推拉软轴/电控',

  // 仪表与报警
  instrumentsAndAlarms: '润滑油压表、润滑油温表、工作油压力表各1只；滑油低压报警、油温高报警、工作油压力低报警控制器',
  workingOilPressureAlarm: 1.1,
  lubOilPressureAlarm: 0.1,
  oilTemperatureAlarm: 75,

  // 信号输出
  signalOutput: '直流无源开关量信号',

  // 联轴器
  couplingManufacturer: '杭州前进联轴器有限公司',
  couplingConnections: '是',

  // 法规与规范（海船/内河通用）
  regulations: [
    '中国船级社《钢质海船入级规范》及修改通报',
    '中华人民共和国海事局《船舶法定检验技术规则》',
    '中国船级社《材料与焊接规范》及修改通报'
  ],

  // 内河船舶适用规范
  inlandRegulations: [
    '中国船级社《国内航行小型海船技术规则》(2024)',
    '中华人民共和国海事局《国内航行海船法定检验技术规则》(2020)'
  ],

  // 质量保证参数
  approvalPeriod: 10,
  feedbackPeriod: 10,
  warrantyPeriod: 12, // 月
  warrantyText: '船艇完工交付之日起12个月',

  // 供货数量
  quantity: 2,

  // 控制电压
  controlVoltage: 24,

  // 供货清单标准项
  deliveryItems: [
    { name: '齿轮箱', quantity: '按需' },
    { name: '工作压力表', note: '提供开关量信号' },
    { name: '正车/倒车/空车指示控制器', note: '提供开关量信号' },
    { name: '滑油低压报警/油温高报警', note: '提供开关量信号' },
    { name: '滑油冷却器', quantity: '按需' },
    { name: 'CCS证书、合格证、说明书、装箱清单', quantity: '1套' }
  ],

  // 外观
  appearance: '杭齿灰'
};

// HC/HCM系列默认参数
export const hcSeriesDefaults = {
  // 基本功能描述
  gearboxFunction: '减速、承受螺旋桨推力',
  transmissionType: '圆柱斜齿轮传动',
  clutchType: '液压湿式多片摩擦离合器',
  inputCouplingType: '高弹性联轴器',

  // 润滑系统参数
  lubricationOilPressure: '0.1～0.4',
  maxOilTemperature: 75,
  oilGrade: 'CD40',
  workingOilPressure: '1.3～1.6',

  // 冷却系统参数
  coolingWaterInletTemperature: 32,
  coolingWaterPressure: 0.35,
  minCoolingWaterFlow: 2, // t/h

  // 性能参数
  mechanicalEfficiency: 98,
  outputDirection: '相反',
  directionChangeTime: 8,

  // 安装参数
  longitudinalInclination: 10,
  transverseInclination: 15,
  longitudinalShaking: 7.5,
  transverseShaking: 22.5,
  installationMethod: '电机、齿轮箱为刚性安装，齿轮箱与电机连接方式为高弹性联轴器',

  // 环境条件
  storageTemperature: '-15°C ~ +45°C',
  operatingTemperature: '-15°C ~ +45°C',
  seawaterTemperature: '-1°C ~ +32°C',
  relativeHumidity: '+35°C, 90%',
  workingInclination: '纵倾10°、横倾15°',

  // 维护参数
  overhaulTime: 10000,
  nameplateSpecification: '不锈钢，黑底白字阳文，中英文对照',

  // 仪表与报警
  instrumentsAndAlarms: '润滑油压表、润滑油温表各1只；润滑油低压报警、油温高报警控制器各1只',

  // 联轴器
  couplingManufacturer: '杭州前进联轴器有限公司',
  couplingConnections: '是',

  // 控制系统
  controlType: '推拉软轴',
  controlTypeOptions: '推拉软轴/电控',

  // 法规与规范
  regulations: [
    '中国船级社《钢质内河船舶建造规范》及有关修改通报',
    '中华人民共和国海事局《船舶与海上设施法定检验规则》',
    '中国船级社《材料与焊接规范》及修改通报'
  ],

  // 质量保证参数
  approvalPeriod: 10,
  feedbackPeriod: 10,
  warrantyPeriod: '十二个月',

  // 供货数量
  quantity: 2,

  // 转向
  engineRotation: '顺、逆时针（双向旋转）',

  // 外观
  appearance: '杭齿灰'
};

// HCT系列默认参数 (大型拖网齿轮箱)
export const hctSeriesDefaults = {
  // 基本功能描述
  gearboxFunction: '倒顺离合、减速、承受螺旋桨推力',
  transmissionType: '圆柱斜齿轮三轴传动',
  clutchType: '液压湿式多片摩擦离合器',
  inputCouplingType: '齿形块联轴器',

  // 润滑系统参数
  lubricationOilPressure: '0.2～0.5',
  maxOilTemperature: 80,
  oilGrade: 'HC-11或HQ-10',
  workingOilPressure: '1.4～1.8',

  // 冷却系统参数
  coolingWaterInletTemperature: 32,
  coolingWaterTemperature: 32,
  coolingWaterPressure: 0.35,
  minCoolingWaterFlow: 3, // t/h

  // 性能参数
  mechanicalEfficiency: 97,
  outputDirection: '相反',
  reversalTime: 10,
  directionChangeTime: 10,

  // 安装参数
  longitudinalInclination: 10,
  transverseInclination: 15,
  longitudinalShaking: 7.5,
  transverseShaking: 22.5,

  // 环境条件
  storageTemperature: '-15°C ~ +45°C',
  operatingTemperature: '-15°C ~ +45°C',
  seawaterTemperature: '-1°C ~ +32°C',
  relativeHumidity: '+35°C, 90%',
  workingInclination: '纵倾10°、横倾15°',

  // 维护参数
  overhaul: 10000,
  overhaulTime: 10000,

  // 报警参数
  lowOilPressureAlarm: 0.15,
  lowWorkingOilPressureAlarm: 1.2,
  highOilTemperatureAlarm: 75,

  // 联轴器
  couplingManufacturer: '杭州前进联轴器有限公司',
  couplingConnections: '是',

  // 控制系统
  controlType: '电液控制',
  controlTypeOptions: '电控/液压',

  // 法规与规范
  regulations: [
    '中国船级社《钢质海船入级规范》及修改通报',
    '中华人民共和国海事局《船舶法定检验技术规则》',
    '中国船级社《材料与焊接规范》及修改通报'
  ],

  // 质量保证参数
  approvalPeriod: 10,
  feedbackPeriod: 10,
  warrantyPeriod: '交货后18个月或交船后12个月先到为准',

  // 供货数量
  quantity: 2,

  // 服务电话
  servicePhone: '0571-88761513',

  // 外观
  appearance: '杭齿灰'
};

// GWS系列默认参数 (电控双机备用泵启停系列)
// 数据来源：GWS49.61齿轮箱技术协议（电控 双机 备用泵启停及控制箱）上前2026.1.29.doc
export const gwsSeriesDefaults = {
  // 基本功能描述
  gearboxFunction: '倒顺离合、减速、承受螺旋桨推力',
  transmissionType: '圆柱斜齿轮三轴五齿轮传动',
  clutchType: '液压湿式多片摩擦离合器',
  inputCouplingType: '高弹性联轴器',

  // 润滑系统参数
  lubricationOilPressure: '0.15～0.45',
  maxOilTemperature: 80,
  oilGrade: 'HC-11、HQ-10 或 SAE30',
  workingOilPressure: '1.3～1.6',

  // 冷却系统参数
  coolingWaterInletTemperature: 32,
  coolingWaterPressure: 0.35,
  minCoolingWaterFlow: 2, // t/h

  // 性能参数
  mechanicalEfficiency: 96,
  outputDirection: '相反',
  directionChangeTime: 8, // 秒，可调节

  // 排列方式 - GWS系列特有（输入输出垂直异心）
  arrangement: '输入输出垂直异心（中心距615mm）',
  inputOutputOffset: 615, // mm，输入输出中心距

  // 安装参数
  longitudinalInclination: 10,
  transverseInclination: 15,
  longitudinalShaking: 7.5,
  transverseShaking: 22.5,
  installationMethod: '齿轮箱支架与主机底座安装在同一刚性支撑上',

  // 环境条件
  storageTemperature: '-15°C ~ +45°C',
  operatingTemperature: '-15°C ~ +45°C',
  seawaterTemperature: '-1°C ~ +32°C',
  relativeHumidity: '+35°C, 90%',
  workingInclination: '纵倾10°、横倾15°',

  // 维护参数
  overhaulTime: 10000,
  nameplateSpecification: '不锈钢，黑底白字阳文，中英文对照',

  // 控制系统 - GWS系列特有（电控带机旁手动）
  controlType: '电控带机旁手动',
  controlTypeOptions: '电控带机旁手动',
  controlVoltage: 24, // DC24V

  // 仪表与报警 - GWS系列特有（8个报警控制器含备用泵启停）
  instrumentsAndAlarms: '润滑油压表、润滑油温表、工作油压力表各1只；滑油低压报警、油温高报警、工作油压力低报警控制器各1只；正车、倒车、空车指示控制器各1只；备用泵启停控制器1只',
  workingOilPressureAlarm: 1.1,
  lubOilPressureAlarm: 0.1,
  oilTemperatureAlarm: 75,

  // 备用泵启停参数 - GWS系列特有
  backupPumpStartPressure: 0.03, // MPa，启动压力
  backupPumpStopPressure: 0.4,   // MPa，停止压力
  backupPumpAutoControl: true,   // 自动启停功能

  // 电动备用泵参数 - GWS系列特有
  backupPumpModel: '2CYA-1.1/0.8D(TS11)',
  backupPumpFlowRate: 1.1, // m³/h
  backupPumpPressure: 0.8, // MPa
  backupPumpMotorPower: 0.55, // kW
  backupPumpMotorVoltage: 'AC380V/50Hz',
  backupPumpMotorProtection: 'IP44',
  backupPumpMotorInsulation: 'F级',

  // 备用泵控制箱 - GWS系列特有
  backupPumpControlBox: true, // 每台电动泵配控制箱1只
  backupPumpControlBoxFeatures: '具备自动启停功能',

  // 信号输出
  signalOutput: '直流无源开关量信号',

  // 联轴器
  couplingManufacturer: '杭州前进联轴器有限公司',
  couplingConnections: '是',

  // 法规与规范
  regulations: [
    '中国船级社《钢质海船入级规范》及修改通报',
    '中华人民共和国海事局《船舶法定检验技术规则》',
    '中国船级社《材料与焊接规范》及修改通报'
  ],

  // 质量保证参数
  approvalPeriod: 10,
  feedbackPeriod: 10,
  warrantyPeriod: 12, // 月
  warrantyText: '船艇完工交付之日起12个月',

  // 供货数量 - GWS系列支持双机配置
  quantity: 2,
  supportsDualEngine: true,

  // 随机附件清单
  deliveryItems: [
    { name: '齿轮箱', quantity: '按需' },
    { name: '滑油泵（内置）', quantity: '1台/齿轮箱' },
    { name: '滑油滤油器', quantity: '1只/齿轮箱' },
    { name: '滑油冷却器', quantity: '1只/齿轮箱' },
    { name: '电控换向阀', quantity: '1只/齿轮箱' },
    { name: '工作压力表', note: '提供开关量信号' },
    { name: '正车/倒车/空车指示控制器', note: '提供开关量信号' },
    { name: '滑油低压报警/油温高报警', note: '提供开关量信号' },
    { name: '电动备用泵', quantity: '1台/齿轮箱' },
    { name: '备用泵控制箱', quantity: '1只/电动泵' },
    { name: '备用泵启停控制器', quantity: '1只/齿轮箱' },
    { name: 'CCS证书、合格证、说明书、装箱清单', quantity: '1套' }
  ],

  // 外观
  appearance: '杭齿灰'
};

// HCQ系列默认参数（高扭矩大功率系列）
// 数据来源：HCQ700型船用齿轮箱使用说明书
export const hcqSeriesDefaults = {
  // 基本功能描述
  gearboxFunction: '倒顺离合、减速、承受螺旋桨推力',
  transmissionType: '圆柱斜齿轮三轴五齿轮传动',
  clutchType: '液压湿式多片摩擦离合器',
  inputCouplingType: '齿形块联轴器',

  // 润滑系统参数
  lubricationOilPressure: '0.2～0.45',
  lubricationPressure: '0.2～0.45', // 别名
  maxOilTemperature: 80,
  oilGrade: 'HC-11或HQ-10',
  workingOilPressure: '1.4～1.6',
  workingPressure: '1.4～1.6', // 别名

  // 冷却系统参数
  coolingWaterInletTemperature: 32,
  coolingWaterPressure: 0.35,
  coolingWaterVolume: 4, // t/h，HCQ700规格

  // 性能参数
  mechanicalEfficiency: 97,
  outputDirection: '相反',
  directionChangeTime: 10, // 可调节

  // 安装参数
  longitudinalInclination: 10,
  transverseInclination: 15,
  longitudinalShaking: 7.5,
  transverseShaking: 22.5,
  installationMethod: '齿轮箱支架与主机底座安装在同一刚性支撑上',

  // 环境条件
  storageTemperature: '-15°C ~ +45°C',
  operatingTemperature: '-15°C ~ +45°C',
  seawaterTemperature: '-1°C ~ +32°C',
  relativeHumidity: '+35°C, 90%',
  workingInclination: '纵倾10°、横倾15°',

  // 维护参数
  overhaulTime: 10000,
  overhaulPeriod: 10000, // 别名
  nameplateSpecification: '不锈钢，黑底白字阳文，中英文对照',

  // 控制系统
  controlType: '推拉软轴',
  controlTypeOptions: '推拉软轴/电控',

  // 仪表与报警
  instrumentsAndAlarms: '润滑油压表、润滑油温表、工作油压力表各1只；滑油低压报警、油温高报警控制器',

  // 联轴器
  couplingManufacturer: '杭州前进联轴器有限公司',
  couplingConnections: '是',

  // 法规与规范（海船/内河通用）
  regulations: [
    '中国船级社《钢质海船入级规范》及修改通报',
    '中华人民共和国海事局《船舶法定检验技术规则》',
    '中国船级社《材料与焊接规范》及修改通报'
  ],

  // 内河船舶适用规范
  inlandRegulations: [
    '中国船级社《国内航行小型海船技术规则》(2024)',
    '中华人民共和国海事局《国内航行海船法定检验技术规则》(2020)'
  ],

  // 质量保证参数
  approvalPeriod: 10,
  feedbackPeriod: 10,
  warrantyPeriod: 12, // 月
  warrantyText: '船艇完工交付之日起12个月',

  // 供货数量
  quantity: 2,

  // 外观
  appearance: '杭齿灰'
};

/**
 * 根据齿轮箱型号获取对应的系列默认参数
 * @param {string} model - 齿轮箱型号，如 "DT770", "GWC4560", "HC138"
 * @returns {Object} 对应系列的默认参数对象
 */
export const getSeriesDefaults = (model) => {
  if (!model) return {};

  const modelUpper = model.toUpperCase();

  // 按优先级匹配系列
  if (modelUpper.startsWith('DT')) {
    return { ...dtSeriesDefaults };
  }
  if (modelUpper.startsWith('SGW')) {
    // SGW 系列：结构与 GWS 类似，使用独立配置（避免备用泵参数误用 GWC 数据）
    return {
      ...gwsSeriesDefaults,
      // SGW 系列特有标识
      inputCouplingType: '高弹性联轴器',
      arrangement: '输入输出同心（单级减速）',
      inputOutputOffset: 0,
    };
  }
  if (modelUpper.startsWith('GWS')) {
    return { ...gwsSeriesDefaults };
  }
  if (modelUpper.startsWith('GWC') || modelUpper.startsWith('GWL')) {
    return { ...gwcSeriesDefaults };
  }
  if (modelUpper.startsWith('HCT')) {
    return { ...hctSeriesDefaults };
  }
  if (modelUpper.startsWith('HCQ')) {
    return { ...hcqSeriesDefaults };
  }
  if (modelUpper.startsWith('HC') || modelUpper.startsWith('HCM') || modelUpper.startsWith('HCD')) {
    return { ...hcSeriesDefaults };
  }

  // 默认返回GWC系列参数
  return { ...gwcSeriesDefaults };
};

/**
 * 获取系列名称
 * @param {string} model - 齿轮箱型号
 * @returns {string} 系列名称
 */
export const getSeriesName = (model) => {
  if (!model) return 'GWC';

  const modelUpper = model.toUpperCase();

  if (modelUpper.startsWith('DT')) return 'DT';
  if (modelUpper.startsWith('SGW')) return 'SGW';
  if (modelUpper.startsWith('GWS')) return 'GWS';
  if (modelUpper.startsWith('GWC')) return 'GWC';
  if (modelUpper.startsWith('GWL')) return 'GWL';
  if (modelUpper.startsWith('HCT')) return 'HCT';
  if (modelUpper.startsWith('HCQ')) return 'HCQ';
  if (modelUpper.startsWith('HCM')) return 'HCM';
  if (modelUpper.startsWith('HCD')) return 'HCD';
  if (modelUpper.startsWith('HC')) return 'HC';

  return 'GWC';
};

/**
 * 合并选型数据和系列默认参数
 * 选型数据优先级高于默认参数
 * @param {Object} selectionData - 从选型结果获取的数据
 * @param {string} model - 齿轮箱型号
 * @returns {Object} 合并后的完整参数对象
 */
export const mergeWithDefaults = (selectionData, model) => {
  const defaults = getSeriesDefaults(model);

  // 选型数据覆盖默认值
  return {
    ...defaults,
    ...selectionData,
    // 确保关键字段不被空值覆盖
    regulations: selectionData.regulations || defaults.regulations,
    instrumentsAndAlarms: selectionData.instrumentsAndAlarms || defaults.instrumentsAndAlarms,
    nameplateSpecification: selectionData.nameplateSpecification || defaults.nameplateSpecification
  };
};

/**
 * 从齿轮箱数据库记录提取协议参数
 * @param {Object} gearboxData - 齿轮箱数据库记录
 * @returns {Object} 提取的参数对象
 */
export const extractGearboxParams = (gearboxData) => {
  if (!gearboxData) return {};

  return {
    gearboxModel: gearboxData.model,
    maxInputSpeed: gearboxData.maxSpeed,
    minInputSpeed: gearboxData.minSpeed,
    centerDistance: gearboxData.centerDistance,
    maxPropellerThrust: gearboxData.thrust,
    oilCapacity: gearboxData.oilCapacity,
    coolingWaterVolume: gearboxData.coolingWaterFlow,
    transmissionCapacity: gearboxData.transmissionCapacity,
    weight: gearboxData.weight,
    dimensions: gearboxData.dimensions,
  };
};

/**
 * 从选型输入提取主机参数
 * @param {Object} projectInfo - 项目信息（用户输入）
 * @returns {Object} 提取的主机参数
 */
export const extractEngineParams = (projectInfo) => {
  if (!projectInfo) return {};

  return {
    enginePower: projectInfo.power,
    engineSpeed: projectInfo.speed,
    reductionRatio: projectInfo.ratio
  };
};

export default {
  dtSeriesDefaults,
  gwsSeriesDefaults,
  gwcSeriesDefaults,
  hcSeriesDefaults,
  hctSeriesDefaults,
  hcqSeriesDefaults,
  getSeriesDefaults,
  getSeriesName,
  mergeWithDefaults,
  extractGearboxParams,
  extractEngineParams
};
