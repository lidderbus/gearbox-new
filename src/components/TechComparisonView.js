// src/components/TechComparisonView.js
// 技术参数对照表：多型号横向对比，支持导出、价格、配套、高亮最优值
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup } from 'react-bootstrap';
import { getRecommendedPump, getRecommendedCouplingInfo } from '../data/gearboxMatchingMaps';
import { calculateFactoryPrice, getStandardDiscountRate } from '../utils/priceManager';

let embeddedData = [];
try {
  const raw = require('../data/embeddedData').embeddedGearboxData || {};
  Object.keys(raw).forEach(k => { if (Array.isArray(raw[k])) embeddedData = embeddedData.concat(raw[k]); });
} catch(e) {}

function getSeries(model) {
  if (!model) return '';
  const m = model.toUpperCase();
  for (const s of ['HCD', 'HCA', 'HCM', 'HCQ', 'HCV', 'HCX', 'GWC', 'SGW', 'HC', 'GW', 'GC', 'MV', 'DT']) {
    if (m.startsWith(s)) return s;
  }
  return '';
}

function extractFields(item) {
  const model = item.model || item.name || '';
  const ratios = Array.isArray(item.ratios) ? item.ratios.filter(v => typeof v === 'number') : [];
  const caps = Array.isArray(item.transferCapacity) ? item.transferCapacity.filter(v => typeof v === 'number') : [];
  const minSpeed = item.inputSpeedRange ? item.inputSpeedRange[0] : null;
  const maxSpeed = item.inputSpeedRange ? item.inputSpeedRange[1] : null;

  const price = item.price || 0;
  const discountRate = item.discountRate ?? getStandardDiscountRate(model);
  const factoryPrice = price > 0 ? calculateFactoryPrice({ model, basePrice: price, discountRate }) : 0;

  const pump = getRecommendedPump(model);
  const coupling = getRecommendedCouplingInfo(model);

  return {
    model,
    series: getSeries(model),
    ratioRange: ratios.length ? `${Math.min(...ratios)} ~ ${Math.max(...ratios)}` : '—',
    ratioCount: ratios.length || 0,
    capacityRange: caps.length ? `${Math.min(...caps)} ~ ${Math.max(...caps)}` : '—',
    capacityMax: caps.length ? Math.max(...caps) : 0,
    speedRange: minSpeed && maxSpeed ? `${minSpeed} ~ ${maxSpeed}` : '—',
    thrust: item.thrust || '—',
    thrustNum: item.thrust || 0,
    centerDistance: item.centerDistance || '—',
    weight: item.weight || item.dryWeight || '—',
    weightNum: item.weight || item.dryWeight || 0,
    factoryPrice,
    priceFmt: factoryPrice > 0 ? `¥${factoryPrice.toLocaleString()}` : '询价',
    pump: pump?.model || pump?.pump || '—',
    coupling: coupling?.model || coupling?.coupling || '—',
  };
}

const COMPARE_FIELDS = [
  { key: 'series', label: '系列', type: 'text' },
  { key: 'ratioRange', label: '减速比范围', type: 'text' },
  { key: 'ratioCount', label: '减速比个数', type: 'num', best: 'max' },
  { key: 'capacityRange', label: '传递能力(kW/rpm)', type: 'text' },
  { key: 'speedRange', label: '输入转速(rpm)', type: 'text' },
  { key: 'thrust', label: '推力(kN)', type: 'num', numKey: 'thrustNum', best: 'max' },
  { key: 'centerDistance', label: '中心距(mm)', type: 'text' },
  { key: 'weight', label: '重量(kg)', type: 'num', numKey: 'weightNum', best: 'min' },
  { key: 'priceFmt', label: '出厂价', type: 'num', numKey: 'factoryPrice', best: 'min' },
  { key: 'coupling', label: '推荐联轴器', type: 'text' },
  { key: 'pump', label: '推荐备用泵', type: 'text' },
];

