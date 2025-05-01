// src/utils/translationUtils.js

import { technicalTerminology } from './bilingualTemplates';
import { specialRequirementTemplates } from './specialRequirementTemplates';

/**
 * 将中文技术术语翻译为英文
 * 根据专业术语库进行精确匹配
 * @param {string} text - 中文文本
 * @returns {string} 翻译后的英文文本
 */
export const translateTechnicalTerm = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // 获取术语库中所有术语，按长度降序排列（优先匹配长词）
  const terms = Object.keys(extendedTechnicalTerminology).sort((a, b) => b.length - a.length);
  
  let result = text;
  
  // 替换所有匹配的术语
  terms.forEach(term => {
    const englishTerm = extendedTechnicalTerminology[term];
    // 使用正则表达式全局替换
    const regex = new RegExp(term, 'g');
    result = result.replace(regex, englishTerm);
  });
  
  return result;
};

/**
 * 翻译特殊订货要求的整段文本
 * 将每行分别处理并翻译
 * @param {string} requirementsText - 特殊订货要求（多行文本）
 * @returns {string} 翻译后的英文文本（多行）
 */
export const translateSpecialRequirements = (requirementsText) => {
  if (!requirementsText || requirementsText === '无') {
    return 'None';
  }
  
  // 按行分割
  const lines = requirementsText.split('\n');
  
  // 逐行翻译
  const translatedLines = lines.map((line, index) => {
    const trimmedLine = line.trim();
    if (!trimmedLine) return '';
    
    // 检查是否为模板库中的内容，直接使用英文模板
    let found = false;
    let translatedLine = '';
    
    // 遍历模板库
    Object.keys(specialRequirementTemplates).forEach(category => {
      const chineseTemplates = specialRequirementTemplates[category].chinese;
      const englishTemplates = specialRequirementTemplates[category].english;
      
      // 检查是否匹配任何模板
      chineseTemplates.forEach((template, templateIndex) => {
        // 创建正则表达式，将{{param}}替换为任意字符匹配
        const templateRegex = template.replace(/\{\{[^}]+\}\}/g, '(.+?)');
        const regex = new RegExp(`^${templateRegex}$`);
        const match = trimmedLine.match(regex);
        
        if (match) {
          found = true;
          
          // 获取对应的英文模板
          let englishTemplate = englishTemplates[templateIndex];
          
          // 将匹配的参数值填入英文模板
          if (match.length > 1) {
            // 提取模板中的参数名
            const paramMatches = template.match(/\{\{([^}]+)\}\}/g) || [];
            const paramNames = paramMatches.map(pm => pm.replace(/\{\{|\}\}/g, ''));
            
            // 替换英文模板中的参数
            for (let i = 0; i < paramNames.length && i + 1 < match.length; i++) {
              const paramName = paramNames[i];
              const paramValue = match[i + 1];
              englishTemplate = englishTemplate.replace(`{{${paramName}}}`, paramValue);
            }
          }
          
          translatedLine = englishTemplate;
        }
      });
    });
    
    // 如果没有找到匹配的模板，使用通用翻译
    if (!found) {
      // 翻译技术术语
      translatedLine = translateTechnicalTerm(trimmedLine);
      
      // 处理常见单位
      translatedLine = translateUnits(translatedLine);
      
      // 处理数字表示法
      translatedLine = formatNumbers(translatedLine);
    }
    
    // 添加序号格式（如果原文有序号格式）
    if (/^\d+[\.\、\:]/.test(trimmedLine)) {
      // 保持原有序号格式
      const numberMatch = trimmedLine.match(/^(\d+)[\.\、\:]/);
      if (numberMatch) {
        const number = numberMatch[1];
        translatedLine = `${number}. ${translatedLine.replace(/^\d+[\.\、\:]\s*/, '')}`;
      }
    }
    
    return translatedLine;
  });
  
  // 重新组合为多行文本
  return translatedLines.filter(line => line).join('\n');
};

/**
 * 翻译文本中的单位
 * 将中文单位替换为英文单位
 * @param {string} text - 包含单位的文本
 * @returns {string} 替换单位后的文本
 */
export const translateUnits = (text) => {
  // 单位映射表
  const unitMap = {
    '千瓦': 'kW',
    '转/分': 'r/min',
    '转每分钟': 'r/min',
    '牛米': 'Nm',
    '牛·米': 'Nm',
    '千牛': 'kN',
    '兆帕': 'MPa',
    '千帕': 'kPa',
    '帕': 'Pa',
    '摄氏度': '°C',
    '度': '°',
    '毫米': 'mm',
    '厘米': 'cm',
    '米': 'm',
    '公斤': 'kg',
    '千克': 'kg',
    '克': 'g',
    '升': 'L',
    '毫升': 'mL',
    '安培': 'A',
    '伏': 'V',
    '赫兹': 'Hz',
    '百分比': '%',
    '公钟': 'h',
    '小时': 'h'
  };
  
  let result = text;
  
  Object.keys(unitMap).forEach(chineseUnit => {
    const englishUnit = unitMap[chineseUnit];
    const regex = new RegExp(chineseUnit, 'g');
    result = result.replace(regex, englishUnit);
  });
  
  return result;
};

