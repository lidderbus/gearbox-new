// CopilotRulesChips — Phase 3 规则溯源 UI
// 消费 result._diagnostics: 把触发的 Copilot 9 硬约束 + 推断结果 + 直接型号 + 评分模式
// 以彩色 chip 形式展示给销售, 用一眼可见的标签告诉用户"系统应用了哪些专家规则"

import React from 'react';
import { Badge } from 'react-bootstrap';

const RULE_LABELS = {
  'R-PROP-INFER': { label: '推断桨型', color: '#0d6efd', icon: 'magic' },
  'R-PROP-CPP': { label: 'CPP→GC/DT', color: '#198754', icon: 'shield-check' },
  'R-PROP-FPP': { label: 'FPP 排除 GC/DT', color: '#198754', icon: 'shield-check' },
  'R-TWIN-2GWH': { label: '双机并车 2GWH', color: '#dc3545', icon: 'arrow-left-right' },
  'R-GEAR-DUAL-SPEED': { label: '双速 DT', color: '#fd7e14', icon: 'speedometer2' },
  'R-GEAR-HIGH-SPEED': { label: '高速 HCG/HCAG/HCQ/HCM', color: '#fd7e14', icon: 'speedometer' },
  'R-THRUST-MIN': { label: '推力下限', color: '#6f42c1', icon: 'arrow-up-circle' },
  'R-CERT-MATCH': { label: '船级社强匹配', color: '#0dcaf0', icon: 'patch-check' },
  'R-DIRECT-MODEL': { label: '直接型号查询', color: '#e91e63', icon: 'crosshair' },
};

const CopilotRulesChips = ({ diagnostics }) => {
  if (!diagnostics) return null;
  const {
    appliedRules = [],
    inferredPropellerType = null,
    isDirectModelHit = false,
    scoringProfile = null,
    copilotExclusions = null,
  } = diagnostics;

  const hasAnyChip =
    (appliedRules && appliedRules.length > 0) ||
    inferredPropellerType ||
    isDirectModelHit ||
    scoringProfile;

  if (!hasAnyChip) return null;

  const exclusionTotal = copilotExclusions
    ? Object.values(copilotExclusions).reduce((a, b) => a + (b || 0), 0)
    : 0;

  return (
    <div
      className="mb-3 p-2"
      style={{
        background: 'linear-gradient(90deg, #f0f7ff 0%, #fafbff 100%)',
        border: '1px solid #cfe2ff',
        borderRadius: 6,
        fontSize: '0.85rem',
      }}
      aria-label="Copilot 规则溯源"
    >
      <div className="d-flex flex-wrap align-items-center gap-2">
        <span style={{ color: '#0a58ca', fontWeight: 600, marginRight: 4 }}>
          <i className="bi bi-info-circle me-1" />Copilot 规则溯源:
        </span>

        {scoringProfile && (
          <Badge bg="secondary" style={{ fontWeight: 500 }}>
            评分模式: {scoringProfile === 'copilot' ? 'Copilot' : scoringProfile === 'copilot-strict' ? 'Copilot 严格' : 'Legacy'}
          </Badge>
        )}

        {isDirectModelHit && (
          <Badge style={{ background: RULE_LABELS['R-DIRECT-MODEL'].color, fontWeight: 500 }}>
            <i className={`bi bi-${RULE_LABELS['R-DIRECT-MODEL'].icon} me-1`} />
            直接型号 fast path
          </Badge>
        )}

        {inferredPropellerType && (
          <Badge bg="primary" style={{ fontWeight: 500 }}>
            <i className="bi bi-magic me-1" />
            推断桨型: {inferredPropellerType}
          </Badge>
        )}

        {(appliedRules || [])
          .filter(rid => rid !== 'R-DIRECT-MODEL' && rid !== 'R-PROP-INFER')
          .map(rid => {
            const meta = RULE_LABELS[rid];
            if (!meta) return null;
            return (
              <Badge
                key={rid}
                style={{ background: meta.color, fontWeight: 500 }}
                title={rid}
              >
                <i className={`bi bi-${meta.icon} me-1`} />
                {meta.label}
              </Badge>
            );
          })}

        {exclusionTotal > 0 && (
          <span
            style={{ color: '#6c757d', fontSize: '0.78rem', marginLeft: 'auto' }}
            title={JSON.stringify(copilotExclusions)}
          >
            <i className="bi bi-funnel me-1" />
            硬约束已排除 {exclusionTotal} 型号
          </span>
        )}
      </div>
    </div>
  );
};

export default CopilotRulesChips;
