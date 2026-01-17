// src/components/AgreementGenerator/useAgreementGeneration.js
// 技术协议生成逻辑 - 自定义Hook
import { useState, useCallback, useMemo } from 'react';
import { getAgreementTemplate, fillTemplate, TemplateType } from '../../utils/agreementTemplateManager';
import { generateBilingualAgreement } from '../../utils/bilingualTemplates';
import { getSeriesDefaults, extractGearboxParams, extractEngineParams } from '../../utils/seriesDefaultParams';
import { renderToStaticMarkup } from 'react-dom/server';
import TwinEngineArrangementDiagram from '../TwinEngineArrangementDiagram';
// 导入船检证书需求生成器
import {
  ClassificationType,
  generateCertificateList,
  getClassificationDisplayName,
  getCertificateRequirements,
  requiresOnSiteInspection
} from '../../utils/classificationCertificates';

/**
 * 准备模板数据 - 合并系列默认值、选型数据和可编辑信息
 */
const prepareTemplateData = ({
  selectedComponents,
  selectionResult,
  projectInfo,
  editableInfo,
  options,
  specialRequirements,
  specialRequirementsFormat,
  selectedCouplingModel
}) => {
  const gearbox = selectedComponents?.gearbox || {};
  const engine = selectionResult?.engineData || {};
  const ship = projectInfo || {};

  // 获取系列默认参数并与选型数据合并
  const seriesDefaults = getSeriesDefaults(gearbox.model);
  const gearboxParams = extractGearboxParams(gearbox);
  const engineParams = extractEngineParams({ power: engine.power, speed: engine.speed, ratio: gearbox.reductionRatio });

  // 生成法规列表HTML
  let regulationsListHtml = '';
  if (seriesDefaults.regulations && Array.isArray(seriesDefaults.regulations)) {
    regulationsListHtml = seriesDefaults.regulations.map(reg => `<li>${reg}</li>`).join('\n');
  }

  return {
    // 系列默认参数（作为基础值）
    ...seriesDefaults,
    // 法规列表（用于DT/GWC系列协议）
    regulationsList: regulationsListHtml,

    // DT系列特有字段
    agreementNumber: ship.agreementNumber || '',
    designInstitute: ship.designInstitute || ship.designer || '',
    outputDirection: seriesDefaults.outputDirection || '相反',

    // 电动滑油泵详细参数（DT系列特有）
    oilPumpModel: seriesDefaults.oilPumpModel || '',
    oilPumpFlowRate: seriesDefaults.oilPumpFlowRate || '',
    oilPumpPower: seriesDefaults.oilPumpPower || '',
    oilPumpVoltage: seriesDefaults.oilPumpVoltage || '',
    oilPumpProtection: seriesDefaults.oilPumpProtection || '',
    oilPumpInsulation: seriesDefaults.oilPumpInsulation || '',

    // 项目和船舶信息 - 优先使用可编辑信息
    projectName: editableInfo.shipName || ship.projectName || '',
    projectNumber: editableInfo.projectNumber || ship.projectNumber || '',
    shipOwner: editableInfo.shipOwner || ship.customerName || '',
    shipyard: editableInfo.shipyard || ship.shipyard || '',
    shipType: editableInfo.shipType || ship.shipType || '',
    shipManufacturer: ship.shipManufacturer || '',
    shipProjectNumber: editableInfo.projectNumber || ship.projectNumber || '',
    shipDesigner: ship.designer || '',
    registrationNumber: ship.registrationNumber || '',
    shipName: editableInfo.shipName || ship.shipName || ship.projectName || '',

    // 船检类型 - 优先使用editableInfo中的选择
    classificationType: editableInfo.classificationType || ship.classificationType || ship.classification || ClassificationType.NONE,
    classificationName: getClassificationDisplayName(editableInfo.classificationType || ship.classificationType || ship.classification || ClassificationType.NONE),

    // 船检要求选择 - 旧版checkbox兼容（基于editableInfo的选择）
    ccsEntry: (editableInfo.classificationType || ship.classification) === 'CCS_ENTRY' ? 'checked' : '',
    ccsNonEntry: (editableInfo.classificationType || ship.classification) === 'CCS_NON_ENTRY' ? 'checked' : '',
    ccsFishingVessel: (editableInfo.classificationType || ship.classification) === 'CCS_FISHING' ? 'checked' : '',
    zyFishingVessel: (editableInfo.classificationType || ship.classification) === 'ZY_FISHING' ? 'checked' : '',
    foreignShipInspection: ['DNV', 'LR', 'ABS', 'BV', 'NK', 'KR', 'OTHER'].includes(editableInfo.classificationType || ship.classification) ? 'checked' : '',

    // 动态生成的证书清单
    certificateList: generateCertificateList(
      editableInfo.classificationType || ship.classificationType || ship.classification || ClassificationType.NONE,
      ship.quantity || 1
    ).join('<br/>'),
    // 证书清单HTML列表格式
    certificateListHtml: (() => {
      const classType = editableInfo.classificationType || ship.classificationType || ship.classification || ClassificationType.NONE;
      const items = generateCertificateList(classType, ship.quantity || 1);
      return items.length > 0
        ? '<ol>' + items.map(item => `<li>${item}</li>`).join('') + '</ol>'
        : '无';
    })(),
    // 船检验收要求
    inspectionRequirement: (() => {
      const classType = editableInfo.classificationType || ship.classificationType || ship.classification || ClassificationType.NONE;
      return requiresOnSiteInspection(classType)
        ? `需经${getCertificateRequirements(classType).society || '船检'}验船师现场检验`
        : '';
    })(),

    // 主机信息 - 优先使用可编辑信息
    engineModel: editableInfo.engineModel || ship.engineModel || engine.model || '',
    enginePower: editableInfo.enginePower || engine.power || projectInfo?.power || '',
    engineSpeed: editableInfo.engineSpeed || engine.speed || projectInfo?.speed || '',
    engineRotation: editableInfo.engineRotation || engine.rotation || seriesDefaults.engineRotation || '顺时针',
    flywheelSpec: editableInfo.flywheelSpec || ship.flywheelSpec || '',

    // 主机转向选择
    clockwise: (engine.rotation === '顺时针' || !engine.rotation) ? 'checked' : '',
    counterClockwise: engine.rotation === '逆时针' ? 'checked' : '',

    // 主机最低稳定转速
    minSpeed: engine.minStableSpeed || '40',
    minSpeedIsPercent: (engine.minStableSpeedType === 'PERCENT' || !engine.minStableSpeedType) ? 'checked' : '',
    minSpeedIsOther: engine.minStableSpeedType === 'OTHER' ? 'checked' : '',
    minSpeedOther: engine.minStableSpeedOther || '',

    // 使用工况
    mainPropulsion: (ship.usage === 'MAIN_PROPULSION' || !ship.usage) ? 'checked' : '',
    otherPropulsion: ship.usage === 'OTHER' ? 'checked' : '',

    // 齿轮箱信息
    model: gearbox.model || '',
    gearboxModel: gearbox.model || '',
    reductionRatio: gearbox.reductionRatio || engineParams.reductionRatio || '',
    arrangement: gearbox.arrangement || '水平排列（输入、输出轴水平中心距：0mm，垂直中心距：0mm）',
    inputCoupling: '主机厂配高弹联轴器',
    quantity: ship.quantity || seriesDefaults.quantity || '1',
    deliveryTime: ship.deliveryTime || '',

    // 监控系统
    standardMonitoring: (gearbox.monitoringSystem === 'STANDARD' || !gearbox.monitoringSystem) ? 'checked' : '',
    specialMonitoring: gearbox.monitoringSystem === 'SPECIAL' ? 'checked' : '',

    // 操控方式
    manualControl: gearbox.controlType === 'MANUAL' ? 'checked' : '',
    electricControl: (gearbox.controlType === 'ELECTRIC' || !gearbox.controlType) ? 'checked' : '',
    pneumaticControl: gearbox.controlType === 'PNEUMATIC' ? 'checked' : '',
    controlVoltage: gearbox.controlVoltage || seriesDefaults.controlVoltage || '24',

    // 成套配件
    couplingModel: selectedCouplingModel || selectedComponents?.coupling?.model || '主机厂配',
    pumpModel: selectedComponents?.pump?.model || '',

    // 成套方选择
    couplingBySupplier: (gearbox.couplingSupplier === 'SUPPLIER') ? 'checked' : '',
    couplingByDemander: (gearbox.couplingSupplier === 'DEMANDER' || !gearbox.couplingSupplier) ? 'checked' : '',
    pumpBySupplier: (gearbox.pumpSupplier === 'SUPPLIER' || !gearbox.pumpSupplier) ? 'checked' : '',
    pumpByDemander: gearbox.pumpSupplier === 'DEMANDER' ? 'checked' : '',

    // 技术参数
    transmissionCapacity: gearbox.transmissionCapacity || gearboxParams.transmissionCapacity || '',
    maxInputSpeed: gearbox.maxInputSpeed || gearboxParams.maxInputSpeed || '',
    lubricationOilPressure: gearbox.lubricationOilPressure || seriesDefaults.lubricationOilPressure || '0.04～0.4',
    maxPropellerThrust: gearbox.maxPropellerThrust || gearboxParams.maxPropellerThrust || '',
    centerDistance: gearbox.centerDistance || gearboxParams.centerDistance || '',
    maxOilTemperature: gearbox.maxOilTemperature || seriesDefaults.maxOilTemperature || '75',
    oilCapacity: gearbox.oilCapacity || gearboxParams.oilCapacity || '',
    oilGrade: gearbox.oilGrade || seriesDefaults.oilGrade || 'CD30 或 CD40',
    coolingWaterInletTemperature: gearbox.coolingWaterInletTemperature || seriesDefaults.coolingWaterInletTemperature || '32',
    coolingWaterVolume: gearbox.coolingWaterVolume || gearboxParams.coolingWaterVolume || '',
    coolingWaterPressure: gearbox.coolingWaterPressure || seriesDefaults.coolingWaterPressure || '0.35',
    mechanicalEfficiency: gearbox.mechanicalEfficiency || seriesDefaults.mechanicalEfficiency || '96',
    forwardDirection: '',
    weight: gearbox.weight || '',

    // 倾斜度
    longitudinalInclination: gearbox.longitudinalInclination || seriesDefaults.longitudinalInclination || '10',
    transverseInclination: gearbox.transverseInclination || seriesDefaults.transverseInclination || '15',
    longitudinalShaking: gearbox.longitudinalShaking || seriesDefaults.longitudinalShaking || '7.5',
    transverseShaking: gearbox.transverseShaking || seriesDefaults.transverseShaking || '22.5',

    // 安装和其他参数
    installationMethod: gearbox.installationMethod || seriesDefaults.installationMethod || '与船体基座为刚性安装',
    lubricationOilPump: gearbox.lubricationOilPump || seriesDefaults.lubricationOilPump || '',
    overhaulTime: gearbox.overhaulTime || seriesDefaults.overhaulTime || '10000',
    nameplateSpecification: gearbox.nameplateSpecification || seriesDefaults.nameplateSpecification || '不锈钢，黑底白字阳文，中英文对照',
    instrumentsAndAlarms: gearbox.instrumentsAndAlarms || seriesDefaults.instrumentsAndAlarms || '',

    // 联轴器信息
    couplingManufacturer: gearbox.couplingManufacturer || seriesDefaults.couplingManufacturer || '杭州前进联轴器有限公司',
    couplingConnections: seriesDefaults.couplingConnections || '配齐与电机和齿轮箱的联接件',

    // 配置选项
    approvalPeriod: (options.approvalPeriod || seriesDefaults.approvalPeriod || 10).toString(),
    feedbackPeriod: (options.feedbackPeriod || seriesDefaults.feedbackPeriod || 10).toString(),
    warrantyPeriod: options.warrantyPeriod || seriesDefaults.warrantyPeriod || '十二个月',

    // 特殊订货要求
    specialRequirements: specialRequirements || '无',
    specialRequirementsFormat: specialRequirementsFormat,

    // 选项标记
    includeQualitySection: options.includeQualitySection,
    includeMaintenanceSection: options.includeMaintenanceSection,
    includeAttachmentSection: options.includeAttachmentSection,
    includeShipInfo: options.includeShipInfo,

    // 监控报警参数
    lowOilPressureAlarm: gearbox.lowOilPressureAlarm || seriesDefaults.lowOilPressureAlarm || '0.05',
    lowWorkingOilPressureAlarm: gearbox.lowWorkingOilPressureAlarm || seriesDefaults.lowWorkingOilPressureAlarm || '1.3',
    highOilTemperatureAlarm: gearbox.highOilTemperatureAlarm || seriesDefaults.highOilTemperatureAlarm || '75',
    workingOilPressureAlarm: seriesDefaults.workingOilPressureAlarm || '1.1',
    lubOilPressureAlarm: seriesDefaults.lubOilPressureAlarm || '0.1',

    // 服务信息
    servicePhone: seriesDefaults.servicePhone || '0571-82673888',

    // HCT模板特有
    powerArrangement: '柴油机——高弹联轴器——齿轮箱——螺旋桨',
    arrangementDiagram: renderToStaticMarkup(
      <TwinEngineArrangementDiagram
        gearboxType={gearbox.model?.match(/^(GWC|GWL|HC|HCT|HCM|HCD|DT)/i)?.[1]?.toUpperCase() || 'GWC'}
        propellerConfig="outward"
        width={650}
        height={380}
      />
    ),
    gearboxFunctions: '具有减速、倒顺离合和承受螺旋桨推力的功能',
    inputRotation: '顺时针',
    outputRotation: '详见排列图示',
    propellerThrust: gearbox.maxPropellerThrust || gearboxParams.maxPropellerThrust || '',
    reversalTime: seriesDefaults.reversalTime || seriesDefaults.directionChangeTime || '10',
    workingOilPressure: seriesDefaults.workingOilPressure || '1.8-2.0',

    // DT模板特有 - 法规文本
    regulations: seriesDefaults.regulations
      ? seriesDefaults.regulations.join('；')
      : '中国船级社《钢质内河船舶建造规范》（2016年版）及有关修改通报；' +
        '中华人民共和国海事局《船舶与海上设施法定检验规则—内河船舶法定检验技术规则》（2019年版）及其修改和变更通报；' +
        '中国船级社《材料与焊接规范》（2021年版）及修改和变更通报',

    // 为保证兼容性添加的备用字段
    designer: ship.designer || '',
  };
};

