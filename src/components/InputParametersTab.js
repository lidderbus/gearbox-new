// src/components/InputParametersTab.js
// 输入参数选项卡组件 - 从 App.js 拆分

import React, { useState, useEffect, useCallback, Suspense, lazy } from 'react';
import { Row, Col, Form, Button, Card, Spinner, ButtonGroup, Badge, Modal } from 'react-bootstrap';
import { getTemplates, saveTemplate, deleteTemplate, incrementUsage } from '../utils/selectionTemplates';
import SelectionGuidelines, { HelpTooltip, HCGWorkloadSelector } from './SelectionGuidelines';
import { PRIME_MOVER_CAPACITY_FACTOR } from '../utils/selectionAlgorithm';
import HybridConfigPanel from './HybridConfigPanel';
import ShaftArrangementSelector from './ShaftArrangementSelector';

// 懒加载组件
const PropulsionConfigSelector = lazy(() => import('./PropulsionConfigSelector'));

// 懒加载组件的加载指示器
const LazyLoadFallback = () => (
  <div className="d-flex justify-content-center align-items-center py-3">
    <Spinner animation="border" variant="primary" size="sm" />
    <span className="ms-2">加载中...</span>
  </div>
);

/**
 * 输入参数选项卡组件
 * 包含发动机参数、选型要求、项目信息等输入表单
 */
