// src/components/PriceMaintenanceTool/BulkUpdatePanel.js
// 批量价格更新面板组件
import React from 'react';
import { Form, Row, Col, InputGroup, Button, Spinner } from 'react-bootstrap';

/**
 * 批量价格更新面板
 * 支持按百分比或固定金额批量调整价格
 */
const BulkUpdatePanel = ({
  bulkUpdateConfig,
  onConfigChange,
  priceFields,
  onBulkUpdate,
  loading,
  colors = {},
  theme = 'light'
}) => {
  return (
    <div className="p-4 border rounded" style={{ borderColor: colors.border }}>
      <h5 className="mb-3">批量价格调整</h5>

      <Form>
        <Row className="g-3">
          <Col md={3}>
            <Form.Group>
              <Form.Label>选择更新字段</Form.Label>
              <Form.Select
                value={bulkUpdateConfig.updateField}
                onChange={(e) => onConfigChange({...bulkUpdateConfig, updateField: e.target.value})}
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.inputBorder
                }}
              >
                {priceFields.map(field => (
                  <option key={field.value} value={field.value}>{field.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>调整方式</Form.Label>
              <Form.Select
                value={bulkUpdateConfig.method}
                onChange={(e) => onConfigChange({...bulkUpdateConfig, method: e.target.value})}
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.inputBorder
                }}
              >
                <option value="percentage">百分比</option>
                <option value="amount">固定金额</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>调整值</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  value={bulkUpdateConfig.value}
                  onChange={(e) => onConfigChange({...bulkUpdateConfig, value: e.target.value})}
                  placeholder={bulkUpdateConfig.method === 'percentage' ? "如10表示增加10%" : "如1000表示增加1000元"}
                  style={{
                    backgroundColor: colors.inputBg,
                    color: colors.text,
                    borderColor: colors.inputBorder
                  }}
                />
                <InputGroup.Text style={{
                  backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d3748',
                  color: colors.text,
                  borderColor: colors.inputBorder
                }}>
                  {bulkUpdateConfig.method === 'percentage' ? '%' : '元'}
                </InputGroup.Text>
              </InputGroup>
              <Form.Text className="text-muted">
                {bulkUpdateConfig.method === 'percentage'
                  ? '正值表示涨价，负值表示降价，例如: 10 表示价格上涨10%'
                  : '正值表示增加，负值表示减少，例如: 1000 表示增加1000元'}
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={3}>
            <Form.Group>
              <Form.Label>变更原因(可选)</Form.Label>
              <Form.Control
                type="text"
                value={bulkUpdateConfig.reason}
                onChange={(e) => onConfigChange({...bulkUpdateConfig, reason: e.target.value})}
                placeholder="如：市场调价、成本上涨等"
                style={{
                  backgroundColor: colors.inputBg,
                  color: colors.text,
                  borderColor: colors.inputBorder
                }}
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-flex justify-content-end mt-4">
          <Button
            variant="primary"
            onClick={onBulkUpdate}
            disabled={loading || !bulkUpdateConfig.value}
          >
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
                更新中...
              </>
            ) : (
              <>
                <i className="bi bi-check2-all me-1"></i>
                应用批量更新
              </>
            )}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default BulkUpdatePanel;
