"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fillTemplate = exports.translateSpecialRequirements = exports.formatSpecialRequirements = exports.generateEnglishAgreement = exports.generateChineseAgreement = exports.generateCompleteAgreement = exports.generateSequentialAgreement = exports.generateSideBySideAgreement = exports.generateBilingualAgreement = exports.translateToEnglish = exports.generateCombinedBilingualTable = exports.generateSequentialBilingualTable = exports.generateBilingualTable = exports.getCurrentDate = exports.formatBilingualDate = exports.specialRequirementsFormatTemplate = exports.specialRequirementTemplates = exports.technicalTerminology = exports.bilingualTemplates = void 0;

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// src/utils/bilingualTemplates.js

/**
 * 双语模板库
 * 用于生成中英文对照的技术协议内容
 */
var bilingualTemplates = {
  // 技术参数部分
  technical_parameters: {
    chinese: "\n      <h2>2. \u6280\u672F\u53C2\u6570</h2>\n      <table class=\"table table-bordered\">\n        <thead>\n          <tr>\n            <th>\u53C2\u6570\u540D\u79F0</th>\n            <th>\u89C4\u683C</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td>\u578B\u53F7</td>\n            <td>{{model}}</td>\n          </tr>\n          <tr>\n            <td>\u989D\u5B9A\u529F\u7387</td>\n            <td>{{transmissionCapacity}} kW</td>\n          </tr>\n          <tr>\n            <td>\u51CF\u901F\u6BD4</td>\n            <td>{{reductionRatio}}</td>\n          </tr>\n          <tr>\n            <td>\u6700\u5927\u8F93\u5165\u8F6C\u901F</td>\n            <td>{{maxInputSpeed}} r/min</td>\n          </tr>\n          <tr>\n            <td>\u6DA6\u6ED1\u6CB9\u538B\u529B</td>\n            <td>{{lubricationOilPressure}} MPa</td>\n          </tr>\n          <tr>\n            <td>\u6700\u5927\u5141\u8BB8\u63A8\u529B</td>\n            <td>{{maxPropellerThrust}} kN</td>\n          </tr>\n          <tr>\n            <td>\u673A\u68B0\u6548\u7387</td>\n            <td>{{mechanicalEfficiency}}%</td>\n          </tr>\n          <tr>\n            <td>\u91CD\u91CF</td>\n            <td>{{weight}} kg</td>\n          </tr>\n        </tbody>\n      </table>\n    ",
    english: "\n      <h2>2. Technical Parameters</h2>\n      <table class=\"table table-bordered\">\n        <thead>\n          <tr>\n            <th>Parameter</th>\n            <th>Specification</th>\n          </tr>\n        </thead>\n        <tbody>\n          <tr>\n            <td>Model</td>\n            <td>{{model}}</td>\n          </tr>\n          <tr>\n            <td>Rated Power</td>\n            <td>{{transmissionCapacity}} kW</td>\n          </tr>\n          <tr>\n            <td>Reduction Ratio</td>\n            <td>{{reductionRatio}}</td>\n          </tr>\n          <tr>\n            <td>Maximum Input Speed</td>\n            <td>{{maxInputSpeed}} r/min</td>\n          </tr>\n          <tr>\n            <td>Lubrication Oil Pressure</td>\n            <td>{{lubricationOilPressure}} MPa</td>\n          </tr>\n          <tr>\n            <td>Maximum Allowable Thrust</td>\n            <td>{{maxPropellerThrust}} kN</td>\n          </tr>\n          <tr>\n            <td>Mechanical Efficiency</td>\n            <td>{{mechanicalEfficiency}}%</td>\n          </tr>\n          <tr>\n            <td>Weight</td>\n            <td>{{weight}} kg</td>\n          </tr>\n        </tbody>\n      </table>\n    "
  },
  // 概述部分
  overview: {
    chinese: "\n      <h2>1. \u6982\u8FF0</h2>\n      <p>\u672C\u6280\u672F\u534F\u8BAE\u89C4\u5B9A\u4E86\u8239\u7528\u9F7F\u8F6E\u7BB1\u578B\u53F7 {{model}} \u7684\u6280\u672F\u53C2\u6570\u3001\u6027\u80FD\u8981\u6C42\u53CA\u9A8C\u6536\u6807\u51C6\u3002\u672C\u9F7F\u8F6E\u7BB1\u9002\u7528\u4E8E{{shipType}}\u8239\uFF0C\u4E0E{{engineModel}}\u4E3B\u673A\u914D\u5957\u4F7F\u7528\u3002</p>\n    ",
    english: "\n      <h2>1. Overview</h2>\n      <p>This technical agreement specifies the technical parameters, performance requirements and acceptance criteria for marine gearbox model {{model}}. This gearbox is suitable for {{shipType}} vessel, and is designed to be used with {{engineModel}} main engine.</p>\n    "
  },
  // 性能要求部分
  performance_requirements: {
    chinese: "\n      <h2>3. \u6027\u80FD\u8981\u6C42</h2>\n      <p>\u9F7F\u8F6E\u7BB1\u5E94\u6EE1\u8DB3\u4EE5\u4E0B\u6027\u80FD\u8981\u6C42\uFF1A</p>\n      <ul>\n        <li>\u566A\u58F0\u6C34\u5E73\u4E0D\u8D85\u8FC7 85 \u5206\u8D1D</li>\n        <li>\u6CB9\u6E29\u4E0D\u8D85\u8FC7 {{maxOilTemperature}}\u2103</li>\n        <li>\u632F\u52A8\u6C34\u5E73\u7B26\u5408 ISO 8579 \u6807\u51C6</li>\n        <li>\u6548\u7387\u4E0D\u4F4E\u4E8E {{mechanicalEfficiency}}%</li>\n        <li>\u8F93\u5165\u8F74\u6700\u5927\u5141\u8BB8\u8F6C\u901F\uFF1A{{maxInputSpeed}} r/min</li>\n        <li>\u6700\u5927\u8F93\u51FA\u8F74\u63A8\u529B\uFF1A{{maxPropellerThrust}} kN</li>\n        <li>\u5BB9\u8BB8\u503E\u89D2\uFF1A\u7EB5\u5411 {{longitudinalInclination}}\xB0\uFF0C\u6A2A\u5411 {{transverseInclination}}\xB0</li>\n      </ul>\n    ",
    english: "\n      <h2>3. Performance Requirements</h2>\n      <p>The gearbox shall meet the following performance requirements:</p>\n      <ul>\n        <li>Noise level not exceeding 85 decibels</li>\n        <li>Oil temperature not exceeding {{maxOilTemperature}}\u2103</li>\n        <li>Vibration level complying with ISO 8579 standard</li>\n        <li>Efficiency not less than {{mechanicalEfficiency}}%</li>\n        <li>Maximum allowable input shaft speed: {{maxInputSpeed}} r/min</li>\n        <li>Maximum output shaft thrust: {{maxPropellerThrust}} kN</li>\n        <li>Allowable inclination: longitudinal {{longitudinalInclination}}\xB0, transverse {{transverseInclination}}\xB0</li>\n      </ul>\n    "
  },
  // 验收标准部分
  acceptance_criteria: {
    chinese: "\n      <h2>4. \u9A8C\u6536\u6807\u51C6</h2>\n      <p>\u9A8C\u6536\u6D4B\u8BD5\u5E94\u5305\u62EC\u4F46\u4E0D\u9650\u4E8E\u4EE5\u4E0B\u9879\u76EE\uFF1A</p>\n      <ol>\n        <li>\u7A7A\u8F7D\u8BD5\u9A8C\uFF1A\u68C0\u67E5\u9F7F\u8F6E\u7BB1\u5728\u7A7A\u8F7D\u72B6\u6001\u4E0B\u7684\u8FD0\u884C\u60C5\u51B5</li>\n        <li>\u8F7D\u8377\u8BD5\u9A8C\uFF1A\u68C0\u67E5\u9F7F\u8F6E\u7BB1\u5728\u989D\u5B9A\u8F7D\u8377\u4E0B\u7684\u8FD0\u884C\u60C5\u51B5</li>\n        <li>\u6CB9\u6E29\u6D4B\u8BD5\uFF1A\u8BB0\u5F55\u5E76\u786E\u8BA4\u9F7F\u8F6E\u7BB1\u5728\u8FD0\u884C\u8FC7\u7A0B\u4E2D\u7684\u6CB9\u6E29\u4E0D\u8D85\u8FC7{{maxOilTemperature}}\u2103</li>\n        <li>\u566A\u58F0\u6D4B\u8BD5\uFF1A\u6D4B\u91CF\u5E76\u8BB0\u5F55\u9F7F\u8F6E\u7BB1\u5728\u8FD0\u884C\u8FC7\u7A0B\u4E2D\u7684\u566A\u58F0\u6C34\u5E73</li>\n        <li>\u632F\u52A8\u6D4B\u8BD5\uFF1A\u6D4B\u91CF\u5E76\u8BB0\u5F55\u9F7F\u8F6E\u7BB1\u5728\u8FD0\u884C\u8FC7\u7A0B\u4E2D\u7684\u632F\u52A8\u6C34\u5E73</li>\n      </ol>\n    ",
    english: "\n      <h2>4. Acceptance Criteria</h2>\n      <p>Acceptance tests shall include but not be limited to the following items:</p>\n      <ol>\n        <li>No-load test: Check gearbox operation under no-load condition</li>\n        <li>Load test: Check gearbox operation under rated load</li>\n        <li>Oil temperature test: Record and confirm that oil temperature during operation does not exceed {{maxOilTemperature}}\u2103</li>\n        <li>Noise test: Measure and record noise level during operation</li>\n        <li>Vibration test: Measure and record vibration level during operation</li>\n      </ol>\n    "
  },
  // 质量保证部分
  quality_assurance: {
    chinese: "\n      <h2>5. \u8D28\u91CF\u4FDD\u8BC1</h2>\n      <p>\u4F9B\u65B9\u5BF9\u6240\u4F9B\u8D27\u7269\u7684\u8D28\u91CF\u3001\u89C4\u683C\u53CA\u6027\u80FD\u8D1F\u8D23\u3002\u8D28\u4FDD\u671F\u4E3A{{warrantyPeriod}}\uFF0C\u81EA\u9A8C\u6536\u5408\u683C\u4E4B\u65E5\u8D77\u8BA1\u7B97\u3002\u5728\u8D28\u4FDD\u671F\u5185\uFF0C\u56E0\u5236\u9020\u8D28\u91CF\u95EE\u9898\u9020\u6210\u7684\u635F\u574F\uFF0C\u4F9B\u65B9\u8D1F\u8D23\u514D\u8D39\u4FEE\u7406\u6216\u66F4\u6362\u3002</p>\n    ",
    english: "\n      <h2>5. Quality Assurance</h2>\n      <p>The supplier is responsible for the quality, specifications and performance of the supplied equipment. The warranty period is {{warrantyPeriod}}, starting from the date of acceptance. During the warranty period, the supplier shall be responsible for free repair or replacement of any damage caused by manufacturing quality issues.</p>\n    "
  },
  // 技术服务部分
  technical_service: {
    chinese: "\n      <h2>6. \u6280\u672F\u670D\u52A1</h2>\n      <p>\u4F9B\u65B9\u8D1F\u8D23\u9F7F\u8F6E\u7BB1\u7684\u5B89\u88C5\u6307\u5BFC\u548C\u8C03\u8BD5\u3002\u4F9B\u65B9\u5E94\u5728\u63A5\u5230\u9700\u65B9\u901A\u77E5\u540E{{feedbackPeriod}}\u5929\u5185\u6D3E\u6280\u672F\u4EBA\u5458\u5230\u73B0\u573A\u8FDB\u884C\u6280\u672F\u670D\u52A1\u3002\u4F9B\u65B9\u5E94\u63D0\u4F9B\u5FC5\u8981\u7684\u6280\u672F\u8D44\u6599\u3001\u56FE\u7EB8\u548C\u64CD\u4F5C\u624B\u518C\u3002</p>\n    ",
    english: "\n      <h2>6. Technical Service</h2>\n      <p>The supplier is responsible for the installation guidance and commissioning of the gearbox. The supplier shall send technical personnel to the site within {{feedbackPeriod}} days after receiving notification from the buyer. The supplier shall provide necessary technical materials, drawings and operation manuals.</p>\n    "
  },
  // 随机文件部分
  accompanying_documents: {
    chinese: "\n      <h2>7. \u968F\u673A\u6587\u4EF6</h2>\n      <p>\u4F9B\u65B9\u5E94\u63D0\u4F9B\u4EE5\u4E0B\u968F\u673A\u6587\u4EF6\uFF1A</p>\n      <ol>\n        <li>\u9F7F\u8F6E\u7BB1\u603B\u88C5\u56FE</li>\n        <li>\u4EA7\u54C1\u5408\u683C\u8BC1</li>\n        <li>\u88C5\u7BB1\u5355</li>\n        <li>\u8D28\u91CF\u8BC1\u660E\u4E66</li>\n        <li>\u4F7F\u7528\u8BF4\u660E\u4E66</li>\n        <li>\u7EF4\u4FEE\u624B\u518C</li>\n      </ol>\n    ",
    english: "\n      <h2>7. Accompanying Documents</h2>\n      <p>The supplier shall provide the following documents:</p>\n      <ol>\n        <li>Gearbox assembly drawing</li>\n        <li>Product certificate</li>\n        <li>Packing list</li>\n        <li>Quality certificate</li>\n        <li>Operation manual</li>\n        <li>Maintenance manual</li>\n      </ol>\n    "
  },
  // 特殊订货要求部分
  special_requirements: {
    chinese: "\n      <h2>8. \u7279\u6B8A\u8BA2\u8D27\u8981\u6C42</h2>\n      <div class=\"special-requirements-content\">\n        {{specialRequirements}}\n      </div>\n    ",
    english: "\n      <h2>8. Special Ordering Requirements</h2>\n      <div class=\"special-requirements-content\">\n        {{specialRequirements}}\n      </div>\n    "
  },
  // 表头模板
  header: {
    chinese: "\n      <div class=\"text-center mb-5\">\n        <h1 class=\"mb-4\">\u8239\u7528\u9F7F\u8F6E\u7BB1\u6280\u672F\u534F\u8BAE</h1>\n        <p class=\"mb-1\">\u9879\u76EE\u540D\u79F0\uFF1A{{projectName}}</p>\n        <p class=\"mb-1\">\u5BA2\u6237\u540D\u79F0\uFF1A{{shipOwner}}</p>\n        <p>\u65E5\u671F\uFF1A{{date}}</p>\n      </div>\n    ",
    english: "\n      <div class=\"text-center mb-5\">\n        <h1 class=\"mb-4\">Marine Gearbox Technical Agreement</h1>\n        <p class=\"mb-1\">Project Name: {{projectName}}</p>\n        <p class=\"mb-1\">Customer: {{shipOwner}}</p>\n        <p>Date: {{date}}</p>\n      </div>\n    "
  },
  // 签字栏模板
  signature: {
    chinese: "\n      <div class=\"row mt-5 mb-3 signature-area\">\n        <div class=\"col-6\">\n          <p>\u4F9B\u65B9\u4EE3\u8868\uFF1A________________</p>\n          <p>\u65E5\u671F\uFF1A_________________</p>\n        </div>\n        <div class=\"col-6\">\n          <p>\u9700\u65B9\u4EE3\u8868\uFF1A________________</p>\n          <p>\u65E5\u671F\uFF1A_________________</p>\n        </div>\n      </div>\n    ",
    english: "\n      <div class=\"row mt-5 mb-3 signature-area\">\n        <div class=\"col-6\">\n          <p>Supplier Representative: ________________</p>\n          <p>Date: _________________</p>\n        </div>\n        <div class=\"col-6\">\n          <p>Buyer Representative: ________________</p>\n          <p>Date: _________________</p>\n        </div>\n      </div>\n    "
  }
};
/**
 * 专业术语库
 * 确保技术术语翻译的准确性和一致性
 */

