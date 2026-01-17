// src/components/AgreementGenerator/AgreementPreview.js
// 技术协议预览和导出组件
import React, { useRef, useCallback, useState } from 'react';
import { Button, Spinner, Alert } from 'react-bootstrap';
import { optimizedHtmlToPdf } from '../../utils/pdfExportUtils';

/**
 * 技术协议预览组件
 * 支持 HTML 预览和 PDF 导出
 */
const AgreementPreview = ({
  agreement,
  projectInfo,
  onExportStart,
  onExportEnd
}) => {
  const previewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // 导出为PDF
  const exportToPDF = useCallback(() => {
    if (!agreement || !previewRef.current) {
      setError('请先生成技术协议');
      return;
    }

    setLoading(true);
    setError('');
    onExportStart?.();

    // 确保 projectName 是字符串
    const projectName = typeof projectInfo?.projectName === 'string'
      ? projectInfo.projectName
      : (projectInfo?.projectName?.toString() || '齿轮箱');
    const pdfFilename = `${projectName}_技术协议.pdf`;

    // 添加延时确保内容完全渲染
    setTimeout(() => {
      optimizedHtmlToPdf(previewRef.current, {
        filename: pdfFilename,
        orientation: 'portrait',
        format: 'a4',
        scale: 1.5,
        debug: false
      })
      .then(() => {
        console.log('导出PDF成功:', pdfFilename);
        setLoading(false);
        onExportEnd?.();
      })
      .catch((err) => {
        console.error('导出PDF失败:', err);
        setError(`导出PDF失败: ${err.message}`);
        setLoading(false);
        onExportEnd?.();
      });
    }, 500);
  }, [agreement, projectInfo, onExportStart, onExportEnd]);

  if (!agreement) {
    return (
      <div className="text-center py-5 text-muted">
        <i className="bi bi-file-earmark-text" style={{ fontSize: '3rem' }}></i>
        <p className="mt-3">请先在"配置"选项卡中生成技术协议</p>
      </div>
    );
  }

  return (
    <div className="agreement-preview-container">
      {error && (
        <Alert variant="danger" className="mb-3" dismissible onClose={() => setError('')}>
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </Alert>
      )}

      {/* 工具栏 */}
      <div className="d-flex justify-content-end mb-3">
        <Button
          variant="primary"
          onClick={exportToPDF}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              导出中...
            </>
          ) : (
            <>
              <i className="bi bi-file-earmark-pdf me-2"></i>
              导出PDF
            </>
          )}
        </Button>
      </div>

      {/* 预览内容 */}
      <div className="agreement-preview-wrapper">
        <div
          ref={previewRef}
          className="agreement-preview-content"
          dangerouslySetInnerHTML={{ __html: agreement.html }}
        />
      </div>
    </div>
  );
};

export default AgreementPreview;
