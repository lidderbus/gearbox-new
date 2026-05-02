import React, { useState, useCallback } from 'react';
import { Card, Button, Alert, Table, Badge, Form } from 'react-bootstrap';
import { toast } from '../utils/toast';

const REQUIRED_FIELDS = ['model', 'series', 'minSpeed', 'maxSpeed'];
const OPTIONAL_FIELDS = ['ratios', 'thrust', 'centerDistance', 'weight', 'dimensions', 'price', 'controlType', 'rotationDirection', 'certifications'];

const DataImportTool = () => {
  const [importData, setImportData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [preview, setPreview] = useState([]);

  const handleFileUpload = useCallback(async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const { default: XLSX } = await import('xlsx');
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(ws);

      if (json.length === 0) {
        toast.error('文件为空');
        return;
      }

      // Validate
      const errs = [];
      const valid = [];
      json.forEach((row, i) => {
        const missing = REQUIRED_FIELDS.filter(f => !row[f] && row[f] !== 0);
        if (missing.length > 0) {
          errs.push({ row: i + 2, msg: `缺少必填字段: ${missing.join(', ')}` });
        } else {
          // Parse ratios if string
          if (typeof row.ratios === 'string') {
            row.ratios = row.ratios.split(',').map(r => parseFloat(r.trim())).filter(r => !isNaN(r));
          }
          if (typeof row.certifications === 'string') {
            row.certifications = row.certifications.split(',').map(s => s.trim());
          }
          row.minSpeed = Number(row.minSpeed) || 0;
          row.maxSpeed = Number(row.maxSpeed) || 0;
          row.thrust = Number(row.thrust) || 0;
          row.centerDistance = Number(row.centerDistance) || 0;
          row.weight = Number(row.weight) || 0;
          row.price = Number(row.price) || 0;
          valid.push(row);
        }
      });

      setErrors(errs);
      setPreview(valid.slice(0, 20));
      setImportData(valid);
      toast.info(`解析完成: ${valid.length} 条有效, ${errs.length} 条错误`);
    } catch (err) {
      toast.error('文件解析失败: ' + err.message);
    }
  }, []);

  const handleImport = useCallback(() => {
    if (!importData || importData.length === 0) return;

    // Save to localStorage as supplement data
    try {
      const existing = JSON.parse(localStorage.getItem('gearbox_custom_models') || '[]');
      const merged = [...existing, ...importData];
      localStorage.setItem('gearbox_custom_models', JSON.stringify(merged));
      toast.success(`已导入 ${importData.length} 个型号到自定义数据库`);
      setImportData(null);
      setPreview([]);
      setErrors([]);
    } catch (err) {
      toast.error('保存失败: ' + err.message);
    }
  }, [importData]);

  const downloadTemplate = useCallback(async () => {
    try {
      const { default: XLSX } = await import('xlsx');
      const template = [
        { model: 'HC300', series: 'HC', minSpeed: 750, maxSpeed: 2500, ratios: '2.54,3.0,3.53,4.1,4.47,4.61,4.94,5.44', thrust: 50, centerDistance: 264, weight: 740, dimensions: '786x930x864', price: 68000, controlType: '推拉软轴/电控/气控', rotationDirection: '相反', certifications: 'CCS,BV' }
      ];
      const ws = XLSX.utils.json_to_sheet(template);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, '型号数据');
      XLSX.writeFile(wb, '齿轮箱型号导入模板.xlsx');
      toast.success('模板已下载');
    } catch (err) {
      toast.error('下载失败');
    }
  }, []);

  return (
    <Card>
      <Card.Header>
        <i className="bi bi-cloud-upload me-2"></i>数据导入工具
      </Card.Header>
      <Card.Body>
        <div className="d-flex gap-2 mb-3 flex-wrap">
          <Form.Control type="file" accept=".xlsx,.xls,.csv" onChange={handleFileUpload} style={{ maxWidth: 300 }} />
          <Button variant="outline-primary" size="sm" onClick={downloadTemplate}>
            <i className="bi bi-download me-1"></i>下载模板
          </Button>
          {importData && (
            <Button variant="success" size="sm" onClick={handleImport}>
              <i className="bi bi-check-circle me-1"></i>确认导入 ({importData.length}条)
            </Button>
          )}
        </div>

        <div className="mb-2">
          <small className="text-muted">必填字段: {REQUIRED_FIELDS.join(', ')} | 可选: {OPTIONAL_FIELDS.join(', ')}</small>
        </div>

        {errors.length > 0 && (
          <Alert variant="warning" className="py-2">
            <strong>校验错误 ({errors.length}):</strong>
            {errors.slice(0, 5).map((e, i) => (
              <div key={i} className="small">第{e.row}行: {e.msg}</div>
            ))}
            {errors.length > 5 && <div className="small text-muted">... 还有{errors.length - 5}个错误</div>}
          </Alert>
        )}

        {preview.length > 0 && (
          <>
            <h6 className="mb-2">预览 (前{preview.length}条)</h6>
            <Table size="sm" bordered responsive style={{ fontSize: 12 }}>
              <thead>
                <tr><th>型号</th><th>系列</th><th>转速</th><th>减速比</th><th>推力</th><th>重量</th><th>价格</th></tr>
              </thead>
              <tbody>
                {preview.map((row, i) => (
                  <tr key={i}>
                    <td><strong>{row.model}</strong></td>
                    <td><Badge bg="info">{row.series}</Badge></td>
                    <td>{row.minSpeed}-{row.maxSpeed}</td>
                    <td>{Array.isArray(row.ratios) ? row.ratios.length + '个' : row.ratios}</td>
                    <td>{row.thrust || '\u2014'}</td>
                    <td>{row.weight || '\u2014'}</td>
                    <td>{row.price ? '\u00A5' + Number(row.price).toLocaleString() : '\u2014'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </>
        )}
      </Card.Body>
    </Card>
  );
};

export default DataImportTool;