exports.bilingualTemplates = bilingualTemplates;
var technicalTerminology = {
  '船用齿轮箱': 'Marine Gearbox',
  '高弹性联轴器': 'Highly Flexible Coupling',
  '备用泵': 'Standby Pump',
  '减速比': 'Reduction Ratio',
  '额定功率': 'Rated Power',
  '输入轴': 'Input Shaft',
  '输出轴': 'Output Shaft',
  '旋转方向': 'Rotation Direction',
  '效率': 'Efficiency',
  '噪声': 'Noise',
  '振动': 'Vibration',
  '油温': 'Oil Temperature',
  '验收测试': 'Acceptance Test',
  '空载试验': 'No-load Test',
  '载荷试验': 'Load Test',
  '重量': 'Weight',
  '尺寸': 'Dimensions',
  '保修期': 'Warranty Period',
  '技术协议': 'Technical Agreement',
  '质量保证': 'Quality Assurance',
  '技术服务': 'Technical Service',
  '随机文件': 'Accompanying Documents',
  '特殊订货要求': 'Special Ordering Requirements',
  '供方': 'Supplier',
  '需方': 'Buyer',
  '装箱单': 'Packing List',
  '质量证明书': 'Quality Certificate',
  '使用说明书': 'Operation Manual',
  '维修手册': 'Maintenance Manual',
  '传递能力': 'Transmission Capacity',
  '最大输入转速': 'Maximum Input Speed',
  '润滑油压力': 'Lubrication Oil Pressure',
  '最大允许推力': 'Maximum Allowable Thrust',
  '机械效率': 'Mechanical Efficiency',
  '容许倾角': 'Allowable Inclination',
  '纵向': 'Longitudinal',
  '横向': 'Transverse',
  '分贝': 'Decibels',
  '合格': 'Qualified',
  '出厂检验': 'Factory Inspection',
  // 添加扩展术语库
  // 船舶相关术语
  '船舶': 'Vessel',
  '客运船': 'Passenger Vessel',
  '渔船': 'Fishing Vessel',
  '货船': 'Cargo Ship',
  '拖轮': 'Tugboat',
  '船艏': 'Bow',
  '船艉': 'Stern',
  '甲板': 'Deck',
  '舵': 'Rudder',
  '舱': 'Cabin',
  '船舶检验': 'Ship Inspection',
  '航行': 'Navigation',
  '推进系统': 'Propulsion System',
  '排水量': 'Displacement',
  '满载排水量': 'Full Load Displacement',
  // 齿轮箱相关术语
  '齿轮箱': 'Gearbox',
  '减速器': 'Reducer',
  '增速器': 'Increaser',
  '齿轮传动': 'Gear Transmission',
  '行星齿轮': 'Planetary Gear',
  '行星轮': 'Planet Gear',
  '太阳轮': 'Sun Gear',
  '内齿圈': 'Ring Gear',
  '齿轮比': 'Gear Ratio',
  '模数': 'Module',
  '压力角': 'Pressure Angle',
  '中心距': 'Center Distance',
  '啮合': 'Meshing',
  '齿形': 'Tooth Profile',
  '渐开线': 'Involute',
  '齿轮轴': 'Gear Shaft',
  '花键': 'Spline',
  '轴承': 'Bearing',
  '轴承座': 'Bearing Housing',
  '轴承盖': 'Bearing Cap',
  '密封': 'Seal',
  '油封': 'Oil Seal',
  // 联轴器相关术语
  '联轴器': 'Coupling',
  '挠性联轴器': 'Flexible Coupling',
  '刚性联轴器': 'Rigid Coupling',
  '膜片联轴器': 'Diaphragm Coupling',
  '万向节': 'Universal Joint',
  '弹性元件': 'Elastic Element',
  '传递扭矩': 'Transmit Torque',
  '缓冲': 'Buffer',
  '减振': 'Vibration Reduction',
  '联轴节': 'Coupling Joint',
  // 润滑系统相关术语
  '润滑系统': 'Lubrication System',
  '润滑泵': 'Lubrication Pump',
  '油位计': 'Oil Level Gauge',
  '油压表': 'Oil Pressure Gauge',
  '温度计': 'Thermometer',
  '冷却器': 'Cooler',
  '热交换器': 'Heat Exchanger',
  '滤油器': 'Oil Filter',
  '油路': 'Oil Circuit',
  '回油': 'Return Oil',
  '溢流阀': 'Relief Valve',
  '油底壳': 'Oil Sump',
  '加油口': 'Oil Filler',
  '排油口': 'Oil Drain'
}; // 特殊订货要求模板库

