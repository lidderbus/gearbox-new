// src/components/DatabaseManagementView/ImportHistoryTab.js
// Import history tab component
import React from 'react';
import { Card, Table } from 'react-bootstrap';

/**
 * Import history tab component
 */
const ImportHistoryTab = ({ importHistory }) => {
  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <h5 className="mb-0">数据导入历史</h5>
      </Card.Header>
      <Card.Body>
        {importHistory.length > 0 ? (
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th>时间</th>
                <th>来源</th>
                <th>导入数据</th>
                <th>总项目数</th>
              </tr>
            </thead>
            <tbody>
              {importHistory.map((entry, index) => (
                <tr key={entry.id}>
                  <td>{index + 1}</td>
                  <td>{new Date(entry.timestamp).toLocaleString()}</td>
                  <td>
                    {entry.source?.type === 'file'
                      ? `文件导入: ${entry.source.files.join(', ')}`
                      : entry.source?.type === 'paste'
                      ? '文本粘贴导入'
                      : entry.source?.type === 'gearbox'
                      ? '齿轮箱专业导入'
                      : '未知来源'}
                  </td>
                  <td>
                    {entry.collections.map(c => `${c.name}(${c.count})`).join(', ')}
                  </td>
                  <td>{entry.totalItems}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <div className="text-center py-4">
            <i className="bi bi-clock-history text-muted" style={{ fontSize: '2rem' }}></i>
            <p className="mt-2 text-muted">暂无导入历史记录</p>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default ImportHistoryTab;
