// src/components/AgreementGenerator.js
// 重构版本 - 2026-01-10
// 使用子组件和自定义Hook优化代码结构
import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Form, Row, Col, Card, Button, Tabs, Tab, Alert, Spinner, ListGroup, Badge } from 'react-bootstrap';
import { TemplateType, LanguageType } from '../utils/agreementTemplateManager';
import { ClassificationType } from '../utils/classificationCertificates';
import TemplateSelectionModal from './TemplateSelectionModal';
import AgreementDrawingSection from './AgreementDrawingSection';
import AgreementDrawingSelector from './AgreementDrawingSelector';
import AgreementGuideMenu from './AgreementGuideMenu';
import '../styles/agreementTemplates.css';
import '../styles/bilingualStyles.css';
// 导入子组件和Hook
import {
  BasicInfoForm,
  AgreementOptionsForm,
  SpecialRequirementsEditor,
  AgreementPreview,
  useAgreementGeneration
} from './AgreementGenerator/index';

// ==================== Reducer 和 Actions 定义 ====================

/**
 * 模板操作类型常量
 */
const TEMPLATE_ACTIONS = {
  ADD: 'ADD_TEMPLATE',
  ADD_BATCH: 'ADD_BATCH_TEMPLATES',  // 批量添加，避免多次渲染
  REMOVE: 'REMOVE_TEMPLATE',
  MOVE: 'MOVE_TEMPLATE',
  CLEAR: 'CLEAR_TEMPLATES',
  SET: 'SET_TEMPLATES'
};

/**
 * 模板Reducer函数 - 纯函数，无副作用
 * @param {string[]} state - 当前模板数组
 * @param {Object} action - 操作对象
 * @returns {string[]} 新的模板数组
 */
const templateReducer = (state, action) => {
  switch (action.type) {
    case TEMPLATE_ACTIONS.ADD: {
      const template = action.payload?.trim();
      if (!template || state.includes(template)) {
        return state; // 忽略空或重复模板
      }
      return [...state, template];
    }

    case TEMPLATE_ACTIONS.ADD_BATCH: {
      // 批量添加模板，只触发一次状态更新
      const newTemplates = action.payload;
      if (!Array.isArray(newTemplates) || newTemplates.length === 0) {
        return state;
      }
      // 过滤掉空模板和已存在的模板
      const uniqueNew = newTemplates
        .map(t => t?.trim())
        .filter(t => t && !state.some(existing => existing.trim() === t));
      if (uniqueNew.length === 0) {
        return state;
      }
      return [...state, ...uniqueNew];
    }

    case TEMPLATE_ACTIONS.REMOVE: {
      const index = action.payload;
      if (index < 0 || index >= state.length) return state;
      return state.filter((_, i) => i !== index);
    }

    case TEMPLATE_ACTIONS.MOVE: {
      const { from, to } = action.payload || {};
      if (from < 0 || to < 0 || from >= state.length || to >= state.length || from === to) {
        return state;
      }
      const newState = [...state];
      const [moved] = newState.splice(from, 1);
      newState.splice(to, 0, moved);
      return newState;
    }

    case TEMPLATE_ACTIONS.CLEAR:
      return [];

    case TEMPLATE_ACTIONS.SET:
      return Array.isArray(action.payload) ? action.payload : [];

    default:
      return state;
  }
};


/**
 * 技术协议生成器组件
 * 用于选择、配置和生成各类型的技术协议
 */