exports.technicalTerminology = technicalTerminology;
var specialRequirementTemplates = {
  // 性能参数类
  performance: {
    chinese: ["齿轮箱最大允许输入转速不超过{{maxInputSpeed}}r/min", "齿轮箱最大允许输出轴推力不超过{{maxPropellerThrust}}kN", "机械效率不低于{{mechanicalEfficiency}}%", "容许倾角：纵向{{longitudinalInclination}}°，横向{{transverseInclination}}°"],
    english: ["Maximum allowable input shaft speed of gearbox shall not exceed {{maxInputSpeed}}r/min", "Maximum allowable output shaft thrust shall not exceed {{maxPropellerThrust}}kN", "Mechanical efficiency shall not be less than {{mechanicalEfficiency}}%", "Allowable inclination: longitudinal {{longitudinalInclination}}°, transverse {{transverseInclination}}°"]
  },
  // 安装与连接类
  installation: {
    chinese: ["齿轮箱与船体基座为刚性安装", "齿轮箱安装由需方负责", "与主机的连接采用高弹性联轴器", "齿轮箱与螺旋桨轴的连接采用柔性联轴器"],
    english: ["The gearbox shall be rigidly installed on the ship foundation", "The buyer is responsible for the installation of gearbox", "Connection with the main engine shall use highly flexible coupling", "Connection between gearbox and propeller shaft shall use flexible coupling"]
  },
  // 冷却系统类
  cooling: {
    chinese: ["冷却水入口温度不超过{{coolingWaterInletTemperature}}℃", "冷却水用量不小于{{coolingWaterVolume}}t/h", "冷却水入口压力不超过{{coolingWaterPressure}}MPa", "适用海水或淡水冷却"],
    english: ["Cooling water inlet temperature shall not exceed {{coolingWaterInletTemperature}}℃", "Cooling water consumption shall not be less than {{coolingWaterVolume}}t/h", "Cooling water inlet pressure shall not exceed {{coolingWaterPressure}}MPa", "Suitable for seawater or freshwater cooling"]
  },
  // 润滑系统类
  lubrication: {
    chinese: ["润滑油压力为{{lubricationOilPressure}}MPa", "油温不超过{{maxOilTemperature}}℃", "油箱容积约{{oilCapacity}}L", "使用{{oilGrade}}号润滑油"],
    english: ["Lubrication oil pressure shall be {{lubricationOilPressure}}MPa", "Oil temperature shall not exceed {{maxOilTemperature}}℃", "Oil sump capacity approximately {{oilCapacity}}L", "Use {{oilGrade}} grade lubricating oil"]
  },
  // 监测与报警系统类
  monitoring: {
    chinese: ["配备润滑油压力表、油温表各一只", "配备润滑油低压报警装置，报警值{{lowOilPressureAlarm}}MPa", "配备油温高报警装置，报警值{{highOilTemperatureAlarm}}℃", "配备液位指示器"],
    english: ["Equipped with one lubrication oil pressure gauge and one oil temperature gauge", "Equipped with low oil pressure alarm device, alarm value {{lowOilPressureAlarm}}MPa", "Equipped with high oil temperature alarm device, alarm value {{highOilTemperatureAlarm}}℃", "Equipped with level indicator"]
  },
  // 操控系统类
  control: {
    chinese: ["采用电控操纵系统", "配备机旁应急操纵装置", "具有顺、倒车换向功能", "配备机械式或电子式远程控制系统"],
    english: ["Electric control system", "Equipped with local emergency control device", "With forward and reverse shifting function", "Equipped with mechanical or electronic remote control system"]
  },
  // 检验与文档类
  documentation: {
    chinese: ["按中国船级社规范检验", "随机提供安装、使用和维修说明书", "提供备件清单", "随机提供中英文产品合格证"],
    english: ["Inspection according to China Classification Society regulations", "Provide installation, operation and maintenance manual", "Provide spare parts list", "Provide product certificate in Chinese and English"]
  },
  // 特殊应用场景
  special: {
    chinese: ["带电动泵系统，型号待定", "带动力输出(PTO)装置", "带动力输入(PTI)装置", "带液压离合器", "需考虑高海况工作环境"],
    english: ["With electric pump system, model to be determined", "With Power Take-Off (PTO) device", "With Power Take-In (PTI) device", "With hydraulic clutch", "Need to consider high sea state working environment"]
  }
}; // 添加特殊订货要求展示格式模板

