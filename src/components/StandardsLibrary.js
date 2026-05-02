// src/components/StandardsLibrary.js
// 标准法规知识库：海事相关标准规范快速检索
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup, ListGroup, Tab, Tabs } from 'react-bootstrap';
import LibraryPermissionBanner from './common/LibraryPermissionBanner';

const STANDARDS_DATA = [
  // 国际标准
  { id: 'IMO-MEPC.328', name: 'MEPC.328(76)', org: 'IMO', category: '环保', desc: 'EEXI/CII能效指标要求', year: 2021, status: '现行' },
  { id: 'IMO-MSC.337', name: 'MSC.337(91)', org: 'IMO', category: '噪声', desc: '船上噪声级别规则', year: 2012, status: '现行' },
  { id: 'ISO-6336', name: 'ISO 6336', org: 'ISO', category: '齿轮', desc: '直齿和斜齿圆柱齿轮承载能力计算', year: 2019, status: '现行' },
  { id: 'ISO-8579', name: 'ISO 8579-1', org: 'ISO', category: '振动', desc: '齿轮箱验收规范—振动', year: 2002, status: '现行' },
  { id: 'ISO-9001', name: 'ISO 9001', org: 'ISO', category: '质量', desc: '质量管理体系要求', year: 2015, status: '现行' },
  { id: 'ISO-10816', name: 'ISO 10816-1', org: 'ISO', category: '振动', desc: '机器振动评价标准', year: 1995, status: '现行' },
  { id: 'ISO-81400', name: 'ISO 81400-4', org: 'ISO', category: '齿轮', desc: '风力发电机组齿轮箱设计和规范', year: 2006, status: '现行' },
  // 国标
  { id: 'GB-T-3480', name: 'GB/T 3480', org: 'GB', category: '齿轮', desc: '直齿轮和斜齿轮承载能力计算方法', year: 2016, status: '现行' },
  { id: 'GB-T-19001', name: 'GB/T 19001', org: 'GB', category: '质量', desc: '质量管理体系要求（等同ISO9001）', year: 2016, status: '现行' },
  { id: 'GB-T-6404', name: 'GB/T 6404.1', org: 'GB', category: '噪声', desc: '齿轮装置噪声测定规范', year: 2005, status: '现行' },
  { id: 'GB-T-10095', name: 'GB/T 10095.1', org: 'GB', category: '齿轮', desc: '圆柱齿轮精度制', year: 2008, status: '现行' },
  { id: 'CB-T-3845', name: 'CB/T 3845', org: 'CB', category: '船用', desc: '船用齿轮箱通用技术条件', year: 2013, status: '现行' },
  { id: 'CB-T-4355', name: 'CB/T 4355', org: 'CB', category: '船用', desc: '船用齿轮箱振动和噪声试验方法', year: 2013, status: '现行' },
  // 船级社规范
  { id: 'CCS-Rules', name: 'CCS《钢质海船入级规范》', org: 'CCS', category: '船级社', desc: '第3篇 轮机 第3章 传动装置', year: 2024, status: '现行' },
  { id: 'DNV-Rules', name: 'DNV Rules Pt.4 Ch.4', org: 'DNV', category: '船级社', desc: 'Rotating Machinery - Gears', year: 2024, status: '现行' },
  { id: 'LR-Rules', name: 'LR Rules Part 5 Ch.7', org: 'LR', category: '船级社', desc: 'Propulsion Gearing', year: 2024, status: '现行' },
  { id: 'ABS-Rules', name: 'ABS Rules Part 4 Ch.3', org: 'ABS', category: '船级社', desc: 'Propulsion and Maneuvering Machinery', year: 2024, status: '现行' },
  // SOLAS / MARPOL
  { id: 'SOLAS-II-1', name: 'SOLAS Ch.II-1', org: 'IMO', category: '安全', desc: '构造—结构、分舱、稳性、机电设备', year: 2020, status: '现行' },
  { id: 'MARPOL-VI', name: 'MARPOL Annex VI', org: 'IMO', category: '环保', desc: '防止船舶大气污染规则', year: 2020, status: '现行' },
  // ISO 补充
  { id: 'ISO-1328', name: 'ISO 1328-1', org: 'ISO', category: '齿轮', desc: '圆柱齿轮精度制—轮齿同侧齿面偏差的定义和允许值', year: 2013, status: '现行' },
  { id: 'ISO-6336-2', name: 'ISO 6336-2', org: 'ISO', category: '齿轮', desc: '圆柱齿轮接触强度(点蚀)计算', year: 2019, status: '现行' },
  { id: 'ISO-6336-3', name: 'ISO 6336-3', org: 'ISO', category: '齿轮', desc: '圆柱齿轮弯曲强度计算', year: 2019, status: '现行' },
  { id: 'ISO-6336-5', name: 'ISO 6336-5', org: 'ISO', category: '材料', desc: '齿轮材料的强度和质量', year: 2016, status: '现行' },
  { id: 'ISO-6336-6', name: 'ISO 6336-6', org: 'ISO', category: '齿轮', desc: '可变载荷条件下齿轮寿命计算', year: 2019, status: '现行' },
  { id: 'ISO-10300', name: 'ISO 10300', org: 'ISO', category: '齿轮', desc: '锥齿轮承载能力计算', year: 2014, status: '现行' },
  { id: 'ISO-13691', name: 'ISO 13691', org: 'ISO', category: '齿轮', desc: '石油和天然气工业—高速齿轮传动装置', year: 2015, status: '现行' },
  { id: 'ISO-14001', name: 'ISO 14001', org: 'ISO', category: '环保', desc: '环境管理体系要求及使用指南', year: 2015, status: '现行' },
  { id: 'ISO-45001', name: 'ISO 45001', org: 'ISO', category: '安全', desc: '职业健康安全管理体系', year: 2018, status: '现行' },
  { id: 'ISO-281', name: 'ISO 281', org: 'ISO', category: '轴承', desc: '滚动轴承额定动载荷和额定寿命', year: 2007, status: '现行' },
  { id: 'ISO-76', name: 'ISO 76', org: 'ISO', category: '轴承', desc: '滚动轴承额定静载荷', year: 2006, status: '现行' },
  { id: 'ISO-20816', name: 'ISO 20816-1', org: 'ISO', category: '振动', desc: '机械振动测量和评价—通则(替代ISO10816)', year: 2016, status: '现行' },
  // GB/CB 补充
  { id: 'GB-T-3481', name: 'GB/T 3481', org: 'GB', category: '齿轮', desc: '齿轮轮齿磨损和损伤术语', year: 1997, status: '现行' },
  { id: 'GB-T-6413', name: 'GB/T 6413', org: 'GB', category: '齿轮', desc: '圆柱齿轮、锥齿轮和准双曲面齿轮胶合承载能力计算方法', year: 2003, status: '现行' },
  { id: 'GB-T-8539', name: 'GB/T 8539', org: 'GB', category: '齿轮', desc: '齿轮材料及热处理质量检验的一般规定', year: 2015, status: '现行' },
  { id: 'GB-T-13924', name: 'GB/T 13924', org: 'GB', category: '材料', desc: '渗碳渗氮淬火钢件金相检验', year: 2019, status: '现行' },
  { id: 'GB-T-7931', name: 'GB/T 7931', org: 'GB', category: '润滑', desc: '齿轮传动装置用润滑油', year: 2017, status: '现行' },
  { id: 'CB-T-4353', name: 'CB/T 4353', org: 'CB', category: '船用', desc: '船用齿轮箱修理技术条件', year: 2013, status: '现行' },
  { id: 'CB-T-3846', name: 'CB/T 3846', org: 'CB', category: '船用', desc: '船用齿轮箱型式试验大纲', year: 2013, status: '现行' },
  { id: 'CB-T-3438', name: 'CB/T 3438', org: 'CB', category: '船用', desc: '船用液压操纵离合器通用技术条件', year: 2013, status: '现行' },
  // AGMA (美国齿轮制造商协会)
  { id: 'AGMA-6011', name: 'AGMA 6011', org: 'AGMA', category: '齿轮', desc: '高速斜齿轮装置额定值规范', year: 2019, status: '现行' },
  { id: 'AGMA-6013', name: 'AGMA 6013', org: 'AGMA', category: '齿轮', desc: '工业封闭式齿轮传动装置标准', year: 2017, status: '现行' },
  { id: 'AGMA-9005', name: 'AGMA 9005', org: 'AGMA', category: '润滑', desc: '工业齿轮传动装置润滑', year: 2014, status: '现行' },
  // API
  { id: 'API-613', name: 'API 613', org: 'API', category: '齿轮', desc: '石油化工和天然气工业用齿轮', year: 2021, status: '现行' },
  { id: 'API-677', name: 'API 677', org: 'API', category: '齿轮', desc: '通用齿轮装置', year: 2019, status: '现行' },
  // IEC
  { id: 'IEC-61892-7', name: 'IEC 61892-7', org: 'IEC', category: '安全', desc: '海上移动平台电气设备—危险区域', year: 2019, status: '现行' },
  // 船级社补充
  { id: 'NK-Rules', name: 'NK Rules Part D Ch.6', org: 'NK', category: '船级社', desc: 'Gears and Gearing Devices', year: 2024, status: '现行' },
  { id: 'BV-Rules', name: 'BV Rules NR467 Pt C Ch.1', org: 'BV', category: '船级社', desc: 'Main Propulsion - Gearing', year: 2024, status: '现行' },
  { id: 'KR-Rules', name: 'KR Rules Part 5 Ch.6', org: 'KR', category: '船级社', desc: 'Gears and Clutches', year: 2024, status: '现行' },
  { id: 'RINA-Rules', name: 'RINA Rules Pt B Ch.9', org: 'RINA', category: '船级社', desc: 'Propulsion Gearing', year: 2024, status: '现行' },
  { id: 'RS-Rules', name: 'RS Rules Part IX Sec.3', org: 'RS', category: '船级社', desc: 'Reduction Gears', year: 2024, status: '现行' },
  // ASTM
  { id: 'ASTM-A291', name: 'ASTM A291', org: 'ASTM', category: '材料', desc: '合金钢齿轮锻件标准规范', year: 2020, status: '现行' },
  { id: 'ASTM-A534', name: 'ASTM A534', org: 'ASTM', category: '材料', desc: '渗碳齿轮用合金钢', year: 2019, status: '现行' },
  // 环保补充
  { id: 'IMO-GHG', name: 'IMO Initial GHG Strategy', org: 'IMO', category: '环保', desc: '船舶温室气体减排初始战略（2050净零目标）', year: 2023, status: '现行' },
  { id: 'EU-MRV', name: 'EU MRV Regulation', org: 'EU', category: '环保', desc: '欧盟船舶CO₂排放监测、报告和核查', year: 2024, status: '现行' },
];

