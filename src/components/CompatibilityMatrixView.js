// 配套兼容性矩阵 — 主机×齿轮箱 / 齿轮箱×联轴器 / 齿轮箱×备用泵 三表速览
// 数据源:
// - engineMatchingCases (653 条 Cummins+HCM 配机案例) → 主机品牌×齿轮箱型号矩阵
// - gearboxToCouplingPrefixMap (~100 条) → 齿轮箱前缀×联轴器映射
// - getRecommendedPump() → 齿轮箱×备用泵推荐
// 用户场景:销售在客户面前一眼判断"主机 X + 齿轮箱 Y 是否常见配套"
import React, { useMemo, useState } from 'react';
import { Container, Card, Tabs, Tab, Table, Form, Row, Col, Badge, Button, OverlayTrigger, Tooltip, Alert } from 'react-bootstrap';
import { engineMatchingCases, engineBrands, identifyEngineBrand } from '../data/hcmEngineMatching';
import { gearboxToCouplingPrefixMap, getRecommendedPump } from '../data/gearboxMatchingMaps';

// ----- 工具函数 -----

// 把齿轮箱型号归到一个 "groupKey"(用于矩阵聚合)
const gearboxGroup = (model) => {
  if (!model) return '其他';
  const m = String(model).toUpperCase();
  // 提取已知系列前缀
  const seriesPrefixes = [
    'HCM', 'HCAM', 'HCVM', 'HCRM',
    'HCT', 'HCD', 'HCQ', 'HCA', 'HCV', 'HCX',
    'GWC', 'GWS', 'GWD', 'GWH', 'GWL', 'GWK', 'SGW',
    'GC', 'DT', 'MV', 'MB', 'HC',
    'J', 'D', 'T',
  ];
  for (const p of seriesPrefixes) {
    if (m.startsWith(p)) return p;
  }
  return '其他';
};

