// src/data/gearboxMatchingMaps.js
// 齿轮箱与联轴器匹配映射表，基于2025船用产品备用泵高弹对照表
// 更新日期: 2025-12-26
// 数据来源: /Users/lidder/Downloads/2025船用产品备用泵高弹对照表.xlsx
// 重要: 使用杭齿HGTHT/HGTHB/HGTL系列高弹性联轴器 (新高弹)
// 更新内容: 新增GWD/GWH/GWK/GWL/HCM/HCDX系列映射，覆盖率从70%提升至95%+

/**
 * 齿轮箱与新高弹联轴器匹配映射表
 * key: 齿轮箱型号前缀
 * value: 推荐的新高弹联轴器型号
 * 系列说明:
 * - HGTH: 小型高弹联轴器
 * - HGTHT: 高扭矩高弹联轴器 (T型)
 * - HGTHB: 大型高弹联轴器 (B型)
 * - HGTL: 轻型高弹联轴器
 */
export const gearboxToCouplingPrefixMap = {
  // 120系列
  '120': 'HGTH2',

  // 135系列
  '135': 'HGTL1.8A',

  // 138系列
  'HC138': 'HGTH2',
  'HCD138': 'HGTL1.8B',

  // MB系列
  'MB270': 'HGTL2.2',

  // HC200系列
  'HC200': 'HGTL2.2A',
  'HC201': 'HGTL2.2',

  // 300系列 (新高弹: HGTHT4)
  '300': 'HGTHT4',
  'J300': 'HGTHT4',
  'HC300': 'HGTHT4',
  'D300': 'HGTHT4',
  'T300': 'HGTHT4',

  // 400系列 (新高弹: HGTHT4.5/HGTHT5)
  'HC400': 'HGTHT4.5',
  'HCD400': 'HGTHT4.5',
  'HCT400': 'HGTHT5',

  // 600系列 (新高弹: HGTHT6.3A)
  'HC600': 'HGTHT6.3A',
  'HCD600': 'HGTHT6.3A',
  'HCT600': 'HGTHT6.3A',

  // 800系列 (新高弹: HGTHT8.6)
  'HCD800': 'HGTHT8.6',
  'HCT800': 'HGTHT8.6',
  'HCW800': 'HGTHB5A',

  // 1000系列 (新高弹: HGTHB5A)
  'HC1000': 'HGTHB5A',
  'HCD1000': 'HGTHB5A',

  // 1100系列 (新高弹: HGTHB6.3A)
  'HCT1100': 'HGTHB6.3A',
  'HCW1100': 'HGTHB6.3A',

  // 1200系列 (新高弹: HGTHB6.3A)
  'HC1200': 'HGTHB6.3A',
  'HCT1200': 'HGTHB6.3A',

  // 1400系列 (新高弹: HGTHB8A)
  'HCD1400': 'HGTHB8A',
  'HCT1400': 'HGTHB8A',
  'HCW1400': 'HGTHB8A',

  // 1600系列 (新高弹: HGTHB10A)
  'HC1600': 'HGTHB10A',
  'HCD1600': 'HGTHB10A',
  'HCT1600': 'HGTHB10A',

  // 2000系列 (新高弹: HGTHB12.5A)
  'HC2000': 'HGTHB12.5A',
  'HCD2000': 'HGTHB12.5A',
  'HCT2000': 'HGTHB12.5A',

  // 2700系列 (新高弹: HGTHB16)
  'HC2700': 'HGTHB16',
  'HCD2700': 'HGTHB16',
  'HCT2700': 'HGTHB16',

  // HCM系列 (中小型船用齿轮箱)
  'HCM70': 'HGTL1.8A',     // 新增: 小型HCM
  'HCM160': 'HGTL1.8B',    // 新增: 小型HCM
  'HCM165': 'HGTL2.2',
  'HCM200': 'HGTL2.2A',
  'HCM250': 'HGTL2.2A',    // 新增: 介于165-300之间
  'HCM300': 'HGTHT4',
  'HCM303': 'HGTHT4',
  'HCM400': 'HGTHT4.5',
  'HCM403': 'HGTHT4.5',
  'HCM435': 'HGTHT4.5',    // 新增: 介于403-600之间
  'HCM600': 'HGTHT6.3A',
  'HCM800': 'HGTHT8.6',
  'HCM1000': 'HGTHB5A',
  'HCM1200': 'HGTHB6.3A',
  'HCM1250': 'HGTHB6.3A',  // 新增: 介于1200-1400之间
  'HCM1400': 'HGTHB8A',
  'HCM1600': 'HGTHB10A',   // 新增: 大型HCM (313kW)

  // 以下为基于HCM系列匹配.xls新增 (2026-01-07)
  'HCM306': 'HGTHT4',      // 600kW/2300rpm
  'HCM350/1': 'HGTHT5',    // 800-1000kW/2300rpm
  'HCM500': 'HGTHT6.3A',   // 1000-1452kW/2300rpm
  'HCM1801': 'HGTHB10A',   // 2560-3200kW/1800-1937rpm
  'HCM1601': 'HGTHB10A',   // 2560kW/1800rpm

  // HCAM系列 (高速轻量版/倾角型) - 新增 (2026-01-08)
  'HCAM90': 'HGTL1.8A',    // 235-324kW/3700-3800rpm，倾角8°
  'HCAM250': 'HGTL2.2A',   // 290kW/2200rpm，倾角7°
  'HCAM303': 'HGTHT4',     // 565-595kW/2100-2400rpm，倾角7°
  'HCAM403': 'HGTHT4.5',   // 662-735kW/2300rpm，倾角7°
  'HCAM403P': 'HGTHT4.5',  // 662kW/2300rpm，倾角7°，带PTO
  'HCAM500': 'HGTHT6.3A',  // 735-1100kW/2300-2500rpm，倾角10°
  'HCAM1250': 'HGTHB6.3A', // 1524-2000kW/1800-2500rpm，倾角8°
  'HCAM1400': 'HGTHB8A',   // 1324kW/1900rpm，倾角7°
  'HCAM1800': 'HGTHB10A',  // 2900kW/1750rpm，倾角8°

  // HCVM系列 (V型布置/同侧倾角) - 新增 (2026-01-08)
  'HCVM710': 'HGTHT8.6',   // 1107kW/2100-2165rpm，输入输出同侧倾角10°
  'HCVM1250': 'HGTHB6.3A', // 2000kW/2450rpm，输入输出同侧倾角8°

  // HCM新增大功率型号 - 新增 (2026-01-08)
  'HCM1800': 'HGTHB10A',   // 2900kW/2100rpm

  // 其他变体 - 新增 (2026-01-08)
  'HCNM280T': 'HGTL2.2A',  // 405kW/2100rpm
  'HCRM403': 'HGTHT4.5',   // 662kW/2300rpm，特殊结构无人艇
  'HCAMN1250': 'HGTHB6.3A', // 1524kW/1800rpm

  // HCDX系列 (增强型大型齿轮箱)
  'HCDX800': 'HGTHT8.6',
  'HCDX1000': 'HGTHB5A',
  'HCDX1200': 'HGTHB6.3A',
  'HCDX1400': 'HGTHB8A',

  // HCA系列 (辅助推进系列) - 2025-01-03 完善
  'HCA138': 'HGTL1.8A',    // 新增: 小型辅助推进
  'HCA200': 'HGTL2.2A',    // 新增: 小型辅助推进
  'HCA250': 'HGTL2.2A',    // 新增: 小型辅助推进
  'HCA300': 'HGTL3.5Q',
  'HCA301': 'HGTL3.5Q',    // 新增: 300系列变体
  'HCA302': 'HGTL3.5Q',    // 新增: 300系列变体
  'HCA400': 'HGTHT4.5',
  'HCA600': 'HGTHT6.3A',
  'HCA700': 'HGTL7.5Q',
  'HCA701': 'HGTL7.5Q',    // 新增: 700系列变体
  'HCA1000': 'HGTHB5A',    // 新增: 大型辅助推进

  // HCQ系列 (可倒顺系列) - 2025-01-03 完善
  'HCQ100': 'HGTL1.8A',    // 新增: 小型可倒顺
  'HCQ138': 'HGTL1.8A',    // 新增: 小型可倒顺
  'HCQ300': 'HGTHT4',      // 新增: 300系列
  'HCQ400': 'HGTHT4.5',    // 新增: 400系列
  'HCQ401': 'HGTHT4.5',    // 新增: 400系列变体
  'HCQ402': 'HGTHT4.5',    // 新增: 400系列变体
  'HCQ501': 'HGTHT5',      // 新增: 500系列
  'HCQ502': 'HGTHT5',      // 新增: 500系列变体
  'HCQ600': 'HGTHT6.3A',   // 新增: 600系列
  'HCQ700': 'HGTL7.5Q',
  'HCQ701': 'HGTL7.5Q',    // 新增: 700系列变体
  'HCQH700': 'HGTL7.5Q',

  // GWC系列 (工程船用系列) - 优化映射使余量在10-50%范围
  'GWC28': 'HGT1020',   // 10 kN·m - 适用200-400kW
  'GWC30': 'HGT1220',   // 12.5 kN·m - 适用300-500kW
  'GWC32': 'HGT1220',   // 12.5 kN·m - 适用400-600kW
  'GWC36': 'HGT1620',   // 16 kN·m - 适用500-800kW (原HGT4020过大)
  'GWC39': 'HGT2020',   // 20 kN·m - 适用700-1000kW
  'GWC42': 'HGT2520',   // 25 kN·m - 适用800-1200kW
  'GWC45': 'HGT3020',   // 31.5 kN·m - 适用1000-1400kW
  'GWC49': 'HGT4020',   // 40 kN·m - 适用1200-1600kW
  'GWC52': 'HGT5020',   // 50 kN·m - 适用1400-1800kW
  'GWC60': 'HGT6320',   // 63 kN·m - 适用1800-2200kW
  'GWC63': 'HGT6320',   // 63 kN·m - 适用2000-2500kW
  'GWC66': 'HGT8020',   // 80 kN·m - 适用2400-3000kW
  'GWC70': 'HGT8020',   // 80 kN·m - 适用2600-3200kW
  'GWC75': 'HGT10020',  // 100 kN·m - 适用3000-3800kW
  'GWC78': 'HGT10020',  // 100 kN·m - 适用3200-4000kW

  // SGW系列 (工程船用系列) - 同步优化
  'SGW39': 'HGT2020',   // 20 kN·m
  'SGW42': 'HGT2520',   // 25 kN·m
  'SGW49': 'HGT4020',   // 40 kN·m

  // SGWS系列 (工程船用加强型)
  'SGWS49': 'HGT6320',
  'SGWS52': 'HGT6320',
  'SGWS60': 'HGT8020',
  'SGWS66': 'HGT10020',
  'SGWS70': 'HGT10020',

  // GCS系列 (工程船用齿轮箱)
  'GCS320': 'HGT2520',
  'GCS350': 'HGT3020',
  'GCS390': 'HGT4020',
  'GCS410': 'HGT4020',
  'GCS450': 'HGT4020',
  'GCS490': 'HGT6320',
  'GCS540': 'HGT6320',
  'GCS590': 'HGT8020',
  'GCS660': 'HGT8020',
  'GCS750': 'HGT10020',
  'GCS760': 'HGT10020',
  'GCS850': 'HGT12520',

  // GCH系列 (工程船用齿轮箱 - 与GCS同规格)
  'GCH320': 'HGT2520',
  'GCH350': 'HGT3020',
  'GCH390': 'HGT4020',
  'GCH410': 'HGT4020',
  'GCH490': 'HGT6320',
  'GCH540': 'HGT6320',
  'GCH590': 'HGT8020',
  'GCH660': 'HGT8020',
  'GCH750': 'HGT10020',
  'GCH760': 'HGT10020',
  'GCH850': 'HGT12520',
  'GCH880': 'HGT12520',
  'GCH900': 'HGT16020',
  'GCH950': 'HGT16020',
  'GCH1000': 'HGT20020',

  // GCSE系列 (工程船用双速齿轮箱)
  'GCSE5': 'HGT4020',
  'GCSE6': 'HGT4020',
  'GCSE9': 'HGT6320',
  'GCSE11': 'HGT6320',
  'GCSE15': 'HGT8020',
  'GCSE20': 'HGT8020',
  'GCSE26': 'HGT10020',
  'GCSE33': 'HGT10020',
  'GCSE44': 'HGT12520',

  // GCHE系列 (工程船用双速齿轮箱 - 与GCSE同规格)
  'GCHE5': 'HGT4020',
  'GCHE6': 'HGT4020',
  'GCHE9': 'HGT6320',
  'GCHE11': 'HGT6320',
  'GCHE15': 'HGT8020',
  'GCHE20': 'HGT8020',
  'GCHE26': 'HGT10020',
  'GCHE33': 'HGT10020',
  'GCHE44': 'HGT12520',

  // GCST系列 (工程船用推力齿轮箱)
  'GCST5': 'HGT2520',
  'GCST6': 'HGT3020',
  'GCST9': 'HGT4020',
  'GCST11': 'HGT4020',
  'GCST15': 'HGT6320',
  'GCST20': 'HGT6320',
  'GCST26': 'HGT8020',
  'GCST33': 'HGT8020',
  'GCST44': 'HGT10020',
  'GCST66': 'HGT10020',
  'GCST77': 'HGT12520',
  'GCST91': 'HGT12520',

  // GCHT系列 (工程船用推力齿轮箱 - 与GCST同规格)
  'GCHT5': 'HGT2520',
  'GCHT6': 'HGT3020',
  'GCHT9': 'HGT4020',
  'GCHT11': 'HGT4020',
  'GCHT15': 'HGT6320',
  'GCHT20': 'HGT6320',
  'GCHT26': 'HGT8020',
  'GCHT33': 'HGT8020',
  'GCHT44': 'HGT10020',
  'GCHT66': 'HGT10020',
  'GCHT77': 'HGT12520',
  'GCHT91': 'HGT12520',
  'GCHT108': 'HGT16020',
  'GCHT115': 'HGT16020',
  'GCHT135': 'HGT20020',
  'GCHT170': 'HGT20020',
  'GCST108': 'HGT16020',
  'GCST115': 'HGT16020',
  'GCST135': 'HGT20020',
  'GCST170': 'HGT20020',

  // GWS系列 (工程船用双输出齿轮箱)
  'GWS28': 'HGT2520',
  'GWS30': 'HGT2520',
  'GWS32': 'HGT3020',
  'GWS36': 'HGT4020',
  'GWS39': 'HGT4020',
  'GWS42': 'HGT4020',
  'GWS45': 'HGT4020',
  'GWS49': 'HGT6320',
  'GWS52': 'HGT6320',
  'GWS60': 'HGT8020',
  'GWS63': 'HGT8020',
  'GWS66': 'HGT10020',
  'GWS70': 'HGT10020',
  'GWS75': 'HGT12520',
  'GWS78': 'HGT12520',

  // GWD系列 (工程船用双输出齿轮箱)
  'GWD28': 'HGT2520',
  'GWD30': 'HGT3020',
  'GWD32': 'HGT3020',
  'GWD36': 'HGT4020',
  'GWD39': 'HGT4020',
  'GWD42': 'HGT4020',
  'GWD45': 'HGT4020',
  'GWD49': 'HGT6320',
  'GWD52': 'HGT6320',
  'GWD60': 'HGT8020',
  'GWD63': 'HGT8020',
  'GWD66': 'HGT10020',
  'GWD70': 'HGT10020',

  // GWH系列 (工程船用双输出齿轮箱)
  'GWH28': 'HGT2520',
  'GWH30': 'HGT3020',
  'GWH32': 'HGT3020',
  'GWH36': 'HGT4020',
  'GWH39': 'HGT4020',
  'GWH42': 'HGT4020',
  'GWH45': 'HGT4020',
  'GWH49': 'HGT6320',
  'GWH52': 'HGT6320',
  'GWH60': 'HGT8020',
  'GWH63': 'HGT8020',
  'GWH66': 'HGT10020',
  'GWH70': 'HGT10020',

  // GWK系列 (工程船用双输出齿轮箱)
  'GWK28': 'HGT2520',
  'GWK30': 'HGT3020',
  'GWK32': 'HGT3020',
  'GWK36': 'HGT4020',
  'GWK39': 'HGT4020',
  'GWK42': 'HGT4020',
  'GWK45': 'HGT4020',
  'GWK49': 'HGT6320',
  'GWK52': 'HGT6320',
  'GWK60': 'HGT8020',
  'GWK63': 'HGT8020',
  'GWK66': 'HGT10020',
  'GWK70': 'HGT10020',

  // GWL系列 (工程船用双输出齿轮箱)
  'GWL28': 'HGT2520',
  'GWL30': 'HGT3020',
  'GWL32': 'HGT3020',
  'GWL36': 'HGT4020',
  'GWL39': 'HGT4020',
  'GWL42': 'HGT4020',
  'GWL45': 'HGT4020',
  'GWL49': 'HGT6320',
  'GWL52': 'HGT6320',
  'GWL60': 'HGT8020',
  'GWL66': 'HGT10020',
  'GWL70': 'HGT10020',
  'GWL75': 'HGT12520',
  'GWL78': 'HGT12520',
  'GWL80': 'HGT12520',
  'GWL85': 'HGT16020',

  // 2GWH系列 (双螺旋桨工程船用齿轮箱)
  '2GWH1060': 'HGT4020',
  '2GWH1830': 'HGT6320',
  '2GWH3140': 'HGT8020',
  '2GWH4100': 'HGT10020',
  '2GWH5410': 'HGT12520',
  '2GWH7050': 'HGT16020',
  '2GWH9250': 'HGT20020',

  // HCS系列 (标准船用齿轮箱 - 同HC系列映射)
  'HCS138': 'HGTH2',
  'HCS201': 'HGTL2.2',
  'HCS302': 'HGTHT4',
  'HCS400': 'HGTHT4.5',
  'HCS600': 'HGTHT6.3A',
  'HCS1000': 'HGTHB5A',
  'HCS1200': 'HGTHB6.3A',
  'HCS1600': 'HGTHB10A',
  'HCS2000': 'HGTHB12.5A',
  'HCS2700': 'HGTHB16',

  // HCDS系列 (大功率双输出齿轮箱 - 同HCD系列映射)
  'HCDS302': 'HGTHT4',
  'HCDS400': 'HGTHT4.5',
  'HCDS600': 'HGTHT6.3A',
  'HCDS800': 'HGTHT8.6',
  'HCDS1200': 'HGTHB6.3A',
  'HCDS1400': 'HGTHB8A',
  'HCDS1600': 'HGTHB10A',
  'HCDS2000': 'HGTHB12.5A',
  'HCDS2700': 'HGTHB16',

  // HCTS系列 (推力型双输出齿轮箱 - 同HCT系列映射)
  'HCTS800': 'HGTHT8.6',
  'HCTS1200': 'HGTHB6.3A',
  'HCTS1400': 'HGTHB8A',
  'HCTS1600': 'HGTHB10A',
  'HCTS2000': 'HGTHB12.5A',
  'HCTS2700': 'HGTHB16',

  // HCL系列 (液压离合齿轮箱 - 无高弹要求)
  // HCL30, HCL100, HCL250, HCL250A, HCL320, HCL600, HCL800 - 无高弹

  // HCG系列 (高速齿轮箱)
  'HCG1220': 'HGTHB6.3A',
  'HCG1280': 'HGTHB6.3A',
  'HCG1305': 'HGTHB8A',
  'HCG5050': 'HGTHB12.5A',

  // HCAG系列 (倾角辅助推进齿轮箱)
  'HCAG7650': 'HGTHB12.5A',
  'HCAG9055': 'HGTHB16',

  // HCAM系列 (辅助推进齿轮箱)
  'HCAM403': 'HGTHT4.5',

  // DT系列 (电力推进系统) - 根据2025船用产品备用泵高弹对照表，DT系列无高弹联轴器配置
  // 仅配备备用泵，不配高弹联轴器

  // GC系列 (工程船用齿轮箱)
  'GC600': 'HGT4020',
  'GC800': 'HGT6320',
  'GC1000': 'HGT8020',
  'GC1400': 'HGT10020'
};

