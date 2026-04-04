// src/pages/CouplingSelection/CouplingApplicationScenarios.js
// 联轴器适用场景展示组件

import React, { useMemo } from 'react';
import { Card } from 'react-bootstrap';

const SCENARIOS = [
  { id: 'fishing', icon: '\u{1F6A2}', name: '渔船', desc: '拖网/围网/延绳钓', keywords: ['渔船', '拖网'] },
  { id: 'cargo', icon: '\u{1F6F3}', name: '货船', desc: '散货/集装箱/油轮', keywords: ['货船', '散货'] },
  { id: 'passenger', icon: '\u26F4', name: '客船', desc: '客运/游轮/渡轮', keywords: ['客船', '游轮'] },
  { id: 'tug', icon: '\u{1F6A4}', name: '拖轮', desc: '港口拖轮/海洋拖轮', keywords: ['拖轮', '拖船'] },
  { id: 'engineering', icon: '\u2693', name: '工程船', desc: '起重/挖泥/铺管', keywords: ['工程船', '挖泥'] },
  { id: 'yacht', icon: '\u{1F6E5}', name: '游艇', desc: '私人游艇/公务艇', keywords: ['游艇', '快艇'] },
  { id: 'generator', icon: '\u26A1', name: '发电机组', desc: '船用/陆用发电', keywords: ['发电', '发电机'] },
  { id: 'pump', icon: '\u{1F4A7}', name: '泵组', desc: '水泵/油泵驱动', keywords: ['泵', '水泵'] }
];

const CouplingApplicationScenarios = ({ selectedCoupling, selectionResult }) => {
  const applicableScenarios = useMemo(() => {
    if (!selectedCoupling) return {};
    const torque = selectedCoupling.torque || 0;
    const model = selectedCoupling.model || '';
    const result = {};

    SCENARIOS.forEach(s => {
      let applicable = false;
      if (torque >= 10) {
        applicable = ['fishing', 'cargo', 'passenger', 'tug', 'engineering', 'generator', 'pump'].includes(s.id);
      } else if (torque >= 5) {
        applicable = ['fishing', 'cargo', 'passenger', 'tug', 'yacht', 'generator', 'pump'].includes(s.id);
      } else {
        applicable = ['fishing', 'yacht', 'generator', 'pump', 'passenger'].includes(s.id);
      }
      if (model.startsWith('HGT') && ['fishing', 'cargo', 'tug'].includes(s.id)) {
        applicable = true;
      }
      result[s.id] = applicable;
    });
    return result;
  }, [selectedCoupling]);

  if (!selectedCoupling) return null;

  return (
    <Card className="shadow-sm mb-3">
      <Card.Header style={{ backgroundColor: '#e8f5e9' }}>
        <i className="bi bi-bullseye me-2"></i>
        <strong>适用场景</strong>
      </Card.Header>
      <Card.Body className="py-2">
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {SCENARIOS.map(s => {
            const isApplicable = applicableScenarios[s.id];
            return (
              <div
                key={s.id}
                style={{
                  width: 80,
                  textAlign: 'center',
                  padding: '8px 4px',
                  borderRadius: 8,
                  border: isApplicable ? '2px solid #4caf50' : '2px solid #e0e0e0',
                  backgroundColor: isApplicable ? '#e8f5e9' : '#fafafa',
                  opacity: isApplicable ? 1 : 0.5,
                  transition: 'all 0.2s'
                }}
              >
                <div style={{ fontSize: 24 }}>{s.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600 }}>{s.name}</div>
                {isApplicable && <span style={{ fontSize: 10, color: '#4caf50' }}>&#x2713;</span>}
              </div>
            );
          })}
        </div>
        <div className="text-center mt-2" style={{ fontSize: '0.75rem', color: '#888' }}>
          绿色边框表示该联轴器推荐用于此场景
        </div>
      </Card.Body>
    </Card>
  );
};

export default CouplingApplicationScenarios;