export default function TechComparisonView({ colors, theme }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([]);
  const [showSearch, setShowSearch] = useState(true);

  const allModels = useMemo(() => embeddedData.map(extractFields).filter(m => m.model), []);

  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    const q = searchTerm.trim().toUpperCase();
    return allModels.filter(m => m.model.toUpperCase().includes(q)).slice(0, 20);
  }, [allModels, searchTerm]);

  const addModel = useCallback((model) => {
    if (selected.length >= 6 || selected.find(s => s.model === model.model)) return;
    setSelected(prev => [...prev, model]);
  }, [selected]);

  const removeModel = useCallback((modelName) => {
    setSelected(prev => prev.filter(s => s.model !== modelName));
  }, []);

  // 找出每行最优值
  const bestValues = useMemo(() => {
    if (selected.length < 2) return {};
    const bests = {};
    COMPARE_FIELDS.forEach(f => {
      if (f.best && f.numKey) {
        const vals = selected.map(s => s[f.numKey]).filter(v => v > 0);
        if (vals.length > 0) {
          bests[f.key] = f.best === 'max' ? Math.max(...vals) : Math.min(...vals);
        }
      }
    });
    return bests;
  }, [selected]);

  const handleExportCSV = useCallback(() => {
    if (selected.length === 0) return;
    const headers = ['参数', ...selected.map(s => s.model)];
    const rows = COMPARE_FIELDS.map(f => [f.label, ...selected.map(s => s[f.key])]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `参数对比_${selected.map(s => s.model).join('_')}.csv`;
    link.click();
  }, [selected]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-table me-2"></i>技术参数对照表</h5>
          <small className="text-muted">选择多个型号进行参数横向对比，含价格和配套设备（最多6个）</small>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="搜索型号添加到对比..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} onFocus={() => setShowSearch(true)} />
          </InputGroup>
          {showSearch && searchResults.length > 0 && (
            <Card className="position-absolute shadow" style={{ zIndex: 1000, maxHeight: 200, overflowY: 'auto', width: '45%' }}>
              <Card.Body className="p-0">
                {searchResults.map(m => (
                  <div key={m.model} className="px-3 py-1 border-bottom d-flex justify-content-between align-items-center" style={{ cursor: 'pointer' }}
                    onClick={() => { addModel(m); setSearchTerm(''); }}>
                    <span>{m.model} <small className="text-muted">({m.series})</small></span>
                    {selected.find(s => s.model === m.model) ? <Badge bg="success">已添加</Badge> : <i className="bi bi-plus-circle text-primary"></i>}
                  </div>
                ))}
              </Card.Body>
            </Card>
          )}
        </Col>
        <Col md={6} className="d-flex gap-2 align-items-start flex-wrap">
          {selected.map(s => (
            <Badge key={s.model} bg="primary" className="d-flex align-items-center gap-1 py-2 px-2">
              {s.model}<i className="bi bi-x-circle ms-1" style={{ cursor: 'pointer' }} onClick={() => removeModel(s.model)}></i>
            </Badge>
          ))}
          {selected.length > 0 && <Button size="sm" variant="outline-danger" onClick={() => setSelected([])}>清空</Button>}
        </Col>
      </Row>

      {selected.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <i className="bi bi-table" style={{ fontSize: '2rem' }}></i>
          <p className="mt-2 mb-0">请搜索并添加型号到对比表（最多6个），含价格、配套推荐、最优值高亮</p>
        </Alert>
      ) : (
        <Card>
          <Card.Header className="d-flex justify-content-between align-items-center">
            <span>参数对比 ({selected.length} 个型号)</span>
            <Button size="sm" variant="outline-success" onClick={handleExportCSV}><i className="bi bi-download me-1"></i>导出CSV</Button>
          </Card.Header>
          <Card.Body className="p-0" style={{ overflowX: 'auto' }}>
            <Table bordered hover className="mb-0">
              <thead>
                <tr>
                  <th style={{ width: 160, position: 'sticky', left: 0, background: '#f8f9fa', zIndex: 1 }}>参数</th>
                  {selected.map(s => (
                    <th key={s.model} className="text-center" style={{ minWidth: 130 }}>
                      {s.model}
                      <i className="bi bi-x-circle ms-2 text-danger" style={{ cursor: 'pointer', fontSize: '0.75rem' }} onClick={() => removeModel(s.model)}></i>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_FIELDS.map(f => (
                  <tr key={f.key}>
                    <td style={{ position: 'sticky', left: 0, background: '#fff', zIndex: 1 }}><strong>{f.label}</strong></td>
                    {selected.map(s => {
                      const isBest = f.numKey && bestValues[f.key] != null && s[f.numKey] > 0 && s[f.numKey] === bestValues[f.key];
                      return (
                        <td key={s.model} className={`text-center ${isBest ? 'table-success fw-bold' : ''}`}>
                          {s[f.key]}
                          {isBest && <i className="bi bi-trophy-fill text-success ms-1" style={{ fontSize: '0.7rem' }}></i>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}