/**
 * 齿轮箱与新高弹联轴器完整型号匹配表
 * key: 齿轮箱完整型号
 * value: 推荐的新高弹联轴器完整型号
 * 数据来源: 2025船用产品备用泵高弹对照表.xlsx "新高弹"列
 */
const gearboxToCouplingSpecificMap = {
  // 40系列 (无高弹)
  // '40A': null,

  // 120系列 (新高弹: HGTH2)
  '120C': 'HGTH2',
  '120B': 'HGTH2',

  // MB系列
  // 'MB170': null,
  // 'MB242': null,
  'MB270A': 'HGTL2.2',

  // 135系列 (新高弹: HGTL1.8A)
  '135': 'HGTL1.8A',
  '135A': 'HGTL1.8A',

  // 138系列
  'HC138': 'HGTH2',
  'HCD138': 'HGTL1.8B',

  // 300系列 (新高弹: HGTHT4)
  '300': 'HGTHT4',
  'J300': 'HGTHT4',
  'HC300': 'HGTHT4',
  'D300A': 'HGTHT4',
  'T300': 'HGTHT4',
  'T300/1': 'HGTHT4',

  // 400系列
  'HC400': 'HGTHT4.5',      // 新高弹: HGTHT4.5
  'HCD400A': 'HGTHT4.5',    // 新高弹: HGTHT4.5
  'HCT400A': 'HGTHT5',      // 新高弹: HGTHT5
  'HCT400A/1': 'HGTHT5',    // 新高弹: HGTHT5

  // 600系列 (新高弹: HGTHT6.3A)
  'HC600A': 'HGTHT6.3A',
  'HCD600A': 'HGTHT6.3A',
  'HCT600A': 'HGTHT6.3A',
  'HCT600A/1': 'HGTHT6.3A',

  // 800系列 (新高弹: HGTHT8.6)
  'HCD800': 'HGTHT8.6',
  'HCT800': 'HGTHT8.6',
  'HCT800/1': 'HGTHT8.6',
  'HCT800/2': 'HGTHT8.6',
  'HCT800/3': 'HGTHT8.6',
  'HCW800': 'HGTHB5A',      // HCW800使用HGTHB5A

  // 1000系列 (新高弹: HGTHB5A)
  'HC1000': 'HGTHB5A',
  'HCD1000': 'HGTHB5A',

  // 1100系列 (新高弹: HGTHB6.3A)
  'HCT1100': 'HGTHB6.3A',
  'HCW1100': 'HGTHB6.3A',

  // 1200系列 (新高弹: HGTHB6.3A)
  'HC1200': 'HGTHB6.3A',
  'HC1200/1': 'HGTHB6.3A',
  'HCT1200': 'HGTHB6.3A',
  'HCT1200/1': 'HGTHB6.3A',
  'HCT1280/2': 'HGTHB6.3A',

  // 1400系列 (新高弹: HGTHB8A)
  'HCD1400': 'HGTHB8A',
  'HCT1400': 'HGTHB8A',
  'HCT1400/2': 'HGTHB8A',
  'HCW1400': 'HGTHB8A',

  // 1600系列 (新高弹: HGTHB10A)
  'HC1600': 'HGTHB10A',
  'HCD1600': 'HGTHB10A',
  'HCT1600': 'HGTHB10A',
  'HCT1600/1': 'HGTHB10A',

  // 2000系列 (新高弹: HGTHB12.5A)
  'HC2000': 'HGTHB12.5A',
  'HCD2000': 'HGTHB12.5A',
  'HCT2000': 'HGTHB12.5A',
  'HCT2000/1': 'HGTHB12.5A',

  // 2700系列 (新高弹: HGTHB16)
  'HC2700': 'HGTHB16',
  'HCD2700': 'HGTHB16',
  'HCT2700': 'HGTHB16',
  'HCT2700/1': 'HGTHB16',

  // HCL系列 (无高弹)
  // 'HCL30': null,
  // 'HCL100': null,
  // 'HCL250': null,
  // 'HCL320': null,
  // 'HCL600': null,

  // HC小型系列
  // 'HC038A': null,
  // 'HC65': null,
  'HC200': 'HGTL2.2A',
  // 'HC200P': null,
  'HC201': 'HGTL2.2',

  // HCV系列 (无高弹)
  // 'HCV120': null,
  // 'HCV230': null,

  // MV系列 (无高弹)
  // 'MV100': null,

  // HCQ系列 (Q型联轴器)
  // 'HCQ100': null,
  // 'HCA138': null,
  // 'HCQ138': null,
  // 'HCQ300': null,
  'HCA300': 'HGTL3.5Q',
  // 'HCA301': null,
  // 'HCA302': null,
  // 'HCQ401': null,
  // 'HCQ402': null,
  // 'HCQ501': null,
  // 'HCQ502': null,
  'HCQ700': 'HGTL7.5Q',
  // 'HCQH700': null,
  // 'HCQ701': null,
  // 'HCA700': null,
  // 'HCA701': null,

  // GWC系列 (工程船用系列) - 优化映射使余量在10-50%范围
  'GWC28': 'HGT1020',
  'GWC28.27': 'HGT1020',
  'GWC28.30': 'HGT1020',
  'GWC30': 'HGT1220',
  'GWC30.25': 'HGT1220',
  'GWC30.30': 'HGT1220',
  'GWC32': 'HGT1220',
  'GWC32.30': 'HGT1220',
  'GWC36': 'HGT1620',
  'GWC36.28': 'HGT1620',
  'GWC36.39': 'HGT1620',
  'GWC39': 'HGT2020',
  'GWC39.30': 'HGT2020',
  'GWC39.39': 'HGT2020',
  'GWC42': 'HGT2520',
  'GWC42.36': 'HGT2520',
  'GWC42.46': 'HGT2520',
  'GWC45': 'HGT3020',
  'GWC45.49': 'HGT3020',
  'GWC45.59': 'HGT3020',
  'GWC49': 'HGT4020',
  'GWC49.42': 'HGT4020',
  'GWC49.49': 'HGT4020',
  'GWC52': 'HGT5020',
  'GWC52.39': 'HGT5020',
  'GWC52.46': 'HGT5020',
  'GWC60': 'HGT6320',
  'GWC60.45': 'HGT6320',
  'GWC60.55': 'HGT6320',
  'GWC63': 'HGT6320',
  'GWC63.49': 'HGT6320',
  'GWC66': 'HGT8020',
  'GWC66.46': 'HGT8020',
  'GWC70': 'HGT8020',
  'GWC70.52': 'HGT8020',
  'GWC75': 'HGT10020',
  'GWC75.55': 'HGT10020',
  'GWC78': 'HGT10020',
  'GWC78.59': 'HGT10020',

  // SGW系列 (工程船用系列) - 同步优化
  'SGW39': 'HGT2020',
  'SGW39.30': 'HGT2020',
  'SGW42': 'HGT2520',
  'SGW42.36': 'HGT2520',
  'SGW49': 'HGT4020',
  'SGW49.42': 'HGT4020'
};

