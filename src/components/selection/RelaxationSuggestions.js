// src/components/selection/RelaxationSuggestions.js
// Displays constraint relaxation suggestions when selection fails
import React from 'react';
import { Alert, Badge, Button, ListGroup } from 'react-bootstrap';

/**
 * Shows parameter adjustment suggestions that could unlock additional gearbox matches
 * Only rendered when selection fails and relaxation analysis found viable alternatives
 *
 * P0#1 (2026-04-24): 新增"修改参数重选"操作,跳转至输入页顶部并聚焦相关字段
 */
export default function RelaxationSuggestions({ suggestions }) {
  if (!suggestions || suggestions.length === 0) return null;

  // 映射建议参数 → 输入表单 controlId, 用于 smooth scroll + focus
  const paramToFieldId = (parameter) => {
    if (!parameter) return null;
    if (parameter.includes('速比')) return 'targetRatio';
    if (parameter.includes('转速')) return 'engineSpeed';
    if (parameter.includes('容量') || parameter.includes('余量')) return 'enginePower';
    if (parameter.includes('推力')) return 'thrustRequirement';
    return null;
  };

  const handleEditParams = (parameter) => {
    const fieldId = paramToFieldId(parameter);
    // Switch back to input tab via global event (parent listens)
    window.dispatchEvent(new CustomEvent('gearbox:switchToInput', { detail: { fieldId } }));
    // Fallback: scroll to field if it's currently in DOM
    if (fieldId) {
      setTimeout(() => {
        const el = document.getElementById(fieldId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          try { el.focus(); } catch (e) { /* ignore */ }
        }
      }, 300);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <Alert variant="info" className="mt-3">
      <Alert.Heading className="h6">
        <i className="bi bi-lightbulb me-2"></i>参数调整建议
      </Alert.Heading>
      <small className="text-muted d-block mb-2">
        放宽以下参数可能找到更多匹配型号,点击右侧按钮直接跳转编辑：
      </small>
      <ListGroup variant="flush" className="bg-transparent">
        {suggestions.map((s, i) => (
          <ListGroup.Item
            key={i}
            className="bg-transparent px-0 py-2 border-bottom"
          >
            <div className="d-flex justify-content-between align-items-start gap-2">
              <div style={{ flex: 1 }}>
                <strong>{s.parameter}</strong>
                <div className="small text-muted">
                  {s.currentValue} →{' '}
                  <span className="text-primary">{s.suggestedValue}</span>
                </div>
                {s.models && s.models.length > 0 && (
                  <small className="text-muted d-block">
                    如: {s.models.join(', ')}
                    {s.additionalMatches > s.models.length ? ' 等' : ''}
                  </small>
                )}
              </div>
              <div className="d-flex flex-column align-items-end gap-1">
                <Badge bg="primary" pill>+{s.additionalMatches} 型号</Badge>
                <Button
                  size="sm"
                  variant="outline-primary"
                  style={{ fontSize: '0.72rem', padding: '2px 8px' }}
                  onClick={() => handleEditParams(s.parameter)}
                >
                  <i className="bi bi-pencil-square me-1"></i>修改参数
                </Button>
              </div>
            </div>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Alert>
  );
}
