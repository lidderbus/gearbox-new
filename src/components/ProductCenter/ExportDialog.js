// src/components/ProductCenter/ExportDialog.js
// 导出选项对话框

import React, { useState } from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
// 性能优化: 改为动态导入
// import * as XLSX from 'xlsx';

// 动态加载 xlsx
async function loadXLSX() {
  return await import(/* webpackChunkName: "xlsx" */ 'xlsx');
}

const ExportDialog = ({
  show,
  onHide,
  products,
  compareList,
  colors = {},
  theme = 'light'
}) => {
  const [exportRange, setExportRange] = useState('filtered');
  const [exportFormat, setExportFormat] = useState('xlsx');
  const [exportFields, setExportFields] = useState({
    basic: true,
    technical: true,
    price: true,
    interface: true
  });
  const [isExporting, setIsExporting] = useState(false);

  // 获取导出数据
  const getExportData = () => {
    if (exportRange === 'compare') {
      return compareList;
    }
    return products;
  };

  // 执行导出
  const handleExport = async () => {
    setIsExporting(true);

    try {
      // 动态加载 xlsx
      const XLSX = await loadXLSX();

      const data = getExportData();

      if (data.length === 0) {
        alert('没有可导出的数据');
        return;
      }

      // 构建导出行
      const rows = data.map(product => {
        const row = {};

        if (exportFields.basic) {
          row['型号'] = product.model || '';
          row['系列'] = product.seriesLabel || '';
          row['最小功率(kW)'] = product.minPower || '';
          row['最大功率(kW)'] = product.maxPower || '';
          row['最小转速(rpm)'] = product.minSpeed || '';
          row['最大转速(rpm)'] = product.maxSpeed || '';
        }

        if (exportFields.technical) {
          row['额定推力(kN)'] = product.thrust || '';
          row['重量(kg)'] = product.weight || '';
          row['传动效率'] = product.efficiency ? `${(product.efficiency * 100).toFixed(0)}%` : '';
          row['控制方式'] = product.controlType || '';
          row['中心距(mm)'] = product.centerDistance || '';
          row['外形尺寸'] = product.dimensions || '';
          row['减速比'] = product.ratios?.map(r => r.toFixed(2)).join(', ') || '';
        }

        if (exportFields.price) {
          row['市场价(元)'] = product.marketPrice || product.displayPrice || '';
          row['出厂价(元)'] = product.factoryPrice || '';
          row['折扣率'] = product.discountRate ? `${(product.discountRate * 100).toFixed(0)}%` : '';
        }

        if (exportFields.interface) {
          const interfaces = product.inputInterfaces;
          row['SAE接口'] = interfaces?.sae?.join(', ') || '';
          row['国内机接口'] = interfaces?.domestic?.join(', ') || '';
        }

        row['备注'] = product.notes || '';

        return row;
      });

      if (exportFormat === 'xlsx') {
        // 导出Excel
        const ws = XLSX.utils.json_to_sheet(rows);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '产品列表');

        // 设置列宽
        const colWidths = Object.keys(rows[0] || {}).map(() => ({ wch: 15 }));
        ws['!cols'] = colWidths;

        XLSX.writeFile(wb, `齿轮箱产品列表_${new Date().toISOString().slice(0, 10)}.xlsx`);
      } else if (exportFormat === 'csv') {
        // 导出CSV
        const ws = XLSX.utils.json_to_sheet(rows);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `齿轮箱产品列表_${new Date().toISOString().slice(0, 10)}.csv`;
        a.click();
        URL.revokeObjectURL(url);
      }

      onHide();
    } catch (error) {
      console.error('导出失败:', error);
      alert('导出失败: ' + error.message);
    } finally {
      setIsExporting(false);
    }
  };

  const exportCount = exportRange === 'compare' ? compareList.length : products.length;

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header
        closeButton
        style={{
          backgroundColor: colors.headerBg || '#f8f9fa',
          borderColor: colors.border
        }}
      >
        <Modal.Title>
          <i className="bi bi-download me-2"></i>导出产品数据
        </Modal.Title>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: colors.card }}>
        {/* 导出范围 */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">导出范围</Form.Label>
          <div>
            <Form.Check
              type="radio"
              id="range-filtered"
              name="exportRange"
              label={`当前筛选结果 (${products.length}个)`}
              checked={exportRange === 'filtered'}
              onChange={() => setExportRange('filtered')}
            />
            <Form.Check
              type="radio"
              id="range-compare"
              name="exportRange"
              label={`对比列表 (${compareList.length}个)`}
              checked={exportRange === 'compare'}
              onChange={() => setExportRange('compare')}
              disabled={compareList.length === 0}
            />
          </div>
        </Form.Group>

        {/* 导出格式 */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">导出格式</Form.Label>
          <div>
            <Form.Check
              type="radio"
              id="format-xlsx"
              name="exportFormat"
              label="Excel (.xlsx) - 完整参数表"
              checked={exportFormat === 'xlsx'}
              onChange={() => setExportFormat('xlsx')}
            />
            <Form.Check
              type="radio"
              id="format-csv"
              name="exportFormat"
              label="CSV - 纯数据格式"
              checked={exportFormat === 'csv'}
              onChange={() => setExportFormat('csv')}
            />
          </div>
        </Form.Group>

        {/* 导出内容 */}
        <Form.Group className="mb-3">
          <Form.Label className="fw-bold">导出内容</Form.Label>
          <div className="d-flex flex-wrap gap-3">
            <Form.Check
              type="checkbox"
              id="field-basic"
              label="基本参数"
              checked={exportFields.basic}
              onChange={(e) => setExportFields({ ...exportFields, basic: e.target.checked })}
            />
            <Form.Check
              type="checkbox"
              id="field-technical"
              label="技术规格"
              checked={exportFields.technical}
              onChange={(e) => setExportFields({ ...exportFields, technical: e.target.checked })}
            />
            <Form.Check
              type="checkbox"
              id="field-price"
              label="价格信息"
              checked={exportFields.price}
              onChange={(e) => setExportFields({ ...exportFields, price: e.target.checked })}
            />
            <Form.Check
              type="checkbox"
              id="field-interface"
              label="接口信息"
              checked={exportFields.interface}
              onChange={(e) => setExportFields({ ...exportFields, interface: e.target.checked })}
            />
          </div>
        </Form.Group>

        <Alert variant="info" className="mb-0">
          <i className="bi bi-info-circle me-2"></i>
          将导出 <strong>{exportCount}</strong> 个产品的数据
        </Alert>
      </Modal.Body>

      <Modal.Footer style={{ backgroundColor: colors.headerBg, borderColor: colors.border }}>
        <Button variant="secondary" onClick={onHide} disabled={isExporting}>
          取消
        </Button>
        <Button
          variant="primary"
          onClick={handleExport}
          disabled={isExporting || exportCount === 0}
        >
          {isExporting ? (
            <>
              <Spinner animation="border" size="sm" className="me-2" />
              导出中...
            </>
          ) : (
            <>
              <i className="bi bi-download me-1"></i>
              确认导出
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ExportDialog;
