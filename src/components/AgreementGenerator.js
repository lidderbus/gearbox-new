import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { needsStandbyPump } from '../utils/enhancedPumpSelection';
import SpecialRequirementsTemplateSelector from './SpecialRequirementsTemplateSelector';

const AgreementGenerator = ({
  selectionResult,
  projectInfo,
  selectedComponents,
  colors,
  theme,
  onGenerated
}) => {
  // 基本状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [agreementType, setAgreementType] = useState('standard');
  const [language, setLanguage] = useState('zh');
  const [bilingualLayout, setBilingualLayout] = useState('side-by-side');
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [includeOptions, setIncludeOptions] = useState({
    testRequirements: true,
    warranty: true,
    deliveryTerms: true,
    drawings: true,
    qualityStandards: true,
    accessories: true,
    documentation: true,
    monitoring: true
  });
  
  // 新增: 预览相关状态
  const [previewHtml, setPreviewHtml] = useState('');
  const [previewLoading, setPreviewLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('template');
  const [previewGenerated, setPreviewGenerated] = useState(false);
  
  // 模板列表
  const agreementTemplates = [
    { id: 'standard', name: '标准技术协议', description: '适用于一般商业项目' },
    { id: 'simplified', name: '简化技术协议', description: '仅包含基本技术参数' },
    { id: 'detailed', name: '详细技术协议', description: '包含完整技术规格和测试要求' },
    { id: 'international', name: '国际标准协议', description: '符合国际标准格式' },
    { id: 'military', name: '军用标准协议', description: '符合军工项目要求' }
  ];
  
  // 语言选项
  const languageOptions = [
    { value: 'zh', label: '中文' },
    { value: 'en', label: '英文' },
    { value: 'bilingual', label: '中英文对照' }
  ];
  
  // 双语布局选项
  const bilingualLayoutOptions = [
    { value: 'side-by-side', label: '左右对照布局' },
    { value: 'sequential', label: '分段对照布局' },
    { value: 'complete', label: '全文对照布局' }
  ];
  
  // 特殊订货要求模板数据
  const specialRequirementTemplates = {
    // 性能参数类
    performance: {
      chinese: [
        "齿轮箱输入轴的扭矩储备系数不小于{{torqueReserve}}",
        "齿轮箱在满载功率下连续运转时间不少于{{continuousHours}}小时",
        "齿轮箱工作噪声不得超过{{maxNoise}}dB(A)",
        "齿轮箱振动不得超过{{maxVibration}}mm/s",
        "齿轮箱机械效率不低于{{efficiency}}%"
      ],
      english: [
        "The torque reserve factor of gearbox input shaft shall not be less than {{torqueReserve}}",
        "The gearbox shall be capable of continuous operation at full load for not less than {{continuousHours}} hours",
        "The gearbox operating noise shall not exceed {{maxNoise}}dB(A)",
        "The gearbox vibration shall not exceed {{maxVibration}}mm/s",
        "The mechanical efficiency of gearbox shall not be less than {{efficiency}}%"
      ]
    },
    // 安装与连接类
    installation: {
      chinese: [
        "齿轮箱两侧均应提供扭矩臂安装孔",
        "齿轮箱输入法兰应按照SAE标准设计",
        "齿轮箱输出法兰应按照ISO标准设计",
        "齿轮箱底座应提供调节垫片，调节范围为{{adjustmentRange}}mm"
      ],
      english: [
        "Torque arm mounting holes shall be provided on both sides of the gearbox",
        "The gearbox input flange shall be designed according to SAE standard",
        "The gearbox output flange shall be designed according to ISO standard",
        "The gearbox base shall provide adjustment shims with adjustment range of {{adjustmentRange}}mm"
      ]
    },
    // 冷却系统类
    cooling: {
      chinese: [
        "齿轮箱应配备独立的油冷却器，冷却容量不小于{{coolingCapacity}}kW",
        "冷却系统应采用海水/淡水双冷却方式",
        "应提供冷却系统旁路阀，以适应不同工况",
        "冷却器应使用防腐蚀材料制造，符合{{corrosionStandard}}标准"
      ],
      english: [
        "The gearbox shall be equipped with independent oil cooler with cooling capacity not less than {{coolingCapacity}}kW",
        "The cooling system shall adopt seawater/freshwater dual cooling method",
        "Bypass valve shall be provided for cooling system to adapt to different working conditions",
        "The cooler shall be made of anti-corrosion materials in compliance with {{corrosionStandard}} standard"
      ]
    },
    // 润滑系统类
    lubrication: {
      chinese: [
        "齿轮箱应配备主/备双泵润滑系统",
        "润滑系统应包含自动温控装置",
        "润滑油滤器应为双联切换式，可在运行中更换滤芯",
        "润滑油应采用{{oilType}}型船用齿轮油"
      ],
      english: [
        "The gearbox shall be equipped with main/standby dual pump lubrication system",
        "The lubrication system shall include automatic temperature control device",
        "The lubricating oil filter shall be of dual switching type, allowing filter element replacement during operation",
        "The lubricating oil shall use {{oilType}} type marine gear oil"
      ]
    },
    // 监测与报警系统类
    monitoring: {
      chinese: [
        "齿轮箱应设置轴承温度监测系统",
        "提供齿轮箱振动监测接口",
        "润滑油压力与温度监测点应符合船级社规范",
        "控制系统应具备远程监控功能，可接入船舶自动化系统"
      ],
      english: [
        "The gearbox shall be equipped with bearing temperature monitoring system",
        "Provide gearbox vibration monitoring interface",
        "The monitoring points for lubricating oil pressure and temperature shall comply with classification society regulations",
        "The control system shall have remote monitoring function and can be connected to the ship automation system"
      ]
    },
    // 操控系统类
    control: {
      chinese: [
        "操控系统应支持本地和遥控两种操作模式",
        "提供PTO输出接口，功率不小于{{PTOPower}}kW",
        "换向操作应设置联锁保护功能",
        "操控系统应提供紧急手动操作功能"
      ],
      english: [
        "The control system shall support both local and remote control operation modes",
        "Provide PTO output interface with power not less than {{PTOPower}}kW",
        "Reversing operation shall be equipped with interlock protection function",
        "The control system shall provide emergency manual operation function"
      ]
    },
    // 检验与文档类
    documentation: {
      chinese: [
        "齿轮箱应通过{{classificationSociety}}船级社型式认可",
        "提供产品3D模型，格式为{{3DFormat}}",
        "技术资料应同时提供电子版和纸质版",
        "应提供轴系对中计算报告"
      ],
      english: [
        "The gearbox shall obtain type approval from {{classificationSociety}} classification society",
        "Provide product 3D model in {{3DFormat}} format",
        "Technical documentation shall be provided in both electronic and paper formats",
        "Shaft alignment calculation report shall be provided"
      ]
    },
    // 特殊应用场景
    special: {
      chinese: [
        "齿轮箱应适用于冰区航行条件",
        "齿轮箱应满足消防船用齿轮箱特殊要求",
        "齿轮箱应适用于拖船应用，可承受频繁换向操作",
        "齿轮箱应适用于动力定位系统(DP{{DPClass}})要求"
      ],
      english: [
        "The gearbox shall be suitable for ice navigation conditions",
        "The gearbox shall meet the special requirements for fire-fighting vessel gearbox",
        "The gearbox shall be suitable for tugboat applications and capable of frequent reversing operations",
        "The gearbox shall be suitable for dynamic positioning system (DP{{DPClass}}) requirements"
      ]
    },
    // 试验要求类
    testing: {
      chinese: [
        "齿轮箱出厂前须进行满负荷运转试验，连续运行时间不少于{{testHours}}小时",
        "齿轮箱须进行模拟螺旋桨推力试验，推力不小于{{thrustValue}}kN",
        "齿轮箱换向试验次数不少于{{reverseCount}}次，换向时间不大于{{reverseTime}}秒",
        "热态试验时，齿轮箱油温不得超过{{maxOilTemp}}℃",
        "齿轮箱噪声不得超过{{noiseLevel}}dB(A)（测量距离1m）",
        "制造厂须提前{{notifyDays}}天通知船厂参加出厂试验"
      ],
      english: [
        "Gearbox shall undergo full-load running test before delivery, with continuous operation time not less than {{testHours}} hours",
        "Gearbox shall undergo simulated propeller thrust test, with thrust not less than {{thrustValue}}kN",
        "Gearbox reversing test shall be conducted for not less than {{reverseCount}} times, with reversing time not more than {{reverseTime}} seconds",
        "During hot test, gearbox oil temperature shall not exceed {{maxOilTemp}}°C",
        "Gearbox noise shall not exceed {{noiseLevel}}dB(A) (measured at a distance of 1m)",
        "Manufacturer shall notify shipyard {{notifyDays}} days in advance to participate in factory test"
      ]
    },
    // 质保条款类
    warranty: {
      chinese: [
        "齿轮箱质保期为船舶交付后{{warrantyMonths}}个月或出厂后{{extendedWarrantyMonths}}个月，以先到为准",
        "制造厂接到故障通知后，须在{{responseHours}}小时内响应，{{arrivalDays}}个工作日内到达现场",
        "更换的零部件质保期自更换之日起重新计算，但不超过原质保期后{{extraMonths}}个月",
        "主要零部件供应期不少于交船后{{partSupplyYears}}年",
        "制造厂提供24小时技术咨询服务"
      ],
      english: [
        "Gearbox warranty period is {{warrantyMonths}} months after vessel delivery or {{extendedWarrantyMonths}} months after ex-factory, whichever comes first",
        "Manufacturer shall respond within {{responseHours}} hours after receiving failure notification, and arrive at site within {{arrivalDays}} working days",
        "Warranty period for replaced parts shall be recalculated from the date of replacement, but not exceeding {{extraMonths}} months after the original warranty period",
        "Supply period for main parts shall not be less than {{partSupplyYears}} years after vessel delivery",
        "Manufacturer provides 24-hour technical consultation service"
      ]
    },
    // 维护保养类
    maintenance: {
      chinese: [
        "制造厂须提供详细的安装、使用和维护保养手册，包含{{language}}语言",
        "制造厂须提供齿轮箱专用工具{{toolSetCount}}套",
        "首次换油周期为{{firstOilChange}}小时，之后每{{regularOilChange}}小时更换一次",
        "齿轮箱安装完成后，制造厂须派工程师到现场进行技术指导，指导时间不少于{{guidanceDays}}天",
        "制造厂须提供船员培训，培训内容包括设备操作、日常维护和故障排除",
        "制造厂须提供完整的齿轮箱维修操作视频"
      ],
      english: [
        "Manufacturer shall provide detailed installation, operation and maintenance manuals in {{language}} language",
        "Manufacturer shall provide {{toolSetCount}} set(s) of special tools for gearbox",
        "First oil change period is {{firstOilChange}} hours, thereafter every {{regularOilChange}} hours",
        "After gearbox installation, manufacturer shall send engineer to provide technical guidance on site, guidance time not less than {{guidanceDays}} days",
        "Manufacturer shall provide crew training, including equipment operation, daily maintenance and troubleshooting",
        "Manufacturer shall provide complete gearbox maintenance operation videos"
      ]
    },
    // 安全要求类
    safety: {
      chinese: [
        "齿轮箱须设置机械式锁定装置，防止非正常转动",
        "所有活动部件须设置防护罩，防止人员接触",
        "齿轮箱须设置温度传感器，当温度超过{{highTemp}}℃时报警",
        "齿轮箱须设置压力传感器，当压力低于{{lowPressure}}MPa时报警",
        "齿轮箱须设置油位指示器，当油位低于正常油位时报警",
        "齿轮箱须设置振动传感器，当振动超过{{vibrationLimit}}mm/s时报警"
      ],
      english: [
        "Gearbox shall be equipped with mechanical locking device to prevent abnormal rotation",
        "All moving parts shall be equipped with protective covers to prevent personnel contact",
        "Gearbox shall be equipped with temperature sensors, alarming when temperature exceeds {{highTemp}}°C",
        "Gearbox shall be equipped with pressure sensors, alarming when pressure is below {{lowPressure}}MPa",
        "Gearbox shall be equipped with oil level indicator, alarming when oil level is below normal level",
        "Gearbox shall be equipped with vibration sensors, alarming when vibration exceeds {{vibrationLimit}}mm/s"
      ]
    }
  };
  
  // 检查基本数据
  useEffect(() => {
    // 验证齿轮箱组件是否存在
    if (!selectedComponents || !selectedComponents.gearbox) {
      setError('错误: 缺少齿轮箱数据，无法生成技术协议');
    } else {
      setError('');
    }
  }, [selectedComponents]);
  
  // 新增: 监听切换到预览标签页时自动生成预览
  useEffect(() => {
    if (activeTab === 'preview' && !previewGenerated && selectedComponents?.gearbox) {
      generatePreview();
    }
  }, [activeTab, previewGenerated, selectedComponents]);
  
  // 新增: 监听协议参数变化，在预览标签页自动更新预览
  useEffect(() => {
    if (previewGenerated && activeTab === 'preview' && selectedComponents?.gearbox) {
      generatePreview();
    }
  }, [
    agreementType,
    language,
    bilingualLayout,
    specialRequirements,
    includeOptions,
    previewGenerated,
    activeTab,
    selectedComponents
  ]);
  
  // 处理标签页切换
  const handleTabSelect = (key) => {
    setActiveTab(key);
  };
  
  // 处理选项变更
  const handleOptionChange = (option, value) => {
    setIncludeOptions(prev => ({
      ...prev,
      [option]: value
    }));
  };
  
  // 处理特殊订货要求变更
  const handleSpecialRequirementsChange = (requirements) => {
    setSpecialRequirements(requirements);
  };
  
  // 新增: 生成预览内容的函数
  const generatePreview = async () => {
    if (!selectedComponents || !selectedComponents.gearbox) {
      return;
    }
    
    setPreviewLoading(true);
    
    try {
      // 构建协议选项
      const options = {
        agreementType,
        language,
        bilingualLayout: language === 'bilingual' ? bilingualLayout : undefined,
        includeOptions,
        specialRequirements,
        // 额外信息
        customerInfo: {
          name: projectInfo?.customerName || '',
          contact: projectInfo?.contactPerson || '',
          phone: projectInfo?.contactPhone || ''
        },
        projectName: projectInfo?.projectName || '',
        engineInfo: {
          model: projectInfo?.engineModel || '',
          power: selectionResult?.engineData?.power || '',
          speed: selectionResult?.engineData?.speed || ''
        },
        isPreview: true
      };
      
      // 调用协议生成服务，但使用更短的延迟
      const previewResult = await generateTechnicalAgreementPreview(
        selectedComponents,
        options
      );
      
      // 更新预览内容
      setPreviewHtml(previewResult.html);
      setPreviewGenerated(true);
      setError('');
    } catch (error) {
      console.error('生成预览失败:', error);
      setError(`生成预览失败: ${error.message}`);
    } finally {
      setPreviewLoading(false);
    }
  };
  
  // 新增: 预览版本的协议生成函数
  const generateTechnicalAgreementPreview = async (components, options) => {
    // 使用更短的延迟以便快速生成预览
    await new Promise(resolve => setTimeout(resolve, 100));
    
    // 获取齿轮箱数据
    const { gearbox, coupling, pump } = components;
    
    // 构建基本HTML内容(模板)
    let html = '';
    
    // 根据语言选择模板
    if (options.language === 'zh') {
      html = generateChineseAgreement(gearbox, coupling, pump, options);
    } else if (options.language === 'en') {
      html = generateEnglishAgreement(gearbox, coupling, pump, options);
    } else if (options.language === 'bilingual') {
      html = generateBilingualAgreement(gearbox, coupling, pump, options);
    }
    
    // 返回生成的协议
    return {
      html,
      type: options.agreementType,
      language: options.language,
      bilingualLayout: options.bilingualLayout,
      generated: new Date().toISOString(),
      isPreview: true
    };
  };
  
  // 生成技术协议 (完整版本)
  const handleGenerateAgreement = async () => {
    if (!selectedComponents || !selectedComponents.gearbox) {
      setError('请先选择齿轮箱');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 构建协议选项
      const options = {
        agreementType,
        language,
        bilingualLayout: language === 'bilingual' ? bilingualLayout : undefined,
        includeOptions,
        specialRequirements,
        // 额外信息
        customerInfo: {
          name: projectInfo?.customerName || '',
          contact: projectInfo?.contactPerson || '',
          phone: projectInfo?.contactPhone || ''
        },
        projectName: projectInfo?.projectName || '',
        engineInfo: {
          model: projectInfo?.engineModel || '',
          power: selectionResult?.engineData?.power || '',
          speed: selectionResult?.engineData?.speed || ''
        }
      };
      
      // 调用协议生成服务
      const agreement = await generateTechnicalAgreement(
        selectedComponents,
        options
      );
      
      // 更新预览内容
      setPreviewHtml(agreement.html);
      setPreviewGenerated(true);
      
      // 通知父组件
      if (onGenerated && typeof onGenerated === 'function') {
        onGenerated(agreement);
      }
    } catch (error) {
      console.error('生成技术协议失败:', error);
      setError(`生成技术协议失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 模拟协议生成函数(实际项目中应替换为真实实现)
  const generateTechnicalAgreement = async (components, options) => {
    // 模拟异步处理
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 获取齿轮箱数据
    const { gearbox, coupling, pump } = components;
    
    // 构建基本HTML内容(模板)
    let html = '';
    
    // 根据语言选择模板
    if (options.language === 'zh') {
      html = generateChineseAgreement(gearbox, coupling, pump, options);
    } else if (options.language === 'en') {
      html = generateEnglishAgreement(gearbox, coupling, pump, options);
    } else if (options.language === 'bilingual') {
      html = generateBilingualAgreement(gearbox, coupling, pump, options);
    }
    
    // 返回生成的协议
    return {
      html,
      type: options.agreementType,
      language: options.language,
      bilingualLayout: options.bilingualLayout,
      generated: new Date().toISOString()
    };
  };
  
  // 生成中文协议
  const generateChineseAgreement = (gearbox, coupling, pump, options) => {
    // 构建各个章节内容
    const sectionCount = {
      current: 1
    };
    
    const generalSection = generateGeneralSection(options, sectionCount);
    sectionCount.current++;
    
    const technicalParamsSection = generateTechnicalParamsSection(gearbox, sectionCount);
    sectionCount.current++;
    
    let accessoriesSection = '';
    if (options.includeOptions.accessories) {
      accessoriesSection = generateAccessoriesSection(coupling, pump, sectionCount);
      sectionCount.current++;
    }
    
    let monitoringSection = '';
    if (options.includeOptions.monitoring) {
      monitoringSection = generateMonitoringSystemSection(gearbox, sectionCount);
      sectionCount.current++;
    }
    
    let testingSection = '';
    if (options.includeOptions.testRequirements) {
      testingSection = generateTestingSection(sectionCount);
      sectionCount.current++;
    }
    
    let warrantySection = '';
    if (options.includeOptions.warranty) {
      warrantySection = generateWarrantySection(sectionCount);
      sectionCount.current++;
    }
    
    let documentationSection = '';
    if (options.includeOptions.documentation) {
      documentationSection = generateDocumentationSection(sectionCount);
      sectionCount.current++;
    }
    
    let specialRequirementsSection = '';
    if (options.specialRequirements && options.specialRequirements.trim() !== '') {
      specialRequirementsSection = generateSpecialRequirementsSection(options.specialRequirements, sectionCount);
    }
    
    return `
      <div class="agreement-container">
        <div class="agreement-header">
          <h1 class="text-center">船用齿轮箱技术协议</h1>
          <h3 class="text-center">${options.projectName || '项目名称'}</h3>
          <div class="text-center">文档编号: TA-${new Date().getTime()}</div>
        </div>
        
        ${generalSection}
        ${technicalParamsSection}
        ${accessoriesSection}
        ${monitoringSection}
        ${testingSection}
        ${warrantySection}
        ${documentationSection}
        ${specialRequirementsSection}
        
        <div class="agreement-footer mt-5">
          <div class="row">
            <div class="col-6">
              <p>供方代表: ________________</p>
              <p>日期: ________________</p>
            </div>
            <div class="col-6 text-end">
              <p>需方代表: ________________</p>
              <p>日期: ________________</p>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  // 生成英文协议
  const generateEnglishAgreement = (gearbox, coupling, pump, options) => {
    // 构建各个章节内容
    const sectionCount = {
      current: 1
    };
    
    const generalSection = generateEnglishGeneralSection(options, sectionCount);
    sectionCount.current++;
    
    const technicalParamsSection = generateEnglishTechnicalParamsSection(gearbox, sectionCount);
    sectionCount.current++;
    
    let accessoriesSection = '';
    if (options.includeOptions.accessories) {
      accessoriesSection = generateEnglishAccessoriesSection(coupling, pump, sectionCount);
      sectionCount.current++;
    }
    
    let monitoringSection = '';
    if (options.includeOptions.monitoring) {
      monitoringSection = generateEnglishMonitoringSystemSection(gearbox, sectionCount);
      sectionCount.current++;
    }
    
    let testingSection = '';
    if (options.includeOptions.testRequirements) {
      testingSection = generateEnglishTestingSection(sectionCount);
      sectionCount.current++;
    }
    
    let warrantySection = '';
    if (options.includeOptions.warranty) {
      warrantySection = generateEnglishWarrantySection(sectionCount);
      sectionCount.current++;
    }
    
    let documentationSection = '';
    if (options.includeOptions.documentation) {
      documentationSection = generateEnglishDocumentationSection(sectionCount);
      sectionCount.current++;
    }
    
    let specialRequirementsSection = '';
    if (options.specialRequirements && options.specialRequirements.trim() !== '') {
      specialRequirementsSection = generateEnglishSpecialRequirementsSection(options.specialRequirements, sectionCount);
    }
    
    return `
      <div class="agreement-container">
        <div class="agreement-header">
          <h1 class="text-center">Marine Gearbox Technical Agreement</h1>
          <h3 class="text-center">${options.projectName || 'Project Name'}</h3>
          <div class="text-center">Document No.: TA-${new Date().getTime()}</div>
        </div>
        
        ${generalSection}
        ${technicalParamsSection}
        ${accessoriesSection}
        ${monitoringSection}
        ${testingSection}
        ${warrantySection}
        ${documentationSection}
        ${specialRequirementsSection}
        
        <div class="agreement-footer mt-5">
          <div class="row">
            <div class="col-6">
              <p>Supplier Representative: ________________</p>
              <p>Date: ________________</p>
            </div>
            <div class="col-6 text-end">
              <p>Buyer Representative: ________________</p>
              <p>Date: ________________</p>
            </div>
          </div>
        </div>
      </div>
    `;
  };
  
  // 生成中英文对照协议
  const generateBilingualAgreement = (gearbox, coupling, pump, options) => {
    // 根据布局选择不同的模板
    if (options.bilingualLayout === 'side-by-side') {
      return generateSideBySideBilingualAgreement(gearbox, coupling, pump, options);
    } else if (options.bilingualLayout === 'sequential') {
      return generateSequentialBilingualAgreement(gearbox, coupling, pump, options);
    } else {
      return generateCompleteBilingualAgreement(gearbox, coupling, pump, options);
    }
  };
  
  // 左右对照布局实现
  const generateSideBySideBilingualAgreement = (gearbox, coupling, pump, options) => {
    return `
      <div class="agreement-container bilingual-container">
        <div class="agreement-header">
          <h1 class="text-center">船用齿轮箱技术协议 / Marine Gearbox Technical Agreement</h1>
          <h3 class="text-center">${options.projectName || '项目名称 / Project Name'}</h3>
          <div class="text-center">文档编号 / Document No.: TA-${new Date().getTime()}</div>
        </div>
        
        <!-- 总则部分 -->
        <div class="row">
          <div class="col-6 zh-section">
            <!-- 中文总则 -->
            <div class="agreement-section">
              <h3>1. 总则</h3>
              <p>本技术协议由供需双方共同签署，明确${options.projectName || '项目'}所需船用齿轮箱的技术规格、性能参数、测试验收及质保等要求。</p>
              <p>1.1 适用范围：本技术协议适用于${options.projectName || '项目'}配套的${options.engineInfo?.model || ''}主机与齿轮箱传动系统。</p>
              <p>1.2 参考标准：</p>
              <ul>
                <li>中国船级社《船舶建造规范》(${new Date().getFullYear()})及其修改通报</li>
                <li>GB/T 3795 船用传动装置技术条件</li>
                <li>JB/T 9003 船用齿轮箱技术条件</li>
              </ul>
            </div>
          </div>
          <div class="col-6 en-section">
            <!-- 英文总则 -->
            <div class="agreement-section">
              <h3>1. General</h3>
              <p>This Technical Agreement is made between the supplier and the purchaser to specify the technical specifications, performance parameters, acceptance tests, and warranty of the marine gearbox for ${options.projectName || 'the project'}.</p>
              <p>1.1 Scope: This Technical Agreement applies to the transmission system of ${options.engineInfo?.model || ''} main engine and gearbox for ${options.projectName || 'the project'}.</p>
              <p>1.2 Reference Standards:</p>
              <ul>
                <li>China Classification Society "Rules for Classification of Sea-going Steel Ships" (${new Date().getFullYear()}) and its notifications of revision</li>
                <li>GB/T 3795 Technical Conditions for Marine Transmission Equipment</li>
                <li>JB/T 9003 Technical Conditions for Marine Gearboxes</li>
              </ul>
            </div>
          </div>
        </div>
        
        <!-- 技术参数部分 -->
        <div class="row">
          <div class="col-6 zh-section">
            <!-- 中文技术参数 -->
            <div class="agreement-section">
              <h3>2. 技术参数</h3>
              <h4>2.1 齿轮箱基本参数</h4>
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td width="40%" class="fw-bold">齿轮箱型号</td>
                    <td>${gearbox.model || '-'}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">额定功率</td>
                    <td>${gearbox.power || '-'} kW</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">减速比</td>
                    <td>${gearbox.ratio?.toFixed(2) || '-'}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">输入转速</td>
                    <td>${gearbox.inputSpeed || '-'} r/min</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">输出转速</td>
                    <td>${gearbox.outputSpeed?.toFixed(1) || '-'} r/min</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div class="col-6 en-section">
            <!-- 英文技术参数 -->
            <div class="agreement-section">
              <h3>2. Technical Parameters</h3>
              <h4>2.1 Basic Parameters of Gearbox</h4>
              <table class="table table-bordered">
                <tbody>
                  <tr>
                    <td width="40%" class="fw-bold">Gearbox Model</td>
                    <td>${gearbox.model || '-'}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Rated Power</td>
                    <td>${gearbox.power || '-'} kW</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Reduction Ratio</td>
                    <td>${gearbox.ratio?.toFixed(2) || '-'}</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Input Speed</td>
                    <td>${gearbox.inputSpeed || '-'} r/min</td>
                  </tr>
                  <tr>
                    <td class="fw-bold">Output Speed</td>
                    <td>${gearbox.outputSpeed?.toFixed(1) || '-'} r/min</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
        <!-- 更多左右对照内容... -->
        
      </div>
    `;
  };
  
  // 分段对照布局实现
  const generateSequentialBilingualAgreement = (gearbox, coupling, pump, options) => {
    return `
      <div class="agreement-container bilingual-sequential">
        <div class="agreement-header">
          <h1 class="text-center">船用齿轮箱技术协议 / Marine Gearbox Technical Agreement</h1>
          <h3 class="text-center">${options.projectName || '项目名称 / Project Name'}</h3>
          <div class="text-center">文档编号 / Document No.: TA-${new Date().getTime()}</div>
        </div>
        
        <!-- 总则部分 -->
        <div class="agreement-section">
          <h3>1. 总则 / General</h3>
          <div class="bilingual-paragraph">
            <p class="zh-text">本技术协议由供需双方共同签署，明确${options.projectName || '项目'}所需船用齿轮箱的技术规格、性能参数、测试验收及质保等要求。</p>
            <p class="en-text">This Technical Agreement is made between the supplier and the purchaser to specify the technical specifications, performance parameters, acceptance tests, and warranty of the marine gearbox for ${options.projectName || 'the project'}.</p>
          </div>
          
          <div class="bilingual-paragraph">
            <p class="zh-text">1.1 适用范围：本技术协议适用于${options.projectName || '项目'}配套的${options.engineInfo?.model || ''}主机与齿轮箱传动系统。</p>
            <p class="en-text">1.1 Scope: This Technical Agreement applies to the transmission system of ${options.engineInfo?.model || ''} main engine and gearbox for ${options.projectName || 'the project'}.</p>
          </div>
          
          <div class="bilingual-paragraph">
            <p class="zh-text">1.2 参考标准：</p>
            <p class="en-text">1.2 Reference Standards:</p>
          </div>
          
          <div class="bilingual-paragraph">
            <ul class="zh-text">
              <li>中国船级社《船舶建造规范》(${new Date().getFullYear()})及其修改通报</li>
              <li>GB/T 3795 船用传动装置技术条件</li>
              <li>JB/T 9003 船用齿轮箱技术条件</li>
            </ul>
            <ul class="en-text">
              <li>China Classification Society "Rules for Classification of Sea-going Steel Ships" (${new Date().getFullYear()}) and its notifications of revision</li>
              <li>GB/T 3795 Technical Conditions for Marine Transmission Equipment</li>
              <li>JB/T 9003 Technical Conditions for Marine Gearboxes</li>
            </ul>
          </div>
        </div>
        
        <!-- 技术参数部分 -->
        <div class="agreement-section">
          <h3>2. 技术参数 / Technical Parameters</h3>
          
          <h4>2.1 齿轮箱基本参数 / Basic Parameters of Gearbox</h4>
          <table class="table table-bordered bilingual-table">
            <tbody>
              <tr>
                <td width="40%" class="fw-bold">齿轮箱型号<br>Gearbox Model</td>
                <td>${gearbox.model || '-'}</td>
              </tr>
              <tr>
                <td class="fw-bold">额定功率<br>Rated Power</td>
                <td>${gearbox.power || '-'} kW</td>
              </tr>
              <tr>
                <td class="fw-bold">减速比<br>Reduction Ratio</td>
                <td>${gearbox.ratio?.toFixed(2) || '-'}</td>
              </tr>
              <tr>
                <td class="fw-bold">输入转速<br>Input Speed</td>
                <td>${gearbox.inputSpeed || '-'} r/min</td>
              </tr>
              <tr>
                <td class="fw-bold">输出转速<br>Output Speed</td>
                <td>${gearbox.outputSpeed?.toFixed(1) || '-'} r/min</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        <!-- 更多分段对照内容... -->
        
      </div>
    `;
  };
  
  // 全文对照模式实现
  const generateCompleteBilingualAgreement = (gearbox, coupling, pump, options) => {
    const chineseAgreement = generateChineseAgreement(gearbox, coupling, pump, options);
    const englishAgreement = generateEnglishAgreement(gearbox, coupling, pump, options);
    
    return `
      <div class="agreement-container bilingual-complete">
        <!-- 中文协议 -->
        <div class="zh-section mb-5">
          ${chineseAgreement}
        </div>
        
        <div class="page-break"></div>
        
        <!-- 英文协议 -->
        <div class="en-section">
          ${englishAgreement}
        </div>
      </div>
    `;
  };
  
  // 下面保留所有原有生成函数
  
  // 协议总则生成函数
  const generateGeneralSection = (options, sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. 总则</h3>
        <p>${sectionCount.current}.1 本技术协议由供需双方共同签署，明确${options.projectName || '项目'}所需船用齿轮箱的技术规格、性能参数、测试验收及质保等要求。</p>
        <p>${sectionCount.current}.2 适用范围：本技术协议适用于${options.projectName || '项目'}配套的${options.engineInfo?.model || ''}主机与齿轮箱传动系统。</p>
        <p>${sectionCount.current}.3 参考标准：</p>
        <ul>
          <li>中国船级社《船舶建造规范》(${new Date().getFullYear()})及其修改通报</li>
          <li>GB/T 3795 船用传动装置技术条件</li>
          <li>JB/T 9003 船用齿轮箱技术条件</li>
          <li>JB/T 5061 渔船用齿轮箱技术条件</li>
        </ul>
        <p>${sectionCount.current}.4 本技术协议是设计、制造、质量控制和交付验收的技术依据，是订货合同的附件。经双方签字后生效，一式四份，双方各执两份。</p>
      </div>
    `;
  };
  
  // 英文协议总则生成函数
  const generateEnglishGeneralSection = (options, sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. General</h3>
        <p>${sectionCount.current}.1 This Technical Agreement is made between the supplier and the purchaser to specify the technical specifications, performance parameters, acceptance tests, and warranty of the marine gearbox for ${options.projectName || 'the project'}.</p>
        <p>${sectionCount.current}.2 Scope: This Technical Agreement applies to the transmission system of ${options.engineInfo?.model || ''} main engine and gearbox for ${options.projectName || 'the project'}.</p>
        <p>${sectionCount.current}.3 Reference Standards:</p>
        <ul>
          <li>China Classification Society "Rules for Classification of Sea-going Steel Ships" (${new Date().getFullYear()}) and its notifications of revision</li>
          <li>GB/T 3795 Technical Conditions for Marine Transmission Equipment</li>
          <li>JB/T 9003 Technical Conditions for Marine Gearboxes</li>
          <li>JB/T 5061 Technical Conditions for Fishing Vessel Gearboxes</li>
        </ul>
        <p>${sectionCount.current}.4 This Technical Agreement is the technical basis for design, manufacturing, quality control and delivery acceptance, and is an attachment to the purchase contract. It shall come into effect after being signed by both parties, in four copies, with each party holding two copies.</p>
      </div>
    `;
  };
  
  // 扩展技术参数部分
  const generateTechnicalParamsSection = (gearbox, sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. 技术参数</h3>
        <h4>${sectionCount.current}.1 齿轮箱基本参数</h4>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td width="30%" class="fw-bold">齿轮箱型号</td>
              <td>${gearbox.model || '-'}</td>
            </tr>
            <tr>
              <td class="fw-bold">额定功率</td>
              <td>${gearbox.power || '-'} kW</td>
            </tr>
            <tr>
              <td class="fw-bold">减速比</td>
              <td>${gearbox.ratio?.toFixed(2) || '-'}</td>
            </tr>
            <tr>
              <td class="fw-bold">输入转速</td>
              <td>${gearbox.inputSpeed || '-'} r/min</td>
            </tr>
            <tr>
              <td class="fw-bold">输出转速</td>
              <td>${gearbox.outputSpeed?.toFixed(1) || '-'} r/min</td>
            </tr>
            <tr>
              <td class="fw-bold">重量</td>
              <td>${gearbox.weight || '-'} kg</td>
            </tr>
            <tr>
              <td class="fw-bold">扭矩储备系数</td>
              <td>${gearbox.torqueReserve || '1.4'}</td>
            </tr>
            <tr>
              <td class="fw-bold">扭矩方向</td>
              <td>${gearbox.torqueDirection || '顺时针'}</td>
            </tr>
            <tr>
              <td class="fw-bold">最大螺旋桨推力</td>
              <td>${gearbox.maxThrust || '-'} kN</td>
            </tr>
            <tr>
              <td class="fw-bold">机械效率</td>
              <td>≥ ${gearbox.efficiency || '96'}%</td>
            </tr>
          </tbody>
        </table>
        
        <h4>${sectionCount.current}.2 工作条件</h4>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td width="30%" class="fw-bold">环境温度</td>
              <td>-5°C ~ +45°C</td>
            </tr>
            <tr>
              <td class="fw-bold">相对湿度</td>
              <td>≤ 95%</td>
            </tr>
            <tr>
              <td class="fw-bold">工作油压力</td>
              <td>${gearbox.workingOilPressure || '1.8'} MPa</td>
            </tr>
            <tr>
              <td class="fw-bold">润滑油压力</td>
              <td>${gearbox.lubOilPressure || '0.05'} MPa</td>
            </tr>
            <tr>
              <td class="fw-bold">润滑油温度</td>
              <td>≤ ${gearbox.lubOilTemp || '75'}°C</td>
            </tr>
            <tr>
              <td class="fw-bold">安装倾角</td>
              <td>纵倾10°，横倾15°</td>
            </tr>
            <tr>
              <td class="fw-bold">摇摆角度</td>
              <td>纵摇7.5°，横摇22.5°</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };
  
  // 英文技术参数部分
  const generateEnglishTechnicalParamsSection = (gearbox, sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. Technical Parameters</h3>
        <h4>${sectionCount.current}.1 Basic Parameters of Gearbox</h4>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td width="30%" class="fw-bold">Gearbox Model</td>
              <td>${gearbox.model || '-'}</td>
            </tr>
            <tr>
              <td class="fw-bold">Rated Power</td>
              <td>${gearbox.power || '-'} kW</td>
            </tr>
            <tr>
              <td class="fw-bold">Reduction Ratio</td>
              <td>${gearbox.ratio?.toFixed(2) || '-'}</td>
            </tr>
            <tr>
              <td class="fw-bold">Input Speed</td>
              <td>${gearbox.inputSpeed || '-'} r/min</td>
            </tr>
            <tr>
              <td class="fw-bold">Output Speed</td>
              <td>${gearbox.outputSpeed?.toFixed(1) || '-'} r/min</td>
            </tr>
            <tr>
              <td class="fw-bold">Weight</td>
              <td>${gearbox.weight || '-'} kg</td>
            </tr>
            <tr>
              <td class="fw-bold">Torque Reserve Factor</td>
              <td>${gearbox.torqueReserve || '1.4'}</td>
            </tr>
            <tr>
              <td class="fw-bold">Torque Direction</td>
              <td>${gearbox.torqueDirection || 'Clockwise'}</td>
            </tr>
            <tr>
              <td class="fw-bold">Maximum Propeller Thrust</td>
              <td>${gearbox.maxThrust || '-'} kN</td>
            </tr>
            <tr>
              <td class="fw-bold">Mechanical Efficiency</td>
              <td>≥ ${gearbox.efficiency || '96'}%</td>
            </tr>
          </tbody>
        </table>
        
        <h4>${sectionCount.current}.2 Working Conditions</h4>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td width="30%" class="fw-bold">Ambient Temperature</td>
              <td>-5°C ~ +45°C</td>
            </tr>
            <tr>
              <td class="fw-bold">Relative Humidity</td>
              <td>≤ 95%</td>
            </tr>
            <tr>
              <td class="fw-bold">Working Oil Pressure</td>
              <td>${gearbox.workingOilPressure || '1.8'} MPa</td>
            </tr>
            <tr>
              <td class="fw-bold">Lubricating Oil Pressure</td>
              <td>${gearbox.lubOilPressure || '0.05'} MPa</td>
            </tr>
            <tr>
              <td class="fw-bold">Lubricating Oil Temperature</td>
              <td>≤ ${gearbox.lubOilTemp || '75'}°C</td>
            </tr>
            <tr>
              <td class="fw-bold">Installation Inclination</td>
              <td>Pitch 10°, Roll 15°</td>
            </tr>
            <tr>
              <td class="fw-bold">Swing Angle</td>
              <td>Pitching 7.5°, Rolling 22.5°</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };
  
  // 添加监控和报警系统部分
  const generateMonitoringSystemSection = (gearbox, sectionCount) => {
    // 根据齿轮箱系列确定不同的参数
    const isHCSeries = gearbox.model?.startsWith('HC');
    const isGWSeries = gearbox.model?.startsWith('GW');
    
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. 监控与报警系统</h3>
        
        <h4>${sectionCount.current}.1 显示装置</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th width="10%">序号</th>
              <th width="40%">名称</th>
              <th width="25%">数量</th>
              <th width="25%">说明</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>正车工作油压力表</td>
              <td>1只</td>
              <td>量程0-3MPa</td>
            </tr>
            ${gearbox.hasReverseGear ? `
            <tr>
              <td>2</td>
              <td>倒车工作油压力表</td>
              <td>1只</td>
              <td>量程0-3MPa</td>
            </tr>
            ` : ''}
            <tr>
              <td>${gearbox.hasReverseGear ? '3' : '2'}</td>
              <td>润滑油压力表</td>
              <td>1只</td>
              <td>量程0-1MPa</td>
            </tr>
            <tr>
              <td>${gearbox.hasReverseGear ? '4' : '3'}</td>
              <td>润滑油温度表</td>
              <td>1只</td>
              <td>PT100, 量程0-100°C</td>
            </tr>
          </tbody>
        </table>
        
        <h4>${sectionCount.current}.2 报警装置</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th width="10%">序号</th>
              <th width="30%">名称</th>
              <th width="30%">报警设定值</th>
              <th width="30%">备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>工作油低压报警</td>
              <td>≤ ${isHCSeries ? '1.3' : '1.4'} MPa</td>
              <td>输出断开报警信号</td>
            </tr>
            <tr>
              <td>2</td>
              <td>润滑油低压报警</td>
              <td>≤ 0.05 MPa</td>
              <td>输出断开报警信号</td>
            </tr>
            <tr>
              <td>3</td>
              <td>润滑油低压主机降速</td>
              <td>≤ 0.04 MPa</td>
              <td>输出闭合主机降速信号</td>
            </tr>
            <tr>
              <td>4</td>
              <td>润滑油极低压主机停机</td>
              <td>≤ 0.025 MPa</td>
              <td>输出闭合主机停机信号</td>
            </tr>
            <tr>
              <td>5</td>
              <td>润滑油高温报警</td>
              <td>≥ 70°C</td>
              <td>输出断开报警信号</td>
            </tr>
            <tr>
              <td>6</td>
              <td>油滤压差报警</td>
              <td>≥ 0.15 MPa</td>
              <td>输出断开报警信号</td>
            </tr>
          </tbody>
        </table>
        
        <p>注：</p>
        <ol>
          <li>所有报警触点容量为24V/5A</li>
          <li>所有报警信号延时3秒后有效</li>
          <li>所有报警控制器由制造厂供货并安装在齿轮箱上</li>
        </ol>
      </div>
    `;
  };
  
  // 英文监控和报警系统部分
  const generateEnglishMonitoringSystemSection = (gearbox, sectionCount) => {
    // 根据齿轮箱系列确定不同的参数
    const isHCSeries = gearbox.model?.startsWith('HC');
    const isGWSeries = gearbox.model?.startsWith('GW');
    
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. Monitoring and Alarm System</h3>
        
        <h4>${sectionCount.current}.1 Display Devices</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th width="10%">No.</th>
              <th width="40%">Name</th>
              <th width="25%">Quantity</th>
              <th width="25%">Specification</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Ahead Working Oil Pressure Gauge</td>
              <td>1 piece</td>
              <td>Range 0-3MPa</td>
            </tr>
            ${gearbox.hasReverseGear ? `
            <tr>
              <td>2</td>
              <td>Astern Working Oil Pressure Gauge</td>
              <td>1 piece</td>
              <td>Range 0-3MPa</td>
            </tr>
            ` : ''}
            <tr>
              <td>${gearbox.hasReverseGear ? '3' : '2'}</td>
              <td>Lubricating Oil Pressure Gauge</td>
              <td>1 piece</td>
              <td>Range 0-1MPa</td>
            </tr>
            <tr>
              <td>${gearbox.hasReverseGear ? '4' : '3'}</td>
              <td>Lubricating Oil Temperature Gauge</td>
              <td>1 piece</td>
              <td>PT100, Range 0-100°C</td>
            </tr>
          </tbody>
        </table>
        
        <h4>${sectionCount.current}.2 Alarm Devices</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th width="10%">No.</th>
              <th width="30%">Name</th>
              <th width="30%">Alarm Setting Value</th>
              <th width="30%">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Working Oil Low Pressure Alarm</td>
              <td>≤ ${isHCSeries ? '1.3' : '1.4'} MPa</td>
              <td>Output open alarm signal</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Lubricating Oil Low Pressure Alarm</td>
              <td>≤ 0.05 MPa</td>
              <td>Output open alarm signal</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Lubricating Oil Low Pressure Main Engine Slow Down</td>
              <td>≤ 0.04 MPa</td>
              <td>Output closed main engine slow down signal</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Lubricating Oil Extremely Low Pressure Main Engine Shutdown</td>
              <td>≤ 0.025 MPa</td>
              <td>Output closed main engine shutdown signal</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Lubricating Oil High Temperature Alarm</td>
              <td>≥ 70°C</td>
              <td>Output open alarm signal</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Oil Filter Differential Pressure Alarm</td>
              <td>≥ 0.15 MPa</td>
              <td>Output open alarm signal</td>
            </tr>
          </tbody>
        </table>
        
        <p>Note:</p>
        <ol>
          <li>All alarm contact capacity is 24V/5A</li>
          <li>All alarm signals are effective after 3 seconds delay</li>
          <li>All alarm controllers are supplied by the manufacturer and installed on the gearbox</li>
        </ol>
      </div>
    `;
  };
  
  // 添加强化的测试和验收要求
 // 添加强化的测试和验收要求
  const generateTestingSection = (sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. 测试要求</h3>
        
        <h4>${sectionCount.current}.1 出厂试验</h4>
        <p>齿轮箱出厂前须进行如下试验：</p>
        <ol>
          <li>外观检查：检查齿轮箱外观是否完好，铭牌是否清晰，油口、放油口、水口标志是否清晰，油量指示器是否完好。</li>
          <li>空载试验：空载条件下，齿轮箱运转1小时，检查温升、噪音和振动。温升不得超过环境温度30°C，噪音不得超过85dB(A)。</li>
          <li>负载试验：
            <ul>
              <li>50%额定负载运行30分钟，润滑油温升不得超过环境温度35°C。</li>
              <li>100%额定负载运行30分钟，润滑油温升不得超过环境温度45°C。</li>
            </ul>
          </li>
          <li>换向试验：进行3次正倒车换向操作，换向时间不得超过15秒，无异常现象。</li>
          <li>密封性测试：检查各接合面、轴封等部位是否有漏油现象。</li>
        </ol>
        
        <h4>${sectionCount.current}.2 验收标准</h4>
        <p>齿轮箱的验收按照如下标准执行：</p>
        <ol>
          <li>齿轮箱须通过船级社的型式认可和产品检验，提供船级社证书。</li>
          <li>齿轮箱出厂试验须经船级社验船师见证，并提供试验记录。</li>
          <li>齿轮箱的技术性能须满足本技术协议规定的各项技术参数要求。</li>
          <li>齿轮箱的制造质量须符合相关标准的规定。</li>
        </ol>
      </div>
    `;
  };
  
  // 英文测试和验收要求
  const generateEnglishTestingSection = (sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. Testing Requirements</h3>
        
        <h4>${sectionCount.current}.1 Factory Test</h4>
        <p>The following tests shall be conducted before the gearbox leaves the factory:</p>
        <ol>
          <li>Appearance inspection: Check whether the appearance of the gearbox is intact, nameplate is clear, oil port, oil drain port, water port markings are clear, and oil level indicator is in good condition.</li>
          <li>No-load test: Under no-load conditions, run the gearbox for 1 hour, check temperature rise, noise and vibration. Temperature rise shall not exceed ambient temperature by 30°C, noise shall not exceed 85dB(A).</li>
          <li>Load test:
            <ul>
              <li>Run at 50% rated load for 30 minutes, lubricating oil temperature rise shall not exceed ambient temperature by 35°C.</li>
              <li>Run at 100% rated load for 30 minutes, lubricating oil temperature rise shall not exceed ambient temperature by 45°C.</li>
            </ul>
          </li>
          <li>Reversing test: Perform 3 ahead-astern reversing operations, reversing time shall not exceed 15 seconds, no abnormal phenomena.</li>
          <li>Sealing test: Check for oil leakage at joining surfaces, shaft seals and other areas.</li>
        </ol>
        
        <h4>${sectionCount.current}.2 Acceptance Standards</h4>
        <p>The acceptance of the gearbox shall be executed according to the following standards:</p>
        <ol>
          <li>The gearbox shall pass the type approval and product inspection by the classification society, and provide the classification society certificate.</li>
          <li>The factory test of the gearbox shall be witnessed by the classification society surveyor, and provide test records.</li>
          <li>The technical performance of the gearbox shall meet the technical parameter requirements specified in this Technical Agreement.</li>
          <li>The manufacturing quality of the gearbox shall comply with the provisions of relevant standards.</li>
        </ol>
      </div>
    `;
  };
  
  // 增强质保条款
  const generateWarrantySection = (sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. 质保条款</h3>
        
        <h4>${sectionCount.current}.1 质保期限</h4>
        <p>质保期为自船舶交付验收合格之日起12个月，或自设备出厂之日起18个月，以先到为准。</p>
        
        <h4>${sectionCount.current}.2 质保范围</h4>
        <p>质保范围包括但不限于：</p>
        <ol>
          <li>质保期内因材料或制造缺陷导致的齿轮箱故障，供方负责免费维修或更换。</li>
          <li>质保范围不包括因使用不当、未按规定维护保养、擅自改装等非产品质量原因造成的故障。</li>
          <li>更换的零件质保期自更换之日起重新计算，但不超过原质保期后6个月。</li>
        </ol>
        
        <h4>${sectionCount.current}.3 服务响应</h4>
        <ol>
          <li>质保期内，供方接到故障通知后48小时内响应。</li>
          <li>如需现场服务，供方应在3个工作日内派技术人员到达现场。</li>
          <li>供方提供24小时技术咨询服务，联系电话：_______________。</li>
        </ol>
        
        <h4>${sectionCount.current}.4 备件供应</h4>
        <p>供方保证齿轮箱主要零部件的供应期不少于交船后10年。</p>
      </div>
    `;
  };
  
  // 英文质保条款
  const generateEnglishWarrantySection = (sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. Warranty Terms</h3>
        
        <h4>${sectionCount.current}.1 Warranty Period</h4>
        <p>The warranty period is 12 months from the date of vessel delivery and acceptance, or 18 months from the date of equipment ex-factory, whichever comes first.</p>
        
        <h4>${sectionCount.current}.2 Warranty Scope</h4>
        <p>The warranty scope includes but is not limited to:</p>
        <ol>
          <li>During the warranty period, the supplier is responsible for free repair or replacement of gearbox failures caused by material or manufacturing defects.</li>
          <li>The warranty scope does not include failures caused by improper use, failure to maintain according to regulations, unauthorized modifications and other non-product quality reasons.</li>
          <li>The warranty period for replaced parts shall be recalculated from the date of replacement, but not exceeding 6 months after the original warranty period.</li>
        </ol>
        
        <h4>${sectionCount.current}.3 Service Response</h4>
        <ol>
          <li>During the warranty period, the supplier shall respond within 48 hours after receiving failure notification.</li>
          <li>If on-site service is required, the supplier shall send technical personnel to the site within 3 working days.</li>
          <li>The supplier provides 24-hour technical consultation service, contact phone: _______________.</li>
        </ol>
        
        <h4>${sectionCount.current}.4 Spare Parts Supply</h4>
        <p>The supplier guarantees that the supply period for main parts of the gearbox is not less than 10 years after vessel delivery.</p>
      </div>
    `;
  };
  
  // 添加齿轮箱配套设备部分
  const generateAccessoriesSection = (coupling, pump, sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. 配套设备</h3>
        
        ${coupling ? `
        <h4>${sectionCount.current}.1 联轴器</h4>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td width="30%" class="fw-bold">联轴器型号</td>
              <td>${coupling.model || '-'}</td>
            </tr>
            <tr>
              <td class="fw-bold">联轴器类型</td>
              <td>高弹性联轴器</td>
            </tr>
            <tr>
              <td class="fw-bold">额定扭矩</td>
              <td>${coupling.torque || '-'} N·m</td>
            </tr>
            <tr>
              <td class="fw-bold">最大扭矩</td>
              <td>${coupling.maxTorque || '-'} N·m</td>
            </tr>
            <tr>
              <td class="fw-bold">重量</td>
              <td>${coupling.weight || '-'} kg</td>
            </tr>
          </tbody>
        </table>
        ` : ''}
        
        ${pump ? `
        <h4>${sectionCount.current}.${coupling ? '2' : '1'} 备用泵</h4>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td width="30%" class="fw-bold">备用泵型号</td>
              <td>${pump.model || '-'}</td>
            </tr>
            <tr>
              <td class="fw-bold">流量</td>
              <td>${pump.flow || '-'} m³/h</td>
            </tr>
            <tr>
              <td class="fw-bold">压力</td>
              <td>${pump.pressure || '-'} MPa</td>
            </tr>
            <tr>
              <td class="fw-bold">电机功率</td>
              <td>${pump.power || '-'} kW</td>
            </tr>
            <tr>
              <td class="fw-bold">电源</td>
              <td>AC 380V/50Hz</td>
            </tr>
            <tr>
              <td class="fw-bold">接线方式</td>
              <td>${pump.connectionType || '星形接线'}</td>
            </tr>
            <tr>
              <td class="fw-bold">防护等级</td>
              <td>${pump.protectionClass || 'IP56'}</td>
            </tr>
          </tbody>
        </table>
        ` : ''}
        
        <h4>${sectionCount.current}.${coupling && pump ? '3' : coupling || pump ? '2' : '1'} 随机附件</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th width="10%">序号</th>
              <th width="40%">名称</th>
              <th width="20%">数量</th>
              <th width="30%">备注</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>螺栓</td>
              <td>1套</td>
              <td>箱体固定用</td>
            </tr>
            <tr>
              <td>2</td>
              <td>温度计</td>
              <td>1只</td>
              <td>0-100°C</td>
            </tr>
            <tr>
              <td>3</td>
              <td>压力表</td>
              <td>2只</td>
              <td>0-2.5MPa，0-1.0MPa</td>
            </tr>
            <tr>
              <td>4</td>
              <td>专用工具</td>
              <td>1套</td>
              <td>安装及维修用</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };
  
  // 英文配套设备部分
  const generateEnglishAccessoriesSection = (coupling, pump, sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. Accessories</h3>
        
        ${coupling ? `
        <h4>${sectionCount.current}.1 Coupling</h4>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td width="30%" class="fw-bold">Coupling Model</td>
              <td>${coupling.model || '-'}</td>
            </tr>
            <tr>
              <td class="fw-bold">Coupling Type</td>
              <td>Highly Elastic Coupling</td>
            </tr>
            <tr>
              <td class="fw-bold">Rated Torque</td>
              <td>${coupling.torque || '-'} N·m</td>
            </tr>
            <tr>
              <td class="fw-bold">Maximum Torque</td>
              <td>${coupling.maxTorque || '-'} N·m</td>
            </tr>
            <tr>
              <td class="fw-bold">Weight</td>
              <td>${coupling.weight || '-'} kg</td>
            </tr>
          </tbody>
        </table>
        ` : ''}
        
        ${pump ? `
        <h4>${sectionCount.current}.${coupling ? '2' : '1'} Standby Pump</h4>
        <table class="table table-bordered">
          <tbody>
            <tr>
              <td width="30%" class="fw-bold">Standby Pump Model</td>
              <td>${pump.model || '-'}</td>
            </tr>
            <tr>
              <td class="fw-bold">Flow Rate</td>
              <td>${pump.flow || '-'} m³/h</td>
            </tr>
            <tr>
              <td class="fw-bold">Pressure</td>
              <td>${pump.pressure || '-'} MPa</td>
            </tr>
            <tr>
              <td class="fw-bold">Motor Power</td>
              <td>${pump.power || '-'} kW</td>
            </tr>
            <tr>
              <td class="fw-bold">Power Supply</td>
              <td>AC 380V/50Hz</td>
            </tr>
            <tr>
              <td class="fw-bold">Connection Type</td>
              <td>${pump.connectionType || 'Star Connection'}</td>
            </tr>
            <tr>
              <td class="fw-bold">Protection Class</td>
              <td>${pump.protectionClass || 'IP56'}</td>
            </tr>
          </tbody>
        </table>
        ` : ''}
        
        <h4>${sectionCount.current}.${coupling && pump ? '3' : coupling || pump ? '2' : '1'} Accompanying Accessories</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th width="10%">No.</th>
              <th width="40%">Name</th>
              <th width="20%">Quantity</th>
              <th width="30%">Remarks</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Bolts</td>
              <td>1 set</td>
              <td>For housing fixation</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Thermometer</td>
              <td>1 piece</td>
              <td>0-100°C</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Pressure Gauges</td>
              <td>2 pieces</td>
              <td>0-2.5MPa, 0-1.0MPa</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Special Tools</td>
              <td>1 set</td>
              <td>For installation and maintenance</td>
            </tr>
          </tbody>
        </table>
      </div>
    `;
  };
  
  // 添加文档要求部分
  const generateDocumentationSection = (sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. 文件资料</h3>
        
        <h4>${sectionCount.current}.1 提交文件清单</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th width="10%">序号</th>
              <th width="40%">文件名称</th>
              <th width="25%">提交份数</th>
              <th width="25%">提交时间</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>齿轮箱外形安装图</td>
              <td>4份</td>
              <td>合同生效后15天内</td>
            </tr>
            <tr>
              <td>2</td>
              <td>电气系统图</td>
              <td>4份</td>
              <td>合同生效后15天内</td>
            </tr>
            <tr>
              <td>3</td>
              <td>产品合格证</td>
              <td>2份</td>
              <td>设备交付时</td>
            </tr>
            <tr>
              <td>4</td>
              <td>船级社证书</td>
              <td>2份</td>
              <td>设备交付时</td>
            </tr>
            <tr>
              <td>5</td>
              <td>使用维护说明书</td>
              <td>4份</td>
              <td>设备交付时</td>
            </tr>
            <tr>
              <td>6</td>
              <td>出厂试验报告</td>
              <td>2份</td>
              <td>设备交付时</td>
            </tr>
            <tr>
              <td>7</td>
              <td>装箱单</td>
              <td>2份</td>
              <td>设备交付时</td>
            </tr>
          </tbody>
        </table>
        
        <h4>${sectionCount.current}.2 文件要求</h4>
        <ol>
          <li>所有文件资料须提供中文版本。如合同要求，可同时提供英文版本。</li>
          <li>图纸须按照标准图幅绘制，并注明比例。</li>
          <li>除纸质文件外，还须提供所有文件的电子版本（PDF格式）。</li>
        </ol>
        
        <h4>${sectionCount.current}.3 文件确认流程</h4>
        <ol>
          <li>购方在收到设计资料后10个工作日内给予确认或提出修改意见。</li>
          <li>供方在收到修改意见后10个工作日内提交修改后的资料。</li>
          <li>若购方在规定时间内未给予答复，则视为认可。</li>
        </ol>
      </div>
    `;
  };
  
  // 英文文档要求部分
  const generateEnglishDocumentationSection = (sectionCount) => {
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. Documentation</h3>
        
        <h4>${sectionCount.current}.1 Document Submission List</h4>
        <table class="table table-bordered">
          <thead>
            <tr>
              <th width="10%">No.</th>
              <th width="40%">Document Name</th>
              <th width="25%">Submission Copies</th>
              <th width="25%">Submission Time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Gearbox Outline Installation Drawing</td>
              <td>4 copies</td>
              <td>Within 15 days after contract effective</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Electrical System Diagram</td>
              <td>4 copies</td>
              <td>Within 15 days after contract effective</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Product Certificate</td>
              <td>2 copies</td>
              <td>Upon equipment delivery</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Classification Society Certificate</td>
              <td>2 copies</td>
              <td>Upon equipment delivery</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Operation and Maintenance Manual</td>
              <td>4 copies</td>
              <td>Upon equipment delivery</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Factory Test Report</td>
              <td>2 copies</td>
              <td>Upon equipment delivery</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Packing List</td>
              <td>2 copies</td>
              <td>Upon equipment delivery</td>
            </tr>
          </tbody>
        </table>
        
        <h4>${sectionCount.current}.2 Document Requirements</h4>
        <ol>
          <li>All documents shall be provided in Chinese version. If required by the contract, English version can be provided simultaneously.</li>
          <li>Drawings shall be drawn according to standard format and indicate the scale.</li>
          <li>In addition to paper documents, electronic versions (PDF format) of all documents shall also be provided.</li>
        </ol>
        
        <h4>${sectionCount.current}.3 Document Confirmation Process</h4>
        <ol>
          <li>The buyer shall give confirmation or propose modification opinions within 10 working days after receiving the design documents.</li>
          <li>The supplier shall submit the modified documents within 10 working days after receiving the modification opinions.</li>
          <li>If the buyer does not respond within the specified time, it shall be deemed as approval.</li>
        </ol>
      </div>
    `;
  };
  
  // 添加特殊订货要求部分
  const generateSpecialRequirementsSection = (specialRequirements, sectionCount) => {
    if (!specialRequirements || specialRequirements.trim() === '') {
      return '';
    }
    
    const requirements = specialRequirements.split('\n')
      .filter(line => line && line.trim() !== '')
      .map((line, index) => `<li>${line.trim()}</li>`)
      .join('\n');
    
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. 特殊订货要求</h3>
        <ol>
          ${requirements}
        </ol>
      </div>
    `;
  };
  
  // 英文特殊订货要求部分
  const generateEnglishSpecialRequirementsSection = (specialRequirements, sectionCount) => {
    if (!specialRequirements || specialRequirements.trim() === '') {
      return '';
    }
    
    const requirements = specialRequirements.split('\n')
      .filter(line => line && line.trim() !== '')
      .map((line, index) => `<li>${line.trim()}</li>`)
      .join('\n');
    
    return `
      <div class="agreement-section">
        <h3>${sectionCount.current}. Special Order Requirements</h3>
        <ol>
          ${requirements}
        </ol>
      </div>
    `;
  };
  
  // 修改UI部分，添加预览功能
  return (
    <div>
      {error && (
        <Alert variant="danger" dismissible onClose={() => setError('')}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}
      
      <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <i className="bi bi-gear-fill me-2"></i>
          技术协议设置
        </Card.Header>
        <Card.Body>
          <Tabs 
            activeKey={activeTab} 
            onSelect={handleTabSelect}
            id="agreement-tabs"
          >
            <Tab eventKey="template" title="协议模板">
              <Row className="mt-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>协议类型</Form.Label>
                    <Form.Select
                      value={agreementType}
                      onChange={(e) => setAgreementType(e.target.value)}
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        borderColor: colors.inputBorder
                      }}
                    >
                      {agreementTemplates.map(template => (
                        <option key={template.id} value={template.id}>
                          {template.name} - {template.description}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>语言选择</Form.Label>
                    <Form.Select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      style={{
                        backgroundColor: colors.inputBg,
                        color: colors.text,
                        borderColor: colors.inputBorder
                      }}
                    >
                      {languageOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              {language === 'bilingual' && (
                <Row>
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>中英文对照布局</Form.Label>
                      <Form.Select
                        value={bilingualLayout}
                        onChange={(e) => setBilingualLayout(e.target.value)}
                        style={{
                          backgroundColor: colors.inputBg,
                          color: colors.text,
                          borderColor: colors.inputBorder
                        }}
                      >
                        {bilingualLayoutOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Form.Select>
                      <Form.Text className="text-muted">
                        {bilingualLayout === 'side-by-side' && '左右对照布局：中英文内容并排显示，适合简洁文档'}
                        {bilingualLayout === 'sequential' && '分段对照布局：段落一一对应，适合对照阅读'}
                        {bilingualLayout === 'complete' && '全文对照布局：中英文分开为两个完整文档，适合长文档'}
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
              )}
            </Tab>
            
            <Tab eventKey="content" title="内容选项">
              <div className="mt-3">
                <Form.Group className="mb-3">
                  <Form.Label>内容部分</Form.Label>
                  <div className="ms-2">
                    <Form.Check 
                      type="checkbox"
                      id="option-accessories"
                      label="包含配套设备信息"
                      checked={includeOptions.accessories}
                      onChange={(e) => handleOptionChange('accessories', e.target.checked)}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="option-monitoring"
                      label="包含监控报警系统"
                      checked={includeOptions.monitoring}
                      onChange={(e) => handleOptionChange('monitoring', e.target.checked)}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="option-testRequirements"
                      label="包含测试要求"
                      checked={includeOptions.testRequirements}
                      onChange={(e) => handleOptionChange('testRequirements', e.target.checked)}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="option-warranty"
                      label="包含质保条款"
                      checked={includeOptions.warranty}
                      onChange={(e) => handleOptionChange('warranty', e.target.checked)}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="option-documentation"
                      label="包含文件资料"
                      checked={includeOptions.documentation}
                      onChange={(e) => handleOptionChange('documentation', e.target.checked)}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="option-deliveryTerms"
                      label="包含交付条款"
                      checked={includeOptions.deliveryTerms}
                      onChange={(e) => handleOptionChange('deliveryTerms', e.target.checked)}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="option-drawings"
                      label="包含图纸和示意图"
                      checked={includeOptions.drawings}
                      onChange={(e) => handleOptionChange('drawings', e.target.checked)}
                    />
                    <Form.Check 
                      type="checkbox"
                      id="option-qualityStandards"
                      label="包含质量标准"
                      checked={includeOptions.qualityStandards}
                      onChange={(e) => handleOptionChange('qualityStandards', e.target.checked)}
                    />
                  </div>
                </Form.Group>
              </div>
              
              {/* 根据齿轮箱型号显示提示信息 */}
              {selectedComponents?.gearbox && !selectedComponents.pump && needsStandbyPump(selectedComponents.gearbox.model, { power: selectedComponents.gearbox.power }) && (
                <Alert variant="warning" className="mt-3">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  <strong>注意:</strong> 当前选择的齿轮箱型号需要配备备用泵，但未选择备用泵。技术协议中将不包含备用泵信息。
                </Alert>
              )}
            </Tab>
            
            <Tab eventKey="specialRequirements" title="特殊订货要求">
              <SpecialRequirementsTemplateSelector
                currentRequirements={specialRequirements}
                templateData={{
                  maxThrust: selectionResult?.gearboxData?.maxThrust || '50',
                  torqueReserve: '1.4',
                  continuousHours: '8',
                  maxNoise: '85',
                  maxVibration: '7.5',
                  efficiency: '96',
                  adjustmentRange: '5',
                  coolingCapacity: '25',
                  corrosionStandard: 'CCS',
                  oilType: 'SAE 80W-90',
                  PTOPower: '15',
                  classificationSociety: 'CCS',
                  '3DFormat': 'STEP',
                  DPClass: '2',
                  testHours: '4',
                  reverseCount: '5',
                  reverseTime: '15',
                  maxOilTemp: '75',
                  noiseLevel: '85',
                  notifyDays: '7',
                  responseHours: '48',
                  warrantyMonths: '12',
                  extendedWarrantyMonths: '18',
                  arrivalDays: '3',
                  extraMonths: '6',
                  partSupplyYears: '10',
                  language: '中英文',
                  toolSetCount: '1',
                  firstOilChange: '500',
                  regularOilChange: '1000',
                  guidanceDays: '3',
                  highTemp: '85',
                  lowPressure: '0.05',
                  vibrationLimit: '7.5',
                  thrustValue: '50'
                }}
                onRequirementsChange={handleSpecialRequirementsChange}
                colors={colors}
                specialRequirementTemplates={specialRequirementTemplates}
              />
            </Tab>
            
            {/* 修改：预览标签页内容为实时预览 */}
            <Tab eventKey="preview" title="预览">
              <div className="mt-3">
                {previewLoading ? (
                  <div className="text-center p-5">
                    <Spinner animation="border" variant="primary" />
                    <p className="mt-3">正在生成预览...</p>
                  </div>
                ) : previewHtml ? (
                  <div className="preview-container">
                    <div 
                      className="agreement-preview-content border rounded p-4" 
                      style={{ 
                        backgroundColor: '#fff', 
                        maxHeight: '600px', 
                        overflow: 'auto',
                        boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                      }}
                      dangerouslySetInnerHTML={{ __html: previewHtml }}
                    />
                  </div>
                ) : (
                  <div className="text-center p-5">
                    <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem', color: '#ccc' }}></i>
                    <p className="mt-3">
                      {selectedComponents?.gearbox ? 
                        "点击预览标签页后将自动生成预览" : 
                        "请先选择齿轮箱，然后才能生成预览"}
                    </p>
                  </div>
                )}
              </div>
            </Tab>
          </Tabs>
          
          <div className="d-grid mt-4">
            <Button
              variant="primary"
              onClick={handleGenerateAgreement}
              disabled={loading || !selectedComponents?.gearbox}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  生成中...
                </>
              ) : (
                <>
                  <i className="bi bi-file-earmark-text me-2"></i>
                  生成技术协议
                </>
              )}
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AgreementGenerator;