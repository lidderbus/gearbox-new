import React, { useMemo, useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Table, Spinner, Alert, Form } from 'react-bootstrap';
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis
} from 'recharts';

// Safe percentage helper to avoid NaN when total is 0
const safePercent = (count, total) => total > 0 ? ((count / total) * 100).toFixed(1) + '%' : '0%';

// 备用泵类型中文映射
const PUMP_TYPE_CN = {
  mechanical: '机械式',
  electric: '电动式',
  hydraulic: '液压式',
  manual: '手动式'
};

// 自定义Tooltip
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: '#fff', border: '1px solid #ddd', padding: '8px 12px', borderRadius: 4, fontSize: 13 }}>
      <strong>{label || payload[0]?.payload?.name}</strong>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color }}>
          {p.name}: {typeof p.value === 'number' ? p.value.toLocaleString() : p.value}
        </div>
      ))}
    </div>
  );
};

const StatisticsDashboard = () => {
  const [completeGearboxData, setCompleteGearboxData] = useState(null);
  const [flexibleCouplingsData, setFlexibleCouplingsData] = useState([]);
  const [standbyPumpsData, setStandbyPumpsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('count'); // 'count' | 'name'

  useEffect(() => {
    const loadData = async () => {
      try {
        const [gearboxModule, couplingsModule, pumpsModule] = await Promise.all([
          import(/* webpackChunkName: "complete-gearbox-data" */ '../data/completeGearboxData'),
          import(/* webpackChunkName: "coupling-data" */ '../data/flexibleCouplings'),
          import(/* webpackChunkName: "pump-data" */ '../data/standbyPumps')
        ]);
        setCompleteGearboxData(gearboxModule.default || gearboxModule);
        setFlexibleCouplingsData(couplingsModule.flexibleCouplings || couplingsModule.default || []);
        setStandbyPumpsData(pumpsModule.standbyPumps || pumpsModule.default || []);
      } catch (error) {
        console.error('StatisticsDashboard: 数据加载失败', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 统计齿轮箱数据
  const gearboxStats = useMemo(() => {
    if (!completeGearboxData) {
      return { total: 0, seriesCount: {}, powerRanges: {}, priceRanges: {}, scatterData: [] };
    }
    const allGearboxes = Array.isArray(completeGearboxData) ? completeGearboxData : [];
    const total = allGearboxes.length;

    const seriesCount = {};
    allGearboxes.forEach(gb => {
      const series = (gb.series || '').toUpperCase() || '其他';
      seriesCount[series] = (seriesCount[series] || 0) + 1;
    });

    const powerRanges = { '< 100kW': 0, '100-300kW': 0, '300-500kW': 0, '500-1000kW': 0, '> 1000kW': 0 };
    allGearboxes.forEach(gb => {
      const maxPower = gb.maxPower || gb.power || 0;
      if (maxPower < 100) powerRanges['< 100kW']++;
      else if (maxPower < 300) powerRanges['100-300kW']++;
      else if (maxPower < 500) powerRanges['300-500kW']++;
      else if (maxPower < 1000) powerRanges['500-1000kW']++;
      else powerRanges['> 1000kW']++;
    });

    const priceRanges = { '< 5万': 0, '5-10万': 0, '10-20万': 0, '20-50万': 0, '> 50万': 0, '无价格': 0 };
    allGearboxes.forEach(gb => {
      const price = gb.price || gb.basePrice;
      if (!price) priceRanges['无价格']++;
      else if (price < 50000) priceRanges['< 5万']++;
      else if (price < 100000) priceRanges['5-10万']++;
      else if (price < 200000) priceRanges['10-20万']++;
      else if (price < 500000) priceRanges['20-50万']++;
      else priceRanges['> 50万']++;
    });

    // 功率-价格散点图数据
    const scatterData = allGearboxes
      .filter(gb => (gb.maxPower || gb.power) && (gb.price || gb.basePrice))
      .map(gb => ({
        power: gb.maxPower || gb.power || 0,
        price: ((gb.price || gb.basePrice || 0) / 10000),
        name: gb.model || gb.name || '',
        series: (gb.series || '').toUpperCase()
      }));

    return { total, seriesCount, powerRanges, priceRanges, scatterData };
  }, [completeGearboxData]);

  const couplingStats = useMemo(() => {
    const allCouplings = Array.isArray(flexibleCouplingsData) ? flexibleCouplingsData : [];
    const total = allCouplings.length;
    const seriesCount = {};
    allCouplings.forEach(coupling => {
      const match = coupling.model?.match(/^([A-Z]+)/);
      if (match) {
        seriesCount[match[1]] = (seriesCount[match[1]] || 0) + 1;
      }
    });
    return { total, seriesCount };
  }, [flexibleCouplingsData]);

  const pumpStats = useMemo(() => {
    const pumps = Array.isArray(standbyPumpsData) ? standbyPumpsData : [];
    const total = pumps.length;
    const typeCount = {};
    pumps.forEach(pump => {
      const type = pump.type || '未知';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });
    return { total, typeCount };
  }, [standbyPumpsData]);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a4de6c', '#8dd1e1', '#d0ed57', '#ffa07a'];

  // 系列分布数据 — 按数量降序排列（用于水平条形图）
  const seriesChartData = useMemo(() => {
    const entries = Object.entries(gearboxStats.seriesCount).map(([name, value]) => ({ name, 数量: value }));
    if (sortField === 'count') {
      entries.sort((a, b) => b.数量 - a.数量);
    } else {
      entries.sort((a, b) => a.name.localeCompare(b.name));
    }
    return entries;
  }, [gearboxStats.seriesCount, sortField]);

  const seriesCountNum = Object.keys(gearboxStats.seriesCount).length;

  // 功率/价格用环形图数据
  const powerChartData = Object.entries(gearboxStats.powerRanges)
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);

  const priceChartData = Object.entries(gearboxStats.priceRanges)
    .map(([name, value]) => ({ name, value }))
    .filter(d => d.value > 0);

  // 环形图+右侧图例的渲染器
  const renderDonutChart = (data, title) => {
    const total = data.reduce((s, d) => s + d.value, 0);
    return (
      <Row>
        <Col xs={7}>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={85}
                paddingAngle={2}
                dataKey="value"
              >
                {data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </Col>
        <Col xs={5} className="d-flex align-items-center">
          <div style={{ fontSize: 12 }}>
            {data.map((d, i) => (
              <div key={d.name} className="d-flex align-items-center mb-1">
                <span style={{
                  display: 'inline-block', width: 10, height: 10, borderRadius: 2,
                  backgroundColor: COLORS[i % COLORS.length], marginRight: 6, flexShrink: 0
                }} />
                <span className="text-truncate" style={{ maxWidth: 100 }}>{d.name}</span>
                <span className="ms-auto text-muted ps-1">{d.value} ({total > 0 ? ((d.value / total) * 100).toFixed(0) : 0}%)</span>
              </div>
            ))}
          </div>
        </Col>
      </Row>
    );
  };

  if (loading) {
    return (
      <div className="statistics-dashboard p-3 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">正在加载统计数据...</p>
      </div>
    );
  }

  return (
    <div className="statistics-dashboard p-3">
      <h4 className="mb-4">数据统计概览</h4>

      {/* 数据总览卡片 */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">{gearboxStats.total}</div>
              <h5>齿轮箱型号</h5>
              <Badge bg="info">{seriesCountNum}个系列</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">{couplingStats.total}</div>
              <h5>高弹联轴器</h5>
              <Badge bg="success">{Object.keys(couplingStats.seriesCount).length}个系列</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">{pumpStats.total}</div>
              <h5>备用泵型号</h5>
              <Badge bg="warning" text="dark">{Object.keys(pumpStats.typeCount).length}种类型</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 齿轮箱系列分布 — 水平条形图 */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">齿轮箱系列分布</h5>
          <Form.Select
            size="sm"
            style={{ width: 120 }}
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="count">按数量排序</option>
            <option value="name">按名称排序</option>
          </Form.Select>
        </Card.Header>
        <Card.Body>
          {seriesChartData.some(d => d.数量 > 0) ? (
            <ResponsiveContainer width="100%" height={Math.max(400, seriesChartData.length * 28)}>
              <BarChart data={seriesChartData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="数量" fill="#0088FE" radius={[0, 4, 4, 0]} barSize={18}>
                  {seriesChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Alert variant="secondary" className="text-center my-4">暂无数据</Alert>
          )}
        </Card.Body>
      </Card>

      {/* 功率范围和价格分布 — 环形图+右侧图例 */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header><h5 className="mb-0">功率范围分布</h5></Card.Header>
            <Card.Body>
              {powerChartData.length > 0 ? renderDonutChart(powerChartData) : (
                <Alert variant="secondary" className="text-center my-4">暂无数据</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header><h5 className="mb-0">价格区间分布</h5></Card.Header>
            <Card.Body>
              {priceChartData.length > 0 ? renderDonutChart(priceChartData) : (
                <Alert variant="secondary" className="text-center my-4">暂无数据</Alert>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 功率-价格散点图 */}
      {gearboxStats.scatterData.length > 0 && (
        <Card className="shadow-sm mb-4">
          <Card.Header><h5 className="mb-0">功率-价格关系散点图</h5></Card.Header>
          <Card.Body>
            <ResponsiveContainer width="100%" height={350}>
              <ScatterChart margin={{ top: 10, right: 30, bottom: 10, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" dataKey="power" name="功率" unit="kW" />
                <YAxis type="number" dataKey="price" name="价格" unit="万" />
                <ZAxis range={[30, 30]} />
                <Tooltip
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [
                    name === '功率' ? `${value} kW` : `${value.toFixed(1)} 万元`,
                    name === '功率' ? '最大功率' : '价格'
                  ]}
                  labelFormatter={() => ''}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div style={{ background: '#fff', border: '1px solid #ddd', padding: '8px 12px', borderRadius: 4, fontSize: 13 }}>
                        <strong>{d?.name}</strong>
                        <div>系列: {d?.series}</div>
                        <div>功率: {d?.power} kW</div>
                        <div>价格: {d?.price?.toFixed(1)} 万元</div>
                      </div>
                    );
                  }}
                />
                <Scatter name="齿轮箱" data={gearboxStats.scatterData} fill="#8884d8" opacity={0.6} />
              </ScatterChart>
            </ResponsiveContainer>
          </Card.Body>
        </Card>
      )}

      {/* 详细统计表 */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header><h5 className="mb-0">齿轮箱系列明细</h5></Card.Header>
            <Card.Body style={{ maxHeight: 400, overflowY: 'auto' }}>
              <Table striped bordered hover size="sm">
                <thead style={{ position: 'sticky', top: 0, background: '#fff' }}>
                  <tr>
                    <th>系列</th>
                    <th>数量</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(gearboxStats.seriesCount)
                    .sort((a, b) => b[1] - a[1])
                    .map(([series, count]) => (
                      <tr key={series}>
                        <td><strong>{series}</strong></td>
                        <td>{count}</td>
                        <td>{safePercent(count, gearboxStats.total)}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header><h5 className="mb-0">联轴器系列明细</h5></Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>系列</th>
                    <th>数量</th>
                    <th>占比</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(couplingStats.seriesCount)
                    .sort((a, b) => b[1] - a[1])
                    .map(([series, count]) => (
                      <tr key={series}>
                        <td><strong>{series}</strong></td>
                        <td>{count}</td>
                        <td>{safePercent(count, couplingStats.total)}</td>
                      </tr>
                    ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 备用泵类型统计 — 中文化 */}
      <Card className="shadow-sm">
        <Card.Header><h5 className="mb-0">备用泵类型分布</h5></Card.Header>
        <Card.Body>
          <Table striped bordered hover size="sm">
            <thead>
              <tr>
                <th>类型</th>
                <th>数量</th>
                <th>占比</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pumpStats.typeCount)
                .sort((a, b) => b[1] - a[1])
                .map(([type, count]) => (
                  <tr key={type}>
                    <td><strong>{PUMP_TYPE_CN[type] || type}</strong></td>
                    <td>{count}</td>
                    <td>{safePercent(count, pumpStats.total)}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StatisticsDashboard;
