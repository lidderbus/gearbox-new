// 康明斯-杭齿配套查询模块 - 增强版
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Tab, Tabs, Alert, Button, ProgressBar, InputGroup, Modal } from 'react-bootstrap';
import {
  matchingSummary,
  typicalProjects,
  orderRecords,
  statistics,
  quickSelectionMatrix,
  shipTypeCategories,
  yearlyTrends,
  gearboxDistribution,
  cooperationAdvantages,
  cumminsEngines
} from '../data/cumminsMatchingData';

// 简易条形图组件
const SimpleBarChart = ({ data, maxValue, color = '#3498db', label }) => (
  <div className="mb-2">
    <div className="d-flex justify-content-between small text-muted mb-1">
      <span>{label}</span>
      <span>{data}</span>
    </div>
    <ProgressBar
      now={(data / maxValue) * 100}
      style={{ height: '8px' }}
      variant="info"
    />
  </div>
);

// 饼图组件 (CSS实现)
const SimplePieChart = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.count, 0);
  let cumulativePercent = 0;

  const gradientStops = data.map((item, index) => {
    const startPercent = cumulativePercent;
    cumulativePercent += (item.count / total) * 100;
    return `${item.color} ${startPercent}% ${cumulativePercent}%`;
  }).join(', ');

  return (
    <div className="d-flex align-items-center gap-3">
      <div
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          background: `conic-gradient(${gradientStops})`,
          flexShrink: 0
        }}
      />
      <div className="flex-grow-1">
        {data.map((item, idx) => (
          <div key={idx} className="d-flex align-items-center gap-2 mb-1 small">
            <div style={{
              width: '12px',
              height: '12px',
              backgroundColor: item.color,
              borderRadius: '2px',
              flexShrink: 0
            }} />
            <span>{item.type || item.series}: {item.count}台</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const CumminsMatchingView = ({ theme = 'light', colors = {} }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEngine, setFilterEngine] = useState('');
  const [filterShipType, setFilterShipType] = useState('');
  const [filterYear, setFilterYear] = useState('');
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [quickSelectEngine, setQuickSelectEngine] = useState('');
  const [quickSelectPower, setQuickSelectPower] = useState('');

  // 主题色彩
  const themeColors = useMemo(() => ({
    card: theme === 'dark' ? '#1e1e1e' : '#ffffff',
    cardBorder: theme === 'dark' ? '#333' : '#dee2e6',
    text: theme === 'dark' ? '#e0e0e0' : '#212529',
    textMuted: theme === 'dark' ? '#aaa' : '#6c757d',
    headerBg: theme === 'dark' ? '#2d2d2d' : '#f8f9fa',
    tableBg: theme === 'dark' ? '#252525' : '#fff',
    tableStriped: theme === 'dark' ? '#2a2a2a' : '#f8f9fa',
    ...colors
  }), [theme, colors]);

  // 过滤订单记录
  const filteredRecords = useMemo(() => {
    return orderRecords.filter(record => {
      const matchSearch = !searchTerm ||
        record.gearbox.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.engine.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (record.shipType && record.shipType.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchEngine = !filterEngine || record.engine.includes(filterEngine);
      const matchShipType = !filterShipType || (record.shipType && record.shipType.includes(filterShipType));
      const matchYear = !filterYear || record.year === parseInt(filterYear);

      return matchSearch && matchEngine && matchShipType && matchYear;
    });
  }, [searchTerm, filterEngine, filterShipType, filterYear]);

  // 统计总数量
  const totalQty = useMemo(() => {
    return filteredRecords.reduce((sum, r) => sum + (typeof r.qty === 'number' ? r.qty : 0), 0);
  }, [filteredRecords]);

  // 快速选型结果
  const quickSelectResult = useMemo(() => {
    if (!quickSelectEngine || !quickSelectPower) return null;
    const engineMatrix = quickSelectionMatrix[quickSelectEngine];
    if (!engineMatrix) return null;

    for (const [range, recommendation] of Object.entries(engineMatrix)) {
      const [min, max] = range.split('-').map(s => parseInt(s));
      const power = parseInt(quickSelectPower);
      if (power >= min && power <= max) {
        return { range, ...recommendation };
      }
    }
    return null;
  }, [quickSelectEngine, quickSelectPower]);

  // 重置筛选
  const handleResetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterEngine('');
    setFilterShipType('');
    setFilterYear('');
  }, []);

  // 导出功能
  const handleExport = useCallback(() => {
    const headers = ['齿轮箱', '减速比', '主机', '功率', '转速', '船型', '数量', '年份'];
    const rows = filteredRecords.map(r => [
      r.gearbox, r.ratio, r.engine, r.power, r.rpm, r.shipType || '-', r.qty, r.year
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `康明斯配套记录_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
  }, [filteredRecords]);

  return (
    <Container fluid className="py-4" style={{ color: themeColors.text }}>
      {/* 标题区 */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
            <div>
              <h2 className="mb-1 d-flex align-items-center gap-2">
                <span style={{ color: '#c41230', fontWeight: 'bold' }}>CUMMINS</span>
                <span className="text-muted">×</span>
                <span style={{ color: '#1a5fb4', fontWeight: 'bold' }}>杭齿前进</span>
                <span>配套案例库</span>
              </h2>
              <p style={{ color: themeColors.textMuted }} className="mb-0">
                累计配套 <strong className="text-primary">{statistics.totalUnits}+</strong> 台套 |
                覆盖 <strong>{statistics.engineSeries.length}</strong> 大系列主机 |
                数据周期: {statistics.yearRange}
              </p>
            </div>
            <div className="d-flex gap-2">
              <Button
                variant="outline-success"
                size="sm"
                onClick={() => setShowQuickSelect(true)}
              >
                <i className="bi bi-lightning-charge me-1"></i>
                快速选型
              </Button>
              <Badge bg="success" className="fs-6 px-3 py-2 d-flex align-items-center">
                <i className="bi bi-check-circle me-1"></i>
                实际订单数据
              </Badge>
            </div>
          </div>
        </Col>
      </Row>

      {/* 统计卡片 */}
      <Row className="mb-4 g-3">
        <Col xs={6} md={3}>
          <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: themeColors.card }}>
            <Card.Body className="text-center py-3">
              <div className="display-6 fw-bold text-primary">{statistics.totalUnits}+</div>
              <small style={{ color: themeColors.textMuted }}>累计配套台数</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: themeColors.card }}>
            <Card.Body className="text-center py-3">
              <div className="display-6 fw-bold text-success">{statistics.totalProjects}</div>
              <small style={{ color: themeColors.textMuted }}>典型项目</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: themeColors.card }}>
            <Card.Body className="text-center py-3">
              <div className="display-6 fw-bold text-info">{statistics.gearboxSeries.length}</div>
              <small style={{ color: themeColors.textMuted }}>齿轮箱系列</small>
            </Card.Body>
          </Card>
        </Col>
        <Col xs={6} md={3}>
          <Card className="h-100 border-0 shadow-sm" style={{ backgroundColor: themeColors.card }}>
            <Card.Body className="text-center py-3">
              <div className="display-6 fw-bold text-warning">{statistics.topShipyards.length}+</div>
              <small style={{ color: themeColors.textMuted }}>合作船厂</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Tabs defaultActiveKey="overview" className="mb-4" variant={theme === 'dark' ? 'pills' : 'tabs'}>
        {/* Tab 1: 总览 */}
        <Tab eventKey="overview" title={<span><i className="bi bi-speedometer2 me-1"></i>数据总览</span>}>
          <Row className="g-4">
            {/* 配套汇总卡片 */}
            <Col lg={8}>
              <Card className="h-100 shadow-sm" style={{ backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }}>
                <Card.Header style={{ backgroundColor: themeColors.headerBg }}>
                  <strong><i className="bi bi-grid-3x3-gap me-2"></i>按康明斯主机系列分类</strong>
                </Card.Header>
                <Card.Body className="p-0">
                  <div className="table-responsive">
                    <Table hover className="mb-0" style={{ backgroundColor: themeColors.tableBg }}>
                      <thead>
                        <tr style={{ backgroundColor: themeColors.headerBg }}>
                          <th style={{ width: '20%' }}>主机系列</th>
                          <th>功率范围</th>
                          <th>配套齿轮箱</th>
                          <th>典型船型</th>
                          <th className="text-center">台数</th>
                        </tr>
                      </thead>
                      <tbody>
                        {matchingSummary.map((item, idx) => (
                          <tr key={idx}>
                            <td>
                              <span className="me-2" style={{ fontSize: '1.2em' }}>{item.icon}</span>
                              <strong style={{ color: item.color }}>{item.engineSeries}</strong>
                            </td>
                            <td>
                              <small className="text-muted">{item.powerRange}</small>
                              <br />
                              <small className="text-muted">{item.rpm}</small>
                            </td>
                            <td>
                              {item.gearboxes.map((gb, i) => (
                                <Badge key={i} bg="primary" className="me-1 mb-1">{gb}</Badge>
                              ))}
                            </td>
                            <td>
                              {item.shipTypes.map((st, i) => (
                                <Badge key={i} bg="secondary" className="me-1 mb-1">{st}</Badge>
                              ))}
                            </td>
                            <td className="text-center">
                              <Badge bg="success" className="fs-6">{item.totalUnits}</Badge>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* 右侧统计图表 */}
            <Col lg={4}>
              <Card className="mb-3 shadow-sm" style={{ backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }}>
                <Card.Header style={{ backgroundColor: themeColors.headerBg }}>
                  <strong><i className="bi bi-pie-chart me-2"></i>船型分布</strong>
                </Card.Header>
                <Card.Body>
                  <SimplePieChart data={shipTypeCategories.slice(0, 6)} />
                </Card.Body>
              </Card>

              <Card className="shadow-sm" style={{ backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }}>
                <Card.Header style={{ backgroundColor: themeColors.headerBg }}>
                  <strong><i className="bi bi-bar-chart me-2"></i>年度趋势</strong>
                </Card.Header>
                <Card.Body>
                  {yearlyTrends.map((item, idx) => (
                    <SimpleBarChart
                      key={idx}
                      data={item.units}
                      maxValue={100}
                      label={`${item.year}年`}
                    />
                  ))}
                  <div className="text-center mt-2">
                    <small className="text-muted">2023年达到峰值95台</small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* 合作优势 */}
          <Row className="mt-4">
            <Col>
              <Card className="shadow-sm" style={{ backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }}>
                <Card.Header style={{ backgroundColor: themeColors.headerBg }}>
                  <strong><i className="bi bi-trophy me-2"></i>合作优势</strong>
                </Card.Header>
                <Card.Body>
                  <Row className="g-3">
                    {cooperationAdvantages.map((adv, idx) => (
                      <Col md={4} lg={2} key={idx}>
                        <div className="text-center p-2 h-100" style={{
                          backgroundColor: theme === 'dark' ? '#2d2d2d' : '#f8f9fa',
                          borderRadius: '8px'
                        }}>
                          <div style={{ fontSize: '1.8em' }}>{adv.icon}</div>
                          <div className="fw-bold small mt-1">{adv.title}</div>
                          <small style={{ color: themeColors.textMuted }}>{adv.description}</small>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Tab 2: 典型项目 */}
        <Tab eventKey="projects" title={<span><i className="bi bi-building me-1"></i>典型项目</span>}>
          <Row className="g-3">
            {typicalProjects.map((proj, idx) => (
              <Col md={6} lg={4} key={idx}>
                <Card
                  className={`h-100 shadow-sm ${proj.highlight ? 'border-primary' : ''}`}
                  style={{
                    backgroundColor: themeColors.card,
                    borderColor: proj.highlight ? '#0d6efd' : themeColors.cardBorder,
                    borderWidth: proj.highlight ? '2px' : '1px'
                  }}
                >
                  {proj.highlight && (
                    <div className="position-absolute top-0 end-0 m-2">
                      <Badge bg="warning" text="dark">
                        <i className="bi bi-star-fill me-1"></i>重点项目
                      </Badge>
                    </div>
                  )}
                  <Card.Body>
                    <h6 className="mb-3">
                      <i className="bi bi-ship me-2 text-primary"></i>
                      {proj.project}
                    </h6>
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      <Badge bg="danger">{proj.engine}</Badge>
                      <Badge bg="info">{proj.gearbox}</Badge>
                      <Badge bg="secondary">{proj.ratio}</Badge>
                    </div>
                    <Table size="sm" className="mb-0" style={{ fontSize: '0.85em' }}>
                      <tbody>
                        <tr>
                          <td style={{ color: themeColors.textMuted }}>功率</td>
                          <td className="fw-bold">{proj.power}</td>
                        </tr>
                        <tr>
                          <td style={{ color: themeColors.textMuted }}>数量</td>
                          <td><Badge bg="success">{proj.quantity}台</Badge></td>
                        </tr>
                        {proj.shipyard !== '-' && (
                          <tr>
                            <td style={{ color: themeColors.textMuted }}>船厂</td>
                            <td>{proj.shipyard}</td>
                          </tr>
                        )}
                        <tr>
                          <td style={{ color: themeColors.textMuted }}>船检</td>
                          <td><Badge bg="outline-secondary" className="border">{proj.classification}</Badge></td>
                        </tr>
                      </tbody>
                    </Table>
                  </Card.Body>
                  <Card.Footer className="bg-transparent text-end">
                    <small style={{ color: themeColors.textMuted }}>
                      <i className="bi bi-calendar me-1"></i>{proj.year}年
                    </small>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        {/* Tab 3: 订单查询 */}
        <Tab eventKey="records" title={<span><i className="bi bi-search me-1"></i>订单查询</span>}>
          {/* 搜索过滤 */}
          <Card className="mb-3 shadow-sm" style={{ backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }}>
            <Card.Body>
              <Row className="g-2 align-items-end">
                <Col md={3}>
                  <Form.Group>
                    <Form.Label className="small mb-1">
                      <i className="bi bi-search me-1"></i>关键词搜索
                    </Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="齿轮箱/主机/船型..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="sm"
                    />
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="small mb-1">主机系列</Form.Label>
                    <Form.Select
                      value={filterEngine}
                      onChange={(e) => setFilterEngine(e.target.value)}
                      size="sm"
                    >
                      <option value="">全部</option>
                      <option value="K19">K19系列</option>
                      <option value="K38">K38系列</option>
                      <option value="K50">K50系列</option>
                      <option value="QS">QS系列</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="small mb-1">船型</Form.Label>
                    <Form.Select
                      value={filterShipType}
                      onChange={(e) => setFilterShipType(e.target.value)}
                      size="sm"
                    >
                      <option value="">全部</option>
                      <option value="风电">风电运维</option>
                      <option value="巡逻">巡逻船</option>
                      <option value="货船">货船</option>
                      <option value="渡轮">渡轮</option>
                      <option value="航标">航标船</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={2}>
                  <Form.Group>
                    <Form.Label className="small mb-1">年份</Form.Label>
                    <Form.Select
                      value={filterYear}
                      onChange={(e) => setFilterYear(e.target.value)}
                      size="sm"
                    >
                      <option value="">全部</option>
                      <option value="2024">2024</option>
                      <option value="2023">2023</option>
                      <option value="2022">2022</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={3} className="d-flex gap-2">
                  <Button variant="outline-secondary" size="sm" onClick={handleResetFilters}>
                    <i className="bi bi-arrow-counterclockwise me-1"></i>重置
                  </Button>
                  <Button variant="outline-success" size="sm" onClick={handleExport}>
                    <i className="bi bi-download me-1"></i>导出CSV
                  </Button>
                  <Alert variant="info" className="mb-0 py-1 px-2 d-flex align-items-center">
                    <strong>{filteredRecords.length}</strong>条 / <strong>{totalQty}</strong>台
                  </Alert>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* 订单列表 */}
          <Card className="shadow-sm" style={{ backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }}>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table striped hover className="mb-0" size="sm">
                  <thead className="table-dark">
                    <tr>
                      <th>齿轮箱</th>
                      <th>减速比</th>
                      <th>康明斯主机</th>
                      <th>功率</th>
                      <th>转速</th>
                      <th>船型</th>
                      <th className="text-center">数量</th>
                      <th>船厂</th>
                      <th>年份</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((record, idx) => (
                      <tr key={idx}>
                        <td><Badge bg="primary">{record.gearbox}</Badge></td>
                        <td>{record.ratio}</td>
                        <td><strong>{record.engine}</strong></td>
                        <td>{record.power}</td>
                        <td>{record.rpm}rpm</td>
                        <td>{record.shipType !== '-' ? record.shipType : <span className="text-muted">-</span>}</td>
                        <td className="text-center"><Badge bg="success">{record.qty}</Badge></td>
                        <td>{record.shipyard || <span className="text-muted">-</span>}</td>
                        <td>{record.year}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* Tab 4: 选型建议 */}
        <Tab eventKey="recommend" title={<span><i className="bi bi-lightbulb me-1"></i>选型建议</span>}>
          <Row className="g-4">
            <Col md={6}>
              <Card className="h-100 shadow-sm" style={{ backgroundColor: themeColors.card }}>
                <Card.Header className="bg-primary text-white">
                  <strong><i className="bi bi-cpu me-2"></i>K19系列推荐配套</strong>
                </Card.Header>
                <Card.Body>
                  <Table size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>功率范围</th>
                        <th>推荐齿轮箱</th>
                        <th>典型速比</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>373-400kW</td>
                        <td><Badge bg="info">HC300</Badge> <Badge bg="info">HCQ300</Badge></td>
                        <td>2.0-3.0</td>
                      </tr>
                      <tr>
                        <td>447-477kW</td>
                        <td><Badge bg="info">HC400</Badge> <Badge bg="info">HCQ401</Badge></td>
                        <td>1.4-2.5</td>
                      </tr>
                      <tr>
                        <td>500-522kW</td>
                        <td><Badge bg="info">HCQ401</Badge> <Badge bg="info">HCQ300</Badge></td>
                        <td>2.0-2.5</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 shadow-sm" style={{ backgroundColor: themeColors.card }}>
                <Card.Header className="bg-danger text-white">
                  <strong><i className="bi bi-cpu me-2"></i>K38系列推荐配套</strong>
                </Card.Header>
                <Card.Body>
                  <Table size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>功率范围</th>
                        <th>推荐齿轮箱</th>
                        <th>典型速比</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>746-882kW</td>
                        <td><Badge bg="info">HCQ700</Badge> <Badge bg="info">HCA700</Badge></td>
                        <td>2.25-2.96</td>
                      </tr>
                      <tr>
                        <td>972-1007kW</td>
                        <td><Badge bg="info">HC1000</Badge> <Badge bg="warning" text="dark">HCA700(倾角)</Badge></td>
                        <td>2.0-2.64</td>
                      </tr>
                      <tr>
                        <td>1044kW</td>
                        <td><Badge bg="info">HCQ1001</Badge> <Badge bg="info">HCA700</Badge></td>
                        <td>2.5-3.23</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 shadow-sm" style={{ backgroundColor: themeColors.card }}>
                <Card.Header className="bg-success text-white">
                  <strong><i className="bi bi-cpu me-2"></i>K50系列推荐配套</strong>
                </Card.Header>
                <Card.Body>
                  <Table size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>功率范围</th>
                        <th>推荐齿轮箱</th>
                        <th>典型速比</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>1268-1342kW</td>
                        <td><Badge bg="info">HC1000</Badge> <Badge bg="info">HC1200</Badge></td>
                        <td>2.5-3.55</td>
                      </tr>
                      <tr>
                        <td>1475-1641kW</td>
                        <td><Badge bg="info">HC1200</Badge> <Badge bg="info">HCM1250</Badge></td>
                        <td>2.96-3.95</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col md={6}>
              <Card className="h-100 shadow-sm" style={{ backgroundColor: themeColors.card }}>
                <Card.Header className="bg-secondary text-white">
                  <strong><i className="bi bi-cpu me-2"></i>QS系列推荐配套</strong>
                </Card.Header>
                <Card.Body>
                  <Table size="sm" className="mb-0">
                    <thead>
                      <tr>
                        <th>功率范围</th>
                        <th>推荐齿轮箱</th>
                        <th>典型速比</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>261kW (QSNT-M350)</td>
                        <td><Badge bg="info">HC200</Badge></td>
                        <td>2.0</td>
                      </tr>
                      <tr>
                        <td>298-400kW (QSNT-M400)</td>
                        <td><Badge bg="info">HC300</Badge></td>
                        <td>2.0-2.5</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Alert variant="success" className="mt-4">
            <Alert.Heading><i className="bi bi-info-circle me-2"></i>合作基础</Alert.Heading>
            <p className="mb-0">
              康明斯与杭齿已有<strong>10+年</strong>成熟配套经验，覆盖K19/K38/K50全系列主机，
              在<strong>风电运维、公务执法、客运渡轮</strong>等细分市场形成稳定合作关系。
              如需定制配套方案，请联系技术支持。
            </p>
          </Alert>
        </Tab>

        {/* Tab 5: 主机规格 */}
        <Tab eventKey="engines" title={<span><i className="bi bi-gear me-1"></i>主机规格</span>}>
          <Row className="g-3">
            {cumminsEngines.map((engine, idx) => (
              <Col md={6} lg={3} key={idx}>
                <Card className="h-100 shadow-sm" style={{ backgroundColor: themeColors.card, borderColor: themeColors.cardBorder }}>
                  <Card.Header style={{ backgroundColor: '#c41230', color: 'white' }}>
                    <strong>{engine.model}</strong>
                    <Badge bg="light" text="dark" className="ms-2">{engine.series}</Badge>
                  </Card.Header>
                  <Card.Body>
                    <Table size="sm" className="mb-2" style={{ fontSize: '0.85em' }}>
                      <tbody>
                        <tr>
                          <td style={{ color: themeColors.textMuted }}>功率</td>
                          <td className="fw-bold">{engine.powerRange}</td>
                        </tr>
                        <tr>
                          <td style={{ color: themeColors.textMuted }}>转速</td>
                          <td>{engine.rpmRange}</td>
                        </tr>
                        <tr>
                          <td style={{ color: themeColors.textMuted }}>排量</td>
                          <td>{engine.displacement}</td>
                        </tr>
                        <tr>
                          <td style={{ color: themeColors.textMuted }}>缸数</td>
                          <td>{engine.cylinders}缸</td>
                        </tr>
                        <tr>
                          <td style={{ color: themeColors.textMuted }}>应用</td>
                          <td>{engine.application}</td>
                        </tr>
                      </tbody>
                    </Table>
                    <div className="d-flex flex-wrap gap-1">
                      {engine.features.map((f, i) => (
                        <Badge key={i} bg="outline-secondary" className="border" style={{ fontSize: '0.7em' }}>{f}</Badge>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>

      {/* 快速选型模态框 */}
      <Modal show={showQuickSelect} onHide={() => setShowQuickSelect(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: themeColors.headerBg }}>
          <Modal.Title>
            <i className="bi bi-lightning-charge me-2 text-warning"></i>
            快速选型
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: themeColors.card }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>康明斯主机系列</Form.Label>
              <Form.Select
                value={quickSelectEngine}
                onChange={(e) => setQuickSelectEngine(e.target.value)}
              >
                <option value="">选择主机系列...</option>
                <option value="K19">K19系列 (373-522kW)</option>
                <option value="K38">K38系列 (746-1044kW)</option>
                <option value="K50">K50系列 (1268-1641kW)</option>
                <option value="QSN">QSN系列 (261-400kW)</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>主机功率 (kW)</Form.Label>
              <InputGroup>
                <Form.Control
                  type="number"
                  placeholder="输入功率..."
                  value={quickSelectPower}
                  onChange={(e) => setQuickSelectPower(e.target.value)}
                />
                <InputGroup.Text>kW</InputGroup.Text>
              </InputGroup>
            </Form.Group>
          </Form>

          {quickSelectResult && (
            <Alert variant="success" className="mt-3">
              <Alert.Heading className="h6">
                <i className="bi bi-check-circle me-2"></i>
                推荐配套方案
              </Alert.Heading>
              <hr />
              <p className="mb-1">
                <strong>功率范围:</strong> {quickSelectResult.range}
              </p>
              <p className="mb-1">
                <strong>推荐齿轮箱:</strong>{' '}
                <Badge bg="primary" className="fs-6">{quickSelectResult.gearbox}</Badge>
              </p>
              <p className="mb-0">
                <strong>建议速比:</strong> {quickSelectResult.ratio}
              </p>
            </Alert>
          )}

          {quickSelectEngine && quickSelectPower && !quickSelectResult && (
            <Alert variant="warning" className="mt-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              未找到匹配方案，请检查功率范围或联系技术支持
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer style={{ backgroundColor: themeColors.headerBg }}>
          <Button variant="secondary" onClick={() => setShowQuickSelect(false)}>
            关闭
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default CumminsMatchingView;
