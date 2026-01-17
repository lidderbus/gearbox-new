// src/components/DatabaseManagementView/ExportModal.js
// Export data modal component
import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

/**
 * Export modal component
 */
const ExportModal = ({
  show,
  onHide,
  exportFormat,
  onFormatChange,
  exportFilename,
  onFilenameChange,
  exportOptions,
  onOptionsChange,
  onConfirm
}) => {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>导出数据库</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>导出格式</Form.Label>
            <div>
              <Form.Check
                inline
                type="radio"
                name="exportFormat"
                id="export-json"
                label="JSON 格式"
                checked={exportFormat === 'json'}
                onChange={() => onFormatChange('json')}
              />
              <Form.Check
                inline
                type="radio"
                name="exportFormat"
                id="export-excel"
                label="Excel 格式"
                checked={exportFormat === 'excel'}
                onChange={() => onFormatChange('excel')}
              />
            </div>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>文件名</Form.Label>
            <Form.Control
              type="text"
              value={exportFilename}
              onChange={(e) => onFilenameChange(e.target.value)}
              placeholder="gearbox-data"
            />
            <Form.Text className="text-muted">
              文件扩展名将自动添加，无需输入
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>导出内容</Form.Label>
            <div>
              <Form.Check
                type="checkbox"
                id="export-gearboxes"
                label="包含齿轮箱数据"
                checked={exportOptions.includeGearboxes}
                onChange={(e) => onOptionsChange({ ...exportOptions, includeGearboxes: e.target.checked })}
              />
              <Form.Check
                type="checkbox"
                id="export-couplings"
                label="包含联轴器数据"
                checked={exportOptions.includeCouplings}
                onChange={(e) => onOptionsChange({ ...exportOptions, includeCouplings: e.target.checked })}
              />
              <Form.Check
                type="checkbox"
                id="export-pumps"
                label="包含备用泵数据"
                checked={exportOptions.includePumps}
                onChange={(e) => onOptionsChange({ ...exportOptions, includePumps: e.target.checked })}
              />
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          取消
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          确认导出
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportModal;