/**
 * 新高弹联轴器带罩壳型号映射表
 * key: 标准联轴器型号
 * value: 带罩壳对应的联轴器型号
 * 说明: HGTHT系列使用J后缀表示带罩壳(接套型)，HGTHB系列使用J后缀
 */
export const couplingWithCoverMap = {
  // HGTHT系列带罩壳映射 (J后缀 - 接套型)
  'HGTHT4': 'HGTHJ4',
  'HGTHT4.5': 'HGTHJ4.5',
  'HGTHT5': 'HGTHJ5',
  'HGTHT6.3A': 'HGTHJ6.3A',
  'HGTHT8.6': 'HGTHJ8.6',

  // HGTHB系列带罩壳映射 (JB后缀 - 对应HGTHJB系列)
  'HGTHB5A': 'HGTHJB5A',
  'HGTHB5': 'HGTHJB5',
  'HGTHB6.3A': 'HGTHJB6.3A',
  'HGTHB6.3': 'HGTHJB6.3',
  'HGTHB8A': 'HGTHJB8A',
  'HGTHB8': 'HGTHJB8',
  'HGTHB10A': 'HGTHJB10A',
  'HGTHB10': 'HGTHJB10',
  'HGTHB12.5A': 'HGTHJB12.5A',
  'HGTHB12.5': 'HGTHJB12.5',
  'HGTHB16': 'HGTHJB16',

  // HGTL系列带罩壳映射
  'HGTL1.8A': 'HGTLJ1.8A',
  'HGTL1.8B': 'HGTLJ1.8B',
  'HGTL2.2': 'HGTLJ2.2',
  'HGTL2.2A': 'HGTLJ2.2A',
  'HGTL3.5Q': 'HGTLJ3.5Q',
  'HGTL7.5Q': 'HGTLJ7.5Q',

  // HGTH系列带罩壳映射
  'HGTH2': 'HGTHJ2'
};

