// src/components/SpecialRequirementsTemplateSelector.js
import React, { useState, useEffect, useCallback } from 'react';
import { Form, Row, Col, Button, Alert, ListGroup, Badge } from 'react-bootstrap';

/**
 * 简化版特殊订货要求模板选择器
 * 专注于稳定性和错误处理
 */
const SpecialRequirementsTemplateSelector = React.memo(({ 
  currentRequirements, 
  templateData, 
  onRequirementsChange,
  colors,
  specialRequirementTemplates
}) => {
  // 状态定义
  const [selectedCategory, setSelectedCategory] = useState('performance');
  const [selectedTemplates, setSelectedTemplates] = useState([]);
  const [customRequirement, setCustomRequirement] = useState('');
  const [localError, setLocalError] = useState(null);
  
  // 初始化时记录日志
  useEffect(() => {
    console.log("SpecialRequirementsTemplateSelector组件挂载");
    console.log("初始templateData:", templateData);
    console.log("初始currentRequirements:", currentRequirements);
    console.log("可用模板:", specialRequirementTemplates);
    
    return () => {
      console.log("SpecialRequirementsTemplateSelector组件卸载");
    };
  }, [templateData, currentRequirements, specialRequirementTemplates]);
  
  // 初始化模板列表 - 安全解析当前需求
  useEffect(() => {
    try {
      console.log("处理currentRequirements变更:", currentRequirements);
      
      setLocalError(null);
      
      if (!currentRequirements) {
        console.log("无currentRequirements，设置空数组");
        setSelectedTemplates([]);
        return;
      }
      
      if (typeof currentRequirements !== 'string') {
        console.log("currentRequirements不是字符串，设置空数组");
        setSelectedTemplates([]);
        return;
      }
      
      // 安全解析当前需求
      const requirements = currentRequirements
        .split('\n')
        .filter(line => line && typeof line.trim === 'function' && line.trim() !== '')
        .map(line => line.trim());
      
      console.log(`解析出${requirements.length}个模板项`);
      setSelectedTemplates(requirements);
    } catch (error) {
      console.error("初始化模板列表出错:", error);
      setLocalError("无法加载当前要求列表");
      setSelectedTemplates([]);
    }
  }, [currentRequirements]);
  
  // 模板处理函数 - 安全替换变量
  const processTemplate = useCallback((template) => {
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
      let startIndex;
      while ((startIndex = processedTemplate.indexOf('{{')) !== -1) {
        const endIndex = processedTemplate.indexOf('}}', startIndex);
        if (endIndex !== -1) {
          processedTemplate = 
            processedTemplate.substring(0, startIndex) + 
            processedTemplate.substring(endIndex + 2);
        } else {
          break; // 没有找到结束标记，退出循环
        }
      }
      
      return processedTemplate;
    } catch (error) {
      console.error("处理模板变量出错:", error);
      return template; // 返回原始模板作为降级处理
    }
  }, [templateData]);
  
  // 添加模板函数 - 使用防御性编程和延迟通知
  const addTemplate = useCallback((template) => {
    console.log("尝试添加模板:", template);
    
    if (!template || typeof template !== 'string') {
      console.warn("无效的模板内容");
      return;
    }
    
    try {
      // 处理模板变量
      const processedTemplate = processTemplate(template);
      console.log("处理后的模板:", processedTemplate);
      
      if (!processedTemplate.trim()) {
        console.warn("处理后的模板为空");
        return;
      }
      
      // 使用函数形式的setState，避免竞态条件
      setSelectedTemplates(prevTemplates => {
        // 确保prevTemplates是数组
        const templates = Array.isArray(prevTemplates) ? [...prevTemplates] : [];
        
        // 检查是否重复
        if (!templates.some(item => item.trim() === processedTemplate.trim())) {
          // 添加新模板
          const newTemplates = [...templates, processedTemplate.trim()];
          
          // 使用setTimeout延迟通知父组件
          setTimeout(() => {
            if (onRequirementsChange && typeof onRequirementsChange === 'function') {
              onRequirementsChange(newTemplates.join('\n'));
            }
          }, 50);
          
          return newTemplates;
        }
        
        return templates; // 如果重复，返回原数组
      });
      
      setLocalError(null);
    } catch (error) {
      console.error("添加模板出错:", error);
      setLocalError("添加模板时出错");
    }
  }, [processTemplate, onRequirementsChange]);
  
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
    
    // 使用setTimeout延迟通知父组件
    setTimeout(() => {
      if (onRequirementsChange && typeof onRequirementsChange === 'function') {
        onRequirementsChange('');
      }
    }, 50);
    
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
      }, 50);
      
      return newTemplates;
    });
  }, [onRequirementsChange]);
  
  // 检查是否有可用的模板数据
  const hasTemplateData = useCallback(() => {
    return (
      specialRequirementTemplates && 
      typeof specialRequirementTemplates === 'object' &&
      Object.keys(specialRequirementTemplates).length > 0
    );
  }, [specialRequirementTemplates]);
  
  // 获取当前类别的模板列表
  const getCategoryTemplates = useCallback(() => {
    if (!hasTemplateData() || !specialRequirementTemplates[selectedCategory]) {
      return [];
    }
    
    try {
      return Array.isArray(specialRequirementTemplates[selectedCategory].chinese) 
        ? specialRequirementTemplates[selectedCategory].chinese 
        : [];
    } catch (error) {
      console.error("获取类别模板出错:", error);
      return [];
    }
  }, [hasTemplateData, specialRequirementTemplates, selectedCategory]);
  
  // 渲染下拉框选项
  const renderCategoryOptions = useCallback(() => {
    const defaultCategories = [
      { value: 'performance', label: '性能参数类' },
      { value: 'installation', label: '安装与连接类' },
      { value: 'cooling', label: '冷却系统类' },
      { value: 'lubrication', label: '润滑系统类' },
      { value: 'monitoring', label: '监测与报警系统类' },
      { value: 'control', label: '操控系统类' },
      { value: 'documentation', label: '检验与文档类' },
      { value: 'special', label: '特殊应用场景' },
      { value: 'testing', label: '试验要求类' },
      { value: 'warranty', label: '质保条款类' },
      { value: 'maintenance', label: '维护保养类' },
      { value: 'safety', label: '安全要求类' }
    ];
    
    if (hasTemplateData()) {
      // 如果有模板数据，使用数据中的类别
      const categories = Object.keys(specialRequirementTemplates).map(key => {
        // 找到默认标签，如果有的话
        const defaultCategory = defaultCategories.find(cat => cat.value === key);
        return {
          value: key,
          label: defaultCategory ? defaultCategory.label : key
        };
      });
      
      return categories.map(cat => (
        <option key={cat.value} value={cat.value}>{cat.label}</option>
      ));
    }
    
    // 否则使用默认类别
    return defaultCategories.map(cat => (
      <option key={cat.value} value={cat.value}>{cat.label}</option>
    ));
  }, [hasTemplateData, specialRequirementTemplates]);
  
  // 简化渲染 - 减少不必要的DOM操作
  return (
    <div className="mb-3">
      <h6 style={{ color: colors?.headerText || '#333' }}>特殊订货要求模板</h6>
      
      {localError && (
        <Alert variant="danger" className="mb-2" dismissible onClose={() => setLocalError(null)}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {localError}
        </Alert>
      )}
      
      <Row>
        <Col md={4}>
          <div className="mb-3">
            {/* 类别选择器 */}
            <Form.Group>
              <Form.Label>类别</Form.Label>
              <Form.Select 
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  backgroundColor: colors?.inputBg || '#fff',
                  color: colors?.text || '#333',
                  borderColor: colors?.inputBorder || '#ced4da'
                }}
              >
                {renderCategoryOptions()}
              </Form.Select>
            </Form.Group>
            
            {/* 模板列表 */}
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
                {hasTemplateData() ? (
                  getCategoryTemplates().length > 0 ? (
                    getCategoryTemplates().map((template, index) => {
                      const displayText = processTemplate(template);
                      return (
                        <ListGroup.Item 
                          key={`template-option-${index}`}
                          action
                          onClick={() => addTemplate(template)}
                          style={{
                            backgroundColor: colors?.card || '#fff',
                            color: colors?.text || '#333',
                            borderColor: colors?.border || '#ced4da'
                          }}
                        >
                          {displayText}
                        </ListGroup.Item>
                      );
                    })
                  ) : (
                    <ListGroup.Item 
                      style={{
                        backgroundColor: colors?.card || '#fff',
                        color: colors?.text || '#333'
                      }}
                    >
                      当前类别无可用模板
                    </ListGroup.Item>
                  )
                ) : (
                  <ListGroup.Item 
                    style={{
                      backgroundColor: colors?.card || '#fff',
                      color: colors?.text || '#333'
                    }}
                  >
                    未找到模板数据
                  </ListGroup.Item>
                )}
              </ListGroup>
            </div>
            
            {/* 自定义需求输入 */}
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
              {Array.isArray(selectedTemplates) && selectedTemplates.length > 0 ? (
                <ol className="mb-0 ps-3">
                  {selectedTemplates.map((template, index) => (
                    <li key={`selected-template-${index}`} className="mb-2 d-flex align-items-start">
                      <span className="me-2">{template}</span>
                      <div className="ms-auto">
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
              ) : (
                <p className="text-muted mb-0">请从左侧选择需要添加的特殊订货要求模板</p>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
});

// 设置显示名称以便于调试
SpecialRequirementsTemplateSelector.displayName = 'SpecialRequirementsTemplateSelector';

export default SpecialRequirementsTemplateSelector;