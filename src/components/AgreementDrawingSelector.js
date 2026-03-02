// src/components/AgreementDrawingSelector.js
/**
 * 技术协议外形图选择器组件
 * 支持从外形图库中选择多个外形图，用于技术协议生成
 */
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { Modal, Button, Row, Col, ListGroup, Badge, Form, Alert, Card } from 'react-bootstrap';
import {
  gearboxDwgDrawings,
  couplingDwgDrawings,
  getPdfPreviewUrl,
  getDwgFilesForModel
} from '../data/outlineDrawings';

/**
 * 根据型号匹配DWG外形图（多级匹配）
 * 使用统一的 getDwgFilesForModel 做精确+大小写不敏感匹配，
 * 再补充模糊匹配和系列级回退
 */
const getDrawingsForModel = (model, type = 'gearbox') => {
  if (!model) return [];

  // 1. 精确匹配 + 大小写不敏感（使用统一函数）
  const exactResult = getDwgFilesForModel(model, type);
  if (exactResult.length > 0) return exactResult;

  const dataSource = type === 'gearbox' ? gearboxDwgDrawings : couplingDwgDrawings;
  const normalizedModel = model.toUpperCase().trim();

  // 2. 去除后缀匹配 (如 HCM400A -> HCM400)
  const baseModel = normalizedModel.replace(/[A-Z]$/, '');
  const baseResult = getDwgFilesForModel(baseModel, type);
  if (baseResult.length > 0) return baseResult;

  // 3. 模糊匹配
  const fuzzyMatches = [];
  Object.keys(dataSource).forEach(key => {
    const upperKey = key.toUpperCase();
    if (upperKey.includes(normalizedModel) || normalizedModel.includes(upperKey)) {
      fuzzyMatches.push(...dataSource[key]);
    }
  });
  if (fuzzyMatches.length > 0) return fuzzyMatches;

  // 4. 系列级回退 — 提取系列前缀，匹配同系列图纸作为参考
  const seriesMatch = normalizedModel.match(/^([A-Z]+)/);
  if (seriesMatch) {
    const series = seriesMatch[1];
    const seriesDrawings = [];
    Object.keys(dataSource).forEach(key => {
      if (key.toUpperCase().startsWith(series)) {
        dataSource[key].forEach(d => seriesDrawings.push({ ...d, originalModel: key }));
      }
    });
    if (seriesDrawings.length > 0) return seriesDrawings;
  }

  return [];
};

/**
 * 外形图选择器组件
 */
