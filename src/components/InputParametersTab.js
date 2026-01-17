// src/components/InputParametersTab.js
// 输入参数选项卡组件 - 从 App.js 拆分

import React, { Suspense, lazy } from 'react';
import { Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import SelectionGuidelines, { HelpTooltip, HCGWorkloadSelector } from './SelectionGuidelines';
import HybridConfigPanel from './HybridConfigPanel';

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
  return (
    <>
      {/* 选型须知面板 - 杭齿厂选型手册2025版5月版 */}
      <SelectionGuidelines colors={colors} defaultOpen={false} />

      <Row>
        <Col md={6}>
          <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
              <i className="bi bi-sliders me-2"></i>发动机 & 要求
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Form>
                <h6 style={{ color: colors.headerText }}>发动机参数</h6>

                <Form.Group className="mb-3" controlId="enginePower">
                  <Form.Label style={{ color: colors.text }}>主机功率 (kW) <span className="text-danger">*</span> <HelpTooltip id="power-tip" content="传递能力 = 功率 ÷ 转速 (kW/r·min⁻¹)" /></Form.Label>
                  <Form.Control
                    type="number"
                    value={engineData.power}
                    onChange={(e) => handleEngineDataChange({ power: e.target.value })}
                    placeholder="例如: 350"
                    min="1"
                    step="any"
                    required
                    style={{...inputStyles, ...focusStyles}}
                    className={`${getValidationClassName(getFieldValidationState('enginePower', engineData.power))}`}
                  />
                  <div className="form-feedback invalid">
                    请输入有效的主机功率 (大于0)
                  </div>
                  <div className="form-feedback warning">
                    功率值较大，请确认是否正确
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="engineSpeed">
                  <Form.Label style={{ color: colors.text }}>主机转速 (r/min) <span className="text-danger">*</span> <HelpTooltip id="speed-tip" content="发动机额定转速，齿轮箱输入转速范围需覆盖此值" /></Form.Label>
                  <Form.Control
                    type="number"
                    value={engineData.speed}
                    onChange={(e) => handleEngineDataChange({ speed: e.target.value })}
                    placeholder="例如: 1800"
                    min="1"
                    step="any"
                    required
                    style={{...inputStyles, ...focusStyles}}
                    className={`${getValidationClassName(getFieldValidationState('engineSpeed', engineData.speed))}`}
                  />
                  <div className="form-feedback invalid">
                    请输入有效的主机转速 (大于0)
                  </div>
                  <div className="form-feedback warning">
                    转速值较高，请确认是否正确
                  </div>
                  <div className="field-info">
                    常见柴油机转速范围: 750-2200 r/min
                  </div>
                </Form.Group>

                <h6 style={{ color: colors.headerText }} className="mt-4">选型要求</h6>
                <Form.Group className="mb-3" controlId="targetRatio">
                  <Form.Label style={{ color: colors.text }}>目标减速比 <span className="text-danger">*</span> <HelpTooltip id="ratio-tip" content="减速比 = 输入转速 ÷ 输出转速，减速比越大输出扭矩越大" /></Form.Label>
                  <Form.Control
                    type="number"
                    value={requirementData.targetRatio}
                    onChange={(e) => handleRequirementDataChange({ targetRatio: e.target.value })}
                    placeholder="例如: 4.5"
                    min="0.1"
                    step="any"
                    required
                    style={{...inputStyles, ...focusStyles}}
                    className={`${getValidationClassName(getFieldValidationState('targetRatio', requirementData.targetRatio))}`}
                  />
                  <div className="form-feedback invalid">
                    请输入有效的目标减速比 (大于0)
                  </div>
                  <div className="form-feedback warning">
                    减速比较大，请确认是否正确
                  </div>
                  <div className="field-info">
                    常见减速比范围: 1.5-10
                  </div>
                </Form.Group>
                <Form.Group className="mb-3" controlId="thrustRequirement">
                  <Form.Label style={{ color: colors.text }}>推力要求 (kN, 可选)</Form.Label>
                  <Form.Control
                    type="number"
                    value={requirementData.thrustRequirement}
                    onChange={(e) => handleRequirementDataChange({ thrustRequirement: e.target.value })}
                    placeholder="留空则不强制匹配推力"
                    min="0"
                    step="any"
                    style={{...inputStyles, ...focusStyles}}
                    className={`${getValidationClassName(getFieldValidationState('thrustRequirement', requirementData.thrustRequirement))}`}
                  />
                  <div className="form-feedback invalid">
                    推力要求不能为负数
                  </div>
                  <div className="form-feedback warning">
                    推力值较大，请确认是否正确
                  </div>
                  <div className="field-info">
                    更高的推力要求会限制可选齿轮箱型号
                  </div>
                </Form.Group>

                <Form.Group className="mb-3 work-condition-selector" controlId="workCondition">
                  <Form.Label style={{ color: colors.text }}>工作条件</Form.Label>
                  <Form.Select
                    value={requirementData.workCondition}
                    onChange={(e) => handleRequirementDataChange({ workCondition: e.target.value })}
                    style={{...inputStyles, ...focusStyles}}
                    aria-label="选择工作条件"
                  >
                    {workConditionOptions.map(option => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </Form.Select>
                  <div className="field-info">
                    工作条件影响联轴器选型，类别越高代表负载变化越大
                  </div>
                </Form.Group>

                {/* HCG铝合金系列工况选择器 - 杭齿选型手册2025版 */}
                <div className="mt-4">
                  <HCGWorkloadSelector
                    value={requirementData.hcgWorkload}
                    onChange={(workload) => handleRequirementDataChange({ hcgWorkload: workload })}
                    colors={colors}
                    style={{ marginBottom: '0' }}
                  />
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4 shadow-sm" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
              <i className="bi bi-folder-fill me-2"></i>项目信息 & 选型设置
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Form>
                <h6 style={{ color: colors.headerText }}>项目信息 (用于文档生成)</h6>
                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3" controlId="projectName">
                      <Form.Label style={{ color: colors.text }}>项目名称</Form.Label>
                      <Form.Control type="text" placeholder="例如: 38m渔船" value={projectInfo.projectName} onChange={(e) => handleProjectInfoChange({ projectName: e.target.value })} style={{...inputStyles, ...focusStyles}}/>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3" controlId="customerName">
                      <Form.Label style={{ color: colors.text }}>客户名称</Form.Label>
                      <Form.Control type="text" placeholder="例如: 舟山渔业公司" value={projectInfo.customerName} onChange={(e) => handleProjectInfoChange({ customerName: e.target.value })} style={{...inputStyles, ...focusStyles}}/>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3" controlId="engineModel">
                      <Form.Label style={{ color: colors.text }}>主机型号 (可选)</Form.Label>
                      <Form.Control
                        type="text"
                        value={projectInfo.engineModel}
                        onChange={(e) => handleProjectInfoChange({ engineModel: e.target.value })}
                        placeholder="例如: Weichai WP6"
                        style={{...inputStyles, ...focusStyles}}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3" controlId="contactPerson">
                      <Form.Label style={{ color: colors.text }}>联系人</Form.Label>
                      <Form.Control type="text" value={projectInfo.contactPerson} onChange={(e) => handleProjectInfoChange({ contactPerson: e.target.value })} style={{...inputStyles, ...focusStyles}}/>
                    </Form.Group>
                  </Col>
                  <Col sm={6}>
                    <Form.Group className="mb-3" controlId="contactPhone">
                      <Form.Label style={{ color: colors.text }}>联系电话</Form.Label>
                      <Form.Control type="tel" value={projectInfo.contactPhone} onChange={(e) => handleProjectInfoChange({ contactPhone: e.target.value })} style={{...inputStyles, ...focusStyles}}/>
                    </Form.Group>
                  </Col>
                </Row>

                <h6 style={{ color: colors.headerText }} className="mt-4">选型与配件设置</h6>

                <Form.Group className="mb-4" controlId="gearboxType">
                  <Form.Label style={{ color: colors.text, fontWeight: 500 }}>齿轮箱系列</Form.Label>
                  <div className="gearbox-type-selector">
                    <Button
                      variant={gearboxType === 'auto' ? 'primary' : 'outline-primary'}
                      onClick={() => handleGearboxTypeChange('auto')}
                    >
                      自动选择
                    </Button>
                    {appDataState?.hcGearboxes?.length > 0 &&
                      <Button
                        variant={gearboxType === 'HC' ? 'primary' : 'outline-primary'}
                        onClick={() => handleGearboxTypeChange('HC')}
                      >
                        HC系列
                      </Button>
                    }
                    {appDataState?.gwGearboxes?.length > 0 &&
                      <Button
                        variant={gearboxType === 'GW' ? 'primary' : 'outline-primary'}
                        onClick={() => handleGearboxTypeChange('GW')}
                      >
                        GW系列
                      </Button>
                    }
                    {appDataState?.hcmGearboxes?.length > 0 &&
                      <Button
                        variant={gearboxType === 'HCM' ? 'primary' : 'outline-primary'}
                        onClick={() => handleGearboxTypeChange('HCM')}
                      >
                        HCM系列
                      </Button>
                    }
                    {appDataState?.dtGearboxes?.length > 0 &&
                      <Button
                        variant={gearboxType === 'DT' ? 'primary' : 'outline-primary'}
                        onClick={() => handleGearboxTypeChange('DT')}
                      >
                        DT系列
                      </Button>
                    }
                    {appDataState?.hcqGearboxes?.length > 0 &&
                      <Button
                        variant={gearboxType === 'HCQ' ? 'primary' : 'outline-primary'}
                        onClick={() => handleGearboxTypeChange('HCQ')}
                      >
                        HCQ系列
                      </Button>
                    }
                    {appDataState?.gcGearboxes?.length > 0 &&
                      <Button
                        variant={gearboxType === 'GC' ? 'primary' : 'outline-primary'}
                        onClick={() => handleGearboxTypeChange('GC')}
                      >
                        GC系列
                      </Button>
                    }
                  </div>
                  <div className="field-info">
                    不同系列齿轮箱适合不同应用场景。自动选择会搜索所有系列找到最佳匹配。
                  </div>
                </Form.Group>

                <Row>
                  <Col sm={6}>
                    <Form.Group className="mb-3" controlId="temperature">
                      <Form.Label style={{ color: colors.text }}>工作温度 (°C)</Form.Label>
                      <Form.Control
                        type="number"
                        value={requirementData.temperature}
                        onChange={(e) => handleRequirementDataChange({ temperature: e.target.value })}
                        placeholder="默认 30"
                        step="1"
                        style={{...inputStyles, ...focusStyles}}
                        className={`${getValidationClassName(getFieldValidationState('temperature', requirementData.temperature))}`}
                      />
                      <div className="form-feedback invalid">
                        请输入有效的工作温度
                      </div>
                      <div className="form-feedback warning">
                        温度超出常规范围，请确认是否正确
                      </div>
                      <div className="field-info">
                        常规工作温度范围: -10°C ~ 50°C
                      </div>
                    </Form.Group>
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="hasCover">
                  <Form.Check
                    type="checkbox"
                    label="联轴器需要带罩壳"
                    checked={requirementData.hasCover}
                    onChange={(e) => handleRequirementDataChange({ hasCover: e.target.checked })}
                    style={{ color: colors.text }}
                  />
                  <div className="field-info">
                    带罩壳联轴器有更好的保护效果，但价格更高
                  </div>
                </Form.Group>

                <Form.Group className="mb-3" controlId="application">
                  <Form.Label style={{ color: colors.text }}>应用场景</Form.Label>
                  <Form.Select
                    value={requirementData.application}
                    onChange={(e) => handleRequirementDataChange({ application: e.target.value })}
                    style={{...inputStyles, ...focusStyles}}
                    aria-label="选择应用场景"
                  >
                    {applicationOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </Form.Select>
                  <Form.Text style={{ color: colors.muted }}>影响服务系数和选型策略</Form.Text>
                </Form.Group>

                {/* 推进配置选择器 */}
                <Suspense fallback={<LazyLoadFallback />}>
                  <PropulsionConfigSelector
                    config={{
                      engineConfiguration: requirementData.engineConfiguration,
                      inputRotation: requirementData.inputRotation,
                      outputRotation: requirementData.outputRotation,
                      propellerConfig: requirementData.propellerConfig,
                      portEngineRotation: requirementData.portEngineRotation,
                      starboardEngineRotation: requirementData.starboardEngineRotation,
                      portUseReverse: requirementData.portUseReverse,
                      starboardUseReverse: requirementData.starboardUseReverse
                    }}
                    onChange={(newConfig) => handleRequirementDataChange(newConfig)}
                    gearboxType={gearboxType}
                    theme={theme}
                    colors={colors}
                  />
                </Suspense>

                {/* 混合动力配置面板 */}
                <div className="mt-4">
                  <HybridConfigPanel
                    hybridConfig={hybridConfig}
                    setHybridConfig={setHybridConfig}
                    enginePower={engineData.power}
                    colors={colors}
                    collapsed={true}
                  />
                </div>

                <div className="d-grid mt-4">
                  <Button
                    variant="primary"
                    onClick={handleSelectGearbox}
                    disabled={loading || !isFormValid().isValid || !appDataState || Object.keys(appDataState).length === 0}
                    style={{
                      backgroundColor: colors.primary,
                      borderColor: colors.primary,
                      color: colors.primaryText
                    }}
                    className="btn-lg"
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                        选型中...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-calculator-fill me-2"></i>
                        开始选型
                      </>
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default InputParametersTab;
