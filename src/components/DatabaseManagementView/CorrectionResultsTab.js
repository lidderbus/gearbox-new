// src/components/DatabaseManagementView/CorrectionResultsTab.js
// Correction results tab component
import React from 'react';
import { Card, Badge, ListGroup } from 'react-bootstrap';

/**
 * Correction results tab component
 */
const CorrectionResultsTab = ({ correctionResults, dataCollections }) => {
  if (!correctionResults) {
    return (
      <Card className="shadow-sm">
        <Card.Body className="text-center py-5">
          <i className="bi bi-tools text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3 text-muted">请先点击"自动修正数据"按钮执行数据修正</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">数据修正结果</h5>
          <div>
            <Badge bg="warning" className="me-2">
              已修正: {correctionResults.corrected}
            </Badge>
            <Badge bg="secondary">
              未变更: {correctionResults.unchanged}
            </Badge>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {correctionResults.details && correctionResults.details.length > 0 ? (
          <div>
            <h6 className="mb-3">修正详情</h6>
            <ListGroup>
              {correctionResults.details.map((item, index) => (
                <ListGroup.Item key={index} className="border-start border-warning border-4">
                  <div className="fw-bold">
                    {dataCollections.find(c => c.key === item.type)?.name || item.type} -
                    {item.model || `项目 #${item.originalIndex !== undefined ? item.originalIndex + 1 : index + 1}`}
                  </div>
                  <ul className="mb-0 ps-3">
                    {item.corrections.map((correction, i) => (
                      <li key={i}>{correction}</li>
                    ))}
                  </ul>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        ) : (
          <div className="text-center py-4">
            <i className="bi bi-emoji-smile text-success" style={{ fontSize: '2rem' }}></i>
            <p className="mt-2 text-success">所有数据已是最优状态，无需修正，或未执行修正操作</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default CorrectionResultsTab;
