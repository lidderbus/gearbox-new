// src/components/PDFLoadingModal.js
// PDF下载进度弹窗组件
// 功能: 显示大文件PDF下载进度，支持取消
// 创建时间: 2026-01-22

import React, { useState, useEffect, useRef } from 'react';
import { Modal, ProgressBar, Button, Alert } from 'react-bootstrap';

/**
 * PDF下载进度弹窗
 * 用于大文件(>15MB)的下载进度显示
 *
 * @param {Object} props
 * @param {Object} props.pdf - PDF文件信息 { path, title, model, fileSize }
 * @param {Function} props.onClose - 关闭弹窗回调
 * @param {Object} props.colors - 主题颜色配置
 */
const PDFLoadingModal = ({ pdf, onClose, colors }) => {
  const [progress, setProgress] = useState(0);
  const [downloadedMB, setDownloadedMB] = useState(0);
  const [totalMB, setTotalMB] = useState(0);
  const [status, setStatus] = useState('loading'); // loading, success, error
  const [errorMsg, setErrorMsg] = useState('');
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (!pdf) return;

    // 解析文件大小
    const sizeMatch = pdf.fileSize?.match(/(\d+)/);
    const estimatedMB = sizeMatch ? parseInt(sizeMatch[1]) : 50;
    setTotalMB(estimatedMB);

    // 创建AbortController用于取消请求
    abortControllerRef.current = new AbortController();

    const downloadPDF = async () => {
      try {
        const response = await fetch(pdf.path, {
          signal: abortControllerRef.current.signal
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const contentLength = response.headers.get('content-length');
        const total = contentLength ? parseInt(contentLength) : estimatedMB * 1024 * 1024;
        const actualTotalMB = (total / (1024 * 1024)).toFixed(1);
        setTotalMB(actualTotalMB);

        const reader = response.body.getReader();
        const chunks = [];
        let received = 0;

        while (true) {
          const { done, value } = await reader.read();

          if (done) break;

          chunks.push(value);
          received += value.length;

          const currentMB = (received / (1024 * 1024)).toFixed(1);
          const currentProgress = Math.round((received / total) * 100);

          setDownloadedMB(currentMB);
          setProgress(currentProgress);
        }

        // 下载完成，创建Blob并打开
        const blob = new Blob(chunks, { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        setStatus('success');

        // 延迟打开，让用户看到100%
        setTimeout(() => {
          window.open(url, '_blank');
          // 清理URL，避免内存泄漏
          setTimeout(() => URL.revokeObjectURL(url), 60000);
          onClose();
        }, 500);

      } catch (error) {
        if (error.name === 'AbortError') {
          // 用户取消下载
          setStatus('cancelled');
          setTimeout(onClose, 1000);
        } else {
          setStatus('error');
          setErrorMsg(error.message);
        }
      }
    };

    downloadPDF();

    // 清理函数
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [pdf, onClose]);

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  const handleRetry = () => {
    setStatus('loading');
    setProgress(0);
    setDownloadedMB(0);
    setErrorMsg('');
    // 重新触发下载
    window.location.reload();
  };

  if (!pdf) return null;

  return (
    <Modal
      show={!!pdf}
      onHide={onClose}
      centered
      backdrop="static"
      style={{ zIndex: 1060 }}
    >
      <Modal.Header
        closeButton={status !== 'loading'}
        style={{ backgroundColor: colors?.headerBg, color: colors?.headerText }}
      >
        <Modal.Title>
          <i className="bi bi-file-earmark-pdf-fill text-danger me-2"></i>
          {status === 'loading' ? '正在加载说明书...' :
           status === 'success' ? '加载完成!' :
           status === 'cancelled' ? '已取消' : '加载失败'}
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: colors?.card, color: colors?.text }}>
        <div className="mb-3">
          <strong>{pdf.model}</strong>
          <div className="text-muted" style={{ fontSize: '0.9rem' }}>{pdf.title}</div>
        </div>

        {status === 'loading' && (
          <>
            <ProgressBar
              now={progress}
              animated
              striped
              variant="primary"
              label={`${progress}%`}
              className="mb-3"
              style={{ height: '25px' }}
            />
            <div className="d-flex justify-content-between text-muted" style={{ fontSize: '0.85rem' }}>
              <span>
                <i className="bi bi-download me-1"></i>
                已下载: {downloadedMB} MB
              </span>
              <span>
                <i className="bi bi-file-earmark me-1"></i>
                总大小: {totalMB} MB
              </span>
            </div>
            <Alert variant="info" className="mt-3 mb-0" style={{ fontSize: '0.85rem' }}>
              <i className="bi bi-info-circle me-2"></i>
              首次加载需要下载完整文件，之后将从浏览器缓存快速加载
            </Alert>
          </>
        )}

        {status === 'success' && (
          <Alert variant="success" className="mb-0">
            <i className="bi bi-check-circle me-2"></i>
            下载完成，正在打开PDF...
          </Alert>
        )}

        {status === 'cancelled' && (
          <Alert variant="warning" className="mb-0">
            <i className="bi bi-x-circle me-2"></i>
            下载已取消
          </Alert>
        )}

        {status === 'error' && (
          <Alert variant="danger" className="mb-0">
            <i className="bi bi-exclamation-triangle me-2"></i>
            下载失败: {errorMsg}
            <div className="mt-2">
              <Button variant="outline-danger" size="sm" onClick={handleRetry}>
                <i className="bi bi-arrow-clockwise me-1"></i>
                重试
              </Button>
            </div>
          </Alert>
        )}
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: colors?.card, borderColor: colors?.border }}>
        {status === 'loading' && (
          <Button variant="secondary" onClick={handleCancel}>
            <i className="bi bi-x-lg me-1"></i>
            取消下载
          </Button>
        )}
        {(status === 'error' || status === 'cancelled') && (
          <Button variant="secondary" onClick={onClose}>
            关闭
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
};

export default PDFLoadingModal;
