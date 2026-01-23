// src/components/AgreementGenerator/AgreementOptionsForm.js
// 协议选项配置表单组件
import React, { useState, useEffect } from 'react';
import { Form, Card, Row, Col, Spinner } from 'react-bootstrap';
import { TemplateType, LanguageType } from '../../utils/agreementTemplateManager';
// 性能优化: 改为动态导入
// import { flexibleCouplings } from '../../data/flexibleCouplings';

/**
 * 协议选项配置表单
 * 包含模板类型、语言、联轴器、模块配置、时间周期
 */
const AgreementOptionsForm = ({
  templateType,
  setTemplateType,
  language,
  setLanguage,
  isBilingual,
  setIsBilingual,
  bilingualLayout,
  setBilingualLayout,
  selectedCouplingModel,
  setSelectedCouplingModel,
  recommendedCouplingModel,
  options,
  onOptionChange,
  couplings: propCouplings  // 可选：从父组件传入
}) => {
  // 性能优化: 动态加载联轴器数据
  const [flexibleCouplings, setFlexibleCouplings] = useState(propCouplings || []);
  const [couplingsLoading, setCouplingsLoading] = useState(!propCouplings);

  useEffect(() => {
    if (propCouplings) {
      setFlexibleCouplings(propCouplings);
      setCouplingsLoading(false);
      return;
    }

    const loadCouplings = async () => {
      try {
        const module = await import(
          /* webpackChunkName: "coupling-data" */
          '../../data/flexibleCouplings'
        );
        setFlexibleCouplings(module.flexibleCouplings || []);
      } catch (error) {
        console.error('AgreementOptionsForm: 联轴器数据加载失败', error);
      } finally {
        setCouplingsLoading(false);
      }
    };
    loadCouplings();
  }, [propCouplings]);
  return (
    <>
      {/* 模板类型和语言选择 */}
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
            <div>
              <Form.Check
                inline
                type="radio"
                id="lang-zh"
                label="仅中文"
                name="language-option"
                checked={language === LanguageType.CHINESE && !isBilingual}
                onChange={() => {
                  setLanguage(LanguageType.CHINESE);
                  setIsBilingual(false);
                }}
                className="mb-2"
              />
              <Form.Check
                inline
                type="radio"
                id="lang-en"
                label="仅英文"
                name="language-option"
                checked={language === LanguageType.ENGLISH && !isBilingual}
                onChange={() => {
                  setLanguage(LanguageType.ENGLISH);
                  setIsBilingual(false);
                }}
                className="mb-2"
              />
              <Form.Check
                inline
                type="radio"
                id="lang-bilingual"
                label="中英文对照"
                name="language-option"
                checked={isBilingual}
                onChange={() => {
                  setIsBilingual(true);
                }}
                className="mb-2"
              />
            </div>
          </Form.Group>
        </Col>
      </Row>

      {/* 双语布局选项 */}
      {isBilingual && (
        <Row className="mb-3">
          <Col md={12}>
            <Form.Group className="mb-3">
              <Form.Label>双语布局方式</Form.Label>
              <div>
                <Form.Check
                  inline
                  type="radio"
                  id="layout-side"
                  label="左右对照（中英文并排）"
                  name="bilingual-layout"
                  checked={bilingualLayout === 'side-by-side'}
                  onChange={() => setBilingualLayout('side-by-side')}
                  className="mb-2"
                />
                <Form.Check
                  inline
                  type="radio"
                  id="layout-sequential"
                  label="分段对照（每段先中后英）"
                  name="bilingual-layout"
                  checked={bilingualLayout === 'sequential'}
                  onChange={() => setBilingualLayout('sequential')}
                  className="mb-2"
                />
                <Form.Check
                  inline
                  type="radio"
                  id="layout-complete"
                  label="全文对照（先中文后英文）"
                  name="bilingual-layout"
                  checked={bilingualLayout === 'complete'}
                  onChange={() => setBilingualLayout('complete')}
                  className="mb-2"
                />
              </div>
            </Form.Group>
          </Col>
        </Row>
      )}

      {/* 联轴器选择 */}
      <Row className="mb-3">
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label>联轴器型号</Form.Label>
            {couplingsLoading ? (
              <div className="d-flex align-items-center">
                <Spinner animation="border" size="sm" className="me-2" />
                <span>加载联轴器数据...</span>
              </div>
            ) : (
              <Form.Select
                value={selectedCouplingModel}
                onChange={(e) => setSelectedCouplingModel(e.target.value)}
              >
                <option value="">主机厂配</option>
                {flexibleCouplings.map(coupling => (
                  <option key={coupling.model} value={coupling.model}>
                    {coupling.model} ({coupling.torque}kNm)
                  </option>
                ))}
              </Form.Select>
            )}
            <Form.Text className="text-muted">
              推荐联轴器：{recommendedCouplingModel || '未选择'}
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>

      {/* 协议模块配置 */}
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
                onChange={(e) => onOptionChange('includeQualitySection', e.target.checked)}
                className="mb-2"
              />

              <Form.Check
                type="checkbox"
                id="includeMaintenanceSection"
                label="包含技术服务部分"
                checked={options.includeMaintenanceSection}
                onChange={(e) => onOptionChange('includeMaintenanceSection', e.target.checked)}
                className="mb-2"
              />
            </Col>

            <Col md={6}>
              <Form.Check
                type="checkbox"
                id="includeAttachmentSection"
                label="包含随机文件部分"
                checked={options.includeAttachmentSection}
                onChange={(e) => onOptionChange('includeAttachmentSection', e.target.checked)}
                className="mb-2"
              />

              <Form.Check
                type="checkbox"
                id="includeShipInfo"
                label="包含船舶信息部分"
                checked={options.includeShipInfo}
                onChange={(e) => onOptionChange('includeShipInfo', e.target.checked)}
                className="mb-2"
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 时间和周期配置 */}
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
                  onChange={(e) => onOptionChange('approvalPeriod', e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>意见反馈期限（天）</Form.Label>
                <Form.Control
                  type="number"
                  value={options.feedbackPeriod}
                  onChange={(e) => onOptionChange('feedbackPeriod', e.target.value)}
                />
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>质保期描述（中文）</Form.Label>
                <Form.Control
                  type="text"
                  value={options.warrantyPeriod}
                  onChange={(e) => onOptionChange('warrantyPeriod', e.target.value)}
                  placeholder="例如：十二个月"
                />
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </>
  );
};

export default AgreementOptionsForm;
