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
  enrichPumpList,
  calculateStandbyFromMain,
  getStandbyPumps,
  getPumpCategories,
  getPumpSeriesInfo
} from '../utils/pumpSelectionAlgorithm';
import { formatPrice } from '../utils/priceFormatter';
import GenericComparisonTable from './common/GenericComparisonTable';
import {
  UnitsLanguageProvider,
  UnitsLanguageToggle,
  useUnitsLanguage
} from '../contexts/UnitsLanguageContext';
import { formatValue, displayUnit } from '../utils/unitConverter';

const PumpSelectionViewInner = ({
  appData,
  selectedGearbox,
  onSelectPump,
  theme = 'light',
  colors = {}
}) => {
  const { unitSystem, t } = useUnitsLanguage();
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

  // 选型模式 — P2#10 (2026-04-30): 未选齿轮箱时默认进 "参数选型" 独立模式,
  // 不再因缺前置选型而显示空白页
  const [selectionMode, setSelectionMode] = useState(
    selectedGearbox?.model ? 'auto' : 'manual'
  );

  // 手动选型参数
  const [flowRequired, setFlowRequired] = useState('');
  const [pressureRequired, setPressureRequired] = useState('');
  const [applicationType, setApplicationType] = useState('general');

  // 选型结果
  const [selectionResult, setSelectionResult] = useState(null);
  const [selectedPump, setSelectedPump] = useState(null);

  // 浏览模式筛选
  const [browseCategory, setBrowseCategory] = useState('all');

  // 全部泵型 — 列显隐切换 (S3)
  const [columnVisibility, setColumnVisibility] = useState({
    voltage: true,
    ipRating: true,
    exRating: false,
    npshRequired: true,
    oilViscosity: true,
    certifications: true
  });
  const toggleColumn = useCallback((key) => {
    setColumnVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // M3: 主泵反算
  const [reverseExpanded, setReverseExpanded] = useState(false);
  const [mainPumpQ, setMainPumpQ] = useState('');
  const [mainPumpP, setMainPumpP] = useState('');
  const [safetyFactor, setSafetyFactor] = useState('1.1');
  const handleReverseDerive = useCallback(() => {
    const r = calculateStandbyFromMain({
      mainQ: mainPumpQ,
      mainP: mainPumpP,
      safetyFactor,
      applicationType
    });
    if (!r.success) {
      setSelectionResult({ success: false, message: r.message || '反算失败' });
      return;
    }
    // 写回手动选型表单 (用户可继续微调)
    setFlowRequired(String(r.requiredFlow));
    setPressureRequired(String(r.requiredPressure));
    // 直接展示反算结果
    setSelectionResult({
      success: true,
      message: `主泵 Q=${r.derivedFrom.mainQ} L/min × p=${r.derivedFrom.mainP} MPa × 系数 ${r.safetyFactorApplied} → 备用需求 ${r.requiredFlow} L/min / ${r.requiredPressure} MPa`,
      ...(r.recommendations[0] || {}),
      alternatives: r.recommendations.slice(1),
      recommendations: r.recommendations,
      selectionCriteria: { flowRequired: r.requiredFlow, pressureRequired: r.requiredPressure, applicationType }
    });
    if (r.recommendations[0]) {
      setSelectedPump(r.recommendations[0]);
    }
  }, [mainPumpQ, mainPumpP, safetyFactor, applicationType]);

  // S5: 多选对比
  const [comparedPumps, setComparedPumps] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const togglePumpCompare = useCallback((pump) => {
    setComparedPumps(prev => {
      const exists = prev.find(p => p.model === pump.model);
      if (exists) return prev.filter(p => p.model !== pump.model);
      if (prev.length >= 4) return prev; // 最多 4 个
      return [...prev, pump];
    });
  }, []);
  const isPumpCompared = useCallback(
    (model) => comparedPumps.some(p => p.model === model),
    [comparedPumps]
  );

  const compareColumns = useMemo(() => ([
    { key: 'series',         label: '系列',           highlightDiff: true },
    { key: 'flow',           label: '流量 (L/min)',   bestPolicy: 'max' },
    { key: 'pressure',       label: '压力 (MPa)',     bestPolicy: 'max' },
    { key: 'motorPower',     label: '电机功率 (kW)',  bestPolicy: 'min' },
    { key: 'voltage',        label: '电压',           highlightDiff: true,
      format: (v, r) => v ? `${v} ${r.frequency || ''} ${r.phase ? `${r.phase}相` : ''}`.trim() : '—' },
    { key: 'ipRating',       label: '防护',           highlightDiff: true },
    { key: 'exRating',       label: '防爆',           highlightDiff: true },
    { key: 'npshRequired',   label: 'NPSH (m)',       bestPolicy: 'min' },
    { key: 'oilViscosity',   label: '油粘度',
      format: (v) => Array.isArray(v) ? v.join(', ') : (v || '—') },
    { key: 'certifications', label: '船检证书',
      format: (v) => Array.isArray(v) ? v.join(', ') : (v || '—'), highlightDiff: true },
    { key: 'weight',         label: '重量 (kg)',      bestPolicy: 'min' },
    { key: 'marketPrice',    label: '市场价 (元)',    bestPolicy: 'min',
      format: (v) => v ? formatPrice(v) : '询价' }
  ]), []);

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

  // 按分类筛选的泵列表 (合并 enrichment 数据)
  const filteredPumps = useMemo(() => {
    const base = browseCategory === 'all'
      ? pumpList
      : (pumpCategories[browseCategory]
          ? pumpList.filter(p => pumpCategories[browseCategory].includes(p.model))
          : pumpList);
    return enrichPumpList(base);
  }, [pumpList, browseCategory, pumpCategories]);

  // 缺值占位 (避免 undefined / null 渲染到表格)
  const cell = (value, fallback = '—') => {
    if (value == null || value === '') return fallback;
    if (Array.isArray(value)) return value.length ? value.join(', ') : fallback;
    return value;
  };

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
          <div className="mb-2">
            请先在"齿轮箱选型"中选择一个齿轮箱型号，或使用"参数选型"独立模式按流量/压力规格筛选备用泵。
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setSelectionMode('manual')}
          >
            <i className="bi bi-arrow-right-circle me-1"></i>
            切换到参数选型 (独立模式)
          </Button>
        </Alert>
      )}
    </div>
  );

  // 渲染手动选型Tab
  const renderManualTab = () => (
    <div className="mt-3">
      {/* M3: 按主泵反算面板 (折叠) */}
      <Card style={cardStyle} className="mb-3">
        <Card.Header
          style={{ ...headerStyle, cursor: 'pointer' }}
          onClick={() => setReverseExpanded(e => !e)}
        >
          <i className={`bi ${reverseExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} me-2`}></i>
          按齿轮箱主泵参数反算备用泵需求
          <Badge bg="info" className="ms-2" style={{ fontSize: '0.7em' }}>工程模式</Badge>
        </Card.Header>
        {reverseExpanded && (
          <Card.Body>
            <Alert variant="light" className="py-2 mb-3">
              <small>
                工程公式：备用泵需求 = 主泵参数 × 安全系数 (典型 1.0–1.2)。
                填好后点"自动填充"即可同步至下方手动选型表单。
              </small>
            </Alert>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>主泵流量 Q (L/min)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number" min="0.1" step="0.1"
                      value={mainPumpQ}
                      onChange={(e) => setMainPumpQ(e.target.value)}
                      placeholder="例: 20"
                    />
                    <InputGroup.Text>L/min</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>主泵压力 p (MPa)</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="number" min="0.1" step="0.1"
                      value={mainPumpP}
                      onChange={(e) => setMainPumpP(e.target.value)}
                      placeholder="例: 2.5"
                    />
                    <InputGroup.Text>MPa</InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>安全系数 (1.0–1.5)</Form.Label>
                  <Form.Control
                    type="number" min="1.0" max="1.5" step="0.05"
                    value={safetyFactor}
                    onChange={(e) => setSafetyFactor(e.target.value)}
                  />
                  <Form.Text className="text-muted">推荐 1.1 (常规) / 1.2 (高负荷)</Form.Text>
                </Form.Group>
              </Col>
            </Row>
            <Button variant="info" onClick={handleReverseDerive}>
              <i className="bi bi-magic me-1"></i>反算并自动填充
            </Button>
          </Card.Body>
        )}
      </Card>

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

      {/* S5: 多选对比浮动操作条 */}
      {comparedPumps.length > 0 && (
        <Alert variant="primary" className="d-flex align-items-center justify-content-between py-2 mb-2">
          <div>
            <strong>已勾选 {comparedPumps.length} 个泵</strong>
            <small className="text-muted ms-2">
              {comparedPumps.map(p => p.model).join('、')}
            </small>
          </div>
          <div className="d-flex" style={{ gap: '0.5rem' }}>
            <Button
              variant="primary"
              size="sm"
              disabled={comparedPumps.length < 2}
              onClick={() => setShowCompareModal(true)}
            >
              <i className="bi bi-columns-gap me-1"></i>对比 ({comparedPumps.length})
            </Button>
            <Button variant="outline-secondary" size="sm" onClick={() => setComparedPumps([])}>
              清空
            </Button>
          </div>
        </Alert>
      )}

      <GenericComparisonTable
        show={showCompareModal}
        onHide={() => setShowCompareModal(false)}
        rows={comparedPumps}
        columns={compareColumns}
        title="备用泵型号对比"
      />

      {/* S3: 列显隐切换 */}
      <div className="mb-2 d-flex flex-wrap align-items-center" style={{ gap: '0.5rem' }}>
        <small className="text-muted me-2">显示列:</small>
        {[
          { key: 'voltage',       label: '电气' },
          { key: 'ipRating',      label: '防护等级' },
          { key: 'exRating',      label: '防爆等级' },
          { key: 'npshRequired',  label: 'NPSH' },
          { key: 'oilViscosity',  label: '油粘度' },
          { key: 'certifications',label: '船检' }
        ].map(({ key, label }) => (
          <Form.Check
            key={key}
            type="switch"
            id={`pump-col-${key}`}
            label={label}
            checked={columnVisibility[key]}
            onChange={() => toggleColumn(key)}
            className="small"
          />
        ))}
      </div>

      <Table striped bordered hover size="sm" responsive>
        <thead>
          <tr>
            <th style={{ width: 36 }} title="勾选加入对比 (最多 4 个)">{t('compare', '对比')}</th>
            <th>{t('model', '型号')}</th>
            <th>{t('series', '系列')}</th>
            <th>{t('flow', '流量')} ({displayUnit('L/min', unitSystem)})</th>
            <th>{t('pressure', '压力')} ({displayUnit('MPa', unitSystem)})</th>
            <th>{t('power', '功率')} ({displayUnit('kW', unitSystem)})</th>
            {columnVisibility.voltage && <th>电气</th>}
            {columnVisibility.ipRating && <th>防护</th>}
            {columnVisibility.exRating && <th>防爆</th>}
            {columnVisibility.npshRequired && <th>NPSH (m)</th>}
            {columnVisibility.oilViscosity && <th>油粘度</th>}
            {columnVisibility.certifications && <th>船检</th>}
            <th>重量 (kg)</th>
            <th>市场价</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredPumps.map(pump => {
            const electricLine = pump.voltage
              ? `${cell(pump.voltage)} ${pump.frequency || ''} ${pump.phase ? `${pump.phase}相` : ''}`.trim()
              : '—';
            return (
              <tr key={pump.model}>
                <td>
                  <Form.Check
                    type="checkbox"
                    aria-label={`勾选 ${pump.model} 加入对比`}
                    checked={isPumpCompared(pump.model)}
                    disabled={!isPumpCompared(pump.model) && comparedPumps.length >= 4}
                    onChange={() => togglePumpCompare(pump)}
                  />
                </td>
                <td>
                  {pump.model}
                  {pump.type === 'electric' && (
                    <Badge bg="primary" className="ms-1" style={{ fontSize: '0.65em' }}>电动</Badge>
                  )}
                  {pump.dataCompleteness === 'partial' && (
                    <Badge bg="light" text="dark" className="ms-1" style={{ fontSize: '0.6em' }} title="部分扩展字段缺失">
                      数据补全中
                    </Badge>
                  )}
                </td>
                <td>{pump.series}</td>
                <td>{formatValue(pump.flow, 'L/min', unitSystem, { decimals: 1, withUnit: false })}</td>
                <td>{formatValue(pump.pressure, 'MPa', unitSystem, { decimals: 2, withUnit: false })}</td>
                <td>{formatValue(pump.motorPower, 'kW', unitSystem, { decimals: 2, withUnit: false })}</td>
                {columnVisibility.voltage && <td><small>{electricLine}</small></td>}
                {columnVisibility.ipRating && <td>{cell(pump.ipRating)}</td>}
                {columnVisibility.exRating && <td><small>{cell(pump.exRating)}</small></td>}
                {columnVisibility.npshRequired && <td>{cell(pump.npshRequired)}</td>}
                {columnVisibility.oilViscosity && <td><small>{cell(pump.oilViscosity)}</small></td>}
                {columnVisibility.certifications && (
                  <td>
                    {Array.isArray(pump.certifications) && pump.certifications.length
                      ? pump.certifications.map(c => (
                          <Badge bg="info" key={c} className="me-1" style={{ fontSize: '0.65em' }}>{c}</Badge>
                        ))
                      : '—'}
                  </td>
                )}
                <td>{formatValue(pump.weight, 'kg', unitSystem, { decimals: 0, withUnit: false }) || '—'}</td>
                <td>
                  {pump.marketPrice
                    ? <span className="text-danger fw-bold">{formatPrice(pump.marketPrice)}</span>
                    : <Badge bg="warning" text="dark" title="此型号暂无公开报价,请联系销售">{t('inquiry', '询价')}</Badge>}
                </td>
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
            );
          })}
        </tbody>
      </Table>
    </div>
  );

  return (
    <Card style={cardStyle}>
      <Card.Header style={headerStyle} className="d-flex align-items-center justify-content-between">
        <div>
          <span className="me-2">{t('pumpSelection', '备用泵选型')}</span>
          {selectedPump && (
            <Badge bg="success">
              {t('selected', '已选')}: {selectedPump.model}
            </Badge>
          )}
        </div>
        <UnitsLanguageToggle />
      </Card.Header>
      <Card.Body>
        <Tabs
          activeKey={selectionMode}
          onSelect={(k) => setSelectionMode(k)}
          className="mb-3"
          mountOnEnter
          unmountOnExit
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

/**
 * 公开默认导出 — 自动包裹 UnitsLanguageProvider, 使本模块单位/语言切换生效
 */
const PumpSelectionView = (props) => (
  <UnitsLanguageProvider>
    <PumpSelectionViewInner {...props} />
  </UnitsLanguageProvider>
);

export default PumpSelectionView;
