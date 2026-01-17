// src/components/DatabaseManagementView/ValidationResultsTab.js
// Validation results tab component
import React from 'react';
import { Card, Badge, Tabs, Tab, Table, ListGroup } from 'react-bootstrap';

/**
 * Validation results tab component
 */
const ValidationResultsTab = ({ validationResults, dataCollections }) => {
  if (!validationResults) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <i className="bi bi-clipboard-check text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3 text-muted">请先点击"验证数据"按钮执行数据验证</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">数据验证结果</h5>
          <div>
            <Badge bg="success" className="me-2">
              有效: {validationResults.summary.valid}
            </Badge>
            <Badge bg="danger" className="me-2">
              无效: {validationResults.summary.invalid}
            </Badge>
            <Badge bg="warning">
              警告: {validationResults.summary.warnings}
            </Badge>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <Tabs defaultActiveKey="summary" className="mb-3">
          <Tab eventKey="summary" title="摘要">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>数据集合</th>
                  <th>总项目数</th>
                  <th>有效项目</th>
                  <th>无效项目</th>
                  <th>警告数</th>
                  <th>状态</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(validationResults.details).map(([key, detail]) => (
                  <tr key={key}>
                    <td>{dataCollections.find(c => c.key === key)?.name || key}</td>
                    <td>{detail.total}</td>
                    <td className="text-success">{detail.valid}</td>
                    <td className="text-danger">{detail.invalid}</td>
                    <td className="text-warning">{detail.warnings}</td>
                    <td>
                      {detail.invalid > 0 ? (
                        <Badge bg="danger">存在问题</Badge>
                      ) : detail.warnings > 0 ? (
                        <Badge bg="warning">有警告</Badge>
                      ) : (
                        <Badge bg="success">正常</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Tab>

          <Tab eventKey="errors" title="错误详情">
            {Object.entries(validationResults.details).map(([key, detail]) => (
              detail.invalidItems && detail.invalidItems.length > 0 ? (
                <div key={key} className="mb-4">
                  <h6 className="border-bottom pb-2">
                    {dataCollections.find(c => c.key === key)?.name || key}
                    <Badge bg="danger" className="ms-2">{detail.invalidItems.length}个错误</Badge>
                  </h6>
                  <ListGroup variant="flush">
                    {detail.invalidItems.map((item, index) => (
                      <ListGroup.Item key={index} className="border-start border-danger border-4">
                        <div className="fw-bold text-danger">
                          {item.model || `项目 #${item.originalIndex !== undefined ? item.originalIndex + 1 : index + 1}`}
                        </div>
                        <ul className="mb-0 ps-3">
                          {item.errors.map((error, i) => (
                            <li key={i}>{error}</li>
                          ))}
                        </ul>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              ) : null
            ))}

            {Object.values(validationResults.details).every(detail =>
              !detail.invalidItems || detail.invalidItems.length === 0
            ) && (
              <div className="text-center py-4">
                <i className="bi bi-emoji-smile text-success" style={{ fontSize: '2rem' }}></i>
                <p className="mt-2 text-success">没有发现错误，所有数据有效</p>
              </div>
            )}
          </Tab>

          <Tab eventKey="warnings" title="警告详情">
            {Object.entries(validationResults.details).map(([key, detail]) => (
              detail.warningItems && detail.warningItems.length > 0 ? (
                <div key={key} className="mb-4">
                  <h6 className="border-bottom pb-2">
                    {dataCollections.find(c => c.key === key)?.name || key}
                    <Badge bg="warning" className="ms-2">{detail.warningItems.length}个警告</Badge>
                  </h6>
                  <ListGroup variant="flush">
                    {detail.warningItems.map((item, index) => (
                      <ListGroup.Item key={index} className="border-start border-warning border-4">
                        <div className="fw-bold text-warning">
                          {item.model || `项目 #${item.originalIndex !== undefined ? item.originalIndex + 1 : index + 1}`}
                        </div>
                        <ul className="mb-0 ps-3">
                          {item.warnings.map((warning, i) => (
                            <li key={i}>{warning}</li>
                          ))}
                        </ul>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </div>
              ) : null
            ))}

            {Object.values(validationResults.details).every(detail =>
              !detail.warningItems || detail.warningItems.length === 0
            ) && (
              <div className="text-center py-4">
                <i className="bi bi-emoji-smile text-success" style={{ fontSize: '2rem' }}></i>
                <p className="mt-2 text-success">没有发现警告，所有数据正常</p>
              </div>
            )}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default ValidationResultsTab;
