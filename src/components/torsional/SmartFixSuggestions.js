/**
 * 智能修复建议组件
 *
 * 功能：显示诊断结果和修复建议卡片，支持预览和一键应用
 */
import React, { useState, useMemo, useCallback } from 'react';
import { Card, Alert, Button, Row, Col, Badge, Modal, Table } from 'react-bootstrap';
import BuildIcon from '@mui/icons-material/Build';
import SpeedIcon from '@mui/icons-material/Speed';
import SettingsIcon from '@mui/icons-material/Settings';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityIcon from '@mui/icons-material/Visibility';

import {
  diagnoseError,
  generateFixSuggestions,
  applyFix,
  ERROR_TYPES,
  FIX_TYPES,
} from '../../utils/torsionalFixEngine';
import { createDefaultTorsionalInput } from '../../utils/torsionalVibration';

/**
 * 获取修复类型图标
 */
const getFixIcon = (type) => {
  switch (type) {
    case FIX_TYPES.ADJUST_SPEED:
      return <SpeedIcon />;
    case FIX_TYPES.ADJUST_DIAMETER:
    case FIX_TYPES.ADJUST_LENGTH:
      return <SettingsIcon />;
    case FIX_TYPES.ADJUST_INERTIA:
      return <BuildIcon />;
    case FIX_TYPES.RECALCULATE:
      return <AutoFixHighIcon />;
    case FIX_TYPES.RESET_DEFAULTS:
      return <SettingsIcon />;
    default:
      return <BuildIcon />;
  }
};

/**
 * 获取严重程度样式
 */
const getSeverityVariant = (severity) => {
  switch (severity) {
    case 'critical':
      return 'danger';
    case 'high':
      return 'warning';
    case 'medium':
      return 'info';
    case 'low':
      return 'secondary';
    default:
      return 'secondary';
  }
};

/**
 * 获取严重程度文本
 */
const getSeverityText = (severity) => {
  switch (severity) {
    case 'critical':
      return '严重';
    case 'high':
      return '较高';
    case 'medium':
      return '中等';
    case 'low':
      return '轻微';
    default:
      return '未知';
  }
};

/**
 * 获取错误类型文本
 */
const getErrorTypeText = (errorType) => {
  switch (errorType) {
    case ERROR_TYPES.RESONANCE_RISK:
      return '共振风险';
    case ERROR_TYPES.INVALID_INERTIA:
      return '惯量无效';
    case ERROR_TYPES.INVALID_STIFFNESS:
      return '刚度无效';
    case ERROR_TYPES.INVALID_SPEED:
      return '转速无效';
    case ERROR_TYPES.INSUFFICIENT_MASSES:
      return '质量数不足';
    case ERROR_TYPES.INSUFFICIENT_SHAFTS:
      return '轴段数不足';
    case ERROR_TYPES.CALCULATION_ERROR:
      return '计算异常';
    default:
      return '未知错误';
  }
};

