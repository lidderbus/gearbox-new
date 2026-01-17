// src/components/AnalyticsDashboard.js
// 使用分析仪表盘 - 可视化展示 analytics.js 收集的统计数据

import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Button, Alert, Badge, Table, ProgressBar } from 'react-bootstrap';
import { Analytics, EVENTS } from '../utils/analytics';

// 事件类型的中文名称映射
const EVENT_LABELS = {
  [EVENTS.PAGE_VIEW]: '页面访问',
  [EVENTS.SELECTION_START]: '开始选型',
  [EVENTS.SELECTION_COMPLETE]: '完成选型',
  [EVENTS.SELECTION_ERROR]: '选型错误',
  [EVENTS.QUOTATION_CREATE]: '创建报价',
  [EVENTS.QUOTATION_EXPORT]: '导出报价',
  [EVENTS.AGREEMENT_CREATE]: '创建协议',
  [EVENTS.AGREEMENT_EXPORT]: '导出协议',
  [EVENTS.DATA_QUERY]: '数据查询',
  [EVENTS.DATA_EXPORT]: '数据导出',
  [EVENTS.FEATURE_USE]: '功能使用',
  [EVENTS.ERROR]: '错误'
};

/**
 * 简单的柱状图组件 (纯CSS实现)
 */
const SimpleBarChart = ({ data, maxHeight = 120 }) => {
  if (!data || data.length === 0) {
    return <div className="text-muted text-center py-4">暂无数据</div>;
  }

  const maxCount = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="d-flex align-items-end justify-content-around" style={{ height: maxHeight + 30 }}>
      {data.map((item, index) => (
        <div key={index} className="text-center" style={{ flex: 1, maxWidth: '14%' }}>
          <div
            className="bg-primary mx-1 rounded-top"
            style={{
              height: `${(item.count / maxCount) * maxHeight}px`,
              minHeight: item.count > 0 ? '4px' : '0',
              transition: 'height 0.3s ease'
            }}
            title={`${item.date}: ${item.count}次`}
          />
          <small className="text-muted d-block mt-1" style={{ fontSize: '0.7rem' }}>
            {item.date}
          </small>
          <small className="text-muted" style={{ fontSize: '0.65rem' }}>
            {item.count}
          </small>
        </div>
      ))}
    </div>
  );
};

/**
 * 统计卡片组件
 */
