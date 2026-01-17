// src/components/SmartHintsPanel.js
/**
 * 智能提示面板
 * 分析选型失败原因，提供调整建议
 */

import React, { useMemo } from 'react';
import { Card, Alert, ProgressBar, Button, Badge, ListGroup } from 'react-bootstrap';
import { analyzeRejections, getFilterStatus } from '../utils/selectionDiagnostics';
import { useSelectionConfig } from '../contexts/SelectionConfigContext';

const REASON_COLORS = {
  speedRange: '#6c757d',
  ratioOutOfRange: '#007bff',
  capacityTooLow: '#dc3545',
  capacityTooHigh: '#fd7e14',
  thrustInsufficient: '#6610f2'
};

const SmartHintsPanel = ({
  diagnostics,
  onAdjustTolerance,
  onSwitchPreset,
  onAdjustInput,
  colors = {}
}) => {
  const { setTolerances, tolerances, setApplication, setPreset } = useSelectionConfig();

  // 分析诊断数据
  const analysisResult = useMemo(() => {
    if (!diagnostics) return null;
    return analyzeRejections(diagnostics);
  }, [diagnostics]);

  // 获取过滤管道状态
  const filterStatus = useMemo(() => {
    if (!diagnostics) return null;
    return getFilterStatus({ _diagnostics: diagnostics });
  }, [diagnostics]);

  // 处理建议操作
  const handleSuggestionAction = (action) => {
    if (!action) return;

    switch (action.type) {
      case 'adjustTolerance':
        if (action.field && action.suggestedValue !== undefined) {
          const newTolerances = {
            ...tolerances,
            [action.field]: action.suggestedValue
          };
          setTolerances(newTolerances);
          onAdjustTolerance?.(action.field, action.suggestedValue);
        }
        break;

      case 'switchApplication':
        if (action.preset) {
          setApplication(action.preset);
          onSwitchPreset?.(action.preset);
        }
        break;

      case 'switchPreset':
        if (action.preset) {
          setPreset(action.preset);
        }
        break;

      case 'adjustInput':
        onAdjustInput?.(action.field, action.direction);
        break;

      case 'checkInputs':
        // 触发输入检查回调
        onAdjustInput?.('check', null);
        break;

      default:
        break;
    }
  };

  // 无诊断数据时不显示
  if (!diagnostics || !analysisResult?.success) {
    return null;
  }

  const { analysis } = analysisResult;
  const { summary, reasons, suggestions } = analysis;

  // 匹配成功时显示简洁信息
  if (summary.totalMatched > 0) {
    return (
      <Alert variant="success" className="smart-hints-success mb-3">
        <div className="d-flex align-items-center">
          <i className="bi bi-check-circle-fill me-2 fs-5"></i>
          <div>
            <strong>匹配成功</strong>
            <div className="small">
              扫描 {summary.totalScanned} 个型号，匹配 {summary.totalMatched} 个
              <Badge bg="success" className="ms-2">{summary.matchRate}%</Badge>
            </div>
          </div>
        </div>
      </Alert>
    );
  }

  // 无匹配时显示详细分析
  return (
    <Card className="smart-hints-panel mb-3" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header className="bg-warning text-dark">
        <div className="d-flex align-items-center">
          <i className="bi bi-lightbulb me-2"></i>
          <span>智能分析 - 无匹配结果</span>
        </div>
      </Card.Header>
      <Card.Body>
        {/* 过滤管道可视化 */}
        {filterStatus && (
          <div className="filter-pipeline mb-4">
            <h6 className="small text-muted mb-2">
              <i className="bi bi-funnel me-1"></i>
              过滤管道分析
            </h6>
            <div className="pipeline-stages">
              {filterStatus.stages.map((stage, idx) => (
                <div key={idx} className="pipeline-stage mb-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <span className="small">{stage.name}</span>
                    <span className="small">
                      {stage.passed !== undefined && (
                        <Badge bg={stage.passed > 0 ? 'success' : 'danger'}>
                          {stage.passed}
                        </Badge>
                      )}
                      {stage.rejected > 0 && (
                        <Badge bg="secondary" className="ms-1">
                          -{stage.rejected}
                        </Badge>
                      )}
                    </span>
                  </div>
                  {stage.passed !== undefined && summary.totalScanned > 0 && (
                    <ProgressBar
                      now={(stage.passed / summary.totalScanned) * 100}
                      variant={stage.passed > 0 ? 'success' : 'danger'}
                      style={{ height: '8px' }}
                    />
                  )}
                  {stage.description && (
                    <div className="small text-muted">{stage.description}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 拒绝原因分析 */}
        {reasons.length > 0 && (
          <div className="rejection-analysis mb-4">
            <h6 className="small text-muted mb-2">
              <i className="bi bi-x-circle me-1"></i>
              主要排除原因
            </h6>
            <ListGroup variant="flush">
              {reasons.slice(0, 4).map((reason, idx) => (
                <ListGroup.Item
                  key={idx}
                  className="d-flex justify-content-between align-items-start px-0 py-2"
                  style={{ backgroundColor: 'transparent' }}
                >
                  <div className="ms-2 me-auto">
                    <div className="fw-bold small" style={{ color: REASON_COLORS[reason.code] }}>
                      {reason.label}
                    </div>
                    <div className="small text-muted">{reason.suggestion?.text}</div>
                  </div>
                  <div className="text-end">
                    <Badge bg="secondary">{reason.count}个</Badge>
                    <div className="small text-muted">{reason.percentage}%</div>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        )}

        {/* 智能建议 */}
        {suggestions.length > 0 && (
          <div className="smart-suggestions">
            <h6 className="small text-muted mb-2">
              <i className="bi bi-magic me-1"></i>
              调整建议
            </h6>
            <div className="suggestions-list">
              {suggestions.map((suggestion, idx) => (
                <Alert
                  key={idx}
                  variant={suggestion.priority === 'high' ? 'warning' : 'info'}
                  className="mb-2 py-2"
                >
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <strong className="small">{suggestion.label}</strong>
                      <div className="small text-muted">{suggestion.description}</div>
                      {suggestion.action?.currentValue !== undefined && (
                        <div className="small">
                          当前: {suggestion.action.currentValue}% →
                          建议: <strong>{suggestion.action.suggestedValue}%</strong>
                        </div>
                      )}
                    </div>
                    <Button
                      variant={suggestion.priority === 'high' ? 'warning' : 'outline-info'}
                      size="sm"
                      onClick={() => handleSuggestionAction(suggestion.action)}
                    >
                      <i className="bi bi-check2 me-1"></i>
                      应用
                    </Button>
                  </div>
                </Alert>
              ))}
            </div>
          </div>
        )}

        {/* 快速操作区 */}
        <div className="quick-actions mt-3 pt-3 border-top">
          <div className="small text-muted mb-2">快速操作</div>
          <div className="d-flex flex-wrap gap-2">
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setTolerances({
                  ...tolerances,
                  maxRatioDiffPercent: Math.min(tolerances.maxRatioDiffPercent + 10, 50)
                });
              }}
            >
              <i className="bi bi-plus-circle me-1"></i>
              放宽速比容差
            </Button>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setTolerances({
                  ...tolerances,
                  maxCapacityMargin: Math.min(tolerances.maxCapacityMargin + 30, 200)
                });
              }}
            >
              <i className="bi bi-plus-circle me-1"></i>
              放宽余量上限
            </Button>
            <Button
              variant="outline-success"
              size="sm"
              onClick={() => setApplication('special')}
            >
              <i className="bi bi-tsunami me-1"></i>
              特殊应用模式
            </Button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SmartHintsPanel;
