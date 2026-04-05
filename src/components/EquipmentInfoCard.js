// src/components/EquipmentInfoCard.js
// 配套设备信息卡 — 联轴器/备用泵可视化展示
import React from 'react';
import { Card, Badge, Row, Col } from 'react-bootstrap';

/**
 * 设备信息卡片组件
 * 以可视化方式展示联轴器或备用泵的关键参数
 *
 * @param {Object} props
 * @param {'coupling'|'pump'} props.type - 设备类型
 * @param {Object} props.data - 设备数据 (flexibleCoupling 或 standbyPump 对象)
 * @param {boolean} [props.compact=false] - 紧凑模式 (用于批量选型表格)
 */
export default function EquipmentInfoCard({ type, data, compact = false }) {
  if (!data || !data.model) return null;

  if (type === 'coupling') {
    return (
      <Card className={`border-info ${compact ? '' : 'mb-2'}`} style={compact ? { border: '1px solid #0dcaf0' } : undefined}>
        <Card.Body className={compact ? 'py-2 px-3' : ''}>
          <div className="d-flex align-items-center mb-2">
            <div
              className="rounded-circle bg-info bg-opacity-10 d-flex align-items-center justify-content-center me-2"
              style={{ width: 40, height: 40, minWidth: 40 }}
            >
              <i className="bi bi-gear-wide-connected text-info fs-5"></i>
            </div>
            <div>
              <strong>{data.model}</strong>
              {data.matchType && (
                <Badge
                  bg={data.torqueMargin >= 15 && data.torqueMargin <= 50 ? 'success' : data.torqueMargin > 50 ? 'info' : 'warning'}
                  className="ms-2"
                  style={{ fontSize: '0.7em' }}
                >
                  {data.torqueMargin >= 15 && data.torqueMargin <= 50 ? '适配' : data.torqueMargin > 50 ? '充裕' : '偏紧'}
                </Badge>
              )}
              <div className="small text-muted">{data.type || '高弹性联轴器'}</div>
            </div>
          </div>
          {!compact && (
            <Row className="g-2 small">
              {data.torque != null && (
                <Col xs={6}>
                  <div className="text-muted">额定扭矩</div>
                  <strong>{data.torque} {data.torqueUnit || 'kN\u00b7m'}</strong>
                </Col>
              )}
              {data.requiredTorque != null && (
                <Col xs={6}>
                  <div className="text-muted">所需扭矩</div>
                  <strong>{data.requiredTorque?.toFixed?.(3) || data.requiredTorque} kN&middot;m</strong>
                </Col>
              )}
              {data.maxSpeed != null && (
                <Col xs={6}>
                  <div className="text-muted">最高转速</div>
                  <strong>{data.maxSpeed} rpm</strong>
                </Col>
              )}
              {data.weight != null && (
                <Col xs={6}>
                  <div className="text-muted">重量</div>
                  <strong>{data.weight} kg</strong>
                </Col>
              )}
              {data.torqueMargin != null && (
                <Col xs={6}>
                  <div className="text-muted">扭矩余量</div>
                  <strong className={data.torqueMargin < 5 ? 'text-danger' : data.torqueMargin > 100 ? 'text-info' : 'text-success'}>
                    {data.torqueMargin?.toFixed?.(1) || data.torqueMargin}%
                  </strong>
                </Col>
              )}
              {(data.marketPrice || data.price) > 0 && (
                <Col xs={6}>
                  <div className="text-muted">参考价格</div>
                  <strong className="text-primary">&yen;{(data.marketPrice || data.price).toLocaleString()}</strong>
                </Col>
              )}
            </Row>
          )}
        </Card.Body>
      </Card>
    );
  }

  // Pump type
  const isElectric = data.type === 'electric' || data.series === '2CYA';

  return (
    <Card className={`border-success ${compact ? '' : 'mb-2'}`} style={compact ? { border: '1px solid #198754' } : undefined}>
      <Card.Body className={compact ? 'py-2 px-3' : ''}>
        <div className="d-flex align-items-center mb-2">
          <div
            className="rounded-circle bg-success bg-opacity-10 d-flex align-items-center justify-content-center me-2"
            style={{ width: 40, height: 40, minWidth: 40 }}
          >
            <i className="bi bi-moisture text-success fs-5"></i>
          </div>
          <div>
            <strong>{data.model}</strong>
            {isElectric && (
              <Badge bg="primary" className="ms-2" style={{ fontSize: '0.7em' }}>电动泵</Badge>
            )}
            {data.matchType && (
              <Badge
                bg={data.matchType === '直接匹配' || data.matchType === '最佳匹配' ? 'success' :
                    data.matchType === '良好匹配' || data.matchType === '系列匹配' ? 'info' : 'warning'}
                className="ms-2"
                style={{ fontSize: '0.7em' }}
              >
                {data.matchType}
              </Badge>
            )}
            <div className="small text-muted">{isElectric ? '2CYA系列电动泵' : data.type || '齿轮泵'}</div>
          </div>
        </div>
        {!compact && (
          <Row className="g-2 small">
            {data.flow != null && (
              <Col xs={6}>
                <div className="text-muted">流量</div>
                <strong>{data.flow} L/min</strong>
              </Col>
            )}
            {data.pressure != null && (
              <Col xs={6}>
                <div className="text-muted">压力</div>
                <strong>{data.pressure} MPa</strong>
              </Col>
            )}
            {data.motorPower != null && (
              <Col xs={6}>
                <div className="text-muted">电机功率</div>
                <strong>{data.motorPower} kW</strong>
              </Col>
            )}
            {data.weight != null && (
              <Col xs={6}>
                <div className="text-muted">重量</div>
                <strong>{data.weight} kg</strong>
              </Col>
            )}
            {(data.marketPrice || data.price) > 0 && (
              <Col xs={12}>
                <div className="text-muted">参考价格</div>
                <strong className="text-primary">&yen;{(data.marketPrice || data.price).toLocaleString()}</strong>
              </Col>
            )}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
}
