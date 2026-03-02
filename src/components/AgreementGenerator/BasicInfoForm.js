// src/components/AgreementGenerator/BasicInfoForm.js
// 基本信息编辑表单组件
import React from 'react';
import { Form, Card, Row, Col, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  ClassificationType,
  getClassificationOptions,
  getClassificationDescription,
  requiresOnSiteInspection,
  requiresEnglishDocuments
} from '../../utils/classificationCertificates';

/**
 * 基本信息编辑表单
 * 包含船东信息、船厂信息、主机参数
 */
const BasicInfoForm = ({
  editableInfo,
  onInfoChange,
  templateType
}) => {
  return (
    <Card className="mb-3">
      <Card.Header>
        <i className="bi bi-info-circle me-2"></i>
        基本信息（可编辑）
        <Badge bg="info" className="ms-2">第2步</Badge>
      </Card.Header>
      <Card.Body>
        {/* 船东信息 */}
        <h6 className="text-muted mb-3">
          <i className="bi bi-building me-1"></i>
          船东信息
        </h6>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>船东名称</Form.Label>
              <Form.Control
                type="text"
                value={editableInfo.shipOwner}
                onChange={(e) => onInfoChange('shipOwner', e.target.value)}
                placeholder="请输入船东名称"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>船名/项目名称</Form.Label>
              <Form.Control
                type="text"
                value={editableInfo.shipName}
                onChange={(e) => onInfoChange('shipName', e.target.value)}
                placeholder="请输入船名或项目名称"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* 船厂信息 */}
        <h6 className="text-muted mb-3">
          <i className="bi bi-gear me-1"></i>
          船厂信息
        </h6>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>船厂名称</Form.Label>
              <Form.Control
                type="text"
                value={editableInfo.shipyard}
                onChange={(e) => onInfoChange('shipyard', e.target.value)}
                placeholder="请输入船厂名称"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>项目编号</Form.Label>
              <Form.Control
                type="text"
                value={editableInfo.projectNumber}
                onChange={(e) => onInfoChange('projectNumber', e.target.value)}
                placeholder="请输入项目编号"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>船舶类型</Form.Label>
              <Form.Control
                type="text"
                value={editableInfo.shipType}
                onChange={(e) => onInfoChange('shipType', e.target.value)}
                placeholder="如：客运船、货船、渔船等"
              />
            </Form.Group>
          </Col>
        </Row>

        {/* HCQ模板专属 - 船舶尺寸 */}
        {templateType === 'HCQ' && (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>船舶总长 (m)</Form.Label>
                <Form.Control
                  type="text"
                  value={editableInfo.shipLength || ''}
                  onChange={(e) => onInfoChange('shipLength', e.target.value)}
                  placeholder="如：68.5"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>船宽 (m)</Form.Label>
                <Form.Control
                  type="text"
                  value={editableInfo.shipWidth || ''}
                  onChange={(e) => onInfoChange('shipWidth', e.target.value)}
                  placeholder="如：12.8"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>型深 (m)</Form.Label>
                <Form.Control
                  type="text"
                  value={editableInfo.shipDepth || ''}
                  onChange={(e) => onInfoChange('shipDepth', e.target.value)}
                  placeholder="如：5.2"
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {/* GWC模板 - 船舶制造/设计/注册信息 */}
        {(templateType === 'GWC' || templateType === 'HCQ') && (
          <Row className="mb-3">
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>船舶制造单位</Form.Label>
                <Form.Control
                  type="text"
                  value={editableInfo.shipManufacturer || ''}
                  onChange={(e) => onInfoChange('shipManufacturer', e.target.value)}
                  placeholder="请输入制造单位"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>设计单位</Form.Label>
                <Form.Control
                  type="text"
                  value={editableInfo.shipDesigner || ''}
                  onChange={(e) => onInfoChange('shipDesigner', e.target.value)}
                  placeholder="请输入设计单位"
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>船级社注册号</Form.Label>
                <Form.Control
                  type="text"
                  value={editableInfo.registrationNumber || ''}
                  onChange={(e) => onInfoChange('registrationNumber', e.target.value)}
                  placeholder="请输入注册号"
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {/* DT模板 - 协议编号和设计院 */}
        {templateType === 'DT' && (
          <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>协议编号</Form.Label>
                <Form.Control
                  type="text"
                  value={editableInfo.agreementNumber || ''}
                  onChange={(e) => onInfoChange('agreementNumber', e.target.value)}
                  placeholder="请输入协议编号"
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>设计院（丙方）</Form.Label>
                <Form.Control
                  type="text"
                  value={editableInfo.designInstitute || ''}
                  onChange={(e) => onInfoChange('designInstitute', e.target.value)}
                  placeholder="请输入设计院名称"
                />
              </Form.Group>
            </Col>
          </Row>
        )}

        {/* 船检要求 */}
        <h6 className="text-muted mb-3">
          <i className="bi bi-shield-check me-1"></i>
          船检要求
        </h6>
        <Row className="mb-3">
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>船检类型</Form.Label>
              <Form.Select
                value={editableInfo.classificationType || ClassificationType.NONE}
                onChange={(e) => onInfoChange('classificationType', e.target.value)}
              >
                {getClassificationOptions().map(group => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map(opt => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </Form.Select>
              <Form.Text className="text-muted">
                {getClassificationDescription(editableInfo.classificationType || ClassificationType.NONE)}
              </Form.Text>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>证书要求提示</Form.Label>
              <div className="d-flex flex-wrap gap-2 mt-2">
                {requiresOnSiteInspection(editableInfo.classificationType) && (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>该船检类型需要验船师现场检验</Tooltip>}
                  >
                    <Badge bg="warning" text="dark" className="d-flex align-items-center gap-1">
                      <i className="bi bi-eye-fill"></i>
                      需现场检验
                    </Badge>
                  </OverlayTrigger>
                )}
                {requiresEnglishDocuments(editableInfo.classificationType) && (
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>该船检类型需要提供英文技术文档</Tooltip>}
                  >
                    <Badge bg="info" className="d-flex align-items-center gap-1">
                      <i className="bi bi-globe"></i>
                      需英文文档
                    </Badge>
                  </OverlayTrigger>
                )}
                {editableInfo.classificationType === ClassificationType.NONE && (
                  <Badge bg="secondary" className="d-flex align-items-center gap-1">
                    <i className="bi bi-check-circle"></i>
                    仅需基本证书
                  </Badge>
                )}
              </div>
            </Form.Group>
          </Col>
        </Row>

        {/* 主机参数 */}
        <h6 className="text-muted mb-3">
          <i className="bi bi-cpu me-1"></i>
          主机参数
        </h6>
        <Row className="mb-3">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>主机型号</Form.Label>
              <Form.Control
                type="text"
                value={editableInfo.engineModel}
                onChange={(e) => onInfoChange('engineModel', e.target.value)}
                placeholder="请输入主机型号"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>额定功率 (kW)</Form.Label>
              <Form.Control
                type="text"
                value={editableInfo.enginePower}
                onChange={(e) => onInfoChange('enginePower', e.target.value)}
                placeholder="请输入功率"
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>额定转速 (rpm)</Form.Label>
              <Form.Control
                type="text"
                value={editableInfo.engineSpeed}
                onChange={(e) => onInfoChange('engineSpeed', e.target.value)}
                placeholder="请输入转速"
              />
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-2">
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>主机转向</Form.Label>
              <Form.Select
                value={editableInfo.engineRotation}
                onChange={(e) => onInfoChange('engineRotation', e.target.value)}
              >
                <option value="顺时针">顺时针（从飞轮端看）</option>
                <option value="逆时针">逆时针（从飞轮端看）</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>飞轮规格</Form.Label>
              <Form.Control
                type="text"
                value={editableInfo.flywheelSpec}
                onChange={(e) => onInfoChange('flywheelSpec', e.target.value)}
                placeholder="如：SAE1#14"
              />
            </Form.Group>
          </Col>
        </Row>
        {/* HCQ - 柴油机制造厂 / GWC - 交货时间 */}
        {(templateType === 'HCQ' || templateType === 'GWC') && (
          <Row className="mb-2">
            {templateType === 'HCQ' && (
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>柴油机制造厂</Form.Label>
                  <Form.Control
                    type="text"
                    value={editableInfo.engineManufacturer || ''}
                    onChange={(e) => onInfoChange('engineManufacturer', e.target.value)}
                    placeholder="如：潍柴动力"
                  />
                </Form.Group>
              </Col>
            )}
            {templateType === 'GWC' && (
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>交货时间</Form.Label>
                  <Form.Control
                    type="text"
                    value={editableInfo.deliveryTime || ''}
                    onChange={(e) => onInfoChange('deliveryTime', e.target.value)}
                    placeholder="如：合同签订后60天"
                  />
                </Form.Group>
              </Col>
            )}
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default BasicInfoForm;
