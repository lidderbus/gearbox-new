// src/components/SmartSearchView.js
// 智能搜索与关联推荐：跨模块全文搜索，支持型号/减速比/系列/功率搜索，关联推荐相近型号
import React, { useState, useMemo, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup, ListGroup } from 'react-bootstrap';
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

// Lightweight fuzzy match helper (Levenshtein distance based)
function fuzzyMatch(query, target, threshold = 0.6) {
  query = query.toLowerCase();
  target = target.toLowerCase();

  // Exact or substring match
  if (target.includes(query) || query.includes(target)) return 1.0;

  // Levenshtein distance
  const len1 = query.length, len2 = target.length;
  if (Math.abs(len1 - len2) > Math.max(len1, len2) * 0.4) return 0;

  const matrix = Array.from({length: len1 + 1}, (_, i) =>
    Array.from({length: len2 + 1}, (_, j) => i === 0 ? j : j === 0 ? i : 0)
  );

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = query[i-1] === target[j-1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i-1][j] + 1,
        matrix[i][j-1] + 1,
        matrix[i-1][j-1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  const similarity = 1 - distance / maxLen;
  return similarity >= threshold ? similarity : 0;
}

function searchModels(data, query) {
  if (!query || query.length < 1) return [];
  const q = query.trim().toUpperCase();
  const num = parseFloat(q);
  const results = [];

  data.forEach(item => {
    const model = (item.model || item.name || '').toUpperCase();
    const ratios = Array.isArray(item.ratios) ? item.ratios : [];
    const caps = Array.isArray(item.transferCapacity) ? item.transferCapacity : [];

    let score = 0;
    let matchType = '';

    // 型号名匹配
    if (model === q) { score = 100; matchType = '精确匹配'; }
    else if (model.startsWith(q)) { score = 80; matchType = '前缀匹配'; }
    else if (model.includes(q)) { score = 60; matchType = '包含匹配'; }

    // 减速比匹配（数字查询）
    if (!score && !isNaN(num) && num > 0 && num < 20) {
      const matchIdx = ratios.findIndex(r => typeof r === 'number' && Math.abs(r - num) < 0.02);
      if (matchIdx >= 0) {
        score = 70;
        matchType = `减速比 ${ratios[matchIdx]}`;
      }
    }

    // 传递能力匹配（数字查询 > 0.01）
    if (!score && !isNaN(num) && num > 0.01 && num < 5) {
      const matchIdx = caps.findIndex(c => typeof c === 'number' && Math.abs(c - num) < 0.005);
      if (matchIdx >= 0) {
        score = 65;
        matchType = `传递能力 ${caps[matchIdx]}`;
      }
    }

    // 系列匹配
    if (!score && getSeries(model) === q) { score = 40; matchType = '系列匹配'; }

    // 模糊匹配 - 型号名 (typo tolerance)
    if (!score && q.length >= 3) {
      const fuzzyScore = fuzzyMatch(q, model);
      if (fuzzyScore > 0) {
        score = Math.round(fuzzyScore * 50); // max 50 for fuzzy
        matchType = '模糊匹配';
      }
    }

    // 模糊匹配 - 系列名
    if (!score && q.length >= 2) {
      const series = getSeries(model);
      if (series) {
        const fuzzyScore = fuzzyMatch(q, series);
        if (fuzzyScore > 0) {
          score = Math.round(fuzzyScore * 30);
          matchType = '系列模糊';
        }
      }
    }

    if (score > 0) {
      results.push({ ...item, model: item.model || item.name, score, matchType });
    }
  });

  return results.sort((a, b) => b.score - a.score).slice(0, 30);
}

function getRelatedModels(data, model) {
  if (!model) return [];
  const series = getSeries(model);
  const item = data.find(d => (d.model || d.name) === model);
  const itemCaps = item && Array.isArray(item.transferCapacity) ? item.transferCapacity : [];
  const maxCap = itemCaps.length ? Math.max(...itemCaps.filter(v => typeof v === 'number')) : 0;

  return data
    .filter(d => {
      const m = d.model || d.name || '';
      if (m === model) return false;
      // 同系列 或 传递能力相近的其他系列
      const dSeries = getSeries(m);
      if (dSeries === series) return true;
      const dCaps = Array.isArray(d.transferCapacity) ? d.transferCapacity.filter(v => typeof v === 'number') : [];
      const dMax = dCaps.length ? Math.max(...dCaps) : 0;
      return maxCap > 0 && dMax > 0 && Math.abs(dMax - maxCap) / maxCap < 0.25;
    })
    .map(d => {
      const m = d.model || d.name;
      const dSeries = getSeries(m);
      const dCaps = Array.isArray(d.transferCapacity) ? d.transferCapacity.filter(v => typeof v === 'number') : [];
      const dMax = dCaps.length ? Math.max(...dCaps) : 0;
      return {
        model: m,
        reason: dSeries === series ? `同系列 ${series}` : `相近能力 ${dMax.toFixed(3)}`,
        series: dSeries,
      };
    })
    .slice(0, 10);
}

export default function SmartSearchView({ colors, theme }) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem('smart_search_history') || '[]'); } catch { return []; }
  });

  const results = useMemo(() => searchModels(embeddedData, query), [query]);
  const [selectedResult, setSelectedResult] = useState(null);
  const related = useMemo(() => selectedResult ? getRelatedModels(embeddedData, selectedResult.model) : [], [selectedResult]);

  // 选中型号的详细信息
  const detailInfo = useMemo(() => {
    if (!selectedResult) return null;
    const ratios = Array.isArray(selectedResult.ratios) ? selectedResult.ratios : [];
    const caps = Array.isArray(selectedResult.transferCapacity) ? selectedResult.transferCapacity : [];
    const price = selectedResult.price || 0;
    const factoryPrice = price > 0 ? calculateFactoryPrice({
      model: selectedResult.model, basePrice: price,
      discountRate: selectedResult.discountRate ?? getStandardDiscountRate(selectedResult.model)
    }) : 0;
    const pump = getRecommendedPump(selectedResult.model);
    const coupling = getRecommendedCouplingInfo(selectedResult.model);
    return {
      ratios, caps,
      speedRange: selectedResult.inputSpeedRange || null,
      thrust: selectedResult.thrust || null,
      weight: selectedResult.weight || selectedResult.dryWeight || null,
      factoryPrice,
      pump: pump?.model || pump?.pump || null,
      coupling: coupling?.model || coupling?.coupling || null,
    };
  }, [selectedResult]);

  const handleSearch = useCallback((q) => {
    setQuery(q);
    setSelectedResult(null);
    if (q.trim() && q.trim().length >= 2) {
      const history = [q.trim(), ...recentSearches.filter(h => h !== q.trim())].slice(0, 10);
      setRecentSearches(history);
      try { localStorage.setItem('smart_search_history', JSON.stringify(history)); } catch {}
    }
  }, [recentSearches]);

  const clearHistory = useCallback(() => {
    setRecentSearches([]);
    try { localStorage.removeItem('smart_search_history'); } catch {}
  }, []);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-search-heart me-2"></i>智能搜索</h5>
          <small className="text-muted">搜索型号、减速比、传递能力，支持模糊/容错搜索，自动关联推荐相近型号 ({embeddedData.length}型号)</small>
        </Col>
      </Row>

      <Row className="mb-3">
        <Col md={8}>
          <InputGroup size="lg">
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="型号(HC138)、减速比(2.03)、传递能力(0.12)..." value={query} onChange={e => handleSearch(e.target.value)} autoFocus />
            {query && <Button variant="outline-secondary" onClick={() => { setQuery(''); setSelectedResult(null); }}><i className="bi bi-x-lg"></i></Button>}
          </InputGroup>
        </Col>
        <Col md={4}>
          {recentSearches.length > 0 && (
            <Card className="h-100">
              <Card.Body className="py-2 px-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">最近搜索</small>
                  <Button size="sm" variant="link" className="p-0 text-muted" onClick={clearHistory}>清除</Button>
                </div>
                <div className="d-flex flex-wrap gap-1">
                  {recentSearches.slice(0, 6).map((h, i) => (
                    <Badge key={i} bg="light" text="dark" style={{ cursor: 'pointer' }} onClick={() => handleSearch(h)}>{h}</Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>

      {!query ? (
        <Alert variant="light" className="text-center py-5 border">
          <i className="bi bi-search" style={{ fontSize: '3rem', opacity: 0.3 }}></i>
          <p className="mt-3 mb-0 text-muted">输入关键词开始搜索 — 支持型号名、减速比数值、传递能力数值</p>
        </Alert>
      ) : (
        <Row>
          <Col md={selectedResult ? 7 : 12}>
            <Card>
              <Card.Header>搜索结果 ({results.length})</Card.Header>
              <Card.Body className="p-0">
                <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                  {results.length === 0 ? (
                    <div className="text-center py-4 text-muted">
                      <i className="bi bi-emoji-frown" style={{ fontSize: '2rem' }}></i>
                      <p className="mt-2">未找到 "{query}" 的匹配结果</p>
                    </div>
                  ) : (
                    <Table hover size="sm" className="mb-0">
                      <thead className="sticky-top bg-light">
                        <tr><th>型号</th><th>匹配方式</th><th>相关度</th><th>系列</th><th>减速比数</th></tr>
                      </thead>
                      <tbody>
                        {results.map((r, i) => (
                          <tr key={r.model + i} style={{ cursor: 'pointer' }} className={selectedResult?.model === r.model ? 'table-primary' : ''} onClick={() => setSelectedResult(r)}>
                            <td><strong>{r.model}</strong></td>
                            <td><Badge bg={r.matchType === '模糊匹配' || r.matchType === '系列模糊' ? 'warning' : r.score >= 80 ? 'success' : r.score >= 60 ? 'info' : 'secondary'} text={r.matchType === '模糊匹配' || r.matchType === '系列模糊' ? 'dark' : undefined}>{r.matchType}</Badge>{(r.matchType === '模糊匹配' || r.matchType === '系列模糊') && <Badge bg="warning" text="dark" className="ms-1">近似</Badge>}</td>
                            <td>
                              <div className="d-flex align-items-center gap-1">
                                <div style={{ width: 60, height: 6, background: '#e9ecef', borderRadius: 3 }}>
                                  <div style={{ width: `${r.score}%`, height: '100%', background: r.score >= 80 ? '#198754' : '#0d6efd', borderRadius: 3 }}></div>
                                </div>
                                <small>{r.score}%</small>
                              </div>
                            </td>
                            <td><Badge bg="outline-secondary" text="secondary" className="border">{getSeries(r.model)}</Badge></td>
                            <td>{(Array.isArray(r.ratios) ? r.ratios : []).length}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>

          {selectedResult && detailInfo && (
            <Col md={5}>
              <Card className="mb-3">
                <Card.Header className="bg-primary text-white"><strong>{selectedResult.model}</strong> 详情</Card.Header>
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item className="d-flex justify-content-between py-1"><span>系列</span><Badge bg="info">{getSeries(selectedResult.model)}</Badge></ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-1"><span>减速比</span><span>{detailInfo.ratios.join(', ') || '—'}</span></ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-1"><span>传递能力</span><span>{detailInfo.caps.join(', ') || '—'}</span></ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-1"><span>转速范围</span><span>{detailInfo.speedRange ? `${detailInfo.speedRange[0]}~${detailInfo.speedRange[1]} rpm` : '—'}</span></ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-1"><span>推力</span><span>{detailInfo.thrust ? `${detailInfo.thrust} kN` : '—'}</span></ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between py-1"><span>重量</span><span>{detailInfo.weight ? `${detailInfo.weight} kg` : '—'}</span></ListGroup.Item>
                    {detailInfo.factoryPrice > 0 && <ListGroup.Item className="d-flex justify-content-between py-1"><span>出厂价</span><strong className="text-success">¥{detailInfo.factoryPrice.toLocaleString()}</strong></ListGroup.Item>}
                    {detailInfo.coupling && <ListGroup.Item className="d-flex justify-content-between py-1"><span>联轴器</span><span>{detailInfo.coupling}</span></ListGroup.Item>}
                    {detailInfo.pump && <ListGroup.Item className="d-flex justify-content-between py-1"><span>备用泵</span><span>{detailInfo.pump}</span></ListGroup.Item>}
                  </ListGroup>
                </Card.Body>
              </Card>

              {related.length > 0 && (
                <Card>
                  <Card.Header><i className="bi bi-link-45deg me-1"></i>关联推荐 ({related.length})</Card.Header>
                  <ListGroup variant="flush">
                    {related.map((r, i) => (
                      <ListGroup.Item key={i} className="d-flex justify-content-between align-items-center py-1" style={{ cursor: 'pointer' }} onClick={() => handleSearch(r.model)}>
                        <span><strong>{r.model}</strong> <Badge bg="outline-secondary" text="secondary" className="border ms-1">{r.series}</Badge></span>
                        <small className="text-muted">{r.reason}</small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card>
              )}
            </Col>
          )}
        </Row>
      )}
    </Container>
  );
}
