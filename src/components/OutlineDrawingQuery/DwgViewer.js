// src/components/OutlineDrawingQuery/DwgViewer.js
// DWG file viewer component with preview and fallback handling
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Row, Col, Badge, Button, Alert, Spinner } from 'react-bootstrap';
import FavoriteButton from './FavoriteButton';
import { getDwgDownloadUrl, getPdfPreviewUrl } from '../../data/outlineDrawings';

/**
 * DWG file viewer component
 */
const DwgViewer = ({
  selectedDwgFile,
  onClose,
  onToggleFavorite,
  colors = {},
  theme = 'light'
}) => {
  const [previewStatus, setPreviewStatus] = useState('loading'); // 'loading' | 'loaded' | 'error'
  const [iframeKey, setIframeKey] = useState(0);

  // Reset preview status when file changes
  useEffect(() => {
    if (selectedDwgFile) {
      setPreviewStatus('loading');
      setIframeKey(prev => prev + 1);

      // Set a timeout - if iframe doesn't load within 8 seconds, show fallback
      const timer = setTimeout(() => {
        setPreviewStatus(prev => prev === 'loading' ? 'error' : prev);
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [selectedDwgFile?.filePath]);

  const handleIframeLoad = useCallback(() => {
    // Note: ShareCAD errors inside iframe cannot be directly detected
    // We rely on timeout as primary error detection
    setPreviewStatus('loaded');
  }, []);

  const handleRetry = useCallback(() => {
    setPreviewStatus('loading');
    setIframeKey(prev => prev + 1);
  }, []);

  if (!selectedDwgFile) {
    return (
      <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
        <Card.Body className="text-center py-5">
          <i
            className="bi bi-file-earmark-binary"
            style={{ fontSize: '64px', color: '#6f42c1', opacity: 0.3 }}
          ></i>
          <p style={{ color: colors.text, opacity: 0.7 }} className="mt-3">
            请从左侧选择DWG文件查看详情
          </p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header
        style={{ backgroundColor: colors.headerBg, color: colors.headerText }}
        className="d-flex justify-content-between align-items-center"
      >
        <span>
          <i className="bi bi-file-earmark-binary me-2"></i>
          {selectedDwgFile.model} DWG文件详情
        </span>
        <div className="d-flex gap-2">
          <FavoriteButton
            model={selectedDwgFile.model}
            type={selectedDwgFile.type || 'gearbox'}
            onToggle={onToggleFavorite}
          />
          <Button
            variant="outline-secondary"
            size="sm"
            onClick={onClose}
          >
            <i className="bi bi-x"></i>
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        {/* File info card */}
        <Card className="mb-3" style={{ backgroundColor: theme === 'light' ? '#f8f9fa' : '#1a1a1a' }}>
          <Card.Body>
            <Row>
              <Col md={6}>
                <h5 style={{ color: colors.text }}>
                  <i className="bi bi-gear-wide-connected me-2"></i>
                  {selectedDwgFile.model}
                </h5>
                <p className="text-muted mb-2">{selectedDwgFile.category || '船用齿轮箱外形图'}</p>
                <Badge bg={selectedDwgFile.type === 'gearbox' ? 'primary' : 'success'} className="me-2">
                  {selectedDwgFile.type === 'gearbox' ? '齿轮箱' : '联轴器'}
                </Badge>
                {selectedDwgFile.series && (
                  <Badge bg="secondary">{selectedDwgFile.series}系列</Badge>
                )}
              </Col>
              <Col md={6}>
                <table className="table table-sm" style={{ color: colors.text }}>
                  <tbody>
                    <tr>
                      <td><strong>文件名:</strong></td>
                      <td>{selectedDwgFile.fileName}</td>
                    </tr>
                    <tr>
                      <td><strong>文件大小:</strong></td>
                      <td>{selectedDwgFile.fileSize}</td>
                    </tr>
                    <tr>
                      <td><strong>更新日期:</strong></td>
                      <td>{selectedDwgFile.updateDate}</td>
                    </tr>
                  </tbody>
                </table>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Embedded PDF preview */}
        <Card className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center py-2">
            <span>
              <i className="bi bi-eye me-2"></i>
              图纸预览
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
                onClick={() => window.open(getPdfPreviewUrl(selectedDwgFile.filePath), '_blank')}
              >
                <i className="bi bi-box-arrow-up-right me-1"></i>新窗口打开
              </Button>
            </div>
          </Card.Header>
          <Card.Body className="p-0">
            <div style={{ position: 'relative', width: '100%', height: '550px', backgroundColor: theme === 'light' ? '#f0f0f0' : '#2a2a2a' }}>
              {/* Loading overlay */}
              {previewStatus === 'loading' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme === 'light' ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.9)',
                    zIndex: 10
                  }}
                >
                  <Spinner animation="border" variant="primary" style={{ width: '3rem', height: '3rem' }} />
                  <p className="mt-3" style={{ color: colors.text }}>正在加载预览...</p>
                </div>
              )}

              {/* Error/Fallback UI */}
              {previewStatus === 'error' && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: theme === 'light' ? '#f8f9fa' : '#1a1a1a',
                    zIndex: 10,
                    padding: '20px'
                  }}
                >
                  <i className="bi bi-exclamation-triangle" style={{ fontSize: '48px', color: '#ffc107' }}></i>
                  <h5 className="mt-3" style={{ color: colors.text }}>PDF预览暂不可用</h5>
                  <p className="text-muted text-center mb-3">
                    PDF文件可能尚未生成，请下载DWG原始文件查看
                  </p>
                  <div className="d-flex flex-column gap-2" style={{ maxWidth: '300px', width: '100%' }}>
                    <Button
                      variant="primary"
                      onClick={() => window.open(getPdfPreviewUrl(selectedDwgFile.filePath), '_blank')}
                    >
                      <i className="bi bi-file-earmark-pdf me-2"></i>查看PDF版本
                    </Button>
                    <Button
                      variant="outline-primary"
                      onClick={() => window.open(getDwgDownloadUrl(selectedDwgFile.filePath), '_blank')}
                    >
                      <i className="bi bi-download me-2"></i>下载DWG文件
                    </Button>
                    <Button
                      variant="outline-secondary"
                      onClick={() => window.open('https://viewer.autodesk.com/', '_blank')}
                    >
                      <i className="bi bi-box-arrow-up-right me-2"></i>使用Autodesk在线查看器
                    </Button>
                  </div>
                  <small className="text-muted mt-3">
                    提示: 可使用AutoCAD、FreeCAD或Autodesk在线查看器打开DWG文件
                  </small>
                </div>
              )}

              {/* PDF embed - 使用object元素支持更好的PDF内嵌 */}
              <object
                key={iframeKey}
                data={getPdfPreviewUrl(selectedDwgFile.filePath)}
                type="application/pdf"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: previewStatus === 'error' ? 'none' : 'block'
                }}
                title={`${selectedDwgFile.model} 图纸预览`}
                onLoad={handleIframeLoad}
                onError={() => setPreviewStatus('error')}
              >
                {/* Fallback for browsers that don't support object */}
                <embed
                  src={getPdfPreviewUrl(selectedDwgFile.filePath)}
                  type="application/pdf"
                  style={{ width: '100%', height: '100%' }}
                />
              </object>
            </div>
          </Card.Body>
        </Card>

        {/* Action buttons */}
        <div className="d-grid gap-2">
          <Button
            variant="primary"
            size="lg"
            onClick={() => window.open(getDwgDownloadUrl(selectedDwgFile.filePath), '_blank')}
          >
            <i className="bi bi-download me-2"></i>下载DWG文件
          </Button>
        </div>

        {/* Usage instructions */}
        <Alert variant="info" className="mt-3">
          <i className="bi bi-info-circle me-2"></i>
          <strong>使用说明:</strong>
          <ul className="mb-0 mt-2">
            <li><strong>在线预览:</strong> 上方预览区显示PDF格式图纸，支持浏览器内置缩放和平移</li>
            <li><strong>下载DWG:</strong> 下载原始CAD文件，使用AutoCAD或兼容软件编辑</li>
            <li><strong>备选方案:</strong> 如需编辑DWG文件，可使用
              <a href="https://viewer.autodesk.com/" target="_blank" rel="noopener noreferrer" className="ms-1">
                Autodesk在线查看器
              </a>
              或
              <a href="https://www.freecad.org/" target="_blank" rel="noopener noreferrer" className="ms-1">
                FreeCAD
              </a>
            </li>
          </ul>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default DwgViewer;
