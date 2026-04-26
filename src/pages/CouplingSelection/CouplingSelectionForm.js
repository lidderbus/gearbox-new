// src/pages/CouplingSelection/CouplingSelectionForm.js
// 联轴器选型输入表单组件

import React, { useState, useCallback } from 'react';
import { Card, Form, Row, Col, Button, InputGroup, Badge, Dropdown, Alert, Collapse } from 'react-bootstrap';
import { WORK_CONDITIONS, QUICK_TEMPLATES, calculateEngineTorque } from '../../services/couplingSelectionService';
import { WorkFactorMode, ScoringMode } from '../../data/gearboxMatchingMaps';
import {
  ClassificationType,
  getClassificationOptions,
  getClassificationDescription,
  getRecommendedWorkFactorMode,
  requiresOnSiteInspection,
  requiresEnglishDocuments
} from '../../utils/classificationCertificates';

/**
 * 联轴器选型输入表单
 */
const CouplingSelectionForm = ({
  onSubmit,
  initialValues = {},
  gearboxOptions = [],
  isLoading = false,
  colors = {}
}) => {
  // 表单状态
  const [formData, setFormData] = useState({
    power: initialValues.power || '',
    speed: initialValues.speed || '',
    gearboxModel: initialValues.gearboxModel || '',
    workCondition: initialValues.workCondition || 'III类:扭矩变化中等',
    workFactorMode: initialValues.workFactorMode || WorkFactorMode.FACTORY,
    scoringMode: initialValues.scoringMode || ScoringMode.BALANCED,
    classificationType: initialValues.classificationType || ClassificationType.NONE,
    temperature: initialValues.temperature || 30,
    hasCover: initialValues.hasCover || false,
    needDetachable: initialValues.needDetachable || false,
    // M1: 扭振输入 (可选, 选型完成后用于 1-DOF 共振估算)
    flywheelInertia: initialValues.flywheelInertia || '',
    shaftEquivalentInertia: initialValues.shaftEquivalentInertia || '',
    propellerInertia: initialValues.propellerInertia || '',
    excitationOrders: initialValues.excitationOrders || '4,6,8',  // 柴油机典型阶次
    avoidanceLow: initialValues.avoidanceLow || '',
    avoidanceHigh: initialValues.avoidanceHigh || ''
  });

  const [torsionalExpanded, setTorsionalExpanded] = useState(false);

  // 实时计算的扭矩
  const calculatedTorque = formData.power && formData.speed
    ? calculateEngineTorque(parseFloat(formData.power), parseFloat(formData.speed))
    : 0;

  // 处理输入变化
  const handleInputChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }, []);

  // 处理船检类型变化（自动切换工况系数模式）
  const handleClassificationChange = useCallback((e) => {
    const classificationType = e.target.value;
    const recommendedMode = getRecommendedWorkFactorMode(classificationType);
    setFormData(prev => ({
      ...prev,
      classificationType,
      workFactorMode: recommendedMode
    }));
  }, []);

  // 应用快速模板
  const handleApplyTemplate = useCallback((template) => {
    setFormData({
      power: template.power,
      speed: template.speed,
      gearboxModel: template.gearbox,
      workCondition: template.condition,
      workFactorMode: template.workFactorMode || WorkFactorMode.FACTORY,
      scoringMode: template.scoringMode || ScoringMode.BALANCED,
      classificationType: template.classificationType || ClassificationType.NONE,
      temperature: template.temperature || 30,
      hasCover: false,
      needDetachable: false
    });
  }, []);

  // 提交表单
  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (onSubmit) {
      // M1: 解析扭振输入
      const orders = String(formData.excitationOrders || '')
        .split(/[,，\s]+/)
        .map(s => parseFloat(s))
        .filter(n => Number.isFinite(n) && n > 0);
      const avoidanceZones = (() => {
        const lo = parseFloat(formData.avoidanceLow);
        const hi = parseFloat(formData.avoidanceHigh);
        if (Number.isFinite(lo) && Number.isFinite(hi) && hi > lo) return [{ lo, hi }];
        return [];
      })();
      const torsionalInputs = (formData.flywheelInertia || formData.shaftEquivalentInertia || formData.propellerInertia)
        ? {
            flywheelInertia: parseFloat(formData.flywheelInertia) || 0,
            shaftEquivalentInertia: parseFloat(formData.shaftEquivalentInertia) || 0,
            propellerInertia: parseFloat(formData.propellerInertia) || 0,
            excitationOrders: orders,
            avoidanceZones
          }
        : null;

      onSubmit({
        power: parseFloat(formData.power),
        speed: parseFloat(formData.speed),
        gearboxModel: formData.gearboxModel,
        workCondition: formData.workCondition,
        workFactorMode: formData.workFactorMode,
        scoringMode: formData.scoringMode,
        classificationType: formData.classificationType,
        temperature: parseFloat(formData.temperature),
        hasCover: formData.hasCover,
        needDetachable: formData.needDetachable,
        torsionalInputs
      });
    }
  }, [formData, onSubmit]);

  // 重置表单
  const handleReset = useCallback(() => {
    setFormData({
      power: '',
      speed: '',
      gearboxModel: '',
      workCondition: 'III类:扭矩变化中等',
      workFactorMode: WorkFactorMode.FACTORY,
      scoringMode: ScoringMode.BALANCED,
      classificationType: ClassificationType.NONE,
      temperature: 30,
      hasCover: false,
      needDetachable: false
    });
  }, []);

  // 验证表单
  const isValid = formData.power > 0 && formData.speed > 0;

  return (
    <Card className="shadow-sm mb-4" style={{ backgroundColor: colors.card || 'white' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-sliders me-2"></i>
            选型参数
          </span>
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" size="sm" id="template-dropdown">
              <i className="bi bi-lightning me-1"></i>
              快速模板
            </Dropdown.Toggle>
            <Dropdown.Menu>
              {QUICK_TEMPLATES.map(template => (
                <Dropdown.Item
                  key={template.id}
                  onClick={() => handleApplyTemplate(template)}
                >
                  <strong>{template.name}</strong>
                  <small className="d-block text-muted">
                    {template.power}kW @ {template.speed}rpm
                  </small>
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row>
            {/* 发动机功率 */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  发动机功率 <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="power"
                    value={formData.power}
                    onChange={handleInputChange}
                    placeholder="输入功率"
                    min="1"
                    max="5000"
                    step="1"
                    required
                  />
                  <InputGroup.Text>kW</InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  常见范围: 50-2000 kW
                </Form.Text>
              </Form.Group>
            </Col>

            {/* 发动机转速 */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  发动机转速 <span className="text-danger">*</span>
                </Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="speed"
                    value={formData.speed}
                    onChange={handleInputChange}
                    placeholder="输入转速"
                    min="100"
                    max="5000"
                    step="50"
                    required
                  />
                  <InputGroup.Text>rpm</InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  常见范围: 1000-2500 rpm
                </Form.Text>
              </Form.Group>
            </Col>

            {/* 齿轮箱型号 */}
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>齿轮箱型号 (可选)</Form.Label>
                <Form.Control
                  type="text"
                  name="gearboxModel"
                  value={formData.gearboxModel}
                  onChange={handleInputChange}
                  placeholder="如: HCM400A"
                  list="gearbox-list"
                />
                <datalist id="gearbox-list">
                  {gearboxOptions.map(gb => (
                    <option key={gb} value={gb} />
                  ))}
                </datalist>
                <Form.Text className="text-muted">
                  输入齿轮箱型号以获得更精准推荐
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* 工况条件 */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>工况条件</Form.Label>
                <Form.Select
                  name="workCondition"
                  value={formData.workCondition}
                  onChange={handleInputChange}
                >
                  {WORK_CONDITIONS.map(wc => (
                    <option key={wc.value} value={wc.value}>
                      {wc.label}
                    </option>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  工况系数K影响所需联轴器扭矩
                </Form.Text>
              </Form.Group>

              {/* 工况系数标准 */}
              <Form.Group className="mb-3">
                <Form.Label>工况系数标准</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    id="mode-factory"
                    name="workFactorMode"
                    label="厂家标准"
                    checked={formData.workFactorMode === WorkFactorMode.FACTORY}
                    onChange={() => setFormData(prev => ({...prev, workFactorMode: WorkFactorMode.FACTORY}))}
                  />
                  <Form.Check
                    type="radio"
                    id="mode-jb-ccs"
                    name="workFactorMode"
                    label="JB/CCS船级社标准"
                    checked={formData.workFactorMode === WorkFactorMode.JB_CCS}
                    onChange={() => setFormData(prev => ({...prev, workFactorMode: WorkFactorMode.JB_CCS}))}
                  />
                </div>
                <Form.Text className="text-muted">
                  {formData.workFactorMode === WorkFactorMode.JB_CCS
                    ? '符合JB/ZQ4383-86标准，系数较高，推荐用于CCS船级社认证项目'
                    : '厂家标准，系数较低，适用于一般工业应用'}
                </Form.Text>
              </Form.Group>

              {/* 船检要求 */}
              <Form.Group className="mb-3">
                <Form.Label>
                  船检要求
                  {formData.classificationType !== ClassificationType.NONE && (
                    <Badge bg="info" className="ms-2">
                      {requiresOnSiteInspection(formData.classificationType) ? '需现场检验' : '无需现场检验'}
                    </Badge>
                  )}
                </Form.Label>
                <Form.Select
                  name="classificationType"
                  value={formData.classificationType}
                  onChange={handleClassificationChange}
                >
                  {getClassificationOptions().map(group => (
                    <optgroup key={group.group} label={group.group}>
                      {group.options.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </Form.Select>
                <Form.Text className="text-muted">
                  {getClassificationDescription(formData.classificationType)}
                  {requiresEnglishDocuments(formData.classificationType) && (
                    <span className="text-warning ms-1">
                      <i className="bi bi-exclamation-triangle me-1"></i>
                      需提供英文技术文件
                    </span>
                  )}
                </Form.Text>
              </Form.Group>

              {/* 评分模式 */}
              <Form.Group className="mb-3">
                <Form.Label>选型优先模式</Form.Label>
                <div className="d-flex gap-3">
                  <Form.Check
                    type="radio"
                    id="scoring-balanced"
                    name="scoringMode"
                    label="平衡"
                    checked={formData.scoringMode === ScoringMode.BALANCED}
                    onChange={() => setFormData(prev => ({...prev, scoringMode: ScoringMode.BALANCED}))}
                  />
                  <Form.Check
                    type="radio"
                    id="scoring-safety"
                    name="scoringMode"
                    label="安全优先"
                    checked={formData.scoringMode === ScoringMode.SAFETY}
                    onChange={() => setFormData(prev => ({...prev, scoringMode: ScoringMode.SAFETY}))}
                  />
                  <Form.Check
                    type="radio"
                    id="scoring-economic"
                    name="scoringMode"
                    label="经济优先"
                    checked={formData.scoringMode === ScoringMode.ECONOMIC}
                    onChange={() => setFormData(prev => ({...prev, scoringMode: ScoringMode.ECONOMIC}))}
                  />
                </div>
                <Form.Text className="text-muted">
                  {formData.scoringMode === ScoringMode.SAFETY
                    ? '安全优先：扭矩余量权重最高(50%)，适用于重载/恶劣工况'
                    : formData.scoringMode === ScoringMode.ECONOMIC
                    ? '经济优先：价格权重提高(30%)，适用于成本敏感项目'
                    : '平衡模式：各项权重均衡，适用于一般应用'}
                </Form.Text>
              </Form.Group>
            </Col>

            {/* 环境温度 */}
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>环境温度</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="number"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleInputChange}
                    min="-20"
                    max="80"
                    step="5"
                  />
                  <InputGroup.Text>°C</InputGroup.Text>
                </InputGroup>
                <Form.Text className="text-muted">
                  默认30°C，高温环境需提高系数
                </Form.Text>
              </Form.Group>
            </Col>
          </Row>

          <Row>
            {/* 附加选项 */}
            <Col md={12}>
              <Form.Group className="mb-3">
                <Form.Label>附加选项</Form.Label>
                <div className="d-flex gap-4">
                  <Form.Check
                    type="checkbox"
                    id="hasCover"
                    name="hasCover"
                    label="需要罩壳 (JB型)"
                    checked={formData.hasCover}
                    onChange={handleInputChange}
                  />
                  <Form.Check
                    type="checkbox"
                    id="needDetachable"
                    name="needDetachable"
                    label="需要可拆式"
                    checked={formData.needDetachable}
                    onChange={handleInputChange}
                  />
                </div>
              </Form.Group>
            </Col>
          </Row>

          {/* M1: 扭振输入 (可选折叠) */}
          <Card className="mb-3 border-0" style={{ backgroundColor: 'rgba(13, 110, 253, 0.04)' }}>
            <Card.Body className="py-2">
              <div
                className="d-flex align-items-center"
                style={{ cursor: 'pointer' }}
                onClick={() => setTorsionalExpanded(e => !e)}
              >
                <i className={`bi ${torsionalExpanded ? 'bi-chevron-down' : 'bi-chevron-right'} me-2`}></i>
                <strong>扭振参数 (可选)</strong>
                <Badge bg="info" className="ms-2" style={{ fontSize: '0.7em' }}>1-DOF 快速估算</Badge>
                <small className="text-muted ms-auto">填写后将估算一阶共振转速及避振裕度</small>
              </div>
              <Collapse in={torsionalExpanded}>
                <div className="mt-3">
                  <Alert variant="warning" className="py-2 mb-3 small">
                    本估算基于单自由度扭振模型 (k 来自联轴器, J = J<sub>飞轮</sub> + J<sub>轴系</sub> + J<sub>推进器</sub>)，
                    仅做表单实时反馈用，工程必须复算（传递矩阵 / 受迫振动）。
                  </Alert>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>飞轮惯量 J<sub>flywheel</sub> (kg·m²)</Form.Label>
                        <Form.Control
                          type="number" min="0" step="0.1"
                          name="flywheelInertia"
                          value={formData.flywheelInertia}
                          onChange={handleInputChange}
                          placeholder="例: 2.5"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>轴系当量惯量 J<sub>shaft</sub> (kg·m²)</Form.Label>
                        <Form.Control
                          type="number" min="0" step="0.1"
                          name="shaftEquivalentInertia"
                          value={formData.shaftEquivalentInertia}
                          onChange={handleInputChange}
                          placeholder="例: 1.2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>推进器惯量 J<sub>prop</sub> (kg·m²)</Form.Label>
                        <Form.Control
                          type="number" min="0" step="0.1"
                          name="propellerInertia"
                          value={formData.propellerInertia}
                          onChange={handleInputChange}
                          placeholder="例: 3.8 (4叶)"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>激励阶次 (逗号分隔)</Form.Label>
                        <Form.Control
                          type="text"
                          name="excitationOrders"
                          value={formData.excitationOrders}
                          onChange={handleInputChange}
                          placeholder="例: 4,6,8 (柴油机)"
                        />
                        <Form.Text className="text-muted">
                          柴油 4/6/8/12 缸常用 4/6/8/12; 电机 1; 螺旋桨 3-5 (叶数)
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>避振区间下限 (rpm)</Form.Label>
                        <Form.Control
                          type="number" min="0" step="10"
                          name="avoidanceLow"
                          value={formData.avoidanceLow}
                          onChange={handleInputChange}
                          placeholder="例: 850"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>避振区间上限 (rpm)</Form.Label>
                        <Form.Control
                          type="number" min="0" step="10"
                          name="avoidanceHigh"
                          value={formData.avoidanceHigh}
                          onChange={handleInputChange}
                          placeholder="例: 1100"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </Collapse>
            </Card.Body>
          </Card>

          {/* 实时计算显示 */}
          {calculatedTorque > 0 && (
            <Alert variant="info" className="mb-3">
              <div className="d-flex justify-content-between align-items-center">
                <span>
                  <i className="bi bi-calculator me-2"></i>
                  计算结果
                </span>
                <Badge bg="primary" className="px-3 py-2">
                  发动机扭矩: {calculatedTorque.toFixed(2)} N·m ({(calculatedTorque / 1000).toFixed(3)} kN·m)
                </Badge>
              </div>
            </Alert>
          )}

          {/* 操作按钮 */}
          <div className="d-flex gap-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={!isValid || isLoading}
              className="flex-grow-1"
            >
              {isLoading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  选型中...
                </>
              ) : (
                <>
                  <i className="bi bi-search me-2"></i>
                  开始选型
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline-secondary"
              onClick={handleReset}
            >
              <i className="bi bi-arrow-counterclockwise"></i>
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CouplingSelectionForm;
