// src/components/PriceMaintenanceTool/PriceHistoryModal.js
// 价格变更历史模态框组件
import React from 'react';
import { Modal, Row, Col, Alert, Table, Badge, Button } from 'react-bootstrap';

/**
 * 价格变更历史模态框
 * 显示历史记录列表和选中记录的详细变更
 */
const PriceHistoryModal = ({
  show,
  onHide,
  priceHistory,
  selectedHistoryEntry,
  onSelectEntry
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
        <Modal.Title>价格变更历史</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col md={selectedHistoryEntry ? 5 : 12}>
            <div className="mb-3">
              <h6>历史记录列表</h6>
              {priceHistory.length === 0 ? (
                <Alert variant="info">
                  没有找到价格变更历史记录。
                </Alert>
              ) : (
                <div className="list-group" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                  {priceHistory.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className={`list-group-item list-group-item-action ${selectedHistoryEntry?.id === entry.id ? 'active' : ''}`}
                      onClick={() => onSelectEntry(entry)}
                    >
                      <div className="d-flex w-100 justify-content-between">
                        <h6 className="mb-1">{entry.reason || '价格变更'}</h6>
                        <small>{new Date(entry.timestamp).toLocaleString()}</small>
                      </div>
                      <p className="mb-1">
                        变更 {entry.itemCount} 个产品的价格
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </Col>

          {selectedHistoryEntry && (
            <Col md={7}>
              <div className="mb-3">
                <h6>变更详情</h6>
                <div className="border p-3 mb-3 rounded">
                  <p className="mb-1"><strong>变更时间:</strong> {new Date(selectedHistoryEntry.timestamp).toLocaleString()}</p>
                  <p className="mb-1"><strong>变更原因:</strong> {selectedHistoryEntry.reason || '未指定'}</p>
                  <p className="mb-0"><strong>变更数量:</strong> {selectedHistoryEntry.itemCount} 个产品</p>
                </div>

                <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>型号</th>
                        <th>基础价格变化</th>
                        <th>市场价格变化</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedHistoryEntry.changes.map((change, index) => (
                        <tr key={index}>
                          <td>{change.model}</td>
                          <td>
                            {change.oldBasePrice !== null ? (
                              <>
                                {change.oldBasePrice} → {change.newBasePrice}
                                {change.oldBasePrice && change.newBasePrice && (
                                  <Badge
                                    bg={change.newBasePrice > change.oldBasePrice ? 'danger' : change.newBasePrice < change.oldBasePrice ? 'success' : 'secondary'}
                                    className="ms-2"
                                  >
                                    {change.newBasePrice > change.oldBasePrice ? '+' : ''}
                                    {Math.round((change.newBasePrice - change.oldBasePrice) / change.oldBasePrice * 100)}%
                                  </Badge>
                                )}
                              </>
                            ) : change.newBasePrice ? (
                              <Badge bg="primary">新增</Badge>
                            ) : (
                              <Badge bg="danger">删除</Badge>
                            )}
                          </td>
                          <td>
                            {change.oldMarketPrice !== null ? (
                              <>
                                {change.oldMarketPrice} → {change.newMarketPrice}
                                {change.oldMarketPrice && change.newMarketPrice && (
                                  <Badge
                                    bg={change.newMarketPrice > change.oldMarketPrice ? 'danger' : change.newMarketPrice < change.oldMarketPrice ? 'success' : 'secondary'}
                                    className="ms-2"
                                  >
                                    {change.newMarketPrice > change.oldMarketPrice ? '+' : ''}
                                    {Math.round((change.newMarketPrice - change.oldMarketPrice) / change.oldMarketPrice * 100)}%
                                  </Badge>
                                )}
                              </>
                            ) : change.newMarketPrice ? (
                              <Badge bg="primary">新增</Badge>
                            ) : (
                              <Badge bg="danger">删除</Badge>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </Col>
          )}
        </Row>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={onHide}
        >
          关闭
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PriceHistoryModal;
