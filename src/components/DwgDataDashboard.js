// DWG外形图数据中心 - 可视化Dashboard
// 创建于: 2025-12-15
// 功能: 展示192个DWG外形图的技术参数统计、系列分布和数据表格

import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Form, Button, InputGroup, Tabs, Tab, ProgressBar, Alert, Spinner } from 'react-bootstrap';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
// 性能优化: 改为动态导入
// import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
// import { dwgTechParams, dwgDataStats, getMatchedModels, getUnmatchedModels, getAllGearboxes, getAllCouplings, getSeriesList } from '../data/dwgTechParams';

// 动态加载 xlsx
async function loadXLSX() {
  return await import(/* webpackChunkName: "xlsx" */ 'xlsx');
}

// 颜色配置
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#8DD1E1', '#A4DE6C', '#D0ED57'];
const STATUS_COLORS = {
  matched: '#28a745',
  unmatched: '#dc3545',
  coupling: '#17a2b8'
};

const DwgDataDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSeries, setFilterSeries] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [sortField, setSortField] = useState('model');
  const [sortDirection, setSortDirection] = useState('asc');

  // 高级筛选状态
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);
  const [powerRangeMin, setPowerRangeMin] = useState('');
  const [powerRangeMax, setPowerRangeMax] = useState('');
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  // 性能优化: 动态加载数据状态
  const [dataLoading, setDataLoading] = useState(true);
  const [dwgTechParams, setDwgTechParams] = useState({});
  const [dwgDataStats, setDwgDataStats] = useState({ total: 0, totalFiles: 0, gearbox: 0, coupling: 0, matched: 0, unmatched: 0, seriesStats: {}, paramCoverage: {} });
  const [seriesListData, setSeriesListData] = useState([]);
  const [unmatchedModels, setUnmatchedModels] = useState([]);
  const [allCouplings, setAllCouplings] = useState([]);

  // 动态加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const module = await import(
          /* webpackChunkName: "dwg-data" */
          '../data/dwgTechParams'
        );
        setDwgTechParams(module.dwgTechParams || {});
        setDwgDataStats(module.dwgDataStats || { total: 0, totalFiles: 0, gearbox: 0, coupling: 0, matched: 0, unmatched: 0, seriesStats: {} });
        setSeriesListData(module.getSeriesList ? module.getSeriesList() : []);
        setUnmatchedModels(module.getUnmatchedModels ? module.getUnmatchedModels() : []);
        setAllCouplings(module.getAllCouplings ? module.getAllCouplings() : []);
      } catch (error) {
        console.error('DwgDataDashboard: 数据加载失败', error);
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, []);

  // 获取所有数据
  const allData = useMemo(() => Object.values(dwgTechParams), [dwgTechParams]);
  const seriesList = useMemo(() => seriesListData, [seriesListData]);

  // 统计数据
  const stats = useMemo(() => ({
    total: dwgDataStats.total,
    totalFiles: dwgDataStats.totalFiles,
    gearbox: dwgDataStats.gearbox,
    coupling: dwgDataStats.coupling,
    matched: dwgDataStats.matched,
    unmatched: dwgDataStats.unmatched,
    matchRate: dwgDataStats.gearbox > 0 ? ((dwgDataStats.matched / dwgDataStats.gearbox) * 100).toFixed(1) : '0'
  }), [dwgDataStats]);

  // 系列分布数据 (用于饼图) — 超过10个系列合并为"其他"
  const seriesChartData = useMemo(() => {
    const entries = Object.entries(dwgDataStats.seriesStats || {})
      .map(([name, data]) => ({
        name: name === 'OTHER' || name === 'other' ? '其他' : name,
        value: data.count,
        files: data.files,
        matched: data.matched
      }))
      .sort((a, b) => b.value - a.value);

    if (entries.length <= 10) return entries;

    const top9 = entries.slice(0, 9);
    const rest = entries.slice(9);
    const otherValue = rest.reduce((sum, e) => sum + e.value, 0);
    const otherFiles = rest.reduce((sum, e) => sum + (e.files || 0), 0);
    const otherMatched = rest.reduce((sum, e) => sum + (e.matched || 0), 0);
    top9.push({ name: `其他(${rest.length}个)`, value: otherValue, files: otherFiles, matched: otherMatched });
    return top9;
  }, [dwgDataStats]);

  // 参数覆盖率数据 (用于柱状图)
  const coverageChartData = useMemo(() => {
    const gearboxCount = dwgDataStats.gearbox || 1;  // 避免除以0
    const coverage = dwgDataStats.paramCoverage || {};
    return [
      { name: '功率范围', value: coverage.powerRange || 0, percent: ((coverage.powerRange || 0) / gearboxCount * 100).toFixed(1) },
      { name: '转速范围', value: coverage.speedRange || 0, percent: ((coverage.speedRange || 0) / gearboxCount * 100).toFixed(1) },
      { name: '速比', value: coverage.ratios || 0, percent: ((coverage.ratios || 0) / gearboxCount * 100).toFixed(1) },
      { name: '推力', value: coverage.thrust || 0, percent: ((coverage.thrust || 0) / gearboxCount * 100).toFixed(1) },
      { name: '重量', value: coverage.weight || 0, percent: ((coverage.weight || 0) / gearboxCount * 100).toFixed(1) },
      { name: '尺寸', value: coverage.dimensions || 0, percent: ((coverage.dimensions || 0) / gearboxCount * 100).toFixed(1) }
    ];
  }, [dwgDataStats]);

  // 过滤和排序数据
  const filteredData = useMemo(() => {
    let result = allData;

    // 搜索过滤
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item =>
        item.model.toLowerCase().includes(term) ||
        item.series?.toLowerCase().includes(term)
      );
    }

    // 系列过滤
    if (filterSeries !== 'all') {
      result = result.filter(item => item.series === filterSeries);
    }

    // 状态过滤
    if (filterStatus !== 'all') {
      result = result.filter(item => item.matchStatus === filterStatus);
    }

    // 类型过滤
    if (filterType !== 'all') {
      result = result.filter(item => item.type === filterType);
    }

    // 功率范围过滤
    if (powerRangeMin !== '' || powerRangeMax !== '') {
      result = result.filter(item => {
        const minPower = item.techParams?.minPower;
        const maxPower = item.techParams?.maxPower;
        if (minPower === null && maxPower === null) return false;

        const filterMin = powerRangeMin !== '' ? parseFloat(powerRangeMin) : 0;
        const filterMax = powerRangeMax !== '' ? parseFloat(powerRangeMax) : Infinity;

        // 检查功率范围是否有交集
        if (maxPower !== null && maxPower < filterMin) return false;
        if (minPower !== null && minPower > filterMax) return false;
        return true;
      });
    }

    // 排序
    result.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === 'dwgCount') {
        aVal = a.dwgCount || 0;
        bVal = b.dwgCount || 0;
      }

      if (typeof aVal === 'string') {
        aVal = aVal?.toLowerCase() || '';
        bVal = bVal?.toLowerCase() || '';
      }

      if (sortDirection === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return result;
  }, [allData, searchTerm, filterSeries, filterStatus, filterType, sortField, sortDirection, powerRangeMin, powerRangeMax]);

  // 处理图表点击 - 系列筛选
  const handleSeriesChartClick = useCallback((data) => {
    if (data && data.name) {
      const seriesName = data.name === '其他' ? 'OTHER' : data.name;
      setFilterSeries(seriesName);
      setActiveTab('table');
    }
  }, []);

  // 处理柱状图点击 - 参数筛选
  const handleBarChartClick = useCallback((data) => {
    if (data && data.activePayload && data.activePayload[0]) {
      const paramName = data.activePayload[0].payload.name;
      // 根据参数名设置对应筛选
      if (paramName === '功率范围') {
        setPowerRangeMin('1');
        setPowerRangeMax('');
      }
      setShowAdvancedFilter(true);
      setActiveTab('table');
    }
  }, []);

  // 导出CSV
  const exportCSV = useCallback((exportSelected = false) => {
    const dataToExport = exportSelected && selectedRows.size > 0
      ? filteredData.filter(item => selectedRows.has(item.model))
      : filteredData;

    // CSV表头
    const headers = ['型号', '系列', '类型', '匹配状态', '功率范围', '转速范围', '速比', '推力', '重量', '尺寸', 'DWG文件数'];

    // CSV数据行
    const rows = dataToExport.map(item => [
      item.model,
      item.series,
      item.type === 'gearbox' ? '齿轮箱' : '联轴器',
      item.matchStatus === 'matched' ? '已匹配' : (item.matchStatus === 'coupling' ? '联轴器' : '待补充'),
      item.techParams?.powerRange || '',
      item.techParams?.speedRange || '',
      item.techParams?.ratios?.join(';') || '',
      item.techParams?.thrust || '',
      item.techParams?.weight || '',
      item.techParams?.dimensions || '',
      item.dwgCount
    ]);

    // 组合CSV内容
    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    // 添加BOM以支持中文
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const suffix = exportSelected ? '-selected' : '';
    saveAs(blob, `dwg-tech-params${suffix}-${new Date().toISOString().split('T')[0]}.csv`);
  }, [filteredData, selectedRows]);

  // 处理行选择
  const handleRowSelect = useCallback((model) => {
    setSelectedRows(prev => {
      const newSet = new Set(prev);
      if (newSet.has(model)) {
        newSet.delete(model);
      } else {
        newSet.add(model);
      }
      return newSet;
    });
  }, []);

  // 全选/取消全选
  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(filteredData.map(item => item.model)));
    }
    setSelectAll(!selectAll);
  }, [selectAll, filteredData]);

  // 清除所有筛选
  const clearAllFilters = useCallback(() => {
    setSearchTerm('');
    setFilterSeries('all');
    setFilterStatus('all');
    setFilterType('all');
    setPowerRangeMin('');
    setPowerRangeMax('');
  }, []);

  // 导出JSON
  const exportJSON = useCallback((exportSelected = false) => {
    const dataToExport = exportSelected && selectedRows.size > 0
      ? filteredData.filter(item => selectedRows.has(item.model))
      : filteredData;

    const data = {
      exportTime: new Date().toISOString(),
      stats: dwgDataStats,
      count: dataToExport.length,
      data: dataToExport
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const suffix = exportSelected ? '-selected' : '';
    saveAs(blob, `dwg-tech-params${suffix}-${new Date().toISOString().split('T')[0]}.json`);
  }, [filteredData, selectedRows]);

  // 导出Excel
  const exportExcel = useCallback(async (exportSelected = false) => {
    // 动态加载 xlsx
    const XLSX = await loadXLSX();

    const dataToExport = exportSelected && selectedRows.size > 0
      ? filteredData.filter(item => selectedRows.has(item.model))
      : filteredData;

    // 准备数据
    const excelData = dataToExport.map(item => ({
      '型号': item.model,
      '系列': item.series,
      '类型': item.type === 'gearbox' ? '齿轮箱' : '联轴器',
      '匹配状态': item.matchStatus === 'matched' ? '已匹配' : (item.matchStatus === 'coupling' ? '联轴器' : '待补充'),
      '功率范围': item.techParams?.powerRange || '-',
      '转速范围': item.techParams?.speedRange || '-',
      '速比': item.techParams?.ratios?.join(', ') || '-',
      '推力(kN)': item.techParams?.thrustValue || '-',
      '重量(kg)': item.techParams?.weightValue || '-',
      '尺寸(mm)': item.techParams?.dimensions || '-',
      'DWG文件数': item.dwgCount,
      '数据来源': item.dataSource === 'database' ? '主数据库' : '仅DWG'
    }));

    // 创建工作簿
    const wb = XLSX.utils.book_new();

    // 数据表
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'DWG数据');

    // 统计表
    const statsData = [
      { '项目': '总型号数', '数值': stats.total },
      { '项目': 'DWG文件数', '数值': stats.totalFiles },
      { '项目': '齿轮箱型号', '数值': stats.gearbox },
      { '项目': '联轴器型号', '数值': stats.coupling },
      { '项目': '已匹配型号', '数值': stats.matched },
      { '项目': '待补充型号', '数值': stats.unmatched },
      { '项目': '匹配率', '数值': `${stats.matchRate}%` }
    ];
    const statsWs = XLSX.utils.json_to_sheet(statsData);
    XLSX.utils.book_append_sheet(wb, statsWs, '统计');

    // 导出
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([wbout], { type: 'application/octet-stream' });
    const suffix = exportSelected ? '-selected' : '';
    saveAs(blob, `dwg-tech-params${suffix}-${new Date().toISOString().split('T')[0]}.xlsx`);
  }, [filteredData, stats, selectedRows]);

  // 切换排序
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 获取状态徽章
  const getStatusBadge = (status) => {
    switch (status) {
      case 'matched':
        return <Badge bg="success">已匹配</Badge>;
      case 'unmatched':
        return <Badge bg="danger">待补充</Badge>;
      case 'coupling':
        return <Badge bg="info">联轴器</Badge>;
      default:
        return <Badge bg="secondary">未知</Badge>;
    }
  };

  // 自定义Tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ backgroundColor: 'white', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
          <p style={{ margin: 0, fontWeight: 'bold' }}>{payload[0].name}</p>
          <p style={{ margin: 0 }}>型号数: {payload[0].value}</p>
          {payload[0].payload.files && <p style={{ margin: 0 }}>文件数: {payload[0].payload.files}</p>}
          {payload[0].payload.matched !== undefined && <p style={{ margin: 0 }}>已匹配: {payload[0].payload.matched}</p>}
        </div>
      );
    }
    return null;
  };

  // 数据加载中
  if (dataLoading) {
    return (
      <Container fluid className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">加载DWG数据...</p>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      {/* 页面标题 */}
      <Row className="mb-4">
        <Col>
          <h2 className="mb-2">
            <i className="bi bi-grid-3x3-gap-fill me-2"></i>
            DWG外形图数据中心
          </h2>
          <p className="text-muted">
            192个DWG外形图文件 | 141个型号 | 数据匹配与技术参数可视化
          </p>
        </Col>
      </Row>

      {/* 统计卡片 */}
      <Row className="mb-4 g-3">
        <Col md={3} sm={6}>
          <Card className="h-100 border-primary">
            <Card.Body className="text-center">
              <div className="display-4 text-primary fw-bold">{stats.totalFiles}</div>
              <div className="text-muted">DWG文件</div>
              <small className="text-secondary">全部外形图文件</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 border-info">
            <Card.Body className="text-center">
              <div className="display-4 text-info fw-bold">{stats.total}</div>
              <div className="text-muted">型号总数</div>
              <small className="text-secondary">齿轮箱 {stats.gearbox} + 联轴器 {stats.coupling}</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 border-success">
            <Card.Body className="text-center">
              <div className="display-4 text-success fw-bold">{stats.matched}</div>
              <div className="text-muted">已匹配</div>
              <small className="text-secondary">有完整技术参数</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} sm={6}>
          <Card className="h-100 border-warning">
            <Card.Body className="text-center">
              <div className="display-4 text-warning fw-bold">{stats.unmatched}</div>
              <div className="text-muted">待补充</div>
              <small className="text-secondary">参数缺失</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 匹配进度 */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>数据匹配进度</span>
                <span className="fw-bold">{stats.matchRate}%</span>
              </div>
              <ProgressBar>
                <ProgressBar variant="success" now={parseFloat(stats.matchRate)} key={1} label={`已匹配 ${stats.matched}`} />
                <ProgressBar variant="danger" now={100 - parseFloat(stats.matchRate)} key={2} />
              </ProgressBar>
              <small className="text-muted mt-1 d-block">
                {stats.matched} 个齿轮箱型号已关联主数据库技术参数，{stats.unmatched} 个型号待补充
              </small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 主内容区 - 标签页 */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        {/* 数据总览 */}
        <Tab eventKey="overview" title="数据总览">
          <Row className="g-4">
            {/* 系列分布饼图 */}
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <i className="bi bi-pie-chart me-2"></i>
                  系列分布
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={seriesChartData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        onClick={handleSeriesChartClick}
                        style={{ cursor: 'pointer' }}
                      >
                        {seriesChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      <i className="bi bi-hand-index me-1"></i>
                      点击扇区筛选该系列
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* 参数覆盖率柱状图 */}
            <Col lg={6}>
              <Card className="h-100">
                <Card.Header>
                  <i className="bi bi-bar-chart me-2"></i>
                  参数覆盖率 (齿轮箱)
                </Card.Header>
                <Card.Body>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={coverageChartData} layout="vertical" onClick={handleBarChartClick} style={{ cursor: 'pointer' }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} unit="%" />
                      <YAxis type="category" dataKey="name" width={80} />
                      <Tooltip
                        formatter={(value, name, props) => [`${props.payload.value}/${stats.gearbox} (${props.payload.percent}%)`, '覆盖数']}
                      />
                      <Bar dataKey="value" fill="#0088FE" name="覆盖数">
                        {coverageChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={parseFloat(entry.percent) > 50 ? '#28a745' : parseFloat(entry.percent) > 30 ? '#ffc107' : '#dc3545'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                  <div className="text-center mt-2">
                    <small className="text-muted">
                      <i className="bi bi-hand-index me-1"></i>
                      点击柱状图筛选有该参数的型号
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* 系列统计表格 */}
          <Row className="mt-4">
            <Col>
              <Card>
                <Card.Header>
                  <i className="bi bi-table me-2"></i>
                  系列统计详情
                </Card.Header>
                <Card.Body>
                  <Table striped bordered hover size="sm">
                    <thead>
                      <tr>
                        <th>系列</th>
                        <th>型号数</th>
                        <th>文件数</th>
                        <th>已匹配</th>
                        <th>匹配率</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(dwgDataStats.seriesStats)
                        .sort((a, b) => b[1].files - a[1].files)
                        .map(([series, data]) => (
                          <tr key={series}>
                            <td><strong>{series}</strong></td>
                            <td>{data.count}</td>
                            <td>{data.files}</td>
                            <td>{data.matched}</td>
                            <td>
                              <ProgressBar
                                now={(data.matched / data.count) * 100}
                                variant={(data.matched / data.count) > 0.5 ? 'success' : (data.matched / data.count) > 0.3 ? 'warning' : 'danger'}
                                style={{ minWidth: '80px' }}
                                label={`${((data.matched / data.count) * 100).toFixed(0)}%`}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* 数据表格 */}
        <Tab eventKey="table" title="完整数据">
          <Card>
            <Card.Header>
              <Row className="align-items-center g-2">
                <Col md={3}>
                  <InputGroup size="sm">
                    <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                    <Form.Control
                      placeholder="搜索型号..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={2}>
                  <Form.Select size="sm" value={filterSeries} onChange={(e) => setFilterSeries(e.target.value)}>
                    <option value="all">所有系列</option>
                    {seriesList.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select size="sm" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                    <option value="all">所有类型</option>
                    <option value="gearbox">齿轮箱</option>
                    <option value="coupling">联轴器</option>
                  </Form.Select>
                </Col>
                <Col md={2}>
                  <Form.Select size="sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                    <option value="all">所有状态</option>
                    <option value="matched">已匹配</option>
                    <option value="unmatched">待补充</option>
                    <option value="coupling">联轴器</option>
                  </Form.Select>
                </Col>
                <Col md={3} className="text-end">
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
                  >
                    <i className="bi bi-funnel me-1"></i>
                    高级
                  </Button>
                  <Button variant="outline-secondary" size="sm" className="me-2" onClick={() => exportCSV(false)}>
                    <i className="bi bi-filetype-csv me-1"></i>CSV
                  </Button>
                  <Button variant="outline-primary" size="sm" className="me-2" onClick={() => exportJSON(false)}>
                    <i className="bi bi-filetype-json me-1"></i>JSON
                  </Button>
                  <Button variant="outline-success" size="sm" onClick={() => exportExcel(false)}>
                    <i className="bi bi-file-earmark-excel me-1"></i>Excel
                  </Button>
                </Col>
              </Row>

              {/* 高级筛选面板 */}
              {showAdvancedFilter && (
                <Row className="mt-3 pt-3 border-top align-items-end g-2">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label className="small mb-1">最小功率(kW)</Form.Label>
                      <Form.Control
                        type="number"
                        size="sm"
                        placeholder="0"
                        value={powerRangeMin}
                        onChange={(e) => setPowerRangeMin(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label className="small mb-1">最大功率(kW)</Form.Label>
                      <Form.Control
                        type="number"
                        size="sm"
                        placeholder="不限"
                        value={powerRangeMax}
                        onChange={(e) => setPowerRangeMax(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Button variant="outline-danger" size="sm" onClick={clearAllFilters}>
                      <i className="bi bi-x-circle me-1"></i>清除筛选
                    </Button>
                  </Col>
                  <Col md={4} className="text-end">
                    {selectedRows.size > 0 && (
                      <>
                        <Badge bg="info" className="me-2">已选 {selectedRows.size} 项</Badge>
                        <Button variant="secondary" size="sm" className="me-2" onClick={() => exportCSV(true)}>
                          导出CSV
                        </Button>
                        <Button variant="primary" size="sm" className="me-2" onClick={() => exportJSON(true)}>
                          导出JSON
                        </Button>
                        <Button variant="success" size="sm" onClick={() => exportExcel(true)}>
                          导出Excel
                        </Button>
                      </>
                    )}
                  </Col>
                </Row>
              )}
            </Card.Header>
            <Card.Body style={{ maxHeight: '600px', overflow: 'auto' }}>
              <Table striped bordered hover size="sm" className="mb-0">
                <thead style={{ position: 'sticky', top: 0, backgroundColor: 'white', zIndex: 1 }}>
                  <tr>
                    {showAdvancedFilter && (
                      <th style={{ width: '40px' }}>
                        <Form.Check
                          type="checkbox"
                          checked={selectAll}
                          onChange={handleSelectAll}
                          title="全选/取消全选"
                        />
                      </th>
                    )}
                    <th onClick={() => handleSort('model')} style={{ cursor: 'pointer' }}>
                      型号 {sortField === 'model' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th onClick={() => handleSort('series')} style={{ cursor: 'pointer' }}>
                      系列 {sortField === 'series' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                    <th>类型</th>
                    <th>状态</th>
                    <th>功率范围</th>
                    <th>转速范围</th>
                    <th>速比</th>
                    <th>推力</th>
                    <th>重量</th>
                    <th onClick={() => handleSort('dwgCount')} style={{ cursor: 'pointer' }}>
                      DWG数 {sortField === 'dwgCount' && (sortDirection === 'asc' ? '↑' : '↓')}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredData.map(item => (
                    <tr
                      key={item.model}
                      className={selectedRows.has(item.model) ? 'table-primary' : ''}
                    >
                      {showAdvancedFilter && (
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedRows.has(item.model)}
                            onChange={() => handleRowSelect(item.model)}
                          />
                        </td>
                      )}
                      <td><strong>{item.model}</strong></td>
                      <td>{item.series}</td>
                      <td>
                        {item.type === 'gearbox' ?
                          <Badge bg="primary">齿轮箱</Badge> :
                          <Badge bg="info">联轴器</Badge>
                        }
                      </td>
                      <td>{getStatusBadge(item.matchStatus)}</td>
                      <td>{item.techParams?.powerRange || <span className="text-muted">-</span>}</td>
                      <td>{item.techParams?.speedRange || <span className="text-muted">-</span>}</td>
                      <td>
                        {item.techParams?.ratios?.length > 0 ?
                          (item.techParams.ratios.length > 3 ?
                            `${item.techParams.ratios.slice(0, 3).join(', ')}...` :
                            item.techParams.ratios.join(', ')
                          ) :
                          <span className="text-muted">-</span>
                        }
                      </td>
                      <td>{item.techParams?.thrust || <span className="text-muted">-</span>}</td>
                      <td>{item.techParams?.weight || <span className="text-muted">-</span>}</td>
                      <td>
                        <Badge bg="secondary">{item.dwgCount}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
              {filteredData.length === 0 && (
                <Alert variant="info" className="mt-3 mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  没有找到符合条件的数据
                </Alert>
              )}
            </Card.Body>
            <Card.Footer className="text-muted">
              显示 {filteredData.length} / {allData.length} 条记录
            </Card.Footer>
          </Card>
        </Tab>

        {/* 待补充清单 */}
        <Tab eventKey="unmatched" title={`待补充 (${stats.unmatched})`}>
          <Card>
            <Card.Header className="bg-warning text-dark">
              <i className="bi bi-exclamation-triangle me-2"></i>
              待补充技术参数的型号清单
            </Card.Header>
            <Card.Body>
              <Alert variant="warning">
                <i className="bi bi-info-circle me-2"></i>
                以下 {stats.unmatched} 个齿轮箱型号在主数据库中未找到匹配记录，需要补充技术参数数据。
              </Alert>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>型号</th>
                    <th>系列</th>
                    <th>DWG文件数</th>
                    <th>文件名</th>
                  </tr>
                </thead>
                <tbody>
                  {unmatchedModels.map((item, index) => (
                    <tr key={item.model}>
                      <td>{index + 1}</td>
                      <td><strong>{item.model}</strong></td>
                      <td>{item.series}</td>
                      <td><Badge bg="secondary">{item.dwgCount}</Badge></td>
                      <td>
                        <small className="text-muted">
                          {item.dwgFiles?.slice(0, 2).map(f => f.fileName).join(', ')}
                          {item.dwgFiles?.length > 2 && '...'}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>

        {/* 联轴器 */}
        <Tab eventKey="coupling" title={`联轴器 (${stats.coupling})`}>
          <Card>
            <Card.Header className="bg-info text-white">
              <i className="bi bi-link-45deg me-2"></i>
              联轴器DWG外形图
            </Card.Header>
            <Card.Body>
              <Table striped bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>型号</th>
                    <th>系列</th>
                    <th>DWG文件数</th>
                    <th>文件名</th>
                  </tr>
                </thead>
                <tbody>
                  {allCouplings.map((item, index) => (
                    <tr key={item.model}>
                      <td>{index + 1}</td>
                      <td><strong>{item.model}</strong></td>
                      <td>{item.series}</td>
                      <td><Badge bg="info">{item.dwgCount}</Badge></td>
                      <td>
                        <small className="text-muted">
                          {item.dwgFiles?.slice(0, 2).map(f => f.fileName).join(', ')}
                          {item.dwgFiles?.length > 2 && '...'}
                        </small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default DwgDataDashboard;
