// src/components/OutlineDrawingQuery/VersionTimeline.js
// A+ 增强#7：DWG 图纸版本时间线 — 显示当前选中型号 DWG 的更新历史
import React, { useMemo } from 'react';
import { Card, Badge, Alert } from 'react-bootstrap';
import { gearboxDwgDrawings, couplingDwgDrawings } from '../../data/dwgDrawings';

/**
 * 收集某型号在数据库中的全部 DWG 版本（一般 1-2 份），并按 updateDate 倒序
 */
const collectVersions = (model) => {
  if (!model) return [];
  const buckets = [
    ...(gearboxDwgDrawings[model] || []).map((f) => ({ ...f, _type: 'gearbox' })),
    ...(couplingDwgDrawings[model] || []).map((f) => ({ ...f, _type: 'coupling' }))
  ];
  return buckets.sort((a, b) => {
    const ta = Date.parse(a.updateDate || '') || 0;
    const tb = Date.parse(b.updateDate || '') || 0;
    return tb - ta;
  });
};

const VersionTimeline = ({ model }) => {
  const versions = useMemo(() => collectVersions(model), [model]);

  if (!model) {
    return (
      <Alert variant="secondary" className="mb-0">
        请选择型号查看图纸版本时间线
      </Alert>
    );
  }

  if (versions.length === 0) {
    return (
      <Alert variant="warning" className="mb-0">
        <i className="bi bi-exclamation-triangle me-1" aria-hidden="true"></i>
        型号 <strong>{model}</strong> 暂无图纸版本记录
      </Alert>
    );
  }

  return (
    <Card>
      <Card.Header>
        <i className="bi bi-clock-history me-2" aria-hidden="true"></i>
        {model} 图纸版本时间线
        <Badge bg="info" className="ms-2">{versions.length} 个版本</Badge>
      </Card.Header>
      <Card.Body>
        <ol className="list-unstyled mb-0" aria-label="图纸版本时间线">
          {versions.map((v, idx) => (
            <li key={v.id || idx} className="mb-3 d-flex">
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: idx === 0 ? '#28a745' : '#6c757d',
                  marginTop: 6,
                  marginRight: 10,
                  flexShrink: 0
                }}
                aria-hidden="true"
              />
              <div>
                <div>
                  <strong>{v.fileName || `${model}.dwg`}</strong>
                  {idx === 0 && <Badge bg="success" className="ms-2">最新</Badge>}
                </div>
                <small className="text-muted">
                  {v.updateDate || '日期未知'} · {v.fileSize || '大小未知'} · {v.series || '系列未知'}
                </small>
              </div>
            </li>
          ))}
        </ol>
        <small className="text-muted d-block mt-2">
          提示：使用前请下载最新版本，避免按陈旧图纸开模/施工。
        </small>
      </Card.Body>
    </Card>
  );
};

export default VersionTimeline;
