/**
 * 分析结果面板组件
 * 展示扭振分析的完整结果，包括系统特性、临界转速表格和图表
 */
import React from 'react';
import { Card, Alert, Row, Col, Badge } from 'react-bootstrap';
import CriticalSpeedTable from './CriticalSpeedTable';
import TorsionalChart from './TorsionalChart';

const AnalysisResultPanel = ({ result, colors = {}, theme = 'light' }) => {
  if (!result) {
    return (
      <div className="text-muted text-center py-5">
        请先执行扭振分析
      </div>
    );
  }

  const {
    equivalentStiffness,
    totalInertia,
    naturalFrequency,
    criticalSpeeds,
    avoidanceChecks,
    isValid,
    warnings,
    input
  } = result;

  const cardStyle = {
    backgroundColor: theme === 'dark' ? '#2d2d2d' : '#fff',
    borderColor: colors.border || '#dee2e6'
  };

  const textStyle = {
    color: colors.text || (theme === 'dark' ? '#fff' : '#333')
  };

  return (
    <div className="analysis-result-panel">
      {/* 警告信息 */}
      {warnings && warnings.length > 0 && (
        <Alert variant="danger" className="mb-3">
          <Alert.Heading>
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            共振风险警告
          </Alert.Heading>
          <ul className="mb-0">
            {warnings.map((warning, index) => (
              <li key={index}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}

      {/* 总体状态 */}
      <Alert variant={isValid ? 'success' : 'danger'} className="mb-3">
        <strong>校核结果: </strong>
        {isValid ? (
          <Badge bg="success">通过 - 工作转速已避开所有临界转速共振区间</Badge>
        ) : (
          <Badge bg="danger">未通过 - 存在共振风险，请调整工作转速或轴系参数</Badge>
        )}
      </Alert>

      {/* 系统特性卡片 */}
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          系统特性参数
        </Card.Header>
        <Card.Body>
          <Row>
            <Col md={6}>
              <table className="table table-sm table-borderless mb-0" style={textStyle}>
                <tbody>
                  <tr>
                    <td className="fw-bold" style={{ width: '40%' }}>等效刚度:</td>
                    <td>{equivalentStiffness} N·m/rad</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">总惯量:</td>
                    <td>{totalInertia} kg·m²</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">工作转速:</td>
                    <td>{input?.operatingSpeed || 0} rpm</td>
                  </tr>
                </tbody>
              </table>
            </Col>
            <Col md={6}>
              <table className="table table-sm table-borderless mb-0" style={textStyle}>
                <tbody>
                  <tr>
                    <td className="fw-bold" style={{ width: '40%' }}>固有频率:</td>
                    <td>{naturalFrequency?.frequency || 0} Hz</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">角频率:</td>
                    <td>{naturalFrequency?.omega || 0} rad/s</td>
                  </tr>
                  <tr>
                    <td className="fw-bold">节点位置:</td>
                    <td>{naturalFrequency?.nodePosition || '-'}</td>
                  </tr>
                </tbody>
              </table>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 临界转速表格和图表 */}
      <Row>
        <Col lg={6} className="mb-3">
          <Card style={cardStyle}>
            <Card.Body>
              <CriticalSpeedTable
                avoidanceChecks={avoidanceChecks}
                colors={colors}
                theme={theme}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} className="mb-3">
          <Card style={cardStyle}>
            <Card.Body>
              <TorsionalChart
                criticalSpeeds={criticalSpeeds}
                operatingSpeed={input?.operatingSpeed || 0}
                avoidanceChecks={avoidanceChecks}
                colors={colors}
                theme={theme}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 分析时间戳 */}
      <small className="text-muted">
        分析时间: {result.timestamp ? new Date(result.timestamp).toLocaleString() : '-'}
      </small>
    </div>
  );
};

export default AnalysisResultPanel;
