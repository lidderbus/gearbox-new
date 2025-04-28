// src/components/AgreementGenerator.js
import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Card, Button, Tabs, Tab, Alert, Spinner } from 'react-bootstrap';
import { getAgreementTemplate, fillTemplate, TemplateType, LanguageType } from '../utils/agreementTemplateManager';
import { exportHtmlContentToPDF } from '../utils/pdfExportUtils';
import '../styles/agreementTemplates.css';

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
  onGenerated = () => {}
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
  const [specialRequirements, setSpecialRequirements] = useState('');
  const [agreement, setAgreement] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('config');
  
  // 预览引用
  const previewRef = useRef(null);

  // 根据所选齿轮箱型号自动设置模板类型
  useEffect(() => {
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
  }, [selectedComponents]);
  
  // 处理选项变更
  const handleOptionChange = (name, value) => {
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 生成协议内容
  const generateAgreement = () => {
    setLoading(true);
    setError('');
    
    try {
      // 获取模板
      const template = getAgreementTemplate(templateType, language, options);
      
      if (!template) {
        throw new Error(`找不到${templateType}系列的${language === 'zh' ? '中文' : '英文'}模板`);
      }
      
      // 准备数据
      const gearbox = selectedComponents?.gearbox || {};
      const engine = selectionResult?.engineData || {};
      const ship = projectInfo || {};
      
      // 检查必要数据
      if (!gearbox.model) {
        throw new Error('未选择齿轮箱，无法生成协议');
      }
      
      // 准备模板数据
      const templateData = {
        // 项目和船舶信息
        projectNumber: ship.projectNumber || '',
        shipOwner: ship.customerName || '',
        shipyard: ship.shipyard || '',
        shipType: ship.shipType || '',
        shipManufacturer: ship.shipManufacturer || '',
        shipProjectNumber: ship.projectNumber || '',
        shipDesigner: ship.designer || '',
        registrationNumber: ship.registrationNumber || '',
        
        // 船检要求选择
        ccsEntry: ship.classification === 'CCS_ENTRY' ? 'checked' : '',
        ccsNonEntry: ship.classification === 'CCS_NON_ENTRY' ? 'checked' : '',
        ccsFishingVessel: ship.classification === 'CCS_FISHING' ? 'checked' : '',
        zyFishingVessel: ship.classification === 'ZY_FISHING' ? 'checked' : '',
        foreignShipInspection: ship.classification === 'FOREIGN' ? 'checked' : '',
        
        // 主机信息
        engineModel: ship.engineModel || engine.model || '',
        enginePower: engine.power || '',
        engineSpeed: engine.speed || '',
        engineRotation: engine.rotation || '顺时针',
        
        // 主机转向选择
        clockwise: (engine.rotation === '顺时针' || !engine.rotation) ? 'checked' : '',
        counterClockwise: engine.rotation === '逆时针' ? 'checked' : '',
        
        // 主机最低稳定转速
        minSpeed: engine.minStableSpeed || '40',
        minSpeedIsPercent: (engine.minStableSpeedType === 'PERCENT' || !engine.minStableSpeedType) ? 'checked' : '',
        minSpeedIsOther: engine.minStableSpeedType === 'OTHER' ? 'checked' : '',
        minSpeedOther: engine.minStableSpeedOther || '',
        
        // 使用工况
        mainPropulsion: (ship.usage === 'MAIN_PROPULSION' || !ship.usage) ? 'checked' : '',
        otherPropulsion: ship.usage === 'OTHER' ? 'checked' : '',
        
        // 齿轮箱信息
        gearboxModel: gearbox.model || '',
        reductionRatio: gearbox.reductionRatio || '',
        arrangement: gearbox.arrangement || '水平排列（输入、输出轴水平中心距：0mm，垂直中心距：0mm）',
        inputCoupling: '主机厂配高弹联轴器',
        quantity: ship.quantity || '1',
        deliveryTime: ship.deliveryTime || '',
        
        // 监控系统
        standardMonitoring: (gearbox.monitoringSystem === 'STANDARD' || !gearbox.monitoringSystem) ? 'checked' : '',
        specialMonitoring: gearbox.monitoringSystem === 'SPECIAL' ? 'checked' : '',
        
        // 操控方式
        manualControl: gearbox.controlType === 'MANUAL' ? 'checked' : '',
        electricControl: (gearbox.controlType === 'ELECTRIC' || !gearbox.controlType) ? 'checked' : '',
        pneumaticControl: gearbox.controlType === 'PNEUMATIC' ? 'checked' : '',
        controlVoltage: gearbox.controlVoltage || '24',
        
        // 成套配件
        couplingModel: selectedComponents?.coupling?.model || '主机厂配',
        pumpModel: selectedComponents?.pump?.model || '',
        
        // 成套方选择
        couplingBySupplier: (gearbox.couplingSupplier === 'SUPPLIER') ? 'checked' : '',
        couplingByDemander: (gearbox.couplingSupplier === 'DEMANDER' || !gearbox.couplingSupplier) ? 'checked' : '',
        pumpBySupplier: (gearbox.pumpSupplier === 'SUPPLIER' || !gearbox.pumpSupplier) ? 'checked' : '',
        pumpByDemander: gearbox.pumpSupplier === 'DEMANDER' ? 'checked' : '',
        
        // 技术参数
        transmissionCapacity: gearbox.transmissionCapacity || '',
        maxInputSpeed: gearbox.maxInputSpeed || '',
        lubricationOilPressure: gearbox.lubricationOilPressure || '0.04～0.4',
        maxPropellerThrust: gearbox.maxPropellerThrust || '',
        centerDistance: gearbox.centerDistance || '',
        maxOilTemperature: gearbox.maxOilTemperature || '75',
        oilCapacity: gearbox.oilCapacity || '',
        oilGrade: gearbox.oilGrade || 'CD30 或 CD40',
        coolingWaterInletTemperature: gearbox.coolingWaterInletTemperature || '32',
        coolingWaterVolume: gearbox.coolingWaterVolume || '',
        coolingWaterPressure: gearbox.coolingWaterPressure || '0.35',
        mechanicalEfficiency: gearbox.mechanicalEfficiency || '96',
        forwardDirection: '',
        
        // 倾斜度
        longitudinalInclination: gearbox.longitudinalInclination || '10',
        transverseInclination: gearbox.transverseInclination || '15',
        longitudinalShaking: gearbox.longitudinalShaking || '7.5',
        transverseShaking: gearbox.transverseShaking || '22.5',
        
        // 安装和其他参数
        installationMethod: gearbox.installationMethod || '与船体基座为刚性安装',
        lubricationOilPump: gearbox.lubricationOilPump || '',
        overhaulTime: gearbox.overhaulTime || '10000',
        nameplateSpecification: gearbox.nameplateSpecification || '不锈钢，黑底白字阳文，中英文对照',
        instrumentsAndAlarms: gearbox.instrumentsAndAlarms || '',
        
        // 联轴器信息
        couplingManufacturer: gearbox.couplingManufacturer || '杭州前进联轴器有限公司',
        couplingConnections: '配齐与电机和齿轮箱的联接件',
        
        // 配置选项
        approvalPeriod: options.approvalPeriod.toString(),
        feedbackPeriod: options.feedbackPeriod.toString(),
        warrantyPeriod: options.warrantyPeriod,
        
        // 特殊订货要求
        specialRequirements: specialRequirements || '无',
        
        // 监控报警参数
        lowOilPressureAlarm: gearbox.lowOilPressureAlarm || '0.05',
        lowWorkingOilPressureAlarm: gearbox.lowWorkingOilPressureAlarm || '1.3',
        highOilTemperatureAlarm: gearbox.highOilTemperatureAlarm || '75',
        
        // 服务信息
        servicePhone: '0571-82673888',
        
        // HCT模板特有
        powerArrangement: '柴油机——高弹联轴器——齿轮箱——螺旋桨',
        arrangementDiagram: '[示意图]',
        gearboxFunctions: '具有减速、倒顺离合和承受螺旋桨推力的功能',
        inputRotation: '顺时针',
        outputRotation: '详见排列图示',
        propellerThrust: gearbox.maxPropellerThrust || '',
        reversalTime: '10',
        workingOilPressure: '1.8-2.0',
        
        // DT模板特有
        regulations: '中国船级社《钢质内河船舶建造规范》（2016年版）及有关修改通报；' +
                    '中华人民共和国海事局《船舶与海上设施法定检验规则—内河船舶法定检验技术规则》（2019年版）及其修改和变更通报；' +
                    '中国船级社《材料与焊接规范》（2021年版）及修改和变更通报',
        
        // 为保证兼容性添加的备用字段
        designer: ship.designer || '',
      };
      
      // 填充模板
      const content = fillTemplate(template, templateData);
      
      // 设置协议内容
      setAgreement({
        type: templateType,
        language: language,
        html: content,
        options: { ...options },
        data: templateData
      });
      
      // 切换到预览选项卡
      setActiveTab('preview');
      
      // 通知父组件协议已生成
      onGenerated({
        type: templateType,
        language: language,
        html: content,
        options: { ...options },
        data: templateData
      });
      
    } catch (error) {
      console.error('生成协议失败:', error);
      setError(`生成协议失败: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
  // 导出为PDF - 修改版
  const exportToPDF = () => {
    if (!agreement || !previewRef.current) {
      setError('请先生成技术协议');
      return;
    }
    
    setLoading(true);
    const filename = `${projectInfo?.projectName || '齿轮箱'}_技术协议`;
    
    // 添加延时确保内容完全渲染
    setTimeout(() => {
      exportHtmlContentToPDF(previewRef.current, {
        filename: `${filename}.pdf`,
        orientation: 'portrait',
        format: 'a4',
        margin: { top: 20, right: 20, bottom: 20, left: 20 },
        scale: 1.5,
        useCORS: true,
        allowTaint: true
      })
      .then(() => {
        console.log('导出PDF成功');
        setLoading(false);
      })
      .catch((err) => {
        console.error('导出PDF失败:', err);
        setError(`导出PDF失败: ${err.message}`);
        setLoading(false);
      });
    }, 500);
  };
  
  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-file-earmark-text me-2"></i>
            齿轮箱技术协议生成
          </span>
          {agreement && (
            <Button variant="outline-primary" size="sm" onClick={exportToPDF}>
              <i className="bi bi-file-earmark-pdf me-1"></i> 导出PDF
            </Button>
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
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>协议模板类型</Form.Label>
                    <Form.Select
                      value={templateType}
                      onChange={(e) => setTemplateType(e.target.value)}
                    >
                      <option value={TemplateType.GWC}>GWC/GWL系列</option>
                      <option value={TemplateType.HCT}>HCT系列</option>
                      <option value={TemplateType.HC}>HC系列</option>
                      <option value={TemplateType.DT}>DT系列</option>
                      <option value={TemplateType.HCD}>HCD系列</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>协议语言</Form.Label>
                    <Form.Select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value={LanguageType.CHINESE}>中文</option>
                      <option value={LanguageType.ENGLISH}>英文</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
              
              <Card className="mb-3">
                <Card.Header>协议模块配置</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <Form.Check
                        type="checkbox"
                        id="includeQualitySection"
                        label="包含质量保证部分"
                        checked={options.includeQualitySection}
                        onChange={(e) => handleOptionChange('includeQualitySection', e.target.checked)}
                        className="mb-2"
                      />
                      
                      <Form.Check
                        type="checkbox"
                        id="includeMaintenanceSection"
                        label="包含技术服务部分"
                        checked={options.includeMaintenanceSection}
                        onChange={(e) => handleOptionChange('includeMaintenanceSection', e.target.checked)}
                        className="mb-2"
                      />
                    </Col>
                    
                    <Col md={6}>
                      <Form.Check
                        type="checkbox"
                        id="includeAttachmentSection"
                        label="包含随机文件部分"
                        checked={options.includeAttachmentSection}
                        onChange={(e) => handleOptionChange('includeAttachmentSection', e.target.checked)}
                        className="mb-2"
                      />
                      
                      <Form.Check
                        type="checkbox"
                        id="includeShipInfo"
                        label="包含船舶信息部分"
                        checked={options.includeShipInfo}
                        onChange={(e) => handleOptionChange('includeShipInfo', e.target.checked)}
                        className="mb-2"
                      />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Card className="mb-3">
                <Card.Header>时间和周期配置</Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>认可资料提供期限（天）</Form.Label>
                        <Form.Control
                          type="number"
                          value={options.approvalPeriod}
                          onChange={(e) => handleOptionChange('approvalPeriod', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>意见反馈期限（天）</Form.Label>
                        <Form.Control
                          type="number"
                          value={options.feedbackPeriod}
                          onChange={(e) => handleOptionChange('feedbackPeriod', e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    
                    <Col md={4}>
                      <Form.Group className="mb-3">
                        <Form.Label>质保期描述（中文）</Form.Label>
                        <Form.Control
                          type="text"
                          value={options.warrantyPeriod}
                          onChange={(e) => handleOptionChange('warrantyPeriod', e.target.value)}
                          placeholder="例如：十二个月"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              
              <Form.Group className="mb-3">
                <Form.Label>特殊订货要求</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={5}
                  value={specialRequirements}
                  onChange={(e) => setSpecialRequirements(e.target.value)}
                  placeholder="请输入特殊订货要求，每条要求占一行..."
                />
                <Form.Text className="text-muted">
                  每行一条特殊要求，如压力、冷却水流量等特殊要求
                </Form.Text>
              </Form.Group>
              
              <div className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  onClick={generateAgreement}
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
          
          <Tab eventKey="preview" title="预览" disabled={!agreement}>
            {agreement && (
              <div className="agreement-preview-wrapper">
                <div ref={previewRef} className="agreement-preview-content" dangerouslySetInnerHTML={{ __html: agreement.html }}></div>
              </div>
            )}
          </Tab>
        </Tabs>
      </Card.Body>
    </Card>
  );
};

export default AgreementGenerator;