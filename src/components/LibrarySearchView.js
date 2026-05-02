// 资料库全局检索页 — 跨 5 类资料源(图纸/DWG/说明书/协议模板/配机案例/标准法规)统一搜索
// 数据通过 src/services/globalSearchService 聚合
import React, { useState, useMemo, useDeferredValue } from 'react';
import { Container, Card, Form, InputGroup, Badge, Button, Row, Col, ListGroup, Alert } from 'react-bootstrap';
import { search, getCounts, SOURCE_TYPES } from '../services/globalSearchService';

const LibrarySearchView = ({ colors = {} }) => {
  // 接收命令面板的预设搜索词(sessionStorage.library_search_preset)
  const initialQuery = (() => {
    try {
      const preset = sessionStorage.getItem('library_search_preset');
      if (preset) {
        sessionStorage.removeItem('library_search_preset');
        return preset;
      }
    } catch (e) { /* ignore */ }
    return '';
  })();
  const [query, setQuery] = useState(initialQuery);
  const [activeTypes, setActiveTypes] = useState([]); // 空数组 = 全部
  const deferredQuery = useDeferredValue(query);

  const counts = useMemo(() => getCounts(), []);

  const results = useMemo(() => {
    return search(deferredQuery, {
      types: activeTypes.length > 0 ? activeTypes : null,
      limit: 200,
    });
  }, [deferredQuery, activeTypes]);

  const toggleType = (t) => {
    setActiveTypes(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]
    );
  };

  const clearFilters = () => {
    setActiveTypes([]);
    setQuery('');
  };

  return (
    <Container fluid className="py-3">
      <div className="mb-3">
        <h4 className="mb-1"><i className="bi bi-search me-2"></i>资料库全局检索</h4>
        <small className="text-muted">
          一次搜索 5 类共 <strong>{counts.total}</strong> 条记录:外形图 {counts.drawing||0} + DWG {counts.dwg||0} + 说明书 {counts.manual||0} + 协议 {counts.template||0} + 配机案例 {counts.case||0} + 标准法规 {counts.standard||0}
        </small>
      </div>

      <Card className="mb-3">
        <Card.Body>
          <InputGroup size="lg" className="mb-3">
            <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
            <Form.Control
              autoFocus
              placeholder="型号 / 系列 / 文件名 / 主机品牌 / 标准名 / 关键词…(如: HC1000, 康明斯, ISO 6336, GWC30)"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <Button variant="outline-secondary" onClick={() => setQuery('')}>
                <i className="bi bi-x-lg"></i>
              </Button>
            )}
          </InputGroup>

          {/* 源类型过滤 chips */}
          <div className="d-flex align-items-center flex-wrap gap-2">
            <small className="text-muted me-2">类型筛选:</small>
            {Object.entries(SOURCE_TYPES).map(([t, info]) => {
              const active = activeTypes.includes(t);
              const cnt = counts[t] || 0;
              return (
                <Button
                  key={t}
                  size="sm"
                  variant={active ? info.color : `outline-${info.color}`}
                  onClick={() => toggleType(t)}
                  disabled={cnt === 0}
                  style={{ fontSize: '0.78rem' }}
                >
                  <i className={`bi ${info.icon} me-1`}></i>
                  {info.label}
                  <Badge bg="light" text="dark" className="ms-2">{cnt}</Badge>
                </Button>
              );
            })}
            {(activeTypes.length > 0 || query) && (
              <Button size="sm" variant="link" className="text-decoration-none" onClick={clearFilters}>
                <i className="bi bi-x-circle me-1"></i>清空
              </Button>
            )}
          </div>
        </Card.Body>
      </Card>

      <div className="d-flex justify-content-between align-items-center mb-2 flex-wrap gap-2">
        <div>
          <strong>{results.length}</strong> <small className="text-muted">条结果</small>
          {results.length === 200 && <small className="text-muted ms-2">(已截断,请缩小关键词范围)</small>}
        </div>
        {query && (
          <small className="text-muted">关键词:<code>{query}</code></small>
        )}
      </div>

      {results.length === 0 ? (
        <Alert variant="light" className="text-center py-4">
          <i className="bi bi-inbox d-block mb-2" style={{ fontSize: '2rem' }}></i>
          {query ? '未找到匹配项,请尝试其它关键词或减少类型筛选' : '请输入关键词开始检索'}
        </Alert>
      ) : (
        <Row className="g-2">
          {results.map(r => (
            <Col xs={12} md={6} lg={4} key={r.id}>
              <ResultCard record={r} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

const ResultCard = ({ record }) => {
  const info = SOURCE_TYPES[record.type] || { icon: 'bi-file', color: 'secondary', label: '未知' };

  return (
    <Card className="h-100" style={{ borderLeft: `3px solid var(--bs-${info.color})` }}>
      <Card.Body className="py-2 px-3">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <div className="d-flex align-items-center gap-2 flex-wrap">
            <i className={`bi ${info.icon} text-${info.color}`}></i>
            <Badge bg={info.color} style={{ fontSize: '0.68rem' }}>{info.label}</Badge>
            {record.model && (
              <code style={{ fontSize: '0.78rem' }}>{record.model}</code>
            )}
          </div>
        </div>
        <div className="mb-1" style={{ fontWeight: 500, fontSize: '0.92rem', wordBreak: 'break-word' }}>
          {record.title}
        </div>
        {record.subtitle && (
          <small className="text-muted d-block mb-2" style={{ fontSize: '0.78rem' }}>
            {record.subtitle}
          </small>
        )}
        {record.link && (
          <Button
            size="sm"
            variant={`outline-${info.color}`}
            href={record.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: '0.78rem' }}
          >
            <i className="bi bi-box-arrow-up-right me-1"></i>打开
          </Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default LibrarySearchView;