exports.specialRequirementTemplates = specialRequirementTemplates;
var specialRequirementsFormatTemplate = {
  numbered: {
    chinese: "{{index}}. {{content}}",
    english: "{{index}}. {{content}}"
  },
  bullet: {
    chinese: "• {{content}}",
    english: "• {{content}}"
  },
  plain: {
    chinese: "{{content}}",
    english: "{{content}}"
  }
}; // 添加格式化函数

/**
 * 格式化日期的中英文表示
 * @param {Date|string} date - 日期对象或日期字符串
 * @returns {Object} 包含中英文日期表示的对象
 */

exports.specialRequirementsFormatTemplate = specialRequirementsFormatTemplate;

var formatBilingualDate = function formatBilingualDate(date) {
  var dateObj = date instanceof Date ? date : new Date(date);

  if (isNaN(dateObj.getTime())) {
    return {
      chinese: '',
      english: ''
    };
  }

  var year = dateObj.getFullYear();
  var month = dateObj.getMonth() + 1;
  var day = dateObj.getDate(); // 中文日期格式

  var chineseDate = "".concat(year, "\u5E74").concat(month, "\u6708").concat(day, "\u65E5"); // 英文日期格式

  var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var englishDate = "".concat(months[month - 1], " ").concat(day, ", ").concat(year);
  return {
    chinese: chineseDate,
    english: englishDate
  };
};
/**
 * 生成当前日期的中英文表示
 * @returns {Object} 包含中文和英文日期表示的对象
 */


exports.formatBilingualDate = formatBilingualDate;

var getCurrentDate = function getCurrentDate() {
  return formatBilingualDate(new Date());
};
/**
 * 添加双语表格生成函数
 */

/**
 * 生成双语技术参数表格
 * 左右对照布局专用
 * @param {Object} templateData - 数据对象
 * @returns {string} HTML字符串
 */


exports.getCurrentDate = getCurrentDate;

var generateBilingualTable = function generateBilingualTable(templateData) {
  return "\n    <div class=\"row\">\n      <div class=\"col-6 chinese-content\">\n        <h2>2. \u6280\u672F\u53C2\u6570</h2>\n        <table class=\"table table-bordered\">\n          <thead>\n            <tr>\n              <th>\u53C2\u6570\u540D\u79F0</th>\n              <th>\u89C4\u683C</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>\u578B\u53F7</td>\n              <td>".concat(templateData.model || '', "</td>\n            </tr>\n            <tr>\n              <td>\u989D\u5B9A\u529F\u7387</td>\n              <td>").concat(templateData.transmissionCapacity || '', " kW</td>\n            </tr>\n            <tr>\n              <td>\u51CF\u901F\u6BD4</td>\n              <td>").concat(templateData.reductionRatio || '', "</td>\n            </tr>\n            <tr>\n              <td>\u6700\u5927\u8F93\u5165\u8F6C\u901F</td>\n              <td>").concat(templateData.maxInputSpeed || '', " r/min</td>\n            </tr>\n            <tr>\n              <td>\u6DA6\u6ED1\u6CB9\u538B\u529B</td>\n              <td>").concat(templateData.lubricationOilPressure || '', " MPa</td>\n            </tr>\n            <tr>\n              <td>\u6700\u5927\u5141\u8BB8\u63A8\u529B</td>\n              <td>").concat(templateData.maxPropellerThrust || '', " kN</td>\n            </tr>\n            <tr>\n              <td>\u673A\u68B0\u6548\u7387</td>\n              <td>").concat(templateData.mechanicalEfficiency || '', "%</td>\n            </tr>\n            <tr>\n              <td>\u91CD\u91CF</td>\n              <td>").concat(templateData.weight || '', " kg</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n      <div class=\"col-6 english-content\">\n        <h2>2. Technical Parameters</h2>\n        <table class=\"table table-bordered\">\n          <thead>\n            <tr>\n              <th>Parameter</th>\n              <th>Specification</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>Model</td>\n              <td>").concat(templateData.model || '', "</td>\n            </tr>\n            <tr>\n              <td>Rated Power</td>\n              <td>").concat(templateData.transmissionCapacity || '', " kW</td>\n            </tr>\n            <tr>\n              <td>Reduction Ratio</td>\n              <td>").concat(templateData.reductionRatio || '', "</td>\n            </tr>\n            <tr>\n              <td>Maximum Input Speed</td>\n              <td>").concat(templateData.maxInputSpeed || '', " r/min</td>\n            </tr>\n            <tr>\n              <td>Lubrication Oil Pressure</td>\n              <td>").concat(templateData.lubricationOilPressure || '', " MPa</td>\n            </tr>\n            <tr>\n              <td>Maximum Allowable Thrust</td>\n              <td>").concat(templateData.maxPropellerThrust || '', " kN</td>\n            </tr>\n            <tr>\n              <td>Mechanical Efficiency</td>\n              <td>").concat(templateData.mechanicalEfficiency || '', "%</td>\n            </tr>\n            <tr>\n              <td>Weight</td>\n              <td>").concat(templateData.weight || '', " kg</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ");
};
/**
 * 生成双语技术参数表格 - 分段对照布局
 * @param {Object} templateData - 数据对象
 * @returns {string} HTML字符串
 */


exports.generateBilingualTable = generateBilingualTable;

var generateSequentialBilingualTable = function generateSequentialBilingualTable(templateData) {
  return "\n    <div class=\"bilingual-section\">\n      <h2 class=\"section-title\">2. \u6280\u672F\u53C2\u6570 / Technical Parameters</h2>\n      \n      <h3>\u4E2D\u6587 / Chinese</h3>\n      <div class=\"chinese-content\">\n        <table class=\"table table-bordered\">\n          <thead>\n            <tr>\n              <th>\u53C2\u6570\u540D\u79F0</th>\n              <th>\u89C4\u683C</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>\u578B\u53F7</td>\n              <td>".concat(templateData.model || '', "</td>\n            </tr>\n            <tr>\n              <td>\u989D\u5B9A\u529F\u7387</td>\n              <td>").concat(templateData.transmissionCapacity || '', " kW</td>\n            </tr>\n            <tr>\n              <td>\u51CF\u901F\u6BD4</td>\n              <td>").concat(templateData.reductionRatio || '', "</td>\n            </tr>\n            <tr>\n              <td>\u6700\u5927\u8F93\u5165\u8F6C\u901F</td>\n              <td>").concat(templateData.maxInputSpeed || '', " r/min</td>\n            </tr>\n            <tr>\n              <td>\u6DA6\u6ED1\u6CB9\u538B\u529B</td>\n              <td>").concat(templateData.lubricationOilPressure || '', " MPa</td>\n            </tr>\n            <tr>\n              <td>\u6700\u5927\u5141\u8BB8\u63A8\u529B</td>\n              <td>").concat(templateData.maxPropellerThrust || '', " kN</td>\n            </tr>\n            <tr>\n              <td>\u673A\u68B0\u6548\u7387</td>\n              <td>").concat(templateData.mechanicalEfficiency || '', "%</td>\n            </tr>\n            <tr>\n              <td>\u91CD\u91CF</td>\n              <td>").concat(templateData.weight || '', " kg</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n      \n      <h3>\u82F1\u6587 / English</h3>\n      <div class=\"english-content\">\n        <table class=\"table table-bordered\">\n          <thead>\n            <tr>\n              <th>Parameter</th>\n              <th>Specification</th>\n            </tr>\n          </thead>\n          <tbody>\n            <tr>\n              <td>Model</td>\n              <td>").concat(templateData.model || '', "</td>\n            </tr>\n            <tr>\n              <td>Rated Power</td>\n              <td>").concat(templateData.transmissionCapacity || '', " kW</td>\n            </tr>\n            <tr>\n              <td>Reduction Ratio</td>\n              <td>").concat(templateData.reductionRatio || '', "</td>\n            </tr>\n            <tr>\n              <td>Maximum Input Speed</td>\n              <td>").concat(templateData.maxInputSpeed || '', " r/min</td>\n            </tr>\n            <tr>\n              <td>Lubrication Oil Pressure</td>\n              <td>").concat(templateData.lubricationOilPressure || '', " MPa</td>\n            </tr>\n            <tr>\n              <td>Maximum Allowable Thrust</td>\n              <td>").concat(templateData.maxPropellerThrust || '', " kN</td>\n            </tr>\n            <tr>\n              <td>Mechanical Efficiency</td>\n              <td>").concat(templateData.mechanicalEfficiency || '', "%</td>\n            </tr>\n            <tr>\n              <td>Weight</td>\n              <td>").concat(templateData.weight || '', " kg</td>\n            </tr>\n          </tbody>\n        </table>\n      </div>\n    </div>\n  ");
};
/**
 * 生成四列整合双语表格
 * 适用于分段对照和全文对照布局
 * @param {Object} templateData - 数据对象
 * @returns {string} HTML字符串
 */


