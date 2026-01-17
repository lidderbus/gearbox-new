// src/components/AgreementDrawingSection.js
// 技术协议外形图展示组件
import React, { useState, useMemo, useCallback } from 'react';
import { Card, Row, Col, Button, ListGroup, Badge, Spinner, Alert } from 'react-bootstrap';
import {
  gearboxDwgDrawings,
  couplingDwgDrawings,
  getDwgDownloadUrl,
  getShareCADPreviewUrl,
  dwgSeriesInfo
} from '../data/dwgDrawings';

/**
 * 根据型号匹配DWG外形图
 * @param {string} model - 齿轮箱或联轴器型号
 * @param {string} type - 'gearbox' 或 'coupling'
 * @returns {Array} - 匹配的DWG文件列表
 */
const getDrawingsForModel = (model, type = 'gearbox') => {
  if (!model) return [];

  const dataSource = type === 'gearbox' ? gearboxDwgDrawings : couplingDwgDrawings;
  const normalizedModel = model.toUpperCase().trim();

  // 1. 精确匹配
  if (dataSource[normalizedModel]) {
    return dataSource[normalizedModel];
  }

  // 2. 去除后缀匹配 (如 HCM400A -> HCM400)
  const baseModel = normalizedModel.replace(/[A-Z]$/, '');
  if (dataSource[baseModel]) {
    return dataSource[baseModel];
  }

  // 3. 模糊匹配 - 查找包含型号的条目
  const fuzzyMatches = [];
  Object.keys(dataSource).forEach(key => {
    if (key.includes(normalizedModel) || normalizedModel.includes(key)) {
      fuzzyMatches.push(...dataSource[key]);
    }
  });

  return fuzzyMatches;
};

/**
 * 提取型号的系列名称
 * @param {string} model - 型号
 * @returns {string} - 系列名称
 */
const extractSeries = (model) => {
  if (!model) return '';
  const match = model.match(/^([A-Z]+)/i);
  return match ? match[1].toUpperCase() : '';
};

/**
 * 技术协议外形图展示组件
 */
