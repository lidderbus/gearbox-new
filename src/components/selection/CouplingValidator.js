// src/components/selection/CouplingValidator.js
// 联轴器验证器组件 - 验证联轴器选择结果的合理性

import React, { useState, useEffect } from 'react';
import { Card, Table, Alert, Badge, Button, Modal, Form } from 'react-bootstrap';
import { couplingWorkFactorMap, getTemperatureFactor } from '../../data/gearboxMatchingMaps';

/**
 * 联轴器验证器组件
 * @param {Object} props - 组件属性
 * @param {Object} props.coupling - 联轴器数据
 * @param {Object} props.gearbox - 齿轮箱数据
 * @param {number} props.engineTorque - 发动机扭矩 (N·m)
 * @param {string} props.workCondition - 工况条件
 * @param {number} props.temperature - 工作温度
 * @param {boolean} props.hasCover - 是否带罩壳
 * @param {number} props.engineSpeed - 发动机转速
 * @param {Function} props.onValidationChange - 验证结果变化回调
 * @param {Object} props.theme - 主题设置
 * @param {Object} props.colors - 颜色设置
 * @returns {JSX.Element}
 */
const CouplingValidator = ({
  coupling,
  gearbox,
  engineTorque,
  workCondition = "III类:扭矩变化中等",
  temperature = 30,
  hasCover = false,
  engineSpeed,
  onValidationChange,
  theme = 'light',
  colors = {}
}) => {
  // 验证状态
  const [validationResults, setValidationResults] = useState({
    torque: { valid: true, message: '' },
    speed: { valid: true, message: '' },
    cover: { valid: true, message: '' },
    model: { valid: true, message: '' },
    price: { valid: true, message: '' }
  });
  
  // 验证概要
  const [summary, setSummary] = useState({
    valid: true,
    criticalIssues: 0,
    warnings: 0,
    suggestions: 0
  });
  
  // 所需联轴器扭矩
  const [requiredTorque, setRequiredTorque] = useState(0);
  
  // 显示详细信息模态框
  const [showDetails, setShowDetails] = useState(false);
  
  // 自定义不安全覆盖模式
  const [unsafeOverride, setUnsafeOverride] = useState(false);
  
  // 进行验证
  useEffect(() => {
    if (!coupling || !engineTorque) {
      return;
    }
    
    // 重置验证结果
    const results = {
      torque: { valid: true, message: '', severity: 'ok' },
      speed: { valid: true, message: '', severity: 'ok' },
      cover: { valid: true, message: '', severity: 'ok' },
      model: { valid: true, message: '', severity: 'ok' },
      price: { valid: true, message: '', severity: 'ok' }
    };
    
    // 1. 计算所需联轴器扭矩
    const kFactor = couplingWorkFactorMap[workCondition] || couplingWorkFactorMap.default;
    const stFactor = getTemperatureFactor(parseFloat(temperature));
    const requiredCouplingTorque = engineTorque * kFactor * stFactor / 1000;
    setRequiredTorque(requiredCouplingTorque);
    
    // 2. 验证扭矩
    if (coupling.torque < requiredCouplingTorque) {
      results.torque.valid = false;
      results.torque.message = `联轴器额定扭矩(${coupling.torque.toFixed(3)}kN·m)小于所需扭矩(${requiredCouplingTorque.toFixed(3)}kN·m)`;
      results.torque.severity = 'critical';
    } else {
      const torqueMargin = ((coupling.torque / requiredCouplingTorque) - 1) * 100;
      if (torqueMargin < 5) {
        results.torque.valid = false;
        results.torque.message = `联轴器扭矩余量(${torqueMargin.toFixed(1)}%)过小，不满足安全要求(最低5%)`;
        results.torque.severity = 'critical';
      } else if (torqueMargin < 10) {
        results.torque.valid = true;
        results.torque.message = `联轴器扭矩余量(${torqueMargin.toFixed(1)}%)较小，建议选择更大型号`;
        results.torque.severity = 'warning';
      } else if (torqueMargin > 50) {
        results.torque.valid = true;
        results.torque.message = `联轴器扭矩余量(${torqueMargin.toFixed(1)}%)过大，可能过度选型`;
        results.torque.severity = 'suggestion';
      }
    }
    
    // 3. 验证转速
    if (coupling.maxSpeed && engineSpeed) {
      if (coupling.maxSpeed < engineSpeed) {
        results.speed.valid = false;
        results.speed.message = `联轴器最大转速(${coupling.maxSpeed}r/min)小于发动机转速(${engineSpeed}r/min)`;
        results.speed.severity = 'critical';
      } else {
        const speedMargin = ((coupling.maxSpeed / engineSpeed) - 1) * 100;
        if (speedMargin > 100) {
          results.speed.valid = true;
          results.speed.message = `联轴器最大转速余量(${speedMargin.toFixed(1)}%)过大，可能不经济`;
          results.speed.severity = 'suggestion';
        }
      }
    }
    
    // 4. 验证罩壳
    if (hasCover && !coupling.model.includes('JB')) {
      const coverModel = `HGTHJ${coupling.model.substring(4)}`;
      results.cover.valid = false;
      results.cover.message = `要求带罩壳但选择的联轴器(${coupling.model})不是罩壳型号，建议使用${coverModel}`;
      results.cover.severity = 'warning';
    }
    
    // 5. 验证型号匹配
    if (gearbox && gearbox.recommendedCouplingModel && coupling.model !== gearbox.recommendedCouplingModel) {
      results.model.valid = true;
      results.model.message = `联轴器型号(${coupling.model})与齿轮箱推荐型号(${gearbox.recommendedCouplingModel})不匹配`;
      results.model.severity = 'warning';
    }
    
    // 6. 验证价格
    if (!coupling.basePrice || coupling.basePrice <= 0) {
      results.price.valid = false;
      results.price.message = '联轴器基础价格未设置或无效';
      results.price.severity = 'warning';
    }
    
    // 7. 计算验证概要
    const criticalIssues = Object.values(results).filter(r => r.severity === 'critical').length;
    const warnings = Object.values(results).filter(r => r.severity === 'warning').length;
    const suggestions = Object.values(results).filter(r => r.severity === 'suggestion').length;
    
    const summaryResult = {
      valid: criticalIssues === 0,
      criticalIssues,
      warnings,
      suggestions
    };
    
    // 更新状态
    setValidationResults(results);
    setSummary(summaryResult);
    
    // 通知父组件验证结果
    if (onValidationChange && typeof onValidationChange === 'function') {
      onValidationChange({
        valid: summaryResult.valid || unsafeOverride,
        results,
        summary: summaryResult,
        unsafeOverride
      });
    }
    
  }, [coupling, engineTorque, workCondition, temperature, hasCover, engineSpeed, gearbox, unsafeOverride, onValidationChange]);

  // 如果没有联轴器数据，显示提示
  if (!coupling) {
    return (
      <Alert variant="info">
        <i className="bi bi-info-circle me-2"></i>
        请先选择联轴器
      </Alert>
    );
  }

  // 安全数字格式化
  const safeNumberFormat = (value, decimals = 2) => {
    const num = parseFloat(value);
    if (typeof num !== 'number' || isNaN(num)) {
      return '-';
    }
    return num.toFixed(decimals);
  };
  
  // 获取验证项的变体样式
  const getValidationVariant = (result) => {
    if (!result.valid) return 'danger';
    switch (result.severity) {
      case 'warning': return 'warning';
      case 'suggestion': return 'info';
      default: return 'success';
    }
  };
  
  // 切换详细信息模态框
  const toggleDetailsModal = () => {
    setShowDetails(!showDetails);
  };
  
  // 切换不安全覆盖模式
  const toggleUnsafeOverride = () => {
    setUnsafeOverride(!unsafeOverride);
  };
  
  return (
    <>
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Header style={{ backgroundColor: colors.headerBg, color: colors.headerText }}>
          <div className="d-flex justify-content-between align-items-center">
            <span>
              <i className="bi bi-shield-check me-2"></i>
              联轴器验证
            </span>
            <Button 
              variant="outline-secondary" 
              size="sm"
              onClick={toggleDetailsModal}
              style={{ borderColor: colors.inputBorder, color: colors.text }}
            >
              详细信息
            </Button>
          </div>
        </Card.Header>
        <Card.Body>
          {/* 验证概要 */}
          <div className="text-center mb-4">
            <h5 style={{ color: colors.headerText }}>验证结果</h5>
            <div style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold',
              color: summary.valid ? '#28a745' : unsafeOverride ? '#ffc107' : '#dc3545',
              marginBottom: '1rem'
            }}>
              {summary.valid ? '通过验证' : 
               unsafeOverride ? '已覆盖严重问题' : '未通过验证'}
            </div>
            
            {/* 验证标签 */}
            <div className="d-flex justify-content-center gap-2 flex-wrap">
              {summary.criticalIssues > 0 && (
                <Badge bg="danger" className="p-2">
                  <i className="bi bi-exclamation-triangle-fill me-1"></i>
                  严重问题: {summary.criticalIssues}
                </Badge>
              )}
              {summary.warnings > 0 && (
                <Badge bg="warning" text="dark" className="p-2">
                  <i className="bi bi-exclamation-circle-fill me-1"></i>
                  警告: {summary.warnings}
                </Badge>
              )}
              {summary.suggestions > 0 && (
                <Badge bg="info" className="p-2">
                  <i className="bi bi-info-circle-fill me-1"></i>
                  建议: {summary.suggestions}
                </Badge>
              )}
              {summary.criticalIssues === 0 && summary.warnings === 0 && summary.suggestions === 0 && (
                <Badge bg="success" className="p-2">
                  <i className="bi bi-check-circle-fill me-1"></i>
                  完全匹配
                </Badge>
              )}
            </div>
          </div>
          
          {/* 关键参数 */}
          <h5 style={{ color: colors.headerText }}>关键参数</h5>
          <Table bordered size="sm" responsive style={{ color: colors.text }}>
            <tbody>
              <tr>
                <td style={{ width: '40%', fontWeight: 'bold' }}>联轴器型号</td>
                <td>{coupling.model}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>额定扭矩</td>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{safeNumberFormat(coupling.torque, 3)} kN·m</span>
                    <Badge bg={getValidationVariant(validationResults.torque)}>
                      {validationResults.torque.valid ? '✓' : '✗'}
                    </Badge>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>所需扭矩</td>
                <td>{safeNumberFormat(requiredTorque, 3)} kN·m</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>最大转速</td>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{coupling.maxSpeed ? `${coupling.maxSpeed} r/min` : '-'}</span>
                    <Badge bg={getValidationVariant(validationResults.speed)}>
                      {validationResults.speed.valid ? '✓' : '✗'}
                    </Badge>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>带罩壳</td>
                <td>
                  <div className="d-flex justify-content-between align-items-center">
                    <span>{coupling.model.includes('JB') ? '是' : '否'}</span>
                    <Badge bg={getValidationVariant(validationResults.cover)}>
                      {validationResults.cover.valid ? '✓' : '✗'}
                    </Badge>
                  </div>
                </td>
              </tr>
            </tbody>
          </Table>
          
          {/* 严重问题警告和覆盖 */}
          {summary.criticalIssues > 0 && (
            <Alert variant="danger" className="mt-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  存在{summary.criticalIssues}个严重问题，不建议使用此联轴器
                </div>
                <Form.Check
                  type="switch"
                  id="unsafe-override"
                  label="强制覆盖"
                  checked={unsafeOverride}
                  onChange={toggleUnsafeOverride}
                  className="ms-3"
                />
              </div>
            </Alert>
          )}
        </Card.Body>
      </Card>
      
      {/* 详细信息模态框 */}
      <Modal show={showDetails} onHide={toggleDetailsModal} size="lg">
        <Modal.Header closeButton style={{ 
          backgroundColor: colors.headerBg, 
          color: colors.headerText
        }}>
          <Modal.Title>联轴器验证详情</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ 
          backgroundColor: colors.bg, 
          color: colors.text
        }}>
          <h5 className="mb-3">验证项目</h5>
          <Table bordered responsive style={{ color: colors.text }}>
            <thead>
              <tr>
                <th style={{ width: '15%' }}>验证项</th>
                <th style={{ width: '15%' }}>结果</th>
                <th>详细信息</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(validationResults).map(([key, result]) => (
                <tr key={key}>
                  <td>
                    {key === 'torque' && '扭矩验证'}
                    {key === 'speed' && '转速验证'}
                    {key === 'cover' && '罩壳验证'}
                    {key === 'model' && '型号验证'}
                    {key === 'price' && '价格验证'}
                  </td>
                  <td>
                    <Badge 
                      bg={getValidationVariant(result)}
                      className="p-2 d-block text-center"
                    >
                      {result.severity === 'critical' && '严重问题'}
                      {result.severity === 'warning' && '警告'}
                      {result.severity === 'suggestion' && '建议'}
                      {(!result.severity || result.severity === 'ok') && '通过'}
                    </Badge>
                  </td>
                  <td>
                    {result.message || '验证通过，无问题'}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          <h5 className="mb-3 mt-4">联轴器参数</h5>
          <Row>
            <Col md={6}>
              <Table bordered size="sm" responsive style={{ color: colors.text }}>
                <tbody>
                  <tr>
                    <td style={{ width: '40%', fontWeight: 'bold' }}>型号</td>
                    <td>{coupling.model}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>额定扭矩</td>
                    <td>{safeNumberFormat(coupling.torque, 3)} kN·m</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>最大转速</td>
                    <td>{coupling.maxSpeed ? `${coupling.maxSpeed} r/min` : '-'}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>重量</td>
                    <td>{coupling.weight ? `${coupling.weight} kg` : '-'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
            <Col md={6}>
              <Table bordered size="sm" responsive style={{ color: colors.text }}>
                <tbody>
                  <tr>
                    <td style={{ width: '40%', fontWeight: 'bold' }}>工况</td>
                    <td>{workCondition}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>温度</td>
                    <td>{temperature}°C</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>要求带罩壳</td>
                    <td>{hasCover ? '是' : '否'}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 'bold' }}>发动机转速</td>
                    <td>{engineSpeed ? `${engineSpeed} r/min` : '-'}</td>
                  </tr>
                </tbody>
              </Table>
            </Col>
          </Row>
          
          {/* 价格信息 */}
          <h5 className="mb-3 mt-4">价格信息</h5>
          <Table bordered size="sm" responsive style={{ color: colors.text }}>
            <tbody>
              <tr>
                <td style={{ width: '20%', fontWeight: 'bold' }}>基础价格</td>
                <td>{coupling.basePrice ? `${coupling.basePrice} 元` : '-'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>折扣率</td>
                <td>{coupling.discountRate ? `${(coupling.discountRate * 100).toFixed(1)}%` : '-'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>出厂价</td>
                <td>{coupling.factoryPrice ? `${coupling.factoryPrice} 元` : '-'}</td>
              </tr>
              <tr>
                <td style={{ fontWeight: 'bold' }}>市场价</td>
                <td>{coupling.marketPrice ? `${coupling.marketPrice} 元` : '-'}</td>
              </tr>
            </tbody>
          </Table>
          
          {/* 验证说明 */}
          <Alert variant="info" className="mt-4">
            <h5>验证说明</h5>
            <ul className="mb-0">
              <li><strong>扭矩验证</strong> - 联轴器额定扭矩必须大于所需扭矩，并且扭矩余量最好在10-30%之间</li>
              <li><strong>转速验证</strong> - 联轴器最大转速必须大于发动机转速</li>
              <li><strong>罩壳验证</strong> - 如果要求带罩壳，则应选择带罩壳型号的联轴器</li>
              <li><strong>型号验证</strong> - 联轴器型号应与齿轮箱推荐型号匹配</li>
              <li><strong>价格验证</strong> - 联轴器应有合理的价格信息</li>
            </ul>
          </Alert>
          
          {/* 覆盖警告 */}
          {summary.criticalIssues > 0 && (
            <Alert variant="danger" className="mt-3">
              <h5>严重问题覆盖警告</h5>
              <p>您正在考虑使用一个存在严重问题的联轴器。这可能导致以下风险：</p>
              <ul>
                <li>联轴器过早失效</li>
                <li>传动系统损坏</li>
                <li>安全隐患</li>
                <li>保修失效</li>
              </ul>
              <Form.Check
                type="switch"
                id="modal-unsafe-override"
                label="我了解风险，仍然强制使用此联轴器"
                checked={unsafeOverride}
                onChange={toggleUnsafeOverride}
                className="mt-3"
              />
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer style={{ 
          backgroundColor: colors.bg, 
          borderTopColor: colors.border
        }}>
          <Button variant="secondary" onClick={toggleDetailsModal}>
            关闭
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CouplingValidator;