// ----- 主机×齿轮箱矩阵 -----
const EngineGearboxMatrix = () => {
  const [filterBrand, setFilterBrand] = useState('');

  // 聚合 cases 为 {brandId: {gearboxGroup: count}}
  const matrix = useMemo(() => {
    const m = {};
    engineMatchingCases.forEach(c => {
      const brandId = identifyEngineBrand(c.engine);
      const group = gearboxGroup(c.gearbox);
      if (!m[brandId]) m[brandId] = {};
      m[brandId][group] = (m[brandId][group] || 0) + (c.quantity || 1);
    });
    return m;
  }, []);

  // 收集所有 group(列)
  const allGroups = useMemo(() => {
    const set = new Set();
    Object.values(matrix).forEach(row => Object.keys(row).forEach(g => set.add(g)));
    return Array.from(set).sort();
  }, [matrix]);

  // 行品牌(过滤后)
  const visibleBrands = useMemo(() => {
    return engineBrands.filter(b => {
      if (filterBrand && b.id !== filterBrand) return false;
      return matrix[b.id] && Object.keys(matrix[b.id]).length > 0;
    });
  }, [filterBrand, matrix]);

  // 总记录数
  const totalCases = engineMatchingCases.length;
  const totalQuantity = useMemo(() => engineMatchingCases.reduce((s, c) => s + (c.quantity || 1), 0), []);

  const cellColor = (n) => {
    if (n >= 30) return '#16a34a';
    if (n >= 10) return '#22c55e';
    if (n >= 3) return '#fde047';
    if (n >= 1) return '#fef3c7';
    return 'transparent';
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <strong><i className="bi bi-cpu me-2"></i>主机品牌 × 齿轮箱系列</strong>
          <Badge bg="info" className="ms-2">{totalCases} 条案例</Badge>
          <Badge bg="secondary" className="ms-1">{totalQuantity} 套实船</Badge>
        </div>
        <Form.Select
          size="sm"
          style={{ width: 200 }}
          value={filterBrand}
          onChange={(e) => setFilterBrand(e.target.value)}
        >
          <option value="">全部品牌</option>
          {engineBrands.map(b => (
            <option key={b.id} value={b.id}>{b.name}</option>
          ))}
        </Form.Select>
      </Card.Header>
      <Card.Body className="p-0">
        <div style={{ overflowX: 'auto' }}>
          <Table size="sm" bordered hover className="mb-0" style={{ fontSize: '0.85em' }}>
            <thead className="bg-light">
              <tr>
                <th style={{ position: 'sticky', left: 0, background: '#f8f9fa', minWidth: 120 }}>品牌 \ 齿轮箱</th>
                {allGroups.map(g => (
                  <th key={g} className="text-center" style={{ minWidth: 60 }}>{g}</th>
                ))}
                <th className="text-center bg-info text-white">合计</th>
              </tr>
            </thead>
            <tbody>
              {visibleBrands.map(b => {
                const row = matrix[b.id] || {};
                const rowTotal = Object.values(row).reduce((s, n) => s + n, 0);
                return (
                  <tr key={b.id}>
                    <td style={{ position: 'sticky', left: 0, background: '#fff' }}>
                      <strong>{b.name}</strong>
                      <small className="text-muted d-block">{b.nameEn}</small>
                    </td>
                    {allGroups.map(g => {
                      const n = row[g] || 0;
                      return (
                        <td
                          key={g}
                          className="text-center"
                          style={{ background: cellColor(n), fontWeight: n > 0 ? 600 : 400 }}
                        >
                          {n > 0 ? n : '—'}
                        </td>
                      );
                    })}
                    <td className="text-center bg-light"><strong>{rowTotal}</strong></td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div className="px-3 py-2 d-flex align-items-center gap-3 flex-wrap" style={{ fontSize: '0.78em', color: '#666' }}>
          <span><i className="bi bi-circle-fill" style={{ color: '#fef3c7' }}></i> 1-2 套</span>
          <span><i className="bi bi-circle-fill" style={{ color: '#fde047' }}></i> 3-9 套</span>
          <span><i className="bi bi-circle-fill" style={{ color: '#22c55e' }}></i> 10-29 套</span>
          <span><i className="bi bi-circle-fill" style={{ color: '#16a34a' }}></i> 30+ 套</span>
          <span className="text-muted ms-auto">数据源:engineMatchingCases (Cummins 99 + HCM 554 = 653 条)</span>
        </div>
      </Card.Body>
    </Card>
  );
};

// ----- 齿轮箱×联轴器映射表 -----
const GearboxCouplingTable = () => {
  const [search, setSearch] = useState('');

  const rows = useMemo(() => {
    const arr = Object.entries(gearboxToCouplingPrefixMap).map(([gearbox, coupling]) => ({
      gearbox, coupling, group: gearboxGroup(gearbox),
    }));
    if (!search) return arr;
    const q = search.toLowerCase();
    return arr.filter(r =>
      r.gearbox.toLowerCase().includes(q) ||
      String(r.coupling).toLowerCase().includes(q) ||
      r.group.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
        <div>
          <strong><i className="bi bi-link-45deg me-2"></i>齿轮箱 × 高弹联轴器(新高弹)</strong>
          <Badge bg="info" className="ms-2">{Object.keys(gearboxToCouplingPrefixMap).length} 条映射</Badge>
        </div>
        <Form.Control
          size="sm"
          style={{ width: 240 }}
          placeholder="搜索型号 / 系列..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Card.Header>
      <Card.Body className="p-0">
        <div style={{ maxHeight: 540, overflowY: 'auto' }}>
          <Table size="sm" hover className="mb-0" style={{ fontSize: '0.85em' }}>
            <thead className="bg-light sticky-top">
              <tr>
                <th>齿轮箱型号 / 前缀</th>
                <th>系列</th>
                <th>推荐高弹联轴器</th>
                <th>系列说明</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 ? (
                <tr><td colSpan={4} className="text-center text-muted py-3">未找到匹配项</td></tr>
              ) : rows.map((r, i) => (
                <tr key={`${r.gearbox}-${i}`}>
                  <td><code>{r.gearbox}</code></td>
                  <td><Badge bg="secondary">{r.group}</Badge></td>
                  <td><strong>{r.coupling || '-'}</strong></td>
                  <td>
                    <small className="text-muted">
                      {String(r.coupling).startsWith('HGTHT') && '高扭矩高弹(T 型)'}
                      {String(r.coupling).startsWith('HGTHB') && '大型高弹(B 型)'}
                      {String(r.coupling).startsWith('HGTH') && !String(r.coupling).startsWith('HGTHT') && !String(r.coupling).startsWith('HGTHB') && '小型高弹'}
                      {String(r.coupling).startsWith('HGTL') && '轻型高弹'}
                    </small>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="px-3 py-2 small text-muted">
          数据源:src/data/gearboxMatchingMaps.js gearboxToCouplingPrefixMap(更新于 2025-12-26,基于 2025 船用产品备用泵高弹对照表)
        </div>
      </Card.Body>
    </Card>
  );
};

// ----- 齿轮箱×备用泵推荐表 -----
const GearboxPumpTable = () => {
  // 用 gearboxToCouplingPrefixMap 的 keys 作为齿轮箱样本(约 100 条),逐项查推荐泵
  const rows = useMemo(() => {
    const seen = new Set();
    const arr = [];
    Object.keys(gearboxToCouplingPrefixMap).forEach(g => {
      try {
        const pump = getRecommendedPump(g);
        const pumpStr = pump && typeof pump === 'object' ? (pump.model || pump.recommendedPump || JSON.stringify(pump)) : pump;
        const key = `${g}|${pumpStr}`;
        if (seen.has(key)) return;
        seen.add(key);
        arr.push({ gearbox: g, group: gearboxGroup(g), pump: pumpStr || '-', pumpRaw: pump });
      } catch (e) { /* 跳过异常项 */ }
    });
    return arr;
  }, []);

  const withPump = rows.filter(r => r.pump && r.pump !== '-' && r.pump !== 'null' && r.pump !== 'undefined').length;

  return (
    <Card>
      <Card.Header>
        <strong><i className="bi bi-droplet me-2"></i>齿轮箱 × 备用泵推荐</strong>
        <Badge bg="info" className="ms-2">{rows.length} 条</Badge>
        <Badge bg="success" className="ms-1">{withPump} 条有推荐</Badge>
      </Card.Header>
      <Card.Body className="p-0">
        <div style={{ maxHeight: 540, overflowY: 'auto' }}>
          <Table size="sm" hover className="mb-0" style={{ fontSize: '0.85em' }}>
            <thead className="bg-light sticky-top">
              <tr>
                <th>齿轮箱型号 / 前缀</th>
                <th>系列</th>
                <th>推荐备用泵</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={`${r.gearbox}-${i}`}>
                  <td><code>{r.gearbox}</code></td>
                  <td><Badge bg="secondary">{r.group}</Badge></td>
                  <td>
                    {r.pump && r.pump !== '-' ? (
                      <strong>{r.pump}</strong>
                    ) : (
                      <span className="text-muted">— 无标准推荐</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="px-3 py-2 small text-muted">
          数据源:src/data/gearboxMatchingMaps.js getRecommendedPump() · 含 GW 系列归一化
        </div>
      </Card.Body>
    </Card>
  );
};

// ----- 主组件 -----
const CompatibilityMatrixView = ({ colors = {} }) => {
  return (
    <Container fluid className="py-3">
      <div className="mb-3">
        <h4 className="mb-1"><i className="bi bi-grid-3x3 me-2"></i>配套兼容性矩阵</h4>
        <small className="text-muted">主机—齿轮箱—联轴器—备用泵 配套关系一图速览,供销售/设计快速判断可配性</small>
      </div>

      <Alert variant="light" className="py-2 mb-3" style={{ borderLeft: `3px solid ${colors.primary || '#2e7d32'}` }}>
        <small>
          <i className="bi bi-info-circle me-1"></i>
          矩阵基于 <strong>历史实船配套案例</strong> 与 <strong>映射规则表</strong> 聚合呈现。深色单元 = 配套数量多 = 行业事实标准;
          空白单元 = 历史无实例,但**不代表不可配套**,以选型计算结果为准。
        </small>
      </Alert>

      <Tabs defaultActiveKey="engine-gearbox" className="mb-3">
        <Tab eventKey="engine-gearbox" title={<span><i className="bi bi-cpu me-1"></i>主机 × 齿轮箱</span>}>
          <EngineGearboxMatrix />
        </Tab>
        <Tab eventKey="gearbox-coupling" title={<span><i className="bi bi-link-45deg me-1"></i>齿轮箱 × 高弹</span>}>
          <GearboxCouplingTable />
        </Tab>
        <Tab eventKey="gearbox-pump" title={<span><i className="bi bi-droplet me-1"></i>齿轮箱 × 备用泵</span>}>
          <GearboxPumpTable />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CompatibilityMatrixView;