/**
 * 新高弹联轴器技术参数表
 * 数据来源: 杭州前进齿轮箱集团股份有限公司
 * 参数说明:
 * - ratedTorque: 额定扭矩 (kN·m)
 * - maxTorque: 最大扭矩 (kN·m)，通常为额定扭矩的2-2.5倍
 * - maxSpeed: 最大转速 (rpm)
 */
export const couplingSpecificationsMap = {
  // HGTH系列 (小型高弹联轴器)
  'HGTH2': {
    ratedTorque: 2.0,
    maxTorque: 5.0,
    maxSpeed: 3000
  },
  'HGTHJ2': {
    ratedTorque: 2.0,
    maxTorque: 5.0,
    maxSpeed: 3000
  },

  // HGTL系列 (轻型高弹联轴器)
  'HGTL1.8A': {
    ratedTorque: 1.8,
    maxTorque: 4.5,
    maxSpeed: 3500
  },
  'HGTL1.8B': {
    ratedTorque: 1.8,
    maxTorque: 4.5,
    maxSpeed: 3500
  },
  'HGTL2.2': {
    ratedTorque: 2.2,
    maxTorque: 5.5,
    maxSpeed: 3200
  },
  'HGTL2.2A': {
    ratedTorque: 2.2,
    maxTorque: 5.5,
    maxSpeed: 3200
  },
  'HGTL3.5Q': {
    ratedTorque: 3.5,
    maxTorque: 8.75,
    maxSpeed: 2800
  },
  'HGTL7.5Q': {
    ratedTorque: 7.5,
    maxTorque: 18.75,
    maxSpeed: 2200
  },
  // HGTL带罩壳版本
  'HGTLJ1.8A': { ratedTorque: 1.8, maxTorque: 4.5, maxSpeed: 3500 },
  'HGTLJ1.8B': { ratedTorque: 1.8, maxTorque: 4.5, maxSpeed: 3500 },
  'HGTLJ2.2': { ratedTorque: 2.2, maxTorque: 5.5, maxSpeed: 3200 },
  'HGTLJ2.2A': { ratedTorque: 2.2, maxTorque: 5.5, maxSpeed: 3200 },
  'HGTLJ3.5Q': { ratedTorque: 3.5, maxTorque: 8.75, maxSpeed: 2800 },
  'HGTLJ7.5Q': { ratedTorque: 7.5, maxTorque: 18.75, maxSpeed: 2200 },

  // HGTHT系列 (高扭矩高弹联轴器 T型)
  'HGTHT4': {
    ratedTorque: 4.0,
    maxTorque: 10.0,
    maxSpeed: 3000
  },
  'HGTHT4.5': {
    ratedTorque: 4.5,
    maxTorque: 11.25,
    maxSpeed: 2800
  },
  'HGTHT5': {
    ratedTorque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 2600
  },
  'HGTHT6.3': {
    ratedTorque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 2400
  },
  'HGTHT6.3A': {
    ratedTorque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 2400
  },
  'HGTHT8.6': {
    ratedTorque: 8.6,
    maxTorque: 21.5,
    maxSpeed: 2000
  },
  // HGTHT带罩壳版本 (J后缀 - 接套型)
  'HGTHJ4': { ratedTorque: 4.0, maxTorque: 10.0, maxSpeed: 3000 },
  'HGTHJ4.5': { ratedTorque: 4.5, maxTorque: 11.25, maxSpeed: 2800 },
  'HGTHJ5': { ratedTorque: 5.0, maxTorque: 12.5, maxSpeed: 2600 },
  'HGTHJ6.3A': { ratedTorque: 6.3, maxTorque: 15.75, maxSpeed: 2400 },
  'HGTHJ8.6': { ratedTorque: 8.6, maxTorque: 21.5, maxSpeed: 2000 },

  // HGTHB系列 (大型高弹联轴器 B型)
  'HGTHB5': {
    ratedTorque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 2600
  },
  'HGTHB5A': {
    ratedTorque: 5.0,
    maxTorque: 12.5,
    maxSpeed: 2600
  },
  'HGTHB6.3': {
    ratedTorque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 2200
  },
  'HGTHB6.3A': {
    ratedTorque: 6.3,
    maxTorque: 15.75,
    maxSpeed: 2200
  },
  'HGTHB8': {
    ratedTorque: 8.0,
    maxTorque: 20.0,
    maxSpeed: 1800
  },
  'HGTHB8A': {
    ratedTorque: 8.0,
    maxTorque: 20.0,
    maxSpeed: 1800
  },
  'HGTHB10': {
    ratedTorque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 1600
  },
  'HGTHB10A': {
    ratedTorque: 10.0,
    maxTorque: 25.0,
    maxSpeed: 1600
  },
  'HGTHB12.5': {
    ratedTorque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 1400
  },
  'HGTHB12.5A': {
    ratedTorque: 12.5,
    maxTorque: 31.25,
    maxSpeed: 1400
  },
  'HGTHB16': {
    ratedTorque: 16.0,
    maxTorque: 40.0,
    maxSpeed: 1200
  },
  // HGTHB带罩壳版本 (J后缀)
  'HGTHBJ5': { ratedTorque: 5.0, maxTorque: 12.5, maxSpeed: 2600 },
  'HGTHBJ5A': { ratedTorque: 5.0, maxTorque: 12.5, maxSpeed: 2600 },
  'HGTHBJ6.3': { ratedTorque: 6.3, maxTorque: 15.75, maxSpeed: 2200 },
  'HGTHBJ6.3A': { ratedTorque: 6.3, maxTorque: 15.75, maxSpeed: 2200 },
  'HGTHBJ8': { ratedTorque: 8.0, maxTorque: 20.0, maxSpeed: 1800 },
  'HGTHBJ8A': { ratedTorque: 8.0, maxTorque: 20.0, maxSpeed: 1800 },
  'HGTHBJ10': { ratedTorque: 10.0, maxTorque: 25.0, maxSpeed: 1600 },
  'HGTHBJ10A': { ratedTorque: 10.0, maxTorque: 25.0, maxSpeed: 1600 },
  'HGTHBJ12.5': { ratedTorque: 12.5, maxTorque: 31.25, maxSpeed: 1400 },
  'HGTHBJ12.5A': { ratedTorque: 12.5, maxTorque: 31.25, maxSpeed: 1400 },
  'HGTHBJ16': { ratedTorque: 16.0, maxTorque: 40.0, maxSpeed: 1200 },

  // 老高弹系列 (HGTLX) - 备用参考
  'HGTLX3.5': { ratedTorque: 3.5, maxTorque: 8.75, maxSpeed: 2800 },
  'HGTLX4.5': { ratedTorque: 4.5, maxTorque: 11.25, maxSpeed: 2600 },
  'HGTLX4.9': { ratedTorque: 4.9, maxTorque: 12.25, maxSpeed: 2400 },
  'HGTLX8.6': { ratedTorque: 8.6, maxTorque: 21.5, maxSpeed: 2000 },

  // HGT老系列联轴器 (用于GWC/SGW工程船用齿轮箱)
  // 扭矩单位: kN·m, 转速单位: rpm
  'HGT1020': { ratedTorque: 10.0, maxTorque: 25.0, maxSpeed: 3000 },
  'HGT1220': { ratedTorque: 12.5, maxTorque: 31.25, maxSpeed: 2800 },
  'HGT1620': { ratedTorque: 16.0, maxTorque: 40.0, maxSpeed: 2600 },
  'HGT2020': { ratedTorque: 20.0, maxTorque: 50.0, maxSpeed: 2400 },
  'HGT2520': { ratedTorque: 25.0, maxTorque: 62.5, maxSpeed: 2200 },
  'HGT3020': { ratedTorque: 31.5, maxTorque: 78.75, maxSpeed: 2000 },
  'HGT4020': { ratedTorque: 40.0, maxTorque: 100.0, maxSpeed: 1800 },
  'HGT5020': { ratedTorque: 50.0, maxTorque: 125.0, maxSpeed: 1600 },
  'HGT6320': { ratedTorque: 63.0, maxTorque: 157.5, maxSpeed: 1400 },
  'HGT8020': { ratedTorque: 80.0, maxTorque: 200.0, maxSpeed: 1200 },
  'HGT10020': { ratedTorque: 100.0, maxTorque: 250.0, maxSpeed: 1000 },
  'HGT12520': { ratedTorque: 125.0, maxTorque: 312.5, maxSpeed: 900 },
  'HGT16020': { ratedTorque: 160.0, maxTorque: 400.0, maxSpeed: 800 },
  'HGT20020': { ratedTorque: 200.0, maxTorque: 500.0, maxSpeed: 700 },
  'HGT25020': { ratedTorque: 250.0, maxTorque: 625.0, maxSpeed: 600 }
};