/**
 * 格式化特殊订货要求为HTML列表
 */
const formatSpecialRequirements = (specialRequirements) => {
  if (!specialRequirements || specialRequirements.trim() === '') {
    return '无';
  }

  try {
    const reqLines = specialRequirements.split('\n').filter(line => line.trim() !== '');
    if (reqLines.length > 0) {
      const reqListItems = reqLines.map((line, index) => `<li key="req-${index}">${line.trim()}</li>`).join('');
      return '<ol class="special-requirements-list">' + reqListItems + '</ol>';
    }
  } catch (reqError) {
    console.error("处理特殊要求格式失败:", reqError);
  }

  return specialRequirements;
};

/**
 * 确保协议内容包含标题
 */
const ensureTitle = (content, templateType) => {
  if (content.includes('class="agreement-title"')) {
    return content;
  }

  console.warn(`模板中缺少标题，正在自动添加标题 - ${templateType}`);

  const titleMap = {
    [TemplateType.GWC]: 'GWC系列船用齿轮箱技术协议',
    [TemplateType.HCT]: 'HCT系列船用齿轮箱技术协议',
    [TemplateType.HC]: 'HC系列船用齿轮箱技术协议',
    [TemplateType.DT]: 'DT系列船用齿轮箱技术协议',
    [TemplateType.HCD]: 'HCD系列船用齿轮箱技术协议',
  };

  const title = titleMap[templateType] || `${templateType}系列船用齿轮箱技术协议`;
  const titleHtml = `<h1 class="agreement-title">${title}</h1>`;

  if (content.includes('<div class="agreement-container">')) {
    return content.replace(
      '<div class="agreement-container">',
      `<div class="agreement-container">\n  ${titleHtml}\n  `
    );
  }

  return `<div class="agreement-container">\n  ${titleHtml}\n  ${content}\n</div>`;
};