exports.generateSequentialBilingualTable = generateSequentialBilingualTable;

var generateCombinedBilingualTable = function generateCombinedBilingualTable(templateData) {
  return "\n    <table class=\"table table-bordered bilingual-table\">\n      <thead>\n        <tr>\n          <th class=\"chinese-header\">\u53C2\u6570</th>\n          <th class=\"english-header\">Parameter</th>\n          <th class=\"chinese-header\">\u89C4\u683C</th>\n          <th class=\"english-header\">Specification</th>\n        </tr>\n      </thead>\n      <tbody>\n        <tr>\n          <td class=\"chinese-content\">\u578B\u53F7</td>\n          <td class=\"english-content\">Model</td>\n          <td colspan=\"2\" class=\"text-center\">".concat(templateData.model || '', "</td>\n        </tr>\n        <tr>\n          <td class=\"chinese-content\">\u989D\u5B9A\u529F\u7387</td>\n          <td class=\"english-content\">Rated Power</td>\n          <td colspan=\"2\" class=\"text-center\">").concat(templateData.transmissionCapacity || '', " kW</td>\n        </tr>\n        <tr>\n          <td class=\"chinese-content\">\u51CF\u901F\u6BD4</td>\n          <td class=\"english-content\">Reduction Ratio</td>\n          <td colspan=\"2\" class=\"text-center\">").concat(templateData.reductionRatio || '', "</td>\n        </tr>\n        <tr>\n          <td class=\"chinese-content\">\u6700\u5927\u8F93\u5165\u8F6C\u901F</td>\n          <td class=\"english-content\">Maximum Input Speed</td>\n          <td colspan=\"2\" class=\"text-center\">").concat(templateData.maxInputSpeed || '', " r/min</td>\n        </tr>\n        <tr>\n          <td class=\"chinese-content\">\u6DA6\u6ED1\u6CB9\u538B\u529B</td>\n          <td class=\"english-content\">Lubrication Oil Pressure</td>\n          <td colspan=\"2\" class=\"text-center\">").concat(templateData.lubricationOilPressure || '', " MPa</td>\n        </tr>\n        <tr>\n          <td class=\"chinese-content\">\u6700\u5927\u5141\u8BB8\u63A8\u529B</td>\n          <td class=\"english-content\">Maximum Allowable Thrust</td>\n          <td colspan=\"2\" class=\"text-center\">").concat(templateData.maxPropellerThrust || '', " kN</td>\n        </tr>\n        <tr>\n          <td class=\"chinese-content\">\u673A\u68B0\u6548\u7387</td>\n          <td class=\"english-content\">Mechanical Efficiency</td>\n          <td colspan=\"2\" class=\"text-center\">").concat(templateData.mechanicalEfficiency || '', "%</td>\n        </tr>\n        <tr>\n          <td class=\"chinese-content\">\u91CD\u91CF</td>\n          <td class=\"english-content\">Weight</td>\n          <td colspan=\"2\" class=\"text-center\">").concat(templateData.weight || '', " kg</td>\n        </tr>\n      </tbody>\n    </table>\n  ");
};
/**
 * 将中文内容翻译为英文
 * 使用术语库确保专业术语翻译准确
 * @param {string} chineseText - 需要翻译的中文文本
 * @returns {string} 翻译后的英文文本
 */


exports.generateCombinedBilingualTable = generateCombinedBilingualTable;

var translateToEnglish = function translateToEnglish(chineseText) {
  var englishText = chineseText; // 替换术语库中的术语

  Object.keys(technicalTerminology).forEach(function (term) {
    var englishTerm = technicalTerminology[term]; // 使用正则表达式替换整个词语

    var regex = new RegExp(term, 'g');
    englishText = englishText.replace(regex, englishTerm);
  }); // 返回翻译后的文本

  return englishText;
};
/**
 * 生成完整的双语技术协议
 * @param {Object} templateData - 技术协议数据
 * @param {string} layout - 布局样式 ('side-by-side', 'sequential', 'complete')
 * @returns {string} 完整的HTML文档字符串
 */


exports.translateToEnglish = translateToEnglish;

var generateBilingualAgreement = function generateBilingualAgreement(templateData) {
  var layout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'side-by-side';
  // 获取当前日期
  var date = getCurrentDate();
  templateData.date = date.chinese;
  templateData.dateEnglish = date.english; // 根据布局类型生成不同格式的双语协议

  switch (layout) {
    case 'side-by-side':
      return generateSideBySideAgreement(templateData);

    case 'sequential':
      return generateSequentialAgreement(templateData);

    case 'complete':
      return generateCompleteAgreement(templateData);

    default:
      return generateSideBySideAgreement(templateData);
  }
};
/**
 * 生成并排布局的双语技术协议
 * @param {Object} templateData - 技术协议数据
 * @returns {string} HTML文档字符串
 */


exports.generateBilingualAgreement = generateBilingualAgreement;

