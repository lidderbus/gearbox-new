// src/components/EnhancedSelectionForm/EngineInfoSection.js
// 主机信息区块组件 — B1 接入多品牌柴油机库智能选择 (2026-05-02)

import React, { useMemo, useState } from 'react';
import { Card, Form, Row, Col, OverlayTrigger, Tooltip, Badge } from 'react-bootstrap';
import { FORM_OPTIONS } from './useEnhancedSelectionForm';
import {
  searchEngines,
  toFormFields,
  getEngineById
} from '../../utils/engineDatabaseUtils';
import { marineEngines } from '../../data/marineEngineDatabase';

const HelpTip = ({ text }) => (
  <OverlayTrigger placement="top" overlay={<Tooltip>{text}</Tooltip>}>
    <i className="bi bi-info-circle ms-1" style={{ cursor: 'pointer', color: '#6c757d', fontSize: '0.85em' }}></i>
  </OverlayTrigger>
);

// 把 datalist option 文本反向解析为 engineId, 因为 datalist 选中只回传 value 文本
const buildOptionLabel = (e) => `${e.brand} ${e.model} · ${e.ratedPower_kW}kW @ ${e.ratedSpeed_rpm}rpm`;
const optionToId = (text) => {
  if (!text) return null;
  const match = marineEngines.find(e => buildOptionLabel(e) === text);
  return match ? match.id : null;
};

const TierBadgeColor = {
  IMO_Tier_III: 'success',
  IMO_Tier_II: 'primary',
  IMO_Tier_I: 'secondary',
  CCNR_II: 'info',
  EU_Stage_V: 'success'
};

/**
 * 主机信息区块
 * 包含: 主机品牌、主机型号、飞轮型号、输入转向
 */