const CATEGORIES = ['全部', '齿轮', '振动', '噪声', '船用', '船级社', '环保', '安全', '质量', '轴承', '材料', '润滑'];
const ORGS = ['全部', 'IMO', 'ISO', 'GB', 'CB', 'AGMA', 'API', 'IEC', 'ASTM', 'EU', 'CCS', 'DNV', 'BV', 'LR', 'ABS', 'NK', 'KR', 'RS', 'RINA'];

// P2-2: 三层结构分类 — 国际公约 → 船级社 → 国标行标 → 行业标准
const TIER_DEFINITIONS = {
  international: {
    label: '国际 (IMO/IACS/ISO)',
    icon: 'bi-globe2',
    color: 'primary',
    orgs: ['IMO', 'ISO', 'IEC', 'EU'],
    note: 'IMO 公约、IACS 统一要求、ISO/IEC 国际标准、EU 法规',
  },
  classification: {
    label: '船级社 (CCS/DNV/LR/ABS/BV/RINA/NK/KR/RS)',
    icon: 'bi-patch-check',
    color: 'success',
    orgs: ['CCS', 'DNV', 'LR', 'ABS', 'BV', 'RINA', 'NK', 'KR', 'RS'],
    note: 'IACS 9 大成员船级社入级规范',
  },
  national: {
    label: '国标 / 行标 (GB / CB)',
    icon: 'bi-bank',
    color: 'warning',
    orgs: ['GB', 'CB'],
    note: '中国国家标准 (GB) 与船舶行业标准 (CB)',
  },
  industry: {
    label: '行业 (AGMA / API / ASTM)',
    icon: 'bi-gear-wide',
    color: 'secondary',
    orgs: ['AGMA', 'API', 'ASTM'],
    note: '美国齿轮制造商协会 / 美国石油协会 / 美国材料试验协会',
  },
};

