// src/components/AgreementGenerator/SpecialRequirementsEditor.js
// 特殊订货要求编辑器组件
import React, { useCallback } from 'react';
import { Form, Card, Button, Badge, Row, Col } from 'react-bootstrap';

/**
 * 特殊订货要求编辑器
 * 支持模板选择和手动输入两种模式
 */
const SpecialRequirementsEditor = ({
  selectedTemplates,
  dispatchTemplates,
  TEMPLATE_ACTIONS,
  specialReqType,
  setSpecialReqType,
  specialRequirementsFormat,
  setSpecialRequirementsFormat,
  onShowTemplateModal,
  colors = {}
}) => {
  // 清空所有模板
  const handleClearTemplates = useCallback(() => {
    dispatchTemplates({ type: TEMPLATE_ACTIONS.CLEAR });
  }, [dispatchTemplates, TEMPLATE_ACTIONS]);

  // 删除单个模板
  const handleRemoveTemplate = useCallback((index) => {
    dispatchTemplates({ type: TEMPLATE_ACTIONS.REMOVE, payload: index });
  }, [dispatchTemplates, TEMPLATE_ACTIONS]);

  // 派生 specialRequirements 字符串
  const specialRequirements = selectedTemplates.join('\n');

  return (
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
            <div className="mb-3">
              {/* 添加模板按钮 */}
              <div className="mb-3">
                <Button
                  variant="primary"
                  size="md"
                  onClick={onShowTemplateModal}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  选择模板
                </Button>
                {selectedTemplates.length > 0 && (
                  <Button
                    variant="outline-danger"
                    size="md"
                    className="ms-2"
                    onClick={handleClearTemplates}
                  >
                    <i className="bi bi-trash me-1"></i>
                    清空全部
                  </Button>
                )}
              </div>

              {/* 已选模板列表 */}
              <div
                style={{
                  minHeight: '150px',
                  maxHeight: '300px',
                  overflow: 'auto',
                  border: `1px solid ${colors?.border || '#ced4da'}`,
                  borderRadius: '4px',
                  padding: '15px',
                  backgroundColor: colors?.inputBg || '#fff'
                }}
              >
                {selectedTemplates.length === 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      height: '120px',
                      color: colors?.text || '#6c757d',
                      fontStyle: 'italic'
                    }}
                  >
                    <div className="text-center">
                      <i className="bi bi-inbox" style={{ fontSize: '2rem', display: 'block', marginBottom: '10px' }}></i>
                      暂无选择的模板，点击上方"选择模板"按钮添加
                    </div>
                  </div>
                ) : (
                  <ol style={{ paddingLeft: '20px', margin: 0 }}>
                    {selectedTemplates.map((template, index) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: '12px',
                          color: colors?.text || '#333',
                          position: 'relative',
                          paddingRight: '60px',
                          lineHeight: '1.5'
                        }}
                      >
                        {template}
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveTemplate(index)}
                          style={{
                            position: 'absolute',
                            right: 0,
                            top: 0
                          }}
                        >
                          <i className="bi bi-x"></i>
                        </Button>
                      </li>
                    ))}
                  </ol>
                )}
              </div>

              {selectedTemplates.length > 0 && (
                <div className="mt-2">
                  <Badge bg="info">
                    已选择 {selectedTemplates.length} 条特殊要求
                  </Badge>
                </div>
              )}
            </div>
          ) : (
            <Form.Control
              as="textarea"
              rows={5}
              value={specialRequirements}
              onChange={(e) => {
                // 手动输入模式：解析文本为数组
                const lines = e.target.value.split('\n').filter(l => l.trim());
                dispatchTemplates({ type: TEMPLATE_ACTIONS.SET, payload: lines });
              }}
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
  );
};

export default SpecialRequirementsEditor;