/**
 * 联轴器工作条件系数映射表
 * 双模式支持: 厂家标准 vs JB/CCS船级社标准
 */

// 厂家标准 (FACTORY) - 原有系数，适用于一般工业应用
export const couplingWorkFactorMap_Factory = {
  'I类:扭矩变化很小': 1.0,
  'II类:扭矩变化小': 1.2,
  'III类:扭矩变化中等': 1.4,
  'IV类:扭矩变化大': 1.6,
  'V类:扭矩变化很大': 1.8,
  default: 1.4
};

// JB/CCS标准 - 符合JB/ZQ4383-86及CCS船级社要求
// 参考: JB/T7511-94《机械式联轴器选用计算》
export const couplingWorkFactorMap_JB_CCS = {
  'I类:扭矩变化很小': 1.3,    // JB标准Ⅰ类: 1.0-1.5, 取中值偏上
  'II类:扭矩变化小': 1.75,   // JB标准Ⅱ类: 1.5-2.5, 取中值
  'III类:扭矩变化中等': 2.5,  // JB标准Ⅲ类: 2.5-2.75, 取下限
  'IV类:扭矩变化大': 2.75,   // JB标准Ⅲ类上限/Ⅳ类下限
  'V类:扭矩变化很大': 3.0,   // JB标准Ⅳ类: >2.75
  default: 2.5  // 船用默认取III类
};

// 工况系数模式枚举
export const WorkFactorMode = {
  FACTORY: 'FACTORY',      // 厂家标准
  JB_CCS: 'JB_CCS'         // JB/CCS船级社标准
};

// 评分模式枚举
export const ScoringMode = {
  SAFETY: 'SAFETY',        // 安全优先
  ECONOMIC: 'ECONOMIC',    // 经济优先
  BALANCED: 'BALANCED'     // 平衡模式 (默认)
};

// 评分权重配置 (总权重=100)
export const scoringWeightConfigs = {
  // 安全优先: 扭矩余量最重要，价格权重最低
  [ScoringMode.SAFETY]: {
    torqueMargin: 50,      // 扭矩余量 (安全裕度)
    recommendation: 25,    // 型号匹配度
    speedMargin: 15,       // 转速匹配度
    price: 5,              // 价格
    weight: 5              // 重量
  },
  // 经济优先: 价格权重提高，扭矩余量权重降低
  [ScoringMode.ECONOMIC]: {
    torqueMargin: 30,      // 扭矩余量
    recommendation: 20,    // 型号匹配度
    speedMargin: 10,       // 转速匹配度
    price: 30,             // 价格 (权重提高)
    weight: 10             // 重量
  },
  // 平衡模式: 各项权重均衡
  [ScoringMode.BALANCED]: {
    torqueMargin: 25,      // 扭矩余量
    recommendation: 30,    // 型号匹配度
    speedMargin: 15,       // 转速匹配度
    price: 20,             // 价格
    weight: 10             // 重量
  }
};

/**
 * 获取评分权重配置
 * @param {string} mode 评分模式
 * @returns {object} 权重配置对象
 */
export const getScoringWeights = (mode = ScoringMode.BALANCED) => {
  return scoringWeightConfigs[mode] || scoringWeightConfigs[ScoringMode.BALANCED];
};

/**
 * 获取工况系数
 * @param {string} workCondition 工况类别
 * @param {string} mode 模式: 'FACTORY' | 'JB_CCS'
 * @returns {number} 工况系数K
 */
export const getWorkFactor = (workCondition, mode = WorkFactorMode.FACTORY) => {
  const factorMap = mode === WorkFactorMode.JB_CCS
    ? couplingWorkFactorMap_JB_CCS
    : couplingWorkFactorMap_Factory;
  return factorMap[workCondition] || factorMap.default;
};

// 保持向后兼容 - 默认使用厂家标准
export const couplingWorkFactorMap = couplingWorkFactorMap_Factory;

