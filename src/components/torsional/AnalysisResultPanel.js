/**
 * 分析结果面板组件
 * 展示扭振分析的完整结果，包括系统特性、临界转速表格和图表
 */
import React from 'react';
import { Card, Alert, Row, Col, Badge } from 'react-bootstrap';
import CriticalSpeedTable from './CriticalSpeedTable';
import TorsionalChart from './TorsionalChart';
import FormulaProvenance from '../common/FormulaProvenance';
import { getStandard } from '../../data/torsionalStandardsDB';

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

      {/* 总体状态 + 当前选用规范溯源 (P0-2 / P0-3) */}
      {(() => {
        const stdCode = result.standardCode;
        const std = stdCode ? getStandard(stdCode) : null;
        const tv = std?.torsionalVibration;
        const isM51 = stdCode === 'IACS_UR_M51';
        return (
          <Alert variant={isValid ? 'success' : 'danger'} className="mb-3">
            <strong>校核结果: </strong>
            {isValid ? (
              <Badge bg="success">通过 - 工作转速已避开所有临界转速共振区间</Badge>
            ) : (
              <Badge bg="danger">未通过 - 存在共振风险，请调整工作转速或轴系参数</Badge>
            )}
            {std && (
              <span className="ms-2" style={{ fontSize: '0.78em', color: '#666' }}>
                依据 <strong>{std.name}</strong>
                {isM51 && ' (IACS 统一要求)'}
                <FormulaProvenance
                  title={isM51 ? 'IACS UR M51 扭振校核' : '扭振共振避让校核'}
                  formula={
                    `共振避让带宽: ${tv?.forbiddenZone ? `${tv.forbiddenZone.min}–${tv.forbiddenZone.max} × n_cr` : '0.85–1.05 × n_cr'}\n` +
                    `工作裕度: ε ≥ ${tv?.operatingMargin ?? 0.10} (continuous)` +
                    (tv?.transientMargin ? ` / ε ≥ ${tv.transientMargin} (transient)` : '') +
                    `\n中间轴许用应力: ${tv?.allowableStress?.intermediate?.formula || 'tau_c = 18 + Rm/36'}` +
                    (tv?.allowableStress?.intermediate?.continuousLimitMPa
                      ? `\n应力限值参考: τ_c ≈ ${tv.allowableStress.intermediate.continuousLimitMPa} MPa, τ_t ≈ ${tv.allowableStress.intermediate.transientLimitMPa} MPa`
                      : '')
                  }
                  standard={std.fullName}
                  section={isM51 ? 'UR M51 §3.2 / §4.1' : (std.code.startsWith('CCS') ? 'CCS 第 3 篇 第 3 章' : '见规范条文')}
                  notes={
                    isM51
                      ? '所有 IACS 成员船级社(CCS/DNV/LR/ABS/BV/RINA/NK/KR) 共同认可的统一基线;通常与 UR M53(曲轴疲劳)、UR M68(止推) 协同校核。'
                      : '临界转速由 Holzer 法或传递矩阵法求解;ε 定义为转速差与临界转速之比。'
                  }
                  placement="left"
                />
              </span>
            )}
          </Alert>
        );
      })()}

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
                  {result.gearRatio > 1 && (
                    <tr>
                      <td className="fw-bold">输出转速:</td>
                      <td>{result.outputSpeed?.toFixed(0) || '-'} rpm (i={result.gearRatio}, i²={((result.gearRatio||1)**2).toFixed(2)})</td>
                    </tr>
                  )}
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
                naturalFrequencyHz={naturalFrequency ? parseFloat(naturalFrequency.frequency) : 0}
                gearRatio={result.gearRatio || 1}
                barredSpeedRanges={result.barredSpeedRanges || []}
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