var generateSideBySideAgreement = function generateSideBySideAgreement(templateData) {
  // 添加双语协议样式
  var styles = "\n    <style>\n      .bilingual-document {\n        font-family: Arial, SimSun, sans-serif;\n      }\n      .chinese-content {\n        font-family: SimSun, \"\u5B8B\u4F53\", sans-serif;\n      }\n      .english-content {\n        font-family: Arial, sans-serif;\n      }\n      .bilingual-section {\n        margin-bottom: 2rem;\n      }\n      h1, h2, h3 {\n        margin-bottom: 1rem;\n      }\n      table {\n        width: 100%;\n        border-collapse: collapse;\n        margin-bottom: 1rem;\n      }\n      table, th, td {\n        border: 1px solid #ddd;\n      }\n      th, td {\n        padding: 8px;\n        text-align: left;\n      }\n      th {\n        background-color: #f2f2f2;\n      }\n    </style>\n  "; // 拼接双语表头

  var header = "\n    <div class=\"bilingual-section\">\n      <div class=\"row\">\n        <div class=\"col-6 chinese-content\">\n          ".concat(fillTemplate(bilingualTemplates.header.chinese, templateData), "\n        </div>\n        <div class=\"col-6 english-content\">\n          ").concat(fillTemplate(bilingualTemplates.header.english, _objectSpread({}, templateData, {
    date: templateData.dateEnglish
  })), "\n        </div>\n      </div>\n    </div>\n  "); // 拼接双语内容各部分

  var sections = []; // 概述部分

  sections.push("\n    <div class=\"bilingual-section\">\n      <div class=\"row\">\n        <div class=\"col-6 chinese-content\">\n          ".concat(fillTemplate(bilingualTemplates.overview.chinese, templateData), "\n        </div>\n        <div class=\"col-6 english-content\">\n          ").concat(fillTemplate(bilingualTemplates.overview.english, templateData), "\n        </div>\n      </div>\n    </div>\n  ")); // 技术参数部分 - 使用优化的双语表格

  sections.push(generateBilingualTable(templateData)); // 性能要求部分

  sections.push("\n    <div class=\"bilingual-section\">\n      <div class=\"row\">\n        <div class=\"col-6 chinese-content\">\n          ".concat(fillTemplate(bilingualTemplates.performance_requirements.chinese, templateData), "\n        </div>\n        <div class=\"col-6 english-content\">\n          ").concat(fillTemplate(bilingualTemplates.performance_requirements.english, templateData), "\n        </div>\n      </div>\n    </div>\n  ")); // 验收标准部分

  sections.push("\n    <div class=\"bilingual-section\">\n      <div class=\"row\">\n        <div class=\"col-6 chinese-content\">\n          ".concat(fillTemplate(bilingualTemplates.acceptance_criteria.chinese, templateData), "\n        </div>\n        <div class=\"col-6 english-content\">\n          ").concat(fillTemplate(bilingualTemplates.acceptance_criteria.english, templateData), "\n        </div>\n      </div>\n    </div>\n  ")); // 质量保证部分

  if (templateData.includeQualitySection) {
    sections.push("\n      <div class=\"bilingual-section\">\n        <div class=\"row\">\n          <div class=\"col-6 chinese-content\">\n            ".concat(fillTemplate(bilingualTemplates.quality_assurance.chinese, templateData), "\n          </div>\n          <div class=\"col-6 english-content\">\n            ").concat(fillTemplate(bilingualTemplates.quality_assurance.english, templateData), "\n          </div>\n        </div>\n      </div>\n    "));
  } // 技术服务部分


  if (templateData.includeMaintenanceSection) {
    sections.push("\n      <div class=\"bilingual-section\">\n        <div class=\"row\">\n          <div class=\"col-6 chinese-content\">\n            ".concat(fillTemplate(bilingualTemplates.technical_service.chinese, templateData), "\n          </div>\n          <div class=\"col-6 english-content\">\n            ").concat(fillTemplate(bilingualTemplates.technical_service.english, templateData), "\n          </div>\n        </div>\n      </div>\n    "));
  } // 随机文件部分


  if (templateData.includeAttachmentSection) {
    sections.push("\n      <div class=\"bilingual-section\">\n        <div class=\"row\">\n          <div class=\"col-6 chinese-content\">\n            ".concat(fillTemplate(bilingualTemplates.accompanying_documents.chinese, templateData), "\n          </div>\n          <div class=\"col-6 english-content\">\n            ").concat(fillTemplate(bilingualTemplates.accompanying_documents.english, templateData), "\n          </div>\n        </div>\n      </div>\n    "));
  } // 特殊订货要求部分


  if (templateData.specialRequirements && templateData.specialRequirements !== '无') {
    // 使用格式化函数处理特殊订货要求
    var formattedRequirements = formatSpecialRequirements(templateData.specialRequirements, templateData.specialRequirementsFormat || 'numbered');
    sections.push("\n      <div class=\"bilingual-section\">\n        <div class=\"row\">\n          <div class=\"col-6 chinese-content\">\n            ".concat(fillTemplate(bilingualTemplates.special_requirements.chinese, _objectSpread({}, templateData, {
      specialRequirements: formattedRequirements.chinese
    })), "\n          </div>\n          <div class=\"col-6 english-content\">\n            ").concat(fillTemplate(bilingualTemplates.special_requirements.english, _objectSpread({}, templateData, {
      specialRequirements: formattedRequirements.english
    })), "\n          </div>\n        </div>\n      </div>\n    "));
  } // 签字栏


  var signature = "\n    <div class=\"bilingual-section\">\n      <div class=\"row\">\n        <div class=\"col-6 chinese-content\">\n          ".concat(fillTemplate(bilingualTemplates.signature.chinese, templateData), "\n        </div>\n        <div class=\"col-6 english-content\">\n          ").concat(fillTemplate(bilingualTemplates.signature.english, templateData), "\n        </div>\n      </div>\n    </div>\n  "); // 组装完整文档

  return "\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"UTF-8\">\n      <title>\u8239\u7528\u9F7F\u8F6E\u7BB1\u6280\u672F\u534F\u8BAE / Marine Gearbox Technical Agreement</title>\n      ".concat(styles, "\n      <link rel=\"stylesheet\" href=\"../styles/bilingualStyles.css\">\n    </head>\n    <body>\n      <div class=\"container bilingual-document side-by-side\">\n        ").concat(header, "\n        ").concat(sections.join('\n'), "\n        ").concat(signature, "\n      </div>\n    </body>\n    </html>\n  ");
};
/**
 * 生成分段对照的双语技术协议
 * @param {Object} templateData - 技术协议数据
 * @returns {string} HTML文档字符串
 */


exports.generateSideBySideAgreement = generateSideBySideAgreement;

var generateSequentialAgreement = function generateSequentialAgreement(templateData) {
  // 添加双语协议样式
  var styles = "\n    <style>\n      .bilingual-document {\n        font-family: Arial, SimSun, sans-serif;\n      }\n      .chinese-content {\n        font-family: SimSun, \"\u5B8B\u4F53\", sans-serif;\n        margin-bottom: 1rem;\n      }\n      .english-content {\n        font-family: Arial, sans-serif;\n        margin-bottom: 2rem;\n        color: #444;\n      }\n      .bilingual-section {\n        margin-bottom: 2rem;\n      }\n      h1, h2, h3 {\n        margin-bottom: 1rem;\n      }\n      .section-title {\n        border-bottom: 1px solid #ddd;\n        padding-bottom: 0.5rem;\n        margin-bottom: 1rem;\n      }\n      table {\n        width: 100%;\n        border-collapse: collapse;\n        margin-bottom: 1rem;\n      }\n      table, th, td {\n        border: 1px solid #ddd;\n      }\n      th, td {\n        padding: 8px;\n        text-align: left;\n      }\n      th {\n        background-color: #f2f2f2;\n      }\n    </style>\n  "; // 头部

  var header = "\n    <div class=\"text-center mb-5\">\n      <h1 class=\"mb-4\">\u8239\u7528\u9F7F\u8F6E\u7BB1\u6280\u672F\u534F\u8BAE / Marine Gearbox Technical Agreement</h1>\n      <p class=\"mb-1\">\u9879\u76EE\u540D\u79F0 / Project Name: ".concat(templateData.projectName || '', "</p>\n      <p class=\"mb-1\">\u5BA2\u6237\u540D\u79F0 / Customer: ").concat(templateData.shipOwner || '', "</p>\n      <p>\u65E5\u671F / Date: ").concat(templateData.date, " / ").concat(templateData.dateEnglish, "</p>\n    </div>\n  "); // 构建各个部分

  var sections = []; // 概述部分

  sections.push("\n    <div class=\"bilingual-section\">\n      <h2 class=\"section-title\">1. \u6982\u8FF0 / Overview</h2>\n      <div class=\"chinese-content\">\n        ".concat(fillTemplate(bilingualTemplates.overview.chinese, templateData).replace('<h2>1. 概述</h2>', ''), "\n      </div>\n      <div class=\"english-content\">\n        ").concat(fillTemplate(bilingualTemplates.overview.english, templateData).replace('<h2>1. Overview</h2>', ''), "\n      </div>\n    </div>\n  ")); // 技术参数部分 - 使用分段对照表格

  sections.push(generateSequentialBilingualTable(templateData)); // 性能要求部分

  sections.push("\n    <div class=\"bilingual-section\">\n      <h2 class=\"section-title\">3. \u6027\u80FD\u8981\u6C42 / Performance Requirements</h2>\n      <div class=\"chinese-content\">\n        ".concat(fillTemplate(bilingualTemplates.performance_requirements.chinese, templateData).replace('<h2>3. 性能要求</h2>', ''), "\n      </div>\n      <div class=\"english-content\">\n        ").concat(fillTemplate(bilingualTemplates.performance_requirements.english, templateData).replace('<h2>3. Performance Requirements</h2>', ''), "\n      </div>\n    </div>\n  ")); // 验收标准部分

  sections.push("\n    <div class=\"bilingual-section\">\n      <h2 class=\"section-title\">4. \u9A8C\u6536\u6807\u51C6 / Acceptance Criteria</h2>\n      <div class=\"chinese-content\">\n        ".concat(fillTemplate(bilingualTemplates.acceptance_criteria.chinese, templateData).replace('<h2>4. 验收标准</h2>', ''), "\n      </div>\n      <div class=\"english-content\">\n        ").concat(fillTemplate(bilingualTemplates.acceptance_criteria.english, templateData).replace('<h2>4. Acceptance Criteria</h2>', ''), "\n      </div>\n    </div>\n  ")); // 质量保证部分

  if (templateData.includeQualitySection) {
    sections.push("\n      <div class=\"bilingual-section\">\n        <h2 class=\"section-title\">5. \u8D28\u91CF\u4FDD\u8BC1 / Quality Assurance</h2>\n        <div class=\"chinese-content\">\n          ".concat(fillTemplate(bilingualTemplates.quality_assurance.chinese, templateData).replace('<h2>5. 质量保证</h2>', ''), "\n        </div>\n        <div class=\"english-content\">\n          ").concat(fillTemplate(bilingualTemplates.quality_assurance.english, templateData).replace('<h2>5. Quality Assurance</h2>', ''), "\n        </div>\n      </div>\n    "));
  } // 技术服务部分


  if (templateData.includeMaintenanceSection) {
    sections.push("\n      <div class=\"bilingual-section\">\n        <h2 class=\"section-title\">6. \u6280\u672F\u670D\u52A1 / Technical Service</h2>\n        <div class=\"chinese-content\">\n          ".concat(fillTemplate(bilingualTemplates.technical_service.chinese, templateData).replace('<h2>6. 技术服务</h2>', ''), "\n        </div>\n        <div class=\"english-content\">\n          ").concat(fillTemplate(bilingualTemplates.technical_service.english, templateData).replace('<h2>6. Technical Service</h2>', ''), "\n        </div>\n      </div>\n    "));
  } // 随机文件部分


  if (templateData.includeAttachmentSection) {
    sections.push("\n      <div class=\"bilingual-section\">\n        <h2 class=\"section-title\">7. \u968F\u673A\u6587\u4EF6 / Accompanying Documents</h2>\n        <div class=\"chinese-content\">\n          ".concat(fillTemplate(bilingualTemplates.accompanying_documents.chinese, templateData).replace('<h2>7. 随机文件</h2>', ''), "\n        </div>\n        <div class=\"english-content\">\n          ").concat(fillTemplate(bilingualTemplates.accompanying_documents.english, templateData).replace('<h2>7. Accompanying Documents</h2>', ''), "\n        </div>\n      </div>\n    "));
  } // 特殊订货要求部分


  if (templateData.specialRequirements && templateData.specialRequirements !== '无') {
    // 使用格式化函数处理特殊订货要求
    var formattedRequirements = formatSpecialRequirements(templateData.specialRequirements, templateData.specialRequirementsFormat || 'numbered');
    sections.push("\n      <div class=\"bilingual-section\">\n        <h2 class=\"section-title\">8. \u7279\u6B8A\u8BA2\u8D27\u8981\u6C42 / Special Ordering Requirements</h2>\n        <div class=\"chinese-content\">\n          ".concat(formattedRequirements.chinese, "\n        </div>\n        <div class=\"english-content\">\n          ").concat(formattedRequirements.english, "\n        </div>\n      </div>\n    "));
  } // 签字栏


  var signature = "\n    <div class=\"bilingual-section mt-5\">\n      <div class=\"row\">\n        <div class=\"col-6\">\n          <p>\u4F9B\u65B9\u4EE3\u8868 / Supplier Representative: ________________</p>\n          <p>\u65E5\u671F / Date: _________________</p>\n        </div>\n        <div class=\"col-6\">\n          <p>\u9700\u65B9\u4EE3\u8868 / Buyer Representative: ________________</p>\n          <p>\u65E5\u671F / Date: _________________</p>\n        </div>\n      </div>\n    </div>\n  "; // 组装完整文档

  return "\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"UTF-8\">\n      <title>\u8239\u7528\u9F7F\u8F6E\u7BB1\u6280\u672F\u534F\u8BAE / Marine Gearbox Technical Agreement</title>\n      ".concat(styles, "\n      <link rel=\"stylesheet\" href=\"../styles/bilingualStyles.css\">\n    </head>\n    <body>\n      <div class=\"container bilingual-document sequential-layout\">\n        ").concat(header, "\n        ").concat(sections.join('\n'), "\n        ").concat(signature, "\n      </div>\n    </body>\n    </html>\n  ");
};
/**
 * 生成全文对照的双语技术协议
 * @param {Object} templateData - 技术协议数据
 * @returns {string} HTML文档字符串
 */


