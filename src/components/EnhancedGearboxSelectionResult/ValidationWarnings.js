// src/components/EnhancedGearboxSelectionResult/ValidationWarnings.js
// 数据验证警告组件
import React from 'react';
import { Alert } from 'react-bootstrap';

/**
 * 数据验证警告显示组件
 * 显示齿轮箱/联轴器/备用泵的数据验证错误和警告
 */
const ValidationWarnings = ({ validation, type = 'gearbox' }) => {
  if (!validation) return null;

  const hasErrors = validation.errors && validation.errors.length > 0;
  const hasWarnings = validation.warnings && validation.warnings.length > 0;

  if (!hasErrors && !hasWarnings) return null;

  const typeLabels = {
    gearbox: '齿轮箱',
    coupling: '联轴器',
    pump: '备用泵'
  };

  return (
    <div className="validation-warnings mt-2">
      {hasErrors && (
        <Alert variant="danger" className="py-2 mb-2">
          <div className="d-flex align-items-center mb-1">
            <i className="bi bi-exclamation-octagon-fill me-2"></i>
            <strong>{typeLabels[type]}数据错误 ({validation.errors.length})</strong>
          </div>
          <ul className="mb-0 ps-4" style={{ fontSize: '0.85rem' }}>
            {validation.errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
        </Alert>
      )}
      {hasWarnings && (
        <Alert variant="warning" className="py-2 mb-2">
          <div className="d-flex align-items-center mb-1">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            <strong>{typeLabels[type]}数据警告 ({validation.warnings.length})</strong>
          </div>
          <ul className="mb-0 ps-4" style={{ fontSize: '0.85rem' }}>
            {validation.warnings.map((warning, idx) => (
              <li key={idx}>{warning}</li>
            ))}
          </ul>
        </Alert>
      )}
    </div>
  );
};

export default ValidationWarnings;
