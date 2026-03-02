// src/components/PDFPreviewModal.js
// PDF首页预览弹窗组件
// 功能: 只加载PDF第一页作为预览，用户确认后再打开完整PDF
// 创建时间: 2026-01-22

import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import * as pdfjsLib from 'pdfjs-dist';

// 设置PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

/**
 * PDF首页预览弹窗
 * 只加载第一页，显示页数和大小信息
 *
 * @param {Object} props
 * @param {Object} props.pdf - PDF文件信息 { path, title, model, fileSize }
 * @param {Function} props.onClose - 关闭弹窗回调
 * @param {Function} props.onOpenFull - 打开完整PDF回调
 * @param {Object} props.colors - 主题颜色配置
 */
const PDFPreviewModal = ({ pdf, onClose, onOpenFull, colors }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [previewReady, setPreviewReady] = useState(false);
  const canvasRef = useRef(null);
  const pdfDocRef = useRef(null);

  useEffect(() => {
    if (!pdf) return;

    let cancelled = false;

    const loadPreview = async () => {
      try {
        setLoading(true);
        setError(null);
        setPreviewReady(false);

        // 加载PDF文档（只获取元数据和第一页）
        const loadingTask = pdfjsLib.getDocument({
          url: pdf.path,
          // 启用范围请求，只下载需要的部分
          rangeChunkSize: 65536,
          disableAutoFetch: true,
          disableStream: true
        });

        const pdfDoc = await loadingTask.promise;

        if (cancelled) {
          pdfDoc.destroy();
          return;
        }

        pdfDocRef.current = pdfDoc;
        setPageCount(pdfDoc.numPages);

        // 获取第一页
        const page = await pdfDoc.getPage(1);

        if (cancelled) return;

        // 计算缩放比例，使预览适合弹窗
        const viewport = page.getViewport({ scale: 1 });
        const maxWidth = 500;
        const scale = maxWidth / viewport.width;
        const scaledViewport = page.getViewport({ scale });

        // 设置canvas尺寸
        const canvas = canvasRef.current;
        if (!canvas) return;

        const context = canvas.getContext('2d');
        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        // 渲染第一页
        await page.render({
          canvasContext: context,
          viewport: scaledViewport
        }).promise;

        if (!cancelled) {
          setPreviewReady(true);
          setLoading(false);
        }

      } catch (err) {
        if (!cancelled) {
          console.error('PDF预览加载失败:', err);
          setError(err.message || '加载失败');
          setLoading(false);
        }
      }
    };

    loadPreview();

    return () => {
      cancelled = true;
      if (pdfDocRef.current) {
        pdfDocRef.current.destroy();
        pdfDocRef.current = null;
      }
    };
  }, [pdf]);

  const handleOpenFull = () => {
    if (onOpenFull) {
      onOpenFull(pdf);
    }
    onClose();
  };

  const handleDownload = () => {
    // 创建下载链接
    const link = document.createElement('a');
    link.href = pdf.path;
    link.download = `${pdf.model}_说明书.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!pdf) return null;

  return (
    <Modal
      show={!!pdf}
      onHide={onClose}
      centered
      size="lg"
      style={{ zIndex: 1060 }}
    >
      <Modal.Header
        closeButton
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>
          <i className="bi bi-file-earmark-pdf-fill text-danger me-2"></i>
          {pdf.model} 说明书预览
        </Modal.Title>
      </Modal.Header>

      <Modal.Body
        style={{
          backgroundColor: colors?.card,
          color: colors?.text,
          maxHeight: '70vh',
          overflow: 'auto'
        }}
      >
        {/* 文件信息 */}
        <div className="d-flex justify-content-between align-items-center mb-3 p-2"
             style={{ backgroundColor: colors?.headerBg, borderRadius: '4px' }}>
          <div>
            <strong>{pdf.title}</strong>
          </div>
          <div>
            <Badge bg="info" className="me-2">
              <i className="bi bi-file-earmark me-1"></i>
              {pdf.fileSize}
            </Badge>
            {pageCount > 0 && (
              <Badge bg="secondary">
                <i className="bi bi-journal-text me-1"></i>
                {pageCount} 页
              </Badge>
            )}
          </div>
        </div>

        {/* 预览区域 */}
        <div className="text-center" style={{ minHeight: '300px' }}>
          {loading && (
            <div className="d-flex flex-column align-items-center justify-content-center" style={{ height: '300px' }}>
              <Spinner animation="border" variant="primary" className="mb-3" />
              <div>正在加载预览...</div>
              <small className="text-muted">仅加载第一页</small>
            </div>
          )}

          {error && (
            <Alert variant="danger" className="m-3">
              <i className="bi bi-exclamation-triangle me-2"></i>
              预览加载失败: {error}
              <div className="mt-2">
                <small>您仍可以直接打开或下载完整PDF</small>
              </div>
            </Alert>
          )}

          <canvas
            ref={canvasRef}
            style={{
              display: previewReady ? 'inline-block' : 'none',
              maxWidth: '100%',
              boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              border: '1px solid #ddd'
            }}
          />

          {previewReady && (
            <div className="mt-2 text-muted" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-info-circle me-1"></i>
              第 1 页 / 共 {pageCount} 页
            </div>
          )}
        </div>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
        <Button variant="outline-secondary" onClick={handleDownload}>
          <i className="bi bi-download me-1"></i>
          下载PDF
        </Button>
        <Button variant="secondary" onClick={onClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handleOpenFull}>
          <i className="bi bi-box-arrow-up-right me-1"></i>
          打开完整PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PDFPreviewModal;