const InputParametersTab = ({
  // 状态值
  engineData,
  requirementData,
  projectInfo,
  gearboxType,
  hybridConfig,
  loading,
  appDataState,

  // 状态更新函数
  handleEngineDataChange,
  handleRequirementDataChange,
  handleProjectInfoChange,
  handleGearboxTypeChange,
  setHybridConfig,
  handleSelectGearbox,

  // 验证函数
  isFormValid,
  getFieldValidationState,
  getValidationClassName,

  // 选项数据
  workConditionOptions,
  applicationOptions,

  // 样式
  colors,
  theme,
  inputStyles,
  focusStyles
}) => {
  const [hasRotationConflict, setHasRotationConflict] = useState(false);
  const [wizardMode, setWizardMode] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const [userTemplates, setUserTemplates] = useState(() => getTemplates());
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Persist core params to localStorage for cross-mode data retention
  const WIZARD_STORAGE_KEY = 'selection_wizard_params';

  // On mount: restore saved params if current values are empty
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WIZARD_STORAGE_KEY);
      if (!saved) return;
      const params = JSON.parse(saved);
      if (params.power && !engineData.power) handleEngineDataChange({ power: params.power });
      if (params.speed && !engineData.speed) handleEngineDataChange({ speed: params.speed });
      if (params.targetRatio && !requirementData.targetRatio) handleRequirementDataChange({ targetRatio: params.targetRatio });
      if (params.thrustRequirement && !requirementData.thrustRequirement) handleRequirementDataChange({ thrustRequirement: params.thrustRequirement });
      if (params.workCondition) handleRequirementDataChange({ workCondition: params.workCondition });
    } catch (e) { /* ignore parse errors */ }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Save core params on change
  useEffect(() => {
    const params = {
      power: engineData.power,
      speed: engineData.speed,
      targetRatio: requirementData.targetRatio,
      thrustRequirement: requirementData.thrustRequirement,
      workCondition: requirementData.workCondition,
    };
    try { localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(params)); } catch (e) { /* quota */ }
  }, [engineData.power, engineData.speed, requirementData.targetRatio, requirementData.thrustRequirement, requirementData.workCondition]);

  const STEPS = [
    { num: 1, title: '核心参数', icon: 'bi-sliders' },
    { num: 2, title: '工况与配置', icon: 'bi-gear' },
    { num: 3, title: '项目信息', icon: 'bi-folder' },
  ];

  // Validate step 1 required fields
  const isStep1Valid = () => {
    return engineData.power > 0 && engineData.speed > 0 && requirementData.targetRatio > 0;
  };

  // Step indicator component
  const StepIndicator = () => (
    <div className="d-flex align-items-center justify-content-center mb-4">
      {STEPS.map((step, i) => (
        <React.Fragment key={step.num}>
          {i > 0 && (
            <div style={{
              width: '40px', height: '2px',
              backgroundColor: currentStep > step.num - 1 ? colors.primary : '#dee2e6',
              margin: '0 4px'
            }} />
          )}
          <div
            onClick={() => { if (step.num <= currentStep || (step.num === 2 && isStep1Valid()) || step.num < currentStep) setCurrentStep(step.num); }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
              opacity: currentStep === step.num ? 1 : 0.6
            }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%', display: 'flex',
              alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 'bold',
              backgroundColor: currentStep >= step.num ? colors.primary : '#dee2e6',
              color: currentStep >= step.num ? '#fff' : '#666',
              border: currentStep === step.num ? '2px solid ' + colors.primary : 'none',
              boxShadow: currentStep === step.num ? '0 0 0 3px rgba(13,110,253,0.25)' : 'none'
            }}>
              {step.num}
            </div>
            <small style={{ marginTop: '4px', fontSize: '0.75rem', color: currentStep === step.num ? colors.primary : '#999' }}>
              {step.title}
            </small>
          </div>
        </React.Fragment>
      ))}
    </div>
  );

  // Navigation buttons for wizard
  const WizardNav = () => (
    <div className="d-flex justify-content-between mt-4">
      <div>
        {currentStep > 1 && (
          <Button variant="outline-secondary" onClick={() => setCurrentStep(currentStep - 1)}>
            <i className="bi bi-chevron-left me-1"></i>上一步
          </Button>
        )}
      </div>
      <div className="d-flex gap-2">
        {currentStep === 1 && isStep1Valid() && (
          <Button
            variant="outline-success"
            onClick={handleSelectGearbox}
            disabled={loading || !isFormValid().isValid || !appDataState || Object.keys(appDataState).length === 0 || hasRotationConflict}
          >
            <i className="bi bi-lightning-fill me-1"></i>跳过后续，直接选型
          </Button>
        )}
        {currentStep < 3 && (
          <Button
            variant="primary"
            onClick={() => setCurrentStep(currentStep + 1)}
            disabled={currentStep === 1 && !isStep1Valid()}
          >
            下一步<i className="bi bi-chevron-right ms-1"></i>
          </Button>
        )}
        {currentStep === 3 && (
          <Button
            variant="primary"
            onClick={handleSelectGearbox}
            disabled={loading || !isFormValid().isValid || !appDataState || Object.keys(appDataState).length === 0 || hasRotationConflict}
            className="btn-lg"
          >
            {loading ? (
              <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />选型中...</>
            ) : hasRotationConflict ? (
              <><i className="bi bi-exclamation-triangle-fill me-2"></i>请先解决旋向冲突</>
            ) : (
              <><i className="bi bi-calculator-fill me-2"></i>开始选型</>
            )}
          </Button>
        )}
      </div>
    </div>
  );

  // --- Step content blocks (reused in both modes) ---

  // Cross-validation warnings for input parameters
  const getInputWarnings = () => {
    const warnings = [];
    const p = parseFloat(engineData.power), s = parseFloat(engineData.speed);
    const r = parseFloat(requirementData.targetRatio);
    const t = parseFloat(requirementData.thrustRequirement);
    if (p > 0 && s > 0 && p / s > 0.5) {
      warnings.push({ field: 'power', msg: '超大功率/低转速比，推荐HCQ/GW系列', variant: 'info' });
    }
    if (s > 2500) {
      warnings.push({ field: 'speed', msg: '高转速，推荐HCM轻型系列', variant: 'info' });
    }
    if (r > 0 && r < 1.5) {
      warnings.push({ field: 'ratio', msg: '减速比过低，请确认是否正确', variant: 'warning' });
    }
    if (r > 8) {
      warnings.push({ field: 'ratio', msg: '大减速比，推荐两级传动(GWC系列)', variant: 'info' });
    }
    if (t > 200) {
      warnings.push({ field: 'thrust', msg: '大推力需求，推荐HC大型系列', variant: 'info' });
    }
    return warnings;
  };

  const inputWarnings = getInputWarnings();
  const warningFor = (field) => inputWarnings.filter(w => w.field === field);

  // 快速预设模板
  const PRESETS = [
    { label: '内河渔船', power: 150, speed: 1800, ratio: 3.5, thrust: 0 },
    { label: '近海拖轮', power: 500, speed: 1500, ratio: 5.0, thrust: 100 },
    { label: '散货船', power: 800, speed: 1000, ratio: 4.0, thrust: 150 },
    { label: '高速客船', power: 1200, speed: 2100, ratio: 2.0, thrust: 0 },
    { label: '工程船', power: 350, speed: 1800, ratio: 4.5, thrust: 80 },
  ];
  const applyPreset = (p) => {
    handleEngineDataChange({ power: String(p.power), speed: String(p.speed) });
    handleRequirementDataChange({ targetRatio: String(p.ratio), thrustRequirement: p.thrust ? String(p.thrust) : '' });
  };

  // --- 用户自定义模板 ---
  const handleSaveTemplate = () => {
    if (!templateName.trim()) return;
    const params = {
      power: engineData.power,
      speed: engineData.speed,
      primeType: engineData.primeType,
      targetRatio: requirementData.targetRatio,
      thrustRequirement: requirementData.thrustRequirement,
      workCondition: requirementData.workCondition,
      hcgWorkload: requirementData.hcgWorkload,
    };
    saveTemplate(templateName.trim(), params);
    setUserTemplates(getTemplates());
    setShowSaveModal(false);
    setTemplateName('');
  };

  const handleLoadTemplate = (template) => {
    incrementUsage(template.id);
    const p = template.params;
    handleEngineDataChange({
      power: p.power != null ? String(p.power) : '',
      speed: p.speed != null ? String(p.speed) : '',
      ...(p.primeType != null ? { primeType: p.primeType } : {}),
    });
    handleRequirementDataChange({
      targetRatio: p.targetRatio != null ? String(p.targetRatio) : '',
      thrustRequirement: p.thrustRequirement != null ? String(p.thrustRequirement) : '',
      ...(p.workCondition != null ? { workCondition: p.workCondition } : {}),
      ...(p.hcgWorkload != null ? { hcgWorkload: p.hcgWorkload } : {}),
    });
    setUserTemplates(getTemplates());
  };

  const handleDeleteTemplate = (e, id) => {
    e.stopPropagation();
    deleteTemplate(id);
    setUserTemplates(getTemplates());
  };

  const renderCoreParams = () => (
    <Form>
      <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
        <h6 style={{ color: colors.headerText }} className="mb-0">发动机参数</h6>
        <span className="text-muted small ms-2">快速预设:</span>
        {PRESETS.map(p => (
          <Badge key={p.label} bg="outline-primary" text="primary" className="border" style={{cursor:'pointer', fontSize:'12px'}} onClick={() => applyPreset(p)}>{p.label}</Badge>
        ))}
        <Button variant="outline-secondary" size="sm" onClick={() => setShowSaveModal(true)} style={{fontSize:'12px', padding:'2px 8px'}}>
          <i className="bi bi-bookmark-plus me-1"></i>保存当前
        </Button>
      </div>
      {userTemplates.length > 0 && (
        <div className="mb-3 d-flex align-items-center gap-2 flex-wrap">
          <small className="text-muted">我的模板:</small>
          {userTemplates.map(t => (
            <div key={t.id} className="btn-group btn-group-sm">
              <Button variant="outline-info" size="sm" onClick={() => handleLoadTemplate(t)}
                title={`${t.params.power || 0}kW / ${t.params.speed || 0}rpm / i=${t.params.targetRatio || '-'}`}
                style={{fontSize:'12px', padding:'2px 8px'}}>
                {t.name}
              </Button>
              <Button variant="outline-danger" size="sm" onClick={(e) => handleDeleteTemplate(e, t.id)}
                style={{fontSize:'12px', padding:'2px 4px'}}>
                <i className="bi bi-x"></i>
              </Button>
            </div>
          ))}
        </div>
      )}
      <Form.Group className="mb-3" controlId="enginePower">
        <Form.Label style={{ color: colors.text }}>主机功率 (kW) <span className="text-danger">*</span> <HelpTooltip id="power-tip" content="传递能力 = 功率 ÷ 转速 (kW/r·min⁻¹)" /></Form.Label>
        <Form.Control type="number" value={engineData.power} onChange={(e) => handleEngineDataChange({ power: e.target.value })} placeholder="例如: 350" min="1" step="any" required style={{...inputStyles, ...focusStyles}} className={`${getValidationClassName(getFieldValidationState('enginePower', engineData.power))}`} />
        <div className="form-feedback invalid">请输入有效的主机功率 (大于0)</div>
        <div className="form-feedback warning">功率值较大，请确认是否正确</div>
        {warningFor('power').map((w, i) => (
          <Form.Text key={i} className={`text-${w.variant}`}><i className="bi bi-lightbulb me-1"></i>{w.msg}</Form.Text>
        ))}
      </Form.Group>
      <Form.Group className="mb-3" controlId="engineSpeed">
        <Form.Label style={{ color: colors.text }}>主机转速 (r/min) <span className="text-danger">*</span> <HelpTooltip id="speed-tip" content="发动机额定转速，齿轮箱输入转速范围需覆盖此值" /></Form.Label>
        <Form.Control type="number" value={engineData.speed} onChange={(e) => handleEngineDataChange({ speed: e.target.value })} placeholder="例如: 1800" min="1" step="any" required style={{...inputStyles, ...focusStyles}} className={`${getValidationClassName(getFieldValidationState('engineSpeed', engineData.speed))}`} />
        <div className="form-feedback invalid">请输入有效的主机转速 (大于0)</div>
        <div className="form-feedback warning">转速值较高，请确认是否正确</div>
        <div className="field-info">常见柴油机转速范围: 750-2200 r/min</div>
        {warningFor('speed').map((w, i) => (
          <Form.Text key={i} className={`text-${w.variant}`}><i className="bi bi-lightbulb me-1"></i>{w.msg}</Form.Text>
        ))}
      </Form.Group>
      <Form.Group className="mb-3" controlId="primeType">
        <Form.Label style={{ color: colors.text }}>
          原动机类型 <HelpTooltip id="prime-tip" content="影响高弹联轴器额定扭矩匹配：柴油机×1.5（扭矩脉动），电动机×1.8（启停冲击）" />
        </Form.Label>
        <div className="d-flex gap-2 flex-wrap">
          {Object.entries(PRIME_MOVER_CAPACITY_FACTOR).map(([key, cfg]) => (
            <Button
              key={key}
              size="sm"
              variant={(engineData.primeType || 'none') === key ? 'primary' : 'outline-secondary'}
              onClick={() => handleEngineDataChange({ primeType: key })}
              style={{ minWidth: '100px' }}
            >
              {cfg.label}
              {key !== 'none' && <Badge bg="light" text="dark" className="ms-1">×{cfg.factor}</Badge>}
            </Button>
          ))}
        </div>
        <Form.Text className="text-muted">
          {(() => {
            const pt = engineData.primeType || 'none';
            const cfg = PRIME_MOVER_CAPACITY_FACTOR[pt];
            if (pt === 'none') return '联轴器所需扭矩 = T × K × St';
            return `联轴器所需扭矩 = T × K × St × ${cfg.factor} (${cfg.description})`;
          })()}
        </Form.Text>
      </Form.Group>
      <h6 style={{ color: colors.headerText }} className="mt-4">选型要求</h6>
      <Form.Group className="mb-3" controlId="targetRatio">
        <Form.Label style={{ color: colors.text }}>目标减速比 <span className="text-danger">*</span> <HelpTooltip id="ratio-tip" content="减速比 = 输入转速 ÷ 输出转速，减速比越大输出扭矩越大" /></Form.Label>
        <Form.Control type="number" value={requirementData.targetRatio} onChange={(e) => handleRequirementDataChange({ targetRatio: e.target.value })} placeholder="例如: 4.5" min="0.1" step="any" required style={{...inputStyles, ...focusStyles}} className={`${getValidationClassName(getFieldValidationState('targetRatio', requirementData.targetRatio))}`} />
        <div className="form-feedback invalid">请输入有效的目标减速比 (大于0)</div>
        <div className="form-feedback warning">减速比较大，请确认是否正确</div>
        <div className="field-info">常见减速比范围: 1.5-10</div>
        {warningFor('ratio').map((w, i) => (
          <Form.Text key={i} className={`text-${w.variant}`}><i className="bi bi-lightbulb me-1"></i>{w.msg}</Form.Text>
        ))}
      </Form.Group>
      <Form.Group className="mb-3" controlId="thrustRequirement">
        <Form.Label style={{ color: colors.text }}>推力要求 (kN, 可选)</Form.Label>
        <Form.Control type="number" value={requirementData.thrustRequirement} onChange={(e) => handleRequirementDataChange({ thrustRequirement: e.target.value })} placeholder="留空则不强制匹配推力" min="0" step="any" style={{...inputStyles, ...focusStyles}} className={`${getValidationClassName(getFieldValidationState('thrustRequirement', requirementData.thrustRequirement))}`} />
        <div className="form-feedback invalid">推力必须为0或正数（留空表示不限制）</div>
        <div className="form-feedback warning">推力值较大，请确认是否正确</div>
        <div className="field-info">更高的推力要求会限制可选齿轮箱型号</div>
        {warningFor('thrust').map((w, i) => (
          <Form.Text key={i} className={`text-${w.variant}`}><i className="bi bi-lightbulb me-1"></i>{w.msg}</Form.Text>
        ))}
      </Form.Group>
      <Form.Group className="mb-3 work-condition-selector" controlId="workCondition">
        <Form.Label style={{ color: colors.text }}>工作条件</Form.Label>
        <Form.Select value={requirementData.workCondition} onChange={(e) => handleRequirementDataChange({ workCondition: e.target.value })} style={{...inputStyles, ...focusStyles}} aria-label="选择工作条件">
          {workConditionOptions.map(option => (<option key={option} value={option}>{option}</option>))}
        </Form.Select>
        <div className="field-info">工作条件影响联轴器选型，类别越高代表负载变化越大</div>
      </Form.Group>
      <div className="mt-4">
        <HCGWorkloadSelector value={requirementData.hcgWorkload} onChange={(workload) => handleRequirementDataChange({ hcgWorkload: workload })} colors={colors} style={{ marginBottom: '0' }} />
      </div>

      {/* 保存模板弹窗 */}
      <Modal show={showSaveModal} onHide={() => setShowSaveModal(false)} size="sm" centered>
        <Modal.Header closeButton><Modal.Title className="fs-6">保存选型模板</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label className="small">模板名称</Form.Label>
            <Form.Control
              size="sm"
              value={templateName}
              onChange={e => setTemplateName(e.target.value)}
              placeholder="如: 1000吨散货船标准配置"
              maxLength={30}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter' && templateName.trim()) handleSaveTemplate(); }}
            />
          </Form.Group>
          {engineData.power && engineData.speed && (
            <div className="mt-2 small text-muted">
              当前参数: {engineData.power}kW / {engineData.speed}rpm
              {requirementData.targetRatio ? ` / i=${requirementData.targetRatio}` : ''}
              {requirementData.thrustRequirement ? ` / ${requirementData.thrustRequirement}kN` : ''}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button size="sm" variant="secondary" onClick={() => setShowSaveModal(false)}>取消</Button>
          <Button size="sm" variant="primary" onClick={handleSaveTemplate} disabled={!templateName.trim()}>保存</Button>
        </Modal.Footer>
      </Modal>
    </Form>
  );

  const renderWorkConfig = () => (
    <Form>
      <h6 style={{ color: colors.headerText }}>选型与配件设置</h6>
      <Form.Group className="mb-4" controlId="gearboxType">
        <Form.Label style={{ color: colors.text, fontWeight: 500 }}>齿轮箱系列</Form.Label>
        <div className="gearbox-type-selector">
          <Button variant={gearboxType === 'auto' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('auto')}>自动选择</Button>
          {appDataState?.hcGearboxes?.length > 0 && <Button variant={gearboxType === 'HC' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('HC')}>HC系列</Button>}
          {appDataState?.gwGearboxes?.length > 0 && <Button variant={gearboxType === 'GW' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('GW')}>GW系列</Button>}
          {appDataState?.hcmGearboxes?.length > 0 && <Button variant={gearboxType === 'HCM' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('HCM')}>HCM系列</Button>}
          {appDataState?.dtGearboxes?.length > 0 && <Button variant={gearboxType === 'DT' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('DT')}>DT系列</Button>}
          {appDataState?.hcqGearboxes?.length > 0 && <Button variant={gearboxType === 'HCQ' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('HCQ')}>HCQ系列</Button>}
          {appDataState?.gcGearboxes?.length > 0 && <Button variant={gearboxType === 'GC' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('GC')}>GC系列</Button>}
          {appDataState?.hcaGearboxes?.length > 0 && <Button variant={gearboxType === 'HCA' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('HCA')}>HCA系列</Button>}
          {appDataState?.hcvGearboxes?.length > 0 && <Button variant={gearboxType === 'HCV' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('HCV')}>HCV系列</Button>}
          {appDataState?.hcxGearboxes?.length > 0 && <Button variant={gearboxType === 'HCX' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('HCX')}>HCX系列</Button>}
          {appDataState?.mvGearboxes?.length > 0 && <Button variant={gearboxType === 'MV' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('MV')}>MV系列</Button>}
          {appDataState?.otherGearboxes?.length > 0 && <Button variant={gearboxType === 'OTHER' ? 'primary' : 'outline-primary'} onClick={() => handleGearboxTypeChange('OTHER')}>其他系列</Button>}
        </div>
        <div className="field-info">不同系列齿轮箱适合不同应用场景。自动选择会搜索所有系列找到最佳匹配。</div>
      </Form.Group>

      {/* 轴布置方式 - GW和auto模式下显示 */}
      {(gearboxType === 'GW' || gearboxType === 'auto') && (
        <Form.Group className="mb-4" controlId="shaftArrangement">
          <Form.Label style={{ color: colors.text, fontWeight: 500 }}>轴布置方式</Form.Label>
          <ShaftArrangementSelector
            value={requirementData.shaftArrangement || { axisAlignment: 'any', offsetDirection: 'any' }}
            onChange={(val) => handleRequirementDataChange({ shaftArrangement: val })}
            colors={colors}
            gearboxType={gearboxType}
          />
        </Form.Group>
      )}

      {/* 离合器需求 */}
      <Form.Group className="mb-4" controlId="hasClutch">
        <Form.Label style={{ color: colors.text, fontWeight: 500 }}>离合器需求</Form.Label>
        <div className="d-flex gap-2 flex-wrap">
          {[
            { value: null,  label: '不限',     icon: 'bi-dash-circle',   desc: '系统自动匹配' },
            { value: true,  label: '带离合器', icon: 'bi-gear-fill',     desc: 'HC/GW/HCM/GC等，具备正倒车功能' },
            { value: false, label: '无离合器', icon: 'bi-arrows-expand', desc: 'DT电推专用，直接传动' },
          ].map(({ value, label, icon, desc }) => {
            const active = requirementData.hasClutch === value;
            return (
              <Button
                key={String(value)}
                size="sm"
                variant={active ? 'primary' : 'outline-secondary'}
                onClick={() => handleRequirementDataChange({ hasClutch: value })}
                title={desc}
              >
                <i className={`bi ${icon} me-1`}></i>{label}
              </Button>
            );
          })}
        </div>
        <div className="field-info mt-1">
          带离合器：液压湿式多片摩擦离合器，支持正倒车换向（固定螺距桨）；
          无离合器：DT系列，电推专用直接传动。
        </div>
      </Form.Group>

      <Suspense fallback={<LazyLoadFallback />}>
        <PropulsionConfigSelector
          config={{ engineConfiguration: requirementData.engineConfiguration, inputRotation: requirementData.inputRotation, outputRotation: requirementData.outputRotation, propellerConfig: requirementData.propellerConfig, portEngineRotation: requirementData.portEngineRotation, starboardEngineRotation: requirementData.starboardEngineRotation, portUseReverse: requirementData.portUseReverse, starboardUseReverse: requirementData.starboardUseReverse }}
          onChange={(newConfig) => handleRequirementDataChange(newConfig)}
          gearboxType={gearboxType}
          theme={theme}
          colors={colors}
          onRotationConflictChange={setHasRotationConflict}
        />
      </Suspense>

      <div className="mt-4">
        <HybridConfigPanel hybridConfig={hybridConfig} setHybridConfig={setHybridConfig} enginePower={engineData.power} colors={colors} collapsed={true} />
      </div>
    </Form>
  );

  const renderProjectInfo = () => (
    <Form>
      <h6 style={{ color: colors.headerText }}>项目信息 (用于文档生成)</h6>
      <Row>
        <Col sm={6}>
          <Form.Group className="mb-3" controlId="projectName">
            <Form.Label style={{ color: colors.text }}>项目名称</Form.Label>
            <Form.Control type="text" placeholder="例如: 38m渔船动力配套" value={projectInfo.projectName} onChange={(e) => handleProjectInfoChange({ projectName: e.target.value })} style={{...inputStyles, ...focusStyles}} />
            <div className="field-info">用于报价单、技术协议等文档标题</div>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group className="mb-3" controlId="customerName">
            <Form.Label style={{ color: colors.text }}>客户名称</Form.Label>
            <Form.Control type="text" placeholder="例如: 舟山渔业公司" value={projectInfo.customerName} onChange={(e) => handleProjectInfoChange({ customerName: e.target.value })} style={{...inputStyles, ...focusStyles}} />
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group className="mb-3" controlId="engineModel">
            <Form.Label style={{ color: colors.text }}>主机型号 (可选)</Form.Label>
            <Form.Control type="text" value={projectInfo.engineModel} onChange={(e) => handleProjectInfoChange({ engineModel: e.target.value })} placeholder="例如: 潍柴WP6C185-21" style={{...inputStyles, ...focusStyles}} />
            <div className="field-info">填写后可自动匹配飞轮壳接口和联轴器</div>
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group className="mb-3" controlId="contactPerson">
            <Form.Label style={{ color: colors.text }}>联系人</Form.Label>
            <Form.Control type="text" value={projectInfo.contactPerson} onChange={(e) => handleProjectInfoChange({ contactPerson: e.target.value })} placeholder="报价单/协议联系人" style={{...inputStyles, ...focusStyles}} />
          </Form.Group>
        </Col>
        <Col sm={6}>
          <Form.Group className="mb-3" controlId="contactPhone">
            <Form.Label style={{ color: colors.text }}>联系电话</Form.Label>
            <Form.Control type="tel" value={projectInfo.contactPhone} onChange={(e) => handleProjectInfoChange({ contactPhone: e.target.value })} placeholder="报价单/协议联系电话" style={{...inputStyles, ...focusStyles}} />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col sm={6}>
          <Form.Group className="mb-3" controlId="temperature">
            <Form.Label style={{ color: colors.text }}>工作温度 (°C)</Form.Label>
            <Form.Control type="number" value={requirementData.temperature} onChange={(e) => handleRequirementDataChange({ temperature: e.target.value })} placeholder="留空默认30°C" step="1" style={{...inputStyles, ...focusStyles}} className={`${getValidationClassName(getFieldValidationState('temperature', requirementData.temperature))}`} />
            <div className="form-feedback invalid">请输入有效的工作温度</div>
            <div className="form-feedback warning">温度超出常规范围，请确认是否正确</div>
            <div className="field-info">常规工作温度范围: -20°C ~ 60°C</div>
          </Form.Group>
        </Col>
      </Row>
      <Form.Group className="mb-3" controlId="hasCover">
        <Form.Check type="checkbox" label="联轴器需要带罩壳" checked={requirementData.hasCover} onChange={(e) => handleRequirementDataChange({ hasCover: e.target.checked })} style={{ color: colors.text }} />
        <div className="field-info">带罩壳联轴器有更好的保护效果，但价格更高</div>
      </Form.Group>
      <Form.Group className="mb-3" controlId="application">
        <Form.Label style={{ color: colors.text }}>应用场景</Form.Label>
        <Form.Select value={requirementData.application} onChange={(e) => handleRequirementDataChange({ application: e.target.value })} style={{...inputStyles, ...focusStyles}} aria-label="选择应用场景">
          {applicationOptions.map(option => (<option key={option.value} value={option.value}>{option.label}</option>))}
        </Form.Select>
        <div className="field-info">应用场景影响服务系数和传递能力裕度计算，不同船型对齿轮箱工况要求不同</div>
      </Form.Group>
    </Form>
  );

  // --- Wizard mode rendering ---
  if (wizardMode) {
    return (
      <>
        <SelectionGuidelines colors={colors} defaultOpen={false} />

        {/* Mode toggle */}
        <div className="d-flex justify-content-end mb-3">
          <ButtonGroup size="sm">
            <Button variant={wizardMode ? 'primary' : 'outline-primary'} onClick={() => setWizardMode(true)}>
              <i className="bi bi-signpost-split me-1"></i>引导模式
            </Button>
            <Button variant={!wizardMode ? 'primary' : 'outline-primary'} onClick={() => setWizardMode(false)}>
              <i className="bi bi-grid-3x3-gap me-1"></i>完整模式
            </Button>
          </ButtonGroup>
        </div>

        <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
          <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
            <i className={`${STEPS[currentStep - 1].icon} me-2`}></i>
            步骤 {currentStep}/3: {STEPS[currentStep - 1].title}
          </Card.Header>
          <Card.Body style={{ padding: '1.5rem' }}>
            <StepIndicator />
            {currentStep === 1 && renderCoreParams()}
            {currentStep === 2 && renderWorkConfig()}
            {currentStep === 3 && renderProjectInfo()}
            <WizardNav />
          </Card.Body>
        </Card>
      </>
    );
  }

  // --- Full mode rendering (original two-column layout) ---
  return (
    <>
      <SelectionGuidelines colors={colors} defaultOpen={false} />

      {/* Mode toggle */}
      <div className="d-flex justify-content-end mb-3">
        <ButtonGroup size="sm">
          <Button variant={wizardMode ? 'primary' : 'outline-primary'} onClick={() => setWizardMode(true)}>
            <i className="bi bi-signpost-split me-1"></i>引导模式
          </Button>
          <Button variant={!wizardMode ? 'primary' : 'outline-primary'} onClick={() => setWizardMode(false)}>
            <i className="bi bi-grid-3x3-gap me-1"></i>完整模式
          </Button>
        </ButtonGroup>
      </div>

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
              <i className="bi bi-sliders me-2"></i>发动机 & 要求
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              {renderCoreParams()}
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
              <i className="bi bi-folder-fill me-2"></i>项目信息 & 选型设置
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              {renderProjectInfo()}
              <hr />
              {renderWorkConfig()}

              <div className="d-grid mt-4">
                <Button
                  variant="primary"
                  onClick={handleSelectGearbox}
                  disabled={loading || !isFormValid().isValid || !appDataState || Object.keys(appDataState).length === 0 || hasRotationConflict}
                  style={{ backgroundColor: colors.primary, borderColor: colors.primary, color: colors.primaryText }}
                  className="btn-lg"
                >
                  {loading ? (
                    <><Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />选型中...</>
                  ) : hasRotationConflict ? (
                    <><i className="bi bi-exclamation-triangle-fill me-2"></i>请先解决旋向冲突</>
                  ) : (
                    <><i className="bi bi-calculator-fill me-2"></i>开始选型</>
                  )}
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default InputParametersTab;