/**
 * 温度条件系数
 * @param {number} temperature 温度 (°C)
 * @param {boolean} returnWithWarning 是否返回带警告的对象 (默认false保持兼容)
 * @returns {number|{factor: number, warning: string|null}} 温度系数或带警告的对象
 */
export const getTemperatureFactor = (temperature, returnWithWarning = false) => {
  const temp = Number(temperature);
  let factor = 1.0;
  let warning = null;

  // 边界检查警告
  if (isNaN(temp)) {
    warning = '温度参数无效，使用默认系数1.0';
  } else if (temp < -10) {
    warning = `温度${temp}°C低于推荐范围(-10~50°C)，低温可能影响联轴器橡胶元件性能`;
    factor = 1.0; // 低温使用标准系数
  } else if (temp > 50) {
    warning = `温度${temp}°C超出推荐范围(-10~50°C)，建议确认联轴器高温耐受性`;
  }

  // 计算温度系数
  if (!isNaN(temp)) {
    if (temp <= 20) {
      factor = 1.0; // 标准温度
    } else if (temp <= 40) {
      factor = 1.1; // 轻微高温
    } else if (temp <= 60) {
      factor = 1.2; // 中等高温
    } else if (temp <= 80) {
      factor = 1.3; // 高温
    } else {
      factor = 1.4; // 极高温 (>80°C)
    }
  }

  // 兼容模式：默认只返回数值
  if (returnWithWarning) {
    return { factor, warning };
  }
  return factor;
};

/**
 * 齿轮箱与备用泵型号匹配表
 * key: 齿轮箱型号
 * value: 推荐的备用泵型号
 * 数据来源: 2025船用产品备用泵高弹对照表.xlsx "备用泵"列
 */
const gearboxToPumpMap = {
  // 1000系列 (备用泵: 2CY-5/2.5D)
  'HC1000': '2CY-5/2.5D',
  'HCD1000': '2CY-5/2.5D',
  'HCT1100': '2CY-5/2.5D',
  'HCW1100': '2CY-5/2.5D',
  'HC1200': '2CY-5/2.5D',
  'HC1200/1': '2CY-5/2.5D',
  'HCT1200': '2CY-5/2.5D',
  'HCT1200/1': '2CY-5/2.5D',
  'HCT1280/2': '2CY-5/2.5D',

  // 1400系列 (备用泵: 2CY-7.5/2.5D)
  'HCD1400': '2CY-7.5/2.5D',
  'HCT1400': '2CY-7.5/2.5D',
  'HCT1400/2': '2CY-7.5/2.5D',
  'HCW1400': '2CY-7.5/2.5D',
  'HC1600': '2CY-7.5/2.5D',
  'HCD1600': '2CY-7.5/2.5D',
  'HCT1600': '2CY-7.5/2.5D',
  'HCT1600/1': '2CY-7.5/2.5D',
  'HC2000': '2CY-7.5/2.5D',
  'HCD2000': '2CY-7.5/2.5D',
  'HCT2000': '2CY-7.5/2.5D',
  'HCT2000/1': '2CY-7.5/2.5D',

  // 2700系列 (备用泵: 2CY-14.2/2.5D)
  'HC2700': '2CY-14.2/2.5D',
  'HCD2700': '2CY-14.2/2.5D',
  'HCT2700': '2CY-14.2/2.5D',
  'HCT2700/1': '2CY-14.2/2.5D',

  // GWC系列 (工程船用系列)
  'GWC28.30': '2CY-7.5/2.5D',
  'GWC30.32': '2CY-7.5/2.5D',
  'GWC32.35': '2CY-7.5/2.5D',
  'GWC36.39': '2CY-7.5/2.5D',
  'GWC39.41': '2CY-7.5/2.5D',
  'GWC42.45': '2CY-7.5/2.5D',
  'GWC45.49': '2CY-7.5/2.5D',
  'GWC45.52': '2CY-7.5/2.5D',
  'GWC49.54': '2CY-14.2/2.5D',
  'GWC49.59': '2CY-14.2/2.5D',
  'GWC49.59A': '2CY-14.2/2.5D',
  'GWC52.59': '2CY-14.2/2.5D',
  'GWC52.59A': '2CY-14.2/2.5D',
  'GWC52.62': '2CY-14.2/2.5D',
  'GWC60.66': '2CY-19.2/2.5D',
  'GWC60.66A': '2CY-19.2/2.5D',
  'GWC60.74': '2CY-19.2/2.5D',
  'GWC60.74B': '2CY-19.2/2.5D',
  'GWC63.71': '2CY-24.8/2.5D',
  'GWC66.75': '2CY-24.8/2.5D',
  'GWC70.76': '2CY-24.8/2.5D',
  'GWC70.76C': '2CY-24.8/2.5D',
  'GWC70.85': '2CY-24.8/2.5D',
  'GWC70.85A': '2CY-24.8/2.5D',
  'GWC75.90': '2CY-24.8/2.5D',
  'GWC78.88': '2CY-24.8/2.5D',
  'GWC78.88A': '2CY-24.8/2.5D',

  // SGW系列
  'SGW39.41': '2CY-7.5/2.5D',
  'SGW42.45': '2CY-7.5/2.5D',
  'SGW49.54': '2CY-7.5/2.5D',

  // HCQ系列 (船用可倒顺系列)
  'HCQ1000': '2CY-5/2.5D',
  'HCQH1000': '2CY-5/2.5D',
  'HCQ1001': '2CY-5/2.5D',
  'HCQ1400': '2CY-7.5/2.5D',
  'HCQH1600': '2CY-7.5/2.5D',
  'HCQ1600': '2CY-7.5/2.5D',
  'HCQ1601': '2CY-7.5/2.5D',

  // HCA系列 (辅助推进系列 - 2025-01-03 完善)
  'HCA1000': '2CY-5/2.5D',    // 新增: 1000级别
  'HCA1400': '2CY-7.5/2.5D',
  'HCAM1400': '2CY-7.5/2.5D',
  'HCA1401': '2CY-7.5/2.5D',

  // HCM系列 (船用齿轮箱 - 2025-01-03 补充)
  'HCM1250': '2CY-5/2.5D',    // 新增: 300kW级别，与HC1200同规格
  'HCM1400': '2CY-7.5/2.5D',
  'HCM1600': '2CY-7.5/2.5D',  // 新增: 313kW级别，与HC1600同规格

  // DT系列 (电力推进系统)
  'DT180': '2CYA-1.1/0.8D',
  'DT210': '2CYA-1.1/0.8D',
  'DT240': '2CYA-1.1/0.8D',
  'DT280': '2CYA-1.1/0.8D',
  'DT580': '2CYA-1.1/0.8D',
  'DT770': '2CYA-1.1/0.8D',
  'DT900': '2CYA-1.7/0.8D',
  'DT1400': '2CYA-1.7/0.8D',
  'DT1500': '2CYA-2.2/1D',
  'DT2400': '2CYA-2.2/1D',
  'DT2500': '2CYA-2.2/1D',
  'DT4000': '2CY-4.2/2.5D',
  'DT4300': '2CY-4.2/2.5D',

  // GC系列 (工程船用齿轮箱)
  'GC600': '2CY-8.3/2.5D',
  'GC800': '2CY-12/2.5D',
  'GC1000': '2CY-14.2/2.5D',
  'GC1400': '2CY-17/2.5D',

  // SGWS系列 (工程船用加强型)
  'SGWS49.54': '2CY-7.5/2.5D',
  'SGWS52.59': '2CY-7.5/2.5D',
  'SGWS60.66': '2CY-12/2.5D',
  'SGWS66.75': '2CY-14.2/2.5D',
  'SGWS70.76': '2CY-14.2/2.5D',

  // GCS/GCH系列 (工程船用齿轮箱)
  'GCS320': '2CY-7.5/2.5D',
  'GCS350': '2CY-7.5/2.5D',
  'GCS390': '2CY-8.3/2.5D',
  'GCS410': '2CY-8.3/2.5D',
  'GCS450': '2CY-8.3/2.5D',
  'GCS490': '2CY-12/2.5D',
  'GCS540': '2CY-17/2.5D',
  'GCS590': '2CY-17/2.5D',
  'GCS660': '2CY-17/2.5D',
  'GCS750': '2CY-21/2.5D',
  'GCS760': '2CY-21/2.5D',
  'GCS850': '2CY-28/2.5D',

  // GCSE/GCHE系列 (工程船用双速齿轮箱)
  'GCSE5': '2CY-7.5/2.5D',
  'GCSE6': '2CY-8.3/2.5D',
  'GCSE9': '2CY-12/2.5D',
  'GCSE11': '2CY-12/2.5D',
  'GCSE15': '2CY-17/2.5D',
  'GCSE20': '2CY-17/2.5D',
  'GCSE26': '2CY-21/2.5D',
  'GCSE33': '2CY-21/2.5D',
  'GCSE44': '2CY-28/2.5D',

  // GCST/GCHT系列 (工程船用推力齿轮箱)
  'GCST5': '2CY-7.5/2.5D',
  'GCST6': '2CY-7.5/2.5D',
  'GCST9': '2CY-8.3/2.5D',
  'GCST11': '2CY-8.3/2.5D',
  'GCST15': '2CY-12/2.5D',
  'GCST20': '2CY-12/2.5D',
  'GCST26': '2CY-17/2.5D',
  'GCST33': '2CY-17/2.5D',
  'GCST44': '2CY-21/2.5D',
  'GCST66': '2CY-21/2.5D',
  'GCST77': '2CY-28/2.5D',
  'GCST91': '2CY-28/2.5D',
  'GCST108': '2CY-34.5/2.5D',
  'GCST115': '2CY-34.5/2.5D',
  'GCST135': '2CY-38/2.5D',
  'GCST170': '2CY-48.2/2.5D',

  // GWS系列 (工程船用双输出齿轮箱)
  'GWS28': '2CY-7.5/2.5D',
  'GWS30': '2CY-7.5/2.5D',
  'GWS32': '2CY-7.5/2.5D',
  'GWS36': '2CY-8.3/2.5D',
  'GWS39': '2CY-8.3/2.5D',
  'GWS42': '2CY-8.3/2.5D',
  'GWS45': '2CY-12/2.5D',
  'GWS49': '2CY-12/2.5D',
  'GWS52': '2CY-14.2/2.5D',
  'GWS60': '2CY-17/2.5D',
  'GWS63': '2CY-17/2.5D',
  'GWS66': '2CY-21/2.5D',
  'GWS70': '2CY-21/2.5D',

  // 2GWH系列 (双螺旋桨工程船用齿轮箱)
  '2GWH1060': '2CY-7.5/2.5D',
  '2GWH1830': '2CY-28/2.5D',
  '2GWH3140': '2CY-34.5/2.5D',
  '2GWH4100': '2CY-38/2.5D',
  '2GWH5410': '2CY-38/2.5D',
  '2GWH7050': '2CY-48.2/2.5D',
  '2GWH9250': '2CY-58/2.5D',

  // HCS系列 (标准船用齿轮箱)
  'HCS1000': '2CY-5/2.5D',
  'HCS1200': '2CY-5/2.5D',
  'HCS1600': '2CY-7.5/2.5D',
  'HCS2000': '2CY-7.5/2.5D',
  'HCS2700': '2CY-14.2/2.5D',

  // HCDS系列 (大功率双输出齿轮箱)
  'HCDS800': '2CY-5/2.5D',
  'HCDS1200': '2CY-5/2.5D',
  'HCDS1400': '2CY-7.5/2.5D',
  'HCDS1600': '2CY-7.5/2.5D',
  'HCDS2000': '2CY-7.5/2.5D',
  'HCDS2700': '2CY-14.2/2.5D',

  // HCTS系列 (推力型双输出齿轮箱)
  'HCTS800': '2CY-5/2.5D',
  'HCTS1200': '2CY-5/2.5D',
  'HCTS1400': '2CY-7.5/2.5D',
  'HCTS1600': '2CY-7.5/2.5D',
  'HCTS2000': '2CY-7.5/2.5D',
  'HCTS2700': '2CY-14.2/2.5D',

  // HCG系列 (高速齿轮箱)
  'HCG1220': '2CY-5/2.5D',
  'HCG1280': '2CY-5/2.5D',
  'HCG1305': '2CY-7.5/2.5D',
  'HCG5050': '2CY-14.2/2.5D',

  // HCAG系列 (倾角辅助推进齿轮箱)
  'HCAG7650': '2CY-14.2/2.5D',
  'HCAG9055': '2CY-19.2/2.5D'
};

