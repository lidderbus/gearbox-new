// src/components/OutlineDrawingQuery/SizeCompareTable.js
// A+ 增强#3：多型号尺寸对比表（最多 4 项），用于投标决策
import React, { useMemo, useState, useCallback } from 'react';
import { Card, Form, Table, Button, Alert, Badge } from 'react-bootstrap';
import { exportSizeCompareCsv } from '../../utils/dwgExporter';

const FIELDS = [
  { key: 'series', label: '系列' },
  { key: 'transferCapacity', label: '传递能力 kW/(r/min)', alt: 'transmissionCapacityPerRatio' },
  { key: 'ratio', label: '减速比', isArr: true },
  { key: 'thrust', label: '推力 kN' },
  { key: 'weight', label: '重量 kg' },
  { key: 'centerDistance', label: '中心距 mm' },
  { key: 'inputSpeedRange', label: '输入转速 r/min', altCompose: ['minSpeed', 'maxSpeed'] }
];

const fieldValue = (model, f) => {
  if (!model) return '';
  let v = model[f.key];
  if ((v === undefined || v === null) && f.alt) v = model[f.alt];
  if ((v === undefined || v === null) && f.altCompose) {
    const [a, b] = f.altCompose;
    if (model[a] !== undefined || model[b] !== undefined) v = `${model[a] ?? '-'} ~ ${model[b] ?? '-'}`;
  }
  if (Array.isArray(v) && f.isArr) v = v.join(' / ');
  if (v === undefined || v === null || v === '') return '-';
  return v;
};

/**
 * 计算数值差异 (相对第一个被选中的型号)
 */
const calcDelta = (rows, fieldKey) => {
  const base = parseFloat(rows[0]);
  if (!Number.isFinite(base) || base === 0) return rows.map(() => null);
  return rows.map((v, i) => {
    if (i === 0) return null;
    const cur = parseFloat(v);
    if (!Number.isFinite(cur)) return null;
    return ((cur - base) / base) * 100;
  });
};

/**
 * @param {Object} props
 * @param {Array<{model:string,...}>} props.allModels  齐套型号库（用于下拉）
 */
const SizeCompareTable = ({ allModels = [] }) => {
  const [picked, setPicked] = useState([]); // model 字符串数组
  const [search, setSearch] = useState('');

  const candidates = useMemo(() => {
    const term = search.trim().toUpperCase();
    if (!term) return allModels.slice(0, 50);
    return allModels.filter((m) => (m.model || '').toUpperCase().includes(term)).slice(0, 50);
  }, [allModels, search]);

  const pickedModels = useMemo(
    () => picked.map((mk) => allModels.find((m) => m.model === mk)).filter(Boolean),
    [picked, allModels]
  );

  const togglePick = useCallback((modelKey) => {
    setPicked((prev) => {
      if (prev.includes(modelKey)) return prev.filter((m) => m !== modelKey);
      if (prev.length >= 4) {
        return [...prev.slice(1), modelKey]; // FIFO
      }
      return [...prev, modelKey];
    });
  }, []);

  const handleExport = useCallback(() => {
    if (pickedModels.length < 2) return;
    exportSizeCompareCsv(pickedModels);
  }, [pickedModels]);

  const handleClear = useCallback(() => setPicked([]), []);

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        <span>
          <i className="bi bi-arrows-angle-expand me-2" aria-hidden="true"></i>
          多型号尺寸对比
          <Badge bg="secondary" className="ms-2">{picked.length}/4</Badge>
        </span>
        <div>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={handleClear}
            disabled={picked.length === 0}
            aria-label="清空对比"
          >
            清空
          </Button>{' '}
          <Button
            size="sm"
            variant="primary"
            onClick={handleExport}
            disabled={pickedModels.length < 2}
            aria-label="导出对比 CSV"
          >
            <i className="bi bi-download me-1" aria-hidden="true"></i>导出 CSV
          </Button>
        </div>
      </Card.Header>
      <Card.Body>
        <Form.Control
          type="text"
          size="sm"
          placeholder="筛选型号 (如: HC400)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="筛选型号"
          className="mb-2"
        />

        {/* 候选列表 */}
        <div style={{ maxHeight: 160, overflowY: 'auto', border: '1px solid #dee2e6', borderRadius: 4, padding: 4 }}>
          {candidates.length === 0 ? (
            <small className="text-muted">无匹配型号</small>
          ) : (
            candidates.map((m) => (
              <Button
                key={m.model}
                size="sm"
                variant={picked.includes(m.model) ? 'primary' : 'outline-secondary'}
                className="me-1 mb-1"
                onClick={() => togglePick(m.model)}
                aria-pressed={picked.includes(m.model)}
              >
                {m.model}
              </Button>
            ))
          )}
        </div>

        {/* 对比表 */}
        {pickedModels.length === 0 ? (
          <Alert variant="info" className="mt-3 mb-0">
            选择至少 2 个型号以查看尺寸对比
          </Alert>
        ) : (
          <div className="table-responsive mt-3">
            <Table size="sm" bordered hover>
              <thead>
                <tr>
                  <th>参数</th>
                  {pickedModels.map((m) => <th key={m.model}>{m.model}</th>)}
                </tr>
              </thead>
              <tbody>
                {FIELDS.map((f) => {
                  const values = pickedModels.map((m) => fieldValue(m, f));
                  const deltas = calcDelta(values, f.key);
                  return (
                    <tr key={f.key}>
                      <td><strong>{f.label}</strong></td>
                      {values.map((v, i) => (
                        <td key={i}>
                          {String(v)}
                          {deltas[i] !== null && (
                            <Badge bg={deltas[i] > 0 ? 'warning' : 'info'} className="ms-1" style={{ fontSize: '10px' }}>
                              {deltas[i] > 0 ? '+' : ''}{deltas[i].toFixed(1)}%
                            </Badge>
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            <small className="text-muted">% 为相对首列基准的差异（仅对数值字段）</small>
          </div>
        )}
      </Card.Body>
    </Card>
  );
};

export default SizeCompareTable;
