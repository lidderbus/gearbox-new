// src/utils/bilingualTemplates.js

import { specialRequirementTemplates } from './specialRequirementTemplates';

/**
 * 双语模板库 - 基本结构
 */
export const bilingualTemplates = {
  // 通用模板头部
  header: {
    chinese: `
      <h1>船用齿轮箱技术协议</h1>
      <h2>1. 一般说明</h2>
    `,
    english: `
      <h1>Marine Gearbox Technical Agreement</h1>
      <h2>1. General Description</h2>
    `
  },
  
  // 项目信息部分
  projectInfo: {
    chinese: `
      <h3>1.1 项目信息</h3>
      <table>
        <tr>
          <td>项目名称</td>
          <td>{{projectName}}</td>
        </tr>
        <tr>
          <td>船东</td>
          <td>{{shipOwner}}</td>
        </tr>
        <tr>
          <td>船厂</td>
          <td>{{shipyard}}</td>
        </tr>
        <tr>
          <td>船舶类型</td>
          <td>{{shipType}}</td>
        </tr>
      </table>
    `,
    english: `
      <h3>1.1 Project Information</h3>
      <table>
        <tr>
          <td>Project Name</td>
          <td>{{projectName}}</td>
        </tr>
        <tr>
          <td>Ship Owner</td>
          <td>{{shipOwner}}</td>
        </tr>
        <tr>
          <td>Shipyard</td>
          <td>{{shipyard}}</td>
        </tr>
        <tr>
          <td>Vessel Type</td>
          <td>{{shipType}}</td>
        </tr>
      </table>
    `
  },
  
  // 技术参数部分
  technicalParams: {
    chinese: `
      <h2>2. 技术参数</h2>
      <table>
        <tr>
          <th>参数</th>
          <th>数值</th>
        </tr>
        <tr>
          <td>型号</td>
          <td>{{model}}</td>
        </tr>
        <tr>
          <td>减速比</td>
          <td>{{reductionRatio}}</td>
        </tr>
        <tr>
          <td>传递功率</td>
          <td>{{transmissionCapacity}}kW</td>
        </tr>
        <tr>
          <td>最大输入转速</td>
          <td>{{maxInputSpeed}}r/min</td>
        </tr>
        <tr>
          <td>最大螺旋桨推力</td>
          <td>{{maxPropellerThrust}}kN</td>
        </tr>
        <tr>
          <td>机械效率</td>
          <td>{{mechanicalEfficiency}}%</td>
        </tr>
        <tr>
          <td>重量</td>
          <td>{{weight}}kg</td>
        </tr>
      </table>
    `,
    english: `
      <h2>2. Technical Parameters</h2>
      <table>
        <tr>
          <th>Parameter</th>
          <th>Value</th>
        </tr>
        <tr>
          <td>Model</td>
          <td>{{model}}</td>
        </tr>
        <tr>
          <td>Reduction Ratio</td>
          <td>{{reductionRatio}}</td>
        </tr>
        <tr>
          <td>Transmission Capacity</td>
          <td>{{transmissionCapacity}}kW</td>
        </tr>
        <tr>
          <td>Maximum Input Speed</td>
          <td>{{maxInputSpeed}}r/min</td>
        </tr>
        <tr>
          <td>Maximum Propeller Thrust</td>
          <td>{{maxPropellerThrust}}kN</td>
        </tr>
        <tr>
          <td>Mechanical Efficiency</td>
          <td>{{mechanicalEfficiency}}%</td>
        </tr>
        <tr>
          <td>Weight</td>
          <td>{{weight}}kg</td>
        </tr>
      </table>
    `
  },
  
  // 特殊订货要求部分
  specialRequirements: {
    chinese: `
      <h2>3. 特殊订货要求</h2>
      <div>
        {{specialRequirements}}
      </div>
    `,
    english: `
      <h2>3. Special Order Requirements</h2>
      <div>
        {{specialRequirements}}
      </div>
    `
  },
  
  // 质保和技术服务部分
  warrantyService: {
    chinese: `
      <h2>4. 质量保证</h2>
      <p>供方保证所供产品符合本协议规定的技术条件，并承担产品质量责任。产品执行中华人民共和国国家相关标准。</p>
      <p>质保期为从设备到货之日起{{warrantyPeriod}}或首航结束后12个月（以先到为准）。</p>
      
      <h2>5. 技术服务</h2>
      <p>供方向需方提供必要的技术服务，包括但不限于：</p>
      <ul>
        <li>设备安装、调试指导</li>
        <li>使用和维护培训</li>
        <li>质保期内故障诊断和维修</li>
      </ul>
    `,
    english: `
      <h2>4. Quality Assurance</h2>
      <p>The supplier guarantees that the supplied products conform to the technical conditions specified in this agreement and assumes product quality responsibility. The product complies with the relevant national standards of the People's Republic of China.</p>
      <p>The warranty period is {{warrantyPeriod}} from the date of equipment arrival or 12 months after the first voyage (whichever comes first).</p>
      
      <h2>5. Technical Service</h2>
      <p>The supplier provides necessary technical services to the buyer, including but not limited to:</p>
      <ul>
        <li>Equipment installation and commissioning guidance</li>
        <li>Use and maintenance training</li>
        <li>Fault diagnosis and repair during the warranty period</li>
      </ul>
    `
  },
  
  // 随机文件
  attachments: {
    chinese: `
      <h2>6. 随机文件</h2>
      <p>供方应随产品提供以下文件：</p>
      <ol>
        <li>产品合格证</li>
        <li>装箱单</li>
        <li>使用说明书</li>
        <li>维修手册</li>
        <li>备件目录</li>
      </ol>
    `,
    english: `
      <h2>6. Accompanying Documents</h2>
      <p>The supplier shall provide the following documents with the product:</p>
      <ol>
        <li>Product Certificate</li>
        <li>Packing List</li>
        <li>Operation Manual</li>
        <li>Maintenance Manual</li>
        <li>Spare Parts Catalogue</li>
      </ol>
    `
  },
  
  // 签名栏
  signature: {
    chinese: `
      <div class="signature-area">
        <table>
          <tr>
            <td width="50%">供方：</td>
            <td width="50%">需方：</td>
          </tr>
          <tr>
            <td>代表：</td>
            <td>代表：</td>
          </tr>
          <tr>
            <td>日期：${getCurrentDate()}</td>
            <td>日期：</td>
          </tr>
        </table>
      </div>
    `,
    english: `
      <div class="signature-area">
        <table>
          <tr>
            <td width="50%">Supplier:</td>
            <td width="50%">Buyer:</td>
          </tr>
          <tr>
            <td>Representative:</td>
            <td>Representative:</td>
          </tr>
          <tr>
            <td>Date: ${getCurrentDate()}</td>
            <td>Date:</td>
          </tr>
        </table>
      </div>
    `
  }
};

