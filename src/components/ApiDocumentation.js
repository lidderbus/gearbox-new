// src/components/ApiDocumentation.js
// API文档 - 系统接口与数据结构文档
import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, ListGroup, Accordion, Table } from 'react-bootstrap';

const API_SECTIONS = [
  {
    title: '选型计算',
    icon: 'bi-calculator',
    apis: [
      { name: 'performSelection(params)', desc: '执行齿轮箱选型计算', params: '{ power, speed, ratio, application }', returns: '匹配型号数组', module: 'selectionLogic.js' },
      { name: 'calculateCapacity(power, speed)', desc: '计算所需传递能力', params: 'power(kW), speed(rpm)', returns: 'capacity(kW/rpm)', module: 'selectionLogic.js' },
      { name: 'getMargin(required, actual)', desc: '计算功率余量', params: '所需/实际传递能力', returns: '余量百分比', module: 'selectionLogic.js' },
    ]
  },
  {
    title: '价格计算',
    icon: 'bi-currency-yuan',
    apis: [
      { name: 'getGwSeriesPrice(model, ratio)', desc: 'GW系列价格查询', params: '型号, 减速比', returns: '出厂价(元)', module: 'gearboxPricing.js' },
      { name: 'calculateDiscount(series, price)', desc: '系列折扣计算', params: '系列名, 原价', returns: '折后价(元)', module: 'priceManager.js' },
      { name: 'getRecommendedPump(model)', desc: '获取推荐备用泵型号', params: '齿轮箱型号', returns: '泵型号', module: 'gearboxMatchingMaps.js' },
    ]
  },
  {
    title: '数据查询',
    icon: 'bi-database',
    apis: [
      { name: 'embeddedData', desc: '运行时主数据源(640型号)', params: '—', returns: 'Array<GearboxModel>', module: 'embeddedData.js' },
      { name: 'completeGearboxData', desc: '完整技术数据(602型号)', params: '—', returns: 'Array<GearboxDetail>', module: 'completeGearboxData.js' },
      { name: 'initialData', desc: '初始化默认数据(121型号)', params: '—', returns: 'Array<GearboxBasic>', module: 'initialData.js' },
    ]
  },
  {
    title: '报价管理',
    icon: 'bi-receipt',
    apis: [
      { name: 'saveQuotation(data)', desc: '保存报价单到IndexedDB', params: 'QuotationData', returns: 'Promise<id>', module: 'QuotationView.js' },
      { name: 'loadQuotations()', desc: '加载所有报价单', params: '—', returns: 'Promise<Array>', module: 'QuotationView.js' },
      { name: 'exportQuotationPDF(data)', desc: '导出PDF报价单', params: 'QuotationData', returns: 'Blob', module: 'quotationExport.js' },
    ]
  },
  {
    title: '技术协议',
    icon: 'bi-file-earmark-ruled',
    apis: [
      { name: 'fillTemplate(template, data)', desc: '填充模板变量', params: '模板字符串, 数据对象', returns: '填充后文本', module: 'agreementTemplateManager.js' },
      { name: 'getSeriesDefaults(model)', desc: '获取系列默认参数', params: '型号前缀', returns: '默认参数对象', module: 'seriesDefaultParams.js' },
      { name: 'prepareTemplateData(selection)', desc: '准备模板数据', params: '选型结果', returns: '模板变量集', module: 'useAgreementGeneration.js' },
    ]
  },
  {
    title: '扭振分析',
    icon: 'bi-graph-up',
    apis: [
      { name: 'calculateTorsionalVibration(params)', desc: '扭振计算', params: '轴系参数', returns: '振动分析结果', module: 'TorsionalAnalysis.js' },
      { name: 'selectCPPSystem(params)', desc: 'CPP调距桨系统选型', params: '推进需求参数', returns: '推荐方案', module: 'cppSelectionAlgorithm.js' },
    ]
  },
];

const DATA_STRUCTURES = [
  {
    name: 'GearboxModel (embeddedData)',
    fields: [
      { name: 'model', type: 'string', desc: '型号名称' },
      { name: 'series', type: 'string', desc: '所属系列' },
      { name: 'transferCapacity', type: 'number', desc: '传递能力 (kW/rpm)' },
      { name: 'inputSpeedRange', type: '[min,max]', desc: '输入转速范围' },
      { name: 'ratios', type: 'Array', desc: '可用减速比列表' },
      { name: 'weight', type: 'number', desc: '净重 (kg)' },
    ]
  },
  {
    name: 'QuotationData',
    fields: [
      { name: 'id', type: 'string', desc: '报价单唯一ID' },
      { name: 'quoteNumber', type: 'string', desc: '报价编号' },
      { name: 'customerName', type: 'string', desc: '客户名称' },
      { name: 'items', type: 'Array', desc: '报价项目列表' },
      { name: 'totalAmount', type: 'number', desc: '总金额(元)' },
      { name: 'createdAt', type: 'Date', desc: '创建时间' },
    ]
  },
];

export default function ApiDocumentation({ colors, theme }) {
  const [activeSection, setActiveSection] = useState('0');

  return (
    <Container fluid className="py-3">
      <Row className="mb-3">
        <Col><h5><i className="bi bi-code-slash me-2"></i>API文档</h5>
          <small className="text-muted">系统核心函数接口与数据结构说明</small>
        </Col>
      </Row>

      <Row>
        <Col md={8}>
          <Card className="mb-3">
            <Card.Header>接口列表</Card.Header>
            <Card.Body className="p-0">
              <Accordion activeKey={activeSection} onSelect={setActiveSection}>
                {API_SECTIONS.map((section, i) => (
                  <Accordion.Item key={i} eventKey={String(i)}>
                    <Accordion.Header><i className={`bi ${section.icon} me-2`}></i>{section.title} <Badge bg="light" text="dark" className="ms-2">{section.apis.length}</Badge></Accordion.Header>
                    <Accordion.Body className="p-0">
                      <Table size="sm" className="mb-0">
                        <thead><tr><th>函数</th><th>说明</th><th>参数</th><th>返回值</th><th>模块</th></tr></thead>
                        <tbody>
                          {section.apis.map((api, j) => (
                            <tr key={j}>
                              <td><code className="text-primary">{api.name}</code></td>
                              <td className="small">{api.desc}</td>
                              <td className="small"><code>{api.params}</code></td>
                              <td className="small">{api.returns}</td>
                              <td><Badge bg="light" text="dark">{api.module}</Badge></td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card>
            <Card.Header>数据结构</Card.Header>
            <Card.Body className="p-0">
              {DATA_STRUCTURES.map((ds, i) => (
                <div key={i} className="border-bottom p-3">
                  <h6><code>{ds.name}</code></h6>
                  <Table size="sm" className="mb-0 small">
                    <tbody>
                      {ds.fields.map((f, j) => (
                        <tr key={j}>
                          <td><code>{f.name}</code></td>
                          <td><Badge bg="light" text="dark">{f.type}</Badge></td>
                          <td>{f.desc}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}
