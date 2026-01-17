// src/components/OutlineDrawingQuery/DwgViewer.js
// DWG file viewer component with preview
import React from 'react';
import { Card, Row, Col, Badge, Button, Alert } from 'react-bootstrap';
import FavoriteButton from './FavoriteButton';
import { getDwgDownloadUrl, getShareCADPreviewUrl } from '../../data/outlineDrawings';

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

        {/* Embedded preview */}
        <Card className="mb-3">
          <Card.Header className="d-flex justify-content-between align-items-center py-2">
            <span>
              <i className="bi bi-eye me-2"></i>
              DWG在线预览
            </span>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => window.open(getShareCADPreviewUrl(selectedDwgFile.filePath), '_blank')}
            >
              <i className="bi bi-box-arrow-up-right me-1"></i>新窗口打开
            </Button>
          </Card.Header>
          <Card.Body className="p-0">
            <div style={{ position: 'relative', width: '100%', height: '450px', backgroundColor: '#f0f0f0' }}>
              <iframe
                src={`//sharecad.org/cadframe/load?url=${encodeURIComponent(getDwgDownloadUrl(selectedDwgFile.filePath))}`}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                title={`${selectedDwgFile.model} DWG预览`}
                allowFullScreen
              />
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
            <li><strong>在线预览:</strong> 上方预览区直接显示DWG图纸，可缩放和平移查看</li>
            <li><strong>下载DWG:</strong> 下载原始CAD文件，使用AutoCAD或兼容软件打开</li>
          </ul>
        </Alert>
      </Card.Body>
    </Card>
  );
};

export default DwgViewer;
