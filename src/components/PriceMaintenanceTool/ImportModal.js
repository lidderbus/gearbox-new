// src/components/PriceMaintenanceTool/ImportModal.js
// 价格数据导入模态框组件
import React from 'react';
import { Modal, Form, Button, Spinner } from 'react-bootstrap';

/**
 * 价格数据导入模态框
 * 支持 CSV 和 JSON 格式导入
 */
const ImportModal = ({
  show,
  onHide,
  importType,
  setImportType,
  importText,
  setImportText,
  onImportCSV,
  onImportJSON,
  loading,
  colors = {}
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>导入价格数据</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h6>导入格式</h6>
          <Form.Check
            inline
            type="radio"
            label="CSV格式"
            name="importType"
            id="import-csv"
            checked={importType === 'csv'}
            onChange={() => setImportType('csv')}
          />
          <Form.Check
            inline
            type="radio"
            label="JSON格式"
            name="importType"
            id="import-json"
            checked={importType === 'json'}
            onChange={() => setImportType('json')}
          />
        </div>

        <Form.Group className="mb-3">
          <Form.Label>{importType === 'csv' ? 'CSV内容' : 'JSON内容'}</Form.Label>
          <Form.Control
            as="textarea"
            rows={10}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            style={{
              backgroundColor: colors.inputBg,
              color: colors.text,
              borderColor: colors.inputBorder,
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}
          />
          <Form.Text className="text-muted">
            {importType === 'csv'
              ? 'CSV格式需要包含表头行，且至少包含model字段和价格字段'
              : 'JSON格式应为对象数组，每个对象至少包含model字段和价格字段'}
          </Form.Text>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
          disabled={loading}
        >
          取消
        </Button>
        <Button
          variant="primary"
          onClick={importType === 'csv' ? onImportCSV : onImportJSON}
          disabled={loading || !importText.trim()}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
              导入中...
            </>
          ) : (
            <>
              <i className="bi bi-check-lg me-1"></i>
              确认导入
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportModal;