exports.generateSequentialAgreement = generateSequentialAgreement;

var generateCompleteAgreement = function generateCompleteAgreement(templateData) {
  // 添加双语协议样式
  var styles = "\n    <style>\n      .bilingual-document {\n        font-family: Arial, SimSun, sans-serif;\n      }\n      .chinese-content {\n        font-family: SimSun, \"\u5B8B\u4F53\", sans-serif;\n      }\n      .english-content {\n        font-family: Arial, sans-serif;\n        margin-top: 4rem;\n      }\n      .section {\n        margin-bottom: 2rem;\n      }\n      h1, h2, h3 {\n        margin-bottom: 1rem;\n      }\n      hr.language-divider {\n        margin: 3rem 0;\n        border-top: 1px solid #999;\n      }\n      .language-title {\n        text-align: center;\n        margin: 2rem 0;\n        font-size: 1.5rem;\n        font-weight: bold;\n      }\n      table {\n        width: 100%;\n        border-collapse: collapse;\n        margin-bottom: 1rem;\n      }\n      table, th, td {\n        border: 1px solid #ddd;\n      }\n      th, td {\n        padding: 8px;\n        text-align: left;\n      }\n      th {\n        background-color: #f2f2f2;\n      }\n    </style>\n  "; // 生成中文版本

  var chineseContent = generateChineseAgreement(templateData); // 生成英文版本

  var englishContent = generateEnglishAgreement(templateData); // 组装完整文档

  return "\n    <!DOCTYPE html>\n    <html>\n    <head>\n      <meta charset=\"UTF-8\">\n      <title>\u8239\u7528\u9F7F\u8F6E\u7BB1\u6280\u672F\u534F\u8BAE / Marine Gearbox Technical Agreement</title>\n      ".concat(styles, "\n      <link rel=\"stylesheet\" href=\"../styles/bilingualStyles.css\">\n    </head>\n    <body>\n      <div class=\"container bilingual-document complete-layout\">\n        <div class=\"text-center mb-5\">\n          <h1>\u8239\u7528\u9F7F\u8F6E\u7BB1\u6280\u672F\u534F\u8BAE / Marine Gearbox Technical Agreement</h1>\n          <p>\u9879\u76EE\u540D\u79F0 / Project Name: ").concat(templateData.projectName || '', "</p>\n          <p>\u5BA2\u6237\u540D\u79F0 / Customer: ").concat(templateData.shipOwner || '', "</p>\n          <p>\u65E5\u671F / Date: ").concat(templateData.date, " / ").concat(templateData.dateEnglish, "</p>\n        </div>\n        \n        <div class=\"language-title\">\u4E2D\u6587\u7248 / Chinese Version</div>\n        <div class=\"chinese-content\">\n          ").concat(chineseContent, "\n        </div>\n        \n        <hr class=\"language-divider\" />\n        \n        <div class=\"language-title\">\u82F1\u6587\u7248 / English Version</div>\n        <div class=\"english-content\">\n          ").concat(englishContent, "\n        </div>\n      </div>\n    </body>\n    </html>\n  ");
};
/**
 * 生成中文版技术协议
 * @param {Object} templateData - 技术协议数据
 * @returns {string} HTML内容
 */


exports.generateCompleteAgreement = generateCompleteAgreement;

var generateChineseAgreement = function generateChineseAgreement(templateData) {
  var sections = []; // 概述部分

  sections.push(fillTemplate(bilingualTemplates.overview.chinese, templateData)); // 技术参数部分

  sections.push(fillTemplate(bilingualTemplates.technical_parameters.chinese, templateData)); // 性能要求部分

  sections.push(fillTemplate(bilingualTemplates.performance_requirements.chinese, templateData)); // 验收标准部分

  sections.push(fillTemplate(bilingualTemplates.acceptance_criteria.chinese, templateData)); // 质量保证部分

  if (templateData.includeQualitySection) {
    sections.push(fillTemplate(bilingualTemplates.quality_assurance.chinese, templateData));
  } // 技术服务部分


  if (templateData.includeMaintenanceSection) {
    sections.push(fillTemplate(bilingualTemplates.technical_service.chinese, templateData));
  } // 随机文件部分


  if (templateData.includeAttachmentSection) {
    sections.push(fillTemplate(bilingualTemplates.accompanying_documents.chinese, templateData));
  } // 特殊订货要求部分


  if (templateData.specialRequirements && templateData.specialRequirements !== '无') {
    // 使用格式化函数处理特殊订货要求
    var formattedRequirements = formatSpecialRequirements(templateData.specialRequirements, templateData.specialRequirementsFormat || 'numbered');
    sections.push(fillTemplate(bilingualTemplates.special_requirements.chinese, _objectSpread({}, templateData, {
      specialRequirements: formattedRequirements.chinese
    })));
  } // 签字栏


  var signature = fillTemplate(bilingualTemplates.signature.chinese, templateData);
  return sections.join('\n') + signature;
};
/**
 * 生成英文版技术协议
 * @param {Object} templateData - 技术协议数据
 * @returns {string} HTML内容
 */


