// src/components/ClauseKnowledgeBase/ClauseCard.js
// 条款卡片组件

import React from 'react';
import { Card, Badge, Form } from 'react-bootstrap';
import { highlightMatches } from '../../utils/clauseSearch';

// 分类图标映射
const categoryIcons = {
  pump: 'bi-droplet-half',
  valve: 'bi-sliders',
  cooling: 'bi-snow',
  control: 'bi-gear-wide-connected',
  safety: 'bi-shield-check',
  testing: 'bi-clipboard-check',
  structure: 'bi-diagram-3',
  installation: 'bi-tools',
  lubrication: 'bi-droplet',
  accessories: 'bi-box-seam',
  maintenance: 'bi-wrench-adjustable',
  troubleshooting: 'bi-exclamation-diamond'
};

// 分类名称映射
const categoryNames = {
  pump: '泵与液压',
  valve: '阀门与管路',
  cooling: '冷却系统',
  control: '控制系统',
  safety: '安全要求',
  testing: '测试验收',
  structure: '产品结构',
  installation: '安装校正',
  lubrication: '润滑系统',
  accessories: '附件规格',
  maintenance: '维护保养',
  troubleshooting: '故障排除'
};

// 分类颜色映射
const categoryColors = {
  pump: 'primary',
  valve: 'info',
  cooling: 'success',
  control: 'warning',
  safety: 'danger',
  testing: 'secondary',
  structure: 'dark',
  installation: 'primary',
  lubrication: 'info',
  accessories: 'success',
  maintenance: 'warning',
  troubleshooting: 'danger'
};

/**
 * 条款卡片组件
 * 展示单个条款的摘要信息
 */
const ClauseCard = ({
  clause,
  matches,
  score,
  colors,
  selected,
  onSelect,
  onViewDetail
}) => {
  // 获取高亮的标题
  const getHighlightedTitle = () => {
    if (matches && matches.length > 0) {
      return highlightMatches(clause.title, matches, 'title');
    }
    return clause.title;
  };

  // 获取内容摘要 (最多100字)
  const getContentSummary = () => {
    const maxLength = 100;
    let content = clause.content;

    // 如果有匹配，尝试高亮
    if (matches && matches.length > 0) {
      content = highlightMatches(content, matches, 'content');
    }

    // 截断
    if (clause.content.length > maxLength) {
      const plainText = clause.content.substring(0, maxLength);
      return content.length > maxLength
        ? content.substring(0, maxLength) + '...'
        : plainText + '...';
    }

    return content;
  };

  // 处理卡片点击
  const handleCardClick = (e) => {
    // 如果点击的是复选框，不触发详情
    if (e.target.type === 'checkbox' || e.target.closest('.clause-card-checkbox')) {
      return;
    }
    onViewDetail();
  };

  // 处理复选框点击
  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    onSelect();
  };

  return (
    <Card
      className={`clause-card h-100 ${selected ? 'clause-card-selected' : ''}`}
      style={{
        backgroundColor: colors?.card,
        borderColor: selected ? '#0d6efd' : colors?.border,
        borderWidth: selected ? '2px' : '1px',
        cursor: 'pointer',
        transition: 'all 0.2s ease'
      }}
      onClick={handleCardClick}
    >
      <Card.Header
        className="d-flex justify-content-between align-items-start py-2"
        style={{
          backgroundColor: colors?.headerBg,
          borderColor: colors?.border
        }}
      >
        {/* 分类标签 */}
        <Badge bg={categoryColors[clause.category] || 'secondary'}>
          <i className={`${categoryIcons[clause.category]} me-1`}></i>
          {categoryNames[clause.category] || clause.category}
        </Badge>

        {/* 选择复选框 */}
        <div
          className="clause-card-checkbox"
          onClick={handleCheckboxClick}
        >
          <Form.Check
            type="checkbox"
            checked={selected}
            onChange={() => {}}
            title="选择此条款进行对比"
          />
        </div>
      </Card.Header>

      <Card.Body className="py-2">
        {/* 标题 */}
        <Card.Title
          className="clause-card-title h6 mb-2"
          style={{ color: colors?.headerText }}
          dangerouslySetInnerHTML={{ __html: getHighlightedTitle() }}
        />

        {/* 内容摘要 */}
        <Card.Text
          className="clause-card-content small mb-2"
          style={{ color: colors?.text }}
          dangerouslySetInnerHTML={{ __html: getContentSummary() }}
        />

        {/* 关键词标签 */}
        <div className="clause-card-keywords">
          {clause.keywords && clause.keywords.slice(0, 3).map((keyword, idx) => (
            <Badge
              key={idx}
              bg="light"
              text="dark"
              className="me-1 mb-1"
              style={{ fontSize: '0.7rem' }}
            >
              {keyword}
            </Badge>
          ))}
          {clause.keywords && clause.keywords.length > 3 && (
            <Badge
              bg="light"
              text="muted"
              style={{ fontSize: '0.7rem' }}
            >
              +{clause.keywords.length - 3}
            </Badge>
          )}
        </div>
      </Card.Body>

      <Card.Footer
        className="py-2 d-flex justify-content-between align-items-center"
        style={{
          backgroundColor: colors?.headerBg,
          borderColor: colors?.border
        }}
      >
        {/* 适用系列 */}
        <div className="clause-card-series">
          {clause.applicableSeries && clause.applicableSeries.slice(0, 3).map((series, idx) => (
            <Badge
              key={idx}
              bg="outline-secondary"
              className="me-1"
              style={{
                fontSize: '0.65rem',
                border: '1px solid #6c757d',
                color: '#6c757d',
                backgroundColor: 'transparent'
              }}
            >
              {series}
            </Badge>
          ))}
        </div>

        {/* 匹配分数 (调试用，可隐藏) */}
        {score > 0 && (
          <small
            className="text-muted"
            style={{ fontSize: '0.65rem' }}
            title="匹配相关度"
          >
            {Math.round((1 - score) * 100)}%
          </small>
        )}
      </Card.Footer>
    </Card>
  );
};

export default ClauseCard;
