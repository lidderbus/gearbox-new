/**
 * CompetitorPdfViewer.js
 * 竞品PDF产品手册/外形图内嵌预览组件
 * 复用 DwgViewer.js 的 <object type="application/pdf"> 模式
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Badge, Button, Spinner } from 'react-bootstrap';
import { getCompetitorPdfUrl } from '../../data/competitorDrawings';

const CompetitorPdfViewer = ({
  selectedCatalog,
  manufacturer,
  onClose,
  colors = {},
  theme = 'light'
}) => {
  const [previewStatus, setPreviewStatus] = useState('loading');
  const [objectKey, setObjectKey] = useState(0);

  useEffect(() => {
    if (selectedCatalog) {
      setPreviewStatus('loading');
      setObjectKey(prev => prev + 1);
      const timer = setTimeout(() => {
        setPreviewStatus(prev => prev === 'loading' ? 'error' : prev);
      }, 10000);
      return () => clearTimeout(timer);
    }
  }, [selectedCatalog?.id]);

  const handleLoad = useCallback(() => {
    setPreviewStatus('loaded');
  }, []);

  const handleRetry = useCallback(() => {
    setPreviewStatus('loading');
    setObjectKey(prev => prev + 1);
  }, []);

  if (!selectedCatalog) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Body className="text-center py-5">
          <i className="bi bi-file-earmark-pdf" style={{ fontSize: '64px', color: '#dc3545', opacity: 0.3 }}></i>
          <p style={{ color: colors.text, opacity: 0.7 }} className="mt-3">
            请从左侧选择厂商和PDF文档查看
          </p>
        </Card.Body>
      </Card>
    );
  }

  const pdfUrl = getCompetitorPdfUrl(selectedCatalog.filePath);

  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header
        style={{ backgroundColor: colors.headerBg, color: colors.headerText }}
        className="d-flex justify-content-between align-items-center"
      >
        <span>
          <i className="bi bi-file-earmark-pdf me-2"></i>
          {selectedCatalog.title}
        </span>
        <div className="d-flex gap-2">
          <Button variant="outline-secondary" size="sm" onClick={onClose}>
            <i className="bi bi-x"></i>
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {/* 文档信息 */}
        <Card className="mb-3" style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#1a1a1a' }}>
          <Card.Body className="py-2">
            <Row>
              <Col md={7}>
                <h6 style={{ color: colors.text }} className="mb-1">
                  <i className="bi bi-building me-2"></i>
                  {manufacturer?.name || selectedCatalog.manufacturer}
                </h6>
                <small className="text-muted">{selectedCatalog.description}</small>
              </Col>
              <Col md={5}>
                <div className="d-flex flex-wrap gap-2 justify-content-md-end mt-2 mt-md-0">
                  {selectedCatalog.year && <Badge bg="info">{selectedCatalog.year}年</Badge>}
                  {selectedCatalog.language && <Badge bg="secondary">{selectedCatalog.language === 'en' ? '英文' : '中文'}</Badge>}
                  {selectedCatalog.fileSize && <Badge bg="outline-dark" text="dark">{selectedCatalog.fileSize}</Badge>}
                  {selectedCatalog.hasOutlineDrawings && <Badge bg="success">含外形图</Badge>}
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* PDF嵌入预览 */}
        <Card className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center py-2">
            <span>
              <i className="bi bi-eye me-2"></i>
              文档预览
              {previewStatus === 'loading' && (
                <Spinner animation="border" size="sm" className="ms-2" />
              )}
            </span>
            <div className="d-flex gap-2">
              {previewStatus === 'error' && (
                <Button variant="outline-secondary" size="sm" onClick={handleRetry}>
                  <i className="bi bi-arrow-clockwise me-1"></i>重试
                </Button>
              )}
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => window.open(pdfUrl, '_blank')}
              >
                <i className="bi bi-box-arrow-up-right me-1"></i>新窗口打开
              </Button>
              {selectedCatalog.sourceUrl && (
                <Button
                  variant="outline-info"
                  size="sm"
                  onClick={() => window.open(selectedCatalog.sourceUrl, '_blank')}
                >
                  <i className="bi bi-link-45deg me-1"></i>原始来源
                </Button>
              )}
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div style={{
              position: 'relative',
              width: '100%',
              height: '650px',
              backgroundColor: theme === 'light' ? '#f0f0f0' : '#2a2a2a'
            }}>
              {/* Loading overlay */}
              {previewStatus === 'loading' && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                  zIndex: 10
                }}>
                  <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                  <p className="mt-3" style={{ color: colors.text }}>正在加载PDF预览...</p>
                  <small className="text-muted">大文件加载可能需要几秒钟</small>
                </div>
              )}

              {/* Error fallback */}
              {previewStatus === 'error' && (
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  backgroundColor: theme === 'light' ? '#f8f9fa' : '#1a1a1a',
                  zIndex: 10, padding: '20px'
                }}>
                  <i className="bi bi-exclamation-triangle" style={{ fontSize: '48px', color: '#ffc107' }}></i>
                  <h5 className="mt-3" style={{ color: colors.text }}>PDF预览加载失败</h5>
                  <p className="text-muted text-center mb-3">可能是文件较大或网络问题，请尝试新窗口打开</p>
                  <div className="d-flex flex-column gap-2" style={{ maxWidth: '300px', width: '100%' }}>
                    <Button variant="primary" onClick={() => window.open(pdfUrl, '_blank')}>
                      <i className="bi bi-box-arrow-up-right me-2"></i>新窗口打开PDF
                    </Button>
                    {selectedCatalog.sourceUrl && (
                      <Button variant="outline-primary" onClick={() => window.open(selectedCatalog.sourceUrl, '_blank')}>
                        <i className="bi bi-link-45deg me-2"></i>访问原始来源
                      </Button>
                    )}
                  </div>
                </div>
              )}

              {/* PDF embed */}
              <object
                key={objectKey}
                data={pdfUrl}
                type="application/pdf"
                style={{
                  width: '100%', height: '100%', border: 'none',
                  display: previewStatus === 'error' ? 'none' : 'block'
                }}
                title={`${selectedCatalog.title} 预览`}
                onLoad={handleLoad}
                onError={() => setPreviewStatus('error')}
              >
                <embed src={pdfUrl} type="application/pdf" style={{ width: '100%', height: '100%' }} />
              </object>
            </div>
          </Card.Body>
        </Card>

        {/* 覆盖型号 */}
        {selectedCatalog.coversModels && selectedCatalog.coversModels.length > 0 && (
          <Card style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#1a1a1a' }}>
            <Card.Body className="py-2">
              <small className="text-muted d-block mb-1">覆盖型号:</small>
              <div className="d-flex flex-wrap gap-1">
                {selectedCatalog.coversModels.map(model => (
                  <Badge key={model} bg="light" text="dark" className="border">{model}</Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        )}
      </Card.Body>
    </Card>
  );
};

export default CompetitorPdfViewer;
