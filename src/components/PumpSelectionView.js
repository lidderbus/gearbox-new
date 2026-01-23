// src/components/PumpSelectionView.js
// 备用泵选型界面组件
// 版本: v1.0 (2025-12-14)
// 支持齿轮箱匹配、参数选型、型号浏览三种模式

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { Card, Row, Col, Form, Button, Table, Alert, Badge, Tabs, Tab, InputGroup, Spinner } from 'react-bootstrap';
// 性能优化: 改为动态导入
// import { standbyPumps, pumpCategories, pumpSeriesInfo } from '../data/standbyPumps';
import {
  selectPumpByParameters,
  selectPumpByGearbox,
  needsStandbyPump,
  formatPumpInfo,
  loadStandbyPumpsData,
  getStandbyPumps,
  getPumpCategories,
  getPumpSeriesInfo
} from '../utils/pumpSelectionAlgorithm';

const PumpSelectionView = ({
  appData,
  selectedGearbox,
  onSelectPump,
  theme = 'light',
  colors = {}
}) => {
  // 性能优化: 动态加载数据状态
  const [dataLoading, setDataLoading] = useState(true);
  const [standbyPumpsData, setStandbyPumpsData] = useState([]);
  const [pumpCategories, setPumpCategories] = useState({});
  const [pumpSeriesInfo, setPumpSeriesInfo] = useState({});

  // 动态加载数据
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await loadStandbyPumpsData();
        setStandbyPumpsData(data.standbyPumps || []);
        setPumpCategories(data.pumpCategories || {});
        setPumpSeriesInfo(data.pumpSeriesInfo || {});
      } catch (error) {
        console.error('PumpSelectionView: 数据加载失败', error);
      } finally {
        setDataLoading(false);
      }
    };
    loadData();
  }, []);

  // 选型模式
  const [selectionMode, setSelectionMode] = useState('auto');

  // 手动选型参数
  const [flowRequired, setFlowRequired] = useState('');
  const [pressureRequired, setPressureRequired] = useState('');
  const [applicationType, setApplicationType] = useState('general');

  // 选型结果
  const [selectionResult, setSelectionResult] = useState(null);
  const [selectedPump, setSelectedPump] = useState(null);

  // 浏览模式筛选
  const [browseCategory, setBrowseCategory] = useState('all');

  // 获取泵列表
  const pumpList = useMemo(() => {
    return appData?.standbyPumps || standbyPumpsData;
  }, [appData, standbyPumpsData]);

  // 自动匹配 - 基于齿轮箱
  const autoMatchResult = useMemo(() => {
    if (!selectedGearbox?.model) return null;
    return selectPumpByGearbox(selectedGearbox.model, pumpList);
  }, [selectedGearbox, pumpList]);

  // 检查是否需要备用泵
  const requiresPump = useMemo(() => {
    if (!selectedGearbox?.model) return false;
    return needsStandbyPump(selectedGearbox.model, { power: selectedGearbox.maxPower });
  }, [selectedGearbox]);

  // 手动选型执行
  const handleManualSelection = useCallback(() => {
    const flow = parseFloat(flowRequired);
    const pressure = parseFloat(pressureRequired);

    if (isNaN(flow) || flow <= 0) {
      setSelectionResult({ success: false, message: '请输入有效的流量需求' });
      return;
    }
    if (isNaN(pressure) || pressure <= 0) {
      setSelectionResult({ success: false, message: '请输入有效的压力需求' });
      return;
    }

    const result = selectPumpByParameters({
      flowRequired: flow,
      pressureRequired: pressure,
      applicationType
    }, pumpList);

    setSelectionResult(result);
    if (result.success) {
      setSelectedPump(result);
    }
  }, [flowRequired, pressureRequired, applicationType, pumpList]);

  // 选择泵
  const handleSelectPump = useCallback((pump) => {
    setSelectedPump(pump);
    if (onSelectPump) {
      onSelectPump(pump);
    }
  }, [onSelectPump]);

  // 按分类筛选的泵列表
  const filteredPumps = useMemo(() => {
    if (browseCategory === 'all') return pumpList;
    const categoryPumps = pumpCategories[browseCategory];
    if (!categoryPumps) return pumpList;
    return pumpList.filter(p => categoryPumps.includes(p.model));
  }, [pumpList, browseCategory, pumpCategories]);

  // 样式
  const cardStyle = {
    backgroundColor: colors.cardBg || '#fff',
    borderColor: colors.border || '#dee2e6'
  };

  const headerStyle = {
    backgroundColor: colors.headerBg || '#f8f9fa',
    color: colors.headerText || '#212529',
    borderBottom: `1px solid ${colors.border || '#dee2e6'}`
  };

  // 渲染泵详情
  const renderPumpDetails = (pump, showSelect = true) => {
    if (!pump) return null;
    const info = formatPumpInfo(pump);
    const isElectric = pump.type === 'electric';

    return (
      <Card className="mb-3" style={cardStyle}>
        <Card.Header style={headerStyle} className="d-flex justify-content-between align-items-center">
          <span>
            {pump.model}
            <Badge bg={isElectric ? 'primary' : 'secondary'} className="ms-2">
              {isElectric ? 'DT系列电动泵' : 'D系列齿轮泵'}
            </Badge>
          </span>
          {pump.matchType && (
            <Badge bg={pump.matchType === '最佳匹配' ? 'success' : pump.matchType === '良好匹配' ? 'info' : 'warning'}>
              {pump.matchType}
            </Badge>
          )}
        </Card.Header>
        <Card.Body>
          <Table size="sm" bordered>
            <tbody>
              <tr>
                <td width="30%">型号</td>
                <td>{pump.model}</td>
              </tr>
              <tr>
                <td>系列</td>
                <td>{info?.seriesLabel || pump.series}</td>
              </tr>
              <tr>
                <td>流量</td>
                <td>{pump.flow} L/min</td>
              </tr>
              <tr>
                <td>压力</td>
                <td>{pump.pressure} MPa</td>
              </tr>
              <tr>
                <td>电机功率</td>
                <td>{pump.motorPower} kW</td>
              </tr>
              {isElectric && (
                <tr>
                  <td>电压</td>
                  <td>{pump.voltage || '380V'} {pump.phase || '三相'}</td>
                </tr>
              )}
              <tr>
                <td>重量</td>
                <td>{pump.weight || '-'} kg</td>
              </tr>
              <tr>
                <td>市场价</td>
                <td className="text-danger fw-bold">{(pump.marketPrice || 0).toLocaleString()} 元</td>
              </tr>
              {pump.matchInfo && (
                <tr>
                  <td>匹配信息</td>
                  <td><small className="text-muted">{pump.matchInfo}</small></td>
                </tr>
              )}
              {pump.notes && (
                <tr>
                  <td>备注</td>
                  <td><small>{pump.notes}</small></td>
                </tr>
              )}
            </tbody>
          </Table>
          {showSelect && (
            <Button
              variant={selectedPump?.model === pump.model ? 'success' : 'outline-primary'}
              onClick={() => handleSelectPump(pump)}
              disabled={selectedPump?.model === pump.model}
            >
              {selectedPump?.model === pump.model ? '已选择' : '选择此泵'}
            </Button>
          )}
        </Card.Body>
      </Card>
    );
  };

  // 渲染自动匹配Tab
  const renderAutoTab = () => (
    <div className="mt-3">
      {selectedGearbox?.model ? (
        <>
          <Alert variant="info">
            当前齿轮箱: <strong>{selectedGearbox.model}</strong>
            {requiresPump ? (
              <Badge bg="warning" className="ms-2">需要备用泵</Badge>
            ) : (
              <Badge bg="secondary" className="ms-2">无需备用泵</Badge>
            )}
          </Alert>

          {autoMatchResult?.success ? (
            <>
              <h6>推荐备用泵</h6>
              {renderPumpDetails(autoMatchResult)}

              {autoMatchResult.alternatives && autoMatchResult.alternatives.length > 0 && (
                <>
                  <h6 className="mt-4">备选型号</h6>
                  <Row>
                    {autoMatchResult.alternatives.map(alt => (
                      <Col md={6} key={alt.model}>
                        {renderPumpDetails(alt)}
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </>
          ) : (
            <Alert variant="warning">
              {autoMatchResult?.message || '未找到匹配的备用泵'}
              <br />
              <small>可以尝试使用"参数选型"功能手动选择</small>
            </Alert>
          )}
        </>
      ) : (
        <Alert variant="secondary">
          请先在"齿轮箱选型"中选择一个齿轮箱型号，或使用"参数选型"功能手动选择备用泵。
        </Alert>
      )}
    </div>
  );

  // 渲染手动选型Tab
  const renderManualTab = () => (
    <div className="mt-3">
      <Card style={cardStyle}>
        <Card.Header style={headerStyle}>参数输入</Card.Header>
        <Card.Body>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>所需流量 (L/min)</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={flowRequired}
                    onChange={(e) => setFlowRequired(e.target.value)}
                    placeholder="例: 5.0"
                  />
                  <InputGroup.Text>L/min</InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  建议范围: 1.1 - 48.2 L/min
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>所需压力 (MPa)</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={pressureRequired}
                    onChange={(e) => setPressureRequired(e.target.value)}
                    placeholder="例: 2.5"
                  />
                  <InputGroup.Text>MPa</InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  建议范围: 0.8 - 6.3 MPa
                </Form.Text>
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>应用类型</Form.Label>
                <Form.Select
                  value={applicationType}
                  onChange={(e) => setApplicationType(e.target.value)}
                >
                  <option value="general">常规润滑系统</option>
                  <option value="control">控制系统</option>
                  <option value="emergency">应急高压</option>
                  <option value="dt-electric">DT电力推进系统</option>
                </Form.Select>
                <Form.Text className="text-muted">
                  DT电力推进系统将仅显示2CYA电动泵
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" onClick={handleManualSelection}>
            执行选型
          </Button>
        </Card.Body>
      </Card>

      {selectionResult && (
        <div className="mt-4">
          {selectionResult.success ? (
            <>
              <Alert variant="success">
                {selectionResult.message}
              </Alert>
              <h6>推荐备用泵</h6>
              {renderPumpDetails(selectionResult)}

              {selectionResult.alternatives && selectionResult.alternatives.length > 0 && (
                <>
                  <h6 className="mt-4">备选型号</h6>
                  <Row>
                    {selectionResult.alternatives.map(alt => (
                      <Col md={6} key={alt.model}>
                        {renderPumpDetails(alt)}
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </>
          ) : (
            <Alert variant="warning">
              {selectionResult.message}
              {selectionResult.suggestion && (
                <div className="mt-2">
                  <small>
                    可用流量范围: {selectionResult.suggestion.availableFlowRange}<br />
                    可用压力范围: {selectionResult.suggestion.availablePressureRange}
                  </small>
                </div>
              )}
            </Alert>
          )}
        </div>
      )}
    </div>
  );

  // 渲染浏览Tab
  const renderBrowseTab = () => (
    <div className="mt-3">
      <Form.Group className="mb-3">
        <Form.Label>按分类筛选</Form.Label>
        <Form.Select
          value={browseCategory}
          onChange={(e) => setBrowseCategory(e.target.value)}
        >
          <option value="all">全部型号 ({pumpList.length})</option>
          {Object.entries(pumpCategories).map(([category, pumps]) => (
            <option key={category} value={category}>
              {category} ({pumps.length})
            </option>
          ))}
        </Form.Select>
      </Form.Group>

      {browseCategory !== 'all' && pumpSeriesInfo[
        browseCategory === 'DT系列电动泵' ? '2CYA' :
        browseCategory === 'D系列齿轮泵' ? '2CY-D' : null
      ] && (
        <Alert variant="info" className="mb-3">
          <strong>{pumpSeriesInfo[browseCategory === 'DT系列电动泵' ? '2CYA' : '2CY-D'].name}</strong>
          <br />
          <small>{pumpSeriesInfo[browseCategory === 'DT系列电动泵' ? '2CYA' : '2CY-D'].description}</small>
          <br />
          <small>流量范围: {pumpSeriesInfo[browseCategory === 'DT系列电动泵' ? '2CYA' : '2CY-D'].flowRange}</small>
          <small className="ms-3">压力范围: {pumpSeriesInfo[browseCategory === 'DT系列电动泵' ? '2CYA' : '2CY-D'].pressureRange}</small>
        </Alert>
      )}

      <Table striped bordered hover size="sm">
        <thead>
          <tr>
            <th>型号</th>
            <th>系列</th>
            <th>流量 (L/min)</th>
            <th>压力 (MPa)</th>
            <th>功率 (kW)</th>
            <th>重量 (kg)</th>
            <th>市场价 (元)</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredPumps.map(pump => (
            <tr key={pump.model}>
              <td>
                {pump.model}
                {pump.type === 'electric' && (
                  <Badge bg="primary" className="ms-1" style={{ fontSize: '0.65em' }}>电动</Badge>
                )}
              </td>
              <td>{pump.series}</td>
              <td>{pump.flow}</td>
              <td>{pump.pressure}</td>
              <td>{pump.motorPower}</td>
              <td>{pump.weight || '-'}</td>
              <td>{(pump.marketPrice || 0).toLocaleString()}</td>
              <td>
                <Button
                  variant={selectedPump?.model === pump.model ? 'success' : 'outline-primary'}
                  size="sm"
                  onClick={() => handleSelectPump(pump)}
                  disabled={selectedPump?.model === pump.model}
                >
                  {selectedPump?.model === pump.model ? '已选' : '选择'}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Card style={cardStyle}>
      <Card.Header style={headerStyle}>
        <span className="me-2">备用泵选型</span>
        {selectedPump && (
          <Badge bg="success">
            已选: {selectedPump.model}
          </Badge>
        )}
      </Card.Header>
      <Card.Body>
        <Tabs
          activeKey={selectionMode}
          onSelect={(k) => setSelectionMode(k)}
          className="mb-3"
        >
          <Tab eventKey="auto" title="齿轮箱匹配">
            {renderAutoTab()}
          </Tab>
          <Tab eventKey="manual" title="参数选型">
            {renderManualTab()}
          </Tab>
          <Tab eventKey="browse" title="全部泵型">
            {renderBrowseTab()}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default PumpSelectionView;
