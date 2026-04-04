// src/components/ReverseSelectionView.js
// 反向选型：根据已知齿轮箱型号，反查适配参数（功率、转速、减速比范围、适配主机推荐）
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup, ListGroup, Collapse } from 'react-bootstrap';
import { getRecommendedPump, getRecommendedCouplingInfo } from '../data/gearboxMatchingMaps';
import { calculateFactoryPrice, getStandardDiscountRate } from '../utils/priceManager';
import { resolveModelAlias } from '../utils/modelAliasResolver';

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

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h5><i className="bi bi-arrow-return-left me-2"></i>反向选型 — 型号查参数</h5>
          <small className="text-muted">输入齿轮箱型号，反查减速比、传递能力、适配功率范围、配套设备等 ({allModels.length}型号)</small>
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

                {/* ===== 选型验证模块 ===== */}
                <Card className="mb-3 border-primary">
                  <Card.Header className="py-1 px-2 d-flex justify-content-between align-items-center"
                    style={{ cursor: 'pointer', background: verifyOpen ? '#e7f1ff' : undefined }}
                    onClick={() => setVerifyOpen(v => !v)}>
                    <small><i className={`bi bi-${verifyOpen ? 'chevron-down' : 'chevron-right'} me-1`}></i><strong>选型验证</strong> — 输入功率转速验证该型号是否匹配</small>
                    {verifyResult && (
                      verifyResult.allFail || verifyResult.speedOk === false
                        ? <Badge bg="danger">不通过</Badge>
                        : verifyResult.best?.status === 'ideal' ? <Badge bg="success">通过</Badge>
                        : <Badge bg="warning">注意</Badge>
                    )}
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
                                <td>{r.ratio}</td>
                                <td>{r.capacity.toFixed(3)}</td>
                                <td>{verifyResult.required.toFixed(3)}</td>
                                <td><strong>{r.margin !== null ? `${r.margin.toFixed(1)}%` : '—'}</strong></td>
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