exports.generateChineseAgreement = generateChineseAgreement;

var generateEnglishAgreement = function generateEnglishAgreement(templateData) {
  var sections = []; // 概述部分

  sections.push(fillTemplate(bilingualTemplates.overview.english, templateData)); // 技术参数部分

  sections.push(fillTemplate(bilingualTemplates.technical_parameters.english, templateData)); // 性能要求部分

  sections.push(fillTemplate(bilingualTemplates.performance_requirements.english, templateData)); // 验收标准部分

  sections.push(fillTemplate(bilingualTemplates.acceptance_criteria.english, templateData)); // 质量保证部分

  if (templateData.includeQualitySection) {
    sections.push(fillTemplate(bilingualTemplates.quality_assurance.english, templateData));
  } // 技术服务部分


  if (templateData.includeMaintenanceSection) {
    sections.push(fillTemplate(bilingualTemplates.technical_service.english, templateData));
  } // 随机文件部分


  if (templateData.includeAttachmentSection) {
    sections.push(fillTemplate(bilingualTemplates.accompanying_documents.english, templateData));
  } // 特殊订货要求部分


  if (templateData.specialRequirements && templateData.specialRequirements !== '无') {
    // 使用格式化函数处理特殊订货要求
    var formattedRequirements = formatSpecialRequirements(templateData.specialRequirements, templateData.specialRequirementsFormat || 'numbered');
    sections.push(fillTemplate(bilingualTemplates.special_requirements.english, _objectSpread({}, templateData, {
      specialRequirements: formattedRequirements.english
    })));
  } // 签字栏


  var signature = fillTemplate(bilingualTemplates.signature.english, templateData);
  return sections.join('\n') + signature;
};
/**
 /**
 * 特殊订货要求格式化函数
 * @param {string} requirements - 特殊订货要求文本（多行）
 * @param {string} format - 格式化类型 ('numbered', 'bullet', 'plain')
 * @returns {Object} 包含中英文格式化后的HTML对象
 */


exports.generateEnglishAgreement = generateEnglishAgreement;

var formatSpecialRequirements = function formatSpecialRequirements(requirements) {
  var format = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'numbered';

  if (!requirements || requirements === '无') {
    return {
      chinese: '<p>无</p>',
      english: '<p>None</p>'
    };
  } // 翻译特殊订货要求


  var translatedRequirements = translateSpecialRequirements(requirements); // 分割中英文要求

  var chineseLines = requirements.split('\n').filter(function (line) {
    return line.trim();
  });
  var englishLines = translatedRequirements.split('\n').filter(function (line) {
    return line.trim();
  }); // 格式化中文要求

  var chineseHtml = '';

  if (format === 'numbered') {
    chineseHtml = '<ol class="special-requirements-list">\n';
    chineseLines.forEach(function (line) {
      chineseHtml += "  <li>".concat(line.trim(), "</li>\n");
    });
    chineseHtml += '</ol>';
  } else if (format === 'bullet') {
    chineseHtml = '<ul class="special-requirements-list">\n';
    chineseLines.forEach(function (line) {
      chineseHtml += "  <li>".concat(line.trim(), "</li>\n");
    });
    chineseHtml += '</ul>';
  } else {
    chineseHtml = '<div class="special-requirements-list">\n';
    chineseLines.forEach(function (line) {
      chineseHtml += "  <p>".concat(line.trim(), "</p>\n");
    });
    chineseHtml += '</div>';
  } // 格式化英文要求


  var englishHtml = '';

  if (format === 'numbered') {
    englishHtml = '<ol class="special-requirements-list">\n';
    englishLines.forEach(function (line) {
      englishHtml += "  <li>".concat(line.trim(), "</li>\n");
    });
    englishHtml += '</ol>';
  } else if (format === 'bullet') {
    englishHtml = '<ul class="special-requirements-list">\n';
    englishLines.forEach(function (line) {
      englishHtml += "  <li>".concat(line.trim(), "</li>\n");
    });
    englishHtml += '</ul>';
  } else {
    englishHtml = '<div class="special-requirements-list">\n';
    englishLines.forEach(function (line) {
      englishHtml += "  <p>".concat(line.trim(), "</p>\n");
    });
    englishHtml += '</div>';
  }

  return {
    chinese: chineseHtml,
    english: englishHtml
  };
};
/**
 * 翻译特殊订货要求 - 逐行处理
 * @param {string} requirements - 特殊订货要求文本（多行）
 * @returns {string} 翻译后的英文文本（多行）
 */


exports.formatSpecialRequirements = formatSpecialRequirements;

var translateSpecialRequirements = function translateSpecialRequirements(requirements) {
  if (!requirements || requirements === '无') {
    return 'None';
  } // 按行分割


  var lines = requirements.split('\n'); // 逐行翻译

  var translatedLines = lines.map(function (line, index) {
    var trimmedLine = line.trim();
    if (!trimmedLine) return ''; // 检查是否为模板库中的内容，直接使用英文模板

    var found = false;
    var translatedLine = ''; // 遍历模板库

    Object.keys(specialRequirementTemplates).forEach(function (category) {
      var chineseTemplates = specialRequirementTemplates[category].chinese;
      var englishTemplates = specialRequirementTemplates[category].english; // 检查是否匹配任何模板

      chineseTemplates.forEach(function (template, templateIndex) {
        // 创建正则表达式，将{{param}}替换为任意字符匹配
        var templateRegex = template.replace(/\{\{[^}]+\}\}/g, '(.+?)');
        var regex = new RegExp("^".concat(templateRegex, "$"));
        var match = trimmedLine.match(regex);

        if (match) {
          found = true; // 获取对应的英文模板

          var englishTemplate = englishTemplates[templateIndex]; // 将匹配的参数值填入英文模板

          if (match.length > 1) {
            // 提取模板中的参数名
            var paramMatches = template.match(/\{\{([^}]+)\}\}/g) || [];
            var paramNames = paramMatches.map(function (pm) {
              return pm.replace(/\{\{|\}\}/g, '');
            }); // 替换英文模板中的参数

            for (var i = 0; i < paramNames.length && i + 1 < match.length; i++) {
              var paramName = paramNames[i];
              var paramValue = match[i + 1];
              englishTemplate = englishTemplate.replace("{{".concat(paramName, "}}"), paramValue);
            }
          }

          translatedLine = englishTemplate;
        }
      });
    }); // 如果没有找到匹配的模板，使用通用翻译

    if (!found) {
      // 使用已定义的translateToEnglish函数替代未定义的函数
      translatedLine = translateToEnglish(trimmedLine); // 移除对未定义函数的调用
      // translatedLine = translateTechnicalTerm(translatedLine);
      // translatedLine = translateUnits(translatedLine);
      // translatedLine = formatNumbers(translatedLine);
    } // 添加序号格式（如果原文有序号格式）


    if (/^\d+[\.\、\:]/.test(trimmedLine)) {
      // 保持原有序号格式
      var numberMatch = trimmedLine.match(/^(\d+)[\.\、\:]/);

      if (numberMatch) {
        var number = numberMatch[1];
        translatedLine = "".concat(number, ". ").concat(translatedLine.replace(/^\d+[\.\、\:]\s*/, ''));
      }
    }

    return translatedLine;
  }); // 重新组合为多行文本

  return translatedLines.filter(function (line) {
    return line;
  }).join('\n');
};
/**
 * 填充模板中的变量
 * @param {string} template - 包含{{变量}}的模板字符串
 * @param {Object} data - 包含变量值的对象
 * @returns {string} 填充变量后的字符串
 */


exports.translateSpecialRequirements = translateSpecialRequirements;

var fillTemplate = function fillTemplate(template, data) {
  var result = template;
  if (!data) return result; // 替换所有变量

  Object.keys(data).forEach(function (key) {
    var value = data[key] !== undefined && data[key] !== null ? data[key] : '';
    var regex = new RegExp("{{".concat(key, "}}"), 'g');
    result = result.replace(regex, value);
  }); // 替换所有未匹配的变量为空字符串

  result = result.replace(/{{[^}]+}}/g, '');
  return result;
};

exports.fillTemplate = fillTemplate;