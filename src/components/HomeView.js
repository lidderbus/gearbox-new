// src/components/HomeView.js
// Home Dashboard - system overview and quick navigation

import React, { useMemo } from 'react';
import { Card, Row, Col, Button, Badge, OverlayTrigger, Tooltip, ProgressBar } from 'react-bootstrap';
import { lookupPriceByModel } from '../utils/priceFormatter';

const HomeView = ({ appData, colors, theme, onNavigate, selectionHistory = [] }) => {
  // Calculate data overview stats
  const stats = useMemo(() => {
    if (!appData) return { totalModels: 0, series: [], couplings: 0, pumps: 0, pricedModels: 0 };

    const seriesKeys = ['hcGearboxes', 'gwGearboxes', 'hcmGearboxes', 'dtGearboxes', 'hcqGearboxes', 'gcGearboxes', 'hcaGearboxes', 'hcvGearboxes', 'hcxGearboxes', 'mvGearboxes', 'otherGearboxes'];
    const series = seriesKeys
      .filter(key => Array.isArray(appData[key]) && appData[key].length > 0)
      .map(key => ({
        name: key.replace('Gearboxes', '').toUpperCase(),
        count: appData[key].length
      }));

    const totalModels = series.reduce((sum, s) => sum + s.count, 0);
    const couplings = Array.isArray(appData.flexibleCouplings) ? appData.flexibleCouplings.length : 0;
    const pumps = Array.isArray(appData.standbyPumps) ? appData.standbyPumps.length : 0;

    // P1#5 — 计算齿轮箱价格数据完整度 (含 inline 价格 + lookupPriceByModel 兜底命中)
    let pricedModels = 0;
    seriesKeys.forEach(key => {
      const arr = appData[key];
      if (!Array.isArray(arr)) return;
      arr.forEach(g => {
        const inline = g?.factoryPrice || g?.marketPrice || g?.price || g?.basePrice || 0;
        if (inline > 0) { pricedModels += 1; return; }
        const { factoryPrice } = lookupPriceByModel(g?.model || '');
        if (factoryPrice > 0) pricedModels += 1;
      });
    });

    return { totalModels, series, couplings, pumps, pricedModels };
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

  // 推荐工作流 — 为新用户提供 3 条典型业务路径,降低面对 47 个子模块的认知压力
  const workflows = [
    {
      title: '新船型正向选型',
      icon: 'bi-arrow-right-circle',
      color: 'primary',
      desc: '客户给出主机参数,从输入到合同的标准链路',
      steps: [
        { key: 'input', label: '输入参数' },
        { key: 'result', label: '选型结果' },
        { key: 'coupling-system', label: '联轴器配套' },
        { key: 'quotation', label: '报价单' },
        { key: 'contract', label: '销售合同' },
      ],
    },
    {
      title: '配套销售反推',
      icon: 'bi-arrow-left-right',
      color: 'success',
      desc: '客户已有齿轮箱,反推主机/配套件方案',
      steps: [
        { key: 'reverse-selection', label: '反向选型' },
        { key: 'engine-matching', label: '多品牌主机' },
        { key: 'compatibility-matrix', label: '兼容性矩阵' },
        { key: 'system-solution', label: '整体方案' },
        { key: 'agreement', label: '技术协议' },
      ],
    },
    {
      title: '工程评审 / 入级送审',
      icon: 'bi-patch-check',
      color: 'info',
      desc: '面向 CCS/DNV/ABS 入级评审的深度计算链路',
      steps: [
        { key: 'multi-condition', label: '多工况选型' },
        { key: 'propulsion-hub', label: '推进系统 Hub' },
        { key: 'shaft', label: '轴系设计' },
        { key: 'torsional', label: '扭振分析' },
        { key: 'torsional-report', label: '扭振计算书' },
      ],
    },
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
          <p style={{ color: colors?.muted, marginBottom: 8 }}>
            覆盖 HC / GW / HCM / DT / HCQ / GC / HCA / HCV / HCX / MV 全系列，支持智能选型、报价、技术协议一站式服务
          </p>
          <small style={{ color: colors?.muted }}>
            <kbd style={{ fontSize: '0.72rem' }}>⌘ K</kbd> <span className="text-muted mx-1">/</span> <kbd style={{ fontSize: '0.72rem' }}>Ctrl K</kbd>
            <span className="ms-2">一键搜索任意模块、项目、资料(50+ 模块、1700+ 资料项)</span>
          </small>
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
              <small style={{ color: colors?.muted }}>
                产品系列{' '}
                <OverlayTrigger placement="top" overlay={
                  <Tooltip>
                    按数据集分组统计 (含子系列):<br/>
                    HC 数组含 HCD/HCT 等变体 → 数字偏大<br/>
                    反向选型按严格名称前缀分类<br/>
                    → 同一系列在两处可能数字不同
                  </Tooltip>
                }>
                  <i className="bi bi-info-circle ms-1" style={{ cursor: 'help', fontSize: '0.75rem', opacity: 0.6 }}></i>
                </OverlayTrigger>
              </small>
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

      {/* P1#5 (2026-04-30) — 数据完整度 KPI: 把 292/696 显式呈现为首页一级指标 */}
      {stats.totalModels > 0 && (() => {
        const pct = stats.totalModels > 0 ? (stats.pricedModels / stats.totalModels) * 100 : 0;
        const isLow = pct < 60;
        const variant = pct < 50 ? 'danger' : pct < 75 ? 'warning' : 'success';
        return (
          <Row className="mb-4">
            <Col>
              <Card
                style={{
                  ...cardStyle,
                  borderLeft: `4px solid ${variant === 'danger' ? '#dc3545' : variant === 'warning' ? '#ffc107' : '#198754'}`
                }}
                className="shadow-sm"
              >
                <Card.Body>
                  <Row className="align-items-center">
                    <Col md={4}>
                      <div className="d-flex align-items-center">
                        <i
                          className={`bi ${isLow ? 'bi-exclamation-triangle-fill text-danger' : 'bi-check-circle-fill text-success'} me-2`}
                          style={{ fontSize: '1.5rem' }}
                        ></i>
                        <div>
                          <div style={{ fontSize: '0.85rem', color: colors?.muted }}>价格数据完整度</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 700, color: colors?.text }}>
                            {stats.pricedModels} / {stats.totalModels}
                            <Badge bg={variant} className="ms-2" style={{ fontSize: '0.85rem' }}>
                              {pct.toFixed(1)}%
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <ProgressBar variant={variant} now={pct} style={{ height: '12px' }} />
                      <small style={{ color: colors?.muted }} className="mt-1 d-block">
                        {isLow
                          ? `还有 ${stats.totalModels - stats.pricedModels} 个型号缺价,影响报价准确性`
                          : `数据覆盖良好`}
                      </small>
                    </Col>
                    <Col md={2} className="text-end">
                      <Button
                        size="sm"
                        variant={`outline-${variant}`}
                        onClick={() => onNavigate && onNavigate('data-quality')}
                      >
                        <i className="bi bi-graph-up me-1"></i>查看明细
                      </Button>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        );
      })()}

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

      {/* 推荐工作流 — 给新用户的业务路径地图 */}
      <Card className="mb-4 shadow-sm" style={cardStyle}>
        <Card.Header style={headerStyle}>
          <i className="bi bi-signpost-split me-2"></i>推荐工作流
          <small className="ms-2" style={{ color: colors?.muted, fontWeight: 'normal' }}>
            点击任一节点直达对应模块
          </small>
        </Card.Header>
        <Card.Body>
          <Row>
            {workflows.map(wf => (
              <Col key={wf.title} md={4} className="mb-3">
                <Card style={{ borderLeft: `3px solid var(--bs-${wf.color})`, height: '100%' }}>
                  <Card.Body className="py-3">
                    <div className="d-flex align-items-center mb-2">
                      <i className={`bi ${wf.icon} me-2 text-${wf.color}`} style={{ fontSize: '1.2rem' }}></i>
                      <strong>{wf.title}</strong>
                    </div>
                    <small className="text-muted d-block mb-3">{wf.desc}</small>
                    <div className="d-flex flex-wrap align-items-center gap-1">
                      {wf.steps.map((step, idx) => (
                        <React.Fragment key={step.key}>
                          <Button
                            size="sm"
                            variant={`outline-${wf.color}`}
                            onClick={() => onNavigate(step.key)}
                            style={{ fontSize: '0.78rem', padding: '0.2em 0.5em' }}
                          >
                            <span style={{ opacity: 0.6, marginRight: 4 }}>{idx + 1}</span>{step.label}
                          </Button>
                          {idx < wf.steps.length - 1 && (
                            <i className="bi bi-arrow-right text-muted" style={{ fontSize: '0.75rem' }}></i>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
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
