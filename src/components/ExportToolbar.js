// src/components/ExportToolbar.js
// 统一导出工具栏 — CSV + Excel + 打印 三按钮
import React, { useState, useCallback } from 'react';
import { ButtonGroup, Button, Spinner } from 'react-bootstrap';
import { exportCSV, exportXLSX, exportPrint, buildHtmlTable } from '../utils/unifiedExporter';

/**
 * @param {Object} props
 * @param {Function} props.getData - 返回 { filename, title, headers, rows, sheets?, printContent? }
 * @param {boolean} [props.disabled] - 禁用
 * @param {string} [props.size='sm'] - 按钮大小
 * @param {boolean} [props.showXlsx=true] - 显示Excel按钮
 * @param {boolean} [props.showPrint=true] - 显示打印按钮
 */
export default function ExportToolbar({ getData, disabled, size = 'sm', showXlsx = true, showPrint = true }) {
  const [loading, setLoading] = useState(null);

  const handleCSV = useCallback(() => {
    const d = getData();
    if (!d) return;
    exportCSV({ filename: d.filename, headers: d.headers, rows: d.rows });
  }, [getData]);

  const handleXLSX = useCallback(async () => {
    setLoading('xlsx');
    try {
      const d = getData();
      if (!d) return;
      const sheets = d.sheets || [{ name: d.title || '数据', headers: d.headers, rows: d.rows }];
      await exportXLSX({ filename: d.filename, sheets });
    } finally {
      setLoading(null);
    }
  }, [getData]);

  const handlePrint = useCallback(() => {
    const d = getData();
    if (!d) return;
    const content = d.printContent || buildHtmlTable(d.headers, d.rows);
    exportPrint({ title: d.title || d.filename, subtitle: d.subtitle, content });
  }, [getData]);

  return (
    <ButtonGroup size={size}>
      <Button variant="outline-success" disabled={disabled || !!loading} onClick={handleCSV} title="导出CSV">
        <i className="bi bi-filetype-csv me-1"></i>CSV
      </Button>
      {showXlsx && (
        <Button variant="outline-primary" disabled={disabled || !!loading} onClick={handleXLSX} title="导出Excel">
          {loading === 'xlsx' ? <Spinner size="sm" className="me-1" /> : <i className="bi bi-file-earmark-excel me-1"></i>}
          Excel
        </Button>
      )}
      {showPrint && (
        <Button variant="outline-secondary" disabled={disabled || !!loading} onClick={handlePrint} title="打印">
          <i className="bi bi-printer me-1"></i>打印
        </Button>
      )}
    </ButtonGroup>
  );
}
