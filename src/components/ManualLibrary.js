// src/components/ManualLibrary.js
// 产品说明书库组件
// 功能: 浏览、搜索、查看齿轮箱产品说明书
// 更新时间: 2026-01-20

import React, { useState, useMemo, useEffect } from 'react';
import { Card, Row, Col, Form, InputGroup, Button, Table, Badge, Alert, Tabs, Tab } from 'react-bootstrap';
import { getAllManuals, getManualInfo } from '../data/gearboxManuals';
import PDFLoadingModal from './PDFLoadingModal';
import PDFPreviewModal from './PDFPreviewModal';

/**
 * 说明书库组件
 * 按系列分类展示所有产品说明书,支持搜索和在线预览
 */
// 大文件阈值(MB)，超过此大小显示进度弹窗
const LARGE_FILE_THRESHOLD_MB = 15;

const ManualLibrary = ({ colors, theme }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loadingPdf, setLoadingPdf] = useState(null); // 正在加载的PDF
  const [previewPdf, setPreviewPdf] = useState(null); // 预览的PDF

  // URL参数解析 - 支持从外部链接直接搜索
  useEffect(() => {
    try {
      const hash = window.location.hash;
      const queryStart = hash.indexOf('?');
      if (queryStart !== -1) {
        const params = new URLSearchParams(hash.slice(queryStart + 1));
        const searchParam = params.get('search');
        if (searchParam) {
          setSearchTerm(searchParam);
        }
      }
    } catch (e) {
      console.warn('解析URL参数失败:', e);
    }
  }, []);

  // 获取所有说明书数据
  const manuals = useMemo(() => getAllManuals(), []);

  // 合并并去重说明书列表
  const allManualsList = useMemo(() => {
    const seen = new Set();
    const result = [];

    [...manuals.smallPower, ...manuals.largePower].forEach(manual => {
      if (!seen.has(manual.path)) {
        seen.add(manual.path);
        result.push(manual);
      }
    });

    return result;
  }, [manuals]);

  // 根据搜索词和分类过滤
  const filteredManuals = useMemo(() => {
    let list = activeCategory === 'all'
      ? allManualsList
      : activeCategory === 'small-power'
        ? manuals.smallPower
        : manuals.largePower;

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter(m =>
        m.model.toLowerCase().includes(term) ||
        m.title.toLowerCase().includes(term)
      );
    }

    return list;
  }, [allManualsList, manuals, activeCategory, searchTerm]);

  // 判断是否为大文件
  const isLargeFile = (manual) => {
    const sizeMatch = manual.fileSize?.match(/(\d+)/);
    const sizeInMB = sizeMatch ? parseInt(sizeMatch[1]) : 0;
    return sizeInMB >= LARGE_FILE_THRESHOLD_MB;
  };

  // 打开说明书
  // 小文件直接打开，大文件显示下载进度
  const openManual = (manual) => {
    if (!isLargeFile(manual)) {
      // 小文件直接打开
      window.open(manual.path, '_blank');
    } else {
      // 大文件显示进度弹窗
      setLoadingPdf(manual);
    }
  };

  // 预览PDF首页
  const previewManual = (manual) => {
    setPreviewPdf(manual);
  };

  // 获取分类Badge
  const getCategoryBadge = (category) => {
    return category === 'small-power'
      ? <Badge bg="success">中小功率</Badge>
      : <Badge bg="primary">大功率</Badge>;
  };

  return (
    <Card className="shadow-sm" style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
      <Card.Header style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-book me-2"></i>
            产品说明书库
          </span>
          <Badge bg="info">{allManualsList.length} 个说明书</Badge>
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
              <option value="all">全部分类 ({allManualsList.length})</option>
              <option value="small-power">中小功率 ({manuals.smallPower.length})</option>
              <option value="large-power">大功率 ({manuals.largePower.length})</option>
            </Form.Select>
          </Col>
        </Row>

        {/* 提示信息 */}
        <Alert variant="info" className="mb-4">
          <i className="bi bi-info-circle me-2"></i>
          <strong>大文件(&ge;15MB)</strong>：点击 <i className="bi bi-binoculars"></i> 可快速预览首页，确认后再打开完整PDF。
          <br />
          <small className="text-muted">说明书包含产品技术参数、安装指南、维护保养等内容。</small>
        </Alert>

        {/* 说明书列表 */}
        {filteredManuals.length === 0 ? (
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            未找到匹配的说明书,请尝试其他搜索词。
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
                      <th style={{ width: '15%' }}>型号</th>
                      <th style={{ width: '40%' }}>说明书名称</th>
                      <th style={{ width: '15%' }}>分类</th>
                      <th style={{ width: '10%' }}>大小</th>
                      <th style={{ width: '20%' }}>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredManuals.map((manual, index) => (
                      <tr key={manual.path + index}>
                        <td>
                          <strong>{manual.model}</strong>
                        </td>
                        <td>
                          <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                          {manual.title}
                        </td>
                        <td>{getCategoryBadge(manual.category)}</td>
                        <td>{manual.fileSize}</td>
                        <td>
                          {isLargeFile(manual) && (
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => previewManual(manual)}
                              className="me-1"
                              title="预览首页"
                            >
                              <i className="bi bi-binoculars"></i>
                            </Button>
                          )}
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => openManual(manual)}
                            className="me-1"
                          >
                            <i className="bi bi-eye me-1"></i>
                            {isLargeFile(manual) ? '打开' : '查看'}
                          </Button>
                          <Button
                            variant="outline-secondary"
                            size="sm"
                            as="a"
                            href={manual.path}
                            download
                            title="下载"
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
                {filteredManuals.map((manual, index) => (
                  <Col md={4} lg={3} key={manual.path + index} className="mb-3">
                    <Card
                      className="h-100 manual-card"
                      style={{
                        backgroundColor: colors?.card,
                        borderColor: colors?.border,
                        cursor: 'pointer'
                      }}
                      onClick={() => openManual(manual)}
                    >
                      <Card.Body className="text-center">
                        <div className="mb-3">
                          <i
                            className="bi bi-file-earmark-pdf"
                            style={{ fontSize: '3rem', color: '#dc3545' }}
                          ></i>
                        </div>
                        <Card.Title style={{ fontSize: '1rem', color: colors?.headerText }}>
                          {manual.model}
                        </Card.Title>
                        <Card.Text style={{ fontSize: '0.85rem', color: colors?.muted }}>
                          {manual.title}
                        </Card.Text>
                        <div className="d-flex justify-content-between align-items-center">
                          {getCategoryBadge(manual.category)}
                          <small className="text-muted">{manual.fileSize}</small>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
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
                  <li><strong>预览首页</strong>: 点击 <i className="bi bi-binoculars"></i> 快速预览PDF第一页</li>
                  <li><strong>打开/查看</strong>: 直接在浏览器中打开完整PDF</li>
                  <li><strong>下载说明书</strong>: 点击下载按钮保存到本地</li>
                </ul>
              </Col>
              <Col md={6}>
                <ul style={{ color: colors?.text, marginBottom: 0, fontSize: '0.9rem' }}>
                  <li><strong>中小功率</strong>: 120/135/300/40A/400A/600A等系列</li>
                  <li><strong>大功率</strong>: GWC/GWS/HC900/HCT系列等</li>
                  <li><strong>选型结果</strong>: 在选型结果页面也可直接查看说明书</li>
                </ul>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* PDF下载进度弹窗 */}
        <PDFLoadingModal
          pdf={loadingPdf}
          onClose={() => setLoadingPdf(null)}
          colors={colors}
        />

        {/* PDF首页预览弹窗 */}
        <PDFPreviewModal
          pdf={previewPdf}
          onClose={() => setPreviewPdf(null)}
          onOpenFull={openManual}
          colors={colors}
        />
      </Card.Body>
    </Card>
  );
};

export default ManualLibrary;
