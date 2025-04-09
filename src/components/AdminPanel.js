import React from 'react';
import { Card, Table, Button } from 'react-bootstrap';

const AdminPanel = ({ appData, setAppData, selectionHistory }) => {
  return (
    <div>
      <h2>管理面板</h2>

      <Card className="mb-4">
        <Card.Header>数据统计</Card.Header>
        <Card.Body>
          <Table striped bordered>
            <tbody>
              {Object.entries(appData)
                .filter(([key, value]) => Array.isArray(value))
                .map(([key, value]) => (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value.length}条记录</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Card className="mb-4">
        <Card.Header>选型历史</Card.Header>
        <Card.Body>
          <Table striped bordered>
            <thead>
              <tr>
                <th>时间</th>
                <th>齿轮箱类型</th>
                <th>功率</th>
                <th>转速</th>
                <th>选型结果</th>
              </tr>
            </thead>
            <tbody>
              {selectionHistory.map((record, index) => (
                <tr key={index}>
                  <td>{new Date(record.timestamp).toLocaleString()}</td>
                  <td>{record.gearboxType}</td>
                  <td>{record.engineData.power} kW</td>
                  <td>{record.engineData.speed} rpm</td>
                  <td>{record.result.gearbox.model}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminPanel; 