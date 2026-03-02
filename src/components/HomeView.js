// src/components/HomeView.js
// Home Dashboard - system overview and quick navigation

import React, { useMemo } from 'react';
import { Card, Row, Col, Button, Badge } from 'react-bootstrap';

const HomeView = ({ appData, colors, theme, onNavigate, selectionHistory = [] }) => {
  // Calculate data overview stats
  const stats = useMemo(() => {
    if (!appData) return { totalModels: 0, series: [], couplings: 0, pumps: 0 };

    const seriesKeys = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes'];
    const series = seriesKeys
      .filter(key => Array.isArray(appData[key]) && appData[key].length > 0)
      .map(key => ({
        name: key.replace('Gearboxes', '').toUpperCase(),
        count: appData[key].length
      }));

    const totalModels = series.reduce((sum, s) => sum + s.count, 0);
    const couplings = Array.isArray(appData.flexibleCouplings) ? appData.flexibleCouplings.length : 0;
    const pumps = Array.isArray(appData.standbyPumps) ? appData.standbyPumps.length : 0;

    return { totalModels, series, couplings, pumps };
  }, [appData]);

  // Recent history (last 5)
  const recentHistory = useMemo(() => {
    try {
      const stored = localStorage.getItem('selectionHistory');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          return parsed.slice(0, 5);
        }
      }
    } catch (e) {
      // ignore
    }
    return selectionHistory.slice(0, 5);
  }, [selectionHistory]);

  const cardStyle = {
    backgroundColor: colors?.card,
    borderColor: colors?.border,
    color: colors?.text,
  };

  const headerStyle = {
    backgroundColor: colors?.headerBg,
    color: colors?.headerText,
    borderBottomColor: colors?.border,
  };

  const quickLinks = [
    { key: 'input', icon: 'bi-input-cursor-text', label: '齿轮箱选型', desc: '输入参数开始选型', variant: 'primary' },
    { key: 'quotation', icon: 'bi-currency-yen', label: '报价单', desc: '查看或生成报价', variant: 'success' },
    { key: 'agreement', icon: 'bi-file-earmark-text', label: '技术协议', desc: '生成技术协议文档', variant: 'info' },
    { key: 'batch', icon: 'bi-list-task', label: '批量选型', desc: '批量处理多组参数', variant: 'warning' },
  ];

  return (
    <div style={{ padding: '0 8px' }}>
      {/* Welcome */}
      <Card className="mb-4 shadow-sm" style={cardStyle}>
        <Card.Body className="py-4 text-center">
          <h4 style={{ color: colors?.primary, marginBottom: 8 }}>
            <i className="bi bi-gear-wide-connected me-2"></i>
            船用齿轮箱选型系统
          </h4>
          <p style={{ color: colors?.muted, marginBottom: 0 }}>
            覆盖 HC / GW / HCM / DT / HCQ / GC 全系列，支持智能选型、报价、技术协议一站式服务
          </p>
        </Card.Body>
      </Card>

      {/* Data Overview */}
      <Row className="mb-4">
        <Col xs={6} md={3} className="mb-3">
          <Card style={cardStyle} className="text-center h-100">
            <Card.Body>
              <h2 style={{ color: colors?.primary, fontWeight: 700 }}>{stats.totalModels}</h2>
              <small style={{ color: colors?.muted }}>齿轮箱型号</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card style={cardStyle} className="text-center h-100">
            <Card.Body>
              <h2 style={{ color: colors?.primary, fontWeight: 700 }}>{stats.series.length}</h2>
              <small style={{ color: colors?.muted }}>产品系列</small>
              <div className="mt-1">
                {stats.series.map(s => (
                  <Badge key={s.name} bg="secondary" className="me-1" style={{ fontSize: '0.7rem' }}>
                    {s.name}: {s.count}
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card style={cardStyle} className="text-center h-100">
            <Card.Body>
              <h2 style={{ color: colors?.primary, fontWeight: 700 }}>{stats.couplings}</h2>
              <small style={{ color: colors?.muted }}>联轴器型号</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3} className="mb-3">
          <Card style={cardStyle} className="text-center h-100">
            <Card.Body>
              <h2 style={{ color: colors?.primary, fontWeight: 700 }}>{stats.pumps}</h2>
              <small style={{ color: colors?.muted }}>备用泵型号</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Links */}
      <Card className="mb-4 shadow-sm" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-lightning-charge me-2"></i>快速入口
        </Card.Header>
        <Card.Body>
          <Row>
            {quickLinks.map(link => (
              <Col key={link.key} xs={6} md={3} className="mb-3">
                <Button
                  variant={`outline-${link.variant}`}
                  className="w-100 py-3"
                  onClick={() => onNavigate(link.key)}
                  style={{ textAlign: 'center' }}
                >
                  <i className={`bi ${link.icon} d-block mb-1`} style={{ fontSize: '1.5rem' }}></i>
                  <strong>{link.label}</strong>
                  <small className="d-block mt-1" style={{ opacity: 0.7 }}>{link.desc}</small>
                </Button>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>

      {/* Recent History */}
      <Card className="mb-4 shadow-sm" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <div className="d-flex justify-content-between align-items-center">
            <span><i className="bi bi-clock-history me-2"></i>最近选型记录</span>
            <Button variant="link" size="sm" onClick={() => onNavigate('history')} style={{ color: colors?.primary }}>
              查看全部
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {recentHistory.length > 0 ? (
            <div>
              {recentHistory.map((item, index) => (
                <div
                  key={item.id || index}
                  className="d-flex justify-content-between align-items-center py-2"
                  style={{ borderBottom: index < recentHistory.length - 1 ? `1px solid ${colors?.border}` : 'none' }}
                >
                  <div>
                    <strong style={{ color: colors?.text }}>{item.projectName || item.model || '未命名'}</strong>
                    <small className="d-block" style={{ color: colors?.muted }}>
                      {item.model && `型号: ${item.model}`}
                      {item.power && ` | ${item.power}kW`}
                      {item.speed && ` / ${item.speed}rpm`}
                    </small>
                  </div>
                  <small style={{ color: colors?.muted }}>
                    {item.timestamp ? new Date(item.timestamp).toLocaleDateString() : '-'}
                  </small>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3" style={{ color: colors?.muted }}>
              <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
              暂无选型记录
            </div>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default HomeView;
