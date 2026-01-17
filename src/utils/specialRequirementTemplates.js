// src/utils/specialRequirementTemplates.js

/**
 * 特殊订货要求模板定义
 * 包含多个类别的中英文特殊要求模板
 */
const specialRequirementTemplates = {
  // 性能参数类
  performance: {
    chinese: [
      "齿轮箱最大输入转速不超过{{maxInputSpeed}}r/min",
      "齿轮箱机械效率不低于{{mechanicalEfficiency}}%",
      "齿轮箱最大允许螺旋桨轴推力不低于{{maxPropellerThrust}}kN",
      "齿轮箱在最大功率下连续工作时间不低于8000小时",
      "齿轮箱须满足10%过载能力",
      "换向时间不大于{{directionChangeTime}}秒（空车位置停留3秒）",
      "大修时间：{{overhaulPeriod}}小时",
      "输出转向：与输入{{outputDirection}}",
      "齿轮箱铭牌材质为不锈钢，黑底白字阳文，中英文对照",
      "额定传递能力：{{transmissionCapacity}} kW/rpm"
    ],
    english: [
      "Maximum input speed of the gearbox shall not exceed {{maxInputSpeed}} r/min",
      "Mechanical efficiency of the gearbox shall not be less than {{mechanicalEfficiency}}%",
      "Maximum permissible propeller thrust shall not be less than {{maxPropellerThrust}} kN",
      "Continuous operation time of the gearbox at maximum power shall not be less than 8000 hours",
      "The gearbox shall meet 10% overload capacity",
      "Direction change time shall not exceed {{directionChangeTime}} seconds (with 3 seconds at neutral position)",
      "Overhaul period: {{overhaulPeriod}} hours",
      "Output rotation: {{outputDirection}} to input",
      "Gearbox nameplate shall be stainless steel, white text on black background, bilingual Chinese-English",
      "Rated transmission capacity: {{transmissionCapacity}} kW/rpm"
    ]
  },
  
  // 安装与连接类
  installation: {
    chinese: [
      "齿轮箱允许纵倾不小于{{longitudinalInclination}}°，横倾不小于{{transverseInclination}}°",
      "齿轮箱输入轴与主机输出轴采用高弹性联轴器连接",
      "齿轮箱安装座为刚性连接，安装时齿轮箱和发动机的同轴度必须满足规范的要求",
      "齿轮箱出厂前应附安装图纸并提供详细的安装说明",
      "齿轮箱制造厂家应派技术人员现场指导安装与调试",
      "齿轮箱支架与主机底座安装在同一刚性支撑上",
      "纵摇{{pitching}}°，横摇{{rolling}}°",
      "电机、齿轮箱为刚性安装",
      "安装找正请按使用维护说明书有关规定进行"
    ],
    english: [
      "Longitudinal inclination of the gearbox shall not be less than {{longitudinalInclination}}°, transverse inclination shall not be less than {{transverseInclination}}°",
      "The gearbox input shaft shall be connected to the main engine output shaft with a high-elastic coupling",
      "The gearbox shall be rigidly mounted, and the alignment of the gearbox and engine must meet specification requirements during installation",
      "Installation drawings and detailed installation instructions shall be provided before gearbox delivery",
      "The gearbox manufacturer shall send technical personnel to guide installation and commissioning on site",
      "Gearbox bracket shall be installed on the same rigid support as the main engine base",
      "Pitching {{pitching}}°, rolling {{rolling}}°",
      "Motor and gearbox shall be rigidly installed",
      "Installation alignment shall be performed according to the operation and maintenance manual"
    ]
  },
  
  // 冷却系统类
  cooling: {
    chinese: [
      "冷却水进水温度不高于{{coolingWaterInletTemperature}}℃",
      "冷却水流量不小于{{coolingWaterVolume}}m³/h",
      "冷却水系统工作压力不大于{{coolingWaterPressure}}MPa",
      "齿轮箱应配备温度传感器和温度报警装置",
      "齿轮箱冷却系统应能适应海水冷却"
    ],
    english: [
      "Cooling water inlet temperature shall not exceed {{coolingWaterInletTemperature}}°C",
      "Cooling water flow shall not be less than {{coolingWaterVolume}} m³/h",
      "Cooling water system working pressure shall not exceed {{coolingWaterPressure}} MPa",
      "The gearbox shall be equipped with temperature sensors and temperature alarm device",
      "The gearbox cooling system shall be adaptable to seawater cooling"
    ]
  },
  
  // 润滑系统类
  lubrication: {
    chinese: [
      "齿轮箱润滑油压力范围为{{lubricationOilPressure}}MPa",
      "润滑油最高工作温度不超过{{maxOilTemperature}}℃",
      "齿轮箱总油量约为{{oilCapacity}}L，推荐使用{{oilGrade}}润滑油",
      "齿轮箱应配备油压低报警装置，报警值设定为{{lowOilPressureAlarm}}MPa",
      "齿轮箱应配备油温高报警装置，报警值设定为{{highOilTemperatureAlarm}}℃"
    ],
    english: [
      "The gearbox lubricating oil pressure range is {{lubricationOilPressure}} MPa",
      "Maximum lubricating oil working temperature shall not exceed {{maxOilTemperature}}°C",
      "Total oil capacity of the gearbox is approximately {{oilCapacity}} L, recommended oil grade is {{oilGrade}}",
      "The gearbox shall be equipped with low oil pressure alarm device, with alarm value set at {{lowOilPressureAlarm}} MPa",
      "The gearbox shall be equipped with high oil temperature alarm device, with alarm value set at {{highOilTemperatureAlarm}}°C"
    ]
  },
  
  // 监测与报警系统类
  monitoring: {
    chinese: [
      "齿轮箱应配备油压低报警装置，报警值设定为{{lowOilPressureAlarm}}MPa",
      "齿轮箱应配备油温高报警装置，报警值设定为{{highOilTemperatureAlarm}}℃",
      "齿轮箱应配备转速监测装置",
      "齿轮箱应配备振动监测装置",
      "所有监测信号应能与船舶集中监控系统连接",
      "润滑油压表、润滑油温表各1只",
      "工作油压力表1只",
      "正车及倒车工作油压力控制器各1个，当工作油压降至{{workingOilPressureAlarm}}MPa时报警",
      "润滑油压力控制器1只，当润滑油压力降至{{lubOilStopPressure}}MPa时主机停机",
      "滑油低压报警、油温高报警控制器各1只，均为直流无源开关量信号"
    ],
    english: [
      "The gearbox shall be equipped with low oil pressure alarm device, with alarm value set at {{lowOilPressureAlarm}} MPa",
      "The gearbox shall be equipped with high oil temperature alarm device, with alarm value set at {{highOilTemperatureAlarm}}°C",
      "The gearbox shall be equipped with speed monitoring device",
      "The gearbox shall be equipped with vibration monitoring device",
      "All monitoring signals shall be connectable to the ship's centralized monitoring system",
      "1 lubricating oil pressure gauge, 1 lubricating oil temperature gauge",
      "1 working oil pressure gauge",
      "1 forward and 1 reverse working oil pressure controller, alarm when working oil pressure drops to {{workingOilPressureAlarm}} MPa",
      "1 lubricating oil pressure controller, main engine shutdown when lubricating oil pressure drops to {{lubOilStopPressure}} MPa",
      "1 low oil pressure alarm controller and 1 high oil temperature alarm controller, both DC passive switch signals"
    ]
  },
  
  // 操控系统类
  control: {
    chinese: [
      "齿轮箱操控系统应包含紧急倒车功能",
      "操控系统应配备本地操作面板和远程操作接口",
      "操控系统应具备自诊断功能",
      "操控系统电源为DC24V",
      "操控系统应防水防潮设计，防护等级不低于IP56",
      "操纵方式：机旁手动操纵和远距离{{controlType}}遥控操纵",
      "操纵空气压力：{{controlAirPressure}}MPa",
      "换向转速：{{reverseSpeed}}%额定转速",
      "操控系统为推拉软轴控制"
    ],
    english: [
      "The gearbox control system shall include emergency reversing function",
      "Control system shall be equipped with local operation panel and remote operation interface",
      "Control system shall have self-diagnostic function",
      "Control system power supply is DC 24V",
      "Control system shall have waterproof and moisture-proof design, with protection level not less than IP56",
      "Control method: local manual control and remote {{controlType}} control",
      "Control air pressure: {{controlAirPressure}} MPa",
      "Reversal speed: {{reverseSpeed}}% of rated speed",
      "Control system uses push-pull cable"
    ]
  },
  
  // 检验与文档类
  documentation: {
    chinese: [
      "齿轮箱出厂前应经过不低于4小时的全负荷试验",
      "出厂时应提供船检认可的检验证书",
      "应提供中文操作与维护手册",
      "应提供完整的零部件图册和备件清单",
      "应提供详细的安装与调试说明书"
    ],
    english: [
      "The gearbox shall undergo full-load testing for not less than 4 hours before delivery",
      "Inspection certificate approved by ship classification society shall be provided upon delivery",
      "Chinese operation and maintenance manual shall be provided",
      "Complete parts catalog and spare parts list shall be provided",
      "Detailed installation and commissioning instructions shall be provided"
    ]
  },
  
  // 特殊应用场景
  special: {
    chinese: [
      "齿轮箱应适用于渔业拖网作业工况",
      "齿轮箱应适用于破冰船工况",
      "齿轮箱应适用于浅水航道推进工况",
      "齿轮箱应适用于频繁倒车工况",
      "齿轮箱应适用于双机单桨交替运行工况"
    ],
    english: [
      "The gearbox shall be suitable for fishing trawling operation conditions",
      "The gearbox shall be suitable for icebreaker operation conditions",
      "The gearbox shall be suitable for shallow water channel propulsion conditions",
      "The gearbox shall be suitable for frequent reversing conditions",
      "The gearbox shall be suitable for twin-engine single-propeller alternating operation conditions"
    ]
  },

  // 法规与规范类
  regulations: {
    chinese: [
      "适用中国船级社《钢质海船入级规范》及修改通报",
      "适用中华人民共和国海事局《船舶法定检验技术规则》",
      "适用中国船级社《钢质内河船舶建造规范》及修改通报",
      "适用中国船级社《材料与焊接规范》及修改通报",
      "适用中国船级社《国内航行小型海船技术规则》",
      "齿轮箱设计制造符合CCS相关规范要求"
    ],
    english: [
      "Applicable to CCS Rules for Classification of Sea-Going Steel Ships and amendments",
      "Applicable to PRC Maritime Administration Statutory Survey Technical Rules for Ships",
      "Applicable to CCS Rules for Construction of Inland Steel Ships and amendments",
      "Applicable to CCS Rules for Materials and Welding and amendments",
      "Applicable to CCS Technical Rules for Small Sea-Going Ships in Domestic Navigation",
      "Gearbox design and manufacture shall comply with CCS specification requirements"
    ]
  },

  // 供货范围类
  delivery: {
    chinese: [
      "齿轮箱{{quantity}}台/船，含滑油泵机组",
      "随机附带使用说明书1份/台",
      "随机附带外形安装图1份/台",
      "随机附带电气接线图1份/台",
      "随机附带产品合格证书1份/台",
      "提供CCS船检产品证书1份/台",
      "高弹性联轴器配齐与主机、齿轮箱的联接件",
      "配备电动滑油泵一台/齿轮箱",
      "备件满足航区要求"
    ],
    english: [
      "{{quantity}} gearbox(es) per ship, including oil pump unit",
      "1 operation manual per unit enclosed",
      "1 outline installation drawing per unit enclosed",
      "1 electrical wiring diagram per unit enclosed",
      "1 product certificate per unit enclosed",
      "1 CCS ship inspection product certificate per unit",
      "High elastic coupling complete with connecting parts for engine and gearbox",
      "1 electric oil pump per gearbox",
      "Spare parts meet navigation area requirements"
    ]
  },

  // 验收程序类
  acceptance: {
    chinese: [
      "齿轮箱出厂前在制造厂试验台进行台架试验",
      "试验按CCS认可的试验大纲进行检验和验收",
      "台架试验前一周通知各方",
      "油封有效期为自发货之日起一年",
      "设备须经甲方验收合格后方可出厂",
      "试验前需由船东代表和验船师在场"
    ],
    english: [
      "Gearbox shall undergo bench test at manufacturer's test stand before delivery",
      "Test shall be inspected and accepted according to CCS approved test procedure",
      "All parties shall be notified one week before bench test",
      "Oil seal validity period is one year from the date of shipment",
      "Equipment shall pass Party A's acceptance before delivery",
      "Shipowner representative and surveyor shall be present before test"
    ]
  },

  // 技术文件类
  techDocs: {
    chinese: [
      "协议生效后{{approvalPeriod}}天内提供认可资料（外形图、电气接线图），采用CAD电子版",
      "甲方收到认可图{{feedbackPeriod}}天内意见反馈",
      "提供4份纸版完工资料/每船及CD盘完工文件",
      "电子版图纸与实物1:1比例绘制",
      "提供设备安装操作说明书",
      "认可资料包括：设备系统安装图、设备安装尺寸图、电控箱原理图、外接线路图、系统图、附件外形安装图",
      "工作图与认可图保持一致"
    ],
    english: [
      "Approval documents (outline drawing, electrical wiring diagram) in CAD format to be provided within {{approvalPeriod}} days after agreement effective",
      "Party A shall provide feedback within {{feedbackPeriod}} days after receiving approval drawings",
      "4 copies of paper completion documents per ship plus CD completion files",
      "Electronic drawings shall be drawn at 1:1 scale with actual equipment",
      "Equipment installation and operation manual to be provided",
      "Approval documents include: equipment system installation drawing, installation dimension drawing, control box schematic, external wiring diagram, system diagram, accessory outline installation drawing",
      "Working drawings shall be consistent with approval drawings"
    ]
  }
};