const AgreementGenerator = ({
  selectionResult,
  projectInfo,
  selectedComponents,
  colors,
  theme,
  onGenerated = () => {},
  onSpecialRequirementsChange = () => {}  // 新增: 用于与合同同步特殊订货要求
}) => {
  // 状态管理
  const [templateType, setTemplateType] = useState(TemplateType.GWC);
  const [language, setLanguage] = useState(LanguageType.CHINESE);
  const [options, setOptions] = useState({
    includeQualitySection: true,
    includeMaintenanceSection: true,
    includeAttachmentSection: true,
    includeShipInfo: true,
    approvalPeriod: 10,
    feedbackPeriod: 10,
    warrantyPeriod: "十二个月"
  });
  // 使用 useReducer 管理模板数组
  const [selectedTemplates, dispatchTemplates] = React.useReducer(templateReducer, []);

  // 可编辑的基本信息状态 - 用于第2步向导
  const [editableInfo, setEditableInfo] = useState({
    // 船东信息
    shipOwner: '',
    shipOwnerContact: '',
    // 船厂信息
    shipyard: '',
    projectNumber: '',
    shipType: '',
    shipName: '',
    // 船检要求
    classificationType: ClassificationType.NONE,
    // 主机参数
    engineModel: '',
    enginePower: '',
    engineSpeed: '',
    engineRotation: '顺时针',
    flywheelSpec: ''
  });

  // 从props初始化可编辑信息 (仅首次加载时)
  const initializedRef = useRef(false);
  useEffect(() => {
    if (!initializedRef.current && projectInfo) {
      setEditableInfo(prev => ({
        ...prev,
        shipOwner: projectInfo.customerName || projectInfo.shipOwner || '',
        shipyard: projectInfo.shipyard || '',
        projectNumber: projectInfo.projectNumber || '',
        shipType: projectInfo.shipType || '',
        shipName: projectInfo.projectName || projectInfo.shipName || '',
        classificationType: projectInfo.classificationType || ClassificationType.NONE,
        engineModel: projectInfo.engineModel || selectionResult?.engineData?.model || '',
        enginePower: projectInfo.power || selectionResult?.engineData?.power || '',
        engineSpeed: projectInfo.speed || selectionResult?.engineData?.speed || '',
        engineRotation: selectionResult?.engineData?.rotation || '顺时针',
        flywheelSpec: projectInfo.flywheelSpec || ''
      }));
      initializedRef.current = true;
    }
  }, [projectInfo, selectionResult]);

  // 处理基本信息变更
  const handleEditableInfoChange = useCallback((field, value) => {
    setEditableInfo(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  // 派生 specialRequirements 字符串（用于生成协议）
  const specialRequirements = useMemo(() => selectedTemplates.join('\n'), [selectedTemplates]);

  // 当模板变化时同步到父组件（用于合同生成）
  useEffect(() => {
    onSpecialRequirementsChange(selectedTemplates.join('\n'));
  }, [selectedTemplates, onSpecialRequirementsChange]);

  const [specialReqType, setSpecialReqType] = useState('custom'); // 'custom' 或 'template'
  const [specialRequirementsFormat, setSpecialRequirementsFormat] = useState('numbered'); // 'numbered', 'bullet', 'plain'

  // 联轴器选择状态
  const [selectedCouplingModel, setSelectedCouplingModel] = useState(
    selectedComponents?.coupling?.model || ''
  );
  // 使用自定义Hook管理协议生成 - 注意：agreement, loading, error等状态由Hook管理
  const [activeTab, setActiveTab] = useState('config');
  
  // 新增双语模板相关状态
  const [isBilingual, setIsBilingual] = useState(false);
  const [bilingualLayout, setBilingualLayout] = useState('side-by-side');

  // 模板选择模态框状态
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // 外形图选择器状态
  const [showDrawingSelector, setShowDrawingSelector] = useState(false);
  const [selectedDrawings, setSelectedDrawings] = useState([]);

  // 向导菜单状态
  const [showGuideMenu, setShowGuideMenu] = useState(true);
  const [currentGuideStep, setCurrentGuideStep] = useState(0);
  const [completedGuideSteps, setCompletedGuideSteps] = useState([]);

  // 使用协议生成Hook
  const {
    agreement,
    loading,
    error,
    generateAgreement,
    clearError,
    getTemplateDataForRequirements
  } = useAgreementGeneration({
    selectedComponents,
    selectionResult,
    projectInfo,
    editableInfo,
    options,
    specialRequirements,
    specialRequirementsFormat,
    selectedCouplingModel,
    templateType,
    language,
    isBilingual,
    bilingualLayout,
    onGenerated
  });

  // 根据所选齿轮箱型号自动设置模板类型
  useEffect(() => {
    try {
      if (selectedComponents?.gearbox?.model) {
        const model = selectedComponents.gearbox.model;
        if (model.startsWith('GWC') || model.startsWith('GWL')) {
          setTemplateType(TemplateType.GWC);
        } else if (model.startsWith('HCT')) {
          setTemplateType(TemplateType.HCT);
        } else if (model.startsWith('HC')) {
          setTemplateType(TemplateType.HC);
        } else if (model.startsWith('DT')) {
          setTemplateType(TemplateType.DT);
        } else if (model.startsWith('HCD')) {
          setTemplateType(TemplateType.HCD);
        }
      }
    } catch (error) {
      console.error("根据型号设置模板类型出错:", error);
    }
  }, [selectedComponents]);

  // 当推荐联轴器变化时，同步更新选择状态
  useEffect(() => {
    if (selectedComponents?.coupling?.model) {
      setSelectedCouplingModel(selectedComponents.coupling.model);
    }
  }, [selectedComponents?.coupling?.model]);

  // 处理选项变更
  const handleOptionChange = useCallback((name, value) => {
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  // 处理外形图选择器
  const handleShowDrawingSelector = useCallback(() => {
    setShowDrawingSelector(true);
  }, []);

  const handleDrawingSelectorConfirm = useCallback((drawings) => {
    setSelectedDrawings(drawings);
    setShowDrawingSelector(false);
    console.log('已选择的外形图:', drawings);
  }, []);

  const handleHideDrawingSelector = useCallback(() => {
    setShowDrawingSelector(false);
  }, []);

  // 生成协议并切换到预览Tab
  const handleGenerateAgreement = useCallback(() => {
    const result = generateAgreement();
    if (result) {
      setActiveTab('preview');
    }
  }, [generateAgreement]);

  // 模板操作回调
  // 处理模板选择模态框确认
  // 使用 ADD_BATCH 批量添加，只触发一次状态更新，避免UI卡顿
  const handleConfirmTemplates = useCallback((newTemplates) => {
    if (newTemplates && newTemplates.length > 0) {
      // 使用批量添加，一次性更新所有模板
      dispatchTemplates({ type: TEMPLATE_ACTIONS.ADD_BATCH, payload: newTemplates });
    }
  }, []);

  // 向导菜单步骤点击处理
  const handleGuideStepClick = useCallback((stepIndex) => {
    setCurrentGuideStep(stepIndex);
    // 根据步骤切换到对应的Tab
    switch (stepIndex) {
      case 0: // 选择协议类型
      case 1: // 填写基本信息
      case 2: // 配置特殊要求
        setActiveTab('config');
        break;
      case 3: // 查看外形图
        setActiveTab('drawings');
        break;
      case 4: // 预览并导出
        if (agreement) {
          setActiveTab('preview');
        }
        break;
      default:
        break;
    }
  }, [agreement]);

  // 向导菜单项目点击处理
  const handleGuideItemClick = useCallback((stepIndex, itemId) => {
    setCurrentGuideStep(stepIndex);
    // 可以根据itemId做更精细的滚动定位
    handleGuideStepClick(stepIndex);
  }, [handleGuideStepClick]);

  // 标记步骤完成
  const markStepCompleted = useCallback((stepIndex) => {
    setCompletedGuideSteps(prev => {
      if (prev.includes(stepIndex)) return prev;
      return [...prev, stepIndex];
    });
  }, []);

  // 当Tab变化时更新当前步骤
  useEffect(() => {
    switch (activeTab) {
      case 'config':
        if (currentGuideStep > 2) setCurrentGuideStep(0);
        break;
      case 'drawings':
        setCurrentGuideStep(3);
        break;
      case 'preview':
        setCurrentGuideStep(4);
        markStepCompleted(4);
        break;
      default:
        break;
    }
  }, [activeTab, currentGuideStep, markStepCompleted]);
  
  return (
    <>
    <Row>
      {/* 左侧向导菜单 */}
      {showGuideMenu && (
        <Col md={3}>
          <AgreementGuideMenu
            currentStep={currentGuideStep}
            completedSteps={completedGuideSteps}
            onStepClick={handleGuideStepClick}
            onItemClick={handleGuideItemClick}
            colors={colors}
            theme={theme}
            collapsed={false}
            onToggleCollapse={() => setShowGuideMenu(false)}
          />
        </Col>
      )}

      {/* 右侧主内容区 */}
      <Col md={showGuideMenu ? 9 : 12}>
        {!showGuideMenu && (
          <Button
            variant="outline-secondary"
            size="sm"
            className="mb-3"
            onClick={() => setShowGuideMenu(true)}
          >
            <i className="bi bi-list me-1"></i>
            显示向导菜单
          </Button>
        )}

    <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-file-earmark-text me-2"></i>
            齿轮箱技术协议生成
          </span>
          {agreement && (
            <Badge bg="success">
              <i className="bi bi-check-circle me-1"></i> 协议已生成
            </Badge>
          )}
        </div>
      </Card.Header>

      <Card.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        <Tabs
          activeKey={activeTab}
          onSelect={(k) => setActiveTab(k)}
          className="mb-3"
        >
          <Tab eventKey="config" title="配置">
            <Form>
              {/* 第1步：协议选项配置（模板类型、语言、联轴器等）- 使用子组件 */}
              <AgreementOptionsForm
                templateType={templateType}
                setTemplateType={setTemplateType}
                language={language}
                setLanguage={setLanguage}
                isBilingual={isBilingual}
                setIsBilingual={setIsBilingual}
                bilingualLayout={bilingualLayout}
                setBilingualLayout={setBilingualLayout}
                selectedCouplingModel={selectedCouplingModel}
                setSelectedCouplingModel={setSelectedCouplingModel}
                recommendedCouplingModel={selectedComponents?.coupling?.model}
                options={options}
                onOptionChange={handleOptionChange}
              />

              {/* 第2步：基本信息编辑 - 使用子组件 */}
              <BasicInfoForm
                editableInfo={editableInfo}
                onInfoChange={handleEditableInfoChange}
              />

              {/* 第3步：特殊订货要求 - 使用子组件 */}
              <SpecialRequirementsEditor
                selectedTemplates={selectedTemplates}
                dispatchTemplates={dispatchTemplates}
                TEMPLATE_ACTIONS={TEMPLATE_ACTIONS}
                specialReqType={specialReqType}
                setSpecialReqType={setSpecialReqType}
                specialRequirementsFormat={specialRequirementsFormat}
                setSpecialRequirementsFormat={setSpecialRequirementsFormat}
                onShowTemplateModal={() => setShowTemplateModal(true)}
                colors={colors}
              />
              
              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  onClick={handleGenerateAgreement}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                      生成中...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-file-earmark-text me-2"></i>
                      生成技术协议
                    </>
                  )}
                </Button>
              </div>
            </Form>
          </Tab>
          
          {/* 外形图Tab */}
          <Tab eventKey="drawings" title="外形图">
            {/* 外形图选择控制栏 */}
            <div className="mb-3 d-flex justify-content-between align-items-center p-3" style={{ backgroundColor: colors.card || '#f8f9fa', borderRadius: '8px' }}>
              <div>
                <h6 className="mb-1" style={{ color: colors.text || '#333' }}>
                  <i className="bi bi-file-earmark-image me-2"></i>
                  外形图管理
                </h6>
                <small className="text-muted">
                  {selectedDrawings.length > 0 ? (
                    <>已选择 <Badge bg="primary">{selectedDrawings.length}</Badge> 个外形图用于技术协议</>
                  ) : (
                    '点击"选择外形图"按钮，从图库中选择需要嵌入技术协议的外形图'
                  )}
                </small>
              </div>
              <div>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleShowDrawingSelector}
                  className="me-2"
                >
                  <i className="bi bi-ui-checks me-1"></i>
                  选择外形图
                </Button>
                {selectedDrawings.length > 0 && (
                  <Button
                    variant="outline-secondary"
                    size="sm"
                    onClick={() => setSelectedDrawings([])}
                  >
                    <i className="bi bi-x-circle me-1"></i>
                    清空选择
                  </Button>
                )}
              </div>
            </div>

            {/* 已选择的外形图列表 */}
            {selectedDrawings.length > 0 && (
              <div className="mb-3">
                <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
                  <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa' }}>
                    <strong>已选择的外形图</strong>
                  </Card.Header>
                  <Card.Body>
                    <ListGroup variant="flush">
                      {selectedDrawings.map((drawing, index) => (
                        <ListGroup.Item
                          key={index}
                          className="d-flex justify-content-between align-items-center"
                          style={{ backgroundColor: colors.card }}
                        >
                          <div>
                            <div className="fw-bold">{drawing.fileName}</div>
                            <small className="text-muted">
                              <Badge bg={drawing.type === 'gearbox' ? 'primary' : 'success'} className="me-2">
                                {drawing.type === 'gearbox' ? '齿轮箱' : '联轴器'}
                              </Badge>
                              <Badge bg="secondary" className="me-2">{drawing.series}</Badge>
                              <span>{drawing.fileSize}</span>
                            </small>
                          </div>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setSelectedDrawings(prev => prev.filter((_, i) => i !== index));
                            }}
                          >
                            <i className="bi bi-trash"></i>
                          </Button>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </div>
            )}

            {/* 外形图浏览器 */}
            <AgreementDrawingSection
              gearboxModel={selectedComponents?.gearbox?.model}
              couplingModel={selectedCouplingModel || selectedComponents?.coupling?.model}
              colors={colors}
              theme={theme}
              onDrawingSelect={(drawing) => {
                console.log('选择的外形图:', drawing);
                markStepCompleted(3);
              }}
            />
          </Tab>

          <Tab eventKey="preview" title="预览" disabled={!agreement}>
            <AgreementPreview
              agreement={agreement}
              projectInfo={projectInfo}
            />
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
    </Col>
    </Row>

    {/* 模板选择模态框 */}
    <TemplateSelectionModal
      show={showTemplateModal}
      onHide={() => setShowTemplateModal(false)}
      onConfirm={handleConfirmTemplates}
      templateData={getTemplateDataForRequirements()}
      colors={colors}
      language={language === LanguageType.CHINESE ? 'chinese' : 'english'}
    />

    {/* 外形图选择器模态框 */}
    <AgreementDrawingSelector
      show={showDrawingSelector}
      onHide={handleHideDrawingSelector}
      gearboxModel={selectedComponents?.gearbox?.model || ''}
      couplingModel={selectedCouplingModel || selectedComponents?.coupling?.model || ''}
      onConfirm={handleDrawingSelectorConfirm}
      initialSelected={selectedDrawings}
    />
    </>
  );
};

export default AgreementGenerator;