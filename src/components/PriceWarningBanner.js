// src/components/PriceWarningBanner.js
// 价格版本警告横幅组件

import React, { useState, useEffect } from 'react';
import { Alert, Button } from 'react-bootstrap';
import {
  getPriceWarning,
  PriceVersionManager,
  formatPriceVersion,
  checkPriceUpdate
} from '../utils/priceVersioning';

/**
 * 价格警告横幅组件
 * 当价格数据即将过期或已过期时显示警告
 */
const PriceWarningBanner = ({ onDismiss, style }) => {
  const [warning, setWarning] = useState(null);
  const [dismissed, setDismissed] = useState(false);
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    // 获取警告信息
    const warningInfo = getPriceWarning();
    setWarning(warningInfo);

    // 检查是否有更新
    if (warningInfo) {
      checkPriceUpdate().then(result => {
        if (result.needsUpdate) {
          setUpdateAvailable(true);
        }
      });
    }

    // 检查是否之前已dismiss（仅对warning级别）
    const dismissedKey = `_priceWarningDismissed_${formatPriceVersion()}`;
    if (warningInfo?.level === 'warning' && localStorage.getItem(dismissedKey)) {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    if (warning?.level === 'warning') {
      // 只有warning级别可以dismiss
      const dismissedKey = `_priceWarningDismissed_${formatPriceVersion()}`;
      localStorage.setItem(dismissedKey, 'true');
      setDismissed(true);
      onDismiss?.();
    }
  };

  // 不需要显示
  if (!warning || dismissed) {
    return null;
  }

  const variant = warning.level === 'error' ? 'danger' : 'warning';
  const icon = warning.level === 'error' ? '⚠️' : '⏰';

  return (
    <Alert
      variant={variant}
      dismissible={warning.level !== 'error'}
      onClose={handleDismiss}
      style={{
        margin: 0,
        borderRadius: 0,
        ...style
      }}
    >
      <div className="d-flex align-items-center justify-content-between flex-wrap">
        <div>
          <strong>{icon} {warning.title}</strong>
          <span className="ms-2">{warning.message}</span>
        </div>
        <div className="mt-2 mt-md-0">
          {updateAvailable && (
            <Button
              size="sm"
              variant={warning.level === 'error' ? 'light' : 'outline-dark'}
              className="me-2"
              onClick={() => window.location.reload()}
            >
              刷新获取更新
            </Button>
          )}
          {warning.level === 'warning' && (
            <Button
              size="sm"
              variant="outline-dark"
              onClick={handleDismiss}
            >
              {warning.action || '知道了'}
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
};

/**
 * 价格版本信息组件（用于页脚或设置页面）
 */
export const PriceVersionInfo = ({ showDetails = false }) => {
  const versionInfo = PriceVersionManager.getVersionInfo();

  const statusColors = {
    valid: '#28a745',
    expiring: '#ffc107',
    expired: '#dc3545'
  };

  const statusLabels = {
    valid: '有效',
    expiring: '即将过期',
    expired: '已过期'
  };

  return (
    <div className="price-version-info" style={{ fontSize: '0.85rem', color: '#6c757d' }}>
      <div>
        <span>价格版本: </span>
        <strong>{versionInfo.version}</strong>
        <span
          style={{
            marginLeft: '8px',
            padding: '2px 6px',
            borderRadius: '4px',
            fontSize: '0.75rem',
            backgroundColor: statusColors[versionInfo.status] + '20',
            color: statusColors[versionInfo.status]
          }}
        >
          {statusLabels[versionInfo.status]}
        </span>
      </div>
      {showDetails && (
        <div style={{ marginTop: '4px' }}>
          <div>生效日期: {versionInfo.effectiveDate}</div>
          <div>有效期至: {versionInfo.expiryDate}</div>
          <div>数据来源: {versionInfo.source}</div>
        </div>
      )}
    </div>
  );
};

/**
 * 报价单价格版本声明组件
 */
export const QuotationPriceDisclaimer = () => {
  const disclaimer = PriceVersionManager.getQuotationDisclaimer();
  const status = PriceVersionManager.getVersionInfo().status;

  return (
    <div
      className="quotation-price-disclaimer"
      style={{
        padding: '8px 12px',
        backgroundColor: status === 'expired' ? '#f8d7da' : '#e9ecef',
        borderRadius: '4px',
        fontSize: '0.85rem',
        color: status === 'expired' ? '#721c24' : '#495057'
      }}
    >
      {disclaimer}
      {status === 'expired' && (
        <div style={{ marginTop: '4px', fontWeight: 'bold' }}>
          注意: 实际价格请以最新报价为准
        </div>
      )}
    </div>
  );
};

export default PriceWarningBanner;