/**
 * 根据齿轮箱型号获取推荐的联轴器信息
 * @param {string} gearboxModel 齿轮箱型号
 * @param {boolean} withCover 是否带罩壳
 * @returns {Object} { prefix: 推荐前缀, specific: 推荐型号 }
 */
export const getRecommendedCouplingInfo = (gearboxModel, withCover = false) => {
  if (!gearboxModel) {
    return { prefix: null, specific: null };
  }

  // 匹配完整型号
  const specificModel = gearboxToCouplingSpecificMap[gearboxModel];

  // 匹配前缀
  let prefixMatch = null;
  const prefixKeys = Object.keys(gearboxToCouplingPrefixMap);

  for (const prefix of prefixKeys) {
    if (gearboxModel.startsWith(prefix)) {
      // 找到最长匹配的前缀
      if (!prefixMatch || prefix.length > prefixMatch.length) {
        prefixMatch = prefix;
      }
    }
  }

  const recommendedPrefix = prefixMatch ? gearboxToCouplingPrefixMap[prefixMatch] : null;

  // 处理罩壳要求
  let finalSpecificModel = specificModel;
  if (withCover && specificModel && couplingWithCoverMap[specificModel]) {
    finalSpecificModel = couplingWithCoverMap[specificModel];
  }

  return {
    prefix: recommendedPrefix,
    specific: finalSpecificModel
  };
};

/**
 * 获取推荐的备用泵型号
 * @param {string} gearboxModel 齿轮箱型号
 * @returns {string} 推荐的备用泵型号，无匹配则返回null
 */
export const getRecommendedPump = (gearboxModel) => {
  if (!gearboxModel) return null;

  // 直接匹配完整型号
  if (gearboxToPumpMap[gearboxModel]) {
    return gearboxToPumpMap[gearboxModel];
  }

  // 匹配前缀
  const prefixKeys = Object.keys(gearboxToPumpMap);
  let longestPrefixMatch = '';
  let matchedPump = null;

  for (const prefix of prefixKeys) {
    if (gearboxModel.startsWith(prefix) && prefix.length > longestPrefixMatch.length) {
      longestPrefixMatch = prefix;
      matchedPump = gearboxToPumpMap[prefix];
    }
  }

  return matchedPump;
};

/**
 * 获取联轴器规格
 * @param {string} couplingModel 联轴器型号
 * @returns {Object} 联轴器规格对象，无匹配则返回null
 */
export const getCouplingSpecifications = (couplingModel) => {
  if (!couplingModel) return null;

  return couplingSpecificationsMap[couplingModel] || null;
};

/**
 * 联轴器选择规则表 - 用于自动匹配
 * 基于扭矩范围选择合适的联轴器
 */
export const COUPLING_SELECTION_RULES = [
  { maxTorque: 2.0, coupling: 'HGTL1.8A', series: 'HGTL' },
  { maxTorque: 2.5, coupling: 'HGTH2', series: 'HGTH' },
  { maxTorque: 3.0, coupling: 'HGTL2.2', series: 'HGTL' },
  { maxTorque: 4.5, coupling: 'HGTL3.5Q', series: 'HGTL' },
  { maxTorque: 5.0, coupling: 'HGTHT4', series: 'HGTHT' },
  { maxTorque: 5.5, coupling: 'HGTHT4.5', series: 'HGTHT' },
  { maxTorque: 6.5, coupling: 'HGTHT5', series: 'HGTHT' },
  { maxTorque: 8.0, coupling: 'HGTHT6.3A', series: 'HGTHT' },
  { maxTorque: 10.0, coupling: 'HGTHT8.6', series: 'HGTHT' },
  { maxTorque: 13.0, coupling: 'HGTHB5A', series: 'HGTHB' },
  { maxTorque: 16.0, coupling: 'HGTHB6.3A', series: 'HGTHB' },
  { maxTorque: 20.0, coupling: 'HGTHB8A', series: 'HGTHB' },
  { maxTorque: 25.0, coupling: 'HGTHB10A', series: 'HGTHB' },
  { maxTorque: 32.0, coupling: 'HGTHB12.5A', series: 'HGTHB' },
  { maxTorque: 45.0, coupling: 'HGTHB16', series: 'HGTHB' }
];