/**
 * 技术协议生成Hook
 */
const useAgreementGeneration = ({
  selectedComponents,
  selectionResult,
  projectInfo,
  editableInfo,
  options,
  specialRequirements,
  specialRequirementsFormat,
  selectedCouplingModel,
  templateType,
  language,
  isBilingual,
  bilingualLayout,
  onGenerated
}) => {
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 获取模板数据，用于特殊订货要求模板中的变量替换
  const getTemplateDataForRequirements = useCallback(() => {
    try {
      const gearbox = selectedComponents?.gearbox || {};
      const engine = selectionResult?.engineData || {};

      return {
        maxInputSpeed: (gearbox.maxInputSpeed || engine.speed || '1800').toString(),
        maxPropellerThrust: (gearbox.maxPropellerThrust || '50').toString(),
        mechanicalEfficiency: (gearbox.mechanicalEfficiency || '96').toString(),
        longitudinalInclination: (gearbox.longitudinalInclination || '10').toString(),
        transverseInclination: (gearbox.transverseInclination || '15').toString(),
        coolingWaterInletTemperature: (gearbox.coolingWaterInletTemperature || '32').toString(),
        coolingWaterVolume: (gearbox.coolingWaterVolume || '2').toString(),
        coolingWaterPressure: (gearbox.coolingWaterPressure || '0.35').toString(),
        lubricationOilPressure: (gearbox.lubricationOilPressure || '0.04～0.4').toString(),
        maxOilTemperature: (gearbox.maxOilTemperature || '75').toString(),
        oilCapacity: (gearbox.oilCapacity || '100').toString(),
        oilGrade: (gearbox.oilGrade || 'CD40').toString(),
        lowOilPressureAlarm: (gearbox.lowOilPressureAlarm || '0.05').toString(),
        highOilTemperatureAlarm: (gearbox.highOilTemperatureAlarm || '75').toString()
      };
    } catch (error) {
      console.error("获取模板数据出错:", error);
      return {
        maxInputSpeed: '1800',
        maxPropellerThrust: '50',
        mechanicalEfficiency: '96',
        longitudinalInclination: '10',
        transverseInclination: '15',
        coolingWaterInletTemperature: '32',
        coolingWaterVolume: '2',
        coolingWaterPressure: '0.35',
        lubricationOilPressure: '0.04～0.4',
        maxOilTemperature: '75',
        oilCapacity: '100',
        oilGrade: 'CD40',
        lowOilPressureAlarm: '0.05',
        highOilTemperatureAlarm: '75'
      };
    }
  }, [selectedComponents, selectionResult]);

  // 生成双语版技术协议
  const generateBilingualAgreementContent = useCallback(() => {
    const gearbox = selectedComponents?.gearbox || {};

    if (!gearbox.model) {
      throw new Error('未选择齿轮箱，无法生成协议');
    }

    const templateData = prepareTemplateData({
      selectedComponents,
      selectionResult,
      projectInfo,
      editableInfo,
      options,
      specialRequirements,
      specialRequirementsFormat,
      selectedCouplingModel
    });

    // 使用双语生成器生成内容，并根据布局类型添加相应的CSS类名
    let content = '';

    if (bilingualLayout === 'side-by-side') {
      content = generateBilingualAgreement(templateData, bilingualLayout)
        .replace('<div class="container bilingual-document">',
          '<div class="container bilingual-document side-by-side">');
    } else if (bilingualLayout === 'sequential') {
      content = generateBilingualAgreement(templateData, bilingualLayout)
        .replace('<div class="container bilingual-document">',
          '<div class="container bilingual-document sequential-layout">');
    } else {
      content = generateBilingualAgreement(templateData, bilingualLayout)
        .replace('<div class="container bilingual-document">',
          '<div class="container bilingual-document complete-layout">');
    }

    return {
      type: templateType,
      language: 'bilingual',
      html: content,
      options: { ...options },
      data: templateData,
      bilingualLayout: bilingualLayout
    };
  }, [selectedComponents, selectionResult, projectInfo, editableInfo, options, specialRequirements, specialRequirementsFormat, selectedCouplingModel, templateType, bilingualLayout]);

  // 生成单语种技术协议
  const generateSingleLanguageAgreementContent = useCallback(() => {
    const template = getAgreementTemplate(templateType, language, options);

    if (!template) {
      throw new Error(`找不到${templateType}系列的${language === 'zh' ? '中文' : '英文'}模板`);
    }

    const gearbox = selectedComponents?.gearbox || {};

    if (!gearbox.model) {
      throw new Error('未选择齿轮箱，无法生成协议');
    }

    const templateData = prepareTemplateData({
      selectedComponents,
      selectionResult,
      projectInfo,
      editableInfo,
      options,
      specialRequirements,
      specialRequirementsFormat,
      selectedCouplingModel
    });

    // 格式化特殊订货要求
    templateData.specialRequirements = formatSpecialRequirements(specialRequirements);

    // 填充模板
    let content = fillTemplate(template, templateData);

    // 确保标题存在
    content = ensureTitle(content, templateType);

    return {
      type: templateType,
      language: language,
      html: content,
      options: { ...options },
      data: templateData
    };
  }, [language, options, selectedComponents, selectionResult, projectInfo, editableInfo, specialRequirements, specialRequirementsFormat, templateType, selectedCouplingModel]);

  // 生成协议
  const generateAgreement = useCallback(() => {
    setLoading(true);
    setError('');

    try {
      let generatedAgreement;

      if (isBilingual) {
        generatedAgreement = generateBilingualAgreementContent();
      } else {
        generatedAgreement = generateSingleLanguageAgreementContent();
      }

      setAgreement(generatedAgreement);
      onGenerated?.(generatedAgreement);
      setLoading(false);

      return generatedAgreement;
    } catch (err) {
      console.error('生成技术协议失败:', err);
      setError(`生成技术协议失败: ${err.message}`);
      setLoading(false);
      return null;
    }
  }, [isBilingual, generateBilingualAgreementContent, generateSingleLanguageAgreementContent, onGenerated]);

  // 清除错误
  const clearError = useCallback(() => {
    setError('');
  }, []);

  return {
    agreement,
    loading,
    error,
    generateAgreement,
    clearError,
    getTemplateDataForRequirements
  };
};

export default useAgreementGeneration;