const SmartFixSuggestions = ({
  error,
  result,
  input,
  onApplyFix,
  onClose,
  colors = {},
  theme = 'light',
}) => {
  const [showPreview, setShowPreview] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);

  // 默认颜色
  const defaultColors = useMemo(() => ({
    card: theme === 'dark' ? '#1e1e1e' : '#fff',
    border: theme === 'dark' ? '#444' : '#dee2e6',
    headerBg: theme === 'dark' ? '#2d2d2d' : '#f8f9fa',
    headerText: theme === 'dark' ? '#fff' : '#333',
    text: theme === 'dark' ? '#e0e0e0' : '#333',
    muted: theme === 'dark' ? '#aaa' : '#6c757d',
    success: theme === 'dark' ? '#28a745' : '#28a745',
    warning: theme === 'dark' ? '#ffc107' : '#ffc107',
    danger: theme === 'dark' ? '#dc3545' : '#dc3545',
    ...colors
  }), [theme, colors]);

  // 执行诊断
  const diagnosis = useMemo(() => {
    return diagnoseError(error?.message || error, result, input);
  }, [error, result, input]);

  // 生成修复建议（传入result以获取所有阶次临界转速信息）
  const suggestions = useMemo(() => {
    return generateFixSuggestions(diagnosis, input, result);
  }, [diagnosis, input, result]);

  // 处理预览
  const handlePreview = useCallback((suggestion) => {
    setSelectedSuggestion(suggestion);
    setShowPreview(true);
  }, []);

  // 处理应用修复
  const handleApply = useCallback((suggestion) => {
    const fixedInput = applyFix(suggestion, input, createDefaultTorsionalInput);
    onApplyFix(fixedInput);
  }, [input, onApplyFix]);

  // 渲染参数变更对比
  const renderChangesComparison = (suggestion) => {
    const changes = suggestion.changes;
    const rows = [];

    if (changes.operatingSpeed !== undefined) {
      rows.push({
        param: '工作转速',
        before: `${input.operatingSpeed} rpm`,
        after: `${changes.operatingSpeed} rpm`,
      });
    }

    if (changes.masses) {
      changes.masses.forEach((newMass, index) => {
        const oldMass = input.masses[index];
        if (oldMass && oldMass.J !== newMass.J) {
          rows.push({
            param: `${newMass.name} 惯量`,
            before: `${oldMass.J} kg·m²`,
            after: `${newMass.J} kg·m²`,
          });
        }
      });
    }

    if (changes.shafts) {
      changes.shafts.forEach((newShaft, index) => {
        const oldShaft = input.shafts[index];
        if (oldShaft) {
          if (oldShaft.K !== newShaft.K) {
            rows.push({
              param: `${newShaft.name} 刚度`,
              before: oldShaft.K ? `${oldShaft.K.toExponential(2)} N·m/rad` : '无效',
              after: `${newShaft.K.toExponential(2)} N·m/rad`,
            });
          }
          if (oldShaft.diameter !== newShaft.diameter) {
            rows.push({
              param: `${newShaft.name} 直径`,
              before: `${oldShaft.diameter} mm`,
              after: `${newShaft.diameter} mm`,
            });
          }
        }
      });
    }

    if (changes.reset) {
      rows.push({
        param: '全部参数',
        before: '当前配置',
        after: '默认配置',
      });
    }

    return (
      <Table striped bordered size="sm" style={{ color: defaultColors.text }}>
        <thead>
          <tr>
            <th>参数</th>
            <th>修改前</th>
            <th>修改后</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>{row.param}</td>
              <td style={{ color: defaultColors.muted }}>{row.before}</td>
              <td style={{ color: defaultColors.success, fontWeight: 'bold' }}>{row.after}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const cardStyle = {
    backgroundColor: defaultColors.card,
    borderColor: defaultColors.border,
    marginBottom: '1rem',
  };

  return (
    <Card style={cardStyle} className="smart-fix-suggestions">
      <Card.Header
        className="d-flex justify-content-between align-items-center"
        style={{ backgroundColor: defaultColors.headerBg }}
      >
        <div className="d-flex align-items-center">
          <AutoFixHighIcon style={{ color: defaultColors.headerText, marginRight: 8 }} />
          <span style={{ color: defaultColors.headerText, fontWeight: 'bold' }}>
            智能修复建议
          </span>
        </div>
        <Button
          variant="link"
          size="sm"
          onClick={onClose}
          style={{ color: defaultColors.muted }}
        >
          <CloseIcon fontSize="small" />
        </Button>
      </Card.Header>

      <Card.Body>
        {/* 诊断结果区域 */}
        <Alert variant={getSeverityVariant(diagnosis.severity)} className="mb-3">
          <div className="d-flex justify-content-between align-items-start">
            <div>
              <div className="d-flex align-items-center mb-2">
                <WarningIcon fontSize="small" className="me-2" />
                <strong>问题诊断</strong>
                <Badge
                  bg={getSeverityVariant(diagnosis.severity)}
                  className="ms-2"
                >
                  {getSeverityText(diagnosis.severity)}
                </Badge>
              </div>

              {/* 错误类型标签 */}
              <div className="mb-2">
                {diagnosis.errorTypes.map((type, index) => (
                  <Badge
                    key={index}
                    bg="secondary"
                    className="me-1"
                  >
                    {getErrorTypeText(type)}
                  </Badge>
                ))}
              </div>

              {/* 详细信息 */}
              {diagnosis.details.length > 0 && (
                <ul className="mb-2" style={{ paddingLeft: '1.2rem', marginBottom: '0.5rem' }}>
                  {diagnosis.details.map((detail, index) => (
                    <li key={index} style={{ fontSize: '0.9rem' }}>{detail}</li>
                  ))}
                </ul>
              )}

              {/* 可能原因 */}
              {diagnosis.causes.length > 0 && (
                <div style={{ fontSize: '0.85rem', color: defaultColors.muted }}>
                  <strong>可能原因：</strong>
                  {diagnosis.causes.map((cause, index) => (
                    <span key={index}>
                      {cause}
                      {index < diagnosis.causes.length - 1 && '；'}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </Alert>

        {/* 修复建议卡片区域 */}
        {suggestions.length > 0 ? (
          <>
            <h6 style={{ color: defaultColors.text, marginBottom: '1rem' }}>
              <CheckCircleIcon fontSize="small" className="me-1" />
              可用修复方案 ({suggestions.length})
            </h6>

            <Row>
              {suggestions.map((suggestion) => (
                <Col md={6} lg={4} key={suggestion.id} className="mb-3">
                  <Card
                    style={{
                      ...cardStyle,
                      borderColor: suggestion.isRecommended
                        ? defaultColors.success
                        : defaultColors.border,
                      borderWidth: suggestion.isRecommended ? '2px' : '1px',
                    }}
                  >
                    <Card.Body>
                      {/* 推荐标记 */}
                      {suggestion.isRecommended && (
                        <Badge bg="success" className="mb-2">
                          ⭐ 推荐方案
                        </Badge>
                      )}

                      {/* 方案标题 */}
                      <div className="d-flex align-items-center mb-2">
                        <span style={{ color: defaultColors.headerText, marginRight: 8 }}>
                          {getFixIcon(suggestion.type)}
                        </span>
                        <strong style={{ color: defaultColors.text }}>
                          {suggestion.title}
                        </strong>
                      </div>

                      {/* 描述 */}
                      <p style={{
                        color: defaultColors.text,
                        fontSize: '0.9rem',
                        marginBottom: '0.5rem'
                      }}>
                        {suggestion.description}
                      </p>

                      {/* 预期效果 */}
                      <div style={{
                        fontSize: '0.85rem',
                        color: defaultColors.success,
                        marginBottom: '0.5rem'
                      }}>
                        <CheckCircleIcon fontSize="inherit" className="me-1" />
                        {suggestion.effect}
                      </div>

                      {/* 副作用提示 */}
                      {suggestion.sideEffect && suggestion.sideEffect !== '无' && (
                        <div style={{
                          fontSize: '0.85rem',
                          color: defaultColors.warning,
                          marginBottom: '0.5rem'
                        }}>
                          <WarningIcon fontSize="inherit" className="me-1" />
                          {suggestion.sideEffect}
                        </div>
                      )}

                      {/* 备选值 */}
                      {suggestion.alternativeValues && suggestion.alternativeValues.length > 1 && (
                        <div style={{
                          fontSize: '0.8rem',
                          color: defaultColors.muted,
                          marginBottom: '0.5rem'
                        }}>
                          其他选项: {suggestion.alternativeValues.slice(1, 4).join(', ')} rpm
                        </div>
                      )}

                      {/* 操作按钮 */}
                      <div className="d-flex gap-2 mt-3">
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          onClick={() => handlePreview(suggestion)}
                        >
                          <VisibilityIcon fontSize="small" className="me-1" />
                          预览
                        </Button>
                        <Button
                          variant={suggestion.isRecommended ? 'success' : 'primary'}
                          size="sm"
                          onClick={() => handleApply(suggestion)}
                        >
                          <AutoFixHighIcon fontSize="small" className="me-1" />
                          应用
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <Alert variant="info">
            暂无可用的修复建议，请手动检查参数配置。
          </Alert>
        )}
      </Card.Body>

      {/* 预览模态框 */}
      <Modal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        centered
        size="lg"
      >
        <Modal.Header
          closeButton
          style={{
            backgroundColor: defaultColors.headerBg,
            borderColor: defaultColors.border,
          }}
        >
          <Modal.Title style={{ color: defaultColors.headerText }}>
            <VisibilityIcon className="me-2" />
            参数变更预览
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ backgroundColor: defaultColors.card }}>
          {selectedSuggestion && (
            <>
              <Alert variant="info" className="mb-3">
                <strong>{selectedSuggestion.title}</strong>
                <p className="mb-0 mt-1">{selectedSuggestion.description}</p>
              </Alert>

              <h6 style={{ color: defaultColors.text }}>参数变更对比：</h6>
              {renderChangesComparison(selectedSuggestion)}

              <div className="mt-3">
                <strong style={{ color: defaultColors.success }}>
                  <CheckCircleIcon fontSize="small" className="me-1" />
                  预期效果：
                </strong>
                <span style={{ color: defaultColors.text, marginLeft: '0.5rem' }}>
                  {selectedSuggestion.effect}
                </span>
              </div>

              {selectedSuggestion.sideEffect && selectedSuggestion.sideEffect !== '无' && (
                <div className="mt-2">
                  <strong style={{ color: defaultColors.warning }}>
                    <WarningIcon fontSize="small" className="me-1" />
                    注意事项：
                  </strong>
                  <span style={{ color: defaultColors.text, marginLeft: '0.5rem' }}>
                    {selectedSuggestion.sideEffect}
                  </span>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer
          style={{
            backgroundColor: defaultColors.headerBg,
            borderColor: defaultColors.border,
          }}
        >
          <Button
            variant="secondary"
            onClick={() => setShowPreview(false)}
          >
            取消
          </Button>
          <Button
            variant="success"
            onClick={() => {
              handleApply(selectedSuggestion);
              setShowPreview(false);
            }}
          >
            <AutoFixHighIcon fontSize="small" className="me-1" />
            确认应用
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default SmartFixSuggestions;