const StatCard = ({ title, value, icon, variant = 'primary', subtitle }) => (
  <Card className="h-100 shadow-sm">
    <Card.Body className="d-flex align-items-center">
      <div
        className={`rounded-circle bg-${variant} bg-opacity-10 p-3 me-3`}
        style={{ width: 56, height: 56, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <div>
        <h3 className="mb-0">{value}</h3>
        <small className="text-muted">{title}</small>
        {subtitle && <div className="text-muted" style={{ fontSize: '0.7rem' }}>{subtitle}</div>}
      </div>
    </Card.Body>
  </Card>
);

/**
 * 分析仪表盘主组件
 */
const AnalyticsDashboard = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  // 加载统计数据
  const loadData = useCallback(() => {
    setLoading(true);
    try {
      const data = Analytics.getSummary();
      setSummary(data);
    } catch (error) {
      setMessage({ type: 'danger', text: '加载统计数据失败: ' + error.message });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 导出数据
  const handleExport = useCallback(() => {
    try {
      const exportData = Analytics.export();
      if (exportData) {
        const blob = new Blob([exportData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `gearbox-analytics-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        setMessage({ type: 'success', text: '数据已导出' });
      }
    } catch (error) {
      setMessage({ type: 'danger', text: '导出失败: ' + error.message });
    }
  }, []);

  // 清除数据
  const handleClear = useCallback(() => {
    if (window.confirm('确定要清除所有统计数据吗？此操作不可恢复。')) {
      if (Analytics.clear()) {
        loadData();
        setMessage({ type: 'success', text: '数据已清除' });
      } else {
        setMessage({ type: 'danger', text: '清除失败' });
      }
    }
  }, [loadData]);

  // 刷新数据
  const handleRefresh = useCallback(() => {
    loadData();
    setMessage({ type: 'info', text: '数据已刷新' });
    setTimeout(() => setMessage({ type: '', text: '' }), 2000);
  }, [loadData]);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">加载中...</span>
        </div>
      </div>
    );
  }

  if (!summary || summary.error) {
    return (
      <Alert variant="warning">
        无法加载统计数据: {summary?.error || '未知错误'}
      </Alert>
    );
  }

  // 排序后的功能使用数据
  const sortedEvents = Object.entries(summary.byEvent || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const maxEventCount = sortedEvents.length > 0 ? sortedEvents[0][1] : 1;

  return (
    <div className="analytics-dashboard p-3">
      {/* 标题栏 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-1">使用分析</h4>
          <small className="text-muted">
            数据存储在本地，最多保留500条记录
          </small>
        </div>
        <div>
          <Button variant="outline-secondary" size="sm" className="me-2" onClick={handleRefresh}>
            刷新
          </Button>
          <Button variant="outline-primary" size="sm" className="me-2" onClick={handleExport}>
            导出
          </Button>
          <Button variant="outline-danger" size="sm" onClick={handleClear}>
            清除
          </Button>
        </div>
      </div>

      {/* 消息提示 */}
      {message.text && (
        <Alert variant={message.type} dismissible onClose={() => setMessage({ type: '', text: '' })}>
          {message.text}
        </Alert>
      )}

      {/* 概览卡片 */}
      <Row className="g-3 mb-4">
        <Col xs={6} md={3}>
          <StatCard
            title="总事件数"
            value={summary.totalEvents}
            icon="📊"
            variant="primary"
            subtitle="最多500条"
          />
        </Col>
        <Col xs={6} md={3}>
          <StatCard
            title="总会话数"
            value={summary.totalSessions}
            icon="👥"
            variant="success"
          />
        </Col>
        <Col xs={6} md={3}>
          <StatCard
            title="今日活跃"
            value={summary.todaySessions}
            icon="📅"
            variant="info"
            subtitle="会话数"
          />
        </Col>
        <Col xs={6} md={3}>
          <StatCard
            title="本周活跃"
            value={summary.weeklySessions}
            icon="📈"
            variant="warning"
            subtitle="会话数"
          />
        </Col>
      </Row>

      <Row className="g-3">
        {/* 7日趋势 */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-transparent">
              <strong>最近7天趋势</strong>
            </Card.Header>
            <Card.Body>
              <SimpleBarChart data={summary.dailyEvents} />
            </Card.Body>
          </Card>
        </Col>

        {/* 功能使用排行 */}
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header className="bg-transparent d-flex justify-content-between align-items-center">
              <strong>功能使用排行</strong>
              <Badge bg="secondary">{sortedEvents.length} 项</Badge>
            </Card.Header>
            <Card.Body className="p-0">
              {sortedEvents.length === 0 ? (
                <div className="text-muted text-center py-4">暂无数据</div>
              ) : (
                <Table size="sm" className="mb-0" hover>
                  <tbody>
                    {sortedEvents.map(([event, count], index) => (
                      <tr key={event}>
                        <td style={{ width: 30 }} className="text-center text-muted">
                          {index + 1}
                        </td>
                        <td>
                          <small>{EVENT_LABELS[event] || event}</small>
                          <ProgressBar
                            now={(count / maxEventCount) * 100}
                            variant={index === 0 ? 'primary' : 'secondary'}
                            style={{ height: 4, marginTop: 2 }}
                          />
                        </td>
                        <td style={{ width: 50 }} className="text-end">
                          <Badge bg="light" text="dark">{count}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 设备信息 */}
      <Row className="g-3 mt-3">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-transparent">
              <strong>当前设备信息</strong>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col xs={4}>
                  <small className="text-muted d-block">设备类型</small>
                  <span>{summary.device?.isMobile ? '移动端' : '桌面端'}</span>
                </Col>
                <Col xs={4}>
                  <small className="text-muted d-block">浏览器</small>
                  <span>{summary.device?.browser || '未知'}</span>
                </Col>
                <Col xs={4}>
                  <small className="text-muted d-block">屏幕分辨率</small>
                  <span>{summary.device?.screen || '未知'}</span>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* 最近事件 */}
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Header className="bg-transparent">
              <strong>最近事件</strong>
            </Card.Header>
            <Card.Body>
              {summary.lastEvent ? (
                <div>
                  <Row>
                    <Col xs={6}>
                      <small className="text-muted d-block">事件类型</small>
                      <Badge bg="primary">
                        {EVENT_LABELS[summary.lastEvent.event] || summary.lastEvent.event}
                      </Badge>
                    </Col>
                    <Col xs={6}>
                      <small className="text-muted d-block">时间</small>
                      <span>{new Date(summary.lastEvent.timestamp).toLocaleString('zh-CN')}</span>
                    </Col>
                  </Row>
                  {summary.lastEvent.data && Object.keys(summary.lastEvent.data).length > 0 && (
                    <div className="mt-2">
                      <small className="text-muted d-block">详情</small>
                      <code className="small">
                        {JSON.stringify(summary.lastEvent.data).substring(0, 100)}
                        {JSON.stringify(summary.lastEvent.data).length > 100 ? '...' : ''}
                      </code>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted">暂无事件记录</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 页脚说明 */}
      <div className="text-muted text-center mt-4" style={{ fontSize: '0.75rem' }}>
        <p className="mb-1">
          所有数据仅存储在您的浏览器本地，不会上传到任何服务器。
        </p>
        <p className="mb-0">
          清除浏览器数据或使用隐私模式将导致统计数据丢失。
        </p>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