/**
 * 获取当前日期（YYYY-MM-DD格式）
 * @returns {string} 当前日期
 */
export function getCurrentDate() {
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('获取当前日期出错:', error);
    return new Date().toISOString().split('T')[0]; // 备用方案
  }
}

/**
 * 翻译特殊订货要求 - 逐行处理
 * @param {string} requirements - 特殊订货要求文本（多行）
 * @returns {string} 翻译后的英文文本（多行）
 */
export const translateSpecialRequirements = (requirements) => {
  try {
    if (!requirements || requirements === '无') {
      return 'None';
    }
    
    // 按行分割
    const lines = requirements.split('\n');
    
    // 逐行翻译
    const translatedLines = lines.map((line, index) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return '';
      
      // 检查是否为模板库中的内容，直接使用英文模板
      let found = false;
      let translatedLine = '';
      
      // 遍历模板库
      if (specialRequirementTemplates) {
        Object.keys(specialRequirementTemplates).forEach(category => {
          if (!specialRequirementTemplates[category]) return;
          
          const chineseTemplates = specialRequirementTemplates[category].chinese || [];
          const englishTemplates = specialRequirementTemplates[category].english || [];
          
          // 检查是否匹配任何模板
          chineseTemplates.forEach((template, templateIndex) => {
            if (!template) return;
            
            try {
              // 创建正则表达式，将{{param}}替换为任意字符匹配
              const templatePattern = template
                .replace(/\{\{[^}]+\}\}/g, '(.+?)')
                .replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'); // 转义正则特殊字符
              
              const regex = new RegExp(`^${templatePattern}$`);
              const match = trimmedLine.match(regex);
              
              if (match && englishTemplates[templateIndex]) {
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
                
                // 替换所有未匹配的变量为空字符串
                translatedLine = translatedLine.replace(/{{[^}]+}}/g, '');
              }
            } catch (e) {
              console.error("模板匹配错误:", e);
            }
          });
        });
      }
      
      // 如果没有找到匹配的模板，使用基本翻译
      if (!found) {
        // 简单翻译一些常见短语
        translatedLine = trimmedLine
          .replace(/齿轮箱/g, 'gearbox')
          .replace(/润滑油/g, 'lubricating oil')
          .replace(/冷却水/g, 'cooling water')
          .replace(/温度/g, 'temperature')
          .replace(/压力/g, 'pressure')
          .replace(/转速/g, 'speed')
          .replace(/推力/g, 'thrust')
          .replace(/电控/g, 'electric control')
          .replace(/监测/g, 'monitoring')
          .replace(/报警/g, 'alarm')
          .replace(/效率/g, 'efficiency')
          .replace(/装置/g, 'device')
          .replace(/系统/g, 'system');
      }
      
      return translatedLine;
    });
    
    // 重新组合为多行文本
    return translatedLines.filter(line => line).join('\n');
  } catch (error) {
    console.error("翻译特殊订货要求出错:", error);
    return requirements || 'None'; // 出错时返回原始文本
  }
};