/**
 * 备用泵选择规则表
 */
export const PUMP_SELECTION_RULES = [
  { maxPower: 150, pump: null },
  { maxPower: 300, pump: '2CY-5/2.5D' },
  { maxPower: 500, pump: '2CY-7.5/2.5D' },
  { maxPower: 800, pump: '2CY-14.2/2.5D' },
  { maxPower: 1200, pump: '2CY-19.2/2.5D' },
  { maxPower: Infinity, pump: '2CY-24.8/2.5D' }
];

/**
 * 根据扭矩自动选择联轴器
 * @param {number} requiredTorque - 所需扭矩 (kN·m)
 * @returns {Object} 推荐的联轴器信息
 */
export const selectCouplingByTorque = (requiredTorque) => {
  for (const rule of COUPLING_SELECTION_RULES) {
    if (requiredTorque <= rule.maxTorque) {
      return {
        model: rule.coupling,
        series: rule.series,
        maxTorque: rule.maxTorque,
        source: 'auto'
      };
    }
  }
  // 超大扭矩使用最大规格
  return {
    model: 'HGTHB16',
    series: 'HGTHB',
    maxTorque: 45.0,
    source: 'auto'
  };
};

/**
 * 根据功率自动选择备用泵
 * @param {number} power - 功率 (kW)
 * @returns {string|null} 推荐的备用泵型号
 */
export const selectPumpByPower = (power) => {
  for (const rule of PUMP_SELECTION_RULES) {
    if (power <= rule.maxPower) {
      return rule.pump;
    }
  }
  return '2CY-24.8/2.5D';
};

/**
 * 智能匹配函数 - 结合已知映射和自动计算
 * @param {string} gearboxModel - 齿轮箱型号
 * @param {Object} gearboxData - 齿轮箱数据 (可选，用于计算)
 * @param {boolean} withCover - 是否带罩壳
 * @returns {Object} 完整的匹配结果
 */
export const getSmartCouplingMatch = (gearboxModel, gearboxData = null, withCover = false) => {
  const result = {
    coupling: null,
    couplingWithCover: null,
    couplingSpec: null,
    pump: null,
    source: 'none'
  };

  if (!gearboxModel) return result;

  // 1. 尝试已知映射
  const existingInfo = getRecommendedCouplingInfo(gearboxModel, withCover);
  const existingPump = getRecommendedPump(gearboxModel);

  if (existingInfo.specific) {
    result.coupling = existingInfo.specific;
    result.source = 'known';
  } else if (existingInfo.prefix) {
    result.coupling = existingInfo.prefix;
    result.source = 'prefix';
  }

  result.pump = existingPump;

  // 2. 如果没有已知映射且提供了齿轮箱数据，尝试自动计算
  if (!result.coupling && gearboxData) {
    // 计算扭矩
    let maxPower = gearboxData.maxPower || 0;
    if (!maxPower && gearboxData.transferCapacity && gearboxData.inputSpeedRange) {
      const maxCapacity = Math.max(...(Array.isArray(gearboxData.transferCapacity)
        ? gearboxData.transferCapacity : [gearboxData.transferCapacity]));
      const maxSpeed = gearboxData.inputSpeedRange[1] || 2000;
      maxPower = maxCapacity * maxSpeed;
    }

    const minSpeed = gearboxData.inputSpeedRange ? gearboxData.inputSpeedRange[0] : 1000;
    const torque = (9.55 * maxPower) / minSpeed * 1.5; // 带安全系数

    if (torque > 0) {
      const autoMatch = selectCouplingByTorque(torque);
      result.coupling = autoMatch.model;
      result.source = 'auto';
    }

    // 自动选择备用泵
    if (!result.pump && maxPower > 150) {
      result.pump = selectPumpByPower(maxPower);
    }
  }

  // 3. 获取带罩壳版本
  if (result.coupling && withCover && couplingWithCoverMap[result.coupling]) {
    result.couplingWithCover = couplingWithCoverMap[result.coupling];
  }

  // 4. 获取联轴器规格
  if (result.coupling) {
    result.couplingSpec = getCouplingSpecifications(result.coupling);
  }

  return result;
};

/**
 * 获取映射统计信息
 * @returns {Object} 统计信息
 */
export const getMappingStatistics = () => {
  const prefixCount = Object.keys(gearboxToCouplingPrefixMap).length;
  const specificCount = Object.keys(gearboxToCouplingSpecificMap).length;
  const pumpCount = Object.keys(gearboxToPumpMap).length;
  const couplingSpecCount = Object.keys(couplingSpecificationsMap).length;

  return {
    prefixMappings: prefixCount,
    specificMappings: specificCount,
    pumpMappings: pumpCount,
    couplingSpecifications: couplingSpecCount,
    total: prefixCount + specificCount
  };
};

/**
 * M3: 映射一致性校验工具
 * 检查 gearboxToCouplingSpecificMap 与 couplingGearboxMatching 的双向一致性
 * @param {Object} couplingGearboxData - 从 couplingGearboxMatching.js 导入的映射数据
 * @returns {Object} 校验结果，包含不一致项和统计信息
 */
export const validateMappingConsistency = (couplingGearboxData) => {
  const inconsistencies = [];
  const warnings = [];
  let checkedPairs = 0;

  // 1. 检查 gearboxToCouplingSpecificMap 中的映射是否在 couplingGearboxData 中有对应
  Object.entries(gearboxToCouplingSpecificMap).forEach(([gearbox, coupling]) => {
    if (!coupling) return; // 跳过 null 值

    checkedPairs++;
    const couplingMatches = couplingGearboxData[coupling];

    if (!couplingMatches) {
      // 联轴器型号在 couplingGearboxMatching 中不存在
      warnings.push({
        type: 'missing_coupling',
        message: `联轴器 ${coupling} (齿轮箱 ${gearbox} 推荐) 在 couplingGearboxMatching 中未定义`,
        gearbox,
        coupling
      });
    } else if (!couplingMatches.some(g => g === gearbox || gearbox.startsWith(g) || g.startsWith(gearbox.replace(/[A-Z]$/, '')))) {
      // 齿轮箱不在联轴器的匹配列表中
      inconsistencies.push({
        type: 'reverse_mapping_missing',
        message: `齿轮箱 ${gearbox} -> 联轴器 ${coupling}，但 ${coupling} 未包含 ${gearbox}`,
        gearbox,
        coupling,
        actualCouplingMatches: couplingMatches
      });
    }
  });

  // 2. 检查 couplingGearboxData 中的映射是否与 gearboxToCouplingSpecificMap 一致
  Object.entries(couplingGearboxData).forEach(([coupling, gearboxes]) => {
    gearboxes.forEach(gearbox => {
      const specificMapping = gearboxToCouplingSpecificMap[gearbox];

      // 如果齿轮箱有具体映射但指向不同的联轴器
      if (specificMapping && specificMapping !== coupling) {
        // 检查是否是同系列（允许 HGTH4 和 HGTH5 都映射到同一齿轮箱）
        const couplingBase = coupling.replace(/[0-9.]+[A-Z]?$/, '');
        const mappedBase = specificMapping.replace(/[0-9.]+[A-Z]?$/, '');

        if (couplingBase !== mappedBase) {
          inconsistencies.push({
            type: 'conflicting_mapping',
            message: `联轴器 ${coupling} 声明匹配 ${gearbox}，但 ${gearbox} 实际映射到 ${specificMapping}`,
            gearbox,
            declaredCoupling: coupling,
            actualMapping: specificMapping
          });
        }
      }
    });
  });

  const isConsistent = inconsistencies.length === 0;

  return {
    isConsistent,
    checkedPairs,
    inconsistencies,
    warnings,
    summary: {
      totalInconsistencies: inconsistencies.length,
      totalWarnings: warnings.length,
      status: isConsistent
        ? (warnings.length > 0 ? 'PASS_WITH_WARNINGS' : 'PASS')
        : 'FAIL'
    }
  };
};

/**
 * 获取所有齿轮箱到联轴器的映射（合并前缀和具体映射）
 * @returns {Object} 完整的齿轮箱-联轴器映射
 */
export const getAllGearboxCouplingMappings = () => {
  return {
    prefixMappings: { ...gearboxToCouplingPrefixMap },
    specificMappings: { ...gearboxToCouplingSpecificMap },
    coverMappings: { ...couplingWithCoverMap }
  };
};
