// src/components/ReverseSelectionView.js
// 反向选型：根据已知齿轮箱型号，反查适配参数（功率、转速、减速比范围、适配主机推荐）
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup, ListGroup, Collapse } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getRecommendedPump, getRecommendedCouplingInfo } from '../data/gearboxMatchingMaps';
import { calculateFactoryPrice, getStandardDiscountRate } from '../utils/priceManager';
import { resolveModelAlias } from '../utils/modelAliasResolver';
import { printHtmlContent } from '../utils/pdfExportUtils';
import ExportToolbar from './ExportToolbar';

// 合并 embeddedGearboxData 各系列数组
let embeddedData = [];
try {
  const raw = require('../data/embeddedData').embeddedGearboxData || {};
  Object.keys(raw).forEach(k => { if (Array.isArray(raw[k])) embeddedData = embeddedData.concat(raw[k]); });
} catch(e) {}

const SERIES_INFO = {
  HC: { label: 'HC系列', color: 'primary', desc: '中速齿轮箱', hasClutch: false },
  HCD: { label: 'HCD系列', color: 'info', desc: '带离合器', hasClutch: true },
  HCA: { label: 'HCA系列', color: 'success', desc: '带PTO', hasClutch: false },
  GW: { label: 'GW系列', color: 'warning', desc: '高速渔用齿轮箱', hasClutch: true },
  GWC: { label: 'GWC系列', color: 'warning', desc: 'GW标准型', hasClutch: true },
  GC: { label: 'GC系列', color: 'danger', desc: 'CPP齿轮箱', hasClutch: false },
  MV: { label: 'MV系列', color: 'secondary', desc: '舵桨齿轮箱', hasClutch: false },
  HCM: { label: 'HCM系列', color: 'dark', desc: '轻型高速', hasClutch: false },
  DT: { label: 'DT系列', color: 'dark', desc: '直通型', hasClutch: false },
  SGW: { label: 'SGW系列', color: 'warning', desc: '特殊GW型', hasClutch: true },
  HCQ: { label: 'HCQ系列', color: 'info', desc: '轻型船用', hasClutch: false },
  HCV: { label: 'HCV系列', color: 'secondary', desc: '立式', hasClutch: false },
  HCX: { label: 'HCX系列', color: 'secondary', desc: 'HCX特种', hasClutch: false },
};

function getSeries(model) {
  if (!model) return 'OTHER';
  const m = model.toUpperCase();
  for (const s of ['HCD', 'HCA', 'HCM', 'HCQ', 'HCV', 'HCX', 'GWC', 'SGW', 'HC', 'GW', 'GC', 'MV', 'DT']) {
    if (m.startsWith(s)) return s;
  }
  return 'OTHER';
}

function parseItem(item) {
  const model = item.model || item.name || '';
  const ratios = Array.isArray(item.ratios) ? item.ratios : [];
  const caps = Array.isArray(item.transferCapacity) ? item.transferCapacity : [];
  const ratioValues = ratios.filter(v => typeof v === 'number' && !isNaN(v));
  const capValues = caps.filter(v => typeof v === 'number' && !isNaN(v));
  const minSpeed = item.inputSpeedRange ? item.inputSpeedRange[0] : null;
  const maxSpeed = item.inputSpeedRange ? item.inputSpeedRange[1] : null;

  // 计算各减速比下的适配功率范围 (kW): capacity * speed
  const powerRanges = ratioValues.map((r, i) => {
    const cap = capValues[i] || 0;
    return {
      ratio: r,
      capacity: cap,
      powerAtMinSpeed: minSpeed ? Math.round(cap * minSpeed) : null,
      powerAtMaxSpeed: maxSpeed ? Math.round(cap * maxSpeed) : null,
    };
  });

  return {
    model,
    series: getSeries(model),
    ratioMin: ratioValues.length ? Math.min(...ratioValues) : null,
    ratioMax: ratioValues.length ? Math.max(...ratioValues) : null,
    ratioCount: ratioValues.length,
    capacityMin: capValues.length ? Math.min(...capValues) : null,
    capacityMax: capValues.length ? Math.max(...capValues) : null,
    minSpeed, maxSpeed,
    thrust: item.thrust || null,
    centerDistance: item.centerDistance || null,
    weight: item.weight || item.dryWeight || null,
    price: item.price || null,
    discountRate: item.discountRate,
    powerRanges,
    raw: item,
  };
}

