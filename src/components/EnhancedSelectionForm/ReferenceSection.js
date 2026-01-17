// src/components/EnhancedSelectionForm/ReferenceSection.js
// 参考信息区块组件

import React, { useState, useMemo } from 'react';
import { Card, Form, Row, Col, ListGroup } from 'react-bootstrap';
import { initialData } from '../../data/initialData';

/**
 * 参考信息区块
 * 包含: 相似方案/产品型号(带自动补全)、特殊工况说明
 */
const ReferenceSection = ({
  formData,
  updateField,
  colors = {},
  theme = 'light'
}) => {
  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  // 获取所有齿轮箱型号列表
  const allModels = useMemo(() => {
    const models = new Set();

    // 从各系列中收集型号
    ['hcGearboxes', 'hcmGearboxes', 'gwGearboxes', 'dtGearboxes'].forEach(key => {
      const data = initialData[key];
      if (Array.isArray(data)) {
        data.forEach(item => {
          if (item.model) models.add(item.model);
        });
      }
    });

    return Array.from(models).sort();
  }, []);

  // 自动补全状态
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredModels, setFilteredModels] = useState([]);

  // 处理输入变化
  const handleModelInputChange = (value) => {
    updateField('similarModel', value);

    if (value.length >= 2) {
      const filtered = allModels.filter(model =>
        model.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10);
      setFilteredModels(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  // 选择建议
  const selectSuggestion = (model) => {
    updateField('similarModel', model);
    setShowSuggestions(false);
  };

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa', color: colors.headerText || '#212529' }}>
        <strong>参考信息</strong>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3" style={{ position: 'relative' }}>
              <Form.Label>相似方案/产品型号</Form.Label>
              <Form.Control
                type="text"
                value={formData.similarModel}
                onChange={(e) => handleModelInputChange(e.target.value)}
                onFocus={() => {
                  if (formData.similarModel?.length >= 2) {
                    const filtered = allModels.filter(model =>
                      model.toLowerCase().includes(formData.similarModel.toLowerCase())
                    ).slice(0, 10);
                    setFilteredModels(filtered);
                    setShowSuggestions(filtered.length > 0);
                  }
                }}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="例如: HC201"
                style={inputStyle}
                autoComplete="off"
              />
              <Form.Text className="text-muted">
                输入型号名称，系统会自动匹配 (共{allModels.length}个型号)
              </Form.Text>

              {/* 自动补全建议列表 */}
              {showSuggestions && (
                <ListGroup
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    zIndex: 1000,
                    maxHeight: '200px',
                    overflowY: 'auto',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                  }}
                >
                  {filteredModels.map((model, index) => (
                    <ListGroup.Item
                      key={index}
                      action
                      onClick={() => selectSuggestion(model)}
                      style={{
                        cursor: 'pointer',
                        backgroundColor: colors.inputBg || '#fff',
                        color: colors.text || '#212529'
                      }}
                    >
                      {model}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>特殊工况说明及其它要求</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={formData.specialConditions}
                onChange={(e) => updateField('specialConditions', e.target.value)}
                placeholder="例如: 1进2两出，带消防泵。消防泵带PTO"
                style={inputStyle}
              />
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default ReferenceSection;
