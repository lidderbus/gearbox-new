// src/components/AgreementGenerator.js
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { Form, Row, Col, Card, Button, Tabs, Tab, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { getAgreementTemplate, fillTemplate, TemplateType, LanguageType } from '../utils/agreementTemplateManager';
import { exportHtmlContentToPDF } from '../utils/pdfExportUtils';
import ErrorBoundary from './ErrorBoundary';
import '../styles/agreementTemplates.css';
// 导入双语模板工具
import {
  bilingualTemplates,
  generateBilingualAgreement,
  getCurrentDate,
  translateSpecialRequirements,
  formatSpecialRequirements,
  fillTemplate as bilingualFillTemplate
} from '../utils/bilingualTemplates';
// 导入特殊要求模板
import { specialRequirementTemplates, processTemplate } from '../utils/specialRequirementTemplates';
// 导入双语样式
import '../styles/bilingualStyles.css';

/**
 * 特殊订货要求模板选择组件
 * 用于选择、定制和管理特殊订货要求模板
 */
const SpecialRequirementsTemplateSelector = memo(({ 
  currentRequirements, 
  templateData, 
  onRequirementsChange,
  colors
}) => {
  // 状态定义 - 添加初始化标志
  const [selectedCategory, setSelectedCategory] = useState('performance');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [customRequirement, setCustomRequirement] = useState('');
  const [localError, setLocalError] = useState(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  // 调试日志和初始化检查
  useEffect(() => {
    console.log("SpecialRequirementsTemplateSelector组件挂载");
    console.log("初始templateData:", templateData);
    console.log("初始currentRequirements:", currentRequirements);

    // 验证 specialRequirementTemplates 是否已正确导入
    if (!specialRequirementTemplates) {
      console.error("specialRequirementTemplates 未正确导入！");
      setLocalError("模板数据加载失败，请刷新页面重试");
    } else {
      console.log("specialRequirementTemplates 已加载，包含类别:", Object.keys(specialRequirementTemplates));
      setIsInitialized(true);
    }

    return () => {
      console.log("SpecialRequirementsTemplateSelector组件卸载");
    };
  }, []);
  
  // 安全地初始化模板列表
  useEffect(() => {
    try {
      console.log("处理currentRequirements变更:", currentRequirements);

      // 清除任何错误
      setLocalError(null);

      // 更严格的类型检查
      if (currentRequirements === null || currentRequirements === undefined) {
        console.log("currentRequirements 为 null 或 undefined，设置空数组");
        setSelectedTemplates([]);
        return;
      }

      if (typeof currentRequirements !== 'string') {
        console.warn("currentRequirements 不是字符串类型，实际类型:", typeof currentRequirements);
        setSelectedTemplates([]);
        return;
      }

      // 处理空字符串
      if (currentRequirements.trim() === '') {
        console.log("currentRequirements 为空字符串，设置空数组");
        setSelectedTemplates([]);
        return;
      }

      // 安全解析当前需求，增加更多的边界检查
      const requirements = currentRequirements
        .split('\n')
        .filter(line => {
          // 确保 line 是字符串且有 trim 方法
          if (typeof line !== 'string') {
            console.warn("遇到非字符串行，跳过");
            return false;
          }
          // 过滤空行
          return line.trim() !== '';
        })
        .map(line => line.trim());

      console.log(`成功解析出 ${requirements.length} 个模板项`);
      setSelectedTemplates(requirements);
    } catch (error) {
      console.error("初始化模板列表出错:", error);
      setLocalError(`无法加载当前要求列表: ${error.message}`);
      setSelectedTemplates([]);
    }
  }, [currentRequirements]);
  
  // 带有缓存的类别变更处理函数
  const handleCategoryChange = useCallback((category) => {
    console.log("切换类别到:", category);
    setSelectedCategory(category);
    setLocalError(null);
  }, []);
  
  // 带有缓存的模板处理函数
  const processTemplateData = useCallback((template) => {
    if (!template || typeof template !== 'string') {
      return '';
    }
    
    try {
      // 创建模板的副本以避免修改原始数据
      let processedTemplate = String(template);
      
      // 安全地替换变量
      if (templateData && typeof templateData === 'object') {
        // 遍历变量数据
        for (const key in templateData) {
          if (Object.prototype.hasOwnProperty.call(templateData, key)) {
            const value = templateData[key];
            if (value !== undefined && value !== null) {
              // 使用字符串替换而不是正则表达式，以避免特殊字符问题
              const placeholder = `{{${key}}}`;
              while (processedTemplate.includes(placeholder)) {
                processedTemplate = processedTemplate.replace(placeholder, String(value));
              }
            }
          }
        }
      }
      
      // 替换所有剩余的变量为空字符串
      // 使用简单的字符串操作而不是正则表达式
      let startIndex;
      while ((startIndex = processedTemplate.indexOf('{{')) !== -1) {
        const endIndex = processedTemplate.indexOf('}}', startIndex);
        if (endIndex !== -1) {
          processedTemplate = 
            processedTemplate.substring(0, startIndex) + 
            processedTemplate.substring(endIndex + 2);
        } else {
          // 如果没有找到结束标记，退出循环
          break;
        }
      }
      
      return processedTemplate;
    } catch (error) {
      console.error("处理模板变量出错:", error);
      return template; // 返回原始模板
    }
  }, [templateData]);
  
  // 添加模板函数
  const addTemplate = useCallback((template) => {
    console.log("尝试添加模板:", template);
    
    if (!template || typeof template !== 'string') {
      console.warn("无效的模板内容");
      return;
    }
    
    try {
      // 处理模板变量
      const processedTemplate = processTemplateData(template);
      console.log("处理后的模板:", processedTemplate);
      
      if (!processedTemplate.trim()) {
        console.warn("处理后的模板为空");
        return;
      }
      
      // 检查是否重复
      setSelectedTemplates(prevTemplates => {
        if (!Array.isArray(prevTemplates)) {
          prevTemplates = [];
        }
        
        // 检查是否重复
        const isDuplicate = prevTemplates.some(item => 
          item.trim() === processedTemplate.trim()
        );
        
        if (isDuplicate) {
          console.log("模板已存在，跳过添加");
          return prevTemplates;
        }
        
        // 创建一个新的数组，避免直接修改状态
        const newTemplates = [...prevTemplates, processedTemplate.trim()];
        
        // 通知父组件
        setTimeout(() => {
          if (onRequirementsChange && typeof onRequirementsChange === 'function') {
            onRequirementsChange(newTemplates.join('\n'));
          }
        }, 0);
        
        return newTemplates;
      });
      
      setLocalError(null);
    } catch (error) {
      console.error("添加模板出错:", error);
      setLocalError("添加模板时出错");
    }
  }, [processTemplateData, onRequirementsChange]);
  
  // 添加自定义需求
  const addCustomRequirement = useCallback(() => {
    if (!customRequirement.trim()) {
      return;
    }
    
    try {
      addTemplate(customRequirement);
      setCustomRequirement('');
    } catch (error) {
      console.error("添加自定义需求出错:", error);
      setLocalError("添加自定义需求时出错");
    }
  }, [customRequirement, addTemplate]);
  
  // 清空模板列表
  const clearTemplates = useCallback(() => {
    console.log("清空模板列表");
    
    setSelectedTemplates([]);
    
    if (onRequirementsChange && typeof onRequirementsChange === 'function') {
      onRequirementsChange('');
    }
    
    setLocalError(null);
  }, [onRequirementsChange]);
  
  // 移除模板
  const removeTemplate = useCallback((index) => {
    console.log("移除模板，索引:", index);
    
    if (index < 0) {
      return;
    }
    
    setSelectedTemplates(prevTemplates => {
      if (!Array.isArray(prevTemplates) || index >= prevTemplates.length) {
        return prevTemplates;
      }
      
      const newTemplates = prevTemplates.filter((_, i) => i !== index);
      
      setTimeout(() => {
        if (onRequirementsChange && typeof onRequirementsChange === 'function') {
          onRequirementsChange(newTemplates.join('\n'));
        }
      }, 0);
      
      return newTemplates;
    });
  }, [onRequirementsChange]);
  
  // 移动模板函数
  const moveTemplate = useCallback((fromIndex, toIndex) => {
    console.log(`移动模板从${fromIndex}到${toIndex}`);
    
    if (fromIndex < 0 || toIndex < 0) {
      return;
    }
    
    setSelectedTemplates(prevTemplates => {
      if (!Array.isArray(prevTemplates) || 
          fromIndex >= prevTemplates.length || 
          toIndex >= prevTemplates.length) {
        return prevTemplates;
      }
      
      const newTemplates = [...prevTemplates];
      const [moved] = newTemplates.splice(fromIndex, 1);
      newTemplates.splice(toIndex, 0, moved);
      
      setTimeout(() => {
        if (onRequirementsChange && typeof onRequirementsChange === 'function') {
          onRequirementsChange(newTemplates.join('\n'));
        }
      }, 0);
      
      return newTemplates;
    });
  }, [onRequirementsChange]);
  
  // 渲染模板选项
  const renderTemplateOptions = useCallback(() => {
    try {
      // 安全检查: 确保 specialRequirementTemplates 存在且有效
      if (!specialRequirementTemplates) {
        console.warn("specialRequirementTemplates 未定义");
        return (
          <ListGroup.Item
            style={{
              backgroundColor: colors?.card || '#fff',
              color: colors?.text || '#333'
            }}
          >
            模板数据未加载
          </ListGroup.Item>
        );
      }

      // 安全检查: 确保所选类别存在
      if (!specialRequirementTemplates[selectedCategory]) {
        console.warn(`类别 ${selectedCategory} 不存在于 specialRequirementTemplates 中`);
        return (
          <ListGroup.Item
            style={{
              backgroundColor: colors?.card || '#fff',
              color: colors?.text || '#333'
            }}
          >
            该类别暂无模板
          </ListGroup.Item>
        );
      }

      // 安全检查: 确保中文模板数组存在且有效
      const categoryData = specialRequirementTemplates[selectedCategory];
      if (!categoryData || !categoryData.chinese || !Array.isArray(categoryData.chinese)) {
        console.warn(`类别 ${selectedCategory} 的中文模板数据无效`);
        return (
          <ListGroup.Item
            style={{
              backgroundColor: colors?.card || '#fff',
              color: colors?.text || '#333'
            }}
          >
            该类别模板格式错误
          </ListGroup.Item>
        );
      }

      // 检查是否有可用模板
      if (categoryData.chinese.length === 0) {
        return (
          <ListGroup.Item
            style={{
              backgroundColor: colors?.card || '#fff',
              color: colors?.text || '#333'
            }}
          >
            该类别暂无可用模板
          </ListGroup.Item>
        );
      }

      // 渲染模板列表
      return categoryData.chinese.map((template, index) => {
        // 安全处理每个模板
        if (!template || typeof template !== 'string') {
          console.warn(`跳过无效的模板项 (索引 ${index})`);
          return null;
        }

        const displayText = processTemplateData(template);

        return (
          <ListGroup.Item
            key={`template-option-${selectedCategory}-${index}`}
            action
            onClick={() => addTemplate(template)}
            style={{
              backgroundColor: colors?.card || '#fff',
              color: colors?.text || '#333',
              borderColor: colors?.border || '#ced4da',
              cursor: 'pointer'
            }}
          >
            {displayText || '(空模板)'}
          </ListGroup.Item>
        );
      }).filter(item => item !== null); // 过滤掉无效项
    } catch (error) {
      console.error("渲染模板选项出错:", error);
      setLocalError("渲染模板列表时出错");
      return (
        <ListGroup.Item
          style={{
            backgroundColor: colors?.card || '#fff',
            color: colors?.text || '#333'
          }}
        >
          <i className="bi bi-exclamation-triangle me-2 text-warning"></i>
          加载模板出错: {error.message}
        </ListGroup.Item>
      );
    }
  }, [selectedCategory, colors, processTemplateData, addTemplate]);
  
  // 渲染已选模板列表
  const renderSelectedTemplates = useCallback(() => {
    if (!Array.isArray(selectedTemplates) || selectedTemplates.length === 0) {
      return (
        <p className="text-muted mb-0">请从左侧选择需要添加的特殊订货要求模板</p>
      );
    }
    
    return (
      <ol className="mb-0 ps-3">
        {selectedTemplates.map((template, index) => (
          <li key={`selected-template-${index}`} className="mb-2 d-flex align-items-start">
            <span className="me-2">{template}</span>
            <div className="ms-auto d-flex">
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-1 p-0 px-1"
                onClick={() => moveTemplate(index, index - 1)}
                disabled={index === 0}
                title="上移"
              >
                <i className="bi bi-arrow-up"></i>
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                className="me-1 p-0 px-1"
                onClick={() => moveTemplate(index, index + 1)}
                disabled={index === selectedTemplates.length - 1}
                title="下移"
              >
                <i className="bi bi-arrow-down"></i>
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                className="p-0 px-1"
                onClick={() => removeTemplate(index)}
                title="删除"
              >
                <i className="bi bi-x"></i>
              </Button>
            </div>
          </li>
        ))}
      </ol>
    );
  }, [selectedTemplates, moveTemplate, removeTemplate]);
  
  // 组件渲染
  return (
    <div className="mb-3">
      <h6 style={{ color: colors?.headerText || '#333' }}>特殊订货要求模板</h6>

      {localError && (
        <Alert variant="danger" className="mb-2" dismissible onClose={() => setLocalError(null)}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {localError}
        </Alert>
      )}

      {/* 初始化检查 */}
      {!isInitialized && !localError && (
        <Alert variant="info" className="mb-2">
          <i className="bi bi-info-circle-fill me-2"></i>
          正在加载模板数据...
        </Alert>
      )}

      <Row>
        <Col md={4}>
          <div className="mb-3">
            <Form.Group>
              <Form.Label>类别</Form.Label>
              <Form.Select 
                value={selectedCategory}
                onChange={(e) => handleCategoryChange(e.target.value)}
                style={{
                  backgroundColor: colors?.inputBg || '#fff',
                  color: colors?.text || '#333',
                  borderColor: colors?.inputBorder || '#ced4da'
                }}
              >
                <option value="performance">性能参数类</option>
                <option value="installation">安装与连接类</option>
                <option value="cooling">冷却系统类</option>
                <option value="lubrication">润滑系统类</option>
                <option value="monitoring">监测与报警系统类</option>
                <option value="control">操控系统类</option>
                <option value="documentation">检验与文档类</option>
                <option value="special">特殊应用场景</option>
              </Form.Select>
            </Form.Group>
            
            <div className="mt-3">
              <Form.Label>可选模板</Form.Label>
              <ListGroup
                style={{
                  maxHeight: '200px',
                  overflow: 'auto',
                  backgroundColor: colors?.card || '#fff',
                  borderColor: colors?.border || '#ced4da'
                }}
              >
                {renderTemplateOptions()}
              </ListGroup>
            </div>
            
            <div className="mt-3">
              <Form.Group>
                <Form.Label>自定义需求</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  value={customRequirement}
                  onChange={(e) => setCustomRequirement(e.target.value)}
                  placeholder="输入自定义特殊需求..."
                  style={{
                    backgroundColor: colors?.inputBg || '#fff',
                    color: colors?.text || '#333',
                    borderColor: colors?.inputBorder || '#ced4da'
                  }}
                />
              </Form.Group>
              <Button
                variant="outline-primary"
                size="sm"
                className="mt-2"
                onClick={addCustomRequirement}
                disabled={!customRequirement.trim()}
              >
                <i className="bi bi-plus-circle me-1"></i> 添加自定义需求
              </Button>
            </div>
          </div>
        </Col>
        
        <Col md={8}>
          <div className="mb-3">
            <Form.Label>已选特殊订货要求 
              <Badge bg="info" className="ms-2">
                {Array.isArray(selectedTemplates) ? selectedTemplates.length : 0}
              </Badge>
              {Array.isArray(selectedTemplates) && selectedTemplates.length > 0 && (
                <Button
                  variant="outline-danger"
                  size="sm"
                  className="ms-2"
                  onClick={clearTemplates}
                >
                  <i className="bi bi-trash me-1"></i> 清空
                </Button>
              )}
            </Form.Label>
            <div 
              className="p-3 border rounded"
              style={{
                maxHeight: '300px',
                overflowY: 'auto',
                backgroundColor: colors?.card || '#fff',
                color: colors?.text || '#333',
                borderColor: colors?.border || '#ced4da'
              }}
            >
              {renderSelectedTemplates()}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});

// 设置显示名称以便于调试
SpecialRequirementsTemplateSelector.displayName = 'SpecialRequirementsTemplateSelector';

/**
 * 技术协议生成器组件
 * 用于选择、配置和生成各类型的技术协议
 */
const AgreementGenerator = ({ 
  selectionResult, 
  projectInfo, 
  selectedComponents,
  colors,
  theme,
  onGenerated = () => {}
}) => {
  // 状态管理
  const [templateType, setTemplateType] = useState(TemplateType.GWC);
  const [language, setLanguage] = useState(LanguageType.CHINESE);
  const [options, setOptions] = useState({
    includeQualitySection: true,
    includeMaintenanceSection: true,
    includeAttachmentSection: true,
    includeShipInfo: true,
    approvalPeriod: 10,
    feedbackPeriod: 10,
    warrantyPeriod: "十二个月"
  });
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [specialReqType, setSpecialReqType] = useState('custom'); // 'custom' 或 'template'
  const [specialRequirementsFormat, setSpecialRequirementsFormat] = useState('numbered'); // 'numbered', 'bullet', 'plain'
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('config');
  
  // 新增双语模板相关状态
  const [isBilingual, setIsBilingual] = useState(false);
  const [bilingualLayout, setBilingualLayout] = useState('side-by-side');
  
  // 预览引用
  const previewRef = useRef(null);

  // 根据所选齿轮箱型号自动设置模板类型
  useEffect(() => {
    try {
      if (selectedComponents?.gearbox?.model) {
        const model = selectedComponents.gearbox.model;
        if (model.startsWith('GWC') || model.startsWith('GWL')) {
          setTemplateType(TemplateType.GWC);
        } else if (model.startsWith('HCT')) {
          setTemplateType(TemplateType.HCT);
        } else if (model.startsWith('HC')) {
          setTemplateType(TemplateType.HC);
        } else if (model.startsWith('DT')) {
          setTemplateType(TemplateType.DT);
        } else if (model.startsWith('HCD')) {
          setTemplateType(TemplateType.HCD);
        }
      }
    } catch (error) {
      console.error("根据型号设置模板类型出错:", error);
    }
  }, [selectedComponents]);
  
  // 处理选项变更
  const handleOptionChange = useCallback((name, value) => {
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);
  
  // 生成协议内容
  const generateAgreement = useCallback(() => {
    setLoading(true);
    setError('');
    
    try {
      // 检查是否使用双语模式
      if (isBilingual) {
        generateBilingualAgreementContent();
      } else {
        generateSingleLanguageAgreementContent();
      }
    } catch (error) {
      console.error('生成技术协议失败:', error);
      setError(`生成技术协议失败: ${error.message}`);
      setLoading(false);
    }
  }, [isBilingual]);
  
  // 生成双语版技术协议 - 改进版
  const generateBilingualAgreementContent = useCallback(() => {
    try {
      // 准备数据
      const gearbox = selectedComponents?.gearbox || {};
      const engine = selectionResult?.engineData || {};
      const ship = projectInfo || {};
      
      // 检查必要数据
      if (!gearbox.model) {
        throw new Error('未选择齿轮箱，无法生成协议');
      }
      
      // 准备模板数据
      const templateData = {
        // 项目和船舶信息
        projectName: ship.projectName || '',
        shipOwner: ship.customerName || '',
        shipyard: ship.shipyard || '',
        shipType: ship.shipType || '客运船',
        shipManufacturer: ship.shipManufacturer || '',
        projectNumber: ship.projectNumber || '',
        
        // 主机信息
        engineModel: ship.engineModel || engine.model || '',
        enginePower: engine.power || '',
        engineSpeed: engine.speed || '',
        engineRotation: engine.rotation || '顺时针',
        
        // 齿轮箱信息
        model: gearbox.model || '',
        reductionRatio: gearbox.reductionRatio || gearbox.ratio || '',
        arrangement: gearbox.arrangement || '水平排列',
        
        // 技术参数
        transmissionCapacity: gearbox.transmissionCapacity || gearbox.power || '',
        maxInputSpeed: gearbox.maxInputSpeed || engine.speed || '',
        lubricationOilPressure: gearbox.lubricationOilPressure || '0.04～0.4',
        maxPropellerThrust: gearbox.maxPropellerThrust || '',
        centerDistance: gearbox.centerDistance || '',
        maxOilTemperature: gearbox.maxOilTemperature || '75',
        mechanicalEfficiency: gearbox.mechanicalEfficiency || '96',
        weight: gearbox.weight || '',
        
        // 倾斜度
        longitudinalInclination: gearbox.longitudinalInclination || '10',
        transverseInclination: gearbox.transverseInclination || '15',
        
        // 配件信息
        couplingModel: selectedComponents?.coupling?.model || '主机厂配',
        pumpModel: selectedComponents?.pump?.model || '',
        
        // 配置选项
        approvalPeriod: options.approvalPeriod.toString(),
        feedbackPeriod: options.feedbackPeriod.toString(),
        warrantyPeriod: options.warrantyPeriod,
        
        // 特殊订货要求
        specialRequirements: specialRequirements || '无',
        specialRequirementsFormat: specialRequirementsFormat,
        
        // 选项标记
        includeQualitySection: options.includeQualitySection,
        includeMaintenanceSection: options.includeMaintenanceSection,
        includeAttachmentSection: options.includeAttachmentSection,
        includeShipInfo: options.includeShipInfo,
        
        // 监控报警参数
        lowOilPressureAlarm: gearbox.lowOilPressureAlarm || '0.05',
        highOilTemperatureAlarm: gearbox.highOilTemperatureAlarm || '75',
        
        // 冷却系统参数
        coolingWaterInletTemperature: gearbox.coolingWaterInletTemperature || '32',
        coolingWaterVolume: gearbox.coolingWaterVolume || '2',
        coolingWaterPressure: gearbox.coolingWaterPressure || '0.35',
        
        // 润滑系统参数
        oilCapacity: gearbox.oilCapacity || '100',
        oilGrade: gearbox.oilGrade || 'CD40'
      };
      
      // 使用双语生成器生成内容，并根据布局类型添加相应的CSS类名
      let content = '';
      
      if (bilingualLayout === 'side-by-side') {
        content = generateBilingualAgreement(templateData, bilingualLayout)
          .replace('<div class="container bilingual-document">', 
                   '<div class="container bilingual-document side-by-side">');
      } 
      else if (bilingualLayout === 'sequential') {
        content = generateBilingualAgreement(templateData, bilingualLayout)
          .replace('<div class="container bilingual-document">', 
                   '<div class="container bilingual-document sequential-layout">');
      }
      else { // complete layout
        content = generateBilingualAgreement(templateData, bilingualLayout)
          .replace('<div class="container bilingual-document">', 
                   '<div class="container bilingual-document complete-layout">');
      }
      
      // 确保引入CSS样式
      if (!content.includes('<link rel="stylesheet" href="../styles/bilingualStyles.css">')) {
        content = content.replace('</head>', 
          '<link rel="stylesheet" href="../styles/bilingualStyles.css">\n</head>');
      }
      
      // 设置协议内容
      const generatedAgreement = {
        type: templateType,
        language: 'bilingual',
        html: content,
        options: { ...options },
        data: templateData,
        bilingualLayout: bilingualLayout
      };
      
      setAgreement(generatedAgreement);
      
      // 切换到预览选项卡
      setActiveTab('preview');
      
      // 通知父组件协议已生成
      onGenerated(generatedAgreement);
      
      setLoading(false);
    } catch (error) {
      console.error('生成双语技术协议失败:', error);
      setError(`生成双语技术协议失败: ${error.message}`);
      setLoading(false);
    }
  }, [selectedComponents, selectionResult, projectInfo, options, specialRequirements, specialRequirementsFormat, bilingualLayout, templateType, onGenerated]);
  
  // 生成单语种技术协议
  const generateSingleLanguageAgreementContent = useCallback(() => {
    try {
      // 获取模板
      const template = getAgreementTemplate(templateType, language, options);
      
      if (!template) {
        throw new Error(`找不到${templateType}系列的${language === 'zh' ? '中文' : '英文'}模板`);
      }
      
      // 准备数据
      const gearbox = selectedComponents?.gearbox || {};
      const engine = selectionResult?.engineData || {};
      const ship = projectInfo || {};
      
      // 检查必要数据
      if (!gearbox.model) {
        throw new Error('未选择齿轮箱，无法生成协议');
      }
      
      // 准备模板数据
      const templateData = {
        // 项目和船舶信息
        projectNumber: ship.projectNumber || '',
        shipOwner: ship.customerName || '',
        shipyard: ship.shipyard || '',
        shipType: ship.shipType || '',
        shipManufacturer: ship.shipManufacturer || '',
        shipProjectNumber: ship.projectNumber || '',
        shipDesigner: ship.designer || '',
        registrationNumber: ship.registrationNumber || '',
        
        // 船检要求选择
        ccsEntry: ship.classification === 'CCS_ENTRY' ? 'checked' : '',
        ccsNonEntry: ship.classification === 'CCS_NON_ENTRY' ? 'checked' : '',
        ccsFishingVessel: ship.classification === 'CCS_FISHING' ? 'checked' : '',
        zyFishingVessel: ship.classification === 'ZY_FISHING' ? 'checked' : '',
        foreignShipInspection: ship.classification === 'FOREIGN' ? 'checked' : '',
        
        // 主机信息
        engineModel: ship.engineModel || engine.model || '',
        enginePower: engine.power || '',
        engineSpeed: engine.speed || '',
        engineRotation: engine.rotation || '顺时针',
        
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
        gearboxModel: gearbox.model || '',
        reductionRatio: gearbox.reductionRatio || '',
        arrangement: gearbox.arrangement || '水平排列（输入、输出轴水平中心距：0mm，垂直中心距：0mm）',
        inputCoupling: '主机厂配高弹联轴器',
        quantity: ship.quantity || '1',
        deliveryTime: ship.deliveryTime || '',
        
        // 监控系统
        standardMonitoring: (gearbox.monitoringSystem === 'STANDARD' || !gearbox.monitoringSystem) ? 'checked' : '',
        specialMonitoring: gearbox.monitoringSystem === 'SPECIAL' ? 'checked' : '',
        
        // 操控方式
        manualControl: gearbox.controlType === 'MANUAL' ? 'checked' : '',
        electricControl: (gearbox.controlType === 'ELECTRIC' || !gearbox.controlType) ? 'checked' : '',
        pneumaticControl: gearbox.controlType === 'PNEUMATIC' ? 'checked' : '',
        controlVoltage: gearbox.controlVoltage || '24',
        
        // 成套配件
        couplingModel: selectedComponents?.coupling?.model || '主机厂配',
        pumpModel: selectedComponents?.pump?.model || '',
        
        // 成套方选择
        couplingBySupplier: (gearbox.couplingSupplier === 'SUPPLIER') ? 'checked' : '',
        couplingByDemander: (gearbox.couplingSupplier === 'DEMANDER' || !gearbox.couplingSupplier) ? 'checked' : '',
        pumpBySupplier: (gearbox.pumpSupplier === 'SUPPLIER' || !gearbox.pumpSupplier) ? 'checked' : '',
        pumpByDemander: gearbox.pumpSupplier === 'DEMANDER' ? 'checked' : '',
        
        // 技术参数
        transmissionCapacity: gearbox.transmissionCapacity || '',
        maxInputSpeed: gearbox.maxInputSpeed || '',
        lubricationOilPressure: gearbox.lubricationOilPressure || '0.04～0.4',
        maxPropellerThrust: gearbox.maxPropellerThrust || '',
        centerDistance: gearbox.centerDistance || '',
        maxOilTemperature: gearbox.maxOilTemperature || '75',
        oilCapacity: gearbox.oilCapacity || '',
        oilGrade: gearbox.oilGrade || 'CD30 或 CD40',
        coolingWaterInletTemperature: gearbox.coolingWaterInletTemperature || '32',
        coolingWaterVolume: gearbox.coolingWaterVolume || '',
        coolingWaterPressure: gearbox.coolingWaterPressure || '0.35',
        mechanicalEfficiency: gearbox.mechanicalEfficiency || '96',
        forwardDirection: '',
        
        // 倾斜度
        longitudinalInclination: gearbox.longitudinalInclination || '10',
        transverseInclination: gearbox.transverseInclination || '15',
        longitudinalShaking: gearbox.longitudinalShaking || '7.5',
        transverseShaking: gearbox.transverseShaking || '22.5',
        
        // 安装和其他参数
        installationMethod: gearbox.installationMethod || '与船体基座为刚性安装',
        lubricationOilPump: gearbox.lubricationOilPump || '',
        overhaulTime: gearbox.overhaulTime || '10000',
        nameplateSpecification: gearbox.nameplateSpecification || '不锈钢，黑底白字阳文，中英文对照',
        instrumentsAndAlarms: gearbox.instrumentsAndAlarms || '',
        
        // 联轴器信息
        couplingManufacturer: gearbox.couplingManufacturer || '杭州前进联轴器有限公司',
        couplingConnections: '配齐与电机和齿轮箱的联接件',
        
        // 配置选项
        approvalPeriod: options.approvalPeriod.toString(),
        feedbackPeriod: options.feedbackPeriod.toString(),
        warrantyPeriod: options.warrantyPeriod,
        
        // 特殊订货要求
        specialRequirements: specialRequirements || '无',
        
        // 监控报警参数
        lowOilPressureAlarm: gearbox.lowOilPressureAlarm || '0.05',
        lowWorkingOilPressureAlarm: gearbox.lowWorkingOilPressureAlarm || '1.3',
        highOilTemperatureAlarm: gearbox.highOilTemperatureAlarm || '75',
        
        // 服务信息
        servicePhone: '0571-82673888',
        
        // HCT模板特有
        powerArrangement: '柴油机——高弹联轴器——齿轮箱——螺旋桨',
        arrangementDiagram: '[示意图]',
        gearboxFunctions: '具有减速、倒顺离合和承受螺旋桨推力的功能',
        inputRotation: '顺时针',
        outputRotation: '详见排列图示',
        propellerThrust: gearbox.maxPropellerThrust || '',
        reversalTime: '10',
        workingOilPressure: '1.8-2.0',
        
        // DT模板特有
        regulations: '中国船级社《钢质内河船舶建造规范》（2016年版）及有关修改通报；' +
                    '中华人民共和国海事局《船舶与海上设施法定检验规则—内河船舶法定检验技术规则》（2019年版）及其修改和变更通报；' +
                    '中国船级社《材料与焊接规范》（2021年版）及修改和变更通报',
        
        // 为保证兼容性添加的备用字段
        designer: ship.designer || '',
      };
      
      // 处理特殊订货要求格式化（如果有）
      if (specialRequirements && specialRequirements.trim() !== '') {
        try {
          // 将每行转换为HTML列表项
          const reqLines = specialRequirements.split('\n').filter(line => line.trim() !== '');
          if (reqLines.length > 0) {
            const reqListItems = reqLines.map((line, index) => `<li key="req-${index}">${line.trim()}</li>`).join('');
            const reqListHtml = '<ol class="special-requirements-list">' + reqListItems + '</ol>';
            templateData.specialRequirements = reqListHtml;
          }
        } catch (reqError) {
          console.error("处理特殊要求格式失败:", reqError);
          // 保留原始文本，不进行格式化
          templateData.specialRequirements = specialRequirements;
        }
      }
      
      // 填充模板
      const content = fillTemplate(template, templateData);
      
      // 设置协议内容
      setAgreement({
        type: templateType,
        language: language,
        html: content,
        options: { ...options },
        data: templateData
      });
      
      // 切换到预览选项卡
      setActiveTab('preview');
      
      // 通知父组件协议已生成
      onGenerated({
        type: templateType,
        language: language,
        html: content,
        options: { ...options },
        data: templateData
      });
      
      setLoading(false);
    } catch (error) {
      console.error('生成单语言技术协议失败:', error);
      setError(`生成技术协议失败: ${error.message}`);
      setLoading(false);
    }
  }, [language, onGenerated, options, projectInfo, selectedComponents, selectionResult, specialRequirements, specialRequirementsFormat, templateType]);
  
  // 导出为PDF - 修改版
  const exportToPDF = useCallback(() => {
    if (!agreement || !previewRef.current) {
      setError('请先生成技术协议');
      return;
    }
    
    setLoading(true);
    const filename = `${projectInfo?.projectName || '齿轮箱'}_技术协议`;
    
    // 添加延时确保内容完全渲染
    setTimeout(() => {
      exportHtmlContentToPDF(previewRef.current, {
        filename: `${filename}.pdf`,
        orientation: 'portrait',
        format: 'a4',
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        scale: 1.5,
        useCORS: true,
        allowTaint: true
      })
      .then(() => {
        console.log('导出PDF成功');
        setLoading(false);
      })
      .catch((err) => {
        console.error('导出PDF失败:', err);
        setError(`导出PDF失败: ${err.message}`);
        setLoading(false);
      });
    }, 500);
  }, [agreement, projectInfo]);
  
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
      // 返回默认值避免空对象
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
  
  // 处理特殊订货要求变更
  const handleSpecialRequirementsChange = useCallback((value) => {
    console.log("特殊订货要求更新:", value);
    setSpecialRequirements(value);
  }, []);
  
  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-file-earmark-text me-2"></i>
            齿轮箱技术协议生成
          </span>
          {agreement && (
            <Button variant="outline-primary" size="sm" onClick={exportToPDF}>
              <i className="bi bi-file-earmark-pdf me-1"></i> 导出PDF
            </Button>
          )}
        </div>
      </Card.Header>
      
      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="config" title="配置">
            <Form>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>协议模板类型</Form.Label>
                    <Form.Select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value)}
                    >
                      <option value={TemplateType.GWC}>GWC/GWL系列</option>
                      <option value={TemplateType.HCT}>HCT系列</option>
                      <option value={TemplateType.HC}>HC系列</option>
                      <option value={TemplateType.DT}>DT系列</option>
                      <option value={TemplateType.HCD}>HCD系列</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>协议语言</Form.Label>
                    <div>
                      <Form.Check
                        inline
                        type="radio"
                        id="lang-zh"
                        label="仅中文"
                        name="language-option"
                        checked={language === LanguageType.CHINESE && !isBilingual}
                        onChange={() => {
                          setLanguage(LanguageType.CHINESE);
                          setIsBilingual(false);
                        }}
                        className="mb-2"
                      />
                      <Form.Check
                        inline
                        type="radio"
                        id="lang-en"
                        label="仅英文"
                        name="language-option"
                        checked={language === LanguageType.ENGLISH && !isBilingual}
                        onChange={() => {
                          setLanguage(LanguageType.ENGLISH);
                          setIsBilingual(false);
                        }}
                        className="mb-2"
                      />
                      <Form.Check
                        inline
                        type="radio"
                        id="lang-bilingual"
                        label="中英文对照"
                        name="language-option"
                        checked={isBilingual}
                        onChange={() => {
                          setIsBilingual(true);
                        }}
                        className="mb-2"
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              
              {/* 双语布局选项 - 当选择中英文对照时显示 */}
              {isBilingual && (
                <Row className="mb-3">
                  <Col md={12}>
                    <Form.Group className="mb-3">
                      <Form.Label>双语布局方式</Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          id="layout-side"
                          label="左右对照（中英文并排）"
                          name="bilingual-layout"
                          checked={bilingualLayout === 'side-by-side'}
                          onChange={() => setBilingualLayout('side-by-side')}
                          className="mb-2"
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="layout-sequential"
                          label="分段对照（每段先中后英）"
                          name="bilingual-layout"
                          checked={bilingualLayout === 'sequential'}
                          onChange={() => setBilingualLayout('sequential')}
                          className="mb-2"
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="layout-complete"
                          label="全文对照（先中文后英文）"
                          name="bilingual-layout"
                          checked={bilingualLayout === 'complete'}
                          onChange={() => setBilingualLayout('complete')}
                          className="mb-2"
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
              )}
              
              <Card className="mb-3">
                <Card.Header>协议模块配置</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Check
                        type="checkbox"
                        id="includeQualitySection"
                        label="包含质量保证部分"
                        checked={options.includeQualitySection}
                        onChange={(e) => handleOptionChange('includeQualitySection', e.target.checked)}
                        className="mb-2"
                      />
                      
                      <Form.Check
                        type="checkbox"
                        id="includeMaintenanceSection"
                        label="包含技术服务部分"
                        checked={options.includeMaintenanceSection}
                        onChange={(e) => handleOptionChange('includeMaintenanceSection', e.target.checked)}
                        className="mb-2"
                      />
                    </Col>
                    
                    <Col md={6}>
                      <Form.Check
                        type="checkbox"
                        id="includeAttachmentSection"
                        label="包含随机文件部分"
                        checked={options.includeAttachmentSection}
                        onChange={(e) => handleOptionChange('includeAttachmentSection', e.target.checked)}
                        className="mb-2"
                      />
                      
                      <Form.Check
                        type="checkbox"
                        id="includeShipInfo"
                        label="包含船舶信息部分"
                        checked={options.includeShipInfo}
                        onChange={(e) => handleOptionChange('includeShipInfo', e.target.checked)}
                        className="mb-2"
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card className="mb-3">
                <Card.Header>时间和周期配置</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>认可资料提供期限（天）</Form.Label>
                        <Form.Control
                          type="number"
                          value={options.approvalPeriod}
                          onChange={(e) => handleOptionChange('approvalPeriod', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>意见反馈期限（天）</Form.Label>
                        <Form.Control
                          type="number"
                          value={options.feedbackPeriod}
                          onChange={(e) => handleOptionChange('feedbackPeriod', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>质保期描述（中文）</Form.Label>
                        <Form.Control
                          type="text"
                          value={options.warrantyPeriod}
                          onChange={(e) => handleOptionChange('warrantyPeriod', e.target.value)}
                          placeholder="例如：十二个月"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card className="mb-3">
                <Card.Header>特殊订货要求</Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>使用模板或自定义特殊订货要求</Form.Label>
                    <Row>
                      <Col>
                        <Form.Check
                          type="radio"
                          id="special-req-template"
                          label="使用模板生成"
                          name="special-req-type"
                          checked={specialReqType === 'template'}
                          onChange={() => setSpecialReqType('template')}
                          className="mb-2"
                        />
                        <Form.Check
                          type="radio"
                          id="special-req-custom"
                          label="手动输入文本"
                          name="special-req-type"
                          checked={specialReqType === 'custom'}
                          onChange={() => setSpecialReqType('custom')}
                          className="mb-2"
                        />
                      </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                      <Form.Label>特殊订货要求格式</Form.Label>
                      <div>
                        <Form.Check
                          inline
                          type="radio"
                          id="special-req-format-numbered"
                          label="编号列表"
                          name="special-req-format"
                          checked={specialRequirementsFormat === 'numbered'}
                          onChange={() => setSpecialRequirementsFormat('numbered')}
                          className="mb-2"
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="special-req-format-bullet"
                          label="项目符号"
                          name="special-req-format"
                          checked={specialRequirementsFormat === 'bullet'}
                          onChange={() => setSpecialRequirementsFormat('bullet')}
                          className="mb-2"
                        />
                        <Form.Check
                          inline
                          type="radio"
                          id="special-req-format-plain"
                          label="纯文本"
                          name="special-req-format"
                          checked={specialRequirementsFormat === 'plain'}
                          onChange={() => setSpecialRequirementsFormat('plain')}
                          className="mb-2"
                        />
                      </div>
                    </Form.Group>
                    
                    {specialReqType === 'template' ? (
                      <ErrorBoundary
                        fallback={
                          <Alert variant="warning">
                            <i className="bi bi-exclamation-triangle-fill me-2"></i>
                            特殊订货要求模板选择器加载失败，请尝试使用手动输入文本模式。
                            <div className="mt-2">
                              <Button
                                variant="outline-primary"
                                size="sm"
                                onClick={() => setSpecialReqType('custom')}
                              >
                                切换到手动输入
                              </Button>
                            </div>
                          </Alert>
                        }
                      >
                        <SpecialRequirementsTemplateSelector
                          currentRequirements={specialRequirements}
                          templateData={getTemplateDataForRequirements()}
                          onRequirementsChange={handleSpecialRequirementsChange}
                          colors={colors}
                        />
                      </ErrorBoundary>
                    ) : (
                      <Form.Control
                        as="textarea"
                        rows={5}
                        value={specialRequirements}
                        onChange={(e) => setSpecialRequirements(e.target.value)}
                        placeholder="请输入特殊订货要求，每条要求占一行..."
                        style={{
                          backgroundColor: colors?.inputBg || '#fff',
                          color: colors?.text || '#333',
                          borderColor: colors?.inputBorder || '#ced4da'
                        }}
                      />
                    )}
                    <Form.Text className="text-muted">
                      每行一条特殊要求，如压力、冷却水流量等特殊要求
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
              
              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  onClick={generateAgreement}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
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
            </Form>
          </Tab>
          
          <Tab eventKey="preview" title="预览" disabled={!agreement}>
            {agreement && (
              <div className="agreement-preview-wrapper">
                <div ref={previewRef} className="agreement-preview-content" dangerouslySetInnerHTML={{ __html: agreement.html }}></div>
              </div>
            )}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default AgreementGenerator;