const AgreementDrawingSelector = ({
  show = false,
  onHide = () => {},
  gearboxModel = '',
  couplingModel = '',
  onConfirm = () => {},
  initialSelected = []
}) => {
  // 已选择的外形图列表（使用文件路径作为唯一标识）
  const [selectedDrawings, setSelectedDrawings] = useState(() => {
    return initialSelected.map(d => d.filePath || d);
  });

  // 当 modal 打开或 initialSelected 变化时，同步选中状态
  useEffect(() => {
    if (show) {
      setSelectedDrawings(initialSelected.map(d => d.filePath || d));
      setViewMode('list');
      setPreviewDrawing(null);
    }
  }, [show, initialSelected]);

  // 预览的外形图
  const [previewDrawing, setPreviewDrawing] = useState(null);

  // 视图模式：'list'（列表）或 'preview'（预览）
  const [viewMode, setViewMode] = useState('list');

  // 获取齿轮箱外形图
  const gearboxDrawings = useMemo(() => {
    return getDrawingsForModel(gearboxModel, 'gearbox');
  }, [gearboxModel]);

  // 获取联轴器外形图
  const couplingDrawings = useMemo(() => {
    return getDrawingsForModel(couplingModel, 'coupling');
  }, [couplingModel]);

  // 所有可用外形图
  const allDrawings = useMemo(() => {
    return [
      ...gearboxDrawings.map(d => ({ ...d, type: 'gearbox', model: gearboxModel })),
      ...couplingDrawings.map(d => ({ ...d, type: 'coupling', model: couplingModel }))
    ];
  }, [gearboxDrawings, couplingDrawings, gearboxModel, couplingModel]);

  // 检查外形图是否已选中
  const isSelected = useCallback((drawing) => {
    return selectedDrawings.includes(drawing.filePath);
  }, [selectedDrawings]);

  // 切换外形图选中状态
  const toggleDrawing = useCallback((drawing) => {
    setSelectedDrawings(prev => {
      if (prev.includes(drawing.filePath)) {
        return prev.filter(path => path !== drawing.filePath);
      } else {
        return [...prev, drawing.filePath];
      }
    });
  }, []);

  // 处理确认
  const handleConfirm = useCallback(() => {
    // 根据选中的路径找到完整的外形图对象
    const selected = allDrawings.filter(d => selectedDrawings.includes(d.filePath));
    onConfirm(selected);
    onHide();
  }, [selectedDrawings, allDrawings, onConfirm, onHide]);

  // 处理预览
  const handlePreview = useCallback((drawing) => {
    setPreviewDrawing(drawing);
    setViewMode('preview');
  }, []);

  // 返回列表视图
  const handleBackToList = useCallback(() => {
    setViewMode('list');
    setPreviewDrawing(null);
  }, []);

  // 渲染单个外形图项
  const renderDrawingItem = (drawing, index) => {
    const selected = isSelected(drawing);

    return (
      <ListGroup.Item
        key={`${drawing.type}-${index}`}
        className="d-flex justify-content-between align-items-center"
        style={{
          cursor: 'pointer',
          backgroundColor: selected ? '#e7f3ff' : '#fff',
          borderLeft: selected ? '4px solid #0d6efd' : '4px solid transparent'
        }}
      >
        <div className="d-flex align-items-center flex-grow-1">
          <Form.Check
            type="checkbox"
            checked={selected}
            onChange={() => toggleDrawing(drawing)}
            className="me-3"
          />
          <div className="flex-grow-1" onClick={() => toggleDrawing(drawing)}>
            <div className="fw-bold">{drawing.fileName}</div>
            <small className="text-muted">
              <Badge bg={drawing.type === 'gearbox' ? 'primary' : 'success'} className="me-2">
                {drawing.type === 'gearbox' ? '齿轮箱' : '联轴器'}
              </Badge>
              <Badge bg="secondary" className="me-2">{drawing.series}</Badge>
              <span className="me-2">{drawing.fileSize}</span>
              <span>{drawing.updateDate}</span>
            </small>
          </div>
        </div>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            handlePreview(drawing);
          }}
        >
          <i className="bi bi-eye me-1"></i>预览
        </Button>
      </ListGroup.Item>
    );
  };

  // 渲染列表视图
  const renderListView = () => {
    if (allDrawings.length === 0) {
      return (
        <Alert variant="info" className="text-center">
          <i className="bi bi-info-circle me-2"></i>
          {gearboxModel || couplingModel
            ? '未找到匹配的外形图，请联系技术部门获取'
            : '请先完成选型并选择齿轮箱型号'}
        </Alert>
      );
    }

    return (
      <div>
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <span className="text-muted">
              已选择 <Badge bg="primary">{selectedDrawings.length}</Badge> / {allDrawings.length} 个外形图
            </span>
            {selectedDrawings.length > 0 && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setSelectedDrawings([])}
              >
                清空选择
              </Button>
            )}
          </div>
        </div>

        <ListGroup variant="flush" style={{ maxHeight: '400px', overflow: 'auto' }}>
          {allDrawings.map((drawing, index) => renderDrawingItem(drawing, index))}
        </ListGroup>
      </div>
    );
  };

  // 渲染预览视图
  const renderPreviewView = () => {
    if (!previewDrawing) return null;

    const previewUrl = getPdfPreviewUrl(previewDrawing.filePath);

    return (
      <div>
        <div className="mb-3">
          <Button variant="outline-secondary" size="sm" onClick={handleBackToList}>
            <i className="bi bi-arrow-left me-1"></i>返回列表
          </Button>
        </div>

        <Card>
          <Card.Header>
            <div className="d-flex justify-content-between align-items-center">
              <span>
                <strong>{previewDrawing.fileName}</strong>
              </span>
              <Badge bg={previewDrawing.type === 'gearbox' ? 'primary' : 'success'}>
                {previewDrawing.type === 'gearbox' ? '齿轮箱' : '联轴器'}
              </Badge>
            </div>
          </Card.Header>
          <Card.Body>
            <iframe
              src={previewUrl}
              style={{
                width: '100%',
                height: '450px',
                border: '1px solid #dee2e6',
                borderRadius: '4px'
              }}
              title={`预览 ${previewDrawing.fileName}`}
            />
            <div className="mt-2 text-muted small">
              <i className="bi bi-info-circle me-1"></i>
              使用 ShareCAD 在线预览DWG文件
            </div>
          </Card.Body>
          <Card.Footer>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <Badge bg="secondary" className="me-2">{previewDrawing.series}</Badge>
                <span className="text-muted small me-3">{previewDrawing.fileSize}</span>
                <span className="text-muted small">{previewDrawing.updateDate}</span>
              </div>
              <Button
                variant={isSelected(previewDrawing) ? 'danger' : 'primary'}
                size="sm"
                onClick={() => toggleDrawing(previewDrawing)}
              >
                <i className={`bi bi-${isSelected(previewDrawing) ? 'x' : 'check'} me-1`}></i>
                {isSelected(previewDrawing) ? '取消选择' : '选择此图'}
              </Button>
            </div>
          </Card.Footer>
        </Card>
      </div>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-file-earmark-image me-2"></i>
          选择外形图
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Row>
          <Col>
            {viewMode === 'list' ? renderListView() : renderPreviewView()}
          </Col>
        </Row>

        {viewMode === 'list' && gearboxModel && (
          <div className="mt-3 text-muted small">
            <i className="bi bi-info-circle me-1"></i>
            当前型号：
            {gearboxModel && <Badge bg="primary" className="mx-1">{gearboxModel}</Badge>}
            {couplingModel && <Badge bg="success" className="mx-1">{couplingModel}</Badge>}
          </div>
        )}
      </Modal.Body>

      <Modal.Footer>
        <div className="d-flex justify-content-between w-100">
          <div className="text-muted small">
            {viewMode === 'list' && (
              <span>已选择 <strong>{selectedDrawings.length}</strong> 个外形图</span>
            )}
          </div>
          <div>
            <Button variant="secondary" onClick={onHide} className="me-2">
              取消
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={selectedDrawings.length === 0 && viewMode === 'list'}
            >
              <i className="bi bi-check-lg me-1"></i>
              确认选择
              {selectedDrawings.length > 0 && ` (${selectedDrawings.length})`}
            </Button>
          </div>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default AgreementDrawingSelector;
