// src/components/PriceMaintenanceTool/OfficialPriceModal.js
// 官方价格导入模态框组件
import React from 'react';
import { Modal, Table, Form, Button, Alert, Spinner } from 'react-bootstrap';

/**
 * 官方价格导入模态框
 * 显示官方价格数据表格，支持选择性导入
 */
const OfficialPriceModal = ({
  show,
  onHide,
  officialPriceData,
  selectedOfficialItems,
  onToggleSelection,
  onSelectAll,
  onApply,
  loading
}) => {
  return (
    <Modal
      show={show}
      onHide={onHide}
      backdrop="static"
      size="lg"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>导入官方价格</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-3">
          <Alert variant="info">
            以下是从官方价格文档中提取的价格数据。请选择要应用的项目，然后点击"应用所选价格"。
          </Alert>
        </div>

        <div className="table-responsive" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th style={{ width: '50px' }}>
                  <Form.Check
                    type="checkbox"
                    onChange={(e) => onSelectAll(e.target.checked)}
                    checked={selectedOfficialItems.length === officialPriceData.length && officialPriceData.length > 0}
                  />
                </th>
                <th>型号</th>
                <th>基础价格 (元)</th>
                <th>出厂价格 (元)</th>
                <th>市场价格 (元)</th>
                <th>折扣率 (%)</th>
              </tr>
            </thead>
            <tbody>
              {officialPriceData.map((item, index) => (
                <tr key={`${item.model}-${index}`}>
                  <td>
                    <Form.Check
                      type="checkbox"
                      checked={selectedOfficialItems.includes(item.model)}
                      onChange={() => onToggleSelection(item.model)}
                    />
                  </td>
                  <td>{item.model}</td>
                  <td>{item.basePrice}</td>
                  <td>{item.factoryPrice || Math.round(item.basePrice * (1 - (item.discountRate || 0)))}</td>
                  <td>{item.marketPrice}</td>
                  <td>{((item.discountRate || 0) * 100).toFixed(0)}%</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
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
          onClick={onApply}
          disabled={loading || selectedOfficialItems.length === 0}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-1" />
              应用中...
            </>
          ) : (
            <>
              <i className="bi bi-check2-all me-1"></i>
              应用所选价格 ({selectedOfficialItems.length})
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OfficialPriceModal;
