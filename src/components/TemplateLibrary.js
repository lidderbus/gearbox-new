// src/components/TemplateLibrary.js
// 技术协议模板库组件
// 功能: 浏览、搜索、下载历史技术协议模板
// 更新时间: 2026-01-22

import React, { useState, useMemo } from 'react';
import { Card, Row, Col, Form, InputGroup, Button, Table, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { technicalAgreementTemplates, getCategories, searchTemplates, getTemplatesByCategory } from '../data/technicalAgreementTemplates';
import ClauseKnowledgeBase from './ClauseKnowledgeBase';

/**
 * 技术协议模板库组件
 * 按系列分类展示所有历史技术协议模板
 */
const TemplateLibrary = ({ colors, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  // 获取所有分类
  const categories = useMemo(() => getCategories(), []);

  // 过滤模板
  const filteredTemplates = useMemo(() => {
    let templates = activeCategory === 'all'
      ? technicalAgreementTemplates
      : getTemplatesByCategory(activeCategory);

    if (searchTerm) {
      templates = templates.filter(t =>
        t.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return templates;
  }, [activeCategory, searchTerm]);

  // 打开模板 (PDF直接浏览器打开, DOC/DOCX触发下载)
  const openTemplate = (template) => {
    const baseUrl = window.location.origin;
    const fullUrl = `${baseUrl}${template.path}`;
    if (template.type === 'pdf') {
      window.open(fullUrl, '_blank');
    } else {
      const a = document.createElement('a');
      a.href = fullUrl;
      a.download = template.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // 获取文件类型图标
  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return <i className="bi bi-file-earmark-pdf text-danger"></i>;
      case 'docx':
        return <i className="bi bi-file-earmark-word text-primary"></i>;
      case 'doc':
      default:
        return <i className="bi bi-file-earmark-word text-primary"></i>;
    }
  };

  // 获取分类徽章颜色
  const getCategoryBadge = (category) => {
    const colorMap = {
      'GWC': 'primary',
      'GWS': 'info',
      'HC': 'success',
      'HCD': 'warning',
      'HCT': 'danger',
      'HCQ': 'secondary',
      '高弹联轴器': 'dark',
      '通用模板': 'light',
      '项目案例': 'info',
      '其他': 'secondary'
    };
    return <Badge bg={colorMap[category] || 'secondary'}>{category}</Badge>;
  };

  return (
    <Card className="shadow-sm" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
      <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-file-earmark-text me-2"></i>
            技术协议模板库
          </span>
          <Badge bg="info">{technicalAgreementTemplates.length} 个模板</Badge>
        </div>
      </Card.Header>

      <Card.Body>
        {/* 搜索和筛选 */}
        <Row className="mb-4">
          <Col md={6}>
            <InputGroup>
              <InputGroup.Text>
                <i className="bi bi-search"></i>
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="搜索型号或名称..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ backgroundColor: colors?.inputBg, color: colors?.text }}
              />
              {searchTerm && (
                <Button
                  variant="outline-secondary"
                  onClick={() => setSearchTerm('')}
                >
                  <i className="bi bi-x-lg"></i>
                </Button>
              )}
            </InputGroup>
          </Col>
          <Col md={6}>
            <Form.Select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
              style={{ backgroundColor: colors?.inputBg, color: colors?.text }}
            >
              <option value="all">全部分类 ({technicalAgreementTemplates.length})</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>
                  {cat} ({getTemplatesByCategory(cat).length})
                </option>
              ))}
            </Form.Select>
          </Col>
        </Row>

        {/* 提示信息 */}
        <Alert variant="warning" className="mb-4">
          <i className="bi bi-info-circle me-2"></i>
          <strong>历史模板参考:</strong> 这些是历年签订的技术协议存档，可作为新协议的参考模板。
          系统已内置协议生成功能，建议优先使用"技术协议"标签页自动生成。
        </Alert>

        {/* 模板列表 */}
        {filteredTemplates.length === 0 ? (
          <Alert variant="info">
            <i className="bi bi-exclamation-triangle me-2"></i>
            未找到匹配的模板，请尝试其他搜索词。
          </Alert>
        ) : (
          <Tabs defaultActiveKey="table" className="mb-3">
            <Tab eventKey="table" title={<><i className="bi bi-table me-1"></i>列表视图</>}>
              <div className="table-responsive">
                <Table
                  striped
                  bordered
                  hover
                  style={{
                    backgroundColor: colors?.card,
                    color: colors?.text,
                    borderColor: colors?.border
                  }}
                >
                  <thead>
                    <tr>
                      <th style={{ width: '12%' }}>型号</th>
                      <th style={{ width: '40%' }}>模板名称</th>
                      <th style={{ width: '12%' }}>分类</th>
                      <th style={{ width: '8%' }}>格式</th>
                      <th style={{ width: '8%' }}>年份</th>
                      <th style={{ width: '20%' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTemplates.map((template) => (
                      <tr key={template.id}>
                        <td>
                          <strong>{template.model}</strong>
                        </td>
                        <td>
                          {getFileIcon(template.type)}
                          <span className="ms-2">{template.title}</span>
                          {template.isTemplate && (
                            <Badge bg="success" className="ms-2">模板</Badge>
                          )}
                        </td>
                        <td>{getCategoryBadge(template.category)}</td>
                        <td>
                          <Badge bg={template.type === 'pdf' ? 'danger' : 'primary'}>
                            {template.type.toUpperCase()}
                          </Badge>
                        </td>
                        <td>{template.year}</td>
                        <td>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openTemplate(template)}
                            className="me-2"
                          >
                            <i className={`bi ${template.type === 'pdf' ? 'bi-eye' : 'bi-download'} me-1`}></i>
                            {template.type === 'pdf' ? '查看' : '下载'}
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            as="a"
                            href={template.path}
                            download
                          >
                            <i className="bi bi-download"></i>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Tab>

            <Tab eventKey="cards" title={<><i className="bi bi-grid me-1"></i>卡片视图</>}>
              <Row>
                {filteredTemplates.map((template) => (
                  <Col md={4} lg={3} key={template.id} className="mb-3">
                    <Card
                      className="h-100 template-card"
                      style={{
                        backgroundColor: colors?.card,
                        borderColor: colors?.border,
                        cursor: 'pointer'
                      }}
                      onClick={() => openTemplate(template)}
                    >
                      <Card.Body className="text-center">
                        <div className="mb-3">
                          {template.type === 'pdf' ? (
                            <i
                              className="bi bi-file-earmark-pdf"
                              style={{ fontSize: '2.5rem', color: '#dc3545' }}
                            ></i>
                          ) : (
                            <i
                              className="bi bi-file-earmark-word"
                              style={{ fontSize: '2.5rem', color: '#0d6efd' }}
                            ></i>
                          )}
                        </div>
                        <Card.Title style={{ fontSize: '0.9rem', color: colors?.headerText }}>
                          {template.model}
                        </Card.Title>
                        <Card.Text style={{ fontSize: '0.8rem', color: colors?.muted }}>
                          {template.title}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          {getCategoryBadge(template.category)}
                          <small className="text-muted">{template.year}</small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Tab>

            <Tab eventKey="clauses" title={<><i className="bi bi-book me-1"></i>条款知识库</>}>
              <ClauseKnowledgeBase colors={colors} theme={theme} />
            </Tab>
          </Tabs>
        )}

        {/* 使用说明 */}
        <Card className="mt-4" style={{ backgroundColor: colors?.headerBg, borderColor: colors?.border }}>
          <Card.Body>
            <h6 style={{ color: colors?.headerText }}>
              <i className="bi bi-question-circle me-2"></i>
              使用说明
            </h6>
            <Row>
              <Col md={6}>
                <ul style={{ color: colors?.text, marginBottom: 0, fontSize: '0.9rem' }}>
                  <li><strong>查看模板</strong>: 点击"查看"按钮在浏览器中打开</li>
                  <li><strong>下载模板</strong>: 点击下载按钮保存到本地</li>
                  <li><strong>搜索模板</strong>: 输入型号或关键词搜索</li>
                </ul>
              </Col>
              <Col md={6}>
                <ul style={{ color: colors?.text, marginBottom: 0, fontSize: '0.9rem' }}>
                  <li><strong>GWC/GWS</strong>: 渔船系列齿轮箱</li>
                  <li><strong>HC/HCD/HCT</strong>: 标准船用齿轮箱</li>
                  <li><strong>通用模板</strong>: 可用于新协议的基础模板</li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default TemplateLibrary;
