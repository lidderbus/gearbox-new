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
  selectedDrawings = [],
  onExportStart,
  onExportEnd
}) => {
  const previewRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [wordLoading, setWordLoading] = useState(false);
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

  // 导出为Word（使用HTML→Word方式，兼容新版agreement.html格式）
  const exportToWord = useCallback(() => {
    if (!agreement || !previewRef.current) {
      setError('请先生成技术协议');
      return;
    }
    setWordLoading(true);
    setError('');
    try {
      // 从DOM获取完整HTML内容（包含图纸清单）
      const htmlContent = previewRef.current.innerHTML;
      const fullHtml = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office"
              xmlns:w="urn:schemas-microsoft-com:office:word"
              xmlns="http://www.w3.org/TR/REC-html40">
        <head><meta charset="utf-8">
        <style>
          body { font-family: SimSun, serif; font-size: 14px; line-height: 1.6; }
          table { border-collapse: collapse; width: 100%; }
          td, th { border: 1px solid #999; padding: 6px 8px; }
          h1, h2, h3 { margin-top: 16px; }
        </style></head>
        <body>${htmlContent}</body></html>`;

      const blob = new Blob([fullHtml], { type: 'application/msword', encoding: 'UTF-8' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);

      const projectName = typeof projectInfo?.projectName === 'string'
        ? projectInfo.projectName
        : (projectInfo?.projectName?.toString() || '齿轮箱');
      let filename = `${projectName}_技术协议`;
      if (agreement.language === 'bilingual') filename += '_中英文对照';
      else if (agreement.language === 'en') filename += '_英文版';

      link.download = `${filename}.doc`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
      setWordLoading(false);
    } catch (err) {
      console.error('导出Word失败:', err);
      setError(`导出Word失败: ${err.message}`);
      setWordLoading(false);
    }
  }, [agreement, projectInfo]);

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
      <div className="d-flex justify-content-end mb-3 gap-2">
        <Button
          variant="outline-primary"
          onClick={exportToWord}
          disabled={wordLoading || loading}
        >
          {wordLoading ? (
            <>
              <Spinner as="span" animation="border" size="sm" className="me-2" />
              导出中...
            </>
          ) : (
            <>
              <i className="bi bi-file-earmark-word me-2"></i>
              导出Word
            </>
          )}
        </Button>
        <Button
          variant="primary"
          onClick={exportToPDF}
          disabled={loading || wordLoading}
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
        >
          <div dangerouslySetInnerHTML={{ __html: agreement.html }} />
          {selectedDrawings.length > 0 && (
            <div style={{ marginTop: '40px', pageBreakBefore: 'auto', pageBreakInside: 'avoid' }}>
              <h3 style={{ borderBottom: '2px solid #333', paddingBottom: '8px', marginBottom: '16px' }}>
                附件清单 — 外形图
              </h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px', pageBreakInside: 'auto' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center', width: '40px' }}>序号</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>型号</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px' }}>文件名</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center', width: '80px' }}>类型</th>
                    <th style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center', width: '80px' }}>文件大小</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDrawings.map((drawing, index) => (
                    <tr key={index} style={{ pageBreakInside: 'avoid' }}>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px' }}>{drawing.model || '-'}</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', wordBreak: 'break-all' }}>{drawing.fileName || '-'}</td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>
                        {drawing.type === 'gearbox' ? '齿轮箱' : drawing.type === 'coupling' ? '联轴器' : '-'}
                      </td>
                      <td style={{ border: '1px solid #ccc', padding: '8px', textAlign: 'center' }}>{drawing.fileSize || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                共 {selectedDrawings.length} 份外形图文件
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgreementPreview;
