// src/components/QuickSelectionPanel.js
// 快速选型面板 - 提供预设选型模板的快速访问

import React, { useState, useCallback, useMemo } from 'react';
import { Card, Row, Col, Button, Form, Badge, OverlayTrigger, Tooltip, Collapse } from 'react-bootstrap';
import {
  SELECTION_PRESETS,
  getPresetCategories,
  getPresetsForCategory,
  getPresetById,
  searchPresets,
  recommendPresetsByPower
} from '../data/selectionPresets';

/**
 * 快速选型面板组件
 * @param {Function} onApplyPreset - 应用预设时的回调函数
 * @param {object} currentParams - 当前的选型参数 (用于智能推荐)
 */
const QuickSelectionPanel = ({ onApplyPreset, currentParams = {} }) => {
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [showRecommended, setShowRecommended] = useState(false);

  // 获取所有分类
  const categories = useMemo(() => getPresetCategories(), []);

  // 搜索结果
  const searchResults = useMemo(() => {
    if (!searchText.trim()) return [];
    return searchPresets(searchText);
  }, [searchText]);

  // 基于当前功率的推荐
  const recommendedPresets = useMemo(() => {
    if (!currentParams.motorPower) return [];
    return recommendPresetsByPower(parseFloat(currentParams.motorPower));
  }, [currentParams.motorPower]);

  // 切换分类展开
  const toggleCategory = useCallback((categoryKey) => {
    setExpandedCategory(prev => prev === categoryKey ? null : categoryKey);
  }, []);

  // 应用预设
  const handleApplyPreset = useCallback((preset) => {
    if (onApplyPreset) {
      onApplyPreset(preset.params, preset);
    }
  }, [onApplyPreset]);

  // 渲染单个预设卡片
  const renderPresetCard = (preset, showCategory = false) => (
    <Card
      key={preset.id}
      className="mb-2 preset-card"
      style={{ cursor: 'pointer' }}
      onClick={() => handleApplyPreset(preset)}
    >
      <Card.Body className="py-2 px-3">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h6 className="mb-1">
              {preset.name}
              {showCategory && (
                <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.7em' }}>
                  {preset.category}
                </Badge>
              )}
            </h6>
            <small className="text-muted d-block">{preset.description}</small>
            <div className="mt-1">
              <Badge bg="primary" className="me-1">
                {preset.params.motorPower}kW
              </Badge>
              <Badge bg="info" className="me-1">
                {preset.params.motorSpeed}rpm
              </Badge>
              <Badge bg="success">
                i={preset.params.targetRatio}
              </Badge>
            </div>
          </div>
          <div className="text-end">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  推荐型号: {preset.typicalModels.join(', ')}
                </Tooltip>
              }
            >
              <small className="text-muted" style={{ fontSize: '0.75em' }}>
                {preset.recommendedSeries.join('/')}系列
              </small>
            </OverlayTrigger>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <Card className="quick-selection-panel mb-3">
      <Card.Header className="d-flex justify-content-between align-items-center py-2">
        <span>
          <i className="bi bi-lightning-charge-fill me-2 text-warning"></i>
          快速选型
        </span>
        <Form.Control
          type="text"
          size="sm"
          placeholder="搜索预设..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: '150px' }}
        />
      </Card.Header>
      <Card.Body className="py-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
        {/* 搜索结果 */}
        {searchText && (
          <div className="mb-3">
            <h6 className="text-muted mb-2">
              搜索结果 ({searchResults.length})
            </h6>
            {searchResults.length > 0 ? (
              searchResults.map(preset => renderPresetCard(preset, true))
            ) : (
              <p className="text-muted small">未找到匹配的预设</p>
            )}
          </div>
        )}

        {/* 智能推荐 */}
        {!searchText && currentParams.motorPower && recommendedPresets.length > 0 && (
          <div className="mb-3">
            <div
              className="d-flex justify-content-between align-items-center mb-2"
              style={{ cursor: 'pointer' }}
              onClick={() => setShowRecommended(!showRecommended)}
            >
              <h6 className="text-muted mb-0">
                <i className={`bi bi-chevron-${showRecommended ? 'down' : 'right'} me-1`}></i>
                智能推荐 (基于 {currentParams.motorPower}kW)
              </h6>
              <Badge bg="warning" text="dark">{recommendedPresets.length}</Badge>
            </div>
            <Collapse in={showRecommended}>
              <div>
                {recommendedPresets.slice(0, 3).map(preset => renderPresetCard(preset, true))}
              </div>
            </Collapse>
          </div>
        )}

        {/* 分类列表 */}
        {!searchText && (
          <div>
            {categories.map(category => (
              <div key={category.key} className="mb-2">
                <div
                  className="d-flex justify-content-between align-items-center py-2 px-2 bg-light rounded"
                  style={{ cursor: 'pointer' }}
                  onClick={() => toggleCategory(category.key)}
                >
                  <span>
                    <span className="me-2">{category.icon}</span>
                    <strong>{category.category}</strong>
                  </span>
                  <div>
                    <Badge bg="secondary" className="me-2">{category.presetCount}</Badge>
                    <i className={`bi bi-chevron-${expandedCategory === category.key ? 'down' : 'right'}`}></i>
                  </div>
                </div>
                <Collapse in={expandedCategory === category.key}>
                  <div className="mt-2">
                    {getPresetsForCategory(category.key).map(preset => renderPresetCard(preset))}
                  </div>
                </Collapse>
              </div>
            ))}
          </div>
        )}
      </Card.Body>
      <Card.Footer className="py-1 text-center">
        <small className="text-muted">
          点击预设卡片快速填充参数
        </small>
      </Card.Footer>
    </Card>
  );
};

export default QuickSelectionPanel;
