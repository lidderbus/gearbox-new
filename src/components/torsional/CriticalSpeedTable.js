/**
 * 临界转速校核表格组件
 * 显示各阶激励的临界转速和避开校核结果
 */
import React from 'react';
import { Table, Badge } from 'react-bootstrap';

const CriticalSpeedTable = ({ avoidanceChecks = [], colors = {}, theme = 'light' }) => {
  if (!avoidanceChecks || avoidanceChecks.length === 0) {
    return (
      <div className="text-muted text-center py-3">
        暂无临界转速数据
      </div>
    );
  }

  const tableStyle = {
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
    color: colors.text || (theme === 'dark' ? '#fff' : '#333')
  };

  const getDangerRowStyle = (inDangerZone) => {
    if (!inDangerZone) return {};
    return {
      backgroundColor: theme === 'dark' ? 'rgba(220, 53, 69, 0.2)' : 'rgba(220, 53, 69, 0.1)',
      fontWeight: 'bold'
    };
  };

  return (
    <div className="critical-speed-table">
      <h6 className="mb-2" style={{ color: colors.headerText || colors.text }}>
        临界转速校核
      </h6>

      <Table
        bordered
        hover
        size="sm"
        className="mb-0"
        style={tableStyle}
      >
        <thead>
          <tr style={{ backgroundColor: colors.headerBg || '#f8f9fa' }}>
            <th style={{ color: colors.headerText }}>激励阶次</th>
            <th style={{ color: colors.headerText }}>临界转速 (rpm)</th>
            <th style={{ color: colors.headerText }}>危险区间 (rpm)</th>
            <th style={{ color: colors.headerText }}>工作转速 (rpm)</th>
            <th style={{ color: colors.headerText }}>余量 (%)</th>
            <th style={{ color: colors.headerText }}>状态</th>
          </tr>
        </thead>
        <tbody>
          {avoidanceChecks.map((check, index) => (
            <tr key={index} style={getDangerRowStyle(check.inDangerZone)}>
              <td>{check.order}阶</td>
              <td>{check.criticalSpeed}</td>
              <td>{check.lowerLimit} ~ {check.upperLimit}</td>
              <td>{check.operatingSpeed}</td>
              <td>
                {check.inDangerZone ? (
                  <span className="text-danger">0</span>
                ) : (
                  <span className="text-success">{check.margin}</span>
                )}
              </td>
              <td>
                {check.inDangerZone ? (
                  <Badge bg="danger">
                    在共振区间
                  </Badge>
                ) : (
                  <Badge bg="success">
                    已避开
                  </Badge>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <small className="text-muted d-block mt-1">
        工作转速应避开临界转速的0.8~1.2倍区间
      </small>
    </div>
  );
};

export default CriticalSpeedTable;
