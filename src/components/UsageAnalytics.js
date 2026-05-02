import React, { useMemo } from 'react';
import { Card, Row, Col, Badge, ProgressBar } from 'react-bootstrap';

const USAGE_KEY = 'gearbox_usage_stats';

export function trackModuleUsage(moduleName) {
  try {
    const stats = JSON.parse(localStorage.getItem(USAGE_KEY) || '{}');
    if (!stats[moduleName]) stats[moduleName] = { count: 0, lastUsed: '' };
    stats[moduleName].count++;
    stats[moduleName].lastUsed = new Date().toISOString();
    localStorage.setItem(USAGE_KEY, JSON.stringify(stats));
  } catch { /* ignore */ }
}

const moduleLabels = {
  'input': '参数输入', 'result': '选型结果', 'quotation': '报价单',
  'agreement': '技术协议', 'contract': '合同', 'batch': '批量选型',
  'pump': '泵选型', 'coupling': '联轴器', 'torsional': '扭振分析',
  'competitor': '竞品对比', 'drawing': '外形图', 'history': '历史记录',
  'cpp': 'CPP选型', 'energy': '能效', 'analytics': '统计分析',
  'data-quality': '数据质量', 'pareto': '多目标优化',
};

const UsageAnalytics = () => {
  const stats = useMemo(() => {
    try { return JSON.parse(localStorage.getItem(USAGE_KEY) || '{}'); }
    catch { return {}; }
  }, []);

  const entries = useMemo(() => {
    return Object.entries(stats)
      .map(([name, data]) => ({ name, count: data.count, lastUsed: data.lastUsed }))
      .sort((a, b) => b.count - a.count);
  }, [stats]);

  const maxCount = entries.length > 0 ? entries[0].count : 1;
  const totalUsage = entries.reduce((s, e) => s + e.count, 0);

  if (entries.length === 0) {
    return (
      <Card className="mt-3">
        <Card.Body className="text-center text-muted py-4">
          <i className="bi bi-bar-chart" style={{ fontSize: 32 }}></i>
          <p className="mt-2">暂无使用数据</p>
          <small>使用各功能模块后会自动记录</small>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="mt-3">
      <Card.Header className="d-flex justify-content-between">
        <span><i className="bi bi-bar-chart-fill me-2"></i>使用统计</span>
        <Badge bg="secondary">{totalUsage} 次操作</Badge>
      </Card.Header>
      <Card.Body>
        <Row>
          <Col md={8}>
            {entries.slice(0, 12).map((e, i) => (
              <div key={i} className="d-flex align-items-center mb-2" style={{ fontSize: 13 }}>
                <span style={{ minWidth: 100 }}>{moduleLabels[e.name] || e.name}</span>
                <ProgressBar
                  now={(e.count / maxCount) * 100}
                  label={e.count}
                  style={{ flex: 1, height: 18, marginLeft: 8 }}
                  variant={i === 0 ? 'primary' : i < 3 ? 'info' : 'secondary'}
                />
              </div>
            ))}
          </Col>
          <Col md={4}>
            <div className="text-center p-3 bg-light rounded">
              <div style={{ fontSize: 36, fontWeight: 700, color: '#3b82f6' }}>{entries.length}</div>
              <div className="text-muted small">已使用模块</div>
              <hr />
              <div style={{ fontSize: 24, fontWeight: 600 }}>{totalUsage}</div>
              <div className="text-muted small">总操作次数</div>
              {entries[0] && (
                <>
                  <hr />
                  <div className="small text-muted">最常用:</div>
                  <Badge bg="primary">{moduleLabels[entries[0].name] || entries[0].name}</Badge>
                </>
              )}
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default UsageAnalytics;
