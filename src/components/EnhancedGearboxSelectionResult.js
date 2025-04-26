// src/components/EnhancedGearboxSelectionResult.js - 最终修复版本
import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Badge, Button, Tabs, Tab, Alert, Accordion, Form, ListGroup } from 'react-bootstrap';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

/**
 * 增强的齿轮箱选型结果组件
 * 包含齿轮箱选型结果、高弹联轴器信息和对比功能
 */
const EnhancedGearboxSelectionResult = ({ 
  result, 
  selectedIndex = 0, 
  onSelectGearbox, 
  onGenerateQuotation, 
  onGenerateAgreement,
  colors,
  theme = 'light'
}) => {
  // 状态管理 - 所有Hooks必须在组件顶层无条件调用
  const [activeTab, setActiveTab] = useState('details');
  const [comparisonMode, setComparisonMode] = useState(false);
  const [comparedGearboxes, setComparedGearboxes] = useState([]);
  const [selectedAccessories, setSelectedAccessories] = useState({
    coupling: null,
    pump: null
  });

  // 获取高弹联轴器和备用泵数据
  const couplingResult = result?.flexibleCoupling || null;
  const pumpResult = result?.standbyPump || null;

  // 在组件挂载或依赖项更改时初始化已选配件
  useEffect(() => {
    if (couplingResult && couplingResult.success) {
      setSelectedAccessories(prev => ({
        ...prev,
        coupling: couplingResult
      }));
    }
    
    if (pumpResult && pumpResult.success) {
      setSelectedAccessories(prev => ({
        ...prev,
        pump: pumpResult
      }));
    }
  }, [couplingResult, pumpResult]);

  // 如果没有结果，提前返回
  if (!result || !result.recommendations || result.recommendations.length === 0) {
    return (
      <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }}>
        <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
          <i className="bi bi-gear-fill me-2"></i>选型结果
        </Card.Header>
        <Card.Body>
          <div className="text-center py-4">
            <i className="bi bi-exclamation-triangle-fill text-warning" style={{ fontSize: '2rem' }}></i>
            <p className="mt-3">没有找到符合条件的齿轮箱。请调整选型参数后重试。</p>
            {result && result.message && (
              <Alert variant="warning" className="mt-3">
                <i className="bi bi-info-circle-fill me-2"></i>
                {result.message}
              </Alert>
            )}
          </div>
        </Card.Body>
      </Card>
    );
  }

  // 获取必要数据
  const recommendations = result.recommendations || [];
  const selectedGearbox = recommendations[selectedIndex];
  const isPartialMatch = selectedGearbox.isPartialMatch === true;

  // 对比功能处理
  const toggleCompareGearbox = (gearbox) => {
    if (comparedGearboxes.some(g => g.model === gearbox.model)) {
      setComparedGearboxes(comparedGearboxes.filter(g => g.model !== gearbox.model));
    } else {
      // 最多比较4个齿轮箱
      if (comparedGearboxes.length < 4) {
        setComparedGearboxes([...comparedGearboxes, gearbox]);
      } else {
        alert('最多可以比较4个齿轮箱');
      }
    }
  };

  // 计算齿轮箱性能指标
  const calculatePerformanceMetrics = (gearbox) => {
    return {
      capacityScore: Math.min(100, 100 - Math.abs(gearbox.capacityMargin - 15) * 2),
      ratioMatchScore: Math.max(0, 100 - gearbox.ratioDiffPercent * 5),
      thrustCapacity: gearbox.thrust ? Math.min(100, (gearbox.thrust / 300) * 100) : 50,
      efficiencyScore: gearbox.efficiency ? gearbox.efficiency * 100 : 95,
      pricePerformanceScore: Math.max(0, 100 - ((gearbox.marketPrice / 300000) * 100))
    };
  };

  // 生成齿轮箱对比数据
  const generateComparisonData = () => {
    const comparisonItems = [selectedGearbox, ...comparedGearboxes.filter(g => g.model !== selectedGearbox.model)];
    
    return comparisonItems.map(gearbox => {
      const metrics = calculatePerformanceMetrics(gearbox);
      
      return {
        name: gearbox.model,
        '传递能力': gearbox.selectedCapacity || 0,
        '减速比': gearbox.selectedRatio || gearbox.ratio || 0,
        '能力余量(%)': gearbox.capacityMargin || 0,
        '减速比偏差(%)': gearbox.ratioDiffPercent || 0,
        '推力(kN)': gearbox.thrust || 0,
        '重量(kg)': gearbox.weight || 0,
        '价格(元)': gearbox.marketPrice || 0,
        ...metrics,
        isSelected: gearbox.model === selectedGearbox.model
      };
    });
  };

  // 生成联轴器数据
  const renderCouplingSection = () => {
    if (!couplingResult || !couplingResult.success) {
      return (
        <Alert variant="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          未能找到匹配的高弹联轴器
          {couplingResult && couplingResult.message && (
            <p className="mt-2 mb-0"><small>{couplingResult.message}</small></p>
          )}
        </Alert>
      );
    }

    // 创建联轴器扭矩组成饼图数据
    const createCouplingTorquePieData = () => {
      const requiredTorque = couplingResult.requiredTorque || 0;
      const actualTorque = couplingResult.torque || 0;
      const margin = Math.max(0, actualTorque - requiredTorque);
      
      return [
        { name: '所需扭矩', value: requiredTorque, fill: '#82ca9d' },
        { name: '扭矩余量', value: margin, fill: '#8884d8' }
      ];
    };

    return (
      <div className="coupling-section">
        <Row>
          <Col md={7}>
            <h6 style={{ color: colors?.headerText }}>高弹联轴器: {couplingResult.model}</h6>
            <Table bordered size="sm" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
              <tbody>
                <tr>
                  <td width="40%">额定扭矩</td>
                  <td>{couplingResult.torque} {couplingResult.torqueUnit || 'kN·m'}</td>
                </tr>
                <tr>
                  <td>所需扭矩</td>
                  <td>{couplingResult.requiredTorque?.toFixed(3) || '-'} kN·m</td>
                </tr>
                <tr>
                  <td>扭矩余量</td>
                  <td>
                    {couplingResult.torqueMargin?.toFixed(1)}%
                    {couplingResult.torqueMargin < 5 ? (
                      <Badge bg="danger" className="ms-2">过低</Badge>
                    ) : couplingResult.torqueMargin > 50 ? (
                      <Badge bg="warning" className="ms-2">过高</Badge>
                    ) : (
                      <Badge bg="success" className="ms-2">合适</Badge>
                    )}
                  </td>
                </tr>
                <tr>
                  <td>最大转速</td>
                  <td>{couplingResult.maxSpeed} rpm</td>
                </tr>
                <tr>
                  <td>工作条件</td>
                  <td>{result.options?.workCondition || '-'}</td>
                </tr>
                <tr>
                  <td>是否带罩壳</td>
                  <td>{result.options?.hasCover ? '是' : '否'}</td>
                </tr>
                <tr>
                  <td>重量</td>
                  <td>{couplingResult.weight || '-'} kg</td>
                </tr>
                <tr>
                  <td>价格</td>
                  <td>{(couplingResult.marketPrice || 0).toLocaleString()} 元</td>
                </tr>
              </tbody>
            </Table>
          </Col>
          <Col md={5}>
            <h6 style={{ color: colors?.headerText }}>扭矩组成</h6>
            <div style={{ width: '100%', height: 200 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={createCouplingTorquePieData()}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {createCouplingTorquePieData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Col>
        </Row>
        {couplingResult.warning && (
          <Alert variant="info" className="mt-2">
            <i className="bi bi-info-circle me-2"></i>
            {couplingResult.warning}
          </Alert>
        )}
      </div>
    );
  };

  // 生成备用泵数据
  const renderPumpSection = () => {
    if (!pumpResult || !pumpResult.success) {
      return (
        <Alert variant="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          未能找到匹配的备用泵
          {pumpResult && pumpResult.message && (
            <p className="mt-2 mb-0"><small>{pumpResult.message}</small></p>
          )}
        </Alert>
      );
    }

    return (
      <div className="pump-section">
        <h6 style={{ color: colors?.headerText }}>备用泵: {pumpResult.model}</h6>
        <Table bordered size="sm" style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
          <tbody>
            <tr>
              <td width="30%">型号</td>
              <td>{pumpResult.model}</td>
            </tr>
            <tr>
              <td>流量</td>
              <td>{pumpResult.flow} L/min</td>
            </tr>
            <tr>
              <td>压力</td>
              <td>{pumpResult.pressure} MPa</td>
            </tr>
            <tr>
              <td>电机功率</td>
              <td>{pumpResult.motorPower} kW</td>
            </tr>
            <tr>
              <td>重量</td>
              <td>{pumpResult.weight || '-'} kg</td>
            </tr>
            <tr>
              <td>价格</td>
              <td>{(pumpResult.marketPrice || 0).toLocaleString()} 元</td>
            </tr>
          </tbody>
        </Table>
        {pumpResult.warning && (
          <Alert variant="info" className="mt-2">
            <i className="bi bi-info-circle me-2"></i>
            {pumpResult.warning}
          </Alert>
        )}
      </div>
    );
  };

  // 生成对比表格
  const renderComparisonTable = () => {
    const comparisonData = generateComparisonData();
    
    if (comparisonData.length <= 1) {
      return (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          请至少选择一个额外的齿轮箱进行比较
        </Alert>
      );
    }
    
    return (
      <div className="comparison-table-container">
        <Table bordered hover responsive className="comparison-table" style={{ 
          backgroundColor: colors?.card, 
          color: colors?.text, 
          borderColor: colors?.border
        }}>
          <thead>
            <tr>
              <th>特性</th>
              {comparisonData.map(item => (
                <th key={item.name}>
                  {item.name}
                  {item.isSelected && <Badge bg="success" className="ms-2">已选</Badge>}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>传递能力 (kW/rpm)</strong></td>
              {comparisonData.map(item => (
                <td key={`${item.name}-capacity`}>{item['传递能力'].toFixed(6)}</td>
              ))}
            </tr>
            <tr>
              <td>减速比</td>
              {comparisonData.map(item => (
                <td key={`${item.name}-ratio`}>{item['减速比'].toFixed(2)}</td>
              ))}
            </tr>
            <tr>
              <td>能力余量 (%)</td>
              {comparisonData.map(item => (
                <td key={`${item.name}-margin`} className={
                  item['能力余量(%)'] >= 5 && item['能力余量(%)'] <= 20 ? 'table-success' : 
                  item['能力余量(%)'] > 30 ? 'table-warning' : 
                  item['能力余量(%)'] < 5 ? 'table-danger' : ''
                }>
                  {item['能力余量(%)'].toFixed(1)}%
                </td>
              ))}
            </tr>
            <tr>
              <td>减速比偏差 (%)</td>
              {comparisonData.map(item => (
                <td key={`${item.name}-ratio-diff`} className={
                  item['减速比偏差(%)'] <= 5 ? 'table-success' : 
                  item['减速比偏差(%)'] > 15 ? 'table-danger' : 'table-warning'
                }>
                  {item['减速比偏差(%)'].toFixed(1)}%
                </td>
              ))}
            </tr>
            <tr>
              <td>推力 (kN)</td>
              {comparisonData.map(item => (
                <td key={`${item.name}-thrust`}>
                  {item['推力(kN)'] || '-'}
                  {result.thrustRequirement > 0 && (
                    item['推力(kN)'] >= result.thrustRequirement ? 
                      <Badge bg="success" className="ms-2">满足</Badge> : 
                      <Badge bg="danger" className="ms-2">不满足</Badge>
                  )}
                </td>
              ))}
            </tr>
            <tr>
              <td>重量 (kg)</td>
              {comparisonData.map(item => (
                <td key={`${item.name}-weight`}>{item['重量(kg)']}</td>
              ))}
            </tr>
            <tr>
              <td>价格 (元)</td>
              {comparisonData.map(item => (
                <td key={`${item.name}-price`}>{item['价格(元)'].toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td>综合评分</td>
              {comparisonData.map(item => {
                const avgScore = (
                  item.capacityScore + 
                  item.ratioMatchScore + 
                  item.thrustCapacity + 
                  item.efficiencyScore + 
                  item.pricePerformanceScore
                ) / 5;
                
                return (
                  <td key={`${item.name}-score`} className={
                    avgScore >= 80 ? 'table-success' : 
                    avgScore >= 60 ? 'table-warning' : 'table-danger'
                  }>
                    {avgScore.toFixed(0)}/100
                  </td>
                );
              })}
            </tr>
            <tr>
              <td>操作</td>
              {comparisonData.map(item => (
                <td key={`${item.name}-actions`}>
                  {!item.isSelected && (
                    <Button 
                      variant="outline-primary" 
                      size="sm"
                      onClick={() => onSelectGearbox(recommendations.findIndex(g => g.model === item.name))}
                    >
                      选择
                    </Button>
                  )}
                  {item.isSelected && (
                    <Badge bg="success">当前选择</Badge>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </Table>
      </div>
    );
  };

  // 生成价格比较图
  const renderPriceComparisonChart = () => {
    const comparisonData = generateComparisonData();
    
    if (comparisonData.length <= 1) {
      return null;
    }
    
    return (
      <div className="chart-container mt-4">
        <h6 style={{ color: colors?.headerText }}>价格对比</h6>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={comparisonData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e0e0e0' : '#4a4a4a'} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: colors?.text, angle: -45, textAnchor: 'end' }} 
              height={70} 
            />
            <YAxis />
            <Tooltip formatter={(value) => value.toLocaleString() + ' 元'} />
            <Legend wrapperStyle={{ bottom: 0 }} />
            <Bar dataKey="价格(元)" name="市场价格" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 生成性能雷达图
  const renderPerformanceRadarChart = () => {
    const comparisonData = generateComparisonData();
    
    if (comparisonData.length <= 1) {
      return null;
    }
    
    // 准备雷达图数据
    const radarData = comparisonData.map(item => ({
      name: item.name,
      '传递能力': item.capacityScore,
      '减速比匹配': item.ratioMatchScore,
      '推力能力': item.thrustCapacity,
      '效率': item.efficiencyScore,
      '性价比': item.pricePerformanceScore,
      isSelected: item.isSelected
    }));
    
    return (
      <div className="chart-container mt-4">
        <h6 style={{ color: colors?.headerText }}>性能雷达图</h6>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart 
            data={radarData}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke={theme === 'light' ? '#e0e0e0' : '#4a4a4a'} />
            <XAxis dataKey="name" tick={{ fill: colors?.text }} />
            <YAxis domain={[0, 100]} tick={{ fill: colors?.text }} />
            <Tooltip />
            <Legend />
            {Object.keys(radarData[0]).filter(key => !['name', 'isSelected'].includes(key)).map((key, index) => (
              <Line 
                key={key}
                type="monotone" 
                dataKey={key} 
                stroke={`hsl(${index * 60}, 70%, 50%)`}
                activeDot={{ r: 8 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  // 渲染比较模式内容
  const renderComparisonContent = () => {
    return (
      <div className="comparison-mode mb-4">
        <Alert variant="info">
          <div className="d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-info-circle me-2"></i>
              比较模式已启用。请选择要比较的齿轮箱（最多4个）。
            </span>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={() => setComparisonMode(false)}
            >
              退出比较
            </Button>
          </div>
        </Alert>
        
        <Form>
          <div className="d-flex flex-wrap gap-2 mb-3">
            {recommendations.map((gearbox, index) => (
              <Form.Check
                key={`compare-${gearbox.model}`}
                type="checkbox"
                id={`compare-${gearbox.model}`}
                label={`${gearbox.model} ${gearbox === selectedGearbox ? '(当前选择)' : ''}`}
                checked={comparedGearboxes.some(g => g.model === gearbox.model) || gearbox === selectedGearbox}
                onChange={() => toggleCompareGearbox(gearbox)}
                disabled={gearbox === selectedGearbox} // 当前选中齿轮箱不可取消
              />
            ))}
          </div>
        </Form>
        
        {renderComparisonTable()}
        {renderPriceComparisonChart()}
        {renderPerformanceRadarChart()}
        
        <div className="d-flex justify-content-center mt-4">
          <Button 
            variant="primary"
            onClick={() => {
              setComparisonMode(false);
              setActiveTab('details');
            }}
          >
            返回详细信息
          </Button>
        </div>
        
        {result.warning && (
          <Alert variant="warning" className="mt-4">
            <i className="bi bi-exclamation-triangle me-2"></i>
            {result.warning}
          </Alert>
        )}
        
        <div className="d-flex justify-content-end mt-4">
          <Button 
            variant="outline-primary" 
            onClick={onGenerateQuotation}
            className="me-2"
          >
            <i className="bi bi-currency-yen me-1"></i> 生成报价单
          </Button>
          <Button 
            variant="outline-success" 
            onClick={onGenerateAgreement}
          >
            <i className="bi bi-file-earmark-text me-1"></i> 生成技术协议
          </Button>
        </div>
      </div>
    );
  };

  // 渲染标签页内容
  const renderTabsContent = () => {
    return (
      <>
        <Tabs 
          activeKey={activeTab} 
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
          style={{ borderBottomColor: colors?.border || '#ddd' }}
        >
          {/* 齿轮箱详细信息标签页 */}
          <Tab eventKey="details" title="齿轮箱详情">
            <Row>
              <Col md={6}>
                <h5 style={{ color: colors?.headerText || '#333' }}>选中齿轮箱: {selectedGearbox.model}</h5>
                <Table striped bordered style={{ backgroundColor: colors?.card || 'white', color: colors?.text || '#333', borderColor: colors?.border || '#ddd' }}>
                  <tbody>
                    <tr>
                      <td>传递能力</td>
                      <td>
                        {typeof selectedGearbox.selectedCapacity !== 'undefined' 
                          ? `${selectedGearbox.selectedCapacity.toFixed(6)} kW/rpm` 
                          : (typeof selectedGearbox.power === 'object' 
                            ? `标准: ${selectedGearbox.power.standard} kW / 特殊: ${selectedGearbox.power.special} kW` 
                            : `${selectedGearbox.power || '-'} kW`)}
                      </td>
                    </tr>
                    <tr>
                      <td>所需能力</td>
                      <td>{result.requiredTransferCapacity ? `${result.requiredTransferCapacity.toFixed(6)} kW/rpm` : '-'}</td>
                    </tr>
                    <tr>
                      <td>能力余量</td>
                      <td>
                        {selectedGearbox.capacityMargin !== undefined 
                          ? `${selectedGearbox.capacityMargin.toFixed(1)}%` 
                          : '-'}
                        {selectedGearbox.capacityMargin < 5 ? (
                          <Badge bg="danger" className="ms-2">过低</Badge>
                        ) : selectedGearbox.capacityMargin > 40 ? (
                          <Badge bg="warning" className="ms-2">过高</Badge>
                        ) : (
                          <Badge bg="success" className="ms-2">合适</Badge>
                        )}
                      </td>
                    </tr>
                    <tr>
                      <td>输入转速</td>
                      <td>{result.engineSpeed || selectedGearbox.inputSpeed} r/min</td>
                    </tr>
                    <tr>
                      <td>减速比</td>
                      <td>
                        {selectedGearbox.selectedRatio 
                          ? selectedGearbox.selectedRatio.toFixed(2) 
                          : (Array.isArray(selectedGearbox.ratios) 
                            ? selectedGearbox.ratios.map(r => typeof r === 'number' ? r.toFixed(2) : r).join(', ') 
                            : selectedGearbox.ratio?.toFixed(2) || '-')}
                      </td>
                    </tr>
                    <tr>
                      <td>目标减速比</td>
                      <td>
                        {result.targetRatio?.toFixed(2) || '-'}
                      </td>
                    </tr>
                    <tr>
                      <td>减速比偏差</td>
                      <td>
                        {selectedGearbox.ratioDiffPercent !== undefined
                          ? `${selectedGearbox.ratioDiffPercent.toFixed(1)}%`
                          : '-'}
                        {selectedGearbox.ratioDiffPercent > 15 && (
                          <Badge bg="warning" className="ms-2">偏差较大</Badge>
                        )}
                      </td>
                    </tr>
                    {selectedGearbox.thrust && (
                      <tr>
                        <td>额定推力</td>
                        <td>
                          {selectedGearbox.thrust} kN
                          {result.thrustRequirement > 0 && (
                            selectedGearbox.thrustMet 
                              ? <Badge bg="success" className="ms-2">满足要求</Badge>
                              : <Badge bg="danger" className="ms-2">不满足要求</Badge>
                          )}
                        </td>
                      </tr>
                    )}
                    <tr>
                      <td>重量</td>
                      <td>{selectedGearbox.weight || '-'} kg</td>
                    </tr>
                    <tr>
                      <td>价格</td>
                      <td>{(selectedGearbox.marketPrice || 0).toLocaleString()} 元</td>
                    </tr>
                    {isPartialMatch && selectedGearbox.failureReason && (
                      <tr className="table-warning">
                        <td>匹配度不足原因</td>
                        <td>{selectedGearbox.failureReason}</td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Col>
              <Col md={6}>
                <h5 style={{ color: colors?.headerText || '#333' }}>其他推荐齿轮箱</h5>
                <div className="table-responsive">
                  <Table striped bordered hover size="sm" style={{ backgroundColor: colors?.card || 'white', color: colors?.text || '#333', borderColor: colors?.border || '#ddd' }}>
                    <thead>
                      <tr>
                        <th>型号</th>
                        <th>减速比</th>
                        <th>传递能力</th>
                        <th>操作</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recommendations.map((gearbox, index) => (
                        index !== selectedIndex && (
                          <tr key={gearbox.model + index} className={gearbox.isPartialMatch ? 'table-warning' : ''}>
                            <td>
                              {gearbox.model}
                              {gearbox.isPartialMatch && <Badge bg="warning" className="ms-1">部分</Badge>}
                            </td>
                            <td>
                              {gearbox.selectedRatio?.toFixed(2) || gearbox.ratio?.toFixed(2) || '-'}
                              {gearbox.ratioDiffPercent && (
                                <small className="d-block text-muted">
                                  偏差: {gearbox.ratioDiffPercent.toFixed(1)}%
                                </small>
                              )}
                            </td>
                            <td>
                              {gearbox.selectedCapacity?.toFixed(4) || 
                               (typeof gearbox.power === 'object' 
                                ? gearbox.power.standard 
                                : gearbox.power || '-')}
                              {gearbox.capacityMargin && (
                                <small className="d-block text-muted">
                                  余量: {gearbox.capacityMargin.toFixed(1)}%
                                </small>
                              )}
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => onSelectGearbox(index)}
                              >
                                选择
                              </Button>
                            </td>
                          </tr>
                        )
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Col>
            </Row>
          </Tab>
          
          {/* 联轴器信息标签页 */}
          <Tab eventKey="coupling" title="高弹联轴器">
            {renderCouplingSection()}
          </Tab>
          
          {/* 备用泵标签页 */}
          <Tab eventKey="pump" title="备用泵">
            {renderPumpSection()}
          </Tab>
          
          {/* 组合选型标签页 */}
          <Tab eventKey="combined" title="组合选型">
            <Row>
              <Col md={6}>
                <h6 style={{ color: colors?.headerText }}>齿轮箱</h6>
                <ListGroup>
                  <ListGroup.Item style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>{selectedGearbox.model}</strong>
                        <div>
                          <small>减速比: {selectedGearbox.selectedRatio?.toFixed(2) || selectedGearbox.ratio?.toFixed(2)}</small>
                          <small className="ms-3">能力余量: {selectedGearbox.capacityMargin?.toFixed(1)}%</small>
                        </div>
                      </div>
                      <Badge bg="success">已选择</Badge>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
                
                <h6 className="mt-4" style={{ color: colors?.headerText }}>高弹联轴器</h6>
                {couplingResult && couplingResult.success ? (
                  <ListGroup>
                    <ListGroup.Item style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{couplingResult.model}</strong>
                          <div>
                            <small>扭矩: {couplingResult.torque} {couplingResult.torqueUnit || 'kN·m'}</small>
                            <small className="ms-3">余量: {couplingResult.torqueMargin?.toFixed(1)}%</small>
                          </div>
                        </div>
                        <Badge bg="success">已选择</Badge>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                ) : (
                  <Alert variant="warning">未找到合适的联轴器</Alert>
                )}
                
                <h6 className="mt-4" style={{ color: colors?.headerText }}>备用泵</h6>
                {pumpResult && pumpResult.success ? (
                  <ListGroup>
                    <ListGroup.Item style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{pumpResult.model}</strong>
                          <div>
                            <small>流量: {pumpResult.flow} L/min</small>
                            <small className="ms-3">压力: {pumpResult.pressure} MPa</small>
                          </div>
                        </div>
                        <Badge bg="success">已选择</Badge>
                      </div>
                    </ListGroup.Item>
                  </ListGroup>
                ) : (
                  <Alert variant="warning">未找到合适的备用泵</Alert>
                )}
              </Col>
              
              <Col md={6}>
                <Card style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
                  <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
                    总价格摘要
                  </Card.Header>
                  <Card.Body>
                    <Table bordered style={{ backgroundColor: colors?.card, color: colors?.text, borderColor: colors?.border }}>
                      <tbody>
                        <tr>
                          <td width="40%">齿轮箱价格</td>
                          <td>{(selectedGearbox.marketPrice || 0).toLocaleString()} 元</td>
                        </tr>
                        <tr>
                          <td>联轴器价格</td>
                          <td>{(couplingResult?.marketPrice || 0).toLocaleString()} 元</td>
                        </tr>
                        <tr>
                          <td>备用泵价格</td>
                          <td>{(pumpResult?.marketPrice || 0).toLocaleString()} 元</td>
                        </tr>
                        <tr className="table-info">
                          <td><strong>总价格</strong></td>
                          <td><strong>{((selectedGearbox.marketPrice || 0) + 
                                      (couplingResult?.marketPrice || 0) + 
                                      (pumpResult?.marketPrice || 0)).toLocaleString()} 元</strong></td>
                        </tr>
                      </tbody>
                    </Table>
                    
                    <div className="mt-3">
                      <h6 style={{ color: colors?.headerText }}>价格组成比例</h6>
                      <div style={{ width: '100%', height: 200 }}>
                        <ResponsiveContainer>
                          <PieChart>
                            <Pie
                              data={[
                                { name: '齿轮箱', value: selectedGearbox.marketPrice || 0, fill: '#8884d8' },
                                { name: '联轴器', value: couplingResult?.marketPrice || 0, fill: '#82ca9d' },
                                { name: '备用泵', value: pumpResult?.marketPrice || 0, fill: '#ffc658' }
                              ]}
                              dataKey="value"
                              nameKey="name"
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                            </Pie>
                            <Tooltip formatter={(value) => value.toLocaleString() + ' 元'} />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Tab>
        </Tabs>
          
        {result.warning && (
          <Alert variant="warning" className="mt-3">
            <i className="bi bi-info-circle-fill me-2"></i>
            {result.warning}
          </Alert>
        )}

        <div className="d-flex justify-content-end mt-4">
          <Button 
            variant="outline-primary" 
            onClick={onGenerateQuotation}
            className="me-2"
          >
            <i className="bi bi-currency-yen me-1"></i> 生成报价单
          </Button>
          <Button 
            variant="outline-success" 
            onClick={onGenerateAgreement}
          >
            <i className="bi bi-file-earmark-text me-1"></i> 生成技术协议
          </Button>
        </div>
      </>
    );
  };

  // 渲染主界面
  return (
    <Card className="shadow-sm" style={{ backgroundColor: colors?.card || 'white', borderColor: colors?.border || '#ddd' }}>
      <Card.Header style={{ backgroundColor: colors?.headerBg || '#f5f5f5', color: colors?.headerText || '#333' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span><i className="bi bi-gear-fill me-2"></i>选型结果 - {selectedGearbox.model}</span>
          <div>
            <Button 
              variant={comparisonMode ? "success" : "outline-primary"} 
              size="sm" 
              className="me-2"
              onClick={() => setComparisonMode(!comparisonMode)}
            >
              <i className={`bi bi-${comparisonMode ? 'check-circle' : 'bar-chart'} me-1`}></i>
              {comparisonMode ? '退出对比' : '对比模式'}
            </Button>
            {isPartialMatch && (
              <Badge bg="warning">部分匹配</Badge>
            )}
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        {/* 根据模式渲染不同内容 */}
        {comparisonMode ? renderComparisonContent() : renderTabsContent()}
      </Card.Body>
    </Card>
  );
};

export default EnhancedGearboxSelectionResult;