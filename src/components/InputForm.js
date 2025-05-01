// components/InputForm.js
import React from 'react';
import { Form, Button, Row, Col, Card, Spinner } from 'react-bootstrap';

/**
 * Input form component for gearbox selection
 * @param {Object} props - Component props
 * @param {Object} props.engineData - Engine data (power, speed)
 * @param {Function} props.setEngineData - Function to update engine data
 * @param {Object} props.requirementData - Requirements data (targetRatio, thrustRequirement)
 * @param {Function} props.setRequirementData - Function to update requirements data
 * @param {Object} props.projectInfo - Project information
 * @param {Function} props.setProjectInfo - Function to update project info
 * @param {string} props.gearboxType - Selected gearbox type (HC, GW, etc.)
 * @param {Function} props.setGearboxType - Function to update gearbox type
 * @param {Function} props.onSelect - Function to trigger selection process
 * @param {boolean} props.loading - Loading state
 * @param {Object} props.colors - Theme colors object
 * @returns {JSX.Element} Input form component
 */
const InputForm = ({
  engineData,
  setEngineData,
  requirementData,
  setRequirementData,
  projectInfo,
  setProjectInfo,
  gearboxType,
  setGearboxType,
  onSelect,
  loading,
  colors = {}
}) => {
  // Handlers
  const handleEngineDataChange = (field, value) => {
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setEngineData({ ...engineData, [field]: value });
    }
  };

  const handleRequirementDataChange = (field, value) => {
    if (value === '' || (!isNaN(value) && parseFloat(value) >= 0)) {
      setRequirementData({ ...requirementData, [field]: value });
    }
  };

  const handleProjectInfoChange = (field, value) => {
    setProjectInfo({ ...projectInfo, [field]: value });
  };

  // Form validation
  const isFormValid = () => {
    return engineData.power && engineData.speed && requirementData.targetRatio;
  };

  return (
    <div className="input-form">
      <Row>
        <Col lg={6} md={12}>
          <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
              齿轮箱类型
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>选择齿轮箱类型</Form.Label>
                  <Form.Select
                    value={gearboxType}
                    onChange={(e) => setGearboxType(e.target.value)}
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  >
                    <option value="HC">HC系列</option>
                    <option value="GW">GW系列</option>
                    <option value="HCM">HCM系列</option>
                    <option value="DT">DT系列</option>
                    <option value="HCQ">HCQ系列</option>
                    <option value="GC">GC系列</option>
                  </Form.Select>
                </Form.Group>
                <div className="gearbox-type-description mt-3" style={{ color: colors.muted, fontSize: '0.9rem' }}>
                  <p className="mb-2"><strong>{gearboxType}系列说明：</strong></p>
                  {gearboxType === 'HC' && <p>HC系列船用减速齿轮箱，适用于各类中小型船舶的主推进动力系统。</p>}
                  {gearboxType === 'GW' && <p>GW系列船用减速齿轮箱，适用于工作船的主推进动力系统。</p>}
                  {gearboxType === 'HCM' && <p>HCM系列船用齿轮箱，适用于中大型船舶的主推进动力系统，具有更高的扭矩承载能力。</p>}
                  {gearboxType === 'DT' && <p>DT系列齿轮箱，适用于大型船舶的主推进动力系统，具有高推力承载能力。</p>}
                  {gearboxType === 'HCQ' && <p>HCQ系列齿轮箱，适用于需要轻量化设计的高速船艇推进系统。</p>}
                  {gearboxType === 'GC' && <p>GC系列齿轮箱，适用于特种工作船的推进系统，具有特殊工况适应能力。</p>}
                </div>
              </Form>
            </Card.Body>
          </Card>
          <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
              选型要求
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>目标减速比</Form.Label>
                  <Form.Control
                    type="number"
                    value={requirementData.targetRatio}
                    onChange={(e) => handleRequirementDataChange('targetRatio', e.target.value)}
                    placeholder="请输入目标减速比"
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>推力要求 (kN)</Form.Label>
                  <Form.Control
                    type="number"
                    value={requirementData.thrustRequirement}
                    onChange={(e) => handleRequirementDataChange('thrustRequirement', e.target.value)}
                    placeholder="请输入推力要求"
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
              项目信息
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>项目名称</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectInfo.projectName}
                    onChange={(e) => handleProjectInfoChange('projectName', e.target.value)}
                    placeholder="请输入项目名称"
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>客户名称</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectInfo.customerName}
                    onChange={(e) => handleProjectInfoChange('customerName', e.target.value)}
                    placeholder="请输入客户名称"
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>联系人</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectInfo.contactPerson}
                    onChange={(e) => handleProjectInfoChange('contactPerson', e.target.value)}
                    placeholder="请输入联系人"
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>联系电话</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectInfo.contactPhone}
                    onChange={(e) => handleProjectInfoChange('contactPhone', e.target.value)}
                    placeholder="请输入联系电话"
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col lg={6} md={12}>
          <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
            <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText, borderBottomColor: colors.border }}>
              发动机参数
            </Card.Header>
            <Card.Body style={{ padding: '1.5rem' }}>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>主机功率 (kW)</Form.Label>
                  <Form.Control
                    type="number"
                    value={engineData.power}
                    onChange={(e) => handleEngineDataChange('power', e.target.value)}
                    placeholder="请输入主机功率"
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>主机转速 (r/min)</Form.Label>
                  <Form.Control
                    type="number"
                    value={engineData.speed}
                    onChange={(e) => handleEngineDataChange('speed', e.target.value)}
                    placeholder="请输入主机转速"
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Label>主机型号（可选）</Form.Label>
                  <Form.Control
                    type="text"
                    value={projectInfo.engineModel}
                    onChange={(e) => handleProjectInfoChange('engineModel', e.target.value)}
                    placeholder="请输入主机型号"
                    style={{ backgroundColor: colors.inputBg, color: colors.text, borderColor: colors.inputBorder }}
                  />
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={6} md={12}>
          <Button
            variant="primary"
            size="lg"
            className="w-100"
            onClick={onSelect}
            disabled={loading || !isFormValid()}
            style={{
              backgroundColor: colors.primary,
              borderColor: colors.primary,
              marginTop: '1rem'
            }}
          >
            {loading ? (
              <>
                <Spinner 
                  as="span" 
                  animation="border" 
                  size="sm" 
                  role="status" 
                  aria-hidden="true" 
                  className="me-2"
                />
                正在选型...
              </>
            ) : "开始齿轮箱选型"}
          </Button>
          {!isFormValid() && (
            <div className="text-center mt-2" style={{ color: colors.warning }}>
              <small>请填写主机功率、主机转速和目标减速比</small>
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default InputForm;