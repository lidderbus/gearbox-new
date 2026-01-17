// src/components/DatabaseManagementView/ImportModal.js
// Import data modal component
import React from 'react';
import { Modal, Button, Form, ListGroup, ProgressBar, Spinner } from 'react-bootstrap';

/**
 * Import modal component
 */
const ImportModal = ({
  show,
  onHide,
  importFiles,
  importOptions,
  onOptionChange,
  importProgress,
  importStatus,
  importErrorCount,
  isImporting,
  onImport
}) => {
  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>导入数据确认</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <h6>选中的文件 ({importFiles.length})</h6>
          <ListGroup style={{ maxHeight: '200px', overflowY: 'auto' }}>
            {importFiles.map((file, index) => (
              <ListGroup.Item key={index} className="d-flex align-items-center py-1">
                <i className={`bi bi-${file.name.endsWith('.json') ? 'filetype-json' : 'filetype-xlsx'} me-2`} style={{ fontSize: '1.2rem' }}></i>
                <div style={{ fontSize: '0.9rem' }}>
                  <div>{file.name}</div>
                  <small className="text-muted">{(file.size / 1024).toFixed(2)} KB</small>
                </div>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>

        <div className="mb-3">
          <h6>导入选项</h6>
          <Form>
            <Form.Check
              type="checkbox"
              id="mergeData"
              label="与现有数据合并（否则将替换）"
              checked={importOptions.mergeData}
              onChange={onOptionChange}
            />
            <Form.Check
              type="checkbox"
              id="validateBeforeImport"
              label="导入前验证数据有效性"
              checked={importOptions.validateBeforeImport}
              onChange={onOptionChange}
            />
            <Form.Check
              type="checkbox"
              id="autoCorrect"
              label="自动修正导入数据中的问题"
              checked={importOptions.autoCorrect}
              onChange={onOptionChange}
            />
          </Form>
        </div>

        {isImporting && (
          <div className="mb-3">
            <h6>导入进度</h6>
            <ProgressBar
              now={importProgress}
              label={`${importProgress}%`}
              variant={importProgress === 100 ? (importErrorCount > 0 ? "danger" : "success") : "primary"}
              animated={importProgress < 100}
              style={{ height: '20px' }}
            />
            <p className="mt-2 text-center text-muted small">{importStatus}</p>
          </div>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={isImporting}>
          取消
        </Button>
        <Button
          variant="primary"
          onClick={onImport}
          disabled={isImporting}
        >
          {isImporting ? (
            <>
              <Spinner as="span" size="sm" animation="border" className="me-2" />
              导入中...
            </>
          ) : (
            <>
              <i className="bi bi-upload me-2"></i>
              开始导入
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ImportModal;
