/**
 * 扭振动态分析主组件
 * 用于船用轴系临界转速校核
 *
 * 支持两种模式：
 * - 简化模式：两质量系统快速校核
 * - 高级模式：多自由度系统完整分析（COMPASS格式）
 */
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { Card, Button, Form, Row, Col, Tabs, Tab, Spinner, Alert, ButtonGroup, Badge } from 'react-bootstrap';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import DescriptionIcon from '@mui/icons-material/Description';
import { FiZap, FiCpu, FiFileText } from 'react-icons/fi';

import MassInertiaEditor from './MassInertiaEditor';
import ShaftStiffnessEditor from './ShaftStiffnessEditor';
import AnalysisResultPanel from './AnalysisResultPanel';
import SmartFixSuggestions from './SmartFixSuggestions';
import ModeShapeChart from './ModeShapeChart';

// 高级模式组件
import SystemLayoutEditor from './SystemLayoutEditor';
import HolzerTableDisplay from './HolzerTableDisplay';
import StressSpeedChart, { exportChartAsImage } from './StressSpeedChart';

// 计算模块
import {
  createDefaultTorsionalInput,
  runTorsionalAnalysis,
  DIESEL_EXCITATION_ORDERS
} from '../../utils/torsionalVibration';
import {
  runAdvancedTorsionalAnalysis,
  createDefaultAdvancedInput
} from '../../utils/transferMatrixMethod';
import { runForcedVibrationAnalysis } from '../../utils/forcedVibrationAnalysis';
import { generateTorsionalReport, buildReportData } from '../../utils/torsionalPdfGenerator';

// 数据库
import { getStandardsList, getForbiddenZone } from '../../data/torsionalStandardsDB';
import { getMaterialList, getCouplingList, getPresetList, getPreset, getCoupling } from '../../data/torsionalMaterialDB';
import { checkCompliance } from '../../utils/torsionalComplianceChecker';

