// src/components/EnhancedSelectionForm/QuickByVesselType.js
// B3: 按船型快速选型 — 选 Capesize 散货船 → 自动填 18000kW/95rpm/4.7:1 + 推荐主机
//
// 接入方式: 在 EnhancedSelectionForm 顶部加一行 import + 在合适位置渲染本组件
// 用户选择船型后, 调用 onApply(defaults) 把 motorPower/motorSpeed/targetRatio 等回填到主表单

import React, { useMemo, useState } from 'react';
import { Card, Form, Row, Col, Button, Badge, Alert, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import {
  listByCategory,
  toSelectionFormDefaults,
  getVesselDatabaseStats,
  vesselCategories
} from '../../utils/vesselTypeUtils';
import { standardVesselTypesByCategory } from '../../data/standardVesselTypes';

const HelpTip = ({ text }) => (
  <OverlayTrigger placement="top" overlay={<Tooltip>{text}</Tooltip>}>
    <i className="bi bi-info-circle ms-1" style={{ cursor: 'pointer', color: '#6c757d', fontSize: '0.85em' }}></i>
  </OverlayTrigger>
);

const CategoryLabels = {
  bulker: '散货船',
  container: '集装箱船',
  tanker: '油轮',
  gasCarrier: '气体运输船',
  chemical: '化学品船',
  roPax: '客滚船',
  tug: '拖轮',
  AHTS: 'AHTS 工作船',
  PSV: '平台补给船',
  workboat: '工程船',
  fishing: '渔船'
};

const QuickByVesselType = ({ colors = {}, onApply }) => {
  const stats = useMemo(() => getVesselDatabaseStats(), []);
  const [category, setCategory] = useState(vesselCategories[0] || 'bulker');
  const [selectedType, setSelectedType] = useState(null);

  const inputStyle = {
    backgroundColor: colors.inputBg || '#fff',
    color: colors.text || '#212529',
    borderColor: colors.inputBorder || '#ced4da'
  };

  const variants = useMemo(() => listByCategory(category), [category]);

  const previewDefaults = useMemo(() => {
    return selectedType ? toSelectionFormDefaults(selectedType) : null;
  }, [selectedType]);

  const handleApply = () => {
    if (!previewDefaults || !onApply) return;
    onApply(previewDefaults);
  };

  return (
    <Card className="mb-3" style={{ backgroundColor: colors.card || '#fff', borderColor: colors.border || '#dee2e6' }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#fff8e6', color: colors.headerText || '#876200' }}>
        <strong>
          <i className="bi bi-rocket-takeoff me-2"></i>
          按船型快速选型 (Quick by Vessel Type)
          <HelpTip text="选定船型后自动带入功率/转速/速比/桨参数等典型值, 适合早期可研估算" />
        </strong>
        <Badge bg="secondary" className="ms-2" style={{ fontSize: '0.7em' }}>{stats.total} 类船型</Badge>
      </Card.Header>
      <Card.Body>
        <Row className="g-2 mb-2">
          <Col md={4}>
            <Form.Label>船型分类</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => { setCategory(e.target.value); setSelectedType(null); }}
              style={inputStyle}
              aria-label="船型分类"
            >
              {vesselCategories.map(c => (
                <option key={c} value={c}>
                  {CategoryLabels[c] || c} ({stats.byCategory[c] || 0})
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={5}>
            <Form.Label>具体船型尺度</Form.Label>
            <Form.Select
              value={selectedType || ''}
              onChange={(e) => setSelectedType(e.target.value || null)}
              style={inputStyle}
              aria-label="船型尺度"
            >
              <option value="">请选择...</option>
              {variants.map(v => (
                <option key={v.type} value={v.type}>
                  {v.nameZh} ({v.nameEn})
                </option>
              ))}
            </Form.Select>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button variant="warning" onClick={handleApply} disabled={!previewDefaults || !onApply}>
              <i className="bi bi-arrow-down-circle me-1"></i>
              带入主表单
            </Button>
          </Col>
        </Row>

        {previewDefaults && (
          <div className="mt-3">
            <Alert variant="light" className="py-2 px-3" style={{ fontSize: '0.88em' }}>
              <strong>{previewDefaults.nameZh}</strong> · {previewDefaults.nameEn}
            </Alert>
            <Table size="sm" bordered className="mb-2" style={{ fontSize: '0.88em' }}>
              <tbody>
                <tr>
                  <td><strong>主机功率 (中位)</strong></td>
                  <td>{previewDefaults.motorPower} kW</td>
                  <td><strong>主机转速 (估算)</strong></td>
                  <td>{previewDefaults.motorSpeed} rpm</td>
                </tr>
                <tr>
                  <td><strong>典型减速比</strong></td>
                  <td>{previewDefaults.targetRatio}</td>
                  <td><strong>桨转速</strong></td>
                  <td>{previewDefaults.propellerSpeed_rpm ?? '—'} rpm</td>
                </tr>
                <tr>
                  <td><strong>桨型</strong></td>
                  <td>{previewDefaults.propellerType ?? '—'} × {previewDefaults.propellerCount ?? '—'}</td>
                  <td><strong>桨直径</strong></td>
                  <td>{previewDefaults.propellerDiameter_m ?? '—'} m</td>
                </tr>
                <tr>
                  <td><strong>设计航速</strong></td>
                  <td>{previewDefaults.designSpeed_kn} 节</td>
                  <td><strong>排水量 (典型)</strong></td>
                  <td>{previewDefaults.displacement_t?.toLocaleString?.()} t</td>
                </tr>
              </tbody>
            </Table>
            {previewDefaults.suggestedEngines.length > 0 && (
              <div style={{ fontSize: '0.85em' }}>
                <strong>常见配置:</strong>
                <ul className="mb-1 mt-1" style={{ paddingLeft: '1.2em' }}>
                  {previewDefaults.suggestedEngines.map((eng, i) => (
                    <li key={i}>
                      {eng}
                      {previewDefaults.suggestedGearboxes[i] && (
                        <span className="text-muted"> + {previewDefaults.suggestedGearboxes[i]}</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="mt-2 text-muted" style={{ fontSize: '0.75em' }}>
              数据源: Significant Ships (RINA) + IHS Sea-web 公开样本; 仅作早期估算, 实际工程需详细计算
            </div>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default QuickByVesselType;
