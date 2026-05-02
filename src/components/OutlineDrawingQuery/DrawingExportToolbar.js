// src/components/OutlineDrawingQuery/DrawingExportToolbar.js
// A+ 增强：图纸导出工具栏（批量打包 / 规格书 / Excel 矩阵）
import React, { useCallback, useState } from 'react';
import { Button, ButtonGroup, ProgressBar, Alert, Modal } from 'react-bootstrap';
import {
  exportDwgZip,
  exportSpecPdf,
  exportSpecMatrixXlsx
} from '../../utils/dwgExporter';
import {
  gearboxDwgDrawings,
  couplingDwgDrawings
} from '../../data/dwgDrawings';
import { getFavoritesList } from '../../utils/favorites';

/**
 * 把 favorites/搜索结果中的型号映射回 DWG 文件元数据
 */
const findDwgFile = (model) => {
  if (gearboxDwgDrawings[model]?.length) {
    return { ...gearboxDwgDrawings[model][0], type: 'gearbox' };
  }
  if (couplingDwgDrawings[model]?.length) {
    return { ...couplingDwgDrawings[model][0], type: 'coupling' };
  }
  return null;
};

/**
 * 工具栏：DWG 批量打包 + 规格书 PDF + Excel 矩阵
 * @param {Object} props
 * @param {Object|null} props.selectedDwgFile  当前选中的 DWG (用于规格书)
 * @param {Array} props.allGearboxes  齿轮箱型号库 (用于矩阵导出)
 * @param {Array} props.allCouplings  联轴器型号库
 */
const DrawingExportToolbar = ({ selectedDwgFile, allGearboxes = [], allCouplings = [] }) => {
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0, current: '' });
  const [result, setResult] = useState(null); // {variant, message}
  const [showModal, setShowModal] = useState(false);

  // 1. 批量打包：从收藏夹拉取要下载的图纸
  const handleBatchZip = useCallback(async () => {
    const favs = getFavoritesList();
    if (favs.length === 0) {
      setResult({ variant: 'warning', message: '收藏夹为空，请先收藏要打包的型号' });
      return;
    }
    if (favs.length > 30) {
      const ok = window.confirm(`收藏 ${favs.length} 个型号，批量下载可能较慢。继续？`);
      if (!ok) return;
    }

    const files = favs
      .map((f) => findDwgFile(f.model))
      .filter(Boolean);
    if (files.length === 0) {
      setResult({ variant: 'warning', message: '收藏的型号均无对应 DWG 文件' });
      return;
    }

    setBusy(true);
    setShowModal(true);
    setProgress({ done: 0, total: files.length, current: '' });

    try {
      const r = await exportDwgZip(files, {
        includePdf: true,
        onProgress: (p) => setProgress(p)
      });
      setResult({
        variant: r.failed.length ? 'warning' : 'success',
        message: r.message + (r.failed.length ? ` (失败: ${r.failed.slice(0, 3).join(', ')}${r.failed.length > 3 ? '…' : ''})` : '')
      });
    } catch (e) {
      setResult({ variant: 'danger', message: '打包失败: ' + (e?.message || e) });
    } finally {
      setBusy(false);
    }
  }, []);

  // 2. 规格书：基于当前选中 DWG
  const handleSpecPdf = useCallback(async () => {
    if (!selectedDwgFile) {
      setResult({ variant: 'warning', message: '请先在 DWG 图库中选择一个型号' });
      return;
    }
    setBusy(true);
    try {
      await exportSpecPdf(
        { model: selectedDwgFile.model, series: selectedDwgFile.series },
        selectedDwgFile
      );
      setResult({ variant: 'success', message: `已生成 ${selectedDwgFile.model} 技术规格书` });
    } catch (e) {
      setResult({ variant: 'danger', message: '规格书生成失败: ' + (e?.message || e) });
    } finally {
      setBusy(false);
    }
  }, [selectedDwgFile]);

  // 3. Excel 矩阵：导出全量型号库
  const handleMatrixXlsx = useCallback(async () => {
    setBusy(true);
    try {
      await exportSpecMatrixXlsx({
        gearboxes: allGearboxes,
        couplings: allCouplings
      });
      setResult({
        variant: 'success',
        message: `已导出规格矩阵 (齿轮箱 ${allGearboxes.length} / 联轴器 ${allCouplings.length})`
      });
    } catch (e) {
      setResult({ variant: 'danger', message: 'Excel 导出失败: ' + (e?.message || e) });
    } finally {
      setBusy(false);
    }
  }, [allGearboxes, allCouplings]);

  return (
    <>
      <ButtonGroup size="sm" className="mb-2" aria-label="图纸导出工具栏">
        <Button
          variant="outline-primary"
          onClick={handleBatchZip}
          disabled={busy}
          aria-label="批量打包收藏图纸"
          title="将收藏夹中所有型号的 DWG/PDF 打包为 zip"
        >
          <i className="bi bi-file-earmark-zip me-1" aria-hidden="true"></i>批量打包(收藏)
        </Button>
        <Button
          variant="outline-primary"
          onClick={handleSpecPdf}
          disabled={busy || !selectedDwgFile}
          aria-label="生成当前选中型号的技术规格书 PDF"
          title={selectedDwgFile ? `生成 ${selectedDwgFile.model} 规格书` : '请先选择 DWG 文件'}
        >
          <i className="bi bi-file-earmark-pdf me-1" aria-hidden="true"></i>规格书 PDF
        </Button>
        <Button
          variant="outline-primary"
          onClick={handleMatrixXlsx}
          disabled={busy}
          aria-label="导出全量规格矩阵 Excel"
          title="导出齿轮箱+联轴器规格矩阵 Excel"
        >
          <i className="bi bi-file-earmark-spreadsheet me-1" aria-hidden="true"></i>规格矩阵 Excel
        </Button>
      </ButtonGroup>

      {result && !showModal && (
        <Alert
          variant={result.variant}
          dismissible
          onClose={() => setResult(null)}
          role="status"
          aria-live="polite"
          className="py-1 mb-2"
        >
          {result.message}
        </Alert>
      )}

      {/* 批量打包进度弹窗 */}
      <Modal show={showModal} onHide={() => !busy && setShowModal(false)} backdrop="static" centered>
        <Modal.Header closeButton={!busy}>
          <Modal.Title>
            <i className="bi bi-download me-2" aria-hidden="true"></i>批量打包图纸
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {busy ? (
            <>
              <p className="mb-2">
                正在下载 {progress.current ? <strong>{progress.current}</strong> : '…'}
              </p>
              <ProgressBar
                now={progress.total ? (progress.done / progress.total) * 100 : 0}
                label={`${progress.done} / ${progress.total}`}
                animated
              />
              <small className="text-muted mt-2 d-block">
                网络较慢时请耐心等待。已下载文件会缓存到 zip。
              </small>
            </>
          ) : result ? (
            <Alert variant={result.variant} className="mb-0">{result.message}</Alert>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={busy}>
            {busy ? '处理中…' : '关闭'}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DrawingExportToolbar;
