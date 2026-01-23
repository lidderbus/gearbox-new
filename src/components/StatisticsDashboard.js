import React, { useMemo, useState, useEffect } from 'react';
import { Card, Row, Col, Badge, Table, Spinner } from 'react-bootstrap';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
// 性能优化: 改为动态导入
// import completeGearboxData from '../data/completeGearboxData';
// import flexibleCouplingsData from '../data/flexibleCouplings';
// import standbyPumpsData from '../data/standbyPumps';

const StatisticsDashboard = () => {
  // 数据状态
  const [completeGearboxData, setCompleteGearboxData] = useState(null);
  const [flexibleCouplingsData, setFlexibleCouplingsData] = useState([]);
  const [standbyPumpsData, setStandbyPumpsData] = useState([]);
  const [loading, setLoading] = useState(true);

  // 性能优化: 动态加载数据
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
      return { total: 0, seriesCount: {}, powerRanges: {}, priceRanges: {} };
    }

    const allGearboxes = [
      ...(completeGearboxData.hcGearboxes || []),
      ...(completeGearboxData.gwGearboxes || []),
      ...(completeGearboxData.hcmGearboxes || []),
      ...(completeGearboxData.dtGearboxes || []),
      ...(completeGearboxData.hcqGearboxes || []),
      ...(completeGearboxData.gcGearboxes || []),
      ...(completeGearboxData.hctsGearboxes || []),  // 修正：hctGearboxes -> hctsGearboxes
      ...(completeGearboxData.gcsGearboxes || [])
    ];

    const total = allGearboxes.length;

    // 按系列分组
    const seriesCount = {
      HC: (completeGearboxData.hcGearboxes || []).length,
      GW: (completeGearboxData.gwGearboxes || []).length,
      HCM: (completeGearboxData.hcmGearboxes || []).length,
      DT: (completeGearboxData.dtGearboxes || []).length,
      HCQ: (completeGearboxData.hcqGearboxes || []).length,
      GC: (completeGearboxData.gcGearboxes || []).length,
      HCTS: (completeGearboxData.hctsGearboxes || []).length,  // 修正：HCT -> HCTS
      GCS: (completeGearboxData.gcsGearboxes || []).length
    };

    // 功率范围统计
    const powerRanges = {
      '< 100kW': 0,
      '100-300kW': 0,
      '300-500kW': 0,
      '500-1000kW': 0,
      '> 1000kW': 0
    };

    allGearboxes.forEach(gb => {
      const maxPower = gb.maxPower || gb.power || 0;
      if (maxPower < 100) powerRanges['< 100kW']++;
      else if (maxPower < 300) powerRanges['100-300kW']++;
      else if (maxPower < 500) powerRanges['300-500kW']++;
      else if (maxPower < 1000) powerRanges['500-1000kW']++;
      else powerRanges['> 1000kW']++;
    });

    // 价格数据统计
    const priceRanges = {
      '< 5万': 0,
      '5-10万': 0,
      '10-20万': 0,
      '20-50万': 0,
      '> 50万': 0,
      '无价格': 0
    };

    allGearboxes.forEach(gb => {
      const price = gb.price || gb.basePrice;
      if (!price) priceRanges['无价格']++;
      else if (price < 50000) priceRanges['< 5万']++;
      else if (price < 100000) priceRanges['5-10万']++;
      else if (price < 200000) priceRanges['10-20万']++;
      else if (price < 500000) priceRanges['20-50万']++;
      else priceRanges['> 50万']++;
    });

    return { total, seriesCount, powerRanges, priceRanges };
  }, [completeGearboxData]);

  // 统计联轴器数据
  const couplingStats = useMemo(() => {
    // flexibleCouplingsData 是一个数组，而不是对象
    const allCouplings = Array.isArray(flexibleCouplingsData) ? flexibleCouplingsData : [];

    const total = allCouplings.length;

    // 根据model前缀动态分组
    const seriesCount = {};
    allCouplings.forEach(coupling => {
      // 提取系列名称 (例如: "HGTH2" -> "HGTH", "HGTL1.8A" -> "HGTL")
      const match = coupling.model?.match(/^([A-Z]+)/);
      if (match) {
        const series = match[1];
        seriesCount[series] = (seriesCount[series] || 0) + 1;
      }
    });

    return { total, seriesCount };
  }, [flexibleCouplingsData]);

  // 统计备用泵数据
  const pumpStats = useMemo(() => {
    // standbyPumpsData 是一个数组，而不是 {pumps: []}
    const pumps = Array.isArray(standbyPumpsData) ? standbyPumpsData : [];
    const total = pumps.length;

    // 按类型分组
    const typeCount = {};
    pumps.forEach(pump => {
      const type = pump.type || '未知';
      typeCount[type] = (typeCount[type] || 0) + 1;
    });

    return { total, typeCount };
  }, [standbyPumpsData]);

  // 图表颜色
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7c7c', '#a4de6c'];

  // 系列分布数据（用于图表）
  const seriesChartData = Object.entries(gearboxStats.seriesCount).map(([name, value]) => ({
    name,
    数量: value
  }));

  // 功率分布数据
  const powerChartData = Object.entries(gearboxStats.powerRanges).map(([name, value]) => ({
    name,
    数量: value
  }));

  // 价格分布数据
  const priceChartData = Object.entries(gearboxStats.priceRanges).map(([name, value]) => ({
    name,
    数量: value
  }));

  // 加载中显示
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
      <h4 className="mb-4">📊 数据统计概览</h4>

      {/* 数据总览卡片 */}
      <Row className="mb-4">
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-primary mb-2">{gearboxStats.total}</div>
              <h5>齿轮箱型号</h5>
              <Badge bg="info">9个系列</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-success mb-2">{couplingStats.total}</div>
              <h5>高弹联轴器</h5>
              <Badge bg="success">4个系列</Badge>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="shadow-sm h-100">
            <Card.Body className="text-center">
              <div className="display-4 text-warning mb-2">{pumpStats.total}</div>
              <h5>备用泵型号</h5>
              <Badge bg="warning">多种类型</Badge>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 齿轮箱系列分布 */}
      <Card className="shadow-sm mb-4">
        <Card.Header>
          <h5 className="mb-0">齿轮箱系列分布</h5>
        </Card.Header>
        <Card.Body>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seriesChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="数量" fill="#0088FE" />
            </BarChart>
          </ResponsiveContainer>
        </Card.Body>
      </Card>

      {/* 功率范围和价格分布 */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header>
              <h5 className="mb-0">功率范围分布</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={powerChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="数量"
                  >
                    {powerChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm h-100">
            <Card.Header>
              <h5 className="mb-0">价格区间分布</h5>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={priceChartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                    outerRadius={80}
                    fill="#82ca9d"
                    dataKey="数量"
                  >
                    {priceChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 详细统计表 */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">齿轮箱系列明细</h5>
            </Card.Header>
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
                  {Object.entries(gearboxStats.seriesCount).map(([series, count]) => (
                    <tr key={series}>
                      <td><strong>{series}</strong></td>
                      <td>{count}</td>
                      <td>{((count / gearboxStats.total) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm mb-4">
            <Card.Header>
              <h5 className="mb-0">联轴器系列明细</h5>
            </Card.Header>
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
                  {Object.entries(couplingStats.seriesCount).map(([series, count]) => (
                    <tr key={series}>
                      <td><strong>{series}</strong></td>
                      <td>{count}</td>
                      <td>{((count / couplingStats.total) * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 备用泵类型统计 */}
      <Card className="shadow-sm">
        <Card.Header>
          <h5 className="mb-0">备用泵类型分布</h5>
        </Card.Header>
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
              {Object.entries(pumpStats.typeCount).map(([type, count]) => (
                <tr key={type}>
                  <td><strong>{type}</strong></td>
                  <td>{count}</td>
                  <td>{((count / pumpStats.total) * 100).toFixed(1)}%</td>
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