export default function ReverseSelectionView({ colors, theme }) {
  const [searchModel, setSearchModel] = useState('');
  const [filterSeries, setFilterSeries] = useState('all');
  const [selectedModel, setSelectedModel] = useState(null);
  const [verifyOpen, setVerifyOpen] = useState(false);
  const [verifyPower, setVerifyPower] = useState('');
  const [verifySpeed, setVerifySpeed] = useState('');

  const allModels = useMemo(() => embeddedData.map(parseItem).filter(g => g.model), []);

  const filteredModels = useMemo(() => {
    let list = allModels;
    if (filterSeries !== 'all') list = list.filter(m => m.series === filterSeries);
    if (searchModel.trim()) {
      const q = searchModel.trim().toUpperCase();
      list = list.filter(m => m.model.toUpperCase().includes(q));
    }
    return list;
  }, [allModels, filterSeries, searchModel]);

  // 别名解析
  const aliasResult = useMemo(() => {
    if (!searchModel.trim() || filteredModels.length > 0) return null;
    return resolveModelAlias(searchModel.trim(), allModels);
  }, [searchModel, filteredModels.length, allModels]);

  // 选型验证计算
  const verifyResult = useMemo(() => {
    if (!selectedModel || !verifyPower || !verifySpeed) return null;
    const power = parseFloat(verifyPower);
    const speed = parseFloat(verifySpeed);
    if (!power || !speed || power <= 0 || speed <= 0) return null;
    const required = power / speed;
    const speedOk = selectedModel.minSpeed && selectedModel.maxSpeed
      ? (speed >= selectedModel.minSpeed && speed <= selectedModel.maxSpeed) : null;
    const ratioResults = selectedModel.powerRanges.map(pr => {
      const margin = pr.capacity > 0 ? ((pr.capacity - required) / required) * 100 : null;
      let status = 'unknown';
      if (margin !== null) {
        if (margin < 0) status = 'fail';
        else if (margin < 5) status = 'danger';
        else if (margin <= 20) status = 'ideal';
        else if (margin <= 50) status = 'ok';
        else status = 'oversized';
      }
      return { ...pr, margin, status, outputSpeed: speed / pr.ratio };
    });
    const best = ratioResults.reduce((b, r) =>
      (r.margin !== null && r.margin >= 0 && (b === null || Math.abs(r.margin - 15) < Math.abs(b.margin - 15))) ? r : b, null);
    const allFail = ratioResults.every(r => r.status === 'fail');
    // 自动推荐（验证失败时）
    let suggestions = [];
    if (allFail) {
      const series = selectedModel.series;
      suggestions = allModels
        .filter(m => m.series === series && m.capacityMax >= required && m.minSpeed <= speed && m.maxSpeed >= speed)
        .map(m => ({ model: m.model, cap: m.capacityMax, margin: ((m.capacityMax - required) / required * 100).toFixed(1) }))
        .sort((a, b) => Math.abs(a.margin - 15) - Math.abs(b.margin - 15))
        .slice(0, 3);
    }
    return { required, speedOk, ratioResults, best, allFail, suggestions, power, speed };
  }, [selectedModel, verifyPower, verifySpeed, allModels]);

  const seriesCounts = useMemo(() => {
    const counts = {};
    allModels.forEach(m => { counts[m.series] = (counts[m.series] || 0) + 1; });
    return counts;
  }, [allModels]);

  const detail = selectedModel;

  // 配套信息
  const pumpInfo = useMemo(() => detail ? getRecommendedPump(detail.model) : null, [detail]);
  const couplingInfo = useMemo(() => detail ? getRecommendedCouplingInfo(detail.model) : null, [detail]);
  const factoryPrice = useMemo(() => {
    if (!detail?.price) return null;
    return calculateFactoryPrice({ model: detail.model, basePrice: detail.price, discountRate: detail.discountRate ?? getStandardDiscountRate(detail.model) });
  }, [detail]);

  // Export data for ExportToolbar
  const getExportData = useCallback(() => {
    const headers = ['型号', '系列', '减速比范围', '减速比数量', '传递能力范围(kW/rpm)', '转速范围(rpm)', '推力(kN)', '重量(kg)'];
    const rows = filteredModels.map(m => [
      m.model, m.series,
      m.ratioMin != null ? (m.ratioMin === m.ratioMax ? String(m.ratioMin) : `${m.ratioMin}~${m.ratioMax}`) : '',
      m.ratioCount,
      m.capacityMin != null ? (m.capacityMin === m.capacityMax ? String(m.capacityMax) : `${m.capacityMin}~${m.capacityMax}`) : '',
      m.minSpeed && m.maxSpeed ? `${m.minSpeed}~${m.maxSpeed}` : '',
      m.thrust || '', m.weight || '',
    ]);
    return {
      filename: `反向选型_型号列表_${new Date().toISOString().slice(0, 10)}`,
      title: '反向选型 — 型号参数列表',
      headers,
      rows,
    };
  }, [filteredModels]);

  // 功率包络图数据
  const powerEnvelopeData = useMemo(() => {
    if (!detail || !detail.powerRanges.length) return [];
    return detail.powerRanges.map(pr => ({
      ratio: String(pr.ratio),
      minPower: pr.powerAtMinSpeed || 0,
      maxPower: pr.powerAtMaxSpeed || 0,
      capacity: pr.capacity,
    }));
  }, [detail]);

  // 用户验证参考功率值 (用于图表参考线)
  const verifyPowerNum = verifyPower ? parseFloat(verifyPower) : null;

  // 导出验证报告
  const handleExportReport = useCallback(() => {
    if (!detail || !verifyResult) return;
    const statusMap = { fail: '不足', danger: '偏紧', ideal: '理想', ok: '偏大', oversized: '过大' };
    const statusColorMap = { fail: '#dc3545', danger: '#ffc107', ideal: '#198754', ok: '#0dcaf0', oversized: '#6c757d' };
    const overallStatus = verifyResult.allFail ? '不通过' : (verifyResult.best?.status === 'ideal' ? '通过' : '有条件通过');
    const overallColor = verifyResult.allFail ? '#dc3545' : (verifyResult.best?.status === 'ideal' ? '#198754' : '#ffc107');

    const html = `
      <div style="font-family: 'Microsoft YaHei', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto;">
        <h2 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">反向选型验证报告</h2>
        <p style="text-align: center; color: #666; font-size: 13px;">生成时间: ${new Date().toLocaleString('zh-CN')}</p>

        <h3 style="margin-top: 20px;">一、齿轮箱信息</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="border: 1px solid #ddd; padding: 6px 10px; width: 30%; background: #f8f9fa;">型号</td><td style="border: 1px solid #ddd; padding: 6px 10px;"><strong>${detail.model}</strong></td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 6px 10px; background: #f8f9fa;">系列</td><td style="border: 1px solid #ddd; padding: 6px 10px;">${SERIES_INFO[detail.series]?.label || detail.series} (${SERIES_INFO[detail.series]?.desc || ''})</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 6px 10px; background: #f8f9fa;">输入转速范围</td><td style="border: 1px solid #ddd; padding: 6px 10px;">${detail.minSpeed} ~ ${detail.maxSpeed} rpm</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 6px 10px; background: #f8f9fa;">推力</td><td style="border: 1px solid #ddd; padding: 6px 10px;">${detail.thrust ? detail.thrust + ' kN' : '—'}</td></tr>
          ${factoryPrice > 0 ? `<tr><td style="border: 1px solid #ddd; padding: 6px 10px; background: #f8f9fa;">出厂价</td><td style="border: 1px solid #ddd; padding: 6px 10px;">¥${factoryPrice.toLocaleString()}</td></tr>` : ''}
        </table>

        <h3>二、验证参数</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
          <tr><td style="border: 1px solid #ddd; padding: 6px 10px; width: 30%; background: #f8f9fa;">输入功率</td><td style="border: 1px solid #ddd; padding: 6px 10px;">${verifyResult.power} kW</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 6px 10px; background: #f8f9fa;">输入转速</td><td style="border: 1px solid #ddd; padding: 6px 10px;">${verifyResult.speed} rpm ${verifyResult.speedOk === false ? '<span style="color: #dc3545;">(超出范围!)</span>' : verifyResult.speedOk === true ? '<span style="color: #198754;">(在范围内)</span>' : ''}</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 6px 10px; background: #f8f9fa;">所需传递能力</td><td style="border: 1px solid #ddd; padding: 6px 10px;">${verifyResult.required.toFixed(4)} kW/rpm</td></tr>
          <tr><td style="border: 1px solid #ddd; padding: 6px 10px; background: #f8f9fa;">综合判定</td><td style="border: 1px solid #ddd; padding: 6px 10px;"><strong style="color: ${overallColor}; font-size: 16px;">${overallStatus}</strong></td></tr>
        </table>

        <h3>三、各减速比验证明细</h3>
        <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px; font-size: 13px;">
          <thead>
            <tr style="background: #f8f9fa;"><th style="border: 1px solid #ddd; padding: 6px;">减速比</th><th style="border: 1px solid #ddd; padding: 6px;">传递能力</th><th style="border: 1px solid #ddd; padding: 6px;">所需</th><th style="border: 1px solid #ddd; padding: 6px;">余量</th><th style="border: 1px solid #ddd; padding: 6px;">输出转速</th><th style="border: 1px solid #ddd; padding: 6px;">判定</th></tr>
          </thead>
          <tbody>
            ${verifyResult.ratioResults.map(r => `
              <tr style="background: ${r.status === 'fail' ? '#f8d7da' : r.status === 'ideal' ? '#d1e7dd' : r.status === 'danger' ? '#fff3cd' : 'white'};">
                <td style="border: 1px solid #ddd; padding: 6px;">${r.ratio}</td>
                <td style="border: 1px solid #ddd; padding: 6px;">${r.capacity.toFixed(3)}</td>
                <td style="border: 1px solid #ddd; padding: 6px;">${verifyResult.required.toFixed(3)}</td>
                <td style="border: 1px solid #ddd; padding: 6px;"><strong>${r.margin !== null ? r.margin.toFixed(1) + '%' : '—'}</strong></td>
                <td style="border: 1px solid #ddd; padding: 6px;">${r.outputSpeed.toFixed(0)} rpm</td>
                <td style="border: 1px solid #ddd; padding: 6px; color: ${statusColorMap[r.status] || '#333'}; font-weight: bold;">${statusMap[r.status] || '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        ${verifyResult.best ? `
          <h3>四、推荐减速比</h3>
          <p>最佳匹配: <strong>${verifyResult.best.ratio}</strong> (余量 ${verifyResult.best.margin.toFixed(1)}%, 输出转速 ${verifyResult.best.outputSpeed.toFixed(0)} rpm)</p>
        ` : ''}

        ${verifyResult.allFail && verifyResult.suggestions.length > 0 ? `
          <h3>四、替代型号建议</h3>
          <ul>${verifyResult.suggestions.map(s => `<li>${s.model} (最大容量 ${s.cap}, 余量 ${s.margin}%)</li>`).join('')}</ul>
        ` : ''}

        <p style="text-align: center; color: #999; margin-top: 30px; font-size: 11px; border-top: 1px solid #eee; padding-top: 10px;">
          杭州前进齿轮箱集团 — 反向选型系统
        </p>
      </div>
    `;

    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);
    printHtmlContent(container, { title: `反向选型验证报告 - ${detail.model}` });
    setTimeout(() => document.body.removeChild(container), 1000);
  }, [detail, verifyResult, factoryPrice]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3 align-items-center">
        <Col>
          <h5><i className="bi bi-arrow-return-left me-2"></i>反向选型 — 型号查参数</h5>
          <small className="text-muted">输入齿轮箱型号，反查减速比、传递能力、适配功率范围、配套设备等 ({allModels.length}���号)</small>
        </Col>
        <Col xs="auto">
          <ExportToolbar getData={getExportData} disabled={filteredModels.length === 0} showPrint={false} />
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="输入型号，如 HC138, GWC60..." value={searchModel} onChange={e => setSearchModel(e.target.value)} />
            {searchModel && <Button variant="outline-secondary" onClick={() => setSearchModel('')}><i className="bi bi-x"></i></Button>}
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={filterSeries} onChange={e => setFilterSeries(e.target.value)}>
            <option value="all">全部系列 ({allModels.length})</option>
            {Object.entries(seriesCounts).sort((a, b) => b[1] - a[1]).map(([s, c]) => (
              <option key={s} value={s}>{SERIES_INFO[s]?.label || s} ({c})</option>
            ))}
          </Form.Select>
        </Col>
        <Col md={5}>
          <Alert variant="info" className="py-1 px-2 mb-0 small">
            <i className="bi bi-info-circle me-1"></i>
            显示 {filteredModels.length} / {allModels.length} 个型号
          </Alert>
        </Col>
      </Row>

      <Row>
        <Col md={detail ? 6 : 12}>
          <Card>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '68vh', overflowY: 'auto' }}>
                <Table striped hover size="sm" className="mb-0">
                  <thead className="sticky-top bg-light">
                    <tr>
                      <th>型号</th>
                      <th>系列</th>
                      <th>减速比</th>
                      <th>传递能力(kW/rpm)</th>
                      <th>转速(rpm)</th>
                      <th>推力(kN)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredModels.length === 0 ? (
                      <tr><td colSpan={6} className="text-center py-4">
                        <div className="text-muted mb-2">未找到匹配型号 "{searchModel}"</div>
                        {aliasResult && aliasResult.confidence !== 'none' && (
                          <div>
                            {aliasResult.note && <small className="text-info d-block mb-1"><i className="bi bi-lightbulb me-1"></i>{aliasResult.note}</small>}
                            {aliasResult.candidates.map(c => {
                              const m = allModels.find(x => x.model.toUpperCase() === c.toUpperCase());
                              return m ? (
                                <Button key={c} size="sm" variant="outline-primary" className="me-1 mb-1"
                                  onClick={() => { setSearchModel(m.model); setSelectedModel(m); }}>
                                  {m.model} {aliasResult.confidence === 'high' && <Badge bg="success" className="ms-1">推荐</Badge>}
                                </Button>
                              ) : null;
                            })}
                          </div>
                        )}
                        {aliasResult && aliasResult.confidence === 'none' && aliasResult.note && (
                          <small className="text-warning"><i className="bi bi-exclamation-triangle me-1"></i>{aliasResult.note}</small>
                        )}
                      </td></tr>
                    ) : filteredModels.map((m, idx) => (
                      <tr key={m.model + idx} className={detail?.model === m.model ? 'table-primary' : ''} style={{ cursor: 'pointer' }} onClick={() => setSelectedModel(m)}>
                        <td><strong>{m.model}</strong></td>
                        <td><Badge bg={SERIES_INFO[m.series]?.color || 'secondary'} className="small">{m.series}</Badge></td>
                        <td>{m.ratioMin != null ? (m.ratioMin === m.ratioMax ? m.ratioMin : `${m.ratioMin}~${m.ratioMax}`) : '—'}<small className="text-muted ms-1">({m.ratioCount})</small></td>
                        <td>{m.capacityMin != null ? (m.capacityMin === m.capacityMax ? m.capacityMax : `${m.capacityMin}~${m.capacityMax}`) : '—'}</td>
                        <td>{m.minSpeed && m.maxSpeed ? `${m.minSpeed}~${m.maxSpeed}` : '—'}</td>
                        <td>{m.thrust || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {detail && (
          <Col md={6}>
            <Card className="mb-3">
              <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                <strong><i className="bi bi-info-circle me-1"></i>{detail.model}</strong>
                <Button size="sm" variant="outline-light" onClick={() => setSelectedModel(null)}><i className="bi bi-x"></i></Button>
              </Card.Header>
              <Card.Body style={{ maxHeight: '68vh', overflowY: 'auto' }}>
                <h6>基本参数</h6>
                <ListGroup variant="flush" className="mb-3">
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>系列</span>
                    <Badge bg={SERIES_INFO[detail.series]?.color || 'secondary'}>{SERIES_INFO[detail.series]?.desc || detail.series}</Badge>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>离合器</span>
                    <span>{SERIES_INFO[detail.series]?.hasClutch ? <Badge bg="info">有</Badge> : <Badge bg="secondary">无</Badge>}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>输入转速范围</span>
                    <strong>{detail.minSpeed}~{detail.maxSpeed} rpm</strong>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>推力</span>
                    <span>{detail.thrust ? `${detail.thrust} kN` : '—'}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>中心距</span>
                    <span>{detail.centerDistance ? `${detail.centerDistance} mm` : '—'}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>重量</span>
                    <span>{detail.weight ? `${detail.weight} kg` : '—'}</span>
                  </ListGroup.Item>
                  {factoryPrice > 0 && (
                    <ListGroup.Item className="d-flex justify-content-between py-1">
                      <span>出厂价</span>
                      <strong className="text-success">¥{factoryPrice.toLocaleString()}</strong>
                    </ListGroup.Item>
                  )}
                </ListGroup>

                <h6>各减速比 — 传递能力 & 适配功率</h6>
                <Table size="sm" bordered className="mb-3">
                  <thead>
                    <tr><th>减速比</th><th>传递能力</th><th>适配功率范围(kW)</th></tr>
                  </thead>
                  <tbody>
                    {detail.powerRanges.map((pr, i) => (
                      <tr key={i}>
                        <td><strong>{pr.ratio}</strong></td>
                        <td>{pr.capacity} kW/rpm</td>
                        <td>{pr.powerAtMinSpeed != null ? `${pr.powerAtMinSpeed} ~ ${pr.powerAtMaxSpeed}` : '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* ===== 功率包络图 ===== */}
                {powerEnvelopeData.length > 0 && powerEnvelopeData[0].maxPower > 0 && (
                  <Card className="mb-3">
                    <Card.Header className="py-1 px-2">
                      <small><i className="bi bi-bar-chart me-1"></i><strong>功率包络图</strong> — 各减速比适配功率范围</small>
                    </Card.Header>
                    <Card.Body className="py-2 px-1">
                      <ResponsiveContainer width="100%" height={Math.max(180, powerEnvelopeData.length * 28 + 60)}>
                        <BarChart data={powerEnvelopeData} layout="vertical" margin={{ top: 5, right: 30, left: 10, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                          <XAxis type="number" tick={{ fontSize: 11 }} label={{ value: '功率 (kW)', position: 'insideBottom', offset: -2, fontSize: 11 }} />
                          <YAxis type="category" dataKey="ratio" tick={{ fontSize: 11 }} width={50} label={{ value: '减速比', angle: -90, position: 'insideLeft', offset: 10, fontSize: 11 }} />
                          <Tooltip
                            formatter={(value, name) => [`${value.toLocaleString()} kW`, name === 'minPower' ? '最低功率' : '最高功率']}
                            labelFormatter={v => `减速比 ${v}`}
                          />
                          <Bar dataKey="minPower" fill="#90cdf4" name="最低功率" stackId="range" barSize={16} />
                          <Bar dataKey="maxPower" fill="#3182ce" name="最高功率" barSize={16} />
                          {verifyPowerNum > 0 && (
                            <ReferenceLine x={verifyPowerNum} stroke="#e53e3e" strokeWidth={2} strokeDasharray="5 3"
                              label={{ value: `验证: ${verifyPowerNum}kW`, fill: '#e53e3e', fontSize: 11, position: 'top' }} />
                          )}
                        </BarChart>
                      </ResponsiveContainer>
                    </Card.Body>
                  </Card>
                )}

                {/* ===== 选型验证模块 ===== */}
                <Card className="mb-3 border-primary">
                  <Card.Header className="py-1 px-2 d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer', background: verifyOpen ? '#e7f1ff' : undefined }}
                    onClick={() => setVerifyOpen(v => !v)}>
                    <small><i className={`bi bi-${verifyOpen ? 'chevron-down' : 'chevron-right'} me-1`}></i><strong>选型验证</strong> — 输入功率转速验证该型号是否匹配</small>
                    <span className="d-flex align-items-center gap-1">
                      {verifyResult && (
                        <Button size="sm" variant="outline-success" className="py-0 px-1" title="导出验证报告"
                          onClick={e => { e.stopPropagation(); handleExportReport(); }}>
                          <i className="bi bi-printer me-1"></i><small>导出报告</small>
                        </Button>
                      )}
                      {verifyResult && (
                        verifyResult.allFail || verifyResult.speedOk === false
                          ? <Badge bg="danger">不通过</Badge>
                          : verifyResult.best?.status === 'ideal' ? <Badge bg="success">通过</Badge>
                          : <Badge bg="warning">注意</Badge>
                      )}
                    </span>
                  </Card.Header>
                  <Collapse in={verifyOpen}>
                    <Card.Body className="py-2 px-2">
                      <Row className="mb-2 g-2">
                        <Col xs={5}>
                          <InputGroup size="sm">
                            <InputGroup.Text>功率</InputGroup.Text>
                            <Form.Control type="number" placeholder="kW" value={verifyPower}
                              onChange={e => setVerifyPower(e.target.value)} />
                          </InputGroup>
                        </Col>
                        <Col xs={5}>
                          <InputGroup size="sm">
                            <InputGroup.Text>转速</InputGroup.Text>
                            <Form.Control type="number" placeholder="rpm" value={verifySpeed}
                              onChange={e => setVerifySpeed(e.target.value)} />
                          </InputGroup>
                        </Col>
                        <Col xs={2}>
                          {(verifyPower || verifySpeed) && (
                            <Button size="sm" variant="outline-secondary" onClick={() => { setVerifyPower(''); setVerifySpeed(''); }}>
                              <i className="bi bi-x"></i>
                            </Button>
                          )}
                        </Col>
                      </Row>
                      {verifyResult && (<>
                        <div className="mb-2">
                          <small>所需传递能力: <strong>{verifyResult.required.toFixed(4)} kW/rpm</strong></small>
                          {verifyResult.speedOk === false && (
                            <Alert variant="danger" className="py-1 px-2 mt-1 mb-0 small">
                              <i className="bi bi-x-circle me-1"></i>
                              转速 {verifyResult.speed}rpm 超出范围 [{detail.minSpeed}~{detail.maxSpeed}]
                            </Alert>
                          )}
                          {verifyResult.speedOk === true && (
                            <small className="text-success ms-2"><i className="bi bi-check-circle"></i> 转速在范围内</small>
                          )}
                        </div>
                        <Table size="sm" bordered className="mb-2 small">
                          <thead><tr>
                            <th>减速比</th><th>能力</th><th>所需</th><th>余量</th><th>输出转速</th><th>判定</th>
                          </tr></thead>
                          <tbody>
                            {verifyResult.ratioResults.map((r, i) => (
                              <tr key={i} className={r.status === 'fail' ? 'table-danger' : r.status === 'ideal' ? 'table-success' : r.status === 'danger' ? 'table-warning' : ''}>
                                <td><strong>{r.ratio}</strong></td>
                                <td>{r.capacity.toFixed(3)}</td>
                                <td>{verifyResult.required.toFixed(3)}</td>
                                <td style={{ minWidth: 90 }}>
                                  {r.margin !== null ? (
                                    <div className="d-flex align-items-center gap-1">
                                      <div style={{ flex: 1, height: 6, borderRadius: 3, background: '#e9ecef', overflow: 'hidden' }}>
                                        <div style={{
                                          width: `${Math.min(100, Math.max(0, r.margin < 0 ? 0 : (r.margin / 60) * 100))}%`,
                                          height: '100%', borderRadius: 3,
                                          background: r.status === 'fail' ? '#dc3545' : r.status === 'danger' ? '#ffc107' : r.status === 'ideal' ? '#198754' : r.status === 'ok' ? '#0dcaf0' : '#6c757d',
                                        }} />
                                      </div>
                                      <strong style={{ fontSize: 11, color: r.status === 'fail' ? '#dc3545' : r.status === 'ideal' ? '#198754' : undefined }}>
                                        {r.margin.toFixed(1)}%
                                      </strong>
                                    </div>
                                  ) : '—'}
                                </td>
                                <td>{r.outputSpeed.toFixed(0)}rpm</td>
                                <td>{
                                  r.status === 'fail' ? <Badge bg="danger">不足</Badge> :
                                  r.status === 'danger' ? <Badge bg="warning">偏紧</Badge> :
                                  r.status === 'ideal' ? <Badge bg="success">理想</Badge> :
                                  r.status === 'ok' ? <Badge bg="info">偏大</Badge> :
                                  r.status === 'oversized' ? <Badge bg="secondary">过大</Badge> : '—'
                                }</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        {/* 验证汇总卡片 */}
                        {verifyResult.best && !verifyResult.allFail && (
                          <Alert variant={verifyResult.best.status === 'ideal' ? 'success' : 'warning'} className="py-1 px-2 small mb-2">
                            <i className={`bi bi-${verifyResult.best.status === 'ideal' ? 'check-circle-fill' : 'exclamation-triangle-fill'} me-1`}></i>
                            <strong>最佳匹配:</strong> 减速比 <strong>{verifyResult.best.ratio}</strong>,
                            余量 <strong>{verifyResult.best.margin.toFixed(1)}%</strong>,
                            输出转速 <strong>{verifyResult.best.outputSpeed.toFixed(0)} rpm</strong>
                            {verifyResult.ratioResults.filter(r => r.status === 'ideal').length > 1 && (
                              <span className="ms-1">
                                (共 {verifyResult.ratioResults.filter(r => r.status === 'ideal').length} 个理想减速比)
                              </span>
                            )}
                          </Alert>
                        )}
                        {verifyResult.allFail && verifyResult.suggestions.length > 0 && (
                          <Alert variant="info" className="py-1 px-2 small mb-0">
                            <i className="bi bi-arrow-right-circle me-1"></i>
                            <strong>建议型号:</strong>{' '}
                            {verifyResult.suggestions.map(s => (
                              <Button key={s.model} size="sm" variant="outline-primary" className="me-1 py-0"
                                onClick={() => { const m = allModels.find(x => x.model === s.model); if(m) setSelectedModel(m); }}>
                                {s.model} <small>(容量{s.cap}, 余量{s.margin}%)</small>
                              </Button>
                            ))}
                          </Alert>
                        )}
                      </>)}
                    </Card.Body>
                  </Collapse>
                </Card>

                <h6>配套设备</h6>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>推荐联轴器</span>
                    <span>{couplingInfo?.model || couplingInfo?.coupling || '—'}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between py-1">
                    <span>推荐备用泵</span>
                    <span>{pumpInfo?.model || pumpInfo?.pump || '—'}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}