const TorsionalAnalysis = ({
  colors = {},
  theme = 'light',
  onAnalysisComplete,
  selectionResult = null,
  engineData = {}
}) => {
  // 分析模式：simple（简化）或 advanced（高级）
  const [analysisMode, setAnalysisMode] = useState('simple');

  // 简化模式状态
  const [input, setInput] = useState(() => createDefaultTorsionalInput());
  const [result, setResult] = useState(null);

  // 高级模式状态
  const [advancedInput, setAdvancedInput] = useState(() => createDefaultAdvancedInput());
  const [advancedResult, setAdvancedResult] = useState(null);
  const [forcedResult, setForcedResult] = useState(null);

  // 新增: 船型预设/规范/材料状态
  const [selectedPreset, setSelectedPreset] = useState('');
  const [selectedStandard, setSelectedStandard] = useState('CCS_INLAND_2016');
  const [selectedMaterial, setSelectedMaterial] = useState('45_STEEL');
  const [complianceResult, setComplianceResult] = useState(null);

  // 共用状态
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('input');
  const [showFixSuggestions, setShowFixSuggestions] = useState(false);
  const [generatingPdf, setGeneratingPdf] = useState(false);

  // 图表引用（用于PDF导出）
  const chartInstancesRef = useRef(null);

  // 从选型结果自动填充参数
  useEffect(() => {
    if (selectionResult?.recommendations?.[0] && engineData?.speed) {
      const gb = selectionResult.recommendations[0];
      const speed = parseFloat(engineData.speed) || 1500;
      const gearRatio = gb.matchedRatio || gb.ratio || 3.0;
      setInput(prev => ({
        ...prev,
        operatingSpeed: speed,
        gearRatio: parseFloat(gearRatio) || prev.gearRatio
      }));
    }
  }, [selectionResult, engineData]);

  // 数据库列表
  const standardsList = useMemo(() => getStandardsList(), []);
  const materialsList = useMemo(() => getMaterialList(), []);
  const couplingsList = useMemo(() => getCouplingList(), []);
  const presetsList = useMemo(() => getPresetList(), []);

  // 默认主题色
  const defaultColors = useMemo(() => ({
    card: theme === 'dark' ? '#1e1e1e' : '#fff',
    border: theme === 'dark' ? '#444' : '#dee2e6',
    headerBg: theme === 'dark' ? '#2d2d2d' : '#f8f9fa',
    headerText: theme === 'dark' ? '#fff' : '#333',
    text: theme === 'dark' ? '#e0e0e0' : '#333',
    muted: theme === 'dark' ? '#aaa' : '#6c757d',
    ...colors
  }), [theme, colors]);

  // 更新基本参数
  const handleParamChange = useCallback((field, value) => {
    setInput(prev => ({
      ...prev,
      [field]: field === 'powerSourceType' ? value : (parseFloat(value) || 0)
    }));
    setResult(null); // 参数变化时清除结果
    setError(null);
  }, []);

  // 更新质量数组
  const handleMassesChange = useCallback((masses) => {
    setInput(prev => ({ ...prev, masses }));
    setResult(null);
    setError(null);
  }, []);

  // 更新轴段数组
  const handleShaftsChange = useCallback((shafts) => {
    setInput(prev => ({ ...prev, shafts }));
    setResult(null);
    setError(null);
  }, []);

  // 应用船型预设
  const handlePresetChange = useCallback((presetKey) => {
    setSelectedPreset(presetKey);
    if (!presetKey) return;
    const preset = getPreset(presetKey);
    if (!preset) return;

    const coupling = getCoupling(preset.couplingModel);
    const couplingK = coupling ? coupling.stiffness * 1000 : 5e5; // kNm/rad → N·m/rad
    const couplingJ = coupling ? coupling.inertia : 0.5;

    setInput(prev => ({
      ...prev,
      operatingSpeed: preset.motorSpeed,
      powerSourceType: 'electric',
      bladeCount: preset.bladeCount || 4,
      gearRatio: preset.gearRatio || 1,
      couplingStiffness: couplingK,
      couplingInertia: couplingJ,
      motorPower: preset.motorPower,
      motorSpeed: preset.motorSpeed,
      materialStrength: 600,
      masses: [
        { name: '电机', J: preset.motorInertia, position: 0 },
        { name: '联轴器', J: couplingJ, position: 300 },
        { name: '齿轮箱', J: 0.5, position: 600 },
        { name: '螺旋桨', J: preset.propellerInertia, position: preset.shaftLength + 600 },
      ],
      shafts: [
        { name: '输入轴', K: couplingK, length: 300, diameter: 80 },
        { name: '齿轮箱内', K: 5e6, length: 300, diameter: 100 },
        { name: '艉轴', K: 8.1e10 * Math.PI * Math.pow(preset.shaftDiameter / 1000, 4) / 32 / (preset.shaftLength / 1000),
          length: preset.shaftLength, diameter: preset.shaftDiameter },
      ]
    }));
    setResult(null);
    setError(null);
  }, []);

  // 应用修复建议
  const handleApplyFix = useCallback((fixedInput) => {
    setInput(fixedInput);
    setError(null);
    setResult(null);
    setShowFixSuggestions(false);
  }, []);

  // 执行分析
  const handleAnalyze = useCallback(() => {
    setLoading(true);
    setError(null);

    try {
      // 输入验证
      if (!input.masses || input.masses.length < 2) {
        throw new Error('至少需要2个集中质量');
      }
      if (!input.shafts || input.shafts.length < 1) {
        throw new Error('至少需要1个轴段');
      }
      if (input.operatingSpeed <= 0) {
        throw new Error('工作转速必须大于0');
      }

      // 验证质量惯量
      const invalidMass = input.masses.find(m => !m.J || m.J <= 0);
      if (invalidMass) {
        throw new Error(`质量"${invalidMass.name}"的惯量必须大于0`);
      }

      // 验证轴段刚度
      const invalidShaft = input.shafts.find(s => !s.K || s.K <= 0);
      if (invalidShaft) {
        throw new Error(`轴段"${invalidShaft.name}"的刚度必须大于0`);
      }

      // 执行计算
      const analysisResult = runTorsionalAnalysis(input);
      setResult(analysisResult);
      setActiveTab('result');

      // 规范合规性检查
      const forbiddenZone = getForbiddenZone(selectedStandard);
      analysisResult.forbiddenZone = forbiddenZone;
      analysisResult.standardCode = selectedStandard;

      try {
        const compliance = checkCompliance(analysisResult, input, selectedStandard);
        setComplianceResult(compliance);
      } catch (e) {
        console.warn('Compliance check failed:', e);
      }

      // 回调
      if (onAnalysisComplete) {
        onAnalysisComplete(analysisResult);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [input, onAnalysisComplete, selectedStandard]);

  // 重置参数
  const handleReset = useCallback(() => {
    if (analysisMode === 'simple') {
      setInput(createDefaultTorsionalInput());
      setResult(null);
    } else {
      setAdvancedInput(createDefaultAdvancedInput());
      setAdvancedResult(null);
      setForcedResult(null);
    }
    setError(null);
    setActiveTab('input');
  }, [analysisMode]);

  // 高级模式：系统配置变更
  const handleAdvancedInputChange = useCallback((newInput) => {
    setAdvancedInput(newInput);
    setAdvancedResult(null);
    setForcedResult(null);
    setError(null);
  }, []);

  // 高级模式：执行完整分析
  const handleAdvancedAnalyze = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // 1. 自由振动分析（固有频率）
      const freeVibResult = runAdvancedTorsionalAnalysis(advancedInput);
      setAdvancedResult(freeVibResult);

      // 2. 强迫振动分析
      const forcedVibResult = runForcedVibrationAnalysis(advancedInput, freeVibResult);
      setForcedResult(forcedVibResult);

      setActiveTab('freeVib');

      // 回调
      if (onAnalysisComplete) {
        onAnalysisComplete({
          mode: 'advanced',
          freeVibration: freeVibResult,
          forcedVibration: forcedVibResult,
          systemInput: advancedInput
        });
      }
    } catch (err) {
      setError(err.message || '高级分析失败');
      console.error('Advanced analysis error:', err);
    } finally {
      setLoading(false);
    }
  }, [advancedInput, onAnalysisComplete]);

  // 高级模式：生成PDF报告
  const handleGeneratePdf = useCallback(async () => {
    if (!advancedResult || !forcedResult) {
      setError('请先执行分析');
      return;
    }

    setGeneratingPdf(true);

    try {
      // 收集图表图片
      const chartImages = {};
      if (chartInstancesRef.current) {
        if (chartInstancesRef.current.intermediateShaft) {
          chartImages.intermediateShaft = exportChartAsImage(
            chartInstancesRef.current.intermediateShaft
          );
        }
        if (chartInstancesRef.current.propellerShaft) {
          chartImages.propellerShaft = exportChartAsImage(
            chartInstancesRef.current.propellerShaft
          );
        }
      }

      // 构建报告数据
      const reportData = buildReportData({
        systemInput: advancedInput,
        freeVibration: advancedResult,
        forcedVibration: forcedResult
      }, {
        projectName: advancedInput.metadata?.projectName || '船舶轴系扭振分析',
        vesselType: advancedInput.metadata?.vesselType,
        mainEngineModel: advancedInput.powerSource?.model,
        gearboxModel: advancedInput.metadata?.gearboxModel
      });

      reportData.chartImages = chartImages;

      // 生成PDF
      await generateTorsionalReport(reportData, {
        filename: `扭振计算书_${new Date().toISOString().slice(0, 10)}`
      });

    } catch (err) {
      setError('PDF生成失败: ' + err.message);
      console.error('PDF generation error:', err);
    } finally {
      setGeneratingPdf(false);
    }
  }, [advancedResult, forcedResult, advancedInput]);

  // 图表ready回调
  const handleChartReady = useCallback((instances) => {
    chartInstancesRef.current = instances;
  }, []);

  // 可用的气缸数选项
  const cylinderOptions = Object.keys(DIESEL_EXCITATION_ORDERS).map(Number);

  const cardStyle = {
    backgroundColor: defaultColors.card,
    borderColor: defaultColors.border
  };

  return (
    <Card style={cardStyle} className="torsional-analysis">
      <Card.Header
        className="d-flex justify-content-between align-items-center flex-wrap gap-2"
        style={{ backgroundColor: defaultColors.headerBg }}
      >
        <div className="d-flex align-items-center">
          <SettingsIcon style={{ color: defaultColors.headerText, marginRight: 8 }} />
          <span style={{ color: defaultColors.headerText, fontWeight: 'bold' }}>
            扭振动态分析
          </span>
          {/* 模式切换按钮 */}
          <ButtonGroup size="sm" className="ms-3">
            <Button
              variant={analysisMode === 'simple' ? 'primary' : 'outline-primary'}
              onClick={() => setAnalysisMode('simple')}
              disabled={loading}
            >
              <FiZap className="me-1" /> 简化模式
            </Button>
            <Button
              variant={analysisMode === 'advanced' ? 'primary' : 'outline-primary'}
              onClick={() => setAnalysisMode('advanced')}
              disabled={loading}
            >
              <FiCpu className="me-1" /> 高级模式
            </Button>
          </ButtonGroup>
          {analysisMode === 'advanced' && (
            <Badge bg="info" className="ms-2">COMPASS格式</Badge>
          )}
        </div>
        <div className="d-flex gap-2">
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={handleReset}
            disabled={loading || generatingPdf}
          >
            <RefreshIcon fontSize="small" /> 重置
          </Button>
          {analysisMode === 'advanced' && advancedResult && (
            <Button
              variant="outline-success"
              size="sm"
              onClick={handleGeneratePdf}
              disabled={loading || generatingPdf}
            >
              {generatingPdf ? (
                <>
                  <Spinner animation="border" size="sm" className="me-1" />
                  生成中...
                </>
              ) : (
                <>
                  <FiFileText className="me-1" /> 导出PDF
                </>
              )}
            </Button>
          )}
          <Button
            variant="primary"
            size="sm"
            onClick={analysisMode === 'simple' ? handleAnalyze : handleAdvancedAnalyze}
            disabled={loading || generatingPdf}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-1" />
                分析中...
              </>
            ) : (
              <>
                <PlayArrowIcon fontSize="small" /> 执行分析
              </>
            )}
          </Button>
        </div>
      </Card.Header>

      <Card.Body>
        {/* 错误提示 */}
        {error && (
          <Alert
            variant="danger"
            dismissible
            onClose={() => setError(null)}
            className="mb-3"
          >
            {error}
          </Alert>
        )}

        {/* 简化模式 */}
        {analysisMode === 'simple' && (
          <>
            {/* 共振风险警告 */}
            {result && !result.isValid && (
              <>
                <Alert
                  variant="warning"
                  dismissible
                  onClose={() => setShowFixSuggestions(false)}
                  className="mb-3"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <span>分析完成但存在共振风险，工作转速位于临界转速附近</span>
                    <Button
                      variant="outline-warning"
                      size="sm"
                      onClick={() => setShowFixSuggestions(!showFixSuggestions)}
                      className="ms-3"
                    >
                      {showFixSuggestions ? '收起建议' : '获取修复建议'}
                    </Button>
                  </div>
                </Alert>

                {showFixSuggestions && (
                  <SmartFixSuggestions
                    error={null}
                    result={result}
                    input={input}
                    onApplyFix={handleApplyFix}
                    onClose={() => setShowFixSuggestions(false)}
                    colors={defaultColors}
                    theme={theme}
                  />
                )}
              </>
            )}

            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="mb-3"
            >
              {/* 参数输入标签页 */}
              <Tab eventKey="input" title="参数输入">
                {/* 船型预设 + 规范选择 */}
                <Card className="mb-3" style={cardStyle}>
                  <Card.Header style={{ backgroundColor: defaultColors.headerBg, color: defaultColors.headerText }}>
                    船型预设与规范
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: defaultColors.text }}>船型预设 (一键填充)</Form.Label>
                          <Form.Select
                            value={selectedPreset}
                            onChange={(e) => handlePresetChange(e.target.value)}
                            style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                          >
                            <option value="">-- 手动输入 --</option>
                            {presetsList.map(p => (
                              <option key={p.key} value={p.key}>{p.name}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: defaultColors.text }}>规范标准</Form.Label>
                          <Form.Select
                            value={selectedStandard}
                            onChange={(e) => { setSelectedStandard(e.target.value); setResult(null); }}
                            style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                          >
                            {standardsList.map(s => (
                              <option key={s.code} value={s.code}>{s.name}</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: defaultColors.text }}>轴系材料</Form.Label>
                          <Form.Select
                            value={selectedMaterial}
                            onChange={(e) => { setSelectedMaterial(e.target.value); setResult(null); }}
                            style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                          >
                            {materialsList.map(m => (
                              <option key={m.id} value={m.id}>{m.name} (Rm={m.Rm}MPa)</option>
                            ))}
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                {/* 基本参数 */}
                <Card className="mb-3" style={cardStyle}>
                  <Card.Header style={{ backgroundColor: defaultColors.headerBg, color: defaultColors.headerText }}>
                    基本参数
                  </Card.Header>
                  <Card.Body>
                    <Row>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: defaultColors.text }}>工作转速 (rpm)</Form.Label>
                          <Form.Control
                            type="number" min="100" max="5000" step="50"
                            value={input.operatingSpeed}
                            onChange={(e) => handleParamChange('operatingSpeed', e.target.value)}
                            style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                          />
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: defaultColors.text }}>减速比 i</Form.Label>
                          <Form.Control
                            type="number" min="1" max="10" step="0.01"
                            value={input.gearRatio || 1}
                            onChange={(e) => handleParamChange('gearRatio', e.target.value)}
                            style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                          />
                          {input.gearRatio > 1 && (
                            <Form.Text className="text-muted">
                              输出转速: {(input.operatingSpeed / input.gearRatio).toFixed(0)} rpm | i²={((input.gearRatio||1)**2).toFixed(2)}
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: defaultColors.text }}>动力源类型</Form.Label>
                          <Form.Select
                            value={input.powerSourceType}
                            onChange={(e) => handleParamChange('powerSourceType', e.target.value)}
                            style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                          >
                            <option value="diesel">柴油机</option>
                            <option value="electric">电动机</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                      <Col md={3}>
                        <Form.Group className="mb-3">
                          <Form.Label style={{ color: defaultColors.text }}>
                            {input.powerSourceType === 'diesel' ? '气缸数' : '螺旋桨叶片数'}
                          </Form.Label>
                          {input.powerSourceType === 'diesel' ? (
                            <Form.Select
                              value={input.cylinderCount}
                              onChange={(e) => handleParamChange('cylinderCount', e.target.value)}
                              style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                            >
                              {cylinderOptions.map(n => (
                                <option key={n} value={n}>{n}缸</option>
                              ))}
                            </Form.Select>
                          ) : (
                            <Form.Select
                              value={input.bladeCount}
                              onChange={(e) => handleParamChange('bladeCount', e.target.value)}
                              style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                            >
                              <option value={3}>3叶</option>
                              <option value={4}>4叶</option>
                              <option value={5}>5叶</option>
                            </Form.Select>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                    {input.powerSourceType === 'diesel' && (
                      <Row>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: defaultColors.text }}>螺旋桨叶片数</Form.Label>
                            <Form.Select
                              value={input.bladeCount}
                              onChange={(e) => handleParamChange('bladeCount', e.target.value)}
                              style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                            >
                              <option value={3}>3叶</option>
                              <option value={4}>4叶</option>
                              <option value={5}>5叶</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col md={3}>
                          <Form.Group className="mb-3">
                            <Form.Label style={{ color: defaultColors.text }}>联轴器型号</Form.Label>
                            <Form.Select
                              value={input.couplingModel || ''}
                              onChange={(e) => {
                                const model = e.target.value;
                                const c = getCoupling(model);
                                if (c) {
                                  setInput(prev => ({
                                    ...prev,
                                    couplingModel: model,
                                    couplingStiffness: c.stiffness * 1000,
                                    couplingInertia: c.inertia
                                  }));
                                  setResult(null);
                                }
                              }}
                              style={{ backgroundColor: theme === 'dark' ? '#3d3d3d' : '#fff', color: defaultColors.text, borderColor: defaultColors.border }}
                            >
                              <option value="">-- 手动 --</option>
                              {couplingsList.map(c => (
                                <option key={c.id} value={c.id}>{c.name} ({c.stiffness} kNm/rad)</option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    )}
                  </Card.Body>
                </Card>

                {/* 质量惯量编辑器 */}
                <Card className="mb-3" style={cardStyle}>
                  <Card.Body>
                    <MassInertiaEditor
                      masses={input.masses}
                      onChange={handleMassesChange}
                      colors={defaultColors}
                      theme={theme}
                    />
                  </Card.Body>
                </Card>

                {/* 轴段刚度编辑器 */}
                <Card className="mb-3" style={cardStyle}>
                  <Card.Body>
                    <ShaftStiffnessEditor
                      shafts={input.shafts}
                      onChange={handleShaftsChange}
                      colors={defaultColors}
                      theme={theme}
                    />
                  </Card.Body>
                </Card>
              </Tab>

              {/* 分析结果标签页 */}
              <Tab eventKey="result" title={<span>分析结果 {complianceResult && (
                <Badge bg={complianceResult.overallStatus === 'pass' ? 'success' : (complianceResult.overallStatus === 'fail' ? 'danger' : 'warning')} className="ms-1">
                  {complianceResult.overallLabel}
                </Badge>
              )}</span>} disabled={!result}>
                {/* 合规性摘要 */}
                {complianceResult && complianceResult.checks && complianceResult.checks.length > 0 && (
                  <Alert variant={complianceResult.overallStatus === 'pass' ? 'success' : (complianceResult.overallStatus === 'fail' ? 'danger' : 'warning')} className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>
                        <strong>{complianceResult.standardName}</strong> 合规校验:
                        {' '}{complianceResult.summary.passCount}/{complianceResult.summary.total} 项通过
                      </span>
                      {complianceResult.summary.failCount > 0 && (
                        <Badge bg="danger">{complianceResult.summary.failCount} 项不合规</Badge>
                      )}
                    </div>
                    {complianceResult.checks.filter(c => c.status === 'fail').length > 0 && (
                      <ul className="mb-0 mt-2">
                        {complianceResult.checks.filter(c => c.status === 'fail').map((check, idx) => (
                          <li key={idx}><strong>{check.name}</strong>: {check.description}</li>
                        ))}
                      </ul>
                    )}
                  </Alert>
                )}
                <AnalysisResultPanel
                  result={result}
                  colors={defaultColors}
                  theme={theme}
                />
              </Tab>
            </Tabs>
          </>
        )}

        {/* 高级模式 */}
        {analysisMode === 'advanced' && (
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            {/* 系统配置标签页 */}
            <Tab eventKey="input" title="系统配置">
              <SystemLayoutEditor
                systemInput={advancedInput}
                onChange={handleAdvancedInputChange}
                colors={defaultColors}
                theme={theme}
              />
            </Tab>

            {/* 自由振动结果标签页 */}
            <Tab eventKey="freeVib" title="自由振动" disabled={!advancedResult}>
              {advancedResult && (
                <HolzerTableDisplay
                  naturalFrequencies={advancedResult.naturalFrequencies || []}
                  units={advancedInput.units || []}
                  colors={defaultColors}
                  theme={theme}
                />
              )}
            </Tab>

            {/* 强迫振动结果标签页 */}
            <Tab eventKey="forcedVib" title="强迫振动" disabled={!forcedResult}>
              {forcedResult && (
                <StressSpeedChart
                  forcedVibrationResult={forcedResult}
                  systemInfo={{
                    operatingSpeedMin: advancedInput.analysisSettings?.operatingMin || 600,
                    operatingSpeedMax: advancedInput.analysisSettings?.operatingMax || 2000
                  }}
                  colors={defaultColors}
                  theme={theme}
                  onChartReady={handleChartReady}
                />
              )}
            </Tab>

            {/* 报告预览标签页 */}
            <Tab eventKey="report" title="报告预览" disabled={!advancedResult}>
              <Card style={cardStyle}>
                <Card.Body className="text-center py-5">
                  <DescriptionIcon style={{ fontSize: 64, color: defaultColors.muted }} />
                  <h5 className="mt-3" style={{ color: defaultColors.text }}>
                    COMPASS格式扭振计算书
                  </h5>
                  <p className="text-muted">
                    完成分析后，点击"导出PDF"按钮生成完整的扭振计算报告书
                  </p>
                  <Button
                    variant="primary"
                    onClick={handleGeneratePdf}
                    disabled={!advancedResult || !forcedResult || generatingPdf}
                  >
                    {generatingPdf ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        正在生成...
                      </>
                    ) : (
                      <>
                        <FiFileText className="me-2" />
                        生成并下载PDF报告
                      </>
                    )}
                  </Button>
                </Card.Body>
              </Card>
            </Tab>
          </Tabs>
        )}
      </Card.Body>
    </Card>
  );
};

export default TorsionalAnalysis;
