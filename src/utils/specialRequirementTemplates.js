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
      "齿轮箱须满足10%过载能力"
    ],
    english: [
      "Maximum input speed of the gearbox shall not exceed {{maxInputSpeed}} r/min",
      "Mechanical efficiency of the gearbox shall not be less than {{mechanicalEfficiency}}%",
      "Maximum permissible propeller thrust shall not be less than {{maxPropellerThrust}} kN",
      "Continuous operation time of the gearbox at maximum power shall not be less than 8000 hours",
      "The gearbox shall meet 10% overload capacity"
    ]
  },
  
  // 安装与连接类
  installation: {
    chinese: [
      "齿轮箱允许纵倾不小于{{longitudinalInclination}}°，横倾不小于{{transverseInclination}}°",
      "齿轮箱输入轴与主机输出轴采用高弹性联轴器连接",
      "齿轮箱安装座为刚性连接，安装时齿轮箱和发动机的同轴度必须满足规范的要求",
      "齿轮箱出厂前应附安装图纸并提供详细的安装说明",
      "齿轮箱制造厂家应派技术人员现场指导安装与调试"
    ],
    english: [
      "Longitudinal inclination of the gearbox shall not be less than {{longitudinalInclination}}°, transverse inclination shall not be less than {{transverseInclination}}°",
      "The gearbox input shaft shall be connected to the main engine output shaft with a high-elastic coupling",
      "The gearbox shall be rigidly mounted, and the alignment of the gearbox and engine must meet specification requirements during installation",
      "Installation drawings and detailed installation instructions shall be provided before gearbox delivery",
      "The gearbox manufacturer shall send technical personnel to guide installation and commissioning on site"
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
      "所有监测信号应能与船舶集中监控系统连接"
    ],
    english: [
      "The gearbox shall be equipped with low oil pressure alarm device, with alarm value set at {{lowOilPressureAlarm}} MPa",
      "The gearbox shall be equipped with high oil temperature alarm device, with alarm value set at {{highOilTemperatureAlarm}}°C",
      "The gearbox shall be equipped with speed monitoring device",
      "The gearbox shall be equipped with vibration monitoring device",
      "All monitoring signals shall be connectable to the ship's centralized monitoring system"
    ]
  },
  
  // 操控系统类
  control: {
    chinese: [
      "齿轮箱操控系统应包含紧急倒车功能",
      "操控系统应配备本地操作面板和远程操作接口",
      "操控系统应具备自诊断功能",
      "操控系统电源为DC24V",
      "操控系统应防水防潮设计，防护等级不低于IP56"
    ],
    english: [
      "The gearbox control system shall include emergency reversing function",
      "Control system shall be equipped with local operation panel and remote operation interface",
      "Control system shall have self-diagnostic function",
      "Control system power supply is DC 24V",
      "Control system shall have waterproof and moisture-proof design, with protection level not less than IP56"
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