/**
 * 将模板中的变量替换为实际数据
 * @param {string} template - 包含变量的模板字符串
 * @param {Object} data - 变量数据对象
 * @returns {string} 替换变量后的字符串
 */
const processTemplate = (template, data) => {
  if (!template || typeof template !== 'string') {
    return '';
  }
  
  try {
    let processedTemplate = String(template);
    
    if (data && typeof data === 'object') {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const value = data[key];
          if (value !== undefined && value !== null) {
            const placeholder = `{{${key}}}`;
            while (processedTemplate.includes(placeholder)) {
              processedTemplate = processedTemplate.replace(placeholder, String(value));
            }
          }
        }
      }
    }
    
    // 替换所有剩余的变量为空字符串
    let startIndex;
    while ((startIndex = processedTemplate.indexOf('{{')) !== -1) {
      const endIndex = processedTemplate.indexOf('}}', startIndex);
      if (endIndex !== -1) {
        processedTemplate = 
          processedTemplate.substring(0, startIndex) + 
          processedTemplate.substring(endIndex + 2);
      } else {
        break;
      }
    }
    
    return processedTemplate;
  } catch (error) {
    console.error("处理模板变量出错:", error);
    return template; // 出错时返回原始模板
  }
};

// 导出模板和处理函数
export { specialRequirementTemplates, processTemplate };