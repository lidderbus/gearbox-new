// src/components/OutlineDrawingViewer.js
// 外形图查看器组件 - 支持放大、全屏、下载、DWG文件

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Modal, Button, ButtonGroup, Card, Badge, Row, Col, Alert, Tabs, Tab, ListGroup } from 'react-bootstrap';
import { getDwgDownloadUrl, getPdfPreviewUrl, getDwgFilesForModel } from '../data/outlineDrawings';

/**
 * 外形图查看器组件
 * @param {Object} props
 * @param {string} props.model - 型号
 * @param {Object} props.drawingData - 外形图数据
 * @param {string} props.type - 类型 ('gearbox' | 'coupling')
 * @param {Object} props.colors - 主题颜色
 * @param {string} props.theme - 主题 ('light' | 'dark')
 * @param {boolean} props.compact - 紧凑模式
 */
const OutlineDrawingViewer = ({
  model,
  drawingData,
  type = 'gearbox',
  colors = {},
  theme = 'light',
  compact = false,
  onClose
}) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [currentView, setCurrentView] = useState('mainView');
  const [zoom, setZoom] = useState(1);
  const [imageError, setImageError] = useState({});
  const imageRef = useRef(null);

  // 默认颜色配置
  const defaultColors = {
    card: theme === 'light' ? '#ffffff' : '#2d2d2d',
    text: theme === 'light' ? '#333333' : '#e0e0e0',
    headerBg: theme === 'light' ? '#f8f9fa' : '#1a1a1a',
    headerText: theme === 'light' ? '#495057' : '#e0e0e0',
    border: theme === 'light' ? '#dee2e6' : '#404040',
    primary: '#0d6efd',
    ...colors
  };

  // 视图类型映射
  const viewTypes = {
    mainView: { label: '主视图', icon: 'bi-image' },
    sideView: { label: '侧视图', icon: 'bi-image-alt' },
    topView: { label: '俯视图', icon: 'bi-square' },
    dimensions: { label: '尺寸图', icon: 'bi-rulers' },
    installationGuide: { label: '安装图', icon: 'bi-tools' }
  };

  // 获取可用的视图
  const getAvailableViews = useCallback(() => {
    if (!drawingData) return [];
    return Object.keys(viewTypes).filter(key => drawingData[key]);
  }, [drawingData]);

  // 获取该型号的DWG文件
  const dwgFiles = useMemo(() => {
    if (!model) return [];
    // 优先使用传入的drawingData中的dwgFiles
    if (drawingData?.dwgFiles && drawingData.dwgFiles.length > 0) {
      return drawingData.dwgFiles;
    }
    // 否则根据model查询
    return getDwgFilesForModel(model, type);
  }, [model, type, drawingData]);

  // 处理图片加载错误
  const handleImageError = useCallback((viewType) => {
    setImageError(prev => ({ ...prev, [viewType]: true }));
  }, []);

  // 处理缩放
  const handleZoom = useCallback((delta) => {
    setZoom(prev => Math.max(0.5, Math.min(3, prev + delta)));
  }, []);

  // 重置缩放
  const resetZoom = useCallback(() => {
    setZoom(1);
  }, []);

  // 下载图片
  const handleDownload = useCallback(async () => {
    if (!drawingData || !drawingData[currentView]) return;

    try {
      const response = await fetch(drawingData[currentView]);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${model}-${currentView}.${drawingData[currentView].split('.').pop()}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('下载失败:', error);
      // 如果fetch失败，尝试直接打开
      window.open(drawingData[currentView], '_blank');
    }
  }, [drawingData, currentView, model]);

  // 渲染占位符图片
  const renderPlaceholder = (viewType) => {
    const placeholderStyle = {
      width: '100%',
      height: compact ? '200px' : '400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme === 'light' ? '#f8f9fa' : '#2d2d2d',
      border: `2px dashed ${defaultColors.border}`,
      borderRadius: '8px',
      color: defaultColors.text
    };

    return (
      <div style={placeholderStyle}>
        <i className="bi bi-image" style={{ fontSize: '48px', opacity: 0.5 }}></i>
        <p className="mt-3 mb-1" style={{ fontSize: '16px' }}>
          {model} - {viewTypes[viewType]?.label || viewType}
        </p>
        <p style={{ fontSize: '12px', opacity: 0.7 }}>
          {imageError[viewType] ? '图片加载失败' : '图纸待上传'}
        </p>
        {drawingData?.available === false && (
          <Badge bg="warning" className="mt-2">待补充图纸</Badge>
        )}
        {/* 如果有DWG文件，显示查看按钮 */}
        {dwgFiles && dwgFiles.length > 0 && (
          <Button
            variant="outline-primary"
            size="sm"
            className="mt-2"
            onClick={() => window.open(getPdfPreviewUrl(dwgFiles[0].filePath), '_blank')}
          >
            <i className="bi bi-file-earmark-code me-1"></i>
            查看DWG图纸
          </Button>
        )}
      </div>
    );
  };

  // 渲染DWG预览iframe
  const renderDwgPreview = (fullscreen = false) => {
    if (!dwgFiles || dwgFiles.length === 0) return null;

    const previewUrl = getPdfPreviewUrl(dwgFiles[0].filePath);
    const height = fullscreen ? '80vh' : (compact ? '200px' : '400px');

    return (
      <div style={{ width: '100%', height, position: 'relative' }}>
        <iframe
          src={previewUrl}
          style={{
            width: '100%',
            height: '100%',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            backgroundColor: '#f8f9fa'
          }}
          title={`${model} DWG预览`}
          loading="lazy"
          allowFullScreen
        />
        <div
          style={{
            position: 'absolute',
            bottom: '10px',
            right: '10px',
            display: 'flex',
            gap: '8px'
          }}
        >
          <Badge bg="info" style={{ fontSize: '0.75rem' }}>
            <i className="bi bi-file-earmark-code me-1"></i>
            DWG在线预览
          </Badge>
          <Button
            variant="light"
            size="sm"
            onClick={() => window.open(previewUrl, '_blank')}
            title="在新窗口打开"
          >
            <i className="bi bi-box-arrow-up-right"></i>
          </Button>
        </div>
      </div>
    );
  };

  // 渲染图片
  const renderImage = (viewType, fullscreen = false) => {
    // 检查SVG是否可用: 有数据、有该视图路径、未出错、且标记为可用
    const svgAvailable = drawingData &&
                         drawingData[viewType] &&
                         !imageError[viewType] &&
                         drawingData.available !== false;

    // 如果SVG可用，显示SVG图片
    if (svgAvailable) {
      const imgStyle = {
        maxWidth: '100%',
        maxHeight: fullscreen ? '80vh' : (compact ? '200px' : '400px'),
        objectFit: 'contain',
        transform: `scale(${fullscreen ? zoom : 1})`,
        transition: 'transform 0.2s ease',
        cursor: fullscreen ? (zoom > 1 ? 'grab' : 'zoom-in') : 'pointer'
      };

      return (
        <img
          ref={imageRef}
          src={drawingData[viewType]}
          alt={`${model} ${viewTypes[viewType]?.label}`}
          style={imgStyle}
          onError={() => handleImageError(viewType)}
          onClick={() => !fullscreen && setShowFullscreen(true)}
        />
      );
    }

    // SVG不可用时，尝试使用DWG预览
    if (dwgFiles && dwgFiles.length > 0) {
      return renderDwgPreview(fullscreen);
    }

    // 最后显示占位符
    return renderPlaceholder(viewType);
  };

  // 渲染规格信息
  const renderSpecs = () => {
    if (!drawingData) return null;

    const specs = drawingData.specs || {};
    const items = [
      { label: '型号', value: model },
      { label: '描述', value: drawingData.description },
      { label: '功率范围', value: drawingData.powerRange },
      { label: '扭矩', value: drawingData.torque },
      { label: '最大扭矩', value: drawingData.maxTorque },
      { label: '孔径范围', value: drawingData.boreRange },
      ...Object.entries(specs).map(([key, value]) => ({ label: key, value }))
    ].filter(item => item.value);

    if (items.length === 0) return null;

    return (
      <Card className="mt-3" style={{ backgroundColor: defaultColors.card, borderColor: defaultColors.border }}>
        <Card.Header style={{ backgroundColor: defaultColors.headerBg, color: defaultColors.headerText }}>
          <i className="bi bi-info-circle me-2"></i>技术参数
        </Card.Header>
        <Card.Body>
          <Row>
            {items.map((item, index) => (
              <Col xs={6} md={4} key={index} className="mb-2">
                <small style={{ color: defaultColors.text, opacity: 0.7 }}>{item.label}</small>
                <div style={{ color: defaultColors.text, fontWeight: '500' }}>{item.value}</div>
              </Col>
            ))}
          </Row>
        </Card.Body>
      </Card>
    );
  };

  // 紧凑模式渲染
  if (compact) {
    return (
      <Card style={{ backgroundColor: defaultColors.card, borderColor: defaultColors.border }}>
        <Card.Body className="p-2">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span style={{ color: defaultColors.text, fontWeight: '500' }}>
              <i className={`bi ${type === 'gearbox' ? 'bi-gear-wide-connected' : 'bi-link-45deg'} me-2`}></i>
              {model}
            </span>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => setShowFullscreen(true)}
            >
              <i className="bi bi-arrows-fullscreen"></i>
            </Button>
          </div>
          <div style={{ textAlign: 'center' }}>
            {renderImage(currentView)}
          </div>
        </Card.Body>

        {/* 全屏模态框 */}
        <Modal
          show={showFullscreen}
          onHide={() => setShowFullscreen(false)}
          size="xl"
          centered
          fullscreen="lg-down"
        >
          <Modal.Header
            closeButton
            style={{ backgroundColor: defaultColors.headerBg, color: defaultColors.headerText }}
          >
            <Modal.Title>
              <i className={`bi ${type === 'gearbox' ? 'bi-gear-wide-connected' : 'bi-link-45deg'} me-2`}></i>
              {model} - {drawingData?.description || '外形图'}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: defaultColors.card }}>
            <OutlineDrawingViewer
              model={model}
              drawingData={drawingData}
              type={type}
              colors={colors}
              theme={theme}
              compact={false}
            />
          </Modal.Body>
        </Modal>
      </Card>
    );
  }

  // 完整模式渲染
  const availableViews = getAvailableViews();

  return (
    <div className="outline-drawing-viewer">
      {/* 没有图纸数据时的提示 */}
      {!drawingData && (
        <Alert variant="info">
          <i className="bi bi-info-circle me-2"></i>
          暂无 <strong>{model}</strong> 的外形图数据
        </Alert>
      )}

      {drawingData && (
        <>
          {/* 工具栏 */}
          <div className="d-flex justify-content-between align-items-center mb-3">
            <div>
              <Badge
                bg={type === 'gearbox' ? 'primary' : 'success'}
                className="me-2"
              >
                {type === 'gearbox' ? '齿轮箱' : '联轴器'}
              </Badge>
              {drawingData.recommended && (
                <Badge bg="warning" text="dark">
                  <i className="bi bi-star-fill me-1"></i>推荐
                </Badge>
              )}
              {drawingData.available === false && (
                <Badge bg="secondary" className="ms-2">待补充图纸</Badge>
              )}
            </div>
            <ButtonGroup size="sm">
              <Button
                variant="outline-secondary"
                onClick={() => handleZoom(-0.25)}
                disabled={zoom <= 0.5}
              >
                <i className="bi bi-zoom-out"></i>
              </Button>
              <Button
                variant="outline-secondary"
                onClick={resetZoom}
              >
                {Math.round(zoom * 100)}%
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => handleZoom(0.25)}
                disabled={zoom >= 3}
              >
                <i className="bi bi-zoom-in"></i>
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => setShowFullscreen(true)}
              >
                <i className="bi bi-arrows-fullscreen"></i>
              </Button>
              <Button
                variant="outline-primary"
                onClick={handleDownload}
                disabled={!drawingData[currentView] || imageError[currentView]}
              >
                <i className="bi bi-download"></i>
              </Button>
            </ButtonGroup>
          </div>

          {/* 视图切换标签 */}
          {availableViews.length > 1 ? (
            <Tabs
              activeKey={currentView}
              onSelect={(k) => setCurrentView(k)}
              className="mb-3"
            >
              {availableViews.map(viewKey => (
                <Tab
                  key={viewKey}
                  eventKey={viewKey}
                  title={
                    <span>
                      <i className={`bi ${viewTypes[viewKey]?.icon} me-1`}></i>
                      {viewTypes[viewKey]?.label}
                    </span>
                  }
                >
                  <div
                    style={{
                      textAlign: 'center',
                      padding: '20px',
                      backgroundColor: theme === 'light' ? '#f8f9fa' : '#1a1a1a',
                      borderRadius: '8px',
                      minHeight: '420px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {renderImage(viewKey, true)}
                  </div>
                </Tab>
              ))}
            </Tabs>
          ) : (
            <div
              style={{
                textAlign: 'center',
                padding: '20px',
                backgroundColor: theme === 'light' ? '#f8f9fa' : '#1a1a1a',
                borderRadius: '8px',
                minHeight: '420px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {renderImage(currentView, true)}
            </div>
          )}

          {/* 规格信息 */}
          {renderSpecs()}

          {/* DWG文件面板 */}
          {dwgFiles.length > 0 && (
            <Card className="mt-3" style={{ backgroundColor: defaultColors.card, borderColor: defaultColors.border }}>
              <Card.Header style={{ backgroundColor: defaultColors.headerBg, color: defaultColors.headerText }}>
                <i className="bi bi-file-earmark-binary me-2"></i>
                DWG原始图纸文件
                <Badge bg="info" className="ms-2">{dwgFiles.length}个</Badge>
              </Card.Header>
              <ListGroup variant="flush">
                {dwgFiles.map((file, index) => (
                  <ListGroup.Item
                    key={file.id || index}
                    style={{
                      backgroundColor: defaultColors.card,
                      borderColor: defaultColors.border,
                      color: defaultColors.text
                    }}
                    className="d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <div className="fw-semibold">
                        <i className="bi bi-file-earmark me-2"></i>
                        {file.fileName}
                      </div>
                      <small style={{ opacity: 0.7 }}>
                        {file.fileSize} | 更新: {file.updateDate}
                        {file.series && <Badge bg="secondary" className="ms-2">{file.series}系列</Badge>}
                      </small>
                    </div>
                    <ButtonGroup size="sm">
                      <Button
                        variant="outline-primary"
                        onClick={() => window.open(getDwgDownloadUrl(file.filePath), '_blank')}
                        title="下载DWG文件"
                      >
                        <i className="bi bi-download me-1"></i>下载
                      </Button>
                      <Button
                        variant="outline-success"
                        onClick={() => window.open(getPdfPreviewUrl(file.filePath), '_blank')}
                        title="在ShareCAD中在线预览"
                      >
                        <i className="bi bi-eye me-1"></i>在线预览
                      </Button>
                    </ButtonGroup>
                  </ListGroup.Item>
                ))}
              </ListGroup>
              <Card.Footer style={{ backgroundColor: defaultColors.headerBg }}>
                <small style={{ color: defaultColors.text, opacity: 0.7 }}>
                  <i className="bi bi-info-circle me-1"></i>
                  DWG文件需使用CAD软件(如AutoCAD)打开，或点击"在线预览"通过ShareCAD查看
                </small>
              </Card.Footer>
            </Card>
          )}

          {/* 全屏模态框 */}
          <Modal
            show={showFullscreen}
            onHide={() => { setShowFullscreen(false); resetZoom(); }}
            size="xl"
            centered
            fullscreen
          >
            <Modal.Header
              closeButton
              style={{ backgroundColor: defaultColors.headerBg, color: defaultColors.headerText }}
            >
              <Modal.Title>
                <i className={`bi ${type === 'gearbox' ? 'bi-gear-wide-connected' : 'bi-link-45deg'} me-2`}></i>
                {model} - {viewTypes[currentView]?.label}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body
              style={{
                backgroundColor: theme === 'light' ? '#f0f0f0' : '#1a1a1a',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'auto'
              }}
            >
              {/* 全屏工具栏 */}
              <div className="mb-3">
                <ButtonGroup>
                  {availableViews.map(viewKey => (
                    <Button
                      key={viewKey}
                      variant={currentView === viewKey ? 'primary' : 'outline-secondary'}
                      onClick={() => setCurrentView(viewKey)}
                    >
                      <i className={`bi ${viewTypes[viewKey]?.icon} me-1`}></i>
                      {viewTypes[viewKey]?.label}
                    </Button>
                  ))}
                </ButtonGroup>
                <ButtonGroup className="ms-3">
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleZoom(-0.25)}
                    disabled={zoom <= 0.5}
                  >
                    <i className="bi bi-zoom-out"></i>
                  </Button>
                  <Button variant="outline-secondary" onClick={resetZoom}>
                    {Math.round(zoom * 100)}%
                  </Button>
                  <Button
                    variant="outline-secondary"
                    onClick={() => handleZoom(0.25)}
                    disabled={zoom >= 3}
                  >
                    <i className="bi bi-zoom-in"></i>
                  </Button>
                </ButtonGroup>
                <Button
                  variant="outline-primary"
                  className="ms-3"
                  onClick={handleDownload}
                  disabled={!drawingData[currentView] || imageError[currentView]}
                >
                  <i className="bi bi-download me-1"></i>下载
                </Button>
              </div>

              {/* 全屏图片 */}
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '100%',
                  overflow: 'auto'
                }}
              >
                {renderImage(currentView, true)}
              </div>
            </Modal.Body>
          </Modal>
        </>
      )}
    </div>
  );
};

export default OutlineDrawingViewer;
