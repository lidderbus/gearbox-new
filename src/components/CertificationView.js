// src/components/CertificationView.js
// 船级社认证信息库：各船级社认证要求、产品认证状态查询
import React, { useState, useMemo } from 'react';
import { Container, Row, Col, Card, Form, Table, Badge, Button, Alert, InputGroup, Tab, Tabs, ListGroup } from 'react-bootstrap';

const CLASS_SOCIETIES = [
  { code: 'CCS', name: '中国船级社', country: '中国', logo: 'bi-shield-check', color: 'danger',
    certTypes: ['型式认可', '产品检验', '工厂认可'], website: 'www.ccs.org.cn' },
  { code: 'DNV', name: 'DNV船级社', country: '挪威', logo: 'bi-shield-check', color: 'primary',
    certTypes: ['Type Approval', 'Product Certificate', 'Manufacturing Survey'], website: 'www.dnv.com' },
  { code: 'BV', name: '法国船级社', country: '法国', logo: 'bi-shield-check', color: 'info',
    certTypes: ['Type Approval', 'Product Certificate'], website: 'www.bureauveritas.com' },
  { code: 'LR', name: '英国劳氏', country: '英国', logo: 'bi-shield-check', color: 'success',
    certTypes: ['Type Approval', 'Product Certificate', 'Quality Assurance'], website: 'www.lr.org' },
  { code: 'ABS', name: '美国船级社', country: '美国', logo: 'bi-shield-check', color: 'warning',
    certTypes: ['Type Approval', 'Design Appraisal', 'Product Certification'], website: 'www.eagle.org' },
  { code: 'NK', name: '日本海事协会', country: '日本', logo: 'bi-shield-check', color: 'secondary',
    certTypes: ['Type Approval', 'Product Certification'], website: 'www.classnk.or.jp' },
  { code: 'KR', name: '韩国船级社', country: '韩国', logo: 'bi-shield-check', color: 'dark',
    certTypes: ['Type Approval', 'Product Certification'], website: 'www.krs.co.kr' },
  { code: 'RS', name: '俄罗斯船级社', country: '俄罗斯', logo: 'bi-shield-check', color: 'info',
    certTypes: ['Type Approval', 'Product Certification'], website: 'www.rs-class.org' },
  { code: 'RINA', name: '意大利船级社', country: '意大利', logo: 'bi-shield-check', color: 'success',
    certTypes: ['Type Approval', 'Product Certification'], website: 'www.rina.org' },
  { code: 'IRS', name: '印度船级社', country: '印度', logo: 'bi-shield-check', color: 'warning',
    certTypes: ['Type Approval', 'Product Certification'], website: 'www.irclass.org' },
  { code: 'PRS', name: '波兰船级社', country: '波兰', logo: 'bi-shield-check', color: 'info',
    certTypes: ['Type Approval', 'Product Certification'], website: 'www.prs.pl' },
];

// 杭齿产品认证状态（示例数据）
const PRODUCT_CERTS = [
  { series: 'HC系列', models: 'HC65~HC2000', ccs: true, dnv: true, bv: true, lr: true, abs: true, nk: true, kr: true, rs: false, rina: true, irs: true, prs: false },
  { series: 'HCD系列', models: 'HCD138~HCD1400', ccs: true, dnv: true, bv: true, lr: true, abs: true, nk: false, kr: false, rs: false, rina: false, irs: false, prs: false },
  { series: 'GWC系列', models: 'GWC28.30~GWC85.95', ccs: true, dnv: true, bv: true, lr: true, abs: true, nk: true, kr: true, rs: true, rina: true, irs: true, prs: true },
  { series: 'GC系列', models: 'GCS/GCST/GCD', ccs: true, dnv: true, bv: false, lr: true, abs: false, nk: false, kr: false, rs: false, rina: false, irs: false, prs: false },
  { series: 'HCM系列', models: 'HCM140~HCM1400', ccs: true, dnv: true, bv: false, lr: false, abs: false, nk: false, kr: false, rs: false, rina: false, irs: false, prs: false },
  { series: 'MV系列', models: 'MV100~MV500', ccs: true, dnv: false, bv: false, lr: false, abs: false, nk: false, kr: false, rs: false, rina: false, irs: false, prs: false },
  { series: 'DT系列', models: 'DT700~DT1500', ccs: true, dnv: true, bv: false, lr: true, abs: false, nk: false, kr: false, rs: false, rina: false, irs: false, prs: false },
  { series: 'SGW系列', models: 'SGW/SGWL', ccs: true, dnv: true, bv: true, lr: true, abs: true, nk: true, kr: false, rs: false, rina: false, irs: false, prs: false },
  { series: 'HCA系列', models: 'HCA138~HCA400', ccs: true, dnv: true, bv: true, lr: true, abs: true, nk: false, kr: false, rs: false, rina: false, irs: false, prs: false },
  { series: 'MA系列', models: 'MA100~MA142', ccs: true, dnv: false, bv: false, lr: false, abs: false, nk: false, kr: false, rs: false, rina: false, irs: false, prs: false },
];

