// src/components/MobileOptimization.js
// 移动端优化视图 - 移动端快捷入口与适配说明
import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, ListGroup, Alert } from 'react-bootstrap';

const QUICK_ACTIONS = [
  { key: 'selection', label: '快速选型', icon: 'bi-calculator', color: 'primary', desc: '输入功率转速快速匹配齿轮箱' },
  { key: 'query', label: '型号查询', icon: 'bi-search', color: 'info', desc: '按型号/系列查询技术参数' },
  { key: 'quotation', label: '报价查看', icon: 'bi-receipt', color: 'success', desc: '查看和管理报价单' },
  { key: 'history', label: '选型历史', icon: 'bi-clock-history', color: 'warning', desc: '查看历史选型记录' },
  { key: 'data', label: '数据查询', icon: 'bi-database', color: 'dark', desc: '浏览齿轮箱参数库' },
  { key: 'agreement', label: '技术协议', icon: 'bi-file-earmark-ruled', color: 'secondary', desc: '查看/生成技术协议' },
];

const MOBILE_FEATURES = [
  { feature: '响应式布局', status: 'done', desc: '所有页面自适应手机/平板屏幕' },
  { feature: '触控优化', status: 'done', desc: '按钮/表格增大触控区域' },
  { feature: '手势操作', status: 'done', desc: '支持左右滑动切换Tab' },
  { feature: '离线访问', status: 'partial', desc: '核心选型功能支持离线使用' },
  { feature: 'PWA安装', status: 'planned', desc: '支持添加到主屏幕' },
  { feature: '微信小程序', status: 'planned', desc: '独立微信小程序版本' },
];

const STATUS_CONFIG = {
  done: { label: '已完成', color: 'success' },
  partial: { label: '部分完成', color: 'warning' },
  planned: { label: '规划中', color: 'secondary' },
};

export default function MobileOptimization({ colors, theme, onNavigate }) {
  const [selectedAction, setSelectedAction] = useState(null);

  const handleNavigate = (key) => {
    const tabMap = {
      selection: 'input',
      query: 'data-query',
      quotation: 'quotation',
      history: 'history',
      data: 'data-query',
      agreement: 'agreement',
    };
    if (onNavigate && tabMap[key]) {
      onNavigate(tabMap[key]);
    }
  };

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-phone me-2"></i>移动端优化</h5>
          <small className="text-muted">移动设备快捷入口与功能适配状态</small>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col>
          <Alert variant="info" className="py-2">
            <i className="bi bi-info-circle me-1"></i>
            本系统支持移动端访问，以下为常用功能快捷入口。在手机上访问 <code>qj-gearbox.duckdns.org/gearbox-app</code> 体验移动端。
          </Alert>
        </Col>
      </Row>

      <Row className="mb-4">
        {QUICK_ACTIONS.map(a => (
          <Col key={a.key} xs={6} md={4} lg={2} className="mb-3">
            <Card className="text-center h-100" style={{ cursor: 'pointer' }} onClick={() => handleNavigate(a.key)}>
              <Card.Body className="py-3">
                <div className={`mb-2`}>
                  <i className={`bi ${a.icon} fs-1 text-${a.color}`}></i>
                </div>
                <h6>{a.label}</h6>
                <small className="text-muted">{a.desc}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Row>
        <Col md={6}>
          <Card>
            <Card.Header>移动端功能适配进度</Card.Header>
            <ListGroup variant="flush">
              {MOBILE_FEATURES.map((f, i) => {
                const s = STATUS_CONFIG[f.status];
                return (
                  <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>{f.feature}</strong>
                      <br /><small className="text-muted">{f.desc}</small>
                    </div>
                    <Badge bg={s.color}>{s.label}</Badge>
                  </ListGroup.Item>
                );
              })}
            </ListGroup>
          </Card>
        </Col>

        <Col md={6}>
          <Card>
            <Card.Header>屏幕适配说明</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <strong><i className="bi bi-phone me-1"></i>手机 (&lt;576px)</strong>
                  <br /><small>单列布局，底部Tab导航，精简显示列</small>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong><i className="bi bi-tablet me-1"></i>平板 (576-992px)</strong>
                  <br /><small>双列布局，侧边栏可折叠</small>
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong><i className="bi bi-laptop me-1"></i>桌面 (&gt;992px)</strong>
                  <br /><small>完整布局，侧边栏固定，所有功能完整展示</small>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