const AgreementDrawingSection = ({
  gearboxModel,
  couplingModel,
  colors = {},
  theme = 'light',
  onDrawingSelect = () => {}
}) => {
  const [selectedDrawing, setSelectedDrawing] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewError, setPreviewError] = useState(null);

  // 获取齿轮箱外形图
  const gearboxDrawings = useMemo(() => {
    return getDrawingsForModel(gearboxModel, 'gearbox');
  }, [gearboxModel]);

  // 获取联轴器外形图
  const couplingDrawings = useMemo(() => {
    return getDrawingsForModel(couplingModel, 'coupling');
  }, [couplingModel]);

  // 获取系列信息
  const gearboxSeriesInfo = useMemo(() => {
    const series = extractSeries(gearboxModel);
    return dwgSeriesInfo[series] || { name: series, description: '未知系列' };
  }, [gearboxModel]);

  const couplingSeriesInfoData = useMemo(() => {
    const series = extractSeries(couplingModel);
    return dwgSeriesInfo[series] || { name: series, description: '未知系列' };
  }, [couplingModel]);

  // 处理预览
  const handlePreview = useCallback((drawing) => {
    setLoading(true);
    setPreviewError(null);
    setSelectedDrawing(drawing);

    // 模拟加载延迟
    setTimeout(() => {
      setLoading(false);
    }, 500);

    onDrawingSelect(drawing);
  }, [onDrawingSelect]);

  // 处理下载
  const handleDownload = useCallback((drawing) => {
    const downloadUrl = getDwgDownloadUrl(drawing.filePath);
    window.open(downloadUrl, '_blank');
  }, []);

  // 渲染单个外形图项
  const renderDrawingItem = (drawing, index) => (
    <ListGroup.Item
      key={drawing.id || index}
      className="d-flex justify-content-between align-items-start"
      style={{
        backgroundColor: colors.card || '#fff',
        borderColor: colors.border || '#dee2e6'
      }}
    >
      <div className="ms-2 me-auto">
        <div className="fw-bold" style={{ color: colors.text || '#333' }}>
          {drawing.fileName}
        </div>
        <small className="text-muted">
          <Badge bg="secondary" className="me-2">{drawing.series}</Badge>
          <span className="me-2">{drawing.fileSize}</span>
          <span>{drawing.updateDate}</span>
        </small>
      </div>
      <div>
        <Button
          variant="outline-primary"
          size="sm"
          className="me-1"
          onClick={() => handlePreview(drawing)}
        >
          <i className="bi bi-eye me-1"></i>预览
        </Button>
        <Button
          variant="outline-success"
          size="sm"
          onClick={() => handleDownload(drawing)}
        >
          <i className="bi bi-download me-1"></i>下载
        </Button>
      </div>
    </ListGroup.Item>
  );

  // 渲染预览区域
  const renderPreview = () => {
    if (!selectedDrawing) {
      return (
        <div
          className="text-center p-5"
          style={{
            border: `2px dashed ${colors.border || '#dee2e6'}`,
            borderRadius: '8px',
            color: colors.text || '#6c757d'
          }}
        >
          <i className="bi bi-image" style={{ fontSize: '3rem' }}></i>
          <p className="mt-3">选择外形图进行预览</p>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="text-center p-5">
          <Spinner animation="border" variant="primary" />
          <p className="mt-3">加载预览中...</p>
        </div>
      );
    }

    if (previewError) {
      return (
        <Alert variant="warning" className="text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {previewError}
        </Alert>
      );
    }

    const previewUrl = getShareCADPreviewUrl(selectedDrawing.filePath);

    return (
      <div>
        <div className="mb-2 d-flex justify-content-between align-items-center">
          <strong style={{ color: colors.text || '#333' }}>
            {selectedDrawing.fileName}
          </strong>
          <Button
            variant="link"
            size="sm"
            onClick={() => window.open(previewUrl, '_blank')}
          >
            <i className="bi bi-arrows-fullscreen me-1"></i>全屏预览
          </Button>
        </div>
        <iframe
          src={previewUrl}
          style={{
            width: '100%',
            height: '400px',
            border: `1px solid ${colors.border || '#dee2e6'}`,
            borderRadius: '4px'
          }}
          title={`预览 ${selectedDrawing.fileName}`}
        />
        <div className="mt-2 text-muted small">
          <i className="bi bi-info-circle me-1"></i>
          使用 ShareCAD 在线预览DWG文件
        </div>
      </div>
    );
  };

  return (
    <Card className="mb-4" style={{ backgroundColor: colors.card, borderColor: colors.border }}>
      <Card.Header style={{ backgroundColor: colors.headerBg || '#f8f9fa', color: colors.headerText || '#333' }}>
        <div className="d-flex justify-content-between align-items-center">
          <span>
            <i className="bi bi-file-earmark-image me-2"></i>
            外形图资源
          </span>
          <Badge bg="info">
            共 {gearboxDrawings.length + couplingDrawings.length} 个文件
          </Badge>
        </div>
      </Card.Header>

      <Card.Body>
        <Row>
          {/* 左侧：外形图列表 */}
          <Col md={5}>
            {/* 齿轮箱外形图 */}
            <div className="mb-4">
              <h6 style={{ color: colors.text || '#333' }}>
                <i className="bi bi-gear me-2"></i>
                齿轮箱外形图
                {gearboxModel && (
                  <Badge bg="primary" className="ms-2">{gearboxModel}</Badge>
                )}
              </h6>

              {gearboxDrawings.length > 0 ? (
                <ListGroup variant="flush" style={{ maxHeight: '250px', overflow: 'auto' }}>
                  {gearboxDrawings.map((drawing, index) => renderDrawingItem(drawing, index))}
                </ListGroup>
              ) : (
                <Alert variant="info" className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  {gearboxModel
                    ? `未找到 ${gearboxModel} 的外形图，请联系技术部门获取`
                    : '请先选择齿轮箱型号'}
                </Alert>
              )}
            </div>

            {/* 联轴器外形图 */}
            <div>
              <h6 style={{ color: colors.text || '#333' }}>
                <i className="bi bi-link-45deg me-2"></i>
                联轴器外形图
                {couplingModel && (
                  <Badge bg="success" className="ms-2">{couplingModel}</Badge>
                )}
              </h6>

              {couplingDrawings.length > 0 ? (
                <ListGroup variant="flush" style={{ maxHeight: '200px', overflow: 'auto' }}>
                  {couplingDrawings.map((drawing, index) => renderDrawingItem(drawing, index))}
                </ListGroup>
              ) : (
                <Alert variant="info" className="mb-0">
                  <i className="bi bi-info-circle me-2"></i>
                  {couplingModel
                    ? `未找到 ${couplingModel} 的外形图`
                    : '请先选择联轴器型号'}
                </Alert>
              )}
            </div>
          </Col>

          {/* 右侧：预览区域 */}
          <Col md={7}>
            {renderPreview()}
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default AgreementDrawingSection;