const CERT_REQUIREMENTS = [
  { phase: '1. 申请', desc: '向船级社提交认证申请，包括产品技术规格书、图纸、试验大纲', duration: '1-2周' },
  { phase: '2. 图纸审批', desc: '船级社审查设计图纸和计算书，确认符合规范要求', duration: '4-8周' },
  { phase: '3. 工厂审核', desc: '船级社验船师到工厂审核质量管理体系和生产能力', duration: '1-2天' },
  { phase: '4. 型式试验', desc: '按照船级社规范进行型式试验（性能、振动、噪音等）', duration: '2-4周' },
  { phase: '5. 证书签发', desc: '试验合格后签发型式认可证书，有效期通常5年', duration: '2-4周' },
  { phase: '6. 年度审核', desc: '每年接受船级社年度审核，确保持续符合要求', duration: '持续' },
  { phase: '7. 证书更新', desc: '证书到期前6个月申请更新，提交近5年生产和质量记录，必要时补充试验', duration: '4-8周' },
  { phase: '8. 特殊检验', desc: '产品设计变更、材料变更或工艺重大调整时，需申请特殊检验并取得船级社认可', duration: '视情况' },
];

export default function CertificationView({ colors, theme }) {
  const [activeTab, setActiveTab] = useState('status');
  const [filterSociety, setFilterSociety] = useState('all');
  const [searchSeries, setSearchSeries] = useState('');

  const filteredCerts = useMemo(() => {
    let list = PRODUCT_CERTS;
    if (searchSeries) {
      list = list.filter(p => p.series.includes(searchSeries) || p.models.includes(searchSeries));
    }
    return list;
  }, [searchSeries]);

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col>
          <h5><i className="bi bi-patch-check me-2"></i>船级社认证信息</h5>
          <small className="text-muted">查看各船级社认证状态、认证要求和流程指引</small>
        </Col>
      </Row>

      {/* 2026-05-31 P0: 认证矩阵为示意框架, 加常驻免责声明, 避免冒充真实持证状态 */}
      <Alert variant="warning" className="mb-3 py-2">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        <strong>认证状态为示意框架</strong>，仅供了解杭齿各系列的船级社认证覆盖思路。
        具体「型号 × 船级社」的实际持证情况、证书号与有效期，<strong>以杭齿质量部最新有效证书为准</strong>；
        投标 / 技术协议前请向质量部核实。
      </Alert>

      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="status" title="认证状态">
          <Card>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>杭齿产品认证矩阵</span>
              <InputGroup size="sm" style={{ width: 200 }}>
                <Form.Control placeholder="搜索系列..." value={searchSeries} onChange={e => setSearchSeries(e.target.value)} />
              </InputGroup>
            </Card.Header>
            <Card.Body className="p-0">
              <div style={{ overflowX: 'auto' }}>
                <Table bordered size="sm" className="mb-0">
                  <thead>
                    <tr>
                      <th>产品系列</th>
                      <th>型号范围</th>
                      {CLASS_SOCIETIES.map(cs => (
                        <th key={cs.code} className="text-center" style={{ minWidth: 50 }}>{cs.code}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCerts.map((p, i) => (
                      <tr key={i}>
                        <td><strong>{p.series}</strong></td>
                        <td className="small">{p.models}</td>
                        {CLASS_SOCIETIES.map(cs => {
                          const key = cs.code.toLowerCase();
                          const has = p[key];
                          return (
                            <td key={cs.code} className="text-center">
                              {has ? <i className="bi bi-check-circle-fill text-success"></i> : <i className="bi bi-dash text-muted"></i>}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="societies" title="船级社介绍">
          <Row>
            {CLASS_SOCIETIES.map(cs => (
              <Col md={4} key={cs.code} className="mb-3">
                <Card className="h-100">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                      <i className={`bi ${cs.logo} text-${cs.color} me-2`} style={{ fontSize: '1.5rem' }}></i>
                      <div>
                        <strong>{cs.code}</strong>
                        <small className="d-block text-muted">{cs.name}</small>
                      </div>
                      <Badge bg="light" text="dark" className="ms-auto">{cs.country}</Badge>
                    </div>
                    <div className="small">
                      <strong>认证类型:</strong>
                      <div className="d-flex flex-wrap gap-1 mt-1">
                        {cs.certTypes.map((t, i) => (
                          <Badge key={i} bg="outline-primary" text="primary" className="border">{t}</Badge>
                        ))}
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Tab>

        <Tab eventKey="process" title="认证流程">
          <Card>
            <Card.Header>型式认可（Type Approval）标准流程</Card.Header>
            <Card.Body>
              {CERT_REQUIREMENTS.map((step, i) => (
                <div key={i} className="d-flex mb-3">
                  <div className="me-3 text-center" style={{ minWidth: 40 }}>
                    <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center" style={{ width: 32, height: 32 }}>{i + 1}</div>
                    {i < CERT_REQUIREMENTS.length - 1 && <div style={{ width: 2, height: 30, background: '#dee2e6', margin: '4px auto' }}></div>}
                  </div>
                  <div>
                    <strong>{step.phase}</strong>
                    <Badge bg="light" text="dark" className="ms-2">{step.duration}</Badge>
                    <p className="mb-0 mt-1 text-muted small">{step.desc}</p>
                  </div>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </Container>
  );
}