const classifyTier = (org) => {
  for (const [key, def] of Object.entries(TIER_DEFINITIONS)) {
    if (def.orgs.includes(org)) return key;
  }
  return 'industry';
};

export default function StandardsLibrary({ colors, theme }) {
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('全部');
  const [filterOrg, setFilterOrg] = useState('全部');
  const [filterTier, setFilterTier] = useState('all'); // P2-2
  const [selectedStd, setSelectedStd] = useState(null);

  // P2-2: 各层级条目计数
  const tierCounts = useMemo(() => {
    const counts = { all: STANDARDS_DATA.length };
    Object.keys(TIER_DEFINITIONS).forEach(t => { counts[t] = 0; });
    STANDARDS_DATA.forEach(s => {
      const t = classifyTier(s.org);
      counts[t] = (counts[t] || 0) + 1;
    });
    return counts;
  }, []);

  const filtered = useMemo(() => {
    return STANDARDS_DATA.filter(s => {
      if (filterTier !== 'all' && classifyTier(s.org) !== filterTier) return false; // P2-2
      if (filterCategory !== '全部' && s.category !== filterCategory) return false;
      if (filterOrg !== '全部' && s.org !== filterOrg) return false;
      if (search) {
        const q = search.toUpperCase();
        return s.name.toUpperCase().includes(q) || s.desc.includes(search) || s.id.toUpperCase().includes(q);
      }
      return true;
    });
  }, [search, filterCategory, filterOrg, filterTier]);

  return (
    <Container fluid className="py-3">
      {/* P0-4: 资料库权限横幅 */}
      <LibraryPermissionBanner scope="标准法规库" />
      <Row className="mb-3">
        <Col>
          <h5><i className="bi bi-bookmark-check me-2"></i>标准法规知识库</h5>
          <small className="text-muted">船用齿轮箱相关国际标准、国标、船级社规范快速检索</small>
        </Col>
      </Row>

      {/* P2-2: 三层结构导航 */}
      <Row className="mb-2 g-2">
        <Col xs={12} sm={6} md={2}>
          <Card
            className={`text-center ${filterTier === 'all' ? 'border-dark border-2' : ''}`}
            style={{ cursor: 'pointer' }}
            onClick={() => setFilterTier('all')}
          >
            <Card.Body className="py-2">
              <i className="bi bi-grid d-block" style={{ fontSize: '1.2rem' }}></i>
              <strong>{tierCounts.all}</strong> <small className="d-block">全部</small>
            </Card.Body>
          </Card>
        </Col>
        {Object.entries(TIER_DEFINITIONS).map(([key, def]) => (
          <Col xs={12} sm={6} md={2} key={key}>
            <Card
              className={`text-center ${filterTier === key ? `border-${def.color} border-2` : ''}`}
              style={{ cursor: 'pointer' }}
              onClick={() => setFilterTier(filterTier === key ? 'all' : key)}
              title={def.note}
            >
              <Card.Body className="py-2">
                <i className={`bi ${def.icon} d-block text-${def.color}`} style={{ fontSize: '1.2rem' }}></i>
                <strong>{tierCounts[key] || 0}</strong>
                <small className="d-block">{def.label.split(' ')[0]}</small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filterTier !== 'all' && (
        <Alert variant="light" className="py-2 mb-3 small">
          <i className={`bi ${TIER_DEFINITIONS[filterTier]?.icon} me-2`}></i>
          <strong>{TIER_DEFINITIONS[filterTier]?.label}</strong> — {TIER_DEFINITIONS[filterTier]?.note}
        </Alert>
      )}

      <Row className="mb-3">
        <Col md={4}>
          <InputGroup>
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control placeholder="搜索标准号或关键词..." value={search} onChange={e => setSearch(e.target.value)} />
          </InputGroup>
        </Col>
        <Col md={3}>
          <Form.Select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
            {CATEGORIES.map(c => <option key={c} value={c}>{c === '全部' ? '全部分类' : c}</option>)}
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select value={filterOrg} onChange={e => setFilterOrg(e.target.value)}>
            {ORGS.map(o => <option key={o} value={o}>{o === '全部' ? '全部组织' : o}</option>)}
          </Form.Select>
        </Col>
        <Col md={2}>
          <Badge bg="info" className="py-2 px-3">{filtered.length} 项</Badge>
        </Col>
      </Row>

      <Row>
        <Col md={selectedStd ? 8 : 12}>
          <Card>
            <Card.Body className="p-0">
              <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
                <Table hover size="sm" className="mb-0">
                  <thead className="sticky-top bg-light">
                    <tr>
                      <th>标准号</th>
                      <th>发布机构</th>
                      <th>分类</th>
                      <th>说明</th>
                      <th>年份</th>
                      <th>状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(s => {
                      const tier = classifyTier(s.org);
                      const tierDef = TIER_DEFINITIONS[tier];
                      return (
                        <tr key={s.id} style={{ cursor: 'pointer' }} className={selectedStd?.id === s.id ? 'table-primary' : ''} onClick={() => setSelectedStd(s)}>
                          <td><strong>{s.name}</strong></td>
                          <td>
                            <Badge bg={tierDef?.color || 'secondary'} className="me-1" style={{ fontSize: '0.65em' }} title={tierDef?.label}>
                              <i className={`bi ${tierDef?.icon}`}></i>
                            </Badge>
                            <span>{s.org}</span>
                          </td>
                          <td><Badge bg="secondary">{s.category}</Badge></td>
                          <td className="small">{s.desc}</td>
                          <td>{s.year}</td>
                          <td><Badge bg="success">{s.status}</Badge></td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Col>
        {selectedStd && (
          <Col md={4}>
            <Card>
              <Card.Header className="d-flex justify-content-between">
                <strong>{selectedStd.name}</strong>
                <Button size="sm" variant="outline-secondary" onClick={() => setSelectedStd(null)}><i className="bi bi-x"></i></Button>
              </Card.Header>
              <Card.Body>
                <ListGroup variant="flush">
                  <ListGroup.Item><strong>标准号:</strong> {selectedStd.name}</ListGroup.Item>
                  <ListGroup.Item><strong>发布机构:</strong> {selectedStd.org}</ListGroup.Item>
                  <ListGroup.Item><strong>分类:</strong> {selectedStd.category}</ListGroup.Item>
                  <ListGroup.Item><strong>说明:</strong> {selectedStd.desc}</ListGroup.Item>
                  <ListGroup.Item><strong>发布年份:</strong> {selectedStd.year}</ListGroup.Item>
                  <ListGroup.Item><strong>状态:</strong> <Badge bg="success">{selectedStd.status}</Badge></ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        )}
      </Row>
    </Container>
  );
}
