// src/components/TemplateSelectionModal.js
import React, { useState, useMemo, useCallback } from 'react';
import { Modal, Button, Form, Accordion, Badge, Alert } from 'react-bootstrap';
import { specialRequirementTemplates } from '../utils/specialRequirementTemplates';

/**
 * 弹窗式模板批量选择组件
 *
 * 特点：
 * 1. 模态框方式，避免频繁状态更新
 * 2. 复选框批量选择，支持全选/清空
 * 3. 一次性提交，稳定可靠
 * 4. 按类别分组展示
 */
const TemplateSelectionModal = ({
  show,
  onHide,
  onConfirm,
  templateData = {},
  colors = {},
  language = 'chinese'
}) => {
  // 本地状态：选中的模板索引 { category: [index1, index2, ...] }
  const [selectedIndexes, setSelectedIndexes] = useState({});
  const [searchTerm, setSearchTerm] = useState('');

  // 类别配置
  const categories = useMemo(() => [
    { key: 'performance', label: '性能参数类', icon: '⚡' },
    { key: 'installation', label: '安装与连接类', icon: '🔧' },
    { key: 'cooling', label: '冷却系统类', icon: '❄️' },
    { key: 'lubrication', label: '润滑系统类', icon: '🛢️' },
    { key: 'monitoring', label: '监测与报警系统类', icon: '📊' },
    { key: 'control', label: '操控系统类', icon: '🎮' },
    { key: 'documentation', label: '检验与文档类', icon: '📄' },
    { key: 'special', label: '特殊应用场景', icon: '⭐' },
    { key: 'regulations', label: '法规与规范类', icon: '📜' },
    { key: 'delivery', label: '供货范围类', icon: '📦' },
    { key: 'acceptance', label: '验收程序类', icon: '✅' },
    { key: 'techDocs', label: '技术文件类', icon: '📋' }
  ], []);

  // 处理模板变量替换
  const processTemplate = useCallback((template) => {
    if (!template || !templateData) return template;

    let result = template;
    Object.entries(templateData).forEach(([key, value]) => {
      if (value != null) {
        const placeholder = `{{${key}}}`;
        result = result.replace(new RegExp(placeholder, 'g'), String(value));
      }
    });

    // 清除未替换的占位符
    result = result.replace(/\{\{[^}]+\}\}/g, '');
    return result;
  }, [templateData]);

  // 获取处理后的模板列表
  const processedTemplates = useMemo(() => {
    const result = {};
    categories.forEach(({ key }) => {
      const categoryTemplates = specialRequirementTemplates[key];
      if (categoryTemplates && Array.isArray(categoryTemplates[language])) {
        result[key] = categoryTemplates[language].map(t => processTemplate(t));
      } else {
        result[key] = [];
      }
    });
    return result;
  }, [categories, language, processTemplate]);

  // 过滤后的模板（根据搜索词）
  const filteredTemplates = useMemo(() => {
    if (!searchTerm.trim()) return processedTemplates;

    const result = {};
    Object.entries(processedTemplates).forEach(([category, templates]) => {
      result[category] = templates.filter(t =>
        t.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    return result;
  }, [processedTemplates, searchTerm]);

  // 统计选中数量
  const selectedCount = useMemo(() => {
    return Object.values(selectedIndexes).reduce((sum, indexes) => sum + indexes.length, 0);
  }, [selectedIndexes]);

  // 切换单个模板选中状态
  const toggleTemplate = useCallback((category, index) => {
    setSelectedIndexes(prev => {
      const categoryIndexes = prev[category] || [];
      const isSelected = categoryIndexes.includes(index);

      if (isSelected) {
        // 取消选中
        return {
          ...prev,
          [category]: categoryIndexes.filter(i => i !== index)
        };
      } else {
        // 选中
        return {
          ...prev,
          [category]: [...categoryIndexes, index]
        };
      }
    });
  }, []);

  // 全选/清空某个类别
  const toggleCategory = useCallback((category) => {
    setSelectedIndexes(prev => {
      const templates = processedTemplates[category] || [];
      const categoryIndexes = prev[category] || [];
      const allSelected = categoryIndexes.length === templates.length;

      if (allSelected) {
        // 清空该类别
        return {
          ...prev,
          [category]: []
        };
      } else {
        // 全选该类别
        return {
          ...prev,
          [category]: templates.map((_, index) => index)
        };
      }
    });
  }, [processedTemplates]);

  // 全选所有
  const selectAll = useCallback(() => {
    const allIndexes = {};
    Object.keys(processedTemplates).forEach(category => {
      allIndexes[category] = processedTemplates[category].map((_, index) => index);
    });
    setSelectedIndexes(allIndexes);
  }, [processedTemplates]);

  // 清空所有
  const clearAll = useCallback(() => {
    setSelectedIndexes({});
  }, []);

  // 确认选择
  const handleConfirm = useCallback(() => {
    const selectedTemplates = [];

    Object.entries(selectedIndexes).forEach(([category, indexes]) => {
      const templates = processedTemplates[category] || [];
      indexes.forEach(index => {
        if (templates[index]) {
          selectedTemplates.push(templates[index]);
        }
      });
    });

    onConfirm(selectedTemplates);
    setSelectedIndexes({}); // 重置选择
    setSearchTerm(''); // 重置搜索
    onHide();
  }, [selectedIndexes, processedTemplates, onConfirm, onHide]);

  // 关闭模态框
  const handleClose = useCallback(() => {
    setSelectedIndexes({});
    setSearchTerm('');
    onHide();
  }, [onHide]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      size="lg"
      centered
      scrollable
    >
      <Modal.Header
        closeButton
        style={{
          backgroundColor: colors.headerBg || '#f8f9fa',
          borderBottom: `2px solid ${colors.border || '#dee2e6'}`
        }}
      >
        <Modal.Title style={{ color: colors.headerText || '#333' }}>
          <i className="bi bi-list-check me-2"></i>
          选择特殊订货要求模板
          {selectedCount > 0 && (
            <Badge bg="primary" className="ms-2">{selectedCount} 项</Badge>
          )}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: colors.card || '#fff', maxHeight: '60vh' }}>
        {/* 搜索栏 */}
        <div className="mb-3">
          <Form.Control
            type="text"
            placeholder="🔍 搜索模板..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              backgroundColor: colors.inputBg || '#fff',
              color: colors.text || '#333',
              borderColor: colors.inputBorder || '#ced4da'
            }}
          />
        </div>

        {/* 操作按钮 */}
        <div className="mb-3 d-flex gap-2">
          <Button
            variant="outline-primary"
            size="sm"
            onClick={selectAll}
          >
            <i className="bi bi-check-all me-1"></i>全选
          </Button>
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={clearAll}
          >
            <i className="bi bi-x-circle me-1"></i>清空
          </Button>
        </div>

        {selectedCount === 0 && (
          <Alert variant="info">
            <i className="bi bi-info-circle me-2"></i>
            请选择需要的模板，可以多选。选完后点击"确认"按钮。
          </Alert>
        )}

        {/* 按类别展示模板 */}
        <Accordion defaultActiveKey="0">
          {categories.map(({ key, label, icon }, catIndex) => {
            const templates = filteredTemplates[key] || [];
            const categoryIndexes = selectedIndexes[key] || [];
            const allSelected = templates.length > 0 && categoryIndexes.length === templates.length;

            if (templates.length === 0) return null;

            return (
              <Accordion.Item eventKey={String(catIndex)} key={key}>
                <Accordion.Header>
                  <div className="d-flex justify-content-between align-items-center w-100 me-3">
                    <span>
                      <span className="me-2">{icon}</span>
                      {label}
                      <Badge bg="secondary" className="ms-2">{templates.length}</Badge>
                    </span>
                    {categoryIndexes.length > 0 && (
                      <Badge bg="success">{categoryIndexes.length} 项已选</Badge>
                    )}
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  {/* 类别全选 */}
                  <Form.Check
                    type="checkbox"
                    label={<strong>{allSelected ? '取消全选' : '全选此类别'}</strong>}
                    checked={allSelected}
                    onChange={() => toggleCategory(key)}
                    className="mb-2 pb-2 border-bottom"
                  />

                  {/* 模板列表 */}
                  {templates.map((template, index) => {
                    const isSelected = categoryIndexes.includes(index);
                    return (
                      <Form.Check
                        key={`${key}-${index}`}
                        type="checkbox"
                        id={`template-${key}-${index}`}
                        label={template}
                        checked={isSelected}
                        onChange={() => toggleTemplate(key, index)}
                        className="mb-2"
                        style={{
                          fontSize: '0.9rem',
                          color: colors.text || '#333'
                        }}
                      />
                    );
                  })}
                </Accordion.Body>
              </Accordion.Item>
            );
          })}
        </Accordion>

        {Object.keys(filteredTemplates).every(key => filteredTemplates[key].length === 0) && (
          <Alert variant="warning" className="mt-3">
            <i className="bi bi-search me-2"></i>
            没有找到匹配的模板
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: colors.card || '#fff' }}>
        <Button variant="secondary" onClick={handleClose}>
          <i className="bi bi-x me-1"></i>取消
        </Button>
        <Button
          variant="primary"
          onClick={handleConfirm}
          disabled={selectedCount === 0}
        >
          <i className="bi bi-check-lg me-1"></i>
          确认添加 {selectedCount > 0 && `(${selectedCount})`}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TemplateSelectionModal;