/**
 * 格式化特殊订货要求
 * @param {string} requirements - 特殊订货要求文本
 * @param {string} format - 格式类型: 'numbered', 'bullet', 'plain'
 * @returns {Object} 包含中英文格式化后的HTML对象
 */
export const formatSpecialRequirements = (requirements, format = 'numbered') => {
  try {
    if (!requirements || requirements === '无') {
      return {
        chinese: '<p>无</p>',
        english: '<p>None</p>'
      };
    }
    
    // 翻译特殊订货要求
    const translatedRequirements = translateSpecialRequirements(requirements);
    
    // 分割中英文要求
    const chineseLines = requirements.split('\n').filter(line => line.trim());
    const englishLines = translatedRequirements.split('\n').filter(line => line.trim());
    
    // 格式化中文要求
    let chineseHtml = '';
    if (format === 'numbered') {
      chineseHtml = '<ol class="special-requirements-list">\n';
      chineseLines.forEach(line => {
        chineseHtml += `  <li>${line.trim()}</li>\n`;
      });
      chineseHtml += '</ol>';
    } else if (format === 'bullet') {
      chineseHtml = '<ul class="special-requirements-list">\n';
      chineseLines.forEach(line => {
        chineseHtml += `  <li>${line.trim()}</li>\n`;
      });
      chineseHtml += '</ul>';
    } else {
      chineseHtml = '<div class="special-requirements-list">\n';
      chineseLines.forEach(line => {
        chineseHtml += `  <p>${line.trim()}</p>\n`;
      });
      chineseHtml += '</div>';
    }
    
    // 格式化英文要求
    let englishHtml = '';
    if (format === 'numbered') {
      englishHtml = '<ol class="special-requirements-list">\n';
      englishLines.forEach(line => {
        englishHtml += `  <li>${line.trim()}</li>\n`;
      });
      englishHtml += '</ol>';
    } else if (format === 'bullet') {
      englishHtml = '<ul class="special-requirements-list">\n';
      englishLines.forEach(line => {
        englishHtml += `  <li>${line.trim()}</li>\n`;
      });
      englishHtml += '</ul>';
    } else {
      englishHtml = '<div class="special-requirements-list">\n';
      englishLines.forEach(line => {
        englishHtml += `  <p>${line.trim()}</p>\n`;
      });
      englishHtml += '</div>';
    }
    
    return {
      chinese: chineseHtml,
      english: englishHtml
    };
  } catch (error) {
    console.error("格式化特殊订货要求出错:", error);
    // 出错时保持默认返回值格式
    return {
      chinese: '<p>无法格式化特殊订货要求</p>',
      english: '<p>Unable to format special requirements</p>'
    };
  }
};

