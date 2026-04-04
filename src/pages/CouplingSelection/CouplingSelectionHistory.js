// src/pages/CouplingSelection/CouplingSelectionHistory.js
// 联轴器选型历史记录组件

import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Button, ListGroup, Badge } from 'react-bootstrap';

const HISTORY_KEY = 'coupling_selection_history';
const MAX_HISTORY = 20;

/**
 * 保存选型历史记录
 */
export const saveSelectionHistory = (params, result) => {
  if (!params || !result || !result.success) return;

  try {
    const history = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
    const record = {
      timestamp: new Date().toISOString(),
      params: {
        power: params.power,
        speed: params.speed,
        gearbox: params.gearboxModel || '-',
        workCondition: params.workCondition || 'III类',
        temperature: params.temperature || 30,
        workFactorMode: params.workFactorMode || 'FACTORY'
      },
      result: {
        kFactor: result.calculationDetails?.kFactor,
        stFactor: result.calculationDetails?.stFactor,
        requiredTorque: result.requiredCouplingTorque,
        recommendedModel: result.recommendations?.[0]?.model || '-',
        score: result.recommendations?.[0]?.score
      }
    };

    // 去重：同功率+转速+齿轮箱不重复
    const isDuplicate = history.some(h =>
      h.params.power === record.params.power &&
      h.params.speed === record.params.speed &&
      h.params.gearbox === record.params.gearbox
    );
    if (isDuplicate) return;

    history.unshift(record);
    if (history.length > MAX_HISTORY) history.length = MAX_HISTORY;
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch (e) {
    console.warn('保存选型历史失败:', e);
  }
};

const CouplingSelectionHistory = ({ onLoadHistory }) => {
  const [show, setShow] = useState(false);
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(() => {
    try {
      const data = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
      setHistory(data);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    if (show) loadHistory();
  }, [show, loadHistory]);

  const handleLoad = (record) => {
    if (onLoadHistory) {
      onLoadHistory({
        power: record.params.power,
        speed: record.params.speed,
        gearboxModel: record.params.gearbox === '-' ? '' : record.params.gearbox,
        workCondition: record.params.workCondition,
        temperature: record.params.temperature,
        workFactorMode: record.params.workFactorMode
      });
    }
    setShow(false);
  };

  const handleClear = () => {
    if (window.confirm('确定清空所有选型历史记录？')) {
      localStorage.removeItem(HISTORY_KEY);
      setHistory([]);
    }
  };

  const formatTime = (iso) => {
    try {
      const d = new Date(iso);
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;
    } catch {
      return '-';
    }
  };

  return (
    <>
      <Button variant="outline-secondary" size="sm" onClick={() => setShow(true)}>
        <i className="bi bi-clock-history me-1"></i>
        历史记录
      </Button>

      <Modal show={show} onHide={() => setShow(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#e3f2fd' }}>
          <Modal.Title>
            <i className="bi bi-clock-history me-2"></i>
            选型历史记录
            <Badge bg="secondary" className="ms-2">{history.length}</Badge>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: 400, overflowY: 'auto' }}>
          {history.length === 0 ? (
            <div className="text-center text-muted py-4">
              <i className="bi bi-inbox" style={{ fontSize: 32 }}></i>
              <div className="mt-2">暂无选型历史</div>
            </div>
          ) : (
            <ListGroup variant="flush">
              {history.map((record, idx) => (
                <ListGroup.Item
                  key={idx}
                  className="d-flex justify-content-between align-items-center"
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleLoad(record)}
                  action
                >
                  <div>
                    <div className="fw-bold" style={{ fontSize: '0.9rem' }}>
                      <Badge bg="primary" className="me-2">{record.result.recommendedModel}</Badge>
                      {record.params.power}kW / {record.params.speed}rpm
                      {record.params.gearbox !== '-' && (
                        <span className="text-muted ms-2">({record.params.gearbox})</span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>
                      {record.params.workCondition} |
                      K={record.result.kFactor?.toFixed(2)} |
                      需{record.result.requiredTorque?.toFixed(2)} kN·m |
                      评分 {record.result.score}
                    </div>
                  </div>
                  <div className="text-end">
                    <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{formatTime(record.timestamp)}</div>
                    <Button variant="outline-primary" size="sm" className="mt-1" onClick={(e) => { e.stopPropagation(); handleLoad(record); }}>
                      加载
                    </Button>
                  </div>
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <Button variant="outline-danger" size="sm" onClick={handleClear} disabled={history.length === 0}>
            <i className="bi bi-trash me-1"></i>清空历史
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setShow(false)}>关闭</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CouplingSelectionHistory;