/**
 * 格式化数字表示法
 * 处理中文特殊数字表示法
 * @param {string} text - 包含数字的文本
 * @returns {string} 格式化数字后的文本
 */
export const formatNumbers = (text) => {
  // 替换中文数字
  const chineseNums = {
    '零': '0', '一': '1', '二': '2', '三': '3', '四': '4',
    '五': '5', '六': '6', '七': '7', '八': '8', '九': '9',
    '十': '10'
  };
  
  let result = text;
  
  // 替换简单的中文数字
  Object.keys(chineseNums).forEach(chineseNum => {
    const arabicNum = chineseNums[chineseNum];
    const regex = new RegExp(chineseNum, 'g');
    result = result.replace(regex, arabicNum);
  });
  
  // 处理中文常见的数字表达式
  result = result
    // 处理"xx个月"格式
    .replace(/(\d+)个月/g, '$1 months')
    // 处理"xx年"格式
    .replace(/(\d+)年/g, '$1 years')
    // 处理"xx天"格式
    .replace(/(\d+)天/g, '$1 days')
    // 处理"xx小时"格式（可能已被替换为h）
    .replace(/(\d+)小时/g, '$1 hours')
    // 处理"xx分钟"格式
    .replace(/(\d+)分钟/g, '$1 minutes')
    // 处理"xx秒"格式
    .replace(/(\d+)秒/g, '$1 seconds')
    // 处理"百分之xx"格式
    .replace(/百分之(\d+)/g, '$1%')
    // 处理常见标点符号
    .replace(/，/g, ',')
    .replace(/。/g, '.')
    .replace(/；/g, ';')
    .replace(/：/g, ':')
    .replace(/（/g, '(')
    .replace(/）/g, ')')
    .replace(/？/g, '?')
    .replace(/！/g, '!');
  
  return result;
};

/**
 * 自动检测语言并翻译
 * 根据文本中的特定标记自动判断是中文还是英文
 * @param {string} text - 输入文本
 * @returns {Object} 包含检测结果和翻译的对象
 */
export const autoDetectAndTranslate = (text) => {
  if (!text || typeof text !== 'string') {
    return { 
      language: 'unknown', 
      isChineseDominant: false,
      translation: ''
    };
  }
  
  // 中文特征正则（中文字符、中文标点）
  const chinesePattern = /[\u4e00-\u9fa5，。；：""''【】（）？！]/;
  
  // 英文特征正则（英文单词、英文标点等）
  const englishPattern = /[a-zA-Z.,;:"'?!]/;
  
  // 计算中英文特征出现次数
  const chineseCount = (text.match(new RegExp(chinesePattern, 'g')) || []).length;
  const englishCount = (text.match(new RegExp(englishPattern, 'g')) || []).length;
  
  // 判断主导语言
  const isChineseDominant = chineseCount > englishCount;
  
  // 根据主导语言决定翻译方向
  let translation = '';
  let language = 'unknown';
  
  if (isChineseDominant) {
    // 中文为主，翻译为英文
    translation = translateTechnicalTerm(text);
    language = 'zh';
  } else if (englishCount > 0) {
    // 英文为主，暂不实现翻译为中文的功能
    translation = text;
    language = 'en';
  } else {
    // 无法确定语言
    translation = text;
  }
  
  return {
    language,
    isChineseDominant,
    translation
  };
};

// 扩展术语库，添加特殊订货要求相关词汇
export const extendedTechnicalTerminology = {
  ...technicalTerminology,
  
  // 特殊订货要求补充词汇
  '电控系统': 'Electric Control System',
  '电控操纵系统': 'Electric Control System',
  '机旁应急操纵': 'Local Emergency Control',
  '应急操纵装置': 'Emergency Control Device',
  '远程控制系统': 'Remote Control System',
  '机械式': 'Mechanical',
  '电子式': 'Electronic',
  '液位指示器': 'Level Indicator',
  '低压报警装置': 'Low Pressure Alarm Device',
  '高温报警装置': 'High Temperature Alarm Device',
  '报警值': 'Alarm Value',
  '监测系统': 'Monitoring System',
  '刚性安装': 'Rigid Installation',
  '动力输出': 'Power Take-Off',
  'PTO': 'Power Take-Off',
  '动力输入': 'Power Take-In',
  'PTI': 'Power Take-In',
  '液压离合器': 'Hydraulic Clutch',
  '电动泵系统': 'Electric Pump System',
  '高海况': 'High Sea State',
  '冷却系统': 'Cooling System',
  '冷却水耗量': 'Cooling Water Consumption',
  '入口温度': 'Inlet Temperature',
  '入口压力': 'Inlet Pressure',
  '适用海水': 'Suitable for Seawater',
  '适用淡水': 'Suitable for Freshwater',
  '倒车指示': 'Reverse Indication',
  '顺车指示': 'Forward Indication',
  '工作指示': 'Operation Indication',
};