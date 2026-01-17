/**
 * Holzer表格显示组件
 *
 * 显示各阶固有频率的Holzer迭代计算结果
 * 格式与COMPASS报告一致
 *
 * @module HolzerTableDisplay
 */

import React, { useMemo } from 'react';
import { Card, Table, Badge, Row, Col, Alert } from 'react-bootstrap';
import { FiActivity, FiInfo } from 'react-icons/fi';

/**
 * Holzer表格显示组件
 *
 * @param {Object} props
 * @param {Object[]} props.naturalFrequencies - 固有频率结果数组
 * @param {Object[]} props.units - 单元数组
 * @param {Object} props.colors - 主题颜色
 * @param {string} props.theme - 主题模式
 */
const HolzerTableDisplay = ({
  naturalFrequencies = [],
  units = [],
  colors = {},
  theme = 'light'
}) => {
  // 主题样式
  const cardStyle = useMemo(() => ({
    backgroundColor: theme === 'dark' ? '#1e1e1e' : '#ffffff',
    borderColor: theme === 'dark' ? '#333' : '#dee2e6',
    color: theme === 'dark' ? '#e0e0e0' : '#212529'
  }), [theme]);

  // 格式化科学计数法
  const formatScientific = (value, decimals = 4) => {
    if (value === undefined || value === null || isNaN(value)) return '-';
    if (Math.abs(value) < 1e-10) return '0';

    const exp = Math.floor(Math.log10(Math.abs(value)));
    if (Math.abs(exp) > 3) {
      return value.toExponential(decimals);
    }
    return value.toFixed(decimals);
  };

  // 计算各阶次的共振转速
  const calculateResonanceSpeeds = (frequency, excitationOrders = [0.5, 1, 1.5, 2, 3, 4, 6]) => {
    return excitationOrders.map(order => ({
      order,
      resonanceSpeed: Math.round((frequency * 60) / order)
    }));
  };

  if (naturalFrequencies.length === 0) {
    return (
      <Alert variant="info">
        <FiInfo className="me-2" />
        请先执行自由振动分析以获取固有频率数据
      </Alert>
    );
  }

  return (
    <div className="holzer-table-display">
      {/* 汇总表 */}
      <Card style={cardStyle} className="mb-3">
        <Card.Header style={{ backgroundColor: colors.primary || '#3b82f6', color: '#fff' }}>
          <FiActivity className="me-2" />
          自由振动计算结果汇总
        </Card.Header>
        <Card.Body>
          <Table
            bordered
            hover
            size="sm"
            className={theme === 'dark' ? 'table-dark' : ''}
          >
            <thead>
              <tr className="text-center">
                <th>阶次</th>
                <th>固有频率 (Hz)</th>
                <th>固有频率 (1/min)</th>
                <th>角频率 (rad/s)</th>
                <th>主振型特征</th>
              </tr>
            </thead>
            <tbody>
              {naturalFrequencies.map((mode, index) => (
                <tr key={index} className="text-center">
                  <td>
                    <Badge bg={index === 0 ? 'primary' : 'secondary'}>
                      {mode.order || index + 1}阶
                    </Badge>
                  </td>
                  <td className="fw-bold">{mode.frequency?.toFixed(2) || '-'}</td>
                  <td>{mode.frequencyRpm?.toFixed(1) || '-'}</td>
                  <td>{mode.omega?.toFixed(2) || '-'}</td>
                  <td className="text-start small">
                    {mode.modeShape?.amplitudes ? (
                      <span>
                        节点位置: {findNodePositions(mode.modeShape.amplitudes)}
                      </span>
                    ) : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      {/* 各阶详细Holzer表 */}
      {naturalFrequencies.map((mode, modeIndex) => (
        <Card key={modeIndex} style={cardStyle} className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center">
            <div>
              <Badge bg="primary" className="me-2">{mode.order || modeIndex + 1}ST</Badge>
              阶固有频率 F = {mode.frequencyRpm?.toFixed(1) || '-'} 1/min
              ({mode.frequency?.toFixed(2) || '-'} Hz)
            </div>
            <Badge bg="info">
              ω = {mode.omega?.toFixed(2) || '-'} rad/s
            </Badge>
          </Card.Header>
          <Card.Body>
            <Row>
              {/* 振型数据表 */}
              <Col md={8}>
                <Table
                  striped
                  bordered
                  size="sm"
                  className={theme === 'dark' ? 'table-dark' : ''}
                  style={{ fontSize: '0.85rem' }}
                >
                  <thead>
                    <tr className="text-center">
                      <th style={{ width: '50px' }}>质量号</th>
                      <th>转动惯量<br />(kg.m²)</th>
                      <th>扭转柔度<br />(E-10 rad/N.m)</th>
                      <th>相对振幅</th>
                      <th>惯性力矩<br />(N.m)</th>
                      <th>累计扭矩<br />(N.m)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mode.modeShape?.holzerTable?.map((row, rowIndex) => (
                      <tr key={rowIndex} className="text-end">
                        <td className="text-center">{row.unitNumber}</td>
                        <td>{formatScientific(row.inertia, 4)}</td>
                        <td>{formatScientific(row.flexibility, 4)}</td>
                        <td className={getAmplitudeClass(row.amplitude)}>
                          {formatScientific(row.amplitude, 6)}
                        </td>
                        <td>{formatScientific(row.inertiaForce, 4)}</td>
                        <td>{formatScientific(row.cumulativeTorque, 4)}</td>
                      </tr>
                    )) || (
                      // 如果没有holzerTable，使用振幅数据生成简化表格
                      mode.modeShape?.amplitudes?.map((amp, i) => (
                        <tr key={i} className="text-end">
                          <td className="text-center">{units[i]?.unitNumber || i + 1}</td>
                          <td>{formatScientific(units[i]?.inertia, 4)}</td>
                          <td>{formatScientific(units[i]?.torsionalFlexibility, 4)}</td>
                          <td className={getAmplitudeClass(amp)}>
                            {formatScientific(amp, 6)}
                          </td>
                          <td>-</td>
                          <td>-</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </Col>

              {/* 共振转速表 */}
              <Col md={4}>
                <h6 className="text-muted mb-2">各谐次共振转速</h6>
                <Table
                  bordered
                  size="sm"
                  className={theme === 'dark' ? 'table-dark' : ''}
                  style={{ fontSize: '0.85rem' }}
                >
                  <thead>
                    <tr className="text-center">
                      <th>谐次</th>
                      <th>共振转速 (r/min)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculateResonanceSpeeds(mode.frequency).map((item, i) => (
                      <tr key={i} className="text-center">
                        <td>{item.order}</td>
                        <td className={isInOperatingRange(item.resonanceSpeed) ? 'table-warning' : ''}>
                          {item.resonanceSpeed}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>

            {/* 振型说明 */}
            {mode.modeShape?.amplitudes && (
              <Alert variant="light" className="mt-2 py-2 small">
                <strong>振型特征：</strong>
                {describeModeShape(mode.modeShape.amplitudes, units)}
              </Alert>
            )}
          </Card.Body>
        </Card>
      ))}

      {/* 图例说明 */}
      <Card style={cardStyle}>
        <Card.Body className="py-2">
          <Row className="small text-muted">
            <Col>
              <strong>符号说明：</strong>
            </Col>
            <Col>
              <span className="text-success">正值振幅</span> - 与参考方向同相
            </Col>
            <Col>
              <span className="text-danger">负值振幅</span> - 与参考方向反相
            </Col>
            <Col>
              <span className="bg-warning px-1">黄色标记</span> - 转速在常用工况范围内
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};

// ============================================================
// 辅助函数
// ============================================================

/**
 * 根据振幅值返回CSS类名
 */
function getAmplitudeClass(amplitude) {
  if (amplitude > 0.1) return 'text-success fw-bold';
  if (amplitude < -0.1) return 'text-danger fw-bold';
  return '';
}

/**
 * 判断转速是否在常用工况范围内
 */
function isInOperatingRange(speed, min = 500, max = 2000) {
  return speed >= min && speed <= max;
}

/**
 * 找出振型的节点位置
 */
function findNodePositions(amplitudes) {
  const nodes = [];

  for (let i = 0; i < amplitudes.length - 1; i++) {
    // 符号变化表示节点
    if (amplitudes[i] * amplitudes[i + 1] < 0) {
      // 线性插值估算节点位置
      const ratio = Math.abs(amplitudes[i]) /
        (Math.abs(amplitudes[i]) + Math.abs(amplitudes[i + 1]));
      nodes.push(`单元${i + 1}与${i + 2}之间(约${(ratio * 100).toFixed(0)}%)`);
    }
  }

  if (nodes.length === 0) {
    return '无节点（刚体模态）';
  }

  return nodes.join(', ');
}

/**
 * 描述振型特征
 */
function describeModeShape(amplitudes, units) {
  const maxAmp = Math.max(...amplitudes.map(Math.abs));
  const maxIndex = amplitudes.findIndex(a => Math.abs(a) === maxAmp);
  const maxUnit = units[maxIndex];

  const minAmp = Math.min(...amplitudes.map(Math.abs));
  const minIndex = amplitudes.findIndex(a => Math.abs(a) === minAmp);

  // 计算正负区域
  const positiveCount = amplitudes.filter(a => a > 0.1).length;
  const negativeCount = amplitudes.filter(a => a < -0.1).length;

  let description = `最大振幅位于${maxUnit?.name || `单元${maxIndex + 1}`}`;

  if (positiveCount > 0 && negativeCount > 0) {
    description += `，系统呈${positiveCount > negativeCount ? '同向为主' : '反向为主'}振动`;
  } else if (negativeCount === 0) {
    description += '，全系统同向振动（一阶弯曲型）';
  }

  return description;
}

export default HolzerTableDisplay;
