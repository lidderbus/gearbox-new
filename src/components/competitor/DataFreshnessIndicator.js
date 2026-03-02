/**
 * 数据新鲜度指示器
 * Data Freshness Indicator Component
 */

import React, { useMemo } from 'react';
import { Badge, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { productFreshnessData, DATA_VERSION } from '../../data/competitorDataEnhanced';

// 计算月份差
const getMonthsAgo = (dateStr) => {
  if (!dateStr) return 999;
  const [year, month] = dateStr.split('-').map(Number);
  const now = new Date();
  return (now.getFullYear() - year) * 12 + (now.getMonth() + 1 - month);
};

// 获取新鲜度等级
const getFreshnessLevel = (model) => {
  const data = productFreshnessData[model];
  if (!data || !data.lastVerified) return { level: 'red', label: '未验证', months: null };
  const months = getMonthsAgo(data.lastVerified);
  if (months <= 12) return { level: 'green', label: '已验证', months, confidence: data.priceConfidence };
  if (months <= 24) return { level: 'yellow', label: '待更新', months, confidence: data.priceConfidence };
  return { level: 'red', label: '已过期', months, confidence: data.priceConfidence };
};

// 新鲜度圆点组件
export const FreshnessDot = ({ model, showTooltip = true }) => {
  const freshness = getFreshnessLevel(model);
  const colorMap = { green: '#28a745', yellow: '#ffc107', red: '#dc3545' };
  const color = colorMap[freshness.level] || colorMap.red;

  const dot = (
    <span
      style={{
        display: 'inline-block',
        width: 8,
        height: 8,
        borderRadius: '50%',
        backgroundColor: color,
        marginLeft: 4,
        verticalAlign: 'middle'
      }}
    />
  );

  if (!showTooltip) return dot;

  const tooltipText = freshness.months !== null
    ? `${freshness.label} (${freshness.months}个月前) | 价格: ${
        freshness.confidence === 'confirmed' ? '已确认' :
        freshness.confidence === 'estimate' ? '估算值' : '待更新'
      }`
    : '无验证记录';

  return (
    <OverlayTrigger placement="top" overlay={<Tooltip>{tooltipText}</Tooltip>}>
      {dot}
    </OverlayTrigger>
  );
};

// 数据健康汇总Banner
const DataFreshnessIndicator = ({ products = [], compact = false }) => {
  const summary = useMemo(() => {
    const allModels = products.length > 0
      ? products.map(p => p.model)
      : Object.keys(productFreshnessData);

    let green = 0, yellow = 0, red = 0;
    allModels.forEach(model => {
      const { level } = getFreshnessLevel(model);
      if (level === 'green') green++;
      else if (level === 'yellow') yellow++;
      else red++;
    });
    const total = green + yellow + red;
    return { green, yellow, red, total };
  }, [products]);

  if (compact) {
    return (
      <div className="d-flex align-items-center gap-2">
        <small className="text-muted">数据健康:</small>
        <Badge bg="success" pill>{summary.green}</Badge>
        {summary.yellow > 0 && <Badge bg="warning" text="dark" pill>{summary.yellow}</Badge>}
        {summary.red > 0 && <Badge bg="danger" pill>{summary.red}</Badge>}
      </div>
    );
  }

  const hasStale = summary.yellow > 0 || summary.red > 0;

  return (
    <Alert variant={hasStale ? 'warning' : 'success'} className="py-2 px-3 mb-3 d-flex align-items-center justify-content-between">
      <div>
        <i className={`bi ${hasStale ? 'bi-exclamation-triangle' : 'bi-check-circle'} me-2`}></i>
        <strong>数据版本 {DATA_VERSION.version}</strong>
        <span className="mx-2">|</span>
        <small>
          <span style={{ color: '#28a745' }}>● {summary.green}个已验证</span>
          {summary.yellow > 0 && <span className="ms-2" style={{ color: '#ffc107' }}>● {summary.yellow}个待更新</span>}
          {summary.red > 0 && <span className="ms-2" style={{ color: '#dc3545' }}>● {summary.red}个已过期</span>}
        </small>
      </div>
      <small className="text-muted">
        上次更新: {DATA_VERSION.lastFullUpdate} | 下次审核: {DATA_VERSION.nextPlannedReview}
      </small>
    </Alert>
  );
};

export { getFreshnessLevel, getMonthsAgo };
export default DataFreshnessIndicator;