/**
 * 生成双语技术协议
 * @param {Object} data - 模板数据
 * @param {string} layout - 布局方式: 'side-by-side', 'sequential', 'complete'
 * @returns {string} 生成的HTML内容
 */
export function generateBilingualAgreement(data, layout = 'side-by-side') {
  try {
    // 处理特殊订货要求 - 翻译和格式化
    let chineseRequirements = data.specialRequirements || '无';
    
    // 格式化特殊订货要求
    const format = data.specialRequirementsFormat || 'numbered';
    const formattedReqs = formatSpecialRequirements(chineseRequirements, format);
    
    // 更新模板数据
    const templateData = {
      ...data,
      specialRequirements: formattedReqs.chinese,
      specialRequirementsEnglish: formattedReqs.english
    };
    
    // 根据布局方式生成不同的HTML
    let htmlContent = '';
    switch (layout) {
      case 'side-by-side':
        htmlContent = generateSideBySideLayout(templateData);
        break;
      case 'sequential':
        htmlContent = generateSequentialLayout(templateData);
        break;
      case 'complete':
        htmlContent = generateCompleteLayout(templateData);
        break;
      default:
        htmlContent = generateSideBySideLayout(templateData);
    }
    
    // 确保添加CSS引用
    if (!htmlContent.includes('<link rel="stylesheet" href="../styles/bilingualStyles.css">')) {
      htmlContent = htmlContent.replace('</head>', 
        '<link rel="stylesheet" href="../styles/bilingualStyles.css">\n</head>');
    }
    
    return htmlContent;
  } catch (error) {
    console.error('生成双语技术协议出错:', error);
    // 出错时返回错误信息
    return `<div class="error-message">
      <h1>生成协议时出错</h1>
      <p>错误信息: ${error.message}</p>
      <p>请检查模板和数据，然后重试。</p>
    </div>`;
  }
};

/**
 * 生成并排布局的双语技术协议
 * @param {Object} data - 技术协议数据
 * @returns {string} HTML文档字符串
 */
