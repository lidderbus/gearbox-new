// src/utils/agreementTemplateManager.js
/**
 * 技术协议模板管理器
 * 用于管理不同类型齿轮箱的技术协议模板，支持中英文双语
 * 简化版 - 解决编译问题
 */

// 协议模板类型枚举
export const TemplateType = {
  GWC: 'GWC',     // GWC系列船用齿轮箱
  HCT: 'HCT',     // HCT系列船用齿轮箱
  HC: 'HC',       // HC系列船用齿轮箱
  DT: 'DT',       // DT系列船用齿轮箱
  HCD: 'HCD',     // HCD系列船用齿轮箱
};

// 语言类型枚举
export const LanguageType = {
  CHINESE: 'zh',  // 中文
  ENGLISH: 'en'   // 英文
};

/**
 * 获取技术协议模板
 * @param {string} templateType - 模板类型，见TemplateType枚举
 * @param {string} language - 语言类型，见LanguageType枚举
 * @param {object} options - 可选配置参数
 * @returns {string} 协议模板HTML内容
 */
export const getAgreementTemplate = (templateType, language, options = {}) => {
  // 获取对应类型和语言的模板
  let template;
  
  switch (templateType) {
    case TemplateType.GWC:
      template = language === LanguageType.ENGLISH ? gwcEnglishTemplate : gwcChineseTemplate;
      break;
    case TemplateType.HCT:
      template = hctChineseTemplate;
      break;
    case TemplateType.HC:
      template = hcChineseTemplate;
      break;
    case TemplateType.DT:
      template = dtChineseTemplate;
      break;
    case TemplateType.HCD:
      template = hcChineseTemplate; // 与HC系列使用相同模板
      break;
    default:
      console.warn(`找不到类型 ${templateType} 的模板，使用默认GWC模板`);
      template = language === LanguageType.ENGLISH ? gwcEnglishTemplate : gwcChineseTemplate;
  }
  
  if (!template) {
    console.warn(`找不到类型 ${templateType} 的 ${language} 语言模板，使用默认中文GWC模板`);
    template = gwcChineseTemplate;
  }
  
  // 应用自定义配置
  const { 
    includeQualitySection = true, 
    includeMaintenanceSection = true,
    includeAttachmentSection = true,
    includeShipInfo = true
  } = options;
  
  // 根据选项删除不需要的部分
  let processedTemplate = template;
  
  if (!includeQualitySection) {
    processedTemplate = removeSection(processedTemplate, 'quality-section');
  }
  
  if (!includeMaintenanceSection) {
    processedTemplate = removeSection(processedTemplate, 'maintenance-section');
  }
  
  if (!includeAttachmentSection) {
    processedTemplate = removeSection(processedTemplate, 'attachment-section');
  }
  
  if (!includeShipInfo) {
    processedTemplate = removeSection(processedTemplate, 'ship-info-section');
  }
  
  return processedTemplate;
};

/**
 * 从模板中移除指定部分
 * @param {string} template - 原始模板
 * @param {string} sectionId - 要移除的部分ID
 * @returns {string} 处理后的模板
 */
const removeSection = (template, sectionId) => {
  const regex = new RegExp(`<section[^>]*id="${sectionId}"[^>]*>.*?</section>`, 's');
  return template.replace(regex, '');
};

/**
 * 替换模板中的变量
 * @param {string} template - 原始模板
 * @param {object} data - 要替换的数据对象
 * @returns {string} 替换后的内容
 */
export const fillTemplate = (template, data) => {
  let result = template;
  
  // 替换所有 {{变量名}} 格式的变量
  Object.entries(data).forEach(([key, value]) => {
    const regex = new RegExp(`{{\\s*${key}\\s*}}`, 'g');
    result = result.replace(regex, value || '');
  });
  
  // 清除未替换的变量
  result = result.replace(/{{.*?}}/g, '');
  
  return result;
};

// 导入模板
import { 
  gwcChineseTemplate, 
  gwcEnglishTemplate, 
  hctChineseTemplate, 
  hcChineseTemplate, 
  dtChineseTemplate 
} from './agreementTemplates';

export default {
  getAgreementTemplate,
  fillTemplate,
  TemplateType,
  LanguageType
};