const EngineInfoSection = ({
  formData,
  errors,
  updateField,
  colors = {},
  theme = 'light'
}) => {
  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  // 智能选择 datalist — B1
  const [quickSearchInput, setQuickSearchInput] = useState('');
  const datalistOptions = useMemo(() => {
    const results = searchEngines(quickSearchInput, { maxResults: 30 });
    return results.map(e => ({
      id: e.id,
      label: buildOptionLabel(e),
      tier: e.emissionTier,
      confidence: e.confidence
    }));
  }, [quickSearchInput]);

  const handleQuickSelect = (text) => {
    setQuickSearchInput(text);
    const id = optionToId(text);
    if (!id) return;
    const engine = getEngineById(id);
    if (!engine) return;
    const fields = toFormFields(engine);
    Object.keys(fields).forEach((key) => {
      if (fields[key] !== undefined && fields[key] !== null) {
        updateField(key, fields[key]);
      }
    });
  };

  const selectedEngine = useMemo(() => getEngineById(formData.engineId), [formData.engineId]);

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa', color: colors.headerText || '#212529' }}>
        <strong>主机信息</strong>
      </Card.Header>
      <Card.Body>
        {/* B1: 多品牌柴油机库智能选择 — 选中后自动填充功率/转速/扭矩等 */}
        <Row className="mb-3 pb-2" style={{ borderBottom: `1px dashed ${colors.border || '#dee2e6'}` }}>
          <Col md={12}>
            <Form.Label className="fw-bold text-success">
              <i className="bi bi-lightning-charge me-1"></i>
              智能型号选择 (按品牌/型号关键字)
              <HelpTip text="选中柴油机后自动填充功率/转速/扭矩/排放等级。数据来源: 厂商 Project Guide + 船级社公开 EIAPP" />
            </Form.Label>
          </Col>
          <Col md={9}>
            <Form.Control
              type="text"
              list="engine-quick-options"
              value={quickSearchInput}
              onChange={(e) => handleQuickSelect(e.target.value)}
              placeholder="输入关键字: MAN / Wartsila / 6L20 / 潍柴 ..."
              style={inputStyle}
              aria-label="智能型号选择"
            />
            <datalist id="engine-quick-options">
              {datalistOptions.map(opt => (
                <option key={opt.id} value={opt.label} />
              ))}
            </datalist>
            <Form.Text className="text-muted">
              库内 {marineEngines.length} 型号 · 选中后下方品牌/型号/功率/转速会自动填充
            </Form.Text>
          </Col>
          <Col md={3}>
            {selectedEngine && (
              <div style={{ fontSize: '0.85em' }}>
                <Badge bg={TierBadgeColor[selectedEngine.emissionTier] || 'secondary'} className="me-1">
                  {selectedEngine.emissionTier?.replace('IMO_', '') || ''}
                </Badge>
                <Badge bg={selectedEngine.confidence === 'A' ? 'success' : 'warning'}>
                  数据 {selectedEngine.confidence}
                </Badge>
                {selectedEngine.eiapp?.issuer && (
                  <div className="mt-1 text-muted">
                    EIAPP: {selectedEngine.eiapp.issuer}
                  </div>
                )}
              </div>
            )}
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>主机品牌 <HelpTip text="发动机制造商。选择品牌后可自动匹配常用型号和飞轮规格，便于生成技术协议" /></Form.Label>
              <Form.Select
                value={formData.engineBrand || '潍柴'}
                onChange={(e) => updateField('engineBrand', e.target.value)}
                style={inputStyle}
              >
                {FORM_OPTIONS.engineBrand.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>主机型号</Form.Label>
              <Form.Control
                type="text"
                value={formData.engineModel || ''}
                onChange={(e) => updateField('engineModel', e.target.value)}
                placeholder="例如: WP10.270E41"
                style={inputStyle}
              />
              <Form.Text className="text-muted">
                完整主机型号便于技术协议生成
              </Form.Text>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>飞轮型号 (手动输入) <HelpTip text="SAE飞轮壳标准号(如SAE14/SAE11.5)。决定齿轮箱输入接口尺寸，需与发动机飞轮壳匹配" /></Form.Label>
              <Form.Control
                type="text"
                value={formData.flywheelSpec || ''}
                onChange={(e) => updateField('flywheelSpec', e.target.value)}
                placeholder="例如: SAE14"
                style={inputStyle}
              />
              <Form.Text className="text-muted">
                用于技术协议生成
              </Form.Text>
            </Form.Group>
          </Col>

          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>输入转向 (面向飞轮)</Form.Label>
              <Form.Select
                value={formData.engineRotation || '无要求'}
                onChange={(e) => updateField('engineRotation', e.target.value)}
                style={inputStyle}
              >
                {FORM_OPTIONS.engineRotation.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* 接口筛选 - 新增 */}
        <Row className="mt-2 pt-2" style={{ borderTop: `1px dashed ${colors.border || '#dee2e6'}` }}>
          <Col md={12}>
            <Form.Label className="fw-bold text-primary">
              <i className="bi bi-plug me-1"></i>
              主机接口筛选 (可选)
            </Form.Label>
            <Form.Text className="d-block text-muted mb-2">
              选择主机接口规格，系统将筛选出支持该接口的齿轮箱
            </Form.Text>
          </Col>
          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>接口类型</Form.Label>
              <Form.Select
                value={formData.interfaceType || '无要求'}
                onChange={(e) => {
                  updateField('interfaceType', e.target.value);
                  updateField('interfaceSpec', ''); // 切换类型时清空规格
                }}
                style={inputStyle}
              >
                {FORM_OPTIONS.interfaceType.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>接口规格</Form.Label>
              <Form.Select
                value={formData.interfaceSpec || ''}
                onChange={(e) => updateField('interfaceSpec', e.target.value)}
                style={inputStyle}
                disabled={!formData.interfaceType || formData.interfaceType === '无要求'}
              >
                <option value="">请选择规格</option>
                {formData.interfaceType === 'sae' && FORM_OPTIONS.saeInterfaces.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
                {formData.interfaceType === 'domestic' && FORM_OPTIONS.domesticInterfaces.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Form.Select>
              {formData.interfaceType === '无要求' && (
                <Form.Text className="text-muted">先选择接口类型</Form.Text>
              )}
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group className="mb-3">
              <Form.Label>筛选模式</Form.Label>
              <Form.Select
                value={formData.interfaceFilterMode || 'prefer'}
                onChange={(e) => updateField('interfaceFilterMode', e.target.value)}
                style={inputStyle}
                disabled={!formData.interfaceSpec}
              >
                <option value="prefer">优先显示 (匹配的排前面)</option>
                <option value="strict">严格筛选 (只显示匹配的)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default EngineInfoSection;