export const generateSideBySideLayout = (templateData) => {
  // 添加双语协议样式
  const styles = `
    <style>
      .bilingual-document {
        font-family: Arial, SimSun, sans-serif;
      }
      .chinese-content {
        font-family: SimSun, "宋体", sans-serif;
      }
      .english-content {
        font-family: Arial, sans-serif;
      }
      .bilingual-section {
        margin-bottom: 2rem;
      }
      h1, h2, h3 {
        margin-bottom: 1rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      table, th, td {
        border: 1px solid #ddd;
      }
      th, td {
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
  `;
  
  // 拼接双语表头
  const header = `
    <div class="bilingual-section">
      <div class="row">
        <div class="col-6 chinese-content">
          ${fillTemplate(bilingualTemplates.header.chinese, templateData)}
        </div>
        <div class="col-6 english-content">
          ${fillTemplate(bilingualTemplates.header.english, templateData)}
        </div>
      </div>
    </div>
  `;
  
  // 拼接双语内容各部分
  const sections = [];
  
  // 概述部分
  sections.push(`
    <div class="bilingual-section">
      <div class="row">
        <div class="col-6 chinese-content">
          ${fillTemplate(bilingualTemplates.projectInfo.chinese, templateData)}
        </div>
        <div class="col-6 english-content">
          ${fillTemplate(bilingualTemplates.projectInfo.english, templateData)}
        </div>
      </div>
    </div>
  `);
  
  // 技术参数部分 - 使用优化的双语表格
  sections.push(`
    <div class="bilingual-section">
      <div class="row">
        <div class="col-6 chinese-content">
          ${fillTemplate(bilingualTemplates.technicalParams.chinese, templateData)}
        </div>
        <div class="col-6 english-content">
          ${fillTemplate(bilingualTemplates.technicalParams.english, templateData)}
        </div>
      </div>
    </div>
  `);
  
  // 特殊订货要求部分
  sections.push(`
    <div class="bilingual-section">
      <div class="row">
        <div class="col-6 chinese-content">
          ${fillTemplate(bilingualTemplates.specialRequirements.chinese, templateData)}
        </div>
        <div class="col-6 english-content">
          ${fillTemplate(bilingualTemplates.specialRequirements.english, { ...templateData, specialRequirements: templateData.specialRequirementsEnglish })}
        </div>
      </div>
    </div>
  `);
  
  // 质保服务部分（可选）
  if (templateData.includeQualitySection && templateData.includeMaintenanceSection) {
    sections.push(`
      <div class="bilingual-section">
        <div class="row">
          <div class="col-6 chinese-content">
            ${fillTemplate(bilingualTemplates.warrantyService.chinese, templateData)}
          </div>
          <div class="col-6 english-content">
            ${fillTemplate(bilingualTemplates.warrantyService.english, templateData)}
          </div>
        </div>
      </div>
    `);
  }
  
  // 随机文件部分（可选）
  if (templateData.includeAttachmentSection) {
    sections.push(`
      <div class="bilingual-section">
        <div class="row">
          <div class="col-6 chinese-content">
            ${fillTemplate(bilingualTemplates.attachments.chinese, templateData)}
          </div>
          <div class="col-6 english-content">
            ${fillTemplate(bilingualTemplates.attachments.english, templateData)}
          </div>
        </div>
      </div>
    `);
  }
  
  // 签名栏
  const signature = `
    <div class="bilingual-section">
      <div class="row">
        <div class="col-6 chinese-content">
          ${fillTemplate(bilingualTemplates.signature.chinese, templateData)}
        </div>
        <div class="col-6 english-content">
          ${fillTemplate(bilingualTemplates.signature.english, templateData)}
        </div>
      </div>
    </div>
  `;
  
  // 组装完整文档
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>船用齿轮箱技术协议 / Marine Gearbox Technical Agreement</title>
      ${styles}
      <link rel="stylesheet" href="../styles/bilingualStyles.css">
    </head>
    <body>
      <div class="container bilingual-document side-by-side">
        ${header}
        ${sections.join('\n')}
        ${signature}
      </div>
    </body>
    </html>
  `;
};

/**
 * 生成分段对照的双语技术协议
 * @param {Object} templateData - 技术协议数据
 * @returns {string} HTML文档字符串
 */
export const generateSequentialLayout = (templateData) => {
  // 添加双语协议样式
  const styles = `
    <style>
      .bilingual-document {
        font-family: Arial, SimSun, sans-serif;
      }
      .chinese-content {
        font-family: SimSun, "宋体", sans-serif;
        margin-bottom: 1rem;
      }
      .english-content {
        font-family: Arial, "Helvetica Neue", sans-serif;
        margin-bottom: 2rem;
        color: #444;
      }
      .bilingual-section {
        margin-bottom: 2rem;
      }
      h1, h2, h3 {
        margin-bottom: 1rem;
      }
      .section-title {
        border-bottom: 1px solid #ddd;
        padding-bottom: 0.5rem;
        margin-bottom: 1rem;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      table, th, td {
        border: 1px solid #ddd;
      }
      th, td {
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
  `;
  
  // 头部
  const header = `
    <div class="text-center mb-5">
      <h1 class="mb-4">船用齿轮箱技术协议 / Marine Gearbox Technical Agreement</h1>
      <p class="mb-1">项目名称 / Project Name: ${templateData.projectName || ''}</p>
      <p class="mb-1">客户名称 / Customer: ${templateData.shipOwner || ''}</p>
      <p>日期 / Date: ${templateData.date || getCurrentDate()}</p>
    </div>
  `;
  
  // 构建各个部分
  const sections = [];
  
  // 概述部分
  sections.push(`
    <div class="bilingual-section">
      <h2 class="section-title">1. 概述 / Overview</h2>
      <div class="chinese-content">
        ${fillTemplate(bilingualTemplates.projectInfo.chinese, templateData).replace('<h3>1.1 项目信息</h3>', '')}
      </div>
      <div class="english-content">
        ${fillTemplate(bilingualTemplates.projectInfo.english, templateData).replace('<h3>1.1 Project Information</h3>', '')}
      </div>
    </div>
  `);
  
  // 技术参数部分 - 使用分段对照表格
  sections.push(`
    <div class="bilingual-section">
      <h2 class="section-title">2. 技术参数 / Technical Parameters</h2>
      <div class="chinese-content">
        ${fillTemplate(bilingualTemplates.technicalParams.chinese, templateData).replace('<h2>2. 技术参数</h2>', '')}
      </div>
      <div class="english-content">
        ${fillTemplate(bilingualTemplates.technicalParams.english, templateData).replace('<h2>2. Technical Parameters</h2>', '')}
      </div>
    </div>
  `);
  
  // 特殊订货要求部分
  sections.push(`
    <div class="bilingual-section">
      <h2 class="section-title">3. 特殊订货要求 / Special Order Requirements</h2>
      <div class="chinese-content">
        ${templateData.specialRequirements}
      </div>
      <div class="english-content">
        ${templateData.specialRequirementsEnglish}
      </div>
    </div>
  `);
  
  // 质保服务部分
  if (templateData.includeQualitySection && templateData.includeMaintenanceSection) {
    sections.push(`
      <div class="bilingual-section">
        <h2 class="section-title">4. 质量保证 / Quality Assurance</h2>
        <div class="chinese-content">
          ${fillTemplate(bilingualTemplates.warrantyService.chinese, templateData).replace('<h2>4. 质量保证</h2>', '').replace('<h2>5. 技术服务</h2>', '<h3>技术服务</h3>')}
        </div>
        <div class="english-content">
          ${fillTemplate(bilingualTemplates.warrantyService.english, templateData).replace('<h2>4. Quality Assurance</h2>', '').replace('<h2>5. Technical Service</h2>', '<h3>Technical Service</h3>')}
        </div>
      </div>
    `);
  }
  
  // 随机文件部分
  if (templateData.includeAttachmentSection) {
    sections.push(`
      <div class="bilingual-section">
        <h2 class="section-title">5. 随机文件 / Accompanying Documents</h2>
        <div class="chinese-content">
          ${fillTemplate(bilingualTemplates.attachments.chinese, templateData).replace('<h2>6. 随机文件</h2>', '')}
        </div>
        <div class="english-content">
          ${fillTemplate(bilingualTemplates.attachments.english, templateData).replace('<h2>6. Accompanying Documents</h2>', '')}
        </div>
      </div>
    `);
  }
  
  // 签字栏
  const signature = `
    <div class="bilingual-section mt-5">
      <div class="row">
        <div class="col-6">
          <p>供方代表 / Supplier Representative: ________________</p>
          <p>日期 / Date: _________________</p>
        </div>
        <div class="col-6">
          <p>需方代表 / Buyer Representative: ________________</p>
          <p>日期 / Date: _________________</p>
        </div>
      </div>
    </div>
  `;
  
  // 组装完整文档
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>船用齿轮箱技术协议 / Marine Gearbox Technical Agreement</title>
      ${styles}
      <link rel="stylesheet" href="../styles/bilingualStyles.css">
    </head>
    <body>
      <div class="container bilingual-document sequential-layout">
        ${header}
        ${sections.join('\n')}
        ${signature}
      </div>
    </body>
    </html>
  `;
};

/**
 * 生成全文对照的双语技术协议
 * @param {Object} templateData - 技术协议数据
 * @returns {string} HTML文档字符串
 */
export const generateCompleteLayout = (templateData) => {
  // 添加双语协议样式
  const styles = `
    <style>
      .bilingual-document {
        font-family: Arial, SimSun, sans-serif;
      }
      .chinese-content {
        font-family: SimSun, "宋体", sans-serif;
      }
      .english-content {
        font-family: Arial, sans-serif;
        margin-top: 4rem;
      }
      .section {
        margin-bottom: 2rem;
      }
      h1, h2, h3 {
        margin-bottom: 1rem;
      }
      hr.language-divider {
        margin: 3rem 0;
        border-top: 1px solid #999;
      }
      .language-title {
        text-align: center;
        margin: 2rem 0;
        font-size: 1.5rem;
        font-weight: bold;
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-bottom: 1rem;
      }
      table, th, td {
        border: 1px solid #ddd;
      }
      th, td {
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
      }
    </style>
  `;
  
  // 生成中文版本
  const chineseContent = generateChineseAgreement(templateData);
  
  // 生成英文版本
  const englishContent = generateEnglishAgreement(templateData);
  
  // 组装完整文档
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>船用齿轮箱技术协议 / Marine Gearbox Technical Agreement</title>
      ${styles}
      <link rel="stylesheet" href="../styles/bilingualStyles.css">
    </head>
    <body>
      <div class="container bilingual-document complete-layout">
        <div class="text-center mb-5">
          <h1>船用齿轮箱技术协议 / Marine Gearbox Technical Agreement</h1>
          <p>项目名称 / Project Name: ${templateData.projectName || ''}</p>
          <p>客户名称 / Customer: ${templateData.shipOwner || ''}</p>
          <p>日期 / Date: ${templateData.date || getCurrentDate()}</p>
        </div>
        
        <div class="language-title">中文版 / Chinese Version</div>
        <div class="chinese-content">
          ${chineseContent}
        </div>
        
        <hr class="language-divider" />
        
        <div class="language-title">英文版 / English Version</div>
        <div class="english-content">
          ${englishContent}
        </div>
      </div>
    </body>
    </html>
  `;
};

/**
 * 生成中文版技术协议
 * @param {Object} templateData - 技术协议数据
 * @returns {string} HTML内容
 */
export const generateChineseAgreement = (templateData) => {
  const sections = [];
  
  // 概述部分
  sections.push(fillTemplate(bilingualTemplates.projectInfo.chinese, templateData));
  
  // 技术参数部分
  sections.push(fillTemplate(bilingualTemplates.technicalParams.chinese, templateData));
  
  // 特殊订货要求部分
  sections.push(fillTemplate(bilingualTemplates.specialRequirements.chinese, templateData));
  
  // 质量保证部分
  if (templateData.includeQualitySection) {
    sections.push(fillTemplate(bilingualTemplates.warrantyService.chinese, templateData));
  }
  
  // 随机文件部分
  if (templateData.includeAttachmentSection) {
    sections.push(fillTemplate(bilingualTemplates.attachments.chinese, templateData));
  }
  
  // 签字栏
  const signature = fillTemplate(bilingualTemplates.signature.chinese, templateData);
  
  return sections.join('\n') + signature;
};

/**
 * 生成英文版技术协议
 * @param {Object} templateData - 技术协议数据
 * @returns {string} HTML内容
 */
export const generateEnglishAgreement = (templateData) => {
  const sections = [];
  
  // 概述部分
  sections.push(fillTemplate(bilingualTemplates.projectInfo.english, templateData));
  
  // 技术参数部分
  sections.push(fillTemplate(bilingualTemplates.technicalParams.english, templateData));
  
  // 特殊订货要求部分
  sections.push(fillTemplate(bilingualTemplates.specialRequirements.english, { 
    ...templateData, 
    specialRequirements: templateData.specialRequirementsEnglish 
  }));
  
  // 质量保证部分
  if (templateData.includeQualitySection) {
    sections.push(fillTemplate(bilingualTemplates.warrantyService.english, templateData));
  }
  
  // 随机文件部分
  if (templateData.includeAttachmentSection) {
    sections.push(fillTemplate(bilingualTemplates.attachments.english, templateData));
  }
  
  // 签字栏
  const signature = fillTemplate(bilingualTemplates.signature.english, templateData);
  
  return sections.join('\n') + signature;
};

/**
 * 填充模板中的变量
 * @param {string} template - 包含{{变量}}的模板字符串
 * @param {Object} data - 包含变量值的对象
 * @returns {string} 填充变量后的字符串
 */
export const fillTemplate = (template, data) => {
  try {
    if (!template) return '';
    if (!data) return template;
    
    let result = template;
    
    // 替换所有变量
    Object.entries(data).forEach(([name, value]) => {
      // 安全处理值
      const safeValue = value !== undefined && value !== null ? String(value) : '';
      const regex = new RegExp(`{{${name}}}`, 'g');
      result = result.replace(regex, safeValue);
    });
    
    // 替换所有未匹配的变量为空字符串
    result = result.replace(/{{[^}]+}}/g, '');
    
    return result;
  } catch (error) {
    console.error('填充模板变量出错:', error);
    // 出错时返回原始模板
    return template || '';
  }
};