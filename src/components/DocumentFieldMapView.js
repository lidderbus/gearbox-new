// 文档字段映射可视化页 — 6 类文档(询单/报价/协议/合同/打包/扭振)的字段一览
// 数据源: src/data/documentFieldSchema.js
// 用途:让新人/销售清楚每张文档需要哪些字段、来自哪个数据源、是否必填、示例长什么样
import React, { useState, useMemo } from 'react';
import { Container, Card, Tabs, Tab, Badge, Table, Form, InputGroup, Button, Alert } from 'react-bootstrap';
import { DOCUMENT_SCHEMAS, FIELD_SOURCES } from '../data/documentFieldSchema';

const DocumentFieldMapView = ({ onNavigate, colors = {} }) => {
  const [activeKey, setActiveKey] = useState(Object.keys(DOCUMENT_SCHEMAS)[0]);
  const [search, setSearch] = useState('');
  const [requiredOnly, setRequiredOnly] = useState(false);

  const schema = DOCUMENT_SCHEMAS[activeKey];

  // 全文过滤(name + label + example + templateVar)
  const filteredSections = useMemo(() => {
    if (!schema) return [];
    const q = search.trim().toLowerCase();
    return schema.sections.map(sec => ({
      ...sec,
      fields: sec.fields.filter(f => {
        if (requiredOnly && !f.required) return false;
        if (!q) return true;
        const hay = [f.name, f.label, f.example, f.templateVar].filter(Boolean).join(' ').toLowerCase();
        return hay.includes(q);
      }),
    })).filter(sec => sec.fields.length > 0);
  }, [schema, search, requiredOnly]);

  const totalFields = useMemo(() => {
    if (!schema) return { total: 0, required: 0 };
    let total = 0, required = 0;
    schema.sections.forEach(s => s.fields.forEach(f => {
      total += 1;
      if (f.required) required += 1;
    }));
    return { total, required };
  }, [schema]);

  return (
    <Container fluid className="py-3">
      <div className="mb-3">
        <h4 className="mb-1"><i className="bi bi-file-earmark-medical me-2"></i>文档字段映射可视化</h4>
        <small className="text-muted">
          6 类文档生成器的字段、来源、必填标识与模板变量一览,新人 / 销售可快速判断填什么、缺什么、变量长什么样
        </small>
      </div>

      {/* 数据源图例 */}
      <Card className="mb-3">
        <Card.Body className="py-2">
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <small className="text-muted me-2">数据源图例:</small>
            {Object.entries(FIELD_SOURCES).map(([k, v]) => (
              <Badge key={k} bg={v.color} style={{ fontSize: '0.72rem' }}>
                <i className={`bi ${v.icon} me-1`}></i>{v.label}
              </Badge>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Tabs activeKey={activeKey} onSelect={(k) => k && setActiveKey(k)} className="mb-3" mountOnEnter>
        {Object.entries(DOCUMENT_SCHEMAS).map(([k, doc]) => (
          <Tab
            key={k}
            eventKey={k}
            title={
              <span><i className={`bi ${doc.icon} me-1`}></i>{doc.label}</span>
            }
          >
            {schema && schema.moduleKey === doc.moduleKey && (
              <Card>
                <Card.Header className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                  <div>
                    <strong style={{ color: `var(--bs-${doc.color})` }}>
                      <i className={`bi ${doc.icon} me-2`}></i>{doc.label}
                    </strong>
                    <Badge bg="info" className="ms-2">{totalFields.total} 字段</Badge>
                    <Badge bg="danger" className="ms-1">{totalFields.required} 必填</Badge>
                  </div>
                  <div className="d-flex gap-2 flex-wrap">
                    <Button
                      size="sm"
                      variant={`outline-${doc.color}`}
                      onClick={() => onNavigate && onNavigate(doc.moduleKey)}
                    >
                      <i className="bi bi-arrow-right-circle me-1"></i>打开{doc.label}
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  <Alert variant="light" className="py-2 mb-3 small">
                    <i className="bi bi-info-circle me-1"></i>
                    {doc.description}
                    <br />
                    <small className="text-muted">
                      实现:<code>{doc.component}</code>
                    </small>
                  </Alert>

                  <div className="d-flex gap-2 mb-3 flex-wrap align-items-center">
                    <InputGroup size="sm" style={{ maxWidth: 320 }}>
                      <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
                      <Form.Control
                        placeholder="搜索字段名 / 标签 / 示例..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />
                    </InputGroup>
                    <Form.Check
                      type="switch"
                      id="required-only"
                      label="只看必填"
                      checked={requiredOnly}
                      onChange={(e) => setRequiredOnly(e.target.checked)}
                    />
                  </div>

                  {filteredSections.length === 0 ? (
                    <Alert variant="light" className="text-center py-3 mb-0">
                      <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '1.5rem' }}></i>
                      未找到匹配字段
                    </Alert>
                  ) : filteredSections.map(sec => (
                    <div key={sec.title} className="mb-3">
                      <h6 className="mb-2" style={{ color: `var(--bs-${doc.color})` }}>
                        <i className="bi bi-folder me-1"></i>{sec.title}
                        <small className="text-muted ms-2" style={{ fontWeight: 'normal' }}>
                          ({sec.fields.length} 字段)
                        </small>
                      </h6>
                      <div style={{ overflowX: 'auto' }}>
                        <Table size="sm" hover bordered className="mb-0" style={{ fontSize: '0.85em' }}>
                          <thead className="bg-light">
                            <tr>
                              <th style={{ minWidth: 140 }}>字段名</th>
                              <th style={{ minWidth: 120 }}>标签</th>
                              <th style={{ minWidth: 100 }}>来源</th>
                              <th style={{ minWidth: 60 }}>必填</th>
                              <th>示例</th>
                              {sec.fields.some(f => f.templateVar) && <th style={{ minWidth: 140 }}>模板变量</th>}
                            </tr>
                          </thead>
                          <tbody>
                            {sec.fields.map(f => {
                              const src = FIELD_SOURCES[f.source] || { label: f.source, color: 'secondary', icon: 'bi-circle' };
                              return (
                                <tr key={f.name}>
                                  <td><code style={{ fontSize: '0.85em' }}>{f.name}</code></td>
                                  <td>{f.label}</td>
                                  <td>
                                    <Badge bg={src.color} style={{ fontSize: '0.7rem' }}>
                                      <i className={`bi ${src.icon} me-1`}></i>{src.label}
                                    </Badge>
                                  </td>
                                  <td className="text-center">
                                    {f.required ? <Badge bg="danger">必</Badge> : <span className="text-muted">—</span>}
                                  </td>
                                  <td><small className="text-muted">{f.example}</small></td>
                                  {sec.fields.some(ff => ff.templateVar) && (
                                    <td>{f.templateVar ? <code style={{ fontSize: '0.78em' }}>{f.templateVar}</code> : '—'}</td>
                                  )}
                                </tr>
                              );
                            })}
                          </tbody>
                        </Table>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            )}
          </Tab>
        ))}
      </Tabs>
    </Container>
  );
};

export default DocumentFieldMapView;
